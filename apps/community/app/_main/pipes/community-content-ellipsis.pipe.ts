import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'communityContentEllipsis'
})
export class CommunityContentEllipsisPipe implements PipeTransform {

  transform(value: string, maxLengthBeforeEllipsis = 875): string {

    if (value.length > maxLengthBeforeEllipsis) {
      value = `${value.substring(0, maxLengthBeforeEllipsis)} ...`;
    }

    return value;
  }
}
