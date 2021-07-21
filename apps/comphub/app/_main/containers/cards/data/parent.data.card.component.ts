import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ComphubType } from 'libs/constants';

import * as fromComphubMainReducer from '../../../reducers';
import { WorkflowContext } from '../../../models';

@Component({
  selector: 'pf-parent-data-card',
  templateUrl: './parent.data.card.component.html',
  styleUrls: ['./parent.data.card.component.scss']
})
export class ParentDataCardComponent {
  workflowContext$: Observable<WorkflowContext>;
  comphubTypes = ComphubType;

  constructor(private store: Store<fromComphubMainReducer.State>) {
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
  }
}
