import { Injectable } from '@angular/core';

@Injectable()
export class WindowCommunicationService {
  parent: any;

  constructor() { }

  postMessage(messageType, body = null) {
    parent.postMessage({ type: messageType, body: body }, '*');
  }
}
