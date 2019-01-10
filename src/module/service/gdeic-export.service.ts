import { Injectable } from '@angular/core';
import { isNumber } from 'util';

export interface GdeicColumn {
  name: string;
  span?: number;
  direction?: 'row' | 'col';
}

@Injectable()
export class GdeicExport {
  exportExcel(
    fileName: string,
    data: { [name: string]: any }[],
    titles: (string | GdeicColumn)[] | (string | GdeicColumn)[][],
    columns: string[]) {
    if (data.constructor !== Array) {
      throw new Error('JsonData must be Array.');
    }

    let _titles: any = titles,
      excel = '<table style="text-align: center">';

    if (titles.length > 0) {
      const _first = titles[0];
      if (_first.constructor !== Array) {
        _titles = [titles];
      }

      for (const row of _titles) {
        let _row = '<tr>';
        for (const col of row) {
          if (typeof col === 'string') {
            _row += `<th>${col}</th>`;
          } else {
            _row += `<th ${isNumber(col.span) ? `${col.direction === 'row'
              ? 'row' : 'col'}span="${col.span}"` : ''}>${col.name}</th>`;
          }
        }
        _row += '</tr>';
        excel += _row;
      }
    }

    for (const item of data) {
      let _row = '<tr>';
      for (const column of columns) {
        _row += `<td style="text-align: center">${item[column]}</td>`;
      }
      _row += '</td>';
      excel += _row;
    }

    excel += '</table>';

    let excelFile = '<html xmlns:o="urn:schemas-microsoft-com:office:office" '
      + 'xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http:// www.w3.org/TR/REC-html40">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += '<head>';
    excelFile += '<!--[if gte mso 9]>';
    excelFile += '<xml>';
    excelFile += '<x:ExcelWorkbook>';
    excelFile += '<x:ExcelWorksheets>';
    excelFile += '<x:ExcelWorksheet>';
    excelFile += '<x:Name>';
    excelFile += '{worksheet}';
    excelFile += '</x:Name>';
    excelFile += '<x:WorksheetOptions>';
    excelFile += '<x:DisplayGridlines/>';
    excelFile += '</x:WorksheetOptions>';
    excelFile += '</x:ExcelWorksheet>';
    excelFile += '</x:ExcelWorksheets>';
    excelFile += '</x:ExcelWorkbook>';
    excelFile += '</xml>';
    excelFile += '<![endif]-->';
    excelFile += '</head>';
    excelFile += '<body>';
    excelFile += excel;
    excelFile += '</body>';
    excelFile += '</html>';

    this._export(`data:application/vnd.ms-excel;charset=utf-8,${encodeURIComponent(excelFile)}`, fileName, 'xls');
  }

  private _export(uri: string, fileName: string, format: string) {
    const link = document.createElement('a');
    link.href = uri;
    link.download = `${fileName}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
