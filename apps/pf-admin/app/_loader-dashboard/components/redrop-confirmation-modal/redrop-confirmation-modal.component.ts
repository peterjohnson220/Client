import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() selectedClientName: string;
  @Input() selectedClientId: number;
  @Input() isRedropModified: boolean;
  @Output() redropConfirmationEvent = new EventEmitter<boolean>();
  modalOpen$: Observable<boolean>;
  isRedropInProgress$: Observable<AsyncStateObj<boolean>>;
  isModifiedRedropInProgress$: Observable<boolean>;

  constructor(private store: Store<fromLoaderDashboardPageReducer.State>) {
    this.modalOpen$ = this.store.select(fromLoaderDashboardPageReducer.getRedropConfirmationModalOpen);
    this.isRedropInProgress$ = this.store.select(fromLoaderDashboardPageReducer.getRedropExportedSourceFile);
    this.isModifiedRedropInProgress$ = this.store.select(fromLoaderDashboardPageReducer.getIsModifiedRedropInProgress);
  }

  handleDismissRedropConfirmationModal(): void {
    this.redropConfirmationEvent.emit(false);
    this.store.dispatch(new fromLoaderDashboardPageActions.DismissRedropConfirmationModal());
  }

  handleRedropConfirmation(): void {
    this.redropConfirmationEvent.emit(true);
  }
}
