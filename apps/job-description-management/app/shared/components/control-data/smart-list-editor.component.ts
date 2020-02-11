import { Component, Input, Output, EventEmitter, OnInit, OnChanges, HostListener, ElementRef } from '@angular/core';

import { Observable } from 'rxjs';

import { ControlTypeAttribute } from 'libs/models/common';

import { BulletType, SmartListHierarchy } from '../../models';

const cheerio = require('cheerio');
declare var Quill: any;

@Component({
  selector: 'pf-smart-list-editor',
  templateUrl: 'smart-list-editor.component.html',
  styleUrls: [ './smart-list-editor.component.scss' ]
})

export class SmartListEditorComponent implements OnInit, OnChanges {
  @Input() data: any[];
  @Input() attributes: ControlTypeAttribute[];
  @Input() readOnly: boolean;
  @Input() checkInheritedData: boolean;
  @Input() additionalProperties: any;
  @Input() undoChanges$: Observable<boolean>;

  @Output() dataChangesDetected = new EventEmitter();
  @Output() smartEditorChangesDetected = new EventEmitter();
  @Output() additionalPropertiesChangesDetected = new EventEmitter();

  private rteData = '';
  private showDataTable = false;
  private firstChange = true;
  private newDataFromLibraryIdentifierString = '========>FROM LIBRARY';

  constructor(
    private elRef: ElementRef
  ) {
  }

  handleDataChangesDetected(dataRowChangeObj: any) {
    this.dataChangesDetected.emit(dataRowChangeObj);
  }

  ngOnInit() {

    this.rebuildQuillHtmlFromSavedData();

    if (this.attributes.length > 1) {
      this.showDataTable = true;
    }

    if (this.undoChanges$) {
      this.undoChanges$.subscribe(val => {
        if (val) {
          this.rebuildQuillHtmlFromSavedData();
        }
      });
    }
  }

  ngOnChanges(changes: any) {
    if (changes.data && changes.data.currentValue.length === 0 && changes.data.previousValue && changes.data.previousValue.length > 0) {
      this.rteData = null;
    }

    if (changes.data && changes.data.currentValue.length) {
      const currentData = changes.data.currentValue;
      const sourcedAttributeName = this.attributes.find(a => a.CanBeSourced).Name;
      for (let i = 0; i < currentData.length; i++) {
        const currentSourcedValue = currentData[ i ][ sourcedAttributeName ];

        if (currentSourcedValue && currentSourcedValue.indexOf(this.newDataFromLibraryIdentifierString) > -1) {
          currentData[ i ][ sourcedAttributeName ] = currentSourcedValue.replace(this.newDataFromLibraryIdentifierString, '');
          this.rebuildQuillHtmlFromSavedData();
          if (this.firstChange) {
            this.focusRTE();
          }
        }
      }
    }

    this.firstChange = false;
  }

  focusRTE() {
    const quillContainer = this.elRef.nativeElement.querySelector('.ui-editor-content');
    const quillApi = Quill.find(quillContainer);

    quillApi.disable();
    const currentSelection = quillApi.getSelection();

    setTimeout(() => {

      if (currentSelection) {
        quillApi.setSelection(currentSelection.index, 0);
      } else if (this.rteData) {
        quillApi.setSelection(this.rteData.length, 0);
      }

      quillApi.enable();
    }, 0);
  }

  rebuildQuillHtmlFromSavedData() {
    if ((this.checkInheritedData && this.getJobDescriptionDataCount() > 0) || (!this.checkInheritedData && this.data.length > 0)) {
      /* First pull the data we are going to be using out of the array so we can load it in cheerio.
      For example:
          AdditionalProperties.ListType: "OL"
          Data[0]: Parent List Item 1<ul><li>Child Item</li></ul>
          Data[1]: Parent List Item 2<ol><li>Child Item</li></ol>
      Will be converted into:
          <ol><li>Parent List Item 1<ul><li>Child Item</li></ul></li><li>Parent List Item 2<ol><li>Child Item</li></ol></li></ol>
      */
      const listType = this.getListType();
      let realHtmlStructure = `<${listType}>`;
      const sourcedAttributeName = this.attributes.find(a => a.CanBeSourced).Name;
      this.data.forEach(dataItem => {
        if ((this.checkInheritedData && !dataItem.TemplateId) || !this.checkInheritedData) {
          realHtmlStructure += `<li>${dataItem[ sourcedAttributeName ]}</li>`;
        }
      });
      realHtmlStructure += `</${listType}>`;

      // Now that we have the real html structure that we need to work with, load the html structure into cherrio in a source div.
      // Also create a target div which we will manipulate create the Quill structure.
      const $ = cheerio.load('<div id=\'source\'>' + realHtmlStructure + '</div><div id=\'target\'></div>');

      const target = $('#target');
      $('#source li').each(function () {
        // For the current item, clone it so we can remove the children without impacting the source structure and just get the html for this list item.
        const currentNode = $(this).clone();
        currentNode.children('ol, ul').remove();

        // Figure out how many lists this list item is contained in to determine how much to indent
        const level = $(this).parents('ol, ul').length;

        // Create the list item
        let newListItem = level > 1 ? `<li class="ql-indent-${level - 1}">` : '<li>';
        newListItem += `${currentNode.html().trim()}</li>`;

        // Figure out what type of list this is
        const parentListType = $(this).parent().prop('tagName');

        // If the last list item is in a list of the same type, append to it, otherwise we are creating a new list
        const lastListItem = target.find('li').last();
        if (lastListItem.length > 0 && lastListItem.parent().prop('tagName') === parentListType) {
          lastListItem.parent().append(`${newListItem}`);
        } else {
          target.append(`<${parentListType}>${newListItem}</${parentListType}>`);
        }
      });
      this.rteData = target.html();
    } else {
      this.rteData = '';
    }
  }

  buildHierarchyFromPasteData(data: string): SmartListHierarchy {
    const thisLevel = new SmartListHierarchy();
    thisLevel.Items = [];

    // If the data starts with character(s) followed by a tab we can assume it is a list.
    const startsWithBulletRegex = new RegExp(/^(.+)\t/);
    const startingBulletMatch = startsWithBulletRegex.exec(data);
    if (startingBulletMatch != null) {
      // Trim the match incase it contained whitespace from word formatting
      const trimmedMatch = startingBulletMatch[ 1 ].trim();
      // Get the top level bullet that we will split this data on
      const numericRegex = new RegExp(/^[0-9]+/);
      const letterRegex = new RegExp(/^[a-zA-Z]+/);
      if (numericRegex.test(trimmedMatch)) {
        thisLevel.BulletType = BulletType.OrderedNumeric;
      } else if (letterRegex.test(trimmedMatch)) {
        thisLevel.BulletType = BulletType.OrderedAlpha;
      } else {
        thisLevel.BulletType = BulletType.Unordered;
        thisLevel.BulletValue = data.substr(0, 1);
      }

      // Based on the bullet type, create a regex that will split the data at the top level items
      let bulletSplitRegex;
      switch (thisLevel.BulletType) {
        case BulletType.OrderedNumeric:
          bulletSplitRegex = new RegExp(/[0-9]+.?\t/);
          break;
        case BulletType.OrderedAlpha:
          bulletSplitRegex = new RegExp(/[a-zA-Z]+.?\t/);
          break;
        default:
          bulletSplitRegex = new RegExp(thisLevel.BulletValue + '.?\t');
          break;
      }

      const containsListRegex = new RegExp(/[\r\n?|\n](.+\t)/);

      // For each top level item
      const splitData = data.split(bulletSplitRegex);
      for (const split of splitData) {
        // Don't do anything with a blank item (extra new lines copied in or text/tabs/space next to first bullet)
        if (split.trim() === '') {
          continue;
        }
        // See if the item contains a list
        const listMatch = containsListRegex.exec(split);
        if (listMatch != null) {
          // If it does contain a list, set the data to the data found before the list, and call this function for the child lists;
          thisLevel.Items.push({
            Data: split.substring(0, listMatch.index),
            Children: this.buildHierarchyFromPasteData(split.substring(split.indexOf(listMatch[ 1 ])))
          });
        } else {
          thisLevel.Items.push({ Data: split, Children: null });
        }
      }
    } else {
      const newLineSplitData = data.split(/\r\n?|\n/);
      for (const newLineData of newLineSplitData) {
        thisLevel.Items.push({ Data: newLineData, Children: null });
      }
    }
    return thisLevel;
  }

  buildQuillHtmlListFromHierarchy(smartListHierarchy: SmartListHierarchy, level: number) {
    // If it is the first level, create the list container, otherwise just add list items with the proper ql-indent-# class.
    let listString = '';
    if (level === 0) {
      listString += smartListHierarchy.BulletType === BulletType.OrderedNumeric ? '<ol>' : '<ul>';
    }
    smartListHierarchy.Items.forEach((item) => {
      listString += level === 0 ? '<li>' : `<li class="ql-indent-${level}">`;
      listString += `${item.Data}</li>`;
      if (item.Children) {
        listString += this.buildQuillHtmlListFromHierarchy(item.Children, level + 1);
      }
    });
    if (level === 0) {
      listString += smartListHierarchy.BulletType === BulletType.OrderedNumeric ? '</ol>' : '</ul>';
    }
    return listString;
  }

  @HostListener('paste', [ '$event' ])
  handlePaste(event) {
    // Prevent default pasting behavior.
    event.preventDefault();
    let clipboardData = '';

    if ((<any>window).clipboardData && (<any>window).clipboardData.getData) { // IE
      clipboardData = (<any>window).clipboardData.getData('Text');
    } else {
      clipboardData = event.clipboardData.getData('text/plain');
    }

    const smartListHierarchy = this.buildHierarchyFromPasteData(clipboardData);
    const newListString = this.buildQuillHtmlListFromHierarchy(smartListHierarchy, 0);

    let currentData = this.rteData || '';
    this.rteData = currentData += newListString;

    this.focusRTE();
  }

  toggleDataTable() {
    this.showDataTable = !this.showDataTable;
  }

  getJobDescriptionDataCount() {
    return this.data.filter(d => !d.TemplateId).length;
  }

  getTemplateDataCount() {
    return this.data.filter(d => d.TemplateId).length;
  }

  /* Uses rteData which has the data in the smart list including html tags. Removes
     the data inside unordered and ordered lists, and the remaining html tags. Returns
     false if there is nothing else, and true if there is something remaining.
  */
  hasUnstructuredData() {
    var temp = this.rteData;

    if (temp === null || temp.trim() === '') {
      return false;
    }

    // remove unordered and ordered list elements
    temp = this.removeAllElements("<ul>", "</ul>", temp);
    temp = this.removeAllElements("<ol>", "</ol>", temp);

    // get rid of remaining html tags
    temp = temp.replace(/<[^>]*>/g, '');
    return !(temp === null || temp.trim() === '');
  }

  // Removes all occurrences of a html element, including the opening and closing tags.
  removeAllElements(opening: string, closing: string, text: string) {
    var start = text.indexOf(opening);
    var end = text.indexOf(closing);
    while (start != -1) {
      text = text.substring(0, start) + text.substring(end + closing.length, text.length);
      start = text.indexOf(opening);
      end = text.indexOf(closing);
    }
    return text;
  }

  rteTextButNoData() {
    return this.rteData && ((this.checkInheritedData && this.getJobDescriptionDataCount() === 0) || (!this.checkInheritedData && this.data.length === 0));
  }

  parseQuillHtmlIntoRealHtml(html) {
    let currentListLevel = -1;

    // Load in html data to cheerio, create containers for the quill content and a container to store the parsed content.
    const $ = cheerio.load('<div id=\'quillContent\'>' + html + '</div><div id=\'parsedContent\'></div>');
    const parsedContent = $('#parsedContent');

    // For each top level list item in the quill content
    const quillItems = $('#quillContent li');
    for (const quillItem of quillItems) {
      const listItem = $(quillItem);

      // Use a regex to get the indent level from quill.
      // This could probably be a sub string, just wasn't sure what other strange thing quill might do with classes.
      const listItemClass = listItem.attr('class');
      const indentRegex = new RegExp(/ql-indent-(.+)/);
      const indentMatch = indentRegex.exec(listItemClass);
      const listItemIndentLevel = indentMatch != null ? +indentMatch[ 1 ] : 0;

      // If we are increasing the level, we need to create a new list.
      if (listItemIndentLevel > currentListLevel) {
        const listType = listItem.parent().prop('tagName');
        const elementToCreate = `<${listType}><li>${listItem.html()}</li></${listType}>`;
        // If we are at the top level, append it to the body of the parsed content. Otherwise append it to the last list item.
        if (currentListLevel === -1) {
          parsedContent.append(elementToCreate);
        } else {
          parsedContent.find('li').last().append(elementToCreate);
        }
      } else if (listItemIndentLevel === currentListLevel) {
        parsedContent.find('li').last().parent().append(`<li>${listItem.html()}</li>`);
      } else {
        let childLevel = parsedContent;
        for (let l = 0; l <= listItemIndentLevel; l++) {
          // .children().children() is the list, and then the list items.
          childLevel = childLevel.children().children();
        }
        childLevel.filter('li').last().parent().append(`<li>${listItem.html()}</li>`);
      }

      currentListLevel = listItemIndentLevel;
    }

    // Based on the way this is stored in mongo, we need to store this in a slightly different format from what we generated in the dom:
    // dataVals[0]: Parent List Item 1<ul><li>Child Item</li></ul>
    // dataVals[1]: Parent List Item 2<ol><li>Child Item</li></ol>
    const dataVals = [];
    for (const listItem of parsedContent.children().children()) {
      const listItemHtml = $(listItem).html();
      if (listItemHtml.length > 0 && listItemHtml !== '<br>') {
        dataVals.push(listItemHtml);
      }
    }

    // If we parsed any content, find the first top level list tag and store that in the additional properties.
    if (parsedContent.children().length > 0 && dataVals.length > 0) {
      const listType = parsedContent.children().first().prop('tagName');
      this.setListType(listType);
    }

    this.smartEditorChangesDetected.emit({ dataVals: dataVals, currentData: this.data });
  }

  getListType(): string {
    this.additionalProperties = this.additionalProperties || {};
    return this.additionalProperties.ListType || 'UL';
  }

  setListType(listType: string) {
    this.additionalProperties = this.additionalProperties || {};
    if (this.additionalProperties.ListType !== listType) {
      this.additionalProperties.ListType = listType;
      this.additionalPropertiesChangesDetected.emit({ ListType: listType });
    }
  }
}
