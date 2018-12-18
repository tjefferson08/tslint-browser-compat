import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.TypedRule {
  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithFunction(
      sourceFile,
      walk,
      undefined,
      program.getTypeChecker()
    );
  }
}

function walk(ctx: Lint.WalkContext<void>, _checker: ts.TypeChecker) {
  function callback(nodeObj: ts.Node): void {
    if (nodeObj.kind === ts.SyntaxKind.PropertyAccessExpression) {
      const node = nodeObj as ts.PropertyAccessExpression;
      if (node.getText() === "[1, 2, 3].includes") {
        ctx.addFailureAtNode(node, `Array.prototype.includes is not allowed!`);
      }
    }

    return ts.forEachChild(nodeObj, callback);
  }

  return ts.forEachChild(ctx.sourceFile, callback);
}
