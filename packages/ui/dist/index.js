import { jsx as v, Fragment as It, jsxs as ae } from "react/jsx-runtime";
import * as p from "react";
import E, { useState as Tr, useLayoutEffect as xh, forwardRef as Ic, createElement as rc, createContext as Zy, useContext as Qy, useCallback as Ee, useRef as Jt, useEffect as _h, useMemo as Mr, isValidElement as Jy, PureComponent as jn, useImperativeHandle as ew, cloneElement as tw } from "react";
import * as zn from "react-dom";
import rw from "react-dom";
function Sh(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = Sh(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function pt() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = Sh(e)) && (n && (n += " "), n += t);
  return n;
}
const Vl = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Gl = pt, Fc = (e, t) => (r) => {
  var n;
  if ((t == null ? void 0 : t.variants) == null) return Gl(e, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
  const { variants: o, defaultVariants: a } = t, i = Object.keys(o).map((l) => {
    const u = r == null ? void 0 : r[l], d = a == null ? void 0 : a[l];
    if (u === null) return null;
    const f = Vl(u) || Vl(d);
    return o[l][f];
  }), s = r && Object.entries(r).reduce((l, u) => {
    let [d, f] = u;
    return f === void 0 || (l[d] = f), l;
  }, {}), c = t == null || (n = t.compoundVariants) === null || n === void 0 ? void 0 : n.reduce((l, u) => {
    let { class: d, className: f, ...g } = u;
    return Object.entries(g).every((b) => {
      let [m, h] = b;
      return Array.isArray(h) ? h.includes({
        ...a,
        ...s
      }[m]) : {
        ...a,
        ...s
      }[m] === h;
    }) ? [
      ...l,
      d,
      f
    ] : l;
  }, []);
  return Gl(e, i, c, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
};
function Ul(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Hn(...e) {
  return (t) => {
    let r = !1;
    const n = e.map((o) => {
      const a = Ul(o, t);
      return !r && typeof a == "function" && (r = !0), a;
    });
    if (r)
      return () => {
        for (let o = 0; o < n.length; o++) {
          const a = n[o];
          typeof a == "function" ? a() : Ul(e[o], null);
        }
      };
  };
}
function ie(...e) {
  return p.useCallback(Hn(...e), e);
}
// @__NO_SIDE_EFFECTS__
function wt(e) {
  const t = /* @__PURE__ */ nw(e), r = p.forwardRef((n, o) => {
    const { children: a, ...i } = n, s = p.Children.toArray(a), c = s.find(aw);
    if (c) {
      const l = c.props.children, u = s.map((d) => d === c ? p.Children.count(l) > 1 ? p.Children.only(null) : p.isValidElement(l) ? l.props.children : null : d);
      return /* @__PURE__ */ v(t, { ...i, ref: o, children: p.isValidElement(l) ? p.cloneElement(l, void 0, u) : null });
    }
    return /* @__PURE__ */ v(t, { ...i, ref: o, children: a });
  });
  return r.displayName = `${e}.Slot`, r;
}
var ur = /* @__PURE__ */ wt("Slot");
// @__NO_SIDE_EFFECTS__
function nw(e) {
  const t = p.forwardRef((r, n) => {
    const { children: o, ...a } = r;
    if (p.isValidElement(o)) {
      const i = sw(o), s = iw(a, o.props);
      return o.type !== p.Fragment && (s.ref = n ? Hn(n, i) : i), p.cloneElement(o, s);
    }
    return p.Children.count(o) > 1 ? p.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var Ch = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function ow(e) {
  const t = ({ children: r }) => /* @__PURE__ */ v(It, { children: r });
  return t.displayName = `${e}.Slottable`, t.__radixId = Ch, t;
}
function aw(e) {
  return p.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Ch;
}
function iw(e, t) {
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
function sw(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var cw = [
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
], K = cw.reduce((e, t) => {
  const r = /* @__PURE__ */ wt(`Primitive.${t}`), n = p.forwardRef((o, a) => {
    const { asChild: i, ...s } = o, c = i ? r : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ v(c, { ...s, ref: a });
  });
  return n.displayName = `Primitive.${t}`, { ...e, [t]: n };
}, {});
function Oh(e, t) {
  e && zn.flushSync(() => e.dispatchEvent(t));
}
var Ph = Object.freeze({
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
}), lw = "VisuallyHidden", Eh = p.forwardRef(
  (e, t) => /* @__PURE__ */ v(
    K.span,
    {
      ...e,
      ref: t,
      style: { ...Ph, ...e.style }
    }
  )
);
Eh.displayName = lw;
var uw = Eh;
function dw(e, t) {
  const r = p.createContext(t), n = (a) => {
    const { children: i, ...s } = a, c = p.useMemo(() => s, Object.values(s));
    return /* @__PURE__ */ v(r.Provider, { value: c, children: i });
  };
  n.displayName = e + "Provider";
  function o(a) {
    const i = p.useContext(r);
    if (i) return i;
    if (t !== void 0) return t;
    throw new Error(`\`${a}\` must be used within \`${e}\``);
  }
  return [n, o];
}
function Le(e, t = []) {
  let r = [];
  function n(a, i) {
    const s = p.createContext(i), c = r.length;
    r = [...r, i];
    const l = (d) => {
      var y;
      const { scope: f, children: g, ...b } = d, m = ((y = f == null ? void 0 : f[e]) == null ? void 0 : y[c]) || s, h = p.useMemo(() => b, Object.values(b));
      return /* @__PURE__ */ v(m.Provider, { value: h, children: g });
    };
    l.displayName = a + "Provider";
    function u(d, f) {
      var m;
      const g = ((m = f == null ? void 0 : f[e]) == null ? void 0 : m[c]) || s, b = p.useContext(g);
      if (b) return b;
      if (i !== void 0) return i;
      throw new Error(`\`${d}\` must be used within \`${a}\``);
    }
    return [l, u];
  }
  const o = () => {
    const a = r.map((i) => p.createContext(i));
    return function(s) {
      const c = (s == null ? void 0 : s[e]) || a;
      return p.useMemo(
        () => ({ [`__scope${e}`]: { ...s, [e]: c } }),
        [s, c]
      );
    };
  };
  return o.scopeName = e, [n, fw(o, ...t)];
}
function fw(...e) {
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
      return p.useMemo(() => ({ [`__scope${t.scopeName}`]: i }), [i]);
    };
  };
  return r.scopeName = t.scopeName, r;
}
function $c(e) {
  const t = e + "CollectionProvider", [r, n] = Le(t), [o, a] = r(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), i = (m) => {
    const { scope: h, children: y } = m, w = E.useRef(null), x = E.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ v(o, { scope: h, itemMap: x, collectionRef: w, children: y });
  };
  i.displayName = t;
  const s = e + "CollectionSlot", c = /* @__PURE__ */ wt(s), l = E.forwardRef(
    (m, h) => {
      const { scope: y, children: w } = m, x = a(s, y), _ = ie(h, x.collectionRef);
      return /* @__PURE__ */ v(c, { ref: _, children: w });
    }
  );
  l.displayName = s;
  const u = e + "CollectionItemSlot", d = "data-radix-collection-item", f = /* @__PURE__ */ wt(u), g = E.forwardRef(
    (m, h) => {
      const { scope: y, children: w, ...x } = m, _ = E.useRef(null), C = ie(h, _), S = a(u, y);
      return E.useEffect(() => (S.itemMap.set(_, { ref: _, ...x }), () => void S.itemMap.delete(_))), /* @__PURE__ */ v(f, { [d]: "", ref: C, children: w });
    }
  );
  g.displayName = u;
  function b(m) {
    const h = a(e + "CollectionConsumer", m);
    return E.useCallback(() => {
      const w = h.collectionRef.current;
      if (!w) return [];
      const x = Array.from(w.querySelectorAll(`[${d}]`));
      return Array.from(h.itemMap.values()).sort(
        (S, O) => x.indexOf(S.ref.current) - x.indexOf(O.ref.current)
      );
    }, [h.collectionRef, h.itemMap]);
  }
  return [
    { Provider: i, Slot: l, ItemSlot: g },
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
var xe = globalThis != null && globalThis.document ? p.useLayoutEffect : () => {
}, pw = p[" useInsertionEffect ".trim().toString()] || xe;
function nt({
  prop: e,
  defaultProp: t,
  onChange: r = () => {
  },
  caller: n
}) {
  const [o, a, i] = hw({
    defaultProp: t,
    onChange: r
  }), s = e !== void 0, c = s ? e : o;
  {
    const u = p.useRef(e !== void 0);
    p.useEffect(() => {
      const d = u.current;
      d !== s && console.warn(
        `${n} is changing from ${d ? "controlled" : "uncontrolled"} to ${s ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), u.current = s;
    }, [s, n]);
  }
  const l = p.useCallback(
    (u) => {
      var d;
      if (s) {
        const f = mw(u) ? u(e) : u;
        f !== e && ((d = i.current) == null || d.call(i, f));
      } else
        a(u);
    },
    [s, e, a, i]
  );
  return [c, l];
}
function hw({
  defaultProp: e,
  onChange: t
}) {
  const [r, n] = p.useState(e), o = p.useRef(r), a = p.useRef(t);
  return pw(() => {
    a.current = t;
  }, [t]), p.useEffect(() => {
    var i;
    o.current !== r && ((i = a.current) == null || i.call(a, r), o.current = r);
  }, [r, o]), [r, n, a];
}
function mw(e) {
  return typeof e == "function";
}
function gw(e, t) {
  return p.useReducer((r, n) => t[r][n] ?? r, e);
}
var De = (e) => {
  const { present: t, children: r } = e, n = vw(t), o = typeof r == "function" ? r({ present: n.isPresent }) : p.Children.only(r), a = ie(n.ref, bw(o));
  return typeof r == "function" || n.isPresent ? p.cloneElement(o, { ref: a }) : null;
};
De.displayName = "Presence";
function vw(e) {
  const [t, r] = p.useState(), n = p.useRef(null), o = p.useRef(e), a = p.useRef("none"), i = e ? "mounted" : "unmounted", [s, c] = gw(i, {
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
  return p.useEffect(() => {
    const l = nn(n.current);
    a.current = s === "mounted" ? l : "none";
  }, [s]), xe(() => {
    const l = n.current, u = o.current;
    if (u !== e) {
      const f = a.current, g = nn(l);
      e ? c("MOUNT") : g === "none" || (l == null ? void 0 : l.display) === "none" ? c("UNMOUNT") : c(u && f !== g ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, c]), xe(() => {
    if (t) {
      let l;
      const u = t.ownerDocument.defaultView ?? window, d = (g) => {
        const m = nn(n.current).includes(CSS.escape(g.animationName));
        if (g.target === t && m && (c("ANIMATION_END"), !o.current)) {
          const h = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", l = u.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = h);
          });
        }
      }, f = (g) => {
        g.target === t && (a.current = nn(n.current));
      };
      return t.addEventListener("animationstart", f), t.addEventListener("animationcancel", d), t.addEventListener("animationend", d), () => {
        u.clearTimeout(l), t.removeEventListener("animationstart", f), t.removeEventListener("animationcancel", d), t.removeEventListener("animationend", d);
      };
    } else
      c("ANIMATION_END");
  }, [t, c]), {
    isPresent: ["mounted", "unmountSuspended"].includes(s),
    ref: p.useCallback((l) => {
      n.current = l ? getComputedStyle(l) : null, r(l);
    }, [])
  };
}
function nn(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function bw(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var yw = p[" useId ".trim().toString()] || (() => {
}), ww = 0;
function Oe(e) {
  const [t, r] = p.useState(yw());
  return xe(() => {
    r((n) => n ?? String(ww++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var xw = p.createContext(void 0);
function Yn(e) {
  const t = p.useContext(xw);
  return e || t || "ltr";
}
function qe(e) {
  const t = p.useRef(e);
  return p.useEffect(() => {
    t.current = e;
  }), p.useMemo(() => (...r) => {
    var n;
    return (n = t.current) == null ? void 0 : n.call(t, ...r);
  }, []);
}
function _w(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = qe(e);
  p.useEffect(() => {
    const n = (o) => {
      o.key === "Escape" && r(o);
    };
    return t.addEventListener("keydown", n, { capture: !0 }), () => t.removeEventListener("keydown", n, { capture: !0 });
  }, [r, t]);
}
var Sw = "DismissableLayer", nc = "dismissableLayer.update", Cw = "dismissableLayer.pointerDownOutside", Ow = "dismissableLayer.focusOutside", Kl, Mh = p.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), dr = p.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: r = !1,
      onEscapeKeyDown: n,
      onPointerDownOutside: o,
      onFocusOutside: a,
      onInteractOutside: i,
      onDismiss: s,
      ...c
    } = e, l = p.useContext(Mh), [u, d] = p.useState(null), f = (u == null ? void 0 : u.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, g] = p.useState({}), b = ie(t, (O) => d(O)), m = Array.from(l.layers), [h] = [...l.layersWithOutsidePointerEventsDisabled].slice(-1), y = m.indexOf(h), w = u ? m.indexOf(u) : -1, x = l.layersWithOutsidePointerEventsDisabled.size > 0, _ = w >= y, C = Mw((O) => {
      const P = O.target, T = [...l.branches].some((A) => A.contains(P));
      !_ || T || (o == null || o(O), i == null || i(O), O.defaultPrevented || s == null || s());
    }, f), S = Tw((O) => {
      const P = O.target;
      [...l.branches].some((A) => A.contains(P)) || (a == null || a(O), i == null || i(O), O.defaultPrevented || s == null || s());
    }, f);
    return _w((O) => {
      w === l.layers.size - 1 && (n == null || n(O), !O.defaultPrevented && s && (O.preventDefault(), s()));
    }, f), p.useEffect(() => {
      if (u)
        return r && (l.layersWithOutsidePointerEventsDisabled.size === 0 && (Kl = f.body.style.pointerEvents, f.body.style.pointerEvents = "none"), l.layersWithOutsidePointerEventsDisabled.add(u)), l.layers.add(u), Xl(), () => {
          r && l.layersWithOutsidePointerEventsDisabled.size === 1 && (f.body.style.pointerEvents = Kl);
        };
    }, [u, f, r, l]), p.useEffect(() => () => {
      u && (l.layers.delete(u), l.layersWithOutsidePointerEventsDisabled.delete(u), Xl());
    }, [u, l]), p.useEffect(() => {
      const O = () => g({});
      return document.addEventListener(nc, O), () => document.removeEventListener(nc, O);
    }, []), /* @__PURE__ */ v(
      K.div,
      {
        ...c,
        ref: b,
        style: {
          pointerEvents: x ? _ ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: W(e.onFocusCapture, S.onFocusCapture),
        onBlurCapture: W(e.onBlurCapture, S.onBlurCapture),
        onPointerDownCapture: W(
          e.onPointerDownCapture,
          C.onPointerDownCapture
        )
      }
    );
  }
);
dr.displayName = Sw;
var Pw = "DismissableLayerBranch", Ew = p.forwardRef((e, t) => {
  const r = p.useContext(Mh), n = p.useRef(null), o = ie(t, n);
  return p.useEffect(() => {
    const a = n.current;
    if (a)
      return r.branches.add(a), () => {
        r.branches.delete(a);
      };
  }, [r.branches]), /* @__PURE__ */ v(K.div, { ...e, ref: o });
});
Ew.displayName = Pw;
function Mw(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = qe(e), n = p.useRef(!1), o = p.useRef(() => {
  });
  return p.useEffect(() => {
    const a = (s) => {
      if (s.target && !n.current) {
        let c = function() {
          Th(
            Cw,
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
function Tw(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = qe(e), n = p.useRef(!1);
  return p.useEffect(() => {
    const o = (a) => {
      a.target && !n.current && Th(Ow, r, { originalEvent: a }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, r]), {
    onFocusCapture: () => n.current = !0,
    onBlurCapture: () => n.current = !1
  };
}
function Xl() {
  const e = new CustomEvent(nc);
  document.dispatchEvent(e);
}
function Th(e, t, r, { discrete: n }) {
  const o = r.originalEvent.target, a = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: r });
  t && o.addEventListener(e, t, { once: !0 }), n ? Oh(o, a) : o.dispatchEvent(a);
}
var Do = "focusScope.autoFocusOnMount", No = "focusScope.autoFocusOnUnmount", Zl = { bubbles: !1, cancelable: !0 }, Rw = "FocusScope", Lr = p.forwardRef((e, t) => {
  const {
    loop: r = !1,
    trapped: n = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: a,
    ...i
  } = e, [s, c] = p.useState(null), l = qe(o), u = qe(a), d = p.useRef(null), f = ie(t, (m) => c(m)), g = p.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  p.useEffect(() => {
    if (n) {
      let m = function(x) {
        if (g.paused || !s) return;
        const _ = x.target;
        s.contains(_) ? d.current = _ : yt(d.current, { select: !0 });
      }, h = function(x) {
        if (g.paused || !s) return;
        const _ = x.relatedTarget;
        _ !== null && (s.contains(_) || yt(d.current, { select: !0 }));
      }, y = function(x) {
        if (document.activeElement === document.body)
          for (const C of x)
            C.removedNodes.length > 0 && yt(s);
      };
      document.addEventListener("focusin", m), document.addEventListener("focusout", h);
      const w = new MutationObserver(y);
      return s && w.observe(s, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", m), document.removeEventListener("focusout", h), w.disconnect();
      };
    }
  }, [n, s, g.paused]), p.useEffect(() => {
    if (s) {
      Jl.add(g);
      const m = document.activeElement;
      if (!s.contains(m)) {
        const y = new CustomEvent(Do, Zl);
        s.addEventListener(Do, l), s.dispatchEvent(y), y.defaultPrevented || (kw(Fw(Rh(s)), { select: !0 }), document.activeElement === m && yt(s));
      }
      return () => {
        s.removeEventListener(Do, l), setTimeout(() => {
          const y = new CustomEvent(No, Zl);
          s.addEventListener(No, u), s.dispatchEvent(y), y.defaultPrevented || yt(m ?? document.body, { select: !0 }), s.removeEventListener(No, u), Jl.remove(g);
        }, 0);
      };
    }
  }, [s, l, u, g]);
  const b = p.useCallback(
    (m) => {
      if (!r && !n || g.paused) return;
      const h = m.key === "Tab" && !m.altKey && !m.ctrlKey && !m.metaKey, y = document.activeElement;
      if (h && y) {
        const w = m.currentTarget, [x, _] = Dw(w);
        x && _ ? !m.shiftKey && y === _ ? (m.preventDefault(), r && yt(x, { select: !0 })) : m.shiftKey && y === x && (m.preventDefault(), r && yt(_, { select: !0 })) : y === w && m.preventDefault();
      }
    },
    [r, n, g.paused]
  );
  return /* @__PURE__ */ v(K.div, { tabIndex: -1, ...i, ref: f, onKeyDown: b });
});
Lr.displayName = Rw;
function kw(e, { select: t = !1 } = {}) {
  const r = document.activeElement;
  for (const n of e)
    if (yt(n, { select: t }), document.activeElement !== r) return;
}
function Dw(e) {
  const t = Rh(e), r = Ql(t, e), n = Ql(t.reverse(), e);
  return [r, n];
}
function Rh(e) {
  const t = [], r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => {
      const o = n.tagName === "INPUT" && n.type === "hidden";
      return n.disabled || n.hidden || o ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; r.nextNode(); ) t.push(r.currentNode);
  return t;
}
function Ql(e, t) {
  for (const r of e)
    if (!Nw(r, { upTo: t })) return r;
}
function Nw(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function Aw(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function yt(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const r = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== r && Aw(e) && t && e.select();
  }
}
var Jl = Iw();
function Iw() {
  let e = [];
  return {
    add(t) {
      const r = e[0];
      t !== r && (r == null || r.pause()), e = eu(e, t), e.unshift(t);
    },
    remove(t) {
      var r;
      e = eu(e, t), (r = e[0]) == null || r.resume();
    }
  };
}
function eu(e, t) {
  const r = [...e], n = r.indexOf(t);
  return n !== -1 && r.splice(n, 1), r;
}
function Fw(e) {
  return e.filter((t) => t.tagName !== "A");
}
var $w = "Portal", fr = p.forwardRef((e, t) => {
  var s;
  const { container: r, ...n } = e, [o, a] = p.useState(!1);
  xe(() => a(!0), []);
  const i = r || o && ((s = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : s.body);
  return i ? rw.createPortal(/* @__PURE__ */ v(K.div, { ...n, ref: t }), i) : null;
});
fr.displayName = $w;
var Ao = 0;
function Vn() {
  p.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? tu()), document.body.insertAdjacentElement("beforeend", e[1] ?? tu()), Ao++, () => {
      Ao === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), Ao--;
    };
  }, []);
}
function tu() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var Je = function() {
  return Je = Object.assign || function(t) {
    for (var r, n = 1, o = arguments.length; n < o; n++) {
      r = arguments[n];
      for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (t[a] = r[a]);
    }
    return t;
  }, Je.apply(this, arguments);
};
function kh(e, t) {
  var r = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(e); o < n.length; o++)
      t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
  return r;
}
function Bw(e, t, r) {
  if (r || arguments.length === 2) for (var n = 0, o = t.length, a; n < o; n++)
    (a || !(n in t)) && (a || (a = Array.prototype.slice.call(t, 0, n)), a[n] = t[n]);
  return e.concat(a || Array.prototype.slice.call(t));
}
var wn = "right-scroll-bar-position", xn = "width-before-scroll-bar", Ww = "with-scroll-bars-hidden", qw = "--removed-body-scroll-bar-size";
function Io(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Lw(e, t) {
  var r = Tr(function() {
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
var jw = typeof window < "u" ? p.useLayoutEffect : p.useEffect, ru = /* @__PURE__ */ new WeakMap();
function zw(e, t) {
  var r = Lw(null, function(n) {
    return e.forEach(function(o) {
      return Io(o, n);
    });
  });
  return jw(function() {
    var n = ru.get(r);
    if (n) {
      var o = new Set(n), a = new Set(e), i = r.current;
      o.forEach(function(s) {
        a.has(s) || Io(s, null);
      }), a.forEach(function(s) {
        o.has(s) || Io(s, i);
      });
    }
    ru.set(r, e);
  }, [e]), r;
}
function Hw(e) {
  return e;
}
function Yw(e, t) {
  t === void 0 && (t = Hw);
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
function Vw(e) {
  e === void 0 && (e = {});
  var t = Yw(null);
  return t.options = Je({ async: !0, ssr: !1 }, e), t;
}
var Dh = function(e) {
  var t = e.sideCar, r = kh(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var n = t.read();
  if (!n)
    throw new Error("Sidecar medium not found");
  return p.createElement(n, Je({}, r));
};
Dh.isSideCarExport = !0;
function Gw(e, t) {
  return e.useMedium(t), Dh;
}
var Nh = Vw(), Fo = function() {
}, Gn = p.forwardRef(function(e, t) {
  var r = p.useRef(null), n = p.useState({
    onScrollCapture: Fo,
    onWheelCapture: Fo,
    onTouchMoveCapture: Fo
  }), o = n[0], a = n[1], i = e.forwardProps, s = e.children, c = e.className, l = e.removeScrollBar, u = e.enabled, d = e.shards, f = e.sideCar, g = e.noRelative, b = e.noIsolation, m = e.inert, h = e.allowPinchZoom, y = e.as, w = y === void 0 ? "div" : y, x = e.gapMode, _ = kh(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), C = f, S = zw([r, t]), O = Je(Je({}, _), o);
  return p.createElement(
    p.Fragment,
    null,
    u && p.createElement(C, { sideCar: Nh, removeScrollBar: l, shards: d, noRelative: g, noIsolation: b, inert: m, setCallbacks: a, allowPinchZoom: !!h, lockRef: r, gapMode: x }),
    i ? p.cloneElement(p.Children.only(s), Je(Je({}, O), { ref: S })) : p.createElement(w, Je({}, O, { className: c, ref: S }), s)
  );
});
Gn.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Gn.classNames = {
  fullWidth: xn,
  zeroRight: wn
};
var Uw = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Kw() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = Uw();
  return t && e.setAttribute("nonce", t), e;
}
function Xw(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Zw(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Qw = function() {
  var e = 0, t = null;
  return {
    add: function(r) {
      e == 0 && (t = Kw()) && (Xw(t, r), Zw(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, Jw = function() {
  var e = Qw();
  return function(t, r) {
    p.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && r]);
  };
}, Ah = function() {
  var e = Jw(), t = function(r) {
    var n = r.styles, o = r.dynamic;
    return e(n, o), null;
  };
  return t;
}, ex = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, $o = function(e) {
  return parseInt(e || "", 10) || 0;
}, tx = function(e) {
  var t = window.getComputedStyle(document.body), r = t[e === "padding" ? "paddingLeft" : "marginLeft"], n = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [$o(r), $o(n), $o(o)];
}, rx = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return ex;
  var t = tx(e), r = document.documentElement.clientWidth, n = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, n - r + t[2] - t[0])
  };
}, nx = Ah(), er = "data-scroll-locked", ox = function(e, t, r, n) {
  var o = e.left, a = e.top, i = e.right, s = e.gap;
  return r === void 0 && (r = "margin"), `
  .`.concat(Ww, ` {
   overflow: hidden `).concat(n, `;
   padding-right: `).concat(s, "px ").concat(n, `;
  }
  body[`).concat(er, `] {
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
  
  .`).concat(wn, ` {
    right: `).concat(s, "px ").concat(n, `;
  }
  
  .`).concat(xn, ` {
    margin-right: `).concat(s, "px ").concat(n, `;
  }
  
  .`).concat(wn, " .").concat(wn, ` {
    right: 0 `).concat(n, `;
  }
  
  .`).concat(xn, " .").concat(xn, ` {
    margin-right: 0 `).concat(n, `;
  }
  
  body[`).concat(er, `] {
    `).concat(qw, ": ").concat(s, `px;
  }
`);
}, nu = function() {
  var e = parseInt(document.body.getAttribute(er) || "0", 10);
  return isFinite(e) ? e : 0;
}, ax = function() {
  p.useEffect(function() {
    return document.body.setAttribute(er, (nu() + 1).toString()), function() {
      var e = nu() - 1;
      e <= 0 ? document.body.removeAttribute(er) : document.body.setAttribute(er, e.toString());
    };
  }, []);
}, ix = function(e) {
  var t = e.noRelative, r = e.noImportant, n = e.gapMode, o = n === void 0 ? "margin" : n;
  ax();
  var a = p.useMemo(function() {
    return rx(o);
  }, [o]);
  return p.createElement(nx, { styles: ox(a, !t, o, r ? "" : "!important") });
}, oc = !1;
if (typeof window < "u")
  try {
    var on = Object.defineProperty({}, "passive", {
      get: function() {
        return oc = !0, !0;
      }
    });
    window.addEventListener("test", on, on), window.removeEventListener("test", on, on);
  } catch {
    oc = !1;
  }
var Gt = oc ? { passive: !1 } : !1, sx = function(e) {
  return e.tagName === "TEXTAREA";
}, Ih = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var r = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    r[t] !== "hidden" && // contains scroll inside self
    !(r.overflowY === r.overflowX && !sx(e) && r[t] === "visible")
  );
}, cx = function(e) {
  return Ih(e, "overflowY");
}, lx = function(e) {
  return Ih(e, "overflowX");
}, ou = function(e, t) {
  var r = t.ownerDocument, n = t;
  do {
    typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
    var o = Fh(e, n);
    if (o) {
      var a = $h(e, n), i = a[1], s = a[2];
      if (i > s)
        return !0;
    }
    n = n.parentNode;
  } while (n && n !== r.body);
  return !1;
}, ux = function(e) {
  var t = e.scrollTop, r = e.scrollHeight, n = e.clientHeight;
  return [
    t,
    r,
    n
  ];
}, dx = function(e) {
  var t = e.scrollLeft, r = e.scrollWidth, n = e.clientWidth;
  return [
    t,
    r,
    n
  ];
}, Fh = function(e, t) {
  return e === "v" ? cx(t) : lx(t);
}, $h = function(e, t) {
  return e === "v" ? ux(t) : dx(t);
}, fx = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, px = function(e, t, r, n, o) {
  var a = fx(e, window.getComputedStyle(t).direction), i = a * n, s = r.target, c = t.contains(s), l = !1, u = i > 0, d = 0, f = 0;
  do {
    if (!s)
      break;
    var g = $h(e, s), b = g[0], m = g[1], h = g[2], y = m - h - a * b;
    (b || y) && Fh(e, s) && (d += y, f += b);
    var w = s.parentNode;
    s = w && w.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? w.host : w;
  } while (
    // portaled content
    !c && s !== document.body || // self content
    c && (t.contains(s) || t === s)
  );
  return (u && Math.abs(d) < 1 || !u && Math.abs(f) < 1) && (l = !0), l;
}, an = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, au = function(e) {
  return [e.deltaX, e.deltaY];
}, iu = function(e) {
  return e && "current" in e ? e.current : e;
}, hx = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, mx = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, gx = 0, Ut = [];
function vx(e) {
  var t = p.useRef([]), r = p.useRef([0, 0]), n = p.useRef(), o = p.useState(gx++)[0], a = p.useState(Ah)[0], i = p.useRef(e);
  p.useEffect(function() {
    i.current = e;
  }, [e]), p.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var m = Bw([e.lockRef.current], (e.shards || []).map(iu), !0).filter(Boolean);
      return m.forEach(function(h) {
        return h.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), m.forEach(function(h) {
          return h.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var s = p.useCallback(function(m, h) {
    if ("touches" in m && m.touches.length === 2 || m.type === "wheel" && m.ctrlKey)
      return !i.current.allowPinchZoom;
    var y = an(m), w = r.current, x = "deltaX" in m ? m.deltaX : w[0] - y[0], _ = "deltaY" in m ? m.deltaY : w[1] - y[1], C, S = m.target, O = Math.abs(x) > Math.abs(_) ? "h" : "v";
    if ("touches" in m && O === "h" && S.type === "range")
      return !1;
    var P = window.getSelection(), T = P && P.anchorNode, A = T ? T === S || T.contains(S) : !1;
    if (A)
      return !1;
    var k = ou(O, S);
    if (!k)
      return !0;
    if (k ? C = O : (C = O === "v" ? "h" : "v", k = ou(O, S)), !k)
      return !1;
    if (!n.current && "changedTouches" in m && (x || _) && (n.current = C), !C)
      return !0;
    var q = n.current || C;
    return px(q, h, m, q === "h" ? x : _);
  }, []), c = p.useCallback(function(m) {
    var h = m;
    if (!(!Ut.length || Ut[Ut.length - 1] !== a)) {
      var y = "deltaY" in h ? au(h) : an(h), w = t.current.filter(function(C) {
        return C.name === h.type && (C.target === h.target || h.target === C.shadowParent) && hx(C.delta, y);
      })[0];
      if (w && w.should) {
        h.cancelable && h.preventDefault();
        return;
      }
      if (!w) {
        var x = (i.current.shards || []).map(iu).filter(Boolean).filter(function(C) {
          return C.contains(h.target);
        }), _ = x.length > 0 ? s(h, x[0]) : !i.current.noIsolation;
        _ && h.cancelable && h.preventDefault();
      }
    }
  }, []), l = p.useCallback(function(m, h, y, w) {
    var x = { name: m, delta: h, target: y, should: w, shadowParent: bx(y) };
    t.current.push(x), setTimeout(function() {
      t.current = t.current.filter(function(_) {
        return _ !== x;
      });
    }, 1);
  }, []), u = p.useCallback(function(m) {
    r.current = an(m), n.current = void 0;
  }, []), d = p.useCallback(function(m) {
    l(m.type, au(m), m.target, s(m, e.lockRef.current));
  }, []), f = p.useCallback(function(m) {
    l(m.type, an(m), m.target, s(m, e.lockRef.current));
  }, []);
  p.useEffect(function() {
    return Ut.push(a), e.setCallbacks({
      onScrollCapture: d,
      onWheelCapture: d,
      onTouchMoveCapture: f
    }), document.addEventListener("wheel", c, Gt), document.addEventListener("touchmove", c, Gt), document.addEventListener("touchstart", u, Gt), function() {
      Ut = Ut.filter(function(m) {
        return m !== a;
      }), document.removeEventListener("wheel", c, Gt), document.removeEventListener("touchmove", c, Gt), document.removeEventListener("touchstart", u, Gt);
    };
  }, []);
  var g = e.removeScrollBar, b = e.inert;
  return p.createElement(
    p.Fragment,
    null,
    b ? p.createElement(a, { styles: mx(o) }) : null,
    g ? p.createElement(ix, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function bx(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const yx = Gw(Nh, vx);
var jr = p.forwardRef(function(e, t) {
  return p.createElement(Gn, Je({}, e, { ref: t, sideCar: yx }));
});
jr.classNames = Gn.classNames;
var wx = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, Kt = /* @__PURE__ */ new WeakMap(), sn = /* @__PURE__ */ new WeakMap(), cn = {}, Bo = 0, Bh = function(e) {
  return e && (e.host || Bh(e.parentNode));
}, xx = function(e, t) {
  return t.map(function(r) {
    if (e.contains(r))
      return r;
    var n = Bh(r);
    return n && e.contains(n) ? n : (console.error("aria-hidden", r, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(r) {
    return !!r;
  });
}, _x = function(e, t, r, n) {
  var o = xx(t, Array.isArray(e) ? e : [e]);
  cn[r] || (cn[r] = /* @__PURE__ */ new WeakMap());
  var a = cn[r], i = [], s = /* @__PURE__ */ new Set(), c = new Set(o), l = function(d) {
    !d || s.has(d) || (s.add(d), l(d.parentNode));
  };
  o.forEach(l);
  var u = function(d) {
    !d || c.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (s.has(f))
        u(f);
      else
        try {
          var g = f.getAttribute(n), b = g !== null && g !== "false", m = (Kt.get(f) || 0) + 1, h = (a.get(f) || 0) + 1;
          Kt.set(f, m), a.set(f, h), i.push(f), m === 1 && b && sn.set(f, !0), h === 1 && f.setAttribute(r, "true"), b || f.setAttribute(n, "true");
        } catch (y) {
          console.error("aria-hidden: cannot operate on ", f, y);
        }
    });
  };
  return u(t), s.clear(), Bo++, function() {
    i.forEach(function(d) {
      var f = Kt.get(d) - 1, g = a.get(d) - 1;
      Kt.set(d, f), a.set(d, g), f || (sn.has(d) || d.removeAttribute(n), sn.delete(d)), g || d.removeAttribute(r);
    }), Bo--, Bo || (Kt = /* @__PURE__ */ new WeakMap(), Kt = /* @__PURE__ */ new WeakMap(), sn = /* @__PURE__ */ new WeakMap(), cn = {});
  };
}, Un = function(e, t, r) {
  r === void 0 && (r = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), o = wx(e);
  return o ? (n.push.apply(n, Array.from(o.querySelectorAll("[aria-live], script"))), _x(n, o, r, "aria-hidden")) : function() {
    return null;
  };
}, Kn = "Dialog", [Wh] = Le(Kn), [Sx, Ue] = Wh(Kn), qh = (e) => {
  const {
    __scopeDialog: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: a,
    modal: i = !0
  } = e, s = p.useRef(null), c = p.useRef(null), [l, u] = nt({
    prop: n,
    defaultProp: o ?? !1,
    onChange: a,
    caller: Kn
  });
  return /* @__PURE__ */ v(
    Sx,
    {
      scope: t,
      triggerRef: s,
      contentRef: c,
      contentId: Oe(),
      titleId: Oe(),
      descriptionId: Oe(),
      open: l,
      onOpenChange: u,
      onOpenToggle: p.useCallback(() => u((d) => !d), [u]),
      modal: i,
      children: r
    }
  );
};
qh.displayName = Kn;
var Lh = "DialogTrigger", jh = p.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = Ue(Lh, r), a = ie(t, o.triggerRef);
    return /* @__PURE__ */ v(
      K.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": qc(o.open),
        ...n,
        ref: a,
        onClick: W(e.onClick, o.onOpenToggle)
      }
    );
  }
);
jh.displayName = Lh;
var Bc = "DialogPortal", [Cx, zh] = Wh(Bc, {
  forceMount: void 0
}), Hh = (e) => {
  const { __scopeDialog: t, forceMount: r, children: n, container: o } = e, a = Ue(Bc, t);
  return /* @__PURE__ */ v(Cx, { scope: t, forceMount: r, children: p.Children.map(n, (i) => /* @__PURE__ */ v(De, { present: r || a.open, children: /* @__PURE__ */ v(fr, { asChild: !0, container: o, children: i }) })) });
};
Hh.displayName = Bc;
var On = "DialogOverlay", Yh = p.forwardRef(
  (e, t) => {
    const r = zh(On, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, a = Ue(On, e.__scopeDialog);
    return a.modal ? /* @__PURE__ */ v(De, { present: n || a.open, children: /* @__PURE__ */ v(Px, { ...o, ref: t }) }) : null;
  }
);
Yh.displayName = On;
var Ox = /* @__PURE__ */ wt("DialogOverlay.RemoveScroll"), Px = p.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = Ue(On, r);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ v(jr, { as: Ox, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ v(
        K.div,
        {
          "data-state": qc(o.open),
          ...n,
          ref: t,
          style: { pointerEvents: "auto", ...n.style }
        }
      ) })
    );
  }
), Ft = "DialogContent", Vh = p.forwardRef(
  (e, t) => {
    const r = zh(Ft, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, a = Ue(Ft, e.__scopeDialog);
    return /* @__PURE__ */ v(De, { present: n || a.open, children: a.modal ? /* @__PURE__ */ v(Ex, { ...o, ref: t }) : /* @__PURE__ */ v(Mx, { ...o, ref: t }) });
  }
);
Vh.displayName = Ft;
var Ex = p.forwardRef(
  (e, t) => {
    const r = Ue(Ft, e.__scopeDialog), n = p.useRef(null), o = ie(t, r.contentRef, n);
    return p.useEffect(() => {
      const a = n.current;
      if (a) return Un(a);
    }, []), /* @__PURE__ */ v(
      Gh,
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
), Mx = p.forwardRef(
  (e, t) => {
    const r = Ue(Ft, e.__scopeDialog), n = p.useRef(!1), o = p.useRef(!1);
    return /* @__PURE__ */ v(
      Gh,
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
), Gh = p.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, trapFocus: n, onOpenAutoFocus: o, onCloseAutoFocus: a, ...i } = e, s = Ue(Ft, r), c = p.useRef(null), l = ie(t, c);
    return Vn(), /* @__PURE__ */ ae(It, { children: [
      /* @__PURE__ */ v(
        Lr,
        {
          asChild: !0,
          loop: !0,
          trapped: n,
          onMountAutoFocus: o,
          onUnmountAutoFocus: a,
          children: /* @__PURE__ */ v(
            dr,
            {
              role: "dialog",
              id: s.contentId,
              "aria-describedby": s.descriptionId,
              "aria-labelledby": s.titleId,
              "data-state": qc(s.open),
              ...i,
              ref: l,
              onDismiss: () => s.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ ae(It, { children: [
        /* @__PURE__ */ v(Tx, { titleId: s.titleId }),
        /* @__PURE__ */ v(kx, { contentRef: c, descriptionId: s.descriptionId })
      ] })
    ] });
  }
), Wc = "DialogTitle", Uh = p.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = Ue(Wc, r);
    return /* @__PURE__ */ v(K.h2, { id: o.titleId, ...n, ref: t });
  }
);
Uh.displayName = Wc;
var Kh = "DialogDescription", Xh = p.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = Ue(Kh, r);
    return /* @__PURE__ */ v(K.p, { id: o.descriptionId, ...n, ref: t });
  }
);
Xh.displayName = Kh;
var Zh = "DialogClose", Qh = p.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = Ue(Zh, r);
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
Qh.displayName = Zh;
function qc(e) {
  return e ? "open" : "closed";
}
var Jh = "DialogTitleWarning", [NN, em] = dw(Jh, {
  contentName: Ft,
  titleName: Wc,
  docsSlug: "dialog"
}), Tx = ({ titleId: e }) => {
  const t = em(Jh), r = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return p.useEffect(() => {
    e && (document.getElementById(e) || console.error(r));
  }, [r, e]), null;
}, Rx = "DialogDescriptionWarning", kx = ({ contentRef: e, descriptionId: t }) => {
  const n = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${em(Rx).contentName}}.`;
  return p.useEffect(() => {
    var a;
    const o = (a = e.current) == null ? void 0 : a.getAttribute("aria-describedby");
    t && o && (document.getElementById(t) || console.warn(n));
  }, [n, e, t]), null;
}, tm = qh, rm = jh, nm = Hh, om = Yh, am = Vh, im = Uh, sm = Xh, Lc = Qh, ln = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function at(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var un = { exports: {} }, Wo = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var su;
function Dx() {
  if (su) return Wo;
  su = 1;
  var e = E;
  function t(d, f) {
    return d === f && (d !== 0 || 1 / d === 1 / f) || d !== d && f !== f;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useState, o = e.useEffect, a = e.useLayoutEffect, i = e.useDebugValue;
  function s(d, f) {
    var g = f(), b = n({ inst: { value: g, getSnapshot: f } }), m = b[0].inst, h = b[1];
    return a(
      function() {
        m.value = g, m.getSnapshot = f, c(m) && h({ inst: m });
      },
      [d, g, f]
    ), o(
      function() {
        return c(m) && h({ inst: m }), d(function() {
          c(m) && h({ inst: m });
        });
      },
      [d]
    ), i(g), g;
  }
  function c(d) {
    var f = d.getSnapshot;
    d = d.value;
    try {
      var g = f();
      return !r(d, g);
    } catch {
      return !0;
    }
  }
  function l(d, f) {
    return f();
  }
  var u = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? l : s;
  return Wo.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : u, Wo;
}
var qo = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cu;
function Nx() {
  return cu || (cu = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(g, b) {
      return g === b && (g !== 0 || 1 / g === 1 / b) || g !== g && b !== b;
    }
    function t(g, b) {
      u || o.startTransition === void 0 || (u = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var m = b();
      if (!d) {
        var h = b();
        a(m, h) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), d = !0);
      }
      h = i({
        inst: { value: m, getSnapshot: b }
      });
      var y = h[0].inst, w = h[1];
      return c(
        function() {
          y.value = m, y.getSnapshot = b, r(y) && w({ inst: y });
        },
        [g, m, b]
      ), s(
        function() {
          return r(y) && w({ inst: y }), g(function() {
            r(y) && w({ inst: y });
          });
        },
        [g]
      ), l(m), m;
    }
    function r(g) {
      var b = g.getSnapshot;
      g = g.value;
      try {
        var m = b();
        return !a(g, m);
      } catch {
        return !0;
      }
    }
    function n(g, b) {
      return b();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var o = E, a = typeof Object.is == "function" ? Object.is : e, i = o.useState, s = o.useEffect, c = o.useLayoutEffect, l = o.useDebugValue, u = !1, d = !1, f = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? n : t;
    qo.useSyncExternalStore = o.useSyncExternalStore !== void 0 ? o.useSyncExternalStore : f, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), qo;
}
var lu;
function Ax() {
  return lu || (lu = 1, process.env.NODE_ENV === "production" ? un.exports = Dx() : un.exports = Nx()), un.exports;
}
var Ix = Ax();
function Fx() {
  return Ix.useSyncExternalStore(
    $x,
    () => !0,
    () => !1
  );
}
function $x() {
  return () => {
  };
}
var jc = "Avatar", [Bx] = Le(jc), [Wx, cm] = Bx(jc), lm = p.forwardRef(
  (e, t) => {
    const { __scopeAvatar: r, ...n } = e, [o, a] = p.useState("idle");
    return /* @__PURE__ */ v(
      Wx,
      {
        scope: r,
        imageLoadingStatus: o,
        onImageLoadingStatusChange: a,
        children: /* @__PURE__ */ v(K.span, { ...n, ref: t })
      }
    );
  }
);
lm.displayName = jc;
var um = "AvatarImage", dm = p.forwardRef(
  (e, t) => {
    const { __scopeAvatar: r, src: n, onLoadingStatusChange: o = () => {
    }, ...a } = e, i = cm(um, r), s = qx(n, a), c = qe((l) => {
      o(l), i.onImageLoadingStatusChange(l);
    });
    return xe(() => {
      s !== "idle" && c(s);
    }, [s, c]), s === "loaded" ? /* @__PURE__ */ v(K.img, { ...a, ref: t, src: n }) : null;
  }
);
dm.displayName = um;
var fm = "AvatarFallback", pm = p.forwardRef(
  (e, t) => {
    const { __scopeAvatar: r, delayMs: n, ...o } = e, a = cm(fm, r), [i, s] = p.useState(n === void 0);
    return p.useEffect(() => {
      if (n !== void 0) {
        const c = window.setTimeout(() => s(!0), n);
        return () => window.clearTimeout(c);
      }
    }, [n]), i && a.imageLoadingStatus !== "loaded" ? /* @__PURE__ */ v(K.span, { ...o, ref: t }) : null;
  }
);
pm.displayName = fm;
function uu(e, t) {
  return e ? t ? (e.src !== t && (e.src = t), e.complete && e.naturalWidth > 0 ? "loaded" : "loading") : "error" : "idle";
}
function qx(e, { referrerPolicy: t, crossOrigin: r }) {
  const n = Fx(), o = p.useRef(null), a = n ? (o.current || (o.current = new window.Image()), o.current) : null, [i, s] = p.useState(
    () => uu(a, e)
  );
  return xe(() => {
    s(uu(a, e));
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
var Lx = lm, jx = dm, zx = pm;
function hm(e) {
  const t = p.useRef({ value: e, previous: e });
  return p.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e]);
}
function mm(e) {
  const [t, r] = p.useState(void 0);
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
const Hx = ["top", "right", "bottom", "left"], xt = Math.min, Te = Math.max, Pn = Math.round, dn = Math.floor, rt = (e) => ({
  x: e,
  y: e
}), Yx = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Vx = {
  start: "end",
  end: "start"
};
function ac(e, t, r) {
  return Te(e, xt(t, r));
}
function ht(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function mt(e) {
  return e.split("-")[0];
}
function pr(e) {
  return e.split("-")[1];
}
function zc(e) {
  return e === "x" ? "y" : "x";
}
function Hc(e) {
  return e === "y" ? "height" : "width";
}
const Gx = /* @__PURE__ */ new Set(["top", "bottom"]);
function et(e) {
  return Gx.has(mt(e)) ? "y" : "x";
}
function Yc(e) {
  return zc(et(e));
}
function Ux(e, t, r) {
  r === void 0 && (r = !1);
  const n = pr(e), o = Yc(e), a = Hc(o);
  let i = o === "x" ? n === (r ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[a] > t.floating[a] && (i = En(i)), [i, En(i)];
}
function Kx(e) {
  const t = En(e);
  return [ic(e), t, ic(t)];
}
function ic(e) {
  return e.replace(/start|end/g, (t) => Vx[t]);
}
const du = ["left", "right"], fu = ["right", "left"], Xx = ["top", "bottom"], Zx = ["bottom", "top"];
function Qx(e, t, r) {
  switch (e) {
    case "top":
    case "bottom":
      return r ? t ? fu : du : t ? du : fu;
    case "left":
    case "right":
      return t ? Xx : Zx;
    default:
      return [];
  }
}
function Jx(e, t, r, n) {
  const o = pr(e);
  let a = Qx(mt(e), r === "start", n);
  return o && (a = a.map((i) => i + "-" + o), t && (a = a.concat(a.map(ic)))), a;
}
function En(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Yx[t]);
}
function e_(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function gm(e) {
  return typeof e != "number" ? e_(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Mn(e) {
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
function pu(e, t, r) {
  let {
    reference: n,
    floating: o
  } = e;
  const a = et(t), i = Yc(t), s = Hc(i), c = mt(t), l = a === "y", u = n.x + n.width / 2 - o.width / 2, d = n.y + n.height / 2 - o.height / 2, f = n[s] / 2 - o[s] / 2;
  let g;
  switch (c) {
    case "top":
      g = {
        x: u,
        y: n.y - o.height
      };
      break;
    case "bottom":
      g = {
        x: u,
        y: n.y + n.height
      };
      break;
    case "right":
      g = {
        x: n.x + n.width,
        y: d
      };
      break;
    case "left":
      g = {
        x: n.x - o.width,
        y: d
      };
      break;
    default:
      g = {
        x: n.x,
        y: n.y
      };
  }
  switch (pr(t)) {
    case "start":
      g[i] -= f * (r && l ? -1 : 1);
      break;
    case "end":
      g[i] += f * (r && l ? -1 : 1);
      break;
  }
  return g;
}
async function t_(e, t) {
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
    padding: g = 0
  } = ht(t, e), b = gm(g), h = s[f ? d === "floating" ? "reference" : "floating" : d], y = Mn(await a.getClippingRect({
    element: (r = await (a.isElement == null ? void 0 : a.isElement(h))) == null || r ? h : h.contextElement || await (a.getDocumentElement == null ? void 0 : a.getDocumentElement(s.floating)),
    boundary: l,
    rootBoundary: u,
    strategy: c
  })), w = d === "floating" ? {
    x: n,
    y: o,
    width: i.floating.width,
    height: i.floating.height
  } : i.reference, x = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(s.floating)), _ = await (a.isElement == null ? void 0 : a.isElement(x)) ? await (a.getScale == null ? void 0 : a.getScale(x)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, C = Mn(a.convertOffsetParentRelativeRectToViewportRelativeRect ? await a.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: s,
    rect: w,
    offsetParent: x,
    strategy: c
  }) : w);
  return {
    top: (y.top - C.top + b.top) / _.y,
    bottom: (C.bottom - y.bottom + b.bottom) / _.y,
    left: (y.left - C.left + b.left) / _.x,
    right: (C.right - y.right + b.right) / _.x
  };
}
const r_ = async (e, t, r) => {
  const {
    placement: n = "bottom",
    strategy: o = "absolute",
    middleware: a = [],
    platform: i
  } = r, s = a.filter(Boolean), c = await (i.isRTL == null ? void 0 : i.isRTL(t));
  let l = await i.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: u,
    y: d
  } = pu(l, n, c), f = n, g = {}, b = 0;
  for (let h = 0; h < s.length; h++) {
    var m;
    const {
      name: y,
      fn: w
    } = s[h], {
      x,
      y: _,
      data: C,
      reset: S
    } = await w({
      x: u,
      y: d,
      initialPlacement: n,
      placement: f,
      strategy: o,
      middlewareData: g,
      rects: l,
      platform: {
        ...i,
        detectOverflow: (m = i.detectOverflow) != null ? m : t_
      },
      elements: {
        reference: e,
        floating: t
      }
    });
    u = x ?? u, d = _ ?? d, g = {
      ...g,
      [y]: {
        ...g[y],
        ...C
      }
    }, S && b <= 50 && (b++, typeof S == "object" && (S.placement && (f = S.placement), S.rects && (l = S.rects === !0 ? await i.getElementRects({
      reference: e,
      floating: t,
      strategy: o
    }) : S.rects), {
      x: u,
      y: d
    } = pu(l, f, c)), h = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: o,
    middlewareData: g
  };
}, n_ = (e) => ({
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
    } = ht(e, t) || {};
    if (l == null)
      return {};
    const d = gm(u), f = {
      x: r,
      y: n
    }, g = Yc(o), b = Hc(g), m = await i.getDimensions(l), h = g === "y", y = h ? "top" : "left", w = h ? "bottom" : "right", x = h ? "clientHeight" : "clientWidth", _ = a.reference[b] + a.reference[g] - f[g] - a.floating[b], C = f[g] - a.reference[g], S = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(l));
    let O = S ? S[x] : 0;
    (!O || !await (i.isElement == null ? void 0 : i.isElement(S))) && (O = s.floating[x] || a.floating[b]);
    const P = _ / 2 - C / 2, T = O / 2 - m[b] / 2 - 1, A = xt(d[y], T), k = xt(d[w], T), q = A, D = O - m[b] - k, F = O / 2 - m[b] / 2 + P, $ = ac(q, F, D), I = !c.arrow && pr(o) != null && F !== $ && a.reference[b] / 2 - (F < q ? A : k) - m[b] / 2 < 0, Y = I ? F < q ? F - q : F - D : 0;
    return {
      [g]: f[g] + Y,
      data: {
        [g]: $,
        centerOffset: F - $ - Y,
        ...I && {
          alignmentOffset: Y
        }
      },
      reset: I
    };
  }
}), o_ = function(e) {
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
        fallbackStrategy: g = "bestFit",
        fallbackAxisSideDirection: b = "none",
        flipAlignment: m = !0,
        ...h
      } = ht(e, t);
      if ((r = a.arrow) != null && r.alignmentOffset)
        return {};
      const y = mt(o), w = et(s), x = mt(s) === s, _ = await (c.isRTL == null ? void 0 : c.isRTL(l.floating)), C = f || (x || !m ? [En(s)] : Kx(s)), S = b !== "none";
      !f && S && C.push(...Jx(s, m, b, _));
      const O = [s, ...C], P = await c.detectOverflow(t, h), T = [];
      let A = ((n = a.flip) == null ? void 0 : n.overflows) || [];
      if (u && T.push(P[y]), d) {
        const F = Ux(o, i, _);
        T.push(P[F[0]], P[F[1]]);
      }
      if (A = [...A, {
        placement: o,
        overflows: T
      }], !T.every((F) => F <= 0)) {
        var k, q;
        const F = (((k = a.flip) == null ? void 0 : k.index) || 0) + 1, $ = O[F];
        if ($ && (!(d === "alignment" ? w !== et($) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        A.every((B) => et(B.placement) === w ? B.overflows[0] > 0 : !0)))
          return {
            data: {
              index: F,
              overflows: A
            },
            reset: {
              placement: $
            }
          };
        let I = (q = A.filter((Y) => Y.overflows[0] <= 0).sort((Y, B) => Y.overflows[1] - B.overflows[1])[0]) == null ? void 0 : q.placement;
        if (!I)
          switch (g) {
            case "bestFit": {
              var D;
              const Y = (D = A.filter((B) => {
                if (S) {
                  const N = et(B.placement);
                  return N === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  N === "y";
                }
                return !0;
              }).map((B) => [B.placement, B.overflows.filter((N) => N > 0).reduce((N, R) => N + R, 0)]).sort((B, N) => B[1] - N[1])[0]) == null ? void 0 : D[0];
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
function hu(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function mu(e) {
  return Hx.some((t) => e[t] >= 0);
}
const a_ = function(e) {
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
      } = ht(e, t);
      switch (o) {
        case "referenceHidden": {
          const i = await n.detectOverflow(t, {
            ...a,
            elementContext: "reference"
          }), s = hu(i, r.reference);
          return {
            data: {
              referenceHiddenOffsets: s,
              referenceHidden: mu(s)
            }
          };
        }
        case "escaped": {
          const i = await n.detectOverflow(t, {
            ...a,
            altBoundary: !0
          }), s = hu(i, r.floating);
          return {
            data: {
              escapedOffsets: s,
              escaped: mu(s)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, vm = /* @__PURE__ */ new Set(["left", "top"]);
async function i_(e, t) {
  const {
    placement: r,
    platform: n,
    elements: o
  } = e, a = await (n.isRTL == null ? void 0 : n.isRTL(o.floating)), i = mt(r), s = pr(r), c = et(r) === "y", l = vm.has(i) ? -1 : 1, u = a && c ? -1 : 1, d = ht(t, e);
  let {
    mainAxis: f,
    crossAxis: g,
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
  return s && typeof b == "number" && (g = s === "end" ? b * -1 : b), c ? {
    x: g * u,
    y: f * l
  } : {
    x: f * l,
    y: g * u
  };
}
const s_ = function(e) {
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
      } = t, c = await i_(t, e);
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
}, c_ = function(e) {
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
          fn: (y) => {
            let {
              x: w,
              y: x
            } = y;
            return {
              x: w,
              y: x
            };
          }
        },
        ...l
      } = ht(e, t), u = {
        x: r,
        y: n
      }, d = await a.detectOverflow(t, l), f = et(mt(o)), g = zc(f);
      let b = u[g], m = u[f];
      if (i) {
        const y = g === "y" ? "top" : "left", w = g === "y" ? "bottom" : "right", x = b + d[y], _ = b - d[w];
        b = ac(x, b, _);
      }
      if (s) {
        const y = f === "y" ? "top" : "left", w = f === "y" ? "bottom" : "right", x = m + d[y], _ = m - d[w];
        m = ac(x, m, _);
      }
      const h = c.fn({
        ...t,
        [g]: b,
        [f]: m
      });
      return {
        ...h,
        data: {
          x: h.x - r,
          y: h.y - n,
          enabled: {
            [g]: i,
            [f]: s
          }
        }
      };
    }
  };
}, l_ = function(e) {
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
      } = ht(e, t), u = {
        x: r,
        y: n
      }, d = et(o), f = zc(d);
      let g = u[f], b = u[d];
      const m = ht(s, t), h = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (c) {
        const x = f === "y" ? "height" : "width", _ = a.reference[f] - a.floating[x] + h.mainAxis, C = a.reference[f] + a.reference[x] - h.mainAxis;
        g < _ ? g = _ : g > C && (g = C);
      }
      if (l) {
        var y, w;
        const x = f === "y" ? "width" : "height", _ = vm.has(mt(o)), C = a.reference[d] - a.floating[x] + (_ && ((y = i.offset) == null ? void 0 : y[d]) || 0) + (_ ? 0 : h.crossAxis), S = a.reference[d] + a.reference[x] + (_ ? 0 : ((w = i.offset) == null ? void 0 : w[d]) || 0) - (_ ? h.crossAxis : 0);
        b < C ? b = C : b > S && (b = S);
      }
      return {
        [f]: g,
        [d]: b
      };
    }
  };
}, u_ = function(e) {
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
      } = ht(e, t), u = await i.detectOverflow(t, l), d = mt(o), f = pr(o), g = et(o) === "y", {
        width: b,
        height: m
      } = a.floating;
      let h, y;
      d === "top" || d === "bottom" ? (h = d, y = f === (await (i.isRTL == null ? void 0 : i.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (y = d, h = f === "end" ? "top" : "bottom");
      const w = m - u.top - u.bottom, x = b - u.left - u.right, _ = xt(m - u[h], w), C = xt(b - u[y], x), S = !t.middlewareData.shift;
      let O = _, P = C;
      if ((r = t.middlewareData.shift) != null && r.enabled.x && (P = x), (n = t.middlewareData.shift) != null && n.enabled.y && (O = w), S && !f) {
        const A = Te(u.left, 0), k = Te(u.right, 0), q = Te(u.top, 0), D = Te(u.bottom, 0);
        g ? P = b - 2 * (A !== 0 || k !== 0 ? A + k : Te(u.left, u.right)) : O = m - 2 * (q !== 0 || D !== 0 ? q + D : Te(u.top, u.bottom));
      }
      await c({
        ...t,
        availableWidth: P,
        availableHeight: O
      });
      const T = await i.getDimensions(s.floating);
      return b !== T.width || m !== T.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Xn() {
  return typeof window < "u";
}
function hr(e) {
  return bm(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Re(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function it(e) {
  var t;
  return (t = (bm(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function bm(e) {
  return Xn() ? e instanceof Node || e instanceof Re(e).Node : !1;
}
function Ve(e) {
  return Xn() ? e instanceof Element || e instanceof Re(e).Element : !1;
}
function ot(e) {
  return Xn() ? e instanceof HTMLElement || e instanceof Re(e).HTMLElement : !1;
}
function gu(e) {
  return !Xn() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Re(e).ShadowRoot;
}
const d_ = /* @__PURE__ */ new Set(["inline", "contents"]);
function zr(e) {
  const {
    overflow: t,
    overflowX: r,
    overflowY: n,
    display: o
  } = Ge(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + r) && !d_.has(o);
}
const f_ = /* @__PURE__ */ new Set(["table", "td", "th"]);
function p_(e) {
  return f_.has(hr(e));
}
const h_ = [":popover-open", ":modal"];
function Zn(e) {
  return h_.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
const m_ = ["transform", "translate", "scale", "rotate", "perspective"], g_ = ["transform", "translate", "scale", "rotate", "perspective", "filter"], v_ = ["paint", "layout", "strict", "content"];
function Vc(e) {
  const t = Gc(), r = Ve(e) ? Ge(e) : e;
  return m_.some((n) => r[n] ? r[n] !== "none" : !1) || (r.containerType ? r.containerType !== "normal" : !1) || !t && (r.backdropFilter ? r.backdropFilter !== "none" : !1) || !t && (r.filter ? r.filter !== "none" : !1) || g_.some((n) => (r.willChange || "").includes(n)) || v_.some((n) => (r.contain || "").includes(n));
}
function b_(e) {
  let t = _t(e);
  for (; ot(t) && !rr(t); ) {
    if (Vc(t))
      return t;
    if (Zn(t))
      return null;
    t = _t(t);
  }
  return null;
}
function Gc() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const y_ = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function rr(e) {
  return y_.has(hr(e));
}
function Ge(e) {
  return Re(e).getComputedStyle(e);
}
function Qn(e) {
  return Ve(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function _t(e) {
  if (hr(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    gu(e) && e.host || // Fallback.
    it(e)
  );
  return gu(t) ? t.host : t;
}
function ym(e) {
  const t = _t(e);
  return rr(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : ot(t) && zr(t) ? t : ym(t);
}
function Rr(e, t, r) {
  var n;
  t === void 0 && (t = []), r === void 0 && (r = !0);
  const o = ym(e), a = o === ((n = e.ownerDocument) == null ? void 0 : n.body), i = Re(o);
  if (a) {
    const s = sc(i);
    return t.concat(i, i.visualViewport || [], zr(o) ? o : [], s && r ? Rr(s) : []);
  }
  return t.concat(o, Rr(o, [], r));
}
function sc(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function wm(e) {
  const t = Ge(e);
  let r = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const o = ot(e), a = o ? e.offsetWidth : r, i = o ? e.offsetHeight : n, s = Pn(r) !== a || Pn(n) !== i;
  return s && (r = a, n = i), {
    width: r,
    height: n,
    $: s
  };
}
function Uc(e) {
  return Ve(e) ? e : e.contextElement;
}
function tr(e) {
  const t = Uc(e);
  if (!ot(t))
    return rt(1);
  const r = t.getBoundingClientRect(), {
    width: n,
    height: o,
    $: a
  } = wm(t);
  let i = (a ? Pn(r.width) : r.width) / n, s = (a ? Pn(r.height) : r.height) / o;
  return (!i || !Number.isFinite(i)) && (i = 1), (!s || !Number.isFinite(s)) && (s = 1), {
    x: i,
    y: s
  };
}
const w_ = /* @__PURE__ */ rt(0);
function xm(e) {
  const t = Re(e);
  return !Gc() || !t.visualViewport ? w_ : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function x_(e, t, r) {
  return t === void 0 && (t = !1), !r || t && r !== Re(e) ? !1 : t;
}
function $t(e, t, r, n) {
  t === void 0 && (t = !1), r === void 0 && (r = !1);
  const o = e.getBoundingClientRect(), a = Uc(e);
  let i = rt(1);
  t && (n ? Ve(n) && (i = tr(n)) : i = tr(e));
  const s = x_(a, r, n) ? xm(a) : rt(0);
  let c = (o.left + s.x) / i.x, l = (o.top + s.y) / i.y, u = o.width / i.x, d = o.height / i.y;
  if (a) {
    const f = Re(a), g = n && Ve(n) ? Re(n) : n;
    let b = f, m = sc(b);
    for (; m && n && g !== b; ) {
      const h = tr(m), y = m.getBoundingClientRect(), w = Ge(m), x = y.left + (m.clientLeft + parseFloat(w.paddingLeft)) * h.x, _ = y.top + (m.clientTop + parseFloat(w.paddingTop)) * h.y;
      c *= h.x, l *= h.y, u *= h.x, d *= h.y, c += x, l += _, b = Re(m), m = sc(b);
    }
  }
  return Mn({
    width: u,
    height: d,
    x: c,
    y: l
  });
}
function Jn(e, t) {
  const r = Qn(e).scrollLeft;
  return t ? t.left + r : $t(it(e)).left + r;
}
function _m(e, t) {
  const r = e.getBoundingClientRect(), n = r.left + t.scrollLeft - Jn(e, r), o = r.top + t.scrollTop;
  return {
    x: n,
    y: o
  };
}
function __(e) {
  let {
    elements: t,
    rect: r,
    offsetParent: n,
    strategy: o
  } = e;
  const a = o === "fixed", i = it(n), s = t ? Zn(t.floating) : !1;
  if (n === i || s && a)
    return r;
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = rt(1);
  const u = rt(0), d = ot(n);
  if ((d || !d && !a) && ((hr(n) !== "body" || zr(i)) && (c = Qn(n)), ot(n))) {
    const g = $t(n);
    l = tr(n), u.x = g.x + n.clientLeft, u.y = g.y + n.clientTop;
  }
  const f = i && !d && !a ? _m(i, c) : rt(0);
  return {
    width: r.width * l.x,
    height: r.height * l.y,
    x: r.x * l.x - c.scrollLeft * l.x + u.x + f.x,
    y: r.y * l.y - c.scrollTop * l.y + u.y + f.y
  };
}
function S_(e) {
  return Array.from(e.getClientRects());
}
function C_(e) {
  const t = it(e), r = Qn(e), n = e.ownerDocument.body, o = Te(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), a = Te(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let i = -r.scrollLeft + Jn(e);
  const s = -r.scrollTop;
  return Ge(n).direction === "rtl" && (i += Te(t.clientWidth, n.clientWidth) - o), {
    width: o,
    height: a,
    x: i,
    y: s
  };
}
const vu = 25;
function O_(e, t) {
  const r = Re(e), n = it(e), o = r.visualViewport;
  let a = n.clientWidth, i = n.clientHeight, s = 0, c = 0;
  if (o) {
    a = o.width, i = o.height;
    const u = Gc();
    (!u || u && t === "fixed") && (s = o.offsetLeft, c = o.offsetTop);
  }
  const l = Jn(n);
  if (l <= 0) {
    const u = n.ownerDocument, d = u.body, f = getComputedStyle(d), g = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, b = Math.abs(n.clientWidth - d.clientWidth - g);
    b <= vu && (a -= b);
  } else l <= vu && (a += l);
  return {
    width: a,
    height: i,
    x: s,
    y: c
  };
}
const P_ = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function E_(e, t) {
  const r = $t(e, !0, t === "fixed"), n = r.top + e.clientTop, o = r.left + e.clientLeft, a = ot(e) ? tr(e) : rt(1), i = e.clientWidth * a.x, s = e.clientHeight * a.y, c = o * a.x, l = n * a.y;
  return {
    width: i,
    height: s,
    x: c,
    y: l
  };
}
function bu(e, t, r) {
  let n;
  if (t === "viewport")
    n = O_(e, r);
  else if (t === "document")
    n = C_(it(e));
  else if (Ve(t))
    n = E_(t, r);
  else {
    const o = xm(e);
    n = {
      x: t.x - o.x,
      y: t.y - o.y,
      width: t.width,
      height: t.height
    };
  }
  return Mn(n);
}
function Sm(e, t) {
  const r = _t(e);
  return r === t || !Ve(r) || rr(r) ? !1 : Ge(r).position === "fixed" || Sm(r, t);
}
function M_(e, t) {
  const r = t.get(e);
  if (r)
    return r;
  let n = Rr(e, [], !1).filter((s) => Ve(s) && hr(s) !== "body"), o = null;
  const a = Ge(e).position === "fixed";
  let i = a ? _t(e) : e;
  for (; Ve(i) && !rr(i); ) {
    const s = Ge(i), c = Vc(i);
    !c && s.position === "fixed" && (o = null), (a ? !c && !o : !c && s.position === "static" && !!o && P_.has(o.position) || zr(i) && !c && Sm(e, i)) ? n = n.filter((u) => u !== i) : o = s, i = _t(i);
  }
  return t.set(e, n), n;
}
function T_(e) {
  let {
    element: t,
    boundary: r,
    rootBoundary: n,
    strategy: o
  } = e;
  const i = [...r === "clippingAncestors" ? Zn(t) ? [] : M_(t, this._c) : [].concat(r), n], s = i[0], c = i.reduce((l, u) => {
    const d = bu(t, u, o);
    return l.top = Te(d.top, l.top), l.right = xt(d.right, l.right), l.bottom = xt(d.bottom, l.bottom), l.left = Te(d.left, l.left), l;
  }, bu(t, s, o));
  return {
    width: c.right - c.left,
    height: c.bottom - c.top,
    x: c.left,
    y: c.top
  };
}
function R_(e) {
  const {
    width: t,
    height: r
  } = wm(e);
  return {
    width: t,
    height: r
  };
}
function k_(e, t, r) {
  const n = ot(t), o = it(t), a = r === "fixed", i = $t(e, !0, a, t);
  let s = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const c = rt(0);
  function l() {
    c.x = Jn(o);
  }
  if (n || !n && !a)
    if ((hr(t) !== "body" || zr(o)) && (s = Qn(t)), n) {
      const g = $t(t, !0, a, t);
      c.x = g.x + t.clientLeft, c.y = g.y + t.clientTop;
    } else o && l();
  a && !n && o && l();
  const u = o && !n && !a ? _m(o, s) : rt(0), d = i.left + s.scrollLeft - c.x - u.x, f = i.top + s.scrollTop - c.y - u.y;
  return {
    x: d,
    y: f,
    width: i.width,
    height: i.height
  };
}
function Lo(e) {
  return Ge(e).position === "static";
}
function yu(e, t) {
  if (!ot(e) || Ge(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let r = e.offsetParent;
  return it(e) === r && (r = r.ownerDocument.body), r;
}
function Cm(e, t) {
  const r = Re(e);
  if (Zn(e))
    return r;
  if (!ot(e)) {
    let o = _t(e);
    for (; o && !rr(o); ) {
      if (Ve(o) && !Lo(o))
        return o;
      o = _t(o);
    }
    return r;
  }
  let n = yu(e, t);
  for (; n && p_(n) && Lo(n); )
    n = yu(n, t);
  return n && rr(n) && Lo(n) && !Vc(n) ? r : n || b_(e) || r;
}
const D_ = async function(e) {
  const t = this.getOffsetParent || Cm, r = this.getDimensions, n = await r(e.floating);
  return {
    reference: k_(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function N_(e) {
  return Ge(e).direction === "rtl";
}
const A_ = {
  convertOffsetParentRelativeRectToViewportRelativeRect: __,
  getDocumentElement: it,
  getClippingRect: T_,
  getOffsetParent: Cm,
  getElementRects: D_,
  getClientRects: S_,
  getDimensions: R_,
  getScale: tr,
  isElement: Ve,
  isRTL: N_
};
function Om(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function I_(e, t) {
  let r = null, n;
  const o = it(e);
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
      height: g
    } = l;
    if (s || t(), !f || !g)
      return;
    const b = dn(d), m = dn(o.clientWidth - (u + f)), h = dn(o.clientHeight - (d + g)), y = dn(u), x = {
      rootMargin: -b + "px " + -m + "px " + -h + "px " + -y + "px",
      threshold: Te(0, xt(1, c)) || 1
    };
    let _ = !0;
    function C(S) {
      const O = S[0].intersectionRatio;
      if (O !== c) {
        if (!_)
          return i();
        O ? i(!1, O) : n = setTimeout(() => {
          i(!1, 1e-7);
        }, 1e3);
      }
      O === 1 && !Om(l, e.getBoundingClientRect()) && i(), _ = !1;
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
function F_(e, t, r, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: a = !0,
    elementResize: i = typeof ResizeObserver == "function",
    layoutShift: s = typeof IntersectionObserver == "function",
    animationFrame: c = !1
  } = n, l = Uc(e), u = o || a ? [...l ? Rr(l) : [], ...Rr(t)] : [];
  u.forEach((y) => {
    o && y.addEventListener("scroll", r, {
      passive: !0
    }), a && y.addEventListener("resize", r);
  });
  const d = l && s ? I_(l, r) : null;
  let f = -1, g = null;
  i && (g = new ResizeObserver((y) => {
    let [w] = y;
    w && w.target === l && g && (g.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var x;
      (x = g) == null || x.observe(t);
    })), r();
  }), l && !c && g.observe(l), g.observe(t));
  let b, m = c ? $t(e) : null;
  c && h();
  function h() {
    const y = $t(e);
    m && !Om(m, y) && r(), m = y, b = requestAnimationFrame(h);
  }
  return r(), () => {
    var y;
    u.forEach((w) => {
      o && w.removeEventListener("scroll", r), a && w.removeEventListener("resize", r);
    }), d == null || d(), (y = g) == null || y.disconnect(), g = null, c && cancelAnimationFrame(b);
  };
}
const $_ = s_, B_ = c_, W_ = o_, q_ = u_, L_ = a_, wu = n_, j_ = l_, z_ = (e, t, r) => {
  const n = /* @__PURE__ */ new Map(), o = {
    platform: A_,
    ...r
  }, a = {
    ...o.platform,
    _c: n
  };
  return r_(e, t, {
    ...o,
    platform: a
  });
};
var H_ = typeof document < "u", Y_ = function() {
}, _n = H_ ? xh : Y_;
function Tn(e, t) {
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
        if (!Tn(e[n], t[n]))
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
      if (!(a === "_owner" && e.$$typeof) && !Tn(e[a], t[a]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function Pm(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function xu(e, t) {
  const r = Pm(e);
  return Math.round(t * r) / r;
}
function jo(e) {
  const t = p.useRef(e);
  return _n(() => {
    t.current = e;
  }), t;
}
function V_(e) {
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
  } = e, [u, d] = p.useState({
    x: 0,
    y: 0,
    strategy: r,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [f, g] = p.useState(n);
  Tn(f, n) || g(n);
  const [b, m] = p.useState(null), [h, y] = p.useState(null), w = p.useCallback((B) => {
    B !== S.current && (S.current = B, m(B));
  }, []), x = p.useCallback((B) => {
    B !== O.current && (O.current = B, y(B));
  }, []), _ = a || b, C = i || h, S = p.useRef(null), O = p.useRef(null), P = p.useRef(u), T = c != null, A = jo(c), k = jo(o), q = jo(l), D = p.useCallback(() => {
    if (!S.current || !O.current)
      return;
    const B = {
      placement: t,
      strategy: r,
      middleware: f
    };
    k.current && (B.platform = k.current), z_(S.current, O.current, B).then((N) => {
      const R = {
        ...N,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: q.current !== !1
      };
      F.current && !Tn(P.current, R) && (P.current = R, zn.flushSync(() => {
        d(R);
      }));
    });
  }, [f, t, r, k, q]);
  _n(() => {
    l === !1 && P.current.isPositioned && (P.current.isPositioned = !1, d((B) => ({
      ...B,
      isPositioned: !1
    })));
  }, [l]);
  const F = p.useRef(!1);
  _n(() => (F.current = !0, () => {
    F.current = !1;
  }), []), _n(() => {
    if (_ && (S.current = _), C && (O.current = C), _ && C) {
      if (A.current)
        return A.current(_, C, D);
      D();
    }
  }, [_, C, D, A, T]);
  const $ = p.useMemo(() => ({
    reference: S,
    floating: O,
    setReference: w,
    setFloating: x
  }), [w, x]), I = p.useMemo(() => ({
    reference: _,
    floating: C
  }), [_, C]), Y = p.useMemo(() => {
    const B = {
      position: r,
      left: 0,
      top: 0
    };
    if (!I.floating)
      return B;
    const N = xu(I.floating, u.x), R = xu(I.floating, u.y);
    return s ? {
      ...B,
      transform: "translate(" + N + "px, " + R + "px)",
      ...Pm(I.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: r,
      left: N,
      top: R
    };
  }, [r, s, I.floating, u.x, u.y]);
  return p.useMemo(() => ({
    ...u,
    update: D,
    refs: $,
    elements: I,
    floatingStyles: Y
  }), [u, D, $, I, Y]);
}
const G_ = (e) => {
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
      return n && t(n) ? n.current != null ? wu({
        element: n.current,
        padding: o
      }).fn(r) : {} : n ? wu({
        element: n,
        padding: o
      }).fn(r) : {};
    }
  };
}, U_ = (e, t) => ({
  ...$_(e),
  options: [e, t]
}), K_ = (e, t) => ({
  ...B_(e),
  options: [e, t]
}), X_ = (e, t) => ({
  ...j_(e),
  options: [e, t]
}), Z_ = (e, t) => ({
  ...W_(e),
  options: [e, t]
}), Q_ = (e, t) => ({
  ...q_(e),
  options: [e, t]
}), J_ = (e, t) => ({
  ...L_(e),
  options: [e, t]
}), eS = (e, t) => ({
  ...G_(e),
  options: [e, t]
});
var tS = "Arrow", Em = p.forwardRef((e, t) => {
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
Em.displayName = tS;
var rS = Em, Kc = "Popper", [Mm, St] = Le(Kc), [nS, Tm] = Mm(Kc), Rm = (e) => {
  const { __scopePopper: t, children: r } = e, [n, o] = p.useState(null);
  return /* @__PURE__ */ v(nS, { scope: t, anchor: n, onAnchorChange: o, children: r });
};
Rm.displayName = Kc;
var km = "PopperAnchor", Dm = p.forwardRef(
  (e, t) => {
    const { __scopePopper: r, virtualRef: n, ...o } = e, a = Tm(km, r), i = p.useRef(null), s = ie(t, i), c = p.useRef(null);
    return p.useEffect(() => {
      const l = c.current;
      c.current = (n == null ? void 0 : n.current) || i.current, l !== c.current && a.onAnchorChange(c.current);
    }), n ? null : /* @__PURE__ */ v(K.div, { ...o, ref: s });
  }
);
Dm.displayName = km;
var Xc = "PopperContent", [oS, aS] = Mm(Xc), Nm = p.forwardRef(
  (e, t) => {
    var z, re, G, Q, ee, te;
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
      updatePositionStrategy: g = "optimized",
      onPlaced: b,
      ...m
    } = e, h = Tm(Xc, r), [y, w] = p.useState(null), x = ie(t, (be) => w(be)), [_, C] = p.useState(null), S = mm(_), O = (S == null ? void 0 : S.width) ?? 0, P = (S == null ? void 0 : S.height) ?? 0, T = n + (a !== "center" ? "-" + a : ""), A = typeof u == "number" ? u : { top: 0, right: 0, bottom: 0, left: 0, ...u }, k = Array.isArray(l) ? l : [l], q = k.length > 0, D = {
      padding: A,
      boundary: k.filter(sS),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: q
    }, { refs: F, floatingStyles: $, placement: I, isPositioned: Y, middlewareData: B } = V_({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: T,
      whileElementsMounted: (...be) => F_(...be, {
        animationFrame: g === "always"
      }),
      elements: {
        reference: h.anchor
      },
      middleware: [
        U_({ mainAxis: o + P, alignmentAxis: i }),
        c && K_({
          mainAxis: !0,
          crossAxis: !1,
          limiter: d === "partial" ? X_() : void 0,
          ...D
        }),
        c && Z_({ ...D }),
        Q_({
          ...D,
          apply: ({ elements: be, rects: L, availableWidth: Ne, availableHeight: Ae }) => {
            const { width: Ze, height: Eo } = L.reference, Vt = be.floating.style;
            Vt.setProperty("--radix-popper-available-width", `${Ne}px`), Vt.setProperty("--radix-popper-available-height", `${Ae}px`), Vt.setProperty("--radix-popper-anchor-width", `${Ze}px`), Vt.setProperty("--radix-popper-anchor-height", `${Eo}px`);
          }
        }),
        _ && eS({ element: _, padding: s }),
        cS({ arrowWidth: O, arrowHeight: P }),
        f && J_({ strategy: "referenceHidden", ...D })
      ]
    }), [N, R] = Fm(I), X = qe(b);
    xe(() => {
      Y && (X == null || X());
    }, [Y, X]);
    const le = (z = B.arrow) == null ? void 0 : z.x, me = (re = B.arrow) == null ? void 0 : re.y, ge = ((G = B.arrow) == null ? void 0 : G.centerOffset) !== 0, [se, ne] = p.useState();
    return xe(() => {
      y && ne(window.getComputedStyle(y).zIndex);
    }, [y]), /* @__PURE__ */ v(
      "div",
      {
        ref: F.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...$,
          transform: Y ? $.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: se,
          "--radix-popper-transform-origin": [
            (Q = B.transformOrigin) == null ? void 0 : Q.x,
            (ee = B.transformOrigin) == null ? void 0 : ee.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((te = B.hide) == null ? void 0 : te.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ v(
          oS,
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
                "data-align": R,
                ...m,
                ref: x,
                style: {
                  ...m.style,
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
Nm.displayName = Xc;
var Am = "PopperArrow", iS = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, Im = p.forwardRef(function(t, r) {
  const { __scopePopper: n, ...o } = t, a = aS(Am, n), i = iS[a.placedSide];
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
          rS,
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
Im.displayName = Am;
function sS(e) {
  return e !== null;
}
var cS = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var h, y, w;
    const { placement: r, rects: n, middlewareData: o } = t, i = ((h = o.arrow) == null ? void 0 : h.centerOffset) !== 0, s = i ? 0 : e.arrowWidth, c = i ? 0 : e.arrowHeight, [l, u] = Fm(r), d = { start: "0%", center: "50%", end: "100%" }[u], f = (((y = o.arrow) == null ? void 0 : y.x) ?? 0) + s / 2, g = (((w = o.arrow) == null ? void 0 : w.y) ?? 0) + c / 2;
    let b = "", m = "";
    return l === "bottom" ? (b = i ? d : `${f}px`, m = `${-c}px`) : l === "top" ? (b = i ? d : `${f}px`, m = `${n.floating.height + c}px`) : l === "right" ? (b = `${-c}px`, m = i ? d : `${g}px`) : l === "left" && (b = `${n.floating.width + c}px`, m = i ? d : `${g}px`), { data: { x: b, y: m } };
  }
});
function Fm(e) {
  const [t, r = "center"] = e.split("-");
  return [t, r];
}
var Hr = Rm, Yr = Dm, eo = Nm, to = Im, zo = "rovingFocusGroup.onEntryFocus", lS = { bubbles: !1, cancelable: !0 }, Vr = "RovingFocusGroup", [cc, $m, uS] = $c(Vr), [dS, ro] = Le(
  Vr,
  [uS]
), [fS, pS] = dS(Vr), Bm = p.forwardRef(
  (e, t) => /* @__PURE__ */ v(cc.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ v(cc.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ v(hS, { ...e, ref: t }) }) })
);
Bm.displayName = Vr;
var hS = p.forwardRef((e, t) => {
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
  } = e, f = p.useRef(null), g = ie(t, f), b = Yn(a), [m, h] = nt({
    prop: i,
    defaultProp: s ?? null,
    onChange: c,
    caller: Vr
  }), [y, w] = p.useState(!1), x = qe(l), _ = $m(r), C = p.useRef(!1), [S, O] = p.useState(0);
  return p.useEffect(() => {
    const P = f.current;
    if (P)
      return P.addEventListener(zo, x), () => P.removeEventListener(zo, x);
  }, [x]), /* @__PURE__ */ v(
    fS,
    {
      scope: r,
      orientation: n,
      dir: b,
      loop: o,
      currentTabStopId: m,
      onItemFocus: p.useCallback(
        (P) => h(P),
        [h]
      ),
      onItemShiftTab: p.useCallback(() => w(!0), []),
      onFocusableItemAdd: p.useCallback(
        () => O((P) => P + 1),
        []
      ),
      onFocusableItemRemove: p.useCallback(
        () => O((P) => P - 1),
        []
      ),
      children: /* @__PURE__ */ v(
        K.div,
        {
          tabIndex: y || S === 0 ? -1 : 0,
          "data-orientation": n,
          ...d,
          ref: g,
          style: { outline: "none", ...e.style },
          onMouseDown: W(e.onMouseDown, () => {
            C.current = !0;
          }),
          onFocus: W(e.onFocus, (P) => {
            const T = !C.current;
            if (P.target === P.currentTarget && T && !y) {
              const A = new CustomEvent(zo, lS);
              if (P.currentTarget.dispatchEvent(A), !A.defaultPrevented) {
                const k = _().filter((I) => I.focusable), q = k.find((I) => I.active), D = k.find((I) => I.id === m), $ = [q, D, ...k].filter(
                  Boolean
                ).map((I) => I.ref.current);
                Lm($, u);
              }
            }
            C.current = !1;
          }),
          onBlur: W(e.onBlur, () => w(!1))
        }
      )
    }
  );
}), Wm = "RovingFocusGroupItem", qm = p.forwardRef(
  (e, t) => {
    const {
      __scopeRovingFocusGroup: r,
      focusable: n = !0,
      active: o = !1,
      tabStopId: a,
      children: i,
      ...s
    } = e, c = Oe(), l = a || c, u = pS(Wm, r), d = u.currentTabStopId === l, f = $m(r), { onFocusableItemAdd: g, onFocusableItemRemove: b, currentTabStopId: m } = u;
    return p.useEffect(() => {
      if (n)
        return g(), () => b();
    }, [n, g, b]), /* @__PURE__ */ v(
      cc.ItemSlot,
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
            onMouseDown: W(e.onMouseDown, (h) => {
              n ? u.onItemFocus(l) : h.preventDefault();
            }),
            onFocus: W(e.onFocus, () => u.onItemFocus(l)),
            onKeyDown: W(e.onKeyDown, (h) => {
              if (h.key === "Tab" && h.shiftKey) {
                u.onItemShiftTab();
                return;
              }
              if (h.target !== h.currentTarget) return;
              const y = vS(h, u.orientation, u.dir);
              if (y !== void 0) {
                if (h.metaKey || h.ctrlKey || h.altKey || h.shiftKey) return;
                h.preventDefault();
                let x = f().filter((_) => _.focusable).map((_) => _.ref.current);
                if (y === "last") x.reverse();
                else if (y === "prev" || y === "next") {
                  y === "prev" && x.reverse();
                  const _ = x.indexOf(h.currentTarget);
                  x = u.loop ? bS(x, _ + 1) : x.slice(_ + 1);
                }
                setTimeout(() => Lm(x));
              }
            }),
            children: typeof i == "function" ? i({ isCurrentTabStop: d, hasTabStop: m != null }) : i
          }
        )
      }
    );
  }
);
qm.displayName = Wm;
var mS = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function gS(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function vS(e, t, r) {
  const n = gS(e.key, r);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(n)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(n)))
    return mS[n];
}
function Lm(e, t = !1) {
  const r = document.activeElement;
  for (const n of e)
    if (n === r || (n.focus({ preventScroll: t }), document.activeElement !== r)) return;
}
function bS(e, t) {
  return e.map((r, n) => e[(t + n) % e.length]);
}
var jm = Bm, zm = qm, lc = ["Enter", " "], yS = ["ArrowDown", "PageUp", "Home"], Hm = ["ArrowUp", "PageDown", "End"], wS = [...yS, ...Hm], xS = {
  ltr: [...lc, "ArrowRight"],
  rtl: [...lc, "ArrowLeft"]
}, _S = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
}, Gr = "Menu", [kr, SS, CS] = $c(Gr), [Lt, Ym] = Le(Gr, [
  CS,
  St,
  ro
]), Ur = St(), Vm = ro(), [Gm, Ct] = Lt(Gr), [OS, Kr] = Lt(Gr), Um = (e) => {
  const { __scopeMenu: t, open: r = !1, children: n, dir: o, onOpenChange: a, modal: i = !0 } = e, s = Ur(t), [c, l] = p.useState(null), u = p.useRef(!1), d = qe(a), f = Yn(o);
  return p.useEffect(() => {
    const g = () => {
      u.current = !0, document.addEventListener("pointerdown", b, { capture: !0, once: !0 }), document.addEventListener("pointermove", b, { capture: !0, once: !0 });
    }, b = () => u.current = !1;
    return document.addEventListener("keydown", g, { capture: !0 }), () => {
      document.removeEventListener("keydown", g, { capture: !0 }), document.removeEventListener("pointerdown", b, { capture: !0 }), document.removeEventListener("pointermove", b, { capture: !0 });
    };
  }, []), /* @__PURE__ */ v(Hr, { ...s, children: /* @__PURE__ */ v(
    Gm,
    {
      scope: t,
      open: r,
      onOpenChange: d,
      content: c,
      onContentChange: l,
      children: /* @__PURE__ */ v(
        OS,
        {
          scope: t,
          onClose: p.useCallback(() => d(!1), [d]),
          isUsingKeyboardRef: u,
          dir: f,
          modal: i,
          children: n
        }
      )
    }
  ) });
};
Um.displayName = Gr;
var PS = "MenuAnchor", Zc = p.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, ...n } = e, o = Ur(r);
    return /* @__PURE__ */ v(Yr, { ...o, ...n, ref: t });
  }
);
Zc.displayName = PS;
var Qc = "MenuPortal", [ES, Km] = Lt(Qc, {
  forceMount: void 0
}), Xm = (e) => {
  const { __scopeMenu: t, forceMount: r, children: n, container: o } = e, a = Ct(Qc, t);
  return /* @__PURE__ */ v(ES, { scope: t, forceMount: r, children: /* @__PURE__ */ v(De, { present: r || a.open, children: /* @__PURE__ */ v(fr, { asChild: !0, container: o, children: n }) }) });
};
Xm.displayName = Qc;
var We = "MenuContent", [MS, Jc] = Lt(We), Zm = p.forwardRef(
  (e, t) => {
    const r = Km(We, e.__scopeMenu), { forceMount: n = r.forceMount, ...o } = e, a = Ct(We, e.__scopeMenu), i = Kr(We, e.__scopeMenu);
    return /* @__PURE__ */ v(kr.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ v(De, { present: n || a.open, children: /* @__PURE__ */ v(kr.Slot, { scope: e.__scopeMenu, children: i.modal ? /* @__PURE__ */ v(TS, { ...o, ref: t }) : /* @__PURE__ */ v(RS, { ...o, ref: t }) }) }) });
  }
), TS = p.forwardRef(
  (e, t) => {
    const r = Ct(We, e.__scopeMenu), n = p.useRef(null), o = ie(t, n);
    return p.useEffect(() => {
      const a = n.current;
      if (a) return Un(a);
    }, []), /* @__PURE__ */ v(
      el,
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
), RS = p.forwardRef((e, t) => {
  const r = Ct(We, e.__scopeMenu);
  return /* @__PURE__ */ v(
    el,
    {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => r.onOpenChange(!1)
    }
  );
}), kS = /* @__PURE__ */ wt("MenuContent.ScrollLock"), el = p.forwardRef(
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
      onDismiss: g,
      disableOutsideScroll: b,
      ...m
    } = e, h = Ct(We, r), y = Kr(We, r), w = Ur(r), x = Vm(r), _ = SS(r), [C, S] = p.useState(null), O = p.useRef(null), P = ie(t, O, h.onContentChange), T = p.useRef(0), A = p.useRef(""), k = p.useRef(0), q = p.useRef(null), D = p.useRef("right"), F = p.useRef(0), $ = b ? jr : p.Fragment, I = b ? { as: kS, allowPinchZoom: !0 } : void 0, Y = (N) => {
      var z, re;
      const R = A.current + N, X = _().filter((G) => !G.disabled), le = document.activeElement, me = (z = X.find((G) => G.ref.current === le)) == null ? void 0 : z.textValue, ge = X.map((G) => G.textValue), se = zS(ge, R, me), ne = (re = X.find((G) => G.textValue === se)) == null ? void 0 : re.ref.current;
      (function G(Q) {
        A.current = Q, window.clearTimeout(T.current), Q !== "" && (T.current = window.setTimeout(() => G(""), 1e3));
      })(R), ne && setTimeout(() => ne.focus());
    };
    p.useEffect(() => () => window.clearTimeout(T.current), []), Vn();
    const B = p.useCallback((N) => {
      var X, le;
      return D.current === ((X = q.current) == null ? void 0 : X.side) && YS(N, (le = q.current) == null ? void 0 : le.area);
    }, []);
    return /* @__PURE__ */ v(
      MS,
      {
        scope: r,
        searchRef: A,
        onItemEnter: p.useCallback(
          (N) => {
            B(N) && N.preventDefault();
          },
          [B]
        ),
        onItemLeave: p.useCallback(
          (N) => {
            var R;
            B(N) || ((R = O.current) == null || R.focus(), S(null));
          },
          [B]
        ),
        onTriggerLeave: p.useCallback(
          (N) => {
            B(N) && N.preventDefault();
          },
          [B]
        ),
        pointerGraceTimerRef: k,
        onPointerGraceIntentChange: p.useCallback((N) => {
          q.current = N;
        }, []),
        children: /* @__PURE__ */ v($, { ...I, children: /* @__PURE__ */ v(
          Lr,
          {
            asChild: !0,
            trapped: o,
            onMountAutoFocus: W(a, (N) => {
              var R;
              N.preventDefault(), (R = O.current) == null || R.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: i,
            children: /* @__PURE__ */ v(
              dr,
              {
                asChild: !0,
                disableOutsidePointerEvents: s,
                onEscapeKeyDown: l,
                onPointerDownOutside: u,
                onFocusOutside: d,
                onInteractOutside: f,
                onDismiss: g,
                children: /* @__PURE__ */ v(
                  jm,
                  {
                    asChild: !0,
                    ...x,
                    dir: y.dir,
                    orientation: "vertical",
                    loop: n,
                    currentTabStopId: C,
                    onCurrentTabStopIdChange: S,
                    onEntryFocus: W(c, (N) => {
                      y.isUsingKeyboardRef.current || N.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ v(
                      eo,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": hg(h.open),
                        "data-radix-menu-content": "",
                        dir: y.dir,
                        ...w,
                        ...m,
                        ref: P,
                        style: { outline: "none", ...m.style },
                        onKeyDown: W(m.onKeyDown, (N) => {
                          const X = N.target.closest("[data-radix-menu-content]") === N.currentTarget, le = N.ctrlKey || N.altKey || N.metaKey, me = N.key.length === 1;
                          X && (N.key === "Tab" && N.preventDefault(), !le && me && Y(N.key));
                          const ge = O.current;
                          if (N.target !== ge || !wS.includes(N.key)) return;
                          N.preventDefault();
                          const ne = _().filter((z) => !z.disabled).map((z) => z.ref.current);
                          Hm.includes(N.key) && ne.reverse(), LS(ne);
                        }),
                        onBlur: W(e.onBlur, (N) => {
                          N.currentTarget.contains(N.target) || (window.clearTimeout(T.current), A.current = "");
                        }),
                        onPointerMove: W(
                          e.onPointerMove,
                          Dr((N) => {
                            const R = N.target, X = F.current !== N.clientX;
                            if (N.currentTarget.contains(R) && X) {
                              const le = N.clientX > F.current ? "right" : "left";
                              D.current = le, F.current = N.clientX;
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
Zm.displayName = We;
var DS = "MenuGroup", tl = p.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, ...n } = e;
    return /* @__PURE__ */ v(K.div, { role: "group", ...n, ref: t });
  }
);
tl.displayName = DS;
var NS = "MenuLabel", Qm = p.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, ...n } = e;
    return /* @__PURE__ */ v(K.div, { ...n, ref: t });
  }
);
Qm.displayName = NS;
var Rn = "MenuItem", _u = "menu.itemSelect", no = p.forwardRef(
  (e, t) => {
    const { disabled: r = !1, onSelect: n, ...o } = e, a = p.useRef(null), i = Kr(Rn, e.__scopeMenu), s = Jc(Rn, e.__scopeMenu), c = ie(t, a), l = p.useRef(!1), u = () => {
      const d = a.current;
      if (!r && d) {
        const f = new CustomEvent(_u, { bubbles: !0, cancelable: !0 });
        d.addEventListener(_u, (g) => n == null ? void 0 : n(g), { once: !0 }), Oh(d, f), f.defaultPrevented ? l.current = !1 : i.onClose();
      }
    };
    return /* @__PURE__ */ v(
      Jm,
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
          r || f && d.key === " " || lc.includes(d.key) && (d.currentTarget.click(), d.preventDefault());
        })
      }
    );
  }
);
no.displayName = Rn;
var Jm = p.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, disabled: n = !1, textValue: o, ...a } = e, i = Jc(Rn, r), s = Vm(r), c = p.useRef(null), l = ie(t, c), [u, d] = p.useState(!1), [f, g] = p.useState("");
    return p.useEffect(() => {
      const b = c.current;
      b && g((b.textContent ?? "").trim());
    }, [a.children]), /* @__PURE__ */ v(
      kr.ItemSlot,
      {
        scope: r,
        disabled: n,
        textValue: o ?? f,
        children: /* @__PURE__ */ v(zm, { asChild: !0, ...s, focusable: !n, children: /* @__PURE__ */ v(
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
              Dr((b) => {
                n ? i.onItemLeave(b) : (i.onItemEnter(b), b.defaultPrevented || b.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: W(
              e.onPointerLeave,
              Dr((b) => i.onItemLeave(b))
            ),
            onFocus: W(e.onFocus, () => d(!0)),
            onBlur: W(e.onBlur, () => d(!1))
          }
        ) })
      }
    );
  }
), AS = "MenuCheckboxItem", eg = p.forwardRef(
  (e, t) => {
    const { checked: r = !1, onCheckedChange: n, ...o } = e;
    return /* @__PURE__ */ v(ag, { scope: e.__scopeMenu, checked: r, children: /* @__PURE__ */ v(
      no,
      {
        role: "menuitemcheckbox",
        "aria-checked": kn(r) ? "mixed" : r,
        ...o,
        ref: t,
        "data-state": ol(r),
        onSelect: W(
          o.onSelect,
          () => n == null ? void 0 : n(kn(r) ? !0 : !r),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
eg.displayName = AS;
var tg = "MenuRadioGroup", [IS, FS] = Lt(
  tg,
  { value: void 0, onValueChange: () => {
  } }
), rg = p.forwardRef(
  (e, t) => {
    const { value: r, onValueChange: n, ...o } = e, a = qe(n);
    return /* @__PURE__ */ v(IS, { scope: e.__scopeMenu, value: r, onValueChange: a, children: /* @__PURE__ */ v(tl, { ...o, ref: t }) });
  }
);
rg.displayName = tg;
var ng = "MenuRadioItem", og = p.forwardRef(
  (e, t) => {
    const { value: r, ...n } = e, o = FS(ng, e.__scopeMenu), a = r === o.value;
    return /* @__PURE__ */ v(ag, { scope: e.__scopeMenu, checked: a, children: /* @__PURE__ */ v(
      no,
      {
        role: "menuitemradio",
        "aria-checked": a,
        ...n,
        ref: t,
        "data-state": ol(a),
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
og.displayName = ng;
var rl = "MenuItemIndicator", [ag, $S] = Lt(
  rl,
  { checked: !1 }
), ig = p.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, forceMount: n, ...o } = e, a = $S(rl, r);
    return /* @__PURE__ */ v(
      De,
      {
        present: n || kn(a.checked) || a.checked === !0,
        children: /* @__PURE__ */ v(
          K.span,
          {
            ...o,
            ref: t,
            "data-state": ol(a.checked)
          }
        )
      }
    );
  }
);
ig.displayName = rl;
var BS = "MenuSeparator", sg = p.forwardRef(
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
sg.displayName = BS;
var WS = "MenuArrow", cg = p.forwardRef(
  (e, t) => {
    const { __scopeMenu: r, ...n } = e, o = Ur(r);
    return /* @__PURE__ */ v(to, { ...o, ...n, ref: t });
  }
);
cg.displayName = WS;
var nl = "MenuSub", [qS, lg] = Lt(nl), ug = (e) => {
  const { __scopeMenu: t, children: r, open: n = !1, onOpenChange: o } = e, a = Ct(nl, t), i = Ur(t), [s, c] = p.useState(null), [l, u] = p.useState(null), d = qe(o);
  return p.useEffect(() => (a.open === !1 && d(!1), () => d(!1)), [a.open, d]), /* @__PURE__ */ v(Hr, { ...i, children: /* @__PURE__ */ v(
    Gm,
    {
      scope: t,
      open: n,
      onOpenChange: d,
      content: l,
      onContentChange: u,
      children: /* @__PURE__ */ v(
        qS,
        {
          scope: t,
          contentId: Oe(),
          triggerId: Oe(),
          trigger: s,
          onTriggerChange: c,
          children: r
        }
      )
    }
  ) });
};
ug.displayName = nl;
var xr = "MenuSubTrigger", dg = p.forwardRef(
  (e, t) => {
    const r = Ct(xr, e.__scopeMenu), n = Kr(xr, e.__scopeMenu), o = lg(xr, e.__scopeMenu), a = Jc(xr, e.__scopeMenu), i = p.useRef(null), { pointerGraceTimerRef: s, onPointerGraceIntentChange: c } = a, l = { __scopeMenu: e.__scopeMenu }, u = p.useCallback(() => {
      i.current && window.clearTimeout(i.current), i.current = null;
    }, []);
    return p.useEffect(() => u, [u]), p.useEffect(() => {
      const d = s.current;
      return () => {
        window.clearTimeout(d), c(null);
      };
    }, [s, c]), /* @__PURE__ */ v(Zc, { asChild: !0, ...l, children: /* @__PURE__ */ v(
      Jm,
      {
        id: o.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": r.open,
        "aria-controls": o.contentId,
        "data-state": hg(r.open),
        ...e,
        ref: Hn(t, o.onTriggerChange),
        onClick: (d) => {
          var f;
          (f = e.onClick) == null || f.call(e, d), !(e.disabled || d.defaultPrevented) && (d.currentTarget.focus(), r.open || r.onOpenChange(!0));
        },
        onPointerMove: W(
          e.onPointerMove,
          Dr((d) => {
            a.onItemEnter(d), !d.defaultPrevented && !e.disabled && !r.open && !i.current && (a.onPointerGraceIntentChange(null), i.current = window.setTimeout(() => {
              r.onOpenChange(!0), u();
            }, 100));
          })
        ),
        onPointerLeave: W(
          e.onPointerLeave,
          Dr((d) => {
            var g, b;
            u();
            const f = (g = r.content) == null ? void 0 : g.getBoundingClientRect();
            if (f) {
              const m = (b = r.content) == null ? void 0 : b.dataset.side, h = m === "right", y = h ? -5 : 5, w = f[h ? "left" : "right"], x = f[h ? "right" : "left"];
              a.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: d.clientX + y, y: d.clientY },
                  { x: w, y: f.top },
                  { x, y: f.top },
                  { x, y: f.bottom },
                  { x: w, y: f.bottom }
                ],
                side: m
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
          var g;
          const f = a.searchRef.current !== "";
          e.disabled || f && d.key === " " || xS[n.dir].includes(d.key) && (r.onOpenChange(!0), (g = r.content) == null || g.focus(), d.preventDefault());
        })
      }
    ) });
  }
);
dg.displayName = xr;
var fg = "MenuSubContent", pg = p.forwardRef(
  (e, t) => {
    const r = Km(We, e.__scopeMenu), { forceMount: n = r.forceMount, ...o } = e, a = Ct(We, e.__scopeMenu), i = Kr(We, e.__scopeMenu), s = lg(fg, e.__scopeMenu), c = p.useRef(null), l = ie(t, c);
    return /* @__PURE__ */ v(kr.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ v(De, { present: n || a.open, children: /* @__PURE__ */ v(kr.Slot, { scope: e.__scopeMenu, children: /* @__PURE__ */ v(
      el,
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
          var g;
          const d = u.currentTarget.contains(u.target), f = _S[i.dir].includes(u.key);
          d && f && (a.onOpenChange(!1), (g = s.trigger) == null || g.focus(), u.preventDefault());
        })
      }
    ) }) }) });
  }
);
pg.displayName = fg;
function hg(e) {
  return e ? "open" : "closed";
}
function kn(e) {
  return e === "indeterminate";
}
function ol(e) {
  return kn(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function LS(e) {
  const t = document.activeElement;
  for (const r of e)
    if (r === t || (r.focus(), document.activeElement !== t)) return;
}
function jS(e, t) {
  return e.map((r, n) => e[(t + n) % e.length]);
}
function zS(e, t, r) {
  const o = t.length > 1 && Array.from(t).every((l) => l === t[0]) ? t[0] : t, a = r ? e.indexOf(r) : -1;
  let i = jS(e, Math.max(a, 0));
  o.length === 1 && (i = i.filter((l) => l !== r));
  const c = i.find(
    (l) => l.toLowerCase().startsWith(o.toLowerCase())
  );
  return c !== r ? c : void 0;
}
function HS(e, t) {
  const { x: r, y: n } = e;
  let o = !1;
  for (let a = 0, i = t.length - 1; a < t.length; i = a++) {
    const s = t[a], c = t[i], l = s.x, u = s.y, d = c.x, f = c.y;
    u > n != f > n && r < (d - l) * (n - u) / (f - u) + l && (o = !o);
  }
  return o;
}
function YS(e, t) {
  if (!t) return !1;
  const r = { x: e.clientX, y: e.clientY };
  return HS(r, t);
}
function Dr(e) {
  return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
var VS = Um, GS = Zc, US = Xm, KS = Zm, XS = tl, ZS = Qm, QS = no, JS = eg, eC = rg, tC = og, rC = ig, nC = sg, oC = cg, aC = ug, iC = dg, sC = pg, oo = "DropdownMenu", [cC] = Le(
  oo,
  [Ym]
), Se = Ym(), [lC, mg] = cC(oo), gg = (e) => {
  const {
    __scopeDropdownMenu: t,
    children: r,
    dir: n,
    open: o,
    defaultOpen: a,
    onOpenChange: i,
    modal: s = !0
  } = e, c = Se(t), l = p.useRef(null), [u, d] = nt({
    prop: o,
    defaultProp: a ?? !1,
    onChange: i,
    caller: oo
  });
  return /* @__PURE__ */ v(
    lC,
    {
      scope: t,
      triggerId: Oe(),
      triggerRef: l,
      contentId: Oe(),
      open: u,
      onOpenChange: d,
      onOpenToggle: p.useCallback(() => d((f) => !f), [d]),
      modal: s,
      children: /* @__PURE__ */ v(VS, { ...c, open: u, onOpenChange: d, dir: n, modal: s, children: r })
    }
  );
};
gg.displayName = oo;
var vg = "DropdownMenuTrigger", bg = p.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, disabled: n = !1, ...o } = e, a = mg(vg, r), i = Se(r);
    return /* @__PURE__ */ v(GS, { asChild: !0, ...i, children: /* @__PURE__ */ v(
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
        ref: Hn(t, a.triggerRef),
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
bg.displayName = vg;
var uC = "DropdownMenuPortal", yg = (e) => {
  const { __scopeDropdownMenu: t, ...r } = e, n = Se(t);
  return /* @__PURE__ */ v(US, { ...n, ...r });
};
yg.displayName = uC;
var wg = "DropdownMenuContent", xg = p.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e, o = mg(wg, r), a = Se(r), i = p.useRef(!1);
    return /* @__PURE__ */ v(
      KS,
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
xg.displayName = wg;
var dC = "DropdownMenuGroup", _g = p.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
    return /* @__PURE__ */ v(XS, { ...o, ...n, ref: t });
  }
);
_g.displayName = dC;
var fC = "DropdownMenuLabel", Sg = p.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
    return /* @__PURE__ */ v(ZS, { ...o, ...n, ref: t });
  }
);
Sg.displayName = fC;
var pC = "DropdownMenuItem", Cg = p.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
    return /* @__PURE__ */ v(QS, { ...o, ...n, ref: t });
  }
);
Cg.displayName = pC;
var hC = "DropdownMenuCheckboxItem", Og = p.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(JS, { ...o, ...n, ref: t });
});
Og.displayName = hC;
var mC = "DropdownMenuRadioGroup", Pg = p.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(eC, { ...o, ...n, ref: t });
});
Pg.displayName = mC;
var gC = "DropdownMenuRadioItem", Eg = p.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(tC, { ...o, ...n, ref: t });
});
Eg.displayName = gC;
var vC = "DropdownMenuItemIndicator", Mg = p.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(rC, { ...o, ...n, ref: t });
});
Mg.displayName = vC;
var bC = "DropdownMenuSeparator", Tg = p.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(nC, { ...o, ...n, ref: t });
});
Tg.displayName = bC;
var yC = "DropdownMenuArrow", wC = p.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
    return /* @__PURE__ */ v(oC, { ...o, ...n, ref: t });
  }
);
wC.displayName = yC;
var xC = (e) => {
  const { __scopeDropdownMenu: t, children: r, open: n, onOpenChange: o, defaultOpen: a } = e, i = Se(t), [s, c] = nt({
    prop: n,
    defaultProp: a ?? !1,
    onChange: o,
    caller: "DropdownMenuSub"
  });
  return /* @__PURE__ */ v(aC, { ...i, open: s, onOpenChange: c, children: r });
}, _C = "DropdownMenuSubTrigger", Rg = p.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(iC, { ...o, ...n, ref: t });
});
Rg.displayName = _C;
var SC = "DropdownMenuSubContent", kg = p.forwardRef((e, t) => {
  const { __scopeDropdownMenu: r, ...n } = e, o = Se(r);
  return /* @__PURE__ */ v(
    sC,
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
kg.displayName = SC;
var CC = gg, OC = bg, PC = yg, EC = xg, MC = _g, TC = Sg, RC = Cg, kC = Og, DC = Pg, NC = Eg, Dg = Mg, AC = Tg, IC = xC, FC = Rg, $C = kg, BC = "Label", Ng = p.forwardRef((e, t) => /* @__PURE__ */ v(
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
Ng.displayName = BC;
var WC = Ng;
function Su(e, [t, r]) {
  return Math.min(r, Math.max(t, e));
}
var ao = "Popover", [Ag] = Le(ao, [
  St
]), Xr = St(), [qC, Ot] = Ag(ao), Ig = (e) => {
  const {
    __scopePopover: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: a,
    modal: i = !1
  } = e, s = Xr(t), c = p.useRef(null), [l, u] = p.useState(!1), [d, f] = nt({
    prop: n,
    defaultProp: o ?? !1,
    onChange: a,
    caller: ao
  });
  return /* @__PURE__ */ v(Hr, { ...s, children: /* @__PURE__ */ v(
    qC,
    {
      scope: t,
      contentId: Oe(),
      triggerRef: c,
      open: d,
      onOpenChange: f,
      onOpenToggle: p.useCallback(() => f((g) => !g), [f]),
      hasCustomAnchor: l,
      onCustomAnchorAdd: p.useCallback(() => u(!0), []),
      onCustomAnchorRemove: p.useCallback(() => u(!1), []),
      modal: i,
      children: r
    }
  ) });
};
Ig.displayName = ao;
var Fg = "PopoverAnchor", LC = p.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Ot(Fg, r), a = Xr(r), { onCustomAnchorAdd: i, onCustomAnchorRemove: s } = o;
    return p.useEffect(() => (i(), () => s()), [i, s]), /* @__PURE__ */ v(Yr, { ...a, ...n, ref: t });
  }
);
LC.displayName = Fg;
var $g = "PopoverTrigger", Bg = p.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Ot($g, r), a = Xr(r), i = ie(t, o.triggerRef), s = /* @__PURE__ */ v(
      K.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": zg(o.open),
        ...n,
        ref: i,
        onClick: W(e.onClick, o.onOpenToggle)
      }
    );
    return o.hasCustomAnchor ? s : /* @__PURE__ */ v(Yr, { asChild: !0, ...a, children: s });
  }
);
Bg.displayName = $g;
var al = "PopoverPortal", [jC, zC] = Ag(al, {
  forceMount: void 0
}), Wg = (e) => {
  const { __scopePopover: t, forceMount: r, children: n, container: o } = e, a = Ot(al, t);
  return /* @__PURE__ */ v(jC, { scope: t, forceMount: r, children: /* @__PURE__ */ v(De, { present: r || a.open, children: /* @__PURE__ */ v(fr, { asChild: !0, container: o, children: n }) }) });
};
Wg.displayName = al;
var nr = "PopoverContent", qg = p.forwardRef(
  (e, t) => {
    const r = zC(nr, e.__scopePopover), { forceMount: n = r.forceMount, ...o } = e, a = Ot(nr, e.__scopePopover);
    return /* @__PURE__ */ v(De, { present: n || a.open, children: a.modal ? /* @__PURE__ */ v(YC, { ...o, ref: t }) : /* @__PURE__ */ v(VC, { ...o, ref: t }) });
  }
);
qg.displayName = nr;
var HC = /* @__PURE__ */ wt("PopoverContent.RemoveScroll"), YC = p.forwardRef(
  (e, t) => {
    const r = Ot(nr, e.__scopePopover), n = p.useRef(null), o = ie(t, n), a = p.useRef(!1);
    return p.useEffect(() => {
      const i = n.current;
      if (i) return Un(i);
    }, []), /* @__PURE__ */ v(jr, { as: HC, allowPinchZoom: !0, children: /* @__PURE__ */ v(
      Lg,
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
), VC = p.forwardRef(
  (e, t) => {
    const r = Ot(nr, e.__scopePopover), n = p.useRef(!1), o = p.useRef(!1);
    return /* @__PURE__ */ v(
      Lg,
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
), Lg = p.forwardRef(
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
    } = e, f = Ot(nr, r), g = Xr(r);
    return Vn(), /* @__PURE__ */ v(
      Lr,
      {
        asChild: !0,
        loop: !0,
        trapped: n,
        onMountAutoFocus: o,
        onUnmountAutoFocus: a,
        children: /* @__PURE__ */ v(
          dr,
          {
            asChild: !0,
            disableOutsidePointerEvents: i,
            onInteractOutside: u,
            onEscapeKeyDown: s,
            onPointerDownOutside: c,
            onFocusOutside: l,
            onDismiss: () => f.onOpenChange(!1),
            children: /* @__PURE__ */ v(
              eo,
              {
                "data-state": zg(f.open),
                role: "dialog",
                id: f.contentId,
                ...g,
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
), jg = "PopoverClose", GC = p.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Ot(jg, r);
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
GC.displayName = jg;
var UC = "PopoverArrow", KC = p.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Xr(r);
    return /* @__PURE__ */ v(to, { ...o, ...n, ref: t });
  }
);
KC.displayName = UC;
function zg(e) {
  return e ? "open" : "closed";
}
var XC = Ig, ZC = Bg, QC = Wg, JC = qg, eO = [" ", "Enter", "ArrowUp", "ArrowDown"], tO = [" ", "Enter"], Bt = "Select", [io, so, rO] = $c(Bt), [mr] = Le(Bt, [
  rO,
  St
]), co = St(), [nO, Pt] = mr(Bt), [oO, aO] = mr(Bt), Hg = (e) => {
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
    required: g,
    form: b
  } = e, m = co(t), [h, y] = p.useState(null), [w, x] = p.useState(null), [_, C] = p.useState(!1), S = Yn(l), [O, P] = nt({
    prop: n,
    defaultProp: o ?? !1,
    onChange: a,
    caller: Bt
  }), [T, A] = nt({
    prop: i,
    defaultProp: s,
    onChange: c,
    caller: Bt
  }), k = p.useRef(null), q = h ? b || !!h.closest("form") : !0, [D, F] = p.useState(/* @__PURE__ */ new Set()), $ = Array.from(D).map((I) => I.props.value).join(";");
  return /* @__PURE__ */ v(Hr, { ...m, children: /* @__PURE__ */ ae(
    nO,
    {
      required: g,
      scope: t,
      trigger: h,
      onTriggerChange: y,
      valueNode: w,
      onValueNodeChange: x,
      valueNodeHasChildren: _,
      onValueNodeHasChildrenChange: C,
      contentId: Oe(),
      value: T,
      onValueChange: A,
      open: O,
      onOpenChange: P,
      dir: S,
      triggerPointerDownPosRef: k,
      disabled: f,
      children: [
        /* @__PURE__ */ v(io.Provider, { scope: t, children: /* @__PURE__ */ v(
          oO,
          {
            scope: e.__scopeSelect,
            onNativeOptionAdd: p.useCallback((I) => {
              F((Y) => new Set(Y).add(I));
            }, []),
            onNativeOptionRemove: p.useCallback((I) => {
              F((Y) => {
                const B = new Set(Y);
                return B.delete(I), B;
              });
            }, []),
            children: r
          }
        ) }),
        q ? /* @__PURE__ */ ae(
          fv,
          {
            "aria-hidden": !0,
            required: g,
            tabIndex: -1,
            name: u,
            autoComplete: d,
            value: T,
            onChange: (I) => A(I.target.value),
            disabled: f,
            form: b,
            children: [
              T === void 0 ? /* @__PURE__ */ v("option", { value: "" }) : null,
              Array.from(D)
            ]
          },
          $
        ) : null
      ]
    }
  ) });
};
Hg.displayName = Bt;
var Yg = "SelectTrigger", Vg = p.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, disabled: n = !1, ...o } = e, a = co(r), i = Pt(Yg, r), s = i.disabled || n, c = ie(t, i.onTriggerChange), l = so(r), u = p.useRef("touch"), [d, f, g] = hv((m) => {
      const h = l().filter((x) => !x.disabled), y = h.find((x) => x.value === i.value), w = mv(h, m, y);
      w !== void 0 && i.onValueChange(w.value);
    }), b = (m) => {
      s || (i.onOpenChange(!0), g()), m && (i.triggerPointerDownPosRef.current = {
        x: Math.round(m.pageX),
        y: Math.round(m.pageY)
      });
    };
    return /* @__PURE__ */ v(Yr, { asChild: !0, ...a, children: /* @__PURE__ */ v(
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
        "data-placeholder": pv(i.value) ? "" : void 0,
        ...o,
        ref: c,
        onClick: W(o.onClick, (m) => {
          m.currentTarget.focus(), u.current !== "mouse" && b(m);
        }),
        onPointerDown: W(o.onPointerDown, (m) => {
          u.current = m.pointerType;
          const h = m.target;
          h.hasPointerCapture(m.pointerId) && h.releasePointerCapture(m.pointerId), m.button === 0 && m.ctrlKey === !1 && m.pointerType === "mouse" && (b(m), m.preventDefault());
        }),
        onKeyDown: W(o.onKeyDown, (m) => {
          const h = d.current !== "";
          !(m.ctrlKey || m.altKey || m.metaKey) && m.key.length === 1 && f(m.key), !(h && m.key === " ") && eO.includes(m.key) && (b(), m.preventDefault());
        })
      }
    ) });
  }
);
Vg.displayName = Yg;
var Gg = "SelectValue", Ug = p.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, className: n, style: o, children: a, placeholder: i = "", ...s } = e, c = Pt(Gg, r), { onValueNodeHasChildrenChange: l } = c, u = a !== void 0, d = ie(t, c.onValueNodeChange);
    return xe(() => {
      l(u);
    }, [l, u]), /* @__PURE__ */ v(
      K.span,
      {
        ...s,
        ref: d,
        style: { pointerEvents: "none" },
        children: pv(c.value) ? /* @__PURE__ */ v(It, { children: i }) : a
      }
    );
  }
);
Ug.displayName = Gg;
var iO = "SelectIcon", Kg = p.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, children: n, ...o } = e;
    return /* @__PURE__ */ v(K.span, { "aria-hidden": !0, ...o, ref: t, children: n || "▼" });
  }
);
Kg.displayName = iO;
var sO = "SelectPortal", Xg = (e) => /* @__PURE__ */ v(fr, { asChild: !0, ...e });
Xg.displayName = sO;
var Wt = "SelectContent", Zg = p.forwardRef(
  (e, t) => {
    const r = Pt(Wt, e.__scopeSelect), [n, o] = p.useState();
    if (xe(() => {
      o(new DocumentFragment());
    }, []), !r.open) {
      const a = n;
      return a ? zn.createPortal(
        /* @__PURE__ */ v(Qg, { scope: e.__scopeSelect, children: /* @__PURE__ */ v(io.Slot, { scope: e.__scopeSelect, children: /* @__PURE__ */ v("div", { children: e.children }) }) }),
        a
      ) : null;
    }
    return /* @__PURE__ */ v(Jg, { ...e, ref: t });
  }
);
Zg.displayName = Wt;
var ze = 10, [Qg, Et] = mr(Wt), cO = "SelectContentImpl", lO = /* @__PURE__ */ wt("SelectContent.RemoveScroll"), Jg = p.forwardRef(
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
      collisionPadding: g,
      sticky: b,
      hideWhenDetached: m,
      avoidCollisions: h,
      //
      ...y
    } = e, w = Pt(Wt, r), [x, _] = p.useState(null), [C, S] = p.useState(null), O = ie(t, (z) => _(z)), [P, T] = p.useState(null), [A, k] = p.useState(
      null
    ), q = so(r), [D, F] = p.useState(!1), $ = p.useRef(!1);
    p.useEffect(() => {
      if (x) return Un(x);
    }, [x]), Vn();
    const I = p.useCallback(
      (z) => {
        const [re, ...G] = q().map((te) => te.ref.current), [Q] = G.slice(-1), ee = document.activeElement;
        for (const te of z)
          if (te === ee || (te == null || te.scrollIntoView({ block: "nearest" }), te === re && C && (C.scrollTop = 0), te === Q && C && (C.scrollTop = C.scrollHeight), te == null || te.focus(), document.activeElement !== ee)) return;
      },
      [q, C]
    ), Y = p.useCallback(
      () => I([P, x]),
      [I, P, x]
    );
    p.useEffect(() => {
      D && Y();
    }, [D, Y]);
    const { onOpenChange: B, triggerPointerDownPosRef: N } = w;
    p.useEffect(() => {
      if (x) {
        let z = { x: 0, y: 0 };
        const re = (Q) => {
          var ee, te;
          z = {
            x: Math.abs(Math.round(Q.pageX) - (((ee = N.current) == null ? void 0 : ee.x) ?? 0)),
            y: Math.abs(Math.round(Q.pageY) - (((te = N.current) == null ? void 0 : te.y) ?? 0))
          };
        }, G = (Q) => {
          z.x <= 10 && z.y <= 10 ? Q.preventDefault() : x.contains(Q.target) || B(!1), document.removeEventListener("pointermove", re), N.current = null;
        };
        return N.current !== null && (document.addEventListener("pointermove", re), document.addEventListener("pointerup", G, { capture: !0, once: !0 })), () => {
          document.removeEventListener("pointermove", re), document.removeEventListener("pointerup", G, { capture: !0 });
        };
      }
    }, [x, B, N]), p.useEffect(() => {
      const z = () => B(!1);
      return window.addEventListener("blur", z), window.addEventListener("resize", z), () => {
        window.removeEventListener("blur", z), window.removeEventListener("resize", z);
      };
    }, [B]);
    const [R, X] = hv((z) => {
      const re = q().filter((ee) => !ee.disabled), G = re.find((ee) => ee.ref.current === document.activeElement), Q = mv(re, z, G);
      Q && setTimeout(() => Q.ref.current.focus());
    }), le = p.useCallback(
      (z, re, G) => {
        const Q = !$.current && !G;
        (w.value !== void 0 && w.value === re || Q) && (T(z), Q && ($.current = !0));
      },
      [w.value]
    ), me = p.useCallback(() => x == null ? void 0 : x.focus(), [x]), ge = p.useCallback(
      (z, re, G) => {
        const Q = !$.current && !G;
        (w.value !== void 0 && w.value === re || Q) && k(z);
      },
      [w.value]
    ), se = n === "popper" ? uc : ev, ne = se === uc ? {
      side: s,
      sideOffset: c,
      align: l,
      alignOffset: u,
      arrowPadding: d,
      collisionBoundary: f,
      collisionPadding: g,
      sticky: b,
      hideWhenDetached: m,
      avoidCollisions: h
    } : {};
    return /* @__PURE__ */ v(
      Qg,
      {
        scope: r,
        content: x,
        viewport: C,
        onViewportChange: S,
        itemRefCallback: le,
        selectedItem: P,
        onItemLeave: me,
        itemTextRefCallback: ge,
        focusSelectedItem: Y,
        selectedItemText: A,
        position: n,
        isPositioned: D,
        searchRef: R,
        children: /* @__PURE__ */ v(jr, { as: lO, allowPinchZoom: !0, children: /* @__PURE__ */ v(
          Lr,
          {
            asChild: !0,
            trapped: w.open,
            onMountAutoFocus: (z) => {
              z.preventDefault();
            },
            onUnmountAutoFocus: W(o, (z) => {
              var re;
              (re = w.trigger) == null || re.focus({ preventScroll: !0 }), z.preventDefault();
            }),
            children: /* @__PURE__ */ v(
              dr,
              {
                asChild: !0,
                disableOutsidePointerEvents: !0,
                onEscapeKeyDown: a,
                onPointerDownOutside: i,
                onFocusOutside: (z) => z.preventDefault(),
                onDismiss: () => w.onOpenChange(!1),
                children: /* @__PURE__ */ v(
                  se,
                  {
                    role: "listbox",
                    id: w.contentId,
                    "data-state": w.open ? "open" : "closed",
                    dir: w.dir,
                    onContextMenu: (z) => z.preventDefault(),
                    ...y,
                    ...ne,
                    onPlaced: () => F(!0),
                    ref: O,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...y.style
                    },
                    onKeyDown: W(y.onKeyDown, (z) => {
                      const re = z.ctrlKey || z.altKey || z.metaKey;
                      if (z.key === "Tab" && z.preventDefault(), !re && z.key.length === 1 && X(z.key), ["ArrowUp", "ArrowDown", "Home", "End"].includes(z.key)) {
                        let Q = q().filter((ee) => !ee.disabled).map((ee) => ee.ref.current);
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
Jg.displayName = cO;
var uO = "SelectItemAlignedPosition", ev = p.forwardRef((e, t) => {
  const { __scopeSelect: r, onPlaced: n, ...o } = e, a = Pt(Wt, r), i = Et(Wt, r), [s, c] = p.useState(null), [l, u] = p.useState(null), d = ie(t, (O) => u(O)), f = so(r), g = p.useRef(!1), b = p.useRef(!0), { viewport: m, selectedItem: h, selectedItemText: y, focusSelectedItem: w } = i, x = p.useCallback(() => {
    if (a.trigger && a.valueNode && s && l && m && h && y) {
      const O = a.trigger.getBoundingClientRect(), P = l.getBoundingClientRect(), T = a.valueNode.getBoundingClientRect(), A = y.getBoundingClientRect();
      if (a.dir !== "rtl") {
        const ee = A.left - P.left, te = T.left - ee, be = O.left - te, L = O.width + be, Ne = Math.max(L, P.width), Ae = window.innerWidth - ze, Ze = Su(te, [
          ze,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(ze, Ae - Ne)
        ]);
        s.style.minWidth = L + "px", s.style.left = Ze + "px";
      } else {
        const ee = P.right - A.right, te = window.innerWidth - T.right - ee, be = window.innerWidth - O.right - te, L = O.width + be, Ne = Math.max(L, P.width), Ae = window.innerWidth - ze, Ze = Su(te, [
          ze,
          Math.max(ze, Ae - Ne)
        ]);
        s.style.minWidth = L + "px", s.style.right = Ze + "px";
      }
      const k = f(), q = window.innerHeight - ze * 2, D = m.scrollHeight, F = window.getComputedStyle(l), $ = parseInt(F.borderTopWidth, 10), I = parseInt(F.paddingTop, 10), Y = parseInt(F.borderBottomWidth, 10), B = parseInt(F.paddingBottom, 10), N = $ + I + D + B + Y, R = Math.min(h.offsetHeight * 5, N), X = window.getComputedStyle(m), le = parseInt(X.paddingTop, 10), me = parseInt(X.paddingBottom, 10), ge = O.top + O.height / 2 - ze, se = q - ge, ne = h.offsetHeight / 2, z = h.offsetTop + ne, re = $ + I + z, G = N - re;
      if (re <= ge) {
        const ee = k.length > 0 && h === k[k.length - 1].ref.current;
        s.style.bottom = "0px";
        const te = l.clientHeight - m.offsetTop - m.offsetHeight, be = Math.max(
          se,
          ne + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (ee ? me : 0) + te + Y
        ), L = re + be;
        s.style.height = L + "px";
      } else {
        const ee = k.length > 0 && h === k[0].ref.current;
        s.style.top = "0px";
        const be = Math.max(
          ge,
          $ + m.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (ee ? le : 0) + ne
        ) + G;
        s.style.height = be + "px", m.scrollTop = re - ge + m.offsetTop;
      }
      s.style.margin = `${ze}px 0`, s.style.minHeight = R + "px", s.style.maxHeight = q + "px", n == null || n(), requestAnimationFrame(() => g.current = !0);
    }
  }, [
    f,
    a.trigger,
    a.valueNode,
    s,
    l,
    m,
    h,
    y,
    a.dir,
    n
  ]);
  xe(() => x(), [x]);
  const [_, C] = p.useState();
  xe(() => {
    l && C(window.getComputedStyle(l).zIndex);
  }, [l]);
  const S = p.useCallback(
    (O) => {
      O && b.current === !0 && (x(), w == null || w(), b.current = !1);
    },
    [x, w]
  );
  return /* @__PURE__ */ v(
    fO,
    {
      scope: r,
      contentWrapper: s,
      shouldExpandOnScrollRef: g,
      onScrollButtonChange: S,
      children: /* @__PURE__ */ v(
        "div",
        {
          ref: c,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: _
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
ev.displayName = uO;
var dO = "SelectPopperPosition", uc = p.forwardRef((e, t) => {
  const {
    __scopeSelect: r,
    align: n = "start",
    collisionPadding: o = ze,
    ...a
  } = e, i = co(r);
  return /* @__PURE__ */ v(
    eo,
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
uc.displayName = dO;
var [fO, il] = mr(Wt, {}), dc = "SelectViewport", tv = p.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, nonce: n, ...o } = e, a = Et(dc, r), i = il(dc, r), s = ie(t, a.onViewportChange), c = p.useRef(0);
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
      /* @__PURE__ */ v(io.Slot, { scope: r, children: /* @__PURE__ */ v(
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
              const g = Math.abs(c.current - u.scrollTop);
              if (g > 0) {
                const b = window.innerHeight - ze * 2, m = parseFloat(d.style.minHeight), h = parseFloat(d.style.height), y = Math.max(m, h);
                if (y < b) {
                  const w = y + g, x = Math.min(b, w), _ = w - x;
                  d.style.height = x + "px", d.style.bottom === "0px" && (u.scrollTop = _ > 0 ? _ : 0, d.style.justifyContent = "flex-end");
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
tv.displayName = dc;
var rv = "SelectGroup", [pO, hO] = mr(rv), mO = p.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = Oe();
    return /* @__PURE__ */ v(pO, { scope: r, id: o, children: /* @__PURE__ */ v(K.div, { role: "group", "aria-labelledby": o, ...n, ref: t }) });
  }
);
mO.displayName = rv;
var nv = "SelectLabel", gO = p.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = hO(nv, r);
    return /* @__PURE__ */ v(K.div, { id: o.id, ...n, ref: t });
  }
);
gO.displayName = nv;
var Dn = "SelectItem", [vO, ov] = mr(Dn), av = p.forwardRef(
  (e, t) => {
    const {
      __scopeSelect: r,
      value: n,
      disabled: o = !1,
      textValue: a,
      ...i
    } = e, s = Pt(Dn, r), c = Et(Dn, r), l = s.value === n, [u, d] = p.useState(a ?? ""), [f, g] = p.useState(!1), b = ie(
      t,
      (w) => {
        var x;
        return (x = c.itemRefCallback) == null ? void 0 : x.call(c, w, n, o);
      }
    ), m = Oe(), h = p.useRef("touch"), y = () => {
      o || (s.onValueChange(n), s.onOpenChange(!1));
    };
    if (n === "")
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    return /* @__PURE__ */ v(
      vO,
      {
        scope: r,
        value: n,
        disabled: o,
        textId: m,
        isSelected: l,
        onItemTextChange: p.useCallback((w) => {
          d((x) => x || ((w == null ? void 0 : w.textContent) ?? "").trim());
        }, []),
        children: /* @__PURE__ */ v(
          io.ItemSlot,
          {
            scope: r,
            value: n,
            disabled: o,
            textValue: u,
            children: /* @__PURE__ */ v(
              K.div,
              {
                role: "option",
                "aria-labelledby": m,
                "data-highlighted": f ? "" : void 0,
                "aria-selected": l && f,
                "data-state": l ? "checked" : "unchecked",
                "aria-disabled": o || void 0,
                "data-disabled": o ? "" : void 0,
                tabIndex: o ? void 0 : -1,
                ...i,
                ref: b,
                onFocus: W(i.onFocus, () => g(!0)),
                onBlur: W(i.onBlur, () => g(!1)),
                onClick: W(i.onClick, () => {
                  h.current !== "mouse" && y();
                }),
                onPointerUp: W(i.onPointerUp, () => {
                  h.current === "mouse" && y();
                }),
                onPointerDown: W(i.onPointerDown, (w) => {
                  h.current = w.pointerType;
                }),
                onPointerMove: W(i.onPointerMove, (w) => {
                  var x;
                  h.current = w.pointerType, o ? (x = c.onItemLeave) == null || x.call(c) : h.current === "mouse" && w.currentTarget.focus({ preventScroll: !0 });
                }),
                onPointerLeave: W(i.onPointerLeave, (w) => {
                  var x;
                  w.currentTarget === document.activeElement && ((x = c.onItemLeave) == null || x.call(c));
                }),
                onKeyDown: W(i.onKeyDown, (w) => {
                  var _;
                  ((_ = c.searchRef) == null ? void 0 : _.current) !== "" && w.key === " " || (tO.includes(w.key) && y(), w.key === " " && w.preventDefault());
                })
              }
            )
          }
        )
      }
    );
  }
);
av.displayName = Dn;
var _r = "SelectItemText", iv = p.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, className: n, style: o, ...a } = e, i = Pt(_r, r), s = Et(_r, r), c = ov(_r, r), l = aO(_r, r), [u, d] = p.useState(null), f = ie(
      t,
      (y) => d(y),
      c.onItemTextChange,
      (y) => {
        var w;
        return (w = s.itemTextRefCallback) == null ? void 0 : w.call(s, y, c.value, c.disabled);
      }
    ), g = u == null ? void 0 : u.textContent, b = p.useMemo(
      () => /* @__PURE__ */ v("option", { value: c.value, disabled: c.disabled, children: g }, c.value),
      [c.disabled, c.value, g]
    ), { onNativeOptionAdd: m, onNativeOptionRemove: h } = l;
    return xe(() => (m(b), () => h(b)), [m, h, b]), /* @__PURE__ */ ae(It, { children: [
      /* @__PURE__ */ v(K.span, { id: c.textId, ...a, ref: f }),
      c.isSelected && i.valueNode && !i.valueNodeHasChildren ? zn.createPortal(a.children, i.valueNode) : null
    ] });
  }
);
iv.displayName = _r;
var sv = "SelectItemIndicator", cv = p.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e;
    return ov(sv, r).isSelected ? /* @__PURE__ */ v(K.span, { "aria-hidden": !0, ...n, ref: t }) : null;
  }
);
cv.displayName = sv;
var fc = "SelectScrollUpButton", lv = p.forwardRef((e, t) => {
  const r = Et(fc, e.__scopeSelect), n = il(fc, e.__scopeSelect), [o, a] = p.useState(!1), i = ie(t, n.onScrollButtonChange);
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
    dv,
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
lv.displayName = fc;
var pc = "SelectScrollDownButton", uv = p.forwardRef((e, t) => {
  const r = Et(pc, e.__scopeSelect), n = il(pc, e.__scopeSelect), [o, a] = p.useState(!1), i = ie(t, n.onScrollButtonChange);
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
    dv,
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
uv.displayName = pc;
var dv = p.forwardRef((e, t) => {
  const { __scopeSelect: r, onAutoScroll: n, ...o } = e, a = Et("SelectScrollButton", r), i = p.useRef(null), s = so(r), c = p.useCallback(() => {
    i.current !== null && (window.clearInterval(i.current), i.current = null);
  }, []);
  return p.useEffect(() => () => c(), [c]), xe(() => {
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
}), bO = "SelectSeparator", yO = p.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e;
    return /* @__PURE__ */ v(K.div, { "aria-hidden": !0, ...n, ref: t });
  }
);
yO.displayName = bO;
var hc = "SelectArrow", wO = p.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = co(r), a = Pt(hc, r), i = Et(hc, r);
    return a.open && i.position === "popper" ? /* @__PURE__ */ v(to, { ...o, ...n, ref: t }) : null;
  }
);
wO.displayName = hc;
var xO = "SelectBubbleInput", fv = p.forwardRef(
  ({ __scopeSelect: e, value: t, ...r }, n) => {
    const o = p.useRef(null), a = ie(n, o), i = hm(t);
    return p.useEffect(() => {
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
        style: { ...Ph, ...r.style },
        ref: a,
        defaultValue: t
      }
    );
  }
);
fv.displayName = xO;
function pv(e) {
  return e === "" || e === void 0;
}
function hv(e) {
  const t = qe(e), r = p.useRef(""), n = p.useRef(0), o = p.useCallback(
    (i) => {
      const s = r.current + i;
      t(s), (function c(l) {
        r.current = l, window.clearTimeout(n.current), l !== "" && (n.current = window.setTimeout(() => c(""), 1e3));
      })(s);
    },
    [t]
  ), a = p.useCallback(() => {
    r.current = "", window.clearTimeout(n.current);
  }, []);
  return p.useEffect(() => () => window.clearTimeout(n.current), []), [r, o, a];
}
function mv(e, t, r) {
  const o = t.length > 1 && Array.from(t).every((l) => l === t[0]) ? t[0] : t, a = r ? e.indexOf(r) : -1;
  let i = _O(e, Math.max(a, 0));
  o.length === 1 && (i = i.filter((l) => l !== r));
  const c = i.find(
    (l) => l.textValue.toLowerCase().startsWith(o.toLowerCase())
  );
  return c !== r ? c : void 0;
}
function _O(e, t) {
  return e.map((r, n) => e[(t + n) % e.length]);
}
var SO = Hg, CO = Vg, OO = Ug, PO = Kg, EO = Xg, MO = Zg, TO = tv, RO = av, kO = iv, DO = cv, NO = lv, AO = uv, IO = "Separator", Cu = "horizontal", FO = ["horizontal", "vertical"], gv = p.forwardRef((e, t) => {
  const { decorative: r, orientation: n = Cu, ...o } = e, a = $O(n) ? n : Cu, s = r ? { role: "none" } : { "aria-orientation": a === "vertical" ? a : void 0, role: "separator" };
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
gv.displayName = IO;
function $O(e) {
  return FO.includes(e);
}
var BO = gv, lo = "Switch", [WO] = Le(lo), [qO, LO] = WO(lo), vv = p.forwardRef(
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
    } = e, [f, g] = p.useState(null), b = ie(t, (x) => g(x)), m = p.useRef(!1), h = f ? u || !!f.closest("form") : !0, [y, w] = nt({
      prop: o,
      defaultProp: a ?? !1,
      onChange: l,
      caller: lo
    });
    return /* @__PURE__ */ ae(qO, { scope: r, checked: y, disabled: s, children: [
      /* @__PURE__ */ v(
        K.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": y,
          "aria-required": i,
          "data-state": xv(y),
          "data-disabled": s ? "" : void 0,
          disabled: s,
          value: c,
          ...d,
          ref: b,
          onClick: W(e.onClick, (x) => {
            w((_) => !_), h && (m.current = x.isPropagationStopped(), m.current || x.stopPropagation());
          })
        }
      ),
      h && /* @__PURE__ */ v(
        wv,
        {
          control: f,
          bubbles: !m.current,
          name: n,
          value: c,
          checked: y,
          required: i,
          disabled: s,
          form: u,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
vv.displayName = lo;
var bv = "SwitchThumb", yv = p.forwardRef(
  (e, t) => {
    const { __scopeSwitch: r, ...n } = e, o = LO(bv, r);
    return /* @__PURE__ */ v(
      K.span,
      {
        "data-state": xv(o.checked),
        "data-disabled": o.disabled ? "" : void 0,
        ...n,
        ref: t
      }
    );
  }
);
yv.displayName = bv;
var jO = "SwitchBubbleInput", wv = p.forwardRef(
  ({
    __scopeSwitch: e,
    control: t,
    checked: r,
    bubbles: n = !0,
    ...o
  }, a) => {
    const i = p.useRef(null), s = ie(i, a), c = hm(r), l = mm(t);
    return p.useEffect(() => {
      const u = i.current;
      if (!u) return;
      const d = window.HTMLInputElement.prototype, g = Object.getOwnPropertyDescriptor(
        d,
        "checked"
      ).set;
      if (c !== r && g) {
        const b = new Event("click", { bubbles: n });
        g.call(u, r), u.dispatchEvent(b);
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
wv.displayName = jO;
function xv(e) {
  return e ? "checked" : "unchecked";
}
var zO = vv, HO = yv, uo = "Tabs", [YO] = Le(uo, [
  ro
]), _v = ro(), [VO, sl] = YO(uo), Sv = p.forwardRef(
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
    } = e, u = Yn(s), [d, f] = nt({
      prop: n,
      onChange: o,
      defaultProp: a ?? "",
      caller: uo
    });
    return /* @__PURE__ */ v(
      VO,
      {
        scope: r,
        baseId: Oe(),
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
Sv.displayName = uo;
var Cv = "TabsList", Ov = p.forwardRef(
  (e, t) => {
    const { __scopeTabs: r, loop: n = !0, ...o } = e, a = sl(Cv, r), i = _v(r);
    return /* @__PURE__ */ v(
      jm,
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
Ov.displayName = Cv;
var Pv = "TabsTrigger", Ev = p.forwardRef(
  (e, t) => {
    const { __scopeTabs: r, value: n, disabled: o = !1, ...a } = e, i = sl(Pv, r), s = _v(r), c = Rv(i.baseId, n), l = kv(i.baseId, n), u = n === i.value;
    return /* @__PURE__ */ v(
      zm,
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
Ev.displayName = Pv;
var Mv = "TabsContent", Tv = p.forwardRef(
  (e, t) => {
    const { __scopeTabs: r, value: n, forceMount: o, children: a, ...i } = e, s = sl(Mv, r), c = Rv(s.baseId, n), l = kv(s.baseId, n), u = n === s.value, d = p.useRef(u);
    return p.useEffect(() => {
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
Tv.displayName = Mv;
function Rv(e, t) {
  return `${e}-trigger-${t}`;
}
function kv(e, t) {
  return `${e}-content-${t}`;
}
var GO = Sv, UO = Ov, KO = Ev, XO = Tv, [fo] = Le("Tooltip", [
  St
]), po = St(), Dv = "TooltipProvider", ZO = 700, mc = "tooltip.open", [QO, cl] = fo(Dv), Nv = (e) => {
  const {
    __scopeTooltip: t,
    delayDuration: r = ZO,
    skipDelayDuration: n = 300,
    disableHoverableContent: o = !1,
    children: a
  } = e, i = p.useRef(!0), s = p.useRef(!1), c = p.useRef(0);
  return p.useEffect(() => {
    const l = c.current;
    return () => window.clearTimeout(l);
  }, []), /* @__PURE__ */ v(
    QO,
    {
      scope: t,
      isOpenDelayedRef: i,
      delayDuration: r,
      onOpen: p.useCallback(() => {
        window.clearTimeout(c.current), i.current = !1;
      }, []),
      onClose: p.useCallback(() => {
        window.clearTimeout(c.current), c.current = window.setTimeout(
          () => i.current = !0,
          n
        );
      }, [n]),
      isPointerInTransitRef: s,
      onPointerInTransitChange: p.useCallback((l) => {
        s.current = l;
      }, []),
      disableHoverableContent: o,
      children: a
    }
  );
};
Nv.displayName = Dv;
var Nr = "Tooltip", [JO, Zr] = fo(Nr), Av = (e) => {
  const {
    __scopeTooltip: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: a,
    disableHoverableContent: i,
    delayDuration: s
  } = e, c = cl(Nr, e.__scopeTooltip), l = po(t), [u, d] = p.useState(null), f = Oe(), g = p.useRef(0), b = i ?? c.disableHoverableContent, m = s ?? c.delayDuration, h = p.useRef(!1), [y, w] = nt({
    prop: n,
    defaultProp: o ?? !1,
    onChange: (O) => {
      O ? (c.onOpen(), document.dispatchEvent(new CustomEvent(mc))) : c.onClose(), a == null || a(O);
    },
    caller: Nr
  }), x = p.useMemo(() => y ? h.current ? "delayed-open" : "instant-open" : "closed", [y]), _ = p.useCallback(() => {
    window.clearTimeout(g.current), g.current = 0, h.current = !1, w(!0);
  }, [w]), C = p.useCallback(() => {
    window.clearTimeout(g.current), g.current = 0, w(!1);
  }, [w]), S = p.useCallback(() => {
    window.clearTimeout(g.current), g.current = window.setTimeout(() => {
      h.current = !0, w(!0), g.current = 0;
    }, m);
  }, [m, w]);
  return p.useEffect(() => () => {
    g.current && (window.clearTimeout(g.current), g.current = 0);
  }, []), /* @__PURE__ */ v(Hr, { ...l, children: /* @__PURE__ */ v(
    JO,
    {
      scope: t,
      contentId: f,
      open: y,
      stateAttribute: x,
      trigger: u,
      onTriggerChange: d,
      onTriggerEnter: p.useCallback(() => {
        c.isOpenDelayedRef.current ? S() : _();
      }, [c.isOpenDelayedRef, S, _]),
      onTriggerLeave: p.useCallback(() => {
        b ? C() : (window.clearTimeout(g.current), g.current = 0);
      }, [C, b]),
      onOpen: _,
      onClose: C,
      disableHoverableContent: b,
      children: r
    }
  ) });
};
Av.displayName = Nr;
var gc = "TooltipTrigger", Iv = p.forwardRef(
  (e, t) => {
    const { __scopeTooltip: r, ...n } = e, o = Zr(gc, r), a = cl(gc, r), i = po(r), s = p.useRef(null), c = ie(t, s, o.onTriggerChange), l = p.useRef(!1), u = p.useRef(!1), d = p.useCallback(() => l.current = !1, []);
    return p.useEffect(() => () => document.removeEventListener("pointerup", d), [d]), /* @__PURE__ */ v(Yr, { asChild: !0, ...i, children: /* @__PURE__ */ v(
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
Iv.displayName = gc;
var ll = "TooltipPortal", [e0, t0] = fo(ll, {
  forceMount: void 0
}), Fv = (e) => {
  const { __scopeTooltip: t, forceMount: r, children: n, container: o } = e, a = Zr(ll, t);
  return /* @__PURE__ */ v(e0, { scope: t, forceMount: r, children: /* @__PURE__ */ v(De, { present: r || a.open, children: /* @__PURE__ */ v(fr, { asChild: !0, container: o, children: n }) }) });
};
Fv.displayName = ll;
var or = "TooltipContent", $v = p.forwardRef(
  (e, t) => {
    const r = t0(or, e.__scopeTooltip), { forceMount: n = r.forceMount, side: o = "top", ...a } = e, i = Zr(or, e.__scopeTooltip);
    return /* @__PURE__ */ v(De, { present: n || i.open, children: i.disableHoverableContent ? /* @__PURE__ */ v(Bv, { side: o, ...a, ref: t }) : /* @__PURE__ */ v(r0, { side: o, ...a, ref: t }) });
  }
), r0 = p.forwardRef((e, t) => {
  const r = Zr(or, e.__scopeTooltip), n = cl(or, e.__scopeTooltip), o = p.useRef(null), a = ie(t, o), [i, s] = p.useState(null), { trigger: c, onClose: l } = r, u = o.current, { onPointerInTransitChange: d } = n, f = p.useCallback(() => {
    s(null), d(!1);
  }, [d]), g = p.useCallback(
    (b, m) => {
      const h = b.currentTarget, y = { x: b.clientX, y: b.clientY }, w = i0(y, h.getBoundingClientRect()), x = s0(y, w), _ = c0(m.getBoundingClientRect()), C = u0([...x, ..._]);
      s(C), d(!0);
    },
    [d]
  );
  return p.useEffect(() => () => f(), [f]), p.useEffect(() => {
    if (c && u) {
      const b = (h) => g(h, u), m = (h) => g(h, c);
      return c.addEventListener("pointerleave", b), u.addEventListener("pointerleave", m), () => {
        c.removeEventListener("pointerleave", b), u.removeEventListener("pointerleave", m);
      };
    }
  }, [c, u, g, f]), p.useEffect(() => {
    if (i) {
      const b = (m) => {
        const h = m.target, y = { x: m.clientX, y: m.clientY }, w = (c == null ? void 0 : c.contains(h)) || (u == null ? void 0 : u.contains(h)), x = !l0(y, i);
        w ? f() : x && (f(), l());
      };
      return document.addEventListener("pointermove", b), () => document.removeEventListener("pointermove", b);
    }
  }, [c, u, i, l, f]), /* @__PURE__ */ v(Bv, { ...e, ref: a });
}), [n0, o0] = fo(Nr, { isInside: !1 }), a0 = /* @__PURE__ */ ow("TooltipContent"), Bv = p.forwardRef(
  (e, t) => {
    const {
      __scopeTooltip: r,
      children: n,
      "aria-label": o,
      onEscapeKeyDown: a,
      onPointerDownOutside: i,
      ...s
    } = e, c = Zr(or, r), l = po(r), { onClose: u } = c;
    return p.useEffect(() => (document.addEventListener(mc, u), () => document.removeEventListener(mc, u)), [u]), p.useEffect(() => {
      if (c.trigger) {
        const d = (f) => {
          const g = f.target;
          g != null && g.contains(c.trigger) && u();
        };
        return window.addEventListener("scroll", d, { capture: !0 }), () => window.removeEventListener("scroll", d, { capture: !0 });
      }
    }, [c.trigger, u]), /* @__PURE__ */ v(
      dr,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: a,
        onPointerDownOutside: i,
        onFocusOutside: (d) => d.preventDefault(),
        onDismiss: u,
        children: /* @__PURE__ */ ae(
          eo,
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
              /* @__PURE__ */ v(a0, { children: n }),
              /* @__PURE__ */ v(n0, { scope: r, isInside: !0, children: /* @__PURE__ */ v(uw, { id: c.contentId, role: "tooltip", children: o || n }) })
            ]
          }
        )
      }
    );
  }
);
$v.displayName = or;
var Wv = "TooltipArrow", qv = p.forwardRef(
  (e, t) => {
    const { __scopeTooltip: r, ...n } = e, o = po(r);
    return o0(
      Wv,
      r
    ).isInside ? null : /* @__PURE__ */ v(to, { ...o, ...n, ref: t });
  }
);
qv.displayName = Wv;
function i0(e, t) {
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
function s0(e, t, r = 5) {
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
function c0(e) {
  const { top: t, right: r, bottom: n, left: o } = e;
  return [
    { x: o, y: t },
    { x: r, y: t },
    { x: r, y: n },
    { x: o, y: n }
  ];
}
function l0(e, t) {
  const { x: r, y: n } = e;
  let o = !1;
  for (let a = 0, i = t.length - 1; a < t.length; i = a++) {
    const s = t[a], c = t[i], l = s.x, u = s.y, d = c.x, f = c.y;
    u > n != f > n && r < (d - l) * (n - u) / (f - u) + l && (o = !o);
  }
  return o;
}
function u0(e) {
  const t = e.slice();
  return t.sort((r, n) => r.x < n.x ? -1 : r.x > n.x ? 1 : r.y < n.y ? -1 : r.y > n.y ? 1 : 0), d0(t);
}
function d0(e) {
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
var f0 = Nv, p0 = Av, h0 = Iv, m0 = Fv, g0 = $v, v0 = qv;
const b0 = (e, t) => {
  const r = new Array(e.length + t.length);
  for (let n = 0; n < e.length; n++)
    r[n] = e[n];
  for (let n = 0; n < t.length; n++)
    r[e.length + n] = t[n];
  return r;
}, y0 = (e, t) => ({
  classGroupId: e,
  validator: t
}), Lv = (e = /* @__PURE__ */ new Map(), t = null, r) => ({
  nextPart: e,
  validators: t,
  classGroupId: r
}), Nn = "-", Ou = [], w0 = "arbitrary..", x0 = (e) => {
  const t = S0(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (i) => {
      if (i.startsWith("[") && i.endsWith("]"))
        return _0(i);
      const s = i.split(Nn), c = s[0] === "" && s.length > 1 ? 1 : 0;
      return jv(s, c, t);
    },
    getConflictingClassGroupIds: (i, s) => {
      if (s) {
        const c = n[i], l = r[i];
        return c ? l ? b0(l, c) : c : l || Ou;
      }
      return r[i] || Ou;
    }
  };
}, jv = (e, t, r) => {
  if (e.length - t === 0)
    return r.classGroupId;
  const o = e[t], a = r.nextPart.get(o);
  if (a) {
    const l = jv(e, t + 1, a);
    if (l) return l;
  }
  const i = r.validators;
  if (i === null)
    return;
  const s = t === 0 ? e.join(Nn) : e.slice(t).join(Nn), c = i.length;
  for (let l = 0; l < c; l++) {
    const u = i[l];
    if (u.validator(s))
      return u.classGroupId;
  }
}, _0 = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), r = t.indexOf(":"), n = t.slice(0, r);
  return n ? w0 + n : void 0;
})(), S0 = (e) => {
  const {
    theme: t,
    classGroups: r
  } = e;
  return C0(r, t);
}, C0 = (e, t) => {
  const r = Lv();
  for (const n in e) {
    const o = e[n];
    ul(o, r, n, t);
  }
  return r;
}, ul = (e, t, r, n) => {
  const o = e.length;
  for (let a = 0; a < o; a++) {
    const i = e[a];
    O0(i, t, r, n);
  }
}, O0 = (e, t, r, n) => {
  if (typeof e == "string") {
    P0(e, t, r);
    return;
  }
  if (typeof e == "function") {
    E0(e, t, r, n);
    return;
  }
  M0(e, t, r, n);
}, P0 = (e, t, r) => {
  const n = e === "" ? t : zv(t, e);
  n.classGroupId = r;
}, E0 = (e, t, r, n) => {
  if (T0(e)) {
    ul(e(n), t, r, n);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(y0(r, e));
}, M0 = (e, t, r, n) => {
  const o = Object.entries(e), a = o.length;
  for (let i = 0; i < a; i++) {
    const [s, c] = o[i];
    ul(c, zv(t, s), r, n);
  }
}, zv = (e, t) => {
  let r = e;
  const n = t.split(Nn), o = n.length;
  for (let a = 0; a < o; a++) {
    const i = n[a];
    let s = r.nextPart.get(i);
    s || (s = Lv(), r.nextPart.set(i, s)), r = s;
  }
  return r;
}, T0 = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, R0 = (e) => {
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
}, vc = "!", Pu = ":", k0 = [], Eu = (e, t, r, n, o) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: r,
  maybePostfixModifierPosition: n,
  isExternal: o
}), D0 = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: r
  } = e;
  let n = (o) => {
    const a = [];
    let i = 0, s = 0, c = 0, l;
    const u = o.length;
    for (let m = 0; m < u; m++) {
      const h = o[m];
      if (i === 0 && s === 0) {
        if (h === Pu) {
          a.push(o.slice(c, m)), c = m + 1;
          continue;
        }
        if (h === "/") {
          l = m;
          continue;
        }
      }
      h === "[" ? i++ : h === "]" ? i-- : h === "(" ? s++ : h === ")" && s--;
    }
    const d = a.length === 0 ? o : o.slice(c);
    let f = d, g = !1;
    d.endsWith(vc) ? (f = d.slice(0, -1), g = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      d.startsWith(vc) && (f = d.slice(1), g = !0)
    );
    const b = l && l > c ? l - c : void 0;
    return Eu(a, g, f, b);
  };
  if (t) {
    const o = t + Pu, a = n;
    n = (i) => i.startsWith(o) ? a(i.slice(o.length)) : Eu(k0, !1, i, void 0, !0);
  }
  if (r) {
    const o = n;
    n = (a) => r({
      className: a,
      parseClassName: o
    });
  }
  return n;
}, N0 = (e) => {
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
}, A0 = (e) => ({
  cache: R0(e.cacheSize),
  parseClassName: D0(e),
  sortModifiers: N0(e),
  ...x0(e)
}), I0 = /\s+/, F0 = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: o,
    sortModifiers: a
  } = t, i = [], s = e.trim().split(I0);
  let c = "";
  for (let l = s.length - 1; l >= 0; l -= 1) {
    const u = s[l], {
      isExternal: d,
      modifiers: f,
      hasImportantModifier: g,
      baseClassName: b,
      maybePostfixModifierPosition: m
    } = r(u);
    if (d) {
      c = u + (c.length > 0 ? " " + c : c);
      continue;
    }
    let h = !!m, y = n(h ? b.substring(0, m) : b);
    if (!y) {
      if (!h) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (y = n(b), !y) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      h = !1;
    }
    const w = f.length === 0 ? "" : f.length === 1 ? f[0] : a(f).join(":"), x = g ? w + vc : w, _ = x + y;
    if (i.indexOf(_) > -1)
      continue;
    i.push(_);
    const C = o(y, h);
    for (let S = 0; S < C.length; ++S) {
      const O = C[S];
      i.push(x + O);
    }
    c = u + (c.length > 0 ? " " + c : c);
  }
  return c;
}, $0 = (...e) => {
  let t = 0, r, n, o = "";
  for (; t < e.length; )
    (r = e[t++]) && (n = Hv(r)) && (o && (o += " "), o += n);
  return o;
}, Hv = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (t = Hv(e[n])) && (r && (r += " "), r += t);
  return r;
}, B0 = (e, ...t) => {
  let r, n, o, a;
  const i = (c) => {
    const l = t.reduce((u, d) => d(u), e());
    return r = A0(l), n = r.cache.get, o = r.cache.set, a = s, s(c);
  }, s = (c) => {
    const l = n(c);
    if (l)
      return l;
    const u = F0(c, r);
    return o(c, u), u;
  };
  return a = i, (...c) => a($0(...c));
}, W0 = [], we = (e) => {
  const t = (r) => r[e] || W0;
  return t.isThemeGetter = !0, t;
}, Yv = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Vv = /^\((?:(\w[\w-]*):)?(.+)\)$/i, q0 = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, L0 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, j0 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, z0 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, H0 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Y0 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, gt = (e) => q0.test(e), J = (e) => !!e && !Number.isNaN(Number(e)), vt = (e) => !!e && Number.isInteger(Number(e)), Ho = (e) => e.endsWith("%") && J(e.slice(0, -1)), lt = (e) => L0.test(e), Gv = () => !0, V0 = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  j0.test(e) && !z0.test(e)
), dl = () => !1, G0 = (e) => H0.test(e), U0 = (e) => Y0.test(e), K0 = (e) => !j(e) && !H(e), X0 = (e) => Mt(e, Xv, dl), j = (e) => Yv.test(e), kt = (e) => Mt(e, Zv, V0), Mu = (e) => Mt(e, oP, J), Z0 = (e) => Mt(e, Jv, Gv), Q0 = (e) => Mt(e, Qv, dl), Tu = (e) => Mt(e, Uv, dl), J0 = (e) => Mt(e, Kv, U0), fn = (e) => Mt(e, eb, G0), H = (e) => Vv.test(e), vr = (e) => jt(e, Zv), eP = (e) => jt(e, Qv), Ru = (e) => jt(e, Uv), tP = (e) => jt(e, Xv), rP = (e) => jt(e, Kv), pn = (e) => jt(e, eb, !0), nP = (e) => jt(e, Jv, !0), Mt = (e, t, r) => {
  const n = Yv.exec(e);
  return n ? n[1] ? t(n[1]) : r(n[2]) : !1;
}, jt = (e, t, r = !1) => {
  const n = Vv.exec(e);
  return n ? n[1] ? t(n[1]) : r : !1;
}, Uv = (e) => e === "position" || e === "percentage", Kv = (e) => e === "image" || e === "url", Xv = (e) => e === "length" || e === "size" || e === "bg-size", Zv = (e) => e === "length", oP = (e) => e === "number", Qv = (e) => e === "family-name", Jv = (e) => e === "number" || e === "weight", eb = (e) => e === "shadow", aP = () => {
  const e = we("color"), t = we("font"), r = we("text"), n = we("font-weight"), o = we("tracking"), a = we("leading"), i = we("breakpoint"), s = we("container"), c = we("spacing"), l = we("radius"), u = we("shadow"), d = we("inset-shadow"), f = we("text-shadow"), g = we("drop-shadow"), b = we("blur"), m = we("perspective"), h = we("aspect"), y = we("ease"), w = we("animate"), x = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], _ = () => [
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
  ], C = () => [..._(), H, j], S = () => ["auto", "hidden", "clip", "visible", "scroll"], O = () => ["auto", "contain", "none"], P = () => [H, j, c], T = () => [gt, "full", "auto", ...P()], A = () => [vt, "none", "subgrid", H, j], k = () => ["auto", {
    span: ["full", vt, H, j]
  }, vt, H, j], q = () => [vt, "auto", H, j], D = () => ["auto", "min", "max", "fr", H, j], F = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], $ = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], I = () => ["auto", ...P()], Y = () => [gt, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...P()], B = () => [gt, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...P()], N = () => [gt, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...P()], R = () => [e, H, j], X = () => [..._(), Ru, Tu, {
    position: [H, j]
  }], le = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], me = () => ["auto", "cover", "contain", tP, X0, {
    size: [H, j]
  }], ge = () => [Ho, vr, kt], se = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    l,
    H,
    j
  ], ne = () => ["", J, vr, kt], z = () => ["solid", "dashed", "dotted", "double"], re = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], G = () => [J, Ho, Ru, Tu], Q = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    b,
    H,
    j
  ], ee = () => ["none", J, H, j], te = () => ["none", J, H, j], be = () => [J, H, j], L = () => [gt, "full", ...P()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [lt],
      breakpoint: [lt],
      color: [Gv],
      container: [lt],
      "drop-shadow": [lt],
      ease: ["in", "out", "in-out"],
      font: [K0],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [lt],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [lt],
      shadow: [lt],
      spacing: ["px", J],
      text: [lt],
      "text-shadow": [lt],
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
        aspect: ["auto", "square", gt, j, H, h]
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
        overflow: S()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": S()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": S()
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
        inset: T()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": T()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": T()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": T(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: T()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": T(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: T()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": T()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": T()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: T()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: T()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: T()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: T()
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
        z: [vt, "auto", H, j]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [gt, "full", "auto", s, ...P()]
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
        flex: [J, gt, "auto", "initial", "none", j]
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
        order: [vt, "first", "last", "none", H, j]
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
        col: k()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": q()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": q()
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
        row: k()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": q()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": q()
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
        "auto-cols": D()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": D()
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
        justify: [...F(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...$(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...$()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...F()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...$(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...$(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": F()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...$(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...$()]
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
        inline: ["auto", ...B()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...B()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...B()]
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
        text: ["base", r, vr, kt]
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
        font: [n, nP, Z0]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Ho, j]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [eP, Q0, t]
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
        "line-clamp": [J, "none", H, Mu]
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
        placeholder: R()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: R()
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
        decoration: [J, "from-font", "auto", H, kt]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: R()
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
          }, vt, H, j],
          radial: ["", H, j],
          conic: [vt, H, j]
        }, rP, J0]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: R()
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
        from: R()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: R()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: R()
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
        border: R()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": R()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": R()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": R()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": R()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": R()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": R()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": R()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": R()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": R()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": R()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: R()
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
        outline: ["", J, vr, kt]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: R()
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
          pn,
          fn
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: R()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", d, pn, fn]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": R()
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
        ring: R()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [J, kt]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": R()
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
        "inset-ring": R()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", f, pn, fn]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": R()
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
        "mask-linear-from": G()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": G()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": R()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": R()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": G()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": G()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": R()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": R()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": G()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": G()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": R()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": R()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": G()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": G()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": R()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": R()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": G()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": G()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": R()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": R()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": G()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": G()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": R()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": R()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": G()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": G()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": R()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": R()
      }],
      "mask-image-radial": [{
        "mask-radial": [H, j]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": G()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": G()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": R()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": R()
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
        "mask-radial-at": _()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [J]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": G()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": G()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": R()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": R()
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
          g,
          pn,
          fn
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": R()
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
        ease: ["linear", "initial", y, H, j]
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
        animate: ["none", w, H, j]
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
        perspective: [m, H, j]
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
        accent: R()
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
        caret: R()
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
        fill: ["none", ...R()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [J, vr, kt, Mu]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...R()]
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
}, iP = /* @__PURE__ */ B0(aP);
function M(...e) {
  return iP(pt(e));
}
const bc = Fc(
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
function fl({
  className: e,
  variant: t = "default",
  size: r = "default",
  asChild: n = !1,
  ...o
}) {
  return /* @__PURE__ */ v(
    n ? ur : "button",
    {
      "data-slot": "button",
      "data-variant": t,
      "data-size": r,
      className: M(bc({ variant: t, size: r, className: e })),
      ...o
    }
  );
}
function AN({
  className: e,
  size: t = "default",
  ...r
}) {
  return /* @__PURE__ */ v(
    Lx,
    {
      "data-slot": "avatar",
      "data-size": t,
      className: M(
        "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        e
      ),
      ...r
    }
  );
}
function IN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    jx,
    {
      "data-slot": "avatar-image",
      className: M("aspect-square size-full", e),
      ...t
    }
  );
}
function FN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    zx,
    {
      "data-slot": "avatar-fallback",
      className: M(
        "bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs",
        e
      ),
      ...t
    }
  );
}
function $N({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "span",
    {
      "data-slot": "avatar-badge",
      className: M(
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
function BN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "avatar-group",
      className: M(
        "*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2",
        e
      ),
      ...t
    }
  );
}
function WN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "avatar-group-count",
      className: M(
        "bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        e
      ),
      ...t
    }
  );
}
function qN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card",
      className: M(
        "bg-veloce-glass backdrop-blur-2xl text-card-foreground flex flex-col gap-6 rounded-[2rem] border border-white/5 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:bg-white/5 hover:border-white/10",
        e
      ),
      ...t
    }
  );
}
function LN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-header",
      className: M(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        e
      ),
      ...t
    }
  );
}
function jN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-title",
      className: M("leading-none font-semibold", e),
      ...t
    }
  );
}
function zN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-description",
      className: M("text-muted-foreground text-sm", e),
      ...t
    }
  );
}
function HN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-action",
      className: M(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        e
      ),
      ...t
    }
  );
}
function YN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-content",
      className: M("px-6", e),
      ...t
    }
  );
}
function VN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "card-footer",
      className: M("flex items-center px-6 [.border-t]:pt-6", e),
      ...t
    }
  );
}
function sP({ className: e, type: t, ...r }) {
  return /* @__PURE__ */ v(
    "input",
    {
      type: t,
      "data-slot": "input",
      className: M(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        e
      ),
      ...r
    }
  );
}
function cP({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    WC,
    {
      "data-slot": "label",
      className: M(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        e
      ),
      ...t
    }
  );
}
function GN({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "textarea",
    {
      "data-slot": "textarea",
      className: M(
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
const tb = (...e) => e.filter((t, r, n) => !!t && t.trim() !== "" && n.indexOf(t) === r).join(" ").trim();
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lP = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uP = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, r, n) => n ? n.toUpperCase() : r.toLowerCase()
);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ku = (e) => {
  const t = uP(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var dP = {
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
const fP = (e) => {
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
const pP = Ic(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: n,
    className: o = "",
    children: a,
    iconNode: i,
    ...s
  }, c) => rc(
    "svg",
    {
      ref: c,
      ...dP,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: n ? Number(r) * 24 / Number(t) : r,
      className: tb("lucide", o),
      ...!a && !fP(s) && { "aria-hidden": "true" },
      ...s
    },
    [
      ...i.map(([l, u]) => rc(l, u)),
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
const Tt = (e, t) => {
  const r = Ic(
    ({ className: n, ...o }, a) => rc(pP, {
      ref: a,
      iconNode: t,
      className: tb(
        `lucide-${lP(ku(e))}`,
        `lucide-${e}`,
        n
      ),
      ...o
    })
  );
  return r.displayName = ku(e), r;
};
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hP = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], rb = Tt("check", hP);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mP = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], pl = Tt("chevron-down", mP);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gP = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]], vP = Tt("chevron-left", gP);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bP = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], nb = Tt("chevron-right", bP);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yP = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], wP = Tt("chevron-up", yP);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xP = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]], _P = Tt("circle", xP);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SP = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }]
], CP = Tt("panel-left", SP);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const OP = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], ob = Tt("x", OP);
function UN({
  ...e
}) {
  return /* @__PURE__ */ v(SO, { "data-slot": "select", ...e });
}
function KN({
  ...e
}) {
  return /* @__PURE__ */ v(OO, { "data-slot": "select-value", ...e });
}
function XN({
  className: e,
  size: t = "default",
  children: r,
  ...n
}) {
  return /* @__PURE__ */ ae(
    CO,
    {
      "data-slot": "select-trigger",
      "data-size": t,
      className: M(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...n,
      children: [
        r,
        /* @__PURE__ */ v(PO, { asChild: !0, children: /* @__PURE__ */ v(pl, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function ZN({
  className: e,
  children: t,
  position: r = "item-aligned",
  align: n = "center",
  ...o
}) {
  return /* @__PURE__ */ v(EO, { children: /* @__PURE__ */ ae(
    MO,
    {
      "data-slot": "select-content",
      className: M(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        r === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        e
      ),
      position: r,
      align: n,
      ...o,
      children: [
        /* @__PURE__ */ v(PP, {}),
        /* @__PURE__ */ v(
          TO,
          {
            className: M(
              "p-1",
              r === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children: t
          }
        ),
        /* @__PURE__ */ v(EP, {})
      ]
    }
  ) });
}
function QN({
  className: e,
  children: t,
  ...r
}) {
  return /* @__PURE__ */ ae(
    RO,
    {
      "data-slot": "select-item",
      className: M(
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
            children: /* @__PURE__ */ v(DO, { children: /* @__PURE__ */ v(rb, { className: "size-4" }) })
          }
        ),
        /* @__PURE__ */ v(kO, { children: t })
      ]
    }
  );
}
function PP({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    NO,
    {
      "data-slot": "select-scroll-up-button",
      className: M(
        "flex cursor-default items-center justify-center py-1",
        e
      ),
      ...t,
      children: /* @__PURE__ */ v(wP, { className: "size-4" })
    }
  );
}
function EP({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    AO,
    {
      "data-slot": "select-scroll-down-button",
      className: M(
        "flex cursor-default items-center justify-center py-1",
        e
      ),
      ...t,
      children: /* @__PURE__ */ v(pl, { className: "size-4" })
    }
  );
}
function JN({
  className: e,
  size: t = "default",
  ...r
}) {
  return /* @__PURE__ */ v(
    zO,
    {
      "data-slot": "switch",
      "data-size": t,
      className: M(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        e
      ),
      ...r,
      children: /* @__PURE__ */ v(
        HO,
        {
          "data-slot": "switch-thumb",
          className: M(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
function MP(e, t, r = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: e,
    timeZoneName: r
  }).format(t).split(/\s/g).slice(2).join(" ");
}
const Yo = {}, Sr = {};
function At(e, t) {
  try {
    const n = (Yo[e] || (Yo[e] = new Intl.DateTimeFormat("en-US", {
      timeZone: e,
      timeZoneName: "longOffset"
    }).format))(t).split("GMT")[1];
    return n in Sr ? Sr[n] : Du(n, n.split(":"));
  } catch {
    if (e in Sr) return Sr[e];
    const r = e == null ? void 0 : e.match(TP);
    return r ? Du(e, r.slice(1)) : NaN;
  }
}
const TP = /([+-]\d\d):?(\d\d)?/;
function Du(e, t) {
  const r = +(t[0] || 0), n = +(t[1] || 0), o = +(t[2] || 0) / 60;
  return Sr[e] = r * 60 + n > 0 ? r * 60 + n + o : r * 60 - n - o;
}
class tt extends Date {
  //#region static
  constructor(...t) {
    super(), t.length > 1 && typeof t[t.length - 1] == "string" && (this.timeZone = t.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(At(this.timeZone, this)) ? this.setTime(NaN) : t.length ? typeof t[0] == "number" && (t.length === 1 || t.length === 2 && typeof t[1] != "number") ? this.setTime(t[0]) : typeof t[0] == "string" ? this.setTime(+new Date(t[0])) : t[0] instanceof Date ? this.setTime(+t[0]) : (this.setTime(+new Date(...t)), ab(this), yc(this)) : this.setTime(Date.now());
  }
  static tz(t, ...r) {
    return r.length ? new tt(...r, t) : new tt(Date.now(), t);
  }
  //#endregion
  //#region time zone
  withTimeZone(t) {
    return new tt(+this, t);
  }
  getTimezoneOffset() {
    const t = -At(this.timeZone, this);
    return t > 0 ? Math.floor(t) : Math.ceil(t);
  }
  //#endregion
  //#region time
  setTime(t) {
    return Date.prototype.setTime.apply(this, arguments), yc(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](t) {
    return new tt(+new Date(t), this.timeZone);
  }
  //#endregion
}
const Nu = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((e) => {
  if (!Nu.test(e)) return;
  const t = e.replace(Nu, "$1UTC");
  tt.prototype[t] && (e.startsWith("get") ? tt.prototype[e] = function() {
    return this.internal[t]();
  } : (tt.prototype[e] = function() {
    return Date.prototype[t].apply(this.internal, arguments), RP(this), +this;
  }, tt.prototype[t] = function() {
    return Date.prototype[t].apply(this, arguments), yc(this), +this;
  }));
});
function yc(e) {
  e.internal.setTime(+e), e.internal.setUTCSeconds(e.internal.getUTCSeconds() - Math.round(-At(e.timeZone, e) * 60));
}
function RP(e) {
  Date.prototype.setFullYear.call(e, e.internal.getUTCFullYear(), e.internal.getUTCMonth(), e.internal.getUTCDate()), Date.prototype.setHours.call(e, e.internal.getUTCHours(), e.internal.getUTCMinutes(), e.internal.getUTCSeconds(), e.internal.getUTCMilliseconds()), ab(e);
}
function ab(e) {
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
  const f = At(e.timeZone, e), g = f > 0 ? Math.floor(f) : Math.ceil(f), m = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset() - g, h = g !== r, y = m - c;
  if (h && y) {
    Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + y);
    const w = At(e.timeZone, e), x = w > 0 ? Math.floor(w) : Math.ceil(w), _ = g - x;
    _ && (e.internal.setUTCMinutes(e.internal.getUTCMinutes() + _), Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + _));
  }
}
class _e extends tt {
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
    return `${t} GMT${r}${n}${o} (${MP(this.timeZone, this)})`;
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
const ib = 6048e5, kP = 864e5, Au = Symbol.for("constructDateFrom");
function ye(e, t) {
  return typeof e == "function" ? e(t) : e && typeof e == "object" && Au in e ? e[Au](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
function he(e, t) {
  return ye(t || e, e);
}
function sb(e, t, r) {
  const n = he(e, r == null ? void 0 : r.in);
  return isNaN(t) ? ye(e, NaN) : (t && n.setDate(n.getDate() + t), n);
}
function cb(e, t, r) {
  const n = he(e, r == null ? void 0 : r.in);
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
let DP = {};
function Qr() {
  return DP;
}
function ar(e, t) {
  var s, c, l, u;
  const r = Qr(), n = (t == null ? void 0 : t.weekStartsOn) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? r.weekStartsOn ?? ((u = (l = r.locale) == null ? void 0 : l.options) == null ? void 0 : u.weekStartsOn) ?? 0, o = he(e, t == null ? void 0 : t.in), a = o.getDay(), i = (a < n ? 7 : 0) + a - n;
  return o.setDate(o.getDate() - i), o.setHours(0, 0, 0, 0), o;
}
function Ar(e, t) {
  return ar(e, { ...t, weekStartsOn: 1 });
}
function lb(e, t) {
  const r = he(e, t == null ? void 0 : t.in), n = r.getFullYear(), o = ye(r, 0);
  o.setFullYear(n + 1, 0, 4), o.setHours(0, 0, 0, 0);
  const a = Ar(o), i = ye(r, 0);
  i.setFullYear(n, 0, 4), i.setHours(0, 0, 0, 0);
  const s = Ar(i);
  return r.getTime() >= a.getTime() ? n + 1 : r.getTime() >= s.getTime() ? n : n - 1;
}
function Iu(e) {
  const t = he(e), r = new Date(
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
function gr(e, ...t) {
  const r = ye.bind(
    null,
    t.find((n) => typeof n == "object")
  );
  return t.map(r);
}
function Ir(e, t) {
  const r = he(e, t == null ? void 0 : t.in);
  return r.setHours(0, 0, 0, 0), r;
}
function hl(e, t, r) {
  const [n, o] = gr(
    r == null ? void 0 : r.in,
    e,
    t
  ), a = Ir(n), i = Ir(o), s = +a - Iu(a), c = +i - Iu(i);
  return Math.round((s - c) / kP);
}
function NP(e, t) {
  const r = lb(e, t), n = ye(e, 0);
  return n.setFullYear(r, 0, 4), n.setHours(0, 0, 0, 0), Ar(n);
}
function AP(e, t, r) {
  return sb(e, t * 7, r);
}
function IP(e, t, r) {
  return cb(e, t * 12, r);
}
function FP(e, t) {
  let r, n = t == null ? void 0 : t.in;
  return e.forEach((o) => {
    !n && typeof o == "object" && (n = ye.bind(null, o));
    const a = he(o, n);
    (!r || r < a || isNaN(+a)) && (r = a);
  }), ye(n, r || NaN);
}
function $P(e, t) {
  let r, n = t == null ? void 0 : t.in;
  return e.forEach((o) => {
    !n && typeof o == "object" && (n = ye.bind(null, o));
    const a = he(o, n);
    (!r || r > a || isNaN(+a)) && (r = a);
  }), ye(n, r || NaN);
}
function BP(e, t, r) {
  const [n, o] = gr(
    r == null ? void 0 : r.in,
    e,
    t
  );
  return +Ir(n) == +Ir(o);
}
function ub(e) {
  return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
function WP(e) {
  return !(!ub(e) && typeof e != "number" || isNaN(+he(e)));
}
function db(e, t, r) {
  const [n, o] = gr(
    r == null ? void 0 : r.in,
    e,
    t
  ), a = n.getFullYear() - o.getFullYear(), i = n.getMonth() - o.getMonth();
  return a * 12 + i;
}
function qP(e, t) {
  const r = he(e, t == null ? void 0 : t.in), n = r.getMonth();
  return r.setFullYear(r.getFullYear(), n + 1, 0), r.setHours(23, 59, 59, 999), r;
}
function fb(e, t) {
  const [r, n] = gr(e, t.start, t.end);
  return { start: r, end: n };
}
function LP(e, t) {
  const { start: r, end: n } = fb(t == null ? void 0 : t.in, e);
  let o = +r > +n;
  const a = o ? +r : +n, i = o ? n : r;
  i.setHours(0, 0, 0, 0), i.setDate(1);
  let s = 1;
  const c = [];
  for (; +i <= a; )
    c.push(ye(r, i)), i.setMonth(i.getMonth() + s);
  return o ? c.reverse() : c;
}
function jP(e, t) {
  const r = he(e, t == null ? void 0 : t.in);
  return r.setDate(1), r.setHours(0, 0, 0, 0), r;
}
function zP(e, t) {
  const r = he(e, t == null ? void 0 : t.in), n = r.getFullYear();
  return r.setFullYear(n + 1, 0, 0), r.setHours(23, 59, 59, 999), r;
}
function pb(e, t) {
  const r = he(e, t == null ? void 0 : t.in);
  return r.setFullYear(r.getFullYear(), 0, 1), r.setHours(0, 0, 0, 0), r;
}
function HP(e, t) {
  const { start: r, end: n } = fb(t == null ? void 0 : t.in, e);
  let o = +r > +n;
  const a = o ? +r : +n, i = o ? n : r;
  i.setHours(0, 0, 0, 0), i.setMonth(0, 1);
  let s = 1;
  const c = [];
  for (; +i <= a; )
    c.push(ye(r, i)), i.setFullYear(i.getFullYear() + s);
  return o ? c.reverse() : c;
}
function hb(e, t) {
  var s, c, l, u;
  const r = Qr(), n = (t == null ? void 0 : t.weekStartsOn) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? r.weekStartsOn ?? ((u = (l = r.locale) == null ? void 0 : l.options) == null ? void 0 : u.weekStartsOn) ?? 0, o = he(e, t == null ? void 0 : t.in), a = o.getDay(), i = (a < n ? -7 : 0) + 6 - (a - n);
  return o.setDate(o.getDate() + i), o.setHours(23, 59, 59, 999), o;
}
function YP(e, t) {
  return hb(e, { ...t, weekStartsOn: 1 });
}
const VP = {
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
}, GP = (e, t, r) => {
  let n;
  const o = VP[e];
  return typeof o == "string" ? n = o : t === 1 ? n = o.one : n = o.other.replace("{{count}}", t.toString()), r != null && r.addSuffix ? r.comparison && r.comparison > 0 ? "in " + n : n + " ago" : n;
};
function Vo(e) {
  return (t = {}) => {
    const r = t.width ? String(t.width) : e.defaultWidth;
    return e.formats[r] || e.formats[e.defaultWidth];
  };
}
const UP = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, KP = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, XP = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, ZP = {
  date: Vo({
    formats: UP,
    defaultWidth: "full"
  }),
  time: Vo({
    formats: KP,
    defaultWidth: "full"
  }),
  dateTime: Vo({
    formats: XP,
    defaultWidth: "full"
  })
}, QP = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, JP = (e, t, r, n) => QP[e];
function br(e) {
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
const eE = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, tE = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, rE = {
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
}, nE = {
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
}, oE = {
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
}, aE = {
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
}, iE = (e, t) => {
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
}, sE = {
  ordinalNumber: iE,
  era: br({
    values: eE,
    defaultWidth: "wide"
  }),
  quarter: br({
    values: tE,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: br({
    values: rE,
    defaultWidth: "wide"
  }),
  day: br({
    values: nE,
    defaultWidth: "wide"
  }),
  dayPeriod: br({
    values: oE,
    defaultWidth: "wide",
    formattingValues: aE,
    defaultFormattingWidth: "wide"
  })
};
function yr(e) {
  return (t, r = {}) => {
    const n = r.width, o = n && e.matchPatterns[n] || e.matchPatterns[e.defaultMatchWidth], a = t.match(o);
    if (!a)
      return null;
    const i = a[0], s = n && e.parsePatterns[n] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(s) ? lE(s, (d) => d.test(i)) : (
      // [TODO] -- I challenge you to fix the type
      cE(s, (d) => d.test(i))
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
function cE(e, t) {
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r) && t(e[r]))
      return r;
}
function lE(e, t) {
  for (let r = 0; r < e.length; r++)
    if (t(e[r]))
      return r;
}
function uE(e) {
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
const dE = /^(\d+)(th|st|nd|rd)?/i, fE = /\d+/i, pE = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, hE = {
  any: [/^b/i, /^(a|c)/i]
}, mE = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, gE = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, vE = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, bE = {
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
}, yE = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, wE = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, xE = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, _E = {
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
}, SE = {
  ordinalNumber: uE({
    matchPattern: dE,
    parsePattern: fE,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: yr({
    matchPatterns: pE,
    defaultMatchWidth: "wide",
    parsePatterns: hE,
    defaultParseWidth: "any"
  }),
  quarter: yr({
    matchPatterns: mE,
    defaultMatchWidth: "wide",
    parsePatterns: gE,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: yr({
    matchPatterns: vE,
    defaultMatchWidth: "wide",
    parsePatterns: bE,
    defaultParseWidth: "any"
  }),
  day: yr({
    matchPatterns: yE,
    defaultMatchWidth: "wide",
    parsePatterns: wE,
    defaultParseWidth: "any"
  }),
  dayPeriod: yr({
    matchPatterns: xE,
    defaultMatchWidth: "any",
    parsePatterns: _E,
    defaultParseWidth: "any"
  })
}, Qt = {
  code: "en-US",
  formatDistance: GP,
  formatLong: ZP,
  formatRelative: JP,
  localize: sE,
  match: SE,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function CE(e, t) {
  const r = he(e, t == null ? void 0 : t.in);
  return hl(r, pb(r)) + 1;
}
function ml(e, t) {
  const r = he(e, t == null ? void 0 : t.in), n = +Ar(r) - +NP(r);
  return Math.round(n / ib) + 1;
}
function mb(e, t) {
  var u, d, f, g;
  const r = he(e, t == null ? void 0 : t.in), n = r.getFullYear(), o = Qr(), a = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((d = (u = t == null ? void 0 : t.locale) == null ? void 0 : u.options) == null ? void 0 : d.firstWeekContainsDate) ?? o.firstWeekContainsDate ?? ((g = (f = o.locale) == null ? void 0 : f.options) == null ? void 0 : g.firstWeekContainsDate) ?? 1, i = ye((t == null ? void 0 : t.in) || e, 0);
  i.setFullYear(n + 1, 0, a), i.setHours(0, 0, 0, 0);
  const s = ar(i, t), c = ye((t == null ? void 0 : t.in) || e, 0);
  c.setFullYear(n, 0, a), c.setHours(0, 0, 0, 0);
  const l = ar(c, t);
  return +r >= +s ? n + 1 : +r >= +l ? n : n - 1;
}
function OE(e, t) {
  var s, c, l, u;
  const r = Qr(), n = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.firstWeekContainsDate) ?? r.firstWeekContainsDate ?? ((u = (l = r.locale) == null ? void 0 : l.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, o = mb(e, t), a = ye((t == null ? void 0 : t.in) || e, 0);
  return a.setFullYear(o, 0, n), a.setHours(0, 0, 0, 0), ar(a, t);
}
function gl(e, t) {
  const r = he(e, t == null ? void 0 : t.in), n = +ar(r, t) - +OE(r, t);
  return Math.round(n / ib) + 1;
}
function pe(e, t) {
  const r = e < 0 ? "-" : "", n = Math.abs(e).toString().padStart(t, "0");
  return r + n;
}
const bt = {
  // Year
  y(e, t) {
    const r = e.getFullYear(), n = r > 0 ? r : 1 - r;
    return pe(t === "yy" ? n % 100 : n, t.length);
  },
  // Month
  M(e, t) {
    const r = e.getMonth();
    return t === "M" ? String(r + 1) : pe(r + 1, 2);
  },
  // Day of the month
  d(e, t) {
    return pe(e.getDate(), t.length);
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
    return pe(e.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(e, t) {
    return pe(e.getHours(), t.length);
  },
  // Minute
  m(e, t) {
    return pe(e.getMinutes(), t.length);
  },
  // Second
  s(e, t) {
    return pe(e.getSeconds(), t.length);
  },
  // Fraction of second
  S(e, t) {
    const r = t.length, n = e.getMilliseconds(), o = Math.trunc(
      n * Math.pow(10, r - 3)
    );
    return pe(o, t.length);
  }
}, Xt = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, Fu = {
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
    return bt.y(e, t);
  },
  // Local week-numbering year
  Y: function(e, t, r, n) {
    const o = mb(e, n), a = o > 0 ? o : 1 - o;
    if (t === "YY") {
      const i = a % 100;
      return pe(i, 2);
    }
    return t === "Yo" ? r.ordinalNumber(a, { unit: "year" }) : pe(a, t.length);
  },
  // ISO week-numbering year
  R: function(e, t) {
    const r = lb(e);
    return pe(r, t.length);
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
    return pe(r, t.length);
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
        return pe(n, 2);
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
        return pe(n, 2);
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
        return bt.M(e, t);
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
        return pe(n + 1, 2);
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
    const o = gl(e, n);
    return t === "wo" ? r.ordinalNumber(o, { unit: "week" }) : pe(o, t.length);
  },
  // ISO week of year
  I: function(e, t, r) {
    const n = ml(e);
    return t === "Io" ? r.ordinalNumber(n, { unit: "week" }) : pe(n, t.length);
  },
  // Day of the month
  d: function(e, t, r) {
    return t === "do" ? r.ordinalNumber(e.getDate(), { unit: "date" }) : bt.d(e, t);
  },
  // Day of year
  D: function(e, t, r) {
    const n = CE(e);
    return t === "Do" ? r.ordinalNumber(n, { unit: "dayOfYear" }) : pe(n, t.length);
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
        return pe(a, 2);
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
        return pe(a, t.length);
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
        return pe(o, t.length);
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
    switch (n === 12 ? o = Xt.noon : n === 0 ? o = Xt.midnight : o = n / 12 >= 1 ? "pm" : "am", t) {
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
    switch (n >= 17 ? o = Xt.evening : n >= 12 ? o = Xt.afternoon : n >= 4 ? o = Xt.morning : o = Xt.night, t) {
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
    return bt.h(e, t);
  },
  // Hour [0-23]
  H: function(e, t, r) {
    return t === "Ho" ? r.ordinalNumber(e.getHours(), { unit: "hour" }) : bt.H(e, t);
  },
  // Hour [0-11]
  K: function(e, t, r) {
    const n = e.getHours() % 12;
    return t === "Ko" ? r.ordinalNumber(n, { unit: "hour" }) : pe(n, t.length);
  },
  // Hour [1-24]
  k: function(e, t, r) {
    let n = e.getHours();
    return n === 0 && (n = 24), t === "ko" ? r.ordinalNumber(n, { unit: "hour" }) : pe(n, t.length);
  },
  // Minute
  m: function(e, t, r) {
    return t === "mo" ? r.ordinalNumber(e.getMinutes(), { unit: "minute" }) : bt.m(e, t);
  },
  // Second
  s: function(e, t, r) {
    return t === "so" ? r.ordinalNumber(e.getSeconds(), { unit: "second" }) : bt.s(e, t);
  },
  // Fraction of second
  S: function(e, t) {
    return bt.S(e, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(e, t, r) {
    const n = e.getTimezoneOffset();
    if (n === 0)
      return "Z";
    switch (t) {
      // Hours and optional minutes
      case "X":
        return Bu(n);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return Dt(n);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX":
      // Hours and minutes with `:` delimiter
      default:
        return Dt(n, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(e, t, r) {
    const n = e.getTimezoneOffset();
    switch (t) {
      // Hours and optional minutes
      case "x":
        return Bu(n);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return Dt(n);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx":
      // Hours and minutes with `:` delimiter
      default:
        return Dt(n, ":");
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
        return "GMT" + $u(n, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + Dt(n, ":");
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
        return "GMT" + $u(n, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + Dt(n, ":");
    }
  },
  // Seconds timestamp
  t: function(e, t, r) {
    const n = Math.trunc(+e / 1e3);
    return pe(n, t.length);
  },
  // Milliseconds timestamp
  T: function(e, t, r) {
    return pe(+e, t.length);
  }
};
function $u(e, t = "") {
  const r = e > 0 ? "-" : "+", n = Math.abs(e), o = Math.trunc(n / 60), a = n % 60;
  return a === 0 ? r + String(o) : r + String(o) + t + pe(a, 2);
}
function Bu(e, t) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + pe(Math.abs(e) / 60, 2) : Dt(e, t);
}
function Dt(e, t = "") {
  const r = e > 0 ? "-" : "+", n = Math.abs(e), o = pe(Math.trunc(n / 60), 2), a = pe(n % 60, 2);
  return r + o + t + a;
}
const Wu = (e, t) => {
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
}, gb = (e, t) => {
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
}, PE = (e, t) => {
  const r = e.match(/(P+)(p+)?/) || [], n = r[1], o = r[2];
  if (!o)
    return Wu(e, t);
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
  return a.replace("{{date}}", Wu(n, t)).replace("{{time}}", gb(o, t));
}, EE = {
  p: gb,
  P: PE
}, ME = /^D+$/, TE = /^Y+$/, RE = ["D", "DD", "YY", "YYYY"];
function kE(e) {
  return ME.test(e);
}
function DE(e) {
  return TE.test(e);
}
function NE(e, t, r) {
  const n = AE(e, t, r);
  if (console.warn(n), RE.includes(e)) throw new RangeError(n);
}
function AE(e, t, r) {
  const n = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${n} to the input \`${r}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const IE = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, FE = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, $E = /^'([^]*?)'?$/, BE = /''/g, WE = /[a-zA-Z]/;
function Cr(e, t, r) {
  var u, d, f, g, b, m, h, y;
  const n = Qr(), o = (r == null ? void 0 : r.locale) ?? n.locale ?? Qt, a = (r == null ? void 0 : r.firstWeekContainsDate) ?? ((d = (u = r == null ? void 0 : r.locale) == null ? void 0 : u.options) == null ? void 0 : d.firstWeekContainsDate) ?? n.firstWeekContainsDate ?? ((g = (f = n.locale) == null ? void 0 : f.options) == null ? void 0 : g.firstWeekContainsDate) ?? 1, i = (r == null ? void 0 : r.weekStartsOn) ?? ((m = (b = r == null ? void 0 : r.locale) == null ? void 0 : b.options) == null ? void 0 : m.weekStartsOn) ?? n.weekStartsOn ?? ((y = (h = n.locale) == null ? void 0 : h.options) == null ? void 0 : y.weekStartsOn) ?? 0, s = he(e, r == null ? void 0 : r.in);
  if (!WP(s))
    throw new RangeError("Invalid time value");
  let c = t.match(FE).map((w) => {
    const x = w[0];
    if (x === "p" || x === "P") {
      const _ = EE[x];
      return _(w, o.formatLong);
    }
    return w;
  }).join("").match(IE).map((w) => {
    if (w === "''")
      return { isToken: !1, value: "'" };
    const x = w[0];
    if (x === "'")
      return { isToken: !1, value: qE(w) };
    if (Fu[x])
      return { isToken: !0, value: w };
    if (x.match(WE))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + x + "`"
      );
    return { isToken: !1, value: w };
  });
  o.localize.preprocessor && (c = o.localize.preprocessor(s, c));
  const l = {
    firstWeekContainsDate: a,
    weekStartsOn: i,
    locale: o
  };
  return c.map((w) => {
    if (!w.isToken) return w.value;
    const x = w.value;
    (!(r != null && r.useAdditionalWeekYearTokens) && DE(x) || !(r != null && r.useAdditionalDayOfYearTokens) && kE(x)) && NE(x, t, String(e));
    const _ = Fu[x[0]];
    return _(s, x, o.localize, l);
  }).join("");
}
function qE(e) {
  const t = e.match($E);
  return t ? t[1].replace(BE, "'") : e;
}
function LE(e, t) {
  const r = he(e, t == null ? void 0 : t.in), n = r.getFullYear(), o = r.getMonth(), a = ye(r, 0);
  return a.setFullYear(n, o + 1, 0), a.setHours(0, 0, 0, 0), a.getDate();
}
function jE(e, t) {
  return he(e, t == null ? void 0 : t.in).getMonth();
}
function zE(e, t) {
  return he(e, t == null ? void 0 : t.in).getFullYear();
}
function HE(e, t) {
  return +he(e) > +he(t);
}
function YE(e, t) {
  return +he(e) < +he(t);
}
function VE(e, t, r) {
  const [n, o] = gr(
    r == null ? void 0 : r.in,
    e,
    t
  );
  return n.getFullYear() === o.getFullYear() && n.getMonth() === o.getMonth();
}
function GE(e, t, r) {
  const [n, o] = gr(
    r == null ? void 0 : r.in,
    e,
    t
  );
  return n.getFullYear() === o.getFullYear();
}
function UE(e, t, r) {
  const n = he(e, r == null ? void 0 : r.in), o = n.getFullYear(), a = n.getDate(), i = ye(e, 0);
  i.setFullYear(o, t, 15), i.setHours(0, 0, 0, 0);
  const s = LE(i);
  return n.setMonth(t, Math.min(a, s)), n;
}
function KE(e, t, r) {
  const n = he(e, r == null ? void 0 : r.in);
  return isNaN(+n) ? ye(e, NaN) : (n.setFullYear(t), n);
}
const qu = 5, XE = 4;
function ZE(e, t) {
  const r = t.startOfMonth(e), n = r.getDay() > 0 ? r.getDay() : 7, o = t.addDays(e, -n + 1), a = t.addDays(o, qu * 7 - 1);
  return t.getMonth(e) === t.getMonth(a) ? qu : XE;
}
function vb(e, t) {
  const r = t.startOfMonth(e), n = r.getDay();
  return n === 1 ? r : n === 0 ? t.addDays(r, -6) : t.addDays(r, -1 * (n - 1));
}
function QE(e, t) {
  const r = vb(e, t), n = ZE(e, t);
  return t.addDays(r, n * 7 - 1);
}
const bb = {
  ...Qt,
  labels: {
    labelDayButton: (e, t, r, n) => {
      let o;
      n && typeof n.format == "function" ? o = n.format.bind(n) : o = (i, s) => Cr(i, s, { locale: Qt, ...r });
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
      return r && typeof r.format == "function" ? n = r.format.bind(r) : n = (o, a) => Cr(o, a, { locale: Qt, ...t }), n(e, "LLLL yyyy");
    },
    labelGridcell: (e, t, r, n) => {
      let o;
      n && typeof n.format == "function" ? o = n.format.bind(n) : o = (i, s) => Cr(i, s, { locale: Qt, ...r });
      let a = o(e, "PPPP");
      return t != null && t.today && (a = `Today, ${a}`), a;
    },
    labelNav: "Navigation bar",
    labelWeekNumberHeader: "Week Number",
    labelWeekday: (e, t, r) => {
      let n;
      return r && typeof r.format == "function" ? n = r.format.bind(r) : n = (o, a) => Cr(o, a, { locale: Qt, ...t }), n(e, "cccc");
    }
  }
};
class ke {
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
      return (a = this.overrides) != null && a.addDays ? this.overrides.addDays(n, o) : sb(n, o);
    }, this.addMonths = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.addMonths ? this.overrides.addMonths(n, o) : cb(n, o);
    }, this.addWeeks = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.addWeeks ? this.overrides.addWeeks(n, o) : AP(n, o);
    }, this.addYears = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.addYears ? this.overrides.addYears(n, o) : IP(n, o);
    }, this.differenceInCalendarDays = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(n, o) : hl(n, o);
    }, this.differenceInCalendarMonths = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(n, o) : db(n, o);
    }, this.eachMonthOfInterval = (n) => {
      var o;
      return (o = this.overrides) != null && o.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(n) : LP(n);
    }, this.eachYearOfInterval = (n) => {
      var s;
      const o = (s = this.overrides) != null && s.eachYearOfInterval ? this.overrides.eachYearOfInterval(n) : HP(n), a = new Set(o.map((c) => this.getYear(c)));
      if (a.size === o.length)
        return o;
      const i = [];
      return a.forEach((c) => {
        i.push(new Date(c, 0, 1));
      }), i;
    }, this.endOfBroadcastWeek = (n) => {
      var o;
      return (o = this.overrides) != null && o.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(n) : QE(n, this);
    }, this.endOfISOWeek = (n) => {
      var o;
      return (o = this.overrides) != null && o.endOfISOWeek ? this.overrides.endOfISOWeek(n) : YP(n);
    }, this.endOfMonth = (n) => {
      var o;
      return (o = this.overrides) != null && o.endOfMonth ? this.overrides.endOfMonth(n) : qP(n);
    }, this.endOfWeek = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.endOfWeek ? this.overrides.endOfWeek(n, o) : hb(n, this.options);
    }, this.endOfYear = (n) => {
      var o;
      return (o = this.overrides) != null && o.endOfYear ? this.overrides.endOfYear(n) : zP(n);
    }, this.format = (n, o, a) => {
      var s;
      const i = (s = this.overrides) != null && s.format ? this.overrides.format(n, o, this.options) : Cr(n, o, this.options);
      return this.options.numerals && this.options.numerals !== "latn" ? this.replaceDigits(i) : i;
    }, this.getISOWeek = (n) => {
      var o;
      return (o = this.overrides) != null && o.getISOWeek ? this.overrides.getISOWeek(n) : ml(n);
    }, this.getMonth = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.getMonth ? this.overrides.getMonth(n, this.options) : jE(n, this.options);
    }, this.getYear = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.getYear ? this.overrides.getYear(n, this.options) : zE(n, this.options);
    }, this.getWeek = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.getWeek ? this.overrides.getWeek(n, this.options) : gl(n, this.options);
    }, this.isAfter = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.isAfter ? this.overrides.isAfter(n, o) : HE(n, o);
    }, this.isBefore = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.isBefore ? this.overrides.isBefore(n, o) : YE(n, o);
    }, this.isDate = (n) => {
      var o;
      return (o = this.overrides) != null && o.isDate ? this.overrides.isDate(n) : ub(n);
    }, this.isSameDay = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.isSameDay ? this.overrides.isSameDay(n, o) : BP(n, o);
    }, this.isSameMonth = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.isSameMonth ? this.overrides.isSameMonth(n, o) : VE(n, o);
    }, this.isSameYear = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.isSameYear ? this.overrides.isSameYear(n, o) : GE(n, o);
    }, this.max = (n) => {
      var o;
      return (o = this.overrides) != null && o.max ? this.overrides.max(n) : FP(n);
    }, this.min = (n) => {
      var o;
      return (o = this.overrides) != null && o.min ? this.overrides.min(n) : $P(n);
    }, this.setMonth = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.setMonth ? this.overrides.setMonth(n, o) : UE(n, o);
    }, this.setYear = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.setYear ? this.overrides.setYear(n, o) : KE(n, o);
    }, this.startOfBroadcastWeek = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(n, this) : vb(n, this);
    }, this.startOfDay = (n) => {
      var o;
      return (o = this.overrides) != null && o.startOfDay ? this.overrides.startOfDay(n) : Ir(n);
    }, this.startOfISOWeek = (n) => {
      var o;
      return (o = this.overrides) != null && o.startOfISOWeek ? this.overrides.startOfISOWeek(n) : Ar(n);
    }, this.startOfMonth = (n) => {
      var o;
      return (o = this.overrides) != null && o.startOfMonth ? this.overrides.startOfMonth(n) : jP(n);
    }, this.startOfWeek = (n, o) => {
      var a;
      return (a = this.overrides) != null && a.startOfWeek ? this.overrides.startOfWeek(n, this.options) : ar(n, this.options);
    }, this.startOfYear = (n) => {
      var o;
      return (o = this.overrides) != null && o.startOfYear ? this.overrides.startOfYear(n) : pb(n);
    }, this.options = { locale: bb, ...t }, this.overrides = r;
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
    return t && ke.yearFirstLocales.has(t) ? "year-first" : "month-first";
  }
  /**
   * Formats the month/year pair respecting locale conventions.
   *
   * @since 9.11.0
   */
  formatMonthYear(t) {
    const { locale: r, timeZone: n, numerals: o } = this.options, a = r == null ? void 0 : r.code;
    if (a && ke.yearFirstLocales.has(a))
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
ke.yearFirstLocales = /* @__PURE__ */ new Set([
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
const st = new ke();
class yb {
  constructor(t, r, n = st) {
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
class JE {
  constructor(t, r) {
    this.date = t, this.weeks = r;
  }
}
class eM {
  constructor(t, r) {
    this.days = r, this.weekNumber = t;
  }
}
function tM(e) {
  return E.createElement("button", { ...e });
}
function rM(e) {
  return E.createElement("span", { ...e });
}
function nM(e) {
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
function oM(e) {
  const { day: t, modifiers: r, ...n } = e;
  return E.createElement("td", { ...n });
}
function aM(e) {
  const { day: t, modifiers: r, ...n } = e, o = E.useRef(null);
  return E.useEffect(() => {
    var a;
    r.focused && ((a = o.current) == null || a.focus());
  }, [r.focused]), E.createElement("button", { ref: o, ...n });
}
var V;
(function(e) {
  e.Root = "root", e.Chevron = "chevron", e.Day = "day", e.DayButton = "day_button", e.CaptionLabel = "caption_label", e.Dropdowns = "dropdowns", e.Dropdown = "dropdown", e.DropdownRoot = "dropdown_root", e.Footer = "footer", e.MonthGrid = "month_grid", e.MonthCaption = "month_caption", e.MonthsDropdown = "months_dropdown", e.Month = "month", e.Months = "months", e.Nav = "nav", e.NextMonthButton = "button_next", e.PreviousMonthButton = "button_previous", e.Week = "week", e.Weeks = "weeks", e.Weekday = "weekday", e.Weekdays = "weekdays", e.WeekNumber = "week_number", e.WeekNumberHeader = "week_number_header", e.YearsDropdown = "years_dropdown";
})(V || (V = {}));
var ve;
(function(e) {
  e.disabled = "disabled", e.hidden = "hidden", e.outside = "outside", e.focused = "focused", e.today = "today";
})(ve || (ve = {}));
var Ye;
(function(e) {
  e.range_end = "range_end", e.range_middle = "range_middle", e.range_start = "range_start", e.selected = "selected";
})(Ye || (Ye = {}));
var Me;
(function(e) {
  e.weeks_before_enter = "weeks_before_enter", e.weeks_before_exit = "weeks_before_exit", e.weeks_after_enter = "weeks_after_enter", e.weeks_after_exit = "weeks_after_exit", e.caption_after_enter = "caption_after_enter", e.caption_after_exit = "caption_after_exit", e.caption_before_enter = "caption_before_enter", e.caption_before_exit = "caption_before_exit";
})(Me || (Me = {}));
function iM(e) {
  const { options: t, className: r, components: n, classNames: o, ...a } = e, i = [o[V.Dropdown], r].join(" "), s = t == null ? void 0 : t.find(({ value: c }) => c === a.value);
  return E.createElement(
    "span",
    { "data-disabled": a.disabled, className: o[V.DropdownRoot] },
    E.createElement(n.Select, { className: i, ...a }, t == null ? void 0 : t.map(({ value: c, label: l, disabled: u }) => E.createElement(n.Option, { key: c, value: c, disabled: u }, l))),
    E.createElement(
      "span",
      { className: o[V.CaptionLabel], "aria-hidden": !0 },
      s == null ? void 0 : s.label,
      E.createElement(n.Chevron, { orientation: "down", size: 18, className: o[V.Chevron] })
    )
  );
}
function sM(e) {
  return E.createElement("div", { ...e });
}
function cM(e) {
  return E.createElement("div", { ...e });
}
function lM(e) {
  const { calendarMonth: t, displayIndex: r, ...n } = e;
  return E.createElement("div", { ...n }, e.children);
}
function uM(e) {
  const { calendarMonth: t, displayIndex: r, ...n } = e;
  return E.createElement("div", { ...n });
}
function dM(e) {
  return E.createElement("table", { ...e });
}
function fM(e) {
  return E.createElement("div", { ...e });
}
const wb = Zy(void 0);
function Jr() {
  const e = Qy(wb);
  if (e === void 0)
    throw new Error("useDayPicker() must be used within a custom component.");
  return e;
}
function pM(e) {
  const { components: t } = Jr();
  return E.createElement(t.Dropdown, { ...e });
}
function hM(e) {
  const { onPreviousClick: t, onNextClick: r, previousMonth: n, nextMonth: o, ...a } = e, { components: i, classNames: s, labels: { labelPrevious: c, labelNext: l } } = Jr(), u = Ee((f) => {
    o && (r == null || r(f));
  }, [o, r]), d = Ee((f) => {
    n && (t == null || t(f));
  }, [n, t]);
  return E.createElement(
    "nav",
    { ...a },
    E.createElement(
      i.PreviousMonthButton,
      { type: "button", className: s[V.PreviousMonthButton], tabIndex: n ? void 0 : -1, "aria-disabled": n ? void 0 : !0, "aria-label": c(n), onClick: d },
      E.createElement(i.Chevron, { disabled: n ? void 0 : !0, className: s[V.Chevron], orientation: "left" })
    ),
    E.createElement(
      i.NextMonthButton,
      { type: "button", className: s[V.NextMonthButton], tabIndex: o ? void 0 : -1, "aria-disabled": o ? void 0 : !0, "aria-label": l(o), onClick: u },
      E.createElement(i.Chevron, { disabled: o ? void 0 : !0, orientation: "right", className: s[V.Chevron] })
    )
  );
}
function mM(e) {
  const { components: t } = Jr();
  return E.createElement(t.Button, { ...e });
}
function gM(e) {
  return E.createElement("option", { ...e });
}
function vM(e) {
  const { components: t } = Jr();
  return E.createElement(t.Button, { ...e });
}
function bM(e) {
  const { rootRef: t, ...r } = e;
  return E.createElement("div", { ...r, ref: t });
}
function yM(e) {
  return E.createElement("select", { ...e });
}
function wM(e) {
  const { week: t, ...r } = e;
  return E.createElement("tr", { ...r });
}
function xM(e) {
  return E.createElement("th", { ...e });
}
function _M(e) {
  return E.createElement(
    "thead",
    { "aria-hidden": !0 },
    E.createElement("tr", { ...e })
  );
}
function SM(e) {
  const { week: t, ...r } = e;
  return E.createElement("th", { ...r });
}
function CM(e) {
  return E.createElement("th", { ...e });
}
function OM(e) {
  return E.createElement("tbody", { ...e });
}
function PM(e) {
  const { components: t } = Jr();
  return E.createElement(t.Dropdown, { ...e });
}
const EM = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Button: tM,
  CaptionLabel: rM,
  Chevron: nM,
  Day: oM,
  DayButton: aM,
  Dropdown: iM,
  DropdownNav: sM,
  Footer: cM,
  Month: lM,
  MonthCaption: uM,
  MonthGrid: dM,
  Months: fM,
  MonthsDropdown: pM,
  Nav: hM,
  NextMonthButton: mM,
  Option: gM,
  PreviousMonthButton: vM,
  Root: bM,
  Select: yM,
  Week: wM,
  WeekNumber: SM,
  WeekNumberHeader: CM,
  Weekday: xM,
  Weekdays: _M,
  Weeks: OM,
  YearsDropdown: PM
}, Symbol.toStringTag, { value: "Module" }));
function dt(e, t, r = !1, n = st) {
  let { from: o, to: a } = e;
  const { differenceInCalendarDays: i, isSameDay: s } = n;
  return o && a ? (i(a, o) < 0 && ([o, a] = [a, o]), i(t, o) >= (r ? 1 : 0) && i(a, t) >= (r ? 1 : 0)) : !r && a ? s(a, t) : !r && o ? s(o, t) : !1;
}
function vl(e) {
  return !!(e && typeof e == "object" && "before" in e && "after" in e);
}
function ho(e) {
  return !!(e && typeof e == "object" && "from" in e);
}
function bl(e) {
  return !!(e && typeof e == "object" && "after" in e);
}
function yl(e) {
  return !!(e && typeof e == "object" && "before" in e);
}
function xb(e) {
  return !!(e && typeof e == "object" && "dayOfWeek" in e);
}
function _b(e, t) {
  return Array.isArray(e) && e.every(t.isDate);
}
function ft(e, t, r = st) {
  const n = Array.isArray(t) ? t : [t], { isSameDay: o, differenceInCalendarDays: a, isAfter: i } = r;
  return n.some((s) => {
    if (typeof s == "boolean")
      return s;
    if (r.isDate(s))
      return o(e, s);
    if (_b(s, r))
      return s.some((c) => o(e, c));
    if (ho(s))
      return dt(s, e, !1, r);
    if (xb(s))
      return Array.isArray(s.dayOfWeek) ? s.dayOfWeek.includes(e.getDay()) : s.dayOfWeek === e.getDay();
    if (vl(s)) {
      const c = a(s.before, e), l = a(s.after, e), u = c > 0, d = l < 0;
      return i(s.before, s.after) ? d && u : u || d;
    }
    return bl(s) ? a(e, s.after) > 0 : yl(s) ? a(s.before, e) > 0 : typeof s == "function" ? s(e) : !1;
  });
}
function MM(e, t, r, n, o) {
  const { disabled: a, hidden: i, modifiers: s, showOutsideDays: c, broadcastCalendar: l, today: u = o.today() } = t, { isSameDay: d, isSameMonth: f, startOfMonth: g, isBefore: b, endOfMonth: m, isAfter: h } = o, y = r && g(r), w = n && m(n), x = {
    [ve.focused]: [],
    [ve.outside]: [],
    [ve.disabled]: [],
    [ve.hidden]: [],
    [ve.today]: []
  }, _ = {};
  for (const C of e) {
    const { date: S, displayMonth: O } = C, P = !!(O && !f(S, O)), T = !!(y && b(S, y)), A = !!(w && h(S, w)), k = !!(a && ft(S, a, o)), q = !!(i && ft(S, i, o)) || T || A || // Broadcast calendar will show outside days as default
    !l && !c && P || l && c === !1 && P, D = d(S, u);
    P && x.outside.push(C), k && x.disabled.push(C), q && x.hidden.push(C), D && x.today.push(C), s && Object.keys(s).forEach((F) => {
      const $ = s == null ? void 0 : s[F];
      $ && ft(S, $, o) && (_[F] ? _[F].push(C) : _[F] = [C]);
    });
  }
  return (C) => {
    const S = {
      [ve.focused]: !1,
      [ve.disabled]: !1,
      [ve.hidden]: !1,
      [ve.outside]: !1,
      [ve.today]: !1
    }, O = {};
    for (const P in x) {
      const T = x[P];
      S[P] = T.some((A) => A === C);
    }
    for (const P in _)
      O[P] = _[P].some((T) => T === C);
    return {
      ...S,
      // custom modifiers should override all the previous ones
      ...O
    };
  };
}
function TM(e, t, r = {}) {
  return Object.entries(e).filter(([, o]) => o === !0).reduce((o, [a]) => (r[a] ? o.push(r[a]) : t[ve[a]] ? o.push(t[ve[a]]) : t[Ye[a]] && o.push(t[Ye[a]]), o), [t[V.Day]]);
}
function RM(e) {
  return {
    ...EM,
    ...e
  };
}
function kM(e) {
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
function wl() {
  const e = {};
  for (const t in V)
    e[V[t]] = `rdp-${V[t]}`;
  for (const t in ve)
    e[ve[t]] = `rdp-${ve[t]}`;
  for (const t in Ye)
    e[Ye[t]] = `rdp-${Ye[t]}`;
  for (const t in Me)
    e[Me[t]] = `rdp-${Me[t]}`;
  return e;
}
function Sb(e, t, r) {
  return (r ?? new ke(t)).formatMonthYear(e);
}
const DM = Sb;
function NM(e, t, r) {
  return (r ?? new ke(t)).format(e, "d");
}
function AM(e, t = st) {
  return t.format(e, "LLLL");
}
function IM(e, t, r) {
  return (r ?? new ke(t)).format(e, "cccccc");
}
function FM(e, t = st) {
  return e < 10 ? t.formatNumber(`0${e.toLocaleString()}`) : t.formatNumber(`${e.toLocaleString()}`);
}
function $M() {
  return "";
}
function Cb(e, t = st) {
  return t.format(e, "yyyy");
}
const BM = Cb, WM = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  formatCaption: Sb,
  formatDay: NM,
  formatMonthCaption: DM,
  formatMonthDropdown: AM,
  formatWeekNumber: FM,
  formatWeekNumberHeader: $M,
  formatWeekdayName: IM,
  formatYearCaption: BM,
  formatYearDropdown: Cb
}, Symbol.toStringTag, { value: "Module" }));
function qM(e) {
  return e != null && e.formatMonthCaption && !e.formatCaption && (e.formatCaption = e.formatMonthCaption), e != null && e.formatYearCaption && !e.formatYearDropdown && (e.formatYearDropdown = e.formatYearCaption), {
    ...WM,
    ...e
  };
}
function xl(e, t, r, n) {
  let o = (n ?? new ke(r)).format(e, "PPPP");
  return t.today && (o = `Today, ${o}`), t.selected && (o = `${o}, selected`), o;
}
const LM = xl;
function _l(e, t, r) {
  return (r ?? new ke(t)).formatMonthYear(e);
}
const jM = _l;
function Ob(e, t, r, n) {
  let o = (n ?? new ke(r)).format(e, "PPPP");
  return t != null && t.today && (o = `Today, ${o}`), o;
}
function Pb(e) {
  return "Choose the Month";
}
function Eb() {
  return "";
}
const zM = "Go to the Next Month";
function Mb(e, t) {
  return zM;
}
function Tb(e) {
  return "Go to the Previous Month";
}
function Rb(e, t, r) {
  return (r ?? new ke(t)).format(e, "cccc");
}
function kb(e, t) {
  return `Week ${e}`;
}
function Db(e) {
  return "Week Number";
}
function Nb(e) {
  return "Choose the Year";
}
const HM = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  labelCaption: jM,
  labelDay: LM,
  labelDayButton: xl,
  labelGrid: _l,
  labelGridcell: Ob,
  labelMonthDropdown: Pb,
  labelNav: Eb,
  labelNext: Mb,
  labelPrevious: Tb,
  labelWeekNumber: kb,
  labelWeekNumberHeader: Db,
  labelWeekday: Rb,
  labelYearDropdown: Nb
}, Symbol.toStringTag, { value: "Module" })), je = (e, t, r) => t || (r ? typeof r == "function" ? r : (...n) => r : e);
function YM(e, t) {
  var n;
  const r = ((n = t.locale) == null ? void 0 : n.labels) ?? {};
  return {
    ...HM,
    ...e ?? {},
    labelDayButton: je(xl, e == null ? void 0 : e.labelDayButton, r.labelDayButton),
    labelMonthDropdown: je(Pb, e == null ? void 0 : e.labelMonthDropdown, r.labelMonthDropdown),
    labelNext: je(Mb, e == null ? void 0 : e.labelNext, r.labelNext),
    labelPrevious: je(Tb, e == null ? void 0 : e.labelPrevious, r.labelPrevious),
    labelWeekNumber: je(kb, e == null ? void 0 : e.labelWeekNumber, r.labelWeekNumber),
    labelYearDropdown: je(Nb, e == null ? void 0 : e.labelYearDropdown, r.labelYearDropdown),
    labelGrid: je(_l, e == null ? void 0 : e.labelGrid, r.labelGrid),
    labelGridcell: je(Ob, e == null ? void 0 : e.labelGridcell, r.labelGridcell),
    labelNav: je(Eb, e == null ? void 0 : e.labelNav, r.labelNav),
    labelWeekNumberHeader: je(Db, e == null ? void 0 : e.labelWeekNumberHeader, r.labelWeekNumberHeader),
    labelWeekday: je(Rb, e == null ? void 0 : e.labelWeekday, r.labelWeekday)
  };
}
function VM(e, t, r, n, o) {
  const { startOfMonth: a, startOfYear: i, endOfYear: s, eachMonthOfInterval: c, getMonth: l } = o;
  return c({
    start: i(e),
    end: s(e)
  }).map((f) => {
    const g = n.formatMonthDropdown(f, o), b = l(f), m = t && f < a(t) || r && f > a(r) || !1;
    return { value: b, label: g, disabled: m };
  });
}
function GM(e, t = {}, r = {}) {
  let n = { ...t == null ? void 0 : t[V.Day] };
  return Object.entries(e).filter(([, o]) => o === !0).forEach(([o]) => {
    n = {
      ...n,
      ...r == null ? void 0 : r[o]
    };
  }), n;
}
function UM(e, t, r, n) {
  const o = n ?? e.today(), a = r ? e.startOfBroadcastWeek(o, e) : t ? e.startOfISOWeek(o) : e.startOfWeek(o), i = [];
  for (let s = 0; s < 7; s++) {
    const c = e.addDays(a, s);
    i.push(c);
  }
  return i;
}
function KM(e, t, r, n, o = !1) {
  if (!e || !t)
    return;
  const { startOfYear: a, endOfYear: i, eachYearOfInterval: s, getYear: c } = n, l = a(e), u = i(t), d = s({ start: l, end: u });
  return o && d.reverse(), d.map((f) => {
    const g = r.formatYearDropdown(f, n);
    return {
      value: c(f),
      label: g,
      disabled: !1
    };
  });
}
function XM(e, t = {}) {
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
      const u = a(c), g = ((((l == null ? void 0 : l.weekStartsOn) ?? o) + 6) % 7 - u.getDay() + 7) % 7;
      return u.setDate(u.getDate() + g), u;
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
      const l = a(c.start), u = a(c.end), d = [], f = new _e(l.getFullYear(), l.getMonth(), 1, 12, 0, 0, e), g = u.getFullYear() * 12 + u.getMonth();
      for (; f.getFullYear() * 12 + f.getMonth() <= g; )
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
      return gl(u, {
        weekStartsOn: (l == null ? void 0 : l.weekStartsOn) ?? o,
        firstWeekContainsDate: (l == null ? void 0 : l.firstWeekContainsDate) ?? ((d = n == null ? void 0 : n.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1
      });
    },
    getISOWeek: (c) => {
      const l = i(c);
      return ml(l);
    },
    differenceInCalendarDays: (c, l) => {
      const u = i(c), d = i(l);
      return hl(u, d);
    },
    differenceInCalendarMonths: (c, l) => {
      const u = i(c), d = i(l);
      return db(u, d);
    }
  };
}
const en = (e) => e instanceof HTMLElement ? e : null, Go = (e) => [
  ...e.querySelectorAll("[data-animated-month]") ?? []
], ZM = (e) => en(e.querySelector("[data-animated-month]")), Uo = (e) => en(e.querySelector("[data-animated-caption]")), Ko = (e) => en(e.querySelector("[data-animated-weeks]")), QM = (e) => en(e.querySelector("[data-animated-nav]")), JM = (e) => en(e.querySelector("[data-animated-weekdays]"));
function eT(e, t, { classNames: r, months: n, focused: o, dateLib: a }) {
  const i = Jt(null), s = Jt(n), c = Jt(!1);
  xh(() => {
    const l = s.current;
    if (s.current = n, !t || !e.current || // safety check because the ref can be set to anything by consumers
    !(e.current instanceof HTMLElement) || // validation required for the animation to work as expected
    n.length === 0 || l.length === 0 || n.length !== l.length)
      return;
    const u = a.isSameMonth(n[0].date, l[0].date), d = a.isAfter(n[0].date, l[0].date), f = d ? r[Me.caption_after_enter] : r[Me.caption_before_enter], g = d ? r[Me.weeks_after_enter] : r[Me.weeks_before_enter], b = i.current, m = e.current.cloneNode(!0);
    if (m instanceof HTMLElement ? (Go(m).forEach((x) => {
      if (!(x instanceof HTMLElement))
        return;
      const _ = ZM(x);
      _ && x.contains(_) && x.removeChild(_);
      const C = Uo(x);
      C && C.classList.remove(f);
      const S = Ko(x);
      S && S.classList.remove(g);
    }), i.current = m) : i.current = null, c.current || u || // skip animation if a day is focused because it can cause issues to the animation and is better for a11y
    o)
      return;
    const h = b instanceof HTMLElement ? Go(b) : [], y = Go(e.current);
    if (y != null && y.every((w) => w instanceof HTMLElement) && h && h.every((w) => w instanceof HTMLElement)) {
      c.current = !0, e.current.style.isolation = "isolate";
      const w = QM(e.current);
      w && (w.style.zIndex = "1"), y.forEach((x, _) => {
        const C = h[_];
        if (!C)
          return;
        x.style.position = "relative", x.style.overflow = "hidden";
        const S = Uo(x);
        S && S.classList.add(f);
        const O = Ko(x);
        O && O.classList.add(g);
        const P = () => {
          c.current = !1, e.current && (e.current.style.isolation = ""), w && (w.style.zIndex = ""), S && S.classList.remove(f), O && O.classList.remove(g), x.style.position = "", x.style.overflow = "", x.contains(C) && x.removeChild(C);
        };
        C.style.pointerEvents = "none", C.style.position = "absolute", C.style.overflow = "hidden", C.setAttribute("aria-hidden", "true");
        const T = JM(C);
        T && (T.style.opacity = "0");
        const A = Uo(C);
        A && (A.classList.add(d ? r[Me.caption_before_exit] : r[Me.caption_after_exit]), A.addEventListener("animationend", P));
        const k = Ko(C);
        k && k.classList.add(d ? r[Me.weeks_before_exit] : r[Me.weeks_after_exit]), x.insertBefore(C, x.firstChild);
      });
    }
  });
}
function tT(e, t, r, n) {
  const o = e[0], a = e[e.length - 1], { ISOWeek: i, fixedWeeks: s, broadcastCalendar: c } = r ?? {}, { addDays: l, differenceInCalendarDays: u, differenceInCalendarMonths: d, endOfBroadcastWeek: f, endOfISOWeek: g, endOfMonth: b, endOfWeek: m, isAfter: h, startOfBroadcastWeek: y, startOfISOWeek: w, startOfWeek: x } = n, _ = c ? y(o, n) : i ? w(o) : x(o), C = c ? f(a) : i ? g(b(a)) : m(b(a)), S = t && (c ? f(t) : i ? g(t) : m(t)), O = S && h(C, S) ? S : C, P = u(O, _), T = d(a, o) + 1, A = [];
  for (let D = 0; D <= P; D++) {
    const F = l(_, D);
    A.push(F);
  }
  const q = (c ? 35 : 42) * T;
  if (s && A.length < q) {
    const D = q - A.length;
    for (let F = 0; F < D; F++) {
      const $ = l(A[A.length - 1], 1);
      A.push($);
    }
  }
  return A;
}
function rT(e) {
  const t = [];
  return e.reduce((r, n) => {
    const o = n.weeks.reduce((a, i) => a.concat(i.days.slice()), t.slice());
    return r.concat(o.slice());
  }, t.slice());
}
function nT(e, t, r, n) {
  const { numberOfMonths: o = 1 } = r, a = [];
  for (let i = 0; i < o; i++) {
    const s = n.addMonths(e, i);
    if (t && s > t)
      break;
    a.push(s);
  }
  return a;
}
function Lu(e, t, r, n) {
  const { month: o, defaultMonth: a, today: i = n.today(), numberOfMonths: s = 1 } = e;
  let c = o || a || i;
  const { differenceInCalendarMonths: l, addMonths: u, startOfMonth: d } = n;
  if (r && l(r, c) < s - 1) {
    const f = -1 * (s - 1);
    c = u(r, f);
  }
  return t && l(c, t) < 0 && (c = t), d(c);
}
function oT(e, t, r, n) {
  const { addDays: o, endOfBroadcastWeek: a, endOfISOWeek: i, endOfMonth: s, endOfWeek: c, getISOWeek: l, getWeek: u, startOfBroadcastWeek: d, startOfISOWeek: f, startOfWeek: g } = n, b = e.reduce((m, h) => {
    const y = r.broadcastCalendar ? d(h, n) : r.ISOWeek ? f(h) : g(h), w = r.broadcastCalendar ? a(h) : r.ISOWeek ? i(s(h)) : c(s(h)), x = t.filter((O) => O >= y && O <= w), _ = r.broadcastCalendar ? 35 : 42;
    if (r.fixedWeeks && x.length < _) {
      const O = t.filter((P) => {
        const T = _ - x.length;
        return P > w && P <= o(w, T);
      });
      x.push(...O);
    }
    const C = x.reduce((O, P) => {
      const T = r.ISOWeek ? l(P) : u(P), A = O.find((q) => q.weekNumber === T), k = new yb(P, h, n);
      return A ? A.days.push(k) : O.push(new eM(T, [k])), O;
    }, []), S = new JE(h, C);
    return m.push(S), m;
  }, []);
  return r.reverseMonths ? b.reverse() : b;
}
function aT(e, t) {
  let { startMonth: r, endMonth: n } = e;
  const { startOfYear: o, startOfDay: a, startOfMonth: i, endOfMonth: s, addYears: c, endOfYear: l, newDate: u, today: d } = t, { fromYear: f, toYear: g, fromMonth: b, toMonth: m } = e;
  !r && b && (r = b), !r && f && (r = t.newDate(f, 0, 1)), !n && m && (n = m), !n && g && (n = u(g, 11, 31));
  const h = e.captionLayout === "dropdown" || e.captionLayout === "dropdown-years";
  return r ? r = i(r) : f ? r = u(f, 0, 1) : !r && h && (r = o(c(e.today ?? d(), -100))), n ? n = s(n) : g ? n = u(g, 11, 31) : !n && h && (n = l(e.today ?? d())), [
    r && a(r),
    n && a(n)
  ];
}
function iT(e, t, r, n) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: a = 1 } = r, { startOfMonth: i, addMonths: s, differenceInCalendarMonths: c } = n, l = o ? a : 1, u = i(e);
  if (!t)
    return s(u, l);
  if (!(c(t, e) < a))
    return s(u, l);
}
function sT(e, t, r, n) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: a } = r, { startOfMonth: i, addMonths: s, differenceInCalendarMonths: c } = n, l = o ? a ?? 1 : 1, u = i(e);
  if (!t)
    return s(u, -l);
  if (!(c(u, t) <= 0))
    return s(u, -l);
}
function cT(e) {
  const t = [];
  return e.reduce((r, n) => r.concat(n.weeks.slice()), t.slice());
}
function mo(e, t) {
  const [r, n] = Tr(e);
  return [t === void 0 ? r : t, n];
}
function lT(e, t) {
  var _;
  const [r, n] = aT(e, t), { startOfMonth: o, endOfMonth: a } = t, i = Lu(e, r, n, t), [s, c] = mo(
    i,
    // initialMonth is always computed from props.month if provided
    e.month ? i : void 0
  );
  _h(() => {
    const C = Lu(e, r, n, t);
    c(C);
  }, [e.timeZone]);
  const { months: l, weeks: u, days: d, previousMonth: f, nextMonth: g } = Mr(() => {
    const C = nT(s, n, { numberOfMonths: e.numberOfMonths }, t), S = tT(C, e.endMonth ? a(e.endMonth) : void 0, {
      ISOWeek: e.ISOWeek,
      fixedWeeks: e.fixedWeeks,
      broadcastCalendar: e.broadcastCalendar
    }, t), O = oT(C, S, {
      broadcastCalendar: e.broadcastCalendar,
      fixedWeeks: e.fixedWeeks,
      ISOWeek: e.ISOWeek,
      reverseMonths: e.reverseMonths
    }, t), P = cT(O), T = rT(O), A = sT(s, r, e, t), k = iT(s, n, e, t);
    return {
      months: O,
      weeks: P,
      days: T,
      previousMonth: A,
      nextMonth: k
    };
  }, [
    t,
    s.getTime(),
    n == null ? void 0 : n.getTime(),
    r == null ? void 0 : r.getTime(),
    e.disableNavigation,
    e.broadcastCalendar,
    (_ = e.endMonth) == null ? void 0 : _.getTime(),
    e.fixedWeeks,
    e.ISOWeek,
    e.numberOfMonths,
    e.pagedNavigation,
    e.reverseMonths
  ]), { disableNavigation: b, onMonthChange: m } = e, h = (C) => u.some((S) => S.days.some((O) => O.isEqualTo(C))), y = (C) => {
    if (b)
      return;
    let S = o(C);
    r && S < o(r) && (S = o(r)), n && S > o(n) && (S = o(n)), c(S), m == null || m(S);
  };
  return {
    months: l,
    weeks: u,
    days: d,
    navStart: r,
    navEnd: n,
    previousMonth: f,
    nextMonth: g,
    goToMonth: y,
    goToDay: (C) => {
      h(C) || y(C.date);
    }
  };
}
var Qe;
(function(e) {
  e[e.Today = 0] = "Today", e[e.Selected = 1] = "Selected", e[e.LastFocused = 2] = "LastFocused", e[e.FocusedModifier = 3] = "FocusedModifier";
})(Qe || (Qe = {}));
function ju(e) {
  return !e[ve.disabled] && !e[ve.hidden] && !e[ve.outside];
}
function uT(e, t, r, n) {
  let o, a = -1;
  for (const i of e) {
    const s = t(i);
    ju(s) && (s[ve.focused] && a < Qe.FocusedModifier ? (o = i, a = Qe.FocusedModifier) : n != null && n.isEqualTo(i) && a < Qe.LastFocused ? (o = i, a = Qe.LastFocused) : r(i.date) && a < Qe.Selected ? (o = i, a = Qe.Selected) : s[ve.today] && a < Qe.Today && (o = i, a = Qe.Today));
  }
  return o || (o = e.find((i) => ju(t(i)))), o;
}
function dT(e, t, r, n, o, a, i) {
  const { ISOWeek: s, broadcastCalendar: c } = a, { addDays: l, addMonths: u, addWeeks: d, addYears: f, endOfBroadcastWeek: g, endOfISOWeek: b, endOfWeek: m, max: h, min: y, startOfBroadcastWeek: w, startOfISOWeek: x, startOfWeek: _ } = i;
  let S = {
    day: l,
    week: d,
    month: u,
    year: f,
    startOfWeek: (O) => c ? w(O, i) : s ? x(O) : _(O),
    endOfWeek: (O) => c ? g(O) : s ? b(O) : m(O)
  }[e](r, t === "after" ? 1 : -1);
  return t === "before" && n ? S = h([n, S]) : t === "after" && o && (S = y([o, S])), S;
}
function Ab(e, t, r, n, o, a, i, s = 0) {
  if (s > 365)
    return;
  const c = dT(e, t, r.date, n, o, a, i), l = !!(a.disabled && ft(c, a.disabled, i)), u = !!(a.hidden && ft(c, a.hidden, i)), d = c, f = new yb(c, d, i);
  return !l && !u ? f : Ab(e, t, f, n, o, a, i, s + 1);
}
function fT(e, t, r, n, o) {
  const { autoFocus: a } = e, [i, s] = Tr(), c = uT(t.days, r, n || (() => !1), i), [l, u] = Tr(a ? c : void 0);
  return {
    isFocusTarget: (m) => !!(c != null && c.isEqualTo(m)),
    setFocused: u,
    focused: l,
    blur: () => {
      s(l), u(void 0);
    },
    moveFocus: (m, h) => {
      if (!l)
        return;
      const y = Ab(m, h, l, t.navStart, t.navEnd, e, o);
      y && (e.disableNavigation && !t.days.some((x) => x.isEqualTo(y)) || (t.goToDay(y), u(y)));
    }
  };
}
function pT(e, t) {
  const { selected: r, required: n, onSelect: o } = e, [a, i] = mo(r, o ? r : void 0), s = o ? r : a, { isSameDay: c } = t, l = (g) => (s == null ? void 0 : s.some((b) => c(b, g))) ?? !1, { min: u, max: d } = e;
  return {
    selected: s,
    select: (g, b, m) => {
      let h = [...s ?? []];
      if (l(g)) {
        if ((s == null ? void 0 : s.length) === u || n && (s == null ? void 0 : s.length) === 1)
          return;
        h = s == null ? void 0 : s.filter((y) => !c(y, g));
      } else
        (s == null ? void 0 : s.length) === d ? h = [g] : h = [...h, g];
      return o || i(h), o == null || o(h, g, b, m), h;
    },
    isSelected: l
  };
}
function hT(e, t, r = 0, n = 0, o = !1, a = st) {
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
function mT(e, t, r = st) {
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
function zu(e, t, r = st) {
  return dt(e, t.from, !1, r) || dt(e, t.to, !1, r) || dt(t, e.from, !1, r) || dt(t, e.to, !1, r);
}
function gT(e, t, r = st) {
  const n = Array.isArray(t) ? t : [t];
  if (n.filter((s) => typeof s != "function").some((s) => typeof s == "boolean" ? s : r.isDate(s) ? dt(e, s, !1, r) : _b(s, r) ? s.some((c) => dt(e, c, !1, r)) : ho(s) ? s.from && s.to ? zu(e, { from: s.from, to: s.to }, r) : !1 : xb(s) ? mT(e, s.dayOfWeek, r) : vl(s) ? r.isAfter(s.before, s.after) ? zu(e, {
    from: r.addDays(s.after, 1),
    to: r.addDays(s.before, -1)
  }, r) : ft(e.from, s, r) || ft(e.to, s, r) : bl(s) || yl(s) ? ft(e.from, s, r) || ft(e.to, s, r) : !1))
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
function vT(e, t) {
  const { disabled: r, excludeDisabled: n, selected: o, required: a, onSelect: i } = e, [s, c] = mo(o, i ? o : void 0), l = i ? o : s;
  return {
    selected: l,
    select: (f, g, b) => {
      const { min: m, max: h } = e, y = f ? hT(f, l, m, h, a, t) : void 0;
      return n && r && (y != null && y.from) && y.to && gT({ from: y.from, to: y.to }, r, t) && (y.from = f, y.to = void 0), i || c(y), i == null || i(y, f, g, b), y;
    },
    isSelected: (f) => l && dt(l, f, !1, t)
  };
}
function bT(e, t) {
  const { selected: r, required: n, onSelect: o } = e, [a, i] = mo(r, o ? r : void 0), s = o ? r : a, { isSameDay: c } = t;
  return {
    selected: s,
    select: (d, f, g) => {
      let b = d;
      return !n && s && s && c(d, s) && (b = void 0), o || i(b), o == null || o(b, d, f, g), b;
    },
    isSelected: (d) => s ? c(s, d) : !1
  };
}
function yT(e, t) {
  const r = bT(e, t), n = pT(e, t), o = vT(e, t);
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
function Be(e, t) {
  return e instanceof _e && e.timeZone === t ? e : new _e(e, t);
}
function Zt(e, t, r) {
  return Be(e, t);
}
function Hu(e, t, r) {
  return typeof e == "boolean" || typeof e == "function" ? e : e instanceof Date ? Zt(e, t) : Array.isArray(e) ? e.map((n) => n instanceof Date ? Zt(n, t) : n) : ho(e) ? {
    ...e,
    from: e.from ? Be(e.from, t) : e.from,
    to: e.to ? Be(e.to, t) : e.to
  } : vl(e) ? {
    before: Zt(e.before, t),
    after: Zt(e.after, t)
  } : bl(e) ? {
    after: Zt(e.after, t)
  } : yl(e) ? {
    before: Zt(e.before, t)
  } : e;
}
function Xo(e, t, r) {
  return e && (Array.isArray(e) ? e.map((n) => Hu(n, t)) : Hu(e, t));
}
function wT(e) {
  var Yl;
  let t = e;
  const r = t.timeZone;
  if (r && (t = {
    ...e,
    timeZone: r
  }, t.today && (t.today = Be(t.today, r)), t.month && (t.month = Be(t.month, r)), t.defaultMonth && (t.defaultMonth = Be(t.defaultMonth, r)), t.startMonth && (t.startMonth = Be(t.startMonth, r)), t.endMonth && (t.endMonth = Be(t.endMonth, r)), t.mode === "single" && t.selected ? t.selected = Be(t.selected, r) : t.mode === "multiple" && t.selected ? t.selected = (Yl = t.selected) == null ? void 0 : Yl.map((Z) => Be(Z, r)) : t.mode === "range" && t.selected && (t.selected = {
    from: t.selected.from ? Be(t.selected.from, r) : t.selected.from,
    to: t.selected.to ? Be(t.selected.to, r) : t.selected.to
  }), t.disabled !== void 0 && (t.disabled = Xo(t.disabled, r)), t.hidden !== void 0 && (t.hidden = Xo(t.hidden, r)), t.modifiers)) {
    const Z = {};
    Object.keys(t.modifiers).forEach((ue) => {
      var U;
      Z[ue] = Xo((U = t.modifiers) == null ? void 0 : U[ue], r);
    }), t.modifiers = Z;
  }
  const { components: n, formatters: o, labels: a, dateLib: i, locale: s, classNames: c } = Mr(() => {
    const Z = { ...bb, ...t.locale }, ue = t.broadcastCalendar ? 1 : t.weekStartsOn, U = t.noonSafe && t.timeZone ? XM(t.timeZone, {
      weekStartsOn: ue,
      locale: Z
    }) : void 0, ce = t.dateLib && U ? { ...U, ...t.dateLib } : t.dateLib ?? U, Pe = new ke({
      locale: Z,
      weekStartsOn: ue,
      firstWeekContainsDate: t.firstWeekContainsDate,
      useAdditionalWeekYearTokens: t.useAdditionalWeekYearTokens,
      useAdditionalDayOfYearTokens: t.useAdditionalDayOfYearTokens,
      timeZone: t.timeZone,
      numerals: t.numerals
    }, ce);
    return {
      dateLib: Pe,
      components: RM(t.components),
      formatters: qM(t.formatters),
      labels: YM(t.labels, Pe.options),
      locale: Z,
      classNames: { ...wl(), ...t.classNames }
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
  const { captionLayout: l, mode: u, navLayout: d, numberOfMonths: f = 1, onDayBlur: g, onDayClick: b, onDayFocus: m, onDayKeyDown: h, onDayMouseEnter: y, onDayMouseLeave: w, onNextClick: x, onPrevClick: _, showWeekNumber: C, styles: S } = t, { formatCaption: O, formatDay: P, formatMonthDropdown: T, formatWeekNumber: A, formatWeekNumberHeader: k, formatWeekdayName: q, formatYearDropdown: D } = o, F = lT(t, i), { days: $, months: I, navStart: Y, navEnd: B, previousMonth: N, nextMonth: R, goToMonth: X } = F, le = MM($, t, Y, B, i), { isSelected: me, select: ge, selected: se } = yT(t, i) ?? {}, { blur: ne, focused: z, isFocusTarget: re, moveFocus: G, setFocused: Q } = fT(t, F, le, me ?? (() => !1), i), { labelDayButton: ee, labelGridcell: te, labelGrid: be, labelMonthDropdown: L, labelNav: Ne, labelPrevious: Ae, labelNext: Ze, labelWeekday: Eo, labelWeekNumber: Vt, labelWeekNumberHeader: Ny, labelYearDropdown: Ay } = a, Iy = Mr(() => UM(i, t.ISOWeek, t.broadcastCalendar, t.today), [i, t.ISOWeek, t.broadcastCalendar, t.today]), zl = u !== void 0 || b !== void 0, Mo = Ee(() => {
    N && (X(N), _ == null || _(N));
  }, [N, X, _]), To = Ee(() => {
    R && (X(R), x == null || x(R));
  }, [X, R, x]), Fy = Ee((Z, ue) => (U) => {
    U.preventDefault(), U.stopPropagation(), Q(Z), !ue.disabled && (ge == null || ge(Z.date, ue, U), b == null || b(Z.date, ue, U));
  }, [ge, b, Q]), $y = Ee((Z, ue) => (U) => {
    Q(Z), m == null || m(Z.date, ue, U);
  }, [m, Q]), By = Ee((Z, ue) => (U) => {
    ne(), g == null || g(Z.date, ue, U);
  }, [ne, g]), Wy = Ee((Z, ue) => (U) => {
    const ce = {
      ArrowLeft: [
        U.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "after" : "before"
      ],
      ArrowRight: [
        U.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "before" : "after"
      ],
      ArrowDown: [U.shiftKey ? "year" : "week", "after"],
      ArrowUp: [U.shiftKey ? "year" : "week", "before"],
      PageUp: [U.shiftKey ? "year" : "month", "before"],
      PageDown: [U.shiftKey ? "year" : "month", "after"],
      Home: ["startOfWeek", "before"],
      End: ["endOfWeek", "after"]
    };
    if (ce[U.key]) {
      U.preventDefault(), U.stopPropagation();
      const [Pe, oe] = ce[U.key];
      G(Pe, oe);
    }
    h == null || h(Z.date, ue, U);
  }, [G, h, t.dir]), qy = Ee((Z, ue) => (U) => {
    y == null || y(Z.date, ue, U);
  }, [y]), Ly = Ee((Z, ue) => (U) => {
    w == null || w(Z.date, ue, U);
  }, [w]), jy = Ee((Z) => (ue) => {
    const U = Number(ue.target.value), ce = i.setMonth(i.startOfMonth(Z), U);
    X(ce);
  }, [i, X]), zy = Ee((Z) => (ue) => {
    const U = Number(ue.target.value), ce = i.setYear(i.startOfMonth(Z), U);
    X(ce);
  }, [i, X]), { className: Hy, style: Yy } = Mr(() => ({
    className: [c[V.Root], t.className].filter(Boolean).join(" "),
    style: { ...S == null ? void 0 : S[V.Root], ...t.style }
  }), [c, t.className, t.style, S]), Vy = kM(t), Hl = Jt(null);
  eT(Hl, !!t.animate, {
    classNames: c,
    months: I,
    focused: z,
    dateLib: i
  });
  const Gy = {
    dayPickerProps: t,
    selected: se,
    select: ge,
    isSelected: me,
    months: I,
    nextMonth: R,
    previousMonth: N,
    goToMonth: X,
    getModifiers: le,
    components: n,
    classNames: c,
    styles: S,
    labels: a,
    formatters: o
  };
  return E.createElement(
    wb.Provider,
    { value: Gy },
    E.createElement(
      n.Root,
      { rootRef: t.animate ? Hl : void 0, className: Hy, style: Yy, dir: t.dir, id: t.id, lang: t.lang, nonce: t.nonce, title: t.title, role: t.role, "aria-label": t["aria-label"], "aria-labelledby": t["aria-labelledby"], ...Vy },
      E.createElement(
        n.Months,
        { className: c[V.Months], style: S == null ? void 0 : S[V.Months] },
        !t.hideNavigation && !d && E.createElement(n.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[V.Nav], style: S == null ? void 0 : S[V.Nav], "aria-label": Ne(), onPreviousClick: Mo, onNextClick: To, previousMonth: N, nextMonth: R }),
        I.map((Z, ue) => E.createElement(
          n.Month,
          {
            "data-animated-month": t.animate ? "true" : void 0,
            className: c[V.Month],
            style: S == null ? void 0 : S[V.Month],
            // biome-ignore lint/suspicious/noArrayIndexKey: breaks animation
            key: ue,
            displayIndex: ue,
            calendarMonth: Z
          },
          d === "around" && !t.hideNavigation && ue === 0 && E.createElement(
            n.PreviousMonthButton,
            { type: "button", className: c[V.PreviousMonthButton], tabIndex: N ? void 0 : -1, "aria-disabled": N ? void 0 : !0, "aria-label": Ae(N), onClick: Mo, "data-animated-button": t.animate ? "true" : void 0 },
            E.createElement(n.Chevron, { disabled: N ? void 0 : !0, className: c[V.Chevron], orientation: t.dir === "rtl" ? "right" : "left" })
          ),
          E.createElement(n.MonthCaption, { "data-animated-caption": t.animate ? "true" : void 0, className: c[V.MonthCaption], style: S == null ? void 0 : S[V.MonthCaption], calendarMonth: Z, displayIndex: ue }, l != null && l.startsWith("dropdown") ? E.createElement(
            n.DropdownNav,
            { className: c[V.Dropdowns], style: S == null ? void 0 : S[V.Dropdowns] },
            (() => {
              const U = l === "dropdown" || l === "dropdown-months" ? E.createElement(n.MonthsDropdown, { key: "month", className: c[V.MonthsDropdown], "aria-label": L(), classNames: c, components: n, disabled: !!t.disableNavigation, onChange: jy(Z.date), options: VM(Z.date, Y, B, o, i), style: S == null ? void 0 : S[V.Dropdown], value: i.getMonth(Z.date) }) : E.createElement("span", { key: "month" }, T(Z.date, i)), ce = l === "dropdown" || l === "dropdown-years" ? E.createElement(n.YearsDropdown, { key: "year", className: c[V.YearsDropdown], "aria-label": Ay(i.options), classNames: c, components: n, disabled: !!t.disableNavigation, onChange: zy(Z.date), options: KM(Y, B, o, i, !!t.reverseYears), style: S == null ? void 0 : S[V.Dropdown], value: i.getYear(Z.date) }) : E.createElement("span", { key: "year" }, D(Z.date, i));
              return i.getMonthYearOrder() === "year-first" ? [ce, U] : [U, ce];
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
          ) : E.createElement(n.CaptionLabel, { className: c[V.CaptionLabel], role: "status", "aria-live": "polite" }, O(Z.date, i.options, i))),
          d === "around" && !t.hideNavigation && ue === f - 1 && E.createElement(
            n.NextMonthButton,
            { type: "button", className: c[V.NextMonthButton], tabIndex: R ? void 0 : -1, "aria-disabled": R ? void 0 : !0, "aria-label": Ze(R), onClick: To, "data-animated-button": t.animate ? "true" : void 0 },
            E.createElement(n.Chevron, { disabled: R ? void 0 : !0, className: c[V.Chevron], orientation: t.dir === "rtl" ? "left" : "right" })
          ),
          ue === f - 1 && d === "after" && !t.hideNavigation && E.createElement(n.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[V.Nav], style: S == null ? void 0 : S[V.Nav], "aria-label": Ne(), onPreviousClick: Mo, onNextClick: To, previousMonth: N, nextMonth: R }),
          E.createElement(
            n.MonthGrid,
            { role: "grid", "aria-multiselectable": u === "multiple" || u === "range", "aria-label": be(Z.date, i.options, i) || void 0, className: c[V.MonthGrid], style: S == null ? void 0 : S[V.MonthGrid] },
            !t.hideWeekdays && E.createElement(
              n.Weekdays,
              { "data-animated-weekdays": t.animate ? "true" : void 0, className: c[V.Weekdays], style: S == null ? void 0 : S[V.Weekdays] },
              C && E.createElement(n.WeekNumberHeader, { "aria-label": Ny(i.options), className: c[V.WeekNumberHeader], style: S == null ? void 0 : S[V.WeekNumberHeader], scope: "col" }, k()),
              Iy.map((U) => E.createElement(n.Weekday, { "aria-label": Eo(U, i.options, i), className: c[V.Weekday], key: String(U), style: S == null ? void 0 : S[V.Weekday], scope: "col" }, q(U, i.options, i)))
            ),
            E.createElement(n.Weeks, { "data-animated-weeks": t.animate ? "true" : void 0, className: c[V.Weeks], style: S == null ? void 0 : S[V.Weeks] }, Z.weeks.map((U) => E.createElement(
              n.Week,
              { className: c[V.Week], key: U.weekNumber, style: S == null ? void 0 : S[V.Week], week: U },
              C && E.createElement(n.WeekNumber, { week: U, style: S == null ? void 0 : S[V.WeekNumber], "aria-label": Vt(U.weekNumber, {
                locale: s
              }), className: c[V.WeekNumber], scope: "row", role: "rowheader" }, A(U.weekNumber, i)),
              U.days.map((ce) => {
                const { date: Pe } = ce, oe = le(ce);
                if (oe[ve.focused] = !oe.hidden && !!(z != null && z.isEqualTo(ce)), oe[Ye.selected] = (me == null ? void 0 : me(Pe)) || oe.selected, ho(se)) {
                  const { from: Ro, to: ko } = se;
                  oe[Ye.range_start] = !!(Ro && ko && i.isSameDay(Pe, Ro)), oe[Ye.range_end] = !!(Ro && ko && i.isSameDay(Pe, ko)), oe[Ye.range_middle] = dt(se, Pe, !0, i);
                }
                const Uy = GM(oe, S, t.modifiersStyles), Ky = TM(oe, c, t.modifiersClassNames), Xy = !zl && !oe.hidden ? te(Pe, oe, i.options, i) : void 0;
                return E.createElement(n.Day, { key: `${ce.isoDate}_${ce.displayMonthId}`, day: ce, modifiers: oe, className: Ky.join(" "), style: Uy, role: "gridcell", "aria-selected": oe.selected || void 0, "aria-label": Xy, "data-day": ce.isoDate, "data-month": ce.outside ? ce.dateMonthId : void 0, "data-selected": oe.selected || void 0, "data-disabled": oe.disabled || void 0, "data-hidden": oe.hidden || void 0, "data-outside": ce.outside || void 0, "data-focused": oe.focused || void 0, "data-today": oe.today || void 0 }, !oe.hidden && zl ? E.createElement(n.DayButton, { className: c[V.DayButton], style: S == null ? void 0 : S[V.DayButton], type: "button", day: ce, modifiers: oe, disabled: !oe.focused && oe.disabled || void 0, "aria-disabled": oe.focused && oe.disabled || void 0, tabIndex: re(ce) ? 0 : -1, "aria-label": ee(Pe, oe, i.options, i), onClick: Fy(ce, oe), onBlur: By(ce, oe), onFocus: $y(ce, oe), onKeyDown: Wy(ce, oe), onMouseEnter: qy(ce, oe), onMouseLeave: Ly(ce, oe) }, P(Pe, i.options, i)) : !oe.hidden && P(ce.date, i.options, i));
              })
            )))
          )
        ))
      ),
      t.footer && E.createElement(n.Footer, { className: c[V.Footer], style: S == null ? void 0 : S[V.Footer], role: "status", "aria-live": "polite" }, t.footer)
    )
  );
}
function eA({
  className: e,
  classNames: t,
  showOutsideDays: r = !0,
  captionLayout: n = "label",
  buttonVariant: o = "ghost",
  formatters: a,
  components: i,
  ...s
}) {
  const c = wl();
  return /* @__PURE__ */ v(
    wT,
    {
      showOutsideDays: r,
      className: M(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        e
      ),
      captionLayout: n,
      formatters: {
        formatMonthDropdown: (l) => l.toLocaleString("default", { month: "short" }),
        ...a
      },
      classNames: {
        root: M("w-fit", c.root),
        months: M(
          "flex gap-4 flex-col md:flex-row relative",
          c.months
        ),
        month: M("flex flex-col w-full gap-4", c.month),
        nav: M(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          c.nav
        ),
        button_previous: M(
          bc({ variant: o }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          c.button_previous
        ),
        button_next: M(
          bc({ variant: o }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          c.button_next
        ),
        month_caption: M(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          c.month_caption
        ),
        dropdowns: M(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          c.dropdowns
        ),
        dropdown_root: M(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          c.dropdown_root
        ),
        dropdown: M(
          "absolute bg-popover inset-0 opacity-0",
          c.dropdown
        ),
        caption_label: M(
          "select-none font-medium",
          n === "label" ? "text-sm" : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          c.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: M("flex", c.weekdays),
        weekday: M(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          c.weekday
        ),
        week: M("flex w-full mt-2", c.week),
        week_number_header: M(
          "select-none w-(--cell-size)",
          c.week_number_header
        ),
        week_number: M(
          "text-[0.8rem] select-none text-muted-foreground",
          c.week_number
        ),
        day: M(
          "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          s.showWeekNumber ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md" : "[&:first-child[data-selected=true]_button]:rounded-l-md",
          c.day
        ),
        range_start: M(
          "rounded-l-md bg-accent",
          c.range_start
        ),
        range_middle: M("rounded-none", c.range_middle),
        range_end: M("rounded-r-md bg-accent", c.range_end),
        today: M(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          c.today
        ),
        outside: M(
          "text-muted-foreground aria-selected:text-muted-foreground",
          c.outside
        ),
        disabled: M(
          "text-muted-foreground opacity-50",
          c.disabled
        ),
        hidden: M("invisible", c.hidden),
        ...t
      },
      components: {
        Root: ({ className: l, rootRef: u, ...d }) => /* @__PURE__ */ v(
          "div",
          {
            "data-slot": "calendar",
            ref: u,
            className: M(l),
            ...d
          }
        ),
        Chevron: ({ className: l, orientation: u, ...d }) => u === "left" ? /* @__PURE__ */ v(vP, { className: M("size-4", l), ...d }) : u === "right" ? /* @__PURE__ */ v(
          nb,
          {
            className: M("size-4", l),
            ...d
          }
        ) : /* @__PURE__ */ v(pl, { className: M("size-4", l), ...d }),
        DayButton: xT,
        WeekNumber: ({ children: l, ...u }) => /* @__PURE__ */ v("td", { ...u, children: /* @__PURE__ */ v("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children: l }) }),
        ...i
      },
      ...s
    }
  );
}
function xT({
  className: e,
  day: t,
  modifiers: r,
  ...n
}) {
  const o = wl(), a = p.useRef(null);
  return p.useEffect(() => {
    var i;
    r.focused && ((i = a.current) == null || i.focus());
  }, [r.focused]), /* @__PURE__ */ v(
    fl,
    {
      ref: a,
      variant: "ghost",
      size: "icon",
      "data-day": t.date.toLocaleDateString(),
      "data-selected-single": r.selected && !r.range_start && !r.range_end && !r.range_middle,
      "data-range-start": r.range_start,
      "data-range-end": r.range_end,
      "data-range-middle": r.range_middle,
      className: M(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        o.day,
        e
      ),
      ...n
    }
  );
}
function tA({
  ...e
}) {
  return /* @__PURE__ */ v(tm, { "data-slot": "dialog", ...e });
}
function rA({
  ...e
}) {
  return /* @__PURE__ */ v(rm, { "data-slot": "dialog-trigger", ...e });
}
function _T({
  ...e
}) {
  return /* @__PURE__ */ v(nm, { "data-slot": "dialog-portal", ...e });
}
function ST({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    om,
    {
      "data-slot": "dialog-overlay",
      className: M(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        e
      ),
      ...t
    }
  );
}
function nA({
  className: e,
  children: t,
  showCloseButton: r = !0,
  ...n
}) {
  return /* @__PURE__ */ ae(_T, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ v(ST, {}),
    /* @__PURE__ */ ae(
      am,
      {
        "data-slot": "dialog-content",
        className: M(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          e
        ),
        ...n,
        children: [
          t,
          r && /* @__PURE__ */ ae(
            Lc,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ v(ob, {}),
                /* @__PURE__ */ v("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function oA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "dialog-header",
      className: M("flex flex-col gap-2 text-center sm:text-left", e),
      ...t
    }
  );
}
function aA({
  className: e,
  showCloseButton: t = !1,
  children: r,
  ...n
}) {
  return /* @__PURE__ */ ae(
    "div",
    {
      "data-slot": "dialog-footer",
      className: M(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        e
      ),
      ...n,
      children: [
        r,
        t && /* @__PURE__ */ v(Lc, { asChild: !0, children: /* @__PURE__ */ v(fl, { variant: "outline", children: "Close" }) })
      ]
    }
  );
}
function iA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    im,
    {
      "data-slot": "dialog-title",
      className: M("text-lg leading-none font-semibold", e),
      ...t
    }
  );
}
function sA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    sm,
    {
      "data-slot": "dialog-description",
      className: M("text-muted-foreground text-sm", e),
      ...t
    }
  );
}
function cA({
  ...e
}) {
  return /* @__PURE__ */ v(CC, { "data-slot": "dropdown-menu", ...e });
}
function lA({
  ...e
}) {
  return /* @__PURE__ */ v(
    OC,
    {
      "data-slot": "dropdown-menu-trigger",
      ...e
    }
  );
}
function uA({
  className: e,
  sideOffset: t = 4,
  ...r
}) {
  return /* @__PURE__ */ v(PC, { children: /* @__PURE__ */ v(
    EC,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset: t,
      className: M(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        e
      ),
      ...r
    }
  ) });
}
function dA({
  ...e
}) {
  return /* @__PURE__ */ v(MC, { "data-slot": "dropdown-menu-group", ...e });
}
function fA({
  className: e,
  inset: t,
  variant: r = "default",
  ...n
}) {
  return /* @__PURE__ */ v(
    RC,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": t,
      "data-variant": r,
      className: M(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...n
    }
  );
}
function pA({
  className: e,
  children: t,
  checked: r,
  ...n
}) {
  return /* @__PURE__ */ ae(
    kC,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      className: M(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      checked: r,
      ...n,
      children: [
        /* @__PURE__ */ v("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ v(Dg, { children: /* @__PURE__ */ v(rb, { className: "size-4" }) }) }),
        t
      ]
    }
  );
}
function hA({
  ...e
}) {
  return /* @__PURE__ */ v(
    DC,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...e
    }
  );
}
function mA({
  className: e,
  children: t,
  ...r
}) {
  return /* @__PURE__ */ ae(
    NC,
    {
      "data-slot": "dropdown-menu-radio-item",
      className: M(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...r,
      children: [
        /* @__PURE__ */ v("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ v(Dg, { children: /* @__PURE__ */ v(_P, { className: "size-2 fill-current" }) }) }),
        t
      ]
    }
  );
}
function gA({
  className: e,
  inset: t,
  ...r
}) {
  return /* @__PURE__ */ v(
    TC,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": t,
      className: M(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        e
      ),
      ...r
    }
  );
}
function vA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    AC,
    {
      "data-slot": "dropdown-menu-separator",
      className: M("bg-border -mx-1 my-1 h-px", e),
      ...t
    }
  );
}
function bA({
  ...e
}) {
  return /* @__PURE__ */ v(IC, { "data-slot": "dropdown-menu-sub", ...e });
}
function yA({
  className: e,
  inset: t,
  children: r,
  ...n
}) {
  return /* @__PURE__ */ ae(
    FC,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": t,
      className: M(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...n,
      children: [
        r,
        /* @__PURE__ */ v(nb, { className: "ml-auto size-4" })
      ]
    }
  );
}
function wA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    $C,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: M(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        e
      ),
      ...t
    }
  );
}
var CT = (e) => e.type === "checkbox", Or = (e) => e instanceof Date, Sl = (e) => e == null;
const Ib = (e) => typeof e == "object";
var qt = (e) => !Sl(e) && !Array.isArray(e) && Ib(e) && !Or(e), OT = (e) => qt(e) && e.target ? CT(e.target) ? e.target.checked : e.target.value : e, PT = (e) => e.substring(0, e.search(/\.\d+(\.|$)/)) || e, ET = (e, t) => e.has(PT(t)), MT = (e) => {
  const t = e.constructor && e.constructor.prototype;
  return qt(t) && t.hasOwnProperty("isPrototypeOf");
}, TT = typeof window < "u" && typeof window.HTMLElement < "u" && typeof document < "u";
function Fb(e) {
  if (e instanceof Date)
    return new Date(e);
  const t = typeof FileList < "u" && e instanceof FileList;
  if (TT && (e instanceof Blob || t))
    return e;
  const r = Array.isArray(e);
  if (!r && !(qt(e) && MT(e)))
    return e;
  const n = r ? [] : Object.create(Object.getPrototypeOf(e));
  for (const o in e)
    Object.prototype.hasOwnProperty.call(e, o) && (n[o] = Fb(e[o]));
  return n;
}
var $b = (e) => /^\w*$/.test(e), wc = (e) => e === void 0, RT = (e) => Array.isArray(e) ? e.filter(Boolean) : [], Bb = (e) => RT(e.replace(/["|']|\]/g, "").split(/\.|\[/)), Ce = (e, t, r) => {
  if (!t || !qt(e))
    return r;
  const n = ($b(t) ? [t] : Bb(t)).reduce((o, a) => Sl(o) ? o : o[a], e);
  return wc(n) || n === e ? wc(e[t]) ? r : e[t] : n;
}, Zo = (e) => typeof e == "boolean", hn = (e) => typeof e == "function", Yu = (e, t, r) => {
  let n = -1;
  const o = $b(t) ? [t] : Bb(t), a = o.length, i = a - 1;
  for (; ++n < a; ) {
    const s = o[n];
    let c = r;
    if (n !== i) {
      const l = e[s];
      c = qt(l) || Array.isArray(l) ? l : isNaN(+o[n + 1]) ? {} : [];
    }
    if (s === "__proto__" || s === "constructor" || s === "prototype")
      return;
    e[s] = c, e = e[s];
  }
};
const Vu = {
  BLUR: "blur",
  CHANGE: "change"
}, Gu = {
  all: "all"
}, Cl = E.createContext(null);
Cl.displayName = "HookFormControlContext";
const Ol = () => E.useContext(Cl);
var kT = (e, t, r, n = !0) => {
  const o = {
    defaultValues: t._defaultValues
  };
  for (const a in e)
    Object.defineProperty(o, a, {
      get: () => {
        const i = a;
        return t._proxyFormState[i] !== Gu.all && (t._proxyFormState[i] = !n || Gu.all), r && (r[i] = !0), e[i];
      }
    });
  return o;
};
const Wb = typeof window < "u" ? E.useLayoutEffect : E.useEffect;
function qb(e) {
  const t = Ol(), { control: r = t, disabled: n, name: o, exact: a } = e || {}, [i, s] = E.useState(r._formState), c = E.useRef({
    isDirty: !1,
    isLoading: !1,
    dirtyFields: !1,
    touchedFields: !1,
    validatingFields: !1,
    isValidating: !1,
    isValid: !1,
    errors: !1
  });
  return Wb(() => r._subscribe({
    name: o,
    formState: c.current,
    exact: a,
    callback: (l) => {
      !n && s({
        ...r._formState,
        ...l
      });
    }
  }), [o, n, a]), E.useEffect(() => {
    c.current.isValid && r._setValid(!0);
  }, [r]), E.useMemo(() => kT(i, r, c.current, !1), [i, r]);
}
var DT = (e) => typeof e == "string", Uu = (e, t, r, n, o) => DT(e) ? Ce(r, e, o) : Array.isArray(e) ? e.map((a) => Ce(r, a)) : r, Ku = (e) => Sl(e) || !Ib(e);
function Sn(e, t, r = /* @__PURE__ */ new WeakSet()) {
  if (Ku(e) || Ku(t))
    return Object.is(e, t);
  if (Or(e) && Or(t))
    return Object.is(e.getTime(), t.getTime());
  const n = Object.keys(e), o = Object.keys(t);
  if (n.length !== o.length)
    return !1;
  if (r.has(e) || r.has(t))
    return !0;
  r.add(e), r.add(t);
  for (const a of n) {
    const i = e[a];
    if (!o.includes(a))
      return !1;
    if (a !== "ref") {
      const s = t[a];
      if (Or(i) && Or(s) || qt(i) && qt(s) || Array.isArray(i) && Array.isArray(s) ? !Sn(i, s, r) : !Object.is(i, s))
        return !1;
    }
  }
  return !0;
}
function NT(e) {
  const t = Ol(), { control: r = t, name: n, defaultValue: o, disabled: a, exact: i, compute: s } = e || {}, c = E.useRef(o), l = E.useRef(s), u = E.useRef(void 0), d = E.useRef(r), f = E.useRef(n);
  l.current = s;
  const [g, b] = E.useState(() => {
    const _ = r._getWatch(n, c.current);
    return l.current ? l.current(_) : _;
  }), m = E.useCallback((_) => {
    const C = Uu(n, r._names, _ || r._formValues, !1, c.current);
    return l.current ? l.current(C) : C;
  }, [r._formValues, r._names, n]), h = E.useCallback((_) => {
    if (!a) {
      const C = Uu(n, r._names, _ || r._formValues, !1, c.current);
      if (l.current) {
        const S = l.current(C);
        Sn(S, u.current) || (b(S), u.current = S);
      } else
        b(C);
    }
  }, [r._formValues, r._names, a, n]);
  Wb(() => ((d.current !== r || !Sn(f.current, n)) && (d.current = r, f.current = n, h()), r._subscribe({
    name: n,
    formState: {
      values: !0
    },
    exact: i,
    callback: (_) => {
      h(_.values);
    }
  })), [r, i, n, h]), E.useEffect(() => r._removeUnmounted());
  const y = d.current !== r, w = f.current, x = E.useMemo(() => {
    if (a)
      return null;
    const _ = !y && !Sn(w, n);
    return y || _ ? m() : null;
  }, [a, y, n, w, m]);
  return x !== null ? x : g;
}
function AT(e) {
  const t = Ol(), { name: r, disabled: n, control: o = t, shouldUnregister: a, defaultValue: i, exact: s = !0 } = e, c = ET(o._names.array, r), l = E.useMemo(() => Ce(o._formValues, r, Ce(o._defaultValues, r, i)), [o, r, i]), u = NT({
    control: o,
    name: r,
    defaultValue: l,
    exact: s
  }), d = qb({
    control: o,
    name: r,
    exact: s
  }), f = E.useRef(e), g = E.useRef(void 0), b = E.useRef(o.register(r, {
    ...e.rules,
    value: u,
    ...Zo(e.disabled) ? { disabled: e.disabled } : {}
  }));
  f.current = e;
  const m = E.useMemo(() => Object.defineProperties({}, {
    invalid: {
      enumerable: !0,
      get: () => !!Ce(d.errors, r)
    },
    isDirty: {
      enumerable: !0,
      get: () => !!Ce(d.dirtyFields, r)
    },
    isTouched: {
      enumerable: !0,
      get: () => !!Ce(d.touchedFields, r)
    },
    isValidating: {
      enumerable: !0,
      get: () => !!Ce(d.validatingFields, r)
    },
    error: {
      enumerable: !0,
      get: () => Ce(d.errors, r)
    }
  }), [d, r]), h = E.useCallback((_) => b.current.onChange({
    target: {
      value: OT(_),
      name: r
    },
    type: Vu.CHANGE
  }), [r]), y = E.useCallback(() => b.current.onBlur({
    target: {
      value: Ce(o._formValues, r),
      name: r
    },
    type: Vu.BLUR
  }), [r, o._formValues]), w = E.useCallback((_) => {
    const C = Ce(o._fields, r);
    C && C._f && _ && (C._f.ref = {
      focus: () => hn(_.focus) && _.focus(),
      select: () => hn(_.select) && _.select(),
      setCustomValidity: (S) => hn(_.setCustomValidity) && _.setCustomValidity(S),
      reportValidity: () => hn(_.reportValidity) && _.reportValidity()
    });
  }, [o._fields, r]), x = E.useMemo(() => ({
    name: r,
    value: u,
    ...Zo(n) || d.disabled ? { disabled: d.disabled || n } : {},
    onChange: h,
    onBlur: y,
    ref: w
  }), [r, n, d.disabled, h, y, w, u]);
  return E.useEffect(() => {
    const _ = o._options.shouldUnregister || a, C = g.current;
    C && C !== r && !c && o.unregister(C), o.register(r, {
      ...f.current.rules,
      ...Zo(f.current.disabled) ? { disabled: f.current.disabled } : {}
    });
    const S = (O, P) => {
      const T = Ce(o._fields, O);
      T && T._f && (T._f.mount = P);
    };
    if (S(r, !0), _) {
      const O = Fb(Ce(o._options.defaultValues, r, f.current.defaultValue));
      Yu(o._defaultValues, r, O), wc(Ce(o._formValues, r)) && Yu(o._formValues, r, O);
    }
    return !c && o.register(r), g.current = r, () => {
      (c ? _ && !o._state.action : _) ? o.unregister(r) : S(r, !1);
    };
  }, [r, o, c, a]), E.useEffect(() => {
    o._setDisabledField({
      disabled: n,
      name: r
    });
  }, [n, r, o]), E.useMemo(() => ({
    field: x,
    formState: d,
    fieldState: m
  }), [x, d, m]);
}
const IT = (e) => e.render(AT(e)), Pl = E.createContext(null);
Pl.displayName = "HookFormContext";
const FT = () => E.useContext(Pl), $T = (e) => {
  const { children: t, watch: r, getValues: n, getFieldState: o, setError: a, clearErrors: i, setValue: s, trigger: c, formState: l, resetField: u, reset: d, handleSubmit: f, unregister: g, control: b, register: m, setFocus: h, subscribe: y } = e;
  return E.createElement(
    Pl.Provider,
    { value: E.useMemo(() => ({
      watch: r,
      getValues: n,
      getFieldState: o,
      setError: a,
      clearErrors: i,
      setValue: s,
      trigger: c,
      formState: l,
      resetField: u,
      reset: d,
      handleSubmit: f,
      unregister: g,
      control: b,
      register: m,
      setFocus: h,
      subscribe: y
    }), [
      i,
      b,
      l,
      o,
      n,
      f,
      m,
      d,
      u,
      a,
      h,
      s,
      y,
      c,
      g,
      r
    ]) },
    E.createElement(Cl.Provider, { value: b }, t)
  );
}, xA = $T, Lb = p.createContext(
  {}
), _A = ({
  ...e
}) => /* @__PURE__ */ v(Lb.Provider, { value: { name: e.name }, children: /* @__PURE__ */ v(IT, { ...e }) }), go = () => {
  const e = p.useContext(Lb), t = p.useContext(jb), { getFieldState: r } = FT(), n = qb({ name: e.name }), o = r(e.name, n);
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
}, jb = p.createContext(
  {}
);
function SA({ className: e, ...t }) {
  const r = p.useId();
  return /* @__PURE__ */ v(jb.Provider, { value: { id: r }, children: /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "form-item",
      className: M("grid gap-2", e),
      ...t
    }
  ) });
}
function CA({
  className: e,
  ...t
}) {
  const { error: r, formItemId: n } = go();
  return /* @__PURE__ */ v(
    cP,
    {
      "data-slot": "form-label",
      "data-error": !!r,
      className: M("data-[error=true]:text-destructive", e),
      htmlFor: n,
      ...t
    }
  );
}
function OA({ ...e }) {
  const { error: t, formItemId: r, formDescriptionId: n, formMessageId: o } = go();
  return /* @__PURE__ */ v(
    ur,
    {
      "data-slot": "form-control",
      id: r,
      "aria-describedby": t ? `${n} ${o}` : `${n}`,
      "aria-invalid": !!t,
      ...e
    }
  );
}
function PA({ className: e, ...t }) {
  const { formDescriptionId: r } = go();
  return /* @__PURE__ */ v(
    "p",
    {
      "data-slot": "form-description",
      id: r,
      className: M("text-muted-foreground text-sm", e),
      ...t
    }
  );
}
function EA({ className: e, ...t }) {
  const { error: r, formMessageId: n } = go(), o = r ? String((r == null ? void 0 : r.message) ?? "") : t.children;
  return o ? /* @__PURE__ */ v(
    "p",
    {
      "data-slot": "form-message",
      id: n,
      className: M("text-destructive text-sm", e),
      ...t,
      children: o
    }
  ) : null;
}
function MA({
  ...e
}) {
  return /* @__PURE__ */ v(XC, { "data-slot": "popover", ...e });
}
function TA({
  ...e
}) {
  return /* @__PURE__ */ v(ZC, { "data-slot": "popover-trigger", ...e });
}
function RA({
  className: e,
  align: t = "center",
  sideOffset: r = 4,
  ...n
}) {
  return /* @__PURE__ */ v(QC, { children: /* @__PURE__ */ v(
    JC,
    {
      "data-slot": "popover-content",
      align: t,
      sideOffset: r,
      className: M(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        e
      ),
      ...n
    }
  ) });
}
function BT({
  className: e,
  orientation: t = "horizontal",
  decorative: r = !0,
  ...n
}) {
  return /* @__PURE__ */ v(
    BO,
    {
      "data-slot": "separator",
      decorative: r,
      orientation: t,
      className: M(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        e
      ),
      ...n
    }
  );
}
function WT({ ...e }) {
  return /* @__PURE__ */ v(tm, { "data-slot": "sheet", ...e });
}
function kA({
  ...e
}) {
  return /* @__PURE__ */ v(rm, { "data-slot": "sheet-trigger", ...e });
}
function qT({
  ...e
}) {
  return /* @__PURE__ */ v(nm, { "data-slot": "sheet-portal", ...e });
}
function LT({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    om,
    {
      "data-slot": "sheet-overlay",
      className: M(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        e
      ),
      ...t
    }
  );
}
function jT({
  className: e,
  children: t,
  side: r = "right",
  showCloseButton: n = !0,
  ...o
}) {
  return /* @__PURE__ */ ae(qT, { children: [
    /* @__PURE__ */ v(LT, {}),
    /* @__PURE__ */ ae(
      am,
      {
        "data-slot": "sheet-content",
        className: M(
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
          n && /* @__PURE__ */ ae(Lc, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ v(ob, { className: "size-4" }),
            /* @__PURE__ */ v("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function zT({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sheet-header",
      className: M("flex flex-col gap-1.5 p-4", e),
      ...t
    }
  );
}
function DA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sheet-footer",
      className: M("mt-auto flex flex-col gap-2 p-4", e),
      ...t
    }
  );
}
function HT({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    im,
    {
      "data-slot": "sheet-title",
      className: M("text-foreground font-semibold", e),
      ...t
    }
  );
}
function YT({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    sm,
    {
      "data-slot": "sheet-description",
      className: M("text-muted-foreground text-sm", e),
      ...t
    }
  );
}
const Qo = 768;
function VT() {
  const [e, t] = p.useState(
    void 0
  );
  return p.useEffect(() => {
    const r = window.matchMedia(`(max-width: ${Qo - 1}px)`), n = () => {
      t(window.innerWidth < Qo);
    };
    return r.addEventListener("change", n), t(window.innerWidth < Qo), () => r.removeEventListener("change", n);
  }, []), !!e;
}
function Xu({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "skeleton",
      className: M("bg-accent animate-pulse rounded-md", e),
      ...t
    }
  );
}
function GT({
  delayDuration: e = 0,
  ...t
}) {
  return /* @__PURE__ */ v(
    f0,
    {
      "data-slot": "tooltip-provider",
      delayDuration: e,
      ...t
    }
  );
}
function UT({
  ...e
}) {
  return /* @__PURE__ */ v(p0, { "data-slot": "tooltip", ...e });
}
function KT({
  ...e
}) {
  return /* @__PURE__ */ v(h0, { "data-slot": "tooltip-trigger", ...e });
}
function XT({
  className: e,
  sideOffset: t = 0,
  children: r,
  ...n
}) {
  return /* @__PURE__ */ v(m0, { children: /* @__PURE__ */ ae(
    g0,
    {
      "data-slot": "tooltip-content",
      sideOffset: t,
      className: M(
        "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        e
      ),
      ...n,
      children: [
        r,
        /* @__PURE__ */ v(v0, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
const ZT = "sidebar_state", QT = 3600 * 24 * 7, JT = "16rem", e1 = "18rem", t1 = "3rem", r1 = "b", zb = p.createContext(null);
function vo() {
  const e = p.useContext(zb);
  if (!e)
    throw new Error("useSidebar must be used within a SidebarProvider.");
  return e;
}
function NA({
  defaultOpen: e = !0,
  open: t,
  onOpenChange: r,
  className: n,
  style: o,
  children: a,
  ...i
}) {
  const s = VT(), [c, l] = p.useState(!1), [u, d] = p.useState(e), f = t ?? u, g = p.useCallback(
    (y) => {
      const w = typeof y == "function" ? y(f) : y;
      r ? r(w) : d(w), document.cookie = `${ZT}=${w}; path=/; max-age=${QT}`;
    },
    [r, f]
  ), b = p.useCallback(() => s ? l((y) => !y) : g((y) => !y), [s, g, l]);
  p.useEffect(() => {
    const y = (w) => {
      w.key === r1 && (w.metaKey || w.ctrlKey) && (w.preventDefault(), b());
    };
    return window.addEventListener("keydown", y), () => window.removeEventListener("keydown", y);
  }, [b]);
  const m = f ? "expanded" : "collapsed", h = p.useMemo(
    () => ({
      state: m,
      open: f,
      setOpen: g,
      isMobile: s,
      openMobile: c,
      setOpenMobile: l,
      toggleSidebar: b
    }),
    [m, f, g, s, c, l, b]
  );
  return /* @__PURE__ */ v(zb.Provider, { value: h, children: /* @__PURE__ */ v(GT, { delayDuration: 0, children: /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": JT,
        "--sidebar-width-icon": t1,
        ...o
      },
      className: M(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        n
      ),
      ...i,
      children: a
    }
  ) }) });
}
function AA({
  side: e = "left",
  variant: t = "sidebar",
  collapsible: r = "offcanvas",
  className: n,
  children: o,
  ...a
}) {
  const { isMobile: i, state: s, openMobile: c, setOpenMobile: l } = vo();
  return r === "none" ? /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar",
      className: M(
        "bg-veloce-glass backdrop-blur-2xl border-r border-white/5 text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
        n
      ),
      ...a,
      children: o
    }
  ) : i ? /* @__PURE__ */ v(WT, { open: c, onOpenChange: l, ...a, children: /* @__PURE__ */ ae(
    jT,
    {
      "data-sidebar": "sidebar",
      "data-slot": "sidebar",
      "data-mobile": "true",
      className: "bg-veloce-glass backdrop-blur-2xl border-r border-white/5 text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
      style: {
        "--sidebar-width": e1
      },
      side: e,
      children: [
        /* @__PURE__ */ ae(zT, { className: "sr-only", children: [
          /* @__PURE__ */ v(HT, { children: "Sidebar" }),
          /* @__PURE__ */ v(YT, { children: "Displays the mobile sidebar." })
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
            className: M(
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
            className: M(
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
function IA({
  className: e,
  onClick: t,
  ...r
}) {
  const { toggleSidebar: n } = vo();
  return /* @__PURE__ */ ae(
    fl,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      className: M("size-7", e),
      onClick: (o) => {
        t == null || t(o), n();
      },
      ...r,
      children: [
        /* @__PURE__ */ v(CP, {}),
        /* @__PURE__ */ v("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function FA({ className: e, ...t }) {
  const { toggleSidebar: r } = vo();
  return /* @__PURE__ */ v(
    "button",
    {
      "data-sidebar": "rail",
      "data-slot": "sidebar-rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: r,
      title: "Toggle Sidebar",
      className: M(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
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
function $A({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: M(
        "bg-transparent relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        e
      ),
      ...t
    }
  );
}
function BA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    sP,
    {
      "data-slot": "sidebar-input",
      "data-sidebar": "input",
      className: M("bg-background h-8 w-full shadow-none", e),
      ...t
    }
  );
}
function WA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: M("flex flex-col gap-2 p-2", e),
      ...t
    }
  );
}
function qA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: M("flex flex-col gap-2 p-2", e),
      ...t
    }
  );
}
function LA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    BT,
    {
      "data-slot": "sidebar-separator",
      "data-sidebar": "separator",
      className: M("bg-sidebar-border mx-2 w-auto", e),
      ...t
    }
  );
}
function jA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: M(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        e
      ),
      ...t
    }
  );
}
function zA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: M("relative flex w-full min-w-0 flex-col p-2", e),
      ...t
    }
  );
}
function HA({
  className: e,
  asChild: t = !1,
  ...r
}) {
  return /* @__PURE__ */ v(
    t ? ur : "div",
    {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      className: M(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        e
      ),
      ...r
    }
  );
}
function YA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      className: M("w-full text-sm", e),
      ...t
    }
  );
}
function VA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: M("flex w-full min-w-0 flex-col gap-1", e),
      ...t
    }
  );
}
function GA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: M("group/menu-item relative", e),
      ...t
    }
  );
}
const n1 = Fc(
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
function UA({
  asChild: e = !1,
  isActive: t = !1,
  variant: r = "default",
  size: n = "default",
  tooltip: o,
  className: a,
  ...i
}) {
  const s = e ? ur : "button", { isMobile: c, state: l } = vo(), u = /* @__PURE__ */ v(
    s,
    {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": n,
      "data-active": t,
      className: M(n1({ variant: r, size: n }), a),
      ...i
    }
  );
  return o ? (typeof o == "string" && (o = {
    children: o
  }), /* @__PURE__ */ ae(UT, { children: [
    /* @__PURE__ */ v(KT, { asChild: !0, children: u }),
    /* @__PURE__ */ v(
      XT,
      {
        side: "right",
        align: "center",
        hidden: l !== "collapsed" || c,
        ...o
      }
    )
  ] })) : u;
}
function KA({
  className: e,
  asChild: t = !1,
  showOnHover: r = !1,
  ...n
}) {
  return /* @__PURE__ */ v(
    t ? ur : "button",
    {
      "data-slot": "sidebar-menu-action",
      "data-sidebar": "menu-action",
      className: M(
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
function XA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "sidebar-menu-badge",
      "data-sidebar": "menu-badge",
      className: M(
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
function ZA({
  className: e,
  showIcon: t = !1,
  ...r
}) {
  const [n, o] = p.useState("100%");
  return p.useEffect(() => {
    o(`${Math.floor(Math.random() * 40) + 50}%`);
  }, []), /* @__PURE__ */ ae(
    "div",
    {
      "data-slot": "sidebar-menu-skeleton",
      "data-sidebar": "menu-skeleton",
      className: M("flex h-8 items-center gap-2 rounded-md px-2", e),
      ...r,
      children: [
        t && /* @__PURE__ */ v(
          Xu,
          {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
          }
        ),
        /* @__PURE__ */ v(
          Xu,
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
function QA({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "ul",
    {
      "data-slot": "sidebar-menu-sub",
      "data-sidebar": "menu-sub",
      className: M(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        e
      ),
      ...t
    }
  );
}
function JA({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    "li",
    {
      "data-slot": "sidebar-menu-sub-item",
      "data-sidebar": "menu-sub-item",
      className: M("group/menu-sub-item relative", e),
      ...t
    }
  );
}
function eI({
  asChild: e = !1,
  size: t = "md",
  isActive: r = !1,
  className: n,
  ...o
}) {
  return /* @__PURE__ */ v(
    e ? ur : "a",
    {
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      "data-size": t,
      "data-active": r,
      className: M(
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
function tI({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ v(
        "table",
        {
          "data-slot": "table",
          className: M("w-full caption-bottom text-sm", e),
          ...t
        }
      )
    }
  );
}
function rI({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "thead",
    {
      "data-slot": "table-header",
      className: M("[&_tr]:border-b", e),
      ...t
    }
  );
}
function nI({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "tbody",
    {
      "data-slot": "table-body",
      className: M("[&_tr:last-child]:border-0", e),
      ...t
    }
  );
}
function oI({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: M(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        e
      ),
      ...t
    }
  );
}
function aI({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "tr",
    {
      "data-slot": "table-row",
      className: M(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        e
      ),
      ...t
    }
  );
}
function iI({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "th",
    {
      "data-slot": "table-head",
      className: M(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        e
      ),
      ...t
    }
  );
}
function sI({ className: e, ...t }) {
  return /* @__PURE__ */ v(
    "td",
    {
      "data-slot": "table-cell",
      className: M(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        e
      ),
      ...t
    }
  );
}
function cI({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    "caption",
    {
      "data-slot": "table-caption",
      className: M("text-muted-foreground mt-4 text-sm", e),
      ...t
    }
  );
}
function lI({
  className: e,
  orientation: t = "horizontal",
  ...r
}) {
  return /* @__PURE__ */ v(
    GO,
    {
      suppressHydrationWarning: !0,
      "data-slot": "tabs",
      "data-orientation": t,
      orientation: t,
      className: M(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        e
      ),
      ...r
    }
  );
}
const o1 = Fc(
  "rounded-lg p-[3px] group-data-[orientation=horizontal]/tabs:h-9 data-[variant=line]:rounded-none group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function uI({
  className: e,
  variant: t = "default",
  ...r
}) {
  return /* @__PURE__ */ v(
    UO,
    {
      suppressHydrationWarning: !0,
      "data-slot": "tabs-list",
      "data-variant": t,
      className: M(o1({ variant: t }), e),
      ...r
    }
  );
}
function dI({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    KO,
    {
      suppressHydrationWarning: !0,
      "data-slot": "tabs-trigger",
      className: M(
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 data-[state=active]:text-foreground",
        "after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        e
      ),
      ...t
    }
  );
}
function fI({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ v(
    XO,
    {
      suppressHydrationWarning: !0,
      "data-slot": "tabs-content",
      className: M("flex-1 outline-none", e),
      ...t
    }
  );
}
var Jo, Zu;
function Ke() {
  if (Zu) return Jo;
  Zu = 1;
  var e = Array.isArray;
  return Jo = e, Jo;
}
var ea, Qu;
function Hb() {
  if (Qu) return ea;
  Qu = 1;
  var e = typeof ln == "object" && ln && ln.Object === Object && ln;
  return ea = e, ea;
}
var ta, Ju;
function ct() {
  if (Ju) return ta;
  Ju = 1;
  var e = Hb(), t = typeof self == "object" && self && self.Object === Object && self, r = e || t || Function("return this")();
  return ta = r, ta;
}
var ra, ed;
function tn() {
  if (ed) return ra;
  ed = 1;
  var e = ct(), t = e.Symbol;
  return ra = t, ra;
}
var na, td;
function a1() {
  if (td) return na;
  td = 1;
  var e = tn(), t = Object.prototype, r = t.hasOwnProperty, n = t.toString, o = e ? e.toStringTag : void 0;
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
  return na = a, na;
}
var oa, rd;
function i1() {
  if (rd) return oa;
  rd = 1;
  var e = Object.prototype, t = e.toString;
  function r(n) {
    return t.call(n);
  }
  return oa = r, oa;
}
var aa, nd;
function zt() {
  if (nd) return aa;
  nd = 1;
  var e = tn(), t = a1(), r = i1(), n = "[object Null]", o = "[object Undefined]", a = e ? e.toStringTag : void 0;
  function i(s) {
    return s == null ? s === void 0 ? o : n : a && a in Object(s) ? t(s) : r(s);
  }
  return aa = i, aa;
}
var ia, od;
function Ht() {
  if (od) return ia;
  od = 1;
  function e(t) {
    return t != null && typeof t == "object";
  }
  return ia = e, ia;
}
var sa, ad;
function rn() {
  if (ad) return sa;
  ad = 1;
  var e = zt(), t = Ht(), r = "[object Symbol]";
  function n(o) {
    return typeof o == "symbol" || t(o) && e(o) == r;
  }
  return sa = n, sa;
}
var ca, id;
function El() {
  if (id) return ca;
  id = 1;
  var e = Ke(), t = rn(), r = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, n = /^\w*$/;
  function o(a, i) {
    if (e(a))
      return !1;
    var s = typeof a;
    return s == "number" || s == "symbol" || s == "boolean" || a == null || t(a) ? !0 : n.test(a) || !r.test(a) || i != null && a in Object(i);
  }
  return ca = o, ca;
}
var la, sd;
function Rt() {
  if (sd) return la;
  sd = 1;
  function e(t) {
    var r = typeof t;
    return t != null && (r == "object" || r == "function");
  }
  return la = e, la;
}
var ua, cd;
function Ml() {
  if (cd) return ua;
  cd = 1;
  var e = zt(), t = Rt(), r = "[object AsyncFunction]", n = "[object Function]", o = "[object GeneratorFunction]", a = "[object Proxy]";
  function i(s) {
    if (!t(s))
      return !1;
    var c = e(s);
    return c == n || c == o || c == r || c == a;
  }
  return ua = i, ua;
}
var da, ld;
function s1() {
  if (ld) return da;
  ld = 1;
  var e = ct(), t = e["__core-js_shared__"];
  return da = t, da;
}
var fa, ud;
function c1() {
  if (ud) return fa;
  ud = 1;
  var e = s1(), t = (function() {
    var n = /[^.]+$/.exec(e && e.keys && e.keys.IE_PROTO || "");
    return n ? "Symbol(src)_1." + n : "";
  })();
  function r(n) {
    return !!t && t in n;
  }
  return fa = r, fa;
}
var pa, dd;
function Yb() {
  if (dd) return pa;
  dd = 1;
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
  return pa = r, pa;
}
var ha, fd;
function l1() {
  if (fd) return ha;
  fd = 1;
  var e = Ml(), t = c1(), r = Rt(), n = Yb(), o = /[\\^$.*+?()[\]{}|]/g, a = /^\[object .+?Constructor\]$/, i = Function.prototype, s = Object.prototype, c = i.toString, l = s.hasOwnProperty, u = RegExp(
    "^" + c.call(l).replace(o, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function d(f) {
    if (!r(f) || t(f))
      return !1;
    var g = e(f) ? u : a;
    return g.test(n(f));
  }
  return ha = d, ha;
}
var ma, pd;
function u1() {
  if (pd) return ma;
  pd = 1;
  function e(t, r) {
    return t == null ? void 0 : t[r];
  }
  return ma = e, ma;
}
var ga, hd;
function Yt() {
  if (hd) return ga;
  hd = 1;
  var e = l1(), t = u1();
  function r(n, o) {
    var a = t(n, o);
    return e(a) ? a : void 0;
  }
  return ga = r, ga;
}
var va, md;
function bo() {
  if (md) return va;
  md = 1;
  var e = Yt(), t = e(Object, "create");
  return va = t, va;
}
var ba, gd;
function d1() {
  if (gd) return ba;
  gd = 1;
  var e = bo();
  function t() {
    this.__data__ = e ? e(null) : {}, this.size = 0;
  }
  return ba = t, ba;
}
var ya, vd;
function f1() {
  if (vd) return ya;
  vd = 1;
  function e(t) {
    var r = this.has(t) && delete this.__data__[t];
    return this.size -= r ? 1 : 0, r;
  }
  return ya = e, ya;
}
var wa, bd;
function p1() {
  if (bd) return wa;
  bd = 1;
  var e = bo(), t = "__lodash_hash_undefined__", r = Object.prototype, n = r.hasOwnProperty;
  function o(a) {
    var i = this.__data__;
    if (e) {
      var s = i[a];
      return s === t ? void 0 : s;
    }
    return n.call(i, a) ? i[a] : void 0;
  }
  return wa = o, wa;
}
var xa, yd;
function h1() {
  if (yd) return xa;
  yd = 1;
  var e = bo(), t = Object.prototype, r = t.hasOwnProperty;
  function n(o) {
    var a = this.__data__;
    return e ? a[o] !== void 0 : r.call(a, o);
  }
  return xa = n, xa;
}
var _a, wd;
function m1() {
  if (wd) return _a;
  wd = 1;
  var e = bo(), t = "__lodash_hash_undefined__";
  function r(n, o) {
    var a = this.__data__;
    return this.size += this.has(n) ? 0 : 1, a[n] = e && o === void 0 ? t : o, this;
  }
  return _a = r, _a;
}
var Sa, xd;
function g1() {
  if (xd) return Sa;
  xd = 1;
  var e = d1(), t = f1(), r = p1(), n = h1(), o = m1();
  function a(i) {
    var s = -1, c = i == null ? 0 : i.length;
    for (this.clear(); ++s < c; ) {
      var l = i[s];
      this.set(l[0], l[1]);
    }
  }
  return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = r, a.prototype.has = n, a.prototype.set = o, Sa = a, Sa;
}
var Ca, _d;
function v1() {
  if (_d) return Ca;
  _d = 1;
  function e() {
    this.__data__ = [], this.size = 0;
  }
  return Ca = e, Ca;
}
var Oa, Sd;
function Tl() {
  if (Sd) return Oa;
  Sd = 1;
  function e(t, r) {
    return t === r || t !== t && r !== r;
  }
  return Oa = e, Oa;
}
var Pa, Cd;
function yo() {
  if (Cd) return Pa;
  Cd = 1;
  var e = Tl();
  function t(r, n) {
    for (var o = r.length; o--; )
      if (e(r[o][0], n))
        return o;
    return -1;
  }
  return Pa = t, Pa;
}
var Ea, Od;
function b1() {
  if (Od) return Ea;
  Od = 1;
  var e = yo(), t = Array.prototype, r = t.splice;
  function n(o) {
    var a = this.__data__, i = e(a, o);
    if (i < 0)
      return !1;
    var s = a.length - 1;
    return i == s ? a.pop() : r.call(a, i, 1), --this.size, !0;
  }
  return Ea = n, Ea;
}
var Ma, Pd;
function y1() {
  if (Pd) return Ma;
  Pd = 1;
  var e = yo();
  function t(r) {
    var n = this.__data__, o = e(n, r);
    return o < 0 ? void 0 : n[o][1];
  }
  return Ma = t, Ma;
}
var Ta, Ed;
function w1() {
  if (Ed) return Ta;
  Ed = 1;
  var e = yo();
  function t(r) {
    return e(this.__data__, r) > -1;
  }
  return Ta = t, Ta;
}
var Ra, Md;
function x1() {
  if (Md) return Ra;
  Md = 1;
  var e = yo();
  function t(r, n) {
    var o = this.__data__, a = e(o, r);
    return a < 0 ? (++this.size, o.push([r, n])) : o[a][1] = n, this;
  }
  return Ra = t, Ra;
}
var ka, Td;
function wo() {
  if (Td) return ka;
  Td = 1;
  var e = v1(), t = b1(), r = y1(), n = w1(), o = x1();
  function a(i) {
    var s = -1, c = i == null ? 0 : i.length;
    for (this.clear(); ++s < c; ) {
      var l = i[s];
      this.set(l[0], l[1]);
    }
  }
  return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = r, a.prototype.has = n, a.prototype.set = o, ka = a, ka;
}
var Da, Rd;
function Rl() {
  if (Rd) return Da;
  Rd = 1;
  var e = Yt(), t = ct(), r = e(t, "Map");
  return Da = r, Da;
}
var Na, kd;
function _1() {
  if (kd) return Na;
  kd = 1;
  var e = g1(), t = wo(), r = Rl();
  function n() {
    this.size = 0, this.__data__ = {
      hash: new e(),
      map: new (r || t)(),
      string: new e()
    };
  }
  return Na = n, Na;
}
var Aa, Dd;
function S1() {
  if (Dd) return Aa;
  Dd = 1;
  function e(t) {
    var r = typeof t;
    return r == "string" || r == "number" || r == "symbol" || r == "boolean" ? t !== "__proto__" : t === null;
  }
  return Aa = e, Aa;
}
var Ia, Nd;
function xo() {
  if (Nd) return Ia;
  Nd = 1;
  var e = S1();
  function t(r, n) {
    var o = r.__data__;
    return e(n) ? o[typeof n == "string" ? "string" : "hash"] : o.map;
  }
  return Ia = t, Ia;
}
var Fa, Ad;
function C1() {
  if (Ad) return Fa;
  Ad = 1;
  var e = xo();
  function t(r) {
    var n = e(this, r).delete(r);
    return this.size -= n ? 1 : 0, n;
  }
  return Fa = t, Fa;
}
var $a, Id;
function O1() {
  if (Id) return $a;
  Id = 1;
  var e = xo();
  function t(r) {
    return e(this, r).get(r);
  }
  return $a = t, $a;
}
var Ba, Fd;
function P1() {
  if (Fd) return Ba;
  Fd = 1;
  var e = xo();
  function t(r) {
    return e(this, r).has(r);
  }
  return Ba = t, Ba;
}
var Wa, $d;
function E1() {
  if ($d) return Wa;
  $d = 1;
  var e = xo();
  function t(r, n) {
    var o = e(this, r), a = o.size;
    return o.set(r, n), this.size += o.size == a ? 0 : 1, this;
  }
  return Wa = t, Wa;
}
var qa, Bd;
function kl() {
  if (Bd) return qa;
  Bd = 1;
  var e = _1(), t = C1(), r = O1(), n = P1(), o = E1();
  function a(i) {
    var s = -1, c = i == null ? 0 : i.length;
    for (this.clear(); ++s < c; ) {
      var l = i[s];
      this.set(l[0], l[1]);
    }
  }
  return a.prototype.clear = e, a.prototype.delete = t, a.prototype.get = r, a.prototype.has = n, a.prototype.set = o, qa = a, qa;
}
var La, Wd;
function M1() {
  if (Wd) return La;
  Wd = 1;
  var e = kl(), t = "Expected a function";
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
  return r.Cache = e, La = r, La;
}
var ja, qd;
function T1() {
  if (qd) return ja;
  qd = 1;
  var e = M1(), t = 500;
  function r(n) {
    var o = e(n, function(i) {
      return a.size === t && a.clear(), i;
    }), a = o.cache;
    return o;
  }
  return ja = r, ja;
}
var za, Ld;
function R1() {
  if (Ld) return za;
  Ld = 1;
  var e = T1(), t = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, r = /\\(\\)?/g, n = e(function(o) {
    var a = [];
    return o.charCodeAt(0) === 46 && a.push(""), o.replace(t, function(i, s, c, l) {
      a.push(c ? l.replace(r, "$1") : s || i);
    }), a;
  });
  return za = n, za;
}
var Ha, jd;
function Vb() {
  if (jd) return Ha;
  jd = 1;
  function e(t, r) {
    for (var n = -1, o = t == null ? 0 : t.length, a = Array(o); ++n < o; )
      a[n] = r(t[n], n, t);
    return a;
  }
  return Ha = e, Ha;
}
var Ya, zd;
function k1() {
  if (zd) return Ya;
  zd = 1;
  var e = tn(), t = Vb(), r = Ke(), n = rn(), o = e ? e.prototype : void 0, a = o ? o.toString : void 0;
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
  return Ya = i, Ya;
}
var Va, Hd;
function Gb() {
  if (Hd) return Va;
  Hd = 1;
  var e = k1();
  function t(r) {
    return r == null ? "" : e(r);
  }
  return Va = t, Va;
}
var Ga, Yd;
function Ub() {
  if (Yd) return Ga;
  Yd = 1;
  var e = Ke(), t = El(), r = R1(), n = Gb();
  function o(a, i) {
    return e(a) ? a : t(a, i) ? [a] : r(n(a));
  }
  return Ga = o, Ga;
}
var Ua, Vd;
function _o() {
  if (Vd) return Ua;
  Vd = 1;
  var e = rn();
  function t(r) {
    if (typeof r == "string" || e(r))
      return r;
    var n = r + "";
    return n == "0" && 1 / r == -1 / 0 ? "-0" : n;
  }
  return Ua = t, Ua;
}
var Ka, Gd;
function Dl() {
  if (Gd) return Ka;
  Gd = 1;
  var e = Ub(), t = _o();
  function r(n, o) {
    o = e(o, n);
    for (var a = 0, i = o.length; n != null && a < i; )
      n = n[t(o[a++])];
    return a && a == i ? n : void 0;
  }
  return Ka = r, Ka;
}
var Xa, Ud;
function Kb() {
  if (Ud) return Xa;
  Ud = 1;
  var e = Dl();
  function t(r, n, o) {
    var a = r == null ? void 0 : e(r, n);
    return a === void 0 ? o : a;
  }
  return Xa = t, Xa;
}
Kb();
var Za, Kd;
function D1() {
  if (Kd) return Za;
  Kd = 1;
  function e(t) {
    return t == null;
  }
  return Za = e, Za;
}
var N1 = D1();
const A1 = /* @__PURE__ */ at(N1);
var Qa, Xd;
function I1() {
  if (Xd) return Qa;
  Xd = 1;
  var e = zt(), t = Ke(), r = Ht(), n = "[object String]";
  function o(a) {
    return typeof a == "string" || !t(a) && r(a) && e(a) == n;
  }
  return Qa = o, Qa;
}
var F1 = I1();
const Xb = /* @__PURE__ */ at(F1);
var $1 = Ml();
const An = /* @__PURE__ */ at($1);
var B1 = Rt();
const Zb = /* @__PURE__ */ at(B1);
var mn = { exports: {} }, de = {};
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Zd;
function W1() {
  if (Zd) return de;
  Zd = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), a = Symbol.for("react.provider"), i = Symbol.for("react.context"), s = Symbol.for("react.server_context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.suspense_list"), d = Symbol.for("react.memo"), f = Symbol.for("react.lazy"), g = Symbol.for("react.offscreen"), b;
  b = Symbol.for("react.module.reference");
  function m(h) {
    if (typeof h == "object" && h !== null) {
      var y = h.$$typeof;
      switch (y) {
        case e:
          switch (h = h.type, h) {
            case r:
            case o:
            case n:
            case l:
            case u:
              return h;
            default:
              switch (h = h && h.$$typeof, h) {
                case s:
                case i:
                case c:
                case f:
                case d:
                case a:
                  return h;
                default:
                  return y;
              }
          }
        case t:
          return y;
      }
    }
  }
  return de.ContextConsumer = i, de.ContextProvider = a, de.Element = e, de.ForwardRef = c, de.Fragment = r, de.Lazy = f, de.Memo = d, de.Portal = t, de.Profiler = o, de.StrictMode = n, de.Suspense = l, de.SuspenseList = u, de.isAsyncMode = function() {
    return !1;
  }, de.isConcurrentMode = function() {
    return !1;
  }, de.isContextConsumer = function(h) {
    return m(h) === i;
  }, de.isContextProvider = function(h) {
    return m(h) === a;
  }, de.isElement = function(h) {
    return typeof h == "object" && h !== null && h.$$typeof === e;
  }, de.isForwardRef = function(h) {
    return m(h) === c;
  }, de.isFragment = function(h) {
    return m(h) === r;
  }, de.isLazy = function(h) {
    return m(h) === f;
  }, de.isMemo = function(h) {
    return m(h) === d;
  }, de.isPortal = function(h) {
    return m(h) === t;
  }, de.isProfiler = function(h) {
    return m(h) === o;
  }, de.isStrictMode = function(h) {
    return m(h) === n;
  }, de.isSuspense = function(h) {
    return m(h) === l;
  }, de.isSuspenseList = function(h) {
    return m(h) === u;
  }, de.isValidElementType = function(h) {
    return typeof h == "string" || typeof h == "function" || h === r || h === o || h === n || h === l || h === u || h === g || typeof h == "object" && h !== null && (h.$$typeof === f || h.$$typeof === d || h.$$typeof === a || h.$$typeof === i || h.$$typeof === c || h.$$typeof === b || h.getModuleId !== void 0);
  }, de.typeOf = m, de;
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
var Qd;
function q1() {
  return Qd || (Qd = 1, process.env.NODE_ENV !== "production" && (function() {
    var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), a = Symbol.for("react.provider"), i = Symbol.for("react.context"), s = Symbol.for("react.server_context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.suspense_list"), d = Symbol.for("react.memo"), f = Symbol.for("react.lazy"), g = Symbol.for("react.offscreen"), b = !1, m = !1, h = !1, y = !1, w = !1, x;
    x = Symbol.for("react.module.reference");
    function _(L) {
      return !!(typeof L == "string" || typeof L == "function" || L === r || L === o || w || L === n || L === l || L === u || y || L === g || b || m || h || typeof L == "object" && L !== null && (L.$$typeof === f || L.$$typeof === d || L.$$typeof === a || L.$$typeof === i || L.$$typeof === c || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      L.$$typeof === x || L.getModuleId !== void 0));
    }
    function C(L) {
      if (typeof L == "object" && L !== null) {
        var Ne = L.$$typeof;
        switch (Ne) {
          case e:
            var Ae = L.type;
            switch (Ae) {
              case r:
              case o:
              case n:
              case l:
              case u:
                return Ae;
              default:
                var Ze = Ae && Ae.$$typeof;
                switch (Ze) {
                  case s:
                  case i:
                  case c:
                  case f:
                  case d:
                  case a:
                    return Ze;
                  default:
                    return Ne;
                }
            }
          case t:
            return Ne;
        }
      }
    }
    var S = i, O = a, P = e, T = c, A = r, k = f, q = d, D = t, F = o, $ = n, I = l, Y = u, B = !1, N = !1;
    function R(L) {
      return B || (B = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 18+.")), !1;
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
    function G(L) {
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
    fe.ContextConsumer = S, fe.ContextProvider = O, fe.Element = P, fe.ForwardRef = T, fe.Fragment = A, fe.Lazy = k, fe.Memo = q, fe.Portal = D, fe.Profiler = F, fe.StrictMode = $, fe.Suspense = I, fe.SuspenseList = Y, fe.isAsyncMode = R, fe.isConcurrentMode = X, fe.isContextConsumer = le, fe.isContextProvider = me, fe.isElement = ge, fe.isForwardRef = se, fe.isFragment = ne, fe.isLazy = z, fe.isMemo = re, fe.isPortal = G, fe.isProfiler = Q, fe.isStrictMode = ee, fe.isSuspense = te, fe.isSuspenseList = be, fe.isValidElementType = _, fe.typeOf = C;
  })()), fe;
}
var Jd;
function L1() {
  return Jd || (Jd = 1, process.env.NODE_ENV === "production" ? mn.exports = W1() : mn.exports = q1()), mn.exports;
}
L1();
var Ja, ef;
function Qb() {
  if (ef) return Ja;
  ef = 1;
  var e = zt(), t = Ht(), r = "[object Number]";
  function n(o) {
    return typeof o == "number" || t(o) && e(o) == r;
  }
  return Ja = n, Ja;
}
var ei, tf;
function j1() {
  if (tf) return ei;
  tf = 1;
  var e = Qb();
  function t(r) {
    return e(r) && r != +r;
  }
  return ei = t, ei;
}
var z1 = j1();
const H1 = /* @__PURE__ */ at(z1);
var Y1 = Qb();
const V1 = /* @__PURE__ */ at(Y1);
var gn = function(t) {
  return Xb(t) && t.indexOf("%") === t.length - 1;
}, He = function(t) {
  return V1(t) && !H1(t);
}, In = function(t) {
  return He(t) || Xb(t);
};
function xc(e) {
  "@babel/helpers - typeof";
  return xc = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, xc(e);
}
var G1 = ["viewBox", "children"], U1 = [
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
], rf = ["points", "pathLength"], ti = {
  svg: G1,
  polygon: rf,
  polyline: rf
}, Jb = ["dangerouslySetInnerHTML", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onPaste", "onPasteCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onChangeCapture", "onBeforeInput", "onBeforeInputCapture", "onInput", "onInputCapture", "onReset", "onResetCapture", "onSubmit", "onSubmitCapture", "onInvalid", "onInvalidCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onAbort", "onAbortCapture", "onCanPlay", "onCanPlayCapture", "onCanPlayThrough", "onCanPlayThroughCapture", "onDurationChange", "onDurationChangeCapture", "onEmptied", "onEmptiedCapture", "onEncrypted", "onEncryptedCapture", "onEnded", "onEndedCapture", "onLoadedData", "onLoadedDataCapture", "onLoadedMetadata", "onLoadedMetadataCapture", "onLoadStart", "onLoadStartCapture", "onPause", "onPauseCapture", "onPlay", "onPlayCapture", "onPlaying", "onPlayingCapture", "onProgress", "onProgressCapture", "onRateChange", "onRateChangeCapture", "onSeeked", "onSeekedCapture", "onSeeking", "onSeekingCapture", "onStalled", "onStalledCapture", "onSuspend", "onSuspendCapture", "onTimeUpdate", "onTimeUpdateCapture", "onVolumeChange", "onVolumeChangeCapture", "onWaiting", "onWaitingCapture", "onAuxClick", "onAuxClickCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onSelect", "onSelectCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onPointerDown", "onPointerDownCapture", "onPointerMove", "onPointerMoveCapture", "onPointerUp", "onPointerUpCapture", "onPointerCancel", "onPointerCancelCapture", "onPointerEnter", "onPointerEnterCapture", "onPointerLeave", "onPointerLeaveCapture", "onPointerOver", "onPointerOverCapture", "onPointerOut", "onPointerOutCapture", "onGotPointerCapture", "onGotPointerCaptureCapture", "onLostPointerCapture", "onLostPointerCaptureCapture", "onScroll", "onScrollCapture", "onWheel", "onWheelCapture", "onAnimationStart", "onAnimationStartCapture", "onAnimationEnd", "onAnimationEndCapture", "onAnimationIteration", "onAnimationIterationCapture", "onTransitionEnd", "onTransitionEndCapture"], K1 = function(t, r, n) {
  return function(o) {
    return t(r, n, o), null;
  };
}, X1 = function(t, r, n) {
  if (!Zb(t) || xc(t) !== "object")
    return null;
  var o = null;
  return Object.keys(t).forEach(function(a) {
    var i = t[a];
    Jb.includes(a) && typeof i == "function" && (o || (o = {}), o[a] = K1(i, r, n));
  }), o;
}, Z1 = function(t) {
  return typeof t == "string" ? t : t ? t.displayName || t.name || "Component" : "";
}, Q1 = function(t, r, n, o) {
  var a, i = (a = ti == null ? void 0 : ti[o]) !== null && a !== void 0 ? a : [];
  return r.startsWith("data-") || !An(t) && (o && i.includes(r) || U1.includes(r)) || Jb.includes(r);
}, ey = function(t, r, n) {
  if (!t || typeof t == "function" || typeof t == "boolean")
    return null;
  var o = t;
  if (/* @__PURE__ */ Jy(t) && (o = t.props), !Zb(o))
    return null;
  var a = {};
  return Object.keys(o).forEach(function(i) {
    var s;
    Q1((s = o) === null || s === void 0 ? void 0 : s[i], i, r, n) && (a[i] = o[i]);
  }), a;
}, J1 = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];
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
function eR(e, t) {
  if (e == null) return {};
  var r = tR(e, t), n, o;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (o = 0; o < a.length; o++)
      n = a[o], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function tR(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function rR(e) {
  var t = e.children, r = e.width, n = e.height, o = e.viewBox, a = e.className, i = e.style, s = e.title, c = e.desc, l = eR(e, J1), u = o || {
    width: r,
    height: n,
    x: 0,
    y: 0
  }, d = pt("recharts-surface", a);
  return /* @__PURE__ */ E.createElement("svg", _c({}, ey(l, !0, "svg"), {
    className: d,
    width: r,
    height: n,
    style: i,
    viewBox: "".concat(u.x, " ").concat(u.y, " ").concat(u.width, " ").concat(u.height)
  }), /* @__PURE__ */ E.createElement("title", null, s), /* @__PURE__ */ E.createElement("desc", null, c), t);
}
var nR = process.env.NODE_ENV !== "production", Cn = function(t, r) {
  for (var n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), a = 2; a < n; a++)
    o[a - 2] = arguments[a];
  if (nR && typeof console < "u" && console.warn && (r === void 0 && console.warn("LogUtils requires an error message argument"), !t))
    if (r === void 0)
      console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
    else {
      var i = 0;
      console.warn(r.replace(/%s/g, function() {
        return o[i++];
      }));
    }
}, ri, nf;
function oR() {
  if (nf) return ri;
  nf = 1;
  function e(t, r, n) {
    var o = -1, a = t.length;
    r < 0 && (r = -r > a ? 0 : a + r), n = n > a ? a : n, n < 0 && (n += a), a = r > n ? 0 : n - r >>> 0, r >>>= 0;
    for (var i = Array(a); ++o < a; )
      i[o] = t[o + r];
    return i;
  }
  return ri = e, ri;
}
var ni, of;
function aR() {
  if (of) return ni;
  of = 1;
  var e = oR();
  function t(r, n, o) {
    var a = r.length;
    return o = o === void 0 ? a : o, !n && o >= a ? r : e(r, n, o);
  }
  return ni = t, ni;
}
var oi, af;
function ty() {
  if (af) return oi;
  af = 1;
  var e = "\\ud800-\\udfff", t = "\\u0300-\\u036f", r = "\\ufe20-\\ufe2f", n = "\\u20d0-\\u20ff", o = t + r + n, a = "\\ufe0e\\ufe0f", i = "\\u200d", s = RegExp("[" + i + e + o + a + "]");
  function c(l) {
    return s.test(l);
  }
  return oi = c, oi;
}
var ai, sf;
function iR() {
  if (sf) return ai;
  sf = 1;
  function e(t) {
    return t.split("");
  }
  return ai = e, ai;
}
var ii, cf;
function sR() {
  if (cf) return ii;
  cf = 1;
  var e = "\\ud800-\\udfff", t = "\\u0300-\\u036f", r = "\\ufe20-\\ufe2f", n = "\\u20d0-\\u20ff", o = t + r + n, a = "\\ufe0e\\ufe0f", i = "[" + e + "]", s = "[" + o + "]", c = "\\ud83c[\\udffb-\\udfff]", l = "(?:" + s + "|" + c + ")", u = "[^" + e + "]", d = "(?:\\ud83c[\\udde6-\\uddff]){2}", f = "[\\ud800-\\udbff][\\udc00-\\udfff]", g = "\\u200d", b = l + "?", m = "[" + a + "]?", h = "(?:" + g + "(?:" + [u, d, f].join("|") + ")" + m + b + ")*", y = m + b + h, w = "(?:" + [u + s + "?", s, d, f, i].join("|") + ")", x = RegExp(c + "(?=" + c + ")|" + w + y, "g");
  function _(C) {
    return C.match(x) || [];
  }
  return ii = _, ii;
}
var si, lf;
function cR() {
  if (lf) return si;
  lf = 1;
  var e = iR(), t = ty(), r = sR();
  function n(o) {
    return t(o) ? r(o) : e(o);
  }
  return si = n, si;
}
var ci, uf;
function lR() {
  if (uf) return ci;
  uf = 1;
  var e = aR(), t = ty(), r = cR(), n = Gb();
  function o(a) {
    return function(i) {
      i = n(i);
      var s = t(i) ? r(i) : void 0, c = s ? s[0] : i.charAt(0), l = s ? e(s, 1).join("") : i.slice(1);
      return c[a]() + l;
    };
  }
  return ci = o, ci;
}
var li, df;
function uR() {
  if (df) return li;
  df = 1;
  var e = lR(), t = e("toUpperCase");
  return li = t, li;
}
var dR = uR();
const ry = /* @__PURE__ */ at(dR);
function vn(e) {
  return function() {
    return e;
  };
}
const ny = Math.cos, Fn = Math.sin, Xe = Math.sqrt, $n = Math.PI, So = 2 * $n, Sc = Math.PI, Cc = 2 * Sc, Nt = 1e-6, fR = Cc - Nt;
function oy(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function pR(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return oy;
  const r = 10 ** t;
  return function(n) {
    this._ += n[0];
    for (let o = 1, a = n.length; o < a; ++o)
      this._ += Math.round(arguments[o] * r) / r + n[o];
  };
}
class hR {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? oy : pR(t);
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
      let g = n - i, b = o - s, m = c * c + l * l, h = g * g + b * b, y = Math.sqrt(m), w = Math.sqrt(f), x = a * Math.tan((Sc - Math.acos((m + f - h) / (2 * y * w))) / 2), _ = x / w, C = x / y;
      Math.abs(_ - 1) > Nt && this._append`L${t + _ * u},${r + _ * d}`, this._append`A${a},${a},0,0,${+(d * g > u * b)},${this._x1 = t + C * c},${this._y1 = r + C * l}`;
    }
  }
  arc(t, r, n, o, a, i) {
    if (t = +t, r = +r, n = +n, i = !!i, n < 0) throw new Error(`negative radius: ${n}`);
    let s = n * Math.cos(o), c = n * Math.sin(o), l = t + s, u = r + c, d = 1 ^ i, f = i ? o - a : a - o;
    this._x1 === null ? this._append`M${l},${u}` : (Math.abs(this._x1 - l) > Nt || Math.abs(this._y1 - u) > Nt) && this._append`L${l},${u}`, n && (f < 0 && (f = f % Cc + Cc), f > fR ? this._append`A${n},${n},0,1,${d},${t - s},${r - c}A${n},${n},0,1,${d},${this._x1 = l},${this._y1 = u}` : f > Nt && this._append`A${n},${n},0,${+(f >= Sc)},${d},${this._x1 = t + n * Math.cos(a)},${this._y1 = r + n * Math.sin(a)}`);
  }
  rect(t, r, n, o) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${n = +n}v${+o}h${-n}Z`;
  }
  toString() {
    return this._;
  }
}
function mR(e) {
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
  }, () => new hR(t);
}
const Nl = {
  draw(e, t) {
    const r = Xe(t / $n);
    e.moveTo(r, 0), e.arc(0, 0, r, 0, So);
  }
}, gR = {
  draw(e, t) {
    const r = Xe(t / 5) / 2;
    e.moveTo(-3 * r, -r), e.lineTo(-r, -r), e.lineTo(-r, -3 * r), e.lineTo(r, -3 * r), e.lineTo(r, -r), e.lineTo(3 * r, -r), e.lineTo(3 * r, r), e.lineTo(r, r), e.lineTo(r, 3 * r), e.lineTo(-r, 3 * r), e.lineTo(-r, r), e.lineTo(-3 * r, r), e.closePath();
  }
}, ay = Xe(1 / 3), vR = ay * 2, bR = {
  draw(e, t) {
    const r = Xe(t / vR), n = r * ay;
    e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath();
  }
}, yR = {
  draw(e, t) {
    const r = Xe(t), n = -r / 2;
    e.rect(n, n, r, r);
  }
}, wR = 0.8908130915292852, iy = Fn($n / 10) / Fn(7 * $n / 10), xR = Fn(So / 10) * iy, _R = -ny(So / 10) * iy, SR = {
  draw(e, t) {
    const r = Xe(t * wR), n = xR * r, o = _R * r;
    e.moveTo(0, -r), e.lineTo(n, o);
    for (let a = 1; a < 5; ++a) {
      const i = So * a / 5, s = ny(i), c = Fn(i);
      e.lineTo(c * r, -s * r), e.lineTo(s * n - c * o, c * n + s * o);
    }
    e.closePath();
  }
}, ui = Xe(3), CR = {
  draw(e, t) {
    const r = -Xe(t / (ui * 3));
    e.moveTo(0, r * 2), e.lineTo(-ui * r, -r), e.lineTo(ui * r, -r), e.closePath();
  }
}, Ie = -0.5, Fe = Xe(3) / 2, Oc = 1 / Xe(12), OR = (Oc / 2 + 1) * 3, PR = {
  draw(e, t) {
    const r = Xe(t / OR), n = r / 2, o = r * Oc, a = n, i = r * Oc + r, s = -a, c = i;
    e.moveTo(n, o), e.lineTo(a, i), e.lineTo(s, c), e.lineTo(Ie * n - Fe * o, Fe * n + Ie * o), e.lineTo(Ie * a - Fe * i, Fe * a + Ie * i), e.lineTo(Ie * s - Fe * c, Fe * s + Ie * c), e.lineTo(Ie * n + Fe * o, Ie * o - Fe * n), e.lineTo(Ie * a + Fe * i, Ie * i - Fe * a), e.lineTo(Ie * s + Fe * c, Ie * c - Fe * s), e.closePath();
  }
};
function ER(e, t) {
  let r = null, n = mR(o);
  e = typeof e == "function" ? e : vn(e || Nl), t = typeof t == "function" ? t : vn(t === void 0 ? 64 : +t);
  function o() {
    let a;
    if (r || (r = a = n()), e.apply(this, arguments).draw(r, +t.apply(this, arguments)), a) return r = null, a + "" || null;
  }
  return o.type = function(a) {
    return arguments.length ? (e = typeof a == "function" ? a : vn(a), o) : e;
  }, o.size = function(a) {
    return arguments.length ? (t = typeof a == "function" ? a : vn(+a), o) : t;
  }, o.context = function(a) {
    return arguments.length ? (r = a ?? null, o) : r;
  }, o;
}
function Fr(e) {
  "@babel/helpers - typeof";
  return Fr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Fr(e);
}
var MR = ["type", "size", "sizeType"];
function Pc() {
  return Pc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Pc.apply(this, arguments);
}
function ff(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function pf(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ff(Object(r), !0).forEach(function(n) {
      TR(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ff(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function TR(e, t, r) {
  return t = RR(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function RR(e) {
  var t = kR(e, "string");
  return Fr(t) == "symbol" ? t : t + "";
}
function kR(e, t) {
  if (Fr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Fr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function DR(e, t) {
  if (e == null) return {};
  var r = NR(e, t), n, o;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (o = 0; o < a.length; o++)
      n = a[o], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function NR(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var sy = {
  symbolCircle: Nl,
  symbolCross: gR,
  symbolDiamond: bR,
  symbolSquare: yR,
  symbolStar: SR,
  symbolTriangle: CR,
  symbolWye: PR
}, AR = Math.PI / 180, IR = function(t) {
  var r = "symbol".concat(ry(t));
  return sy[r] || Nl;
}, FR = function(t, r, n) {
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
      var o = 18 * AR;
      return 1.25 * t * t * (Math.tan(o) - Math.tan(o * 2) * Math.pow(Math.tan(o), 2));
    }
    case "triangle":
      return Math.sqrt(3) * t * t / 4;
    case "wye":
      return (21 - 10 * Math.sqrt(3)) * t * t / 8;
    default:
      return Math.PI * t * t / 4;
  }
}, $R = function(t, r) {
  sy["symbol".concat(ry(t))] = r;
}, cy = function(t) {
  var r = t.type, n = r === void 0 ? "circle" : r, o = t.size, a = o === void 0 ? 64 : o, i = t.sizeType, s = i === void 0 ? "area" : i, c = DR(t, MR), l = pf(pf({}, c), {}, {
    type: n,
    size: a,
    sizeType: s
  }), u = function() {
    var h = IR(n), y = ER().type(h).size(FR(a, s, n));
    return y();
  }, d = l.className, f = l.cx, g = l.cy, b = ey(l, !0);
  return f === +f && g === +g && a === +a ? /* @__PURE__ */ E.createElement("path", Pc({}, b, {
    className: pt("recharts-symbols", d),
    transform: "translate(".concat(f, ", ").concat(g, ")"),
    d: u()
  })) : null;
};
cy.registerSymbol = $R;
function ir(e) {
  "@babel/helpers - typeof";
  return ir = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ir(e);
}
function Ec() {
  return Ec = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Ec.apply(this, arguments);
}
function hf(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function BR(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? hf(Object(r), !0).forEach(function(n) {
      $r(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : hf(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function WR(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function qR(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, uy(n.key), n);
  }
}
function LR(e, t, r) {
  return t && qR(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function jR(e, t, r) {
  return t = Bn(t), zR(e, ly() ? Reflect.construct(t, r || [], Bn(e).constructor) : t.apply(e, r));
}
function zR(e, t) {
  if (t && (ir(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return HR(e);
}
function HR(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function ly() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (ly = function() {
    return !!e;
  })();
}
function Bn(e) {
  return Bn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Bn(e);
}
function YR(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Mc(e, t);
}
function Mc(e, t) {
  return Mc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, Mc(e, t);
}
function $r(e, t, r) {
  return t = uy(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function uy(e) {
  var t = VR(e, "string");
  return ir(t) == "symbol" ? t : t + "";
}
function VR(e, t) {
  if (ir(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ir(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var $e = 32, Al = /* @__PURE__ */ (function(e) {
  function t() {
    return WR(this, t), jR(this, t, arguments);
  }
  return YR(t, e), LR(t, [{
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
          var l = BR({}, n);
          return delete l.legendIcon, /* @__PURE__ */ E.cloneElement(n.legendIcon, l);
        }
        return /* @__PURE__ */ E.createElement(cy, {
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
      return a.map(function(g, b) {
        var m = g.formatter || c, h = pt($r($r({
          "recharts-legend-item": !0
        }, "legend-item-".concat(b), !0), "inactive", g.inactive));
        if (g.type === "none")
          return null;
        var y = An(g.value) ? null : g.value;
        Cn(
          !An(g.value),
          `The name property is also required when using a function for the dataKey of a chart's cartesian components. Ex: <Bar name="Name of my Data"/>`
          // eslint-disable-line max-len
        );
        var w = g.inactive ? l : g.color;
        return /* @__PURE__ */ E.createElement("li", Ec({
          className: h,
          style: d,
          key: "legend-item-".concat(b)
        }, X1(n.props, g, b)), /* @__PURE__ */ E.createElement(rR, {
          width: i,
          height: i,
          viewBox: u,
          style: f
        }, n.renderIcon(g)), /* @__PURE__ */ E.createElement("span", {
          className: "recharts-legend-item-text",
          style: {
            color: w
          }
        }, m ? m(y, g, b) : y));
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
})(jn);
$r(Al, "displayName", "Legend");
$r(Al, "defaultProps", {
  iconSize: 14,
  layout: "horizontal",
  align: "center",
  verticalAlign: "middle",
  inactiveColor: "#ccc"
});
var di, mf;
function GR() {
  if (mf) return di;
  mf = 1;
  var e = wo();
  function t() {
    this.__data__ = new e(), this.size = 0;
  }
  return di = t, di;
}
var fi, gf;
function UR() {
  if (gf) return fi;
  gf = 1;
  function e(t) {
    var r = this.__data__, n = r.delete(t);
    return this.size = r.size, n;
  }
  return fi = e, fi;
}
var pi, vf;
function KR() {
  if (vf) return pi;
  vf = 1;
  function e(t) {
    return this.__data__.get(t);
  }
  return pi = e, pi;
}
var hi, bf;
function XR() {
  if (bf) return hi;
  bf = 1;
  function e(t) {
    return this.__data__.has(t);
  }
  return hi = e, hi;
}
var mi, yf;
function ZR() {
  if (yf) return mi;
  yf = 1;
  var e = wo(), t = Rl(), r = kl(), n = 200;
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
  return mi = o, mi;
}
var gi, wf;
function dy() {
  if (wf) return gi;
  wf = 1;
  var e = wo(), t = GR(), r = UR(), n = KR(), o = XR(), a = ZR();
  function i(s) {
    var c = this.__data__ = new e(s);
    this.size = c.size;
  }
  return i.prototype.clear = t, i.prototype.delete = r, i.prototype.get = n, i.prototype.has = o, i.prototype.set = a, gi = i, gi;
}
var vi, xf;
function QR() {
  if (xf) return vi;
  xf = 1;
  var e = "__lodash_hash_undefined__";
  function t(r) {
    return this.__data__.set(r, e), this;
  }
  return vi = t, vi;
}
var bi, _f;
function JR() {
  if (_f) return bi;
  _f = 1;
  function e(t) {
    return this.__data__.has(t);
  }
  return bi = e, bi;
}
var yi, Sf;
function fy() {
  if (Sf) return yi;
  Sf = 1;
  var e = kl(), t = QR(), r = JR();
  function n(o) {
    var a = -1, i = o == null ? 0 : o.length;
    for (this.__data__ = new e(); ++a < i; )
      this.add(o[a]);
  }
  return n.prototype.add = n.prototype.push = t, n.prototype.has = r, yi = n, yi;
}
var wi, Cf;
function ek() {
  if (Cf) return wi;
  Cf = 1;
  function e(t, r) {
    for (var n = -1, o = t == null ? 0 : t.length; ++n < o; )
      if (r(t[n], n, t))
        return !0;
    return !1;
  }
  return wi = e, wi;
}
var xi, Of;
function py() {
  if (Of) return xi;
  Of = 1;
  function e(t, r) {
    return t.has(r);
  }
  return xi = e, xi;
}
var _i, Pf;
function hy() {
  if (Pf) return _i;
  Pf = 1;
  var e = fy(), t = ek(), r = py(), n = 1, o = 2;
  function a(i, s, c, l, u, d) {
    var f = c & n, g = i.length, b = s.length;
    if (g != b && !(f && b > g))
      return !1;
    var m = d.get(i), h = d.get(s);
    if (m && h)
      return m == s && h == i;
    var y = -1, w = !0, x = c & o ? new e() : void 0;
    for (d.set(i, s), d.set(s, i); ++y < g; ) {
      var _ = i[y], C = s[y];
      if (l)
        var S = f ? l(C, _, y, s, i, d) : l(_, C, y, i, s, d);
      if (S !== void 0) {
        if (S)
          continue;
        w = !1;
        break;
      }
      if (x) {
        if (!t(s, function(O, P) {
          if (!r(x, P) && (_ === O || u(_, O, c, l, d)))
            return x.push(P);
        })) {
          w = !1;
          break;
        }
      } else if (!(_ === C || u(_, C, c, l, d))) {
        w = !1;
        break;
      }
    }
    return d.delete(i), d.delete(s), w;
  }
  return _i = a, _i;
}
var Si, Ef;
function tk() {
  if (Ef) return Si;
  Ef = 1;
  var e = ct(), t = e.Uint8Array;
  return Si = t, Si;
}
var Ci, Mf;
function rk() {
  if (Mf) return Ci;
  Mf = 1;
  function e(t) {
    var r = -1, n = Array(t.size);
    return t.forEach(function(o, a) {
      n[++r] = [a, o];
    }), n;
  }
  return Ci = e, Ci;
}
var Oi, Tf;
function Il() {
  if (Tf) return Oi;
  Tf = 1;
  function e(t) {
    var r = -1, n = Array(t.size);
    return t.forEach(function(o) {
      n[++r] = o;
    }), n;
  }
  return Oi = e, Oi;
}
var Pi, Rf;
function nk() {
  if (Rf) return Pi;
  Rf = 1;
  var e = tn(), t = tk(), r = Tl(), n = hy(), o = rk(), a = Il(), i = 1, s = 2, c = "[object Boolean]", l = "[object Date]", u = "[object Error]", d = "[object Map]", f = "[object Number]", g = "[object RegExp]", b = "[object Set]", m = "[object String]", h = "[object Symbol]", y = "[object ArrayBuffer]", w = "[object DataView]", x = e ? e.prototype : void 0, _ = x ? x.valueOf : void 0;
  function C(S, O, P, T, A, k, q) {
    switch (P) {
      case w:
        if (S.byteLength != O.byteLength || S.byteOffset != O.byteOffset)
          return !1;
        S = S.buffer, O = O.buffer;
      case y:
        return !(S.byteLength != O.byteLength || !k(new t(S), new t(O)));
      case c:
      case l:
      case f:
        return r(+S, +O);
      case u:
        return S.name == O.name && S.message == O.message;
      case g:
      case m:
        return S == O + "";
      case d:
        var D = o;
      case b:
        var F = T & i;
        if (D || (D = a), S.size != O.size && !F)
          return !1;
        var $ = q.get(S);
        if ($)
          return $ == O;
        T |= s, q.set(S, O);
        var I = n(D(S), D(O), T, A, k, q);
        return q.delete(S), I;
      case h:
        if (_)
          return _.call(S) == _.call(O);
    }
    return !1;
  }
  return Pi = C, Pi;
}
var Ei, kf;
function my() {
  if (kf) return Ei;
  kf = 1;
  function e(t, r) {
    for (var n = -1, o = r.length, a = t.length; ++n < o; )
      t[a + n] = r[n];
    return t;
  }
  return Ei = e, Ei;
}
var Mi, Df;
function ok() {
  if (Df) return Mi;
  Df = 1;
  var e = my(), t = Ke();
  function r(n, o, a) {
    var i = o(n);
    return t(n) ? i : e(i, a(n));
  }
  return Mi = r, Mi;
}
var Ti, Nf;
function ak() {
  if (Nf) return Ti;
  Nf = 1;
  function e(t, r) {
    for (var n = -1, o = t == null ? 0 : t.length, a = 0, i = []; ++n < o; ) {
      var s = t[n];
      r(s, n, t) && (i[a++] = s);
    }
    return i;
  }
  return Ti = e, Ti;
}
var Ri, Af;
function ik() {
  if (Af) return Ri;
  Af = 1;
  function e() {
    return [];
  }
  return Ri = e, Ri;
}
var ki, If;
function sk() {
  if (If) return ki;
  If = 1;
  var e = ak(), t = ik(), r = Object.prototype, n = r.propertyIsEnumerable, o = Object.getOwnPropertySymbols, a = o ? function(i) {
    return i == null ? [] : (i = Object(i), e(o(i), function(s) {
      return n.call(i, s);
    }));
  } : t;
  return ki = a, ki;
}
var Di, Ff;
function ck() {
  if (Ff) return Di;
  Ff = 1;
  function e(t, r) {
    for (var n = -1, o = Array(t); ++n < t; )
      o[n] = r(n);
    return o;
  }
  return Di = e, Di;
}
var Ni, $f;
function lk() {
  if ($f) return Ni;
  $f = 1;
  var e = zt(), t = Ht(), r = "[object Arguments]";
  function n(o) {
    return t(o) && e(o) == r;
  }
  return Ni = n, Ni;
}
var Ai, Bf;
function Fl() {
  if (Bf) return Ai;
  Bf = 1;
  var e = lk(), t = Ht(), r = Object.prototype, n = r.hasOwnProperty, o = r.propertyIsEnumerable, a = e(/* @__PURE__ */ (function() {
    return arguments;
  })()) ? e : function(i) {
    return t(i) && n.call(i, "callee") && !o.call(i, "callee");
  };
  return Ai = a, Ai;
}
var Pr = { exports: {} }, Ii, Wf;
function uk() {
  if (Wf) return Ii;
  Wf = 1;
  function e() {
    return !1;
  }
  return Ii = e, Ii;
}
Pr.exports;
var qf;
function gy() {
  return qf || (qf = 1, (function(e, t) {
    var r = ct(), n = uk(), o = t && !t.nodeType && t, a = o && !0 && e && !e.nodeType && e, i = a && a.exports === o, s = i ? r.Buffer : void 0, c = s ? s.isBuffer : void 0, l = c || n;
    e.exports = l;
  })(Pr, Pr.exports)), Pr.exports;
}
var Fi, Lf;
function $l() {
  if (Lf) return Fi;
  Lf = 1;
  var e = 9007199254740991, t = /^(?:0|[1-9]\d*)$/;
  function r(n, o) {
    var a = typeof n;
    return o = o ?? e, !!o && (a == "number" || a != "symbol" && t.test(n)) && n > -1 && n % 1 == 0 && n < o;
  }
  return Fi = r, Fi;
}
var $i, jf;
function Bl() {
  if (jf) return $i;
  jf = 1;
  var e = 9007199254740991;
  function t(r) {
    return typeof r == "number" && r > -1 && r % 1 == 0 && r <= e;
  }
  return $i = t, $i;
}
var Bi, zf;
function dk() {
  if (zf) return Bi;
  zf = 1;
  var e = zt(), t = Bl(), r = Ht(), n = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", i = "[object Date]", s = "[object Error]", c = "[object Function]", l = "[object Map]", u = "[object Number]", d = "[object Object]", f = "[object RegExp]", g = "[object Set]", b = "[object String]", m = "[object WeakMap]", h = "[object ArrayBuffer]", y = "[object DataView]", w = "[object Float32Array]", x = "[object Float64Array]", _ = "[object Int8Array]", C = "[object Int16Array]", S = "[object Int32Array]", O = "[object Uint8Array]", P = "[object Uint8ClampedArray]", T = "[object Uint16Array]", A = "[object Uint32Array]", k = {};
  k[w] = k[x] = k[_] = k[C] = k[S] = k[O] = k[P] = k[T] = k[A] = !0, k[n] = k[o] = k[h] = k[a] = k[y] = k[i] = k[s] = k[c] = k[l] = k[u] = k[d] = k[f] = k[g] = k[b] = k[m] = !1;
  function q(D) {
    return r(D) && t(D.length) && !!k[e(D)];
  }
  return Bi = q, Bi;
}
var Wi, Hf;
function vy() {
  if (Hf) return Wi;
  Hf = 1;
  function e(t) {
    return function(r) {
      return t(r);
    };
  }
  return Wi = e, Wi;
}
var Er = { exports: {} };
Er.exports;
var Yf;
function fk() {
  return Yf || (Yf = 1, (function(e, t) {
    var r = Hb(), n = t && !t.nodeType && t, o = n && !0 && e && !e.nodeType && e, a = o && o.exports === n, i = a && r.process, s = (function() {
      try {
        var c = o && o.require && o.require("util").types;
        return c || i && i.binding && i.binding("util");
      } catch {
      }
    })();
    e.exports = s;
  })(Er, Er.exports)), Er.exports;
}
var qi, Vf;
function by() {
  if (Vf) return qi;
  Vf = 1;
  var e = dk(), t = vy(), r = fk(), n = r && r.isTypedArray, o = n ? t(n) : e;
  return qi = o, qi;
}
var Li, Gf;
function pk() {
  if (Gf) return Li;
  Gf = 1;
  var e = ck(), t = Fl(), r = Ke(), n = gy(), o = $l(), a = by(), i = Object.prototype, s = i.hasOwnProperty;
  function c(l, u) {
    var d = r(l), f = !d && t(l), g = !d && !f && n(l), b = !d && !f && !g && a(l), m = d || f || g || b, h = m ? e(l.length, String) : [], y = h.length;
    for (var w in l)
      (u || s.call(l, w)) && !(m && // Safari 9 has enumerable `arguments.length` in strict mode.
      (w == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      g && (w == "offset" || w == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      b && (w == "buffer" || w == "byteLength" || w == "byteOffset") || // Skip index properties.
      o(w, y))) && h.push(w);
    return h;
  }
  return Li = c, Li;
}
var ji, Uf;
function hk() {
  if (Uf) return ji;
  Uf = 1;
  var e = Object.prototype;
  function t(r) {
    var n = r && r.constructor, o = typeof n == "function" && n.prototype || e;
    return r === o;
  }
  return ji = t, ji;
}
var zi, Kf;
function mk() {
  if (Kf) return zi;
  Kf = 1;
  function e(t, r) {
    return function(n) {
      return t(r(n));
    };
  }
  return zi = e, zi;
}
var Hi, Xf;
function gk() {
  if (Xf) return Hi;
  Xf = 1;
  var e = mk(), t = e(Object.keys, Object);
  return Hi = t, Hi;
}
var Yi, Zf;
function vk() {
  if (Zf) return Yi;
  Zf = 1;
  var e = hk(), t = gk(), r = Object.prototype, n = r.hasOwnProperty;
  function o(a) {
    if (!e(a))
      return t(a);
    var i = [];
    for (var s in Object(a))
      n.call(a, s) && s != "constructor" && i.push(s);
    return i;
  }
  return Yi = o, Yi;
}
var Vi, Qf;
function Co() {
  if (Qf) return Vi;
  Qf = 1;
  var e = Ml(), t = Bl();
  function r(n) {
    return n != null && t(n.length) && !e(n);
  }
  return Vi = r, Vi;
}
var Gi, Jf;
function Wl() {
  if (Jf) return Gi;
  Jf = 1;
  var e = pk(), t = vk(), r = Co();
  function n(o) {
    return r(o) ? e(o) : t(o);
  }
  return Gi = n, Gi;
}
var Ui, ep;
function bk() {
  if (ep) return Ui;
  ep = 1;
  var e = ok(), t = sk(), r = Wl();
  function n(o) {
    return e(o, r, t);
  }
  return Ui = n, Ui;
}
var Ki, tp;
function yk() {
  if (tp) return Ki;
  tp = 1;
  var e = bk(), t = 1, r = Object.prototype, n = r.hasOwnProperty;
  function o(a, i, s, c, l, u) {
    var d = s & t, f = e(a), g = f.length, b = e(i), m = b.length;
    if (g != m && !d)
      return !1;
    for (var h = g; h--; ) {
      var y = f[h];
      if (!(d ? y in i : n.call(i, y)))
        return !1;
    }
    var w = u.get(a), x = u.get(i);
    if (w && x)
      return w == i && x == a;
    var _ = !0;
    u.set(a, i), u.set(i, a);
    for (var C = d; ++h < g; ) {
      y = f[h];
      var S = a[y], O = i[y];
      if (c)
        var P = d ? c(O, S, y, i, a, u) : c(S, O, y, a, i, u);
      if (!(P === void 0 ? S === O || l(S, O, s, c, u) : P)) {
        _ = !1;
        break;
      }
      C || (C = y == "constructor");
    }
    if (_ && !C) {
      var T = a.constructor, A = i.constructor;
      T != A && "constructor" in a && "constructor" in i && !(typeof T == "function" && T instanceof T && typeof A == "function" && A instanceof A) && (_ = !1);
    }
    return u.delete(a), u.delete(i), _;
  }
  return Ki = o, Ki;
}
var Xi, rp;
function wk() {
  if (rp) return Xi;
  rp = 1;
  var e = Yt(), t = ct(), r = e(t, "DataView");
  return Xi = r, Xi;
}
var Zi, np;
function xk() {
  if (np) return Zi;
  np = 1;
  var e = Yt(), t = ct(), r = e(t, "Promise");
  return Zi = r, Zi;
}
var Qi, op;
function yy() {
  if (op) return Qi;
  op = 1;
  var e = Yt(), t = ct(), r = e(t, "Set");
  return Qi = r, Qi;
}
var Ji, ap;
function _k() {
  if (ap) return Ji;
  ap = 1;
  var e = Yt(), t = ct(), r = e(t, "WeakMap");
  return Ji = r, Ji;
}
var es, ip;
function Sk() {
  if (ip) return es;
  ip = 1;
  var e = wk(), t = Rl(), r = xk(), n = yy(), o = _k(), a = zt(), i = Yb(), s = "[object Map]", c = "[object Object]", l = "[object Promise]", u = "[object Set]", d = "[object WeakMap]", f = "[object DataView]", g = i(e), b = i(t), m = i(r), h = i(n), y = i(o), w = a;
  return (e && w(new e(new ArrayBuffer(1))) != f || t && w(new t()) != s || r && w(r.resolve()) != l || n && w(new n()) != u || o && w(new o()) != d) && (w = function(x) {
    var _ = a(x), C = _ == c ? x.constructor : void 0, S = C ? i(C) : "";
    if (S)
      switch (S) {
        case g:
          return f;
        case b:
          return s;
        case m:
          return l;
        case h:
          return u;
        case y:
          return d;
      }
    return _;
  }), es = w, es;
}
var ts, sp;
function Ck() {
  if (sp) return ts;
  sp = 1;
  var e = dy(), t = hy(), r = nk(), n = yk(), o = Sk(), a = Ke(), i = gy(), s = by(), c = 1, l = "[object Arguments]", u = "[object Array]", d = "[object Object]", f = Object.prototype, g = f.hasOwnProperty;
  function b(m, h, y, w, x, _) {
    var C = a(m), S = a(h), O = C ? u : o(m), P = S ? u : o(h);
    O = O == l ? d : O, P = P == l ? d : P;
    var T = O == d, A = P == d, k = O == P;
    if (k && i(m)) {
      if (!i(h))
        return !1;
      C = !0, T = !1;
    }
    if (k && !T)
      return _ || (_ = new e()), C || s(m) ? t(m, h, y, w, x, _) : r(m, h, O, y, w, x, _);
    if (!(y & c)) {
      var q = T && g.call(m, "__wrapped__"), D = A && g.call(h, "__wrapped__");
      if (q || D) {
        var F = q ? m.value() : m, $ = D ? h.value() : h;
        return _ || (_ = new e()), x(F, $, y, w, _);
      }
    }
    return k ? (_ || (_ = new e()), n(m, h, y, w, x, _)) : !1;
  }
  return ts = b, ts;
}
var rs, cp;
function wy() {
  if (cp) return rs;
  cp = 1;
  var e = Ck(), t = Ht();
  function r(n, o, a, i, s) {
    return n === o ? !0 : n == null || o == null || !t(n) && !t(o) ? n !== n && o !== o : e(n, o, a, i, r, s);
  }
  return rs = r, rs;
}
var ns, lp;
function Ok() {
  if (lp) return ns;
  lp = 1;
  var e = dy(), t = wy(), r = 1, n = 2;
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
      var g = f[0], b = a[g], m = f[1];
      if (d && f[2]) {
        if (b === void 0 && !(g in a))
          return !1;
      } else {
        var h = new e();
        if (c)
          var y = c(b, m, g, a, i, h);
        if (!(y === void 0 ? t(m, b, r | n, c, h) : y))
          return !1;
      }
    }
    return !0;
  }
  return ns = o, ns;
}
var os, up;
function xy() {
  if (up) return os;
  up = 1;
  var e = Rt();
  function t(r) {
    return r === r && !e(r);
  }
  return os = t, os;
}
var as, dp;
function Pk() {
  if (dp) return as;
  dp = 1;
  var e = xy(), t = Wl();
  function r(n) {
    for (var o = t(n), a = o.length; a--; ) {
      var i = o[a], s = n[i];
      o[a] = [i, s, e(s)];
    }
    return o;
  }
  return as = r, as;
}
var is, fp;
function _y() {
  if (fp) return is;
  fp = 1;
  function e(t, r) {
    return function(n) {
      return n == null ? !1 : n[t] === r && (r !== void 0 || t in Object(n));
    };
  }
  return is = e, is;
}
var ss, pp;
function Ek() {
  if (pp) return ss;
  pp = 1;
  var e = Ok(), t = Pk(), r = _y();
  function n(o) {
    var a = t(o);
    return a.length == 1 && a[0][2] ? r(a[0][0], a[0][1]) : function(i) {
      return i === o || e(i, o, a);
    };
  }
  return ss = n, ss;
}
var cs, hp;
function Mk() {
  if (hp) return cs;
  hp = 1;
  function e(t, r) {
    return t != null && r in Object(t);
  }
  return cs = e, cs;
}
var ls, mp;
function Tk() {
  if (mp) return ls;
  mp = 1;
  var e = Ub(), t = Fl(), r = Ke(), n = $l(), o = Bl(), a = _o();
  function i(s, c, l) {
    c = e(c, s);
    for (var u = -1, d = c.length, f = !1; ++u < d; ) {
      var g = a(c[u]);
      if (!(f = s != null && l(s, g)))
        break;
      s = s[g];
    }
    return f || ++u != d ? f : (d = s == null ? 0 : s.length, !!d && o(d) && n(g, d) && (r(s) || t(s)));
  }
  return ls = i, ls;
}
var us, gp;
function Rk() {
  if (gp) return us;
  gp = 1;
  var e = Mk(), t = Tk();
  function r(n, o) {
    return n != null && t(n, o, e);
  }
  return us = r, us;
}
var ds, vp;
function kk() {
  if (vp) return ds;
  vp = 1;
  var e = wy(), t = Kb(), r = Rk(), n = El(), o = xy(), a = _y(), i = _o(), s = 1, c = 2;
  function l(u, d) {
    return n(u) && o(d) ? a(i(u), d) : function(f) {
      var g = t(f, u);
      return g === void 0 && g === d ? r(f, u) : e(d, g, s | c);
    };
  }
  return ds = l, ds;
}
var fs, bp;
function Oo() {
  if (bp) return fs;
  bp = 1;
  function e(t) {
    return t;
  }
  return fs = e, fs;
}
var ps, yp;
function Dk() {
  if (yp) return ps;
  yp = 1;
  function e(t) {
    return function(r) {
      return r == null ? void 0 : r[t];
    };
  }
  return ps = e, ps;
}
var hs, wp;
function Nk() {
  if (wp) return hs;
  wp = 1;
  var e = Dl();
  function t(r) {
    return function(n) {
      return e(n, r);
    };
  }
  return hs = t, hs;
}
var ms, xp;
function Ak() {
  if (xp) return ms;
  xp = 1;
  var e = Dk(), t = Nk(), r = El(), n = _o();
  function o(a) {
    return r(a) ? e(n(a)) : t(a);
  }
  return ms = o, ms;
}
var gs, _p;
function Sy() {
  if (_p) return gs;
  _p = 1;
  var e = Ek(), t = kk(), r = Oo(), n = Ke(), o = Ak();
  function a(i) {
    return typeof i == "function" ? i : i == null ? r : typeof i == "object" ? n(i) ? t(i[0], i[1]) : e(i) : o(i);
  }
  return gs = a, gs;
}
var vs, Sp;
function Ik() {
  if (Sp) return vs;
  Sp = 1;
  function e(t, r, n, o) {
    for (var a = t.length, i = n + (o ? 1 : -1); o ? i-- : ++i < a; )
      if (r(t[i], i, t))
        return i;
    return -1;
  }
  return vs = e, vs;
}
var bs, Cp;
function Fk() {
  if (Cp) return bs;
  Cp = 1;
  function e(t) {
    return t !== t;
  }
  return bs = e, bs;
}
var ys, Op;
function $k() {
  if (Op) return ys;
  Op = 1;
  function e(t, r, n) {
    for (var o = n - 1, a = t.length; ++o < a; )
      if (t[o] === r)
        return o;
    return -1;
  }
  return ys = e, ys;
}
var ws, Pp;
function Bk() {
  if (Pp) return ws;
  Pp = 1;
  var e = Ik(), t = Fk(), r = $k();
  function n(o, a, i) {
    return a === a ? r(o, a, i) : e(o, t, i);
  }
  return ws = n, ws;
}
var xs, Ep;
function Wk() {
  if (Ep) return xs;
  Ep = 1;
  var e = Bk();
  function t(r, n) {
    var o = r == null ? 0 : r.length;
    return !!o && e(r, n, 0) > -1;
  }
  return xs = t, xs;
}
var _s, Mp;
function qk() {
  if (Mp) return _s;
  Mp = 1;
  function e(t, r, n) {
    for (var o = -1, a = t == null ? 0 : t.length; ++o < a; )
      if (n(r, t[o]))
        return !0;
    return !1;
  }
  return _s = e, _s;
}
var Ss, Tp;
function Lk() {
  if (Tp) return Ss;
  Tp = 1;
  function e() {
  }
  return Ss = e, Ss;
}
var Cs, Rp;
function jk() {
  if (Rp) return Cs;
  Rp = 1;
  var e = yy(), t = Lk(), r = Il(), n = 1 / 0, o = e && 1 / r(new e([, -0]))[1] == n ? function(a) {
    return new e(a);
  } : t;
  return Cs = o, Cs;
}
var Os, kp;
function zk() {
  if (kp) return Os;
  kp = 1;
  var e = fy(), t = Wk(), r = qk(), n = py(), o = jk(), a = Il(), i = 200;
  function s(c, l, u) {
    var d = -1, f = t, g = c.length, b = !0, m = [], h = m;
    if (u)
      b = !1, f = r;
    else if (g >= i) {
      var y = l ? null : o(c);
      if (y)
        return a(y);
      b = !1, f = n, h = new e();
    } else
      h = l ? [] : m;
    e:
      for (; ++d < g; ) {
        var w = c[d], x = l ? l(w) : w;
        if (w = u || w !== 0 ? w : 0, b && x === x) {
          for (var _ = h.length; _--; )
            if (h[_] === x)
              continue e;
          l && h.push(x), m.push(w);
        } else f(h, x, u) || (h !== m && h.push(x), m.push(w));
      }
    return m;
  }
  return Os = s, Os;
}
var Ps, Dp;
function Hk() {
  if (Dp) return Ps;
  Dp = 1;
  var e = Sy(), t = zk();
  function r(n, o) {
    return n && n.length ? t(n, e(o, 2)) : [];
  }
  return Ps = r, Ps;
}
var Yk = Hk();
const Np = /* @__PURE__ */ at(Yk);
function Cy(e, t, r) {
  return t === !0 ? Np(e, r) : An(t) ? Np(e, t) : e;
}
function sr(e) {
  "@babel/helpers - typeof";
  return sr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, sr(e);
}
var Vk = ["ref"];
function Ap(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ut(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ap(Object(r), !0).forEach(function(n) {
      Po(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ap(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Gk(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Ip(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, Py(n.key), n);
  }
}
function Uk(e, t, r) {
  return t && Ip(e.prototype, t), r && Ip(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Kk(e, t, r) {
  return t = Wn(t), Xk(e, Oy() ? Reflect.construct(t, r || [], Wn(e).constructor) : t.apply(e, r));
}
function Xk(e, t) {
  if (t && (sr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return Zk(e);
}
function Zk(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Oy() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (Oy = function() {
    return !!e;
  })();
}
function Wn(e) {
  return Wn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Wn(e);
}
function Qk(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Tc(e, t);
}
function Tc(e, t) {
  return Tc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, Tc(e, t);
}
function Po(e, t, r) {
  return t = Py(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Py(e) {
  var t = Jk(e, "string");
  return sr(t) == "symbol" ? t : t + "";
}
function Jk(e, t) {
  if (sr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (sr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function eD(e, t) {
  if (e == null) return {};
  var r = tD(e, t), n, o;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (o = 0; o < a.length; o++)
      n = a[o], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function tD(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function rD(e) {
  return e.value;
}
function nD(e, t) {
  if (/* @__PURE__ */ E.isValidElement(e))
    return /* @__PURE__ */ E.cloneElement(e, t);
  if (typeof e == "function")
    return /* @__PURE__ */ E.createElement(e, t);
  t.ref;
  var r = eD(t, Vk);
  return /* @__PURE__ */ E.createElement(Al, r);
}
var Fp = 1, ql = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    Gk(this, t);
    for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++)
      o[a] = arguments[a];
    return r = Kk(this, t, [].concat(o)), Po(r, "lastBoundingBox", {
      width: -1,
      height: -1
    }), r;
  }
  return Qk(t, e), Uk(t, [{
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
      o ? (Math.abs(o.width - this.lastBoundingBox.width) > Fp || Math.abs(o.height - this.lastBoundingBox.height) > Fp) && (this.lastBoundingBox.width = o.width, this.lastBoundingBox.height = o.height, n && n(o)) : (this.lastBoundingBox.width !== -1 || this.lastBoundingBox.height !== -1) && (this.lastBoundingBox.width = -1, this.lastBoundingBox.height = -1, n && n(null));
    }
  }, {
    key: "getBBoxSnapshot",
    value: function() {
      return this.lastBoundingBox.width >= 0 && this.lastBoundingBox.height >= 0 ? ut({}, this.lastBoundingBox) : {
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
          var g = this.getBBoxSnapshot();
          d = {
            left: ((l || 0) - g.width) / 2
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
      return ut(ut({}, d), f);
    }
  }, {
    key: "render",
    value: function() {
      var n = this, o = this.props, a = o.content, i = o.width, s = o.height, c = o.wrapperStyle, l = o.payloadUniqBy, u = o.payload, d = ut(ut({
        position: "absolute",
        width: i || "auto",
        height: s || "auto"
      }, this.getDefaultPosition(c)), c);
      return /* @__PURE__ */ E.createElement("div", {
        className: "recharts-legend-wrapper",
        style: d,
        ref: function(g) {
          n.wrapperNode = g;
        }
      }, nD(a, ut(ut({}, this.props), {}, {
        payload: Cy(u, l, rD)
      })));
    }
  }], [{
    key: "getWithHeight",
    value: function(n, o) {
      var a = ut(ut({}, this.defaultProps), n.props), i = a.layout;
      return i === "vertical" && He(n.props.height) ? {
        height: n.props.height
      } : i === "horizontal" ? {
        width: n.props.width || o
      } : null;
    }
  }]);
})(jn);
Po(ql, "displayName", "Legend");
Po(ql, "defaultProps", {
  iconSize: 14,
  layout: "horizontal",
  align: "center",
  verticalAlign: "bottom"
});
var Es, $p;
function oD() {
  if ($p) return Es;
  $p = 1;
  var e = tn(), t = Fl(), r = Ke(), n = e ? e.isConcatSpreadable : void 0;
  function o(a) {
    return r(a) || t(a) || !!(n && a && a[n]);
  }
  return Es = o, Es;
}
var Ms, Bp;
function aD() {
  if (Bp) return Ms;
  Bp = 1;
  var e = my(), t = oD();
  function r(n, o, a, i, s) {
    var c = -1, l = n.length;
    for (a || (a = t), s || (s = []); ++c < l; ) {
      var u = n[c];
      o > 0 && a(u) ? o > 1 ? r(u, o - 1, a, i, s) : e(s, u) : i || (s[s.length] = u);
    }
    return s;
  }
  return Ms = r, Ms;
}
var Ts, Wp;
function iD() {
  if (Wp) return Ts;
  Wp = 1;
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
  return Ts = e, Ts;
}
var Rs, qp;
function sD() {
  if (qp) return Rs;
  qp = 1;
  var e = iD(), t = e();
  return Rs = t, Rs;
}
var ks, Lp;
function cD() {
  if (Lp) return ks;
  Lp = 1;
  var e = sD(), t = Wl();
  function r(n, o) {
    return n && e(n, o, t);
  }
  return ks = r, ks;
}
var Ds, jp;
function lD() {
  if (jp) return Ds;
  jp = 1;
  var e = Co();
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
  return Ds = t, Ds;
}
var Ns, zp;
function uD() {
  if (zp) return Ns;
  zp = 1;
  var e = cD(), t = lD(), r = t(e);
  return Ns = r, Ns;
}
var As, Hp;
function dD() {
  if (Hp) return As;
  Hp = 1;
  var e = uD(), t = Co();
  function r(n, o) {
    var a = -1, i = t(n) ? Array(n.length) : [];
    return e(n, function(s, c, l) {
      i[++a] = o(s, c, l);
    }), i;
  }
  return As = r, As;
}
var Is, Yp;
function fD() {
  if (Yp) return Is;
  Yp = 1;
  function e(t, r) {
    var n = t.length;
    for (t.sort(r); n--; )
      t[n] = t[n].value;
    return t;
  }
  return Is = e, Is;
}
var Fs, Vp;
function pD() {
  if (Vp) return Fs;
  Vp = 1;
  var e = rn();
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
  return Fs = t, Fs;
}
var $s, Gp;
function hD() {
  if (Gp) return $s;
  Gp = 1;
  var e = pD();
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
  return $s = t, $s;
}
var Bs, Up;
function mD() {
  if (Up) return Bs;
  Up = 1;
  var e = Vb(), t = Dl(), r = Sy(), n = dD(), o = fD(), a = vy(), i = hD(), s = Oo(), c = Ke();
  function l(u, d, f) {
    d.length ? d = e(d, function(m) {
      return c(m) ? function(h) {
        return t(h, m.length === 1 ? m[0] : m);
      } : m;
    }) : d = [s];
    var g = -1;
    d = e(d, a(r));
    var b = n(u, function(m, h, y) {
      var w = e(d, function(x) {
        return x(m);
      });
      return { criteria: w, index: ++g, value: m };
    });
    return o(b, function(m, h) {
      return i(m, h, f);
    });
  }
  return Bs = l, Bs;
}
var Ws, Kp;
function gD() {
  if (Kp) return Ws;
  Kp = 1;
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
  return Ws = e, Ws;
}
var qs, Xp;
function vD() {
  if (Xp) return qs;
  Xp = 1;
  var e = gD(), t = Math.max;
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
  return qs = r, qs;
}
var Ls, Zp;
function bD() {
  if (Zp) return Ls;
  Zp = 1;
  function e(t) {
    return function() {
      return t;
    };
  }
  return Ls = e, Ls;
}
var js, Qp;
function yD() {
  if (Qp) return js;
  Qp = 1;
  var e = Yt(), t = (function() {
    try {
      var r = e(Object, "defineProperty");
      return r({}, "", {}), r;
    } catch {
    }
  })();
  return js = t, js;
}
var zs, Jp;
function wD() {
  if (Jp) return zs;
  Jp = 1;
  var e = bD(), t = yD(), r = Oo(), n = t ? function(o, a) {
    return t(o, "toString", {
      configurable: !0,
      enumerable: !1,
      value: e(a),
      writable: !0
    });
  } : r;
  return zs = n, zs;
}
var Hs, eh;
function xD() {
  if (eh) return Hs;
  eh = 1;
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
  return Hs = n, Hs;
}
var Ys, th;
function _D() {
  if (th) return Ys;
  th = 1;
  var e = wD(), t = xD(), r = t(e);
  return Ys = r, Ys;
}
var Vs, rh;
function SD() {
  if (rh) return Vs;
  rh = 1;
  var e = Oo(), t = vD(), r = _D();
  function n(o, a) {
    return r(t(o, a, e), o + "");
  }
  return Vs = n, Vs;
}
var Gs, nh;
function CD() {
  if (nh) return Gs;
  nh = 1;
  var e = Tl(), t = Co(), r = $l(), n = Rt();
  function o(a, i, s) {
    if (!n(s))
      return !1;
    var c = typeof i;
    return (c == "number" ? t(s) && r(i, s.length) : c == "string" && i in s) ? e(s[i], a) : !1;
  }
  return Gs = o, Gs;
}
var Us, oh;
function OD() {
  if (oh) return Us;
  oh = 1;
  var e = aD(), t = mD(), r = SD(), n = CD(), o = r(function(a, i) {
    if (a == null)
      return [];
    var s = i.length;
    return s > 1 && n(a, i[0], i[1]) ? i = [] : s > 2 && n(i[0], i[1], i[2]) && (i = [i[0]]), t(a, e(i, 1), []);
  });
  return Us = o, Us;
}
var PD = OD();
const ED = /* @__PURE__ */ at(PD);
function Br(e) {
  "@babel/helpers - typeof";
  return Br = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Br(e);
}
function Rc() {
  return Rc = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Rc.apply(this, arguments);
}
function MD(e, t) {
  return DD(e) || kD(e, t) || RD(e, t) || TD();
}
function TD() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function RD(e, t) {
  if (e) {
    if (typeof e == "string") return ah(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return ah(e, t);
  }
}
function ah(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function kD(e, t) {
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
function DD(e) {
  if (Array.isArray(e)) return e;
}
function ih(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ks(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ih(Object(r), !0).forEach(function(n) {
      ND(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ih(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function ND(e, t, r) {
  return t = AD(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function AD(e) {
  var t = ID(e, "string");
  return Br(t) == "symbol" ? t : t + "";
}
function ID(e, t) {
  if (Br(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Br(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function FD(e) {
  return Array.isArray(e) && In(e[0]) && In(e[1]) ? e.join(" ~ ") : e;
}
var $D = function(t) {
  var r = t.separator, n = r === void 0 ? " : " : r, o = t.contentStyle, a = o === void 0 ? {} : o, i = t.itemStyle, s = i === void 0 ? {} : i, c = t.labelStyle, l = c === void 0 ? {} : c, u = t.payload, d = t.formatter, f = t.itemSorter, g = t.wrapperClassName, b = t.labelClassName, m = t.label, h = t.labelFormatter, y = t.accessibilityLayer, w = y === void 0 ? !1 : y, x = function() {
    if (u && u.length) {
      var q = {
        padding: 0,
        margin: 0
      }, D = (f ? ED(u, f) : u).map(function(F, $) {
        if (F.type === "none")
          return null;
        var I = Ks({
          display: "block",
          paddingTop: 4,
          paddingBottom: 4,
          color: F.color || "#000"
        }, s), Y = F.formatter || d || FD, B = F.value, N = F.name, R = B, X = N;
        if (Y && R != null && X != null) {
          var le = Y(B, N, F, $, u);
          if (Array.isArray(le)) {
            var me = MD(le, 2);
            R = me[0], X = me[1];
          } else
            R = le;
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          /* @__PURE__ */ E.createElement("li", {
            className: "recharts-tooltip-item",
            key: "tooltip-item-".concat($),
            style: I
          }, In(X) ? /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-name"
          }, X) : null, In(X) ? /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-separator"
          }, n) : null, /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-value"
          }, R), /* @__PURE__ */ E.createElement("span", {
            className: "recharts-tooltip-item-unit"
          }, F.unit || ""))
        );
      });
      return /* @__PURE__ */ E.createElement("ul", {
        className: "recharts-tooltip-item-list",
        style: q
      }, D);
    }
    return null;
  }, _ = Ks({
    margin: 0,
    padding: 10,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    whiteSpace: "nowrap"
  }, a), C = Ks({
    margin: 0
  }, l), S = !A1(m), O = S ? m : "", P = pt("recharts-default-tooltip", g), T = pt("recharts-tooltip-label", b);
  S && h && u !== void 0 && u !== null && (O = h(m, u));
  var A = w ? {
    role: "status",
    "aria-live": "assertive"
  } : {};
  return /* @__PURE__ */ E.createElement("div", Rc({
    className: P,
    style: _
  }, A), /* @__PURE__ */ E.createElement("p", {
    className: T,
    style: C
  }, /* @__PURE__ */ E.isValidElement(O) ? O : "".concat(O)), x());
};
function Wr(e) {
  "@babel/helpers - typeof";
  return Wr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Wr(e);
}
function bn(e, t, r) {
  return t = BD(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function BD(e) {
  var t = WD(e, "string");
  return Wr(t) == "symbol" ? t : t + "";
}
function WD(e, t) {
  if (Wr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Wr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var wr = "recharts-tooltip-wrapper", qD = {
  visibility: "hidden"
};
function LD(e) {
  var t = e.coordinate, r = e.translateX, n = e.translateY;
  return pt(wr, bn(bn(bn(bn({}, "".concat(wr, "-right"), He(r) && t && He(t.x) && r >= t.x), "".concat(wr, "-left"), He(r) && t && He(t.x) && r < t.x), "".concat(wr, "-bottom"), He(n) && t && He(t.y) && n >= t.y), "".concat(wr, "-top"), He(n) && t && He(t.y) && n < t.y));
}
function sh(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.key, o = e.offsetTopLeft, a = e.position, i = e.reverseDirection, s = e.tooltipDimension, c = e.viewBox, l = e.viewBoxDimension;
  if (a && He(a[n]))
    return a[n];
  var u = r[n] - s - o, d = r[n] + o;
  if (t[n])
    return i[n] ? u : d;
  if (i[n]) {
    var f = u, g = c[n];
    return f < g ? Math.max(d, c[n]) : Math.max(u, c[n]);
  }
  var b = d + s, m = c[n] + l;
  return b > m ? Math.max(u, c[n]) : Math.max(d, c[n]);
}
function jD(e) {
  var t = e.translateX, r = e.translateY, n = e.useTranslate3d;
  return {
    transform: n ? "translate3d(".concat(t, "px, ").concat(r, "px, 0)") : "translate(".concat(t, "px, ").concat(r, "px)")
  };
}
function zD(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.offsetTopLeft, o = e.position, a = e.reverseDirection, i = e.tooltipBox, s = e.useTranslate3d, c = e.viewBox, l, u, d;
  return i.height > 0 && i.width > 0 && r ? (u = sh({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "x",
    offsetTopLeft: n,
    position: o,
    reverseDirection: a,
    tooltipDimension: i.width,
    viewBox: c,
    viewBoxDimension: c.width
  }), d = sh({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "y",
    offsetTopLeft: n,
    position: o,
    reverseDirection: a,
    tooltipDimension: i.height,
    viewBox: c,
    viewBoxDimension: c.height
  }), l = jD({
    translateX: u,
    translateY: d,
    useTranslate3d: s
  })) : l = qD, {
    cssProperties: l,
    cssClasses: LD({
      translateX: u,
      translateY: d,
      coordinate: r
    })
  };
}
function cr(e) {
  "@babel/helpers - typeof";
  return cr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, cr(e);
}
function ch(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function lh(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ch(Object(r), !0).forEach(function(n) {
      Dc(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ch(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function HD(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function YD(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, My(n.key), n);
  }
}
function VD(e, t, r) {
  return t && YD(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function GD(e, t, r) {
  return t = qn(t), UD(e, Ey() ? Reflect.construct(t, r || [], qn(e).constructor) : t.apply(e, r));
}
function UD(e, t) {
  if (t && (cr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return KD(e);
}
function KD(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Ey() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (Ey = function() {
    return !!e;
  })();
}
function qn(e) {
  return qn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, qn(e);
}
function XD(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && kc(e, t);
}
function kc(e, t) {
  return kc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, kc(e, t);
}
function Dc(e, t, r) {
  return t = My(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function My(e) {
  var t = ZD(e, "string");
  return cr(t) == "symbol" ? t : t + "";
}
function ZD(e, t) {
  if (cr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (cr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var uh = 1, QD = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    HD(this, t);
    for (var n = arguments.length, o = new Array(n), a = 0; a < n; a++)
      o[a] = arguments[a];
    return r = GD(this, t, [].concat(o)), Dc(r, "state", {
      dismissed: !1,
      dismissedAtCoordinate: {
        x: 0,
        y: 0
      },
      lastBoundingBox: {
        width: -1,
        height: -1
      }
    }), Dc(r, "handleKeyDown", function(i) {
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
  return XD(t, e), VD(t, [{
    key: "updateBBox",
    value: function() {
      if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
        var n = this.wrapperNode.getBoundingClientRect();
        (Math.abs(n.width - this.state.lastBoundingBox.width) > uh || Math.abs(n.height - this.state.lastBoundingBox.height) > uh) && this.setState({
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
      var n = this, o = this.props, a = o.active, i = o.allowEscapeViewBox, s = o.animationDuration, c = o.animationEasing, l = o.children, u = o.coordinate, d = o.hasPayload, f = o.isAnimationActive, g = o.offset, b = o.position, m = o.reverseDirection, h = o.useTranslate3d, y = o.viewBox, w = o.wrapperStyle, x = zD({
        allowEscapeViewBox: i,
        coordinate: u,
        offsetTopLeft: g,
        position: b,
        reverseDirection: m,
        tooltipBox: this.state.lastBoundingBox,
        useTranslate3d: h,
        viewBox: y
      }), _ = x.cssClasses, C = x.cssProperties, S = lh(lh({
        transition: f && a ? "transform ".concat(s, "ms ").concat(c) : void 0
      }, C), {}, {
        pointerEvents: "none",
        visibility: !this.state.dismissed && a && d ? "visible" : "hidden",
        position: "absolute",
        top: 0,
        left: 0
      }, w);
      return (
        // This element allow listening to the `Escape` key.
        // See https://github.com/recharts/recharts/pull/2925
        /* @__PURE__ */ E.createElement("div", {
          tabIndex: -1,
          className: _,
          style: S,
          ref: function(P) {
            n.wrapperNode = P;
          }
        }, l)
      );
    }
  }]);
})(jn), JD = function() {
  return !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout);
}, eN = {
  isSsr: JD()
};
function lr(e) {
  "@babel/helpers - typeof";
  return lr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, lr(e);
}
function dh(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function fh(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? dh(Object(r), !0).forEach(function(n) {
      Ll(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : dh(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function tN(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function rN(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, Ry(n.key), n);
  }
}
function nN(e, t, r) {
  return t && rN(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function oN(e, t, r) {
  return t = Ln(t), aN(e, Ty() ? Reflect.construct(t, r || [], Ln(e).constructor) : t.apply(e, r));
}
function aN(e, t) {
  if (t && (lr(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return iN(e);
}
function iN(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Ty() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (Ty = function() {
    return !!e;
  })();
}
function Ln(e) {
  return Ln = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Ln(e);
}
function sN(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Nc(e, t);
}
function Nc(e, t) {
  return Nc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, o) {
    return n.__proto__ = o, n;
  }, Nc(e, t);
}
function Ll(e, t, r) {
  return t = Ry(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Ry(e) {
  var t = cN(e, "string");
  return lr(t) == "symbol" ? t : t + "";
}
function cN(e, t) {
  if (lr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (lr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function lN(e) {
  return e.dataKey;
}
function uN(e, t) {
  return /* @__PURE__ */ E.isValidElement(e) ? /* @__PURE__ */ E.cloneElement(e, t) : typeof e == "function" ? /* @__PURE__ */ E.createElement(e, t) : /* @__PURE__ */ E.createElement($D, t);
}
var jl = /* @__PURE__ */ (function(e) {
  function t() {
    return tN(this, t), oN(this, t, arguments);
  }
  return sN(t, e), nN(t, [{
    key: "render",
    value: function() {
      var n = this, o = this.props, a = o.active, i = o.allowEscapeViewBox, s = o.animationDuration, c = o.animationEasing, l = o.content, u = o.coordinate, d = o.filterNull, f = o.isAnimationActive, g = o.offset, b = o.payload, m = o.payloadUniqBy, h = o.position, y = o.reverseDirection, w = o.useTranslate3d, x = o.viewBox, _ = o.wrapperStyle, C = b ?? [];
      d && C.length && (C = Cy(b.filter(function(O) {
        return O.value != null && (O.hide !== !0 || n.props.includeHidden);
      }), m, lN));
      var S = C.length > 0;
      return /* @__PURE__ */ E.createElement(QD, {
        allowEscapeViewBox: i,
        animationDuration: s,
        animationEasing: c,
        isAnimationActive: f,
        active: a,
        coordinate: u,
        hasPayload: S,
        offset: g,
        position: h,
        reverseDirection: y,
        useTranslate3d: w,
        viewBox: x,
        wrapperStyle: _
      }, uN(l, fh(fh({}, this.props), {}, {
        payload: C
      })));
    }
  }]);
})(jn);
Ll(jl, "displayName", "Tooltip");
Ll(jl, "defaultProps", {
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
  isAnimationActive: !eN.isSsr,
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
var Xs, ph;
function dN() {
  if (ph) return Xs;
  ph = 1;
  var e = ct(), t = function() {
    return e.Date.now();
  };
  return Xs = t, Xs;
}
var Zs, hh;
function fN() {
  if (hh) return Zs;
  hh = 1;
  var e = /\s/;
  function t(r) {
    for (var n = r.length; n-- && e.test(r.charAt(n)); )
      ;
    return n;
  }
  return Zs = t, Zs;
}
var Qs, mh;
function pN() {
  if (mh) return Qs;
  mh = 1;
  var e = fN(), t = /^\s+/;
  function r(n) {
    return n && n.slice(0, e(n) + 1).replace(t, "");
  }
  return Qs = r, Qs;
}
var Js, gh;
function hN() {
  if (gh) return Js;
  gh = 1;
  var e = pN(), t = Rt(), r = rn(), n = NaN, o = /^[-+]0x[0-9a-f]+$/i, a = /^0b[01]+$/i, i = /^0o[0-7]+$/i, s = parseInt;
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
  return Js = c, Js;
}
var ec, vh;
function mN() {
  if (vh) return ec;
  vh = 1;
  var e = Rt(), t = dN(), r = hN(), n = "Expected a function", o = Math.max, a = Math.min;
  function i(s, c, l) {
    var u, d, f, g, b, m, h = 0, y = !1, w = !1, x = !0;
    if (typeof s != "function")
      throw new TypeError(n);
    c = r(c) || 0, e(l) && (y = !!l.leading, w = "maxWait" in l, f = w ? o(r(l.maxWait) || 0, c) : f, x = "trailing" in l ? !!l.trailing : x);
    function _(D) {
      var F = u, $ = d;
      return u = d = void 0, h = D, g = s.apply($, F), g;
    }
    function C(D) {
      return h = D, b = setTimeout(P, c), y ? _(D) : g;
    }
    function S(D) {
      var F = D - m, $ = D - h, I = c - F;
      return w ? a(I, f - $) : I;
    }
    function O(D) {
      var F = D - m, $ = D - h;
      return m === void 0 || F >= c || F < 0 || w && $ >= f;
    }
    function P() {
      var D = t();
      if (O(D))
        return T(D);
      b = setTimeout(P, S(D));
    }
    function T(D) {
      return b = void 0, x && u ? _(D) : (u = d = void 0, g);
    }
    function A() {
      b !== void 0 && clearTimeout(b), h = 0, u = m = d = b = void 0;
    }
    function k() {
      return b === void 0 ? g : T(t());
    }
    function q() {
      var D = t(), F = O(D);
      if (u = arguments, d = this, m = D, F) {
        if (b === void 0)
          return C(m);
        if (w)
          return clearTimeout(b), b = setTimeout(P, c), _(m);
      }
      return b === void 0 && (b = setTimeout(P, c)), g;
    }
    return q.cancel = A, q.flush = k, q;
  }
  return ec = i, ec;
}
var tc, bh;
function gN() {
  if (bh) return tc;
  bh = 1;
  var e = mN(), t = Rt(), r = "Expected a function";
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
  return tc = n, tc;
}
var vN = gN();
const bN = /* @__PURE__ */ at(vN);
function qr(e) {
  "@babel/helpers - typeof";
  return qr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, qr(e);
}
function yh(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function yn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? yh(Object(r), !0).forEach(function(n) {
      yN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : yh(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function yN(e, t, r) {
  return t = wN(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function wN(e) {
  var t = xN(e, "string");
  return qr(t) == "symbol" ? t : t + "";
}
function xN(e, t) {
  if (qr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (qr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function _N(e, t) {
  return PN(e) || ON(e, t) || CN(e, t) || SN();
}
function SN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function CN(e, t) {
  if (e) {
    if (typeof e == "string") return wh(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return wh(e, t);
  }
}
function wh(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function ON(e, t) {
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
function PN(e) {
  if (Array.isArray(e)) return e;
}
var EN = /* @__PURE__ */ Ic(function(e, t) {
  var r = e.aspect, n = e.initialDimension, o = n === void 0 ? {
    width: -1,
    height: -1
  } : n, a = e.width, i = a === void 0 ? "100%" : a, s = e.height, c = s === void 0 ? "100%" : s, l = e.minWidth, u = l === void 0 ? 0 : l, d = e.minHeight, f = e.maxHeight, g = e.children, b = e.debounce, m = b === void 0 ? 0 : b, h = e.id, y = e.className, w = e.onResize, x = e.style, _ = x === void 0 ? {} : x, C = Jt(null), S = Jt();
  S.current = w, ew(t, function() {
    return Object.defineProperty(C.current, "current", {
      get: function() {
        return console.warn("The usage of ref.current.current is deprecated and will no longer be supported."), C.current;
      },
      configurable: !0
    });
  });
  var O = Tr({
    containerWidth: o.width,
    containerHeight: o.height
  }), P = _N(O, 2), T = P[0], A = P[1], k = Ee(function(D, F) {
    A(function($) {
      var I = Math.round(D), Y = Math.round(F);
      return $.containerWidth === I && $.containerHeight === Y ? $ : {
        containerWidth: I,
        containerHeight: Y
      };
    });
  }, []);
  _h(function() {
    var D = function(N) {
      var R, X = N[0].contentRect, le = X.width, me = X.height;
      k(le, me), (R = S.current) === null || R === void 0 || R.call(S, le, me);
    };
    m > 0 && (D = bN(D, m, {
      trailing: !0,
      leading: !1
    }));
    var F = new ResizeObserver(D), $ = C.current.getBoundingClientRect(), I = $.width, Y = $.height;
    return k(I, Y), F.observe(C.current), function() {
      F.disconnect();
    };
  }, [k, m]);
  var q = Mr(function() {
    var D = T.containerWidth, F = T.containerHeight;
    if (D < 0 || F < 0)
      return null;
    Cn(gn(i) || gn(c), `The width(%s) and height(%s) are both fixed numbers,
       maybe you don't need to use a ResponsiveContainer.`, i, c), Cn(!r || r > 0, "The aspect(%s) must be greater than zero.", r);
    var $ = gn(i) ? D : i, I = gn(c) ? F : c;
    r && r > 0 && ($ ? I = $ / r : I && ($ = I * r), f && I > f && (I = f)), Cn($ > 0 || I > 0, `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`, $, I, i, c, u, d, r);
    var Y = !Array.isArray(g) && Z1(g.type).endsWith("Chart");
    return E.Children.map(g, function(B) {
      return /* @__PURE__ */ E.isValidElement(B) ? /* @__PURE__ */ tw(B, yn({
        width: $,
        height: I
      }, Y ? {
        style: yn({
          height: "100%",
          width: "100%",
          maxHeight: I,
          maxWidth: $
        }, B.props.style)
      } : {})) : B;
    });
  }, [r, g, c, f, d, u, T, i]);
  return /* @__PURE__ */ E.createElement("div", {
    id: h ? "".concat(h) : void 0,
    className: pt("recharts-responsive-container", y),
    style: yn(yn({}, _), {}, {
      width: i,
      height: c,
      minWidth: u,
      minHeight: d,
      maxHeight: f
    }),
    ref: C
  }, q);
});
const MN = { light: "", dark: ".dark" }, ky = p.createContext(null);
function Dy() {
  const e = p.useContext(ky);
  if (!e)
    throw new Error("useChart must be used within a <ChartContainer />");
  return e;
}
function pI({
  id: e,
  className: t,
  children: r,
  config: n,
  ...o
}) {
  const a = p.useId(), i = `chart-${e || a.replace(/:/g, "")}`;
  return /* @__PURE__ */ v(ky.Provider, { value: { config: n }, children: /* @__PURE__ */ ae(
    "div",
    {
      "data-slot": "chart",
      "data-chart": i,
      className: M(
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
        t
      ),
      ...o,
      children: [
        /* @__PURE__ */ v(TN, { id: i, config: n }),
        /* @__PURE__ */ v(EN, { children: r })
      ]
    }
  ) });
}
const TN = ({ id: e, config: t }) => {
  const r = Object.entries(t).filter(
    ([, n]) => n.theme || n.color
  );
  return r.length ? /* @__PURE__ */ v(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: Object.entries(MN).map(
          ([n, o]) => `
${o} [data-chart=${e}] {
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
}, hI = jl;
function mI({
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
  const { config: g } = Dy(), b = p.useMemo(() => {
    var _;
    if (o || !(t != null && t.length))
      return null;
    const [h] = t, y = `${f || (h == null ? void 0 : h.dataKey) || (h == null ? void 0 : h.name) || "value"}`, w = Ac(g, h, y), x = !f && typeof i == "string" ? ((_ = g[i]) == null ? void 0 : _.label) || i : w == null ? void 0 : w.label;
    return s ? /* @__PURE__ */ v("div", { className: M("font-medium", c), children: s(x, t) }) : x ? /* @__PURE__ */ v("div", { className: M("font-medium", c), children: x }) : null;
  }, [
    i,
    s,
    t,
    o,
    c,
    g,
    f
  ]);
  if (!e || !(t != null && t.length))
    return null;
  const m = t.length === 1 && n !== "dot";
  return /* @__PURE__ */ ae(
    "div",
    {
      className: M(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        r
      ),
      children: [
        m ? null : b,
        /* @__PURE__ */ v("div", { className: "grid gap-1.5", children: t.filter((h) => h.type !== "none").map((h, y) => {
          const w = `${d || h.name || h.dataKey || "value"}`, x = Ac(g, h, w), _ = u || h.payload.fill || h.color;
          return /* @__PURE__ */ v(
            "div",
            {
              className: M(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                n === "dot" && "items-center"
              ),
              children: l && (h == null ? void 0 : h.value) !== void 0 && h.name ? l(h.value, h.name, h, y, h.payload) : /* @__PURE__ */ ae(It, { children: [
                x != null && x.icon ? /* @__PURE__ */ v(x.icon, {}) : !a && /* @__PURE__ */ v(
                  "div",
                  {
                    className: M(
                      "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                      {
                        "h-2.5 w-2.5": n === "dot",
                        "w-1": n === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent": n === "dashed",
                        "my-0.5": m && n === "dashed"
                      }
                    ),
                    style: {
                      "--color-bg": _,
                      "--color-border": _
                    }
                  }
                ),
                /* @__PURE__ */ ae(
                  "div",
                  {
                    className: M(
                      "flex flex-1 justify-between leading-none",
                      m ? "items-end" : "items-center"
                    ),
                    children: [
                      /* @__PURE__ */ ae("div", { className: "grid gap-1.5", children: [
                        m ? b : null,
                        /* @__PURE__ */ v("span", { className: "text-muted-foreground", children: (x == null ? void 0 : x.label) || h.name })
                      ] }),
                      h.value && /* @__PURE__ */ v("span", { className: "text-foreground font-mono font-medium tabular-nums", children: h.value.toLocaleString() })
                    ]
                  }
                )
              ] })
            },
            h.dataKey
          );
        }) })
      ]
    }
  );
}
const gI = ql;
function vI({
  className: e,
  hideIcon: t = !1,
  payload: r,
  verticalAlign: n = "bottom",
  nameKey: o
}) {
  const { config: a } = Dy();
  return r != null && r.length ? /* @__PURE__ */ v(
    "div",
    {
      className: M(
        "flex items-center justify-center gap-4",
        n === "top" ? "pb-3" : "pt-3",
        e
      ),
      children: r.filter((i) => i.type !== "none").map((i) => {
        const s = `${o || i.dataKey || "value"}`, c = Ac(a, i, s);
        return /* @__PURE__ */ ae(
          "div",
          {
            className: M(
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
function Ac(e, t, r) {
  if (typeof t != "object" || t === null)
    return;
  const n = "payload" in t && typeof t.payload == "object" && t.payload !== null ? t.payload : void 0;
  let o = r;
  return r in t && typeof t[r] == "string" ? o = t[r] : n && r in n && typeof n[r] == "string" && (o = n[r]), o in e ? e[o] : e[r];
}
export {
  AN as Avatar,
  $N as AvatarBadge,
  FN as AvatarFallback,
  BN as AvatarGroup,
  WN as AvatarGroupCount,
  IN as AvatarImage,
  fl as Button,
  eA as Calendar,
  xT as CalendarDayButton,
  qN as Card,
  HN as CardAction,
  YN as CardContent,
  zN as CardDescription,
  VN as CardFooter,
  LN as CardHeader,
  jN as CardTitle,
  pI as ChartContainer,
  gI as ChartLegend,
  vI as ChartLegendContent,
  TN as ChartStyle,
  hI as ChartTooltip,
  mI as ChartTooltipContent,
  tA as Dialog,
  nA as DialogContent,
  sA as DialogDescription,
  aA as DialogFooter,
  oA as DialogHeader,
  iA as DialogTitle,
  rA as DialogTrigger,
  cA as DropdownMenu,
  pA as DropdownMenuCheckboxItem,
  uA as DropdownMenuContent,
  dA as DropdownMenuGroup,
  fA as DropdownMenuItem,
  gA as DropdownMenuLabel,
  hA as DropdownMenuRadioGroup,
  mA as DropdownMenuRadioItem,
  vA as DropdownMenuSeparator,
  bA as DropdownMenuSub,
  wA as DropdownMenuSubContent,
  yA as DropdownMenuSubTrigger,
  lA as DropdownMenuTrigger,
  xA as Form,
  OA as FormControl,
  PA as FormDescription,
  _A as FormField,
  SA as FormItem,
  CA as FormLabel,
  EA as FormMessage,
  sP as Input,
  cP as Label,
  MA as Popover,
  RA as PopoverContent,
  TA as PopoverTrigger,
  UN as Select,
  ZN as SelectContent,
  QN as SelectItem,
  XN as SelectTrigger,
  KN as SelectValue,
  BT as Separator,
  WT as Sheet,
  jT as SheetContent,
  YT as SheetDescription,
  DA as SheetFooter,
  zT as SheetHeader,
  HT as SheetTitle,
  kA as SheetTrigger,
  AA as Sidebar,
  jA as SidebarContent,
  qA as SidebarFooter,
  zA as SidebarGroup,
  YA as SidebarGroupContent,
  HA as SidebarGroupLabel,
  WA as SidebarHeader,
  BA as SidebarInput,
  $A as SidebarInset,
  VA as SidebarMenu,
  KA as SidebarMenuAction,
  XA as SidebarMenuBadge,
  UA as SidebarMenuButton,
  GA as SidebarMenuItem,
  ZA as SidebarMenuSkeleton,
  QA as SidebarMenuSub,
  eI as SidebarMenuSubButton,
  JA as SidebarMenuSubItem,
  NA as SidebarProvider,
  FA as SidebarRail,
  LA as SidebarSeparator,
  IA as SidebarTrigger,
  Xu as Skeleton,
  JN as Switch,
  tI as Table,
  nI as TableBody,
  cI as TableCaption,
  sI as TableCell,
  oI as TableFooter,
  iI as TableHead,
  rI as TableHeader,
  aI as TableRow,
  lI as Tabs,
  fI as TabsContent,
  uI as TabsList,
  dI as TabsTrigger,
  GN as Textarea,
  UT as Tooltip,
  XT as TooltipContent,
  GT as TooltipProvider,
  KT as TooltipTrigger,
  bc as buttonVariants,
  M as cn,
  VT as useIsMobile,
  vo as useSidebar
};
