import { Component, OnInit } from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Edge} from "../../../../model/edge";
import {Store} from "@ngrx/store";
import {fromAppSelectedEdges, fromAppSelectedNodes} from "../../../../store/app.selectors";
import {Node} from "../../../../model/node";

@Component({
  selector: '[app-edge]',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.scss']
})
export class EdgeComponent implements OnInit {

  // edges$: Observable<Edge[]> = this.store.select(fromAppSelectedEdges);
  nodeSub!: Subscription;

  nodes: Node[] = [];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.nodeSub = this.store.select(fromAppSelectedNodes).subscribe(nodes => this.nodes = nodes);
  }

  public getPosition (){
    return '';
  }

  public getMarker(){
    return '';
  }

}
