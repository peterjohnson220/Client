import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-peer-filter-info',
  templateUrl: './peer-filter-info.component.html',
  styleUrls: ['./peer-filter-info.component.scss']
})

export class PeerFilterInfoComponent {
  @Input() orgCount: number;
  @Input() incCount: number;
  @Input() hasSelections: boolean;
  @Output() clearFiltersLinkClicked = new EventEmitter();

  constructor() { }

  handleClearFiltersLinkClicked() {
    if (this.hasSelections) {
      this.clearFiltersLinkClicked.emit();
    }
  }

}
