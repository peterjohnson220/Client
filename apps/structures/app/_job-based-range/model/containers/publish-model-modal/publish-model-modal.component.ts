import { Component, Input } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromPublishModelModalActions from '../../../shared/actions/publish-model-modal.actions';

@Component({
  selector: 'pf-publish-model-modal',
  templateUrl: './publish-model-modal.component.html',
  styleUrls: ['./publish-model-modal.component.scss']
})
export class PublishModelModalComponent {
  @Input() rangeGroupId: number;
  modalOpen$: Observable<boolean>;
  publishingModelAsyncObj$: Observable<AsyncStateObj<null>>;

  constructor(public store: Store<fromSharedJobBasedRangeReducer.State>) {
    this.modalOpen$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getPublishModelModalOpen));
    this.publishingModelAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getPublishingModelAsyncObj));
  }

  // Events
  handlePublish() {
    this.store.dispatch(new fromPublishModelModalActions.PublishModel({ rangeGroupId: this.rangeGroupId }));
  }

  handleDismiss() {
    this.store.dispatch(new fromPublishModelModalActions.CloseModal());
  }
}
