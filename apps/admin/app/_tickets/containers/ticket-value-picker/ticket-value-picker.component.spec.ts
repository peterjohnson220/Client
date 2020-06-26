import {NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';
import {FilterService} from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';

import { TicketValuePickerComponent } from './ticket-value-picker.component';
import * as fromTicketActions from '../../actions/ticket.actions';
import * as fromTicketReducer from '../../reducers';
import { TicketFieldType } from '../../constants/tickets-constants';
import { generateMockUserTicketState } from '../../models';
import { GenericKeyValue } from 'libs/models';

describe('Admin - Tickets - Ticket Value Picker', () => {
  let component: TicketValuePickerComponent;
  let fixture: ComponentFixture<TicketValuePickerComponent>;
  let store: Store<fromTicketReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketValuePickerComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [FilterService],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        StoreModule.forFeature('admin_tickets', fromTicketReducer.reducers)
      ]
    })
    .compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(TicketValuePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should dispatch update ticket action when a field value is changed', () => {
    const spy = spyOn(store, 'dispatch');

    component.pickerType = TicketFieldType.STATUS;
    component.ticketId = 1;

    const mockTicketState = generateMockUserTicketState();
    const mockChanges: GenericKeyValue<string, string>[] = [{Key: 'UserTicketState', Value: mockTicketState.UserTicketState}];
    const expectedAction = new fromTicketActions.UpdateTicket({userTicketId: 1, updateFields: mockChanges});

    component.comboValueChanged(mockTicketState);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });

  it('should not dispatch update ticket action if picker type doesnt exist', () => {
    const spy = spyOn(store, 'dispatch');

    component.pickerType = TicketFieldType.CREATED;

    const mockTicketState = generateMockUserTicketState();

    component.comboValueChanged(mockTicketState);
    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
  });
});
