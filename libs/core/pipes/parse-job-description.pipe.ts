import { PipeTransform, Pipe, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'jobDescriptionParser' })
export class JobDescriptionParserPipe implements PipeTransform {
  sections = [
    { text: 'Job Summary:', cssClass: 'job-summary', headerIcon: '<i class="fas fa-id-card"></i>' },
    { text: 'Job Duties:', cssClass: 'job-duties', headerIcon: '<i class="fas fa-tasks"></i>' },
    { text: 'Experience and Education:', cssClass: 'experience-and-education', headerIcon: '<i class="fas fa-graduation-cap"></i>' },
    { text: 'Reports to:', cssClass: 'reports-to', headerIcon: '<i class="fas fa-user-alt"></i>' },
    { text: 'Competencies:', cssClass: 'competencies', headerIcon: '<i class="fas fa-university"></i>' }
  ];

  constructor(public sanitizer: DomSanitizer) { }

  transform(jobDescription: string): SafeHtml {
    // bail if nothing/empty string is passed in
    if (!jobDescription) {
      return '';
    }

    // loop through all sections
    let parsedJobDescriptionHtml = '';
    for (let i = 0; i < this.sections.length; i ++) {
      // get the start and end index for the current section
      const section = this.sections[i];
      const startDelimiterIndex = jobDescription.toLowerCase().indexOf(section.text.toLowerCase());

      // end delimiter is the index of the next delimiter, or the last char if we're on the last delimiter
      let endDelimiterIndex: number;
      if (i < this.sections.length - 1) {
        endDelimiterIndex = jobDescription.toLowerCase().indexOf(this.sections[i + 1].text.toLowerCase());
      } else {
        endDelimiterIndex = jobDescription.length;
      }

      // bail if the start can't be identified
      if (startDelimiterIndex === -1 || endDelimiterIndex === -1) {
        return jobDescription;
      }

      // extract the substring between the delimiters and sanitize it
      let html = this.sanitizer.sanitize(SecurityContext.HTML, jobDescription.substring(startDelimiterIndex, endDelimiterIndex));

      // add header tags and an icon around the delimiter text itself, and slice the colon off the text
      const headerHtml = `<h6>${section.headerIcon}${section.text.slice(0, -1)}</h6>`;
      html = headerHtml + html.substring(section.text.length, html.length);

      // wrap in a span and append it to the html string being built up
      parsedJobDescriptionHtml += `<span class="${section.cssClass}">${html}</span>`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(parsedJobDescriptionHtml);
  }
}
