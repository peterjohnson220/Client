import { ContentChild, Directive, DoCheck, ElementRef, Input, Renderer2 } from '@angular/core';
import { FormControlName } from '@angular/forms';
import {PermissionService} from '../../core/services';

@Directive({
  selector: '[pfSecuredResource]'
})
export class PfSecuredResourceDirective implements DoCheck {
  private permissionToAuthorize: string | string[];
  private _PermissionsService: PermissionService;
  @ContentChild(FormControlName) control: FormControlName;

  @Input() set pfSecuredResource(permissionToAuthorize: string | string[]) {
    this.permissionToAuthorize = permissionToAuthorize;
  }

  constructor(private permissionService: PermissionService, private _el: ElementRef, private _renderer: Renderer2) {
    this._PermissionsService = permissionService;
  }

  ngDoCheck(): void {
    let isAuthorized = false;

    if (typeof this.permissionToAuthorize === 'string') {
      isAuthorized = this.doAuthorize(this.permissionToAuthorize);
    } else {
      isAuthorized = this.doAuthorizeAll(this.permissionToAuthorize);
    }

    this.addRemoveInvalidClassOnAuth(isAuthorized);
  }

  doAuthorize(permissionToAuthorize: string): boolean {
    return this._PermissionsService.HasPermission(permissionToAuthorize);
  }

  doAuthorizeAll(permissionsToAuthorize: string[]): boolean {
    return this._PermissionsService.HasAnyPermission(permissionsToAuthorize);
  }

  addRemoveInvalidClassOnAuth(isAuthorized: boolean): void {
    if (!isAuthorized) {
      this._renderer.removeChild(this._el.nativeElement.parentNode, this._el.nativeElement);
    }
  }
}
