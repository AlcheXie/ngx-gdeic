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
  set gdeicProperties(value: string[]) {
    this._properties = value;
  }
  @Input()
  set gdeicSplitOf(value: string) {
    this._splitOf = value;
  }

  showText: string;
  private _source: { [name: string]: any }[];
  private _property = '';
  private _properties: string[];
  private _splitOf: string;

  ngOnInit() {
    let _properties: string[];
    if (this._property !== '') {
      _properties = [this._property];
    } else if (!!this._properties) {
      _properties = this._properties;
    }

    if (!!_properties) {
      this.showText = this._source.map(x => {
        let result;
        for (const s of _properties) {
          result = !result ? x[s] : result[s];
        }
        return result;
      })
        .join(this._splitOf || ', ');
    }
  }
}
