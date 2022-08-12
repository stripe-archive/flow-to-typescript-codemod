import { Diagnostic } from "ts-morph";

export enum CommentType {
  Standard = "Standard",
  Jsx = "Jsx",
  Template = "Template",
}

export interface CommentToMake {
  position: number;
  commentType: CommentType;
  diagnostics: Array<Diagnostic>;
}
