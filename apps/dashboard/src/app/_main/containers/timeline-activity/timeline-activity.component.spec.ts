import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TimelineActivityComponent } from './timeline-activity.component';
import { getMockTimelineActivities } from '../../models/timeline-activity.model';

describe('timeline-activity', () => {
  let fixture: ComponentFixture<TimelineActivityComponent>;
  let instance: TimelineActivityComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimelineActivityComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TimelineActivityComponent);
    instance = fixture.componentInstance;
  });

  it('should show timeline activities', () => {
    instance.timelineActivities = getMockTimelineActivities();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show an icon with class fa-commenting-o when Type is CommunityPost and SubType is not Reply', () => {
    instance.timelineActivities = getMockTimelineActivities('CommunityPost');
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show an icon with class fa-comments when Type is CommunityPost and SubType is Reply', () => {
    instance.timelineActivities = getMockTimelineActivities('CommunityPost', 'Reply');
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show an icon with fa-share when Type is ActivityPost', () => {
    instance.timelineActivities = getMockTimelineActivities('ActivityPost');
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show an icon with fa-info when Type is ResourcesPost', () => {
    instance.timelineActivities = getMockTimelineActivities('ResourcesPost');
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});


