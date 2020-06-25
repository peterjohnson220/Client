import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models/common';
import { generateMockExchangeCompany } from 'libs/models/peer';

import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';
import * as fromPeerAdminReducer from '../../reducers';
import { ExchangeCompaniesComponent } from './exchange-companies.component';
import { GridHelperService } from '../../services';


describe('Exchange Companies', () => {
  let fixture: ComponentFixture<ExchangeCompaniesComponent>;
  let instance: ExchangeCompaniesComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;
  let gridHelperService: GridHelperService;

  const mockExchangeCompany = generateMockExchangeCompany();

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
        ExchangeCompaniesComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { parent: { params: { id : 1 } } } }
        },
        {
          provide: GridHelperService,
          useValue: { loadExchangeCompanies: jest.fn() }
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

    fixture = TestBed.createComponent(ExchangeCompaniesComponent);
    instance = fixture.componentInstance;
    instance.selectedCompany = mockExchangeCompany;
  });

  it('should dispatch a LoadingExchangeCompanies action when handleExchangeCompaniesGridReload is called', () => {
    const action = new fromExchangeCompaniesActions.LoadingExchangeCompanies(routeIdParam);

    instance.handleExchangeCompaniesGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a page change grid action when handlePageChanged is called', () => {
    const pageChangeEvent: PageChangeEvent = { skip: 10, take: 20 };
    const action = new fromGridActions.PageChange(GridTypeEnum.ExchangeCompanies, pageChangeEvent);

    instance.handlePageChange(pageChangeEvent);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeCompanies with the exchangeId when handlePageChanged is called', () => {
    const pageChangeEvent: PageChangeEvent = { skip: 10, take: 20 };

    // Trigger ngOnInit here and spy on the service afterwards so that we don't get unexpected results
    instance.exchangeId = 1;
    fixture.detectChanges();

    spyOn(gridHelperService, 'loadExchangeCompanies');

    instance.handlePageChange(pageChangeEvent);

    fixture.detectChanges();

    expect(gridHelperService.loadExchangeCompanies).toHaveBeenCalledWith(instance.exchangeId);
  });

  it('should dispatch a sort change grid action when handleSortChanged is called', () => {
    const sortDescriptor: SortDescriptor[] = [{ field: 'Status', dir: 'asc' }];
    const action = new fromGridActions.SortChange(GridTypeEnum.ExchangeCompanies, sortDescriptor);

    instance.handleSortChange(sortDescriptor);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call loadExchangeCompanies with the exchangeId when handleSortChanged is called', () => {
    const sortDescriptor: SortDescriptor[] = [{ field: 'Status', dir: 'asc' }];

    // Trigger ngOnInit here and spy on the service afterwards so that we don't get unexpected results
    instance.exchangeId = 1;
    fixture.detectChanges();

    spyOn(gridHelperService, 'loadExchangeCompanies');

    instance.handleSortChange(sortDescriptor);

    fixture.detectChanges();

    expect(gridHelperService.loadExchangeCompanies).toHaveBeenCalledWith(instance.exchangeId);
  });

  it('should dispatch a OpenAddExchangeCompaniesModal action when openAddExchangeCompaniesModal is called', () => {
    const action = new fromExchangeCompaniesActions.OpenAddExchangeCompaniesModal();

    instance.openAddExchangeCompaniesModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a OpenDeleteExchangeCompanyModal action when openDeleteExchangeCompanyModal is called', () => {
    const action = new fromExchangeCompaniesActions.OpenDeleteExchangeCompanyModal();

    instance.openDeleteExchangeCompanyModal(mockExchangeCompany);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
