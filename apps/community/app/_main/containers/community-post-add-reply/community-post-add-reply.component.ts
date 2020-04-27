import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfLinkifyService } from '../../services/pf-linkify-service';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import * as fromCommunityPostAddReplyViewReducer from '../../reducers';
import { CommunityAddReply } from 'libs/models/community';
import { CommunityReply } from 'libs/models/community';
import { SelectEvent, RemoveEvent, UploadEvent } from '@progress/kendo-angular-upload';
import { mapFileInfoToCommunityAddAttachment } from '../../helpers/model-mapping.helper';
import { CommunityAttachment } from 'libs/models/community/community-attachment.model';

@Component({
  selector: 'pf-community-post-add-reply',
  templateUrl: './community-post-add-reply.component.html',
  styleUrls: ['./community-post-add-reply.component.scss']
})
export class CommunityPostAddReplyComponent implements OnInit, OnDestroy {
  @Input() postId: string;
  @Input() maximumReplies: number;
  @Input() replyCount: number;
  @Output() replySubmitted = new EventEmitter<boolean>();
  communityPostReplyForm: FormGroup;
  replyMaxLength = 2000;
  addingCommunityPostReply$: Observable<boolean>;
  addedReplyView$: Observable<CommunityReply[]>;
  addingCommunityPostReplySuccess$: Observable<boolean>;
  addingCommunityPostReplySuccessSubscription: Subscription;
  addedRepliesSubscription: Subscription;
  addedRepliesCount = 0;

  uploadedFiles: CommunityAttachment[] = [];
  saveAttachmentUrl = '/odata/CloudFiles.UploadCommunityAttachment';
  removeAttachmentUrl = '/odata/CloudFiles.DeleteCommunityAttachment';

  constructor(public store: Store<fromCommunityPostReplyReducer.State>,
              public addReplyViewStore: Store<fromCommunityPostAddReplyViewReducer.State>,
              private formBuilder: FormBuilder,
              public pfLinkifyService: PfLinkifyService) {
    this.buildForm();

    this.addingCommunityPostReply$ = this.store.select(fromCommunityPostReplyReducer.getAddingCommunityPostReply);
    this.addingCommunityPostReplySuccess$ = this.store.select(fromCommunityPostReplyReducer.getAddingCommunityPostReplySuccess);
    this.addedReplyView$ = this.addReplyViewStore.select(fromCommunityPostAddReplyViewReducer.getFilteredCommunityPostAddReplyView);
  }

  buildForm() {
    this.communityPostReplyForm = this.formBuilder.group({
      context:   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.replyMaxLength)]]
    });

  }
  ngOnInit()  {
    this.addingCommunityPostReplySuccessSubscription = this.addingCommunityPostReplySuccess$.subscribe((response) => {
        if (response) {
          this.communityPostReplyForm.reset();
        }
    });
    this.addedRepliesSubscription = this.addedReplyView$.subscribe(results => {
      this.addedRepliesCount = results.filter(x => x.PostId === this.postId).length;
    });
  }

  ngOnDestroy() {
    if (this.addingCommunityPostReplySuccessSubscription) {
      this.addingCommunityPostReplySuccessSubscription.unsubscribe();
    }

    if (this.addedRepliesSubscription) {
      this.addedRepliesSubscription.unsubscribe();
    }
  }

  submitReply() {
    if (this.communityPostReplyForm.valid) {

      const replyText = this.communityPostReplyForm.controls['context'].value;

      const newReply: CommunityAddReply = {
        PostId: this.postId,
        ReplyText: replyText,
        Links: this.pfLinkifyService.getLinks(replyText),
        Attachments: this.uploadedFiles
      };
      this.store.dispatch(new fromCommunityPostReplyActions.AddingCommunityPostReply(newReply));
      this.replySubmitted.emit();
    }
  }

  uploadAttachmentEventHandler(e: UploadEvent) {
    // this method is called one file at a time
    const file = e.files[0];
    const cloudFileName = `${file.uid}_${file.name}`;
    e.data = {CloudFileName: cloudFileName};
    this.uploadedFiles.push(mapFileInfoToCommunityAddAttachment(file, cloudFileName));
  }

  removeAttachmentEventHandler(e: RemoveEvent) {
    // this method is called one file at a time
    const file = e.files[0];
    file.name = `${file.uid}_${file.name}`;

    const index = this.uploadedFiles.findIndex(f => f.CloudFileName === file.name);
    if ( index >= 0 ) {
      this.uploadedFiles.splice(index, 1);
    }
  }
}
