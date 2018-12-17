import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.TypedRule {
  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithFunction(
      sourceFile,
      () => {},
      undefined,
      program.getTypeChecker()
    );
  }
}
