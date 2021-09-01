import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import * as fromRootState from 'libs/state/state';
import { generateMockCompensableFactorsResponse, GetCrowdSourcedJobPricingRequest } from 'libs/models/payfactors-api';

import * as fromComphubSharedReducer from '../../../_shared/reducers';
import * as fromJobGridActions from '../../../_shared/actions/job-grid.actions';
import { CompensableFactorsComponent } from './compensable-factors.component';
import * as fromExportDataActions from '../../actions/export-data.actions';
import { CompensableFactorDataMapper } from '../../helpers';

describe('Comphub - Crowd Sourced Data - Jobs Card Component', () => {
  let instance: CompensableFactorsComponent;
  let fixture: ComponentFixture<CompensableFactorsComponent>;
  let store: Store<fromComphubSharedReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_shared: combineReducers(fromComphubSharedReducer.reducers),
          comphub_crowd_sourced: combineReducers(fromComphubSharedReducer.reducers)
        }),
        DropDownsModule,
      ],
      declarations: [ CompensableFactorsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CompensableFactorsComponent);
    instance = fixture.componentInstance;

    instance.selectedCountry = 'United States';
    instance.selectedJobTitle = 'some job';
    instance.selectedPaymarketId = 1;

    store = TestBed.inject(Store);

  });

  it('should dispatch actions to get the updated pricing and the export data when submit is clicked', () => {
    jest.spyOn(store, 'dispatch');

    const request: GetCrowdSourcedJobPricingRequest = {
      JobTitle: 'some job',
      Country: 'United States',
      PaymarketId: 1,
      SelectedFactors: [],
      IncludeExportData: true
    };

    const expectedAction1 = new fromJobGridActions.GetCrowdSourcedJobPricing(request);
    const expectedAction2 = new fromExportDataActions.SetExportData();
    instance.handleSubmitClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction1);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction2);
  });

  it('should map selected factors to the request properly', () => {

    instance.selectedFactors = generateMockCompensableFactorsResponse();

    const factorRequest = CompensableFactorDataMapper.mapSelectedFactorsToCompensableFactorsRequest(instance.selectedFactors);

    // make sure the request looks as we would expect.
    expect(factorRequest.find(f => f.Name === 'Years_Experience').SelectedFactors.find(sf => sf === '2')).not.toBeUndefined();
    expect(factorRequest.find(f => f.Name === 'Education').SelectedFactors.find(sf => sf === 'Master\'s Degree (non-MBA)')).not.toBeUndefined();
    expect(factorRequest.find(f => f.Name === 'Supervisory_Role').SelectedFactors.find(sf => sf === 'Yes')).not.toBeUndefined();
    expect(factorRequest.find(f => f.Name === 'Certs').SelectedFactors.find(sf => sf === 'Engineer in Training (EIT)')).not.toBeUndefined();
    expect(factorRequest.find(f => f.Name === 'Skills').SelectedFactors.find(sf => sf === 'Test Planning')).not.toBeUndefined();
    expect(factorRequest.find(f => f.Name === 'Skills').SelectedFactors.find(sf => sf === 'System Testing')).not.toBeUndefined();

  });


});
