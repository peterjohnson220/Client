import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, StoreModule, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { DataCut, generateMockSearchResponse } from 'libs/models/survey-search';

import * as fromSearchResultsActions from '../../actions/search-results.actions';
import {
  generateMockSurveyJobResult,
  JobResult,
  generateMockDataCut
} from '../../models';
import * as fromAddDataReducer from '../../reducers';
import { SearchResultsComponent } from './search-results.component';

describe('Project - Add Data - Search Results', () => {
  let fixture: ComponentFixture<SearchResultsComponent>;
  let instance: SearchResultsComponent;
  let store: Store<fromAddDataReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addData: combineReducers(fromAddDataReducer.reducers)
        })
      ],
      declarations: [
        SearchResultsComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(SearchResultsComponent);
    instance = fixture.componentInstance;
  });

  it('should show a table row with a loading indicator, when loading more results', () => {
    store.dispatch(new fromSearchResultsActions.GetResultsSuccess(generateMockSearchResponse()));
    store.dispatch(new fromSearchResultsActions.GetMoreResults());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a GetMoreResults action onScroll when not already loading more results and it has results on the server', () => {
    store.dispatch(new fromSearchResultsActions.GetResultsSuccess(generateMockSearchResponse()));

    const expectedAction = new fromSearchResultsActions.GetMoreResults();
    spyOn(store, 'dispatch');

    fixture.detectChanges();
    instance.onScroll();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should Not dispatch a GetMoreResults action onScroll when already loading more results', () => {
    store.dispatch(new fromSearchResultsActions.GetResultsSuccess(generateMockSearchResponse()));
    const getMoreResultsAction = new fromSearchResultsActions.GetMoreResults();

    store.dispatch(getMoreResultsAction);
    spyOn(store, 'dispatch');

    fixture.detectChanges();
    instance.onScroll();

    expect(store.dispatch).not.toHaveBeenCalledWith(getMoreResultsAction);
  });

  it('should Not dispatch a GetMoreResults action onScroll when there is no more results on the server', () => {
    const getMoreResultsAction = new fromSearchResultsActions.GetMoreResults();
    store.dispatch(new fromSearchResultsActions.GetResultsSuccess(
      {
        ...generateMockSearchResponse(),
        Paging: {
          RecordsReturned: 1,
          TotalRecordCount: 1
        }
      }
    ));

    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.onScroll();

    expect(store.dispatch).not.toHaveBeenCalledWith(getMoreResultsAction);
  });

  it('should toggle the data cut selection when cut is selected ', () => {
    const surveyDataCut: DataCut = {
      IsPayfactorsJob: true,
        CountryCode: 'USA',
        SurveyJobCode: '1234'
    };
    const toggleSurveyDataCut = new fromSearchResultsActions.ToggleSurveyDataCutSelection(surveyDataCut);

    spyOn(store, 'dispatch');
    instance.handleCutSelectionToggle(surveyDataCut);

    expect(store.dispatch).toHaveBeenCalledWith(toggleSurveyDataCut);
  });

  it('should get survey data results if cuts not already loaded', () => {
    const jobData: JobResult = generateMockSurveyJobResult();

    const getSurveyDataResults = new fromSearchResultsActions.GetSurveyDataResults(jobData);

    spyOn(store, 'dispatch');
    instance.handleShowCutsClick(jobData);

    expect(store.dispatch).toHaveBeenCalledWith(getSurveyDataResults);
  });

  it('should not get survey data results when cuts already loaded', () => {
    const jobData: JobResult = generateMockSurveyJobResult();
    jobData.DataCuts = [generateMockDataCut()];

    const getSurveyDataResults = new fromSearchResultsActions.GetSurveyDataResults(jobData);

    spyOn(store, 'dispatch');
    instance.handleShowCutsClick(jobData);

    expect(store.dispatch).not.toHaveBeenCalledWith(getSurveyDataResults);
  });
});
