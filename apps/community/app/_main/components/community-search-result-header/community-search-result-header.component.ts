import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-community-search-result-header',
  templateUrl: './community-search-result-header.component.html',
  styleUrls: ['./community-search-result-header.component.scss']
})
export class CommunitySearchResultHeaderComponent {

  @Input() companyName: string;
  @Input() elapsedTime: string;
  @Input() isPoll: boolean;
  @Input() pollExpirationDate: Date;

  constructor() { }

  postType() {
    return this.isPoll ? 'Poll' : 'Discussion';
  }

  isPollExpired() {
    return new Date() > new Date(this.pollExpirationDate);
  }

}
