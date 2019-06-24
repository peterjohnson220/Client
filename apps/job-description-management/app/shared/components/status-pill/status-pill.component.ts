import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-status-pill',
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.scss']
})

export class StatusPillComponent {
  @Input() status: string;
}
