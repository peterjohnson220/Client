
import { Pipe, PipeTransform } from '@angular/core';
import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';

@Pipe({
  name: 'communityCategoryDisplayName'
})
export class CommunityCategoryDisplayNamePipe implements PipeTransform {
  transform(value: string): string {
    if (value === CommunityCategoryEnum.JobPostings) {
      return 'Job Postings';
    }
    if (value === CommunityCategoryEnum.MyPosts) {
      return 'My Posts';
    }
    return value;
  }
}
