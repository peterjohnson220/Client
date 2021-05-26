import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { StatementEmailTemplate } from 'libs/models/payfactors-api/total-rewards';
import { DeliveryMethod } from 'libs/features/total-rewards/total-rewards-statement/models/delivery-method';

import { DeliveryOption } from '../../models';
import { StatementEmailTemplateComponent } from '../statement-email-template';

@Component({
  selector: 'pf-generate-statement-modal',
  templateUrl: './generate-statement-modal.component.html',
  styleUrls: ['./generate-statement-modal.component.scss']
})
export class GenerateStatementModalComponent implements OnInit, OnDestroy {
  @Input() isOpen$: Observable<boolean>;

  @Input() statement: Statement;
  @Input() sendingGenerateRequest: boolean;
  @Input() sendingGenerateRequestSuccess: boolean;
  @Input() sendingGenerateRequestError: boolean;
  @Input() companyEmployeeIdsTotal: number;
  @Input() electronicDeliveryEnabled = false;
  @Input() statementEmailTemplate: StatementEmailTemplate;

  @Output() generateStatementsClick: EventEmitter<DeliveryOption> = new EventEmitter();
  @Output() cancelClick = new EventEmitter();

  isOpenSubscription: Subscription;
  confirmCountNumber: number;

  @ViewChild('emailTemplate', { static: true }) emailTemplateComponent: StatementEmailTemplateComponent;
  deliveryMethod = DeliveryMethod;
  selectedDeliveryMethod: DeliveryMethod;

  ngOnInit(): void {
    this.isOpenSubscription = this.isOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.selectedDeliveryMethod = DeliveryMethod.PDFExport;
        this.emailTemplateComponent.init();
      }
    });
  }

  ngOnDestroy(): void {
    this.isOpenSubscription.unsubscribe();
  }

  onGenerateStatements() {
    const selectedDeliveryOption: DeliveryOption = {
      Method: this.selectedDeliveryMethod,
      EmailTemplate: this.selectedDeliveryMethod === DeliveryMethod.Email
        ? this.emailTemplateComponent.emailTemplate
        : null,
      SaveEmailTemplate: this.selectedDeliveryMethod === DeliveryMethod.Email
        ? this.emailTemplateComponent.rememberForNextTime
        : false
    };
    this.confirmCountNumber = null;
    this.generateStatementsClick.emit(selectedDeliveryOption);
  }

  onCancel() {
    this.confirmCountNumber = null;
    this.cancelClick.emit();
  }

  onConfirmCountChange(event: number) {
    this.confirmCountNumber = event;
  }

  get isConfirmCountInvalid(): boolean {
    return (this.confirmCountNumber || this.confirmCountNumber === 0) && this.confirmCountNumber !== this.companyEmployeeIdsTotal;
  }

  get isConfirmCountCorrect(): boolean {
    return this.confirmCountNumber === this.companyEmployeeIdsTotal;
  }

  get submitEnabled(): boolean {
    if (this.isConfirmCountCorrect) {
      if (!this.electronicDeliveryEnabled || this.selectedDeliveryMethod === DeliveryMethod.PDFExport) {
        return true;
      }
      return this.selectedDeliveryMethod === DeliveryMethod.Email && this.emailTemplateComponent?.isValid;
    }
    return false;
  }
}
