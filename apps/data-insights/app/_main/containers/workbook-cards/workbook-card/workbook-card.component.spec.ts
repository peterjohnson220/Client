import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockWorkbook } from 'libs/features/surveys/reports/models';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDashboardsActions from '../../../actions/dashboards.actions';
import { WorkbookCardComponent } from './workbook-card.component';

describe('Data Insights - Workbook Card Component', () => {
  let instance: WorkbookCardComponent;
  let fixture: ComponentFixture<WorkbookCardComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
        })
      ],
      declarations: [ WorkbookCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(WorkbookCardComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should display overlay when mouse over workbook container', () => {
    instance.handleMouseOverWorkbookContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(true);
  });

  it('should NOT display overlay when mouse leave workbook container', () => {
    instance.handleMouseLeaveWorkbookContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(false);
  });

  it('should display overlay when mouse leave workbook container if views open', () => {
    instance.workbook = generateMockWorkbook();
    instance.displayActionsOverlayOverride = true;

    instance.handleMouseLeaveWorkbookContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(true);
  });

  it('should dispatch AddWorkbookFavorite action when a workbook is marked as favorite', () => {
    const workbook = generateMockWorkbook();
    const expectedAction = new fromDashboardsActions.AddWorkbookFavorite({ workbookId: workbook.WorkbookId });
    spyOn(store, 'dispatch');

    instance.handleFavoriteClicked(workbook);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch RemoveWorkbookFavorite action when a workbook is unmarked as favorite', () => {
    const workbook = {...generateMockWorkbook(), IsFavorite: true};
    const expectedAction = new fromDashboardsActions.RemoveWorkbookFavorite({ workbookId: workbook.WorkbookId });
    spyOn(store, 'dispatch');

    instance.handleFavoriteClicked(workbook);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
