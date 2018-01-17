import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pf-exchange-list-page',
  templateUrl: './exchange-list.page.html',
  styleUrls: ['./exchange-list.page.scss']
})
export class ExchangeListPageComponent {

  constructor(private router: Router) {}

  handleCellClick(exchangeId: number): void {
    this.router.navigate([ 'exchange', exchangeId ]);
  }
}
