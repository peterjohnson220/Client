import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pf-quill-toolbar',
  templateUrl: './quill-toolbar.component.html',
  styleUrls: ['./quill-toolbar.component.scss']
})
export class QuillToolbarComponent implements OnInit {
  @Input() toolbarId: string;
  @Input() isToolbarActive: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
