export const thing = () => {
  [1, 2].forEach(() => console.log('hi'));
  for (var i in [1, 2]) {
    console.log(i);
  }
  return 'hi';
};
