import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { Statement } from '../../../../shared/models';

@Component({
  selector: 'pf-generate-statement-modal',
  templateUrl: './generate-statement-modal.component.html',
  styleUrls: ['./generate-statement-modal.component.scss']
})
export class GenerateStatementModalComponent {
  @Input() isOpen$: Observable<boolean>;

  @Input() statement: Statement;
  @Input() sendingGenerateRequest: boolean;
  @Input() sendingGenerateRequestSuccess: boolean;
  @Input() sendingGenerateRequestError: boolean;
  @Input() companyEmployeeIdsTotal: number;

  @Output() generateStatementsClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();

  onGenerateStatements() {
    this.generateStatementsClick.emit();
  }

  onCancel() {
    this.cancelClick.emit();
  }
}
