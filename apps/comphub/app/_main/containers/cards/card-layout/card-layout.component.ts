import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { environment } from 'environments/environment';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { WindowRef } from '../../../services';

@Component({
  selector: 'pf-card-layout',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.scss']
})
export class CardLayoutComponent {
  @Input() pageTitle = '';
  @Input() pageSubTitle = '';
  @Input() pageIconClass = '';
  @Input() hideBackButton: boolean;
  @Input() hideNextButton: boolean;
  @Input() nextButtonEnabled: boolean;
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    private window: WindowRef,
    private modalService: NgbModal
  ) { }

  handleNextButtonClicked() {
    this.store.dispatch(new fromComphubPageActions.NavigateToNextCard());
  }

  handleBackButtonClicked() {
    this.store.dispatch(new fromComphubPageActions.NavigateToPreviousCard());
  }

  handleCloseClicked() {
    this.modalService.open(this.modalContent, <NgbModalOptions> {
      backdrop: 'static'
    });
  }

  handleConfirmedCloseApp() {
    this.window.nativeWindow.location = `/${environment.hostPath}/dashboard`;
  }
}
