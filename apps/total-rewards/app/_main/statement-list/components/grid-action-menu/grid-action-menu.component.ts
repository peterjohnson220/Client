import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { StatementListViewModel } from '../../../../shared/models';

@Component({
  selector: 'pf-grid-action-menu',
  templateUrl: './grid-action-menu.component.html',
  styleUrls: ['./grid-action-menu.component.scss']
})
export class GridActionMenuComponent {

  @Input() statement: StatementListViewModel;
  @Input() isOpen: boolean;

  @Output() open = new EventEmitter<string>();
  @Output() close = new EventEmitter();

  @Output() editClick = new EventEmitter<string>();
  @Output() runStatementClick = new EventEmitter<string>();
  @Output() viewHistoryClick = new EventEmitter<string>();
  @Output() copyClick = new EventEmitter<string>();
  @Output() deleteClick = new EventEmitter<string>();

  onEllipsisClick(statementId: string) {
    if (this.isOpen) {
      this.close.emit();
    } else {
      this.open.emit(statementId);
    }
  }

  onEditClick(statementId: string) {
    this.editClick.emit(statementId);
  }

  onRunStatementClick(statementId: string) {
    this.runStatementClick.emit(statementId);
  }

  onViewHistoryClick(statementId: string) {
    this.viewHistoryClick.emit(statementId);
  }

  onCopyClick(statementId: string) {
    this.copyClick.emit(statementId);
  }

  onDeleteClick(statementId: string) {
    this.deleteClick.emit(statementId);
  }

  onClickElsewhere() {
    if (!this.isOpen) {
      return;
    }

    this.close.emit();
  }

  // send a close message up when the menu is open and the escape key is clicked
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isOpen && event.key.toLowerCase() === 'escape') {
      this.close.emit();
    }
  }
}
