import { Component, Input } from '@angular/core';
import { TilePreviewList } from '../../../models';

@Component({
  selector: 'pf-tile-preview-total-rewards',
  templateUrl: './tile-preview-total-rewards.component.html',
  styleUrls: ['./tile-preview-total-rewards.component.scss']
})
export class TilePreviewTotalRewardsComponent {
  @Input() model: TilePreviewList;
}
