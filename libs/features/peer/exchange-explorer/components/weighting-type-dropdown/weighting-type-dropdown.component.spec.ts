import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightingTypeDropdownComponent } from './weighting-type-dropdown.component';

import { WeightingType } from 'libs/constants/weighting-type';

describe('Weighting Type Toggle', () => {
  let fixture: ComponentFixture<WeightingTypeDropdownComponent>;
  let instance: WeightingTypeDropdownComponent;

  // Configure Testing Module before each test.
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WeightingTypeDropdownComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(WeightingTypeDropdownComponent);
    instance = fixture.componentInstance;
  });

  it('should load the dropdown with default options', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit a weightingTypeChanged event with incWeighted value true when handleSwitchValueChanged is called', () => {
    spyOn(instance.weightingTypeChanged, 'emit');

    instance.handleDropdownValueChanged(WeightingType.INC_WEIGHTED);

    expect(instance.weightingTypeChanged.emit).toHaveBeenCalledWith(WeightingType.INC);
  });

  it('should emit a weightingTypeChanged event with incWeighted value false when handleSwitchValueChanged is called', () => {
    spyOn(instance.weightingTypeChanged, 'emit');

    instance.handleDropdownValueChanged(WeightingType.ORG_WEIGHTED);

    expect(instance.weightingTypeChanged.emit).toHaveBeenCalledWith(WeightingType.ORG);
  });
});
