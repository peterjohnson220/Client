import { PipeTransform, Pipe } from '@angular/core';
import * as constants from '../../models/community/community-constants.model';

@Pipe({ name: 'formatLinkUrl' })
export class FormatLinkUrlPipe implements PipeTransform {
  constructor() {
  }

  transform(text: string, tag): any {
    if (text) {
      return text.replace(constants.UrlLinkRegEx, (match) => `<a class="link-url" href="${this.addHttpsToLink(match)}"
    target="_blank">${match}</a>`);
    } else {
      return text;
    }
  }

  addHttpsToLink(match) {
    if (!match.toLowerCase().startsWith('http')) {
      return `https://${match}`;
    } else {
      return match;
    }
  }
}
