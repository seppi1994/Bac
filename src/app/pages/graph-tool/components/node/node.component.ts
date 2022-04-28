import {AfterContentInit, Component, Input, OnInit, HostListener, AfterViewInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Node} from "../../../../model/node";
import {
  select, drag, Selection, D3DragEvent
} from 'd3';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, AfterViewInit {

  // nodes$: Observable<Node[]> = this.store.select(fromAppSelectedNodes);

  circle!:Selection<Element, any, any, any>;
  @Input()
  public node!: Node;

  constructor(private store: Store,
              private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {


    console.log(this.node)
  }


  ngAfterViewInit() {
    this.circle = select('#node' + this.node.id);
    // let circle = select('#node' + this.node.id)
      // .call(drag()
      //   .on('start', this.dragStart)
      //   .on('drag', (event, d: any) => {
      //     d.x = event.x;
      //     d.y = event.y;
      //     this.restart()
      //   })
      //   .on('end', this.dragEnd)
      // )
      // .on('dblclick', (event) => {
      //
      // })
    this.circle.call(drag()
      .on('start', this.dragStart)
      .on('drag', (event) => {
        console.log(event)
        console.log(this.node.id)
        this.node.x = event.x;
        this.node.y = event.y;
        // this.node.x = event.x;
        // this.node.y = event.y;
        // console.log('x: ' , event.x)
        // console.log('y: ', event.y)
        // this.changeDetectorRefs.detectChanges();
      })
      .on('end', this.dragEnd));
    // console.log(circle)
  }

  dragStart() {

    console.log("test")
  }

  // dragging(event: D3DragEvent<any, any, any>, d: Node) {
  //   d.x = event.x;
  //   d.y = event.y;
  // }

  dragEnd() {

  }


}
