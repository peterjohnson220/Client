import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromStandardReportsListPageActions from '../../../actions/standard-reports-list-page.actions';
import { StandardReportsListPageComponent } from './standard-reports-list.page';
import { generateMockStandardReportDetails } from '../../../models';

describe('Data Insights Management - Standard Reports List Page', () => {
  let instance: StandardReportsListPageComponent;
  let fixture: ComponentFixture<StandardReportsListPageComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
        })
      ],
      declarations: [ StandardReportsListPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(StandardReportsListPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should update the search term when it changes', () => {
    instance.updateSearchTerm('test');

    expect(instance.searchTerm).toBe('test');
  });

  it('sync standard reports', () => {
    const expectedAction = new fromStandardReportsListPageActions.SyncStandardReports();
    spyOn(store, 'dispatch');

    instance.syncStandardReports();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('onInit fetches list of standard reports', () => {
    const expectedAction = new fromStandardReportsListPageActions.GetStandardReportDetails();
    spyOn(store, 'dispatch');

    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('filtered reports returns all workbooks if no search term provided', () => {
    instance.allWorkbooks = [
      {...generateMockStandardReportDetails(), Name: 'New Name'},
      {...generateMockStandardReportDetails(), Name: 'Other Name'}
    ];
    instance.searchTerm = '';

    expect(instance.filteredStandardReports.length).toBe(2);
  });

  it('filtered reports returns only matching workbooks if set', () => {
    instance.allWorkbooks = [
      {...generateMockStandardReportDetails(), Name: 'New Name'},
      {...generateMockStandardReportDetails(), Name: 'Other Name'}
    ];
    instance.searchTerm = 'other';

    expect(instance.filteredStandardReports.length).toBe(1);
  });

  it('filtered reports returns no workbooks if none match search term', () => {
    instance.allWorkbooks = [
      {...generateMockStandardReportDetails(), Name: 'New Name'},
      {...generateMockStandardReportDetails(), Name: 'Other Name'}
    ];
    instance.searchTerm = 'Crazy';

    expect(instance.filteredStandardReports.length).toBe(0);
  });

  it('filtered reports returns workbooks if display name or name match', () => {
    instance.allWorkbooks = [
      {...generateMockStandardReportDetails(), Name: 'Full Belly', DisplayName: null},
      {...generateMockStandardReportDetails(), Name: 'Other Name', DisplayName: 'Colorful'}
    ];
    instance.searchTerm = 'ful';

    expect(instance.filteredStandardReports.length).toBe(2);
  });

});
