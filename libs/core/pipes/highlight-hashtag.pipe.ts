import { PipeTransform, Pipe } from '@angular/core';
import * as constants from '../../models/community/community-constants.model';

@Pipe({ name: 'highlightHashTag' })
export class HighlightHashTagPipe implements PipeTransform {
  constructor() { }
  transform(text: string, tag): any {
    if (text) {
      return text.replace(constants.HashTagRegEx, (match) => `<span class="hashtag-highlight">${match}</span>`);
    } else {
      return text;
    }
  }
}
