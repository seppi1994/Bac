import {Component, OnInit} from '@angular/core';
import {Node} from "../../../../shared/model/node";
import {Store} from "@ngrx/store";
import {Edge} from "../../../../shared/model/edge";
import {ArrowDirectionEnum} from "../../../../shared/model/arrow-direction.enum";
import {updateEdges, updateNodes} from "../../../../store/app.actions";
import {ParserService} from "../../../parser/service/parser.service";
import {Constrain} from "../../../../shared/model/constrain";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {


  eArrowDirection = ArrowDirectionEnum;

  dblClickFirstNode: Node | undefined;
  dblClickSecondNode: Node | undefined;

  nodes: Node[] = [
    {id: 0, x: 500, y: 100, value:'S'},
    {id: 1, x: 200, y: 350, value:'1'},
    {id: 2, x: 300, y: 300, value:'2'},
    {id: 3, x: 500, y: 300, value:'3'}
  ];


  edges: Edge[] = [
    {source: this.nodes[0], target: this.nodes[1], left: false, right: true},
    {source: this.nodes[1], target: this.nodes[2], left: false, right: true},
    {source: this.nodes[0], target: this.nodes[3], left: false, right: true}
  ];
  constrains: Constrain[] = [
    {id: 0, source: this.nodes[2], target: this.nodes[0], left: false, right: true, constrain: 2}
  ];


  // nodes: Node[] = [
  //   {id: 0, x: 500, y: 500, value: 'S'}
  // ];
  // edges: Edge[] = [];

  private nodeId: number = 1;

  constructor(private store: Store, private service: ParserService) {
  }

  ngOnInit(): void {
    this.service.createParsingTree(this.edges, this.constrains);
    // this.store.dispatch(updateConstrains({constrains: this.constrains.map(constrain => ({...constrain}))}));
  }

  addNewEdge(node: Node): void {
    if (!this.dblClickFirstNode) {
      this.dblClickFirstNode = node;
    } else {
      this.dblClickSecondNode = node;
    }
    if (this.dblClickFirstNode && this.dblClickSecondNode && this.dblClickFirstNode !== this.dblClickSecondNode) {
      this.edges.push({source: this.dblClickFirstNode, target: this.dblClickSecondNode, left: false, right: true});
      this.store.dispatch(updateEdges({ edges: this.edges.map(edge => ({...edge}))}))
      this.dblClickFirstNode = undefined;
      this.dblClickSecondNode = undefined;
      this.service.createParsingTree(this.edges, this.constrains);
    }
  }
  addNewNode(input: string) {
      this.nodes.push({id: this.nodeId, x: 400, y: 400, value: input});
      this.nodeId++;
      this.store.dispatch(updateNodes({ nodes: this.nodes.map(node=> ({...node}))}))
    }

}
