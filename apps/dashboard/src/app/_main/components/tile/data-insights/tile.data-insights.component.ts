import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-dashboard-tile-data-insights',
  templateUrl: './tile.data-insights.component.html',
  styleUrls: ['./tile.data-insights.component.scss']
})
export class TileDataInsightsComponent {
  @Input() payload: any;
}
