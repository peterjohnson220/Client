import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromExchangeJobMappingInfoActions from '../../actions/exchange-job-mapping-info.actions';
import * as fromPeerManagementReducer from '../../reducers';

@Component({
  selector: 'pf-delete-mapping-confirmation-modal',
  templateUrl: './delete-mapping-confirmation-modal.component.html',
  styleUrls: ['./delete-mapping-confirmation-modal.component.scss']
})
export class DeleteMappingConfirmationModalComponent {
  @Input() selectedExchangeJobTitle: string;
  @Input() jobTitle: string;
  @Input() exchangeJobToCompanyJobId: number;

  deleteMappingConfirmationModalOpen$: Observable<boolean>;
  deletingMapping$: Observable<boolean>;
  deletingMappingError$: Observable<boolean>;

  constructor(private store: Store<fromPeerManagementReducer.State>) {
    this.deleteMappingConfirmationModalOpen$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoDeleteConfirmationModalOpen);
    this.deletingMapping$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoDeletingMapping);
    this.deletingMappingError$ = this.store.select(fromPeerManagementReducer.getExchangeJobsInfoDeletingMappingError);
  }

  // Modal events
  handleDeleteConfirmed() {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.DeleteMapping({
      exchangeJobToCompanyJobId: this.exchangeJobToCompanyJobId
    }
    ));
  }

  handleDeleteDenied() {
    this.store.dispatch(new fromExchangeJobMappingInfoActions.CloseDeleteConfirmationModal());
  }
}
