import {Injectable} from "@angular/core";
import {Edge} from "../../../model/edge";
import {ParsingTreeNode} from "../../../model/parsing-tree-node";
import {ParsingTree} from "../../../model/parsing-tree";
import {Store} from "@ngrx/store";
import {updateParsingTree} from "../../../store/app.actions";

@Injectable({
  providedIn: 'root',
})
export class ParserService{

  constructor(private store: Store) {
  }


  createParsingTree(edges: Edge[]){
    const workableEdges = edges.map(edges => ({...edges}));
    const parsingTree: ParsingTree = {nodes: this.findNodesRec(0, workableEdges)};
    this.store.dispatch(updateParsingTree({parsingTree: parsingTree}))
  }


  private findNodesRec(id: number, workableEdges: Edge[]): ParsingTreeNode[]{
    const parsingTreeNodes: {parsingNode: ParsingTreeNode, nodeId: number}[] = [];

    workableEdges.filter(edge => {
      if (edge.source.id === id) {
        parsingTreeNodes.push({
          parsingNode: {value: edge.target.value,
                        constrain: edge.constrain,
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
}
