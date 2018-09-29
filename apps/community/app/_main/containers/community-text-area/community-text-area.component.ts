import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';

import * as constants from 'libs/models/community/community-constants.model';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostAddReplyReducer from '../../reducers';
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
  suggestTagsContainerVisible = true;

  suggestedCommunityTags$: Observable<CommunityTag[]>;
  suggestedCommunityTagsPostId$: Observable<string>;

  suggestedCommunityTagsSubscription: Subscription;
  suggestedCommunityTagsPostIdSubscription: Subscription;
  textValueChangesSubscription: Subscription;

  @Input() public parentForm: FormGroup;
  @Input() public maxTextLength: 2000;
  @Input() public warningStartNumber = 1500;
  @Input() public dangerStartNumber = 1950;
  @Input() public textPlaceholder: string;
  @Input() public postId: string;

  @ViewChild('discussionTextArea') discussionTextArea: ElementRef;
  @ViewChild('overlayTextArea') overlayTextArea: ElementRef;
  @ViewChild('textAreaContainer') textAreaContainer: ElementRef;
  @ViewChild('suggestTagsContainer') suggestTagsContainer: ElementRef;

  get context() { return this.parentForm.get('context'); }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.suggestTagsContainer
      && !this.suggestTagsContainer.nativeElement.contains(event.target)) {
        this.suggestedTags = [];
    }
  }

  constructor(public store: Store<fromCommunityPostReducer.State>) {
    this.suggestedCommunityTagsPostId$ = this.store.select(fromCommunityPostReducer.getSuggestingCommunityTagsPostId);
    this.suggestedCommunityTags$ = this.store.select(fromCommunityPostReducer.getCommunityTags);
   }

  ngOnInit() {
    this.suggestedCommunityTagsSubscription = this.suggestedCommunityTags$.subscribe((data) => {
      this.mapToCommunityTags(data);
    });

    this.suggestedCommunityTagsPostIdSubscription = this.suggestedCommunityTagsPostId$.subscribe((data) => {
         this.suggestTagsContainerVisible = data === this.postId;
    });

    this.textValueChangesSubscription = this.context.valueChanges.subscribe(values => {
      this.autogrow();
    });
  }

  ngOnDestroy() {
    this.suggestedCommunityTagsPostIdSubscription.unsubscribe();
    this.suggestedCommunityTagsSubscription.unsubscribe();
    this.textValueChangesSubscription.unsubscribe();
  }

  onKeyUp(e) {
    this.updateTagSuggestions(e.target.selectionStart);
  }

  onKeyDown(event) {
    if (this.suggestedTags.length > 0 && this.suggestTagsContainerVisible) {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.suggestedTagsSelectionMoveUp();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.suggestedTagsSelectionMoveDown();
      }
    }
  }

  onSuggestedTagChange(tag: CommunityTag) {
    const regExp = new RegExp('\\' + this.activeTag + '\\b');
    const textWitheNewTags =  this.context.value.replace(regExp, tag);
    this.context.setValue(textWitheNewTags);

    this.suggestedTags = [];
  }

  private updateTagSuggestions(currentPos: any) {
    const origText = this.context.value;
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
    this.textAreaContainer.nativeElement.style.height = 0;
    this.textAreaContainer.nativeElement.style.height = this.discussionTextArea.nativeElement.scrollHeight + 'px';
  }

  private suggestedTagsSelectionMoveUp() {
    let focusedTagIndex = this.suggestedTags.findIndex(x => x.IsSuggested === true);

    if (focusedTagIndex <= 0) {
      focusedTagIndex = this.suggestedTags.length - 1;
    } else {
      focusedTagIndex -= 1;
    }

    this.suggestedTags.forEach(element => { element.IsSuggested = false; });
    this.suggestedTags[focusedTagIndex].IsSuggested = true;
  }

  private suggestedTagsSelectionMoveDown() {
    let focusedTagIndex = this.suggestedTags.findIndex(x => x.IsSuggested === true);

    if (focusedTagIndex < 0 || focusedTagIndex >= this.suggestedTags.length - 1) {
      focusedTagIndex = 0;
    } else {
      focusedTagIndex += 1;
    }

    this.suggestedTags.forEach(element => { element.IsSuggested = false; });
    this.suggestedTags[focusedTagIndex].IsSuggested = true;
  }

  private mapToCommunityTags(data: CommunityTag[]) {
    this.suggestedTags = [];
    data.forEach(tag => {
      this.suggestedTags.push({
        Tag: tag.Tag,
        PostIds: tag.PostIds,
        ReplyIds: tag.ReplyIds,
        IsSuggested: false
      });
    });
  }


}
