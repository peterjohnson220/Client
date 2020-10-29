import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockField } from 'libs/features/formula-editor';

import { ReportFieldComponent } from './report-field.component';


describe('Data-Insights Report Field Component', () => {
  let instance: ReportFieldComponent;
  let fixture: ComponentFixture<ReportFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFieldComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ReportFieldComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });


  it('should emit the removed field when handling field removal', () => {
    spyOn(instance.fieldRemoved, 'emit');
    instance.field = generateMockField();

    instance.handleFieldRemoved();

    expect(instance.fieldRemoved.emit).toHaveBeenCalledWith(instance.field);
  });

  it('should show edit form when toggleEdit is triggered', () => {
    fixture.detectChanges();
    const clickEvent = new Event('click');

    instance.toggleEdit(clickEvent);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
