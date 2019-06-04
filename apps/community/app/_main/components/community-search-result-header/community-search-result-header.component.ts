import { Component, Input } from '@angular/core';
import { CommunitySearchResultTypeEnum } from 'libs/models/community/community-constants.model';

@Component({
  selector: 'pf-community-search-result-header',
  templateUrl: './community-search-result-header.component.html',
  styleUrls: ['./community-search-result-header.component.scss']
})
export class CommunitySearchResultHeaderComponent {

  @Input() companyName: string;
  @Input() elapsedTime: string;
  @Input() type: CommunitySearchResultTypeEnum;
  @Input() pollExpirationDate: Date;

  constructor() { }

  isPoll(): boolean {
    return this.type === CommunitySearchResultTypeEnum.Poll;
  }

  isPollExpired() {
    return new Date() > new Date(this.pollExpirationDate);
  }

}
