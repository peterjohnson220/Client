import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { DataType, RoleDataRestriction, DataField } from 'libs/models/security/roles';
import { UserContext } from 'libs/models';
import { TypeaheadComponent } from 'libs/forms/components/typeahead';

import { DataFieldTypes } from '../../constants/data-field-type.constants';
import { RoleApiNames } from '../../constants/user-role.constants';

@Component({
  selector: 'pf-data-field-filter',
  templateUrl: './data-field-filter.component.html',
  styleUrls: ['./data-field-filter.component.scss']
})
export class DataFieldFilterComponent implements OnInit {
  @ViewChild('typeaheadComponent') typeaheadComponent: TypeaheadComponent;
  @Input() dataType: DataType;
  @Input() roleDataRestriction: RoleDataRestriction;
  @Output() roleDataRestrictionChange = new EventEmitter();
  @Output() roleDataRestrictionChanged = new EventEmitter();
  userContext$: Observable<UserContext>;
  _DataFieldTypes = DataFieldTypes;
  Operators = [{ value: true, text: 'Is equal to' }, { value: false, text: 'Is not equal to' }];
  selectedField: DataField;
  dataValue: string;
  constructor() { }

  get isMultiSelect(): boolean {
    const selectedFieldType = !!this.selectedField ? this.selectedField.FieldType : null;
    return selectedFieldType === this._DataFieldTypes.MULTISELECT ||
      selectedFieldType === this._DataFieldTypes.CONDITIONAL_MULTISELECT;
  }

  dataFieldChanged(value) {
    this.selectedField = this.dataType.DataFields.find(f => f.Id === value);
    this.roleDataRestrictionChanged.emit({ property: 'DataFieldId', value: this.selectedField.Id });
    if (this.typeaheadComponent) {
      this.typeaheadComponent.refreshRemoteData(this.buildApiEndpoint(), 'Value', this.isJobsUdfOrJobFamily());
      this.typeaheadComponent.clearValue();
    }
  }

  ngOnInit() {
    if (this.dataType && this.dataType.DataFields && this.roleDataRestriction) {
      this.selectedField = this.dataType.DataFields.find(f => f.Id === this.roleDataRestriction.DataFieldId);
      this.dataValue = this.isJobsUdfOrJobFamily() && this.roleDataRestriction.DataValue === ''
        ? '(Blank)'
        : this.roleDataRestriction.DataValue;
    }
  }

  toTitleCase(input: string) {
    return input.toLowerCase().split('_').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
  }

  buildApiEndpoint() {
    let endpoint = `${RoleApiNames.GetDataFieldValues}${this.dataType.Name.replace(/\s+/g, '')}`;
    if (!this.isMultiSelect) {
      endpoint += `&dataField=${this.toTitleCase(this.selectedField.Name)}`;
    }
    return endpoint;
  }

  isJobsUdfOrJobFamily(): boolean {
    return (this.selectedField.Name.includes('UDF_CHAR') && this.dataType.Name === 'Jobs') || this.selectedField.Name === 'Job_Family';
  }
}
