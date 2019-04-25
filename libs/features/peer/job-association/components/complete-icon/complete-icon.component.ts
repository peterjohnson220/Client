import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pf-complete-icon',
  templateUrl: './complete-icon.component.html'
})
export class CompleteIconComponent implements OnInit {
  @Input() isActive = true;

  circleClass = 'fill-active-primary';
  pathClass = 'fill-active-secondary';

  constructor() {}

  ngOnInit(): void {
    if (this.isActive) {
      this.circleClass = 'fill-active-primary';
      this.pathClass = 'fill-active-secondary';
    } else {
      this.circleClass = 'fill-inactive-primary';
      this.pathClass = 'fill-inactive-secondary';
    }
  }
}
