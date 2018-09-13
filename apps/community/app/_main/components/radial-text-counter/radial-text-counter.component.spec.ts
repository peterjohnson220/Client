import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RadialTextCounterComponent } from './radial-text-counter.component';
import { componentFactoryName } from '@angular/compiler';

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

  it('should set radialCounterClass to radial-counter-warn radial-counter-pulse when inputTextLength >= WarningStartNumber ', () => {
    instance.WarningStartNumber = 5;
    instance.DangerStartNumber = 50;
    instance.textToCount = 'test text to count';

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should set radialCounterClass to radial-counter-danger radial-counter-pulse when inputTextLength >= DangerStartNumber ', () => {
    instance.WarningStartNumber = 5;
    instance.DangerStartNumber = 6;
    instance.textToCount = 'test text to count';

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
