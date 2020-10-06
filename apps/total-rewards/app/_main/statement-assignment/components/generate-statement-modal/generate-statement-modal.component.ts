import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Statement } from '../../../../shared/models';
import { DeliveryMethod } from '../../models';

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

  @Output() generateStatementsClick: EventEmitter<DeliveryMethod> = new EventEmitter();
  @Output() cancelClick = new EventEmitter();

  isOpenSubscription: Subscription;

  deliveryMethod = DeliveryMethod;
  selectedDeliveryMethod: DeliveryMethod;

  ngOnInit(): void {
    this.isOpenSubscription = this.isOpen$.subscribe(isOpen => {
      if (!isOpen) {
        this.selectedDeliveryMethod = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.isOpenSubscription.unsubscribe();
  }

  onGenerateStatements() {
    this.generateStatementsClick.emit(this.selectedDeliveryMethod);
  }

  onCancel() {
    this.cancelClick.emit();
  }
}
