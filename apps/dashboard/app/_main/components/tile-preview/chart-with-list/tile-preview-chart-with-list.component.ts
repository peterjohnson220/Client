import { Component, Input } from '@angular/core';

import { TilePreviewCharWithList } from '../../../models';

@Component({
  selector: 'pf-tile-preview-chart-with-list',
  templateUrl: './tile-preview-chart-with-list.component.html',
  styleUrls: [ './tile-preview-chart-with-list.component.scss' ]
})
export class TilePreviewChartWithListComponent {

  @Input() model: TilePreviewCharWithList;

}

