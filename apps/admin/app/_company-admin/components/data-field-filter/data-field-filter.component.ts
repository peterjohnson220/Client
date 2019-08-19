import {Component, EventEmitter, Input, OnInit, OnDestroy, Output, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

import {DataType, RoleDataRestriction, DataField} from 'libs/models/security/roles';
import { UserContext } from 'libs/models';
import {TypeaheadComponent} from 'libs/forms/components/typeahead';

import {DataFieldTypes} from '../../constants/data-field-type.constants';
import {RoleApiNames} from '../../constants/user-role.constants';

@Component({
  selector: 'pf-data-field-filter',
  templateUrl: './data-field-filter.component.html',
  styleUrls: ['./data-field-filter.component.scss']
})
export class DataFieldFilterComponent implements OnInit {
  @ViewChild('typeaheadComponent', { static: false }) typeaheadComponent: TypeaheadComponent;
  @Input() dataType: DataType;
  @Input() roleDataRestriction: RoleDataRestriction;
  @Output() roleDataRestrictionChange =  new EventEmitter();
  @Output() roleDataRestrictionChanged =  new EventEmitter();
  userContext$: Observable<UserContext>;
 _DataFieldTypes = DataFieldTypes;
  Operators = [{value: true, text: 'Is equal to'}, {value: false, text: 'Is not equal to'}];
  selectedField: DataField;
  constructor() { }
  dataFieldChanged(value) {
    this.selectedField = this.dataType.DataFields.find(f => f.Id ===  value);
    this.roleDataRestrictionChanged.emit({property: 'DataFieldId', value: this.selectedField.Id});
    if (this.typeaheadComponent) {
      this.typeaheadComponent.refreshRemoteData(this.buildApiEndpoint(), 'Value');
      this.typeaheadComponent.clearValue();
    }
  }

  ngOnInit() {
    if (this.dataType && this.dataType.DataFields && this.roleDataRestriction) {
      this.selectedField = this.dataType.DataFields.find(f => f.Id === this.roleDataRestriction.DataFieldId);
    }
  }

  toTitleCase(input: string) {
    return input.toLowerCase().split('_').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
  }

  buildApiEndpoint() {
    let endpoint = `${RoleApiNames.GetDataFieldValues}${this.dataType.Name.replace(/\s+/g, '')}`;
    if (this.selectedField.FieldType !== this._DataFieldTypes.MULTISELECT) {
      endpoint += `&dataField=${this.toTitleCase(this.selectedField.Name)}`;
    }
    return endpoint;
  }
}
