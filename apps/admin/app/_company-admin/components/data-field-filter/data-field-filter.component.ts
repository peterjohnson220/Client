import {Component, Input, OnDestroy, ViewChild} from '@angular/core';

import {DataField} from 'libs/models/security/roles/data-field';

import {DataFieldTypes} from '../../constants/data-field-type.constants';
import {DataType} from 'libs/models/security/roles/data-type';
import * as fromRootState from 'libs/state/state';
import {Observable, Subscription} from 'rxjs';

import {Store} from '@ngrx/store';

import { UserContext } from 'libs/models';


@Component({
  selector: 'pf-data-field-filter',
  templateUrl: './data-field-filter.component.html',
  styleUrls: ['./data-field-filter.component.scss']
})
export class DataFieldFilterComponent implements OnDestroy {

  @Input() dataType: DataType;
  @Input() value: any;
  userContext$: Observable<UserContext>;
  selectedPayMarkets = [];
  selectedSurvey = [];
 _DataFieldTypes: typeof DataFieldTypes = DataFieldTypes;
  Operators = ['Is equal to'];
  selectedField: DataField;
  paymarketApiName = 'PayMarket?$select=CompanyPayMarketId,PayMarket';
  surveyApiName: string;
  surveyApiNameSubscription: Subscription;
  constructor(private store: Store<fromRootState.State>) {
     this.surveyApiNameSubscription = store.select(fromRootState.getUserContext).subscribe(uc => {
       if (uc) {
         this.surveyApiName = `User(${uc.UserId})/Default.GetSurveysAndAccessForUser?companyId=${uc.CompanyId}`;
       }
     });
  }
  ngOnDestroy() {
    this.surveyApiNameSubscription.unsubscribe();
  }
}
