import { New$MODELNAME$Component } from './new-$MODELFILENAME$/new-$MODELFILENAME$.component';
import { Edit$MODELNAME$Component } from './edit-$MODELFILENAME$/edit-$MODELFILENAME$.component';
import { Show$MODELNAME$Component } from './show-$MODELFILENAME$/show-$MODELFILENAME$.component';
import { Index$MODELNAME$Component } from './index-$MODELFILENAME$/index-$MODELFILENAME$.component';
import { Routes } from '@angular/router';

const $MODELFILENAME$Routes: Routes = [{
  path: '$TABLE_NAME$/new',
  component: New$MODELNAME$Component,
  data: { title: 'New $MODELNAME$' },
}, {
  path: '$TABLE_NAME$',
  component: Index$MODELNAME$Component,
  data: { title: 'Index $MODELNAME$' },
}, {
  path: '$TABLE_NAME$/:id',
  component: Show$MODELNAME$Component,
  data: { title: 'Show $MODELNAME$' },
}, {
  path: '$TABLE_NAME$/:id/edit',
  component: Edit$MODELNAME$Component,
  data: { title: 'Edit $MODELNAME$' },
}];

export { $MODELFILENAME$Routes };
