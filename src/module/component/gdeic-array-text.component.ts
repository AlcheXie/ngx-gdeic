import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gdeic-array-text',
  template: `<span>{{showText}}</span>`
})
export class GdeicArrayTextComponent implements OnInit {
  @Input()
  set gdeicSource(value: { [name: string]: any }[]) {
    this._source = value;
  }
  @Input()
  set gdeicProperty(value: string) {
    this._property = value;
  }
  @Input()
  set gdeicSplitOf(value: string) {
    this._splitOf = value;
  }

  showText: string;
  private _source: { [name: string]: any }[];
  private _property = '';
  private _splitOf: string;

  ngOnInit() {
    if (this._property !== '') {
      const _sProperty = this._property.split('.').map(x => `['${x}']`).join('');
      this.showText = this._source.map(x => eval(`x${_sProperty}`)).join(this._splitOf || ', ');
    }
  }
}
