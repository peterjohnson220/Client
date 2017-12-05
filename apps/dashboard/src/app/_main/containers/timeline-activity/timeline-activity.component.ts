import { Component, OnInit } from '@angular/core';
import { TimelineActivity } from '../../models/timeline-activity.model';

@Component({
  selector: 'pf-timeline-activity',
  templateUrl: './timeline-activity.component.html',
  styleUrls: ['./timeline-activity.component.css']
})
export class TimelineActivityComponent implements OnInit {
  private avatarUrl: string;
  private timelineActivities: TimelineActivity[];

  constructor( ) { }

  ngOnInit() {
      this.avatarUrl = 'https://f7021091349f6caaffd2-5b56effc7aa76a3323ddc3429496d092.ssl.cf5.rackcdn.com/avatars/default_user.png';

      this.timelineActivities = [];

      this.timelineActivities.push({
        Type: 'CommunityPost',
        SubType: 'Reply',
        PostedBy: 'John Clark',
        PostedTime: '3m ago',
        Subject: 'Replied To Mike Davidson\'s post',
        Body: 'Reply to Loriem Ipsum is simple a dummy text of the printing and typesetting industry.',
        AvatarUrl: '/assets/john.png'
      });

      this.timelineActivities.push({
        Type: 'CommunityPost',
        SubType: null,
        PostedBy: 'Mike Davidson',
        PostedTime: '5h ago',
        Subject: 'Posted to the <a href="#">Payfactors Community.</a>',
        Body: 'Loriem Ipsum is simple a dummy text of the printing and typesetting industry.',
        AvatarUrl: '/assets/adam.jpg'
      });

    this.timelineActivities.push({
      Type: 'ResourcesPost',
      SubType: null,
      PostedBy: 'Payfactors',
      PostedTime: '11h ago',
      Subject: 'Added new <a href="#">Release Notes.</a>',
      Body: null,
      AvatarUrl: '/assets/favicon.ico'
    });

    this.timelineActivities.push({
      Type: 'ActivityPost',
      SubType: null,
      PostedBy: 'Sue Jones',
      PostedTime: '2d ago',
      Subject: 'Shared <a href="#">Retail Jobs 2018</a> project with you.',
      Body: null,
      AvatarUrl: '/assets/sue.gif'
    });

    this.timelineActivities.push({
      Type: 'ResourcesPost',
      SubType: null,
      PostedBy: 'Payfactors',
      PostedTime: '7d ago',
      Subject: 'Added a new <a href="#">Video.</a>',
      Body: null,
      AvatarUrl: '/assets/favicon.ico'
    });


  }
}

