import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateDefaultAsyncStateObj } from 'libs/models/state';

import { WorkbookCardComponent } from './workbook-card.component';
import { generateMockWorkbook, generateMockView, View } from '../../models';

describe('Data Insights - Workbook Card Component', () => {
  let instance: WorkbookCardComponent;
  let fixture: ComponentFixture<WorkbookCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkbookCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(WorkbookCardComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should display overlay when mouse over workbook container', () => {
    instance.handleMouseOverWorkbookContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(true);
  });

  it('should NOT display overlay when mouse leave workbook container', () => {
    instance.handleMouseLeaveWorkbookContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(false);
  });

  it('should emit favoriteClicked when clicking on star icon', () => {
    const workbook = generateMockWorkbook();
    spyOn(instance.favoriteClicked, 'emit');

    instance.handleFavoriteClicked(workbook);

    expect(instance.favoriteClicked.emit).toHaveBeenCalledWith(workbook);
  });

  it('should display overlay when mouse leave workbook container if views open', () => {
    const workbook = generateMockWorkbook();

    instance.handleOpenViewsClicked(workbook);
    instance.handleMouseLeaveWorkbookContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(true);
  });

  it('should display overlay when views closed but still hovering over container', () => {
    const workbook = generateMockWorkbook();

    instance.handleMouseOverWorkbookContainer();
    instance.handleOpenViewsClicked(workbook);
    instance.handleViewsHidden();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(true);
  });

  it('should NOT display overlay when views closed and not hovering container', () => {
    const workbook = generateMockWorkbook();

    instance.handleMouseOverWorkbookContainer();
    instance.handleOpenViewsClicked(workbook);
    instance.handleMouseLeaveWorkbookContainer();
    instance.handleViewsHidden();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(false);
  });

});
