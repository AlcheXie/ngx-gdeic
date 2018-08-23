import { Component, ContentChild, Input } from '@angular/core';

@Component({
  selector: 'gdeic-tree',
  template: `
    <ng-template [ngIf]="tree">
      <ng-template #gdeicTreeBody let-tree>
        <ng-template *ngTemplateOutlet="treeview; context: {$implicit: tree}"></ng-template>
        <div [style.margin-left]="gdeicIndent + 'px'" [hidden]="!tree.$$isExpand && gdeicHasTrigger">
          <ng-template ngFor let-tree [ngForOf]="tree[gdeicChildName]">
            <ng-template *ngTemplateOutlet="gdeicTreeBody; context: {$implicit: tree}"></ng-template>
          </ng-template>
        </div>
      </ng-template>
      <ng-template *ngTemplateOutlet="gdeicTreeBody; context: {$implicit: tree}"></ng-template>
    </ng-template>
    `
})
export class GdeicTreeComponent {
  @Input()
  set gdeicTree(value: { [name: string]: any }) {
    this.tree = value;
  }
  @Input() gdeicChildName: string;
  @Input() gdeicHasTrigger = false;
  @Input() gdeicIndent = 30;
  @ContentChild('treeview') treeview;

  tree: { [name: string]: any };
}
