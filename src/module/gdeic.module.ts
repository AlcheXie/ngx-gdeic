import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { Gdeic } from './service/gdeic.service';
import { GdeicCache } from './service/gdeic-cache.service';
import { GdeicConfig, GdeicConfigConfig } from './service/gdeic-config.service';
import { GdeicForm } from './service/gdeic-form.service';
import { GdeicRestful } from './service/gdeic-restful.service';

import { GdeicCommonEditGuard } from './service/route-guard/gdeic-common-edit-guard.service';
import { GdeicSysResource } from './service/restful-resource/gdeic-sys.resource';

import { GdeicArrayTextComponent } from './component/gdeic-array-text.component';
import { GdeicErrorComponent } from './component/gdeic-error.component';
import { GdeicHoldOnComponent } from './component/gdeic-hold-on.component';
import { GdeicTreeComponent } from './component/gdeic-tree.component';

import { GdeicPreventPropagationDirective } from './directive/gdeic-prevent-propagation.directive';

import { GdeicBoolPipe } from './pipe/gdeic-bool.pipe';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  providers: [
    Gdeic,
    GdeicCache,
    GdeicConfig,
    GdeicForm,
    GdeicRestful,
    GdeicCommonEditGuard,
    GdeicSysResource
  ],
  declarations: [
    GdeicArrayTextComponent,
    GdeicErrorComponent,
    GdeicHoldOnComponent,
    GdeicTreeComponent,
    GdeicPreventPropagationDirective,
    GdeicBoolPipe
  ],
  exports: [
    GdeicArrayTextComponent,
    GdeicErrorComponent,
    GdeicHoldOnComponent,
    GdeicTreeComponent,
    GdeicPreventPropagationDirective,
    GdeicBoolPipe
  ]
})
export class GdeicModule {
  static fooRoot(config: GdeicConfigConfig): ModuleWithProviders {
    return {
      ngModule: GdeicModule,
      providers: [
        { provide: GdeicConfigConfig, useValue: config }
      ]
    };
  }
}
