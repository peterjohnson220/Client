import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {MockStore, provideMockStore} from '@ngrx/store/testing';

import * as fromBulkExportSchedulerReducer from '../../reducers/bulk-export-scheduler.reducer';
import { BulkExportHistoryComponent } from './bulk-export-history-list.component';

describe('BulkExportHistoryComponent', () => {
  let component: BulkExportHistoryComponent;
  let fixture: ComponentFixture<BulkExportHistoryComponent>;
  let store: MockStore<any>;

  const initialState = {feature_bulk_jobs_export_scheduler: {bulkExportSchedule: fromBulkExportSchedulerReducer.initialState}};


  beforeEach((() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState})
      ],
      declarations: [ BulkExportHistoryComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BulkExportHistoryComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
