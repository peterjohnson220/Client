import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SearchLayoutComponent } from './search-layout.component';

describe('Search Feature - Search Layout', () => {
  let instance: SearchLayoutComponent;
  let fixture: ComponentFixture<SearchLayoutComponent>;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ SearchLayoutComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(SearchLayoutComponent);
    instance = fixture.componentInstance;
  });

  it('should show an english formatted results count', () => {
    instance.resultsCount = 6000;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show results count div when results count input = null', () => {
    instance.resultsCount = null;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
