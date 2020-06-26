import { FileApiService } from 'libs/data/payfactors-api/file';
import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';
import { UserApiService } from 'libs/data/payfactors-api/user';
import * as fromRootState from 'libs/state/state';
import { of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromTicketReducer from '../../reducers';
import { TicketFieldsComponent } from './ticket-fields.component';
import {
  generateMockPfServicesRep, generateMockUserTicketItem, generateMockUserTicketState, generateMockUserTicketType
} from '../../models';

describe('Admin - Tickets - Ticket - TicketFields', () => {
  let instance: TicketFieldsComponent;
  let fixture: ComponentFixture<TicketFieldsComponent>;
  let store: Store<fromTicketReducer.State>;

  const mockUserTicketItem = generateMockUserTicketItem();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          ticketsAdminMain: combineReducers(fromTicketReducer.reducers),
        })
      ],
      declarations: [ TicketFieldsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [ UserApiService, PayfactorsApiService, FileApiService ]
    });

    fixture = TestBed.createComponent(TicketFieldsComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should call getPfServiceRepsByCompany upon init.  pfServiceReps should contain API result', () => {
    spyOn(store, 'dispatch');
    spyOn(UserApiService.prototype, 'getPfServiceRepsByCompany')
      .and.returnValue(of([generateMockPfServicesRep()]));

    jest.useFakeTimers();

    instance.ticket = mockUserTicketItem.TicketDetail;
    instance.userTicketStates$ = of([generateMockUserTicketState()]);
    instance.userTicketTypes$ = of([generateMockUserTicketType()]);
    instance.ngOnInit();
    instance.ngOnChanges( {
      ticket: new SimpleChange(null, mockUserTicketItem.TicketDetail, false)
    });

    jest.runAllTimers();

    fixture.detectChanges();

    expect(instance.pfServicesReps.length).toBe(1);
  });
});
