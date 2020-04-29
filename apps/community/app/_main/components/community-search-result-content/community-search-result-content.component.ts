import { Component, Input } from '@angular/core';
import { CommunitySearchResultTypeEnum } from 'libs/models/community/community-constants.model';

@Component({
  selector: 'pf-community-search-result-content',
  templateUrl: './community-search-result-content.component.html',
  styleUrls: ['./community-search-result-content.component.scss']
})
export class CommunitySearchResultContentComponent {

  @Input() type = CommunitySearchResultTypeEnum.Discussion;
  @Input() details: any;
  @Input() searchTerm: string;

  podcastType = CommunitySearchResultTypeEnum.Podcast;

  constructor() { }

  getContentText(): string {
    if (this.type === CommunitySearchResultTypeEnum.Discussion ||
      this.type === CommunitySearchResultTypeEnum.Reply) {
      return this.details.Content;
    } else if (this.type === CommunitySearchResultTypeEnum.Poll) {
      return this.details.Question;
    } else if (this.type === CommunitySearchResultTypeEnum.Podcast) {
      return this.details.Title;
    } else if (this.type === CommunitySearchResultTypeEnum.Attachment) {
      return this.details.Name;
    }
  }

}
