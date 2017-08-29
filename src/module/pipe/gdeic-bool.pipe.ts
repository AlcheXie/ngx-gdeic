import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'gdeicBool' })
export class GdeicBoolPipe implements PipeTransform {
  transform(value: boolean, rule: string = 'true|false'): string {
    const _rules = rule.split('|');
    return value === true ? _rules[0].trimAll() : _rules[1].trimAll();
  }
}
