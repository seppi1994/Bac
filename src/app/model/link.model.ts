import {NodeModel} from "./node.model";

export interface LinkModel {
  source: NodeModel;
  target: NodeModel;
  left: boolean;
  right: boolean;
}
