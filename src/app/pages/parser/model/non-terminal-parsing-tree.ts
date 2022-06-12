import {ParsingTreeNode} from "./parsing-tree-node";

export interface NonTerminalParsingTree{
  nodes: ParsingTreeNode[];
  name: string;
  constrains: { parsingTreeNode: ParsingTreeNode; origConstrain: any }[];
  usageCount: number;
}

export interface NonTerminalAnswer{
  parseString: string;
  isValid: boolean;
}
