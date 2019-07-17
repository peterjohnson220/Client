import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { orderBy } from 'lodash';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDashboardsActions from '../../actions/dashboards.actions';
import { Workbook } from '../../models';

@Component({
  selector: 'pf-search-workbook-modal',
  templateUrl: './search-workbook-modal.component.html',
  styleUrls: ['./search-workbook-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchWorkbookModalComponent implements OnInit, OnDestroy {
  @ViewChild('searchWorkbookModal', { static: true }) public searchWorkbookModal: any;
  filteredWorkbooks: Workbook[];
  allWorkbooks: Workbook[];
  searchValue: string;
  noSearchResults = false;

  companyWorkbooks$: Observable<AsyncStateObj<Workbook[]>>;
  standardWorkbooks$: Observable<AsyncStateObj<Workbook[]>>;

  allWorkbooksSub: Subscription;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private modalService: NgbModal
  ) {
    this.companyWorkbooks$ = this.store.pipe(select(fromDataInsightsMainReducer.getCompanyWorkbooksAsync));
    this.standardWorkbooks$ = this.store.pipe(select(fromDataInsightsMainReducer.getStandardWorkbooksAsync));
  }

  ngOnInit() {
    this.allWorkbooksSub = combineLatest(
      this.standardWorkbooks$,
      this.companyWorkbooks$,
      (standardWorkbooksAsync, companyWorkbooksAsync) =>
        ({standardWorkbooksAsync, companyWorkbooksAsync})
    ).pipe(
      map((data) => {
        if (!data.standardWorkbooksAsync.obj || !data.companyWorkbooksAsync.obj) {
          return [];
        }
        return data.standardWorkbooksAsync.obj.concat(data.companyWorkbooksAsync.obj);
      })
    ).subscribe((workbooks: Workbook[]) => {
      if (!workbooks) {
        return;
      }
      this.allWorkbooks = workbooks;
      this.handleSearchValueChanged(this.searchValue);
    });
  }

  ngOnDestroy() {
    this.allWorkbooksSub.unsubscribe();
    this.close();
  }

  trackByFn(index: any, workbook: Workbook) {
    return workbook.WorkbookId ;
  }

  open(): void {
    this.modalService.open(this.searchWorkbookModal, { backdrop: 'static', windowClass: 'search-modal' });
  }

  close(): void {
    this.modalService.dismissAll();
    this.searchValue = '';
    this.filteredWorkbooks = [];
  }

  handleSearchValueChanged(value: string) {
    if (!this.allWorkbooks) {
      return;
    }
    if (!this.searchValue) {
      this.filteredWorkbooks = [];
      this.noSearchResults = false;
      return;
    }
    const orderedWorkbooks = orderBy(this.allWorkbooks, ['WorkbookName'], 'asc');
    this.filteredWorkbooks = orderedWorkbooks
      .filter((w: Workbook) => w.WorkbookName.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);
    this.noSearchResults = this.filteredWorkbooks.length === 0;
  }

  handleOpenViewsClicked(workbook: Workbook) {
    if (!workbook.Views || workbook.Views.loadingError) {
      this.store.dispatch(new fromDashboardsActions.GetCompanyWorkbookViews({workbookId: workbook.WorkbookId}));
    }
  }
}
