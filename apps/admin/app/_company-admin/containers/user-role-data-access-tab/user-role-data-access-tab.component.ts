import {Component, OnInit, OnDestroy} from '@angular/core';

import {DataType} from 'libs/models/security/roles/data-type';
import {Store} from '@ngrx/store';
import * as userRoleReducer from '../../reducers';
import * as fromDataAccessTabActions from '../../reducers';
import {Subscription} from 'rxjs';

@Component({
  selector: 'pf-user-role-data-access-tab',
  templateUrl: './user-role-data-access-tab.component.html',
  styleUrls: ['./user-role-data-access-tab.component.scss']
})
export class UserRoleDataAccessTabComponent  implements OnInit, OnDestroy {
  dataTypes: DataType[];
  dataTypesSubscription: Subscription;
  constructor(public store: Store<fromDataAccessTabActions.State>) {
    this.dataTypesSubscription = this.store.select(fromDataAccessTabActions.getDataTypes).subscribe(p => {
      this.dataTypes = p;
    });
  }
  ngOnInit() {

  }
  ngOnDestroy() {
    this.dataTypesSubscription.unsubscribe();
  }
}
