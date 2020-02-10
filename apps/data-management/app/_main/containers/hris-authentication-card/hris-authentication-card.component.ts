import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, merge } from 'rxjs/operators';

import { OrgDataEntityType } from 'libs/constants';
import { CredentialsPackage } from 'libs/models';

import * as fromDataManagementMainReducer from '../../reducers';
import { PayfactorsApiModelMapper } from '../../helpers';
import { ConnectionSummary, EntityTypeModel, Provider } from '../../models';

@Component({
  selector: 'pf-hris-authentication-card',
  templateUrl: './hris-authentication-card.component.html',
  styleUrls: ['./hris-authentication-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisAuthenticationCardComponent implements OnDestroy {
  @Input() validatedCredentials = false;
  @Input() connectionSummary: ConnectionSummary;
  @Input() transferMethod: string;
  @Output() backClicked = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();
  @Output() saveClicked = new EventEmitter<CredentialsPackage>();
  @Output() validateCredentials = new EventEmitter<CredentialsPackage>();

  @ViewChild('authenticatingModal', {static: true}) authenticatingModal: ElementRef;

  showModal = false;

  showAuthenticatingModal$: Observable<boolean>;
  validationErrors$: Observable<string[]>;

  private creds: CredentialsPackage = null;
  private unsubscribe$ = new Subject();

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.validationErrors$ = this.store.select(fromDataManagementMainReducer.getValidationErrors);
    this.showAuthenticatingModal$ = this.store.select(fromDataManagementMainReducer.getShowAuthenticatingModal);
  }

  submitFormEvent(event: any) {
    this.creds = PayfactorsApiModelMapper.mapFormValuesToCredentialsPackage(event, this.connectionSummary);
    this.validateCredentials.emit(this.creds);
  }

  back() {
    this.backClicked.emit();
  }

  cancel() {
    this.creds = null;
    this.cancelClicked.emit();
  }

  save() {
    this.saveClicked.emit(this.creds);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}
