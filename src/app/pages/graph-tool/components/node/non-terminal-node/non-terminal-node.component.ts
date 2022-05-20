import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {drag, select, Selection} from "d3";
import * as GLOBALVARIABLES from "../../../../../shared/global-variables";
import {NonTerminalNode} from "../../../../../shared/model/non-terminal-node";

@Component({
  selector: '[app-non-terminal-node]',
  templateUrl: './non-terminal-node.component.html',
  styleUrls: ['./non-terminal-node.component.scss']
})
export class NonTerminalNodeComponent implements OnInit, AfterViewInit {
  circle!:Selection<any, any, any, any>;

  @Input()
  public nonTerminal!: NonTerminalNode;

  @Output()
  onDoubleClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.circle = select('#non-ter-node' + this.nonTerminal.id);
    this.circle = this.circle.data<NonTerminalNode>([this.nonTerminal]);
    this.circle.on('dblclick', () => this.onDoubleClick.emit());


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
}
