import { Component, AfterViewChecked } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromProductAssetsReducer from '../reducers';

declare var tableau: any;

@Component({
  selector: 'pf-tableau-report-embed-component',
  templateUrl: './tableau-report-embed.component.html',
  styleUrls: ['./tableau-report-embed.component.scss']
})
export class TableauReportEmbedComponent implements AfterViewChecked {


  constructor(
    private store: Store<fromProductAssetsReducer.State>
  ) {

  }

  // Events
  initViz() {
    var containerDiv = document.getElementById("vizContainer");
    //var url = "http://public.tableau.com/views/RegionalSampleWorkbook/Storms";
    var url = "https://stagereports.payfactors.com/t/CompDashboards/views/MinimumWage/StateDashboard";

    var options = {
      hideToolbar: true,
      /*onFirstInteractive: function () {
        console.log("Run this code when the viz has finished loading.");
      }*/
    };

    // var viz = new tableau.Viz(containerDiv, url);
    var viz = new tableau.Viz(containerDiv, url, options);
  }

  // Lifecycle
  ngAfterViewChecked () {
    this.initViz();
  }

}
