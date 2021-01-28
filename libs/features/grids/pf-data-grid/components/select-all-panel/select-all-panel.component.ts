import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-select-all-panel',
  templateUrl: './select-all-panel.component.html',
  styleUrls: ['./select-all-panel.component.scss']
})
export class SelectAllPanelComponent {
  @Input() displayedItemsCount: number;
  @Input() totalCount: number;
  @Input() itemName = 'items';
}
