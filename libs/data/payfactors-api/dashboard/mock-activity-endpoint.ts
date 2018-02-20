import { Observable } from 'rxjs/Observable';
import { TimelineActivityDto } from '../../../models/dashboard';

export class MockActivityEndpoint {
  static getTimelineActivities(): Observable<TimelineActivityDto[]> {
    const timelineActivities = [];

    timelineActivities.push({
      Id: 1,
      Type: 'CommunityPost',
      SubType: 'Reply',
      PostedBy: 'John Clark',
      PostedTime: '3m ago',
      Subject: 'Replied To Mike Davidson\'s post',
      Body: 'We have a group of exempt employees that we pay straight time overtime for any hours worked over 40.',
      AvatarUrl: '/client/dashboard/assets/images/placeholders/timeline-activity/john.jpg'
    });

    timelineActivities.push({
      Id: 2,
      Type: 'CommunityPost',
      SubType: 'Reply',
      PostedBy: 'Mike Davidson',
      PostedTime: '5h ago',
      Subject: 'Posted to the Payfactors Community.',
      Body: 'Where permitted by state law, does your company permit employees to drive a car for company business while using a cell phone, even if cell phone and car are enabled with hands free technology, such as Bluetooth?',
      AvatarUrl: '/client/dashboard/assets/images/placeholders/timeline-activity/mike.jpg'
    });

    timelineActivities.push({
      Id: 1,
      Type: 'ResourcesPost',
      SubType: null,
      PostedBy: 'Payfactors',
      PostedTime: '11h ago',
      Subject: 'Added new <a href="#">Release Notes.</a>',
      Body: null,
      AvatarUrl: '/client/dashboard/favicon.ico'
    });

    timelineActivities.push({
      Id: 1,
      Type: 'ActivityPost',
      SubType: null,
      PostedBy: 'Sue Jones',
      PostedTime: '2d ago',
      Subject: 'Shared <a href="#">Retail Jobs 2018</a> project with you.',
      Body: null,
      AvatarUrl: '/client/dashboard/assets/images/placeholders/timeline-activity/sue.jpg'
    });

    timelineActivities.push({
      Id: 2,
      Type: 'ResourcesPost',
      SubType: null,
      PostedBy: 'Payfactors',
      PostedTime: '7d ago',
      Subject: 'Added a new <a href="#">Video.</a>',
      Body: null,
      AvatarUrl: '/client/dashboard/favicon.ico'
    });

    return  Observable.create( observer => {
      observer.next(timelineActivities);
      observer.complete();
    } );
  }

}
