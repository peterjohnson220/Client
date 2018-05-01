import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import spyOn = jest.spyOn;

import { generateMockFilterAggregateItem } from 'libs/models/index';

import { FilterAggregateComponent } from './filter-aggregate.component';

describe('Legacy Content - Peer - Filter Aggregate Component', () => {
  let fixture: ComponentFixture<FilterAggregateComponent>;
  let instance: FilterAggregateComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterAggregateComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FilterAggregateComponent);
    instance = fixture.componentInstance;
  });

  it('should emit an aggregateSelected event with a FilterAggregateItem when handling AggregateSelected', () => {
    instance.aggregate = generateMockFilterAggregateItem();
    spyOn(instance.aggregateSelected, 'emit');

    instance.handleAggregateSelected(instance.aggregate);

    expect(instance.aggregateSelected.emit).toHaveBeenCalledWith(instance.aggregate);
  });
});
