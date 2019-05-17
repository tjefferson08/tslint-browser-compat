import * as utils from '@typescript-eslint/experimental-utils';
import * as ts from 'typescript';
// import { TSESTree } from '@typescript-eslint/typescript-estree';

const RuleCreator = utils.ESLintUtils.RuleCreator;
const version = '1';

const createRule = RuleCreator(
  (name: string) =>
    `https://github.com/typescript-eslint/typescript-eslint/blob/v${version}/packages/eslint-plugin/docs/rules/${name}.md`
);

type TOptions = any[];
type TMessageIds = 'forInViolation';

const rule = createRule({
  name: 'no-for-in-array',
  meta: {
    docs: {
      description: 'Disallow iterating over an array with a for-in loop',
      category: 'Best Practices',
      recommended: false
    },
    messages: {
      forInViolation:
        'For-in loops over arrays are forbidden. Use for-of or array.forEach instead.'
    },
    schema: [],
    type: 'problem'
  },
  defaultOptions: [],
  create(context: utils.TSESLint.RuleContext<TMessageIds, TOptions>) {
    return {
      ForInStatement(node) {
        if (
          !(context && context.parserServices && context.parserServices.program)
        ) {
          throw new Error(
            'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.'
          );
        }
        const checker = context.parserServices.program.getTypeChecker();
        const originalNode = context!.parserServices!.esTreeNodeToTSNodeMap!.get<
          ts.ForInStatement
        >(node);

        const type = checker.getTypeAtLocation(originalNode.expression);

        if (
          (typeof type.symbol !== 'undefined' &&
            type.symbol.name === 'Array') ||
          (type.flags & ts.TypeFlags.StringLike) !== 0
        ) {
          context.report({
            node,
            messageId: 'forInViolation'
          });
        }
      }
    };
  }
});
export const create = rule.create;
export const name = rule.create;
export const meta = rule.meta;
