export interface ParsingTreeNode{
  value: string;
  name?: string;
  constrain: number | ConstrainVariable | undefined;
  constrainId?: number;
  constrainTouched?: boolean;
  parsingTreeNodes: ParsingTreeNode[];
}

export type ConstrainVariable = {
  variable: string;
  id: number;
}

// export type ConstrainNumber = {
//   number: number;
//   id: number;
// }
