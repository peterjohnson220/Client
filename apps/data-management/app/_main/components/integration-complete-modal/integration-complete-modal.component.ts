import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'pf-integration-complete-modal',
  templateUrl: './integration-complete-modal.component.html',
  styleUrls: ['./integration-complete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationCompleteModalComponent {
  @Input() isOpen$: Observable<boolean>;
  @Input() friendlyName: string;
  @Output() dismissed = new EventEmitter();

  onOk() {
    this.dismissed.emit();
  }
}
