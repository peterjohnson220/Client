import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { generateMockFilterAggregateGroup } from 'libs/models';

import * as fromFilterSidebarActions from '../../actions/filter-sidebar.actions';
import * as fromFeaturePeerMapReducer from '../../../map/reducers';
import { generateMockAggregateSelectionInfo } from '../../models';
import { FilterSidebarComponent } from './filter-sidebar.component';

describe('Features - Peer - Filter Sidebar Component', () => {
  let fixture: ComponentFixture<FilterSidebarComponent>;
  let instance: FilterSidebarComponent;
  let store: Store<fromFeaturePeerMapReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_peerMap: combineReducers(fromFeaturePeerMapReducer.reducers)
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

  it('should dispatch a LoadPayMarketInformation action when initialized', () => {
    instance.companyPayMarketId = 123;
    const action = new fromFilterSidebarActions.LoadPayMarketInformation(instance.companyPayMarketId);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a ToggleLimitToPayMarket action when the handleLimitToPayMarketToggled method is triggered', () => {
    const action = new fromFilterSidebarActions.ToggleLimitToPayMarket();

    fixture.detectChanges();

    instance.handleLimitToPayMarketToggled();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a ToggleAggregateSelected action when the handleAggregateToggled method is triggered', () => {
    const payload = generateMockAggregateSelectionInfo();
    const action = new fromFilterSidebarActions.ToggleAggregateSelected(payload);

    // Give the store some data since it we be called through to.
    store.dispatch(new fromFilterSidebarActions.LoadFilterAggregatesSuccess([generateMockFilterAggregateGroup()]));

    instance.handleAggregateToggled(generateMockAggregateSelectionInfo());

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a ClearAllSelections action when handleClearAllSelections method is triggered', () => {
    const action = new fromFilterSidebarActions.ClearAllSelections();

    fixture.detectChanges();

    instance.handleClearAllSelections();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
