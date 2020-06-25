import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { Subject, of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';

import * as fromSharedPeerReducer from '../../../../shared/reducers/index';
import * as fromCompanyIndustriesActions from '../../../actions/company-industries.actions';
import * as fromPeerDashboardReducer from '../../../reducers/index';
import { NewCompanyFormComponent } from './new-company-form.component';

describe('Peer - Dashboard - Invite Company - New Company Form', () => {
  let fixture: ComponentFixture<NewCompanyFormComponent>;
  let instance: NewCompanyFormComponent;

  let store: Store<fromPeerDashboardReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_shared: combineReducers(fromSharedPeerReducer.reducers),
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: ExchangeCompanyApiService,
          useValue: { validateNewCompanyName: jest.fn() }
        }
      ],
      declarations: [
        NewCompanyFormComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(NewCompanyFormComponent);
    instance = fixture.componentInstance;
    instance.requestCompanyForm = new FormGroup({});
    instance.companyIndustriesComboBox = {
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

  it(`should apply the newCompanyForm to the requestCompanyForm on init`, () => {
    fixture.detectChanges();

    const childNewCompanyForm = instance.requestCompanyForm.get('newCompanyForm');
    expect(childNewCompanyForm).toBe(instance.newCompanyForm);
  });

  it('should dispatch a LoadCompanyIndustries action on init', () => {
    const expectedAction = new fromCompanyIndustriesActions.LoadCompanyIndustries;

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should set companyIndustries on init', () => {
    const expectedCompanyIndustries = ['MockCompanyIndustryOne', 'MockCompanyIndustryTwo', 'MockCompanyIndustryThree'];
    instance.companyIndustries$ = of(expectedCompanyIndustries);

    fixture.detectChanges();

    expect(instance.companyIndustries).toEqual(expectedCompanyIndustries);
    expect(instance.companyIndustriesFiltered).toEqual(expectedCompanyIndustries);
  });

  it(`should update companyIndustriesFiltered when handleIndustryFilterChange is called`, () => {
    const mockCompanyIndustries = ['MockCompanyIndustryOne', 'MockCompanyIndustryTwo', 'MockCompanyIndustryThree'];
    const expectedCompanyIndustries = ['MockCompanyIndustryOne'];
    const mockFilterValue = 'MockCompanyIndustryOne';

    instance.companyIndustries$ = of(mockCompanyIndustries);

    fixture.detectChanges();

    instance.handleIndustryFilterChange(mockFilterValue);

    expect(instance.companyIndustriesFiltered).toEqual(expectedCompanyIndustries);
  });

  it(`should set the value of the industry form control when handleCompanyIndustryValueChange is called`, () => {
    const expectedCompanyIndustry = 'MockCompanyIndustry';

    fixture.detectChanges();

    instance.handleCompanyIndustryValueChange(expectedCompanyIndustry);

    const childInustryFormControl = instance.requestCompanyForm.get('newCompanyForm').get('industry');
    expect(childInustryFormControl.value).toEqual(expectedCompanyIndustry);
  });
});
