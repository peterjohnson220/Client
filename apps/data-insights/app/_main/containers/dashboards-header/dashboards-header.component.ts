import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models/state';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models';

import * as fromDataViewActions from '../../actions/data-view.actions';
import * as fromDashboardsActions from '../../actions/dashboards.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { DashboardView, Entity, SaveUserWorkbookModalData } from '../../models';
import { SaveUserWorkbookModalComponent } from '../../components';

@Component({
  selector: 'pf-dashboards-header',
  templateUrl: './dashboards-header.component.html',
  styleUrls: ['./dashboards-header.component.scss']
})
export class DashboardsHeaderComponent implements OnInit, OnDestroy {
  @Input() thumbnailsViewEnabled: boolean;
  @Input() hasFavorites: boolean;

  dashboardView$: Observable<string>;
  distinctTagsByView$: Observable<string[]>;
  tags$: Observable<string[]>;
  tagFilter$: Observable<string>;
  reportBuilderSettingEnabled$: Observable<boolean>;
  baseEntitiesAsync$: Observable<AsyncStateObj<Entity[]>>;
  savingUserDataView$: Observable<boolean>;
  savingUserDataViewConflict$: Observable<boolean>;
  savingUserDataViewError$: Observable<boolean>;

  reportBuilderSettingEnabledSub: Subscription;

  @ViewChild(SaveUserWorkbookModalComponent, { static: false }) public saveUserWorkbookModalComponent: SaveUserWorkbookModalComponent;
  dashboardViews: Array<string> = ['All Dashboards', 'Favorites'];
  reportBuilderSettingEnabled: boolean;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private settingsService: SettingsService
  ) {
    this.dashboardView$ = this.store.pipe(select(fromDataInsightsMainReducer.getDashboardView));
    this.distinctTagsByView$ = this.store.pipe(select(fromDataInsightsMainReducer.getDistinctTagsByView));
    this.tags$ = this.store.pipe(select(fromDataInsightsMainReducer.getDistinctTags));
    this.tagFilter$ = this.store.pipe(select(fromDataInsightsMainReducer.getTagFilter));
    this.baseEntitiesAsync$ = this.store.pipe(select(fromDataInsightsMainReducer.getBaseEntitiesAsync));
    this.savingUserDataView$ = this.store.pipe(select(fromDataInsightsMainReducer.getSavingUserReport));
    this.savingUserDataViewError$ = this.store.pipe(select(fromDataInsightsMainReducer.getSaveUserReportError));
    this.savingUserDataViewConflict$ = this.store.pipe(select(fromDataInsightsMainReducer.getSaveUserReportConflict));
    this.reportBuilderSettingEnabled$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.DataInsightsReportBuilder
    );
  }

  ngOnInit(): void {
    this.reportBuilderSettingEnabledSub = this.reportBuilderSettingEnabled$.subscribe(settingEnabled => {
      this.reportBuilderSettingEnabled = settingEnabled;
      if (settingEnabled) {
        this.store.dispatch(new fromDataViewActions.GetBaseEntities());
      }
    });
    this.store.dispatch(new fromDashboardsActions.GetDashboardView());
  }

  ngOnDestroy(): void {
    this.reportBuilderSettingEnabledSub.unsubscribe();
  }

  handleViewChanged(view: DashboardView) {
    this.store.dispatch(new fromDashboardsActions.ToggleDashboardView({ view }));
  }

  handleTagChanged(tag: string) {
    this.store.dispatch(new fromDashboardsActions.SetTaggedFilter(tag));
  }

  handleNewReportClicked() {
    this.saveUserWorkbookModalComponent.open();
  }

  handleSaveUserDataViewClicked(saveUserDataViewModalData: SaveUserWorkbookModalData) {
    this.store.dispatch(new fromDataViewActions.SaveUserReport(saveUserDataViewModalData));
  }
}
