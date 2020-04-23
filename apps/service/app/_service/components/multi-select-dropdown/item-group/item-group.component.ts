import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';

import { cloneDeep } from 'lodash';

import { MultiSelectItemGroup, MultiSelectItem } from '../../../models';

@Component({
  selector: 'pf-item-group',
  templateUrl: './item-group.component.html',
  styleUrls: ['./item-group.component.scss']
})
export class ItemGroupComponent implements OnChanges, AfterViewInit {
  @Input() itemGroup: MultiSelectItemGroup;
  @Output() itemClicked: EventEmitter<MultiSelectItemGroup> = new EventEmitter<MultiSelectItemGroup>();

  showItems: boolean;
  localItemGroup: MultiSelectItemGroup;
  selectAllCheckbox: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.itemGroup && changes.itemGroup.currentValue) {
      this.localItemGroup = cloneDeep(this.itemGroup);
    }
  }

  ngAfterViewInit(): void {
    this.selectAllCheckbox = document.getElementById(`selectall-checkbox-${this.localItemGroup.GroupIndex}`);
    this.updateSelectAllState();
    this.showItems = this.localItemGroup.Items.some(item => item.IsSelected);
  }

  trackByFn(index: any, item: MultiSelectItem) {
    return item.Value;
  }

  handleItemClicked(item: MultiSelectItem): void {
    item.IsSelected = !item.IsSelected;
    this.itemClicked.emit(this.localItemGroup);
    if (this.localItemGroup.Items.length > 1) {
      this.updateSelectAllState();
    }
  }

  handleSelectAllClicked(): void {
    const selectedItems = this.localItemGroup.Items.filter(item => item.IsSelected);
    if (selectedItems.length === this.localItemGroup.Items.length) {
      this.selectAllCheckbox.checked = false;
      this.localItemGroup.Items.forEach(i => { i.IsSelected = false; });
    } else {
      this.selectAllCheckbox.checked = true;
      this.localItemGroup.Items.forEach(i => { i.IsSelected = true; });
    }
    this.selectAllCheckbox.indeterminate = false;
    this.itemClicked.emit(this.localItemGroup);
  }

  toggleShowItems(): void {
    this.showItems = !this.showItems;
  }

  private updateSelectAllState() {
    if (!this.selectAllCheckbox) {
      return;
    }
    const selectedItems = this.localItemGroup.Items.filter(item => item.IsSelected);
    if (selectedItems.length === 0) {
      this.selectAllCheckbox.checked = false;
      this.selectAllCheckbox.indeterminate = false;
    } else if (selectedItems.length > 0 && selectedItems.length < this.localItemGroup.Items.length) {
      this.selectAllCheckbox.checked = false;
      this.selectAllCheckbox.indeterminate = true;
    } else {
      this.selectAllCheckbox.checked = true;
      this.selectAllCheckbox.indeterminate = false;
    }
  }
}
