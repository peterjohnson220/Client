import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockField } from 'libs/ui/formula-editor';

import { FieldGroupComponent } from './field-group.component';

describe('Data Insights - Field Group Component', () => {
  let instance: FieldGroupComponent;
  let fixture: ComponentFixture<FieldGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldGroupComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FieldGroupComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should update showFields correctly when toggling show fields', () => {
    instance.showFields = false;

    instance.toggleShowFields();

    expect(instance.showFields).toEqual(true);
  });

  it('should emit field selected with correct field when handling field selected', () => {
    const field = generateMockField();
    spyOn(instance.fieldSelected, 'emit');

    instance.handleFieldClicked(field);

    expect(instance.fieldSelected.emit).toHaveBeenCalledWith(field);
  });
});
