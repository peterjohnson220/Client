import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { generateMockWorkbook } from 'libs/features/reports/models';

import * as fromDataInsightsMainReducer from '../../reducers';
import { SearchWorkbookModalComponent } from './search-workbook-modal.component';
import { generateMockSearchResult } from '../../models';

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
    ngbModal = TestBed.inject(NgbModal);
    store = TestBed.inject(Store);

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
    const workbook1 = { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Salary Structures' };
    const workbook2 = { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Geographic References' };
    const expectedFilteredWorkbooks = [
      {
        ...generateMockSearchResult(),
        WorkbookName: 'Salary Structures',
        Url: `/company-reports/${workbook1.WorkbookId}`
      }];
    instance.searchValue = 'salary';
    instance.allWorkbooks = [ workbook1, workbook2 ];
    instance.handleSearchValueChanged(instance.searchValue);

    fixture.detectChanges();

    expect(instance.searchResults).toEqual(expectedFilteredWorkbooks);
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

    expect(instance.searchResults).toEqual(expectedFilteredWorkbooks);
    expect(instance.noSearchResults).toEqual(true);
  });

  it('should return top 10 results in alphabetical order when matching found', () => {
    instance.allWorkbooks = [
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Wage Gap Analysis' },
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: '13 test API' },
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Published Composites with Employees' },
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: '1. Published Market Pricing' },
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Geographic Referfences' },
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Published Jobs' },
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Zap' },
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Zip' },
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Wip' },
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Wop' },
      { ...generateMockWorkbook(), SourceUrl: '/company-reports', WorkbookName: 'Zing Pong' }
    ];
    instance.searchValue = 'P';

    const expectedFilteredWorkbooks = [
      { ...generateMockSearchResult(), WorkbookName: '1. Published Market Pricing' },
      { ...generateMockSearchResult(), WorkbookName: '13 test API' },
      { ...generateMockSearchResult(), WorkbookName: 'Geographic Referfences' },
      { ...generateMockSearchResult(), WorkbookName: 'Published Composites with Employees' },
      { ...generateMockSearchResult(), WorkbookName: 'Published Jobs' },
      { ...generateMockSearchResult(), WorkbookName: 'Wage Gap Analysis' },
      { ...generateMockSearchResult(), WorkbookName: 'Wip' },
      { ...generateMockSearchResult(), WorkbookName: 'Wop' },
      { ...generateMockSearchResult(), WorkbookName: 'Zap' },
      { ...generateMockSearchResult(), WorkbookName: 'Zing Pong' }
    ];

    instance.handleSearchValueChanged(instance.searchValue);
    fixture.detectChanges();

    expect(instance.searchResults).toEqual(expectedFilteredWorkbooks);
  });

});
