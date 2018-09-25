import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

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
  @Output() saveFilters: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isForAllPayMarkets: boolean;

  constructor() { }

  handleResetAllClicked() {
    this.resetAll.emit();
  }

  openPopover(popover: NgbPopover): void {
    if (!popover.isOpen()) {
      popover.open();
    }
  }

  handleSaveFilters(popover: NgbPopover): void {
    this.closePopover(popover);
    this.saveFilters.emit(this.isForAllPayMarkets);
  }

  closePopover(popover: NgbPopover): void {
    if (popover.isOpen()) {
      popover.close();
    }
  }
}
