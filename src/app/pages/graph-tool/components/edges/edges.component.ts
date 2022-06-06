import {Component, Input, OnInit} from '@angular/core';
import {Edge} from "../../../../shared/model/edge";
import {Node} from "../../../../shared/model/node";
import {ArrowDirectionEnum} from "../../../../shared/model/arrow-direction.enum";
import * as GLOBALVARIABLES from "../../../../shared/global-variables"
import {elementClicked} from "../../../../store/app.actions";
import {Store} from "@ngrx/store";
import {fromAppFocusElement} from "../../../../store/app.selectors";
import {Subscription} from "rxjs";


@Component({
  selector: '[app-edges]',
  templateUrl: './edges.component.html',
  styleUrls: ['./edges.component.scss']
})
export class EdgesComponent implements OnInit {

  @Input()
  public edges!: Edge[];

  nodes: Node[] = [];

  private focusElementSub!: Subscription;


  public focus: number | undefined = undefined;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.focusElementSub = this.store.select(fromAppFocusElement)
      .subscribe((id: number) => {
        this.focus = id;
      });
  }

  public getPosition(edge: Edge): string{
    const deltaX = edge.target.x - edge.source.x;
    const deltaY = edge.target.y - edge.source.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normX = deltaX / dist;
    const normY = deltaY / dist;
    const sourcePadding = edge.left ? GLOBALVARIABLES.circleRadius + 5 : GLOBALVARIABLES.circleRadius;
    const targetPadding = edge.right ? GLOBALVARIABLES.circleRadius + 5 : GLOBALVARIABLES.circleRadius;
    const sourceX = edge.source.x + (sourcePadding * normX);
    const sourceY = edge.source.y + (sourcePadding * normY);
    const targetX = edge.target.x - (targetPadding * normX);
    const targetY = edge.target.y - (targetPadding * normY);

    return `M${sourceX},${sourceY}L${targetX},${targetY}`;
  }

  public getMarker(edge: Edge): string{
    if (edge.right){
      if(edge.id === this.focus){
        return ArrowDirectionEnum.endArrow + '-focus'
      }
      return ArrowDirectionEnum.endArrow;
    }
    if (edge.left){
      if(edge.id === this.focus){
        return ArrowDirectionEnum.startArrow + '-focus'
      }
      return ArrowDirectionEnum.startArrow;
    }
    return '';
  }

  clicked(id: number){
    this.store.dispatch(elementClicked({id: id}));
    this.focus = id;
  }

}
