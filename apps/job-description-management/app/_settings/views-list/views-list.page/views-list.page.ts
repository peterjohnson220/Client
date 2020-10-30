import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

import { AsyncStateObj } from 'libs/models/state';
import { SimpleYesNoModalComponent } from 'libs/ui/common';
import { SimpleYesNoModalOptions } from 'libs/models/common';
import { FilterArrayByName } from 'libs/core/pipes';

import * as fromViewEditActions from '../../view-edit/actions/view-edit.actions';
import * as fromViewsListActions from '../actions/views-list.actions';
import * as fromUpsertViewModalActions from '../actions/upsert-view-modal.actions';
import * as fromViewsListReducer from '../reducers';
import { JdmSettingsHelper } from '../../shared/helpers';
import { ViewListGridItem } from '../../shared/models/view-list-grid-item';

@Component({
  selector: 'pf-views-list-page',
  templateUrl: './views-list.page.html',
  styleUrls: ['./views-list.page.scss']
})
export class ViewsListPageComponent implements OnDestroy, OnInit {
  @ViewChild(SimpleYesNoModalComponent, { static: true }) public deleteViewConfirmationModal: SimpleYesNoModalComponent;

  viewsListAsyncObj$: Observable<AsyncStateObj<ViewListGridItem[]>>;
  viewsListAsyncObjSubscription: Subscription;
  viewsListAsyncObj: AsyncStateObj<ViewListGridItem[]>;

  addView = true;
  deleteViewModalOptions: SimpleYesNoModalOptions = {
    Title: 'Delete View',
    Body: '',
    ConfirmText: 'Yes',
    CancelText: 'No',
    IsDelete: true
  };

  isSystemView = JdmSettingsHelper.isSystemView;

  gridView: GridDataResult;
  gridData: ViewListGridItem[] = [];
  sort: SortDescriptor[] = [{
    field: 'ViewName',
    dir: 'desc'
  }];
  searchValue: string;
  templateData = [];

  constructor(
    public arrayFilter: FilterArrayByName,
    private store: Store<fromViewsListReducer.State>,
    private router: Router,
    private route: ActivatedRoute) {
    this.viewsListAsyncObj$ = this.store.pipe(select(fromViewsListReducer.getViewsListAsyncObj));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromViewsListActions.LoadJobDescriptionSettingsViews());

    this.viewsListAsyncObjSubscription = this.viewsListAsyncObj$.subscribe((viewsList) => {
      this.viewsListAsyncObj = viewsList;
      this.gridData = viewsList.obj;
      this.applySort();
      this.refreshGridDataResult();

      this.templateData = viewsList.obj.map(v => v.Templates).reduce((acc, item) => [...acc, ...item], []);
    });

  }

  ngOnDestroy(): void {
    this.viewsListAsyncObjSubscription.unsubscribe();
  }

  handleSearchValueChanged(value: string) {
    this.gridView.data = value === '' ? this.gridData : this.arrayFilter.transform(this.gridView.data, value, 'ViewName');
  }

  handleViewDeleteConfirmed(viewName: string) {
    this.store.dispatch(new fromViewsListActions.DeleteView({viewName}));
  }

  handleViewClicked(viewName: string) {
    this.store.dispatch(new fromViewEditActions.EditView({viewName}));
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  handleDeleteViewClicked(viewName: string, event: MouseEvent) {
    event.stopPropagation();

    if (this.isSystemView(viewName)) {
      return;
    }

    this.deleteViewModalOptions.Body = `You are about to delete the <strong>${viewName}</strong> view. This cannot be undone. Would you like to continue?`;
    this.deleteViewConfirmationModal.open(viewName);
  }

  handleTemplateChanged(event) {
    this.gridView.data = event?.TemplateId ? this.filterViewsByTemplateId(event.TemplateId) : this.gridData;
  }

  filterViewsByTemplateId(templateId) {
    const views = this.gridView.data.filter(view => {
      if (view.Templates.find(t => t.TemplateId === templateId)) {
        return view;
      }
    });

    return views;
  }

  openUpsertViewModal(addView: boolean, viewName: string, event: MouseEvent) {
    event.stopPropagation();
    this.addView = addView;
    this.store.dispatch(new fromUpsertViewModalActions.LoadAvailableTemplates());
    if (!addView) {
      this.store.dispatch(new fromUpsertViewModalActions.LoadJobDescriptionViews({ viewName: viewName }));
      this.store.dispatch(new fromUpsertViewModalActions.SetEditingViewName({ editingViewName: viewName }));
    }
    this.store.dispatch(new fromUpsertViewModalActions.OpenUpsertViewModal());
  }

  gridSelectionChange(selection) {
      if (selection.selectedRows && selection.selectedRows.length) {
          const viewName = selection.selectedRows[0].dataItem.ViewName;
          this.store.dispatch(new fromViewEditActions.EditView({viewName}));
          this.router.navigate(['edit'], { relativeTo: this.route });
      }
  }

  sortChange($event: SortDescriptor[]) {
    this.sort = $event;
    this.applySort();
    this.refreshGridDataResult();
  }

  private applySort() {
    this.gridData = orderBy(this.gridData, this.sort);
  }

  private refreshGridDataResult() {
    this.gridView = {
      data: this.gridData,
      total: this.gridData.length
    };
  }
}
