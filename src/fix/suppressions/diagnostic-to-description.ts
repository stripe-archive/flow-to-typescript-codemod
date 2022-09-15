import { Diagnostic, DiagnosticMessageChain } from "ts-morph";

/**
 * Detect chains of errors, vs a single error
 */
function isDiagnosticMessageChain(
  message: string | DiagnosticMessageChain
): message is DiagnosticMessageChain {
  return typeof message !== "string";
}

/**
 * Check if TS error is actually a chain of multiple errors, and return the
 * main error message.
 */
function getDiagnosticMessage(diagnostic: Diagnostic): string {
  let messageText = diagnostic.getMessageText();

  if (isDiagnosticMessageChain(messageText)) {
    messageText = messageText.getMessageText();
  }

  return removeAbsoluteProjectPaths(messageText);
}

/**
 * Some diagnostic messages include absolute paths, which is not environment agnostic
 *
 * process.cwd() is hacky and will only work if the codemod is a sibling of the project being migrated.
 */
function removeAbsoluteProjectPaths(message: string): string {
  const projectAbsolutePath = process.cwd() + "/";
  return message.replaceAll(projectAbsolutePath, "");
}

/**
 * Format a TS error diagnostic as a formatted description
 */
export function diagnosticToDescription(diagnostic: Diagnostic): string {
  const messageText = getDiagnosticMessage(diagnostic);
  return `TS${diagnostic.getCode()} - ${messageText}`;
}
