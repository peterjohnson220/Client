import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromRootState from 'libs/state/state';
import { AsyncStateObj } from 'libs/models/state';
import { UserContext } from 'libs/models/security';

import { ServicePageConfig, SupportTeamUser } from '../models';

import * as fromServicePageActions from '../actions/service-page.actions';
import * as fromServicePageReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Component({
  selector: 'pf-service-page',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss']
})
export class ServicePageComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('statusColumn') statusColumn: ElementRef;
  @ViewChild('summaryColumn') summaryColumn: ElementRef;
  @ViewChild('ticketType') ticketType: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) public gridGlobalActionsTemplate: ElementRef;

  ticketTypes$: Observable<string[]>;
  supportTeam$: Observable<AsyncStateObj<SupportTeamUser[]>>;
  identity$: Observable<UserContext>;
  selectedTicketId$: Observable<number>;
  fieldsFilterCount$: Observable<number>;

  gridFieldSubscription: Subscription;
  gridDataSubscription: Subscription;
  identitySubscription: Subscription;
  urlParamsSubscription: Subscription;

  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'UserTickets_Create_Date'
  }];
  inboundFilters: PfDataGridFilter[];
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  pageViewId = ServicePageConfig.ServicePageViewId;
  colTemplates = {};
  filterTemplates = {};
  ticketTypeField: ViewField;
  selectedTicketTypeFilterValue: string;
  avatarUrl: string;
  userId: number;
  ticketId: number;
  applyInitialSelection: boolean;

  constructor(
    private store: Store<fromServicePageReducer.State>,
    private userContextStore: Store<fromRootState.State>,
    private route: ActivatedRoute
  ) {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      AllowSaveFilter: true,
      ShowFilterChooser: true
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
    this.ticketTypes$ = this.store.pipe(select(fromServicePageReducer.getTicketTypeNames));
    this.supportTeam$ = this.store.pipe(select(fromServicePageReducer.getSupportTeam));
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.selectedTicketId$ = this.store.select(fromPfDataGridReducer.getSelectedRecordId, ServicePageConfig.ServicePageViewId);
    this.fieldsFilterCount$ = this.store.select(fromPfDataGridReducer.getFieldsFilterCount, ServicePageConfig.ServicePageViewId);
  }

  ngOnInit(): void {
    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.ticketTypeField = fields.find(f => f.SourceName === 'TicketType_Display');
        this.selectedTicketTypeFilterValue = this.ticketTypeField?.FilterValues?.length > 0 ? this.ticketTypeField.FilterValues[0] : 'All';

        if (this.applyInitialSelection) {
          const ticketIdField = fields.find(f => f.SourceName === 'UserTicket_ID');

          if (!ticketIdField.FilterValues.find(val === this.ticketId.toString())) {
            this.store.dispatch(new fromPfDataGridActions.UpdateInboundFilters(ServicePageConfig.ServicePageViewId, [{
              SourceName: 'UserTicket_ID',
              Operator: '=',
              Values: [this.ticketId.toString()]
            }]));
          }
        }
      }
    });

    this.gridDataSubscription = this.store.select(fromPfDataGridReducer.getData, this.pageViewId).subscribe(data => {
      if (this.applyInitialSelection && data) {
        if (data.total === 1) {
          this.store.dispatch(new fromPfDataGridActions.UpdateSelectedRecordId(ServicePageConfig.ServicePageViewId, this.ticketId, '='));
          this.applyInitialSelection = false;
        }
        if (data.total === 0) { // Filtering on value passed returned no results, stop trying to apply selection
          this.applyInitialSelection = false;
        }
      }
    });

    this.identitySubscription = this.identity$.subscribe(i => {
      if (!!i) {
        this.avatarUrl = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
        this.createInboundFilters(i);
      }
    });

    this.urlParamsSubscription = this.route.params.subscribe(params => {
      if (params['ticketId']) {
        this.ticketId = +params['ticketId'];
        this.applyInitialSelection = true;
      }
    });

    this.store.dispatch(new fromServicePageActions.LoadTicketTypes());
    this.store.dispatch(new fromServicePageActions.GetTicketStates());
    this.store.dispatch(new fromServicePageActions.LoadSupportTeam());
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      'UserTicket_State': { Template: this.statusColumn },
      'Summary': { Template: this.summaryColumn }
    };
    this.filterTemplates = {
      'TicketType_Display': { Template: this.ticketType }
    };
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
  }

  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.gridDataSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
    this.urlParamsSubscription.unsubscribe();
  }

  handleTicketTypeFilterChanged(value: string) {
    const field: ViewField = cloneDeep(this.ticketTypeField);
    field.FilterValues = value !== 'All' ? [value] : null;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  updateField(field: ViewField) {
    if (!!field.FilterValues) {
      this.store.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  addNewTicket() {
    this.store.dispatch(new fromServicePageActions.ShowNewTicketModal(true));
  }

  togglePublicOrPrivateSwitch(payload: { value: boolean, ticketId: number }) {
    this.store.dispatch(new fromServicePageActions.TogglePublicOrPrivateUserTicket(payload));
  }

  private createInboundFilters(userContext: UserContext): void {
    if (!userContext) {
      return;
    }
    this.userId = userContext.UserId;
    this.inboundFilters = [
      {
        SourceName: 'User_ID',
        Operator: '=',
        Values: userContext.UserId ? [userContext.UserId.toString()] : null,
        ExcludeFromFilterSave: true
      }
    ];
  }
}
