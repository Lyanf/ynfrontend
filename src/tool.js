function generateLabelAndValueObjsByArray(array) {
  return array.map((item) => ({ key: item, label: item, value: item }));
}

// eslint-disable-next-line import/prefer-default-export
export { generateLabelAndValueObjsByArray };
