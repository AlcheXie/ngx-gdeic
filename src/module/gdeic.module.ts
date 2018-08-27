import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { Gdeic } from './service/gdeic.service';
import { GdeicCache } from './service/gdeic-cache.service';
import { GdeicConfig, GdeicConfigConfig } from './service/gdeic-config.service';
import { GdeicRestful } from './service/gdeic-restful.service';

import { GdeicCommonEditGuard } from './service/route-guard/gdeic-common-edit-guard.service';
import { GdeicSysResource } from './service/restful-resource/gdeic-sys.resource';

import { GdeicArrayTextComponent } from './component/gdeic-array-text.component';
import { GdeicErrorComponent } from './component/gdeic-error.component';
import { GdeicHoldOnComponent } from './component/gdeic-hold-on.component';
import { GdeicLoadingComponent } from './component/gdeic-loading.component';
import { GdeicTreeComponent } from './component/gdeic-tree.component';

import { GdeicPreventPropagationDirective } from './directive/gdeic-prevent-propagation.directive';
import { GdeicSlideUpDirective } from './directive/gdeic-slide-up.directive';

import { GdeicBoolPipe } from './pipe/gdeic-bool.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GdeicArrayTextComponent,
    GdeicErrorComponent,
    GdeicHoldOnComponent,
    GdeicLoadingComponent,
    GdeicTreeComponent,
    GdeicPreventPropagationDirective,
    GdeicSlideUpDirective,
    GdeicBoolPipe
  ],
  exports: [
    GdeicArrayTextComponent,
    GdeicErrorComponent,
    GdeicHoldOnComponent,
    GdeicLoadingComponent,
    GdeicTreeComponent,
    GdeicPreventPropagationDirective,
    GdeicSlideUpDirective,
    GdeicBoolPipe
  ]
})
export class GdeicCommonModule { }

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    GdeicCommonModule
  ],
  providers: [
    Gdeic,
    GdeicCache,
    GdeicConfig,
    GdeicCommonEditGuard,
    GdeicRestful,
    GdeicSysResource
  ],
  exports: [
    GdeicCommonModule
  ]
})
export class GdeicModule {
  static forRoot(config: GdeicConfigConfig): ModuleWithProviders {
    return {
      ngModule: GdeicModule,
      providers: [
        { provide: GdeicConfigConfig, useValue: config }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: GdeicModule) {
    if (parentModule) {
      throw new Error(
        'GdeicModule is already loaded. Import it in the AppModule only');
    }
  }
}
