import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';

import * as constants from 'libs/models/community/community-constants.model';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityTagActions from '../../actions/community-tag.actions';

import { CommunityTag, CommunityPost } from 'libs/models';

@Component({
  selector: 'pf-community-text-area',
  templateUrl: './community-text-area.component.html',
  styleUrls: ['./community-text-area.component.scss']
})

export class CommunityTextAreaComponent implements OnInit, OnDestroy {

  suggestedTags: CommunityTag[] = [];
  activeTag: string;
  suggestedTag: CommunityTag;
  suggestTagsContainerVisible = true;

  suggestedCommunityTags$: Observable<CommunityTag[]>;
  suggestedCommunityTagsPostId$: Observable<string>;
  submittingCommunityPostSuccess$: Observable<CommunityPost>;
  addingCommunityPostReplySuccess$: Observable<boolean>;

  suggestedCommunityTagsSubscription: Subscription;
  suggestedCommunityTagsPostIdSubscription: Subscription;
  submittingCommunityPostSuccessSubscription: Subscription;
  addingCommunityPostReplySuccessSubscription: Subscription;

  @Input() public parentForm: FormGroup;
  @Input() public maxTextLength: number;
  @Input() public textPlaceholder: string;
  @Input() public postId: string;

  @ViewChild('discussionTextArea') discussionTextArea: ElementRef;
  @ViewChild('overlayTextArea') overlayTextArea: ElementRef;
  @ViewChild('textAreaContainer') textAreaContainer: ElementRef;
  @ViewChild('suggestTagsContainer') suggestTagsContainer: ElementRef;

  get text() { return this.parentForm.get('text'); }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.suggestTagsContainer
      && !this.suggestTagsContainer.nativeElement.contains(event.target)) {
        this.suggestedTags = [];
    }
  }

  constructor(public store: Store<fromCommunityPostReducer.State>, private fb: FormBuilder) {
    this.suggestedCommunityTagsPostId$ = this.store.select(fromCommunityPostReducer.getSuggestingCommunityTagsPostId);
    this.suggestedCommunityTags$ = this.store.select(fromCommunityPostReducer.getCommunityTags);
    this.submittingCommunityPostSuccess$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPostsSuccess);
    this.addingCommunityPostReplySuccess$ = this.store.select(fromCommunityPostReducer.getAddingCommunityPostReplySuccess);
  }

  ngOnInit() {
    this.suggestedCommunityTagsSubscription = this.suggestedCommunityTags$.subscribe((data) => {
      this.suggestedTags = data;
    });

    this.suggestedCommunityTagsPostIdSubscription = this.suggestedCommunityTagsPostId$.subscribe((data) => {
         this.suggestTagsContainerVisible = data === this.postId ? true : false;
    });

    this.submittingCommunityPostSuccessSubscription = this.submittingCommunityPostSuccess$.subscribe((response) => {
      if (response) {this.autogrow(); }
    });

    // TODO: Will NOT be needed when CommunityPostAddReplyComponent is closed after posting a reply
    this.addingCommunityPostReplySuccessSubscription = this.addingCommunityPostReplySuccess$.subscribe((response) => {
      if (response) {this.suggestedTags = []; }
    });
  }

  ngOnDestroy() {
    this.suggestedCommunityTagsPostIdSubscription.unsubscribe();
    this.suggestedCommunityTagsSubscription.unsubscribe();
    this.submittingCommunityPostSuccessSubscription.unsubscribe();
    this.addingCommunityPostReplySuccessSubscription.unsubscribe();
  }

  onKeyDown(e) {
    this.autogrow();
  }

  onKeyUp(e) {
    this.autogrow();
    this.updateTagSuggestions(e.target.selectionStart);
  }

  onSuggestedTagChange() {
    this.suggestTagsContainer.nativeElement.hidden = true;
    const regExp = new RegExp('\\' + this.activeTag + '\\b');
    const textWitheNewTags =  this.text.value.replace(regExp, this.suggestedTag.Tag);
    this.text.setValue(textWitheNewTags);

    this.suggestedTags = [];
  }

  private updateTagSuggestions(currentPos: any) {
    const origText = this.text.value;
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
      this.store.dispatch(new fromCommunityTagActions.SuggestingCommunityTags({query: this.activeTag, postId: this.postId}));
    }
  }

  private autogrow() {
    if (this.discussionTextArea.nativeElement.scrollHeight >= 50) {
      this.textAreaContainer.nativeElement.style.height = 0;
      this.textAreaContainer.nativeElement.style.height = this.discussionTextArea.nativeElement.scrollHeight + 'px';
    }
  }
}
