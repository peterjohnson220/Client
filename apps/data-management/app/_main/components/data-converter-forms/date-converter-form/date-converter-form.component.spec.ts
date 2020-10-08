import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateConverterFormComponent } from './date-converter-form.component';

describe('Data Management - Main - Date Converter Form Component', () => {
  let component: DateConverterFormComponent;
  let fixture: ComponentFixture<DateConverterFormComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ DateConverterFormComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateConverterFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
