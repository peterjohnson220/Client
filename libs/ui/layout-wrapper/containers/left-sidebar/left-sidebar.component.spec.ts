
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { generateMockSidebarLink } from 'libs/models';

import { LeftSidebarComponent } from './left-sidebar.component';
import * as fromRootState from '../../../../state/state';
import * as fromLayoutReducer from '../../reducers';
import * as fromLeftSidebarActions from '../../actions/left-sidebar.actions';

describe('Left Sidebar', () => {
  let fixture: ComponentFixture<LeftSidebarComponent>;
  let instance: LeftSidebarComponent;
  let store: Store<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot({
        ...fromRootState.reducers,
        layoutWrapper: combineReducers(fromLayoutReducer.reducers),
      }),
    ],
    declarations: [
      LeftSidebarComponent,
    ],
    // Shallow Testing
    schemas: [ NO_ERRORS_SCHEMA ]
    });
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(LeftSidebarComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a GetLeftSidebarNavigationLinks action upon Init', () => {
    const action = new fromLeftSidebarActions.GetLeftSidebarNavigationLinks();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
