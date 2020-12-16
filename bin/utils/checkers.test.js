const { isMaxLen } = require('./checkers');

test("testing isMaxLen with ([], 2), should return true", () => {
  expect( isMaxLen( [1,2,3], 2 ) ).toBe(false);
});

test("testing isMaxLen with ([1,2,3,4], 3), should return false", () => {
  expect( isMaxLen( [1,2,3], 2 ) ).toBe(false);
});

test("testing isMaxLen with invalid input, should return false", () => {
  expect( isMaxLen( "hello", 2 ) ).toBe(false);
});