import {
  AfterViewInit, Component, ContentChild, ElementRef,
  EventEmitter, Input, Output
} from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'gdeic-image-input',
  template: `<ng-template *ngTemplateOutlet="inputview">`
})
export class GdeicImageInputComponent implements AfterViewInit {
  @Input() data: { file: File, src: string }[];
  @Input() maxFileLength = 0;
  @Output() gdeicFileLengthError = new EventEmitter<any>();
  @ContentChild('inputview') inputview;

  private _ref;
  private selectedImage: { file: File, src: string };
  private _inputElem: HTMLInputElement;
  private _itemElems: HTMLImageElement[];
  private _itemElemSubscription: Subscription;
  private _itemRemoveElems: HTMLElement[];
  private _itemRemoveSubscription: Subscription;
  private _previewElem: HTMLImageElement;
  private _previewRemoveElem: HTMLElement[];

  constructor(private _elementRef: ElementRef) {
    this._ref = this._elementRef.nativeElement;
  }

  ngAfterViewInit() {
    this._inputElem = this._ref.querySelectorAll('[gdeicImageInput]')[0];
    this._previewElem = this._ref.querySelectorAll('[gdeicImagePreview]')[0];
    this._previewRemoveElem = this._ref.querySelectorAll('[gdeicImagePreviewRemove]')[0];

    fromEvent(this._inputElem, 'change')
      .subscribe(x => {
        const _files = (<HTMLInputElement>x.target).files;
        if (this.maxFileLength > 0 && _files.length + this.data.length > this.maxFileLength) {
          console.warn('Number of files is over the max length.');
          this.gdeicFileLengthError.emit();
          return;
        }

        for (const _file of Array.from(_files)) {
          const reader = new FileReader();
          reader.readAsDataURL(_file);
          reader.onload = () => {
            this.data.push({
              file: _file,
              src: <string>reader.result
            });
            setTimeout(() => this._rebindImgEvent());
          };
        }
      });

    if (!!this._previewRemoveElem) {
      fromEvent(this._previewRemoveElem, 'click')
        .subscribe(() => {
          this.data.splice(this.data.indexOf(this.selectedImage), 1);
          setTimeout(() => this._rebindImgEvent());
        });
    }
  }

  private _rebindImgEvent() {
    if (!!this._itemElemSubscription) {
      this._itemElemSubscription.unsubscribe();
    }
    if (!!this._itemRemoveSubscription) {
      this._itemRemoveSubscription.unsubscribe();
    }

    this._itemElems = this._ref.querySelectorAll('[gdeicImageItem]');
    if (this._itemElems.length > 0) {
      this._itemElemSubscription = fromEvent(this._itemElems, 'click')
        .subscribe(x => {
          this.selectedImage = this.data[Array.from(this._itemElems).indexOf(<HTMLImageElement>x.target)];
          this._previewElem.src = this.selectedImage.src;
        });
    }

    this._itemRemoveElems = this._ref.querySelectorAll('[gdeicImageItemRemove]');
    if (this._itemRemoveElems.length > 0) {
      this._itemRemoveSubscription = fromEvent(this._itemRemoveElems, 'click')
        .subscribe(x => {
          this.data.splice(Array.from(this._itemRemoveElems).indexOf(<HTMLHtmlElement>x.target), 1);
          setTimeout(() => this._rebindImgEvent());
        });
    }
  }
}
