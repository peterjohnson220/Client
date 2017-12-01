import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-async-container',
  templateUrl: './async-container.component.html',
  styleUrls: ['./async-container.component.scss']
})
export class AsyncContainerComponent {
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() loadingErrorMessage: string;
  @Input() hideReloadButton: boolean;

  @Output() reload = new EventEmitter();
}
