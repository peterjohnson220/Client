import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {combineReducers, Store, StoreModule} from '@ngrx/store';
import { MomentModule } from 'ngx-moment';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { CompanyNotesModalComponent } from 'libs/features/company/company-notes/containers/company-notes-modal';

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
        }),
        MomentModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModalModule,
      ],
      declarations: [ CompanyDetailCardComponent, CompanyNotesModalComponent ],
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
