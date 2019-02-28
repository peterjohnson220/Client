import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LinkType } from 'ngx-linkifyjs';
import { NgxLinkifyOptions } from 'ngx-linkifyjs';

@Component({
  selector: 'pf-community-post-content',
  templateUrl: './community-post-content.component.html',
  styleUrls: ['./community-post-content.component.scss'],
})
export class CommunityPostContentComponent {
  @Input() content: string;
  @Output() public hashTagClicked = new EventEmitter();

  constructor() {}

  tagClicked(tagName: string) {
    this.hashTagClicked.emit(tagName);
  }
}
