import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {of} from 'rxjs';

import { SwitchModule, SwitchComponent } from '@progress/kendo-angular-inputs';

import {generateMockTransferScheduleSummaries} from 'libs/models/hris-api/sync-schedule/response';

import * as fromHrisConnectionActions from '../../../../actions/hris-connection.actions';
import * as fromOnDemandSyncActions from '../../../../actions/on-demand-sync.actions';
import * as fromTransferSchedulePageActions from '../../../../actions/transfer-schedule.actions';
import * as fromTransferScheduleReducers from '../../../../reducers/transfer-schedule.reducer';
import { GetSupportedSchedulesPipe } from '../../../../pipes';

import { TransferSchedulePageComponent } from './transfer-schedule.page';

describe('TransferSchedulePageComponent', () => {
  let instance: TransferSchedulePageComponent;
  let fixture: ComponentFixture<TransferSchedulePageComponent>;
  let store: MockStore<any>;

  const initialState = { data_management: { transferSchedule: fromTransferScheduleReducers.initialState} };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SwitchModule
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [
        TransferSchedulePageComponent,
        GetSupportedSchedulesPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(SwitchComponent, {
      set: {
        template: '<p>Mock Product Settings Component</p>'
      }
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TransferSchedulePageComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch getTransferSummary when page is initialized', () => {
    spyOn(store, 'dispatch');

    instance.ngOnInit();
    fixture.detectChanges();

    const expectedConnectionAction = new fromHrisConnectionActions.GetHrisConnectionSummary();
    const expectedSummaryAction = new fromTransferSchedulePageActions.GetTransferSummary();

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedConnectionAction);
    expect(store.dispatch).toHaveBeenNthCalledWith(2, expectedSummaryAction);
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

  it('should dispatch an action when finish button is pressed and validationMode is false', () => {
    spyOn(store, 'dispatch');

    instance.validationMode = false;

    instance.onFinish();

    fixture.detectChanges();

    const expectedQueueAction = new fromOnDemandSyncActions.QueueOnDemandSync();
    const expectedInitAction = new fromTransferSchedulePageActions.ShowIntegrationSetupCompletedModal(true);

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedQueueAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedInitAction);
  });

  it('should dispatch two actions when finish button is pressed and validationMode is true', () => {
    spyOn(store, 'dispatch');

    instance.validationMode = true;

    instance.onFinish();

    fixture.detectChanges();

    const expectedQueueAction = new fromOnDemandSyncActions.QueueOnDemandSync();
    const expectedInitAction = new fromTransferSchedulePageActions.ShowIntegrationSetupCompletedModal(true);

    expect(store.dispatch).toHaveBeenCalledWith(expectedQueueAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedInitAction);
  });

  it('should dispatch a toggle action when kendo-switch value changes', () => {
    spyOn(store, 'dispatch');

    instance.handleValidationModeChanged();

    fixture.detectChanges();

    const expectedAction = new fromHrisConnectionActions.ToggleValidationMode(false);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
