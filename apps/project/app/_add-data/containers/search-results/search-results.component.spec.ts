import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, StoreModule, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromSearchResultsActions from '../../actions/search-results.actions';
import * as fromAddDataReducer from '../../reducers';
import { SearchResultsComponent } from './search-results.component';
import { generateMockSurveyJobResult, JobResult, JobDetailsToolTipData } from '../../models';

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
    store.dispatch(new fromSearchResultsActions.GetMoreResults());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a GetMoreResults action onScroll when not already loading more results', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSearchResultsActions.GetMoreResults();

    instance.onScroll();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should Not dispatch a GetMoreResults action onScroll when already loading more results', () => {
    const getMoreResultsAction = new fromSearchResultsActions.GetMoreResults();
    store.dispatch(getMoreResultsAction);

    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.onScroll();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should show tooltip when current tooltip index is not the same as the input index', () => {
    const jobResult: JobResult = generateMockSurveyJobResult();
    const data: JobDetailsToolTipData = {
      Job: jobResult,
      TargetX: 300,
      TargetY: 579
    };
    const inputTooltipIndex = 1;

    instance.handleJobTitleClick(data, inputTooltipIndex);

    expect(instance.showTooltip).toEqual(true);
  });

  it('should not show tooltip when current tooltip index is the same as the input index', () => {
    const jobResult: JobResult = generateMockSurveyJobResult();
    const data: JobDetailsToolTipData = {
      Job: jobResult,
      TargetX: 300,
      TargetY: 579
    };
    const inputTooltipIndex = 1;
    instance.tooltipData = data;
    instance.tooltipIndex = 1;

    instance.handleJobTitleClick(data, inputTooltipIndex);

    expect(instance.showTooltip).toEqual(false);
  });
});
