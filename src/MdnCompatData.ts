const MdnData = require('mdn-browser-compat-data');
const mdnData: any = MdnData;

type FunctionLookupData = { objectType: string; functionName: string };
type BrowserTarget = { browserName: string; version: number };

/* E.g. look for the Array.from compatabilty entry by passing 'Array'
 * and 'from' as parameters */
export const query = ({ objectType, functionName }: FunctionLookupData) => {
  try {
    if (mdnData.javascript.builtins[objectType]) {
      return mdnData.javascript.builtins[objectType][functionName].__compat
        .support;
    }

    if (mdnData.api[objectType]) {
      return mdnData.api[objectType][functionName].__compat.support;
    }
  } catch (_err) {
    throw new Error(
      `Couldn't look up ${objectType}.${functionName} in MDN browser support data`
    );
  }
};

// Check a particular function against a browser target
export const isFeatureSupported = (
  functionLookupData: FunctionLookupData,
  browserTarget: BrowserTarget
) => {
  const { browserName, version } = browserTarget;
  const supportEntry = query(functionLookupData);

  // `version_added` can be true, false, null, or a numeric version
  // (unfortunately represented as a string)
  const versionAdded = supportEntry[browserName].version_added;

  if (versionAdded === true) {
    return true;
  }

  if (!versionAdded) {
    return false;
  }

  return Number(versionAdded) <= version;
};
