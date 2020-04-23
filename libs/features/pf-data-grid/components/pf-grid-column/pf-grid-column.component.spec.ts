import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataViewFieldDataType, generateMockViewField } from 'libs/models/payfactors-api';

import { PfGridColumnComponent } from './pf-grid-column.component';
import { PfDataGridColType } from '../../enums';

describe('Common UI - PF Grid - Grid Column Component', () => {
  let instance: PfGridColumnComponent;
  let fixture: ComponentFixture<PfGridColumnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PfGridColumnComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PfGridColumnComponent);
    instance = fixture.componentInstance;
  });

  it('should be default when no column templates provided', () => {
    const field = generateMockViewField();

    expect(instance.getColumnType(field)).toEqual(PfDataGridColType.default);
  });

  it('should be dateTime when column is date type', () => {
    const field = {...generateMockViewField(), DataType: DataViewFieldDataType.DateTime};

    expect(instance.getColumnType(field)).toEqual(PfDataGridColType.dateTime);
  });

  it('should be bit when column is bit type', () => {
    const field = {...generateMockViewField(), DataType: DataViewFieldDataType.Bit};

    expect(instance.getColumnType(field)).toEqual(PfDataGridColType.bit);
  });

  it('should be template when a template is provided matching the field source', () => {
    instance.columnTemplates = {'Test': new Object()};
    const field = {...generateMockViewField(), SourceName: 'Test'};

    expect(instance.getColumnType(field)).toEqual(PfDataGridColType.template);
  });

  it('should be shared template when a template is provided matching the field source', () => {
    instance.columnTemplates = {'currency': new Object()};
    const field = {...generateMockViewField(), Template: 'currency'};

    expect(instance.getColumnType(field)).toEqual(PfDataGridColType.sharedTemplate);
  });
});
