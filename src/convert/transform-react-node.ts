import traverse from "@babel/traverse";
import { TransformerInput } from "./transformer";
import * as t from "@babel/types";
import { replaceWith } from "./utils/common";

/**
 * The codemod properly transforms the flow type of React.Node to typescript type React.ReactNode.
 * However, if our code directly imports Node from React (Rather than import * as React),
 * the codemod does not transform it to ReactNode.
 *
 * This transform specifically handles the case of converting the Node type into ReactNode when directly imported
 * from React.
 */
export function transformReactNode({
  file,
  state,
  reporter,
}: TransformerInput) {
  traverse(file, {
    Identifier(path) {
      if (
        path.node.name === "Node" &&
        path.parentPath?.parentPath &&
        path.parentPath?.parentPath.type === "TSTypeAnnotation"
      ) {
        // replaceWith(path.parentPath?.parentPath, state.config.filePath, reporter);
        replaceWith(
          path,
          t.identifier("ReactNode"),
          state.config.filePath,
          reporter
        );
      }
    },
  });
}
