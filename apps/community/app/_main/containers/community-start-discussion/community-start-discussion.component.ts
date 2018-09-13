import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityTagActions from '../../actions/community-tag.actions';

import * as constants from 'libs/models/community/community-constants.model';
import { CommunityPost, CommunityAddPost, CommunityTag } from 'libs/models/community';

@Component({
  selector: 'pf-community-start-discussion',
  templateUrl: './community-start-discussion.component.html',
  styleUrls: ['./community-start-discussion.component.scss']
})
export class CommunityStartDiscussionComponent implements OnInit, OnDestroy {
  communityDiscussionForm: FormGroup;
  UserAvatarSource = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
  postMaxLength = 2000;

  suggestedTags: CommunityTag[];
  activeTag: string;

  submittingCommunityPost$: Observable<boolean>;
  submittingCommunityPostSuccess$: Observable<CommunityPost>;
  submittingCommunityPostSuccessSubscription: Subscription;
  suggestedCommunityTagsSubscription: Subscription;

  suggestedCommunityTags$: Observable<CommunityTag[]>;

  @ViewChild('discussionTextArea') discussionTextArea: ElementRef;
  @ViewChild('overlayTextArea') overlayTextArea: ElementRef;
  @ViewChild('textAreaContainer') textAreaContainer: ElementRef;
  @ViewChild('suggestTagsContainer') suggestTagsContainer: ElementRef;

  get postText() { return this.communityDiscussionForm.get('postText'); }

  constructor(public store: Store<fromCommunityPostReducer.State>,
              private formBuilder: FormBuilder) {
    this.buildForm();

    this.submittingCommunityPost$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPosts);
    this.submittingCommunityPostSuccess$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPostsSuccess);
    this.suggestedCommunityTags$ = this.store.select(fromCommunityPostReducer.getCommunityTags);
  }

  ngOnInit() {
    this.submittingCommunityPostSuccessSubscription = this.submittingCommunityPostSuccess$.subscribe((response) => {
      if (response) {
        this.communityDiscussionForm.reset({ value: 'formState', isInternalOnly: false,  suggestedTag: ''});

        while (  this.overlayTextArea.nativeElement.firstChild) {
          this.overlayTextArea.nativeElement.removeChild(  this.overlayTextArea.nativeElement.firstChild);
        }
      }
    });

    this.suggestedCommunityTagsSubscription = this.suggestedCommunityTags$.subscribe((data) => {
      this.suggestedTags = data;
      if (data && this.suggestTagsContainer && this.suggestTagsContainer.nativeElement) {
          this.suggestTagsContainer.nativeElement.hidden = false;
        }
    });
  }

  ngOnDestroy() {
    this.submittingCommunityPostSuccessSubscription.unsubscribe();
    this.suggestedCommunityTagsSubscription.unsubscribe();
  }

  buildForm() {
    this.communityDiscussionForm = this.formBuilder.group({
      postText:   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.postMaxLength)]],
      isInternalOnly:  [false],
      suggestedTag: ['']
    });
  }

  submitPost() {
    if (this.communityDiscussionForm.valid) {
      const newPost: CommunityAddPost = {
        PostText: this.postText.value,
        IsInternalOnly: this.communityDiscussionForm.controls['isInternalOnly'].value,
        HashTags: this.postText.value.match(constants.HashTagRegEx)
      };
      this.store.dispatch(new fromCommunityPostActions.SubmittingCommunityPost(newPost));
    }
  }

  private autogrow() {
    if (this.discussionTextArea.nativeElement.scrollHeight >= 50) {
      this.textAreaContainer.nativeElement.style.height = this.discussionTextArea.nativeElement.scrollHeight + 'px';
    }
  }

  private updateTagSuggestions(currentPos: any) {
    const origText = this.postText.value;
    const slicedTextBeforeSelection = origText.slice(0, currentPos);
    let matches = slicedTextBeforeSelection.match(constants.HashTagRegEx);

    if (!matches) {
      this.suggestedTags = [];
      return;
    }

    const lastMatch = matches[matches.length - 1];
    const lastMatchIndex = slicedTextBeforeSelection.lastIndexOf(lastMatch);

    if (lastMatchIndex + lastMatch.length < currentPos) {
      this.suggestedTags = [];
      return;
    }

    const sliceAfterLastMatch = origText.slice(lastMatchIndex);
    matches = sliceAfterLastMatch.match(constants.HashTagRegEx);

    if (matches && matches.length > 0) {
      this.activeTag = matches[0];
      this.store.dispatch(new fromCommunityTagActions.SuggestingCommunityTags(this.activeTag));
    }
  }

  onKeyDown(e) {
    this.autogrow();
  }

  onKeyUp(e) {
    this.updateTagSuggestions(e.target.selectionStart);
    this.autogrow();
  }

  onSuggestedTagChange() {
    this.suggestTagsContainer.nativeElement.hidden = true;
    const newSuggestedTag = this.communityDiscussionForm.controls['suggestedTag'].value.Tag;

    const regExp = new RegExp('\\' + this.activeTag + '\\b');
    const textWitheNewTags =  this.postText.value.replace(regExp, newSuggestedTag);
    this.postText.setValue(textWitheNewTags);

    this.suggestedTags = [];
  }

}
