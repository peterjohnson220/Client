import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ExchangeExplorerComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer';
import { ExchangeExplorerMapComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer-map';

@Component({
  selector: 'pf-standard-scopes',
  templateUrl: './standard-scopes.component.html',
  styleUrls: ['./standard-scopes.component.scss']
})
export class StandardScopesComponent implements OnInit {
  @ViewChild(ExchangeExplorerMapComponent, { static: true }) map: ExchangeExplorerMapComponent;
  @ViewChild(ExchangeExplorerComponent, { static: true }) exchangeExplorer: ExchangeExplorerComponent;

  exchangeId: number;

  constructor(private route: ActivatedRoute) {
    this.exchangeId = +this.route.snapshot.parent.params.id;
  }

  ngOnInit() {
    const setContextMessage: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: {
            exchangeId: this.exchangeId,
            isExchangeSpecific: true,
            includeDisabledFilters: true
          }
        }
      }
    } as MessageEvent;
    this.exchangeExplorer.onMessage(setContextMessage);
  }
}
