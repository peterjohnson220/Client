import { Injectable } from '@angular/core';

@Injectable()
export class DragulaHelperService {

  constructor() {
  }

  static getDropModel(value: any) {
    return {
      name: value.name,
      element: value.el,
      target: value.target,
      source: value.source,
    };
  }

  static getDragModel(value: any) {
    return {
      name: value.name,
      element: value.el,
      source: value.source
    };
  }

  static removeDroppedElement(dropModel: any) {
    dropModel.target.removeChild(dropModel.element);
  }

  static getReorderSourceAndTargetIndex(dropModel: any) {
    return {
      sourceIndex: dropModel.sourceIndex,
      targetIndex: dropModel.targetIndex
    };
  }

  static templatePageReorder(dropModel: any, targetIndex) {
    const sourceIndex = +dropModel.element.dataset.index;

    return {
      sourceIndex,
      targetIndex
    };
  }
}
