import {Pipe, PipeTransform} from '@angular/core';

import * as constants from '../../models/community/community-constants.model';

@Pipe({ name: 'newline' })
export class NewLinePipe implements PipeTransform {
    transform(value: string, args: string[]): any {
        const sanitizedMultiLines = value.replace(constants.NewMultiLineRegEx, '<br /><br />');
        const sanitized = sanitizedMultiLines.replace(constants.NewLineRegEx, '<br />');
        return sanitized;
    }
}
