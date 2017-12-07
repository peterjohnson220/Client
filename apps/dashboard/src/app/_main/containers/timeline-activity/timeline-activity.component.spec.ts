import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TimelineActivityComponent } from './timeline-activity.component';
import { TimelineActivity } from '../../models/timeline-activity.model';

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

  function getMockTimelineActivities(type = 'mockType', subType = 'mockSubType') {
    const timelineActivities: TimelineActivity[] = [];

    timelineActivities.push({
      Type: type,
      SubType: subType,
      PostedBy: 'John Clark',
      PostedTime: '3m ago',
      Subject: 'Replied To Mike Davidson\'s post',
      Body: 'Reply to Loriem Ipsum is simple a dummy text of the printing and typesetting industry.',
      AvatarUrl: '/assets/john.png'
    });
    return timelineActivities;
  }

  it('should show timeline activities', () => {
    instance.timelineActivities = getMockTimelineActivities();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show correct html when Type is CommunityPost', () => {
    instance.timelineActivities = getMockTimelineActivities('CommunityPost');
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show correct html when Type is CommunityPost and SubType is Reply', () => {
    instance.timelineActivities = getMockTimelineActivities('CommunityPost', 'Reply');
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show correct html when Type is ActivityPost', () => {
    instance.timelineActivities = getMockTimelineActivities('ActivityPost', 'Reply');
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show correct html when Type is ResourcesPost', () => {
    instance.timelineActivities = getMockTimelineActivities('ResourcesPost', 'Reply');
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});


