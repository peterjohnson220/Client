import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { Workflow } from '../constants/workflow';

@Injectable()
export class UrlService {
  readonly appName = 'structures/';

  constructor(
    private location: Location
  ) {}

  isInWorkflow(workflow: Workflow) {
    return this.getUrl().includes(workflow);
  }

  removeWorkflow(workflow: Workflow): void {
    if (this.isInWorkflow(workflow)) {
      this.location.replaceState(this.getUrl().replace(workflow, ''));
    }
  }

  removeAllWorkflows(): void {
    Object.keys(Workflow).map(x => Workflow[x]).forEach((w) => this.removeWorkflow(w));
  }

  private getUrl(): string {
    const pathName = window.location.pathname;
    return pathName.substring(pathName.indexOf(this.appName) + this.appName.length, pathName.length);
  }
}
