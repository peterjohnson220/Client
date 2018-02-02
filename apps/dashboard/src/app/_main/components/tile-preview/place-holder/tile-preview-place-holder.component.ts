import { Component, Input } from '@angular/core';
import { TilePreviewPlaceHolder, TileType } from '../../../models';

@Component({
  selector: 'pf-tile-preview-place-holder',
  templateUrl: './tile-preview-place-holder.component.html',
  styleUrls: ['./tile-preview-place-holder.component.scss']
})
export class TilePreviewPlaceHolderComponent {
  @Input() model: TilePreviewPlaceHolder;
  tileTypes: TileType = new TileType();
}
