import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-filter-header',
  templateUrl: './filter-header.component.html',
  styleUrls: ['./filter-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterHeaderComponent {
  @Input() numberOfResults: number;
  @Input() singled: boolean;
  @Output() resetAll = new EventEmitter();

  constructor() { }

  handleResetAllClicked() {
    this.resetAll.emit();
  }
}
