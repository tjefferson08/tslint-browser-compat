import * as ts from 'typescript';
import * as Lint from 'tslint';
import { collectIncompatibleBrowsers } from './MdnCompatData';
import { getLhsType, parseOptions } from './utils';
import { TYPESCRIPT_TYPE_MDN_MAPPING } from './tsMdnMapping';

const debug = process.env.DEBUG ? console.log : () => {};

export type BrowserTarget = {
  browserName: string;
  version: number;
};

export type Options = {
  browserTargets: BrowserTarget[];
};

const messageFor = ({ browserName, version }: BrowserTarget): string =>
  `${browserName}:${version}`;

export class Rule extends Lint.Rules.TypedRule {
  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithFunction(
      sourceFile,
      walk,
      parseOptions(this.ruleArguments),
      program.getTypeChecker()
    );
  }
}

function walk(ctx: Lint.WalkContext<Options>, checker: ts.TypeChecker) {
  function callback(nodeObj: ts.Node): void {
    if (nodeObj.kind === ts.SyntaxKind.PropertyAccessExpression) {
      const node = nodeObj as ts.PropertyAccessExpression;
      const lhsTsType = getLhsType(node, checker);

      if (!lhsTsType) {
        debug(
          `skipping... unable to determine LHS type for exp: ${node.getText()}`
        );
        return;
      }

      const rhsName = node.name.escapedText as string;
      const typeMetadata = TYPESCRIPT_TYPE_MDN_MAPPING[lhsTsType];

      if (!(typeMetadata && typeMetadata.whitelist[rhsName])) {
        debug(`skipped ${lhsTsType}.${rhsName}, it's not on the whitelist`);
        return;
      }

      const mdnNamespace = typeMetadata.mdnNamespace;
      const incompatibleBrowsers = collectIncompatibleBrowsers(
        { objectType: mdnNamespace, functionName: rhsName },
        ctx.options.browserTargets
      ).map(messageFor);

      if (incompatibleBrowsers.length > 0) {
        const isStaticFunction = lhsTsType.match(/Constructor$/);
        const typeForMessage = isStaticFunction
          ? `${mdnNamespace}.${rhsName}`
          : `${mdnNamespace}.prototype.${rhsName}`;

        ctx.addFailureAtNode(
          node,
          `${typeForMessage} is not allowed in browsers: ${incompatibleBrowsers.join(
            ', '
          )}`
        );
      }
    } else if (nodeObj.kind === ts.SyntaxKind.NewExpression) {
      const node = nodeObj as ts.NewExpression;
      const lhsTsType = getLhsType(node, checker);
      if (!lhsTsType) {
        debug(
          `skipping... unable to determine LHS type for exp: ${node.getText()}`
        );
        return;
      }

      const typeMetadata = TYPESCRIPT_TYPE_MDN_MAPPING[lhsTsType];

      if (!typeMetadata) {
        debug(`skipped ${lhsTsType} lookup, it's not on the whitelist`);
        return;
      }

      const incompatibleBrowsers = collectIncompatibleBrowsers(
        { objectType: typeMetadata.mdnNamespace, functionName: null },
        ctx.options.browserTargets
      ).map(messageFor);

      if (incompatibleBrowsers.length > 0) {
        const typeForMessage = `${typeMetadata.mdnNamespace} constructor`;

        ctx.addFailureAtNode(
          node,
          `${typeForMessage} is not allowed in browsers: ${incompatibleBrowsers.join(
            ', '
          )}`
        );
      }
    }
    return ts.forEachChild(nodeObj, callback);
  }

  return ts.forEachChild(ctx.sourceFile, callback);
}
