import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { NgxLinkifyOptions } from 'ngx-linkifyjs';

import { PfLinkifyService } from '../../services/pf-linkify-service';

import * as fromCommunityTagReducer from '../../reducers';
import * as fromCommunityTagActions from '../../actions/community-tag.actions';

import { CommunityTag } from 'libs/models';

@Component({
  selector: 'pf-community-text-area',
  templateUrl: './community-text-area.component.html',
  styleUrls: ['./community-text-area.component.scss']
})

export class CommunityTextAreaComponent implements OnInit, OnDestroy {

  suggestedTags: CommunityTag[] = [];
  activeTag: string;

  suggestedCommunityTags$: Observable<CommunityTag[]>;

  suggestedCommunityTagsSubscription: Subscription;
  textValueChangesSubscription: Subscription;

  @Input() public parentForm: FormGroup;
  @Input() public maxTextLength: 2000;
  @Input() public warningStartNumber = 1500;
  @Input() public dangerStartNumber = 1950;
  @Input() public textPlaceholder: string;
  @Input() public minimumHeight = 75;

  @ViewChild('discussionTextArea', { static: true }) discussionTextArea: ElementRef;
  @ViewChild('overlayTextArea', { static: true }) overlayTextArea: ElementRef;
  @ViewChild('textAreaContainer', { static: true }) textAreaContainer: ElementRef;
  @ViewChild('textAreaContainerScrollable', { static: true }) textAreaContainerScrollable: ElementRef;

  @ViewChild('suggestTagsContainer', { static: false }) suggestTagsContainer: ElementRef;

  get content() { return this.parentForm.get('content'); }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.suggestTagsContainer
      && !this.suggestTagsContainer.nativeElement.contains(event.target)) {
        this.suggestedTags = [];
    }
  }

  constructor(public store: Store<fromCommunityTagReducer.State>,
              public pfLinkifyService: PfLinkifyService) {
    this.suggestedCommunityTags$ = this.store.select(fromCommunityTagReducer.getCommunityTags);
   }

  ngOnInit() {
    // minimum height is configurable
    this.textAreaContainerScrollable.nativeElement.style.minHeight = this.minimumHeight + 'px';
    this.textAreaContainerScrollable.nativeElement.style.maxHeight = this.minimumHeight + 'px';

    this.textAreaContainer.nativeElement.style.minHeight = this.minimumHeight - 2 + 'px';

    this.suggestedCommunityTagsSubscription = this.suggestedCommunityTags$.subscribe((data) => {
      this.suggestedTags = data.map(tag => this.mapToCommunityTags(tag));
    });

    this.textValueChangesSubscription = this.content.valueChanges.subscribe(values => {
      this.autogrow();
   });

  }

  ngOnDestroy() {
    if (this.suggestedCommunityTagsSubscription) {
      this.suggestedCommunityTagsSubscription.unsubscribe();
    }

    if (this.textValueChangesSubscription) {
      this.textValueChangesSubscription.unsubscribe();
    }
  }

  onKeyUp(e) {
    this.updateTagSuggestions(e.target.selectionStart);
  }

  onKeyDown(event) {
    if (this.suggestedTags.length > 0) {
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
    const textWitheNewTags =  this.content.value.replace(regExp, tag);
    this.content.setValue(textWitheNewTags);

    this.suggestedTags = [];
  }

  private updateTagSuggestions(currentPos: any) {
    const origText = this.content.value;
    const slicedTextBeforeSelection = origText.slice(0, currentPos);

    let matches = this.getMatches(slicedTextBeforeSelection);

    if (matches.length <= 0) {
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
    matches = this.getMatches(sliceAfterLastMatch);

    if (matches && matches.length > 0) {
      this.activeTag = matches[0];
      this.store.dispatch(new fromCommunityTagActions.SuggestingCommunityTags({query: this.activeTag}));
    }
  }

  getMatches(sliceOfText: string) {
    if (sliceOfText) {
      return this.pfLinkifyService.getLinks(sliceOfText)
        .map(link => link.Value);
    } else {
      return [];
    }
  }

  onResize(event) {
    if ( this.hasTextareaOffsetWidth() ) {
      this.autogrow();
    }
  }

  hasTextareaOffsetWidth() {
    return this.textAreaContainer.nativeElement.offsetWidth > 0;
  }

  autogrow() {
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

  private mapToCommunityTags(tag: CommunityTag): CommunityTag {
    return {
        Id: tag.Id,
        Tag: tag.Tag,
        PostIds: tag.PostIds,
        ReplyIds: tag.ReplyIds,
        IsSuggested: false
      };
  }
}
