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
export class DataFieldFilterComponent implements OnInit, OnDestroy {

  @Input() dataType: DataType;
  @Input() roleDataRestriction: RoleDataRestriction;
  @Output() roleDataRestrictionChange =  new EventEmitter();
  @Output() roleDataRestrictionChanged =  new EventEmitter();
  userContext$: Observable<UserContext>;
 _DataFieldTypes: typeof DataFieldTypes = DataFieldTypes;
  Operators = [{value: true, text: 'Is equal to'}];
  selectedField: DataField;
  paymarketApiName = 'PayMarket?$select=CompanyPayMarketId,PayMarket&$orderby=PayMarket';
  surveyApiName: string;
  surveyApiNameSubscription: Subscription;
  constructor(private store: Store<fromRootState.State>) {
     this.surveyApiNameSubscription = store.select(fromRootState.getUserContext).subscribe(uc => {
       if (uc) {
         this.surveyApiName = `User(${uc.UserId})/Default.GetSurveysAndAccessForUser?companyId=${uc.CompanyId}`;
       }
     });
  }
  dataFieldChanged(value) {
    this.selectedField = this.dataType.DataFields.find(f => f.Id ===  value);
    this.roleDataRestrictionChanged.emit();
  }

  ngOnInit() {
    if (this.dataType && this.dataType.DataFields && this.roleDataRestriction) {
      this.selectedField = this.dataType.DataFields.find(f => f.Id === this.roleDataRestriction.DataFieldId);
    }
  }
  ngOnDestroy() {
    this.surveyApiNameSubscription.unsubscribe();
  }
}
