export default {
  meta: {},
  create: () => {
    return {
      ReturnStatement: function(_node) {
        console.log('sup');
      }
    };
  }
};
