import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ConverterFormComponent } from './converter-form.component';

describe('Data Management - Main - Converter Form Component', () => {
  let instance: ConverterFormComponent;
  let fixture: ComponentFixture<ConverterFormComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [
        ConverterFormComponent
      ],
      imports: [
        FormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ConverterFormComponent);
    instance = fixture.componentInstance;

  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
