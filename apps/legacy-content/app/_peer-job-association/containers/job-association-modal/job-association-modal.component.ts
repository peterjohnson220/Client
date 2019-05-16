import { Component, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';

import * as companyJobActions from 'libs/features/peer/job-association/actions/company-jobs.actions';
import * as jobAssociationModalActions from 'libs/features/peer/job-association/actions/job-association-modal.actions';
import * as fromJobAssociationReducers from 'libs/features/peer/job-association/reducers';

@Component({
  selector: 'pf-legacy-content-peer-job-association-modal',
  templateUrl: './job-association-modal.component.html',
  styleUrls: ['./job-association-modal.component.scss']
})

export class LegacyContentPeerJobAssociationModalComponent {
  constructor(private store: Store<fromJobAssociationReducers.State>) {}

  @HostListener('window:message', ['$event'])
  onMessage(ev) {
    switch (ev.data.type) {
      case jobAssociationModalActions.CLOSE_JOB_ASSOCIATIONS_MODAL: {
        this.store.dispatch(new jobAssociationModalActions.CloseJobAssociationsModal());
        break;
      }
      case jobAssociationModalActions.CLOSE_MODAL_WITH_SAVEABLE_CHANGES: {
        this.store.dispatch(new jobAssociationModalActions.CloseModalWithSaveableChanges());
        break;
      }
      case jobAssociationModalActions.OPEN_JOB_ASSOCIATIONS_MODAL: {
        this.store.dispatch(new jobAssociationModalActions.OpenJobAssociationModal());
        break;
      }
      case jobAssociationModalActions.RESET_JOB_ASSOCIATIONS_MODAL: {
        this.store.dispatch(new jobAssociationModalActions.ResetJobAssociationsModal());
        break;
      }
      case companyJobActions.UPDATE_COMPANY_JOB_ID_FILTERS: {
        if (ev.data.payload) {
          this.store.dispatch(new companyJobActions.UpdateCompanyJobIdFilters(ev.data.payload));
        }
        break;
      }
    }
  }
}
