import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateDefaultAsyncStateObj } from 'libs/models';
import { generateMockView, generateMockWorkbook } from 'libs/features/reports/models';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDashboardsActions from '../../../actions/dashboards.actions';
import { TableauWorkbookCardComponent } from './tableau-workbook-card.component';

describe('Data Insights - Tableau Workbook Card', () => {
  let instance: TableauWorkbookCardComponent;
  let fixture: ComponentFixture<TableauWorkbookCardComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers)
        })
      ],
      declarations: [ TableauWorkbookCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TableauWorkbookCardComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should dispatch GetCompanyWorkbookViews when clicking open views with no views loaded and not loading', () => {
    instance.workbook = generateMockWorkbook();
    const expectedAction = new fromDashboardsActions.GetCompanyWorkbookViews({ workbookId: instance.workbook.WorkbookId });
    spyOn(store, 'dispatch');

    instance.handleOpenViewsClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetCompanyWorkbookViews when clicking open views and views are loading', () => {
    const view = generateMockView();
    instance.workbook = {
      ...generateMockWorkbook(),
      Views: {...generateDefaultAsyncStateObj([view]), loading: true }
    };
    const action = new fromDashboardsActions.GetCompanyWorkbookViews({ workbookId: instance.workbook.WorkbookId });
    spyOn(store, 'dispatch');

    instance.handleOpenViewsClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(action);
  });

  it('should NOT dispatch GetCompanyWorkbookViews when clicking open views and views are already loaded', () => {
    const view = generateMockView();
    instance.workbook = {
      ...generateMockWorkbook(),
      Views: generateDefaultAsyncStateObj([view])
    };
    const action = new fromDashboardsActions.GetCompanyWorkbookViews({ workbookId: instance.workbook.WorkbookId });
    spyOn(store, 'dispatch');

    instance.handleOpenViewsClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(action);
  });

});
