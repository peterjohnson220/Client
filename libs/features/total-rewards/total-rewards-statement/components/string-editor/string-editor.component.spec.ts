import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringEditorComponent } from './string-editor.component';

describe('StringEditorComponent', () => {
  let component: StringEditorComponent;
  let fixture: ComponentFixture<StringEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StringEditorComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not allow editing when disabled', () => {
    component.inEditMode = false;
    const createNewLink = fixture.debugElement.nativeElement.querySelector('span');
    createNewLink.click();
    expect(component.isInEditState).toBeFalsy();
  });

  it('should allow editing when enabled', () => {
    component.inEditMode = true;
    expect(component.isInEditState).toBeFalsy();
    const createNewLink = fixture.debugElement.nativeElement.querySelector('.editable');
    createNewLink.click();
    expect(component.isInEditState).toBeTruthy();
  });
});
