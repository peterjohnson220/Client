import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderDashboardGridDetailComponent } from './loader-dashboard-grid-detail.component';

describe('LoaderDashboardGridDetailComponent', () => {
  let component: LoaderDashboardGridDetailComponent;
  let fixture: ComponentFixture<LoaderDashboardGridDetailComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderDashboardGridDetailComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderDashboardGridDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
