import traverse from "@babel/traverse";
import { remove } from "./utils/common";
import { TransformerInput } from "./transformer";

/**
 * Styled components makes heavy usage of tagged template literals.
 * Types for the props provided to functions are unnecessary if a DefaultTheme is setup in the repository
 */
export function styledComponentTypes({
  file,
  state,
  reporter,
}: TransformerInput) {
  traverse(file, {
    Identifier(path) {
      const id = path.node;

      if (id.name === "PropsWithTheme") {
        if (
          path.parentPath?.parentPath &&
          path.parentPath?.parentPath.type === "TSTypeAnnotation"
        ) {
          remove(path.parentPath?.parentPath, state.config.filePath, reporter);
        }
      }
    },
  });
}
