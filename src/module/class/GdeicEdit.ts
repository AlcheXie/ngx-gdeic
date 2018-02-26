import { Gdeic } from '../service/gdeic.service';
import { GDEIC_RESTFUL } from '../service/gdeic-restful.service';

export class GdeicEdit {
  private _source: any[];

  constructor(source: any | any[]) {
    if (source.constructor === Array) {
      this._source = Gdeic.copy(source);
    } else {
      this._source = Gdeic.copy([source]);
    }
  }

  static make(source: any | any[]): GdeicEdit {
    return new GdeicEdit(source);
  }

  fire(method: Function): Promise<any[]> {
    return Promise.all(this._source.map(x => Promise.resolve(method(x))));
  }

  fireAction(action: Function, params?: { [name: string]: string } | true): Promise<any[]> {
    let _data;
    if (params !== true) {
      _data = this._source.map(x => {
        const _obj = Gdeic.copy(params);
        for (const key of Object.keys(_obj)) {
          _obj[key] = x[_obj[key].substr(1)];
        }
        return _obj;
      });
    } else {
      _data = this._source;
    }
    return Promise.all(_data.map(x => window[GDEIC_RESTFUL].getPromise(action(x), true)));
  }
}
