import {Component, Input, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Edge} from "../../../../model/edge";
import {Store} from "@ngrx/store";
import {fromAppSelectedEdges, fromAppSelectedNodes} from "../../../../store/app.selectors";
import {Node} from "../../../../model/node";
import {ArrowDirectionEnum} from "../../../../model/arrow-direction.enum";

@Component({
  selector: '[app-edges]',
  templateUrl: './edges.component.html',
  styleUrls: ['./edges.component.scss']
})
export class EdgesComponent implements OnInit {

  @Input()
  public edges!: Edge[];

  nodes: Node[] = [];

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  public getPosition(edge: Edge): string{
    const deltaX = edge.target.x - edge.source.x;
    const deltaY = edge.target.y - edge.source.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normX = deltaX / dist;
    const normY = deltaY / dist;
    const sourcePadding = edge.left ? 17 : 12;
    const targetPadding = edge.right ? 17 : 12;
    const sourceX = edge.source.x + (sourcePadding * normX);
    const sourceY = edge.source.y + (sourcePadding * normY);
    const targetX = edge.target.x - (targetPadding * normX);
    const targetY = edge.target.y - (targetPadding * normY);

    return `M${sourceX},${sourceY}L${targetX},${targetY}`;
  }

  public getMarker(edge: Edge): string{
    if (edge.right){
      return ArrowDirectionEnum.endArrow;
    }
    if (edge.left){
      return ArrowDirectionEnum.startArrow;
    }
    return '';
  }

}
