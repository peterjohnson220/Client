import { Component, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';

import * as cloneDeep from 'lodash.clonedeep';
import { orderBy } from 'lodash';
import { groupBy } from '@progress/kendo-data-query';

import { ViewField } from 'libs/models/payfactors-api/reports';
import { ColumnGroup } from '../../models';

@Component({
  selector: 'pf-column-group-list',
  templateUrl: './column-group-list.component.html',
  styleUrls: ['./column-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnGroupListComponent implements OnChanges {
  @Input() fields: ViewField[];
  @Input() searchTerm: string;

  columnGroups: ColumnGroup[] = [];
  allFields: ViewField[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.fields && changes.fields.currentValue) {
      this.initColumnGroupList();
    }
    if (changes && changes.searchTerm) {
      this.handleFilterChange();
    }
  }

  trackByFn(index: any, group: ColumnGroup) {
    return group.Title;
  }

  handleFieldClicked(field: ViewField): void {
    const fieldToUpdate = this.allFields.find(f => f.DataElementId === field.DataElementId);
    fieldToUpdate.IsSelected = !fieldToUpdate.IsSelected;
    fieldToUpdate.Order = null;
  }

  private initColumnGroupList(): void {
    this.allFields = cloneDeep(this.fields);
    const groupedFields = this.createGroupedFields(this.allFields);
    this.columnGroups = groupedFields.map((g, groupIndex) => {
      const orderedFields = orderBy(g.items[0].items, ['SelectionOrder', (f: ViewField) => f.DisplayName.toLowerCase()], 'asc');
      return {
        GroupIndex: groupIndex,
        Title: g.value,
        Fields: orderedFields,
        FilteredFields: orderedFields
      };
    });
  }

  private createGroupedFields(fields: ViewField[]): any[] {
    let groupedFields: any[] = groupBy(fields, [{field: 'Group'}, {field: 'GroupOrder'}]);
    groupedFields = groupedFields.filter(g => g.value !== null && g.items.length !== 0 && g.items[0].items.length !== 0);
    groupedFields = orderBy(groupedFields, [(g: any) => g.items[0].value, (g: any) => g.value.toLowerCase()], 'asc');
    return groupedFields;
  }

  private handleFilterChange(): void {
    this.columnGroups = this.columnGroups.map(group => {
      group.FilteredFields = group.Fields;
      if (this.searchTerm && this.searchTerm.length > 0) {
        group.FilteredFields = group.Fields.filter(f => f.DisplayName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1);
      }
      return group;
    });
  }
}
