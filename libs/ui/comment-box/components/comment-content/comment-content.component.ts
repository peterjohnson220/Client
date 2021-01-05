import { Component, Input } from '@angular/core';

import { Comment } from '../../models';

@Component({
  selector: 'pf-comment-content',
  templateUrl: './comment-content.component.html',
  styleUrls: ['./comment-content.component.scss']
})
export class CommentContentComponent {
  @Input() comment: Comment;
}

