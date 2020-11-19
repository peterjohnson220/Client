import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CompositeDataLoadViewResponse, FileType } from 'libs/models';

import * as fromLoadersDataActions from '../../actions/loaders-data.actions';

@Component({
  selector: 'pf-latest-org-data-load-modal',
  templateUrl: './latest-org-data-load-modal.component.html',
  styleUrls: ['./latest-org-data-load-modal.component.scss']
})
export class LatestOrgDataLoadModalComponent {
  @Input() latestOrgDataLoad: CompositeDataLoadViewResponse;
  @Input() latestOrgDataLoadModalOpen$: Observable<boolean>;

  constructor(public store: Store<any>) {}

  downloadInvalidRecordsFile($event: any) {
    $event.preventDefault();
    this.store.dispatch(new fromLoadersDataActions.DownloadIVRF({
      Id: this.latestOrgDataLoad.externalId,
      FileType: FileType.InvalidRecordsFile,
    }));
  }

  handleModalDismissed(): void {
    this.store.dispatch(new fromLoadersDataActions.CloseLatestOrgDataLoadModal());
  }
}
