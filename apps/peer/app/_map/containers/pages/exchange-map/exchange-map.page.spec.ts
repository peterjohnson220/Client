import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import {  generateMockExchange } from 'libs/models/peer';
import {
  generateMockUpsertExchangeExplorerScopeRequest, UpsertExchangeExplorerScopeRequest} from 'libs/models/peer/requests/upsert-exchange-scope-request.model';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { ExchangeExplorerComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer';
import { ExchangeExplorerMapComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer-map';
import * as fromLibsRootState from 'libs/state/state';
import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromLibsPeerExchangeExplorerActions from 'libs/features/peer/exchange-explorer/actions/exchange-explorer.actions';
import * as fromLibsPeerExchangeExplorerExchangeScopeActions from 'libs/features/peer/exchange-explorer/actions/exchange-scope.actions';

import { ExchangeMapPageComponent } from './exchange-map.page';
import * as fromPeerMapReducer from '../../../reducers';
import * as fromSharedPeerReducer from '../../../../shared/reducers';
import * as fromSharedPeerExchangeActions from '../../../../shared/actions/exchange.actions';
import * as fromExchangeScopeActions from '../../../actions/exchange-scope.actions';
import * as fromExportDataCutsActions from '../../../actions/export-data-cuts.actions';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

describe('Peer - Map - Exchange Map Page', () => {
  const mockUpsertExchangeScopeRequest: UpsertExchangeExplorerScopeRequest = generateMockUpsertExchangeExplorerScopeRequest();
  let fixture: ComponentFixture<ExchangeMapPageComponent>;
  let instance: ExchangeMapPageComponent;
  let exchangeExplorer: ExchangeExplorerComponent;
  let store: Store<fromLibsRootState.State>;
  let route: ActivatedRoute;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromLibsRootState.reducers,
          peer_shared: combineReducers(fromSharedPeerReducer.reducers),
          peer_map: combineReducers(fromPeerMapReducer.reducers),
          feature_peer_exchangeExplorer: combineReducers(fromLibsPeerExchangeExplorerReducers.reducers)
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id : 1 } } },
        },
        {
          provide: ExchangeExplorerContextService,
          useValue: {selectFilterContext: jest.fn(), selectCountOfCompanyFiltersSelected: jest.fn()}
        }
      ],
      declarations: [
        ExchangeMapPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRoute);


    fixture = TestBed.createComponent(ExchangeMapPageComponent);
    instance = fixture.componentInstance;
    instance.map = {getZoomLevel() {
      return mockUpsertExchangeScopeRequest.ExchangeDataSearchRequest.FilterContext.ZoomLevel;
    }} as ExchangeExplorerMapComponent;
    instance.numberOfCompanySelections$ = of(0);
    instance.numberOfSelections$ = of(1);
    instance.peerMapCompaniesCount$ = of(5);
    store.dispatch(new fromSharedPeerExchangeActions.LoadExchangeSuccess(
      { exchange: generateMockExchange(), path: 'manage' }
    ));
    instance.exchangeExplorer = {
      onMessage: jest.fn
    } as any;
    exchangeExplorer = instance.exchangeExplorer;
  });

  it('should show the exchange name as the page title', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should set exchange explorer context upon Init', () => {
    const expectedContext: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: {
            exchangeId: instance.exchangeId,
            isExchangeSpecific: true
          }
        }
      }
    } as MessageEvent;

    spyOn(exchangeExplorer, 'onMessage');

    fixture.detectChanges();

    expect(exchangeExplorer.onMessage).toHaveBeenCalledWith(expectedContext);
  });


  it('should dispatch a ResetExchangeExplorerState action upon destroy', () => {
    const expectedAction = new fromLibsPeerExchangeExplorerActions.ResetExchangeExplorerState();

    spyOn(store, 'dispatch');

    instance.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch an UpsertExchangeScope action when handleUpsertExchangeScopeEvent is triggered`, () => {
    const expectedAction = new fromLibsPeerExchangeExplorerExchangeScopeActions.UpsertExchangeScope({
      ExchangeId: instance.exchangeId,
      ExchangeScopeGuid: null,
      ExchangeScopeName: mockUpsertExchangeScopeRequest.ExchangeScopeDetails.ExchangeScopeName,
      ExchangeScopeDescription: mockUpsertExchangeScopeRequest.ExchangeScopeDetails.ExchangeScopeDescription,
      IsDefault: mockUpsertExchangeScopeRequest.ExchangeScopeDetails.IsDefault
    });

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleUpsertExchangeScopeEvent({
      Name: mockUpsertExchangeScopeRequest.ExchangeScopeDetails.ExchangeScopeName,
      Description: mockUpsertExchangeScopeRequest.ExchangeScopeDetails.ExchangeScopeDescription,
      IsDefault: mockUpsertExchangeScopeRequest.ExchangeScopeDetails.IsDefault
    });

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch an OpenSaveExchangeScopeModal action when handleSaveScopeClick is triggered`, () => {
    const expectedAction = new fromExchangeScopeActions.OpenSaveExchangeScopeModal();

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleSaveScopeClick();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch an OpenExportDataCutsModal action when handleExportDataCutsClick is triggered`, () => {
    const expectedAction = new fromExportDataCutsActions.OpenExportDataCutsModal();

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleExportDataCutsClick();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should display a disabled Create Scope button when numberOfCompanySelections$ is > 0 and < 5', () => {
    instance.numberOfCompanySelections$ = of(1);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display a disabled Create Scope button when numberOfSelections$ is  0', () => {
    instance.numberOfSelections$ = of(0);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display a disabled Export Data Cuts Button when peerMapCompaniesCount$ is < 5', () => {
    instance.peerMapCompaniesCount$ = of(1);
    instance.exchangeJobIdsInScope$ = of([1]);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display a disabled Export Data Cuts Button when exchangeJobIdsInScope$ is empty or null', () => {
    instance.peerMapCompaniesCount$ = of(6);
    instance.exchangeJobIdsInScope$ = of(null);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
