import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Observable, of } from 'rxjs';
import { CheckableSettings, CheckedState } from '@progress/kendo-angular-treeview';
import { Align } from '@progress/kendo-angular-popup';
import * as cloneDeep from 'lodash.clonedeep';

import { TreeViewItem } from '../../models';

@Component({
  selector: 'pf-multi-select-treeview',
  templateUrl: './multi-select-treeview.component.html',
  styleUrls: ['./multi-select-treeview.component.scss']
})
export class MultiSelectTreeViewComponent {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() data: TreeViewItem[];
  @Input() checkableSettings: CheckableSettings = {
    enabled: true,
    mode: 'multiple',
    checkChildren: true,
    checkParents: true,
    checkOnClick: true
  };
  @Input() anchorWidth = 250;
  @Input() checkByKey = 'Value';
  @Input() textField = 'Name';
  @Output() applyClicked: EventEmitter<string[]> = new EventEmitter();

  checkedKeys: string[] = [];
  appliedKeys: string[] = [];
  appliedNames: string[] = [];
  show = false;
  anchorAlign: Align = { horizontal: 'left', vertical: 'bottom' };
  popupAlign: Align = { horizontal: 'left', vertical: 'top' };

  handleCloseClicked(): void {
    this.show = false;
    this.resetSelections();
  }

  handleApplyClicked(): void {
    this.appliedKeys = cloneDeep(this.checkedKeys);
    this.show = false;
    this.appliedNames = this.getDisplayVauesForSelectedKeys();
    this.applyClicked.emit(this.appliedKeys);
  }

  toggleDropdown(): void {
    this.show = !this.show;
    if (!this.show) {
      this.resetSelections();
    }
  }

  // https://www.telerik.com/kendo-angular-ui/components/treeview/checkboxes/#toc-multiple-check-by-item-field
  // Custom logic handling Indeterminate state when custom data item property is persisted
  public isChecked = (dataItem: TreeViewItem, index: string): CheckedState => {
    if (this.containsItem(dataItem)) { return 'checked'; }

    if (this.isIndeterminate(dataItem)) { return 'indeterminate'; }

    return 'none';
  }

  private containsItem(item: TreeViewItem): boolean {
      return this.checkedKeys.indexOf(item[this.checkByKey]) > -1;
  }

  private isIndeterminate(item: TreeViewItem): boolean {
    if (!item.Children || item.Children.length === 0) {
      return false;
    }
    let idx = 0;
    let childItem: TreeViewItem;

    while (childItem = item.Children[idx]) {
      if (childItem && (this.containsItem(childItem) || this.isIndeterminate(childItem))) {
        return true;
      }

      idx += 1;
    }

    return false;
  }

  // Kendo treeview
  public children = (dataItem: TreeViewItem): Observable<TreeViewItem[]> => of(dataItem.Children);
  public hasChildren = (dataItem: TreeViewItem): boolean => !!dataItem.Children && dataItem.Children.length > 0;

  private getDisplayVauesForSelectedKeys(): string[] {
    if (this.checkByKey === this.textField) {
      return this.appliedKeys;
    }
    const selectedNames = [];
    this.data.forEach(item => {
      this.pluckRecursiveValues(item, selectedNames, this.textField, this.appliedKeys.indexOf(item[this.checkByKey]) > -1 );
    });
    return selectedNames;
  }

  private pluckRecursiveValues(dataItem: TreeViewItem, valuesList: string[], property: string, condition: boolean = true) {
    if (condition) {
      valuesList.push(dataItem[property]);
    }
    if (dataItem.Children && dataItem.Children.length) {
      dataItem.Children.forEach(childItem => {
        this.pluckRecursiveValues(childItem, valuesList, property, this.appliedKeys.indexOf(childItem[this.checkByKey]) > -1 );
      });
    }
  }

  private resetSelections() {
    this.checkedKeys = cloneDeep(this.appliedKeys);
  }

}
