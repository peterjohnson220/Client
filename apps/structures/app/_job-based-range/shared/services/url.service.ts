import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable()
export class UrlService {
  readonly appName = 'structures/';
  readonly newStructureWorkflowIdentifier = '/new';

  constructor(
    private location: Location
  ) {}

  isInNewStructureWorkflow(): boolean {
    return this.getUrl().includes(this.newStructureWorkflowIdentifier);
  }

  removeNewStructureWorkflow(): void {
    if (this.isInNewStructureWorkflow()) {
      this.location.replaceState(this.getUrl().replace(this.newStructureWorkflowIdentifier, ''));
    }
  }

  private getUrl(): string {
    const pathName = window.location.pathname;
    return pathName.substring(pathName.indexOf(this.appName) + this.appName.length, pathName.length);
  }
}
