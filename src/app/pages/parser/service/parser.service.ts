import {Injectable} from "@angular/core";
import {Edge} from "../../../shared/model/edge";
import {ParsingTreeNode} from "../../../shared/model/parsing-tree-node";
import {ParsingTree} from "../../../shared/model/parsing-tree";
import {Store} from "@ngrx/store";
import {updateParsingTree} from "../../../store/app.actions";

@Injectable({
  providedIn: 'root',
})
export class ParserService{

  private parsingTree!: ParsingTree;

  constructor(private store: Store) {
  }

  public parseString(parseString: string): boolean{
    const boolArray = this.parsingTree?.nodes.map(x => this.parsingRecursion(x, parseString));
    const result = boolArray.find(x => x);
    return result ? result : false;
  }

  public createParsingTree(edges: Edge[]): void{
    const workableEdges = edges.map(edges => ({...edges}));
    const parsingTree: ParsingTree = {nodes: this.findNodesRec(0, workableEdges)};
    console.log(parsingTree)
    this.store.dispatch(updateParsingTree({parsingTree: parsingTree}));
    this.parsingTree = parsingTree;
  }

  private findNodesRec(id: number, workableEdges: Edge[]): ParsingTreeNode[]{
    const parsingTreeNodes: {parsingNode: ParsingTreeNode, nodeId: number}[] = [];

    workableEdges.filter(edge => {
      if (edge.source.id === id) {
        parsingTreeNodes.push({
          parsingNode: {value: edge.target.value,
                        constrain: 0,
                        nodes: []},
          nodeId: edge.target.id})
        return false;
      }else {
        return true;
      }
    });

    parsingTreeNodes.map(x => x.parsingNode.nodes = this.findNodesRec(x.nodeId, workableEdges))
    return parsingTreeNodes.map(x => x.parsingNode);
  }

  private parsingRecursion(parsingTreeNode: ParsingTreeNode, parsString: string): boolean{
    console.log("aa. " + parsString)
    const slicedParsingString = parsString.slice(0, parsingTreeNode.value.length);
    console.log("ff. " + parsString)
    if(slicedParsingString === parsingTreeNode.value){
      const boolArray = parsingTreeNode.nodes.map(x => this.parsingRecursion(x, parsString.slice(slicedParsingString.length, parsString.length)));
      console.log(parsingTreeNode.value)
      const result = boolArray.find(x => x)
      if (result || ((parsString.length === parsingTreeNode.value.length) && (boolArray.length === 0))){
        console.log(parsingTreeNode.value)
        console.log(parsingTreeNode.value.length)
        console.log(parsString)
        console.log(parsString.length)

        console.log(boolArray)
          return true;
      }
    }
    return false;
  }
}
