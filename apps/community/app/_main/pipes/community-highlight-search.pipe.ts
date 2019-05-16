import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'communityHighlightText' })
export class CommunityHighlightTextPipe implements PipeTransform {
  constructor() { }
  transform(text: string, search): string {
    if (search && text) {

      const pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      /* TODO:  modify this to update the text for the links, (Hashtags, Mentions, and Urls) */
      /* this part of regex, (?![^<]*>|[^<>]*</), prevents anything within html tag from being replaced */
      const replacePattern = '(' + pattern + ')(?![^<]*>|[^<>]*</)';

      const regex = new RegExp(replacePattern, 'gi');

      return  text.replace(regex, (match) => `<span class="community-search-highlight">${match}</span>`);

    } else {
      return text;
    }
  }
}
