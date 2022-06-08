import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Node} from "../../../../shared/model/node";
import {Store} from "@ngrx/store";
import {Edge} from "../../../../shared/model/edge";
import {ArrowDirectionEnum} from "../../../../shared/model/arrow-direction.enum";
import {elementClicked, updateEdges} from "../../../../store/app.actions";
import {ParserService} from "../../../parser/service/parser.service";
import {Constrain} from "../../../../shared/model/constrain";
import {NonTerminalNode} from "../../../../shared/model/non-terminal-node";
import {EndNode} from "../../../../shared/model/end-node";
import {ExampleGeneratorService} from "../../../exaple-generator/service/example-generator.service";
import {Subscription} from "rxjs";
import {fromAppFocusElement} from "../../../../store/app.selectors";
import {MatButtonToggleChange} from "@angular/material/button-toggle";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  example!: string;
  secondExample!: string;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete'){
      this.delete()
    }
  }

  @HostListener('document:dblclick', ['$event'])
  handleDbClickEvent(event: MouseEvent) {
    if(this.display.nativeElement === event.target){
      if (this.toggleNodeChange === 'Node'){
        this.addNewNode(this.inputNode.nativeElement.value, event.x - 256, event.y);
      }
      if (this.toggleNodeChange === 'NonTerminal'){
        this.addNewNonTerminal(this.inputNode.nativeElement.value, event.x - 256, event.y);
      }
      if(this.toggleNodeChange === 'EndNode'){
        this.addNewEndNode(event.x - 256, event.y)
      }
    }
  }

  private toggleNodeChange: string = 'Node';
  public isEditable: boolean = false;
  private toggleEdgeChange: string = 'Edge';

  @ViewChild('input') inputNode!: ElementRef<HTMLInputElement>;
  @ViewChild('display') display!: ElementRef<HTMLInputElement>;

  eArrowDirection = ArrowDirectionEnum;

  dblClickFirstNode: Node | NonTerminalNode | EndNode | undefined;
  dblClickSecondNode: Node | NonTerminalNode | EndNode | undefined;

  private focusElementSub!: Subscription;
  private focusElementId: number = -1;

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
    {id: 10000, source: this.nodes[0], target: this.nodes[1], left: false, right: true},
    {id: 10001,source: this.nodes[0], target: this.nonTerminals[0], left: false, right: true},
    // {source: this.nodes[1], target: this.nodes[4], left: false, right: true},
    // {source: this.nodes[0], target: this.nodes[3], left: false, right: true},
    {id: 10002,source: this.nonTerminals[0], target: this.nodes[5], left: false, right: true},
    {id: 10003,source: this.nonTerminals[1], target: this.nodes[2], left: false, right: true},
    {id: 10004,source: this.nodes[2], target: this.nodes[3], left: false, right: true},
    {id: 10005,source: this.nodes[3], target: this.nodes[4], left: false, right: true},
    {id: 10006,source: this.nodes[4], target: this.nonTerminals[2], left: false, right: true},
    {id: 10007,source: this.nodes[5], target: this.endNodes[0], left: false, right: true},
  ];
  constrains: Constrain[] = [
    {id: 1000, source: this.nodes[5], target: this.nodes[5], left: false, right: true, constrain: 'n'},
    // {id: 1, source: this.nodes[1], target: this.nodes[1], left: false, right: true, constrain: 'n'},
    // {id: 2, source: this.nodes[3], target: this.nodes[3], left: false, right: true, constrain: 1}
  ];


  // nodes: Node[] = [
  //   {id: 0, x: 500, y: 500, value: 'S'}
  // ];
  // edges: Edge[] = [];

  private idCounter: number = 1010101;

  constructor(private store: Store, private service: ParserService, private exampleGenerator: ExampleGeneratorService) {
  }

  ngOnInit(): void {
    this.updateParsingTreeAndExample();
    this.focusElementSub = this.store.select(fromAppFocusElement)
      .subscribe((nodeId: number) => {
        this.focusElementId = nodeId;
      });
  }



  addNewLink(node: Node | NonTerminalNode | EndNode): void {
    if(this.toggleEdgeChange === 'Edge'){
      this.addNewEdge(node);
    }
    if(this.toggleEdgeChange === 'Constrain'){
      this.addNewConstrain(node);
    }
  }

  addNewEdge(node: Node | NonTerminalNode | EndNode): void {
    if (!this.dblClickFirstNode) {
      this.dblClickFirstNode = node;
    } else {
      this.dblClickSecondNode = node;
    }
    if (this.dblClickFirstNode && this.dblClickSecondNode && this.dblClickFirstNode !== this.dblClickSecondNode) {
      this.edges.push({id: this.idCounter, source: this.dblClickFirstNode, target: this.dblClickSecondNode, left: false, right: true});
      this.idCounter++;
      this.dblClickFirstNode = undefined;
      this.dblClickSecondNode = undefined;
      this.updateParsingTreeAndExample();
    }
  }


  addNewConstrain(node: Node | NonTerminalNode | EndNode): void {
    if (!this.dblClickFirstNode) {
      this.dblClickFirstNode = node;
    } else {
      this.dblClickSecondNode = node;
    }
    if (this.dblClickFirstNode && this.dblClickSecondNode) {
      this.constrains.push({id: this.idCounter, source: this.dblClickFirstNode, target: this.dblClickSecondNode, left: false, right: true, constrain: 'n'});
      this.idCounter++;
      this.dblClickFirstNode = undefined;
      this.dblClickSecondNode = undefined;
      this.updateParsingTreeAndExample();
    }
  }

  addNewNode(input: string, x: number, y: number) {
    this.nodes.push({id: this.idCounter, x: x, y: y, value: input});
    this.idCounter++;
    this.updateParsingTreeAndExample();
  }

  addNewNonTerminal(input: string, x: number, y: number) {
    this.nonTerminals.push({id: this.idCounter, x: x, y: y, name: input});
    this.idCounter++;
    this.nonTerminals.push({id: this.idCounter, x: 200, y: y + 200, name: input});
    this.idCounter++;
    this.nonTerminals.push({id: this.idCounter, x: 1200, y: y + 200, name: input});
    this.idCounter++;
    this.updateParsingTreeAndExample();
  }

  addNewEndNode(x: number, y: number){
    this.endNodes.push({id: this.idCounter, x: x, y: y});
    this.idCounter++;
  }

  public clicked(event: any){
    if(this.display.nativeElement === event.target){
      this.store.dispatch(elementClicked({id: -1}))
    }
  }
  public delete(){
    this.nodes = this.nodes.filter(node => node.id !== this.focusElementId);
    this.nonTerminals = this.nonTerminals.filter(nonTerminal => nonTerminal.id !== this.focusElementId);
    this.endNodes = this.endNodes.filter(endNode => endNode.id !== this.focusElementId);
    this.edges = this.edges.filter(edge => edge.id !== this.focusElementId);
    this.constrains = this.constrains.filter(constrain => constrain.id !== this.focusElementId);
    this.updateParsingTreeAndExample();
  }

  onToggleNodeChange(event: MatButtonToggleChange){
    this.toggleNodeChange = event.value;
    this.store.dispatch(elementClicked({id: -1}));
  }

  onToggleEdgeChange(event: MatButtonToggleChange){
    this.toggleEdgeChange = event.value;
    this.store.dispatch(elementClicked({id: -1}));
  }

  onToggleEditChange(event: MatButtonToggleChange){
    this.isEditable = event.source.checked;
    this.updateParsingTreeAndExample();
    this.store.dispatch(elementClicked({id: -1}));
  }

  updateParsingTreeAndExample(){
    this.example = this.exampleGenerator.process(this.edges, this.constrains, this.nonTerminals);
    this.makeSecondExample();
    this.service.createParsingTree(this.edges, this.constrains, this.nonTerminals);
  }

  makeSecondExample(){
    const result = this.exampleGenerator.process(this.edges, this.constrains, this.nonTerminals);
    if(result === this.example){
      this.makeSecondExample();
    }else {
      this.secondExample = result;
    }
  }

}
