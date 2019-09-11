import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CredentialsPackage } from 'libs/models';

import * as fromTransferDataPageActions from '../../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../../reducers';
import { PayfactorsApiModelMapper } from '../../helpers';
import { Provider } from '../../models';

@Component({
  selector: 'pf-hris-authentication-card',
  templateUrl: './hris-authentication-card.component.html',
  styleUrls: ['./hris-authentication-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisAuthenticationCardComponent {

  @Input() validatedCredentials = false;
  @Input() provider: Provider;
  @Input() transferMethod: string;

  @ViewChild('authenticatingModal', {static: true}) authenticatingModal: ElementRef;

  showModal = false;

  validationErrors$: Observable<string[]>;
  showAuthenticatingModal$: Observable<boolean>;

  private creds: CredentialsPackage = null;

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.validationErrors$ = this.store.select(fromDataManagementMainReducer.getValidationErrors);
    this.showAuthenticatingModal$ = this.store.select(fromDataManagementMainReducer.getShowAuthenticatingModal);
  }

  submitFormEvent(event: any) {
    this.creds = PayfactorsApiModelMapper.mapFormValuesToCredentialsPackage(event, this.provider.ProviderCode);
    this.store.dispatch(new fromTransferDataPageActions.Validate(this.creds));
  }

  cancelAuthClick() {
    this.creds = null;
    this.store.dispatch(new fromTransferDataPageActions.ResetTransferDataPageWorkflow());
  }

  createConnectionClick() {
    this.store.dispatch(new fromTransferDataPageActions.CreateConnection(this.creds));
  }

}
