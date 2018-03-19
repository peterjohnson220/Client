import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import { generateMockFilterAggregateGroup,  generateMockFilterAggregateItem} from 'libs/models';
import * as fromRootState from 'libs/state/state';

import * as fromPeerDataReducer from '../../reducers';
import { AggregateSelectionInfo } from '../../models/';
import { FilterAggregateGroupComponent } from './filter-aggregate-group.component';

describe('Legacy Content - Peer - Filter Aggregate Group Component', () => {
  let fixture: ComponentFixture<FilterAggregateGroupComponent>;
  let instance: FilterAggregateGroupComponent;
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
        FilterAggregateGroupComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(FilterAggregateGroupComponent);
    instance = fixture.componentInstance;
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

  it('should apply the show-all class to the .aggregate-container when showAllAggregates is true', () => {
    instance.showAllAggregates = true;
    instance.aggregateGroup = generateMockFilterAggregateGroup();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the Options Toggle when the number of aggregates is greater than 5', () => {
    buildAggregateGroupAndMultipleItems(instance);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should toggle showAllAggregates when clicking on the .toggle-option-height', () => {
    buildAggregateGroupAndMultipleItems(instance);

    fixture.detectChanges();

    const toggleLink = fixture.debugElement.query(By.css('.toggle-option-height'));
    toggleLink.triggerEventHandler('click', null);

    expect(instance.showAllAggregates).toBe(true);
  });

  it('should show a \'Show Less\' link when showAllAggregates is true', () => {
    buildAggregateGroupAndMultipleItems(instance);
    instance.showAllAggregates = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});

function buildAggregateGroupAndMultipleItems(instance: FilterAggregateGroupComponent): void {
  instance.aggregateGroup = generateMockFilterAggregateGroup();

  for (let i = 0; i < 6; i++) {
    instance.aggregateGroup.Aggregates.push(generateMockFilterAggregateItem());
  }
}
