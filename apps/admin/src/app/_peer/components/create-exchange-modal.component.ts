import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { CustomValidators } from 'libs/forms/validators/custom-validators.validator';
import { UpsertExchangeRequest } from 'libs/models/peer';

@Component({
  selector: 'pf-create-exchange-modal',
  templateUrl: './create-exchange-modal.component.html',
  styleUrls: ['./create-exchange-modal.component.scss']
})
export class CreateExchangeModalComponent implements OnInit, OnDestroy {
  private createExchangeForm: FormGroup;
  private errorSubscription: Subscription;
  private errorMessageSubscription: Subscription;
  private errorValidationMessage: string;
  private attemptedSubmit = false;

  @Output() createExchangeEvent = new EventEmitter();
  @Output() modalDismissedEvent = new EventEmitter();
  @Input() creatingExchange: boolean;
  @Input() isOpen$: Observable<boolean>;
  @Input() error$: Observable<boolean>;
  @Input() errorMessage$: Observable<string>;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  get name() { return this.createExchangeForm.get('name'); }

  createForm(): void {
    this.createExchangeForm = this.fb.group({
      'name': ['', [CustomValidators.required]]
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
