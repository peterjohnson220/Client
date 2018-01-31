import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-ellipsis-view-more',
  templateUrl: './ellipsis-view-more.component.html',
  styleUrls: ['./ellipsis-view-more.component.scss']
})
export class EllipsisViewMoreComponent {
  @Input() maxLength: number;
  @Input() content: string;

  showFull: boolean;

  constructor() {}
}
