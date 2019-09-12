import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pf-complex-column',
  templateUrl: './complex-column.component.html',
  styleUrls: ['./complex-column.component.scss']
})
export class ComplexColumnComponent implements OnInit {

  @Input() parameters: string[];

  constructor() { }

  ngOnInit() {
  }

}
