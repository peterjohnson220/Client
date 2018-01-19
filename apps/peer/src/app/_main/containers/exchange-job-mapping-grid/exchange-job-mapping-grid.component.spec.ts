import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';
import { GridTypeEnum, generateMockExchangeJobMapping } from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobMappingActions from '../../actions/exchange-job-mapping.actions';
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
    // Trigger ngOnInit so that ngOnDestory doesn't fail
    fixture.detectChanges();

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
    // Trigger ngOnInit so that ngOnDestory doesn't fail
    fixture.detectChanges();

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

  it('should dispatch a SelectExchangeJobMapping action with the dataItem received, when handling a cell click', () => {
    // Trigger ngOnInit so that ngOnDestory doesn't fail
    fixture.detectChanges();

    const event = { dataItem: generateMockExchangeJobMapping(), rowIndex: 1 };
    const action = new fromExchangeJobMappingActions.SelectExchangeJobMapping(event.dataItem);

    instance.exchangeJobMappingGridState = { skip: 0 };
    instance.handleCellClick(event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a UpdatePageRowIndexToScrollTo action with the pageRowIndex (rowIndex - skip), when handling a cell click', () => {
    // Trigger ngOnInit so that ngOnDestory doesn't fail
    fixture.detectChanges();

    const action = new fromExchangeJobMappingActions.UpdatePageRowIndexToScrollTo(30);

    const event = { rowIndex: 70 };
    instance.exchangeJobMappingGridState = { skip: 40 };
    instance.handleCellClick(event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should emit a rowSelected event, when handling a cell click', () => {
    // Trigger ngOnInit so that ngOnDestory doesn't fail
    fixture.detectChanges();

    const event = { rowIndex: 70 };
    instance.exchangeJobMappingGridState = { skip: 40 };

    spyOn(instance.rowSelected, 'emit');

    instance.handleCellClick({});

    expect(instance.rowSelected.emit).toHaveBeenCalled();
  });

});
