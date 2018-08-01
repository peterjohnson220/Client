import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MultiSelectFilterComponent } from './multi-select-filter.component';

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

  it('should emit an object with a filterId and optionId when handling an option selected', () => {
    const optionAndFilterId = { filterId: '23094', optionId: '679043'};
    spyOn(instance.optionSelected, 'emit');

    instance.handleOptionSelected(optionAndFilterId.filterId, optionAndFilterId.optionId);

    expect(instance.optionSelected.emit).toHaveBeenCalledWith(optionAndFilterId);
  });

});
