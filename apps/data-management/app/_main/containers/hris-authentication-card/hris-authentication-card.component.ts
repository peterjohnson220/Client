import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CredentialsPackage } from 'libs/models';

import * as fromTransferDataPageActions from '../../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../../reducers';
import { PayfactorsApiModelMapper } from '../../helpers';
import {EntityTypeModel, Provider} from '../../models';

@Component({
  selector: 'pf-hris-authentication-card',
  templateUrl: './hris-authentication-card.component.html',
  styleUrls: ['./hris-authentication-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisAuthenticationCardComponent implements OnDestroy {
  @Input() validatedCredentials = false;
  @Input() provider: Provider;
  @Input() transferMethod: string;

  @ViewChild('authenticatingModal', {static: true}) authenticatingModal: ElementRef;

  showModal = false;

  validationErrors$: Observable<string[]>;
  showAuthenticatingModal$: Observable<boolean>;
  selectedEntities$: Observable<EntityTypeModel[]>;
  selectedEntities: EntityTypeModel[];

  private creds: CredentialsPackage = null;
  private unsubscribe$ = new Subject();

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.validationErrors$ = this.store.select(fromDataManagementMainReducer.getValidationErrors);
    this.showAuthenticatingModal$ = this.store.select(fromDataManagementMainReducer.getShowAuthenticatingModal);
    this.selectedEntities$ = this.store.select(fromDataManagementMainReducer.getSelectedEntities);
    this.selectedEntities$.pipe(takeUntil(this.unsubscribe$)).subscribe(s => {
      this.selectedEntities = s;
    });
  }

  submitFormEvent(event: any) {
    this.creds = PayfactorsApiModelMapper.mapFormValuesToCredentialsPackage(event, this.provider.ProviderCode, this.selectedEntities);
    this.store.dispatch(new fromTransferDataPageActions.Validate(this.creds));
  }

  cancelAuthClick() {
    this.creds = null;
    this.store.dispatch(new fromTransferDataPageActions.ResetTransferDataPageWorkflow());
  }

  createConnectionClick() {
    this.store.dispatch(new fromTransferDataPageActions.CreateConnection(this.creds));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}
