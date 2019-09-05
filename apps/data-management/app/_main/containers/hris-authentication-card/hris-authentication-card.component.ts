import { Component, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromTransferDataPageActions from '../../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../../reducers';
import { Provider } from '../../models';
import { Observable, Subscription } from 'rxjs';
import { PayfactorsApiModelMapper } from '../../helpers';

@Component({
  selector: 'pf-hris-authentication-card',
  templateUrl: './hris-authentication-card.component.html',
  styleUrls: ['./hris-authentication-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisAuthenticationCardComponent implements OnDestroy {

  @Input() provider: Provider;
  @Input() transferMethod: string;


  validationErrors: string[];
  validationErrors$: Observable<string[]>;
  validationErrorsSub: Subscription;

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.validationErrors$ = this.store.select(fromDataManagementMainReducer.getValidationErrors);

    this.validationErrorsSub =
      this.validationErrors$.subscribe(ves => this.validationErrors = ves);
  }

  ngOnDestroy(): void {
    this.validationErrorsSub.unsubscribe();
  }

  submitFormEvent(event: any) {
    const credentialsPackage  = PayfactorsApiModelMapper.mapFormValuesToCredentialsPackage(event, this.provider.ProviderCode);
    this.store.dispatch(new fromTransferDataPageActions.Validate(credentialsPackage));
  }

  cancelAuthClick() {
    this.store.dispatch(new fromTransferDataPageActions.ResetTransferDataPageWorkflow());
  }
}
