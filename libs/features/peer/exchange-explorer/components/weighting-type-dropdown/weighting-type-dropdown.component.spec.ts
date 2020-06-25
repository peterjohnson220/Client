import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightingTypeDropdownComponent } from './weighting-type-dropdown.component';

import { WeightType, WeightTypeDisplayLabeled } from 'libs/data/data-sets';

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

  it('should load the dropdown with the label', () => {
    instance.includeLabel = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should load the dropdown as if it was in a component', () => {
    instance.inComponent = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit a weightingTypeChanged event with incWeighted value true when handleSwitchValueChanged is called', () => {
    spyOn(instance.weightingTypeChanged, 'emit');

    instance.handleDropdownValueChanged({ Name: WeightTypeDisplayLabeled.Inc, Value: WeightType.Inc });

    expect(instance.weightingTypeChanged.emit).toHaveBeenCalledWith({ Name: WeightTypeDisplayLabeled.Inc, Value: WeightType.Inc });
  });

  it('should emit a weightingTypeChanged event with incWeighted value false when handleSwitchValueChanged is called', () => {
    spyOn(instance.weightingTypeChanged, 'emit');

    instance.handleDropdownValueChanged({ Name: WeightTypeDisplayLabeled.Org, Value: WeightType.Org });

    expect(instance.weightingTypeChanged.emit).toHaveBeenCalledWith({ Name: WeightTypeDisplayLabeled.Org, Value: WeightType.Org });
  });
});
