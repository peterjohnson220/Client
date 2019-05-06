import {Component, EventEmitter, Input, OnInit, OnDestroy, Output, Pipe, PipeTransform, ViewChild} from '@angular/core';


import {DataFieldTypes} from '../../constants/data-field-type.constants';
import {DataType, RoleDataRestriction, DataField} from 'libs/models/security/roles';
import * as fromRootState from 'libs/state/state';
import {Observable, Subscription} from 'rxjs';

import {Store} from '@ngrx/store';

import { UserContext } from 'libs/models';

@Component({
  selector: 'pf-data-field-filter',
  templateUrl: './data-field-filter.component.html',
  styleUrls: ['./data-field-filter.component.scss']
})
export class DataFieldFilterComponent implements OnInit {

  @Input() dataType: DataType;
  @Input() roleDataRestriction: RoleDataRestriction;
  @Output() roleDataRestrictionChange =  new EventEmitter();
  @Output() roleDataRestrictionChanged =  new EventEmitter();
  userContext$: Observable<UserContext>;
 _DataFieldTypes: typeof DataFieldTypes = DataFieldTypes;
  Operators = [{value: true, text: 'Is equal to'}];
  selectedField: DataField;
  constructor() { }
  dataFieldChanged(value) {
    this.selectedField = this.dataType.DataFields.find(f => f.Id ===  value);
    this.roleDataRestrictionChanged.emit();
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
}
