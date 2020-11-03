import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import orderBy from 'lodash/orderBy';
import cloneDeep from 'lodash/cloneDeep';
import { groupBy } from '@progress/kendo-data-query';

import { CompensationField, CompensationFieldGroup } from '../../models';

@Component({
  selector: 'pf-trs-compensation-fields-chooser',
  templateUrl: './trs-compensation-fields-chooser.component.html',
  styleUrls: ['./trs-compensation-fields-chooser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsCompensationFieldsChooserComponent implements OnChanges {
  @Input() fields: CompensationField[];
  @Input() maxVisibleFieldsReached: boolean;
  @Output() fieldClicked: EventEmitter<CompensationField> = new EventEmitter();

  @ViewChild('addFieldPopover', { static: true }) public fieldPopover: any;

  searchTerm: string;
  groups: CompensationFieldGroup[] = [];
  selectableFields: CompensationField[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.fields?.currentValue?.length !== changes?.fields?.previousValue?.length) {
      this.initColumnGroupList();
    }
  }

  trackByFn(index: any, group: CompensationFieldGroup) {
    return group.DisplayName;
  }

  handleFieldClicked(field: CompensationField): void {
    const fieldToUpdate = this.selectableFields.find(f => f.Id === field.Id);
    fieldToUpdate.IsVisible = !fieldToUpdate.IsVisible;
    this.fieldClicked.emit(fieldToUpdate);
    this.fieldPopover.close();
  }

  handleFilterChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.groups = this.groups.map(group => {
      group.FilteredFields = group.Fields;
      if (this.searchTerm && this.searchTerm.length > 0) {
        group.FilteredFields = group.Fields.filter(f => f.DisplayName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1);
      }
      return group;
    });
  }

  onHidden() {
    this.searchTerm = '';
    this.handleFilterChange('');
  }

  private initColumnGroupList(): void {
    this.selectableFields = cloneDeep(this.fields);
    const groupedFields = this.createGroupedFields(this.selectableFields);
    this.groups = groupedFields.map((g, groupIndex) => {
      const orderedFields = orderBy(g.items, [(f: CompensationField) => f.DisplayName.toLowerCase()], 'asc');
      return {
        DisplayName: g.value,
        Fields: orderedFields,
        FilteredFields: orderedFields
      };
    });
  }

  private createGroupedFields(fields: CompensationField[]): any[] {
    let groupedFields: any[] = groupBy(fields, [{field: 'Group'}]);
    groupedFields = groupedFields.filter(g => g.value !== null && g.items.length !== 0);
    return groupedFields;
  }

}
