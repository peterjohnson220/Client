import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { generateMockViewField } from 'libs/models/payfactors-api';

import { PfDataGridColType } from '../../enums';

import { PfGridColumnHeaderComponent } from './pf-grid-column-header.component';

describe('Common UI - PF Grid - Grid Column Component', () => {
  let instance: PfGridColumnHeaderComponent;
  let fixture: ComponentFixture<PfGridColumnHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PfGridColumnHeaderComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PfGridColumnHeaderComponent);
    instance = fixture.componentInstance;
  });

  it('should be default when no column templates provided', () => {
    const field = generateMockViewField();

    expect(instance.getColumnHeaderType(field)).toEqual(PfDataGridColType.default);
  });

  it('should be template when a template is provided matching the field source', () => {
    instance.columnHeaderTemplates = {'Test': new Object()};
    const field = {...generateMockViewField(), SourceName: 'Test'};

    expect(instance.getColumnHeaderType(field)).toEqual(PfDataGridColType.template);
  });

  it('should be shared template when a header template is provided matching the field source', () => {
    instance.columnHeaderTemplates = {'currency': new Object()};
    const field = {...generateMockViewField(), HeaderTemplate: 'currency'};

    expect(instance.getColumnHeaderType(field)).toEqual(PfDataGridColType.sharedTemplate);
  });
});
