import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { AnyFn } from '@ngrx/store/src/selector';
import 'quill-mention';
import Quill from 'quill';

import { formatDefaultStyles } from 'libs/core/functions/format-default-styles';

import { Styling, RichTextControl } from '../../models';

const supportedFonts = ['Arial', 'Georgia', 'TimesNewRoman', 'Verdana'];

const font = Quill.import('formats/font');
font.whitelist = supportedFonts;
Quill.register(font, true);

const dataFields = [
  { id: 'EmployeeId', value: 'Employee Id' },
  { id: 'EmployeeFirstName', value: 'Employee First Name' },
  { id: 'EmployeeLastName', value: 'Employee Last Name' },
  { id: 'EmployeeCity', value: 'Employee City' },
  { id: 'EmployeeJobCode', value: 'Employee Job Code' },
  { id: 'EmployeeDepartment', value: 'Employee Department' },
  { id: 'EmployeeDepartmentCode', value: 'Employee Department Code' },
  { id: 'EmployeeDateOfBirth', value: 'Employee Date of Birth' },
  { id: 'EmployeeDateOfHire', value: 'Employee Date of Hire' },
  { id: 'EmployeeEmailAddress', value: 'Employee Email Address' },
  { id: 'EmployeeStatus', value: 'Employee Status' },
  { id: 'EmployeeFLSAStatus', value: 'Employee FLSA Status' },
  { id: 'EmployeeFullTimeEmployee', value: 'EmployeeFullTimeEmployee' },
  { id: 'EmployeeLocation', value: 'Employee Location' },
  { id: 'EmployeeManagerId', value: 'Employee Manager Id' },
  { id: 'EmployeeState', value: 'Employee State' },
];

@Component({
  selector: 'pf-trs-rich-text-control',
  templateUrl: './trs-rich-text-control.component.html',
  styleUrls: ['./trs-rich-text-control.component.scss']
})
export class TrsRichTextControlComponent implements OnInit {
  @ViewChild('richText', { static: true }) richText: any;

  @Input() controlData: RichTextControl;
  @Input() sectionTitlesStyles: Styling;
  @Input() dataStyles: Styling;

  isFocused = false;
  isInvalid = false;
  htmlContent: string;
  title: string;

  quillConfig = {
    toolbar: {
      container: [
        [{ 'font': supportedFonts }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
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
      source: (searchTerm: string, renderList: AnyFn) => {
        if (searchTerm) {
          const matches = dataFields.filter(df => df.value.toLowerCase().includes(searchTerm.toLowerCase()));
          renderList(matches, searchTerm);
        } else {
          renderList(dataFields, searchTerm);
        }
      },
    },
  };

  get richTextNode(): HTMLElement {
    return this.richText.elementRef.nativeElement;
  }

  ngOnInit() {
    this.htmlContent = this.controlData.Content;
    this.title = this.controlData.Title;
  }

  onTitleChange(title: string) {
    this.title = title;
    // change has occurred, so tell parent to save
  }

  onContentChanged(event: any) {
    // get dom node references to the container around the quill content, and the content nodes itself
    const container = this.richTextNode.querySelector('.ql-editor') as HTMLElement;
    const contentNodes = this.richTextNode.querySelectorAll('.ql-editor p') as NodeListOf<HTMLElement>;

    // calculate how many pixels tall the content is
    let totalContentHeightInPixels = 0;
    contentNodes.forEach((node: HTMLElement) => totalContentHeightInPixels += node.offsetHeight);

    // if we're over the pixel height of the container undo the change by applying the previous delta
    if (totalContentHeightInPixels > container.offsetHeight) {
      event.editor.setContents(event.oldDelta.ops);
      this.isInvalid = true;
      setTimeout(() => this.isInvalid = false, 1000);
    } else {
      // change has occurred, so tell parent to save
    }
  }

  onSelectionChanged(event: any) {
    if (event.oldRange === null) {
      this.isFocused = true;
    }
  }

  onClickElsewhere() {
    try {
      // get a handle to whatever text is highlighted in the page, then find it's parent
      const selectedText: Selection = window.getSelection();
      const highlightedTextNodesParent = selectedText.anchorNode.parentElement;

      // need to prevent a bug where click, drag/select text then releasing the mouse outside the editor hides the editor ribbon, so bail if that's the case
      if (!this.richTextNode.contains(highlightedTextNodesParent)) {
        this.isFocused = false;
      }
    } catch {
      // getSelection will have a null anchorNode if clicked in iFrame, and should default to last clicked if no selection, so just unset focus in iFrame case
      this.isFocused = false;
    }
  }

  setDefaultStyling(style: Styling) {
    return formatDefaultStyles(style);
  }

}
