import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { GridTypeEnum } from 'libs/models/common/index';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobMappingGridActions from '../../../actions/exchange-job-mapping-grid.actions';
import * as fromPeerManagementReducer from '../../../reducers';
import { ExchangeJobMappingService } from '../../../services';
import { ExchangeJobMappingPageComponent } from './exchange-job-mapping.page';

describe('Peer - Exchange Job Mapping Page', () => {
  let fixture: ComponentFixture<ExchangeJobMappingPageComponent>;
  let instance: ExchangeJobMappingPageComponent;

  let activatedRoute: ActivatedRoute;
  let exchangeJobMappingService: ExchangeJobMappingService;
  let store: Store<fromPeerManagementReducer.State>;

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
          useValue: { snapshot: { params: { id : 1 } } },
        },
        {
          provide: ExchangeJobMappingService,
          useValue: { loadExchangeJobMappings: jest.fn() }
        }
      ],
      declarations: [
        ExchangeJobMappingPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);
    exchangeJobMappingService = TestBed.get(ExchangeJobMappingService);

    fixture = TestBed.createComponent(ExchangeJobMappingPageComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');

    // Trigger ngOnInit
    fixture.detectChanges();
  });

  it('should dispatch a reset grid action when handleBackToListNavigation is called', () => {
    const action = new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobMapping);

    instance.handleBackToListNavigation();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a UpdateFilter action when handleSearchChanged is called', () => {
    const query = 'New Search';
    const action = new fromGridActions.UpdateFilter(
      GridTypeEnum.ExchangeJobMapping,
      {columnName: 'ExchangeJobTitle', value: query}
    );

    instance.handleSearchChanged(query);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeJobMappings with the exchangeId when handleSearchChanged is called', () => {
    spyOn(exchangeJobMappingService, 'loadExchangeJobMappings');

    instance.handleSearchChanged('New Search');

    expect(exchangeJobMappingService.loadExchangeJobMappings).toHaveBeenCalledWith(activatedRoute.snapshot.params.id);
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
});
