import { jsx as v, Fragment as It, jsxs as ae } from "react/jsx-runtime";
import * as h from "react";
import E, { useState as Er, useLayoutEffect as np, forwardRef as Rc, createElement as Qs, createContext as Ty, useContext as Ry, useCallback as Pe, useRef as Qt, useEffect as op, useMemo as Pr, isValidElement as Dy, PureComponent as qn, useImperativeHandle as ky, cloneElement as Ny } from "react";
import * as Wn from "react-dom";
import Ay from "react-dom";
import { FormProvider as Iy, Controller as $y, useFormContext as Fy, useFormState as qy } from "react-hook-form";
function ap(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = ap(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function dt() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = ap(e)) && (n && (n += " "), n += t);
  return n;
}
const Nl = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Al = dt, ip = (e, t) => (r) => {
  var n;
  if ((t == null ? void 0 : t.variants) == null) return Al(e, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
  const { variants: o, defaultVariants: a } = t, i = Object.keys(o).map((l) => {
    const u = r == null ? void 0 : r[l], d = a == null ? void 0 : a[l];
    if (u === null) return null;
    const f = Nl(u) || Nl(d);
    return o[l][f];
  }), s = r && Object.entries(r).reduce((l, u) => {
    let [d, f] = u;
    return f === void 0 || (l[d] = f), l;
  }, {}), c = t == null || (n = t.compoundVariants) === null || n === void 0 ? void 0 : n.reduce((l, u) => {
    let { class: d, className: f, ...m } = u;
    return Object.entries(m).every((b) => {
      let [g, p] = b;
      return Array.isArray(p) ? p.includes({
        ...a,
        ...s
      }[g]) : {
        ...a,
        ...s
      }[g] === p;
    }) ? [
      ...l,
      d,
      f
    ] : l;
  }, []);
  return Al(e, i, c, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
};
function Il(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Bn(...e) {
  return (t) => {
    let r = !1;
    const n = e.map((o) => {
      const a = Il(o, t);
      return !r && typeof a == "function" && (r = !0), a;
    });
    if (r)
      return () => {
        for (let o = 0; o < n.length; o++) {
          const a = n[o];
          typeof a == "function" ? a() : Il(e[o], null);
        }
      };
  };
}
function ie(...e) {
  return h.useCallback(Bn(...e), e);
}
// @__NO_SIDE_EFFECTS__
function yt(e) {
  const t = /* @__PURE__ */ Wy(e), r = h.forwardRef((n, o) => {
    const { children: a, ...i } = n, s = h.Children.toArray(a), c = s.find(Ly);
    if (c) {
      const l = c.props.children, u = s.map((d) => d === c ? h.Children.count(l) > 1 ? h.Children.only(null) : h.isValidElement(l) ? l.props.children : null : d);
      return /* @__PURE__ */ v(t, { ...i, ref: o, children: h.isValidElement(l) ? h.cloneElement(l, void 0, u) : null });
    }
    return /* @__PURE__ */ v(t, { ...i, ref: o, children: a });
  });
  return r.displayName = `${e}.Slot`, r;
}
var lr = /* @__PURE__ */ yt("Slot");
// @__NO_SIDE_EFFECTS__
function Wy(e) {
  const t = h.forwardRef((r, n) => {
    const { children: o, ...a } = r;
    if (h.isValidElement(o)) {
      const i = zy(o), s = jy(a, o.props);
      return o.type !== h.Fragment && (s.ref = n ? Bn(n, i) : i), h.cloneElement(o, s);
    }
    return h.Children.count(o) > 1 ? h.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var sp = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function By(e) {
  const t = ({ children: r }) => /* @__PURE__ */ v(It, { children: r });
  return t.displayName = `${e}.Slottable`, t.__radixId = sp, t;
}
function Ly(e) {
  return h.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === sp;
}
function jy(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], a = t[n];
    /^on[A-Z]/.test(n) ? o && a ? r[n] = (...s) => {
      const c = a(...s);
      return o(...s), c;
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...a } : n === "className" && (r[n] = [o, a].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function zy(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var Hy = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], K = Hy.reduce((e, t) => {
  const r = /* @__PURE__ */ yt(`Primitive.${t}`), n = h.forwardRef((o, a) => {
    const { asChild: i, ...s } = o, c = i ? r : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ v(c, { ...s, ref: a });
  });
  return n.displayName = `Primitive.${t}`, { ...e, [t]: n };
}, {});
function cp(e, t) {
  e && Wn.flushSync(() => e.dispatchEvent(t));
}
var lp = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
}), Yy = "VisuallyHidden", up = h.forwardRef(
  (e, t) => /* @__PURE__ */ v(
    K.span,
    {
      ...e,
      ref: t,
      style: { ...lp, ...e.style }
    }
  )
);
up.displayName = Yy;
var Gy = up;
function Uy(e, t) {
  const r = h.createContext(t), n = (a) => {
    const { children: i, ...s } = a, c = h.useMemo(() => s, Object.values(s));
    return /* @__PURE__ */ v(r.Provider, { value: c, children: i });
  };
  n.displayName = e + "Provider";
  function o(a) {
    const i = h.useContext(r);
    if (i) return i;
    if (t !== void 0) return t;
    throw new Error(`\`${a}\` must be used within \`${e}\``);
  }
  return [n, o];
}
function Be(e, t = []) {
  let r = [];
  function n(a, i) {
    const s = h.createContext(i), c = r.length;
    r = [...r, i];
    const l = (d) => {
      var w;
      const { scope: f, children: m, ...b } = d, g = ((w = f == null ? void 0 : f[e]) == null ? void 0 : w[c]) || s, p = h.useMemo(() => b, Object.values(b));
      return /* @__PURE__ */ v(g.Provider, { value: p, children: m });
    };
    l.displayName = a + "Provider";
    function u(d, f) {
      var g;
      const m = ((g = f == null ? void 0 : f[e]) == null ? void 0 : g[c]) || s, b = h.useContext(m);
      if (b) return b;
      if (i !== void 0) return i;
      throw new Error(`\`${d}\` must be used within \`${a}\``);
    }
    return [l, u];
  }
  const o = () => {
    const a = r.map((i) => h.createContext(i));
    return function(s) {
      const c = (s == null ? void 0 : s[e]) || a;
      return h.useMemo(
        () => ({ [`__scope${e}`]: { ...s, [e]: c } }),
        [s, c]
      );
    };
  };
  return o.scopeName = e, [n, Vy(o, ...t)];
}
function Vy(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const r = () => {
    const n = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(a) {
      const i = n.reduce((s, { useScope: c, scopeName: l }) => {
        const d = c(a)[`__scope${l}`];
        return { ...s, ...d };
      }, {});
      return h.useMemo(() => ({ [`__scope${t.scopeName}`]: i }), [i]);
    };
  };
  return r.scopeName = t.scopeName, r;
}
function Dc(e) {
  const t = e + "CollectionProvider", [r, n] = Be(t), [o, a] = r(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), i = (g) => {
    const { scope: p, children: w } = g, y = E.useRef(null), x = E.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ v(o, { scope: p, itemMap: x, collectionRef: y, children: w });
  };
  i.displayName = t;
  const s = e + "CollectionSlot", c = /* @__PURE__ */ yt(s), l = E.forwardRef(
    (g, p) => {
      const { scope: w, children: y } = g, x = a(s, w), S = ie(p, x.collectionRef);
      return /* @__PURE__ */ v(c, { ref: S, children: y });
    }
  );
  l.displayName = s;
  const u = e + "CollectionItemSlot", d = "data-radix-collection-item", f = /* @__PURE__ */ yt(u), m = E.forwardRef(
    (g, p) => {
      const { scope: w, children: y, ...x } = g, S = E.useRef(null), C = ie(p, S), _ = a(u, w);
      return E.useEffect(() => (_.itemMap.set(S, { ref: S, ...x }), () => void _.itemMap.delete(S))), /* @__PURE__ */ v(f, { [d]: "", ref: C, children: y });
    }
  );
  m.displayName = u;
  function b(g) {
    const p = a(e + "CollectionConsumer", g);
    return E.useCallback(() => {
      const y = p.collectionRef.current;
      if (!y) return [];
      const x = Array.from(y.querySelectorAll(`[${d}]`));
      return Array.from(p.itemMap.values()).sort(
        (_, O) => x.indexOf(_.ref.current) - x.indexOf(O.ref.current)
      );
    }, [p.collectionRef, p.itemMap]);
  }
  return [
    { Provider: i, Slot: l, ItemSlot: m },
    b,
    n
  ];
}
function W(e, t, { checkForDefaultPrevented: r = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), r === !1 || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
var xe = globalThis != null && globalThis.document ? h.useLayoutEffect : () => {
}, Ky = h[" useInsertionEffect ".trim().toString()] || xe;
function rt({
  prop: e,
  defaultProp: t,
  onChange: r = () => {
  },
  caller: n
}) {
  const [o, a, i] = Xy({
    defaultProp: t,
    onChange: r
  }), s = e !== void 0, c = s ? e : o;
  {
    const u = h.useRef(e !== void 0);
    h.useEffect(() => {
      const d = u.current;
      d !== s && console.warn(
        `${n} is changing from ${d ? "controlled" : "uncontrolled"} to ${s ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), u.current = s;
    }, [s, n]);
  }
  const l = h.useCallback(
    (u) => {
      var d;
      if (s) {
        const f = Zy(u) ? u(e) : u;
        f !== e && ((d = i.current) == null || d.call(i, f));
      } else
        a(u);
    },
    [s, e, a, i]
  );
  return [c, l];
}
function Xy({
  defaultProp: e,
  onChange: t
}) {
  const [r, n] = h.useState(e), o = h.useRef(r), a = h.useRef(t);
  return Ky(() => {
    a.current = t;
  }, [t]), h.useEffect(() => {
    var i;
    o.current !== r && ((i = a.current) == null || i.call(a, r), o.current = r);
  }, [r, o]), [r, n, a];
}
function Zy(e) {
  return typeof e == "function";
}
function Qy(e, t) {
  return h.useReducer((r, n) => t[r][n] ?? r, e);
}
var De = (e) => {
  const { present: t, children: r } = e, n = Jy(t), o = typeof r == "function" ? r({ present: n.isPresent }) : h.Children.only(r), a = ie(n.ref, ew(o));
  return typeof r == "function" || n.isPresent ? h.cloneElement(o, { ref: a }) : null;
};
De.displayName = "Presence";
function Jy(e) {
  const [t, r] = h.useState(), n = h.useRef(null), o = h.useRef(e), a = h.useRef("none"), i = e ? "mounted" : "unmounted", [s, c] = Qy(i, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return h.useEffect(() => {
    const l = tn(n.current);
    a.current = s === "mounted" ? l : "none";
  }, [s]), xe(() => {
    const l = n.current, u = o.current;
    if (u !== e) {
      const f = a.current, m = tn(l);
      e ? c("MOUNT") : m === "none" || (l == null ? void 0 : l.display) === "none" ? c("UNMOUNT") : c(u && f !== m ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, c]), xe(() => {
    if (t) {
      let l;
      const u = t.ownerDocument.defaultView ?? window, d = (m) => {
        const g = tn(n.current).includes(CSS.escape(m.animationName));
        if (m.target === t && g && (c("ANIMATION_END"), !o.current)) {
          const p = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", l = u.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = p);
          });
        }
      }, f = (m) => {
        m.target === t && (a.current = tn(n.current));
      };
      return t.addEventListener("animationstart", f), t.addEventListener("animationcancel", d), t.addEventListener("animationend", d), () => {
        u.clearTimeout(l), t.removeEventListener("animationstart", f), t.removeEventListener("animationcancel", d), t.removeEventListener("animationend", d);
      };
    } else
      c("ANIMATION_END");
  }, [t, c]), {
    isPresent: ["mounted", "unmountSuspended"].includes(s),
    ref: h.useCallback((l) => {
      n.current = l ? getComputedStyle(l) : null, r(l);
    }, [])
  };
}
function tn(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function ew(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var tw = h[" useId ".trim().toString()] || (() => {
}), rw = 0;
function Ce(e) {
  const [t, r] = h.useState(tw());
  return xe(() => {
    r((n) => n ?? String(rw++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var nw = h.createContext(void 0);
function Ln(e) {
  const t = h.useContext(nw);
  return e || t || "ltr";
}
function We(e) {
  const t = h.useRef(e);
  return h.useEffect(() => {
    t.current = e;
  }), h.useMemo(() => (...r) => {
    var n;
    return (n = t.current) == null ? void 0 : n.call(t, ...r);
  }, []);
}
function ow(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = We(e);
  h.useEffect(() => {
    const n = (o) => {
      o.key === "Escape" && r(o);
    };
    return t.addEventListener("keydown", n, { capture: !0 }), () => t.removeEventListener("keydown", n, { capture: !0 });
  }, [r, t]);
}
var aw = "DismissableLayer", Js = "dismissableLayer.update", iw = "dismissableLayer.pointerDownOutside", sw = "dismissableLayer.focusOutside", $l, dp = h.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), ur = h.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: r = !1,
      onEscapeKeyDown: n,
      onPointerDownOutside: o,
      onFocusOutside: a,
      onInteractOutside: i,
      onDismiss: s,
      ...c
    } = e, l = h.useContext(dp), [u, d] = h.useState(null), f = (u == null ? void 0 : u.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, m] = h.useState({}), b = ie(t, (O) => d(O)), g = Array.from(l.layers), [p] = [...l.layersWithOutsidePointerEventsDisabled].slice(-1), w = g.indexOf(p), y = u ? g.indexOf(u) : -1, x = l.layersWithOutsidePointerEventsDisabled.size > 0, S = y >= w, C = uw((O) => {
      const P = O.target, R = [...l.branches].some((A) => A.contains(P));
      !S || R || (o == null || o(O), i == null || i(O), O.defaultPrevented || s == null || s());
    }, f), _ = dw((O) => {
      const P = O.target;
      [...l.branches].some((A) => A.contains(P)) || (a == null || a(O), i == null || i(O), O.defaultPrevented || s == null || s());
    }, f);
    return ow((O) => {
      y === l.layers.size - 1 && (n == null || n(O), !O.defaultPrevented && s && (O.preventDefault(), s()));
    }, f), h.useEffect(() => {
      if (u)
        return r && (l.layersWithOutsidePointerEventsDisabled.size === 0 && ($l = f.body.style.pointerEvents, f.body.style.pointerEvents = "none"), l.layersWithOutsidePointerEventsDisabled.add(u)), l.layers.add(u), Fl(), () => {
          r && l.layersWithOutsidePointerEventsDisabled.size === 1 && (f.body.style.pointerEvents = $l);
        };
    }, [u, f, r, l]), h.useEffect(() => () => {
      u && (l.layers.delete(u), l.layersWithOutsidePointerEventsDisabled.delete(u), Fl());
    }, [u, l]), h.useEffect(() => {
      const O = () => m({});
      return document.addEventListener(Js, O), () => document.removeEventListener(Js, O);
    }, []), /* @__PURE__ */ v(
      K.div,
      {
        ...c,
        ref: b,
        style: {
          pointerEvents: x ? S ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: W(e.onFocusCapture, _.onFocusCapture),
        onBlurCapture: W(e.onBlurCapture, _.onBlurCapture),
        onPointerDownCapture: W(
          e.onPointerDownCapture,
          C.onPointerDownCapture
        )
      }
    );
  }
);
ur.displayName = aw;
var cw = "DismissableLayerBranch", lw = h.forwardRef((e, t) => {
  const r = h.useContext(dp), n = h.useRef(null), o = ie(t, n);
  return h.useEffect(() => {
    const a = n.current;
    if (a)
      return r.branches.add(a), () => {
        r.branches.delete(a);
      };
  }, [r.branches]), /* @__PURE__ */ v(K.div, { ...e, ref: o });
});
lw.displayName = cw;
function uw(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = We(e), n = h.useRef(!1), o = h.useRef(() => {
  });
  return h.useEffect(() => {
    const a = (s) => {
      if (s.target && !n.current) {
        let c = function() {
          fp(
            iw,
            r,
            l,
            { discrete: !0 }
          );
        };
        const l = { originalEvent: s };
        s.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = c, t.addEventListener("click", o.current, { once: !0 })) : c();
      } else
        t.removeEventListener("click", o.current);
      n.current = !1;
    }, i = window.setTimeout(() => {
      t.addEventListener("pointerdown", a);
    }, 0);
    return () => {
      window.clearTimeout(i), t.removeEventListener("pointerdown", a), t.removeEventListener("click", o.current);
    };
  }, [t, r]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => n.current = !0
  };
}
function dw(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = We(e), n = h.useRef(!1);
  return h.useEffect(() => {
    const o = (a) => {
      a.target && !n.current && fp(sw, r, { originalEvent: a }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, r]), {
    onFocusCapture: () => n.current = !0,
    onBlurCapture: () => n.current = !1
  };
}
function Fl() {
  const e = new CustomEvent(Js);
  document.dispatchEvent(e);
}
function fp(e, t, r, { discrete: n }) {
  const o = r.originalEvent.target, a = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: r });
  t && o.addEventListener(e, t, { once: !0 }), n ? cp(o, a) : o.dispatchEvent(a);
}
var Mo = "focusScope.autoFocusOnMount", To = "focusScope.autoFocusOnUnmount", ql = { bubbles: !1, cancelable: !0 }, fw = "FocusScope", Wr = h.forwardRef((e, t) => {
  const {
    loop: r = !1,
    trapped: n = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: a,
    ...i
  } = e, [s, c] = h.useState(null), l = We(o), u = We(a), d = h.useRef(null), f = ie(t, (g) => c(g)), m = h.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  h.useEffect(() => {
    if (n) {
      let g = function(x) {
        if (m.paused || !s) return;
        const S = x.target;
        s.contains(S) ? d.current = S : bt(d.current, { select: !0 });
      }, p = function(x) {
        if (m.paused || !s) return;
        const S = x.relatedTarget;
        S !== null && (s.contains(S) || bt(d.current, { select: !0 }));
      }, w = function(x) {
        if (document.activeElement === document.body)
          for (const C of x)
            C.removedNodes.length > 0 && bt(s);
      };
      document.addEventListener("focusin", g), document.addEventListener("focusout", p);
      const y = new MutationObserver(w);
      return s && y.observe(s, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", g), document.removeEventListener("focusout", p), y.disconnect();
      };
    }
  }, [n, s, m.paused]), h.useEffect(() => {
    if (s) {
      Bl.add(m);
      const g = document.activeElement;
      if (!s.contains(g)) {
        const w = new CustomEvent(Mo, ql);
        s.addEventListener(Mo, l), s.dispatchEvent(w), w.defaultPrevented || (hw(bw(hp(s)), { select: !0 }), document.activeElement === g && bt(s));
      }
      return () => {
        s.removeEventListener(Mo, l), setTimeout(() => {
          const w = new CustomEvent(To, ql);
          s.addEventListener(To, u), s.dispatchEvent(w), w.defaultPrevented || bt(g ?? document.body, { select: !0 }), s.removeEventListener(To, u), Bl.remove(m);
        }, 0);
      };
    }
  }, [s, l, u, m]);
  const b = h.useCallback(
    (g) => {
      if (!r && !n || m.paused) return;
      const p = g.key === "Tab" && !g.altKey && !g.ctrlKey && !g.metaKey, w = document.activeElement;
      if (p && w) {
        const y = g.currentTarget, [x, S] = pw(y);
        x && S ? !g.shiftKey && w === S ? (g.preventDefault(), r && bt(x, { select: !0 })) : g.shiftKey && w === x && (g.preventDefault(), r && bt(S, { select: !0 })) : w === y && g.preventDefault();
      }
    },
    [r, n, m.paused]
  );
  return /* @__PURE__ */ v(K.div, { tabIndex: -1, ...i, ref: f, onKeyDown: b });
});
Wr.displayName = fw;
function hw(e, { select: t = !1 } = {}) {
  const r = document.activeElement;
  for (const n of e)
    if (bt(n, { select: t }), document.activeElement !== r) return;
}
function pw(e) {
  const t = hp(e), r = Wl(t, e), n = Wl(t.reverse(), e);
  return [r, n];
}
function hp(e) {
  const t = [], r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => {
      const o = n.tagName === "INPUT" && n.type === "hidden";
      return n.disabled || n.hidden || o ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; r.nextNode(); ) t.push(r.currentNode);
  return t;
}
function Wl(e, t) {
  for (const r of e)
    if (!mw(r, { upTo: t })) return r;
}
function mw(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function gw(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function bt(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const r = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== r && gw(e) && t && e.select();
  }
}
var Bl = vw();
function vw() {
  let e = [];
  return {
    add(t) {
      const r = e[0];
      t !== r && (r == null || r.pause()), e = Ll(e, t), e.unshift(t);
    },
    remove(t) {
      var r;
      e = Ll(e, t), (r = e[0]) == null || r.resume();
    }
  };
}
function Ll(e, t) {
  const r = [...e], n = r.indexOf(t);
  return n !== -1 && r.splice(n, 1), r;
}
function bw(e) {
  return e.filter((t) => t.tagName !== "A");
}
var yw = "Portal", dr = h.forwardRef((e, t) => {
  var s;
  const { container: r, ...n } = e, [o, a] = h.useState(!1);
  xe(() => a(!0), []);
  const i = r || o && ((s = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : s.body);
  return i ? Ay.createPortal(/* @__PURE__ */ v(K.div, { ...n, ref: t }), i) : null;
});
dr.displayName = yw;
var Ro = 0;
function jn() {
  h.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? jl()), document.body.insertAdjacentElement("beforeend", e[1] ?? jl()), Ro++, () => {
      Ro === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), Ro--;
    };
  }, []);
}
function jl() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var Qe = function() {
  return Qe = Object.assign || function(t) {
    for (var r, n = 1, o = arguments.length; n < o; n++) {
      r = arguments[n];
      for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (t[a] = r[a]);
    }
    return t;
  }, Qe.apply(this, arguments);
};
function pp(e, t) {
  var r = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(e); o < n.length; o++)
      t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
  return r;
}
function ww(e, t, r) {
  if (r || arguments.length === 2) for (var n = 0, o = t.length, a; n < o; n++)
    (a || !(n in t)) && (a || (a = Array.prototype.slice.call(t, 0, n)), a[n] = t[n]);
  return e.concat(a || Array.prototype.slice.call(t));
}
var vn = "right-scroll-bar-position", bn = "width-before-scroll-bar", xw = "with-scroll-bars-hidden", _w = "--removed-body-scroll-bar-size";
function Do(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Sw(e, t) {
  var r = Er(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return r.value;
        },
        set current(n) {
          var o = r.value;
          o !== n && (r.value = n, r.callback(n, o));
        }
      }
    };
  })[0];
  return r.callback = t, r.facade;
}
var Cw = typeof window < "u" ? h.useLayoutEffect : h.useEffect, zl = /* @__PURE__ */ new WeakMap();
function Ow(e, t) {
  var r = Sw(null, function(n) {
    return e.forEach(function(o) {
      return Do(o, n);
    });
  });
  return Cw(function() {
    var n = zl.get(r);
    if (n) {
      var o = new Set(n), a = new Set(e), i = r.current;
      o.forEach(function(s) {
        a.has(s) || Do(s, null);
      }), a.forEach(function(s) {
        o.has(s) || Do(s, i);
      });
    }
    zl.set(r, e);
  }, [e]), r;
}
function Pw(e) {
  return e;
}
function Ew(e, t) {
  t === void 0 && (t = Pw);
  var r = [], n = !1, o = {
    read: function() {
      if (n)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return r.length ? r[r.length - 1] : e;
    },
    useMedium: function(a) {
      var i = t(a, n);
      return r.push(i), function() {
        r = r.filter(function(s) {
          return s !== i;
        });
      };
    },
    assignSyncMedium: function(a) {
      for (n = !0; r.length; ) {
        var i = r;
        r = [], i.forEach(a);
      }
      r = {
        push: function(s) {
          return a(s);
        },
        filter: function() {
          return r;
        }
      };
    },
    assignMedium: function(a) {
      n = !0;
      var i = [];
      if (r.length) {
        var s = r;
        r = [], s.forEach(a), i = r;
      }
      var c = function() {
        var u = i;
        i = [], u.forEach(a);
      }, l = function() {
        return Promise.resolve().then(c);
      };
      l(), r = {
        push: function(u) {
          i.push(u), l();
        },
        filter: function(u) {
          return i = i.filter(u), r;
        }
      };
    }
  };
  return o;
}
function Mw(e) {
  e === void 0 && (e = {});
  var t = Ew(null);
  return t.options = Qe({ async: !0, ssr: !1 }, e), t;
}
var mp = function(e) {
  var t = e.sideCar, r = pp(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var n = t.read();
  if (!n)
    throw new Error("Sidecar medium not found");
  return h.createElement(n, Qe({}, r));
};
mp.isSideCarExport = !0;
function Tw(e, t) {
  return e.useMedium(t), mp;
}
var gp = Mw(), ko = function() {
}, zn = h.forwardRef(function(e, t) {
  var r = h.useRef(null), n = h.useState({
    onScrollCapture: ko,
    onWheelCapture: ko,
    onTouchMoveCapture: ko
  }), o = n[0], a = n[1], i = e.forwardProps, s = e.children, c = e.className, l = e.removeScrollBar, u = e.enabled, d = e.shards, f = e.sideCar, m = e.noRelative, b = e.noIsolation, g = e.inert, p = e.allowPinchZoom, w = e.as, y = w === void 0 ? "div" : w, x = e.gapMode, S = pp(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), C = f, _ = Ow([r, t]), O = Qe(Qe({}, S), o);
  return h.createElement(
    h.Fragment,
    null,
    u && h.createElement(C, { sideCar: gp, removeScrollBar: l, shards: d, noRelative: m, noIsolation: b, inert: g, setCallbacks: a, allowPinchZoom: !!p, lockRef: r, gapMode: x }),
    i ? h.cloneElement(h.Children.only(s), Qe(Qe({}, O), { ref: _ })) : h.createElement(y, Qe({}, O, { className: c, ref: _ }), s)
  );
});
zn.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
zn.classNames = {
  fullWidth: bn,
  zeroRight: vn
};
var Rw = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Dw() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = Rw();
  return t && e.setAttribute("nonce", t), e;
}
function kw(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Nw(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Aw = function() {
  var e = 0, t = null;
  return {
    add: function(r) {
      e == 0 && (t = Dw()) && (kw(t, r), Nw(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, Iw = function() {
  var e = Aw();
  return function(t, r) {
    h.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && r]);
  };
}, vp = function() {
  var e = Iw(), t = function(r) {
    var n = r.styles, o = r.dynamic;
    return e(n, o), null;
  };
  return t;
}, $w = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, No = function(e) {
  return parseInt(e || "", 10) || 0;
}, Fw = function(e) {
  var t = window.getComputedStyle(document.body), r = t[e === "padding" ? "paddingLeft" : "marginLeft"], n = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [No(r), No(n), No(o)];
}, qw = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return $w;
  var t = Fw(e), r = document.documentElement.clientWidth, n = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, n - r + t[2] - t[0])
  };
}, Ww = vp(), Jt = "data-scroll-locked", Bw = function(e, t, r, n) {
  var o = e.left, a = e.top, i = e.right, s = e.gap;
  return r === void 0 && (r = "margin"), `
  .`.concat(xw, ` {
   overflow: hidden `).concat(n, `;
   padding-right: `).concat(s, "px ").concat(n, `;
  }
  body[`).concat(Jt, `] {
    overflow: hidden `).concat(n, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(n, ";"),
    r === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(a, `px;
    padding-right: `).concat(i, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(s, "px ").concat(n, `;
    `),
    r === "padding" && "padding-right: ".concat(s, "px ").concat(n, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(vn, ` {
    right: `).concat(s, "px ").concat(n, `;
  }
  
  .`).concat(bn, ` {
    margin-right: `).concat(s, "px ").concat(n, `;
  }
  
  .`).concat(vn, " .").concat(vn, ` {
    right: 0 `).concat(n, `;
  }
  
  .`).concat(bn, " .").concat(bn, ` {
    margin-right: 0 `).concat(n, `;
  }
  
  body[`).concat(Jt, `] {
    `).concat(_w, ": ").concat(s, `px;
  }
`);
}, Hl = function() {
  var e = parseInt(document.body.getAttribute(Jt) || "0", 10);
  return isFinite(e) ? e : 0;
}, Lw = function() {
  h.useEffect(function() {
    return document.body.setAttribute(Jt, (Hl() + 1).toString()), function() {
      var e = Hl() - 1;
      e <= 0 ? document.body.removeAttribute(Jt) : document.body.setAttribute(Jt, e.toString());
    };
  }, []);
}, jw = function(e) {
  var t = e.noRelative, r = e.noImportant, n = e.gapMode, o = n === void 0 ? "margin" : n;
  Lw();
  var a = h.useMemo(function() {
    return qw(o);
  }, [o]);
  return h.createElement(Ww, { styles: Bw(a, !t, o, r ? "" : "!important") });
}, ec = !1;
if (typeof window < "u")
  try {
    var rn = Object.defineProperty({}, "passive", {
      get: function() {
        return ec = !0, !0;
      }
    });
    window.addEventListener("test", rn, rn), window.removeEventListener("test", rn, rn);
  } catch {
    ec = !1;
  }
var Gt = ec ? { passive: !1 } : !1, zw = function(e) {
  return e.tagName === "TEXTAREA";
}, bp = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var r = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    r[t] !== "hidden" && // contains scroll inside self
    !(r.overflowY === r.overflowX && !zw(e) && r[t] === "visible")
  );
}, Hw = function(e) {
  return bp(e, "overflowY");
}, Yw = function(e) {
  return bp(e, "overflowX");
}, Yl = function(e, t) {
  var r = t.ownerDocument, n = t;
  do {
    typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
    var o = yp(e, n);
    if (o) {
      var a = wp(e, n), i = a[1], s = a[2];
      if (i > s)
        return !0;
    }
    n = n.parentNode;
  } while (n && n !== r.body);
  return !1;
}, Gw = function(e) {
  var t = e.scrollTop, r = e.scrollHeight, n = e.clientHeight;
  return [
    t,
    r,
    n
  ];
}, Uw = function(e) {
  var t = e.scrollLeft, r = e.scrollWidth, n = e.clientWidth;
  return [
    t,
    r,
    n
  ];
}, yp = function(e, t) {
  return e === "v" ? Hw(t) : Yw(t);
}, wp = function(e, t) {
  return e === "v" ? Gw(t) : Uw(t);
}, Vw = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, Kw = function(e, t, r, n, o) {
  var a = Vw(e, window.getComputedStyle(t).direction), i = a * n, s = r.target, c = t.contains(s), l = !1, u = i > 0, d = 0, f = 0;
  do {
    if (!s)
      break;
    var m = wp(e, s), b = m[0], g = m[1], p = m[2], w = g - p - a * b;
    (b || w) && yp(e, s) && (d += w, f += b);
    var y = s.parentNode;
    s = y && y.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? y.host : y;
  } while (
    // portaled content
    !c && s !== document.body || // self content
    c && (t.contains(s) || t === s)
  );
  return (u && Math.abs(d) < 1 || !u && Math.abs(f) < 1) && (l = !0), l;
}, nn = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, Gl = function(e) {
  return [e.deltaX, e.deltaY];
}, Ul = function(e) {
  return e && "current" in e ? e.current : e;
}, Xw = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, Zw = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, Qw = 0, Ut = [];
function Jw(e) {
  var t = h.useRef([]), r = h.useRef([0, 0]), n = h.useRef(), o = h.useState(Qw++)[0], a = h.useState(vp)[0], i = h.useRef(e);
  h.useEffect(function() {
    i.current = e;
  }, [e]), h.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var g = ww([e.lockRef.current], (e.shards || []).map(Ul), !0).filter(Boolean);
      return g.forEach(function(p) {
        return p.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), g.forEach(function(p) {
          return p.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var s = h.useCallback(function(g, p) {
    if ("touches" in g && g.touches.length === 2 || g.type === "wheel" && g.ctrlKey)
      return !i.current.allowPinchZoom;
    var w = nn(g), y = r.current, x = "deltaX" in g ? g.deltaX : y[0] - w[0], S = "deltaY" in g ? g.deltaY : y[1] - w[1], C, _ = g.target, O = Math.abs(x) > Math.abs(S) ? "h" : "v";
    if ("touches" in g && O === "h" && _.type === "range")
      return !1;
    var P = window.getSelection(), R = P && P.anchorNode, A = R ? R === _ || R.contains(_) : !1;
    if (A)
      return !1;
    var D = Yl(O, _);
    if (!D)
      return !0;
    if (D ? C = O : (C = O === "v" ? "h" : "v", D = Yl(O, _)), !D)
      return !1;
    if (!n.current && "changedTouches" in g && (x || S) && (n.current = C), !C)
      return !0;
    var B = n.current || C;
    return Kw(B, p, g, B === "h" ? x : S);
  }, []), c = h.useCallback(function(g) {
    var p = g;
    if (!(!Ut.length || Ut[Ut.length - 1] !== a)) {
      var w = "deltaY" in p ? Gl(p) : nn(p), y = t.current.filter(function(C) {
        return C.name === p.type && (C.target === p.target || p.target === C.shadowParent) && Xw(C.delta, w);
      })[0];
      if (y && y.should) {
        p.cancelable && p.preventDefault();
        return;
      }
      if (!y) {
        var x = (i.current.shards || []).map(Ul).filter(Boolean).filter(function(C) {
          return C.contains(p.target);
        }), S = x.length > 0 ? s(p, x[0]) : !i.current.noIsolation;
        S && p.cancelable && p.preventDefault();
      }
    }
  }, []), l = h.useCallback(function(g, p, w, y) {
    var x = { name: g, delta: p, target: w, should: y, shadowParent: ex(w) };
    t.current.push(x), setTimeout(function() {
      t.current = t.current.filter(function(S) {
        return S !== x;
      });
    }, 1);
  }, []), u = h.useCallback(function(g) {
    r.current = nn(g), n.current = void 0;
  }, []), d = h.useCallback(function(g) {
    l(g.type, Gl(g), g.target, s(g, e.lockRef.current));
  }, []), f = h.useCallback(function(g) {
    l(g.type, nn(g), g.target, s(g, e.lockRef.current));
  }, []);
  h.useEffect(function() {
    return Ut.push(a), e.setCallbacks({
      onScrollCapture: d,
      onWheelCapture: d,
      onTouchMoveCapture: f
    }), document.addEventListener("wheel", c, Gt), document.addEventListener("touchmove", c, Gt), document.addEventListener("touchstart", u, Gt), function() {
      Ut = Ut.filter(function(g) {
        return g !== a;
      }), document.removeEventListener("wheel", c, Gt), document.removeEventListener("touchmove", c, Gt), document.removeEventListener("touchstart", u, Gt);
    };
  }, []);
  var m = e.removeScrollBar, b = e.inert;
  return h.createElement(
    h.Fragment,
    null,
    b ? h.createElement(a, { styles: Zw(o) }) : null,
    m ? h.createElement(jw, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function ex(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const tx = Tw(gp, Jw);
var Br = h.forwardRef(function(e, t) {
  return h.createElement(zn, Qe({}, e, { ref: t, sideCar: tx }));
});
Br.classNames = zn.classNames;
var rx = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, Vt = /* @__PURE__ */ new WeakMap(), on = /* @__PURE__ */ new WeakMap(), an = {}, Ao = 0, xp = function(e) {
  return e && (e.host || xp(e.parentNode));
}, nx = function(e, t) {
  return t.map(function(r) {
    if (e.contains(r))
      return r;
    var n = xp(r);
    return n && e.contains(n) ? n : (console.error("aria-hidden", r, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(r) {
    return !!r;
  });
}, ox = function(e, t, r, n) {
  var o = nx(t, Array.isArray(e) ? e : [e]);
  an[r] || (an[r] = /* @__PURE__ */ new WeakMap());
  var a = an[r], i = [], s = /* @__PURE__ */ new Set(), c = new Set(o), l = function(d) {
    !d || s.has(d) || (s.add(d), l(d.parentNode));
  };
  o.forEach(l);
  var u = function(d) {
    !d || c.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (s.has(f))
        u(f);
      else
        try {
          var m = f.getAttribute(n), b = m !== null && m !== "false", g = (Vt.get(f) || 0) + 1, p = (a.get(f) || 0) + 1;
          Vt.set(f, g), a.set(f, p), i.push(f), g === 1 && b && on.set(f, !0), p === 1 && f.setAttribute(r, "true"), b || f.setAttribute(n, "true");
        } catch (w) {
          console.error("aria-hidden: cannot operate on ", f, w);
        }
    });
  };
  return u(t), s.clear(), Ao++, function() {
    i.forEach(function(d) {
      var f = Vt.get(d) - 1, m = a.get(d) - 1;
      Vt.set(d, f), a.set(d, m), f || (on.has(d) || d.removeAttribute(n), on.delete(d)), m || d.removeAttribute(r);
    }), Ao--, Ao || (Vt = /* @__PURE__ */ new WeakMap(), Vt = /* @__PURE__ */ new WeakMap(), on = /* @__PURE__ */ new WeakMap(), an = {});
  };
}, Hn = function(e, t, r) {
  r === void 0 && (r = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), o = rx(e);
  return o ? (n.push.apply(n, Array.from(o.querySelectorAll("[aria-live], script"))), ox(n, o, r, "aria-hidden")) : function() {
    return null;
  };
}, Yn = "Dialog", [_p] = Be(Yn), [ax, Ue] = _p(Yn), Sp = (e) => {
  const {
    __scopeDialog: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: a,
    modal: i = !0
  } = e, s = h.useRef(null), c = h.useRef(null), [l, u] = rt({
    prop: n,
    defaultProp: o ?? !1,
    onChange: a,
    caller: Yn
  });
  return /* @__PURE__ */ v(
    ax,
    {
      scope: t,
      triggerRef: s,
      contentRef: c,
      contentId: Ce(),
      titleId: Ce(),
      descriptionId: Ce(),
      open: l,
      onOpenChange: u,
      onOpenToggle: h.useCallback(() => u((d) => !d), [u]),
      modal: i,
      children: r
    }
  );
};
Sp.displayName = Yn;
var Cp = "DialogTrigger", Op = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = Ue(Cp, r), a = ie(t, o.triggerRef);
    return /* @__PURE__ */ v(
      K.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": Ac(o.open),
        ...n,
        ref: a,
        onClick: W(e.onClick, o.onOpenToggle)
      }
    );
  }
);
Op.displayName = Cp;
var kc = "DialogPortal", [ix, Pp] = _p(kc, {
  forceMount: void 0
}), Ep = (e) => {
  const { __scopeDialog: t, forceMount: r, children: n, container: o } = e, a = Ue(kc, t);
  return /* @__PURE__ */ v(ix, { scope: t, forceMount: r, children: h.Children.map(n, (i) => /* @__PURE__ */ v(De, { present: r || a.open, children: /* @__PURE__ */ v(dr, { asChild: !0, container: o, children: i }) })) });
};
Ep.displayName = kc;
var xn = "DialogOverlay", Mp = h.forwardRef(
  (e, t) => {
    const r = Pp(xn, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, a = Ue(xn, e.__scopeDialog);
    return a.modal ? /* @__PURE__ */ v(De, { present: n || a.open, children: /* @__PURE__ */ v(cx, { ...o, ref: t }) }) : null;
  }
);
Mp.displayName = xn;
var sx = /* @__PURE__ */ yt("DialogOverlay.RemoveScroll"), cx = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = Ue(xn, r);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ v(Br, { as: sx, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ v(
        K.div,
        {
          "data-state": Ac(o.open),
          ...n,
          ref: t,
          style: { pointerEvents: "auto", ...n.style }
        }
      ) })
    );
  }
), $t = "DialogContent", Tp = h.forwardRef(
  (e, t) => {
    const r = Pp($t, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, a = Ue($t, e.__scopeDialog);
    return /* @__PURE__ */ v(De, { present: n || a.open, children: a.modal ? /* @__PURE__ */ v(lx, { ...o, ref: t }) : /* @__PURE__ */ v(ux, { ...o, ref: t }) });
  }
);
Tp.displayName = $t;
var lx = h.forwardRef(
  (e, t) => {
    const r = Ue($t, e.__scopeDialog), n = h.useRef(null), o = ie(t, r.contentRef, n);
    return h.useEffect(() => {
      const a = n.current;
      if (a) return Hn(a);
    }, []), /* @__PURE__ */ v(
      Rp,
      {
        ...e,
        ref: o,
        trapFocus: r.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: W(e.onCloseAutoFocus, (a) => {
          var i;
          a.preventDefault(), (i = r.triggerRef.current) == null || i.focus();
        }),
        onPointerDownOutside: W(e.onPointerDownOutside, (a) => {
          const i = a.detail.originalEvent, s = i.button === 0 && i.ctrlKey === !0;
          (i.button === 2 || s) && a.preventDefault();
        }),
        onFocusOutside: W(
          e.onFocusOutside,
          (a) => a.preventDefault()
        )
      }
    );
  }
), ux = h.forwardRef(
  (e, t) => {
    const r = Ue($t, e.__scopeDialog), n = h.useRef(!1), o = h.useRef(!1);
    return /* @__PURE__ */ v(
      Rp,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (a) => {
          var i, s;
          (i = e.onCloseAutoFocus) == null || i.call(e, a), a.defaultPrevented || (n.current || (s = r.triggerRef.current) == null || s.focus(), a.preventDefault()), n.current = !1, o.current = !1;
        },
        onInteractOutside: (a) => {
          var c, l;
          (c = e.onInteractOutside) == null || c.call(e, a), a.defaultPrevented || (n.current = !0, a.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const i = a.target;
          ((l = r.triggerRef.current) == null ? void 0 : l.contains(i)) && a.preventDefault(), a.detail.originalEvent.type === "focusin" && o.current && a.preventDefault();
        }
      }
    );
  }
), Rp = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, trapFocus: n, onOpenAutoFocus: o, onCloseAutoFocus: a, ...i } = e, s = Ue($t, r), c = h.useRef(null), l = ie(t, c);
    return jn(), /* @__PURE__ */ ae(It, { children: [
      /* @__PURE__ */ v(
        Wr,
        {
          asChild: !0,
          loop: !0,
          trapped: n,
          onMountAutoFocus: o,
          onUnmountAutoFocus: a,
          children: /* @__PURE__ */ v(
            ur,
            {
              role: "dialog",
              id: s.contentId,
              "aria-describedby": s.descriptionId,
              "aria-labelledby": s.titleId,
              "data-state": Ac(s.open),
              ...i,
              ref: l,
              onDismiss: () => s.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ ae(It, { children: [
        /* @__PURE__ */ v(dx, { titleId: s.titleId }),
        /* @__PURE__ */ v(hx, { contentRef: c, descriptionId: s.descriptionId })
      ] })
    ] });
  }
), Nc = "DialogTitle", Dp = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = Ue(Nc, r);
    return /* @__PURE__ */ v(K.h2, { id: o.titleId, ...n, ref: t });
  }
);
Dp.displayName = Nc;
var kp = "DialogDescription", Np = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = Ue(kp, r);
    return /* @__PURE__ */ v(K.p, { id: o.descriptionId, ...n, ref: t });
  }
);
Np.displayName = kp;
var Ap = "DialogClose", Ip = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = Ue(Ap, r);
    return /* @__PURE__ */ v(
      K.button,
      {
        type: "button",
        ...n,
        ref: t,
        onClick: W(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
Ip.displayName = Ap;
function Ac(e) {
  return e ? "open" : "closed";
}
var $p = "DialogTitleWarning", [Kk, Fp] = Uy($p, {
  contentName: $t,
  titleName: Nc,
  docsSlug: "dialog"
}), dx = ({ titleId: e }) => {
  const t = Fp($p), r = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return h.useEffect(() => {
    e && (document.getElementById(e) || console.error(r));
  }, [r, e]), null;
}, fx = "DialogDescriptionWarning", hx = ({ contentRef: e, descriptionId: t }) => {
  const n = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Fp(fx).contentName}}.`;
  return h.useEffect(() => {
    var a;
    const o = (a = e.current) == null ? void 0 : a.getAttribute("aria-describedby");
    t && o && (document.getElementById(t) || console.warn(n));
  }, [n, e, t]), null;
}, qp = Sp, Wp = Op, Bp = Ep, Lp = Mp, jp = Tp, zp = Dp, Hp = Np, Ic = Ip, sn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function nt(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var cn = { exports: {} }, Io = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Vl;
function px() {
  if (Vl) return Io;
  Vl = 1;
  var e = E;
  function t(d, f) {
    return d === f && (d !== 0 || 1 / d === 1 / f) || d !== d && f !== f;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useState, o = e.useEffect, a = e.useLayoutEffect, i = e.useDebugValue;
  function s(d, f) {
    var m = f(), b = n({ inst: { value: m, getSnapshot: f } }), g = b[0].inst, p = b[1];
    return a(
      function() {
        g.value = m, g.getSnapshot = f, c(g) && p({ inst: g });
      },
      [d, m, f]
    ), o(
      function() {
        return c(g) && p({ inst: g }), d(function() {
          c(g) && p({ inst: g });
        });
      },
      [d]
    ), i(m), m;
  }
  function c(d) {
    var f = d.getSnapshot;
    d = d.value;
    try {
      var m = f();
      return !r(d, m);
    } catch {
      return !0;
    }
  }
  function l(d, f) {
    return f();
  }
  var u = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? l : s;
  return Io.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : u, Io;
}
var $o = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Kl;
function mx() {
  return Kl || (Kl = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(m, b) {
      return m === b && (m !== 0 || 1 / m === 1 / b) || m !== m && b !== b;
    }
    function t(m, b) {
      u || o.startTransition === void 0 || (u = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var g = b();
      if (!d) {
        var p = b();
        a(g, p) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), d = !0);
      }
      p = i({
        inst: { value: g, getSnapshot: b }
      });
      var w = p[0].inst, y = p[1];
      return c(
        function() {
          w.value = g, w.getSnapshot = b, r(w) && y({ inst: w });
        },
        [m, g, b]
      ), s(
        function() {
          return r(w) && y({ inst: w }), m(function() {
            r(w) && y({ inst: w });
          });
        },
        [m]
      ), l(g), g;
    }
    function r(m) {
      var b = m.getSnapshot;
      m = m.value;
      try {
        var g = b();
        return !a(m, g);
      } catch {
        return !0;
      }
    }
    function n(m, b) {
      return b();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var o = E, a = typeof Object.is == "function" ? Object.is : e, i = o.useState, s = o.useEffect, c = o.useLayoutEffect, l = o.useDebugValue, u = !1, d = !1, f = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? n : t;
    $o.useSyncExternalStore = o.useSyncExternalStore !== void 0 ? o.useSyncExternalStore : f, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), $o;
}
var Xl;
function gx() {
  return Xl || (Xl = 1, process.env.NODE_ENV === "production" ? cn.exports = px() : cn.exports = mx()), cn.exports;
}
var vx = gx();
function bx() {
  return vx.useSyncExternalStore(
    yx,
    () => !0,
    () => !1
  );
}
function yx() {
  return () => {
  };
}
var $c = "Avatar", [wx] = Be($c), [xx, Yp] = wx($c), Gp = h.forwardRef(
  (e, t) => {
    const { __scopeAvatar: r, ...n } = e, [o, a] = h.useState("idle");
    return /* @__PURE__ */ v(
      xx,
      {
        scope: r,
        imageLoadingStatus: o,
        onImageLoadingStatusChange: a,
        children: /* @__PURE__ */ v(K.span, { ...n, ref: t })
      }
    );
  }
);
Gp.displayName = $c;
var Up = "AvatarImage", Vp = h.forwardRef(
  (e, t) => {
    const { __scopeAvatar: r, src: n, onLoadingStatusChange: o = () => {
    }, ...a } = e, i = Yp(Up, r), s = _x(n, a), c = We((l) => {
      o(l), i.onImageLoadingStatusChange(l);
    });
    return xe(() => {
      s !== "idle" && c(s);
    }, [s, c]), s === "loaded" ? /* @__PURE__ */ v(K.img, { ...a, ref: t, src: n }) : null;
  }
);
Vp.displayName = Up;
var Kp = "AvatarFallback", Xp = h.forwardRef(
  (e, t) => {
    const { __scopeAvatar: r, delayMs: n, ...o } = e, a = Yp(Kp, r), [i, s] = h.useState(n === void 0);
    return h.useEffect(() => {
      if (n !== void 0) {
        const c = window.setTimeout(() => s(!0), n);
        return () => window.clearTimeout(c);
      }
    }, [n]), i && a.imageLoadingStatus !== "loaded" ? /* @__PURE__ */ v(K.span, { ...o, ref: t }) : null;
  }
);
Xp.displayName = Kp;
function Zl(e, t) {
  return e ? t ? (e.src !== t && (e.src = t), e.complete && e.naturalWidth > 0 ? "loaded" : "loading") : "error" : "idle";
}
function _x(e, { referrerPolicy: t, crossOrigin: r }) {
  const n = bx(), o = h.useRef(null), a = n ? (o.current || (o.current = new window.Image()), o.current) : null, [i, s] = h.useState(
    () => Zl(a, e)
  );
  return xe(() => {
    s(Zl(a, e));
  }, [a, e]), xe(() => {
    const c = (d) => () => {
      s(d);
    };
    if (!a) return;
    const l = c("loaded"), u = c("error");
    return a.addEventListener("load", l), a.addEventListener("error", u), t && (a.referrerPolicy = t), typeof r == "string" && (a.crossOrigin = r), () => {
      a.removeEventListener("load", l), a.removeEventListener("error", u);
    };
  }, [a, r, t]), i;
}
var Sx = Gp, Cx = Vp, Ox = Xp;
function Zp(e) {
  const t = h.useRef({ value: e, previous: e });
  return h.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e]);
}
function Qp(e) {
  const [t, r] = h.useState(void 0);
  return xe(() => {
    if (e) {
      r({ width: e.offsetWidth, height: e.offsetHeight });
      const n = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const a = o[0];
        let i, s;
        if ("borderBoxSize" in a) {
          const c = a.borderBoxSize, l = Array.isArray(c) ? c[0] : c;
          i = l.inlineSize, s = l.blockSize;
        } else
          i = e.offsetWidth, s = e.offsetHeight;
        r({ width: i, height: s });
      });
      return n.observe(e, { box: "border-box" }), () => n.unobserve(e);
    } else
      r(void 0);
  }, [e]), t;
}
const Px = ["top", "right", "bottom", "left"], wt = Math.min, Me = Math.max, _n = Math.round, ln = Math.floor, tt = (e) => ({
  x: e,
  y: e
}), Ex = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function tc(e, t, r) {
  return Me(e, wt(t, r));
}
function ft(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function ht(e) {
  return e.split("-")[0];
}
function fr(e) {
  return e.split("-")[1];
}
function Fc(e) {
  return e === "x" ? "y" : "x";
}
function qc(e) {
  return e === "y" ? "height" : "width";
}
function Je(e) {
  const t = e[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function Wc(e) {
  return Fc(Je(e));
}
function Mx(e, t, r) {
  r === void 0 && (r = !1);
  const n = fr(e), o = Wc(e), a = qc(o);
  let i = o === "x" ? n === (r ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[a] > t.floating[a] && (i = Sn(i)), [i, Sn(i)];
}
function Tx(e) {
  const t = Sn(e);
  return [rc(e), t, rc(t)];
}
function rc(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const Ql = ["left", "right"], Jl = ["right", "left"], Rx = ["top", "bottom"], Dx = ["bottom", "top"];
function kx(e, t, r) {
  switch (e) {
    case "top":
    case "bottom":
      return r ? t ? Jl : Ql : t ? Ql : Jl;
    case "left":
    case "right":
      return t ? Rx : Dx;
    default:
      return [];
  }
}
function Nx(e, t, r, n) {
  const o = fr(e);
  let a = kx(ht(e), r === "start", n);
  return o && (a = a.map((i) => i + "-" + o), t && (a = a.concat(a.map(rc)))), a;
}
function Sn(e) {
  const t = ht(e);
  return Ex[t] + e.slice(t.length);
}
function Ax(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Jp(e) {
  return typeof e != "number" ? Ax(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Cn(e) {
  const {
    x: t,
    y: r,
    width: n,
    height: o
  } = e;
  return {
    width: n,
    height: o,
    top: r,
    left: t,
    right: t + n,
    bottom: r + o,
    x: t,
    y: r
  };
}
function eu(e, t, r) {
  let {
    reference: n,
    floating: o
  } = e;
  const a = Je(t), i = Wc(t), s = qc(i), c = ht(t), l = a === "y", u = n.x + n.width / 2 - o.width / 2, d = n.y + n.height / 2 - o.height / 2, f = n[s] / 2 - o[s] / 2;
  let m;
  switch (c) {
    case "top":
      m = {
        x: u,
        y: n.y - o.height
      };
      break;
    case "bottom":
      m = {
        x: u,
        y: n.y + n.height
      };
      break;
    case "right":
      m = {
        x: n.x + n.width,
        y: d
      };
      break;
    case "left":
      m = {
        x: n.x - o.width,
        y: d
      };
      break;
    default:
      m = {
        x: n.x,
        y: n.y
      };
  }
  switch (fr(t)) {
    case "start":
      m[i] -= f * (r && l ? -1 : 1);
      break;
    case "end":
      m[i] += f * (r && l ? -1 : 1);
      break;
  }
  return m;
}
async function Ix(e, t) {
  var r;
  t === void 0 && (t = {});
  const {
    x: n,
    y: o,
    platform: a,
    rects: i,
    elements: s,
    strategy: c
  } = e, {
    boundary: l = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: d = "floating",
    altBoundary: f = !1,
    padding: m = 0
  } = ft(t, e), b = Jp(m), p = s[f ? d === "floating" ? "reference" : "floating" : d], w = Cn(await a.getClippingRect({
    element: (r = await (a.isElement == null ? void 0 : a.isElement(p))) == null || r ? p : p.contextElement || await (a.getDocumentElement == null ? void 0 : a.getDocumentElement(s.floating)),
    boundary: l,
    rootBoundary: u,
    strategy: c
  })), y = d === "floating" ? {
    x: n,
    y: o,
    width: i.floating.width,
    height: i.floating.height
  } : i.reference, x = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(s.floating)), S = await (a.isElement == null ? void 0 : a.isElement(x)) ? await (a.getScale == null ? void 0 : a.getScale(x)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, C = Cn(a.convertOffsetParentRelativeRectToViewportRelativeRect ? await a.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: s,
    rect: y,
    offsetParent: x,
    strategy: c
  }) : y);
  return {
    top: (w.top - C.top + b.top) / S.y,
    bottom: (C.bottom - w.bottom + b.bottom) / S.y,
    left: (w.left - C.left + b.left) / S.x,
    right: (C.right - w.right + b.right) / S.x
  };
}
const $x = 50, Fx = async (e, t, r) => {
  const {
    placement: n = "bottom",
    strategy: o = "absolute",
    middleware: a = [],
    platform: i
  } = r, s = i.detectOverflow ? i : {
    ...i,
    detectOverflow: Ix
  }, c = await (i.isRTL == null ? void 0 : i.isRTL(t));
  let l = await i.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: u,
    y: d
  } = eu(l, n, c), f = n, m = 0;
  const b = {};
  for (let g = 0; g < a.length; g++) {
    const p = a[g];
    if (!p)
      continue;
    const {
      name: w,
      fn: y
    } = p, {
      x,
      y: S,
      data: C,
      reset: _
    } = await y({
      x: u,
      y: d,
      initialPlacement: n,
      placement: f,
      strategy: o,
      middlewareData: b,
      rects: l,
      platform: s,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = x ?? u, d = S ?? d, b[w] = {
      ...b[w],
      ...C
    }, _ && m < $x && (m++, typeof _ == "object" && (_.placement && (f = _.placement), _.rects && (l = _.rects === !0 ? await i.getElementRects({
      reference: e,
      floating: t,
      strategy: o
    }) : _.rects), {
      x: u,
      y: d
    } = eu(l, f, c)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: o,
    middlewareData: b
  };
}, qx = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: r,
      y: n,
      placement: o,
      rects: a,
      platform: i,
      elements: s,
      middlewareData: c
    } = t, {
      element: l,
      padding: u = 0
    } = ft(e, t) || {};
    if (l == null)
      return {};
    const d = Jp(u), f = {
      x: r,
      y: n
    }, m = Wc(o), b = qc(m), g = await i.getDimensions(l), p = m === "y", w = p ? "top" : "left", y = p ? "bottom" : "right", x = p ? "clientHeight" : "clientWidth", S = a.reference[b] + a.reference[m] - f[m] - a.floating[b], C = f[m] - a.reference[m], _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(l));
    let O = _ ? _[x] : 0;
    (!O || !await (i.isElement == null ? void 0 : i.isElement(_))) && (O = s.floating[x] || a.floating[b]);
    const P = S / 2 - C / 2, R = O / 2 - g[b] / 2 - 1, A = wt(d[w], R), D = wt(d[y], R), B = A, k = O - g[b] - D, $ = O / 2 - g[b] / 2 + P, F = tc(B, $, k), I = !c.arrow && fr(o) != null && $ !== F && a.reference[b] / 2 - ($ < B ? A : D) - g[b] / 2 < 0, Y = I ? $ < B ? $ - B : $ - k : 0;
    return {
      [m]: f[m] + Y,
      data: {
        [m]: F,
        centerOffset: $ - F - Y,
        ...I && {
          alignmentOffset: Y
        }
      },
      reset: I
    };
  }
}), Wx = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var r, n;
      const {
        placement: o,
        middlewareData: a,
        rects: i,
        initialPlacement: s,
        platform: c,
        elements: l
      } = t, {
        mainAxis: u = !0,
        crossAxis: d = !0,
        fallbackPlacements: f,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: b = "none",
        flipAlignment: g = !0,
        ...p
      } = ft(e, t);
      if ((r = a.arrow) != null && r.alignmentOffset)
        return {};
      const w = ht(o), y = Je(s), x = ht(s) === s, S = await (c.isRTL == null ? void 0 : c.isRTL(l.floating)), C = f || (x || !g ? [Sn(s)] : Tx(s)), _ = b !== "none";
      !f && _ && C.push(...Nx(s, g, b, S));
      const O = [s, ...C], P = await c.detectOverflow(t, p), R = [];
      let A = ((n = a.flip) == null ? void 0 : n.overflows) || [];
      if (u && R.push(P[w]), d) {
        const $ = Mx(o, i, S);
        R.push(P[$[0]], P[$[1]]);
      }
      if (A = [...A, {
        placement: o,
        overflows: R
      }], !R.every(($) => $ <= 0)) {
        var D, B;
        const $ = (((D = a.flip) == null ? void 0 : D.index) || 0) + 1, F = O[$];
        if (F && (!(d === "alignment" ? y !== Je(F) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        A.every((q) => Je(q.placement) === y ? q.overflows[0] > 0 : !0)))
          return {
            data: {
              index: $,
              overflows: A
            },
            reset: {
              placement: F
            }
          };
        let I = (B = A.filter((Y) => Y.overflows[0] <= 0).sort((Y, q) => Y.overflows[1] - q.overflows[1])[0]) == null ? void 0 : B.placement;
        if (!I)
          switch (m) {
            case "bestFit": {
              var k;
              const Y = (k = A.filter((q) => {
                if (_) {
                  const N = Je(q.placement);
                  return N === y || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  N === "y";
                }
                return !0;
              }).map((q) => [q.placement, q.overflows.filter((N) => N > 0).reduce((N, M) => N + M, 0)]).sort((q, N) => q[1] - N[1])[0]) == null ? void 0 : k[0];
              Y && (I = Y);
              break;
            }
            case "initialPlacement":
              I = s;
              break;
          }
        if (o !== I)
          return {
            reset: {
              placement: I
            }
          };
      }
      return {};
    }
  };
};
function tu(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function ru(e) {
  return Px.some((t) => e[t] >= 0);
}
const Bx = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: r,
        platform: n
      } = t, {
        strategy: o = "referenceHidden",
        ...a
      } = ft(e, t);
      switch (o) {
        case "referenceHidden": {
          const i = await n.detectOverflow(t, {
            ...a,
            elementContext: "reference"
          }), s = tu(i, r.reference);
          return {
            data: {
              referenceHiddenOffsets: s,
              referenceHidden: ru(s)
            }
          };
        }
        case "escaped": {
          const i = await n.detectOverflow(t, {
            ...a,
            altBoundary: !0
          }), s = tu(i, r.floating);
          return {
            data: {
              escapedOffsets: s,
              escaped: ru(s)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, em = /* @__PURE__ */ new Set(["left", "top"]);
async function Lx(e, t) {
  const {
    placement: r,
    platform: n,
    elements: o
  } = e, a = await (n.isRTL == null ? void 0 : n.isRTL(o.floating)), i = ht(r), s = fr(r), c = Je(r) === "y", l = em.has(i) ? -1 : 1, u = a && c ? -1 : 1, d = ft(t, e);
  let {
    mainAxis: f,
    crossAxis: m,
    alignmentAxis: b
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return s && typeof b == "number" && (m = s === "end" ? b * -1 : b), c ? {
    x: m * u,
    y: f * l
  } : {
    x: f * l,
    y: m * u
  };
}
const jx = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var r, n;
      const {
        x: o,
        y: a,
        placement: i,
        middlewareData: s
      } = t, c = await Lx(t, e);
      return i === ((r = s.offset) == null ? void 0 : r.placement) && (n = s.arrow) != null && n.alignmentOffset ? {} : {
        x: o + c.x,
        y: a + c.y,
        data: {
          ...c,
          placement: i
        }
      };
    }
  };
}, zx = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: r,
        y: n,
        placement: o,
        platform: a
      } = t, {
        mainAxis: i = !0,
        crossAxis: s = !1,
        limiter: c = {
          fn: (w) => {
            let {
              x: y,
              y: x
            } = w;
            return {
              x: y,
              y: x
            };
          }
        },
        ...l
      } = ft(e, t), u = {
        x: r,
        y: n
      }, d = await a.detectOverflow(t, l), f = Je(ht(o)), m = Fc(f);
      let b = u[m], g = u[f];
      if (i) {
        const w = m === "y" ? "top" : "left", y = m === "y" ? "bottom" : "right", x = b + d[w], S = b - d[y];
        b = tc(x, b, S);
      }
      if (s) {
        const w = f === "y" ? "top" : "left", y = f === "y" ? "bottom" : "right", x = g + d[w], S = g - d[y];
        g = tc(x, g, S);
      }
      const p = c.fn({
        ...t,
        [m]: b,
        [f]: g
      });
      return {
        ...p,
        data: {
          x: p.x - r,
          y: p.y - n,
          enabled: {
            [m]: i,
            [f]: s
          }
        }
      };
    }
  };
}, Hx = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      const {
        x: r,
        y: n,
        placement: o,
        rects: a,
        middlewareData: i
      } = t, {
        offset: s = 0,
        mainAxis: c = !0,
        crossAxis: l = !0
      } = ft(e, t), u = {
        x: r,
        y: n
      }, d = Je(o), f = Fc(d);
      let m = u[f], b = u[d];
      const g = ft(s, t), p = typeof g == "number" ? {
        mainAxis: g,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...g
      };
      if (c) {
        const x = f === "y" ? "height" : "width", S = a.reference[f] - a.floating[x] + p.mainAxis, C = a.reference[f] + a.reference[x] - p.mainAxis;
        m < S ? m = S : m > C && (m = C);
      }
      if (l) {
        var w, y;
        const x = f === "y" ? "width" : "height", S = em.has(ht(o)), C = a.reference[d] - a.floating[x] + (S && ((w = i.offset) == null ? void 0 : w[d]) || 0) + (S ? 0 : p.crossAxis), _ = a.reference[d] + a.reference[x] + (S ? 0 : ((y = i.offset) == null ? void 0 : y[d]) || 0) - (S ? p.crossAxis : 0);
        b < C ? b = C : b > _ && (b = _);
      }
      return {
        [f]: m,
        [d]: b
      };
    }
  };
}, Yx = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      var r, n;
      const {
        placement: o,
        rects: a,
        platform: i,
        elements: s
      } = t, {
        apply: c = () => {
        },
        ...l
      } = ft(e, t), u = await i.detectOverflow(t, l), d = ht(o), f = fr(o), m = Je(o) === "y", {
        width: b,
        height: g
      } = a.floating;
      let p, w;
      d === "top" || d === "bottom" ? (p = d, w = f === (await (i.isRTL == null ? void 0 : i.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (w = d, p = f === "end" ? "top" : "bottom");
      const y = g - u.top - u.bottom, x = b - u.left - u.right, S = wt(g - u[p], y), C = wt(b - u[w], x), _ = !t.middlewareData.shift;
      let O = S, P = C;
      if ((r = t.middlewareData.shift) != null && r.enabled.x && (P = x), (n = t.middlewareData.shift) != null && n.enabled.y && (O = y), _ && !f) {
        const A = Me(u.left, 0), D = Me(u.right, 0), B = Me(u.top, 0), k = Me(u.bottom, 0);
        m ? P = b - 2 * (A !== 0 || D !== 0 ? A + D : Me(u.left, u.right)) : O = g - 2 * (B !== 0 || k !== 0 ? B + k : Me(u.top, u.bottom));
      }
      await c({
        ...t,
        availableWidth: P,
        availableHeight: O
      });
      const R = await i.getDimensions(s.floating);
      return b !== R.width || g !== R.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Gn() {
  return typeof window < "u";
}
function hr(e) {
  return tm(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Te(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function ot(e) {
  var t;
  return (t = (tm(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function tm(e) {
  return Gn() ? e instanceof Node || e instanceof Te(e).Node : !1;
}
function Ye(e) {
  return Gn() ? e instanceof Element || e instanceof Te(e).Element : !1;
}
function pt(e) {
  return Gn() ? e instanceof HTMLElement || e instanceof Te(e).HTMLElement : !1;
}
function nu(e) {
  return !Gn() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Te(e).ShadowRoot;
}
function Lr(e) {
  const {
    overflow: t,
    overflowX: r,
    overflowY: n,
    display: o
  } = Ge(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + r) && o !== "inline" && o !== "contents";
}
function Gx(e) {
  return /^(table|td|th)$/.test(hr(e));
}
function Un(e) {
  try {
    if (e.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return e.matches(":modal");
  } catch {
    return !1;
  }
}
const Ux = /transform|translate|scale|rotate|perspective|filter/, Vx = /paint|layout|strict|content/, Rt = (e) => !!e && e !== "none";
let Fo;
function Bc(e) {
  const t = Ye(e) ? Ge(e) : e;
  return Rt(t.transform) || Rt(t.translate) || Rt(t.scale) || Rt(t.rotate) || Rt(t.perspective) || !Lc() && (Rt(t.backdropFilter) || Rt(t.filter)) || Ux.test(t.willChange || "") || Vx.test(t.contain || "");
}
function Kx(e) {
  let t = xt(e);
  for (; pt(t) && !tr(t); ) {
    if (Bc(t))
      return t;
    if (Un(t))
      return null;
    t = xt(t);
  }
  return null;
}
function Lc() {
  return Fo == null && (Fo = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), Fo;
}
function tr(e) {
  return /^(html|body|#document)$/.test(hr(e));
}
function Ge(e) {
  return Te(e).getComputedStyle(e);
}
function Vn(e) {
  return Ye(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function xt(e) {
  if (hr(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    nu(e) && e.host || // Fallback.
    ot(e)
  );
  return nu(t) ? t.host : t;
}
function rm(e) {
  const t = xt(e);
  return tr(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : pt(t) && Lr(t) ? t : rm(t);
}
function Mr(e, t, r) {
  var n;
  t === void 0 && (t = []), r === void 0 && (r = !0);
  const o = rm(e), a = o === ((n = e.ownerDocument) == null ? void 0 : n.body), i = Te(o);
  if (a) {
    const s = nc(i);
    return t.concat(i, i.visualViewport || [], Lr(o) ? o : [], s && r ? Mr(s) : []);
  } else
    return t.concat(o, Mr(o, [], r));
}
function nc(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function nm(e) {
  const t = Ge(e);
  let r = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const o = pt(e), a = o ? e.offsetWidth : r, i = o ? e.offsetHeight : n, s = _n(r) !== a || _n(n) !== i;
  return s && (r = a, n = i), {
    width: r,
    height: n,
    $: s
  };
}
function jc(e) {
  return Ye(e) ? e : e.contextElement;
}
function er(e) {
  const t = jc(e);
  if (!pt(t))
    return tt(1);
  const r = t.getBoundingClientRect(), {
    width: n,
    height: o,
    $: a
  } = nm(t);
  let i = (a ? _n(r.width) : r.width) / n, s = (a ? _n(r.height) : r.height) / o;
  return (!i || !Number.isFinite(i)) && (i = 1), (!s || !Number.isFinite(s)) && (s = 1), {
    x: i,
    y: s
  };
}
const Xx = /* @__PURE__ */ tt(0);
function om(e) {
  const t = Te(e);
  return !Lc() || !t.visualViewport ? Xx : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Zx(e, t, r) {
  return t === void 0 && (t = !1), !r || t && r !== Te(e) ? !1 : t;
}
function Ft(e, t, r, n) {
  t === void 0 && (t = !1), r === void 0 && (r = !1);
  const o = e.getBoundingClientRect(), a = jc(e);
  let i = tt(1);
  t && (n ? Ye(n) && (i = er(n)) : i = er(e));
  const s = Zx(a, r, n) ? om(a) : tt(0);
  let c = (o.left + s.x) / i.x, l = (o.top + s.y) / i.y, u = o.width / i.x, d = o.height / i.y;
  if (a) {
    const f = Te(a), m = n && Ye(n) ? Te(n) : n;
    let b = f, g = nc(b);
    for (; g && n && m !== b; ) {
      const p = er(g), w = g.getBoundingClientRect(), y = Ge(g), x = w.left + (g.clientLeft + parseFloat(y.paddingLeft)) * p.x, S = w.top + (g.clientTop + parseFloat(y.paddingTop)) * p.y;
      c *= p.x, l *= p.y, u *= p.x, d *= p.y, c += x, l += S, b = Te(g), g = nc(b);
    }
  }
  return Cn({
    width: u,
    height: d,
    x: c,
    y: l
  });
}
function Kn(e, t) {
  const r = Vn(e).scrollLeft;
  return t ? t.left + r : Ft(ot(e)).left + r;
}
function am(e, t) {
  const r = e.getBoundingClientRect(), n = r.left + t.scrollLeft - Kn(e, r), o = r.top + t.scrollTop;
  return {
    x: n,
    y: o
  };
}
function Qx(e) {
  let {
    elements: t,
    rect: r,
    offsetParent: n,
    strategy: o
  } = e;
  const a = o === "fixed", i = ot(n), s = t ? Un(t.floating) : !1;
  if (n === i || s && a)
    return r;
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = tt(1);
  const u = tt(0), d = pt(n);
  if ((d || !d && !a) && ((hr(n) !== "body" || Lr(i)) && (c = Vn(n)), d)) {
    const m = Ft(n);
    l = er(n), u.x = m.x + n.clientLeft, u.y = m.y + n.clientTop;
  }
  const f = i && !d && !a ? am(i, c) : tt(0);
  return {
    width: r.width * l.x,
    height: r.height * l.y,
    x: r.x * l.x - c.scrollLeft * l.x + u.x + f.x,
    y: r.y * l.y - c.scrollTop * l.y + u.y + f.y
  };
}
function Jx(e) {
  return Array.from(e.getClientRects());
}
function e_(e) {
  const t = ot(e), r = Vn(e), n = e.ownerDocument.body, o = Me(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), a = Me(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let i = -r.scrollLeft + Kn(e);
  const s = -r.scrollTop;
  return Ge(n).direction === "rtl" && (i += Me(t.clientWidth, n.clientWidth) - o), {
    width: o,
    height: a,
    x: i,
    y: s
  };
}
const ou = 25;
function t_(e, t) {
  const r = Te(e), n = ot(e), o = r.visualViewport;
  let a = n.clientWidth, i = n.clientHeight, s = 0, c = 0;
  if (o) {
    a = o.width, i = o.height;
    const u = Lc();
    (!u || u && t === "fixed") && (s = o.offsetLeft, c = o.offsetTop);
  }
  const l = Kn(n);
  if (l <= 0) {
    const u = n.ownerDocument, d = u.body, f = getComputedStyle(d), m = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, b = Math.abs(n.clientWidth - d.clientWidth - m);
    b <= ou && (a -= b);
  } else l <= ou && (a += l);
  return {
    width: a,
    height: i,
    x: s,
    y: c
  };
}
function r_(e, t) {
  const r = Ft(e, !0, t === "fixed"), n = r.top + e.clientTop, o = r.left + e.clientLeft, a = pt(e) ? er(e) : tt(1), i = e.clientWidth * a.x, s = e.clientHeight * a.y, c = o * a.x, l = n * a.y;
  return {
    width: i,
    height: s,
    x: c,
    y: l
  };
}
function au(e, t, r) {
  let n;
  if (t === "viewport")
    n = t_(e, r);
  else if (t === "document")
    n = e_(ot(e));
  else if (Ye(t))
    n = r_(t, r);
  else {
    const o = om(e);
    n = {
      x: t.x - o.x,
      y: t.y - o.y,
      width: t.width,
      height: t.height
    };
  }
  return Cn(n);
}
function im(e, t) {
  const r = xt(e);
  return r === t || !Ye(r) || tr(r) ? !1 : Ge(r).position === "fixed" || im(r, t);
}
function n_(e, t) {
  const r = t.get(e);
  if (r)
    return r;
  let n = Mr(e, [], !1).filter((s) => Ye(s) && hr(s) !== "body"), o = null;
  const a = Ge(e).position === "fixed";
  let i = a ? xt(e) : e;
  for (; Ye(i) && !tr(i); ) {
    const s = Ge(i), c = Bc(i);
    !c && s.position === "fixed" && (o = null), (a ? !c && !o : !c && s.position === "static" && !!o && (o.position === "absolute" || o.position === "fixed") || Lr(i) && !c && im(e, i)) ? n = n.filter((u) => u !== i) : o = s, i = xt(i);
  }
  return t.set(e, n), n;
}
function o_(e) {
  let {
    element: t,
    boundary: r,
    rootBoundary: n,
    strategy: o
  } = e;
  const i = [...r === "clippingAncestors" ? Un(t) ? [] : n_(t, this._c) : [].concat(r), n], s = au(t, i[0], o);
  let c = s.top, l = s.right, u = s.bottom, d = s.left;
  for (let f = 1; f < i.length; f++) {
    const m = au(t, i[f], o);
    c = Me(m.top, c), l = wt(m.right, l), u = wt(m.bottom, u), d = Me(m.left, d);
  }
  return {
    width: l - d,
    height: u - c,
    x: d,
    y: c
  };
}
function a_(e) {
  const {
    width: t,
    height: r
  } = nm(e);
  return {
    width: t,
    height: r
  };
}
function i_(e, t, r) {
  const n = pt(t), o = ot(t), a = r === "fixed", i = Ft(e, !0, a, t);
  let s = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const c = tt(0);
  function l() {
    c.x = Kn(o);
  }
  if (n || !n && !a)
    if ((hr(t) !== "body" || Lr(o)) && (s = Vn(t)), n) {
      const m = Ft(t, !0, a, t);
      c.x = m.x + t.clientLeft, c.y = m.y + t.clientTop;
    } else o && l();
  a && !n && o && l();
  const u = o && !n && !a ? am(o, s) : tt(0), d = i.left + s.scrollLeft - c.x - u.x, f = i.top + s.scrollTop - c.y - u.y;
  return {
    x: d,
    y: f,
    width: i.width,
    height: i.height
  };
}
function qo(e) {
  return Ge(e).position === "static";
}
function iu(e, t) {
  if (!pt(e) || Ge(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let r = e.offsetParent;
  return ot(e) === r && (r = r.ownerDocument.body), r;
}
function sm(e, t) {
  const r = Te(e);
  if (Un(e))
    return r;
  if (!pt(e)) {
    let o = xt(e);
    for (; o && !tr(o); ) {
      if (Ye(o) && !qo(o))
        return o;
      o = xt(o);
    }
    return r;
  }
  let n = iu(e, t);
  for (; n && Gx(n) && qo(n); )
    n = iu(n, t);
  return n && tr(n) && qo(n) && !Bc(n) ? r : n || Kx(e) || r;
}
const s_ = async function(e) {
  const t = this.getOffsetParent || sm, r = this.getDimensions, n = await r(e.floating);
  return {
    reference: i_(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function c_(e) {
  return Ge(e).direction === "rtl";
}
const l_ = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Qx,
  getDocumentElement: ot,
  getClippingRect: o_,
  getOffsetParent: sm,
  getElementRects: s_,
  getClientRects: Jx,
  getDimensions: a_,
  getScale: er,
  isElement: Ye,
  isRTL: c_
};
function cm(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function u_(e, t) {
  let r = null, n;
  const o = ot(e);
  function a() {
    var s;
    clearTimeout(n), (s = r) == null || s.disconnect(), r = null;
  }
  function i(s, c) {
    s === void 0 && (s = !1), c === void 0 && (c = 1), a();
    const l = e.getBoundingClientRect(), {
      left: u,
      top: d,
      width: f,
      height: m
    } = l;
    if (s || t(), !f || !m)
      return;
    const b = ln(d), g = ln(o.clientWidth - (u + f)), p = ln(o.clientHeight - (d + m)), w = ln(u), x = {
      rootMargin: -b + "px " + -g + "px " + -p + "px " + -w + "px",
      threshold: Me(0, wt(1, c)) || 1
    };
    let S = !0;
    function C(_) {
      const O = _[0].intersectionRatio;
      if (O !== c) {
        if (!S)
          return i();
        O ? i(!1, O) : n = setTimeout(() => {
          i(!1, 1e-7);
        }, 1e3);
      }
      O === 1 && !cm(l, e.getBoundingClientRect()) && i(), S = !1;
    }
    try {
      r = new IntersectionObserver(C, {
        ...x,
        // Handle <iframe>s
        root: o.ownerDocument
      });
    } catch {
      r = new IntersectionObserver(C, x);
    }
    r.observe(e);
  }
  return i(!0), a;
}
function d_(e, t, r, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: a = !0,
    elementResize: i = typeof ResizeObserver == "function",
    layoutShift: s = typeof IntersectionObserver == "function",
    animationFrame: c = !1
  } = n, l = jc(e), u = o || a ? [...l ? Mr(l) : [], ...t ? Mr(t) : []] : [];
  u.forEach((w) => {
    o && w.addEventListener("scroll", r, {
      passive: !0
    }), a && w.addEventListener("resize", r);
  });
  const d = l && s ? u_(l, r) : null;
  let f = -1, m = null;
  i && (m = new ResizeObserver((w) => {
    let [y] = w;
    y && y.target === l && m && t && (m.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var x;
      (x = m) == null || x.observe(t);
    })), r();
  }), l && !c && m.observe(l), t && m.observe(t));
  let b, g = c ? Ft(e) : null;
  c && p();
  function p() {
    const w = Ft(e);
    g && !cm(g, w) && r(), g = w, b = requestAnimationFrame(p);
  }
  return r(), () => {
    var w;
    u.forEach((y) => {
      o && y.removeEventListener("scroll", r), a && y.removeEventListener("resize", r);
    }), d == null || d(), (w = m) == null || w.disconnect(), m = null, c && cancelAnimationFrame(b);
  };
}
const f_ = jx, h_ = zx, p_ = Wx, m_ = Yx, g_ = Bx, su = qx, v_ = Hx, b_ = (e, t, r) => {
  const n = /* @__PURE__ */ new Map(), o = {
    platform: l_,
    ...r
  }, a = {
    ...o.platform,
    _c: n
  };
  return Fx(e, t, {
    ...o,
    platform: a
  });
};
var y_ = typeof document < "u", w_ = function() {
}, yn = y_ ? np : w_;
function On(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let r, n, o;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (r = e.length, r !== t.length) return !1;
      for (n = r; n-- !== 0; )
        if (!On(e[n], t[n]))
          return !1;
      return !0;
    }
    if (o = Object.keys(e), r = o.length, r !== Object.keys(t).length)
      return !1;
    for (n = r; n-- !== 0; )
      if (!{}.hasOwnProperty.call(t, o[n]))
        return !1;
    for (n = r; n-- !== 0; ) {
      const a = o[n];
      if (!(a === "_owner" && e.$$typeof) && !On(e[a], t[a]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function lm(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function cu(e, t) {
  const r = lm(e);
  return Math.round(t * r) / r;
}
function Wo(e) {
  const t = h.useRef(e);
  return yn(() => {
    t.current = e;
  }), t;
}
function x_(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: r = "absolute",
    middleware: n = [],
    platform: o,
    elements: {
      reference: a,
      floating: i
    } = {},
    transform: s = !0,
    whileElementsMounted: c,
    open: l
  } = e, [u, d] = h.useState({
    x: 0,
    y: 0,
    strategy: r,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [f, m] = h.useState(n);
  On(f, n) || m(n);
  const [b, g] = h.useState(null), [p, w] = h.useState(null), y = h.useCallback((q) => {
    q !== _.current && (_.current = q, g(q));
  }, []), x = h.useCallback((q) => {
    q !== O.current && (O.current = q, w(q));
  }, []), S = a || b, C = i || p, _ = h.useRef(null), O = h.useRef(null), P = h.useRef(u), R = c != null, A = Wo(c), D = Wo(o), B = Wo(l), k = h.useCallback(() => {
    if (!_.current || !O.current)
      return;
    const q = {
      placement: t,
      strategy: r,
      middleware: f
    };
    D.current && (q.platform = D.current), b_(_.current, O.current, q).then((N) => {
      const M = {
        ...N,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: B.current !== !1
      };
      $.current && !On(P.current, M) && (P.current = M, Wn.flushSync(() => {
        d(M);
      }));
    });
  }, [f, t, r, D, B]);
  yn(() => {
    l === !1 && P.current.isPositioned && (P.current.isPositioned = !1, d((q) => ({
      ...q,
      isPositioned: !1
    })));
  }, [l]);
  const $ = h.useRef(!1);
  yn(() => ($.current = !0, () => {
    $.current = !1;
  }), []), yn(() => {
    if (S && (_.current = S), C && (O.current = C), S && C) {
      if (A.current)
        return A.current(S, C, k);
      k();
    }
  }, [S, C, k, A, R]);
  const F = h.useMemo(() => ({
    reference: _,
    floating: O,
    setReference: y,
    setFloating: x
  }), [y, x]), I = h.useMemo(() => ({
    reference: S,
    floating: C
  }), [S, C]), Y = h.useMemo(() => {
    const q = {
      position: r,
      left: 0,
      top: 0
    };
    if (!I.floating)
      return q;
    const N = cu(I.floating, u.x), M = cu(I.floating, u.y);
    return s ? {
      ...q,
      transform: "translate(" + N + "px, " + M + "px)",
      ...lm(I.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: r,
      left: N,
      top: M
    };
  }, [r, s, I.floating, u.x, u.y]);
  return h.useMemo(() => ({
    ...u,
    update: k,
    refs: F,
    elements: I,
    floatingStyles: Y
  }), [u, k, F, I, Y]);
}
const __ = (e) => {
  function t(r) {
    return {}.hasOwnProperty.call(r, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(r) {
      const {
        element: n,
        padding: o
      } = typeof e == "function" ? e(r) : e;
      return n && t(n) ? n.current != null ? su({
        element: n.current,
        padding: o
      }).fn(r) : {} : n ? su({
        element: n,
        padding: o
      }).fn(r) : {};
    }
  };
}, S_ = (e, t) => {
  const r = f_(e);
  return {
    name: r.name,
    fn: r.fn,
    options: [e, t]
  };
}, C_ = (e, t) => {
  const r = h_(e);
  return {
    name: r.name,
    fn: r.fn,
    options: [e, t]
  };
}, O_ = (e, t) => ({
  fn: v_(e).fn,
  options: [e, t]
}), P_ = (e, t) => {
  const r = p_(e);
  return {
    name: r.name,
    fn: r.fn,
    options: [e, t]
  };
}, E_ = (e, t) => {
  const r = m_(e);
  return {
    name: r.name,
    fn: r.fn,
    options: [e, t]
  };
}, M_ = (e, t) => {
  const r = g_(e);
  return {
    name: r.name,
    fn: r.fn,
    options: [e, t]
  };
}, T_ = (e, t) => {
  const r = __(e);
  return {
    name: r.name,
    fn: r.fn,
    options: [e, t]
  };
};
var R_ = "Arrow", um = h.forwardRef((e, t) => {
  const { children: r, width: n = 10, height: o = 5, ...a } = e;
  return /* @__PURE__ */ v(
    K.svg,
    {
      ...a,
      ref: t,
      width: n,
      height: o,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? r : /* @__PURE__ */ v("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
um.displayName = R_;
var D_ = um, zc = "Popper", [dm, _t] = Be(zc), [k_, fm] = dm(zc), hm = (e) => {
  const { __scopePopper: t, children: r } = e, [n, o] = h.useState(null);
  return /* @__PURE__ */ v(k_, { scope: t, anchor: n, onAnchorChange: o, children: r });
};
hm.displayName = zc;
var pm = "PopperAnchor", mm = h.forwardRef(
  (e, t) => {
    const { __scopePopper: r, virtualRef: n, ...o } = e, a = fm(pm, r), i = h.useRef(null), s = ie(t, i), c = h.useRef(null);
    return h.useEffect(() => {
      const l = c.current;
      c.current = (n == null ? void 0 : n.current) || i.current, l !== c.current && a.onAnchorChange(c.current);
    }), n ? null : /* @__PURE__ */ v(K.div, { ...o, ref: s });
  }
);
mm.displayName = pm;
var Hc = "PopperContent", [N_, A_] = dm(Hc), gm = h.forwardRef(
  (e, t) => {
    var z, re, U, Q, ee, te;
    const {
      __scopePopper: r,
      side: n = "bottom",
      sideOffset: o = 0,
      align: a = "center",
      alignOffset: i = 0,
      arrowPadding: s = 0,
      avoidCollisions: c = !0,
      collisionBoundary: l = [],
      collisionPadding: u = 0,
      sticky: d = "partial",
      hideWhenDetached: f = !1,
      updatePositionStrategy: m = "optimized",
      onPlaced: b,
      ...g
    } = e, p = fm(Hc, r), [w, y] = h.useState(null), x = ie(t, (be) => y(be)), [S, C] = h.useState(null), _ = Qp(S), O = (_ == null ? void 0 : _.width) ?? 0, P = (_ == null ? void 0 : _.height) ?? 0, R = n + (a !== "center" ? "-" + a : ""), A = typeof u == "number" ? u : { top: 0, right: 0, bottom: 0, left: 0, ...u }, D = Array.isArray(l) ? l : [l], B = D.length > 0, k = {
      padding: A,
      boundary: D.filter($_),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: B
    }, { refs: $, floatingStyles: F, placement: I, isPositioned: Y, middlewareData: q } = x_({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: R,
      whileElementsMounted: (...be) => d_(...be, {
        animationFrame: m === "always"
      }),
      elements: {
        reference: p.anchor
      },
      middleware: [
        S_({ mainAxis: o + P, alignmentAxis: i }),
        c && C_({
          mainAxis: !0,
          crossAxis: !1,
          limiter: d === "partial" ? O_() : void 0,
          ...k
        }),
        c && P_({ ...k }),
        E_({
          ...k,
          apply: ({ elements: be, rects: L, availableWidth: ke, availableHeight: Ne }) => {
            const { width: Xe, height: So } = L.reference, Yt = be.floating.style;
            Yt.setProperty("--radix-popper-available-width", `${ke}px`), Yt.setProperty("--radix-popper-available-height", `${Ne}px`), Yt.setProperty("--radix-popper-anchor-width", `${Xe}px`), Yt.setProperty("--radix-popper-anchor-height", `${So}px`);
          }
        }),
        S && T_({ element: S, padding: s }),
        F_({ arrowWidth: O, arrowHeight: P }),
        f && M_({ strategy: "referenceHidden", ...k })
      ]
    }), [N, M] = ym(I), X = We(b);
    xe(() => {
      Y && (X == null || X());
    }, [Y, X]);
    const le = (z = q.arrow) == null ? void 0 : z.x, me = (re = q.arrow) == null ? void 0 : re.y, ge = ((U = q.arrow) == null ? void 0 : U.centerOffset) !== 0, [se, ne] = h.useState();
    return xe(() => {
      w && ne(window.getComputedStyle(w).zIndex);
    }, [w]), /* @__PURE__ */ v(
      "div",
      {
        ref: $.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...F,
          transform: Y ? F.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: se,
          "--radix-popper-transform-origin": [
            (Q = q.transformOrigin) == null ? void 0 : Q.x,
            (ee = q.transformOrigin) == null ? void 0 : ee.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((te = q.hide) == null ? void 0 : te.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ v(
          N_,
          {
            scope: r,
            placedSide: N,
            onArrowChange: C,
            arrowX: le,
            arrowY: me,
            shouldHideArrow: ge,
            children: /* @__PURE__ */ v(
              K.div,
              {
                "data-side": N,
                "data-align": M,
                ...g,
                ref: x,
                style: {
                  ...g.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: Y ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
gm.displayName = Hc;
var vm = "PopperArrow", I_ = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, bm = h.forwardRef(function(t, r) {
  const { __scopePopper: n, ...o } = t, a = A_(vm, n), i = I_[a.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ v(
      "span",
      {
        ref: a.onArrowChange,
        style: {
          position: "absolute",
          left: a.arrowX,
          top: a.arrowY,
          [i]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[a.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[a.placedSide],
          visibility: a.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ v(
          D_,
          {
            ...o,
            ref: r,
            style: {
              ...o.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
bm.displayName = vm;
function $_(e) {
  return e !== null;
}
var F_ = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var p, w, y;
    const { placement: r, rects: n, middlewareData: o } = t, i = ((p = o.arrow) == null ? void 0 : p.centerOffset) !== 0, s = i ? 0 : e.arrowWidth, c = i ? 0 : e.arrowHeight, [l, u] = ym(r), d = { start: "0%", center: "50%", end: "100%" }[u], f = (((w = o.arrow) == null ? void 0 : w.x) ?? 0) + s / 2, m = (((y = o.arrow) == null ? void 0 : y.y) ?? 0) + c / 2;
    let b = "", g = "";
    return l === "bottom" ? (b = i ? d : `${f}px`, g = `${-c}px`) : l === "top" ? (b = i ? d : `${f}px`, g = `${n.floating.height + c}px`) : l === "right" ? (b = `${-c}px`, g = i ? d : `${m}px`) : l === "left" && (b = `${n.floating.width + c}px`, g = i ? d : `${m}px`), { data: { x: b, y: g } };
  }
});
function ym(e) {
  const [t, r = "center"] = e.split("-");
  return [t, r];
}
var jr = hm, zr = mm, Xn = gm, Zn = bm, Bo = "rovingFocusGroup.onEntryFocus", q_ = { bubbles: !1, cancelable: !0 }, Hr = "RovingFocusGroup", [oc, wm, W_] = Dc(Hr), [B_, Qn] = Be(
  Hr,
  [W_]
), [L_, j_] = B_(Hr), xm = h.forwardRef(
  (e, t) => /* @__PURE__ */ v(oc.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ v(oc.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ v(z_, { ...e, ref: t }) }) })
);
xm.displayName = Hr;
var z_ = h.forwardRef((e, t) => {
  const {
    __scopeRovingFocusGroup: r,
    orientation: n,
    loop: o = !1,
    dir: a,
    currentTabStopId: i,
    defaultCurrentTabStopId: s,
    onCurrentTabStopIdChange: c,
    onEntryFocus: l,
    preventScrollOnEntryFocus: u = !1,
    ...d
  } = e, f = h.useRef(null), m = ie(t, f), b = Ln(a), [g, p] = rt({
    prop: i,
    defaultProp: s ?? null,
    onChange: c,
    caller: Hr
  }), [w, y] = h.useState(!1), x = We(l), S = wm(r), C = h.useRef(!1), [_, O] = h.useState(0);
  return h.useEffect(() => {
    const P = f.current;
    if (P)
      return P.addEventListener(Bo, x), () => P.removeEventListener(Bo, x);
  }, [x]), /* @__PURE__ */ v(
    L_,
    {
      scope: r,
      orientation: n,
      dir: b,
      loop: o,
      currentTabStopId: g,
      onItemFocus: h.useCallback(
        (P) => p(P),
        [p]
      ),
      onItemShiftTab: h.useCallback(() => y(!0), []),
      onFocusableItemAdd: h.useCallback(
        () => O((P) => P + 1),
        []
      ),
      onFocusableItemRemove: h.useCallback(
        () => O((P) => P - 1),
        []
      ),
      children: /* @__PURE__ */ v(
        K.div,
        {
          tabIndex: w || _ === 0 ? -1 : 0,
          "data-orientation": n,
          ...d,
          ref: m,
          style: { outline: "none", ...e.style },
          onMouseDown: W(e.onMouseDown, () => {
            C.current = !0;
          }),
          onFocus: W(e.onFocus, (P) => {
            const R = !C.current;
            if (P.target === P.currentTarget && R && !w) {
              const A = new CustomEvent(Bo, q_);
              if (P.currentTarget.dispatchEvent(A), !A.defaultPrevented) {
                const D = S().filter((I) => I.focusable), B = D.find((I) => I.active), k = D.find((I) => I.id === g), F = [B, k, ...D].filter(
                  Boolean
                ).map((I) => I.ref.current);
                Cm(F, u);
              }
            }
            C.current = !1;
          }),
          onBlur: W(e.onBlur, () => y(!1))
        }
      )
    }
  );
}), _m = "RovingFocusGroupItem", Sm = h.forwardRef(
  (e, t) => {
    const {
      __scopeRovingFocusGroup: r,
      focusable: n = !0,
      active: o = !1,
      tabStopId: a,
      children: i,
      ...s
    } = e, c = Ce(), l = a || c, u = j_(_m, r), d = u.currentTabStopId === l, f = wm(r), { onFocusableItemAdd: m, onFocusableItemRemove: b, currentTabStopId: g } = u;
    return h.useEffect(() => {
      if (n)
        return m(), () => b();
    }, [n, m, b]), /* @__PURE__ */ v(
      oc.ItemSlot,
      {
        scope: r,
        id: l,
        focusable: n,
        active: o,
        children: /* @__PURE__ */ v(
          K.span,
          {
            tabIndex: d ? 0 : -1,
            "data-orientation": u.orientation,
            ...s,
            ref: t,
            onMouseDown: W(e.onMouseDown, (p) => {
              n ? u.onItemFocus(l) : p.preventDefault();
            }),
            onFocus: W(e.onFocus, () => u.onItemFocus(l)),
            onKeyDown: W(e.onKeyDown, (p) => {
              if (p.key === "Tab" && p.shiftKey) {
                u.onItemShiftTab();
                return;
              }
              if (p.target !== p.currentTarget) return;
              const w = G_(p, u.orientation, u.dir);
              if (w !== void 0) {
                if (p.metaKey || p.ctrlKey || p.altKey || p.shiftKey) return;
                p.preventDefault();
                let x = f().filter((S) => S.focusable).map((S) => S.ref.current);
                if (w === "last") x.reverse();
                else if (w === "prev" || w === "next") {
                  w === "prev" && x.reverse();
                  const S = x.indexOf(p.currentTarget);
                  x = u.loop ? U_(x, S + 1) : x.slice(S + 1);
                }
                setTimeout(() => Cm(x));
              }
            }),
            children: typeof i == "function" ? i({ isCurrentTabStop: d, hasTabStop: g != null }) : i
          }
        )
      }
    );
  }
);
Sm.displayName = _m;
var H_ = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Y_(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function G_(e, t, r) {
  const n = Y_(e.key, r);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(n)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(n)))
    return H_[n];
}
function Cm(e, t = !1) {
  const r = document.activeElement;
  for (const n of e)
    if (n === r || (n.focus({ preventScroll: t }), document.activeElement !== r)) return;
}
function U_(e, t) {
  return e.map((r, n) => e[(t + n) % e.length]);
}
var Om = xm, Pm = Sm, ac = ["Enter", " "], V_ = ["ArrowDown", "PageUp", "Home"], Em = ["ArrowUp", "PageDown", "End"], K_ = [...V_, ...Em], X_ = {
  ltr: [...ac, "ArrowRight"],
  rtl: [...ac, "ArrowLeft"]
}, Z_ = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
}, Yr = "Menu", [Tr, Q_, J_] = Dc(Yr), [Bt, Mm] = Be(Yr, [
  J_,
  _t,
  Qn
]), Gr = _t(), Tm = Qn(), [Rm, St] = Bt(Yr), [eS, Ur] = Bt(Yr), Dm = (e) => {
  const { __scopeMenu: t, open: r = !1, children: n, dir: o, onOpenChange: a, modal: i = !0 } = e, s = Gr(t), [c, l] = h.useState(null), u = h.useRef(!1), d = We(a), f = Ln(o);
  return h.useEffect(() => {
    const m = () => {
      u.current = !0, document.addEventListener("pointerdown", b, { capture: !0, once: !0 }), document.addEventListener("pointermove", b, { capture: !0, once: !0 });
    }, b = () => u.current = !1;
    return document.addEventListener("keydown", m, { capture: !0 }), () => {
      document.removeEventListener("keydown", m, { capture: !0 }), document.removeEventListener("pointerdown", b, { capture: !0 }), document.removeEventListener("pointermove", b, { capture: !0 });
    };
  }, []), /* @__PURE__ */ v(jr, { ...s, children: /* @__PURE__ */ v(
    Rm,
    {
      scope: t,
      open: r,
      onOpenChange: d,
      content: c,
      onContentChange: l,
      children: /* @__PURE__ */ v(
        eS,
        {
          scope: t,
          onClose: h.useCallback(() => d(!1), [d]),
          isUsingKeyboardRef: u,
          dir: f,
          modal: i,
          children: n
        }
      )
    }
  ) });
};
Dm.displayName = Yr;
var tS = "MenuAnchor", Yc = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, ...n } = e, o = Gr(r);
    return /* @__PURE__ */ v(zr, { ...o, ...n, ref: t });
  }
);
Yc.displayName = tS;
var Gc = "MenuPortal", [rS, km] = Bt(Gc, {
  forceMount: void 0
}), Nm = (e) => {
  const { __scopeMenu: t, forceMount: r, children: n, container: o } = e, a = St(Gc, t);
  return /* @__PURE__ */ v(rS, { scope: t, forceMount: r, children: /* @__PURE__ */ v(De, { present: r || a.open, children: /* @__PURE__ */ v(dr, { asChild: !0, container: o, children: n }) }) });
};
Nm.displayName = Gc;
var qe = "MenuContent", [nS, Uc] = Bt(qe), Am = h.forwardRef(
  (e, t) => {
    const r = km(qe, e.__scopeMenu), { forceMount: n = r.forceMount, ...o } = e, a = St(qe, e.__scopeMenu), i = Ur(qe, e.__scopeMenu);
    return /* @__PURE__ */ v(Tr.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ v(De, { present: n || a.open, children: /* @__PURE__ */ v(Tr.Slot, { scope: e.__scopeMenu, children: i.modal ? /* @__PURE__ */ v(oS, { ...o, ref: t }) : /* @__PURE__ */ v(aS, { ...o, ref: t }) }) }) });
  }
), oS = h.forwardRef(
  (e, t) => {
    const r = St(qe, e.__scopeMenu), n = h.useRef(null), o = ie(t, n);
    return h.useEffect(() => {
      const a = n.current;
      if (a) return Hn(a);
    }, []), /* @__PURE__ */ v(
      Vc,
      {
        ...e,
        ref: o,
        trapFocus: r.open,
        disableOutsidePointerEvents: r.open,
        disableOutsideScroll: !0,
        onFocusOutside: W(
          e.onFocusOutside,
          (a) => a.preventDefault(),
          { checkForDefaultPrevented: !1 }
        ),
        onDismiss: () => r.onOpenChange(!1)
      }
    );
  }
), aS = h.forwardRef((e, t) => {
  const r = St(qe, e.__scopeMenu);
  return /* @__PURE__ */ v(
    Vc,
    {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => r.onOpenChange(!1)
    }
  );
}), iS = /* @__PURE__ */ yt("MenuContent.ScrollLock"), Vc = h.forwardRef(
  (e, t) => {
    const {
      __scopeMenu: r,
      loop: n = !1,
      trapFocus: o,
      onOpenAutoFocus: a,
      onCloseAutoFocus: i,
      disableOutsidePointerEvents: s,
      onEntryFocus: c,
      onEscapeKeyDown: l,
      onPointerDownOutside: u,
      onFocusOutside: d,
      onInteractOutside: f,
      onDismiss: m,
      disableOutsideScroll: b,
      ...g
    } = e, p = St(qe, r), w = Ur(qe, r), y = Gr(r), x = Tm(r), S = Q_(r), [C, _] = h.useState(null), O = h.useRef(null), P = ie(t, O, p.onContentChange), R = h.useRef(0), A = h.useRef(""), D = h.useRef(0), B = h.useRef(null), k = h.useRef("right"), $ = h.useRef(0), F = b ? Br : h.Fragment, I = b ? { as: iS, allowPinchZoom: !0 } : void 0, Y = (N) => {
      var z, re;
      const M = A.current + N, X = S().filter((U) => !U.disabled), le = document.activeElement, me = (z = X.find((U) => U.ref.current === le)) == null ? void 0 : z.textValue, ge = X.map((U) => U.textValue), se = bS(ge, M, me), ne = (re = X.find((U) => U.textValue === se)) == null ? void 0 : re.ref.current;
      (function U(Q) {
        A.current = Q, window.clearTimeout(R.current), Q !== "" && (R.current = window.setTimeout(() => U(""), 1e3));
      })(M), ne && setTimeout(() => ne.focus());
    };
    h.useEffect(() => () => window.clearTimeout(R.current), []), jn();
    const q = h.useCallback((N) => {
      var X, le;
      return k.current === ((X = B.current) == null ? void 0 : X.side) && wS(N, (le = B.current) == null ? void 0 : le.area);
    }, []);
    return /* @__PURE__ */ v(
      nS,
      {
        scope: r,
        searchRef: A,
        onItemEnter: h.useCallback(
          (N) => {
            q(N) && N.preventDefault();
          },
          [q]
        ),
        onItemLeave: h.useCallback(
          (N) => {
            var M;
            q(N) || ((M = O.current) == null || M.focus(), _(null));
          },
          [q]
        ),
        onTriggerLeave: h.useCallback(
          (N) => {
            q(N) && N.preventDefault();
          },
          [q]
        ),
        pointerGraceTimerRef: D,
        onPointerGraceIntentChange: h.useCallback((N) => {
          B.current = N;
        }, []),
        children: /* @__PURE__ */ v(F, { ...I, children: /* @__PURE__ */ v(
          Wr,
          {
            asChild: !0,
            trapped: o,
            onMountAutoFocus: W(a, (N) => {
              var M;
              N.preventDefault(), (M = O.current) == null || M.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: i,
            children: /* @__PURE__ */ v(
              ur,
              {
                asChild: !0,
                disableOutsidePointerEvents: s,
                onEscapeKeyDown: l,
                onPointerDownOutside: u,
                onFocusOutside: d,
                onInteractOutside: f,
                onDismiss: m,
                children: /* @__PURE__ */ v(
                  Om,
                  {
                    asChild: !0,
                    ...x,
                    dir: w.dir,
                    orientation: "vertical",
                    loop: n,
                    currentTabStopId: C,
                    onCurrentTabStopIdChange: _,
                    onEntryFocus: W(c, (N) => {
                      w.isUsingKeyboardRef.current || N.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ v(
                      Xn,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": Zm(p.open),
                        "data-radix-menu-content": "",
                        dir: w.dir,
                        ...y,
                        ...g,
                        ref: P,
                        style: { outline: "none", ...g.style },
                        onKeyDown: W(g.onKeyDown, (N) => {
                          const X = N.target.closest("[data-radix-menu-content]") === N.currentTarget, le = N.ctrlKey || N.altKey || N.metaKey, me = N.key.length === 1;
                          X && (N.key === "Tab" && N.preventDefault(), !le && me && Y(N.key));
                          const ge = O.current;
                          if (N.target !== ge || !K_.includes(N.key)) return;
                          N.preventDefault();
                          const ne = S().filter((z) => !z.disabled).map((z) => z.ref.current);
                          Em.includes(N.key) && ne.reverse(), gS(ne);
                        }),
                        onBlur: W(e.onBlur, (N) => {
                          N.currentTarget.contains(N.target) || (window.clearTimeout(R.current), A.current = "");
                        }),
                        onPointerMove: W(
                          e.onPointerMove,
                          Rr((N) => {
                            const M = N.target, X = $.current !== N.clientX;
                            if (N.currentTarget.contains(M) && X) {
                              const le = N.clientX > $.current ? "right" : "left";
                              k.current = le, $.current = N.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
Am.displayName = qe;
var sS = "MenuGroup", Kc = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, ...n } = e;
    return /* @__PURE__ */ v(K.div, { role: "group", ...n, ref: t });
  }
);
Kc.displayName = sS;
var cS = "MenuLabel", Im = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, ...n } = e;
    return /* @__PURE__ */ v(K.div, { ...n, ref: t });
  }
);
Im.displayName = cS;
var Pn = "MenuItem", lu = "menu.itemSelect", Jn = h.forwardRef(
  (e, t) => {
    const { disabled: r = !1, onSelect: n, ...o } = e, a = h.useRef(null), i = Ur(Pn, e.__scopeMenu), s = Uc(Pn, e.__scopeMenu), c = ie(t, a), l = h.useRef(!1), u = () => {
      const d = a.current;
      if (!r && d) {
        const f = new CustomEvent(lu, { bubbles: !0, cancelable: !0 });
        d.addEventListener(lu, (m) => n == null ? void 0 : n(m), { once: !0 }), cp(d, f), f.defaultPrevented ? l.current = !1 : i.onClose();
      }
    };
    return /* @__PURE__ */ v(
      $m,
      {
        ...o,
        ref: c,
        disabled: r,
        onClick: W(e.onClick, u),
        onPointerDown: (d) => {
          var f;
          (f = e.onPointerDown) == null || f.call(e, d), l.current = !0;
        },
        onPointerUp: W(e.onPointerUp, (d) => {
          var f;
          l.current || (f = d.currentTarget) == null || f.click();
        }),
        onKeyDown: W(e.onKeyDown, (d) => {
          const f = s.searchRef.current !== "";
          r || f && d.key === " " || ac.includes(d.key) && (d.currentTarget.click(), d.preventDefault());
        })
      }
    );
  }
);
Jn.displayName = Pn;
var $m = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, disabled: n = !1, textValue: o, ...a } = e, i = Uc(Pn, r), s = Tm(r), c = h.useRef(null), l = ie(t, c), [u, d] = h.useState(!1), [f, m] = h.useState("");
    return h.useEffect(() => {
      const b = c.current;
      b && m((b.textContent ?? "").trim());
    }, [a.children]), /* @__PURE__ */ v(
      Tr.ItemSlot,
      {
        scope: r,
        disabled: n,
        textValue: o ?? f,
        children: /* @__PURE__ */ v(Pm, { asChild: !0, ...s, focusable: !n, children: /* @__PURE__ */ v(
          K.div,
          {
            role: "menuitem",
            "data-highlighted": u ? "" : void 0,
            "aria-disabled": n || void 0,
            "data-disabled": n ? "" : void 0,
            ...a,
            ref: l,
            onPointerMove: W(
              e.onPointerMove,
              Rr((b) => {
                n ? i.onItemLeave(b) : (i.onItemEnter(b), b.defaultPrevented || b.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: W(
              e.onPointerLeave,
              Rr((b) => i.onItemLeave(b))
            ),
            onFocus: W(e.onFocus, () => d(!0)),
            onBlur: W(e.onBlur, () => d(!1))
          }
        ) })
      }
    );
  }
), lS = "MenuCheckboxItem", Fm = h.forwardRef(
  (e, t) => {
    const { checked: r = !1, onCheckedChange: n, ...o } = e;
    return /* @__PURE__ */ v(jm, { scope: e.__scopeMenu, checked: r, children: /* @__PURE__ */ v(
      Jn,
      {
        role: "menuitemcheckbox",
        "aria-checked": En(r) ? "mixed" : r,
        ...o,
        ref: t,
        "data-state": Qc(r),
        onSelect: W(
          o.onSelect,
          () => n == null ? void 0 : n(En(r) ? !0 : !r),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
Fm.displayName = lS;
var qm = "MenuRadioGroup", [uS, dS] = Bt(
  qm,
  { value: void 0, onValueChange: () => {
  } }
), Wm = h.forwardRef(
  (e, t) => {
    const { value: r, onValueChange: n, ...o } = e, a = We(n);
    return /* @__PURE__ */ v(uS, { scope: e.__scopeMenu, value: r, onValueChange: a, children: /* @__PURE__ */ v(Kc, { ...o, ref: t }) });
  }
);
Wm.displayName = qm;
var Bm = "MenuRadioItem", Lm = h.forwardRef(
  (e, t) => {
    const { value: r, ...n } = e, o = dS(Bm, e.__scopeMenu), a = r === o.value;
    return /* @__PURE__ */ v(jm, { scope: e.__scopeMenu, checked: a, children: /* @__PURE__ */ v(
      Jn,
      {
        role: "menuitemradio",
        "aria-checked": a,
        ...n,
        ref: t,
        "data-state": Qc(a),
        onSelect: W(
          n.onSelect,
          () => {
            var i;
            return (i = o.onValueChange) == null ? void 0 : i.call(o, r);
          },
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
Lm.displayName = Bm;
var Xc = "MenuItemIndicator", [jm, fS] = Bt(
  Xc,
  { checked: !1 }
), zm = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, forceMount: n, ...o } = e, a = fS(Xc, r);
    return /* @__PURE__ */ v(
      De,
      {
        present: n || En(a.checked) || a.checked === !0,
        children: /* @__PURE__ */ v(
          K.span,
          {
            ...o,
            ref: t,
            "data-state": Qc(a.checked)
          }
        )
      }
    );
  }
);
zm.displayName = Xc;
var hS = "MenuSeparator", Hm = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, ...n } = e;
    return /* @__PURE__ */ v(
      K.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...n,
        ref: t
      }
    );
  }
);
Hm.displayName = hS;
var pS = "MenuArrow", Ym = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, ...n } = e, o = Gr(r);
    return /* @__PURE__ */ v(Zn, { ...o, ...n, ref: t });
  }
);
Ym.displayName = pS;
var Zc = "MenuSub", [mS, Gm] = Bt(Zc), Um = (e) => {
  const { __scopeMenu: t, children: r, open: n = !1, onOpenChange: o } = e, a = St(Zc, t), i = Gr(t), [s, c] = h.useState(null), [l, u] = h.useState(null), d = We(o);
  return h.useEffect(() => (a.open === !1 && d(!1), () => d(!1)), [a.open, d]), /* @__PURE__ */ v(jr, { ...i, children: /* @__PURE__ */ v(
    Rm,
    {
      scope: t,
      open: n,
      onOpenChange: d,
      content: l,
      onContentChange: u,
      children: /* @__PURE__ */ v(
        mS,
        {
          scope: t,
          contentId: Ce(),
          triggerId: Ce(),
          trigger: s,
          onTriggerChange: c,
          children: r
        }
      )
    }
  ) });
};
Um.displayName = Zc;
var wr = "MenuSubTrigger", Vm = h.forwardRef(
  (e, t) => {
    const r = St(wr, e.__scopeMenu), n = Ur(wr, e.__scopeMenu), o = Gm(wr, e.__scopeMenu), a = Uc(wr, e.__scopeMenu), i = h.useRef(null), { pointerGraceTimerRef: s, onPointerGraceIntentChange: c } = a, l = { __scopeMenu: e.__scopeMenu }, u = h.useCallback(() => {
      i.current && window.clearTimeout(i.current), i.current = null;
    }, []);
    return h.useEffect(() => u, [u]), h.useEffect(() => {
      const d = s.current;
      return () => {
        window.clearTimeout(d), c(null);
      };
    }, [s, c]), /* @__PURE__ */ v(Yc, { asChild: !0, ...l, children: /* @__PURE__ */ v(
      $m,
      {
        id: o.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": r.open,
        "aria-controls": o.contentId,
        "data-state": Zm(r.open),
        ...e,
        ref: Bn(t, o.onTriggerChange),
        onClick: (d) => {
          var f;
          (f = e.onClick) == null || f.call(e, d), !(e.disabled || d.defaultPrevented) && (d.currentTarget.focus(), r.open || r.onOpenChange(!0));
        },
        onPointerMove: W(
          e.onPointerMove,
          Rr((d) => {
            a.onItemEnter(d), !d.defaultPrevented && !e.disabled && !r.open && !i.current && (a.onPointerGraceIntentChange(null), i.current = window.setTimeout(() => {
              r.onOpenChange(!0), u();
            }, 100));
          })
        ),
        onPointerLeave: W(
          e.onPointerLeave,
          Rr((d) => {
            var m, b;
            u();
            const f = (m = r.content) == null ? void 0 : m.getBoundingClientRect();
            if (f) {
              const g = (b = r.content) == null ? void 0 : b.dataset.side, p = g === "right", w = p ? -5 : 5, y = f[p ? "left" : "right"], x = f[p ? "right" : "left"];
              a.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: d.clientX + w, y: d.clientY },
                  { x: y, y: f.top },
                  { x, y: f.top },
                  { x, y: f.bottom },
                  { x: y, y: f.bottom }
                ],
                side: g
              }), window.clearTimeout(s.current), s.current = window.setTimeout(
                () => a.onPointerGraceIntentChange(null),
                300
              );
            } else {
              if (a.onTriggerLeave(d), d.defaultPrevented) return;
              a.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: W(e.onKeyDown, (d) => {
          var m;
          const f = a.searchRef.current !== "";
          e.disabled || f && d.key === " " || X_[n.dir].includes(d.key) && (r.onOpenChange(!0), (m = r.content) == null || m.focus(), d.preventDefault());
        })
      }
    ) });
  }
);
Vm.displayName = wr;
var Km = "MenuSubContent", Xm = h.forwardRef(
  (e, t) => {
    const r = km(qe, e.__scopeMenu), { forceMount: n = r.forceMount, ...o } = e, a = St(qe, e.__scopeMenu), i = Ur(qe, e.__scopeMenu), s = Gm(Km, e.__scopeMenu), c = h.useRef(null), l = ie(t, c);
    return /* @__PURE__ */ v(Tr.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ v(De, { present: n || a.open, children: /* @__PURE__ */ v(Tr.Slot, { scope: e.__scopeMenu, children: /* @__PURE__ */ v(
      Vc,
      {
        id: s.contentId,
        "aria-labelledby": s.triggerId,
        ...o,
        ref: l,
        align: "start",
        side: i.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: !1,
        disableOutsideScroll: !1,
        trapFocus: !1,
        onOpenAutoFocus: (u) => {
          var d;
          i.isUsingKeyboardRef.current && ((d = c.current) == null || d.focus()), u.preventDefault();
        },
        onCloseAutoFocus: (u) => u.preventDefault(),
        onFocusOutside: W(e.onFocusOutside, (u) => {
          u.target !== s.trigger && a.onOpenChange(!1);
        }),
        onEscapeKeyDown: W(e.onEscapeKeyDown, (u) => {
          i.onClose(), u.preventDefault();
        }),
        onKeyDown: W(e.onKeyDown, (u) => {
          var m;
          const d = u.currentTarget.contains(u.target), f = Z_[i.dir].includes(u.key);
          d && f && (a.onOpenChange(!1), (m = s.trigger) == null || m.focus(), u.preventDefault());
        })
      }
    ) }) }) });
  }
);
Xm.displayName = Km;
function Zm(e) {
  return e ? "open" : "closed";
}
function En(e) {
  return e === "indeterminate";
}
function Qc(e) {
  return En(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function gS(e) {
  const t = document.activeElement;
  for (const r of e)
    if (r === t || (r.focus(), document.activeElement !== t)) return;
}
function vS(e, t) {
  return e.map((r, n) => e[(t + n) % e.length]);
}
function bS(e, t, r) {
  const o = t.length > 1 && Array.from(t).every((l) => l === t[0]) ? t[0] : t, a = r ? e.indexOf(r) : -1;
  let i = vS(e, Math.max(a, 0));
  o.length === 1 && (i = i.filter((l) => l !== r));
  const c = i.find(
    (l) => l.toLowerCase().startsWith(o.toLowerCase())
  );
  return c !== r ? c : void 0;
}
function yS(e, t) {
  const { x: r, y: n } = e;
  let o = !1;
  for (let a = 0, i = t.length - 1; a < t.length; i = a++) {
    const s = t[a], c = t[i], l = s.x, u = s.y, d = c.x, f = c.y;
    u > n != f > n && r < (d - l) * (n - u) / (f - u) + l && (o = !o);
  }
  return o;
}
function wS(e, t) {
  if (!t) return !1;
  const r = { x: e.clientX, y: e.clientY };
  return yS(r, t);
}
function Rr(e) {
  return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
var xS = Dm, _S = Yc, SS = Nm, CS = Am, OS = Kc, PS = Im, ES = Jn, MS = Fm, TS = Wm, RS = Lm, DS = zm, kS = Hm, NS = Ym, AS = Um, IS = Vm, $S = Xm, eo = "DropdownMenu", [FS] = Be(
  eo,
  [Mm]
), Se = Mm(), [qS, Qm] = FS(eo), Jm = (e) => {
  const {
    __scopeDropdownMenu: t,
    children: r,
    dir: n,
    open: o,
    defaultOpen: a,
    onOpenChange: i,
    modal: s = !0
  } = e, c = Se(t), l = h.useRef(null), [u, d] = rt({
    prop: o,
    defaultProp: a ?? !1,
    onChange: i,
    caller: eo
  });
  return /* @__PURE__ */ v(
    qS,
    {
      scope: t,
      triggerId: Ce(),
      triggerRef: l,
      contentId: Ce(),
      open: u,
      onOpenChange: d,
      onOpenToggle: h.useCallback(() => d((f) => !f), [d]),
      modal: s,
      children: /* @__PURE__ */ v(xS, { ...c, open: u, onOpenChange: d, dir: n, modal: s, children: r })
    }
  );
};
Jm.displayName = eo;
var eg = "DropdownMenuTrigger", tg = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, disabled: n = !1, ...o } = e, a = Qm(eg, r), i = Se(r);
    return /* @__PURE__ */ v(_S, { asChild: !0, ...i, children: /* @__PURE__ */ v(
      K.button,
      {
        type: "button",
        id: a.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": a.open,
        "aria-controls": a.open ? a.contentId : void 0,
        "data-state": a.open ? "open" : "closed",
        "data-disabled": n ? "" : void 0,
        disabled: n,
        ...o,
        ref: Bn(t, a.triggerRef),
        onPointerDown: W(e.onPointerDown, (s) => {
          !n && s.button === 0 && s.ctrlKey === !1 && (a.onOpenToggle(), a.open || s.preventDefault());
        }),
        onKeyDown: W(e.onKeyDown, (s) => {
          n || (["Enter", " "].includes(s.key) && a.onOpenToggle(), s.key === "ArrowDown" && a.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(s.key) && s.preventDefault());
        })
      }
    ) });
  }
);
tg.displayName = eg;
var WS = "DropdownMenuPortal", rg = (e) => {
  const { __scopeDropdownMenu: t, ...r } = e, n = Se(t);
  return /* @__PURE__ */ v(SS, { ...n, ...r });
};
rg.displayName = WS;
var ng = "DropdownMenuContent", og = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e, o = Qm(ng, r), a = Se(r), i = h.useRef(!1);
    return /* @__PURE__ */ v(
      CS,
      {
        id: o.contentId,
        "aria-labelledby": o.triggerId,
        ...a,
        ...n,
        ref: t,
        onCloseAutoFocus: W(e.onCloseAutoFocus, (s) => {
          var c;
          i.current || (c = o.triggerRef.current) == null || c.focus(), i.current = !1, s.preventDefault();
        }),
        onInteractOutside: W(e.onInteractOutside, (s) => {
          const c = s.detail.originalEvent, l = c.button === 0 && c.ctrlKey === !0, u = c.button === 2 || l;
          (!o.modal || u) && (i.current = !0);
        }),
        style: {
          ...e.style,
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    );
  }
);
og.displayName = ng;
var BS = "DropdownMenuGroup", ag = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
    return /* @__PURE__ */ v(OS, { ...o, ...n, ref: t });
  }
);
ag.displayName = BS;
var LS = "DropdownMenuLabel", ig = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
    return /* @__PURE__ */ v(PS, { ...o, ...n, ref: t });
  }
);
ig.displayName = LS;
var jS = "DropdownMenuItem", sg = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
    return /* @__PURE__ */ v(ES, { ...o, ...n, ref: t });
  }
);
sg.displayName = jS;
var zS = "DropdownMenuCheckboxItem", cg = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(MS, { ...o, ...n, ref: t });
});
cg.displayName = zS;
var HS = "DropdownMenuRadioGroup", lg = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(TS, { ...o, ...n, ref: t });
});
lg.displayName = HS;
var YS = "DropdownMenuRadioItem", ug = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(RS, { ...o, ...n, ref: t });
});
ug.displayName = YS;
var GS = "DropdownMenuItemIndicator", dg = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(DS, { ...o, ...n, ref: t });
});
dg.displayName = GS;
var US = "DropdownMenuSeparator", fg = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(kS, { ...o, ...n, ref: t });
});
fg.displayName = US;
var VS = "DropdownMenuArrow", KS = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
    return /* @__PURE__ */ v(NS, { ...o, ...n, ref: t });
  }
);
KS.displayName = VS;
var XS = (e) => {
  const { __scopeDropdownMenu: t, children: r, open: n, onOpenChange: o, defaultOpen: a } = e, i = Se(t), [s, c] = rt({
    prop: n,
    defaultProp: a ?? !1,
    onChange: o,
    caller: "DropdownMenuSub"
  });
  return /* @__PURE__ */ v(AS, { ...i, open: s, onOpenChange: c, children: r });
}, ZS = "DropdownMenuSubTrigger", hg = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(IS, { ...o, ...n, ref: t });
});
hg.displayName = ZS;
var QS = "DropdownMenuSubContent", pg = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(
    $S,
    {
      ...o,
      ...n,
      ref: t,
      style: {
        ...e.style,
        "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
pg.displayName = QS;
var JS = Jm, eC = tg, tC = rg, rC = og, nC = ag, oC = ig, aC = sg, iC = cg, sC = lg, cC = ug, mg = dg, lC = fg, uC = XS, dC = hg, fC = pg, hC = "Label", gg = h.forwardRef((e, t) => /* @__PURE__ */ v(
  K.label,
  {
    ...e,
    ref: t,
    onMouseDown: (r) => {
      var o;
      r.target.closest("button, input, select, textarea") || ((o = e.onMouseDown) == null || o.call(e, r), !r.defaultPrevented && r.detail > 1 && r.preventDefault());
    }
  }
));
gg.displayName = hC;
var pC = gg;
function uu(e, [t, r]) {
  return Math.min(r, Math.max(t, e));
}
var to = "Popover", [vg] = Be(to, [
  _t
]), Vr = _t(), [mC, Ct] = vg(to), bg = (e) => {
  const {
    __scopePopover: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: a,
    modal: i = !1
  } = e, s = Vr(t), c = h.useRef(null), [l, u] = h.useState(!1), [d, f] = rt({
    prop: n,
    defaultProp: o ?? !1,
    onChange: a,
    caller: to
  });
  return /* @__PURE__ */ v(jr, { ...s, children: /* @__PURE__ */ v(
    mC,
    {
      scope: t,
      contentId: Ce(),
      triggerRef: c,
      open: d,
      onOpenChange: f,
      onOpenToggle: h.useCallback(() => f((m) => !m), [f]),
      hasCustomAnchor: l,
      onCustomAnchorAdd: h.useCallback(() => u(!0), []),
      onCustomAnchorRemove: h.useCallback(() => u(!1), []),
      modal: i,
      children: r
    }
  ) });
};
bg.displayName = to;
var yg = "PopoverAnchor", gC = h.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Ct(yg, r), a = Vr(r), { onCustomAnchorAdd: i, onCustomAnchorRemove: s } = o;
    return h.useEffect(() => (i(), () => s()), [i, s]), /* @__PURE__ */ v(zr, { ...a, ...n, ref: t });
  }
);
gC.displayName = yg;
var wg = "PopoverTrigger", xg = h.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Ct(wg, r), a = Vr(r), i = ie(t, o.triggerRef), s = /* @__PURE__ */ v(
      K.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": Pg(o.open),
        ...n,
        ref: i,
        onClick: W(e.onClick, o.onOpenToggle)
      }
    );
    return o.hasCustomAnchor ? s : /* @__PURE__ */ v(zr, { asChild: !0, ...a, children: s });
  }
);
xg.displayName = wg;
var Jc = "PopoverPortal", [vC, bC] = vg(Jc, {
  forceMount: void 0
}), _g = (e) => {
  const { __scopePopover: t, forceMount: r, children: n, container: o } = e, a = Ct(Jc, t);
  return /* @__PURE__ */ v(vC, { scope: t, forceMount: r, children: /* @__PURE__ */ v(De, { present: r || a.open, children: /* @__PURE__ */ v(dr, { asChild: !0, container: o, children: n }) }) });
};
_g.displayName = Jc;
var rr = "PopoverContent", Sg = h.forwardRef(
  (e, t) => {
    const r = bC(rr, e.__scopePopover), { forceMount: n = r.forceMount, ...o } = e, a = Ct(rr, e.__scopePopover);
    return /* @__PURE__ */ v(De, { present: n || a.open, children: a.modal ? /* @__PURE__ */ v(wC, { ...o, ref: t }) : /* @__PURE__ */ v(xC, { ...o, ref: t }) });
  }
);
Sg.displayName = rr;
var yC = /* @__PURE__ */ yt("PopoverContent.RemoveScroll"), wC = h.forwardRef(
  (e, t) => {
    const r = Ct(rr, e.__scopePopover), n = h.useRef(null), o = ie(t, n), a = h.useRef(!1);
    return h.useEffect(() => {
      const i = n.current;
      if (i) return Hn(i);
    }, []), /* @__PURE__ */ v(Br, { as: yC, allowPinchZoom: !0, children: /* @__PURE__ */ v(
      Cg,
      {
        ...e,
        ref: o,
        trapFocus: r.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: W(e.onCloseAutoFocus, (i) => {
          var s;
          i.preventDefault(), a.current || (s = r.triggerRef.current) == null || s.focus();
        }),
        onPointerDownOutside: W(
          e.onPointerDownOutside,
          (i) => {
            const s = i.detail.originalEvent, c = s.button === 0 && s.ctrlKey === !0, l = s.button === 2 || c;
            a.current = l;
          },
          { checkForDefaultPrevented: !1 }
        ),
        onFocusOutside: W(
          e.onFocusOutside,
          (i) => i.preventDefault(),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
), xC = h.forwardRef(
  (e, t) => {
    const r = Ct(rr, e.__scopePopover), n = h.useRef(!1), o = h.useRef(!1);
    return /* @__PURE__ */ v(
      Cg,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (a) => {
          var i, s;
          (i = e.onCloseAutoFocus) == null || i.call(e, a), a.defaultPrevented || (n.current || (s = r.triggerRef.current) == null || s.focus(), a.preventDefault()), n.current = !1, o.current = !1;
        },
        onInteractOutside: (a) => {
          var c, l;
          (c = e.onInteractOutside) == null || c.call(e, a), a.defaultPrevented || (n.current = !0, a.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const i = a.target;
          ((l = r.triggerRef.current) == null ? void 0 : l.contains(i)) && a.preventDefault(), a.detail.originalEvent.type === "focusin" && o.current && a.preventDefault();
        }
      }
    );
  }
), Cg = h.forwardRef(
  (e, t) => {
    const {
      __scopePopover: r,
      trapFocus: n,
      onOpenAutoFocus: o,
      onCloseAutoFocus: a,
      disableOutsidePointerEvents: i,
      onEscapeKeyDown: s,
      onPointerDownOutside: c,
      onFocusOutside: l,
      onInteractOutside: u,
      ...d
    } = e, f = Ct(rr, r), m = Vr(r);
    return jn(), /* @__PURE__ */ v(
      Wr,
      {
        asChild: !0,
        loop: !0,
        trapped: n,
        onMountAutoFocus: o,
        onUnmountAutoFocus: a,
        children: /* @__PURE__ */ v(
          ur,
          {
            asChild: !0,
            disableOutsidePointerEvents: i,
            onInteractOutside: u,
            onEscapeKeyDown: s,
            onPointerDownOutside: c,
            onFocusOutside: l,
            onDismiss: () => f.onOpenChange(!1),
            children: /* @__PURE__ */ v(
              Xn,
              {
                "data-state": Pg(f.open),
                role: "dialog",
                id: f.contentId,
                ...m,
                ...d,
                ref: t,
                style: {
                  ...d.style,
                  "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                }
              }
            )
          }
        )
      }
    );
  }
), Og = "PopoverClose", _C = h.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Ct(Og, r);
    return /* @__PURE__ */ v(
      K.button,
      {
        type: "button",
        ...n,
        ref: t,
        onClick: W(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
_C.displayName = Og;
var SC = "PopoverArrow", CC = h.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Vr(r);
    return /* @__PURE__ */ v(Zn, { ...o, ...n, ref: t });
  }
);
CC.displayName = SC;
function Pg(e) {
  return e ? "open" : "closed";
}
var OC = bg, PC = xg, EC = _g, MC = Sg, TC = [" ", "Enter", "ArrowUp", "ArrowDown"], RC = [" ", "Enter"], qt = "Select", [ro, no, DC] = Dc(qt), [pr] = Be(qt, [
  DC,
  _t
]), oo = _t(), [kC, Ot] = pr(qt), [NC, AC] = pr(qt), Eg = (e) => {
  const {
    __scopeSelect: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: a,
    value: i,
    defaultValue: s,
    onValueChange: c,
    dir: l,
    name: u,
    autoComplete: d,
    disabled: f,
    required: m,
    form: b
  } = e, g = oo(t), [p, w] = h.useState(null), [y, x] = h.useState(null), [S, C] = h.useState(!1), _ = Ln(l), [O, P] = rt({
    prop: n,
    defaultProp: o ?? !1,
    onChange: a,
    caller: qt
  }), [R, A] = rt({
    prop: i,
    defaultProp: s,
    onChange: c,
    caller: qt
  }), D = h.useRef(null), B = p ? b || !!p.closest("form") : !0, [k, $] = h.useState(/* @__PURE__ */ new Set()), F = Array.from(k).map((I) => I.props.value).join(";");
  return /* @__PURE__ */ v(jr, { ...g, children: /* @__PURE__ */ ae(
    kC,
    {
      required: m,
      scope: t,
      trigger: p,
      onTriggerChange: w,
      valueNode: y,
      onValueNodeChange: x,
      valueNodeHasChildren: S,
      onValueNodeHasChildrenChange: C,
      contentId: Ce(),
      value: R,
      onValueChange: A,
      open: O,
      onOpenChange: P,
      dir: _,
      triggerPointerDownPosRef: D,
      disabled: f,
      children: [
        /* @__PURE__ */ v(ro.Provider, { scope: t, children: /* @__PURE__ */ v(
          NC,
          {
            scope: e.__scopeSelect,
            onNativeOptionAdd: h.useCallback((I) => {
              $((Y) => new Set(Y).add(I));
            }, []),
            onNativeOptionRemove: h.useCallback((I) => {
              $((Y) => {
                const q = new Set(Y);
                return q.delete(I), q;
              });
            }, []),
            children: r
          }
        ) }),
        B ? /* @__PURE__ */ ae(
          Kg,
          {
            "aria-hidden": !0,
            required: m,
            tabIndex: -1,
            name: u,
            autoComplete: d,
            value: R,
            onChange: (I) => A(I.target.value),
            disabled: f,
            form: b,
            children: [
              R === void 0 ? /* @__PURE__ */ v("option", { value: "" }) : null,
              Array.from(k)
            ]
          },
          F
        ) : null
      ]
    }
  ) });
};
Eg.displayName = qt;
var Mg = "SelectTrigger", Tg = h.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, disabled: n = !1, ...o } = e, a = oo(r), i = Ot(Mg, r), s = i.disabled || n, c = ie(t, i.onTriggerChange), l = no(r), u = h.useRef("touch"), [d, f, m] = Zg((g) => {
      const p = l().filter((x) => !x.disabled), w = p.find((x) => x.value === i.value), y = Qg(p, g, w);
      y !== void 0 && i.onValueChange(y.value);
    }), b = (g) => {
      s || (i.onOpenChange(!0), m()), g && (i.triggerPointerDownPosRef.current = {
        x: Math.round(g.pageX),
        y: Math.round(g.pageY)
      });
    };
    return /* @__PURE__ */ v(zr, { asChild: !0, ...a, children: /* @__PURE__ */ v(
      K.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": i.contentId,
        "aria-expanded": i.open,
        "aria-required": i.required,
        "aria-autocomplete": "none",
        dir: i.dir,
        "data-state": i.open ? "open" : "closed",
        disabled: s,
        "data-disabled": s ? "" : void 0,
        "data-placeholder": Xg(i.value) ? "" : void 0,
        ...o,
        ref: c,
        onClick: W(o.onClick, (g) => {
          g.currentTarget.focus(), u.current !== "mouse" && b(g);
        }),
        onPointerDown: W(o.onPointerDown, (g) => {
          u.current = g.pointerType;
          const p = g.target;
          p.hasPointerCapture(g.pointerId) && p.releasePointerCapture(g.pointerId), g.button === 0 && g.ctrlKey === !1 && g.pointerType === "mouse" && (b(g), g.preventDefault());
        }),
        onKeyDown: W(o.onKeyDown, (g) => {
          const p = d.current !== "";
          !(g.ctrlKey || g.altKey || g.metaKey) && g.key.length === 1 && f(g.key), !(p && g.key === " ") && TC.includes(g.key) && (b(), g.preventDefault());
        })
      }
    ) });
  }
);
Tg.displayName = Mg;
var Rg = "SelectValue", Dg = h.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, className: n, style: o, children: a, placeholder: i = "", ...s } = e, c = Ot(Rg, r), { onValueNodeHasChildrenChange: l } = c, u = a !== void 0, d = ie(t, c.onValueNodeChange);
    return xe(() => {
      l(u);
    }, [l, u]), /* @__PURE__ */ v(
      K.span,
      {
        ...s,
        ref: d,
        style: { pointerEvents: "none" },
        children: Xg(c.value) ? /* @__PURE__ */ v(It, { children: i }) : a
      }
    );
  }
);
Dg.displayName = Rg;
var IC = "SelectIcon", kg = h.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, children: n, ...o } = e;
    return /* @__PURE__ */ v(K.span, { "aria-hidden": !0, ...o, ref: t, children: n || "▼" });
  }
);
kg.displayName = IC;
var $C = "SelectPortal", Ng = (e) => /* @__PURE__ */ v(dr, { asChild: !0, ...e });
Ng.displayName = $C;
var Wt = "SelectContent", Ag = h.forwardRef(
  (e, t) => {
    const r = Ot(Wt, e.__scopeSelect), [n, o] = h.useState();
    if (xe(() => {
      o(new DocumentFragment());
    }, []), !r.open) {
      const a = n;
      return a ? Wn.createPortal(
        /* @__PURE__ */ v(Ig, { scope: e.__scopeSelect, children: /* @__PURE__ */ v(ro.Slot, { scope: e.__scopeSelect, children: /* @__PURE__ */ v("div", { children: e.children }) }) }),
        a
      ) : null;
    }
    return /* @__PURE__ */ v($g, { ...e, ref: t });
  }
);
Ag.displayName = Wt;
var je = 10, [Ig, Pt] = pr(Wt), FC = "SelectContentImpl", qC = /* @__PURE__ */ yt("SelectContent.RemoveScroll"), $g = h.forwardRef(
  (e, t) => {
    const {
      __scopeSelect: r,
      position: n = "item-aligned",
      onCloseAutoFocus: o,
      onEscapeKeyDown: a,
      onPointerDownOutside: i,
      //
      // PopperContent props
      side: s,
      sideOffset: c,
      align: l,
      alignOffset: u,
      arrowPadding: d,
      collisionBoundary: f,
      collisionPadding: m,
      sticky: b,
      hideWhenDetached: g,
      avoidCollisions: p,
      //
      ...w
    } = e, y = Ot(Wt, r), [x, S] = h.useState(null), [C, _] = h.useState(null), O = ie(t, (z) => S(z)), [P, R] = h.useState(null), [A, D] = h.useState(
      null
    ), B = no(r), [k, $] = h.useState(!1), F = h.useRef(!1);
    h.useEffect(() => {
      if (x) return Hn(x);
    }, [x]), jn();
    const I = h.useCallback(
      (z) => {
        const [re, ...U] = B().map((te) => te.ref.current), [Q] = U.slice(-1), ee = document.activeElement;
        for (const te of z)
          if (te === ee || (te == null || te.scrollIntoView({ block: "nearest" }), te === re && C && (C.scrollTop = 0), te === Q && C && (C.scrollTop = C.scrollHeight), te == null || te.focus(), document.activeElement !== ee)) return;
      },
      [B, C]
    ), Y = h.useCallback(
      () => I([P, x]),
      [I, P, x]
    );
    h.useEffect(() => {
      k && Y();
    }, [k, Y]);
    const { onOpenChange: q, triggerPointerDownPosRef: N } = y;
    h.useEffect(() => {
      if (x) {
        let z = { x: 0, y: 0 };
        const re = (Q) => {
          var ee, te;
          z = {
            x: Math.abs(Math.round(Q.pageX) - (((ee = N.current) == null ? void 0 : ee.x) ?? 0)),
            y: Math.abs(Math.round(Q.pageY) - (((te = N.current) == null ? void 0 : te.y) ?? 0))
          };
        }, U = (Q) => {
          z.x <= 10 && z.y <= 10 ? Q.preventDefault() : x.contains(Q.target) || q(!1), document.removeEventListener("pointermove", re), N.current = null;
        };
        return N.current !== null && (document.addEventListener("pointermove", re), document.addEventListener("pointerup", U, { capture: !0, once: !0 })), () => {
          document.removeEventListener("pointermove", re), document.removeEventListener("pointerup", U, { capture: !0 });
        };
      }
    }, [x, q, N]), h.useEffect(() => {
      const z = () => q(!1);
      return window.addEventListener("blur", z), window.addEventListener("resize", z), () => {
        window.removeEventListener("blur", z), window.removeEventListener("resize", z);
      };
    }, [q]);
    const [M, X] = Zg((z) => {
      const re = B().filter((ee) => !ee.disabled), U = re.find((ee) => ee.ref.current === document.activeElement), Q = Qg(re, z, U);
      Q && setTimeout(() => Q.ref.current.focus());
    }), le = h.useCallback(
      (z, re, U) => {
        const Q = !F.current && !U;
        (y.value !== void 0 && y.value === re || Q) && (R(z), Q && (F.current = !0));
      },
      [y.value]
    ), me = h.useCallback(() => x == null ? void 0 : x.focus(), [x]), ge = h.useCallback(
      (z, re, U) => {
        const Q = !F.current && !U;
        (y.value !== void 0 && y.value === re || Q) && D(z);
      },
      [y.value]
    ), se = n === "popper" ? ic : Fg, ne = se === ic ? {
      side: s,
      sideOffset: c,
      align: l,
      alignOffset: u,
      arrowPadding: d,
      collisionBoundary: f,
      collisionPadding: m,
      sticky: b,
      hideWhenDetached: g,
      avoidCollisions: p
    } : {};
    return /* @__PURE__ */ v(
      Ig,
      {
        scope: r,
        content: x,
        viewport: C,
        onViewportChange: _,
        itemRefCallback: le,
        selectedItem: P,
        onItemLeave: me,
        itemTextRefCallback: ge,
        focusSelectedItem: Y,
        selectedItemText: A,
        position: n,
        isPositioned: k,
        searchRef: M,
        children: /* @__PURE__ */ v(Br, { as: qC, allowPinchZoom: !0, children: /* @__PURE__ */ v(
          Wr,
          {
            asChild: !0,
            trapped: y.open,
            onMountAutoFocus: (z) => {
              z.preventDefault();
            },
            onUnmountAutoFocus: W(o, (z) => {
              var re;
              (re = y.trigger) == null || re.focus({ preventScroll: !0 }), z.preventDefault();
            }),
            children: /* @__PURE__ */ v(
              ur,
              {
                asChild: !0,
                disableOutsidePointerEvents: !0,
                onEscapeKeyDown: a,
                onPointerDownOutside: i,
                onFocusOutside: (z) => z.preventDefault(),
                onDismiss: () => y.onOpenChange(!1),
                children: /* @__PURE__ */ v(
                  se,
                  {
                    role: "listbox",
                    id: y.contentId,
                    "data-state": y.open ? "open" : "closed",
                    dir: y.dir,
                    onContextMenu: (z) => z.preventDefault(),
                    ...w,
                    ...ne,
                    onPlaced: () => $(!0),
                    ref: O,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...w.style
                    },
                    onKeyDown: W(w.onKeyDown, (z) => {
                      const re = z.ctrlKey || z.altKey || z.metaKey;
                      if (z.key === "Tab" && z.preventDefault(), !re && z.key.length === 1 && X(z.key), ["ArrowUp", "ArrowDown", "Home", "End"].includes(z.key)) {
                        let Q = B().filter((ee) => !ee.disabled).map((ee) => ee.ref.current);
                        if (["ArrowUp", "End"].includes(z.key) && (Q = Q.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(z.key)) {
                          const ee = z.target, te = Q.indexOf(ee);
                          Q = Q.slice(te + 1);
                        }
                        setTimeout(() => I(Q)), z.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
$g.displayName = FC;
var WC = "SelectItemAlignedPosition", Fg = h.forwardRef((e, t) => {
  const { __scopeSelect: r, onPlaced: n, ...o } = e, a = Ot(Wt, r), i = Pt(Wt, r), [s, c] = h.useState(null), [l, u] = h.useState(null), d = ie(t, (O) => u(O)), f = no(r), m = h.useRef(!1), b = h.useRef(!0), { viewport: g, selectedItem: p, selectedItemText: w, focusSelectedItem: y } = i, x = h.useCallback(() => {
    if (a.trigger && a.valueNode && s && l && g && p && w) {
      const O = a.trigger.getBoundingClientRect(), P = l.getBoundingClientRect(), R = a.valueNode.getBoundingClientRect(), A = w.getBoundingClientRect();
      if (a.dir !== "rtl") {
        const ee = A.left - P.left, te = R.left - ee, be = O.left - te, L = O.width + be, ke = Math.max(L, P.width), Ne = window.innerWidth - je, Xe = uu(te, [
          je,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(je, Ne - ke)
        ]);
        s.style.minWidth = L + "px", s.style.left = Xe + "px";
      } else {
        const ee = P.right - A.right, te = window.innerWidth - R.right - ee, be = window.innerWidth - O.right - te, L = O.width + be, ke = Math.max(L, P.width), Ne = window.innerWidth - je, Xe = uu(te, [
          je,
          Math.max(je, Ne - ke)
        ]);
        s.style.minWidth = L + "px", s.style.right = Xe + "px";
      }
      const D = f(), B = window.innerHeight - je * 2, k = g.scrollHeight, $ = window.getComputedStyle(l), F = parseInt($.borderTopWidth, 10), I = parseInt($.paddingTop, 10), Y = parseInt($.borderBottomWidth, 10), q = parseInt($.paddingBottom, 10), N = F + I + k + q + Y, M = Math.min(p.offsetHeight * 5, N), X = window.getComputedStyle(g), le = parseInt(X.paddingTop, 10), me = parseInt(X.paddingBottom, 10), ge = O.top + O.height / 2 - je, se = B - ge, ne = p.offsetHeight / 2, z = p.offsetTop + ne, re = F + I + z, U = N - re;
      if (re <= ge) {
        const ee = D.length > 0 && p === D[D.length - 1].ref.current;
        s.style.bottom = "0px";
        const te = l.clientHeight - g.offsetTop - g.offsetHeight, be = Math.max(
          se,
          ne + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (ee ? me : 0) + te + Y
        ), L = re + be;
        s.style.height = L + "px";
      } else {
        const ee = D.length > 0 && p === D[0].ref.current;
        s.style.top = "0px";
        const be = Math.max(
          ge,
          F + g.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (ee ? le : 0) + ne
        ) + U;
        s.style.height = be + "px", g.scrollTop = re - ge + g.offsetTop;
      }
      s.style.margin = `${je}px 0`, s.style.minHeight = M + "px", s.style.maxHeight = B + "px", n == null || n(), requestAnimationFrame(() => m.current = !0);
    }
  }, [
    f,
    a.trigger,
    a.valueNode,
    s,
    l,
    g,
    p,
    w,
    a.dir,
    n
  ]);
  xe(() => x(), [x]);
  const [S, C] = h.useState();
  xe(() => {
    l && C(window.getComputedStyle(l).zIndex);
  }, [l]);
  const _ = h.useCallback(
    (O) => {
      O && b.current === !0 && (x(), y == null || y(), b.current = !1);
    },
    [x, y]
  );
  return /* @__PURE__ */ v(
    LC,
    {
      scope: r,
      contentWrapper: s,
      shouldExpandOnScrollRef: m,
      onScrollButtonChange: _,
      children: /* @__PURE__ */ v(
        "div",
        {
          ref: c,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: S
          },
          children: /* @__PURE__ */ v(
            K.div,
            {
              ...o,
              ref: d,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...o.style
              }
            }
          )
        }
      )
    }
  );
});
Fg.displayName = WC;
var BC = "SelectPopperPosition", ic = h.forwardRef((e, t) => {
  const {
    __scopeSelect: r,
    align: n = "start",
    collisionPadding: o = je,
    ...a
  } = e, i = oo(r);
  return /* @__PURE__ */ v(
    Xn,
    {
      ...i,
      ...a,
      ref: t,
      align: n,
      collisionPadding: o,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...a.style,
        "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-select-content-available-width": "var(--radix-popper-available-width)",
        "--radix-select-content-available-height": "var(--radix-popper-available-height)",
        "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
ic.displayName = BC;
var [LC, el] = pr(Wt, {}), sc = "SelectViewport", qg = h.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, nonce: n, ...o } = e, a = Pt(sc, r), i = el(sc, r), s = ie(t, a.onViewportChange), c = h.useRef(0);
    return /* @__PURE__ */ ae(It, { children: [
      /* @__PURE__ */ v(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"
          },
          nonce: n
        }
      ),
      /* @__PURE__ */ v(ro.Slot, { scope: r, children: /* @__PURE__ */ v(
        K.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...o,
          ref: s,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...o.style
          },
          onScroll: W(o.onScroll, (l) => {
            const u = l.currentTarget, { contentWrapper: d, shouldExpandOnScrollRef: f } = i;
            if (f != null && f.current && d) {
              const m = Math.abs(c.current - u.scrollTop);
              if (m > 0) {
                const b = window.innerHeight - je * 2, g = parseFloat(d.style.minHeight), p = parseFloat(d.style.height), w = Math.max(g, p);
                if (w < b) {
                  const y = w + m, x = Math.min(b, y), S = y - x;
                  d.style.height = x + "px", d.style.bottom === "0px" && (u.scrollTop = S > 0 ? S : 0, d.style.justifyContent = "flex-end");
                }
              }
            }
            c.current = u.scrollTop;
          })
        }
      ) })
    ] });
  }
);
qg.displayName = sc;
var Wg = "SelectGroup", [jC, zC] = pr(Wg), HC = h.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = Ce();
    return /* @__PURE__ */ v(jC, { scope: r, id: o, children: /* @__PURE__ */ v(K.div, { role: "group", "aria-labelledby": o, ...n, ref: t }) });
  }
);
HC.displayName = Wg;
var Bg = "SelectLabel", YC = h.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = zC(Bg, r);
    return /* @__PURE__ */ v(K.div, { id: o.id, ...n, ref: t });
  }
);
YC.displayName = Bg;
var Mn = "SelectItem", [GC, Lg] = pr(Mn), jg = h.forwardRef(
  (e, t) => {
    const {
      __scopeSelect: r,
      value: n,
      disabled: o = !1,
      textValue: a,
      ...i
    } = e, s = Ot(Mn, r), c = Pt(Mn, r), l = s.value === n, [u, d] = h.useState(a ?? ""), [f, m] = h.useState(!1), b = ie(
      t,
      (y) => {
        var x;
        return (x = c.itemRefCallback) == null ? void 0 : x.call(c, y, n, o);
      }
    ), g = Ce(), p = h.useRef("touch"), w = () => {
      o || (s.onValueChange(n), s.onOpenChange(!1));
    };
    if (n === "")
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    return /* @__PURE__ */ v(
      GC,
      {
        scope: r,
        value: n,
        disabled: o,
        textId: g,
        isSelected: l,
        onItemTextChange: h.useCallback((y) => {
          d((x) => x || ((y == null ? void 0 : y.textContent) ?? "").trim());
        }, []),
        children: /* @__PURE__ */ v(
          ro.ItemSlot,
          {
            scope: r,
            value: n,
            disabled: o,
            textValue: u,
            children: /* @__PURE__ */ v(
              K.div,
              {
                role: "option",
                "aria-labelledby": g,
                "data-highlighted": f ? "" : void 0,
                "aria-selected": l && f,
                "data-state": l ? "checked" : "unchecked",
                "aria-disabled": o || void 0,
                "data-disabled": o ? "" : void 0,
                tabIndex: o ? void 0 : -1,
                ...i,
                ref: b,
                onFocus: W(i.onFocus, () => m(!0)),
                onBlur: W(i.onBlur, () => m(!1)),
                onClick: W(i.onClick, () => {
                  p.current !== "mouse" && w();
                }),
                onPointerUp: W(i.onPointerUp, () => {
                  p.current === "mouse" && w();
                }),
                onPointerDown: W(i.onPointerDown, (y) => {
                  p.current = y.pointerType;
                }),
                onPointerMove: W(i.onPointerMove, (y) => {
                  var x;
                  p.current = y.pointerType, o ? (x = c.onItemLeave) == null || x.call(c) : p.current === "mouse" && y.currentTarget.focus({ preventScroll: !0 });
                }),
                onPointerLeave: W(i.onPointerLeave, (y) => {
                  var x;
                  y.currentTarget === document.activeElement && ((x = c.onItemLeave) == null || x.call(c));
                }),
                onKeyDown: W(i.onKeyDown, (y) => {
                  var S;
                  ((S = c.searchRef) == null ? void 0 : S.current) !== "" && y.key === " " || (RC.includes(y.key) && w(), y.key === " " && y.preventDefault());
                })
              }
            )
          }
        )
      }
    );
  }
);
jg.displayName = Mn;
var xr = "SelectItemText", zg = h.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, className: n, style: o, ...a } = e, i = Ot(xr, r), s = Pt(xr, r), c = Lg(xr, r), l = AC(xr, r), [u, d] = h.useState(null), f = ie(
      t,
      (w) => d(w),
      c.onItemTextChange,
      (w) => {
        var y;
        return (y = s.itemTextRefCallback) == null ? void 0 : y.call(s, w, c.value, c.disabled);
      }
    ), m = u == null ? void 0 : u.textContent, b = h.useMemo(
      () => /* @__PURE__ */ v("option", { value: c.value, disabled: c.disabled, children: m }, c.value),
      [c.disabled, c.value, m]
    ), { onNativeOptionAdd: g, onNativeOptionRemove: p } = l;
    return xe(() => (g(b), () => p(b)), [g, p, b]), /* @__PURE__ */ ae(It, { children: [
      /* @__PURE__ */ v(K.span, { id: c.textId, ...a, ref: f }),
      c.isSelected && i.valueNode && !i.valueNodeHasChildren ? Wn.createPortal(a.children, i.valueNode) : null
    ] });
  }
);
zg.displayName = xr;
var Hg = "SelectItemIndicator", Yg = h.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e;
    return Lg(Hg, r).isSelected ? /* @__PURE__ */ v(K.span, { "aria-hidden": !0, ...n, ref: t }) : null;
  }
);
Yg.displayName = Hg;
var cc = "SelectScrollUpButton", Gg = h.forwardRef((e, t) => {
  const r = Pt(cc, e.__scopeSelect), n = el(cc, e.__scopeSelect), [o, a] = h.useState(!1), i = ie(t, n.onScrollButtonChange);
  return xe(() => {
    if (r.viewport && r.isPositioned) {
      let s = function() {
        const l = c.scrollTop > 0;
        a(l);
      };
      const c = r.viewport;
      return s(), c.addEventListener("scroll", s), () => c.removeEventListener("scroll", s);
    }
  }, [r.viewport, r.isPositioned]), o ? /* @__PURE__ */ v(
    Vg,
    {
      ...e,
      ref: i,
      onAutoScroll: () => {
        const { viewport: s, selectedItem: c } = r;
        s && c && (s.scrollTop = s.scrollTop - c.offsetHeight);
      }
    }
  ) : null;
});
Gg.displayName = cc;
var lc = "SelectScrollDownButton", Ug = h.forwardRef((e, t) => {
  const r = Pt(lc, e.__scopeSelect), n = el(lc, e.__scopeSelect), [o, a] = h.useState(!1), i = ie(t, n.onScrollButtonChange);
  return xe(() => {
    if (r.viewport && r.isPositioned) {
      let s = function() {
        const l = c.scrollHeight - c.clientHeight, u = Math.ceil(c.scrollTop) < l;
        a(u);
      };
      const c = r.viewport;
      return s(), c.addEventListener("scroll", s), () => c.removeEventListener("scroll", s);
    }
  }, [r.viewport, r.isPositioned]), o ? /* @__PURE__ */ v(
    Vg,
    {
      ...e,
      ref: i,
      onAutoScroll: () => {
        const { viewport: s, selectedItem: c } = r;
        s && c && (s.scrollTop = s.scrollTop + c.offsetHeight);
      }
    }
  ) : null;
});
Ug.displayName = lc;
var Vg = h.forwardRef((e, t) => {
  const { __scopeSelect: r, onAutoScroll: n, ...o } = e, a = Pt("SelectScrollButton", r), i = h.useRef(null), s = no(r), c = h.useCallback(() => {
    i.current !== null && (window.clearInterval(i.current), i.current = null);
  }, []);
  return h.useEffect(() => () => c(), [c]), xe(() => {
    var u;
    const l = s().find((d) => d.ref.current === document.activeElement);
    (u = l == null ? void 0 : l.ref.current) == null || u.scrollIntoView({ block: "nearest" });
  }, [s]), /* @__PURE__ */ v(
    K.div,
    {
      "aria-hidden": !0,
      ...o,
      ref: t,
      style: { flexShrink: 0, ...o.style },
      onPointerDown: W(o.onPointerDown, () => {
        i.current === null && (i.current = window.setInterval(n, 50));
      }),
      onPointerMove: W(o.onPointerMove, () => {
        var l;
        (l = a.onItemLeave) == null || l.call(a), i.current === null && (i.current = window.setInterval(n, 50));
      }),
      onPointerLeave: W(o.onPointerLeave, () => {
        c();
      })
    }
  );
}), UC = "SelectSeparator", VC = h.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e;
    return /* @__PURE__ */ v(K.div, { "aria-hidden": !0, ...n, ref: t });
  }
);
VC.displayName = UC;
var uc = "SelectArrow", KC = h.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = oo(r), a = Ot(uc, r), i = Pt(uc, r);
    return a.open && i.position === "popper" ? /* @__PURE__ */ v(Zn, { ...o, ...n, ref: t }) : null;
  }
);
KC.displayName = uc;
var XC = "SelectBubbleInput", Kg = h.forwardRef(
  ({ __scopeSelect: e, value: t, ...r }, n) => {
    const o = h.useRef(null), a = ie(n, o), i = Zp(t);
    return h.useEffect(() => {
      const s = o.current;
      if (!s) return;
      const c = window.HTMLSelectElement.prototype, u = Object.getOwnPropertyDescriptor(
        c,
        "value"
      ).set;
      if (i !== t && u) {
        const d = new Event("change", { bubbles: !0 });
        u.call(s, t), s.dispatchEvent(d);
      }
    }, [i, t]), /* @__PURE__ */ v(
      K.select,
      {
        ...r,
        style: { ...lp, ...r.style },
        ref: a,
        defaultValue: t
      }
    );
  }
);
Kg.displayName = XC;
function Xg(e) {
  return e === "" || e === void 0;
}
function Zg(e) {
  const t = We(e), r = h.useRef(""), n = h.useRef(0), o = h.useCallback(
    (i) => {
      const s = r.current + i;
      t(s), (function c(l) {
        r.current = l, window.clearTimeout(n.current), l !== "" && (n.current = window.setTimeout(() => c(""), 1e3));
      })(s);
    },
    [t]
  ), a = h.useCallback(() => {
    r.current = "", window.clearTimeout(n.current);
  }, []);
  return h.useEffect(() => () => window.clearTimeout(n.current), []), [r, o, a];
}
function Qg(e, t, r) {
  const o = t.length > 1 && Array.from(t).every((l) => l === t[0]) ? t[0] : t, a = r ? e.indexOf(r) : -1;
  let i = ZC(e, Math.max(a, 0));
  o.length === 1 && (i = i.filter((l) => l !== r));
  const c = i.find(
    (l) => l.textValue.toLowerCase().startsWith(o.toLowerCase())
  );
  return c !== r ? c : void 0;
}
function ZC(e, t) {
  return e.map((r, n) => e[(t + n) % e.length]);
}
var QC = Eg, JC = Tg, eO = Dg, tO = kg, rO = Ng, nO = Ag, oO = qg, aO = jg, iO = zg, sO = Yg, cO = Gg, lO = Ug, uO = "Separator", du = "horizontal", dO = ["horizontal", "vertical"], Jg = h.forwardRef((e, t) => {
  const { decorative: r, orientation: n = du, ...o } = e, a = fO(n) ? n : du, s = r ? { role: "none" } : { "aria-orientation": a === "vertical" ? a : void 0, role: "separator" };
  return /* @__PURE__ */ v(
    K.div,
    {
      "data-orientation": a,
      ...s,
      ...o,
      ref: t
    }
  );
});
Jg.displayName = uO;
function fO(e) {
  return dO.includes(e);
}
var hO = Jg, ao = "Switch", [pO] = Be(ao), [mO, gO] = pO(ao), ev = h.forwardRef(
  (e, t) => {
    const {
      __scopeSwitch: r,
      name: n,
      checked: o,
      defaultChecked: a,
      required: i,
      disabled: s,
      value: c = "on",
      onCheckedChange: l,
      form: u,
      ...d
    } = e, [f, m] = h.useState(null), b = ie(t, (x) => m(x)), g = h.useRef(!1), p = f ? u || !!f.closest("form") : !0, [w, y] = rt({
      prop: o,
      defaultProp: a ?? !1,
      onChange: l,
      caller: ao
    });
    return /* @__PURE__ */ ae(mO, { scope: r, checked: w, disabled: s, children: [
      /* @__PURE__ */ v(
        K.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": w,
          "aria-required": i,
          "data-state": ov(w),
          "data-disabled": s ? "" : void 0,
          disabled: s,
          value: c,
          ...d,
          ref: b,
          onClick: W(e.onClick, (x) => {
            y((S) => !S), p && (g.current = x.isPropagationStopped(), g.current || x.stopPropagation());
          })
        }
      ),
      p && /* @__PURE__ */ v(
        nv,
        {
          control: f,
          bubbles: !g.current,
          name: n,
          value: c,
          checked: w,
          required: i,
          disabled: s,
          form: u,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
ev.displayName = ao;
var tv = "SwitchThumb", rv = h.forwardRef(
  (e, t) => {
    const { __scopeSwitch: r, ...n } = e, o = gO(tv, r);
    return /* @__PURE__ */ v(
      K.span,
      {
        "data-state": ov(o.checked),
        "data-disabled": o.disabled ? "" : void 0,
        ...n,
        ref: t
      }
    );
  }
);
rv.displayName = tv;
var vO = "SwitchBubbleInput", nv = h.forwardRef(
  ({
    __scopeSwitch: e,
    control: t,
    checked: r,
    bubbles: n = !0,
    ...o
  }, a) => {
    const i = h.useRef(null), s = ie(i, a), c = Zp(r), l = Qp(t);
    return h.useEffect(() => {
      const u = i.current;
      if (!u) return;
      const d = window.HTMLInputElement.prototype, m = Object.getOwnPropertyDescriptor(
        d,
        "checked"
      ).set;
      if (c !== r && m) {
        const b = new Event("click", { bubbles: n });
        m.call(u, r), u.dispatchEvent(b);
      }
    }, [c, r, n]), /* @__PURE__ */ v(
      "input",
      {
        type: "checkbox",
        "aria-hidden": !0,
        defaultChecked: r,
        ...o,
        tabIndex: -1,
        ref: s,
        style: {
          ...o.style,
          ...l,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
nv.displayName = vO;
function ov(e) {
  return e ? "checked" : "unchecked";
}
var bO = ev, yO = rv, io = "Tabs", [wO] = Be(io, [
  Qn
]), av = Qn(), [xO, tl] = wO(io), iv = h.forwardRef(
  (e, t) => {
    const {
      __scopeTabs: r,
      value: n,
      onValueChange: o,
      defaultValue: a,
      orientation: i = "horizontal",
      dir: s,
      activationMode: c = "automatic",
      ...l
    } = e, u = Ln(s), [d, f] = rt({
      prop: n,
      onChange: o,
      defaultProp: a ?? "",
      caller: io
    });
    return /* @__PURE__ */ v(
      xO,
      {
        scope: r,
        baseId: Ce(),
        value: d,
        onValueChange: f,
        orientation: i,
        dir: u,
        activationMode: c,
        children: /* @__PURE__ */ v(
          K.div,
          {
            dir: u,
            "data-orientation": i,
            ...l,
            ref: t
          }
        )
      }
    );
  }
);
iv.displayName = io;
var sv = "TabsList", cv = h.forwardRef(
  (e, t) => {
    const { __scopeTabs: r, loop: n = !0, ...o } = e, a = tl(sv, r), i = av(r);
    return /* @__PURE__ */ v(
      Om,
      {
        asChild: !0,
        ...i,
        orientation: a.orientation,
        dir: a.dir,
        loop: n,
        children: /* @__PURE__ */ v(
          K.div,
          {
            role: "tablist",
            "aria-orientation": a.orientation,
            ...o,
            ref: t
          }
        )
      }
    );
  }
);
cv.displayName = sv;
var lv = "TabsTrigger", uv = h.forwardRef(
  (e, t) => {
    const { __scopeTabs: r, value: n, disabled: o = !1, ...a } = e, i = tl(lv, r), s = av(r), c = hv(i.baseId, n), l = pv(i.baseId, n), u = n === i.value;
    return /* @__PURE__ */ v(
      Pm,
      {
        asChild: !0,
        ...s,
        focusable: !o,
        active: u,
        children: /* @__PURE__ */ v(
          K.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": u,
            "aria-controls": l,
            "data-state": u ? "active" : "inactive",
            "data-disabled": o ? "" : void 0,
            disabled: o,
            id: c,
            ...a,
            ref: t,
            onMouseDown: W(e.onMouseDown, (d) => {
              !o && d.button === 0 && d.ctrlKey === !1 ? i.onValueChange(n) : d.preventDefault();
            }),
            onKeyDown: W(e.onKeyDown, (d) => {
              [" ", "Enter"].includes(d.key) && i.onValueChange(n);
            }),
            onFocus: W(e.onFocus, () => {
              const d = i.activationMode !== "manual";
              !u && !o && d && i.onValueChange(n);
            })
          }
        )
      }
    );
  }
);
uv.displayName = lv;
var dv = "TabsContent", fv = h.forwardRef(
  (e, t) => {
    const { __scopeTabs: r, value: n, forceMount: o, children: a, ...i } = e, s = tl(dv, r), c = hv(s.baseId, n), l = pv(s.baseId, n), u = n === s.value, d = h.useRef(u);
    return h.useEffect(() => {
      const f = requestAnimationFrame(() => d.current = !1);
      return () => cancelAnimationFrame(f);
    }, []), /* @__PURE__ */ v(De, { present: o || u, children: ({ present: f }) => /* @__PURE__ */ v(
      K.div,
      {
        "data-state": u ? "active" : "inactive",
        "data-orientation": s.orientation,
        role: "tabpanel",
        "aria-labelledby": c,
        hidden: !f,
        id: l,
        tabIndex: 0,
        ...i,
        ref: t,
        style: {
          ...e.style,
          animationDuration: d.current ? "0s" : void 0
        },
        children: f && a
      }
    ) });
  }
);
fv.displayName = dv;
function hv(e, t) {
  return `${e}-trigger-${t}`;
}
function pv(e, t) {
  return `${e}-content-${t}`;
}
var _O = iv, SO = cv, CO = uv, OO = fv, [so] = Be("Tooltip", [
  _t
]), co = _t(), mv = "TooltipProvider", PO = 700, dc = "tooltip.open", [EO, rl] = so(mv), gv = (e) => {
  const {
    __scopeTooltip: t,
    delayDuration: r = PO,
    skipDelayDuration: n = 300,
    disableHoverableContent: o = !1,
    children: a
  } = e, i = h.useRef(!0), s = h.useRef(!1), c = h.useRef(0);
  return h.useEffect(() => {
    const l = c.current;
    return () => window.clearTimeout(l);
  }, []), /* @__PURE__ */ v(
    EO,
    {
      scope: t,
      isOpenDelayedRef: i,
      delayDuration: r,
      onOpen: h.useCallback(() => {
        window.clearTimeout(c.current), i.current = !1;
      }, []),
      onClose: h.useCallback(() => {
        window.clearTimeout(c.current), c.current = window.setTimeout(
          () => i.current = !0,
          n
        );
      }, [n]),
      isPointerInTransitRef: s,
      onPointerInTransitChange: h.useCallback((l) => {
        s.current = l;
      }, []),
      disableHoverableContent: o,
      children: a
    }
  );
};
gv.displayName = mv;
var Dr = "Tooltip", [MO, Kr] = so(Dr), vv = (e) => {
  const {
    __scopeTooltip: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: a,
    disableHoverableContent: i,
    delayDuration: s
  } = e, c = rl(Dr, e.__scopeTooltip), l = co(t), [u, d] = h.useState(null), f = Ce(), m = h.useRef(0), b = i ?? c.disableHoverableContent, g = s ?? c.delayDuration, p = h.useRef(!1), [w, y] = rt({
    prop: n,
    defaultProp: o ?? !1,
    onChange: (O) => {
      O ? (c.onOpen(), document.dispatchEvent(new CustomEvent(dc))) : c.onClose(), a == null || a(O);
    },
    caller: Dr
  }), x = h.useMemo(() => w ? p.current ? "delayed-open" : "instant-open" : "closed", [w]), S = h.useCallback(() => {
    window.clearTimeout(m.current), m.current = 0, p.current = !1, y(!0);
  }, [y]), C = h.useCallback(() => {
    window.clearTimeout(m.current), m.current = 0, y(!1);
  }, [y]), _ = h.useCallback(() => {
    window.clearTimeout(m.current), m.current = window.setTimeout(() => {
      p.current = !0, y(!0), m.current = 0;
    }, g);
  }, [g, y]);
  return h.useEffect(() => () => {
    m.current && (window.clearTimeout(m.current), m.current = 0);
  }, []), /* @__PURE__ */ v(jr, { ...l, children: /* @__PURE__ */ v(
    MO,
    {
      scope: t,
      contentId: f,
      open: w,
      stateAttribute: x,
      trigger: u,
      onTriggerChange: d,
      onTriggerEnter: h.useCallback(() => {
        c.isOpenDelayedRef.current ? _() : S();
      }, [c.isOpenDelayedRef, _, S]),
      onTriggerLeave: h.useCallback(() => {
        b ? C() : (window.clearTimeout(m.current), m.current = 0);
      }, [C, b]),
      onOpen: S,
      onClose: C,
      disableHoverableContent: b,
      children: r
    }
  ) });
};
vv.displayName = Dr;
var fc = "TooltipTrigger", bv = h.forwardRef(
  (e, t) => {
    const { __scopeTooltip: r, ...n } = e, o = Kr(fc, r), a = rl(fc, r), i = co(r), s = h.useRef(null), c = ie(t, s, o.onTriggerChange), l = h.useRef(!1), u = h.useRef(!1), d = h.useCallback(() => l.current = !1, []);
    return h.useEffect(() => () => document.removeEventListener("pointerup", d), [d]), /* @__PURE__ */ v(zr, { asChild: !0, ...i, children: /* @__PURE__ */ v(
      K.button,
      {
        "aria-describedby": o.open ? o.contentId : void 0,
        "data-state": o.stateAttribute,
        ...n,
        ref: c,
        onPointerMove: W(e.onPointerMove, (f) => {
          f.pointerType !== "touch" && !u.current && !a.isPointerInTransitRef.current && (o.onTriggerEnter(), u.current = !0);
        }),
        onPointerLeave: W(e.onPointerLeave, () => {
          o.onTriggerLeave(), u.current = !1;
        }),
        onPointerDown: W(e.onPointerDown, () => {
          o.open && o.onClose(), l.current = !0, document.addEventListener("pointerup", d, { once: !0 });
        }),
        onFocus: W(e.onFocus, () => {
          l.current || o.onOpen();
        }),
        onBlur: W(e.onBlur, o.onClose),
        onClick: W(e.onClick, o.onClose)
      }
    ) });
  }
);
bv.displayName = fc;
var nl = "TooltipPortal", [TO, RO] = so(nl, {
  forceMount: void 0
}), yv = (e) => {
  const { __scopeTooltip: t, forceMount: r, children: n, container: o } = e, a = Kr(nl, t);
  return /* @__PURE__ */ v(TO, { scope: t, forceMount: r, children: /* @__PURE__ */ v(De, { present: r || a.open, children: /* @__PURE__ */ v(dr, { asChild: !0, container: o, children: n }) }) });
};
yv.displayName = nl;
var nr = "TooltipContent", wv = h.forwardRef(
  (e, t) => {
    const r = RO(nr, e.__scopeTooltip), { forceMount: n = r.forceMount, side: o = "top", ...a } = e, i = Kr(nr, e.__scopeTooltip);
    return /* @__PURE__ */ v(De, { present: n || i.open, children: i.disableHoverableContent ? /* @__PURE__ */ v(xv, { side: o, ...a, ref: t }) : /* @__PURE__ */ v(DO, { side: o, ...a, ref: t }) });
  }
), DO = h.forwardRef((e, t) => {
  const r = Kr(nr, e.__scopeTooltip), n = rl(nr, e.__scopeTooltip), o = h.useRef(null), a = ie(t, o), [i, s] = h.useState(null), { trigger: c, onClose: l } = r, u = o.current, { onPointerInTransitChange: d } = n, f = h.useCallback(() => {
    s(null), d(!1);
  }, [d]), m = h.useCallback(
    (b, g) => {
      const p = b.currentTarget, w = { x: b.clientX, y: b.clientY }, y = IO(w, p.getBoundingClientRect()), x = $O(w, y), S = FO(g.getBoundingClientRect()), C = WO([...x, ...S]);
      s(C), d(!0);
    },
    [d]
  );
  return h.useEffect(() => () => f(), [f]), h.useEffect(() => {
    if (c && u) {
      const b = (p) => m(p, u), g = (p) => m(p, c);
      return c.addEventListener("pointerleave", b), u.addEventListener("pointerleave", g), () => {
        c.removeEventListener("pointerleave", b), u.removeEventListener("pointerleave", g);
      };
    }
  }, [c, u, m, f]), h.useEffect(() => {
    if (i) {
      const b = (g) => {
        const p = g.target, w = { x: g.clientX, y: g.clientY }, y = (c == null ? void 0 : c.contains(p)) || (u == null ? void 0 : u.contains(p)), x = !qO(w, i);
        y ? f() : x && (f(), l());
      };
      return document.addEventListener("pointermove", b), () => document.removeEventListener("pointermove", b);
    }
  }, [c, u, i, l, f]), /* @__PURE__ */ v(xv, { ...e, ref: a });
}), [kO, NO] = so(Dr, { isInside: !1 }), AO = /* @__PURE__ */ By("TooltipContent"), xv = h.forwardRef(
  (e, t) => {
    const {
      __scopeTooltip: r,
      children: n,
      "aria-label": o,
      onEscapeKeyDown: a,
      onPointerDownOutside: i,
      ...s
    } = e, c = Kr(nr, r), l = co(r), { onClose: u } = c;
    return h.useEffect(() => (document.addEventListener(dc, u), () => document.removeEventListener(dc, u)), [u]), h.useEffect(() => {
      if (c.trigger) {
        const d = (f) => {
          const m = f.target;
          m != null && m.contains(c.trigger) && u();
        };
        return window.addEventListener("scroll", d, { capture: !0 }), () => window.removeEventListener("scroll", d, { capture: !0 });
      }
    }, [c.trigger, u]), /* @__PURE__ */ v(
      ur,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: a,
        onPointerDownOutside: i,
        onFocusOutside: (d) => d.preventDefault(),
        onDismiss: u,
        children: /* @__PURE__ */ ae(
          Xn,
          {
            "data-state": c.stateAttribute,
            ...l,
            ...s,
            ref: t,
            style: {
              ...s.style,
              "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
              "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
              "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
            },
            children: [
              /* @__PURE__ */ v(AO, { children: n }),
              /* @__PURE__ */ v(kO, { scope: r, isInside: !0, children: /* @__PURE__ */ v(Gy, { id: c.contentId, role: "tooltip", children: o || n }) })
            ]
          }
        )
      }
    );
  }
);
wv.displayName = nr;
var _v = "TooltipArrow", Sv = h.forwardRef(
  (e, t) => {
    const { __scopeTooltip: r, ...n } = e, o = co(r);
    return NO(
      _v,
      r
    ).isInside ? null : /* @__PURE__ */ v(Zn, { ...o, ...n, ref: t });
  }
);
Sv.displayName = _v;
function IO(e, t) {
  const r = Math.abs(t.top - e.y), n = Math.abs(t.bottom - e.y), o = Math.abs(t.right - e.x), a = Math.abs(t.left - e.x);
  switch (Math.min(r, n, o, a)) {
    case a:
      return "left";
    case o:
      return "right";
    case r:
      return "top";
    case n:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function $O(e, t, r = 5) {
  const n = [];
  switch (t) {
    case "top":
      n.push(
        { x: e.x - r, y: e.y + r },
        { x: e.x + r, y: e.y + r }
      );
      break;
    case "bottom":
      n.push(
        { x: e.x - r, y: e.y - r },
        { x: e.x + r, y: e.y - r }
      );
      break;
    case "left":
      n.push(
        { x: e.x + r, y: e.y - r },
        { x: e.x + r, y: e.y + r }
      );
      break;
    case "right":
      n.push(
        { x: e.x - r, y: e.y - r },
        { x: e.x - r, y: e.y + r }
      );
      break;
  }
  return n;
}
function FO(e) {
  const { top: t, right: r, bottom: n, left: o } = e;
  return [
    { x: o, y: t },
    { x: r, y: t },
    { x: r, y: n },
    { x: o, y: n }
  ];
}
function qO(e, t) {
  const { x: r, y: n } = e;
  let o = !1;
  for (let a = 0, i = t.length - 1; a < t.length; i = a++) {
    const s = t[a], c = t[i], l = s.x, u = s.y, d = c.x, f = c.y;
    u > n != f > n && r < (d - l) * (n - u) / (f - u) + l && (o = !o);
  }
  return o;
}
function WO(e) {
  const t = e.slice();
  return t.sort((r, n) => r.x < n.x ? -1 : r.x > n.x ? 1 : r.y < n.y ? -1 : r.y > n.y ? 1 : 0), BO(t);
}
function BO(e) {
  if (e.length <= 1) return e.slice();
  const t = [];
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    for (; t.length >= 2; ) {
      const a = t[t.length - 1], i = t[t.length - 2];
      if ((a.x - i.x) * (o.y - i.y) >= (a.y - i.y) * (o.x - i.x)) t.pop();
      else break;
    }
    t.push(o);
  }
  t.pop();
  const r = [];
  for (let n = e.length - 1; n >= 0; n--) {
    const o = e[n];
    for (; r.length >= 2; ) {
      const a = r[r.length - 1], i = r[r.length - 2];
      if ((a.x - i.x) * (o.y - i.y) >= (a.y - i.y) * (o.x - i.x)) r.pop();
      else break;
    }
    r.push(o);
  }
  return r.pop(), t.length === 1 && r.length === 1 && t[0].x === r[0].x && t[0].y === r[0].y ? t : t.concat(r);
}
var LO = gv, jO = vv, zO = bv, HO = yv, YO = wv, GO = Sv;
const UO = (e, t) => {
  const r = new Array(e.length + t.length);
  for (let n = 0; n < e.length; n++)
    r[n] = e[n];
  for (let n = 0; n < t.length; n++)
    r[e.length + n] = t[n];
  return r;
}, VO = (e, t) => ({
  classGroupId: e,
  validator: t
}), Cv = (e = /* @__PURE__ */ new Map(), t = null, r) => ({
  nextPart: e,
  validators: t,
  classGroupId: r
}), Tn = "-", fu = [], KO = "arbitrary..", XO = (e) => {
  const t = QO(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (i) => {
      if (i.startsWith("[") && i.endsWith("]"))
        return ZO(i);
      const s = i.split(Tn), c = s[0] === "" && s.length > 1 ? 1 : 0;
      return Ov(s, c, t);
    },
    getConflictingClassGroupIds: (i, s) => {
      if (s) {
        const c = n[i], l = r[i];
        return c ? l ? UO(l, c) : c : l || fu;
      }
      return r[i] || fu;
    }
  };
}, Ov = (e, t, r) => {
  if (e.length - t === 0)
    return r.classGroupId;
  const o = e[t], a = r.nextPart.get(o);
  if (a) {
    const l = Ov(e, t + 1, a);
    if (l) return l;
  }
  const i = r.validators;
  if (i === null)
    return;
  const s = t === 0 ? e.join(Tn) : e.slice(t).join(Tn), c = i.length;
  for (let l = 0; l < c; l++) {
    const u = i[l];
    if (u.validator(s))
      return u.classGroupId;
  }
}, ZO = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), r = t.indexOf(":"), n = t.slice(0, r);
  return n ? KO + n : void 0;
})(), QO = (e) => {
  const {
    theme: t,
    classGroups: r
  } = e;
  return JO(r, t);
}, JO = (e, t) => {
  const r = Cv();
  for (const n in e) {
    const o = e[n];
    ol(o, r, n, t);
  }
  return r;
}, ol = (e, t, r, n) => {
  const o = e.length;
  for (let a = 0; a < o; a++) {
    const i = e[a];
    e0(i, t, r, n);
  }
}, e0 = (e, t, r, n) => {
  if (typeof e == "string") {
    t0(e, t, r);
    return;
  }
  if (typeof e == "function") {
    r0(e, t, r, n);
    return;
  }
  n0(e, t, r, n);
}, t0 = (e, t, r) => {
  const n = e === "" ? t : Pv(t, e);
  n.classGroupId = r;
}, r0 = (e, t, r, n) => {
  if (o0(e)) {
    ol(e(n), t, r, n);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(VO(r, e));
}, n0 = (e, t, r, n) => {
  const o = Object.entries(e), a = o.length;
  for (let i = 0; i < a; i++) {
    const [s, c] = o[i];
    ol(c, Pv(t, s), r, n);
  }
}, Pv = (e, t) => {
  let r = e;
  const n = t.split(Tn), o = n.length;
  for (let a = 0; a < o; a++) {
    const i = n[a];
    let s = r.nextPart.get(i);
    s || (s = Cv(), r.nextPart.set(i, s)), r = s;
  }
  return r;
}, o0 = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, a0 = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null);
  const o = (a, i) => {
    r[a] = i, t++, t > e && (t = 0, n = r, r = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(a) {
      let i = r[a];
      if (i !== void 0)
        return i;
      if ((i = n[a]) !== void 0)
        return o(a, i), i;
    },
    set(a, i) {
      a in r ? r[a] = i : o(a, i);
    }
  };
}, hc = "!", hu = ":", i0 = [], pu = (e, t, r, n, o) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: r,
  maybePostfixModifierPosition: n,
  isExternal: o
}), s0 = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: r
  } = e;
  let n = (o) => {
    const a = [];
    let i = 0, s = 0, c = 0, l;
    const u = o.length;
    for (let g = 0; g < u; g++) {
      const p = o[g];
      if (i === 0 && s === 0) {
        if (p === hu) {
          a.push(o.slice(c, g)), c = g + 1;
          continue;
        }
        if (p === "/") {
          l = g;
          continue;
        }
      }
      p === "[" ? i++ : p === "]" ? i-- : p === "(" ? s++ : p === ")" && s--;
    }
    const d = a.length === 0 ? o : o.slice(c);
    let f = d, m = !1;
    d.endsWith(hc) ? (f = d.slice(0, -1), m = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      d.startsWith(hc) && (f = d.slice(1), m = !0)
    );
    const b = l && l > c ? l - c : void 0;
    return pu(a, m, f, b);
  };
  if (t) {
    const o = t + hu, a = n;
    n = (i) => i.startsWith(o) ? a(i.slice(o.length)) : pu(i0, !1, i, void 0, !0);
  }
  if (r) {
    const o = n;
    n = (a) => r({
      className: a,
      parseClassName: o
    });
  }
  return n;
}, c0 = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((r, n) => {
    t.set(r, 1e6 + n);
  }), (r) => {
    const n = [];
    let o = [];
    for (let a = 0; a < r.length; a++) {
      const i = r[a], s = i[0] === "[", c = t.has(i);
      s || c ? (o.length > 0 && (o.sort(), n.push(...o), o = []), n.push(i)) : o.push(i);
    }
    return o.length > 0 && (o.sort(), n.push(...o)), n;
  };
}, l0 = (e) => ({
  cache: a0(e.cacheSize),
  parseClassName: s0(e),
  sortModifiers: c0(e),
  ...XO(e)
}), u0 = /\s+/, d0 = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: o,
    sortModifiers: a
  } = t, i = [], s = e.trim().split(u0);
  let c = "";
  for (let l = s.length - 1; l >= 0; l -= 1) {
    const u = s[l], {
      isExternal: d,
      modifiers: f,
      hasImportantModifier: m,
      baseClassName: b,
      maybePostfixModifierPosition: g
    } = r(u);
    if (d) {
      c = u + (c.length > 0 ? " " + c : c);
      continue;
    }
    let p = !!g, w = n(p ? b.substring(0, g) : b);
    if (!w) {
      if (!p) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (w = n(b), !w) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      p = !1;
    }
    const y = f.length === 0 ? "" : f.length === 1 ? f[0] : a(f).join(":"), x = m ? y + hc : y, S = x + w;
    if (i.indexOf(S) > -1)
      continue;
    i.push(S);
    const C = o(w, p);
    for (let _ = 0; _ < C.length; ++_) {
      const O = C[_];
      i.push(x + O);
    }
    c = u + (c.length > 0 ? " " + c : c);
  }
  return c;
}, f0 = (...e) => {
  let t = 0, r, n, o = "";
  for (; t < e.length; )
    (r = e[t++]) && (n = Ev(r)) && (o && (o += " "), o += n);
  return o;
}, Ev = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (t = Ev(e[n])) && (r && (r += " "), r += t);
  return r;
}, h0 = (e, ...t) => {
  let r, n, o, a;
  const i = (c) => {
    const l = t.reduce((u, d) => d(u), e());
    return r = l0(l), n = r.cache.get, o = r.cache.set, a = s, s(c);
  }, s = (c) => {
    const l = n(c);
    if (l)
      return l;
    const u = d0(c, r);
    return o(c, u), u;
  };
  return a = i, (...c) => a(f0(...c));
}, p0 = [], we = (e) => {
  const t = (r) => r[e] || p0;
  return t.isThemeGetter = !0, t;
}, Mv = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Tv = /^\((?:(\w[\w-]*):)?(.+)\)$/i, m0 = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, g0 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, v0 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, b0 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, y0 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, w0 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, mt = (e) => m0.test(e), J = (e) => !!e && !Number.isNaN(Number(e)), gt = (e) => !!e && Number.isInteger(Number(e)), Lo = (e) => e.endsWith("%") && J(e.slice(0, -1)), st = (e) => g0.test(e), Rv = () => !0, x0 = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  v0.test(e) && !b0.test(e)
), al = () => !1, _0 = (e) => y0.test(e), S0 = (e) => w0.test(e), C0 = (e) => !j(e) && !H(e), O0 = (e) => Et(e, Nv, al), j = (e) => Mv.test(e), Dt = (e) => Et(e, Av, x0), mu = (e) => Et(e, N0, J), P0 = (e) => Et(e, $v, Rv), E0 = (e) => Et(e, Iv, al), gu = (e) => Et(e, Dv, al), M0 = (e) => Et(e, kv, S0), un = (e) => Et(e, Fv, _0), H = (e) => Tv.test(e), gr = (e) => Lt(e, Av), T0 = (e) => Lt(e, Iv), vu = (e) => Lt(e, Dv), R0 = (e) => Lt(e, Nv), D0 = (e) => Lt(e, kv), dn = (e) => Lt(e, Fv, !0), k0 = (e) => Lt(e, $v, !0), Et = (e, t, r) => {
  const n = Mv.exec(e);
  return n ? n[1] ? t(n[1]) : r(n[2]) : !1;
}, Lt = (e, t, r = !1) => {
  const n = Tv.exec(e);
  return n ? n[1] ? t(n[1]) : r : !1;
}, Dv = (e) => e === "position" || e === "percentage", kv = (e) => e === "image" || e === "url", Nv = (e) => e === "length" || e === "size" || e === "bg-size", Av = (e) => e === "length", N0 = (e) => e === "number", Iv = (e) => e === "family-name", $v = (e) => e === "number" || e === "weight", Fv = (e) => e === "shadow", A0 = () => {
  const e = we("color"), t = we("font"), r = we("text"), n = we("font-weight"), o = we("tracking"), a = we("leading"), i = we("breakpoint"), s = we("container"), c = we("spacing"), l = we("radius"), u = we("shadow"), d = we("inset-shadow"), f = we("text-shadow"), m = we("drop-shadow"), b = we("blur"), g = we("perspective"), p = we("aspect"), w = we("ease"), y = we("animate"), x = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], S = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], C = () => [...S(), H, j], _ = () => ["auto", "hidden", "clip", "visible", "scroll"], O = () => ["auto", "contain", "none"], P = () => [H, j, c], R = () => [mt, "full", "auto", ...P()], A = () => [gt, "none", "subgrid", H, j], D = () => ["auto", {
    span: ["full", gt, H, j]
  }, gt, H, j], B = () => [gt, "auto", H, j], k = () => ["auto", "min", "max", "fr", H, j], $ = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], F = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], I = () => ["auto", ...P()], Y = () => [mt, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...P()], q = () => [mt, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...P()], N = () => [mt, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...P()], M = () => [e, H, j], X = () => [...S(), vu, gu, {
    position: [H, j]
  }], le = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], me = () => ["auto", "cover", "contain", R0, O0, {
    size: [H, j]
  }], ge = () => [Lo, gr, Dt], se = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    l,
    H,
    j
  ], ne = () => ["", J, gr, Dt], z = () => ["solid", "dashed", "dotted", "double"], re = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], U = () => [J, Lo, vu, gu], Q = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    b,
    H,
    j
  ], ee = () => ["none", J, H, j], te = () => ["none", J, H, j], be = () => [J, H, j], L = () => [mt, "full", ...P()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [st],
      breakpoint: [st],
      color: [Rv],
      container: [st],
      "drop-shadow": [st],
      ease: ["in", "out", "in-out"],
      font: [C0],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [st],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [st],
      shadow: [st],
      spacing: ["px", J],
      text: [st],
      "text-shadow": [st],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", mt, j, H, p]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [J, j, H, s]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": x()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": x()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: C()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: _()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": _()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": _()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: O()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": O()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": O()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: R()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": R()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": R()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": R(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: R()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": R(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: R()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": R()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": R()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: R()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: R()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: R()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: R()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [gt, "auto", H, j]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [mt, "full", "auto", s, ...P()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [J, mt, "auto", "initial", "none", j]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", J, H, j]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", J, H, j]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [gt, "first", "last", "none", H, j]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": A()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: D()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": B()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": B()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": A()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: D()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": B()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": B()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": k()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": k()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: P()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": P()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": P()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...$(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...F(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...F()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...$()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...F(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...F(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": $()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...F(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...F()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: P()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: P()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: P()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: P()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: P()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: P()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: P()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: P()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: P()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: P()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: P()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: I()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: I()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: I()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: I()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: I()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: I()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: I()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: I()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: I()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: I()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: I()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": P()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": P()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: Y()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...q()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...q()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...q()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...N()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...N()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...N()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [s, "screen", ...Y()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          s,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...Y()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          s,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [i]
          },
          ...Y()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...Y()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...Y()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...Y()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", r, gr, Dt]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [n, k0, P0]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Lo, j]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [T0, E0, t]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [j]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [o, H, j]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [J, "none", H, mu]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          a,
          ...P()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", H, j]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", H, j]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: M()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: M()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...z(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [J, "from-font", "auto", H, Dt]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: M()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [J, "auto", H, j]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: P()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", H, j]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", H, j]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: X()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: le()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: me()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, gt, H, j],
          radial: ["", H, j],
          conic: [gt, H, j]
        }, D0, M0]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: M()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: ge()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: ge()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: ge()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: M()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: M()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: M()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: se()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": se()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": se()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": se()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": se()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": se()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": se()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": se()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": se()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": se()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": se()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": se()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": se()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": se()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": se()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: ne()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": ne()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": ne()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": ne()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": ne()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": ne()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": ne()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": ne()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": ne()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": ne()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": ne()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": ne()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": ne()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...z(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...z(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: M()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": M()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": M()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": M()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": M()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": M()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": M()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": M()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": M()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": M()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": M()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: M()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...z(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [J, H, j]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", J, gr, Dt]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: M()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          u,
          dn,
          un
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: M()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", d, dn, un]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": M()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: ne()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: M()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [J, Dt]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": M()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": ne()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": M()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", f, dn, un]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": M()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [J, H, j]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...re(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": re()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [J]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": U()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": U()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": M()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": M()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": U()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": U()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": M()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": M()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": U()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": U()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": M()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": M()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": U()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": U()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": M()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": M()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": U()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": U()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": M()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": M()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": U()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": U()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": M()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": M()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": U()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": U()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": M()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": M()
      }],
      "mask-image-radial": [{
        "mask-radial": [H, j]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": U()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": U()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": M()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": M()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": S()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [J]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": U()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": U()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": M()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": M()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: X()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: le()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: me()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", H, j]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          H,
          j
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: Q()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [J, H, j]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [J, H, j]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          m,
          dn,
          un
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": M()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", J, H, j]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [J, H, j]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", J, H, j]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [J, H, j]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", J, H, j]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          H,
          j
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": Q()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [J, H, j]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [J, H, j]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", J, H, j]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [J, H, j]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", J, H, j]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [J, H, j]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [J, H, j]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", J, H, j]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": P()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": P()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": P()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", H, j]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [J, "initial", H, j]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", w, H, j]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [J, H, j]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", y, H, j]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [g, H, j]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": C()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: ee()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": ee()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": ee()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": ee()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: te()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": te()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": te()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": te()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: be()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": be()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": be()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [H, j, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: C()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: L()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": L()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": L()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": L()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: M()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: M()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", H, j]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": P()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": P()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": P()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": P()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": P()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": P()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": P()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": P()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": P()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": P()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": P()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": P()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": P()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": P()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": P()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": P()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": P()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": P()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": P()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": P()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": P()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": P()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", H, j]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...M()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [J, gr, Dt, mu]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...M()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, I0 = /* @__PURE__ */ h0(A0);
function T(...e) {
  return I0(dt(e));
}
const $0 = ip(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]",
        destructive: "bg-destructive/80 text-white backdrop-blur-md hover:bg-destructive/90 focus-visible:ring-destructive/20 border border-destructive/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
        outline: "border border-white/10 bg-white/5 backdrop-blur-md shadow-xs hover:bg-white/10 hover:text-accent-foreground",
        secondary: "bg-secondary/40 backdrop-blur-md text-secondary-foreground hover:bg-secondary/60 border border-white/5",
        ghost: "hover:bg-white/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function qv({
  className: e,
  variant: t = "default",
  size: r = "default",
  asChild: n = !1,
  ...o
}) {
  return /* @__PURE__ */ v(
    n ? lr : "button",
    {
      "data-slot": "button",
      "data-variant": t,
      "data-size": r,
      className: T($0({ variant: t, size: r, className: e })),
      ...o
    }
  );
}
function Xk({
  className: e,
  size: t = "default",
  ...r
}) {
  return /* @__PURE__ */ v(
    Sx,
    {
      "data-slot": "avatar",
      "data-size": t,
      className: T(
        "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        e
      ),
      ...r
    }
  );
}
function Zk({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    Cx,
    {
      "data-slot": "avatar-image",
      className: T("aspect-square size-full", e),
      ...t
    }
  );
}
function Qk({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    Ox,
    {
      "data-slot": "avatar-fallback",
      className: T(
        "bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs",
        e
      ),
      ...t
    }
  );
}
function Jk({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "span",
    {
      "data-slot": "avatar-badge",
      className: T(
        "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        e
      ),
      ...t
    }
  );
}
function eN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "avatar-group",
      className: T(
        "*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2",
        e
      ),
      ...t
    }
  );
}
function tN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "avatar-group-count",
      className: T(
        "bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        e
      ),
      ...t
    }
  );
}
function rN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card",
      className: T(
        "bg-veloce-glass backdrop-blur-2xl text-card-foreground flex flex-col gap-6 rounded-[2rem] border border-white/5 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:bg-white/5 hover:border-white/10",
        e
      ),
      ...t
    }
  );
}
function nN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-header",
      className: T(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        e
      ),
      ...t
    }
  );
}
function oN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-title",
      className: T("leading-none font-semibold", e),
      ...t
    }
  );
}
function aN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-description",
      className: T("text-muted-foreground text-sm", e),
      ...t
    }
  );
}
function iN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-action",
      className: T(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        e
      ),
      ...t
    }
  );
}
function sN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-content",
      className: T("px-6", e),
      ...t
    }
  );
}
function cN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-footer",
      className: T("flex items-center px-6 [.border-t]:pt-6", e),
      ...t
    }
  );
}
function F0({ className: e, type: t, ...r }) {
  return /* @__PURE__ */ v(
    "input",
    {
      type: t,
      "data-slot": "input",
      className: T(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        e
      ),
      ...r
    }
  );
}
function q0({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    pC,
    {
      "data-slot": "label",
      className: T(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        e
      ),
      ...t
    }
  );
}
function lN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "textarea",
    {
      "data-slot": "textarea",
      className: T(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        e
      ),
      ...t
    }
  );
}
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wv = (...e) => e.filter((t, r, n) => !!t && t.trim() !== "" && n.indexOf(t) === r).join(" ").trim();
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const W0 = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const B0 = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, r, n) => n ? n.toUpperCase() : r.toLowerCase()
);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bu = (e) => {
  const t = B0(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var L0 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const j0 = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
  return !1;
};
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const z0 = Rc(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: n,
    className: o = "",
    children: a,
    iconNode: i,
    ...s
  }, c) => Qs(
    "svg",
    {
      ref: c,
      ...L0,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: n ? Number(r) * 24 / Number(t) : r,
      className: Wv("lucide", o),
      ...!a && !j0(s) && { "aria-hidden": "true" },
      ...s
    },
    [
      ...i.map(([l, u]) => Qs(l, u)),
      ...Array.isArray(a) ? a : [a]
    ]
  )
);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mt = (e, t) => {
  const r = Rc(
    ({ className: n, ...o }, a) => Qs(z0, {
      ref: a,
      iconNode: t,
      className: Wv(
        `lucide-${W0(bu(e))}`,
        `lucide-${e}`,
        n
      ),
      ...o
    })
  );
  return r.displayName = bu(e), r;
};
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const H0 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], Bv = Mt("check", H0);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Y0 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Lv = Mt("chevron-down", Y0);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const G0 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]], U0 = Mt("chevron-left", G0);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const V0 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], pc = Mt("chevron-right", V0);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const K0 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], X0 = Mt("chevron-up", K0);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Z0 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]], Q0 = Mt("circle", Z0);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const J0 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }]
], eP = Mt("panel-left", J0);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tP = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], jv = Mt("x", tP);
function uN({
  ...e
}) {
  return /* @__PURE__ */ v(QC, { "data-slot": "select", ...e });
}
function dN({
  ...e
}) {
  return /* @__PURE__ */ v(eO, { "data-slot": "select-value", ...e });
}
function fN({
  className: e,
  triggerClassName: t,
  size: r = "default",
  children: n,
  fullWidth: o = !1,
  ...a
}) {
  return /* @__PURE__ */ ae(
    JC,
    {
      "data-slot": "select-trigger",
      "data-size": r,
      className: T(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        o && "w-full",
        t,
        e
      ),
      ...a,
      children: [
        n,
        /* @__PURE__ */ v(tO, { asChild: !0, children: /* @__PURE__ */ v(Lv, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function hN({
  className: e,
  contentClassName: t,
  children: r,
  position: n = "popper",
  align: o = "center",
  zIndex: a = "2100",
  ...i
}) {
  return /* @__PURE__ */ v(rO, { children: /* @__PURE__ */ ae(
    nO,
    {
      "data-slot": "select-content",
      className: T(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        n === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        `z-[${a}]`,
        t,
        e
      ),
      position: n,
      align: o,
      ...i,
      children: [
        /* @__PURE__ */ v(rP, {}),
        /* @__PURE__ */ v(
          oO,
          {
            className: T(
              "p-1",
              n === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children: r
          }
        ),
        /* @__PURE__ */ v(nP, {})
      ]
    }
  ) });
}
function pN({
  className: e,
  children: t,
  ...r
}) {
  return /* @__PURE__ */ ae(
    aO,
    {
      "data-slot": "select-item",
      className: T(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        e
      ),
      ...r,
      children: [
        /* @__PURE__ */ v(
          "span",
          {
            "data-slot": "select-item-indicator",
            className: "absolute right-2 flex size-3.5 items-center justify-center",
            children: /* @__PURE__ */ v(sO, { children: /* @__PURE__ */ v(Bv, { className: "size-4" }) })
          }
        ),
        /* @__PURE__ */ v(iO, { children: t })
      ]
    }
  );
}
function rP({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    cO,
    {
      "data-slot": "select-scroll-up-button",
      className: T(
        "flex cursor-default items-center justify-center py-1",
        e
      ),
      ...t,
      children: /* @__PURE__ */ v(X0, { className: "size-4" })
    }
  );
}
function nP({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    lO,
    {
      "data-slot": "select-scroll-down-button",
      className: T(
        "flex cursor-default items-center justify-center py-1",
        e
      ),
      ...t,
      children: /* @__PURE__ */ v(Lv, { className: "size-4" })
    }
  );
}
function mN({
  className: e,
  size: t = "default",
  ...r
}) {
  return /* @__PURE__ */ v(
    bO,
    {
      "data-slot": "switch",
      "data-size": t,
      className: T(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        e
      ),
      ...r,
      children: /* @__PURE__ */ v(
        yO,
        {
          "data-slot": "switch-thumb",
          className: T(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
function oP(e, t, r = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: e,
    timeZoneName: r
  }).format(t).split(/\s/g).slice(2).join(" ");
}
const jo = {}, _r = {};
function At(e, t) {
  try {
    const n = (jo[e] || (jo[e] = new Intl.DateTimeFormat("en-US", {
      timeZone: e,
      timeZoneName: "longOffset"
    }).format))(t).split("GMT")[1];
    return n in _r ? _r[n] : yu(n, n.split(":"));
  } catch {
    if (e in _r) return _r[e];
    const r = e == null ? void 0 : e.match(aP);
    return r ? yu(e, r.slice(1)) : NaN;
  }
}
const aP = /([+-]\d\d):?(\d\d)?/;
function yu(e, t) {
  const r = +(t[0] || 0), n = +(t[1] || 0), o = +(t[2] || 0) / 60;
  return _r[e] = r * 60 + n > 0 ? r * 60 + n + o : r * 60 - n - o;
}
class et extends Date {
  //#region static
  constructor(...t) {
    super(), t.length > 1 && typeof t[t.length - 1] == "string" && (this.timeZone = t.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(At(this.timeZone, this)) ? this.setTime(NaN) : t.length ? typeof t[0] == "number" && (t.length === 1 || t.length === 2 && typeof t[1] != "number") ? this.setTime(t[0]) : typeof t[0] == "string" ? this.setTime(+new Date(t[0])) : t[0] instanceof Date ? this.setTime(+t[0]) : (this.setTime(+new Date(...t)), zv(this), mc(this)) : this.setTime(Date.now());
  }
  static tz(t, ...r) {
    return r.length ? new et(...r, t) : new et(Date.now(), t);
  }
  //#endregion
  //#region time zone
  withTimeZone(t) {
    return new et(+this, t);
  }
  getTimezoneOffset() {
    const t = -At(this.timeZone, this);
    return t > 0 ? Math.floor(t) : Math.ceil(t);
  }
  //#endregion
  //#region time
  setTime(t) {
    return Date.prototype.setTime.apply(this, arguments), mc(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](t) {
    return new et(+new Date(t), this.timeZone);
  }
  //#endregion
}
const wu = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((e) => {
  if (!wu.test(e)) return;
  const t = e.replace(wu, "$1UTC");
  et.prototype[t] && (e.startsWith("get") ? et.prototype[e] = function() {
    return this.internal[t]();
  } : (et.prototype[e] = function() {
    return Date.prototype[t].apply(this.internal, arguments), iP(this), +this;
  }, et.prototype[t] = function() {
    return Date.prototype[t].apply(this, arguments), mc(this), +this;
  }));
});
function mc(e) {
  e.internal.setTime(+e), e.internal.setUTCSeconds(e.internal.getUTCSeconds() - Math.round(-At(e.timeZone, e) * 60));
}
function iP(e) {
  Date.prototype.setFullYear.call(e, e.internal.getUTCFullYear(), e.internal.getUTCMonth(), e.internal.getUTCDate()), Date.prototype.setHours.call(e, e.internal.getUTCHours(), e.internal.getUTCMinutes(), e.internal.getUTCSeconds(), e.internal.getUTCMilliseconds()), zv(e);
}
function zv(e) {
  const t = At(e.timeZone, e), r = t > 0 ? Math.floor(t) : Math.ceil(t), n = /* @__PURE__ */ new Date(+e);
  n.setUTCHours(n.getUTCHours() - 1);
  const o = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset(), a = -(/* @__PURE__ */ new Date(+n)).getTimezoneOffset(), i = o - a, s = Date.prototype.getHours.apply(e) !== e.internal.getUTCHours();
  i && s && e.internal.setUTCMinutes(e.internal.getUTCMinutes() + i);
  const c = o - r;
  c && Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + c);
  const l = /* @__PURE__ */ new Date(+e);
  l.setUTCSeconds(0);
  const u = o > 0 ? l.getSeconds() : (l.getSeconds() - 60) % 60, d = Math.round(-(At(e.timeZone, e) * 60)) % 60;
  (d || u) && (e.internal.setUTCSeconds(e.internal.getUTCSeconds() + d), Date.prototype.setUTCSeconds.call(e, Date.prototype.getUTCSeconds.call(e) + d + u));
  const f = At(e.timeZone, e), m = f > 0 ? Math.floor(f) : Math.ceil(f), g = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset() - m, p = m !== r, w = g - c;
  if (p && w) {
    Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + w);
    const y = At(e.timeZone, e), x = y > 0 ? Math.floor(y) : Math.ceil(y), S = m - x;
    S && (e.internal.setUTCMinutes(e.internal.getUTCMinutes() + S), Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + S));
  }
}
class _e extends et {
  //#region static
  static tz(t, ...r) {
    return r.length ? new _e(...r, t) : new _e(Date.now(), t);
  }
  //#endregion
  //#region representation
  toISOString() {
    const [t, r, n] = this.tzComponents(), o = `${t}${r}:${n}`;
    return this.internal.toISOString().slice(0, -1) + o;
  }
  toString() {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }
  toDateString() {
    const [t, r, n, o] = this.internal.toUTCString().split(" ");
    return `${t == null ? void 0 : t.slice(0, -1)} ${n} ${r} ${o}`;
  }
  toTimeString() {
    const t = this.internal.toUTCString().split(" ")[4], [r, n, o] = this.tzComponents();
    return `${t} GMT${r}${n}${o} (${oP(this.timeZone, this)})`;
  }
  toLocaleString(t, r) {
    return Date.prototype.toLocaleString.call(this, t, {
      ...r,
      timeZone: (r == null ? void 0 : r.timeZone) || this.timeZone
    });
  }
  toLocaleDateString(t, r) {
    return Date.prototype.toLocaleDateString.call(this, t, {
      ...r,
      timeZone: (r == null ? void 0 : r.timeZone) || this.timeZone
    });
  }
  toLocaleTimeString(t, r) {
    return Date.prototype.toLocaleTimeString.call(this, t, {
      ...r,
      timeZone: (r == null ? void 0 : r.timeZone) || this.timeZone
    });
  }
  //#endregion
  //#region private
  tzComponents() {
    const t = this.getTimezoneOffset(), r = t > 0 ? "-" : "+", n = String(Math.floor(Math.abs(t) / 60)).padStart(2, "0"), o = String(Math.abs(t) % 60).padStart(2, "0");
    return [r, n, o];
  }
  //#endregion
  withTimeZone(t) {
    return new _e(+this, t);
  }
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](t) {
    return new _e(+new Date(t), this.timeZone);
  }
  //#endregion
}
const Hv = 6048e5, sP = 864e5, xu = Symbol.for("constructDateFrom");
function ye(e, t) {
  return typeof e == "function" ? e(t) : e && typeof e == "object" && xu in e ? e[xu](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
function pe(e, t) {
  return ye(t || e, e);
}
function Yv(e, t, r) {
  const n = pe(e, r == null ? void 0 : r.in);
  return isNaN(t) ? ye(e, NaN) : (t && n.setDate(n.getDate() + t), n);
}
function Gv(e, t, r) {
  const n = pe(e, r == null ? void 0 : r.in);
  if (isNaN(t)) return ye(e, NaN);
  if (!t)
    return n;
  const o = n.getDate(), a = ye(e, n.getTime());
  a.setMonth(n.getMonth() + t + 1, 0);
  const i = a.getDate();
  return o >= i ? a : (n.setFullYear(
    a.getFullYear(),
    a.getMonth(),
    o
  ), n);
}
let cP = {};
function Xr() {
  return cP;
}
function or(e, t) {
  var s, c, l, u;
  const r = Xr(), n = (t == null ? void 0 : t.weekStartsOn) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? r.weekStartsOn ?? ((u = (l = r.locale) == null ? void 0 : l.options) == null ? void 0 : u.weekStartsOn) ?? 0, o = pe(e, t == null ? void 0 : t.in), a = o.getDay(), i = (a < n ? 7 : 0) + a - n;
  return o.setDate(o.getDate() - i), o.setHours(0, 0, 0, 0), o;
}
function kr(e, t) {
  return or(e, { ...t, weekStartsOn: 1 });
}
function Uv(e, t) {
  const r = pe(e, t == null ? void 0 : t.in), n = r.getFullYear(), o = ye(r, 0);
  o.setFullYear(n + 1, 0, 4), o.setHours(0, 0, 0, 0);
  const a = kr(o), i = ye(r, 0);
  i.setFullYear(n, 0, 4), i.setHours(0, 0, 0, 0);
  const s = kr(i);
  return r.getTime() >= a.getTime() ? n + 1 : r.getTime() >= s.getTime() ? n : n - 1;
}
function _u(e) {
  const t = pe(e), r = new Date(
    Date.UTC(
      t.getFullYear(),
      t.getMonth(),
      t.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    )
  );
  return r.setUTCFullYear(t.getFullYear()), +e - +r;
}
function mr(e, ...t) {
  const r = ye.bind(
    null,
    t.find((n) => typeof n == "object")
  );
  return t.map(r);
}
function Nr(e, t) {
  const r = pe(e, t == null ? void 0 : t.in);
  return r.setHours(0, 0, 0, 0), r;
}
function il(e, t, r) {
  const [n, o] = mr(
    r == null ? void 0 : r.in,
    e,
    t
  ), a = Nr(n), i = Nr(o), s = +a - _u(a), c = +i - _u(i);
  return Math.round((s - c) / sP);
}
function lP(e, t) {
  const r = Uv(e, t), n = ye(e, 0);
  return n.setFullYear(r, 0, 4), n.setHours(0, 0, 0, 0), kr(n);
}
function uP(e, t, r) {
  return Yv(e, t * 7, r);
}
function dP(e, t, r) {
  return Gv(e, t * 12, r);
}
function fP(e, t) {
  let r, n = t == null ? void 0 : t.in;
  return e.forEach((o) => {
    !n && typeof o == "object" && (n = ye.bind(null, o));
    const a = pe(o, n);
    (!r || r < a || isNaN(+a)) && (r = a);
  }), ye(n, r || NaN);
}
function hP(e, t) {
  let r, n = t == null ? void 0 : t.in;
  return e.forEach((o) => {
    !n && typeof o == "object" && (n = ye.bind(null, o));
    const a = pe(o, n);
    (!r || r > a || isNaN(+a)) && (r = a);
  }), ye(n, r || NaN);
}
function pP(e, t, r) {
  const [n, o] = mr(
    r == null ? void 0 : r.in,
    e,
    t
  );
  return +Nr(n) == +Nr(o);
}
function Vv(e) {
  return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
function mP(e) {
  return !(!Vv(e) && typeof e != "number" || isNaN(+pe(e)));
}
function Kv(e, t, r) {
  const [n, o] = mr(
    r == null ? void 0 : r.in,
    e,
    t
  ), a = n.getFullYear() - o.getFullYear(), i = n.getMonth() - o.getMonth();
  return a * 12 + i;
}
function gP(e, t) {
  const r = pe(e, t == null ? void 0 : t.in), n = r.getMonth();
  return r.setFullYear(r.getFullYear(), n + 1, 0), r.setHours(23, 59, 59, 999), r;
}
function Xv(e, t) {
  const [r, n] = mr(e, t.start, t.end);
  return { start: r, end: n };
}
function vP(e, t) {
  const { start: r, end: n } = Xv(t == null ? void 0 : t.in, e);
  let o = +r > +n;
  const a = o ? +r : +n, i = o ? n : r;
  i.setHours(0, 0, 0, 0), i.setDate(1);
  let s = 1;
  const c = [];
  for (; +i <= a; )
    c.push(ye(r, i)), i.setMonth(i.getMonth() + s);
  return o ? c.reverse() : c;
}
function bP(e, t) {
  const r = pe(e, t == null ? void 0 : t.in);
  return r.setDate(1), r.setHours(0, 0, 0, 0), r;
}
function yP(e, t) {
  const r = pe(e, t == null ? void 0 : t.in), n = r.getFullYear();
  return r.setFullYear(n + 1, 0, 0), r.setHours(23, 59, 59, 999), r;
}
function Zv(e, t) {
  const r = pe(e, t == null ? void 0 : t.in);
  return r.setFullYear(r.getFullYear(), 0, 1), r.setHours(0, 0, 0, 0), r;
}
function wP(e, t) {
  const { start: r, end: n } = Xv(t == null ? void 0 : t.in, e);
  let o = +r > +n;
  const a = o ? +r : +n, i = o ? n : r;
  i.setHours(0, 0, 0, 0), i.setMonth(0, 1);
  let s = 1;
  const c = [];
  for (; +i <= a; )
    c.push(ye(r, i)), i.setFullYear(i.getFullYear() + s);
  return o ? c.reverse() : c;
}
function Qv(e, t) {
  var s, c, l, u;
  const r = Xr(), n = (t == null ? void 0 : t.weekStartsOn) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? r.weekStartsOn ?? ((u = (l = r.locale) == null ? void 0 : l.options) == null ? void 0 : u.weekStartsOn) ?? 0, o = pe(e, t == null ? void 0 : t.in), a = o.getDay(), i = (a < n ? -7 : 0) + 6 - (a - n);
  return o.setDate(o.getDate() + i), o.setHours(23, 59, 59, 999), o;
}
function xP(e, t) {
  return Qv(e, { ...t, weekStartsOn: 1 });
}
const _P = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
}, SP = (e, t, r) => {
  let n;
  const o = _P[e];
  return typeof o == "string" ? n = o : t === 1 ? n = o.one : n = o.other.replace("{{count}}", t.toString()), r != null && r.addSuffix ? r.comparison && r.comparison > 0 ? "in " + n : n + " ago" : n;
};
function zo(e) {
  return (t = {}) => {
    const r = t.width ? String(t.width) : e.defaultWidth;
    return e.formats[r] || e.formats[e.defaultWidth];
  };
}
const CP = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, OP = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, PP = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, EP = {
  date: zo({
    formats: CP,
    defaultWidth: "full"
  }),
  time: zo({
    formats: OP,
    defaultWidth: "full"
  }),
  dateTime: zo({
    formats: PP,
    defaultWidth: "full"
  })
}, MP = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, TP = (e, t, r, n) => MP[e];
function vr(e) {
  return (t, r) => {
    const n = r != null && r.context ? String(r.context) : "standalone";
    let o;
    if (n === "formatting" && e.formattingValues) {
      const i = e.defaultFormattingWidth || e.defaultWidth, s = r != null && r.width ? String(r.width) : i;
      o = e.formattingValues[s] || e.formattingValues[i];
    } else {
      const i = e.defaultWidth, s = r != null && r.width ? String(r.width) : e.defaultWidth;
      o = e.values[s] || e.values[i];
    }
    const a = e.argumentCallback ? e.argumentCallback(t) : t;
    return o[a];
  };
}
const RP = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, DP = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, kP = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}, NP = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, AP = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
}, IP = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
}, $P = (e, t) => {
  const r = Number(e), n = r % 100;
  if (n > 20 || n < 10)
    switch (n % 10) {
      case 1:
        return r + "st";
      case 2:
        return r + "nd";
      case 3:
        return r + "rd";
    }
  return r + "th";
}, FP = {
  ordinalNumber: $P,
  era: vr({
    values: RP,
    defaultWidth: "wide"
  }),
  quarter: vr({
    values: DP,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: vr({
    values: kP,
    defaultWidth: "wide"
  }),
  day: vr({
    values: NP,
    defaultWidth: "wide"
  }),
  dayPeriod: vr({
    values: AP,
    defaultWidth: "wide",
    formattingValues: IP,
    defaultFormattingWidth: "wide"
  })
};
function br(e) {
  return (t, r = {}) => {
    const n = r.width, o = n && e.matchPatterns[n] || e.matchPatterns[e.defaultMatchWidth], a = t.match(o);
    if (!a)
      return null;
    const i = a[0], s = n && e.parsePatterns[n] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(s) ? WP(s, (d) => d.test(i)) : (
      // [TODO] -- I challenge you to fix the type
      qP(s, (d) => d.test(i))
    );
    let l;
    l = e.valueCallback ? e.valueCallback(c) : c, l = r.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      r.valueCallback(l)
    ) : l;
    const u = t.slice(i.length);
    return { value: l, rest: u };
  };
}
function qP(e, t) {
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r) && t(e[r]))
      return r;
}
function WP(e, t) {
  for (let r = 0; r < e.length; r++)
    if (t(e[r]))
      return r;
}
function BP(e) {
  return (t, r = {}) => {
    const n = t.match(e.matchPattern);
    if (!n) return null;
    const o = n[0], a = t.match(e.parsePattern);
    if (!a) return null;
    let i = e.valueCallback ? e.valueCallback(a[0]) : a[0];
    i = r.valueCallback ? r.valueCallback(i) : i;
    const s = t.slice(o.length);
    return { value: i, rest: s };
  };
}
const LP = /^(\d+)(th|st|nd|rd)?/i, jP = /\d+/i, zP = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, HP = {
  any: [/^b/i, /^(a|c)/i]
}, YP = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, GP = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, UP = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, VP = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, KP = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, XP = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, ZP = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, QP = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, JP = {
  ordinalNumber: BP({
    matchPattern: LP,
    parsePattern: jP,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: br({
    matchPatterns: zP,
    defaultMatchWidth: "wide",
    parsePatterns: HP,
    defaultParseWidth: "any"
  }),
  quarter: br({
    matchPatterns: YP,
    defaultMatchWidth: "wide",
    parsePatterns: GP,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: br({
    matchPatterns: UP,
    defaultMatchWidth: "wide",
    parsePatterns: VP,
    defaultParseWidth: "any"
  }),
  day: br({
    matchPatterns: KP,
    defaultMatchWidth: "wide",
    parsePatterns: XP,
    defaultParseWidth: "any"
  }),
  dayPeriod: br({
    matchPatterns: ZP,
    defaultMatchWidth: "any",
    parsePatterns: QP,
    defaultParseWidth: "any"
  })
}, Zt = {
  code: "en-US",
  formatDistance: SP,
  formatLong: EP,
  formatRelative: TP,
  localize: FP,
  match: JP,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function eE(e, t) {
  const r = pe(e, t == null ? void 0 : t.in);
  return il(r, Zv(r)) + 1;
}
function sl(e, t) {
  const r = pe(e, t == null ? void 0 : t.in), n = +kr(r) - +lP(r);
  return Math.round(n / Hv) + 1;
}
function Jv(e, t) {
  var u, d, f, m;
  const r = pe(e, t == null ? void 0 : t.in), n = r.getFullYear(), o = Xr(), a = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((d = (u = t == null ? void 0 : t.locale) == null ? void 0 : u.options) == null ? void 0 : d.firstWeekContainsDate) ?? o.firstWeekContainsDate ?? ((m = (f = o.locale) == null ? void 0 : f.options) == null ? void 0 : m.firstWeekContainsDate) ?? 1, i = ye((t == null ? void 0 : t.in) || e, 0);
  i.setFullYear(n + 1, 0, a), i.setHours(0, 0, 0, 0);
  const s = or(i, t), c = ye((t == null ? void 0 : t.in) || e, 0);
  c.setFullYear(n, 0, a), c.setHours(0, 0, 0, 0);
  const l = or(c, t);
  return +r >= +s ? n + 1 : +r >= +l ? n : n - 1;
}
function tE(e, t) {
  var s, c, l, u;
  const r = Xr(), n = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.firstWeekContainsDate) ?? r.firstWeekContainsDate ?? ((u = (l = r.locale) == null ? void 0 : l.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, o = Jv(e, t), a = ye((t == null ? void 0 : t.in) || e, 0);
  return a.setFullYear(o, 0, n), a.setHours(0, 0, 0, 0), or(a, t);
}
function cl(e, t) {
  const r = pe(e, t == null ? void 0 : t.in), n = +or(r, t) - +tE(r, t);
  return Math.round(n / Hv) + 1;
}
function he(e, t) {
  const r = e < 0 ? "-" : "", n = Math.abs(e).toString().padStart(t, "0");
  return r + n;
}
const vt = {
  // Year
  y(e, t) {
    const r = e.getFullYear(), n = r > 0 ? r : 1 - r;
    return he(t === "yy" ? n % 100 : n, t.length);
  },
  // Month
  M(e, t) {
    const r = e.getMonth();
    return t === "M" ? String(r + 1) : he(r + 1, 2);
  },
  // Day of the month
  d(e, t) {
    return he(e.getDate(), t.length);
  },
  // AM or PM
  a(e, t) {
    const r = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return r.toUpperCase();
      case "aaa":
        return r;
      case "aaaaa":
        return r[0];
      case "aaaa":
      default:
        return r === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(e, t) {
    return he(e.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(e, t) {
    return he(e.getHours(), t.length);
  },
  // Minute
  m(e, t) {
    return he(e.getMinutes(), t.length);
  },
  // Second
  s(e, t) {
    return he(e.getSeconds(), t.length);
  },
  // Fraction of second
  S(e, t) {
    const r = t.length, n = e.getMilliseconds(), o = Math.trunc(
      n * Math.pow(10, r - 3)
    );
    return he(o, t.length);
  }
}, Kt = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, Su = {
  // Era
  G: function(e, t, r) {
    const n = e.getFullYear() > 0 ? 1 : 0;
    switch (t) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return r.era(n, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return r.era(n, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return r.era(n, { width: "wide" });
    }
  },
  // Year
  y: function(e, t, r) {
    if (t === "yo") {
      const n = e.getFullYear(), o = n > 0 ? n : 1 - n;
      return r.ordinalNumber(o, { unit: "year" });
    }
    return vt.y(e, t);
  },
  // Local week-numbering year
  Y: function(e, t, r, n) {
    const o = Jv(e, n), a = o > 0 ? o : 1 - o;
    if (t === "YY") {
      const i = a % 100;
      return he(i, 2);
    }
    return t === "Yo" ? r.ordinalNumber(a, { unit: "year" }) : he(a, t.length);
  },
  // ISO week-numbering year
  R: function(e, t) {
    const r = Uv(e);
    return he(r, t.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(e, t) {
    const r = e.getFullYear();
    return he(r, t.length);
  },
  // Quarter
  Q: function(e, t, r) {
    const n = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      // 1, 2, 3, 4
      case "Q":
        return String(n);
      // 01, 02, 03, 04
      case "QQ":
        return he(n, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return r.ordinalNumber(n, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return r.quarter(n, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return r.quarter(n, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return r.quarter(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(e, t, r) {
    const n = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      // 1, 2, 3, 4
      case "q":
        return String(n);
      // 01, 02, 03, 04
      case "qq":
        return he(n, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return r.ordinalNumber(n, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return r.quarter(n, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return r.quarter(n, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return r.quarter(n, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(e, t, r) {
    const n = e.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return vt.M(e, t);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return r.ordinalNumber(n + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return r.month(n, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return r.month(n, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return r.month(n, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(e, t, r) {
    const n = e.getMonth();
    switch (t) {
      // 1, 2, ..., 12
      case "L":
        return String(n + 1);
      // 01, 02, ..., 12
      case "LL":
        return he(n + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return r.ordinalNumber(n + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return r.month(n, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return r.month(n, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return r.month(n, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(e, t, r, n) {
    const o = cl(e, n);
    return t === "wo" ? r.ordinalNumber(o, { unit: "week" }) : he(o, t.length);
  },
  // ISO week of year
  I: function(e, t, r) {
    const n = sl(e);
    return t === "Io" ? r.ordinalNumber(n, { unit: "week" }) : he(n, t.length);
  },
  // Day of the month
  d: function(e, t, r) {
    return t === "do" ? r.ordinalNumber(e.getDate(), { unit: "date" }) : vt.d(e, t);
  },
  // Day of year
  D: function(e, t, r) {
    const n = eE(e);
    return t === "Do" ? r.ordinalNumber(n, { unit: "dayOfYear" }) : he(n, t.length);
  },
  // Day of week
  E: function(e, t, r) {
    const n = e.getDay();
    switch (t) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return r.day(n, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return r.day(n, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return r.day(n, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "EEEE":
      default:
        return r.day(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(e, t, r, n) {
    const o = e.getDay(), a = (o - n.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(a);
      // Padded numerical value
      case "ee":
        return he(a, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return r.ordinalNumber(a, { unit: "day" });
      case "eee":
        return r.day(o, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return r.day(o, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return r.day(o, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "eeee":
      default:
        return r.day(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(e, t, r, n) {
    const o = e.getDay(), a = (o - n.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      // Numerical value (same as in `e`)
      case "c":
        return String(a);
      // Padded numerical value
      case "cc":
        return he(a, t.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return r.ordinalNumber(a, { unit: "day" });
      case "ccc":
        return r.day(o, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return r.day(o, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return r.day(o, {
          width: "short",
          context: "standalone"
        });
      // Tuesday
      case "cccc":
      default:
        return r.day(o, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(e, t, r) {
    const n = e.getDay(), o = n === 0 ? 7 : n;
    switch (t) {
      // 2
      case "i":
        return String(o);
      // 02
      case "ii":
        return he(o, t.length);
      // 2nd
      case "io":
        return r.ordinalNumber(o, { unit: "day" });
      // Tue
      case "iii":
        return r.day(n, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return r.day(n, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return r.day(n, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "iiii":
      default:
        return r.day(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(e, t, r) {
    const o = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return r.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return r.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(e, t, r) {
    const n = e.getHours();
    let o;
    switch (n === 12 ? o = Kt.noon : n === 0 ? o = Kt.midnight : o = n / 12 >= 1 ? "pm" : "am", t) {
      case "b":
      case "bb":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return r.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return r.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(e, t, r) {
    const n = e.getHours();
    let o;
    switch (n >= 17 ? o = Kt.evening : n >= 12 ? o = Kt.afternoon : n >= 4 ? o = Kt.morning : o = Kt.night, t) {
      case "B":
      case "BB":
      case "BBB":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return r.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return r.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(e, t, r) {
    if (t === "ho") {
      let n = e.getHours() % 12;
      return n === 0 && (n = 12), r.ordinalNumber(n, { unit: "hour" });
    }
    return vt.h(e, t);
  },
  // Hour [0-23]
  H: function(e, t, r) {
    return t === "Ho" ? r.ordinalNumber(e.getHours(), { unit: "hour" }) : vt.H(e, t);
  },
  // Hour [0-11]
  K: function(e, t, r) {
    const n = e.getHours() % 12;
    return t === "Ko" ? r.ordinalNumber(n, { unit: "hour" }) : he(n, t.length);
  },
  // Hour [1-24]
  k: function(e, t, r) {
    let n = e.getHours();
    return n === 0 && (n = 24), t === "ko" ? r.ordinalNumber(n, { unit: "hour" }) : he(n, t.length);
  },
  // Minute
  m: function(e, t, r) {
    return t === "mo" ? r.ordinalNumber(e.getMinutes(), { unit: "minute" }) : vt.m(e, t);
  },
  // Second
  s: function(e, t, r) {
    return t === "so" ? r.ordinalNumber(e.getSeconds(), { unit: "second" }) : vt.s(e, t);
  },
  // Fraction of second
  S: function(e, t) {
    return vt.S(e, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(e, t, r) {
    const n = e.getTimezoneOffset();
    if (n === 0)
      return "Z";
    switch (t) {
      // Hours and optional minutes
      case "X":
        return Ou(n);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return kt(n);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX":
      // Hours and minutes with `:` delimiter
      default:
        return kt(n, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(e, t, r) {
    const n = e.getTimezoneOffset();
    switch (t) {
      // Hours and optional minutes
      case "x":
        return Ou(n);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return kt(n);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx":
      // Hours and minutes with `:` delimiter
      default:
        return kt(n, ":");
    }
  },
  // Timezone (GMT)
  O: function(e, t, r) {
    const n = e.getTimezoneOffset();
    switch (t) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + Cu(n, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + kt(n, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(e, t, r) {
    const n = e.getTimezoneOffset();
    switch (t) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + Cu(n, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + kt(n, ":");
    }
  },
  // Seconds timestamp
  t: function(e, t, r) {
    const n = Math.trunc(+e / 1e3);
    return he(n, t.length);
  },
  // Milliseconds timestamp
  T: function(e, t, r) {
    return he(+e, t.length);
  }
};
function Cu(e, t = "") {
  const r = e > 0 ? "-" : "+", n = Math.abs(e), o = Math.trunc(n / 60), a = n % 60;
  return a === 0 ? r + String(o) : r + String(o) + t + he(a, 2);
}
function Ou(e, t) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + he(Math.abs(e) / 60, 2) : kt(e, t);
}
function kt(e, t = "") {
  const r = e > 0 ? "-" : "+", n = Math.abs(e), o = he(Math.trunc(n / 60), 2), a = he(n % 60, 2);
  return r + o + t + a;
}
const Pu = (e, t) => {
  switch (e) {
    case "P":
      return t.date({ width: "short" });
    case "PP":
      return t.date({ width: "medium" });
    case "PPP":
      return t.date({ width: "long" });
    case "PPPP":
    default:
      return t.date({ width: "full" });
  }
}, eb = (e, t) => {
  switch (e) {
    case "p":
      return t.time({ width: "short" });
    case "pp":
      return t.time({ width: "medium" });
    case "ppp":
      return t.time({ width: "long" });
    case "pppp":
    default:
      return t.time({ width: "full" });
  }
}, rE = (e, t) => {
  const r = e.match(/(P+)(p+)?/) || [], n = r[1], o = r[2];
  if (!o)
    return Pu(e, t);
  let a;
  switch (n) {
    case "P":
      a = t.dateTime({ width: "short" });
      break;
    case "PP":
      a = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      a = t.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      a = t.dateTime({ width: "full" });
      break;
  }
  return a.replace("{{date}}", Pu(n, t)).replace("{{time}}", eb(o, t));
}, nE = {
  p: eb,
  P: rE
}, oE = /^D+$/, aE = /^Y+$/, iE = ["D", "DD", "YY", "YYYY"];
function sE(e) {
  return oE.test(e);
}
function cE(e) {
  return aE.test(e);
}
function lE(e, t, r) {
  const n = uE(e, t, r);
  if (console.warn(n), iE.includes(e)) throw new RangeError(n);
}
function uE(e, t, r) {
  const n = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${n} to the input \`${r}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const dE = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, fE = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, hE = /^'([^]*?)'?$/, pE = /''/g, mE = /[a-zA-Z]/;
function Sr(e, t, r) {
  var u, d, f, m, b, g, p, w;
  const n = Xr(), o = (r == null ? void 0 : r.locale) ?? n.locale ?? Zt, a = (r == null ? void 0 : r.firstWeekContainsDate) ?? ((d = (u = r == null ? void 0 : r.locale) == null ? void 0 : u.options) == null ? void 0 : d.firstWeekContainsDate) ?? n.firstWeekContainsDate ?? ((m = (f = n.locale) == null ? void 0 : f.options) == null ? void 0 : m.firstWeekContainsDate) ?? 1, i = (r == null ? void 0 : r.weekStartsOn) ?? ((g = (b = r == null ? void 0 : r.locale) == null ? void 0 : b.options) == null ? void 0 : g.weekStartsOn) ?? n.weekStartsOn ?? ((w = (p = n.locale) == null ? void 0 : p.options) == null ? void 0 : w.weekStartsOn) ?? 0, s = pe(e, r == null ? void 0 : r.in);
  if (!mP(s))
    throw new RangeError("Invalid time value");
  let c = t.match(fE).map((y) => {
    const x = y[0];
    if (x === "p" || x === "P") {
      const S = nE[x];
      return S(y, o.formatLong);
    }
    return y;
  }).join("").match(dE).map((y) => {
    if (y === "''")
      return { isToken: !1, value: "'" };
    const x = y[0];
    if (x === "'")
      return { isToken: !1, value: gE(y) };
    if (Su[x])
      return { isToken: !0, value: y };
    if (x.match(mE))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + x + "`"
      );
    return { isToken: !1, value: y };
  });
  o.localize.preprocessor && (c = o.localize.preprocessor(s, c));
  const l = {
    firstWeekContainsDate: a,
    weekStartsOn: i,
    locale: o
  };
  return c.map((y) => {
    if (!y.isToken) return y.value;
    const x = y.value;
    (!(r != null && r.useAdditionalWeekYearTokens) && cE(x) || !(r != null && r.useAdditionalDayOfYearTokens) && sE(x)) && lE(x, t, String(e));
    const S = Su[x[0]];
    return S(s, x, o.localize, l);
  }).join("");
}
function gE(e) {
  const t = e.match(hE);
  return t ? t[1].replace(pE, "'") : e;
}
function vE(e, t) {
  const r = pe(e, t == null ? void 0 : t.in), n = r.getFullYear(), o = r.getMonth(), a = ye(r, 0);
  return a.setFullYear(n, o + 1, 0), a.setHours(0, 0, 0, 0), a.getDate();
}
function bE(e, t) {
  return pe(e, t == null ? void 0 : t.in).getMonth();
}
function yE(e, t) {
  return pe(e, t == null ? void 0 : t.in).getFullYear();
}
function wE(e, t) {
  return +pe(e) > +pe(t);
}
function xE(e, t) {
  return +pe(e) < +pe(t);
}
function _E(e, t, r) {
  const [n, o] = mr(
    r == null ? void 0 : r.in,
    e,
    t
  );
  return n.getFullYear() === o.getFullYear() && n.getMonth() === o.getMonth();
}
function SE(e, t, r) {
  const [n, o] = mr(
    r == null ? void 0 : r.in,
    e,
    t
  );
  return n.getFullYear() === o.getFullYear();
}
function CE(e, t, r) {
  const n = pe(e, r == null ? void 0 : r.in), o = n.getFullYear(), a = n.getDate(), i = ye(e, 0);
  i.setFullYear(o, t, 15), i.setHours(0, 0, 0, 0);
  const s = vE(i);
  return n.setMonth(t, Math.min(a, s)), n;
}
function OE(e, t, r) {
  const n = pe(e, r == null ? void 0 : r.in);
  return isNaN(+n) ? ye(e, NaN) : (n.setFullYear(t), n);
}
const Eu = 5, PE = 4;
function EE(e, t) {
  const r = t.startOfMonth(e), n = r.getDay() > 0 ? r.getDay() : 7, o = t.addDays(e, -n + 1), a = t.addDays(o, Eu * 7 - 1);
  return t.getMonth(e) === t.getMonth(a) ? Eu : PE;
}
function tb(e, t) {
  const r = t.startOfMonth(e), n = r.getDay();
  return n === 1 ? r : n === 0 ? t.addDays(r, -6) : t.addDays(r, -1 * (n - 1));
}
function ME(e, t) {
  const r = tb(e, t), n = EE(e, t);
  return t.addDays(r, n * 7 - 1);
}
const rb = {
  ...Zt,
  labels: {
    labelDayButton: (e, t, r, n) => {
      let o;
      n && typeof n.format == "function" ? o = n.format.bind(n) : o = (i, s) => Sr(i, s, { locale: Zt, ...r });
      let a = o(e, "PPPP");
      return t.today && (a = `Today, ${a}`), t.selected && (a = `${a}, selected`), a;
    },
    labelMonthDropdown: "Choose the Month",
    labelNext: "Go to the Next Month",
    labelPrevious: "Go to the Previous Month",
    labelWeekNumber: (e) => `Week ${e}`,
    labelYearDropdown: "Choose the Year",
    labelGrid: (e, t, r) => {
      let n;
      return r && typeof r.format == "function" ? n = r.format.bind(r) : n = (o, a) => Sr(o, a, { locale: Zt, ...t }), n(e, "LLLL yyyy");
    },
    labelGridcell: (e, t, r, n) => {
      let o;
      n && typeof n.format == "function" ? o = n.format.bind(n) : o = (i, s) => Sr(i, s, { locale: Zt, ...r });
      let a = o(e, "PPPP");
      return t != null && t.today && (a = `Today, ${a}`), a;
    },
    labelNav: "Navigation bar",
    labelWeekNumberHeader: "Week Number",
    labelWeekday: (e, t, r) => {
      let n;
      return r && typeof r.format == "function" ? n = r.format.bind(r) : n = (o, a) => Sr(o, a, { locale: Zt, ...t }), n(e, "cccc");
    }
  }
};
class Re {
  /**
   * Creates an instance of `DateLib`.
   *
   * @param options Configuration options for the date library.
   * @param overrides Custom overrides for the date library functions.
   */
  constructor(t, r) {
    this.Date = Date, this.today = () => {
      var n;
      return (n = this.overrides) != null && n.today ? this.overrides.today() : this.options.timeZone ? _e.tz(this.options.timeZone) : new this.Date();
    }, this.newDate = (n, o, a) => {
      var i;
      return (i = this.overrides) != null && i.newDate ? this.overrides.newDate(n, o, a) : this.options.timeZone ? new _e(n, o, a, this.options.timeZone) : new Date(n, o, a);
    }, this.addDays = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.addDays ? this.overrides.addDays(n, o) : Yv(n, o);
    }, this.addMonths = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.addMonths ? this.overrides.addMonths(n, o) : Gv(n, o);
    }, this.addWeeks = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.addWeeks ? this.overrides.addWeeks(n, o) : uP(n, o);
    }, this.addYears = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.addYears ? this.overrides.addYears(n, o) : dP(n, o);
    }, this.differenceInCalendarDays = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(n, o) : il(n, o);
    }, this.differenceInCalendarMonths = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(n, o) : Kv(n, o);
    }, this.eachMonthOfInterval = (n) => {
      var o;
      return (o = this.overrides) != null && o.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(n) : vP(n);
    }, this.eachYearOfInterval = (n) => {
      var s;
      const o = (s = this.overrides) != null && s.eachYearOfInterval ? this.overrides.eachYearOfInterval(n) : wP(n), a = new Set(o.map((c) => this.getYear(c)));
      if (a.size === o.length)
        return o;
      const i = [];
      return a.forEach((c) => {
        i.push(new Date(c, 0, 1));
      }), i;
    }, this.endOfBroadcastWeek = (n) => {
      var o;
      return (o = this.overrides) != null && o.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(n) : ME(n, this);
    }, this.endOfISOWeek = (n) => {
      var o;
      return (o = this.overrides) != null && o.endOfISOWeek ? this.overrides.endOfISOWeek(n) : xP(n);
    }, this.endOfMonth = (n) => {
      var o;
      return (o = this.overrides) != null && o.endOfMonth ? this.overrides.endOfMonth(n) : gP(n);
    }, this.endOfWeek = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.endOfWeek ? this.overrides.endOfWeek(n, o) : Qv(n, this.options);
    }, this.endOfYear = (n) => {
      var o;
      return (o = this.overrides) != null && o.endOfYear ? this.overrides.endOfYear(n) : yP(n);
    }, this.format = (n, o, a) => {
      var s;
      const i = (s = this.overrides) != null && s.format ? this.overrides.format(n, o, this.options) : Sr(n, o, this.options);
      return this.options.numerals && this.options.numerals !== "latn" ? this.replaceDigits(i) : i;
    }, this.getISOWeek = (n) => {
      var o;
      return (o = this.overrides) != null && o.getISOWeek ? this.overrides.getISOWeek(n) : sl(n);
    }, this.getMonth = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.getMonth ? this.overrides.getMonth(n, this.options) : bE(n, this.options);
    }, this.getYear = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.getYear ? this.overrides.getYear(n, this.options) : yE(n, this.options);
    }, this.getWeek = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.getWeek ? this.overrides.getWeek(n, this.options) : cl(n, this.options);
    }, this.isAfter = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.isAfter ? this.overrides.isAfter(n, o) : wE(n, o);
    }, this.isBefore = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.isBefore ? this.overrides.isBefore(n, o) : xE(n, o);
    }, this.isDate = (n) => {
      var o;
      return (o = this.overrides) != null && o.isDate ? this.overrides.isDate(n) : Vv(n);
    }, this.isSameDay = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.isSameDay ? this.overrides.isSameDay(n, o) : pP(n, o);
    }, this.isSameMonth = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.isSameMonth ? this.overrides.isSameMonth(n, o) : _E(n, o);
    }, this.isSameYear = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.isSameYear ? this.overrides.isSameYear(n, o) : SE(n, o);
    }, this.max = (n) => {
      var o;
      return (o = this.overrides) != null && o.max ? this.overrides.max(n) : fP(n);
    }, this.min = (n) => {
      var o;
      return (o = this.overrides) != null && o.min ? this.overrides.min(n) : hP(n);
    }, this.setMonth = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.setMonth ? this.overrides.setMonth(n, o) : CE(n, o);
    }, this.setYear = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.setYear ? this.overrides.setYear(n, o) : OE(n, o);
    }, this.startOfBroadcastWeek = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(n, this) : tb(n, this);
    }, this.startOfDay = (n) => {
      var o;
      return (o = this.overrides) != null && o.startOfDay ? this.overrides.startOfDay(n) : Nr(n);
    }, this.startOfISOWeek = (n) => {
      var o;
      return (o = this.overrides) != null && o.startOfISOWeek ? this.overrides.startOfISOWeek(n) : kr(n);
    }, this.startOfMonth = (n) => {
      var o;
      return (o = this.overrides) != null && o.startOfMonth ? this.overrides.startOfMonth(n) : bP(n);
    }, this.startOfWeek = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.startOfWeek ? this.overrides.startOfWeek(n, this.options) : or(n, this.options);
    }, this.startOfYear = (n) => {
      var o;
      return (o = this.overrides) != null && o.startOfYear ? this.overrides.startOfYear(n) : Zv(n);
    }, this.options = { locale: rb, ...t }, this.overrides = r;
  }
  /**
   * Generates a mapping of Arabic digits (0-9) to the target numbering system
   * digits.
   *
   * @since 9.5.0
   * @returns A record mapping Arabic digits to the target numerals.
   */
  getDigitMap() {
    const { numerals: t = "latn" } = this.options, r = new Intl.NumberFormat("en-US", {
      numberingSystem: t
    }), n = {};
    for (let o = 0; o < 10; o++)
      n[o.toString()] = r.format(o);
    return n;
  }
  /**
   * Replaces Arabic digits in a string with the target numbering system digits.
   *
   * @since 9.5.0
   * @param input The string containing Arabic digits.
   * @returns The string with digits replaced.
   */
  replaceDigits(t) {
    const r = this.getDigitMap();
    return t.replace(/\d/g, (n) => r[n] || n);
  }
  /**
   * Formats a number using the configured numbering system.
   *
   * @since 9.5.0
   * @param value The number to format.
   * @returns The formatted number as a string.
   */
  formatNumber(t) {
    return this.replaceDigits(t.toString());
  }
  /**
   * Returns the preferred ordering for month and year labels for the current
   * locale.
   */
  getMonthYearOrder() {
    var r;
    const t = (r = this.options.locale) == null ? void 0 : r.code;
    return t && Re.yearFirstLocales.has(t) ? "year-first" : "month-first";
  }
  /**
   * Formats the month/year pair respecting locale conventions.
   *
   * @since 9.11.0
   */
  formatMonthYear(t) {
    const { locale: r, timeZone: n, numerals: o } = this.options, a = r == null ? void 0 : r.code;
    if (a && Re.yearFirstLocales.has(a))
      try {
        return new Intl.DateTimeFormat(a, {
          month: "long",
          year: "numeric",
          timeZone: n,
          numberingSystem: o
        }).format(t);
      } catch {
      }
    const i = this.getMonthYearOrder() === "year-first" ? "y LLLL" : "LLLL y";
    return this.format(t, i);
  }
}
Re.yearFirstLocales = /* @__PURE__ */ new Set([
  "eu",
  "hu",
  "ja",
  "ja-Hira",
  "ja-JP",
  "ko",
  "ko-KR",
  "lt",
  "lt-LT",
  "lv",
  "lv-LV",
  "mn",
  "mn-MN",
  "zh",
  "zh-CN",
  "zh-HK",
  "zh-TW"
]);
const at = new Re();
class nb {
  constructor(t, r, n = at) {
    this.date = t, this.displayMonth = r, this.outside = !!(r && !n.isSameMonth(t, r)), this.dateLib = n, this.isoDate = n.format(t, "yyyy-MM-dd"), this.displayMonthId = n.format(r, "yyyy-MM"), this.dateMonthId = n.format(t, "yyyy-MM");
  }
  /**
   * Checks if this day is equal to another `CalendarDay`, considering both the
   * date and the displayed month.
   *
   * @param day The `CalendarDay` to compare with.
   * @returns `true` if the days are equal, otherwise `false`.
   */
  isEqualTo(t) {
    return this.dateLib.isSameDay(t.date, this.date) && this.dateLib.isSameMonth(t.displayMonth, this.displayMonth);
  }
}
class TE {
  constructor(t, r) {
    this.date = t, this.weeks = r;
  }
}
class RE {
  constructor(t, r) {
    this.days = r, this.weekNumber = t;
  }
}
function DE(e) {
  return E.createElement("button", { ...e });
}
function kE(e) {
  return E.createElement("span", { ...e });
}
function NE(e) {
  const { size: t = 24, orientation: r = "left", className: n } = e;
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: handled by the parent component
    E.createElement(
      "svg",
      { className: n, width: t, height: t, viewBox: "0 0 24 24" },
      r === "up" && E.createElement("polygon", { points: "6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" }),
      r === "down" && E.createElement("polygon", { points: "6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" }),
      r === "left" && E.createElement("polygon", { points: "16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" }),
      r === "right" && E.createElement("polygon", { points: "8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" })
    )
  );
}
function AE(e) {
  const { day: t, modifiers: r, ...n } = e;
  return E.createElement("td", { ...n });
}
function IE(e) {
  const { day: t, modifiers: r, ...n } = e, o = E.useRef(null);
  return E.useEffect(() => {
    var a;
    r.focused && ((a = o.current) == null || a.focus());
  }, [r.focused]), E.createElement("button", { ref: o, ...n });
}
var G;
(function(e) {
  e.Root = "root", e.Chevron = "chevron", e.Day = "day", e.DayButton = "day_button", e.CaptionLabel = "caption_label", e.Dropdowns = "dropdowns", e.Dropdown = "dropdown", e.DropdownRoot = "dropdown_root", e.Footer = "footer", e.MonthGrid = "month_grid", e.MonthCaption = "month_caption", e.MonthsDropdown = "months_dropdown", e.Month = "month", e.Months = "months", e.Nav = "nav", e.NextMonthButton = "button_next", e.PreviousMonthButton = "button_previous", e.Week = "week", e.Weeks = "weeks", e.Weekday = "weekday", e.Weekdays = "weekdays", e.WeekNumber = "week_number", e.WeekNumberHeader = "week_number_header", e.YearsDropdown = "years_dropdown";
})(G || (G = {}));
var ve;
(function(e) {
  e.disabled = "disabled", e.hidden = "hidden", e.outside = "outside", e.focused = "focused", e.today = "today";
})(ve || (ve = {}));
var He;
(function(e) {
  e.range_end = "range_end", e.range_middle = "range_middle", e.range_start = "range_start", e.selected = "selected";
})(He || (He = {}));
var Ee;
(function(e) {
  e.weeks_before_enter = "weeks_before_enter", e.weeks_before_exit = "weeks_before_exit", e.weeks_after_enter = "weeks_after_enter", e.weeks_after_exit = "weeks_after_exit", e.caption_after_enter = "caption_after_enter", e.caption_after_exit = "caption_after_exit", e.caption_before_enter = "caption_before_enter", e.caption_before_exit = "caption_before_exit";
})(Ee || (Ee = {}));
function $E(e) {
  const { options: t, className: r, components: n, classNames: o, ...a } = e, i = [o[G.Dropdown], r].join(" "), s = t == null ? void 0 : t.find(({ value: c }) => c === a.value);
  return E.createElement(
    "span",
    { "data-disabled": a.disabled, className: o[G.DropdownRoot] },
    E.createElement(n.Select, { className: i, ...a }, t == null ? void 0 : t.map(({ value: c, label: l, disabled: u }) => E.createElement(n.Option, { key: c, value: c, disabled: u }, l))),
    E.createElement(
      "span",
      { className: o[G.CaptionLabel], "aria-hidden": !0 },
      s == null ? void 0 : s.label,
      E.createElement(n.Chevron, { orientation: "down", size: 18, className: o[G.Chevron] })
    )
  );
}
function FE(e) {
  return E.createElement("div", { ...e });
}
function qE(e) {
  return E.createElement("div", { ...e });
}
function WE(e) {
  const { calendarMonth: t, displayIndex: r, ...n } = e;
  return E.createElement("div", { ...n }, e.children);
}
function BE(e) {
  const { calendarMonth: t, displayIndex: r, ...n } = e;
  return E.createElement("div", { ...n });
}
function LE(e) {
  return E.createElement("table", { ...e });
}
function jE(e) {
  return E.createElement("div", { ...e });
}
const ob = Ty(void 0);
function Zr() {
  const e = Ry(ob);
  if (e === void 0)
    throw new Error("useDayPicker() must be used within a custom component.");
  return e;
}
function zE(e) {
  const { components: t } = Zr();
  return E.createElement(t.Dropdown, { ...e });
}
function HE(e) {
  const { onPreviousClick: t, onNextClick: r, previousMonth: n, nextMonth: o, ...a } = e, { components: i, classNames: s, labels: { labelPrevious: c, labelNext: l } } = Zr(), u = Pe((f) => {
    o && (r == null || r(f));
  }, [o, r]), d = Pe((f) => {
    n && (t == null || t(f));
  }, [n, t]);
  return E.createElement(
    "nav",
    { ...a },
    E.createElement(
      i.PreviousMonthButton,
      { type: "button", className: s[G.PreviousMonthButton], tabIndex: n ? void 0 : -1, "aria-disabled": n ? void 0 : !0, "aria-label": c(n), onClick: d },
      E.createElement(i.Chevron, { disabled: n ? void 0 : !0, className: s[G.Chevron], orientation: "left" })
    ),
    E.createElement(
      i.NextMonthButton,
      { type: "button", className: s[G.NextMonthButton], tabIndex: o ? void 0 : -1, "aria-disabled": o ? void 0 : !0, "aria-label": l(o), onClick: u },
      E.createElement(i.Chevron, { disabled: o ? void 0 : !0, orientation: "right", className: s[G.Chevron] })
    )
  );
}
function YE(e) {
  const { components: t } = Zr();
  return E.createElement(t.Button, { ...e });
}
function GE(e) {
  return E.createElement("option", { ...e });
}
function UE(e) {
  const { components: t } = Zr();
  return E.createElement(t.Button, { ...e });
}
function VE(e) {
  const { rootRef: t, ...r } = e;
  return E.createElement("div", { ...r, ref: t });
}
function KE(e) {
  return E.createElement("select", { ...e });
}
function XE(e) {
  const { week: t, ...r } = e;
  return E.createElement("tr", { ...r });
}
function ZE(e) {
  return E.createElement("th", { ...e });
}
function QE(e) {
  return E.createElement(
    "thead",
    { "aria-hidden": !0 },
    E.createElement("tr", { ...e })
  );
}
function JE(e) {
  const { week: t, ...r } = e;
  return E.createElement("th", { ...r });
}
function eM(e) {
  return E.createElement("th", { ...e });
}
function tM(e) {
  return E.createElement("tbody", { ...e });
}
function rM(e) {
  const { components: t } = Zr();
  return E.createElement(t.Dropdown, { ...e });
}
const nM = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Button: DE,
  CaptionLabel: kE,
  Chevron: NE,
  Day: AE,
  DayButton: IE,
  Dropdown: $E,
  DropdownNav: FE,
  Footer: qE,
  Month: WE,
  MonthCaption: BE,
  MonthGrid: LE,
  Months: jE,
  MonthsDropdown: zE,
  Nav: HE,
  NextMonthButton: YE,
  Option: GE,
  PreviousMonthButton: UE,
  Root: VE,
  Select: KE,
  Week: XE,
  WeekNumber: JE,
  WeekNumberHeader: eM,
  Weekday: ZE,
  Weekdays: QE,
  Weeks: tM,
  YearsDropdown: rM
}, Symbol.toStringTag, { value: "Module" }));
function lt(e, t, r = !1, n = at) {
  let { from: o, to: a } = e;
  const { differenceInCalendarDays: i, isSameDay: s } = n;
  return o && a ? (i(a, o) < 0 && ([o, a] = [a, o]), i(t, o) >= (r ? 1 : 0) && i(a, t) >= (r ? 1 : 0)) : !r && a ? s(a, t) : !r && o ? s(o, t) : !1;
}
function ll(e) {
  return !!(e && typeof e == "object" && "before" in e && "after" in e);
}
function lo(e) {
  return !!(e && typeof e == "object" && "from" in e);
}
function ul(e) {
  return !!(e && typeof e == "object" && "after" in e);
}
function dl(e) {
  return !!(e && typeof e == "object" && "before" in e);
}
function ab(e) {
  return !!(e && typeof e == "object" && "dayOfWeek" in e);
}
function ib(e, t) {
  return Array.isArray(e) && e.every(t.isDate);
}
function ut(e, t, r = at) {
  const n = Array.isArray(t) ? t : [t], { isSameDay: o, differenceInCalendarDays: a, isAfter: i } = r;
  return n.some((s) => {
    if (typeof s == "boolean")
      return s;
    if (r.isDate(s))
      return o(e, s);
    if (ib(s, r))
      return s.some((c) => o(e, c));
    if (lo(s))
      return lt(s, e, !1, r);
    if (ab(s))
      return Array.isArray(s.dayOfWeek) ? s.dayOfWeek.includes(e.getDay()) : s.dayOfWeek === e.getDay();
    if (ll(s)) {
      const c = a(s.before, e), l = a(s.after, e), u = c > 0, d = l < 0;
      return i(s.before, s.after) ? d && u : u || d;
    }
    return ul(s) ? a(e, s.after) > 0 : dl(s) ? a(s.before, e) > 0 : typeof s == "function" ? s(e) : !1;
  });
}
function oM(e, t, r, n, o) {
  const { disabled: a, hidden: i, modifiers: s, showOutsideDays: c, broadcastCalendar: l, today: u = o.today() } = t, { isSameDay: d, isSameMonth: f, startOfMonth: m, isBefore: b, endOfMonth: g, isAfter: p } = o, w = r && m(r), y = n && g(n), x = {
    [ve.focused]: [],
    [ve.outside]: [],
    [ve.disabled]: [],
    [ve.hidden]: [],
    [ve.today]: []
  }, S = {};
  for (const C of e) {
    const { date: _, displayMonth: O } = C, P = !!(O && !f(_, O)), R = !!(w && b(_, w)), A = !!(y && p(_, y)), D = !!(a && ut(_, a, o)), B = !!(i && ut(_, i, o)) || R || A || // Broadcast calendar will show outside days as default
    !l && !c && P || l && c === !1 && P, k = d(_, u);
    P && x.outside.push(C), D && x.disabled.push(C), B && x.hidden.push(C), k && x.today.push(C), s && Object.keys(s).forEach(($) => {
      const F = s == null ? void 0 : s[$];
      F && ut(_, F, o) && (S[$] ? S[$].push(C) : S[$] = [C]);
    });
  }
  return (C) => {
    const _ = {
      [ve.focused]: !1,
      [ve.disabled]: !1,
      [ve.hidden]: !1,
      [ve.outside]: !1,
      [ve.today]: !1
    }, O = {};
    for (const P in x) {
      const R = x[P];
      _[P] = R.some((A) => A === C);
    }
    for (const P in S)
      O[P] = S[P].some((R) => R === C);
    return {
      ..._,
      // custom modifiers should override all the previous ones
      ...O
    };
  };
}
function aM(e, t, r = {}) {
  return Object.entries(e).filter(([, o]) => o === !0).reduce((o, [a]) => (r[a] ? o.push(r[a]) : t[ve[a]] ? o.push(t[ve[a]]) : t[He[a]] && o.push(t[He[a]]), o), [t[G.Day]]);
}
function iM(e) {
  return {
    ...nM,
    ...e
  };
}
function sM(e) {
  const t = {
    "data-mode": e.mode ?? void 0,
    "data-required": "required" in e ? e.required : void 0,
    "data-multiple-months": e.numberOfMonths && e.numberOfMonths > 1 || void 0,
    "data-week-numbers": e.showWeekNumber || void 0,
    "data-broadcast-calendar": e.broadcastCalendar || void 0,
    "data-nav-layout": e.navLayout || void 0
  };
  return Object.entries(e).forEach(([r, n]) => {
    r.startsWith("data-") && (t[r] = n);
  }), t;
}
function cM() {
  const e = {};
  for (const t in G)
    e[G[t]] = `rdp-${G[t]}`;
  for (const t in ve)
    e[ve[t]] = `rdp-${ve[t]}`;
  for (const t in He)
    e[He[t]] = `rdp-${He[t]}`;
  for (const t in Ee)
    e[Ee[t]] = `rdp-${Ee[t]}`;
  return e;
}
function sb(e, t, r) {
  return (r ?? new Re(t)).formatMonthYear(e);
}
const lM = sb;
function uM(e, t, r) {
  return (r ?? new Re(t)).format(e, "d");
}
function dM(e, t = at) {
  return t.format(e, "LLLL");
}
function fM(e, t, r) {
  return (r ?? new Re(t)).format(e, "cccccc");
}
function hM(e, t = at) {
  return e < 10 ? t.formatNumber(`0${e.toLocaleString()}`) : t.formatNumber(`${e.toLocaleString()}`);
}
function pM() {
  return "";
}
function cb(e, t = at) {
  return t.format(e, "yyyy");
}
const mM = cb, gM = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  formatCaption: sb,
  formatDay: uM,
  formatMonthCaption: lM,
  formatMonthDropdown: dM,
  formatWeekNumber: hM,
  formatWeekNumberHeader: pM,
  formatWeekdayName: fM,
  formatYearCaption: mM,
  formatYearDropdown: cb
}, Symbol.toStringTag, { value: "Module" }));
function vM(e) {
  return e != null && e.formatMonthCaption && !e.formatCaption && (e.formatCaption = e.formatMonthCaption), e != null && e.formatYearCaption && !e.formatYearDropdown && (e.formatYearDropdown = e.formatYearCaption), {
    ...gM,
    ...e
  };
}
function fl(e, t, r, n) {
  let o = (n ?? new Re(r)).format(e, "PPPP");
  return t.today && (o = `Today, ${o}`), t.selected && (o = `${o}, selected`), o;
}
const bM = fl;
function hl(e, t, r) {
  return (r ?? new Re(t)).formatMonthYear(e);
}
const yM = hl;
function lb(e, t, r, n) {
  let o = (n ?? new Re(r)).format(e, "PPPP");
  return t != null && t.today && (o = `Today, ${o}`), o;
}
function ub(e) {
  return "Choose the Month";
}
function db() {
  return "";
}
const wM = "Go to the Next Month";
function fb(e, t) {
  return wM;
}
function hb(e) {
  return "Go to the Previous Month";
}
function pb(e, t, r) {
  return (r ?? new Re(t)).format(e, "cccc");
}
function mb(e, t) {
  return `Week ${e}`;
}
function gb(e) {
  return "Week Number";
}
function vb(e) {
  return "Choose the Year";
}
const xM = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  labelCaption: yM,
  labelDay: bM,
  labelDayButton: fl,
  labelGrid: hl,
  labelGridcell: lb,
  labelMonthDropdown: ub,
  labelNav: db,
  labelNext: fb,
  labelPrevious: hb,
  labelWeekNumber: mb,
  labelWeekNumberHeader: gb,
  labelWeekday: pb,
  labelYearDropdown: vb
}, Symbol.toStringTag, { value: "Module" })), Le = (e, t, r) => t || (r ? typeof r == "function" ? r : (...n) => r : e);
function _M(e, t) {
  var n;
  const r = ((n = t.locale) == null ? void 0 : n.labels) ?? {};
  return {
    ...xM,
    ...e ?? {},
    labelDayButton: Le(fl, e == null ? void 0 : e.labelDayButton, r.labelDayButton),
    labelMonthDropdown: Le(ub, e == null ? void 0 : e.labelMonthDropdown, r.labelMonthDropdown),
    labelNext: Le(fb, e == null ? void 0 : e.labelNext, r.labelNext),
    labelPrevious: Le(hb, e == null ? void 0 : e.labelPrevious, r.labelPrevious),
    labelWeekNumber: Le(mb, e == null ? void 0 : e.labelWeekNumber, r.labelWeekNumber),
    labelYearDropdown: Le(vb, e == null ? void 0 : e.labelYearDropdown, r.labelYearDropdown),
    labelGrid: Le(hl, e == null ? void 0 : e.labelGrid, r.labelGrid),
    labelGridcell: Le(lb, e == null ? void 0 : e.labelGridcell, r.labelGridcell),
    labelNav: Le(db, e == null ? void 0 : e.labelNav, r.labelNav),
    labelWeekNumberHeader: Le(gb, e == null ? void 0 : e.labelWeekNumberHeader, r.labelWeekNumberHeader),
    labelWeekday: Le(pb, e == null ? void 0 : e.labelWeekday, r.labelWeekday)
  };
}
function SM(e, t, r, n, o) {
  const { startOfMonth: a, startOfYear: i, endOfYear: s, eachMonthOfInterval: c, getMonth: l } = o;
  return c({
    start: i(e),
    end: s(e)
  }).map((f) => {
    const m = n.formatMonthDropdown(f, o), b = l(f), g = t && f < a(t) || r && f > a(r) || !1;
    return { value: b, label: m, disabled: g };
  });
}
function CM(e, t = {}, r = {}) {
  let n = { ...t == null ? void 0 : t[G.Day] };
  return Object.entries(e).filter(([, o]) => o === !0).forEach(([o]) => {
    n = {
      ...n,
      ...r == null ? void 0 : r[o]
    };
  }), n;
}
function OM(e, t, r, n) {
  const o = n ?? e.today(), a = r ? e.startOfBroadcastWeek(o, e) : t ? e.startOfISOWeek(o) : e.startOfWeek(o), i = [];
  for (let s = 0; s < 7; s++) {
    const c = e.addDays(a, s);
    i.push(c);
  }
  return i;
}
function PM(e, t, r, n, o = !1) {
  if (!e || !t)
    return;
  const { startOfYear: a, endOfYear: i, eachYearOfInterval: s, getYear: c } = n, l = a(e), u = i(t), d = s({ start: l, end: u });
  return o && d.reverse(), d.map((f) => {
    const m = r.formatYearDropdown(f, n);
    return {
      value: c(f),
      label: m,
      disabled: !1
    };
  });
}
function EM(e, t = {}) {
  var s;
  const { weekStartsOn: r, locale: n } = t, o = r ?? ((s = n == null ? void 0 : n.options) == null ? void 0 : s.weekStartsOn) ?? 0, a = (c) => {
    const l = typeof c == "number" || typeof c == "string" ? new Date(c) : c;
    return new _e(l.getFullYear(), l.getMonth(), l.getDate(), 12, 0, 0, e);
  }, i = (c) => {
    const l = a(c);
    return new Date(l.getFullYear(), l.getMonth(), l.getDate(), 0, 0, 0, 0);
  };
  return {
    today: () => a(_e.tz(e)),
    newDate: (c, l, u) => new _e(c, l, u, 12, 0, 0, e),
    startOfDay: (c) => a(c),
    startOfWeek: (c, l) => {
      const u = a(c), d = (l == null ? void 0 : l.weekStartsOn) ?? o, f = (u.getDay() - d + 7) % 7;
      return u.setDate(u.getDate() - f), u;
    },
    startOfISOWeek: (c) => {
      const l = a(c), u = (l.getDay() - 1 + 7) % 7;
      return l.setDate(l.getDate() - u), l;
    },
    startOfMonth: (c) => {
      const l = a(c);
      return l.setDate(1), l;
    },
    startOfYear: (c) => {
      const l = a(c);
      return l.setMonth(0, 1), l;
    },
    endOfWeek: (c, l) => {
      const u = a(c), m = ((((l == null ? void 0 : l.weekStartsOn) ?? o) + 6) % 7 - u.getDay() + 7) % 7;
      return u.setDate(u.getDate() + m), u;
    },
    endOfISOWeek: (c) => {
      const l = a(c), u = (7 - l.getDay()) % 7;
      return l.setDate(l.getDate() + u), l;
    },
    endOfMonth: (c) => {
      const l = a(c);
      return l.setMonth(l.getMonth() + 1, 0), l;
    },
    endOfYear: (c) => {
      const l = a(c);
      return l.setMonth(11, 31), l;
    },
    eachMonthOfInterval: (c) => {
      const l = a(c.start), u = a(c.end), d = [], f = new _e(l.getFullYear(), l.getMonth(), 1, 12, 0, 0, e), m = u.getFullYear() * 12 + u.getMonth();
      for (; f.getFullYear() * 12 + f.getMonth() <= m; )
        d.push(new _e(f, e)), f.setMonth(f.getMonth() + 1, 1);
      return d;
    },
    // Normalize to noon once before arithmetic (avoid DST/midnight edge cases),
    // mutate the same TZDate, and return it.
    addDays: (c, l) => {
      const u = a(c);
      return u.setDate(u.getDate() + l), u;
    },
    addWeeks: (c, l) => {
      const u = a(c);
      return u.setDate(u.getDate() + l * 7), u;
    },
    addMonths: (c, l) => {
      const u = a(c);
      return u.setMonth(u.getMonth() + l), u;
    },
    addYears: (c, l) => {
      const u = a(c);
      return u.setFullYear(u.getFullYear() + l), u;
    },
    eachYearOfInterval: (c) => {
      const l = a(c.start), u = a(c.end), d = [], f = new _e(l.getFullYear(), 0, 1, 12, 0, 0, e);
      for (; f.getFullYear() <= u.getFullYear(); )
        d.push(new _e(f, e)), f.setFullYear(f.getFullYear() + 1, 0, 1);
      return d;
    },
    getWeek: (c, l) => {
      var d;
      const u = i(c);
      return cl(u, {
        weekStartsOn: (l == null ? void 0 : l.weekStartsOn) ?? o,
        firstWeekContainsDate: (l == null ? void 0 : l.firstWeekContainsDate) ?? ((d = n == null ? void 0 : n.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1
      });
    },
    getISOWeek: (c) => {
      const l = i(c);
      return sl(l);
    },
    differenceInCalendarDays: (c, l) => {
      const u = i(c), d = i(l);
      return il(u, d);
    },
    differenceInCalendarMonths: (c, l) => {
      const u = i(c), d = i(l);
      return Kv(u, d);
    }
  };
}
const Qr = (e) => e instanceof HTMLElement ? e : null, Ho = (e) => [
  ...e.querySelectorAll("[data-animated-month]") ?? []
], MM = (e) => Qr(e.querySelector("[data-animated-month]")), Yo = (e) => Qr(e.querySelector("[data-animated-caption]")), Go = (e) => Qr(e.querySelector("[data-animated-weeks]")), TM = (e) => Qr(e.querySelector("[data-animated-nav]")), RM = (e) => Qr(e.querySelector("[data-animated-weekdays]"));
function DM(e, t, { classNames: r, months: n, focused: o, dateLib: a }) {
  const i = Qt(null), s = Qt(n), c = Qt(!1);
  np(() => {
    const l = s.current;
    if (s.current = n, !t || !e.current || // safety check because the ref can be set to anything by consumers
    !(e.current instanceof HTMLElement) || // validation required for the animation to work as expected
    n.length === 0 || l.length === 0 || n.length !== l.length)
      return;
    const u = a.isSameMonth(n[0].date, l[0].date), d = a.isAfter(n[0].date, l[0].date), f = d ? r[Ee.caption_after_enter] : r[Ee.caption_before_enter], m = d ? r[Ee.weeks_after_enter] : r[Ee.weeks_before_enter], b = i.current, g = e.current.cloneNode(!0);
    if (g instanceof HTMLElement ? (Ho(g).forEach((x) => {
      if (!(x instanceof HTMLElement))
        return;
      const S = MM(x);
      S && x.contains(S) && x.removeChild(S);
      const C = Yo(x);
      C && C.classList.remove(f);
      const _ = Go(x);
      _ && _.classList.remove(m);
    }), i.current = g) : i.current = null, c.current || u || // skip animation if a day is focused because it can cause issues to the animation and is better for a11y
    o)
      return;
    const p = b instanceof HTMLElement ? Ho(b) : [], w = Ho(e.current);
    if (w != null && w.every((y) => y instanceof HTMLElement) && p && p.every((y) => y instanceof HTMLElement)) {
      c.current = !0, e.current.style.isolation = "isolate";
      const y = TM(e.current);
      y && (y.style.zIndex = "1"), w.forEach((x, S) => {
        const C = p[S];
        if (!C)
          return;
        x.style.position = "relative", x.style.overflow = "hidden";
        const _ = Yo(x);
        _ && _.classList.add(f);
        const O = Go(x);
        O && O.classList.add(m);
        const P = () => {
          c.current = !1, e.current && (e.current.style.isolation = ""), y && (y.style.zIndex = ""), _ && _.classList.remove(f), O && O.classList.remove(m), x.style.position = "", x.style.overflow = "", x.contains(C) && x.removeChild(C);
        };
        C.style.pointerEvents = "none", C.style.position = "absolute", C.style.overflow = "hidden", C.setAttribute("aria-hidden", "true");
        const R = RM(C);
        R && (R.style.opacity = "0");
        const A = Yo(C);
        A && (A.classList.add(d ? r[Ee.caption_before_exit] : r[Ee.caption_after_exit]), A.addEventListener("animationend", P));
        const D = Go(C);
        D && D.classList.add(d ? r[Ee.weeks_before_exit] : r[Ee.weeks_after_exit]), x.insertBefore(C, x.firstChild);
      });
    }
  });
}
function kM(e, t, r, n) {
  const o = e[0], a = e[e.length - 1], { ISOWeek: i, fixedWeeks: s, broadcastCalendar: c } = r ?? {}, { addDays: l, differenceInCalendarDays: u, differenceInCalendarMonths: d, endOfBroadcastWeek: f, endOfISOWeek: m, endOfMonth: b, endOfWeek: g, isAfter: p, startOfBroadcastWeek: w, startOfISOWeek: y, startOfWeek: x } = n, S = c ? w(o, n) : i ? y(o) : x(o), C = c ? f(a) : i ? m(b(a)) : g(b(a)), _ = t && (c ? f(t) : i ? m(t) : g(t)), O = _ && p(C, _) ? _ : C, P = u(O, S), R = d(a, o) + 1, A = [];
  for (let k = 0; k <= P; k++) {
    const $ = l(S, k);
    A.push($);
  }
  const B = (c ? 35 : 42) * R;
  if (s && A.length < B) {
    const k = B - A.length;
    for (let $ = 0; $ < k; $++) {
      const F = l(A[A.length - 1], 1);
      A.push(F);
    }
  }
  return A;
}
function NM(e) {
  const t = [];
  return e.reduce((r, n) => {
    const o = n.weeks.reduce((a, i) => a.concat(i.days.slice()), t.slice());
    return r.concat(o.slice());
  }, t.slice());
}
function AM(e, t, r, n) {
  const { numberOfMonths: o = 1 } = r, a = [];
  for (let i = 0; i < o; i++) {
    const s = n.addMonths(e, i);
    if (t && s > t)
      break;
    a.push(s);
  }
  return a;
}
function Mu(e, t, r, n) {
  const { month: o, defaultMonth: a, today: i = n.today(), numberOfMonths: s = 1 } = e;
  let c = o || a || i;
  const { differenceInCalendarMonths: l, addMonths: u, startOfMonth: d } = n;
  if (r && l(r, c) < s - 1) {
    const f = -1 * (s - 1);
    c = u(r, f);
  }
  return t && l(c, t) < 0 && (c = t), d(c);
}
function IM(e, t, r, n) {
  const { addDays: o, endOfBroadcastWeek: a, endOfISOWeek: i, endOfMonth: s, endOfWeek: c, getISOWeek: l, getWeek: u, startOfBroadcastWeek: d, startOfISOWeek: f, startOfWeek: m } = n, b = e.reduce((g, p) => {
    const w = r.broadcastCalendar ? d(p, n) : r.ISOWeek ? f(p) : m(p), y = r.broadcastCalendar ? a(p) : r.ISOWeek ? i(s(p)) : c(s(p)), x = t.filter((O) => O >= w && O <= y), S = r.broadcastCalendar ? 35 : 42;
    if (r.fixedWeeks && x.length < S) {
      const O = t.filter((P) => {
        const R = S - x.length;
        return P > y && P <= o(y, R);
      });
      x.push(...O);
    }
    const C = x.reduce((O, P) => {
      const R = r.ISOWeek ? l(P) : u(P), A = O.find((B) => B.weekNumber === R), D = new nb(P, p, n);
      return A ? A.days.push(D) : O.push(new RE(R, [D])), O;
    }, []), _ = new TE(p, C);
    return g.push(_), g;
  }, []);
  return r.reverseMonths ? b.reverse() : b;
}
function $M(e, t) {
  let { startMonth: r, endMonth: n } = e;
  const { startOfYear: o, startOfDay: a, startOfMonth: i, endOfMonth: s, addYears: c, endOfYear: l, newDate: u, today: d } = t, { fromYear: f, toYear: m, fromMonth: b, toMonth: g } = e;
  !r && b && (r = b), !r && f && (r = t.newDate(f, 0, 1)), !n && g && (n = g), !n && m && (n = u(m, 11, 31));
  const p = e.captionLayout === "dropdown" || e.captionLayout === "dropdown-years";
  return r ? r = i(r) : f ? r = u(f, 0, 1) : !r && p && (r = o(c(e.today ?? d(), -100))), n ? n = s(n) : m ? n = u(m, 11, 31) : !n && p && (n = l(e.today ?? d())), [
    r && a(r),
    n && a(n)
  ];
}
function FM(e, t, r, n) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: a = 1 } = r, { startOfMonth: i, addMonths: s, differenceInCalendarMonths: c } = n, l = o ? a : 1, u = i(e);
  if (!t)
    return s(u, l);
  if (!(c(t, e) < a))
    return s(u, l);
}
function qM(e, t, r, n) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: a } = r, { startOfMonth: i, addMonths: s, differenceInCalendarMonths: c } = n, l = o ? a ?? 1 : 1, u = i(e);
  if (!t)
    return s(u, -l);
  if (!(c(u, t) <= 0))
    return s(u, -l);
}
function WM(e) {
  const t = [];
  return e.reduce((r, n) => r.concat(n.weeks.slice()), t.slice());
}
function uo(e, t) {
  const [r, n] = Er(e);
  return [t === void 0 ? r : t, n];
}
function BM(e, t) {
  var S;
  const [r, n] = $M(e, t), { startOfMonth: o, endOfMonth: a } = t, i = Mu(e, r, n, t), [s, c] = uo(
    i,
    // initialMonth is always computed from props.month if provided
    e.month ? i : void 0
  );
  op(() => {
    const C = Mu(e, r, n, t);
    c(C);
  }, [e.timeZone]);
  const { months: l, weeks: u, days: d, previousMonth: f, nextMonth: m } = Pr(() => {
    const C = AM(s, n, { numberOfMonths: e.numberOfMonths }, t), _ = kM(C, e.endMonth ? a(e.endMonth) : void 0, {
      ISOWeek: e.ISOWeek,
      fixedWeeks: e.fixedWeeks,
      broadcastCalendar: e.broadcastCalendar
    }, t), O = IM(C, _, {
      broadcastCalendar: e.broadcastCalendar,
      fixedWeeks: e.fixedWeeks,
      ISOWeek: e.ISOWeek,
      reverseMonths: e.reverseMonths
    }, t), P = WM(O), R = NM(O), A = qM(s, r, e, t), D = FM(s, n, e, t);
    return {
      months: O,
      weeks: P,
      days: R,
      previousMonth: A,
      nextMonth: D
    };
  }, [
    t,
    s.getTime(),
    n == null ? void 0 : n.getTime(),
    r == null ? void 0 : r.getTime(),
    e.disableNavigation,
    e.broadcastCalendar,
    (S = e.endMonth) == null ? void 0 : S.getTime(),
    e.fixedWeeks,
    e.ISOWeek,
    e.numberOfMonths,
    e.pagedNavigation,
    e.reverseMonths
  ]), { disableNavigation: b, onMonthChange: g } = e, p = (C) => u.some((_) => _.days.some((O) => O.isEqualTo(C))), w = (C) => {
    if (b)
      return;
    let _ = o(C);
    r && _ < o(r) && (_ = o(r)), n && _ > o(n) && (_ = o(n)), c(_), g == null || g(_);
  };
  return {
    months: l,
    weeks: u,
    days: d,
    navStart: r,
    navEnd: n,
    previousMonth: f,
    nextMonth: m,
    goToMonth: w,
    goToDay: (C) => {
      p(C) || w(C.date);
    }
  };
}
var Ze;
(function(e) {
  e[e.Today = 0] = "Today", e[e.Selected = 1] = "Selected", e[e.LastFocused = 2] = "LastFocused", e[e.FocusedModifier = 3] = "FocusedModifier";
})(Ze || (Ze = {}));
function Tu(e) {
  return !e[ve.disabled] && !e[ve.hidden] && !e[ve.outside];
}
function LM(e, t, r, n) {
  let o, a = -1;
  for (const i of e) {
    const s = t(i);
    Tu(s) && (s[ve.focused] && a < Ze.FocusedModifier ? (o = i, a = Ze.FocusedModifier) : n != null && n.isEqualTo(i) && a < Ze.LastFocused ? (o = i, a = Ze.LastFocused) : r(i.date) && a < Ze.Selected ? (o = i, a = Ze.Selected) : s[ve.today] && a < Ze.Today && (o = i, a = Ze.Today));
  }
  return o || (o = e.find((i) => Tu(t(i)))), o;
}
function jM(e, t, r, n, o, a, i) {
  const { ISOWeek: s, broadcastCalendar: c } = a, { addDays: l, addMonths: u, addWeeks: d, addYears: f, endOfBroadcastWeek: m, endOfISOWeek: b, endOfWeek: g, max: p, min: w, startOfBroadcastWeek: y, startOfISOWeek: x, startOfWeek: S } = i;
  let _ = {
    day: l,
    week: d,
    month: u,
    year: f,
    startOfWeek: (O) => c ? y(O, i) : s ? x(O) : S(O),
    endOfWeek: (O) => c ? m(O) : s ? b(O) : g(O)
  }[e](r, t === "after" ? 1 : -1);
  return t === "before" && n ? _ = p([n, _]) : t === "after" && o && (_ = w([o, _])), _;
}
function bb(e, t, r, n, o, a, i, s = 0) {
  if (s > 365)
    return;
  const c = jM(e, t, r.date, n, o, a, i), l = !!(a.disabled && ut(c, a.disabled, i)), u = !!(a.hidden && ut(c, a.hidden, i)), d = c, f = new nb(c, d, i);
  return !l && !u ? f : bb(e, t, f, n, o, a, i, s + 1);
}
function zM(e, t, r, n, o) {
  const { autoFocus: a } = e, [i, s] = Er(), c = LM(t.days, r, n || (() => !1), i), [l, u] = Er(a ? c : void 0);
  return {
    isFocusTarget: (g) => !!(c != null && c.isEqualTo(g)),
    setFocused: u,
    focused: l,
    blur: () => {
      s(l), u(void 0);
    },
    moveFocus: (g, p) => {
      if (!l)
        return;
      const w = bb(g, p, l, t.navStart, t.navEnd, e, o);
      w && (e.disableNavigation && !t.days.some((x) => x.isEqualTo(w)) || (t.goToDay(w), u(w)));
    }
  };
}
function HM(e, t) {
  const { selected: r, required: n, onSelect: o } = e, [a, i] = uo(r, o ? r : void 0), s = o ? r : a, { isSameDay: c } = t, l = (m) => (s == null ? void 0 : s.some((b) => c(b, m))) ?? !1, { min: u, max: d } = e;
  return {
    selected: s,
    select: (m, b, g) => {
      let p = [...s ?? []];
      if (l(m)) {
        if ((s == null ? void 0 : s.length) === u || n && (s == null ? void 0 : s.length) === 1)
          return;
        p = s == null ? void 0 : s.filter((w) => !c(w, m));
      } else
        (s == null ? void 0 : s.length) === d ? p = [m] : p = [...p, m];
      return o || i(p), o == null || o(p, m, b, g), p;
    },
    isSelected: l
  };
}
function YM(e, t, r = 0, n = 0, o = !1, a = at) {
  const { from: i, to: s } = t || {}, { isSameDay: c, isAfter: l, isBefore: u } = a;
  let d;
  if (!i && !s)
    d = { from: e, to: r > 0 ? void 0 : e };
  else if (i && !s)
    c(i, e) ? r === 0 ? d = { from: i, to: e } : o ? d = { from: i, to: void 0 } : d = void 0 : u(e, i) ? d = { from: e, to: i } : d = { from: i, to: e };
  else if (i && s)
    if (c(i, e) && c(s, e))
      o ? d = { from: i, to: s } : d = void 0;
    else if (c(i, e))
      d = { from: i, to: r > 0 ? void 0 : e };
    else if (c(s, e))
      d = { from: e, to: r > 0 ? void 0 : e };
    else if (u(e, i))
      d = { from: e, to: s };
    else if (l(e, i))
      d = { from: i, to: e };
    else if (l(e, s))
      d = { from: i, to: e };
    else
      throw new Error("Invalid range");
  if (d != null && d.from && (d != null && d.to)) {
    const f = a.differenceInCalendarDays(d.to, d.from);
    n > 0 && f > n ? d = { from: e, to: void 0 } : r > 1 && f < r && (d = { from: e, to: void 0 });
  }
  return d;
}
function GM(e, t, r = at) {
  const n = Array.isArray(t) ? t : [t];
  let o = e.from;
  const a = r.differenceInCalendarDays(e.to, e.from), i = Math.min(a, 6);
  for (let s = 0; s <= i; s++) {
    if (n.includes(o.getDay()))
      return !0;
    o = r.addDays(o, 1);
  }
  return !1;
}
function Ru(e, t, r = at) {
  return lt(e, t.from, !1, r) || lt(e, t.to, !1, r) || lt(t, e.from, !1, r) || lt(t, e.to, !1, r);
}
function UM(e, t, r = at) {
  const n = Array.isArray(t) ? t : [t];
  if (n.filter((s) => typeof s != "function").some((s) => typeof s == "boolean" ? s : r.isDate(s) ? lt(e, s, !1, r) : ib(s, r) ? s.some((c) => lt(e, c, !1, r)) : lo(s) ? s.from && s.to ? Ru(e, { from: s.from, to: s.to }, r) : !1 : ab(s) ? GM(e, s.dayOfWeek, r) : ll(s) ? r.isAfter(s.before, s.after) ? Ru(e, {
    from: r.addDays(s.after, 1),
    to: r.addDays(s.before, -1)
  }, r) : ut(e.from, s, r) || ut(e.to, s, r) : ul(s) || dl(s) ? ut(e.from, s, r) || ut(e.to, s, r) : !1))
    return !0;
  const i = n.filter((s) => typeof s == "function");
  if (i.length) {
    let s = e.from;
    const c = r.differenceInCalendarDays(e.to, e.from);
    for (let l = 0; l <= c; l++) {
      if (i.some((u) => u(s)))
        return !0;
      s = r.addDays(s, 1);
    }
  }
  return !1;
}
function VM(e, t) {
  const { disabled: r, excludeDisabled: n, resetOnSelect: o, selected: a, required: i, onSelect: s } = e, [c, l] = uo(a, s ? a : void 0), u = s ? a : c;
  return {
    selected: u,
    select: (m, b, g) => {
      const { min: p, max: w } = e;
      let y;
      if (m) {
        const x = u == null ? void 0 : u.from, S = u == null ? void 0 : u.to, C = !!x && !!S, _ = !!x && !!S && t.isSameDay(x, S) && t.isSameDay(m, x);
        o && (C || !(u != null && u.from)) ? !i && _ ? y = void 0 : y = { from: m, to: void 0 } : y = YM(m, u, p, w, i, t);
      }
      return n && r && (y != null && y.from) && y.to && UM({ from: y.from, to: y.to }, r, t) && (y.from = m, y.to = void 0), s || l(y), s == null || s(y, m, b, g), y;
    },
    isSelected: (m) => u && lt(u, m, !1, t)
  };
}
function KM(e, t) {
  const { selected: r, required: n, onSelect: o } = e, [a, i] = uo(r, o ? r : void 0), s = o ? r : a, { isSameDay: c } = t;
  return {
    selected: s,
    select: (d, f, m) => {
      let b = d;
      return !n && s && s && c(d, s) && (b = void 0), o || i(b), o == null || o(b, d, f, m), b;
    },
    isSelected: (d) => s ? c(s, d) : !1
  };
}
function XM(e, t) {
  const r = KM(e, t), n = HM(e, t), o = VM(e, t);
  switch (e.mode) {
    case "single":
      return r;
    case "multiple":
      return n;
    case "range":
      return o;
    default:
      return;
  }
}
function Fe(e, t) {
  return e instanceof _e && e.timeZone === t ? e : new _e(e, t);
}
function Xt(e, t, r) {
  return Fe(e, t);
}
function Du(e, t, r) {
  return typeof e == "boolean" || typeof e == "function" ? e : e instanceof Date ? Xt(e, t) : Array.isArray(e) ? e.map((n) => n instanceof Date ? Xt(n, t) : n) : lo(e) ? {
    ...e,
    from: e.from ? Fe(e.from, t) : e.from,
    to: e.to ? Fe(e.to, t) : e.to
  } : ll(e) ? {
    before: Xt(e.before, t),
    after: Xt(e.after, t)
  } : ul(e) ? {
    after: Xt(e.after, t)
  } : dl(e) ? {
    before: Xt(e.before, t)
  } : e;
}
function Uo(e, t, r) {
  return e && (Array.isArray(e) ? e.map((n) => Du(n, t)) : Du(e, t));
}
function ZM(e) {
  var kl;
  let t = e;
  const r = t.timeZone;
  if (r && (t = {
    ...e,
    timeZone: r
  }, t.today && (t.today = Fe(t.today, r)), t.month && (t.month = Fe(t.month, r)), t.defaultMonth && (t.defaultMonth = Fe(t.defaultMonth, r)), t.startMonth && (t.startMonth = Fe(t.startMonth, r)), t.endMonth && (t.endMonth = Fe(t.endMonth, r)), t.mode === "single" && t.selected ? t.selected = Fe(t.selected, r) : t.mode === "multiple" && t.selected ? t.selected = (kl = t.selected) == null ? void 0 : kl.map((Z) => Fe(Z, r)) : t.mode === "range" && t.selected && (t.selected = {
    from: t.selected.from ? Fe(t.selected.from, r) : t.selected.from,
    to: t.selected.to ? Fe(t.selected.to, r) : t.selected.to
  }), t.disabled !== void 0 && (t.disabled = Uo(t.disabled, r)), t.hidden !== void 0 && (t.hidden = Uo(t.hidden, r)), t.modifiers)) {
    const Z = {};
    Object.keys(t.modifiers).forEach((ue) => {
      var V;
      Z[ue] = Uo((V = t.modifiers) == null ? void 0 : V[ue], r);
    }), t.modifiers = Z;
  }
  const { components: n, formatters: o, labels: a, dateLib: i, locale: s, classNames: c } = Pr(() => {
    const Z = { ...rb, ...t.locale }, ue = t.broadcastCalendar ? 1 : t.weekStartsOn, V = t.noonSafe && t.timeZone ? EM(t.timeZone, {
      weekStartsOn: ue,
      locale: Z
    }) : void 0, ce = t.dateLib && V ? { ...V, ...t.dateLib } : t.dateLib ?? V, Oe = new Re({
      locale: Z,
      weekStartsOn: ue,
      firstWeekContainsDate: t.firstWeekContainsDate,
      useAdditionalWeekYearTokens: t.useAdditionalWeekYearTokens,
      useAdditionalDayOfYearTokens: t.useAdditionalDayOfYearTokens,
      timeZone: t.timeZone,
      numerals: t.numerals
    }, ce);
    return {
      dateLib: Oe,
      components: iM(t.components),
      formatters: vM(t.formatters),
      labels: _M(t.labels, Oe.options),
      locale: Z,
      classNames: { ...cM(), ...t.classNames }
    };
  }, [
    t.locale,
    t.broadcastCalendar,
    t.weekStartsOn,
    t.firstWeekContainsDate,
    t.useAdditionalWeekYearTokens,
    t.useAdditionalDayOfYearTokens,
    t.timeZone,
    t.numerals,
    t.dateLib,
    t.noonSafe,
    t.components,
    t.formatters,
    t.labels,
    t.classNames
  ]);
  t.today || (t = { ...t, today: i.today() });
  const { captionLayout: l, mode: u, navLayout: d, numberOfMonths: f = 1, onDayBlur: m, onDayClick: b, onDayFocus: g, onDayKeyDown: p, onDayMouseEnter: w, onDayMouseLeave: y, onNextClick: x, onPrevClick: S, showWeekNumber: C, styles: _ } = t, { formatCaption: O, formatDay: P, formatMonthDropdown: R, formatWeekNumber: A, formatWeekNumberHeader: D, formatWeekdayName: B, formatYearDropdown: k } = o, $ = BM(t, i), { days: F, months: I, navStart: Y, navEnd: q, previousMonth: N, nextMonth: M, goToMonth: X } = $, le = oM(F, t, Y, q, i), { isSelected: me, select: ge, selected: se } = XM(t, i) ?? {}, { blur: ne, focused: z, isFocusTarget: re, moveFocus: U, setFocused: Q } = zM(t, $, le, me ?? (() => !1), i), { labelDayButton: ee, labelGridcell: te, labelGrid: be, labelMonthDropdown: L, labelNav: ke, labelPrevious: Ne, labelNext: Xe, labelWeekday: So, labelWeekNumber: Yt, labelWeekNumberHeader: dy, labelYearDropdown: fy } = a, hy = Pr(() => OM(i, t.ISOWeek, t.broadcastCalendar, t.today), [i, t.ISOWeek, t.broadcastCalendar, t.today]), Rl = u !== void 0 || b !== void 0, Co = Pe(() => {
    N && (X(N), S == null || S(N));
  }, [N, X, S]), Oo = Pe(() => {
    M && (X(M), x == null || x(M));
  }, [X, M, x]), py = Pe((Z, ue) => (V) => {
    V.preventDefault(), V.stopPropagation(), Q(Z), !ue.disabled && (ge == null || ge(Z.date, ue, V), b == null || b(Z.date, ue, V));
  }, [ge, b, Q]), my = Pe((Z, ue) => (V) => {
    Q(Z), g == null || g(Z.date, ue, V);
  }, [g, Q]), gy = Pe((Z, ue) => (V) => {
    ne(), m == null || m(Z.date, ue, V);
  }, [ne, m]), vy = Pe((Z, ue) => (V) => {
    const ce = {
      ArrowLeft: [
        V.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "after" : "before"
      ],
      ArrowRight: [
        V.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "before" : "after"
      ],
      ArrowDown: [V.shiftKey ? "year" : "week", "after"],
      ArrowUp: [V.shiftKey ? "year" : "week", "before"],
      PageUp: [V.shiftKey ? "year" : "month", "before"],
      PageDown: [V.shiftKey ? "year" : "month", "after"],
      Home: ["startOfWeek", "before"],
      End: ["endOfWeek", "after"]
    };
    if (ce[V.key]) {
      V.preventDefault(), V.stopPropagation();
      const [Oe, oe] = ce[V.key];
      U(Oe, oe);
    }
    p == null || p(Z.date, ue, V);
  }, [U, p, t.dir]), by = Pe((Z, ue) => (V) => {
    w == null || w(Z.date, ue, V);
  }, [w]), yy = Pe((Z, ue) => (V) => {
    y == null || y(Z.date, ue, V);
  }, [y]), wy = Pe((Z) => (ue) => {
    const V = Number(ue.target.value), ce = i.setMonth(i.startOfMonth(Z), V);
    X(ce);
  }, [i, X]), xy = Pe((Z) => (ue) => {
    const V = Number(ue.target.value), ce = i.setYear(i.startOfMonth(Z), V);
    X(ce);
  }, [i, X]), { className: _y, style: Sy } = Pr(() => ({
    className: [c[G.Root], t.className].filter(Boolean).join(" "),
    style: { ..._ == null ? void 0 : _[G.Root], ...t.style }
  }), [c, t.className, t.style, _]), Cy = sM(t), Dl = Qt(null);
  DM(Dl, !!t.animate, {
    classNames: c,
    months: I,
    focused: z,
    dateLib: i
  });
  const Oy = {
    dayPickerProps: t,
    selected: se,
    select: ge,
    isSelected: me,
    months: I,
    nextMonth: M,
    previousMonth: N,
    goToMonth: X,
    getModifiers: le,
    components: n,
    classNames: c,
    styles: _,
    labels: a,
    formatters: o
  };
  return E.createElement(
    ob.Provider,
    { value: Oy },
    E.createElement(
      n.Root,
      { rootRef: t.animate ? Dl : void 0, className: _y, style: Sy, dir: t.dir, id: t.id, lang: t.lang ?? s.code, nonce: t.nonce, title: t.title, role: t.role, "aria-label": t["aria-label"], "aria-labelledby": t["aria-labelledby"], ...Cy },
      E.createElement(
        n.Months,
        { className: c[G.Months], style: _ == null ? void 0 : _[G.Months] },
        !t.hideNavigation && !d && E.createElement(n.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[G.Nav], style: _ == null ? void 0 : _[G.Nav], "aria-label": ke(), onPreviousClick: Co, onNextClick: Oo, previousMonth: N, nextMonth: M }),
        I.map((Z, ue) => E.createElement(
          n.Month,
          {
            "data-animated-month": t.animate ? "true" : void 0,
            className: c[G.Month],
            style: _ == null ? void 0 : _[G.Month],
            // biome-ignore lint/suspicious/noArrayIndexKey: breaks animation
            key: ue,
            displayIndex: ue,
            calendarMonth: Z
          },
          d === "around" && !t.hideNavigation && ue === 0 && E.createElement(
            n.PreviousMonthButton,
            { type: "button", className: c[G.PreviousMonthButton], tabIndex: N ? void 0 : -1, "aria-disabled": N ? void 0 : !0, "aria-label": Ne(N), onClick: Co, "data-animated-button": t.animate ? "true" : void 0 },
            E.createElement(n.Chevron, { disabled: N ? void 0 : !0, className: c[G.Chevron], orientation: t.dir === "rtl" ? "right" : "left" })
          ),
          E.createElement(n.MonthCaption, { "data-animated-caption": t.animate ? "true" : void 0, className: c[G.MonthCaption], style: _ == null ? void 0 : _[G.MonthCaption], calendarMonth: Z, displayIndex: ue }, l != null && l.startsWith("dropdown") ? E.createElement(
            n.DropdownNav,
            { className: c[G.Dropdowns], style: _ == null ? void 0 : _[G.Dropdowns] },
            (() => {
              const V = l === "dropdown" || l === "dropdown-months" ? E.createElement(n.MonthsDropdown, { key: "month", className: c[G.MonthsDropdown], "aria-label": L(), classNames: c, components: n, disabled: !!t.disableNavigation, onChange: wy(Z.date), options: SM(Z.date, Y, q, o, i), style: _ == null ? void 0 : _[G.Dropdown], value: i.getMonth(Z.date) }) : E.createElement("span", { key: "month" }, R(Z.date, i)), ce = l === "dropdown" || l === "dropdown-years" ? E.createElement(n.YearsDropdown, { key: "year", className: c[G.YearsDropdown], "aria-label": fy(i.options), classNames: c, components: n, disabled: !!t.disableNavigation, onChange: xy(Z.date), options: PM(Y, q, o, i, !!t.reverseYears), style: _ == null ? void 0 : _[G.Dropdown], value: i.getYear(Z.date) }) : E.createElement("span", { key: "year" }, k(Z.date, i));
              return i.getMonthYearOrder() === "year-first" ? [ce, V] : [V, ce];
            })(),
            E.createElement("span", { role: "status", "aria-live": "polite", style: {
              border: 0,
              clip: "rect(0 0 0 0)",
              height: "1px",
              margin: "-1px",
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              width: "1px",
              whiteSpace: "nowrap",
              wordWrap: "normal"
            } }, O(Z.date, i.options, i))
          ) : E.createElement(n.CaptionLabel, { className: c[G.CaptionLabel], role: "status", "aria-live": "polite" }, O(Z.date, i.options, i))),
          d === "around" && !t.hideNavigation && ue === f - 1 && E.createElement(
            n.NextMonthButton,
            { type: "button", className: c[G.NextMonthButton], tabIndex: M ? void 0 : -1, "aria-disabled": M ? void 0 : !0, "aria-label": Xe(M), onClick: Oo, "data-animated-button": t.animate ? "true" : void 0 },
            E.createElement(n.Chevron, { disabled: M ? void 0 : !0, className: c[G.Chevron], orientation: t.dir === "rtl" ? "left" : "right" })
          ),
          ue === f - 1 && d === "after" && !t.hideNavigation && E.createElement(n.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[G.Nav], style: _ == null ? void 0 : _[G.Nav], "aria-label": ke(), onPreviousClick: Co, onNextClick: Oo, previousMonth: N, nextMonth: M }),
          E.createElement(
            n.MonthGrid,
            { role: "grid", "aria-multiselectable": u === "multiple" || u === "range", "aria-label": be(Z.date, i.options, i) || void 0, className: c[G.MonthGrid], style: _ == null ? void 0 : _[G.MonthGrid] },
            !t.hideWeekdays && E.createElement(
              n.Weekdays,
              { "data-animated-weekdays": t.animate ? "true" : void 0, className: c[G.Weekdays], style: _ == null ? void 0 : _[G.Weekdays] },
              C && E.createElement(n.WeekNumberHeader, { "aria-label": dy(i.options), className: c[G.WeekNumberHeader], style: _ == null ? void 0 : _[G.WeekNumberHeader], scope: "col" }, D()),
              hy.map((V) => E.createElement(n.Weekday, { "aria-label": So(V, i.options, i), className: c[G.Weekday], key: String(V), style: _ == null ? void 0 : _[G.Weekday], scope: "col" }, B(V, i.options, i)))
            ),
            E.createElement(n.Weeks, { "data-animated-weeks": t.animate ? "true" : void 0, className: c[G.Weeks], style: _ == null ? void 0 : _[G.Weeks] }, Z.weeks.map((V) => E.createElement(
              n.Week,
              { className: c[G.Week], key: V.weekNumber, style: _ == null ? void 0 : _[G.Week], week: V },
              C && E.createElement(n.WeekNumber, { week: V, style: _ == null ? void 0 : _[G.WeekNumber], "aria-label": Yt(V.weekNumber, {
                locale: s
              }), className: c[G.WeekNumber], scope: "row", role: "rowheader" }, A(V.weekNumber, i)),
              V.days.map((ce) => {
                const { date: Oe } = ce, oe = le(ce);
                if (oe[ve.focused] = !oe.hidden && !!(z != null && z.isEqualTo(ce)), oe[He.selected] = (me == null ? void 0 : me(Oe)) || oe.selected, lo(se)) {
                  const { from: Po, to: Eo } = se;
                  oe[He.range_start] = !!(Po && Eo && i.isSameDay(Oe, Po)), oe[He.range_end] = !!(Po && Eo && i.isSameDay(Oe, Eo)), oe[He.range_middle] = lt(se, Oe, !0, i);
                }
                const Py = CM(oe, _, t.modifiersStyles), Ey = aM(oe, c, t.modifiersClassNames), My = !Rl && !oe.hidden ? te(Oe, oe, i.options, i) : void 0;
                return E.createElement(n.Day, { key: `${ce.isoDate}_${ce.displayMonthId}`, day: ce, modifiers: oe, className: Ey.join(" "), style: Py, role: "gridcell", "aria-selected": oe.selected || void 0, "aria-label": My, "data-day": ce.isoDate, "data-month": ce.outside ? ce.dateMonthId : void 0, "data-selected": oe.selected || void 0, "data-disabled": oe.disabled || void 0, "data-hidden": oe.hidden || void 0, "data-outside": ce.outside || void 0, "data-focused": oe.focused || void 0, "data-today": oe.today || void 0 }, !oe.hidden && Rl ? E.createElement(n.DayButton, { className: c[G.DayButton], style: _ == null ? void 0 : _[G.DayButton], type: "button", day: ce, modifiers: oe, disabled: !oe.focused && oe.disabled || void 0, "aria-disabled": oe.focused && oe.disabled || void 0, tabIndex: re(ce) ? 0 : -1, "aria-label": ee(Oe, oe, i.options, i), onClick: py(ce, oe), onBlur: gy(ce, oe), onFocus: my(ce, oe), onKeyDown: vy(ce, oe), onMouseEnter: by(ce, oe), onMouseLeave: yy(ce, oe) }, P(Oe, i.options, i)) : !oe.hidden && P(ce.date, i.options, i));
              })
            )))
          )
        ))
      ),
      t.footer && E.createElement(n.Footer, { className: c[G.Footer], style: _ == null ? void 0 : _[G.Footer], role: "status", "aria-live": "polite" }, t.footer)
    )
  );
}
function gN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    ZM,
    {
      className: T("bg-background p-3 rounded-lg border", e),
      classNames: {
        months: "flex flex-col sm:flex-row gap-4",
        month_caption: "relative flex items-center justify-center h-9 font-medium text-sm",
        nav: "absolute top-0 inset-x-0 flex justify-between",
        button_previous: "h-9 w-9 p-0 flex items-center justify-center rounded-md hover:bg-accent",
        button_next: "h-9 w-9 p-0 flex items-center justify-center rounded-md hover:bg-accent",
        weekdays: "flex w-full",
        weekday: "flex-1 text-muted-foreground text-xs font-normal h-8 flex items-center justify-center",
        week: "flex w-full mt-2",
        day: "h-9 w-9 p-0 text-center text-sm",
        day_button: "h-9 w-9 p-0 rounded-md hover:bg-accent flex items-center justify-center",
        selected: "bg-primary text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground rounded-md",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50"
      },
      components: {
        Chevron: ({ orientation: r }) => r === "left" ? /* @__PURE__ */ v(U0, { className: "h-4 w-4" }) : r === "right" ? /* @__PURE__ */ v(pc, { className: "h-4 w-4" }) : /* @__PURE__ */ v(pc, { className: "h-4 w-4" })
      },
      ...t
    }
  );
}
function vN({
  ...e
}) {
  return /* @__PURE__ */ v(qp, { "data-slot": "dialog", ...e });
}
function bN({
  ...e
}) {
  return /* @__PURE__ */ v(Wp, { "data-slot": "dialog-trigger", ...e });
}
function QM({
  ...e
}) {
  return /* @__PURE__ */ v(Bp, { "data-slot": "dialog-portal", ...e });
}
function JM({
  className: e,
  overlayClassName: t,
  backdropBlur: r = "sm",
  backdropOpacity: n = "65",
  zIndex: o = "2000",
  ...a
}) {
  const i = r === "none" ? "" : r === "sm" ? "backdrop-blur-sm" : r === "md" ? "backdrop-blur-md" : "backdrop-blur-lg";
  return /* @__PURE__ */ v(
    Lp,
    {
      "data-slot": "dialog-overlay",
      className: T(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0",
        `z-[${o}]`,
        `bg-black/${n}`,
        i,
        t,
        e
      ),
      ...a
    }
  );
}
function yN({
  className: e,
  contentClassName: t,
  children: r,
  showCloseButton: n = !0,
  closeButtonClassName: o,
  rounded: a = "3xl",
  borderOpacity: i = "",
  zIndex: s = "2001",
  overlayZIndex: c = "2000",
  overlay: l,
  overlayProps: u,
  ...d
}) {
  const f = a === "none" ? "rounded-none" : a === "sm" ? "rounded-sm" : a === "md" ? "rounded-md" : a === "lg" ? "rounded-lg" : a === "xl" ? "rounded-xl" : a === "2xl" ? "rounded-2xl" : a === "3xl" ? "rounded-3xl" : "rounded-full", m = i ? `border border-border/${i}` : "border";
  return /* @__PURE__ */ ae(QM, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ v(l || JM, { zIndex: c, ...u }),
    /* @__PURE__ */ ae(
      jp,
      {
        "data-slot": "dialog-content",
        className: T(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] grid w-full max-w-[calc(100%-2rem)] max-h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          `z-[${s}]`,
          f,
          m,
          t,
          e
        ),
        ...d,
        children: [
          r,
          n && /* @__PURE__ */ ae(
            Ic,
            {
              "data-slot": "dialog-close",
              className: T(
                "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                o
              ),
              children: [
                /* @__PURE__ */ v(jv, {}),
                /* @__PURE__ */ v("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function wN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "dialog-header",
      className: T("flex flex-col gap-2 text-center sm:text-left", e),
      ...t
    }
  );
}
function xN({
  className: e,
  showCloseButton: t = !1,
  children: r,
  ...n
}) {
  return /* @__PURE__ */ ae(
    "div",
    {
      "data-slot": "dialog-footer",
      className: T(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        e
      ),
      ...n,
      children: [
        r,
        t && /* @__PURE__ */ v(Ic, { asChild: !0, children: /* @__PURE__ */ v(qv, { variant: "outline", children: "Close" }) })
      ]
    }
  );
}
function _N({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    zp,
    {
      "data-slot": "dialog-title",
      className: T("text-lg leading-none font-semibold", e),
      ...t
    }
  );
}
function SN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    Hp,
    {
      "data-slot": "dialog-description",
      className: T("text-muted-foreground text-sm", e),
      ...t
    }
  );
}
function CN({
  ...e
}) {
  return /* @__PURE__ */ v(JS, { "data-slot": "dropdown-menu", ...e });
}
function ON({
  ...e
}) {
  return /* @__PURE__ */ v(
    eC,
    {
      "data-slot": "dropdown-menu-trigger",
      ...e
    }
  );
}
function PN({
  className: e,
  sideOffset: t = 4,
  ...r
}) {
  return /* @__PURE__ */ v(tC, { children: /* @__PURE__ */ v(
    rC,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset: t,
      className: T(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        e
      ),
      ...r
    }
  ) });
}
function EN({
  ...e
}) {
  return /* @__PURE__ */ v(nC, { "data-slot": "dropdown-menu-group", ...e });
}
function MN({
  className: e,
  inset: t,
  variant: r = "default",
  ...n
}) {
  return /* @__PURE__ */ v(
    aC,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": t,
      "data-variant": r,
      className: T(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...n
    }
  );
}
function TN({
  className: e,
  children: t,
  checked: r,
  ...n
}) {
  return /* @__PURE__ */ ae(
    iC,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      className: T(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      checked: r,
      ...n,
      children: [
        /* @__PURE__ */ v("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ v(mg, { children: /* @__PURE__ */ v(Bv, { className: "size-4" }) }) }),
        t
      ]
    }
  );
}
function RN({
  ...e
}) {
  return /* @__PURE__ */ v(
    sC,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...e
    }
  );
}
function DN({
  className: e,
  children: t,
  ...r
}) {
  return /* @__PURE__ */ ae(
    cC,
    {
      "data-slot": "dropdown-menu-radio-item",
      className: T(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...r,
      children: [
        /* @__PURE__ */ v("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ v(mg, { children: /* @__PURE__ */ v(Q0, { className: "size-2 fill-current" }) }) }),
        t
      ]
    }
  );
}
function kN({
  className: e,
  inset: t,
  ...r
}) {
  return /* @__PURE__ */ v(
    oC,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": t,
      className: T(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        e
      ),
      ...r
    }
  );
}
function NN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    lC,
    {
      "data-slot": "dropdown-menu-separator",
      className: T("bg-border -mx-1 my-1 h-px", e),
      ...t
    }
  );
}
function AN({
  ...e
}) {
  return /* @__PURE__ */ v(uC, { "data-slot": "dropdown-menu-sub", ...e });
}
function IN({
  className: e,
  inset: t,
  children: r,
  ...n
}) {
  return /* @__PURE__ */ ae(
    dC,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": t,
      className: T(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...n,
      children: [
        r,
        /* @__PURE__ */ v(pc, { className: "ml-auto size-4" })
      ]
    }
  );
}
function $N({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    fC,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: T(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        e
      ),
      ...t
    }
  );
}
const FN = Iy, yb = h.createContext(
  {}
), qN = ({
  ...e
}) => /* @__PURE__ */ v(yb.Provider, { value: { name: e.name }, children: /* @__PURE__ */ v($y, { ...e }) }), fo = () => {
  const e = h.useContext(yb), t = h.useContext(wb), { getFieldState: r } = Fy(), n = qy({ name: e.name }), o = r(e.name, n);
  if (!e)
    throw new Error("useFormField should be used within <FormField>");
  const { id: a } = t;
  return {
    id: a,
    name: e.name,
    formItemId: `${a}-form-item`,
    formDescriptionId: `${a}-form-item-description`,
    formMessageId: `${a}-form-item-message`,
    ...o
  };
}, wb = h.createContext(
  {}
);
function WN({ className: e, ...t }) {
  const r = h.useId();
  return /* @__PURE__ */ v(wb.Provider, { value: { id: r }, children: /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "form-item",
      className: T("grid gap-2", e),
      ...t
    }
  ) });
}
function BN({
  className: e,
  ...t
}) {
  const { error: r, formItemId: n } = fo();
  return /* @__PURE__ */ v(
    q0,
    {
      "data-slot": "form-label",
      "data-error": !!r,
      className: T("data-[error=true]:text-destructive", e),
      htmlFor: n,
      ...t
    }
  );
}
function LN({ ...e }) {
  const { error: t, formItemId: r, formDescriptionId: n, formMessageId: o } = fo();
  return /* @__PURE__ */ v(
    lr,
    {
      "data-slot": "form-control",
      id: r,
      "aria-describedby": t ? `${n} ${o}` : `${n}`,
      "aria-invalid": !!t,
      ...e
    }
  );
}
function jN({ className: e, ...t }) {
  const { formDescriptionId: r } = fo();
  return /* @__PURE__ */ v(
    "p",
    {
      "data-slot": "form-description",
      id: r,
      className: T("text-muted-foreground text-sm", e),
      ...t
    }
  );
}
function zN({ className: e, ...t }) {
  const { error: r, formMessageId: n } = fo(), o = r ? String((r == null ? void 0 : r.message) ?? "") : t.children;
  return o ? /* @__PURE__ */ v(
    "p",
    {
      "data-slot": "form-message",
      id: n,
      className: T("text-destructive text-sm", e),
      ...t,
      children: o
    }
  ) : null;
}
function HN({
  ...e
}) {
  return /* @__PURE__ */ v(OC, { "data-slot": "popover", ...e });
}
function YN({
  ...e
}) {
  return /* @__PURE__ */ v(PC, { "data-slot": "popover-trigger", ...e });
}
function GN({
  className: e,
  align: t = "center",
  sideOffset: r = 4,
  zIndex: n = "50",
  ...o
}) {
  return /* @__PURE__ */ v(EC, { children: /* @__PURE__ */ v(
    MC,
    {
      "data-slot": "popover-content",
      align: t,
      sideOffset: r,
      className: T(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        `z-[${n}]`,
        e
      ),
      ...o
    }
  ) });
}
function eT({
  className: e,
  orientation: t = "horizontal",
  decorative: r = !0,
  ...n
}) {
  return /* @__PURE__ */ v(
    hO,
    {
      "data-slot": "separator",
      decorative: r,
      orientation: t,
      className: T(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        e
      ),
      ...n
    }
  );
}
function tT({ ...e }) {
  return /* @__PURE__ */ v(qp, { "data-slot": "sheet", ...e });
}
function UN({
  ...e
}) {
  return /* @__PURE__ */ v(Wp, { "data-slot": "sheet-trigger", ...e });
}
function rT({
  ...e
}) {
  return /* @__PURE__ */ v(Bp, { "data-slot": "sheet-portal", ...e });
}
function nT({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    Lp,
    {
      "data-slot": "sheet-overlay",
      className: T(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        e
      ),
      ...t
    }
  );
}
function oT({
  className: e,
  children: t,
  side: r = "right",
  showCloseButton: n = !0,
  ...o
}) {
  return /* @__PURE__ */ ae(rT, { children: [
    /* @__PURE__ */ v(nT, {}),
    /* @__PURE__ */ ae(
      jp,
      {
        "data-slot": "sheet-content",
        className: T(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          r === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          r === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          r === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          r === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          e
        ),
        ...o,
        children: [
          t,
          n && /* @__PURE__ */ ae(Ic, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ v(jv, { className: "size-4" }),
            /* @__PURE__ */ v("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function aT({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sheet-header",
      className: T("flex flex-col gap-1.5 p-4", e),
      ...t
    }
  );
}
function VN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sheet-footer",
      className: T("mt-auto flex flex-col gap-2 p-4", e),
      ...t
    }
  );
}
function iT({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    zp,
    {
      "data-slot": "sheet-title",
      className: T("text-foreground font-semibold", e),
      ...t
    }
  );
}
function sT({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    Hp,
    {
      "data-slot": "sheet-description",
      className: T("text-muted-foreground text-sm", e),
      ...t
    }
  );
}
const Vo = 768;
function cT() {
  const [e, t] = h.useState(
    void 0
  );
  return h.useEffect(() => {
    const r = window.matchMedia(`(max-width: ${Vo - 1}px)`), n = () => {
      t(window.innerWidth < Vo);
    };
    return r.addEventListener("change", n), t(window.innerWidth < Vo), () => r.removeEventListener("change", n);
  }, []), !!e;
}
function ku({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "skeleton",
      className: T("bg-accent animate-pulse rounded-md", e),
      ...t
    }
  );
}
function lT({
  delayDuration: e = 0,
  ...t
}) {
  return /* @__PURE__ */ v(
    LO,
    {
      "data-slot": "tooltip-provider",
      delayDuration: e,
      ...t
    }
  );
}
function uT({
  ...e
}) {
  return /* @__PURE__ */ v(jO, { "data-slot": "tooltip", ...e });
}
function dT({
  ...e
}) {
  return /* @__PURE__ */ v(zO, { "data-slot": "tooltip-trigger", ...e });
}
function fT({
  className: e,
  sideOffset: t = 0,
  children: r,
  ...n
}) {
  return /* @__PURE__ */ v(HO, { children: /* @__PURE__ */ ae(
    YO,
    {
      "data-slot": "tooltip-content",
      sideOffset: t,
      className: T(
        "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        e
      ),
      ...n,
      children: [
        r,
        /* @__PURE__ */ v(GO, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
const hT = "sidebar_state", pT = 3600 * 24 * 7, mT = "16rem", gT = "18rem", vT = "3rem", bT = "b", xb = h.createContext(null);
function ho() {
  const e = h.useContext(xb);
  if (!e)
    throw new Error("useSidebar must be used within a SidebarProvider.");
  return e;
}
function KN({
  defaultOpen: e = !0,
  open: t,
  onOpenChange: r,
  className: n,
  style: o,
  children: a,
  ...i
}) {
  const s = cT(), [c, l] = h.useState(!1), [u, d] = h.useState(e), f = t ?? u, m = h.useCallback(
    (w) => {
      const y = typeof w == "function" ? w(f) : w;
      r ? r(y) : d(y), document.cookie = `${hT}=${y}; path=/; max-age=${pT}`;
    },
    [r, f]
  ), b = h.useCallback(() => s ? l((w) => !w) : m((w) => !w), [s, m, l]);
  h.useEffect(() => {
    const w = (y) => {
      y.key === bT && (y.metaKey || y.ctrlKey) && (y.preventDefault(), b());
    };
    return window.addEventListener("keydown", w), () => window.removeEventListener("keydown", w);
  }, [b]);
  const g = f ? "expanded" : "collapsed", p = h.useMemo(
    () => ({
      state: g,
      open: f,
      setOpen: m,
      isMobile: s,
      openMobile: c,
      setOpenMobile: l,
      toggleSidebar: b
    }),
    [g, f, m, s, c, l, b]
  );
  return /* @__PURE__ */ v(xb.Provider, { value: p, children: /* @__PURE__ */ v(lT, { delayDuration: 0, children: /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": mT,
        "--sidebar-width-icon": vT,
        ...o
      },
      className: T(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        n
      ),
      ...i,
      children: a
    }
  ) }) });
}
function XN({
  side: e = "left",
  variant: t = "sidebar",
  collapsible: r = "offcanvas",
  className: n,
  children: o,
  ...a
}) {
  const { isMobile: i, state: s, openMobile: c, setOpenMobile: l } = ho();
  return r === "none" ? /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar",
      className: T(
        "bg-veloce-glass backdrop-blur-2xl border-r border-white/5 text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
        n
      ),
      ...a,
      children: o
    }
  ) : i ? /* @__PURE__ */ v(tT, { open: c, onOpenChange: l, ...a, children: /* @__PURE__ */ ae(
    oT,
    {
      "data-sidebar": "sidebar",
      "data-slot": "sidebar",
      "data-mobile": "true",
      className: "bg-veloce-glass backdrop-blur-2xl border-r border-white/5 text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
      style: {
        "--sidebar-width": gT
      },
      side: e,
      children: [
        /* @__PURE__ */ ae(aT, { className: "sr-only", children: [
          /* @__PURE__ */ v(iT, { children: "Sidebar" }),
          /* @__PURE__ */ v(sT, { children: "Displays the mobile sidebar." })
        ] }),
        /* @__PURE__ */ v("div", { className: "flex h-full w-full flex-col", children: o })
      ]
    }
  ) }) : /* @__PURE__ */ ae(
    "div",
    {
      className: "group peer text-sidebar-foreground hidden md:block",
      "data-state": s,
      "data-collapsible": s === "collapsed" ? r : "",
      "data-variant": t,
      "data-side": e,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ v(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: T(
              "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              t === "floating" || t === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ v(
          "div",
          {
            "data-slot": "sidebar-container",
            className: T(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              e === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              t === "floating" || t === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              n
            ),
            ...a,
            children: /* @__PURE__ */ v(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "bg-veloce-glass backdrop-blur-2xl border-r border-white/5 group-data-[variant=floating]:border-white/10 flex h-full w-full flex-col group-data-[variant=floating]:rounded-[2rem] group-data-[variant=floating]:border group-data-[variant=floating]:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
                children: o
              }
            )
          }
        )
      ]
    }
  );
}
function ZN({
  className: e,
  onClick: t,
  ...r
}) {
  const { toggleSidebar: n } = ho();
  return /* @__PURE__ */ ae(
    qv,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      className: T("size-7", e),
      onClick: (o) => {
        t == null || t(o), n();
      },
      ...r,
      children: [
        /* @__PURE__ */ v(eP, {}),
        /* @__PURE__ */ v("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function QN({ className: e, ...t }) {
  const { toggleSidebar: r } = ho();
  return /* @__PURE__ */ v(
    "button",
    {
      "data-sidebar": "rail",
      "data-slot": "sidebar-rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: r,
      title: "Toggle Sidebar",
      className: T(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        e
      ),
      ...t
    }
  );
}
function JN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: T(
        "bg-transparent relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        e
      ),
      ...t
    }
  );
}
function eA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    F0,
    {
      "data-slot": "sidebar-input",
      "data-sidebar": "input",
      className: T("bg-background h-8 w-full shadow-none", e),
      ...t
    }
  );
}
function tA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: T("flex flex-col gap-2 p-2", e),
      ...t
    }
  );
}
function rA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: T("flex flex-col gap-2 p-2", e),
      ...t
    }
  );
}
function nA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    eT,
    {
      "data-slot": "sidebar-separator",
      "data-sidebar": "separator",
      className: T("bg-sidebar-border mx-2 w-auto", e),
      ...t
    }
  );
}
function oA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: T(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        e
      ),
      ...t
    }
  );
}
function aA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: T("relative flex w-full min-w-0 flex-col p-2", e),
      ...t
    }
  );
}
function iA({
  className: e,
  asChild: t = !1,
  ...r
}) {
  return /* @__PURE__ */ v(
    t ? lr : "div",
    {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      className: T(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        e
      ),
      ...r
    }
  );
}
function sA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      className: T("w-full text-sm", e),
      ...t
    }
  );
}
function cA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: T("flex w-full min-w-0 flex-col gap-1", e),
      ...t
    }
  );
}
function lA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: T("group/menu-item relative", e),
      ...t
    }
  );
}
const yT = ip(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function uA({
  asChild: e = !1,
  isActive: t = !1,
  variant: r = "default",
  size: n = "default",
  tooltip: o,
  className: a,
  ...i
}) {
  const s = e ? lr : "button", { isMobile: c, state: l } = ho(), u = /* @__PURE__ */ v(
    s,
    {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": n,
      "data-active": t,
      className: T(yT({ variant: r, size: n }), a),
      ...i
    }
  );
  return o ? (typeof o == "string" && (o = {
    children: o
  }), /* @__PURE__ */ ae(uT, { children: [
    /* @__PURE__ */ v(dT, { asChild: !0, children: u }),
    /* @__PURE__ */ v(
      fT,
      {
        side: "right",
        align: "center",
        hidden: l !== "collapsed" || c,
        ...o
      }
    )
  ] })) : u;
}
function dA({
  className: e,
  asChild: t = !1,
  showOnHover: r = !1,
  ...n
}) {
  return /* @__PURE__ */ v(
    t ? lr : "button",
    {
      "data-slot": "sidebar-menu-action",
      "data-sidebar": "menu-action",
      className: T(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        r && "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        e
      ),
      ...n
    }
  );
}
function fA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-menu-badge",
      "data-sidebar": "menu-badge",
      className: T(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        e
      ),
      ...t
    }
  );
}
function hA({
  className: e,
  showIcon: t = !1,
  ...r
}) {
  const [n, o] = h.useState("100%");
  return h.useEffect(() => {
    o(`${Math.floor(Math.random() * 40) + 50}%`);
  }, []), /* @__PURE__ */ ae(
    "div",
    {
      "data-slot": "sidebar-menu-skeleton",
      "data-sidebar": "menu-skeleton",
      className: T("flex h-8 items-center gap-2 rounded-md px-2", e),
      ...r,
      children: [
        t && /* @__PURE__ */ v(
          ku,
          {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
          }
        ),
        /* @__PURE__ */ v(
          ku,
          {
            className: "h-4 max-w-(--skeleton-width) flex-1",
            "data-sidebar": "menu-skeleton-text",
            style: {
              "--skeleton-width": n
            }
          }
        )
      ]
    }
  );
}
function pA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "ul",
    {
      "data-slot": "sidebar-menu-sub",
      "data-sidebar": "menu-sub",
      className: T(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        e
      ),
      ...t
    }
  );
}
function mA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    "li",
    {
      "data-slot": "sidebar-menu-sub-item",
      "data-sidebar": "menu-sub-item",
      className: T("group/menu-sub-item relative", e),
      ...t
    }
  );
}
function gA({
  asChild: e = !1,
  size: t = "md",
  isActive: r = !1,
  className: n,
  ...o
}) {
  return /* @__PURE__ */ v(
    e ? lr : "a",
    {
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      "data-size": t,
      "data-active": r,
      className: T(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        t === "sm" && "text-xs",
        t === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        n
      ),
      ...o
    }
  );
}
function vA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ v(
        "table",
        {
          "data-slot": "table",
          className: T("w-full caption-bottom text-sm", e),
          ...t
        }
      )
    }
  );
}
function bA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "thead",
    {
      "data-slot": "table-header",
      className: T("[&_tr]:border-b", e),
      ...t
    }
  );
}
function yA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "tbody",
    {
      "data-slot": "table-body",
      className: T("[&_tr:last-child]:border-0", e),
      ...t
    }
  );
}
function wA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: T(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        e
      ),
      ...t
    }
  );
}
function xA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "tr",
    {
      "data-slot": "table-row",
      className: T(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        e
      ),
      ...t
    }
  );
}
function _A({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "th",
    {
      "data-slot": "table-head",
      className: T(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        e
      ),
      ...t
    }
  );
}
function SA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "td",
    {
      "data-slot": "table-cell",
      className: T(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        e
      ),
      ...t
    }
  );
}
function CA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    "caption",
    {
      "data-slot": "table-caption",
      className: T("text-muted-foreground mt-4 text-sm", e),
      ...t
    }
  );
}
function OA({
  className: e,
  orientation: t = "horizontal",
  ...r
}) {
  return /* @__PURE__ */ v(
    _O,
    {
      "data-slot": "tabs",
      orientation: t,
      className: T("w-full", e),
      ...r
    }
  );
}
function PA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    SO,
    {
      "data-slot": "tabs-list",
      className: T(
        "inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        e
      ),
      ...t
    }
  );
}
function EA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    CO,
    {
      "data-slot": "tabs-trigger",
      className: T(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        e
      ),
      ...t
    }
  );
}
function MA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    OO,
    {
      "data-slot": "tabs-content",
      className: T("outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", e),
      ...t
    }
  );
}
var Ko, Nu;
function Ve() {
  if (Nu) return Ko;
  Nu = 1;
  var e = Array.isArray;
  return Ko = e, Ko;
}
var Xo, Au;
function _b() {
  if (Au) return Xo;
  Au = 1;
  var e = typeof sn == "object" && sn && sn.Object === Object && sn;
  return Xo = e, Xo;
}
var Zo, Iu;
function it() {
  if (Iu) return Zo;
  Iu = 1;
  var e = _b(), t = typeof self == "object" && self && self.Object === Object && self, r = e || t || Function("return this")();
  return Zo = r, Zo;
}
var Qo, $u;
function Jr() {
  if ($u) return Qo;
  $u = 1;
  var e = it(), t = e.Symbol;
  return Qo = t, Qo;
}
var Jo, Fu;
function wT() {
  if (Fu) return Jo;
  Fu = 1;
  var e = Jr(), t = Object.prototype, r = t.hasOwnProperty, n = t.toString, o = e ? e.toStringTag : void 0;
  function a(i) {
    var s = r.call(i, o), c = i[o];
    try {
      i[o] = void 0;
      var l = !0;
    } catch {
    }
    var u = n.call(i);
    return l && (s ? i[o] = c : delete i[o]), u;
  }
  return Jo = a, Jo;
}
var ea, qu;
function xT() {
  if (qu) return ea;
  qu = 1;
  var e = Object.prototype, t = e.toString;
  function r(n) {
    return t.call(n);
  }
  return ea = r, ea;
}
var ta, Wu;
function jt() {
  if (Wu) return ta;
  Wu = 1;
  var e = Jr(), t = wT(), r = xT(), n = "[object Null]", o = "[object Undefined]", a = e ? e.toStringTag : void 0;
  function i(s) {
    return s == null ? s === void 0 ? o : n : a && a in Object(s) ? t(s) : r(s);
  }
  return ta = i, ta;
}
var ra, Bu;
function zt() {
  if (Bu) return ra;
  Bu = 1;
  function e(t) {
    return t != null && typeof t == "object";
  }
  return ra = e, ra;
}
var na, Lu;
function en() {
  if (Lu) return na;
  Lu = 1;
  var e = jt(), t = zt(), r = "[object Symbol]";
  function n(o) {
    return typeof o == "symbol" || t(o) && e(o) == r;
  }
  return na = n, na;
}
var oa, ju;
function pl() {
  if (ju) return oa;
  ju = 1;
  var e = Ve(), t = en(), r = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, n = /^\w*$/;
  function o(a, i) {
    if (e(a))
      return !1;
    var s = typeof a;
    return s == "number" || s == "symbol" || s == "boolean" || a == null || t(a) ? !0 : n.test(a) || !r.test(a) || i != null && a in Object(i);
  }
  return oa = o, oa;
}
var aa, zu;
function Tt() {
  if (zu) return aa;
  zu = 1;
  function e(t) {
    var r = typeof t;
    return t != null && (r == "object" || r == "function");
  }
  return aa = e, aa;
}
var ia, Hu;
function ml() {
  if (Hu) return ia;
  Hu = 1;
  var e = jt(), t = Tt(), r = "[object AsyncFunction]", n = "[object Function]", o = "[object GeneratorFunction]", a = "[object Proxy]";
  function i(s) {
    if (!t(s))
      return !1;
    var c = e(s);
    return c == n || c == o || c == r || c == a;
  }
  return ia = i, ia;
}
var sa, Yu;
function _T() {
  if (Yu) return sa;
  Yu = 1;
  var e = it(), t = e["__core-js_shared__"];
  return sa = t, sa;
}
var ca, Gu;
function ST() {
  if (Gu) return ca;
  Gu = 1;
  var e = _T(), t = (function() {
    var n = /[^.]+$/.exec(e && e.keys && e.keys.IE_PROTO || "");
    return n ? "Symbol(src)_1." + n : "";
  })();
  function r(n) {
    return !!t && t in n;
  }
  return ca = r, ca;
}
var la, Uu;
function Sb() {
  if (Uu) return la;
  Uu = 1;
  var e = Function.prototype, t = e.toString;
  function r(n) {
    if (n != null) {
      try {
        return t.call(n);
      } catch {
      }
      try {
        return n + "";
      } catch {
      }
    }
    return "";
  }
  return la = r, la;
}
var ua, Vu;
function CT() {
  if (Vu) return ua;
  Vu = 1;
  var e = ml(), t = ST(), r = Tt(), n = Sb(), o = /[\\^$.*+?()[\]{}|]/g, a = /^\[object .+?Constructor\]$/, i = Function.prototype, s = Object.prototype, c = i.toString, l = s.hasOwnProperty, u = RegExp(
    "^" + c.call(l).replace(o, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function d(f) {
    if (!r(f) || t(f))
      return !1;
    var m = e(f) ? u : a;
    return m.test(n(f));
  }
  return ua = d, ua;
}
var da, Ku;
function OT() {
  if (Ku) return da;
  Ku = 1;
  function e(t, r) {
    return t == null ? void 0 : t[r];
  }
  return da = e, da;
}
var fa, Xu;
function Ht() {
  if (Xu) return fa;
  Xu = 1;
  var e = CT(), t = OT();
  function r(n, o) {
    var a = t(n, o);
    return e(a) ? a : void 0;
  }
  return fa = r, fa;
}
var ha, Zu;
function po() {
  if (Zu) return ha;
  Zu = 1;
  var e = Ht(), t = e(Object, "create");
  return ha = t, ha;
}
var pa, Qu;
function PT() {
  if (Qu) return pa;
  Qu = 1;
  var e = po();
  function t() {
    this.__data__ = e ? e(null) : {}, this.size = 0;
  }
  return pa = t, pa;
}
var ma, Ju;
function ET() {
  if (Ju) return ma;
  Ju = 1;
  function e(t) {
    var r = this.has(t) && delete this.__data__[t];
    return this.size -= r ? 1 : 0, r;
  }
  return ma = e, ma;
}
var ga, ed;
function MT() {
  if (ed) return ga;
  ed = 1;
  var e = po(), t = "__lodash_hash_undefined__", r = Object.prototype, n = r.hasOwnProperty;
  function o(a) {
    var i = this.__data__;
    if (e) {
      var s = i[a];
      return s === t ? void 0 : s;
    }
    return n.call(i, a) ? i[a] : void 0;
  }
  return ga = o, ga;
}
var va, td;
function TT() {
  if (td) return va;
  td = 1;
  var e = po(), t = Object.prototype, r = t.hasOwnProperty;
  function n(o) {
    var a = this.__data__;
    return e ? a[o] !== void 0 : r.call(a, o);
  }
  return va = n, va;
}
var ba, rd;
function RT() {
  if (rd) return ba;
  rd = 1;
  var e = po(), t = "__lodash_hash_undefined__";
  function r(n, o) {
    var a = this.__data__;
    return this.size += this.has(n) ? 0 : 1, a[n] = e && o === void 0 ? t : o, this;
  }
  return ba = r, ba;
}
var ya, nd;
function DT() {
  if (nd) return ya;
  nd = 1;
  var e = PT(), t = ET(), r = MT(), n = TT(), o = RT();
  function a(i) {
    var s = -1, c = i == null ? 0 : i.length;
    for (this.clear(); ++s < c; ) {
      var l = i[s];
      this.set(l[0], l[1]);
    }
  }
  return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = r, a.prototype.has = n, a.prototype.set = o, ya = a, ya;
}
var wa, od;
function kT() {
  if (od) return wa;
  od = 1;
  function e() {
    this.__data__ = [], this.size = 0;
  }
  return wa = e, wa;
}
var xa, ad;
function gl() {
  if (ad) return xa;
  ad = 1;
  function e(t, r) {
    return t === r || t !== t && r !== r;
  }
  return xa = e, xa;
}
var _a, id;
function mo() {
  if (id) return _a;
  id = 1;
  var e = gl();
  function t(r, n) {
    for (var o = r.length; o--; )
      if (e(r[o][0], n))
        return o;
    return -1;
  }
  return _a = t, _a;
}
var Sa, sd;
function NT() {
  if (sd) return Sa;
  sd = 1;
  var e = mo(), t = Array.prototype, r = t.splice;
  function n(o) {
    var a = this.__data__, i = e(a, o);
    if (i < 0)
      return !1;
    var s = a.length - 1;
    return i == s ? a.pop() : r.call(a, i, 1), --this.size, !0;
  }
  return Sa = n, Sa;
}
var Ca, cd;
function AT() {
  if (cd) return Ca;
  cd = 1;
  var e = mo();
  function t(r) {
    var n = this.__data__, o = e(n, r);
    return o < 0 ? void 0 : n[o][1];
  }
  return Ca = t, Ca;
}
var Oa, ld;
function IT() {
  if (ld) return Oa;
  ld = 1;
  var e = mo();
  function t(r) {
    return e(this.__data__, r) > -1;
  }
  return Oa = t, Oa;
}
var Pa, ud;
function $T() {
  if (ud) return Pa;
  ud = 1;
  var e = mo();
  function t(r, n) {
    var o = this.__data__, a = e(o, r);
    return a < 0 ? (++this.size, o.push([r, n])) : o[a][1] = n, this;
  }
  return Pa = t, Pa;
}
var Ea, dd;
function go() {
  if (dd) return Ea;
  dd = 1;
  var e = kT(), t = NT(), r = AT(), n = IT(), o = $T();
  function a(i) {
    var s = -1, c = i == null ? 0 : i.length;
    for (this.clear(); ++s < c; ) {
      var l = i[s];
      this.set(l[0], l[1]);
    }
  }
  return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = r, a.prototype.has = n, a.prototype.set = o, Ea = a, Ea;
}
var Ma, fd;
function vl() {
  if (fd) return Ma;
  fd = 1;
  var e = Ht(), t = it(), r = e(t, "Map");
  return Ma = r, Ma;
}
var Ta, hd;
function FT() {
  if (hd) return Ta;
  hd = 1;
  var e = DT(), t = go(), r = vl();
  function n() {
    this.size = 0, this.__data__ = {
      hash: new e(),
      map: new (r || t)(),
      string: new e()
    };
  }
  return Ta = n, Ta;
}
var Ra, pd;
function qT() {
  if (pd) return Ra;
  pd = 1;
  function e(t) {
    var r = typeof t;
    return r == "string" || r == "number" || r == "symbol" || r == "boolean" ? t !== "__proto__" : t === null;
  }
  return Ra = e, Ra;
}
var Da, md;
function vo() {
  if (md) return Da;
  md = 1;
  var e = qT();
  function t(r, n) {
    var o = r.__data__;
    return e(n) ? o[typeof n == "string" ? "string" : "hash"] : o.map;
  }
  return Da = t, Da;
}
var ka, gd;
function WT() {
  if (gd) return ka;
  gd = 1;
  var e = vo();
  function t(r) {
    var n = e(this, r).delete(r);
    return this.size -= n ? 1 : 0, n;
  }
  return ka = t, ka;
}
var Na, vd;
function BT() {
  if (vd) return Na;
  vd = 1;
  var e = vo();
  function t(r) {
    return e(this, r).get(r);
  }
  return Na = t, Na;
}
var Aa, bd;
function LT() {
  if (bd) return Aa;
  bd = 1;
  var e = vo();
  function t(r) {
    return e(this, r).has(r);
  }
  return Aa = t, Aa;
}
var Ia, yd;
function jT() {
  if (yd) return Ia;
  yd = 1;
  var e = vo();
  function t(r, n) {
    var o = e(this, r), a = o.size;
    return o.set(r, n), this.size += o.size == a ? 0 : 1, this;
  }
  return Ia = t, Ia;
}
var $a, wd;
function bl() {
  if (wd) return $a;
  wd = 1;
  var e = FT(), t = WT(), r = BT(), n = LT(), o = jT();
  function a(i) {
    var s = -1, c = i == null ? 0 : i.length;
    for (this.clear(); ++s < c; ) {
      var l = i[s];
      this.set(l[0], l[1]);
    }
  }
  return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = r, a.prototype.has = n, a.prototype.set = o, $a = a, $a;
}
var Fa, xd;
function zT() {
  if (xd) return Fa;
  xd = 1;
  var e = bl(), t = "Expected a function";
  function r(n, o) {
    if (typeof n != "function" || o != null && typeof o != "function")
      throw new TypeError(t);
    var a = function() {
      var i = arguments, s = o ? o.apply(this, i) : i[0], c = a.cache;
      if (c.has(s))
        return c.get(s);
      var l = n.apply(this, i);
      return a.cache = c.set(s, l) || c, l;
    };
    return a.cache = new (r.Cache || e)(), a;
  }
  return r.Cache = e, Fa = r, Fa;
}
var qa, _d;
function HT() {
  if (_d) return qa;
  _d = 1;
  var e = zT(), t = 500;
  function r(n) {
    var o = e(n, function(i) {
      return a.size === t && a.clear(), i;
    }), a = o.cache;
    return o;
  }
  return qa = r, qa;
}
var Wa, Sd;
function YT() {
  if (Sd) return Wa;
  Sd = 1;
  var e = HT(), t = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, r = /\\(\\)?/g, n = e(function(o) {
    var a = [];
    return o.charCodeAt(0) === 46 && a.push(""), o.replace(t, function(i, s, c, l) {
      a.push(c ? l.replace(r, "$1") : s || i);
    }), a;
  });
  return Wa = n, Wa;
}
var Ba, Cd;
function Cb() {
  if (Cd) return Ba;
  Cd = 1;
  function e(t, r) {
    for (var n = -1, o = t == null ? 0 : t.length, a = Array(o); ++n < o; )
      a[n] = r(t[n], n, t);
    return a;
  }
  return Ba = e, Ba;
}
var La, Od;
function GT() {
  if (Od) return La;
  Od = 1;
  var e = Jr(), t = Cb(), r = Ve(), n = en(), o = e ? e.prototype : void 0, a = o ? o.toString : void 0;
  function i(s) {
    if (typeof s == "string")
      return s;
    if (r(s))
      return t(s, i) + "";
    if (n(s))
      return a ? a.call(s) : "";
    var c = s + "";
    return c == "0" && 1 / s == -1 / 0 ? "-0" : c;
  }
  return La = i, La;
}
var ja, Pd;
function Ob() {
  if (Pd) return ja;
  Pd = 1;
  var e = GT();
  function t(r) {
    return r == null ? "" : e(r);
  }
  return ja = t, ja;
}
var za, Ed;
function Pb() {
  if (Ed) return za;
  Ed = 1;
  var e = Ve(), t = pl(), r = YT(), n = Ob();
  function o(a, i) {
    return e(a) ? a : t(a, i) ? [a] : r(n(a));
  }
  return za = o, za;
}
var Ha, Md;
function bo() {
  if (Md) return Ha;
  Md = 1;
  var e = en();
  function t(r) {
    if (typeof r == "string" || e(r))
      return r;
    var n = r + "";
    return n == "0" && 1 / r == -1 / 0 ? "-0" : n;
  }
  return Ha = t, Ha;
}
var Ya, Td;
function yl() {
  if (Td) return Ya;
  Td = 1;
  var e = Pb(), t = bo();
  function r(n, o) {
    o = e(o, n);
    for (var a = 0, i = o.length; n != null && a < i; )
      n = n[t(o[a++])];
    return a && a == i ? n : void 0;
  }
  return Ya = r, Ya;
}
var Ga, Rd;
function Eb() {
  if (Rd) return Ga;
  Rd = 1;
  var e = yl();
  function t(r, n, o) {
    var a = r == null ? void 0 : e(r, n);
    return a === void 0 ? o : a;
  }
  return Ga = t, Ga;
}
Eb();
var Ua, Dd;
function UT() {
  if (Dd) return Ua;
  Dd = 1;
  function e(t) {
    return t == null;
  }
  return Ua = e, Ua;
}
var VT = UT();
const KT = /* @__PURE__ */ nt(VT);
var Va, kd;
function XT() {
  if (kd) return Va;
  kd = 1;
  var e = jt(), t = Ve(), r = zt(), n = "[object String]";
  function o(a) {
    return typeof a == "string" || !t(a) && r(a) && e(a) == n;
  }
  return Va = o, Va;
}
var ZT = XT();
const Mb = /* @__PURE__ */ nt(ZT);
var QT = ml();
const Rn = /* @__PURE__ */ nt(QT);
var JT = Tt();
const Tb = /* @__PURE__ */ nt(JT);
var fn = { exports: {} }, de = {};
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Nd;
function eR() {
  if (Nd) return de;
  Nd = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), a = Symbol.for("react.provider"), i = Symbol.for("react.context"), s = Symbol.for("react.server_context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.suspense_list"), d = Symbol.for("react.memo"), f = Symbol.for("react.lazy"), m = Symbol.for("react.offscreen"), b;
  b = Symbol.for("react.module.reference");
  function g(p) {
    if (typeof p == "object" && p !== null) {
      var w = p.$$typeof;
      switch (w) {
        case e:
          switch (p = p.type, p) {
            case r:
            case o:
            case n:
            case l:
            case u:
              return p;
            default:
              switch (p = p && p.$$typeof, p) {
                case s:
                case i:
                case c:
                case f:
                case d:
                case a:
                  return p;
                default:
                  return w;
              }
          }
        case t:
          return w;
      }
    }
  }
  return de.ContextConsumer = i, de.ContextProvider = a, de.Element = e, de.ForwardRef = c, de.Fragment = r, de.Lazy = f, de.Memo = d, de.Portal = t, de.Profiler = o, de.StrictMode = n, de.Suspense = l, de.SuspenseList = u, de.isAsyncMode = function() {
    return !1;
  }, de.isConcurrentMode = function() {
    return !1;
  }, de.isContextConsumer = function(p) {
    return g(p) === i;
  }, de.isContextProvider = function(p) {
    return g(p) === a;
  }, de.isElement = function(p) {
    return typeof p == "object" && p !== null && p.$$typeof === e;
  }, de.isForwardRef = function(p) {
    return g(p) === c;
  }, de.isFragment = function(p) {
    return g(p) === r;
  }, de.isLazy = function(p) {
    return g(p) === f;
  }, de.isMemo = function(p) {
    return g(p) === d;
  }, de.isPortal = function(p) {
    return g(p) === t;
  }, de.isProfiler = function(p) {
    return g(p) === o;
  }, de.isStrictMode = function(p) {
    return g(p) === n;
  }, de.isSuspense = function(p) {
    return g(p) === l;
  }, de.isSuspenseList = function(p) {
    return g(p) === u;
  }, de.isValidElementType = function(p) {
    return typeof p == "string" || typeof p == "function" || p === r || p === o || p === n || p === l || p === u || p === m || typeof p == "object" && p !== null && (p.$$typeof === f || p.$$typeof === d || p.$$typeof === a || p.$$typeof === i || p.$$typeof === c || p.$$typeof === b || p.getModuleId !== void 0);
  }, de.typeOf = g, de;
}
var fe = {};
/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ad;
function tR() {
  return Ad || (Ad = 1, process.env.NODE_ENV !== "production" && (function() {
    var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), a = Symbol.for("react.provider"), i = Symbol.for("react.context"), s = Symbol.for("react.server_context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.suspense_list"), d = Symbol.for("react.memo"), f = Symbol.for("react.lazy"), m = Symbol.for("react.offscreen"), b = !1, g = !1, p = !1, w = !1, y = !1, x;
    x = Symbol.for("react.module.reference");
    function S(L) {
      return !!(typeof L == "string" || typeof L == "function" || L === r || L === o || y || L === n || L === l || L === u || w || L === m || b || g || p || typeof L == "object" && L !== null && (L.$$typeof === f || L.$$typeof === d || L.$$typeof === a || L.$$typeof === i || L.$$typeof === c || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      L.$$typeof === x || L.getModuleId !== void 0));
    }
    function C(L) {
      if (typeof L == "object" && L !== null) {
        var ke = L.$$typeof;
        switch (ke) {
          case e:
            var Ne = L.type;
            switch (Ne) {
              case r:
              case o:
              case n:
              case l:
              case u:
                return Ne;
              default:
                var Xe = Ne && Ne.$$typeof;
                switch (Xe) {
                  case s:
                  case i:
                  case c:
                  case f:
                  case d:
                  case a:
                    return Xe;
                  default:
                    return ke;
                }
            }
          case t:
            return ke;
        }
      }
    }
    var _ = i, O = a, P = e, R = c, A = r, D = f, B = d, k = t, $ = o, F = n, I = l, Y = u, q = !1, N = !1;
    function M(L) {
      return q || (q = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 18+.")), !1;
    }
    function X(L) {
      return N || (N = !0, console.warn("The ReactIs.isConcurrentMode() alias has been deprecated, and will be removed in React 18+.")), !1;
    }
    function le(L) {
      return C(L) === i;
    }
    function me(L) {
      return C(L) === a;
    }
    function ge(L) {
      return typeof L == "object" && L !== null && L.$$typeof === e;
    }
    function se(L) {
      return C(L) === c;
    }
    function ne(L) {
      return C(L) === r;
    }
    function z(L) {
      return C(L) === f;
    }
    function re(L) {
      return C(L) === d;
    }
    function U(L) {
      return C(L) === t;
    }
    function Q(L) {
      return C(L) === o;
    }
    function ee(L) {
      return C(L) === n;
    }
    function te(L) {
      return C(L) === l;
    }
    function be(L) {
      return C(L) === u;
    }
    fe.ContextConsumer = _, fe.ContextProvider = O, fe.Element = P, fe.ForwardRef = R, fe.Fragment = A, fe.Lazy = D, fe.Memo = B, fe.Portal = k, fe.Profiler = $, fe.StrictMode = F, fe.Suspense = I, fe.SuspenseList = Y, fe.isAsyncMode = M, fe.isConcurrentMode = X, fe.isContextConsumer = le, fe.isContextProvider = me, fe.isElement = ge, fe.isForwardRef = se, fe.isFragment = ne, fe.isLazy = z, fe.isMemo = re, fe.isPortal = U, fe.isProfiler = Q, fe.isStrictMode = ee, fe.isSuspense = te, fe.isSuspenseList = be, fe.isValidElementType = S, fe.typeOf = C;
  })()), fe;
}
var Id;
function rR() {
  return Id || (Id = 1, process.env.NODE_ENV === "production" ? fn.exports = eR() : fn.exports = tR()), fn.exports;
}
rR();
var Ka, $d;
function Rb() {
  if ($d) return Ka;
  $d = 1;
  var e = jt(), t = zt(), r = "[object Number]";
  function n(o) {
    return typeof o == "number" || t(o) && e(o) == r;
  }
  return Ka = n, Ka;
}
var Xa, Fd;
function nR() {
  if (Fd) return Xa;
  Fd = 1;
  var e = Rb();
  function t(r) {
    return e(r) && r != +r;
  }
  return Xa = t, Xa;
}
var oR = nR();
const aR = /* @__PURE__ */ nt(oR);
var iR = Rb();
const sR = /* @__PURE__ */ nt(iR);
var hn = function(t) {
  return Mb(t) && t.indexOf("%") === t.length - 1;
}, ze = function(t) {
  return sR(t) && !aR(t);
}, Dn = function(t) {
  return ze(t) || Mb(t);
};
function gc(e) {
  "@babel/helpers - typeof";
  return gc = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, gc(e);
}
var cR = ["viewBox", "children"], lR = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-details",
  "aria-disabled",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
  "className",
  "color",
  "height",
  "id",
  "lang",
  "max",
  "media",
  "method",
  "min",
  "name",
  "style",
  /*
   * removed 'type' SVGElementPropKey because we do not currently use any SVG elements
   * that can use it and it conflicts with the recharts prop 'type'
   * https://github.com/recharts/recharts/pull/3327
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/type
   */
  // 'type',
  "target",
  "width",
  "role",
  "tabIndex",
  "accentHeight",
  "accumulate",
  "additive",
  "alignmentBaseline",
  "allowReorder",
  "alphabetic",
  "amplitude",
  "arabicForm",
  "ascent",
  "attributeName",
  "attributeType",
  "autoReverse",
  "azimuth",
  "baseFrequency",
  "baselineShift",
  "baseProfile",
  "bbox",
  "begin",
  "bias",
  "by",
  "calcMode",
  "capHeight",
  "clip",
  "clipPath",
  "clipPathUnits",
  "clipRule",
  "colorInterpolation",
  "colorInterpolationFilters",
  "colorProfile",
  "colorRendering",
  "contentScriptType",
  "contentStyleType",
  "cursor",
  "cx",
  "cy",
  "d",
  "decelerate",
  "descent",
  "diffuseConstant",
  "direction",
  "display",
  "divisor",
  "dominantBaseline",
  "dur",
  "dx",
  "dy",
  "edgeMode",
  "elevation",
  "enableBackground",
  "end",
  "exponent",
  "externalResourcesRequired",
  "fill",
  "fillOpacity",
  "fillRule",
  "filter",
  "filterRes",
  "filterUnits",
  "floodColor",
  "floodOpacity",
  "focusable",
  "fontFamily",
  "fontSize",
  "fontSizeAdjust",
  "fontStretch",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "format",
  "from",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyphName",
  "glyphOrientationHorizontal",
  "glyphOrientationVertical",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "hanging",
  "horizAdvX",
  "horizOriginX",
  "href",
  "ideographic",
  "imageRendering",
  "in2",
  "in",
  "intercept",
  "k1",
  "k2",
  "k3",
  "k4",
  "k",
  "kernelMatrix",
  "kernelUnitLength",
  "kerning",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "letterSpacing",
  "lightingColor",
  "limitingConeAngle",
  "local",
  "markerEnd",
  "markerHeight",
  "markerMid",
  "markerStart",
  "markerUnits",
  "markerWidth",
  "mask",
  "maskContentUnits",
  "maskUnits",
  "mathematical",
  "mode",
  "numOctaves",
  "offset",
  "opacity",
  "operator",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "overlinePosition",
  "overlineThickness",
  "paintOrder",
  "panose1",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointerEvents",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "r",
  "radius",
  "refX",
  "refY",
  "renderingIntent",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "restart",
  "result",
  "rotate",
  "rx",
  "ry",
  "seed",
  "shapeRendering",
  "slope",
  "spacing",
  "specularConstant",
  "specularExponent",
  "speed",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stemh",
  "stemv",
  "stitchTiles",
  "stopColor",
  "stopOpacity",
  "strikethroughPosition",
  "strikethroughThickness",
  "string",
  "stroke",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeLinecap",
  "strokeLinejoin",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textAnchor",
  "textDecoration",
  "textLength",
  "textRendering",
  "to",
  "transform",
  "u1",
  "u2",
  "underlinePosition",
  "underlineThickness",
  "unicode",
  "unicodeBidi",
  "unicodeRange",
  "unitsPerEm",
  "vAlphabetic",
  "values",
  "vectorEffect",
  "version",
  "vertAdvY",
  "vertOriginX",
  "vertOriginY",
  "vHanging",
  "vIdeographic",
  "viewTarget",
  "visibility",
  "vMathematical",
  "widths",
  "wordSpacing",
  "writingMode",
  "x1",
  "x2",
  "x",
  "xChannelSelector",
  "xHeight",
  "xlinkActuate",
  "xlinkArcrole",
  "xlinkHref",
  "xlinkRole",
  "xlinkShow",
  "xlinkTitle",
  "xlinkType",
  "xmlBase",
  "xmlLang",
  "xmlns",
  "xmlnsXlink",
  "xmlSpace",
  "y1",
  "y2",
  "y",
  "yChannelSelector",
  "z",
  "zoomAndPan",
  "ref",
  "key",
  "angle"
], qd = ["points", "pathLength"], Za = {
  svg: cR,
  polygon: qd,
  polyline: qd
}, Db = ["dangerouslySetInnerHTML", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onPaste", "onPasteCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onChangeCapture", "onBeforeInput", "onBeforeInputCapture", "onInput", "onInputCapture", "onReset", "onResetCapture", "onSubmit", "onSubmitCapture", "onInvalid", "onInvalidCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onAbort", "onAbortCapture", "onCanPlay", "onCanPlayCapture", "onCanPlayThrough", "onCanPlayThroughCapture", "onDurationChange", "onDurationChangeCapture", "onEmptied", "onEmptiedCapture", "onEncrypted", "onEncryptedCapture", "onEnded", "onEndedCapture", "onLoadedData", "onLoadedDataCapture", "onLoadedMetadata", "onLoadedMetadataCapture", "onLoadStart", "onLoadStartCapture", "onPause", "onPauseCapture", "onPlay", "onPlayCapture", "onPlaying", "onPlayingCapture", "onProgress", "onProgressCapture", "onRateChange", "onRateChangeCapture", "onSeeked", "onSeekedCapture", "onSeeking", "onSeekingCapture", "onStalled", "onStalledCapture", "onSuspend", "onSuspendCapture", "onTimeUpdate", "onTimeUpdateCapture", "onVolumeChange", "onVolumeChangeCapture", "onWaiting", "onWaitingCapture", "onAuxClick", "onAuxClickCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onSelect", "onSelectCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onPointerDown", "onPointerDownCapture", "onPointerMove", "onPointerMoveCapture", "onPointerUp", "onPointerUpCapture", "onPointerCancel", "onPointerCancelCapture", "onPointerEnter", "onPointerEnterCapture", "onPointerLeave", "onPointerLeaveCapture", "onPointerOver", "onPointerOverCapture", "onPointerOut", "onPointerOutCapture", "onGotPointerCapture", "onGotPointerCaptureCapture", "onLostPointerCapture", "onLostPointerCaptureCapture", "onScroll", "onScrollCapture", "onWheel", "onWheelCapture", "onAnimationStart", "onAnimationStartCapture", "onAnimationEnd", "onAnimationEndCapture", "onAnimationIteration", "onAnimationIterationCapture", "onTransitionEnd", "onTransitionEndCapture"], uR = function(t, r, n) {
  return function(o) {
    return t(r, n, o), null;
  };
}, dR = function(t, r, n) {
  if (!Tb(t) || gc(t) !== "object")
    return null;
  var o = null;
  return Object.keys(t).forEach(function(a) {
    var i = t[a];
    Db.includes(a) && typeof i == "function" && (o || (o = {}), o[a] = uR(i, r, n));
  }), o;
}, fR = function(t) {
  return typeof t == "string" ? t : t ? t.displayName || t.name || "Component" : "";
}, hR = function(t, r, n, o) {
  var a, i = (a = Za == null ? void 0 : Za[o]) !== null && a !== void 0 ? a : [];
  return r.startsWith("data-") || !Rn(t) && (o && i.includes(r) || lR.includes(r)) || Db.includes(r);
}, kb = function(t, r, n) {
  if (!t || typeof t == "function" || typeof t == "boolean")
    return null;
  var o = t;
  if (/* @__PURE__ */ Dy(t) && (o = t.props), !Tb(o))
    return null;
  var a = {};
  return Object.keys(o).forEach(function(i) {
    var s;
    hR((s = o) === null || s === void 0 ? void 0 : s[i], i, r, n) && (a[i] = o[i]);
  }), a;
}, pR = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];
function vc() {
  return vc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, vc.apply(this, arguments);
}
function mR(e, t) {
  if (e == null) return {};
  var r = gR(e, t), n, o;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (o = 0; o < a.length; o++)
      n = a[o], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function gR(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function vR(e) {
  var t = e.children, r = e.width, n = e.height, o = e.viewBox, a = e.className, i = e.style, s = e.title, c = e.desc, l = mR(e, pR), u = o || {
    width: r,
    height: n,
    x: 0,
    y: 0
  }, d = dt("recharts-surface", a);
  return /* @__PURE__ */ E.createElement("svg", vc({}, kb(l, !0, "svg"), {
    className: d,
    width: r,
    height: n,
    style: i,
    viewBox: "".concat(u.x, " ").concat(u.y, " ").concat(u.width, " ").concat(u.height)
  }), /* @__PURE__ */ E.createElement("title", null, s), /* @__PURE__ */ E.createElement("desc", null, c), t);
}
var bR = process.env.NODE_ENV !== "production", wn = function(t, r) {
  for (var n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), a = 2; a < n; a++)
    o[a - 2] = arguments[a];
  if (bR && typeof console < "u" && console.warn && (r === void 0 && console.warn("LogUtils requires an error message argument"), !t))
    if (r === void 0)
      console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
    else {
      var i = 0;
      console.warn(r.replace(/%s/g, function() {
        return o[i++];
      }));
    }
}, Qa, Wd;
function yR() {
  if (Wd) return Qa;
  Wd = 1;
  function e(t, r, n) {
    var o = -1, a = t.length;
    r < 0 && (r = -r > a ? 0 : a + r), n = n > a ? a : n, n < 0 && (n += a), a = r > n ? 0 : n - r >>> 0, r >>>= 0;
    for (var i = Array(a); ++o < a; )
      i[o] = t[o + r];
    return i;
  }
  return Qa = e, Qa;
}
var Ja, Bd;
function wR() {
  if (Bd) return Ja;
  Bd = 1;
  var e = yR();
  function t(r, n, o) {
    var a = r.length;
    return o = o === void 0 ? a : o, !n && o >= a ? r : e(r, n, o);
  }
  return Ja = t, Ja;
}
var ei, Ld;
function Nb() {
  if (Ld) return ei;
  Ld = 1;
  var e = "\\ud800-\\udfff", t = "\\u0300-\\u036f", r = "\\ufe20-\\ufe2f", n = "\\u20d0-\\u20ff", o = t + r + n, a = "\\ufe0e\\ufe0f", i = "\\u200d", s = RegExp("[" + i + e + o + a + "]");
  function c(l) {
    return s.test(l);
  }
  return ei = c, ei;
}
var ti, jd;
function xR() {
  if (jd) return ti;
  jd = 1;
  function e(t) {
    return t.split("");
  }
  return ti = e, ti;
}
var ri, zd;
function _R() {
  if (zd) return ri;
  zd = 1;
  var e = "\\ud800-\\udfff", t = "\\u0300-\\u036f", r = "\\ufe20-\\ufe2f", n = "\\u20d0-\\u20ff", o = t + r + n, a = "\\ufe0e\\ufe0f", i = "[" + e + "]", s = "[" + o + "]", c = "\\ud83c[\\udffb-\\udfff]", l = "(?:" + s + "|" + c + ")", u = "[^" + e + "]", d = "(?:\\ud83c[\\udde6-\\uddff]){2}", f = "[\\ud800-\\udbff][\\udc00-\\udfff]", m = "\\u200d", b = l + "?", g = "[" + a + "]?", p = "(?:" + m + "(?:" + [u, d, f].join("|") + ")" + g + b + ")*", w = g + b + p, y = "(?:" + [u + s + "?", s, d, f, i].join("|") + ")", x = RegExp(c + "(?=" + c + ")|" + y + w, "g");
  function S(C) {
    return C.match(x) || [];
  }
  return ri = S, ri;
}
var ni, Hd;
function SR() {
  if (Hd) return ni;
  Hd = 1;
  var e = xR(), t = Nb(), r = _R();
  function n(o) {
    return t(o) ? r(o) : e(o);
  }
  return ni = n, ni;
}
var oi, Yd;
function CR() {
  if (Yd) return oi;
  Yd = 1;
  var e = wR(), t = Nb(), r = SR(), n = Ob();
  function o(a) {
    return function(i) {
      i = n(i);
      var s = t(i) ? r(i) : void 0, c = s ? s[0] : i.charAt(0), l = s ? e(s, 1).join("") : i.slice(1);
      return c[a]() + l;
    };
  }
  return oi = o, oi;
}
var ai, Gd;
function OR() {
  if (Gd) return ai;
  Gd = 1;
  var e = CR(), t = e("toUpperCase");
  return ai = t, ai;
}
var PR = OR();
const Ab = /* @__PURE__ */ nt(PR);
function pn(e) {
  return function() {
    return e;
  };
}
const Ib = Math.cos, kn = Math.sin, Ke = Math.sqrt, Nn = Math.PI, yo = 2 * Nn, bc = Math.PI, yc = 2 * bc, Nt = 1e-6, ER = yc - Nt;
function $b(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function MR(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return $b;
  const r = 10 ** t;
  return function(n) {
    this._ += n[0];
    for (let o = 1, a = n.length; o < a; ++o)
      this._ += Math.round(arguments[o] * r) / r + n[o];
  };
}
class TR {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? $b : MR(t);
  }
  moveTo(t, r) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
  }
  lineTo(t, r) {
    this._append`L${this._x1 = +t},${this._y1 = +r}`;
  }
  quadraticCurveTo(t, r, n, o) {
    this._append`Q${+t},${+r},${this._x1 = +n},${this._y1 = +o}`;
  }
  bezierCurveTo(t, r, n, o, a, i) {
    this._append`C${+t},${+r},${+n},${+o},${this._x1 = +a},${this._y1 = +i}`;
  }
  arcTo(t, r, n, o, a) {
    if (t = +t, r = +r, n = +n, o = +o, a = +a, a < 0) throw new Error(`negative radius: ${a}`);
    let i = this._x1, s = this._y1, c = n - t, l = o - r, u = i - t, d = s - r, f = u * u + d * d;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = r}`;
    else if (f > Nt) if (!(Math.abs(d * c - l * u) > Nt) || !a)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let m = n - i, b = o - s, g = c * c + l * l, p = m * m + b * b, w = Math.sqrt(g), y = Math.sqrt(f), x = a * Math.tan((bc - Math.acos((g + f - p) / (2 * w * y))) / 2), S = x / y, C = x / w;
      Math.abs(S - 1) > Nt && this._append`L${t + S * u},${r + S * d}`, this._append`A${a},${a},0,0,${+(d * m > u * b)},${this._x1 = t + C * c},${this._y1 = r + C * l}`;
    }
  }
  arc(t, r, n, o, a, i) {
    if (t = +t, r = +r, n = +n, i = !!i, n < 0) throw new Error(`negative radius: ${n}`);
    let s = n * Math.cos(o), c = n * Math.sin(o), l = t + s, u = r + c, d = 1 ^ i, f = i ? o - a : a - o;
    this._x1 === null ? this._append`M${l},${u}` : (Math.abs(this._x1 - l) > Nt || Math.abs(this._y1 - u) > Nt) && this._append`L${l},${u}`, n && (f < 0 && (f = f % yc + yc), f > ER ? this._append`A${n},${n},0,1,${d},${t - s},${r - c}A${n},${n},0,1,${d},${this._x1 = l},${this._y1 = u}` : f > Nt && this._append`A${n},${n},0,${+(f >= bc)},${d},${this._x1 = t + n * Math.cos(a)},${this._y1 = r + n * Math.sin(a)}`);
  }
  rect(t, r, n, o) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${n = +n}v${+o}h${-n}Z`;
  }
  toString() {
    return this._;
  }
}
function RR(e) {
  let t = 3;
  return e.digits = function(r) {
    if (!arguments.length) return t;
    if (r == null)
      t = null;
    else {
      const n = Math.floor(r);
      if (!(n >= 0)) throw new RangeError(`invalid digits: ${r}`);
      t = n;
    }
    return e;
  }, () => new TR(t);
}
const wl = {
  draw(e, t) {
    const r = Ke(t / Nn);
    e.moveTo(r, 0), e.arc(0, 0, r, 0, yo);
  }
}, DR = {
  draw(e, t) {
    const r = Ke(t / 5) / 2;
    e.moveTo(-3 * r, -r), e.lineTo(-r, -r), e.lineTo(-r, -3 * r), e.lineTo(r, -3 * r), e.lineTo(r, -r), e.lineTo(3 * r, -r), e.lineTo(3 * r, r), e.lineTo(r, r), e.lineTo(r, 3 * r), e.lineTo(-r, 3 * r), e.lineTo(-r, r), e.lineTo(-3 * r, r), e.closePath();
  }
}, Fb = Ke(1 / 3), kR = Fb * 2, NR = {
  draw(e, t) {
    const r = Ke(t / kR), n = r * Fb;
    e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath();
  }
}, AR = {
  draw(e, t) {
    const r = Ke(t), n = -r / 2;
    e.rect(n, n, r, r);
  }
}, IR = 0.8908130915292852, qb = kn(Nn / 10) / kn(7 * Nn / 10), $R = kn(yo / 10) * qb, FR = -Ib(yo / 10) * qb, qR = {
  draw(e, t) {
    const r = Ke(t * IR), n = $R * r, o = FR * r;
    e.moveTo(0, -r), e.lineTo(n, o);
    for (let a = 1; a < 5; ++a) {
      const i = yo * a / 5, s = Ib(i), c = kn(i);
      e.lineTo(c * r, -s * r), e.lineTo(s * n - c * o, c * n + s * o);
    }
    e.closePath();
  }
}, ii = Ke(3), WR = {
  draw(e, t) {
    const r = -Ke(t / (ii * 3));
    e.moveTo(0, r * 2), e.lineTo(-ii * r, -r), e.lineTo(ii * r, -r), e.closePath();
  }
}, Ae = -0.5, Ie = Ke(3) / 2, wc = 1 / Ke(12), BR = (wc / 2 + 1) * 3, LR = {
  draw(e, t) {
    const r = Ke(t / BR), n = r / 2, o = r * wc, a = n, i = r * wc + r, s = -a, c = i;
    e.moveTo(n, o), e.lineTo(a, i), e.lineTo(s, c), e.lineTo(Ae * n - Ie * o, Ie * n + Ae * o), e.lineTo(Ae * a - Ie * i, Ie * a + Ae * i), e.lineTo(Ae * s - Ie * c, Ie * s + Ae * c), e.lineTo(Ae * n + Ie * o, Ae * o - Ie * n), e.lineTo(Ae * a + Ie * i, Ae * i - Ie * a), e.lineTo(Ae * s + Ie * c, Ae * c - Ie * s), e.closePath();
  }
};
function jR(e, t) {
  let r = null, n = RR(o);
  e = typeof e == "function" ? e : pn(e || wl), t = typeof t == "function" ? t : pn(t === void 0 ? 64 : +t);
  function o() {
    let a;
    if (r || (r = a = n()), e.apply(this, arguments).draw(r, +t.apply(this, arguments)), a) return r = null, a + "" || null;
  }
  return o.type = function(a) {
    return arguments.length ? (e = typeof a == "function" ? a : pn(a), o) : e;
  }, o.size = function(a) {
    return arguments.length ? (t = typeof a == "function" ? a : pn(+a), o) : t;
  }, o.context = function(a) {
    return arguments.length ? (r = a ?? null, o) : r;
  }, o;
}
function Ar(e) {
  "@babel/helpers - typeof";
  return Ar = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ar(e);
}
var zR = ["type", "size", "sizeType"];
function xc() {
  return xc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, xc.apply(this, arguments);
}
function Ud(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Vd(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ud(Object(r), !0).forEach(function(n) {
      HR(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ud(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function HR(e, t, r) {
  return t = YR(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function YR(e) {
  var t = GR(e, "string");
  return Ar(t) == "symbol" ? t : t + "";
}
function GR(e, t) {
  if (Ar(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ar(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function UR(e, t) {
  if (e == null) return {};
  var r = VR(e, t), n, o;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (o = 0; o < a.length; o++)
      n = a[o], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function VR(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var Wb = {
  symbolCircle: wl,
  symbolCross: DR,
  symbolDiamond: NR,
  symbolSquare: AR,
  symbolStar: qR,
  symbolTriangle: WR,
  symbolWye: LR
}, KR = Math.PI / 180, XR = function(t) {
  var r = "symbol".concat(Ab(t));
  return Wb[r] || wl;
}, ZR = function(t, r, n) {
  if (r === "area")
    return t;
  switch (n) {
    case "cross":
      return 5 * t * t / 9;
    case "diamond":
      return 0.5 * t * t / Math.sqrt(3);
    case "square":
      return t * t;
    case "star": {
      var o = 18 * KR;
      return 1.25 * t * t * (Math.tan(o) - Math.tan(o * 2) * Math.pow(Math.tan(o), 2));
    }
    case "triangle":
      return Math.sqrt(3) * t * t / 4;
    case "wye":
      return (21 - 10 * Math.sqrt(3)) * t * t / 8;
    default:
      return Math.PI * t * t / 4;
  }
}, QR = function(t, r) {
  Wb["symbol".concat(Ab(t))] = r;
}, Bb = function(t) {
  var r = t.type, n = r === void 0 ? "circle" : r, o = t.size, a = o === void 0 ? 64 : o, i = t.sizeType, s = i === void 0 ? "area" : i, c = UR(t, zR), l = Vd(Vd({}, c), {}, {
    type: n,
    size: a,
    sizeType: s
  }), u = function() {
    var p = XR(n), w = jR().type(p).size(ZR(a, s, n));
    return w();
  }, d = l.className, f = l.cx, m = l.cy, b = kb(l, !0);
  return f === +f && m === +m && a === +a ? /* @__PURE__ */ E.createElement("path", xc({}, b, {
    className: dt("recharts-symbols", d),
    transform: "translate(".concat(f, ", ").concat(m, ")"),
    d: u()
  })) : null;
};
Bb.registerSymbol = QR;
function ar(e) {
  "@babel/helpers - typeof";
  return ar = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ar(e);
}
function _c() {
  return _c = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, _c.apply(this, arguments);
}
function Kd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function JR(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Kd(Object(r), !0).forEach(function(n) {
      Ir(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Kd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function e1(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function t1(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, jb(n.key), n);
  }
}
function r1(e, t, r) {
  return t && t1(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function n1(e, t, r) {
  return t = An(t), o1(e, Lb() ? Reflect.construct(t, r || [], An(e).constructor) : t.apply(e, r));
}
function o1(e, t) {
  if (t && (ar(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return a1(e);
}
function a1(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Lb() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (Lb = function() {
    return !!e;
  })();
}
function An(e) {
  return An = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, An(e);
}
function i1(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Sc(e, t);
}
function Sc(e, t) {
  return Sc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, Sc(e, t);
}
function Ir(e, t, r) {
  return t = jb(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function jb(e) {
  var t = s1(e, "string");
  return ar(t) == "symbol" ? t : t + "";
}
function s1(e, t) {
  if (ar(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ar(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var $e = 32, xl = /* @__PURE__ */ (function(e) {
  function t() {
    return e1(this, t), n1(this, t, arguments);
  }
  return i1(t, e), r1(t, [{
    key: "renderIcon",
    value: (
      /**
       * Render the path of icon
       * @param {Object} data Data of each legend item
       * @return {String} Path element
       */
      function(n) {
        var o = this.props.inactiveColor, a = $e / 2, i = $e / 6, s = $e / 3, c = n.inactive ? o : n.color;
        if (n.type === "plainline")
          return /* @__PURE__ */ E.createElement("line", {
            strokeWidth: 4,
            fill: "none",
            stroke: c,
            strokeDasharray: n.payload.strokeDasharray,
            x1: 0,
            y1: a,
            x2: $e,
            y2: a,
            className: "recharts-legend-icon"
          });
        if (n.type === "line")
          return /* @__PURE__ */ E.createElement("path", {
            strokeWidth: 4,
            fill: "none",
            stroke: c,
            d: "M0,".concat(a, "h").concat(s, `
            A`).concat(i, ",").concat(i, ",0,1,1,").concat(2 * s, ",").concat(a, `
            H`).concat($e, "M").concat(2 * s, ",").concat(a, `
            A`).concat(i, ",").concat(i, ",0,1,1,").concat(s, ",").concat(a),
            className: "recharts-legend-icon"
          });
        if (n.type === "rect")
          return /* @__PURE__ */ E.createElement("path", {
            stroke: "none",
            fill: c,
            d: "M0,".concat($e / 8, "h").concat($e, "v").concat($e * 3 / 4, "h").concat(-$e, "z"),
            className: "recharts-legend-icon"
          });
        if (/* @__PURE__ */ E.isValidElement(n.legendIcon)) {
          var l = JR({}, n);
          return delete l.legendIcon, /* @__PURE__ */ E.cloneElement(n.legendIcon, l);
        }
        return /* @__PURE__ */ E.createElement(Bb, {
          fill: c,
          cx: a,
          cy: a,
          size: $e,
          sizeType: "diameter",
          type: n.type
        });
      }
    )
    /**
     * Draw items of legend
     * @return {ReactElement} Items
     */
  }, {
    key: "renderItems",
    value: function() {
      var n = this, o = this.props, a = o.payload, i = o.iconSize, s = o.layout, c = o.formatter, l = o.inactiveColor, u = {
        x: 0,
        y: 0,
        width: $e,
        height: $e
      }, d = {
        display: s === "horizontal" ? "inline-block" : "block",
        marginRight: 10
      }, f = {
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: 4
      };
      return a.map(function(m, b) {
        var g = m.formatter || c, p = dt(Ir(Ir({
          "recharts-legend-item": !0
        }, "legend-item-".concat(b), !0), "inactive", m.inactive));
        if (m.type === "none")
          return null;
        var w = Rn(m.value) ? null : m.value;
        wn(
          !Rn(m.value),
          `The name property is also required when using a function for the dataKey of a chart's cartesian components. Ex: <Bar name="Name of my Data"/>`
          // eslint-disable-line max-len
        );
        var y = m.inactive ? l : m.color;
        return /* @__PURE__ */ E.createElement("li", _c({
          className: p,
          style: d,
          key: "legend-item-".concat(b)
        }, dR(n.props, m, b)), /* @__PURE__ */ E.createElement(vR, {
          width: i,
          height: i,
          viewBox: u,
          style: f
        }, n.renderIcon(m)), /* @__PURE__ */ E.createElement("span", {
          className: "recharts-legend-item-text",
          style: {
            color: y
          }
        }, g ? g(w, m, b) : w));
      });
    }
  }, {
    key: "render",
    value: function() {
      var n = this.props, o = n.payload, a = n.layout, i = n.align;
      if (!o || !o.length)
        return null;
      var s = {
        padding: 0,
        margin: 0,
        textAlign: a === "horizontal" ? i : "left"
      };
      return /* @__PURE__ */ E.createElement("ul", {
        className: "recharts-default-legend",
        style: s
      }, this.renderItems());
    }
  }]);
})(qn);
Ir(xl, "displayName", "Legend");
Ir(xl, "defaultProps", {
  iconSize: 14,
  layout: "horizontal",
  align: "center",
  verticalAlign: "middle",
  inactiveColor: "#ccc"
});
var si, Xd;
function c1() {
  if (Xd) return si;
  Xd = 1;
  var e = go();
  function t() {
    this.__data__ = new e(), this.size = 0;
  }
  return si = t, si;
}
var ci, Zd;
function l1() {
  if (Zd) return ci;
  Zd = 1;
  function e(t) {
    var r = this.__data__, n = r.delete(t);
    return this.size = r.size, n;
  }
  return ci = e, ci;
}
var li, Qd;
function u1() {
  if (Qd) return li;
  Qd = 1;
  function e(t) {
    return this.__data__.get(t);
  }
  return li = e, li;
}
var ui, Jd;
function d1() {
  if (Jd) return ui;
  Jd = 1;
  function e(t) {
    return this.__data__.has(t);
  }
  return ui = e, ui;
}
var di, ef;
function f1() {
  if (ef) return di;
  ef = 1;
  var e = go(), t = vl(), r = bl(), n = 200;
  function o(a, i) {
    var s = this.__data__;
    if (s instanceof e) {
      var c = s.__data__;
      if (!t || c.length < n - 1)
        return c.push([a, i]), this.size = ++s.size, this;
      s = this.__data__ = new r(c);
    }
    return s.set(a, i), this.size = s.size, this;
  }
  return di = o, di;
}
var fi, tf;
function zb() {
  if (tf) return fi;
  tf = 1;
  var e = go(), t = c1(), r = l1(), n = u1(), o = d1(), a = f1();
  function i(s) {
    var c = this.__data__ = new e(s);
    this.size = c.size;
  }
  return i.prototype.clear = t, i.prototype.delete = r, i.prototype.get = n, i.prototype.has = o, i.prototype.set = a, fi = i, fi;
}
var hi, rf;
function h1() {
  if (rf) return hi;
  rf = 1;
  var e = "__lodash_hash_undefined__";
  function t(r) {
    return this.__data__.set(r, e), this;
  }
  return hi = t, hi;
}
var pi, nf;
function p1() {
  if (nf) return pi;
  nf = 1;
  function e(t) {
    return this.__data__.has(t);
  }
  return pi = e, pi;
}
var mi, of;
function Hb() {
  if (of) return mi;
  of = 1;
  var e = bl(), t = h1(), r = p1();
  function n(o) {
    var a = -1, i = o == null ? 0 : o.length;
    for (this.__data__ = new e(); ++a < i; )
      this.add(o[a]);
  }
  return n.prototype.add = n.prototype.push = t, n.prototype.has = r, mi = n, mi;
}
var gi, af;
function m1() {
  if (af) return gi;
  af = 1;
  function e(t, r) {
    for (var n = -1, o = t == null ? 0 : t.length; ++n < o; )
      if (r(t[n], n, t))
        return !0;
    return !1;
  }
  return gi = e, gi;
}
var vi, sf;
function Yb() {
  if (sf) return vi;
  sf = 1;
  function e(t, r) {
    return t.has(r);
  }
  return vi = e, vi;
}
var bi, cf;
function Gb() {
  if (cf) return bi;
  cf = 1;
  var e = Hb(), t = m1(), r = Yb(), n = 1, o = 2;
  function a(i, s, c, l, u, d) {
    var f = c & n, m = i.length, b = s.length;
    if (m != b && !(f && b > m))
      return !1;
    var g = d.get(i), p = d.get(s);
    if (g && p)
      return g == s && p == i;
    var w = -1, y = !0, x = c & o ? new e() : void 0;
    for (d.set(i, s), d.set(s, i); ++w < m; ) {
      var S = i[w], C = s[w];
      if (l)
        var _ = f ? l(C, S, w, s, i, d) : l(S, C, w, i, s, d);
      if (_ !== void 0) {
        if (_)
          continue;
        y = !1;
        break;
      }
      if (x) {
        if (!t(s, function(O, P) {
          if (!r(x, P) && (S === O || u(S, O, c, l, d)))
            return x.push(P);
        })) {
          y = !1;
          break;
        }
      } else if (!(S === C || u(S, C, c, l, d))) {
        y = !1;
        break;
      }
    }
    return d.delete(i), d.delete(s), y;
  }
  return bi = a, bi;
}
var yi, lf;
function g1() {
  if (lf) return yi;
  lf = 1;
  var e = it(), t = e.Uint8Array;
  return yi = t, yi;
}
var wi, uf;
function v1() {
  if (uf) return wi;
  uf = 1;
  function e(t) {
    var r = -1, n = Array(t.size);
    return t.forEach(function(o, a) {
      n[++r] = [a, o];
    }), n;
  }
  return wi = e, wi;
}
var xi, df;
function _l() {
  if (df) return xi;
  df = 1;
  function e(t) {
    var r = -1, n = Array(t.size);
    return t.forEach(function(o) {
      n[++r] = o;
    }), n;
  }
  return xi = e, xi;
}
var _i, ff;
function b1() {
  if (ff) return _i;
  ff = 1;
  var e = Jr(), t = g1(), r = gl(), n = Gb(), o = v1(), a = _l(), i = 1, s = 2, c = "[object Boolean]", l = "[object Date]", u = "[object Error]", d = "[object Map]", f = "[object Number]", m = "[object RegExp]", b = "[object Set]", g = "[object String]", p = "[object Symbol]", w = "[object ArrayBuffer]", y = "[object DataView]", x = e ? e.prototype : void 0, S = x ? x.valueOf : void 0;
  function C(_, O, P, R, A, D, B) {
    switch (P) {
      case y:
        if (_.byteLength != O.byteLength || _.byteOffset != O.byteOffset)
          return !1;
        _ = _.buffer, O = O.buffer;
      case w:
        return !(_.byteLength != O.byteLength || !D(new t(_), new t(O)));
      case c:
      case l:
      case f:
        return r(+_, +O);
      case u:
        return _.name == O.name && _.message == O.message;
      case m:
      case g:
        return _ == O + "";
      case d:
        var k = o;
      case b:
        var $ = R & i;
        if (k || (k = a), _.size != O.size && !$)
          return !1;
        var F = B.get(_);
        if (F)
          return F == O;
        R |= s, B.set(_, O);
        var I = n(k(_), k(O), R, A, D, B);
        return B.delete(_), I;
      case p:
        if (S)
          return S.call(_) == S.call(O);
    }
    return !1;
  }
  return _i = C, _i;
}
var Si, hf;
function Ub() {
  if (hf) return Si;
  hf = 1;
  function e(t, r) {
    for (var n = -1, o = r.length, a = t.length; ++n < o; )
      t[a + n] = r[n];
    return t;
  }
  return Si = e, Si;
}
var Ci, pf;
function y1() {
  if (pf) return Ci;
  pf = 1;
  var e = Ub(), t = Ve();
  function r(n, o, a) {
    var i = o(n);
    return t(n) ? i : e(i, a(n));
  }
  return Ci = r, Ci;
}
var Oi, mf;
function w1() {
  if (mf) return Oi;
  mf = 1;
  function e(t, r) {
    for (var n = -1, o = t == null ? 0 : t.length, a = 0, i = []; ++n < o; ) {
      var s = t[n];
      r(s, n, t) && (i[a++] = s);
    }
    return i;
  }
  return Oi = e, Oi;
}
var Pi, gf;
function x1() {
  if (gf) return Pi;
  gf = 1;
  function e() {
    return [];
  }
  return Pi = e, Pi;
}
var Ei, vf;
function _1() {
  if (vf) return Ei;
  vf = 1;
  var e = w1(), t = x1(), r = Object.prototype, n = r.propertyIsEnumerable, o = Object.getOwnPropertySymbols, a = o ? function(i) {
    return i == null ? [] : (i = Object(i), e(o(i), function(s) {
      return n.call(i, s);
    }));
  } : t;
  return Ei = a, Ei;
}
var Mi, bf;
function S1() {
  if (bf) return Mi;
  bf = 1;
  function e(t, r) {
    for (var n = -1, o = Array(t); ++n < t; )
      o[n] = r(n);
    return o;
  }
  return Mi = e, Mi;
}
var Ti, yf;
function C1() {
  if (yf) return Ti;
  yf = 1;
  var e = jt(), t = zt(), r = "[object Arguments]";
  function n(o) {
    return t(o) && e(o) == r;
  }
  return Ti = n, Ti;
}
var Ri, wf;
function Sl() {
  if (wf) return Ri;
  wf = 1;
  var e = C1(), t = zt(), r = Object.prototype, n = r.hasOwnProperty, o = r.propertyIsEnumerable, a = e(/* @__PURE__ */ (function() {
    return arguments;
  })()) ? e : function(i) {
    return t(i) && n.call(i, "callee") && !o.call(i, "callee");
  };
  return Ri = a, Ri;
}
var Cr = { exports: {} }, Di, xf;
function O1() {
  if (xf) return Di;
  xf = 1;
  function e() {
    return !1;
  }
  return Di = e, Di;
}
Cr.exports;
var _f;
function Vb() {
  return _f || (_f = 1, (function(e, t) {
    var r = it(), n = O1(), o = t && !t.nodeType && t, a = o && !0 && e && !e.nodeType && e, i = a && a.exports === o, s = i ? r.Buffer : void 0, c = s ? s.isBuffer : void 0, l = c || n;
    e.exports = l;
  })(Cr, Cr.exports)), Cr.exports;
}
var ki, Sf;
function Cl() {
  if (Sf) return ki;
  Sf = 1;
  var e = 9007199254740991, t = /^(?:0|[1-9]\d*)$/;
  function r(n, o) {
    var a = typeof n;
    return o = o ?? e, !!o && (a == "number" || a != "symbol" && t.test(n)) && n > -1 && n % 1 == 0 && n < o;
  }
  return ki = r, ki;
}
var Ni, Cf;
function Ol() {
  if (Cf) return Ni;
  Cf = 1;
  var e = 9007199254740991;
  function t(r) {
    return typeof r == "number" && r > -1 && r % 1 == 0 && r <= e;
  }
  return Ni = t, Ni;
}
var Ai, Of;
function P1() {
  if (Of) return Ai;
  Of = 1;
  var e = jt(), t = Ol(), r = zt(), n = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", i = "[object Date]", s = "[object Error]", c = "[object Function]", l = "[object Map]", u = "[object Number]", d = "[object Object]", f = "[object RegExp]", m = "[object Set]", b = "[object String]", g = "[object WeakMap]", p = "[object ArrayBuffer]", w = "[object DataView]", y = "[object Float32Array]", x = "[object Float64Array]", S = "[object Int8Array]", C = "[object Int16Array]", _ = "[object Int32Array]", O = "[object Uint8Array]", P = "[object Uint8ClampedArray]", R = "[object Uint16Array]", A = "[object Uint32Array]", D = {};
  D[y] = D[x] = D[S] = D[C] = D[_] = D[O] = D[P] = D[R] = D[A] = !0, D[n] = D[o] = D[p] = D[a] = D[w] = D[i] = D[s] = D[c] = D[l] = D[u] = D[d] = D[f] = D[m] = D[b] = D[g] = !1;
  function B(k) {
    return r(k) && t(k.length) && !!D[e(k)];
  }
  return Ai = B, Ai;
}
var Ii, Pf;
function Kb() {
  if (Pf) return Ii;
  Pf = 1;
  function e(t) {
    return function(r) {
      return t(r);
    };
  }
  return Ii = e, Ii;
}
var Or = { exports: {} };
Or.exports;
var Ef;
function E1() {
  return Ef || (Ef = 1, (function(e, t) {
    var r = _b(), n = t && !t.nodeType && t, o = n && !0 && e && !e.nodeType && e, a = o && o.exports === n, i = a && r.process, s = (function() {
      try {
        var c = o && o.require && o.require("util").types;
        return c || i && i.binding && i.binding("util");
      } catch {
      }
    })();
    e.exports = s;
  })(Or, Or.exports)), Or.exports;
}
var $i, Mf;
function Xb() {
  if (Mf) return $i;
  Mf = 1;
  var e = P1(), t = Kb(), r = E1(), n = r && r.isTypedArray, o = n ? t(n) : e;
  return $i = o, $i;
}
var Fi, Tf;
function M1() {
  if (Tf) return Fi;
  Tf = 1;
  var e = S1(), t = Sl(), r = Ve(), n = Vb(), o = Cl(), a = Xb(), i = Object.prototype, s = i.hasOwnProperty;
  function c(l, u) {
    var d = r(l), f = !d && t(l), m = !d && !f && n(l), b = !d && !f && !m && a(l), g = d || f || m || b, p = g ? e(l.length, String) : [], w = p.length;
    for (var y in l)
      (u || s.call(l, y)) && !(g && // Safari 9 has enumerable `arguments.length` in strict mode.
      (y == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      m && (y == "offset" || y == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      b && (y == "buffer" || y == "byteLength" || y == "byteOffset") || // Skip index properties.
      o(y, w))) && p.push(y);
    return p;
  }
  return Fi = c, Fi;
}
var qi, Rf;
function T1() {
  if (Rf) return qi;
  Rf = 1;
  var e = Object.prototype;
  function t(r) {
    var n = r && r.constructor, o = typeof n == "function" && n.prototype || e;
    return r === o;
  }
  return qi = t, qi;
}
var Wi, Df;
function R1() {
  if (Df) return Wi;
  Df = 1;
  function e(t, r) {
    return function(n) {
      return t(r(n));
    };
  }
  return Wi = e, Wi;
}
var Bi, kf;
function D1() {
  if (kf) return Bi;
  kf = 1;
  var e = R1(), t = e(Object.keys, Object);
  return Bi = t, Bi;
}
var Li, Nf;
function k1() {
  if (Nf) return Li;
  Nf = 1;
  var e = T1(), t = D1(), r = Object.prototype, n = r.hasOwnProperty;
  function o(a) {
    if (!e(a))
      return t(a);
    var i = [];
    for (var s in Object(a))
      n.call(a, s) && s != "constructor" && i.push(s);
    return i;
  }
  return Li = o, Li;
}
var ji, Af;
function wo() {
  if (Af) return ji;
  Af = 1;
  var e = ml(), t = Ol();
  function r(n) {
    return n != null && t(n.length) && !e(n);
  }
  return ji = r, ji;
}
var zi, If;
function Pl() {
  if (If) return zi;
  If = 1;
  var e = M1(), t = k1(), r = wo();
  function n(o) {
    return r(o) ? e(o) : t(o);
  }
  return zi = n, zi;
}
var Hi, $f;
function N1() {
  if ($f) return Hi;
  $f = 1;
  var e = y1(), t = _1(), r = Pl();
  function n(o) {
    return e(o, r, t);
  }
  return Hi = n, Hi;
}
var Yi, Ff;
function A1() {
  if (Ff) return Yi;
  Ff = 1;
  var e = N1(), t = 1, r = Object.prototype, n = r.hasOwnProperty;
  function o(a, i, s, c, l, u) {
    var d = s & t, f = e(a), m = f.length, b = e(i), g = b.length;
    if (m != g && !d)
      return !1;
    for (var p = m; p--; ) {
      var w = f[p];
      if (!(d ? w in i : n.call(i, w)))
        return !1;
    }
    var y = u.get(a), x = u.get(i);
    if (y && x)
      return y == i && x == a;
    var S = !0;
    u.set(a, i), u.set(i, a);
    for (var C = d; ++p < m; ) {
      w = f[p];
      var _ = a[w], O = i[w];
      if (c)
        var P = d ? c(O, _, w, i, a, u) : c(_, O, w, a, i, u);
      if (!(P === void 0 ? _ === O || l(_, O, s, c, u) : P)) {
        S = !1;
        break;
      }
      C || (C = w == "constructor");
    }
    if (S && !C) {
      var R = a.constructor, A = i.constructor;
      R != A && "constructor" in a && "constructor" in i && !(typeof R == "function" && R instanceof R && typeof A == "function" && A instanceof A) && (S = !1);
    }
    return u.delete(a), u.delete(i), S;
  }
  return Yi = o, Yi;
}
var Gi, qf;
function I1() {
  if (qf) return Gi;
  qf = 1;
  var e = Ht(), t = it(), r = e(t, "DataView");
  return Gi = r, Gi;
}
var Ui, Wf;
function $1() {
  if (Wf) return Ui;
  Wf = 1;
  var e = Ht(), t = it(), r = e(t, "Promise");
  return Ui = r, Ui;
}
var Vi, Bf;
function Zb() {
  if (Bf) return Vi;
  Bf = 1;
  var e = Ht(), t = it(), r = e(t, "Set");
  return Vi = r, Vi;
}
var Ki, Lf;
function F1() {
  if (Lf) return Ki;
  Lf = 1;
  var e = Ht(), t = it(), r = e(t, "WeakMap");
  return Ki = r, Ki;
}
var Xi, jf;
function q1() {
  if (jf) return Xi;
  jf = 1;
  var e = I1(), t = vl(), r = $1(), n = Zb(), o = F1(), a = jt(), i = Sb(), s = "[object Map]", c = "[object Object]", l = "[object Promise]", u = "[object Set]", d = "[object WeakMap]", f = "[object DataView]", m = i(e), b = i(t), g = i(r), p = i(n), w = i(o), y = a;
  return (e && y(new e(new ArrayBuffer(1))) != f || t && y(new t()) != s || r && y(r.resolve()) != l || n && y(new n()) != u || o && y(new o()) != d) && (y = function(x) {
    var S = a(x), C = S == c ? x.constructor : void 0, _ = C ? i(C) : "";
    if (_)
      switch (_) {
        case m:
          return f;
        case b:
          return s;
        case g:
          return l;
        case p:
          return u;
        case w:
          return d;
      }
    return S;
  }), Xi = y, Xi;
}
var Zi, zf;
function W1() {
  if (zf) return Zi;
  zf = 1;
  var e = zb(), t = Gb(), r = b1(), n = A1(), o = q1(), a = Ve(), i = Vb(), s = Xb(), c = 1, l = "[object Arguments]", u = "[object Array]", d = "[object Object]", f = Object.prototype, m = f.hasOwnProperty;
  function b(g, p, w, y, x, S) {
    var C = a(g), _ = a(p), O = C ? u : o(g), P = _ ? u : o(p);
    O = O == l ? d : O, P = P == l ? d : P;
    var R = O == d, A = P == d, D = O == P;
    if (D && i(g)) {
      if (!i(p))
        return !1;
      C = !0, R = !1;
    }
    if (D && !R)
      return S || (S = new e()), C || s(g) ? t(g, p, w, y, x, S) : r(g, p, O, w, y, x, S);
    if (!(w & c)) {
      var B = R && m.call(g, "__wrapped__"), k = A && m.call(p, "__wrapped__");
      if (B || k) {
        var $ = B ? g.value() : g, F = k ? p.value() : p;
        return S || (S = new e()), x($, F, w, y, S);
      }
    }
    return D ? (S || (S = new e()), n(g, p, w, y, x, S)) : !1;
  }
  return Zi = b, Zi;
}
var Qi, Hf;
function Qb() {
  if (Hf) return Qi;
  Hf = 1;
  var e = W1(), t = zt();
  function r(n, o, a, i, s) {
    return n === o ? !0 : n == null || o == null || !t(n) && !t(o) ? n !== n && o !== o : e(n, o, a, i, r, s);
  }
  return Qi = r, Qi;
}
var Ji, Yf;
function B1() {
  if (Yf) return Ji;
  Yf = 1;
  var e = zb(), t = Qb(), r = 1, n = 2;
  function o(a, i, s, c) {
    var l = s.length, u = l, d = !c;
    if (a == null)
      return !u;
    for (a = Object(a); l--; ) {
      var f = s[l];
      if (d && f[2] ? f[1] !== a[f[0]] : !(f[0] in a))
        return !1;
    }
    for (; ++l < u; ) {
      f = s[l];
      var m = f[0], b = a[m], g = f[1];
      if (d && f[2]) {
        if (b === void 0 && !(m in a))
          return !1;
      } else {
        var p = new e();
        if (c)
          var w = c(b, g, m, a, i, p);
        if (!(w === void 0 ? t(g, b, r | n, c, p) : w))
          return !1;
      }
    }
    return !0;
  }
  return Ji = o, Ji;
}
var es, Gf;
function Jb() {
  if (Gf) return es;
  Gf = 1;
  var e = Tt();
  function t(r) {
    return r === r && !e(r);
  }
  return es = t, es;
}
var ts, Uf;
function L1() {
  if (Uf) return ts;
  Uf = 1;
  var e = Jb(), t = Pl();
  function r(n) {
    for (var o = t(n), a = o.length; a--; ) {
      var i = o[a], s = n[i];
      o[a] = [i, s, e(s)];
    }
    return o;
  }
  return ts = r, ts;
}
var rs, Vf;
function ey() {
  if (Vf) return rs;
  Vf = 1;
  function e(t, r) {
    return function(n) {
      return n == null ? !1 : n[t] === r && (r !== void 0 || t in Object(n));
    };
  }
  return rs = e, rs;
}
var ns, Kf;
function j1() {
  if (Kf) return ns;
  Kf = 1;
  var e = B1(), t = L1(), r = ey();
  function n(o) {
    var a = t(o);
    return a.length == 1 && a[0][2] ? r(a[0][0], a[0][1]) : function(i) {
      return i === o || e(i, o, a);
    };
  }
  return ns = n, ns;
}
var os, Xf;
function z1() {
  if (Xf) return os;
  Xf = 1;
  function e(t, r) {
    return t != null && r in Object(t);
  }
  return os = e, os;
}
var as, Zf;
function H1() {
  if (Zf) return as;
  Zf = 1;
  var e = Pb(), t = Sl(), r = Ve(), n = Cl(), o = Ol(), a = bo();
  function i(s, c, l) {
    c = e(c, s);
    for (var u = -1, d = c.length, f = !1; ++u < d; ) {
      var m = a(c[u]);
      if (!(f = s != null && l(s, m)))
        break;
      s = s[m];
    }
    return f || ++u != d ? f : (d = s == null ? 0 : s.length, !!d && o(d) && n(m, d) && (r(s) || t(s)));
  }
  return as = i, as;
}
var is, Qf;
function Y1() {
  if (Qf) return is;
  Qf = 1;
  var e = z1(), t = H1();
  function r(n, o) {
    return n != null && t(n, o, e);
  }
  return is = r, is;
}
var ss, Jf;
function G1() {
  if (Jf) return ss;
  Jf = 1;
  var e = Qb(), t = Eb(), r = Y1(), n = pl(), o = Jb(), a = ey(), i = bo(), s = 1, c = 2;
  function l(u, d) {
    return n(u) && o(d) ? a(i(u), d) : function(f) {
      var m = t(f, u);
      return m === void 0 && m === d ? r(f, u) : e(d, m, s | c);
    };
  }
  return ss = l, ss;
}
var cs, eh;
function xo() {
  if (eh) return cs;
  eh = 1;
  function e(t) {
    return t;
  }
  return cs = e, cs;
}
var ls, th;
function U1() {
  if (th) return ls;
  th = 1;
  function e(t) {
    return function(r) {
      return r == null ? void 0 : r[t];
    };
  }
  return ls = e, ls;
}
var us, rh;
function V1() {
  if (rh) return us;
  rh = 1;
  var e = yl();
  function t(r) {
    return function(n) {
      return e(n, r);
    };
  }
  return us = t, us;
}
var ds, nh;
function K1() {
  if (nh) return ds;
  nh = 1;
  var e = U1(), t = V1(), r = pl(), n = bo();
  function o(a) {
    return r(a) ? e(n(a)) : t(a);
  }
  return ds = o, ds;
}
var fs, oh;
function ty() {
  if (oh) return fs;
  oh = 1;
  var e = j1(), t = G1(), r = xo(), n = Ve(), o = K1();
  function a(i) {
    return typeof i == "function" ? i : i == null ? r : typeof i == "object" ? n(i) ? t(i[0], i[1]) : e(i) : o(i);
  }
  return fs = a, fs;
}
var hs, ah;
function X1() {
  if (ah) return hs;
  ah = 1;
  function e(t, r, n, o) {
    for (var a = t.length, i = n + (o ? 1 : -1); o ? i-- : ++i < a; )
      if (r(t[i], i, t))
        return i;
    return -1;
  }
  return hs = e, hs;
}
var ps, ih;
function Z1() {
  if (ih) return ps;
  ih = 1;
  function e(t) {
    return t !== t;
  }
  return ps = e, ps;
}
var ms, sh;
function Q1() {
  if (sh) return ms;
  sh = 1;
  function e(t, r, n) {
    for (var o = n - 1, a = t.length; ++o < a; )
      if (t[o] === r)
        return o;
    return -1;
  }
  return ms = e, ms;
}
var gs, ch;
function J1() {
  if (ch) return gs;
  ch = 1;
  var e = X1(), t = Z1(), r = Q1();
  function n(o, a, i) {
    return a === a ? r(o, a, i) : e(o, t, i);
  }
  return gs = n, gs;
}
var vs, lh;
function eD() {
  if (lh) return vs;
  lh = 1;
  var e = J1();
  function t(r, n) {
    var o = r == null ? 0 : r.length;
    return !!o && e(r, n, 0) > -1;
  }
  return vs = t, vs;
}
var bs, uh;
function tD() {
  if (uh) return bs;
  uh = 1;
  function e(t, r, n) {
    for (var o = -1, a = t == null ? 0 : t.length; ++o < a; )
      if (n(r, t[o]))
        return !0;
    return !1;
  }
  return bs = e, bs;
}
var ys, dh;
function rD() {
  if (dh) return ys;
  dh = 1;
  function e() {
  }
  return ys = e, ys;
}
var ws, fh;
function nD() {
  if (fh) return ws;
  fh = 1;
  var e = Zb(), t = rD(), r = _l(), n = 1 / 0, o = e && 1 / r(new e([, -0]))[1] == n ? function(a) {
    return new e(a);
  } : t;
  return ws = o, ws;
}
var xs, hh;
function oD() {
  if (hh) return xs;
  hh = 1;
  var e = Hb(), t = eD(), r = tD(), n = Yb(), o = nD(), a = _l(), i = 200;
  function s(c, l, u) {
    var d = -1, f = t, m = c.length, b = !0, g = [], p = g;
    if (u)
      b = !1, f = r;
    else if (m >= i) {
      var w = l ? null : o(c);
      if (w)
        return a(w);
      b = !1, f = n, p = new e();
    } else
      p = l ? [] : g;
    e:
      for (; ++d < m; ) {
        var y = c[d], x = l ? l(y) : y;
        if (y = u || y !== 0 ? y : 0, b && x === x) {
          for (var S = p.length; S--; )
            if (p[S] === x)
              continue e;
          l && p.push(x), g.push(y);
        } else f(p, x, u) || (p !== g && p.push(x), g.push(y));
      }
    return g;
  }
  return xs = s, xs;
}
var _s, ph;
function aD() {
  if (ph) return _s;
  ph = 1;
  var e = ty(), t = oD();
  function r(n, o) {
    return n && n.length ? t(n, e(o, 2)) : [];
  }
  return _s = r, _s;
}
var iD = aD();
const mh = /* @__PURE__ */ nt(iD);
function ry(e, t, r) {
  return t === !0 ? mh(e, r) : Rn(t) ? mh(e, t) : e;
}
function ir(e) {
  "@babel/helpers - typeof";
  return ir = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ir(e);
}
var sD = ["ref"];
function gh(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ct(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? gh(Object(r), !0).forEach(function(n) {
      _o(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : gh(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function cD(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function vh(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, oy(n.key), n);
  }
}
function lD(e, t, r) {
  return t && vh(e.prototype, t), r && vh(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function uD(e, t, r) {
  return t = In(t), dD(e, ny() ? Reflect.construct(t, r || [], In(e).constructor) : t.apply(e, r));
}
function dD(e, t) {
  if (t && (ir(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return fD(e);
}
function fD(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function ny() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (ny = function() {
    return !!e;
  })();
}
function In(e) {
  return In = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, In(e);
}
function hD(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Cc(e, t);
}
function Cc(e, t) {
  return Cc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, Cc(e, t);
}
function _o(e, t, r) {
  return t = oy(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function oy(e) {
  var t = pD(e, "string");
  return ir(t) == "symbol" ? t : t + "";
}
function pD(e, t) {
  if (ir(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ir(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function mD(e, t) {
  if (e == null) return {};
  var r = gD(e, t), n, o;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (o = 0; o < a.length; o++)
      n = a[o], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function gD(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function vD(e) {
  return e.value;
}
function bD(e, t) {
  if (/* @__PURE__ */ E.isValidElement(e))
    return /* @__PURE__ */ E.cloneElement(e, t);
  if (typeof e == "function")
    return /* @__PURE__ */ E.createElement(e, t);
  t.ref;
  var r = mD(t, sD);
  return /* @__PURE__ */ E.createElement(xl, r);
}
var bh = 1, El = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    cD(this, t);
    for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++)
      o[a] = arguments[a];
    return r = uD(this, t, [].concat(o)), _o(r, "lastBoundingBox", {
      width: -1,
      height: -1
    }), r;
  }
  return hD(t, e), lD(t, [{
    key: "componentDidMount",
    value: function() {
      this.updateBBox();
    }
  }, {
    key: "componentDidUpdate",
    value: function() {
      this.updateBBox();
    }
  }, {
    key: "getBBox",
    value: function() {
      if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
        var n = this.wrapperNode.getBoundingClientRect();
        return n.height = this.wrapperNode.offsetHeight, n.width = this.wrapperNode.offsetWidth, n;
      }
      return null;
    }
  }, {
    key: "updateBBox",
    value: function() {
      var n = this.props.onBBoxUpdate, o = this.getBBox();
      o ? (Math.abs(o.width - this.lastBoundingBox.width) > bh || Math.abs(o.height - this.lastBoundingBox.height) > bh) && (this.lastBoundingBox.width = o.width, this.lastBoundingBox.height = o.height, n && n(o)) : (this.lastBoundingBox.width !== -1 || this.lastBoundingBox.height !== -1) && (this.lastBoundingBox.width = -1, this.lastBoundingBox.height = -1, n && n(null));
    }
  }, {
    key: "getBBoxSnapshot",
    value: function() {
      return this.lastBoundingBox.width >= 0 && this.lastBoundingBox.height >= 0 ? ct({}, this.lastBoundingBox) : {
        width: 0,
        height: 0
      };
    }
  }, {
    key: "getDefaultPosition",
    value: function(n) {
      var o = this.props, a = o.layout, i = o.align, s = o.verticalAlign, c = o.margin, l = o.chartWidth, u = o.chartHeight, d, f;
      if (!n || (n.left === void 0 || n.left === null) && (n.right === void 0 || n.right === null))
        if (i === "center" && a === "vertical") {
          var m = this.getBBoxSnapshot();
          d = {
            left: ((l || 0) - m.width) / 2
          };
        } else
          d = i === "right" ? {
            right: c && c.right || 0
          } : {
            left: c && c.left || 0
          };
      if (!n || (n.top === void 0 || n.top === null) && (n.bottom === void 0 || n.bottom === null))
        if (s === "middle") {
          var b = this.getBBoxSnapshot();
          f = {
            top: ((u || 0) - b.height) / 2
          };
        } else
          f = s === "bottom" ? {
            bottom: c && c.bottom || 0
          } : {
            top: c && c.top || 0
          };
      return ct(ct({}, d), f);
    }
  }, {
    key: "render",
    value: function() {
      var n = this, o = this.props, a = o.content, i = o.width, s = o.height, c = o.wrapperStyle, l = o.payloadUniqBy, u = o.payload, d = ct(ct({
        position: "absolute",
        width: i || "auto",
        height: s || "auto"
      }, this.getDefaultPosition(c)), c);
      return /* @__PURE__ */ E.createElement("div", {
        className: "recharts-legend-wrapper",
        style: d,
        ref: function(m) {
          n.wrapperNode = m;
        }
      }, bD(a, ct(ct({}, this.props), {}, {
        payload: ry(u, l, vD)
      })));
    }
  }], [{
    key: "getWithHeight",
    value: function(n, o) {
      var a = ct(ct({}, this.defaultProps), n.props), i = a.layout;
      return i === "vertical" && ze(n.props.height) ? {
        height: n.props.height
      } : i === "horizontal" ? {
        width: n.props.width || o
      } : null;
    }
  }]);
})(qn);
_o(El, "displayName", "Legend");
_o(El, "defaultProps", {
  iconSize: 14,
  layout: "horizontal",
  align: "center",
  verticalAlign: "bottom"
});
var Ss, yh;
function yD() {
  if (yh) return Ss;
  yh = 1;
  var e = Jr(), t = Sl(), r = Ve(), n = e ? e.isConcatSpreadable : void 0;
  function o(a) {
    return r(a) || t(a) || !!(n && a && a[n]);
  }
  return Ss = o, Ss;
}
var Cs, wh;
function wD() {
  if (wh) return Cs;
  wh = 1;
  var e = Ub(), t = yD();
  function r(n, o, a, i, s) {
    var c = -1, l = n.length;
    for (a || (a = t), s || (s = []); ++c < l; ) {
      var u = n[c];
      o > 0 && a(u) ? o > 1 ? r(u, o - 1, a, i, s) : e(s, u) : i || (s[s.length] = u);
    }
    return s;
  }
  return Cs = r, Cs;
}
var Os, xh;
function xD() {
  if (xh) return Os;
  xh = 1;
  function e(t) {
    return function(r, n, o) {
      for (var a = -1, i = Object(r), s = o(r), c = s.length; c--; ) {
        var l = s[t ? c : ++a];
        if (n(i[l], l, i) === !1)
          break;
      }
      return r;
    };
  }
  return Os = e, Os;
}
var Ps, _h;
function _D() {
  if (_h) return Ps;
  _h = 1;
  var e = xD(), t = e();
  return Ps = t, Ps;
}
var Es, Sh;
function SD() {
  if (Sh) return Es;
  Sh = 1;
  var e = _D(), t = Pl();
  function r(n, o) {
    return n && e(n, o, t);
  }
  return Es = r, Es;
}
var Ms, Ch;
function CD() {
  if (Ch) return Ms;
  Ch = 1;
  var e = wo();
  function t(r, n) {
    return function(o, a) {
      if (o == null)
        return o;
      if (!e(o))
        return r(o, a);
      for (var i = o.length, s = n ? i : -1, c = Object(o); (n ? s-- : ++s < i) && a(c[s], s, c) !== !1; )
        ;
      return o;
    };
  }
  return Ms = t, Ms;
}
var Ts, Oh;
function OD() {
  if (Oh) return Ts;
  Oh = 1;
  var e = SD(), t = CD(), r = t(e);
  return Ts = r, Ts;
}
var Rs, Ph;
function PD() {
  if (Ph) return Rs;
  Ph = 1;
  var e = OD(), t = wo();
  function r(n, o) {
    var a = -1, i = t(n) ? Array(n.length) : [];
    return e(n, function(s, c, l) {
      i[++a] = o(s, c, l);
    }), i;
  }
  return Rs = r, Rs;
}
var Ds, Eh;
function ED() {
  if (Eh) return Ds;
  Eh = 1;
  function e(t, r) {
    var n = t.length;
    for (t.sort(r); n--; )
      t[n] = t[n].value;
    return t;
  }
  return Ds = e, Ds;
}
var ks, Mh;
function MD() {
  if (Mh) return ks;
  Mh = 1;
  var e = en();
  function t(r, n) {
    if (r !== n) {
      var o = r !== void 0, a = r === null, i = r === r, s = e(r), c = n !== void 0, l = n === null, u = n === n, d = e(n);
      if (!l && !d && !s && r > n || s && c && u && !l && !d || a && c && u || !o && u || !i)
        return 1;
      if (!a && !s && !d && r < n || d && o && i && !a && !s || l && o && i || !c && i || !u)
        return -1;
    }
    return 0;
  }
  return ks = t, ks;
}
var Ns, Th;
function TD() {
  if (Th) return Ns;
  Th = 1;
  var e = MD();
  function t(r, n, o) {
    for (var a = -1, i = r.criteria, s = n.criteria, c = i.length, l = o.length; ++a < c; ) {
      var u = e(i[a], s[a]);
      if (u) {
        if (a >= l)
          return u;
        var d = o[a];
        return u * (d == "desc" ? -1 : 1);
      }
    }
    return r.index - n.index;
  }
  return Ns = t, Ns;
}
var As, Rh;
function RD() {
  if (Rh) return As;
  Rh = 1;
  var e = Cb(), t = yl(), r = ty(), n = PD(), o = ED(), a = Kb(), i = TD(), s = xo(), c = Ve();
  function l(u, d, f) {
    d.length ? d = e(d, function(g) {
      return c(g) ? function(p) {
        return t(p, g.length === 1 ? g[0] : g);
      } : g;
    }) : d = [s];
    var m = -1;
    d = e(d, a(r));
    var b = n(u, function(g, p, w) {
      var y = e(d, function(x) {
        return x(g);
      });
      return { criteria: y, index: ++m, value: g };
    });
    return o(b, function(g, p) {
      return i(g, p, f);
    });
  }
  return As = l, As;
}
var Is, Dh;
function DD() {
  if (Dh) return Is;
  Dh = 1;
  function e(t, r, n) {
    switch (n.length) {
      case 0:
        return t.call(r);
      case 1:
        return t.call(r, n[0]);
      case 2:
        return t.call(r, n[0], n[1]);
      case 3:
        return t.call(r, n[0], n[1], n[2]);
    }
    return t.apply(r, n);
  }
  return Is = e, Is;
}
var $s, kh;
function kD() {
  if (kh) return $s;
  kh = 1;
  var e = DD(), t = Math.max;
  function r(n, o, a) {
    return o = t(o === void 0 ? n.length - 1 : o, 0), function() {
      for (var i = arguments, s = -1, c = t(i.length - o, 0), l = Array(c); ++s < c; )
        l[s] = i[o + s];
      s = -1;
      for (var u = Array(o + 1); ++s < o; )
        u[s] = i[s];
      return u[o] = a(l), e(n, this, u);
    };
  }
  return $s = r, $s;
}
var Fs, Nh;
function ND() {
  if (Nh) return Fs;
  Nh = 1;
  function e(t) {
    return function() {
      return t;
    };
  }
  return Fs = e, Fs;
}
var qs, Ah;
function AD() {
  if (Ah) return qs;
  Ah = 1;
  var e = Ht(), t = (function() {
    try {
      var r = e(Object, "defineProperty");
      return r({}, "", {}), r;
    } catch {
    }
  })();
  return qs = t, qs;
}
var Ws, Ih;
function ID() {
  if (Ih) return Ws;
  Ih = 1;
  var e = ND(), t = AD(), r = xo(), n = t ? function(o, a) {
    return t(o, "toString", {
      configurable: !0,
      enumerable: !1,
      value: e(a),
      writable: !0
    });
  } : r;
  return Ws = n, Ws;
}
var Bs, $h;
function $D() {
  if ($h) return Bs;
  $h = 1;
  var e = 800, t = 16, r = Date.now;
  function n(o) {
    var a = 0, i = 0;
    return function() {
      var s = r(), c = t - (s - i);
      if (i = s, c > 0) {
        if (++a >= e)
          return arguments[0];
      } else
        a = 0;
      return o.apply(void 0, arguments);
    };
  }
  return Bs = n, Bs;
}
var Ls, Fh;
function FD() {
  if (Fh) return Ls;
  Fh = 1;
  var e = ID(), t = $D(), r = t(e);
  return Ls = r, Ls;
}
var js, qh;
function qD() {
  if (qh) return js;
  qh = 1;
  var e = xo(), t = kD(), r = FD();
  function n(o, a) {
    return r(t(o, a, e), o + "");
  }
  return js = n, js;
}
var zs, Wh;
function WD() {
  if (Wh) return zs;
  Wh = 1;
  var e = gl(), t = wo(), r = Cl(), n = Tt();
  function o(a, i, s) {
    if (!n(s))
      return !1;
    var c = typeof i;
    return (c == "number" ? t(s) && r(i, s.length) : c == "string" && i in s) ? e(s[i], a) : !1;
  }
  return zs = o, zs;
}
var Hs, Bh;
function BD() {
  if (Bh) return Hs;
  Bh = 1;
  var e = wD(), t = RD(), r = qD(), n = WD(), o = r(function(a, i) {
    if (a == null)
      return [];
    var s = i.length;
    return s > 1 && n(a, i[0], i[1]) ? i = [] : s > 2 && n(i[0], i[1], i[2]) && (i = [i[0]]), t(a, e(i, 1), []);
  });
  return Hs = o, Hs;
}
var LD = BD();
const jD = /* @__PURE__ */ nt(LD);
function $r(e) {
  "@babel/helpers - typeof";
  return $r = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, $r(e);
}
function Oc() {
  return Oc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Oc.apply(this, arguments);
}
function zD(e, t) {
  return UD(e) || GD(e, t) || YD(e, t) || HD();
}
function HD() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function YD(e, t) {
  if (e) {
    if (typeof e == "string") return Lh(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Lh(e, t);
  }
}
function Lh(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function GD(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, a, i, s = [], c = !0, l = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(c = (n = a.call(r)).done) && (s.push(n.value), s.length !== t); c = !0) ;
    } catch (u) {
      l = !0, o = u;
    } finally {
      try {
        if (!c && r.return != null && (i = r.return(), Object(i) !== i)) return;
      } finally {
        if (l) throw o;
      }
    }
    return s;
  }
}
function UD(e) {
  if (Array.isArray(e)) return e;
}
function jh(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ys(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? jh(Object(r), !0).forEach(function(n) {
      VD(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : jh(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function VD(e, t, r) {
  return t = KD(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function KD(e) {
  var t = XD(e, "string");
  return $r(t) == "symbol" ? t : t + "";
}
function XD(e, t) {
  if ($r(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if ($r(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ZD(e) {
  return Array.isArray(e) && Dn(e[0]) && Dn(e[1]) ? e.join(" ~ ") : e;
}
var QD = function(t) {
  var r = t.separator, n = r === void 0 ? " : " : r, o = t.contentStyle, a = o === void 0 ? {} : o, i = t.itemStyle, s = i === void 0 ? {} : i, c = t.labelStyle, l = c === void 0 ? {} : c, u = t.payload, d = t.formatter, f = t.itemSorter, m = t.wrapperClassName, b = t.labelClassName, g = t.label, p = t.labelFormatter, w = t.accessibilityLayer, y = w === void 0 ? !1 : w, x = function() {
    if (u && u.length) {
      var B = {
        padding: 0,
        margin: 0
      }, k = (f ? jD(u, f) : u).map(function($, F) {
        if ($.type === "none")
          return null;
        var I = Ys({
          display: "block",
          paddingTop: 4,
          paddingBottom: 4,
          color: $.color || "#000"
        }, s), Y = $.formatter || d || ZD, q = $.value, N = $.name, M = q, X = N;
        if (Y && M != null && X != null) {
          var le = Y(q, N, $, F, u);
          if (Array.isArray(le)) {
            var me = zD(le, 2);
            M = me[0], X = me[1];
          } else
            M = le;
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          /* @__PURE__ */ E.createElement("li", {
            className: "recharts-tooltip-item",
            key: "tooltip-item-".concat(F),
            style: I
          }, Dn(X) ? /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-name"
          }, X) : null, Dn(X) ? /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-separator"
          }, n) : null, /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-value"
          }, M), /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-unit"
          }, $.unit || ""))
        );
      });
      return /* @__PURE__ */ E.createElement("ul", {
        className: "recharts-tooltip-item-list",
        style: B
      }, k);
    }
    return null;
  }, S = Ys({
    margin: 0,
    padding: 10,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    whiteSpace: "nowrap"
  }, a), C = Ys({
    margin: 0
  }, l), _ = !KT(g), O = _ ? g : "", P = dt("recharts-default-tooltip", m), R = dt("recharts-tooltip-label", b);
  _ && p && u !== void 0 && u !== null && (O = p(g, u));
  var A = y ? {
    role: "status",
    "aria-live": "assertive"
  } : {};
  return /* @__PURE__ */ E.createElement("div", Oc({
    className: P,
    style: S
  }, A), /* @__PURE__ */ E.createElement("p", {
    className: R,
    style: C
  }, /* @__PURE__ */ E.isValidElement(O) ? O : "".concat(O)), x());
};
function Fr(e) {
  "@babel/helpers - typeof";
  return Fr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Fr(e);
}
function mn(e, t, r) {
  return t = JD(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function JD(e) {
  var t = ek(e, "string");
  return Fr(t) == "symbol" ? t : t + "";
}
function ek(e, t) {
  if (Fr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Fr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var yr = "recharts-tooltip-wrapper", tk = {
  visibility: "hidden"
};
function rk(e) {
  var t = e.coordinate, r = e.translateX, n = e.translateY;
  return dt(yr, mn(mn(mn(mn({}, "".concat(yr, "-right"), ze(r) && t && ze(t.x) && r >= t.x), "".concat(yr, "-left"), ze(r) && t && ze(t.x) && r < t.x), "".concat(yr, "-bottom"), ze(n) && t && ze(t.y) && n >= t.y), "".concat(yr, "-top"), ze(n) && t && ze(t.y) && n < t.y));
}
function zh(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.key, o = e.offsetTopLeft, a = e.position, i = e.reverseDirection, s = e.tooltipDimension, c = e.viewBox, l = e.viewBoxDimension;
  if (a && ze(a[n]))
    return a[n];
  var u = r[n] - s - o, d = r[n] + o;
  if (t[n])
    return i[n] ? u : d;
  if (i[n]) {
    var f = u, m = c[n];
    return f < m ? Math.max(d, c[n]) : Math.max(u, c[n]);
  }
  var b = d + s, g = c[n] + l;
  return b > g ? Math.max(u, c[n]) : Math.max(d, c[n]);
}
function nk(e) {
  var t = e.translateX, r = e.translateY, n = e.useTranslate3d;
  return {
    transform: n ? "translate3d(".concat(t, "px, ").concat(r, "px, 0)") : "translate(".concat(t, "px, ").concat(r, "px)")
  };
}
function ok(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.offsetTopLeft, o = e.position, a = e.reverseDirection, i = e.tooltipBox, s = e.useTranslate3d, c = e.viewBox, l, u, d;
  return i.height > 0 && i.width > 0 && r ? (u = zh({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "x",
    offsetTopLeft: n,
    position: o,
    reverseDirection: a,
    tooltipDimension: i.width,
    viewBox: c,
    viewBoxDimension: c.width
  }), d = zh({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "y",
    offsetTopLeft: n,
    position: o,
    reverseDirection: a,
    tooltipDimension: i.height,
    viewBox: c,
    viewBoxDimension: c.height
  }), l = nk({
    translateX: u,
    translateY: d,
    useTranslate3d: s
  })) : l = tk, {
    cssProperties: l,
    cssClasses: rk({
      translateX: u,
      translateY: d,
      coordinate: r
    })
  };
}
function sr(e) {
  "@babel/helpers - typeof";
  return sr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, sr(e);
}
function Hh(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Yh(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Hh(Object(r), !0).forEach(function(n) {
      Ec(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Hh(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function ak(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function ik(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, iy(n.key), n);
  }
}
function sk(e, t, r) {
  return t && ik(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function ck(e, t, r) {
  return t = $n(t), lk(e, ay() ? Reflect.construct(t, r || [], $n(e).constructor) : t.apply(e, r));
}
function lk(e, t) {
  if (t && (sr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return uk(e);
}
function uk(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function ay() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (ay = function() {
    return !!e;
  })();
}
function $n(e) {
  return $n = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, $n(e);
}
function dk(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Pc(e, t);
}
function Pc(e, t) {
  return Pc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, Pc(e, t);
}
function Ec(e, t, r) {
  return t = iy(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function iy(e) {
  var t = fk(e, "string");
  return sr(t) == "symbol" ? t : t + "";
}
function fk(e, t) {
  if (sr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (sr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Gh = 1, hk = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    ak(this, t);
    for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++)
      o[a] = arguments[a];
    return r = ck(this, t, [].concat(o)), Ec(r, "state", {
      dismissed: !1,
      dismissedAtCoordinate: {
        x: 0,
        y: 0
      },
      lastBoundingBox: {
        width: -1,
        height: -1
      }
    }), Ec(r, "handleKeyDown", function(i) {
      if (i.key === "Escape") {
        var s, c, l, u;
        r.setState({
          dismissed: !0,
          dismissedAtCoordinate: {
            x: (s = (c = r.props.coordinate) === null || c === void 0 ? void 0 : c.x) !== null && s !== void 0 ? s : 0,
            y: (l = (u = r.props.coordinate) === null || u === void 0 ? void 0 : u.y) !== null && l !== void 0 ? l : 0
          }
        });
      }
    }), r;
  }
  return dk(t, e), sk(t, [{
    key: "updateBBox",
    value: function() {
      if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
        var n = this.wrapperNode.getBoundingClientRect();
        (Math.abs(n.width - this.state.lastBoundingBox.width) > Gh || Math.abs(n.height - this.state.lastBoundingBox.height) > Gh) && this.setState({
          lastBoundingBox: {
            width: n.width,
            height: n.height
          }
        });
      } else (this.state.lastBoundingBox.width !== -1 || this.state.lastBoundingBox.height !== -1) && this.setState({
        lastBoundingBox: {
          width: -1,
          height: -1
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function() {
      document.addEventListener("keydown", this.handleKeyDown), this.updateBBox();
    }
  }, {
    key: "componentWillUnmount",
    value: function() {
      document.removeEventListener("keydown", this.handleKeyDown);
    }
  }, {
    key: "componentDidUpdate",
    value: function() {
      var n, o;
      this.props.active && this.updateBBox(), this.state.dismissed && (((n = this.props.coordinate) === null || n === void 0 ? void 0 : n.x) !== this.state.dismissedAtCoordinate.x || ((o = this.props.coordinate) === null || o === void 0 ? void 0 : o.y) !== this.state.dismissedAtCoordinate.y) && (this.state.dismissed = !1);
    }
  }, {
    key: "render",
    value: function() {
      var n = this, o = this.props, a = o.active, i = o.allowEscapeViewBox, s = o.animationDuration, c = o.animationEasing, l = o.children, u = o.coordinate, d = o.hasPayload, f = o.isAnimationActive, m = o.offset, b = o.position, g = o.reverseDirection, p = o.useTranslate3d, w = o.viewBox, y = o.wrapperStyle, x = ok({
        allowEscapeViewBox: i,
        coordinate: u,
        offsetTopLeft: m,
        position: b,
        reverseDirection: g,
        tooltipBox: this.state.lastBoundingBox,
        useTranslate3d: p,
        viewBox: w
      }), S = x.cssClasses, C = x.cssProperties, _ = Yh(Yh({
        transition: f && a ? "transform ".concat(s, "ms ").concat(c) : void 0
      }, C), {}, {
        pointerEvents: "none",
        visibility: !this.state.dismissed && a && d ? "visible" : "hidden",
        position: "absolute",
        top: 0,
        left: 0
      }, y);
      return (
        // This element allow listening to the `Escape` key.
        // See https://github.com/recharts/recharts/pull/2925
        /* @__PURE__ */ E.createElement("div", {
          tabIndex: -1,
          className: S,
          style: _,
          ref: function(P) {
            n.wrapperNode = P;
          }
        }, l)
      );
    }
  }]);
})(qn), pk = function() {
  return !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout);
}, mk = {
  isSsr: pk()
};
function cr(e) {
  "@babel/helpers - typeof";
  return cr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, cr(e);
}
function Uh(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Vh(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Uh(Object(r), !0).forEach(function(n) {
      Ml(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Uh(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function gk(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function vk(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, cy(n.key), n);
  }
}
function bk(e, t, r) {
  return t && vk(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function yk(e, t, r) {
  return t = Fn(t), wk(e, sy() ? Reflect.construct(t, r || [], Fn(e).constructor) : t.apply(e, r));
}
function wk(e, t) {
  if (t && (cr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return xk(e);
}
function xk(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function sy() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (sy = function() {
    return !!e;
  })();
}
function Fn(e) {
  return Fn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Fn(e);
}
function _k(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Mc(e, t);
}
function Mc(e, t) {
  return Mc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, Mc(e, t);
}
function Ml(e, t, r) {
  return t = cy(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function cy(e) {
  var t = Sk(e, "string");
  return cr(t) == "symbol" ? t : t + "";
}
function Sk(e, t) {
  if (cr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (cr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function Ck(e) {
  return e.dataKey;
}
function Ok(e, t) {
  return /* @__PURE__ */ E.isValidElement(e) ? /* @__PURE__ */ E.cloneElement(e, t) : typeof e == "function" ? /* @__PURE__ */ E.createElement(e, t) : /* @__PURE__ */ E.createElement(QD, t);
}
var Tl = /* @__PURE__ */ (function(e) {
  function t() {
    return gk(this, t), yk(this, t, arguments);
  }
  return _k(t, e), bk(t, [{
    key: "render",
    value: function() {
      var n = this, o = this.props, a = o.active, i = o.allowEscapeViewBox, s = o.animationDuration, c = o.animationEasing, l = o.content, u = o.coordinate, d = o.filterNull, f = o.isAnimationActive, m = o.offset, b = o.payload, g = o.payloadUniqBy, p = o.position, w = o.reverseDirection, y = o.useTranslate3d, x = o.viewBox, S = o.wrapperStyle, C = b ?? [];
      d && C.length && (C = ry(b.filter(function(O) {
        return O.value != null && (O.hide !== !0 || n.props.includeHidden);
      }), g, Ck));
      var _ = C.length > 0;
      return /* @__PURE__ */ E.createElement(hk, {
        allowEscapeViewBox: i,
        animationDuration: s,
        animationEasing: c,
        isAnimationActive: f,
        active: a,
        coordinate: u,
        hasPayload: _,
        offset: m,
        position: p,
        reverseDirection: w,
        useTranslate3d: y,
        viewBox: x,
        wrapperStyle: S
      }, Ok(l, Vh(Vh({}, this.props), {}, {
        payload: C
      })));
    }
  }]);
})(qn);
Ml(Tl, "displayName", "Tooltip");
Ml(Tl, "defaultProps", {
  accessibilityLayer: !1,
  allowEscapeViewBox: {
    x: !1,
    y: !1
  },
  animationDuration: 400,
  animationEasing: "ease",
  contentStyle: {},
  coordinate: {
    x: 0,
    y: 0
  },
  cursor: !0,
  cursorStyle: {},
  filterNull: !0,
  isAnimationActive: !mk.isSsr,
  itemStyle: {},
  labelStyle: {},
  offset: 10,
  reverseDirection: {
    x: !1,
    y: !1
  },
  separator: " : ",
  trigger: "hover",
  useTranslate3d: !1,
  viewBox: {
    x: 0,
    y: 0,
    height: 0,
    width: 0
  },
  wrapperStyle: {}
});
var Gs, Kh;
function Pk() {
  if (Kh) return Gs;
  Kh = 1;
  var e = it(), t = function() {
    return e.Date.now();
  };
  return Gs = t, Gs;
}
var Us, Xh;
function Ek() {
  if (Xh) return Us;
  Xh = 1;
  var e = /\s/;
  function t(r) {
    for (var n = r.length; n-- && e.test(r.charAt(n)); )
      ;
    return n;
  }
  return Us = t, Us;
}
var Vs, Zh;
function Mk() {
  if (Zh) return Vs;
  Zh = 1;
  var e = Ek(), t = /^\s+/;
  function r(n) {
    return n && n.slice(0, e(n) + 1).replace(t, "");
  }
  return Vs = r, Vs;
}
var Ks, Qh;
function Tk() {
  if (Qh) return Ks;
  Qh = 1;
  var e = Mk(), t = Tt(), r = en(), n = NaN, o = /^[-+]0x[0-9a-f]+$/i, a = /^0b[01]+$/i, i = /^0o[0-7]+$/i, s = parseInt;
  function c(l) {
    if (typeof l == "number")
      return l;
    if (r(l))
      return n;
    if (t(l)) {
      var u = typeof l.valueOf == "function" ? l.valueOf() : l;
      l = t(u) ? u + "" : u;
    }
    if (typeof l != "string")
      return l === 0 ? l : +l;
    l = e(l);
    var d = a.test(l);
    return d || i.test(l) ? s(l.slice(2), d ? 2 : 8) : o.test(l) ? n : +l;
  }
  return Ks = c, Ks;
}
var Xs, Jh;
function Rk() {
  if (Jh) return Xs;
  Jh = 1;
  var e = Tt(), t = Pk(), r = Tk(), n = "Expected a function", o = Math.max, a = Math.min;
  function i(s, c, l) {
    var u, d, f, m, b, g, p = 0, w = !1, y = !1, x = !0;
    if (typeof s != "function")
      throw new TypeError(n);
    c = r(c) || 0, e(l) && (w = !!l.leading, y = "maxWait" in l, f = y ? o(r(l.maxWait) || 0, c) : f, x = "trailing" in l ? !!l.trailing : x);
    function S(k) {
      var $ = u, F = d;
      return u = d = void 0, p = k, m = s.apply(F, $), m;
    }
    function C(k) {
      return p = k, b = setTimeout(P, c), w ? S(k) : m;
    }
    function _(k) {
      var $ = k - g, F = k - p, I = c - $;
      return y ? a(I, f - F) : I;
    }
    function O(k) {
      var $ = k - g, F = k - p;
      return g === void 0 || $ >= c || $ < 0 || y && F >= f;
    }
    function P() {
      var k = t();
      if (O(k))
        return R(k);
      b = setTimeout(P, _(k));
    }
    function R(k) {
      return b = void 0, x && u ? S(k) : (u = d = void 0, m);
    }
    function A() {
      b !== void 0 && clearTimeout(b), p = 0, u = g = d = b = void 0;
    }
    function D() {
      return b === void 0 ? m : R(t());
    }
    function B() {
      var k = t(), $ = O(k);
      if (u = arguments, d = this, g = k, $) {
        if (b === void 0)
          return C(g);
        if (y)
          return clearTimeout(b), b = setTimeout(P, c), S(g);
      }
      return b === void 0 && (b = setTimeout(P, c)), m;
    }
    return B.cancel = A, B.flush = D, B;
  }
  return Xs = i, Xs;
}
var Zs, ep;
function Dk() {
  if (ep) return Zs;
  ep = 1;
  var e = Rk(), t = Tt(), r = "Expected a function";
  function n(o, a, i) {
    var s = !0, c = !0;
    if (typeof o != "function")
      throw new TypeError(r);
    return t(i) && (s = "leading" in i ? !!i.leading : s, c = "trailing" in i ? !!i.trailing : c), e(o, a, {
      leading: s,
      maxWait: a,
      trailing: c
    });
  }
  return Zs = n, Zs;
}
var kk = Dk();
const Nk = /* @__PURE__ */ nt(kk);
function qr(e) {
  "@babel/helpers - typeof";
  return qr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, qr(e);
}
function tp(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function gn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? tp(Object(r), !0).forEach(function(n) {
      Ak(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : tp(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Ak(e, t, r) {
  return t = Ik(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Ik(e) {
  var t = $k(e, "string");
  return qr(t) == "symbol" ? t : t + "";
}
function $k(e, t) {
  if (qr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (qr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Fk(e, t) {
  return Lk(e) || Bk(e, t) || Wk(e, t) || qk();
}
function qk() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Wk(e, t) {
  if (e) {
    if (typeof e == "string") return rp(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return rp(e, t);
  }
}
function rp(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Bk(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, a, i, s = [], c = !0, l = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(c = (n = a.call(r)).done) && (s.push(n.value), s.length !== t); c = !0) ;
    } catch (u) {
      l = !0, o = u;
    } finally {
      try {
        if (!c && r.return != null && (i = r.return(), Object(i) !== i)) return;
      } finally {
        if (l) throw o;
      }
    }
    return s;
  }
}
function Lk(e) {
  if (Array.isArray(e)) return e;
}
var jk = /* @__PURE__ */ Rc(function(e, t) {
  var r = e.aspect, n = e.initialDimension, o = n === void 0 ? {
    width: -1,
    height: -1
  } : n, a = e.width, i = a === void 0 ? "100%" : a, s = e.height, c = s === void 0 ? "100%" : s, l = e.minWidth, u = l === void 0 ? 0 : l, d = e.minHeight, f = e.maxHeight, m = e.children, b = e.debounce, g = b === void 0 ? 0 : b, p = e.id, w = e.className, y = e.onResize, x = e.style, S = x === void 0 ? {} : x, C = Qt(null), _ = Qt();
  _.current = y, ky(t, function() {
    return Object.defineProperty(C.current, "current", {
      get: function() {
        return console.warn("The usage of ref.current.current is deprecated and will no longer be supported."), C.current;
      },
      configurable: !0
    });
  });
  var O = Er({
    containerWidth: o.width,
    containerHeight: o.height
  }), P = Fk(O, 2), R = P[0], A = P[1], D = Pe(function(k, $) {
    A(function(F) {
      var I = Math.round(k), Y = Math.round($);
      return F.containerWidth === I && F.containerHeight === Y ? F : {
        containerWidth: I,
        containerHeight: Y
      };
    });
  }, []);
  op(function() {
    var k = function(N) {
      var M, X = N[0].contentRect, le = X.width, me = X.height;
      D(le, me), (M = _.current) === null || M === void 0 || M.call(_, le, me);
    };
    g > 0 && (k = Nk(k, g, {
      trailing: !0,
      leading: !1
    }));
    var $ = new ResizeObserver(k), F = C.current.getBoundingClientRect(), I = F.width, Y = F.height;
    return D(I, Y), $.observe(C.current), function() {
      $.disconnect();
    };
  }, [D, g]);
  var B = Pr(function() {
    var k = R.containerWidth, $ = R.containerHeight;
    if (k < 0 || $ < 0)
      return null;
    wn(hn(i) || hn(c), `The width(%s) and height(%s) are both fixed numbers,
       maybe you don't need to use a ResponsiveContainer.`, i, c), wn(!r || r > 0, "The aspect(%s) must be greater than zero.", r);
    var F = hn(i) ? k : i, I = hn(c) ? $ : c;
    r && r > 0 && (F ? I = F / r : I && (F = I * r), f && I > f && (I = f)), wn(F > 0 || I > 0, `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`, F, I, i, c, u, d, r);
    var Y = !Array.isArray(m) && fR(m.type).endsWith("Chart");
    return E.Children.map(m, function(q) {
      return /* @__PURE__ */ E.isValidElement(q) ? /* @__PURE__ */ Ny(q, gn({
        width: F,
        height: I
      }, Y ? {
        style: gn({
          height: "100%",
          width: "100%",
          maxHeight: I,
          maxWidth: F
        }, q.props.style)
      } : {})) : q;
    });
  }, [r, m, c, f, d, u, R, i]);
  return /* @__PURE__ */ E.createElement("div", {
    id: p ? "".concat(p) : void 0,
    className: dt("recharts-responsive-container", w),
    style: gn(gn({}, S), {}, {
      width: i,
      height: c,
      minWidth: u,
      minHeight: d,
      maxHeight: f
    }),
    ref: C
  }, B);
});
const zk = { light: "", dark: ".dark" }, ly = h.createContext(null);
function uy() {
  const e = h.useContext(ly);
  if (!e)
    throw new Error("useChart must be used within a <ChartContainer />");
  return e;
}
function TA({
  id: e,
  className: t,
  children: r,
  config: n,
  ...o
}) {
  const a = h.useId(), i = `chart-${e || a.replace(/:/g, "")}`;
  return /* @__PURE__ */ v(ly.Provider, { value: { config: n }, children: /* @__PURE__ */ ae(
    "div",
    {
      "data-slot": "chart",
      "data-chart": i,
      className: T(
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
        t
      ),
      ...o,
      children: [
        /* @__PURE__ */ v(Hk, { id: i, config: n }),
        /* @__PURE__ */ v(jk, { children: r })
      ]
    }
  ) });
}
const Hk = ({ id: e, config: t }) => {
  const r = Object.entries(t).filter(
    ([, n]) => n.theme || n.color
  );
  return r.length ? /* @__PURE__ */ v(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: Object.entries(zk).map(
          ([n, o]) => `
${o}${o ? " " : ""}[data-chart=${e}] {
${r.map(([a, i]) => {
            var c;
            const s = ((c = i.theme) == null ? void 0 : c[n]) || i.color;
            return s ? `  --color-${a}: ${s};` : null;
          }).join(`
`)}
}
`
        ).join(`
`)
      }
    }
  ) : null;
}, RA = Tl;
function DA({
  active: e,
  payload: t,
  className: r,
  indicator: n = "dot",
  hideLabel: o = !1,
  hideIndicator: a = !1,
  label: i,
  labelFormatter: s,
  labelClassName: c,
  formatter: l,
  color: u,
  nameKey: d,
  labelKey: f
}) {
  const { config: m } = uy(), b = h.useMemo(() => {
    var S;
    if (o || !(t != null && t.length))
      return null;
    const [p] = t, w = `${f || (p == null ? void 0 : p.dataKey) || (p == null ? void 0 : p.name) || "value"}`, y = Tc(m, p, w), x = !f && typeof i == "string" ? ((S = m[i]) == null ? void 0 : S.label) || i : y == null ? void 0 : y.label;
    return s ? /* @__PURE__ */ v("div", { className: T("font-medium", c), children: s(x, t) }) : x ? /* @__PURE__ */ v("div", { className: T("font-medium", c), children: x }) : null;
  }, [
    i,
    s,
    t,
    o,
    c,
    m,
    f
  ]);
  if (!e || !(t != null && t.length))
    return null;
  const g = t.length === 1 && n !== "dot";
  return /* @__PURE__ */ ae(
    "div",
    {
      className: T(
        "border-border/50 bg-background grid min-w-32 items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        r
      ),
      children: [
        g ? null : b,
        /* @__PURE__ */ v("div", { className: "grid gap-1.5", children: t.filter((p) => p.type !== "none").map((p, w) => {
          const y = `${d || p.name || p.dataKey || "value"}`, x = Tc(m, p, y), S = u || p.payload.fill || p.color;
          return /* @__PURE__ */ v(
            "div",
            {
              className: T(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                n === "dot" && "items-center"
              ),
              children: l && (p == null ? void 0 : p.value) !== void 0 && p.name ? l(p.value, p.name, p, w, p.payload) : /* @__PURE__ */ ae(It, { children: [
                x != null && x.icon ? /* @__PURE__ */ v(x.icon, {}) : !a && /* @__PURE__ */ v(
                  "div",
                  {
                    className: T(
                      "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                      {
                        "h-2.5 w-2.5": n === "dot",
                        "w-1": n === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent": n === "dashed",
                        "my-0.5": g && n === "dashed"
                      }
                    ),
                    style: {
                      "--color-bg": S,
                      "--color-border": S
                    }
                  }
                ),
                /* @__PURE__ */ ae(
                  "div",
                  {
                    className: T(
                      "flex flex-1 justify-between leading-none",
                      g ? "items-end" : "items-center"
                    ),
                    children: [
                      /* @__PURE__ */ ae("div", { className: "grid gap-1.5", children: [
                        g ? b : null,
                        /* @__PURE__ */ v("span", { className: "text-muted-foreground", children: (x == null ? void 0 : x.label) || p.name })
                      ] }),
                      p.value && /* @__PURE__ */ v("span", { className: "text-foreground font-mono font-medium tabular-nums", children: p.value.toLocaleString() })
                    ]
                  }
                )
              ] })
            },
            p.dataKey
          );
        }) })
      ]
    }
  );
}
const kA = El;
function NA({
  className: e,
  hideIcon: t = !1,
  payload: r,
  verticalAlign: n = "bottom",
  nameKey: o
}) {
  const { config: a } = uy();
  return r != null && r.length ? /* @__PURE__ */ v(
    "div",
    {
      className: T(
        "flex items-center justify-center gap-4",
        n === "top" ? "pb-3" : "pt-3",
        e
      ),
      children: r.filter((i) => i.type !== "none").map((i) => {
        const s = `${o || i.dataKey || "value"}`, c = Tc(a, i, s);
        return /* @__PURE__ */ ae(
          "div",
          {
            className: T(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
            ),
            children: [
              c != null && c.icon && !t ? /* @__PURE__ */ v(c.icon, {}) : /* @__PURE__ */ v(
                "div",
                {
                  className: "h-2 w-2 shrink-0 rounded-[2px]",
                  style: {
                    backgroundColor: i.color
                  }
                }
              ),
              c == null ? void 0 : c.label
            ]
          },
          i.value
        );
      })
    }
  ) : null;
}
function Tc(e, t, r) {
  if (typeof t != "object" || t === null)
    return;
  const n = "payload" in t && typeof t.payload == "object" && t.payload !== null ? t.payload : void 0;
  let o = r;
  return r in t && typeof t[r] == "string" ? o = t[r] : n && r in n && typeof n[r] == "string" && (o = n[r]), o in e ? e[o] : e[r];
}
export {
  Xk as Avatar,
  Jk as AvatarBadge,
  Qk as AvatarFallback,
  eN as AvatarGroup,
  tN as AvatarGroupCount,
  Zk as AvatarImage,
  qv as Button,
  gN as Calendar,
  rN as Card,
  iN as CardAction,
  sN as CardContent,
  aN as CardDescription,
  cN as CardFooter,
  nN as CardHeader,
  oN as CardTitle,
  TA as ChartContainer,
  kA as ChartLegend,
  NA as ChartLegendContent,
  Hk as ChartStyle,
  RA as ChartTooltip,
  DA as ChartTooltipContent,
  vN as Dialog,
  yN as DialogContent,
  SN as DialogDescription,
  xN as DialogFooter,
  wN as DialogHeader,
  _N as DialogTitle,
  bN as DialogTrigger,
  CN as DropdownMenu,
  TN as DropdownMenuCheckboxItem,
  PN as DropdownMenuContent,
  EN as DropdownMenuGroup,
  MN as DropdownMenuItem,
  kN as DropdownMenuLabel,
  RN as DropdownMenuRadioGroup,
  DN as DropdownMenuRadioItem,
  NN as DropdownMenuSeparator,
  AN as DropdownMenuSub,
  $N as DropdownMenuSubContent,
  IN as DropdownMenuSubTrigger,
  ON as DropdownMenuTrigger,
  FN as Form,
  LN as FormControl,
  jN as FormDescription,
  qN as FormField,
  WN as FormItem,
  BN as FormLabel,
  zN as FormMessage,
  F0 as Input,
  q0 as Label,
  HN as Popover,
  GN as PopoverContent,
  YN as PopoverTrigger,
  uN as Select,
  hN as SelectContent,
  pN as SelectItem,
  fN as SelectTrigger,
  dN as SelectValue,
  eT as Separator,
  tT as Sheet,
  oT as SheetContent,
  sT as SheetDescription,
  VN as SheetFooter,
  aT as SheetHeader,
  iT as SheetTitle,
  UN as SheetTrigger,
  XN as Sidebar,
  oA as SidebarContent,
  rA as SidebarFooter,
  aA as SidebarGroup,
  sA as SidebarGroupContent,
  iA as SidebarGroupLabel,
  tA as SidebarHeader,
  eA as SidebarInput,
  JN as SidebarInset,
  cA as SidebarMenu,
  dA as SidebarMenuAction,
  fA as SidebarMenuBadge,
  uA as SidebarMenuButton,
  lA as SidebarMenuItem,
  hA as SidebarMenuSkeleton,
  pA as SidebarMenuSub,
  gA as SidebarMenuSubButton,
  mA as SidebarMenuSubItem,
  KN as SidebarProvider,
  QN as SidebarRail,
  nA as SidebarSeparator,
  ZN as SidebarTrigger,
  ku as Skeleton,
  mN as Switch,
  vA as Table,
  yA as TableBody,
  CA as TableCaption,
  SA as TableCell,
  wA as TableFooter,
  _A as TableHead,
  bA as TableHeader,
  xA as TableRow,
  OA as Tabs,
  MA as TabsContent,
  PA as TabsList,
  EA as TabsTrigger,
  lN as Textarea,
  uT as Tooltip,
  fT as TooltipContent,
  lT as TooltipProvider,
  dT as TooltipTrigger,
  $0 as buttonVariants,
  T as cn,
  cT as useIsMobile,
  ho as useSidebar
};
