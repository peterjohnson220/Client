import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { RemoteDataSourceService } from '../../../../core/services';
import { autoGenerateListGroupValues, GroupedListItem } from '../../../../models/list';
import { RoleDataRestriction, RoleDataRestrictionValue } from '../../../../models/security/roles';

@Component({
  selector: 'pf-treeview-multi-select',
  templateUrl: './treeview-multi-select.component.html',
  styleUrls: ['./treeview-multi-select.component.scss']
})
export class TreeViewMultiSelectComponent implements OnInit, OnDestroy {
  @Input() apiEndpoint: string;
  @Input() roleDataRestriction: RoleDataRestriction;
  @Input() dataTypeName: string;

  @Output() handleApplyClicked = new EventEmitter();

  remoteDataSourceSubscription: Subscription;

  surveyData: GroupedListItem[];
  checkedKeys: string[] = [];

  constructor(private remoteDataSourceService: RemoteDataSourceService) {}

  ngOnInit() {
    if (this.apiEndpoint) {
      this.getFromRemoteSource();
    }
  }

  ngOnDestroy() {
    this.remoteDataSourceSubscription.unsubscribe();
  }

  getFromRemoteSource() {
    this.remoteDataSourceSubscription = this.remoteDataSourceService.getDataSource(`${this.apiEndpoint}`).subscribe(s => {
      this.surveyData = this.buildGroupedListItemFromRoleDataRestrictionValues(s);
      this.checkedKeys = this.roleDataRestriction?.DataValue[0] === undefined ? [] : this.roleDataRestriction?.DataValue;
    });
  }

  buildGroupedListItemFromRoleDataRestrictionValues(data: RoleDataRestrictionValue[]): GroupedListItem[] {
    const groupedList: GroupedListItem[] = [];
    let totalChildren = 0;
    data.forEach(x => {
      const dataValues = x.Id.split('_');
      const id = dataValues[0];
      const value = dataValues[1];
      const match = groupedList.find(a => a.Name === value);
      if (match) {
        match.Children.push({
          Name: x.Value,
          Value: id
        });
        totalChildren++;
        match.TotalChildren = totalChildren;
      } else {
        totalChildren = 1;
        const newGroupListItem: GroupedListItem = {
          Name: value,
          Value: null,
          Children: [{Name: x.Value, Value: id}],
          TotalChildren: totalChildren
        };
        groupedList.push(newGroupListItem);
      }
    });
    return autoGenerateListGroupValues(groupedList);
  }

  applyClicked(data) {
    const values = data.map(x => x.Value);
    this.handleApplyClicked.emit(values);
  }
}
