import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pf-tile-preview-chart',
  templateUrl: './tile-preview-chart.component.html',
  styleUrls: ['./tile-preview-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewChartComponent {
  @Input() iconClass: string;
}
