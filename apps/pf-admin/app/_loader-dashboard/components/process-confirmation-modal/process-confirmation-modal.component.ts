import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromLoaderDashboardPageActions from '../../actions/loader-dashboard-page.actions';
import * as fromLoaderDashboardPageReducer from '../../reducers';
import { AsyncStateObj } from 'libs/models/state';

@Component({
  selector: 'pf-process-confirmation-modal',
  templateUrl: './process-confirmation-modal.component.html',
  styleUrls: ['./process-confirmation-modal.component.scss']
})
export class ProcessConfirmationModalComponent {
  @Input() selectedCompositeDataLoadId: number;
  @Input() selectedClientName: string;
  @Input() selectedClientId: number;
  @Output() redropConfirmationEvent = new EventEmitter<boolean>();
  modalOpen$: Observable<boolean>;
  isRedropInProgress$: Observable<AsyncStateObj<boolean>>;

  constructor(private store: Store<fromLoaderDashboardPageReducer.State>) {
    this.modalOpen$ = this.store.select(fromLoaderDashboardPageReducer.getRedropNewDataLoadConfirmationModalOpen);
    this.isRedropInProgress$ = this.store.select(fromLoaderDashboardPageReducer.getRedropExportedSourceFileToNewDataLoad);
  }

  handleDismissRedropConfirmationModal(): void {
    this.redropConfirmationEvent.emit(false);
    this.store.dispatch(new fromLoaderDashboardPageActions.DismissRedropToNewDataLoadConfirmationModal());
  }

  handleRedropConfirmation(): void {
    this.redropConfirmationEvent.emit(true);
  }
}
