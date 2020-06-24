import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'pf-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})

export class FooterBarComponent {
  @Input() primaryButtonText = '';
  @Input() primaryButtonEnabled = true;
  @Input() primaryButtonToolTip = '';

  @Output() primaryButtonClick = new EventEmitter();

  onPrimaryButtonClick(): void {
    this.primaryButtonClick.emit();
  }
}
