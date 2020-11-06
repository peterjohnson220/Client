import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromLoaderDashboardPageActions from '../../actions/loader-dashboard-page.actions';
import * as fromLoaderDashboardPageReducer from '../../reducers';
import { AsyncStateObj } from 'libs/models/state';

@Component({
  selector: 'pf-redrop-confirmation-modal',
  templateUrl: './redrop-confirmation-modal.component.html',
  styleUrls: ['./redrop-confirmation-modal.component.scss']
})
export class RedropConfirmationModalComponent {
  @Input() selectedCompositeDataLoadId: number;
  modalOpen$: Observable<boolean>;
  isRedropInProgress$: Observable<AsyncStateObj<boolean>>;

  constructor(private store: Store<fromLoaderDashboardPageReducer.State>) {
    this.modalOpen$ = this.store.select(fromLoaderDashboardPageReducer.getRedropConfirmationModalOpen);
    this.isRedropInProgress$ = this.store.select(fromLoaderDashboardPageReducer.getRedropExportedSourceFile);
  }

  handleDismissRedropConfirmationModal(): void {
    this.store.dispatch(new fromLoaderDashboardPageActions.DismissRedropConfirmationModal());
  }

  redropExportedSourceFile(): void {
    this.store.dispatch(new fromLoaderDashboardPageActions.RedropExportedSourceFile(this.selectedCompositeDataLoadId));
  }
}
