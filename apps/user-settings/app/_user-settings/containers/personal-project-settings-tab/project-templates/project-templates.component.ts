import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pf-project-templates',
  templateUrl: './project-templates.component.html',
  styleUrls: ['./project-templates.component.scss']
})
export class ProjectTemplatesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  handleAddClicked() {
    alert('Project Templates add button clicked');
  }

}
