import {
  Component, Input, OnDestroy, OnInit, Output,
  EventEmitter, TemplateRef, ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() title: string;
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
    this.onSubmit.emit();
  }

  cleanUpModal(): void {
    if (this.activeModal) {
      this.attemptedSubmit = false;
      this.formGroup.reset();
      this.activeModal.close();
    }
  }

  // lifecycle events
  ngOnInit(): void {
    this.modalOpenSubscription = this.isOpen$.subscribe(open => {
      if (!open) {
        this.cleanUpModal();
      } else {
        this.activeModal = this.modalService.open(this.templateRef, { backdrop: 'static' });
      }
    });
  }

  ngOnDestroy(): void {
    this.modalOpenSubscription.unsubscribe();
  }
}
