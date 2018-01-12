import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';
import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/common/core/actions/grid.actions';

import * as fromPeerMainReducer from '../../reducers';
import { ExchangeJobMappingService } from '../../services';
import { ExchangeJobMappingGridComponent } from './exchange-job-mapping-grid.component';

describe('Peer - Exchange Job Mapping Grid', () => {
  let fixture: ComponentFixture<ExchangeJobMappingGridComponent>;
  let instance: ExchangeJobMappingGridComponent;

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
          provide: ExchangeJobMappingService,
          useValue: { loadExchangeJobMappings: jest.fn() }
        }
      ],
      declarations: [
        ExchangeJobMappingGridComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    exchangeJobMappingService = TestBed.get(ExchangeJobMappingService);

    fixture = TestBed.createComponent(ExchangeJobMappingGridComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should call loadExchangeJobMappings with the exchangeId when the component is initialized', () => {
    spyOn(exchangeJobMappingService, 'loadExchangeJobMappings');

    instance.exchangeId = 1;
    fixture.detectChanges();

    expect(exchangeJobMappingService.loadExchangeJobMappings).toHaveBeenCalledWith(instance.exchangeId);
  });

  it('should dispatch a page change grid action when handlePageChanged is called', () => {
    const pageChangeEvent: PageChangeEvent = { skip: 10, take: 20 };
    const action = new fromGridActions.PageChange(GridTypeEnum.ExchangeJobMapping, pageChangeEvent);

    instance.handlePageChanged(pageChangeEvent);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeJobMappings with the exchangeId when handlePageChanged is called', () => {
    const pageChangeEvent: PageChangeEvent = { skip: 10, take: 20 };

    // Trigger ngOnInit here and spy on the service afterwards so that we don't get unexpected results
    instance.exchangeId = 1;
    fixture.detectChanges();

    spyOn(exchangeJobMappingService, 'loadExchangeJobMappings');

    instance.handlePageChanged(pageChangeEvent);

    fixture.detectChanges();

    expect(exchangeJobMappingService.loadExchangeJobMappings).toHaveBeenCalledWith(instance.exchangeId);
  });

  it('should dispatch a sort change grid action when handleSortChanged is called', () => {
    const sortDescriptor: SortDescriptor[] = [{ field: 'Status', dir: 'asc' }];
    const action = new fromGridActions.SortChange(GridTypeEnum.ExchangeJobMapping, sortDescriptor);

    instance.handleSortChanged(sortDescriptor);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeJobMappings with the exchangeId when handleSortChanged is called', () => {
    const sortDescriptor: SortDescriptor[] = [{ field: 'Status', dir: 'asc' }];

    // Trigger ngOnInit here and spy on the service afterwards so that we don't get unexpected results
    instance.exchangeId = 1;
    fixture.detectChanges();

    spyOn(exchangeJobMappingService, 'loadExchangeJobMappings');

    instance.handleSortChanged(sortDescriptor);

    fixture.detectChanges();

    expect(exchangeJobMappingService.loadExchangeJobMappings).toHaveBeenCalledWith(instance.exchangeId);
  });



});
