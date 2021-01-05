import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { WindowRef } from 'libs/core/services';

import * as fromReportsReducer from '../../reducers';
import * as fromReportsViewActions from '../../actions/report-view.actions';
import { ReportViewComponent } from './report-view.component';
import { ReportViewTypes } from '../../models';

describe('Libs - Reports - Report View Component', () => {
  let instance: ReportViewComponent;
  let fixture: ComponentFixture<ReportViewComponent>;
  let store: Store<fromReportsReducer.State>;
  let location: Location;
  let winRef: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_reports: combineReducers(fromReportsReducer.reducers)
        })
      ],
      declarations: [ ReportViewComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
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

    fixture = TestBed.createComponent(ReportViewComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    location = TestBed.inject(Location);
    winRef = TestBed.inject(WindowRef);

    instance.reportTitle = 'Salary Structures';
    instance.showTabs = true;
    instance.workbookId = '123';
    instance.workbookName = 'Test Workbook Name';
    instance.viewName = 'Test View Name';
    instance.viewType = ReportViewTypes.StandardWorkbook;

    fixture.detectChanges();
  });

  it('should dispatch GetStandardReportViewUrl action when routedViewType is StandardWorkbook', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromReportsViewActions.GetStandardReportViewUrl({ workbookId: '123' });

    instance.loadWorkbookViewUrl();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetPeerStandardReportViewUrl action when routedViewType is PeerStandardWorkbook', () => {
    instance.viewType = ReportViewTypes.PeerStandardWorkbook;
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    const expectedAction = new fromReportsViewActions.GetPeerStandardReportViewUrl({ workbookId: '123' });

    instance.loadWorkbookViewUrl();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetStandardReportSheetViewUrl action when routedViewType is StandardWorkbookSheet', () => {
    instance.viewType = ReportViewTypes.StandardWorkbookSheet;
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
    instance.viewType = ReportViewTypes.CompanyWorkbookSheet;
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
    instance.viewType = ReportViewTypes.CompanyWorkbook;
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    const expectedAction = new fromReportsViewActions.GetCompanyReportViewUrl({ workbookId: '123' });

    instance.loadWorkbookViewUrl();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetViewUrlError action when routedViewType is invalid', () => {
    instance.viewType = 5;
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    const expectedAction = new fromReportsViewActions.GetViewUrlError();

    instance.loadWorkbookViewUrl();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
