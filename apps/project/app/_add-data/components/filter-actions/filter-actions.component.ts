import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pf-filter-actions',
  templateUrl: './filter-actions.component.html',
  styleUrls: ['./filter-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterActionsComponent {
  @Output() reset = new EventEmitter();

  constructor() { }

  handleResetClicked() {
    this.reset.emit();
  }
}
