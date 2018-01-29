import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var tableau: any;

@Component({
  selector: 'pf-tableau-report-embed-component',
  templateUrl: './tableau-report-embed.component.html',
  styleUrls: ['./tableau-report-embed.component.scss']
})
export class TableauReportEmbedComponent implements OnInit {

  reportName: string;
  reportServer: string;

  constructor(
    private route: ActivatedRoute
  ) {
    this.reportServer = 'https://stagereports.payfactors.com/';
    this.reportServer = 'https://reports.payfactors.com/';
  }

  // Events
  initViz() {
    var containerDiv = document.getElementById('vizContainer');
    var url = '';

    if (this.reportName === 'cola') {
      url = this.reportServer + 't/CompDashboards/views/COLA/COLA';
    } else if (this.reportName === 'minwage') {
      url = this.reportServer + 't/CompDashboards/views/MinimumWage/StateDashboard';
    } else {
      containerDiv.innerHTML = 'Invalid report specified';
      return;
    }

    var options = {
      hideToolbar: true/*,
      width: "1080px",
      height: "750px"*/
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
