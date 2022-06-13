import {Injectable} from "@angular/core";
import {Edge} from "../../../shared/model/edge";
import {Constrain} from "../../../shared/model/constrain";
import {NonTerminalNode} from "../../../shared/model/non-terminal-node";
import {ParserService} from "../../parser/service/parser.service";
import {ParsingTree} from "../../parser/model/parsing-tree";
import {ParsingTreeNode} from "../../parser/model/parsing-tree-node";
import {NonTerminalParsingTree} from "../../parser/model/non-terminal-parsing-tree";

@Injectable({
  providedIn: 'root',
})
export class ExampleGeneratorService {

  private _nonTerminalTrees!: NonTerminalParsingTree[];

  constructor(private parserService: ParserService) {
  }

  process(edges: Edge[], constrains: Constrain[], nonTerminals: NonTerminalNode[], nonTerminalDefinition: NonTerminalNode[]): string {
    let workableConstrains = constrains.map(constrain => ({constrain: constrain.constrain, id: constrain.id, left: constrain.left, right: constrain.right, source: constrain.source, target: constrain.target}));
    this.changeVariableConstrainsToRandomNumber(workableConstrains);
    const [parsingTree, nonTerminalParsingTree] = this.parserService.createParsingTree(edges, constrains, nonTerminals, nonTerminalDefinition);
    this._nonTerminalTrees = nonTerminalParsingTree;
    let example: string = this.createExample(parsingTree);
    while (!this.parserService.parseString(example)){
      const [parsingTree2, nonTerminalParsingTree2] = this.parserService.createParsingTree(edges, workableConstrains, nonTerminals, nonTerminalDefinition);
      this._nonTerminalTrees = nonTerminalParsingTree2;
      example = this.createExample(parsingTree2)
    }
    return example;
  }

  private createExample(parsingTree: ParsingTree): string {
    return this.createExampleRec(parsingTree.nodes[this.getRandomNumber(parsingTree.nodes.length)]);
  }

  private createExampleRec(parsingTreeNode: ParsingTreeNode): string {

    if (parsingTreeNode.parsingTreeNodes.length === 0) {
      return parsingTreeNode.value;
    }
    if ('name' in parsingTreeNode && parsingTreeNode.name) {
      return this.nonTerminalExample(parsingTreeNode.name) + this.createExampleRec(parsingTreeNode.parsingTreeNodes[this.getRandomNumber(parsingTreeNode.parsingTreeNodes.length)]);
    }
    parsingTreeNode?.parsingTreeNodes.forEach(node => {
      if (typeof node.constrain === "number" && node.constrain !== 0) {
        node.constrain--;
        return node.value + this.createExampleRec(node.parsingTreeNodes[0])
      }

      return '';
    })
    return parsingTreeNode.value + this.createExampleRec(parsingTreeNode.parsingTreeNodes[this.getRandomNumber(parsingTreeNode.parsingTreeNodes.length)]);
  }

  private nonTerminalExample(variable: string): string {
    const parseTrees = this._nonTerminalTrees.filter(nonTerminalTree => nonTerminalTree.name === variable);
    const workConstrains = parseTrees[0].constrains.map(constrain => ({parsingTreeNode: constrain.parsingTreeNode, origConstrain: constrain.origConstrain}));

    return this.createNonTerExampleRec(parseTrees[0].nodes[this.getRandomNumber(parseTrees[0].nodes.length)], workConstrains);
  }

  private createNonTerExampleRec(parsingTreeNode: ParsingTreeNode, nonTerminalConstrains: { parsingTreeNode: ParsingTreeNode; origConstrain: any }[]): string {

    if (parsingTreeNode.parsingTreeNodes.length === 0) {
      return parsingTreeNode.value;
    }
    if ('name' in parsingTreeNode && parsingTreeNode.name) {
      return this.nonTerminalExample(parsingTreeNode.name) + this.createNonTerExampleRec(parsingTreeNode.parsingTreeNodes[this.getRandomNumber(parsingTreeNode.parsingTreeNodes.length)], nonTerminalConstrains);
    }
    parsingTreeNode?.parsingTreeNodes.forEach(node => {
      if (typeof node.constrain === "number" && node.constrain !== 0) {
        const nonTerminalConstrain = nonTerminalConstrains.find(nonTerminalConstrain => nonTerminalConstrain.parsingTreeNode.constrainId === node.constrainId);
        if(nonTerminalConstrain && nonTerminalConstrain.origConstrain !== 0){
          nonTerminalConstrain.origConstrain--;
          return node.value + this.createNonTerExampleRec(node.parsingTreeNodes[0], nonTerminalConstrains)
        }
      }
      return '';
    })
    return parsingTreeNode.value + this.createNonTerExampleRec(parsingTreeNode.parsingTreeNodes[this.getRandomNumber(parsingTreeNode.parsingTreeNodes.length)], nonTerminalConstrains);
  }

  private changeVariableConstrainsToRandomNumber(constrains: Constrain[]) {
    constrains.map(constrain => {
      if (typeof constrain.constrain === "string") {
        constrain.constrain = this.getRandomNumber(10)
      }
    })
  }

  private getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max)
  }

}
