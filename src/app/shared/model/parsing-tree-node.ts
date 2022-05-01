export interface ParsingTreeNode{
  value: string;
  constrain: number | string;
  nodes: ParsingTreeNode[];
}
