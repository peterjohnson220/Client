import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { GridDataResult, PageChangeEvent, SortSettings } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor, State } from '@progress/kendo-data-query';

import { UserTicketSearchRequest } from 'libs/models/payfactors-api/service/request';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import { TicketFieldType } from '../../constants/tickets-constants';
import { SearchRequestFilterMapper, SVGLocationParse } from '../../helpers';
import { TicketListFilterComponent } from '../filters/ticket-list-filter';
import * as fromTicketListActions from '../../actions/ticket-list.actions';
import * as fromTicketActions from '../../actions/ticket.actions';
import * as fromTicketReducer from '../../reducers';

import { PfServicesRep, UserTicketGridItem, UserTicketState, UserTicketTabItem, UserTicketType } from '../../models';


@Component({
  selector: 'pf-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketListComponent implements OnInit, OnDestroy {
  @ViewChild('serviceUserFilter', { static: false }) serviceUserFilterComponent: TicketListFilterComponent;
  @ViewChild('ticketStateFilter', { static: false }) ticketStateFilterComponent: TicketListFilterComponent;
  gridView: GridDataResult;
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
        value: 'New',
        field: 'Status',
        operator: 'contains'
      }]
    },
    sort: [{
      field: 'Id',
      dir: 'desc'
    }],
  };
  pageSizes = [10, 25];

  userContext$: Observable<UserContext>;
  userContext: UserContext;

  private selectedTicket: UserTicketTabItem;
  public defaultPfServiceRep: number;
  public defaultUserTicketState = 'New';
  pfServiceReps: PfServicesRep[] = [];
  userTicketStates: UserTicketState[] = [];
  userTicketTypes: UserTicketType[] = [];
  ticketListItems: UserTicketGridItem[] = [];
  public ticketFieldType = TicketFieldType;
  public svgParse = SVGLocationParse;

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

  isDirty = false;

  constructor(private store: Store<fromTicketReducer.State>,
    private rootStore: Store<fromRootState.State>) {
    this.ticketListLoading$ = this.store.select(fromTicketReducer.getTicketListLoading);
    this.ticketListLoadingError$ = this.store.select(fromTicketReducer.getTicketListLoadingError);
    this.dirty$ = this.store.select(fromTicketReducer.getDirtyGridState);
    this.initSuccess$ = this.store.select(fromTicketReducer.getGridInitSuccess);
    this.pfServicesReps$ = this.store.select(fromTicketReducer.getPfServiceReps);
    this.userTicketStates$ = this.store.select(fromTicketReducer.getUserTicketStates);
    this.userTicketTypes$ = this.store.select(fromTicketReducer.getUserTicketTypes);
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);

    this.initSubscriptions();
  }

  initSubscriptions() {
    this.dirtySubscription = this.dirty$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      this.isDirty = v;
    });
    this.ticketListItemsSubscription = this.store.select(fromTicketReducer.getTickets)
      .pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
        this.ticketListItems = v;
        this.loadTickets();
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
        this.pfServiceReps = v;
      });
    this.userTicketStates$
      .pipe(
        filter(v => v && v.length > 0),
        takeUntil(this.unsubscribe$)
      ).subscribe(v => {
        this.userTicketStates = v;
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
    // check if current id exists within service reps
    const u = this.pfServiceReps.find(r => r.PfServicesRepId === this.userContext.UserId);
    if (u) {
      this.defaultPfServiceRep = u.PfServicesRepId;
      this.serviceUserFilterComponent.modifyFilter(u.PfServicesRepId);
    }
  }

  prepareFilter(): UserTicketSearchRequest {
    return SearchRequestFilterMapper.mapCompositeFilterDescriptorToUserTicketSearchRequest(this.state.filter);
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
      this.handleTicketGridReload();
    }
  }
  sortChange(sort: SortDescriptor[]): void {
    this.state.sort = sort;
    this.store.dispatch(new fromTicketListActions.SortTickets(this.state.sort[0]));
  }

  private loadTickets(): void {
    this.gridView = {
      data: this.ticketListItems.slice(this.state.skip, this.state.skip + this.state.take),
      total: this.ticketListItems.length
    };
  }

  pageChange(e: PageChangeEvent): void {
    this.state.skip = e.skip;
    this.state.take = e.take;
    this.loadTickets();
  }

  filterChanged() {
    this.state.skip = 0;
    this.store.dispatch(new fromTicketListActions.LoadTickets(this.prepareFilter()));
  }
}
