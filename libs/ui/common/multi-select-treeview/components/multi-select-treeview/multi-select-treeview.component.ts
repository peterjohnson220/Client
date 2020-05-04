import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Observable, of } from 'rxjs';
import { CheckableSettings } from '@progress/kendo-angular-treeview';
import { Align } from '@progress/kendo-angular-popup';
import * as cloneDeep from 'lodash.clonedeep';

import { GroupedListItem } from 'libs/models';

@Component({
  selector: 'pf-multi-select-treeview',
  templateUrl: './multi-select-treeview.component.html',
  styleUrls: ['./multi-select-treeview.component.scss']
})
export class MultiSelectTreeViewComponent {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() data: GroupedListItem[];
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

  // Kendo treeview
  public children = (dataItem: GroupedListItem): Observable<GroupedListItem[]> => of(dataItem.Children);
  public hasChildren = (dataItem: GroupedListItem): boolean => !!dataItem.Children && dataItem.Children.length > 0;

  private getAppliedItemsValues(): {text: string, value: string}[] {
    const selectedNames = [];
    this.data.forEach(item => {
      this.pluckRecursiveValues(item, selectedNames, (contextItem: GroupedListItem): boolean => {
        return this.appliedKeys.indexOf(contextItem[this.checkByKey]) > -1 && !contextItem.IgnoreValue;
      });
    });
    return selectedNames;
  }

  private pluckRecursiveValues(dataItem: GroupedListItem, valuesList: {text: string, value: string}[],
                               selectionValidFn: (contextItem: GroupedListItem) => boolean) {
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
