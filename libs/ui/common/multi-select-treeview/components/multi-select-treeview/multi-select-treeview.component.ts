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
  @Input() compressChildValues = false;
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
    const appliedValues = this.getAppliedItemsValues();
    this.appliedNames = appliedValues.map(x => x.text);
    this.applyClicked.emit(appliedValues.map(x => x.value));
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

  private getAppliedItemsValues(): {text: string, value: string}[] {
    const selectedNames = [];
    this.data.forEach(item => {
      this.pluckRecursiveValues(item, selectedNames, (contextItem: TreeViewItem): boolean => {
        return this.appliedKeys.indexOf(contextItem[this.checkByKey]) > -1;
      });
    });
    return selectedNames;
  }

  private pluckRecursiveValues(dataItem: TreeViewItem, valuesList: {text: string, value: string}[], selectionValidFn: (contextItem: TreeViewItem) => boolean) {
    if (selectionValidFn(dataItem)) {
      valuesList.push({text: dataItem[this.textField], value: dataItem[this.checkByKey]});
      if (this.compressChildValues) {
        // ignore child values when parent selected and compressing children
        return;
      }
    }
    if (dataItem.Children && dataItem.Children.length) {
      dataItem.Children.forEach(childItem => {
        this.pluckRecursiveValues(childItem, valuesList, selectionValidFn);
      });
    }
  }

  private resetSelections() {
    this.checkedKeys = cloneDeep(this.appliedKeys);
  }
}
