import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum, AsyncStateObj } from 'libs/models';
import { Permissions } from 'libs/constants';
import { Entity } from 'libs/features/formula-editor';

import * as fromSharedMainReducer from '../../../_shared/reducers';
import * as fromBaseDataViewModalActions from '../../../_shared/actions/base-data-view-modal.actions';


import * as fromDashboardsActions from '../../actions/dashboards.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { DashboardView } from '../../models';
import { CreateDataViewModalComponent } from '../create-data-view-modal';

@Component({
  selector: 'pf-dashboards-header',
  templateUrl: './dashboards-header.component.html',
  styleUrls: ['./dashboards-header.component.scss']
})
export class DashboardsHeaderComponent implements OnInit, OnDestroy {
  @Input() hasFavorites: boolean;
  @Input() title: string;
  @Input() dashboardViews: string[];
  @Input() selectedDashboardView: DashboardView;
  @Input() tagsEnabled: boolean;

  @Output() selectedDashboardViewChanged: EventEmitter<DashboardView> = new EventEmitter<DashboardView>();

  baseEntitiesAsync$: Observable<AsyncStateObj<Entity[]>>;
  distinctTagsByView$: Observable<string[]>;
  tags$: Observable<string[]>;
  tagFilter$: Observable<string>;
  reportBuilderSettingEnabled$: Observable<boolean>;
  savingDataViewSuccess$: Observable<boolean>;

  reportBuilderSettingEnabledSub: Subscription;
  savingDataViewSuccessSubscription: Subscription;
  permissions = Permissions;

  @ViewChild(CreateDataViewModalComponent) public createDataViewModal: CreateDataViewModalComponent;
  reportBuilderSettingEnabled: boolean;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private settingsService: SettingsService
  ) {
    this.baseEntitiesAsync$ = this.store.pipe(select(fromSharedMainReducer.getBaseEntitiesAsync));
    this.distinctTagsByView$ = this.store.pipe(select(fromDataInsightsMainReducer.getDistinctTagsByView));
    this.tags$ = this.store.pipe(select(fromDataInsightsMainReducer.getDistinctTags));
    this.tagFilter$ = this.store.pipe(select(fromDataInsightsMainReducer.getTagFilter));
    this.reportBuilderSettingEnabled$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.DataInsightsReportBuilder
    );
    this.savingDataViewSuccess$ = this.store.pipe(select(fromDataInsightsMainReducer.getSaveUserReportSuccess));
  }

  ngOnInit(): void {
    this.reportBuilderSettingEnabledSub = this.reportBuilderSettingEnabled$.subscribe(settingEnabled => {
      this.reportBuilderSettingEnabled = settingEnabled;
      if (settingEnabled) {
        this.store.dispatch(new fromBaseDataViewModalActions.GetBaseEntities());
      }
    });
    this.savingDataViewSuccessSubscription = this.savingDataViewSuccess$.subscribe(succeeded => {
      if (succeeded && !!this.createDataViewModal) {
        this.createDataViewModal.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.reportBuilderSettingEnabledSub.unsubscribe();
    this.savingDataViewSuccessSubscription.unsubscribe();
  }

  handleViewChanged(view: DashboardView) {
    this.selectedDashboardViewChanged.emit(view);
  }

  handleTagChanged(tag: string) {
    this.store.dispatch(new fromDashboardsActions.SetTaggedFilter(tag));
  }

  handleNewReportClicked() {
    this.createDataViewModal.open();
  }

}
