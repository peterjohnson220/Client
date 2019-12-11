import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SearchWorkbookResultComponent } from './search-workbook-result.component';
import { generateMockSearchResult } from '../../models';

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
    instance.result = generateMockSearchResult();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
