import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'TruncateAfter'
})
export class TruncateAfterPipe implements PipeTransform {
  transform(value: string, threshold: number, excludeEllipses?: boolean): string {
    if (!value) {
      return value;
    }

    if (value.trim().length <= threshold) {
      return value;
    }

    let truncatedString = value.trim().substring(0, threshold - 1).trim();
    if (excludeEllipses == null || excludeEllipses !== true) {
      truncatedString = truncatedString + '...';
    }
    return truncatedString;
  }
}
