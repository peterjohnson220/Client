import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ComphubType } from 'libs/constants';

import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import { WorkflowContext } from '../../../../_shared/models';

@Component({
  selector: 'pf-parent-data-card',
  templateUrl: './parent.data.card.component.html',
  styleUrls: ['./parent.data.card.component.scss']
})
export class ParentDataCardComponent {
  workflowContext$: Observable<WorkflowContext>;
  comphubTypes = ComphubType;

  constructor(private store: Store<fromComphubSharedReducer.State>) {
    this.workflowContext$ = this.store.select(fromComphubSharedReducer.getWorkflowContext);
  }
}
