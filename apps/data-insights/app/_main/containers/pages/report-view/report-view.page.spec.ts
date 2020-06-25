import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Store, StoreModule, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { WindowRef } from 'libs/core/services';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromReportsViewActions from '../../../actions/reports-view-page.actions';
import { ReportViewPageComponent } from './report-view.page';
import { ReportViewTypes } from '../../../models';

describe('Data Insights - Report View Page Comopnent', () => {
  let instance: ReportViewPageComponent;
  let fixture: ComponentFixture<ReportViewPageComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;
  let route: ActivatedRoute;
  let location: Location;
  let winRef: WindowRef;
  const queryStringParams = { 'title': 'Salary Structures', 'showTabs' : 'true' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers)
        })
      ],
      declarations: [ ReportViewPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: { get: (key) =>  queryStringParams[key] },
              params: { viewName: 'Test View Name', workbookName: 'Test Workbook Name', workbookId: '123' },
              data: { viewType: ReportViewTypes.StandardWorkbook }
            }
          }
        },
        {
          provide: WindowRef,
          useValue: { nativeWindow: { tableau: jest.fn() } }
        },
        {
          provide: Location,
          useValue: { go: jest.fn() }
        }
      ]
    });

    fixture = TestBed.createComponent(ReportViewPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRoute);
    location = TestBed.inject(Location);
    winRef = TestBed.inject(WindowRef);

    fixture.detectChanges();
  });

  it('should dispatch GetStandardReportViewUrl action when routedViewType is StandardWorkbook', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromReportsViewActions.GetStandardReportViewUrl({ workbookId: '123' });

    instance.loadWorkbookViewUrl();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetStandardReportSheetViewUrl action when routedViewType is StandardWorkbookSheet', () => {
    route.snapshot.data.viewType = ReportViewTypes.StandardWorkbookSheet;
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    const expectedAction = new fromReportsViewActions.GetStandardReportSheetViewUrl({
      viewName: 'Test View Name',
      workbookName: 'Test Workbook Name'
    });

    instance.loadWorkbookViewUrl();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetCompanyReportSheetViewUrl action when routedViewType is CompanyWorkbookSheet', () => {
    route.snapshot.data.viewType = ReportViewTypes.CompanyWorkbookSheet;
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    const expectedAction = new fromReportsViewActions.GetCompanyReportSheetViewUrl({
      viewName: 'Test View Name',
      workbookName: 'Test Workbook Name'
    });

    instance.loadWorkbookViewUrl();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetCompanyReportViewUrl action when routedViewType is CompanyWorkbook', () => {
    route.snapshot.data.viewType = ReportViewTypes.CompanyWorkbook;
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    const expectedAction = new fromReportsViewActions.GetCompanyReportViewUrl({ workbookId: '123' });

    instance.loadWorkbookViewUrl();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetViewUrlError action when routedViewType is invalid', () => {
    route.snapshot.data.viewType = 5;
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    const expectedAction = new fromReportsViewActions.GetViewUrlError();

    instance.loadWorkbookViewUrl();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
