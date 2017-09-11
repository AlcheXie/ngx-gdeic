import { Injectable } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { Gdeic } from './gdeic.service';

export enum GdeicFormArrayType {
  Checkbox = -10000,
  Select = -9999
}

export interface GdeicFormArraySettings {
  defaultValue: any[];
  reference: any[];
  identification?: string;
}

@Injectable()
export class GdeicForm {
  static getControlsConfig(controlsConfig: { [name: string]: GdeicFormArraySettings | any },
    initialValues: { [name: string]: any }): { [name: string]: any } {
    controlsConfig = Gdeic.copy(controlsConfig);
    for (const key of Object.keys(controlsConfig)) {
      const _config = controlsConfig[key],
        _value = initialValues[key];
      if (_config !== undefined && _config !== null) {
        if (_config.constructor === Array) {
          if (_config.length > 1) {
            const _ref = _config[1];
            if (!!_ref && _ref.constructor === Object) {
              switch (_config[0]) {
                case GdeicFormArrayType.Checkbox:
                  if (_ref === undefined || _ref.reference.constructor !== Array) { throw new Error('Missing reference array.'); }
                  const _aRef = _ref.reference.map(x => Gdeic.toJson(x)),
                    _aIdx = (_value || _ref.defaultValue).map(x => Gdeic.toJson(x)).map(x => _aRef.indexOf(x)).filter(x => x > -1);
                  controlsConfig[key] = new FormArray(_aRef.map((x, i) => new FormControl(_aIdx.indexOf(i) > -1)));
                  break;
                case GdeicFormArrayType.Select:
                  if (_ref === undefined || _ref.reference.constructor !== Array) { throw new Error('Missing reference array.'); }
                  controlsConfig[key] = [(_value || _ref.defaultValue).map(x => x[_ref.identification])];
                  break;
              }
            } else {
              _config[0] = _value || _config[0];
            }
          } else {
            if (_value && (_value.constructor === Array || _value.constructor === Object)) {
              _config[0] = [_value];
            } else {
              _config[0] = _value || _config[0];
            }
          }
        } else {
          if (_value !== undefined && _value !== null) {
            if (_value.constructor === Array || _value.constructor === Object) {
              controlsConfig[key] = [_value];
            } else {
              controlsConfig[key] = _value;
            }
          }
        }
      } else {
        if (_value && (_value.constructor === Array || _value.constructor === Object)) {
          controlsConfig[key] = [_value];
        } else {
          controlsConfig[key] = _value;
        }
      }
    }
    return controlsConfig;
  }

  static getResultSimply(valueTemplate: { [name: string]: any }, formGroupValue: any): any {
    return Object.assign(valueTemplate, formGroupValue);
  }

  static getResultByConfig(valueTemplate: { [name: string]: any }, formGroupValue: any, controlsConfig: { [name: string]: any }): any {
    const result = Gdeic.copy(valueTemplate);
    for (const key of Object.keys(controlsConfig)) {
      const _config = controlsConfig[key];
      if (_config !== undefined && _config !== null) {
        if (_config.constructor === Array) {
          if (_config.length > 1) {
            const _ref = _config[1];
            if (!!_ref && _ref.constructor === Object) {
              switch (_config[0]) {
                case GdeicFormArrayType.Checkbox:
                  result[key] = formGroupValue[key].map((x, i) => x ? i : -1).filter(x => x > -1).map(x => _ref.reference[x]);
                  break;
                case GdeicFormArrayType.Select:
                  result[key] = _ref.reference.filter(x => formGroupValue[key].indexOf(x[_ref.identification]) > -1);
                  break;
              }
            } else {
              result[key] = formGroupValue[key];
            }
          } else {
            result[key] = formGroupValue[key];
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
