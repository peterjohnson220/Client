import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SurveySearchLayoutComponent } from './survey-search-layout.component';

describe( 'Project - Add Data - Survey Search Layout', () => {
  let instance: SurveySearchLayoutComponent;
  let fixture: ComponentFixture<SurveySearchLayoutComponent>;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ SurveySearchLayoutComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(SurveySearchLayoutComponent);
    instance = fixture.componentInstance;
  });

  it('should show an english formatted results count', () => {
    instance.resultsCount = 6000;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
