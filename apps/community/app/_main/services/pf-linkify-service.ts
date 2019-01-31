import { Injectable } from '@angular/core';
import { NgxLinkifyjsService, } from 'ngx-linkifyjs';

@Injectable()
export class PfLinkifyService {

  constructor(public linkifyService: NgxLinkifyjsService) { }

  getLinks(content: string) {
    const links = this.linkifyService.find(content);
    return links.map(link => ({ Type: link.type, Value: link.value, Href: link.href }));

  }
}
