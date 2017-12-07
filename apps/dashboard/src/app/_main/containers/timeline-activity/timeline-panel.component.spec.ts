import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TimelinePanelComponent } from './timeline-panel.component';


describe('timeline-panel', () => {
  let fixture: ComponentFixture<TimelinePanelComponent>;
  let instance: TimelinePanelComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimelinePanelComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TimelinePanelComponent);
    instance = fixture.componentInstance;
  });

  it('should show timeline-activity', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});


