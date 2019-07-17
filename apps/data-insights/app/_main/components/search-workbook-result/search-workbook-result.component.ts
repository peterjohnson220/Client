import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Workbook } from '../../models';

@Component({
  selector: 'pf-search-workbook-result',
  templateUrl: './search-workbook-result.component.html',
  styleUrls: ['./search-workbook-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchWorkbookResultComponent {
  @Input() workbook: Workbook;
  @Output() openViewsClicked: EventEmitter<Workbook> = new EventEmitter();
  openViews: boolean;

  constructor() {
    this.openViews = false;
  }

  handleOpenViewsClicked() {
    this.openViews = !this.openViews;
    this.openViewsClicked.emit(this.workbook);
  }
}
