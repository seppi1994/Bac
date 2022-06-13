import {Injectable} from "@angular/core";
import {Edge} from "../../../shared/model/edge";
import {ParsingTreeNode} from "../model/parsing-tree-node";
import {ParsingTree} from "../model/parsing-tree";
import {Constrain} from "../../../shared/model/constrain";
import {ConstrainNode} from "../model/constrain-node";
import {NonTerminalNode} from "../../../shared/model/non-terminal-node";
import {NonTerminalAnswer, NonTerminalParsingTree} from "../model/non-terminal-parsing-tree";

@Injectable({
  providedIn: 'root',
})
export class ParserService {

  private parsingTree!: ParsingTree;
  private _constrains: { parsingTreeNode: ParsingTreeNode; origConstrain: any }[] = [];
  constrains!: Constrain[];
  edges!: Edge[];
  nonTerminals!: NonTerminalNode[];
  nonTerminalDefinition!: NonTerminalNode[]

  private _nonTerminalTrees!: NonTerminalParsingTree[];

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
    const [pTree, ] = this.createParsingTree(this.edges, this.constrains, this.nonTerminals, this.nonTerminalDefinition);
    this.parsingTree = pTree;
    const boolArray = this.parsingTree?.nodes.map(x => this.parsingRecursion(x, parseString));
    let result = boolArray.find(x => x);
    let isConstrainCheckFailed = false;
    this._constrains.forEach(constrain => {
      if (constrain.parsingTreeNode.constrainTouched && constrain.parsingTreeNode.constrain !== 0) {
        isConstrainCheckFailed = true;
      }
    });
    if (isConstrainCheckFailed) {
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

  public createParsingTree(edges: Edge[], constrains: Constrain[], nonTerminals: NonTerminalNode[], nonTerminalDefinition: NonTerminalNode[]): [ParsingTree, NonTerminalParsingTree[]] {
    this._constrains = [];
    this.constrains = constrains;
    this.edges = edges;
    this.nonTerminals = nonTerminals;
    this.nonTerminalDefinition = nonTerminalDefinition;
    const workableEdges = edges.map(edge => ({...edge}));
    const workableConstrains = constrains.map(constrain => ({...constrain}));
    const parsingTreeConstrain: ConstrainNode[] = workableConstrains.map(x => ({constrain: x, goalNode: undefined}));
    const nonTerminalTrees = this.createNonTerminal(nonTerminalDefinition, workableEdges, parsingTreeConstrain);
    this._nonTerminalTrees = nonTerminalTrees;
    this.removeNonTerminalConstrains();
    const firstNode: ParsingTreeNode = {
      value: '',
      constrain: undefined,
      parsingTreeNodes: this.findNodesRec(0, workableEdges, parsingTreeConstrain)
    }
    const parsingTree: ParsingTree = {nodes: [firstNode]}
    return [parsingTree, nonTerminalTrees];
  }

  private findNodesRec(id: number, edges: Edge[], constrainNodes: ConstrainNode[]): ParsingTreeNode[] {
    const parsingTreeNodes: { parsingNode: ParsingTreeNode, nodeId: number }[] = [];

    edges = edges.filter(edge => {
      if (edge.source.id === id) {
        if ("value" in edge.target) {
          parsingTreeNodes.push({
            parsingNode: {value: edge.target.value, constrain: undefined, parsingTreeNodes: []},
            nodeId: edge.target.id
          });
        } else if ("name" in edge.target) {
          parsingTreeNodes.push({
            parsingNode: {
              value: '',
              name: edge.target.name,
              constrain: undefined,
              parsingTreeNodes: []
            }, nodeId: edge.target.id
          });
        } else {
          parsingTreeNodes.push({
            parsingNode: {value: '', constrain: undefined, parsingTreeNodes: []},
            nodeId: edge.target.id
          });
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
            parsingNode = {
              value: '',
              constrain: {variable: constrainNode.constrain.constrain, id: constrainNode.constrain.id},
              constrainTouched: false,
              parsingTreeNodes: [constrainNode.goalNode]
            };
          } else {
            parsingNode = {
              value: '',
              constrain: constrainNode.constrain.constrain,
              constrainId: constrainNode.constrain.id,
              constrainTouched: false,
              parsingTreeNodes: [constrainNode.goalNode]
            };
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
        if ("name" in x && x.name) {
          const nonTerminalParseResults: NonTerminalAnswer[] = this.parseNonTerminal(parsString.slice(slicedParsingString.length, parsString.length), x.name);
          const res = nonTerminalParseResults.find(nonTerminalParseResult => {
            return this.parsingRecursion(x, nonTerminalParseResult.parseString)
          })
          if (res) {
            return true
          } else {
            return false;
          }
        }

        if (typeof x.constrain === "number" && x.constrain !== 0) {
          x.constrainTouched = true;
          if (x.parsingTreeNodes[0].value === parsString.slice(slicedParsingString.length, parsString.length).slice(0, x.parsingTreeNodes[0].value.length)) {
            x.constrain--;
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

  public createNonTerminal(nonTerminalDefinition: NonTerminalNode[], edges: Edge[], constrains: ConstrainNode[]): NonTerminalParsingTree[] {
    const nonTerminalTrees: NonTerminalParsingTree[] = [];
    const nonTerminalConstrains: { parsingTreeNode: ParsingTreeNode; origConstrain: any }[] = [];
    for (let i = 0; i < nonTerminalDefinition.length; i += 2) {
      nonTerminalTrees.push({
        nodes: this.findNodesForNonTerminalRec(nonTerminalDefinition[i].id, edges, constrains, nonTerminalConstrains),
        name: nonTerminalDefinition[i].name,
        constrains: nonTerminalConstrains,
        usageCount: 0
      })
    }
    return nonTerminalTrees;
  }

  private parseNonTerminal(parseString: string, variable: string): NonTerminalAnswer[] {
    const parseTrees = this._nonTerminalTrees.filter(nonTerminalTree => nonTerminalTree.name === variable);
    parseTrees[0].usageCount++;
    const workableConstrains: { parsingTreeNode: ParsingTreeNode; origConstrain: any }[] = parseTrees[0].constrains.map((constrain) => ({
      parsingTreeNode: {...constrain.parsingTreeNode},
      origConstrain: {...constrain.origConstrain}
    }));

    workableConstrains.forEach(workableConstrain => {
      if (typeof workableConstrain.parsingTreeNode.constrain !== "number" && workableConstrain.parsingTreeNode.constrain) {
        workableConstrain.parsingTreeNode.constrain = {...workableConstrain.parsingTreeNode.constrain};
        workableConstrain.parsingTreeNode.constrain.id = 1000000 + parseTrees[0].usageCount + workableConstrain.parsingTreeNode.constrain.id;
        this._constrainVariableCount.push({
          constrainId: workableConstrain.parsingTreeNode.constrain.id,
          constrainVariable: workableConstrain.parsingTreeNode.constrain.variable,
          count: 0
        });
      }
    })
    const boolArray = parseTrees[0].nodes.map(parseTree => this.parseNonTerminalRec(parseTree, parseString, parseTrees[0].usageCount, workableConstrains))
    workableConstrains.forEach(workableConstrain => this._constrains.push(workableConstrain));
    let result = boolArray.find(x => x);

    return result ? result : [{parseString: '', isValid: false}];
  }

  private parseNonTerminalRec(parsingTreeNode: ParsingTreeNode, parsString: string, usageCounter: number, workableConstrains: { parsingTreeNode: ParsingTreeNode; origConstrain: any }[]): NonTerminalAnswer[] {
    const slicedParsingString = parsString.slice(0, parsingTreeNode.value.length);
    if (slicedParsingString === parsingTreeNode.value) {
      const boolArrayTemp: NonTerminalAnswer[][] = parsingTreeNode.parsingTreeNodes.map((x: ParsingTreeNode) => {
        if ("name" in x && x.name) {
          const parseResults: NonTerminalAnswer[] = this.parseNonTerminal(parsString.slice(slicedParsingString.length, parsString.length), x.name);
          const answer: NonTerminalAnswer[] = [];
          parseResults.forEach(parseResult => {
            const tempRes = this.parseNonTerminalRec(x, parseResult.parseString, usageCounter, workableConstrains);
            tempRes.forEach(x => answer.push(x));
          });
          return answer
        }
        if (typeof x.constrain === "number" && x.constrainId && x.constrain !== 0) {
          const myConstrain = workableConstrains.filter(workableConstrain => workableConstrain.parsingTreeNode.constrainId === x.constrainId)[0];
          if (myConstrain.parsingTreeNode.constrain !== 0 && typeof myConstrain.parsingTreeNode.constrain === "number") {
            myConstrain.parsingTreeNode.constrainTouched = true;
            if (x.parsingTreeNodes[0].value === parsString.slice(slicedParsingString.length, parsString.length).slice(0, x.parsingTreeNodes[0].value.length)) {
              myConstrain.parsingTreeNode.constrain--;
              return this.parseNonTerminalRec(x, parsString.slice(slicedParsingString.length, parsString.length), usageCounter, workableConstrains);
            }
          }
        }

        if (typeof x.constrain !== "number" && x.constrain) {
          // @ts-ignore
          const myConstrain = workableConstrains.filter(workableConstrain => workableConstrain.parsingTreeNode.constrain.id === x.constrain.id + 1000000 + usageCounter)[0];
          this._constrainVariableCount.forEach(constrainVariable => {
            // @ts-ignore
            if (myConstrain.parsingTreeNode.constrain.id === constrainVariable.constrainId) {
              constrainVariable.count++;
            }
          });
          return this.parseNonTerminalRec(x, parsString.slice(slicedParsingString.length, parsString.length), usageCounter, workableConstrains);
        }

        if (typeof x.constrain !== "number") {
          return this.parseNonTerminalRec(x, parsString.slice(slicedParsingString.length, parsString.length), usageCounter, workableConstrains);
        }
        return [{parseString: '', isValid: false}];
      });
      const boolArray: NonTerminalAnswer[] = [];
      boolArrayTemp.forEach(x => {
        x.forEach(y => {
          boolArray.push(y);
        })
      })
      const result = boolArray.filter(({parseString: string, isValid: bool}) => bool)
      if (boolArray.length === 0) {
        return [{parseString: parsString.slice(slicedParsingString.length, parsString.length), isValid: true}]
      }
      if (result) {
        return result;
      }
    }
    return [{parseString: '', isValid: false}];
  }

  private findNodesForNonTerminalRec(id: number, edges: Edge[], constrainNodes: ConstrainNode[], nonTerminalConstrains: { parsingTreeNode: ParsingTreeNode; origConstrain: any }[]): ParsingTreeNode[] {
    const parsingTreeNodes: { parsingNode: ParsingTreeNode, nodeId: number }[] = [];

    edges = edges.filter(edge => {
      if (edge.source.id === id) {
        if ("value" in edge.target) {
          parsingTreeNodes.push({
            parsingNode: {value: edge.target.value, constrain: undefined, parsingTreeNodes: []},
            nodeId: edge.target.id
          });
        } else if ("name" in edge.target) {
          parsingTreeNodes.push({
            parsingNode: {
              value: '',
              name: edge.target.name,
              constrain: undefined,
              parsingTreeNodes: []
            }, nodeId: edge.target.id
          });
        } else {
          parsingTreeNodes.push({
            parsingNode: {value: '', constrain: undefined, parsingTreeNodes: []},
            nodeId: edge.target.id
          });
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
    parsingTreeNodes.forEach(x => x.parsingNode.parsingTreeNodes = this.findNodesForNonTerminalRec(x.nodeId, edges, constrainNodes, nonTerminalConstrains));
    constrainNodes.forEach(constrainNode => {
      if (constrainNode.constrain.source.id === id) {
        if (constrainNode.goalNode) {
          let parsingNode!: ParsingTreeNode;
          if (typeof constrainNode.constrain.constrain === "string") {
            parsingNode = {
              value: '',
              constrain: {variable: constrainNode.constrain.constrain, id: constrainNode.constrain.id},
              constrainTouched: false,
              parsingTreeNodes: [constrainNode.goalNode]
            };
          } else {
            parsingNode = {
              value: '',
              constrain: constrainNode.constrain.constrain,
              constrainId: constrainNode.constrain.id,
              constrainTouched: false,
              parsingTreeNodes: [constrainNode.goalNode]
            };
          }
          parsingTreeNodes.push({parsingNode: parsingNode, nodeId: 0});
          nonTerminalConstrains.push({parsingTreeNode: parsingNode, origConstrain: parsingNode.constrain});
        }
      }
    });
    return parsingTreeNodes.map(x => x.parsingNode);
  }

  private removeNonTerminalConstrains(){
    this._constrainVariableCount = this._constrainVariableCount.filter(constrainVariable => {

      for (let i = 0; i < this._nonTerminalTrees.length; i++) {
        for (let j = 0; j < this._nonTerminalTrees[i].constrains.length; j++) {
          const constrain = this._nonTerminalTrees[i].constrains[j].parsingTreeNode.constrain;
          if(typeof constrain !== 'number' && constrain){
            if(constrainVariable.constrainId === constrain.id){
              return false;
            }
          }
        }
      }
      return true;
    })
  }

}
