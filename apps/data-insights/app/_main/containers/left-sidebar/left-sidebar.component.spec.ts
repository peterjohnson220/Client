import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { LeftSidebarComponent } from './left-sidebar.component';
import * as fromDataInsightsMainReducer from '../../reducers';
import {generateMockField} from '../../models';
import * as fromDataViewActions from '../../actions/data-view.actions';


describe('Data-Insights LeftSidebarComponent', () => {
  let instance: LeftSidebarComponent;
  let fixture: ComponentFixture<LeftSidebarComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers)
        }),
      ],
      declarations: [ LeftSidebarComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents().then(() => {
      store = TestBed.get(Store);
      fixture = TestBed.createComponent(LeftSidebarComponent);
      instance = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should toggle sidebar', () => {
    instance.isOpen = false;
    instance.toggle();
    expect(instance.isOpen).toBe(true);
  });

  it('should dispatch a removeSelectedField action when handling field removal', () => {
    const field = generateMockField();
    const expectedAction = new fromDataViewActions.RemoveSelectedField(field);

    spyOn(store, 'dispatch');
    instance.handleFieldRemoved(field);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
