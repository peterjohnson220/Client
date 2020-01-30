import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pf-total-rewards-control',
  templateUrl: './total-rewards-control.component.html',
  styleUrls: ['./total-rewards-control.component.scss']
})
export class TotalRewardsControlComponent implements OnInit {
  @Input() control;
  @Input() companyColors;
  @Input() employee;

  constructor() { }

  ngOnInit() {
  }
  public labelContent(e: any): string {
    return e.value + 'k';
  }
}
