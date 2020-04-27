import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { cloneDeep } from 'lodash';

import { MultiSelectItemGroup } from '../../models';

@Component({
  selector: 'pf-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent {
  @Input() listItems: MultiSelectItemGroup[];
  @Input() selectedValues: string[];
  @Input() placeholder: string;
  @Output() listItemsUpdated: EventEmitter<MultiSelectItemGroup[]> = new EventEmitter<MultiSelectItemGroup[]>();

  @ViewChild('dropdownList', { static: false }) dropdownList: DropDownListComponent;
  localListItems: MultiSelectItemGroup[];

  handleOpenDropdownEvent(event: any): void {
    this.localListItems = cloneDeep(this.listItems);
  }

  handleDropdownCloseEvent(event: any): void {
    event.preventDefault();
  }

  handleItemClicked(itemGroup: MultiSelectItemGroup): void {
    const updatedItemGroup = this.localListItems.find(g => g.GroupIndex === itemGroup.GroupIndex);
    updatedItemGroup.Items = itemGroup.Items;
  }

  handleApplyClicked(): void {
    this.listItemsUpdated.emit(this.localListItems);
    this.dropdownList.toggle(false);
  }

  handleCloseClicked(): void {
    this.dropdownList.toggle(false);
  }
}
