import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { PfCommonModule } from 'libs/core';

import * as fromBulkExportScheduleReducer from '../../reducers';
import * as fromBulkExportScheduleActions from '../../actions/bulk-export-schedule.actions';

import { BulkExportSchedulesListComponent } from './bulk-export-schedules-list.component';

describe('Bulk Job Description Export Scheduler - Bulk Export Schedule Form', () => {
  let fixture: ComponentFixture<BulkExportSchedulesListComponent>;
  let instance: BulkExportSchedulesListComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_bulk_jobs_export_scheduler: combineReducers(fromBulkExportScheduleReducer.reducers)
        }),
        FormsModule,
        PfCommonModule,
        NgbModule
      ],
      declarations: [
        BulkExportSchedulesListComponent
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(BulkExportSchedulesListComponent);
    instance = fixture.componentInstance;
  });

  it('should call RemovingSchedule with a filename when removeSchedule is called', () => {
    const fileName = 'Test.xlsx';

    spyOn(fromBulkExportScheduleActions, 'RemovingSchedule');

    fixture.detectChanges();

    instance.removeSchedule(fileName);

    fixture.detectChanges();

    expect(fromBulkExportScheduleActions.RemovingSchedule).toHaveBeenCalledWith(fileName);
  });

  it('should dispatch a OpenScheduleModal action when openModal is called', () => {
    const action = new fromBulkExportScheduleActions.OpenScheduleModal;

    instance.openModal('testFilename');

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a CloseScheduleModal action when closeBulkScheduleDeleteModal is called', () => {
    const action = new fromBulkExportScheduleActions.CloseScheduleModal;

    instance.closeBulkScheduleDeleteModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an action when finish button is pressed', () => {
    instance.openModal('testFilename');

    fixture.detectChanges();

    const expectedQueueAction = new fromBulkExportScheduleActions.CloseScheduleModal;
    const expectedInitAction = new fromBulkExportScheduleActions.OpenScheduleModal;

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedQueueAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedInitAction);
  });
});
