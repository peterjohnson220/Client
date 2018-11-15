import { Component, OnInit, Input } from '@angular/core';
import { CommunityPostTypeStatusEnum } from 'libs/models/community/community-constants.model';

@Component({
  selector: 'pf-community-tab',
  templateUrl: './community-tab.component.html',
  styleUrls: ['./community-tab.component.scss']
})
export class CommunityTabComponent implements OnInit {

  @Input() type: CommunityPostTypeStatusEnum;
  @Input() active: boolean;

  icon: string;
  primaryText: string;
  secondaryText: string;

  constructor() { }

  ngOnInit() {
    this.setup();
  }

  setup() {
    if (this.type === CommunityPostTypeStatusEnum.Discussion) {
      this.icon = 'fa-comments';
      this.primaryText = 'DISCUSS';
      this.secondaryText = 'Start a discussion.';
    }  else if (this.type === CommunityPostTypeStatusEnum.Question) {
      this.icon = 'fa-chart-bar';
      this.primaryText = 'POLL';
      this.secondaryText = 'Ask a question.';
    } else if (this.type === CommunityPostTypeStatusEnum.Job) {
      this.icon = 'fa-building';
      this.primaryText = 'JOB';
      this.secondaryText = 'Post an opportunity.';
    }
  }

}
