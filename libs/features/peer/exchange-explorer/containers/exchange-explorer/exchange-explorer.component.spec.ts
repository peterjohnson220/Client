import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { SettingsService } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromChildSearchFilterActions from 'libs/features/search/search/actions/child-filter.actions';
import { generateMockPayMarket } from 'libs/models/paymarket';

import { ExchangeExplorerComponent } from './exchange-explorer.component';
import * as fromExchangeExplorerReducer from '../../reducers';
import * as fromExchangeFilterContextActions from '../../actions/exchange-filter-context.actions';
import { generateMockExchangeJobExchangeDetail } from '../../../models';
import * as fromExchangeExplorerContextInfoActions from '../../actions/exchange-explorer-context-info.actions';
import * as fromExchangeExplorerDataCutsActions from '../../actions/exchange-data-cut.actions';

describe('Libs - Features - Peer - Exchange Explorer', () => {
  let fixture: ComponentFixture<ExchangeExplorerComponent>;
  let instance: ExchangeExplorerComponent;
  let store: Store<fromRootState.State>;
  let router: Router;
  let route: ActivatedRoute;
  let settingsService: SettingsService;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addJobs: combineReducers(fromExchangeExplorerReducer.reducers),
        }),
        NgbProgressbarModule
      ],
      declarations: [
        ExchangeExplorerComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { url: 'fake-path/' }
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: SettingsService,
          useClass: SettingsService,
          useValue: { selectUiPersistenceSettingFromDictionary: jest.fn().mockReturnValue(of(1)) }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    settingsService = TestBed.inject(SettingsService);

    fixture = TestBed.createComponent(ExchangeExplorerComponent);
    instance = fixture.componentInstance;
  });

  it('should load the exchange explorer with default options', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the exchange job selector if jobSelectorRequiresPayMarket is false and there are values in exchangeJobFilterOptions$', () => {
    const mockEJED = [generateMockExchangeJobExchangeDetail()];
    instance.shouldShowPayMarketBoundsFilter = true;
    instance.exchangeJobFilterOptions$ = of(mockEJED);
    instance.jobSelectorRequiresPayMarket = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the exchange job selector if there is a payMarket and there are values in exchangeJobFilterOptions$', () => {
    const mockPayMarket = generateMockPayMarket();
    const mockEJED = [generateMockExchangeJobExchangeDetail()];
    instance.shouldShowPayMarketBoundsFilter = true;
    instance.exchangeJobFilterOptions$ = of(mockEJED);
    instance.payMarket$ = of(mockPayMarket);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the paymarket bounds filter if there is a payMarket and shouldShowPayMarketBoundsFilter is set to true', () => {
    const mockPayMarket = generateMockPayMarket();
    instance.shouldShowPayMarketBoundsFilter = true;
    instance.payMarket$ = of(mockPayMarket);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a disabled paymarket bounds filter if there is a payMarket, shouldShowPayMarketBoundsFilter is set to true ' +
           'and limitToPaymarket$ is false', () => {
    const mockPayMarket = generateMockPayMarket();
    instance.shouldShowPayMarketBoundsFilter = true;
    instance.payMarket$ = of(mockPayMarket);
    instance.limitToPayMarket$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the exclude indirect matches filter if shouldShowExcludeIndirectJobMatchesFilter is true and hasAdditionalJobLevels$ is not true', () => {
    instance.shouldShowExcludeIndirectJobMatchesFilter = true;
    instance.hasAdditionalJobLevels$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the exchange scope selector if there is a payMarket and shouldShowExchangeScopeSelector is set to true', () => {
    const mockPayMarket = generateMockPayMarket();
    instance.payMarket$ = of(mockPayMarket);
    instance.shouldShowExchangeScopeSelector = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show pf-single-filter if searchingFilter$ is true', () => {
    instance.searchingFilter$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show pf-child-filter if searchingChildFilters$ is true', () => {
    instance.searchingChildFilters$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a ToggleLimitToPayMarket action when handleLimitToPayMarketToggled called', () => {
    const expectedAction = new fromExchangeFilterContextActions.ToggleLimitToPayMarket();

    spyOn(store, 'dispatch');

    instance.handleLimitToPayMarketToggled();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ToggleExcludeIndirectJobMatches action when handleIncludeAdditionalJobLevelsToggled called', () => {
    const expectedAction = new fromExchangeFilterContextActions.ToggleExcludeIndirectJobMatches();

    spyOn(store, 'dispatch');

    instance.handleIncludeAdditionalJobLevelsToggled();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ClearFilters action when handleClearFilters called', () => {
    const expectedAction = new fromSearchFiltersActions.ClearFilters();

    spyOn(store, 'dispatch');

    instance.handleClearFilters();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ClearResults action when onResetApp called', () => {
    const expectedAction = new fromSearchResultsActions.ClearResults();

    spyOn(store, 'dispatch');

    instance.onResetApp();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a RefreshPayMarketContext action when handleExchangeJobSelected called and companyJobId and companyPayMarketId are not null', () => {
    const payload = {exchangeJobId: 1, similarExchangeJobIds: [1]};
    instance.companyJobId = 1;
    instance.companyPayMarketId = 1;

    const systemFilterRequest = {
      companyJobId: 1,
      companyPayMarketId: 1,
      exchangeJobId: 1
    };

    const expectedAction = new fromExchangeExplorerContextInfoActions.RefreshPayMarketContext(systemFilterRequest);

    spyOn(store, 'dispatch');

    instance.handleExchangeJobSelected(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a different RefreshPayMarketContext action when handleExchangeJobSelected called and companyJobId and cutGuid are not null', () => {
    const payload = {exchangeJobId: 1, similarExchangeJobIds: [1]};
    instance.companyJobId = 1;
    instance.companyPayMarketId = null;
    instance.cutGuid = '1';

    const systemFilterRequest = {
      companyJobId: 1,
      exchangeJobId: 1,
      cutGuid: '1',
    };

    const expectedAction = new fromExchangeExplorerContextInfoActions.RefreshPayMarketContext(systemFilterRequest);

    spyOn(store, 'dispatch');

    instance.handleExchangeJobSelected(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a SetExchangeJobSelection action when handleExchangeJobSelected called and companyJobId is null', () => {
    const payload = {exchangeJobId: 1, similarExchangeJobIds: [1]};
    instance.companyJobId = null;

    const expectedAction = new fromExchangeFilterContextActions.SetExchangeJobSelection(payload);

    spyOn(store, 'dispatch');

    instance.handleExchangeJobSelected(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ToggleChildFilterSearch action when handleMapClicked is called and searchingChildFilter is true', () => {
    instance.searchingChildFilters$ = of(true);

    const expectedAction = new fromSearchPageActions.ToggleChildFilterSearch();

    spyOn(store, 'dispatch');

    instance.handleMapClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ClearChildFilter action when handleMapClicked is called and searchingChildFilter is true', () => {
    instance.searchingChildFilters$ = of(true);

    const expectedAction = new fromChildSearchFilterActions.ClearChildFilter();

    spyOn(store, 'dispatch');

    instance.handleMapClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadExchangeDataCut action when onSetContext is called and payload.cutGuid is not empty', () => {
    const payload = {cutGuid: '1', companyJobId: 1};

    const systemFilterRequest = {
      exchangeDataCutGuid: '1',
      companyJobId: 1
    };

    const expectedAction = new fromExchangeExplorerDataCutsActions.LoadExchangeDataCut(systemFilterRequest);

    spyOn(store, 'dispatch');

    instance.onSetContext(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadContextInfo action when onSetContext is called and isExchangeSpecific is true and exchangeJobId exists', () => {
    const payload = {
      companyJobId: 1,
      companyPayMarketId: 1,
      isExchangeSpecific: true,
      exchangeId: 1,
      exchangeJobId: 1
    };

    const request = {
      ExchangeId : 1,
      ExchangeJobId : 1,
      CompanyPayMarketId : 1
    };

    const expectedAction = new fromExchangeExplorerContextInfoActions.LoadContextInfo(request);

    spyOn(store, 'dispatch');

    instance.onSetContext(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadContextInfo action when onSetContext is called and there is no exchangeJobId', () => {
    const payload = {
      companyJobId: 1,
      companyPayMarketId: 1,
      isExchangeSpecific: true,
      exchangeId: 1
    };

    const request = {
      exchangeId: 1,
      defaultScopeId: null
    };

    const expectedAction = new fromExchangeExplorerContextInfoActions.LoadContextInfo(request);

    spyOn(store, 'dispatch');

    instance.onSetContext(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadContextInfo action when onSetContext is called and isExchangeSpecific is false', () => {
    const payload = {
      companyJobId: 1,
      companyPayMarketId: 1,
      isExchangeSpecific: false
    };

    const systemFilterRequest = {
      companyJobId: 1,
      companyPayMarketId: 1
    };

    const expectedAction = new fromExchangeExplorerContextInfoActions.LoadContextInfo(systemFilterRequest);

    spyOn(store, 'dispatch');

    instance.onSetContext(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
