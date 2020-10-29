import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { generateMockField } from 'libs/features/formula-editor';

import { AddReportFieldsComponent } from './add-report-fields.component';

describe('Data Insights - Add Report Field Component', () => {
  let instance: AddReportFieldsComponent;
  let fixture: ComponentFixture<AddReportFieldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReportFieldsComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ DropDownsModule ]
    });

    fixture = TestBed.createComponent(AddReportFieldsComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit fieldAdded with the selected field when handling value changed', () => {
    instance.fields = [ generateMockField() ];
    spyOn(instance.fieldAdded, 'emit');

    instance.handleValueChanged('DataElement_1');

    expect(instance.fieldAdded.emit).toHaveBeenCalledWith(instance.fields[0]);
  });
});
