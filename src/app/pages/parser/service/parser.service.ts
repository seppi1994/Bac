import {Injectable} from "@angular/core";
import {Edge} from "../../../shared/model/edge";
import {ParsingTreeNode} from "../model/parsing-tree-node";
import {ParsingTree} from "../model/parsing-tree";
import {Constrain} from "../../../shared/model/constrain";
import {ConstrainNode} from "../model/constrain-node";
import {NonTerminalNode} from "../../../shared/model/non-terminal-node";

@Injectable({
  providedIn: 'root',
})
export class ParserService {

  private parsingTree!: ParsingTree;
  private _constrains: { parsingTreeNode: ParsingTreeNode; origConstrain: any }[] = [];
  constrains!: Constrain[];
  edges!: Edge[];
  nonTerminals!: NonTerminalNode[];

  private _constrainVariableCount: { constrainId: number; constrainVariable: string; count: number }[] = [];

  constructor() {
  }

  public parseString(parseString: string): boolean {
    this._constrainVariableCount = [];
    this.constrains.forEach(constrain => {
      if (typeof constrain.constrain === "string") {
        this._constrainVariableCount.push({
          constrainId: constrain.id,
          constrainVariable: constrain.constrain,
          count: 0
        });
      }
    });
    this.parsingTree = this.createParsingTree(this.edges, this.constrains, this.nonTerminals);
    const boolArray = this.parsingTree?.nodes.map(x => this.parsingRecursion(x, parseString));
    let result = boolArray.find(x => x);
    let isConstrainCheckFailed = false;
    this._constrains.forEach(constrain => {
      if (typeof constrain.parsingTreeNode.constrain === "number" && constrain.parsingTreeNode.constrain !== 0 && constrain.parsingTreeNode.constrain !== constrain.origConstrain) {
        isConstrainCheckFailed = true;
      }
    });
    if (isConstrainCheckFailed){
      return false;
    }
    for (let i = 0; i < this._constrainVariableCount.length - 1; i++) {
      for (let j = i; j < this._constrainVariableCount.length; j++) {
        if (this._constrainVariableCount[i].constrainVariable === this._constrainVariableCount[j].constrainVariable) {
          if (this._constrainVariableCount[i].count !== this._constrainVariableCount[j].count) {
            return false;
          }
        }
      }
    }
    return result ? result : false;
  }

  public createParsingTree(edges: Edge[], constrains: Constrain[], nonTerminals: NonTerminalNode[]): ParsingTree {
    this._constrains = [];
    this.constrains = constrains;
    this.edges = edges;
    this.nonTerminals = nonTerminals;
    const workableEdges = edges.map(edge => ({...edge}));
    for (let i = 0; i < nonTerminals.length; i += 3) {
      workableEdges.map(edge => {
        if("name" in edge.target){
          if(edge.target.id === nonTerminals[i].id){
            edge.target = nonTerminals[i + 1];
          }
        }
        if("name" in edge.source){
          if(edge.source.id === nonTerminals[i].id){
            edge.source = nonTerminals[i + 2];
          }
        }
      })
    }
    const workableConstrains = constrains.map(constrain => ({...constrain}));
    const parsingTreeConstrain = workableConstrains.map(x => ({constrain: x, goalNode: undefined}))
    const parsingTree: ParsingTree = {nodes: this.findNodesRec(0, workableEdges, parsingTreeConstrain)};
    return parsingTree;
  }

  private findNodesRec(id: number, edges: Edge[], constrainNodes: ConstrainNode[]): ParsingTreeNode[] {
    const parsingTreeNodes: { parsingNode: ParsingTreeNode, nodeId: number }[] = [];

    edges = edges.filter(edge => {
      if (edge.source.id === id) {
        if("value" in edge.target){
          parsingTreeNodes.push({parsingNode: {value: edge.target.value, constrain: undefined, parsingTreeNodes: []}, nodeId: edge.target.id});
        } else {
          parsingTreeNodes.push({parsingNode: {value: '', constrain: undefined, parsingTreeNodes: []}, nodeId: edge.target.id});
        }
        return false;
      } else {
        return true;
      }
    });
    constrainNodes.forEach(constrainNode => {
      parsingTreeNodes.forEach(parsingTreeNode => {
        if (constrainNode.constrain.target.id === parsingTreeNode.nodeId) {
          constrainNode.goalNode = parsingTreeNode.parsingNode;
        }
      })
    });
    parsingTreeNodes.forEach(x => x.parsingNode.parsingTreeNodes = this.findNodesRec(x.nodeId, edges, constrainNodes));
    constrainNodes.forEach(constrainNode => {
      if (constrainNode.constrain.source.id === id) {
        if (constrainNode.goalNode) {
          let parsingNode!: ParsingTreeNode;
          if (typeof constrainNode.constrain.constrain === "string") {
            parsingNode = {value: '', constrain: {variable: constrainNode.constrain.constrain, id: constrainNode.constrain.id}, parsingTreeNodes: [constrainNode.goalNode]};
          } else {
            parsingNode = {value: '', constrain: constrainNode.constrain.constrain, parsingTreeNodes: [constrainNode.goalNode]};
          }
          parsingTreeNodes.push({parsingNode: parsingNode, nodeId: 0});
          this._constrains.push({parsingTreeNode: parsingNode, origConstrain: parsingNode.constrain});
        }
      }
    });
    return parsingTreeNodes.map(x => x.parsingNode);
  }

  private parsingRecursion(parsingTreeNode: ParsingTreeNode, parsString: string): boolean {

    const slicedParsingString = parsString.slice(0, parsingTreeNode.value.length);
    if (slicedParsingString === parsingTreeNode.value) {
      const boolArray = parsingTreeNode.parsingTreeNodes.map((x: ParsingTreeNode) => {

        if (typeof x.constrain === "number" && x.constrain !== 0) {
          x.constrain++;
          if(x.parsingTreeNodes[0].value === parsString.slice(slicedParsingString.length, parsString.length).slice(0, x.parsingTreeNodes[0].value.length)){
            x.constrain -= 2;
            return this.parsingRecursion(x, parsString.slice(slicedParsingString.length, parsString.length));
          }
        }
        if (typeof x.constrain !== "number" && x.constrain) {
          this._constrainVariableCount.forEach(constrainVariable => {
            // @ts-ignore
            if (x.constrain.id === constrainVariable.constrainId) {
              constrainVariable.count++;
            }
          });
          return this.parsingRecursion(x, parsString.slice(slicedParsingString.length, parsString.length));
        }

        if (typeof x.constrain !== "number") {
          return this.parsingRecursion(x, parsString.slice(slicedParsingString.length, parsString.length));
        }
        return undefined;
      });

      const result = boolArray.find(x => x)
      if (result || ((parsString.length === parsingTreeNode.value.length) && (boolArray.length === 0))) {
        return true;
      }
    }
    return false;
  }

}
