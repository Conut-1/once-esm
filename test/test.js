import { expect, it } from "vitest";
import once from "../index.js";

it("once(fn)", () => {
  let f = 0;
  function fn(g) {
    expect(f).toBe(0);
    f++;
    return f + g + this;
  }
  fn.ownProperty = {};
  const foo = once(fn);
  expect(fn.ownProperty).toBe(foo.ownProperty);
  expect(foo.called).toBeFalsy();
  for (let i = 0; i < 1e3; i++) {
    expect(f).toBe(i === 0 ? 0 : 1);
    const g = foo.call(1, 1);
    expect(foo.called).toBeTruthy();
    expect(g).toBe(3);
    expect(f).toBe(1);
  }
});

it("fn.once()", () => {
  once.proto();
  let f = 0;
  function fn(g) {
    expect(f).toBe(0);
    f++;
    return f + g + this;
  }
  const foo = fn.once();
  expect(foo.called).toBeFalsy();
  for (let i = 0; i < 1e3; i++) {
    expect(f).toBe(i === 0 ? 0 : 1);
    const g = foo.call(1, 1);
    expect(foo.called).toBeTruthy();
    expect(g).toBe(3);
    expect(f).toBe(1);
  }
});

it("once.strict with named function", () => {
  let f = 0;
  function fn(g) {
    expect(f).toBe(0);
    f++;
    return f + g + this;
  }
  fn.ownProperty = {};
  const foo = once.strict(fn);
  expect(fn.ownProperty).toBe(foo.ownProperty);
  expect(foo.called).toBeFalsy();
  const g = foo.call(1, 1);
  expect(foo.called).toBeTruthy();
  expect(g).toBe(3);
  expect(f).toBe(1);

  try {
    foo.call(2, 2);
    expect(true).toBeFalsy("strict once should throw exception on second call");
  } catch (err) {
    expect(err instanceof Error).toBeTruthy();
    expect(err.message).toBe("fn shouldn't be called more than once");
  }
});

it("fn.onceStrict()", () => {
  let f = 0;
  function fn(g) {
    expect(f).toBe(0);
    f++;
    return f + g + this;
  }
  const foo = fn.onceStrict();
  expect(foo.called).toBeFalsy();
  const g = foo.call(1, 1);
  expect(foo.called).toBeTruthy();
  expect(g).toBe(3);
  expect(f).toBe(1);

  try {
    foo.call(2, 2);
    expect(true).toBeFalsy("strict once should throw exception on second call");
  } catch (err) {
    expect(err instanceof Error).toBeTruthy();
    expect(err.message).toBe("fn shouldn't be called more than once");
  }
});

it("once.strict with anonymous function", () => {
  const foo = once.strict(function (g) {
    return g + 1;
  });
  expect(foo.called).toBeFalsy();

  const g = foo(1);
  expect(foo.called).toBeTruthy();
  expect(g).toBe(2);

  try {
    foo(2);
    expect(true).toBeFalsy("strict once should throw exception on second call");
  } catch (err) {
    expect(err instanceof Error).toBeTruthy();
    expect(err.message).toBe(
      "Function wrapped with `once` shouldn't be called more than once"
    );
  }
});

it("once.strict with custom error message", () => {
  const foo = once.strict(function (g) {
    return g + 1;
  });
  foo.onceError = "foo error";
  expect(foo.called).toBeFalsy();

  const g = foo(1);
  expect(foo.called).toBeTruthy();
  expect(g).toBe(2);

  try {
    foo(2);
    expect(true).toBeFalsy("strict once should throw exception on second call");
  } catch (err) {
    expect(err instanceof Error).toBeTruthy();
    expect(err.message).toBe("foo error");
  }
});
