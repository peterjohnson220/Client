import { ChangeDetectionStrategy, Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'pf-search-actions',
  templateUrl: './search-actions.component.html',
  styleUrls: ['./search-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchActionsComponent {
  @Output() reset = new EventEmitter();

  constructor() { }

  handleResetClicked() {
    this.reset.emit();
  }
}
