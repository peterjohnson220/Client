import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LeftSidebarExistingFieldsComponent } from './left-sidebar-existing-fields.component';
import { generateMockField } from '../../models';


describe('Data-Insights LeftSidebarExistingFieldsComponent', () => {
  let instance: LeftSidebarExistingFieldsComponent;
  let fixture: ComponentFixture<LeftSidebarExistingFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftSidebarExistingFieldsComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(LeftSidebarExistingFieldsComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it('should expand fields', () => {
    instance.existingFieldExpanded = true;
    instance.toggleField();
    expect(instance.existingFieldExpanded).toBe(false);
  });

  it('should emit the removed field when handling field removal', () => {
    spyOn(instance.fieldRemoved, 'emit');
    const field = generateMockField();

    instance.handleFieldRemoved(field);

    expect(instance.fieldRemoved.emit).toHaveBeenCalledWith(field);
  });
});
