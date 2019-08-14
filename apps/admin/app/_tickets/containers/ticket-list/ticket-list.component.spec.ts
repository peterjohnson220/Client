import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { TicketListComponent } from './ticket-list.component';
import * as fromTicketReducer from '../../reducers';
import * as fromTicketLookupActions from '../../actions/ticket-lookup.actions';
import * as fromTicketListActions from '../../actions/ticket-list.actions';
import * as fromTicketList from '../../actions/ticket.actions';

import { generateMockUserTicketGridItem, UserTicketGridItem, UserTicketTabItem } from '../../models';


describe('Admin - Tickets - Ticket List', () => {
  let instance: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;
  let store: Store<fromTicketReducer.State>;

  const mockUserTicketGridItem = generateMockUserTicketGridItem();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          ticketsAdminMain: combineReducers(fromTicketReducer.reducers),
        })
      ],
      declarations: [TicketListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(TicketListComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
  });

  it('should dispatch a InitTickets action upon init', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromTicketListActions.InitTickets();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an OpenTicket action when handleCellClick is triggered', () => {
    spyOn(store, 'dispatch');

    const userTicketGridItem: UserTicketGridItem = mockUserTicketGridItem;
    const mockUserTicketTabItem: UserTicketTabItem = { UserTicketId: userTicketGridItem.Id, Title: userTicketGridItem.Description };
    const expectedAction = new fromTicketList.OpenTicket(mockUserTicketTabItem);

    instance.handleCellClick(userTicketGridItem);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
