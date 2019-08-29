import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { WorkbookViewsCardComponent } from './workbook-views-card.component';
import { generateMockWorkbook, generateMockView } from '../../models';

describe('Data Insights - Workbook Views Card Component', () => {
  let instance: WorkbookViewsCardComponent;
  let fixture: ComponentFixture<WorkbookViewsCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkbookViewsCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(WorkbookViewsCardComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit favoriteClicked when clicking on star icon', () => {
    const view = {...generateMockView(), IsFavorite: true};
    instance.workbook = generateMockWorkbook();
    spyOn(instance.favoriteClicked, 'emit');

    instance.handleFavoriteClicked(view);

    expect(instance.favoriteClicked.emit).toHaveBeenCalledWith({ workbookId: instance.workbook.WorkbookId, view });
  });

});
