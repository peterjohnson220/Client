import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { TicketComponent } from './ticket.component';
import * as fromTicketReducer from '../../reducers';
import * as fromTicketActions from '../../actions/ticket.actions';
import { generateMockUserTicketTabItem } from '../../models/user-ticket-tab-item.model';

describe('Admin - Tickets - Ticket', () => {
  let instance: TicketComponent;
  let fixture: ComponentFixture<TicketComponent>;
  let store: Store<fromTicketReducer.State>;

  const mockUserTicketTabItem = generateMockUserTicketTabItem();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          ticketsAdminMain: combineReducers(fromTicketReducer.reducers),
        })
      ],
      declarations: [ TicketComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TicketComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
  });

  it('should dispatch InitializeTicket action upon init. Containing the ticketId assigned to the component', () => {
    spyOn(store, 'dispatch');

    jest.useFakeTimers();

    instance.ticketId = mockUserTicketTabItem.UserTicketId;
    instance.ngOnInit();

    jest.runAllTimers();

    fixture.detectChanges();

    const expectedLoadTicketAction = new fromTicketActions.InitializeTicketTab(mockUserTicketTabItem.UserTicketId);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedLoadTicketAction);
  });
});
