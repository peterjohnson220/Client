import { OnInit, Component, Input, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromBulkAddUsersReducer from '../reducers';
import { BaseTogglePanelDirective } from './base-toggle-panel.directive';
import { LoaderState } from '../reducers/user-bulk-add.reducer';

@Component({
    selector: 'pf-base-bulk-add-users-toggle-panel',
    template: ``
})
export class BaseBulkAddUsersTogglePanelComponent extends BaseTogglePanelDirective implements OnInit, OnDestroy {
  loaderState$: Observable<LoaderState>;
  loaderStateSubscription: Subscription;
  @Input() loaderStepComplete = false;

  constructor(public store: Store<fromBulkAddUsersReducer.State>) {
    super();
    this.loaderState$ = this.store.select(fromBulkAddUsersReducer.getLoaderState);
  }

  ngOnDestroy(): void {
    this.loaderStateSubscription.unsubscribe();
  }

  ngOnInit() {
    this.loaderStateSubscription = this.loaderState$.subscribe(state => {

        if (state === this.panelId) {
            this.init();
        }
    });
    }

  // init called each time the current panel active
  init() { }
}
