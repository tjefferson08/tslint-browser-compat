/* Key is TS type name, value is namespace to look up in MDN
 * compatability data */
export const TYPESCRIPT_TYPE_MDN_MAPPING: {
  [key: string]: {
    mdnNamespace: string;
  };
} = {
  Array: {
    mdnNamespace: "Array"
  },
  ArrayConstructor: {
    mdnNamespace: "Array"
  },
  NodeListOf: {
    mdnNamespace: "NodeList"
  },
  IntersectionObserver: {
    mdnNamespace: "IntersectionObserver"
  }
};
