import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

import { ExchangeListItem } from 'libs/models';

@Component({
  selector: 'pf-exchange-grid',
  templateUrl: './exchange-grid.component.html',
  styleUrls: ['./exchange-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeGridComponent {
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() exchangeListItems: ExchangeListItem[];

  @Output() reload = new EventEmitter();
}
