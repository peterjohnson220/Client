import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { AsyncStateObj } from 'libs/models/state';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

import * as fromDashboardsActions from '../../actions/dashboards.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { Workbook, SaveWorkbookTagObj, ReportType, DashboardView } from '../../models';
import { TagWorkbookModalComponent } from '../../components/tag-workbook-modal';
import { DashboardsHeaderHelper } from '../../helpers';

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
  dashboardViewSetting$: Observable<string>;
  selectedDashboardView$: Observable<DashboardView>;

  filteredCompanyWorkbooksSub: Subscription;
  dragulaSub: Subscription;
  tagWorkbookModalOpenSub: Subscription;
  dashboardViewSettingSubscription: Subscription;

  filteredCompanyWorkbooks: Workbook[];
  reportTypes = ReportType;
  dashboardViews: Array<string> = ['All Dashboards', 'Favorites'];

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private dragulaService: DragulaService,
    private settingsService: SettingsService
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
    this.dashboardViewSetting$ = this.settingsService.selectUiPersistenceSetting<string>(
      FeatureAreaConstants.DataInsights, UiPersistenceSettingConstants.DashboardView, 'string'
    );
    this.selectedDashboardView$ = this.store.select(fromDataInsightsMainReducer.getDashboardView);
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
    this.dashboardViewSettingSubscription = this.dashboardViewSetting$.subscribe(value => this.handleDashboardViewSettingChanged(value));
  }

  get anyFavorites() {
    return !!this.filteredCompanyWorkbooks && this.filteredCompanyWorkbooks.some(r => r.IsFavorite);
  }

  ngOnDestroy() {
    this.filteredCompanyWorkbooksSub.unsubscribe();
    this.dragulaSub.unsubscribe();
    this.tagWorkbookModalOpenSub.unsubscribe();
    this.dashboardViewSettingSubscription.unsubscribe();
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

  handleSelectedDashboardViewChanged(view: DashboardView): void {
    this.store.dispatch(new fromDashboardsActions.ToggleDashboardView({ view }));
  }

  handleDashboardViewSettingChanged(value: string): void {
    if (!!value && !!value.length) {
      const dashboardView: DashboardView = DashboardsHeaderHelper.getDashboardViewByValue(value) || DashboardView.All;
      this.store.dispatch(new fromDashboardsActions.SetDashboardView(dashboardView));
    }
  }

  private handleDropModel(sourceModel) {
    if (!sourceModel) {
      return;
    }
    const workbookIds = sourceModel.map((x: Workbook) => x.WorkbookId);
    this.store.dispatch(new fromDashboardsActions.SaveWorkbookOrder({ workbookIds }));
  }
}
