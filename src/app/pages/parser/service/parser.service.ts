import {Injectable} from "@angular/core";
import {Edge} from "../../../shared/model/edge";
import {Node} from "../../../shared/model/node";
import {ParsingTreeNode} from "../model/parsing-tree-node";
import {ParsingTree} from "../model/parsing-tree";
import {Store} from "@ngrx/store";
import {updateParsingTree} from "../../../store/app.actions";
import {Constrain} from "../../../shared/model/constrain";
import {ConstrainNode} from "../model/constrain-node";
import {fromAppSelectedConstrains, fromAppSelectedEdges, fromAppSelectedNodes} from "../../../store/app.selectors";

@Injectable({
  providedIn: 'root',
})
export class ParserService{

  private parsingTree!: ParsingTree;
  constrains!: Constrain[];
  edges!: Edge[];

  constructor(private store: Store) {
  }

  public parseString(parseString: string): boolean{
    // this.store.select(fromAppSelectedConstrains).subscribe(x => this.constrains = x);
    // this.store.select(fromAppSelectedEdges).subscribe(x => this.edges = x);
    this.createParsingTree(this.edges, this.constrains);
    const boolArray = this.parsingTree?.nodes.map(x => this.parsingRecursion(x, parseString));
    const result = boolArray.find(x => x);
    return result ? result : false;
  }

  public createParsingTree(edges: Edge[], constrains: Constrain[]): void{
    this.constrains = constrains;
    this.edges = edges;
    const workableEdges = edges.map(edge => ({...edge}));
    const workableConstrains = constrains.map(constrain => ({...constrain}));
    const parsingTreeConstrain = workableConstrains.map(x => ({constrain: x, goalNode: undefined}))
    const parsingTree: ParsingTree = {nodes: this.findNodesRec(0, workableEdges, parsingTreeConstrain)};
    // this.store.dispatch(updateParsingTree({parsingTree: parsingTree}));
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
          nodeId: edge.target.id})
        return false;
      }else {
        return true;
      }
    });
    let foundConstrainSource = false;
    const goalConstrainNode: ParsingTreeNode = {
      value: '',
      constrain: undefined,
      parsingTreeNodes: []
    }
    constrainNodes.forEach(constrainNode => {
      if(constrainNode.constrain.target.id === id){

        // constrainNode.parsingTreeNodes.push(parsingTreeNodes.map(x => x.parsingNode))
        parsingTreeNodes.forEach(x => goalConstrainNode.parsingTreeNodes.push(x.parsingNode));
        constrainNode.goalNode = goalConstrainNode;
        foundConstrainSource = true;
      }
    });

    parsingTreeNodes.forEach(x => x.parsingNode.parsingTreeNodes = this.findNodesRec(x.nodeId, edges, constrainNodes));
    constrainNodes.forEach(constrainNode => {
      if (constrainNode.constrain.source.id === id){
        if (constrainNode.goalNode){
          parsingTreeNodes.push({
            parsingNode: {value: '',
              constrain: constrainNode.constrain.constrain,
              parsingTreeNodes: [constrainNode.goalNode]},
            nodeId: 0})
        }
      }
    });
    if(foundConstrainSource){
      console.log("goal: ")
      console.log(goalConstrainNode)
      return [goalConstrainNode];
    }else {
      return parsingTreeNodes.map(x => x.parsingNode);
    }
  }

  private parsingRecursion(parsingTreeNode: ParsingTreeNode, parsString: string): boolean{

    const slicedParsingString = parsString.slice(0, parsingTreeNode.value.length);
    console.log(slicedParsingString)
    if(slicedParsingString === parsingTreeNode.value){
      // console.log("first if")
      parsingTreeNode.parsingTreeNodes.filter(x => x.constrain !== 0)
      const boolArray = parsingTreeNode.parsingTreeNodes.map(x => {
        console.log(x)
        // @ts-ignore
        if(!isNaN(x.constrain) && x.constrain !== 0){
          console.log("constrain: " + x.constrain)
          console.log("1111111111111111111")
          // @ts-ignore
          x.constrain--;
          return this.parsingRecursion(x, parsString.slice(slicedParsingString.length, parsString.length));
        }
        // @ts-ignore
        if(isNaN(x.constrain)){
          console.log("22222222222222222222222")
          return this.parsingRecursion(x, parsString.slice(slicedParsingString.length, parsString.length));
        }
        console.log("constrain map: " + x.constrain)
        return undefined;
      });
      if((parsString.length === parsingTreeNode.value.length) && (boolArray)){
        return true;
      }
      const result = boolArray.find(x => x)
      console.log("result: " + result)
      console.log("parsstring: " + parsString)
      console.log("trennode: " + parsingTreeNode.value)
      if (result || ((parsString.length === parsingTreeNode.value.length) && (boolArray.length === 0))){
        console.log("nice")
          return true;
      }
    }
    return false;
  }
}
