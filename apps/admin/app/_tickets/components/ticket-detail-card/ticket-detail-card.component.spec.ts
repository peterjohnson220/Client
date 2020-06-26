import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';
import { QuillModule } from 'ngx-quill';

import * as fromRootState from 'libs/state/state';

import {TicketDetailCardComponent} from './ticket-detail-card.component';
import * as fromTicketReducer from '../../reducers';

import {generateMockTicketDetail} from '../../models';

describe('Admin - Tickets - Ticket Detail Card', () => {
  let instance: TicketDetailCardComponent;
  let fixture: ComponentFixture<TicketDetailCardComponent>;
  let store: Store<fromTicketReducer.State>;

  const mockTicketDetailItem = generateMockTicketDetail();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          ticketsAdminMain: combineReducers(fromTicketReducer.reducers),
        }),
        QuillModule.forRoot()
      ],
      declarations: [ TicketDetailCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TicketDetailCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
  });

  it('Should display details about a ticket', () => {
    instance.ticketDetail = mockTicketDetailItem;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
