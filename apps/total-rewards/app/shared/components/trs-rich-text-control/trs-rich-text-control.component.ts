import { Component, OnInit, OnDestroy, Input, ViewChild, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { AnyFn } from '@ngrx/store/src/selector';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import 'quill-mention';
import Quill from 'quill';

import { RichTextControl } from '../../models';
import { UpdateTitleRequest, UpdateStringPropertyRequest } from '../../models/request-models';

const supportedFonts = ['Arial', 'Georgia', 'TimesNewRoman', 'Verdana'];

const font = Quill.import('formats/font');
font.whitelist = supportedFonts;
Quill.register(font, true);

@Component({
  selector: 'pf-trs-rich-text-control',
  templateUrl: './trs-rich-text-control.component.html',
  styleUrls: ['./trs-rich-text-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsRichTextControlComponent implements OnInit, OnDestroy {
  @ViewChild('richText', { static: true }) richText: any;

  @Input() controlData: RichTextControl;
  @Output() onTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onContentChange: EventEmitter<UpdateStringPropertyRequest> = new EventEmitter();

  isFocused = false;
  isInvalid = false;
  shouldEmitSave = false;
  htmlContent: string;
  title: string;

  quillMentionContainer: HTMLElement;

  onContentChangedSubject = new Subject();
  onContentChangedSubscription = new Subscription();

  quillConfig = {
    toolbar: {
      container: [
        [{ 'font': supportedFonts }],
        [{ 'size': ['small', false, 'large'] }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }],
        [{ 'align': [] }],
        [{ 'list': 'bullet' }],
      ]
    },
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['['],
      showDenotationChar: false,
      onOpen: () => { this.onMentionDialogOpen(); },
      source: (searchTerm: string, renderList: AnyFn) => {
        if (searchTerm) {
          const matches = this.dataFields.filter(df => df.value.toLowerCase().includes(searchTerm.toLowerCase()));
          renderList(matches, searchTerm);
        } else {
          renderList(this.dataFields, searchTerm);
        }
      },
    },
  };

  get richTextNode(): HTMLElement {
    return this.richText.elementRef.nativeElement;
  }

  // quill mention requires options with a lower case `value`
  get dataFields(): { key: string, value: string }[] {
    return this.controlData.DataFields.map(df => ({ key: df.Key, value: df.Value }));
  }

  ngOnInit() {
    this.htmlContent = this.controlData.Content;
    this.title = this.controlData.Title.Default;
    this.onContentChangedSubscription = this.onContentChangedSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((update: UpdateStringPropertyRequest)  => this.onContentChange.emit(update));
  }

  ngOnDestroy() {
    this.onContentChangedSubscription.unsubscribe();
  }

  onTitleChanged(newTitle: string) {
    this.onTitleChange.emit({ControlId: this.controlData.Id, Title: newTitle});
  }

  onEditorCreated(quill: any) {
    // add a matcher that strips out html formatting on paste: https://github.com/quilljs/quill/issues/1184#issuecomment-384935594
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      const ops = [];
      delta.ops.forEach(op => {
        if (op.insert && typeof op.insert === 'string') {
          ops.push({ insert: op.insert });
        }
      });
      delta.ops = ops;
      return delta;
    });

    // get a handle to the quill mention container that holds the data fields
    this.quillMentionContainer = quill.getModule('mention').mentionContainer;
  }

  onContentChanged(quillContentChange: any) {
    // get dom node references to the container around the quill content and the content nodes (p tags)
    const container = this.richTextNode.querySelector('.ql-editor') as HTMLElement;
    const contentNodes = this.richTextNode.querySelectorAll('.ql-editor p') as NodeListOf<HTMLElement>;

    // calculate how many pixels tall the content is with a for loop, as IE 11 does not support NodeListOf.forEach()
    let totalContentHeightInPixels = 0;
    for (let i = 0; i < contentNodes.length; i ++) {
      totalContentHeightInPixels += contentNodes[i].offsetHeight;
    }

    // if we're over the pixel height of the container undo the change by applying the previous delta
    if (totalContentHeightInPixels > container.offsetHeight) {
      quillContentChange.editor.setContents(quillContentChange.oldDelta.ops);
      this.isInvalid = true;
      setTimeout(() => this.isInvalid = false, 1000);
    } else {
      // change has occurred, so tell parent to save
      this.onContentChangedSubject.next({ ControlId: this.controlData.Id, value: this.htmlContent });
    }
  }

  onSelectionChanged(quillSelectionChange: any) {
    if (quillSelectionChange.oldRange === null) {
      this.isFocused = true;
    }
  }

  onClickEditor() {
    // most of the time this is redundant and called after onSelectionChanged, but useful for svg clicks which don't null out `oldRange`
    if (!this.isFocused) {
      this.isFocused = true;
    }
  }

  onClickElsewhere() {
    this.isFocused = false;
  }

  onMentionDialogOpen() {
    // prevent bug where choosing a field, closing, then reopening with [ maintains the scroll position, since we always want to start at top
    this.quillMentionContainer.scrollTop = 0;
  }

}
