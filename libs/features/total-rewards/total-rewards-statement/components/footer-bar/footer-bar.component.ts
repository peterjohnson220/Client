import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'pf-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})

export class FooterBarComponent {
  @Input() primaryButtonText = '';
  @Input() primaryButtonEnabled = true;
  @Input() showPrimaryButtonSpinner = false;
  @Input() primaryButtonToolTip = '';
  @Input() secondaryButtonText = '';

  @Output() primaryButtonClick = new EventEmitter();
  @Output() secondaryButtonClick = new EventEmitter();

  onPrimaryButtonClick(): void {
    this.primaryButtonClick.emit();
  }

  onSecondaryButtonClick(): void {
    this.secondaryButtonClick.emit();
  }
}
