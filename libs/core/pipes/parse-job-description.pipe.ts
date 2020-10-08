import { PipeTransform, Pipe, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { icon } from '@fortawesome/fontawesome-svg-core';
import { faIdCard } from '@fortawesome/pro-solid-svg-icons/faIdCard';
import { faTasks } from '@fortawesome/pro-solid-svg-icons/faTasks';
import { faGraduationCap } from '@fortawesome/pro-solid-svg-icons/faGraduationCap';
import { faUserAlt } from '@fortawesome/pro-solid-svg-icons/faUserAlt';
import { faUniversity } from '@fortawesome/pro-solid-svg-icons/faUniversity';

@Pipe({ name: 'jobDescriptionParser' })
export class JobDescriptionParserPipe implements PipeTransform {
  faIdCard = icon(faIdCard);
  faTasks = icon(faTasks);
  faGraduationCap = icon(faGraduationCap);
  faUserAlt = icon(faUserAlt);
  faUniversity = icon(faUniversity);

  sections = [];

  constructor(public sanitizer: DomSanitizer) { }

  transform(jobDescription: string): SafeHtml {
    // bail if nothing/empty string is passed in
    if (!jobDescription) {
      return '';
    }

    this.sections = [
      { text: 'Job Summary:', cssClass: 'job-summary', headerIcon: `<span>${this.faIdCard.html.join('\n')}</span>` },
      { text: 'Job Duties:', cssClass: 'job-duties', headerIcon: `<span>${this.faTasks.html.join('\n')}</span>` },
      { text: 'Experience and Education:', cssClass: 'experience-and-education',
        headerIcon: `<span>${this.faGraduationCap.html.join('\n')}</span>` },
      { text: 'Reports to:', cssClass: 'reports-to', headerIcon: `<span>${this.faUserAlt.html.join('\n')}</span>` },
      { text: 'Competencies:', cssClass: 'competencies', headerIcon: `<span>${this.faUniversity.html.join('\n')}</span>` }
    ];

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
      html = headerHtml + `<span class="description-content">${html.substring(section.text.length, html.length)}</span>`;

      // wrap in a span and append it to the html string being built up
      parsedJobDescriptionHtml += `<div class="${section.cssClass} description-container">${html}</div>`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(parsedJobDescriptionHtml);
  }
}
