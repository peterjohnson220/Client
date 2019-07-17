import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { generateDefaultAsyncStateObj } from 'libs/models/state/async-state-obj';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDashboardsActions from '../../actions/dashboards.actions';
import { SearchWorkbookModalComponent } from './search-workbook-modal.component';
import { generateMockWorkbook, generateMockView, View } from '../../models';

describe('Data Insights - Search Workbook Modal Component', () => {
  let instance: SearchWorkbookModalComponent;
  let fixture: ComponentFixture<SearchWorkbookModalComponent>;
  let ngbModal: NgbModal;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
        })
      ],
      declarations: [ SearchWorkbookModalComponent ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() },
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SearchWorkbookModalComponent);
    instance = fixture.componentInstance;
    ngbModal = TestBed.get(NgbModal);
    store = TestBed.get(Store);

    fixture.detectChanges();
  });

  it('should use the modal service to open the modal when open is called', () => {
    spyOn(ngbModal, 'open');
    instance.open();

    expect(ngbModal.open).toHaveBeenCalled();
  });

  it('should use the modal service to dismiss the modal, when close is called', () => {
    spyOn(ngbModal, 'dismissAll');

    instance.close();

    expect(ngbModal.dismissAll).toHaveBeenCalled();
  });

  it('should return workbooks contains search value when search value changed', () => {
    const workbook1 = { ...generateMockWorkbook(), WorkbookName: 'Salary Structures' };
    const workbook2 = { ...generateMockWorkbook(), WorkbookName: 'Geographic References' };
    const expectedFilteredWorkbooks = [ workbook1 ];
    instance.searchValue = 'salary';
    instance.allWorkbooks = [ workbook1, workbook2 ];
    instance.handleSearchValueChanged(instance.searchValue);

    fixture.detectChanges();

    expect(instance.filteredWorkbooks).toEqual(expectedFilteredWorkbooks);
    expect(instance.noSearchResults).toEqual(false);
  });

  it('should return no workbooks when no matching workbook name found', () => {
    const workbook1 = { ...generateMockWorkbook(), WorkbookName: 'Salary Structures' };
    const workbook2 = { ...generateMockWorkbook(), WorkbookName: 'Geographic References' };
    const expectedFilteredWorkbooks = [];
    instance.searchValue = 'published';
    instance.allWorkbooks = [ workbook1, workbook2 ];
    instance.handleSearchValueChanged(instance.searchValue);

    fixture.detectChanges();

    expect(instance.filteredWorkbooks).toEqual(expectedFilteredWorkbooks);
    expect(instance.noSearchResults).toEqual(true);
  });

  it('should return top 5 workbooks in alphabetical order when matching found', () => {
    instance.allWorkbooks = [
      { ...generateMockWorkbook(), WorkbookName: 'Wage Gap Analysis' },
      { ...generateMockWorkbook(), WorkbookName: '13 test API' },
      { ...generateMockWorkbook(), WorkbookName: 'Published Composites with Employees' },
      { ...generateMockWorkbook(), WorkbookName: '1. Published Market Pricing' },
      { ...generateMockWorkbook(), WorkbookName: 'Geographic Referfences' },
      { ...generateMockWorkbook(), WorkbookName: 'Published Jobs' }
    ];
    instance.searchValue = 'P';

    const expectedFilteredWorkbooks = [
      { ...generateMockWorkbook(), WorkbookName: '1. Published Market Pricing' },
      { ...generateMockWorkbook(), WorkbookName: '13 test API' },
      { ...generateMockWorkbook(), WorkbookName: 'Geographic Referfences' },
      { ...generateMockWorkbook(), WorkbookName: 'Published Composites with Employees' },
      { ...generateMockWorkbook(), WorkbookName: 'Published Jobs' }
    ];
    instance.handleSearchValueChanged(instance.searchValue);
    fixture.detectChanges();

    expect(instance.filteredWorkbooks).toEqual(expectedFilteredWorkbooks);
  });

  it('should dispatch GetCompanyWorkbookViews when open views clicked and views has not been loaded', () => {
    spyOn(store, 'dispatch');
    const workbook = generateMockWorkbook();
    const getViewsAction = new fromDashboardsActions.GetCompanyWorkbookViews({ workbookId: workbook.WorkbookId });

    instance.handleOpenViewsClicked(workbook);

    expect(store.dispatch).toHaveBeenCalledWith(getViewsAction);
  });

  it('should NOT dispatch GetCompanyWorkbookViews when open views clicked and views already loaded', () => {
    spyOn(store, 'dispatch');
    const workbook = generateMockWorkbook();
    const view = generateMockView();
    workbook.Views = generateDefaultAsyncStateObj<View[]>([view]);
    const getViewsAction = new fromDashboardsActions.GetCompanyWorkbookViews({ workbookId: workbook.WorkbookId });

    instance.handleOpenViewsClicked(workbook);

    expect(store.dispatch).not.toHaveBeenCalledWith(getViewsAction);
  });

});
