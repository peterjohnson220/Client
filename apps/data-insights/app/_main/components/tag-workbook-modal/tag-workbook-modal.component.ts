import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

import { Workbook, SaveWorkbookTagObj } from '../../models';

@Component({
  selector: 'pf-tag-workbook-modal',
  templateUrl: './tag-workbook-modal.component.html',
  styleUrls: ['./tag-workbook-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagWorkbookModalComponent {
  @ViewChild('tagWorkbookModal', { static: true }) public tagWorkbookModal: any;

  @Input() selectedWorkbook: Workbook;
  @Input() tags: string[];
  @Output() saveClicked = new EventEmitter();

  saveWorkbookTagObj: SaveWorkbookTagObj;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };

  constructor(
    private modalService: NgbModal
  ) { }

  get noFilteredTags() {
    return !!this.saveWorkbookTagObj && !this.tags.some(t => {
      return t.toLowerCase().startsWith(this.saveWorkbookTagObj.Tag.toLowerCase());
    });
  }

  open(): void {
    this.modalService.open(this.tagWorkbookModal, { backdrop: 'static', centered: true, windowClass: 'tag-modal' });
    this.saveWorkbookTagObj = null;
  }

  handleSaveClicked(): void {
    this.saveClicked.emit(this.saveWorkbookTagObj);
    this.modalService.dismissAll();
  }

  handleTagValueChanged(tag: string) {
    this.buildSaveWorkbookTagObj(tag);
  }

  handleTagFilterChanged(tag: string) {
    this.buildSaveWorkbookTagObj(tag);
  }

  private buildSaveWorkbookTagObj(tag: string): void {
    this.saveWorkbookTagObj = {
      WorkbookId: this.selectedWorkbook.WorkbookId,
      Tag: tag.trim()
    };
  }
}
