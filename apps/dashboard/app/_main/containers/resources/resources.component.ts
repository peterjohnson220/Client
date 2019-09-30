import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pf-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    window.onmessage = function(e) {
      if (e.data === 'MyResources') {
        window.location.href  = '/marketdata/resources.asp';
        // TODO: redirecting to asp resources until new company-resources page is ready
        // window.location.href  = '/client/dashboard/company-resources';
      }
    };
  }
}
