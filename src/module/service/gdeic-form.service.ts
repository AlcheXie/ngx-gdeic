import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Gdeic } from './gdeic.service';

export const enum GdeicFormArrayType {
  Radio = 'RADIO',
  Select = 'SELECT',
  Checkbox = 'CHECKBOX',
  MultiSelect = 'MULTISELECT',
  Group = 'GROUP'
}

export interface GdeicFormArraySettings {
  defaultValue: any[];
  reference: any[];
  identification?: string;
}

@Injectable()
export class GdeicForm {
  static getControlsConfig(controlsConfig: { [name: string]: GdeicFormArraySettings | any },
    initialValues: { [name: string]: any }, fb?: FormBuilder): { [name: string]: any } {
    const resultControlsConfig = Gdeic.copy(controlsConfig);
    for (const key of Object.keys(controlsConfig)) {
      const _config = resultControlsConfig[key],
        _origin = controlsConfig[key],
        _value = initialValues[key];
      if (_origin !== undefined && _origin !== null) {
        if (_origin.constructor === Array) {
          if (_origin.length > 1) {
            const _ref = _config[1];
            if (!!_ref && _ref.constructor === Object) {
              if (!_ref.reference || _ref.reference.constructor !== Array) {
                throw new Error(`Missing reference array for properties '${key}'.`);
              }
              switch (_origin[0]) {
                case GdeicFormArrayType.Radio:
                case GdeicFormArrayType.Select:
                  if (_value) {
                    if (_ref.identification) {
                      const _result = _ref.reference.filter(x => x[_ref.identification] === _value[_ref.identification])[0];
                      resultControlsConfig[key] = _result ? [_result[_ref.identification]] : [null];
                    } else {
                      resultControlsConfig[key] = [_ref.reference.filter(x => x === _value)[0] || null];
                    }
                  } else {
                    resultControlsConfig[key] = [_ref.defaultValue];
                  }
                  break;
                case GdeicFormArrayType.Checkbox:
                  if (_ref === undefined || _ref.reference.constructor !== Array) { throw new Error('Missing reference array.'); }
                  let _aRef, _aIdx;
                  if (_ref.identification) {
                    _aRef = _ref.reference.map(x => x[_ref.identification]);
                    _aIdx = (_value || _ref.defaultValue).map(x => x[_ref.identification]).map(x => _aRef.indexOf(x)).filter(x => x > -1);
                  } else {
                    _aRef = _ref.reference;
                    _aIdx = (_value || _ref.defaultValue).map(x => _aRef.indexOf(x)).filter(x => x > -1);
                  }
                  resultControlsConfig[key] = new FormArray(_aRef.map((x, i) => fb.group({ checked: _aIdx.indexOf(i) > -1 })));
                  break;
                case GdeicFormArrayType.MultiSelect:
                  resultControlsConfig[key] = [(_value || _ref.defaultValue).map(x => _ref.identification ? x[_ref.identification] : x)];
                  break;
                case GdeicFormArrayType.Group:
                  // be improving
                  // value: [GdeicFormArrayType.Group, { defaultValue: any[], reference: any[]}]
                  break;
              }
              const _validator = _config[2];
              if (!!_validator) {
                resultControlsConfig[key].push(_validator);
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
        } else if (_origin.constructor === FormControl || _origin.constructor === FormGroup) {
          resultControlsConfig[key] = _config;
        } else {
          if (_value !== undefined && _value !== null) {
            if (_value.constructor === Array || _value.constructor === Object) {
              resultControlsConfig[key] = [_value];
            } else {
              resultControlsConfig[key] = _value;
            }
          }
        }
      } else {
        if (_value && (_value.constructor === Array || _value.constructor === Object)) {
          resultControlsConfig[key] = [_value];
        } else {
          resultControlsConfig[key] = _value;
        }
      }
    }
    return resultControlsConfig;
  }

  static getResultSimply(formGroupValue: { [name: string]: any }, valueTemplate: { [name: string]: any }): any {
    return Object.assign(valueTemplate, formGroupValue);
  }

  static getResultByConfig(formGroupValue: { [name: string]: any },
    valueTemplate: { [name: string]: any }, controlsConfig: { [name: string]: any }): any {
    const result = Gdeic.copy(valueTemplate);
    for (const key of Object.keys(controlsConfig)) {
      const _config = controlsConfig[key];
      if (_config !== undefined && _config !== null) {
        if (_config.constructor === Array) {
          if (_config.length > 1) {
            const _ref = _config[1];
            if (!!_ref && _ref.constructor === Object) {
              switch (_config[0]) {
                case GdeicFormArrayType.Radio:
                case GdeicFormArrayType.Select:
                  if (_ref.identification) {
                    result[key] = _ref.reference.filter(x => x[_ref.identification] === formGroupValue[key])[0];
                  } else {
                    result[key] = _ref.reference.filter(x => x === formGroupValue[key])[0];
                  }
                  break;
                case GdeicFormArrayType.Checkbox:
                  result[key] = formGroupValue[key].map((x, i) => x.checked ? i : -1).filter(x => x > -1).map(x => _ref.reference[x]);
                  break;
                case GdeicFormArrayType.MultiSelect:
                  result[key] = _ref.reference
                    .filter(x => formGroupValue[key].indexOf(_ref.identification ? x[_ref.identification] : x) > -1);
                  break;
                case GdeicFormArrayType.Group:
                  // be improving
                  break;
              }
            } else {
              result[key] = formGroupValue[key];
            }
          } else {
            result[key] = formGroupValue[key];
          }
        } else {
          const _formValue = formGroupValue[key];
          if (_formValue !== undefined && _formValue !== null) {
            result[key] = _formValue;
          } else {
            result[key] = _config;
          }
        }
      } else {
        result[key] = formGroupValue[key];
      }
    }
    return result;
  }

  static resetFormByValue(formGroup: FormGroup, formGroupValue: { [name: string]: any }): void {
    formGroupValue = formGroupValue || {};
    formGroupValue = Gdeic.copy(formGroupValue);
    for (const key of Object.keys(formGroupValue)) {
      if (formGroupValue[key] && formGroupValue[key].constructor && formGroupValue[key].constructor === Array) {
        formGroupValue[key] = Array.from(formGroupValue[key]);
      }
    }
    formGroup.reset(formGroupValue);
  }
}
