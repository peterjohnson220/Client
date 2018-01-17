import {
  Component, Input, OnDestroy, OnInit, Output,
  EventEmitter, TemplateRef, ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

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
  @Input() modalId: string;
  @Input() primaryButtonText = 'Submit';
  @Input() primaryButtonTextSubmitting = this.primaryButtonText;
  @Input() submitting: boolean;
  @Input() formGroup: FormGroup;
  @Input() isOpen$: Observable<boolean>;
  @Output() onSubmit = new EventEmitter();
  @Output() onDismiss = new EventEmitter();
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  constructor(private modalService: NgbModal) {  }

  dismiss(): void {
    this.onDismiss.emit();
  }

  submit(): void {
    this.attemptedSubmit = true;
    if (this.formGroup.valid) {
      this.onSubmit.emit();
    }
  }

  cleanUpModal(): void {
    if (this.activeModal) {
      this.activeModal.close();
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
        this.activeModal = this.modalService.open(this.templateRef, <NgbModalOptions>{
          backdrop: 'static',
          container: `#${this.modalId}.modal-container`,
          size: this.size
        });
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
