import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFormatDropDownComponent } from './date-format-dropdown.component';

describe('DateFormatDropDownComponent', () => {
  let component: DateFormatDropDownComponent;
  let fixture: ComponentFixture<DateFormatDropDownComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ DateFormatDropDownComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFormatDropDownComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
