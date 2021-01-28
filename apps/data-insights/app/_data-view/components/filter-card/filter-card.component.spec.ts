import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
  DataViewAccessLevel,
  Field,
  FieldDataType,
  FieldType,
  Filter,
  generateMockField,
  generateMockFilter,
  getDefaultOperatorByDataType,
  GetFilterOptionsData,
  validateFilter
} from 'libs/ui/formula-editor';

import { FilterCardComponent } from './filter-card.component';

describe('Data Insights - Filter Card Component', () => {
  let instance: FilterCardComponent;
  let fixture: ComponentFixture<FilterCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterCardComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FilterCardComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit filterChanged with correct field when handling field changed', () => {
    instance.filter = generateMockFilter();
    const field: Field = generateMockField();
    const expectedFilter: Filter = {
      Field: field,
      Operator: getDefaultOperatorByDataType(field),
      Options: [],
      SelectedOptions: [],
      IsValid: false,
      IsLocked: false
    };
    spyOn(instance.filterChanged, 'emit');

    instance.handleFieldChanged(field);

    expect(instance.filterChanged.emit).toHaveBeenCalledWith(expectedFilter);
  });

  it('should emit searchOptionChanged with correct data when handling multi select filter changed', () => {
    instance.filterIndex = 1;
    instance.filter = generateMockFilter();
    const query = 'Accountant';

    spyOn(instance.searchOptionChanged, 'emit');
    const expectedOptionsData: GetFilterOptionsData = {
      FilterIndex: 1,
      EntitySourceName: 'CompanyJobs',
      SourceName: 'Job_Title',
      Query: query,
      BaseEntitySourceName: null,
      DisablePagingAndSorting: false,
      ApplyDefaultFilters: true,
      OptionalFilters: null
    };

    instance.handleMultiSelectFilterChanged(query);

    expect(instance.searchOptionChanged.emit).toHaveBeenCalledWith(expectedOptionsData);
  });

  it('should emit filterChanged with correct options when handling multi select filter selected options changed', () => {
    const selectedValues = [ 'Accountant', 'Accountant 4'];
    instance.filter = generateMockFilter();
    const expectedFilter = generateMockFilter();
    expectedFilter.SelectedOptions = selectedValues;
    expectedFilter.IsValid = validateFilter(expectedFilter);
    spyOn(instance.filterChanged, 'emit');

    instance.handleSelectedOptionsChange(selectedValues);

    expect(instance.filterChanged.emit).toHaveBeenCalledWith(expectedFilter);
  });

  it('should emit deleteFilter with filter index when handling delete filter', () => {
    instance.filterIndex = 2;
    spyOn(instance.deleteFilter, 'emit');

    instance.handleDeleteFilter();

    expect(instance.deleteFilter.emit).toHaveBeenCalledWith(2);
  });

  it('should change editMode correctly when toggling edit mode', () => {
    instance.editMode = false;

    instance.toggleEditMode();

    expect(instance.editMode).toEqual(true);
  });

  it('should return 1 for selected options count when field data type is datetime', () => {
    const field: Field = {
      DataElementId: 1,
      EntityId: 1,
      Entity: 'Pricings',
      DataType: FieldDataType.Date,
      DisplayName: 'Effective Date',
      EntitySourceName: 'CompanyJobs_Pricings',
      IsSelected: false,
      IsSortable: true,
      Order: 1,
      SourceName: 'Effective_Date',
      KendoGridField: 'CompanyJobs_Pricings.Effective_Date',
      FieldType: FieldType.DataElement,
      AccessLevel: DataViewAccessLevel.Owner
    };
    instance.filter = {
      ...generateMockFilter(),
      Field: field,
      SelectedOptions: ['2019-09-01', '2019-09-30']
    };

    expect(instance.selectedOptionsCount).toEqual(1);
  });

  it('should return selected options length as count when field data type is NOT datetime', () => {
    instance.filter = {
      ...generateMockFilter(),
      SelectedOptions: ['Accountant', 'Accountant II']
    };

    expect(instance.selectedOptionsCount).toEqual(2);
  });
});
