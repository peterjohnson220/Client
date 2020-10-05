import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { StatementListViewModel } from 'libs/features/total-rewards/total-rewards-statement/models';

@Component({
  selector: 'pf-grid-action-menu',
  templateUrl: './grid-action-menu.component.html',
  styleUrls: ['./grid-action-menu.component.scss']
})
export class GridActionMenuComponent {

  @Input() statement: StatementListViewModel;
  @Input() isOpen: boolean;

  @Output() open = new EventEmitter<StatementListViewModel>();
  @Output() close = new EventEmitter();

  @Output() previewClick = new EventEmitter<StatementListViewModel>();
  @Output() editClick = new EventEmitter<StatementListViewModel>();
  @Output() generateStatementClick = new EventEmitter<StatementListViewModel>();
  @Output() copyClick = new EventEmitter<StatementListViewModel>();
  @Output() deleteClick = new EventEmitter<StatementListViewModel>();

  onEllipsisClick() {
    if (this.isOpen) {
      this.close.emit();
    } else {
      this.open.emit(this.statement);
    }
  }

  onPreviewClick() {
    this.previewClick.emit(this.statement);
  }

  onEditClick() {
    this.editClick.emit(this.statement);
  }

  onGenerateStatementClick() {
    this.generateStatementClick.emit(this.statement);
  }

  onCopyClick() {
    this.copyClick.emit(this.statement);
  }

  onDeleteClick() {
    this.deleteClick.emit(this.statement);
  }

  onClickElsewhere() {
    if (this.isOpen) {
      this.close.emit();
    }
  }

  // send a close message up when the menu is open and the escape key is clicked
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isOpen && event.key.toLowerCase() === 'escape') {
      this.close.emit();
    }
  }
}
