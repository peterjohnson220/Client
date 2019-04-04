import { Pipe, PipeTransform } from '@angular/core';

/*
 * Wrap a substring of text with an HTML tag
 * Takes in a string value and by default will wrap the entire value with a <span> tag
 * Optionally you can
 *      - Override to only grab a substring of the value by start/end
 *      - Provide a class name to add to the tag
 *      - Change the wrapping tag
 * Usage:
 *   value | wrapSubTextWithTag:from:to:className:tag
 * Example:
 *   {{ '$1,000' | wrapSubTextWithTag:0:1:'currency':'<div>' }}
 *   formats to: <div class='currency'>$</div>1,000
*/
@Pipe({
  name: 'wrapSubTextWithTag'
})
export class WrapSubtextWithTag implements PipeTransform {
  transform(
    value: string,
    from: number = 0,
    to: number = value.length,
    className: string,
    tag: string = '<span>',
  ): string {

    if (!value) {
      return '';
    }

    const openingTag = `${!!className ? tag.replace('>', ` class='${className}'>`) : tag}`;
    const subtext = `${value.substring(from, to)}`;
    const closingTag = `${tag.replace('<', '</')}`;

    let wrappedSubText = `${openingTag}${subtext}${closingTag}`;

    if (to < value.length) {
      wrappedSubText = `${wrappedSubText}${value.substring(to, value.length)}`;
    }

    return wrappedSubText;
  }
}
