import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-modal-form',
  templateUrl: './pf-modal-form.component.html',
  styleUrls: ['./pf-modal-form.component.scss']
})
export class PfModalFormComponent implements OnInit, OnDestroy {
  private activeModal: NgbModalRef;
  private attemptedSubmit = false;
  private modalOpenSubscription: Subscription;

  @Input() size = 'sm';
  @Input() title: string;
  @Input() subTitle: string;
  @Input() modalId: string;
  @Input() primaryButtonText = 'Submit';
  @Input() primaryButtonClass = 'btn-primary';
  @Input() primaryButtonTextSubmitting = this.primaryButtonText;
  @Input() secondaryButtonText = 'Cancel';
  @Input() showFooter = true;
  @Input() showSubmit = true;
  @Input() showDismiss = true;
  @Input() submitting: boolean;
  @Input() backdropClass: string;
  @Input() centered = false;
  @Input() formGroup: FormGroup;
  @Input() isOpen$: Observable<boolean>;
  @Input() allowDismiss = true;
  @Input() backdrop: boolean | 'static' = 'static';
  @Input() resetFormOnClose = true;
  @Input() windowClass: string = null;
  @Input() submitEnabled = true;
  @Input() showSpinner = true;
  @Input() alwaysEnabledSubmit: boolean;
  @Input() flipPrimarySecondaryBtns: boolean;
  @Output() onSubmit = new EventEmitter();
  @Output() onSubmitAttempt = new EventEmitter();
  @Output() onDismiss = new EventEmitter();
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  constructor(private modalService: NgbModal) { }

  get submitDisabled(): boolean {
    if (this.alwaysEnabledSubmit) {
      return false;
    }

    if (!this.formGroup) {
      return !this.submitEnabled || this.submitting;
    }

    return this.submitting || !this.formGroup.valid || !(this.formGroup.dirty || this.formGroup.touched);
  }
  dismiss(): void {
    this.onDismiss.emit();
  }

  submit(): void {
    this.attemptedSubmit = true;
    this.onSubmitAttempt.emit();
    if (!this.formGroup || this.formGroup.valid) {
      this.onSubmit.emit();
    }
  }

  cleanUpModal(): void {
    if (this.activeModal) {
      this.activeModal.close();

      if (this.resetFormOnClose) {
        this.resetForm();
      }
    }
  }

  resetForm(): void {
    if (this.formGroup) {
      this.formGroup.reset();
    }
  }

  // Lifecycle events
  ngOnInit(): void {
    if (!this.modalId) {
      // If a modalId is not provided, strip whitespace from the title of the modal and use that
      this.modalId = this.title.replace(/ /g, '');
    }
    this.modalOpenSubscription = this.isOpen$.subscribe(open => {
      if (!open) {
        this.cleanUpModal();
      } else {
        const ngbModalOptions = <NgbModalOptions>{
          backdrop: this.backdrop,
          backdropClass: this.backdropClass,
          container: `#${this.modalId}.modal-container`,
          size: this.size,
          centered: this.centered
        };
        if (this.windowClass !== null) {
          ngbModalOptions.windowClass = this.windowClass;
        }
        this.activeModal = this.modalService.open(this.templateRef, ngbModalOptions);
        this.activeModal.result.then(() => {
          if (this.attemptedSubmit) {
            this.attemptedSubmit = false;
            this.onDismiss.emit();
          }
        }, () => {
          this.onDismiss.emit();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.modalOpenSubscription.unsubscribe();
  }
}
