import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'environments/environment';

declare var tableau: any;

@Component({
  selector: 'pf-tableau-report-embed-component',
  templateUrl: './tableau-report-embed.component.html',
  styleUrls: ['./tableau-report-embed.component.scss']
})
export class TableauReportEmbedComponent implements OnInit {

  reportName: string;

  constructor(
    private route: ActivatedRoute
  ) {

  }

  // Events
  initViz() {
    var containerDiv = document.getElementById('vizContainer');
    var url = '';

    if (this.reportName === 'cola') {
      url = `${environment.tableauReportingServer}t/CompDashboards/views/COLA/COLA`;
    } else if (this.reportName === 'minwage') {
      url = `${environment.tableauReportingServer}t/CompDashboards/views/MinimumWage/StateDashboard`;
    } else {
      containerDiv.innerHTML = 'Invalid report specified';
      return;
    }

    var options = {
      hideToolbar: true
    };

    // var viz = new tableau.Viz(containerDiv, url);
    var viz = new tableau.Viz(containerDiv, url, options);
  }

  // Lifecycle
  ngOnInit () {
    this.reportName = this.route.snapshot.paramMap.get('report');
    this.initViz();
  }
}
