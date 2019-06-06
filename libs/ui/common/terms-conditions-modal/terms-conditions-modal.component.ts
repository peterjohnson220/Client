import {
  Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild
} from '@angular/core';

import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'pf-terms-conditions-modal',
  templateUrl: './terms-conditions-modal.component.html',
  styleUrls: [ './terms-conditions-modal.component.scss' ]
})
export class TermsConditionsModalComponent implements OnInit {
  private activeModal: NgbModalRef;
  private modalOpenSubscription: Subscription;

  @Input() title: string;
  @Input() content: string;
  @Input() isOpen$: Observable<boolean>;
  @Input() size = 'lg';
  @Input() acceptButtonText = 'Continue';
  @Input() declineButtonText = 'Decline';
  @Input() showDeclineButton: false;
  @Input() showCloseButton: boolean;
  @Input() isHardCopy = false;
  @Input() tcType: string;
  @Input() fileToDownload: string;

  @Output() onAccept = new EventEmitter();
  @Output() onDecline = new EventEmitter();

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {

    this.modalOpenSubscription = this.isOpen$.subscribe(open => {
      {
        if (!open) {
          this.dismissModal();
        } else {
          this.openTermsAndConditionsModal();
        }
      }
    });
  }

  dismissModal(): void {
    if (this.activeModal) {
      this.activeModal.close();
    }
  }

  openTermsAndConditionsModal() {
    this.activeModal = this.modalService.open(this.templateRef, <NgbModalOptions>{
      backdrop: 'static',
      container: `.modal-container`,
      size: this.size,
      centered: true,
      keyboard: this.showCloseButton
    });
  }

  acceptTermsAndConditions(): void {
    this.dismissModal();
    this.onAccept.emit();
  }

  declineTermsAndConditions(): void {
    this.dismissModal();
    this.onDecline.emit();
  }
}
