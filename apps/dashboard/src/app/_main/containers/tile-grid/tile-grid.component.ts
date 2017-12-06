import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

import { DashboardTile } from 'libs/models/dashboard';

@Component({
  selector: 'pf-tile-grid',
  templateUrl: './tile-grid.component.html',
  styleUrls: ['./tile-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileGridComponent {
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() tiles: DashboardTile[];
  @Output() reload = new EventEmitter();
}
