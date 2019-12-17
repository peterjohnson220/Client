import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTemplatePageComponent } from './edit-template.page';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditTemplatePageComponent', () => {
  let component: EditTemplatePageComponent;
  let fixture: ComponentFixture<EditTemplatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTemplatePageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
