import {NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabsPageComponent } from './labs.page';

describe('LabsPageComponent', () => {
  let component: LabsPageComponent;
  let fixture: ComponentFixture<LabsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabsPageComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
