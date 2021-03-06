import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-error-indicator',
  templateUrl: './error-indicator.component.html',
  styleUrls: ['./error-indicator.component.scss']
})
export class ErrorIndicatorComponent {
  @Input() message: string;
}
