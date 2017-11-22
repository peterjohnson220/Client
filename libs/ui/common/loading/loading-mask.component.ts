import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-loading-mask',
  templateUrl: './loading-mask.component.html',
  styleUrls: ['./loading-mask.component.scss']
})
export class LoadingMaskComponent {
  @Input() error: boolean;
  @Input() errorMessage: string;
  @Input() hideReloadButton: boolean;

  @Output() reload = new EventEmitter();
}
