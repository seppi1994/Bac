import {Component, Input, OnInit} from '@angular/core';
import {Edge} from "../../../../shared/model/edge";
import * as GLOBALVARIABLES from "../../../../shared/global-variables";
import {ArrowDirectionEnum} from "../../../../shared/model/arrow-direction.enum";
import {Constrain} from "../../../../shared/model/constrain";
import {elementClicked} from "../../../../store/app.actions";
import {Store} from "@ngrx/store";
import {fromAppFocusElement} from "../../../../store/app.selectors";
import {Subscription} from "rxjs";

@Component({
  selector: '[app-constrain]',
  templateUrl: './constrain.component.html',
  styleUrls: ['./constrain.component.scss']
})
export class ConstrainComponent implements OnInit {

  @Input()
  constrains!: Constrain[];
  @Input()
  public editable!: boolean;

  private focusElementSub!: Subscription;

  public focus: number | undefined = undefined;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.focusElementSub = this.store.select(fromAppFocusElement)
      .subscribe((id: number) => {
        this.focus = id;
      });
  }

  public getPosition(edge: Edge): string {
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

  public getSelfPosition(edge: Edge) {

  }

  public getTextX(edge: Edge) {
    const deltaX = edge.target.x - edge.source.x;
    const deltaY = edge.target.y - edge.source.y
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return `${dist / 2}px`;
  }

  public getMarker(edge: Edge): string {
    if (edge.left){
      if(edge.id === this.focus){
        return ArrowDirectionEnum.endArrow + '-focus'
      }
      return ArrowDirectionEnum.endArrow;
    }
    if (edge.right){
      if(edge.id === this.focus){
        return ArrowDirectionEnum.startArrow + '-focus'
      }
      return ArrowDirectionEnum.startArrow;
    }
    return '';
  }

  public getTextSelf(){
    return `56`;
    // return `100`;
  }


  public getSelfEdge(edge: Edge) {
    const offset = Math.sqrt((Math.pow(GLOBALVARIABLES.circleRadius,2)/2))
    const arrowLength = 6
    const x1 = edge.source.x + offset
    const y1 = edge.source.y - offset
    const y2 = edge.target.y - offset - arrowLength
    const x2 = edge.target.x - offset

    // Change sweep to change orientation of loop.
    const sweep = 1; // 1 or 0

    // Fiddle with this angle to get loop oriented.
    const xRotation = 90;

    // Needs to be 1.
    const largeArc = 1;

    // Make drx and dry different to get an ellipse
    // instead of a circle.
    const drx = 32;
    const dry = 24;

    return "M" + x2 + "," + y2 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x1 + "," + y1;
  }

  clicked(id: number){
    this.store.dispatch(elementClicked({id: id}));
    this.focus = id;
  }

  changeConstrainValue(value: string, id: number){
    this.constrains.forEach(constrain => {
      if(constrain.id === id){
        if(!Number.isNaN(Number(value))){
          constrain.constrain = Number(value);
        }else {
          constrain.constrain = value;
        }
        console.log(typeof constrain.constrain)
      }
    })
  }

  test(any: any){
    console.log(any)
    // console.log(any.offsetLeft)
    // console.log(any.offsetTop)
    return -19
  }

  getInputX(edge: Edge){
    if(edge.source.x > edge.target.x){
      return edge.source.x - ((edge.source.x - edge.target.x)/2)
    }else if(edge.source.x === edge.target.x){
      return edge.source.x
    }else {
      return edge.target.x - ((edge.target.x - edge.source.x)/2)
    }
  }

  getInputY(edge: Edge){
    if(edge.source.y > edge.target.y){

      return edge.target.y - ((edge.target.y - edge.source.y)/2)
    }else if(edge.source.y === edge.target.y){
      return edge.source.y
    }else {
      return edge.source.y -  ((edge.source.y - edge.target.y)/2)
    }
  }
}
