import * as ts from 'typescript';
import { Options } from './noUnsupportedInstanceMethodsRule';

export const toString = (kind: ts.SyntaxKind): string =>
  (<any>ts).SyntaxKind[kind];

export const parseOptions = (ruleArgs: any[]): Options => {
  if (ruleArgs.length === 0) {
    return {
      browserTargets: []
    };
  }

  const [browserTargetMap] = ruleArgs;
  return {
    browserTargets: Object.keys(browserTargetMap).map(browserName => ({
      browserName,
      version: browserTargetMap[browserName]
    }))
  };
};

export const getLhsType = (
  node: ts.PropertyAccessExpression | ts.NewExpression,
  checker: ts.TypeChecker
): string => {
  const lhsTypeObj = checker.getTypeAtLocation(node.expression);
  const lhsTsType = lhsTypeObj.symbol && lhsTypeObj.symbol.name;
  return lhsTsType === ts.InternalSymbolName.Type
    ? node.expression.getText()
    : lhsTsType;
};
