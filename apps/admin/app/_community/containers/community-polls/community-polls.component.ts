import { Component, OnInit } from '@angular/core';
import { CommunityPoll } from 'libs/models/community/community-poll.model';

@Component({
  selector: 'pf-community-polls',
  templateUrl: './community-polls.component.html',
  styleUrls: ['./community-polls.component.scss']
})
export class CommunityPollsComponent implements OnInit {

  gridData: CommunityPoll[];

  CommunityPollStatuses: Array<{ StatusName: string, StatusValue: number }> = [
    { StatusName: 'Draft', StatusValue: 1 },
    { StatusName: 'Live', StatusValue: 2 },
    { StatusName: 'Archived', StatusValue: 3 }
  ];

  constructor() {
    // TODO: This demo poll question will be removed
    const testPoll: CommunityPoll = {
      Question: 'This is a demo poll question',
      DatePosted: new Date(),
      NumberOfResponses: 3,
      Status: 2
    };
    this.gridData = [testPoll];
  }

  ngOnInit() {
  }

  addClicked() {
    // TODO: Open modal dialog
  }

}
