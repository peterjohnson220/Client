import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { WindowRef } from 'libs/core/services';
import * as fromRootState from 'libs/state/state';
import { PfCommonModule } from 'libs/core';
import { RateType } from 'libs/data/data-sets';

import { DataCardComponent } from './data.card.component';
import * as fromComphubMainReducer from '../../../reducers';
import * as fromDataCardActions from '../../../actions/data-card.actions';
import { generateFakeJobData, generateMockWorkflowContext, JobGridData } from '../../../models';
import { ComphubPages } from '../../../data';

describe('Comphub - Main - Data Card Component', () => {
  let instance: DataCardComponent;
  let fixture: ComponentFixture<DataCardComponent>;
  let store: Store<fromComphubMainReducer.State>;
  let windowRef: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        }),
        PfCommonModule
      ],
      providers: [
        {
          provide: WindowRef,
          useValue: {
            nativeWindow: {
              open: jest.fn()
            }
          }
        }
      ],
      declarations: [ DataCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(DataCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    windowRef = TestBed.get(WindowRef);

    instance.workflowContext = {
      ...generateMockWorkflowContext(),
      selectedPageId: ComphubPages.Data
    };
    fixture.detectChanges();
  });

  it('should dispatch GetQuickPriceMarketData action when loading job results', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 0,
      Take: 6,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: null
    });
    instance.paymarketId = null;
    instance.jobTitle = 'Test job';

    instance.loadJobResults();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch GetQuickPriceMarketData action when page changed', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 100,
      Take: 20,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: null
    });
    instance.jobTitle = 'Test job';
    instance.pageSize = 20;

    instance.handlePageChange(6);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch GetQuickPriceMarketData action when navigating to data page', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 0,
      Take: 6,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: null
    });

    instance.selectedJobTitle$ = of('Test job');
    instance.marketDataChange$ = of(true);
    instance.workflowContext$ = of({...generateMockWorkflowContext(), selectedPageId: ComphubPages.Data});
    instance.ngOnInit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should not dispatch GetQuickPriceMarketData action when navigating to other pages', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 0,
      Take: 6,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: null
    });

    instance.selectedJobTitle$ = of('Test job');
    instance.workflowContext$ = of({...generateMockWorkflowContext(), selectedPageId: ComphubPages.Jobs});
    instance.ngOnInit();

    expect(store.dispatch).not.toBeCalledWith(expectedAction);
  });

  it('should dispatch an action when job selected', () => {
    spyOn(store, 'dispatch');

    const job = generateFakeJobData();
    const expectedAction = new fromDataCardActions.SetSelectedJobData(job);

    instance.handleSelectionChanged(job);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should update the sort to descending when sorting a sorted field is clicked', () => {
    spyOn(store, 'dispatch');

    instance.gridContext.sortBy = {
      dir: 'asc',
      field: 'Job_Title'
    };

    instance.handleSortChange('Job_Title');

    expect(instance.gridContext.sortBy).toEqual({
      dir: 'desc',
      field: 'Job_Title'
    });
  });

  it('should sort by new field when sorting changed', () => {
    spyOn(store, 'dispatch');

    instance.gridContext.sortBy = {
      dir: 'asc',
      field: 'Job_Title'
    };

    instance.handleSortChange('Experience_From');

    expect(instance.gridContext.sortBy).toEqual({
      dir: 'asc',
      field: 'Experience_From'
    });
  });

  it('should not sort by fields which are not supported', () => {
    spyOn(store, 'dispatch');

    instance.gridContext.sortBy = {
      dir: 'asc',
      field: 'Job_Title'
    };

    instance.handleSortChange('Select');

    expect(instance.gridContext.sortBy).toEqual({
      dir: 'asc',
      field: 'Job_Title'
    });
  });

  it('should remove sorting when the field is sorted desc', () => {
    spyOn(store, 'dispatch');

    instance.gridContext.sortBy = {
      dir: 'desc',
      field: 'Job_Title'
    };

    instance.handleSortChange('Job_Title');

    expect(instance.gridContext.sortBy).toBeNull();
  });

  it('should dispatch GetQuickPriceMarketData action when loading job results', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 0,
      Take: 6,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: {
        dir: 'asc',
        field: 'Job_Title'
      }
    });
    instance.paymarketId = null;
    instance.jobTitle = 'Test job';

    instance.handleSortChange('Job_Title');

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should reset sorting and paging options before dispatching action to get grid data', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 0,
      Take: 6,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: null
    });
    instance.gridContext = {
      sortBy: {
        dir: 'asc',
        field: 'Education'
      },
      skip: 100,
      take: 6
    };

    instance.selectedJobTitle$ = of('Test job');
    instance.marketDataChange$ = of(true);
    instance.workflowContext$ = of({...generateMockWorkflowContext(), selectedPageId: ComphubPages.Data});
    instance.ngOnInit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch SetSelectedRate action when handling rate selection change', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.SetSelectedRate(RateType.Hourly);
    const selectedRate = { Name: 'Hourly', Value: 'Hourly' };

    instance.handleRateSelectionChange(selectedRate);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should display base50 and tcc50 with 2 decimal places when rate is hourly', () => {
    const jobGridData: JobGridData = {
      Data: [ generateFakeJobData() ],
      Total: 1
    };
    instance.jobResults$ = of(jobGridData);
    instance.selectedRate = { Name: RateType.Hourly, Value: RateType.Hourly };
    instance.firstDayOfMonth = new Date(2019, 1, 1);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display base50 and tcc50 with thousand seperator when rate is annual', () => {
    const jobGridData: JobGridData = {
      Data: [ generateFakeJobData() ],
      Total: 1
    };
    instance.jobResults$ = of(jobGridData);
    instance.selectedRate = { Name: RateType.Annual, Value: RateType.Annual };
    instance.firstDayOfMonth = new Date(2019, 1, 1);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should return correct value when selected rate is annual', () => {
    instance.selectedRate = { Name: RateType.Annual, Value: RateType.Annual };
    const value = 361100;

    const actualValue = instance.calculateDataByRate(value);

    expect(actualValue).toEqual(value);
  });

  it('should return correct value when selected rate is hourly', () => {
    instance.selectedRate = { Name: RateType.Hourly, Value: RateType.Hourly };
    const value = 360100;
    const expectedValue = 173.13;

    const actualValue = Math.round(instance.calculateDataByRate(value) * 100) / 100;

    expect(actualValue).toEqual(expectedValue);
  });

  it('should call window open, when handling the learn more button being clicked', () => {
    spyOn(windowRef.nativeWindow, 'open');

    instance.handleLearnMoreClicked();

    expect(windowRef.nativeWindow.open).toHaveBeenCalled();
  });

  it('should dispatch ToggleJobDescription action with the jobId when handling a Expand JD click', () => {
    spyOn(store, 'dispatch');
    const jobData = generateFakeJobData();
    const expectedAction = new fromDataCardActions.ToggleJobDescription({ jobId: jobData.JobId });
    const mouseEvent = new MouseEvent('click');

    instance.handleExpandJdClicked(mouseEvent, jobData.JobId);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

});
