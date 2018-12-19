/* Key is TS type name, value is namespace to look up in MDN
 * compatability data */
export const TYPESCRIPT_TYPE_MDN_MAPPING: {
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
  },
  IntersectionObserver: {
    mdnNamespace: 'IntersectionObserver',
    whitelist: {
      observe: true
    }
  }
};
