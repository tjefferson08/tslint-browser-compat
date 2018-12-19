import * as ts from 'typescript';
import * as Lint from 'tslint';
import { isFeatureSupported } from './MdnCompatData';

const debug = process.env.DEBUG ? console.log : () => {};

type Options = {
  [key: string]: number;
};

const parseOptions = (ruleArgs: any[]): Options =>
  ruleArgs.length > 0 ? ruleArgs[0] : {};

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

/* Key is TS type name, value is namespace to look up in MDN
 * compatability data */
const TYPESCRIPT_TYPE_MDN_MAPPING: {
  [key: string]: {
    mdnNamespace: string;
    whitelist: {
      [key: string]: boolean;
    };
  };
} = {
  Array: {
    mdnNamespace: 'Array',

    /* for now, only lint against a known working whitelist of
     * functions */
    whitelist: {
      includes: true
    }
  },
  ArrayConstructor: {
    mdnNamespace: 'Array',
    whitelist: {
      from: true
    }
  },
  NodeListOf: {
    mdnNamespace: 'NodeList',
    whitelist: {
      forEach: true
    }
  }
};

function walk(ctx: Lint.WalkContext<Options>, checker: ts.TypeChecker) {
  function callback(nodeObj: ts.Node): void {
    if (nodeObj.kind === ts.SyntaxKind.PropertyAccessExpression) {
      const node = nodeObj as ts.PropertyAccessExpression;
      const lhsTypeObj = checker.getTypeAtLocation(node.expression);
      const lhsTsType = lhsTypeObj.symbol && lhsTypeObj.symbol.name;

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

      Object.keys(ctx.options).forEach(browserName => {
        const isSupported = isFeatureSupported(
          { objectType: mdnNamespace, functionName: rhsName },
          { browserName, version: ctx.options[browserName] }
        );

        if (!isSupported) {
          const isStaticFunction = lhsTsType.match(/Constructor$/);
          const typeForMessage = isStaticFunction
            ? `${mdnNamespace}.${rhsName}`
            : `${mdnNamespace}.prototype.${rhsName}`;

          ctx.addFailureAtNode(node, `${typeForMessage} is not allowed!`);
        }
      });
    }
    ts.forEachChild(nodeObj, callback);
    return;
  }

  ts.forEachChild(ctx.sourceFile, callback);
  return;
}
