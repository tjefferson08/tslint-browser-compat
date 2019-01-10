import * as ts from 'typescript';
import { BrowserTarget, Options } from './noUnsupportedInstanceMethodsRule';

import * as browserslist from 'browserslist';
export const debug = process.env.DEBUG ? console.log : () => {};

export const toString = (kind: ts.SyntaxKind): string =>
  (<any>ts).SyntaxKind[kind];

const parseBrowserslistTarget = (browserslistTarget: string): BrowserTarget => {
  const [browser, version] = browserslistTarget.split(' ');
  return {
    browserName: browser,
    version: Number(version)
  };
};

export const transformOptions = (ruleArgs: any[]): Options => {
  return {
    browserTargets: browserslist(
      ruleArgs.length === 0 ? undefined : ruleArgs
    ).map(parseBrowserslistTarget)
  };
};

export const getLhsType = (
  node: ts.PropertyAccessExpression | ts.NewExpression,
  checker: ts.TypeChecker
): string => {
  const lhsTypeObj = checker.getTypeAtLocation(node.expression);
  const lhsTsType = lhsTypeObj.symbol && lhsTypeObj.symbol.name;

  // Sometimes there's no "type" of the LHS (AFAICT) so just use the
  // expression itself, e.g. `Promise` as a type value
  // TODO: figure out how this works for real!
  return lhsTsType === undefined || lhsTsType === ts.InternalSymbolName.Type
    ? node.expression.getText()
    : lhsTsType;
};
