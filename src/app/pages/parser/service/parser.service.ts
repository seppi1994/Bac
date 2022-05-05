import {Injectable} from "@angular/core";
import {Edge} from "../../../shared/model/edge";
import {ParsingTreeNode} from "../model/parsing-tree-node";
import {ParsingTree} from "../model/parsing-tree";
import {Store} from "@ngrx/store";
import {Constrain} from "../../../shared/model/constrain";
import {ConstrainNode} from "../model/constrain-node";

@Injectable({
  providedIn: 'root',
})
export class ParserService{

  private parsingTree!: ParsingTree;
  private _constrains: { parsingTreeNode: ParsingTreeNode; origConstrain: any }[] = [];
  constrains!: Constrain[];
  edges!: Edge[];

  constructor(private store: Store) {
  }

  public parseString(parseString: string): boolean{
    // this.store.select(fromAppSelectedConstrains).subscribe(x => this.constrains = x);
    // this.store.select(fromAppSelectedEdges).subscribe(x => this.edges = x);
    this.createParsingTree(this.edges, this.constrains);
    const boolArray = this.parsingTree?.nodes.map(x => this.parsingRecursion(x, parseString));
    let result = boolArray.find(x => x);
    this._constrains.forEach(constrain => {
      if(typeof constrain.parsingTreeNode.constrain === "number" && constrain.parsingTreeNode.constrain !== 0 && constrain.parsingTreeNode.constrain !== constrain.origConstrain){
        result = false;
      }
    });
    return result ? result : false;
  }

  public createParsingTree(edges: Edge[], constrains: Constrain[]): void{
    this._constrains = [];
    this.constrains = constrains;
    this.edges = edges;
    const workableEdges = edges.map(edge => ({...edge}));
    const workableConstrains = constrains.map(constrain => ({...constrain}));
    const parsingTreeConstrain = workableConstrains.map(x => ({constrain: x, goalNode: undefined}))
    const parsingTree: ParsingTree = {nodes: this.findNodesRec(0, workableEdges, parsingTreeConstrain)};
    // this.store.dispatch(updateParsingTree({parsingTree: parsingTree}));
    console.log(parsingTree)
    this.parsingTree = parsingTree;
  }

  private findNodesRec(id: number, edges: Edge[], constrainNodes: ConstrainNode[]): ParsingTreeNode[]{
    const parsingTreeNodes: {parsingNode: ParsingTreeNode, nodeId: number}[] = [];

    edges.filter(edge => {
      if (edge.source.id === id) {
        parsingTreeNodes.push({
          parsingNode: {value: edge.target.value,
                        constrain: undefined,
                        parsingTreeNodes: []},
          nodeId: edge.target.id});
        return false;
      }else {
        return true;
      }
    });
    const goalConstrainNode: ParsingTreeNode = {
      value: '',
      constrain: undefined,
      parsingTreeNodes: []
    }
    constrainNodes.forEach(constrainNode => {
      parsingTreeNodes.forEach(parsingTreeNode => {
        if(constrainNode.constrain.target.id === parsingTreeNode.nodeId){
          goalConstrainNode.parsingTreeNodes.push(parsingTreeNode.parsingNode);
          constrainNode.goalNode = goalConstrainNode;
        }
      })
    });
    parsingTreeNodes.forEach(x => x.parsingNode.parsingTreeNodes = this.findNodesRec(x.nodeId, edges, constrainNodes));
    constrainNodes.forEach(constrainNode => {
      if (constrainNode.constrain.source.id === id){
        if (constrainNode.goalNode){
          const parsingNode:ParsingTreeNode = {value: '', constrain: constrainNode.constrain.constrain, parsingTreeNodes: [constrainNode.goalNode]};

          parsingTreeNodes.push({
            parsingNode: parsingNode,
            nodeId: 0});

          this._constrains.push({parsingTreeNode: parsingNode, origConstrain: parsingNode.constrain});
        }
      }
    });
    return parsingTreeNodes.map(x => x.parsingNode);
  }

  private parsingRecursion(parsingTreeNode: ParsingTreeNode, parsString: string): boolean{
    const slicedParsingString = parsString.slice(0, parsingTreeNode.value.length);
    if(slicedParsingString === parsingTreeNode.value){
      parsingTreeNode.parsingTreeNodes = parsingTreeNode.parsingTreeNodes.filter(x => x.constrain !== 0)
      const boolArray = parsingTreeNode.parsingTreeNodes.map(x => {

        if(typeof x.constrain ==="number" && x.constrain !== 0){

          x.constrain--;
          return this.parsingRecursion(x, parsString.slice(slicedParsingString.length, parsString.length));
        }
        if(typeof x.constrain !=="number"){
          return this.parsingRecursion(x, parsString.slice(slicedParsingString.length, parsString.length));
        }
        return undefined;
      });
      // if((parsString.length === parsingTreeNode.value.length) && (boolArray)){
      //   return true;
      // }
      const result = boolArray.find(x => x)
      if (result || ((parsString.length === parsingTreeNode.value.length) && (boolArray.length === 0))){
          return true;
      }
    }
    return false;
  }
}
