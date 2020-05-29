import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { GridTypeEnum, generateMockExchangeJobMapping } from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobMappingGridActions from '../../actions/exchange-job-mapping-grid.actions';
import * as fromPeerManagementReducer from '../../reducers';
import { ExchangeJobMappingService } from '../../services';
import { ExchangeJobMappingGridComponent } from './exchange-job-mapping-grid.component';

describe('Peer - Exchange Job Mapping Grid', () => {
  let fixture: ComponentFixture<ExchangeJobMappingGridComponent>;
  let instance: ExchangeJobMappingGridComponent;

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
          provide: ExchangeJobMappingService,
          useValue: { loadExchangeJobMappings: jest.fn() }
        }
      ],
      declarations: [
        ExchangeJobMappingGridComponent
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    exchangeJobMappingService = TestBed.inject(ExchangeJobMappingService);

    fixture = TestBed.createComponent(ExchangeJobMappingGridComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should call loadExchangeJobMappings with the exchangeId when the component is initialized', () => {
    fixture.detectChanges();

    const action = new fromExchangeJobMappingGridActions.LoadExchangeJobMappings();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a page change grid action when handlePageChanged is called', () => {
    // Trigger ngOnInit so that ngOnDestory doesn't fail
    fixture.detectChanges();

    const pageChangeEvent: DataStateChangeEvent = { skip: 10, take: 20 };
    const action = new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeJobMapping, pageChangeEvent);

    instance.onDataStateChange(pageChangeEvent);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeJobMappings with the exchangeId when handlePageChanged is called', () => {
    const pageChangeEvent: DataStateChangeEvent = { skip: 10, take: 20 };

    // Trigger ngOnInit here and spy on the service afterwards so that we don't get unexpected results
    instance.exchangeId = 1;
    fixture.detectChanges();


    instance.onDataStateChange(pageChangeEvent);

    fixture.detectChanges();
    const action = new fromExchangeJobMappingGridActions.LoadExchangeJobMappings();
    expect(store.dispatch).toHaveBeenCalledWith(action);
      });

  it('should dispatch a sort change grid action when handleSortChanged is called', () => {
    // Trigger ngOnInit so that ngOnDestory doesn't fail
    fixture.detectChanges();

    const sortDescriptor: DataStateChangeEvent = {
      skip: 0, take: 10, sort: [{ field: 'Status', dir: 'asc' }]
    };

    const action = new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeJobMapping, sortDescriptor);

    instance.onDataStateChange(sortDescriptor);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeJobMappings with the exchangeId when handleSortChanged is called', () => {
    const sortDescriptor: DataStateChangeEvent = {
      sort: [{ field: 'Status', dir: 'asc' }], skip: 0, take: 10
    };

    // Trigger ngOnInit here and spy on the service afterwards so that we don't get unexpected results
    instance.exchangeId = 1;
    fixture.detectChanges();

    instance.onDataStateChange(sortDescriptor);

    fixture.detectChanges();

    const action = new fromExchangeJobMappingGridActions.LoadExchangeJobMappings();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a SetActiveExchangeJob action with the dataItem received, when handling a cell click', () => {
    // Trigger ngOnInit so that ngOnDestory doesn't fail
    fixture.detectChanges();

    const event = { dataItem: generateMockExchangeJobMapping(), rowIndex: 1 };
    const action = new fromExchangeJobMappingGridActions.SetActiveExchangeJob(event.dataItem);

    instance.exchangeJobMappingGridState = { skip: 0 };
    instance.onCellClick(event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it(`should not dispatch a SetActiveExchangeJob action when the dataItem received is a PendingRequest,
  when handling a cell click`, () => {
      // Trigger ngOnInit so that ngOnDestory doesn't fail
      fixture.detectChanges();

      const event = { dataItem: { ...generateMockExchangeJobMapping(), PendingRequest: true }, rowIndex: 1 };

      instance.exchangeJobMappingGridState = { skip: 0 };
      instance.onCellClick(event);

      const action = new fromExchangeJobMappingGridActions.SetActiveExchangeJob(event.dataItem);

      expect(store.dispatch).not.toHaveBeenCalledWith(action);
    });

  it('should dispatch a UpdatePageRowIndexToScrollTo action with the pageRowIndex (rowIndex - skip), when handling a cell click', () => {
    // Trigger ngOnInit so that ngOnDestory doesn't fail
    fixture.detectChanges();

    const action = new fromExchangeJobMappingGridActions.UpdatePageRowIndexToScrollTo(30);

    const event = { rowIndex: 70 };
    instance.exchangeJobMappingGridState = { skip: 40 };
    instance.onCellClick(event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
