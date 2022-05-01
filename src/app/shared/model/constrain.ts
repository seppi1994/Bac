import {Node} from "./node";

export interface Constrain{
  id: number
  source: Node;
  target: Node;
  left: boolean;
  right: boolean;
  constrain: number | string;
}
