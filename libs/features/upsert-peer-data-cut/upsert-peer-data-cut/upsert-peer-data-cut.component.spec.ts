import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/internal/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromLibsExchangeExplorerFilterContextActions from 'libs/features/peer/exchange-explorer/actions/exchange-filter-context.actions';
import { generateMockExchangeMapResponse, generateMockExchangeStatCompanyMakeup } from 'libs/models/peer';
import { SettingsService } from 'libs/state/app-context/services';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';

import { UpsertPeerDataCutComponent } from './upsert-peer-data-cut.component';
import * as fromUpsertPeerDataCutActions from '../actions/upsert-peer-data-cut.actions';
import * as fromUpsertPeerDataCutReducer from '../reducers';
import * as fromRequestPeerAccessActions from '../actions/request-peer-access.actions';
import { UpsertPeerDataCutEntities, UpsertPeerDataCutParentEntities } from '../constants';
import { UpsertPeerDataCutEntityConfigurationModel } from '../models';
import { ExchangeExplorerComponent } from '../../peer/exchange-explorer/containers/exchange-explorer';


class DojGuidelinesStub {
  passing = true;

  get passesGuidelines(): boolean {
    return this.passing;
  }

  validateDataCut(selections: any) {
    return;
  }

  clearMapCompanies() {
    return;
  }
}

@Component({
  selector: 'pf-exchange-explorer',
  template: ''
})
class ExchangeExplorerStubComponent {
  onMessage(event: MessageEvent) {
    return;
  }
}

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

describe('Libs - Upsert Peer Data Cut', () => {
  let fixture: ComponentFixture<UpsertPeerDataCutComponent>;
  let instance: UpsertPeerDataCutComponent;
  let store: Store<fromRootState.State>;
  let route: ActivatedRoute;
  let guidelinesService: DojGuidelinesStub;
  const mockDataCutGUID = 'MockCutGUID';
  let dataCutGuid = null;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_peer_exchangeExplorer: combineReducers(fromLibsPeerExchangeExplorerReducers.reducers),
          peer_upsertDataCut: combineReducers(fromUpsertPeerDataCutReducer.reducers)
        })
      ],
      providers: [
        {
          provide: ActivatedRoute
        },
        { provide: DojGuidelinesService, useClass: DojGuidelinesStub },
        { provide: SettingsService, useClass: SettingsService }
      ],
      declarations: [
        UpsertPeerDataCutComponent,
        ExchangeExplorerStubComponent
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRoute);
    // TODO: Resolve type mismatch here and use .inject
    guidelinesService = TestBed.get(DojGuidelinesService);
    // exchangeStub = TestBed.inject(ExchangeExplorerComponent);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UpsertPeerDataCutComponent);
    instance = fixture.componentInstance;
    instance.exchangeExplorer = TestBed.createComponent(ExchangeExplorerStubComponent).componentInstance as ExchangeExplorerComponent;
    instance.untaggedIncumbentCount$ = of(0);
    instance.hasRequestedPeerAccess$ = of(false);
    instance.hasAcceptedPeerTerms$ = of(true);

    instance.displayInClassicAspIframe = false;

    // instance.exchangeExplorer = exchangeStub;
    // exchangeExplorer = instance.exchangeExplorer;

    instance.companyPayMarketId = 1;
    instance.companyJobId = 2;
    instance.entityConfiguration = {
      ParentEntityId: 3,
      ParentEntity: UpsertPeerDataCutParentEntities.Projects,
      BaseEntity: UpsertPeerDataCutEntities.ProjectJobs,
      BaseEntityId: 1
    };
    instance.isPayMarketOverride = false;
    instance.cutGuid = null;
    instance.displayMap = false;

  });

  it('should display the upsert data cut page with an Add button', () => {
    dataCutGuid = null;
    instance.cutGuid = dataCutGuid;
    instance.displayMap = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display the upsert data cut page with an Update button', () => {
    dataCutGuid = mockDataCutGUID;
    instance.cutGuid = dataCutGuid;
    instance.displayMap = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  // The following 2 tests have clashes with MapBox. There is an ngIf on the child exchange explorer component in the html template
  // It is needed so the map sizes accordingly, without it the map takes a fraction of the intended space
  // These 2 tests require the ViewChild definition to be static, however that breaks the functionality of the app.
  // Commenting tests until better solution can be found

  /*it(`should call onMessage on the exchange explorer on init to set the context if being displayed in classic ASP iframe`, () => {
    dataCutGuid = null;
    instance.cutGuid = dataCutGuid;
    instance.displayInClassicAspIframe = true;
    instance.displayMap = true;

    const expectedSetContextMessage: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: {
            companyJobId: 2,
            companyPayMarketId: 1,
            userSessionId: 3,
            isPayMarketOverride: false,
            cutGuid: null,
            isExchangeSpecific: false
          }
        }
      }
    } as MessageEvent;

    spyOn(instance.exchangeExplorer, 'onMessage');

    fixture.detectChanges();

    expect(instance.exchangeExplorer.onMessage).toHaveBeenCalledWith(expectedSetContextMessage);
  });

  it('should dispatch the LoadDataCutValidation action on init', () => {
    instance.displayInClassicAspIframe = true;
    instance.displayMap = true;
    const mockEntityConfig: UpsertPeerDataCutEntityConfigurationModel = {
      ParentEntity: UpsertPeerDataCutParentEntities.Projects,
      ParentEntityId: 3,
      BaseEntity: UpsertPeerDataCutEntities.ProjectJobs,
      BaseEntityId: 0
    };

    const expectedAction = new fromDataCutValidationActions.LoadDataCutValidation({
      CompanyJobId: 2,
      EntityConfiguration: mockEntityConfig
    });

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });*/

  it('should dispatch the upsert data cut action when clicking add', () => {
    dataCutGuid = null;
    instance.cutGuid = dataCutGuid;
    instance.displayMap = true;
    const mockEntityConfig: UpsertPeerDataCutEntityConfigurationModel = {
      ParentEntity: UpsertPeerDataCutParentEntities.Projects,
      ParentEntityId: 3,
      BaseEntity: UpsertPeerDataCutEntities.ProjectJobs,
      BaseEntityId: 1
    };
    const expectedAction = new fromUpsertPeerDataCutActions.UpsertDataCut({
      DataCutGuid: dataCutGuid,
      CompanyJobId: 2,
      CompanyPayMarketId: 1,
      IsPayMarketOverride: false,
      EntityConfiguration: mockEntityConfig,
      ZoomLevel: 0,
      BaseEntityId: 1
    });

    fixture.detectChanges();
    instance.upsert();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the upsert data cut action when clicking update', () => {
    dataCutGuid = mockDataCutGUID;
    instance.cutGuid = dataCutGuid;
    instance.displayMap = true;
    const mockEntityConfig: UpsertPeerDataCutEntityConfigurationModel = {
      ParentEntity: UpsertPeerDataCutParentEntities.Projects,
      ParentEntityId: 3,
      BaseEntity: UpsertPeerDataCutEntities.ProjectJobs,
      BaseEntityId: 1
    };
    const expectedAction = new fromUpsertPeerDataCutActions.UpsertDataCut({
      DataCutGuid: dataCutGuid,
      CompanyJobId: 2,
      CompanyPayMarketId: 1,
      IsPayMarketOverride: false,
      EntityConfiguration: mockEntityConfig,
      ZoomLevel: 0,
      BaseEntityId: 1
    });

    fixture.detectChanges();
    instance.upsert();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the cancel action when clicking cancel', () => {
    const expectedAction = new fromUpsertPeerDataCutActions.CancelUpsertDataCut();

    instance.cancel();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should enable the add button when passesGuidelines is true', () => {
    const mapResponse = generateMockExchangeMapResponse();

    dataCutGuid = null;
    instance.cutGuid = dataCutGuid;
    mapResponse.MapSummary.OverallMapStats.CompanyCount = 5;

    guidelinesService.passing = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should enable the update button when passesGuidelines is true', () => {
    dataCutGuid = mockDataCutGUID;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should call validateDataCut when map summary changes changes', () => {
    const payload = generateMockExchangeStatCompanyMakeup();
    dataCutGuid = null;
    instance.displayMap = true;
    instance.cutGuid = dataCutGuid;
    instance.peerMapCompanies$ = of(payload);

    const mockEntityConfig: UpsertPeerDataCutEntityConfigurationModel = {
      ParentEntity: UpsertPeerDataCutParentEntities.Projects,
      ParentEntityId: 3,
      BaseEntity: UpsertPeerDataCutEntities.ProjectJobs,
      BaseEntityId: 1
    };

    spyOn(guidelinesService, 'validateDataCut');

    fixture.detectChanges();

    expect(guidelinesService.validateDataCut).toHaveBeenCalledWith(payload, 2, mockEntityConfig, null);
  });

  it('should disable the add/updated button when passesGuidelines is false', () => {
    dataCutGuid = null;
    instance.cutGuid = dataCutGuid;
    guidelinesService.passing = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should display untagged incumbents filter when untaggedIncumbentCount$ > 0`, () => {
    instance.includeUntaggedIncumbents$ = of(false);
    instance.untaggedIncumbentCount$ = of(1);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should dispatch a ToggleIncludeUntaggedEmployees action when handleUntaggedIncumbentsChecked is called`, () => {
    const expectedAction = new fromLibsExchangeExplorerFilterContextActions.ToggleIncludeUntaggedEmployees();

    instance.includeUntaggedIncumbents$ = of(false);
    instance.untaggedIncumbentCount$ = of(1);

    fixture.detectChanges();

    instance.handleUntaggedIncumbentsChecked();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch a RequestAccess action when requestAccess is called`, () => {
    const expectedAction = new fromRequestPeerAccessActions.RequestPeerAccess();

    fixture.detectChanges();

    instance.requestPeerAccess();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should show 'Request Access' button and message when peer terms haven't been accepted`, () => {
    instance.hasAcceptedPeerTerms$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should show disabled 'Requesting Access' button when peer terms haven't been accepted and access
  is being requested`, () => {
    instance.hasAcceptedPeerTerms$ = of(false);
    instance.requestingPeerAccess$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should show disabled 'Access Requested' button and 'Access Requested' message when
  peer terms haven't been accepted and access has been requested`, () => {
    instance.hasAcceptedPeerTerms$ = of(false);
    instance.hasRequestedPeerAccess$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
