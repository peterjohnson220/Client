import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySearchResultsPageComponent } from './community-search-results.page';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

describe('CommunitySearchResultsComponent', () => {
  let component: CommunitySearchResultsPageComponent;
  let fixture: ComponentFixture<CommunitySearchResultsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySearchResultsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
