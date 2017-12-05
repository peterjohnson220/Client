import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { CustomValidators } from 'libs/forms/validators/custom-validators.validator';

@Component({
  selector: 'pf-create-exchange-modal',
  templateUrl: './create-exchange-modal.component.html',
  styleUrls: ['./create-exchange-modal.component.scss']
})
export class CreateExchangeModalComponent implements OnInit, OnDestroy {
  private createExchangeForm: FormGroup;
  private modalOpenSubscription: Subscription;
  private errorSubscription: Subscription;
  private errorMessageSubscription: Subscription;
  private errorValidationMessage: string;
  private hasDismissed = false;
  private modalRef: NgbModalRef;

  @ViewChild('content') modal: any;
  @Output() createExchangeEvent = new EventEmitter();
  @Output() onModalDismissed = new EventEmitter();
  @Input() creating: boolean;
  @Input() isOpen$: Observable<boolean>;
  @Input() error$: Observable<boolean>;
  @Input() errorMessage$: Observable<string>;

  constructor(private modalService: NgbModal, private fb: FormBuilder) {
    this.createForm();
  }

  get name() { return this.createExchangeForm.get('name'); }

  createForm(): any {
    this.createExchangeForm = this.fb.group({
      'name': ['', [CustomValidators.required]]
    });
  }

  createExchange() {
    this.createExchangeEvent.emit(this.name.value);
  }

  cleanModal(): void {
    const modalActive = this.modalRef;
    if (!this.hasDismissed && modalActive) {
      this.modalRef.close();
    }

    if (modalActive || this.hasDismissed) {
      this.createExchangeForm.reset();
    }
  }

  modalDismissed(): void {
    this.hasDismissed = true;
    this.onModalDismissed.emit();
  }

  // Lifecycle
  ngOnInit(): void {
    this.modalOpenSubscription = this.isOpen$.subscribe(open => {
      if (!open) {
        this.cleanModal();
      } else {
        this.hasDismissed = false;
        this.modalRef = this.modalService.open(this.modal);
        this.modalRef.result.then(() => {
          this.modalDismissed();
        }, () => {
          this.modalDismissed();
        });
      }
    });
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
    this.modalOpenSubscription.unsubscribe();
    this.errorMessageSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
