import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pf-composite-summary-download',
  templateUrl: './composite-summary-download.component.html',
  styleUrls: ['./composite-summary-download.component.scss']
})
export class CompositeSummaryDownloadComponent implements OnInit {

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;

    if (params.compositeDataLoadExternalId && params.action) {
      const id = params.compositeDataLoadExternalId;
      const action = params.action;
      const redirectUrl = `/odata/Integration/AuthRedirect?compositeDataLoadExternalId=${id}&action=${action}`;
      window.open(redirectUrl);
    }
  }

}
