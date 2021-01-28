import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { CompanySecurityApiService } from 'libs/data/payfactors-api/security/company-security-api.service';
import { SettingsService } from 'libs/state/app-context/services';
import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';

import * as fromExchangeJobMappingGridActions from '../../../actions/exchange-job-mapping-grid.actions';
import * as fromPeerManagementReducer from '../../../reducers';
import { ExchangeJobMappingPageComponent } from './exchange-job-mapping.page';
import { ExchangeJobMappingGridService} from '../../../services/exchange-job-mapping-grid.service';


describe('Peer - Exchange Job Mapping Page', () => {
  let fixture: ComponentFixture<ExchangeJobMappingPageComponent>;
  let instance: ExchangeJobMappingPageComponent;

  let activatedRoute: ActivatedRoute;
  let exchangeJobMappingGridService: ExchangeJobMappingGridService;
  let store: Store<fromPeerManagementReducer.State>;
  let abstractFeatureFlagService: AbstractFeatureFlagService;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_manage: combineReducers(fromPeerManagementReducer.reducers)
        }),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            queryParams: of({}),
            snapshot: {
              params: { id: 1 }
            }
          },
        },
        {
          provide: ExchangeJobMappingGridService,
          useValue: { loadExchangeJobMappings: jest.fn() }
        },
        {
          provide: CompanySecurityApiService,
          useValue: { getIsCompanyAdmin: () => of(true) }
        },
        SettingsService,
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        }
      ],
      declarations: [
        ExchangeJobMappingPageComponent
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exchangeJobMappingGridService = TestBed.inject(ExchangeJobMappingGridService);

    fixture = TestBed.createComponent(ExchangeJobMappingPageComponent);
    instance = fixture.componentInstance;
    abstractFeatureFlagService = TestBed.inject(AbstractFeatureFlagService);

    spyOn(store, 'dispatch');

    // Trigger ngOnInit
    fixture.detectChanges();
  });

  it('should dispatch a reset grid action when destroying', () => {
    const action = new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobMapping);

    instance.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a UpdateFilter action when handleSearchBoxValueChanged is called', () => {
    const query = 'New Search';
    const action = new fromGridActions.UpdateFilter(
      GridTypeEnum.ExchangeJobMapping,
      { columnName: 'ExchangeJobTitle', value: query }
    );

    instance.handleSearchChanged(query);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeJobMappings with the exchangeId when handleSearchBoxValueChanged is called', () => {
    spyOn(exchangeJobMappingGridService, 'loadExchangeJobMappings');

    instance.handleSearchChanged('New Search');

    expect(exchangeJobMappingGridService.loadExchangeJobMappings).toHaveBeenCalled();
  });

  it('should apply a collapse-grid class to the exchange-job-mapping-grid-container, when collapse is true', () => {
    instance.collapse = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch an UpdatePageRowIndexToScrollTo action with null, when handling exchange job mapping info closed', () => {
    const action = new fromExchangeJobMappingGridActions.UpdatePageRowIndexToScrollTo(null);

    instance.handleExchangeJobMappingInfoClosed();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should set collapse to false after the exchange job mapping info is closed', () => {
    instance.collapse = true;

    instance.handleExchangeJobMappingInfoClosed();

    expect(instance.collapse).toBe(false);
  });

  it('should show the correct header message and company jobs grid when the company jobs grid is enabled', () => {
    instance.showCompanyJobs = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the correct header message and exchange jobs grid when the company jobs grid is disabled', () => {
    instance.showCompanyJobs = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
