import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RangeFilterComponent } from './range-filter.component';
import { generateMockChangeContext } from '../../../models';

describe('Search Feature - Range Select Filter', () => {
  let instance: RangeFilterComponent;
  let fixture: ComponentFixture<RangeFilterComponent>;

  beforeEach( () => {
   TestBed.configureTestingModule({
     declarations: [ RangeFilterComponent ],
     schemas: [ NO_ERRORS_SCHEMA ]
   });
   fixture = TestBed.createComponent(RangeFilterComponent);
   instance = fixture.componentInstance;
  });

  it('should emit an object with a filterId, maxValue and minValue', () => {
    const changeContextValue = generateMockChangeContext();
    const filterId = '12345';
    const response = {
      'filterId': filterId,
      'maxValue': changeContextValue.highValue,
      'minValue': changeContextValue.value
    };
    spyOn(instance.rangeChange, 'emit');

    instance.handleRangeSliderChange(filterId, changeContextValue);

    expect(instance.rangeChange.emit).toHaveBeenCalledWith(response);
  });
});
