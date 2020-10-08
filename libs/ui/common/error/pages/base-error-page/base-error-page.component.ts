import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pf-base-error-page',
  templateUrl: './base-error-page.component.html',
  styleUrls: ['./base-error-page.component.scss']
})
export class BaseErrorPageComponent implements OnInit {

  @Input() iconStyle: string;
  @Input() iconName: string;
  @Input() errorCode: string;
  @Input() errorTitle: string;
  @Input() errorMessage: string;

  constructor() { }

  ngOnInit(): void {
  }

}
