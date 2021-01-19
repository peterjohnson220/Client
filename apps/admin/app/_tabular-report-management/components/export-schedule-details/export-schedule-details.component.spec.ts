import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockTabularReportExportSchedule } from 'libs/features/reports/models';

import * as fromTabularReportExportSchedulerPageActions from '../../actions/tabular-report-export-scheduler-page.actions';
import * as fromTabularReportExportSchedulerPageReducer from '../../reducers';
import { ExportScheduleDetailsComponent } from './export-schedule-details.component';

describe('ExportScheduleDetailsComponent', () => {
  let instance: ExportScheduleDetailsComponent;
  let fixture: ComponentFixture<ExportScheduleDetailsComponent>;
  let store: Store<fromTabularReportExportSchedulerPageReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          tabularReportManagement_main: combineReducers(fromTabularReportExportSchedulerPageReducer.reducers)
        })
      ],
      declarations: [ ExportScheduleDetailsComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ExportScheduleDetailsComponent);
    instance = fixture.componentInstance;
    instance.schedule = generateMockTabularReportExportSchedule();
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should emit deleteClicked when handleDeleteClicked', () => {
    spyOn(instance.deleteClicked, 'emit');

    instance.handleDeleteClicked(instance.schedule);

    expect(instance.deleteClicked.emit).toHaveBeenCalledTimes(1);
  });

});
