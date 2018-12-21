/* Key is TS type name, value is namespace to look up in MDN
 * compatability data */
export const TYPESCRIPT_TYPE_MDN_MAPPING: {
  [key: string]: {
    mdnNamespace: string;
  };
} = {
  Array: {
    mdnNamespace: 'Array'
  },
  ArrayConstructor: {
    mdnNamespace: 'Array'
  },
  NodeListOf: {
    mdnNamespace: 'NodeList'
  },
  IntersectionObserver: {
    mdnNamespace: 'IntersectionObserver'
  }
};

export const staticMapLookup = (key: string) =>
  TYPESCRIPT_TYPE_MDN_MAPPING[key];

export const deriveMdnNamespace = (typescriptType: string) => {
  if (typescriptType.match(/Constructor$/)) {
    return typescriptType.replace(/Constructor$/, '');
  }

  if (typescriptType.match(/Of$/)) {
    return typescriptType.replace(/Of$/, '');
  }

  return typescriptType;
};
