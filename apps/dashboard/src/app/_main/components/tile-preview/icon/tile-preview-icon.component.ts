import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TilePreviewIcon } from '../../../models';

@Component({
  selector: 'pf-tile-preview-icon',
  templateUrl: './tile-preview-icon.component.html',
  styleUrls: ['./tile-preview-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewIconComponent {
  @Input() model: TilePreviewIcon;
  objectKeys = Object.keys;
}
