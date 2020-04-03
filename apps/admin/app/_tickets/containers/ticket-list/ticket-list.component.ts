import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { GridDataResult, PageChangeEvent, SortSettings } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { orderBy, cloneDeep } from 'lodash';

import { UserTicketSearchRequest } from 'libs/models/payfactors-api/service/request';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';
import {KendoGridFilterHelper} from 'libs/core/helpers';

import { TicketFieldType } from '../../constants/tickets-constants';
import { SearchRequestFilterMapper, PickerHelper } from '../../helpers';
import { TicketListFilterComponent } from '../filters/ticket-list-filter';
import { TicketListDateRangeFilterComponent } from '../filters/ticket-list-date-range-filter';
import * as fromTicketListActions from '../../actions/ticket-list.actions';
import * as fromTicketActions from '../../actions/ticket.actions';
import * as fromTicketSharedActions from '../../actions/ticket-shared.actions';
import * as fromTicketReducer from '../../reducers';

import { PfServicesRep, UserTicketState, UserTicketTabItem, UserTicketType } from '../../models';

@Component({
  selector: 'pf-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent  implements OnInit, OnDestroy {
  @ViewChild('serviceUserFilter', { static: false }) serviceUserFilterComponent: TicketListFilterComponent;
  @ViewChild('createDateRangeFilter', { static: false }) serviceDateRangeFilterComponent: TicketListDateRangeFilterComponent;
  gridView: GridDataResult = { data: [], total: 0 };
  defaultDateRange = { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() };
  sortable: SortSettings = {
    allowUnsort: false,
    mode: 'single'
  };
  state: State = {
    skip: 0,
    take: 25,
    filter: {
      logic: 'and',
      filters: [{
        value: 'Open',
        field: 'Status',
        operator: 'contains'
      },
        {
          field: 'Created',
          value: this.defaultDateRange,
          operator: 'contains'
        }
      ]
    },
    sort: [{
      field: 'Id',
      dir: 'desc'
    }],
  };
  pageSizes = [10, 25, 50, 100];

  userContext$: Observable<UserContext>;
  userContext: UserContext;

  private selectedTicket: UserTicketTabItem;
  public defaultPfServiceRep: number;
  public defaultPfCompanyName: string;

  pfServiceReps: PfServicesRep[] = [];
  userTicketStates: UserTicketState[] = [];
  userTicketStatesFilter: UserTicketState[] = [];
  userTicketTypes: UserTicketType[] = [];
  public ticketFieldType = TicketFieldType;
  public pickerHelper = new PickerHelper();

  initSuccess$: Observable<boolean>;
  ticketListLoading$: Observable<boolean>;
  ticketListLoadingError$: Observable<boolean>;
  pfServicesReps$: Observable<PfServicesRep[]>;
  userTicketStates$: Observable<UserTicketState[]>;
  userTicketTypes$: Observable<UserTicketType[]>;
  dirty$: Observable<boolean>;
  dirtySubscription: Subscription;
  initSuccessSubscription: Subscription;
  ticketListItemsSubscription: Subscription;
  private unsubscribe$ = new Subject();
  selectedTicketTab$: Observable<number>;
  selectedTicketsTabSubscription: Subscription;

  isDirty = false;
  ticketsTab: number;

  constructor(private store: Store<fromTicketReducer.State>,
    private rootStore: Store<fromRootState.State>,
    private route: ActivatedRoute) {
    this.ticketListLoading$ = this.store.select(fromTicketReducer.getTicketListLoading);
    this.ticketListLoadingError$ = this.store.select(fromTicketReducer.getTicketListLoadingError);
    this.dirty$ = this.store.select(fromTicketReducer.getDirtyGridState);
    this.initSuccess$ = this.store.select(fromTicketReducer.getGridInitSuccess);
    this.pfServicesReps$ = this.store.select(fromTicketReducer.getPfServiceReps);
    this.userTicketStates$ = this.store.select(fromTicketReducer.getUserTicketStates);
    this.userTicketTypes$ = this.store.select(fromTicketReducer.getUserTicketTypes);
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
    this.selectedTicketTab$ = this.store.select(fromTicketReducer.getSelectedTabTicket);
    this.initSubscriptions();
  }

  initSubscriptions() {
    this.selectedTicketsTabSubscription = this.selectedTicketTab$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      this.ticketsTab = v === null ? 0 : v;
    });
    this.dirtySubscription = this.dirty$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      this.isDirty = v;
      if (this.ticketsTab === 0) {
        this.checkForRefresh();
      }
    });
    this.ticketListItemsSubscription = this.store.select(fromTicketReducer.getTickets)
      .pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
        if (v != null) {
          this.gridView = {
            data: v.data,
            total: v.total
          };
        }
      });
    this.initSuccessSubscription = this.store.select(fromTicketReducer.getGridInitSuccess)
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(v => v)
      ).subscribe(v => {
        this.initFilter();
        this.store.dispatch(new fromTicketListActions.LoadTickets(this.prepareFilter()));
      });
    this.userContext$
      .pipe(
        filter(uc => !!uc),
        take(1),
        takeUntil(this.unsubscribe$)
      ).subscribe(uc => {
        this.userContext = uc;
      });
    this.pfServicesReps$
      .pipe(
        filter(v => v && v.length > 0),
        takeUntil(this.unsubscribe$)
      ).subscribe(v => {
        this.pfServiceReps = orderBy(v, ['Name'], 'asc');
      });
    this.userTicketStates$
      .pipe(
        filter(v => v && v.length > 0),
        takeUntil(this.unsubscribe$)
      ).subscribe(v => {
        this.userTicketStates = v;
        this.userTicketStatesFilter = cloneDeep(v);
        this.userTicketStatesFilter.unshift({ UserTicketStateId: 0, UserTicketState: 'Open' });
      });

    this.userTicketTypes$
      .pipe(
        filter(v => v && v.length > 0),
        takeUntil(this.unsubscribe$)
      ).subscribe(v => {
        this.userTicketTypes = v;
      });
  }

  initFilter() {
    const queryParam = this.route.snapshot.queryParamMap;
    // check if current id exists within service reps
    const u = this.pfServiceReps.find(r => r.PfServicesRepId === this.userContext.UserId);
    if (u && queryParam.keys.length === 0) {
      this.defaultPfServiceRep = u.PfServicesRepId;
      this.serviceUserFilterComponent.modifyFilter(u.PfServicesRepId);
      this.state.filter.filters.push({field: this.ticketFieldType.SERVICEUSER, value: this.defaultPfServiceRep, operator: 'contains'});
    }
    if (queryParam.keys.length > 0) {
      KendoGridFilterHelper.updateFilter('Created', null, this.state);
      this.serviceDateRangeFilterComponent.clearValue();
      this.state.filter.filters.push({field: this.ticketFieldType.COMPANYIDNAME, value: queryParam.get('company_name'), operator: 'contains'});
    }
  }

  prepareFilter(): UserTicketSearchRequest {
    return SearchRequestFilterMapper.mapGridStateToUserTicketSearchRequest
      (this.state.filter, this.state.skip, this.state.take, this.state.sort[0].field, this.state.sort[0].dir);
  }

  handleTicketGridReload() {
    this.store.dispatch(new fromTicketListActions.LoadTickets(this.prepareFilter()));
  }

  handleCellClick(dataItem: any): void {
    this.selectedTicket = {
      UserTicketId: dataItem.Id,
      Title: dataItem.Description
    };
    this.store.dispatch(new fromTicketActions.OpenTicket(this.selectedTicket));
  }

  ngOnInit() {
    this.store.dispatch(new fromTicketListActions.InitTickets());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  checkForRefresh() {
    if (this.isDirty) {
      this.cleanGrid();
      this.handleTicketGridReload();
    }
  }

  cleanGrid() {
    this.gridView = { data: [], total: 0 };
  }

  sortChange(sort: SortDescriptor[]): void {
    this.state.sort = sort;
    this.state.skip = 0;
    this.store.dispatch(new fromTicketListActions.LoadTickets(this.prepareFilter()));
  }


  pageChange(e: PageChangeEvent): void {
    this.state.skip = e.skip;
    this.state.take = e.take;
    this.store.dispatch(new fromTicketListActions.LoadTickets(this.prepareFilter()));
  }

  filterChanged(f) {
    this.state.skip = 0;

    if (f) {this.state.filter = f; }
    this.store.dispatch(new fromTicketListActions.LoadTickets(this.prepareFilter()));
  }

  getSelectedUserState(value: string): UserTicketState {
    return this.userTicketStates.find(f => f.UserTicketState === value);
  }

  getSelectedUserType(value: string): UserTicketType {
    return this.userTicketTypes.find(f => f.TicketTypeDisplayName === value);
  }

  getSelectedServiceUser(value: string): PfServicesRep {
    return this.pfServiceReps.find(f => f.Name === value);
  }

  openUserDetail(ticketId: number, OpenedUserId: number) {

    this.store.dispatch(new fromTicketSharedActions.UserDetailOpen(true));
    this.store.dispatch(new fromTicketSharedActions.GetUserDetail(OpenedUserId, ticketId));
  }
}
