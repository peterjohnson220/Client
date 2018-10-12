import { PipeTransform, Pipe, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import * as constants from '../../models/community/community-constants.model';


@Pipe({ name: 'highlightHashTag' })
export class HighlightHashTagPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(text: string, type): SafeHtml {
    if (text && type) {
      if (type === 'styleOnly') {
        return this.FormatHashTagStyle(text);
      } else if (type === 'styleAndAction') {
        return this.FormatHashTagActionAndStyle(text);
      }
    } else {
      return text;
    }
  }

  FormatHashTagStyle(text) {
    return text.replace(constants.HashTagRegEx, (match) => `<span class="hashtag-highlight">${match}</span>`);
  }

  FormatHashTagActionAndStyle(text) {
    const sanitizedText = this.sanitizer.sanitize(SecurityContext.HTML, text);

    return this.sanitizer.bypassSecurityTrustHtml(sanitizedText.replace(
      constants.HashTagRegEx,
      match => `<a class="hashtag-highlight"
                        href="javascript:window.postMessage({'action':'getCommunityPostsByTag', 'tag': '${match}' }, '*');">${match}</a>`
      )
    );
  }
}
