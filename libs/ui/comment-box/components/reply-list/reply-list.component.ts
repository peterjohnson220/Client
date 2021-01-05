import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Comment } from '../../models';

@Component({
  selector: 'pf-reply-list',
  templateUrl: './reply-list.component.html',
  styleUrls: ['./reply-list.component.scss']
})
export class ReplyListComponent {
  @Input() commentId: number;
  @Input() replyCount: number;
  @Input() replies: Comment[];
  @Input() loadingReplies: boolean;
  @Output() viewRepliesClicked: EventEmitter<number> = new EventEmitter();

  showReplies: boolean;

  toggleShowReplies(): void {
    this.showReplies = !this.showReplies;
    if (this.showReplies) {
      this.loadReplies();
    }
  }

  private loadReplies(): void {
    if (this.replies?.length > 0) {
      return;
    }
    this.viewRepliesClicked.emit(this.commentId);
  }
}
