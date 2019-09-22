import { Injectable } from '@angular/core';

@Injectable()
export class BrowserDetectionService {
  constructor() { }

  checkBrowserIsIEOrEdge() {
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    return isIEOrEdge;
  }

  checkBrowserIsIE() {
    const isIE = /msie\s|trident\//i.test(window.navigator.userAgent);
    return isIE;
  }
}
