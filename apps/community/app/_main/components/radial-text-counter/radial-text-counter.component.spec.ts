import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RadialTextCounterComponent } from './radial-text-counter.component';

describe('CommunityStartDiscussionComponent', () => {
  let fixture: ComponentFixture<RadialTextCounterComponent>;
  let instance: RadialTextCounterComponent;


  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        RadialTextCounterComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(RadialTextCounterComponent);
    instance = fixture.componentInstance;
  });

  it('should show radial text counter', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
