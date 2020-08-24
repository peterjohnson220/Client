import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { PfCommonModule } from 'libs/core';

import { JobResultComponent } from './job-result.component';
import {
  generateMockPayfactorsJobResult,
  generateMockSurveyJobResult,
  generateMockDataCut,
  MatchesDetailsTooltipData,
  DataCut
} from '../../models';
import * as fromSurveySearchReducer from '../../reducers';
import * as fromSurveySearchResultsActions from '../../actions/survey-search-results.actions';

describe('Project - Survey Search - Job Result', () => {
  let instance: JobResultComponent;
  let fixture: ComponentFixture<JobResultComponent>;
  let store: Store<fromSurveySearchReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_surveySearch: combineReducers(fromSurveySearchReducer.reducers)
        }),
        PfCommonModule
      ],
      declarations: [ JobResultComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(JobResultComponent);
    instance = fixture.componentInstance;

    // Set up
    instance.job = generateMockSurveyJobResult();
    fixture.detectChanges();
  });

  it('should display Hide Cuts link when toggling the data cuts display', () => {
    instance.job = generateMockPayfactorsJobResult();
    instance.showDataCuts = false;

    fixture.detectChanges();

    instance.toggleDataCutsDisplay();

    fixture.detectChanges();

    expect(instance.toggleDataCutsLabel).toEqual('Hide Cuts');
  });

  it('should display Show Cuts link when toggling the data cuts display', () => {
    instance.job = generateMockPayfactorsJobResult();
    instance.showDataCuts = true;

    instance.toggleDataCutsDisplay();

    fixture.detectChanges();

    expect(instance.toggleDataCutsLabel).toEqual('Show Cuts');
  });

  it('should not request data cut results from store when show cuts clicked and cuts already loaded', () => {
    instance.job = generateMockSurveyJobResult();
    instance.showDataCuts = false;
    instance.job.DataCuts = [generateMockDataCut()];

    const getSurveyDataResultsAction = new fromSurveySearchResultsActions.GetSurveyDataResults(instance.job);

    spyOn(store, 'dispatch');

    fixture.detectChanges();
    instance.toggleDataCutsDisplay();

    expect(store.dispatch).not.toHaveBeenCalledWith(getSurveyDataResultsAction);
  });

  it('should not request data cut results from store when hide cuts clicked', () => {
    instance.job = generateMockSurveyJobResult();
    instance.showDataCuts = true;
    const getSurveyDataResultsAction = new fromSurveySearchResultsActions.GetSurveyDataResults(instance.job);

    spyOn(store, 'dispatch');

    instance.toggleDataCutsDisplay();
    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalledWith(getSurveyDataResultsAction);
  });

  it('should emit matchesMouseEnter when mouse enter job result Matches field', () => {
    instance.job = generateMockPayfactorsJobResult();
    const mouseEnterEvent: MouseEvent = new MouseEvent('mouseenter');

    spyOn(instance.matchesMouseEnter, 'emit');
    instance.handleMatchesMouseEnter(mouseEnterEvent);

    expect(instance.matchesMouseEnter.emit).toHaveBeenCalled();
  });

  it('should emit matchesMouseLeave event when mouse leave Matches field', fakeAsync(() => {
    spyOn(instance.matchesMouseLeave, 'emit');

    instance.handleMatchesMouseLeave();
    tick(100);

    expect(instance.matchesMouseLeave.emit).toHaveBeenCalled();
  }));

  it('should emit matchesMouseEnter event to search results component for data cut matches', () => {
    const matchesDetailsTooltipData: MatchesDetailsTooltipData = {
      TargetX: 60,
      TargetY: 100,
      MatchesDetails: ['Administrative Assistant (25) - *Denver']
    };

    spyOn(instance.matchesMouseEnter, 'emit');
    instance.handleDataCutMatchesMouseEnter(matchesDetailsTooltipData);

    expect(instance.matchesMouseEnter.emit).toHaveBeenCalled();
  });

  it('should emit loadDataCuts event when Load More clicked', () => {
    instance.job = generateMockSurveyJobResult();

    spyOn(instance.loadDataCuts, 'emit');
    instance.handleLoadDataCuts();

    expect(instance.loadDataCuts.emit).toHaveBeenCalled();
  });

  it('should show Load More link when there are more data cuts from server', () => {
    const dataCut: DataCut = generateMockDataCut();
    instance.job = generateMockSurveyJobResult();
    instance.job.DataCuts = [dataCut];
    instance.job.TotalDataCuts = 5;
    fixture.detectChanges();

    instance.toggleDataCutsDisplay();
    instance.job.LoadingDataCuts = false;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show Load More link when there are no more data cuts results', () => {
    const dataCut: DataCut = generateMockDataCut();
    instance.job = generateMockSurveyJobResult();
    instance.job.DataCuts = [dataCut];
    instance.job.TotalDataCuts = 1;

    fixture.detectChanges();

    instance.toggleDataCutsDisplay();
    instance.job.LoadingDataCuts = false;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show error state if issue loading data cuts', () => {
    instance.job = generateMockSurveyJobResult();
    instance.job.DataCuts = [];
    instance.job.TotalDataCuts = 1;

    fixture.detectChanges();

    instance.toggleDataCutsDisplay();
    instance.job.LoadingDataCuts = false;
    instance.job.LoadingDataCutsError = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
