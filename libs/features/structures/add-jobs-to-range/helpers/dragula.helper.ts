import { DragulaService } from 'ng2-dragula';

import { GradeJob } from '../models';

export function disableJobsDragging(dragulaService: DragulaService) {
  dragulaService.createGroup('jobs-grade-bag', {
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

export function enableJobsDragging(dragulaService: DragulaService) {
  dragulaService.createGroup('jobs-grade-bag', {
    revertOnSpill: true,
    moves: function (el) {
      return el.classList.contains('draggable');
    },
    accepts: function (el, target) {
      return !target.classList.contains('jobs-source');
    },
    copy: true,
    copyItem: (item: GradeJob) => ({ ...item })
  });
}

export function cleanupDatacutsDragging(dragulaService: DragulaService) {
  dragulaService.destroy('jobs-grade-bag');
}
