import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { Gdeic } from './service/gdeic.service';
import { GdeicCache } from './service/gdeic-cache.service';
import { GdeicConfig, GdeicConfigConfig } from './service/gdeic-config.service';
import { GdeicRestful } from './service/gdeic-restful.service';

import { GdeicCommonEditGuard } from './service/route-guard/gdeic-common-edit-guard.service';
import { GdeicSysResource } from './service/restful-resource/gdeic-sys.resource';

import { PreventPropagationDirective } from './directive/prevent-propagation.directive';

@NgModule({
    imports: [
        CommonModule,
        HttpModule
    ],
    providers: [
        Gdeic,
        GdeicCache,
        GdeicConfig,
        GdeicRestful,
        GdeicCommonEditGuard,
        GdeicSysResource
    ],
    declarations: [PreventPropagationDirective],
    exports: [PreventPropagationDirective]
})
export class GdeicModule {
    static fooRoot(config: GdeicConfigConfig): ModuleWithProviders {
        return {
            ngModule: GdeicModule,
            providers: [
                { provide: GdeicConfigConfig, useValue: config }
            ]
        }
    }
}