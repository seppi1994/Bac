import { Component, OnInit, HostListener } from '@angular/core';
import {Observable} from "rxjs";
import {Node} from "../../../../model/node";
import {fromAppSelectedEdges, fromAppSelectedNodes} from "../../../../store/app.selectors";
import {Store} from "@ngrx/store";
import {Edge} from "../../../../model/edge";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  // nodes$: Observable<Node[]> = this.store.select(fromAppSelectedNodes);
  // edges$: Observable<Edge[]> = this.store.select(fromAppSelectedEdges);

  nodes: Node[] = [
    {id: 0, x: 500, y: 100},
    {id: 1, x: 200, y: 350},
    {id: 2, x: 300, y: 300},
    {id: 3, x: 500, y: 300}
  ];
  edges: Edge[] = []

  constructor(private store: Store) { }

  ngOnInit(): void {
  }


}
