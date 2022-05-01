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
  // @ViewChild('input')
  // input!: ElementRef;
  //
  // onInputChanged(){
  //
  //   console.log(this.input.nativeElement.innerHTML)
  //   // if(this.input.nodeValue){
  //   //   this.node.value = this.input.nodeValue;
  //   // }
  // }

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
    this.circle.call(drag()
      .on('start', this.dragStart)
      .on('drag', (event) => {
        this.node.x = event.sourceEvent.offsetX;
        this.node.y = event.sourceEvent.offsetY;
      })
      .on('end', this.dragEnd));
    // select('#text' + this.node.id)
    //   .on("keyup", (event, d) =>  { console.log(event);console.log(d)});
    // this.circle
    //   .append("text")
    //   .attr("contentEditable", true)
    //   .text(this.node.value)
    //   .on("keyup", (event, d) =>  { console.log(event);this.node.value = d});
    //console.log(this.input.nativeElement.innerHTML)
    //this.input.nativeElement?.addEventListener('keyup', (event: any) => {console.log("test");console.log(event)})
  }

  // values = '';
  //
  // onKey(event: KeyboardEvent) {
  //   console.log("test")
  //   this.values = (event.target as HTMLInputElement).value;
  // }

  dragStart() {
  }

  dragEnd() {
  }

  get circleRadius(){
    return GLOBALVARIABLES.circleRadius;
  }
}
