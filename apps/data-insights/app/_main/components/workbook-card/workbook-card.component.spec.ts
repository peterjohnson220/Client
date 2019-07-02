import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { WorkbookCardComponent } from './workbook-card.component';

describe('Data Insights - Workbook Card Comopnent', () => {
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
    const mouseOverEvent: MouseEvent = new MouseEvent('mouseover');

    instance.handleMouseOverWorkbookContainer(mouseOverEvent);
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(true);
  });

  it('should NOT display overlay when mouse leave workbook container', () => {
    instance.handleMouseLeaveWorkbookContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(false);
  });

  it('should emit favoriteClicked when clicking on star icon', () => {
    spyOn(instance.favoriteClicked, 'emit');

    instance.handleFavoriteClicked();

    expect(instance.favoriteClicked.emit).toHaveBeenCalled();
  });
});
