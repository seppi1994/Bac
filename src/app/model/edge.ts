import {Node} from "./node";

export interface Edge {
  source: Node;
  target: Node;
  left: boolean;
  right: boolean;
}
