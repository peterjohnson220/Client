import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MultiSelectFilterComponent } from './multi-select-filter.component';
import { generateMockMultiSelectOption } from '../../models';

describe('Project - Add Data - Multi Select Filter', () => {
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
    const mockMultiSelectOption = generateMockMultiSelectOption();
    const filterIdAndOption = { filterId: '23094', option: mockMultiSelectOption};
    spyOn(instance.optionSelected, 'emit');

    instance.handleOptionSelected(filterIdAndOption.filterId, mockMultiSelectOption);

    expect(instance.optionSelected.emit).toHaveBeenCalledWith(filterIdAndOption);
  });

  it('should not emit anything when the option selected is disabled', () => {
    const disabledOption = {...generateMockMultiSelectOption(), Count: 0, Selected: false};
    spyOn(instance.optionSelected, 'emit');

    instance.handleOptionSelected('23908423', disabledOption);

    expect(instance.optionSelected.emit).not.toHaveBeenCalled();
  });

});
