import { debug } from './utils';

const MdnData = require('mdn-browser-compat-data');
const mdnData: any = MdnData;

// functionName is null for `new Identifier()` expressions
type FunctionLookupData = { objectType: string; functionName: string | null };
type BrowserTarget = { browserName: string; version: number };

type QuerySuccess = {
  type: 'success';
  supportEntry: { [key: string]: { version_added: any } };
};
type NoResultsFailure = {
  type: 'no-mdn-namespace';
  message: string;
};
type LookupFailure = {
  type: 'lookup-failure';
  message: string;
};
type QueryResult = QuerySuccess | NoResultsFailure | LookupFailure;

/* E.g. look for the Array.from compatabilty entry by passing 'Array'
 * and 'from' as parameters */
export const query = ({
  objectType,
  functionName
}: FunctionLookupData): QueryResult => {
  try {
    if (mdnData.javascript.builtins[objectType]) {
      const supportEntry =
        functionName === null
          ? mdnData.javascript.builtins[objectType].__compat.support
          : mdnData.javascript.builtins[objectType][functionName].__compat
              .support;
      return { type: 'success', supportEntry };
    }

    if (mdnData.api[objectType]) {
      const supportEntry =
        functionName === null
          ? mdnData.api[objectType].__compat.support
          : mdnData.api[objectType][functionName].__compat.support;
      return { type: 'success', supportEntry };
    }
    return {
      type: 'no-mdn-namespace',
      message: `No MDN namespace was found for ${objectType}.${functionName}`
    };
  } catch (_err) {
    return {
      type: 'lookup-failure',
      message: `Couldn't look up ${objectType}.${functionName} in MDN browser support data`
    };
  }
};

// Check a particular function against a browser target
export const isFeatureSupported = (
  functionLookupData: FunctionLookupData,
  browserTarget: BrowserTarget
) => {
  const { browserName, version } = browserTarget;
  const queryResult = query(functionLookupData);

  if (
    queryResult.type === 'lookup-failure' ||
    queryResult.type === 'no-mdn-namespace'
  ) {
    debug(queryResult.message);
    return true;
  }

  // `version_added` can be true, false, null, or a numeric version
  // (unfortunately represented as a string)
  const versionAdded = queryResult.supportEntry[browserName].version_added;

  if (versionAdded === true) {
    return true;
  }

  if (!versionAdded) {
    return false;
  }

  return Number(versionAdded) <= version;
};

export const collectIncompatibleBrowsers = (
  functionLookupData: FunctionLookupData,
  browserTargets: BrowserTarget[]
) =>
  browserTargets.filter(
    browserTarget => !isFeatureSupported(functionLookupData, browserTarget)
  );
