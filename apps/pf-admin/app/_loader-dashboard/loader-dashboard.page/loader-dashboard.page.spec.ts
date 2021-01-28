import { ComponentFixture, TestBed } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';

import {LoaderDashboardPageComponent} from './loader-dashboard.page';

describe('LoaderDashboardPageComponent', () => {
  let component: LoaderDashboardPageComponent;
  let fixture: ComponentFixture<LoaderDashboardPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderDashboardPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
