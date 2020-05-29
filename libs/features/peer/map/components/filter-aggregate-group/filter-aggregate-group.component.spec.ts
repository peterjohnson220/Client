import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import { generateMockFilterAggregateGroup,  generateMockFilterAggregateItem, generateMockToggleAggregateGroupSelections,
         ToggleAggregateGroupSelections } from 'libs/models';
import * as fromRootState from 'libs/state/state';
import { FilterSidebarHelper } from 'libs/features/peer/map/helpers';

import * as fromFeaturePeerMapReducer from '../../reducers';
import { AggregateSelectionInfo } from '../../models';
import { FilterAggregateGroupComponent } from './filter-aggregate-group.component';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

describe('Features - Peer - Filter Aggregate Group Component', () => {
  let fixture: ComponentFixture<FilterAggregateGroupComponent>;
  let instance: FilterAggregateGroupComponent;
  let store: Store<fromRootState.State>;

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
        FilterAggregateGroupComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(FilterAggregateGroupComponent);
    instance = fixture.componentInstance;
    instance.previewLimit = FilterSidebarHelper.PreviewLimit;
    instance.searching = false;
  });

  it('should emit an aggregateToggled event with AggregateSelectionInfo when handling AggregateSelected', () => {
    instance.aggregateGroup = generateMockFilterAggregateGroup();
    const aggregateItemSelection = generateMockFilterAggregateItem();
    const aggregateSelectionInfo: AggregateSelectionInfo = {
      AggregateGroup: instance.aggregateGroup.MetaData.FilterProp,
      AggregateItem: aggregateItemSelection.Item
    };

    spyOn(instance.aggregateToggled, 'emit');

    instance.handleAggregateSelected(aggregateItemSelection);

    expect(instance.aggregateToggled.emit).toHaveBeenCalledWith(aggregateSelectionInfo);
  });

  it('should toggle collapsed when clicking on the .aggregate-group-header', () => {
    instance.aggregateGroup = generateMockFilterAggregateGroup();

    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.aggregate-group-header'));
    header.triggerEventHandler('click', null);

    expect(instance.collapsed).toBe(true);
  });

  it('should apply the collapsed class to the .aggregate-group when collapse is true', () => {
    instance.collapsed = true;
    instance.aggregateGroup = generateMockFilterAggregateGroup();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit a searchEvent when the handleSearchClicked function is called', () => {
    const mockAggregateGroup = generateMockFilterAggregateGroup();
    const expectedEmitPayload = mockAggregateGroup.MetaData.Id;
    instance.aggregateGroup = mockAggregateGroup;

    spyOn(instance.searchEvent, 'emit');

    fixture.detectChanges();

    instance.handleSearchClicked(generateMockEvent());

    expect(instance.searchEvent.emit).toHaveBeenCalledWith(expectedEmitPayload);
  });

  it('should show the Options Toggle when the number of aggregates is greater than the preview limit', () => {
    instance.aggregateGroup = buildAggregateGroupWithMultipleItems();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should trigger the handleSearchClicked function when clicking on the .toggle-option-height', () => {
    instance.aggregateGroup = buildAggregateGroupWithMultipleItems();

    fixture.detectChanges();

    spyOn(instance, 'handleSearchClicked');

    const toggleLink = fixture.debugElement.query(By.css('.toggle-option-height'));
    toggleLink.triggerEventHandler('click', null);

    expect(instance.handleSearchClicked).toHaveBeenCalled();
  });

  it('should trigger the handleSearchClicked function when clicking on the .search icon', () => {
    instance.aggregateGroup = buildAggregateGroupWithMultipleItems();

    fixture.detectChanges();

    spyOn(instance, 'handleSearchClicked');

    const toggleLink = fixture.debugElement.query(By.css('.search'));
    toggleLink.triggerEventHandler('click', null);

    expect(instance.handleSearchClicked).toHaveBeenCalled();
  });

  it('should emit a aggregateGroupSelectionsToggled with shouldSelect equals false event when handling Reset Clicked', () => {
    const expectedEmitPayload: ToggleAggregateGroupSelections = {
      ...generateMockToggleAggregateGroupSelections(),
      ShouldSelect: false
    };
    instance.aggregateGroup = buildAggregateGroupWithMultipleItems(true);

    spyOn(instance.aggregateGroupSelectionsToggled, 'emit');

    instance.handleResetClicked({ stopPropagation: jest.fn()});

    expect(instance.aggregateGroupSelectionsToggled.emit).toHaveBeenCalledWith(expectedEmitPayload);
  });

  it(`should emit a aggregateGroupSelectionsToggled with shouldSelect equals true event when handleSelectAllChecked is called and
  there are no selections`, () => {
    const expectedEmitPayload: ToggleAggregateGroupSelections = generateMockToggleAggregateGroupSelections();
    instance.aggregateGroup = buildAggregateGroupWithMultipleItems();
    spyOn(instance.aggregateGroupSelectionsToggled, 'emit');

    instance.handleSelectAllChecked({ stopPropagation: jest.fn()});

    expect(instance.aggregateGroupSelectionsToggled.emit).toHaveBeenCalledWith(expectedEmitPayload);
  });

  it(`should emit a aggregateGroupSelectionsToggled with shouldSelect equals false event when handleSelectAllChecked is called
  and all options are selected`, () => {
    const expectedEmitPayload: ToggleAggregateGroupSelections = {
      ...generateMockToggleAggregateGroupSelections(),
      ShouldSelect: false
    };
    instance.aggregateGroup = buildAggregateGroupWithMultipleItems(true);

    spyOn(instance.aggregateGroupSelectionsToggled, 'emit');

    instance.handleSelectAllChecked({ stopPropagation: jest.fn()});

    expect(instance.aggregateGroupSelectionsToggled.emit).toHaveBeenCalledWith(expectedEmitPayload);
  });

});

function generateMockEvent() {
  return { stopPropagation: jest.fn()};
}

function buildAggregateGroupWithMultipleItems(selectAll = false) {
  const aggGroup = generateMockFilterAggregateGroup();
  const aggItems = [];
  for (let i = 0; i < 10; i++) {
    const aggItem = generateMockFilterAggregateItem();
    aggItem.Selected = selectAll;
    aggItems.push(aggItem);
  }

  aggGroup.Aggregates = aggItems;

  FilterSidebarHelper.buildAggregatesPreview([aggGroup]);

  return aggGroup;
}
