import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockMultiSelectFilter, generateMockMultiSelectOption } from '../../../models';
import { MultiSelectFilterComponent } from './multi-select-filter.component';

describe('Search Feature - Multi Select Filter', () => {
  let instance: MultiSelectFilterComponent;
  let fixture: ComponentFixture<MultiSelectFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectFilterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(MultiSelectFilterComponent);
    instance = fixture.componentInstance;
  });

  it('should emit an object with a filterId and an option when handling an option selected', () => {
    const mockMultiSelectFilter = generateMockMultiSelectFilter();
    const filterIdAndOption = { filterId: '23094', option: mockMultiSelectFilter.Options[0]};
    spyOn(instance.optionSelected, 'emit');

    instance.filter = mockMultiSelectFilter;
    instance.handleOptionSelected(filterIdAndOption.filterId, mockMultiSelectFilter.Options[0]);

    expect(instance.optionSelected.emit).toHaveBeenCalledWith(filterIdAndOption);
  });

  it('should not emit anything when the option selected is disabled', () => {
    const disabledOption = {...generateMockMultiSelectOption(), Count: 0, Selected: false};
    spyOn(instance.optionSelected, 'emit');

    instance.handleOptionSelected('23908423', disabledOption);

    expect(instance.optionSelected.emit).not.toHaveBeenCalled();
  });

});
