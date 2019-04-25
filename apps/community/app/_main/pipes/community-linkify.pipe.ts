import { Pipe, PipeTransform } from '@angular/core';
import { NgxLinkifyjsService } from 'ngx-linkifyjs';

@Pipe({
  name: 'communityLinkify'
})
export class CommunityLinkifyPipe implements PipeTransform {
  constructor(public linkifyService: NgxLinkifyjsService) {
  }

  transform(value: string): string {
    return this.linkifyService.linkify(value);
  }
}
