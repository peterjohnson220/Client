import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Output,
  ViewChild,
  SimpleChanges
} from '@angular/core';

import { AnyFn } from '@ngrx/store/src/selector';
import { Subject, Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import 'quill-mention';
import QuillType from 'quill';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';
import { AppConstants } from 'libs/constants';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

import { RichTextControl, StatementModeEnum } from '../../models';
import { UpdateStringPropertyRequest, UpdateTitleRequest, UpdateUdfsInRteContentRequest } from '../../models/request-models';

const Quill = require('quill');
const cheerio = require('cheerio');

const supportedFonts = ['Arial', 'Georgia', 'TimesNewRoman', 'Verdana'];

const employeesUdf = 'EmployeesUdf_';
const jobsUdf = 'JobsUdf_';
const udfDefaultValue = '[Custom Value]';

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
  @Input() isPageScrolling;

  @Output() onTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onContentChange: EventEmitter<UpdateStringPropertyRequest> = new EventEmitter();
  @Output() onUdfsInContentChange: EventEmitter<UpdateUdfsInRteContentRequest> = new EventEmitter();
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

  showFontFamilyMenu = AppConstants.EnableTrsCustomFontFamilies;

  infoTooltip = 'This is a rich text area. Use [ to find and insert existing employee or company fields and custom fields into your text.';

  mentionConfig = {
    allowedChars: /^[A-Za-z\sÅÄÖåäö1234567890]*$/,
    mentionDenotationChars: ['['],
    showDenotationChar: false,
    positioningStrategy: 'fixed',
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

  availableHeight: number;

  totalRewardsRadialTextCountersFeatureFlag: RealTimeFlag = { key: FeatureFlags.TotalRewardsRadialTextCounters, value: false };
  unsubscribe$ = new Subject<void>();

  get quillEditorId(): string {
    return 'quill-editor-' + this.controlData.Id;
  }

  get richTextNode(): HTMLElement {
    return this.quillEditor?.container;
  }

  // quill mention requires options with a lower case `value`
  get dataFields(): { id: string, value: string }[] {
    if (this.mode === StatementModeEnum.Edit) {
      return this.controlData.AvailableDataFields.map(df => ({ id: df.Key, value: df.Value }));
    }
    return [];
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

  constructor(private sanitizer: DomSanitizer, private featureFlagService: AbstractFeatureFlagService) {
    this.featureFlagService.bindEnabled(this.totalRewardsRadialTextCountersFeatureFlag, this.unsubscribe$);
  }

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

  ngOnChanges({ mode, isPageScrolling }: SimpleChanges) {
    // Get the F outta here if in print mode
    if (this.mode === StatementModeEnum.Print) { return; }

    const changedFromPreviewToEdit = mode?.currentValue === StatementModeEnum.Edit && mode?.previousValue === StatementModeEnum.Preview;
    const changedFromEditToPreview = mode?.currentValue === StatementModeEnum.Preview && mode?.previousValue === StatementModeEnum.Edit;
    const pageScrolling = isPageScrolling?.currentValue && !isPageScrolling?.previousValue;

    if (changedFromPreviewToEdit) {
      // the dom node quill attaches to isn't there until the next turn, so wait until then to re-init
      setTimeout(() => { this.createQuillEditor(); }, 0);
    } else if (changedFromEditToPreview || pageScrolling) {
      // we get this for free in most cases, but some edge cases like scrolling require manual closing
      this.closeQuillMention();
    }

    this.isValid = !this.isContentHeightGreaterThanContainerHeight();
  }

  ngOnDestroy() {
    this.onContentChangedSubscription?.unsubscribe();
    this.closeQuillMention();
    this.unsubscribe$.next();
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

    return this.contentHeight > container.offsetHeight;
  }

  get displayRadialTextCounter(): boolean {
     return this.quillEditor?.hasFocus() && this.totalRewardsRadialTextCountersFeatureFlag.value;
  }

  get contentHeight(): number {
    const contentNodes = this.richTextNode.querySelectorAll('.ql-editor p, .ql-editor li') as NodeListOf<HTMLElement>;

    // Even with user entering nothing, there's still some empty content resulting in a height, so account for this.
    const isEmpty = this.quillEditor.getText() === '\n';

    if (isEmpty) { return 0; }

    // calculate how many pixels tall the content is with a for loop, as IE 11 does not support NodeListOf.forEach()
    let totalContentHeightInPixels = 0;

    for (let i = 0; i < contentNodes.length; i ++) {
      totalContentHeightInPixels += contentNodes[i].offsetHeight;
    }

    return totalContentHeightInPixels;
  }

  get containerHeight(): number {
    const container = this.richTextNode.querySelector('.ql-editor') as HTMLElement;
    return container.offsetHeight;
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

  bindDataFields(): SafeHtml {
    if (!this.htmlContent) { return ''; }

    // optimize the data fields lookup so we're not traversing a 200+ element array each find
    const indexedDataFields = {};
    this.controlData.AvailableDataFields?.forEach(df => indexedDataFields[df.Key] = df.Value);

    // create a container div with the `ql-editor` class so we get styling
    const $ = cheerio.load('<div class=\'ql-editor\'>' + this.htmlContent + '</div>');

    // loop through all spans within the ql-editor which have an attribute of `data-value`, aka our inserted data fields
    for (const span of this.getDataFieldsFromMarkup()) {
      const dataFieldKey = span.attribs['data-id'];
      const dataFieldValue = indexedDataFields[dataFieldKey];
      $('[data-value="' + dataFieldValue + '"]', '.ql-editor').replaceWith(this.getFormattedDataFieldValue(dataFieldKey));
    }
    return this.sanitizer.bypassSecurityTrustHtml($.html());
  }

  getDataFieldsFromMarkup() {
    const $ = cheerio.load('<div class=\'ql-editor\'>' + this.htmlContent + '</div>');
    return $('.ql-editor span[data-value]').toArray();
  }

  getFormattedDataFieldValue(dataFieldKey: string): string {
    const isMockEmployeePreview = (this.mode === StatementModeEnum.Preview && !this.employeeRewardsData.CompanyEmployeeId);
    let dataFieldValue = '';

    // if our key represents an employees/jobs UDF access the appropriate sub-object with the back half of the key, else get from the standard employee fields
    if (dataFieldKey.indexOf(employeesUdf) === 0) {
      dataFieldValue = (isMockEmployeePreview) ? udfDefaultValue : this.employeeRewardsData.EmployeesUdf[dataFieldKey.substring(employeesUdf.length)];
    } else if (dataFieldKey.indexOf(jobsUdf) === 0) {
      dataFieldValue = (isMockEmployeePreview) ? udfDefaultValue : this.employeeRewardsData.JobsUdf[dataFieldKey.substring(jobsUdf.length)];
    } else {
      dataFieldValue = this.employeeRewardsData[dataFieldKey];
    }

    // format and escape any potential markup/script tags that may have been set as content
    const formattedValue = this.formatDataFieldValue(dataFieldValue);
    return formattedValue
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
    return 'rte-' + this.controlData.Id;
  }

  closeQuillMention() {
    // manually remove the mention container from the DOM, since it can be orphaned when left open on certain actions
    if (this.quillMentionContainer) {
      this.quillMentionContainer.style.display = 'none';
      this.quillMentionContainer.remove();
    }
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
        const udfDataFieldsInContent = this.getDataFieldsFromMarkup()
          .map(({ attribs }) => ({ Key: attribs['data-id'], Value: attribs['data-value'] }))
          .filter(udf => udf.Key.indexOf(employeesUdf) === 0 || udf.Key.indexOf(jobsUdf) === 0);

        this.onUdfsInContentChange.emit({ UdfDataFieldsInContent: udfDataFieldsInContent, ControlId: this.controlData.Id } );
        this.onContentChange.emit(update);
      }
    });
  }
}
