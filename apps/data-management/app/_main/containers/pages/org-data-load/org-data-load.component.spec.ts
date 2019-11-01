import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgDataLoadComponent } from './org-data-load.component';

describe('OrgDataLoadComponent', () => {
  let component: OrgDataLoadComponent;
  let fixture: ComponentFixture<OrgDataLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrgDataLoadComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDataLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
