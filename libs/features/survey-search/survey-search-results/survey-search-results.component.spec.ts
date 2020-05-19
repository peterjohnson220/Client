import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { SurveySearchResultDataSources } from 'libs/constants';

import * as fromSurveySearchResultsActions from '../actions/survey-search-results.actions';
import { DataCutDetails, generateMockDataCut, generateMockSurveyJobResult, JobResult } from '../models';
import * as fromSurveySearchReducer from '../reducers';
import { SurveySearchResultsComponent } from './survey-search-results.component';

describe('Project - Survey Search - Search Results', () => {
  let fixture: ComponentFixture<SurveySearchResultsComponent>;
  let instance: SurveySearchResultsComponent;
  let store: Store<fromSurveySearchReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_surveySearch: combineReducers(fromSurveySearchReducer.reducers)
        })
      ],
      declarations: [
        SurveySearchResultsComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(SurveySearchResultsComponent);
    instance = fixture.componentInstance;
  });

  it('should toggle the data cut selection when cut is selected ', () => {
    const surveyDataCut: DataCutDetails = {
        DataSource: SurveySearchResultDataSources.Payfactors,
        CountryCode: 'USA',
        SurveyJobCode: '1234'
    };
    const toggleSurveyDataCut = new fromSurveySearchResultsActions.ToggleDataCutSelection(surveyDataCut);

    spyOn(store, 'dispatch');
    instance.handleCutSelectionToggle(surveyDataCut);

    expect(store.dispatch).toHaveBeenCalledWith(toggleSurveyDataCut);
  });

  it('should get survey data results if cuts not already loaded', () => {
    const jobData: JobResult = generateMockSurveyJobResult();

    const getSurveyDataResults = new fromSurveySearchResultsActions.GetSurveyDataResults(jobData);

    spyOn(store, 'dispatch');
    instance.handleLoadDataCuts(jobData);

    expect(store.dispatch).toHaveBeenCalledWith(getSurveyDataResults);
  });

  it('should not get survey data results when cuts already loaded', () => {
    const jobData: JobResult = generateMockSurveyJobResult();
    jobData.DataCuts = [generateMockDataCut()];

    const getSurveyDataResults = new fromSurveySearchResultsActions.GetSurveyDataResults(jobData);

    spyOn(store, 'dispatch');
    instance.handleLoadDataCuts(jobData);

    expect(store.dispatch).not.toHaveBeenCalledWith(getSurveyDataResults);
  });
});
