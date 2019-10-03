import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { MultiSelectFilterComponent } from './multi-select-filter.component';

describe('Data Insights - Multi Selert Filter Card Component', () => {
  let instance: MultiSelectFilterComponent;
  let fixture: ComponentFixture<MultiSelectFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectFilterComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ DropDownsModule ]
    });

    fixture = TestBed.createComponent(MultiSelectFilterComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should not open popup when query length is less than required length', () => {
    instance.filterValue = '';
    const openEvent: Event = new Event('open');
    spyOn(openEvent, 'preventDefault');

    instance.handleFilterOptionsMultiSelectOpen(openEvent);

    expect(openEvent.preventDefault).toHaveBeenCalled();
  });

  it('should emit filter value correctly when handling value changed', () => {
    const query = 'Acc';
    spyOn(instance.filterChanged, 'emit');

    instance.handleFilterChange(query);

    expect(instance.filterChanged.emit).toHaveBeenCalledWith(query);
  });

  it('should NOT emit filterChanged if query length is less than required length', () => {
    const query = '';
    spyOn(instance.filterChanged, 'emit');

    instance.handleFilterChange(query);

    expect(instance.filterChanged.emit).not.toHaveBeenCalledWith(query);
  });

  it('should not open popup if query length is less than required length', () => {
    const query = '';
    spyOn(instance.filterOptionsMultiSelect, 'toggle');

    instance.handleFilterChange(query);

    expect(instance.filterOptionsMultiSelect.toggle).toHaveBeenCalledWith(false);
  });

  it('should emit selectedValuesChanged with correct options when handling selected values changed', () => {
    instance.selectedOptions = ['Accountant', 'Accountant II'];
    spyOn(instance.selectedValuesChanged, 'emit');

    instance.handleSelectedValuesChange();

    expect(instance.selectedValuesChanged.emit).toHaveBeenCalledWith(['Accountant', 'Accountant II']);
  });

  it('should return correct isOptionSelected value when there is selected option', () => {
    instance.selectedOptions = ['Accountant', 'Accountant II'];

    expect(instance.isOptionSelected('Accountant')).toEqual(true);
  });

  it('should return correct isOptionSelected value when there is NONE selected option', () => {
    instance.selectedOptions = ['Accountant', 'Accountant II'];

    expect(instance.isOptionSelected('Teacher')).toEqual(false);
  });
});
