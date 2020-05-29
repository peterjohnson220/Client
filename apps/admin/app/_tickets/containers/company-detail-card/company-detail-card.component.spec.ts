import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { CompanyDetailCardComponent } from './company-detail-card.component';
import * as fromTicketReducer from '../../reducers';

import { generateMockCompanyDetail } from '../../models';

describe('Admin - Tickets - Company Detail Card', () => {
  let instance: CompanyDetailCardComponent;
  let fixture: ComponentFixture<CompanyDetailCardComponent>;
  let store: Store<fromTicketReducer.State>;

  const mockTicketDetailItem = generateMockCompanyDetail();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          ticketsAdminMain: combineReducers(fromTicketReducer.reducers),
        })
      ],
      declarations: [ CompanyDetailCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CompanyDetailCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
  });

  it('Should display details about a company', () => {
    instance.companyDetail = mockTicketDetailItem;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
