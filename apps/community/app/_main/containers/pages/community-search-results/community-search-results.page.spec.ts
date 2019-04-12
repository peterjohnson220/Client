import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommunitySearchResultsPageComponent } from './community-search-results.page';
import { CommunitySearchResultsComponent } from '../../community-search-results';

describe('CommunitySearchResultsComponent', () => {
  let fixture: ComponentFixture<CommunitySearchResultsPageComponent>;
  let instance: CommunitySearchResultsPageComponent;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        {
        provide: Router,
        useValue: { navigate: jest.fn() },
      },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: {queryParams: {query: 'test query'}}},
        },
      ],
      declarations: [ CommunitySearchResultsPageComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunitySearchResultsPageComponent);
    router = TestBed.get(Router);
    instance = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
