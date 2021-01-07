import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { generateMockTabularReportExportSchedule } from 'libs/features/reports/models';

import * as fromTabularReportExportSchedulerPageActions from '../../actions/tabular-report-export-scheduler-page.actions';
import * as fromTabularReportExportSchedulerPageReducer from '../../reducers';
import { ExportSchedulesComponent } from './export-schedules.component';

describe('ExportSchedulesComponent', () => {
  let instance: ExportSchedulesComponent;
  let fixture: ComponentFixture<ExportSchedulesComponent>;
  let store: Store<fromTabularReportExportSchedulerPageReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          tabularReportManagement_main: combineReducers(fromTabularReportExportSchedulerPageReducer.reducers)
        })
      ],
      declarations: [ ExportSchedulesComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ExportSchedulesComponent);
    instance = fixture.componentInstance;
    instance.scheduleToDelete = generateMockTabularReportExportSchedule();
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should dispatch showDeleteModal when handleDeleteClicked', () => {
    const expectedAction = new fromTabularReportExportSchedulerPageActions.ShowDeleteModal(true);
    spyOn(store, 'dispatch');

    instance.handleDeleteClicked(instance.scheduleToDelete);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch showDeleteModal when handleCancelClicked', () => {
    const expectedAction = new fromTabularReportExportSchedulerPageActions.ShowDeleteModal(false);
    spyOn(store, 'dispatch');

    instance.handleCancelClicked();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch DeleteExportSchedule when handleDeleteScheduledExport', () => {
    const expectedAction = new fromTabularReportExportSchedulerPageActions.DeleteExportSchedule(instance.scheduleToDelete.DataViewId);
    spyOn(store, 'dispatch');

    instance.handleDeleteScheduledExport();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
