import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Tile } from '../../models';

@Component({
  selector: 'pf-tile-grid',
  templateUrl: './tile-grid.component.html',
  styleUrls: ['./tile-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileGridComponent {
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() tiles: Tile[];
  @Output() reload = new EventEmitter();
}
