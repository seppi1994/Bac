export interface ParsingTreeNode{
  value: string;
  constrain: number | ConstrainVariable | undefined;
  parsingTreeNodes: ParsingTreeNode[];
}

export type ConstrainVariable = {
  variable: string;
  id: number;
}
