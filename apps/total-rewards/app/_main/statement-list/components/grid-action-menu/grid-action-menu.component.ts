import {Component, Input, Output, EventEmitter, HostListener, OnInit} from '@angular/core';

import { Statement } from '../../../../shared/models';

@Component({
  selector: 'pf-grid-action-menu',
  templateUrl: './grid-action-menu.component.html',
  styleUrls: ['./grid-action-menu.component.scss']
})
export class GridActionMenuComponent {

  @Input() statement: Statement;
  @Input() isOpen: boolean;

  @Output() open = new EventEmitter<number>();
  @Output() close = new EventEmitter();

  @Output() editClick = new EventEmitter<Statement>();
  @Output() runStatementClick = new EventEmitter<Statement>();
  @Output() viewHistoryClick = new EventEmitter<Statement>();
  @Output() copyClick = new EventEmitter<Statement>();
  @Output() deleteClick = new EventEmitter<Statement>();

  onEllipsisClick(statementId: number) {
    if (this.isOpen) {
      this.close.emit();
    } else {
      this.open.emit(statementId);
    }
  }

  onEditClick(statement: Statement) {
    this.editClick.emit(statement);
  }

  onRunStatementClick(statement: Statement) {
    this.runStatementClick.emit(statement);
  }

  onViewHistoryClick(statement: Statement) {
    this.viewHistoryClick.emit(statement);
  }

  onCopyClick(statement: Statement) {
    this.copyClick.emit(statement);
  }

  onDeleteClick(statement: Statement) {
    this.deleteClick.emit(statement);
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
