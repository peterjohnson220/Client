import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pf-two-column-form',
  templateUrl: './two-column-form.component.html',
  styleUrls: ['./two-column-form.component.scss']
})
export class TwoColumnFormComponent implements OnInit {
  @Input() infoBackground: string;

  constructor() { }

  ngOnInit() {
  }

}
