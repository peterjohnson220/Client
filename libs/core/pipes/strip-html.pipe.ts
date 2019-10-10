import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'stripHtml', pure: true})
export class StripHtmlPipe implements PipeTransform {
  transform(html: string) {
    if (!(typeof html === 'string')) {
      return;
    }
    return html.replace(/(<([^>]+)>)/ig, '');
  }
}
