import { Injectable } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { Gdeic } from './gdeic.service';

export enum GdeicFormConfig {
  FormGroup,
  FormArray,
  FormControl
}

@Injectable()
export class GdeicForm {
  static getControlsConfig(controlsConfig: { [name: string]: any }, initialValues: { [name: string]: any }): { [name: string]: any } {
    controlsConfig = Gdeic.copy(controlsConfig);
    for (const key of Object.keys(controlsConfig)) {
      const _config = controlsConfig[key],
        _value = initialValues[key];
      if (_config !== undefined && _config !== null) {
        if (_config.constructor === Array) {
          switch (_config[0]) {
            case GdeicFormConfig.FormArray:
              if (_config[1].constructor !== Array) {
                throw new Error('Missing reference array.');
              }
              const _aRef = _config[1][1].map(x => Gdeic.toJson(x)),
                _aIdx = (_value || []).map(x => Gdeic.toJson(x)).map(x => _aRef.indexOf(x)).filter(x => x > -1);
              controlsConfig[key] = new FormArray(_aRef.map((x, i) => new FormControl(_aIdx.indexOf(i) > -1)));
              break;
            case GdeicFormConfig.FormControl:
              controlsConfig[key] = _config[1];
              break;
            default:
              _config[0] = _value || _config[0];
              break;
          }
        } else {
          if (_value !== undefined && _value !== null) {
            controlsConfig[key] = _value;
          }
        }
      } else {
        controlsConfig[key] = _value;
      }
    }
    return controlsConfig;
  }

  static getResultSimply(valueTemplate: { [name: string]: any }, formGroupValue: any) {
    return Object.assign(valueTemplate, formGroupValue);
  }

  static getResultByConfig(valueTemplate: { [name: string]: any }, formGroupValue: any, controlsConfig: { [name: string]: any }) {
    const result = Gdeic.copy(valueTemplate);
    for (const key of Object.keys(controlsConfig)) {
      const _config = controlsConfig[key];
      if (_config !== undefined && _config !== null) {
        if (_config.constructor === Array) {
          switch (_config[0]) {
            case GdeicFormConfig.FormArray:
              result[key] = formGroupValue[key].map((x, i) => x ? i : -1).filter(x => x > -1).map(x => _config[1][1][x]);
              break;
            case GdeicFormConfig.FormControl:
            default:
              result[key] = formGroupValue[key];
              break;
          }
        } else {
          result[key] = formGroupValue[key];
        }
      } else {
        result[key] = formGroupValue[key];
      }
    }
    return result;
  }
}
