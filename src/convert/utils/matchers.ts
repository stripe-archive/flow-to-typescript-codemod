import * as t from "@babel/types";

export function isIdentifierNamed(name: string) {
  return (node: t.TSEntityName) => t.isIdentifier(node) && node.name === name;
}

/**
 * Utility for quickly checking qualifed type like React.Node
 * @param leftName - Left side of the type, e.g. React
 * @param rightName - Right side of the type
 */
function matchesFullyQualifiedName(leftName: string, rightName: string) {
  const leftMatcher = isIdentifierNamed(leftName);
  const rightMatcher = isIdentifierNamed(rightName);
  return (node: t.Identifier | t.TSQualifiedName) =>
    t.isTSQualifiedName(node) &&
    leftMatcher(node.left) &&
    rightMatcher(node.right);
}

/**
 * Utility for checking React.* (e.g. matches both React.Node and Node)
 */
export function matchesReact(specifierName: string) {
  return (node: t.Identifier | t.TSQualifiedName) =>
    isIdentifierNamed(specifierName)(node) ||
    matchesFullyQualifiedName("React", specifierName)(node);
}
