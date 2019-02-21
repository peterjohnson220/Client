import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pf-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  handleBackButtonClick(): void {
    window.location.href = '/ng/site-admin/navigation';
  }
}
