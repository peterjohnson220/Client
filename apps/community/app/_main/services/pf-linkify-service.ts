import { Injectable } from '@angular/core';
import { Link, NgxLinkifyjsService, } from 'ngx-linkifyjs';

import { CommunityLink } from 'libs/models/community';

@Injectable()
export class PfLinkifyService {

  constructor(public linkifyService: NgxLinkifyjsService) { }

  getLinks(content: string) {
    const links = this.linkifyService.find(content);
    return links.map(link => this.mapToCommunityLink(link));

  }

  mapToCommunityLink(link: Link): CommunityLink {
    return {
      Type: link.type,
      Value: link.value,
      Href: link.href
    };
  }
}
