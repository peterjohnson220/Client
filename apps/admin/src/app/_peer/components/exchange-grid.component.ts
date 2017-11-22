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






// test: ExchangeListItem[] = [
//   {
//     ExchangeId: 1,
//     ExchangeName: 'Airlines',
//     CreatedBy: 'Brandon Collins',
//     CreatedDate: new Date(),
//     CompanyNames: ['JetBlue', 'American']
//   },
//   {
//     ExchangeId: 2,
//     ExchangeName: 'Retail',
//     CreatedBy: 'Brandon Collins',
//     CreatedDate: new Date(),
//     CompanyNames: ['Express', 'Nike', 'Autozone']
//   },
//   {
//     ExchangeId: 3,
//     ExchangeName: 'Insurance',
//     CreatedBy: 'Brandon Collins',
//     CreatedDate: new Date(),
//     CompanyNames: ['Geico', 'Progrssive', 'Mutual']
//   },
//   {
//     ExchangeId: 4,
//     ExchangeName: 'Accounting',
//     CreatedBy: 'Brandon Collins',
//     CreatedDate: new Date(),
//     CompanyNames: ['ACI Worldwide Corp', 'The Andersons, Inc.', 'HB Capital']
//   },
//   {
//     ExchangeId: 5,
//     ExchangeName: 'Utilities',
//     CreatedBy: 'Brandon Collins',
//     CreatedDate: new Date(),
//     CompanyNames: ['Summit Electric Supply']
//   }
// ];

