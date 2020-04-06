import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {UserContext} from 'libs/models/security';
import {CompanyClientTypeConstants} from 'libs/constants';
import * as fromRootReducer from 'libs/state/state';

import * as fromComphubMainReducer from '../../../reducers';
import {WorkflowContext} from '../../../models';

@Component({
  selector: 'pf-parent-data-card',
  templateUrl: './parent.data.card.component.html',
  styleUrls: ['./parent.data.card.component.scss']
})

export class ParentDataCardComponent {
  @Input() workflowContext: WorkflowContext;
  userContext$: Observable<UserContext>;

  readonly PEER_AND_ANALYSIS = CompanyClientTypeConstants.PEER_AND_ANALYSIS;

  constructor(private store: Store<fromComphubMainReducer.State>) {
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
  }
}
