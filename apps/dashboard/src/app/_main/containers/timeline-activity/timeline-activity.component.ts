import { Component, OnInit } from '@angular/core';

import { TimelineActivity } from '../../models';

@Component({
  selector: 'pf-timeline-activity',
  templateUrl: './timeline-activity.component.html',
  styleUrls: [ './timeline-activity.component.scss' ]
})
export class TimelineActivityComponent implements OnInit {
  timelineActivities: TimelineActivity[];

  constructor() {
    this.timelineActivities = [];
    this.timelineActivities.push({
      Type: 'CommunityPost',
      SubType: 'Reply',
      PostedBy: 'John Clark',
      PostedTime: '3m ago',
      Subject: 'Replied To Mike Davidson\'s post',
      Body: 'We have a group of exempt employees that we pay straight time overtime for any hours worked over 40.',
      AvatarUrl: '/client/dashboard/assets/images/placeholders/timeline-activity/john.jpg'
    });

    this.timelineActivities.push({
      Type: 'CommunityPost',
      SubType: null,
      PostedBy: 'Mike Davidson',
      PostedTime: '5h ago',
      Subject: 'Posted to the <a href="#">Payfactors Community.</a>',
      Body: `Where permitted by state law, does your company permit employees to drive a car for company business while using a cell phone,
       even if cell phone and car are enabled with hands free technology, such as Bluetooth?`,
      AvatarUrl: '/client/dashboard/assets/images/placeholders/timeline-activity/mike.jpg'
    });

    this.timelineActivities.push({
      Type: 'ResourcesPost',
      SubType: null,
      PostedBy: 'Payfactors',
      PostedTime: '11h ago',
      Subject: 'Added new <a href="#">Release Notes.</a>',
      Body: null,
      AvatarUrl: '/client/dashboard/favicon.ico'
    });

    this.timelineActivities.push({
      Type: 'ActivityPost',
      SubType: null,
      PostedBy: 'Sue Jones',
      PostedTime: '2d ago',
      Subject: 'Shared <a href="#">Retail Jobs 2018</a> project with you.',
      Body: null,
      AvatarUrl: '/client/dashboard/assets/images/placeholders/timeline-activity/sue.jpg'
    });

    this.timelineActivities.push({
      Type: 'ResourcesPost',
      SubType: null,
      PostedBy: 'Payfactors',
      PostedTime: '7d ago',
      Subject: 'Added a new <a href="#">Video.</a>',
      Body: null,
      AvatarUrl: '/client/dashboard/favicon.ico'
    });
  }

  ngOnInit() {
  }
}

