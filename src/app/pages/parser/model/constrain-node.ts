import {Constrain} from "../../../shared/model/constrain";
import {ParsingTreeNode} from "./parsing-tree-node";

export interface ConstrainNode{
  constrain: Constrain;
  goalNode: ParsingTreeNode | undefined;
}
