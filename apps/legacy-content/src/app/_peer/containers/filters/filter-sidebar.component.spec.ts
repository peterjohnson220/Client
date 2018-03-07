import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {
  generateMockFilterAggregateGroup,
  generateMockUpdateFilterSelectionsModel
} from 'libs/models/peer/aggregate-filters';
import { generateMockExchangeMapFilter } from 'libs/models/peer';

import * as fromPeerMapActions from '../../actions/peer-map.actions';
import * as fromPeerDataReducer from '../../reducers';
import { FilterSidebarComponent } from './filter-sidebar.component';

describe('Legacy Content - Peer - Filter Sidebar Component', () => {
  let fixture: ComponentFixture<FilterSidebarComponent>;
  let instance: FilterSidebarComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerData: combineReducers(fromPeerDataReducer.reducers)
        })
      ],
      declarations: [
        FilterSidebarComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(FilterSidebarComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch an UpdatePeerMapFilter action when handleOptionToggled method is triggered', () => {
    const expectedPayload = generateMockUpdateFilterSelectionsModel();
    const action = new fromPeerMapActions.UpdatePeerMapFilter(expectedPayload);

    fixture.detectChanges();

    instance.handleOptionToggled(expectedPayload);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
