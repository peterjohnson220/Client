import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { orderBy } from 'lodash';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDashboardsActions from '../../actions/dashboards.actions';
import { ReportType, SearchResult, View, Workbook } from '../../models';

@Component({
  selector: 'pf-search-workbook-modal',
  templateUrl: './search-workbook-modal.component.html',
  styleUrls: ['./search-workbook-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchWorkbookModalComponent implements OnInit, OnDestroy {
  @Input() thumbnailsViewSettingEnabled: boolean;

  @ViewChild('searchWorkbookModal', { static: true }) public searchWorkbookModal: any;
  searchResults: SearchResult[];
  allWorkbooks: Workbook[];
  searchValue: string;
  noSearchResults = false;

  companyWorkbooks$: Observable<AsyncStateObj<Workbook[]>>;
  companyWorkbooksFromViews$: Observable<AsyncStateObj<Workbook[]>>;
  standardWorkbooks$: Observable<AsyncStateObj<Workbook[]>>;
  allViewsLoaded$: Observable<AsyncStateObj<boolean>>;

  allWorkbooksSub: Subscription;
  allViewsLoadedSub: Subscription;

  allViewsLoaded: boolean;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private modalService: NgbModal
  ) {
    this.companyWorkbooks$ = this.store.pipe(select(fromDataInsightsMainReducer.getCompanyWorkbooksAsync));
    this.companyWorkbooksFromViews$ = this.store.pipe(select(fromDataInsightsMainReducer.getCompanyWorkbooksAsyncFromViews));
    this.standardWorkbooks$ = this.store.pipe(select(fromDataInsightsMainReducer.getStandardWorkbooksAsync));
    this.allViewsLoaded$ = this.store.pipe(select(fromDataInsightsMainReducer.getAllViewsLoadedAsync));
  }

  ngOnInit() {
    this.allWorkbooksSub = combineLatest(
      this.standardWorkbooks$,
      this.companyWorkbooks$,
      this.companyWorkbooksFromViews$,
      (standardWorkbooksAsync, companyWorkbooksAsync, companyWorkbooksAsyncFromViews) =>
        ({standardWorkbooksAsync, companyWorkbooksAsync, companyWorkbooksAsyncFromViews})
    ).pipe(
      map((data) => {
        if (!!data.standardWorkbooksAsync.obj && (!!data.companyWorkbooksAsync.obj || !!data.companyWorkbooksAsyncFromViews.obj)) {
          return this.thumbnailsViewSettingEnabled
            ? data.standardWorkbooksAsync.obj.concat(data.companyWorkbooksAsyncFromViews.obj)
            : data.standardWorkbooksAsync.obj.concat(data.companyWorkbooksAsync.obj);
        }
        return [];
      })
    ).subscribe((workbooks: Workbook[]) => {
      if (!workbooks) {
        return;
      }
      this.allWorkbooks = workbooks;
      this.handleSearchValueChanged(this.searchValue);
    });

    this.allViewsLoadedSub = this.allViewsLoaded$.subscribe(l => {
      this.allViewsLoaded = l.obj;
    });
  }

  ngOnDestroy() {
    this.allWorkbooksSub.unsubscribe();
    this.allViewsLoadedSub.unsubscribe();
    this.close();
  }

  trackByFn(index: any, searchResult: SearchResult) {
    return searchResult.Id;
  }

  open(): void {
    if (!this.allViewsLoaded) {
      this.store.dispatch(new fromDashboardsActions.GetAllCompanyWorkbookViews());
    }
    this.modalService.open(this.searchWorkbookModal, { backdrop: 'static', windowClass: 'search-modal' });
  }

  close(): void {
    this.modalService.dismissAll();
    this.searchValue = '';
    this.searchResults = [];
    this.noSearchResults = false;
  }

  handleSearchValueChanged(value: string) {
    if (!this.allWorkbooks) {
      return;
    }
    if (!this.searchValue) {
      this.searchResults = [];
      this.noSearchResults = false;
      return;
    }

    const results = this.getMatchingResults(value);
    this.searchResults = orderBy(results, ['WorkbookName', (x: SearchResult) => !x.IsWorkbook, 'ViewName'], 'asc').slice(0, 10);
    this.noSearchResults = this.searchResults.length === 0;
  }

  private getMatchingResults(searchTerm: string): SearchResult[] {
    const results: SearchResult[] = [];
    this.allWorkbooks.forEach(workbook => {
      if (workbook.WorkbookName.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          WorkbookName: workbook.WorkbookName,
          IsWorkbook: true,
          Type: workbook.Type,
          Url: this.getWorkbookUrl(workbook),
          Id: workbook.WorkbookId
        });
      }
      if (workbook.Views && workbook.Views.obj) {
        workbook.Views.obj.forEach(view => {
          if (view.ViewName.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              WorkbookName: workbook.WorkbookName,
              ViewName: view.ViewName,
              IsWorkbook: false,
              Type: workbook.Type,
              Url: this.getViewUrl(view, workbook),
              Id: `${workbook.WorkbookId}_${view.ViewId}`
            });
          }
        });
      }
    });
    return results;
  }
  private getWorkbookUrl(workbook: Workbook): string {
    return workbook.Type === ReportType.TableauReport ? `${workbook.SourceUrl}/${workbook.WorkbookId}` : `/custom-report/${workbook.WorkbookId}`;
  }

  private getViewUrl(view: View, workbook: Workbook): string {
    if (this.thumbnailsViewSettingEnabled) {
      return `${workbook.SourceUrl}/${workbook.ContentUrl}/${view.ContentUrl}`;
    }
    return `${workbook.SourceUrl}/${view.ContentUrl}`;
  }
}
