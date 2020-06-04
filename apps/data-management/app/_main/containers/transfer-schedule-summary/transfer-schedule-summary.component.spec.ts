import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/compiler/src/core';

import { TransferScheduleSummaryComponent } from './transfer-schedule-summary.component';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Store} from '@ngrx/store';
import * as fromTransferSchedulePageActions from '../../actions/transfer-schedule.actions';
import * as fromTransferScheduleReducers from '../../reducers/transfer-schedule.reducer';
import {GetSupportedSchedulesPipe} from '../../pipes';

describe('TransferScheduleSummaryComponent', () => {
  let component: TransferScheduleSummaryComponent;
  let fixture: ComponentFixture<TransferScheduleSummaryComponent>;
  let store: MockStore<any>;

  const initialState = {data_management: {transferSchedule: fromTransferScheduleReducers.initialState}};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState})
      ],
      declarations: [
        TransferScheduleSummaryComponent,
        GetSupportedSchedulesPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(TransferScheduleSummaryComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
