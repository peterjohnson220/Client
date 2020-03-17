import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { AnyFn } from '@ngrx/store/src/selector';
import 'quill-mention';
import Quill from 'quill';

import { RichTextControl } from '../../models';

const supportedFonts = ['Arial', 'Georgia', 'TimesNewRoman', 'Verdana'];

const font = Quill.import('formats/font');
font.whitelist = supportedFonts;
Quill.register(font, true);

@Component({
  selector: 'pf-trs-rich-text-control',
  templateUrl: './trs-rich-text-control.component.html',
  styleUrls: ['./trs-rich-text-control.component.scss']
})
export class TrsRichTextControlComponent implements OnInit {
  @ViewChild('richText', { static: true }) richText: any;

  @Input() controlData: RichTextControl;

  isFocused = false;
  isInvalid = false;
  htmlContent: string;
  title: string;

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
    this.title = this.controlData.Title;
  }

  onTitleChange(title: string) {
    this.title = title;
    // change has occurred, so tell parent to save
  }

  onContentChanged(quillContentChange: any) {
    // get dom node references to the container around the quill content and the content nodes (p tags)
    const container = this.richTextNode.querySelector('.ql-editor') as HTMLElement;
    const contentNodes = this.richTextNode.querySelectorAll('.ql-editor p') as NodeListOf<HTMLElement>;

    // calculate how many pixels tall the content is
    let totalContentHeightInPixels = 0;
    contentNodes.forEach((node: HTMLElement) => totalContentHeightInPixels += node.offsetHeight);

    // if we're over the pixel height of the container undo the change by applying the previous delta
    if (totalContentHeightInPixels > container.offsetHeight) {
      quillContentChange.editor.setContents(quillContentChange.oldDelta.ops);
      this.isInvalid = true;
      setTimeout(() => this.isInvalid = false, 1000);
    } else {
      // change has occurred, so tell parent to save
    }
  }

  onSelectionChanged(quillSelectionChange: any) {
    if (quillSelectionChange.oldRange === null) {
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

}
