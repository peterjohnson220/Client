import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineStringEditorComponent } from './inline-string-editor.component';

describe('InlineStringEditorComponent', () => {
  let component: InlineStringEditorComponent;
  let fixture: ComponentFixture<InlineStringEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InlineStringEditorComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineStringEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not allow editing when disabled', () => {
    component.isEditable = false;
    const createNewLink = fixture.debugElement.nativeElement.querySelector('span');
    createNewLink.click();
    expect(component.isInEditState).toBeFalsy();
  });

  it('should allow editing when enabled', () => {
    component.isEditable = true;
    expect(component.isInEditState).toBeFalsy();
    const createNewLink = fixture.debugElement.nativeElement.querySelector('.editable');
    createNewLink.click();
    expect(component.isInEditState).toBeTruthy();
  });
});
