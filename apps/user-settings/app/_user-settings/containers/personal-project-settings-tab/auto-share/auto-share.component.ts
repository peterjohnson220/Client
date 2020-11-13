import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pf-auto-share',
  templateUrl: './auto-share.component.html',
  styleUrls: ['./auto-share.component.scss']
})
export class AutoShareComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  handleAddClicked(){
    alert('Auto Share add button clicked');
  }
}
