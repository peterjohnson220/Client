import { Component, OnInit } from '@angular/core';

import { WindowRef } from 'libs/core/services';

@Component({
  selector: 'pf-ticket-list-page',
  templateUrl: './ticket-list.page.html',
  styleUrls: ['./ticket-list.page.scss']
})
export class TicketListPageComponent implements OnInit {

  constructor(private window: WindowRef) { }

  ngOnInit() {
  }

  handleBackButtonClick(): void {
    this.window.nativeWindow.location = '/ng/site-admin/navigation';
  }
}
