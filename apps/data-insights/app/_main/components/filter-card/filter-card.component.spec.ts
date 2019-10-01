import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SelectionRange } from '@progress/kendo-angular-dateinputs';

import { DataViewFieldDataType } from 'libs/models/payfactors-api/reports/request';

import { FilterCardComponent } from './filter-card.component';
import { Field, generateMockField, GetFilterOptionsData, generateMockFilter } from '../../models';

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

  it('should emit selectedFieldChanged with correct field when handling field changed', () => {
    const field: Field = generateMockField();
    spyOn(instance.selectedFieldChanged, 'emit');

    instance.handleFieldChanged(field);

    expect(instance.selectedFieldChanged.emit).toHaveBeenCalledWith(field);
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
      Query: query
    };

    instance.handleMultiSelectFilterChanged(query);

    expect(instance.searchOptionChanged.emit).toHaveBeenCalledWith(expectedOptionsData);
  });

  it('should emit selectedValuesChanged with correct options when handling multi select filter selected options changed', () => {
    const selectedValues = [ 'Accountant', 'Accountant 4'];
    spyOn(instance.selectedValuesChanged, 'emit');

    instance.handleMultiSelectSelectedValuesChange(selectedValues);

    expect(instance.selectedValuesChanged.emit).toHaveBeenCalledWith(selectedValues);
  });

  it('should emit deleteFilter with filter index when handling delete filter', () => {
    instance.filterIndex = 2;
    spyOn(instance.deleteFilter, 'emit');

    instance.handleDeleteFilter();

    expect(instance.deleteFilter.emit).toHaveBeenCalledWith(2);
  });

  it('should emit selectedValuesChanged with correct date range when handling date range changed', () => {
    const selectionRange: SelectionRange = {
      start: new Date('2019-09-01'),
      end: new Date('2019-09-30')
    };
    spyOn(instance.selectedValuesChanged, 'emit');

    instance.handleDateRangeChanged(selectionRange);

    expect(instance.selectedValuesChanged.emit).toHaveBeenCalledWith(['2019-09-01', '2019-09-30']);
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
      DataType: DataViewFieldDataType.DateTime,
      DisplayName: 'Effective Date',
      EntitySourceName: 'CompanyJobs_Pricings',
      IsSelected: false,
      Order: 1,
      SourceName: 'Effective_Date',
      KendoGridField: 'CompanyJobs_Pricings.Effective_Date'
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
