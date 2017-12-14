import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { PfValidators } from 'libs/forms/validators/pf-validators';
import { UpsertExchangeRequest } from 'libs/models/peer';

@Component({
  selector: 'pf-create-exchange-modal',
  templateUrl: './create-exchange-modal.component.html',
  styleUrls: ['./create-exchange-modal.component.scss']
})
export class CreateExchangeModalComponent implements OnInit, OnDestroy {
  createExchangeForm: FormGroup;
  errorSubscription: Subscription;
  errorMessageSubscription: Subscription;
  errorValidationMessage: string;
  attemptedSubmit = false;

  @Input() creatingExchange: boolean;
  @Input() isOpen$: Observable<boolean>;
  @Input() error$: Observable<boolean>;
  @Input() errorMessage$: Observable<string>;

  @Output() createExchangeEvent = new EventEmitter();
  @Output() modalDismissedEvent = new EventEmitter();

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  get name() { return this.createExchangeForm.get('name'); }

  createForm(): void {
    this.createExchangeForm = this.fb.group({
      'name': ['', [PfValidators.required]]
    });
  }

  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const newExchange: UpsertExchangeRequest = {
      ExchangeId: 0,
      ExchangeName: this.name.value,
      CompanyIds: []
    };
    this.createExchangeEvent.emit(newExchange);
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.modalDismissedEvent.emit();
  }

  // Lifecycle
  ngOnInit(): void {
    this.errorMessageSubscription = this.errorMessage$.subscribe(errorMessage => {
      this.errorValidationMessage = errorMessage;
    });
    this.errorSubscription = this.error$.subscribe(error => {
      if (error) {
        this.name.setErrors({'error': this.errorValidationMessage});
      }
    });
  }

  ngOnDestroy(): void {
    this.errorMessageSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
