import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pf-entity-upload',
  templateUrl: './entity-upload.component.html',
  styleUrls: ['./entity-upload.component.scss']
})
export class EntityUploadComponent implements OnInit {

  @Input() selectedMapping: number;

  uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint

  constructor() {

    // TODO: Wire me up on constructor
    this.savedMappings$ = [
      { MappingId: -1, MappingName: 'Add New Mapping' },
      { MappingId: 1, MappingName: 'Test Mapping' }
    ];
  }



  savedMappings$: any;

  ngOnInit() {
  }

}
