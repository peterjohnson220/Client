import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoShareComponent } from './auto-share.component';

describe('AutoShareComponent', () => {
  let component: AutoShareComponent;
  let fixture: ComponentFixture<AutoShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoShareComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
