import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import * as fromComphubMainReducer from '../../../reducers';
import { WorkflowContext } from '../../../models';
import { ComphubPages } from '../../../data';

@Component({
  selector: 'pf-card-layout',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.scss']
})
export class CardLayoutComponent implements OnInit, OnDestroy {
  @Input() pageTitle = '';
  @Input() pageSubTitle = '';
  @Input() pageIconClass = '';
  @Input() page: ComphubPages;

  workflowContext$: Observable<WorkflowContext>;
  selectedPageIdDelayed$: Observable<ComphubPages>;

  workflowContextSub: Subscription;

  workflowContext: WorkflowContext;
  comphubPages = ComphubPages;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.selectedPageIdDelayed$ = this.store.select(fromComphubMainReducer.getSelectedPageId).pipe(debounceTime(750));
  }

  ngOnInit(): void {
    this.workflowContextSub = this.workflowContext$.subscribe(wfc => this.workflowContext = wfc);
  }

  ngOnDestroy(): void {
    this.workflowContextSub.unsubscribe();
  }

}
