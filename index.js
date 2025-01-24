import wrappy from "wrappy";

const module = wrappy(once);
module.strict = wrappy(onceStrict);
module.proto = once(function () {
  Object.defineProperty(Function.prototype, "once", {
    value: function () {
      return once(this);
    },
    configurable: true,
  });

  Object.defineProperty(Function.prototype, "onceStrict", {
    value: function () {
      return onceStrict(this);
    },
    configurable: true,
  });
});

export default module;

function once(fn) {
  function f(...args) {
    if (f.called) return f.value;
    f.called = true;
    return (f.value = fn.apply(this, args));
  }
  f.called = false;
  return f;
}

function onceStrict(fn) {
  function f(...args) {
    if (f.called) throw new Error(f.onceError);
    f.called = true;
    return (f.value = fn.apply(this, args));
  }
  const name = fn.name || "Function wrapped with `once`";
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f;
}
