import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pf-tile-preview-list',
  templateUrl: './tile-preview-list.component.html',
  styleUrls: ['./tile-preview-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewListComponent {
  @Input() iconClass: string;
}
