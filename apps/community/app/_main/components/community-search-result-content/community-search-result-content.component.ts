import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-community-search-result-content',
  templateUrl: './community-search-result-content.component.html',
  styleUrls: ['./community-search-result-content.component.scss']
})
export class CommunitySearchResultContentComponent {

  @Input() content: string;
  @Input() searchTerm: string;
  constructor() { }

}
