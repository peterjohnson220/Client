import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  HostListener
} from '@angular/core';

import { AnyFn } from '@ngrx/store/src/selector';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import 'quill-mention';

import { EmployeeRewardsData, RichTextControl, StatementModeEnum } from '../../models';
import { UpdateStringPropertyRequest, UpdateTitleRequest } from '../../models/request-models';

const Quill = require('quill');

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
export class TrsRichTextControlComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('richText', { static: true }) richText: any;

  @Input() controlData: RichTextControl;
  @Input() mode: StatementModeEnum;
  @Input() employeeRewardsData: EmployeeRewardsData;

  @Output() onTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onContentChange: EventEmitter<UpdateStringPropertyRequest> = new EventEmitter();

  isFocused = false;
  isValid = true;
  shouldEmitSave = false;
  htmlContent: string;
  title: string;
  statementModeEnum = StatementModeEnum;

  quillApi: any;
  quillMentionContainer: HTMLElement;

  onContentChangedSubject = new Subject();
  onContentChangedSubscription = new Subscription();

  lastMouseDownElement: HTMLElement;

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
    // clear out tab key bindings with an empty handler, and quill mention will later add to that allowing the tab key to select a datafield
    keyboard: {
      bindings: {
        'tab': {
          key: 9,
          handler: function(range, context) {
            return true;
          }
        }
      }
    }
  };

  get richTextNode(): HTMLElement {
    return this.richText.elementRef.nativeElement;
  }

  // quill mention requires options with a lower case `value`
  get dataFields(): { id: string, value: string }[] {
    if (this.mode === StatementModeEnum.Edit) {
      return this.controlData.DataFields.map(df => ({ id: df.Key, value: df.Value }));
    }
    return [];
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.title = this.controlData.Title.Default;
    this.htmlContent = this.controlData.Content;

    this.onContentChangedSubscription = this.onContentChangedSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((update: UpdateStringPropertyRequest)  => {
      if (this.mode === StatementModeEnum.Edit) {
        this.onContentChange.emit(update);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.mode) {
      this.bindEmployeeData();
    }
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
        if ((op.insert && typeof op.insert === 'string') || op.insert.mention) {
          ops.push({ insert: op.insert });
        }
      });
      delta.ops = ops;
      return delta;
    });

    // get a handle to quill and the quill mention container that holds the data fields
    this.quillApi = quill;
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
      this.isValid = false;
      setTimeout(() => {
        this.isValid = true;
        this.changeDetectorRef.detectChanges();
      }, 1000);
    } else if (quillContentChange.source === 'user') {
      // change has occurred, so tell parent to save if the content changes was made by a user and not the initial load done programmatically
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

  onMentionDialogOpen() {
    // prevent bug where choosing a field, closing, then reopening with [ maintains the scroll position, since we always want to start at top
    this.quillMentionContainer.scrollTop = 0;
  }

  bindEmployeeData(): void {
    if (!this.quillApi) { return; }

    // loop through each op, aka a quill instruction to insert a chunk of text
    const delta = this.quillApi.editor.delta;
    delta.ops.forEach((op: { insert: any }) => {
      const mention = op.insert.mention;
      // if there's a mention attr it's a datafield, so adjust the displayed value according to the mode to show real data or a placeholder
      if (mention) {
        mention.value = (this.mode === StatementModeEnum.Edit) ? this.getDataFieldPlaceholderText(mention.id) : this.getFormattedDataFieldValue(mention.id);
      }
    });

    this.quillApi.setContents(delta.ops);
  }

  getDataFieldPlaceholderText(dataFieldKey: string): string {
    const dataField = this.controlData.DataFields.find(df => df.Key === dataFieldKey);
    return dataField.Value;
  }

  getFormattedDataFieldValue(dataFieldKey: string): string {
    const dataFieldValue = this.employeeRewardsData[dataFieldKey];
    return this.formatDataFieldValue(dataFieldValue);
  }

  formatDataFieldValue(value: any): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number') {
      return value.toString();
    } else if (value && typeof value === 'object' && typeof value.getMonth === 'function') {
      return months[value.getMonth()] + ' ' + value.getDate() + ' ' + value.getFullYear();
    }

    // if not a string, number or date, unclear how to format, so return empty string
    return '';
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    // focus the editor if the mousedown target is the quill editor
    if (this.richTextNode.contains(event.target as HTMLElement)) {
      this.isFocused = true;
    }
    this.lastMouseDownElement = event.target as HTMLElement;
  }

  @HostListener('document:mouseup', ['$event'])
  onDocumentMouseUp(event: MouseEvent): void {
    // bail if the mousedown target is the quill editor, since clicking + dragging + releasing outside should maintain focus
    if (this.richTextNode.contains(this.lastMouseDownElement)) {
      return;
    }
    this.isFocused = false;
  }
}
