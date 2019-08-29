import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StoreModule, combineReducers, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateDefaultAsyncStateObj } from 'libs/models';

import * as fromViewsActions from '../../actions/views.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { ViewsComponent } from './views.component';
import { generateMockView, generateMockWorkbook } from '../../models';

describe('Data Insights - Views Component', () => {
  let instance: ViewsComponent;
  let fixture: ComponentFixture<ViewsComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
        })
      ],
      declarations: [ ViewsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ViewsComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    fixture.detectChanges();
  });

  it('anyFavorites should returns true when there is a favorite view', () => {
    const view = {...generateMockView(), IsFavorite: true};
    const workbook = {...generateMockWorkbook(), Views: generateDefaultAsyncStateObj([view])};
    instance.companyWorkbooksAsync = generateDefaultAsyncStateObj([workbook]);

    expect(instance.anyFavorites).toEqual(true);
  });

  it('anyFavorites should returns false when there is none favorite views', () => {
    const view = generateMockView();
    const workbook = {...generateMockWorkbook(), Views: generateDefaultAsyncStateObj([view])};
    instance.companyWorkbooksAsync = generateDefaultAsyncStateObj([workbook]);

    expect(instance.anyFavorites).toEqual(false);
  });

  it('should dispatch AddViewFavorite action when a view is marked as favorite', () => {
    const view = {...generateMockView(), IsFavorite: false};
    const workbook = {...generateMockWorkbook(), Views: generateDefaultAsyncStateObj([view])};
    const expectedAction = new fromViewsActions.AddViewFavorite({ workbookId: workbook.WorkbookId, viewId: view.ViewId });
    spyOn(store, 'dispatch');

    instance.handleFavoriteClicked({ workbookId: workbook.WorkbookId, view });

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch RemoveViewFavorite action when a view is unmarked as favorite', () => {
    const view = {...generateMockView(), IsFavorite: true};
    const workbook = {...generateMockWorkbook(), Views: generateDefaultAsyncStateObj([view])};
    const expectedAction = new fromViewsActions.RemoveViewFavorite({ workbookId: workbook.WorkbookId, viewId: view.ViewId });
    spyOn(store, 'dispatch');

    instance.handleFavoriteClicked({ workbookId: workbook.WorkbookId, view });

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
