import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromDefaultScopesPageActions from '../../../actions/yoy-default-scopes-page.actions';
import { generateMockMatchResult, generateMockDataListItem, generateMockSurveyScope } from '../../../models';
import * as fromUtilitiesReducer from '../../../reducers';
import { YoyDefaultScopesPageComponent } from './yoy-default-scopes.page';

describe('Pf-Admin - Utilities - YoY Default Scopes Page', () => {
  let instance: YoyDefaultScopesPageComponent;
  let fixture: ComponentFixture<YoyDefaultScopesPageComponent>;
  let store: Store<fromUtilitiesReducer.State>;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          utilities: combineReducers(fromUtilitiesReducer.reducers),
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id : 1 } } },
        }
      ],
      declarations: [ YoyDefaultScopesPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(YoyDefaultScopesPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('Should dispatch a SetSelectedSurvey action with a data list item, when handling a survey clicked', () => {
    spyOn(store, 'dispatch');
    const dataListItem = generateMockDataListItem();
    const expectedAction = new fromDefaultScopesPageActions.SetSelectedSurvey(dataListItem);

    instance.handleSurveyClicked(dataListItem);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch a SetSelectedMatchResult action with a match result, when handling a match result selected', () => {
    spyOn(store, 'dispatch');
    const matchResult = generateMockMatchResult();
    const expectedAction = new fromDefaultScopesPageActions.SetSelectedMatchResult(matchResult);

    instance.handleMatchResultSelected(matchResult);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch a FilterMatchResults action with a type, when handling a filter match results clicked', () => {
    spyOn(store, 'dispatch');
    const type = 'Exact';
    const expectedAction = new fromDefaultScopesPageActions.FilterMatchResults({ type });

    instance.handleFilterMatchResultsClicked(type);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch a SetSelectedSurveyScope action with a survey scope, when handling a survey scope selected', () => {
    spyOn(store, 'dispatch');
    const surveyScope = generateMockSurveyScope();
    const expectedAction = new fromDefaultScopesPageActions.SetSelectedSurveyScope(surveyScope);

    instance.handleSurveyScopeSelected(surveyScope);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch an ApplyMatch action with a match result, when handling an apply exact match clicked', () => {
    spyOn(store, 'dispatch');
    const matchResult = generateMockMatchResult();
    const expectedAction = new fromDefaultScopesPageActions.ApplyMatch(matchResult);

    instance.handleApplyExactMatchClicked(matchResult);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch an ApplyMatch action with no payload, when handling an apply scope clicked', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromDefaultScopesPageActions.ApplyMatch();

    instance.handleApplyScopeClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch a Reset action, upon Init', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromDefaultScopesPageActions.Reset();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch a Load Company action with the route id as the company Id, upon Init', () => {
    spyOn(store, 'dispatch');
    const routeId = activatedRoute.snapshot.params.id;
    const expectedAction = new fromDefaultScopesPageActions.LoadCompany({ companyId: routeId });

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch a Load Default Scope Surveys action with the route id as the company Id, upon Init', () => {
    spyOn(store, 'dispatch');
    const routeId = activatedRoute.snapshot.params.id;
    const expectedAction = new fromDefaultScopesPageActions.LoadDefaultScopeSurveys({ companyId: routeId});

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
