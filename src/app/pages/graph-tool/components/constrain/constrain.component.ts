import {Component, Input, OnInit} from '@angular/core';
import {Edge} from "../../../../shared/model/edge";
import * as GLOBALVARIABLES from "../../../../shared/global-variables";
import {ArrowDirectionEnum} from "../../../../shared/model/arrow-direction.enum";
import {Constrain} from "../../../../shared/model/constrain";

@Component({
  selector: '[app-constrain]',
  templateUrl: './constrain.component.html',
  styleUrls: ['./constrain.component.scss']
})
export class ConstrainComponent implements OnInit {

  @Input()
  constrains!: Constrain[];

  constructor() { }

  ngOnInit(): void {
  }

  public getPosition(edge: Edge): string{
    const deltaX = edge.target.x - edge.source.x;
    const deltaY = edge.target.y - edge.source.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normX = deltaX / dist;
    const normY = deltaY / dist;
    const sourcePadding = edge.left ? GLOBALVARIABLES.circleRadius + 5 : GLOBALVARIABLES.circleRadius;
    const targetPadding = edge.right ? GLOBALVARIABLES.circleRadius + 5 : GLOBALVARIABLES.circleRadius;
    const sourceX = edge.source.x + (normX);
    const sourceY = edge.source.y + (normY) - sourcePadding;
    const targetX = edge.target.x - (normX);
    const targetY = edge.target.y - (normY) - targetPadding;
    // if(edge.target.x > edge.source.x){
    //   return `M${sourceX},${sourceY}A${dist},${dist},0,0,1${targetX},${targetY}`;
    // }else {
    //   return `M${targetX},${targetY}A${dist},${dist},0,0,1${sourceX},${sourceY}`;
    // }
    return `M${targetX},${targetY}A${dist},${dist},0,0,1${sourceX},${sourceY}`;
    // return `M${sourceX},${sourceY}A${dist},${dist},0,0,1${targetX},${targetY}`;
  }

  public getTextX(edge: Edge){
    const deltaX = edge.target.x - edge.source.x;
    const deltaY = edge.target.y - edge.source.y
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return `${dist/2}px`;
  }

  public getMarker(edge: Edge): string{
    if (edge.right){
      return ArrowDirectionEnum.startArrow;
    }
    if (edge.left){
      return ArrowDirectionEnum.endArrow;
    }
    return '';
  }
}
