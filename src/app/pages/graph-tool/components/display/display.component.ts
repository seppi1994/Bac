import {Component, OnInit} from '@angular/core';
import {Node} from "../../../../model/node";
import {fromAppSelectedEdges, fromAppSelectedNodes} from "../../../../store/app.selectors";
import {Store} from "@ngrx/store";
import {Edge} from "../../../../model/edge";
import {ArrowDirectionEnum} from "../../../../model/arrow-direction.enum";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  // nodes$: Observable<Node[]> = this.store.select(fromAppSelectedNodes);
  // edges$: Observable<Edge[]> = this.store.select(fromAppSelectedEdges);

  eArrowDirection = ArrowDirectionEnum;

  nodes: Node[] = [
    {id: 0, x: 500, y: 100},
    {id: 1, x: 200, y: 350},
    {id: 2, x: 300, y: 300},
    {id: 3, x: 500, y: 300}
  ];
  edges: Edge[] = [
    {source: this.nodes[0], target: this.nodes[1], left: false, right: true},
    {source: this.nodes[1], target: this.nodes[2], left: false, right: true},
    {source: this.nodes[0], target: this.nodes[3], left: false, right: true}
  ];

  constructor(private store: Store) {
  }

  ngOnInit(): void {
  }


}
