import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { Subject, of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {ExchangeCompanyApiService} from 'libs/data/payfactors-api/peer';

import * as fromSharedPeerReducer from '../../../../shared/reducers/index';
import * as fromJobFamiliesActions from '../../../actions/job-family.actions';
import * as fromPeerManagementReducer from '../../../reducers/index';
import {NewJobFormComponent} from './new-job-form.component';

describe('Peer - Manage - Request Job - New Job Form', () => {
  let fixture: ComponentFixture<NewJobFormComponent>;
  let instance: NewJobFormComponent;

  let store: Store<fromPeerManagementReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_shared: combineReducers(fromSharedPeerReducer.reducers),
          peer_manage: combineReducers(fromPeerManagementReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: ExchangeCompanyApiService,
          useValue: { validateNewJobTitle: jest.fn() }
        }
      ],
      declarations: [
        NewJobFormComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(NewJobFormComponent);
    instance = fixture.componentInstance;
    instance.exchangeJobRequestForm = new FormGroup({});
    instance.jobFamiliesComboBox = {
      filterChange: new Subject(),
      reset: jest.fn(),
      writeValue: function(val: string) { this.value = val; },
      value: '',
      toggle: jest.fn()
    } as any;
  });

  it(`should provide correct values to the pf-modal-form component`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should apply the newJobForm to the exchangeJobRequestForm on init`, () => {
    fixture.detectChanges();

    const childJobSelectionForm = instance.exchangeJobRequestForm.get('newJobForm');
    expect(childJobSelectionForm).toBe(instance.newJobForm);
  });

  it('should dispatch a LoadJobFamilies action on init', () => {
    const expectedAction = new fromJobFamiliesActions.LoadJobFamilies();

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should set potentialJobFamilies on init', () => {
    const expectedJobFamilies = ['MockJobFamilyOne', 'MockJobFamilyTwo', 'MockJobFamilyThree'];
    instance.potentialJobFamiles$ = of(expectedJobFamilies);

    fixture.detectChanges();

    expect(instance.potentialJobFamilies).toEqual(expectedJobFamilies);
    expect(instance.potentialJobFamiliesFiltered).toEqual(expectedJobFamilies);
  });

  it(`should update potentialJobFamiliesFiltered when handleJobFamilyFilterChange is called`, () => {
    const mockJobFamilies = ['MockJobFamilyOne', 'MockJobFamilyTwo', 'MockJobFamilyThree'];
    const expectedJobFamilies = ['MockJobFamilyOne'];
    const mockFilterValue = 'MockJobFamilyOne';

    instance.potentialJobFamiles$ = of(mockJobFamilies);

    fixture.detectChanges();

    instance.handleJobFamilyFilterChange(mockFilterValue);

    expect(instance.potentialJobFamiliesFiltered).toEqual(expectedJobFamilies);
  });

  it(`should set the value of the jobFamily form control when handleJobFamilyValueChange is called`, () => {
    const expectedJobFamily = 'MockJobFamily';

    fixture.detectChanges();

    instance.handleJobFamilyValueChange(expectedJobFamily);

    const jobFamilyFormControl = instance.exchangeJobRequestForm.get('newJobForm').get('jobFamily');
    expect(jobFamilyFormControl.value).toEqual(expectedJobFamily);
  });
});
