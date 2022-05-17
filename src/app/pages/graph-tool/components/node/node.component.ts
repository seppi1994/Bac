import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import {Node} from "../../../../shared/model/node";
import {
  select, drag, Selection
} from 'd3';
import * as GLOBALVARIABLES from "../../../../shared/global-variables"

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, AfterViewInit {

  circle!:Selection<any, any, any, any>;

  @Input()
  public node!: Node;

  @Output()
  onDoubleClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.circle = select('#node' + this.node.id);
    this.circle = this.circle.data<Node>([this.node]);
    this.circle.on('dblclick', () => this.onDoubleClick.emit());

    // const g = select('#g' + this.node.id).append("foreignObject")
    //   .attr("width", 48)
    //   .attr("height", 24)
    //   .attr('x', -19)
    //   .attr( 'y', -10)
    //   .append("xhtml:body")
    //   .attr('xmlns','http://www.w3.org/1999/xhtml')
    //   .html("<input type='text' class='input' value='2' />")
    //   .on("mousedown", (event) => { event.stopPropagation(); })
    //   .on("mousemove", (event) => { event.stopPropagation(); });

    this.circle.call(drag()
      .on('start', this.dragStart)
      .on('drag', (event) => {
        // Just a Quickfix. Target of mouseevent is switching between input and svg but should stay at svg
        if(!event.sourceEvent.target.value){
          this.node.x = event.sourceEvent.offsetX;
          this.node.y = event.sourceEvent.offsetY;
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

  public changeNodeValue(input: string){
    this.node.value = input;
  }
}
