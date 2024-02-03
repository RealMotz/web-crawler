const {test, expect} = require('@jest/globals');
const { sort } = require("./report");

test('Sorts object in decreasing order', () => {
    const toSort = {"a": 1, "b": 2, "c": 3, "d": 4};
    const expected = [["d", 4], ["c", 3],["b", 2], ["a", 1]];
    const actual = sort(toSort);
    expect(actual).toEqual(expected);
});
