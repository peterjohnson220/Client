import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { QuillEditorComponent } from 'ngx-quill';

import { TextCounterComponent } from '../text-counter';

@Component({
  selector: 'pf-reply-box',
  templateUrl: './reply-box.component.html',
  styleUrls: ['./reply-box.component.scss']
})
export class ReplyBoxComponent {
  @Input() maxCharacters = 2000;
  @Input() warningStartNumber = 1500;
  @Input() dangerStartNumber = 1950;
  @Input() submitting: boolean;
  @Input() commentPlaceholder = 'Add reply...';
  @Output() replyClicked: EventEmitter<string> = new EventEmitter();

  @ViewChild('quillEditor', { static: false }) quill: QuillEditorComponent;
  @ViewChild('textCounter', { static: false }) textCounter: TextCounterComponent;
  discardReplyModalOpen: BehaviorSubject<boolean>;
  discardReplyModalOpen$: Observable<boolean>;
  showReplyBox: boolean;
  content: string;
  contentHtml: string;
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ]
    }
  };

  constructor() {
    this.discardReplyModalOpen = new BehaviorSubject<boolean>(false);
    this.discardReplyModalOpen$ = this.discardReplyModalOpen.asObservable();
  }

  close(): void {
    this.showReplyBox = false;
  }

  toggleTextBox(): void {
    this.showReplyBox = !this.showReplyBox;
  }

  handleDiscardClicked(): void {
    if (!!this.content && !!this.content.length) {
      this.openDiscardReplyModal();
    } else {
      this.toggleTextBox();
    }
  }

  openDiscardReplyModal(): void {
    this.discardReplyModalOpen.next(true);
  }

  dismissDiscardReplyModal(): void {
    this.discardReplyModalOpen.next(false);
  }

  discardReply(): void {
    this.discardReplyModalOpen.next(false);
    this.clearTextBox();
    this.toggleTextBox();
  }

  submitReply(): void {
    this.replyClicked.emit(this.contentHtml);
    this.clearTextBox();
  }

  updateContent(event: any) {
    this.content = event.text.trim();
    this.contentHtml = event.html;
    const editor = event.editor;
    if (this.maxCharacters && this.content.length > this.maxCharacters) {
      editor.deleteText(this.maxCharacters, this.content.length);
    }
  }

  private clearTextBox(): void {
    this.quill.quillEditor.deleteText(0, this.content.length);
    this.textCounter.reset();
  }
}
