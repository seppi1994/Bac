import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {drag, select, Selection} from "d3";
import * as GLOBALVARIABLES from "../../../../../shared/global-variables";
import {EndNode} from "../../../../../shared/model/end-node";
import {elementClicked} from "../../../../../store/app.actions";
import {Store} from "@ngrx/store";
import {fromAppFocusElement} from "../../../../../store/app.selectors";
import {Subscription} from "rxjs";

@Component({
  selector: '[app-end-node]',
  templateUrl: './end-node.component.html',
  styleUrls: ['./end-node.component.scss']
})
export class EndNodeComponent implements OnInit {
  circle!:Selection<any, any, any, any>;

  @Input()
  public endNode!: EndNode;

  public focus: boolean = false;

  private focusElementSub!: Subscription;

  @Output()
  onDoubleClick = new EventEmitter<any>();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.focusElementSub = this.store.select(fromAppFocusElement)
      .subscribe((nodeId: number) => {
        if(nodeId !== this.endNode.id){
          this.focus = false;
        }
      });
  }


  ngAfterViewInit() {
    this.circle = select('#end-node' + this.endNode.id);
    this.circle = this.circle.data<EndNode>([this.endNode]);
    this.circle.on('dblclick', () => this.onDoubleClick.emit());
    this.circle.on('click', () => this.clicked());


    this.circle.call(drag()
      .on('start', this.dragStart)
      .on('drag', (event) => {
        // Just a Quickfix. Target of mouseevent is switching between input and svg but should stay at svg
        if(!event.sourceEvent.target.value){
          this.endNode.x = event.sourceEvent.offsetX;
          this.endNode.y = event.sourceEvent.offsetY;
        }
      })
      .on('end', this.dragEnd));


  }

  dragStart() {
  }

  dragEnd() {
  }

  get circleRadius(){
    return GLOBALVARIABLES.circleRadius;
  }
  private clicked(){
    this.store.dispatch(elementClicked({id: this.endNode.id}))
    this.focus = true
  }


}
