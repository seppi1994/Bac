export interface ParsingTreeNode{
  value: string;
  constrain: number | string | undefined;
  parsingTreeNodes: ParsingTreeNode[];
}
