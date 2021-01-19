import { Component } from '@angular/core';

@Component({
  selector: 'pf-compensation-value-placeholder',
  templateUrl: './compensation-value-placeholder.component.html',
  styleUrls: ['./compensation-value-placeholder.component.scss']
})

// span with an encoded $---,--- which prevents some font families from rendering consecutive hyphens as dashes
export class CompensationValuePlaceholderComponent {}
