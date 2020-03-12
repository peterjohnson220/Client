import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/compiler/src/core';

import { OutboundTransferScheduleSummaryComponent } from './outbound-transfer-schedule-summary.component';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Store} from '@ngrx/store';
import * as fromTransferSchedulePageActions from '../../actions/transfer-schedule.actions';
import * as fromTransferScheduleReducers from '../../reducers/transfer-schedule.reducer';
import * as fromTransferDataPageReducers from '../../reducers/transfer-data-page.reducer';
import {GetSupportedSchedulesPipe} from '../../pipes';

describe('OutboundTransferScheduleSummaryComponent', () => {
  let component: OutboundTransferScheduleSummaryComponent;
  let fixture: ComponentFixture<OutboundTransferScheduleSummaryComponent>;
  let store: MockStore<any>;

  const initialState = {
    data_management: {
      transferSchedule: fromTransferScheduleReducers.initialState,
      transferDataPage: fromTransferDataPageReducers.initialState
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState})
      ],
      declarations: [
        OutboundTransferScheduleSummaryComponent,
        GetSupportedSchedulesPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(OutboundTransferScheduleSummaryComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getOutboundTransferSummary when page is initialized', () => {
    spyOn(store, 'dispatch');

    component.ngOnInit();
    fixture.detectChanges();

    const expectedInitAction = new fromTransferSchedulePageActions.GetOutboundTransferSummary();
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedInitAction);
  });
});
