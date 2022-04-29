import {Component, Input, OnInit, AfterViewInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Node} from "../../../../model/node";
import {
  select, drag, Selection
} from 'd3';

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, AfterViewInit {

  circle!:Selection<any, any, any, any>;
  @Input()
  public node!: Node;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.circle = select('#node' + this.node.id);
    this.circle = this.circle.data<Node>([this.node]);

    this.circle.call(drag()
      .on('start', this.dragStart)
      .on('drag', (event) => {
        this.node.x = event.sourceEvent.offsetX;
        this.node.y = event.sourceEvent.offsetY;
      })
      .on('end', this.dragEnd));
  }

  dragStart() {
  }

  dragEnd() {
  }
}
