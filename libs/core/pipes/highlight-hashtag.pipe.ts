import { PipeTransform, Pipe, SecurityContext } from '@angular/core';

import * as constants from '../../models/community/community-constants.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { escapeSpecialHtmlCharacters } from 'libs/core/helpers/community.helper';


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
    let sanitizedText = escapeSpecialHtmlCharacters(text);

    const sanitizedMultiLines = sanitizedText.replace(constants.NewMultiLineRegEx, '<br /><br />');
    sanitizedText = sanitizedMultiLines.replace(constants.NewLineRegEx, '<br />');

    return this.sanitizer.bypassSecurityTrustHtml(sanitizedText.replace(
      constants.HashTagRegEx,
      match => `<a class="hashtag-highlight"
                        href="javascript:window.postMessage({'action':'getCommunityPostsByTag', 'tag': '${match}' }, '*');">${match}</a>`
    ));
  }
}
