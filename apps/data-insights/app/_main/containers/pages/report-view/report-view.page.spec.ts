import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReportViewTypes } from 'libs/features/reports/models';

import { ReportViewPageComponent } from './report-view.page';

describe('Data Insights - Report View Page Component', () => {
  let instance: ReportViewPageComponent;
  let fixture: ComponentFixture<ReportViewPageComponent>;
  let route: ActivatedRoute;
  const queryStringParams = { 'title': 'Salary Structures', 'showTabs' : 'true' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportViewPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: { get: (key) =>  queryStringParams[key] },
              params: { viewName: 'Test View Name', workbookName: 'Test Workbook Name', workbookId: '123' },
              data: { viewType: ReportViewTypes.StandardWorkbook }
            }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ReportViewPageComponent);
    instance = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
