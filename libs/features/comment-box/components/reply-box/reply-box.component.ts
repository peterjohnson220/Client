import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  @ViewChild('contentTextArea', { static: false }) contentTextArea: ElementRef;
  @ViewChild('textCounter', { static: false }) textCounter: TextCounterComponent;
  discardReplyModalOpen: BehaviorSubject<boolean>;
  discardReplyModalOpen$: Observable<boolean>;
  showReplyBox: boolean;
  content: string;

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
    this.replyClicked.emit(this.content);
    this.clearTextBox();
  }

  updateContent(event: any) {
    this.content = event.target.value;
  }

  private clearTextBox(): void {
    this.contentTextArea.nativeElement.value = '';
    this.content = '';
    this.textCounter.reset();
  }
}
