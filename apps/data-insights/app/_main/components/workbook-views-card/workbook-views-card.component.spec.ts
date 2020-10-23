import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DragulaModule } from 'ng2-dragula';

import { generateDefaultAsyncStateObj } from 'libs/models';
import { generateMockView, generateMockWorkbook } from 'libs/features/reports/models';

import { WorkbookViewsCardComponent } from './workbook-views-card.component';

describe('Data Insights - Workbook Views Card Component', () => {
  let instance: WorkbookViewsCardComponent;
  let fixture: ComponentFixture<WorkbookViewsCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkbookViewsCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [DragulaModule.forRoot()]
    });

    fixture = TestBed.createComponent(WorkbookViewsCardComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit favoriteClicked when clicking on star icon', () => {
    const view = {...generateMockView(), IsFavorite: true};
    instance.workbook = {...generateMockWorkbook(), Views: generateDefaultAsyncStateObj([view])};
    spyOn(instance.favoriteClicked, 'emit');

    instance.handleFavoriteClicked({view, workbookId: instance.workbook.WorkbookId});

    expect(instance.favoriteClicked.emit).toHaveBeenCalledWith({ workbookId: instance.workbook.WorkbookId, view });
  });

});
