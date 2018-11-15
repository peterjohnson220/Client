import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;
import { DragulaModule } from 'ng2-dragula';

import * as fromRootState from 'libs/state/state';

import * as fromMultimatchPageActions from '../../../actions/multi-match-page.actions';
import * as fromJobsToPriceActions from '../../../actions/jobs-to-price.actions';
import * as fromSearchActions from '../../../../shared/actions/search.actions';
import * as fromMultiMatchReducer from '../../../reducers';
import * as fromSharedReducer from '../../../../shared/reducers';
import { MultiMatchPageComponent } from './multi-match.page';
import { generateProjectContext } from '../../../../shared/models';


describe('Project - Add Data - Multi Match Page', () => {
  let fixture: ComponentFixture<MultiMatchPageComponent>;
  let instance: MultiMatchPageComponent;
  let store: Store<fromMultiMatchReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_multiMatch: combineReducers(fromMultiMatchReducer.reducers),
          project_shared: combineReducers(fromSharedReducer.reducers),
        }),
        DragulaModule.forRoot()
      ],
      declarations: [
        MultiMatchPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(MultiMatchPageComponent);
    instance = fixture.componentInstance;
    instance.ngOnInit();
  });

  it('should dispatch a close search page action, when handling cancel clicked', () => {
    const expectedAction = new fromSearchActions.CloseSearchPage();
    spyOn(store, 'dispatch');

    instance.handleCancelClicked();

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

  it('should dispatch a save job matches, when handling save clicked', () => {
    const expectedAction = new fromMultimatchPageActions.SaveJobMatchUpdates();
    spyOn(store, 'dispatch');

    instance.handleSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a clear all jobs action, when reset', () => {
    const expectedAction = new fromJobsToPriceActions.ClearAllJobs();
    spyOn(store, 'dispatch');

    instance.onResetApp();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a hide page action, when reset', () => {
    const expectedAction = new fromSearchActions.HidePage();
    spyOn(store, 'dispatch');

    instance.onResetApp();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a set context action, when context set', () => {
    const payload = generateProjectContext();
    const expectedAction = new fromMultimatchPageActions.SetProjectContext(payload);
    spyOn(store, 'dispatch');

    instance.onSetContext(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a get project search context action, when context set', () => {
    const payload = generateProjectContext();
    const expectedAction = new fromMultimatchPageActions.GetProjectSearchContext(payload);
    spyOn(store, 'dispatch');

    instance.onSetContext(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a get project search context action, when context set', () => {
    const payload = generateProjectContext();
    const expectedAction = new fromJobsToPriceActions.GetJobsToPrice(payload);
    spyOn(store, 'dispatch');

    instance.onSetContext(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
