import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDashboardsActions from '../../actions/dashboards.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { DashboardView, Workbook, SaveWorkbookTagObj } from '../../models';
import { TagWorkbookModalComponent } from '../../components/tag-workbook-modal';

@Component({
  selector: 'pf-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit, OnDestroy {
  @ViewChild(TagWorkbookModalComponent, { static: true }) public tagWorkbookModalComponent: TagWorkbookModalComponent;

  companyWorkbooksAsync$: Observable<AsyncStateObj<Workbook[]>>;
  filteredCompanyWorkbooks$: Observable<Workbook[]>;
  dashboardView$: Observable<string>;
  tags$: Observable<string[]>;
  savingTag$: Observable<boolean>;
  savingTagError$: Observable<boolean>;

  filteredCompanyWorkbooksSub: Subscription;
  dragulaSub: Subscription;
  savingTagsSub: Subscription;
  filteredCompanyWorkbooks: Workbook[];
  dashboardViews: Array<string> = ['All Dashboards', 'Favorites'];
  selectedWorkbook: Workbook;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private dragulaService: DragulaService
  ) {
    this.dragulaSub = new Subscription();
    this.dragulaSub.add(this.dragulaService.dropModel('workbooks').subscribe(({ sourceModel }) => {
      this.handleDropModel(sourceModel);
    }));
    this.companyWorkbooksAsync$ = this.store.pipe(select(fromDataInsightsMainReducer.getCompanyWorkbooksAsync));
    this.filteredCompanyWorkbooks$ = this.store.pipe(select(fromDataInsightsMainReducer.getFilteredCompanyWorkbooks));
    this.dashboardView$ = this.store.pipe(select(fromDataInsightsMainReducer.getDashboardView));
    this.tags$ = this.store.pipe(select(fromDataInsightsMainReducer.getDistinctTags));
    this.savingTag$ = this.store.pipe(select(fromDataInsightsMainReducer.getSavingTag));
    this.savingTagError$ = this.store.pipe(select(fromDataInsightsMainReducer.getSavingTagError));
  }

  get anyFavorites() {
    return !!this.filteredCompanyWorkbooks && this.filteredCompanyWorkbooks.some(r => r.IsFavorite);
  }

  ngOnInit() {
    this.filteredCompanyWorkbooksSub = this.filteredCompanyWorkbooks$.subscribe(cw => this.filteredCompanyWorkbooks = cw);
    this.savingTagsSub = this.savingTag$.subscribe(st => {
      if (!st) {
        this.tagWorkbookModalComponent.close();
      }
    });

    this.store.dispatch(new fromDashboardsActions.GetCompanyWorkbooks());
    this.store.dispatch(new fromDashboardsActions.GetDashboardView());
  }

  ngOnDestroy() {
    this.filteredCompanyWorkbooksSub.unsubscribe();
    this.dragulaSub.unsubscribe();
  }

  trackByFn(index: any, workbook: Workbook) {
    return workbook.WorkbookId ;
  }

  handleFavoriteClicked(workbook: Workbook) {
    if (workbook.IsFavorite) {
      this.store.dispatch(new fromDashboardsActions.RemoveWorkbookFavorite({ workbookId: workbook.WorkbookId }));
    } else {
      this.store.dispatch(new fromDashboardsActions.AddWorkbookFavorite({ workbookId: workbook.WorkbookId }));
    }
  }

  handleViewChanged(view: DashboardView) {
    this.store.dispatch(new fromDashboardsActions.ToggleDashboardView({ view }));
  }

  handleTagWorkbookClicked(workbook: Workbook) {
    this.selectedWorkbook = workbook;
    this.tagWorkbookModalComponent.open();
  }

  handleOpenViewsClicked(workbook: Workbook) {
    if (!workbook.Views || workbook.Views.loadingError) {
      this.store.dispatch(new fromDashboardsActions.GetCompanyWorkbookViews({workbookId: workbook.WorkbookId}));
    }
  }

  handleSaveTagClicked(saveObj: SaveWorkbookTagObj) {
    this.store.dispatch(new fromDashboardsActions.SaveWorkbookTag(saveObj));
  }

  private handleDropModel(sourceModel) {
    if (!sourceModel) {
      return;
    }
    const workbookIds = sourceModel.map((x: Workbook) => x.WorkbookId);
    this.store.dispatch(new fromDashboardsActions.SaveWorkbookOrder({ workbookIds }));
  }
}
