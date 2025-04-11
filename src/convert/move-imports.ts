import * as t from "@babel/types";
import traverse from "@babel/traverse";
import { TransformerInput } from "./transformer";

/**
 * Add or remove imports
 * @param state
 * @param file
 */
export function moveImports({ state, file }: TransformerInput) {
  traverse(file, {
    Program: {
      exit(path) {
        const removeImportDeclaration = (
          importDeclaration: t.ImportDeclaration
        ) => {
          path.node.body = path.node.body.filter(
            (node) =>
              !(
                t.isImportDeclaration(node) &&
                node.source.value === importDeclaration.source.value
              )
          );
        };

        const insertImportDeclaration = (
          importDeclaration: t.ImportDeclaration
        ) => {
          path.node.body = [importDeclaration, ...path.node.body];
        };

        if (state.usedUtils) {
          const importDeclaration = t.importDeclaration(
            [t.importSpecifier(t.identifier("Flow"), t.identifier("Flow"))],
            t.stringLiteral("flow-to-typescript-codemod")
          );
          insertImportDeclaration(importDeclaration);
        }

        const importDeclarations = path.node.body.reduce<
          Array<t.ImportDeclaration>
        >(
          (agg, node) =>
            t.isImportDeclaration(node) ? agg.concat([node]) : agg,
          []
        );
        const reactRouterDomImportDeclaration: t.ImportDeclaration | undefined =
          importDeclarations.find(
            (node) => node.source.value === "react-router-dom"
          );

        if (reactRouterDomImportDeclaration) {
          const locationLocalName: string | undefined =
            reactRouterDomImportDeclaration.specifiers.find(
              (s) =>
                s.type === "ImportSpecifier" &&
                s.imported.type === "Identifier" &&
                s.imported.name === "Location"
            )?.local.name;
          const historyLocalName: string | undefined =
            reactRouterDomImportDeclaration.specifiers.find(
              (s) =>
                s.type === "ImportSpecifier" &&
                s.imported.type === "Identifier" &&
                s.imported.name === "RouterHistory"
            )?.local.name;

          const newImportSpecifiers = [
            !!historyLocalName &&
              t.importSpecifier(
                t.identifier(historyLocalName),
                t.identifier("History")
              ),
            !!locationLocalName &&
              t.importSpecifier(
                t.identifier(locationLocalName),
                t.identifier("Location")
              ),
          ].filter(Boolean) as t.ImportSpecifier[];

          if (newImportSpecifiers.length > 0) {
            reactRouterDomImportDeclaration.specifiers =
              reactRouterDomImportDeclaration.specifiers.filter(
                (s) =>
                  !(
                    s.type === "ImportSpecifier" &&
                    s.imported.type === "Identifier" &&
                    (s.imported.name === "Location" ||
                      s.imported.name === "RouterHistory")
                  )
              );
            if (reactRouterDomImportDeclaration.specifiers.length === 0) {
              removeImportDeclaration(reactRouterDomImportDeclaration);
            }

            const historyImportDeclaration = importDeclarations.find(
              (node) => node.source.value === "history"
            );

            if (historyImportDeclaration) {
              historyImportDeclaration.specifiers = [
                ...newImportSpecifiers,
                ...historyImportDeclaration.specifiers,
              ];
            } else {
              insertImportDeclaration(
                t.importDeclaration(
                  newImportSpecifiers,
                  t.stringLiteral("history")
                )
              );
            }
          }
        }
      },
    },
  });
}
