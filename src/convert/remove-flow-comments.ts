import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { types } from "recast";
import { TransformerInput } from "./transformer";

const ESLINT_FLOW_RULE_PREFIX = "flowtype/";

const flowComments = [
  "@flow",
  "$FlowFixMe",
  "$FlowIssue",
  "$FlowExpectedError",
  "$FlowIgnore",
  ESLINT_FLOW_RULE_PREFIX, // ESLint flowtype rules
];

/***
 * Remove flowtype/ rules from eslint-disable-line or eslint-disable-next-line comments,
 * unless flowtype/ rules are the only rules.
 *
 * If flowtype/ rules are the only rules, the entire comment is removed.
 */
const stripOutFlowESLintRuleFromNonFlowRules = (comment: string): string => {
  const matches = comment.match(
    /^(.*)(eslint-disable-line|eslint-disable-next-line)\s+(.*)+/
  );
  if (!matches) {
    return comment;
  }
  const [, prefix, eslintDirective, rulesString] = matches;
  if (
    rulesString.includes(ESLINT_FLOW_RULE_PREFIX) &&
    rulesString.includes(",")
  ) {
    const rules = rulesString.split(",").map((rule) => rule.trim());
    if (rules.some((rule) => !rule.startsWith(ESLINT_FLOW_RULE_PREFIX))) {
      return `${prefix}${eslintDirective} ${rules
        .filter((rule) => !rule.startsWith(ESLINT_FLOW_RULE_PREFIX))
        .join(",")}`;
    }
  }
  return comment;
};

/**
 * Scan through top level programs, or code blocks and remove Flow-specific comments
 */
const removeTopLevelComments = (path: NodePath<t.Program>) => {
  if (path.node.body.length === 0) {
    return;
  }

  const nodes: Array<types.namedTypes.Node> = path.node.body;

  for (const rootNode of nodes) {
    const { comments } = rootNode;

    rootNode.comments =
      comments
        ?.map((comment) => {
          if (comment.value.includes("@noflow")) {
            return {
              ...comment,
              value: comment.value.replace(/@noflow/, "@ts-nocheck"),
            };
          }

          return {
            ...comment,
            value: comment.value
              .split("\n")
              .map((line) => stripOutFlowESLintRuleFromNonFlowRules(line))
              .filter((line) => !flowComments.some((c) => line.includes(c)))
              .join("\n"),
          };
        })
        ?.map((comment) => ({
          ...comment,
          value: stripOutFlowESLintRuleFromNonFlowRules(comment.value),
        }))
        ?.filter(
          (comment) => !flowComments.some((c) => comment.value.includes(c))
        )
        ?.filter((comment) => comment.value.trim()) || rootNode.comments;
  }
};

/**
 * Search the top level program, and blocks like functions and if statements for comments
 */
export function removeFlowComments({ file }: TransformerInput) {
  traverse(file, {
    enter({ node }) {
      // @ts-expect-error comments doesn't exist
      if (node.comments) {
        // @ts-expect-error comments doesn't exist
        node.comments = node.comments
          // @ts-expect-error comments doesn't exist
          ?.map((comment) => ({
            ...comment,
            value: stripOutFlowESLintRuleFromNonFlowRules(comment.value),
          }))
          ?.filter(
            // @ts-expect-error comments doesn't exist
            (comment) => !flowComments.some((c) => comment.value.includes(c))
          );
      }
    },
    Program(path) {
      removeTopLevelComments(path);
    },
  });
}
