import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TilePreviewBasicListTile } from '../../../models';

@Component({
  selector: 'pf-basic-list',
  templateUrl: './basic-list.component.html',
  styleUrls: [ './basic-list.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicListComponent {
  @Input() model: TilePreviewBasicListTile;
}

