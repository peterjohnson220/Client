import { ChangeDetectionStrategy, Component, EventEmitter, Output, OnInit } from '@angular/core';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-search-actions',
  templateUrl: './search-actions.component.html',
  styleUrls: ['./search-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchActionsComponent implements OnInit {
  @Output() reset = new EventEmitter();
  @Output() saveFilters: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isForAllPayMarkets: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isForAllPayMarkets = false;
  }

  handleResetClicked() {
    this.reset.emit();
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
