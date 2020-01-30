import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Store } from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import {of} from 'rxjs';

import {generateMockTransferScheduleSummaries} from 'libs/models/hris-api/sync-schedule/response';

import * as fromTransferSchedulePageActions from '../../../actions/transfer-schedule.actions';
import * as fromTransferScheduleReducers from '../../../reducers/transfer-schedule.reducer';
import {GetSupportedSchedulesPipe} from '../../../pipes';

import { TransferSchedulePageComponent } from './transfer-schedule.page';

describe('TransferSchedulePageComponent', () => {
  let instance: TransferSchedulePageComponent;
  let fixture: ComponentFixture<TransferSchedulePageComponent>;
  let store: MockStore<any>;

  const initialState = { data_management: { transferSchedule: fromTransferScheduleReducers.initialState} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState })
      ],
      declarations: [
        TransferSchedulePageComponent,
        GetSupportedSchedulesPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(TransferSchedulePageComponent);
    instance = fixture.componentInstance;
  }));

  it('should dispatch getTransferSummary when page is initialized', () => {
    spyOn(store, 'dispatch');

    instance.ngOnInit();
    fixture.detectChanges();

    const expectedInitAction = new fromTransferSchedulePageActions.GetTransferSummary();
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedInitAction);
  });

  it('should show only supported entities', () => {
    instance.transferScheduleSummary$ = of(generateMockTransferScheduleSummaries());
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show only supported entities and overflow correctly', () => {
    instance.transferScheduleSummary$ = of(
      generateMockTransferScheduleSummaries()
        .concat(generateMockTransferScheduleSummaries())
    );
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
