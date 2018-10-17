import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;
import { DragulaModule } from 'ng2-dragula';

import * as fromRootState from 'libs/state/state';

import * as fromAddSurveyDataPageActions from '../../../actions/add-survey-data-page.actions';
import * as fromSurveyResultsActions from '../../../actions/search-results.actions';
import * as fromSearchFiltersActions from '../../../actions/search-filters.actions';
import * as fromSearchActions from '../../../actions/search.actions';
import { generateMockJobContext, generateMockProjectSearchContext, JobContext, ProjectSearchContext } from '../../../models';
import * as fromAddDataReducer from '../../../reducers';
import { AddSurveyDataPageComponent } from './add-survey-data.page';


describe('Project - Add Data - Surveys Page', () => {
  let fixture: ComponentFixture<AddSurveyDataPageComponent>;
  let instance: AddSurveyDataPageComponent;
  let store: Store<fromAddDataReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addData: combineReducers(fromAddDataReducer.reducers),
        }),
        DragulaModule.forRoot()
      ],
      declarations: [
        AddSurveyDataPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(AddSurveyDataPageComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a close survey search action, when handling cancel clicked', () => {
    const expectedAction = new fromAddSurveyDataPageActions.CloseSurveySearch();
    spyOn(store, 'dispatch');

    instance.handleCancelClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a Clear Filters action, when receiving a App Closed message', () => {
    const messageEvent = new MessageEvent('Message from parent', {
      data: {
        payfactorsMessage: {
          type: 'App Closed'
        }
      }
    });
    const expectedAction = new fromSearchFiltersActions.ClearFilters();

    spyOn(store, 'dispatch');

    instance.onMessage(messageEvent);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a Clear Results action, when receiving a App Closed message', () => {
    const messageEvent = new MessageEvent('Message from parent', {
      data: {
        payfactorsMessage: {
          type: 'App Closed'
        }
      }
    });
    const expectedAction = new fromSurveyResultsActions.ClearResults();

    spyOn(store, 'dispatch');

    instance.onMessage(messageEvent);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should do nothing, when receiving message with no data', () => {
    const messageEvent = new MessageEvent('Message from parent');

    const returnVal = instance.onMessage(messageEvent);

    expect(returnVal).toBe(undefined);
  });

  it('should do nothing, when receiving message with non payfactors data', () => {
    const messageEvent = new MessageEvent('Message from parent', {data: 'Other Data'});

    const returnVal = instance.onMessage(messageEvent);

    expect(returnVal).toBe(undefined);
  });
});
