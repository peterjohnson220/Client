import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateDefaultAsyncStateObj } from 'libs/models/state';
import { generateMockView, generateMockWorkbook, View } from 'libs/features/reports/models';

import { WorkbookViewsComponent } from './workbook-views.component';

describe('Data Insights - Workbook Views Component', () => {
  let instance: WorkbookViewsComponent;
  let fixture: ComponentFixture<WorkbookViewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkbookViewsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(WorkbookViewsComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should return no views when filtering views and workbook has no views', () => {
    const workbook = generateMockWorkbook();
    instance.workbook = workbook;

    expect(instance.filteredViews.length).toEqual(0);
  });

  it('should return views matching filter text only when filter text provided', () => {
    const workbook = generateMockWorkbook();
    const view = generateMockView();
    view.ViewName = 'Garden View';
    workbook.Views = generateDefaultAsyncStateObj<View[]>([view]);
    instance.workbook = workbook;
    instance.viewFilterValue = 'garden';
    fixture.detectChanges();

    expect(instance.filteredViews.length).toEqual(1);
  });

  it('should return no views when no view names match provided filter text', () => {
    const workbook = generateMockWorkbook();
    const view = generateMockView();
    view.ViewName = 'Garden View';
    workbook.Views = generateDefaultAsyncStateObj<View[]>([view]);
    instance.workbook = workbook;
    instance.viewFilterValue = 'Smells';
    fixture.detectChanges();

    expect(instance.filteredViews.length).toEqual(0);
  });
});
