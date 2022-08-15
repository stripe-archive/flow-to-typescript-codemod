import { Diagnostic, ts } from "ts-morph";

/**
 * This is NOT an exhaustive list. But rather a list of errors that we found
 * that continued to break our TS build even though they were suppressed.
 *
 * Feel free to add additional error codes here as you find them.
 */
export const insuppressibleErrors = new Set([
  // Only named exports may use 'export type'.
  1383,
  // Cannot find name '{0}'.
  2304,
  // File '{0}' is not a module.
  2306,
  // Cannot find namespace '{0}'.
  2503,
  // Unused '@ts-expect-error' directive.
  2578,
  // The inferred type of '{0}' cannot be named without a reference to '{1}'. This is likely not portable. A type annotation is necessary.
  2742,
  // Exported variable '{0}' has or is using private name '{1}'.
  4025,
  // File '{0}' is not under 'rootDir' '{1}'. 'rootDir' is expected to contain all source files.
  6059,
  // File '{0}' is not listed within the file list of project '{1}'. Projects must list all files or use an 'include' pattern.
  6307,
]);

export function isDiagnosticSuppressible(
  diagnostic: Diagnostic<ts.Diagnostic>
): boolean {
  return !insuppressibleErrors.has(diagnostic.getCode());
}
