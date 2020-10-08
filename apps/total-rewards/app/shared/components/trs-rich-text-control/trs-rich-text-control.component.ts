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
  ViewChild,
  HostListener
} from '@angular/core';

import { AnyFn } from '@ngrx/store/src/selector';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import 'quill-mention';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { RichTextControl, StatementModeEnum } from '../../models';
import { UpdateStringPropertyRequest, UpdateTitleRequest } from '../../models/request-models';

import { environment } from 'environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const Quill = require('quill');
const cheerio = require('cheerio');

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
  @ViewChild('richText', { static: false }) richText: any;

  @Input() controlData: RichTextControl;
  @Input() mode: StatementModeEnum;
  @Input() employeeRewardsData: EmployeeRewardsData;

  @Output() onTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onContentChange: EventEmitter<UpdateStringPropertyRequest> = new EventEmitter();

  isFocused = false;
  isValid = true;
  htmlContent: string;
  title: string;
  statementModeEnum = StatementModeEnum;
  editorPlaceholderText = 'Insert text here ...';

  quillApi: any;
  quillMentionContainer: HTMLElement;

  onContentChangedSubject = new Subject();
  onContentChangedSubscription = new Subscription();

  lastMouseDownElement: HTMLElement;

  showFontFamilyMenu = environment.enableTrsCustomFontFamilies;

  quillConfig = {
    toolbar: {
      container: this.quillToolbarContainer,
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
    return this.richText?.elementRef?.nativeElement;
  }

  // quill mention requires options with a lower case `value`
  get dataFields(): { id: string, value: string }[] {
    if (this.mode === StatementModeEnum.Edit) {
      return this.controlData.DataFields.map(df => ({ id: df.Key, value: df.Value }));
    }
    return [];
  }

  get quillToolbarContainer(): any[] {
    const allOptions = [
      [{ 'font': supportedFonts }],
      [{ 'size': ['small', false, 'large'] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }],
      [{ 'align': [] }],
      [{ 'list': 'bullet' }],
    ];

    // remove the custom font family menu if disabled in environment
    return (this.showFontFamilyMenu) ? allOptions : allOptions.slice(1);
  }

  constructor(private changeDetectorRef: ChangeDetectorRef, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.title = this.controlData.Title.Default;
    this.htmlContent = this.controlData.Content;
    this.setupContentChangedSubscription();
  }

  ngOnChanges() {
    // Get the F outta here if in print mode
    if (this.mode === StatementModeEnum.Print) { return; }

    this.isValid = !this.isContentHeightGreaterThanContainerHeight();
  }

  ngOnDestroy() {
    if (this.onContentChangedSubscription) {
      this.onContentChangedSubscription.unsubscribe();
    }
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

    if (this.mode !== StatementModeEnum.Print) {
      this.isValid = !this.isContentHeightGreaterThanContainerHeight();
    }
  }

  onContentChanged(quillContentChange: any) {
    // Get the F outta here if in print mode
    if (this.mode === StatementModeEnum.Print) { return; }

    this.isValid = !this.isContentHeightGreaterThanContainerHeight();

    if (quillContentChange.source === 'user' && this.isValid) {
      this.onContentChangedSubject.next({ ControlId: this.controlData.Id, value: this.htmlContent });
    }
  }

  isContentHeightGreaterThanContainerHeight(): boolean {

    if (!this.richTextNode) { return false; } // dom isn't ready yet.

    // get dom node references to the container around the quill content and the content nodes (p tags)
    const container = this.richTextNode.querySelector('.ql-editor') as HTMLElement;
    const contentNodes = this.richTextNode.querySelectorAll('.ql-editor p, .ql-editor li') as NodeListOf<HTMLElement>;

    // calculate how many pixels tall the content is with a for loop, as IE 11 does not support NodeListOf.forEach()
    let totalContentHeightInPixels = 0;
    for (let i = 0; i < contentNodes.length; i ++) {
      totalContentHeightInPixels += contentNodes[i].offsetHeight;
    }

    return totalContentHeightInPixels > container.offsetHeight;
  }

  onSelectionChanged(quillSelectionChange: any) {
    // Get the F outta here if in print mode
    if (this.mode === StatementModeEnum.Print) { return; }

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

  bindEmployeeDataHtml(): SafeHtml {
    const $ = cheerio.load('<div class=\'ql-editor\'>' + this.htmlContent + '</div>');
    const spans = $('.ql-editor span').toArray();
    for (const span of spans) {
      if (span.attribs['data-value']) {
        const employeeField = this.controlData.DataFields.find(f => f.Value === span.attribs['data-value']);
        $('[data-value="' + employeeField.Value + '"]', '.ql-editor').replaceWith(this.getFormattedDataFieldValue(employeeField.Key));
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml($.html());
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
    const dateValue = new Date(value);

    if ( typeof value === 'string' ) {
      return value;
    } else if ( typeof value === 'number' ) {
      return value.toString();
    } else if ( value && typeof value === 'object' && typeof value.getMonth === 'function' ) {
      return months[value.getMonth()] + ' ' + value.getDate() + ' ' + value.getFullYear();
    } else if ( value && isFinite(dateValue.getTime()) ) {
      return months[dateValue.getMonth()] + ' ' + dateValue.getDate() + ' ' + dateValue.getFullYear();
    }

    // if not a string, number or date, unclear how to format, so return empty string
    return '';
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    // Get the F outta here if in print mode
    if (this.mode === StatementModeEnum.Print) { return; }

    // focus the editor if the mousedown target is the quill editor
    if (this.richTextNode?.contains(event.target as HTMLElement)) {
      this.isFocused = true;
    }
    this.lastMouseDownElement = event.target as HTMLElement;
  }

  @HostListener('document:mouseup', ['$event'])
  onDocumentMouseUp(event: MouseEvent): void {
    // Get the F outta here if in print mode
    if (this.mode === StatementModeEnum.Print) { return; }

    // bail if the mousedown target is the quill editor, since clicking + dragging + releasing outside should maintain focus
    if (this.richTextNode?.contains(this.lastMouseDownElement)) {
      return;
    }
    this.isFocused = false;
  }

  setupContentChangedSubscription(): void {
    // Get the F outta here if in print mode
    if (this.mode === StatementModeEnum.Print) { return; }

    this.onContentChangedSubscription = this.onContentChangedSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((update: UpdateStringPropertyRequest) => {
      if (this.mode === StatementModeEnum.Edit) {
        this.onContentChange.emit(update);
      }
    });
  }
}
