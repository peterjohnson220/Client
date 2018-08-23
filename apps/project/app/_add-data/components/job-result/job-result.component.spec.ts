import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { PricingMatchesDetailsRequest, MatchesDetailsRequestJobTypes } from 'libs/models';

import { JobResultComponent } from './job-result.component';
import {
  generateMockPayfactorsJobResult,
  generateMockSurveyJobResult,
  generateMockDataCut,
  SurveyDataCut,
  JobResult,
  MatchesDetailsTooltipData
} from '../../models';
import * as fromAddDataReducer from '../../reducers';
import * as fromJobResultActions from '../../actions/search-results.actions';

describe('Project - Add Data - Job Result', () => {
  let instance: JobResultComponent;
  let fixture: ComponentFixture<JobResultComponent>;
  let store: Store<fromAddDataReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addData: combineReducers(fromAddDataReducer.reducers)
        })
      ],
      declarations: [ JobResultComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(JobResultComponent);
    instance = fixture.componentInstance;
  });

  it('should display Show Cuts link when current job is not Payfactors', () => {
    instance.job = generateMockSurveyJobResult();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show values in the correct currency when is Payfactors job ', () => {
    instance.job = generateMockPayfactorsJobResult();
    instance.currencyCode = 'CAD';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide Show Cuts link, survey name, and job code, when the current job is Payfactors', () => {
    instance.job = generateMockPayfactorsJobResult();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
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

    const getSurveyDataResultsAction = new fromJobResultActions.GetSurveyDataResults(instance.job);

    spyOn(store, 'dispatch');

    fixture.detectChanges();
    instance.toggleDataCutsDisplay();

    expect(store.dispatch).not.toHaveBeenCalledWith(getSurveyDataResultsAction);
  });

  it('should not request data cut results from store when hide cuts clicked', () => {
    instance.job = generateMockSurveyJobResult();
    instance.showDataCuts = true;
    const getSurveyDataResultsAction = new fromJobResultActions.GetSurveyDataResults(instance.job);

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
    const mouseLeaveEvent: MouseEvent = new MouseEvent('mouseleave');

    spyOn(instance.matchesMouseLeave, 'emit');
    instance.handleMatchesMouseLeave(mouseLeaveEvent);
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

});
