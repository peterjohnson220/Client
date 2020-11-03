import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compensationField'
})

export class CompensationFieldPipe implements PipeTransform {
  transform(field: {override: string, default: string}): string {
    return field.override ? field.override : field.default;
  }
}
