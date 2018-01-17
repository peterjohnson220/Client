import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Store, combineReducers, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobMappingActions from '../../../actions/exchange-job-mapping.actions';
import * as fromPeerMainReducer from '../../../reducers';
import { ExchangeJobMappingPageComponent } from './exchange-job-mapping.page';
import { ExchangeJobMappingService } from '../../../services';

describe('Peer - Exchange Job Mapping Page', () => {
  let fixture: ComponentFixture<ExchangeJobMappingPageComponent>;
  let instance: ExchangeJobMappingPageComponent;

  let activatedRoute: ActivatedRoute;
  let exchangeJobMappingService: ExchangeJobMappingService;
  let store: Store<fromPeerMainReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerMain: combineReducers(fromPeerMainReducer.reducers)
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
  });

  it('should dispatch a reset grid action when handleBackToListNavigation is called', () => {
    const action = new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobMapping);

    instance.handleBackToListNavigation();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a page change grid action when handleSearchChanged is called', () => {
    const action = new fromGridActions.PageChange(GridTypeEnum.ExchangeJobMapping, { skip: 0, take: 20 });

    instance.handleSearchChanged('New Search');

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a UpdateExchangeJobMappingsQuery action when handleSearchChanged is called', () => {
    const query = 'New Search';
    const action = new fromExchangeJobMappingActions.UpdateExchangeJobMappingsQuery(query);

    instance.handleSearchChanged(query);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeJobMappings with the exchangeId when handleSearchChanged is called', () => {
    spyOn(exchangeJobMappingService, 'loadExchangeJobMappings');

    instance.handleSearchChanged('New Search');

    expect(exchangeJobMappingService.loadExchangeJobMappings).toHaveBeenCalledWith(activatedRoute.snapshot.params.id);
  });

});
