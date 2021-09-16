import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockCompensableFactorModel } from 'libs/models/comphub';
import { PfCommonModule } from 'libs/core';

import * as fromComphubCsdReducer from '../../reducers';
import * as fromCompensableFactorActions from '../../actions/compensable-factors.actions';
import { CompensableFactorTypeComponent } from './compensable-factor-type.component';

describe('CompensableFactorTypeComponent', () => {
  let instance: CompensableFactorTypeComponent;
  let fixture: ComponentFixture<CompensableFactorTypeComponent>;
  let store: Store<fromComphubCsdReducer.State>;
  let changeDetector: ChangeDetectorRef;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensableFactorTypeComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_crowd_sourced: combineReducers(fromComphubCsdReducer.reducers)
        }),
        PfCommonModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [{
        provide: ChangeDetectorRef
        }
      ]
    });

    fixture = TestBed.createComponent(CompensableFactorTypeComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    formBuilder = TestBed.inject(FormBuilder);
    changeDetector = TestBed.inject(ChangeDetectorRef);
    instance.compensableFactorName = 'Skills';
  });


  it('should dispatch SaveSelectedPercentChange on topFactorClick()', () => {
    jest.spyOn(store, 'dispatch');

    instance.selectedFactors = [];
    instance.disabledCheckBox = [];
    const factor = generateMockCompensableFactorModel();
    const expectedAction = new fromCompensableFactorActions.ToggleSelectedCompensableFactor({
      compensableFactor: 'Skills', name: factor.Name
    });

    instance.topFactorChecked(factor);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch SaveSelectedPercentChange on pillClicked()', () => {
    jest.spyOn(store, 'dispatch');

    instance.selectedFactors = [];
    instance.topFactors = [generateMockCompensableFactorModel()];
    instance.disabledCheckBox = [];
    const factor = generateMockCompensableFactorModel();
    const expectedAction = new fromCompensableFactorActions.ToggleSelectedCompensableFactor({
      compensableFactor: 'Skills', name: 'Angular'
    });

    instance.pillClicked('Angular');
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch SaveSelectedPercentChange on handleSearchValueSelected()', () => {
    jest.spyOn(store, 'dispatch');

    instance.compensableFactors = [generateMockCompensableFactorModel()];
    instance.selectedFactors = [];
    instance.disabledCheckBox = [];
    const factor = generateMockCompensableFactorModel();
    const expectedAction = new fromCompensableFactorActions.ToggleSelectedCompensableFactor({
      compensableFactor: 'Skills', name: factor.Name
    });

    instance.handleSearchValueSelected(factor.Name);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
