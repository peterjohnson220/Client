// https://gist.github.com/adamrecsko/0f28f474eca63e0279455476cc11eca7 [JP]
import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlightText' })
export class HighlightTextPipe implements PipeTransform {
  constructor(public sanitizer: DomSanitizer) { }
  transform(text: string, search): SafeHtml {
    if (search && text) {
      const pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      const regex = new RegExp(pattern, 'gi');
      return this.sanitizer.bypassSecurityTrustHtml(
        text.replace(regex, (match) => `<span class="search-highlight">${match}</span>`)
      );

    } else {
      return text;
    }
  }
}
