import { DragulaService } from 'ng2-dragula';

import { DataCut } from '../models';

export function disableDatacutsDragging(dragulaService: DragulaService) {
  dragulaService.createGroup('data-cuts-bag', {
    moves: function () {
      // nothing moves
      return false;
    },
    invalid: function () {
      // everything is invalid
      return true;
    }
  });
}

export function enableDatacutsDragging(dragulaService: DragulaService) {
  dragulaService.createGroup('data-cuts-bag', {
    revertOnSpill: true,
    moves: function (el) {
      return el.classList.contains('draggable');
    },
    accepts: function (el, target) {
      return !target.classList.contains('data-cuts-source');
    },
    copy: true,
    copyItem: (item: DataCut) => ({ ...item })
  });
}
