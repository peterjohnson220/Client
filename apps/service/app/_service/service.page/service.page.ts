import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import { ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromRootState from 'libs/state/state';
import { AsyncStateObj } from 'libs/models/state';
import { UserContext } from 'libs/models/security';

import { ServicePageConfig } from '../models';
import { SupportTeamUser } from '../models';

import * as fromServicePageActions from '../actions/service-page.actions';
import * as fromServicePageReducer from '../reducers';

@Component({
  selector: 'pf-service-page',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss']
})
export class ServicePageComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('statusColumn', { static: false }) statusColumn: ElementRef;
  @ViewChild('ticketType', { static: false }) ticketType: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) public gridGlobalActionsTemplate: ElementRef;

  ticketTypes$: Observable<string[]>;
  supportTeam$: Observable<AsyncStateObj<SupportTeamUser[]>>;
  identity$: Observable<UserContext>;

  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'UserTickets_Create_Date'
  }];
  actionBarConfig: ActionBarConfig;
  pageViewId = ServicePageConfig.ServicePageViewId;
  colTemplates = {};
  filterTemplates = {};
  ticketTypeField: ViewField;
  selectedTicketTypeFilterValue: string;
  avatarUrl: string;

  gridFieldSubscription: Subscription;
  identitySubscription: Subscription;

  constructor(
    private store: Store<fromServicePageReducer.State>,
    private userContextStore: Store<fromRootState.State>
  ) {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      AllowSaveFilter: false,
      ShowFilterChooser: true
    };
    this.ticketTypes$ = this.store.pipe(select(fromServicePageReducer.getTicketTypeNames));
    this.supportTeam$ = this.store.pipe(select(fromServicePageReducer.getSupportTeam));
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
  }

  ngOnInit(): void {
    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.ticketTypeField = fields.find(f => f.SourceName === 'TicketType_Display');
        this.selectedTicketTypeFilterValue = this.ticketTypeField.FilterValue;
      }
    });
    this.identitySubscription = this.identity$.subscribe(i => {
      if (!!i) {
        this.avatarUrl = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
      }
    });
    this.store.dispatch(new fromServicePageActions.LoadTicketTypes());
    this.store.dispatch(new fromServicePageActions.GetTicketStates());
    this.store.dispatch(new fromServicePageActions.LoadSupportTeam());
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      'UserTicket_State': { Template: this.statusColumn }
    };
    this.filterTemplates = {
      'TicketType_Display': { Template: this.ticketType }
    };
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
  }

  handleTicketTypeFilterChanged(value: string) {
    const field = cloneDeep(this.ticketTypeField);
    field.FilterValue = value !== 'All' ? value : null;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  updateField(field: ViewField) {
    if (field.FilterValue) {
      this.store.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
  }

  addNewTicket() {
    this.store.dispatch(new fromServicePageActions.ShowNewTicketModal(true));
  }
}
