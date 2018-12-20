import { PipeTransform, Pipe } from '@angular/core';
import * as constants from '../../models/community/community-constants.model';

@Pipe({ name: 'newLine' })
export class NewLinePipe implements PipeTransform {
  constructor() {
  }

  transform(text: string): any {
    text = text.replace(constants.NewMultiLineRegEx, '<br /><br />');
    text = text.replace(constants.NewLineRegEx, '<br />');
    return text;
  }

}
