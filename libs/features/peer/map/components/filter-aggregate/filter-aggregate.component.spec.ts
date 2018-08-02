import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import spyOn = jest.spyOn;

import { generateMockFilterAggregateItem } from 'libs/models';

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

  it(`should NOT emit an aggregateSelected event with a FilterAggregateItem when handling AggregateSelected
  and Count is 0 and Selected is false`, () => {
    instance.aggregate = {...generateMockFilterAggregateItem(), Count: 0};
    spyOn(instance.aggregateSelected, 'emit');

    instance.handleAggregateSelected(instance.aggregate);

    expect(instance.aggregateSelected.emit).not.toHaveBeenCalledWith(instance.aggregate);
  });

  it(`should be disabled if the aggregate Count is 0 and Selected is false`, () => {
    instance.aggregate = {...generateMockFilterAggregateItem(), Count: 0};

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should NOT be disabled if the aggregate Count is 0 and Selected is true`, () => {
    instance.aggregate = {...generateMockFilterAggregateItem(), Count: 0, Selected: true};

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
