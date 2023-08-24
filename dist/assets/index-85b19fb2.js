var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const main = "";
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c2) => c2 ? c2.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction(
  (str) => str.charAt(0).toUpperCase() + str.slice(1)
);
const toHandlerKey = cacheStringFunction(
  (str) => str ? `on${capitalize(str)}` : ``
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect2) {
  const { deps } = effect2;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect2 of effects) {
    if (effect2.computed) {
      triggerEffect(effect2);
    }
  }
  for (const effect2 of effects) {
    if (!effect2.computed) {
      triggerEffect(effect2);
    }
  }
}
function triggerEffect(effect2, debuggerEventExtraInfo) {
  if (effect2 !== activeEffect || effect2.allowRecurse) {
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  }
}
function getDepFromReactive(object, key) {
  var _a;
  return (_a = targetMap.get(object)) == null ? void 0 : _a.get(key);
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const get$1 = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set$1 = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has$1(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get: get$1,
  set: set$1,
  deleteProperty,
  has: has$1,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(
      method,
      false,
      false
    );
    readonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      false
    );
    shallowInstrumentations2[method] = createIterableMethod(
      method,
      false,
      true
    );
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    {
      triggerEffects(dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object) {
  const ret = isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(
    source,
    key,
    defaultValue
  );
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function warn(msg, ...args) {
  return;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(
        render.call(
          proxyToUse,
          proxyToUse,
          renderCache,
          props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return attrs;
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          props,
          null
          /* we know it doesn't need it */
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  var _a;
  const instance = getCurrentScope() === ((_a = currentInstance) == null ? void 0 : _a.scope) ? currentInstance : null;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some(
        (v, i) => hasChanged(v, oldValue[i])
      ) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect.run.bind(effect),
      instance && instance.suspense
    );
  } else {
    effect.run();
  }
  const unwatch = () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached && cached[i])
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index] = ret;
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v) => c2.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
          /* treat default function as factory */
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to, m2, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else
          ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(
            rootComponent,
            rootProps
          );
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = null;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else
      ;
  }
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
              /* isAbsent */
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
              /* isAbsent */
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
  return match ? match[2] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(
        children,
        instance.slots = {}
      );
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          );
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      isSVG,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      isSVG,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        isSVG && type !== "foreignObject",
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(
            el,
            key,
            null,
            props[key],
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          isSVG
        );
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(
                el,
                key,
                prev,
                next,
                isSVG,
                n1.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(
        el,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        isSVG
      );
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              isSVG,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(
            el,
            key,
            prev,
            next,
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        n2.children,
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          isSVG,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(
      instance,
      initialVNode,
      container,
      anchor,
      parentSuspense,
      isSVG,
      optimized
    );
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m: m2, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            isSVG
          );
          initialVNode.el = subTree.el;
        }
        if (m2) {
          queuePostRenderEffect(m2, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u: u2, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          isSVG
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u2) {
          queuePostRenderEffect(u2, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => effect.run();
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs();
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref2,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          optimized,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(
      internals
    );
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u2, v, c2;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u2 = 0;
      v = result.length - 1;
      while (u2 < v) {
        c2 = u2 + v >> 1;
        if (arr[result[c2]] < arrI) {
          u2 = c2 + 1;
        } else {
          v = c2;
        }
      }
      if (arrI < arr[result[u2]]) {
        if (u2 > 0) {
          p2[i] = result[u2 - 1];
        }
        result[u2] = i;
      }
    }
  }
  u2 = result.length;
  v = result[u2 - 1];
  while (u2-- > 0) {
    result[u2] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
      /* isBlock */
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref2,
  ref_key,
  ref_for
}) => {
  if (typeof ref2 === "number") {
    ref2 = "" + ref2;
  }
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
let internalSetCurrentInstance;
let globalCurrentInstanceSetters;
let settersKey = "__VUE_INSTANCE_SETTERS__";
{
  if (!(globalCurrentInstanceSetters = getGlobalThis()[settersKey])) {
    globalCurrentInstanceSetters = getGlobalThis()[settersKey] = [];
  }
  globalCurrentInstanceSetters.push((i) => currentInstance = i);
  internalSetCurrentInstance = (instance) => {
    if (globalCurrentInstanceSetters.length > 1) {
      globalCurrentInstanceSetters.forEach((s) => s(instance));
    } else {
      globalCurrentInstanceSetters[0](instance);
    }
  };
}
const setCurrentInstance = (instance) => {
  internalSetCurrentInstance(instance);
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [instance.props, setupContext]
    );
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      }
    }
  ));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      get attrs() {
        return getAttrsProxy(instance);
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
const version = "3.3.4";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    el._value = value;
    const oldValue = tag === "OPTION" ? el.getAttribute("value") : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m2;
    while (m2 = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m2[0].length);
      options[m2[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p$1 = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p$1.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(
      el,
      key,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el._assign = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign = el._assign;
      if (isArray(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign(cloned);
      } else {
        assign(getCheckboxValue(el, checked));
      }
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el._assign = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  if (isArray(value)) {
    el.checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    el.checked = value.has(vnode.props.value);
  } else if (value !== oldValue) {
    el.checked = looseEqual(value, getCheckboxValue(el, true));
  }
}
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const _imports_0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAASCAYAAAC6u+tBAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TxSItDhYUcchQnSyIitRNq1CECqVWaNXB5NIvaNKQpLg4Cq4FBz8Wqw4uzro6uAqC4AeIq4uToouU+L+k0CLGg+N+vLv3uHsHCI0KU82ucUDVLCOdiIvZ3KrY84oAQhhADDMSM/W5VCoJz/F1Dx9f76I8y/vcnyOk5E0G+ETiWaYbFvEG8fSmpXPeJw6zkqQQnxOPGXRB4keuyy6/cS46LPDMsJFJzxOHicViB8sdzEqGSjxFHFFUjfKFrMsK5y3OaqXGWvfkLwzmtZVlrtMcRgKLWEIKImTUUEYFFqK0aqSYSNN+3MM/5PhT5JLJVQYjxwKqUCE5fvA/+N2tWZiccJOCcaD7xbY/RoCeXaBZt+3vY9tungD+Z+BKa/urDSD2SXq9rUWOgL5t4OK6rcl7wOUOMPikS4bkSH6aQqEAvJ/RN+WA/lugd83trbWP0wcgQ10lb4CDQ2C0SNnrHu8OdPb275lWfz/5t3LdEfCtVwAAAAZiS0dEAAAA/wBAMQfOAgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cIDgAHA8FyehUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAJ5UlEQVRYw82Ye3BU1R3Hv+ec+9i7u9lNFsIjy5IyICSKoGgByRjC+MChiS1q0YHmBUQQwaHTOk5HW+vQqYxTtTMIBpANBIIGaKkyOrUKhJdAUGYEpSo1JEAgQJJ9ZLOPe+49p38IM5Zngiv099edO+f3Pb/f+Zw5v/M7BFexhj0NtO1E24Mut6vAMIwi0zRvYZT2F0KCMQpFUcEtbkspOzjnxyCxK5FI7LWEaJj+xBOdSIPt3r1b//bbb19ijJURQsT538RhGHA5nR26rj81adKkPdfS2bJlSx9d13dFu6JebnJIKUEogRRSlVJGHYZj07Chw14bPXr02d7E94933yXhUOglxlghocSSQiIjIwOZWZlQmII+ffrsy8/Pf6EnWvX19VNt2/6LlEJKCQghiJQSbrf7nUcfffT5748lVxJZvXp1pdPpDKqqAilhR6PRb6SUR0FIi7DtTsaYwhjLATBUSulXFMWv67pDSgnbtvH4448TpNFqa2v/Ril9RFEUTJxYiOaWFnDOiwrvLdzRE//Vq1fruq43E0oGUEIhhIAQ4mx3d/frVVVVi39ofG+99Val0+lcLqVU8/Ly0K9fP7S3t6O9o338A/c/sL+nOhs2bDgphPATQmBy81Q0Eh3/9NNPn7h4nHLxj4+3byORztC7uq6XuN1utLe3H3jsscfG9mTS6urqiYZhLFcUZQTSbKZpNhqG8YiiKAiFw+jj64Phw4f3CFowGHQSQnZLKQdAAKZtpiilr06fPv35dMU3e/bsmmXV1Ye8GRmfHDlyREulUiCEQFPU+QB6BG7NmjW/Nk3TbxgGEonEydzBuUMLCwvNy42lF//ojnbN0nW9ZNiwofD5fBg5etRTPQ1+7ty5O8rLy/Pi8XhFusF5PJ4wpRSEEHgyPAgMDvTIb/369QWGYYRUVb1TCAHO+a7i4mJXOqFdsHlz534Wj8cLGGOyqakJ3d3d8GZl/mr79u1/uJZvTU3NRMbYa5qmIZlMhjxe7/ArQbssOE3X7r9wilJKEe7onNfbBKqqqtake1GklJDyuxKnaRqELa5V05S6urrdlNJdADTbtsNCiPyysrLCzMxMGz+SVVVVfco5LyKEoK2tDfHuOEaOHPnHlGn+7ko+K1euHKsoyseapkEIwZOp1OiHS0oSV5vnEnCRSOSfyWQShw4fAqUUHq9n5mcHP9v34UcfDsJNtO/AAYwxxGIxJJNJ6ypH4/OxWCxKKS2wLItwzucdb23NLisr++pGxFpeXr7TFmIKpRTNzc04e+4sSSYSf06mkr+5eOyyZcvG6Lq+Q9M0RUoJzvl9s2bOPHGtOS57gVi7du2bhJC5ABAIBJCVlYV4PA7Ltj7hJq8bOmLoysE5g/mNBPdOff0c27KqPR4P7r77bui6bvl8PvWi42aUqqrrFEW53bZtWJa1MRQKLVi4cOGZm7HZgsHgNIfDUQ8AeXl5GJw7GIbDmO9yuZYCwIoVK0YahrHPMAzX+XifnDFjxsqeaF/tVvkLQshiQsgIKSX69u2LzMxMuDPckEIikUwcpoTWhUKhTx566KFdP/Yi1G+on2NbdnVmZibuuecehMNha8iQISoArFi5QncazsWMsYUAwDlvNk1z1uzZs7fhJlswGHzS4XAsBwC/Pwc5OX5QSisaGhr2aZr2qaZp7vO199WysrLf9lT3mlf2N954Y5zX631RCDEBgFdKCa/XC9u24XQ6oaoqLMuCZVkbJcHrdWvXHayvr0+lewE2bNw4x+K8OisrC3fddRdSqZQVCARUAFhXt263wpQCALAs6ytftm/UlMlTOP5PLBgMPqfr+mJCCHw+H1xuF1qaWxKEEAMEgMSWGTNmPNwbzV71WquCwXxG6SJKaaGU0ielZC6XC9nZ2XA6DWiajpycHDDGnkkkEisGDRqUNoCbNm2aY9tWdUaGB2PGjAG3LB4YNEj7Xh/1oqZpL+gOXVFVFZzzlyHx1+5UomNmWYV9s+HV1NQsVhTlOUIIdF2/sNkB4FBpaeno3uqRHxjMdErpy4SQAACiaRoKCgqQ3S8bbafbYp3h0K1j7rjzRDoS//vmzXNsy6o2nAbGjR0H0zQtv9//PzVu8+bN2dFo9HNK6cBAIABFURCNRsEtvs/tdtdSRqsnTZwkbxa82tra5YyxJx0OBwbmDEQkEum8Nf/W/rm5uVZvtegPCaSysnJ9eXl5rmmaXgms5Zxj586dOPrNUfj9frcvy3fobLhDSUfSyUSCcYsj1hXDsWPH0NHRccmYqVOnnrMsa7Bt2386ceIEWlpaIKXAwAEDx7ucrmX9s/t/Pqp8FLlZ4KSU/yGEQNM0DOg/AHeMvrPjeqBdFlxTU1PNdbwadJWXlZUBmK+qCr7++mucOXMGp0+dyty7c8/cdCTNGLMJCAzDQHe8G+Fw+LIAZs2aZVVUVPzetu3bbNs+FwqFcfz4ceTk5GDIkCG373tzX3t3vHvMzQBHKSWMMXDOwbmJVCp53ZvoEnCWZVVs3bZ1/vWIlZaWLs3weKKqqqKpqQmtra2IRiJdadmt3/s2HAY0TbtqB15RUXHk6NGjg2zbXpJKpbB9+3Zs2bIFX375pa9xf+OB9957b96NBqcoigQAIQRCoTA6O6//Hf4ScC0tLRh528gljY2NryxfvlzrjdgHH7z/rEN3eHSHjpMnTyIWix0sLS1NyysKJd9tTpObIITANE31Wj6LFi0yy8vLn0kkEg8SQjpM00RbWxv8fj+dMGHC0lOnTtXcSHCJRIIKISClRLQrCm7x6663l9Sf06dP72ltbS0YN27cs5MnT362q6urllIa1DStraOz41w4Gu7KuyWPNx48qHoy3Jmd59oHxrpjY1LJ1CuKomZHIhHEYjFYlvWvioqKyelKOmWmDEYZbMsG5xxdXV1o2NHgLppYFOvBUf4RgL61tbXvRyKRKXv37kXfvn2Qm/uTiiP/PvLTcCRaNGH8+PYbUOM8QggoigJIiXAonHG9WuQKzfcvCSGv2badk5WVRUeMGIHs7GwoigLLsmCaJpxOJ4QQiMfjiEQjaD7WjPb29jgh5IgQYmZlZeXhdCW8ZMkSxePxbGaMFVNK4PcPQiqVQjgcnj9t2rSlvdGqq6vbTwgZK4SAqqpwu92wbRuWbU1VFXVrSUlJ148B7e133tYooZ9LKfM8Hg/y8/PR0tICyui4wnsLG9PeDqwKBu+zLevnuq7fwRjrTyn1CCEcjLFoPB6PSCm/IYRsi8fjaxcsWPCjJL1q1arFQogACJGQkoAQSCHg8XrhdrtWFf+suMcvJLW1tWuSyaRCGcP5V2sCQAgpFZfLSf05/tqioqIP0hn/4S++UD89cGArgL5SyguXFJpKpexAICBNzmeWFBfv743mfwEPa4CpQdIC+AAAAABJRU5ErkJggg==";
const _imports_1 = "/images/github-mark-white.svg";
function u(e) {
  return -1 !== [null, void 0, false].indexOf(e);
}
function c(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function p(e) {
  var t = { exports: {} };
  return e(t, t.exports), t.exports;
}
var d = p(function(e, t) {
  e.exports = function() {
    var e2 = ["decimals", "thousand", "mark", "prefix", "suffix", "encoder", "decoder", "negativeBefore", "negative", "edit", "undo"];
    function t2(e3) {
      return e3.split("").reverse().join("");
    }
    function r(e3, t3) {
      return e3.substring(0, t3.length) === t3;
    }
    function i(e3, t3) {
      return e3.slice(-1 * t3.length) === t3;
    }
    function n(e3, t3, r2) {
      if ((e3[t3] || e3[r2]) && e3[t3] === e3[r2])
        throw new Error(t3);
    }
    function o(e3) {
      return "number" == typeof e3 && isFinite(e3);
    }
    function a(e3, t3) {
      return e3 = e3.toString().split("e"), (+((e3 = (e3 = Math.round(+(e3[0] + "e" + (e3[1] ? +e3[1] + t3 : t3)))).toString().split("e"))[0] + "e" + (e3[1] ? +e3[1] - t3 : -t3))).toFixed(t3);
    }
    function s(e3, r2, i2, n2, s2, l2, u3, c3, p3, d2, f2, h2) {
      var m2, v, g, b = h2, y = "", S = "";
      return l2 && (h2 = l2(h2)), !!o(h2) && (false !== e3 && 0 === parseFloat(h2.toFixed(e3)) && (h2 = 0), h2 < 0 && (m2 = true, h2 = Math.abs(h2)), false !== e3 && (h2 = a(h2, e3)), -1 !== (h2 = h2.toString()).indexOf(".") ? (g = (v = h2.split("."))[0], i2 && (y = i2 + v[1])) : g = h2, r2 && (g = t2(g).match(/.{1,3}/g), g = t2(g.join(t2(r2)))), m2 && c3 && (S += c3), n2 && (S += n2), m2 && p3 && (S += p3), S += g, S += y, s2 && (S += s2), d2 && (S = d2(S, b)), S);
    }
    function l(e3, t3, n2, a2, s2, l2, u3, c3, p3, d2, f2, h2) {
      var m2, v = "";
      return f2 && (h2 = f2(h2)), !(!h2 || "string" != typeof h2) && (c3 && r(h2, c3) && (h2 = h2.replace(c3, ""), m2 = true), a2 && r(h2, a2) && (h2 = h2.replace(a2, "")), p3 && r(h2, p3) && (h2 = h2.replace(p3, ""), m2 = true), s2 && i(h2, s2) && (h2 = h2.slice(0, -1 * s2.length)), t3 && (h2 = h2.split(t3).join("")), n2 && (h2 = h2.replace(n2, ".")), m2 && (v += "-"), "" !== (v = (v += h2).replace(/[^0-9\.\-.]/g, "")) && (v = Number(v), u3 && (v = u3(v)), !!o(v) && v));
    }
    function u2(t3) {
      var r2, i2, o2, a2 = {};
      for (void 0 === t3.suffix && (t3.suffix = t3.postfix), r2 = 0; r2 < e2.length; r2 += 1)
        if (void 0 === (o2 = t3[i2 = e2[r2]]))
          "negative" !== i2 || a2.negativeBefore ? "mark" === i2 && "." !== a2.thousand ? a2[i2] = "." : a2[i2] = false : a2[i2] = "-";
        else if ("decimals" === i2) {
          if (!(o2 >= 0 && o2 < 8))
            throw new Error(i2);
          a2[i2] = o2;
        } else if ("encoder" === i2 || "decoder" === i2 || "edit" === i2 || "undo" === i2) {
          if ("function" != typeof o2)
            throw new Error(i2);
          a2[i2] = o2;
        } else {
          if ("string" != typeof o2)
            throw new Error(i2);
          a2[i2] = o2;
        }
      return n(a2, "mark", "thousand"), n(a2, "prefix", "negative"), n(a2, "prefix", "negativeBefore"), a2;
    }
    function c2(t3, r2, i2) {
      var n2, o2 = [];
      for (n2 = 0; n2 < e2.length; n2 += 1)
        o2.push(t3[e2[n2]]);
      return o2.push(i2), r2.apply("", o2);
    }
    function p2(e3) {
      if (!(this instanceof p2))
        return new p2(e3);
      "object" == typeof e3 && (e3 = u2(e3), this.to = function(t3) {
        return c2(e3, s, t3);
      }, this.from = function(t3) {
        return c2(e3, l, t3);
      });
    }
    return p2;
  }();
});
var f = c(p(function(e, t) {
  !function(e2) {
    function t2(e3) {
      return r(e3) && "function" == typeof e3.from;
    }
    function r(e3) {
      return "object" == typeof e3 && "function" == typeof e3.to;
    }
    function i(e3) {
      e3.parentElement.removeChild(e3);
    }
    function n(e3) {
      return null != e3;
    }
    function o(e3) {
      e3.preventDefault();
    }
    function a(e3) {
      return e3.filter(function(e4) {
        return !this[e4] && (this[e4] = true);
      }, {});
    }
    function s(e3, t3) {
      return Math.round(e3 / t3) * t3;
    }
    function l(e3, t3) {
      var r2 = e3.getBoundingClientRect(), i2 = e3.ownerDocument, n2 = i2.documentElement, o2 = g(i2);
      return /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (o2.x = 0), t3 ? r2.top + o2.y - n2.clientTop : r2.left + o2.x - n2.clientLeft;
    }
    function u2(e3) {
      return "number" == typeof e3 && !isNaN(e3) && isFinite(e3);
    }
    function c2(e3, t3, r2) {
      r2 > 0 && (h2(e3, t3), setTimeout(function() {
        m2(e3, t3);
      }, r2));
    }
    function p2(e3) {
      return Math.max(Math.min(e3, 100), 0);
    }
    function d2(e3) {
      return Array.isArray(e3) ? e3 : [e3];
    }
    function f2(e3) {
      var t3 = (e3 = String(e3)).split(".");
      return t3.length > 1 ? t3[1].length : 0;
    }
    function h2(e3, t3) {
      e3.classList && !/\s/.test(t3) ? e3.classList.add(t3) : e3.className += " " + t3;
    }
    function m2(e3, t3) {
      e3.classList && !/\s/.test(t3) ? e3.classList.remove(t3) : e3.className = e3.className.replace(new RegExp("(^|\\b)" + t3.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    }
    function v(e3, t3) {
      return e3.classList ? e3.classList.contains(t3) : new RegExp("\\b" + t3 + "\\b").test(e3.className);
    }
    function g(e3) {
      var t3 = void 0 !== window.pageXOffset, r2 = "CSS1Compat" === (e3.compatMode || "");
      return { x: t3 ? window.pageXOffset : r2 ? e3.documentElement.scrollLeft : e3.body.scrollLeft, y: t3 ? window.pageYOffset : r2 ? e3.documentElement.scrollTop : e3.body.scrollTop };
    }
    function b() {
      return window.navigator.pointerEnabled ? { start: "pointerdown", move: "pointermove", end: "pointerup" } : window.navigator.msPointerEnabled ? { start: "MSPointerDown", move: "MSPointerMove", end: "MSPointerUp" } : { start: "mousedown touchstart", move: "mousemove touchmove", end: "mouseup touchend" };
    }
    function y() {
      var e3 = false;
      try {
        var t3 = Object.defineProperty({}, "passive", { get: function() {
          e3 = true;
        } });
        window.addEventListener("test", null, t3);
      } catch (e4) {
      }
      return e3;
    }
    function S() {
      return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
    }
    function x(e3, t3) {
      return 100 / (t3 - e3);
    }
    function w(e3, t3, r2) {
      return 100 * t3 / (e3[r2 + 1] - e3[r2]);
    }
    function E(e3, t3) {
      return w(e3, e3[0] < 0 ? t3 + Math.abs(e3[0]) : t3 - e3[0], 0);
    }
    function P(e3, t3) {
      return t3 * (e3[1] - e3[0]) / 100 + e3[0];
    }
    function N(e3, t3) {
      for (var r2 = 1; e3 >= t3[r2]; )
        r2 += 1;
      return r2;
    }
    function C(e3, t3, r2) {
      if (r2 >= e3.slice(-1)[0])
        return 100;
      var i2 = N(r2, e3), n2 = e3[i2 - 1], o2 = e3[i2], a2 = t3[i2 - 1], s2 = t3[i2];
      return a2 + E([n2, o2], r2) / x(a2, s2);
    }
    function k(e3, t3, r2) {
      if (r2 >= 100)
        return e3.slice(-1)[0];
      var i2 = N(r2, t3), n2 = e3[i2 - 1], o2 = e3[i2], a2 = t3[i2 - 1];
      return P([n2, o2], (r2 - a2) * x(a2, t3[i2]));
    }
    function V(e3, t3, r2, i2) {
      if (100 === i2)
        return i2;
      var n2 = N(i2, e3), o2 = e3[n2 - 1], a2 = e3[n2];
      return r2 ? i2 - o2 > (a2 - o2) / 2 ? a2 : o2 : t3[n2 - 1] ? e3[n2 - 1] + s(i2 - e3[n2 - 1], t3[n2 - 1]) : i2;
    }
    var A, M;
    e2.PipsMode = void 0, (M = e2.PipsMode || (e2.PipsMode = {})).Range = "range", M.Steps = "steps", M.Positions = "positions", M.Count = "count", M.Values = "values", e2.PipsType = void 0, (A = e2.PipsType || (e2.PipsType = {}))[A.None = -1] = "None", A[A.NoValue = 0] = "NoValue", A[A.LargeValue = 1] = "LargeValue", A[A.SmallValue = 2] = "SmallValue";
    var L = function() {
      function e3(e4, t3, r2) {
        var i2;
        this.xPct = [], this.xVal = [], this.xSteps = [], this.xNumSteps = [], this.xHighestCompleteStep = [], this.xSteps = [r2 || false], this.xNumSteps = [false], this.snap = t3;
        var n2 = [];
        for (Object.keys(e4).forEach(function(t4) {
          n2.push([d2(e4[t4]), t4]);
        }), n2.sort(function(e5, t4) {
          return e5[0][0] - t4[0][0];
        }), i2 = 0; i2 < n2.length; i2++)
          this.handleEntryPoint(n2[i2][1], n2[i2][0]);
        for (this.xNumSteps = this.xSteps.slice(0), i2 = 0; i2 < this.xNumSteps.length; i2++)
          this.handleStepPoint(i2, this.xNumSteps[i2]);
      }
      return e3.prototype.getDistance = function(e4) {
        for (var t3 = [], r2 = 0; r2 < this.xNumSteps.length - 1; r2++)
          t3[r2] = w(this.xVal, e4, r2);
        return t3;
      }, e3.prototype.getAbsoluteDistance = function(e4, t3, r2) {
        var i2, n2 = 0;
        if (e4 < this.xPct[this.xPct.length - 1])
          for (; e4 > this.xPct[n2 + 1]; )
            n2++;
        else
          e4 === this.xPct[this.xPct.length - 1] && (n2 = this.xPct.length - 2);
        r2 || e4 !== this.xPct[n2 + 1] || n2++, null === t3 && (t3 = []);
        var o2 = 1, a2 = t3[n2], s2 = 0, l2 = 0, u3 = 0, c3 = 0;
        for (i2 = r2 ? (e4 - this.xPct[n2]) / (this.xPct[n2 + 1] - this.xPct[n2]) : (this.xPct[n2 + 1] - e4) / (this.xPct[n2 + 1] - this.xPct[n2]); a2 > 0; )
          s2 = this.xPct[n2 + 1 + c3] - this.xPct[n2 + c3], t3[n2 + c3] * o2 + 100 - 100 * i2 > 100 ? (l2 = s2 * i2, o2 = (a2 - 100 * i2) / t3[n2 + c3], i2 = 1) : (l2 = t3[n2 + c3] * s2 / 100 * o2, o2 = 0), r2 ? (u3 -= l2, this.xPct.length + c3 >= 1 && c3--) : (u3 += l2, this.xPct.length - c3 >= 1 && c3++), a2 = t3[n2 + c3] * o2;
        return e4 + u3;
      }, e3.prototype.toStepping = function(e4) {
        return e4 = C(this.xVal, this.xPct, e4);
      }, e3.prototype.fromStepping = function(e4) {
        return k(this.xVal, this.xPct, e4);
      }, e3.prototype.getStep = function(e4) {
        return e4 = V(this.xPct, this.xSteps, this.snap, e4);
      }, e3.prototype.getDefaultStep = function(e4, t3, r2) {
        var i2 = N(e4, this.xPct);
        return (100 === e4 || t3 && e4 === this.xPct[i2 - 1]) && (i2 = Math.max(i2 - 1, 1)), (this.xVal[i2] - this.xVal[i2 - 1]) / r2;
      }, e3.prototype.getNearbySteps = function(e4) {
        var t3 = N(e4, this.xPct);
        return { stepBefore: { startValue: this.xVal[t3 - 2], step: this.xNumSteps[t3 - 2], highestStep: this.xHighestCompleteStep[t3 - 2] }, thisStep: { startValue: this.xVal[t3 - 1], step: this.xNumSteps[t3 - 1], highestStep: this.xHighestCompleteStep[t3 - 1] }, stepAfter: { startValue: this.xVal[t3], step: this.xNumSteps[t3], highestStep: this.xHighestCompleteStep[t3] } };
      }, e3.prototype.countStepDecimals = function() {
        var e4 = this.xNumSteps.map(f2);
        return Math.max.apply(null, e4);
      }, e3.prototype.hasNoSize = function() {
        return this.xVal[0] === this.xVal[this.xVal.length - 1];
      }, e3.prototype.convert = function(e4) {
        return this.getStep(this.toStepping(e4));
      }, e3.prototype.handleEntryPoint = function(e4, t3) {
        var r2;
        if (!u2(r2 = "min" === e4 ? 0 : "max" === e4 ? 100 : parseFloat(e4)) || !u2(t3[0]))
          throw new Error("noUiSlider: 'range' value isn't numeric.");
        this.xPct.push(r2), this.xVal.push(t3[0]);
        var i2 = Number(t3[1]);
        r2 ? this.xSteps.push(!isNaN(i2) && i2) : isNaN(i2) || (this.xSteps[0] = i2), this.xHighestCompleteStep.push(0);
      }, e3.prototype.handleStepPoint = function(e4, t3) {
        if (t3)
          if (this.xVal[e4] !== this.xVal[e4 + 1]) {
            this.xSteps[e4] = w([this.xVal[e4], this.xVal[e4 + 1]], t3, 0) / x(this.xPct[e4], this.xPct[e4 + 1]);
            var r2 = (this.xVal[e4 + 1] - this.xVal[e4]) / this.xNumSteps[e4], i2 = Math.ceil(Number(r2.toFixed(3)) - 1), n2 = this.xVal[e4] + this.xNumSteps[e4] * i2;
            this.xHighestCompleteStep[e4] = n2;
          } else
            this.xSteps[e4] = this.xHighestCompleteStep[e4] = this.xVal[e4];
      }, e3;
    }(), U = { to: function(e3) {
      return void 0 === e3 ? "" : e3.toFixed(2);
    }, from: Number }, O = { target: "target", base: "base", origin: "origin", handle: "handle", handleLower: "handle-lower", handleUpper: "handle-upper", touchArea: "touch-area", horizontal: "horizontal", vertical: "vertical", background: "background", connect: "connect", connects: "connects", ltr: "ltr", rtl: "rtl", textDirectionLtr: "txt-dir-ltr", textDirectionRtl: "txt-dir-rtl", draggable: "draggable", drag: "state-drag", tap: "state-tap", active: "active", tooltip: "tooltip", pips: "pips", pipsHorizontal: "pips-horizontal", pipsVertical: "pips-vertical", marker: "marker", markerHorizontal: "marker-horizontal", markerVertical: "marker-vertical", markerNormal: "marker-normal", markerLarge: "marker-large", markerSub: "marker-sub", value: "value", valueHorizontal: "value-horizontal", valueVertical: "value-vertical", valueNormal: "value-normal", valueLarge: "value-large", valueSub: "value-sub" }, D = { tooltips: ".__tooltips", aria: ".__aria" };
    function j(e3, t3) {
      if (!u2(t3))
        throw new Error("noUiSlider: 'step' is not numeric.");
      e3.singleStep = t3;
    }
    function F(e3, t3) {
      if (!u2(t3))
        throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
      e3.keyboardPageMultiplier = t3;
    }
    function T(e3, t3) {
      if (!u2(t3))
        throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
      e3.keyboardMultiplier = t3;
    }
    function z(e3, t3) {
      if (!u2(t3))
        throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
      e3.keyboardDefaultStep = t3;
    }
    function H(e3, t3) {
      if ("object" != typeof t3 || Array.isArray(t3))
        throw new Error("noUiSlider: 'range' is not an object.");
      if (void 0 === t3.min || void 0 === t3.max)
        throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
      e3.spectrum = new L(t3, e3.snap || false, e3.singleStep);
    }
    function q(e3, t3) {
      if (t3 = d2(t3), !Array.isArray(t3) || !t3.length)
        throw new Error("noUiSlider: 'start' option is incorrect.");
      e3.handles = t3.length, e3.start = t3;
    }
    function R(e3, t3) {
      if ("boolean" != typeof t3)
        throw new Error("noUiSlider: 'snap' option must be a boolean.");
      e3.snap = t3;
    }
    function B(e3, t3) {
      if ("boolean" != typeof t3)
        throw new Error("noUiSlider: 'animate' option must be a boolean.");
      e3.animate = t3;
    }
    function _(e3, t3) {
      if ("number" != typeof t3)
        throw new Error("noUiSlider: 'animationDuration' option must be a number.");
      e3.animationDuration = t3;
    }
    function $(e3, t3) {
      var r2, i2 = [false];
      if ("lower" === t3 ? t3 = [true, false] : "upper" === t3 && (t3 = [false, true]), true === t3 || false === t3) {
        for (r2 = 1; r2 < e3.handles; r2++)
          i2.push(t3);
        i2.push(false);
      } else {
        if (!Array.isArray(t3) || !t3.length || t3.length !== e3.handles + 1)
          throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
        i2 = t3;
      }
      e3.connect = i2;
    }
    function X(e3, t3) {
      switch (t3) {
        case "horizontal":
          e3.ort = 0;
          break;
        case "vertical":
          e3.ort = 1;
          break;
        default:
          throw new Error("noUiSlider: 'orientation' option is invalid.");
      }
    }
    function Y(e3, t3) {
      if (!u2(t3))
        throw new Error("noUiSlider: 'margin' option must be numeric.");
      0 !== t3 && (e3.margin = e3.spectrum.getDistance(t3));
    }
    function I(e3, t3) {
      if (!u2(t3))
        throw new Error("noUiSlider: 'limit' option must be numeric.");
      if (e3.limit = e3.spectrum.getDistance(t3), !e3.limit || e3.handles < 2)
        throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
    }
    function W(e3, t3) {
      var r2;
      if (!u2(t3) && !Array.isArray(t3))
        throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
      if (Array.isArray(t3) && 2 !== t3.length && !u2(t3[0]) && !u2(t3[1]))
        throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
      if (0 !== t3) {
        for (Array.isArray(t3) || (t3 = [t3, t3]), e3.padding = [e3.spectrum.getDistance(t3[0]), e3.spectrum.getDistance(t3[1])], r2 = 0; r2 < e3.spectrum.xNumSteps.length - 1; r2++)
          if (e3.padding[0][r2] < 0 || e3.padding[1][r2] < 0)
            throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
        var i2 = t3[0] + t3[1], n2 = e3.spectrum.xVal[0];
        if (i2 / (e3.spectrum.xVal[e3.spectrum.xVal.length - 1] - n2) > 1)
          throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
      }
    }
    function G(e3, t3) {
      switch (t3) {
        case "ltr":
          e3.dir = 0;
          break;
        case "rtl":
          e3.dir = 1;
          break;
        default:
          throw new Error("noUiSlider: 'direction' option was not recognized.");
      }
    }
    function J(e3, t3) {
      if ("string" != typeof t3)
        throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
      var r2 = t3.indexOf("tap") >= 0, i2 = t3.indexOf("drag") >= 0, n2 = t3.indexOf("fixed") >= 0, o2 = t3.indexOf("snap") >= 0, a2 = t3.indexOf("hover") >= 0, s2 = t3.indexOf("unconstrained") >= 0, l2 = t3.indexOf("drag-all") >= 0, u3 = t3.indexOf("smooth-steps") >= 0;
      if (n2) {
        if (2 !== e3.handles)
          throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
        Y(e3, e3.start[1] - e3.start[0]);
      }
      if (s2 && (e3.margin || e3.limit))
        throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
      e3.events = { tap: r2 || o2, drag: i2, dragAll: l2, smoothSteps: u3, fixed: n2, snap: o2, hover: a2, unconstrained: s2 };
    }
    function K(e3, t3) {
      if (false !== t3)
        if (true === t3 || r(t3)) {
          e3.tooltips = [];
          for (var i2 = 0; i2 < e3.handles; i2++)
            e3.tooltips.push(t3);
        } else {
          if ((t3 = d2(t3)).length !== e3.handles)
            throw new Error("noUiSlider: must pass a formatter for all handles.");
          t3.forEach(function(e4) {
            if ("boolean" != typeof e4 && !r(e4))
              throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
          }), e3.tooltips = t3;
        }
    }
    function Q(e3, t3) {
      if (t3.length !== e3.handles)
        throw new Error("noUiSlider: must pass a attributes for all handles.");
      e3.handleAttributes = t3;
    }
    function Z(e3, t3) {
      if (!r(t3))
        throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
      e3.ariaFormat = t3;
    }
    function ee(e3, r2) {
      if (!t2(r2))
        throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
      e3.format = r2;
    }
    function te(e3, t3) {
      if ("boolean" != typeof t3)
        throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
      e3.keyboardSupport = t3;
    }
    function re(e3, t3) {
      e3.documentElement = t3;
    }
    function ie(e3, t3) {
      if ("string" != typeof t3 && false !== t3)
        throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
      e3.cssPrefix = t3;
    }
    function ne(e3, t3) {
      if ("object" != typeof t3)
        throw new Error("noUiSlider: 'cssClasses' must be an object.");
      "string" == typeof e3.cssPrefix ? (e3.cssClasses = {}, Object.keys(t3).forEach(function(r2) {
        e3.cssClasses[r2] = e3.cssPrefix + t3[r2];
      })) : e3.cssClasses = t3;
    }
    function oe(e3) {
      var t3 = { margin: null, limit: null, padding: null, animate: true, animationDuration: 300, ariaFormat: U, format: U }, r2 = { step: { r: false, t: j }, keyboardPageMultiplier: { r: false, t: F }, keyboardMultiplier: { r: false, t: T }, keyboardDefaultStep: { r: false, t: z }, start: { r: true, t: q }, connect: { r: true, t: $ }, direction: { r: true, t: G }, snap: { r: false, t: R }, animate: { r: false, t: B }, animationDuration: { r: false, t: _ }, range: { r: true, t: H }, orientation: { r: false, t: X }, margin: { r: false, t: Y }, limit: { r: false, t: I }, padding: { r: false, t: W }, behaviour: { r: true, t: J }, ariaFormat: { r: false, t: Z }, format: { r: false, t: ee }, tooltips: { r: false, t: K }, keyboardSupport: { r: true, t: te }, documentElement: { r: false, t: re }, cssPrefix: { r: true, t: ie }, cssClasses: { r: true, t: ne }, handleAttributes: { r: false, t: Q } }, i2 = { connect: false, direction: "ltr", behaviour: "tap", orientation: "horizontal", keyboardSupport: true, cssPrefix: "noUi-", cssClasses: O, keyboardPageMultiplier: 5, keyboardMultiplier: 1, keyboardDefaultStep: 10 };
      e3.format && !e3.ariaFormat && (e3.ariaFormat = e3.format), Object.keys(r2).forEach(function(o3) {
        if (n(e3[o3]) || void 0 !== i2[o3])
          r2[o3].t(t3, n(e3[o3]) ? e3[o3] : i2[o3]);
        else if (r2[o3].r)
          throw new Error("noUiSlider: '" + o3 + "' is required.");
      }), t3.pips = e3.pips;
      var o2 = document.createElement("div"), a2 = void 0 !== o2.style.msTransform, s2 = void 0 !== o2.style.transform;
      t3.transformRule = s2 ? "transform" : a2 ? "msTransform" : "webkitTransform";
      var l2 = [["left", "top"], ["right", "bottom"]];
      return t3.style = l2[t3.dir][t3.ort], t3;
    }
    function ae(t3, r2, s2) {
      var u3, f3, x2, w2, E2, P2 = b(), N2 = S() && y(), C2 = t3, k2 = r2.spectrum, V2 = [], A2 = [], M2 = [], L2 = 0, U2 = {}, O2 = t3.ownerDocument, j2 = r2.documentElement || O2.documentElement, F2 = O2.body, T2 = "rtl" === O2.dir || 1 === r2.ort ? 0 : 100;
      function z2(e3, t4) {
        var r3 = O2.createElement("div");
        return t4 && h2(r3, t4), e3.appendChild(r3), r3;
      }
      function H2(e3, t4) {
        var i2 = z2(e3, r2.cssClasses.origin), n2 = z2(i2, r2.cssClasses.handle);
        if (z2(n2, r2.cssClasses.touchArea), n2.setAttribute("data-handle", String(t4)), r2.keyboardSupport && (n2.setAttribute("tabindex", "0"), n2.addEventListener("keydown", function(e4) {
          return fe(e4, t4);
        })), void 0 !== r2.handleAttributes) {
          var o2 = r2.handleAttributes[t4];
          Object.keys(o2).forEach(function(e4) {
            n2.setAttribute(e4, o2[e4]);
          });
        }
        return n2.setAttribute("role", "slider"), n2.setAttribute("aria-orientation", r2.ort ? "vertical" : "horizontal"), 0 === t4 ? h2(n2, r2.cssClasses.handleLower) : t4 === r2.handles - 1 && h2(n2, r2.cssClasses.handleUpper), i2;
      }
      function q2(e3, t4) {
        return !!t4 && z2(e3, r2.cssClasses.connect);
      }
      function R2(e3, t4) {
        var i2 = z2(t4, r2.cssClasses.connects);
        f3 = [], (x2 = []).push(q2(i2, e3[0]));
        for (var n2 = 0; n2 < r2.handles; n2++)
          f3.push(H2(t4, n2)), M2[n2] = n2, x2.push(q2(i2, e3[n2 + 1]));
      }
      function B2(e3) {
        return h2(e3, r2.cssClasses.target), 0 === r2.dir ? h2(e3, r2.cssClasses.ltr) : h2(e3, r2.cssClasses.rtl), 0 === r2.ort ? h2(e3, r2.cssClasses.horizontal) : h2(e3, r2.cssClasses.vertical), h2(e3, "rtl" === getComputedStyle(e3).direction ? r2.cssClasses.textDirectionRtl : r2.cssClasses.textDirectionLtr), z2(e3, r2.cssClasses.base);
      }
      function _2(e3, t4) {
        return !(!r2.tooltips || !r2.tooltips[t4]) && z2(e3.firstChild, r2.cssClasses.tooltip);
      }
      function $2() {
        return C2.hasAttribute("disabled");
      }
      function X2(e3) {
        return f3[e3].hasAttribute("disabled");
      }
      function Y2() {
        E2 && (ge("update" + D.tooltips), E2.forEach(function(e3) {
          e3 && i(e3);
        }), E2 = null);
      }
      function I2() {
        Y2(), E2 = f3.map(_2), me("update" + D.tooltips, function(e3, t4, i2) {
          if (E2 && r2.tooltips && false !== E2[t4]) {
            var n2 = e3[t4];
            true !== r2.tooltips[t4] && (n2 = r2.tooltips[t4].to(i2[t4])), E2[t4].innerHTML = n2;
          }
        });
      }
      function W2() {
        ge("update" + D.aria), me("update" + D.aria, function(e3, t4, i2, n2, o2) {
          M2.forEach(function(e4) {
            var t5 = f3[e4], n3 = ye(A2, e4, 0, true, true, true), a2 = ye(A2, e4, 100, true, true, true), s3 = o2[e4], l2 = String(r2.ariaFormat.to(i2[e4]));
            n3 = k2.fromStepping(n3).toFixed(1), a2 = k2.fromStepping(a2).toFixed(1), s3 = k2.fromStepping(s3).toFixed(1), t5.children[0].setAttribute("aria-valuemin", n3), t5.children[0].setAttribute("aria-valuemax", a2), t5.children[0].setAttribute("aria-valuenow", s3), t5.children[0].setAttribute("aria-valuetext", l2);
          });
        });
      }
      function G2(t4) {
        if (t4.mode === e2.PipsMode.Range || t4.mode === e2.PipsMode.Steps)
          return k2.xVal;
        if (t4.mode === e2.PipsMode.Count) {
          if (t4.values < 2)
            throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
          for (var r3 = t4.values - 1, i2 = 100 / r3, n2 = []; r3--; )
            n2[r3] = r3 * i2;
          return n2.push(100), J2(n2, t4.stepped);
        }
        return t4.mode === e2.PipsMode.Positions ? J2(t4.values, t4.stepped) : t4.mode === e2.PipsMode.Values ? t4.stepped ? t4.values.map(function(e3) {
          return k2.fromStepping(k2.getStep(k2.toStepping(e3)));
        }) : t4.values : [];
      }
      function J2(e3, t4) {
        return e3.map(function(e4) {
          return k2.fromStepping(t4 ? k2.getStep(e4) : e4);
        });
      }
      function K2(t4) {
        function r3(e3, t5) {
          return Number((e3 + t5).toFixed(7));
        }
        var i2 = G2(t4), n2 = {}, o2 = k2.xVal[0], s3 = k2.xVal[k2.xVal.length - 1], l2 = false, u4 = false, c3 = 0;
        return (i2 = a(i2.slice().sort(function(e3, t5) {
          return e3 - t5;
        })))[0] !== o2 && (i2.unshift(o2), l2 = true), i2[i2.length - 1] !== s3 && (i2.push(s3), u4 = true), i2.forEach(function(o3, a2) {
          var s4, p3, d3, f4, h3, m3, v2, g2, b2, y2, S2 = o3, x3 = i2[a2 + 1], w3 = t4.mode === e2.PipsMode.Steps;
          for (w3 && (s4 = k2.xNumSteps[a2]), s4 || (s4 = x3 - S2), void 0 === x3 && (x3 = S2), s4 = Math.max(s4, 1e-7), p3 = S2; p3 <= x3; p3 = r3(p3, s4)) {
            for (g2 = (h3 = (f4 = k2.toStepping(p3)) - c3) / (t4.density || 1), y2 = h3 / (b2 = Math.round(g2)), d3 = 1; d3 <= b2; d3 += 1)
              n2[(m3 = c3 + d3 * y2).toFixed(5)] = [k2.fromStepping(m3), 0];
            v2 = i2.indexOf(p3) > -1 ? e2.PipsType.LargeValue : w3 ? e2.PipsType.SmallValue : e2.PipsType.NoValue, !a2 && l2 && p3 !== x3 && (v2 = 0), p3 === x3 && u4 || (n2[f4.toFixed(5)] = [p3, v2]), c3 = f4;
          }
        }), n2;
      }
      function Q2(t4, i2, n2) {
        var o2, a2, s3 = O2.createElement("div"), l2 = ((o2 = {})[e2.PipsType.None] = "", o2[e2.PipsType.NoValue] = r2.cssClasses.valueNormal, o2[e2.PipsType.LargeValue] = r2.cssClasses.valueLarge, o2[e2.PipsType.SmallValue] = r2.cssClasses.valueSub, o2), u4 = ((a2 = {})[e2.PipsType.None] = "", a2[e2.PipsType.NoValue] = r2.cssClasses.markerNormal, a2[e2.PipsType.LargeValue] = r2.cssClasses.markerLarge, a2[e2.PipsType.SmallValue] = r2.cssClasses.markerSub, a2), c3 = [r2.cssClasses.valueHorizontal, r2.cssClasses.valueVertical], p3 = [r2.cssClasses.markerHorizontal, r2.cssClasses.markerVertical];
        function d3(e3, t5) {
          var i3 = t5 === r2.cssClasses.value, n3 = i3 ? l2 : u4;
          return t5 + " " + (i3 ? c3 : p3)[r2.ort] + " " + n3[e3];
        }
        function f4(t5, o3, a3) {
          if ((a3 = i2 ? i2(o3, a3) : a3) !== e2.PipsType.None) {
            var l3 = z2(s3, false);
            l3.className = d3(a3, r2.cssClasses.marker), l3.style[r2.style] = t5 + "%", a3 > e2.PipsType.NoValue && ((l3 = z2(s3, false)).className = d3(a3, r2.cssClasses.value), l3.setAttribute("data-value", String(o3)), l3.style[r2.style] = t5 + "%", l3.innerHTML = String(n2.to(o3)));
          }
        }
        return h2(s3, r2.cssClasses.pips), h2(s3, 0 === r2.ort ? r2.cssClasses.pipsHorizontal : r2.cssClasses.pipsVertical), Object.keys(t4).forEach(function(e3) {
          f4(e3, t4[e3][0], t4[e3][1]);
        }), s3;
      }
      function Z2() {
        w2 && (i(w2), w2 = null);
      }
      function ee2(e3) {
        Z2();
        var t4 = K2(e3), r3 = e3.filter, i2 = e3.format || { to: function(e4) {
          return String(Math.round(e4));
        } };
        return w2 = C2.appendChild(Q2(t4, r3, i2));
      }
      function te2() {
        var e3 = u3.getBoundingClientRect(), t4 = "offset" + ["Width", "Height"][r2.ort];
        return 0 === r2.ort ? e3.width || u3[t4] : e3.height || u3[t4];
      }
      function re2(e3, t4, i2, n2) {
        var o2 = function(o3) {
          var a3 = ie2(o3, n2.pageOffset, n2.target || t4);
          return !!a3 && !($2() && !n2.doNotReject) && !(v(C2, r2.cssClasses.tap) && !n2.doNotReject) && !(e3 === P2.start && void 0 !== a3.buttons && a3.buttons > 1) && (!n2.hover || !a3.buttons) && (N2 || a3.preventDefault(), a3.calcPoint = a3.points[r2.ort], void i2(a3, n2));
        }, a2 = [];
        return e3.split(" ").forEach(function(e4) {
          t4.addEventListener(e4, o2, !!N2 && { passive: true }), a2.push([e4, o2]);
        }), a2;
      }
      function ie2(e3, t4, r3) {
        var i2 = 0 === e3.type.indexOf("touch"), n2 = 0 === e3.type.indexOf("mouse"), o2 = 0 === e3.type.indexOf("pointer"), a2 = 0, s3 = 0;
        if (0 === e3.type.indexOf("MSPointer") && (o2 = true), "mousedown" === e3.type && !e3.buttons && !e3.touches)
          return false;
        if (i2) {
          var l2 = function(t5) {
            var i3 = t5.target;
            return i3 === r3 || r3.contains(i3) || e3.composed && e3.composedPath().shift() === r3;
          };
          if ("touchstart" === e3.type) {
            var u4 = Array.prototype.filter.call(e3.touches, l2);
            if (u4.length > 1)
              return false;
            a2 = u4[0].pageX, s3 = u4[0].pageY;
          } else {
            var c3 = Array.prototype.find.call(e3.changedTouches, l2);
            if (!c3)
              return false;
            a2 = c3.pageX, s3 = c3.pageY;
          }
        }
        return t4 = t4 || g(O2), (n2 || o2) && (a2 = e3.clientX + t4.x, s3 = e3.clientY + t4.y), e3.pageOffset = t4, e3.points = [a2, s3], e3.cursor = n2 || o2, e3;
      }
      function ne2(e3) {
        var t4 = 100 * (e3 - l(u3, r2.ort)) / te2();
        return t4 = p2(t4), r2.dir ? 100 - t4 : t4;
      }
      function ae2(e3) {
        var t4 = 100, r3 = false;
        return f3.forEach(function(i2, n2) {
          if (!X2(n2)) {
            var o2 = A2[n2], a2 = Math.abs(o2 - e3);
            (a2 < t4 || a2 <= t4 && e3 > o2 || 100 === a2 && 100 === t4) && (r3 = n2, t4 = a2);
          }
        }), r3;
      }
      function se2(e3, t4) {
        "mouseout" === e3.type && "HTML" === e3.target.nodeName && null === e3.relatedTarget && ue(e3, t4);
      }
      function le2(e3, t4) {
        if (-1 === navigator.appVersion.indexOf("MSIE 9") && 0 === e3.buttons && 0 !== t4.buttonsProperty)
          return ue(e3, t4);
        var i2 = (r2.dir ? -1 : 1) * (e3.calcPoint - t4.startCalcPoint);
        xe(i2 > 0, 100 * i2 / t4.baseSize, t4.locations, t4.handleNumbers, t4.connect);
      }
      function ue(e3, t4) {
        t4.handle && (m2(t4.handle, r2.cssClasses.active), L2 -= 1), t4.listeners.forEach(function(e4) {
          j2.removeEventListener(e4[0], e4[1]);
        }), 0 === L2 && (m2(C2, r2.cssClasses.drag), Pe(), e3.cursor && (F2.style.cursor = "", F2.removeEventListener("selectstart", o))), r2.events.smoothSteps && (t4.handleNumbers.forEach(function(e4) {
          Ne(e4, A2[e4], true, true, false, false);
        }), t4.handleNumbers.forEach(function(e4) {
          be("update", e4);
        })), t4.handleNumbers.forEach(function(e4) {
          be("change", e4), be("set", e4), be("end", e4);
        });
      }
      function ce(e3, t4) {
        if (!t4.handleNumbers.some(X2)) {
          var i2;
          1 === t4.handleNumbers.length && (i2 = f3[t4.handleNumbers[0]].children[0], L2 += 1, h2(i2, r2.cssClasses.active)), e3.stopPropagation();
          var n2 = [], a2 = re2(P2.move, j2, le2, { target: e3.target, handle: i2, connect: t4.connect, listeners: n2, startCalcPoint: e3.calcPoint, baseSize: te2(), pageOffset: e3.pageOffset, handleNumbers: t4.handleNumbers, buttonsProperty: e3.buttons, locations: A2.slice() }), s3 = re2(P2.end, j2, ue, { target: e3.target, handle: i2, listeners: n2, doNotReject: true, handleNumbers: t4.handleNumbers }), l2 = re2("mouseout", j2, se2, { target: e3.target, handle: i2, listeners: n2, doNotReject: true, handleNumbers: t4.handleNumbers });
          n2.push.apply(n2, a2.concat(s3, l2)), e3.cursor && (F2.style.cursor = getComputedStyle(e3.target).cursor, f3.length > 1 && h2(C2, r2.cssClasses.drag), F2.addEventListener("selectstart", o, false)), t4.handleNumbers.forEach(function(e4) {
            be("start", e4);
          });
        }
      }
      function pe(e3) {
        e3.stopPropagation();
        var t4 = ne2(e3.calcPoint), i2 = ae2(t4);
        false !== i2 && (r2.events.snap || c2(C2, r2.cssClasses.tap, r2.animationDuration), Ne(i2, t4, true, true), Pe(), be("slide", i2, true), be("update", i2, true), r2.events.snap ? ce(e3, { handleNumbers: [i2] }) : (be("change", i2, true), be("set", i2, true)));
      }
      function de(e3) {
        var t4 = ne2(e3.calcPoint), r3 = k2.getStep(t4), i2 = k2.fromStepping(r3);
        Object.keys(U2).forEach(function(e4) {
          "hover" === e4.split(".")[0] && U2[e4].forEach(function(e5) {
            e5.call(Te, i2);
          });
        });
      }
      function fe(e3, t4) {
        if ($2() || X2(t4))
          return false;
        var i2 = ["Left", "Right"], n2 = ["Down", "Up"], o2 = ["PageDown", "PageUp"], a2 = ["Home", "End"];
        r2.dir && !r2.ort ? i2.reverse() : r2.ort && !r2.dir && (n2.reverse(), o2.reverse());
        var s3, l2 = e3.key.replace("Arrow", ""), u4 = l2 === o2[0], c3 = l2 === o2[1], p3 = l2 === n2[0] || l2 === i2[0] || u4, d3 = l2 === n2[1] || l2 === i2[1] || c3, f4 = l2 === a2[0], h3 = l2 === a2[1];
        if (!(p3 || d3 || f4 || h3))
          return true;
        if (e3.preventDefault(), d3 || p3) {
          var m3 = p3 ? 0 : 1, v2 = Oe(t4)[m3];
          if (null === v2)
            return false;
          false === v2 && (v2 = k2.getDefaultStep(A2[t4], p3, r2.keyboardDefaultStep)), v2 *= c3 || u4 ? r2.keyboardPageMultiplier : r2.keyboardMultiplier, v2 = Math.max(v2, 1e-7), v2 *= p3 ? -1 : 1, s3 = V2[t4] + v2;
        } else
          s3 = h3 ? r2.spectrum.xVal[r2.spectrum.xVal.length - 1] : r2.spectrum.xVal[0];
        return Ne(t4, k2.toStepping(s3), true, true), be("slide", t4), be("update", t4), be("change", t4), be("set", t4), false;
      }
      function he(e3) {
        e3.fixed || f3.forEach(function(e4, t4) {
          re2(P2.start, e4.children[0], ce, { handleNumbers: [t4] });
        }), e3.tap && re2(P2.start, u3, pe, {}), e3.hover && re2(P2.move, u3, de, { hover: true }), e3.drag && x2.forEach(function(t4, i2) {
          if (false !== t4 && 0 !== i2 && i2 !== x2.length - 1) {
            var n2 = f3[i2 - 1], o2 = f3[i2], a2 = [t4], s3 = [n2, o2], l2 = [i2 - 1, i2];
            h2(t4, r2.cssClasses.draggable), e3.fixed && (a2.push(n2.children[0]), a2.push(o2.children[0])), e3.dragAll && (s3 = f3, l2 = M2), a2.forEach(function(e4) {
              re2(P2.start, e4, ce, { handles: s3, handleNumbers: l2, connect: t4 });
            });
          }
        });
      }
      function me(e3, t4) {
        U2[e3] = U2[e3] || [], U2[e3].push(t4), "update" === e3.split(".")[0] && f3.forEach(function(e4, t5) {
          be("update", t5);
        });
      }
      function ve(e3) {
        return e3 === D.aria || e3 === D.tooltips;
      }
      function ge(e3) {
        var t4 = e3 && e3.split(".")[0], r3 = t4 ? e3.substring(t4.length) : e3;
        Object.keys(U2).forEach(function(e4) {
          var i2 = e4.split(".")[0], n2 = e4.substring(i2.length);
          t4 && t4 !== i2 || r3 && r3 !== n2 || ve(n2) && r3 !== n2 || delete U2[e4];
        });
      }
      function be(e3, t4, i2) {
        Object.keys(U2).forEach(function(n2) {
          var o2 = n2.split(".")[0];
          e3 === o2 && U2[n2].forEach(function(e4) {
            e4.call(Te, V2.map(r2.format.to), t4, V2.slice(), i2 || false, A2.slice(), Te);
          });
        });
      }
      function ye(e3, t4, i2, n2, o2, a2, s3) {
        var l2;
        return f3.length > 1 && !r2.events.unconstrained && (n2 && t4 > 0 && (l2 = k2.getAbsoluteDistance(e3[t4 - 1], r2.margin, false), i2 = Math.max(i2, l2)), o2 && t4 < f3.length - 1 && (l2 = k2.getAbsoluteDistance(e3[t4 + 1], r2.margin, true), i2 = Math.min(i2, l2))), f3.length > 1 && r2.limit && (n2 && t4 > 0 && (l2 = k2.getAbsoluteDistance(e3[t4 - 1], r2.limit, false), i2 = Math.min(i2, l2)), o2 && t4 < f3.length - 1 && (l2 = k2.getAbsoluteDistance(e3[t4 + 1], r2.limit, true), i2 = Math.max(i2, l2))), r2.padding && (0 === t4 && (l2 = k2.getAbsoluteDistance(0, r2.padding[0], false), i2 = Math.max(i2, l2)), t4 === f3.length - 1 && (l2 = k2.getAbsoluteDistance(100, r2.padding[1], true), i2 = Math.min(i2, l2))), s3 || (i2 = k2.getStep(i2)), !((i2 = p2(i2)) === e3[t4] && !a2) && i2;
      }
      function Se(e3, t4) {
        var i2 = r2.ort;
        return (i2 ? t4 : e3) + ", " + (i2 ? e3 : t4);
      }
      function xe(e3, t4, i2, n2, o2) {
        var a2 = i2.slice(), s3 = n2[0], l2 = r2.events.smoothSteps, u4 = [!e3, e3], c3 = [e3, !e3];
        n2 = n2.slice(), e3 && n2.reverse(), n2.length > 1 ? n2.forEach(function(e4, r3) {
          var i3 = ye(a2, e4, a2[e4] + t4, u4[r3], c3[r3], false, l2);
          false === i3 ? t4 = 0 : (t4 = i3 - a2[e4], a2[e4] = i3);
        }) : u4 = c3 = [true];
        var p3 = false;
        n2.forEach(function(e4, r3) {
          p3 = Ne(e4, i2[e4] + t4, u4[r3], c3[r3], false, l2) || p3;
        }), p3 && (n2.forEach(function(e4) {
          be("update", e4), be("slide", e4);
        }), null != o2 && be("drag", s3));
      }
      function we(e3, t4) {
        return r2.dir ? 100 - e3 - t4 : e3;
      }
      function Ee(e3, t4) {
        A2[e3] = t4, V2[e3] = k2.fromStepping(t4);
        var i2 = "translate(" + Se(we(t4, 0) - T2 + "%", "0") + ")";
        f3[e3].style[r2.transformRule] = i2, Ce(e3), Ce(e3 + 1);
      }
      function Pe() {
        M2.forEach(function(e3) {
          var t4 = A2[e3] > 50 ? -1 : 1, r3 = 3 + (f3.length + t4 * e3);
          f3[e3].style.zIndex = String(r3);
        });
      }
      function Ne(e3, t4, r3, i2, n2, o2) {
        return n2 || (t4 = ye(A2, e3, t4, r3, i2, false, o2)), false !== t4 && (Ee(e3, t4), true);
      }
      function Ce(e3) {
        if (x2[e3]) {
          var t4 = 0, i2 = 100;
          0 !== e3 && (t4 = A2[e3 - 1]), e3 !== x2.length - 1 && (i2 = A2[e3]);
          var n2 = i2 - t4, o2 = "translate(" + Se(we(t4, n2) + "%", "0") + ")", a2 = "scale(" + Se(n2 / 100, "1") + ")";
          x2[e3].style[r2.transformRule] = o2 + " " + a2;
        }
      }
      function ke(e3, t4) {
        return null === e3 || false === e3 || void 0 === e3 ? A2[t4] : ("number" == typeof e3 && (e3 = String(e3)), false !== (e3 = r2.format.from(e3)) && (e3 = k2.toStepping(e3)), false === e3 || isNaN(e3) ? A2[t4] : e3);
      }
      function Ve(e3, t4, i2) {
        var n2 = d2(e3), o2 = void 0 === A2[0];
        t4 = void 0 === t4 || t4, r2.animate && !o2 && c2(C2, r2.cssClasses.tap, r2.animationDuration), M2.forEach(function(e4) {
          Ne(e4, ke(n2[e4], e4), true, false, i2);
        });
        var a2 = 1 === M2.length ? 0 : 1;
        if (o2 && k2.hasNoSize() && (i2 = true, A2[0] = 0, M2.length > 1)) {
          var s3 = 100 / (M2.length - 1);
          M2.forEach(function(e4) {
            A2[e4] = e4 * s3;
          });
        }
        for (; a2 < M2.length; ++a2)
          M2.forEach(function(e4) {
            Ne(e4, A2[e4], true, true, i2);
          });
        Pe(), M2.forEach(function(e4) {
          be("update", e4), null !== n2[e4] && t4 && be("set", e4);
        });
      }
      function Ae(e3) {
        Ve(r2.start, e3);
      }
      function Me(e3, t4, r3, i2) {
        if (!((e3 = Number(e3)) >= 0 && e3 < M2.length))
          throw new Error("noUiSlider: invalid handle number, got: " + e3);
        Ne(e3, ke(t4, e3), true, true, i2), be("update", e3), r3 && be("set", e3);
      }
      function Le(e3) {
        if (void 0 === e3 && (e3 = false), e3)
          return 1 === V2.length ? V2[0] : V2.slice(0);
        var t4 = V2.map(r2.format.to);
        return 1 === t4.length ? t4[0] : t4;
      }
      function Ue() {
        for (ge(D.aria), ge(D.tooltips), Object.keys(r2.cssClasses).forEach(function(e3) {
          m2(C2, r2.cssClasses[e3]);
        }); C2.firstChild; )
          C2.removeChild(C2.firstChild);
        delete C2.noUiSlider;
      }
      function Oe(e3) {
        var t4 = A2[e3], i2 = k2.getNearbySteps(t4), n2 = V2[e3], o2 = i2.thisStep.step, a2 = null;
        if (r2.snap)
          return [n2 - i2.stepBefore.startValue || null, i2.stepAfter.startValue - n2 || null];
        false !== o2 && n2 + o2 > i2.stepAfter.startValue && (o2 = i2.stepAfter.startValue - n2), a2 = n2 > i2.thisStep.startValue ? i2.thisStep.step : false !== i2.stepBefore.step && n2 - i2.stepBefore.highestStep, 100 === t4 ? o2 = null : 0 === t4 && (a2 = null);
        var s3 = k2.countStepDecimals();
        return null !== o2 && false !== o2 && (o2 = Number(o2.toFixed(s3))), null !== a2 && false !== a2 && (a2 = Number(a2.toFixed(s3))), [a2, o2];
      }
      function De() {
        return M2.map(Oe);
      }
      function je(e3, t4) {
        var i2 = Le(), o2 = ["margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips"];
        o2.forEach(function(t5) {
          void 0 !== e3[t5] && (s2[t5] = e3[t5]);
        });
        var a2 = oe(s2);
        o2.forEach(function(t5) {
          void 0 !== e3[t5] && (r2[t5] = a2[t5]);
        }), k2 = a2.spectrum, r2.margin = a2.margin, r2.limit = a2.limit, r2.padding = a2.padding, r2.pips ? ee2(r2.pips) : Z2(), r2.tooltips ? I2() : Y2(), A2 = [], Ve(n(e3.start) ? e3.start : i2, t4);
      }
      function Fe() {
        u3 = B2(C2), R2(r2.connect, u3), he(r2.events), Ve(r2.start), r2.pips && ee2(r2.pips), r2.tooltips && I2(), W2();
      }
      Fe();
      var Te = { destroy: Ue, steps: De, on: me, off: ge, get: Le, set: Ve, setHandle: Me, reset: Ae, __moveHandles: function(e3, t4, r3) {
        xe(e3, t4, A2, r3);
      }, options: s2, updateOptions: je, target: C2, removePips: Z2, removeTooltips: Y2, getPositions: function() {
        return A2.slice();
      }, getTooltips: function() {
        return E2;
      }, getOrigins: function() {
        return f3;
      }, pips: ee2 };
      return Te;
    }
    function se(e3, t3) {
      if (!e3 || !e3.nodeName)
        throw new Error("noUiSlider: create requires a single element, got: " + e3);
      if (e3.noUiSlider)
        throw new Error("noUiSlider: Slider was already initialized.");
      var r2 = ae(e3, oe(t3), t3);
      return e3.noUiSlider = r2, r2;
    }
    var le = { __spectrum: L, cssClasses: O, create: se };
    e2.create = se, e2.cssClasses = O, e2.default = le, Object.defineProperty(e2, "__esModule", { value: true });
  }(t);
}));
function h(e, t) {
  if (!Array.isArray(e) || !Array.isArray(t))
    return false;
  const r = t.slice().sort();
  return e.length === t.length && e.slice().sort().every(function(e2, t2) {
    return e2 === r[t2];
  });
}
var m = { name: "Slider", emits: ["input", "update:modelValue", "start", "slide", "drag", "update", "change", "set", "end"], props: { ...{ value: { validator: function(e) {
  return (e2) => "number" == typeof e2 || e2 instanceof Array || null == e2 || false === e2;
}, required: false }, modelValue: { validator: function(e) {
  return (e2) => "number" == typeof e2 || e2 instanceof Array || null == e2 || false === e2;
}, required: false } }, id: { type: [String, Number], required: false }, disabled: { type: Boolean, required: false, default: false }, min: { type: Number, required: false, default: 0 }, max: { type: Number, required: false, default: 100 }, step: { type: Number, required: false, default: 1 }, orientation: { type: String, required: false, default: "horizontal" }, direction: { type: String, required: false, default: "ltr" }, tooltips: { type: Boolean, required: false, default: true }, options: { type: Object, required: false, default: () => ({}) }, merge: { type: Number, required: false, default: -1 }, format: { type: [Object, Function, Boolean], required: false, default: null }, classes: { type: Object, required: false, default: () => ({}) }, showTooltip: { type: String, required: false, default: "always" }, tooltipPosition: { type: String, required: false, default: null }, lazy: { type: Boolean, required: false, default: true }, ariaLabelledby: { type: String, required: false, default: void 0 }, aria: { required: false, type: Object, default: () => ({}) } }, setup(a, s) {
  const l = function(r, i, n) {
    const { value: o, modelValue: a2, min: s2 } = toRefs(r);
    let l2 = a2 && void 0 !== a2.value ? a2 : o;
    const c3 = ref(l2.value);
    if (u(l2.value) && (l2 = ref(s2.value)), Array.isArray(l2.value) && 0 == l2.value.length)
      throw new Error("Slider v-model must not be an empty array");
    return { value: l2, initialValue: c3 };
  }(a), c2 = function(t, i, n) {
    const { classes: o, showTooltip: a2, tooltipPosition: s2, orientation: l2 } = toRefs(t), u2 = computed(() => ({ target: "slider-target", focused: "slider-focused", tooltipFocus: "slider-tooltip-focus", tooltipDrag: "slider-tooltip-drag", ltr: "slider-ltr", rtl: "slider-rtl", horizontal: "slider-horizontal", vertical: "slider-vertical", textDirectionRtl: "slider-txt-dir-rtl", textDirectionLtr: "slider-txt-dir-ltr", base: "slider-base", connects: "slider-connects", connect: "slider-connect", origin: "slider-origin", handle: "slider-handle", handleLower: "slider-handle-lower", handleUpper: "slider-handle-upper", touchArea: "slider-touch-area", tooltip: "slider-tooltip", tooltipTop: "slider-tooltip-top", tooltipBottom: "slider-tooltip-bottom", tooltipLeft: "slider-tooltip-left", tooltipRight: "slider-tooltip-right", tooltipHidden: "slider-tooltip-hidden", active: "slider-active", draggable: "slider-draggable", tap: "slider-state-tap", drag: "slider-state-drag", pips: "slider-pips", pipsHorizontal: "slider-pips-horizontal", pipsVertical: "slider-pips-vertical", marker: "slider-marker", markerHorizontal: "slider-marker-horizontal", markerVertical: "slider-marker-vertical", markerNormal: "slider-marker-normal", markerLarge: "slider-marker-large", markerSub: "slider-marker-sub", value: "slider-value", valueHorizontal: "slider-value-horizontal", valueVertical: "slider-value-vertical", valueNormal: "slider-value-normal", valueLarge: "slider-value-large", valueSub: "slider-value-sub", ...o.value }));
    return { classList: computed(() => {
      const e = { ...u2.value };
      return Object.keys(e).forEach((t2) => {
        e[t2] = Array.isArray(e[t2]) ? e[t2].filter((e2) => null !== e2).join(" ") : e[t2];
      }), "always" !== a2.value && (e.target += ` ${"drag" === a2.value ? e.tooltipDrag : e.tooltipFocus}`), "horizontal" === l2.value && (e.tooltip += "bottom" === s2.value ? ` ${e.tooltipBottom}` : ` ${e.tooltipTop}`), "vertical" === l2.value && (e.tooltip += "right" === s2.value ? ` ${e.tooltipRight}` : ` ${e.tooltipLeft}`), e;
    }) };
  }(a), p2 = function(t, i, n) {
    const { format: o, step: a2 } = toRefs(t), s2 = n.value, l2 = n.classList, u2 = computed(() => o && o.value ? "function" == typeof o.value ? { to: o.value } : d({ ...o.value }) : d({ decimals: a2.value >= 0 ? 0 : 2 })), c3 = computed(() => Array.isArray(s2.value) ? s2.value.map((e) => u2.value) : u2.value);
    return { tooltipFormat: u2, tooltipsFormat: c3, tooltipsMerge: (e, t2, r) => {
      var i2 = "rtl" === getComputedStyle(e).direction, n2 = "rtl" === e.noUiSlider.options.direction, o2 = "vertical" === e.noUiSlider.options.orientation, a3 = e.noUiSlider.getTooltips(), s3 = e.noUiSlider.getOrigins();
      a3.forEach(function(e2, t3) {
        e2 && s3[t3].appendChild(e2);
      }), e.noUiSlider.on("update", function(e2, s4, c4, p3, d2) {
        var f2 = [[]], h2 = [[]], m3 = [[]], v = 0;
        a3[0] && (f2[0][0] = 0, h2[0][0] = d2[0], m3[0][0] = u2.value.to(parseFloat(e2[0])));
        for (var g = 1; g < e2.length; g++)
          (!a3[g] || e2[g] - e2[g - 1] > t2) && (f2[++v] = [], m3[v] = [], h2[v] = []), a3[g] && (f2[v].push(g), m3[v].push(u2.value.to(parseFloat(e2[g]))), h2[v].push(d2[g]));
        f2.forEach(function(e3, t3) {
          for (var s5 = e3.length, u3 = 0; u3 < s5; u3++) {
            var c5 = e3[u3];
            if (u3 === s5 - 1) {
              var p4 = 0;
              h2[t3].forEach(function(e4) {
                p4 += 1e3 - e4;
              });
              var d3 = o2 ? "bottom" : "right", f3 = n2 ? 0 : s5 - 1, v2 = 1e3 - h2[t3][f3];
              p4 = (i2 && !o2 ? 100 : 0) + p4 / s5 - v2, a3[c5].innerHTML = m3[t3].join(r), a3[c5].style.display = "block", a3[c5].style[d3] = p4 + "%", l2.value.tooltipHidden.split(" ").forEach((e4) => {
                a3[c5].classList.contains(e4) && a3[c5].classList.remove(e4);
              });
            } else
              a3[c5].style.display = "none", l2.value.tooltipHidden.split(" ").forEach((e4) => {
                a3[c5].classList.add(e4);
              });
          }
        });
      });
    } };
  }(a, 0, { value: l.value, classList: c2.classList }), m2 = function(a2, s2, l2) {
    const { orientation: c3, direction: p3, tooltips: d2, step: m3, min: v, max: g, merge: b, id: y, disabled: S, options: x, classes: w, format: E, lazy: P, ariaLabelledby: N, aria: C } = toRefs(a2), k = l2.value, V = l2.initialValue, A = l2.tooltipsFormat, M = l2.tooltipsMerge, L = l2.tooltipFormat, U = l2.classList, O = ref(null), D = ref(null), j = ref(false), F = computed(() => {
      let e = { cssPrefix: "", cssClasses: U.value, orientation: c3.value, direction: p3.value, tooltips: !!d2.value && A.value, connect: "lower", start: u(k.value) ? v.value : k.value, range: { min: v.value, max: g.value } };
      if (m3.value > 0 && (e.step = m3.value), Array.isArray(k.value) && (e.connect = true), N && N.value || C && Object.keys(C.value).length) {
        let t = Array.isArray(k.value) ? k.value : [k.value];
        e.handleAttributes = t.map((e2) => Object.assign({}, C.value, N && N.value ? { "aria-labelledby": N.value } : {}));
      }
      return E.value && (e.ariaFormat = L.value), e;
    }), T = computed(() => {
      let e = { id: y && y.value ? y.value : void 0 };
      return S.value && (e.disabled = true), e;
    }), z = computed(() => Array.isArray(k.value)), H = () => {
      let e = D.value.get();
      return Array.isArray(e) ? e.map((e2) => parseFloat(e2)) : parseFloat(e);
    }, q = function(e) {
      let t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      D.value.set(e, t);
    }, R = (e) => {
      s2.emit("input", e), s2.emit("update:modelValue", e), s2.emit("update", e);
    }, B = () => {
      D.value = f.create(O.value, Object.assign({}, F.value, x.value)), d2.value && z.value && b.value >= 0 && M(O.value, b.value, " - "), D.value.on("set", () => {
        const e = H();
        s2.emit("change", e), s2.emit("set", e), P.value && R(e);
      }), D.value.on("update", () => {
        if (!j.value)
          return;
        const e = H();
        z.value && h(k.value, e) || !z.value && k.value == e ? s2.emit("update", e) : P.value || R(e);
      }), D.value.on("start", () => {
        s2.emit("start", H());
      }), D.value.on("end", () => {
        s2.emit("end", H());
      }), D.value.on("slide", () => {
        s2.emit("slide", H());
      }), D.value.on("drag", () => {
        s2.emit("drag", H());
      }), O.value.querySelectorAll("[data-handle]").forEach((e) => {
        e.onblur = () => {
          O.value && U.value.focused.split(" ").forEach((e2) => {
            O.value.classList.remove(e2);
          });
        }, e.onfocus = () => {
          U.value.focused.split(" ").forEach((e2) => {
            O.value.classList.add(e2);
          });
        };
      }), j.value = true;
    }, _ = () => {
      D.value.off(), D.value.destroy(), D.value = null;
    }, $ = (e, t) => {
      j.value = false, _(), B();
    };
    return onMounted(B), onUnmounted(_), watch(z, $, { immediate: false }), watch(v, $, { immediate: false }), watch(g, $, { immediate: false }), watch(m3, $, { immediate: false }), watch(c3, $, { immediate: false }), watch(p3, $, { immediate: false }), watch(d2, $, { immediate: false }), watch(b, $, { immediate: false }), watch(E, $, { immediate: false, deep: true }), watch(x, $, { immediate: false, deep: true }), watch(w, $, { immediate: false, deep: true }), watch(k, (e, t) => {
      t && ("object" == typeof t && "object" == typeof e && e && Object.keys(t) > Object.keys(e) || "object" == typeof t && "object" != typeof e || u(e)) && $();
    }, { immediate: false }), watch(k, (e) => {
      if (u(e))
        return void q(v.value, false);
      let t = H();
      z.value && !Array.isArray(t) && (t = [t]), (z.value && !h(e, t) || !z.value && e != t) && q(e, false);
    }, { deep: true }), { slider: O, slider$: D, isRange: z, sliderProps: T, init: B, destroy: _, refresh: $, update: q, reset: () => {
      R(V.value);
    } };
  }(a, s, { value: l.value, initialValue: l.initialValue, tooltipFormat: p2.tooltipFormat, tooltipsFormat: p2.tooltipsFormat, tooltipsMerge: p2.tooltipsMerge, classList: c2.classList });
  return { ...c2, ...p2, ...m2 };
} };
m.render = function(e, t, r, i, n, o) {
  return openBlock(), createElementBlock("div", mergeProps(e.sliderProps, { ref: "slider" }), null, 16);
}, m.__file = "src/Slider.vue";
const _default = "";
let getSliderOptions = (function(alias, redefines) {
  if (!this.initialized[alias]) {
    this.initialized[alias] = JSON.parse(JSON.stringify(this.defaults));
    if (redefines)
      for (let f2 in redefines)
        this.initialized[alias][f2] = redefines[f2];
  }
  return this.initialized[alias];
}).bind({
  defaults: {
    tooltips: false,
    lazy: false,
    max: 100,
    options: {
      handleAttributes: [
        { "tabindex": "100" }
      ]
    }
  },
  initialized: {}
});
const i18n = {
  strings: null,
  available_locales: [],
  active_locale: "en",
  // Presuming english is always is there in our strings
  back_ref: null,
  backRef: function(ref2) {
    this.back_ref = ref2;
  },
  termContains: function(section, term, field, search) {
    for (let locale of this.available_locales) {
      if (this.strings[section][locale][term][field].some((v) => v.toLowerCase().indexOf(search) != -1))
        return true;
    }
    return false;
  },
  setStrings: function(data, default_locale) {
    this.strings = data;
    for (let lang of Object.keys(data[Object.keys(data)[0]])) {
      if (!this.available_locales.includes(lang))
        this.available_locales.push(lang);
    }
    let browser_lang = default_locale ? default_locale : navigator.language || navigator.userLanguage;
    for (let lang of this.available_locales) {
      if (lang === browser_lang) {
        this.back_ref.active_locale = lang;
        break;
      }
      if (browser_lang.indexOf(lang) === 0)
        this.back_ref.active_locale = lang;
    }
    for (let section in this.strings) {
      for (let locale in this.strings[section]) {
        for (let term in this.strings[section][locale]) {
          if (typeof this.strings[section][locale][term] === "string")
            continue;
          for (let field in this.strings[section][locale][term]) {
            let value = this.strings[section][locale][term][field];
            if (value.indexOf("{") == -1)
              this.strings[section][locale][term][field] = [value];
            else {
              this.strings[section][locale][term][field] = [];
              let placeholders = [...value.matchAll(/\{.*?\}/g)];
              let replacements = [];
              for (let i2 = 0; i2 < placeholders.length; i2++) {
                let vls = placeholders[i2][0].replace(/[{}]/g, "").split(/\|/);
                for (let j = 0; j < vls.length; j++) {
                  if (!replacements[j])
                    replacements[j] = [vls[j]];
                  else
                    replacements[j].push(vls[j]);
                }
              }
              for (var i = 0; i < replacements.length; i++) {
                let new_value = value;
                for (let replacement of replacements[i]) {
                  new_value = new_value.replace(/\{.*?\}/, replacement);
                }
                this.strings[section][locale][term][field].push(new_value);
              }
            }
          }
        }
      }
    }
  },
  getLocales: function() {
    return this.available_locales;
  },
  switchLocale: function(locale) {
    this.active_locale = locale;
  },
  getActiveLocale: function() {
    return this.active_locale;
  },
  getTerm: function(section, term, field, form, substitutions) {
    let value = this.strings[section][this.active_locale][term];
    let rv = null;
    if (typeof value === "string") {
      rv = value;
    }
    if (Array.isArray(value[field])) {
      if (form !== void 0 && value[field][form]) {
        rv = value[field][form];
      } else {
        rv = value[field][0];
      }
    }
    if (substitutions) {
      for (let subj in substitutions) {
        rv = rv.replace(subj, substitutions[subj]);
      }
    }
    return rv;
  }
};
const i18n_strings = {
  "effects": {
    "en": {
      "cure_disease": {
        "name": "Cure Disease",
        "description": "Cures all diseases."
      },
      "cure_poison": {
        "name": "Cure Poison",
        "description": "Stops poison's continuing effects."
      },
      "damage_health": {
        "name": "Damage Health",
        "description": "Causes <mag> points of poison damage."
      },
      "damage_magicka": {
        "name": "Damage Magicka",
        "description": "Drains the target's Magicka by <mag> points."
      },
      "damage_magicka_regen": {
        "name": "Damage Magicka Regen",
        "description": "Decrease the target's Magicka regeneration by <mag>% for <dur> seconds."
      },
      "damage_stamina": {
        "name": "Damage Stamina",
        "description": "Drain the target's Stamina by <mag> points."
      },
      "damage_stamina_regen": {
        "name": "Damage Stamina Regen",
        "description": "Decrease the target's Stamina regeneration by <mag>% for <dur> seconds."
      },
      "fear": {
        "name": "Fear",
        "description": "Creatures and people up to level <mag> flee from combat for <dur> seconds."
      },
      "fortify_alteration": {
        "name": "Fortify Alteration",
        "description": "Alteration spells last <mag>% longer for <dur> seconds."
      },
      "fortify_barter": {
        "name": "Fortify Barter",
        "description": "You haggle for <mag>% better prices for <dur> seconds."
      },
      "fortify_block": {
        "name": "Fortify Block",
        "description": "Blocking absorbs <mag>% more damage for <dur> seconds."
      },
      "fortify_carry_weight": {
        "name": "Fortify Carry Weight",
        "description": "Carrying capacity increases by <mag> for <dur> seconds."
      },
      "fortify_conjuration": {
        "name": "Fortify Conjuration",
        "description": "Conjurations spells last <mag>% longer for <dur> seconds."
      },
      "fortify_destruction": {
        "name": "Fortify Destruction",
        "description": "Destruction spells are <mag>% stronger for <dur> seconds."
      },
      "fortify_enchanting": {
        "name": "Fortify Enchanting",
        "description": "For <dur> seconds, items are enchanted <mag>% stronger."
      },
      "fortify_health": {
        "name": "Fortify Health",
        "description": "Health is increased by <mag> points for <dur> seconds."
      },
      "fortify_heavy_armor": {
        "name": "Fortify Heavy Armor",
        "description": "Increase Heavy Armor skill by <mag> points for <dur> seconds."
      },
      "fortify_illusion": {
        "name": "Fortify Illusion",
        "description": "Illusion spells are <mag>% stronger for <dur> seconds."
      },
      "fortify_light_armor": {
        "name": "Fortify Light Armor",
        "description": "Increases Light Armor skill by <mag> points for <dur> seconds."
      },
      "fortify_lockpicking": {
        "name": "Fortify Lockpicking",
        "description": "Lockpicking is <mag>% easier for <dur> seconds."
      },
      "fortify_magicka": {
        "name": "Fortify Magicka",
        "description": "Magicka is increased by <mag> points for <dur> seconds."
      },
      "fortify_marksman": {
        "name": "Fortify Marksman",
        "description": "Bows do <mag>% more damage for <dur> seconds."
      },
      "fortify_onehanded": {
        "name": "Fortify One-handed",
        "description": "One-handed weapons do <mag>% more damage for <dur> seconds."
      },
      "fortify_persuasion": {
        "name": "Fortify Persuasion",
        "description": "+<mag> Speechcraft for <dur> seconds."
      },
      "fortify_pickpocket": {
        "name": "Fortify Pickpocket",
        "description": "Pickpocketing is <mag>% easier for <dur> seconds."
      },
      "fortify_restoration": {
        "name": "Fortify Restoration",
        "description": "Restoration spells are <mag>% stronger for <dur> seconds."
      },
      "fortify_smithing": {
        "name": "Fortify Smithing",
        "description": "For <dur> seconds, weapon and armor improving is <mag>% better."
      },
      "fortify_sneak": {
        "name": "Fortify Sneak",
        "description": "You are <mag>% harder to detect for <dur> seconds."
      },
      "fortify_stamina": {
        "name": "Fortify Stamina",
        "description": "Stamina is increased by <mag> points for <dur> seconds."
      },
      "fortify_twohanded": {
        "name": "Fortify Two-handed",
        "description": "Two-handed weapons do <mag>% more damage for <dur> seconds."
      },
      "frenzy": {
        "name": "Frenzy",
        "description": "Creatures and people up to level <mag> will attack anything nearby for <dur> seconds."
      },
      "invisibility": {
        "name": "Invisibility",
        "description": "Invisibility for <dur> seconds."
      },
      "light": {
        "name": "Light",
        "description": "Emits a small light that lasts for <dur> seconds."
      },
      "lingering_damage_health": {
        "name": "Lingering Damage Health",
        "description": "Causes <mag> points of poison damage for <dur> seconds."
      },
      "lingering_damage_magicka": {
        "name": "Lingering Damage Magicka",
        "description": "Drains the target's Magicka by <mag> points per second for <dur> seconds."
      },
      "lingering_damage_stamina": {
        "name": "Lingering Damage Stamina",
        "description": "Drain the target's Stamina by <mag> points per second for <dur> seconds."
      },
      "night_eye": {
        "name": "Night Eye",
        "description": "Improved night vision for <dur> seconds."
      },
      "paralysis": {
        "name": "Paralysis",
        "description": "Target is paralyzed for <dur> seconds."
      },
      "ravage_health": {
        "name": "Ravage Health",
        "description": "Causes <mag> points of concentrated poison damage."
      },
      "ravage_magicka": {
        "name": "Ravage Magicka",
        "description": "Concentrated poison damages maximum magicka by <mag> points."
      },
      "ravage_stamina": {
        "name": "Ravage Stamina",
        "description": "Concentrated poison damages maximum stamina by <mag> points."
      },
      "regenerate_health": {
        "name": "Regenerate Health",
        "description": "Health regenerates <mag>% faster for <dur> seconds."
      },
      "regenerate_magicka": {
        "name": "Regenerate Magicka",
        "description": "Magicka regenerates <mag>% faster for <dur> seconds."
      },
      "regenerate_stamina": {
        "name": "Regenerate Stamina",
        "description": "Stamina regenerates <mag>% faster for <dur> seconds."
      },
      "resist_fire": {
        "name": "Resist Fire",
        "description": "Resist <mag>% of fire damage for <dur> seconds."
      },
      "resist_frost": {
        "name": "Resist Frost",
        "description": "Resist <mag>% of frost damage for <dur> seconds."
      },
      "resist_magic": {
        "name": "Resist Magic",
        "description": "Resist <mag>% of magic for <dur> seconds."
      },
      "resist_poison": {
        "name": "Resist Poison",
        "description": "Resist <mag>% of poison for <dur> seconds."
      },
      "resist_shock": {
        "name": "Resist Shock",
        "description": "Resist <mag>% of shock damage for <dur> seconds."
      },
      "restore_health": {
        "name": "Restore Health",
        "description": "Restore <mag> points of Health."
      },
      "restore_magicka": {
        "name": "Restore Magicka",
        "description": "Restore <mag> points of Magicka."
      },
      "restore_stamina": {
        "name": "Restore Stamina",
        "description": "Restore <mag> Stamina."
      },
      "slow": {
        "name": "Slow",
        "description": "Target moves at 50% speed for <dur> seconds."
      },
      "spell_absorption": {
        "name": "Spell Absorption",
        "description": "Absorb <mag>% of the magicka from hostile spells for <dur> seconds."
      },
      "waterbreathing": {
        "name": "Waterbreathing",
        "description": "Can breathe underwater for <dur> seconds."
      },
      "weakness_to_fire": {
        "name": "Weakness to Fire",
        "description": "Target is <mag>% weaker to fire damage for <dur> seconds."
      },
      "weakness_to_frost": {
        "name": "Weakness to Frost",
        "description": "Target is <mag>% weaker to frost damage for <dur> seconds."
      },
      "weakness_to_magic": {
        "name": "Weakness to Magic",
        "description": "Target is <mag>% weaker to magic for <dur> seconds."
      },
      "weakness_to_poison": {
        "name": "Weakness to Poison",
        "description": "Target is <mag>% weaker to poison for <dur> seconds."
      },
      "weakness_to_shock": {
        "name": "Weakness to Shock",
        "description": "Target is <mag>% weaker to shock damage for <dur> seconds."
      }
    },
    "ru": {
      "cure_disease": {
        "name": "{И|и}сцелени{е|я} болезней",
        "description": "Cures all diseases."
      },
      "cure_poison": {
        "name": "{П|п}ротивояди{е|я}",
        "description": "Stops poison's continuing effects."
      },
      "damage_health": {
        "name": "{У|у}рон{|a} здоровью",
        "description": "Causes <mag> points of poison damage."
      },
      "damage_magicka": {
        "name": "{У|у}рон{|a} магии",
        "description": "Drains the target's Magicka by <mag> points."
      },
      "damage_magicka_regen": {
        "name": "{П|п}овреждени{е|я} регенерации магии",
        "description": "Decrease the target's Magicka regeneration by <mag>% for <dur> seconds."
      },
      "damage_stamina": {
        "name": "{У|у}рон{|a} запасу сил",
        "description": "Drain the target's Stamina by <mag> points."
      },
      "damage_stamina_regen": {
        "name": "{П|п}овреждени{е|я} регенерации запаса сил",
        "description": "Decrease the target's Stamina regeneration by <mag>% for <dur> seconds."
      },
      "fear": {
        "name": "{С|с}трах{|а}",
        "description": "Creatures and people up to level <mag> flee from combat for <dur> seconds."
      },
      "fortify_alteration": {
        "name": "{П|п}овышени{е|я} навыка: изменение",
        "description": "Alteration spells last <mag>% longer for <dur> seconds."
      },
      "fortify_barter": {
        "name": "{П|п}овышени{е|я} искусства торговли",
        "description": "You haggle for <mag>% better prices for <dur> seconds."
      },
      "fortify_block": {
        "name": "{П|п}овышени{е|я} навыка: блокирование",
        "description": "Blocking absorbs <mag>% more damage for <dur> seconds."
      },
      "fortify_carry_weight": {
        "name": "{П|п}овышени{е|я} переносимого веса",
        "description": "Carrying capacity increases by <mag> for <dur> seconds."
      },
      "fortify_conjuration": {
        "name": "{П|п}овышени{е|я} навыка: колдовство",
        "description": "Conjurations spells last <mag>% longer for <dur> seconds."
      },
      "fortify_destruction": {
        "name": "{П|п}овышени{е|я} навыка: разрушение",
        "description": "Destruction spells are <mag>% stronger for <dur> seconds."
      },
      "fortify_enchanting": {
        "name": "{П|п}овышени{е|я} навыка: зачарование",
        "description": "For <dur> seconds, items are enchanted <mag>% stronger."
      },
      "fortify_health": {
        "name": "{П|п}овышени{е|я} здоровья",
        "description": "Health is increased by <mag> points for <dur> seconds."
      },
      "fortify_heavy_armor": {
        "name": "{П|п}овышени{е|я} навыка: тяжёлая броня",
        "description": "Increase Heavy Armor skill by <mag> points for <dur> seconds."
      },
      "fortify_illusion": {
        "name": "{П|п}овышени{е|я} навыка: иллюзия",
        "description": "Illusion spells are <mag>% stronger for <dur> seconds."
      },
      "fortify_light_armor": {
        "name": "{П|п}овышени{е|я} навыка: лёгкая броня",
        "description": "Increases Light Armor skill by <mag> points for <dur> seconds."
      },
      "fortify_lockpicking": {
        "name": "{П|п}овышени{е|я} навыка: взлом",
        "description": "Lockpicking is <mag>% easier for <dur> seconds."
      },
      "fortify_magicka": {
        "name": "{П|п}овышени{е|я} магии",
        "description": "Magicka is increased by <mag> points for <dur> seconds."
      },
      "fortify_marksman": {
        "name": "{П|п}овышени{е|я} навыка: стрельба",
        "description": "Bows do <mag>% more damage for <dur> seconds."
      },
      "fortify_onehanded": {
        "name": "{П|п}овышени{е|я} навыка: одноручное оружие",
        "description": "One-handed weapons do <mag>% more damage for <dur> seconds."
      },
      "fortify_persuasion": {
        "name": "{П|п}овышени{е|я} убеждения",
        "description": "+<mag> Speechcraft for <dur> seconds."
      },
      "fortify_pickpocket": {
        "name": "{П|п}овышени{е|я} навыка: карманные кражи",
        "description": "Pickpocketing is <mag>% easier for <dur> seconds."
      },
      "fortify_restoration": {
        "name": "{П|п}овышени{е|я} навыка: восстановление",
        "description": "Restoration spells are <mag>% stronger for <dur> seconds."
      },
      "fortify_smithing": {
        "name": "{П|п}овышени{е|я} навыка: кузнечное дело",
        "description": "For <dur> seconds, weapon and armor improving is <mag>% better."
      },
      "fortify_sneak": {
        "name": "{П|п}овышени{е|я} навыка: скрытность",
        "description": "You are <mag>% harder to detect for <dur> seconds."
      },
      "fortify_stamina": {
        "name": "{П|п}овышени{е|я} запаса сил",
        "description": "Stamina is increased by <mag> points for <dur> seconds."
      },
      "fortify_twohanded": {
        "name": "{П|п}овышени{е|я} навыка: двуручное оружие",
        "description": "Two-handed weapons do <mag>% more damage for <dur> seconds."
      },
      "frenzy": {
        "name": "{Б|б}ешенств{о|a}",
        "description": "Creatures and people up to level <mag> will attack anything nearby for <dur> seconds."
      },
      "invisibility": {
        "name": "{Н|н}евидимост{ь|и}",
        "description": "Invisibility for <dur> seconds."
      },
      "light": {
        "name": "{С|с}вет{а}",
        "description": "Emits a small light that lasts for <dur> seconds."
      },
      "lingering_damage_health": {
        "name": "{З|з}атяжно{й|го} урон{|а} здоровью",
        "description": "Causes <mag> points of poison damage for <dur> seconds."
      },
      "lingering_damage_magicka": {
        "name": "{З|з}атяжно{й|го} урон{|а} магии",
        "description": "Drains the target's Magicka by <mag> points per second for <dur> seconds."
      },
      "lingering_damage_stamina": {
        "name": "{З|з}атяжно{й|го} урон{|а} запасу сил",
        "description": "Drain the target's Stamina by <mag> points per second for <dur> seconds."
      },
      "night_eye": {
        "name": "{Н|н}очно{й|го} глаз{|а}",
        "description": "Improved night vision for <dur> seconds."
      },
      "paralysis": {
        "name": "{П|п}аралич{|а}",
        "description": "Target is paralyzed for <dur> seconds."
      },
      "ravage_health": {
        "name": "{О|о}пустошени{е|я} здоровья",
        "description": "Causes <mag> points of concentrated poison damage."
      },
      "ravage_magicka": {
        "name": "{О|о}пустошени{е|я} магии",
        "description": "Concentrated poison damages maximum magicka by <mag> points."
      },
      "ravage_stamina": {
        "name": "{О|о}пустошени{е|я} запаса сил",
        "description": "Concentrated poison damages maximum stamina by <mag> points."
      },
      "regenerate_health": {
        "name": "{Р|р}егенераци{я|и} здоровья",
        "description": "Health regenerates <mag>% faster for <dur> seconds."
      },
      "regenerate_magicka": {
        "name": "{Р|р}егенераци{я|и} магии",
        "description": "Magicka regenerates <mag>% faster for <dur> seconds."
      },
      "regenerate_stamina": {
        "name": "{Р|р}егенераци{я|и} запаса сил",
        "description": "Stamina regenerates <mag>% faster for <dur> seconds."
      },
      "resist_fire": {
        "name": "{С|с}опротивлени{е|я} огню",
        "description": "Resist <mag>% of fire damage for <dur> seconds."
      },
      "resist_frost": {
        "name": "{С|с}опротивлени{е|я} холоду",
        "description": "Resist <mag>% of frost damage for <dur> seconds."
      },
      "resist_magic": {
        "name": "{С|с}опротивлени{е|я} магии",
        "description": "Resist <mag>% of magic for <dur> seconds."
      },
      "resist_poison": {
        "name": "{С|с}опротивлени{е|я} ядам",
        "description": "Resist <mag>% of poison for <dur> seconds."
      },
      "resist_shock": {
        "name": "{С|с}опротивлени{е|я} электричеству",
        "description": "Resist <mag>% of shock damage for <dur> seconds."
      },
      "restore_health": {
        "name": "{В|в}осстановлени{е|я} здоровья",
        "description": "Restore <mag> points of Health."
      },
      "restore_magicka": {
        "name": "{В|в}осстановлени{е|я} магии",
        "description": "Restore <mag> points of Magicka."
      },
      "restore_stamina": {
        "name": "{В|в}осстановлени{е|я} запаса сил",
        "description": "Restore <mag> Stamina."
      },
      "slow": {
        "name": "{З|з}амедлени{е|я}",
        "description": "Target moves at 50% speed for <dur> seconds."
      },
      "spell_absorption": {
        "name": "{П|п}оглощени{е|я} заклинаний",
        "description": "Absorb <mag>% of the magicka from hostile spells for <dur> seconds."
      },
      "waterbreathing": {
        "name": "{В|в}одно{е|ого} дыхание",
        "description": "Can breathe underwater for <dur> seconds."
      },
      "weakness_to_fire": {
        "name": "{У|у}язвимост{ь|и} к огню",
        "description": "Target is <mag>% weaker to fire damage for <dur> seconds."
      },
      "weakness_to_frost": {
        "name": "{У|у}язвимост{ь|и} к холоду",
        "description": "Target is <mag>% weaker to frost damage for <dur> seconds."
      },
      "weakness_to_magic": {
        "name": "{У|у}язвимост{ь|и} к магии",
        "description": "Target is <mag>% weaker to magic for <dur> seconds."
      },
      "weakness_to_poison": {
        "name": "{У|у}язвимост{ь|и} к яду",
        "description": "Target is <mag>% weaker to poison for <dur> seconds."
      },
      "weakness_to_shock": {
        "name": "{У|у}язвимост{ь|и} к электричеству",
        "description": "Target is <mag>% weaker to shock damage for <dur> seconds."
      }
    }
  },
  "iface": {
    "en": {
      "ingredients": "Ingredients",
      "effects": "Effects",
      "select_all": "+ Select All",
      "unselect_all": "- Unselect All",
      "filter": "Filter",
      "poison": "Poison of",
      "potion": "Potion of",
      "no_potions": "No potions available with selected setup",
      "filter_hint": 'Activate filter by pressing any key\nSplit terms with punctuation marks, i.e.: "bee|feath"\nEnter toggles filtered elements\nEsc cancels filter',
      "alchemy": "Alchemy",
      "alchemy_fortify": "Alchemy Fortify",
      "alchemy_perk": "Alchemy Perk",
      "physician_perk": "Physician Perk",
      "purity_perk": "Purity Perk",
      "benefactor_perk": "Benefactor Perk",
      "poisoner_perk": "Poisoner Perk",
      "github_link": "Project on GitHub"
    },
    "ru": {
      "ingredients": "Ингредиенты",
      "effects": "Эффекты",
      "select_all": "+ Выбрать всё",
      "unselect_all": "- Снять выделение",
      "filter": "Фильтровать",
      "poison": "Яд",
      "potion": "Зелье",
      "no_potions": "Для текущих настроек зельев нет",
      "filter_hint": 'Любая кнопка активирует фильтр\nРазделяйте слова знаками препинания, например: "пчел|перь"\nEnter пеперключает отфильтрованное\nEsc отменяет фильтр',
      "alchemy": "Алхимия",
      "alchemy_fortify": "Зачарование",
      "alchemy_perk": "Способность Алхимик",
      "physician_perk": "Целитель",
      "purity_perk": "Чистота",
      "benefactor_perk": "Провизор",
      "poisoner_perk": "Отравитель",
      "github_link": "Проект на GitHub"
    }
  },
  "ingredients": {
    "en": {
      "abecean_longfin": {
        "name": "Abecean Longfin"
      },
      "alocasia_fruit": {
        "name": "Alocasia Fruit"
      },
      "ambrosia": {
        "name": "Ambrosia"
      },
      "ancestor_moth_wing": {
        "name": "Ancestor Moth Wing"
      },
      "angelfish": {
        "name": "Angelfish"
      },
      "angler_larvae": {
        "name": "Angler Larvae"
      },
      "ash_creep_cluster": {
        "name": "Ash Creep Cluster"
      },
      "ash_hopper_jelly": {
        "name": "Ash Hopper Jelly"
      },
      "ashen_grass_pod": {
        "name": "Ashen Grass Pod"
      },
      "aster_bloom_core": {
        "name": "Aster Bloom Core"
      },
      "bear_claws": {
        "name": "Bear Claws"
      },
      "bee": {
        "name": "Bee"
      },
      "beehive_husk": {
        "name": "Beehive Husk"
      },
      "berits_ashes": {
        "name": "Berit's Ashes"
      },
      "bittergreen_petals": {
        "name": "Bittergreen Petals"
      },
      "bleeding_crown": {
        "name": "Bleeding Crown"
      },
      "blind_watchers_eye": {
        "name": "Blind Watcher's Eye"
      },
      "bliss_bug_thorax": {
        "name": "Bliss Bug Thorax"
      },
      "blister_pod_cap": {
        "name": "Blister Pod Cap"
      },
      "blisterwort": {
        "name": "Blisterwort"
      },
      "bloodgrass": {
        "name": "Bloodgrass"
      },
      "blue_butterfly_wing": {
        "name": "Blue Butterfly Wing"
      },
      "blue_dartwing": {
        "name": "Blue Dartwing"
      },
      "blue_mountain_flower": {
        "name": "Blue Mountain Flower"
      },
      "boar_tusk": {
        "name": "Boar Tusk"
      },
      "bog_beacon": {
        "name": "Bog Beacon"
      },
      "bone_meal": {
        "name": "Bone Meal"
      },
      "briar_heart": {
        "name": "Briar Heart"
      },
      "bunglers_bane": {
        "name": "Bungler's Bane"
      },
      "burnt_spriggan_wood": {
        "name": "Burnt Spriggan Wood"
      },
      "butterfly_wing": {
        "name": "Butterfly Wing"
      },
      "canis_root": {
        "name": "Canis Root"
      },
      "charred_skeever_hide": {
        "name": "Charred Skeever Hide"
      },
      "chaurus_eggs": {
        "name": "Chaurus Eggs"
      },
      "chaurus_hunter_antennae": {
        "name": "Chaurus Hunter Antennae"
      },
      "chickens_egg": {
        "name": "Chicken's Egg"
      },
      "chokeberry": {
        "name": "Chokeberry"
      },
      "chokeweed": {
        "name": "Chokeweed"
      },
      "coda_flower": {
        "name": "Coda Flower"
      },
      "comberry": {
        "name": "Comberry"
      },
      "congealed_putrescence": {
        "name": "Congealed Putrescence"
      },
      "corkbulb_root": {
        "name": "Corkbulb Root"
      },
      "creep_cluster": {
        "name": "Creep Cluster"
      },
      "crimson_nirnroot": {
        "name": "Crimson Nirnroot"
      },
      "cyrodilic_spadetail": {
        "name": "Cyrodilic Spadetail"
      },
      "daedra_heart": {
        "name": "Daedra Heart"
      },
      "daedra_silk": {
        "name": "Daedra Silk"
      },
      "daedra_venin": {
        "name": "Daedra Venin"
      },
      "daedroth_teeth": {
        "name": "Daedroth Teeth"
      },
      "deathbell": {
        "name": "Deathbell"
      },
      "dragons_tongue": {
        "name": "Dragon's Tongue"
      },
      "dreugh_wax": {
        "name": "Dreugh Wax"
      },
      "dwarven_oil": {
        "name": "Dwarven Oil"
      },
      "ectoplasm": {
        "name": "Ectoplasm"
      },
      "elves_ear": {
        "name": "Elves Ear"
      },
      "elytra_ichor": {
        "name": "Elytra Ichor"
      },
      "emperor_parasol_moss": {
        "name": "Emperor Parasol Moss"
      },
      "eye_of_sabre_cat": {
        "name": "Eye of Sabre Cat"
      },
      "falmer_ear": {
        "name": "Falmer Ear"
      },
      "felsaad_tern_feathers": {
        "name": "Felsaad Tern Feathers"
      },
      "fire_petal": {
        "name": "Fire Petal"
      },
      "fire_salts": {
        "name": "Fire Salts"
      },
      "flame_stalk": {
        "name": "Flame Stalk"
      },
      "fly_amanita": {
        "name": "Fly Amanita"
      },
      "frost_mirriam": {
        "name": "Frost Mirriam"
      },
      "frost_salts": {
        "name": "Frost Salts"
      },
      "fungus_stalk": {
        "name": "Fungus Stalk"
      },
      "garlic": {
        "name": "Garlic"
      },
      "giant_lichen": {
        "name": "Giant Lichen"
      },
      "giants_toe": {
        "name": "Giant's Toe"
      },
      "glassfish": {
        "name": "Glassfish"
      },
      "gleamblossom": {
        "name": "Gleamblossom"
      },
      "glow_dust": {
        "name": "Glow Dust"
      },
      "glowing_mushroom": {
        "name": "Glowing Mushroom"
      },
      "gnarl_bark": {
        "name": "Gnarl Bark"
      },
      "gold_kanet": {
        "name": "Gold Kanet"
      },
      "goldfish": {
        "name": "Goldfish"
      },
      "grass_pod": {
        "name": "Grass Pod"
      },
      "green_butterfly_wing": {
        "name": "Green Butterfly Wing"
      },
      "hacklelo_leaf": {
        "name": "Hackle-Lo Leaf"
      },
      "hagraven_claw": {
        "name": "Hagraven Claw"
      },
      "hagraven_feathers": {
        "name": "Hagraven Feathers"
      },
      "hanging_moss": {
        "name": "Hanging Moss"
      },
      "harrada": {
        "name": "Harrada"
      },
      "hawk_beak": {
        "name": "Hawk Beak"
      },
      "hawk_feathers": {
        "name": "Hawk Feathers"
      },
      "hawks_egg": {
        "name": "Hawk's Egg"
      },
      "heart_of_order": {
        "name": "Heart of Order"
      },
      "histcarp": {
        "name": "Histcarp"
      },
      "honeycomb": {
        "name": "Honeycomb"
      },
      "human_flesh": {
        "name": "Human Flesh"
      },
      "human_heart": {
        "name": "Human Heart"
      },
      "hunger_tongue": {
        "name": "Hunger Tongue"
      },
      "hydnum_azure_giant_spore": {
        "name": "Hydnum Azure Giant Spore"
      },
      "hypha_facia": {
        "name": "Hypha Facia"
      },
      "ice_wraith_teeth": {
        "name": "Ice Wraith Teeth"
      },
      "imp_gall": {
        "name": "Imp Gall"
      },
      "imp_stool": {
        "name": "Imp Stool"
      },
      "jarrin_root": {
        "name": "Jarrin Root"
      },
      "jazbay_grapes": {
        "name": "Jazbay Grapes"
      },
      "juniper_berries": {
        "name": "Juniper Berries"
      },
      "juvenile_mudcrab": {
        "name": "Juvenile Mudcrab"
      },
      "kagouti_hide": {
        "name": "Kagouti Hide"
      },
      "kresh_fiber": {
        "name": "Kresh Fiber"
      },
      "large_antlers": {
        "name": "Large Antlers"
      },
      "lavender": {
        "name": "Lavender"
      },
      "lichor": {
        "name": "Lichor"
      },
      "luminous_russula": {
        "name": "Luminous Russula"
      },
      "luna_moth_wing": {
        "name": "Luna Moth Wing"
      },
      "lyretail_anthias": {
        "name": "Lyretail Anthias"
      },
      "marshmerrow": {
        "name": "Marshmerrow"
      },
      "minotaur_horn": {
        "name": "Minotaur Horn"
      },
      "moon_sugar": {
        "name": "Moon Sugar"
      },
      "mora_tapinella": {
        "name": "Mora Tapinella"
      },
      "mort_flesh": {
        "name": "Mort Flesh"
      },
      "mudcrab_chitin": {
        "name": "Mudcrab Chitin"
      },
      "namiras_rot": {
        "name": "Namira's Rot"
      },
      "netch_jelly": {
        "name": "Netch Jelly"
      },
      "nightshade": {
        "name": "Nightshade"
      },
      "nirnroot": {
        "name": "Nirnroot"
      },
      "nordic_barnacle": {
        "name": "Nordic Barnacle"
      },
      "ogres_teeth": {
        "name": "Ogre's Teeth"
      },
      "orange_dartwing": {
        "name": "Orange Dartwing"
      },
      "pearl": {
        "name": "Pearl"
      },
      "pearlfish": {
        "name": "Pearlfish"
      },
      "pine_thrush_egg": {
        "name": "Pine Thrush Egg"
      },
      "poison_bloom": {
        "name": "Poison Bloom"
      },
      "powdered_mammoth_tusk": {
        "name": "Powdered Mammoth Tusk"
      },
      "purple_butterfly_wing": {
        "name": "Purple Butterfly Wing"
      },
      "purple_mountain_flower": {
        "name": "Purple Mountain Flower"
      },
      "pygmy_sunfish": {
        "name": "Pygmy Sunfish"
      },
      "red_kelp_gas_bladder": {
        "name": "Red Kelp Gas Bladder"
      },
      "red_mountain_flower": {
        "name": "Red Mountain Flower"
      },
      "redwort_flower": {
        "name": "Redwort Flower"
      },
      "river_betty": {
        "name": "River Betty"
      },
      "rock_warbler_egg": {
        "name": "Rock Warbler Egg"
      },
      "roobrush": {
        "name": "Roobrush"
      },
      "rot_scale": {
        "name": "Rot Scale"
      },
      "sabre_cat_tooth": {
        "name": "Sabre Cat Tooth"
      },
      "salmon_roe": {
        "name": "Salmon Roe"
      },
      "salt_pile": {
        "name": "Salt Pile"
      },
      "saltrice": {
        "name": "Saltrice"
      },
      "scalon_fin": {
        "name": "Scalon Fin"
      },
      "scaly_pholiota": {
        "name": "Scaly Pholiota"
      },
      "scathecraw": {
        "name": "Scathecraw"
      },
      "screaming_maw": {
        "name": "Screaming Maw"
      },
      "scrib_jelly": {
        "name": "Scrib Jelly"
      },
      "scrib_jerky": {
        "name": "Scrib Jerky"
      },
      "silverside_perch": {
        "name": "Silverside Perch"
      },
      "skeever_tail": {
        "name": "Skeever Tail"
      },
      "slaughterfish_egg": {
        "name": "Slaughterfish Egg"
      },
      "slaughterfish_scales": {
        "name": "Slaughterfish Scales"
      },
      "sload_soap": {
        "name": "Sload Soap"
      },
      "small_antlers": {
        "name": "Small Antlers"
      },
      "small_pearl": {
        "name": "Small Pearl"
      },
      "snowberries": {
        "name": "Snowberries"
      },
      "spadefish": {
        "name": "Spadefish"
      },
      "spawn_ash": {
        "name": "Spawn Ash"
      },
      "spiddal_stick": {
        "name": "Spiddal Stick"
      },
      "spider_egg": {
        "name": "Spider Egg"
      },
      "spriggan_sap": {
        "name": "Spriggan Sap"
      },
      "steelblue_entoloma": {
        "name": "Steel-Blue Entoloma"
      },
      "stoneflower_petals": {
        "name": "Stoneflower Petals"
      },
      "swamp_fungal_pod": {
        "name": "Swamp Fungal Pod"
      },
      "taproot": {
        "name": "Taproot"
      },
      "thistle_branch": {
        "name": "Thistle Branch"
      },
      "thorn_hook": {
        "name": "Thorn Hook"
      },
      "torchbug_thorax": {
        "name": "Torchbug Thorax"
      },
      "trama_root": {
        "name": "Trama Root"
      },
      "troll_fat": {
        "name": "Troll Fat"
      },
      "tundra_cotton": {
        "name": "Tundra Cotton"
      },
      "vampire_dust": {
        "name": "Vampire Dust"
      },
      "void_essence": {
        "name": "Void Essence"
      },
      "void_salts": {
        "name": "Void Salts"
      },
      "watchers_eye": {
        "name": "Watcher's Eye"
      },
      "wheat": {
        "name": "Wheat"
      },
      "white_cap": {
        "name": "White Cap"
      },
      "wisp_stalk_caps": {
        "name": "Wisp Stalk Caps"
      },
      "wisp_wrappings": {
        "name": "Wisp Wrappings"
      },
      "withering_moon": {
        "name": "Withering Moon"
      },
      "worms_head_cap": {
        "name": "Worm's Head Cap"
      },
      "yellow_mountain_flower": {
        "name": "Yellow Mountain Flower"
      }
    },
    "ru": {
      "abecean_longfin": {
        "name": "Абесинский окунь"
      },
      "alocasia_fruit": {
        "name": "Плод алоказии"
      },
      "ambrosia": {
        "name": "Амброзия"
      },
      "ancestor_moth_wing": {
        "name": "Крыло мотылька предка"
      },
      "angelfish": {
        "name": "Рыба-ангел"
      },
      "angler_larvae": {
        "name": "Малёк удильщика"
      },
      "ash_creep_cluster": {
        "name": "Пепельная ползучая лоза"
      },
      "ash_hopper_jelly": {
        "name": "Желе пепельного прыгуна"
      },
      "ashen_grass_pod": {
        "name": "Стручок пепельной травы"
      },
      "aster_bloom_core": {
        "name": "Цветок астры"
      },
      "bear_claws": {
        "name": "Медвежьи когти"
      },
      "bee": {
        "name": "Пчела"
      },
      "beehive_husk": {
        "name": "Пчелиное гнездо"
      },
      "berits_ashes": {
        "name": "Прах Берита"
      },
      "bittergreen_petals": {
        "name": "Горько-зеленые лепестки"
      },
      "bleeding_crown": {
        "name": "Кровавый венец"
      },
      "blind_watchers_eye": {
        "name": "Глаз слепого наблюдателя"
      },
      "bliss_bug_thorax": {
        "name": "Торакс жука из блисса"
      },
      "blister_pod_cap": {
        "name": "Шляпка волдырника"
      },
      "blisterwort": {
        "name": "Лютый гриб"
      },
      "bloodgrass": {
        "name": "Кровавая трава"
      },
      "blue_butterfly_wing": {
        "name": "Крыло синей бабочки"
      },
      "blue_dartwing": {
        "name": "Синяя стрекоза"
      },
      "blue_mountain_flower": {
        "name": "Голубой горноцвет"
      },
      "boar_tusk": {
        "name": "Кабаний клык"
      },
      "bog_beacon": {
        "name": "Болотная митрула"
      },
      "bone_meal": {
        "name": "Костная мука"
      },
      "briar_heart": {
        "name": "Вересковое сердце"
      },
      "bunglers_bane": {
        "name": "Банглер бейн"
      },
      "burnt_spriggan_wood": {
        "name": "Древесина горелого сприггана"
      },
      "butterfly_wing": {
        "name": "Крыло монарха"
      },
      "canis_root": {
        "name": "Собачий корень"
      },
      "charred_skeever_hide": {
        "name": "Жареная злокрысья кожа"
      },
      "chaurus_eggs": {
        "name": "Яйцо коруса"
      },
      "chaurus_hunter_antennae": {
        "name": "Усик коруса-охотника"
      },
      "chickens_egg": {
        "name": "Куриное яйцо"
      },
      "chokeberry": {
        "name": "Арония"
      },
      "chokeweed": {
        "name": "Удушайка"
      },
      "coda_flower": {
        "name": "Цветок коды"
      },
      "comberry": {
        "name": "Комуника"
      },
      "congealed_putrescence": {
        "name": "Затвердевшая гниль"
      },
      "corkbulb_root": {
        "name": "Корень пробочника"
      },
      "creep_cluster": {
        "name": "Ползучая лоза"
      },
      "crimson_nirnroot": {
        "name": "Алый корень Нирна"
      },
      "cyrodilic_spadetail": {
        "name": "Сиродильский лопатохвост"
      },
      "daedra_heart": {
        "name": "Сердце даэдра"
      },
      "daedra_silk": {
        "name": "Шёлк даэдра"
      },
      "daedra_venin": {
        "name": "Яд даэдра"
      },
      "daedroth_teeth": {
        "name": "Зуб даэдрота"
      },
      "deathbell": {
        "name": "Ядовитый колокольчик"
      },
      "dragons_tongue": {
        "name": "Язык дракона"
      },
      "dreugh_wax": {
        "name": "Дреугский воск"
      },
      "dwarven_oil": {
        "name": "Двемерское масло"
      },
      "ectoplasm": {
        "name": "Эктоплазма"
      },
      "elves_ear": {
        "name": "Эльфийское ухо"
      },
      "elytra_ichor": {
        "name": "Ихор элитры"
      },
      "emperor_parasol_moss": {
        "name": "Императорский зонтичный мох"
      },
      "eye_of_sabre_cat": {
        "name": "Глаз саблезуба"
      },
      "falmer_ear": {
        "name": "Ухо фалмера"
      },
      "felsaad_tern_feathers": {
        "name": "Перья фельсадской крачки"
      },
      "fire_petal": {
        "name": "Огненный лепесток"
      },
      "fire_salts": {
        "name": "Огненная соль"
      },
      "flame_stalk": {
        "name": "Огненный гриб"
      },
      "fly_amanita": {
        "name": "Мухомор"
      },
      "frost_mirriam": {
        "name": "Морозная мириам"
      },
      "frost_salts": {
        "name": "Морозная соль"
      },
      "fungus_stalk": {
        "name": "Грибная трава"
      },
      "garlic": {
        "name": "Чеснок"
      },
      "giant_lichen": {
        "name": "Гигантский лишайник"
      },
      "giants_toe": {
        "name": "Палец великана"
      },
      "glassfish": {
        "name": "Стеклянный окунь"
      },
      "gleamblossom": {
        "name": "Светящийся цветок"
      },
      "glow_dust": {
        "name": "Светящаяся пыль"
      },
      "glowing_mushroom": {
        "name": "Светящийся гриб"
      },
      "gnarl_bark": {
        "name": "Gnarl Bark"
      },
      "gold_kanet": {
        "name": "Кора гнарла"
      },
      "goldfish": {
        "name": "Золотая рыбка"
      },
      "grass_pod": {
        "name": "Травяной стручок"
      },
      "green_butterfly_wing": {
        "name": "Крыло зелёной бабочки"
      },
      "hacklelo_leaf": {
        "name": "Лист хакльлоу"
      },
      "hagraven_claw": {
        "name": "Коготь ворожеи"
      },
      "hagraven_feathers": {
        "name": "Перья ворожеи"
      },
      "hanging_moss": {
        "name": "Бородатый мох"
      },
      "harrada": {
        "name": "Харрада"
      },
      "hawk_beak": {
        "name": "Клюв ястреба"
      },
      "hawk_feathers": {
        "name": "Перья ястреба"
      },
      "hawks_egg": {
        "name": "Яйцо ястреба"
      },
      "heart_of_order": {
        "name": "Сердце Порядка"
      },
      "histcarp": {
        "name": "Хисткарп"
      },
      "honeycomb": {
        "name": "Медовые соты"
      },
      "human_flesh": {
        "name": "Человечье мясо"
      },
      "human_heart": {
        "name": "Человеческое сердце"
      },
      "hunger_tongue": {
        "name": "Язык алчущего"
      },
      "hydnum_azure_giant_spore": {
        "name": "Гигантская спора ежовика лазурного"
      },
      "hypha_facia": {
        "name": "Гайфа фация"
      },
      "ice_wraith_teeth": {
        "name": "Зубы ледяного привидения"
      },
      "imp_gall": {
        "name": "Желчь беса"
      },
      "imp_stool": {
        "name": "Бесовский гриб"
      },
      "jarrin_root": {
        "name": "Корень жарницы"
      },
      "jazbay_grapes": {
        "name": "Виноград джазби"
      },
      "juniper_berries": {
        "name": "Ягоды можжевельника"
      },
      "juvenile_mudcrab": {
        "name": "Молодой грязевой краб"
      },
      "kagouti_hide": {
        "name": "Шкура кагути"
      },
      "kresh_fiber": {
        "name": "Волокно креша"
      },
      "large_antlers": {
        "name": "Большие рога"
      },
      "lavender": {
        "name": "Лаванда"
      },
      "lichor": {
        "name": "Лихор"
      },
      "luminous_russula": {
        "name": "Светящаяся сыроежка"
      },
      "luna_moth_wing": {
        "name": "Крыло лунного мотылька"
      },
      "lyretail_anthias": {
        "name": "Лирохвостый окунь"
      },
      "marshmerrow": {
        "name": "Болотный тростник"
      },
      "minotaur_horn": {
        "name": "Рог минотавра"
      },
      "moon_sugar": {
        "name": "Лунный сахар"
      },
      "mora_tapinella": {
        "name": "Мора тапинелла"
      },
      "mort_flesh": {
        "name": "Смертная плоть"
      },
      "mudcrab_chitin": {
        "name": "Клешня грязевого краба"
      },
      "namiras_rot": {
        "name": "Гниль Намиры"
      },
      "netch_jelly": {
        "name": "Желе нетча"
      },
      "nightshade": {
        "name": "Паслён"
      },
      "nirnroot": {
        "name": "Корень Нирна"
      },
      "nordic_barnacle": {
        "name": "Морской жёлудь"
      },
      "ogres_teeth": {
        "name": "Зубы огра"
      },
      "orange_dartwing": {
        "name": "Оранжевая стрекоза"
      },
      "pearl": {
        "name": "Жемчужина"
      },
      "pearlfish": {
        "name": "Карапус"
      },
      "pine_thrush_egg": {
        "name": "Яйцо соснового дрозда"
      },
      "poison_bloom": {
        "name": "Ядовитый цветок"
      },
      "powdered_mammoth_tusk": {
        "name": "Толчёный бивень мамонта"
      },
      "purple_butterfly_wing": {
        "name": "Крыло фиолетовой бабочки"
      },
      "purple_mountain_flower": {
        "name": "Лиловый горноцвет"
      },
      "pygmy_sunfish": {
        "name": "Карликовый солнечник"
      },
      "red_kelp_gas_bladder": {
        "name": "Газовый пузырь красной водоросли"
      },
      "red_mountain_flower": {
        "name": "Красный горноцвет"
      },
      "redwort_flower": {
        "name": "Цветок редворта"
      },
      "river_betty": {
        "name": "Бойцовая рыбка"
      },
      "rock_warbler_egg": {
        "name": "Яйцо оригмы"
      },
      "roobrush": {
        "name": "Рубраш"
      },
      "rot_scale": {
        "name": "Гнилая чешуйка"
      },
      "sabre_cat_tooth": {
        "name": "Клык саблезуба"
      },
      "salmon_roe": {
        "name": "Лососёвая икра"
      },
      "salt_pile": {
        "name": "Соль"
      },
      "saltrice": {
        "name": "Солёный рис"
      },
      "scalon_fin": {
        "name": "Плавник скейлона"
      },
      "scaly_pholiota": {
        "name": "Чешуйчатка"
      },
      "scathecraw": {
        "name": "Вредозобник"
      },
      "screaming_maw": {
        "name": "Кричалка"
      },
      "scrib_jelly": {
        "name": "Скрибовое желе"
      },
      "scrib_jerky": {
        "name": "Вяленая скрибятина"
      },
      "silverside_perch": {
        "name": "Серебристый окунь"
      },
      "skeever_tail": {
        "name": "Хвост злокрыса"
      },
      "slaughterfish_egg": {
        "name": "Икра рыбы-убийцы"
      },
      "slaughterfish_scales": {
        "name": "Чешуя рыбы-убийцы"
      },
      "sload_soap": {
        "name": "Мыло слоад"
      },
      "small_antlers": {
        "name": "Маленькие рога"
      },
      "small_pearl": {
        "name": "Маленькая жемчужина"
      },
      "snowberries": {
        "name": "Снежные ягоды"
      },
      "spadefish": {
        "name": "Рыба-лопата"
      },
      "spawn_ash": {
        "name": "Пепел порождения"
      },
      "spiddal_stick": {
        "name": "Спиддал"
      },
      "spider_egg": {
        "name": "Паучье яйцо"
      },
      "spriggan_sap": {
        "name": "Живица сприггана"
      },
      "steelblue_entoloma": {
        "name": "Ярко-синяя энтолома"
      },
      "stoneflower_petals": {
        "name": "Лепестки каменевки"
      },
      "swamp_fungal_pod": {
        "name": "Болотный стручок"
      },
      "taproot": {
        "name": "Стержневой корень"
      },
      "thistle_branch": {
        "name": "Ветка чертополоха"
      },
      "thorn_hook": {
        "name": "Шип"
      },
      "torchbug_thorax": {
        "name": "Торакс светлячка"
      },
      "trama_root": {
        "name": "Корень трамы"
      },
      "troll_fat": {
        "name": "Жир тролля"
      },
      "tundra_cotton": {
        "name": "Пушица"
      },
      "vampire_dust": {
        "name": "Прах вампира"
      },
      "void_essence": {
        "name": "Эссенция пустоты"
      },
      "void_salts": {
        "name": "Соль пустоты"
      },
      "watchers_eye": {
        "name": "Глаз наблюдателя"
      },
      "wheat": {
        "name": "Пшеница"
      },
      "white_cap": {
        "name": "Белянка"
      },
      "wisp_stalk_caps": {
        "name": "Шляпки гифоломы"
      },
      "wisp_wrappings": {
        "name": "Пелена дымка"
      },
      "withering_moon": {
        "name": "Усыхающая луна"
      },
      "worms_head_cap": {
        "name": "Шляпка головы червя"
      },
      "yellow_mountain_flower": {
        "name": "Жёлтый горноцвет"
      }
    }
  }
};
class EventsDispatcher {
  constructor() {
    __publicField(this, "handlers", {});
  }
  subscribe(event, fn) {
    if (!this.handlers[event])
      this.handlers[event] = [];
    this.handlers[event].push(fn);
  }
  dispatch(event, ...args) {
    if (this.handlers[event])
      for (let handler of Object.values(this.handlers[event]))
        handler(...args);
  }
}
const dispatcher = new EventsDispatcher();
const ingredients_list = {
  "abecean_longfin": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_frost": true,
      "fortify_sneak": true,
      "weakness_to_poison": true,
      "fortify_restoration": true
    }
  },
  "alocasia_fruit": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "regenerate_stamina": {
        "magnitude": 1.2
      },
      "light": true,
      "ravage_magicka": {
        "magnitude": 1.5
      },
      "regenerate_health": {
        "magnitude": 1.2
      }
    }
  },
  "ambrosia": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_health": {
        "magnitude": 1.2
      },
      "regenerate_health": {
        "magnitude": 1.2
      },
      "fortify_health": {
        "magnitude": 1.25
      },
      "cure_poison": {
        "value": 1.56
      }
    }
  },
  "ancestor_moth_wing": {
    "enabled": true,
    "active": true,
    "dlc": "Dawnguard",
    "effects": {
      "damage_stamina": true,
      "fortify_conjuration": true,
      "damage_magicka_regen": true,
      "fortify_enchanting": true
    }
  },
  "angelfish": {
    "enabled": false,
    "active": false,
    "dlc": "Fishing Creation",
    "effects": {
      "regenerate_health": true,
      "resist_fire": true,
      "fortify_marksman": true,
      "waterbreathing": true
    }
  },
  "angler_larvae": {
    "enabled": false,
    "active": false,
    "dlc": "Fishing Creation",
    "effects": {
      "lingering_damage_health": true,
      "regenerate_stamina": true,
      "waterbreathing": true,
      "fortify_twohanded": true
    }
  },
  "ash_creep_cluster": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "damage_stamina": true,
      "invisibility": true,
      "resist_fire": true,
      "fortify_destruction": true
    }
  },
  "ash_hopper_jelly": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "restore_health": true,
      "fortify_light_armor": true,
      "resist_shock": true,
      "weakness_to_frost": true
    }
  },
  "ashen_grass_pod": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "resist_fire": true,
      "weakness_to_shock": true,
      "fortify_lockpicking": true,
      "fortify_sneak": true
    }
  },
  "aster_bloom_core": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "resist_magic": {
        "magnitude": 2
      },
      "fortify_light_armor": {
        "magnitude": 2
      },
      "fortify_block": {
        "magnitude": 1.25
      },
      "paralysis": {
        "duration": 2
      }
    }
  },
  "bear_claws": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": {
        "magnitude": 0.8
      },
      "fortify_health": true,
      "fortify_onehanded": true,
      "damage_magicka_regen": true
    }
  },
  "bee": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "ravage_stamina": true,
      "regenerate_stamina": true,
      "weakness_to_shock": true
    }
  },
  "beehive_husk": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_poison": {
        "magnitude": 0.5
      },
      "fortify_light_armor": true,
      "fortify_sneak": true,
      "fortify_destruction": true
    }
  },
  "berits_ashes": {
    "enabled": false,
    "active": false,
    "dlc": "[quest]",
    "effects": {
      "damage_stamina": true,
      "resist_fire": true,
      "fortify_conjuration": true,
      "ravage_stamina": true
    }
  },
  "bittergreen_petals": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "lingering_damage_stamina": {
        "magnitude": 2
      },
      "invisibility": {
        "duration": 1.5
      },
      "cure_poison": true,
      "damage_magicka": {
        "magnitude": 1.5
      }
    }
  },
  "bleeding_crown": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_fire": true,
      "fortify_block": true,
      "weakness_to_poison": true,
      "resist_magic": true
    }
  },
  "blind_watchers_eye": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "light": true,
      "fortify_magicka": {
        "magnitude": 1.25
      },
      "fortify_alteration": {
        "magnitude": 1.25
      },
      "spell_absorption": true
    }
  },
  "bliss_bug_thorax": {
    "enabled": false,
    "active": false,
    "dlc": "Saints & Seducers Creation",
    "effects": {
      "weakness_to_fire": true,
      "resist_fire": true,
      "fortify_heavy_armor": true,
      "fortify_illusion": {
        "magnitude": 0.25
      }
    }
  },
  "blister_pod_cap": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_magicka": {
        "magnitude": 1.2
      },
      "fortify_magicka": {
        "magnitude": 1.25
      },
      "night_eye": true,
      "invisibility": {
        "duration": 1.5
      }
    }
  },
  "blisterwort": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_stamina": true,
      "frenzy": true,
      "restore_health": {
        "magnitude": 0.6
      },
      "fortify_smithing": true
    }
  },
  "bloodgrass": {
    "enabled": false,
    "active": false,
    "dlc": "The Cause Creation",
    "effects": {
      "invisibility": true,
      "resist_poison": true,
      "slow": true,
      "fortify_health": {
        "magnitude": 1.25
      }
    }
  },
  "blue_butterfly_wing": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_stamina": true,
      "fortify_conjuration": true,
      "damage_magicka_regen": true,
      "fortify_enchanting": true
    }
  },
  "blue_dartwing": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_shock": true,
      "fortify_pickpocket": true,
      "restore_health": true,
      "fear": true
    }
  },
  "blue_mountain_flower": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_health": true,
      "fortify_conjuration": true,
      "fortify_health": true,
      "damage_magicka_regen": true
    }
  },
  "boar_tusk": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "fortify_stamina": {
        "magnitude": 1.25,
        "duration": 5
      },
      "fortify_health": {
        "duration": 5
      },
      "fortify_block": true,
      "frenzy": true
    }
  },
  "bog_beacon": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_magicka": {
        "magnitude": 1.2
      },
      "fortify_heavy_armor": {
        "magnitude": 1.5
      },
      "fear": {
        "magnitude": 2
      },
      "damage_stamina": {
        "magnitude": 1.33
      }
    }
  },
  "bone_meal": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_stamina": true,
      "resist_fire": true,
      "fortify_conjuration": true,
      "ravage_stamina": true
    }
  },
  "briar_heart": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_magicka": true,
      "fortify_block": {
        "magnitude": 0.5
      },
      "paralysis": true,
      "fortify_magicka": true
    }
  },
  "bunglers_bane": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "slow": {
        "duration": 2
      },
      "ravage_stamina": {
        "magnitude": 1.5
      },
      "damage_stamina_regen": {
        "duration": 2
      },
      "resist_magic": {
        "magnitude": 2
      }
    }
  },
  "burnt_spriggan_wood": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "weakness_to_fire": true,
      "fortify_alteration": true,
      "damage_magicka_regen": true,
      "slow": true
    }
  },
  "butterfly_wing": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_health": true,
      "fortify_barter": true,
      "lingering_damage_stamina": true,
      "damage_magicka": true
    }
  },
  "canis_root": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_stamina": true,
      "fortify_onehanded": true,
      "fortify_marksman": true,
      "paralysis": true
    }
  },
  "charred_skeever_hide": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "cure_disease": {
        "value": 0.36
      },
      "resist_poison": true,
      "restore_health": true
    }
  },
  "chaurus_eggs": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_poison": true,
      "fortify_stamina": true,
      "damage_magicka": true,
      "invisibility": true
    }
  },
  "chaurus_hunter_antennae": {
    "enabled": true,
    "active": true,
    "dlc": "Dawnguard",
    "effects": {
      "damage_stamina": true,
      "fortify_conjuration": true,
      "damage_magicka_regen": true,
      "fortify_enchanting": true
    }
  },
  "chickens_egg": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_magic": true,
      "damage_magicka_regen": true,
      "waterbreathing": true,
      "lingering_damage_stamina": true
    }
  },
  "chokeberry": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "damage_health": {
        "magnitude": 1.5
      },
      "ravage_health": {
        "magnitude": 1.5
      },
      "lingering_damage_health": {
        "magnitude": 2
      },
      "weakness_to_poison": {
        "magnitude": 1.5
      }
    }
  },
  "chokeweed": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "weakness_to_frost": {
        "magnitude": 1.33
      },
      "restore_stamina": {
        "magnitude": 1.2
      },
      "cure_disease": {
        "value": 0.36
      },
      "damage_magicka": {
        "magnitude": 1.33
      }
    }
  },
  "coda_flower": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "damage_health": {
        "magnitude": 1.5
      },
      "lingering_damage_stamina": {
        "magnitude": 2
      },
      "ravage_magicka": {
        "magnitude": 1.5
      },
      "fortify_carry_weight": {
        "magnitude": 1.25
      }
    }
  },
  "comberry": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "damage_stamina": {
        "magnitude": 1.33
      },
      "spell_absorption": true,
      "restore_magicka": {
        "magnitude": 1.2
      },
      "fortify_destruction": {
        "magnitude": 1.2
      }
    }
  },
  "congealed_putrescence": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "ravage_health": {
        "magnitude": 1.5
      },
      "restore_magicka": {
        "magnitude": 1.2
      },
      "weakness_to_fire": {
        "magnitude": 1.33
      },
      "fortify_conjuration": {
        "magnitude": 1.2
      }
    }
  },
  "corkbulb_root": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "paralysis": {
        "duration": 2
      },
      "restore_health": {
        "magnitude": 1.2
      },
      "resist_shock": {
        "magnitude": 1.33
      },
      "fortify_marksman": {
        "magnitude": 1.25
      }
    }
  },
  "creep_cluster": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_magicka": true,
      "damage_stamina_regen": true,
      "fortify_carry_weight": true,
      "weakness_to_magic": true
    }
  },
  "crimson_nirnroot": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_health": {
        "magnitude": 3
      },
      "damage_stamina": {
        "magnitude": 3
      },
      "invisibility": true,
      "resist_magic": true
    }
  },
  "cyrodilic_spadetail": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_stamina": true,
      "fortify_restoration": true,
      "fear": true,
      "ravage_health": true
    }
  },
  "daedra_heart": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_health": true,
      "damage_stamina_regen": true,
      "damage_magicka": true,
      "fear": true
    }
  },
  "daedra_silk": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "lingering_damage_stamina": {
        "magnitude": 2
      },
      "paralysis": {
        "duration": 2
      },
      "night_eye": true,
      "invisibility": {
        "duration": 1.5
      }
    }
  },
  "daedra_venin": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "ravage_health": {
        "magnitude": 1.5
      },
      "paralysis": {
        "duration": 2
      },
      "fortify_destruction": {
        "magnitude": 1.2
      },
      "spell_absorption": true
    }
  },
  "daedroth_teeth": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "resist_frost": {
        "magnitude": 1.33
      },
      "light": true,
      "damage_magicka_regen": {
        "duration": 2
      },
      "regenerate_stamina": {
        "magnitude": 1.2
      }
    }
  },
  "deathbell": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_health": {
        "magnitude": 1.5
      },
      "ravage_stamina": true,
      "slow": true,
      "weakness_to_poison": true
    }
  },
  "dragons_tongue": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_fire": true,
      "fortify_barter": true,
      "fortify_illusion": true,
      "fortify_twohanded": true
    }
  },
  "dreugh_wax": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "weakness_to_magic": {
        "magnitude": 1.5
      },
      "frenzy": {
        "duration": 2
      },
      "fortify_enchanting": {
        "magnitude": 2
      },
      "fortify_smithing": {
        "magnitude": 1.25
      }
    }
  },
  "dwarven_oil": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_magic": true,
      "fortify_illusion": true,
      "regenerate_magicka": true,
      "restore_magicka": true
    }
  },
  "ectoplasm": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_magicka": true,
      "fortify_destruction": {
        "magnitude": 0.8
      },
      "fortify_magicka": true,
      "damage_health": true
    }
  },
  "elves_ear": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_magicka": true,
      "fortify_marksman": true,
      "weakness_to_frost": true,
      "resist_fire": true
    }
  },
  "elytra_ichor": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_magicka": {
        "magnitude": 1.2
      },
      "invisibility": {
        "duration": 1.5
      },
      "slow": {
        "duration": 2
      },
      "fear": {
        "magnitude": 2
      }
    }
  },
  "emperor_parasol_moss": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "damage_health": {
        "magnitude": 1.5,
        "duration": 10
      },
      "fortify_magicka": true,
      "regenerate_health": true,
      "fortify_twohanded": true
    }
  },
  "eye_of_sabre_cat": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "ravage_health": true,
      "damage_magicka": true,
      "restore_health": true
    }
  },
  "falmer_ear": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_health": true,
      "frenzy": true,
      "resist_poison": true,
      "fortify_lockpicking": true
    }
  },
  "felsaad_tern_feathers": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "restore_health": true,
      "fortify_light_armor": true,
      "cure_disease": true,
      "resist_magic": true
    }
  },
  "fire_petal": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "damage_health": {
        "magnitude": 1.5
      },
      "resist_fire": {
        "magnitude": 1.33
      },
      "spell_absorption": true,
      "paralysis": {
        "duration": 2
      }
    }
  },
  "fire_salts": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_frost": true,
      "resist_fire": true,
      "restore_magicka": true,
      "regenerate_magicka": true
    }
  },
  "flame_stalk": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_health": {
        "magnitude": 1.2
      },
      "resist_frost": {
        "magnitude": 1.33
      },
      "weakness_to_fire": {
        "magnitude": 1.33
      },
      "invisibility": {
        "duration": 1.5
      }
    }
  },
  "fly_amanita": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_fire": true,
      "fortify_twohanded": true,
      "frenzy": true,
      "regenerate_stamina": true
    }
  },
  "frost_mirriam": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_frost": true,
      "fortify_sneak": true,
      "ravage_magicka": true,
      "damage_stamina_regen": true
    }
  },
  "frost_salts": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_fire": true,
      "resist_frost": true,
      "restore_magicka": true,
      "fortify_conjuration": true
    }
  },
  "fungus_stalk": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_magicka": {
        "magnitude": 1.2
      },
      "fortify_health": {
        "magnitude": 1.25,
        "duration": 5
      },
      "fortify_stamina": {
        "magnitude": 1.25,
        "duration": 5
      },
      "waterbreathing": {
        "duration": 1.6
      }
    }
  },
  "garlic": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_poison": true,
      "fortify_stamina": true,
      "regenerate_magicka": true,
      "regenerate_health": true
    }
  },
  "giant_lichen": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_shock": true,
      "ravage_health": true,
      "weakness_to_poison": true,
      "restore_magicka": true
    }
  },
  "giants_toe": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_stamina": true,
      "fortify_health": {
        "duration": 5
      },
      "fortify_carry_weight": true,
      "damage_stamina_regen": true
    }
  },
  "glassfish": {
    "enabled": false,
    "active": false,
    "dlc": "Fishing Creation",
    "effects": {
      "restore_magicka": true,
      "invisibility": true,
      "fortify_illusion": {
        "magnitude": 0.25
      },
      "fortify_persuasion": true
    }
  },
  "gleamblossom": {
    "enabled": true,
    "active": true,
    "dlc": "Dawnguard",
    "effects": {
      "resist_magic": true,
      "fear": true,
      "regenerate_health": true,
      "paralysis": true
    }
  },
  "glow_dust": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_magicka": true,
      "damage_magicka_regen": true,
      "fortify_destruction": true,
      "resist_shock": true
    }
  },
  "glowing_mushroom": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_shock": true,
      "fortify_destruction": true,
      "fortify_smithing": true,
      "fortify_health": true
    }
  },
  "gnarl_bark": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "damage_health": {
        "magnitude": 1.5
      },
      "regenerate_health": {
        "magnitude": 1.2
      },
      "fortify_heavy_armor": {
        "magnitude": 1.5
      },
      "resist_fire": {
        "magnitude": 1.33
      }
    }
  },
  "gold_kanet": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "paralysis": {
        "duration": 2
      },
      "ravage_health": {
        "magnitude": 1.5
      },
      "weakness_to_frost": {
        "magnitude": 1.33
      },
      "fortify_smithing": {
        "magnitude": 1.25
      }
    }
  },
  "goldfish": {
    "enabled": false,
    "active": false,
    "dlc": "Fishing Creation",
    "effects": {
      "restore_stamina": true,
      "fortify_heavy_armor": true,
      "waterbreathing": true,
      "resist_frost": true
    }
  },
  "grass_pod": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_poison": true,
      "ravage_magicka": true,
      "fortify_alteration": true,
      "restore_magicka": true
    }
  },
  "green_butterfly_wing": {
    "enabled": false,
    "active": false,
    "dlc": "Saints & Seducers Creation",
    "effects": {
      "restore_magicka": true,
      "fear": true,
      "slow": {
        "duration": 6
      },
      "invisibility": true
    }
  },
  "hacklelo_leaf": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_stamina": {
        "magnitude": 1.2
      },
      "paralysis": {
        "duration": 2
      },
      "waterbreathing": {
        "duration": 1.6
      },
      "fortify_restoration": {
        "magnitude": 1.25
      }
    }
  },
  "hagraven_claw": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_magic": true,
      "lingering_damage_magicka": true,
      "fortify_enchanting": true,
      "fortify_barter": true
    }
  },
  "hagraven_feathers": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_magicka": true,
      "fortify_conjuration": true,
      "frenzy": true,
      "weakness_to_shock": true
    }
  },
  "hanging_moss": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_magicka": true,
      "fortify_health": true,
      "damage_magicka_regen": true,
      "fortify_onehanded": true
    }
  },
  "harrada": {
    "enabled": false,
    "active": false,
    "dlc": "The Cause Creation",
    "effects": {
      "damage_health": {
        "magnitude": 2
      },
      "damage_magicka": {
        "magnitude": 1.33
      },
      "paralysis": true,
      "damage_magicka_regen": true
    }
  },
  "hawk_beak": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "resist_frost": true,
      "fortify_carry_weight": true,
      "resist_shock": true
    }
  },
  "hawk_feathers": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "cure_disease": {
        "value": 0.36
      },
      "fortify_light_armor": true,
      "fortify_onehanded": true,
      "fortify_sneak": true
    }
  },
  "hawks_egg": {
    "enabled": true,
    "active": true,
    "dlc": "Hearthfire",
    "effects": {
      "resist_magic": true,
      "damage_magicka_regen": true,
      "waterbreathing": true,
      "lingering_damage_stamina": true
    }
  },
  "heart_of_order": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_health": {
        "magnitude": 1.2
      },
      "fortify_health": {
        "magnitude": 1.25,
        "duration": 5
      },
      "fortify_onehanded": {
        "magnitude": 1.25
      },
      "fortify_twohanded": {
        "magnitude": 1.25
      }
    }
  },
  "histcarp": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "fortify_magicka": true,
      "damage_stamina_regen": true,
      "waterbreathing": true
    }
  },
  "honeycomb": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "fortify_block": {
        "magnitude": 0.5
      },
      "fortify_light_armor": true,
      "ravage_stamina": true
    }
  },
  "human_flesh": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_health": true,
      "paralysis": true,
      "restore_magicka": true,
      "fortify_sneak": true
    }
  },
  "human_heart": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_health": true,
      "damage_magicka": true,
      "damage_magicka_regen": true,
      "frenzy": true
    }
  },
  "hunger_tongue": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "weakness_to_fire": {
        "magnitude": 1.33,
        "duration": 2
      },
      "cure_disease": {
        "value": 0.36
      },
      "cure_poison": true,
      "fortify_magicka": {
        "magnitude": 1.25
      }
    }
  },
  "hydnum_azure_giant_spore": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "resist_frost": {
        "magnitude": 1.33
      },
      "fortify_health": {
        "magnitude": 1.25,
        "duration": 5
      },
      "regenerate_health": {
        "magnitude": 1.2
      },
      "light": true
    }
  },
  "hypha_facia": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "weakness_to_poison": {
        "magnitude": 1.5
      },
      "frenzy": {
        "duration": 2
      },
      "ravage_stamina": {
        "magnitude": 1.5
      },
      "resist_magic": {
        "magnitude": 2
      }
    }
  },
  "ice_wraith_teeth": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_frost": true,
      "fortify_heavy_armor": true,
      "invisibility": true,
      "weakness_to_fire": true
    }
  },
  "imp_gall": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "damage_health": {
        "magnitude": 1.5
      },
      "weakness_to_fire": {
        "magnitude": 1.33
      },
      "fortify_barter": {
        "magnitude": 2
      },
      "cure_poison": true
    }
  },
  "imp_stool": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_health": true,
      "lingering_damage_health": true,
      "paralysis": true,
      "restore_health": {
        "magnitude": 0.6
      }
    }
  },
  "jarrin_root": {
    "enabled": false,
    "active": false,
    "dlc": "[quest]",
    "effects": {
      "damage_health": {
        "magnitude": 100
      },
      "damage_magicka": true,
      "damage_stamina": true,
      "damage_magicka_regen": true
    }
  },
  "jazbay_grapes": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_magic": true,
      "fortify_magicka": true,
      "regenerate_magicka": true,
      "ravage_health": true
    }
  },
  "juniper_berries": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_fire": true,
      "fortify_marksman": true,
      "regenerate_health": true,
      "damage_stamina_regen": true
    }
  },
  "juvenile_mudcrab": {
    "enabled": false,
    "active": false,
    "dlc": "Fishing Creation",
    "effects": {
      "regenerate_stamina": true,
      "fortify_carry_weight": true,
      "cure_disease": true,
      "fortify_twohanded": true
    }
  },
  "kagouti_hide": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "lingering_damage_stamina": {
        "magnitude": 2
      },
      "night_eye": true,
      "fortify_carry_weight": {
        "magnitude": 1.25
      },
      "resist_shock": {
        "magnitude": 1.33
      }
    }
  },
  "kresh_fiber": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "weakness_to_magic": {
        "magnitude": 1.5
      },
      "slow": {
        "duration": 2
      },
      "fortify_sneak": {
        "magnitude": 1.25
      },
      "fortify_pickpocket": {
        "magnitude": 1.25
      }
    }
  },
  "large_antlers": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "fortify_stamina": true,
      "slow": true,
      "damage_stamina_regen": true
    }
  },
  "lavender": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_magic": true,
      "fortify_stamina": true,
      "ravage_magicka": true,
      "fortify_conjuration": true
    }
  },
  "lichor": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_magicka": {
        "magnitude": 1.2
      },
      "regenerate_magicka": {
        "magnitude": 1.2
      },
      "fortify_magicka": {
        "magnitude": 1.25
      },
      "spell_absorption": true
    }
  },
  "luminous_russula": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "lingering_damage_stamina": {
        "magnitude": 2
      },
      "lingering_damage_health": {
        "magnitude": 2
      },
      "waterbreathing": {
        "duration": 1.6
      },
      "fear": {
        "magnitude": 2
      }
    }
  },
  "luna_moth_wing": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_magicka": true,
      "fortify_light_armor": true,
      "regenerate_health": true,
      "invisibility": true
    }
  },
  "lyretail_anthias": {
    "enabled": false,
    "active": false,
    "dlc": "Fishing Creation",
    "effects": {
      "restore_magicka": true,
      "fortify_alteration": true,
      "fortify_conjuration": true,
      "fortify_carry_weight": true
    }
  },
  "marshmerrow": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_health": {
        "magnitude": 1.2
      },
      "fortify_carry_weight": {
        "magnitude": 1.25
      },
      "weakness_to_magic": {
        "magnitude": 1.5
      },
      "damage_stamina": {
        "magnitude": 1.33
      }
    }
  },
  "minotaur_horn": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "resist_poison": {
        "magnitude": 1.25
      },
      "damage_magicka_regen": {
        "duration": 2
      },
      "regenerate_health": {
        "magnitude": 1.2
      },
      "regenerate_magicka": {
        "magnitude": 1.2
      }
    }
  },
  "moon_sugar": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_fire": true,
      "resist_frost": true,
      "restore_magicka": true,
      "regenerate_magicka": true
    }
  },
  "mora_tapinella": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_magicka": true,
      "lingering_damage_health": true,
      "regenerate_stamina": true,
      "fortify_illusion": true
    }
  },
  "mort_flesh": {
    "enabled": false,
    "active": false,
    "dlc": "Plague of the Dead Creation",
    "effects": {
      "damage_health": true,
      "damage_magicka": true,
      "damage_magicka_regen": true,
      "frenzy": true
    }
  },
  "mudcrab_chitin": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "cure_disease": true,
      "resist_poison": true,
      "resist_fire": true
    }
  },
  "namiras_rot": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_magicka": true,
      "fortify_lockpicking": true,
      "fear": true,
      "regenerate_health": true
    }
  },
  "netch_jelly": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "paralysis": true,
      "fortify_carry_weight": true,
      "restore_stamina": {
        "magnitude": 2
      },
      "fear": true
    }
  },
  "nightshade": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_health": true,
      "damage_magicka_regen": true,
      "lingering_damage_stamina": true,
      "fortify_destruction": {
        "magnitude": 0.8
      }
    }
  },
  "nirnroot": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_health": {
        "duration": 10
      },
      "damage_stamina": true,
      "invisibility": true,
      "resist_magic": true
    }
  },
  "nordic_barnacle": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_magicka": true,
      "waterbreathing": true,
      "regenerate_health": true,
      "fortify_pickpocket": true
    }
  },
  "ogres_teeth": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "weakness_to_shock": {
        "magnitude": 1.33
      },
      "resist_poison": {
        "magnitude": 1.25
      },
      "lingering_damage_magicka": {
        "magnitude": 2
      },
      "regenerate_health": {
        "magnitude": 1.2
      }
    }
  },
  "orange_dartwing": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "ravage_magicka": true,
      "fortify_pickpocket": true,
      "lingering_damage_health": true
    }
  },
  "pearl": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "fortify_block": true,
      "restore_magicka": true,
      "resist_shock": true
    }
  },
  "pearlfish": {
    "enabled": false,
    "active": false,
    "dlc": "Fishing Creation",
    "effects": {
      "restore_stamina": true,
      "resist_frost": true,
      "fortify_smithing": true,
      "fortify_onehanded": true
    }
  },
  "pine_thrush_egg": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "fortify_lockpicking": true,
      "weakness_to_poison": true,
      "resist_shock": true
    }
  },
  "poison_bloom": {
    "enabled": true,
    "active": true,
    "dlc": "Dawnguard",
    "effects": {
      "damage_health": {
        "magnitude": 1.5
      },
      "slow": true,
      "fortify_carry_weight": true,
      "fear": true
    }
  },
  "powdered_mammoth_tusk": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "fortify_sneak": true,
      "weakness_to_fire": true,
      "fear": true
    }
  },
  "purple_butterfly_wing": {
    "enabled": false,
    "active": false,
    "dlc": "Saints & Seducers Creation",
    "effects": {
      "regenerate_health": true,
      "regenerate_magicka": true,
      "regenerate_stamina": true,
      "paralysis": true
    }
  },
  "purple_mountain_flower": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "fortify_sneak": true,
      "lingering_damage_magicka": true,
      "resist_frost": true
    }
  },
  "pygmy_sunfish": {
    "enabled": false,
    "active": false,
    "dlc": "Fishing Creation",
    "effects": {
      "restore_stamina": true,
      "lingering_damage_magicka": true,
      "damage_magicka_regen": true,
      "fortify_restoration": true
    }
  },
  "red_kelp_gas_bladder": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "regenerate_stamina": {
        "magnitude": 1.2
      },
      "waterbreathing": {
        "duration": 1.6
      },
      "cure_disease": {
        "value": 0.36
      },
      "fortify_magicka": {
        "magnitude": 1.25
      }
    }
  },
  "red_mountain_flower": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_magicka": true,
      "ravage_magicka": true,
      "fortify_magicka": true,
      "damage_health": true
    }
  },
  "redwort_flower": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "resist_frost": {
        "magnitude": 1.33
      },
      "cure_poison": true,
      "damage_health": {
        "magnitude": 1.5
      },
      "invisibility": {
        "duration": 1.5
      }
    }
  },
  "river_betty": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_health": {
        "magnitude": 2.5,
        "duration": 10
      },
      "fortify_alteration": true,
      "slow": true,
      "fortify_carry_weight": true
    }
  },
  "rock_warbler_egg": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_health": true,
      "fortify_onehanded": true,
      "damage_stamina": true,
      "weakness_to_magic": true
    }
  },
  "roobrush": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "weakness_to_magic": {
        "magnitude": 1.5
      },
      "fortify_sneak": {
        "magnitude": 1.25
      },
      "lingering_damage_health": {
        "magnitude": 2
      },
      "cure_poison": true
    }
  },
  "rot_scale": {
    "enabled": false,
    "active": false,
    "dlc": "Saints & Seducers Creation",
    "effects": {
      "slow": {
        "duration": 3
      },
      "lingering_damage_health": {
        "duration": 3
      },
      "fear": {
        "duration": 0.16
      },
      "paralysis": true
    }
  },
  "sabre_cat_tooth": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "fortify_heavy_armor": true,
      "fortify_smithing": true,
      "weakness_to_poison": true
    }
  },
  "salmon_roe": {
    "enabled": true,
    "active": true,
    "dlc": "Hearthfire",
    "effects": {
      "restore_stamina": {
        "magnitude": 0.4
      },
      "waterbreathing": {
        "duration": 12
      },
      "fortify_magicka": {
        "magnitude": 12.5,
        "duration": 0.08
      },
      "regenerate_magicka": true
    }
  },
  "salt_pile": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_magic": true,
      "fortify_restoration": true,
      "slow": true,
      "regenerate_magicka": true
    }
  },
  "saltrice": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_stamina": {
        "magnitude": 1.2
      },
      "fortify_magicka": {
        "magnitude": 1.25
      },
      "damage_stamina_regen": {
        "duration": 2
      },
      "restore_health": {
        "magnitude": 1.2
      }
    }
  },
  "scalon_fin": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "waterbreathing": {
        "duration": 1.6
      },
      "damage_health": {
        "magnitude": 1.5
      },
      "lingering_damage_magicka": {
        "magnitude": 2
      },
      "damage_magicka_regen": {
        "duration": 2
      }
    }
  },
  "scaly_pholiota": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_magic": true,
      "fortify_illusion": true,
      "regenerate_stamina": true,
      "fortify_carry_weight": true
    }
  },
  "scathecraw": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "ravage_health": true,
      "ravage_stamina": true,
      "ravage_magicka": true,
      "lingering_damage_health": true
    }
  },
  "screaming_maw": {
    "enabled": false,
    "active": false,
    "dlc": "Saints & Seducers Creation",
    "effects": {
      "regenerate_magicka": {
        "magnitude": 4,
        "duration": 0.2
      },
      "fortify_alteration": {
        "magnitude": 1.25
      },
      "invisibility": {
        "duration": 0.25
      },
      "regenerate_health": {
        "magnitude": 4,
        "duration": 0.03
      }
    }
  },
  "scrib_jelly": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "regenerate_magicka": {
        "magnitude": 1.2
      },
      "cure_poison": true,
      "cure_disease": {
        "value": 0.36
      },
      "regenerate_stamina": {
        "magnitude": 1.2
      }
    }
  },
  "scrib_jerky": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_stamina": {
        "magnitude": 1.2
      },
      "fortify_stamina": {
        "magnitude": 1.25
      },
      "paralysis": {
        "duration": 2
      },
      "waterbreathing": {
        "duration": 1.6
      }
    }
  },
  "silverside_perch": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "damage_stamina_regen": true,
      "ravage_health": true,
      "resist_frost": true
    }
  },
  "skeever_tail": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_stamina_regen": true,
      "ravage_health": true,
      "damage_health": true,
      "fortify_light_armor": true
    }
  },
  "slaughterfish_egg": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_poison": true,
      "fortify_pickpocket": true,
      "lingering_damage_health": true,
      "fortify_stamina": true
    }
  },
  "slaughterfish_scales": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_frost": true,
      "lingering_damage_health": true,
      "fortify_heavy_armor": true,
      "fortify_block": true
    }
  },
  "sload_soap": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "resist_fire": {
        "magnitude": 1.33
      },
      "fear": {
        "magnitude": 2
      },
      "fortify_conjuration": {
        "magnitude": 1.2
      },
      "fortify_alteration": {
        "magnitude": 1.25
      }
    }
  },
  "small_antlers": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_poison": true,
      "fortify_restoration": true,
      "lingering_damage_stamina": true,
      "damage_health": true
    }
  },
  "small_pearl": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "fortify_onehanded": true,
      "fortify_restoration": true,
      "resist_frost": true
    }
  },
  "snowberries": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_fire": true,
      "fortify_enchanting": true,
      "resist_frost": true,
      "resist_shock": true
    }
  },
  "spadefish": {
    "enabled": false,
    "active": false,
    "dlc": "Fishing Creation",
    "effects": {
      "restore_health": true,
      "fortify_lockpicking": true,
      "fortify_pickpocket": true,
      "cure_disease": true
    }
  },
  "spawn_ash": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "ravage_stamina": true,
      "resist_fire": true,
      "fortify_enchanting": true,
      "ravage_magicka": true
    }
  },
  "spiddal_stick": {
    "enabled": false,
    "active": false,
    "dlc": "The Cause Creation",
    "effects": {
      "damage_health": {
        "magnitude": 2
      },
      "damage_magicka": {
        "magnitude": 1.33
      },
      "weakness_to_fire": true,
      "restore_stamina": true
    }
  },
  "spider_egg": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_stamina": true,
      "damage_magicka_regen": true,
      "fortify_lockpicking": true,
      "fortify_marksman": true
    }
  },
  "spriggan_sap": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "damage_magicka_regen": true,
      "fortify_enchanting": true,
      "fortify_smithing": true,
      "fortify_alteration": true
    }
  },
  "steelblue_entoloma": {
    "enabled": false,
    "active": false,
    "dlc": "Goblins Creation",
    "effects": {
      "restore_magicka": true,
      "fortify_destruction": true,
      "resist_frost": true,
      "fortify_carry_weight": true
    }
  },
  "stoneflower_petals": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "weakness_to_shock": {
        "magnitude": 1.33
      },
      "fortify_onehanded": {
        "magnitude": 1.25
      },
      "fortify_magicka": {
        "magnitude": 1.25
      },
      "fortify_enchanting": {
        "magnitude": 2
      }
    }
  },
  "swamp_fungal_pod": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_shock": true,
      "lingering_damage_magicka": true,
      "paralysis": true,
      "restore_health": true
    }
  },
  "taproot": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_magic": true,
      "fortify_illusion": true,
      "regenerate_magicka": true,
      "restore_magicka": true
    }
  },
  "thistle_branch": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_frost": true,
      "ravage_stamina": true,
      "resist_poison": {
        "magnitude": 0.5
      },
      "fortify_heavy_armor": true
    }
  },
  "thorn_hook": {
    "enabled": false,
    "active": false,
    "dlc": "Saints & Seducers Creation",
    "effects": {
      "lingering_damage_health": true,
      "paralysis": true,
      "regenerate_magicka": {
        "magnitude": 0.6,
        "duration": 0.6
      },
      "regenerate_health": {
        "magnitude": 0.6,
        "duration": 0.6
      }
    }
  },
  "torchbug_thorax": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "lingering_damage_magicka": true,
      "weakness_to_magic": true,
      "fortify_stamina": true
    }
  },
  "trama_root": {
    "enabled": true,
    "active": true,
    "dlc": "Dragonborn",
    "effects": {
      "weakness_to_shock": true,
      "fortify_carry_weight": true,
      "damage_magicka": true,
      "slow": true
    }
  },
  "troll_fat": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_poison": true,
      "fortify_twohanded": true,
      "frenzy": true,
      "damage_health": true
    }
  },
  "tundra_cotton": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "resist_magic": true,
      "fortify_magicka": true,
      "fortify_block": true,
      "fortify_barter": true
    }
  },
  "vampire_dust": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "invisibility": true,
      "restore_magicka": true,
      "regenerate_health": true,
      "cure_disease": true
    }
  },
  "void_essence": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_health": {
        "magnitude": 1.2
      },
      "fortify_health": {
        "magnitude": 1.25,
        "duration": 5
      },
      "fortify_stamina": {
        "magnitude": 1.25,
        "duration": 5
      },
      "regenerate_health": {
        "magnitude": 1.2
      }
    }
  },
  "void_salts": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_shock": true,
      "resist_magic": true,
      "damage_health": true,
      "fortify_magicka": true
    }
  },
  "watchers_eye": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "night_eye": true,
      "fortify_magicka": {
        "magnitude": 1.25
      },
      "fortify_illusion": {
        "magnitude": 5
      },
      "spell_absorption": true
    }
  },
  "wheat": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_health": true,
      "fortify_health": true,
      "damage_stamina_regen": true,
      "lingering_damage_magicka": true
    }
  },
  "white_cap": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "weakness_to_frost": true,
      "fortify_heavy_armor": true,
      "restore_magicka": true,
      "ravage_magicka": true
    }
  },
  "wisp_stalk_caps": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "damage_health": {
        "magnitude": 1.5
      },
      "weakness_to_poison": {
        "magnitude": 1.5
      },
      "frenzy": {
        "duration": 2
      },
      "regenerate_stamina": {
        "magnitude": 1.2
      }
    }
  },
  "wisp_wrappings": {
    "enabled": true,
    "active": true,
    "dlc": "Skyrim",
    "effects": {
      "restore_stamina": true,
      "fortify_destruction": true,
      "fortify_carry_weight": true,
      "resist_magic": true
    }
  },
  "withering_moon": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "restore_magicka": {
        "magnitude": 1.2
      },
      "spell_absorption": true,
      "fortify_light_armor": {
        "magnitude": 1.5
      },
      "cure_disease": {
        "value": 0.36
      }
    }
  },
  "worms_head_cap": {
    "enabled": false,
    "active": false,
    "dlc": "Rare Curios Creation",
    "effects": {
      "fortify_lockpicking": {
        "magnitude": 1.5
      },
      "night_eye": true,
      "fortify_carry_weight": {
        "magnitude": 1.25
      },
      "slow": {
        "duration": 2
      }
    }
  },
  "yellow_mountain_flower": {
    "enabled": true,
    "active": true,
    "dlc": "Dawnguard",
    "effects": {
      "resist_poison": true,
      "fortify_restoration": {
        "magnitude": 1.25
      },
      "fortify_health": true,
      "damage_stamina_regen": true
    }
  }
};
const effects_list = {
  "cure_disease": {
    "ingredients": {
      "charred_skeever_hide": 1,
      "chokeweed": 2,
      "felsaad_tern_feathers": null,
      "hawk_feathers": 3,
      "hunger_tongue": 4,
      "juvenile_mudcrab": null,
      "mudcrab_chitin": null,
      "red_kelp_gas_bladder": 5,
      "scrib_jelly": null,
      "spadefish": null,
      "vampire_dust": null,
      "withering_moon": 6
    },
    "dlc": "Skyrim",
    "magnitude": 5,
    "base_cost": 0.5,
    "duration": 0,
    "fixed": "duration",
    "no_value_magnifier": true,
    "active": true,
    "enabled": true
  },
  "cure_poison": {
    "ingredients": {
      "ambrosia": 1,
      "bittergreen_petals": null,
      "hunger_tongue": null,
      "imp_gall": null,
      "redwort_flower": null,
      "roobrush": null,
      "scrib_jelly": null
    },
    "dlc": "Rare Curios Creation",
    "magnitude": 2,
    "base_cost": 0.2,
    "duration": 0,
    "fixed": "duration",
    "active": false,
    "enabled": false
  },
  "damage_health": {
    "ingredients": {
      "chokeberry": 6,
      "coda_flower": 7,
      "crimson_nirnroot": 5,
      "deathbell": 8,
      "ectoplasm": null,
      "emperor_parasol_moss": 3,
      "falmer_ear": null,
      "fire_petal": 9,
      "gnarl_bark": 10,
      "harrada": null,
      "human_flesh": null,
      "human_heart": null,
      "imp_gall": 11,
      "imp_stool": null,
      "jarrin_root": 1,
      "mort_flesh": null,
      "nightshade": null,
      "nirnroot": 4,
      "poison_bloom": 12,
      "red_mountain_flower": null,
      "redwort_flower": 13,
      "river_betty": 2,
      "scalon_fin": 14,
      "skeever_tail": null,
      "small_antlers": null,
      "spiddal_stick": null,
      "troll_fat": null,
      "void_salts": null,
      "wisp_stalk_caps": 15
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 2,
    "base_cost": 3,
    "duration": 1,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "damage_magicka": {
    "ingredients": {
      "bittergreen_petals": 1,
      "butterfly_wing": null,
      "chaurus_eggs": null,
      "chokeweed": 2,
      "daedra_heart": null,
      "eye_of_sabre_cat": null,
      "glow_dust": null,
      "hagraven_feathers": null,
      "hanging_moss": null,
      "harrada": null,
      "human_heart": null,
      "jarrin_root": null,
      "luna_moth_wing": null,
      "mort_flesh": null,
      "namiras_rot": null,
      "nordic_barnacle": null,
      "spiddal_stick": null,
      "trama_root": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 3,
    "base_cost": 2.2,
    "duration": 0,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "damage_magicka_regen": {
    "ingredients": {
      "ancestor_moth_wing": null,
      "bear_claws": null,
      "blue_butterfly_wing": null,
      "blue_mountain_flower": null,
      "burnt_spriggan_wood": null,
      "chaurus_hunter_antennae": null,
      "chickens_egg": null,
      "daedroth_teeth": 1,
      "glow_dust": null,
      "hanging_moss": null,
      "harrada": null,
      "hawks_egg": null,
      "human_heart": null,
      "jarrin_root": null,
      "minotaur_horn": 2,
      "mort_flesh": null,
      "nightshade": null,
      "pygmy_sunfish": null,
      "scalon_fin": 3,
      "spider_egg": null,
      "spriggan_sap": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 100,
    "base_cost": 0.5,
    "duration": 5,
    "fixed": "magnitude",
    "active": true,
    "enabled": true
  },
  "damage_stamina": {
    "ingredients": {
      "ancestor_moth_wing": null,
      "ash_creep_cluster": null,
      "berits_ashes": null,
      "blisterwort": null,
      "blue_butterfly_wing": null,
      "bog_beacon": 2,
      "bone_meal": null,
      "canis_root": null,
      "chaurus_hunter_antennae": null,
      "comberry": 3,
      "crimson_nirnroot": 1,
      "cyrodilic_spadetail": null,
      "giants_toe": null,
      "jarrin_root": null,
      "marshmerrow": 4,
      "nirnroot": null,
      "rock_warbler_egg": null,
      "spider_egg": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 3,
    "base_cost": 1.8,
    "duration": 0,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "damage_stamina_regen": {
    "ingredients": {
      "bunglers_bane": 1,
      "creep_cluster": null,
      "daedra_heart": null,
      "frost_mirriam": null,
      "giants_toe": null,
      "histcarp": null,
      "juniper_berries": null,
      "large_antlers": null,
      "saltrice": 2,
      "silverside_perch": null,
      "skeever_tail": null,
      "wheat": null,
      "yellow_mountain_flower": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 100,
    "base_cost": 0.3,
    "duration": 5,
    "fixed": "magnitude",
    "active": true,
    "enabled": true
  },
  "fear": {
    "ingredients": {
      "blue_dartwing": 5,
      "bog_beacon": 1,
      "cyrodilic_spadetail": 5,
      "daedra_heart": 5,
      "elytra_ichor": 2,
      "gleamblossom": 5,
      "green_butterfly_wing": 5,
      "luminous_russula": 3,
      "namiras_rot": 5,
      "netch_jelly": 5,
      "poison_bloom": 5,
      "powdered_mammoth_tusk": 5,
      "rot_scale": 6,
      "sload_soap": 4
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 1,
    "base_cost": 5,
    "duration": 30,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_alteration": {
    "ingredients": {
      "blind_watchers_eye": 1,
      "burnt_spriggan_wood": null,
      "grass_pod": null,
      "lyretail_anthias": null,
      "river_betty": null,
      "screaming_maw": 2,
      "sload_soap": 3,
      "spriggan_sap": null
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.2,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_barter": {
    "ingredients": {
      "butterfly_wing": null,
      "dragons_tongue": null,
      "hagraven_claw": null,
      "imp_gall": 1,
      "tundra_cotton": null
    },
    "dlc": "Skyrim",
    "magnitude": 1,
    "base_cost": 2,
    "duration": 30,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_block": {
    "ingredients": {
      "aster_bloom_core": 1,
      "bleeding_crown": 2,
      "boar_tusk": 2,
      "briar_heart": 3,
      "honeycomb": 4,
      "pearl": 2,
      "slaughterfish_scales": 2,
      "tundra_cotton": 2
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_carry_weight": {
    "ingredients": {
      "coda_flower": 1,
      "creep_cluster": null,
      "giants_toe": null,
      "hawk_beak": null,
      "juvenile_mudcrab": null,
      "kagouti_hide": 2,
      "lyretail_anthias": null,
      "marshmerrow": 3,
      "netch_jelly": null,
      "poison_bloom": null,
      "river_betty": null,
      "scaly_pholiota": null,
      "steelblue_entoloma": null,
      "trama_root": null,
      "wisp_wrappings": null,
      "worms_head_cap": null
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.15,
    "duration": 300,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_conjuration": {
    "ingredients": {
      "ancestor_moth_wing": null,
      "berits_ashes": null,
      "blue_butterfly_wing": null,
      "blue_mountain_flower": null,
      "bone_meal": null,
      "chaurus_hunter_antennae": null,
      "congealed_putrescence": 1,
      "frost_salts": null,
      "hagraven_feathers": null,
      "lavender": null,
      "lyretail_anthias": null,
      "sload_soap": 2
    },
    "dlc": "Skyrim",
    "magnitude": 5,
    "base_cost": 0.25,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_destruction": {
    "ingredients": {
      "ash_creep_cluster": 3,
      "beehive_husk": 3,
      "comberry": 1,
      "daedra_venin": 2,
      "ectoplasm": 4,
      "glow_dust": 3,
      "glowing_mushroom": 3,
      "nightshade": 5,
      "steelblue_entoloma": 3,
      "wisp_wrappings": 3
    },
    "dlc": "Skyrim",
    "magnitude": 5,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_enchanting": {
    "ingredients": {
      "ancestor_moth_wing": null,
      "blue_butterfly_wing": null,
      "chaurus_hunter_antennae": null,
      "dreugh_wax": 1,
      "hagraven_claw": null,
      "snowberries": null,
      "spawn_ash": null,
      "spriggan_sap": null,
      "stoneflower_petals": 2
    },
    "dlc": "Skyrim",
    "magnitude": 1,
    "base_cost": 0.6,
    "duration": 30,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_health": {
    "ingredients": {
      "ambrosia": 5,
      "bear_claws": null,
      "bloodgrass": null,
      "blue_mountain_flower": null,
      "boar_tusk": 6,
      "fungus_stalk": 1,
      "giants_toe": 7,
      "glowing_mushroom": null,
      "hanging_moss": null,
      "heart_of_order": 2,
      "hydnum_azure_giant_spore": 3,
      "void_essence": 4,
      "wheat": null,
      "yellow_mountain_flower": null
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.35,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_heavy_armor": {
    "ingredients": {
      "bliss_bug_thorax": null,
      "bog_beacon": 1,
      "gnarl_bark": 2,
      "goldfish": null,
      "ice_wraith_teeth": null,
      "sabre_cat_tooth": null,
      "slaughterfish_scales": null,
      "thistle_branch": null,
      "white_cap": null
    },
    "dlc": "Skyrim",
    "magnitude": 2,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_illusion": {
    "ingredients": {
      "bliss_bug_thorax": 3,
      "dragons_tongue": 2,
      "dwarven_oil": 2,
      "glassfish": 2,
      "mora_tapinella": 2,
      "scaly_pholiota": 2,
      "taproot": 2,
      "watchers_eye": 1
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.4,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_light_armor": {
    "ingredients": {
      "ash_hopper_jelly": null,
      "aster_bloom_core": 1,
      "beehive_husk": null,
      "felsaad_tern_feathers": null,
      "hawk_feathers": null,
      "honeycomb": null,
      "luna_moth_wing": null,
      "skeever_tail": null,
      "withering_moon": 2
    },
    "dlc": "Skyrim",
    "magnitude": 2,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_lockpicking": {
    "ingredients": {
      "ashen_grass_pod": null,
      "falmer_ear": null,
      "namiras_rot": null,
      "pine_thrush_egg": null,
      "spadefish": null,
      "spider_egg": null,
      "worms_head_cap": 1
    },
    "dlc": "Skyrim",
    "magnitude": 2,
    "base_cost": 0.5,
    "duration": 30,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_magicka": {
    "ingredients": {
      "blind_watchers_eye": 2,
      "blister_pod_cap": 3,
      "briar_heart": null,
      "ectoplasm": null,
      "emperor_parasol_moss": null,
      "histcarp": null,
      "hunger_tongue": 4,
      "jazbay_grapes": null,
      "lichor": 5,
      "red_kelp_gas_bladder": 6,
      "red_mountain_flower": null,
      "salmon_roe": 1,
      "saltrice": 7,
      "stoneflower_petals": 8,
      "tundra_cotton": null,
      "void_salts": null,
      "watchers_eye": 9
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.3,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_marksman": {
    "ingredients": {
      "angelfish": null,
      "canis_root": null,
      "corkbulb_root": 1,
      "elves_ear": null,
      "juniper_berries": null,
      "spider_egg": null
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_onehanded": {
    "ingredients": {
      "bear_claws": null,
      "canis_root": null,
      "hanging_moss": null,
      "hawk_feathers": null,
      "heart_of_order": 1,
      "pearlfish": null,
      "rock_warbler_egg": null,
      "small_pearl": null,
      "stoneflower_petals": 2
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_persuasion": {
    "ingredients": {
      "glassfish": null
    },
    "dlc": "Fishing Creation",
    "magnitude": 1,
    "base_cost": 0.5,
    "duration": 30,
    "fixed": "N/A",
    "active": false,
    "enabled": false
  },
  "fortify_pickpocket": {
    "ingredients": {
      "blue_dartwing": null,
      "kresh_fiber": 1,
      "nordic_barnacle": null,
      "orange_dartwing": null,
      "slaughterfish_egg": null,
      "spadefish": null
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_restoration": {
    "ingredients": {
      "abecean_longfin": null,
      "cyrodilic_spadetail": null,
      "hacklelo_leaf": 1,
      "pygmy_sunfish": null,
      "salt_pile": null,
      "small_antlers": null,
      "small_pearl": null,
      "yellow_mountain_flower": 2
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_smithing": {
    "ingredients": {
      "blisterwort": null,
      "dreugh_wax": 1,
      "glowing_mushroom": null,
      "gold_kanet": 2,
      "pearlfish": null,
      "sabre_cat_tooth": null,
      "spriggan_sap": null
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.75,
    "duration": 30,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_sneak": {
    "ingredients": {
      "abecean_longfin": null,
      "ashen_grass_pod": null,
      "beehive_husk": null,
      "frost_mirriam": null,
      "hawk_feathers": null,
      "human_flesh": null,
      "kresh_fiber": 1,
      "powdered_mammoth_tusk": null,
      "purple_mountain_flower": null,
      "roobrush": 2
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_stamina": {
    "ingredients": {
      "boar_tusk": 1,
      "chaurus_eggs": null,
      "fungus_stalk": 2,
      "garlic": null,
      "large_antlers": null,
      "lavender": null,
      "scrib_jerky": 4,
      "slaughterfish_egg": null,
      "torchbug_thorax": null,
      "void_essence": 3
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.3,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "fortify_twohanded": {
    "ingredients": {
      "angler_larvae": null,
      "dragons_tongue": null,
      "emperor_parasol_moss": null,
      "fly_amanita": null,
      "heart_of_order": 1,
      "juvenile_mudcrab": null,
      "troll_fat": null
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "frenzy": {
    "ingredients": {
      "blisterwort": null,
      "boar_tusk": null,
      "dreugh_wax": 1,
      "falmer_ear": null,
      "fly_amanita": null,
      "hagraven_feathers": null,
      "human_heart": null,
      "hypha_facia": 2,
      "mort_flesh": null,
      "troll_fat": null,
      "wisp_stalk_caps": 3
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 1,
    "base_cost": 15,
    "duration": 10,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "invisibility": {
    "ingredients": {
      "ash_creep_cluster": null,
      "bittergreen_petals": 2,
      "blister_pod_cap": 3,
      "bloodgrass": null,
      "chaurus_eggs": null,
      "crimson_nirnroot": null,
      "daedra_silk": 4,
      "elytra_ichor": 5,
      "flame_stalk": 6,
      "glassfish": null,
      "green_butterfly_wing": null,
      "ice_wraith_teeth": null,
      "luna_moth_wing": null,
      "nirnroot": null,
      "redwort_flower": 7,
      "screaming_maw": 1,
      "vampire_dust": null
    },
    "dlc": "Skyrim",
    "magnitude": 0,
    "base_cost": 100,
    "duration": 4,
    "fixed": "magnitude",
    "active": true,
    "enabled": true
  },
  "light": {
    "ingredients": {
      "alocasia_fruit": null,
      "blind_watchers_eye": null,
      "daedroth_teeth": null,
      "hydnum_azure_giant_spore": null
    },
    "dlc": "Rare Curios Creation",
    "magnitude": 1,
    "base_cost": 1,
    "duration": 1,
    "fixed": "N/A",
    "active": false,
    "enabled": false
  },
  "lingering_damage_health": {
    "ingredients": {
      "angler_larvae": null,
      "chokeberry": 2,
      "imp_stool": null,
      "luminous_russula": 3,
      "mora_tapinella": null,
      "orange_dartwing": null,
      "roobrush": 4,
      "rot_scale": 1,
      "scathecraw": null,
      "slaughterfish_egg": null,
      "slaughterfish_scales": null,
      "thorn_hook": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 1,
    "base_cost": 12,
    "duration": 10,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "lingering_damage_magicka": {
    "ingredients": {
      "hagraven_claw": null,
      "ogres_teeth": 1,
      "purple_mountain_flower": null,
      "pygmy_sunfish": null,
      "scalon_fin": 2,
      "swamp_fungal_pod": null,
      "torchbug_thorax": null,
      "wheat": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 1,
    "base_cost": 10,
    "duration": 10,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "lingering_damage_stamina": {
    "ingredients": {
      "bittergreen_petals": 1,
      "butterfly_wing": null,
      "chickens_egg": null,
      "coda_flower": 2,
      "daedra_silk": 3,
      "hawks_egg": null,
      "kagouti_hide": 4,
      "luminous_russula": 5,
      "nightshade": null,
      "small_antlers": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 1,
    "base_cost": 1.8,
    "duration": 10,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "night_eye": {
    "ingredients": {
      "blister_pod_cap": null,
      "daedra_silk": null,
      "kagouti_hide": null,
      "watchers_eye": null,
      "worms_head_cap": null
    },
    "dlc": "Rare Curios Creation",
    "magnitude": 1,
    "base_cost": 1,
    "duration": 1,
    "fixed": "N/A",
    "active": false,
    "enabled": false
  },
  "paralysis": {
    "ingredients": {
      "aster_bloom_core": 1,
      "briar_heart": null,
      "canis_root": null,
      "corkbulb_root": 2,
      "daedra_silk": 3,
      "daedra_venin": 4,
      "fire_petal": 5,
      "gleamblossom": null,
      "gold_kanet": 6,
      "hacklelo_leaf": 7,
      "harrada": null,
      "human_flesh": null,
      "imp_stool": null,
      "netch_jelly": null,
      "purple_butterfly_wing": null,
      "rot_scale": null,
      "scrib_jerky": 8,
      "swamp_fungal_pod": null,
      "thorn_hook": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 0,
    "base_cost": 500,
    "duration": 1,
    "fixed": "magnitude",
    "active": true,
    "enabled": true
  },
  "ravage_health": {
    "ingredients": {
      "chokeberry": 1,
      "congealed_putrescence": 2,
      "cyrodilic_spadetail": null,
      "daedra_venin": 3,
      "eye_of_sabre_cat": null,
      "giant_lichen": null,
      "gold_kanet": 4,
      "jazbay_grapes": null,
      "scathecraw": null,
      "silverside_perch": null,
      "skeever_tail": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 2,
    "base_cost": 0.4,
    "duration": 10,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "ravage_magicka": {
    "ingredients": {
      "alocasia_fruit": 1,
      "coda_flower": 2,
      "frost_mirriam": null,
      "grass_pod": null,
      "lavender": null,
      "orange_dartwing": null,
      "red_mountain_flower": null,
      "scathecraw": null,
      "spawn_ash": null,
      "white_cap": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 2,
    "base_cost": 1,
    "duration": 10,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "ravage_stamina": {
    "ingredients": {
      "bee": null,
      "berits_ashes": null,
      "bone_meal": null,
      "bunglers_bane": 2,
      "deathbell": 1,
      "honeycomb": null,
      "hypha_facia": 3,
      "scathecraw": null,
      "spawn_ash": null,
      "thistle_branch": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 2,
    "base_cost": 1.6,
    "duration": 10,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "regenerate_health": {
    "ingredients": {
      "alocasia_fruit": 2,
      "ambrosia": 3,
      "angelfish": 9,
      "emperor_parasol_moss": 9,
      "garlic": 9,
      "gleamblossom": 9,
      "gnarl_bark": 4,
      "hydnum_azure_giant_spore": 5,
      "juniper_berries": 9,
      "luna_moth_wing": 9,
      "minotaur_horn": 6,
      "namiras_rot": 9,
      "nordic_barnacle": 9,
      "ogres_teeth": 7,
      "purple_butterfly_wing": 9,
      "screaming_maw": 1,
      "thorn_hook": 10,
      "vampire_dust": 9,
      "void_essence": 8
    },
    "dlc": "Skyrim",
    "magnitude": 5,
    "base_cost": 0.1,
    "duration": 300,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "regenerate_magicka": {
    "ingredients": {
      "dwarven_oil": 5,
      "fire_salts": 5,
      "garlic": 5,
      "jazbay_grapes": 5,
      "lichor": 2,
      "minotaur_horn": 3,
      "moon_sugar": 5,
      "purple_butterfly_wing": 5,
      "salmon_roe": 5,
      "salt_pile": 5,
      "screaming_maw": 1,
      "scrib_jelly": 4,
      "taproot": 5,
      "thorn_hook": 6
    },
    "dlc": "Skyrim",
    "magnitude": 5,
    "base_cost": 0.1,
    "duration": 300,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "regenerate_stamina": {
    "ingredients": {
      "alocasia_fruit": 1,
      "angler_larvae": null,
      "bee": null,
      "daedroth_teeth": 2,
      "fly_amanita": null,
      "juvenile_mudcrab": null,
      "mora_tapinella": null,
      "purple_butterfly_wing": null,
      "red_kelp_gas_bladder": 3,
      "scaly_pholiota": null,
      "scrib_jelly": 4,
      "wisp_stalk_caps": 5
    },
    "dlc": "Skyrim",
    "magnitude": 5,
    "base_cost": 0.1,
    "duration": 300,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "resist_fire": {
    "ingredients": {
      "angelfish": null,
      "ash_creep_cluster": null,
      "ashen_grass_pod": 1,
      "berits_ashes": null,
      "bliss_bug_thorax": null,
      "bone_meal": null,
      "dragons_tongue": null,
      "elves_ear": null,
      "fire_petal": 2,
      "fire_salts": null,
      "fly_amanita": null,
      "gnarl_bark": 3,
      "mudcrab_chitin": null,
      "sload_soap": 4,
      "snowberries": null,
      "spawn_ash": null
    },
    "dlc": "Skyrim",
    "magnitude": 3,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "resist_frost": {
    "ingredients": {
      "daedroth_teeth": 1,
      "flame_stalk": 2,
      "frost_mirriam": null,
      "frost_salts": null,
      "goldfish": null,
      "hawk_beak": null,
      "hydnum_azure_giant_spore": 3,
      "moon_sugar": null,
      "pearlfish": null,
      "purple_mountain_flower": null,
      "redwort_flower": 4,
      "silverside_perch": null,
      "slaughterfish_scales": null,
      "small_pearl": null,
      "snowberries": null,
      "steelblue_entoloma": null,
      "thistle_branch": null
    },
    "dlc": "Skyrim",
    "magnitude": 3,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "resist_magic": {
    "ingredients": {
      "aster_bloom_core": 1,
      "bleeding_crown": null,
      "bunglers_bane": 2,
      "chickens_egg": null,
      "crimson_nirnroot": null,
      "felsaad_tern_feathers": null,
      "gleamblossom": null,
      "hagraven_claw": null,
      "hawks_egg": null,
      "hypha_facia": 3,
      "lavender": null,
      "nirnroot": null,
      "tundra_cotton": null,
      "void_salts": null,
      "wisp_wrappings": null
    },
    "dlc": "Skyrim",
    "magnitude": 1,
    "base_cost": 1,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "resist_poison": {
    "ingredients": {
      "beehive_husk": 5,
      "bloodgrass": 3,
      "charred_skeever_hide": 3,
      "falmer_ear": 3,
      "garlic": 3,
      "grass_pod": 3,
      "minotaur_horn": 1,
      "mudcrab_chitin": 3,
      "ogres_teeth": 2,
      "slaughterfish_egg": 3,
      "thistle_branch": 4,
      "troll_fat": 3,
      "yellow_mountain_flower": 3
    },
    "dlc": "Skyrim",
    "magnitude": 4,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "resist_shock": {
    "ingredients": {
      "ash_hopper_jelly": null,
      "blue_dartwing": null,
      "corkbulb_root": 1,
      "glow_dust": null,
      "glowing_mushroom": null,
      "hawk_beak": null,
      "kagouti_hide": 2,
      "pearl": null,
      "pine_thrush_egg": null,
      "snowberries": null,
      "swamp_fungal_pod": null
    },
    "dlc": "Skyrim",
    "magnitude": 3,
    "base_cost": 0.5,
    "duration": 60,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "restore_health": {
    "ingredients": {
      "ambrosia": 1,
      "ash_hopper_jelly": 8,
      "blisterwort": 9,
      "blue_dartwing": 8,
      "blue_mountain_flower": 8,
      "butterfly_wing": 8,
      "charred_skeever_hide": 8,
      "corkbulb_root": 2,
      "daedra_heart": 8,
      "eye_of_sabre_cat": 8,
      "felsaad_tern_feathers": 8,
      "flame_stalk": 3,
      "heart_of_order": 4,
      "imp_stool": 10,
      "marshmerrow": 5,
      "rock_warbler_egg": 8,
      "saltrice": 6,
      "spadefish": 8,
      "swamp_fungal_pod": 8,
      "void_essence": 7,
      "wheat": 8
    },
    "dlc": "Skyrim",
    "magnitude": 5,
    "base_cost": 0.5,
    "duration": 0,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "restore_magicka": {
    "ingredients": {
      "blister_pod_cap": 1,
      "bog_beacon": 2,
      "briar_heart": null,
      "comberry": 3,
      "congealed_putrescence": 4,
      "creep_cluster": null,
      "dwarven_oil": null,
      "ectoplasm": null,
      "elves_ear": null,
      "elytra_ichor": 5,
      "fire_salts": null,
      "frost_salts": null,
      "fungus_stalk": 6,
      "giant_lichen": null,
      "glassfish": null,
      "grass_pod": null,
      "green_butterfly_wing": null,
      "human_flesh": null,
      "lichor": 7,
      "lyretail_anthias": null,
      "moon_sugar": null,
      "mora_tapinella": null,
      "pearl": null,
      "red_mountain_flower": null,
      "steelblue_entoloma": null,
      "taproot": null,
      "vampire_dust": null,
      "white_cap": null,
      "withering_moon": 8
    },
    "dlc": "Skyrim",
    "magnitude": 5,
    "base_cost": 0.6,
    "duration": 0,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "restore_stamina": {
    "ingredients": {
      "bear_claws": 7,
      "bee": 6,
      "charred_skeever_hide": 6,
      "chokeweed": 2,
      "eye_of_sabre_cat": 6,
      "goldfish": 6,
      "hacklelo_leaf": 3,
      "hawk_beak": 6,
      "histcarp": 6,
      "honeycomb": 6,
      "large_antlers": 6,
      "mudcrab_chitin": 6,
      "netch_jelly": 1,
      "orange_dartwing": 6,
      "pearl": 6,
      "pearlfish": 6,
      "pine_thrush_egg": 6,
      "powdered_mammoth_tusk": 6,
      "purple_mountain_flower": 6,
      "pygmy_sunfish": 6,
      "sabre_cat_tooth": 6,
      "salmon_roe": 8,
      "saltrice": 4,
      "scrib_jerky": 5,
      "silverside_perch": 6,
      "small_pearl": 6,
      "spiddal_stick": 6,
      "torchbug_thorax": 6,
      "wisp_wrappings": 6
    },
    "dlc": "Skyrim",
    "magnitude": 5,
    "base_cost": 0.6,
    "duration": 0,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "slow": {
    "ingredients": {
      "bloodgrass": null,
      "bunglers_bane": 4,
      "burnt_spriggan_wood": null,
      "deathbell": null,
      "elytra_ichor": 5,
      "green_butterfly_wing": 2,
      "kresh_fiber": 6,
      "large_antlers": 1,
      "poison_bloom": null,
      "river_betty": null,
      "rot_scale": 3,
      "salt_pile": null,
      "trama_root": null,
      "worms_head_cap": 7
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 50,
    "base_cost": 1,
    "duration": 5,
    "fixed": "magnitude",
    "active": true,
    "enabled": true
  },
  "spell_absorption": {
    "ingredients": {
      "blind_watchers_eye": null,
      "comberry": null,
      "daedra_venin": null,
      "fire_petal": null,
      "lichor": null,
      "watchers_eye": null,
      "withering_moon": null
    },
    "dlc": "Rare Curios Creation",
    "magnitude": 1,
    "base_cost": 1,
    "duration": 1,
    "fixed": "N/A",
    "active": false,
    "enabled": false
  },
  "waterbreathing": {
    "ingredients": {
      "angelfish": null,
      "angler_larvae": null,
      "chickens_egg": null,
      "fungus_stalk": 2,
      "goldfish": null,
      "hacklelo_leaf": 3,
      "hawks_egg": null,
      "histcarp": null,
      "luminous_russula": 4,
      "nordic_barnacle": null,
      "red_kelp_gas_bladder": 5,
      "salmon_roe": 1,
      "scalon_fin": 6,
      "scrib_jerky": 7
    },
    "dlc": "Skyrim",
    "magnitude": 0,
    "base_cost": 30,
    "duration": 5,
    "fixed": "magnitude",
    "active": true,
    "enabled": true
  },
  "weakness_to_fire": {
    "ingredients": {
      "bleeding_crown": null,
      "bliss_bug_thorax": null,
      "burnt_spriggan_wood": null,
      "congealed_putrescence": 2,
      "flame_stalk": 3,
      "frost_salts": null,
      "hunger_tongue": 1,
      "ice_wraith_teeth": null,
      "imp_gall": 4,
      "juniper_berries": null,
      "moon_sugar": null,
      "powdered_mammoth_tusk": null,
      "spiddal_stick": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 3,
    "base_cost": 0.6,
    "duration": 30,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "weakness_to_frost": {
    "ingredients": {
      "abecean_longfin": null,
      "ash_hopper_jelly": null,
      "chokeweed": 1,
      "elves_ear": null,
      "fire_salts": null,
      "gold_kanet": 2,
      "ice_wraith_teeth": null,
      "white_cap": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 3,
    "base_cost": 0.5,
    "duration": 30,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "weakness_to_magic": {
    "ingredients": {
      "creep_cluster": null,
      "dreugh_wax": 1,
      "dwarven_oil": null,
      "jazbay_grapes": null,
      "kresh_fiber": 2,
      "marshmerrow": 3,
      "rock_warbler_egg": null,
      "roobrush": 4,
      "salt_pile": null,
      "scaly_pholiota": null,
      "taproot": null,
      "torchbug_thorax": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 2,
    "base_cost": 1,
    "duration": 30,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "weakness_to_poison": {
    "ingredients": {
      "abecean_longfin": null,
      "bleeding_crown": null,
      "chaurus_eggs": null,
      "chokeberry": 1,
      "deathbell": null,
      "giant_lichen": null,
      "hypha_facia": 2,
      "pine_thrush_egg": null,
      "sabre_cat_tooth": null,
      "small_antlers": null,
      "wisp_stalk_caps": 3
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 2,
    "base_cost": 1,
    "duration": 30,
    "fixed": "duration",
    "active": true,
    "enabled": true
  },
  "weakness_to_shock": {
    "ingredients": {
      "ashen_grass_pod": null,
      "bee": null,
      "giant_lichen": null,
      "hagraven_feathers": null,
      "ogres_teeth": 1,
      "stoneflower_petals": 2,
      "trama_root": null,
      "void_salts": null
    },
    "dlc": "Skyrim",
    "poison": 1,
    "magnitude": 3,
    "base_cost": 0.7,
    "duration": 30,
    "fixed": "duration",
    "active": true,
    "enabled": true
  }
};
const dlcs_raw = {
  "Skyrim": true,
  "[quest]": false,
  "Dawnguard": true,
  "Dragonborn": true,
  "Hearthfire": true,
  "Rare Curios Creation": false,
  "Fishing Creation": false,
  "Saints & Seducers Creation": false,
  "The Cause Creation": false,
  "Plague of the Dead Creation": false,
  "Goblins Creation": false
};
class EEffect {
  constructor(magnitude, duration, value, poison, primary_prop, no_value_magnifier) {
    __publicField(this, "base", {
      magnitude_raw: 0,
      duration_raw: 0,
      value: 0
    });
    __publicField(this, "purified", false);
    __publicField(this, "magnitude", 0);
    __publicField(this, "magnitude_raw", 0);
    __publicField(this, "duration", 0);
    __publicField(this, "duration_raw", 0);
    __publicField(this, "value", 0);
    __publicField(this, "no_value_magnifier", false);
    __publicField(this, "poison", false);
    __publicField(this, "primary_prop", "magnitude_raw");
    __publicField(this, "magnifiers", {});
    __publicField(this, "magnifiers_special", {});
    this.base.magnitude_raw = magnitude;
    this.base.duration_raw = duration;
    this.base.value = value;
    this.poison = poison;
    this.primary_prop = primary_prop + "_raw";
    if (no_value_magnifier)
      this.no_value_magnifier = true;
  }
  setSpecialMagnifier(prop, value) {
    this.magnifiers_special[prop + "_raw"] = value;
  }
  setMagnifier(tag, value) {
    this.magnifiers[tag] = value;
  }
  removeMagnifier(tag) {
    delete this.magnifiers[tag];
  }
  round() {
    this.duration = Math.round(this.duration_raw);
    this.magnitude = Math.round(this.magnitude_raw);
  }
  calc() {
    if (this.purified) {
      this.value = 0;
      return 0;
    }
    for (let prop of ["magnitude_raw", "duration_raw"]) {
      this[prop] = this.base[prop];
      if (prop == this.primary_prop) {
        for (let magnifier of Object.values(this.magnifiers))
          this[prop] *= magnifier;
      }
      if (this.magnifiers_special[prop]) {
        this[prop] = this[prop] * this.magnifiers_special[prop];
      }
    }
    this.value = Math.floor(
      (this.magnitude ? this.magnitude ** 1.1 : 1) * (this.duration ? (this.duration / 10) ** 1.1 : 1) * this.base.value
    );
    if (this.magnifiers_special["value_raw"] && !this.no_value_magnifier)
      this.value = this.value * this.magnifiers_special["value_raw"];
    this.round();
    return this.value;
  }
}
class Potion {
  constructor(ingredients, effects, key) {
    __publicField(this, "alias", null);
    __publicField(this, "effects", {});
    __publicField(this, "eeffects", null);
    __publicField(this, "ingredients", {});
    __publicField(this, "value", 0);
    __publicField(this, "is_poison", false);
    this.ingredients = ingredients;
    this.effects = effects;
    this.key = key;
    this.calculateValue();
  }
  digest() {
    return {
      is_poison: this.is_poison,
      eeffects: this.eeffects,
      effects: this.effects,
      ingredients: this.ingredients,
      value: this.value,
      alias: this.alias,
      key: this.key
    };
  }
  calculateValue() {
    let base_alchemy_power = 4;
    base_alchemy_power = base_alchemy_power * (1 + this.constructor.options.alchemy / 200);
    base_alchemy_power = base_alchemy_power * (1 + this.constructor.options.perks.alchemy * 20 / 100);
    base_alchemy_power = base_alchemy_power * (1 + this.constructor.options.fortify / 100);
    if (this.eeffects === null) {
      this.eeffects = {};
      for (let effect_name in this.effects) {
        let effect = this.effects[effect_name];
        let eeffect = new EEffect(
          effect.magnitude,
          effect.duration,
          effect.base_cost,
          effect.poison == 1,
          effect.fixed == "duration" ? "magnitude" : "duration",
          effect.no_value_magnifier
        );
        let primary_ingredient = null;
        let primary_ingredient_priority = null;
        for (let ingredient in effect.ingredients) {
          if (!this.ingredients[ingredient])
            continue;
          if (effect.ingredients[ingredient] === null)
            continue;
          if (primary_ingredient_priority === null || effect.ingredients[ingredient] < primary_ingredient_priority) {
            primary_ingredient = this.ingredients[ingredient];
            primary_ingredient_priority = effect.ingredients[ingredient];
          }
        }
        if (primary_ingredient && primary_ingredient.effects[effect_name] !== true) {
          for (let prop of ["magnitude", "duration", "value"]) {
            if (primary_ingredient.effects[effect_name] && primary_ingredient.effects[effect_name][prop])
              eeffect.setSpecialMagnifier(prop, primary_ingredient.effects[effect_name][prop]);
          }
        }
        this.eeffects[effect_name] = eeffect;
      }
    }
    this.is_poison = false;
    let primary_effect = null;
    let primary_effect_value = null;
    for (let effect_name in this.eeffects) {
      let eeffect = this.eeffects[effect_name];
      eeffect.setMagnifier("base", base_alchemy_power);
      eeffect.setMagnifier(
        "benefactor",
        this.constructor.options.perks.benefactor && eeffect.poison != 1 ? 1.25 : 1
      );
      eeffect.setMagnifier(
        "poisoner",
        this.constructor.options.perks.poisoner && eeffect.poison == 1 ? 1.25 : 1
      );
      eeffect.setMagnifier(
        "physician",
        this.constructor.options.perks.physician && (effect_name == "restore_health" || effect_name == "restore_magicka" || effect_name == "restore_stamina") ? 1.25 : 1
      );
      eeffect.setMagnifier(
        "seeker_of_shadows",
        this.constructor.options.perks.seeker_of_shadows ? 1.1 : 1
      );
      let eefect_value = eeffect.calc();
      if (primary_effect_value == null || primary_effect_value < eefect_value) {
        primary_effect_value = eefect_value;
        primary_effect = effect_name;
      }
    }
    this.alias = primary_effect;
    this.is_poison = this.effects[primary_effect].poison == 1 ? 1 : 0;
    this.value = 0;
    for (let effect_name in this.eeffects) {
      let effect = this.eeffects[effect_name];
      let canceled_effect_magnifier = false;
      if (this.is_poison && !effect.poison)
        canceled_effect_magnifier = "benefactor";
      else if (!this.is_poison && effect.poison)
        canceled_effect_magnifier = "poisoner";
      if (canceled_effect_magnifier) {
        if (this.constructor.options.perks.purity) {
          this.eeffects[effect_name].purified = true;
        } else {
          this.eeffects[effect_name].purified = false;
          effect.removeMagnifier(canceled_effect_magnifier);
          this.value += effect.calc();
        }
      } else {
        this.value += effect.calc();
      }
    }
  }
}
__publicField(Potion, "options", null);
const potion_maker = {
  ingredients: null,
  effects: null,
  options: null,
  potions: [],
  _processed: {},
  _init_complete_callback: null,
  _progess_callback: null,
  _potion_wrapper: null,
  init: function(ingredients, effects, options, ic_callback, p_callback) {
    this.ingredients = ingredients;
    this.effects = effects;
    this.options = options;
    this._init_complete_callback = ic_callback;
    this._progess_callback = p_callback;
    this._ingredients = {};
    this._effects = {};
    for (let iname in this.ingredients) {
      this._ingredients[iname] = {};
      for (let ename of Object.keys(this.ingredients[iname].effects)) {
        this._ingredients[iname][ename] = true;
      }
    }
    for (let ename in this.effects) {
      this._effects[ename] = {};
      for (let iname of Object.keys(this.effects[ename].ingredients)) {
        this._effects[ename][iname] = true;
      }
    }
    (/* @__PURE__ */ new Date()).getTime();
    Potion.options = this.options;
    this._proceed = {};
    let k = 0;
    this._effects_names = Object.keys(this._effects);
    let total = this._effects_names.length;
    this._research(k, total);
  },
  _research: function(k, total) {
    if (k == total) {
      this.potions.sort((a, b) => b.value - a.value);
      this._init_complete_callback().then(() => this._progess_callback(1));
    } else {
      let effect1_name = this._effects_names[k];
      let ingredients_names = Object.keys(this._effects[effect1_name]);
      for (var i = 0; i < ingredients_names.length; i++) {
        for (var j = i + 1; j < ingredients_names.length; j++) {
          let pair = [ingredients_names[i], ingredients_names[j]];
          let proceed_key = pair.join("/");
          if (this._proceed[proceed_key])
            continue;
          this._proceed[proceed_key] = true;
          let pair_effects = {};
          for (let chunk of pair) {
            for (let initial_effect in this._ingredients[chunk]) {
              if (pair_effects[initial_effect])
                pair_effects[initial_effect]++;
              else
                pair_effects[initial_effect] = 1;
            }
          }
          for (let ingredient1_name of pair) {
            let effects2_names = Object.keys(this._ingredients[ingredient1_name]);
            for (let effect2_name of effects2_names) {
              if (effect2_name == effect1_name || !this._effects[effect2_name])
                continue;
              for (let ingredient3_name of Object.keys(this._effects[effect2_name])) {
                if (pair.includes(ingredient3_name))
                  continue;
                let aliases = [ingredients_names[i], ingredients_names[j], ingredient3_name];
                aliases.sort();
                let proceed_key2 = aliases.join("/");
                if (this._proceed[proceed_key2])
                  continue;
                this._proceed[proceed_key2] = true;
                let trio_effects = Object.assign({}, pair_effects);
                let trio = [pair[0], pair[1], ingredient3_name];
                let potion_legit = false;
                for (let effect3_name in this._ingredients[ingredient3_name]) {
                  if (trio_effects[effect3_name]) {
                    if (trio_effects[effect3_name] == 1)
                      potion_legit = true;
                    trio_effects[effect3_name]++;
                  }
                }
                if (potion_legit) {
                  let potion2 = new Potion(
                    trio.reduce((obj, name) => {
                      obj[name] = this.ingredients[name];
                      return obj;
                    }, {}),
                    Object.keys(trio_effects).filter((k2) => trio_effects[k2] > 1).reduce((obj, name) => {
                      obj[name] = this.effects[name];
                      return obj;
                    }, {}),
                    proceed_key2
                  );
                  this.potions.push(potion2);
                }
              }
            }
          }
          let potion = new Potion(
            pair.reduce((obj, name) => {
              obj[name] = this.ingredients[name];
              return obj;
            }, {}),
            Object.keys(pair_effects).filter((k2) => pair_effects[k2] > 1).reduce((obj, name) => {
              obj[name] = this.effects[name];
              return obj;
            }, {}),
            proceed_key
          );
          this.potions.push(potion);
        }
      }
      delete this._effects[effect1_name];
      this._progess_callback(k / total);
      window.setTimeout(
        () => this._research(k + 1, total)
      );
    }
  },
  recalc_refresh_progress_ratio: 10,
  recalc: async function(i, progress) {
    if (i === void 0)
      i = 0;
    if (progress === void 0)
      progress = 0;
    let percent = Math.floor(this.recalc_refresh_progress_ratio * progress);
    this._progess_callback(progress);
    for (var j = i; j < this.potions.length; j++) {
      this.potions[j].calculateValue();
      let local_progress = (j + 1) / this.potions.length;
      let local_percent = Math.floor(this.recalc_refresh_progress_ratio * local_progress);
      if (local_percent < this.recalc_refresh_progress_ratio && local_percent != percent) {
        this._progess_callback(local_progress);
        setTimeout(() => this.recalc(j + 1, local_progress));
        return;
      }
    }
    this.potions.sort((a, b) => b.value - a.value);
    this._init_complete_callback().then(
      () => this._progess_callback(1)
    );
  },
  getHead: function(total) {
    let out = [];
    POTIONS:
      for (let potion of this.potions) {
        for (let ingredient of Object.keys(potion.ingredients)) {
          if (!potion.ingredients[ingredient].active)
            continue POTIONS;
        }
        for (let effect of Object.keys(potion.effects)) {
          if (!potion.effects[effect].active) {
            continue POTIONS;
          }
        }
        out.push(potion.digest());
        if (out.length == total)
          return out;
      }
    return out;
  }
};
class UserOptions {
  constructor() {
    __publicField(this, "libs", {
      locale: null,
      options: {
        alchemy: 15,
        fortify: 0,
        perks: {
          alchemy: 0,
          physician: false,
          benefactor: false,
          poisoner: false,
          purity: false,
          seeker_of_shadows: false
        }
      },
      ingredients: [],
      effects: [],
      dlcs: [
        "[quest]",
        "Rare Curios Creation",
        "Fishing Creation",
        "Saints & Seducers Creation",
        "The Cause Creation",
        "Plague of the Dead Creation",
        "Goblins Creation"
      ]
    });
    __publicField(this, "initialized", false);
  }
  get(key) {
    if (!this.initialized)
      this.init();
    return this.libs[key];
  }
  set(key, value, save = true) {
    this.libs[key] = value;
    if (save)
      this.save(key);
  }
  save(key) {
    localStorage.setItem(key, JSON.stringify(this.libs[key]));
  }
  updateTogglableEntities(key, entities) {
    for (let string in entities) {
      if (entities[string])
        this.removeString(key, string, false);
      else
        this.addString(key, string, false);
    }
    localStorage.setItem(key, JSON.stringify(this.libs[key]));
  }
  addString(key, string, update = true) {
    this.libs[key].push(string);
    if (update)
      localStorage.setItem(key, JSON.stringify(this.libs[key]));
  }
  removeString(key, string, update = true) {
    this.libs[key] = this.libs[key].filter((str) => str != string);
    if (update)
      localStorage.setItem(key, JSON.stringify(this.libs[key]));
  }
  init() {
    for (let key in this.libs) {
      let stored_value = localStorage.getItem(key);
      if (!stored_value) {
        localStorage.setItem(key, JSON.stringify(this.libs[key]));
      } else {
        this.libs[key] = JSON.parse(stored_value);
      }
    }
  }
}
const userOptions = new UserOptions();
function toggle(item, name, isa) {
  if (item.active)
    item.active = false;
  else
    item.active = item.enabled;
  let state_change = {};
  state_change[name] = item.active;
  dispatcher.dispatch("toggled", { state: state_change, isa });
}
const _sfc_main$5 = {
  __name: "ToggleableEntry",
  props: {
    item: Object,
    alias: String,
    name: String,
    isa: String,
    highlighted: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        onClick: _cache[0] || (_cache[0] = ($event) => unref(toggle)(__props.item, __props.alias, __props.isa)),
        class: normalizeClass([
          __props.item.active ? "active" : "",
          __props.item.enabled ? "enabled" : "",
          __props.item.highlighted ? "highlighted" : ""
        ])
      }, toDisplayString(__props.name), 3);
    };
  }
};
const _hoisted_1$4 = { class: "controls" };
const _hoisted_2$4 = ["data-isa", "placeholder"];
const _hoisted_3$3 = { class: "filter_controls" };
const _hoisted_4$2 = ["data-hint"];
const _sfc_main$4 = {
  __name: "Pane",
  props: {
    items: Object,
    isa: String,
    filter_applied: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    function sortIList(set2, type, i18n2) {
      let names_tr = Object.keys(set2).reduce(
        (acc, name) => {
          set2[name].alias = name;
          acc[i18n2.getTerm(type, name, "name")] = name;
          return acc;
        },
        {}
      );
      let names_tr_list = Object.keys(names_tr);
      names_tr_list.sort((a, b) => a.localeCompare(b));
      let out = {};
      for (let name of names_tr_list) {
        out[name] = set2[names_tr[name]];
      }
      return out;
    }
    function toggleAll(set2, state, isa) {
      let changelist = {};
      for (let key in set2) {
        let prev_state = set2[key].active;
        set2[key].active = state ? set2[key].enabled : state;
        if (set2[key].active != prev_state)
          changelist[key] = set2[key].active;
      }
      dispatcher.dispatch("toggled", { isa, state: changelist });
    }
    function filter(e, isa, i18n2) {
      if (e.target.value) {
        let filter2 = e.target.value.split(/[^\p{L}\s]+/u).filter((s) => s);
        ITEMS:
          for (let item_alias of Object.keys(props.items)) {
            for (let filter_string of filter2) {
              if (i18n2.termContains(isa, item_alias, "name", filter_string)) {
                props.items[item_alias].highlighted = true;
                continue ITEMS;
              }
            }
            props.items[item_alias].highlighted = false;
          }
        props.filter_applied = true;
      } else {
        props.filter_applied = false;
        for (let item of Object.values(props.items))
          item.highlighted = false;
      }
    }
    function unfilter(e) {
      let input = e.target.closest(".controls").querySelector("input");
      input.value = "";
      input.blur();
      input.dispatchEvent(new Event("input"));
    }
    document.addEventListener("keydown", function(e) {
      if (e.ctrlKey || e.altKey)
        return true;
      let input = document.querySelector(".setup.active input");
      if (input.getAttribute("data-isa") != props.isa)
        return true;
      if (input != document.activeElement && (e.key.match(/^[a-zа-я]$/i) || e.key == "/" || e.key == "Enter")) {
        input.focus();
        if (e.key == "/") {
          e.preventDefault();
          return false;
        }
      } else if (e.key == "Escape") {
        unfilter({ target: document.querySelector(".setup.active input") });
      } else if (e.key == "Enter") {
        for (let item of Object.values(props.items)) {
          if (item.enabled) {
            if (e.target.value == "" || item.highlighted) {
              item.active = !item.active;
            }
          }
        }
        dispatcher.dispatch("toggled");
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createBaseVNode("nav", {
          class: normalizeClass(__props.filter_applied ? "filtered" : "")
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(sortIList(__props.items, __props.isa, _ctx.i18n), (item, name) => {
            return openBlock(), createBlock(_sfc_main$5, {
              item,
              isa: __props.isa,
              alias: item.alias,
              name
            }, null, 8, ["item", "isa", "alias", "name"]);
          }), 256))
        ], 2),
        createBaseVNode("div", _hoisted_1$4, [
          createBaseVNode("div", null, [
            createBaseVNode("input", {
              type: "text",
              name: "filter",
              "data-isa": __props.isa,
              placeholder: _ctx.i18n.getTerm("iface", "filter"),
              onKeyup: _cache[0] || (_cache[0] = (event) => event.key == "Escape" ? unfilter(event) : ""),
              onInput: _cache[1] || (_cache[1] = (event) => filter(event, __props.isa, _ctx.i18n))
            }, null, 40, _hoisted_2$4),
            createBaseVNode("div", _hoisted_3$3, [
              createBaseVNode("a", {
                class: "drop",
                onClick: _cache[2] || (_cache[2] = (event) => unfilter(event))
              }, "☓"),
              createBaseVNode("a", {
                class: "hint",
                "data-hint": _ctx.i18n.getTerm("iface", "filter_hint")
              }, "?", 8, _hoisted_4$2)
            ])
          ]),
          createBaseVNode("a", {
            onClick: _cache[3] || (_cache[3] = ($event) => toggleAll(__props.items, true, __props.isa))
          }, toDisplayString(_ctx.i18n.getTerm("iface", "select_all")), 1),
          createBaseVNode("a", {
            onClick: _cache[4] || (_cache[4] = ($event) => toggleAll(__props.items, false, __props.isa))
          }, toDisplayString(_ctx.i18n.getTerm("iface", "unselect_all")), 1)
        ])
      ]);
    };
  }
};
const _hoisted_1$3 = { class: "dlcs" };
const _hoisted_2$3 = ["onChange", "checked"];
const _hoisted_3$2 = { class: "pane_type" };
const _sfc_main$3 = {
  __name: "Setup",
  props: {
    ingredients: Object,
    effects: Object,
    active_pane: {
      default: "ingredients",
      type: Number
    },
    dlcs: Object
  },
  setup(__props) {
    const props = __props;
    function togglePane(pane) {
      props.active_pane = pane;
    }
    function toggleDlc(dlc, enabled) {
      dispatcher.dispatch("toggle-dlc", dlc, enabled);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("aside", null, [
        createBaseVNode("div", _hoisted_1$3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.dlcs, (enabled, dlc) => {
            return openBlock(), createElementBlock("label", null, [
              createBaseVNode("input", {
                onChange: ($event) => toggleDlc(dlc, __props.dlcs[dlc] = !enabled),
                checked: enabled,
                type: "checkbox",
                name: "{{ dlc }}"
              }, null, 40, _hoisted_2$3),
              createBaseVNode("span", null, toDisplayString(dlc), 1)
            ]);
          }), 256))
        ]),
        createBaseVNode("nav", _hoisted_3$2, [
          createBaseVNode("a", {
            class: normalizeClass(__props.active_pane == "ingredients" ? "active" : ""),
            onClick: _cache[0] || (_cache[0] = ($event) => togglePane("ingredients"))
          }, toDisplayString(_ctx.i18n.getTerm("iface", "ingredients")), 3),
          createBaseVNode("a", {
            class: normalizeClass(__props.active_pane == "effects" ? "active" : ""),
            onClick: _cache[1] || (_cache[1] = ($event) => togglePane("effects"))
          }, toDisplayString(_ctx.i18n.getTerm("iface", "effects")), 3)
        ]),
        createVNode(_sfc_main$4, {
          items: __props.ingredients,
          isa: "ingredients",
          class: normalizeClass([__props.active_pane == "ingredients" ? "active" : "", "ingredients", "setup"])
        }, null, 8, ["items", "class"]),
        createVNode(_sfc_main$4, {
          items: __props.effects,
          isa: "effects",
          class: normalizeClass([__props.active_pane == "effects" ? "active" : "", "effects", "setup"])
        }, null, 8, ["items", "class"])
      ]);
    };
  }
};
const _hoisted_1$2 = { class: "potion" };
const _hoisted_2$2 = { class: "ingredients" };
const _hoisted_3$1 = ["onMouseenter", "data-alias"];
const _hoisted_4$1 = ["onClick"];
const _hoisted_5$1 = { class: "effects" };
const _hoisted_6$1 = ["onMouseenter", "data-alias"];
const _hoisted_7$1 = ["onClick"];
const _hoisted_8$1 = { class: "details" };
const _sfc_main$2 = {
  __name: "Potion",
  props: {
    potion: Object
  },
  setup(__props) {
    function highlight(e, tied) {
      let source = e.target;
      let root = source.closest(".potion");
      let target = source.closest(".ingredients") ? root.querySelector(".effects") : root.querySelector(".ingredients");
      if (tied) {
        tied = Object.keys(tied);
        for (let c2 of target.children) {
          if (tied.includes(c2.getAttribute("data-alias"))) {
            c2.classList.add("emphasized");
          } else {
            c2.classList.add("not_emphasized");
          }
        }
      } else {
        for (let c2 of target.children) {
          c2.classList.remove("emphasized");
          c2.classList.remove("not_emphasized");
        }
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("header", null, [
          createBaseVNode("strong", null, toDisplayString(__props.potion.value), 1),
          createBaseVNode("span", {
            class: normalizeClass(__props.potion.is_poison ? "is_poison" : "is_potion")
          }, toDisplayString(__props.potion.is_poison ? _ctx.i18n.getTerm("iface", "poison") : _ctx.i18n.getTerm("iface", "potion")) + " " + toDisplayString(_ctx.i18n.getTerm("effects", __props.potion.alias, "name", 1)), 3)
        ]),
        createBaseVNode("div", _hoisted_2$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.potion.ingredients, (ingredient, alias) => {
            return openBlock(), createElementBlock("span", {
              onMouseenter: (e) => highlight(e, ingredient.effects),
              onMouseleave: _cache[0] || (_cache[0] = (e) => highlight(e)),
              "data-alias": alias,
              class: normalizeClass(["dropable", "icon", alias])
            }, [
              createBaseVNode("a", {
                onClick: ($event) => unref(toggle)(ingredient, alias, "ingredients")
              }, "☓", 8, _hoisted_4$1),
              createTextVNode(" " + toDisplayString(_ctx.i18n.getTerm("ingredients", alias, "name")), 1)
            ], 42, _hoisted_3$1);
          }), 256))
        ]),
        createBaseVNode("div", _hoisted_5$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(Object.keys(__props.potion.eeffects), (effect) => {
            return openBlock(), createElementBlock("span", {
              onMouseenter: (e) => highlight(e, __props.potion.effects[effect].ingredients),
              onMouseleave: _cache[1] || (_cache[1] = (e) => highlight(e)),
              "data-alias": effect,
              class: normalizeClass([__props.potion.eeffects[effect].poison ? "harmfull" : "harmless", "dropable"])
            }, [
              createTextVNode(toDisplayString(_ctx.i18n.getTerm("effects", effect, "name")) + " ", 1),
              createBaseVNode("a", {
                onClick: ($event) => unref(toggle)(__props.potion.effects[effect], effect, "effects")
              }, "☓", 8, _hoisted_7$1)
            ], 42, _hoisted_6$1);
          }), 256))
        ]),
        createBaseVNode("div", _hoisted_8$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(Object.keys(__props.potion.eeffects), (effect) => {
            return openBlock(), createElementBlock("span", null, toDisplayString(_ctx.i18n.getTerm(
              "effects",
              effect,
              "description",
              0,
              {
                "<mag>": __props.potion.eeffects[effect].magnitude,
                "<dur>": __props.potion.eeffects[effect].duration
              }
            )), 1);
          }), 256))
        ])
      ]);
    };
  }
};
const _hoisted_1$1 = ["data-empty"];
const _hoisted_2$1 = ["data-progress"];
const _sfc_main$1 = {
  __name: "Potions",
  props: {
    potions: Array
  },
  emits: ["iToggled", "potionsMounted", "eToggled"],
  setup(__props, { emit: emit2 }) {
    onMounted(() => emit2("potionsMounted"));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "potions",
        "data-empty": _ctx.i18n.getTerm("iface", "no_potions")
      }, [
        __props.potions.progress !== false ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "progress",
          style: normalizeStyle("--progress:" + __props.potions.progress),
          "data-progress": __props.potions.progress
        }, null, 12, _hoisted_2$1)) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.potions.potions.value, (potion) => {
          return openBlock(), createBlock(_sfc_main$2, { potion }, null, 8, ["potion"]);
        }), 256))
      ], 8, _hoisted_1$1);
    };
  }
};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("a", {
  href: "/",
  class: "logo"
}, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_0,
    alt: "Sky"
  }),
  /* @__PURE__ */ createBaseVNode("span", null, "alchemy")
], -1);
const _hoisted_2 = { class: "controls" };
const _hoisted_3 = { for: "options_alchemy" };
const _hoisted_4 = ["value"];
const _hoisted_5 = { for: "options_fortify" };
const _hoisted_6 = ["value"];
const _hoisted_7 = { for: "options_perks_alchemy" };
const _hoisted_8 = ["value"];
const _hoisted_9 = ["title"];
const _hoisted_10 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_1,
  alt: "GitHub"
}, null, -1);
const _hoisted_11 = [
  _hoisted_10
];
const _hoisted_12 = { class: "locale_switcher" };
const _hoisted_13 = ["onClick"];
const _sfc_main = {
  __name: "App",
  props: {},
  setup(__props) {
    i18n.setStrings(i18n_strings, userOptions.get("locale"));
    let banned_dlcs = userOptions.get("dlcs");
    for (let entry in dlcs_raw) {
      if (banned_dlcs.includes(entry)) {
        dlcs_raw[entry] = false;
      } else {
        dlcs_raw[entry] = true;
      }
    }
    let dlcs = ref(dlcs_raw);
    let banned_ingredients = userOptions.get("ingredients");
    for (let entry in ingredients_list) {
      if (banned_ingredients.includes(entry)) {
        ingredients_list[entry].active = false;
      } else {
        ingredients_list[entry].active = dlcs_raw[ingredients_list[entry].dlc];
        ingredients_list[entry].enabled = dlcs_raw[ingredients_list[entry].dlc];
      }
    }
    let ingredients = ref(ingredients_list);
    let banned_effects = userOptions.get("effects");
    for (let entry in effects_list) {
      if (banned_effects.includes(entry)) {
        effects_list[entry].active = false;
      } else {
        effects_list[entry].active = dlcs_raw[effects_list[entry].dlc];
        effects_list[entry].enabled = dlcs_raw[effects_list[entry].dlc];
      }
    }
    let effects = ref(effects_list);
    let options_raw = userOptions.get("options");
    let options = reactive(options_raw);
    let potions_list = reactive({
      progress: false,
      potions: []
    });
    dispatcher.subscribe("toggled", function(details) {
      if (details)
        userOptions.updateTogglableEntities(details.isa, details.state);
    });
    dispatcher.subscribe(
      "toggle-dlc",
      function(dlc, state) {
        if (state) {
          userOptions.removeString("dlcs", dlc);
        } else {
          userOptions.addString("dlcs", dlc);
        }
      }
    );
    function handlePotionsMounted() {
      window.setTimeout(
        function() {
          let app_container = document.querySelector("#app");
          potions_list.progress = "0%";
          potion_maker.init(
            ingredients_list,
            effects_list,
            options_raw,
            async () => {
              potions_list.potions.value = ref(potion_maker.getHead(50));
            },
            (at) => {
              if (at == 1) {
                potions_list.progress = false;
                app_container.classList.remove("init");
                app_container.classList.remove("in_progress");
              } else {
                if (at == 0) {
                  app_container.classList.add("in_progress");
                }
                potions_list.progress = Math.round(at * 100) + "%";
              }
            }
          );
        }
      );
    }
    dispatcher.subscribe(
      "toggled",
      function() {
        potions_list.potions.value = potion_maker.getHead(50);
      }
    );
    dispatcher.subscribe(
      "toggle-dlc",
      function(dlc, state) {
        for (let item of Object.values(ingredients.value)) {
          if (item.dlc == dlc) {
            item.enabled = state;
            item.active = state;
          }
        }
        if (dlc != "Skyrim") {
          for (let item of Object.values(effects.value)) {
            if (item.dlc == dlc) {
              item.enabled = state;
              item.active = state;
            }
          }
        }
        dispatcher.dispatch("toggled");
      }
    );
    function setOptionValue(id) {
      if (id) {
        document.getElementById(id).select();
      }
      userOptions.save("options");
      let app_container = document.querySelector("#app");
      app_container.classList.add("in_progress");
      potion_maker.recalc();
    }
    function switchLocale(i18n2, locale) {
      i18n2.switchLocale(locale);
      userOptions.set("locale", locale);
    }
    let hide_controls_handler_manager = {
      container: null,
      callback: null,
      handler_bound: null,
      getHandler: function(container, callback) {
        if (container)
          this.container = container;
        if (callback)
          this.callback = callback;
        if (!this.handler_bound)
          this.handler_bound = this.handler.bind(this);
        return this.handler_bound;
      },
      handler: function(e) {
        let closest = e.target;
        while (closest != this.container && closest.parentNode) {
          closest = closest.parentNode;
        }
        if (closest != this.container) {
          this.callback();
        }
      }
    };
    function toggleControls(e) {
      if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
        document.removeEventListener(
          "click",
          hide_controls_handler_manager.getHandler()
        );
      } else {
        e.target.classList.add("active");
        document.addEventListener("click", hide_controls_handler_manager.getHandler(
          e.target.parentNode,
          () => e.target.classList.remove("active")
        ));
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("header", null, [
          _hoisted_1,
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("a", {
              onClick: _cache[0] || (_cache[0] = (e) => toggleControls(e))
            }, "⚙"),
            createBaseVNode("div", null, [
              createBaseVNode("div", null, [
                createBaseVNode("label", _hoisted_3, toDisplayString(_ctx.i18n.getTerm("iface", "alchemy")), 1),
                createBaseVNode("div", null, [
                  createBaseVNode("input", {
                    id: "options_alchemy",
                    type: "number",
                    min: "0",
                    max: "100",
                    tabindex: "-1",
                    value: unref(options).alchemy,
                    onInput: _cache[1] || (_cache[1] = ($event) => unref(options).alchemy = $event.target.value),
                    onChange: _cache[2] || (_cache[2] = ($event) => setOptionValue())
                  }, null, 40, _hoisted_4),
                  createVNode(unref(m), mergeProps({
                    modelValue: unref(options).alchemy,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(options).alchemy = $event)
                  }, unref(getSliderOptions)("options_alchemy"), {
                    onChange: _cache[4] || (_cache[4] = ($event) => setOptionValue("options_alchemy"))
                  }), null, 16, ["modelValue"])
                ])
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("label", _hoisted_5, toDisplayString(_ctx.i18n.getTerm("iface", "alchemy_fortify")), 1),
                createBaseVNode("div", null, [
                  createBaseVNode("input", {
                    id: "options_fortify",
                    type: "number",
                    min: "0",
                    max: "200",
                    tabindex: "-1",
                    value: unref(options).fortify,
                    onChange: _cache[5] || (_cache[5] = ($event) => setOptionValue()),
                    onInput: _cache[6] || (_cache[6] = ($event) => unref(options).fortify = $event.target.value)
                  }, null, 40, _hoisted_6),
                  createVNode(unref(m), mergeProps({
                    modelValue: unref(options).fortify,
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => unref(options).fortify = $event)
                  }, unref(getSliderOptions)("options_fortify", { max: 200 }), {
                    onChange: _cache[8] || (_cache[8] = ($event) => setOptionValue("options_fortify"))
                  }), null, 16, ["modelValue"])
                ])
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("label", _hoisted_7, toDisplayString(_ctx.i18n.getTerm("iface", "alchemy_perk")), 1),
                createBaseVNode("div", null, [
                  createBaseVNode("input", {
                    id: "options_perks_alchemy",
                    type: "number",
                    min: "0",
                    max: "5",
                    tabindex: "-1",
                    value: unref(options).perks.alchemy,
                    onChange: _cache[9] || (_cache[9] = ($event) => setOptionValue()),
                    onInput: _cache[10] || (_cache[10] = ($event) => unref(options).perks.alchemy = $event.target.value)
                  }, null, 40, _hoisted_8),
                  createVNode(unref(m), mergeProps({
                    modelValue: unref(options).perks.alchemy,
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => unref(options).perks.alchemy = $event)
                  }, unref(getSliderOptions)("options_perks_alchemy", { max: 5 }), {
                    onChange: _cache[12] || (_cache[12] = ($event) => setOptionValue("options_perks_alchemy"))
                  }), null, 16, ["modelValue"])
                ])
              ]),
              createBaseVNode("label", null, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  tabindex: "-1",
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => unref(options).perks.physician = $event),
                  onChange: _cache[14] || (_cache[14] = ($event) => setOptionValue())
                }, null, 544), [
                  [vModelCheckbox, unref(options).perks.physician]
                ]),
                createBaseVNode("span", null, toDisplayString(_ctx.i18n.getTerm("iface", "physician_perk")), 1)
              ]),
              createBaseVNode("label", null, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  tabindex: "-1",
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => unref(options).perks.purity = $event),
                  onChange: _cache[16] || (_cache[16] = ($event) => setOptionValue())
                }, null, 544), [
                  [vModelCheckbox, unref(options).perks.purity]
                ]),
                createBaseVNode("span", null, toDisplayString(_ctx.i18n.getTerm("iface", "purity_perk")), 1)
              ]),
              createBaseVNode("label", null, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  tabindex: "-1",
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => unref(options).perks.benefactor = $event),
                  onChange: _cache[18] || (_cache[18] = ($event) => setOptionValue())
                }, null, 544), [
                  [vModelCheckbox, unref(options).perks.benefactor]
                ]),
                createBaseVNode("span", null, toDisplayString(_ctx.i18n.getTerm("iface", "benefactor_perk")), 1)
              ]),
              createBaseVNode("label", null, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  tabindex: "-1",
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => unref(options).perks.poisoner = $event),
                  onChange: _cache[20] || (_cache[20] = ($event) => setOptionValue())
                }, null, 544), [
                  [vModelCheckbox, unref(options).perks.poisoner]
                ]),
                createBaseVNode("span", null, toDisplayString(_ctx.i18n.getTerm("iface", "poisoner_perk")), 1)
              ])
            ])
          ]),
          createBaseVNode("a", {
            href: "https://github.com/JaredSpb/sky-alchemy",
            title: _ctx.i18n.getTerm("iface", "github_link"),
            target: "_blank"
          }, _hoisted_11, 8, _hoisted_9),
          createBaseVNode("nav", _hoisted_12, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.i18n.getLocales(), (locale) => {
              return openBlock(), createElementBlock("a", {
                onClick: ($event) => switchLocale(_ctx.i18n, locale),
                class: normalizeClass([locale, locale == _ctx.i18n.getActiveLocale() ? "active" : ""])
              }, toDisplayString(locale), 11, _hoisted_13);
            }), 256))
          ])
        ]),
        createBaseVNode("main", null, [
          createVNode(_sfc_main$3, {
            ingredients: unref(ingredients),
            effects: unref(effects),
            dlcs: unref(dlcs)
          }, null, 8, ["ingredients", "effects", "dlcs"]),
          createVNode(_sfc_main$1, {
            onPotionsMounted: _cache[21] || (_cache[21] = ($event) => handlePotionsMounted()),
            potions: unref(potions_list)
          }, null, 8, ["potions"])
        ])
      ], 64);
    };
  }
};
const app = createApp(_sfc_main);
app.config.globalProperties.i18n = shallowReactive(i18n);
i18n.backRef(app.config.globalProperties.i18n);
app.mount("#app");
//# sourceMappingURL=index-85b19fb2.js.map
