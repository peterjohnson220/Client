import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderDashboardGridSummaryDetailComponent } from './loader-dashboard-grid-summary-detail.component';

describe('LoaderDashboardGridSummaryDetailComponent', () => {
  let component: LoaderDashboardGridSummaryDetailComponent;
  let fixture: ComponentFixture<LoaderDashboardGridSummaryDetailComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderDashboardGridSummaryDetailComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoaderDashboardGridSummaryDetailComponent);
    component = fixture.componentInstance;
    component.detailKeys = {detailKey1: 'test1', detailKey2: 'test2' };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
