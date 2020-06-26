import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import * as fromRootState from 'libs/state/state';

import * as fromExchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromPeerAdminReducer from '../../reducers';
import { ExchangeJobsComponent } from './exchange-jobs.component';
import { GridHelperService } from '../../services';
import * as fromImportExchangeJobActions from '../../actions/import-exchange-jobs.actions';

describe('Exchange Jobs', () => {
  let fixture: ComponentFixture<ExchangeJobsComponent>;
  let instance: ExchangeJobsComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;
  let gridHelperService: GridHelperService;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        })
      ],
      declarations: [
        ExchangeJobsComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { parent: { params: { id : 1 } } } }
        },
        {
          provide: GridHelperService,
          useValue: { loadExchangeJobs: jest.fn() }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
    routeIdParam = activatedRoute.snapshot.parent.params.id;
    gridHelperService = TestBed.inject(GridHelperService);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeJobsComponent);
    instance = fixture.componentInstance;
  });

  it('exchange jobs page should match the snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadingExchangeJobs action when handleExchangeJobsGridReload is called', () => {
    const action = new fromExchangeJobsActions.LoadingExchangeJobs(routeIdParam);

    instance.handleExchangeJobsGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a page change grid action when handlePageChanged is called', () => {
    const pageChangeEvent: PageChangeEvent = { skip: 10, take: 20 };
    const action = new fromGridActions.PageChange(GridTypeEnum.ExchangeJobs, pageChangeEvent);

    instance.handlePageChange(pageChangeEvent);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeJobs with the exchangeId when handlePageChanged is called', () => {
    const pageChangeEvent: PageChangeEvent = { skip: 10, take: 20 };

    // Trigger ngOnInit here and spy on the service afterwards so that we don't get unexpected results
    instance.exchangeId = 1;
    fixture.detectChanges();

    spyOn(gridHelperService, 'loadExchangeJobs');

    instance.handlePageChange(pageChangeEvent);

    fixture.detectChanges();

    expect(gridHelperService.loadExchangeJobs).toHaveBeenCalledWith(instance.exchangeId);
  });

  it('should dispatch a sort change grid action when handleSortChanged is called', () => {
    const sortDescriptor: SortDescriptor[] = [{ field: 'Status', dir: 'asc' }];
    const action = new fromGridActions.SortChange(GridTypeEnum.ExchangeJobs, sortDescriptor);

    instance.handleSortChange(sortDescriptor);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeJobs with the exchangeId when handleSortChanged is called', () => {
    const sortDescriptor: SortDescriptor[] = [{ field: 'Status', dir: 'asc' }];

    // Trigger ngOnInit here and spy on the service afterwards so that we don't get unexpected results
    instance.exchangeId = 1;
    fixture.detectChanges();

    spyOn(gridHelperService, 'loadExchangeJobs');

    instance.handleSortChange(sortDescriptor);

    fixture.detectChanges();

    expect(gridHelperService.loadExchangeJobs).toHaveBeenCalledWith(instance.exchangeId);
  });

  it('should dispatch an OpeningImportExchangeJobsModal action when openCreateExchangeModal is called', () => {
    const action = new fromImportExchangeJobActions.OpeningImportExchangeJobsModal();

    instance.openImportExchangeJobsModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an ClosingImportExchangeJobsModal action when handleImportExchangeJobsModalDismissed is called', () => {
    const action = new fromImportExchangeJobActions.ClosingImportExchangeJobsModal();

    instance.handleImportExchangeJobsModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an ClosingImportExchangeJobsModal action when handleImportExchangeJobs is called', () => {
    const action = new fromImportExchangeJobActions.ClosingImportExchangeJobsModal();

    instance.handleImportExchangeJobs();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a OpenAddExchangeJobsModal action when openAddExchangeJobsModal is called', () => {
    const action = new fromExchangeJobsActions.OpenAddExchangeJobsModal();

    instance.openAddExchangeJobsModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an ExportExchangeJobs action when exportExchangeJobs is called', () => {
    const action = new fromExchangeJobsActions.ExportExchangeJobs({exchangeId: 1});

    instance.exportExchangeJobs();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
