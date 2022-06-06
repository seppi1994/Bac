import {Node} from "./node";
import {NonTerminalNode} from "./non-terminal-node";
import {EndNode} from "./end-node";

export interface Edge {
  id: number;
  source: Node | NonTerminalNode | EndNode;
  target: Node | NonTerminalNode | EndNode;
  left?: boolean;
  right?: boolean;
}
