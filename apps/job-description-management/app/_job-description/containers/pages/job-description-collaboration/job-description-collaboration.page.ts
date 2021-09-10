import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject} from 'rxjs';
import * as Quill from 'quill';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import QuillCursors from 'quill-cursors';

import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';

Quill.register('modules/cursors', QuillCursors);

@Component({
  selector: 'pf-job-description-collaboration-page',
  templateUrl: './job-description-collaboration.page.html',
  styleUrls: ['./job-description-collaboration.page.scss']
})

// new packages used: yjs y-quill y-websocket quill-cursors
export class JobDescriptionCollaborationPageComponent implements OnDestroy, OnInit {
  private unsubscribe$ = new Subject<void>();
  jdmCollaborationFeatureFlag: RealTimeFlag = { key: FeatureFlags.JdmCollaboration, value: false };

  ydoc: any;
  ytext_boundText: any;
  ytext_selectedCountry: any;
  yarray_selectedVehicles: any;
  userId: any;
  isLeader = false;

  awareness: any;
  boundText: any;
  countries = [
    {id: 1, name: 'United States'},
    {id: 2, name: 'Australia'},
    {id: 3, name: 'Canada'},
    {id: 4, name: 'Brazil'},
    {id: 5, name: 'England'}
  ];

  vehicles = [
    {id: 0, name: 'Bike'},
    {id: 1, name: 'Car'},
    {id: 2, name: 'Boat'},
    {id: 3, name: 'Tank'},
    {id: 4, name: 'Airplane'},
    {id: 4, name: 'Jet'}
  ];

  selectedCountry: any;
  selectedVehicles = [];

  constructor(private featureFlagService: AbstractFeatureFlagService, private router: Router,) {
    this.featureFlagService.bindEnabled(this.jdmCollaborationFeatureFlag, this.unsubscribe$);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  ngOnInit(): void {
    if (!this.jdmCollaborationFeatureFlag.value) {
      this.router.navigate(['/access-denied']);
    }

    this.ydoc = new Y.Doc();

    // this.ydoc.on('update', update => {
      // console.log('ydoc updated');
      // console.log(Y.encodeStateAsUpdate(this.ydoc));
    // });

    // https://docs.yjs.dev/ecosystem/connection-provider/y-websocket
    // we have the possibility to use a signalR Yjs backend project for this instead: https://github.com/yjs/ycs
    const provider = new WebsocketProvider('wss://ps-yjs-websockets-server.herokuapp.com/', 'yjs-test-demo', this.ydoc);

    // https://docs.yjs.dev/getting-started/adding-awareness
    this.awareness = provider.awareness;
    this.awareness.setLocalStateField('user', {clientID: this.awareness.clientID});
    this.userId = this.awareness.clientID;

    this.setupYTextValues();
    this.setupYArrayValues();
    this.setupYQuill(provider);
    this.setAwarenessOnChange();
  }


  setupYTextValues() {
    // https://docs.yjs.dev/api/shared-types/y.text
    this.ytext_boundText = this.ydoc.getText('bound-text');
    this.ytext_selectedCountry = this.ydoc.getText('selectedCountry');

    this.ytext_selectedCountry.observe(event => {
      this.selectedCountry = this.ytext_selectedCountry.toString();
    });

    this.ytext_boundText.observe(event => {
      this.boundText = this.ytext_boundText.toString();
    });
  }

  setupYArrayValues() {
    this.yarray_selectedVehicles = this.ydoc.getArray('selectedVehicles');
    this.yarray_selectedVehicles.observe(event => {
      this.selectedVehicles = this.yarray_selectedVehicles.toArray();
    });
  }

  setupYQuill(provider) {
    // https://docs.yjs.dev/ecosystem/editor-bindings/quill
    const richTextQuill = new Quill(document.querySelector('#richTextQuillEditor'), {
      modules: {
        cursors: true,
        toolbar: {
          container: [
            [{'size': ['small', false, 'large', 'huge']}],
            ['bold', 'italic', 'underline', 'link'],
            [{'align': []}],
            [{'color': []}, {'background': []}],
            ['clean']
          ]
        },
        history: {
          // Local undo shouldn't undo changes
          // from remote users
          userOnly: true
        }
      },
      placeholder: 'richTextQuillConfig collaboration...',
      theme: 'snow' // 'bubble' is also great
    });

    const smartListQuill = new Quill(document.querySelector('#smartListQuillEditor'), {
      modules: {
        cursors: true,
        toolbar: {
          container: [
            [{'size': ['small', false, 'large', 'huge']}],
            ['bold', 'italic', 'underline', 'link'],
            [{'list': 'bullet'}, {'list': 'ordered'}],
            [{'color': []}, {'background': []}],
            ['clean']
          ]
        },
        history: {
          // Local undo shouldn't undo changes
          // from remote users
          userOnly: true
        }
      },
      placeholder: 'smartListQuillConfig collaboration...',
      theme: 'snow' // 'bubble' is also great
    });

    const richTextQuillText = this.ydoc.getText('richTextQuill');
    const smartListQuillText = this.ydoc.getText('smartListQuill');

    // "Bind" the quill editor to a Yjs text type.
    const richTextBinding = new QuillBinding(richTextQuillText, richTextQuill, provider.awareness);
    const smartListBinding = new QuillBinding(smartListQuillText, smartListQuill, provider.awareness);

    // Remove the selection when the iframe is blurred
    window.addEventListener('blur', () => {
      richTextQuill.blur();
      smartListQuill.blur();
    });
  }

  setAwarenessOnChange() {
    this.awareness.on('change', () => {

      const sortedUsers = Array.from(this.awareness.getStates().values()).sort((a: any, b: any) =>
        (a.user.clientID > b.user.clientID) ? 1 : -1);

      const leader = sortedUsers[0] as any;

      if (leader.user.clientID === this.awareness.clientID ) {
        this.isLeader = true;
      } else {
        this.isLeader = false;
      }

      // Whenever somebody updates their awareness information,
      // we log all awareness information from all users.
       console.log(Array.from(this.awareness.getStates().values()));
    });
  }

  boundTextChanged(text) {
    this.ytext_boundText.delete(0, this.ytext_boundText.toString().length);
    this.ytext_boundText.insert(0, text);
  }

  selectedCountryChanged(text) {
    this.ytext_selectedCountry.delete(0, this.ytext_selectedCountry.toString().length);
    this.ytext_selectedCountry.insert(0, text);
  }

  selectedVehicleChanged(name: string, isChecked: boolean) {
    if (isChecked) {
      this.yarray_selectedVehicles.insert(0, [name]);
    } else {
      const index = this.yarray_selectedVehicles.toArray().findIndex(x => x === name);
      this.yarray_selectedVehicles.delete(index, 1);
    }
  }
}
