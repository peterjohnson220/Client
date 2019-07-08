import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import { Store } from '@ngrx/store';
import {Observable, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';

import * as fromTicketListActions from '../../actions/ticket-list.actions';
import * as fromTicketActions from '../../actions/ticket.actions';
import * as fromTicketReducer from '../../reducers';
import { UserTicketGridItem, UserTicketTabItem } from '../../models';

@Component({
  selector: 'pf-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketListComponent implements OnInit, OnDestroy {
  gridView: GridDataResult;
  pageSizes = [10, 25, 100];
  pageSize = 100;
  skip = 0;

  private selectedTicket: UserTicketTabItem;
  ticketListLoading$: Observable<boolean>;
  ticketListLoadingError$: Observable<boolean>;
  ticketListItems: UserTicketGridItem[] = [];
  dirty$: Observable<boolean>;
  dirtySubscription: Subscription;
  ticketListItemsSubscription: Subscription;
  private unsubscribe$ = new Subject();

  isDirty = false;
  sort: SortDescriptor[] = [{
    field: 'Id',
    dir: 'desc'
  }];

  constructor(private store: Store<fromTicketReducer.State>) {
    this.ticketListLoading$ = this.store.select(fromTicketReducer.getTicketListLoading);
    this.ticketListLoadingError$ = this.store.select(fromTicketReducer.getTicketListLoadingError);
    this.dirty$ = this.store.select(fromTicketReducer.getDirtyGridState);

    this.dirtySubscription = this.dirty$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      this.isDirty = v;
    });
    this.ticketListItemsSubscription = this.store.select(fromTicketReducer.getTickets)
      .pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
        this.ticketListItems = v;
        this.loadTickets();
      });
  }

  handleTicketGridReload() {
    this.store.dispatch(new fromTicketListActions.LoadTickets({'UserTicket_State': 'New', 'Company_ID': 13}));
  }

  handleCellClick(dataItem: any): void {
    const ut: UserTicketTabItem = {
      UserTicketId: dataItem.Id,
      Title: dataItem.Description
    };

    this.selectedTicket = ut;
    this.store.dispatch(new fromTicketActions.OpenTicket(this.selectedTicket));
  }

  ngOnInit() {
    this.store.dispatch(new fromTicketListActions.LoadTickets({'UserTicket_State': 'New', 'Company_ID': 13}));
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
    this.sort = sort;
    this.store.dispatch(new fromTicketListActions.SortTickets(this.sort[0]));
  }

  private loadTickets(): void {
    this.gridView = {
      data: this.ticketListItems.slice(this.skip, this.skip + this.pageSize),
      total: this.ticketListItems.length
    };
  }

  pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.loadTickets();
  }
}
