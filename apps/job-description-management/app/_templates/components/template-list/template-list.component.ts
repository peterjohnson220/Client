import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TemplateListItem } from '../../models';

@Component({
  selector: 'pf-template-list',
  templateUrl: './template-list.component.html',
   styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent {
  constructor() { }

  @Input() templateListItems: TemplateListItem[];
  @Input() loading: boolean;
  @Output() openDeleteModal = new EventEmitter();
  @Output() openCopyModal = new EventEmitter();

  handleDeleteClick(event: Event, templateListItem: TemplateListItem){
    event.stopPropagation();
    this.openDeleteModal.emit(templateListItem);
  }

  handleCopyClick(event: Event, templateListItem: TemplateListItem){
    event.stopPropagation();
    this.openCopyModal.emit(templateListItem);
  }
}
