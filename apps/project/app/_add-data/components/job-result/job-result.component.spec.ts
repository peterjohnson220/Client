import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { JobResultComponent } from './job-result.component';
import { generateMockPayfactorsJobResult, generateMockSurveyJobResult, generateMockDataCut } from '../../models';
import * as fromAddDataReducer from '../../reducers';
import * as fromJobResultActions from '../../actions/search-results.actions';



describe('Project - Add Data - Job Result', () => {
  let component: JobResultComponent;
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
    component = fixture.componentInstance;
  });

  it('should display Show Cuts link when current job is not Payfactors', () => {
    component.job = generateMockSurveyJobResult();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show values in the correct currency when is Payfactors job ', () => {
    component.job = generateMockPayfactorsJobResult();
    component.currencyCode = 'CAD';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide Show Cuts link, survey name, and job code, when the current job is Payfactors', () => {
    component.job = generateMockPayfactorsJobResult();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display Hide Cuts link when toggling the data cuts display', () => {
    component.job = generateMockPayfactorsJobResult();
    component.showDataCuts = false;

    fixture.detectChanges();

    component.toggleDataCutsDisplay();

    fixture.detectChanges();

    expect(component.toggleDataCutsLabel).toEqual('Hide Cuts');
  });

  it('should display Show Cuts link when toggling the data cuts display', () => {
    component.job = generateMockPayfactorsJobResult();
    component.showDataCuts = true;

    component.toggleDataCutsDisplay();

    fixture.detectChanges();

    expect(component.toggleDataCutsLabel).toEqual('Show Cuts');
  });

  it('should not request data cut results from store when show cuts clicked and cuts already loaded', () => {
    component.job = generateMockSurveyJobResult();
    component.showDataCuts = false;
    component.job.DataCuts = [generateMockDataCut()];

    const getSurveyDataResultsAction = new fromJobResultActions.GetSurveyDataResults(component.job);

    spyOn(store, 'dispatch');

    fixture.detectChanges();
    component.toggleDataCutsDisplay();

    expect(store.dispatch).not.toHaveBeenCalledWith(getSurveyDataResultsAction);
  });

  it('should not request data cut results from store when hide cuts clicked', () => {
    component.job = generateMockSurveyJobResult();
    component.showDataCuts = true;
    const getSurveyDataResultsAction = new fromJobResultActions.GetSurveyDataResults(component.job);

    spyOn(store, 'dispatch');

    component.toggleDataCutsDisplay();
    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalledWith(getSurveyDataResultsAction);
  });

});
