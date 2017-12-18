import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-tile-preview-icon',
  templateUrl: './tile-preview-icon.component.html',
  styleUrls: ['./tile-preview-icon.component.scss']
})
export class TilePreviewIconComponent {
  @Input() iconClass: string;
}
