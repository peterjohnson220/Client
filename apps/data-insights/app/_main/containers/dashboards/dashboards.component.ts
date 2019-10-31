import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDashboardsActions from '../../actions/dashboards.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { Workbook, SaveWorkbookTagObj, ReportType } from '../../models';
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
  tags$: Observable<string[]>;
  savingTag$: Observable<boolean>;
  savingTagError$: Observable<boolean>;
  tagWorkbookModalOpen$: Observable<boolean>;
  activeWorkbook$: Observable<Workbook>;

  filteredCompanyWorkbooksSub: Subscription;
  dragulaSub: Subscription;
  tagWorkbookModalOpenSub: Subscription;

  filteredCompanyWorkbooks: Workbook[];
  reportTypes = ReportType;

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
    this.tags$ = this.store.pipe(select(fromDataInsightsMainReducer.getDistinctTags));
    this.savingTag$ = this.store.pipe(select(fromDataInsightsMainReducer.getSavingTag));
    this.savingTagError$ = this.store.pipe(select(fromDataInsightsMainReducer.getSavingTagError));
    this.tagWorkbookModalOpen$ = this.store.pipe(select(fromDataInsightsMainReducer.getTagWorkbookModalOpen));
    this.activeWorkbook$ = this.store.pipe(select(fromDataInsightsMainReducer.getActiveWorkbook));
  }

  ngOnInit() {
    this.filteredCompanyWorkbooksSub = this.filteredCompanyWorkbooks$.subscribe(cw => this.filteredCompanyWorkbooks = cw);
    this.tagWorkbookModalOpenSub = this.tagWorkbookModalOpen$.subscribe(open => {
      if (open) {
        this.tagWorkbookModalComponent.open();
      } else {
        this.tagWorkbookModalComponent.close();
      }
    });
  }

  get anyFavorites() {
    return !!this.filteredCompanyWorkbooks && this.filteredCompanyWorkbooks.some(r => r.IsFavorite);
  }

  ngOnDestroy() {
    this.filteredCompanyWorkbooksSub.unsubscribe();
    this.dragulaSub.unsubscribe();
    this.tagWorkbookModalOpenSub.unsubscribe();
  }

  trackByFn(index: any, workbook: Workbook) {
    return workbook.WorkbookId;
  }

  handleSaveTagClicked(saveObj: SaveWorkbookTagObj) {
    this.store.dispatch(new fromDashboardsActions.SaveWorkbookTag(saveObj));
  }

  handleTagModalClosed(): void {
    this.store.dispatch(new fromDashboardsActions.CloseTagWorkbookModal());
  }

  private handleDropModel(sourceModel) {
    if (!sourceModel) {
      return;
    }
    const workbookIds = sourceModel.map((x: Workbook) => x.WorkbookId);
    this.store.dispatch(new fromDashboardsActions.SaveWorkbookOrder({ workbookIds }));
  }
}
