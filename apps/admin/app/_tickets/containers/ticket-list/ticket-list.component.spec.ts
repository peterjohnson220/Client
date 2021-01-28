import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { PfCommonModule } from 'libs/core';

import { TicketListComponent } from './ticket-list.component';
import * as fromTicketReducer from '../../reducers';
import * as fromTicketListActions from '../../actions/ticket-list.actions';
import * as fromTicketList from '../../actions/ticket.actions';

import { generateMockUserTicketGridItem, UserTicketGridItem, UserTicketTabItem } from '../../models';


describe('Admin - Tickets - Ticket List', () => {
  let instance: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;
  let store: Store<fromTicketReducer.State>;
  const queryStringParams = { 'company_name': 'PayFactors' };
  const length = 1;
  const mockUserTicketGridItem = generateMockUserTicketGridItem();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          admin_tickets: combineReducers(fromTicketReducer.reducers),
        }),
        PfCommonModule,
        NgbDropdownModule
      ],
      declarations: [TicketListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{
        provide: ActivatedRoute ,
        useValue: { snapshot: { queryParamMap: { get: (key) =>  queryStringParams[key], keys: { length: length } } }
        }
      }]
    });

    fixture = TestBed.createComponent(TicketListComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
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
