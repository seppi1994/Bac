import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {drag, select, Selection} from "d3";
import * as GLOBALVARIABLES from "../../../../../shared/global-variables";
import {NonTerminalNode} from "../../../../../shared/model/non-terminal-node";
import {elementClicked} from "../../../../../store/app.actions";
import {Store} from "@ngrx/store";
import {fromAppFocusElement} from "../../../../../store/app.selectors";
import {Subscription} from "rxjs";

@Component({
  selector: '[app-non-terminal-node]',
  templateUrl: './non-terminal-node.component.html',
  styleUrls: ['./non-terminal-node.component.scss']
})
export class NonTerminalNodeComponent implements OnInit, AfterViewInit {
  circle!:Selection<any, any, any, any>;

  @Input()
  public nonTerminal!: NonTerminalNode;
  @Input()
  public editable!: boolean;
  @Input()
  public definition: boolean = false;

  private focusElementSub!: Subscription;

  public focus: boolean = false;

  @Output()
  onDoubleClick = new EventEmitter<any>();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.focusElementSub = this.store.select(fromAppFocusElement)
      .subscribe((nodeId: number) => {
        if(nodeId !== this.nonTerminal.id){
          this.focus = false;
        }
      });
  }


  ngAfterViewInit() {
    this.circle = select('#non-ter-node' + this.nonTerminal.id);
    this.circle = this.circle.data<NonTerminalNode>([this.nonTerminal]);
    this.circle.on('dblclick', () => this.onDoubleClick.emit());
    this.circle.on('click', () => this.clicked());


    this.circle.call(drag()
      .on('start', this.dragStart)
      .on('drag', (event) => {
        // Just a Quickfix. Target of mouseevent is switching between input and svg but should stay at svg
        if(!event.sourceEvent.target.value){
          this.nonTerminal.x = event.sourceEvent.offsetX;
          this.nonTerminal.y = event.sourceEvent.offsetY;
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

  public changeName(input: string){
    this.nonTerminal.name = input;
  }

  private clicked(){
    this.store.dispatch(elementClicked({id: this.nonTerminal.id}))
    this.focus = true
  }
}
