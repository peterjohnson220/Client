import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {
  generateMockFilterAggregateGroup,
  generateMockUpdateFilterSelectionsModel
} from 'libs/models/peer/aggregate-filters';

import * as fromPeerFiltersActions from '../../actions/peer-filters.actions';
import * as fromPeerMapActions from '../../actions/peer-map.actions';
import * as fromPeerDataReducer from '../../reducers';
import { FiltersComponent } from './filters.component';
import { generateMockExchangeMapFilter } from '../../../../../../../libs/models/peer';

describe('Legacy Content - Peer - Filters Component', () => {
  let fixture: ComponentFixture<FiltersComponent>;
  let instance: FiltersComponent;
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
        FiltersComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(FiltersComponent);
    instance = fixture.componentInstance;
  });

  it('should display a pf-peer-data-cut-filter for each FilterAggregateGroup in the store', () => {
    const initialFilterAggregateGroups = [
      generateMockFilterAggregateGroup(1),
      generateMockFilterAggregateGroup(2)
    ];
    const initialFiltersResponse = {
      response: initialFilterAggregateGroups,
      filter: generateMockExchangeMapFilter()
    };
    store.dispatch(new fromPeerFiltersActions.LoadingPeerFiltersSuccess(initialFiltersResponse));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch an UpdatePeerMapFilter action when handleSelectionChanged method is triggered', () => {
    const expectedPayload = generateMockUpdateFilterSelectionsModel();
    const action = new fromPeerMapActions.UpdatePeerMapFilter(expectedPayload);

    fixture.detectChanges();

    instance.handleSelectionChanged(expectedPayload);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
