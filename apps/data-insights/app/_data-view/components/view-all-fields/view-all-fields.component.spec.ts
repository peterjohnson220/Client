import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockField } from 'libs/ui/formula-editor';

import { ViewAllFieldsComponent } from './view-all-fields.component';

describe('Data Insights - View All Fields Component', () => {
  let instance: ViewAllFieldsComponent;
  let fixture: ComponentFixture<ViewAllFieldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllFieldsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ViewAllFieldsComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit fieldAdded when IsSelected property of the selected field is false ', () => {
    const field = generateMockField();
    spyOn(instance.fieldAdded, 'emit');

    instance.handleFieldSelected(field);

    expect(instance.fieldAdded.emit).toHaveBeenCalledWith(field);
  });

  it('should emit fieldRemoved when IsSelected property of the selected field is true ', () => {
    const field = { ...generateMockField(), IsSelected: true };
    spyOn(instance.fieldRemoved, 'emit');

    instance.handleFieldSelected(field);

    expect(instance.fieldRemoved.emit).toHaveBeenCalledWith(field);
  });

  it('should emit backButtonClicked when clicking on back button', () => {
    spyOn(instance.backButtonClicked, 'emit');

    instance.handleBackButtonClicked();

    expect(instance.backButtonClicked.emit).toHaveBeenCalled();
  });
});
