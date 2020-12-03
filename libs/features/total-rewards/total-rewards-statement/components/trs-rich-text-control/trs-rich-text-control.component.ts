import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Output,
  ViewChild,
  SimpleChanges, HostListener
} from '@angular/core';

import { AnyFn } from '@ngrx/store/src/selector';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import 'quill-mention';
import QuillType from 'quill';

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
export class TrsRichTextControlComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('richText', { static: false }) richText: any;

  @Input() controlData: RichTextControl;
  @Input() mode: StatementModeEnum;
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() height: string;
  @Input() showTitle = true;
  @Input() activeEditorId: string;

  @Output() onTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onContentChange: EventEmitter<UpdateStringPropertyRequest> = new EventEmitter();
  @Output() onRTEFocusChange: EventEmitter<string> = new EventEmitter();

  isValid = true;
  htmlContent: string;
  title: string;
  statementModeEnum = StatementModeEnum;
  toolbarId: string;

  quillMentionContainer: HTMLElement;
  quillEditor: QuillType;

  onContentChangedSubject = new Subject();
  onContentChangedSubscription = new Subscription();

  showFontFamilyMenu = environment.enableTrsCustomFontFamilies;

  mentionConfig = {
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
  };

  get richTextNode(): HTMLElement {
    return this.quillEditor?.container;
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

  get cssClasses(): any[] {
    const classes = [this.formatCssDefaultTitle()];
    if (this.isFocused) {
      classes.push('active');
    }
    if (!this.isValid) {
      classes.push('invalid');
    }
    return classes;
  }

  get isFocused(): boolean {
    return this.controlData.Id === this.activeEditorId;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.title = this.controlData.Title.Default;
    this.htmlContent = this.controlData.Content;
    this.toolbarId = '#quill-editor-toolbar-' + this.controlData.Id;
    this.setupContentChangedSubscription();
    this.createStyleSheet();
  }

  ngAfterViewInit() {
    if (this.mode === this.statementModeEnum.Edit) {
      this.createQuillEditor();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Get the F outta here if in print mode
    if (this.mode === StatementModeEnum.Print) { return; }

    if (changes.mode?.currentValue === this.statementModeEnum.Edit && changes.mode?.previousValue === this.statementModeEnum.Preview) {
      setTimeout(() => {
        this.createQuillEditor();
      }, 0);
    }

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

  createQuillEditor() {
    this.quillEditor = new Quill('#quill-editor-' + this.controlData.Id, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: this.toolbarId,
        },
        mention: this.mentionConfig,
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
      }
    });

    // Set default
    const initialContent = this.quillEditor.clipboard.convert(this.controlData.Content);
    this.quillEditor.setContents(initialContent, 'silent');

    // add a matcher that strips out html formatting on paste: https://github.com/quilljs/quill/issues/1184#issuecomment-384935594
    this.quillEditor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
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
    this.quillMentionContainer = this.quillEditor.getModule('mention').mentionContainer;

    // check if content exceeds editor height
    if (this.mode !== StatementModeEnum.Print) {
      this.isValid = !this.isContentHeightGreaterThanContainerHeight();
    }

    // Add text change function to editor
    this.quillEditor.on('text-change', (delta, oldContents, source) => {
      // Get the F outta here if in print mode
      if (this.mode === StatementModeEnum.Print) { return; }

      this.isValid = !this.isContentHeightGreaterThanContainerHeight();

      if (source === 'user' && this.isValid) {
        this.htmlContent = this.quillEditor?.root.innerHTML;
        this.onContentChangedSubject.next({ ControlId: this.controlData.Id, value: this.htmlContent });
      }
    });

    // Add selection change function to editor
    this.quillEditor.on('selection-change', (range, oldRange, source) => {
      // Get the F outta here if in print mode
      if (this.mode === StatementModeEnum.Print) { return; }

      if (oldRange === null) {
        this.onRTEFocusChange.emit(this.controlData.Id);
      }
    });
  }

  isContentHeightGreaterThanContainerHeight(): boolean {

    if (!this.quillEditor) { return false; } // dom isn't ready yet.

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

  onClickEditor() {
    // most of the time this is redundant and called after onSelectionChanged, but useful for svg clicks which don't null out `oldRange`
    if (!this.isFocused) {
      this.onRTEFocusChange.emit(this.controlData.Id);
    }
  }

  onMentionDialogOpen() {
    // prevent bug where choosing a field, closing, then reopening with [ maintains the scroll position, since we always want to start at top
    this.quillMentionContainer.scrollTop = 0;
  }

  bindEmployeeDataHtml(): SafeHtml {
    if (!this.htmlContent) {
      return '';
    }
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

  formatCssDefaultTitle(): string {
    return 'rte-' + this.controlData.Id; // Title?.Default?.toLowerCase().split(/[\s:,]/).join('');
  }

  createStyleSheet() {
    // Create the <style> tag
    const style = document.createElement('style');

    // WebKit hack :(
    style.appendChild(document.createTextNode(''));

    // Add the <style> element to the page
    document.head.appendChild(style);

    const sheet = style.sheet as CSSStyleSheet;

    // Set quill editor height
    sheet.insertRule('.trs-rich-text-control.' + this.formatCssDefaultTitle() + ' .ql-editor { height: ' + this.height + ' }', 0);
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
