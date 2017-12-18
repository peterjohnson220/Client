import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-tile-preview-chart',
  templateUrl: './tile-preview-chart.component.html',
  styleUrls: ['./tile-preview-chart.component.scss']
})
export class TilePreviewChartComponent {
  @Input() iconClass: string;
}
