import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DataViewReportsComponent } from './data-view-reports.component';
import {generateMockWorkbook} from '../../models';

describe('Data Insights - Dataviews View Card Component', () => {
  let instance: DataViewReportsComponent;
  let fixture: ComponentFixture<DataViewReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DataViewReportsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(DataViewReportsComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit favoriteClicked when clicking on star icon', () => {
    const workbook = {...generateMockWorkbook(), IsFavorite: true};
    spyOn(instance.favoriteClicked, 'emit');

    instance.handleFavoriteClicked(workbook.WorkbookId);

    expect(instance.favoriteClicked.emit).toHaveBeenCalledWith(workbook.WorkbookId);
  });
});
