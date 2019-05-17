import * as utils from '@typescript-eslint/experimental-utils';
// import * as ts from 'typescript';
// import { TSESTree } from '@typescript-eslint/typescript-estree';
const RuleCreator = utils.ESLintUtils.RuleCreator;
const getPropertyName = utils.ESLintUtils.getPropertyName;

const version = '1';

const createRule = RuleCreator(
  (name: string) =>
    `https://github.com/typescript-eslint/typescript-eslint/blob/v${version}/packages/eslint-plugin/docs/rules/${name}.md`
);

type TOptions = any[];
type TMessageIds = 'browserApiViolation';

const rule = createRule({
  name: 'no-unsupported-browser-apis',
  meta: {
    docs: {
      description: 'Disallow any browser APIs unless supported by browserslist',
      category: 'Possible Errors',
      recommended: false
    },
    messages: {
      browserApiViolation: 'not allowed!!'
    },
    schema: [],
    type: 'problem'
  },
  defaultOptions: [],
  create(context: utils.TSESLint.RuleContext<TMessageIds, TOptions>) {
    return {
      MemberExpression: node => {
        console.log('member exp');
        if (
          !(context && context.parserServices && context.parserServices.program)
        ) {
          throw new Error(
            'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.'
          );
        }
        const checker = context.parserServices.program.getTypeChecker();
        // const originalNode = context.parserServices.esTreeNodeToTSNodeMap!.get<
        //   TSESTree.MemberExpression
        // >(node);

        const type = checker.getTypeAtLocation(node.object);
        console.log(node, type);
        // if (
        //   (typeof type.symbol !== 'undefined' &&
        //     type.symbol.name === 'Array') ||
        //   (type.flags & ts.TypeFlags.StringLike) !== 0
        // ) {
        //   context.report({
        //     node,
        //     messageId: 'forInViolation'
        //   });
        // }
      },
      PropertyAccessExpression: () => console.log('prop access exp')
    };
  }
});
export const create = rule.create;
export const name = rule.create;
export const meta = rule.meta;
