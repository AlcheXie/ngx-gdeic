import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { Gdeic } from './service/gdeic.service';
import { GdeicCache } from './service/gdeic-cache.service';
import { GdeicConfig, GdeicConfigConfig } from './service/gdeic-config.service';
import { GdeicExport } from './service/gdeic-export.service';
import { GdeicRestful } from './service/gdeic-restful.service';

import { GdeicCommonEditGuard } from './service/route-guard/gdeic-common-edit-guard.service';

import { GdeicSysAdResource } from './service/restful-resource/gedic-sys-ad.resource';
import { GdeicSysAccountResource } from './service/restful-resource/gdeic-sys-account.resource';
import { GdeicSysAdAccountResource } from './service/restful-resource/gdeic-sys-ad-account.resource';
import { GdeicSysInfoResource } from './service/restful-resource/gdeic-sys-info.resource';
import { GdeicSysMenuResource } from './service/restful-resource/gdeic-sys-menu.resource';
import { GdeicSysRoleResource } from './service/restful-resource/gdeic-sys-role.resource';

import { GdeicArrayTextComponent } from './component/gdeic-array-text.component';
import { GdeicErrorComponent } from './component/gdeic-error.component';
import { GdeicImageInputComponent } from './component/gdeic-image-input.component';
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
    GdeicImageInputComponent,
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
    GdeicImageInputComponent,
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
    GdeicCommonEditGuard,
    GdeicConfig,
    GdeicExport,
    GdeicRestful,
    GdeicSysAdResource,
    GdeicSysAccountResource,
    GdeicSysAdAccountResource,
    GdeicSysInfoResource,
    GdeicSysMenuResource,
    GdeicSysRoleResource
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
