import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { StatementEmailTemplate } from 'libs/models/payfactors-api/total-rewards';

import { DeliveryMethod, DeliveryOption } from '../../models';
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

  @ViewChild('emailTemplate', { static: true }) emailTemplateComponent: StatementEmailTemplateComponent;
  deliveryMethod = DeliveryMethod;
  selectedDeliveryMethod: DeliveryMethod;

  ngOnInit(): void {
    this.isOpenSubscription = this.isOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.selectedDeliveryMethod = null;
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
    this.generateStatementsClick.emit(selectedDeliveryOption);
  }

  onCancel() {
    this.cancelClick.emit();
  }

  get submitEnabled(): boolean {
    if (!this.electronicDeliveryEnabled || this.selectedDeliveryMethod === DeliveryMethod.PDFExport) {
      return true;
    }
    return this.emailTemplateComponent?.isValid;
  }
}
