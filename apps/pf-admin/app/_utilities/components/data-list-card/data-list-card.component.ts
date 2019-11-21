import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DataListItem } from '../../models';

@Component({
  selector: 'pf-data-list-card',
  templateUrl: './data-list-card.component.html',
  styleUrls: ['./data-list-card.component.scss']
})
export class DataListCardComponent {
  @Input() items: DataListItem[];
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() filter: string;
  @Input() dataName: string;
  @Input() filterPlaceholder: string;

  @Output() itemClicked = new EventEmitter();
  @Output() filterChanged = new EventEmitter();

  handleCompanyClicked(dataListItem: DataListItem) {
    this.itemClicked.emit(dataListItem);
  }

  handleSearchTermChanged(value: string) {
    this.filter = value;
    this.filterChanged.emit(value);
  }

  trackByFn(dataListItem: DataListItem, index: number) {
    return dataListItem.Id;
  }
}
