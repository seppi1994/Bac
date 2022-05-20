import {Component, OnInit} from '@angular/core';
import {Node} from "../../../../shared/model/node";
import {Store} from "@ngrx/store";
import {Edge} from "../../../../shared/model/edge";
import {ArrowDirectionEnum} from "../../../../shared/model/arrow-direction.enum";
import {updateEdges} from "../../../../store/app.actions";
import {ParserService} from "../../../parser/service/parser.service";
import {Constrain} from "../../../../shared/model/constrain";
import {NonTerminalNode} from "../../../../shared/model/non-terminal-node";
import {EndNode} from "../../../../shared/model/end-node";
import {ExampleGeneratorService} from "../../../exaple-generator/service/example-generator.service";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  example!: string;

  eArrowDirection = ArrowDirectionEnum;

  dblClickFirstNode: Node | NonTerminalNode | EndNode | undefined;
  dblClickSecondNode: Node | NonTerminalNode | EndNode | undefined;

  nodes: Node[] = [
    {id: 0, x: 200, y: 225, value: 'S'},
    {id: 1, x: 450, y: 150, value: '1'},
    // {id: 2, x: 700, y: 150, value:'2'},
    // {id: 3, x: 450, y: 300, value:'3'},
    {id: 4, x: 450, y: 450, value: '3'},
    {id: 5, x: 700, y: 450, value: '4'},
    {id: 6, x: 950, y: 450, value: '5'},
    {id: 7, x: 700, y: 150, value: '2'},
  ];
  nonTerminals: NonTerminalNode[] = [
    {id: 114, x: 700, y: 300, name: 'TestMf', placeholder: true},
    {id: 115, x: 200, y: 450, name: 'TestMf', begin: true},
    {id: 116, x: 1200, y: 450, name: 'TestMf', end: true},
  ]

  endNodes: EndNode[] = [
    {id: 227, x: 950, y: 150},
  ]




  edges: Edge[] = [
    {source: this.nodes[0], target: this.nodes[1], left: false, right: true},
    {source: this.nodes[0], target: this.nonTerminals[0], left: false, right: true},
    // {source: this.nodes[1], target: this.nodes[4], left: false, right: true},
    // {source: this.nodes[0], target: this.nodes[3], left: false, right: true},
    {source: this.nonTerminals[0], target: this.nodes[5], left: false, right: true},
    {source: this.nonTerminals[1], target: this.nodes[2], left: false, right: true},
    {source: this.nodes[2], target: this.nodes[3], left: false, right: true},
    {source: this.nodes[3], target: this.nodes[4], left: false, right: true},
    {source: this.nodes[4], target: this.nonTerminals[2], left: false, right: true},
    {source: this.nodes[5], target: this.endNodes[0], left: false, right: true},
  ];
  constrains: Constrain[] = [
    {id: 0, source: this.nodes[5], target: this.nodes[5], left: false, right: true, constrain: 'n'},
    // {id: 1, source: this.nodes[1], target: this.nodes[1], left: false, right: true, constrain: 'n'},
    // {id: 2, source: this.nodes[3], target: this.nodes[3], left: false, right: true, constrain: 1}
  ];


  // nodes: Node[] = [
  //   {id: 0, x: 500, y: 500, value: 'S'}
  // ];
  // edges: Edge[] = [];

  private nodeId: number = 1;

  constructor(private store: Store, private service: ParserService, private exampleGenerator: ExampleGeneratorService) {
  }

  ngOnInit(): void {
    this.service.createParsingTree(this.edges, this.constrains, this.nonTerminals);
    this.example = this.exampleGenerator.process(this.edges, this.constrains, this.nonTerminals);
    console.log(this.example)
    // this.store.dispatch(updateConstrains({constrains: this.constrains.map(constrain => ({...constrain}))}));
  }

  addNewEdge(node: Node | NonTerminalNode | EndNode): void {
    if (!this.dblClickFirstNode) {
      this.dblClickFirstNode = node;
    } else {
      this.dblClickSecondNode = node;
    }
    if (this.dblClickFirstNode && this.dblClickSecondNode && this.dblClickFirstNode !== this.dblClickSecondNode) {
      this.edges.push({source: this.dblClickFirstNode, target: this.dblClickSecondNode, left: false, right: true});
      this.store.dispatch(updateEdges({edges: this.edges.map(edge => ({...edge}))}))
      this.dblClickFirstNode = undefined;
      this.dblClickSecondNode = undefined;
      this.service.createParsingTree(this.edges, this.constrains, this.nonTerminals);
    }
  }

  addNewNode(input: string) {
    this.nodes.push({id: this.nodeId, x: 400, y: 400, value: input});
    this.nodeId++;
    // this.store.dispatch(updateNodes({ nodes: this.nodes.map(node=> ({...node}))}))
  }

}
