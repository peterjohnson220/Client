import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {
  generateMockFilterAggregateGroup, generateMockFilterAggregateItem, generateMockFilterAggregateMetaData,
  generateMockUpdateFilterSelectionsModel
} from 'libs/models/peer/aggregate-filters';

import * as fromPeerDataReducer from '../reducers';
import { FilterComponent } from './filter.component';

describe('Legacy Content - Peer - Filter Component', () => {
  let fixture: ComponentFixture<FilterComponent>;
  let instance: FilterComponent;
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
        FilterComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(FilterComponent);
    instance = fixture.componentInstance;
  });

  it('should set selections from filter on init', () => {
    const mockFilterAggregateGroup = generateMockFilterAggregateGroup();
    mockFilterAggregateGroup.Aggregates.push(generateMockFilterAggregateItem('MockSelection'));
    instance.filter = mockFilterAggregateGroup;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit the selectionChanged event when the handleValueChangeEvent event is triggered', () => {
    const mockMetaData = {...generateMockFilterAggregateMetaData(), FilterProp: 'Exchanges'};
    const mockFilterAggregateGroup = {...generateMockFilterAggregateGroup(), MetaData: mockMetaData};
    const mockUpdateFilterSelection = generateMockUpdateFilterSelectionsModel();
    instance.filter = mockFilterAggregateGroup;

    spyOn(instance.selectionChanged, 'emit');

    fixture.detectChanges();

    instance.handleValueChangeEvent(mockUpdateFilterSelection);

    expect(instance.selectionChanged.emit).toBeCalledWith(mockUpdateFilterSelection);
  });
});
