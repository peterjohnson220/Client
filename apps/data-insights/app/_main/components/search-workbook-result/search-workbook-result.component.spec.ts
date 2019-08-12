import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SearchWorkbookResultComponent } from './search-workbook-result.component';
import { generateMockWorkbook } from '../../models';

describe('Data Insights - Search Workbook Result Component', () => {
  let instance: SearchWorkbookResultComponent;
  let fixture: ComponentFixture<SearchWorkbookResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchWorkbookResultComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SearchWorkbookResultComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit openViewsClicked when open views icon toggled to open', () => {
    spyOn(instance.openViewsClicked, 'emit');
    instance.openViews = false;
    instance.workbook = generateMockWorkbook();

    instance.handleOpenViewsClicked();
    fixture.detectChanges();

    expect(instance.openViewsClicked.emit).toHaveBeenCalledWith(instance.workbook);
  });

  it('should NOT emit openViewsClicked when open views icon toggled to close', () => {
    spyOn(instance.openViewsClicked, 'emit');
    instance.openViews = true;
    instance.workbook = generateMockWorkbook();

    instance.handleOpenViewsClicked();
    fixture.detectChanges();

    expect(instance.openViewsClicked.emit).not.toHaveBeenCalledWith(instance.workbook);
  });
});
