import {Injectable} from "@angular/core";
import {Edge} from "../../../shared/model/edge";
import {Constrain} from "../../../shared/model/constrain";
import {NonTerminalNode} from "../../../shared/model/non-terminal-node";
import {ParserService} from "../../parser/service/parser.service";
import {ParsingTree} from "../../parser/model/parsing-tree";
import {ParsingTreeNode} from "../../parser/model/parsing-tree-node";

@Injectable({
  providedIn: 'root',
})
export class ExampleGeneratorService {

  constructor(private parserService: ParserService) {
  }

  process(edges: Edge[], constrains: Constrain[], nonTerminals: NonTerminalNode[]): string {
    let workableConstrains = constrains.map(constrain => ({...constrain}));
    this.changeVariableConstrainsToRandomNumber(workableConstrains);
    const parsingTree: ParsingTree = this.parserService.createParsingTree(edges, workableConstrains, nonTerminals);
    console.log(parsingTree)
    return this.createExample(parsingTree);
  }

  private createExample(parsingTree: ParsingTree): string{
    return this.createExampleRec(parsingTree.nodes[this.getRandomNumber(parsingTree.nodes.length)]);
  }

  private createExampleRec(parsingTreeNode: ParsingTreeNode): string {
    if (parsingTreeNode.parsingTreeNodes.length === 0){
      return parsingTreeNode.value;
    }
    parsingTreeNode?.parsingTreeNodes.forEach(node => {
      if (typeof node.constrain === "number" && node.constrain !== 0){
        node.constrain--;
        return node.value + this.createExampleRec(node.parsingTreeNodes[0])
      }
      return '';
    })
    // console.log(parsingTreeNode)
    return parsingTreeNode.value + this.createExampleRec(parsingTreeNode.parsingTreeNodes[this.getRandomNumber(parsingTreeNode.parsingTreeNodes.length)]);
  }

  private changeVariableConstrainsToRandomNumber(constrains: Constrain[]){
    constrains.map(constrain => {
      if(typeof constrain.constrain === "string"){
        console.log(constrain.constrain)
        constrain.constrain = this.getRandomNumber(10)
      }
    })
  }

  private getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max)
  }

}
