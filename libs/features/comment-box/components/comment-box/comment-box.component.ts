import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Comment } from '../../models';

@Component({
  selector: 'pf-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent {
  @Input() comment: Comment;
  @Input() maxCharaters = 2000;
  @Input() replyEnabled = true;
  @Input() loadingReplies: boolean;
  @Input() sumbittingReply: boolean;
  @Input() sumbittingReplySuccess: boolean;
  @Input() sumbittingReplyError: boolean;
  @Input() hasCustomCommentContent: boolean;
  @Output() loadReplies: EventEmitter<number> = new EventEmitter();
  @Output() reply: EventEmitter<string> = new EventEmitter();

  handleViewRepliesClicked(commentId: number): void {
    this.loadReplies.emit(commentId);
  }

  handleReplyClicked(content: string): void {
    this.reply.emit(content);
  }
}
