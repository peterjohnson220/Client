import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';

@Component({
  selector: 'pf-comphub-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent {
  @Input() pageTitle = '';
  @Input() pageSubTitle = '';
  @Input() pageIconClass = '';
  @Input() hideBackButton: boolean;
  @Input() hideNextButton: boolean;
  @Input() nextButtonEnabled: boolean;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) { }

  handleNextButtonClicked() {
    this.store.dispatch(new fromComphubPageActions.NavigateToNextCard());
  }

  handleBackButtonClicked() {
    this.store.dispatch(new fromComphubPageActions.NavigateToPreviousCard());
  }

}
