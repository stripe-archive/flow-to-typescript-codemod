import {
  declarationsTransformRunner,
  expressionTransformRunner,
  jsxTransformRunner,
  hasJsxTransformRunner,
  importTransformRunner,
  jsxSpreadTransformRunner,
  patternTransformRunner,
  privateTypeTransformRunner,
  typeAnnotationTransformRunner,
  removeFlowCommentTransformRunner,
  reactNodeTransformRunner,
} from "./transform-runners";
import { Transformer } from "./transformer";
import { styledComponentTypes } from "./styled-component-types";

/**
 * Default chain of babel transforms to run. Order will be preserved.
 */
export const defaultTransformerChain: readonly Transformer[] = [
  hasJsxTransformRunner,
  jsxTransformRunner,
  privateTypeTransformRunner,
  expressionTransformRunner,
  declarationsTransformRunner,
  typeAnnotationTransformRunner,
  patternTransformRunner,
  jsxSpreadTransformRunner,
  importTransformRunner,
  removeFlowCommentTransformRunner,
  styledComponentTypes,
  reactNodeTransformRunner,
];
