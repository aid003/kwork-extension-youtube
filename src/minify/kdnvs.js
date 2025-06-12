/*! For license information please see content.js.LICENSE.txt */
(() => {
  "use strict";
  var e = !1,
    t = Array.isArray,
    r = Array.prototype.indexOf,
    n = Array.from,
    i = Object.defineProperty,
    o = Object.getOwnPropertyDescriptor,
    s = Object.getOwnPropertyDescriptors,
    a = Object.prototype,
    l = Array.prototype,
    c = Object.getPrototypeOf,
    u = Object.isExtensible;
  function d(e) {
    return "function" == typeof e;
  }
  const p = () => {};
  function h(e) {
    for (var t = 0; t < e.length; t++) e[t]();
  }
  const f = 32,
    g = 64,
    m = 128,
    v = 256,
    y = 512,
    b = 1024,
    w = 2048,
    x = 4096,
    C = 8192,
    S = 16384,
    k = 65536,
    E = 1 << 20,
    T = 1 << 21,
    A = Symbol("$state"),
    O = Symbol("$state metadata"),
    P = Symbol("legacy props"),
    M = Symbol("");
  function N(e) {
    return e === this.v;
  }
  function I(e, t) {
    return e != e
      ? t == t
      : e !== t ||
          (null !== e && "object" == typeof e) ||
          "function" == typeof e;
  }
  function _(e, t) {
    return e !== t;
  }
  function L(e) {
    return !I(e, this.v);
  }
  function D(e, t, r) {
    throw new Error("https://svelte.dev/e/each_key_duplicate");
  }
  let R = !1;
  const $ = Symbol(),
    F = Symbol("filename");
  const B = [];
  function q(e, t = !1) {
    return j(e, new Map(), "", B);
  }
  function j(e, r, n, i, o = null) {
    if ("object" == typeof e && null !== e) {
      var s = r.get(e);
      if (void 0 !== s) return s;
      if (e instanceof Map) return new Map(e);
      if (e instanceof Set) return new Set(e);
      if (t(e)) {
        var l = Array(e.length);
        r.set(e, l), null !== o && r.set(o, l);
        for (var u = 0; u < e.length; u += 1) {
          var d = e[u];
          u in e && (l[u] = j(d, r, n, i));
        }
        return l;
      }
      if (c(e) === a) {
        for (var p in ((l = {}), r.set(e, l), null !== o && r.set(o, l), e))
          l[p] = j(e[p], r, n, i);
        return l;
      }
      if (e instanceof Date) return structuredClone(e);
      if ("function" == typeof e.toJSON) return j(e.toJSON(), r, n, i, e);
    }
    if (e instanceof EventTarget) return e;
    try {
      return structuredClone(e);
    } catch (t) {
      return e;
    }
  }
  const H = {},
    V = /at (?:.+ \()?(.+):(\d+):(\d+)\)?$/,
    U = /@(.+):(\d+):(\d+)$/;
  function z() {
    const e = new Error().stack;
    if (!e) return null;
    const t = [];
    for (const r of e.split("\n")) {
      let e = V.exec(r) ?? U.exec(r);
      e && t.push({ file: e[1], line: +e[2], column: +e[3] });
    }
    return t;
  }
  const G = Symbol("ADD_OWNER");
  function W() {
    const e = z()?.[2];
    e && (H[e.file] ??= []).push({ start: e, end: null, component: null });
  }
  function K(e) {
    const t = z()?.[2];
    if (t) {
      const r = H[t.file],
        n = r[r.length - 1];
      (n.end = t), (n.component = e);
    }
  }
  function Z(e, t, r = !1, n = !1) {
    if (e && !r) {
      const r = ie,
        i = e[O];
      if (i && !J(i, r)) {
        let e = ee(i);
        t &&
          t[F] !== r[F] &&
          !n &&
          (r[F],
          t[F],
          e[F],
          console.warn("https://svelte.dev/e/ownership_invalid_binding"));
      }
    }
    Q(e, t, new Set());
  }
  function X(e, t, r = !1) {
    je(() => {
      Z(e(), t, !1, r);
    });
  }
  function Y(e, t, r, n) {
    e[G].current ||= r.map(() => $);
    for (let i = 0; i < r.length; i += 1) {
      const o = r[i]();
      o !== e[G][i] && ((e[G].current[i] = o), Z(o, t, !1, n));
    }
  }
  function Q(e, t, r) {
    const n = e?.[O];
    if (n)
      "owners" in n &&
        null != n.owners &&
        (t ? n.owners.add(t) : (n.owners = null));
    else if (e && "object" == typeof e) {
      if (r.has(e)) return;
      if ((r.add(e), G in e && e[G]))
        Ue(() => {
          e[G](t);
        });
      else {
        var i = c(e);
        if (i === Object.prototype)
          for (const n in e)
            if (Object.getOwnPropertyDescriptor(e, n)?.get) {
              let i = $;
              Ue(() => {
                const o = e[n];
                i !== o && ((i = o), Q(o, t, r));
              });
            } else Q(e[n], t, r);
        else if (i === Array.prototype)
          for (let n = 0; n < e.length; n += 1) Q(e[n], t, r);
      }
    }
  }
  function J(e, t) {
    return (
      null === e.owners ||
      e.owners.has(t) ||
      (F in t && [...e.owners].some((e) => e[F] === t[F])) ||
      (null !== e.parent && J(e.parent, t))
    );
  }
  function ee(e) {
    return e?.owners?.values().next().value ?? ee(e.parent);
  }
  function te(e) {
    throw new Error("https://svelte.dev/e/lifecycle_outside_component");
  }
  let re = null;
  function ne(e) {
    re = e;
  }
  let ie = null;
  function oe(e) {
    ie = e;
  }
  function se(e) {
    return ue().get(e);
  }
  function ae(e, t = !1, r) {
    var n = (re = {
      p: re,
      c: null,
      d: !1,
      e: null,
      m: !1,
      s: e,
      x: null,
      l: null,
    });
    R && !t && (re.l = { s: null, u: null, r1: [], r2: ge(!1) }),
      Be(() => {
        n.d = !0;
      });
  }
  function le(e) {
    const t = re;
    if (null !== t) {
      void 0 !== e && (t.x = e);
      const s = t.e;
      if (null !== s) {
        var r = yt,
          n = gt;
        t.e = null;
        try {
          for (var i = 0; i < s.length; i++) {
            var o = s[i];
            bt(o.effect), vt(o.reaction), Ve(o.fn);
          }
        } finally {
          bt(r), vt(n);
        }
      }
      (re = t.p), (t.m = !0);
    }
    return e || {};
  }
  function ce() {
    return !R || (null !== re && null === re.l);
  }
  function ue(e) {
    return (
      null === re && te(),
      (re.c ??= new Map(
        (function (e) {
          let t = e.p;
          for (; null !== t; ) {
            const e = t.c;
            if (null !== e) return e;
            t = t.p;
          }
          return null;
        })(re) || void 0
      ))
    );
  }
  function de(e, r) {
    if ("object" != typeof e || null === e || A in e) return e;
    const n = c(e);
    if (n !== a && n !== l) return e;
    var i = new Map(),
      s = t(e),
      u = me(0),
      d = gt,
      p = (e) => {
        var t,
          r = gt;
        return vt(d), (t = e()), vt(r), t;
      };
    return (
      s && i.set("length", me(e.length)),
      new Proxy(e, {
        defineProperty(e, t, r) {
          ("value" in r &&
            !1 !== r.configurable &&
            !1 !== r.enumerable &&
            !1 !== r.writable) ||
            (function () {
              throw new Error("https://svelte.dev/e/state_descriptors_fixed");
            })();
          var n = i.get(t);
          return (
            void 0 === n
              ? ((n = p(() => me(r.value))), i.set(t, n))
              : ye(
                  n,
                  p(() => de(r.value))
                ),
            !0
          );
        },
        deleteProperty(e, t) {
          var r = i.get(t);
          if (void 0 === r)
            t in e &&
              i.set(
                t,
                p(() => me($))
              );
          else {
            if (s && "string" == typeof t) {
              var n = i.get("length"),
                o = Number(t);
              Number.isInteger(o) && o < n.v && ye(n, o);
            }
            ye(r, $), pe(u);
          }
          return !0;
        },
        get(t, r, n) {
          if (r === A) return e;
          var s = i.get(r),
            a = r in t;
          if (
            (void 0 !== s ||
              (a && !o(t, r)?.writable) ||
              ((s = p(() => me(de(a ? t[r] : $)))), i.set(r, s)),
            void 0 !== s)
          ) {
            var l = Ht(s);
            return l === $ ? void 0 : l;
          }
          return Reflect.get(t, r, n);
        },
        getOwnPropertyDescriptor(e, t) {
          var r = Reflect.getOwnPropertyDescriptor(e, t);
          if (r && "value" in r) {
            var n = i.get(t);
            n && (r.value = Ht(n));
          } else if (void 0 === r) {
            var o = i.get(t),
              s = o?.v;
            if (void 0 !== o && s !== $)
              return {
                enumerable: !0,
                configurable: !0,
                value: s,
                writable: !0,
              };
          }
          return r;
        },
        has(e, t) {
          if (t === A) return !0;
          var r = i.get(t),
            n = (void 0 !== r && r.v !== $) || Reflect.has(e, t);
          if (
            (void 0 !== r || (null !== yt && (!n || o(e, t)?.writable))) &&
            (void 0 === r && ((r = p(() => me(n ? de(e[t]) : $))), i.set(t, r)),
            Ht(r) === $)
          )
            return !1;
          return n;
        },
        set(e, t, r, n) {
          var a = i.get(t),
            l = t in e;
          if (s && "length" === t)
            for (var c = r; c < a.v; c += 1) {
              var d = i.get(c + "");
              void 0 !== d
                ? ye(d, $)
                : c in e && ((d = p(() => me($))), i.set(c + "", d));
            }
          void 0 === a
            ? (l && !o(e, t)?.writable) ||
              (ye(
                (a = p(() => me(void 0))),
                p(() => de(r))
              ),
              i.set(t, a))
            : ((l = a.v !== $),
              ye(
                a,
                p(() => de(r))
              ));
          var h = Reflect.getOwnPropertyDescriptor(e, t);
          if ((h?.set && h.set.call(n, r), !l)) {
            if (s && "string" == typeof t) {
              var f = i.get("length"),
                g = Number(t);
              Number.isInteger(g) && g >= f.v && ye(f, g + 1);
            }
            pe(u);
          }
          return !0;
        },
        ownKeys(e) {
          Ht(u);
          var t = Reflect.ownKeys(e).filter((e) => {
            var t = i.get(e);
            return void 0 === t || t.v !== $;
          });
          for (var [r, n] of i) n.v === $ || r in e || t.push(r);
          return t;
        },
        setPrototypeOf() {
          !(function () {
            throw new Error("https://svelte.dev/e/state_prototype_fixed");
          })();
        },
      })
    );
  }
  function pe(e, t = 1) {
    ye(e, e.v + t);
  }
  function he(e) {
    try {
      if (null !== e && "object" == typeof e && A in e) return e[A];
    } catch {}
    return e;
  }
  const fe = new Map();
  function ge(e, t) {
    return { f: 0, v: e, reactions: null, equals: N, rv: 0, wv: 0 };
  }
  function me(e, t) {
    const r = ge(e);
    return xt(r), r;
  }
  function ve(e, t = !1) {
    const r = ge(e);
    return (
      t || (r.equals = L),
      R && null !== re && null !== re.l && (re.l.s ??= []).push(r),
      r
    );
  }
  function ye(e, t, r = !1) {
    return (
      null !== gt &&
        !mt &&
        ce() &&
        18 & gt.f &&
        !wt?.includes(e) &&
        (function () {
          throw new Error("https://svelte.dev/e/state_unsafe_mutation");
        })(),
      be(e, r ? de(t) : t)
    );
  }
  function be(e, t) {
    if (!e.equals(t)) {
      var r = e.v;
      pt ? fe.set(e, t) : fe.set(e, r),
        (e.v = t),
        (e.wv = Ot()),
        we(e, w),
        ce() &&
          null !== yt &&
          yt.f & b &&
          !(96 & yt.f) &&
          (null === kt
            ? (function (e) {
                kt = e;
              })([e])
            : kt.push(e));
    }
    return t;
  }
  function we(e, t) {
    var r = e.reactions;
    if (null !== r)
      for (var n = ce(), i = r.length, o = 0; o < i; o++) {
        var s = r[o],
          a = s.f;
        a & w ||
          ((n || s !== yt) &&
            (zt(s, t), 1280 & a && (2 & a ? we(s, x) : Bt(s))));
      }
  }
  function xe(e, t, r = !0) {
    try {
      (e === t) != (he(e) === he(t)) &&
        console.warn("https://svelte.dev/e/state_proxy_equality_mismatch");
    } catch {}
    return (e === t) === r;
  }
  var Ce, Se, ke, Ee;
  function Te(e = "") {
    return document.createTextNode(e);
  }
  function Ae(e) {
    return ke.call(e);
  }
  function Oe(e) {
    return Ee.call(e);
  }
  function Pe(e, t) {
    return Ae(e);
  }
  function Me(e, t) {
    var r = Ae(e);
    return r instanceof Comment && "" === r.data ? Oe(r) : r;
  }
  function Ne(e, t = 1, r = !1) {
    let n = e;
    for (; t--; ) n = Oe(n);
    return n;
  }
  function Ie(e) {
    var t = 2050,
      r = null !== gt && 2 & gt.f ? gt : null;
    null === yt || (null !== r && r.f & v) ? (t |= v) : (yt.f |= E);
    return {
      ctx: re,
      deps: null,
      effects: null,
      equals: N,
      f: t,
      fn: e,
      reactions: null,
      rv: 0,
      v: null,
      wv: 0,
      parent: r ?? yt,
    };
  }
  function _e(e) {
    const t = Ie(e);
    return xt(t), t;
  }
  function Le(e) {
    const t = Ie(e);
    return (t.equals = L), t;
  }
  function De(e) {
    var t = e.effects;
    if (null !== t) {
      e.effects = null;
      for (var r = 0; r < t.length; r += 1) Xe(t[r]);
    }
  }
  function Re(e) {
    var t = (function (e) {
      var t,
        r = yt;
      bt(
        (function (e) {
          for (var t = e.parent; null !== t; ) {
            if (!(2 & t.f)) return t;
            t = t.parent;
          }
          return null;
        })(e)
      );
      try {
        De(e), (t = It(e));
      } finally {
        bt(r);
      }
      return t;
    })(e);
    zt(e, (At || e.f & v) && null !== e.deps ? x : b),
      e.equals(t) || ((e.v = t), (e.wv = Ot()));
  }
  function $e(e) {
    null === yt &&
      null === gt &&
      (function () {
        throw new Error("https://svelte.dev/e/effect_orphan");
      })(),
      null !== gt &&
        gt.f & v &&
        null === yt &&
        (function () {
          throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
        })(),
      pt &&
        (function () {
          throw new Error("https://svelte.dev/e/effect_in_teardown");
        })();
  }
  function Fe(e, t, r, n = !0) {
    var i = yt,
      o = {
        ctx: re,
        deps: null,
        nodes_start: null,
        nodes_end: null,
        f: e | w,
        first: null,
        fn: t,
        last: null,
        next: null,
        parent: i,
        prev: null,
        teardown: null,
        transitions: null,
        wv: 0,
      };
    if (r)
      try {
        Dt(o), (o.f |= 32768);
      } catch (e) {
        throw (Xe(o), e);
      }
    else null !== t && Bt(o);
    if (
      !(
        r &&
        null === o.deps &&
        null === o.first &&
        null === o.nodes_start &&
        null === o.teardown &&
        !(1048704 & o.f)
      ) &&
      n &&
      (null !== i &&
        (function (e, t) {
          var r = t.last;
          null === r
            ? (t.last = t.first = e)
            : ((r.next = e), (e.prev = r), (t.last = e));
        })(o, i),
      null !== gt && 2 & gt.f)
    ) {
      var s = gt;
      (s.effects ??= []).push(o);
    }
    return o;
  }
  function Be(e) {
    const t = Fe(8, null, !1);
    return zt(t, b), (t.teardown = e), t;
  }
  function qe(e) {
    if (($e(), !(null !== yt && !!(yt.f & f) && null !== re && !re.m)))
      return Ve(e);
    var t = re;
    (t.e ??= []).push({ fn: e, effect: yt, reaction: gt });
  }
  function je(e) {
    return $e(), Ue(e);
  }
  function He(e) {
    const t = Fe(g, e, !0);
    return () => {
      Xe(t);
    };
  }
  function Ve(e) {
    return Fe(4, e, !1);
  }
  function Ue(e) {
    return Fe(8, e, !0);
  }
  function ze(e, t = [], r = Ie) {
    const n = t.map(r);
    return Ge(() => e(...n.map(Ht)));
  }
  function Ge(e, t = 0) {
    return Fe(24 | t, e, !0);
  }
  function We(e, t = !0) {
    return Fe(40, e, !0, t);
  }
  function Ke(e) {
    var t = e.teardown;
    if (null !== t) {
      const e = pt,
        r = gt;
      ht(!0), vt(null);
      try {
        t.call(null);
      } finally {
        ht(e), vt(r);
      }
    }
  }
  function Ze(e, t = !1) {
    var r = e.first;
    for (e.first = e.last = null; null !== r; ) {
      var n = r.next;
      r.f & g ? (r.parent = null) : Xe(r, t), (r = n);
    }
  }
  function Xe(e, t = !0) {
    var r = !1;
    if ((t || 524288 & e.f) && null !== e.nodes_start) {
      for (var n = e.nodes_start, i = e.nodes_end; null !== n; ) {
        var o = n === i ? null : Oe(n);
        n.remove(), (n = o);
      }
      r = !0;
    }
    Ze(e, t && !r), Lt(e, 0), zt(e, S);
    var s = e.transitions;
    if (null !== s) for (const e of s) e.stop();
    Ke(e);
    var a = e.parent;
    null !== a && null !== a.first && Ye(e),
      (e.next =
        e.prev =
        e.teardown =
        e.ctx =
        e.deps =
        e.fn =
        e.nodes_start =
        e.nodes_end =
          null);
  }
  function Ye(e) {
    var t = e.parent,
      r = e.prev,
      n = e.next;
    null !== r && (r.next = n),
      null !== n && (n.prev = r),
      null !== t &&
        (t.first === e && (t.first = n), t.last === e && (t.last = r));
  }
  function Qe(e, t) {
    var r = [];
    et(e, r, !0),
      Je(r, () => {
        Xe(e), t && t();
      });
  }
  function Je(e, t) {
    var r = e.length;
    if (r > 0) {
      var n = () => --r || t();
      for (var i of e) i.out(n);
    } else t();
  }
  function et(e, t, r) {
    if (!(e.f & C)) {
      if (((e.f ^= C), null !== e.transitions))
        for (const n of e.transitions) (n.is_global || r) && t.push(n);
      for (var n = e.first; null !== n; ) {
        var i = n.next;
        et(n, t, !!(!!(n.f & k) || !!(n.f & f)) && r), (n = i);
      }
    }
  }
  function tt(e) {
    rt(e, !0);
  }
  function rt(e, t) {
    if (e.f & C) {
      (e.f ^= C), e.f & b || (e.f ^= b), Pt(e) && (zt(e, w), Bt(e));
      for (var r = e.first; null !== r; ) {
        var n = r.next;
        rt(r, !!(!!(r.f & k) || !!(r.f & f)) && t), (r = n);
      }
      if (null !== e.transitions)
        for (const r of e.transitions) (r.is_global || t) && r.in();
    }
  }
  let nt = [],
    it = [];
  function ot() {
    var e = nt;
    (nt = []), h(e);
  }
  function st(e) {
    0 === nt.length && queueMicrotask(ot), nt.push(e);
  }
  function at() {
    var e;
    nt.length > 0 && ot(), it.length > 0 && ((e = it), (it = []), h(e));
  }
  let lt = !1,
    ct = !1,
    ut = null,
    dt = !1,
    pt = !1;
  function ht(e) {
    pt = e;
  }
  let ft = [],
    gt = null,
    mt = !1;
  function vt(e) {
    gt = e;
  }
  let yt = null;
  function bt(e) {
    yt = e;
  }
  let wt = null;
  function xt(e) {
    null !== gt && gt.f & T && (null === wt ? (wt = [e]) : wt.push(e));
  }
  let Ct = null,
    St = 0,
    kt = null;
  let Et = 1,
    Tt = 0,
    At = !1;
  function Ot() {
    return ++Et;
  }
  function Pt(e) {
    var t = e.f;
    if (t & w) return !0;
    if (t & x) {
      var r = e.deps,
        n = !!(t & v);
      if (null !== r) {
        var i,
          o,
          s = !!(t & y),
          a = n && null !== yt && !At,
          l = r.length;
        if (s || a) {
          var c = e,
            u = c.parent;
          for (i = 0; i < l; i++)
            (o = r[i]),
              (!s && o?.reactions?.includes(c)) || (o.reactions ??= []).push(c);
          s && (c.f ^= y), !a || null === u || u.f & v || (c.f ^= v);
        }
        for (i = 0; i < l; i++)
          if ((Pt((o = r[i])) && Re(o), o.wv > e.wv)) return !0;
      }
      (n && (null === yt || At)) || zt(e, b);
    }
    return !1;
  }
  function Mt(e, t, r, n) {
    if (lt) {
      if (
        (null === r && (lt = !1),
        (function (e) {
          return !(e.f & S || (null !== e.parent && e.parent.f & m));
        })(t))
      )
        throw e;
    } else
      null !== r && (lt = !0),
        (function (e, t) {
          for (var r = t; null !== r; ) {
            if (r.f & m)
              try {
                return void r.fn(e);
              } catch {
                r.f ^= m;
              }
            r = r.parent;
          }
          throw ((lt = !1), e);
        })(e, t);
  }
  function Nt(e, t, r = !0) {
    var n = e.reactions;
    if (null !== n)
      for (var i = 0; i < n.length; i++) {
        var o = n[i];
        wt?.includes(e) ||
          (2 & o.f
            ? Nt(o, t, !1)
            : t === o && (r ? zt(o, w) : o.f & b && zt(o, x), Bt(o)));
      }
  }
  function It(e) {
    var t = Ct,
      r = St,
      n = kt,
      i = gt,
      o = At,
      s = wt,
      a = re,
      l = mt,
      c = e.f;
    (Ct = null),
      (St = 0),
      (kt = null),
      (At = !!(c & v) && (mt || !dt || null === gt)),
      (gt = 96 & c ? null : e),
      (wt = null),
      ne(e.ctx),
      (mt = !1),
      Tt++,
      (e.f |= T);
    try {
      var u = (0, e.fn)(),
        d = e.deps;
      if (null !== Ct) {
        var p;
        if ((Lt(e, St), null !== d && St > 0))
          for (d.length = St + Ct.length, p = 0; p < Ct.length; p++)
            d[St + p] = Ct[p];
        else e.deps = d = Ct;
        if (!At)
          for (p = St; p < d.length; p++) (d[p].reactions ??= []).push(e);
      } else null !== d && St < d.length && (Lt(e, St), (d.length = St));
      if (ce() && null !== kt && !mt && null !== d && !(6146 & e.f))
        for (p = 0; p < kt.length; p++) Nt(kt[p], e);
      return (
        null !== i &&
          (Tt++, null !== kt && (null === n ? (n = kt) : n.push(...kt))),
        u
      );
    } finally {
      (Ct = t),
        (St = r),
        (kt = n),
        (gt = i),
        (At = o),
        (wt = s),
        ne(a),
        (mt = l),
        (e.f ^= T);
    }
  }
  function _t(e, t) {
    let n = t.reactions;
    if (null !== n) {
      var i = r.call(n, e);
      if (-1 !== i) {
        var o = n.length - 1;
        0 === o ? (n = t.reactions = null) : ((n[i] = n[o]), n.pop());
      }
    }
    null === n &&
      2 & t.f &&
      (null === Ct || !Ct.includes(t)) &&
      (zt(t, x), 768 & t.f || (t.f ^= y), De(t), Lt(t, 0));
  }
  function Lt(e, t) {
    var r = e.deps;
    if (null !== r) for (var n = t; n < r.length; n++) _t(e, r[n]);
  }
  function Dt(t) {
    var r = t.f;
    if (!(r & S)) {
      zt(t, b);
      var n = yt,
        i = re,
        o = dt;
      (yt = t), (dt = !0);
      try {
        16 & r
          ? (function (e) {
              for (var t = e.first; null !== t; ) {
                var r = t.next;
                t.f & f || Xe(t), (t = r);
              }
            })(t)
          : Ze(t),
          Ke(t);
        var s = It(t);
        (t.teardown = "function" == typeof s ? s : null), (t.wv = Et);
        t.deps;
        e;
      } catch (e) {
        Mt(e, t, n, i || t.ctx);
      } finally {
        (dt = o), (yt = n);
      }
    }
  }
  function Rt() {
    try {
      !(function () {
        throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
      })();
    } catch (e) {
      if (null === ut) throw e;
      Mt(e, ut, null);
    }
  }
  function $t() {
    var e = dt;
    try {
      var t = 0;
      for (dt = !0; ft.length > 0; ) {
        t++ > 1e3 && Rt();
        var r = ft,
          n = r.length;
        ft = [];
        for (var i = 0; i < n; i++) {
          Ft(qt(r[i]));
        }
        fe.clear();
      }
    } finally {
      (ct = !1), (dt = e), (ut = null);
    }
  }
  function Ft(e) {
    var t = e.length;
    if (0 !== t)
      for (var r = 0; r < t; r++) {
        var n = e[r];
        if (!(24576 & n.f))
          try {
            Pt(n) &&
              (Dt(n),
              null === n.deps &&
                null === n.first &&
                null === n.nodes_start &&
                (null === n.teardown ? Ye(n) : (n.fn = null)));
          } catch (e) {
            Mt(e, n, null, n.ctx);
          }
      }
  }
  function Bt(e) {
    ct || ((ct = !0), queueMicrotask($t));
    for (var t = (ut = e); null !== t.parent; ) {
      var r = (t = t.parent).f;
      if (96 & r) {
        if (!(r & b)) return;
        t.f ^= b;
      }
    }
    ft.push(t);
  }
  function qt(e) {
    for (var t = [], r = e; null !== r; ) {
      var n = r.f,
        i = !!(96 & n);
      if (!((i && !!(n & b)) || n & C)) {
        if (4 & n) t.push(r);
        else if (i) r.f ^= b;
        else {
          var o = gt;
          try {
            (gt = r), Pt(r) && Dt(r);
          } catch (e) {
            Mt(e, r, null, r.ctx);
          } finally {
            gt = o;
          }
        }
        var s = r.first;
        if (null !== s) {
          r = s;
          continue;
        }
      }
      var a = r.parent;
      for (r = r.next; null === r && null !== a; ) (r = a.next), (a = a.parent);
    }
    return t;
  }
  async function jt() {
    await Promise.resolve(),
      (function (e) {
        var t;
        for (e && ((ct = !0), $t(), (t = e())), at(); ft.length > 0; )
          (ct = !0), $t(), at();
      })();
  }
  function Ht(e) {
    var t = !!(2 & e.f);
    if (null === gt || mt) {
      if (t && null === e.deps && null === e.effects) {
        var r = e,
          n = r.parent;
        null === n || n.f & v || (r.f ^= v);
      }
    } else if (!wt?.includes(e)) {
      var i = gt.deps;
      e.rv < Tt &&
        ((e.rv = Tt),
        null === Ct && null !== i && i[St] === e
          ? St++
          : null === Ct
          ? (Ct = [e])
          : (At && Ct.includes(e)) || Ct.push(e));
    }
    return t && Pt((r = e)) && Re(r), pt && fe.has(e) ? fe.get(e) : e.v;
  }
  function Vt(e) {
    var t = mt;
    try {
      return (mt = !0), e();
    } finally {
      mt = t;
    }
  }
  const Ut = -7169;
  function zt(e, t) {
    e.f = (e.f & Ut) | t;
  }
  const Gt = [
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ];
  function Wt(e) {
    return (
      e.endsWith("capture") &&
      "gotpointercapture" !== e &&
      "lostpointercapture" !== e
    );
  }
  const Kt = [
    "beforeinput",
    "click",
    "change",
    "dblclick",
    "contextmenu",
    "focusin",
    "focusout",
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "pointerdown",
    "pointermove",
    "pointerout",
    "pointerover",
    "pointerup",
    "touchend",
    "touchmove",
    "touchstart",
  ];
  function Zt(e) {
    return Kt.includes(e);
  }
  const Xt = {
    formnovalidate: "formNoValidate",
    ismap: "isMap",
    nomodule: "noModule",
    playsinline: "playsInline",
    readonly: "readOnly",
    defaultvalue: "defaultValue",
    defaultchecked: "defaultChecked",
    srcobject: "srcObject",
    novalidate: "noValidate",
    allowfullscreen: "allowFullscreen",
    disablepictureinpicture: "disablePictureInPicture",
    disableremoteplayback: "disableRemotePlayback",
  };
  function Yt(e) {
    return (e = e.toLowerCase()), Xt[e] ?? e;
  }
  const Qt = ["touchstart", "touchmove"];
  function Jt(e) {
    return Qt.includes(e);
  }
  function er(e, t, r) {
    return (...n) => {
      const i = e(...n);
      return rr(11 === i.nodeType ? i.firstChild : i, t, r), i;
    };
  }
  function tr(e, t, r) {
    (e.__svelte_meta = { loc: { file: t, line: r[0], column: r[1] } }),
      r[2] && rr(e.firstChild, t, r[2]);
  }
  function rr(e, t, r) {
    for (var n = 0; e && n < r.length; )
      1 === e.nodeType && tr(e, t, r[n++]), (e = e.nextSibling);
  }
  function nr(e, t) {
    if (t) {
      const t = document.body;
      (e.autofocus = !0),
        st(() => {
          document.activeElement === t && e.focus();
        });
    }
  }
  function ir(e) {
    var t = gt,
      r = yt;
    vt(null), bt(null);
    try {
      return e();
    } finally {
      vt(t), bt(r);
    }
  }
  const or = new Set(),
    sr = new Set();
  function ar(e, t, r, n = {}) {
    function i(e) {
      if ((n.capture || ur.call(t, e), !e.cancelBubble))
        return ir(() => r?.call(this, e));
    }
    return (
      e.startsWith("pointer") || e.startsWith("touch") || "wheel" === e
        ? st(() => {
            t.addEventListener(e, i, n);
          })
        : t.addEventListener(e, i, n),
      i
    );
  }
  function lr(e, t, r, n = {}) {
    var i = ar(t, e, r, n);
    return () => {
      e.removeEventListener(t, i, n);
    };
  }
  function cr(e) {
    for (var t = 0; t < e.length; t++) or.add(e[t]);
    for (var r of sr) r(e);
  }
  function ur(e) {
    var r = this,
      n = r.ownerDocument,
      o = e.type,
      s = e.composedPath?.() || [],
      a = s[0] || e.target,
      l = 0,
      c = e.__root;
    if (c) {
      var u = s.indexOf(c);
      if (-1 !== u && (r === document || r === window))
        return void (e.__root = r);
      var d = s.indexOf(r);
      if (-1 === d) return;
      u <= d && (l = u);
    }
    if ((a = s[l] || e.target) !== r) {
      i(e, "currentTarget", { configurable: !0, get: () => a || n });
      var p = gt,
        h = yt;
      vt(null), bt(null);
      try {
        for (var f, g = []; null !== a; ) {
          var m = a.assignedSlot || a.parentNode || a.host || null;
          try {
            var v = a["__" + o];
            if (null != v && (!a.disabled || e.target === a))
              if (t(v)) {
                var [y, ...b] = v;
                y.apply(a, [e, ...b]);
              } else v.call(a, e);
          } catch (e) {
            f ? g.push(e) : (f = e);
          }
          if (e.cancelBubble || m === r || null === m) break;
          a = m;
        }
        if (f) {
          for (let e of g)
            queueMicrotask(() => {
              throw e;
            });
          throw f;
        }
      } finally {
        (e.__root = r), delete e.currentTarget, vt(p), bt(h);
      }
    }
  }
  function dr(e) {
    var t = document.createElement("template");
    return (t.innerHTML = e), t.content;
  }
  function pr(e, t) {
    var r = yt;
    null === r.nodes_start && ((r.nodes_start = e), (r.nodes_end = t));
  }
  function hr(e, t) {
    var r,
      n = !!(1 & t),
      i = !!(2 & t),
      o = !e.startsWith("<!>");
    return () => {
      void 0 === r && ((r = dr(o ? e : "<!>" + e)), n || (r = Ae(r)));
      var t = i || Se ? document.importNode(r, !0) : r.cloneNode(!0);
      n ? pr(Ae(t), t.lastChild) : pr(t, t);
      return t;
    };
  }
  function fr(e, t, r = "svg") {
    var n,
      i = !e.startsWith("<!>"),
      o = !!(1 & t),
      s = `<${r}>${i ? e : "<!>" + e}</${r}>`;
    return () => {
      if (!n) {
        var e = Ae(dr(s));
        if (o)
          for (n = document.createDocumentFragment(); Ae(e); )
            n.appendChild(Ae(e));
        else n = Ae(e);
      }
      var t = n.cloneNode(!0);
      o ? pr(Ae(t), t.lastChild) : pr(t, t);
      return t;
    };
  }
  function gr(e = "") {
    var t = Te(e + "");
    return pr(t, t), t;
  }
  function mr() {
    var e = document.createDocumentFragment(),
      t = document.createComment(""),
      r = Te();
    return e.append(t, r), pr(t, r), e;
  }
  function vr(e, t) {
    null !== e && e.before(t);
  }
  let yr = !0;
  function br(e) {
    yr = e;
  }
  function wr(e, t) {
    var r = null == t ? "" : "object" == typeof t ? t + "" : t;
    r !== (e.__t ??= e.nodeValue) && ((e.__t = r), (e.nodeValue = r + ""));
  }
  function xr(e, t) {
    return (function (
      e,
      {
        target: t,
        anchor: r,
        props: i = {},
        events: s,
        context: a,
        intro: l = !0,
      }
    ) {
      !(function () {
        if (void 0 === Ce) {
          (Ce = window), (Se = /Firefox/.test(navigator.userAgent));
          var e = Element.prototype,
            t = Node.prototype,
            r = Text.prototype;
          (ke = o(t, "firstChild").get),
            (Ee = o(t, "nextSibling").get),
            u(e) &&
              ((e.__click = void 0),
              (e.__className = void 0),
              (e.__attributes = null),
              (e.__style = void 0),
              (e.__e = void 0)),
            u(r) && (r.__t = void 0);
        }
      })();
      var c = new Set(),
        d = (e) => {
          for (var r = 0; r < e.length; r++) {
            var n = e[r];
            if (!c.has(n)) {
              c.add(n);
              var i = Jt(n);
              t.addEventListener(n, ur, { passive: i });
              var o = Cr.get(n);
              void 0 === o
                ? (document.addEventListener(n, ur, { passive: i }),
                  Cr.set(n, 1))
                : Cr.set(n, o + 1);
            }
          }
        };
      d(n(or)), sr.add(d);
      var p = void 0,
        h = (function (e) {
          const t = Fe(g, e, !0);
          return (e = {}) =>
            new Promise((r) => {
              e.outro
                ? Qe(t, () => {
                    Xe(t), r(void 0);
                  })
                : (Xe(t), r(void 0));
            });
        })(() => {
          var n = r ?? t.appendChild(Te());
          return (
            We(() => {
              a && (ae({}), (re.c = a));
              s && (i.$$events = s),
                (yr = l),
                (p = e(n, i) || {}),
                (yr = !0),
                a && le();
            }),
            () => {
              for (var e of c) {
                t.removeEventListener(e, ur);
                var i = Cr.get(e);
                0 == --i
                  ? (document.removeEventListener(e, ur), Cr.delete(e))
                  : Cr.set(e, i);
              }
              sr.delete(d), n !== r && n.parentNode?.removeChild(n);
            }
          );
        });
      return Sr.set(p, h), p;
    })(e, t);
  }
  const Cr = new Map();
  let Sr = new WeakMap();
  function kr(e) {
    e &&
      (function () {
        throw new Error("https://svelte.dev/e/component_api_invalid_new");
      })(e[F], e.name);
  }
  function Er() {
    const e = re?.function;
    function t(t) {
      !(function () {
        const e = z()?.slice(4);
        if (!e) return null;
        for (let t = 0; t < e.length; t++) {
          const r = e[t],
            n = H[r.file];
          if (n)
            for (const e of n) {
              if (null == e.end) return null;
              if (e.start.line < r.line && e.end.line > r.line)
                return e.component;
            }
          else if (0 === t) return null;
        }
      })();
      !(function () {
        throw new Error("https://svelte.dev/e/component_api_changed");
      })(0, 0, e[F]);
    }
    return { $destroy: () => t(), $on: () => t(), $set: () => t() };
  }
  function Tr(e, t, [r, n] = [0, 0]) {
    var i = e,
      o = null,
      s = null,
      a = $,
      l = !1;
    const c = (e, t = !0) => {
        (l = !0), u(t, e);
      },
      u = (e, t) => {
        a !== (a = e) &&
          (a
            ? (o ? tt(o) : t && (o = We(() => t(i))),
              s &&
                Qe(s, () => {
                  s = null;
                }))
            : (s ? tt(s) : t && (s = We(() => t(i, [r + 1, n]))),
              o &&
                Qe(o, () => {
                  o = null;
                })));
      };
    Ge(
      () => {
        (l = !1), t(c), l || u(null, null);
      },
      r > 0 ? k : 0
    );
  }
  function Ar(e, t) {
    return t;
  }
  function Or(e, r, i, o, s, a = null) {
    var l = e,
      c = { flags: r, items: new Map(), first: null };
    !(4 & r) || (l = e.appendChild(Te()));
    var u = null,
      d = !1,
      p = Le(() => {
        var e = i();
        return t(e) ? e : null == e ? [] : n(e);
      });
    Ge(() => {
      var e = Ht(p),
        t = e.length;
      (d && 0 === t) ||
        ((d = 0 === t),
        (function (e, t, r, i, o, s, a) {
          var l,
            c,
            u,
            d,
            p,
            h,
            f = !!(8 & o),
            g = !!(3 & o),
            m = e.length,
            v = t.items,
            y = t.first,
            b = y,
            w = null,
            x = [],
            S = [];
          if (f)
            for (h = 0; h < m; h += 1)
              (d = s((u = e[h]), h)),
                void 0 !== (p = v.get(d)) &&
                  (p.a?.measure(), (c ??= new Set()).add(p));
          for (h = 0; h < m; h += 1)
            if (((d = s((u = e[h]), h)), void 0 !== (p = v.get(d)))) {
              if (
                (g && Pr(p, u, h, o),
                p.e.f & C &&
                  (tt(p.e), f && (p.a?.unfix(), (c ??= new Set()).delete(p))),
                p !== b)
              ) {
                if (void 0 !== l && l.has(p)) {
                  if (x.length < S.length) {
                    var k,
                      E = S[0];
                    w = E.prev;
                    var T = x[0],
                      A = x[x.length - 1];
                    for (k = 0; k < x.length; k += 1) Nr(x[k], E, r);
                    for (k = 0; k < S.length; k += 1) l.delete(S[k]);
                    Ir(t, T.prev, A.next),
                      Ir(t, w, T),
                      Ir(t, A, E),
                      (b = E),
                      (w = A),
                      (h -= 1),
                      (x = []),
                      (S = []);
                  } else
                    l.delete(p),
                      Nr(p, b, r),
                      Ir(t, p.prev, p.next),
                      Ir(t, p, null === w ? t.first : w.next),
                      Ir(t, w, p),
                      (w = p);
                  continue;
                }
                for (x = [], S = []; null !== b && b.k !== d; )
                  b.e.f & C || (l ??= new Set()).add(b),
                    S.push(b),
                    (b = b.next);
                if (null === b) continue;
                p = b;
              }
              x.push(p), (w = p), (b = p.next);
            } else {
              (w = Mr(
                b ? b.e.nodes_start : r,
                t,
                w,
                null === w ? t.first : w.next,
                u,
                d,
                h,
                i,
                o,
                a
              )),
                v.set(d, w),
                (x = []),
                (S = []),
                (b = w.next);
            }
          if (null !== b || void 0 !== l) {
            for (var O = void 0 === l ? [] : n(l); null !== b; )
              b.e.f & C || O.push(b), (b = b.next);
            var P = O.length;
            if (P > 0) {
              var M = 4 & o && 0 === m ? r : null;
              if (f) {
                for (h = 0; h < P; h += 1) O[h].a?.measure();
                for (h = 0; h < P; h += 1) O[h].a?.fix();
              }
              !(function (e, t, r, n) {
                for (var i = [], o = t.length, s = 0; s < o; s++)
                  et(t[s].e, i, !0);
                var a = o > 0 && 0 === i.length && null !== r;
                if (a) {
                  var l = r.parentNode;
                  !(function (e) {
                    e.textContent = "";
                  })(l),
                    l.append(r),
                    n.clear(),
                    Ir(e, t[0].prev, t[o - 1].next);
                }
                Je(i, () => {
                  for (var r = 0; r < o; r++) {
                    var i = t[r];
                    a || (n.delete(i.k), Ir(e, i.prev, i.next)), Xe(i.e, !a);
                  }
                });
              })(t, O, M, v);
            }
          }
          f &&
            st(() => {
              if (void 0 !== c) for (p of c) p.a?.apply();
            });
          (yt.first = t.first && t.first.e), (yt.last = w && w.e);
        })(e, c, l, s, r, o, i),
        null !== a &&
          (0 === t
            ? u
              ? tt(u)
              : (u = We(() => a(l)))
            : null !== u &&
              Qe(u, () => {
                u = null;
              })),
        Ht(p));
    });
  }
  function Pr(e, t, r, n) {
    1 & n && be(e.v, t), 2 & n ? be(e.i, r) : (e.i = r);
  }
  function Mr(e, t, r, n, i, o, s, a, l, c) {
    var u = !!(1 & l) ? (!(16 & l) ? ve(i) : ge(i)) : i,
      d = 2 & l ? ge(s) : s,
      p = { i: d, v: u, k: o, a: null, e: null, prev: r, next: n };
    try {
      return (
        (p.e = We(() => a(e, u, d, c), false)),
        (p.e.prev = r && r.e),
        (p.e.next = n && n.e),
        null === r ? (t.first = p) : ((r.next = p), (r.e.next = p.e)),
        null !== n && ((n.prev = p), (n.e.prev = p.e)),
        p
      );
    } finally {
    }
  }
  function Nr(e, t, r) {
    for (
      var n = e.next ? e.next.e.nodes_start : r,
        i = t ? t.e.nodes_start : r,
        o = e.e.nodes_start;
      o !== n;

    ) {
      var s = Oe(o);
      i.before(o), (o = s);
    }
  }
  function Ir(e, t, r) {
    null === t ? (e.first = r) : ((t.next = r), (t.e.next = r && r.e)),
      null !== r && ((r.prev = t), (r.e.prev = t && t.e));
  }
  function _r(e, t, r, n, i) {
    var o,
      s = e,
      a = "";
    Ge(() => {
      a !== (a = t() ?? "") &&
        (void 0 !== o && (Xe(o), (o = void 0)),
        "" !== a &&
          (o = We(() => {
            var e = a + "";
            r ? (e = `<svg>${e}</svg>`) : n && (e = `<math>${e}</math>`);
            var t = dr(e);
            if (((r || n) && (t = Ae(t)), pr(Ae(t), t.lastChild), r || n))
              for (; Ae(t); ) s.before(Ae(t));
            else s.before(t);
          })));
    });
  }
  function Lr(e, t, ...r) {
    var n,
      i = e,
      o = p;
    Ge(() => {
      o !== (o = t()) && (n && (Xe(n), (n = null)), (n = We(() => o(i, ...r))));
    }, k);
  }
  function Dr(e, t) {
    return (r, ...n) => {
      var i = ie;
      oe(e);
      try {
        return t(r, ...n);
      } finally {
        oe(i);
      }
    };
  }
  function Rr(e, t, r) {
    var n,
      i,
      o = e;
    Ge(() => {
      n !== (n = t()) &&
        (i && (Qe(i), (i = null)), n && (i = We(() => r(o, n))));
    }, k);
  }
  function $r(e) {
    var t,
      r,
      n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e)
      if (Array.isArray(e)) {
        var i = e.length;
        for (t = 0; t < i; t++)
          e[t] && (r = $r(e[t])) && (n && (n += " "), (n += r));
      } else for (r in e) e[r] && (n && (n += " "), (n += r));
    return n;
  }
  function Fr() {
    for (var e, t, r = 0, n = "", i = arguments.length; r < i; r++)
      (e = arguments[r]) && (t = $r(e)) && (n && (n += " "), (n += t));
    return n;
  }
  const Br = [..." \t\n\r\f\xa0\v\ufeff"];
  function qr(e, t = !1) {
    var r = t ? " !important;" : ";",
      n = "";
    for (var i in e) {
      var o = e[i];
      null != o && "" !== o && (n += " " + i + ": " + o + r);
    }
    return n;
  }
  function jr(e) {
    return "-" !== e[0] || "-" !== e[1] ? e.toLowerCase() : e;
  }
  function Hr(e, t, r, n, i, o) {
    var s = e.__className;
    if (s !== r || void 0 === s) {
      var a = (function (e, t, r) {
        var n = null == e ? "" : "" + e;
        if ((t && (n = n ? n + " " + t : t), r))
          for (var i in r)
            if (r[i]) n = n ? n + " " + i : i;
            else if (n.length)
              for (var o = i.length, s = 0; (s = n.indexOf(i, s)) >= 0; ) {
                var a = s + o;
                (0 !== s && !Br.includes(n[s - 1])) ||
                (a !== n.length && !Br.includes(n[a]))
                  ? (s = a)
                  : (n =
                      (0 === s ? "" : n.substring(0, s)) + n.substring(a + 1));
              }
        return "" === n ? null : n;
      })(r, n, o);
      null == a
        ? e.removeAttribute("class")
        : t
        ? (e.className = a)
        : e.setAttribute("class", a),
        (e.__className = r);
    } else if (o && i !== o)
      for (var l in o) {
        var c = !!o[l];
        (null != i && c === !!i[l]) || e.classList.toggle(l, c);
      }
    return o;
  }
  function Vr(e, t = {}, r, n) {
    for (var i in r) {
      var o = r[i];
      t[i] !== o &&
        (null == r[i]
          ? e.style.removeProperty(i)
          : e.style.setProperty(i, o, n));
    }
  }
  function Ur(e, t, r, n) {
    if (e.__style !== t) {
      var i = (function (e, t) {
        if (t) {
          var r,
            n,
            i = "";
          if ((Array.isArray(t) ? ((r = t[0]), (n = t[1])) : (r = t), e)) {
            e = String(e)
              .replaceAll(/\s*\/\*.*?\*\/\s*/g, "")
              .trim();
            var o = !1,
              s = 0,
              a = !1,
              l = [];
            r && l.push(...Object.keys(r).map(jr)),
              n && l.push(...Object.keys(n).map(jr));
            var c = 0,
              u = -1;
            const t = e.length;
            for (var d = 0; d < t; d++) {
              var p = e[d];
              if (
                (a
                  ? "/" === p && "*" === e[d - 1] && (a = !1)
                  : o
                  ? o === p && (o = !1)
                  : "/" === p && "*" === e[d + 1]
                  ? (a = !0)
                  : '"' === p || "'" === p
                  ? (o = p)
                  : "(" === p
                  ? s++
                  : ")" === p && s--,
                !a && !1 === o && 0 === s)
              )
                if (":" === p && -1 === u) u = d;
                else if (";" === p || d === t - 1) {
                  if (-1 !== u) {
                    var h = jr(e.substring(c, u).trim());
                    l.includes(h) ||
                      (";" !== p && d++,
                      (i += " " + e.substring(c, d).trim() + ";"));
                  }
                  (c = d + 1), (u = -1);
                }
            }
          }
          return (
            r && (i += qr(r)),
            n && (i += qr(n, !0)),
            "" === (i = i.trim()) ? null : i
          );
        }
        return null == e ? null : String(e);
      })(t, n);
      null == i ? e.removeAttribute("style") : (e.style.cssText = i),
        (e.__style = t);
    } else
      n &&
        (Array.isArray(n)
          ? (Vr(e, r?.[0], n[0]), Vr(e, r?.[1], n[1], "important"))
          : Vr(e, r, n));
    return n;
  }
  const zr = Symbol("class"),
    Gr = Symbol("style"),
    Wr = Symbol("is custom element"),
    Kr = Symbol("is html");
  function Zr(e, t) {
    t
      ? e.hasAttribute("selected") || e.setAttribute("selected", "")
      : e.removeAttribute("selected");
  }
  function Xr(e, t, r, n) {
    var i = Qr(e);
    i[t] !== (i[t] = r) &&
      ("loading" === t && (e[M] = r),
      null == r
        ? e.removeAttribute(t)
        : "string" != typeof r && en(e).includes(t)
        ? (e[t] = r)
        : e.setAttribute(t, r));
  }
  function Yr(e, t, r, n, i = !1) {
    var o,
      s = Qr(e),
      a = s[Wr],
      l = !s[Kr],
      c = t || {},
      u = "OPTION" === e.tagName;
    for (var d in t) d in r || (r[d] = null);
    r.class
      ? (r.class = "object" == typeof (o = r.class) ? Fr(o) : o ?? "")
      : (n || r[zr]) && (r.class = null),
      r[Gr] && (r.style ??= null);
    var p = en(e);
    for (const y in r) {
      let b = r[y];
      if (u && "value" === y && null == b)
        (e.value = e.__value = ""), (c[y] = b);
      else if ("class" !== y)
        if ("style" !== y) {
          var h = c[y];
          if (b !== h) {
            c[y] = b;
            var f = y[0] + y[1];
            if ("$$" !== f)
              if ("on" === f) {
                const w = {},
                  x = "$$" + y;
                let C = y.slice(2);
                var g = Zt(C);
                if (
                  (Wt(C) && ((C = C.slice(0, -7)), (w.capture = !0)), !g && h)
                ) {
                  if (null != b) continue;
                  e.removeEventListener(C, c[x], w), (c[x] = null);
                }
                if (null != b)
                  if (g) (e[`__${C}`] = b), cr([C]);
                  else {
                    function S(e) {
                      c[y].call(this, e);
                    }
                    c[x] = ar(C, e, S, w);
                  }
                else g && (e[`__${C}`] = void 0);
              } else if ("style" === y) Xr(e, y, b);
              else if ("autofocus" === y) nr(e, Boolean(b));
              else if (a || ("__value" !== y && ("value" !== y || null == b)))
                if ("selected" === y && u) Zr(e, b);
                else {
                  var m = y;
                  l || (m = Yt(m));
                  var v = "defaultValue" === m || "defaultChecked" === m;
                  if (null != b || a || v)
                    v || (p.includes(m) && (a || "string" != typeof b))
                      ? (e[m] = b)
                      : "function" != typeof b && Xr(e, m, b);
                  else if (((s[y] = null), "value" === m || "checked" === m)) {
                    let k = e;
                    const E = void 0 === t;
                    if ("value" === m) {
                      let T = k.defaultValue;
                      k.removeAttribute(m),
                        (k.defaultValue = T),
                        (k.value = k.__value = E ? T : null);
                    } else {
                      let A = k.defaultChecked;
                      k.removeAttribute(m),
                        (k.defaultChecked = A),
                        (k.checked = !!E && A);
                    }
                  } else e.removeAttribute(y);
                }
              else e.value = e.__value = b;
          }
        } else Ur(e, b, t?.[Gr], r[Gr]), (c[y] = b), (c[Gr] = r[Gr]);
      else
        Hr(
          e,
          "http://www.w3.org/1999/xhtml" === e.namespaceURI,
          b,
          n,
          t?.[zr],
          r[zr]
        ),
          (c[y] = b),
          (c[zr] = r[zr]);
    }
    return c;
  }
  function Qr(e) {
    return (e.__attributes ??= {
      [Wr]: e.nodeName.includes("-"),
      [Kr]: "http://www.w3.org/1999/xhtml" === e.namespaceURI,
    });
  }
  var Jr = new Map();
  function en(e) {
    var t,
      r = Jr.get(e.nodeName);
    if (r) return r;
    Jr.set(e.nodeName, (r = []));
    for (var n = e, i = Element.prototype; i !== n; ) {
      for (var o in (t = s(n))) t[o].set && r.push(o);
      n = c(n);
    }
    return r;
  }
  const tn = {
    tick: (e) => requestAnimationFrame(e),
    now: () => performance.now(),
    tasks: new Set(),
  };
  function rn() {
    const e = tn.now();
    tn.tasks.forEach((t) => {
      t.c(e) || (tn.tasks.delete(t), t.f());
    }),
      0 !== tn.tasks.size && tn.tick(rn);
  }
  function nn(e, t) {
    ir(() => {
      e.dispatchEvent(new CustomEvent(t));
    });
  }
  function on(e) {
    if ("float" === e) return "cssFloat";
    if ("offset" === e) return "cssOffset";
    if (e.startsWith("--")) return e;
    const t = e.split("-");
    return 1 === t.length
      ? t[0]
      : t[0] +
          t
            .slice(1)
            .map((e) => e[0].toUpperCase() + e.slice(1))
            .join("");
  }
  function sn(e) {
    const t = {},
      r = e.split(";");
    for (const e of r) {
      const [r, n] = e.split(":");
      if (!r || void 0 === n) break;
      t[on(r.trim())] = n.trim();
    }
    return t;
  }
  const an = (e) => e;
  function ln(e, t, r, n) {
    var i,
      o,
      s,
      a = !!(1 & e),
      l = !!(2 & e),
      c = !!(4 & e),
      u = a && l ? "both" : a ? "in" : "out",
      d = t.inert,
      p = t.style.overflow;
    function h() {
      var e = gt,
        o = yt;
      vt(null), bt(null);
      try {
        return (i ??= r()(t, n?.() ?? {}, { direction: u }));
      } finally {
        vt(e), bt(o);
      }
    }
    var f = {
        is_global: c,
        in() {
          if (((t.inert = d), !a)) return s?.abort(), void s?.reset?.();
          l || o?.abort(),
            nn(t, "introstart"),
            (o = cn(t, h(), s, 1, () => {
              nn(t, "introend"),
                o?.abort(),
                (o = i = void 0),
                (t.style.overflow = p);
            }));
        },
        out(e) {
          if (!l) return e?.(), void (i = void 0);
          (t.inert = !0),
            nn(t, "outrostart"),
            (s = cn(t, h(), o, 0, () => {
              nn(t, "outroend"), e?.();
            }));
        },
        stop: () => {
          o?.abort(), s?.abort();
        },
      },
      g = yt;
    if (((g.transitions ??= []).push(f), a && yr)) {
      var m = c;
      if (!m) {
        for (var v = g.parent; v && v.f & k; )
          for (; (v = v.parent) && !(16 & v.f); );
        m = !v || !!(32768 & v.f);
      }
      m &&
        Ve(() => {
          Vt(() => f.in());
        });
    }
  }
  function cn(e, t, r, n, i) {
    var o = 1 === n;
    if (d(t)) {
      var s,
        a = !1;
      return (
        st(() => {
          if (!a) {
            var l = t({ direction: o ? "in" : "out" });
            s = cn(e, l, r, n, i);
          }
        }),
        {
          abort: () => {
            (a = !0), s?.abort();
          },
          deactivate: () => s.deactivate(),
          reset: () => s.reset(),
          t: () => s.t(),
        }
      );
    }
    if ((r?.deactivate(), !t?.duration))
      return i(), { abort: p, deactivate: p, reset: p, t: () => n };
    const { delay: l = 0, css: c, tick: u, easing: h = an } = t;
    var f = [];
    if (o && void 0 === r && (u && u(0, 1), c)) {
      var g = sn(c(0, 1));
      f.push(g, g);
    }
    var m = () => 1 - n,
      v = e.animate(f, { duration: l });
    return (
      (v.onfinish = () => {
        var o = r?.t() ?? 1 - n;
        r?.abort();
        var s = n - o,
          a = t.duration * Math.abs(s),
          l = [];
        if (a > 0) {
          var d = !1;
          if (c)
            for (var p = Math.ceil(a / (1e3 / 60)), f = 0; f <= p; f += 1) {
              var g = o + s * h(f / p),
                y = sn(c(g, 1 - g));
              l.push(y), (d ||= "hidden" === y.overflow);
            }
          d && (e.style.overflow = "hidden"),
            (m = () => {
              var e = v.currentTime;
              return o + s * h(e / a);
            }),
            u &&
              (function (e) {
                let t;
                0 === tn.tasks.size && tn.tick(rn),
                  new Promise((r) => {
                    tn.tasks.add((t = { c: e, f: r }));
                  });
              })(() => {
                if ("running" !== v.playState) return !1;
                var e = m();
                return u(e, 1 - e), !0;
              });
        }
        (v = e.animate(l, { duration: a, fill: "forwards" })).onfinish = () => {
          (m = () => n), u?.(n, 1 - n), i();
        };
      }),
      {
        abort: () => {
          v && (v.cancel(), (v.effect = null), (v.onfinish = p));
        },
        deactivate: () => {
          i = p;
        },
        reset: () => {
          0 === n && u?.(1, 0);
        },
        t: () => m(),
      }
    );
  }
  function un(e, t) {
    return e === t || e?.[A] === t;
  }
  function dn(e = {}, t, r, n) {
    return (
      Ve(() => {
        var i, o;
        return (
          Ue(() => {
            (i = o),
              (o = n?.() || []),
              Vt(() => {
                e !== r(...o) &&
                  (t(e, ...o), i && un(r(...i), e) && t(null, ...i));
              });
          }),
          () => {
            st(() => {
              o && un(r(...o), e) && t(null, ...o);
            });
          }
        );
      }),
      e
    );
  }
  function pn(e, t, r) {
    if (null == e) return t(void 0), r && r(void 0), p;
    const n = Vt(() => e.subscribe(t, r));
    return n.unsubscribe ? () => n.unsubscribe() : n;
  }
  const hn = [];
  function fn(e, t = p) {
    let r = null;
    const n = new Set();
    function i(t) {
      if (I(e, t) && ((e = t), r)) {
        const t = !hn.length;
        for (const t of n) t[1](), hn.push(t, e);
        if (t) {
          for (let e = 0; e < hn.length; e += 2) hn[e][0](hn[e + 1]);
          hn.length = 0;
        }
      }
    }
    function o(t) {
      i(t(e));
    }
    return {
      set: i,
      update: o,
      subscribe: function (s, a = p) {
        const l = [s, a];
        return (
          n.add(l),
          1 === n.size && (r = t(i, o) || p),
          s(e),
          () => {
            n.delete(l), 0 === n.size && r && (r(), (r = null));
          }
        );
      },
    };
  }
  function gn(e) {
    let t;
    return pn(e, (e) => (t = e))(), t;
  }
  let mn = !1,
    vn = Symbol();
  function yn(e, t, r) {
    const n = (r[t] ??= { store: null, source: ve(void 0), unsubscribe: p });
    if (n.store !== e && !(vn in r))
      if ((n.unsubscribe(), (n.store = e ?? null), null == e))
        (n.source.v = void 0), (n.unsubscribe = p);
      else {
        var i = !0;
        (n.unsubscribe = pn(e, (e) => {
          i ? (n.source.v = e) : ye(n.source, e);
        })),
          (i = !1);
      }
    return e && vn in r ? gn(e) : Ht(n.source);
  }
  function bn() {
    const e = {};
    return [
      e,
      function () {
        Be(() => {
          for (var t in e) {
            e[t].unsubscribe();
          }
          i(e, vn, { enumerable: !1, value: !0 });
        });
      },
    ];
  }
  function wn(e) {
    var t = mn;
    try {
      return (mn = !1), [e(), mn];
    } finally {
      mn = t;
    }
  }
  const xn = {
    get(e, t) {
      if (!e.exclude.includes(t)) return e.props[t];
    },
    set: (e, t) => !1,
    getOwnPropertyDescriptor(e, t) {
      if (!e.exclude.includes(t))
        return t in e.props
          ? { enumerable: !0, configurable: !0, value: e.props[t] }
          : void 0;
    },
    has: (e, t) => !e.exclude.includes(t) && t in e.props,
    ownKeys: (e) =>
      Reflect.ownKeys(e.props).filter((t) => !e.exclude.includes(t)),
  };
  function Cn(e, t, r) {
    return new Proxy({ props: e, exclude: t }, xn);
  }
  const Sn = {
    get(e, t) {
      let r = e.props.length;
      for (; r--; ) {
        let n = e.props[r];
        if ((d(n) && (n = n()), "object" == typeof n && null !== n && t in n))
          return n[t];
      }
    },
    set(e, t, r) {
      let n = e.props.length;
      for (; n--; ) {
        let i = e.props[n];
        d(i) && (i = i());
        const s = o(i, t);
        if (s && s.set) return s.set(r), !0;
      }
      return !1;
    },
    getOwnPropertyDescriptor(e, t) {
      let r = e.props.length;
      for (; r--; ) {
        let n = e.props[r];
        if ((d(n) && (n = n()), "object" == typeof n && null !== n && t in n)) {
          const e = o(n, t);
          return e && !e.configurable && (e.configurable = !0), e;
        }
      }
    },
    has(e, t) {
      if (t === A || t === P) return !1;
      for (let r of e.props)
        if ((d(r) && (r = r()), null != r && t in r)) return !0;
      return !1;
    },
    ownKeys(e) {
      const t = [];
      for (let r of e.props) {
        d(r) && (r = r());
        for (const e in r) t.includes(e) || t.push(e);
      }
      return t;
    },
  };
  function kn(...e) {
    return new Proxy({ props: e }, Sn);
  }
  function En(e) {
    return e.ctx?.d ?? !1;
  }
  function Tn(e, t, r, n) {
    var i,
      s = !!(1 & r),
      a = !R || !!(2 & r),
      l = !!(8 & r),
      c = !!(16 & r),
      u = !1;
    l ? ([i, u] = wn(() => e[t])) : (i = e[t]);
    var d,
      p = A in e || P in e,
      h =
        (l && (o(e, t)?.set ?? (p && t in e && ((r) => (e[t] = r))))) || void 0,
      f = n,
      g = !0,
      m = !1,
      v = () => ((m = !0), g && ((g = !1), (f = c ? Vt(n) : n)), f);
    if (
      (void 0 === i &&
        void 0 !== n &&
        (h &&
          a &&
          (function () {
            throw new Error("https://svelte.dev/e/props_invalid_value");
          })(),
        (i = v()),
        h && h(i)),
      a)
    )
      d = () => {
        var r = e[t];
        return void 0 === r ? v() : ((g = !0), (m = !1), r);
      };
    else {
      var y = (s ? Ie : Le)(() => e[t]);
      (y.f |= 131072),
        (d = () => {
          var e = Ht(y);
          return void 0 !== e && (f = void 0), void 0 === e ? f : e;
        });
    }
    if (!(4 & r)) return d;
    if (h) {
      var b = e.$$legacy;
      return function (e, t) {
        return arguments.length > 0
          ? ((a && t && !b && !u) || h(t ? d() : e), e)
          : d();
      };
    }
    var w = !1,
      x = ve(i),
      C = Ie(() => {
        var e = d(),
          t = Ht(x);
        return w ? ((w = !1), t) : (x.v = e);
      });
    return (
      l && Ht(C),
      s || (C.equals = L),
      function (e, t) {
        if (arguments.length > 0) {
          const r = t ? Ht(C) : a && l ? de(e) : e;
          if (!C.equals(r)) {
            if (((w = !0), ye(x, r), m && void 0 !== f && (f = r), En(C)))
              return e;
            Vt(() => Ht(C));
          }
          return e;
        }
        return En(C) ? C.v : Ht(C);
      }
    );
  }
  function An(e, t, r, n, i) {
    var o = !1;
    Ue(() => {
      if (!o) {
        var [e, n] = wn(t);
        if (!n) {
          var i = r(),
            s = !1,
            a = Ue(() => {
              s || e[i];
            });
          (s = !0),
            null === a.deps &&
              (console.warn(
                "https://svelte.dev/e/binding_property_non_reactive"
              ),
              (o = !0));
        }
      }
    });
  }
  function On(e) {
    const t = e();
    var r;
    t &&
      ((r = t), Gt.includes(r) || "!doctype" === r.toLowerCase()) &&
      console.warn("https://svelte.dev/e/dynamic_void_element_content");
  }
  function Pn(e) {
    const t = e();
    t &&
      !("string" == typeof t) &&
      (function () {
        throw new Error(
          "https://svelte.dev/e/svelte_element_invalid_this_value"
        );
      })();
  }
  function Mn(e, t) {
    null != e &&
      "function" != typeof e.subscribe &&
      (function () {
        throw new Error("https://svelte.dev/e/store_invalid_shape");
      })();
  }
  function Nn(e, ...t) {
    return (
      Vt(() => {
        try {
          let e = !1;
          const r = [];
          for (const n of t)
            n && "object" == typeof n && A in n
              ? (r.push(q(n, !0)), (e = !0))
              : r.push(n);
          e &&
            (console.warn("https://svelte.dev/e/console_log_state"),
            console.log("%c[snapshot]", "color: grey", ...r));
        } catch {}
      }),
      t
    );
  }
  function In(e) {
    var t, r;
    null === re && te(),
      R && null !== re.l
        ? ((t = re), (r = t.l), (r.u ??= { a: [], b: [], m: [] })).m.push(e)
        : qe(() => {
            const t = Vt(e);
            if ("function" == typeof t) return t;
          });
  }
  var _n, Ln;
  !(function (e) {
    (e.Auto = "auto"),
      (e.Gemini15Flash = "gemini-1.5-flash"),
      (e.Gemini20FlashExp = "gemini-2.0-flash-exp"),
      (e.Gemini20FlashLite = "gemini-2.0-flash-lite"),
      (e.Gemini15Flash8b = "gemini-1.5-flash-8b"),
      (e.Gemini10Pro = "gemini-1.0-pro");
  })(_n || (_n = {})),
    (function (e) {
      (e.On = "on"), (e.Off = "off");
    })(Ln || (Ln = {}));
  const Dn = !1,
    Rn = 29900,
    $n = {
      FIREFOX: "https://addons.mozilla.org/en-US/firefox/addon/clarify-ai",
      CHROME:
        "https://chromewebstore.google.com/detail/ogihgbocgnbhhdcmcolhipjhkmkecpeg/reviews",
      EDGE: "https://microsoftedge.microsoft.com/addons/detail/youtube-summary-ai-with-g/akjfbgldngciabajgkmmbdlhpkciffgc",
    },
    Fn = {
      USD: "$",
      EUR: "\u20ac",
      GBP: "\xa3",
      CHF: "Fr",
      SEK: "kr",
      NOK: "kr",
      DKK: "kr",
      PLN: "z\u0142",
    },
    Bn = {
      auto: chrome.i18n.getMessage("auto"),
      ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
      bn: "\u09ac\u09be\u0982\u09b2\u09be",
      bg: "\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438",
      zh: "\u4e2d\u6587 (\u7b80\u4f53 / \u7e41\u9ad4)",
      "zh-Hans": "\u4e2d\u6587 (\u7b80\u4f53)",
      "zh-Hant": "\u4e2d\u6587 (\u7e41\u9ad4)",
      hr: "Hrvatski",
      cs: "\u010ce\u0161tina",
      da: "Dansk",
      nl: "Nederlands",
      en: "English",
      et: "Eesti",
      fa: "\u0641\u0627\u0631\u0633\u06cc",
      fi: "Suomi",
      fr: "Fran\xe7ais",
      de: "Deutsch",
      el: "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac",
      gu: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0",
      he: "\u05e2\u05d1\u05e8\u05d9\u05ea",
      hi: "\u0939\u093f\u0928\u094d\u0926\u0940",
      hu: "Magyar",
      id: "Bahasa Indonesia",
      it: "Italiano",
      ja: "\u65e5\u672c\u8a9e",
      kn: "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1",
      ko: "\ud55c\uad6d\uc5b4",
      lv: "Latvie\u0161u",
      lt: "Lietuvi\u0173",
      ml: "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02",
      mr: "\u092e\u0930\u093e\u0920\u0940",
      no: "Norsk",
      pl: "Polski",
      pt: "Portugu\xeas",
      ro: "Rom\xe2n\u0103",
      ru: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
      sr: "\u0421\u0440\u043f\u0441\u043a\u0438",
      sk: "Sloven\u010dina",
      sl: "Sloven\u0161\u010dina",
      es: "Espa\xf1ol",
      sw: "Kiswahili",
      sv: "Svenska",
      ta: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd",
      te: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41",
      th: "\u0e44\u0e17\u0e22",
      tr: "T\xfcrk\xe7e",
      uk: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430",
      ur: "\u0627\u0631\u062f\u0648",
      vi: "Ti\u1ebfng Vi\u1ec7t",
    },
    qn = [
      {
        value: _n.Auto,
        title: chrome.i18n.getMessage("auto"),
        description: chrome.i18n.getMessage("auto_model_description"),
      },
      {
        value: _n.Gemini15Flash,
        title: chrome.i18n.getMessage("gemini_flash_title"),
        description: chrome.i18n.getMessage("gemini_flash_description"),
      },
      {
        value: _n.Gemini20FlashExp,
        title: chrome.i18n.getMessage("gemini_2_flash_title"),
        description: chrome.i18n.getMessage("gemini_2_flash_description"),
        isPro: Dn,
        tooltipText: chrome.i18n.getMessage("upgrade_to_pro_tooltip"),
      },
      {
        value: _n.Gemini20FlashLite,
        title: chrome.i18n.getMessage("gemini_2_lite_title"),
        description: chrome.i18n.getMessage("gemini_2_lite_description"),
      },
      {
        value: _n.Gemini15Flash8b,
        title: chrome.i18n.getMessage("gemini_flash_8b_title"),
        description: chrome.i18n.getMessage("gemini_flash_8b_description"),
      },
      {
        value: _n.Gemini10Pro,
        title: chrome.i18n.getMessage("gemini_pro_title"),
        description: chrome.i18n.getMessage("gemini_pro_description"),
      },
    ],
    jn = [
      {
        title: chrome.i18n.getMessage("summary_length_short"),
        value: "3",
        description: chrome.i18n.getMessage("summary_length_short_description"),
      },
      {
        title: chrome.i18n.getMessage("summary_length_average"),
        value: "2",
        description: chrome.i18n.getMessage(
          "summary_length_average_description"
        ),
      },
      {
        title: chrome.i18n.getMessage("summary_length_detailed"),
        value: "1",
        description: chrome.i18n.getMessage(
          "summary_length_detailed_description"
        ),
      },
    ];
  var Hn, Vn;
  async function Un(e, t = 15) {
    let r = document.querySelector(e);
    let n = 0;
    return new Promise((i) => {
      const o = setInterval(() => {
        r && (i(r), clearInterval(o)),
          n === t && (i(null), clearInterval(o)),
          n++,
          (r = document.querySelector(e));
      }, 20);
    });
  }
  async function zn() {
    const e = Un("#related > ytd-watch-next-secondary-results-renderer"),
      t = Un("yt-related-chip-cloud-renderer"),
      r = Un("#title > #description"),
      [n, i, o] = await Promise.all([t, r, e]);
    return (!n && !o) || i;
  }
  function Gn(e) {
    return new URL(e).searchParams.get("v");
  }
  async function Wn() {
    return {
      videoDuration: (await Un(".ytp-time-duration"))?.textContent || "0",
      videoName:
        (await Un("#above-the-fold > #title > h1 > yt-formatted-string"))
          ?.textContent || "0",
      videoId: Gn(window.location.href) || "",
    };
  }
  !(function (e) {
    (e.Active = "active"), (e.Canceled = "canceled");
  })(Hn || (Hn = {})),
    (function (e) {
      (e.Monthly = "monthly"), (e.Yearly = "yearly");
    })(Vn || (Vn = {}));
  const Kn = () =>
      document.querySelector(
        "[target-id=engagement-panel-searchable-transcript]"
      ),
    Zn = () =>
      document.querySelector(
        "[target-id=engagement-panel-searchable-transcript] #header #visibility-button button"
      ),
    Xn = () =>
      document.querySelector(
        "ytd-video-description-transcript-section-renderer #button-container button"
      ),
    Yn = (e, t) => {
      if (t) {
        (e.style.zIndex = "-1"),
          (e.style.opacity = "0"),
          (e.style.animation = "none !important"),
          (e.style.top = "-100px"),
          (e.style.height = "120px"),
          (e.style.position = "absolute");
        const t = document.querySelector("#secondary-inner");
        t && ((t.style.animation = "none"), (t.style.transition = "none"));
        const r = document.querySelector("#upload-info");
        r && (r.style.zIndex = "1");
        const n = Xn();
        n?.click(),
          e?.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
      } else {
        const t = Zn();
        e?.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"),
          t?.click(),
          (e.style.top = "unset"),
          (e.style.zIndex = "600"),
          (e.style.height = "100%"),
          (e.style.position = "absolute"),
          (e.style.transition = "transform .15s ease-in-out"),
          (e.style.opacity = "1");
      }
    };
  const Qn = (e, t) => {
      if (t) {
        if (
          ((function () {
            if (!document.getElementById("clarify-globals")) {
              const e = document.createElement("style");
              (e.id = "clarify-globals"),
                (e.textContent =
                  '\n          ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"] {\n            position: absolute;\n            z-index: -1;\n          }\n        '),
                document.head.appendChild(e);
            }
          })(),
          ri())
        ) {
          const e = Xn();
          return void e?.click();
        }
        e?.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
      } else {
        const t = Zn();
        e?.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"),
          t?.click(),
          (function () {
            const e = document.getElementById("clarify-globals");
            e && e.remove();
          })();
      }
    },
    Jn = () => {
      const e = document.querySelectorAll(
        "ytd-transcript-search-panel-renderer ytd-transcript-segment-renderer yt-formatted-string"
      );
      return (
        (e &&
          Array.from(e)
            ?.map((e) => e.textContent)
            ?.join(" ")) ||
        null
      );
    },
    ei = () => {
      const e = document.querySelectorAll(
        "ytd-transcript-search-panel-renderer ytd-transcript-segment-renderer"
      );
      return e.length
        ? Array.from(e).map((e) => {
            const t = e.querySelector("yt-formatted-string"),
              r = e.querySelector(".segment-timestamp");
            return {
              text: t?.textContent?.trim() || "",
              offset: ti(r?.textContent?.trim() || ""),
            };
          })
        : null;
    };
  function ti(e) {
    if (!e) return 0;
    const t = e.split(":").map(Number);
    return 3 === t.length
      ? 3600 * t[0] + 60 * t[1] + t[2]
      : 2 === t.length
      ? 60 * t[0] + t[1]
      : 0;
  }
  const ri = () => "InstallTrigger" in window;
  async function ni(e, t, r) {
    return (
      t(r, !0),
      new Promise((n) => {
        let i = 0;
        const o = setInterval(() => {
          const s = e();
          i++, (s || i > 20) && (clearInterval(o), t(r, !1), n(s ?? null));
        }, 600);
      })
    );
  }
  function ii(e) {
    return e.replace(/\*/g, "");
  }
  const oi = /%%(.+?)%%/g;
  async function si(e) {
    return new Promise((t, r) => {
      chrome.runtime.sendMessage(e, (e) => {
        chrome.runtime.lastError || e.error
          ? r(chrome.runtime.lastError)
          : t(e);
      });
    });
  }
  "undefined" != typeof window &&
    ((window.__svelte ??= {}).v ??= new Set()).add("5"),
    (R = !0),
    W(),
    (li[F] = "src/lib/icons/SparkIcon.svelte");
  var ai = er(
    fr(
      '<svg aria-hidden="true" class="summarize-btn-icon svelte-1uxch7r" preserveAspectRatio="xMidYMid meet" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><defs class="svelte-1uxch7r"><linearGradient id="sparkGradientLeft" x1="0%" x2="100%" y1="0%" y2="0%" class="svelte-1uxch7r"><stop offset="0%" stop-color="#FF9EC1" class="svelte-1uxch7r"></stop><stop offset="100%" stop-color="#FF7EE3" class="svelte-1uxch7r"></stop></linearGradient><linearGradient id="sparkGradientCenter" x1="0%" x2="100%" y1="0%" y2="0%" class="svelte-1uxch7r"><stop offset="0%" stop-color="#E17CFF" class="svelte-1uxch7r"></stop><stop offset="50%" stop-color="#A07EFF" class="svelte-1uxch7r"></stop><stop offset="100%" stop-color="#8886FF" class="svelte-1uxch7r"></stop></linearGradient><linearGradient id="sparkGradientRight" x1="0%" x2="100%" y1="0%" y2="0%" class="svelte-1uxch7r"><stop offset="0%" stop-color="#7995FE" class="svelte-1uxch7r"></stop><stop offset="50%" stop-color="#51A6FF" class="svelte-1uxch7r"></stop><stop offset="100%" stop-color="#50C0FF" class="svelte-1uxch7r"></stop></linearGradient></defs><g id="SVGRepo_bgCarrier" stroke-width="0" class="svelte-1uxch7r"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" class="svelte-1uxch7r"></g><g id="SVGRepo_iconCarrier" class="svelte-1uxch7r"><path d="M210.3 65.5c28.8 7.3 51.4 29.9 58.7 58.7c.7 2.8 4.3 2.8 5 0c7.3-28.8 29.9-51.4 58.7-58.7c2.8-.7 2.8-4.3 0-5c-28.8-7.3-51.4-29.9-58.7-58.7c-.7-2.8-4.3-2.8-5 0c-7.3 28.8-29.9 51.4-58.7 58.7c-2.8.7-2.8 4.3 0 5z" fill="url(#sparkGradientLeft)"></path><path d="M6.7 188.3c50.8 12.9 90.8 52.9 103.7 103.7c1.2 4.9 7.5 4.9 8.8 0c12.9-50.8 52.9-90.8 103.7-103.7c4.9-1.2 4.9-7.5 0-8.8C172 166.7 132 126.7 119.2 75.9c-1.2-4.9-7.5-4.9-8.8 0c-12.9 50.8-52.9 90.8-103.7 103.7c-4.9 1.2-4.9 7.5 0 8.7z" fill="url(#sparkGradientCenter)"></path><path d="M180 350.7c76 19.3 135.9 79.1 155.1 155.1c1.9 7.3 11.3 7.3 13.1 0c19.3-76 79.1-135.9 155.1-155.1c7.3-1.9 7.3-11.3 0-13.1c-76-19.3-135.9-79.1-155.1-155.1c-1.9-7.3-11.3-7.3-13.1 0c-19.3 76-79.1 135.9-155.1 155.1c-7.3 1.8-7.3 11.2 0 13.1z" fill="url(#sparkGradientRight)"></path></g></svg>'
    ),
    li[F],
    [
      [
        44,
        0,
        [
          [
            46,
            4,
            [
              [
                47,
                8,
                [
                  [48, 12],
                  [49, 12],
                ],
              ],
              [
                51,
                8,
                [
                  [52, 12],
                  [53, 12],
                  [54, 12],
                ],
              ],
              [
                56,
                8,
                [
                  [57, 12],
                  [58, 12],
                  [59, 12],
                ],
              ],
            ],
          ],
          [62, 4],
          [63, 4],
          [
            64,
            4,
            [
              [65, 8],
              [68, 8],
              [71, 8],
            ],
          ],
        ],
      ],
    ]
  );
  function li(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "20px"),
      n = Tn(t, "height", 8, "20px");
    Tn(t, "fill", 8, "url(#sparkGradient)");
    let i = ve(!1),
      s = ve(!1),
      a = ve(!1);
    function l() {
      Ht(a) || Ht(s) || Ht(i)
        ? (ye(i, !1), ye(s, !1), ye(a, !1))
        : (setTimeout(() => {
            ye(i, !0);
          }, 0),
          setTimeout(() => {
            ye(s, !0);
          }, 400),
          setTimeout(() => {
            ye(a, !0);
          }, 800));
    }
    var c = ai(),
      u = Ne(Pe(c), 3),
      d = Pe(u),
      p = Ne(d),
      h = Ne(p);
    return (
      ze(() => {
        Xr(c, "height", n()),
          Xr(c, "width", r()),
          Hr(d, 0, Ht(i) ? "scaling" : "", "svelte-1uxch7r"),
          Hr(p, 0, Ht(s) ? "scaling" : "", "svelte-1uxch7r"),
          Hr(h, 0, Ht(a) ? "scaling" : "", "svelte-1uxch7r");
      }),
      vr(e, c),
      (function (e, t, r) {
        var n = o(e, t);
        n &&
          n.set &&
          ((e[t] = r),
          Be(() => {
            e[t] = null;
          }));
      })(t, "toggleAnimation", l),
      le({
        get toggleAnimation() {
          return l;
        },
        ...Er(),
      })
    );
  }
  function ci(e) {
    return e &&
      e.__esModule &&
      Object.prototype.hasOwnProperty.call(e, "default")
      ? e.default
      : e;
  }
  function ui(e) {
    return e &&
      Object.prototype.hasOwnProperty.call(e, "default") &&
      1 === Object.keys(e).length
      ? e.default
      : e;
  }
  K(li);
  var di,
    pi = {},
    hi = {},
    fi = {},
    gi = {},
    mi = {};
  function vi() {
    return (
      di ||
        ((di = 1),
        Object.defineProperty(mi, "__esModule", { value: !0 }),
        (mi.default = new Uint16Array(
          '\u1d41<\xd5\u0131\u028a\u049d\u057b\u05d0\u0675\u06de\u07a2\u07d6\u080f\u0a4a\u0a91\u0da1\u0e6d\u0f09\u0f26\u10ca\u1228\u12e1\u1415\u149d\u14c3\u14df\u1525\0\0\0\0\0\0\u156b\u16cd\u198d\u1c12\u1ddd\u1f7e\u2060\u21b0\u228d\u23c0\u23fb\u2442\u2824\u2912\u2d08\u2e48\u2fce\u3016\u32ba\u3639\u37ac\u38fe\u3a28\u3a71\u3ae0\u3b2e\u0800EMabcfglmnoprstu\\bfms\x7f\x84\x8b\x90\x95\x98\xa6\xb3\xb9\xc8\xcflig\u803b\xc6\u40c6P\u803b&\u4026cute\u803b\xc1\u40c1reve;\u4102\u0100iyx}rc\u803b\xc2\u40c2;\u4410r;\uc000\u{1d504}rave\u803b\xc0\u40c0pha;\u4391acr;\u4100d;\u6a53\u0100gp\x9d\xa1on;\u4104f;\uc000\u{1d538}plyFunction;\u6061ing\u803b\xc5\u40c5\u0100cs\xbe\xc3r;\uc000\u{1d49c}ign;\u6254ilde\u803b\xc3\u40c3ml\u803b\xc4\u40c4\u0400aceforsu\xe5\xfb\xfe\u0117\u011c\u0122\u0127\u012a\u0100cr\xea\xf2kslash;\u6216\u0176\xf6\xf8;\u6ae7ed;\u6306y;\u4411\u0180crt\u0105\u010b\u0114ause;\u6235noullis;\u612ca;\u4392r;\uc000\u{1d505}pf;\uc000\u{1d539}eve;\u42d8c\xf2\u0113mpeq;\u624e\u0700HOacdefhilorsu\u014d\u0151\u0156\u0180\u019e\u01a2\u01b5\u01b7\u01ba\u01dc\u0215\u0273\u0278\u027ecy;\u4427PY\u803b\xa9\u40a9\u0180cpy\u015d\u0162\u017aute;\u4106\u0100;i\u0167\u0168\u62d2talDifferentialD;\u6145leys;\u612d\u0200aeio\u0189\u018e\u0194\u0198ron;\u410cdil\u803b\xc7\u40c7rc;\u4108nint;\u6230ot;\u410a\u0100dn\u01a7\u01adilla;\u40b8terDot;\u40b7\xf2\u017fi;\u43a7rcle\u0200DMPT\u01c7\u01cb\u01d1\u01d6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01e2\u01f8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020foubleQuote;\u601duote;\u6019\u0200lnpu\u021e\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6a74\u0180git\u022f\u0236\u023aruent;\u6261nt;\u622fourIntegral;\u622e\u0100fr\u024c\u024e;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6a2fcr;\uc000\u{1d49e}p\u0100;C\u0284\u0285\u62d3ap;\u624d\u0580DJSZacefios\u02a0\u02ac\u02b0\u02b4\u02b8\u02cb\u02d7\u02e1\u02e6\u0333\u048d\u0100;o\u0179\u02a5trahd;\u6911cy;\u4402cy;\u4405cy;\u440f\u0180grs\u02bf\u02c4\u02c7ger;\u6021r;\u61a1hv;\u6ae4\u0100ay\u02d0\u02d5ron;\u410e;\u4414l\u0100;t\u02dd\u02de\u6207a;\u4394r;\uc000\u{1d507}\u0100af\u02eb\u0327\u0100cm\u02f0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031ccute;\u40b4o\u0174\u030b\u030d;\u42d9bleAcute;\u42ddrave;\u4060ilde;\u42dcond;\u62c4ferentialD;\u6146\u0470\u033d\0\0\0\u0342\u0354\0\u0405f;\uc000\u{1d53b}\u0180;DE\u0348\u0349\u034d\u40a8ot;\u60dcqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03cf\u03e2\u03f8ontourIntegra\xec\u0239o\u0274\u0379\0\0\u037b\xbb\u0349nArrow;\u61d3\u0100eo\u0387\u03a4ft\u0180ART\u0390\u0396\u03a1rrow;\u61d0ightArrow;\u61d4e\xe5\u02cang\u0100LR\u03ab\u03c4eft\u0100AR\u03b3\u03b9rrow;\u67f8ightArrow;\u67faightArrow;\u67f9ight\u0100AT\u03d8\u03derrow;\u61d2ee;\u62a8p\u0241\u03e9\0\0\u03efrrow;\u61d1ownArrow;\u61d5erticalBar;\u6225n\u0300ABLRTa\u0412\u042a\u0430\u045e\u047f\u037crrow\u0180;BU\u041d\u041e\u0422\u6193ar;\u6913pArrow;\u61f5reve;\u4311eft\u02d2\u043a\0\u0446\0\u0450ightVector;\u6950eeVector;\u695eector\u0100;B\u0459\u045a\u61bdar;\u6956ight\u01d4\u0467\0\u0471eeVector;\u695fector\u0100;B\u047a\u047b\u61c1ar;\u6957ee\u0100;A\u0486\u0487\u62a4rrow;\u61a7\u0100ct\u0492\u0497r;\uc000\u{1d49f}rok;\u4110\u0800NTacdfglmopqstux\u04bd\u04c0\u04c4\u04cb\u04de\u04e2\u04e7\u04ee\u04f5\u0521\u052f\u0536\u0552\u055d\u0560\u0565G;\u414aH\u803b\xd0\u40d0cute\u803b\xc9\u40c9\u0180aiy\u04d2\u04d7\u04dcron;\u411arc\u803b\xca\u40ca;\u442dot;\u4116r;\uc000\u{1d508}rave\u803b\xc8\u40c8ement;\u6208\u0100ap\u04fa\u04fecr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65fberySmallSquare;\u65ab\u0100gp\u0526\u052aon;\u4118f;\uc000\u{1d53c}silon;\u4395u\u0100ai\u053c\u0549l\u0100;T\u0542\u0543\u6a75ilde;\u6242librium;\u61cc\u0100ci\u0557\u055ar;\u6130m;\u6a73a;\u4397ml\u803b\xcb\u40cb\u0100ip\u056a\u056fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058d\u05b2\u05ccy;\u4424r;\uc000\u{1d509}lled\u0253\u0597\0\0\u05a3mallSquare;\u65fcerySmallSquare;\u65aa\u0370\u05ba\0\u05bf\0\0\u05c4f;\uc000\u{1d53d}All;\u6200riertrf;\u6131c\xf2\u05cb\u0600JTabcdfgorst\u05e8\u05ec\u05ef\u05fa\u0600\u0612\u0616\u061b\u061d\u0623\u066c\u0672cy;\u4403\u803b>\u403emma\u0100;d\u05f7\u05f8\u4393;\u43dcreve;\u411e\u0180eiy\u0607\u060c\u0610dil;\u4122rc;\u411c;\u4413ot;\u4120r;\uc000\u{1d50a};\u62d9pf;\uc000\u{1d53e}eater\u0300EFGLST\u0635\u0644\u064e\u0656\u065b\u0666qual\u0100;L\u063e\u063f\u6265ess;\u62dbullEqual;\u6267reater;\u6aa2ess;\u6277lantEqual;\u6a7eilde;\u6273cr;\uc000\u{1d4a2};\u626b\u0400Aacfiosu\u0685\u068b\u0696\u069b\u069e\u06aa\u06be\u06caRDcy;\u442a\u0100ct\u0690\u0694ek;\u42c7;\u405eirc;\u4124r;\u610clbertSpace;\u610b\u01f0\u06af\0\u06b2f;\u610dizontalLine;\u6500\u0100ct\u06c3\u06c5\xf2\u06a9rok;\u4126mp\u0144\u06d0\u06d8ownHum\xf0\u012fqual;\u624f\u0700EJOacdfgmnostu\u06fa\u06fe\u0703\u0707\u070e\u071a\u071e\u0721\u0728\u0744\u0778\u078b\u078f\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803b\xcd\u40cd\u0100iy\u0713\u0718rc\u803b\xce\u40ce;\u4418ot;\u4130r;\u6111rave\u803b\xcc\u40cc\u0180;ap\u0720\u072f\u073f\u0100cg\u0734\u0737r;\u412ainaryI;\u6148lie\xf3\u03dd\u01f4\u0749\0\u0762\u0100;e\u074d\u074e\u622c\u0100gr\u0753\u0758ral;\u622bsection;\u62c2isible\u0100CT\u076c\u0772omma;\u6063imes;\u6062\u0180gpt\u077f\u0783\u0788on;\u412ef;\uc000\u{1d540}a;\u4399cr;\u6110ilde;\u4128\u01eb\u079a\0\u079ecy;\u4406l\u803b\xcf\u40cf\u0280cfosu\u07ac\u07b7\u07bc\u07c2\u07d0\u0100iy\u07b1\u07b5rc;\u4134;\u4419r;\uc000\u{1d50d}pf;\uc000\u{1d541}\u01e3\u07c7\0\u07ccr;\uc000\u{1d4a5}rcy;\u4408kcy;\u4404\u0380HJacfos\u07e4\u07e8\u07ec\u07f1\u07fd\u0802\u0808cy;\u4425cy;\u440cppa;\u439a\u0100ey\u07f6\u07fbdil;\u4136;\u441ar;\uc000\u{1d50e}pf;\uc000\u{1d542}cr;\uc000\u{1d4a6}\u0580JTaceflmost\u0825\u0829\u082c\u0850\u0863\u09b3\u09b8\u09c7\u09cd\u0a37\u0a47cy;\u4409\u803b<\u403c\u0280cmnpr\u0837\u083c\u0841\u0844\u084dute;\u4139bda;\u439bg;\u67ealacetrf;\u6112r;\u619e\u0180aey\u0857\u085c\u0861ron;\u413ddil;\u413b;\u441b\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087e\u08a9\u08b1\u08e0\u08e6\u08fc\u092f\u095b\u0390\u096a\u0100nr\u0883\u088fgleBracket;\u67e8row\u0180;BR\u0899\u089a\u089e\u6190ar;\u61e4ightArrow;\u61c6eiling;\u6308o\u01f5\u08b7\0\u08c3bleBracket;\u67e6n\u01d4\u08c8\0\u08d2eeVector;\u6961ector\u0100;B\u08db\u08dc\u61c3ar;\u6959loor;\u630aight\u0100AV\u08ef\u08f5rrow;\u6194ector;\u694e\u0100er\u0901\u0917e\u0180;AV\u0909\u090a\u0910\u62a3rrow;\u61a4ector;\u695aiangle\u0180;BE\u0924\u0925\u0929\u62b2ar;\u69cfqual;\u62b4p\u0180DTV\u0937\u0942\u094cownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61bfar;\u6958ector\u0100;B\u0965\u0966\u61bcar;\u6952ight\xe1\u039cs\u0300EFGLST\u097e\u098b\u0995\u099d\u09a2\u09adqualGreater;\u62daullEqual;\u6266reater;\u6276ess;\u6aa1lantEqual;\u6a7dilde;\u6272r;\uc000\u{1d50f}\u0100;e\u09bd\u09be\u62d8ftarrow;\u61daidot;\u413f\u0180npw\u09d4\u0a16\u0a1bg\u0200LRlr\u09de\u09f7\u0a02\u0a10eft\u0100AR\u09e6\u09ecrrow;\u67f5ightArrow;\u67f7ightArrow;\u67f6eft\u0100ar\u03b3\u0a0aight\xe1\u03bfight\xe1\u03caf;\uc000\u{1d543}er\u0100LR\u0a22\u0a2ceftArrow;\u6199ightArrow;\u6198\u0180cht\u0a3e\u0a40\u0a42\xf2\u084c;\u61b0rok;\u4141;\u626a\u0400acefiosu\u0a5a\u0a5d\u0a60\u0a77\u0a7c\u0a85\u0a8b\u0a8ep;\u6905y;\u441c\u0100dl\u0a65\u0a6fiumSpace;\u605flintrf;\u6133r;\uc000\u{1d510}nusPlus;\u6213pf;\uc000\u{1d544}c\xf2\u0a76;\u439c\u0480Jacefostu\u0aa3\u0aa7\u0aad\u0ac0\u0b14\u0b19\u0d91\u0d97\u0d9ecy;\u440acute;\u4143\u0180aey\u0ab4\u0ab9\u0aberon;\u4147dil;\u4145;\u441d\u0180gsw\u0ac7\u0af0\u0b0eative\u0180MTV\u0ad3\u0adf\u0ae8ediumSpace;\u600bhi\u0100cn\u0ae6\u0ad8\xeb\u0ad9eryThi\xee\u0ad9ted\u0100GL\u0af8\u0b06reaterGreate\xf2\u0673essLes\xf3\u0a48Line;\u400ar;\uc000\u{1d511}\u0200Bnpt\u0b22\u0b28\u0b37\u0b3areak;\u6060BreakingSpace;\u40a0f;\u6115\u0680;CDEGHLNPRSTV\u0b55\u0b56\u0b6a\u0b7c\u0ba1\u0beb\u0c04\u0c5e\u0c84\u0ca6\u0cd8\u0d61\u0d85\u6aec\u0100ou\u0b5b\u0b64ngruent;\u6262pCap;\u626doubleVerticalBar;\u6226\u0180lqx\u0b83\u0b8a\u0b9bement;\u6209ual\u0100;T\u0b92\u0b93\u6260ilde;\uc000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0bb6\u0bb7\u0bbd\u0bc9\u0bd3\u0bd8\u0be5\u626fqual;\u6271ullEqual;\uc000\u2267\u0338reater;\uc000\u226b\u0338ess;\u6279lantEqual;\uc000\u2a7e\u0338ilde;\u6275ump\u0144\u0bf2\u0bfdownHump;\uc000\u224e\u0338qual;\uc000\u224f\u0338e\u0100fs\u0c0a\u0c27tTriangle\u0180;BE\u0c1a\u0c1b\u0c21\u62eaar;\uc000\u29cf\u0338qual;\u62ecs\u0300;EGLST\u0c35\u0c36\u0c3c\u0c44\u0c4b\u0c58\u626equal;\u6270reater;\u6278ess;\uc000\u226a\u0338lantEqual;\uc000\u2a7d\u0338ilde;\u6274ested\u0100GL\u0c68\u0c79reaterGreater;\uc000\u2aa2\u0338essLess;\uc000\u2aa1\u0338recedes\u0180;ES\u0c92\u0c93\u0c9b\u6280qual;\uc000\u2aaf\u0338lantEqual;\u62e0\u0100ei\u0cab\u0cb9verseElement;\u620cghtTriangle\u0180;BE\u0ccb\u0ccc\u0cd2\u62ebar;\uc000\u29d0\u0338qual;\u62ed\u0100qu\u0cdd\u0d0cuareSu\u0100bp\u0ce8\u0cf9set\u0100;E\u0cf0\u0cf3\uc000\u228f\u0338qual;\u62e2erset\u0100;E\u0d03\u0d06\uc000\u2290\u0338qual;\u62e3\u0180bcp\u0d13\u0d24\u0d4eset\u0100;E\u0d1b\u0d1e\uc000\u2282\u20d2qual;\u6288ceeds\u0200;EST\u0d32\u0d33\u0d3b\u0d46\u6281qual;\uc000\u2ab0\u0338lantEqual;\u62e1ilde;\uc000\u227f\u0338erset\u0100;E\u0d58\u0d5b\uc000\u2283\u20d2qual;\u6289ilde\u0200;EFT\u0d6e\u0d6f\u0d75\u0d7f\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uc000\u{1d4a9}ilde\u803b\xd1\u40d1;\u439d\u0700Eacdfgmoprstuv\u0dbd\u0dc2\u0dc9\u0dd5\u0ddb\u0de0\u0de7\u0dfc\u0e02\u0e20\u0e22\u0e32\u0e3f\u0e44lig;\u4152cute\u803b\xd3\u40d3\u0100iy\u0dce\u0dd3rc\u803b\xd4\u40d4;\u441eblac;\u4150r;\uc000\u{1d512}rave\u803b\xd2\u40d2\u0180aei\u0dee\u0df2\u0df6cr;\u414cga;\u43a9cron;\u439fpf;\uc000\u{1d546}enCurly\u0100DQ\u0e0e\u0e1aoubleQuote;\u601cuote;\u6018;\u6a54\u0100cl\u0e27\u0e2cr;\uc000\u{1d4aa}ash\u803b\xd8\u40d8i\u016c\u0e37\u0e3cde\u803b\xd5\u40d5es;\u6a37ml\u803b\xd6\u40d6er\u0100BP\u0e4b\u0e60\u0100ar\u0e50\u0e53r;\u603eac\u0100ek\u0e5a\u0e5c;\u63deet;\u63b4arenthesis;\u63dc\u0480acfhilors\u0e7f\u0e87\u0e8a\u0e8f\u0e92\u0e94\u0e9d\u0eb0\u0efcrtialD;\u6202y;\u441fr;\uc000\u{1d513}i;\u43a6;\u43a0usMinus;\u40b1\u0100ip\u0ea2\u0eadncareplan\xe5\u069df;\u6119\u0200;eio\u0eb9\u0eba\u0ee0\u0ee4\u6abbcedes\u0200;EST\u0ec8\u0ec9\u0ecf\u0eda\u627aqual;\u6aaflantEqual;\u627cilde;\u627eme;\u6033\u0100dp\u0ee9\u0eeeuct;\u620fortion\u0100;a\u0225\u0ef9l;\u621d\u0100ci\u0f01\u0f06r;\uc000\u{1d4ab};\u43a8\u0200Ufos\u0f11\u0f16\u0f1b\u0f1fOT\u803b"\u4022r;\uc000\u{1d514}pf;\u611acr;\uc000\u{1d4ac}\u0600BEacefhiorsu\u0f3e\u0f43\u0f47\u0f60\u0f73\u0fa7\u0faa\u0fad\u1096\u10a9\u10b4\u10bearr;\u6910G\u803b\xae\u40ae\u0180cnr\u0f4e\u0f53\u0f56ute;\u4154g;\u67ebr\u0100;t\u0f5c\u0f5d\u61a0l;\u6916\u0180aey\u0f67\u0f6c\u0f71ron;\u4158dil;\u4156;\u4420\u0100;v\u0f78\u0f79\u611cerse\u0100EU\u0f82\u0f99\u0100lq\u0f87\u0f8eement;\u620builibrium;\u61cbpEquilibrium;\u696fr\xbb\u0f79o;\u43a1ght\u0400ACDFTUVa\u0fc1\u0feb\u0ff3\u1022\u1028\u105b\u1087\u03d8\u0100nr\u0fc6\u0fd2gleBracket;\u67e9row\u0180;BL\u0fdc\u0fdd\u0fe1\u6192ar;\u61e5eftArrow;\u61c4eiling;\u6309o\u01f5\u0ff9\0\u1005bleBracket;\u67e7n\u01d4\u100a\0\u1014eeVector;\u695dector\u0100;B\u101d\u101e\u61c2ar;\u6955loor;\u630b\u0100er\u102d\u1043e\u0180;AV\u1035\u1036\u103c\u62a2rrow;\u61a6ector;\u695biangle\u0180;BE\u1050\u1051\u1055\u62b3ar;\u69d0qual;\u62b5p\u0180DTV\u1063\u106e\u1078ownVector;\u694feeVector;\u695cector\u0100;B\u1082\u1083\u61bear;\u6954ector\u0100;B\u1091\u1092\u61c0ar;\u6953\u0100pu\u109b\u109ef;\u611dndImplies;\u6970ightarrow;\u61db\u0100ch\u10b9\u10bcr;\u611b;\u61b1leDelayed;\u69f4\u0680HOacfhimoqstu\u10e4\u10f1\u10f7\u10fd\u1119\u111e\u1151\u1156\u1161\u1167\u11b5\u11bb\u11bf\u0100Cc\u10e9\u10eeHcy;\u4429y;\u4428FTcy;\u442ccute;\u415a\u0280;aeiy\u1108\u1109\u110e\u1113\u1117\u6abcron;\u4160dil;\u415erc;\u415c;\u4421r;\uc000\u{1d516}ort\u0200DLRU\u112a\u1134\u113e\u1149ownArrow\xbb\u041eeftArrow\xbb\u089aightArrow\xbb\u0fddpArrow;\u6191gma;\u43a3allCircle;\u6218pf;\uc000\u{1d54a}\u0272\u116d\0\0\u1170t;\u621aare\u0200;ISU\u117b\u117c\u1189\u11af\u65a1ntersection;\u6293u\u0100bp\u118f\u119eset\u0100;E\u1197\u1198\u628fqual;\u6291erset\u0100;E\u11a8\u11a9\u6290qual;\u6292nion;\u6294cr;\uc000\u{1d4ae}ar;\u62c6\u0200bcmp\u11c8\u11db\u1209\u120b\u0100;s\u11cd\u11ce\u62d0et\u0100;E\u11cd\u11d5qual;\u6286\u0100ch\u11e0\u1205eeds\u0200;EST\u11ed\u11ee\u11f4\u11ff\u627bqual;\u6ab0lantEqual;\u627dilde;\u627fTh\xe1\u0f8c;\u6211\u0180;es\u1212\u1213\u1223\u62d1rset\u0100;E\u121c\u121d\u6283qual;\u6287et\xbb\u1213\u0580HRSacfhiors\u123e\u1244\u1249\u1255\u125e\u1271\u1276\u129f\u12c2\u12c8\u12d1ORN\u803b\xde\u40deADE;\u6122\u0100Hc\u124e\u1252cy;\u440by;\u4426\u0100bu\u125a\u125c;\u4009;\u43a4\u0180aey\u1265\u126a\u126fron;\u4164dil;\u4162;\u4422r;\uc000\u{1d517}\u0100ei\u127b\u1289\u01f2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128e\u1298kSpace;\uc000\u205f\u200aSpace;\u6009lde\u0200;EFT\u12ab\u12ac\u12b2\u12bc\u623cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uc000\u{1d54b}ipleDot;\u60db\u0100ct\u12d6\u12dbr;\uc000\u{1d4af}rok;\u4166\u0ae1\u12f7\u130e\u131a\u1326\0\u132c\u1331\0\0\0\0\0\u1338\u133d\u1377\u1385\0\u13ff\u1404\u140a\u1410\u0100cr\u12fb\u1301ute\u803b\xda\u40dar\u0100;o\u1307\u1308\u619fcir;\u6949r\u01e3\u1313\0\u1316y;\u440eve;\u416c\u0100iy\u131e\u1323rc\u803b\xdb\u40db;\u4423blac;\u4170r;\uc000\u{1d518}rave\u803b\xd9\u40d9acr;\u416a\u0100di\u1341\u1369er\u0100BP\u1348\u135d\u0100ar\u134d\u1350r;\u405fac\u0100ek\u1357\u1359;\u63dfet;\u63b5arenthesis;\u63ddon\u0100;P\u1370\u1371\u62c3lus;\u628e\u0100gp\u137b\u137fon;\u4172f;\uc000\u{1d54c}\u0400ADETadps\u1395\u13ae\u13b8\u13c4\u03e8\u13d2\u13d7\u13f3rrow\u0180;BD\u1150\u13a0\u13a4ar;\u6912ownArrow;\u61c5ownArrow;\u6195quilibrium;\u696eee\u0100;A\u13cb\u13cc\u62a5rrow;\u61a5own\xe1\u03f3er\u0100LR\u13de\u13e8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13f9\u13fa\u43d2on;\u43a5ing;\u416ecr;\uc000\u{1d4b0}ilde;\u4168ml\u803b\xdc\u40dc\u0480Dbcdefosv\u1427\u142c\u1430\u1433\u143e\u1485\u148a\u1490\u1496ash;\u62abar;\u6aeby;\u4412ash\u0100;l\u143b\u143c\u62a9;\u6ae6\u0100er\u1443\u1445;\u62c1\u0180bty\u144c\u1450\u147aar;\u6016\u0100;i\u144f\u1455cal\u0200BLST\u1461\u1465\u146a\u1474ar;\u6223ine;\u407ceparator;\u6758ilde;\u6240ThinSpace;\u600ar;\uc000\u{1d519}pf;\uc000\u{1d54d}cr;\uc000\u{1d4b1}dash;\u62aa\u0280cefos\u14a7\u14ac\u14b1\u14b6\u14bcirc;\u4174dge;\u62c0r;\uc000\u{1d51a}pf;\uc000\u{1d54e}cr;\uc000\u{1d4b2}\u0200fios\u14cb\u14d0\u14d2\u14d8r;\uc000\u{1d51b};\u439epf;\uc000\u{1d54f}cr;\uc000\u{1d4b3}\u0480AIUacfosu\u14f1\u14f5\u14f9\u14fd\u1504\u150f\u1514\u151a\u1520cy;\u442fcy;\u4407cy;\u442ecute\u803b\xdd\u40dd\u0100iy\u1509\u150drc;\u4176;\u442br;\uc000\u{1d51c}pf;\uc000\u{1d550}cr;\uc000\u{1d4b4}ml;\u4178\u0400Hacdefos\u1535\u1539\u153f\u154b\u154f\u155d\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417d;\u4417ot;\u417b\u01f2\u1554\0\u155boWidt\xe8\u0ad9a;\u4396r;\u6128pf;\u6124cr;\uc000\u{1d4b5}\u0be1\u1583\u158a\u1590\0\u15b0\u15b6\u15bf\0\0\0\0\u15c6\u15db\u15eb\u165f\u166d\0\u1695\u169b\u16b2\u16b9\0\u16becute\u803b\xe1\u40e1reve;\u4103\u0300;Ediuy\u159c\u159d\u15a1\u15a3\u15a8\u15ad\u623e;\uc000\u223e\u0333;\u623frc\u803b\xe2\u40e2te\u80bb\xb4\u0306;\u4430lig\u803b\xe6\u40e6\u0100;r\xb2\u15ba;\uc000\u{1d51e}rave\u803b\xe0\u40e0\u0100ep\u15ca\u15d6\u0100fp\u15cf\u15d4sym;\u6135\xe8\u15d3ha;\u43b1\u0100ap\u15dfc\u0100cl\u15e4\u15e7r;\u4101g;\u6a3f\u0264\u15f0\0\0\u160a\u0280;adsv\u15fa\u15fb\u15ff\u1601\u1607\u6227nd;\u6a55;\u6a5clope;\u6a58;\u6a5a\u0380;elmrsz\u1618\u1619\u161b\u161e\u163f\u164f\u1659\u6220;\u69a4e\xbb\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163a\u163c\u163e;\u69a8;\u69a9;\u69aa;\u69ab;\u69ac;\u69ad;\u69ae;\u69aft\u0100;v\u1645\u1646\u621fb\u0100;d\u164c\u164d\u62be;\u699d\u0100pt\u1654\u1657h;\u6222\xbb\xb9arr;\u637c\u0100gp\u1663\u1667on;\u4105f;\uc000\u{1d552}\u0380;Eaeiop\u12c1\u167b\u167d\u1682\u1684\u1687\u168a;\u6a70cir;\u6a6f;\u624ad;\u624bs;\u4027rox\u0100;e\u12c1\u1692\xf1\u1683ing\u803b\xe5\u40e5\u0180cty\u16a1\u16a6\u16a8r;\uc000\u{1d4b6};\u402amp\u0100;e\u12c1\u16af\xf1\u0288ilde\u803b\xe3\u40e3ml\u803b\xe4\u40e4\u0100ci\u16c2\u16c8onin\xf4\u0272nt;\u6a11\u0800Nabcdefiklnoprsu\u16ed\u16f1\u1730\u173c\u1743\u1748\u1778\u177d\u17e0\u17e6\u1839\u1850\u170d\u193d\u1948\u1970ot;\u6aed\u0100cr\u16f6\u171ek\u0200ceps\u1700\u1705\u170d\u1713ong;\u624cpsilon;\u43f6rime;\u6035im\u0100;e\u171a\u171b\u623dq;\u62cd\u0176\u1722\u1726ee;\u62bded\u0100;g\u172c\u172d\u6305e\xbb\u172drk\u0100;t\u135c\u1737brk;\u63b6\u0100oy\u1701\u1741;\u4431quo;\u601e\u0280cmprt\u1753\u175b\u1761\u1764\u1768aus\u0100;e\u010a\u0109ptyv;\u69b0s\xe9\u170cno\xf5\u0113\u0180ahw\u176f\u1771\u1773;\u43b2;\u6136een;\u626cr;\uc000\u{1d51f}g\u0380costuvw\u178d\u179d\u17b3\u17c1\u17d5\u17db\u17de\u0180aiu\u1794\u1796\u179a\xf0\u0760rc;\u65efp\xbb\u1371\u0180dpt\u17a4\u17a8\u17adot;\u6a00lus;\u6a01imes;\u6a02\u0271\u17b9\0\0\u17becup;\u6a06ar;\u6605riangle\u0100du\u17cd\u17d2own;\u65bdp;\u65b3plus;\u6a04e\xe5\u1444\xe5\u14adarow;\u690d\u0180ako\u17ed\u1826\u1835\u0100cn\u17f2\u1823k\u0180lst\u17fa\u05ab\u1802ozenge;\u69ebriangle\u0200;dlr\u1812\u1813\u1818\u181d\u65b4own;\u65beeft;\u65c2ight;\u65b8k;\u6423\u01b1\u182b\0\u1833\u01b2\u182f\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183e\u184d\u0100;q\u1843\u1846\uc000=\u20e5uiv;\uc000\u2261\u20e5t;\u6310\u0200ptwx\u1859\u185e\u1867\u186cf;\uc000\u{1d553}\u0100;t\u13cb\u1863om\xbb\u13cctie;\u62c8\u0600DHUVbdhmptuv\u1885\u1896\u18aa\u18bb\u18d7\u18db\u18ec\u18ff\u1905\u190a\u1910\u1921\u0200LRlr\u188e\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18a1\u18a2\u18a4\u18a6\u18a8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18b3\u18b5\u18b7\u18b9;\u655d;\u655a;\u655c;\u6559\u0380;HLRhlr\u18ca\u18cb\u18cd\u18cf\u18d1\u18d3\u18d5\u6551;\u656c;\u6563;\u6560;\u656b;\u6562;\u655fox;\u69c9\u0200LRlr\u18e4\u18e6\u18e8\u18ea;\u6555;\u6552;\u6510;\u650c\u0280;DUdu\u06bd\u18f7\u18f9\u18fb\u18fd;\u6565;\u6568;\u652c;\u6534inus;\u629flus;\u629eimes;\u62a0\u0200LRlr\u1919\u191b\u191d\u191f;\u655b;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193b\u6502;\u656a;\u6561;\u655e;\u653c;\u6524;\u651c\u0100ev\u0123\u1942bar\u803b\xa6\u40a6\u0200ceio\u1951\u1956\u195a\u1960r;\uc000\u{1d4b7}mi;\u604fm\u0100;e\u171a\u171cl\u0180;bh\u1968\u1969\u196b\u405c;\u69c5sub;\u67c8\u016c\u1974\u197el\u0100;e\u1979\u197a\u6022t\xbb\u197ap\u0180;Ee\u012f\u1985\u1987;\u6aae\u0100;q\u06dc\u06db\u0ce1\u19a7\0\u19e8\u1a11\u1a15\u1a32\0\u1a37\u1a50\0\0\u1ab4\0\0\u1ac1\0\0\u1b21\u1b2e\u1b4d\u1b52\0\u1bfd\0\u1c0c\u0180cpr\u19ad\u19b2\u19ddute;\u4107\u0300;abcds\u19bf\u19c0\u19c4\u19ca\u19d5\u19d9\u6229nd;\u6a44rcup;\u6a49\u0100au\u19cf\u19d2p;\u6a4bp;\u6a47ot;\u6a40;\uc000\u2229\ufe00\u0100eo\u19e2\u19e5t;\u6041\xee\u0693\u0200aeiu\u19f0\u19fb\u1a01\u1a05\u01f0\u19f5\0\u19f8s;\u6a4don;\u410ddil\u803b\xe7\u40e7rc;\u4109ps\u0100;s\u1a0c\u1a0d\u6a4cm;\u6a50ot;\u410b\u0180dmn\u1a1b\u1a20\u1a26il\u80bb\xb8\u01adptyv;\u69b2t\u8100\xa2;e\u1a2d\u1a2e\u40a2r\xe4\u01b2r;\uc000\u{1d520}\u0180cei\u1a3d\u1a40\u1a4dy;\u4447ck\u0100;m\u1a47\u1a48\u6713ark\xbb\u1a48;\u43c7r\u0380;Ecefms\u1a5f\u1a60\u1a62\u1a6b\u1aa4\u1aaa\u1aae\u65cb;\u69c3\u0180;el\u1a69\u1a6a\u1a6d\u42c6q;\u6257e\u0261\u1a74\0\0\u1a88rrow\u0100lr\u1a7c\u1a81eft;\u61baight;\u61bb\u0280RSacd\u1a92\u1a94\u1a96\u1a9a\u1a9f\xbb\u0f47;\u64c8st;\u629birc;\u629aash;\u629dnint;\u6a10id;\u6aefcir;\u69c2ubs\u0100;u\u1abb\u1abc\u6663it\xbb\u1abc\u02ec\u1ac7\u1ad4\u1afa\0\u1b0aon\u0100;e\u1acd\u1ace\u403a\u0100;q\xc7\xc6\u026d\u1ad9\0\0\u1ae2a\u0100;t\u1ade\u1adf\u402c;\u4040\u0180;fl\u1ae8\u1ae9\u1aeb\u6201\xee\u1160e\u0100mx\u1af1\u1af6ent\xbb\u1ae9e\xf3\u024d\u01e7\u1afe\0\u1b07\u0100;d\u12bb\u1b02ot;\u6a6dn\xf4\u0246\u0180fry\u1b10\u1b14\u1b17;\uc000\u{1d554}o\xe4\u0254\u8100\xa9;s\u0155\u1b1dr;\u6117\u0100ao\u1b25\u1b29rr;\u61b5ss;\u6717\u0100cu\u1b32\u1b37r;\uc000\u{1d4b8}\u0100bp\u1b3c\u1b44\u0100;e\u1b41\u1b42\u6acf;\u6ad1\u0100;e\u1b49\u1b4a\u6ad0;\u6ad2dot;\u62ef\u0380delprvw\u1b60\u1b6c\u1b77\u1b82\u1bac\u1bd4\u1bf9arr\u0100lr\u1b68\u1b6a;\u6938;\u6935\u0270\u1b72\0\0\u1b75r;\u62dec;\u62dfarr\u0100;p\u1b7f\u1b80\u61b6;\u693d\u0300;bcdos\u1b8f\u1b90\u1b96\u1ba1\u1ba5\u1ba8\u622arcap;\u6a48\u0100au\u1b9b\u1b9ep;\u6a46p;\u6a4aot;\u628dr;\u6a45;\uc000\u222a\ufe00\u0200alrv\u1bb5\u1bbf\u1bde\u1be3rr\u0100;m\u1bbc\u1bbd\u61b7;\u693cy\u0180evw\u1bc7\u1bd4\u1bd8q\u0270\u1bce\0\0\u1bd2re\xe3\u1b73u\xe3\u1b75ee;\u62ceedge;\u62cfen\u803b\xa4\u40a4earrow\u0100lr\u1bee\u1bf3eft\xbb\u1b80ight\xbb\u1bbde\xe4\u1bdd\u0100ci\u1c01\u1c07onin\xf4\u01f7nt;\u6231lcty;\u632d\u0980AHabcdefhijlorstuwz\u1c38\u1c3b\u1c3f\u1c5d\u1c69\u1c75\u1c8a\u1c9e\u1cac\u1cb7\u1cfb\u1cff\u1d0d\u1d7b\u1d91\u1dab\u1dbb\u1dc6\u1dcdr\xf2\u0381ar;\u6965\u0200glrs\u1c48\u1c4d\u1c52\u1c54ger;\u6020eth;\u6138\xf2\u1133h\u0100;v\u1c5a\u1c5b\u6010\xbb\u090a\u016b\u1c61\u1c67arow;\u690fa\xe3\u0315\u0100ay\u1c6e\u1c73ron;\u410f;\u4434\u0180;ao\u0332\u1c7c\u1c84\u0100gr\u02bf\u1c81r;\u61catseq;\u6a77\u0180glm\u1c91\u1c94\u1c98\u803b\xb0\u40b0ta;\u43b4ptyv;\u69b1\u0100ir\u1ca3\u1ca8sht;\u697f;\uc000\u{1d521}ar\u0100lr\u1cb3\u1cb5\xbb\u08dc\xbb\u101e\u0280aegsv\u1cc2\u0378\u1cd6\u1cdc\u1ce0m\u0180;os\u0326\u1cca\u1cd4nd\u0100;s\u0326\u1cd1uit;\u6666amma;\u43ddin;\u62f2\u0180;io\u1ce7\u1ce8\u1cf8\u40f7de\u8100\xf7;o\u1ce7\u1cf0ntimes;\u62c7n\xf8\u1cf7cy;\u4452c\u026f\u1d06\0\0\u1d0arn;\u631eop;\u630d\u0280lptuw\u1d18\u1d1d\u1d22\u1d49\u1d55lar;\u4024f;\uc000\u{1d555}\u0280;emps\u030b\u1d2d\u1d37\u1d3d\u1d42q\u0100;d\u0352\u1d33ot;\u6251inus;\u6238lus;\u6214quare;\u62a1blebarwedg\xe5\xfan\u0180adh\u112e\u1d5d\u1d67ownarrow\xf3\u1c83arpoon\u0100lr\u1d72\u1d76ef\xf4\u1cb4igh\xf4\u1cb6\u0162\u1d7f\u1d85karo\xf7\u0f42\u026f\u1d8a\0\0\u1d8ern;\u631fop;\u630c\u0180cot\u1d98\u1da3\u1da6\u0100ry\u1d9d\u1da1;\uc000\u{1d4b9};\u4455l;\u69f6rok;\u4111\u0100dr\u1db0\u1db4ot;\u62f1i\u0100;f\u1dba\u1816\u65bf\u0100ah\u1dc0\u1dc3r\xf2\u0429a\xf2\u0fa6angle;\u69a6\u0100ci\u1dd2\u1dd5y;\u445fgrarr;\u67ff\u0900Dacdefglmnopqrstux\u1e01\u1e09\u1e19\u1e38\u0578\u1e3c\u1e49\u1e61\u1e7e\u1ea5\u1eaf\u1ebd\u1ee1\u1f2a\u1f37\u1f44\u1f4e\u1f5a\u0100Do\u1e06\u1d34o\xf4\u1c89\u0100cs\u1e0e\u1e14ute\u803b\xe9\u40e9ter;\u6a6e\u0200aioy\u1e22\u1e27\u1e31\u1e36ron;\u411br\u0100;c\u1e2d\u1e2e\u6256\u803b\xea\u40ealon;\u6255;\u444dot;\u4117\u0100Dr\u1e41\u1e45ot;\u6252;\uc000\u{1d522}\u0180;rs\u1e50\u1e51\u1e57\u6a9aave\u803b\xe8\u40e8\u0100;d\u1e5c\u1e5d\u6a96ot;\u6a98\u0200;ils\u1e6a\u1e6b\u1e72\u1e74\u6a99nters;\u63e7;\u6113\u0100;d\u1e79\u1e7a\u6a95ot;\u6a97\u0180aps\u1e85\u1e89\u1e97cr;\u4113ty\u0180;sv\u1e92\u1e93\u1e95\u6205et\xbb\u1e93p\u01001;\u1e9d\u1ea4\u0133\u1ea1\u1ea3;\u6004;\u6005\u6003\u0100gs\u1eaa\u1eac;\u414bp;\u6002\u0100gp\u1eb4\u1eb8on;\u4119f;\uc000\u{1d556}\u0180als\u1ec4\u1ece\u1ed2r\u0100;s\u1eca\u1ecb\u62d5l;\u69e3us;\u6a71i\u0180;lv\u1eda\u1edb\u1edf\u43b5on\xbb\u1edb;\u43f5\u0200csuv\u1eea\u1ef3\u1f0b\u1f23\u0100io\u1eef\u1e31rc\xbb\u1e2e\u0269\u1ef9\0\0\u1efb\xed\u0548ant\u0100gl\u1f02\u1f06tr\xbb\u1e5dess\xbb\u1e7a\u0180aei\u1f12\u1f16\u1f1als;\u403dst;\u625fv\u0100;D\u0235\u1f20D;\u6a78parsl;\u69e5\u0100Da\u1f2f\u1f33ot;\u6253rr;\u6971\u0180cdi\u1f3e\u1f41\u1ef8r;\u612fo\xf4\u0352\u0100ah\u1f49\u1f4b;\u43b7\u803b\xf0\u40f0\u0100mr\u1f53\u1f57l\u803b\xeb\u40ebo;\u60ac\u0180cip\u1f61\u1f64\u1f67l;\u4021s\xf4\u056e\u0100eo\u1f6c\u1f74ctatio\xee\u0559nential\xe5\u0579\u09e1\u1f92\0\u1f9e\0\u1fa1\u1fa7\0\0\u1fc6\u1fcc\0\u1fd3\0\u1fe6\u1fea\u2000\0\u2008\u205allingdotse\xf1\u1e44y;\u4444male;\u6640\u0180ilr\u1fad\u1fb3\u1fc1lig;\u8000\ufb03\u0269\u1fb9\0\0\u1fbdg;\u8000\ufb00ig;\u8000\ufb04;\uc000\u{1d523}lig;\u8000\ufb01lig;\uc000fj\u0180alt\u1fd9\u1fdc\u1fe1t;\u666dig;\u8000\ufb02ns;\u65b1of;\u4192\u01f0\u1fee\0\u1ff3f;\uc000\u{1d557}\u0100ak\u05bf\u1ff7\u0100;v\u1ffc\u1ffd\u62d4;\u6ad9artint;\u6a0d\u0100ao\u200c\u2055\u0100cs\u2011\u2052\u03b1\u201a\u2030\u2038\u2045\u2048\0\u2050\u03b2\u2022\u2025\u2027\u202a\u202c\0\u202e\u803b\xbd\u40bd;\u6153\u803b\xbc\u40bc;\u6155;\u6159;\u615b\u01b3\u2034\0\u2036;\u6154;\u6156\u02b4\u203e\u2041\0\0\u2043\u803b\xbe\u40be;\u6157;\u615c5;\u6158\u01b6\u204c\0\u204e;\u615a;\u615d8;\u615el;\u6044wn;\u6322cr;\uc000\u{1d4bb}\u0880Eabcdefgijlnorstv\u2082\u2089\u209f\u20a5\u20b0\u20b4\u20f0\u20f5\u20fa\u20ff\u2103\u2112\u2138\u0317\u213e\u2152\u219e\u0100;l\u064d\u2087;\u6a8c\u0180cmp\u2090\u2095\u209dute;\u41f5ma\u0100;d\u209c\u1cda\u43b3;\u6a86reve;\u411f\u0100iy\u20aa\u20aerc;\u411d;\u4433ot;\u4121\u0200;lqs\u063e\u0642\u20bd\u20c9\u0180;qs\u063e\u064c\u20c4lan\xf4\u0665\u0200;cdl\u0665\u20d2\u20d5\u20e5c;\u6aa9ot\u0100;o\u20dc\u20dd\u6a80\u0100;l\u20e2\u20e3\u6a82;\u6a84\u0100;e\u20ea\u20ed\uc000\u22db\ufe00s;\u6a94r;\uc000\u{1d524}\u0100;g\u0673\u061bmel;\u6137cy;\u4453\u0200;Eaj\u065a\u210c\u210e\u2110;\u6a92;\u6aa5;\u6aa4\u0200Eaes\u211b\u211d\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6a8arox\xbb\u2124\u0100;q\u212e\u212f\u6a88\u0100;q\u212e\u211bim;\u62e7pf;\uc000\u{1d558}\u0100ci\u2143\u2146r;\u610am\u0180;el\u066b\u214e\u2150;\u6a8e;\u6a90\u8300>;cdlqr\u05ee\u2160\u216a\u216e\u2173\u2179\u0100ci\u2165\u2167;\u6aa7r;\u6a7aot;\u62d7Par;\u6995uest;\u6a7c\u0280adels\u2184\u216a\u2190\u0656\u219b\u01f0\u2189\0\u218epro\xf8\u209er;\u6978q\u0100lq\u063f\u2196les\xf3\u2088i\xed\u066b\u0100en\u21a3\u21adrtneqq;\uc000\u2269\ufe00\xc5\u21aa\u0500Aabcefkosy\u21c4\u21c7\u21f1\u21f5\u21fa\u2218\u221d\u222f\u2268\u227dr\xf2\u03a0\u0200ilmr\u21d0\u21d4\u21d7\u21dbrs\xf0\u1484f\xbb\u2024il\xf4\u06a9\u0100dr\u21e0\u21e4cy;\u444a\u0180;cw\u08f4\u21eb\u21efir;\u6948;\u61adar;\u610firc;\u4125\u0180alr\u2201\u220e\u2213rts\u0100;u\u2209\u220a\u6665it\xbb\u220alip;\u6026con;\u62b9r;\uc000\u{1d525}s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223a\u223e\u2243\u225e\u2263rr;\u61fftht;\u623bk\u0100lr\u2249\u2253eftarrow;\u61a9ightarrow;\u61aaf;\uc000\u{1d559}bar;\u6015\u0180clt\u226f\u2274\u2278r;\uc000\u{1d4bd}as\xe8\u21f4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xbb\u1c5b\u0ae1\u22a3\0\u22aa\0\u22b8\u22c5\u22ce\0\u22d5\u22f3\0\0\u22f8\u2322\u2367\u2362\u237f\0\u2386\u23aa\u23b4cute\u803b\xed\u40ed\u0180;iy\u0771\u22b0\u22b5rc\u803b\xee\u40ee;\u4438\u0100cx\u22bc\u22bfy;\u4435cl\u803b\xa1\u40a1\u0100fr\u039f\u22c9;\uc000\u{1d526}rave\u803b\xec\u40ec\u0200;ino\u073e\u22dd\u22e9\u22ee\u0100in\u22e2\u22e6nt;\u6a0ct;\u622dfin;\u69dcta;\u6129lig;\u4133\u0180aop\u22fe\u231a\u231d\u0180cgt\u2305\u2308\u2317r;\u412b\u0180elp\u071f\u230f\u2313in\xe5\u078ear\xf4\u0720h;\u4131f;\u62b7ed;\u41b5\u0280;cfot\u04f4\u232c\u2331\u233d\u2341are;\u6105in\u0100;t\u2338\u2339\u621eie;\u69dddo\xf4\u2319\u0280;celp\u0757\u234c\u2350\u235b\u2361al;\u62ba\u0100gr\u2355\u2359er\xf3\u1563\xe3\u234darhk;\u6a17rod;\u6a3c\u0200cgpt\u236f\u2372\u2376\u237by;\u4451on;\u412ff;\uc000\u{1d55a}a;\u43b9uest\u803b\xbf\u40bf\u0100ci\u238a\u238fr;\uc000\u{1d4be}n\u0280;Edsv\u04f4\u239b\u239d\u23a1\u04f3;\u62f9ot;\u62f5\u0100;v\u23a6\u23a7\u62f4;\u62f3\u0100;i\u0777\u23aelde;\u4129\u01eb\u23b8\0\u23bccy;\u4456l\u803b\xef\u40ef\u0300cfmosu\u23cc\u23d7\u23dc\u23e1\u23e7\u23f5\u0100iy\u23d1\u23d5rc;\u4135;\u4439r;\uc000\u{1d527}ath;\u4237pf;\uc000\u{1d55b}\u01e3\u23ec\0\u23f1r;\uc000\u{1d4bf}rcy;\u4458kcy;\u4454\u0400acfghjos\u240b\u2416\u2422\u2427\u242d\u2431\u2435\u243bppa\u0100;v\u2413\u2414\u43ba;\u43f0\u0100ey\u241b\u2420dil;\u4137;\u443ar;\uc000\u{1d528}reen;\u4138cy;\u4445cy;\u445cpf;\uc000\u{1d55c}cr;\uc000\u{1d4c0}\u0b80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248d\u2491\u250e\u253d\u255a\u2580\u264e\u265e\u2665\u2679\u267d\u269a\u26b2\u26d8\u275d\u2768\u278b\u27c0\u2801\u2812\u0180art\u2477\u247a\u247cr\xf2\u09c6\xf2\u0395ail;\u691barr;\u690e\u0100;g\u0994\u248b;\u6a8bar;\u6962\u0963\u24a5\0\u24aa\0\u24b1\0\0\0\0\0\u24b5\u24ba\0\u24c6\u24c8\u24cd\0\u24f9ute;\u413amptyv;\u69b4ra\xee\u084cbda;\u43bbg\u0180;dl\u088e\u24c1\u24c3;\u6991\xe5\u088e;\u6a85uo\u803b\xab\u40abr\u0400;bfhlpst\u0899\u24de\u24e6\u24e9\u24eb\u24ee\u24f1\u24f5\u0100;f\u089d\u24e3s;\u691fs;\u691d\xeb\u2252p;\u61abl;\u6939im;\u6973l;\u61a2\u0180;ae\u24ff\u2500\u2504\u6aabil;\u6919\u0100;s\u2509\u250a\u6aad;\uc000\u2aad\ufe00\u0180abr\u2515\u2519\u251drr;\u690crk;\u6772\u0100ak\u2522\u252cc\u0100ek\u2528\u252a;\u407b;\u405b\u0100es\u2531\u2533;\u698bl\u0100du\u2539\u253b;\u698f;\u698d\u0200aeuy\u2546\u254b\u2556\u2558ron;\u413e\u0100di\u2550\u2554il;\u413c\xec\u08b0\xe2\u2529;\u443b\u0200cqrs\u2563\u2566\u256d\u257da;\u6936uo\u0100;r\u0e19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694bh;\u61b2\u0280;fgqs\u258b\u258c\u0989\u25f3\u25ff\u6264t\u0280ahlrt\u2598\u25a4\u25b7\u25c2\u25e8rrow\u0100;t\u0899\u25a1a\xe9\u24f6arpoon\u0100du\u25af\u25b4own\xbb\u045ap\xbb\u0966eftarrows;\u61c7ight\u0180ahs\u25cd\u25d6\u25derrow\u0100;s\u08f4\u08a7arpoon\xf3\u0f98quigarro\xf7\u21f0hreetimes;\u62cb\u0180;qs\u258b\u0993\u25falan\xf4\u09ac\u0280;cdgs\u09ac\u260a\u260d\u261d\u2628c;\u6aa8ot\u0100;o\u2614\u2615\u6a7f\u0100;r\u261a\u261b\u6a81;\u6a83\u0100;e\u2622\u2625\uc000\u22da\ufe00s;\u6a93\u0280adegs\u2633\u2639\u263d\u2649\u264bppro\xf8\u24c6ot;\u62d6q\u0100gq\u2643\u2645\xf4\u0989gt\xf2\u248c\xf4\u099bi\xed\u09b2\u0180ilr\u2655\u08e1\u265asht;\u697c;\uc000\u{1d529}\u0100;E\u099c\u2663;\u6a91\u0161\u2669\u2676r\u0100du\u25b2\u266e\u0100;l\u0965\u2673;\u696alk;\u6584cy;\u4459\u0280;acht\u0a48\u2688\u268b\u2691\u2696r\xf2\u25c1orne\xf2\u1d08ard;\u696bri;\u65fa\u0100io\u269f\u26a4dot;\u4140ust\u0100;a\u26ac\u26ad\u63b0che\xbb\u26ad\u0200Eaes\u26bb\u26bd\u26c9\u26d4;\u6268p\u0100;p\u26c3\u26c4\u6a89rox\xbb\u26c4\u0100;q\u26ce\u26cf\u6a87\u0100;q\u26ce\u26bbim;\u62e6\u0400abnoptwz\u26e9\u26f4\u26f7\u271a\u272f\u2741\u2747\u2750\u0100nr\u26ee\u26f1g;\u67ecr;\u61fdr\xeb\u08c1g\u0180lmr\u26ff\u270d\u2714eft\u0100ar\u09e6\u2707ight\xe1\u09f2apsto;\u67fcight\xe1\u09fdparrow\u0100lr\u2725\u2729ef\xf4\u24edight;\u61ac\u0180afl\u2736\u2739\u273dr;\u6985;\uc000\u{1d55d}us;\u6a2dimes;\u6a34\u0161\u274b\u274fst;\u6217\xe1\u134e\u0180;ef\u2757\u2758\u1800\u65cange\xbb\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277c\u2785\u2787r\xf2\u08a8orne\xf2\u1d8car\u0100;d\u0f98\u2783;\u696d;\u600eri;\u62bf\u0300achiqt\u2798\u279d\u0a40\u27a2\u27ae\u27bbquo;\u6039r;\uc000\u{1d4c1}m\u0180;eg\u09b2\u27aa\u27ac;\u6a8d;\u6a8f\u0100bu\u252a\u27b3o\u0100;r\u0e1f\u27b9;\u601arok;\u4142\u8400<;cdhilqr\u082b\u27d2\u2639\u27dc\u27e0\u27e5\u27ea\u27f0\u0100ci\u27d7\u27d9;\u6aa6r;\u6a79re\xe5\u25f2mes;\u62c9arr;\u6976uest;\u6a7b\u0100Pi\u27f5\u27f9ar;\u6996\u0180;ef\u2800\u092d\u181b\u65c3r\u0100du\u2807\u280dshar;\u694ahar;\u6966\u0100en\u2817\u2821rtneqq;\uc000\u2268\ufe00\xc5\u281e\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288e\u2893\u28a0\u28a5\u28a8\u28da\u28e2\u28e4\u0a83\u28f3\u2902Dot;\u623a\u0200clpr\u284e\u2852\u2863\u287dr\u803b\xaf\u40af\u0100et\u2857\u2859;\u6642\u0100;e\u285e\u285f\u6720se\xbb\u285f\u0100;s\u103b\u2868to\u0200;dlu\u103b\u2873\u2877\u287bow\xee\u048cef\xf4\u090f\xf0\u13d1ker;\u65ae\u0100oy\u2887\u288cmma;\u6a29;\u443cash;\u6014asuredangle\xbb\u1626r;\uc000\u{1d52a}o;\u6127\u0180cdn\u28af\u28b4\u28c9ro\u803b\xb5\u40b5\u0200;acd\u1464\u28bd\u28c0\u28c4s\xf4\u16a7ir;\u6af0ot\u80bb\xb7\u01b5us\u0180;bd\u28d2\u1903\u28d3\u6212\u0100;u\u1d3c\u28d8;\u6a2a\u0163\u28de\u28e1p;\u6adb\xf2\u2212\xf0\u0a81\u0100dp\u28e9\u28eeels;\u62a7f;\uc000\u{1d55e}\u0100ct\u28f8\u28fdr;\uc000\u{1d4c2}pos\xbb\u159d\u0180;lm\u2909\u290a\u290d\u43bctimap;\u62b8\u0c00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297e\u2989\u2998\u29da\u29e9\u2a15\u2a1a\u2a58\u2a5d\u2a83\u2a95\u2aa4\u2aa8\u2b04\u2b07\u2b44\u2b7f\u2bae\u2c34\u2c67\u2c7c\u2ce9\u0100gt\u2947\u294b;\uc000\u22d9\u0338\u0100;v\u2950\u0bcf\uc000\u226b\u20d2\u0180elt\u295a\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61cdightarrow;\u61ce;\uc000\u22d8\u0338\u0100;v\u297b\u0c47\uc000\u226a\u20d2ightarrow;\u61cf\u0100Dd\u298e\u2993ash;\u62afash;\u62ae\u0280bcnpt\u29a3\u29a7\u29ac\u29b1\u29ccla\xbb\u02deute;\u4144g;\uc000\u2220\u20d2\u0280;Eiop\u0d84\u29bc\u29c0\u29c5\u29c8;\uc000\u2a70\u0338d;\uc000\u224b\u0338s;\u4149ro\xf8\u0d84ur\u0100;a\u29d3\u29d4\u666el\u0100;s\u29d3\u0b38\u01f3\u29df\0\u29e3p\u80bb\xa0\u0b37mp\u0100;e\u0bf9\u0c00\u0280aeouy\u29f4\u29fe\u2a03\u2a10\u2a13\u01f0\u29f9\0\u29fb;\u6a43on;\u4148dil;\u4146ng\u0100;d\u0d7e\u2a0aot;\uc000\u2a6d\u0338p;\u6a42;\u443dash;\u6013\u0380;Aadqsx\u0b92\u2a29\u2a2d\u2a3b\u2a41\u2a45\u2a50rr;\u61d7r\u0100hr\u2a33\u2a36k;\u6924\u0100;o\u13f2\u13f0ot;\uc000\u2250\u0338ui\xf6\u0b63\u0100ei\u2a4a\u2a4ear;\u6928\xed\u0b98ist\u0100;s\u0ba0\u0b9fr;\uc000\u{1d52b}\u0200Eest\u0bc5\u2a66\u2a79\u2a7c\u0180;qs\u0bbc\u2a6d\u0be1\u0180;qs\u0bbc\u0bc5\u2a74lan\xf4\u0be2i\xed\u0bea\u0100;r\u0bb6\u2a81\xbb\u0bb7\u0180Aap\u2a8a\u2a8d\u2a91r\xf2\u2971rr;\u61aear;\u6af2\u0180;sv\u0f8d\u2a9c\u0f8c\u0100;d\u2aa1\u2aa2\u62fc;\u62facy;\u445a\u0380AEadest\u2ab7\u2aba\u2abe\u2ac2\u2ac5\u2af6\u2af9r\xf2\u2966;\uc000\u2266\u0338rr;\u619ar;\u6025\u0200;fqs\u0c3b\u2ace\u2ae3\u2aeft\u0100ar\u2ad4\u2ad9rro\xf7\u2ac1ightarro\xf7\u2a90\u0180;qs\u0c3b\u2aba\u2aealan\xf4\u0c55\u0100;s\u0c55\u2af4\xbb\u0c36i\xed\u0c5d\u0100;r\u0c35\u2afei\u0100;e\u0c1a\u0c25i\xe4\u0d90\u0100pt\u2b0c\u2b11f;\uc000\u{1d55f}\u8180\xac;in\u2b19\u2b1a\u2b36\u40acn\u0200;Edv\u0b89\u2b24\u2b28\u2b2e;\uc000\u22f9\u0338ot;\uc000\u22f5\u0338\u01e1\u0b89\u2b33\u2b35;\u62f7;\u62f6i\u0100;v\u0cb8\u2b3c\u01e1\u0cb8\u2b41\u2b43;\u62fe;\u62fd\u0180aor\u2b4b\u2b63\u2b69r\u0200;ast\u0b7b\u2b55\u2b5a\u2b5flle\xec\u0b7bl;\uc000\u2afd\u20e5;\uc000\u2202\u0338lint;\u6a14\u0180;ce\u0c92\u2b70\u2b73u\xe5\u0ca5\u0100;c\u0c98\u2b78\u0100;e\u0c92\u2b7d\xf1\u0c98\u0200Aait\u2b88\u2b8b\u2b9d\u2ba7r\xf2\u2988rr\u0180;cw\u2b94\u2b95\u2b99\u619b;\uc000\u2933\u0338;\uc000\u219d\u0338ghtarrow\xbb\u2b95ri\u0100;e\u0ccb\u0cd6\u0380chimpqu\u2bbd\u2bcd\u2bd9\u2b04\u0b78\u2be4\u2bef\u0200;cer\u0d32\u2bc6\u0d37\u2bc9u\xe5\u0d45;\uc000\u{1d4c3}ort\u026d\u2b05\0\0\u2bd6ar\xe1\u2b56m\u0100;e\u0d6e\u2bdf\u0100;q\u0d74\u0d73su\u0100bp\u2beb\u2bed\xe5\u0cf8\xe5\u0d0b\u0180bcp\u2bf6\u2c11\u2c19\u0200;Ees\u2bff\u2c00\u0d22\u2c04\u6284;\uc000\u2ac5\u0338et\u0100;e\u0d1b\u2c0bq\u0100;q\u0d23\u2c00c\u0100;e\u0d32\u2c17\xf1\u0d38\u0200;Ees\u2c22\u2c23\u0d5f\u2c27\u6285;\uc000\u2ac6\u0338et\u0100;e\u0d58\u2c2eq\u0100;q\u0d60\u2c23\u0200gilr\u2c3d\u2c3f\u2c45\u2c47\xec\u0bd7lde\u803b\xf1\u40f1\xe7\u0c43iangle\u0100lr\u2c52\u2c5ceft\u0100;e\u0c1a\u2c5a\xf1\u0c26ight\u0100;e\u0ccb\u2c65\xf1\u0cd7\u0100;m\u2c6c\u2c6d\u43bd\u0180;es\u2c74\u2c75\u2c79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2c8f\u2c94\u2c99\u2c9e\u2ca3\u2cb0\u2cb6\u2cd3\u2ce3ash;\u62adarr;\u6904p;\uc000\u224d\u20d2ash;\u62ac\u0100et\u2ca8\u2cac;\uc000\u2265\u20d2;\uc000>\u20d2nfin;\u69de\u0180Aet\u2cbd\u2cc1\u2cc5rr;\u6902;\uc000\u2264\u20d2\u0100;r\u2cca\u2ccd\uc000<\u20d2ie;\uc000\u22b4\u20d2\u0100At\u2cd8\u2cdcrr;\u6903rie;\uc000\u22b5\u20d2im;\uc000\u223c\u20d2\u0180Aan\u2cf0\u2cf4\u2d02rr;\u61d6r\u0100hr\u2cfa\u2cfdk;\u6923\u0100;o\u13e7\u13e5ear;\u6927\u1253\u1a95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2d2d\0\u2d38\u2d48\u2d60\u2d65\u2d72\u2d84\u1b07\0\0\u2d8d\u2dab\0\u2dc8\u2dce\0\u2ddc\u2e19\u2e2b\u2e3e\u2e43\u0100cs\u2d31\u1a97ute\u803b\xf3\u40f3\u0100iy\u2d3c\u2d45r\u0100;c\u1a9e\u2d42\u803b\xf4\u40f4;\u443e\u0280abios\u1aa0\u2d52\u2d57\u01c8\u2d5alac;\u4151v;\u6a38old;\u69bclig;\u4153\u0100cr\u2d69\u2d6dir;\u69bf;\uc000\u{1d52c}\u036f\u2d79\0\0\u2d7c\0\u2d82n;\u42dbave\u803b\xf2\u40f2;\u69c1\u0100bm\u2d88\u0df4ar;\u69b5\u0200acit\u2d95\u2d98\u2da5\u2da8r\xf2\u1a80\u0100ir\u2d9d\u2da0r;\u69beoss;\u69bbn\xe5\u0e52;\u69c0\u0180aei\u2db1\u2db5\u2db9cr;\u414dga;\u43c9\u0180cdn\u2dc0\u2dc5\u01cdron;\u43bf;\u69b6pf;\uc000\u{1d560}\u0180ael\u2dd4\u2dd7\u01d2r;\u69b7rp;\u69b9\u0380;adiosv\u2dea\u2deb\u2dee\u2e08\u2e0d\u2e10\u2e16\u6228r\xf2\u1a86\u0200;efm\u2df7\u2df8\u2e02\u2e05\u6a5dr\u0100;o\u2dfe\u2dff\u6134f\xbb\u2dff\u803b\xaa\u40aa\u803b\xba\u40bagof;\u62b6r;\u6a56lope;\u6a57;\u6a5b\u0180clo\u2e1f\u2e21\u2e27\xf2\u2e01ash\u803b\xf8\u40f8l;\u6298i\u016c\u2e2f\u2e34de\u803b\xf5\u40f5es\u0100;a\u01db\u2e3as;\u6a36ml\u803b\xf6\u40f6bar;\u633d\u0ae1\u2e5e\0\u2e7d\0\u2e80\u2e9d\0\u2ea2\u2eb9\0\0\u2ecb\u0e9c\0\u2f13\0\0\u2f2b\u2fbc\0\u2fc8r\u0200;ast\u0403\u2e67\u2e72\u0e85\u8100\xb6;l\u2e6d\u2e6e\u40b6le\xec\u0403\u0269\u2e78\0\0\u2e7bm;\u6af3;\u6afdy;\u443fr\u0280cimpt\u2e8b\u2e8f\u2e93\u1865\u2e97nt;\u4025od;\u402eil;\u6030enk;\u6031r;\uc000\u{1d52d}\u0180imo\u2ea8\u2eb0\u2eb4\u0100;v\u2ead\u2eae\u43c6;\u43d5ma\xf4\u0a76ne;\u660e\u0180;tv\u2ebf\u2ec0\u2ec8\u43c0chfork\xbb\u1ffd;\u43d6\u0100au\u2ecf\u2edfn\u0100ck\u2ed5\u2eddk\u0100;h\u21f4\u2edb;\u610e\xf6\u21f4s\u0480;abcdemst\u2ef3\u2ef4\u1908\u2ef9\u2efd\u2f04\u2f06\u2f0a\u2f0e\u402bcir;\u6a23ir;\u6a22\u0100ou\u1d40\u2f02;\u6a25;\u6a72n\u80bb\xb1\u0e9dim;\u6a26wo;\u6a27\u0180ipu\u2f19\u2f20\u2f25ntint;\u6a15f;\uc000\u{1d561}nd\u803b\xa3\u40a3\u0500;Eaceinosu\u0ec8\u2f3f\u2f41\u2f44\u2f47\u2f81\u2f89\u2f92\u2f7e\u2fb6;\u6ab3p;\u6ab7u\xe5\u0ed9\u0100;c\u0ece\u2f4c\u0300;acens\u0ec8\u2f59\u2f5f\u2f66\u2f68\u2f7eppro\xf8\u2f43urlye\xf1\u0ed9\xf1\u0ece\u0180aes\u2f6f\u2f76\u2f7approx;\u6ab9qq;\u6ab5im;\u62e8i\xed\u0edfme\u0100;s\u2f88\u0eae\u6032\u0180Eas\u2f78\u2f90\u2f7a\xf0\u2f75\u0180dfp\u0eec\u2f99\u2faf\u0180als\u2fa0\u2fa5\u2faalar;\u632eine;\u6312urf;\u6313\u0100;t\u0efb\u2fb4\xef\u0efbrel;\u62b0\u0100ci\u2fc0\u2fc5r;\uc000\u{1d4c5};\u43c8ncsp;\u6008\u0300fiopsu\u2fda\u22e2\u2fdf\u2fe5\u2feb\u2ff1r;\uc000\u{1d52e}pf;\uc000\u{1d562}rime;\u6057cr;\uc000\u{1d4c6}\u0180aeo\u2ff8\u3009\u3013t\u0100ei\u2ffe\u3005rnion\xf3\u06b0nt;\u6a16st\u0100;e\u3010\u3011\u403f\xf1\u1f19\xf4\u0f14\u0a80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30e0\u310e\u312b\u3147\u3162\u3172\u318e\u3206\u3215\u3224\u3229\u3258\u326e\u3272\u3290\u32b0\u32b7\u0180art\u3047\u304a\u304cr\xf2\u10b3\xf2\u03ddail;\u691car\xf2\u1c65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307f\u308f\u3094\u30cc\u0100eu\u306d\u3071;\uc000\u223d\u0331te;\u4155i\xe3\u116emptyv;\u69b3g\u0200;del\u0fd1\u3089\u308b\u308d;\u6992;\u69a5\xe5\u0fd1uo\u803b\xbb\u40bbr\u0580;abcfhlpstw\u0fdc\u30ac\u30af\u30b7\u30b9\u30bc\u30be\u30c0\u30c3\u30c7\u30cap;\u6975\u0100;f\u0fe0\u30b4s;\u6920;\u6933s;\u691e\xeb\u225d\xf0\u272el;\u6945im;\u6974l;\u61a3;\u619d\u0100ai\u30d1\u30d5il;\u691ao\u0100;n\u30db\u30dc\u6236al\xf3\u0f1e\u0180abr\u30e7\u30ea\u30eer\xf2\u17e5rk;\u6773\u0100ak\u30f3\u30fdc\u0100ek\u30f9\u30fb;\u407d;\u405d\u0100es\u3102\u3104;\u698cl\u0100du\u310a\u310c;\u698e;\u6990\u0200aeuy\u3117\u311c\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xec\u0ff2\xe2\u30fa;\u4440\u0200clqs\u3134\u3137\u313d\u3144a;\u6937dhar;\u6969uo\u0100;r\u020e\u020dh;\u61b3\u0180acg\u314e\u315f\u0f44l\u0200;ips\u0f78\u3158\u315b\u109cn\xe5\u10bbar\xf4\u0fa9t;\u65ad\u0180ilr\u3169\u1023\u316esht;\u697d;\uc000\u{1d52f}\u0100ao\u3177\u3186r\u0100du\u317d\u317f\xbb\u047b\u0100;l\u1091\u3184;\u696c\u0100;v\u318b\u318c\u43c1;\u43f1\u0180gns\u3195\u31f9\u31fcht\u0300ahlrst\u31a4\u31b0\u31c2\u31d8\u31e4\u31eerrow\u0100;t\u0fdc\u31ada\xe9\u30c8arpoon\u0100du\u31bb\u31bfow\xee\u317ep\xbb\u1092eft\u0100ah\u31ca\u31d0rrow\xf3\u0feaarpoon\xf3\u0551ightarrows;\u61c9quigarro\xf7\u30cbhreetimes;\u62ccg;\u42daingdotse\xf1\u1f32\u0180ahm\u320d\u3210\u3213r\xf2\u0feaa\xf2\u0551;\u600foust\u0100;a\u321e\u321f\u63b1che\xbb\u321fmid;\u6aee\u0200abpt\u3232\u323d\u3240\u3252\u0100nr\u3237\u323ag;\u67edr;\u61fer\xeb\u1003\u0180afl\u3247\u324a\u324er;\u6986;\uc000\u{1d563}us;\u6a2eimes;\u6a35\u0100ap\u325d\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6a12ar\xf2\u31e3\u0200achq\u327b\u3280\u10bc\u3285quo;\u603ar;\uc000\u{1d4c7}\u0100bu\u30fb\u328ao\u0100;r\u0214\u0213\u0180hir\u3297\u329b\u32a0re\xe5\u31f8mes;\u62cai\u0200;efl\u32aa\u1059\u1821\u32ab\u65b9tri;\u69celuhar;\u6968;\u611e\u0d61\u32d5\u32db\u32df\u332c\u3338\u3371\0\u337a\u33a4\0\0\u33ec\u33f0\0\u3428\u3448\u345a\u34ad\u34b1\u34ca\u34f1\0\u3616\0\0\u3633cute;\u415bqu\xef\u27ba\u0500;Eaceinpsy\u11ed\u32f3\u32f5\u32ff\u3302\u330b\u330f\u331f\u3326\u3329;\u6ab4\u01f0\u32fa\0\u32fc;\u6ab8on;\u4161u\xe5\u11fe\u0100;d\u11f3\u3307il;\u415frc;\u415d\u0180Eas\u3316\u3318\u331b;\u6ab6p;\u6abaim;\u62e9olint;\u6a13i\xed\u1204;\u4441ot\u0180;be\u3334\u1d47\u3335\u62c5;\u6a66\u0380Aacmstx\u3346\u334a\u3357\u335b\u335e\u3363\u336drr;\u61d8r\u0100hr\u3350\u3352\xeb\u2228\u0100;o\u0a36\u0a34t\u803b\xa7\u40a7i;\u403bwar;\u6929m\u0100in\u3369\xf0nu\xf3\xf1t;\u6736r\u0100;o\u3376\u2055\uc000\u{1d530}\u0200acoy\u3382\u3386\u3391\u33a0rp;\u666f\u0100hy\u338b\u338fcy;\u4449;\u4448rt\u026d\u3399\0\0\u339ci\xe4\u1464ara\xec\u2e6f\u803b\xad\u40ad\u0100gm\u33a8\u33b4ma\u0180;fv\u33b1\u33b2\u33b2\u43c3;\u43c2\u0400;deglnpr\u12ab\u33c5\u33c9\u33ce\u33d6\u33de\u33e1\u33e6ot;\u6a6a\u0100;q\u12b1\u12b0\u0100;E\u33d3\u33d4\u6a9e;\u6aa0\u0100;E\u33db\u33dc\u6a9d;\u6a9fe;\u6246lus;\u6a24arr;\u6972ar\xf2\u113d\u0200aeit\u33f8\u3408\u340f\u3417\u0100ls\u33fd\u3404lsetm\xe9\u336ahp;\u6a33parsl;\u69e4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341c\u341d\u6aaa\u0100;s\u3422\u3423\u6aac;\uc000\u2aac\ufe00\u0180flp\u342e\u3433\u3442tcy;\u444c\u0100;b\u3438\u3439\u402f\u0100;a\u343e\u343f\u69c4r;\u633ff;\uc000\u{1d564}a\u0100dr\u344d\u0402es\u0100;u\u3454\u3455\u6660it\xbb\u3455\u0180csu\u3460\u3479\u349f\u0100au\u3465\u346fp\u0100;s\u1188\u346b;\uc000\u2293\ufe00p\u0100;s\u11b4\u3475;\uc000\u2294\ufe00u\u0100bp\u347f\u348f\u0180;es\u1197\u119c\u3486et\u0100;e\u1197\u348d\xf1\u119d\u0180;es\u11a8\u11ad\u3496et\u0100;e\u11a8\u349d\xf1\u11ae\u0180;af\u117b\u34a6\u05b0r\u0165\u34ab\u05b1\xbb\u117car\xf2\u1148\u0200cemt\u34b9\u34be\u34c2\u34c5r;\uc000\u{1d4c8}tm\xee\xf1i\xec\u3415ar\xe6\u11be\u0100ar\u34ce\u34d5r\u0100;f\u34d4\u17bf\u6606\u0100an\u34da\u34edight\u0100ep\u34e3\u34eapsilo\xee\u1ee0h\xe9\u2eafs\xbb\u2852\u0280bcmnp\u34fb\u355e\u1209\u358b\u358e\u0480;Edemnprs\u350e\u350f\u3511\u3515\u351e\u3523\u352c\u3531\u3536\u6282;\u6ac5ot;\u6abd\u0100;d\u11da\u351aot;\u6ac3ult;\u6ac1\u0100Ee\u3528\u352a;\u6acb;\u628alus;\u6abfarr;\u6979\u0180eiu\u353d\u3552\u3555t\u0180;en\u350e\u3545\u354bq\u0100;q\u11da\u350feq\u0100;q\u352b\u3528m;\u6ac7\u0100bp\u355a\u355c;\u6ad5;\u6ad3c\u0300;acens\u11ed\u356c\u3572\u3579\u357b\u3326ppro\xf8\u32faurlye\xf1\u11fe\xf1\u11f3\u0180aes\u3582\u3588\u331bppro\xf8\u331aq\xf1\u3317g;\u666a\u0680123;Edehlmnps\u35a9\u35ac\u35af\u121c\u35b2\u35b4\u35c0\u35c9\u35d5\u35da\u35df\u35e8\u35ed\u803b\xb9\u40b9\u803b\xb2\u40b2\u803b\xb3\u40b3;\u6ac6\u0100os\u35b9\u35bct;\u6abeub;\u6ad8\u0100;d\u1222\u35c5ot;\u6ac4s\u0100ou\u35cf\u35d2l;\u67c9b;\u6ad7arr;\u697bult;\u6ac2\u0100Ee\u35e4\u35e6;\u6acc;\u628blus;\u6ac0\u0180eiu\u35f4\u3609\u360ct\u0180;en\u121c\u35fc\u3602q\u0100;q\u1222\u35b2eq\u0100;q\u35e7\u35e4m;\u6ac8\u0100bp\u3611\u3613;\u6ad4;\u6ad6\u0180Aan\u361c\u3620\u362drr;\u61d9r\u0100hr\u3626\u3628\xeb\u222e\u0100;o\u0a2b\u0a29war;\u692alig\u803b\xdf\u40df\u0be1\u3651\u365d\u3660\u12ce\u3673\u3679\0\u367e\u36c2\0\0\0\0\0\u36db\u3703\0\u3709\u376c\0\0\0\u3787\u0272\u3656\0\0\u365bget;\u6316;\u43c4r\xeb\u0e5f\u0180aey\u3666\u366b\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uc000\u{1d531}\u0200eiko\u3686\u369d\u36b5\u36bc\u01f2\u368b\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369b\u43b8ym;\u43d1\u0100cn\u36a2\u36b2k\u0100as\u36a8\u36aeppro\xf8\u12c1im\xbb\u12acs\xf0\u129e\u0100as\u36ba\u36ae\xf0\u12c1rn\u803b\xfe\u40fe\u01ec\u031f\u36c6\u22e7es\u8180\xd7;bd\u36cf\u36d0\u36d8\u40d7\u0100;a\u190f\u36d5r;\u6a31;\u6a30\u0180eps\u36e1\u36e3\u3700\xe1\u2a4d\u0200;bcf\u0486\u36ec\u36f0\u36f4ot;\u6336ir;\u6af1\u0100;o\u36f9\u36fc\uc000\u{1d565}rk;\u6ada\xe1\u3362rime;\u6034\u0180aip\u370f\u3712\u3764d\xe5\u1248\u0380adempst\u3721\u374d\u3740\u3751\u3757\u375c\u375fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65b5own\xbb\u1dbbeft\u0100;e\u2800\u373e\xf1\u092e;\u625cight\u0100;e\u32aa\u374b\xf1\u105aot;\u65ecinus;\u6a3alus;\u6a39b;\u69cdime;\u6a3bezium;\u63e2\u0180cht\u3772\u377d\u3781\u0100ry\u3777\u377b;\uc000\u{1d4c9};\u4446cy;\u445brok;\u4167\u0100io\u378b\u378ex\xf4\u1777head\u0100lr\u3797\u37a0eftarro\xf7\u084fightarrow\xbb\u0f5d\u0900AHabcdfghlmoprstuw\u37d0\u37d3\u37d7\u37e4\u37f0\u37fc\u380e\u381c\u3823\u3834\u3851\u385d\u386b\u38a9\u38cc\u38d2\u38ea\u38f6r\xf2\u03edar;\u6963\u0100cr\u37dc\u37e2ute\u803b\xfa\u40fa\xf2\u1150r\u01e3\u37ea\0\u37edy;\u445eve;\u416d\u0100iy\u37f5\u37farc\u803b\xfb\u40fb;\u4443\u0180abh\u3803\u3806\u380br\xf2\u13adlac;\u4171a\xf2\u13c3\u0100ir\u3813\u3818sht;\u697e;\uc000\u{1d532}rave\u803b\xf9\u40f9\u0161\u3827\u3831r\u0100lr\u382c\u382e\xbb\u0957\xbb\u1083lk;\u6580\u0100ct\u3839\u384d\u026f\u383f\0\0\u384arn\u0100;e\u3845\u3846\u631cr\xbb\u3846op;\u630fri;\u65f8\u0100al\u3856\u385acr;\u416b\u80bb\xa8\u0349\u0100gp\u3862\u3866on;\u4173f;\uc000\u{1d566}\u0300adhlsu\u114b\u3878\u387d\u1372\u3891\u38a0own\xe1\u13b3arpoon\u0100lr\u3888\u388cef\xf4\u382digh\xf4\u382fi\u0180;hl\u3899\u389a\u389c\u43c5\xbb\u13faon\xbb\u389aparrows;\u61c8\u0180cit\u38b0\u38c4\u38c8\u026f\u38b6\0\0\u38c1rn\u0100;e\u38bc\u38bd\u631dr\xbb\u38bdop;\u630eng;\u416fri;\u65f9cr;\uc000\u{1d4ca}\u0180dir\u38d9\u38dd\u38e2ot;\u62f0lde;\u4169i\u0100;f\u3730\u38e8\xbb\u1813\u0100am\u38ef\u38f2r\xf2\u38a8l\u803b\xfc\u40fcangle;\u69a7\u0780ABDacdeflnoprsz\u391c\u391f\u3929\u392d\u39b5\u39b8\u39bd\u39df\u39e4\u39e8\u39f3\u39f9\u39fd\u3a01\u3a20r\xf2\u03f7ar\u0100;v\u3926\u3927\u6ae8;\u6ae9as\xe8\u03e1\u0100nr\u3932\u3937grt;\u699c\u0380eknprst\u34e3\u3946\u394b\u3952\u395d\u3964\u3996app\xe1\u2415othin\xe7\u1e96\u0180hir\u34eb\u2ec8\u3959op\xf4\u2fb5\u0100;h\u13b7\u3962\xef\u318d\u0100iu\u3969\u396dgm\xe1\u33b3\u0100bp\u3972\u3984setneq\u0100;q\u397d\u3980\uc000\u228a\ufe00;\uc000\u2acb\ufe00setneq\u0100;q\u398f\u3992\uc000\u228b\ufe00;\uc000\u2acc\ufe00\u0100hr\u399b\u399fet\xe1\u369ciangle\u0100lr\u39aa\u39afeft\xbb\u0925ight\xbb\u1051y;\u4432ash\xbb\u1036\u0180elr\u39c4\u39d2\u39d7\u0180;be\u2dea\u39cb\u39cfar;\u62bbq;\u625alip;\u62ee\u0100bt\u39dc\u1468a\xf2\u1469r;\uc000\u{1d533}tr\xe9\u39aesu\u0100bp\u39ef\u39f1\xbb\u0d1c\xbb\u0d59pf;\uc000\u{1d567}ro\xf0\u0efbtr\xe9\u39b4\u0100cu\u3a06\u3a0br;\uc000\u{1d4cb}\u0100bp\u3a10\u3a18n\u0100Ee\u3980\u3a16\xbb\u397en\u0100Ee\u3992\u3a1e\xbb\u3990igzag;\u699a\u0380cefoprs\u3a36\u3a3b\u3a56\u3a5b\u3a54\u3a61\u3a6airc;\u4175\u0100di\u3a40\u3a51\u0100bg\u3a45\u3a49ar;\u6a5fe\u0100;q\u15fa\u3a4f;\u6259erp;\u6118r;\uc000\u{1d534}pf;\uc000\u{1d568}\u0100;e\u1479\u3a66at\xe8\u1479cr;\uc000\u{1d4cc}\u0ae3\u178e\u3a87\0\u3a8b\0\u3a90\u3a9b\0\0\u3a9d\u3aa8\u3aab\u3aaf\0\0\u3ac3\u3ace\0\u3ad8\u17dc\u17dftr\xe9\u17d1r;\uc000\u{1d535}\u0100Aa\u3a94\u3a97r\xf2\u03c3r\xf2\u09f6;\u43be\u0100Aa\u3aa1\u3aa4r\xf2\u03b8r\xf2\u09eba\xf0\u2713is;\u62fb\u0180dpt\u17a4\u3ab5\u3abe\u0100fl\u3aba\u17a9;\uc000\u{1d569}im\xe5\u17b2\u0100Aa\u3ac7\u3acar\xf2\u03cer\xf2\u0a01\u0100cq\u3ad2\u17b8r;\uc000\u{1d4cd}\u0100pt\u17d6\u3adcr\xe9\u17d4\u0400acefiosu\u3af0\u3afd\u3b08\u3b0c\u3b11\u3b15\u3b1b\u3b21c\u0100uy\u3af6\u3afbte\u803b\xfd\u40fd;\u444f\u0100iy\u3b02\u3b06rc;\u4177;\u444bn\u803b\xa5\u40a5r;\uc000\u{1d536}cy;\u4457pf;\uc000\u{1d56a}cr;\uc000\u{1d4ce}\u0100cm\u3b26\u3b29y;\u444el\u803b\xff\u40ff\u0500acdefhiosw\u3b42\u3b48\u3b54\u3b58\u3b64\u3b69\u3b6d\u3b74\u3b7a\u3b80cute;\u417a\u0100ay\u3b4d\u3b52ron;\u417e;\u4437ot;\u417c\u0100et\u3b5d\u3b61tr\xe6\u155fa;\u43b6r;\uc000\u{1d537}cy;\u4436grarr;\u61ddpf;\uc000\u{1d56b}cr;\uc000\u{1d4cf}\u0100jn\u3b85\u3b87;\u600dj;\u600c'
            .split("")
            .map(function (e) {
              return e.charCodeAt(0);
            })
        ))),
      mi
    );
  }
  var yi,
    bi = {};
  function wi() {
    return (
      yi ||
        ((yi = 1),
        Object.defineProperty(bi, "__esModule", { value: !0 }),
        (bi.default = new Uint16Array(
          "\u0200aglq\t\x15\x18\x1b\u026d\x0f\0\0\x12p;\u4026os;\u4027t;\u403et;\u403cuot;\u4022"
            .split("")
            .map(function (e) {
              return e.charCodeAt(0);
            })
        ))),
      bi
    );
  }
  var xi,
    Ci,
    Si,
    ki,
    Ei = {};
  function Ti() {
    return (
      xi ||
        ((xi = 1),
        (function (e) {
          var t;
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.replaceCodePoint = e.fromCodePoint = void 0);
          var r = new Map([
            [0, 65533],
            [128, 8364],
            [130, 8218],
            [131, 402],
            [132, 8222],
            [133, 8230],
            [134, 8224],
            [135, 8225],
            [136, 710],
            [137, 8240],
            [138, 352],
            [139, 8249],
            [140, 338],
            [142, 381],
            [145, 8216],
            [146, 8217],
            [147, 8220],
            [148, 8221],
            [149, 8226],
            [150, 8211],
            [151, 8212],
            [152, 732],
            [153, 8482],
            [154, 353],
            [155, 8250],
            [156, 339],
            [158, 382],
            [159, 376],
          ]);
          function n(e) {
            var t;
            return (e >= 55296 && e <= 57343) || e > 1114111
              ? 65533
              : null !== (t = r.get(e)) && void 0 !== t
              ? t
              : e;
          }
          (e.fromCodePoint =
            null !== (t = String.fromCodePoint) && void 0 !== t
              ? t
              : function (e) {
                  var t = "";
                  return (
                    e > 65535 &&
                      ((e -= 65536),
                      (t += String.fromCharCode(((e >>> 10) & 1023) | 55296)),
                      (e = 56320 | (1023 & e))),
                    (t += String.fromCharCode(e))
                  );
                }),
            (e.replaceCodePoint = n),
            (e.default = function (t) {
              return (0, e.fromCodePoint)(n(t));
            });
        })(Ei)),
      Ei
    );
  }
  function Ai() {
    return (
      Ci ||
        ((Ci = 1),
        (function (e) {
          var t =
              (gi && gi.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var i = Object.getOwnPropertyDescriptor(t, r);
                    (i &&
                      !("get" in i
                        ? !t.__esModule
                        : i.writable || i.configurable)) ||
                      (i = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            r =
              (gi && gi.__setModuleDefault) ||
              (Object.create
                ? function (e, t) {
                    Object.defineProperty(e, "default", {
                      enumerable: !0,
                      value: t,
                    });
                  }
                : function (e, t) {
                    e.default = t;
                  }),
            n =
              (gi && gi.__importStar) ||
              function (e) {
                if (e && e.__esModule) return e;
                var n = {};
                if (null != e)
                  for (var i in e)
                    "default" !== i &&
                      Object.prototype.hasOwnProperty.call(e, i) &&
                      t(n, e, i);
                return r(n, e), n;
              },
            i =
              (gi && gi.__importDefault) ||
              function (e) {
                return e && e.__esModule ? e : { default: e };
              };
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.decodeXML =
              e.decodeHTMLStrict =
              e.decodeHTMLAttribute =
              e.decodeHTML =
              e.determineBranch =
              e.EntityDecoder =
              e.DecodingMode =
              e.BinTrieFlags =
              e.fromCodePoint =
              e.replaceCodePoint =
              e.decodeCodePoint =
              e.xmlDecodeTree =
              e.htmlDecodeTree =
                void 0);
          var o = i(vi());
          e.htmlDecodeTree = o.default;
          var s = i(wi());
          e.xmlDecodeTree = s.default;
          var a = n(Ti());
          e.decodeCodePoint = a.default;
          var l,
            c = Ti();
          Object.defineProperty(e, "replaceCodePoint", {
            enumerable: !0,
            get: function () {
              return c.replaceCodePoint;
            },
          }),
            Object.defineProperty(e, "fromCodePoint", {
              enumerable: !0,
              get: function () {
                return c.fromCodePoint;
              },
            }),
            (function (e) {
              (e[(e.NUM = 35)] = "NUM"),
                (e[(e.SEMI = 59)] = "SEMI"),
                (e[(e.EQUALS = 61)] = "EQUALS"),
                (e[(e.ZERO = 48)] = "ZERO"),
                (e[(e.NINE = 57)] = "NINE"),
                (e[(e.LOWER_A = 97)] = "LOWER_A"),
                (e[(e.LOWER_F = 102)] = "LOWER_F"),
                (e[(e.LOWER_X = 120)] = "LOWER_X"),
                (e[(e.LOWER_Z = 122)] = "LOWER_Z"),
                (e[(e.UPPER_A = 65)] = "UPPER_A"),
                (e[(e.UPPER_F = 70)] = "UPPER_F"),
                (e[(e.UPPER_Z = 90)] = "UPPER_Z");
            })(l || (l = {}));
          var u, d, p;
          function h(e) {
            return e >= l.ZERO && e <= l.NINE;
          }
          function f(e) {
            return (
              e === l.EQUALS ||
              (function (e) {
                return (
                  (e >= l.UPPER_A && e <= l.UPPER_Z) ||
                  (e >= l.LOWER_A && e <= l.LOWER_Z) ||
                  h(e)
                );
              })(e)
            );
          }
          !(function (e) {
            (e[(e.VALUE_LENGTH = 49152)] = "VALUE_LENGTH"),
              (e[(e.BRANCH_LENGTH = 16256)] = "BRANCH_LENGTH"),
              (e[(e.JUMP_TABLE = 127)] = "JUMP_TABLE");
          })((u = e.BinTrieFlags || (e.BinTrieFlags = {}))),
            (function (e) {
              (e[(e.EntityStart = 0)] = "EntityStart"),
                (e[(e.NumericStart = 1)] = "NumericStart"),
                (e[(e.NumericDecimal = 2)] = "NumericDecimal"),
                (e[(e.NumericHex = 3)] = "NumericHex"),
                (e[(e.NamedEntity = 4)] = "NamedEntity");
            })(d || (d = {})),
            (function (e) {
              (e[(e.Legacy = 0)] = "Legacy"),
                (e[(e.Strict = 1)] = "Strict"),
                (e[(e.Attribute = 2)] = "Attribute");
            })((p = e.DecodingMode || (e.DecodingMode = {})));
          var g = (function () {
            function e(e, t, r) {
              (this.decodeTree = e),
                (this.emitCodePoint = t),
                (this.errors = r),
                (this.state = d.EntityStart),
                (this.consumed = 1),
                (this.result = 0),
                (this.treeIndex = 0),
                (this.excess = 1),
                (this.decodeMode = p.Strict);
            }
            return (
              (e.prototype.startEntity = function (e) {
                (this.decodeMode = e),
                  (this.state = d.EntityStart),
                  (this.result = 0),
                  (this.treeIndex = 0),
                  (this.excess = 1),
                  (this.consumed = 1);
              }),
              (e.prototype.write = function (e, t) {
                switch (this.state) {
                  case d.EntityStart:
                    return e.charCodeAt(t) === l.NUM
                      ? ((this.state = d.NumericStart),
                        (this.consumed += 1),
                        this.stateNumericStart(e, t + 1))
                      : ((this.state = d.NamedEntity),
                        this.stateNamedEntity(e, t));
                  case d.NumericStart:
                    return this.stateNumericStart(e, t);
                  case d.NumericDecimal:
                    return this.stateNumericDecimal(e, t);
                  case d.NumericHex:
                    return this.stateNumericHex(e, t);
                  case d.NamedEntity:
                    return this.stateNamedEntity(e, t);
                }
              }),
              (e.prototype.stateNumericStart = function (e, t) {
                return t >= e.length
                  ? -1
                  : (32 | e.charCodeAt(t)) === l.LOWER_X
                  ? ((this.state = d.NumericHex),
                    (this.consumed += 1),
                    this.stateNumericHex(e, t + 1))
                  : ((this.state = d.NumericDecimal),
                    this.stateNumericDecimal(e, t));
              }),
              (e.prototype.addToNumericResult = function (e, t, r, n) {
                if (t !== r) {
                  var i = r - t;
                  (this.result =
                    this.result * Math.pow(n, i) + parseInt(e.substr(t, i), n)),
                    (this.consumed += i);
                }
              }),
              (e.prototype.stateNumericHex = function (e, t) {
                for (var r, n = t; t < e.length; ) {
                  var i = e.charCodeAt(t);
                  if (
                    !(
                      h(i) ||
                      ((r = i),
                      (r >= l.UPPER_A && r <= l.UPPER_F) ||
                        (r >= l.LOWER_A && r <= l.LOWER_F))
                    )
                  )
                    return (
                      this.addToNumericResult(e, n, t, 16),
                      this.emitNumericEntity(i, 3)
                    );
                  t += 1;
                }
                return this.addToNumericResult(e, n, t, 16), -1;
              }),
              (e.prototype.stateNumericDecimal = function (e, t) {
                for (var r = t; t < e.length; ) {
                  var n = e.charCodeAt(t);
                  if (!h(n))
                    return (
                      this.addToNumericResult(e, r, t, 10),
                      this.emitNumericEntity(n, 2)
                    );
                  t += 1;
                }
                return this.addToNumericResult(e, r, t, 10), -1;
              }),
              (e.prototype.emitNumericEntity = function (e, t) {
                var r;
                if (this.consumed <= t)
                  return (
                    null === (r = this.errors) ||
                      void 0 === r ||
                      r.absenceOfDigitsInNumericCharacterReference(
                        this.consumed
                      ),
                    0
                  );
                if (e === l.SEMI) this.consumed += 1;
                else if (this.decodeMode === p.Strict) return 0;
                return (
                  this.emitCodePoint(
                    (0, a.replaceCodePoint)(this.result),
                    this.consumed
                  ),
                  this.errors &&
                    (e !== l.SEMI &&
                      this.errors.missingSemicolonAfterCharacterReference(),
                    this.errors.validateNumericCharacterReference(this.result)),
                  this.consumed
                );
              }),
              (e.prototype.stateNamedEntity = function (e, t) {
                for (
                  var r = this.decodeTree,
                    n = r[this.treeIndex],
                    i = (n & u.VALUE_LENGTH) >> 14;
                  t < e.length;
                  t++, this.excess++
                ) {
                  var o = e.charCodeAt(t);
                  if (
                    ((this.treeIndex = v(
                      r,
                      n,
                      this.treeIndex + Math.max(1, i),
                      o
                    )),
                    this.treeIndex < 0)
                  )
                    return 0 === this.result ||
                      (this.decodeMode === p.Attribute && (0 === i || f(o)))
                      ? 0
                      : this.emitNotTerminatedNamedEntity();
                  if (
                    0 !== (i = ((n = r[this.treeIndex]) & u.VALUE_LENGTH) >> 14)
                  ) {
                    if (o === l.SEMI)
                      return this.emitNamedEntityData(
                        this.treeIndex,
                        i,
                        this.consumed + this.excess
                      );
                    this.decodeMode !== p.Strict &&
                      ((this.result = this.treeIndex),
                      (this.consumed += this.excess),
                      (this.excess = 0));
                  }
                }
                return -1;
              }),
              (e.prototype.emitNotTerminatedNamedEntity = function () {
                var e,
                  t = this.result,
                  r = (this.decodeTree[t] & u.VALUE_LENGTH) >> 14;
                return (
                  this.emitNamedEntityData(t, r, this.consumed),
                  null === (e = this.errors) ||
                    void 0 === e ||
                    e.missingSemicolonAfterCharacterReference(),
                  this.consumed
                );
              }),
              (e.prototype.emitNamedEntityData = function (e, t, r) {
                var n = this.decodeTree;
                return (
                  this.emitCodePoint(
                    1 === t ? n[e] & ~u.VALUE_LENGTH : n[e + 1],
                    r
                  ),
                  3 === t && this.emitCodePoint(n[e + 2], r),
                  r
                );
              }),
              (e.prototype.end = function () {
                var e;
                switch (this.state) {
                  case d.NamedEntity:
                    return 0 === this.result ||
                      (this.decodeMode === p.Attribute &&
                        this.result !== this.treeIndex)
                      ? 0
                      : this.emitNotTerminatedNamedEntity();
                  case d.NumericDecimal:
                    return this.emitNumericEntity(0, 2);
                  case d.NumericHex:
                    return this.emitNumericEntity(0, 3);
                  case d.NumericStart:
                    return (
                      null === (e = this.errors) ||
                        void 0 === e ||
                        e.absenceOfDigitsInNumericCharacterReference(
                          this.consumed
                        ),
                      0
                    );
                  case d.EntityStart:
                    return 0;
                }
              }),
              e
            );
          })();
          function m(e) {
            var t = "",
              r = new g(e, function (e) {
                return (t += (0, a.fromCodePoint)(e));
              });
            return function (e, n) {
              for (var i = 0, o = 0; (o = e.indexOf("&", o)) >= 0; ) {
                (t += e.slice(i, o)), r.startEntity(n);
                var s = r.write(e, o + 1);
                if (s < 0) {
                  i = o + r.end();
                  break;
                }
                (i = o + s), (o = 0 === s ? i + 1 : i);
              }
              var a = t + e.slice(i);
              return (t = ""), a;
            };
          }
          function v(e, t, r, n) {
            var i = (t & u.BRANCH_LENGTH) >> 7,
              o = t & u.JUMP_TABLE;
            if (0 === i) return 0 !== o && n === o ? r : -1;
            if (o) {
              var s = n - o;
              return s < 0 || s >= i ? -1 : e[r + s] - 1;
            }
            for (var a = r, l = a + i - 1; a <= l; ) {
              var c = (a + l) >>> 1,
                d = e[c];
              if (d < n) a = c + 1;
              else {
                if (!(d > n)) return e[c + i];
                l = c - 1;
              }
            }
            return -1;
          }
          (e.EntityDecoder = g), (e.determineBranch = v);
          var y = m(o.default),
            b = m(s.default);
          (e.decodeHTML = function (e, t) {
            return void 0 === t && (t = p.Legacy), y(e, t);
          }),
            (e.decodeHTMLAttribute = function (e) {
              return y(e, p.Attribute);
            }),
            (e.decodeHTMLStrict = function (e) {
              return y(e, p.Strict);
            }),
            (e.decodeXML = function (e) {
              return b(e, p.Strict);
            });
        })(gi)),
      gi
    );
  }
  function Oi() {
    return (
      Si ||
        ((Si = 1),
        (function (e) {
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.QuoteType = void 0);
          var t,
            r,
            n,
            i = Ai();
          function o(e) {
            return (
              e === t.Space ||
              e === t.NewLine ||
              e === t.Tab ||
              e === t.FormFeed ||
              e === t.CarriageReturn
            );
          }
          function s(e) {
            return e === t.Slash || e === t.Gt || o(e);
          }
          function a(e) {
            return e >= t.Zero && e <= t.Nine;
          }
          !(function (e) {
            (e[(e.Tab = 9)] = "Tab"),
              (e[(e.NewLine = 10)] = "NewLine"),
              (e[(e.FormFeed = 12)] = "FormFeed"),
              (e[(e.CarriageReturn = 13)] = "CarriageReturn"),
              (e[(e.Space = 32)] = "Space"),
              (e[(e.ExclamationMark = 33)] = "ExclamationMark"),
              (e[(e.Number = 35)] = "Number"),
              (e[(e.Amp = 38)] = "Amp"),
              (e[(e.SingleQuote = 39)] = "SingleQuote"),
              (e[(e.DoubleQuote = 34)] = "DoubleQuote"),
              (e[(e.Dash = 45)] = "Dash"),
              (e[(e.Slash = 47)] = "Slash"),
              (e[(e.Zero = 48)] = "Zero"),
              (e[(e.Nine = 57)] = "Nine"),
              (e[(e.Semi = 59)] = "Semi"),
              (e[(e.Lt = 60)] = "Lt"),
              (e[(e.Eq = 61)] = "Eq"),
              (e[(e.Gt = 62)] = "Gt"),
              (e[(e.Questionmark = 63)] = "Questionmark"),
              (e[(e.UpperA = 65)] = "UpperA"),
              (e[(e.LowerA = 97)] = "LowerA"),
              (e[(e.UpperF = 70)] = "UpperF"),
              (e[(e.LowerF = 102)] = "LowerF"),
              (e[(e.UpperZ = 90)] = "UpperZ"),
              (e[(e.LowerZ = 122)] = "LowerZ"),
              (e[(e.LowerX = 120)] = "LowerX"),
              (e[(e.OpeningSquareBracket = 91)] = "OpeningSquareBracket");
          })(t || (t = {})),
            (function (e) {
              (e[(e.Text = 1)] = "Text"),
                (e[(e.BeforeTagName = 2)] = "BeforeTagName"),
                (e[(e.InTagName = 3)] = "InTagName"),
                (e[(e.InSelfClosingTag = 4)] = "InSelfClosingTag"),
                (e[(e.BeforeClosingTagName = 5)] = "BeforeClosingTagName"),
                (e[(e.InClosingTagName = 6)] = "InClosingTagName"),
                (e[(e.AfterClosingTagName = 7)] = "AfterClosingTagName"),
                (e[(e.BeforeAttributeName = 8)] = "BeforeAttributeName"),
                (e[(e.InAttributeName = 9)] = "InAttributeName"),
                (e[(e.AfterAttributeName = 10)] = "AfterAttributeName"),
                (e[(e.BeforeAttributeValue = 11)] = "BeforeAttributeValue"),
                (e[(e.InAttributeValueDq = 12)] = "InAttributeValueDq"),
                (e[(e.InAttributeValueSq = 13)] = "InAttributeValueSq"),
                (e[(e.InAttributeValueNq = 14)] = "InAttributeValueNq"),
                (e[(e.BeforeDeclaration = 15)] = "BeforeDeclaration"),
                (e[(e.InDeclaration = 16)] = "InDeclaration"),
                (e[(e.InProcessingInstruction = 17)] =
                  "InProcessingInstruction"),
                (e[(e.BeforeComment = 18)] = "BeforeComment"),
                (e[(e.CDATASequence = 19)] = "CDATASequence"),
                (e[(e.InSpecialComment = 20)] = "InSpecialComment"),
                (e[(e.InCommentLike = 21)] = "InCommentLike"),
                (e[(e.BeforeSpecialS = 22)] = "BeforeSpecialS"),
                (e[(e.SpecialStartSequence = 23)] = "SpecialStartSequence"),
                (e[(e.InSpecialTag = 24)] = "InSpecialTag"),
                (e[(e.BeforeEntity = 25)] = "BeforeEntity"),
                (e[(e.BeforeNumericEntity = 26)] = "BeforeNumericEntity"),
                (e[(e.InNamedEntity = 27)] = "InNamedEntity"),
                (e[(e.InNumericEntity = 28)] = "InNumericEntity"),
                (e[(e.InHexEntity = 29)] = "InHexEntity");
            })(r || (r = {})),
            (function (e) {
              (e[(e.NoValue = 0)] = "NoValue"),
                (e[(e.Unquoted = 1)] = "Unquoted"),
                (e[(e.Single = 2)] = "Single"),
                (e[(e.Double = 3)] = "Double");
            })((n = e.QuoteType || (e.QuoteType = {})));
          var l = {
              Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
              CdataEnd: new Uint8Array([93, 93, 62]),
              CommentEnd: new Uint8Array([45, 45, 62]),
              ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
              StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
              TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
            },
            c = (function () {
              function e(e, t) {
                var n = e.xmlMode,
                  o = void 0 !== n && n,
                  s = e.decodeEntities,
                  a = void 0 === s || s;
                (this.cbs = t),
                  (this.state = r.Text),
                  (this.buffer = ""),
                  (this.sectionStart = 0),
                  (this.index = 0),
                  (this.baseState = r.Text),
                  (this.isSpecial = !1),
                  (this.running = !0),
                  (this.offset = 0),
                  (this.currentSequence = void 0),
                  (this.sequenceIndex = 0),
                  (this.trieIndex = 0),
                  (this.trieCurrent = 0),
                  (this.entityResult = 0),
                  (this.entityExcess = 0),
                  (this.xmlMode = o),
                  (this.decodeEntities = a),
                  (this.entityTrie = o ? i.xmlDecodeTree : i.htmlDecodeTree);
              }
              return (
                (e.prototype.reset = function () {
                  (this.state = r.Text),
                    (this.buffer = ""),
                    (this.sectionStart = 0),
                    (this.index = 0),
                    (this.baseState = r.Text),
                    (this.currentSequence = void 0),
                    (this.running = !0),
                    (this.offset = 0);
                }),
                (e.prototype.write = function (e) {
                  (this.offset += this.buffer.length),
                    (this.buffer = e),
                    this.parse();
                }),
                (e.prototype.end = function () {
                  this.running && this.finish();
                }),
                (e.prototype.pause = function () {
                  this.running = !1;
                }),
                (e.prototype.resume = function () {
                  (this.running = !0),
                    this.index < this.buffer.length + this.offset &&
                      this.parse();
                }),
                (e.prototype.getIndex = function () {
                  return this.index;
                }),
                (e.prototype.getSectionStart = function () {
                  return this.sectionStart;
                }),
                (e.prototype.stateText = function (e) {
                  e === t.Lt ||
                  (!this.decodeEntities && this.fastForwardTo(t.Lt))
                    ? (this.index > this.sectionStart &&
                        this.cbs.ontext(this.sectionStart, this.index),
                      (this.state = r.BeforeTagName),
                      (this.sectionStart = this.index))
                    : this.decodeEntities &&
                      e === t.Amp &&
                      (this.state = r.BeforeEntity);
                }),
                (e.prototype.stateSpecialStartSequence = function (e) {
                  var t = this.sequenceIndex === this.currentSequence.length;
                  if (
                    t
                      ? s(e)
                      : (32 | e) === this.currentSequence[this.sequenceIndex]
                  ) {
                    if (!t) return void this.sequenceIndex++;
                  } else this.isSpecial = !1;
                  (this.sequenceIndex = 0),
                    (this.state = r.InTagName),
                    this.stateInTagName(e);
                }),
                (e.prototype.stateInSpecialTag = function (e) {
                  if (this.sequenceIndex === this.currentSequence.length) {
                    if (e === t.Gt || o(e)) {
                      var n = this.index - this.currentSequence.length;
                      if (this.sectionStart < n) {
                        var i = this.index;
                        (this.index = n),
                          this.cbs.ontext(this.sectionStart, n),
                          (this.index = i);
                      }
                      return (
                        (this.isSpecial = !1),
                        (this.sectionStart = n + 2),
                        void this.stateInClosingTagName(e)
                      );
                    }
                    this.sequenceIndex = 0;
                  }
                  (32 | e) === this.currentSequence[this.sequenceIndex]
                    ? (this.sequenceIndex += 1)
                    : 0 === this.sequenceIndex
                    ? this.currentSequence === l.TitleEnd
                      ? this.decodeEntities &&
                        e === t.Amp &&
                        (this.state = r.BeforeEntity)
                      : this.fastForwardTo(t.Lt) && (this.sequenceIndex = 1)
                    : (this.sequenceIndex = Number(e === t.Lt));
                }),
                (e.prototype.stateCDATASequence = function (e) {
                  e === l.Cdata[this.sequenceIndex]
                    ? ++this.sequenceIndex === l.Cdata.length &&
                      ((this.state = r.InCommentLike),
                      (this.currentSequence = l.CdataEnd),
                      (this.sequenceIndex = 0),
                      (this.sectionStart = this.index + 1))
                    : ((this.sequenceIndex = 0),
                      (this.state = r.InDeclaration),
                      this.stateInDeclaration(e));
                }),
                (e.prototype.fastForwardTo = function (e) {
                  for (; ++this.index < this.buffer.length + this.offset; )
                    if (this.buffer.charCodeAt(this.index - this.offset) === e)
                      return !0;
                  return (
                    (this.index = this.buffer.length + this.offset - 1), !1
                  );
                }),
                (e.prototype.stateInCommentLike = function (e) {
                  e === this.currentSequence[this.sequenceIndex]
                    ? ++this.sequenceIndex === this.currentSequence.length &&
                      (this.currentSequence === l.CdataEnd
                        ? this.cbs.oncdata(this.sectionStart, this.index, 2)
                        : this.cbs.oncomment(this.sectionStart, this.index, 2),
                      (this.sequenceIndex = 0),
                      (this.sectionStart = this.index + 1),
                      (this.state = r.Text))
                    : 0 === this.sequenceIndex
                    ? this.fastForwardTo(this.currentSequence[0]) &&
                      (this.sequenceIndex = 1)
                    : e !== this.currentSequence[this.sequenceIndex - 1] &&
                      (this.sequenceIndex = 0);
                }),
                (e.prototype.isTagStartChar = function (e) {
                  return this.xmlMode
                    ? !s(e)
                    : (function (e) {
                        return (
                          (e >= t.LowerA && e <= t.LowerZ) ||
                          (e >= t.UpperA && e <= t.UpperZ)
                        );
                      })(e);
                }),
                (e.prototype.startSpecial = function (e, t) {
                  (this.isSpecial = !0),
                    (this.currentSequence = e),
                    (this.sequenceIndex = t),
                    (this.state = r.SpecialStartSequence);
                }),
                (e.prototype.stateBeforeTagName = function (e) {
                  if (e === t.ExclamationMark)
                    (this.state = r.BeforeDeclaration),
                      (this.sectionStart = this.index + 1);
                  else if (e === t.Questionmark)
                    (this.state = r.InProcessingInstruction),
                      (this.sectionStart = this.index + 1);
                  else if (this.isTagStartChar(e)) {
                    var n = 32 | e;
                    (this.sectionStart = this.index),
                      this.xmlMode || n !== l.TitleEnd[2]
                        ? (this.state =
                            this.xmlMode || n !== l.ScriptEnd[2]
                              ? r.InTagName
                              : r.BeforeSpecialS)
                        : this.startSpecial(l.TitleEnd, 3);
                  } else
                    e === t.Slash
                      ? (this.state = r.BeforeClosingTagName)
                      : ((this.state = r.Text), this.stateText(e));
                }),
                (e.prototype.stateInTagName = function (e) {
                  s(e) &&
                    (this.cbs.onopentagname(this.sectionStart, this.index),
                    (this.sectionStart = -1),
                    (this.state = r.BeforeAttributeName),
                    this.stateBeforeAttributeName(e));
                }),
                (e.prototype.stateBeforeClosingTagName = function (e) {
                  o(e) ||
                    (e === t.Gt
                      ? (this.state = r.Text)
                      : ((this.state = this.isTagStartChar(e)
                          ? r.InClosingTagName
                          : r.InSpecialComment),
                        (this.sectionStart = this.index)));
                }),
                (e.prototype.stateInClosingTagName = function (e) {
                  (e === t.Gt || o(e)) &&
                    (this.cbs.onclosetag(this.sectionStart, this.index),
                    (this.sectionStart = -1),
                    (this.state = r.AfterClosingTagName),
                    this.stateAfterClosingTagName(e));
                }),
                (e.prototype.stateAfterClosingTagName = function (e) {
                  (e === t.Gt || this.fastForwardTo(t.Gt)) &&
                    ((this.state = r.Text),
                    (this.baseState = r.Text),
                    (this.sectionStart = this.index + 1));
                }),
                (e.prototype.stateBeforeAttributeName = function (e) {
                  e === t.Gt
                    ? (this.cbs.onopentagend(this.index),
                      this.isSpecial
                        ? ((this.state = r.InSpecialTag),
                          (this.sequenceIndex = 0))
                        : (this.state = r.Text),
                      (this.baseState = this.state),
                      (this.sectionStart = this.index + 1))
                    : e === t.Slash
                    ? (this.state = r.InSelfClosingTag)
                    : o(e) ||
                      ((this.state = r.InAttributeName),
                      (this.sectionStart = this.index));
                }),
                (e.prototype.stateInSelfClosingTag = function (e) {
                  e === t.Gt
                    ? (this.cbs.onselfclosingtag(this.index),
                      (this.state = r.Text),
                      (this.baseState = r.Text),
                      (this.sectionStart = this.index + 1),
                      (this.isSpecial = !1))
                    : o(e) ||
                      ((this.state = r.BeforeAttributeName),
                      this.stateBeforeAttributeName(e));
                }),
                (e.prototype.stateInAttributeName = function (e) {
                  (e === t.Eq || s(e)) &&
                    (this.cbs.onattribname(this.sectionStart, this.index),
                    (this.sectionStart = -1),
                    (this.state = r.AfterAttributeName),
                    this.stateAfterAttributeName(e));
                }),
                (e.prototype.stateAfterAttributeName = function (e) {
                  e === t.Eq
                    ? (this.state = r.BeforeAttributeValue)
                    : e === t.Slash || e === t.Gt
                    ? (this.cbs.onattribend(n.NoValue, this.index),
                      (this.state = r.BeforeAttributeName),
                      this.stateBeforeAttributeName(e))
                    : o(e) ||
                      (this.cbs.onattribend(n.NoValue, this.index),
                      (this.state = r.InAttributeName),
                      (this.sectionStart = this.index));
                }),
                (e.prototype.stateBeforeAttributeValue = function (e) {
                  e === t.DoubleQuote
                    ? ((this.state = r.InAttributeValueDq),
                      (this.sectionStart = this.index + 1))
                    : e === t.SingleQuote
                    ? ((this.state = r.InAttributeValueSq),
                      (this.sectionStart = this.index + 1))
                    : o(e) ||
                      ((this.sectionStart = this.index),
                      (this.state = r.InAttributeValueNq),
                      this.stateInAttributeValueNoQuotes(e));
                }),
                (e.prototype.handleInAttributeValue = function (e, i) {
                  e === i || (!this.decodeEntities && this.fastForwardTo(i))
                    ? (this.cbs.onattribdata(this.sectionStart, this.index),
                      (this.sectionStart = -1),
                      this.cbs.onattribend(
                        i === t.DoubleQuote ? n.Double : n.Single,
                        this.index
                      ),
                      (this.state = r.BeforeAttributeName))
                    : this.decodeEntities &&
                      e === t.Amp &&
                      ((this.baseState = this.state),
                      (this.state = r.BeforeEntity));
                }),
                (e.prototype.stateInAttributeValueDoubleQuotes = function (e) {
                  this.handleInAttributeValue(e, t.DoubleQuote);
                }),
                (e.prototype.stateInAttributeValueSingleQuotes = function (e) {
                  this.handleInAttributeValue(e, t.SingleQuote);
                }),
                (e.prototype.stateInAttributeValueNoQuotes = function (e) {
                  o(e) || e === t.Gt
                    ? (this.cbs.onattribdata(this.sectionStart, this.index),
                      (this.sectionStart = -1),
                      this.cbs.onattribend(n.Unquoted, this.index),
                      (this.state = r.BeforeAttributeName),
                      this.stateBeforeAttributeName(e))
                    : this.decodeEntities &&
                      e === t.Amp &&
                      ((this.baseState = this.state),
                      (this.state = r.BeforeEntity));
                }),
                (e.prototype.stateBeforeDeclaration = function (e) {
                  e === t.OpeningSquareBracket
                    ? ((this.state = r.CDATASequence), (this.sequenceIndex = 0))
                    : (this.state =
                        e === t.Dash ? r.BeforeComment : r.InDeclaration);
                }),
                (e.prototype.stateInDeclaration = function (e) {
                  (e === t.Gt || this.fastForwardTo(t.Gt)) &&
                    (this.cbs.ondeclaration(this.sectionStart, this.index),
                    (this.state = r.Text),
                    (this.sectionStart = this.index + 1));
                }),
                (e.prototype.stateInProcessingInstruction = function (e) {
                  (e === t.Gt || this.fastForwardTo(t.Gt)) &&
                    (this.cbs.onprocessinginstruction(
                      this.sectionStart,
                      this.index
                    ),
                    (this.state = r.Text),
                    (this.sectionStart = this.index + 1));
                }),
                (e.prototype.stateBeforeComment = function (e) {
                  e === t.Dash
                    ? ((this.state = r.InCommentLike),
                      (this.currentSequence = l.CommentEnd),
                      (this.sequenceIndex = 2),
                      (this.sectionStart = this.index + 1))
                    : (this.state = r.InDeclaration);
                }),
                (e.prototype.stateInSpecialComment = function (e) {
                  (e === t.Gt || this.fastForwardTo(t.Gt)) &&
                    (this.cbs.oncomment(this.sectionStart, this.index, 0),
                    (this.state = r.Text),
                    (this.sectionStart = this.index + 1));
                }),
                (e.prototype.stateBeforeSpecialS = function (e) {
                  var t = 32 | e;
                  t === l.ScriptEnd[3]
                    ? this.startSpecial(l.ScriptEnd, 4)
                    : t === l.StyleEnd[3]
                    ? this.startSpecial(l.StyleEnd, 4)
                    : ((this.state = r.InTagName), this.stateInTagName(e));
                }),
                (e.prototype.stateBeforeEntity = function (e) {
                  (this.entityExcess = 1),
                    (this.entityResult = 0),
                    e === t.Number
                      ? (this.state = r.BeforeNumericEntity)
                      : e === t.Amp ||
                        ((this.trieIndex = 0),
                        (this.trieCurrent = this.entityTrie[0]),
                        (this.state = r.InNamedEntity),
                        this.stateInNamedEntity(e));
                }),
                (e.prototype.stateInNamedEntity = function (e) {
                  if (
                    ((this.entityExcess += 1),
                    (this.trieIndex = (0, i.determineBranch)(
                      this.entityTrie,
                      this.trieCurrent,
                      this.trieIndex + 1,
                      e
                    )),
                    this.trieIndex < 0)
                  )
                    return this.emitNamedEntity(), void this.index--;
                  this.trieCurrent = this.entityTrie[this.trieIndex];
                  var r = this.trieCurrent & i.BinTrieFlags.VALUE_LENGTH;
                  if (r) {
                    var n = (r >> 14) - 1;
                    if (this.allowLegacyEntity() || e === t.Semi) {
                      var o = this.index - this.entityExcess + 1;
                      o > this.sectionStart &&
                        this.emitPartial(this.sectionStart, o),
                        (this.entityResult = this.trieIndex),
                        (this.trieIndex += n),
                        (this.entityExcess = 0),
                        (this.sectionStart = this.index + 1),
                        0 === n && this.emitNamedEntity();
                    } else this.trieIndex += n;
                  }
                }),
                (e.prototype.emitNamedEntity = function () {
                  if (((this.state = this.baseState), 0 !== this.entityResult))
                    switch (
                      (this.entityTrie[this.entityResult] &
                        i.BinTrieFlags.VALUE_LENGTH) >>
                      14
                    ) {
                      case 1:
                        this.emitCodePoint(
                          this.entityTrie[this.entityResult] &
                            ~i.BinTrieFlags.VALUE_LENGTH
                        );
                        break;
                      case 2:
                        this.emitCodePoint(
                          this.entityTrie[this.entityResult + 1]
                        );
                        break;
                      case 3:
                        this.emitCodePoint(
                          this.entityTrie[this.entityResult + 1]
                        ),
                          this.emitCodePoint(
                            this.entityTrie[this.entityResult + 2]
                          );
                    }
                }),
                (e.prototype.stateBeforeNumericEntity = function (e) {
                  (32 | e) === t.LowerX
                    ? (this.entityExcess++, (this.state = r.InHexEntity))
                    : ((this.state = r.InNumericEntity),
                      this.stateInNumericEntity(e));
                }),
                (e.prototype.emitNumericEntity = function (e) {
                  var t = this.index - this.entityExcess - 1;
                  t + 2 + Number(this.state === r.InHexEntity) !== this.index &&
                    (t > this.sectionStart &&
                      this.emitPartial(this.sectionStart, t),
                    (this.sectionStart = this.index + Number(e)),
                    this.emitCodePoint(
                      (0, i.replaceCodePoint)(this.entityResult)
                    )),
                    (this.state = this.baseState);
                }),
                (e.prototype.stateInNumericEntity = function (e) {
                  e === t.Semi
                    ? this.emitNumericEntity(!0)
                    : a(e)
                    ? ((this.entityResult =
                        10 * this.entityResult + (e - t.Zero)),
                      this.entityExcess++)
                    : (this.allowLegacyEntity()
                        ? this.emitNumericEntity(!1)
                        : (this.state = this.baseState),
                      this.index--);
                }),
                (e.prototype.stateInHexEntity = function (e) {
                  e === t.Semi
                    ? this.emitNumericEntity(!0)
                    : a(e)
                    ? ((this.entityResult =
                        16 * this.entityResult + (e - t.Zero)),
                      this.entityExcess++)
                    : !(function (e) {
                        return (
                          (e >= t.UpperA && e <= t.UpperF) ||
                          (e >= t.LowerA && e <= t.LowerF)
                        );
                      })(e)
                    ? (this.allowLegacyEntity()
                        ? this.emitNumericEntity(!1)
                        : (this.state = this.baseState),
                      this.index--)
                    : ((this.entityResult =
                        16 * this.entityResult + ((32 | e) - t.LowerA + 10)),
                      this.entityExcess++);
                }),
                (e.prototype.allowLegacyEntity = function () {
                  return (
                    !this.xmlMode &&
                    (this.baseState === r.Text ||
                      this.baseState === r.InSpecialTag)
                  );
                }),
                (e.prototype.cleanup = function () {
                  this.running &&
                    this.sectionStart !== this.index &&
                    (this.state === r.Text ||
                    (this.state === r.InSpecialTag && 0 === this.sequenceIndex)
                      ? (this.cbs.ontext(this.sectionStart, this.index),
                        (this.sectionStart = this.index))
                      : (this.state !== r.InAttributeValueDq &&
                          this.state !== r.InAttributeValueSq &&
                          this.state !== r.InAttributeValueNq) ||
                        (this.cbs.onattribdata(this.sectionStart, this.index),
                        (this.sectionStart = this.index)));
                }),
                (e.prototype.shouldContinue = function () {
                  return (
                    this.index < this.buffer.length + this.offset &&
                    this.running
                  );
                }),
                (e.prototype.parse = function () {
                  for (; this.shouldContinue(); ) {
                    var e = this.buffer.charCodeAt(this.index - this.offset);
                    switch (this.state) {
                      case r.Text:
                        this.stateText(e);
                        break;
                      case r.SpecialStartSequence:
                        this.stateSpecialStartSequence(e);
                        break;
                      case r.InSpecialTag:
                        this.stateInSpecialTag(e);
                        break;
                      case r.CDATASequence:
                        this.stateCDATASequence(e);
                        break;
                      case r.InAttributeValueDq:
                        this.stateInAttributeValueDoubleQuotes(e);
                        break;
                      case r.InAttributeName:
                        this.stateInAttributeName(e);
                        break;
                      case r.InCommentLike:
                        this.stateInCommentLike(e);
                        break;
                      case r.InSpecialComment:
                        this.stateInSpecialComment(e);
                        break;
                      case r.BeforeAttributeName:
                        this.stateBeforeAttributeName(e);
                        break;
                      case r.InTagName:
                        this.stateInTagName(e);
                        break;
                      case r.InClosingTagName:
                        this.stateInClosingTagName(e);
                        break;
                      case r.BeforeTagName:
                        this.stateBeforeTagName(e);
                        break;
                      case r.AfterAttributeName:
                        this.stateAfterAttributeName(e);
                        break;
                      case r.InAttributeValueSq:
                        this.stateInAttributeValueSingleQuotes(e);
                        break;
                      case r.BeforeAttributeValue:
                        this.stateBeforeAttributeValue(e);
                        break;
                      case r.BeforeClosingTagName:
                        this.stateBeforeClosingTagName(e);
                        break;
                      case r.AfterClosingTagName:
                        this.stateAfterClosingTagName(e);
                        break;
                      case r.BeforeSpecialS:
                        this.stateBeforeSpecialS(e);
                        break;
                      case r.InAttributeValueNq:
                        this.stateInAttributeValueNoQuotes(e);
                        break;
                      case r.InSelfClosingTag:
                        this.stateInSelfClosingTag(e);
                        break;
                      case r.InDeclaration:
                        this.stateInDeclaration(e);
                        break;
                      case r.BeforeDeclaration:
                        this.stateBeforeDeclaration(e);
                        break;
                      case r.BeforeComment:
                        this.stateBeforeComment(e);
                        break;
                      case r.InProcessingInstruction:
                        this.stateInProcessingInstruction(e);
                        break;
                      case r.InNamedEntity:
                        this.stateInNamedEntity(e);
                        break;
                      case r.BeforeEntity:
                        this.stateBeforeEntity(e);
                        break;
                      case r.InHexEntity:
                        this.stateInHexEntity(e);
                        break;
                      case r.InNumericEntity:
                        this.stateInNumericEntity(e);
                        break;
                      default:
                        this.stateBeforeNumericEntity(e);
                    }
                    this.index++;
                  }
                  this.cleanup();
                }),
                (e.prototype.finish = function () {
                  this.state === r.InNamedEntity && this.emitNamedEntity(),
                    this.sectionStart < this.index && this.handleTrailingData(),
                    this.cbs.onend();
                }),
                (e.prototype.handleTrailingData = function () {
                  var e = this.buffer.length + this.offset;
                  this.state === r.InCommentLike
                    ? this.currentSequence === l.CdataEnd
                      ? this.cbs.oncdata(this.sectionStart, e, 0)
                      : this.cbs.oncomment(this.sectionStart, e, 0)
                    : (this.state === r.InNumericEntity &&
                        this.allowLegacyEntity()) ||
                      (this.state === r.InHexEntity && this.allowLegacyEntity())
                    ? this.emitNumericEntity(!1)
                    : this.state === r.InTagName ||
                      this.state === r.BeforeAttributeName ||
                      this.state === r.BeforeAttributeValue ||
                      this.state === r.AfterAttributeName ||
                      this.state === r.InAttributeName ||
                      this.state === r.InAttributeValueSq ||
                      this.state === r.InAttributeValueDq ||
                      this.state === r.InAttributeValueNq ||
                      this.state === r.InClosingTagName ||
                      this.cbs.ontext(this.sectionStart, e);
                }),
                (e.prototype.emitPartial = function (e, t) {
                  this.baseState !== r.Text && this.baseState !== r.InSpecialTag
                    ? this.cbs.onattribdata(e, t)
                    : this.cbs.ontext(e, t);
                }),
                (e.prototype.emitCodePoint = function (e) {
                  this.baseState !== r.Text && this.baseState !== r.InSpecialTag
                    ? this.cbs.onattribentity(e)
                    : this.cbs.ontextentity(e);
                }),
                e
              );
            })();
          e.default = c;
        })(fi)),
      fi
    );
  }
  function Pi() {
    if (ki) return hi;
    ki = 1;
    var e =
        (hi && hi.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              void 0 === n && (n = r);
              var i = Object.getOwnPropertyDescriptor(t, r);
              (i &&
                !("get" in i ? !t.__esModule : i.writable || i.configurable)) ||
                (i = {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }),
                Object.defineProperty(e, n, i);
            }
          : function (e, t, r, n) {
              void 0 === n && (n = r), (e[n] = t[r]);
            }),
      t =
        (hi && hi.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, "default", { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      r =
        (hi && hi.__importStar) ||
        function (r) {
          if (r && r.__esModule) return r;
          var n = {};
          if (null != r)
            for (var i in r)
              "default" !== i &&
                Object.prototype.hasOwnProperty.call(r, i) &&
                e(n, r, i);
          return t(n, r), n;
        };
    Object.defineProperty(hi, "__esModule", { value: !0 }),
      (hi.Parser = void 0);
    var n = r(Oi()),
      i = Ai(),
      o = new Set([
        "input",
        "option",
        "optgroup",
        "select",
        "button",
        "datalist",
        "textarea",
      ]),
      s = new Set(["p"]),
      a = new Set(["thead", "tbody"]),
      l = new Set(["dd", "dt"]),
      c = new Set(["rt", "rp"]),
      u = new Map([
        ["tr", new Set(["tr", "th", "td"])],
        ["th", new Set(["th"])],
        ["td", new Set(["thead", "th", "td"])],
        ["body", new Set(["head", "link", "script"])],
        ["li", new Set(["li"])],
        ["p", s],
        ["h1", s],
        ["h2", s],
        ["h3", s],
        ["h4", s],
        ["h5", s],
        ["h6", s],
        ["select", o],
        ["input", o],
        ["output", o],
        ["button", o],
        ["datalist", o],
        ["textarea", o],
        ["option", new Set(["option"])],
        ["optgroup", new Set(["optgroup", "option"])],
        ["dd", l],
        ["dt", l],
        ["address", s],
        ["article", s],
        ["aside", s],
        ["blockquote", s],
        ["details", s],
        ["div", s],
        ["dl", s],
        ["fieldset", s],
        ["figcaption", s],
        ["figure", s],
        ["footer", s],
        ["form", s],
        ["header", s],
        ["hr", s],
        ["main", s],
        ["nav", s],
        ["ol", s],
        ["pre", s],
        ["section", s],
        ["table", s],
        ["ul", s],
        ["rt", c],
        ["rp", c],
        ["tbody", a],
        ["tfoot", a],
      ]),
      d = new Set([
        "area",
        "base",
        "basefont",
        "br",
        "col",
        "command",
        "embed",
        "frame",
        "hr",
        "img",
        "input",
        "isindex",
        "keygen",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
      ]),
      p = new Set(["math", "svg"]),
      h = new Set([
        "mi",
        "mo",
        "mn",
        "ms",
        "mtext",
        "annotation-xml",
        "foreignobject",
        "desc",
        "title",
      ]),
      f = /\s|\//,
      g = (function () {
        function e(e, t) {
          var r, i, o, s, a;
          void 0 === t && (t = {}),
            (this.options = t),
            (this.startIndex = 0),
            (this.endIndex = 0),
            (this.openTagStart = 0),
            (this.tagname = ""),
            (this.attribname = ""),
            (this.attribvalue = ""),
            (this.attribs = null),
            (this.stack = []),
            (this.foreignContext = []),
            (this.buffers = []),
            (this.bufferOffset = 0),
            (this.writeIndex = 0),
            (this.ended = !1),
            (this.cbs = null != e ? e : {}),
            (this.lowerCaseTagNames =
              null !== (r = t.lowerCaseTags) && void 0 !== r ? r : !t.xmlMode),
            (this.lowerCaseAttributeNames =
              null !== (i = t.lowerCaseAttributeNames) && void 0 !== i
                ? i
                : !t.xmlMode),
            (this.tokenizer = new (
              null !== (o = t.Tokenizer) && void 0 !== o ? o : n.default
            )(this.options, this)),
            null === (a = (s = this.cbs).onparserinit) ||
              void 0 === a ||
              a.call(s, this);
        }
        return (
          (e.prototype.ontext = function (e, t) {
            var r,
              n,
              i = this.getSlice(e, t);
            (this.endIndex = t - 1),
              null === (n = (r = this.cbs).ontext) ||
                void 0 === n ||
                n.call(r, i),
              (this.startIndex = t);
          }),
          (e.prototype.ontextentity = function (e) {
            var t,
              r,
              n = this.tokenizer.getSectionStart();
            (this.endIndex = n - 1),
              null === (r = (t = this.cbs).ontext) ||
                void 0 === r ||
                r.call(t, (0, i.fromCodePoint)(e)),
              (this.startIndex = n);
          }),
          (e.prototype.isVoidElement = function (e) {
            return !this.options.xmlMode && d.has(e);
          }),
          (e.prototype.onopentagname = function (e, t) {
            this.endIndex = t;
            var r = this.getSlice(e, t);
            this.lowerCaseTagNames && (r = r.toLowerCase()),
              this.emitOpenTag(r);
          }),
          (e.prototype.emitOpenTag = function (e) {
            var t, r, n, i;
            (this.openTagStart = this.startIndex), (this.tagname = e);
            var o = !this.options.xmlMode && u.get(e);
            if (o)
              for (
                ;
                this.stack.length > 0 &&
                o.has(this.stack[this.stack.length - 1]);

              ) {
                var s = this.stack.pop();
                null === (r = (t = this.cbs).onclosetag) ||
                  void 0 === r ||
                  r.call(t, s, !0);
              }
            this.isVoidElement(e) ||
              (this.stack.push(e),
              p.has(e)
                ? this.foreignContext.push(!0)
                : h.has(e) && this.foreignContext.push(!1)),
              null === (i = (n = this.cbs).onopentagname) ||
                void 0 === i ||
                i.call(n, e),
              this.cbs.onopentag && (this.attribs = {});
          }),
          (e.prototype.endOpenTag = function (e) {
            var t, r;
            (this.startIndex = this.openTagStart),
              this.attribs &&
                (null === (r = (t = this.cbs).onopentag) ||
                  void 0 === r ||
                  r.call(t, this.tagname, this.attribs, e),
                (this.attribs = null)),
              this.cbs.onclosetag &&
                this.isVoidElement(this.tagname) &&
                this.cbs.onclosetag(this.tagname, !0),
              (this.tagname = "");
          }),
          (e.prototype.onopentagend = function (e) {
            (this.endIndex = e), this.endOpenTag(!1), (this.startIndex = e + 1);
          }),
          (e.prototype.onclosetag = function (e, t) {
            var r, n, i, o, s, a;
            this.endIndex = t;
            var l = this.getSlice(e, t);
            if (
              (this.lowerCaseTagNames && (l = l.toLowerCase()),
              (p.has(l) || h.has(l)) && this.foreignContext.pop(),
              this.isVoidElement(l))
            )
              this.options.xmlMode ||
                "br" !== l ||
                (null === (n = (r = this.cbs).onopentagname) ||
                  void 0 === n ||
                  n.call(r, "br"),
                null === (o = (i = this.cbs).onopentag) ||
                  void 0 === o ||
                  o.call(i, "br", {}, !0),
                null === (a = (s = this.cbs).onclosetag) ||
                  void 0 === a ||
                  a.call(s, "br", !1));
            else {
              var c = this.stack.lastIndexOf(l);
              if (-1 !== c)
                if (this.cbs.onclosetag)
                  for (var u = this.stack.length - c; u--; )
                    this.cbs.onclosetag(this.stack.pop(), 0 !== u);
                else this.stack.length = c;
              else
                this.options.xmlMode ||
                  "p" !== l ||
                  (this.emitOpenTag("p"), this.closeCurrentTag(!0));
            }
            this.startIndex = t + 1;
          }),
          (e.prototype.onselfclosingtag = function (e) {
            (this.endIndex = e),
              this.options.xmlMode ||
              this.options.recognizeSelfClosing ||
              this.foreignContext[this.foreignContext.length - 1]
                ? (this.closeCurrentTag(!1), (this.startIndex = e + 1))
                : this.onopentagend(e);
          }),
          (e.prototype.closeCurrentTag = function (e) {
            var t,
              r,
              n = this.tagname;
            this.endOpenTag(e),
              this.stack[this.stack.length - 1] === n &&
                (null === (r = (t = this.cbs).onclosetag) ||
                  void 0 === r ||
                  r.call(t, n, !e),
                this.stack.pop());
          }),
          (e.prototype.onattribname = function (e, t) {
            this.startIndex = e;
            var r = this.getSlice(e, t);
            this.attribname = this.lowerCaseAttributeNames
              ? r.toLowerCase()
              : r;
          }),
          (e.prototype.onattribdata = function (e, t) {
            this.attribvalue += this.getSlice(e, t);
          }),
          (e.prototype.onattribentity = function (e) {
            this.attribvalue += (0, i.fromCodePoint)(e);
          }),
          (e.prototype.onattribend = function (e, t) {
            var r, i;
            (this.endIndex = t),
              null === (i = (r = this.cbs).onattribute) ||
                void 0 === i ||
                i.call(
                  r,
                  this.attribname,
                  this.attribvalue,
                  e === n.QuoteType.Double
                    ? '"'
                    : e === n.QuoteType.Single
                    ? "'"
                    : e === n.QuoteType.NoValue
                    ? void 0
                    : null
                ),
              this.attribs &&
                !Object.prototype.hasOwnProperty.call(
                  this.attribs,
                  this.attribname
                ) &&
                (this.attribs[this.attribname] = this.attribvalue),
              (this.attribvalue = "");
          }),
          (e.prototype.getInstructionName = function (e) {
            var t = e.search(f),
              r = t < 0 ? e : e.substr(0, t);
            return this.lowerCaseTagNames && (r = r.toLowerCase()), r;
          }),
          (e.prototype.ondeclaration = function (e, t) {
            this.endIndex = t;
            var r = this.getSlice(e, t);
            if (this.cbs.onprocessinginstruction) {
              var n = this.getInstructionName(r);
              this.cbs.onprocessinginstruction("!".concat(n), "!".concat(r));
            }
            this.startIndex = t + 1;
          }),
          (e.prototype.onprocessinginstruction = function (e, t) {
            this.endIndex = t;
            var r = this.getSlice(e, t);
            if (this.cbs.onprocessinginstruction) {
              var n = this.getInstructionName(r);
              this.cbs.onprocessinginstruction("?".concat(n), "?".concat(r));
            }
            this.startIndex = t + 1;
          }),
          (e.prototype.oncomment = function (e, t, r) {
            var n, i, o, s;
            (this.endIndex = t),
              null === (i = (n = this.cbs).oncomment) ||
                void 0 === i ||
                i.call(n, this.getSlice(e, t - r)),
              null === (s = (o = this.cbs).oncommentend) ||
                void 0 === s ||
                s.call(o),
              (this.startIndex = t + 1);
          }),
          (e.prototype.oncdata = function (e, t, r) {
            var n, i, o, s, a, l, c, u, d, p;
            this.endIndex = t;
            var h = this.getSlice(e, t - r);
            this.options.xmlMode || this.options.recognizeCDATA
              ? (null === (i = (n = this.cbs).oncdatastart) ||
                  void 0 === i ||
                  i.call(n),
                null === (s = (o = this.cbs).ontext) ||
                  void 0 === s ||
                  s.call(o, h),
                null === (l = (a = this.cbs).oncdataend) ||
                  void 0 === l ||
                  l.call(a))
              : (null === (u = (c = this.cbs).oncomment) ||
                  void 0 === u ||
                  u.call(c, "[CDATA[".concat(h, "]]")),
                null === (p = (d = this.cbs).oncommentend) ||
                  void 0 === p ||
                  p.call(d)),
              (this.startIndex = t + 1);
          }),
          (e.prototype.onend = function () {
            var e, t;
            if (this.cbs.onclosetag) {
              this.endIndex = this.startIndex;
              for (
                var r = this.stack.length;
                r > 0;
                this.cbs.onclosetag(this.stack[--r], !0)
              );
            }
            null === (t = (e = this.cbs).onend) || void 0 === t || t.call(e);
          }),
          (e.prototype.reset = function () {
            var e, t, r, n;
            null === (t = (e = this.cbs).onreset) || void 0 === t || t.call(e),
              this.tokenizer.reset(),
              (this.tagname = ""),
              (this.attribname = ""),
              (this.attribs = null),
              (this.stack.length = 0),
              (this.startIndex = 0),
              (this.endIndex = 0),
              null === (n = (r = this.cbs).onparserinit) ||
                void 0 === n ||
                n.call(r, this),
              (this.buffers.length = 0),
              (this.bufferOffset = 0),
              (this.writeIndex = 0),
              (this.ended = !1);
          }),
          (e.prototype.parseComplete = function (e) {
            this.reset(), this.end(e);
          }),
          (e.prototype.getSlice = function (e, t) {
            for (; e - this.bufferOffset >= this.buffers[0].length; )
              this.shiftBuffer();
            for (
              var r = this.buffers[0].slice(
                e - this.bufferOffset,
                t - this.bufferOffset
              );
              t - this.bufferOffset > this.buffers[0].length;

            )
              this.shiftBuffer(),
                (r += this.buffers[0].slice(0, t - this.bufferOffset));
            return r;
          }),
          (e.prototype.shiftBuffer = function () {
            (this.bufferOffset += this.buffers[0].length),
              this.writeIndex--,
              this.buffers.shift();
          }),
          (e.prototype.write = function (e) {
            var t, r;
            this.ended
              ? null === (r = (t = this.cbs).onerror) ||
                void 0 === r ||
                r.call(t, new Error(".write() after done!"))
              : (this.buffers.push(e),
                this.tokenizer.running &&
                  (this.tokenizer.write(e), this.writeIndex++));
          }),
          (e.prototype.end = function (e) {
            var t, r;
            this.ended
              ? null === (r = (t = this.cbs).onerror) ||
                void 0 === r ||
                r.call(t, new Error(".end() after done!"))
              : (e && this.write(e), (this.ended = !0), this.tokenizer.end());
          }),
          (e.prototype.pause = function () {
            this.tokenizer.pause();
          }),
          (e.prototype.resume = function () {
            for (
              this.tokenizer.resume();
              this.tokenizer.running && this.writeIndex < this.buffers.length;

            )
              this.tokenizer.write(this.buffers[this.writeIndex++]);
            this.ended && this.tokenizer.end();
          }),
          (e.prototype.parseChunk = function (e) {
            this.write(e);
          }),
          (e.prototype.done = function (e) {
            this.end(e);
          }),
          e
        );
      })();
    return (hi.Parser = g), hi;
  }
  var Mi,
    Ni = {},
    Ii = {};
  function _i() {
    return (
      Mi ||
        ((Mi = 1),
        (e = Ii),
        Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.Doctype =
          e.CDATA =
          e.Tag =
          e.Style =
          e.Script =
          e.Comment =
          e.Directive =
          e.Text =
          e.Root =
          e.isTag =
          e.ElementType =
            void 0),
        (function (e) {
          (e.Root = "root"),
            (e.Text = "text"),
            (e.Directive = "directive"),
            (e.Comment = "comment"),
            (e.Script = "script"),
            (e.Style = "style"),
            (e.Tag = "tag"),
            (e.CDATA = "cdata"),
            (e.Doctype = "doctype");
        })((t = e.ElementType || (e.ElementType = {}))),
        (e.isTag = function (e) {
          return e.type === t.Tag || e.type === t.Script || e.type === t.Style;
        }),
        (e.Root = t.Root),
        (e.Text = t.Text),
        (e.Directive = t.Directive),
        (e.Comment = t.Comment),
        (e.Script = t.Script),
        (e.Style = t.Style),
        (e.Tag = t.Tag),
        (e.CDATA = t.CDATA),
        (e.Doctype = t.Doctype)),
      Ii
    );
    var e, t;
  }
  var Li,
    Di,
    Ri = {};
  function $i() {
    if (Li) return Ri;
    Li = 1;
    var e,
      t =
        (Ri && Ri.__extends) ||
        ((e = function (t, r) {
          return (
            (e =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (e, t) {
                  e.__proto__ = t;
                }) ||
              function (e, t) {
                for (var r in t)
                  Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
              }),
            e(t, r)
          );
        }),
        function (t, r) {
          if ("function" != typeof r && null !== r)
            throw new TypeError(
              "Class extends value " +
                String(r) +
                " is not a constructor or null"
            );
          function n() {
            this.constructor = t;
          }
          e(t, r),
            (t.prototype =
              null === r
                ? Object.create(r)
                : ((n.prototype = r.prototype), new n()));
        }),
      r =
        (Ri && Ri.__assign) ||
        function () {
          return (
            (r =
              Object.assign ||
              function (e) {
                for (var t, r = 1, n = arguments.length; r < n; r++)
                  for (var i in (t = arguments[r]))
                    Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e;
              }),
            r.apply(this, arguments)
          );
        };
    Object.defineProperty(Ri, "__esModule", { value: !0 }),
      (Ri.cloneNode =
        Ri.hasChildren =
        Ri.isDocument =
        Ri.isDirective =
        Ri.isComment =
        Ri.isText =
        Ri.isCDATA =
        Ri.isTag =
        Ri.Element =
        Ri.Document =
        Ri.CDATA =
        Ri.NodeWithChildren =
        Ri.ProcessingInstruction =
        Ri.Comment =
        Ri.Text =
        Ri.DataNode =
        Ri.Node =
          void 0);
    var n = _i(),
      i = (function () {
        function e() {
          (this.parent = null),
            (this.prev = null),
            (this.next = null),
            (this.startIndex = null),
            (this.endIndex = null);
        }
        return (
          Object.defineProperty(e.prototype, "parentNode", {
            get: function () {
              return this.parent;
            },
            set: function (e) {
              this.parent = e;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "previousSibling", {
            get: function () {
              return this.prev;
            },
            set: function (e) {
              this.prev = e;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "nextSibling", {
            get: function () {
              return this.next;
            },
            set: function (e) {
              this.next = e;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (e.prototype.cloneNode = function (e) {
            return void 0 === e && (e = !1), b(this, e);
          }),
          e
        );
      })();
    Ri.Node = i;
    var o = (function (e) {
      function r(t) {
        var r = e.call(this) || this;
        return (r.data = t), r;
      }
      return (
        t(r, e),
        Object.defineProperty(r.prototype, "nodeValue", {
          get: function () {
            return this.data;
          },
          set: function (e) {
            this.data = e;
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })(i);
    Ri.DataNode = o;
    var s = (function (e) {
      function r() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        return (t.type = n.ElementType.Text), t;
      }
      return (
        t(r, e),
        Object.defineProperty(r.prototype, "nodeType", {
          get: function () {
            return 3;
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })(o);
    Ri.Text = s;
    var a = (function (e) {
      function r() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        return (t.type = n.ElementType.Comment), t;
      }
      return (
        t(r, e),
        Object.defineProperty(r.prototype, "nodeType", {
          get: function () {
            return 8;
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })(o);
    Ri.Comment = a;
    var l = (function (e) {
      function r(t, r) {
        var i = e.call(this, r) || this;
        return (i.name = t), (i.type = n.ElementType.Directive), i;
      }
      return (
        t(r, e),
        Object.defineProperty(r.prototype, "nodeType", {
          get: function () {
            return 1;
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })(o);
    Ri.ProcessingInstruction = l;
    var c = (function (e) {
      function r(t) {
        var r = e.call(this) || this;
        return (r.children = t), r;
      }
      return (
        t(r, e),
        Object.defineProperty(r.prototype, "firstChild", {
          get: function () {
            var e;
            return null !== (e = this.children[0]) && void 0 !== e ? e : null;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "lastChild", {
          get: function () {
            return this.children.length > 0
              ? this.children[this.children.length - 1]
              : null;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "childNodes", {
          get: function () {
            return this.children;
          },
          set: function (e) {
            this.children = e;
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })(i);
    Ri.NodeWithChildren = c;
    var u = (function (e) {
      function r() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        return (t.type = n.ElementType.CDATA), t;
      }
      return (
        t(r, e),
        Object.defineProperty(r.prototype, "nodeType", {
          get: function () {
            return 4;
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })(c);
    Ri.CDATA = u;
    var d = (function (e) {
      function r() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        return (t.type = n.ElementType.Root), t;
      }
      return (
        t(r, e),
        Object.defineProperty(r.prototype, "nodeType", {
          get: function () {
            return 9;
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })(c);
    Ri.Document = d;
    var p = (function (e) {
      function r(t, r, i, o) {
        void 0 === i && (i = []),
          void 0 === o &&
            (o =
              "script" === t
                ? n.ElementType.Script
                : "style" === t
                ? n.ElementType.Style
                : n.ElementType.Tag);
        var s = e.call(this, i) || this;
        return (s.name = t), (s.attribs = r), (s.type = o), s;
      }
      return (
        t(r, e),
        Object.defineProperty(r.prototype, "nodeType", {
          get: function () {
            return 1;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "tagName", {
          get: function () {
            return this.name;
          },
          set: function (e) {
            this.name = e;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(r.prototype, "attributes", {
          get: function () {
            var e = this;
            return Object.keys(this.attribs).map(function (t) {
              var r, n;
              return {
                name: t,
                value: e.attribs[t],
                namespace:
                  null === (r = e["x-attribsNamespace"]) || void 0 === r
                    ? void 0
                    : r[t],
                prefix:
                  null === (n = e["x-attribsPrefix"]) || void 0 === n
                    ? void 0
                    : n[t],
              };
            });
          },
          enumerable: !1,
          configurable: !0,
        }),
        r
      );
    })(c);
    function h(e) {
      return (0, n.isTag)(e);
    }
    function f(e) {
      return e.type === n.ElementType.CDATA;
    }
    function g(e) {
      return e.type === n.ElementType.Text;
    }
    function m(e) {
      return e.type === n.ElementType.Comment;
    }
    function v(e) {
      return e.type === n.ElementType.Directive;
    }
    function y(e) {
      return e.type === n.ElementType.Root;
    }
    function b(e, t) {
      var n;
      if ((void 0 === t && (t = !1), g(e))) n = new s(e.data);
      else if (m(e)) n = new a(e.data);
      else if (h(e)) {
        var i = t ? w(e.children) : [],
          o = new p(e.name, r({}, e.attribs), i);
        i.forEach(function (e) {
          return (e.parent = o);
        }),
          null != e.namespace && (o.namespace = e.namespace),
          e["x-attribsNamespace"] &&
            (o["x-attribsNamespace"] = r({}, e["x-attribsNamespace"])),
          e["x-attribsPrefix"] &&
            (o["x-attribsPrefix"] = r({}, e["x-attribsPrefix"])),
          (n = o);
      } else if (f(e)) {
        i = t ? w(e.children) : [];
        var c = new u(i);
        i.forEach(function (e) {
          return (e.parent = c);
        }),
          (n = c);
      } else if (y(e)) {
        i = t ? w(e.children) : [];
        var b = new d(i);
        i.forEach(function (e) {
          return (e.parent = b);
        }),
          e["x-mode"] && (b["x-mode"] = e["x-mode"]),
          (n = b);
      } else {
        if (!v(e)) throw new Error("Not implemented yet: ".concat(e.type));
        var x = new l(e.name, e.data);
        null != e["x-name"] &&
          ((x["x-name"] = e["x-name"]),
          (x["x-publicId"] = e["x-publicId"]),
          (x["x-systemId"] = e["x-systemId"])),
          (n = x);
      }
      return (
        (n.startIndex = e.startIndex),
        (n.endIndex = e.endIndex),
        null != e.sourceCodeLocation &&
          (n.sourceCodeLocation = e.sourceCodeLocation),
        n
      );
    }
    function w(e) {
      for (
        var t = e.map(function (e) {
            return b(e, !0);
          }),
          r = 1;
        r < t.length;
        r++
      )
        (t[r].prev = t[r - 1]), (t[r - 1].next = t[r]);
      return t;
    }
    return (
      (Ri.Element = p),
      (Ri.isTag = h),
      (Ri.isCDATA = f),
      (Ri.isText = g),
      (Ri.isComment = m),
      (Ri.isDirective = v),
      (Ri.isDocument = y),
      (Ri.hasChildren = function (e) {
        return Object.prototype.hasOwnProperty.call(e, "children");
      }),
      (Ri.cloneNode = b),
      Ri
    );
  }
  function Fi() {
    return (
      Di ||
        ((Di = 1),
        (function (e) {
          var t =
              (Ni && Ni.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var i = Object.getOwnPropertyDescriptor(t, r);
                    (i &&
                      !("get" in i
                        ? !t.__esModule
                        : i.writable || i.configurable)) ||
                      (i = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            r =
              (Ni && Ni.__exportStar) ||
              function (e, r) {
                for (var n in e)
                  "default" === n ||
                    Object.prototype.hasOwnProperty.call(r, n) ||
                    t(r, e, n);
              };
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.DomHandler = void 0);
          var n = _i(),
            i = $i();
          r($i(), e);
          var o = { withStartIndices: !1, withEndIndices: !1, xmlMode: !1 },
            s = (function () {
              function e(e, t, r) {
                (this.dom = []),
                  (this.root = new i.Document(this.dom)),
                  (this.done = !1),
                  (this.tagStack = [this.root]),
                  (this.lastNode = null),
                  (this.parser = null),
                  "function" == typeof t && ((r = t), (t = o)),
                  "object" == typeof e && ((t = e), (e = void 0)),
                  (this.callback = null != e ? e : null),
                  (this.options = null != t ? t : o),
                  (this.elementCB = null != r ? r : null);
              }
              return (
                (e.prototype.onparserinit = function (e) {
                  this.parser = e;
                }),
                (e.prototype.onreset = function () {
                  (this.dom = []),
                    (this.root = new i.Document(this.dom)),
                    (this.done = !1),
                    (this.tagStack = [this.root]),
                    (this.lastNode = null),
                    (this.parser = null);
                }),
                (e.prototype.onend = function () {
                  this.done ||
                    ((this.done = !0),
                    (this.parser = null),
                    this.handleCallback(null));
                }),
                (e.prototype.onerror = function (e) {
                  this.handleCallback(e);
                }),
                (e.prototype.onclosetag = function () {
                  this.lastNode = null;
                  var e = this.tagStack.pop();
                  this.options.withEndIndices &&
                    (e.endIndex = this.parser.endIndex),
                    this.elementCB && this.elementCB(e);
                }),
                (e.prototype.onopentag = function (e, t) {
                  var r = this.options.xmlMode ? n.ElementType.Tag : void 0,
                    o = new i.Element(e, t, void 0, r);
                  this.addNode(o), this.tagStack.push(o);
                }),
                (e.prototype.ontext = function (e) {
                  var t = this.lastNode;
                  if (t && t.type === n.ElementType.Text)
                    (t.data += e),
                      this.options.withEndIndices &&
                        (t.endIndex = this.parser.endIndex);
                  else {
                    var r = new i.Text(e);
                    this.addNode(r), (this.lastNode = r);
                  }
                }),
                (e.prototype.oncomment = function (e) {
                  if (
                    this.lastNode &&
                    this.lastNode.type === n.ElementType.Comment
                  )
                    this.lastNode.data += e;
                  else {
                    var t = new i.Comment(e);
                    this.addNode(t), (this.lastNode = t);
                  }
                }),
                (e.prototype.oncommentend = function () {
                  this.lastNode = null;
                }),
                (e.prototype.oncdatastart = function () {
                  var e = new i.Text(""),
                    t = new i.CDATA([e]);
                  this.addNode(t), (e.parent = t), (this.lastNode = e);
                }),
                (e.prototype.oncdataend = function () {
                  this.lastNode = null;
                }),
                (e.prototype.onprocessinginstruction = function (e, t) {
                  var r = new i.ProcessingInstruction(e, t);
                  this.addNode(r);
                }),
                (e.prototype.handleCallback = function (e) {
                  if ("function" == typeof this.callback)
                    this.callback(e, this.dom);
                  else if (e) throw e;
                }),
                (e.prototype.addNode = function (e) {
                  var t = this.tagStack[this.tagStack.length - 1],
                    r = t.children[t.children.length - 1];
                  this.options.withStartIndices &&
                    (e.startIndex = this.parser.startIndex),
                    this.options.withEndIndices &&
                      (e.endIndex = this.parser.endIndex),
                    t.children.push(e),
                    r && ((e.prev = r), (r.next = e)),
                    (e.parent = t),
                    (this.lastNode = null);
                }),
                e
              );
            })();
          (e.DomHandler = s), (e.default = s);
        })(Ni)),
      Ni
    );
  }
  var Bi,
    qi = {},
    ji = {},
    Hi = {},
    Vi = {},
    Ui = {},
    zi = {};
  function Gi() {
    if (Bi) return zi;
    function e(e) {
      for (var t = 1; t < e.length; t++) e[t][0] += e[t - 1][0] + 1;
      return e;
    }
    return (
      (Bi = 1),
      Object.defineProperty(zi, "__esModule", { value: !0 }),
      (zi.default = new Map(
        e([
          [9, "&Tab;"],
          [0, "&NewLine;"],
          [22, "&excl;"],
          [0, "&quot;"],
          [0, "&num;"],
          [0, "&dollar;"],
          [0, "&percnt;"],
          [0, "&amp;"],
          [0, "&apos;"],
          [0, "&lpar;"],
          [0, "&rpar;"],
          [0, "&ast;"],
          [0, "&plus;"],
          [0, "&comma;"],
          [1, "&period;"],
          [0, "&sol;"],
          [10, "&colon;"],
          [0, "&semi;"],
          [0, { v: "&lt;", n: 8402, o: "&nvlt;" }],
          [0, { v: "&equals;", n: 8421, o: "&bne;" }],
          [0, { v: "&gt;", n: 8402, o: "&nvgt;" }],
          [0, "&quest;"],
          [0, "&commat;"],
          [26, "&lbrack;"],
          [0, "&bsol;"],
          [0, "&rbrack;"],
          [0, "&Hat;"],
          [0, "&lowbar;"],
          [0, "&DiacriticalGrave;"],
          [5, { n: 106, o: "&fjlig;" }],
          [20, "&lbrace;"],
          [0, "&verbar;"],
          [0, "&rbrace;"],
          [34, "&nbsp;"],
          [0, "&iexcl;"],
          [0, "&cent;"],
          [0, "&pound;"],
          [0, "&curren;"],
          [0, "&yen;"],
          [0, "&brvbar;"],
          [0, "&sect;"],
          [0, "&die;"],
          [0, "&copy;"],
          [0, "&ordf;"],
          [0, "&laquo;"],
          [0, "&not;"],
          [0, "&shy;"],
          [0, "&circledR;"],
          [0, "&macr;"],
          [0, "&deg;"],
          [0, "&PlusMinus;"],
          [0, "&sup2;"],
          [0, "&sup3;"],
          [0, "&acute;"],
          [0, "&micro;"],
          [0, "&para;"],
          [0, "&centerdot;"],
          [0, "&cedil;"],
          [0, "&sup1;"],
          [0, "&ordm;"],
          [0, "&raquo;"],
          [0, "&frac14;"],
          [0, "&frac12;"],
          [0, "&frac34;"],
          [0, "&iquest;"],
          [0, "&Agrave;"],
          [0, "&Aacute;"],
          [0, "&Acirc;"],
          [0, "&Atilde;"],
          [0, "&Auml;"],
          [0, "&angst;"],
          [0, "&AElig;"],
          [0, "&Ccedil;"],
          [0, "&Egrave;"],
          [0, "&Eacute;"],
          [0, "&Ecirc;"],
          [0, "&Euml;"],
          [0, "&Igrave;"],
          [0, "&Iacute;"],
          [0, "&Icirc;"],
          [0, "&Iuml;"],
          [0, "&ETH;"],
          [0, "&Ntilde;"],
          [0, "&Ograve;"],
          [0, "&Oacute;"],
          [0, "&Ocirc;"],
          [0, "&Otilde;"],
          [0, "&Ouml;"],
          [0, "&times;"],
          [0, "&Oslash;"],
          [0, "&Ugrave;"],
          [0, "&Uacute;"],
          [0, "&Ucirc;"],
          [0, "&Uuml;"],
          [0, "&Yacute;"],
          [0, "&THORN;"],
          [0, "&szlig;"],
          [0, "&agrave;"],
          [0, "&aacute;"],
          [0, "&acirc;"],
          [0, "&atilde;"],
          [0, "&auml;"],
          [0, "&aring;"],
          [0, "&aelig;"],
          [0, "&ccedil;"],
          [0, "&egrave;"],
          [0, "&eacute;"],
          [0, "&ecirc;"],
          [0, "&euml;"],
          [0, "&igrave;"],
          [0, "&iacute;"],
          [0, "&icirc;"],
          [0, "&iuml;"],
          [0, "&eth;"],
          [0, "&ntilde;"],
          [0, "&ograve;"],
          [0, "&oacute;"],
          [0, "&ocirc;"],
          [0, "&otilde;"],
          [0, "&ouml;"],
          [0, "&div;"],
          [0, "&oslash;"],
          [0, "&ugrave;"],
          [0, "&uacute;"],
          [0, "&ucirc;"],
          [0, "&uuml;"],
          [0, "&yacute;"],
          [0, "&thorn;"],
          [0, "&yuml;"],
          [0, "&Amacr;"],
          [0, "&amacr;"],
          [0, "&Abreve;"],
          [0, "&abreve;"],
          [0, "&Aogon;"],
          [0, "&aogon;"],
          [0, "&Cacute;"],
          [0, "&cacute;"],
          [0, "&Ccirc;"],
          [0, "&ccirc;"],
          [0, "&Cdot;"],
          [0, "&cdot;"],
          [0, "&Ccaron;"],
          [0, "&ccaron;"],
          [0, "&Dcaron;"],
          [0, "&dcaron;"],
          [0, "&Dstrok;"],
          [0, "&dstrok;"],
          [0, "&Emacr;"],
          [0, "&emacr;"],
          [2, "&Edot;"],
          [0, "&edot;"],
          [0, "&Eogon;"],
          [0, "&eogon;"],
          [0, "&Ecaron;"],
          [0, "&ecaron;"],
          [0, "&Gcirc;"],
          [0, "&gcirc;"],
          [0, "&Gbreve;"],
          [0, "&gbreve;"],
          [0, "&Gdot;"],
          [0, "&gdot;"],
          [0, "&Gcedil;"],
          [1, "&Hcirc;"],
          [0, "&hcirc;"],
          [0, "&Hstrok;"],
          [0, "&hstrok;"],
          [0, "&Itilde;"],
          [0, "&itilde;"],
          [0, "&Imacr;"],
          [0, "&imacr;"],
          [2, "&Iogon;"],
          [0, "&iogon;"],
          [0, "&Idot;"],
          [0, "&imath;"],
          [0, "&IJlig;"],
          [0, "&ijlig;"],
          [0, "&Jcirc;"],
          [0, "&jcirc;"],
          [0, "&Kcedil;"],
          [0, "&kcedil;"],
          [0, "&kgreen;"],
          [0, "&Lacute;"],
          [0, "&lacute;"],
          [0, "&Lcedil;"],
          [0, "&lcedil;"],
          [0, "&Lcaron;"],
          [0, "&lcaron;"],
          [0, "&Lmidot;"],
          [0, "&lmidot;"],
          [0, "&Lstrok;"],
          [0, "&lstrok;"],
          [0, "&Nacute;"],
          [0, "&nacute;"],
          [0, "&Ncedil;"],
          [0, "&ncedil;"],
          [0, "&Ncaron;"],
          [0, "&ncaron;"],
          [0, "&napos;"],
          [0, "&ENG;"],
          [0, "&eng;"],
          [0, "&Omacr;"],
          [0, "&omacr;"],
          [2, "&Odblac;"],
          [0, "&odblac;"],
          [0, "&OElig;"],
          [0, "&oelig;"],
          [0, "&Racute;"],
          [0, "&racute;"],
          [0, "&Rcedil;"],
          [0, "&rcedil;"],
          [0, "&Rcaron;"],
          [0, "&rcaron;"],
          [0, "&Sacute;"],
          [0, "&sacute;"],
          [0, "&Scirc;"],
          [0, "&scirc;"],
          [0, "&Scedil;"],
          [0, "&scedil;"],
          [0, "&Scaron;"],
          [0, "&scaron;"],
          [0, "&Tcedil;"],
          [0, "&tcedil;"],
          [0, "&Tcaron;"],
          [0, "&tcaron;"],
          [0, "&Tstrok;"],
          [0, "&tstrok;"],
          [0, "&Utilde;"],
          [0, "&utilde;"],
          [0, "&Umacr;"],
          [0, "&umacr;"],
          [0, "&Ubreve;"],
          [0, "&ubreve;"],
          [0, "&Uring;"],
          [0, "&uring;"],
          [0, "&Udblac;"],
          [0, "&udblac;"],
          [0, "&Uogon;"],
          [0, "&uogon;"],
          [0, "&Wcirc;"],
          [0, "&wcirc;"],
          [0, "&Ycirc;"],
          [0, "&ycirc;"],
          [0, "&Yuml;"],
          [0, "&Zacute;"],
          [0, "&zacute;"],
          [0, "&Zdot;"],
          [0, "&zdot;"],
          [0, "&Zcaron;"],
          [0, "&zcaron;"],
          [19, "&fnof;"],
          [34, "&imped;"],
          [63, "&gacute;"],
          [65, "&jmath;"],
          [142, "&circ;"],
          [0, "&caron;"],
          [16, "&breve;"],
          [0, "&DiacriticalDot;"],
          [0, "&ring;"],
          [0, "&ogon;"],
          [0, "&DiacriticalTilde;"],
          [0, "&dblac;"],
          [51, "&DownBreve;"],
          [127, "&Alpha;"],
          [0, "&Beta;"],
          [0, "&Gamma;"],
          [0, "&Delta;"],
          [0, "&Epsilon;"],
          [0, "&Zeta;"],
          [0, "&Eta;"],
          [0, "&Theta;"],
          [0, "&Iota;"],
          [0, "&Kappa;"],
          [0, "&Lambda;"],
          [0, "&Mu;"],
          [0, "&Nu;"],
          [0, "&Xi;"],
          [0, "&Omicron;"],
          [0, "&Pi;"],
          [0, "&Rho;"],
          [1, "&Sigma;"],
          [0, "&Tau;"],
          [0, "&Upsilon;"],
          [0, "&Phi;"],
          [0, "&Chi;"],
          [0, "&Psi;"],
          [0, "&ohm;"],
          [7, "&alpha;"],
          [0, "&beta;"],
          [0, "&gamma;"],
          [0, "&delta;"],
          [0, "&epsi;"],
          [0, "&zeta;"],
          [0, "&eta;"],
          [0, "&theta;"],
          [0, "&iota;"],
          [0, "&kappa;"],
          [0, "&lambda;"],
          [0, "&mu;"],
          [0, "&nu;"],
          [0, "&xi;"],
          [0, "&omicron;"],
          [0, "&pi;"],
          [0, "&rho;"],
          [0, "&sigmaf;"],
          [0, "&sigma;"],
          [0, "&tau;"],
          [0, "&upsi;"],
          [0, "&phi;"],
          [0, "&chi;"],
          [0, "&psi;"],
          [0, "&omega;"],
          [7, "&thetasym;"],
          [0, "&Upsi;"],
          [2, "&phiv;"],
          [0, "&piv;"],
          [5, "&Gammad;"],
          [0, "&digamma;"],
          [18, "&kappav;"],
          [0, "&rhov;"],
          [3, "&epsiv;"],
          [0, "&backepsilon;"],
          [10, "&IOcy;"],
          [0, "&DJcy;"],
          [0, "&GJcy;"],
          [0, "&Jukcy;"],
          [0, "&DScy;"],
          [0, "&Iukcy;"],
          [0, "&YIcy;"],
          [0, "&Jsercy;"],
          [0, "&LJcy;"],
          [0, "&NJcy;"],
          [0, "&TSHcy;"],
          [0, "&KJcy;"],
          [1, "&Ubrcy;"],
          [0, "&DZcy;"],
          [0, "&Acy;"],
          [0, "&Bcy;"],
          [0, "&Vcy;"],
          [0, "&Gcy;"],
          [0, "&Dcy;"],
          [0, "&IEcy;"],
          [0, "&ZHcy;"],
          [0, "&Zcy;"],
          [0, "&Icy;"],
          [0, "&Jcy;"],
          [0, "&Kcy;"],
          [0, "&Lcy;"],
          [0, "&Mcy;"],
          [0, "&Ncy;"],
          [0, "&Ocy;"],
          [0, "&Pcy;"],
          [0, "&Rcy;"],
          [0, "&Scy;"],
          [0, "&Tcy;"],
          [0, "&Ucy;"],
          [0, "&Fcy;"],
          [0, "&KHcy;"],
          [0, "&TScy;"],
          [0, "&CHcy;"],
          [0, "&SHcy;"],
          [0, "&SHCHcy;"],
          [0, "&HARDcy;"],
          [0, "&Ycy;"],
          [0, "&SOFTcy;"],
          [0, "&Ecy;"],
          [0, "&YUcy;"],
          [0, "&YAcy;"],
          [0, "&acy;"],
          [0, "&bcy;"],
          [0, "&vcy;"],
          [0, "&gcy;"],
          [0, "&dcy;"],
          [0, "&iecy;"],
          [0, "&zhcy;"],
          [0, "&zcy;"],
          [0, "&icy;"],
          [0, "&jcy;"],
          [0, "&kcy;"],
          [0, "&lcy;"],
          [0, "&mcy;"],
          [0, "&ncy;"],
          [0, "&ocy;"],
          [0, "&pcy;"],
          [0, "&rcy;"],
          [0, "&scy;"],
          [0, "&tcy;"],
          [0, "&ucy;"],
          [0, "&fcy;"],
          [0, "&khcy;"],
          [0, "&tscy;"],
          [0, "&chcy;"],
          [0, "&shcy;"],
          [0, "&shchcy;"],
          [0, "&hardcy;"],
          [0, "&ycy;"],
          [0, "&softcy;"],
          [0, "&ecy;"],
          [0, "&yucy;"],
          [0, "&yacy;"],
          [1, "&iocy;"],
          [0, "&djcy;"],
          [0, "&gjcy;"],
          [0, "&jukcy;"],
          [0, "&dscy;"],
          [0, "&iukcy;"],
          [0, "&yicy;"],
          [0, "&jsercy;"],
          [0, "&ljcy;"],
          [0, "&njcy;"],
          [0, "&tshcy;"],
          [0, "&kjcy;"],
          [1, "&ubrcy;"],
          [0, "&dzcy;"],
          [7074, "&ensp;"],
          [0, "&emsp;"],
          [0, "&emsp13;"],
          [0, "&emsp14;"],
          [1, "&numsp;"],
          [0, "&puncsp;"],
          [0, "&ThinSpace;"],
          [0, "&hairsp;"],
          [0, "&NegativeMediumSpace;"],
          [0, "&zwnj;"],
          [0, "&zwj;"],
          [0, "&lrm;"],
          [0, "&rlm;"],
          [0, "&dash;"],
          [2, "&ndash;"],
          [0, "&mdash;"],
          [0, "&horbar;"],
          [0, "&Verbar;"],
          [1, "&lsquo;"],
          [0, "&CloseCurlyQuote;"],
          [0, "&lsquor;"],
          [1, "&ldquo;"],
          [0, "&CloseCurlyDoubleQuote;"],
          [0, "&bdquo;"],
          [1, "&dagger;"],
          [0, "&Dagger;"],
          [0, "&bull;"],
          [2, "&nldr;"],
          [0, "&hellip;"],
          [9, "&permil;"],
          [0, "&pertenk;"],
          [0, "&prime;"],
          [0, "&Prime;"],
          [0, "&tprime;"],
          [0, "&backprime;"],
          [3, "&lsaquo;"],
          [0, "&rsaquo;"],
          [3, "&oline;"],
          [2, "&caret;"],
          [1, "&hybull;"],
          [0, "&frasl;"],
          [10, "&bsemi;"],
          [7, "&qprime;"],
          [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }],
          [0, "&NoBreak;"],
          [0, "&af;"],
          [0, "&InvisibleTimes;"],
          [0, "&ic;"],
          [72, "&euro;"],
          [46, "&tdot;"],
          [0, "&DotDot;"],
          [37, "&complexes;"],
          [2, "&incare;"],
          [4, "&gscr;"],
          [0, "&hamilt;"],
          [0, "&Hfr;"],
          [0, "&Hopf;"],
          [0, "&planckh;"],
          [0, "&hbar;"],
          [0, "&imagline;"],
          [0, "&Ifr;"],
          [0, "&lagran;"],
          [0, "&ell;"],
          [1, "&naturals;"],
          [0, "&numero;"],
          [0, "&copysr;"],
          [0, "&weierp;"],
          [0, "&Popf;"],
          [0, "&Qopf;"],
          [0, "&realine;"],
          [0, "&real;"],
          [0, "&reals;"],
          [0, "&rx;"],
          [3, "&trade;"],
          [1, "&integers;"],
          [2, "&mho;"],
          [0, "&zeetrf;"],
          [0, "&iiota;"],
          [2, "&bernou;"],
          [0, "&Cayleys;"],
          [1, "&escr;"],
          [0, "&Escr;"],
          [0, "&Fouriertrf;"],
          [1, "&Mellintrf;"],
          [0, "&order;"],
          [0, "&alefsym;"],
          [0, "&beth;"],
          [0, "&gimel;"],
          [0, "&daleth;"],
          [12, "&CapitalDifferentialD;"],
          [0, "&dd;"],
          [0, "&ee;"],
          [0, "&ii;"],
          [10, "&frac13;"],
          [0, "&frac23;"],
          [0, "&frac15;"],
          [0, "&frac25;"],
          [0, "&frac35;"],
          [0, "&frac45;"],
          [0, "&frac16;"],
          [0, "&frac56;"],
          [0, "&frac18;"],
          [0, "&frac38;"],
          [0, "&frac58;"],
          [0, "&frac78;"],
          [49, "&larr;"],
          [0, "&ShortUpArrow;"],
          [0, "&rarr;"],
          [0, "&darr;"],
          [0, "&harr;"],
          [0, "&updownarrow;"],
          [0, "&nwarr;"],
          [0, "&nearr;"],
          [0, "&LowerRightArrow;"],
          [0, "&LowerLeftArrow;"],
          [0, "&nlarr;"],
          [0, "&nrarr;"],
          [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }],
          [0, "&Larr;"],
          [0, "&Uarr;"],
          [0, "&Rarr;"],
          [0, "&Darr;"],
          [0, "&larrtl;"],
          [0, "&rarrtl;"],
          [0, "&LeftTeeArrow;"],
          [0, "&mapstoup;"],
          [0, "&map;"],
          [0, "&DownTeeArrow;"],
          [1, "&hookleftarrow;"],
          [0, "&hookrightarrow;"],
          [0, "&larrlp;"],
          [0, "&looparrowright;"],
          [0, "&harrw;"],
          [0, "&nharr;"],
          [1, "&lsh;"],
          [0, "&rsh;"],
          [0, "&ldsh;"],
          [0, "&rdsh;"],
          [1, "&crarr;"],
          [0, "&cularr;"],
          [0, "&curarr;"],
          [2, "&circlearrowleft;"],
          [0, "&circlearrowright;"],
          [0, "&leftharpoonup;"],
          [0, "&DownLeftVector;"],
          [0, "&RightUpVector;"],
          [0, "&LeftUpVector;"],
          [0, "&rharu;"],
          [0, "&DownRightVector;"],
          [0, "&dharr;"],
          [0, "&dharl;"],
          [0, "&RightArrowLeftArrow;"],
          [0, "&udarr;"],
          [0, "&LeftArrowRightArrow;"],
          [0, "&leftleftarrows;"],
          [0, "&upuparrows;"],
          [0, "&rightrightarrows;"],
          [0, "&ddarr;"],
          [0, "&leftrightharpoons;"],
          [0, "&Equilibrium;"],
          [0, "&nlArr;"],
          [0, "&nhArr;"],
          [0, "&nrArr;"],
          [0, "&DoubleLeftArrow;"],
          [0, "&DoubleUpArrow;"],
          [0, "&DoubleRightArrow;"],
          [0, "&dArr;"],
          [0, "&DoubleLeftRightArrow;"],
          [0, "&DoubleUpDownArrow;"],
          [0, "&nwArr;"],
          [0, "&neArr;"],
          [0, "&seArr;"],
          [0, "&swArr;"],
          [0, "&lAarr;"],
          [0, "&rAarr;"],
          [1, "&zigrarr;"],
          [6, "&larrb;"],
          [0, "&rarrb;"],
          [15, "&DownArrowUpArrow;"],
          [7, "&loarr;"],
          [0, "&roarr;"],
          [0, "&hoarr;"],
          [0, "&forall;"],
          [0, "&comp;"],
          [0, { v: "&part;", n: 824, o: "&npart;" }],
          [0, "&exist;"],
          [0, "&nexist;"],
          [0, "&empty;"],
          [1, "&Del;"],
          [0, "&Element;"],
          [0, "&NotElement;"],
          [1, "&ni;"],
          [0, "&notni;"],
          [2, "&prod;"],
          [0, "&coprod;"],
          [0, "&sum;"],
          [0, "&minus;"],
          [0, "&MinusPlus;"],
          [0, "&dotplus;"],
          [1, "&Backslash;"],
          [0, "&lowast;"],
          [0, "&compfn;"],
          [1, "&radic;"],
          [2, "&prop;"],
          [0, "&infin;"],
          [0, "&angrt;"],
          [0, { v: "&ang;", n: 8402, o: "&nang;" }],
          [0, "&angmsd;"],
          [0, "&angsph;"],
          [0, "&mid;"],
          [0, "&nmid;"],
          [0, "&DoubleVerticalBar;"],
          [0, "&NotDoubleVerticalBar;"],
          [0, "&and;"],
          [0, "&or;"],
          [0, { v: "&cap;", n: 65024, o: "&caps;" }],
          [0, { v: "&cup;", n: 65024, o: "&cups;" }],
          [0, "&int;"],
          [0, "&Int;"],
          [0, "&iiint;"],
          [0, "&conint;"],
          [0, "&Conint;"],
          [0, "&Cconint;"],
          [0, "&cwint;"],
          [0, "&ClockwiseContourIntegral;"],
          [0, "&awconint;"],
          [0, "&there4;"],
          [0, "&becaus;"],
          [0, "&ratio;"],
          [0, "&Colon;"],
          [0, "&dotminus;"],
          [1, "&mDDot;"],
          [0, "&homtht;"],
          [0, { v: "&sim;", n: 8402, o: "&nvsim;" }],
          [0, { v: "&backsim;", n: 817, o: "&race;" }],
          [0, { v: "&ac;", n: 819, o: "&acE;" }],
          [0, "&acd;"],
          [0, "&VerticalTilde;"],
          [0, "&NotTilde;"],
          [0, { v: "&eqsim;", n: 824, o: "&nesim;" }],
          [0, "&sime;"],
          [0, "&NotTildeEqual;"],
          [0, "&cong;"],
          [0, "&simne;"],
          [0, "&ncong;"],
          [0, "&ap;"],
          [0, "&nap;"],
          [0, "&ape;"],
          [0, { v: "&apid;", n: 824, o: "&napid;" }],
          [0, "&backcong;"],
          [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }],
          [0, { v: "&bump;", n: 824, o: "&nbump;" }],
          [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }],
          [0, { v: "&doteq;", n: 824, o: "&nedot;" }],
          [0, "&doteqdot;"],
          [0, "&efDot;"],
          [0, "&erDot;"],
          [0, "&Assign;"],
          [0, "&ecolon;"],
          [0, "&ecir;"],
          [0, "&circeq;"],
          [1, "&wedgeq;"],
          [0, "&veeeq;"],
          [1, "&triangleq;"],
          [2, "&equest;"],
          [0, "&ne;"],
          [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }],
          [0, "&nequiv;"],
          [1, { v: "&le;", n: 8402, o: "&nvle;" }],
          [0, { v: "&ge;", n: 8402, o: "&nvge;" }],
          [0, { v: "&lE;", n: 824, o: "&nlE;" }],
          [0, { v: "&gE;", n: 824, o: "&ngE;" }],
          [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }],
          [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }],
          [
            0,
            {
              v: "&ll;",
              n: new Map(
                e([
                  [824, "&nLtv;"],
                  [7577, "&nLt;"],
                ])
              ),
            },
          ],
          [
            0,
            {
              v: "&gg;",
              n: new Map(
                e([
                  [824, "&nGtv;"],
                  [7577, "&nGt;"],
                ])
              ),
            },
          ],
          [0, "&between;"],
          [0, "&NotCupCap;"],
          [0, "&nless;"],
          [0, "&ngt;"],
          [0, "&nle;"],
          [0, "&nge;"],
          [0, "&lesssim;"],
          [0, "&GreaterTilde;"],
          [0, "&nlsim;"],
          [0, "&ngsim;"],
          [0, "&LessGreater;"],
          [0, "&gl;"],
          [0, "&NotLessGreater;"],
          [0, "&NotGreaterLess;"],
          [0, "&pr;"],
          [0, "&sc;"],
          [0, "&prcue;"],
          [0, "&sccue;"],
          [0, "&PrecedesTilde;"],
          [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }],
          [0, "&NotPrecedes;"],
          [0, "&NotSucceeds;"],
          [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }],
          [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }],
          [0, "&nsub;"],
          [0, "&nsup;"],
          [0, "&sube;"],
          [0, "&supe;"],
          [0, "&NotSubsetEqual;"],
          [0, "&NotSupersetEqual;"],
          [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }],
          [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }],
          [1, "&cupdot;"],
          [0, "&UnionPlus;"],
          [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }],
          [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }],
          [0, "&sqsube;"],
          [0, "&sqsupe;"],
          [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }],
          [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }],
          [0, "&CirclePlus;"],
          [0, "&CircleMinus;"],
          [0, "&CircleTimes;"],
          [0, "&osol;"],
          [0, "&CircleDot;"],
          [0, "&circledcirc;"],
          [0, "&circledast;"],
          [1, "&circleddash;"],
          [0, "&boxplus;"],
          [0, "&boxminus;"],
          [0, "&boxtimes;"],
          [0, "&dotsquare;"],
          [0, "&RightTee;"],
          [0, "&dashv;"],
          [0, "&DownTee;"],
          [0, "&bot;"],
          [1, "&models;"],
          [0, "&DoubleRightTee;"],
          [0, "&Vdash;"],
          [0, "&Vvdash;"],
          [0, "&VDash;"],
          [0, "&nvdash;"],
          [0, "&nvDash;"],
          [0, "&nVdash;"],
          [0, "&nVDash;"],
          [0, "&prurel;"],
          [1, "&LeftTriangle;"],
          [0, "&RightTriangle;"],
          [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }],
          [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }],
          [0, "&origof;"],
          [0, "&imof;"],
          [0, "&multimap;"],
          [0, "&hercon;"],
          [0, "&intcal;"],
          [0, "&veebar;"],
          [1, "&barvee;"],
          [0, "&angrtvb;"],
          [0, "&lrtri;"],
          [0, "&bigwedge;"],
          [0, "&bigvee;"],
          [0, "&bigcap;"],
          [0, "&bigcup;"],
          [0, "&diam;"],
          [0, "&sdot;"],
          [0, "&sstarf;"],
          [0, "&divideontimes;"],
          [0, "&bowtie;"],
          [0, "&ltimes;"],
          [0, "&rtimes;"],
          [0, "&leftthreetimes;"],
          [0, "&rightthreetimes;"],
          [0, "&backsimeq;"],
          [0, "&curlyvee;"],
          [0, "&curlywedge;"],
          [0, "&Sub;"],
          [0, "&Sup;"],
          [0, "&Cap;"],
          [0, "&Cup;"],
          [0, "&fork;"],
          [0, "&epar;"],
          [0, "&lessdot;"],
          [0, "&gtdot;"],
          [0, { v: "&Ll;", n: 824, o: "&nLl;" }],
          [0, { v: "&Gg;", n: 824, o: "&nGg;" }],
          [0, { v: "&leg;", n: 65024, o: "&lesg;" }],
          [0, { v: "&gel;", n: 65024, o: "&gesl;" }],
          [2, "&cuepr;"],
          [0, "&cuesc;"],
          [0, "&NotPrecedesSlantEqual;"],
          [0, "&NotSucceedsSlantEqual;"],
          [0, "&NotSquareSubsetEqual;"],
          [0, "&NotSquareSupersetEqual;"],
          [2, "&lnsim;"],
          [0, "&gnsim;"],
          [0, "&precnsim;"],
          [0, "&scnsim;"],
          [0, "&nltri;"],
          [0, "&NotRightTriangle;"],
          [0, "&nltrie;"],
          [0, "&NotRightTriangleEqual;"],
          [0, "&vellip;"],
          [0, "&ctdot;"],
          [0, "&utdot;"],
          [0, "&dtdot;"],
          [0, "&disin;"],
          [0, "&isinsv;"],
          [0, "&isins;"],
          [0, { v: "&isindot;", n: 824, o: "&notindot;" }],
          [0, "&notinvc;"],
          [0, "&notinvb;"],
          [1, { v: "&isinE;", n: 824, o: "&notinE;" }],
          [0, "&nisd;"],
          [0, "&xnis;"],
          [0, "&nis;"],
          [0, "&notnivc;"],
          [0, "&notnivb;"],
          [6, "&barwed;"],
          [0, "&Barwed;"],
          [1, "&lceil;"],
          [0, "&rceil;"],
          [0, "&LeftFloor;"],
          [0, "&rfloor;"],
          [0, "&drcrop;"],
          [0, "&dlcrop;"],
          [0, "&urcrop;"],
          [0, "&ulcrop;"],
          [0, "&bnot;"],
          [1, "&profline;"],
          [0, "&profsurf;"],
          [1, "&telrec;"],
          [0, "&target;"],
          [5, "&ulcorn;"],
          [0, "&urcorn;"],
          [0, "&dlcorn;"],
          [0, "&drcorn;"],
          [2, "&frown;"],
          [0, "&smile;"],
          [9, "&cylcty;"],
          [0, "&profalar;"],
          [7, "&topbot;"],
          [6, "&ovbar;"],
          [1, "&solbar;"],
          [60, "&angzarr;"],
          [51, "&lmoustache;"],
          [0, "&rmoustache;"],
          [2, "&OverBracket;"],
          [0, "&bbrk;"],
          [0, "&bbrktbrk;"],
          [37, "&OverParenthesis;"],
          [0, "&UnderParenthesis;"],
          [0, "&OverBrace;"],
          [0, "&UnderBrace;"],
          [2, "&trpezium;"],
          [4, "&elinters;"],
          [59, "&blank;"],
          [164, "&circledS;"],
          [55, "&boxh;"],
          [1, "&boxv;"],
          [9, "&boxdr;"],
          [3, "&boxdl;"],
          [3, "&boxur;"],
          [3, "&boxul;"],
          [3, "&boxvr;"],
          [7, "&boxvl;"],
          [7, "&boxhd;"],
          [7, "&boxhu;"],
          [7, "&boxvh;"],
          [19, "&boxH;"],
          [0, "&boxV;"],
          [0, "&boxdR;"],
          [0, "&boxDr;"],
          [0, "&boxDR;"],
          [0, "&boxdL;"],
          [0, "&boxDl;"],
          [0, "&boxDL;"],
          [0, "&boxuR;"],
          [0, "&boxUr;"],
          [0, "&boxUR;"],
          [0, "&boxuL;"],
          [0, "&boxUl;"],
          [0, "&boxUL;"],
          [0, "&boxvR;"],
          [0, "&boxVr;"],
          [0, "&boxVR;"],
          [0, "&boxvL;"],
          [0, "&boxVl;"],
          [0, "&boxVL;"],
          [0, "&boxHd;"],
          [0, "&boxhD;"],
          [0, "&boxHD;"],
          [0, "&boxHu;"],
          [0, "&boxhU;"],
          [0, "&boxHU;"],
          [0, "&boxvH;"],
          [0, "&boxVh;"],
          [0, "&boxVH;"],
          [19, "&uhblk;"],
          [3, "&lhblk;"],
          [3, "&block;"],
          [8, "&blk14;"],
          [0, "&blk12;"],
          [0, "&blk34;"],
          [13, "&square;"],
          [8, "&blacksquare;"],
          [0, "&EmptyVerySmallSquare;"],
          [1, "&rect;"],
          [0, "&marker;"],
          [2, "&fltns;"],
          [1, "&bigtriangleup;"],
          [0, "&blacktriangle;"],
          [0, "&triangle;"],
          [2, "&blacktriangleright;"],
          [0, "&rtri;"],
          [3, "&bigtriangledown;"],
          [0, "&blacktriangledown;"],
          [0, "&dtri;"],
          [2, "&blacktriangleleft;"],
          [0, "&ltri;"],
          [6, "&loz;"],
          [0, "&cir;"],
          [32, "&tridot;"],
          [2, "&bigcirc;"],
          [8, "&ultri;"],
          [0, "&urtri;"],
          [0, "&lltri;"],
          [0, "&EmptySmallSquare;"],
          [0, "&FilledSmallSquare;"],
          [8, "&bigstar;"],
          [0, "&star;"],
          [7, "&phone;"],
          [49, "&female;"],
          [1, "&male;"],
          [29, "&spades;"],
          [2, "&clubs;"],
          [1, "&hearts;"],
          [0, "&diamondsuit;"],
          [3, "&sung;"],
          [2, "&flat;"],
          [0, "&natural;"],
          [0, "&sharp;"],
          [163, "&check;"],
          [3, "&cross;"],
          [8, "&malt;"],
          [21, "&sext;"],
          [33, "&VerticalSeparator;"],
          [25, "&lbbrk;"],
          [0, "&rbbrk;"],
          [84, "&bsolhsub;"],
          [0, "&suphsol;"],
          [28, "&LeftDoubleBracket;"],
          [0, "&RightDoubleBracket;"],
          [0, "&lang;"],
          [0, "&rang;"],
          [0, "&Lang;"],
          [0, "&Rang;"],
          [0, "&loang;"],
          [0, "&roang;"],
          [7, "&longleftarrow;"],
          [0, "&longrightarrow;"],
          [0, "&longleftrightarrow;"],
          [0, "&DoubleLongLeftArrow;"],
          [0, "&DoubleLongRightArrow;"],
          [0, "&DoubleLongLeftRightArrow;"],
          [1, "&longmapsto;"],
          [2, "&dzigrarr;"],
          [258, "&nvlArr;"],
          [0, "&nvrArr;"],
          [0, "&nvHarr;"],
          [0, "&Map;"],
          [6, "&lbarr;"],
          [0, "&bkarow;"],
          [0, "&lBarr;"],
          [0, "&dbkarow;"],
          [0, "&drbkarow;"],
          [0, "&DDotrahd;"],
          [0, "&UpArrowBar;"],
          [0, "&DownArrowBar;"],
          [2, "&Rarrtl;"],
          [2, "&latail;"],
          [0, "&ratail;"],
          [0, "&lAtail;"],
          [0, "&rAtail;"],
          [0, "&larrfs;"],
          [0, "&rarrfs;"],
          [0, "&larrbfs;"],
          [0, "&rarrbfs;"],
          [2, "&nwarhk;"],
          [0, "&nearhk;"],
          [0, "&hksearow;"],
          [0, "&hkswarow;"],
          [0, "&nwnear;"],
          [0, "&nesear;"],
          [0, "&seswar;"],
          [0, "&swnwar;"],
          [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }],
          [1, "&cudarrr;"],
          [0, "&ldca;"],
          [0, "&rdca;"],
          [0, "&cudarrl;"],
          [0, "&larrpl;"],
          [2, "&curarrm;"],
          [0, "&cularrp;"],
          [7, "&rarrpl;"],
          [2, "&harrcir;"],
          [0, "&Uarrocir;"],
          [0, "&lurdshar;"],
          [0, "&ldrushar;"],
          [2, "&LeftRightVector;"],
          [0, "&RightUpDownVector;"],
          [0, "&DownLeftRightVector;"],
          [0, "&LeftUpDownVector;"],
          [0, "&LeftVectorBar;"],
          [0, "&RightVectorBar;"],
          [0, "&RightUpVectorBar;"],
          [0, "&RightDownVectorBar;"],
          [0, "&DownLeftVectorBar;"],
          [0, "&DownRightVectorBar;"],
          [0, "&LeftUpVectorBar;"],
          [0, "&LeftDownVectorBar;"],
          [0, "&LeftTeeVector;"],
          [0, "&RightTeeVector;"],
          [0, "&RightUpTeeVector;"],
          [0, "&RightDownTeeVector;"],
          [0, "&DownLeftTeeVector;"],
          [0, "&DownRightTeeVector;"],
          [0, "&LeftUpTeeVector;"],
          [0, "&LeftDownTeeVector;"],
          [0, "&lHar;"],
          [0, "&uHar;"],
          [0, "&rHar;"],
          [0, "&dHar;"],
          [0, "&luruhar;"],
          [0, "&ldrdhar;"],
          [0, "&ruluhar;"],
          [0, "&rdldhar;"],
          [0, "&lharul;"],
          [0, "&llhard;"],
          [0, "&rharul;"],
          [0, "&lrhard;"],
          [0, "&udhar;"],
          [0, "&duhar;"],
          [0, "&RoundImplies;"],
          [0, "&erarr;"],
          [0, "&simrarr;"],
          [0, "&larrsim;"],
          [0, "&rarrsim;"],
          [0, "&rarrap;"],
          [0, "&ltlarr;"],
          [1, "&gtrarr;"],
          [0, "&subrarr;"],
          [1, "&suplarr;"],
          [0, "&lfisht;"],
          [0, "&rfisht;"],
          [0, "&ufisht;"],
          [0, "&dfisht;"],
          [5, "&lopar;"],
          [0, "&ropar;"],
          [4, "&lbrke;"],
          [0, "&rbrke;"],
          [0, "&lbrkslu;"],
          [0, "&rbrksld;"],
          [0, "&lbrksld;"],
          [0, "&rbrkslu;"],
          [0, "&langd;"],
          [0, "&rangd;"],
          [0, "&lparlt;"],
          [0, "&rpargt;"],
          [0, "&gtlPar;"],
          [0, "&ltrPar;"],
          [3, "&vzigzag;"],
          [1, "&vangrt;"],
          [0, "&angrtvbd;"],
          [6, "&ange;"],
          [0, "&range;"],
          [0, "&dwangle;"],
          [0, "&uwangle;"],
          [0, "&angmsdaa;"],
          [0, "&angmsdab;"],
          [0, "&angmsdac;"],
          [0, "&angmsdad;"],
          [0, "&angmsdae;"],
          [0, "&angmsdaf;"],
          [0, "&angmsdag;"],
          [0, "&angmsdah;"],
          [0, "&bemptyv;"],
          [0, "&demptyv;"],
          [0, "&cemptyv;"],
          [0, "&raemptyv;"],
          [0, "&laemptyv;"],
          [0, "&ohbar;"],
          [0, "&omid;"],
          [0, "&opar;"],
          [1, "&operp;"],
          [1, "&olcross;"],
          [0, "&odsold;"],
          [1, "&olcir;"],
          [0, "&ofcir;"],
          [0, "&olt;"],
          [0, "&ogt;"],
          [0, "&cirscir;"],
          [0, "&cirE;"],
          [0, "&solb;"],
          [0, "&bsolb;"],
          [3, "&boxbox;"],
          [3, "&trisb;"],
          [0, "&rtriltri;"],
          [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }],
          [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }],
          [11, "&iinfin;"],
          [0, "&infintie;"],
          [0, "&nvinfin;"],
          [4, "&eparsl;"],
          [0, "&smeparsl;"],
          [0, "&eqvparsl;"],
          [5, "&blacklozenge;"],
          [8, "&RuleDelayed;"],
          [1, "&dsol;"],
          [9, "&bigodot;"],
          [0, "&bigoplus;"],
          [0, "&bigotimes;"],
          [1, "&biguplus;"],
          [1, "&bigsqcup;"],
          [5, "&iiiint;"],
          [0, "&fpartint;"],
          [2, "&cirfnint;"],
          [0, "&awint;"],
          [0, "&rppolint;"],
          [0, "&scpolint;"],
          [0, "&npolint;"],
          [0, "&pointint;"],
          [0, "&quatint;"],
          [0, "&intlarhk;"],
          [10, "&pluscir;"],
          [0, "&plusacir;"],
          [0, "&simplus;"],
          [0, "&plusdu;"],
          [0, "&plussim;"],
          [0, "&plustwo;"],
          [1, "&mcomma;"],
          [0, "&minusdu;"],
          [2, "&loplus;"],
          [0, "&roplus;"],
          [0, "&Cross;"],
          [0, "&timesd;"],
          [0, "&timesbar;"],
          [1, "&smashp;"],
          [0, "&lotimes;"],
          [0, "&rotimes;"],
          [0, "&otimesas;"],
          [0, "&Otimes;"],
          [0, "&odiv;"],
          [0, "&triplus;"],
          [0, "&triminus;"],
          [0, "&tritime;"],
          [0, "&intprod;"],
          [2, "&amalg;"],
          [0, "&capdot;"],
          [1, "&ncup;"],
          [0, "&ncap;"],
          [0, "&capand;"],
          [0, "&cupor;"],
          [0, "&cupcap;"],
          [0, "&capcup;"],
          [0, "&cupbrcap;"],
          [0, "&capbrcup;"],
          [0, "&cupcup;"],
          [0, "&capcap;"],
          [0, "&ccups;"],
          [0, "&ccaps;"],
          [2, "&ccupssm;"],
          [2, "&And;"],
          [0, "&Or;"],
          [0, "&andand;"],
          [0, "&oror;"],
          [0, "&orslope;"],
          [0, "&andslope;"],
          [1, "&andv;"],
          [0, "&orv;"],
          [0, "&andd;"],
          [0, "&ord;"],
          [1, "&wedbar;"],
          [6, "&sdote;"],
          [3, "&simdot;"],
          [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }],
          [0, "&easter;"],
          [0, "&apacir;"],
          [0, { v: "&apE;", n: 824, o: "&napE;" }],
          [0, "&eplus;"],
          [0, "&pluse;"],
          [0, "&Esim;"],
          [0, "&Colone;"],
          [0, "&Equal;"],
          [1, "&ddotseq;"],
          [0, "&equivDD;"],
          [0, "&ltcir;"],
          [0, "&gtcir;"],
          [0, "&ltquest;"],
          [0, "&gtquest;"],
          [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }],
          [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }],
          [0, "&lesdot;"],
          [0, "&gesdot;"],
          [0, "&lesdoto;"],
          [0, "&gesdoto;"],
          [0, "&lesdotor;"],
          [0, "&gesdotol;"],
          [0, "&lap;"],
          [0, "&gap;"],
          [0, "&lne;"],
          [0, "&gne;"],
          [0, "&lnap;"],
          [0, "&gnap;"],
          [0, "&lEg;"],
          [0, "&gEl;"],
          [0, "&lsime;"],
          [0, "&gsime;"],
          [0, "&lsimg;"],
          [0, "&gsiml;"],
          [0, "&lgE;"],
          [0, "&glE;"],
          [0, "&lesges;"],
          [0, "&gesles;"],
          [0, "&els;"],
          [0, "&egs;"],
          [0, "&elsdot;"],
          [0, "&egsdot;"],
          [0, "&el;"],
          [0, "&eg;"],
          [2, "&siml;"],
          [0, "&simg;"],
          [0, "&simlE;"],
          [0, "&simgE;"],
          [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }],
          [
            0,
            { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" },
          ],
          [1, "&glj;"],
          [0, "&gla;"],
          [0, "&ltcc;"],
          [0, "&gtcc;"],
          [0, "&lescc;"],
          [0, "&gescc;"],
          [0, "&smt;"],
          [0, "&lat;"],
          [0, { v: "&smte;", n: 65024, o: "&smtes;" }],
          [0, { v: "&late;", n: 65024, o: "&lates;" }],
          [0, "&bumpE;"],
          [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }],
          [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }],
          [2, "&prE;"],
          [0, "&scE;"],
          [0, "&precneqq;"],
          [0, "&scnE;"],
          [0, "&prap;"],
          [0, "&scap;"],
          [0, "&precnapprox;"],
          [0, "&scnap;"],
          [0, "&Pr;"],
          [0, "&Sc;"],
          [0, "&subdot;"],
          [0, "&supdot;"],
          [0, "&subplus;"],
          [0, "&supplus;"],
          [0, "&submult;"],
          [0, "&supmult;"],
          [0, "&subedot;"],
          [0, "&supedot;"],
          [0, { v: "&subE;", n: 824, o: "&nsubE;" }],
          [0, { v: "&supE;", n: 824, o: "&nsupE;" }],
          [0, "&subsim;"],
          [0, "&supsim;"],
          [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }],
          [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }],
          [2, "&csub;"],
          [0, "&csup;"],
          [0, "&csube;"],
          [0, "&csupe;"],
          [0, "&subsup;"],
          [0, "&supsub;"],
          [0, "&subsub;"],
          [0, "&supsup;"],
          [0, "&suphsub;"],
          [0, "&supdsub;"],
          [0, "&forkv;"],
          [0, "&topfork;"],
          [0, "&mlcp;"],
          [8, "&Dashv;"],
          [1, "&Vdashl;"],
          [0, "&Barv;"],
          [0, "&vBar;"],
          [0, "&vBarv;"],
          [1, "&Vbar;"],
          [0, "&Not;"],
          [0, "&bNot;"],
          [0, "&rnmid;"],
          [0, "&cirmid;"],
          [0, "&midcir;"],
          [0, "&topcir;"],
          [0, "&nhpar;"],
          [0, "&parsim;"],
          [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }],
          [
            44343,
            {
              n: new Map(
                e([
                  [56476, "&Ascr;"],
                  [1, "&Cscr;"],
                  [0, "&Dscr;"],
                  [2, "&Gscr;"],
                  [2, "&Jscr;"],
                  [0, "&Kscr;"],
                  [2, "&Nscr;"],
                  [0, "&Oscr;"],
                  [0, "&Pscr;"],
                  [0, "&Qscr;"],
                  [1, "&Sscr;"],
                  [0, "&Tscr;"],
                  [0, "&Uscr;"],
                  [0, "&Vscr;"],
                  [0, "&Wscr;"],
                  [0, "&Xscr;"],
                  [0, "&Yscr;"],
                  [0, "&Zscr;"],
                  [0, "&ascr;"],
                  [0, "&bscr;"],
                  [0, "&cscr;"],
                  [0, "&dscr;"],
                  [1, "&fscr;"],
                  [1, "&hscr;"],
                  [0, "&iscr;"],
                  [0, "&jscr;"],
                  [0, "&kscr;"],
                  [0, "&lscr;"],
                  [0, "&mscr;"],
                  [0, "&nscr;"],
                  [1, "&pscr;"],
                  [0, "&qscr;"],
                  [0, "&rscr;"],
                  [0, "&sscr;"],
                  [0, "&tscr;"],
                  [0, "&uscr;"],
                  [0, "&vscr;"],
                  [0, "&wscr;"],
                  [0, "&xscr;"],
                  [0, "&yscr;"],
                  [0, "&zscr;"],
                  [52, "&Afr;"],
                  [0, "&Bfr;"],
                  [1, "&Dfr;"],
                  [0, "&Efr;"],
                  [0, "&Ffr;"],
                  [0, "&Gfr;"],
                  [2, "&Jfr;"],
                  [0, "&Kfr;"],
                  [0, "&Lfr;"],
                  [0, "&Mfr;"],
                  [0, "&Nfr;"],
                  [0, "&Ofr;"],
                  [0, "&Pfr;"],
                  [0, "&Qfr;"],
                  [1, "&Sfr;"],
                  [0, "&Tfr;"],
                  [0, "&Ufr;"],
                  [0, "&Vfr;"],
                  [0, "&Wfr;"],
                  [0, "&Xfr;"],
                  [0, "&Yfr;"],
                  [1, "&afr;"],
                  [0, "&bfr;"],
                  [0, "&cfr;"],
                  [0, "&dfr;"],
                  [0, "&efr;"],
                  [0, "&ffr;"],
                  [0, "&gfr;"],
                  [0, "&hfr;"],
                  [0, "&ifr;"],
                  [0, "&jfr;"],
                  [0, "&kfr;"],
                  [0, "&lfr;"],
                  [0, "&mfr;"],
                  [0, "&nfr;"],
                  [0, "&ofr;"],
                  [0, "&pfr;"],
                  [0, "&qfr;"],
                  [0, "&rfr;"],
                  [0, "&sfr;"],
                  [0, "&tfr;"],
                  [0, "&ufr;"],
                  [0, "&vfr;"],
                  [0, "&wfr;"],
                  [0, "&xfr;"],
                  [0, "&yfr;"],
                  [0, "&zfr;"],
                  [0, "&Aopf;"],
                  [0, "&Bopf;"],
                  [1, "&Dopf;"],
                  [0, "&Eopf;"],
                  [0, "&Fopf;"],
                  [0, "&Gopf;"],
                  [1, "&Iopf;"],
                  [0, "&Jopf;"],
                  [0, "&Kopf;"],
                  [0, "&Lopf;"],
                  [0, "&Mopf;"],
                  [1, "&Oopf;"],
                  [3, "&Sopf;"],
                  [0, "&Topf;"],
                  [0, "&Uopf;"],
                  [0, "&Vopf;"],
                  [0, "&Wopf;"],
                  [0, "&Xopf;"],
                  [0, "&Yopf;"],
                  [1, "&aopf;"],
                  [0, "&bopf;"],
                  [0, "&copf;"],
                  [0, "&dopf;"],
                  [0, "&eopf;"],
                  [0, "&fopf;"],
                  [0, "&gopf;"],
                  [0, "&hopf;"],
                  [0, "&iopf;"],
                  [0, "&jopf;"],
                  [0, "&kopf;"],
                  [0, "&lopf;"],
                  [0, "&mopf;"],
                  [0, "&nopf;"],
                  [0, "&oopf;"],
                  [0, "&popf;"],
                  [0, "&qopf;"],
                  [0, "&ropf;"],
                  [0, "&sopf;"],
                  [0, "&topf;"],
                  [0, "&uopf;"],
                  [0, "&vopf;"],
                  [0, "&wopf;"],
                  [0, "&xopf;"],
                  [0, "&yopf;"],
                  [0, "&zopf;"],
                ])
              ),
            },
          ],
          [8906, "&fflig;"],
          [0, "&filig;"],
          [0, "&fllig;"],
          [0, "&ffilig;"],
          [0, "&ffllig;"],
        ])
      )),
      zi
    );
  }
  var Wi,
    Ki,
    Zi,
    Xi = {};
  function Yi() {
    return (
      Wi ||
        ((Wi = 1),
        (function (e) {
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.escapeText =
              e.escapeAttribute =
              e.escapeUTF8 =
              e.escape =
              e.encodeXML =
              e.getCodePoint =
              e.xmlReplacer =
                void 0),
            (e.xmlReplacer = /["&'<>$\x80-\uFFFF]/g);
          var t = new Map([
            [34, "&quot;"],
            [38, "&amp;"],
            [39, "&apos;"],
            [60, "&lt;"],
            [62, "&gt;"],
          ]);
          function r(r) {
            for (var n, i = "", o = 0; null !== (n = e.xmlReplacer.exec(r)); ) {
              var s = n.index,
                a = r.charCodeAt(s),
                l = t.get(a);
              void 0 !== l
                ? ((i += r.substring(o, s) + l), (o = s + 1))
                : ((i += ""
                    .concat(r.substring(o, s), "&#x")
                    .concat((0, e.getCodePoint)(r, s).toString(16), ";")),
                  (o = e.xmlReplacer.lastIndex +=
                    Number(55296 == (64512 & a))));
            }
            return i + r.substr(o);
          }
          function n(e, t) {
            return function (r) {
              for (var n, i = 0, o = ""; (n = e.exec(r)); )
                i !== n.index && (o += r.substring(i, n.index)),
                  (o += t.get(n[0].charCodeAt(0))),
                  (i = n.index + 1);
              return o + r.substring(i);
            };
          }
          (e.getCodePoint =
            null != String.prototype.codePointAt
              ? function (e, t) {
                  return e.codePointAt(t);
                }
              : function (e, t) {
                  return 55296 == (64512 & e.charCodeAt(t))
                    ? 1024 * (e.charCodeAt(t) - 55296) +
                        e.charCodeAt(t + 1) -
                        56320 +
                        65536
                    : e.charCodeAt(t);
                }),
            (e.encodeXML = r),
            (e.escape = r),
            (e.escapeUTF8 = n(/[&<>'"]/g, t)),
            (e.escapeAttribute = n(
              /["&\u00A0]/g,
              new Map([
                [34, "&quot;"],
                [38, "&amp;"],
                [160, "&nbsp;"],
              ])
            )),
            (e.escapeText = n(
              /[&<>\u00A0]/g,
              new Map([
                [38, "&amp;"],
                [60, "&lt;"],
                [62, "&gt;"],
                [160, "&nbsp;"],
              ])
            ));
        })(Xi)),
      Xi
    );
  }
  function Qi() {
    if (Ki) return Ui;
    Ki = 1;
    var e =
      (Ui && Ui.__importDefault) ||
      function (e) {
        return e && e.__esModule ? e : { default: e };
      };
    Object.defineProperty(Ui, "__esModule", { value: !0 }),
      (Ui.encodeNonAsciiHTML = Ui.encodeHTML = void 0);
    var t = e(Gi()),
      r = Yi(),
      n = /[\t\n!-,./:-@[-`\f{-}$\x80-\uFFFF]/g;
    function i(e, n) {
      for (var i, o = "", s = 0; null !== (i = e.exec(n)); ) {
        var a = i.index;
        o += n.substring(s, a);
        var l = n.charCodeAt(a),
          c = t.default.get(l);
        if ("object" == typeof c) {
          if (a + 1 < n.length) {
            var u = n.charCodeAt(a + 1),
              d =
                "number" == typeof c.n
                  ? c.n === u
                    ? c.o
                    : void 0
                  : c.n.get(u);
            if (void 0 !== d) {
              (o += d), (s = e.lastIndex += 1);
              continue;
            }
          }
          c = c.v;
        }
        if (void 0 !== c) (o += c), (s = a + 1);
        else {
          var p = (0, r.getCodePoint)(n, a);
          (o += "&#x".concat(p.toString(16), ";")),
            (s = e.lastIndex += Number(p !== l));
        }
      }
      return o + n.substr(s);
    }
    return (
      (Ui.encodeHTML = function (e) {
        return i(n, e);
      }),
      (Ui.encodeNonAsciiHTML = function (e) {
        return i(r.xmlReplacer, e);
      }),
      Ui
    );
  }
  function Ji() {
    return (
      Zi ||
        ((Zi = 1),
        (function (e) {
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.decodeXMLStrict =
              e.decodeHTML5Strict =
              e.decodeHTML4Strict =
              e.decodeHTML5 =
              e.decodeHTML4 =
              e.decodeHTMLAttribute =
              e.decodeHTMLStrict =
              e.decodeHTML =
              e.decodeXML =
              e.DecodingMode =
              e.EntityDecoder =
              e.encodeHTML5 =
              e.encodeHTML4 =
              e.encodeNonAsciiHTML =
              e.encodeHTML =
              e.escapeText =
              e.escapeAttribute =
              e.escapeUTF8 =
              e.escape =
              e.encodeXML =
              e.encode =
              e.decodeStrict =
              e.decode =
              e.EncodingMode =
              e.EntityLevel =
                void 0);
          var t,
            r,
            n = Ai(),
            i = Qi(),
            o = Yi();
          function s(e, r) {
            if (
              (void 0 === r && (r = t.XML),
              ("number" == typeof r ? r : r.level) === t.HTML)
            ) {
              var i = "object" == typeof r ? r.mode : void 0;
              return (0, n.decodeHTML)(e, i);
            }
            return (0, n.decodeXML)(e);
          }
          !(function (e) {
            (e[(e.XML = 0)] = "XML"), (e[(e.HTML = 1)] = "HTML");
          })((t = e.EntityLevel || (e.EntityLevel = {}))),
            (function (e) {
              (e[(e.UTF8 = 0)] = "UTF8"),
                (e[(e.ASCII = 1)] = "ASCII"),
                (e[(e.Extensive = 2)] = "Extensive"),
                (e[(e.Attribute = 3)] = "Attribute"),
                (e[(e.Text = 4)] = "Text");
            })((r = e.EncodingMode || (e.EncodingMode = {}))),
            (e.decode = s),
            (e.decodeStrict = function (e, r) {
              var i;
              void 0 === r && (r = t.XML);
              var o = "number" == typeof r ? { level: r } : r;
              return (
                (null !== (i = o.mode) && void 0 !== i) ||
                  (o.mode = n.DecodingMode.Strict),
                s(e, o)
              );
            }),
            (e.encode = function (e, n) {
              void 0 === n && (n = t.XML);
              var s = "number" == typeof n ? { level: n } : n;
              return s.mode === r.UTF8
                ? (0, o.escapeUTF8)(e)
                : s.mode === r.Attribute
                ? (0, o.escapeAttribute)(e)
                : s.mode === r.Text
                ? (0, o.escapeText)(e)
                : s.level === t.HTML
                ? s.mode === r.ASCII
                  ? (0, i.encodeNonAsciiHTML)(e)
                  : (0, i.encodeHTML)(e)
                : (0, o.encodeXML)(e);
            });
          var a = Yi();
          Object.defineProperty(e, "encodeXML", {
            enumerable: !0,
            get: function () {
              return a.encodeXML;
            },
          }),
            Object.defineProperty(e, "escape", {
              enumerable: !0,
              get: function () {
                return a.escape;
              },
            }),
            Object.defineProperty(e, "escapeUTF8", {
              enumerable: !0,
              get: function () {
                return a.escapeUTF8;
              },
            }),
            Object.defineProperty(e, "escapeAttribute", {
              enumerable: !0,
              get: function () {
                return a.escapeAttribute;
              },
            }),
            Object.defineProperty(e, "escapeText", {
              enumerable: !0,
              get: function () {
                return a.escapeText;
              },
            });
          var l = Qi();
          Object.defineProperty(e, "encodeHTML", {
            enumerable: !0,
            get: function () {
              return l.encodeHTML;
            },
          }),
            Object.defineProperty(e, "encodeNonAsciiHTML", {
              enumerable: !0,
              get: function () {
                return l.encodeNonAsciiHTML;
              },
            }),
            Object.defineProperty(e, "encodeHTML4", {
              enumerable: !0,
              get: function () {
                return l.encodeHTML;
              },
            }),
            Object.defineProperty(e, "encodeHTML5", {
              enumerable: !0,
              get: function () {
                return l.encodeHTML;
              },
            });
          var c = Ai();
          Object.defineProperty(e, "EntityDecoder", {
            enumerable: !0,
            get: function () {
              return c.EntityDecoder;
            },
          }),
            Object.defineProperty(e, "DecodingMode", {
              enumerable: !0,
              get: function () {
                return c.DecodingMode;
              },
            }),
            Object.defineProperty(e, "decodeXML", {
              enumerable: !0,
              get: function () {
                return c.decodeXML;
              },
            }),
            Object.defineProperty(e, "decodeHTML", {
              enumerable: !0,
              get: function () {
                return c.decodeHTML;
              },
            }),
            Object.defineProperty(e, "decodeHTMLStrict", {
              enumerable: !0,
              get: function () {
                return c.decodeHTMLStrict;
              },
            }),
            Object.defineProperty(e, "decodeHTMLAttribute", {
              enumerable: !0,
              get: function () {
                return c.decodeHTMLAttribute;
              },
            }),
            Object.defineProperty(e, "decodeHTML4", {
              enumerable: !0,
              get: function () {
                return c.decodeHTML;
              },
            }),
            Object.defineProperty(e, "decodeHTML5", {
              enumerable: !0,
              get: function () {
                return c.decodeHTML;
              },
            }),
            Object.defineProperty(e, "decodeHTML4Strict", {
              enumerable: !0,
              get: function () {
                return c.decodeHTMLStrict;
              },
            }),
            Object.defineProperty(e, "decodeHTML5Strict", {
              enumerable: !0,
              get: function () {
                return c.decodeHTMLStrict;
              },
            }),
            Object.defineProperty(e, "decodeXMLStrict", {
              enumerable: !0,
              get: function () {
                return c.decodeXML;
              },
            });
        })(Vi)),
      Vi
    );
  }
  var eo,
    to,
    ro,
    no = {};
  function io() {
    return (
      eo ||
        ((eo = 1),
        Object.defineProperty(no, "__esModule", { value: !0 }),
        (no.attributeNames = no.elementNames = void 0),
        (no.elementNames = new Map(
          [
            "altGlyph",
            "altGlyphDef",
            "altGlyphItem",
            "animateColor",
            "animateMotion",
            "animateTransform",
            "clipPath",
            "feBlend",
            "feColorMatrix",
            "feComponentTransfer",
            "feComposite",
            "feConvolveMatrix",
            "feDiffuseLighting",
            "feDisplacementMap",
            "feDistantLight",
            "feDropShadow",
            "feFlood",
            "feFuncA",
            "feFuncB",
            "feFuncG",
            "feFuncR",
            "feGaussianBlur",
            "feImage",
            "feMerge",
            "feMergeNode",
            "feMorphology",
            "feOffset",
            "fePointLight",
            "feSpecularLighting",
            "feSpotLight",
            "feTile",
            "feTurbulence",
            "foreignObject",
            "glyphRef",
            "linearGradient",
            "radialGradient",
            "textPath",
          ].map(function (e) {
            return [e.toLowerCase(), e];
          })
        )),
        (no.attributeNames = new Map(
          [
            "definitionURL",
            "attributeName",
            "attributeType",
            "baseFrequency",
            "baseProfile",
            "calcMode",
            "clipPathUnits",
            "diffuseConstant",
            "edgeMode",
            "filterUnits",
            "glyphRef",
            "gradientTransform",
            "gradientUnits",
            "kernelMatrix",
            "kernelUnitLength",
            "keyPoints",
            "keySplines",
            "keyTimes",
            "lengthAdjust",
            "limitingConeAngle",
            "markerHeight",
            "markerUnits",
            "markerWidth",
            "maskContentUnits",
            "maskUnits",
            "numOctaves",
            "pathLength",
            "patternContentUnits",
            "patternTransform",
            "patternUnits",
            "pointsAtX",
            "pointsAtY",
            "pointsAtZ",
            "preserveAlpha",
            "preserveAspectRatio",
            "primitiveUnits",
            "refX",
            "refY",
            "repeatCount",
            "repeatDur",
            "requiredExtensions",
            "requiredFeatures",
            "specularConstant",
            "specularExponent",
            "spreadMethod",
            "startOffset",
            "stdDeviation",
            "stitchTiles",
            "surfaceScale",
            "systemLanguage",
            "tableValues",
            "targetX",
            "targetY",
            "textLength",
            "viewBox",
            "viewTarget",
            "xChannelSelector",
            "yChannelSelector",
            "zoomAndPan",
          ].map(function (e) {
            return [e.toLowerCase(), e];
          })
        ))),
      no
    );
  }
  function oo() {
    if (to) return Hi;
    to = 1;
    var e =
        (Hi && Hi.__assign) ||
        function () {
          return (
            (e =
              Object.assign ||
              function (e) {
                for (var t, r = 1, n = arguments.length; r < n; r++)
                  for (var i in (t = arguments[r]))
                    Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e;
              }),
            e.apply(this, arguments)
          );
        },
      t =
        (Hi && Hi.__createBinding) ||
        (Object.create
          ? function (e, t, r, n) {
              void 0 === n && (n = r);
              var i = Object.getOwnPropertyDescriptor(t, r);
              (i &&
                !("get" in i ? !t.__esModule : i.writable || i.configurable)) ||
                (i = {
                  enumerable: !0,
                  get: function () {
                    return t[r];
                  },
                }),
                Object.defineProperty(e, n, i);
            }
          : function (e, t, r, n) {
              void 0 === n && (n = r), (e[n] = t[r]);
            }),
      r =
        (Hi && Hi.__setModuleDefault) ||
        (Object.create
          ? function (e, t) {
              Object.defineProperty(e, "default", { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            }),
      n =
        (Hi && Hi.__importStar) ||
        function (e) {
          if (e && e.__esModule) return e;
          var n = {};
          if (null != e)
            for (var i in e)
              "default" !== i &&
                Object.prototype.hasOwnProperty.call(e, i) &&
                t(n, e, i);
          return r(n, e), n;
        };
    Object.defineProperty(Hi, "__esModule", { value: !0 }),
      (Hi.render = void 0);
    var i = n(_i()),
      o = Ji(),
      s = io(),
      a = new Set([
        "style",
        "script",
        "xmp",
        "iframe",
        "noembed",
        "noframes",
        "plaintext",
        "noscript",
      ]);
    function l(e) {
      return e.replace(/"/g, "&quot;");
    }
    var c = new Set([
      "area",
      "base",
      "basefont",
      "br",
      "col",
      "command",
      "embed",
      "frame",
      "hr",
      "img",
      "input",
      "isindex",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ]);
    function u(e, t) {
      void 0 === t && (t = {});
      for (var r = ("length" in e) ? e : [e], n = "", i = 0; i < r.length; i++)
        n += d(r[i], t);
      return n;
    }
    function d(t, r) {
      switch (t.type) {
        case i.Root:
          return u(t.children, r);
        case i.Doctype:
        case i.Directive:
          return "<".concat(t.data, ">");
        case i.Comment:
          return (function (e) {
            return "\x3c!--".concat(e.data, "--\x3e");
          })(t);
        case i.CDATA:
          return (function (e) {
            return "<![CDATA[".concat(e.children[0].data, "]]>");
          })(t);
        case i.Script:
        case i.Style:
        case i.Tag:
          return (function (t, r) {
            var n;
            "foreign" === r.xmlMode &&
              ((t.name =
                null !== (n = s.elementNames.get(t.name)) && void 0 !== n
                  ? n
                  : t.name),
              t.parent &&
                p.has(t.parent.name) &&
                (r = e(e({}, r), { xmlMode: !1 })));
            !r.xmlMode &&
              h.has(t.name) &&
              (r = e(e({}, r), { xmlMode: "foreign" }));
            var i = "<".concat(t.name),
              a = (function (e, t) {
                var r;
                if (e) {
                  var n =
                    !1 ===
                    (null !== (r = t.encodeEntities) && void 0 !== r
                      ? r
                      : t.decodeEntities)
                      ? l
                      : t.xmlMode || "utf8" !== t.encodeEntities
                      ? o.encodeXML
                      : o.escapeAttribute;
                  return Object.keys(e)
                    .map(function (r) {
                      var i,
                        o,
                        a = null !== (i = e[r]) && void 0 !== i ? i : "";
                      return (
                        "foreign" === t.xmlMode &&
                          (r =
                            null !== (o = s.attributeNames.get(r)) &&
                            void 0 !== o
                              ? o
                              : r),
                        t.emptyAttrs || t.xmlMode || "" !== a
                          ? "".concat(r, '="').concat(n(a), '"')
                          : r
                      );
                    })
                    .join(" ");
                }
              })(t.attribs, r);
            a && (i += " ".concat(a));
            0 === t.children.length &&
            (r.xmlMode
              ? !1 !== r.selfClosingTags
              : r.selfClosingTags && c.has(t.name))
              ? (r.xmlMode || (i += " "), (i += "/>"))
              : ((i += ">"),
                t.children.length > 0 && (i += u(t.children, r)),
                (!r.xmlMode && c.has(t.name)) ||
                  (i += "</".concat(t.name, ">")));
            return i;
          })(t, r);
        case i.Text:
          return (function (e, t) {
            var r,
              n = e.data || "";
            !1 ===
              (null !== (r = t.encodeEntities) && void 0 !== r
                ? r
                : t.decodeEntities) ||
              (!t.xmlMode && e.parent && a.has(e.parent.name)) ||
              (n =
                t.xmlMode || "utf8" !== t.encodeEntities
                  ? (0, o.encodeXML)(n)
                  : (0, o.escapeText)(n));
            return n;
          })(t, r);
      }
    }
    (Hi.render = u), (Hi.default = u);
    var p = new Set([
        "mi",
        "mo",
        "mn",
        "ms",
        "mtext",
        "annotation-xml",
        "foreignObject",
        "desc",
        "title",
      ]),
      h = new Set(["svg", "math"]);
    return Hi;
  }
  function so() {
    if (ro) return ji;
    ro = 1;
    var e =
      (ji && ji.__importDefault) ||
      function (e) {
        return e && e.__esModule ? e : { default: e };
      };
    Object.defineProperty(ji, "__esModule", { value: !0 }),
      (ji.getOuterHTML = i),
      (ji.getInnerHTML = function (e, r) {
        return (0, t.hasChildren)(e)
          ? e.children
              .map(function (e) {
                return i(e, r);
              })
              .join("")
          : "";
      }),
      (ji.getText = function e(r) {
        return Array.isArray(r)
          ? r.map(e).join("")
          : (0, t.isTag)(r)
          ? "br" === r.name
            ? "\n"
            : e(r.children)
          : (0, t.isCDATA)(r)
          ? e(r.children)
          : (0, t.isText)(r)
          ? r.data
          : "";
      }),
      (ji.textContent = function e(r) {
        if (Array.isArray(r)) return r.map(e).join("");
        if ((0, t.hasChildren)(r) && !(0, t.isComment)(r)) return e(r.children);
        return (0, t.isText)(r) ? r.data : "";
      }),
      (ji.innerText = function e(r) {
        if (Array.isArray(r)) return r.map(e).join("");
        if (
          (0, t.hasChildren)(r) &&
          (r.type === n.ElementType.Tag || (0, t.isCDATA)(r))
        )
          return e(r.children);
        return (0, t.isText)(r) ? r.data : "";
      });
    var t = Fi(),
      r = e(oo()),
      n = _i();
    function i(e, t) {
      return (0, r.default)(e, t);
    }
    return ji;
  }
  var ao,
    lo = {};
  function co() {
    if (ao) return lo;
    (ao = 1),
      Object.defineProperty(lo, "__esModule", { value: !0 }),
      (lo.getChildren = t),
      (lo.getParent = r),
      (lo.getSiblings = function (e) {
        var n = r(e);
        if (null != n) return t(n);
        var i = [e],
          o = e.prev,
          s = e.next;
        for (; null != o; ) i.unshift(o), (o = o.prev);
        for (; null != s; ) i.push(s), (s = s.next);
        return i;
      }),
      (lo.getAttributeValue = function (e, t) {
        var r;
        return null === (r = e.attribs) || void 0 === r ? void 0 : r[t];
      }),
      (lo.hasAttrib = function (e, t) {
        return (
          null != e.attribs &&
          Object.prototype.hasOwnProperty.call(e.attribs, t) &&
          null != e.attribs[t]
        );
      }),
      (lo.getName = function (e) {
        return e.name;
      }),
      (lo.nextElementSibling = function (t) {
        var r = t.next;
        for (; null !== r && !(0, e.isTag)(r); ) r = r.next;
        return r;
      }),
      (lo.prevElementSibling = function (t) {
        var r = t.prev;
        for (; null !== r && !(0, e.isTag)(r); ) r = r.prev;
        return r;
      });
    var e = Fi();
    function t(t) {
      return (0, e.hasChildren)(t) ? t.children : [];
    }
    function r(e) {
      return e.parent || null;
    }
    return lo;
  }
  var uo,
    po = {};
  function ho() {
    if (uo) return po;
    function e(e) {
      if (
        (e.prev && (e.prev.next = e.next),
        e.next && (e.next.prev = e.prev),
        e.parent)
      ) {
        var t = e.parent.children,
          r = t.lastIndexOf(e);
        r >= 0 && t.splice(r, 1);
      }
      (e.next = null), (e.prev = null), (e.parent = null);
    }
    return (
      (uo = 1),
      Object.defineProperty(po, "__esModule", { value: !0 }),
      (po.removeElement = e),
      (po.replaceElement = function (e, t) {
        var r = (t.prev = e.prev);
        r && (r.next = t);
        var n = (t.next = e.next);
        n && (n.prev = t);
        var i = (t.parent = e.parent);
        if (i) {
          var o = i.children;
          (o[o.lastIndexOf(e)] = t), (e.parent = null);
        }
      }),
      (po.appendChild = function (t, r) {
        if ((e(r), (r.next = null), (r.parent = t), t.children.push(r) > 1)) {
          var n = t.children[t.children.length - 2];
          (n.next = r), (r.prev = n);
        } else r.prev = null;
      }),
      (po.append = function (t, r) {
        e(r);
        var n = t.parent,
          i = t.next;
        if (((r.next = i), (r.prev = t), (t.next = r), (r.parent = n), i)) {
          if (((i.prev = r), n)) {
            var o = n.children;
            o.splice(o.lastIndexOf(i), 0, r);
          }
        } else n && n.children.push(r);
      }),
      (po.prependChild = function (t, r) {
        if (
          (e(r), (r.parent = t), (r.prev = null), 1 !== t.children.unshift(r))
        ) {
          var n = t.children[1];
          (n.prev = r), (r.next = n);
        } else r.next = null;
      }),
      (po.prepend = function (t, r) {
        e(r);
        var n = t.parent;
        if (n) {
          var i = n.children;
          i.splice(i.indexOf(t), 0, r);
        }
        t.prev && (t.prev.next = r);
        (r.parent = n), (r.prev = t.prev), (r.next = t), (t.prev = r);
      }),
      po
    );
  }
  var fo,
    go = {};
  function mo() {
    if (fo) return go;
    (fo = 1),
      Object.defineProperty(go, "__esModule", { value: !0 }),
      (go.filter = function (e, r, n, i) {
        void 0 === n && (n = !0);
        void 0 === i && (i = 1 / 0);
        return t(e, Array.isArray(r) ? r : [r], n, i);
      }),
      (go.find = t),
      (go.findOneChild = function (e, t) {
        return t.find(e);
      }),
      (go.findOne = function t(r, n, i) {
        void 0 === i && (i = !0);
        for (var o = Array.isArray(n) ? n : [n], s = 0; s < o.length; s++) {
          var a = o[s];
          if ((0, e.isTag)(a) && r(a)) return a;
          if (i && (0, e.hasChildren)(a) && a.children.length > 0) {
            var l = t(r, a.children, !0);
            if (l) return l;
          }
        }
        return null;
      }),
      (go.existsOne = function t(r, n) {
        return (Array.isArray(n) ? n : [n]).some(function (n) {
          return (
            ((0, e.isTag)(n) && r(n)) ||
            ((0, e.hasChildren)(n) && t(r, n.children))
          );
        });
      }),
      (go.findAll = function (t, r) {
        for (var n = [], i = [Array.isArray(r) ? r : [r]], o = [0]; ; )
          if (o[0] >= i[0].length) {
            if (1 === i.length) return n;
            i.shift(), o.shift();
          } else {
            var s = i[0][o[0]++];
            (0, e.isTag)(s) && t(s) && n.push(s),
              (0, e.hasChildren)(s) &&
                s.children.length > 0 &&
                (o.unshift(0), i.unshift(s.children));
          }
      });
    var e = Fi();
    function t(t, r, n, i) {
      for (var o = [], s = [Array.isArray(r) ? r : [r]], a = [0]; ; )
        if (a[0] >= s[0].length) {
          if (1 === a.length) return o;
          s.shift(), a.shift();
        } else {
          var l = s[0][a[0]++];
          if (t(l) && (o.push(l), --i <= 0)) return o;
          n &&
            (0, e.hasChildren)(l) &&
            l.children.length > 0 &&
            (a.unshift(0), s.unshift(l.children));
        }
    }
    return go;
  }
  var vo,
    yo = {};
  function bo() {
    if (vo) return yo;
    (vo = 1),
      Object.defineProperty(yo, "__esModule", { value: !0 }),
      (yo.testElement = function (e, t) {
        var r = o(e);
        return !r || r(t);
      }),
      (yo.getElements = function (e, r, n, i) {
        void 0 === i && (i = 1 / 0);
        var s = o(e);
        return s ? (0, t.filter)(s, r, n, i) : [];
      }),
      (yo.getElementById = function (e, r, i) {
        void 0 === i && (i = !0);
        Array.isArray(r) || (r = [r]);
        return (0, t.findOne)(n("id", e), r, i);
      }),
      (yo.getElementsByTagName = function (e, n, i, o) {
        void 0 === i && (i = !0);
        void 0 === o && (o = 1 / 0);
        return (0, t.filter)(r.tag_name(e), n, i, o);
      }),
      (yo.getElementsByClassName = function (e, r, i, o) {
        void 0 === i && (i = !0);
        void 0 === o && (o = 1 / 0);
        return (0, t.filter)(n("class", e), r, i, o);
      }),
      (yo.getElementsByTagType = function (e, n, i, o) {
        void 0 === i && (i = !0);
        void 0 === o && (o = 1 / 0);
        return (0, t.filter)(r.tag_type(e), n, i, o);
      });
    var e = Fi(),
      t = mo(),
      r = {
        tag_name: function (t) {
          return "function" == typeof t
            ? function (r) {
                return (0, e.isTag)(r) && t(r.name);
              }
            : "*" === t
            ? e.isTag
            : function (r) {
                return (0, e.isTag)(r) && r.name === t;
              };
        },
        tag_type: function (e) {
          return "function" == typeof e
            ? function (t) {
                return e(t.type);
              }
            : function (t) {
                return t.type === e;
              };
        },
        tag_contains: function (t) {
          return "function" == typeof t
            ? function (r) {
                return (0, e.isText)(r) && t(r.data);
              }
            : function (r) {
                return (0, e.isText)(r) && r.data === t;
              };
        },
      };
    function n(t, r) {
      return "function" == typeof r
        ? function (n) {
            return (0, e.isTag)(n) && r(n.attribs[t]);
          }
        : function (n) {
            return (0, e.isTag)(n) && n.attribs[t] === r;
          };
    }
    function i(e, t) {
      return function (r) {
        return e(r) || t(r);
      };
    }
    function o(e) {
      var t = Object.keys(e).map(function (t) {
        var i = e[t];
        return Object.prototype.hasOwnProperty.call(r, t) ? r[t](i) : n(t, i);
      });
      return 0 === t.length ? null : t.reduce(i);
    }
    return yo;
  }
  var wo,
    xo = {};
  function Co() {
    if (wo) return xo;
    (wo = 1),
      Object.defineProperty(xo, "__esModule", { value: !0 }),
      (xo.DocumentPosition = void 0),
      (xo.removeSubsets = function (e) {
        var t = e.length;
        for (; --t >= 0; ) {
          var r = e[t];
          if (t > 0 && e.lastIndexOf(r, t - 1) >= 0) e.splice(t, 1);
          else
            for (var n = r.parent; n; n = n.parent)
              if (e.includes(n)) {
                e.splice(t, 1);
                break;
              }
        }
        return e;
      }),
      (xo.compareDocumentPosition = r),
      (xo.uniqueSort = function (t) {
        return (
          (t = t.filter(function (e, t, r) {
            return !r.includes(e, t + 1);
          })),
          t.sort(function (t, n) {
            var i = r(t, n);
            return i & e.PRECEDING ? -1 : i & e.FOLLOWING ? 1 : 0;
          }),
          t
        );
      });
    var e,
      t = Fi();
    function r(r, n) {
      var i = [],
        o = [];
      if (r === n) return 0;
      for (var s = (0, t.hasChildren)(r) ? r : r.parent; s; )
        i.unshift(s), (s = s.parent);
      for (s = (0, t.hasChildren)(n) ? n : n.parent; s; )
        o.unshift(s), (s = s.parent);
      for (
        var a = Math.min(i.length, o.length), l = 0;
        l < a && i[l] === o[l];

      )
        l++;
      if (0 === l) return e.DISCONNECTED;
      var c = i[l - 1],
        u = c.children,
        d = i[l],
        p = o[l];
      return u.indexOf(d) > u.indexOf(p)
        ? c === n
          ? e.FOLLOWING | e.CONTAINED_BY
          : e.FOLLOWING
        : c === r
        ? e.PRECEDING | e.CONTAINS
        : e.PRECEDING;
    }
    return (
      (function (e) {
        (e[(e.DISCONNECTED = 1)] = "DISCONNECTED"),
          (e[(e.PRECEDING = 2)] = "PRECEDING"),
          (e[(e.FOLLOWING = 4)] = "FOLLOWING"),
          (e[(e.CONTAINS = 8)] = "CONTAINS"),
          (e[(e.CONTAINED_BY = 16)] = "CONTAINED_BY");
      })(e || (xo.DocumentPosition = e = {})),
      xo
    );
  }
  var So,
    ko,
    Eo,
    To,
    Ao,
    Oo = {};
  function Po() {
    if (So) return Oo;
    (So = 1),
      Object.defineProperty(Oo, "__esModule", { value: !0 }),
      (Oo.getFeed = function (e) {
        var r = o(l, e);
        return r
          ? "feed" === r.name
            ? (function (e) {
                var r,
                  n = e.children,
                  l = {
                    type: "atom",
                    items: (0, t.getElementsByTagName)("entry", n).map(
                      function (e) {
                        var t,
                          r = e.children,
                          n = { media: i(r) };
                        a(n, "id", "id", r), a(n, "title", "title", r);
                        var l =
                          null === (t = o("link", r)) || void 0 === t
                            ? void 0
                            : t.attribs.href;
                        l && (n.link = l);
                        var c = s("summary", r) || s("content", r);
                        c && (n.description = c);
                        var u = s("updated", r);
                        return u && (n.pubDate = new Date(u)), n;
                      }
                    ),
                  };
                a(l, "id", "id", n), a(l, "title", "title", n);
                var c =
                  null === (r = o("link", n)) || void 0 === r
                    ? void 0
                    : r.attribs.href;
                c && (l.link = c);
                a(l, "description", "subtitle", n);
                var u = s("updated", n);
                u && (l.updated = new Date(u));
                return a(l, "author", "email", n, !0), l;
              })(r)
            : (function (e) {
                var r,
                  n,
                  l =
                    null !==
                      (n =
                        null === (r = o("channel", e.children)) || void 0 === r
                          ? void 0
                          : r.children) && void 0 !== n
                      ? n
                      : [],
                  c = {
                    type: e.name.substr(0, 3),
                    id: "",
                    items: (0, t.getElementsByTagName)("item", e.children).map(
                      function (e) {
                        var t = e.children,
                          r = { media: i(t) };
                        a(r, "id", "guid", t),
                          a(r, "title", "title", t),
                          a(r, "link", "link", t),
                          a(r, "description", "description", t);
                        var n = s("pubDate", t) || s("dc:date", t);
                        return n && (r.pubDate = new Date(n)), r;
                      }
                    ),
                  };
                a(c, "title", "title", l),
                  a(c, "link", "link", l),
                  a(c, "description", "description", l);
                var u = s("lastBuildDate", l);
                u && (c.updated = new Date(u));
                return a(c, "author", "managingEditor", l, !0), c;
              })(r)
          : null;
      });
    var e = so(),
      t = bo();
    var r = ["url", "type", "lang"],
      n = [
        "fileSize",
        "bitrate",
        "framerate",
        "samplingrate",
        "channels",
        "duration",
        "height",
        "width",
      ];
    function i(e) {
      return (0, t.getElementsByTagName)("media:content", e).map(function (e) {
        for (
          var t = e.attribs,
            i = { medium: t.medium, isDefault: !!t.isDefault },
            o = 0,
            s = r;
          o < s.length;
          o++
        ) {
          t[(c = s[o])] && (i[c] = t[c]);
        }
        for (var a = 0, l = n; a < l.length; a++) {
          var c;
          t[(c = l[a])] && (i[c] = parseInt(t[c], 10));
        }
        return t.expression && (i.expression = t.expression), i;
      });
    }
    function o(e, r) {
      return (0, t.getElementsByTagName)(e, r, !0, 1)[0];
    }
    function s(r, n, i) {
      return (
        void 0 === i && (i = !1),
        (0, e.textContent)((0, t.getElementsByTagName)(r, n, i, 1)).trim()
      );
    }
    function a(e, t, r, n, i) {
      void 0 === i && (i = !1);
      var o = s(r, n, i);
      o && (e[t] = o);
    }
    function l(e) {
      return "rss" === e || "feed" === e || "rdf:RDF" === e;
    }
    return Oo;
  }
  function Mo() {
    return (
      ko ||
        ((ko = 1),
        (function (e) {
          var t =
              (qi && qi.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var i = Object.getOwnPropertyDescriptor(t, r);
                    (i &&
                      !("get" in i
                        ? !t.__esModule
                        : i.writable || i.configurable)) ||
                      (i = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            r =
              (qi && qi.__exportStar) ||
              function (e, r) {
                for (var n in e)
                  "default" === n ||
                    Object.prototype.hasOwnProperty.call(r, n) ||
                    t(r, e, n);
              };
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.hasChildren =
              e.isDocument =
              e.isComment =
              e.isText =
              e.isCDATA =
              e.isTag =
                void 0),
            r(so(), e),
            r(co(), e),
            r(ho(), e),
            r(mo(), e),
            r(bo(), e),
            r(Co(), e),
            r(Po(), e);
          var n = Fi();
          Object.defineProperty(e, "isTag", {
            enumerable: !0,
            get: function () {
              return n.isTag;
            },
          }),
            Object.defineProperty(e, "isCDATA", {
              enumerable: !0,
              get: function () {
                return n.isCDATA;
              },
            }),
            Object.defineProperty(e, "isText", {
              enumerable: !0,
              get: function () {
                return n.isText;
              },
            }),
            Object.defineProperty(e, "isComment", {
              enumerable: !0,
              get: function () {
                return n.isComment;
              },
            }),
            Object.defineProperty(e, "isDocument", {
              enumerable: !0,
              get: function () {
                return n.isDocument;
              },
            }),
            Object.defineProperty(e, "hasChildren", {
              enumerable: !0,
              get: function () {
                return n.hasChildren;
              },
            });
        })(qi)),
      qi
    );
  }
  function No() {
    return (
      Eo ||
        ((Eo = 1),
        (function (e) {
          var t =
              (pi && pi.__createBinding) ||
              (Object.create
                ? function (e, t, r, n) {
                    void 0 === n && (n = r);
                    var i = Object.getOwnPropertyDescriptor(t, r);
                    (i &&
                      !("get" in i
                        ? !t.__esModule
                        : i.writable || i.configurable)) ||
                      (i = {
                        enumerable: !0,
                        get: function () {
                          return t[r];
                        },
                      }),
                      Object.defineProperty(e, n, i);
                  }
                : function (e, t, r, n) {
                    void 0 === n && (n = r), (e[n] = t[r]);
                  }),
            r =
              (pi && pi.__setModuleDefault) ||
              (Object.create
                ? function (e, t) {
                    Object.defineProperty(e, "default", {
                      enumerable: !0,
                      value: t,
                    });
                  }
                : function (e, t) {
                    e.default = t;
                  }),
            n =
              (pi && pi.__importStar) ||
              function (e) {
                if (e && e.__esModule) return e;
                var n = {};
                if (null != e)
                  for (var i in e)
                    "default" !== i &&
                      Object.prototype.hasOwnProperty.call(e, i) &&
                      t(n, e, i);
                return r(n, e), n;
              },
            i =
              (pi && pi.__importDefault) ||
              function (e) {
                return e && e.__esModule ? e : { default: e };
              };
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.DomUtils =
              e.parseFeed =
              e.getFeed =
              e.ElementType =
              e.Tokenizer =
              e.createDomStream =
              e.parseDOM =
              e.parseDocument =
              e.DefaultHandler =
              e.DomHandler =
              e.Parser =
                void 0);
          var o = Pi(),
            s = Pi();
          Object.defineProperty(e, "Parser", {
            enumerable: !0,
            get: function () {
              return s.Parser;
            },
          });
          var a = Fi(),
            l = Fi();
          function c(e, t) {
            var r = new a.DomHandler(void 0, t);
            return new o.Parser(r, t).end(e), r.root;
          }
          function u(e, t) {
            return c(e, t).children;
          }
          Object.defineProperty(e, "DomHandler", {
            enumerable: !0,
            get: function () {
              return l.DomHandler;
            },
          }),
            Object.defineProperty(e, "DefaultHandler", {
              enumerable: !0,
              get: function () {
                return l.DomHandler;
              },
            }),
            (e.parseDocument = c),
            (e.parseDOM = u),
            (e.createDomStream = function (e, t, r) {
              var n = new a.DomHandler(e, t, r);
              return new o.Parser(n, t);
            });
          var d = Oi();
          Object.defineProperty(e, "Tokenizer", {
            enumerable: !0,
            get: function () {
              return i(d).default;
            },
          }),
            (e.ElementType = n(_i()));
          var p = Mo(),
            h = Mo();
          Object.defineProperty(e, "getFeed", {
            enumerable: !0,
            get: function () {
              return h.getFeed;
            },
          });
          var f = { xmlMode: !0 };
          (e.parseFeed = function (e, t) {
            return void 0 === t && (t = f), (0, p.getFeed)(u(e, t));
          }),
            (e.DomUtils = n(Mo()));
        })(pi)),
      pi
    );
  }
  function Io() {
    return Ao
      ? To
      : ((Ao = 1),
        (To = (e) => {
          if ("string" != typeof e) throw new TypeError("Expected a string");
          return e
            .replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
            .replace(/-/g, "\\x2d");
        }));
  }
  var _o,
    Lo,
    Do,
    Ro = {};
  function $o() {
    if (_o) return Ro;
    function e(e) {
      return "[object Object]" === Object.prototype.toString.call(e);
    }
    return (
      (_o = 1),
      Object.defineProperty(Ro, "__esModule", { value: !0 }),
      (Ro.isPlainObject = function (t) {
        var r, n;
        return (
          !1 !== e(t) &&
          (void 0 === (r = t.constructor) ||
            (!1 !== e((n = r.prototype)) &&
              !1 !== n.hasOwnProperty("isPrototypeOf")))
        );
      }),
      Ro
    );
  }
  function Fo() {
    if (Do) return Lo;
    Do = 1;
    var e = function (e) {
      return (
        (function (e) {
          return !!e && "object" == typeof e;
        })(e) &&
        !(function (e) {
          var r = Object.prototype.toString.call(e);
          return (
            "[object RegExp]" === r ||
            "[object Date]" === r ||
            (function (e) {
              return e.$$typeof === t;
            })(e)
          );
        })(e)
      );
    };
    var t =
      "function" == typeof Symbol && Symbol.for
        ? Symbol.for("react.element")
        : 60103;
    function r(e, t) {
      return !1 !== t.clone && t.isMergeableObject(e)
        ? a(((r = e), Array.isArray(r) ? [] : {}), e, t)
        : e;
      var r;
    }
    function n(e, t, n) {
      return e.concat(t).map(function (e) {
        return r(e, n);
      });
    }
    function i(e) {
      return Object.keys(e).concat(
        (function (e) {
          return Object.getOwnPropertySymbols
            ? Object.getOwnPropertySymbols(e).filter(function (t) {
                return Object.propertyIsEnumerable.call(e, t);
              })
            : [];
        })(e)
      );
    }
    function o(e, t) {
      try {
        return t in e;
      } catch (e) {
        return !1;
      }
    }
    function s(e, t, n) {
      var s = {};
      return (
        n.isMergeableObject(e) &&
          i(e).forEach(function (t) {
            s[t] = r(e[t], n);
          }),
        i(t).forEach(function (i) {
          (function (e, t) {
            return (
              o(e, t) &&
              !(
                Object.hasOwnProperty.call(e, t) &&
                Object.propertyIsEnumerable.call(e, t)
              )
            );
          })(e, i) ||
            (o(e, i) && n.isMergeableObject(t[i])
              ? (s[i] = (function (e, t) {
                  if (!t.customMerge) return a;
                  var r = t.customMerge(e);
                  return "function" == typeof r ? r : a;
                })(i, n)(e[i], t[i], n))
              : (s[i] = r(t[i], n)));
        }),
        s
      );
    }
    function a(t, i, o) {
      ((o = o || {}).arrayMerge = o.arrayMerge || n),
        (o.isMergeableObject = o.isMergeableObject || e),
        (o.cloneUnlessOtherwiseSpecified = r);
      var a = Array.isArray(i);
      return a === Array.isArray(t)
        ? a
          ? o.arrayMerge(t, i, o)
          : s(t, i, o)
        : r(i, o);
    }
    return (
      (a.all = function (e, t) {
        if (!Array.isArray(e))
          throw new Error("first argument should be an array");
        return e.reduce(function (e, r) {
          return a(e, r, t);
        }, {});
      }),
      (Lo = a)
    );
  }
  var Bo,
    qo = { exports: {} },
    jo = qo.exports;
  function Ho() {
    return (
      Bo ||
        ((Bo = 1),
        (e = qo),
        (function (t, r) {
          e.exports ? (e.exports = r()) : (t.parseSrcset = r());
        })(jo, function () {
          return function (e) {
            function t(e) {
              return (
                " " === e ||
                "\t" === e ||
                "\n" === e ||
                "\f" === e ||
                "\r" === e
              );
            }
            function r(t) {
              var r,
                n = t.exec(e.substring(g));
              if (n) return (r = n[0]), (g += r.length), r;
            }
            for (
              var n,
                i,
                o,
                s,
                a,
                l = e.length,
                c = /^[ \t\n\r\u000c]+/,
                u = /^[, \t\n\r\u000c]+/,
                d = /^[^ \t\n\r\u000c]+/,
                p = /[,]+$/,
                h = /^\d+$/,
                f = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,
                g = 0,
                m = [];
              ;

            ) {
              if ((r(u), g >= l)) return m;
              (n = r(d)),
                (i = []),
                "," === n.slice(-1) ? ((n = n.replace(p, "")), y()) : v();
            }
            function v() {
              for (r(c), o = "", s = "in descriptor"; ; ) {
                if (((a = e.charAt(g)), "in descriptor" === s))
                  if (t(a))
                    o && (i.push(o), (o = ""), (s = "after descriptor"));
                  else {
                    if ("," === a) return (g += 1), o && i.push(o), void y();
                    if ("(" === a) (o += a), (s = "in parens");
                    else {
                      if ("" === a) return o && i.push(o), void y();
                      o += a;
                    }
                  }
                else if ("in parens" === s)
                  if (")" === a) (o += a), (s = "in descriptor");
                  else {
                    if ("" === a) return i.push(o), void y();
                    o += a;
                  }
                else if ("after descriptor" === s)
                  if (t(a));
                  else {
                    if ("" === a) return void y();
                    (s = "in descriptor"), (g -= 1);
                  }
                g += 1;
              }
            }
            function y() {
              var t,
                r,
                o,
                s,
                a,
                l,
                c,
                u,
                d,
                p = !1,
                g = {};
              for (s = 0; s < i.length; s++)
                (l = (a = i[s])[a.length - 1]),
                  (c = a.substring(0, a.length - 1)),
                  (u = parseInt(c, 10)),
                  (d = parseFloat(c)),
                  h.test(c) && "w" === l
                    ? ((t || r) && (p = !0), 0 === u ? (p = !0) : (t = u))
                    : f.test(c) && "x" === l
                    ? ((t || r || o) && (p = !0), d < 0 ? (p = !0) : (r = d))
                    : h.test(c) && "h" === l
                    ? ((o || r) && (p = !0), 0 === u ? (p = !0) : (o = u))
                    : (p = !0);
              p
                ? console &&
                  console.log &&
                  console.log(
                    "Invalid srcset descriptor found in '" +
                      e +
                      "' at '" +
                      a +
                      "'."
                  )
                : ((g.url = n),
                  t && (g.w = t),
                  r && (g.d = r),
                  o && (g.h = o),
                  m.push(g));
            }
          };
        })),
      qo.exports
    );
    var e;
  }
  var Vo,
    Uo = { exports: {} };
  function zo() {
    if (Vo) return Uo.exports;
    Vo = 1;
    var e = String,
      t = function () {
        return {
          isColorSupported: !1,
          reset: e,
          bold: e,
          dim: e,
          italic: e,
          underline: e,
          inverse: e,
          hidden: e,
          strikethrough: e,
          black: e,
          red: e,
          green: e,
          yellow: e,
          blue: e,
          magenta: e,
          cyan: e,
          white: e,
          gray: e,
          bgBlack: e,
          bgRed: e,
          bgGreen: e,
          bgYellow: e,
          bgBlue: e,
          bgMagenta: e,
          bgCyan: e,
          bgWhite: e,
          blackBright: e,
          redBright: e,
          greenBright: e,
          yellowBright: e,
          blueBright: e,
          magentaBright: e,
          cyanBright: e,
          whiteBright: e,
          bgBlackBright: e,
          bgRedBright: e,
          bgGreenBright: e,
          bgYellowBright: e,
          bgBlueBright: e,
          bgMagentaBright: e,
          bgCyanBright: e,
          bgWhiteBright: e,
        };
      };
    return (Uo.exports = t()), (Uo.exports.createColors = t), Uo.exports;
  }
  var Go,
    Wo,
    Ko,
    Zo,
    Xo,
    Yo,
    Qo = ui(Object.freeze({ __proto__: null, default: {} }));
  function Jo() {
    if (Wo) return Go;
    Wo = 1;
    let e = zo(),
      t = Qo;
    class r extends Error {
      constructor(e, t, n, i, o, s) {
        super(e),
          (this.name = "CssSyntaxError"),
          (this.reason = e),
          o && (this.file = o),
          i && (this.source = i),
          s && (this.plugin = s),
          void 0 !== t &&
            void 0 !== n &&
            ("number" == typeof t
              ? ((this.line = t), (this.column = n))
              : ((this.line = t.line),
                (this.column = t.column),
                (this.endLine = n.line),
                (this.endColumn = n.column))),
          this.setMessage(),
          Error.captureStackTrace && Error.captureStackTrace(this, r);
      }
      setMessage() {
        (this.message = this.plugin ? this.plugin + ": " : ""),
          (this.message += this.file ? this.file : "<css input>"),
          void 0 !== this.line &&
            (this.message += ":" + this.line + ":" + this.column),
          (this.message += ": " + this.reason);
      }
      showSourceCode(r) {
        if (!this.source) return "";
        let n = this.source;
        null == r && (r = e.isColorSupported);
        let i = (e) => e,
          o = (e) => e,
          s = (e) => e;
        if (r) {
          let { bold: r, gray: n, red: a } = e.createColors(!0);
          (o = (e) => r(a(e))), (i = (e) => n(e)), t && (s = (e) => t(e));
        }
        let a = n.split(/\r?\n/),
          l = Math.max(this.line - 3, 0),
          c = Math.min(this.line + 2, a.length),
          u = String(c).length;
        return a
          .slice(l, c)
          .map((e, t) => {
            let r = l + 1 + t,
              n = " " + (" " + r).slice(-u) + " | ";
            if (r === this.line) {
              if (e.length > 160) {
                let t = 20,
                  r = Math.max(0, this.column - t),
                  a = Math.max(this.column + t, this.endColumn + t),
                  l = e.slice(r, a),
                  c =
                    i(n.replace(/\d/g, " ")) +
                    e
                      .slice(0, Math.min(this.column - 1, t - 1))
                      .replace(/[^\t]/g, " ");
                return o(">") + i(n) + s(l) + "\n " + c + o("^");
              }
              let t =
                i(n.replace(/\d/g, " ")) +
                e.slice(0, this.column - 1).replace(/[^\t]/g, " ");
              return o(">") + i(n) + s(e) + "\n " + t + o("^");
            }
            return " " + i(n) + s(e);
          })
          .join("\n");
      }
      toString() {
        let e = this.showSourceCode();
        return (
          e && (e = "\n\n" + e + "\n"), this.name + ": " + this.message + e
        );
      }
    }
    return (Go = r), (r.default = r), Go;
  }
  function es() {
    if (Zo) return Ko;
    Zo = 1;
    const e = {
      after: "\n",
      beforeClose: "\n",
      beforeComment: "\n",
      beforeDecl: "\n",
      beforeOpen: " ",
      beforeRule: "\n",
      colon: ": ",
      commentLeft: " ",
      commentRight: " ",
      emptyBody: "",
      indent: "    ",
      semicolon: !1,
    };
    class t {
      constructor(e) {
        this.builder = e;
      }
      atrule(e, t) {
        let r = "@" + e.name,
          n = e.params ? this.rawValue(e, "params") : "";
        if (
          (void 0 !== e.raws.afterName
            ? (r += e.raws.afterName)
            : n && (r += " "),
          e.nodes)
        )
          this.block(e, r + n);
        else {
          let i = (e.raws.between || "") + (t ? ";" : "");
          this.builder(r + n + i, e);
        }
      }
      beforeAfter(e, t) {
        let r;
        r =
          "decl" === e.type
            ? this.raw(e, null, "beforeDecl")
            : "comment" === e.type
            ? this.raw(e, null, "beforeComment")
            : "before" === t
            ? this.raw(e, null, "beforeRule")
            : this.raw(e, null, "beforeClose");
        let n = e.parent,
          i = 0;
        for (; n && "root" !== n.type; ) (i += 1), (n = n.parent);
        if (r.includes("\n")) {
          let t = this.raw(e, null, "indent");
          if (t.length) for (let e = 0; e < i; e++) r += t;
        }
        return r;
      }
      block(e, t) {
        let r,
          n = this.raw(e, "between", "beforeOpen");
        this.builder(t + n + "{", e, "start"),
          e.nodes && e.nodes.length
            ? (this.body(e), (r = this.raw(e, "after")))
            : (r = this.raw(e, "after", "emptyBody")),
          r && this.builder(r),
          this.builder("}", e, "end");
      }
      body(e) {
        let t = e.nodes.length - 1;
        for (; t > 0 && "comment" === e.nodes[t].type; ) t -= 1;
        let r = this.raw(e, "semicolon");
        for (let n = 0; n < e.nodes.length; n++) {
          let i = e.nodes[n],
            o = this.raw(i, "before");
          o && this.builder(o), this.stringify(i, t !== n || r);
        }
      }
      comment(e) {
        let t = this.raw(e, "left", "commentLeft"),
          r = this.raw(e, "right", "commentRight");
        this.builder("/*" + t + e.text + r + "*/", e);
      }
      decl(e, t) {
        let r = this.raw(e, "between", "colon"),
          n = e.prop + r + this.rawValue(e, "value");
        e.important && (n += e.raws.important || " !important"),
          t && (n += ";"),
          this.builder(n, e);
      }
      document(e) {
        this.body(e);
      }
      raw(t, r, n) {
        let i;
        if ((n || (n = r), r && ((i = t.raws[r]), void 0 !== i))) return i;
        let o = t.parent;
        if ("before" === n) {
          if (!o || ("root" === o.type && o.first === t)) return "";
          if (o && "document" === o.type) return "";
        }
        if (!o) return e[n];
        let s = t.root();
        if ((s.rawCache || (s.rawCache = {}), void 0 !== s.rawCache[n]))
          return s.rawCache[n];
        if ("before" === n || "after" === n) return this.beforeAfter(t, n);
        {
          let e = "raw" + ((a = n)[0].toUpperCase() + a.slice(1));
          this[e]
            ? (i = this[e](s, t))
            : s.walk((e) => {
                if (((i = e.raws[r]), void 0 !== i)) return !1;
              });
        }
        var a;
        return void 0 === i && (i = e[n]), (s.rawCache[n] = i), i;
      }
      rawBeforeClose(e) {
        let t;
        return (
          e.walk((e) => {
            if (e.nodes && e.nodes.length > 0 && void 0 !== e.raws.after)
              return (
                (t = e.raws.after),
                t.includes("\n") && (t = t.replace(/[^\n]+$/, "")),
                !1
              );
          }),
          t && (t = t.replace(/\S/g, "")),
          t
        );
      }
      rawBeforeComment(e, t) {
        let r;
        return (
          e.walkComments((e) => {
            if (void 0 !== e.raws.before)
              return (
                (r = e.raws.before),
                r.includes("\n") && (r = r.replace(/[^\n]+$/, "")),
                !1
              );
          }),
          void 0 === r
            ? (r = this.raw(t, null, "beforeDecl"))
            : r && (r = r.replace(/\S/g, "")),
          r
        );
      }
      rawBeforeDecl(e, t) {
        let r;
        return (
          e.walkDecls((e) => {
            if (void 0 !== e.raws.before)
              return (
                (r = e.raws.before),
                r.includes("\n") && (r = r.replace(/[^\n]+$/, "")),
                !1
              );
          }),
          void 0 === r
            ? (r = this.raw(t, null, "beforeRule"))
            : r && (r = r.replace(/\S/g, "")),
          r
        );
      }
      rawBeforeOpen(e) {
        let t;
        return (
          e.walk((e) => {
            if ("decl" !== e.type && ((t = e.raws.between), void 0 !== t))
              return !1;
          }),
          t
        );
      }
      rawBeforeRule(e) {
        let t;
        return (
          e.walk((r) => {
            if (
              r.nodes &&
              (r.parent !== e || e.first !== r) &&
              void 0 !== r.raws.before
            )
              return (
                (t = r.raws.before),
                t.includes("\n") && (t = t.replace(/[^\n]+$/, "")),
                !1
              );
          }),
          t && (t = t.replace(/\S/g, "")),
          t
        );
      }
      rawColon(e) {
        let t;
        return (
          e.walkDecls((e) => {
            if (void 0 !== e.raws.between)
              return (t = e.raws.between.replace(/[^\s:]/g, "")), !1;
          }),
          t
        );
      }
      rawEmptyBody(e) {
        let t;
        return (
          e.walk((e) => {
            if (
              e.nodes &&
              0 === e.nodes.length &&
              ((t = e.raws.after), void 0 !== t)
            )
              return !1;
          }),
          t
        );
      }
      rawIndent(e) {
        if (e.raws.indent) return e.raws.indent;
        let t;
        return (
          e.walk((r) => {
            let n = r.parent;
            if (
              n &&
              n !== e &&
              n.parent &&
              n.parent === e &&
              void 0 !== r.raws.before
            ) {
              let e = r.raws.before.split("\n");
              return (t = e[e.length - 1]), (t = t.replace(/\S/g, "")), !1;
            }
          }),
          t
        );
      }
      rawSemicolon(e) {
        let t;
        return (
          e.walk((e) => {
            if (
              e.nodes &&
              e.nodes.length &&
              "decl" === e.last.type &&
              ((t = e.raws.semicolon), void 0 !== t)
            )
              return !1;
          }),
          t
        );
      }
      rawValue(e, t) {
        let r = e[t],
          n = e.raws[t];
        return n && n.value === r ? n.raw : r;
      }
      root(e) {
        this.body(e), e.raws.after && this.builder(e.raws.after);
      }
      rule(e) {
        this.block(e, this.rawValue(e, "selector")),
          e.raws.ownSemicolon && this.builder(e.raws.ownSemicolon, e, "end");
      }
      stringify(e, t) {
        if (!this[e.type])
          throw new Error(
            "Unknown AST node type " +
              e.type +
              ". Maybe you need to change PostCSS stringifier."
          );
        this[e.type](e, t);
      }
    }
    return (Ko = t), (t.default = t), Ko;
  }
  function ts() {
    if (Yo) return Xo;
    Yo = 1;
    let e = es();
    function t(t, r) {
      new e(r).stringify(t);
    }
    return (Xo = t), (t.default = t), Xo;
  }
  var rs,
    ns,
    is,
    os,
    ss,
    as,
    ls,
    cs,
    us,
    ds,
    ps,
    hs,
    fs,
    gs,
    ms,
    vs,
    ys,
    bs,
    ws,
    xs,
    Cs,
    Ss,
    ks,
    Es,
    Ts,
    As,
    Os,
    Ps,
    Ms,
    Ns,
    Is,
    _s,
    Ls,
    Ds,
    Rs,
    $s,
    Fs,
    Bs,
    qs,
    js,
    Hs,
    Vs,
    Us,
    zs,
    Gs,
    Ws,
    Ks,
    Zs,
    Xs,
    Ys,
    Qs,
    Js = {};
  function ea() {
    return (
      rs ||
        ((rs = 1), (Js.isClean = Symbol("isClean")), (Js.my = Symbol("my"))),
      Js
    );
  }
  function ta() {
    if (is) return ns;
    is = 1;
    let e = Jo(),
      t = es(),
      r = ts(),
      { isClean: n, my: i } = ea();
    function o(e, t) {
      let r = new e.constructor();
      for (let n in e) {
        if (!Object.prototype.hasOwnProperty.call(e, n)) continue;
        if ("proxyCache" === n) continue;
        let i = e[n],
          s = typeof i;
        "parent" === n && "object" === s
          ? t && (r[n] = t)
          : "source" === n
          ? (r[n] = i)
          : Array.isArray(i)
          ? (r[n] = i.map((e) => o(e, r)))
          : ("object" === s && null !== i && (i = o(i)), (r[n] = i));
      }
      return r;
    }
    function s(e, t) {
      if (t && void 0 !== t.offset) return t.offset;
      let r = 1,
        n = 1,
        i = 0;
      for (let o = 0; o < e.length; o++) {
        if (n === t.line && r === t.column) {
          i = o;
          break;
        }
        "\n" === e[o] ? ((r = 1), (n += 1)) : (r += 1);
      }
      return i;
    }
    class a {
      get proxyOf() {
        return this;
      }
      constructor(e = {}) {
        (this.raws = {}), (this[n] = !1), (this[i] = !0);
        for (let t in e)
          if ("nodes" === t) {
            this.nodes = [];
            for (let r of e[t])
              "function" == typeof r.clone
                ? this.append(r.clone())
                : this.append(r);
          } else this[t] = e[t];
      }
      addToError(e) {
        if (
          ((e.postcssNode = this),
          e.stack && this.source && /\n\s{4}at /.test(e.stack))
        ) {
          let t = this.source;
          e.stack = e.stack.replace(
            /\n\s{4}at /,
            `$&${t.input.from}:${t.start.line}:${t.start.column}$&`
          );
        }
        return e;
      }
      after(e) {
        return this.parent.insertAfter(this, e), this;
      }
      assign(e = {}) {
        for (let t in e) this[t] = e[t];
        return this;
      }
      before(e) {
        return this.parent.insertBefore(this, e), this;
      }
      cleanRaws(e) {
        delete this.raws.before,
          delete this.raws.after,
          e || delete this.raws.between;
      }
      clone(e = {}) {
        let t = o(this);
        for (let r in e) t[r] = e[r];
        return t;
      }
      cloneAfter(e = {}) {
        let t = this.clone(e);
        return this.parent.insertAfter(this, t), t;
      }
      cloneBefore(e = {}) {
        let t = this.clone(e);
        return this.parent.insertBefore(this, t), t;
      }
      error(t, r = {}) {
        if (this.source) {
          let { end: e, start: n } = this.rangeBy(r);
          return this.source.input.error(
            t,
            { column: n.column, line: n.line },
            { column: e.column, line: e.line },
            r
          );
        }
        return new e(t);
      }
      getProxyProcessor() {
        return {
          get: (e, t) =>
            "proxyOf" === t
              ? e
              : "root" === t
              ? () => e.root().toProxy()
              : e[t],
          set: (e, t, r) => (
            e[t] === r ||
              ((e[t] = r),
              ("prop" !== t &&
                "value" !== t &&
                "name" !== t &&
                "params" !== t &&
                "important" !== t &&
                "text" !== t) ||
                e.markDirty()),
            !0
          ),
        };
      }
      markClean() {
        this[n] = !0;
      }
      markDirty() {
        if (this[n]) {
          this[n] = !1;
          let e = this;
          for (; (e = e.parent); ) e[n] = !1;
        }
      }
      next() {
        if (!this.parent) return;
        let e = this.parent.index(this);
        return this.parent.nodes[e + 1];
      }
      positionBy(e) {
        let t = this.source.start;
        if (e.index) t = this.positionInside(e.index);
        else if (e.word) {
          let r =
              "document" in this.source.input
                ? this.source.input.document
                : this.source.input.css,
            n = r
              .slice(s(r, this.source.start), s(r, this.source.end))
              .indexOf(e.word);
          -1 !== n && (t = this.positionInside(n));
        }
        return t;
      }
      positionInside(e) {
        let t = this.source.start.column,
          r = this.source.start.line,
          n =
            "document" in this.source.input
              ? this.source.input.document
              : this.source.input.css,
          i = s(n, this.source.start),
          o = i + e;
        for (let e = i; e < o; e++)
          "\n" === n[e] ? ((t = 1), (r += 1)) : (t += 1);
        return { column: t, line: r };
      }
      prev() {
        if (!this.parent) return;
        let e = this.parent.index(this);
        return this.parent.nodes[e - 1];
      }
      rangeBy(e) {
        let t = {
            column: this.source.start.column,
            line: this.source.start.line,
          },
          r = this.source.end
            ? { column: this.source.end.column + 1, line: this.source.end.line }
            : { column: t.column + 1, line: t.line };
        if (e.word) {
          let n =
              "document" in this.source.input
                ? this.source.input.document
                : this.source.input.css,
            i = n
              .slice(s(n, this.source.start), s(n, this.source.end))
              .indexOf(e.word);
          -1 !== i &&
            ((t = this.positionInside(i)),
            (r = this.positionInside(i + e.word.length)));
        } else
          e.start
            ? (t = { column: e.start.column, line: e.start.line })
            : e.index && (t = this.positionInside(e.index)),
            e.end
              ? (r = { column: e.end.column, line: e.end.line })
              : "number" == typeof e.endIndex
              ? (r = this.positionInside(e.endIndex))
              : e.index && (r = this.positionInside(e.index + 1));
        return (
          (r.line < t.line || (r.line === t.line && r.column <= t.column)) &&
            (r = { column: t.column + 1, line: t.line }),
          { end: r, start: t }
        );
      }
      raw(e, r) {
        return new t().raw(this, e, r);
      }
      remove() {
        return (
          this.parent && this.parent.removeChild(this),
          (this.parent = void 0),
          this
        );
      }
      replaceWith(...e) {
        if (this.parent) {
          let t = this,
            r = !1;
          for (let n of e)
            n === this
              ? (r = !0)
              : r
              ? (this.parent.insertAfter(t, n), (t = n))
              : this.parent.insertBefore(t, n);
          r || this.remove();
        }
        return this;
      }
      root() {
        let e = this;
        for (; e.parent && "document" !== e.parent.type; ) e = e.parent;
        return e;
      }
      toJSON(e, t) {
        let r = {},
          n = null == t;
        t = t || new Map();
        let i = 0;
        for (let e in this) {
          if (!Object.prototype.hasOwnProperty.call(this, e)) continue;
          if ("parent" === e || "proxyCache" === e) continue;
          let n = this[e];
          if (Array.isArray(n))
            r[e] = n.map((e) =>
              "object" == typeof e && e.toJSON ? e.toJSON(null, t) : e
            );
          else if ("object" == typeof n && n.toJSON) r[e] = n.toJSON(null, t);
          else if ("source" === e) {
            let o = t.get(n.input);
            null == o && ((o = i), t.set(n.input, i), i++),
              (r[e] = { end: n.end, inputId: o, start: n.start });
          } else r[e] = n;
        }
        return n && (r.inputs = [...t.keys()].map((e) => e.toJSON())), r;
      }
      toProxy() {
        return (
          this.proxyCache ||
            (this.proxyCache = new Proxy(this, this.getProxyProcessor())),
          this.proxyCache
        );
      }
      toString(e = r) {
        e.stringify && (e = e.stringify);
        let t = "";
        return (
          e(this, (e) => {
            t += e;
          }),
          t
        );
      }
      warn(e, t, r) {
        let n = { node: this };
        for (let e in r) n[e] = r[e];
        return e.warn(t, n);
      }
    }
    return (ns = a), (a.default = a), ns;
  }
  function ra() {
    if (ss) return os;
    ss = 1;
    let e = ta();
    class t extends e {
      constructor(e) {
        super(e), (this.type = "comment");
      }
    }
    return (os = t), (t.default = t), os;
  }
  function na() {
    if (ls) return as;
    ls = 1;
    let e = ta();
    class t extends e {
      get variable() {
        return this.prop.startsWith("--") || "$" === this.prop[0];
      }
      constructor(e) {
        e &&
          void 0 !== e.value &&
          "string" != typeof e.value &&
          (e = { ...e, value: String(e.value) }),
          super(e),
          (this.type = "decl");
      }
    }
    return (as = t), (t.default = t), as;
  }
  function ia() {
    if (us) return cs;
    us = 1;
    let e,
      t,
      r,
      n,
      i = ra(),
      o = na(),
      s = ta(),
      { isClean: a, my: l } = ea();
    function c(e) {
      return e.map(
        (e) => (e.nodes && (e.nodes = c(e.nodes)), delete e.source, e)
      );
    }
    function u(e) {
      if (((e[a] = !1), e.proxyOf.nodes)) for (let t of e.proxyOf.nodes) u(t);
    }
    class d extends s {
      get first() {
        if (this.proxyOf.nodes) return this.proxyOf.nodes[0];
      }
      get last() {
        if (this.proxyOf.nodes)
          return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
      }
      append(...e) {
        for (let t of e) {
          let e = this.normalize(t, this.last);
          for (let t of e) this.proxyOf.nodes.push(t);
        }
        return this.markDirty(), this;
      }
      cleanRaws(e) {
        if ((super.cleanRaws(e), this.nodes))
          for (let t of this.nodes) t.cleanRaws(e);
      }
      each(e) {
        if (!this.proxyOf.nodes) return;
        let t,
          r,
          n = this.getIterator();
        for (
          ;
          this.indexes[n] < this.proxyOf.nodes.length &&
          ((t = this.indexes[n]), (r = e(this.proxyOf.nodes[t], t)), !1 !== r);

        )
          this.indexes[n] += 1;
        return delete this.indexes[n], r;
      }
      every(e) {
        return this.nodes.every(e);
      }
      getIterator() {
        this.lastEach || (this.lastEach = 0),
          this.indexes || (this.indexes = {}),
          (this.lastEach += 1);
        let e = this.lastEach;
        return (this.indexes[e] = 0), e;
      }
      getProxyProcessor() {
        return {
          get: (e, t) =>
            "proxyOf" === t
              ? e
              : e[t]
              ? "each" === t || ("string" == typeof t && t.startsWith("walk"))
                ? (...r) =>
                    e[t](
                      ...r.map((e) =>
                        "function" == typeof e ? (t, r) => e(t.toProxy(), r) : e
                      )
                    )
                : "every" === t || "some" === t
                ? (r) => e[t]((e, ...t) => r(e.toProxy(), ...t))
                : "root" === t
                ? () => e.root().toProxy()
                : "nodes" === t
                ? e.nodes.map((e) => e.toProxy())
                : "first" === t || "last" === t
                ? e[t].toProxy()
                : e[t]
              : e[t],
          set: (e, t, r) => (
            e[t] === r ||
              ((e[t] = r),
              ("name" !== t && "params" !== t && "selector" !== t) ||
                e.markDirty()),
            !0
          ),
        };
      }
      index(e) {
        return "number" == typeof e
          ? e
          : (e.proxyOf && (e = e.proxyOf), this.proxyOf.nodes.indexOf(e));
      }
      insertAfter(e, t) {
        let r,
          n = this.index(e),
          i = this.normalize(t, this.proxyOf.nodes[n]).reverse();
        n = this.index(e);
        for (let e of i) this.proxyOf.nodes.splice(n + 1, 0, e);
        for (let e in this.indexes)
          (r = this.indexes[e]), n < r && (this.indexes[e] = r + i.length);
        return this.markDirty(), this;
      }
      insertBefore(e, t) {
        let r,
          n = this.index(e),
          i = 0 === n && "prepend",
          o = this.normalize(t, this.proxyOf.nodes[n], i).reverse();
        n = this.index(e);
        for (let e of o) this.proxyOf.nodes.splice(n, 0, e);
        for (let e in this.indexes)
          (r = this.indexes[e]), n <= r && (this.indexes[e] = r + o.length);
        return this.markDirty(), this;
      }
      normalize(r, s) {
        if ("string" == typeof r) r = c(t(r).nodes);
        else if (void 0 === r) r = [];
        else if (Array.isArray(r)) {
          r = r.slice(0);
          for (let e of r) e.parent && e.parent.removeChild(e, "ignore");
        } else if ("root" === r.type && "document" !== this.type) {
          r = r.nodes.slice(0);
          for (let e of r) e.parent && e.parent.removeChild(e, "ignore");
        } else if (r.type) r = [r];
        else if (r.prop) {
          if (void 0 === r.value)
            throw new Error("Value field is missed in node creation");
          "string" != typeof r.value && (r.value = String(r.value)),
            (r = [new o(r)]);
        } else if (r.selector || r.selectors) r = [new n(r)];
        else if (r.name) r = [new e(r)];
        else {
          if (!r.text) throw new Error("Unknown node type in node creation");
          r = [new i(r)];
        }
        return r.map(
          (e) => (
            e[l] || d.rebuild(e),
            (e = e.proxyOf).parent && e.parent.removeChild(e),
            e[a] && u(e),
            e.raws || (e.raws = {}),
            void 0 === e.raws.before &&
              s &&
              void 0 !== s.raws.before &&
              (e.raws.before = s.raws.before.replace(/\S/g, "")),
            (e.parent = this.proxyOf),
            e
          )
        );
      }
      prepend(...e) {
        e = e.reverse();
        for (let t of e) {
          let e = this.normalize(t, this.first, "prepend").reverse();
          for (let t of e) this.proxyOf.nodes.unshift(t);
          for (let t in this.indexes)
            this.indexes[t] = this.indexes[t] + e.length;
        }
        return this.markDirty(), this;
      }
      push(e) {
        return (e.parent = this), this.proxyOf.nodes.push(e), this;
      }
      removeAll() {
        for (let e of this.proxyOf.nodes) e.parent = void 0;
        return (this.proxyOf.nodes = []), this.markDirty(), this;
      }
      removeChild(e) {
        let t;
        (e = this.index(e)),
          (this.proxyOf.nodes[e].parent = void 0),
          this.proxyOf.nodes.splice(e, 1);
        for (let r in this.indexes)
          (t = this.indexes[r]), t >= e && (this.indexes[r] = t - 1);
        return this.markDirty(), this;
      }
      replaceValues(e, t, r) {
        return (
          r || ((r = t), (t = {})),
          this.walkDecls((n) => {
            (t.props && !t.props.includes(n.prop)) ||
              (t.fast && !n.value.includes(t.fast)) ||
              (n.value = n.value.replace(e, r));
          }),
          this.markDirty(),
          this
        );
      }
      some(e) {
        return this.nodes.some(e);
      }
      walk(e) {
        return this.each((t, r) => {
          let n;
          try {
            n = e(t, r);
          } catch (e) {
            throw t.addToError(e);
          }
          return !1 !== n && t.walk && (n = t.walk(e)), n;
        });
      }
      walkAtRules(e, t) {
        return t
          ? e instanceof RegExp
            ? this.walk((r, n) => {
                if ("atrule" === r.type && e.test(r.name)) return t(r, n);
              })
            : this.walk((r, n) => {
                if ("atrule" === r.type && r.name === e) return t(r, n);
              })
          : ((t = e),
            this.walk((e, r) => {
              if ("atrule" === e.type) return t(e, r);
            }));
      }
      walkComments(e) {
        return this.walk((t, r) => {
          if ("comment" === t.type) return e(t, r);
        });
      }
      walkDecls(e, t) {
        return t
          ? e instanceof RegExp
            ? this.walk((r, n) => {
                if ("decl" === r.type && e.test(r.prop)) return t(r, n);
              })
            : this.walk((r, n) => {
                if ("decl" === r.type && r.prop === e) return t(r, n);
              })
          : ((t = e),
            this.walk((e, r) => {
              if ("decl" === e.type) return t(e, r);
            }));
      }
      walkRules(e, t) {
        return t
          ? e instanceof RegExp
            ? this.walk((r, n) => {
                if ("rule" === r.type && e.test(r.selector)) return t(r, n);
              })
            : this.walk((r, n) => {
                if ("rule" === r.type && r.selector === e) return t(r, n);
              })
          : ((t = e),
            this.walk((e, r) => {
              if ("rule" === e.type) return t(e, r);
            }));
      }
    }
    return (
      (d.registerParse = (e) => {
        t = e;
      }),
      (d.registerRule = (e) => {
        n = e;
      }),
      (d.registerAtRule = (t) => {
        e = t;
      }),
      (d.registerRoot = (e) => {
        r = e;
      }),
      (cs = d),
      (d.default = d),
      (d.rebuild = (t) => {
        "atrule" === t.type
          ? Object.setPrototypeOf(t, e.prototype)
          : "rule" === t.type
          ? Object.setPrototypeOf(t, n.prototype)
          : "decl" === t.type
          ? Object.setPrototypeOf(t, o.prototype)
          : "comment" === t.type
          ? Object.setPrototypeOf(t, i.prototype)
          : "root" === t.type && Object.setPrototypeOf(t, r.prototype),
          (t[l] = !0),
          t.nodes &&
            t.nodes.forEach((e) => {
              d.rebuild(e);
            });
      }),
      cs
    );
  }
  function oa() {
    if (ps) return ds;
    ps = 1;
    let e = ia();
    class t extends e {
      constructor(e) {
        super(e), (this.type = "atrule");
      }
      append(...e) {
        return this.proxyOf.nodes || (this.nodes = []), super.append(...e);
      }
      prepend(...e) {
        return this.proxyOf.nodes || (this.nodes = []), super.prepend(...e);
      }
    }
    return (ds = t), (t.default = t), e.registerAtRule(t), ds;
  }
  function sa() {
    if (fs) return hs;
    fs = 1;
    let e,
      t,
      r = ia();
    class n extends r {
      constructor(e) {
        super({ type: "document", ...e }), this.nodes || (this.nodes = []);
      }
      toResult(r = {}) {
        return new e(new t(), this, r).stringify();
      }
    }
    return (
      (n.registerLazyResult = (t) => {
        e = t;
      }),
      (n.registerProcessor = (e) => {
        t = e;
      }),
      (hs = n),
      (n.default = n),
      hs
    );
  }
  function aa() {
    if (ms) return gs;
    ms = 1;
    return (
      (gs = {
        nanoid: (e = 21) => {
          let t = "",
            r = 0 | e;
          for (; r--; )
            t +=
              "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"[
                (64 * Math.random()) | 0
              ];
          return t;
        },
        customAlphabet:
          (e, t = 21) =>
          (r = t) => {
            let n = "",
              i = 0 | r;
            for (; i--; ) n += e[(Math.random() * e.length) | 0];
            return n;
          },
      }),
      gs
    );
  }
  function la() {
    if (ys) return vs;
    ys = 1;
    let { existsSync: e, readFileSync: t } = Qo,
      { dirname: r, join: n } = Qo,
      { SourceMapConsumer: i, SourceMapGenerator: o } = Qo;
    class s {
      constructor(e, t) {
        if (!1 === t.map) return;
        this.loadAnnotation(e),
          (this.inline = this.startWith(this.annotation, "data:"));
        let n = t.map ? t.map.prev : void 0,
          i = this.loadMap(t.from, n);
        !this.mapFile && t.from && (this.mapFile = t.from),
          this.mapFile && (this.root = r(this.mapFile)),
          i && (this.text = i);
      }
      consumer() {
        return (
          this.consumerCache || (this.consumerCache = new i(this.text)),
          this.consumerCache
        );
      }
      decodeInline(e) {
        let t =
          e.match(/^data:application\/json;charset=utf-?8,/) ||
          e.match(/^data:application\/json,/);
        if (t) return decodeURIComponent(e.substr(t[0].length));
        let r =
          e.match(/^data:application\/json;charset=utf-?8;base64,/) ||
          e.match(/^data:application\/json;base64,/);
        if (r)
          return (
            (n = e.substr(r[0].length)),
            Buffer ? Buffer.from(n, "base64").toString() : window.atob(n)
          );
        var n;
        let i = e.match(/data:application\/json;([^,]+),/)[1];
        throw new Error("Unsupported source map encoding " + i);
      }
      getAnnotationURL(e) {
        return e.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
      }
      isMap(e) {
        return (
          "object" == typeof e &&
          ("string" == typeof e.mappings ||
            "string" == typeof e._mappings ||
            Array.isArray(e.sections))
        );
      }
      loadAnnotation(e) {
        let t = e.match(/\/\*\s*# sourceMappingURL=/g);
        if (!t) return;
        let r = e.lastIndexOf(t.pop()),
          n = e.indexOf("*/", r);
        r > -1 &&
          n > -1 &&
          (this.annotation = this.getAnnotationURL(e.substring(r, n)));
      }
      loadFile(n) {
        if (((this.root = r(n)), e(n)))
          return (this.mapFile = n), t(n, "utf-8").toString().trim();
      }
      loadMap(e, t) {
        if (!1 === t) return !1;
        if (t) {
          if ("string" == typeof t) return t;
          if ("function" != typeof t) {
            if (t instanceof i) return o.fromSourceMap(t).toString();
            if (t instanceof o) return t.toString();
            if (this.isMap(t)) return JSON.stringify(t);
            throw new Error(
              "Unsupported previous source map format: " + t.toString()
            );
          }
          {
            let r = t(e);
            if (r) {
              let e = this.loadFile(r);
              if (!e)
                throw new Error(
                  "Unable to load previous source map: " + r.toString()
                );
              return e;
            }
          }
        } else {
          if (this.inline) return this.decodeInline(this.annotation);
          if (this.annotation) {
            let t = this.annotation;
            return e && (t = n(r(e), t)), this.loadFile(t);
          }
        }
      }
      startWith(e, t) {
        return !!e && e.substr(0, t.length) === t;
      }
      withContent() {
        return !!(
          this.consumer().sourcesContent &&
          this.consumer().sourcesContent.length > 0
        );
      }
    }
    return (vs = s), (s.default = s), vs;
  }
  function ca() {
    if (ws) return bs;
    ws = 1;
    let { nanoid: e } = aa(),
      { isAbsolute: t, resolve: r } = Qo,
      { SourceMapConsumer: n, SourceMapGenerator: i } = Qo,
      { fileURLToPath: o, pathToFileURL: s } = Qo,
      a = Jo(),
      l = la(),
      c = Qo,
      u = Symbol("fromOffsetCache"),
      d = Boolean(n && i),
      p = Boolean(r && t);
    class h {
      get from() {
        return this.file || this.id;
      }
      constructor(n, i = {}) {
        if (null == n || ("object" == typeof n && !n.toString))
          throw new Error(`PostCSS received ${n} instead of CSS string`);
        if (
          ((this.css = n.toString()),
          "\ufeff" === this.css[0] || "\ufffe" === this.css[0]
            ? ((this.hasBOM = !0), (this.css = this.css.slice(1)))
            : (this.hasBOM = !1),
          (this.document = this.css),
          i.document && (this.document = i.document.toString()),
          i.from &&
            (!p || /^\w+:\/\//.test(i.from) || t(i.from)
              ? (this.file = i.from)
              : (this.file = r(i.from))),
          p && d)
        ) {
          let e = new l(this.css, i);
          if (e.text) {
            this.map = e;
            let t = e.consumer().file;
            !this.file && t && (this.file = this.mapResolve(t));
          }
        }
        this.file || (this.id = "<input css " + e(6) + ">"),
          this.map && (this.map.file = this.from);
      }
      error(e, t, r, n = {}) {
        let i, o, l;
        if (t && "object" == typeof t) {
          let e = t,
            n = r;
          if ("number" == typeof e.offset) {
            let n = this.fromOffset(e.offset);
            (t = n.line), (r = n.col);
          } else (t = e.line), (r = e.column);
          if ("number" == typeof n.offset) {
            let e = this.fromOffset(n.offset);
            (o = e.line), (i = e.col);
          } else (o = n.line), (i = n.column);
        } else if (!r) {
          let e = this.fromOffset(t);
          (t = e.line), (r = e.col);
        }
        let c = this.origin(t, r, o, i);
        return (
          (l = c
            ? new a(
                e,
                void 0 === c.endLine
                  ? c.line
                  : { column: c.column, line: c.line },
                void 0 === c.endLine
                  ? c.column
                  : { column: c.endColumn, line: c.endLine },
                c.source,
                c.file,
                n.plugin
              )
            : new a(
                e,
                void 0 === o ? t : { column: r, line: t },
                void 0 === o ? r : { column: i, line: o },
                this.css,
                this.file,
                n.plugin
              )),
          (l.input = {
            column: r,
            endColumn: i,
            endLine: o,
            line: t,
            source: this.css,
          }),
          this.file &&
            (s && (l.input.url = s(this.file).toString()),
            (l.input.file = this.file)),
          l
        );
      }
      fromOffset(e) {
        let t, r;
        if (this[u]) r = this[u];
        else {
          let e = this.css.split("\n");
          r = new Array(e.length);
          let t = 0;
          for (let n = 0, i = e.length; n < i; n++)
            (r[n] = t), (t += e[n].length + 1);
          this[u] = r;
        }
        t = r[r.length - 1];
        let n = 0;
        if (e >= t) n = r.length - 1;
        else {
          let t,
            i = r.length - 2;
          for (; n < i; )
            if (((t = n + ((i - n) >> 1)), e < r[t])) i = t - 1;
            else {
              if (!(e >= r[t + 1])) {
                n = t;
                break;
              }
              n = t + 1;
            }
        }
        return { col: e - r[n] + 1, line: n + 1 };
      }
      mapResolve(e) {
        return /^\w+:\/\//.test(e)
          ? e
          : r(this.map.consumer().sourceRoot || this.map.root || ".", e);
      }
      origin(e, r, n, i) {
        if (!this.map) return !1;
        let a,
          l,
          c = this.map.consumer(),
          u = c.originalPositionFor({ column: r, line: e });
        if (!u.source) return !1;
        "number" == typeof n &&
          (a = c.originalPositionFor({ column: i, line: n })),
          (l = t(u.source)
            ? s(u.source)
            : new URL(
                u.source,
                this.map.consumer().sourceRoot || s(this.map.mapFile)
              ));
        let d = {
          column: u.column,
          endColumn: a && a.column,
          endLine: a && a.line,
          line: u.line,
          url: l.toString(),
        };
        if ("file:" === l.protocol) {
          if (!o)
            throw new Error(
              "file: protocol is not available in this PostCSS build"
            );
          d.file = o(l);
        }
        let p = c.sourceContentFor(u.source);
        return p && (d.source = p), d;
      }
      toJSON() {
        let e = {};
        for (let t of ["hasBOM", "css", "file", "id"])
          null != this[t] && (e[t] = this[t]);
        return (
          this.map &&
            ((e.map = { ...this.map }),
            e.map.consumerCache && (e.map.consumerCache = void 0)),
          e
        );
      }
    }
    return (
      (bs = h), (h.default = h), c && c.registerInput && c.registerInput(h), bs
    );
  }
  function ua() {
    if (Cs) return xs;
    Cs = 1;
    let e,
      t,
      r = ia();
    class n extends r {
      constructor(e) {
        super(e), (this.type = "root"), this.nodes || (this.nodes = []);
      }
      normalize(e, t, r) {
        let n = super.normalize(e);
        if (t)
          if ("prepend" === r)
            this.nodes.length > 1
              ? (t.raws.before = this.nodes[1].raws.before)
              : delete t.raws.before;
          else if (this.first !== t)
            for (let e of n) e.raws.before = t.raws.before;
        return n;
      }
      removeChild(e, t) {
        let r = this.index(e);
        return (
          !t &&
            0 === r &&
            this.nodes.length > 1 &&
            (this.nodes[1].raws.before = this.nodes[r].raws.before),
          super.removeChild(e)
        );
      }
      toResult(r = {}) {
        return new e(new t(), this, r).stringify();
      }
    }
    return (
      (n.registerLazyResult = (t) => {
        e = t;
      }),
      (n.registerProcessor = (e) => {
        t = e;
      }),
      (xs = n),
      (n.default = n),
      r.registerRoot(n),
      xs
    );
  }
  function da() {
    if (ks) return Ss;
    ks = 1;
    let e = {
      comma: (t) => e.split(t, [","], !0),
      space: (t) => e.split(t, [" ", "\n", "\t"]),
      split(e, t, r) {
        let n = [],
          i = "",
          o = !1,
          s = 0,
          a = !1,
          l = "",
          c = !1;
        for (let r of e)
          c
            ? (c = !1)
            : "\\" === r
            ? (c = !0)
            : a
            ? r === l && (a = !1)
            : '"' === r || "'" === r
            ? ((a = !0), (l = r))
            : "(" === r
            ? (s += 1)
            : ")" === r
            ? s > 0 && (s -= 1)
            : 0 === s && t.includes(r) && (o = !0),
            o ? ("" !== i && n.push(i.trim()), (i = ""), (o = !1)) : (i += r);
        return (r || "" !== i) && n.push(i.trim()), n;
      },
    };
    return (Ss = e), (e.default = e), Ss;
  }
  function pa() {
    if (Ts) return Es;
    Ts = 1;
    let e = ia(),
      t = da();
    class r extends e {
      get selectors() {
        return t.comma(this.selector);
      }
      set selectors(e) {
        let t = this.selector ? this.selector.match(/,\s*/) : null,
          r = t ? t[0] : "," + this.raw("between", "beforeOpen");
        this.selector = e.join(r);
      }
      constructor(e) {
        super(e), (this.type = "rule"), this.nodes || (this.nodes = []);
      }
    }
    return (Es = r), (r.default = r), e.registerRule(r), Es;
  }
  function ha() {
    if (Ms) return Ps;
    Ms = 1;
    let { dirname: e, relative: t, resolve: r, sep: n } = Qo,
      { SourceMapConsumer: i, SourceMapGenerator: o } = Qo,
      { pathToFileURL: s } = Qo,
      a = ca(),
      l = Boolean(i && o),
      c = Boolean(e && r && t && n);
    return (
      (Ps = class {
        constructor(e, t, r, n) {
          (this.stringify = e),
            (this.mapOpts = r.map || {}),
            (this.root = t),
            (this.opts = r),
            (this.css = n),
            (this.originalCSS = n),
            (this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute),
            (this.memoizedFileURLs = new Map()),
            (this.memoizedPaths = new Map()),
            (this.memoizedURLs = new Map());
        }
        addAnnotation() {
          let e;
          e = this.isInline()
            ? "data:application/json;base64," +
              this.toBase64(this.map.toString())
            : "string" == typeof this.mapOpts.annotation
            ? this.mapOpts.annotation
            : "function" == typeof this.mapOpts.annotation
            ? this.mapOpts.annotation(this.opts.to, this.root)
            : this.outputFile() + ".map";
          let t = "\n";
          this.css.includes("\r\n") && (t = "\r\n"),
            (this.css += t + "/*# sourceMappingURL=" + e + " */");
        }
        applyPrevMaps() {
          for (let t of this.previous()) {
            let r,
              n = this.toUrl(this.path(t.file)),
              o = t.root || e(t.file);
            !1 === this.mapOpts.sourcesContent
              ? ((r = new i(t.text)),
                r.sourcesContent && (r.sourcesContent = null))
              : (r = t.consumer()),
              this.map.applySourceMap(r, n, this.toUrl(this.path(o)));
          }
        }
        clearAnnotation() {
          if (!1 !== this.mapOpts.annotation)
            if (this.root) {
              let e;
              for (let t = this.root.nodes.length - 1; t >= 0; t--)
                (e = this.root.nodes[t]),
                  "comment" === e.type &&
                    e.text.startsWith("# sourceMappingURL=") &&
                    this.root.removeChild(t);
            } else
              this.css &&
                (this.css = this.css.replace(/\n*\/\*#[\S\s]*?\*\/$/gm, ""));
        }
        generate() {
          if ((this.clearAnnotation(), c && l && this.isMap()))
            return this.generateMap();
          {
            let e = "";
            return (
              this.stringify(this.root, (t) => {
                e += t;
              }),
              [e]
            );
          }
        }
        generateMap() {
          if (this.root) this.generateString();
          else if (1 === this.previous().length) {
            let e = this.previous()[0].consumer();
            (e.file = this.outputFile()),
              (this.map = o.fromSourceMap(e, { ignoreInvalidMapping: !0 }));
          } else
            (this.map = new o({
              file: this.outputFile(),
              ignoreInvalidMapping: !0,
            })),
              this.map.addMapping({
                generated: { column: 0, line: 1 },
                original: { column: 0, line: 1 },
                source: this.opts.from
                  ? this.toUrl(this.path(this.opts.from))
                  : "<no source>",
              });
          return (
            this.isSourcesContent() && this.setSourcesContent(),
            this.root && this.previous().length > 0 && this.applyPrevMaps(),
            this.isAnnotation() && this.addAnnotation(),
            this.isInline() ? [this.css] : [this.css, this.map]
          );
        }
        generateString() {
          (this.css = ""),
            (this.map = new o({
              file: this.outputFile(),
              ignoreInvalidMapping: !0,
            }));
          let e,
            t,
            r = 1,
            n = 1,
            i = "<no source>",
            s = {
              generated: { column: 0, line: 0 },
              original: { column: 0, line: 0 },
              source: "",
            };
          this.stringify(this.root, (o, a, l) => {
            if (
              ((this.css += o),
              a &&
                "end" !== l &&
                ((s.generated.line = r),
                (s.generated.column = n - 1),
                a.source && a.source.start
                  ? ((s.source = this.sourcePath(a)),
                    (s.original.line = a.source.start.line),
                    (s.original.column = a.source.start.column - 1),
                    this.map.addMapping(s))
                  : ((s.source = i),
                    (s.original.line = 1),
                    (s.original.column = 0),
                    this.map.addMapping(s))),
              (t = o.match(/\n/g)),
              t
                ? ((r += t.length),
                  (e = o.lastIndexOf("\n")),
                  (n = o.length - e))
                : (n += o.length),
              a && "start" !== l)
            ) {
              let e = a.parent || { raws: {} };
              (("decl" === a.type || ("atrule" === a.type && !a.nodes)) &&
                a === e.last &&
                !e.raws.semicolon) ||
                (a.source && a.source.end
                  ? ((s.source = this.sourcePath(a)),
                    (s.original.line = a.source.end.line),
                    (s.original.column = a.source.end.column - 1),
                    (s.generated.line = r),
                    (s.generated.column = n - 2),
                    this.map.addMapping(s))
                  : ((s.source = i),
                    (s.original.line = 1),
                    (s.original.column = 0),
                    (s.generated.line = r),
                    (s.generated.column = n - 1),
                    this.map.addMapping(s)));
            }
          });
        }
        isAnnotation() {
          return (
            !!this.isInline() ||
            (void 0 !== this.mapOpts.annotation
              ? this.mapOpts.annotation
              : !this.previous().length ||
                this.previous().some((e) => e.annotation))
          );
        }
        isInline() {
          if (void 0 !== this.mapOpts.inline) return this.mapOpts.inline;
          let e = this.mapOpts.annotation;
          return (
            (void 0 === e || !0 === e) &&
            (!this.previous().length || this.previous().some((e) => e.inline))
          );
        }
        isMap() {
          return void 0 !== this.opts.map
            ? !!this.opts.map
            : this.previous().length > 0;
        }
        isSourcesContent() {
          return void 0 !== this.mapOpts.sourcesContent
            ? this.mapOpts.sourcesContent
            : !this.previous().length ||
                this.previous().some((e) => e.withContent());
        }
        outputFile() {
          return this.opts.to
            ? this.path(this.opts.to)
            : this.opts.from
            ? this.path(this.opts.from)
            : "to.css";
        }
        path(n) {
          if (this.mapOpts.absolute) return n;
          if (60 === n.charCodeAt(0)) return n;
          if (/^\w+:\/\//.test(n)) return n;
          let i = this.memoizedPaths.get(n);
          if (i) return i;
          let o = this.opts.to ? e(this.opts.to) : ".";
          "string" == typeof this.mapOpts.annotation &&
            (o = e(r(o, this.mapOpts.annotation)));
          let s = t(o, n);
          return this.memoizedPaths.set(n, s), s;
        }
        previous() {
          if (!this.previousMaps)
            if (((this.previousMaps = []), this.root))
              this.root.walk((e) => {
                if (e.source && e.source.input.map) {
                  let t = e.source.input.map;
                  this.previousMaps.includes(t) || this.previousMaps.push(t);
                }
              });
            else {
              let e = new a(this.originalCSS, this.opts);
              e.map && this.previousMaps.push(e.map);
            }
          return this.previousMaps;
        }
        setSourcesContent() {
          let e = {};
          if (this.root)
            this.root.walk((t) => {
              if (t.source) {
                let r = t.source.input.from;
                if (r && !e[r]) {
                  e[r] = !0;
                  let n = this.usesFileUrls
                    ? this.toFileUrl(r)
                    : this.toUrl(this.path(r));
                  this.map.setSourceContent(n, t.source.input.css);
                }
              }
            });
          else if (this.css) {
            let e = this.opts.from
              ? this.toUrl(this.path(this.opts.from))
              : "<no source>";
            this.map.setSourceContent(e, this.css);
          }
        }
        sourcePath(e) {
          return this.mapOpts.from
            ? this.toUrl(this.mapOpts.from)
            : this.usesFileUrls
            ? this.toFileUrl(e.source.input.from)
            : this.toUrl(this.path(e.source.input.from));
        }
        toBase64(e) {
          return Buffer
            ? Buffer.from(e).toString("base64")
            : window.btoa(unescape(encodeURIComponent(e)));
        }
        toFileUrl(e) {
          let t = this.memoizedFileURLs.get(e);
          if (t) return t;
          if (s) {
            let t = s(e).toString();
            return this.memoizedFileURLs.set(e, t), t;
          }
          throw new Error(
            "`map.absolute` option is not available in this PostCSS build"
          );
        }
        toUrl(e) {
          let t = this.memoizedURLs.get(e);
          if (t) return t;
          "\\" === n && (e = e.replace(/\\/g, "/"));
          let r = encodeURI(e).replace(/[#?]/g, encodeURIComponent);
          return this.memoizedURLs.set(e, r), r;
        }
      }),
      Ps
    );
  }
  function fa() {
    if (Ls) return _s;
    Ls = 1;
    let e = oa(),
      t = ra(),
      r = na(),
      n = ua(),
      i = pa(),
      o = (function () {
        if (Is) return Ns;
        Is = 1;
        const e = "'".charCodeAt(0),
          t = '"'.charCodeAt(0),
          r = "\\".charCodeAt(0),
          n = "/".charCodeAt(0),
          i = "\n".charCodeAt(0),
          o = " ".charCodeAt(0),
          s = "\f".charCodeAt(0),
          a = "\t".charCodeAt(0),
          l = "\r".charCodeAt(0),
          c = "[".charCodeAt(0),
          u = "]".charCodeAt(0),
          d = "(".charCodeAt(0),
          p = ")".charCodeAt(0),
          h = "{".charCodeAt(0),
          f = "}".charCodeAt(0),
          g = ";".charCodeAt(0),
          m = "*".charCodeAt(0),
          v = ":".charCodeAt(0),
          y = "@".charCodeAt(0),
          b = /[\t\n\f\r "#'()/;[\\\]{}]/g,
          w = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g,
          x = /.[\r\n"'(/\\]/,
          C = /[\da-f]/i;
        return (
          (Ns = function (S, k = {}) {
            let E,
              T,
              A,
              O,
              P,
              M,
              N,
              I,
              _,
              L,
              D = S.css.valueOf(),
              R = k.ignoreErrors,
              $ = D.length,
              F = 0,
              B = [],
              q = [];
            function j(e) {
              throw S.error("Unclosed " + e, F);
            }
            return {
              back: function (e) {
                q.push(e);
              },
              endOfFile: function () {
                return 0 === q.length && F >= $;
              },
              nextToken: function (S) {
                if (q.length) return q.pop();
                if (F >= $) return;
                let k = !!S && S.ignoreUnclosed;
                switch (((E = D.charCodeAt(F)), E)) {
                  case i:
                  case o:
                  case a:
                  case l:
                  case s:
                    O = F;
                    do {
                      (O += 1), (E = D.charCodeAt(O));
                    } while (
                      E === o ||
                      E === i ||
                      E === a ||
                      E === l ||
                      E === s
                    );
                    (M = ["space", D.slice(F, O)]), (F = O - 1);
                    break;
                  case c:
                  case u:
                  case h:
                  case f:
                  case v:
                  case g:
                  case p: {
                    let e = String.fromCharCode(E);
                    M = [e, e, F];
                    break;
                  }
                  case d:
                    if (
                      ((L = B.length ? B.pop()[1] : ""),
                      (_ = D.charCodeAt(F + 1)),
                      "url" === L &&
                        _ !== e &&
                        _ !== t &&
                        _ !== o &&
                        _ !== i &&
                        _ !== a &&
                        _ !== s &&
                        _ !== l)
                    ) {
                      O = F;
                      do {
                        if (((N = !1), (O = D.indexOf(")", O + 1)), -1 === O)) {
                          if (R || k) {
                            O = F;
                            break;
                          }
                          j("bracket");
                        }
                        for (I = O; D.charCodeAt(I - 1) === r; )
                          (I -= 1), (N = !N);
                      } while (N);
                      (M = ["brackets", D.slice(F, O + 1), F, O]), (F = O);
                    } else
                      (O = D.indexOf(")", F + 1)),
                        (T = D.slice(F, O + 1)),
                        -1 === O || x.test(T)
                          ? (M = ["(", "(", F])
                          : ((M = ["brackets", T, F, O]), (F = O));
                    break;
                  case e:
                  case t:
                    (P = E === e ? "'" : '"'), (O = F);
                    do {
                      if (((N = !1), (O = D.indexOf(P, O + 1)), -1 === O)) {
                        if (R || k) {
                          O = F + 1;
                          break;
                        }
                        j("string");
                      }
                      for (I = O; D.charCodeAt(I - 1) === r; )
                        (I -= 1), (N = !N);
                    } while (N);
                    (M = ["string", D.slice(F, O + 1), F, O]), (F = O);
                    break;
                  case y:
                    (b.lastIndex = F + 1),
                      b.test(D),
                      (O = 0 === b.lastIndex ? D.length - 1 : b.lastIndex - 2),
                      (M = ["at-word", D.slice(F, O + 1), F, O]),
                      (F = O);
                    break;
                  case r:
                    for (O = F, A = !0; D.charCodeAt(O + 1) === r; )
                      (O += 1), (A = !A);
                    if (
                      ((E = D.charCodeAt(O + 1)),
                      A &&
                        E !== n &&
                        E !== o &&
                        E !== i &&
                        E !== a &&
                        E !== l &&
                        E !== s &&
                        ((O += 1), C.test(D.charAt(O))))
                    ) {
                      for (; C.test(D.charAt(O + 1)); ) O += 1;
                      D.charCodeAt(O + 1) === o && (O += 1);
                    }
                    (M = ["word", D.slice(F, O + 1), F, O]), (F = O);
                    break;
                  default:
                    E === n && D.charCodeAt(F + 1) === m
                      ? ((O = D.indexOf("*/", F + 2) + 1),
                        0 === O && (R || k ? (O = D.length) : j("comment")),
                        (M = ["comment", D.slice(F, O + 1), F, O]),
                        (F = O))
                      : ((w.lastIndex = F + 1),
                        w.test(D),
                        (O =
                          0 === w.lastIndex ? D.length - 1 : w.lastIndex - 2),
                        (M = ["word", D.slice(F, O + 1), F, O]),
                        B.push(M),
                        (F = O));
                }
                return F++, M;
              },
              position: function () {
                return F;
              },
            };
          }),
          Ns
        );
      })();
    const s = { empty: !0, space: !0 };
    return (
      (_s = class {
        constructor(e) {
          (this.input = e),
            (this.root = new n()),
            (this.current = this.root),
            (this.spaces = ""),
            (this.semicolon = !1),
            this.createTokenizer(),
            (this.root.source = {
              input: e,
              start: { column: 1, line: 1, offset: 0 },
            });
        }
        atrule(t) {
          let r,
            n,
            i,
            o = new e();
          (o.name = t[1].slice(1)),
            "" === o.name && this.unnamedAtrule(o, t),
            this.init(o, t[2]);
          let s = !1,
            a = !1,
            l = [],
            c = [];
          for (; !this.tokenizer.endOfFile(); ) {
            if (
              ((r = (t = this.tokenizer.nextToken())[0]),
              "(" === r || "[" === r
                ? c.push("(" === r ? ")" : "]")
                : "{" === r && c.length > 0
                ? c.push("}")
                : r === c[c.length - 1] && c.pop(),
              0 === c.length)
            ) {
              if (";" === r) {
                (o.source.end = this.getPosition(t[2])),
                  o.source.end.offset++,
                  (this.semicolon = !0);
                break;
              }
              if ("{" === r) {
                a = !0;
                break;
              }
              if ("}" === r) {
                if (l.length > 0) {
                  for (i = l.length - 1, n = l[i]; n && "space" === n[0]; )
                    n = l[--i];
                  n &&
                    ((o.source.end = this.getPosition(n[3] || n[2])),
                    o.source.end.offset++);
                }
                this.end(t);
                break;
              }
              l.push(t);
            } else l.push(t);
            if (this.tokenizer.endOfFile()) {
              s = !0;
              break;
            }
          }
          (o.raws.between = this.spacesAndCommentsFromEnd(l)),
            l.length
              ? ((o.raws.afterName = this.spacesAndCommentsFromStart(l)),
                this.raw(o, "params", l),
                s &&
                  ((t = l[l.length - 1]),
                  (o.source.end = this.getPosition(t[3] || t[2])),
                  o.source.end.offset++,
                  (this.spaces = o.raws.between),
                  (o.raws.between = "")))
              : ((o.raws.afterName = ""), (o.params = "")),
            a && ((o.nodes = []), (this.current = o));
        }
        checkMissedSemicolon(e) {
          let t = this.colon(e);
          if (!1 === t) return;
          let r,
            n = 0;
          for (
            let i = t - 1;
            i >= 0 && ((r = e[i]), "space" === r[0] || ((n += 1), 2 !== n));
            i--
          );
          throw this.input.error(
            "Missed semicolon",
            "word" === r[0] ? r[3] + 1 : r[2]
          );
        }
        colon(e) {
          let t,
            r,
            n,
            i = 0;
          for (let [o, s] of e.entries()) {
            if (
              ((r = s),
              (n = r[0]),
              "(" === n && (i += 1),
              ")" === n && (i -= 1),
              0 === i && ":" === n)
            ) {
              if (t) {
                if ("word" === t[0] && "progid" === t[1]) continue;
                return o;
              }
              this.doubleColon(r);
            }
            t = r;
          }
          return !1;
        }
        comment(e) {
          let r = new t();
          this.init(r, e[2]),
            (r.source.end = this.getPosition(e[3] || e[2])),
            r.source.end.offset++;
          let n = e[1].slice(2, -2);
          if (/^\s*$/.test(n))
            (r.text = ""), (r.raws.left = n), (r.raws.right = "");
          else {
            let e = n.match(/^(\s*)([^]*\S)(\s*)$/);
            (r.text = e[2]), (r.raws.left = e[1]), (r.raws.right = e[3]);
          }
        }
        createTokenizer() {
          this.tokenizer = o(this.input);
        }
        decl(e, t) {
          let n = new r();
          this.init(n, e[0][2]);
          let i,
            o = e[e.length - 1];
          for (
            ";" === o[0] && ((this.semicolon = !0), e.pop()),
              n.source.end = this.getPosition(
                o[3] ||
                  o[2] ||
                  (function (e) {
                    for (let t = e.length - 1; t >= 0; t--) {
                      let r = e[t],
                        n = r[3] || r[2];
                      if (n) return n;
                    }
                  })(e)
              ),
              n.source.end.offset++;
            "word" !== e[0][0];

          )
            1 === e.length && this.unknownWord(e),
              (n.raws.before += e.shift()[1]);
          for (
            n.source.start = this.getPosition(e[0][2]), n.prop = "";
            e.length;

          ) {
            let t = e[0][0];
            if (":" === t || "space" === t || "comment" === t) break;
            n.prop += e.shift()[1];
          }
          for (n.raws.between = ""; e.length; ) {
            if (((i = e.shift()), ":" === i[0])) {
              n.raws.between += i[1];
              break;
            }
            "word" === i[0] && /\w/.test(i[1]) && this.unknownWord([i]),
              (n.raws.between += i[1]);
          }
          ("_" !== n.prop[0] && "*" !== n.prop[0]) ||
            ((n.raws.before += n.prop[0]), (n.prop = n.prop.slice(1)));
          let s,
            a = [];
          for (
            ;
            e.length && ((s = e[0][0]), "space" === s || "comment" === s);

          )
            a.push(e.shift());
          this.precheckMissedSemicolon(e);
          for (let t = e.length - 1; t >= 0; t--) {
            if (((i = e[t]), "!important" === i[1].toLowerCase())) {
              n.important = !0;
              let r = this.stringFrom(e, t);
              (r = this.spacesFromEnd(e) + r),
                " !important" !== r && (n.raws.important = r);
              break;
            }
            if ("important" === i[1].toLowerCase()) {
              let r = e.slice(0),
                i = "";
              for (let e = t; e > 0; e--) {
                let t = r[e][0];
                if (i.trim().startsWith("!") && "space" !== t) break;
                i = r.pop()[1] + i;
              }
              i.trim().startsWith("!") &&
                ((n.important = !0), (n.raws.important = i), (e = r));
            }
            if ("space" !== i[0] && "comment" !== i[0]) break;
          }
          e.some((e) => "space" !== e[0] && "comment" !== e[0]) &&
            ((n.raws.between += a.map((e) => e[1]).join("")), (a = [])),
            this.raw(n, "value", a.concat(e), t),
            n.value.includes(":") && !t && this.checkMissedSemicolon(e);
        }
        doubleColon(e) {
          throw this.input.error(
            "Double colon",
            { offset: e[2] },
            { offset: e[2] + e[1].length }
          );
        }
        emptyRule(e) {
          let t = new i();
          this.init(t, e[2]),
            (t.selector = ""),
            (t.raws.between = ""),
            (this.current = t);
        }
        end(e) {
          this.current.nodes &&
            this.current.nodes.length &&
            (this.current.raws.semicolon = this.semicolon),
            (this.semicolon = !1),
            (this.current.raws.after =
              (this.current.raws.after || "") + this.spaces),
            (this.spaces = ""),
            this.current.parent
              ? ((this.current.source.end = this.getPosition(e[2])),
                this.current.source.end.offset++,
                (this.current = this.current.parent))
              : this.unexpectedClose(e);
        }
        endFile() {
          this.current.parent && this.unclosedBlock(),
            this.current.nodes &&
              this.current.nodes.length &&
              (this.current.raws.semicolon = this.semicolon),
            (this.current.raws.after =
              (this.current.raws.after || "") + this.spaces),
            (this.root.source.end = this.getPosition(
              this.tokenizer.position()
            ));
        }
        freeSemicolon(e) {
          if (((this.spaces += e[1]), this.current.nodes)) {
            let t = this.current.nodes[this.current.nodes.length - 1];
            t &&
              "rule" === t.type &&
              !t.raws.ownSemicolon &&
              ((t.raws.ownSemicolon = this.spaces),
              (this.spaces = ""),
              (t.source.end = this.getPosition(e[2])),
              (t.source.end.offset += t.raws.ownSemicolon.length));
          }
        }
        getPosition(e) {
          let t = this.input.fromOffset(e);
          return { column: t.col, line: t.line, offset: e };
        }
        init(e, t) {
          this.current.push(e),
            (e.source = { input: this.input, start: this.getPosition(t) }),
            (e.raws.before = this.spaces),
            (this.spaces = ""),
            "comment" !== e.type && (this.semicolon = !1);
        }
        other(e) {
          let t = !1,
            r = null,
            n = !1,
            i = null,
            o = [],
            s = e[1].startsWith("--"),
            a = [],
            l = e;
          for (; l; ) {
            if (((r = l[0]), a.push(l), "(" === r || "[" === r))
              i || (i = l), o.push("(" === r ? ")" : "]");
            else if (s && n && "{" === r) i || (i = l), o.push("}");
            else if (0 === o.length) {
              if (";" === r) {
                if (n) return void this.decl(a, s);
                break;
              }
              if ("{" === r) return void this.rule(a);
              if ("}" === r) {
                this.tokenizer.back(a.pop()), (t = !0);
                break;
              }
              ":" === r && (n = !0);
            } else
              r === o[o.length - 1] && (o.pop(), 0 === o.length && (i = null));
            l = this.tokenizer.nextToken();
          }
          if (
            (this.tokenizer.endOfFile() && (t = !0),
            o.length > 0 && this.unclosedBracket(i),
            t && n)
          ) {
            if (!s)
              for (
                ;
                a.length &&
                ((l = a[a.length - 1][0]), "space" === l || "comment" === l);

              )
                this.tokenizer.back(a.pop());
            this.decl(a, s);
          } else this.unknownWord(a);
        }
        parse() {
          let e;
          for (; !this.tokenizer.endOfFile(); )
            switch (((e = this.tokenizer.nextToken()), e[0])) {
              case "space":
                this.spaces += e[1];
                break;
              case ";":
                this.freeSemicolon(e);
                break;
              case "}":
                this.end(e);
                break;
              case "comment":
                this.comment(e);
                break;
              case "at-word":
                this.atrule(e);
                break;
              case "{":
                this.emptyRule(e);
                break;
              default:
                this.other(e);
            }
          this.endFile();
        }
        precheckMissedSemicolon() {}
        raw(e, t, r, n) {
          let i,
            o,
            a,
            l,
            c = r.length,
            u = "",
            d = !0;
          for (let e = 0; e < c; e += 1)
            (i = r[e]),
              (o = i[0]),
              "space" !== o || e !== c - 1 || n
                ? "comment" === o
                  ? ((l = r[e - 1] ? r[e - 1][0] : "empty"),
                    (a = r[e + 1] ? r[e + 1][0] : "empty"),
                    s[l] || s[a] || "," === u.slice(-1)
                      ? (d = !1)
                      : (u += i[1]))
                  : (u += i[1])
                : (d = !1);
          if (!d) {
            let n = r.reduce((e, t) => e + t[1], "");
            e.raws[t] = { raw: n, value: u };
          }
          e[t] = u;
        }
        rule(e) {
          e.pop();
          let t = new i();
          this.init(t, e[0][2]),
            (t.raws.between = this.spacesAndCommentsFromEnd(e)),
            this.raw(t, "selector", e),
            (this.current = t);
        }
        spacesAndCommentsFromEnd(e) {
          let t,
            r = "";
          for (
            ;
            e.length &&
            ((t = e[e.length - 1][0]), "space" === t || "comment" === t);

          )
            r = e.pop()[1] + r;
          return r;
        }
        spacesAndCommentsFromStart(e) {
          let t,
            r = "";
          for (
            ;
            e.length && ((t = e[0][0]), "space" === t || "comment" === t);

          )
            r += e.shift()[1];
          return r;
        }
        spacesFromEnd(e) {
          let t,
            r = "";
          for (; e.length && ((t = e[e.length - 1][0]), "space" === t); )
            r = e.pop()[1] + r;
          return r;
        }
        stringFrom(e, t) {
          let r = "";
          for (let n = t; n < e.length; n++) r += e[n][1];
          return e.splice(t, e.length - t), r;
        }
        unclosedBlock() {
          let e = this.current.source.start;
          throw this.input.error("Unclosed block", e.line, e.column);
        }
        unclosedBracket(e) {
          throw this.input.error(
            "Unclosed bracket",
            { offset: e[2] },
            { offset: e[2] + 1 }
          );
        }
        unexpectedClose(e) {
          throw this.input.error(
            "Unexpected }",
            { offset: e[2] },
            { offset: e[2] + 1 }
          );
        }
        unknownWord(e) {
          throw this.input.error(
            "Unknown word " + e[0][1],
            { offset: e[0][2] },
            { offset: e[0][2] + e[0][1].length }
          );
        }
        unnamedAtrule(e, t) {
          throw this.input.error(
            "At-rule without name",
            { offset: t[2] },
            { offset: t[2] + t[1].length }
          );
        }
      }),
      _s
    );
  }
  function ga() {
    if (Rs) return Ds;
    Rs = 1;
    let e = ia(),
      t = ca(),
      r = fa();
    function n(e, n) {
      let i = new t(e, n),
        o = new r(i);
      try {
        o.parse();
      } catch (e) {
        throw e;
      }
      return o.root;
    }
    return (Ds = n), (n.default = n), e.registerParse(n), Ds;
  }
  function ma() {
    if (Fs) return $s;
    Fs = 1;
    class e {
      constructor(e, t = {}) {
        if (
          ((this.type = "warning"), (this.text = e), t.node && t.node.source)
        ) {
          let e = t.node.rangeBy(t);
          (this.line = e.start.line),
            (this.column = e.start.column),
            (this.endLine = e.end.line),
            (this.endColumn = e.end.column);
        }
        for (let e in t) this[e] = t[e];
      }
      toString() {
        return this.node
          ? this.node.error(this.text, {
              index: this.index,
              plugin: this.plugin,
              word: this.word,
            }).message
          : this.plugin
          ? this.plugin + ": " + this.text
          : this.text;
      }
    }
    return ($s = e), (e.default = e), $s;
  }
  function va() {
    if (qs) return Bs;
    qs = 1;
    let e = ma();
    class t {
      get content() {
        return this.css;
      }
      constructor(e, t, r) {
        (this.processor = e),
          (this.messages = []),
          (this.root = t),
          (this.opts = r),
          (this.css = void 0),
          (this.map = void 0);
      }
      toString() {
        return this.css;
      }
      warn(t, r = {}) {
        r.plugin ||
          (this.lastPlugin &&
            this.lastPlugin.postcssPlugin &&
            (r.plugin = this.lastPlugin.postcssPlugin));
        let n = new e(t, r);
        return this.messages.push(n), n;
      }
      warnings() {
        return this.messages.filter((e) => "warning" === e.type);
      }
    }
    return (Bs = t), (t.default = t), Bs;
  }
  function ya() {
    if (Hs) return js;
    Hs = 1;
    let e = {};
    return (js = function (t) {
      e[t] ||
        ((e[t] = !0),
        "undefined" != typeof console && console.warn && console.warn(t));
    });
  }
  function ba() {
    if (Us) return Vs;
    Us = 1;
    let e = ia(),
      t = sa(),
      r = ha(),
      n = ga(),
      i = va(),
      o = ua(),
      s = ts(),
      { isClean: a, my: l } = ea();
    ya();
    const c = {
        atrule: "AtRule",
        comment: "Comment",
        decl: "Declaration",
        document: "Document",
        root: "Root",
        rule: "Rule",
      },
      u = {
        AtRule: !0,
        AtRuleExit: !0,
        Comment: !0,
        CommentExit: !0,
        Declaration: !0,
        DeclarationExit: !0,
        Document: !0,
        DocumentExit: !0,
        Once: !0,
        OnceExit: !0,
        postcssPlugin: !0,
        prepare: !0,
        Root: !0,
        RootExit: !0,
        Rule: !0,
        RuleExit: !0,
      },
      d = { Once: !0, postcssPlugin: !0, prepare: !0 };
    function p(e) {
      return "object" == typeof e && "function" == typeof e.then;
    }
    function h(e) {
      let t = !1,
        r = c[e.type];
      return (
        "decl" === e.type
          ? (t = e.prop.toLowerCase())
          : "atrule" === e.type && (t = e.name.toLowerCase()),
        t && e.append
          ? [r, r + "-" + t, 0, r + "Exit", r + "Exit-" + t]
          : t
          ? [r, r + "-" + t, r + "Exit", r + "Exit-" + t]
          : e.append
          ? [r, 0, r + "Exit"]
          : [r, r + "Exit"]
      );
    }
    function f(e) {
      let t;
      return (
        (t =
          "document" === e.type
            ? ["Document", 0, "DocumentExit"]
            : "root" === e.type
            ? ["Root", 0, "RootExit"]
            : h(e)),
        {
          eventIndex: 0,
          events: t,
          iterator: 0,
          node: e,
          visitorIndex: 0,
          visitors: [],
        }
      );
    }
    function g(e) {
      return (e[a] = !1), e.nodes && e.nodes.forEach((e) => g(e)), e;
    }
    let m = {};
    class v {
      get content() {
        return this.stringify().content;
      }
      get css() {
        return this.stringify().css;
      }
      get map() {
        return this.stringify().map;
      }
      get messages() {
        return this.sync().messages;
      }
      get opts() {
        return this.result.opts;
      }
      get processor() {
        return this.result.processor;
      }
      get root() {
        return this.sync().root;
      }
      get [Symbol.toStringTag]() {
        return "LazyResult";
      }
      constructor(t, r, o) {
        let s;
        if (
          ((this.stringified = !1),
          (this.processed = !1),
          "object" != typeof r ||
            null === r ||
            ("root" !== r.type && "document" !== r.type))
        )
          if (r instanceof v || r instanceof i)
            (s = g(r.root)),
              r.map &&
                (void 0 === o.map && (o.map = {}),
                o.map.inline || (o.map.inline = !1),
                (o.map.prev = r.map));
          else {
            let t = n;
            o.syntax && (t = o.syntax.parse),
              o.parser && (t = o.parser),
              t.parse && (t = t.parse);
            try {
              s = t(r, o);
            } catch (e) {
              (this.processed = !0), (this.error = e);
            }
            s && !s[l] && e.rebuild(s);
          }
        else s = g(r);
        (this.result = new i(t, s, o)),
          (this.helpers = { ...m, postcss: m, result: this.result }),
          (this.plugins = this.processor.plugins.map((e) =>
            "object" == typeof e && e.prepare
              ? { ...e, ...e.prepare(this.result) }
              : e
          ));
      }
      async() {
        return this.error
          ? Promise.reject(this.error)
          : this.processed
          ? Promise.resolve(this.result)
          : (this.processing || (this.processing = this.runAsync()),
            this.processing);
      }
      catch(e) {
        return this.async().catch(e);
      }
      finally(e) {
        return this.async().then(e, e);
      }
      getAsyncError() {
        throw new Error("Use process(css).then(cb) to work with async plugins");
      }
      handleError(e, t) {
        let r = this.result.lastPlugin;
        try {
          t && t.addToError(e),
            (this.error = e),
            "CssSyntaxError" !== e.name || e.plugin
              ? r.postcssVersion
              : ((e.plugin = r.postcssPlugin), e.setMessage());
        } catch (e) {
          console && console.error && console.error(e);
        }
        return e;
      }
      prepareVisitors() {
        this.listeners = {};
        let e = (e, t, r) => {
          this.listeners[t] || (this.listeners[t] = []),
            this.listeners[t].push([e, r]);
        };
        for (let t of this.plugins)
          if ("object" == typeof t)
            for (let r in t) {
              if (!u[r] && /^[A-Z]/.test(r))
                throw new Error(
                  `Unknown event ${r} in ${t.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
                );
              if (!d[r])
                if ("object" == typeof t[r])
                  for (let n in t[r])
                    e(t, "*" === n ? r : r + "-" + n.toLowerCase(), t[r][n]);
                else "function" == typeof t[r] && e(t, r, t[r]);
            }
        this.hasListener = Object.keys(this.listeners).length > 0;
      }
      async runAsync() {
        this.plugin = 0;
        for (let e = 0; e < this.plugins.length; e++) {
          let t = this.plugins[e],
            r = this.runOnRoot(t);
          if (p(r))
            try {
              await r;
            } catch (e) {
              throw this.handleError(e);
            }
        }
        if ((this.prepareVisitors(), this.hasListener)) {
          let e = this.result.root;
          for (; !e[a]; ) {
            e[a] = !0;
            let t = [f(e)];
            for (; t.length > 0; ) {
              let e = this.visitTick(t);
              if (p(e))
                try {
                  await e;
                } catch (e) {
                  let r = t[t.length - 1].node;
                  throw this.handleError(e, r);
                }
            }
          }
          if (this.listeners.OnceExit)
            for (let [t, r] of this.listeners.OnceExit) {
              this.result.lastPlugin = t;
              try {
                if ("document" === e.type) {
                  let t = e.nodes.map((e) => r(e, this.helpers));
                  await Promise.all(t);
                } else await r(e, this.helpers);
              } catch (e) {
                throw this.handleError(e);
              }
            }
        }
        return (this.processed = !0), this.stringify();
      }
      runOnRoot(e) {
        this.result.lastPlugin = e;
        try {
          if ("object" == typeof e && e.Once) {
            if ("document" === this.result.root.type) {
              let t = this.result.root.nodes.map((t) =>
                e.Once(t, this.helpers)
              );
              return p(t[0]) ? Promise.all(t) : t;
            }
            return e.Once(this.result.root, this.helpers);
          }
          if ("function" == typeof e) return e(this.result.root, this.result);
        } catch (e) {
          throw this.handleError(e);
        }
      }
      stringify() {
        if (this.error) throw this.error;
        if (this.stringified) return this.result;
        (this.stringified = !0), this.sync();
        let e = this.result.opts,
          t = s;
        e.syntax && (t = e.syntax.stringify),
          e.stringifier && (t = e.stringifier),
          t.stringify && (t = t.stringify);
        let n = new r(t, this.result.root, this.result.opts).generate();
        return (this.result.css = n[0]), (this.result.map = n[1]), this.result;
      }
      sync() {
        if (this.error) throw this.error;
        if (this.processed) return this.result;
        if (((this.processed = !0), this.processing))
          throw this.getAsyncError();
        for (let e of this.plugins) {
          if (p(this.runOnRoot(e))) throw this.getAsyncError();
        }
        if ((this.prepareVisitors(), this.hasListener)) {
          let e = this.result.root;
          for (; !e[a]; ) (e[a] = !0), this.walkSync(e);
          if (this.listeners.OnceExit)
            if ("document" === e.type)
              for (let t of e.nodes) this.visitSync(this.listeners.OnceExit, t);
            else this.visitSync(this.listeners.OnceExit, e);
        }
        return this.result;
      }
      then(e, t) {
        return this.async().then(e, t);
      }
      toString() {
        return this.css;
      }
      visitSync(e, t) {
        for (let [r, n] of e) {
          let e;
          this.result.lastPlugin = r;
          try {
            e = n(t, this.helpers);
          } catch (e) {
            throw this.handleError(e, t.proxyOf);
          }
          if ("root" !== t.type && "document" !== t.type && !t.parent)
            return !0;
          if (p(e)) throw this.getAsyncError();
        }
      }
      visitTick(e) {
        let t = e[e.length - 1],
          { node: r, visitors: n } = t;
        if ("root" !== r.type && "document" !== r.type && !r.parent)
          return void e.pop();
        if (n.length > 0 && t.visitorIndex < n.length) {
          let [e, i] = n[t.visitorIndex];
          (t.visitorIndex += 1),
            t.visitorIndex === n.length &&
              ((t.visitors = []), (t.visitorIndex = 0)),
            (this.result.lastPlugin = e);
          try {
            return i(r.toProxy(), this.helpers);
          } catch (e) {
            throw this.handleError(e, r);
          }
        }
        if (0 !== t.iterator) {
          let n,
            i = t.iterator;
          for (; (n = r.nodes[r.indexes[i]]); )
            if (((r.indexes[i] += 1), !n[a]))
              return (n[a] = !0), void e.push(f(n));
          (t.iterator = 0), delete r.indexes[i];
        }
        let i = t.events;
        for (; t.eventIndex < i.length; ) {
          let e = i[t.eventIndex];
          if (((t.eventIndex += 1), 0 === e))
            return void (
              r.nodes &&
              r.nodes.length &&
              ((r[a] = !0), (t.iterator = r.getIterator()))
            );
          if (this.listeners[e]) return void (t.visitors = this.listeners[e]);
        }
        e.pop();
      }
      walkSync(e) {
        e[a] = !0;
        let t = h(e);
        for (let r of t)
          if (0 === r)
            e.nodes &&
              e.each((e) => {
                e[a] || this.walkSync(e);
              });
          else {
            let t = this.listeners[r];
            if (t && this.visitSync(t, e.toProxy())) return;
          }
      }
      warnings() {
        return this.sync().warnings();
      }
    }
    return (
      (v.registerPostcss = (e) => {
        m = e;
      }),
      (Vs = v),
      (v.default = v),
      o.registerLazyResult(v),
      t.registerLazyResult(v),
      Vs
    );
  }
  function wa() {
    if (Ks) return Ws;
    Ks = 1;
    let e = sa(),
      t = ba(),
      r = (function () {
        if (Gs) return zs;
        Gs = 1;
        let e = ha(),
          t = ga();
        const r = va();
        let n = ts();
        ya();
        class i {
          get content() {
            return this.result.css;
          }
          get css() {
            return this.result.css;
          }
          get map() {
            return this.result.map;
          }
          get messages() {
            return [];
          }
          get opts() {
            return this.result.opts;
          }
          get processor() {
            return this.result.processor;
          }
          get root() {
            if (this._root) return this._root;
            let e,
              r = t;
            try {
              e = r(this._css, this._opts);
            } catch (e) {
              this.error = e;
            }
            if (this.error) throw this.error;
            return (this._root = e), e;
          }
          get [Symbol.toStringTag]() {
            return "NoWorkResult";
          }
          constructor(t, i, o) {
            let s;
            (i = i.toString()),
              (this.stringified = !1),
              (this._processor = t),
              (this._css = i),
              (this._opts = o),
              (this._map = void 0);
            let a = n;
            (this.result = new r(this._processor, s, this._opts)),
              (this.result.css = i);
            let l = this;
            Object.defineProperty(this.result, "root", { get: () => l.root });
            let c = new e(a, s, this._opts, i);
            if (c.isMap()) {
              let [e, t] = c.generate();
              e && (this.result.css = e), t && (this.result.map = t);
            } else c.clearAnnotation(), (this.result.css = c.css);
          }
          async() {
            return this.error
              ? Promise.reject(this.error)
              : Promise.resolve(this.result);
          }
          catch(e) {
            return this.async().catch(e);
          }
          finally(e) {
            return this.async().then(e, e);
          }
          sync() {
            if (this.error) throw this.error;
            return this.result;
          }
          then(e, t) {
            return this.async().then(e, t);
          }
          toString() {
            return this._css;
          }
          warnings() {
            return [];
          }
        }
        return (zs = i), (i.default = i), zs;
      })(),
      n = ua();
    class i {
      constructor(e = []) {
        (this.version = "8.5.3"), (this.plugins = this.normalize(e));
      }
      normalize(e) {
        let t = [];
        for (let r of e)
          if (
            (!0 === r.postcss ? (r = r()) : r.postcss && (r = r.postcss),
            "object" == typeof r && Array.isArray(r.plugins))
          )
            t = t.concat(r.plugins);
          else if ("object" == typeof r && r.postcssPlugin) t.push(r);
          else if ("function" == typeof r) t.push(r);
          else {
            if ("object" != typeof r || (!r.parse && !r.stringify))
              throw new Error(r + " is not a PostCSS plugin");
          }
        return t;
      }
      process(e, n = {}) {
        return this.plugins.length || n.parser || n.stringifier || n.syntax
          ? new t(this, e, n)
          : new r(this, e, n);
      }
      use(e) {
        return (this.plugins = this.plugins.concat(this.normalize([e]))), this;
      }
    }
    return (
      (Ws = i),
      (i.default = i),
      n.registerProcessor(i),
      e.registerProcessor(i),
      Ws
    );
  }
  function xa() {
    if (Xs) return Zs;
    Xs = 1;
    let e = oa(),
      t = ra(),
      r = ia(),
      n = Jo(),
      i = na(),
      o = sa(),
      s = (function () {
        if (Os) return As;
        Os = 1;
        let e = oa(),
          t = ra(),
          r = na(),
          n = ca(),
          i = la(),
          o = ua(),
          s = pa();
        function a(l, c) {
          if (Array.isArray(l)) return l.map((e) => a(e));
          let { inputs: u, ...d } = l;
          if (u) {
            c = [];
            for (let e of u) {
              let t = { ...e, __proto__: n.prototype };
              t.map && (t.map = { ...t.map, __proto__: i.prototype }),
                c.push(t);
            }
          }
          if ((d.nodes && (d.nodes = l.nodes.map((e) => a(e, c))), d.source)) {
            let { inputId: e, ...t } = d.source;
            (d.source = t), null != e && (d.source.input = c[e]);
          }
          if ("root" === d.type) return new o(d);
          if ("decl" === d.type) return new r(d);
          if ("rule" === d.type) return new s(d);
          if ("comment" === d.type) return new t(d);
          if ("atrule" === d.type) return new e(d);
          throw new Error("Unknown node type: " + l.type);
        }
        return (As = a), (a.default = a), As;
      })(),
      a = ca(),
      l = ba(),
      c = da(),
      u = ta(),
      d = ga(),
      p = wa(),
      h = va(),
      f = ua(),
      g = pa(),
      m = ts(),
      v = ma();
    function y(...e) {
      return 1 === e.length && Array.isArray(e[0]) && (e = e[0]), new p(e);
    }
    return (
      (y.plugin = function (e, t) {
        let r,
          n = !1;
        function i(...r) {
          console &&
            console.warn &&
            !n &&
            ((n = !0),
            console.warn(
              e +
                ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
            ),
            process.env.LANG &&
              process.env.LANG.startsWith("cn") &&
              console.warn(
                e +
                  ": \u91cc\u9762 postcss.plugin \u88ab\u5f03\u7528. \u8fc1\u79fb\u6307\u5357:\nhttps://www.w3ctech.com/topic/2226"
              ));
          let i = t(...r);
          return (i.postcssPlugin = e), (i.postcssVersion = new p().version), i;
        }
        return (
          Object.defineProperty(i, "postcss", {
            get: () => (r || (r = i()), r),
          }),
          (i.process = function (e, t, r) {
            return y([i(r)]).process(e, t);
          }),
          i
        );
      }),
      (y.stringify = m),
      (y.parse = d),
      (y.fromJSON = s),
      (y.list = c),
      (y.comment = (e) => new t(e)),
      (y.atRule = (t) => new e(t)),
      (y.decl = (e) => new i(e)),
      (y.rule = (e) => new g(e)),
      (y.root = (e) => new f(e)),
      (y.document = (e) => new o(e)),
      (y.CssSyntaxError = n),
      (y.Declaration = i),
      (y.Container = r),
      (y.Processor = p),
      (y.Document = o),
      (y.Comment = t),
      (y.Warning = v),
      (y.AtRule = e),
      (y.Result = h),
      (y.Input = a),
      (y.Rule = g),
      (y.Root = f),
      (y.Node = u),
      l.registerPostcss(y),
      (Zs = y),
      (y.default = y),
      Zs
    );
  }
  function Ca() {
    if (Qs) return Ys;
    Qs = 1;
    const e = No(),
      t = Io(),
      { isPlainObject: r } = $o(),
      n = Fo(),
      i = Ho(),
      { parse: o } = xa(),
      s = [
        "img",
        "audio",
        "video",
        "picture",
        "svg",
        "object",
        "map",
        "iframe",
        "embed",
      ],
      a = ["script", "style"];
    function l(e, t) {
      e &&
        Object.keys(e).forEach(function (r) {
          t(e[r], r);
        });
    }
    function c(e, t) {
      return {}.hasOwnProperty.call(e, t);
    }
    function u(e, t) {
      const r = [];
      return (
        l(e, function (e) {
          t(e) && r.push(e);
        }),
        r
      );
    }
    Ys = p;
    const d = /^[^\0\t\n\f\r /<=>]+$/;
    function p(f, g, m) {
      if (null == f) return "";
      "number" == typeof f && (f = f.toString());
      let v = "",
        y = "";
      function b(e, t) {
        const r = this;
        (this.tag = e),
          (this.attribs = t || {}),
          (this.tagPosition = v.length),
          (this.text = ""),
          (this.mediaChildren = []),
          (this.updateParentNodeText = function () {
            if (M.length) {
              M[M.length - 1].text += r.text;
            }
          }),
          (this.updateParentNodeMediaChildren = function () {
            if (M.length && s.includes(this.tag)) {
              M[M.length - 1].mediaChildren.push(this.tag);
            }
          });
      }
      (g = Object.assign({}, p.defaults, g)).parser = Object.assign(
        {},
        h,
        g.parser
      );
      const w = function (e) {
        return !1 === g.allowedTags || (g.allowedTags || []).indexOf(e) > -1;
      };
      a.forEach(function (e) {
        w(e) &&
          !g.allowVulnerableTags &&
          console.warn(
            `\n\n\u26a0\ufe0f Your \`allowedTags\` option includes, \`${e}\`, which is inherently\nvulnerable to XSS attacks. Please remove it from \`allowedTags\`.\nOr, to disable this warning, add the \`allowVulnerableTags\` option\nand ensure you are accounting for this risk.\n\n`
          );
      });
      const x = g.nonTextTags || ["script", "style", "textarea", "option"];
      let C, S;
      g.allowedAttributes &&
        ((C = {}),
        (S = {}),
        l(g.allowedAttributes, function (e, r) {
          C[r] = [];
          const n = [];
          e.forEach(function (e) {
            "string" == typeof e && e.indexOf("*") >= 0
              ? n.push(t(e).replace(/\\\*/g, ".*"))
              : C[r].push(e);
          }),
            n.length && (S[r] = new RegExp("^(" + n.join("|") + ")$"));
        }));
      const k = {},
        E = {},
        T = {};
      l(g.allowedClasses, function (e, r) {
        if (
          (C && (c(C, r) || (C[r] = []), C[r].push("class")),
          (k[r] = e),
          Array.isArray(e))
        ) {
          const n = [];
          (k[r] = []),
            (T[r] = []),
            e.forEach(function (e) {
              "string" == typeof e && e.indexOf("*") >= 0
                ? n.push(t(e).replace(/\\\*/g, ".*"))
                : e instanceof RegExp
                ? T[r].push(e)
                : k[r].push(e);
            }),
            n.length && (E[r] = new RegExp("^(" + n.join("|") + ")$"));
        }
      });
      const A = {};
      let O, P, M, N, I, _, L;
      l(g.transformTags, function (e, t) {
        let r;
        "function" == typeof e
          ? (r = e)
          : "string" == typeof e && (r = p.simpleTransform(e)),
          "*" === t ? (O = r) : (A[t] = r);
      });
      let D = !1;
      $();
      const R = new e.Parser(
        {
          onopentag: function (e, t) {
            if ((g.enforceHtmlBoundary && "html" === e && $(), _))
              return void L++;
            const s = new b(e, t);
            M.push(s);
            let a = !1;
            const p = !!s.text;
            let h;
            if (
              (c(A, e) &&
                ((h = A[e](e, t)),
                (s.attribs = t = h.attribs),
                void 0 !== h.text && (s.innerText = h.text),
                e !== h.tagName &&
                  ((s.name = e = h.tagName), (I[P] = h.tagName))),
              O &&
                ((h = O(e, t)),
                (s.attribs = t = h.attribs),
                e !== h.tagName &&
                  ((s.name = e = h.tagName), (I[P] = h.tagName))),
              (!w(e) ||
                ("recursiveEscape" === g.disallowedTagsMode &&
                  !(function (e) {
                    for (const t in e) if (c(e, t)) return !1;
                    return !0;
                  })(N)) ||
                (null != g.nestingLimit && P >= g.nestingLimit)) &&
                ((a = !0),
                (N[P] = !0),
                ("discard" !== g.disallowedTagsMode &&
                  "completelyDiscard" !== g.disallowedTagsMode) ||
                  (-1 !== x.indexOf(e) && ((_ = !0), (L = 1))),
                (N[P] = !0)),
              P++,
              a)
            ) {
              if (
                "discard" === g.disallowedTagsMode ||
                "completelyDiscard" === g.disallowedTagsMode
              ) {
                if (s.innerText && !p) {
                  const t = F(s.innerText);
                  g.textFilter
                    ? (v += g.textFilter(t, e))
                    : (v += F(s.innerText)),
                    (D = !0);
                }
                return;
              }
              (y = v), (v = "");
            }
            (v += "<" + e),
              "script" === e &&
                (g.allowedScriptHostnames || g.allowedScriptDomains) &&
                (s.innerText = ""),
              (!C || c(C, e) || C["*"]) &&
                l(t, function (t, a) {
                  if (!d.test(a)) return void delete s.attribs[a];
                  if (
                    "" === t &&
                    !g.allowedEmptyAttributes.includes(a) &&
                    (g.nonBooleanAttributes.includes(a) ||
                      g.nonBooleanAttributes.includes("*"))
                  )
                    return void delete s.attribs[a];
                  let l = !1;
                  if (
                    !C ||
                    (c(C, e) && -1 !== C[e].indexOf(a)) ||
                    (C["*"] && -1 !== C["*"].indexOf(a)) ||
                    (c(S, e) && S[e].test(a)) ||
                    (S["*"] && S["*"].test(a))
                  )
                    l = !0;
                  else if (C && C[e])
                    for (const n of C[e])
                      if (r(n) && n.name && n.name === a) {
                        l = !0;
                        let e = "";
                        if (!0 === n.multiple) {
                          const r = t.split(" ");
                          for (const t of r)
                            -1 !== n.values.indexOf(t) &&
                              ("" === e ? (e = t) : (e += " " + t));
                        } else n.values.indexOf(t) >= 0 && (e = t);
                        t = e;
                      }
                  if (l) {
                    if (
                      -1 !== g.allowedSchemesAppliedToAttributes.indexOf(a) &&
                      B(e, t)
                    )
                      return void delete s.attribs[a];
                    if ("script" === e && "src" === a) {
                      let e = !0;
                      try {
                        const r = q(t);
                        if (
                          g.allowedScriptHostnames ||
                          g.allowedScriptDomains
                        ) {
                          const t = (g.allowedScriptHostnames || []).find(
                              function (e) {
                                return e === r.url.hostname;
                              }
                            ),
                            n = (g.allowedScriptDomains || []).find(function (
                              e
                            ) {
                              return (
                                r.url.hostname === e ||
                                r.url.hostname.endsWith(`.${e}`)
                              );
                            });
                          e = t || n;
                        }
                      } catch (t) {
                        e = !1;
                      }
                      if (!e) return void delete s.attribs[a];
                    }
                    if ("iframe" === e && "src" === a) {
                      let e = !0;
                      try {
                        const r = q(t);
                        if (r.isRelativeUrl)
                          e = c(g, "allowIframeRelativeUrls")
                            ? g.allowIframeRelativeUrls
                            : !g.allowedIframeHostnames &&
                              !g.allowedIframeDomains;
                        else if (
                          g.allowedIframeHostnames ||
                          g.allowedIframeDomains
                        ) {
                          const t = (g.allowedIframeHostnames || []).find(
                              function (e) {
                                return e === r.url.hostname;
                              }
                            ),
                            n = (g.allowedIframeDomains || []).find(function (
                              e
                            ) {
                              return (
                                r.url.hostname === e ||
                                r.url.hostname.endsWith(`.${e}`)
                              );
                            });
                          e = t || n;
                        }
                      } catch (t) {
                        e = !1;
                      }
                      if (!e) return void delete s.attribs[a];
                    }
                    if ("srcset" === a)
                      try {
                        let e = i(t);
                        if (
                          (e.forEach(function (e) {
                            B("srcset", e.url) && (e.evil = !0);
                          }),
                          (e = u(e, function (e) {
                            return !e.evil;
                          })),
                          !e.length)
                        )
                          return void delete s.attribs[a];
                        (t = u(e, function (e) {
                          return !e.evil;
                        })
                          .map(function (e) {
                            if (!e.url) throw new Error("URL missing");
                            return (
                              e.url +
                              (e.w ? ` ${e.w}w` : "") +
                              (e.h ? ` ${e.h}h` : "") +
                              (e.d ? ` ${e.d}x` : "")
                            );
                          })
                          .join(", ")),
                          (s.attribs[a] = t);
                      } catch (e) {
                        return void delete s.attribs[a];
                      }
                    if ("class" === a) {
                      const r = k[e],
                        i = k["*"],
                        o = E[e],
                        l = T[e],
                        c = T["*"],
                        u = [o, E["*"]].concat(l, c).filter(function (e) {
                          return e;
                        });
                      if (!(t = j(t, r && i ? n(r, i) : r || i, u)).length)
                        return void delete s.attribs[a];
                    }
                    if ("style" === a)
                      if (g.parseStyleAttributes)
                        try {
                          const r = (function (e, t) {
                            if (!t) return e;
                            const r = e.nodes[0];
                            let i;
                            i =
                              t[r.selector] && t["*"]
                                ? n(t[r.selector], t["*"])
                                : t[r.selector] || t["*"];
                            i &&
                              (e.nodes[0].nodes = r.nodes.reduce(
                                (function (e) {
                                  return function (t, r) {
                                    if (c(e, r.prop)) {
                                      e[r.prop].some(function (e) {
                                        return e.test(r.value);
                                      }) && t.push(r);
                                    }
                                    return t;
                                  };
                                })(i),
                                []
                              ));
                            return e;
                          })(
                            o(e + " {" + t + "}", { map: !1 }),
                            g.allowedStyles
                          );
                          if (
                            ((t = (function (e) {
                              return e.nodes[0].nodes
                                .reduce(function (e, t) {
                                  return (
                                    e.push(
                                      `${t.prop}:${t.value}${
                                        t.important ? " !important" : ""
                                      }`
                                    ),
                                    e
                                  );
                                }, [])
                                .join(";");
                            })(r)),
                            0 === t.length)
                          )
                            return void delete s.attribs[a];
                        } catch (r) {
                          return (
                            "undefined" != typeof window &&
                              console.warn(
                                'Failed to parse "' +
                                  e +
                                  " {" +
                                  t +
                                  "}\", If you're running this in a browser, we recommend to disable style parsing: options.parseStyleAttributes: false, since this only works in a node environment due to a postcss dependency, More info: https://github.com/apostrophecms/sanitize-html/issues/547"
                              ),
                            void delete s.attribs[a]
                          );
                        }
                      else if (g.allowedStyles)
                        throw new Error(
                          "allowedStyles option cannot be used together with parseStyleAttributes: false."
                        );
                    (v += " " + a),
                      t && t.length
                        ? (v += '="' + F(t, !0) + '"')
                        : g.allowedEmptyAttributes.includes(a) && (v += '=""');
                  } else delete s.attribs[a];
                }),
              -1 !== g.selfClosing.indexOf(e)
                ? (v += " />")
                : ((v += ">"),
                  !s.innerText ||
                    p ||
                    g.textFilter ||
                    ((v += F(s.innerText)), (D = !0))),
              a && ((v = y + F(v)), (y = ""));
          },
          ontext: function (e) {
            if (_) return;
            const t = M[M.length - 1];
            let r;
            if (
              (t &&
                ((r = t.tag), (e = void 0 !== t.innerText ? t.innerText : e)),
              "completelyDiscard" !== g.disallowedTagsMode || w(r))
            )
              if (
                ("discard" !== g.disallowedTagsMode &&
                  "completelyDiscard" !== g.disallowedTagsMode) ||
                ("script" !== r && "style" !== r)
              ) {
                const t = F(e, !1);
                g.textFilter && !D ? (v += g.textFilter(t, r)) : D || (v += t);
              } else v += e;
            else e = "";
            if (M.length) {
              M[M.length - 1].text += e;
            }
          },
          onclosetag: function (e, t) {
            if (_) {
              if ((L--, L)) return;
              _ = !1;
            }
            const r = M.pop();
            if (!r) return;
            if (r.tag !== e) return void M.push(r);
            (_ = !!g.enforceHtmlBoundary && "html" === e), P--;
            const n = N[P];
            if (n) {
              if (
                (delete N[P],
                "discard" === g.disallowedTagsMode ||
                  "completelyDiscard" === g.disallowedTagsMode)
              )
                return void r.updateParentNodeText();
              (y = v), (v = "");
            }
            I[P] && ((e = I[P]), delete I[P]),
              g.exclusiveFilter && g.exclusiveFilter(r)
                ? (v = v.substr(0, r.tagPosition))
                : (r.updateParentNodeMediaChildren(),
                  r.updateParentNodeText(),
                  -1 !== g.selfClosing.indexOf(e) ||
                  (t &&
                    !w(e) &&
                    ["escape", "recursiveEscape"].indexOf(
                      g.disallowedTagsMode
                    ) >= 0)
                    ? n && ((v = y), (y = ""))
                    : ((v += "</" + e + ">"),
                      n && ((v = y + F(v)), (y = "")),
                      (D = !1)));
          },
        },
        g.parser
      );
      return R.write(f), R.end(), v;
      function $() {
        (v = ""), (P = 0), (M = []), (N = {}), (I = {}), (_ = !1), (L = 0);
      }
      function F(e, t) {
        return (
          "string" != typeof e && (e += ""),
          g.parser.decodeEntities &&
            ((e = e
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")),
            t && (e = e.replace(/"/g, "&quot;"))),
          (e = e
            .replace(/&(?![a-zA-Z0-9#]{1,20};)/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")),
          t && (e = e.replace(/"/g, "&quot;")),
          e
        );
      }
      function B(e, t) {
        for (t = t.replace(/[\x00-\x20]+/g, ""); ; ) {
          const e = t.indexOf("\x3c!--");
          if (-1 === e) break;
          const r = t.indexOf("--\x3e", e + 4);
          if (-1 === r) break;
          t = t.substring(0, e) + t.substring(r + 3);
        }
        const r = t.match(/^([a-zA-Z][a-zA-Z0-9.\-+]*):/);
        if (!r) return !!t.match(/^[/\\]{2}/) && !g.allowProtocolRelative;
        const n = r[1].toLowerCase();
        return c(g.allowedSchemesByTag, e)
          ? -1 === g.allowedSchemesByTag[e].indexOf(n)
          : !g.allowedSchemes || -1 === g.allowedSchemes.indexOf(n);
      }
      function q(e) {
        if (
          (e = e.replace(/^(\w+:)?\s*[\\/]\s*[\\/]/, "$1//")).startsWith(
            "relative:"
          )
        )
          throw new Error("relative: exploit attempt");
        let t = "relative://relative-site";
        for (let e = 0; e < 100; e++) t += `/${e}`;
        const r = new URL(e, t);
        return {
          isRelativeUrl:
            r && "relative-site" === r.hostname && "relative:" === r.protocol,
          url: r,
        };
      }
      function j(e, t, r) {
        return t
          ? (e = e.split(/\s+/))
              .filter(function (e) {
                return (
                  -1 !== t.indexOf(e) ||
                  r.some(function (t) {
                    return t.test(e);
                  })
                );
              })
              .join(" ")
          : e;
      }
    }
    const h = { decodeEntities: !0 };
    return (
      (p.defaults = {
        allowedTags: [
          "address",
          "article",
          "aside",
          "footer",
          "header",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "hgroup",
          "main",
          "nav",
          "section",
          "blockquote",
          "dd",
          "div",
          "dl",
          "dt",
          "figcaption",
          "figure",
          "hr",
          "li",
          "main",
          "ol",
          "p",
          "pre",
          "ul",
          "a",
          "abbr",
          "b",
          "bdi",
          "bdo",
          "br",
          "cite",
          "code",
          "data",
          "dfn",
          "em",
          "i",
          "kbd",
          "mark",
          "q",
          "rb",
          "rp",
          "rt",
          "rtc",
          "ruby",
          "s",
          "samp",
          "small",
          "span",
          "strong",
          "sub",
          "sup",
          "time",
          "u",
          "var",
          "wbr",
          "caption",
          "col",
          "colgroup",
          "table",
          "tbody",
          "td",
          "tfoot",
          "th",
          "thead",
          "tr",
        ],
        nonBooleanAttributes: [
          "abbr",
          "accept",
          "accept-charset",
          "accesskey",
          "action",
          "allow",
          "alt",
          "as",
          "autocapitalize",
          "autocomplete",
          "blocking",
          "charset",
          "cite",
          "class",
          "color",
          "cols",
          "colspan",
          "content",
          "contenteditable",
          "coords",
          "crossorigin",
          "data",
          "datetime",
          "decoding",
          "dir",
          "dirname",
          "download",
          "draggable",
          "enctype",
          "enterkeyhint",
          "fetchpriority",
          "for",
          "form",
          "formaction",
          "formenctype",
          "formmethod",
          "formtarget",
          "headers",
          "height",
          "hidden",
          "high",
          "href",
          "hreflang",
          "http-equiv",
          "id",
          "imagesizes",
          "imagesrcset",
          "inputmode",
          "integrity",
          "is",
          "itemid",
          "itemprop",
          "itemref",
          "itemtype",
          "kind",
          "label",
          "lang",
          "list",
          "loading",
          "low",
          "max",
          "maxlength",
          "media",
          "method",
          "min",
          "minlength",
          "name",
          "nonce",
          "optimum",
          "pattern",
          "ping",
          "placeholder",
          "popover",
          "popovertarget",
          "popovertargetaction",
          "poster",
          "preload",
          "referrerpolicy",
          "rel",
          "rows",
          "rowspan",
          "sandbox",
          "scope",
          "shape",
          "size",
          "sizes",
          "slot",
          "span",
          "spellcheck",
          "src",
          "srcdoc",
          "srclang",
          "srcset",
          "start",
          "step",
          "style",
          "tabindex",
          "target",
          "title",
          "translate",
          "type",
          "usemap",
          "value",
          "width",
          "wrap",
          "onauxclick",
          "onafterprint",
          "onbeforematch",
          "onbeforeprint",
          "onbeforeunload",
          "onbeforetoggle",
          "onblur",
          "oncancel",
          "oncanplay",
          "oncanplaythrough",
          "onchange",
          "onclick",
          "onclose",
          "oncontextlost",
          "oncontextmenu",
          "oncontextrestored",
          "oncopy",
          "oncuechange",
          "oncut",
          "ondblclick",
          "ondrag",
          "ondragend",
          "ondragenter",
          "ondragleave",
          "ondragover",
          "ondragstart",
          "ondrop",
          "ondurationchange",
          "onemptied",
          "onended",
          "onerror",
          "onfocus",
          "onformdata",
          "onhashchange",
          "oninput",
          "oninvalid",
          "onkeydown",
          "onkeypress",
          "onkeyup",
          "onlanguagechange",
          "onload",
          "onloadeddata",
          "onloadedmetadata",
          "onloadstart",
          "onmessage",
          "onmessageerror",
          "onmousedown",
          "onmouseenter",
          "onmouseleave",
          "onmousemove",
          "onmouseout",
          "onmouseover",
          "onmouseup",
          "onoffline",
          "ononline",
          "onpagehide",
          "onpageshow",
          "onpaste",
          "onpause",
          "onplay",
          "onplaying",
          "onpopstate",
          "onprogress",
          "onratechange",
          "onreset",
          "onresize",
          "onrejectionhandled",
          "onscroll",
          "onscrollend",
          "onsecuritypolicyviolation",
          "onseeked",
          "onseeking",
          "onselect",
          "onslotchange",
          "onstalled",
          "onstorage",
          "onsubmit",
          "onsuspend",
          "ontimeupdate",
          "ontoggle",
          "onunhandledrejection",
          "onunload",
          "onvolumechange",
          "onwaiting",
          "onwheel",
        ],
        disallowedTagsMode: "discard",
        allowedAttributes: {
          a: ["href", "name", "target"],
          img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
        },
        allowedEmptyAttributes: ["alt"],
        selfClosing: [
          "img",
          "br",
          "hr",
          "area",
          "base",
          "basefont",
          "input",
          "link",
          "meta",
        ],
        allowedSchemes: ["http", "https", "ftp", "mailto", "tel"],
        allowedSchemesByTag: {},
        allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
        allowProtocolRelative: !0,
        enforceHtmlBoundary: !1,
        parseStyleAttributes: !0,
      }),
      (p.simpleTransform = function (e, t, r) {
        return (
          (r = void 0 === r || r),
          (t = t || {}),
          function (n, i) {
            let o;
            if (r) for (o in t) i[o] = t[o];
            else i = t;
            return { tagName: e, attribs: i };
          }
        );
      }),
      Ys
    );
  }
  var Sa = ci(Ca());
  W(), (Ea[F] = "src/lib/icons/CopyIcon.svelte");
  var ka = er(
    fr(
      '<svg class="copy-icon" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke-width="1.5"></path><path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" opacity="0.5" stroke-width="1.5"></path></g></svg>'
    ),
    Ea[F],
    [
      [
        6,
        0,
        [
          [7, 4],
          [8, 4],
          [
            9,
            4,
            [
              [10, 8],
              [12, 8],
            ],
          ],
        ],
      ],
    ]
  );
  function Ea(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "23px"),
      n = Tn(t, "height", 8, "23px"),
      i = Tn(t, "fill", 8, "var(--yt-spec-text-secondary)");
    var o = ka(),
      s = Ne(Pe(o), 2),
      a = Pe(s),
      l = Ne(a);
    return (
      ze(() => {
        Xr(o, "height", n()),
          Xr(o, "width", r()),
          Xr(a, "stroke", i()),
          Xr(l, "stroke", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Ea), W(), (Aa[F] = "src/lib/icons/CloseIcon.svelte");
  var Ta = er(
    fr(
      '<svg class="close-btn-icon" fill="none" stroke="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M3 21.32L21 3.32001" stroke="var(--clarify-font-color-black)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 3.32001L21 21.32" stroke="var(--clarify-font-color-black)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg>'
    ),
    Aa[F],
    [
      [
        5,
        0,
        [
          [7, 4],
          [8, 4],
          [
            9,
            4,
            [
              [10, 8],
              [13, 8],
            ],
          ],
        ],
      ],
    ]
  );
  function Aa(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "20px"),
      n = Tn(t, "height", 8, "20px");
    var i = Ta();
    return (
      ze(() => {
        Xr(i, "height", n()), Xr(i, "width", r());
      }),
      vr(e, i),
      le({ ...Er() })
    );
  }
  K(Aa), W(), (Pa[F] = "src/lib/icons/ApproveIcon.svelte");
  var Oa = er(
    fr(
      '<svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4 12.9L7.14286 16.5L15 7.5" opacity="0.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M20.0002 7.5625L11.4286 16.5625L11.0002 16" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg>'
    ),
    Pa[F],
    [
      [
        6,
        0,
        [
          [7, 4],
          [8, 4],
          [
            9,
            4,
            [
              [10, 8],
              [12, 8],
            ],
          ],
        ],
      ],
    ]
  );
  function Pa(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "23px"),
      n = Tn(t, "height", 8, "23px"),
      i = Tn(t, "fill", 8, "var(--yt-spec-text-secondary)");
    var o = Oa(),
      s = Ne(Pe(o), 2),
      a = Pe(s),
      l = Ne(a);
    return (
      ze(() => {
        Xr(o, "height", n()),
          Xr(o, "width", r()),
          Xr(a, "stroke", i()),
          Xr(l, "stroke", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Pa), W(), (Na[F] = "src/lib/icons/DownloadSummaryIcon.svelte");
  var Ma = er(
    fr(
      '<svg class="download-icon svelte-18viq0l" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier" class="svelte-18viq0l"><path opacity="0.5" d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-18viq0l"></path><path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-18viq0l"></path></g></svg>'
    ),
    Na[F],
    [
      [
        11,
        0,
        [
          [12, 4],
          [13, 4],
          [
            14,
            4,
            [
              [15, 8],
              [16, 8],
            ],
          ],
        ],
      ],
    ]
  );
  function Na(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "23px"),
      n = Tn(t, "height", 8, "23px"),
      i = Tn(t, "fill", 8, "var(--yt-spec-text-secondary)");
    var o = Ma(),
      s = Ne(Pe(o), 2),
      a = Pe(s),
      l = Ne(a);
    return (
      ze(() => {
        Xr(o, "height", n()),
          Xr(o, "width", r()),
          Xr(a, "stroke", i()),
          Xr(l, "stroke", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Na), W(), (_a[F] = "src/lib/icons/DownloadPdfIcon.svelte");
  var Ia = er(
    fr(
      '<svg fill="none" height="45" viewBox="0 0 46 45" width="46" xmlns="http://www.w3.org/2000/svg"><path d="M28.625 14.9998H40.8875C40.2329 13.2652 39.2159 11.6902 37.9044 10.3798L31.3719 3.84355C30.06 2.53355 28.4845 1.51727 26.75 0.862305V13.1248C26.75 14.1602 27.5894 14.9998 28.625 14.9998Z" fill="#EF9797"></path><path d="M41.7049 18.75H28.625C25.5184 18.75 23 16.2316 23 13.125V0.045C22.6981 0.0243457 22.3962 0 22.0906 0H13.6249C8.44985 0.00624023 4.25615 4.19994 4.25 9.37503V35.6251C4.25615 40.8001 8.44985 44.9938 13.6249 45H32.3749C37.55 44.9938 41.7437 40.8001 41.7499 35.625V19.6594C41.7499 19.3538 41.7256 19.0519 41.7049 18.75Z" fill="#EF9797"></path><path d="M12.5742 33.5V25.6783H15.5074C16.1083 25.6783 16.6124 25.7903 17.0198 26.0144C17.4297 26.2384 17.7391 26.5465 17.9478 26.9386C18.1592 27.3282 18.2648 27.7712 18.2648 28.2677C18.2648 28.7693 18.1592 29.2149 17.9478 29.6044C17.7365 29.994 17.4246 30.3008 17.0121 30.5248C16.5997 30.7464 16.0917 30.8571 15.4883 30.8571H13.5443V29.6923H15.2973C15.6487 29.6923 15.9364 29.6311 16.1604 29.5089C16.3845 29.3867 16.55 29.2187 16.6569 29.0048C16.7664 28.7909 16.8212 28.5452 16.8212 28.2677C16.8212 27.9902 16.7664 27.7457 16.6569 27.5344C16.55 27.3231 16.3832 27.1588 16.1566 27.0417C15.9326 26.9221 15.6436 26.8622 15.2897 26.8622H13.9911V33.5H12.5742ZM22.1461 33.5H19.4956V25.6783H22.1996C22.9761 25.6783 23.6432 25.8349 24.2008 26.148C24.761 26.4587 25.1913 26.9055 25.4917 27.4886C25.7922 28.0716 25.9424 28.7693 25.9424 29.5815C25.9424 30.3963 25.7909 31.0964 25.4879 31.6821C25.1875 32.2677 24.7533 32.7171 24.1856 33.0302C23.6203 33.3434 22.9405 33.5 22.1461 33.5ZM20.9125 32.274H22.0774C22.6222 32.274 23.0767 32.1747 23.4408 31.9761C23.8049 31.775 24.0786 31.4758 24.2619 31.0786C24.4453 30.6789 24.5369 30.1798 24.5369 29.5815C24.5369 28.9832 24.4453 28.4867 24.2619 28.092C24.0786 27.6948 23.8075 27.3982 23.4484 27.2021C23.092 27.0035 22.649 26.9042 22.1194 26.9042H20.9125V32.274ZM27.2887 33.5V25.6783H32.2995V26.866H28.7056V28.9895H31.9557V30.1773H28.7056V33.5H27.2887Z" fill="white"></path></svg>'
    ),
    _a[F],
    [
      [
        1,
        0,
        [
          [2, 4],
          [4, 4],
          [6, 4],
        ],
      ],
    ]
  );
  function _a(e, t) {
    return kr(new.target), ae(t, !1), vr(e, Ia()), le({ ...Er() });
  }
  K(_a), W(), (Da[F] = "src/lib/icons/DownloadTxtIcon.svelte");
  var La = er(
    fr(
      '<svg fill="none" height="45" viewBox="0 0 46 45" width="46" xmlns="http://www.w3.org/2000/svg"><path d="M28.625 14.9998H40.8875C40.2329 13.2652 39.2159 11.6902 37.9044 10.3798L31.3719 3.84355C30.06 2.53355 28.4845 1.51727 26.75 0.862305V13.1248C26.75 14.1602 27.5894 14.9998 28.625 14.9998Z" fill="#F4CC66"></path><path d="M41.7049 18.75H28.625C25.5184 18.75 23 16.2316 23 13.125V0.045C22.6981 0.0243457 22.3962 0 22.0906 0H13.6249C8.44985 0.00624023 4.25615 4.19994 4.25 9.37503V35.6251C4.25615 40.8001 8.44985 44.9938 13.6249 45H32.3749C37.55 44.9938 41.7437 40.8001 41.7499 35.625V19.6594C41.7499 19.3538 41.7256 19.0519 41.7049 18.75Z" fill="#F4CC66"></path><path d="M12.2305 26.866V25.6783H18.4711V26.866H16.0535V33.5H14.648V26.866H12.2305ZM20.8581 25.6783L22.5805 28.5427H22.6416L24.3717 25.6783H25.9873L23.5773 29.5891L26.0255 33.5H24.3832L22.6416 30.6547H22.5805L20.839 33.5H19.2044L21.6754 29.5891L19.2349 25.6783H20.8581ZM26.7559 26.866V25.6783H32.9965V26.866H30.5789V33.5H29.1734V26.866H26.7559Z" fill="white"></path></svg>'
    ),
    Da[F],
    [
      [
        1,
        0,
        [
          [2, 4],
          [4, 4],
          [6, 4],
        ],
      ],
    ]
  );
  function Da(e, t) {
    return kr(new.target), ae(t, !1), vr(e, La()), le({ ...Er() });
  }
  K(Da), W(), ($a[F] = "src/lib/icons/DownloadWordIcon.svelte");
  var Ra = er(
    fr(
      '<svg fill="none" height="45" viewBox="0 0 46 45" width="46" xmlns="http://www.w3.org/2000/svg"><path d="M28.625 14.9998H40.8875C40.2329 13.2652 39.2159 11.6902 37.9044 10.3798L31.3719 3.84355C30.06 2.53355 28.4845 1.51727 26.75 0.862305V13.1248C26.75 14.1602 27.5894 14.9998 28.625 14.9998Z" fill="#86A5F7"></path><path d="M41.7049 18.75H28.625C25.5184 18.75 23 16.2316 23 13.125V0.045C22.6981 0.0243457 22.3962 0 22.0906 0H13.6249C8.44985 0.00624023 4.25615 4.19994 4.25 9.37503V35.6251C4.25615 40.8001 8.44985 44.9938 13.6249 45H32.3749C37.55 44.9938 41.7437 40.8001 41.7499 35.625V19.6594C41.7499 19.3538 41.7256 19.0519 41.7049 18.75Z" fill="#86A5F7"></path><path d="M14.2247 33.5H11.5742V25.6783H14.2782C15.0548 25.6783 15.7219 25.8349 16.2795 26.148C16.8396 26.4587 17.2699 26.9055 17.5704 27.4886C17.8708 28.0716 18.021 28.7693 18.021 29.5815C18.021 30.3963 17.8695 31.0964 17.5665 31.6821C17.2661 32.2677 16.832 32.7171 16.2642 33.0302C15.699 33.3434 15.0191 33.5 14.2247 33.5ZM12.9911 32.274H14.156C14.7009 32.274 15.1554 32.1747 15.5195 31.9761C15.8836 31.775 16.1573 31.4758 16.3406 31.0786C16.5239 30.6789 16.6156 30.1798 16.6156 29.5815C16.6156 28.9832 16.5239 28.4867 16.3406 28.092C16.1573 27.6948 15.8861 27.3982 15.5271 27.2021C15.1706 27.0035 14.7276 26.9042 14.198 26.9042H12.9911V32.274ZM26.3564 29.5891C26.3564 30.4319 26.1986 31.1537 25.8829 31.7546C25.5697 32.353 25.1419 32.8113 24.5996 33.1295C24.0598 33.4478 23.4475 33.6069 22.7626 33.6069C22.0777 33.6069 21.464 33.4478 20.9217 33.1295C20.3819 32.8087 19.9542 32.3491 19.6385 31.7508C19.3253 31.1499 19.1687 30.4294 19.1687 29.5891C19.1687 28.7464 19.3253 28.0258 19.6385 27.4275C19.9542 26.8266 20.3819 26.367 20.9217 26.0487C21.464 25.7305 22.0777 25.5713 22.7626 25.5713C23.4475 25.5713 24.0598 25.7305 24.5996 26.0487C25.1419 26.367 25.5697 26.8266 25.8829 27.4275C26.1986 28.0258 26.3564 28.7464 26.3564 29.5891ZM24.9319 29.5891C24.9319 28.9959 24.839 28.4956 24.6531 28.0882C24.4698 27.6783 24.2151 27.3689 23.8892 27.1601C23.5633 26.9488 23.1878 26.8431 22.7626 26.8431C22.3374 26.8431 21.9618 26.9488 21.6359 27.1601C21.31 27.3689 21.0541 27.6783 20.8683 28.0882C20.6849 28.4956 20.5933 28.9959 20.5933 29.5891C20.5933 30.1824 20.6849 30.684 20.8683 31.0939C21.0541 31.5013 21.31 31.8106 21.6359 32.022C21.9618 32.2308 22.3374 32.3351 22.7626 32.3351C23.1878 32.3351 23.5633 32.2308 23.8892 32.022C24.2151 31.8106 24.4698 31.5013 24.6531 31.0939C24.839 30.684 24.9319 30.1824 24.9319 29.5891ZM34.3911 28.3173H32.9627C32.922 28.0831 32.8469 27.8756 32.7374 27.6948C32.6279 27.5115 32.4917 27.3562 32.3287 27.2289C32.1658 27.1016 31.9799 27.0061 31.7711 26.9424C31.5649 26.8762 31.3421 26.8431 31.1028 26.8431C30.6776 26.8431 30.3007 26.9501 29.9723 27.1639C29.6438 27.3753 29.3867 27.6859 29.2008 28.0958C29.0149 28.5032 28.922 29.001 28.922 29.5891C28.922 30.1875 29.0149 30.6916 29.2008 31.1015C29.3892 31.5089 29.6464 31.817 29.9723 32.0258C30.3007 32.232 30.6763 32.3351 31.0989 32.3351C31.3332 32.3351 31.5522 32.3046 31.7559 32.2435C31.9621 32.1798 32.1467 32.0869 32.3096 31.9647C32.4751 31.8425 32.6139 31.6922 32.7259 31.514C32.8405 31.3358 32.9194 31.1321 32.9627 30.9029L34.3911 30.9106C34.3376 31.2823 34.2218 31.6311 34.0436 31.957C33.8679 32.2829 33.6374 32.5707 33.3523 32.8202C33.0671 33.0672 32.7336 33.2607 32.3516 33.4007C31.9697 33.5382 31.5458 33.6069 31.0799 33.6069C30.3924 33.6069 29.7788 33.4478 29.239 33.1295C28.6992 32.8113 28.274 32.3517 27.9634 31.7508C27.6528 31.1499 27.4974 30.4294 27.4974 29.5891C27.4974 28.7464 27.654 28.0258 27.9672 27.4275C28.2804 26.8266 28.7069 26.367 29.2466 26.0487C29.7864 25.7305 30.3975 25.5713 31.0799 25.5713C31.5152 25.5713 31.9201 25.6324 32.2944 25.7547C32.6686 25.8769 33.0022 26.0564 33.295 26.2932C33.5878 26.5274 33.8284 26.8151 34.0168 27.1563C34.2078 27.4949 34.3325 27.8819 34.3911 28.3173Z" fill="white"></path></svg>'
    ),
    $a[F],
    [
      [
        1,
        0,
        [
          [2, 4],
          [4, 4],
          [6, 4],
        ],
      ],
    ]
  );
  function $a(e, t) {
    return kr(new.target), ae(t, !1), vr(e, Ra()), le({ ...Er() });
  }
  K($a);
  const Fa = ["string", "number", "bigint", "boolean"];
  function Ba(e) {
    return (
      null == e ||
      !!Fa.includes(typeof e) ||
      (Array.isArray(e)
        ? e.every((e) => Ba(e))
        : "object" == typeof e && Object.getPrototypeOf(e) === Object.prototype)
    );
  }
  const qa = Symbol("box"),
    ja = Symbol("is-writable");
  function Ha(e) {
    let t = me(de(e));
    return {
      [qa]: !0,
      [ja]: !0,
      get current() {
        return Ht(t);
      },
      set current(e) {
        ye(t, e, !0);
      },
    };
  }
  function Va(...e) {
    return function (t) {
      for (const r of e)
        if (r) {
          if (t.defaultPrevented) return;
          "function" == typeof r ? r.call(this, t) : r.current?.call(this, t);
        }
    };
  }
  (Ha.from = function (e) {
    return Ha.isBox(e)
      ? e
      : (function (e) {
          return "function" == typeof e;
        })(e)
      ? Ha.with(e)
      : Ha(e);
  }),
    (Ha.with = function (e, t) {
      const r = _e(e);
      return t
        ? {
            [qa]: !0,
            [ja]: !0,
            get current() {
              return Ht(r);
            },
            set current(e) {
              t(e);
            },
          }
        : {
            [qa]: !0,
            get current() {
              return e();
            },
          };
    }),
    (Ha.flatten = function (e) {
      return Object.entries(e).reduce(
        (e, [t, r]) =>
          Ha.isBox(r)
            ? (Ha.isWritableBox(r)
                ? Object.defineProperty(e, t, {
                    get: () => r.current,
                    set(e) {
                      r.current = e;
                    },
                  })
                : Object.defineProperty(e, t, { get: () => r.current }),
              e)
            : Object.assign(e, { [t]: r }),
        {}
      );
    }),
    (Ha.readonly = function (e) {
      return Ha.isWritableBox(e)
        ? {
            [qa]: !0,
            get current() {
              return e.current;
            },
          }
        : e;
    }),
    (Ha.isBox = function (e) {
      return (
        (function (e) {
          return null !== e && "object" == typeof e;
        })(e) && qa in e
      );
    }),
    (Ha.isWritableBox = function (e) {
      return Ha.isBox(e) && ja in e;
    });
  var Ua,
    za,
    Ga,
    Wa = {};
  var Ka = (function () {
      if (Ga) return Wa;
      Ga = 1;
      var e =
        (Wa && Wa.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(Wa, "__esModule", { value: !0 }),
        (Wa.default = function (e, r) {
          var n = null;
          if (!e || "string" != typeof e) return n;
          var i = (0, t.default)(e),
            o = "function" == typeof r;
          return (
            i.forEach(function (e) {
              if ("declaration" === e.type) {
                var t = e.property,
                  i = e.value;
                o ? r(t, i, e) : i && ((n = n || {})[t] = i);
              }
            }),
            n
          );
        });
      var t = e(
        (function () {
          if (za) return Ua;
          za = 1;
          var e = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,
            t = /\n/g,
            r = /^\s*/,
            n = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,
            i = /^:\s*/,
            o = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,
            s = /^[;\s]*/,
            a = /^\s+|\s+$/g,
            l = "";
          function c(e) {
            return e ? e.replace(a, l) : l;
          }
          return (
            (Ua = function (a, u) {
              if ("string" != typeof a)
                throw new TypeError("First argument must be a string");
              if (!a) return [];
              u = u || {};
              var d = 1,
                p = 1;
              function h(e) {
                var r = e.match(t);
                r && (d += r.length);
                var n = e.lastIndexOf("\n");
                p = ~n ? e.length - n : p + e.length;
              }
              function f() {
                var e = { line: d, column: p };
                return function (t) {
                  return (t.position = new g(e)), y(), t;
                };
              }
              function g(e) {
                (this.start = e),
                  (this.end = { line: d, column: p }),
                  (this.source = u.source);
              }
              function m(e) {
                var t = new Error(u.source + ":" + d + ":" + p + ": " + e);
                if (
                  ((t.reason = e),
                  (t.filename = u.source),
                  (t.line = d),
                  (t.column = p),
                  (t.source = a),
                  !u.silent)
                )
                  throw t;
              }
              function v(e) {
                var t = e.exec(a);
                if (t) {
                  var r = t[0];
                  return h(r), (a = a.slice(r.length)), t;
                }
              }
              function y() {
                v(r);
              }
              function b(e) {
                var t;
                for (e = e || []; (t = w()); ) !1 !== t && e.push(t);
                return e;
              }
              function w() {
                var e = f();
                if ("/" == a.charAt(0) && "*" == a.charAt(1)) {
                  for (
                    var t = 2;
                    l != a.charAt(t) &&
                    ("*" != a.charAt(t) || "/" != a.charAt(t + 1));

                  )
                    ++t;
                  if (((t += 2), l === a.charAt(t - 1)))
                    return m("End of comment missing");
                  var r = a.slice(2, t - 2);
                  return (
                    (p += 2),
                    h(r),
                    (a = a.slice(t)),
                    (p += 2),
                    e({ type: "comment", comment: r })
                  );
                }
              }
              function x() {
                var t = f(),
                  r = v(n);
                if (r) {
                  if ((w(), !v(i))) return m("property missing ':'");
                  var a = v(o),
                    u = t({
                      type: "declaration",
                      property: c(r[0].replace(e, l)),
                      value: a ? c(a[0].replace(e, l)) : l,
                    });
                  return v(s), u;
                }
              }
              return (
                (g.prototype.content = a),
                y(),
                (function () {
                  var e,
                    t = [];
                  for (b(t); (e = x()); ) !1 !== e && (t.push(e), b(t));
                  return t;
                })()
              );
            }),
            Ua
          );
        })()
      );
      return Wa;
    })(),
    Za = ci(Ka),
    Xa = Za.default || Za;
  const Ya = /\d/,
    Qa = ["-", "_", "/", "."];
  function Ja(e = "") {
    if (!Ya.test(e)) return e !== e.toLowerCase();
  }
  function el(e) {
    return e
      ? (function (e) {
          const t = [];
          let r,
            n,
            i = "";
          for (const o of e) {
            const e = Qa.includes(o);
            if (!0 === e) {
              t.push(i), (i = ""), (r = void 0);
              continue;
            }
            const s = Ja(o);
            if (!1 === n) {
              if (!1 === r && !0 === s) {
                t.push(i), (i = o), (r = s);
                continue;
              }
              if (!0 === r && !1 === s && i.length > 1) {
                const e = i.at(-1);
                t.push(i.slice(0, Math.max(0, i.length - 1))),
                  (i = e + o),
                  (r = s);
                continue;
              }
            }
            (i += o), (r = s), (n = e);
          }
          return t.push(i), t;
        })(e)
          .map((e) =>
            (function (e) {
              return e ? e[0].toUpperCase() + e.slice(1) : "";
            })(e)
          )
          .join("")
      : "";
  }
  function tl(e) {
    if (!e) return {};
    const t = {};
    return (
      Xa(e, function (e, r) {
        var n;
        e.startsWith("-moz-") ||
        e.startsWith("-webkit-") ||
        e.startsWith("-ms-") ||
        e.startsWith("-o-")
          ? (t[el(e)] = r)
          : e.startsWith("--")
          ? (t[e] = r)
          : (t[
              ((n = e),
              (function (e) {
                return e ? e[0].toLowerCase() + e.slice(1) : "";
              })(el(n || "")))
            ] = r);
      }),
      t
    );
  }
  function rl(...e) {
    return (...t) => {
      for (const r of e) "function" == typeof r && r(...t);
    };
  }
  const nl = (function (e, t) {
    const r = RegExp(e, "g");
    return (e) => {
      if ("string" != typeof e)
        throw new TypeError(
          "expected an argument of type string, but got " + typeof e
        );
      return e.match(r) ? e.replace(r, t) : e;
    };
  })(/[A-Z]/, (e) => `-${e.toLowerCase()}`);
  function il(e = {}) {
    return (function (e) {
      if (!e || "object" != typeof e || Array.isArray(e))
        throw new TypeError(
          "expected an argument of type object, but got " + typeof e
        );
      return Object.keys(e)
        .map((t) => `${nl(t)}: ${e[t]};`)
        .join("\n");
    })(e).replace("\n", " ");
  }
  function ol(e) {
    return e.length > 2 && e.startsWith("on") && e[2] === e[2]?.toLowerCase();
  }
  function sl(...e) {
    const t = { ...e[0] };
    for (let r = 1; r < e.length; r++) {
      const n = e[r];
      for (const e in n) {
        const r = t[e],
          i = n[e],
          o = "function" == typeof r,
          s = "function" == typeof i;
        if (o && ol(e)) {
          const n = r,
            o = i;
          t[e] = Va(n, o);
        } else if (o && s) t[e] = rl(r, i);
        else if ("class" === e) {
          const n = Ba(r),
            o = Ba(i);
          n && o ? (t[e] = Fr(r, i)) : n ? (t[e] = Fr(r)) : o && (t[e] = Fr(i));
        } else if ("style" === e) {
          const n = "object" == typeof r,
            o = "object" == typeof i,
            s = "string" == typeof r,
            a = "string" == typeof i;
          if (n && o) t[e] = { ...r, ...i };
          else if (n && a) {
            const n = tl(i);
            t[e] = { ...r, ...n };
          } else if (s && o) {
            const n = tl(r);
            t[e] = { ...n, ...i };
          } else if (s && a) {
            const n = tl(r),
              o = tl(i);
            t[e] = { ...n, ...o };
          } else
            n ? (t[e] = r) : o ? (t[e] = i) : s ? (t[e] = r) : a && (t[e] = i);
        } else t[e] = void 0 !== i ? i : r;
      }
    }
    return (
      "object" == typeof t.style &&
        (t.style = il(t.style).replaceAll("\n", " ")),
      !0 !== t.hidden && ((t.hidden = void 0), delete t.hidden),
      !0 !== t.disabled && ((t.disabled = void 0), delete t.disabled),
      t
    );
  }
  il({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: "0",
    transform: "translateX(-100%)",
  });
  const al = "undefined" != typeof window ? window : void 0;
  function ll(e) {
    ye(e, e.v + 1);
  }
  class cl extends Map {
    #e = new Map();
    #t = ge(0);
    #r = ge(0);
    constructor(e) {
      if ((super(), e)) {
        for (var [t, r] of e) super.set(t, r);
        this.#r.v = super.size;
      }
    }
    has(e) {
      var t = this.#e,
        r = t.get(e);
      if (void 0 === r) {
        if (void 0 === super.get(e)) return Ht(this.#t), !1;
        (r = ge(0)), t.set(e, r);
      }
      return Ht(r), !0;
    }
    forEach(e, t) {
      this.#n(), super.forEach(e, t);
    }
    get(e) {
      var t = this.#e,
        r = t.get(e);
      if (void 0 === r) {
        if (void 0 === super.get(e)) return void Ht(this.#t);
        (r = ge(0)), t.set(e, r);
      }
      return Ht(r), super.get(e);
    }
    set(e, t) {
      var r = this.#e,
        n = r.get(e),
        i = super.get(e),
        o = super.set(e, t),
        s = this.#t;
      if (void 0 === n) r.set(e, ge(0)), ye(this.#r, super.size), ll(s);
      else if (i !== t) {
        ll(n);
        var a = null === s.reactions ? null : new Set(s.reactions),
          l = null === a || !n.reactions?.every((e) => a.has(e));
        l && ll(s);
      }
      return o;
    }
    delete(e) {
      var t = this.#e,
        r = t.get(e),
        n = super.delete(e);
      return (
        void 0 !== r &&
          (t.delete(e), ye(this.#r, super.size), ye(r, -1), ll(this.#t)),
        n
      );
    }
    clear() {
      if (0 !== super.size) {
        super.clear();
        var e = this.#e;
        for (var t of (ye(this.#r, 0), e.values())) ye(t, -1);
        ll(this.#t), e.clear();
      }
    }
    #n() {
      Ht(this.#t);
      var e = this.#e;
      if (this.#r.v !== e.size)
        for (var t of super.keys()) e.has(t) || e.set(t, ge(0));
      for (var [, r] of this.#e) Ht(r);
    }
    keys() {
      return Ht(this.#t), super.keys();
    }
    values() {
      return this.#n(), super.values();
    }
    entries() {
      return this.#n(), super.entries();
    }
    [Symbol.iterator]() {
      return this.entries();
    }
    get size() {
      return Ht(this.#r), super.size;
    }
  }
  function ul(e) {
    let t,
      r = 0,
      n = ge(0);
    return () => {
      null === gt ||
        mt ||
        (Ht(n),
        Ue(
          () => (
            0 === r && (t = Vt(() => e(() => ll(n)))),
            (r += 1),
            () => {
              jt().then(() => {
                (r -= 1), 0 === r && (t?.(), (t = void 0));
              });
            }
          )
        ));
    };
  }
  function dl(e, t, r, n = {}) {
    const { lazy: i = !1 } = n;
    let o = !i,
      s = Array.isArray(e) ? [] : void 0;
    !(function (e, t) {
      switch (e) {
        case "post":
          qe(t);
          break;
        case "pre":
          je(t);
      }
    })(t, () => {
      const t = Array.isArray(e) ? e.map((e) => e()) : e();
      if (!o) return (o = !0), void (s = t);
      const n = Vt(() => r(t, s));
      return (s = t), n;
    });
  }
  function pl(e, t, r) {
    dl(e, "post", t, r);
  }
  new (class {
    #i;
    #o;
    constructor(e = {}) {
      const { window: t = al, document: r = t?.document } = e;
      xe(t, void 0) ||
        ((this.#i = r),
        (this.#o = ul((e) => {
          const r = lr(t, "focusin", e),
            n = lr(t, "focusout", e);
          return () => {
            r(), n();
          };
        })));
    }
    get current() {
      return (
        this.#o?.(),
        this.#i
          ? (function (e) {
              let t = e.activeElement;
              for (; t?.shadowRoot; ) {
                const e = t.shadowRoot.activeElement;
                if (e === t) break;
                t = e;
              }
              return t;
            })(this.#i)
          : null
      );
    }
  })(),
    (pl.pre = function (e, t, r) {
      dl(e, "pre", t, r);
    });
  class hl {
    #r = me(de({ width: 0, height: 0 }));
    constructor(e, t = { box: "border-box" }) {
      const r = t.window ?? al;
      ye(
        this.#r,
        {
          width: t.initialSize?.width ?? 0,
          height: t.initialSize?.height ?? 0,
        },
        !0
      ),
        qe(() => {
          if (!r) return;
          const n = (function (e) {
            return "function" == typeof e;
          })((i = e))
            ? i()
            : i;
          var i;
          if (!n) return;
          const o = new r.ResizeObserver((e) => {
            for (const r of e) {
              const e = xe(t.box, "content-box")
                  ? r.contentBoxSize
                  : r.borderBoxSize,
                n = Array.isArray(e) ? e : [e];
              (Ht(this.#r).width = n.reduce(
                (e, t) => Math.max(e, t.inlineSize),
                0
              )),
                (Ht(this.#r).height = n.reduce(
                  (e, t) => Math.max(e, t.blockSize),
                  0
                ));
            }
          });
          return (
            o.observe(n),
            () => {
              o.disconnect();
            }
          );
        });
    }
    get current() {
      return Ht(this.#r);
    }
    get width() {
      return Ht(this.#r).width;
    }
    get height() {
      return Ht(this.#r).height;
    }
  }
  class fl {
    #s = me(void 0);
    #a;
    constructor(e) {
      qe(() => {
        ye(this.#s, this.#a, !0), (this.#a = e());
      });
    }
    get current() {
      return Ht(this.#s);
    }
  }
  class gl {
    #l;
    #c;
    constructor(e) {
      (this.#l = e), (this.#c = Symbol(e));
    }
    get key() {
      return this.#c;
    }
    exists() {
      return (e = this.#c), ue().has(e);
      var e;
    }
    get() {
      const e = se(this.#c);
      if (void 0 === e) throw new Error(`Context "${this.#l}" not found`);
      return e;
    }
    getOr(e) {
      const t = se(this.#c);
      return void 0 === t ? e : t;
    }
    set(e) {
      return (function (e, t) {
        return ue().set(e, t), t;
      })(this.#c, e);
    }
  }
  function ml(e) {
    qe(() => () => {
      e();
    });
  }
  function vl({
    id: e,
    ref: t,
    deps: r = () => !0,
    onRefChange: n,
    getRootNode: i,
  }) {
    pl([() => e.current, r], ([e]) => {
      const r = i?.() ?? document,
        o = r?.getElementById(e);
      (t.current = o || null), n?.(t.current);
    }),
      ml(() => {
        (t.current = null), n?.(null);
      });
  }
  function yl(e, t) {
    return setTimeout(t, e);
  }
  function bl(e) {
    jt().then(e);
  }
  function wl(e) {
    qe(() => Vt(() => e()));
  }
  function xl(e) {
    return e ? "open" : "closed";
  }
  function Cl(e) {
    return e ? "true" : "false";
  }
  function Sl(e) {
    return e ? "" : void 0;
  }
  const kl = "ArrowDown",
    El = "ArrowLeft",
    Tl = "ArrowRight",
    Al = "ArrowUp",
    Ol = "End",
    Pl = "Enter",
    Ml = "Home",
    Nl = " ";
  function Il(e = "ltr", t = "horizontal") {
    return { horizontal: "rtl" === e ? El : Tl, vertical: kl }[t];
  }
  function _l(e = "ltr", t = "horizontal") {
    return { horizontal: "rtl" === e ? Tl : El, vertical: Al }[t];
  }
  const Ll = "undefined" != typeof document,
    Dl =
      Ll &&
      window?.navigator?.userAgent &&
      (/iP(ad|hone|od)/.test(window.navigator.userAgent) ||
        (window?.navigator?.maxTouchPoints > 2 &&
          /iPad|Macintosh/.test(window?.navigator.userAgent)));
  function Rl(e) {
    return e instanceof HTMLElement;
  }
  function $l(e) {
    return e instanceof Element;
  }
  function Fl(e) {
    return null !== e;
  }
  function Bl(e, t) {
    if ("hidden" === getComputedStyle(e).visibility) return !0;
    for (; e; ) {
      if (void 0 !== t && e === t) return !1;
      if ("none" === getComputedStyle(e).display) return !0;
      e = e.parentElement;
    }
    return !1;
  }
  function ql(e) {
    const t = Ha(null);
    function r() {
      if (!Ll) return [];
      const t = document.getElementById(e.rootNodeId.current);
      if (!t) return [];
      if (e.candidateSelector) {
        return Array.from(t.querySelectorAll(e.candidateSelector));
      }
      return Array.from(
        t.querySelectorAll(`[${e.candidateAttr}]:not([data-disabled])`)
      );
    }
    return {
      setCurrentTabStopId(e) {
        t.current = e;
      },
      getTabIndex: function (e) {
        const n = r(),
          i = xe(t.current, null, !1);
        return e && !i && xe(n[0], e)
          ? ((t.current = e.id), 0)
          : xe(e?.id, t.current)
          ? 0
          : -1;
      },
      handleKeydown: function (n, i, o = !1) {
        const s = document.getElementById(e.rootNodeId.current);
        if (!s || !n) return;
        const a = r();
        if (!a.length) return;
        const l = a.indexOf(n),
          c =
            ((u = s), window.getComputedStyle(u).getPropertyValue("direction"));
        var u;
        const { nextKey: d, prevKey: p } = (function (
            e = "ltr",
            t = "horizontal"
          ) {
            return (
              ["ltr", "rtl"].includes(e) || (e = "ltr"),
              ["horizontal", "vertical"].includes(t) || (t = "horizontal"),
              { nextKey: Il(e, t), prevKey: _l(e, t) }
            );
          })(c, e.orientation.current),
          h = e.loop.current,
          f = { [d]: l + 1, [p]: l - 1, [Ml]: 0, [Ol]: a.length - 1 };
        if (o) {
          const e = xe(d, kl) ? Tl : kl,
            t = xe(p, Al) ? El : Al;
          (f[e] = l + 1), (f[t] = l - 1);
        }
        let g = f[i.key];
        if (xe(g, void 0)) return;
        i.preventDefault(),
          g < 0 && h ? (g = a.length - 1) : xe(g, a.length) && h && (g = 0);
        const m = a[g];
        return m
          ? (m.focus(), (t.current = m.id), e.onCandidateFocus?.(m), m)
          : void 0;
      },
      focusFirstCandidate: function () {
        const e = r();
        e.length && e[0]?.focus();
      },
      currentTabStopId: t,
    };
  }
  function jl(e = "bits") {
    return (
      globalThis.bitsIdCounter.current++,
      `${e}-${globalThis.bitsIdCounter.current}`
    );
  }
  function Hl() {}
  function Vl(e, t) {
    const r = Ha(e);
    return {
      state: r,
      dispatch: (e) => {
        r.current = (function (e) {
          return t[r.current][e] ?? r.current;
        })(e);
      },
    };
  }
  function Ul(e) {
    return (e && getComputedStyle(e).animationName) || "none";
  }
  function zl(e, t) {
    kr(new.target), ae(t, !0);
    const r = (function (e, t) {
      let r = me(de({})),
        n = me("none");
      const i = e.current ? "mounted" : "unmounted";
      let o = me(null);
      const s = new fl(() => e.current);
      pl([() => t.current, () => e.current], ([e, t]) => {
        e &&
          t &&
          bl(() => {
            ye(o, document.getElementById(e), !0);
          });
      });
      const { state: a, dispatch: l } = Vl(i, {
        mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
        unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
        unmounted: { MOUNT: "mounted" },
      });
      function c(e) {
        if ((Ht(o) || ye(o, document.getElementById(t.current), !0), !Ht(o)))
          return;
        const r = Ul(Ht(o)),
          n = r.includes(e.animationName) || xe(r, "none");
        xe(e.target, Ht(o)) && n && l("ANIMATION_END");
      }
      function u(e) {
        Ht(o) || ye(o, document.getElementById(t.current), !0),
          Ht(o) && xe(e.target, Ht(o)) && ye(n, Ul(Ht(o)), !0);
      }
      pl(
        () => e.current,
        (e) => {
          if ((Ht(o) || ye(o, document.getElementById(t.current), !0), !Ht(o)))
            return;
          if (!xe(e, s.current, !1)) return;
          const i = Ht(n),
            a = Ul(Ht(o));
          if (e) l("MOUNT");
          else if (xe(a, "none") || xe(Ht(r).display, "none")) l("UNMOUNT");
          else {
            const e = xe(i, a, !1);
            l(s && e ? "ANIMATION_OUT" : "UNMOUNT");
          }
        }
      ),
        pl(
          () => a.current,
          () => {
            if (
              (Ht(o) || ye(o, document.getElementById(t.current), !0), !Ht(o))
            )
              return;
            const e = Ul(Ht(o));
            ye(n, xe(a.current, "mounted") ? e : "none", !0);
          }
        ),
        pl(
          () => Ht(o),
          (e) => {
            if (e)
              return (
                ye(r, getComputedStyle(e), !0),
                rl(
                  lr(e, "animationstart", u),
                  lr(e, "animationcancel", c),
                  lr(e, "animationend", c)
                )
              );
          }
        );
      const d = _e(() => ["mounted", "unmountSuspended"].includes(a.current));
      return {
        get current() {
          return Ht(d);
        },
      };
    })(
      Ha.with(() => t.present),
      Ha.with(() => t.id)
    );
    var n = mr(),
      i = Me(n),
      o = (e) => {
        var n = mr();
        Lr(
          Me(n),
          () => t.presence ?? p,
          () => ({ present: r })
        ),
          vr(e, n);
      };
    return (
      Tr(i, (e) => {
        (t.forceMount || t.present || r.current) && e(o);
      }),
      vr(e, n),
      le({ ...Er() })
    );
  }
  function Gl(e, t) {
    kr(new.target), ae(t, !0);
    var r = mr();
    return (
      (function (e, t, r) {
        var n,
          i = e,
          o = $,
          s = ce() ? _ : I;
        Ge(() => {
          s(o, (o = t())) && (n && Qe(n), (n = We(() => r(i))));
        });
      })(
        Me(r),
        () => t.children,
        (e) => {
          var r = mr();
          Lr(Me(r), () => t.children ?? p), vr(e, r);
        }
      ),
      vr(e, r),
      le({ ...Er() })
    );
  }
  function Wl(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "to", 3, "body");
    const n = ue();
    let i,
      o = _e(function () {
        if (!Ll || t.disabled) return null;
        let e = null;
        xe(typeof r(), "string")
          ? ((e = document.querySelector(r())), xe(e, null))
          : (r() instanceof HTMLElement || r() instanceof DocumentFragment) &&
            (e = r());
        return e;
      });
    function s() {
      i &&
        (!(function (e, t) {
          const r = Sr.get(e);
          r ? (Sr.delete(e), r(t)) : Promise.resolve();
        })(i),
        (i = null));
    }
    pl([() => Ht(o), () => t.disabled], ([e, r]) => {
      if (e && !r)
        return (
          (i = xr(Gl, {
            target: e,
            props: { children: t.children },
            context: n,
          })),
          () => {
            s();
          }
        );
      s();
    });
    var a = mr(),
      l = Me(a),
      c = (e) => {
        var r = mr();
        Lr(Me(r), () => t.children ?? p), vr(e, r);
      };
    return (
      Tr(l, (e) => {
        t.disabled && e(c);
      }),
      vr(e, a),
      le({ ...Er() })
    );
  }
  function Kl(e, t, r, n) {
    const i = Array.isArray(t) ? t : [t];
    return (
      i.forEach((t) => e.addEventListener(t, r, n)),
      () => {
        i.forEach((t) => e.removeEventListener(t, r, n));
      }
    );
  }
  (globalThis.bitsIdCounter ??= { current: 0 }),
    W(),
    (zl[F] =
      "node_modules/bits-ui/dist/bits/utilities/presence-layer/presence-layer.svelte"),
    K(zl),
    W(),
    (Gl[F] =
      "node_modules/bits-ui/dist/bits/utilities/portal/portal-consumer.svelte"),
    K(Gl),
    W(),
    (Wl[F] = "node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte"),
    K(Wl);
  class Zl {
    eventName;
    options;
    constructor(e, t = { bubbles: !0, cancelable: !0 }) {
      (this.eventName = e), (this.options = t);
    }
    createEvent(e) {
      return new CustomEvent(this.eventName, { ...this.options, detail: e });
    }
    dispatch(e, t) {
      const r = this.createEvent(t);
      return e.dispatchEvent(r), r;
    }
    listen(e, t, r) {
      return lr(
        e,
        this.eventName,
        (e) => {
          t(e);
        },
        r
      );
    }
  }
  function Xl(e, t = 500) {
    let r = null;
    const n = (...n) => {
      null !== r && clearTimeout(r),
        (r = setTimeout(() => {
          e(...n);
        }, t));
    };
    return (
      (n.destroy = () => {
        null !== r && (clearTimeout(r), (r = null));
      }),
      n
    );
  }
  function Yl(e, t) {
    return e === t || e.contains(t);
  }
  function Ql(e) {
    return e?.ownerDocument ?? document;
  }
  function Jl(e) {
    return e?.ownerDocument ?? document;
  }
  globalThis.bitsDismissableLayers ??= new Map();
  class ec {
    opts;
    #u;
    #d;
    #p = { pointerdown: !1 };
    #h = !1;
    #f = !1;
    node = Ha(null);
    #g = void 0;
    #m;
    #v = me(null);
    get currNode() {
      return Ht(this.#v);
    }
    set currNode(e) {
      ye(this.#v, e, !0);
    }
    #y = Hl;
    constructor(e) {
      (this.opts = e),
        vl({
          id: e.id,
          ref: this.node,
          deps: () => e.enabled.current,
          onRefChange: (e) => {
            this.currNode = e;
          },
        }),
        (this.#d = e.interactOutsideBehavior),
        (this.#u = e.onInteractOutside),
        (this.#m = e.onFocusOutside),
        qe(() => {
          this.#g = Ql(this.currNode);
        });
      let t = Hl;
      const r = () => {
        this.#b(),
          globalThis.bitsDismissableLayers.delete(this),
          this.#w.destroy(),
          t();
      };
      pl([() => this.opts.enabled.current, () => this.currNode], ([e, n]) => {
        if (e && n)
          return (
            yl(1, () => {
              this.currNode &&
                (globalThis.bitsDismissableLayers.set(this, this.#d),
                t(),
                (t = this.#x()));
            }),
            r
          );
      }),
        ml(() => {
          this.#b.destroy(),
            globalThis.bitsDismissableLayers.delete(this),
            this.#w.destroy(),
            this.#y(),
            t();
        });
    }
    #C = (e) => {
      e.defaultPrevented ||
        (this.currNode &&
          bl(() => {
            this.currNode &&
              !this.#S(e.target) &&
              e.target &&
              !this.#f &&
              this.#m.current?.(e);
          }));
    };
    #x() {
      return rl(
        lr(this.#g, "pointerdown", rl(this.#k, this.#E), { capture: !0 }),
        lr(this.#g, "pointerdown", rl(this.#T, this.#w)),
        lr(this.#g, "focusin", this.#C)
      );
    }
    #A = (e) => {
      let t = e;
      t.defaultPrevented && (t = tc(e)), this.#u.current(e);
    };
    #w = Xl((e) => {
      if (!this.currNode) return void this.#y();
      const t =
        this.opts.isValidEvent.current(e, this.currNode) ||
        (function (e, t) {
          if ("button" in e && e.button > 0) return !1;
          const r = e.target;
          if (!$l(r)) return !1;
          const n =
            Ql(r).documentElement.contains(r) &&
            !Yl(t, r) &&
            (function (e, t) {
              const { clientX: r, clientY: n } = e,
                i = t.getBoundingClientRect();
              return r < i.left || r > i.right || n < i.top || n > i.bottom;
            })(e, t);
          return n;
        })(e, this.currNode);
      if (!this.#h || this.#O() || !t) return void this.#y();
      let r = e;
      r.defaultPrevented && (r = tc(r)),
        xe(this.#d.current, "close", !1) &&
        xe(this.#d.current, "defer-otherwise-close", !1)
          ? this.#y()
          : xe(e.pointerType, "touch")
          ? (this.#y(), (this.#y = Kl(this.#g, "click", this.#A, { once: !0 })))
          : this.#u.current(r);
    }, 10);
    #k = (e) => {
      this.#p[e.type] = !0;
    };
    #T = (e) => {
      this.#p[e.type] = !1;
    };
    #E = () => {
      this.node.current &&
        (this.#h = (function (e) {
          const t = [...globalThis.bitsDismissableLayers],
            r = (function (e) {
              return e.findLast(
                ([e, { current: t }]) => xe(t, "close") || xe(t, "ignore")
              );
            })(t);
          if (r) return xe(r[0].node.current, e);
          const [n] = t[0];
          return xe(n.node.current, e);
        })(this.node.current));
    };
    #S = (e) => !!this.node.current && Yl(this.node.current, e);
    #b = Xl(() => {
      for (const e in this.#p) this.#p[e] = !1;
      this.#h = !1;
    }, 20);
    #O() {
      return Object.values(this.#p).some(Boolean);
    }
    #P = () => {
      this.#f = !0;
    };
    #M = () => {
      this.#f = !1;
    };
    props = { onfocuscapture: this.#P, onblurcapture: this.#M };
    [G](e) {
      Y(this, e, [() => Ht(this.#v)]);
    }
  }
  function tc(e) {
    const t = e.currentTarget,
      r = e.target;
    let n;
    n =
      e instanceof PointerEvent
        ? new PointerEvent(e.type, e)
        : new PointerEvent("pointerdown", e);
    let i = !1;
    const o = new Proxy(n, {
      get: (n, o) =>
        xe(o, "currentTarget")
          ? t
          : xe(o, "target")
          ? r
          : xe(o, "preventDefault")
          ? () => {
              (i = !0),
                xe(typeof n.preventDefault, "function") && n.preventDefault();
            }
          : xe(o, "defaultPrevented")
          ? i
          : o in n
          ? n[o]
          : e[o],
    });
    return o;
  }
  function rc(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "interactOutsideBehavior", 3, "close"),
      n = Tn(t, "onInteractOutside", 3, Hl),
      i = Tn(t, "onFocusOutside", 3, Hl),
      o = Tn(t, "isValidEvent", 3, () => !1);
    const s =
      ((a = {
        id: Ha.with(() => t.id),
        interactOutsideBehavior: Ha.with(() => r()),
        onInteractOutside: Ha.with(() => n()),
        enabled: Ha.with(() => t.enabled),
        onFocusOutside: Ha.with(() => i()),
        isValidEvent: Ha.with(() => o()),
      }),
      new ec(a));
    var a,
      l = mr();
    return (
      Lr(
        Me(l),
        () => t.children ?? p,
        () => ({ props: s.props })
      ),
      vr(e, l),
      le({ ...Er() })
    );
  }
  W(),
    (rc[F] =
      "node_modules/bits-ui/dist/bits/utilities/dismissible-layer/dismissible-layer.svelte"),
    K(rc),
    (globalThis.bitsEscapeLayers ??= new Map());
  class nc {
    opts;
    constructor(e) {
      this.opts = e;
      let t = Hl;
      pl(
        () => e.enabled.current,
        (r) => (
          r &&
            (globalThis.bitsEscapeLayers.set(this, e.escapeKeydownBehavior),
            (t = this.#N())),
          () => {
            t(), globalThis.bitsEscapeLayers.delete(this);
          }
        )
      );
    }
    #N = () => lr(document, "keydown", this.#I, { passive: !1 });
    #I = (e) => {
      if (
        xe(e.key, "Escape", !1) ||
        !(function (e) {
          const t = [...globalThis.bitsEscapeLayers],
            r = t.findLast(
              ([e, { current: t }]) => xe(t, "close") || xe(t, "ignore")
            );
          if (r) return xe(r[0], e);
          const [n] = t[0];
          return xe(n, e);
        })(this)
      )
        return;
      const t = new KeyboardEvent(e.type, e);
      e.preventDefault();
      const r = this.opts.escapeKeydownBehavior.current;
      (xe(r, "close", !1) && xe(r, "defer-otherwise-close", !1)) ||
        this.opts.onEscapeKeydown.current(t);
    };
  }
  function ic(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "escapeKeydownBehavior", 3, "close"),
      n = Tn(t, "onEscapeKeydown", 3, Hl);
    var i;
    (i = {
      escapeKeydownBehavior: Ha.with(() => r()),
      onEscapeKeydown: Ha.with(() => n()),
      enabled: Ha.with(() => t.enabled),
    }),
      new nc(i);
    var o = mr();
    return Lr(Me(o), () => t.children ?? p), vr(e, o), le({ ...Er() });
  }
  W(),
    (ic[F] =
      "node_modules/bits-ui/dist/bits/utilities/escape-layer/escape-layer.svelte"),
    K(ic);
  const oc = Ha([]);
  function sc(e, t) {
    return [...e].filter((e) => xe(e.id, t.id, !1));
  }
  function ac(e, { select: t = !1 } = {}) {
    if (!e || !e.focus) return;
    if (document.activeElement === e) return;
    const r = document.activeElement;
    e.focus({ preventScroll: !0 }),
      e !== r &&
        (function (e) {
          return e instanceof HTMLInputElement && "select" in e;
        })(e) &&
        t &&
        e.select();
  }
  function lc(e, { select: t = !1 } = {}) {
    const r = document.activeElement;
    for (const n of e)
      if ((ac(n, { select: t }), document.activeElement !== r)) return !0;
  }
  function cc(e, t) {
    for (const r of e) if (!Bl(r, t)) return r;
  }
  function uc(e) {
    const t = [],
      r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (e) => {
          const t = "INPUT" === e.tagName && "hidden" === e.type;
          return e.disabled || e.hidden || t
            ? NodeFilter.FILTER_SKIP
            : e.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      });
    for (; r.nextNode(); ) t.push(r.currentNode);
    return t;
  }
  var dc = [
      "input:not([inert])",
      "select:not([inert])",
      "textarea:not([inert])",
      "a[href]:not([inert])",
      "button:not([inert])",
      "[tabindex]:not(slot):not([inert])",
      "audio[controls]:not([inert])",
      "video[controls]:not([inert])",
      '[contenteditable]:not([contenteditable="false"]):not([inert])',
      "details>summary:first-of-type:not([inert])",
      "details:not([inert])",
    ],
    pc = dc.join(","),
    hc = "undefined" == typeof Element,
    fc = hc
      ? function () {}
      : Element.prototype.matches ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector,
    gc =
      !hc && Element.prototype.getRootNode
        ? function (e) {
            var t;
            return null == e || null === (t = e.getRootNode) || void 0 === t
              ? void 0
              : t.call(e);
          }
        : function (e) {
            return null == e ? void 0 : e.ownerDocument;
          },
    mc = function e(t, r) {
      var n;
      void 0 === r && (r = !0);
      var i =
        null == t || null === (n = t.getAttribute) || void 0 === n
          ? void 0
          : n.call(t, "inert");
      return "" === i || "true" === i || (r && t && e(t.parentNode));
    },
    vc = function (e, t, r) {
      if (mc(e)) return [];
      var n = Array.prototype.slice.apply(e.querySelectorAll(pc));
      return t && fc.call(e, pc) && n.unshift(e), (n = n.filter(r));
    },
    yc = function e(t, r, n) {
      for (var i = [], o = Array.from(t); o.length; ) {
        var s = o.shift();
        if (!mc(s, !1))
          if ("SLOT" === s.tagName) {
            var a = s.assignedElements(),
              l = e(a.length ? a : s.children, !0, n);
            n.flatten
              ? i.push.apply(i, l)
              : i.push({ scopeParent: s, candidates: l });
          } else {
            fc.call(s, pc) && n.filter(s) && (r || !t.includes(s)) && i.push(s);
            var c =
                s.shadowRoot ||
                ("function" == typeof n.getShadowRoot && n.getShadowRoot(s)),
              u = !mc(c, !1) && (!n.shadowRootFilter || n.shadowRootFilter(s));
            if (c && u) {
              var d = e(!0 === c ? s.children : c.children, !0, n);
              n.flatten
                ? i.push.apply(i, d)
                : i.push({ scopeParent: s, candidates: d });
            } else o.unshift.apply(o, s.children);
          }
      }
      return i;
    },
    bc = function (e) {
      return !isNaN(parseInt(e.getAttribute("tabindex"), 10));
    },
    wc = function (e) {
      if (!e) throw new Error("No node provided");
      return e.tabIndex < 0 &&
        (/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) ||
          (function (e) {
            var t,
              r =
                null == e || null === (t = e.getAttribute) || void 0 === t
                  ? void 0
                  : t.call(e, "contenteditable");
            return "" === r || "true" === r;
          })(e)) &&
        !bc(e)
        ? 0
        : e.tabIndex;
    },
    xc = function (e, t) {
      return e.tabIndex === t.tabIndex
        ? e.documentOrder - t.documentOrder
        : e.tabIndex - t.tabIndex;
    },
    Cc = function (e) {
      return "INPUT" === e.tagName;
    },
    Sc = function (e) {
      return (
        (function (e) {
          return Cc(e) && "radio" === e.type;
        })(e) &&
        !(function (e) {
          if (!e.name) return !0;
          var t,
            r = e.form || gc(e),
            n = function (e) {
              return r.querySelectorAll(
                'input[type="radio"][name="' + e + '"]'
              );
            };
          if (
            "undefined" != typeof window &&
            void 0 !== window.CSS &&
            "function" == typeof window.CSS.escape
          )
            t = n(window.CSS.escape(e.name));
          else
            try {
              t = n(e.name);
            } catch (e) {
              return (
                console.error(
                  "Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",
                  e.message
                ),
                !1
              );
            }
          var i = (function (e, t) {
            for (var r = 0; r < e.length; r++)
              if (e[r].checked && e[r].form === t) return e[r];
          })(t, e.form);
          return !i || i === e;
        })(e)
      );
    },
    kc = function (e) {
      var t = e.getBoundingClientRect(),
        r = t.width,
        n = t.height;
      return 0 === r && 0 === n;
    },
    Ec = function (e, t) {
      var r = t.displayCheck,
        n = t.getShadowRoot;
      if ("hidden" === getComputedStyle(e).visibility) return !0;
      var i = fc.call(e, "details>summary:first-of-type") ? e.parentElement : e;
      if (fc.call(i, "details:not([open]) *")) return !0;
      if (r && "full" !== r && "legacy-full" !== r) {
        if ("non-zero-area" === r) return kc(e);
      } else {
        if ("function" == typeof n) {
          for (var o = e; e; ) {
            var s = e.parentElement,
              a = gc(e);
            if (s && !s.shadowRoot && !0 === n(s)) return kc(e);
            e = e.assignedSlot
              ? e.assignedSlot
              : s || a === e.ownerDocument
              ? s
              : a.host;
          }
          e = o;
        }
        if (
          (function (e) {
            var t,
              r,
              n,
              i,
              o = e && gc(e),
              s = null === (t = o) || void 0 === t ? void 0 : t.host,
              a = !1;
            if (o && o !== e)
              for (
                a = !!(
                  (null !== (r = s) &&
                    void 0 !== r &&
                    null !== (n = r.ownerDocument) &&
                    void 0 !== n &&
                    n.contains(s)) ||
                  (null != e &&
                    null !== (i = e.ownerDocument) &&
                    void 0 !== i &&
                    i.contains(e))
                );
                !a && s;

              ) {
                var l, c, u;
                a = !(
                  null ===
                    (c = s =
                      null === (l = o = gc(s)) || void 0 === l
                        ? void 0
                        : l.host) ||
                  void 0 === c ||
                  null === (u = c.ownerDocument) ||
                  void 0 === u ||
                  !u.contains(s)
                );
              }
            return a;
          })(e)
        )
          return !e.getClientRects().length;
        if ("legacy-full" !== r) return !0;
      }
      return !1;
    },
    Tc = function (e, t) {
      return !(
        t.disabled ||
        mc(t) ||
        (function (e) {
          return Cc(e) && "hidden" === e.type;
        })(t) ||
        Ec(t, e) ||
        (function (e) {
          var t =
            "DETAILS" === e.tagName &&
            Array.prototype.slice.apply(e.children).some(function (e) {
              return "SUMMARY" === e.tagName;
            });
          return t;
        })(t) ||
        (function (e) {
          if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
            for (var t = e.parentElement; t; ) {
              if ("FIELDSET" === t.tagName && t.disabled) {
                for (var r = 0; r < t.children.length; r++) {
                  var n = t.children.item(r);
                  if ("LEGEND" === n.tagName)
                    return (
                      !!fc.call(t, "fieldset[disabled] *") || !n.contains(e)
                    );
                }
                return !0;
              }
              t = t.parentElement;
            }
          return !1;
        })(t)
      );
    },
    Ac = function (e, t) {
      return !(Sc(t) || wc(t) < 0 || !Tc(e, t));
    },
    Oc = function (e) {
      var t = parseInt(e.getAttribute("tabindex"), 10);
      return !!(isNaN(t) || t >= 0);
    },
    Pc = function e(t) {
      var r = [],
        n = [];
      return (
        t.forEach(function (t, i) {
          var o = !!t.scopeParent,
            s = o ? t.scopeParent : t,
            a = (function (e, t) {
              var r = wc(e);
              return r < 0 && t && !bc(e) ? 0 : r;
            })(s, o),
            l = o ? e(t.candidates) : s;
          0 === a
            ? o
              ? r.push.apply(r, l)
              : r.push(s)
            : n.push({
                documentOrder: i,
                tabIndex: a,
                item: t,
                isScope: o,
                content: l,
              });
        }),
        n
          .sort(xc)
          .reduce(function (e, t) {
            return (
              t.isScope ? e.push.apply(e, t.content) : e.push(t.content), e
            );
          }, [])
          .concat(r)
      );
    },
    Mc = function (e, t) {
      if (((t = t || {}), !e)) throw new Error("No node provided");
      return !1 !== fc.call(e, pc) && Ac(t, e);
    },
    Nc = dc.concat("iframe").join(",");
  const Ic = new Zl("focusScope.autoFocusOnMount", {
      bubbles: !1,
      cancelable: !0,
    }),
    _c = new Zl("focusScope.autoFocusOnDestroy", {
      bubbles: !1,
      cancelable: !0,
    }),
    Lc = new gl("FocusScope");
  function Dc({
    id: e,
    loop: t,
    enabled: r,
    onOpenAutoFocus: n,
    onCloseAutoFocus: i,
    forceMount: o,
  }) {
    const s = {
        add(e) {
          const t = oc.current[0];
          t && xe(e.id, t.id, !1) && t.pause(),
            (oc.current = sc(oc.current, e)),
            oc.current.unshift(e);
        },
        remove(e) {
          (oc.current = sc(oc.current, e)), oc.current[0]?.resume();
        },
        get current() {
          return oc.current;
        },
      },
      a = (function () {
        let e = me(!1),
          t = me(!1);
        return {
          id: jl(),
          get paused() {
            return Ht(e);
          },
          get isHandlingFocus() {
            return Ht(t);
          },
          set isHandlingFocus(e) {
            ye(t, e, !0);
          },
          pause() {
            ye(e, !0);
          },
          resume() {
            ye(e, !1);
          },
        };
      })(),
      l = Ha(null),
      c = Lc.getOr({ ignoreCloseAutoFocus: !1 });
    let u = null;
    function d(e) {
      if (!a.paused && l.current && !a.isHandlingFocus) {
        a.isHandlingFocus = !0;
        try {
          const t = e.target;
          if (!Rl(t)) return;
          const r = l.current.contains(t);
          if (xe(e.type, "focusin"))
            if (r) u = t;
            else {
              if (c.ignoreCloseAutoFocus) return;
              ac(u, { select: !0 });
            }
          else
            xe(e.type, "focusout") &&
              (r || c.ignoreCloseAutoFocus || ac(u, { select: !0 }));
        } finally {
          a.isHandlingFocus = !1;
        }
      }
    }
    function p(e) {
      const t = l.current?.contains(u);
      !t && l.current && ac(l.current);
    }
    function h(t, i) {
      if ((t || (t = document.getElementById(e.current)), !t || !r.current))
        return;
      s.add(a);
      if (!t.contains(i)) {
        const e = Ic.createEvent();
        n.current(e),
          e.defaultPrevented ||
            bl(() => {
              t &&
                (lc(
                  uc(t).filter((e) => xe(e.tagName, "A", !1)),
                  { select: !0 }
                ),
                xe(document.activeElement, i) && ac(t));
            });
      }
    }
    function f(e) {
      const t = _c.createEvent();
      i.current(t);
      const r = c.ignoreCloseAutoFocus;
      yl(0, () => {
        t.defaultPrevented ||
          !e ||
          r ||
          ac(Mc(e) ? e : document.body, { select: !0 }),
          s.remove(a);
      });
    }
    function g(e) {
      if (!r.current) return;
      if (!t.current && !r.current) return;
      if (a.paused) return;
      const n = xe(e.key, "Tab") && !e.ctrlKey && !e.altKey && !e.metaKey,
        i = document.activeElement;
      if (!n || !i) return;
      const o = l.current;
      if (!o) return;
      const [s, c] = (function (e) {
        const t = uc(e);
        return [cc(t, e), cc(t.reverse(), e)];
      })(o);
      s && c
        ? !e.shiftKey && xe(i, c)
          ? (e.preventDefault(), t.current && ac(s, { select: !0 }))
          : e.shiftKey &&
            xe(i, s) &&
            (e.preventDefault(), t.current && ac(c, { select: !0 }))
        : xe(i, o) && e.preventDefault();
    }
    vl({ id: e, ref: l, deps: () => r.current }),
      pl([() => l.current, () => r.current], ([e, t]) => {
        if (!e || !t) return;
        const r = rl(lr(document, "focusin", d), lr(document, "focusout", d)),
          n = new MutationObserver(p);
        return (
          n.observe(e, { childList: !0, subtree: !0 }),
          () => {
            r(), n.disconnect();
          }
        );
      }),
      pl([() => o.current, () => l.current], ([e, t]) => {
        if (e) return;
        const r = document.activeElement;
        return (
          h(t, r),
          () => {
            t && f(r);
          }
        );
      }),
      pl([() => o.current, () => l.current, () => r.current], ([e, t]) => {
        if (!e) return;
        const r = document.activeElement;
        return (
          h(t, r),
          () => {
            t && f(r);
          }
        );
      });
    const m = _e(() => ({ id: e.current, tabindex: -1, onkeydown: g }));
    return {
      get props() {
        return Ht(m);
      },
    };
  }
  function Rc(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "trapFocus", 3, !1),
      n = Tn(t, "loop", 3, !1),
      i = Tn(t, "onCloseAutoFocus", 3, Hl),
      o = Tn(t, "onOpenAutoFocus", 3, Hl),
      s = Tn(t, "forceMount", 3, !1);
    const a = Dc({
      enabled: Ha.with(() => r()),
      loop: Ha.with(() => n()),
      onCloseAutoFocus: Ha.with(() => i()),
      onOpenAutoFocus: Ha.with(() => o()),
      id: Ha.with(() => t.id),
      forceMount: Ha.with(() => s()),
    });
    var l = mr();
    return (
      Lr(
        Me(l),
        () => t.focusScope ?? p,
        () => ({ props: a.props })
      ),
      vr(e, l),
      le({ ...Er() })
    );
  }
  W(),
    (Rc[F] =
      "node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte"),
    K(Rc),
    (globalThis.bitsTextSelectionLayers ??= new Map());
  class $c {
    opts;
    #_ = Hl;
    #L = Ha(null);
    constructor(e) {
      (this.opts = e),
        vl({ id: e.id, ref: this.#L, deps: () => this.opts.enabled.current });
      let t = Hl;
      pl(
        () => this.opts.enabled.current,
        (e) => (
          e &&
            (globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled),
            t(),
            (t = this.#x())),
          () => {
            t(), this.#D(), globalThis.bitsTextSelectionLayers.delete(this);
          }
        )
      );
    }
    #x() {
      return rl(
        lr(document, "pointerdown", this.#R),
        lr(document, "pointerup", Va(this.#D, this.opts.onPointerUp.current))
      );
    }
    #R = (e) => {
      const t = this.#L.current,
        r = e.target;
      Rl(t) &&
        Rl(r) &&
        this.opts.enabled.current &&
        (function (e) {
          const t = [...globalThis.bitsTextSelectionLayers];
          if (!t.length) return !1;
          const r = t.at(-1);
          return !!r && xe(r[0], e);
        })(this) &&
        Yl(t, r) &&
        (this.opts.onPointerDown.current(e),
        e.defaultPrevented ||
          (this.#_ = (function (e) {
            const t = document.body,
              r = Fc(t),
              n = Fc(e);
            return (
              Bc(t, "none"),
              Bc(e, "text"),
              () => {
                Bc(t, r), Bc(e, n);
              }
            );
          })(t)));
    };
    #D = () => {
      this.#_(), (this.#_ = Hl);
    };
  }
  const Fc = (e) => e.style.userSelect || e.style.webkitUserSelect;
  function Bc(e, t) {
    (e.style.userSelect = t), (e.style.webkitUserSelect = t);
  }
  function qc(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "preventOverflowTextSelection", 3, !0),
      n = Tn(t, "onPointerDown", 3, Hl),
      i = Tn(t, "onPointerUp", 3, Hl);
    var o;
    (o = {
      id: Ha.with(() => t.id),
      preventOverflowTextSelection: Ha.with(() => r()),
      onPointerDown: Ha.with(() => n()),
      onPointerUp: Ha.with(() => i()),
      enabled: Ha.with(() => t.enabled),
    }),
      new $c(o);
    var s = mr();
    return Lr(Me(s), () => t.children ?? p), vr(e, s), le({ ...Er() });
  }
  W(),
    (qc[F] =
      "node_modules/bits-ui/dist/bits/utilities/text-selection-layer/text-selection-layer.svelte"),
    K(qc);
  const jc = (function (e) {
    let t,
      r = 0,
      n = me(void 0);
    return (...i) => (
      (r += 1),
      xe(Ht(n), void 0) &&
        (t = He(() => {
          ye(n, e(...i), !0);
        })),
      qe(() => () => {
        (r -= 1), t && r <= 0 && (t(), ye(n, void 0), (t = void 0));
      }),
      Ht(n)
    );
  })(() => {
    const e = new cl(),
      t = _e(() => {
        for (const t of e.values()) if (t) return !0;
        return !1;
      });
    let r = me(null),
      n = null;
    return (
      qe(() => {
        const e = Ht(t);
        return Vt(() => {
          if (!e) return;
          ye(r, document.body.getAttribute("style"), !0);
          const t = getComputedStyle(document.body),
            i = window.innerWidth - document.documentElement.clientWidth,
            o = Number.parseInt(t.paddingRight ?? "0", 10) + i,
            s = Number.parseInt(t.marginRight ?? "0", 10);
          i > 0 &&
            ((document.body.style.paddingRight = `${o}px`),
            (document.body.style.marginRight = `${s}px`),
            document.body.style.setProperty("--scrollbar-width", `${i}px`),
            (document.body.style.overflow = "hidden")),
            Dl &&
              (n = Kl(
                document,
                "touchmove",
                (e) => {
                  xe(e.target, document.documentElement, !1) ||
                    e.touches.length > 1 ||
                    e.preventDefault();
                },
                { passive: !1 }
              )),
            bl(() => {
              (document.body.style.pointerEvents = "none"),
                (document.body.style.overflow = "hidden");
            });
        });
      }),
      qe(() => () => {
        n?.();
      }),
      {
        get map() {
          return e;
        },
        resetBodyStyle: function () {
          Ll &&
            (document.body.setAttribute("style", Ht(r) ?? ""),
            document.body.style.removeProperty("--scrollbar-width"),
            Dl && n?.());
        },
      }
    );
  });
  function Hc(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "preventScroll", 3, !0),
      n = Tn(t, "restoreScrollDelay", 3, null);
    return (
      (function (e, t = () => null) {
        const r = jl(),
          n = jc();
        if (!n) return;
        const i = _e(t);
        n.map.set(r, e ?? !1);
        const o = Ha.with(
          () => n.map.get(r) ?? !1,
          (e) => n.map.set(r, e)
        );
        qe(() => () => {
          n.map.delete(r),
            (function (e) {
              for (const [t, r] of e) if (r) return !0;
              return !1;
            })(n.map) ||
              (xe(Ht(i), null)
                ? requestAnimationFrame(() => n.resetBodyStyle())
                : yl(Ht(i), () => n.resetBodyStyle()));
        });
      })(r(), () => n()),
      le({ ...Er() })
    );
  }
  function Vc(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "disabled", 3, !1),
      n = Tn(t, "ref", 15),
      i = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "href",
        "type",
        "children",
        "disabled",
        "ref",
      ]);
    var o = mr(),
      s = Me(o);
    return (
      On(() => (t.href ? "a" : "button")),
      Pn(() => (t.href ? "a" : "button")),
      (function (e, t, r, n, i) {
        var o,
          s,
          a,
          l = null,
          c = e;
        Ge(() => {
          const e = t() || null;
          var u = i
            ? i()
            : r || "svg" === e
            ? "http://www.w3.org/2000/svg"
            : null;
          e !== o &&
            (a &&
              (null === e
                ? Qe(a, () => {
                    (a = null), (s = null);
                  })
                : e === s
                ? tt(a)
                : (Xe(a), br(!1))),
            e &&
              e !== s &&
              (a = We(() => {
                if (
                  (pr(
                    (l = u
                      ? document.createElementNS(u, e)
                      : document.createElement(e)),
                    l
                  ),
                  n)
                ) {
                  var t = l.appendChild(Te());
                  n(l, t);
                }
                (yt.nodes_end = l), c.before(l);
              })),
            (o = e) && (s = o),
            br(!0));
        }, k);
      })(
        s,
        () => (t.href ? "a" : "button"),
        !1,
        (e, o) => {
          let s;
          dn(
            e,
            (e) => n(e),
            () => n()
          ),
            ze(
              () =>
                (s = Yr(e, s, {
                  "data-button-root": !0,
                  type: t.href ? void 0 : t.type,
                  href: t.href && !r() ? t.href : void 0,
                  disabled: t.href ? void 0 : r(),
                  "aria-disabled": t.href ? r() : void 0,
                  role: t.href && r() ? "link" : void 0,
                  tabindex: t.href && r() ? -1 : 0,
                  ...i,
                }))
            );
          var a = mr();
          Lr(Me(a), () => t.children ?? p), vr(o, a);
        },
        void 0
      ),
      vr(e, o),
      le({ ...Er() })
    );
  }
  function Uc(e, t, r) {
    const n = t.toLowerCase();
    if (n.endsWith(" ")) {
      const i = n.slice(0, -1);
      if (e.filter((e) => e.toLowerCase().startsWith(i)).length <= 1)
        return Uc(e, i, r);
      const o = r?.toLowerCase();
      if (o && o.startsWith(i) && " " === o.charAt(i.length) && t.trim() === i)
        return r;
      const s = e.filter((e) => e.toLowerCase().startsWith(n));
      if (s.length > 0) {
        const t = r ? e.indexOf(r) : -1;
        return zc(s, Math.max(t, 0)).find((e) => e !== r) || r;
      }
    }
    const i = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t,
      o = i.toLowerCase(),
      s = r ? e.indexOf(r) : -1;
    let a = zc(e, Math.max(s, 0));
    1 === i.length && (a = a.filter((e) => e !== r));
    const l = a.find((e) => e?.toLowerCase().startsWith(o));
    return l !== r ? l : void 0;
  }
  function zc(e, t) {
    return e.map((r, n) => e[(t + n) % e.length]);
  }
  W(),
    (Hc[F] =
      "node_modules/bits-ui/dist/bits/utilities/scroll-lock/scroll-lock.svelte"),
    K(Hc),
    W(),
    (Vc[F] = "node_modules/bits-ui/dist/bits/button/components/button.svelte"),
    K(Vc);
  const Gc = ["top", "right", "bottom", "left"],
    Wc = Math.min,
    Kc = Math.max,
    Zc = Math.round,
    Xc = Math.floor,
    Yc = (e) => ({ x: e, y: e }),
    Qc = { left: "right", right: "left", bottom: "top", top: "bottom" },
    Jc = { start: "end", end: "start" };
  function eu(e, t, r) {
    return Kc(e, Wc(t, r));
  }
  function tu(e, t) {
    return "function" == typeof e ? e(t) : e;
  }
  function ru(e) {
    return e.split("-")[0];
  }
  function nu(e) {
    return e.split("-")[1];
  }
  function iu(e) {
    return "x" === e ? "y" : "x";
  }
  function ou(e) {
    return "y" === e ? "height" : "width";
  }
  function su(e) {
    return ["top", "bottom"].includes(ru(e)) ? "y" : "x";
  }
  function au(e) {
    return iu(su(e));
  }
  function lu(e, t, r) {
    void 0 === r && (r = !1);
    const n = nu(e),
      i = au(e),
      o = ou(i);
    let s =
      "x" === i
        ? n === (r ? "end" : "start")
          ? "right"
          : "left"
        : "start" === n
        ? "bottom"
        : "top";
    return t.reference[o] > t.floating[o] && (s = uu(s)), [s, uu(s)];
  }
  function cu(e) {
    return e.replace(/start|end/g, (e) => Jc[e]);
  }
  function uu(e) {
    return e.replace(/left|right|bottom|top/g, (e) => Qc[e]);
  }
  function du(e) {
    return "number" != typeof e
      ? (function (e) {
          return { top: 0, right: 0, bottom: 0, left: 0, ...e };
        })(e)
      : { top: e, right: e, bottom: e, left: e };
  }
  function pu(e) {
    const { x: t, y: r, width: n, height: i } = e;
    return {
      width: n,
      height: i,
      top: r,
      left: t,
      right: t + n,
      bottom: r + i,
      x: t,
      y: r,
    };
  }
  function hu(e, t, r) {
    let { reference: n, floating: i } = e;
    const o = su(t),
      s = au(t),
      a = ou(s),
      l = ru(t),
      c = "y" === o,
      u = n.x + n.width / 2 - i.width / 2,
      d = n.y + n.height / 2 - i.height / 2,
      p = n[a] / 2 - i[a] / 2;
    let h;
    switch (l) {
      case "top":
        h = { x: u, y: n.y - i.height };
        break;
      case "bottom":
        h = { x: u, y: n.y + n.height };
        break;
      case "right":
        h = { x: n.x + n.width, y: d };
        break;
      case "left":
        h = { x: n.x - i.width, y: d };
        break;
      default:
        h = { x: n.x, y: n.y };
    }
    switch (nu(t)) {
      case "start":
        h[s] -= p * (r && c ? -1 : 1);
        break;
      case "end":
        h[s] += p * (r && c ? -1 : 1);
    }
    return h;
  }
  async function fu(e, t) {
    var r;
    void 0 === t && (t = {});
    const { x: n, y: i, platform: o, rects: s, elements: a, strategy: l } = e,
      {
        boundary: c = "clippingAncestors",
        rootBoundary: u = "viewport",
        elementContext: d = "floating",
        altBoundary: p = !1,
        padding: h = 0,
      } = tu(t, e),
      f = du(h),
      g = a[p ? ("floating" === d ? "reference" : "floating") : d],
      m = pu(
        await o.getClippingRect({
          element:
            null ==
              (r = await (null == o.isElement ? void 0 : o.isElement(g))) || r
              ? g
              : g.contextElement ||
                (await (null == o.getDocumentElement
                  ? void 0
                  : o.getDocumentElement(a.floating))),
          boundary: c,
          rootBoundary: u,
          strategy: l,
        })
      ),
      v =
        "floating" === d
          ? { x: n, y: i, width: s.floating.width, height: s.floating.height }
          : s.reference,
      y = await (null == o.getOffsetParent
        ? void 0
        : o.getOffsetParent(a.floating)),
      b = ((await (null == o.isElement ? void 0 : o.isElement(y))) &&
        (await (null == o.getScale ? void 0 : o.getScale(y)))) || {
        x: 1,
        y: 1,
      },
      w = pu(
        o.convertOffsetParentRelativeRectToViewportRelativeRect
          ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
              elements: a,
              rect: v,
              offsetParent: y,
              strategy: l,
            })
          : v
      );
    return {
      top: (m.top - w.top + f.top) / b.y,
      bottom: (w.bottom - m.bottom + f.bottom) / b.y,
      left: (m.left - w.left + f.left) / b.x,
      right: (w.right - m.right + f.right) / b.x,
    };
  }
  function gu(e, t) {
    return {
      top: e.top - t.height,
      right: e.right - t.width,
      bottom: e.bottom - t.height,
      left: e.left - t.width,
    };
  }
  function mu(e) {
    return Gc.some((t) => e[t] >= 0);
  }
  function vu() {
    return "undefined" != typeof window;
  }
  function yu(e) {
    return xu(e) ? (e.nodeName || "").toLowerCase() : "#document";
  }
  function bu(e) {
    var t;
    return (
      (null == e || null == (t = e.ownerDocument) ? void 0 : t.defaultView) ||
      window
    );
  }
  function wu(e) {
    var t;
    return null ==
      (t = (xu(e) ? e.ownerDocument : e.document) || window.document)
      ? void 0
      : t.documentElement;
  }
  function xu(e) {
    return !!vu() && (e instanceof Node || e instanceof bu(e).Node);
  }
  function Cu(e) {
    return !!vu() && (e instanceof Element || e instanceof bu(e).Element);
  }
  function Su(e) {
    return (
      !!vu() && (e instanceof HTMLElement || e instanceof bu(e).HTMLElement)
    );
  }
  function ku(e) {
    return (
      !(!vu() || "undefined" == typeof ShadowRoot) &&
      (e instanceof ShadowRoot || e instanceof bu(e).ShadowRoot)
    );
  }
  function Eu(e) {
    const { overflow: t, overflowX: r, overflowY: n, display: i } = Nu(e);
    return (
      /auto|scroll|overlay|hidden|clip/.test(t + n + r) &&
      !["inline", "contents"].includes(i)
    );
  }
  function Tu(e) {
    return ["table", "td", "th"].includes(yu(e));
  }
  function Au(e) {
    return [":popover-open", ":modal"].some((t) => {
      try {
        return e.matches(t);
      } catch (e) {
        return !1;
      }
    });
  }
  function Ou(e) {
    const t = Pu(),
      r = Cu(e) ? Nu(e) : e;
    return (
      ["transform", "translate", "scale", "rotate", "perspective"].some(
        (e) => !!r[e] && "none" !== r[e]
      ) ||
      (!!r.containerType && "normal" !== r.containerType) ||
      (!t && !!r.backdropFilter && "none" !== r.backdropFilter) ||
      (!t && !!r.filter && "none" !== r.filter) ||
      [
        "transform",
        "translate",
        "scale",
        "rotate",
        "perspective",
        "filter",
      ].some((e) => (r.willChange || "").includes(e)) ||
      ["paint", "layout", "strict", "content"].some((e) =>
        (r.contain || "").includes(e)
      )
    );
  }
  function Pu() {
    return (
      !("undefined" == typeof CSS || !CSS.supports) &&
      CSS.supports("-webkit-backdrop-filter", "none")
    );
  }
  function Mu(e) {
    return ["html", "body", "#document"].includes(yu(e));
  }
  function Nu(e) {
    return bu(e).getComputedStyle(e);
  }
  function Iu(e) {
    return Cu(e)
      ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
      : { scrollLeft: e.scrollX, scrollTop: e.scrollY };
  }
  function _u(e) {
    if ("html" === yu(e)) return e;
    const t = e.assignedSlot || e.parentNode || (ku(e) && e.host) || wu(e);
    return ku(t) ? t.host : t;
  }
  function Lu(e) {
    const t = _u(e);
    return Mu(t)
      ? e.ownerDocument
        ? e.ownerDocument.body
        : e.body
      : Su(t) && Eu(t)
      ? t
      : Lu(t);
  }
  function Du(e, t, r) {
    var n;
    void 0 === t && (t = []), void 0 === r && (r = !0);
    const i = Lu(e),
      o = i === (null == (n = e.ownerDocument) ? void 0 : n.body),
      s = bu(i);
    if (o) {
      const e = Ru(s);
      return t.concat(
        s,
        s.visualViewport || [],
        Eu(i) ? i : [],
        e && r ? Du(e) : []
      );
    }
    return t.concat(i, Du(i, [], r));
  }
  function Ru(e) {
    return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
  }
  function $u(e) {
    const t = Nu(e);
    let r = parseFloat(t.width) || 0,
      n = parseFloat(t.height) || 0;
    const i = Su(e),
      o = i ? e.offsetWidth : r,
      s = i ? e.offsetHeight : n,
      a = Zc(r) !== o || Zc(n) !== s;
    return a && ((r = o), (n = s)), { width: r, height: n, $: a };
  }
  function Fu(e) {
    return Cu(e) ? e : e.contextElement;
  }
  function Bu(e) {
    const t = Fu(e);
    if (!Su(t)) return Yc(1);
    const r = t.getBoundingClientRect(),
      { width: n, height: i, $: o } = $u(t);
    let s = (o ? Zc(r.width) : r.width) / n,
      a = (o ? Zc(r.height) : r.height) / i;
    return (
      (s && Number.isFinite(s)) || (s = 1),
      (a && Number.isFinite(a)) || (a = 1),
      { x: s, y: a }
    );
  }
  const qu = Yc(0);
  function ju(e) {
    const t = bu(e);
    return Pu() && t.visualViewport
      ? { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop }
      : qu;
  }
  function Hu(e, t, r, n) {
    void 0 === t && (t = !1), void 0 === r && (r = !1);
    const i = e.getBoundingClientRect(),
      o = Fu(e);
    let s = Yc(1);
    t && (n ? Cu(n) && (s = Bu(n)) : (s = Bu(e)));
    const a = (function (e, t, r) {
      return void 0 === t && (t = !1), !(!r || (t && r !== bu(e))) && t;
    })(o, r, n)
      ? ju(o)
      : Yc(0);
    let l = (i.left + a.x) / s.x,
      c = (i.top + a.y) / s.y,
      u = i.width / s.x,
      d = i.height / s.y;
    if (o) {
      const e = bu(o),
        t = n && Cu(n) ? bu(n) : n;
      let r = e,
        i = Ru(r);
      for (; i && n && t !== r; ) {
        const e = Bu(i),
          t = i.getBoundingClientRect(),
          n = Nu(i),
          o = t.left + (i.clientLeft + parseFloat(n.paddingLeft)) * e.x,
          s = t.top + (i.clientTop + parseFloat(n.paddingTop)) * e.y;
        (l *= e.x),
          (c *= e.y),
          (u *= e.x),
          (d *= e.y),
          (l += o),
          (c += s),
          (r = bu(i)),
          (i = Ru(r));
      }
    }
    return pu({ width: u, height: d, x: l, y: c });
  }
  function Vu(e, t) {
    const r = Iu(e).scrollLeft;
    return t ? t.left + r : Hu(wu(e)).left + r;
  }
  function Uu(e, t, r) {
    void 0 === r && (r = !1);
    const n = e.getBoundingClientRect();
    return {
      x: n.left + t.scrollLeft - (r ? 0 : Vu(e, n)),
      y: n.top + t.scrollTop,
    };
  }
  function zu(e, t, r) {
    let n;
    if ("viewport" === t)
      n = (function (e, t) {
        const r = bu(e),
          n = wu(e),
          i = r.visualViewport;
        let o = n.clientWidth,
          s = n.clientHeight,
          a = 0,
          l = 0;
        if (i) {
          (o = i.width), (s = i.height);
          const e = Pu();
          (!e || (e && "fixed" === t)) &&
            ((a = i.offsetLeft), (l = i.offsetTop));
        }
        return { width: o, height: s, x: a, y: l };
      })(e, r);
    else if ("document" === t)
      n = (function (e) {
        const t = wu(e),
          r = Iu(e),
          n = e.ownerDocument.body,
          i = Kc(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth),
          o = Kc(
            t.scrollHeight,
            t.clientHeight,
            n.scrollHeight,
            n.clientHeight
          );
        let s = -r.scrollLeft + Vu(e);
        const a = -r.scrollTop;
        return (
          "rtl" === Nu(n).direction &&
            (s += Kc(t.clientWidth, n.clientWidth) - i),
          { width: i, height: o, x: s, y: a }
        );
      })(wu(e));
    else if (Cu(t))
      n = (function (e, t) {
        const r = Hu(e, !0, "fixed" === t),
          n = r.top + e.clientTop,
          i = r.left + e.clientLeft,
          o = Su(e) ? Bu(e) : Yc(1);
        return {
          width: e.clientWidth * o.x,
          height: e.clientHeight * o.y,
          x: i * o.x,
          y: n * o.y,
        };
      })(t, r);
    else {
      const r = ju(e);
      n = { x: t.x - r.x, y: t.y - r.y, width: t.width, height: t.height };
    }
    return pu(n);
  }
  function Gu(e, t) {
    const r = _u(e);
    return (
      !(r === t || !Cu(r) || Mu(r)) && ("fixed" === Nu(r).position || Gu(r, t))
    );
  }
  function Wu(e, t, r) {
    const n = Su(t),
      i = wu(t),
      o = "fixed" === r,
      s = Hu(e, !0, o, t);
    let a = { scrollLeft: 0, scrollTop: 0 };
    const l = Yc(0);
    if (n || (!n && !o))
      if ((("body" !== yu(t) || Eu(i)) && (a = Iu(t)), n)) {
        const e = Hu(t, !0, o, t);
        (l.x = e.x + t.clientLeft), (l.y = e.y + t.clientTop);
      } else i && (l.x = Vu(i));
    const c = !i || n || o ? Yc(0) : Uu(i, a);
    return {
      x: s.left + a.scrollLeft - l.x - c.x,
      y: s.top + a.scrollTop - l.y - c.y,
      width: s.width,
      height: s.height,
    };
  }
  function Ku(e) {
    return "static" === Nu(e).position;
  }
  function Zu(e, t) {
    if (!Su(e) || "fixed" === Nu(e).position) return null;
    if (t) return t(e);
    let r = e.offsetParent;
    return wu(e) === r && (r = r.ownerDocument.body), r;
  }
  function Xu(e, t) {
    const r = bu(e);
    if (Au(e)) return r;
    if (!Su(e)) {
      let t = _u(e);
      for (; t && !Mu(t); ) {
        if (Cu(t) && !Ku(t)) return t;
        t = _u(t);
      }
      return r;
    }
    let n = Zu(e, t);
    for (; n && Tu(n) && Ku(n); ) n = Zu(n, t);
    return n && Mu(n) && Ku(n) && !Ou(n)
      ? r
      : n ||
          (function (e) {
            let t = _u(e);
            for (; Su(t) && !Mu(t); ) {
              if (Ou(t)) return t;
              if (Au(t)) return null;
              t = _u(t);
            }
            return null;
          })(e) ||
          r;
  }
  const Yu = {
    convertOffsetParentRelativeRectToViewportRelativeRect: function (e) {
      let { elements: t, rect: r, offsetParent: n, strategy: i } = e;
      const o = "fixed" === i,
        s = wu(n),
        a = !!t && Au(t.floating);
      if (n === s || (a && o)) return r;
      let l = { scrollLeft: 0, scrollTop: 0 },
        c = Yc(1);
      const u = Yc(0),
        d = Su(n);
      if (
        (d || (!d && !o)) &&
        (("body" !== yu(n) || Eu(s)) && (l = Iu(n)), Su(n))
      ) {
        const e = Hu(n);
        (c = Bu(n)), (u.x = e.x + n.clientLeft), (u.y = e.y + n.clientTop);
      }
      const p = !s || d || o ? Yc(0) : Uu(s, l, !0);
      return {
        width: r.width * c.x,
        height: r.height * c.y,
        x: r.x * c.x - l.scrollLeft * c.x + u.x + p.x,
        y: r.y * c.y - l.scrollTop * c.y + u.y + p.y,
      };
    },
    getDocumentElement: wu,
    getClippingRect: function (e) {
      let { element: t, boundary: r, rootBoundary: n, strategy: i } = e;
      const o =
          "clippingAncestors" === r
            ? Au(t)
              ? []
              : (function (e, t) {
                  const r = t.get(e);
                  if (r) return r;
                  let n = Du(e, [], !1).filter(
                      (e) => Cu(e) && "body" !== yu(e)
                    ),
                    i = null;
                  const o = "fixed" === Nu(e).position;
                  let s = o ? _u(e) : e;
                  for (; Cu(s) && !Mu(s); ) {
                    const t = Nu(s),
                      r = Ou(s);
                    r || "fixed" !== t.position || (i = null),
                      (
                        o
                          ? !r && !i
                          : (!r &&
                              "static" === t.position &&
                              i &&
                              ["absolute", "fixed"].includes(i.position)) ||
                            (Eu(s) && !r && Gu(e, s))
                      )
                        ? (n = n.filter((e) => e !== s))
                        : (i = t),
                      (s = _u(s));
                  }
                  return t.set(e, n), n;
                })(t, this._c)
            : [].concat(r),
        s = [...o, n],
        a = s[0],
        l = s.reduce((e, r) => {
          const n = zu(t, r, i);
          return (
            (e.top = Kc(n.top, e.top)),
            (e.right = Wc(n.right, e.right)),
            (e.bottom = Wc(n.bottom, e.bottom)),
            (e.left = Kc(n.left, e.left)),
            e
          );
        }, zu(t, a, i));
      return {
        width: l.right - l.left,
        height: l.bottom - l.top,
        x: l.left,
        y: l.top,
      };
    },
    getOffsetParent: Xu,
    getElementRects: async function (e) {
      const t = this.getOffsetParent || Xu,
        r = this.getDimensions,
        n = await r(e.floating);
      return {
        reference: Wu(e.reference, await t(e.floating), e.strategy),
        floating: { x: 0, y: 0, width: n.width, height: n.height },
      };
    },
    getClientRects: function (e) {
      return Array.from(e.getClientRects());
    },
    getDimensions: function (e) {
      const { width: t, height: r } = $u(e);
      return { width: t, height: r };
    },
    getScale: Bu,
    isElement: Cu,
    isRTL: function (e) {
      return "rtl" === Nu(e).direction;
    },
  };
  function Qu(e, t) {
    return (
      e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height
    );
  }
  function Ju(e, t, r, n) {
    void 0 === n && (n = {});
    const {
        ancestorScroll: i = !0,
        ancestorResize: o = !0,
        elementResize: s = "function" == typeof ResizeObserver,
        layoutShift: a = "function" == typeof IntersectionObserver,
        animationFrame: l = !1,
      } = n,
      c = Fu(e),
      u = i || o ? [...(c ? Du(c) : []), ...Du(t)] : [];
    u.forEach((e) => {
      i && e.addEventListener("scroll", r, { passive: !0 }),
        o && e.addEventListener("resize", r);
    });
    const d =
      c && a
        ? (function (e, t) {
            let r,
              n = null;
            const i = wu(e);
            function o() {
              var e;
              clearTimeout(r), null == (e = n) || e.disconnect(), (n = null);
            }
            return (
              (function s(a, l) {
                void 0 === a && (a = !1), void 0 === l && (l = 1), o();
                const c = e.getBoundingClientRect(),
                  { left: u, top: d, width: p, height: h } = c;
                if ((a || t(), !p || !h)) return;
                const f = {
                  rootMargin:
                    -Xc(d) +
                    "px " +
                    -Xc(i.clientWidth - (u + p)) +
                    "px " +
                    -Xc(i.clientHeight - (d + h)) +
                    "px " +
                    -Xc(u) +
                    "px",
                  threshold: Kc(0, Wc(1, l)) || 1,
                };
                let g = !0;
                function m(t) {
                  const n = t[0].intersectionRatio;
                  if (n !== l) {
                    if (!g) return s();
                    n
                      ? s(!1, n)
                      : (r = setTimeout(() => {
                          s(!1, 1e-7);
                        }, 1e3));
                  }
                  1 !== n || Qu(c, e.getBoundingClientRect()) || s(), (g = !1);
                }
                try {
                  n = new IntersectionObserver(m, {
                    ...f,
                    root: i.ownerDocument,
                  });
                } catch (e) {
                  n = new IntersectionObserver(m, f);
                }
                n.observe(e);
              })(!0),
              o
            );
          })(c, r)
        : null;
    let p,
      h = -1,
      f = null;
    s &&
      ((f = new ResizeObserver((e) => {
        let [n] = e;
        n &&
          n.target === c &&
          f &&
          (f.unobserve(t),
          cancelAnimationFrame(h),
          (h = requestAnimationFrame(() => {
            var e;
            null == (e = f) || e.observe(t);
          }))),
          r();
      })),
      c && !l && f.observe(c),
      f.observe(t));
    let g = l ? Hu(e) : null;
    return (
      l &&
        (function t() {
          const n = Hu(e);
          g && !Qu(g, n) && r();
          (g = n), (p = requestAnimationFrame(t));
        })(),
      r(),
      () => {
        var e;
        u.forEach((e) => {
          i && e.removeEventListener("scroll", r),
            o && e.removeEventListener("resize", r);
        }),
          null == d || d(),
          null == (e = f) || e.disconnect(),
          (f = null),
          l && cancelAnimationFrame(p);
      }
    );
  }
  const ed = function (e) {
      return (
        void 0 === e && (e = 0),
        {
          name: "offset",
          options: e,
          async fn(t) {
            var r, n;
            const { x: i, y: o, placement: s, middlewareData: a } = t,
              l = await (async function (e, t) {
                const { placement: r, platform: n, elements: i } = e,
                  o = await (null == n.isRTL ? void 0 : n.isRTL(i.floating)),
                  s = ru(r),
                  a = nu(r),
                  l = "y" === su(r),
                  c = ["left", "top"].includes(s) ? -1 : 1,
                  u = o && l ? -1 : 1,
                  d = tu(t, e);
                let {
                  mainAxis: p,
                  crossAxis: h,
                  alignmentAxis: f,
                } = "number" == typeof d
                  ? { mainAxis: d, crossAxis: 0, alignmentAxis: null }
                  : {
                      mainAxis: d.mainAxis || 0,
                      crossAxis: d.crossAxis || 0,
                      alignmentAxis: d.alignmentAxis,
                    };
                return (
                  a && "number" == typeof f && (h = "end" === a ? -1 * f : f),
                  l ? { x: h * u, y: p * c } : { x: p * c, y: h * u }
                );
              })(t, e);
            return s === (null == (r = a.offset) ? void 0 : r.placement) &&
              null != (n = a.arrow) &&
              n.alignmentOffset
              ? {}
              : { x: i + l.x, y: o + l.y, data: { ...l, placement: s } };
          },
        }
      );
    },
    td = function (e) {
      return (
        void 0 === e && (e = {}),
        {
          name: "shift",
          options: e,
          async fn(t) {
            const { x: r, y: n, placement: i } = t,
              {
                mainAxis: o = !0,
                crossAxis: s = !1,
                limiter: a = {
                  fn: (e) => {
                    let { x: t, y: r } = e;
                    return { x: t, y: r };
                  },
                },
                ...l
              } = tu(e, t),
              c = { x: r, y: n },
              u = await fu(t, l),
              d = su(ru(i)),
              p = iu(d);
            let h = c[p],
              f = c[d];
            if (o) {
              const e = "y" === p ? "bottom" : "right";
              h = eu(h + u["y" === p ? "top" : "left"], h, h - u[e]);
            }
            if (s) {
              const e = "y" === d ? "bottom" : "right";
              f = eu(f + u["y" === d ? "top" : "left"], f, f - u[e]);
            }
            const g = a.fn({ ...t, [p]: h, [d]: f });
            return {
              ...g,
              data: { x: g.x - r, y: g.y - n, enabled: { [p]: o, [d]: s } },
            };
          },
        }
      );
    },
    rd = function (e) {
      return (
        void 0 === e && (e = {}),
        {
          name: "flip",
          options: e,
          async fn(t) {
            var r, n;
            const {
                placement: i,
                middlewareData: o,
                rects: s,
                initialPlacement: a,
                platform: l,
                elements: c,
              } = t,
              {
                mainAxis: u = !0,
                crossAxis: d = !0,
                fallbackPlacements: p,
                fallbackStrategy: h = "bestFit",
                fallbackAxisSideDirection: f = "none",
                flipAlignment: g = !0,
                ...m
              } = tu(e, t);
            if (null != (r = o.arrow) && r.alignmentOffset) return {};
            const v = ru(i),
              y = su(a),
              b = ru(a) === a,
              w = await (null == l.isRTL ? void 0 : l.isRTL(c.floating)),
              x =
                p ||
                (b || !g
                  ? [uu(a)]
                  : (function (e) {
                      const t = uu(e);
                      return [cu(e), t, cu(t)];
                    })(a)),
              C = "none" !== f;
            !p &&
              C &&
              x.push(
                ...(function (e, t, r, n) {
                  const i = nu(e);
                  let o = (function (e, t, r) {
                    const n = ["left", "right"],
                      i = ["right", "left"],
                      o = ["top", "bottom"],
                      s = ["bottom", "top"];
                    switch (e) {
                      case "top":
                      case "bottom":
                        return r ? (t ? i : n) : t ? n : i;
                      case "left":
                      case "right":
                        return t ? o : s;
                      default:
                        return [];
                    }
                  })(ru(e), "start" === r, n);
                  return (
                    i &&
                      ((o = o.map((e) => e + "-" + i)),
                      t && (o = o.concat(o.map(cu)))),
                    o
                  );
                })(a, g, f, w)
              );
            const S = [a, ...x],
              k = await fu(t, m),
              E = [];
            let T = (null == (n = o.flip) ? void 0 : n.overflows) || [];
            if ((u && E.push(k[v]), d)) {
              const e = lu(i, s, w);
              E.push(k[e[0]], k[e[1]]);
            }
            if (
              ((T = [...T, { placement: i, overflows: E }]),
              !E.every((e) => e <= 0))
            ) {
              var A, O;
              const e = ((null == (A = o.flip) ? void 0 : A.index) || 0) + 1,
                t = S[e];
              if (t)
                return {
                  data: { index: e, overflows: T },
                  reset: { placement: t },
                };
              let r =
                null ==
                (O = T.filter((e) => e.overflows[0] <= 0).sort(
                  (e, t) => e.overflows[1] - t.overflows[1]
                )[0])
                  ? void 0
                  : O.placement;
              if (!r)
                switch (h) {
                  case "bestFit": {
                    var P;
                    const e =
                      null ==
                      (P = T.filter((e) => {
                        if (C) {
                          const t = su(e.placement);
                          return t === y || "y" === t;
                        }
                        return !0;
                      })
                        .map((e) => [
                          e.placement,
                          e.overflows
                            .filter((e) => e > 0)
                            .reduce((e, t) => e + t, 0),
                        ])
                        .sort((e, t) => e[1] - t[1])[0])
                        ? void 0
                        : P[0];
                    e && (r = e);
                    break;
                  }
                  case "initialPlacement":
                    r = a;
                }
              if (i !== r) return { reset: { placement: r } };
            }
            return {};
          },
        }
      );
    },
    nd = function (e) {
      return (
        void 0 === e && (e = {}),
        {
          name: "size",
          options: e,
          async fn(t) {
            var r, n;
            const { placement: i, rects: o, platform: s, elements: a } = t,
              { apply: l = () => {}, ...c } = tu(e, t),
              u = await fu(t, c),
              d = ru(i),
              p = nu(i),
              h = "y" === su(i),
              { width: f, height: g } = o.floating;
            let m, v;
            "top" === d || "bottom" === d
              ? ((m = d),
                (v =
                  p ===
                  ((await (null == s.isRTL ? void 0 : s.isRTL(a.floating)))
                    ? "start"
                    : "end")
                    ? "left"
                    : "right"))
              : ((v = d), (m = "end" === p ? "top" : "bottom"));
            const y = g - u.top - u.bottom,
              b = f - u.left - u.right,
              w = Wc(g - u[m], y),
              x = Wc(f - u[v], b),
              C = !t.middlewareData.shift;
            let S = w,
              k = x;
            if (
              (null != (r = t.middlewareData.shift) && r.enabled.x && (k = b),
              null != (n = t.middlewareData.shift) && n.enabled.y && (S = y),
              C && !p)
            ) {
              const e = Kc(u.left, 0),
                t = Kc(u.right, 0),
                r = Kc(u.top, 0),
                n = Kc(u.bottom, 0);
              h
                ? (k =
                    f - 2 * (0 !== e || 0 !== t ? e + t : Kc(u.left, u.right)))
                : (S =
                    g - 2 * (0 !== r || 0 !== n ? r + n : Kc(u.top, u.bottom)));
            }
            await l({ ...t, availableWidth: k, availableHeight: S });
            const E = await s.getDimensions(a.floating);
            return f !== E.width || g !== E.height
              ? { reset: { rects: !0 } }
              : {};
          },
        }
      );
    },
    id = function (e) {
      return (
        void 0 === e && (e = {}),
        {
          name: "hide",
          options: e,
          async fn(t) {
            const { rects: r } = t,
              { strategy: n = "referenceHidden", ...i } = tu(e, t);
            switch (n) {
              case "referenceHidden": {
                const e = gu(
                  await fu(t, { ...i, elementContext: "reference" }),
                  r.reference
                );
                return {
                  data: { referenceHiddenOffsets: e, referenceHidden: mu(e) },
                };
              }
              case "escaped": {
                const e = gu(
                  await fu(t, { ...i, altBoundary: !0 }),
                  r.floating
                );
                return { data: { escapedOffsets: e, escaped: mu(e) } };
              }
              default:
                return {};
            }
          },
        }
      );
    },
    od = (e) => ({
      name: "arrow",
      options: e,
      async fn(t) {
        const {
            x: r,
            y: n,
            placement: i,
            rects: o,
            platform: s,
            elements: a,
            middlewareData: l,
          } = t,
          { element: c, padding: u = 0 } = tu(e, t) || {};
        if (null == c) return {};
        const d = du(u),
          p = { x: r, y: n },
          h = au(i),
          f = ou(h),
          g = await s.getDimensions(c),
          m = "y" === h,
          v = m ? "top" : "left",
          y = m ? "bottom" : "right",
          b = m ? "clientHeight" : "clientWidth",
          w = o.reference[f] + o.reference[h] - p[h] - o.floating[f],
          x = p[h] - o.reference[h],
          C = await (null == s.getOffsetParent ? void 0 : s.getOffsetParent(c));
        let S = C ? C[b] : 0;
        (S && (await (null == s.isElement ? void 0 : s.isElement(C)))) ||
          (S = a.floating[b] || o.floating[f]);
        const k = w / 2 - x / 2,
          E = S / 2 - g[f] / 2 - 1,
          T = Wc(d[v], E),
          A = Wc(d[y], E),
          O = T,
          P = S - g[f] - A,
          M = S / 2 - g[f] / 2 + k,
          N = eu(O, M, P),
          I =
            !l.arrow &&
            null != nu(i) &&
            M !== N &&
            o.reference[f] / 2 - (M < O ? T : A) - g[f] / 2 < 0,
          _ = I ? (M < O ? M - O : M - P) : 0;
        return {
          [h]: p[h] + _,
          data: {
            [h]: N,
            centerOffset: M - N - _,
            ...(I && { alignmentOffset: _ }),
          },
          reset: I,
        };
      },
    }),
    sd = function (e) {
      return (
        void 0 === e && (e = {}),
        {
          options: e,
          fn(t) {
            const { x: r, y: n, placement: i, rects: o, middlewareData: s } = t,
              { offset: a = 0, mainAxis: l = !0, crossAxis: c = !0 } = tu(e, t),
              u = { x: r, y: n },
              d = su(i),
              p = iu(d);
            let h = u[p],
              f = u[d];
            const g = tu(a, t),
              m =
                "number" == typeof g
                  ? { mainAxis: g, crossAxis: 0 }
                  : { mainAxis: 0, crossAxis: 0, ...g };
            if (l) {
              const e = "y" === p ? "height" : "width",
                t = o.reference[p] - o.floating[e] + m.mainAxis,
                r = o.reference[p] + o.reference[e] - m.mainAxis;
              h < t ? (h = t) : h > r && (h = r);
            }
            if (c) {
              var v, y;
              const e = "y" === p ? "width" : "height",
                t = ["top", "left"].includes(ru(i)),
                r =
                  o.reference[d] -
                  o.floating[e] +
                  ((t && (null == (v = s.offset) ? void 0 : v[d])) || 0) +
                  (t ? 0 : m.crossAxis),
                n =
                  o.reference[d] +
                  o.reference[e] +
                  (t ? 0 : (null == (y = s.offset) ? void 0 : y[d]) || 0) -
                  (t ? m.crossAxis : 0);
              f < r ? (f = r) : f > n && (f = n);
            }
            return { [p]: h, [d]: f };
          },
        }
      );
    },
    ad = (e, t, r) => {
      const n = new Map(),
        i = { platform: Yu, ...r },
        o = { ...i.platform, _c: n };
      return (async (e, t, r) => {
        const {
            placement: n = "bottom",
            strategy: i = "absolute",
            middleware: o = [],
            platform: s,
          } = r,
          a = o.filter(Boolean),
          l = await (null == s.isRTL ? void 0 : s.isRTL(t));
        let c = await s.getElementRects({
            reference: e,
            floating: t,
            strategy: i,
          }),
          { x: u, y: d } = hu(c, n, l),
          p = n,
          h = {},
          f = 0;
        for (let r = 0; r < a.length; r++) {
          const { name: o, fn: g } = a[r],
            {
              x: m,
              y: v,
              data: y,
              reset: b,
            } = await g({
              x: u,
              y: d,
              initialPlacement: n,
              placement: p,
              strategy: i,
              middlewareData: h,
              rects: c,
              platform: s,
              elements: { reference: e, floating: t },
            });
          (u = null != m ? m : u),
            (d = null != v ? v : d),
            (h = { ...h, [o]: { ...h[o], ...y } }),
            b &&
              f <= 50 &&
              (f++,
              "object" == typeof b &&
                (b.placement && (p = b.placement),
                b.rects &&
                  (c =
                    !0 === b.rects
                      ? await s.getElementRects({
                          reference: e,
                          floating: t,
                          strategy: i,
                        })
                      : b.rects),
                ({ x: u, y: d } = hu(c, p, l))),
              (r = -1));
        }
        return { x: u, y: d, placement: p, strategy: i, middlewareData: h };
      })(e, t, { ...i, platform: o });
    };
  function ld(e) {
    return xe(typeof e, "function") ? e() : e;
  }
  function cd(e) {
    if (xe(typeof window, "undefined")) return 1;
    return (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
  }
  function ud(e, t) {
    const r = cd(e);
    return Math.round(t * r) / r;
  }
  function dd(e) {
    return {
      [`--bits-${e}-content-transform-origin`]:
        "var(--bits-floating-transform-origin)",
      [`--bits-${e}-content-available-width`]:
        "var(--bits-floating-available-width)",
      [`--bits-${e}-content-available-height`]:
        "var(--bits-floating-available-height)",
      [`--bits-${e}-anchor-width`]: "var(--bits-floating-anchor-width)",
      [`--bits-${e}-anchor-height`]: "var(--bits-floating-anchor-height)",
    };
  }
  const pd = { top: "bottom", right: "left", bottom: "top", left: "right" };
  class hd {
    anchorNode = Ha(null);
    customAnchorNode = Ha(null);
    triggerNode = Ha(null);
    constructor() {
      qe(() => {
        this.customAnchorNode.current
          ? xe(typeof this.customAnchorNode.current, "string")
            ? (this.anchorNode.current = document.querySelector(
                this.customAnchorNode.current
              ))
            : (this.anchorNode.current = this.customAnchorNode.current)
          : (this.anchorNode.current = this.triggerNode.current);
      });
    }
  }
  class fd {
    opts;
    root;
    contentRef = Ha(null);
    wrapperRef = Ha(null);
    arrowRef = Ha(null);
    arrowId = Ha(jl());
    #$ = _e(() =>
      xe(typeof this.opts.style, "string")
        ? tl(this.opts.style)
        : this.opts.style
        ? void 0
        : {}
    );
    #F = void 0;
    #B = new hl(() => this.arrowRef.current ?? void 0);
    #q = _e(() => this.#B?.width ?? 0);
    #j = _e(() => this.#B?.height ?? 0);
    #H = _e(
      () =>
        this.opts.side?.current +
        (xe(this.opts.align.current, "center", !1)
          ? `-${this.opts.align.current}`
          : "")
    );
    #V = _e(() =>
      Array.isArray(this.opts.collisionBoundary.current)
        ? this.opts.collisionBoundary.current
        : [this.opts.collisionBoundary.current]
    );
    #U = _e(() => Ht(this.#V).length > 0);
    get hasExplicitBoundaries() {
      return Ht(this.#U);
    }
    set hasExplicitBoundaries(e) {
      ye(this.#U, e);
    }
    #z = _e(() => ({
      padding: this.opts.collisionPadding.current,
      boundary: Ht(this.#V).filter(Fl),
      altBoundary: this.hasExplicitBoundaries,
    }));
    get detectOverflowOptions() {
      return Ht(this.#z);
    }
    set detectOverflowOptions(e) {
      ye(this.#z, e);
    }
    #G = me(void 0);
    #W = me(void 0);
    #K = me(void 0);
    #Z = me(void 0);
    #X = _e(() => {
      return [
        ed({
          mainAxis: this.opts.sideOffset.current + Ht(this.#j),
          alignmentAxis: this.opts.alignOffset.current,
        }),
        this.opts.avoidCollisions.current &&
          td({
            mainAxis: !0,
            crossAxis: !1,
            limiter: xe(this.opts.sticky.current, "partial") ? sd() : void 0,
            ...this.detectOverflowOptions,
          }),
        this.opts.avoidCollisions.current &&
          rd({ ...this.detectOverflowOptions }),
        nd({
          ...this.detectOverflowOptions,
          apply: ({ rects: e, availableWidth: t, availableHeight: r }) => {
            const { width: n, height: i } = e.reference;
            ye(this.#G, t, !0),
              ye(this.#W, r, !0),
              ye(this.#K, n, !0),
              ye(this.#Z, i, !0);
          },
        }),
        this.arrowRef.current &&
          od({
            element: this.arrowRef.current,
            padding: this.opts.arrowPadding.current,
          }),
        ((e = { arrowWidth: Ht(this.#q), arrowHeight: Ht(this.#j) }),
        {
          name: "transformOrigin",
          options: e,
          fn(t) {
            const { placement: r, rects: n, middlewareData: i } = t,
              o = xe(i.arrow?.centerOffset, 0, !1),
              s = o,
              a = s ? 0 : e.arrowWidth,
              l = s ? 0 : e.arrowHeight,
              [c, u] = bd(r),
              d = { start: "0%", center: "50%", end: "100%" }[u],
              p = (i.arrow?.x ?? 0) + a / 2,
              h = (i.arrow?.y ?? 0) + l / 2;
            let f = "",
              g = "";
            return (
              xe(c, "bottom")
                ? ((f = s ? d : `${p}px`), (g = -l + "px"))
                : xe(c, "top")
                ? ((f = s ? d : `${p}px`), (g = `${n.floating.height + l}px`))
                : xe(c, "right")
                ? ((f = -l + "px"), (g = s ? d : `${h}px`))
                : xe(c, "left") &&
                  ((f = `${n.floating.width + l}px`), (g = s ? d : `${h}px`)),
              { data: { x: f, y: g } }
            );
          },
        }),
        this.opts.hideWhenDetached.current &&
          id({ strategy: "referenceHidden", ...this.detectOverflowOptions }),
      ].filter(Boolean);
      var e;
    });
    get middleware() {
      return Ht(this.#X);
    }
    set middleware(e) {
      ye(this.#X, e);
    }
    floating;
    #Y = _e(() => bd(this.floating.placement)[0]);
    get placedSide() {
      return Ht(this.#Y);
    }
    set placedSide(e) {
      ye(this.#Y, e);
    }
    #Q = _e(() => bd(this.floating.placement)[1]);
    get placedAlign() {
      return Ht(this.#Q);
    }
    set placedAlign(e) {
      ye(this.#Q, e);
    }
    #J = _e(() => this.floating.middlewareData.arrow?.x ?? 0);
    get arrowX() {
      return Ht(this.#J);
    }
    set arrowX(e) {
      ye(this.#J, e);
    }
    #ee = _e(() => this.floating.middlewareData.arrow?.y ?? 0);
    get arrowY() {
      return Ht(this.#ee);
    }
    set arrowY(e) {
      ye(this.#ee, e);
    }
    #te = _e(() => xe(this.floating.middlewareData.arrow?.centerOffset, 0, !1));
    get cannotCenterArrow() {
      return Ht(this.#te);
    }
    set cannotCenterArrow(e) {
      ye(this.#te, e);
    }
    #re = me();
    get contentZIndex() {
      return Ht(this.#re);
    }
    set contentZIndex(e) {
      ye(this.#re, e, !0);
    }
    #ne = _e(() => pd[this.placedSide]);
    get arrowBaseSide() {
      return Ht(this.#ne);
    }
    set arrowBaseSide(e) {
      ye(this.#ne, e);
    }
    #ie = _e(() => ({
      id: this.opts.wrapperId.current,
      "data-bits-floating-content-wrapper": "",
      style: {
        ...this.floating.floatingStyles,
        transform: this.floating.isPositioned
          ? this.floating.floatingStyles.transform
          : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: this.contentZIndex,
        "--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
        "--bits-floating-available-width": `${Ht(this.#G)}px`,
        "--bits-floating-available-height": `${Ht(this.#W)}px`,
        "--bits-floating-anchor-width": `${Ht(this.#K)}px`,
        "--bits-floating-anchor-height": `${Ht(this.#Z)}px`,
        ...(this.floating.middlewareData.hide?.referenceHidden && {
          visibility: "hidden",
          "pointer-events": "none",
        }),
        ...Ht(this.#$),
      },
      dir: this.opts.dir.current,
    }));
    get wrapperProps() {
      return Ht(this.#ie);
    }
    set wrapperProps(e) {
      ye(this.#ie, e);
    }
    #oe = _e(() => ({
      "data-side": this.placedSide,
      "data-align": this.placedAlign,
      style: il({ ...Ht(this.#$) }),
    }));
    get props() {
      return Ht(this.#oe);
    }
    set props(e) {
      ye(this.#oe, e);
    }
    #se = _e(() => ({
      position: "absolute",
      left: this.arrowX ? `${this.arrowX}px` : void 0,
      top: this.arrowY ? `${this.arrowY}px` : void 0,
      [this.arrowBaseSide]: 0,
      "transform-origin": {
        top: "",
        right: "0 0",
        bottom: "center 0",
        left: "100% 0",
      }[this.placedSide],
      transform: {
        top: "translateY(100%)",
        right: "translateY(50%) rotate(90deg) translateX(-50%)",
        bottom: "rotate(180deg)",
        left: "translateY(50%) rotate(-90deg) translateX(50%)",
      }[this.placedSide],
      visibility: this.cannotCenterArrow ? "hidden" : void 0,
    }));
    get arrowStyle() {
      return Ht(this.#se);
    }
    set arrowStyle(e) {
      ye(this.#se, e);
    }
    constructor(e, t) {
      (this.opts = e),
        (this.root = t),
        e.customAnchor &&
          (this.root.customAnchorNode.current = e.customAnchor.current),
        pl(
          () => e.customAnchor.current,
          (e) => {
            this.root.customAnchorNode.current = e;
          }
        ),
        vl({
          id: this.opts.wrapperId,
          ref: this.wrapperRef,
          deps: () => this.opts.enabled.current,
        }),
        vl({
          id: this.opts.id,
          ref: this.contentRef,
          deps: () => this.opts.enabled.current,
        }),
        (this.floating = (function (e) {
          const t = e.whileElementsMounted,
            r = _e(() => ld(e.open) ?? !0),
            n = _e(() => ld(e.middleware)),
            i = _e(() => ld(e.transform) ?? !0),
            o = _e(() => ld(e.placement) ?? "bottom"),
            s = _e(() => ld(e.strategy) ?? "absolute"),
            a = e.reference;
          let l = me(0),
            c = me(0);
          const u = Ha(null);
          let d = me(de(Ht(s))),
            p = me(de(Ht(o))),
            h = me(de({})),
            f = me(!1);
          const g = _e(() => {
            const e = { position: Ht(d), left: "0", top: "0" };
            if (!u.current) return e;
            const t = ud(u.current, Ht(l)),
              r = ud(u.current, Ht(c));
            return Ht(i)
              ? {
                  ...e,
                  transform: `translate(${t}px, ${r}px)`,
                  ...(cd(u.current) >= 1.5 && { willChange: "transform" }),
                }
              : { position: Ht(d), left: `${t}px`, top: `${r}px` };
          });
          let m;
          function v() {
            xe(a.current, null) ||
              xe(u.current, null) ||
              ad(a.current, u.current, {
                middleware: Ht(n),
                placement: Ht(o),
                strategy: Ht(s),
              }).then((e) => {
                ye(l, e.x, !0),
                  ye(c, e.y, !0),
                  ye(d, e.strategy, !0),
                  ye(p, e.placement, !0),
                  ye(h, e.middlewareData, !0),
                  ye(f, !0);
              });
          }
          function y() {
            xe(typeof m, "function") && (m(), (m = void 0));
          }
          return (
            qe(v),
            qe(function () {
              y(),
                xe(t, void 0)
                  ? v()
                  : xe(a.current, null) ||
                    xe(u.current, null) ||
                    (m = t(a.current, u.current, v));
            }),
            qe(function () {
              Ht(r) || ye(f, !1);
            }),
            qe(() => y),
            {
              floating: u,
              reference: a,
              get strategy() {
                return Ht(d);
              },
              get placement() {
                return Ht(p);
              },
              get middlewareData() {
                return Ht(h);
              },
              get isPositioned() {
                return Ht(f);
              },
              get floatingStyles() {
                return Ht(g);
              },
              get update() {
                return v;
              },
            }
          );
        })({
          strategy: () => this.opts.strategy.current,
          placement: () => Ht(this.#H),
          middleware: () => this.middleware,
          reference: this.root.anchorNode,
          whileElementsMounted: (...e) =>
            Ju(...e, { animationFrame: xe(this.#F?.current, "always") }),
          open: () => this.opts.enabled.current,
        })),
        qe(() => {
          this.floating.isPositioned && this.opts.onPlaced?.current();
        }),
        pl(
          () => this.contentRef.current,
          (e) => {
            e && (this.contentZIndex = window.getComputedStyle(e).zIndex);
          }
        ),
        qe(() => {
          this.floating.floating.current = this.wrapperRef.current;
        });
    }
    [G](e) {
      Y(this, e, [
        () => Ht(this.#U),
        () => Ht(this.#z),
        () => Ht(this.#X),
        () => Ht(this.#Y),
        () => Ht(this.#Q),
        () => Ht(this.#J),
        () => Ht(this.#ee),
        () => Ht(this.#te),
        () => Ht(this.#re),
        () => Ht(this.#ne),
        () => Ht(this.#ie),
        () => Ht(this.#oe),
        () => Ht(this.#se),
      ]);
    }
  }
  class gd {
    opts;
    content;
    constructor(e, t) {
      (this.opts = e),
        (this.content = t),
        vl({
          ...e,
          onRefChange: (e) => {
            this.content.arrowRef.current = e;
          },
          deps: () => this.content.opts.enabled.current,
        });
    }
    #oe = _e(() => ({
      id: this.opts.id.current,
      style: this.content.arrowStyle,
      "data-side": this.content.placedSide,
    }));
    get props() {
      return Ht(this.#oe);
    }
    set props(e) {
      ye(this.#oe, e);
    }
    [G](e) {
      Y(this, e, [() => Ht(this.#oe)]);
    }
  }
  class md {
    opts;
    root;
    ref = Ha(null);
    constructor(e, t) {
      (this.opts = e),
        (this.root = t),
        e.virtualEl && e.virtualEl.current
          ? (t.triggerNode = Ha.from(e.virtualEl.current))
          : vl({
              id: e.id,
              ref: this.ref,
              onRefChange: (e) => {
                t.triggerNode.current = e;
              },
            });
    }
  }
  const vd = new gl("Floating.Root"),
    yd = new gl("Floating.Content");
  function bd(e) {
    const [t, r = "center"] = e.split("-");
    return [t, r];
  }
  function wd(e, t) {
    kr(new.target), ae(t, !0), vd.set(new hd());
    var r = mr();
    return Lr(Me(r), () => t.children ?? p), vr(e, r), le({ ...Er() });
  }
  function xd(e, t = 1e4, r = Hl) {
    let n = null,
      i = me(de(e));
    return (
      qe(() => () => {
        n && clearTimeout(n);
      }),
      Ha.with(
        () => Ht(i),
        (o) => {
          ye(i, o, !0),
            r(o),
            n && clearTimeout(n),
            (n = window.setTimeout(() => {
              ye(i, e, !0), r(e);
            }, t));
        }
      )
    );
  }
  function Cd(e) {
    const t = xd("", 1e3),
      r = e?.onMatch ?? ((e) => e.focus()),
      n = e?.getCurrentItem ?? (() => document.activeElement);
    return {
      search: t,
      handleTypeaheadSearch: function (e, i) {
        if (!i.length) return;
        t.current = t.current + e;
        const o = n(),
          s = i.find((e) => xe(e, o))?.textContent ?? "",
          a = Uc(
            i.map((e) => e.textContent ?? ""),
            t.current,
            s
          ),
          l = i.find((e) => xe(e.textContent, a));
        return l && r(l), l;
      },
      resetTypeahead: function () {
        t.current = "";
      },
    };
  }
  function Sd(e, t) {
    var r;
    kr(new.target),
      ae(t, !0),
      (r = { id: Ha.with(() => t.id), virtualEl: Ha.with(() => t.virtualEl) }),
      new md(r, vd.get());
    var n = mr();
    return Lr(Me(n), () => t.children ?? p), vr(e, n), le({ ...Er() });
  }
  W(),
    (wd[F] =
      "node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer.svelte"),
    K(wd),
    W(),
    (Sd[F] =
      "node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-anchor.svelte"),
    K(Sd),
    W(),
    (Td[F] = "node_modules/bits-ui/dist/bits/utilities/arrow/arrow.svelte");
  var kd = er(
      fr(
        '<svg viewBox="0 0 30 10" preserveAspectRatio="none" data-arrow=""><polygon points="0,0 30,0 15,10" fill="currentColor"></polygon></svg>'
      ),
      Td[F],
      [[14, 3, [[15, 4]]]]
    ),
    Ed = er(hr("<span><!></span>"), Td[F], [[10, 1]]);
  function Td(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "id", 19, jl),
      n = Tn(t, "width", 3, 10),
      i = Tn(t, "height", 3, 5),
      o = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "id",
        "children",
        "child",
        "width",
        "height",
      ]);
    const s = _e(() => sl(o, { id: r() }));
    var a = mr(),
      l = Me(a),
      c = (e) => {
        var r = mr();
        Lr(
          Me(r),
          () => t.child,
          () => ({ props: Ht(s) })
        ),
          vr(e, r);
      },
      u = (e) => {
        var r = Ed();
        let o;
        var a = Pe(r),
          l = (e) => {
            var r = mr();
            Lr(Me(r), () => t.children ?? p), vr(e, r);
          },
          c = (e) => {
            var t = kd();
            ze(() => {
              Xr(t, "width", n()), Xr(t, "height", i());
            }),
              vr(e, t);
          };
        Tr(a, (e) => {
          t.children ? e(l) : e(c, !1);
        }),
          ze(() => (o = Yr(r, o, { ...Ht(s) }))),
          vr(e, r);
      };
    return (
      Tr(l, (e) => {
        t.child ? e(c) : e(u, !1);
      }),
      vr(e, a),
      le({ ...Er() })
    );
  }
  function Ad(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "id", 19, jl),
      n = Tn(t, "ref", 15, null),
      i = Cn(t, ["$$slots", "$$events", "$$legacy", "id", "ref"]);
    const o =
      ((s = {
        id: Ha.with(() => r()),
        ref: Ha.with(
          () => n(),
          (e) => n(e)
        ),
      }),
      new gd(s, yd.get()));
    var s;
    const a = _e(() => sl(i, o.props));
    return (
      Td(
        e,
        kn(() => Ht(a))
      ),
      le({ ...Er() })
    );
  }
  function Od(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "side", 3, "bottom"),
      n = Tn(t, "sideOffset", 3, 0),
      i = Tn(t, "align", 3, "center"),
      o = Tn(t, "alignOffset", 3, 0),
      s = Tn(t, "arrowPadding", 3, 0),
      a = Tn(t, "avoidCollisions", 3, !0),
      l = Tn(t, "collisionBoundary", 19, () => []),
      c = Tn(t, "collisionPadding", 3, 0),
      u = Tn(t, "hideWhenDetached", 3, !1),
      d = Tn(t, "onPlaced", 3, () => {}),
      h = Tn(t, "sticky", 3, "partial"),
      f = Tn(t, "updatePositionStrategy", 3, "optimized"),
      g = Tn(t, "strategy", 3, "fixed"),
      m = Tn(t, "dir", 3, "ltr"),
      v = Tn(t, "style", 19, () => ({})),
      y = Tn(t, "wrapperId", 19, jl),
      b = Tn(t, "customAnchor", 3, null);
    const w =
      ((x = {
        side: Ha.with(() => r()),
        sideOffset: Ha.with(() => n()),
        align: Ha.with(() => i()),
        alignOffset: Ha.with(() => o()),
        id: Ha.with(() => t.id),
        arrowPadding: Ha.with(() => s()),
        avoidCollisions: Ha.with(() => a()),
        collisionBoundary: Ha.with(() => l()),
        collisionPadding: Ha.with(() => c()),
        hideWhenDetached: Ha.with(() => u()),
        onPlaced: Ha.with(() => d()),
        sticky: Ha.with(() => h()),
        updatePositionStrategy: Ha.with(() => f()),
        strategy: Ha.with(() => g()),
        dir: Ha.with(() => m()),
        style: Ha.with(() => v()),
        enabled: Ha.with(() => t.enabled),
        wrapperId: Ha.with(() => y()),
        customAnchor: Ha.with(() => b()),
      }),
      yd.set(new fd(x, vd.get())));
    var x;
    const C = _e(() =>
      sl(w.wrapperProps, { style: { pointerEvents: "auto" } })
    );
    var S = mr();
    return (
      Lr(
        Me(S),
        () => t.content ?? p,
        () => ({ props: w.props, wrapperProps: Ht(C) })
      ),
      vr(e, S),
      le({ ...Er() })
    );
  }
  function Pd(e, t) {
    kr(new.target),
      ae(t, !0),
      In(() => {
        t.onPlaced?.();
      });
    var r = mr();
    return (
      Lr(
        Me(r),
        () => t.content ?? p,
        () => ({ props: {}, wrapperProps: {} })
      ),
      vr(e, r),
      le({ ...Er() })
    );
  }
  function Md(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "isStatic", 3, !1),
      n = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "content",
        "isStatic",
        "onPlaced",
      ]);
    var i = mr(),
      o = Me(i),
      s = (e) => {
        Pd(e, {
          get content() {
            return t.content;
          },
          get onPlaced() {
            return t.onPlaced;
          },
        });
      },
      a = (e) => {
        Od(
          e,
          kn(
            {
              get content() {
                return t.content;
              },
              get onPlaced() {
                return t.onPlaced;
              },
            },
            () => n
          )
        );
      };
    return (
      Tr(o, (e) => {
        r() ? e(s) : e(a, !1);
      }),
      vr(e, i),
      le({ ...Er() })
    );
  }
  K(Td),
    W(),
    (Ad[F] =
      "node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-arrow.svelte"),
    K(Ad),
    W(),
    (Od[F] =
      "node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content.svelte"),
    K(Od),
    W(),
    (Pd[F] =
      "node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte"),
    K(Pd),
    W(),
    (Md[F] =
      "node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-content.svelte"),
    K(Md),
    W(),
    (Id[F] =
      "node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte");
  var Nd = er(hr("<!> <!>", 1), Id[F], []);
  function Id(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "interactOutsideBehavior", 3, "close"),
      n = Tn(t, "trapFocus", 3, !0),
      i = Tn(t, "isValidEvent", 3, () => !1),
      o = Tn(t, "customAnchor", 3, null),
      s = Tn(t, "isStatic", 3, !1),
      a = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "popper",
        "onEscapeKeydown",
        "escapeKeydownBehavior",
        "preventOverflowTextSelection",
        "id",
        "onPointerDown",
        "onPointerUp",
        "side",
        "sideOffset",
        "align",
        "alignOffset",
        "arrowPadding",
        "avoidCollisions",
        "collisionBoundary",
        "collisionPadding",
        "sticky",
        "hideWhenDetached",
        "updatePositionStrategy",
        "strategy",
        "dir",
        "preventScroll",
        "wrapperId",
        "style",
        "onPlaced",
        "onInteractOutside",
        "onCloseAutoFocus",
        "onOpenAutoFocus",
        "onFocusOutside",
        "interactOutsideBehavior",
        "loop",
        "trapFocus",
        "isValidEvent",
        "customAnchor",
        "isStatic",
        "enabled",
      ]);
    {
      const l = Dr(Id, (e, o) => {
        let s = () => o?.().props;
        s();
        let l = () => o?.().wrapperProps;
        l();
        var c = Nd(),
          u = Me(c),
          d = (e) => {
            Hc(0, {
              get preventScroll() {
                return t.preventScroll;
              },
            });
          },
          h = (e, r) => {
            var n = (e) => {
              Hc(0, {
                get preventScroll() {
                  return t.preventScroll;
                },
              });
            };
            Tr(
              e,
              (e) => {
                t.forceMount || e(n);
              },
              r
            );
          };
        Tr(u, (e) => {
          t.forceMount && t.enabled ? e(d) : e(h, !1);
        });
        var f = Ne(u, 2);
        const g = _e(() => t.enabled && n());
        {
          const e = Dr(Id, (e, n) => {
            let o = () => n?.().props;
            o(),
              ic(e, {
                get onEscapeKeydown() {
                  return t.onEscapeKeydown;
                },
                get escapeKeydownBehavior() {
                  return t.escapeKeydownBehavior;
                },
                get enabled() {
                  return t.enabled;
                },
                children: Dr(Id, (e, n) => {
                  {
                    const n = Dr(Id, (e, r) => {
                      let n = () => r?.().props;
                      n(),
                        qc(e, {
                          get id() {
                            return t.id;
                          },
                          get preventOverflowTextSelection() {
                            return t.preventOverflowTextSelection;
                          },
                          get onPointerDown() {
                            return t.onPointerDown;
                          },
                          get onPointerUp() {
                            return t.onPointerUp;
                          },
                          get enabled() {
                            return t.enabled;
                          },
                          children: Dr(Id, (e, r) => {
                            var i = mr(),
                              c = Me(i),
                              u = Le(() => ({
                                props: sl(a, s(), n(), o(), {
                                  style: { pointerEvents: "auto" },
                                }),
                                wrapperProps: l(),
                              }));
                            Lr(
                              c,
                              () => t.popper ?? p,
                              () => Ht(u)
                            ),
                              vr(e, i);
                          }),
                          $$slots: { default: !0 },
                        });
                    });
                    rc(e, {
                      get id() {
                        return t.id;
                      },
                      get onInteractOutside() {
                        return t.onInteractOutside;
                      },
                      get onFocusOutside() {
                        return t.onFocusOutside;
                      },
                      get interactOutsideBehavior() {
                        return r();
                      },
                      get isValidEvent() {
                        return i();
                      },
                      get enabled() {
                        return t.enabled;
                      },
                      children: n,
                      $$slots: { default: !0 },
                    });
                  }
                }),
                $$slots: { default: !0 },
              });
          });
          Rc(f, {
            get id() {
              return t.id;
            },
            get onOpenAutoFocus() {
              return t.onOpenAutoFocus;
            },
            get onCloseAutoFocus() {
              return t.onCloseAutoFocus;
            },
            get loop() {
              return t.loop;
            },
            get trapFocus() {
              return Ht(g);
            },
            get forceMount() {
              return t.forceMount;
            },
            focusScope: e,
            $$slots: { focusScope: !0 },
          });
        }
        vr(e, c);
      });
      Md(e, {
        get isStatic() {
          return s();
        },
        get id() {
          return t.id;
        },
        get side() {
          return t.side;
        },
        get sideOffset() {
          return t.sideOffset;
        },
        get align() {
          return t.align;
        },
        get alignOffset() {
          return t.alignOffset;
        },
        get arrowPadding() {
          return t.arrowPadding;
        },
        get avoidCollisions() {
          return t.avoidCollisions;
        },
        get collisionBoundary() {
          return t.collisionBoundary;
        },
        get collisionPadding() {
          return t.collisionPadding;
        },
        get sticky() {
          return t.sticky;
        },
        get hideWhenDetached() {
          return t.hideWhenDetached;
        },
        get updatePositionStrategy() {
          return t.updatePositionStrategy;
        },
        get strategy() {
          return t.strategy;
        },
        get dir() {
          return t.dir;
        },
        get wrapperId() {
          return t.wrapperId;
        },
        get style() {
          return t.style;
        },
        get onPlaced() {
          return t.onPlaced;
        },
        get customAnchor() {
          return o();
        },
        get enabled() {
          return t.enabled;
        },
        content: l,
        $$slots: { content: !0 },
      });
    }
    return le({ ...Er() });
  }
  function _d(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "interactOutsideBehavior", 3, "close"),
      n = Tn(t, "trapFocus", 3, !0),
      i = Tn(t, "isValidEvent", 3, () => !1),
      o = Tn(t, "customAnchor", 3, null),
      s = Tn(t, "isStatic", 3, !1),
      a = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "popper",
        "present",
        "onEscapeKeydown",
        "escapeKeydownBehavior",
        "preventOverflowTextSelection",
        "id",
        "onPointerDown",
        "onPointerUp",
        "side",
        "sideOffset",
        "align",
        "alignOffset",
        "arrowPadding",
        "avoidCollisions",
        "collisionBoundary",
        "collisionPadding",
        "sticky",
        "hideWhenDetached",
        "updatePositionStrategy",
        "strategy",
        "dir",
        "preventScroll",
        "wrapperId",
        "style",
        "onPlaced",
        "onInteractOutside",
        "onCloseAutoFocus",
        "onOpenAutoFocus",
        "onFocusOutside",
        "interactOutsideBehavior",
        "loop",
        "trapFocus",
        "isValidEvent",
        "customAnchor",
        "isStatic",
      ]);
    {
      const l = Dr(_d, (e) => {
        Id(
          e,
          kn(
            {
              get popper() {
                return t.popper;
              },
              get onEscapeKeydown() {
                return t.onEscapeKeydown;
              },
              get escapeKeydownBehavior() {
                return t.escapeKeydownBehavior;
              },
              get preventOverflowTextSelection() {
                return t.preventOverflowTextSelection;
              },
              get id() {
                return t.id;
              },
              get onPointerDown() {
                return t.onPointerDown;
              },
              get onPointerUp() {
                return t.onPointerUp;
              },
              get side() {
                return t.side;
              },
              get sideOffset() {
                return t.sideOffset;
              },
              get align() {
                return t.align;
              },
              get alignOffset() {
                return t.alignOffset;
              },
              get arrowPadding() {
                return t.arrowPadding;
              },
              get avoidCollisions() {
                return t.avoidCollisions;
              },
              get collisionBoundary() {
                return t.collisionBoundary;
              },
              get collisionPadding() {
                return t.collisionPadding;
              },
              get sticky() {
                return t.sticky;
              },
              get hideWhenDetached() {
                return t.hideWhenDetached;
              },
              get updatePositionStrategy() {
                return t.updatePositionStrategy;
              },
              get strategy() {
                return t.strategy;
              },
              get dir() {
                return t.dir;
              },
              get preventScroll() {
                return t.preventScroll;
              },
              get wrapperId() {
                return t.wrapperId;
              },
              get style() {
                return t.style;
              },
              get onPlaced() {
                return t.onPlaced;
              },
              get customAnchor() {
                return o();
              },
              get isStatic() {
                return s();
              },
              get enabled() {
                return t.present;
              },
              get onInteractOutside() {
                return t.onInteractOutside;
              },
              get onCloseAutoFocus() {
                return t.onCloseAutoFocus;
              },
              get onOpenAutoFocus() {
                return t.onOpenAutoFocus;
              },
              get interactOutsideBehavior() {
                return r();
              },
              get loop() {
                return t.loop;
              },
              get trapFocus() {
                return n();
              },
              get isValidEvent() {
                return i();
              },
              get onFocusOutside() {
                return t.onFocusOutside;
              },
              forceMount: !1,
            },
            () => a
          )
        );
      });
      zl(
        e,
        kn(
          {
            get id() {
              return t.id;
            },
            get present() {
              return t.present;
            },
          },
          () => a,
          { presence: l, $$slots: { presence: !0 } }
        )
      );
    }
    return le({ ...Er() });
  }
  function Ld(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "interactOutsideBehavior", 3, "close"),
      n = Tn(t, "trapFocus", 3, !0),
      i = Tn(t, "isValidEvent", 3, () => !1),
      o = Tn(t, "customAnchor", 3, null),
      s = Tn(t, "isStatic", 3, !1),
      a = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "popper",
        "onEscapeKeydown",
        "escapeKeydownBehavior",
        "preventOverflowTextSelection",
        "id",
        "onPointerDown",
        "onPointerUp",
        "side",
        "sideOffset",
        "align",
        "alignOffset",
        "arrowPadding",
        "avoidCollisions",
        "collisionBoundary",
        "collisionPadding",
        "sticky",
        "hideWhenDetached",
        "updatePositionStrategy",
        "strategy",
        "dir",
        "preventScroll",
        "wrapperId",
        "style",
        "onPlaced",
        "onInteractOutside",
        "onCloseAutoFocus",
        "onOpenAutoFocus",
        "onFocusOutside",
        "interactOutsideBehavior",
        "loop",
        "trapFocus",
        "isValidEvent",
        "customAnchor",
        "isStatic",
        "enabled",
      ]);
    return (
      Id(
        e,
        kn(
          {
            get popper() {
              return t.popper;
            },
            get onEscapeKeydown() {
              return t.onEscapeKeydown;
            },
            get escapeKeydownBehavior() {
              return t.escapeKeydownBehavior;
            },
            get preventOverflowTextSelection() {
              return t.preventOverflowTextSelection;
            },
            get id() {
              return t.id;
            },
            get onPointerDown() {
              return t.onPointerDown;
            },
            get onPointerUp() {
              return t.onPointerUp;
            },
            get side() {
              return t.side;
            },
            get sideOffset() {
              return t.sideOffset;
            },
            get align() {
              return t.align;
            },
            get alignOffset() {
              return t.alignOffset;
            },
            get arrowPadding() {
              return t.arrowPadding;
            },
            get avoidCollisions() {
              return t.avoidCollisions;
            },
            get collisionBoundary() {
              return t.collisionBoundary;
            },
            get collisionPadding() {
              return t.collisionPadding;
            },
            get sticky() {
              return t.sticky;
            },
            get hideWhenDetached() {
              return t.hideWhenDetached;
            },
            get updatePositionStrategy() {
              return t.updatePositionStrategy;
            },
            get strategy() {
              return t.strategy;
            },
            get dir() {
              return t.dir;
            },
            get preventScroll() {
              return t.preventScroll;
            },
            get wrapperId() {
              return t.wrapperId;
            },
            get style() {
              return t.style;
            },
            get onPlaced() {
              return t.onPlaced;
            },
            get customAnchor() {
              return o();
            },
            get isStatic() {
              return s();
            },
            get enabled() {
              return t.enabled;
            },
            get onInteractOutside() {
              return t.onInteractOutside;
            },
            get onCloseAutoFocus() {
              return t.onCloseAutoFocus;
            },
            get onOpenAutoFocus() {
              return t.onOpenAutoFocus;
            },
            get interactOutsideBehavior() {
              return r();
            },
            get loop() {
              return t.loop;
            },
            get trapFocus() {
              return n();
            },
            get isValidEvent() {
              return i();
            },
            get onFocusOutside() {
              return t.onFocusOutside;
            },
          },
          () => a,
          { forceMount: !0 }
        )
      ),
      le({ ...Er() })
    );
  }
  function Dd(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "mounted", 15, !1),
      n = Tn(t, "onMountedChange", 3, Hl);
    return (
      wl(
        () => (
          r(!0),
          n()(!0),
          () => {
            r(!1), n()(!1);
          }
        )
      ),
      le({ ...Er() })
    );
  }
  K(Id),
    W(),
    (_d[F] =
      "node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte"),
    K(_d),
    W(),
    (Ld[F] =
      "node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte"),
    K(Ld),
    W(),
    (Dd[F] = "node_modules/bits-ui/dist/bits/utilities/mounted.svelte"),
    K(Dd);
  const Rd = [Pl, Nl],
    $d = [Al, "PageDown", "End"],
    Fd = [...[kl, "PageUp", Ml], ...$d];
  function Bd(e) {
    return "mouse" === e.pointerType;
  }
  function qd(e) {
    const t = _e(() => e.enabled()),
      r = xd(!1, 300, (r) => {
        Ht(t) && e.setIsPointerInTransit?.(r);
      });
    let n = me(null);
    function i() {
      ye(n, null), (r.current = !1);
    }
    function o(e, t) {
      const i = e.currentTarget;
      if (!Rl(i)) return;
      const o = { x: e.clientX, y: e.clientY },
        s = (function (e, t, r = 5) {
          const n = 1.5 * r;
          switch (t) {
            case "top":
              return [
                { x: e.x - r, y: e.y + r },
                { x: e.x, y: e.y - n },
                { x: e.x + r, y: e.y + r },
              ];
            case "bottom":
              return [
                { x: e.x - r, y: e.y - r },
                { x: e.x, y: e.y + n },
                { x: e.x + r, y: e.y - r },
              ];
            case "left":
              return [
                { x: e.x + r, y: e.y - r },
                { x: e.x - n, y: e.y },
                { x: e.x + r, y: e.y + r },
              ];
            case "right":
              return [
                { x: e.x - r, y: e.y - r },
                { x: e.x + n, y: e.y },
                { x: e.x - r, y: e.y + r },
              ];
          }
        })(
          o,
          (function (e, t) {
            const r = Math.abs(t.top - e.y),
              n = Math.abs(t.bottom - e.y),
              i = Math.abs(t.right - e.x),
              o = Math.abs(t.left - e.x);
            switch (Math.min(r, n, i, o)) {
              case o:
                return "left";
              case i:
                return "right";
              case r:
                return "top";
              case n:
                return "bottom";
              default:
                throw new Error("unreachable");
            }
          })(o, i.getBoundingClientRect())
        ),
        a = (function (e) {
          const t = e.slice();
          return (
            t.sort((e, t) =>
              e.x < t.x
                ? -1
                : e.x > t.x
                ? 1
                : e.y < t.y
                ? -1
                : e.y > t.y
                ? 1
                : 0
            ),
            (function (e) {
              if (e.length <= 1) return e.slice();
              const t = [];
              for (let r = 0; r < e.length; r++) {
                const n = e[r];
                for (; t.length >= 2; ) {
                  const e = t[t.length - 1],
                    r = t[t.length - 2];
                  if (!((e.x - r.x) * (n.y - r.y) >= (e.y - r.y) * (n.x - r.x)))
                    break;
                  t.pop();
                }
                t.push(n);
              }
              t.pop();
              const r = [];
              for (let t = e.length - 1; t >= 0; t--) {
                const n = e[t];
                for (; r.length >= 2; ) {
                  const e = r[r.length - 1],
                    t = r[r.length - 2];
                  if (!((e.x - t.x) * (n.y - t.y) >= (e.y - t.y) * (n.x - t.x)))
                    break;
                  r.pop();
                }
                r.push(n);
              }
              return (
                r.pop(),
                xe(t.length, 1) &&
                xe(r.length, 1) &&
                xe(t[0].x, r[0].x) &&
                xe(t[0].y, r[0].y)
                  ? t
                  : t.concat(r)
              );
            })(t)
          );
        })([
          ...s,
          ...(function (e) {
            const { top: t, right: r, bottom: n, left: i } = e;
            return [
              { x: i, y: t },
              { x: r, y: t },
              { x: r, y: n },
              { x: i, y: n },
            ];
          })(t.getBoundingClientRect()),
        ]);
      ye(n, a, !0), (r.current = !0);
    }
    return (
      pl([e.triggerNode, e.contentNode, e.enabled], ([e, t, r]) => {
        if (!e || !t || !r) return;
        return rl(
          lr(e, "pointerleave", (e) => {
            o(e, t);
          }),
          lr(t, "pointerleave", (t) => {
            o(t, e);
          })
        );
      }),
      pl(
        () => Ht(n),
        () =>
          lr(document, "pointermove", (t) => {
            if (!Ht(n)) return;
            const r = t.target;
            if (!$l(r)) return;
            const o = { x: t.clientX, y: t.clientY },
              s = e.triggerNode()?.contains(r) || e.contentNode()?.contains(r),
              a = !(function (e, t) {
                const { x: r, y: n } = e;
                let i = !1;
                for (let e = 0, o = t.length - 1; e < t.length; o = e++) {
                  const s = t[e].x,
                    a = t[e].y,
                    l = t[o].x,
                    c = t[o].y;
                  xe(a > n, c > n, !1) &&
                    r < ((l - s) * (n - a)) / (c - a) + s &&
                    (i = !i);
                }
                return i;
              })(o, Ht(n));
            s ? i() : a && (i(), e.onPointerExit());
          })
      ),
      { isPointerInTransit: r }
    );
  }
  function jd() {
    return {
      getShadowRoot: !0,
      displayCheck:
        "function" == typeof ResizeObserver &&
        ResizeObserver.toString().includes("[native code]")
          ? "full"
          : "none",
    };
  }
  function Hd(e, t) {
    if (!Mc(e, jd()))
      return (function (e, t) {
        if (
          !(function (e, t) {
            if (((t = t || {}), !e)) throw new Error("No node provided");
            return !1 !== fc.call(e, Nc) && Tc(t, e);
          })(e, jd())
        )
          return document.body;
        const r = (function (e, t) {
          return (t = t || {}).getShadowRoot
            ? yc([e], t.includeContainer, {
                filter: Tc.bind(null, t),
                flatten: !0,
                getShadowRoot: t.getShadowRoot,
              })
            : vc(e, t.includeContainer, Tc.bind(null, t));
        })(Jl(e).body, jd());
        "prev" === t && r.reverse();
        const n = r.indexOf(e);
        if (-1 === n) return document.body;
        const i = r.slice(n + 1);
        return i.find((e) => Mc(e, jd())) ?? document.body;
      })(e, t);
    const r = (function (e, t) {
      var r;
      return (
        (r = (t = t || {}).getShadowRoot
          ? yc([e], t.includeContainer, {
              filter: Ac.bind(null, t),
              flatten: !1,
              getShadowRoot: t.getShadowRoot,
              shadowRootFilter: Oc,
            })
          : vc(e, t.includeContainer, Ac.bind(null, t))),
        Pc(r)
      );
    })(Jl(e).body, jd());
    "prev" === t && r.reverse();
    const n = r.indexOf(e);
    if (-1 === n) return document.body;
    return r.slice(n + 1)[0];
  }
  const Vd = new gl("Menu.Root"),
    Ud = new gl("Menu.Root | Menu.Sub"),
    zd = new gl("Menu.Content");
  new gl("Menu.Group | Menu.RadioGroup"), new gl("Menu.RadioGroup");
  const Gd = new Zl("bitsmenuopen", { bubbles: !1, cancelable: !0 });
  class Wd {
    opts;
    isUsingKeyboard = new Bp();
    #ae = me(!1);
    get ignoreCloseAutoFocus() {
      return Ht(this.#ae);
    }
    set ignoreCloseAutoFocus(e) {
      ye(this.#ae, e, !0);
    }
    #le = me(!1);
    get isPointerInTransit() {
      return Ht(this.#le);
    }
    set isPointerInTransit(e) {
      ye(this.#le, e, !0);
    }
    constructor(e) {
      this.opts = e;
    }
    getAttr(e) {
      return `data-${this.opts.variant.current}-${e}`;
    }
    [G](e) {
      Y(this, e, [() => Ht(this.#ae), () => Ht(this.#le)]);
    }
  }
  class Kd {
    opts;
    root;
    parentMenu;
    contentId = Ha.with(() => "");
    #ce = me(null);
    get contentNode() {
      return Ht(this.#ce);
    }
    set contentNode(e) {
      ye(this.#ce, e, !0);
    }
    #ue = me(null);
    get triggerNode() {
      return Ht(this.#ue);
    }
    set triggerNode(e) {
      ye(this.#ue, e, !0);
    }
    constructor(e, t, r) {
      (this.opts = e),
        (this.root = t),
        (this.parentMenu = r),
        r &&
          pl(
            () => r.opts.open.current,
            () => {
              r.opts.open.current || (this.opts.open.current = !1);
            }
          );
    }
    toggleOpen() {
      this.opts.open.current = !this.opts.open.current;
    }
    onOpen() {
      this.opts.open.current = !0;
    }
    onClose() {
      this.opts.open.current = !1;
    }
    [G](e) {
      Y(this, e, [() => Ht(this.#ce), () => Ht(this.#ue)]);
    }
  }
  class Zd {
    opts;
    parentMenu;
    #de = me("");
    get search() {
      return Ht(this.#de);
    }
    set search(e) {
      ye(this.#de, e, !0);
    }
    #pe = 0;
    #he;
    rovingFocusGroup;
    #fe = me(!1);
    get mounted() {
      return Ht(this.#fe);
    }
    set mounted(e) {
      ye(this.#fe, e, !0);
    }
    #ge;
    constructor(e, t) {
      (this.opts = e),
        (this.parentMenu = t),
        (t.contentId = e.id),
        (this.#ge = e.isSub ?? !1),
        (this.onkeydown = this.onkeydown.bind(this)),
        (this.onblur = this.onblur.bind(this)),
        (this.onfocus = this.onfocus.bind(this)),
        (this.handleInteractOutside = this.handleInteractOutside.bind(this)),
        vl({
          ...e,
          deps: () => this.parentMenu.opts.open.current,
          onRefChange: (e) => {
            xe(this.parentMenu.contentNode, e, !1) &&
              (this.parentMenu.contentNode = e);
          },
        }),
        qd({
          contentNode: () => this.parentMenu.contentNode,
          triggerNode: () => this.parentMenu.triggerNode,
          enabled: () =>
            this.parentMenu.opts.open.current &&
            Boolean(
              this.parentMenu.triggerNode?.hasAttribute(
                this.parentMenu.root.getAttr("sub-trigger")
              )
            ),
          onPointerExit: () => {
            this.parentMenu.opts.open.current = !1;
          },
          setIsPointerInTransit: (e) => {
            this.parentMenu.root.isPointerInTransit = e;
          },
        }),
        (this.#he = Cd().handleTypeaheadSearch),
        (this.rovingFocusGroup = ql({
          rootNodeId: this.parentMenu.contentId,
          candidateAttr: this.parentMenu.root.getAttr("item"),
          loop: this.opts.loop,
          orientation: Ha.with(() => "vertical"),
        })),
        pl(
          () => this.parentMenu.contentNode,
          (e) => {
            if (!e) return;
            return Gd.listen(e, () => {
              bl(() => {
                this.parentMenu.root.isUsingKeyboard.current &&
                  this.rovingFocusGroup.focusFirstCandidate();
              });
            });
          }
        ),
        qe(() => {
          this.parentMenu.opts.open.current || window.clearTimeout(this.#pe);
        });
    }
    #me() {
      const e = this.parentMenu.contentNode;
      if (!e) return [];
      return Array.from(
        e.querySelectorAll(
          `[${this.parentMenu.root.getAttr("item")}]:not([data-disabled])`
        )
      );
    }
    #ve() {
      return this.parentMenu.root.isPointerInTransit;
    }
    onCloseAutoFocus = (e) => {
      this.opts.onCloseAutoFocus.current(e),
        e.defaultPrevented ||
          this.#ge ||
          (this.parentMenu.triggerNode &&
            Mc(this.parentMenu.triggerNode) &&
            this.parentMenu.triggerNode.focus());
    };
    handleTabKeyDown(e) {
      let t = this.parentMenu;
      for (; xe(t.parentMenu, null, !1); ) t = t.parentMenu;
      if (!t.triggerNode) return;
      e.preventDefault();
      const r = Hd(t.triggerNode, e.shiftKey ? "prev" : "next");
      r
        ? ((this.parentMenu.root.ignoreCloseAutoFocus = !0),
          t.onClose(),
          bl(() => {
            r.focus(),
              bl(() => {
                this.parentMenu.root.ignoreCloseAutoFocus = !1;
              });
          }))
        : document.body.focus();
    }
    onkeydown(e) {
      if (e.defaultPrevented) return;
      if (xe(e.key, "Tab")) return void this.handleTabKeyDown(e);
      const t = e.target,
        r = e.currentTarget;
      if (!Rl(t) || !Rl(r)) return;
      const n = xe(
          t.closest(`[${this.parentMenu.root.getAttr("content")}]`)?.id,
          this.parentMenu.contentId.current
        ),
        i = e.ctrlKey || e.altKey || e.metaKey,
        o = xe(e.key.length, 1);
      if (this.rovingFocusGroup.handleKeydown(t, e)) return;
      if (xe(e.code, "Space")) return;
      const s = this.#me();
      n && !i && o && this.#he(e.key, s),
        xe(e.target?.id, this.parentMenu.contentId.current, !1) ||
          (Fd.includes(e.key) &&
            (e.preventDefault(), $d.includes(e.key) && s.reverse(), lc(s)));
    }
    onblur(e) {
      $l(e.currentTarget) &&
        $l(e.target) &&
        (e.currentTarget.contains?.(e.target) ||
          (window.clearTimeout(this.#pe), (this.search = "")));
    }
    onfocus(e) {
      this.parentMenu.root.isUsingKeyboard.current &&
        bl(() => this.rovingFocusGroup.focusFirstCandidate());
    }
    onItemEnter() {
      return this.#ve();
    }
    onItemLeave(e) {
      if (
        e.currentTarget.hasAttribute(
          this.parentMenu.root.getAttr("sub-trigger")
        )
      )
        return;
      if (this.#ve() || this.parentMenu.root.isUsingKeyboard.current) return;
      const t = this.parentMenu.contentNode;
      t?.focus(), this.rovingFocusGroup.setCurrentTabStopId("");
    }
    onTriggerLeave() {
      return !!this.#ve();
    }
    onOpenAutoFocus = (e) => {
      if (e.defaultPrevented) return;
      e.preventDefault();
      const t = this.parentMenu.contentNode;
      t?.focus();
    };
    handleInteractOutside(e) {
      if (!((t = e.target) instanceof Element || t instanceof SVGElement))
        return;
      var t;
      const r = this.parentMenu.triggerNode?.id;
      (xe(e.target.id, r) || e.target.closest(`#${r}`)) && e.preventDefault();
    }
    #ye = _e(() => ({ open: this.parentMenu.opts.open.current }));
    get snippetProps() {
      return Ht(this.#ye);
    }
    set snippetProps(e) {
      ye(this.#ye, e);
    }
    #oe = _e(() => ({
      id: this.opts.id.current,
      role: "menu",
      "aria-orientation": "vertical",
      [this.parentMenu.root.getAttr("content")]: "",
      "data-state": xl(this.parentMenu.opts.open.current),
      onkeydown: this.onkeydown,
      onblur: this.onblur,
      onfocus: this.onfocus,
      dir: this.parentMenu.root.opts.dir.current,
      style: { pointerEvents: "auto" },
    }));
    get props() {
      return Ht(this.#oe);
    }
    set props(e) {
      ye(this.#oe, e);
    }
    popperProps = { onCloseAutoFocus: (e) => this.onCloseAutoFocus(e) };
    [G](e) {
      Y(this, e, [
        () => Ht(this.#de),
        () => Ht(this.#fe),
        () => Ht(this.#ye),
        () => Ht(this.#oe),
      ]);
    }
  }
  class Xd {
    opts;
    content;
    #be = me(!1);
    constructor(e, t) {
      (this.opts = e),
        (this.content = t),
        (this.onpointermove = this.onpointermove.bind(this)),
        (this.onpointerleave = this.onpointerleave.bind(this)),
        (this.onfocus = this.onfocus.bind(this)),
        (this.onblur = this.onblur.bind(this)),
        vl({ ...e, deps: () => this.content.mounted });
    }
    onpointermove(e) {
      if (!e.defaultPrevented && Bd(e))
        if (this.opts.disabled.current) this.content.onItemLeave(e);
        else {
          if (this.content.onItemEnter()) return;
          const t = e.currentTarget;
          if (!Rl(t)) return;
          t.focus();
        }
    }
    onpointerleave(e) {
      e.defaultPrevented || (Bd(e) && this.content.onItemLeave(e));
    }
    onfocus(e) {
      bl(() => {
        e.defaultPrevented || this.opts.disabled.current || ye(this.#be, !0);
      });
    }
    onblur(e) {
      bl(() => {
        e.defaultPrevented || ye(this.#be, !1);
      });
    }
    #oe = _e(() => {
      return {
        id: this.opts.id.current,
        tabindex: -1,
        role: "menuitem",
        "aria-disabled":
          ((e = this.opts.disabled.current), e ? "true" : "false"),
        "data-disabled": Sl(this.opts.disabled.current),
        "data-highlighted": Ht(this.#be) ? "" : void 0,
        [this.content.parentMenu.root.getAttr("item")]: "",
        onpointermove: this.onpointermove,
        onpointerleave: this.onpointerleave,
        onfocus: this.onfocus,
        onblur: this.onblur,
      };
      var e;
    });
    get props() {
      return Ht(this.#oe);
    }
    set props(e) {
      ye(this.#oe, e);
    }
    [G](e) {
      Y(this, e, [() => Ht(this.#oe)]);
    }
  }
  class Yd {
    opts;
    item;
    #we = !1;
    root;
    constructor(e, t) {
      (this.opts = e),
        (this.item = t),
        (this.root = t.content.parentMenu.root),
        (this.onkeydown = this.onkeydown.bind(this)),
        (this.onclick = this.onclick.bind(this)),
        (this.onpointerdown = this.onpointerdown.bind(this)),
        (this.onpointerup = this.onpointerup.bind(this));
    }
    #xe() {
      if (this.item.opts.disabled.current) return;
      const e = new CustomEvent("menuitemselect", {
        bubbles: !0,
        cancelable: !0,
      });
      this.opts.onSelect.current(e),
        bl(() => {
          e.defaultPrevented
            ? (this.item.content.parentMenu.root.isUsingKeyboard.current = !1)
            : this.opts.closeOnSelect.current &&
              this.item.content.parentMenu.root.opts.onClose();
        });
    }
    onkeydown(e) {
      const t = xe(this.item.content.search, "", !1);
      if (
        !(this.item.opts.disabled.current || (t && xe(e.key, Nl))) &&
        Rd.includes(e.key)
      ) {
        if (!Rl(e.currentTarget)) return;
        e.currentTarget.click(), e.preventDefault();
      }
    }
    onclick(e) {
      this.item.opts.disabled.current || this.#xe();
    }
    onpointerup(e) {
      if (!e.defaultPrevented && !this.#we) {
        if (!Rl(e.currentTarget)) return;
        e.currentTarget?.click();
      }
    }
    onpointerdown(e) {
      this.#we = !0;
    }
    #oe = _e(() =>
      sl(this.item.props, {
        onclick: this.onclick,
        onpointerdown: this.onpointerdown,
        onpointerup: this.onpointerup,
        onkeydown: this.onkeydown,
      })
    );
    get props() {
      return Ht(this.#oe);
    }
    set props(e) {
      ye(this.#oe, e);
    }
    [G](e) {
      Y(this, e, [() => Ht(this.#oe)]);
    }
  }
  class Qd {
    opts;
    parentMenu;
    constructor(e, t) {
      (this.opts = e),
        (this.parentMenu = t),
        (this.onpointerdown = this.onpointerdown.bind(this)),
        (this.onpointerup = this.onpointerup.bind(this)),
        (this.onkeydown = this.onkeydown.bind(this)),
        vl({
          ...e,
          onRefChange: (e) => {
            this.parentMenu.triggerNode = e;
          },
        });
    }
    onpointerdown(e) {
      if (!this.opts.disabled.current)
        return xe(e.pointerType, "touch")
          ? e.preventDefault()
          : void (
              xe(e.button, 0) &&
              xe(e.ctrlKey, !1) &&
              (this.parentMenu.toggleOpen(),
              this.parentMenu.opts.open.current || e.preventDefault())
            );
    }
    onpointerup(e) {
      this.opts.disabled.current ||
        (xe(e.pointerType, "touch") &&
          (e.preventDefault(), this.parentMenu.toggleOpen()));
    }
    onkeydown(e) {
      if (!this.opts.disabled.current)
        return xe(e.key, Nl) || xe(e.key, Pl)
          ? (this.parentMenu.toggleOpen(), void e.preventDefault())
          : void (
              xe(e.key, kl) && (this.parentMenu.onOpen(), e.preventDefault())
            );
    }
    #Ce = _e(() => {
      if (
        this.parentMenu.opts.open.current &&
        this.parentMenu.contentId.current
      )
        return this.parentMenu.contentId.current;
    });
    #oe = _e(() => ({
      id: this.opts.id.current,
      disabled: this.opts.disabled.current,
      "aria-haspopup": "menu",
      "aria-expanded": Cl(this.parentMenu.opts.open.current),
      "aria-controls": Ht(this.#Ce),
      "data-disabled": Sl(this.opts.disabled.current),
      "data-state": xl(this.parentMenu.opts.open.current),
      [this.parentMenu.root.getAttr("trigger")]: "",
      onpointerdown: this.onpointerdown,
      onpointerup: this.onpointerup,
      onkeydown: this.onkeydown,
    }));
    get props() {
      return Ht(this.#oe);
    }
    set props(e) {
      ye(this.#oe, e);
    }
    [G](e) {
      Y(this, e, [() => Ht(this.#oe)]);
    }
  }
  W(),
    (ep[F] = "node_modules/bits-ui/dist/bits/menu/components/menu-item.svelte");
  var Jd = er(hr("<div><!></div>"), ep[F], [[19, 1]]);
  function ep(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "ref", 15, null),
      n = Tn(t, "id", 19, jl),
      i = Tn(t, "disabled", 3, !1),
      o = Tn(t, "onSelect", 3, Hl),
      s = Tn(t, "closeOnSelect", 3, !0),
      a = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "child",
        "children",
        "ref",
        "id",
        "disabled",
        "onSelect",
        "closeOnSelect",
      ]);
    const l = (function (e) {
        const t = new Xd(e, zd.get());
        return new Yd(e, t);
      })({
        id: Ha.with(() => n()),
        disabled: Ha.with(() => i()),
        onSelect: Ha.with(() => o()),
        ref: Ha.with(
          () => r(),
          (e) => r(e)
        ),
        closeOnSelect: Ha.with(() => s()),
      }),
      c = _e(() => sl(a, l.props));
    var u = mr(),
      d = Me(u),
      h = (e) => {
        var r = mr();
        Lr(
          Me(r),
          () => t.child,
          () => ({ props: Ht(c) })
        ),
          vr(e, r);
      },
      f = (e) => {
        var r = Jd();
        let n;
        Lr(Pe(r), () => t.children ?? p),
          ze(() => (n = Yr(r, n, { ...Ht(c) }))),
          vr(e, r);
      };
    return (
      Tr(d, (e) => {
        t.child ? e(h) : e(f, !1);
      }),
      vr(e, u),
      le({ ...Er() })
    );
  }
  K(ep);
  class tp {
    opts;
    #ce = me(null);
    get contentNode() {
      return Ht(this.#ce);
    }
    set contentNode(e) {
      ye(this.#ce, e, !0);
    }
    #ue = me(null);
    get triggerNode() {
      return Ht(this.#ue);
    }
    set triggerNode(e) {
      ye(this.#ue, e, !0);
    }
    constructor(e) {
      this.opts = e;
    }
    toggleOpen() {
      this.opts.open.current = !this.opts.open.current;
    }
    handleClose() {
      this.opts.open.current && (this.opts.open.current = !1);
    }
    [G](e) {
      Y(this, e, [() => Ht(this.#ce), () => Ht(this.#ue)]);
    }
  }
  class rp {
    opts;
    root;
    constructor(e, t) {
      (this.opts = e),
        (this.root = t),
        vl({
          ...e,
          onRefChange: (e) => {
            this.root.triggerNode = e;
          },
        }),
        (this.onclick = this.onclick.bind(this)),
        (this.onkeydown = this.onkeydown.bind(this));
    }
    onclick(e) {
      this.opts.disabled.current ||
        xe(e.button, 0, !1) ||
        this.root.toggleOpen();
    }
    onkeydown(e) {
      this.opts.disabled.current ||
        ((xe(e.key, Pl) || xe(e.key, Nl)) &&
          (e.preventDefault(), this.root.toggleOpen()));
    }
    #Se() {
      if (this.root.opts.open.current && this.root.contentNode?.id)
        return this.root.contentNode?.id;
    }
    #oe = _e(() => ({
      id: this.opts.id.current,
      "aria-haspopup": "dialog",
      "aria-expanded": Cl(this.root.opts.open.current),
      "data-state": xl(this.root.opts.open.current),
      "aria-controls": this.#Se(),
      "data-popover-trigger": "",
      disabled: this.opts.disabled.current,
      onkeydown: this.onkeydown,
      onclick: this.onclick,
    }));
    get props() {
      return Ht(this.#oe);
    }
    set props(e) {
      ye(this.#oe, e);
    }
    [G](e) {
      Y(this, e, [() => Ht(this.#oe)]);
    }
  }
  class np {
    opts;
    root;
    constructor(e, t) {
      (this.opts = e),
        (this.root = t),
        vl({
          ...e,
          deps: () => this.root.opts.open.current,
          onRefChange: (e) => {
            this.root.contentNode = e;
          },
        });
    }
    onInteractOutside = (e) => {
      if ((this.opts.onInteractOutside.current(e), e.defaultPrevented)) return;
      if (!$l(e.target)) return;
      xe(e.target.closest("[data-popover-trigger]"), this.root.triggerNode) ||
        this.root.handleClose();
    };
    onEscapeKeydown = (e) => {
      this.opts.onEscapeKeydown.current(e),
        e.defaultPrevented || this.root.handleClose();
    };
    onCloseAutoFocus = (e) => {
      this.opts.onCloseAutoFocus.current(e),
        e.defaultPrevented ||
          (e.preventDefault(), this.root.triggerNode?.focus());
    };
    #ye = _e(() => ({ open: this.root.opts.open.current }));
    get snippetProps() {
      return Ht(this.#ye);
    }
    set snippetProps(e) {
      ye(this.#ye, e);
    }
    #oe = _e(() => ({
      id: this.opts.id.current,
      tabindex: -1,
      "data-state": xl(this.root.opts.open.current),
      "data-popover-content": "",
      style: { pointerEvents: "auto" },
    }));
    get props() {
      return Ht(this.#oe);
    }
    set props(e) {
      ye(this.#oe, e);
    }
    popperProps = {
      onInteractOutside: this.onInteractOutside,
      onEscapeKeydown: this.onEscapeKeydown,
      onCloseAutoFocus: this.onCloseAutoFocus,
    };
    [G](e) {
      Y(this, e, [() => Ht(this.#ye), () => Ht(this.#oe)]);
    }
  }
  const ip = new gl("Popover.Root");
  W(),
    (ap[F] =
      "node_modules/bits-ui/dist/bits/popover/components/popover-content.svelte");
  var op = er(hr("<div><div><!></div></div>"), ap[F], [[37, 4, [[38, 5]]]]),
    sp = er(hr("<div><div><!></div></div>"), ap[F], [[63, 4, [[64, 5]]]]);
  function ap(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "ref", 15, null),
      n = Tn(t, "id", 19, jl),
      i = Tn(t, "forceMount", 3, !1),
      o = Tn(t, "onCloseAutoFocus", 3, Hl),
      s = Tn(t, "onEscapeKeydown", 3, Hl),
      a = Tn(t, "onInteractOutside", 3, Hl),
      l = Tn(t, "trapFocus", 3, !0),
      c = Tn(t, "preventScroll", 3, !1),
      u = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "child",
        "children",
        "ref",
        "id",
        "forceMount",
        "onCloseAutoFocus",
        "onEscapeKeydown",
        "onInteractOutside",
        "trapFocus",
        "preventScroll",
      ]);
    const d =
      ((h = {
        id: Ha.with(() => n()),
        ref: Ha.with(
          () => r(),
          (e) => r(e)
        ),
        onInteractOutside: Ha.with(() => a()),
        onEscapeKeydown: Ha.with(() => s()),
        onCloseAutoFocus: Ha.with(() => o()),
      }),
      new np(h, ip.get()));
    var h;
    const f = _e(() => sl(u, d.props));
    var g = mr(),
      m = Me(g),
      v = (e) => {
        {
          const r = Dr(ap, (e, r) => {
            let n = () => r?.().props;
            n();
            let i = () => r?.().wrapperProps;
            i();
            var o = mr();
            const s = _e(() => sl(n(), { style: dd("popover") }));
            Ht(s);
            var a = Me(o),
              l = (e) => {
                var r = mr(),
                  n = Me(r),
                  o = Le(() => ({
                    props: Ht(s),
                    wrapperProps: i(),
                    ...d.snippetProps,
                  }));
                Lr(
                  n,
                  () => t.child,
                  () => Ht(o)
                ),
                  vr(e, r);
              },
              c = (e) => {
                var r = op();
                let n;
                var o = Pe(r);
                let a;
                Lr(Pe(o), () => t.children ?? p),
                  ze(() => {
                    (n = Yr(r, n, { ...i() })), (a = Yr(o, a, { ...Ht(s) }));
                  }),
                  vr(e, r);
              };
            Tr(a, (e) => {
              t.child ? e(l) : e(c, !1);
            }),
              vr(e, o);
          });
          Ld(
            e,
            kn(
              () => Ht(f),
              () => d.popperProps,
              {
                get enabled() {
                  return d.root.opts.open.current;
                },
                get id() {
                  return n();
                },
                get trapFocus() {
                  return l();
                },
                get preventScroll() {
                  return c();
                },
                loop: !0,
                forceMount: !0,
                popper: r,
                $$slots: { popper: !0 },
              }
            )
          );
        }
      },
      y = (e, r) => {
        var o = (e) => {
          {
            const r = Dr(ap, (e, r) => {
              let n = () => r?.().props;
              n();
              let i = () => r?.().wrapperProps;
              i();
              var o = mr();
              const s = _e(() => sl(n(), { style: dd("popover") }));
              Ht(s);
              var a = Me(o),
                l = (e) => {
                  var r = mr(),
                    n = Me(r),
                    o = Le(() => ({
                      props: Ht(s),
                      wrapperProps: i(),
                      ...d.snippetProps,
                    }));
                  Lr(
                    n,
                    () => t.child,
                    () => Ht(o)
                  ),
                    vr(e, r);
                },
                c = (e) => {
                  var r = sp();
                  let n;
                  var o = Pe(r);
                  let a;
                  Lr(Pe(o), () => t.children ?? p),
                    ze(() => {
                      (n = Yr(r, n, { ...i() })), (a = Yr(o, a, { ...Ht(s) }));
                    }),
                    vr(e, r);
                };
              Tr(a, (e) => {
                t.child ? e(l) : e(c, !1);
              }),
                vr(e, o);
            });
            _d(
              e,
              kn(
                () => Ht(f),
                () => d.popperProps,
                {
                  get present() {
                    return d.root.opts.open.current;
                  },
                  get id() {
                    return n();
                  },
                  get trapFocus() {
                    return l();
                  },
                  get preventScroll() {
                    return c();
                  },
                  loop: !0,
                  forceMount: !1,
                  popper: r,
                  $$slots: { popper: !0 },
                }
              )
            );
          }
        };
        Tr(
          e,
          (e) => {
            i() || e(o);
          },
          r
        );
      };
    return (
      Tr(m, (e) => {
        i() ? e(v) : e(y, !1);
      }),
      vr(e, g),
      le({ ...Er() })
    );
  }
  K(ap),
    W(),
    (cp[F] =
      "node_modules/bits-ui/dist/bits/popover/components/popover-trigger.svelte");
  var lp = er(hr("<button><!></button>"), cp[F], [[18, 2]]);
  function cp(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "id", 19, jl),
      n = Tn(t, "ref", 15, null),
      i = Tn(t, "type", 3, "button"),
      o = Tn(t, "disabled", 3, !1),
      s = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "children",
        "child",
        "id",
        "ref",
        "type",
        "disabled",
      ]);
    const a =
      ((l = {
        id: Ha.with(() => r()),
        ref: Ha.with(
          () => n(),
          (e) => n(e)
        ),
        disabled: Ha.with(() => Boolean(o())),
      }),
      new rp(l, ip.get()));
    var l;
    const c = _e(() => sl(s, a.props, { type: i() }));
    return (
      Sd(e, {
        get id() {
          return r();
        },
        children: Dr(cp, (e, r) => {
          var n = mr(),
            i = Me(n),
            o = (e) => {
              var r = mr();
              Lr(
                Me(r),
                () => t.child,
                () => ({ props: Ht(c) })
              ),
                vr(e, r);
            },
            s = (e) => {
              var r = lp();
              let n;
              Lr(Pe(r), () => t.children ?? p),
                ze(() => (n = Yr(r, n, { ...Ht(c) }))),
                vr(e, r);
            };
          Tr(i, (e) => {
            t.child ? e(o) : e(s, !1);
          }),
            vr(e, n);
        }),
        $$slots: { default: !0 },
      }),
      le({ ...Er() })
    );
  }
  function up(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "ref", 15, null),
      n = Cn(t, ["$$slots", "$$events", "$$legacy", "ref"]);
    return (
      X(r, Ad),
      Ad(
        e,
        kn(() => n, {
          "data-popover-arrow": "",
          get ref() {
            return r();
          },
          set ref(e) {
            r(e);
          },
        })
      ),
      le({ ...Er() })
    );
  }
  function dp(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "open", 15, !1),
      n = Tn(t, "dir", 3, "ltr"),
      i = Tn(t, "onOpenChange", 3, Hl),
      o = Tn(t, "_internal_variant", 3, "dropdown-menu");
    return (
      (function (e, t) {
        Ud.set(new Kd(t, e, null));
      })(
        (function (e) {
          const t = new Wd(e);
          return (
            Lc.set({
              get ignoreCloseAutoFocus() {
                return t.ignoreCloseAutoFocus;
              },
            }),
            Vd.set(t)
          );
        })({
          variant: Ha.with(() => o()),
          dir: Ha.with(() => n()),
          onClose: () => {
            r(!1), i()(!1);
          },
        }),
        {
          open: Ha.with(
            () => r(),
            (e) => {
              r(e), i()(e);
            }
          ),
        }
      ),
      wd(e, {
        children: Dr(dp, (e, r) => {
          var n = mr();
          Lr(Me(n), () => t.children ?? p), vr(e, n);
        }),
        $$slots: { default: !0 },
      }),
      le({ ...Er() })
    );
  }
  K(cp),
    W(),
    (up[F] =
      "node_modules/bits-ui/dist/bits/popover/components/popover-arrow.svelte"),
    K(up),
    W(),
    (dp[F] = "node_modules/bits-ui/dist/bits/menu/components/menu.svelte"),
    K(dp),
    W(),
    (mp[F] =
      "node_modules/bits-ui/dist/bits/dropdown-menu/components/dropdown-menu-content.svelte");
  var pp = er(hr("<div><div><!></div></div>"), mp[F], [[53, 4, [[54, 5]]]]),
    hp = er(hr("<!> <!>", 1), mp[F], []),
    fp = er(hr("<div><div><!></div></div>"), mp[F], [[81, 4, [[82, 5]]]]),
    gp = er(hr("<!> <!>", 1), mp[F], []);
  function mp(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "id", 19, jl),
      n = Tn(t, "ref", 15, null),
      i = Tn(t, "loop", 3, !0),
      o = Tn(t, "onInteractOutside", 3, Hl),
      s = Tn(t, "onEscapeKeydown", 3, Hl),
      a = Tn(t, "onCloseAutoFocus", 3, Hl),
      l = Tn(t, "forceMount", 3, !1),
      c = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "id",
        "child",
        "children",
        "ref",
        "loop",
        "onInteractOutside",
        "onEscapeKeydown",
        "onCloseAutoFocus",
        "forceMount",
      ]);
    const u =
      ((d = {
        id: Ha.with(() => r()),
        loop: Ha.with(() => i()),
        ref: Ha.with(
          () => n(),
          (e) => n(e)
        ),
        onCloseAutoFocus: Ha.with(() => a()),
      }),
      zd.set(new Zd(d, Ud.get())));
    var d;
    const h = _e(() => sl(c, u.props));
    function f(e) {
      u.handleInteractOutside(e),
        e.defaultPrevented ||
          (o()(e), e.defaultPrevented || u.parentMenu.onClose());
    }
    function g(e) {
      s()(e), e.defaultPrevented || u.parentMenu.onClose();
    }
    var m = mr(),
      v = Me(m),
      y = (e) => {
        {
          const n = Dr(mp, (e, r) => {
            let n = () => r?.().props;
            n();
            let i = () => r?.().wrapperProps;
            i();
            var o = hp();
            const s = _e(() => sl(n(), { style: dd("dropdown-menu") }));
            Ht(s);
            var a = Me(o),
              l = (e) => {
                var r = mr(),
                  n = Me(r),
                  o = Le(() => ({
                    props: Ht(s),
                    wrapperProps: i(),
                    ...u.snippetProps,
                  }));
                Lr(
                  n,
                  () => t.child,
                  () => Ht(o)
                ),
                  vr(e, r);
              },
              c = (e) => {
                var r = pp();
                let n;
                var o = Pe(r);
                let a;
                Lr(Pe(o), () => t.children ?? p),
                  ze(() => {
                    (n = Yr(r, n, { ...i() })), (a = Yr(o, a, { ...Ht(s) }));
                  }),
                  vr(e, r);
              };
            Tr(a, (e) => {
              t.child ? e(l) : e(c, !1);
            });
            Ne(a, 2);
            An(
              0,
              () => u,
              () => "mounted"
            ),
              X(() => u.mounted, Dd),
              Dd(0, {
                get mounted() {
                  return u.mounted;
                },
                set mounted(e) {
                  u.mounted = e;
                },
              }),
              vr(e, o);
          });
          Ld(
            e,
            kn(
              () => Ht(h),
              () => u.popperProps,
              {
                get enabled() {
                  return u.parentMenu.opts.open.current;
                },
                onInteractOutside: f,
                onEscapeKeydown: g,
                trapFocus: !0,
                get loop() {
                  return i();
                },
                forceMount: !0,
                get id() {
                  return r();
                },
                popper: n,
                $$slots: { popper: !0 },
              }
            )
          );
        }
      },
      b = (e, n) => {
        var o = (e) => {
          {
            const n = Dr(mp, (e, r) => {
              let n = () => r?.().props;
              n();
              let i = () => r?.().wrapperProps;
              i();
              var o = gp();
              const s = _e(() => sl(n(), { style: dd("dropdown-menu") }));
              Ht(s);
              var a = Me(o),
                l = (e) => {
                  var r = mr(),
                    n = Me(r),
                    o = Le(() => ({
                      props: Ht(s),
                      wrapperProps: i(),
                      ...u.snippetProps,
                    }));
                  Lr(
                    n,
                    () => t.child,
                    () => Ht(o)
                  ),
                    vr(e, r);
                },
                c = (e) => {
                  var r = fp();
                  let n;
                  var o = Pe(r);
                  let a;
                  Lr(Pe(o), () => t.children ?? p),
                    ze(() => {
                      (n = Yr(r, n, { ...i() })), (a = Yr(o, a, { ...Ht(s) }));
                    }),
                    vr(e, r);
                };
              Tr(a, (e) => {
                t.child ? e(l) : e(c, !1);
              });
              Ne(a, 2);
              An(
                0,
                () => u,
                () => "mounted"
              ),
                X(() => u.mounted, Dd),
                Dd(0, {
                  get mounted() {
                    return u.mounted;
                  },
                  set mounted(e) {
                    u.mounted = e;
                  },
                }),
                vr(e, o);
            });
            _d(
              e,
              kn(
                () => Ht(h),
                () => u.popperProps,
                {
                  get present() {
                    return u.parentMenu.opts.open.current;
                  },
                  onInteractOutside: f,
                  onEscapeKeydown: g,
                  trapFocus: !0,
                  get loop() {
                    return i();
                  },
                  forceMount: !1,
                  get id() {
                    return r();
                  },
                  popper: n,
                  $$slots: { popper: !0 },
                }
              )
            );
          }
        };
        Tr(
          e,
          (e) => {
            l() || e(o);
          },
          n
        );
      };
    return (
      Tr(v, (e) => {
        l() ? e(y) : e(b, !1);
      }),
      vr(e, m),
      le({ ...Er() })
    );
  }
  K(mp),
    W(),
    (yp[F] =
      "node_modules/bits-ui/dist/bits/menu/components/menu-trigger.svelte");
  var vp = er(hr("<button><!></button>"), yp[F], [[18, 2]]);
  function yp(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "id", 19, jl),
      n = Tn(t, "ref", 15, null),
      i = Tn(t, "disabled", 3, !1),
      o = Tn(t, "type", 3, "button"),
      s = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "id",
        "ref",
        "child",
        "children",
        "disabled",
        "type",
      ]);
    const a =
      ((l = {
        id: Ha.with(() => r()),
        disabled: Ha.with(() => i() ?? !1),
        ref: Ha.with(
          () => n(),
          (e) => n(e)
        ),
      }),
      new Qd(l, Ud.get()));
    var l;
    const c = _e(() => sl(s, a.props, { type: o() }));
    return (
      Sd(e, {
        get id() {
          return r();
        },
        children: Dr(yp, (e, r) => {
          var n = mr(),
            i = Me(n),
            o = (e) => {
              var r = mr();
              Lr(
                Me(r),
                () => t.child,
                () => ({ props: Ht(c) })
              ),
                vr(e, r);
            },
            s = (e) => {
              var r = vp();
              let n;
              Lr(Pe(r), () => t.children ?? p),
                ze(() => (n = Yr(r, n, { ...Ht(c) }))),
                vr(e, r);
            };
          Tr(i, (e) => {
            t.child ? e(o) : e(s, !1);
          }),
            vr(e, n);
        }),
        $$slots: { default: !0 },
      }),
      le({ ...Er() })
    );
  }
  function bp(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "open", 15, !1),
      n = Tn(t, "onOpenChange", 3, Hl);
    var i;
    return (
      (i = {
        open: Ha.with(
          () => r(),
          (e) => {
            r(e), n()(e);
          }
        ),
      }),
      ip.set(new tp(i)),
      wd(e, {
        children: Dr(bp, (e, r) => {
          var n = mr();
          Lr(Me(n), () => t.children ?? p), vr(e, n);
        }),
        $$slots: { default: !0 },
      }),
      le({ ...Er() })
    );
  }
  function wp(e, t, r = {}) {
    const { immediate: n = !0 } = r,
      i = Ha(!1);
    let o;
    function s() {
      o && (clearTimeout(o), (o = null));
    }
    function a() {
      (i.current = !1), s();
    }
    function l(...r) {
      s(),
        (i.current = !0),
        (o = setTimeout(() => {
          (i.current = !1), (o = null), e(...r);
        }, t));
    }
    return (
      n && ((i.current = !0), Ll && l()),
      ml(() => {
        a();
      }),
      { isPending: Ha.readonly(i), start: l, stop: a }
    );
  }
  K(yp),
    W(),
    (bp[F] =
      "node_modules/bits-ui/dist/bits/popover/components/popover.svelte"),
    K(bp);
  const xp = "data-tooltip-content",
    Cp = "data-tooltip-trigger",
    Sp = new Zl("bits.tooltip.open", { bubbles: !1, cancelable: !1 });
  class kp {
    opts;
    #ke = me(!0);
    get isOpenDelayed() {
      return Ht(this.#ke);
    }
    set isOpenDelayed(e) {
      ye(this.#ke, e, !0);
    }
    isPointerInTransit = Ha(!1);
    #Ee;
    constructor(e) {
      (this.opts = e),
        (this.#Ee = wp(
          () => {
            this.isOpenDelayed = !0;
          },
          this.opts.skipDelayDuration.current,
          { immediate: !1 }
        ));
    }
    #Te = () => {
      this.#Ee.start();
    };
    #Ae = () => {
      this.#Ee.stop();
    };
    onOpen = () => {
      this.#Ae(), (this.isOpenDelayed = !1);
    };
    onClose = () => {
      this.#Te();
    };
    [G](e) {
      Y(this, e, [() => Ht(this.#ke)]);
    }
  }
  class Ep {
    opts;
    provider;
    #Oe = _e(
      () =>
        this.opts.delayDuration.current ??
        this.provider.opts.delayDuration.current
    );
    get delayDuration() {
      return Ht(this.#Oe);
    }
    set delayDuration(e) {
      ye(this.#Oe, e);
    }
    #Pe = _e(
      () =>
        this.opts.disableHoverableContent.current ??
        this.provider.opts.disableHoverableContent.current
    );
    get disableHoverableContent() {
      return Ht(this.#Pe);
    }
    set disableHoverableContent(e) {
      ye(this.#Pe, e);
    }
    #Me = _e(
      () =>
        this.opts.disableCloseOnTriggerClick.current ??
        this.provider.opts.disableCloseOnTriggerClick.current
    );
    get disableCloseOnTriggerClick() {
      return Ht(this.#Me);
    }
    set disableCloseOnTriggerClick(e) {
      ye(this.#Me, e);
    }
    #Ne = _e(
      () => this.opts.disabled.current ?? this.provider.opts.disabled.current
    );
    get disabled() {
      return Ht(this.#Ne);
    }
    set disabled(e) {
      ye(this.#Ne, e);
    }
    #Ie = _e(
      () =>
        this.opts.ignoreNonKeyboardFocus.current ??
        this.provider.opts.ignoreNonKeyboardFocus.current
    );
    get ignoreNonKeyboardFocus() {
      return Ht(this.#Ie);
    }
    set ignoreNonKeyboardFocus(e) {
      ye(this.#Ie, e);
    }
    #ce = me(null);
    get contentNode() {
      return Ht(this.#ce);
    }
    set contentNode(e) {
      ye(this.#ce, e, !0);
    }
    #ue = me(null);
    get triggerNode() {
      return Ht(this.#ue);
    }
    set triggerNode(e) {
      ye(this.#ue, e, !0);
    }
    #_e = me(!1);
    #Ee;
    #Le = _e(() =>
      this.opts.open.current
        ? Ht(this.#_e)
          ? "delayed-open"
          : "instant-open"
        : "closed"
    );
    get stateAttr() {
      return Ht(this.#Le);
    }
    set stateAttr(e) {
      ye(this.#Le, e);
    }
    constructor(e, t) {
      (this.opts = e),
        (this.provider = t),
        (this.#Ee = wp(
          () => {
            ye(this.#_e, !0), (this.opts.open.current = !0);
          },
          this.delayDuration ?? 0,
          { immediate: !1 }
        )),
        pl(
          () => this.delayDuration,
          () => {
            xe(this.delayDuration, void 0) ||
              (this.#Ee = wp(
                () => {
                  ye(this.#_e, !0), (this.opts.open.current = !0);
                },
                this.delayDuration,
                { immediate: !1 }
              ));
          }
        ),
        pl(
          () => this.opts.open.current,
          (e) => {
            this.provider.onClose &&
              (e
                ? (this.provider.onOpen(), Sp.dispatch(document))
                : this.provider.onClose());
          }
        );
    }
    handleOpen = () => {
      this.#Ee.stop(), ye(this.#_e, !1), (this.opts.open.current = !0);
    };
    handleClose = () => {
      this.#Ee.stop(), (this.opts.open.current = !1);
    };
    #De = () => {
      this.#Ee.start();
    };
    onTriggerEnter = () => {
      this.#De();
    };
    onTriggerLeave = () => {
      this.disableHoverableContent ? this.handleClose() : this.#Ee.stop();
    };
    [G](e) {
      Y(this, e, [
        () => Ht(this.#Oe),
        () => Ht(this.#Pe),
        () => Ht(this.#Me),
        () => Ht(this.#Ne),
        () => Ht(this.#Ie),
        () => Ht(this.#ce),
        () => Ht(this.#ue),
        () => Ht(this.#Le),
      ]);
    }
  }
  class Tp {
    opts;
    root;
    #we = Ha(!1);
    #Re = me(!1);
    #$e = _e(() => this.opts.disabled.current || this.root.disabled);
    constructor(e, t) {
      (this.opts = e),
        (this.root = t),
        vl({
          ...e,
          onRefChange: (e) => {
            this.root.triggerNode = e;
          },
        });
    }
    handlePointerUp = () => {
      this.#we.current = !1;
    };
    #Fe = () => {
      Ht(this.#$e) || (this.#we.current = !1);
    };
    #Be = () => {
      Ht(this.#$e) ||
        ((this.#we.current = !0),
        document.addEventListener(
          "pointerup",
          () => {
            this.handlePointerUp();
          },
          { once: !0 }
        ));
    };
    #qe = (e) => {
      Ht(this.#$e) ||
        xe(e.pointerType, "touch") ||
        Ht(this.#Re) ||
        this.root.provider.isPointerInTransit.current ||
        (this.root.onTriggerEnter(), ye(this.#Re, !0));
    };
    #je = () => {
      Ht(this.#$e) || (this.root.onTriggerLeave(), ye(this.#Re, !1));
    };
    #He = (e) => {
      this.#we.current ||
        Ht(this.#$e) ||
        (this.root.ignoreNonKeyboardFocus &&
          !e.currentTarget.matches(":focus-visible")) ||
        this.root.handleOpen();
    };
    #Ve = () => {
      Ht(this.#$e) || this.root.handleClose();
    };
    #Ue = () => {
      this.root.disableCloseOnTriggerClick ||
        Ht(this.#$e) ||
        this.root.handleClose();
    };
    #oe = _e(() => ({
      id: this.opts.id.current,
      "aria-describedby": this.root.opts.open.current
        ? this.root.contentNode?.id
        : void 0,
      "data-state": this.root.stateAttr,
      "data-disabled": Sl(Ht(this.#$e)),
      "data-delay-duration": `${this.root.delayDuration}`,
      [Cp]: "",
      tabindex: Ht(this.#$e) ? void 0 : 0,
      disabled: this.opts.disabled.current,
      onpointerup: this.#Fe,
      onpointerdown: this.#Be,
      onpointermove: this.#qe,
      onpointerleave: this.#je,
      onfocus: this.#He,
      onblur: this.#Ve,
      onclick: this.#Ue,
    }));
    get props() {
      return Ht(this.#oe);
    }
    set props(e) {
      ye(this.#oe, e);
    }
    [G](e) {
      Y(this, e, [() => Ht(this.#oe)]);
    }
  }
  class Ap {
    opts;
    root;
    constructor(e, t) {
      (this.opts = e),
        (this.root = t),
        vl({
          ...e,
          onRefChange: (e) => {
            this.root.contentNode = e;
          },
          deps: () => this.root.opts.open.current,
        }),
        qd({
          triggerNode: () => this.root.triggerNode,
          contentNode: () => this.root.contentNode,
          enabled: () =>
            this.root.opts.open.current && !this.root.disableHoverableContent,
          onPointerExit: () => {
            this.root.handleClose();
          },
          setIsPointerInTransit: (e) => {
            this.root.provider.isPointerInTransit.current = e;
          },
        }),
        wl(() =>
          rl(
            lr(window, "scroll", (e) => {
              const t = e.target;
              t && t.contains(this.root.triggerNode) && this.root.handleClose();
            }),
            Sp.listen(window, this.root.handleClose)
          )
        );
    }
    onInteractOutside = (e) => {
      $l(e.target) &&
      this.root.triggerNode?.contains(e.target) &&
      this.root.disableCloseOnTriggerClick
        ? e.preventDefault()
        : (this.opts.onInteractOutside.current(e),
          e.defaultPrevented || this.root.handleClose());
    };
    onEscapeKeydown = (e) => {
      this.opts.onEscapeKeydown.current?.(e),
        e.defaultPrevented || this.root.handleClose();
    };
    onOpenAutoFocus = (e) => {
      e.preventDefault();
    };
    onCloseAutoFocus = (e) => {
      e.preventDefault();
    };
    #ye = _e(() => ({ open: this.root.opts.open.current }));
    get snippetProps() {
      return Ht(this.#ye);
    }
    set snippetProps(e) {
      ye(this.#ye, e);
    }
    #oe = _e(() => ({
      id: this.opts.id.current,
      "data-state": this.root.stateAttr,
      "data-disabled": Sl(this.root.disabled),
      style: { pointerEvents: "auto", outline: "none" },
      [xp]: "",
    }));
    get props() {
      return Ht(this.#oe);
    }
    set props(e) {
      ye(this.#oe, e);
    }
    popperProps = {
      onInteractOutside: this.onInteractOutside,
      onEscapeKeydown: this.onEscapeKeydown,
      onOpenAutoFocus: this.onOpenAutoFocus,
      onCloseAutoFocus: this.onCloseAutoFocus,
    };
    [G](e) {
      Y(this, e, [() => Ht(this.#ye), () => Ht(this.#oe)]);
    }
  }
  const Op = new gl("Tooltip.Provider"),
    Pp = new gl("Tooltip.Root");
  function Mp(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "open", 15, !1),
      n = Tn(t, "onOpenChange", 3, Hl);
    var i;
    return (
      (i = {
        open: Ha.with(
          () => r(),
          (e) => {
            r(e), n()(e);
          }
        ),
        delayDuration: Ha.with(() => t.delayDuration),
        disableCloseOnTriggerClick: Ha.with(() => t.disableCloseOnTriggerClick),
        disableHoverableContent: Ha.with(() => t.disableHoverableContent),
        ignoreNonKeyboardFocus: Ha.with(() => t.ignoreNonKeyboardFocus),
        disabled: Ha.with(() => t.disabled),
      }),
      Pp.set(new Ep(i, Op.get())),
      wd(e, {
        children: Dr(Mp, (e, r) => {
          var n = mr();
          Lr(Me(n), () => t.children ?? p), vr(e, n);
        }),
        $$slots: { default: !0 },
      }),
      le({ ...Er() })
    );
  }
  W(),
    (Mp[F] =
      "node_modules/bits-ui/dist/bits/tooltip/components/tooltip.svelte"),
    K(Mp),
    W(),
    (_p[F] =
      "node_modules/bits-ui/dist/bits/tooltip/components/tooltip-content.svelte");
  var Np = er(hr("<div><div><!></div></div>"), _p[F], [[46, 4, [[47, 5]]]]),
    Ip = er(hr("<div><div><!></div></div>"), _p[F], [[72, 4, [[73, 5]]]]);
  function _p(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "id", 19, jl),
      n = Tn(t, "ref", 15, null),
      i = Tn(t, "side", 3, "top"),
      o = Tn(t, "sideOffset", 3, 0),
      s = Tn(t, "align", 3, "center"),
      a = Tn(t, "avoidCollisions", 3, !0),
      l = Tn(t, "arrowPadding", 3, 0),
      c = Tn(t, "sticky", 3, "partial"),
      u = Tn(t, "hideWhenDetached", 3, !1),
      d = Tn(t, "collisionPadding", 3, 0),
      h = Tn(t, "onInteractOutside", 3, Hl),
      f = Tn(t, "onEscapeKeydown", 3, Hl),
      g = Tn(t, "forceMount", 3, !1),
      m = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "children",
        "child",
        "id",
        "ref",
        "side",
        "sideOffset",
        "align",
        "avoidCollisions",
        "arrowPadding",
        "sticky",
        "hideWhenDetached",
        "collisionPadding",
        "onInteractOutside",
        "onEscapeKeydown",
        "forceMount",
      ]);
    const v =
      ((y = {
        id: Ha.with(() => r()),
        ref: Ha.with(
          () => n(),
          (e) => n(e)
        ),
        onInteractOutside: Ha.with(() => h()),
        onEscapeKeydown: Ha.with(() => f()),
      }),
      new Ap(y, Pp.get()));
    var y;
    const b = _e(() => ({
        side: i(),
        sideOffset: o(),
        align: s(),
        avoidCollisions: a(),
        arrowPadding: l(),
        sticky: c(),
        hideWhenDetached: u(),
        collisionPadding: d(),
      })),
      w = _e(() => sl(m, Ht(b), v.props));
    var x = mr(),
      C = Me(x),
      S = (e) => {
        {
          const n = Dr(_p, (e, r) => {
            let n = () => r?.().props;
            n();
            let i = () => r?.().wrapperProps;
            i();
            var o = mr();
            const s = _e(() => sl(n(), { style: dd("tooltip") }));
            Ht(s);
            var a = Me(o),
              l = (e) => {
                var r = mr(),
                  n = Me(r),
                  o = Le(() => ({
                    props: Ht(s),
                    wrapperProps: i(),
                    ...v.snippetProps,
                  }));
                Lr(
                  n,
                  () => t.child,
                  () => Ht(o)
                ),
                  vr(e, r);
              },
              c = (e) => {
                var r = Np();
                let n;
                var o = Pe(r);
                let a;
                Lr(Pe(o), () => t.children ?? p),
                  ze(() => {
                    (n = Yr(r, n, { ...i() })), (a = Yr(o, a, { ...Ht(s) }));
                  }),
                  vr(e, r);
              };
            Tr(a, (e) => {
              t.child ? e(l) : e(c, !1);
            }),
              vr(e, o);
          });
          Ld(
            e,
            kn(
              () => Ht(w),
              () => v.popperProps,
              {
                get enabled() {
                  return v.root.opts.open.current;
                },
                get id() {
                  return r();
                },
                trapFocus: !1,
                loop: !1,
                preventScroll: !1,
                forceMount: !0,
                popper: n,
                $$slots: { popper: !0 },
              }
            )
          );
        }
      },
      k = (e, n) => {
        var i = (e) => {
          {
            const n = Dr(_p, (e, r) => {
              let n = () => r?.().props;
              n();
              let i = () => r?.().wrapperProps;
              i();
              var o = mr();
              const s = _e(() => sl(n(), { style: dd("tooltip") }));
              Ht(s);
              var a = Me(o),
                l = (e) => {
                  var r = mr(),
                    n = Me(r),
                    o = Le(() => ({
                      props: Ht(s),
                      wrapperProps: i(),
                      ...v.snippetProps,
                    }));
                  Lr(
                    n,
                    () => t.child,
                    () => Ht(o)
                  ),
                    vr(e, r);
                },
                c = (e) => {
                  var r = Ip();
                  let n;
                  var o = Pe(r);
                  let a;
                  Lr(Pe(o), () => t.children ?? p),
                    ze(() => {
                      (n = Yr(r, n, { ...i() })), (a = Yr(o, a, { ...Ht(s) }));
                    }),
                    vr(e, r);
                };
              Tr(a, (e) => {
                t.child ? e(l) : e(c, !1);
              }),
                vr(e, o);
            });
            _d(
              e,
              kn(
                () => Ht(w),
                () => v.popperProps,
                {
                  get present() {
                    return v.root.opts.open.current;
                  },
                  get id() {
                    return r();
                  },
                  trapFocus: !1,
                  loop: !1,
                  preventScroll: !1,
                  forceMount: !1,
                  popper: n,
                  $$slots: { popper: !0 },
                }
              )
            );
          }
        };
        Tr(
          e,
          (e) => {
            g() || e(i);
          },
          n
        );
      };
    return (
      Tr(C, (e) => {
        g() ? e(S) : e(k, !1);
      }),
      vr(e, x),
      le({ ...Er() })
    );
  }
  K(_p),
    W(),
    (Dp[F] =
      "node_modules/bits-ui/dist/bits/tooltip/components/tooltip-trigger.svelte");
  var Lp = er(hr("<button><!></button>"), Dp[F], [[18, 2]]);
  function Dp(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "id", 19, jl),
      n = Tn(t, "disabled", 3, !1),
      i = Tn(t, "type", 3, "button"),
      o = Tn(t, "ref", 15, null),
      s = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "children",
        "child",
        "id",
        "disabled",
        "type",
        "ref",
      ]);
    const a =
      ((l = {
        id: Ha.with(() => r()),
        disabled: Ha.with(() => n() ?? !1),
        ref: Ha.with(
          () => o(),
          (e) => o(e)
        ),
      }),
      new Tp(l, Pp.get()));
    var l;
    const c = _e(() => sl(s, a.props, { type: i() }));
    return (
      Sd(e, {
        get id() {
          return r();
        },
        children: Dr(Dp, (e, r) => {
          var n = mr(),
            i = Me(n),
            o = (e) => {
              var r = mr();
              Lr(
                Me(r),
                () => t.child,
                () => ({ props: Ht(c) })
              ),
                vr(e, r);
            },
            s = (e) => {
              var r = Lp();
              let n;
              Lr(Pe(r), () => t.children ?? p),
                ze(() => (n = Yr(r, n, { ...Ht(c) }))),
                vr(e, r);
            };
          Tr(i, (e) => {
            t.child ? e(o) : e(s, !1);
          }),
            vr(e, n);
        }),
        $$slots: { default: !0 },
      }),
      le({ ...Er() })
    );
  }
  function Rp(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "ref", 15, null),
      n = Cn(t, ["$$slots", "$$events", "$$legacy", "ref"]);
    return (
      X(r, Ad),
      Ad(
        e,
        kn(() => n, {
          get ref() {
            return r();
          },
          set ref(e) {
            r(e);
          },
        })
      ),
      le({ ...Er() })
    );
  }
  function $p(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "delayDuration", 3, 700),
      n = Tn(t, "disableCloseOnTriggerClick", 3, !1),
      i = Tn(t, "disableHoverableContent", 3, !1),
      o = Tn(t, "disabled", 3, !1),
      s = Tn(t, "ignoreNonKeyboardFocus", 3, !1),
      a = Tn(t, "skipDelayDuration", 3, 300);
    var l;
    (l = {
      delayDuration: Ha.with(() => r()),
      disableCloseOnTriggerClick: Ha.with(() => n()),
      disableHoverableContent: Ha.with(() => i()),
      disabled: Ha.with(() => o()),
      ignoreNonKeyboardFocus: Ha.with(() => s()),
      skipDelayDuration: Ha.with(() => a()),
    }),
      Op.set(new kp(l));
    var c = mr();
    return Lr(Me(c), () => t.children ?? p), vr(e, c), le({ ...Er() });
  }
  K(Dp),
    W(),
    (Rp[F] =
      "node_modules/bits-ui/dist/bits/tooltip/components/tooltip-arrow.svelte"),
    K(Rp),
    W(),
    ($p[F] =
      "node_modules/bits-ui/dist/bits/tooltip/components/tooltip-provider.svelte"),
    K($p);
  let Fp = me(!1);
  class Bp {
    static _refs = 0;
    static _cleanup;
    constructor() {
      qe(
        () => (
          xe(Bp._refs, 0) &&
            (Bp._cleanup = He(() => {
              const e = [],
                t = (e) => {
                  ye(Fp, !1);
                };
              return (
                e.push(
                  lr(document, "pointerdown", t, { capture: !0 }),
                  lr(document, "pointermove", t, { capture: !0 }),
                  lr(
                    document,
                    "keydown",
                    (e) => {
                      ye(Fp, !0);
                    },
                    { capture: !0 }
                  )
                ),
                rl(...e)
              );
            })),
          Bp._refs++,
          () => {
            Bp._refs--, xe(Bp._refs, 0) && (ye(Fp, !1), Bp._cleanup?.());
          }
        )
      );
    }
    get current() {
      return Ht(Fp);
    }
    set current(e) {
      ye(Fp, e, !0);
    }
  }
  W(), (Vp[F] = "src/lib/components/common/button/Cl-button.svelte");
  var qp = er(hr('<span class="clarify-button--text"> </span>'), Vp[F], [
      [17, 8],
    ]),
    jp = er(
      hr(
        '<div class="cl-absolute loader-wrapper"><svg class="cl-animate-spin cl-h-5 cl-w-5 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="cl-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path fill="var(--clarify-font-color-black)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>'
      ),
      Vp[F],
      [
        [
          22,
          8,
          [
            [
              23,
              12,
              [
                [25, 16],
                [26, 16],
              ],
            ],
          ],
        ],
      ]
    ),
    Hp = er(hr("<!> <!> <!> <!>", 1), Vp[F], []);
  function Vp(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "text", 3, ""),
      n = Tn(t, "rootClass", 3, ""),
      i = Tn(t, "clType", 3, "default"),
      o = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "text",
        "icon",
        "isLoading",
        "rootClass",
        "children",
        "clType",
      ]);
    var s = mr(),
      a = Me(s);
    const l = _e(() =>
        xe(i(), "linear-gradient") ? "clarify-button--linear-gradient" : ""
      ),
      c = _e(() =>
        xe(i(), "reverse-default") ? "clarify-button--reverse-default" : ""
      ),
      u = _e(() =>
        xe(i(), "transparent") ? "clarify-button--transparent" : ""
      ),
      d = _e(() => (xe(i(), "icon") ? "clarify-button--icon" : "")),
      p = _e(n),
      h = _e(() => t.isLoading || t.disabled);
    return (
      Rr(
        a,
        () => Vc,
        (e, n) => {
          n(
            e,
            kn(() => o, {
              get class() {
                return `clarify-button ${Ht(l) ?? ""}\n${Ht(c) ?? ""}\n${
                  Ht(u) ?? ""
                }\n${Ht(d) ?? ""}\n${Ht(p) ?? ""}`;
              },
              get disabled() {
                return Ht(h);
              },
              children: Dr(Vp, (e, n) => {
                var i = Hp(),
                  o = Me(i),
                  s = (e) => {
                    var r = mr();
                    Lr(Me(r), () => t.icon), vr(e, r);
                  };
                Tr(o, (e) => {
                  t.icon && e(s);
                });
                var a = Ne(o, 2),
                  l = (e) => {
                    var t = qp(),
                      n = Pe(t);
                    ze(() => wr(n, r())), vr(e, t);
                  };
                Tr(a, (e) => {
                  r() && e(l);
                });
                var c = Ne(a, 2),
                  u = (e) => {
                    var r = mr();
                    Lr(Me(r), () => t.children), vr(e, r);
                  };
                Tr(c, (e) => {
                  t.children && e(u);
                });
                var d = Ne(c, 2),
                  p = (e) => {
                    vr(e, jp());
                  };
                Tr(d, (e) => {
                  t.isLoading && e(p);
                }),
                  vr(e, i);
              }),
              $$slots: { default: !0 },
            })
          );
        }
      ),
      vr(e, s),
      le({ ...Er() })
    );
  }
  K(Vp);
  const Up = fn(null),
    zp = fn({ value: null, isLoading: !0 });
  function Gp(e) {
    Up.set(e);
  }
  async function Wp(e) {
    zp.set({ value: e, isLoading: !1 });
  }
  function Kp(e) {
    zp.update((t) => ({ ...t, isLoading: e }));
  }
  const Zp = new (class {
    baseUrl = "v1";
    async logoutToken() {
      const e = gn(Up);
      try {
        (await si({ action: "logout", payload: e })).success && Up.set(null);
      } catch (e) {
        console.error(e);
      }
    }
    async checkAuth() {
      const e = await si({ action: "checkAuth" });
      return Gp(e?.token), e?.token;
    }
    async login() {
      const e = await si({ action: "googleAuth" });
      return Gp(e?.token), e?.token;
    }
    async updateLoggedUser(e) {
      const t = e ? { headers: { id: e } } : void 0;
      return Yp.put(`${this.baseUrl}/updateLoggedUser`, null, t);
    }
    async getUser() {
      return Yp.get(`${this.baseUrl}/getUser`);
    }
  })();
  var Xp;
  !(function (e) {
    (e.REQUEST = "request"), (e.RESPONSE = "response"), (e.ERROR = "error");
  })(Xp || (Xp = {}));
  const Yp = new (class {
    baseURL;
    defaultHeaders;
    middlewares;
    constructor(e) {
      (this.baseURL = e.endsWith("/") ? e : `${e}/`),
        (this.defaultHeaders = { "Content-Type": "application/json" }),
        (this.middlewares = {
          [Xp.REQUEST]: [],
          [Xp.RESPONSE]: [],
          [Xp.ERROR]: [],
        });
    }
    use(e, t) {
      if (!this.middlewares[e])
        throw new Error(`Invalid middleware type: ${e}`);
      return this.middlewares[e].push(t), this;
    }
    async request(e, t = {}) {
      const r = `${this.baseURL}${e}`;
      let n = { ...t, headers: { ...this.defaultHeaders, ...t.headers } };
      try {
        return (
          (n = await this.applyMiddleware(Xp.REQUEST, n)),
          t.stream
            ? this.handleStreamRequest(r, n)
            : t.blob
            ? this.handleBlobRequest(r, n)
            : this.handleRegularRequest(r, n)
        );
      } catch (e) {
        throw await this.applyMiddleware(Xp.ERROR, e);
      }
    }
    async get(e, t = {}) {
      return this.request(e, { ...t, method: "GET" });
    }
    async post(e, t, r = {}) {
      return this.request(e, {
        ...r,
        method: "POST",
        body: this.isObject(t) ? JSON.stringify(t) : null,
      });
    }
    async put(e, t, r = {}) {
      return this.request(e, {
        ...r,
        method: "PUT",
        body: this.isObject(t) ? JSON.stringify(t) : null,
      });
    }
    async getStream(e, t = {}) {
      return this.request(e, { ...t, method: "GET", stream: !0 });
    }
    async applyMiddleware(e, t) {
      let r = t;
      for (const t of this.middlewares[e]) r = await t(r);
      return r;
    }
    async handleStreamRequest(e, t) {
      const r = await fetch(e, t);
      if (!r.ok) throw await this.applyMiddleware(Xp.ERROR, r);
      return (
        await this.applyMiddleware(Xp.RESPONSE, {
          body: r.body,
          headers: r.headers,
          status: r.status,
        })
      ).body;
    }
    async handleBlobRequest(e, t) {
      const r = await fetch(e, t);
      if (!r.ok) throw await this.applyMiddleware(Xp.ERROR, r);
      const n = await r.blob();
      return (
        await this.applyMiddleware(Xp.RESPONSE, {
          data: n,
          headers: r.headers,
          status: r.status,
        })
      ).data;
    }
    async handleRegularRequest(e, t) {
      const r = await fetch(e, t);
      if (!r.ok) throw await this.applyMiddleware(Xp.ERROR, r);
      const n = await r.json();
      return (
        await this.applyMiddleware(Xp.RESPONSE, {
          data: n,
          headers: r.headers,
          status: r.status,
        })
      ).data;
    }
    isObject(e) {
      return null !== e && "object" == typeof e;
    }
  })("https://chromesummaryextention-production.up.railway.app");
  async function Qp(e, t, r, n) {
    try {
      const i = await Yp.post(
          e,
          { html: r, filename: t },
          { headers: { "Content-Type": "application/json" }, blob: !0 }
        ),
        o = window.URL.createObjectURL(i),
        s = document.createElement("a");
      (s.href = o),
        (s.download = `${t}.${n}`),
        document.body.appendChild(s),
        s.click(),
        setTimeout(() => {
          window.URL.revokeObjectURL(o), document.body.removeChild(s);
        }, 100);
    } catch (e) {
      console.error("\u041e\u0448\u0438\u0431\u043a\u0430:", e),
        alert(
          `\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438 \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u0438 ${n.toUpperCase()}`
        );
    }
  }
  Yp.use(Xp.REQUEST, async (e) => {
    const t = await Zp.checkAuth().catch(() => null);
    return (
      t &&
        (Gp(t),
        (e.headers.Authorization = `Bearer ${t}`),
        (e.headers["App-Version"] = "0.9.0")),
      e
    );
  }),
    Yp.use(Xp.ERROR, async (e) => {
      const t = e;
      let r = chrome.i18n.getMessage("unknown_error");
      if (t?.response?.data) {
        try {
          if ("string" == typeof t.response.data) {
            const e = JSON.parse(t.response.data);
            r = e?.message;
          } else r = t.response.data.message || t.response.data.error || r;
        } catch (e) {
          console.error(e);
        }
        return Promise.reject(new Error(r));
      }
      return (
        401 === t?.status &&
          (r = "Authorization is required to access feature"),
        Promise.reject(new Error(r))
      );
    }),
    W(),
    (th[F] = "src/lib/components/common/popover/Cl-popover.svelte");
  var Jp = er(hr("<!> <!>", 1), th[F], []),
    eh = er(hr("<!> <!>", 1), th[F], []);
  function th(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "triggerClass", 3, ""),
      n = Tn(t, "contentClass", 3, ""),
      i = Tn(t, "open", 15, !1),
      o = Tn(t, "side", 3, "bottom"),
      s = Tn(t, "sideOffset", 3, 8),
      a = Tn(t, "align", 3, "center"),
      l = Tn(t, "alignOffset", 3, 0),
      c = Tn(t, "trapFocus", 3, !0),
      u = Tn(t, "preventScroll", 3, !1),
      d = Tn(t, "showArrow", 3, !1),
      h = Tn(t, "arrowWidth", 3, 8),
      f = Tn(t, "arrowHeight", 3, 4),
      g = Tn(t, "arrowClass", 3, ""),
      m = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "trigger",
        "children",
        "triggerClass",
        "contentClass",
        "open",
        "side",
        "sideOffset",
        "align",
        "alignOffset",
        "trapFocus",
        "preventScroll",
        "escapeKeydownBehavior",
        "interactOutsideBehavior",
        "onOpenAutoFocus",
        "onCloseAutoFocus",
        "forceMount",
        "showArrow",
        "arrowWidth",
        "arrowHeight",
        "arrowClass",
      ]);
    var v = mr();
    return (
      Rr(
        Me(v),
        () => bp,
        (e, v) => {
          X(i, v),
            v(
              e,
              kn(() => m, {
                get open() {
                  return i();
                },
                set open(e) {
                  i(e);
                },
                children: Dr(th, (e, i) => {
                  var m = eh(),
                    v = Me(m);
                  Rr(
                    v,
                    () => cp,
                    (e, n) => {
                      {
                        const i = Dr(th, (e, r = p) => {
                          var n = mr();
                          Lr(Me(n), () => t.trigger, r), vr(e, n);
                        });
                        n(e, {
                          get class() {
                            return r();
                          },
                          child: i,
                          $$slots: { child: !0 },
                        });
                      }
                    }
                  ),
                    Rr(
                      Ne(v, 2),
                      () => Wl,
                      (e, r) => {
                        r(e, {
                          children: Dr(th, (e, r) => {
                            var i = mr();
                            Rr(
                              Me(i),
                              () => ap,
                              (e, r) => {
                                r(e, {
                                  get align() {
                                    return a();
                                  },
                                  get alignOffset() {
                                    return l();
                                  },
                                  get class() {
                                    return `clarify-popover-content cl-p-2 ${
                                      n() ?? ""
                                    }`;
                                  },
                                  get escapeKeydownBehavior() {
                                    return t.escapeKeydownBehavior;
                                  },
                                  get forceMount() {
                                    return t.forceMount;
                                  },
                                  get interactOutsideBehavior() {
                                    return t.interactOutsideBehavior;
                                  },
                                  get onCloseAutoFocus() {
                                    return t.onCloseAutoFocus;
                                  },
                                  get onOpenAutoFocus() {
                                    return t.onOpenAutoFocus;
                                  },
                                  get preventScroll() {
                                    return u();
                                  },
                                  get side() {
                                    return o();
                                  },
                                  get sideOffset() {
                                    return s();
                                  },
                                  transitionConfig: { duration: 150 },
                                  get trapFocus() {
                                    return c();
                                  },
                                  children: Dr(th, (e, r) => {
                                    var n = Jp(),
                                      i = Me(n);
                                    Lr(i, () => t.children);
                                    var o = Ne(i, 2),
                                      s = (e) => {
                                        var t = mr();
                                        Rr(
                                          Me(t),
                                          () => up,
                                          (e, t) => {
                                            t(e, {
                                              get width() {
                                                return h();
                                              },
                                              get height() {
                                                return f();
                                              },
                                              get class() {
                                                return `clarify-popover-arrow ${
                                                  g() ?? ""
                                                }`;
                                              },
                                            });
                                          }
                                        ),
                                          vr(e, t);
                                      };
                                    Tr(o, (e) => {
                                      d() && e(s);
                                    }),
                                      vr(e, n);
                                  }),
                                  $$slots: { default: !0 },
                                });
                              }
                            ),
                              vr(e, i);
                          }),
                          $$slots: { default: !0 },
                        });
                      }
                    ),
                    vr(e, m);
                }),
                $$slots: { default: !0 },
              })
            );
        }
      ),
      vr(e, v),
      le({ ...Er() })
    );
  }
  K(th), W(), (nh[F] = "src/lib/icons/GoogleIcon.svelte");
  var rh = er(
    fr(
      '<svg fill="#000000" version="1.1" viewBox="-0.5 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><g fill="none" fill-rule="evenodd" id="Icons" stroke="none" stroke-width="1"><g id="Color-" transform="translate(-401.000000, -860.000000)"><g id="Google" transform="translate(401.000000, 860.000000)"><path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" fill="#FBBC05" id="Fill-1"></path><path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" fill="#EB4335" id="Fill-2"></path><path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" fill="#34A853" id="Fill-3"></path><path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" fill="#4285F4" id="Fill-4"></path></g></g></g></g></svg>'
    ),
    nh[F],
    [
      [
        5,
        0,
        [
          [14, 4],
          [15, 4],
          [
            20,
            4,
            [
              [
                21,
                8,
                [
                  [
                    22,
                    12,
                    [
                      [
                        23,
                        16,
                        [
                          [24, 20],
                          [30, 20],
                          [36, 20],
                          [42, 20],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    ]
  );
  function nh(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "20px"),
      n = Tn(t, "height", 8, "20px");
    var i = rh();
    return (
      ze(() => {
        Xr(i, "height", n()), Xr(i, "width", r());
      }),
      vr(e, i),
      le({ ...Er() })
    );
  }
  K(nh);
  const ih = new (class {
      _isChromeStorageEnabled;
      _isLocalStorageEnabled;
      constructor() {
        (this._isLocalStorageEnabled = this._checkLocalStoragePermissions),
          (this._isChromeStorageEnabled = this._checkStoragePermissions);
      }
      get _checkStoragePermissions() {
        return Object.prototype.hasOwnProperty.call(chrome, "storage");
      }
      get _checkLocalStoragePermissions() {
        return Object.prototype.hasOwnProperty.call(window, "localStorage");
      }
      setData(e, t) {
        if (this._isLocalStorageEnabled)
          try {
            window.localStorage.setItem(e, t);
          } catch (e) {
            throw new Error("Cannot set value to localStorage");
          }
      }
      getData(e) {
        if (!this._isLocalStorageEnabled) return null;
        try {
          const t = window.localStorage.getItem(e);
          return t ? t.toString() : null;
        } catch (e) {
          throw (console.error(e), new Error(e));
        }
      }
      async getChromeData(e) {
        if (!this._isChromeStorageEnabled) return null;
        try {
          return (await chrome.storage.sync.get([e]))[e];
        } catch (e) {
          console.error(e);
        }
        return null;
      }
      async setChromeData(e, t) {
        if (this._isChromeStorageEnabled)
          try {
            await chrome.storage.sync.set({ [e]: t });
          } catch (e) {
            console.error(e);
          }
      }
      clearAll() {
        this._isLocalStorageEnabled && window.localStorage.clear();
      }
      async clearAllChrome() {
        if (this._isChromeStorageEnabled)
          try {
            await chrome.storage.sync.clear();
          } catch (e) {
            console.error(e);
          }
      }
      async saveToStorage(e, t) {
        try {
          await this.setChromeData(e, t);
        } catch (e) {
          console.error(e);
        }
        try {
          this.setData(e, t);
        } catch (e) {
          console.error(e);
        }
      }
      async getFromStorage(e) {
        if (!this._isLocalStorageEnabled && !this._isChromeStorageEnabled)
          return null;
        const t = await this.getChromeData(e),
          r = this.getData(e);
        return t
          ? (t !== r && this.setData(e, t), t)
          : r
          ? (await this.setChromeData(e, r), r)
          : null;
      }
    })(),
    oh = fn(null);
  function sh(e) {
    oh.set({ time: Number(e?.time) || 0, shortTime: e?.shortTime });
  }
  async function ah(e) {
    sh(e);
    const t = gn(oh);
    await ih.saveToStorage("summary-app-time-saved-short", t?.shortTime || ""),
      await ih.saveToStorage("summary-app-time-saved", t?.time || 0);
  }
  function lh(e, t) {
    kr(new.target), ae(t, !0);
    let r = me(!1);
    async function n() {
      if (!Ht(r)) {
        ye(r, !0);
        try {
          const e = await Zp.login();
          if (e) {
            Gp(e);
            const t = await ih.getFromStorage("summary-app-user"),
              r = await Zp.updateLoggedUser(t);
            await Wp(r), await ah({ time: r.time, shortTime: r.shortTime });
          }
        } catch (e) {
          await Zp.logoutToken(), console.error(...Nn(0, e));
        } finally {
          ye(r, !1);
        }
      }
    }
    return (
      Vp(e, {
        autofocus: !0,
        clType: "reverse-default",
        get isLoading() {
          return Ht(r);
        },
        onclick: n,
        get rootClass() {
          return t.className;
        },
        tabindex: 1,
        get text() {
          return t.buttonText;
        },
        children: Dr(lh, (e, t) => {
          nh(e, {});
        }),
        $$slots: { default: !0 },
      }),
      le({
        get onLogin() {
          return n;
        },
        ...Er(),
      })
    );
  }
  W(),
    (lh[F] = "src/lib/components/google-auth/GoogleAuth.svelte"),
    K(lh),
    W(),
    (uh[F] = "src/lib/components/GoogleSignInPopover.svelte");
  var ch = er(
    hr(
      '<div class="clarify-sign-wrapper cl-flex cl-flex-col cl-p-2.5 cl-gap-2"><div class="clarify-sign-title"><span></span></div> <div class="clarify-sign-description"><span></span></div> <div class="cl-flex cl-flex-row cl-gap-2 cl-justify-between cl-w-full cl-pt-2 cl-items-end cl-flex-wrap"><!></div></div>'
    ),
    uh[F],
    [
      [
        4,
        0,
        [
          [5, 4, [[6, 8]]],
          [8, 4, [[9, 8]]],
          [11, 4],
        ],
      ],
    ]
  );
  function uh(e, t) {
    kr(new.target), ae(t, !1);
    var r = ch(),
      n = Pe(r);
    Pe(n).textContent = chrome.i18n.getMessage("sign_in_to_continue");
    var i = Ne(n, 2);
    return (
      (Pe(i).textContent = chrome.i18n.getMessage(
        "sign_in_to_continue_description"
      )),
      lh(Pe(Ne(i, 2)), {
        buttonText: chrome.i18n.getMessage("sign_in"),
        className: "cl-w-full",
      }),
      vr(e, r),
      le({ ...Er() })
    );
  }
  K(uh), W(), (ph[F] = "src/lib/components/common/Cl-tooltip.svelte");
  var dh = er(hr('<span class="arrow-wrapper"><!></span> ', 1), ph[F], [
    [10, 8],
  ]);
  function ph(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "text", 3, ""),
      n = Tn(t, "showArrow", 3, !0),
      i = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "text",
        "children",
        "showArrow",
      ]);
    var o = mr();
    return (
      Rr(
        Me(o),
        () => Wl,
        (e, t) => {
          t(e, {
            children: Dr(ph, (e, t) => {
              var o = mr();
              Rr(
                Me(o),
                () => _p,
                (e, t) => {
                  t(
                    e,
                    kn(() => i, {
                      class: "clarify-tooltip-content cl-z-[9999] cl-p-2",
                      sideOffset: 3,
                      children: Dr(ph, (e, t) => {
                        var i = dh(),
                          o = Me(i),
                          s = Pe(o),
                          a = (e) => {
                            var t = mr();
                            Rr(
                              Me(t),
                              () => Rp,
                              (e, t) => {
                                t(e, {});
                              }
                            ),
                              vr(e, t);
                          };
                        Tr(s, (e) => {
                          n() && e(a);
                        });
                        var l = Ne(o);
                        ze(() => wr(l, ` ${r() ?? ""}`)), vr(e, i);
                      }),
                      $$slots: { default: !0 },
                    })
                  );
                }
              ),
                vr(e, o);
            }),
            $$slots: { default: !0 },
          });
        }
      ),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(ph), W(), (yh[F] = "src/lib/components/SummaryText.svelte");
  var hh = er(hr("<!> <!>", 1), yh[F], []),
    fh = er(
      hr(
        '<div class="cl-flex cl-flex-col cl-justify-center cl-w-full cl-gap-3 svelte-1usadaz"><span class="download-dialog-label cl-text-center cl-text-sm svelte-1usadaz"></span> <div class="cl-flex cl-justify-between cl-gap-4 cl-p-3 svelte-1usadaz"><!> <!> <!></div></div>'
      ),
      yh[F],
      [
        [
          207,
          32,
          [
            [208, 36],
            [209, 36],
          ],
        ],
      ]
    ),
    gh = er(
      hr(
        '<div class="cl-mr-5 cl-flex cl-flex-row cl-justify-center cl-items-center cl-gap-3 svelte-1usadaz"><!> <!></div>'
      ),
      yh[F],
      [[170, 20]]
    ),
    mh = er(
      hr(
        '<div style="margin-bottom: 10px; font-size: 12px; font-weight: normal; font-style: italic" class="cl-px-6 cl-py-0.5 svelte-1usadaz"><span class="cl-bg-blue-100 cl-text-blue-800 cl-text-xs cl-font-medium cl-px-2.5 cl-rounded cl-dark:bg-blue-900 cl-dark:text-blue-300 svelte-1usadaz"> </span></div>'
      ),
      yh[F],
      [[250, 12, [[252, 16]]]]
    ),
    vh = er(
      hr(
        '<div class="textWrapper svelte-1usadaz"><div class="cl-flex cl-justify-between cl-items-center header-title cl-box-border svelte-1usadaz"><div class="cl-flex cl-justify-end cl-w-full cl-p-1 svelte-1usadaz"><div class="cl-flex cl-flex-row cl-justify-center cl-items-center cl-mr-1.5 svelte-1usadaz"><!> <!></div></div></div> <div class="cl-pr-2 cl-box-border svelte-1usadaz" id="animatedText"><!> <!></div></div>'
      ),
      yh[F],
      [
        [
          165,
          0,
          [
            [166, 4, [[167, 8, [[168, 12]]]]],
            [248, 4],
          ],
        ],
      ]
    );
  function yh(e, t) {
    kr(new.target), ae(t, !0);
    const [r, n] = bn();
    let i,
      o = me(""),
      s = me(!1),
      a = me(""),
      l = me(""),
      c = me(!1),
      u = me(!1),
      d = me(!1),
      h = me(!1),
      f = Tn(t, "isLoading", 3, !1),
      g = Tn(t, "isTextMode", 3, !0);
    const m = _e(() => (Mn(zp), yn(zp, "$user", r))),
      v = _e(() => !Ht(m).isLoading && !Ht(m).value);
    function y() {
      ye(s, !1), ye(a, ""), ye(o, "");
    }
    async function b(e) {
      (e = Sa(e, {
        allowedClasses: { span: ["list-element", "video-query-note"] },
        allowedTags: ["span", "strong"],
      })),
        ye(o, Ht(o) + e),
        ye(a, Ht(o), !0),
        setTimeout(() => {
          ye(
            a,
            (function (e) {
              let t = /\* \*\*(.*?)\*\*/g;
              const r = /\*\*(.*?)\*\*/g;
              return e
                .replace(
                  t,
                  (e, t) =>
                    `<span class="list-element"><strong> ${t} </strong></span>`
                )
                .replace(r, (e, t) => `<strong>${t}</strong>`);
            })(Ht(a)),
            !0
          ),
            ye(
              a,
              (function (e) {
                const t = /\*\s(.*?)\./g;
                return e.replace(
                  t,
                  (e, t) => `<span class="list-element">${t}.</span>`
                );
              })(Ht(a)),
              !0
            ),
            ye(
              a,
              (function (e) {
                return e.replace(
                  oi,
                  (e, t) => `<span class="video-query-note">${t}</span>`
                );
              })(Ht(a)),
              !0
            );
        });
    }
    function w(e, t = 0) {
      ye(l, e, !0),
        setTimeout(() => {
          ye(l, "");
        }, t);
    }
    function x() {
      ye(l, "");
    }
    async function C() {
      try {
        const e = ii(
          (function (e) {
            return e.replace(oi, "");
          })(Ht(o))
        );
        await (async function (e) {
          return window.navigator.clipboard.writeText(e);
        })(e),
          ye(c, !0),
          setTimeout(() => {
            ye(c, !1);
          }, 2e3);
      } catch (e) {
        console.error(...Nn(0, e));
      }
    }
    async function S() {
      if (Ht(u)) return;
      if ((ye(u, !0), !Ht(a))) return void ye(u, !1);
      const e = `\n        <!DOCTYPE html>\n        <html lang="en">\n        <head>\n            <meta charset="UTF-8">\n            <title>PDF Document</title>\n            <style>\n                body {\n                    font-family: Arial, sans-serif;\n                    font-size: 12px;\n                    margin: 20px;\n                    color: #000;\n                }\n                pre {\n                    white-space: pre-wrap;\n                    word-wrap: break-word;\n                }</style>\n        </head>\n        <body>\n            <pre>${Ht(
        a
      )}</pre>\n        </body>\n        </html>\n    `;
      try {
        const t = await Wn();
        await Qp("attachments/pdf", t.videoName, e, "pdf");
      } catch (e) {
        console.error(...Nn(0, e));
      } finally {
        ye(u, !1);
      }
    }
    async function k() {
      !(function (e, t) {
        const r = new Blob([t], { type: "text/plain" }),
          n = document.createElement("a");
        (n.href = URL.createObjectURL(r)),
          (n.download = e),
          n.click(),
          URL.revokeObjectURL(n.href);
      })((await Wn()).videoName, ii(Ht(o)));
    }
    async function E() {
      !(async function (e, t) {
        try {
          ye(d, !0), await Qp("attachments/docx", e, t, "docx");
        } catch (e) {
          console.error(...Nn(0, e));
        } finally {
          ye(d, !1);
        }
      })((await Wn()).videoName, ii(Ht(o)));
    }
    var T = vh(),
      A = Pe(T),
      O = Pe(A),
      P = Pe(O),
      M = Pe(P),
      N = (e) => {
        var t = gh(),
          r = Pe(t);
        const n = _e(() => f() || Ht(s));
        Vp(r, {
          get disabled() {
            return Ht(n);
          },
          clType: "icon",
          onclick: C,
          title: chrome.i18n.getMessage("copy"),
          children: Dr(yh, (e, t) => {
            var r = mr(),
              n = Me(r),
              i = (e) => {
                Ea(e, {});
              },
              o = (e) => {
                Pa(e, {});
              };
            Tr(n, (e) => {
              Ht(c) ? e(o, !1) : e(i);
            }),
              vr(e, r);
          }),
          $$slots: { default: !0 },
        });
        var i = Ne(r, 2);
        {
          const e = Dr(yh, (e, t) => {
            let r = () => t?.().props;
            r();
            var n = mr();
            Rr(
              Me(n),
              () => Mp,
              (e, t) => {
                t(
                  e,
                  kn({ delayDuration: 300 }, r, {
                    disableHoverableContent: !0,
                    ignoreNonKeyboardFocus: !0,
                    children: Dr(yh, (e, t) => {
                      var n = hh(),
                        i = Me(n);
                      Rr(
                        i,
                        () => Dp,
                        (e, t) => {
                          {
                            const n = Dr(yh, (e, t) => {
                              let r = () => t?.().props;
                              r();
                              const n = _e(() => f() || Ht(s));
                              Vp(
                                e,
                                kn(r, {
                                  get disabled() {
                                    return Ht(n);
                                  },
                                  clType: "icon",
                                  "aria-label":
                                    chrome.i18n.getMessage("download"),
                                  children: Dr(yh, (e, t) => {
                                    Na(e, {});
                                  }),
                                  $$slots: { default: !0 },
                                })
                              );
                            });
                            t(
                              e,
                              kn(r, {
                                class:
                                  "cl-border-none cl-bg-transparent cl-px-0 cl-w-full",
                                tabindex: -1,
                                child: n,
                                $$slots: { child: !0 },
                              })
                            );
                          }
                        }
                      ),
                        ph(Ne(i, 2), {
                          align: "center",
                          side: "bottom",
                          text: chrome.i18n.getMessage(
                            "download_tooltip_description"
                          ),
                        }),
                        vr(e, n);
                    }),
                    $$slots: { default: !0 },
                  })
                );
              }
            ),
              vr(e, n);
          });
          X(() => Ht(h), th),
            th(i, {
              align: "end",
              side: "bottom",
              get open() {
                return Ht(h);
              },
              set open(e) {
                ye(h, e, !0);
              },
              trigger: e,
              children: Dr(yh, (e, t) => {
                var r = mr(),
                  n = Me(r),
                  i = (e) => {
                    uh(e, {});
                  },
                  o = (e) => {
                    var t = fh(),
                      r = Pe(t);
                    r.textContent = chrome.i18n.getMessage("download");
                    var n = Ne(r, 2),
                      i = Pe(n);
                    Vp(i, {
                      "aria-label": chrome.i18n.getMessage("download_pdf"),
                      get isLoading() {
                        return Ht(u);
                      },
                      get disabled() {
                        return f();
                      },
                      onclick: S,
                      clType: "icon",
                      children: Dr(yh, (e, t) => {
                        _a(e, {});
                      }),
                      $$slots: { default: !0 },
                    });
                    var o = Ne(i, 2);
                    Vp(o, {
                      "aria-label": chrome.i18n.getMessage("download_txt"),
                      get disabled() {
                        return f();
                      },
                      onclick: k,
                      clType: "icon",
                      children: Dr(yh, (e, t) => {
                        Da(e, {});
                      }),
                      $$slots: { default: !0 },
                    }),
                      Vp(Ne(o, 2), {
                        "aria-label": chrome.i18n.getMessage("download_word"),
                        onclick: E,
                        get disabled() {
                          return f();
                        },
                        get isLoading() {
                          return Ht(d);
                        },
                        clType: "icon",
                        children: Dr(yh, (e, t) => {
                          $a(e, {});
                        }),
                        $$slots: { default: !0 },
                      }),
                      vr(e, t);
                  };
                Tr(n, (e) => {
                  Ht(v) ? e(i) : e(o, !1);
                }),
                  vr(e, r);
              }),
              $$slots: { trigger: !0, default: !0 },
            });
        }
        vr(e, t);
      };
    Tr(M, (e) => {
      Ht(a) && e(N);
    }),
      Vp(Ne(M, 2), {
        clType: "transparent",
        onclick: function () {
          t.textClosed(), y();
        },
        title: chrome.i18n.getMessage("clear"),
        children: Dr(yh, (e, t) => {
          Aa(e, {});
        }),
        $$slots: { default: !0 },
      });
    var I = Ne(A, 2),
      _ = Pe(I),
      L = (e) => {
        var t = mh(),
          r = Pe(t),
          n = Pe(r);
        ze(() => wr(n, Ht(l))), vr(e, t);
      };
    Tr(_, (e) => {
      Ht(l) && e(L);
    });
    var D = Ne(_, 2),
      R = (e) => {
        var t = mr();
        _r(Me(t), () => Ht(a), !1, !1), vr(e, t);
      },
      $ = (e) => {
        var r = mr();
        Lr(Me(r), () => t.body ?? p), vr(e, r);
      };
    Tr(D, (e) => {
      g() ? e(R) : e($, !1);
    }),
      dn(
        I,
        (e) => (i = e),
        () => i
      ),
      ze(() => Xr(I, "data-blink", f())),
      vr(e, T);
    var F = le({
      get clearText() {
        return y;
      },
      get addTextToQueue() {
        return b;
      },
      get showHelperFor() {
        return w;
      },
      get clearHelperMessage() {
        return x;
      },
      ...Er(),
    });
    return n(), F;
  }
  K(yh);
  const bh = fn({ language: null, summaryLength: "3", aiModel: null });
  function wh(e, t) {
    bh.update((r) => (r ? { ...r, [e]: t } : r));
  }
  W(), (Ch[F] = "src/lib/icons/ProfileIcon.svelte");
  var xh = er(
    fr(
      '<svg fill="none" viewBox="0 0 11 15" xmlns="http://www.w3.org/2000/svg"><path d="M10.9948 13.9146C11.0235 14.2914 10.741 14.6197 10.3649 14.6485C10.3471 14.6498 10.3293 14.6505 10.3122 14.6505C9.95792 14.6505 9.65837 14.3776 9.63101 14.0186C9.4826 12.0714 7.82955 10.547 5.86737 10.547C3.90519 10.547 2.25214 12.0714 2.10373 14.0186C2.07501 14.3947 1.74536 14.6751 1.36988 14.6485C0.993723 14.6197 0.711262 14.2914 0.739987 13.9146C0.942428 11.2596 3.19459 9.17911 5.86737 9.17911C8.54015 9.17911 10.7923 11.2596 10.9948 13.9146ZM2.10578 4.04967C2.10578 1.97533 3.79303 0.288086 5.86737 0.288086C7.94171 0.288086 9.62896 1.97533 9.62896 4.04967C9.62896 6.12402 7.94171 7.81126 5.86737 7.81126C3.79303 7.81126 2.10578 6.12402 2.10578 4.04967ZM3.47363 4.04967C3.47363 5.36965 4.5474 6.44341 5.86737 6.44341C7.18735 6.44341 8.26111 5.36965 8.26111 4.04967C8.26111 2.7297 7.18735 1.65594 5.86737 1.65594C4.5474 1.65594 3.47363 2.7297 3.47363 4.04967Z"></path></svg>'
    ),
    Ch[F],
    [[6, 0, [[7, 4]]]]
  );
  function Ch(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "20px"),
      n = Tn(t, "height", 8, "20px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)");
    var o = xh(),
      s = Pe(o);
    return (
      ze(() => {
        Xr(o, "height", n()), Xr(o, "width", r()), Xr(s, "fill", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Ch);
  const Sh = fn({
    isReviewStripOpened: !1,
    isUpdateStripOpened: !1,
    isWelcomeStripOpened: !1,
    isTimestampDialogOpened: !1,
    totalVideosAmount: 0,
    isPremiumPopupOpened: !1,
    alertMessage: "",
    alertId: null,
    isAlertVisible: !1,
  });
  function kh(e, t) {
    Sh.update((r) => (r ? { ...r, [e]: t } : r));
  }
  const Eh = () => {
    const e = gn(Sh);
    return (
      e.isReviewStripOpened ||
      e.isUpdateStripOpened ||
      e.isWelcomeStripOpened ||
      e.isTimestampDialogOpened
    );
  };
  function Th(e) {
    Sh.update((t) => ({ ...t, ...e }));
  }
  async function Ah(e) {
    const t = await ih.getFromStorage("summary-app-seen-alert-id");
    e &&
      t !== e.messageId &&
      Th({
        alertMessage: e.message,
        alertId: e.messageId,
        isAlertVisible: !!e.message,
      });
  }
  W(), (Ph[F] = "src/lib/icons/StatsIcon.svelte");
  var Oh = er(
    fr(
      '<svg fill="none" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><path d="M5.625 1.125V7.875C5.625 8.4975 5.1225 9 4.5 9C3.8775 9 3.375 8.4975 3.375 7.875V1.125C3.375 0.5025 3.8775 0 4.5 0C5.1225 0 5.625 0.5025 5.625 1.125ZM7.875 2.25C7.2525 2.25 6.75 2.7525 6.75 3.375V7.875C6.75 8.4975 7.2525 9 7.875 9C8.4975 9 9 8.4975 9 7.875V3.375C9 2.7525 8.4975 2.25 7.875 2.25ZM1.125 4.5C0.5025 4.5 0 5.0025 0 5.625V7.875C0 8.4975 0.5025 9 1.125 9C1.7475 9 2.25 8.4975 2.25 7.875V5.625C2.25 5.0025 1.7475 4.5 1.125 4.5Z"></path></svg>'
    ),
    Ph[F],
    [[7, 0, [[8, 4]]]]
  );
  function Ph(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "9px"),
      n = Tn(t, "height", 8, "9px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)");
    var o = Oh(),
      s = Pe(o);
    return (
      ze(() => {
        Xr(o, "height", n()), Xr(o, "width", r()), Xr(s, "fill", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Ph), W(), (Nh[F] = "src/lib/icons/RatingIcon.svelte");
  var Mh = er(
    fr(
      '<svg fill="none" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M5.85792 6.66667H6.25C9.01792 6.66667 10 5.20834 10 3.95834C9.99907 3.61464 9.87679 3.28232 9.65472 3.02C9.43266 2.75768 9.12508 2.58223 8.78625 2.52459C8.94325 2.19661 9.06262 1.85191 9.14208 1.49709C9.17908 1.31696 9.17535 1.13084 9.13116 0.952339C9.08697 0.773839 9.00343 0.607476 8.88667 0.465418C8.76838 0.319754 8.61904 0.202367 8.44955 0.121841C8.28006 0.0413159 8.09472 -0.000311889 7.90708 1.75932e-06H2.09292C1.90527 -0.000311889 1.71993 0.0413159 1.55045 0.121841C1.38096 0.202367 1.23162 0.319754 1.11333 0.465418C0.996566 0.607476 0.913032 0.773839 0.86884 0.952339C0.824647 1.13084 0.820915 1.31696 0.857917 1.49709C0.937503 1.8519 1.05658 2.19669 1.21292 2.525C0.874314 2.58281 0.566984 2.75828 0.345092 3.0205C0.1232 3.28271 0.00098991 3.61484 0 3.95834C0 5.20834 0.982083 6.66667 3.75 6.66667H4.13875C4.15435 6.75437 4.16368 6.84306 4.16667 6.93209V8.33333C4.17383 8.44463 4.15718 8.55617 4.11783 8.66052C4.07848 8.76487 4.01734 8.85963 3.93849 8.93849C3.85963 9.01735 3.76486 9.07849 3.66051 9.11783C3.55616 9.15718 3.44463 9.17383 3.33333 9.16667H2.08333V10H7.91667V9.16667H6.66667C6.55514 9.17419 6.44329 9.15781 6.3386 9.11864C6.2339 9.07946 6.13878 9.0184 6.05958 8.93951C5.98038 8.86063 5.91893 8.76575 5.87934 8.66121C5.83975 8.55667 5.82293 8.44489 5.83 8.33333V6.93209C5.83319 6.84308 5.84252 6.75439 5.85792 6.66667ZM6.44875 5.56209C7.20201 4.93085 7.84374 4.17743 8.34708 3.33334H8.54167C8.70743 3.33334 8.8664 3.39918 8.98361 3.51639C9.10082 3.6336 9.16667 3.79257 9.16667 3.95834C9.16667 4.865 8.33667 5.83334 6.18625 5.83334C6.26198 5.73223 6.35018 5.64109 6.44875 5.56209ZM0.833333 3.95834C0.833333 3.79257 0.899181 3.6336 1.01639 3.51639C1.1336 3.39918 1.29257 3.33334 1.45833 3.33334H1.65167C2.15402 4.17753 2.79508 4.931 3.54792 5.56209C3.64629 5.64131 3.73446 5.73242 3.81042 5.83334C1.66 5.83334 0.833333 4.865 0.833333 3.95834Z"></path></svg>'
    ),
    Nh[F],
    [[7, 0, [[8, 4]]]]
  );
  function Nh(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "10px"),
      n = Tn(t, "height", 8, "10px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)");
    var o = Mh(),
      s = Pe(o);
    return (
      ze(() => {
        Xr(o, "height", n()), Xr(o, "width", r()), Xr(s, "fill", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Nh), W(), (_h[F] = "src/lib/icons/VideoIcon.svelte");
  var Ih = er(
    fr(
      '<svg fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M7.4115 5.854C7.4376 5.86827 7.45928 5.88943 7.47418 5.91518C7.48908 5.94092 7.49663 5.97026 7.496 6C7.49751 6.02537 7.49284 6.05073 7.48239 6.07389C7.47194 6.09706 7.45602 6.11734 7.436 6.133L4.75 7.477C4.72442 7.49114 4.6956 7.49838 4.66638 7.49801C4.63715 7.49764 4.60852 7.48968 4.58331 7.4749C4.55809 7.46012 4.53715 7.43904 4.52254 7.41372C4.50794 7.38841 4.50017 7.35973 4.5 7.3305V4.6695C4.49943 4.63983 4.50695 4.61057 4.52175 4.58485C4.53655 4.55913 4.55807 4.53792 4.584 4.5235C4.60787 4.50973 4.63494 4.50249 4.6625 4.5025C4.70282 4.50369 4.74212 4.51541 4.7765 4.5365L7.4115 5.854ZM12 2.5V9.5C11.9992 10.1628 11.7356 10.7982 11.2669 11.2669C10.7982 11.7356 10.1628 11.9992 9.5 12H2.5C1.8372 11.9992 1.20178 11.7356 0.73311 11.2669C0.264441 10.7982 0.000793929 10.1628 0 9.5L0 2.5C0.000793929 1.8372 0.264441 1.20178 0.73311 0.73311C1.20178 0.264441 1.8372 0.000793929 2.5 0L9.5 0C10.1628 0.000793929 10.7982 0.264441 11.2669 0.73311C11.7356 1.20178 11.9992 1.8372 12 2.5ZM8.496 6C8.49618 5.78933 8.43927 5.58255 8.33134 5.40163C8.2234 5.22071 8.06847 5.07241 7.883 4.9725L5.244 3.655C5.06625 3.55302 4.86481 3.49958 4.65988 3.50004C4.45495 3.5005 4.25375 3.55484 4.07646 3.65762C3.89917 3.7604 3.75202 3.90799 3.64979 4.0856C3.54756 4.2632 3.49383 4.46457 3.494 4.6695V7.3305C3.4928 7.53539 3.54605 7.73692 3.64832 7.91447C3.75058 8.09202 3.89817 8.23922 4.076 8.341C4.25601 8.44609 4.46056 8.5018 4.669 8.5025C4.86183 8.50337 5.0515 8.45354 5.219 8.358L7.907 7.0145C8.08673 6.91329 8.23611 6.76585 8.33968 6.58747C8.44324 6.40909 8.49721 6.20626 8.496 6Z"></path></svg>'
    ),
    _h[F],
    [[7, 0, [[8, 4]]]]
  );
  function _h(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "12px"),
      n = Tn(t, "height", 8, "12px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)");
    var o = Ih(),
      s = Pe(o);
    return (
      ze(() => {
        Xr(o, "height", n()), Xr(o, "width", r()), Xr(s, "fill", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(_h), W(), (Dh[F] = "src/lib/icons/TimeIcon2.svelte");
  var Lh = er(
    fr(
      '<svg fill="none" viewBox="0 0 12 13" xmlns="http://www.w3.org/2000/svg"><path d="M6 12.5C9.3084 12.5 12 9.8084 12 6.5V6.2H11.9922C11.8356 3.0302 9.2076 0.5 6 0.5C2.7924 0.5 0.1644 3.0302 0.00780001 6.2H0V6.5C0 9.8084 2.6916 12.5 6 12.5ZM5.4 6.1676V4.1C5.4 3.7688 5.6688 3.5 6 3.5C6.3312 3.5 6.6 3.7688 6.6 4.1V6.5C6.6 6.707 6.4932 6.899 6.318 7.0088L4.4268 8.1908C4.146 8.3666 3.7758 8.2808 3.6 8C3.4242 7.7186 3.51 7.3484 3.7908 7.1726L5.4 6.167V6.1676Z"></path></svg>'
    ),
    Dh[F],
    [[7, 0, [[8, 4]]]]
  );
  function Dh(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "12px"),
      n = Tn(t, "height", 8, "13px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)");
    var o = Lh(),
      s = Pe(o);
    return (
      ze(() => {
        Xr(o, "height", n()), Xr(o, "width", r()), Xr(s, "fill", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Dh), W(), (Bh[F] = "src/lib/components/common/overlay/Overlay.svelte");
  var Rh = er(
      hr('<p class="cl-mb-8 overlay-text svelte-by75p4"> </p>'),
      Bh[F],
      [[9, 12]]
    ),
    $h = er(
      hr('<p class="cl-mt-3 overlay-text-description svelte-by75p4"> </p>'),
      Bh[F],
      [[15, 12]]
    ),
    Fh = er(
      hr(
        '<div class="overlay-wrapper cl-absolute cl-top-0 cl-left-0 cl-w-full cl-h-full cl-flex cl-justify-center cl-items-center cl-z-20 svelte-by75p4"><div class="overlay-container cl-px-1 cl-py-2 cl-max-w-[90%] cl-w-full cl-text-center svelte-by75p4"><!> <div class="cl-flex cl-justify-center cl-gap-4"><!></div> <!></div> <div></div></div>'
      ),
      Bh[F],
      [
        [
          5,
          0,
          [
            [7, 4, [[11, 8]]],
            [18, 4],
          ],
        ],
      ]
    );
  function Bh(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "title", 3, ""),
      n = Tn(t, "description", 3, ""),
      i = Tn(t, "blur", 3, "2px"),
      o = Tn(
        t,
        "color",
        3,
        "rgb(from var(--yt-spec-menu-background) r g b / 0.85)"
      );
    var s = Fh(),
      a = Pe(s),
      l = Pe(a),
      c = (e) => {
        var t = Rh(),
          n = Pe(t);
        ze(() => wr(n, r())), vr(e, t);
      };
    Tr(l, (e) => {
      r() && e(c);
    });
    var u = Ne(l, 2);
    !(function (e, t, r, n, i) {
      var o = t.$$slots?.[r],
        s = !1;
      !0 === o && ((o = t["default" === r ? "children" : r]), (s = !0)),
        void 0 === o ? null !== i && i(e) : o(e, s ? () => n : n);
    })(Pe(u), t, "default", {}, null);
    var d = Ne(u, 2),
      p = (e) => {
        var t = $h(),
          r = Pe(t);
        ze(() => wr(r, n())), vr(e, t);
      };
    return (
      Tr(d, (e) => {
        n() && e(p);
      }),
      ze(() =>
        Ur(
          s,
          `backdrop-filter: blur(${i() ?? ""}); background-color: ${o() ?? ""};`
        )
      ),
      vr(e, s),
      le({ ...Er() })
    );
  }
  K(Bh), W(), (jh[F] = "src/lib/icons/PremiumIcon2.svelte");
  var qh = er(
    fr(
      '<svg fill="none" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_117_1103)"><path d="M8.76154 2.29987L7.49967 0.530617C7.38105 0.364927 7.22464 0.229913 7.04339 0.136781C6.86215 0.0436489 6.66131 -0.00491577 6.45754 -0.0048828H2.54179C2.33834 -0.00461789 2.13787 0.0440894 1.95698 0.137209C1.77609 0.230329 1.61997 0.365184 1.50154 0.530617L0.237417 2.30024C0.0774701 2.52699 -0.00495827 2.79933 0.00240708 3.07671C0.00977244 3.3541 0.106538 3.62168 0.278292 3.83962L4.49967 9.04087L8.72629 3.83287C8.89612 3.61506 8.99126 3.34832 8.99761 3.0722C9.00396 2.79608 8.92118 2.52526 8.76154 2.29987ZM1.15317 2.95387L2.41692 1.18462C2.43115 1.16476 2.44989 1.14856 2.4716 1.13735C2.4933 1.12613 2.51736 1.12023 2.54179 1.12012H3.63717L3.10279 3.18712H5.89654L5.36217 1.12012H6.45829C6.48272 1.12023 6.50678 1.12613 6.52849 1.13735C6.5502 1.14856 6.56893 1.16476 6.58317 1.18462L7.84654 2.95349C7.8653 2.97918 7.87556 3.01008 7.87589 3.04188C7.87623 3.07368 7.86662 3.10479 7.84842 3.13087L7.80267 3.18712H5.89654L4.49967 7.25512L3.10279 3.18712H1.19742L1.15729 3.13762C1.13696 3.11149 1.12559 3.07952 1.12484 3.04642C1.1241 3.01333 1.13403 2.98088 1.15317 2.95387Z"></path></g><defs><clipPath id="clip0_117_1103"><rect fill="white" height="10" width="10"></rect></clipPath></defs></svg>'
    ),
    jh[F],
    [
      [
        7,
        0,
        [
          [8, 4, [[9, 8]]],
          [12, 4, [[13, 8, [[14, 12]]]]],
        ],
      ],
    ]
  );
  function jh(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "10px"),
      n = Tn(t, "height", 8, "10px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)");
    var o = qh(),
      s = Pe(o),
      a = Pe(s);
    return (
      ze(() => {
        Xr(o, "height", n()), Xr(o, "width", r()), Xr(a, "fill", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(jh), W(), (Vh[F] = "src/lib/icons/PremiumIcon.svelte");
  var Hh = er(
    fr(
      '<svg fill="none" viewBox="0 0 13 12" xmlns="http://www.w3.org/2000/svg"><path d="M9.86032 1.30674L11.5322 3.64669C11.7765 3.98902 11.7661 4.45209 11.5062 4.78258L6.50002 11.0898L1.49436 4.78258C1.23442 4.45209 1.224 3.98902 1.46832 3.64669L3.14018 1.30674C3.31774 1.05769 3.60467 0.909964 3.91054 0.909964H9.08997C9.39584 0.909964 9.68277 1.05769 9.86032 1.30674Z" stroke-miterlimit="10"></path><path d="M1.2915 4.22461H11.7081" stroke-miterlimit="10"></path><path d="M6.49964 10.6162L4.60571 4.22419L5.55268 0.909813" stroke-miterlimit="10"></path><path d="M6.5 10.6162L8.39393 4.22419L7.44697 0.909813" stroke-miterlimit="10"></path></svg>'
    ),
    Vh[F],
    [
      [
        6,
        0,
        [
          [7, 4],
          [9, 4],
          [10, 4],
          [11, 4],
        ],
      ],
    ]
  );
  function Vh(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "13px"),
      n = Tn(t, "height", 8, "12px"),
      i = Tn(t, "stroke", 8, "var(--clarify-font-color-white)");
    var o = Hh(),
      s = Pe(o),
      a = Ne(s),
      l = Ne(a),
      c = Ne(l);
    return (
      ze(() => {
        Xr(o, "height", n()),
          Xr(o, "width", r()),
          Xr(s, "stroke", i()),
          Xr(a, "stroke", i()),
          Xr(l, "stroke", i()),
          Xr(c, "stroke", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Vh), W(), (zh[F] = "src/lib/icons/LinkedInIcon.svelte");
  var Uh = er(
    fr(
      '<svg fill="none" height="2.5rem" viewBox="0 0 16 16" width="2.5rem" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 01-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 002 2.866v10.268a.88.88 0 00.885.866h10.226a.882.882 0 00.889-.866V2.865a.88.88 0 00-.889-.864z" fill="#0A66C2"></path></g></svg>'
    ),
    zh[F],
    [
      [
        1,
        0,
        [
          [2, 4],
          [3, 4],
          [4, 4, [[5, 8]]],
        ],
      ],
    ]
  );
  function zh(e, t) {
    return kr(new.target), ae(t, !1), vr(e, Uh()), le({ ...Er() });
  }
  K(zh), W(), (Qh[F] = "src/lib/components/Settings.svelte");
  var Gh = er(
      hr(
        '<div class="profile-loader cl-w-full svelte-18zttgf" role="status" aria-live="polite"><div role="status" class="cl-max-w-sm cl-animate-pulse cl-w-full"><div class="cl-flex cl-items-center cl-justify-between cl-mb-7"><div class="cl-h-8 cl-w-8 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500"></div> <div class="cl-flex cl-flex-col cl-w-10/12"><div class="cl-h-2.5 cl-w-1/2 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[360px] cl-mb-2.5"></div> <div class="cl-h-2 cl-w-3/4 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[360px]"></div></div></div> <div class="cl-h-2.5 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[360px] cl-mb-2.5"></div> <div class="cl-h-2.5 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-mb-8"></div> <div class="cl-h-2.5 cl-w-1/2 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[360px] cl-mb-3"></div> <div class="cl-h-2.5 cl-w-3/4 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[360px] cl-mb-3"></div> <div class="cl-h-2.5 cl-w-3/4 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[360px] cl-mb-3"></div> <div class="cl-h-2.5 cl-w-3/4 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[360px] cl-mb-13"></div> <div class="cl-h-2.5 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[360px] cl-mb-2.5"></div> <div class="cl-h-2.5 cl-w-3/4 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[360px]"></div></div></div>'
      ),
      Qh[F],
      [
        [
          106,
          16,
          [
            [
              107,
              20,
              [
                [
                  108,
                  24,
                  [
                    [109, 28],
                    [
                      110,
                      28,
                      [
                        [111, 32],
                        [112, 32],
                      ],
                    ],
                  ],
                ],
                [116, 24],
                [117, 24],
                [119, 24],
                [120, 24],
                [121, 24],
                [122, 24],
                [124, 24],
                [125, 24],
              ],
            ],
          ],
        ],
      ]
    ),
    Wh =
      (er(hr('<span class="profile-subscription-validity"> </span>'), Qh[F], [
        [146, 24],
      ]),
      er(
        hr(
          '<div class="profile-subscription-block cl-px-4 cl-py-2 clarify-gradient-border svelte-18zttgf"><div class="profile-block-title svelte-18zttgf"><!> <span class="cl-text-xs"></span></div> <div class="profile-subscription-status svelte-18zttgf"><!></div></div>'
        ),
        Qh[F],
        [
          [
            139,
            24,
            [
              [140, 28, [[142, 32]]],
              [144, 28],
            ],
          ],
        ]
      ),
      er(
        hr(
          '<div class="profile-stat-item svelte-18zttgf"><!> <span class="profile-stat-label svelte-18zttgf"></span> <span class="profile-stat-value svelte-18zttgf"> </span></div>'
        ),
        Qh[F],
        [
          [
            178,
            32,
            [
              [180, 36],
              [181, 36],
            ],
          ],
        ]
      )),
    Kh = er(
      hr(
        '<div class="profile-content svelte-18zttgf"><div class="profile-user-info svelte-18zttgf"><img class="profile-avatar svelte-18zttgf" alt="User Avatar"> <div class="profile-user-details svelte-18zttgf"><span class="profile-name svelte-18zttgf"> </span> <span class="profile-email svelte-18zttgf"> </span></div></div> <!> <!> <div class="profile-stats-block cl-py-2 cl-px-4 svelte-18zttgf"><div class="profile-block-title svelte-18zttgf"><!> <span class="cl-text-xs"></span></div> <div class="profile-stats-list cl-ps-4 svelte-18zttgf"><div class="profile-stat-item svelte-18zttgf"><!> <span class="profile-stat-label svelte-18zttgf"></span> <span class="profile-stat-value svelte-18zttgf"> </span></div> <!> <div class="profile-stat-item svelte-18zttgf"><!> <span class="profile-stat-label svelte-18zttgf"></span> <span class="profile-stat-value svelte-18zttgf"> </span></div></div></div></div> <div class="profile-actions-container svelte-18zttgf"><div class="profile-logout-section svelte-18zttgf"><!></div> <div class="profile-social-section svelte-18zttgf"><!></div></div>',
        1
      ),
      Qh[F],
      [
        [
          130,
          16,
          [
            [
              131,
              20,
              [
                [132, 24],
                [
                  133,
                  24,
                  [
                    [134, 28],
                    [135, 28],
                  ],
                ],
              ],
            ],
            [
              166,
              20,
              [
                [167, 24, [[169, 28]]],
                [
                  171,
                  24,
                  [
                    [
                      172,
                      28,
                      [
                        [174, 32],
                        [175, 32],
                      ],
                    ],
                    [
                      184,
                      28,
                      [
                        [186, 32],
                        [187, 32],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ],
        ],
        [
          193,
          16,
          [
            [194, 20],
            [203, 20],
          ],
        ],
      ]
    ),
    Zh = er(hr('<div class="reload-wrapper svelte-18zttgf"><!></div>'), Qh[F], [
      [215, 16],
    ]),
    Xh = er(hr('<div class="profile-error svelte-18zttgf"></div>'), Qh[F], [
      [226, 16],
    ]),
    Yh = er(
      hr('<div class="profile-wrapper svelte-18zttgf"><!></div>'),
      Qh[F],
      [[104, 8]]
    );
  function Qh(e, t) {
    kr(new.target), ae(t, !0);
    const [r, n] = bn(),
      i = () => (Mn(zp), yn(zp, "$user", r));
    let o = me(""),
      s = me(""),
      a = me(""),
      l = me(!0),
      c = _e(i),
      u = _e(() => !Ht(c).isLoading && !Ht(c).value),
      d = me(!1),
      p = me(!1),
      h = me(!1),
      f = me(!1),
      g = Tn(t, "isInitialLoading", 3, !1);
    const m = _e(() => i().value);
    async function v() {
      ye(l, !0);
      try {
        const e = await Zp.getUser();
        await Wp(e), ye(p, !1);
      } catch (e) {
        console.error(...Nn(0, "Failed to get user data:", e)), ye(p, !0);
      } finally {
        ye(l, !1);
      }
    }
    In(async () => {
      ye(l, !0),
        ye(o, await ih.getFromStorage("summary-app-language"), !0),
        ye(s, await ih.getFromStorage("summary-app-summary-length"), !0),
        ye(a, await ih.getFromStorage("summary-app-active-model"), !0),
        (function (e) {
          bh.update((t) => ({ ...t, ...e }));
        })({
          language: Ht(o) || null,
          summaryLength: Ht(s) || "3",
          aiModel: Ht(a) || _n.Gemini20FlashLite,
        }),
        ye(l, !1);
    });
    const y = async () => {
        if (!Ht(f)) {
          ye(f, !0);
          try {
            await Zp.logoutToken(),
              zp.update((e) => ({ ...e, value: void 0, isLoading: !1 }));
          } catch (e) {
            console.error(...Nn(0, "Logout failed:", e));
          } finally {
            ye(f, !1);
          }
        }
      },
      b = async () => {
        Ht(h) || (ye(h, !0), await v(), ye(h, !1));
      };
    {
      const t = Dr(Qh, (e, t) => {
        let r = () => t?.().props;
        r();
        const n = _e(() => Ht(u) && !Ht(l) && !Ht(c).isLoading);
        Vp(
          e,
          kn(r, {
            rootClass: "cl-p-[0.6rem]",
            onclick: () => {
              ye(d, !Ht(d)), Ht(d) && Ht(c).value && v();
            },
            get disabled() {
              return g();
            },
            get "data-notification"() {
              return Ht(n);
            },
            children: Dr(Qh, (e, t) => {
              Ch(e, {});
            }),
            $$slots: { default: !0 },
          })
        );
      });
      X(() => Ht(d), th),
        th(e, {
          align: "center",
          side: "bottom",
          get open() {
            return Ht(d);
          },
          set open(e) {
            ye(d, e, !0);
          },
          trigger: t,
          children: Dr(Qh, (e, t) => {
            var r = mr(),
              n = Me(r),
              i = (e) => {
                uh(e, {});
              },
              o = (e) => {
                var t = Yh(),
                  r = Pe(t),
                  n = (e) => {
                    vr(e, Gh());
                  },
                  i = (e, t) => {
                    var r = (e) => {
                        var t = Kh(),
                          r = Me(t),
                          n = Pe(r),
                          i = Pe(n),
                          o = Ne(i, 2),
                          s = Pe(o),
                          a = Pe(s),
                          l = Ne(s, 2),
                          u = Pe(l),
                          d = Ne(n, 2);
                        Tr(d, (e) => {
                          xe(Ht(c).value.subscriptionStatus, Hn.Active), 0;
                        });
                        var p = Ne(d, 2);
                        Tr(p, (e) => {
                          !Ht(m)?.subscriptionStatus ||
                            xe(Ht(m)?.subscriptionStatus, Hn.Canceled),
                            0;
                        });
                        var h = Ne(p, 2),
                          g = Pe(h),
                          v = Pe(g);
                        Ph(v, {}),
                          (Ne(v, 2).textContent =
                            chrome.i18n.getMessage("statistics"));
                        var b = Ne(g, 2),
                          w = Pe(b),
                          x = Pe(w);
                        _h(x, {});
                        var C = Ne(x, 2);
                        C.textContent = `${
                          chrome.i18n.getMessage("videos_count") ?? ""
                        }:`;
                        var S = Ne(C, 2),
                          k = Pe(S),
                          E = Ne(w, 2),
                          T = (e) => {
                            var t = Wh(),
                              r = Pe(t);
                            Nh(r, {});
                            var n = Ne(r, 2);
                            n.textContent = `${
                              chrome.i18n.getMessage("rank") ?? ""
                            }:`;
                            var i = Ne(n, 2),
                              o = Pe(i);
                            ze(() => wr(o, Ht(m)?.rank)), vr(e, t);
                          };
                        Tr(E, (e) => {
                          Ht(m)?.rank && e(T);
                        });
                        var A = Ne(E, 2),
                          O = Pe(A);
                        Dh(O, {});
                        var P = Ne(O, 2);
                        P.textContent = `${
                          chrome.i18n.getMessage("time_saved_minutes") ?? ""
                        }:`;
                        var M = Ne(P, 2),
                          N = Pe(M),
                          I = Ne(r, 2),
                          _ = Pe(I);
                        Vp(Pe(_), {
                          onclick: y,
                          get isLoading() {
                            return Ht(f);
                          },
                          rootClass:
                            "profile-logout-button cl-px-2 cl-py-1 cl-flex-row-reverse",
                          children: Dr(Qh, (e, t) => {
                            var r = gr();
                            (r.nodeValue = chrome.i18n.getMessage("logout")),
                              vr(e, r);
                          }),
                          $$slots: { default: !0 },
                        });
                        var L = Ne(_, 2);
                        Vp(Pe(L), {
                          clType: "icon",
                          onclick: () =>
                            window.open("https://cutt.ly/qrcnzCNH", "_blank"),
                          rootClass: "profile-linkedin-button cl-px-2 cl-py-1",
                          children: Dr(Qh, (e, t) => {
                            zh(e, {});
                          }),
                          $$slots: { default: !0 },
                        }),
                          ze(() => {
                            Xr(i, "src", Ht(m)?.picture),
                              wr(
                                a,
                                `${Ht(m)?.name ?? ""} ${Ht(m)?.givenName || ""}`
                              ),
                              wr(u, Ht(m)?.email),
                              wr(k, Ht(m)?.videosAmount ?? 0),
                              wr(N, Ht(m)?.time ?? 0);
                          }),
                          vr(e, t);
                      },
                      n = (e, t) => {
                        var r = (e) => {
                            var t = Zh();
                            Bh(Pe(t), {
                              description:
                                chrome.i18n.getMessage("error_try_again"),
                              children: Dr(Qh, (e, t) => {
                                Vp(e, {
                                  onclick: b,
                                  get isLoading() {
                                    return Ht(h);
                                  },
                                  text: chrome.i18n.getMessage("reload"),
                                });
                              }),
                              $$slots: { default: !0 },
                            }),
                              vr(e, t);
                          },
                          n = (e) => {
                            var t = Xh();
                            (t.textContent = chrome.i18n.getMessage(
                              "error_loading_profile"
                            )),
                              vr(e, t);
                          };
                        Tr(
                          e,
                          (e) => {
                            Ht(p) && Ht(c).value ? e(r) : e(n, !1);
                          },
                          t
                        );
                      };
                    Tr(
                      e,
                      (e) => {
                        Ht(c) && !Ht(p) ? e(r) : e(n, !1);
                      },
                      t
                    );
                  };
                Tr(r, (e) => {
                  !Ht(l) || Ht(h) || Ht(p) ? e(i, !1) : e(n);
                }),
                  vr(e, t);
              };
            Tr(n, (e) => {
              Ht(c).value ? e(o, !1) : e(i);
            }),
              vr(e, r);
          }),
          $$slots: { trigger: !0, default: !0 },
        });
    }
    var w = le({ ...Er() });
    return n(), w;
  }
  K(Qh);
  const Jh = new (class {
    baseUrl = "v1";
    async saveNewUser() {
      return await Yp.get(`${this.baseUrl}/newUser`);
    }
    async updateUserState(e) {
      const { videoDuration: t, videoName: r, videoId: n } = e;
      return await Yp.post(
        `${this.baseUrl}/updateUserState`,
        { videoDuration: t, videoName: r, videoId: n },
        { headers: { "Content-Type": "application/json" } }
      );
    }
  })();
  const ef = new (class {
      async getSummary(e, t, r, n, i, o) {
        if (!e) return;
        const s = (
          await Yp.post(
            "stream",
            { prompt: e, model: n, answerSize: i, lang: o },
            { headers: { "Content-Type": "application/json" }, stream: !0 }
          )
        ).getReader();
        r(),
          await (function (e, t) {
            if (!e) return;
            let r = "",
              n = 0;
            return new Promise((i, o) => {
              const s = setInterval(() => {
                  (n += 1e3),
                    n > 6e4 &&
                      (clearInterval(s),
                      o("The request is timed out. Please try again."));
                }, 1e3),
                a = () => {
                  e.read()
                    .then(({ value: e, done: o }) => {
                      if (((n = 0), o)) return clearInterval(s), void i(r);
                      const l = new TextDecoder().decode(e);
                      (r += l), t(l), a();
                    })
                    .catch((e) => {
                      console.error(e),
                        t(
                          e?.toString() ||
                            "Seems like an error occurred during accessing API. Please try again later."
                        ),
                        o(
                          new Error(
                            e?.toString() ||
                              "Seems like an error occurred during accessing API. Please try again later."
                          )
                        );
                    });
                };
              a();
            });
          })(s, t);
      }
      async getLargeTextSummary(e, t, r, n) {
        if (!e) return "";
        try {
          const i = {
              compressedPrompt: await this.compressTextToBase64(e),
              model: t,
              answerSize: r,
              lang: n,
            },
            o = await Yp.post("stream/compressed-summary", i, {
              headers: { "Content-Type": "application/json" },
            });
          if ("string" == typeof o) return o;
          throw (
            (console.warn("API response was not a string. Received:", o),
            new Error(
              "Unexpected API response format. Expected string, received " +
                typeof o
            ))
          );
        } catch (e) {
          throw (console.error("Error in compressAndSendText method:", e), e);
        }
      }
      async getTimestamps(e, t, r) {
        if (!(e.length > Rn))
          return await Yp.post(
            "stream/timestamps",
            { prompt: e, model: t, lang: r },
            { headers: { "Content-Type": "application/json" } }
          );
        try {
          const n = await this.compressTextToBase64(e);
          return await Yp.post(
            "stream/compressed-timestamps",
            { compressedPrompt: n, model: t, lang: r },
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (e) {
          throw (console.error("Error in compressed timestamps:", e), e);
        }
      }
      async answerVideoQuery(e, t, r, n) {
        if (!e || !t) return "";
        if (t.length > Rn)
          try {
            const i = await this.compressTextToBase64(t),
              o = await Yp.post(
                "stream/long/video-query",
                { query: e, transcript: i, model: r, lang: n },
                { headers: { "Content-Type": "application/json" } }
              );
            return "string" == typeof o ? o : "";
          } catch (e) {
            throw (console.error("Error in long video query:", e), e);
          }
        else {
          const i = t;
          try {
            const t = await Yp.post(
              "stream/video-query",
              { query: e, transcript: i, model: r, lang: n },
              { headers: { "Content-Type": "application/json" } }
            );
            return "string" == typeof t ? t : "";
          } catch (e) {
            throw (console.error("Error in video query:", e), e);
          }
        }
      }
      async compressTextToBase64(e) {
        try {
          const t = new TextEncoder().encode(e),
            r = new CompressionStream("gzip"),
            n = r.writable.getWriter();
          n.write(t), n.close();
          const i = r.readable.getReader(),
            o = [];
          let s = 0;
          for (;;) {
            const { value: e, done: t } = await i.read();
            if (t) break;
            o.push(e), (s += e.length);
          }
          const a = new Uint8Array(s);
          let l = 0;
          for (const e of o) a.set(e, l), (l += e.length);
          return await this.convertUint8ArrayToBase64(a);
        } catch (e) {
          throw (
            (console.error("Error during text compression:", e),
            new Error(
              `Compression failed: ${
                e instanceof Error ? e.message : String(e)
              }`
            ))
          );
        }
      }
      convertUint8ArrayToBase64(e) {
        const t = new Blob([e], { type: "application/octet-stream" });
        return new Promise((r, n) => {
          const i = new FileReader();
          if (
            ((i.onload = () => {
              const e = i.result;
              try {
                if ("string" != typeof e)
                  return void n(
                    new Error("FileReader did not return a string.")
                  );
                const t = e.substring(e.indexOf(",") + 1);
                !t && e.startsWith("data:")
                  ? (console.warn(
                      "Converted Base64 is empty, but Data URL exists. Returning empty string."
                    ),
                    r(""))
                  : t
                  ? r(t)
                  : (console.error(
                      "Failed to parse Base64 string from Data URL. Input was:",
                      e
                    ),
                    n(
                      new Error("Failed to parse Base64 string from Data URL")
                    ));
              } catch (e) {
                console.error("Error parsing Data URL:", e),
                  n(
                    new Error(
                      `Error parsing Data URL: ${
                        e instanceof Error ? e.message : String(e)
                      }`
                    )
                  );
              }
            }),
            (i.onerror = () => {
              console.error("FileReader error:", i.error),
                n(i.error || new Error("FileReader failed to read Blob"));
            }),
            0 === e.length)
          )
            return (
              console.warn(
                "Input Uint8Array is empty. Converting to empty Base64 string."
              ),
              void r("")
            );
          i.readAsDataURL(t);
        });
      }
    })(),
    tf = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;
  class rf {
    static async fetchTranscript() {
      const e = Gn(window.location.href),
        t = await fetch(`https://www.youtube.com/watch?v=${e}`),
        r = await t.text();
      if (!r) throw new Error("No document text");
      const n = r.split('"captions":');
      if (n.length <= 1) {
        if (r.includes('class="g-recaptcha"'))
          throw new Error("Too many requests");
        if (!r.includes('"playabilityStatus":'))
          throw new Error("Cannot find transcript");
        throw new Error("Transcript is disabled");
      }
      const i = (() => {
        try {
          return JSON.parse(n[1].split(',"videoDetails')[0].replace("\n", ""));
        } catch (e) {
          return;
        }
      })()?.playerCaptionsTracklistRenderer;
      if (!i) throw new Error("Transcript is disabled");
      if (!("captionTracks" in i))
        throw new Error("Transcript is not available");
      const o = window.navigator.languages[0].split("-")[0];
      let s = i.captionTracks[0]?.languageCode;
      i.audioTracks.length > 1 && (s = o || "en");
      const a = i.captionTracks[0]?.baseUrl,
        l = await fetch(a);
      if (!l.ok) throw new Error("Transcript is not available");
      const c = [...(await l.text()).matchAll(tf)];
      if (!c.length) throw new Error("Transcript is not available");
      const u = c.map((e) => ({
        text: e[3],
        duration: parseFloat(e[2]),
        offset: parseFloat(e[1]),
      }));
      return { textData: u, lang: s };
    }
    static async getCleanTextAndLang() {
      const e = await rf.fetchTranscript(),
        t = e.textData.map((e) => e.text).join();
      return { text: rf.cleanText(t), lang: e.lang };
    }
    static async getTextAndOffset() {
      const e = await rf.fetchTranscript();
      return { offset: e.textData, lang: e.lang };
    }
    static cleanText(e) {
      return e
        .replace(/&amp;#39;|\[Music\]|,|\s+|\n/g, function (e) {
          switch (e) {
            case "&amp;#39;":
              return "'";
            case "[Music]":
              return "";
            default:
              return " ";
          }
        })
        .trim();
    }
  }
  const nf = (e) => e;
  function of(e) {
    const t = e - 1;
    return t * t * t + 1;
  }
  function sf(e, { delay: t = 0, duration: r = 400, easing: n = nf } = {}) {
    const i = +getComputedStyle(e).opacity;
    return {
      delay: t,
      duration: r,
      easing: n,
      css: (e) => "opacity: " + e * i,
    };
  }
  function af(
    e,
    {
      delay: t = 0,
      duration: r = 400,
      easing: n = of,
      start: i = 0,
      opacity: o = 0,
    } = {}
  ) {
    const s = getComputedStyle(e),
      a = +s.opacity,
      l = "none" === s.transform ? "" : s.transform,
      c = 1 - i,
      u = a * (1 - o);
    return {
      delay: t,
      duration: r,
      easing: n,
      css: (e, t) =>
        `\n\t\t\ttransform: ${l} scale(${1 - c * t});\n\t\t\topacity: ${
          a - u * t
        }\n\t\t`,
    };
  }
  function lf(e) {
    return e < 0.5 ? 4 * e * e * e : 0.5 * Math.pow(2 * e - 2, 3) + 1;
  }
  W(), (mf[F] = "src/lib/components/timestamps/TimestampsBody.svelte");
  var cf = er(
      hr(
        '<div class="cl-flex cl-cursor-progress cl-flex-row cl-justify-start cl-gap-2"><div class="cl-h-5 timestamp-time-skeleton cl-rounded cl-animate-pulse svelte-1of95pk"></div> <div class="cl-h-5 timestamp-text-skeleton cl-rounded cl-w-full cl-animate-pulse svelte-1of95pk"></div></div>'
      ),
      mf[F],
      [
        [
          27,
          16,
          [
            [28, 20],
            [29, 20],
          ],
        ],
      ]
    ),
    uf = er(
      hr('<div class="cl-absolute cl-space-y-4 cl-inset-0 cl-pr-5"></div>'),
      mf[F],
      [[25, 8]]
    ),
    df = (e, t, r) => t(Ht(r)),
    pf = er(
      hr(
        '<div class="cl-flex cl-flex-row cl-justify-start cl-gap-2"><div class="cl-cursor-pointer timestamp-time svelte-1of95pk"> </div> <div class="timestamp-text cl-font-medium cl-w-full svelte-1of95pk"> </div></div>'
      ),
      mf[F],
      [
        [
          36,
          16,
          [
            [37, 20],
            [42, 20],
          ],
        ],
      ]
    ),
    hf = er(
      hr(
        '<div class="cl-space-y-4 timestamp-wrapper cl-pb-4 cl-pr-5 svelte-1of95pk"></div>'
      ),
      mf[F],
      [[34, 8]]
    ),
    ff = er(hr("<div> </div>"), mf[F], [[47, 8]]),
    gf = er(hr("<div><!></div>"), mf[F], [[23, 0]]);
  function mf(e, t) {
    kr(new.target), ae(t, !0);
    const [r, n] = bn();
    let i = Tn(t, "isLoading", 3, !1);
    const o = new Array(9);
    let s = _e(() => (Mn(zp), yn(zp, "$user", r)).value);
    function a(e) {
      const t = document.querySelector(
        "#movie_player > div.html5-video-container > video"
      );
      t && ((t.currentTime = e.seconds), t.play());
    }
    var l = gf(),
      c = Pe(l),
      u = (e) => {
        var t = uf();
        Or(
          t,
          21,
          () => o,
          Ar,
          (e, t) => {
            vr(e, cf());
          }
        ),
          ln(
            2,
            t,
            () => sf,
            () => ({ duration: 1e3, easing: lf })
          ),
          vr(e, t);
      },
      d = (e, r) => {
        var n = (e) => {
            var r = hf();
            Or(
              r,
              21,
              () => t.data,
              Ar,
              (e, t) => {
                var r = pf(),
                  n = Pe(r);
                n.__click = [df, a, t];
                var i = Pe(n),
                  o = Pe(Ne(n, 2));
                ze(
                  (e) => {
                    wr(i, e), wr(o, Ht(t).title);
                  },
                  [
                    () => {
                      return (
                        (e = Ht(t).seconds),
                        `${Math.floor(e / 60)}:${Math.floor(e % 60)
                          .toString()
                          .padStart(2, "0")}`
                      );
                      var e;
                    },
                  ]
                ),
                  vr(e, r);
              }
            ),
              ln(
                1,
                r,
                () => sf,
                () => ({ duration: 1e3, easing: lf })
              ),
              vr(e, r);
          },
          o = (e, r) => {
            var n = (e) => {
              var t = ff(),
                r = Pe(t);
              ze(() =>
                wr(
                  r,
                  Ht(s)
                    ? "Oops! Something went wrong."
                    : "Authorization is required to process long videos."
                )
              ),
                vr(e, t);
            };
            Tr(
              e,
              (e) => {
                (t.data && t.data?.length) || i() || e(n);
              },
              r
            );
          };
        Tr(
          e,
          (e) => {
            t.data && t.data?.length ? e(n) : e(o, !1);
          },
          r
        );
      };
    Tr(c, (e) => {
      i() ? e(u) : e(d, !1);
    }),
      ze(() =>
        Hr(l, 1, `cl-relative ${i() && "skeleton-height"}`, "svelte-1of95pk")
      ),
      vr(e, l);
    var p = le({ ...Er() });
    return n(), p;
  }
  K(mf), cr(["click"]), W(), (yf[F] = "src/lib/icons/TimeIcon.svelte");
  var vf = er(
    fr(
      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><style>.minute-hand, .hour-hand {\n            transform-origin: 50px 50px;\n        }\n\n        .hour-hand {\n            transform: rotate(90deg);\n        }\n\n        .minute-hand {\n            &[data-rotating="true"] {\n                animation: rotate-minute 2s linear infinite;\n            }\n        }\n\n        .hour-hand {\n            &[data-rotating="true"] {\n                animation: rotate-hour 24s linear infinite;\n            }\n        }\n\n        @keyframes rotate-minute {\n            from {\n                transform: rotate(0deg);\n            }\n            to {\n                transform: rotate(360deg);\n            }\n        }\n\n        @keyframes rotate-hour {\n            from {\n                transform: rotate(90deg);\n            }\n            to {\n                transform: rotate(360deg);\n            }\n        }</style><circle cx="50" cy="50" fill="none" r="45" stroke-width="11"></circle><line class="hour-hand" opacity="0.7" stroke-linecap="round" stroke-width="8" x1="50" x2="50" y1="50" y2="35"></line><line class="minute-hand" opacity="0.7" stroke-linecap="round" stroke-width="7" x1="50" x2="50" y1="50" y2="15"></line></svg>'
    ),
    yf[F],
    [
      [
        6,
        0,
        [
          [7, 4],
          [46, 4],
          [48, 4],
          [53, 4],
        ],
      ],
    ]
  );
  function yf(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "20px"),
      n = Tn(t, "height", 8, "20px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)"),
      o = Tn(t, "isRotating", 8, !1);
    var s = vf(),
      a = Ne(Pe(s)),
      l = Ne(a),
      c = Ne(l);
    return (
      ze(() => {
        Xr(s, "height", n()),
          Xr(s, "width", r()),
          Xr(a, "stroke", i()),
          Xr(l, "data-rotating", o()),
          Xr(l, "stroke", i()),
          Xr(c, "data-rotating", o()),
          Xr(c, "stroke", i());
      }),
      vr(e, s),
      le({ ...Er() })
    );
  }
  K(yf);
  class bf {
    static parseLLMOutput(e) {
      try {
        let t = e.trim();
        if (t.startsWith("```")) {
          const e = t.split("\n");
          e[0].startsWith("```") && e.shift(),
            e.length > 0 && e[e.length - 1].startsWith("```") && e.pop(),
            (t = e.join("\n"));
        }
        return JSON.parse(t);
      } catch (e) {
        return console.error("Failed to parse JSON:", e), [];
      }
    }
    static convertToCompactString(e) {
      return e.map((e) => `${e.offset}|${e.text}`).join("\n");
    }
  }
  function wf(e, t) {
    kr(new.target), ae(t, !0);
    const [r, n] = bn(),
      i = () => (Mn(Sh), yn(Sh, "$appState", r));
    let o = _e(() => i().isTimestampDialogOpened),
      s = _e(() => i().totalVideosAmount),
      a = _e(() => (Mn(bh), yn(bh, "$settings", r))),
      l = me(void 0),
      c = me(!1),
      u = me(!1),
      d = Cn(t, [
        "$$slots",
        "$$events",
        "$$legacy",
        "timestampsData",
        "getTimestampsClicked",
        "isInitialLoading",
      ]);
    In(async () => {
      ye(c, await ih.getFromStorage("summary-app-timestamp-clicked"), !0),
        ye(l, await ih.getFromStorage("summary-app-update-version"), !0);
    }),
      qe(() => {
        !Ht(c) &&
          xe(Ht(l), "0.6.0") &&
          Ht(s) >= 3 &&
          !Eh() &&
          kh("isTimestampDialogOpened", !0);
      });
    const p = async () => {
        kh("isTimestampDialogOpened", !1);
        try {
          ye(c, !0),
            await ih.saveToStorage("summary-app-timestamp-clicked", !0);
        } catch (e) {
          console.error(...Nn(0, e));
        }
      },
      h = _e(() => Ht(u) || t.isInitialLoading || t.disabled);
    Vp(
      e,
      kn(() => d, {
        get disabled() {
          return Ht(h);
        },
        onclick: async function () {
          ye(u, !0), (!Ht(o) && Ht(c)) || p(), t.getTimestampsClicked();
          try {
            const e = await (async function () {
                try {
                  const e = await rf.getTextAndOffset();
                  return bf.convertToCompactString(e.offset);
                } catch (e) {
                  console.error(
                    "Failed to get transcript via YoutubeTranscript API, using fallback method"
                  );
                }
                const e = await (async function () {
                    const e = Kn();
                    if (!e) return null;
                    const t = (await zn()) ? Yn : Qn;
                    return ni(ei, t, e);
                  })(),
                  t = bf.convertToCompactString(e || []);
                if (!t)
                  throw new Error(
                    chrome.i18n.getMessage("transcript_does_not_exist")
                  );
                return t;
              })().catch((e) => {
                throw new Error(
                  chrome.i18n.getMessage("cannot_load_transcript")
                );
              }),
              r = await ef.getTimestamps(e, Ht(a).aiModel, Ht(a).language);
            t.timestampsData(bf.parseLLMOutput(r));
          } catch (e) {
            console.error(...Nn(0, e)), t.timestampsData([]);
          } finally {
            ye(u, !1);
          }
        },
        text: chrome.i18n.getMessage("timestamps"),
        children: Dr(wf, (e, t) => {
          yf(e, {
            get isRotating() {
              return Ht(u);
            },
          });
        }),
        $$slots: { default: !0 },
      })
    );
    var f = le({ ...Er() });
    return n(), f;
  }
  W(),
    (wf[F] =
      "src/lib/components/timestamps/timestampsButton/TimestampsButton.svelte"),
    K(wf),
    W(),
    (Cf[F] = "src/lib/icons/ArrowRightIcon.svelte");
  var xf = er(
    fr(
      '<svg fill="none" stroke-width="1.3679999999999999" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path clip-rule="evenodd" d="M12.5061 3.43557C12.8178 3.16281 13.2917 3.19439 13.5644 3.50612L20.5644 11.5061C20.8119 11.7889 20.8119 12.2111 20.5644 12.4939L13.5644 20.4939C13.2917 20.8056 12.8178 20.8372 12.5061 20.5644C12.1944 20.2917 12.1628 19.8178 12.4356 19.5061L18.3472 12.75H4C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25H18.3472L12.4356 4.49388C12.1628 4.18215 12.1944 3.70833 12.5061 3.43557Z" fill-rule="evenodd"></path></g></svg>'
    ),
    Cf[F],
    [
      [
        7,
        0,
        [
          [9, 4],
          [10, 4],
          [11, 4, [[12, 8]]],
        ],
      ],
    ]
  );
  function Cf(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "13px"),
      n = Tn(t, "height", 8, "13px"),
      i = Tn(t, "fill", 8, "var(--clarify-bg-white)");
    var o = xf(),
      s = Ne(Pe(o), 2),
      a = Pe(s);
    return (
      ze(() => {
        Xr(o, "height", n()),
          Xr(o, "stroke", i()),
          Xr(o, "width", r()),
          Xr(a, "fill", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Cf), W(), (kf[F] = "src/lib/components/AskContainer.svelte");
  var Sf = er(
    hr(
      '<div class="ask-container svelte-1iz1xyg"><div><div class="input-group svelte-1iz1xyg"><textarea class="svelte-1iz1xyg"></textarea></div> <!></div></div>'
    ),
    kf[F],
    [[63, 0, [[64, 4, [[65, 8, [[66, 12]]]]]]]]
  );
  function kf(e, t) {
    kr(new.target), ae(t, !0);
    const [r, n] = bn();
    let i = Tn(t, "placeholder", 3, ""),
      o = Tn(t, "value", 3, ""),
      s = me(!1),
      a = _e(() => (Mn(zp), yn(zp, "$user", r))),
      l = me(de(o() || ""));
    qe(() => {
      !!Ht(a).value && ye(s, !1);
    });
    let c = _e(() => !!Ht(l) && Ht(l).trim().length > 0);
    function u(e) {
      if (xe(e.key, "Enter") && !e.shiftKey) {
        e.preventDefault(), d();
        e.target.blur();
      } else if (xe(e.key, "Escape")) {
        e.preventDefault();
        e.target.blur();
      }
    }
    function d() {
      if (Ht(a).value) {
        if (Ht(c)) {
          t.onSubmit(Ht(l)), ye(l, "");
          const e = document.querySelector(".ask-section textarea");
          e && (e.style.height = "3.3rem");
        }
      } else ye(s, !Ht(s));
    }
    qe(() => {
      ye(l, o());
    });
    var p = Sf(),
      h = Pe(p);
    let f;
    var g = Pe(h),
      m = Pe(g);
    (m.__input = function (e) {
      ye(l, e.target.value, !0);
      const r = e.target;
      (r.style.height = "3.3rem"),
        r.scrollHeight > 38
          ? ((r.style.height = Math.min(r.scrollHeight, 100) / 10 + "rem"),
            (r.style.overflowY = "auto"))
          : ((r.style.height = "3.3rem"), (r.style.overflowY = "hidden")),
        t.onChange(Ht(l));
    }),
      (m.__keydown = u);
    var v = Ne(g, 2);
    {
      const e = Dr(kf, (e, t) => {
        let r = () => t?.().props;
        r();
        const n = _e(() => !Ht(c));
        Vp(
          e,
          kn(r, {
            "aria-label": "Send",
            get disabled() {
              return Ht(n);
            },
            onclick: d,
            onkeydown: u,
            rootClass:
              "ask-icon-button cl-absolute cl-right-[.4rem] cl-bottom-[.3rem]",
            children: Dr(kf, (e, t) => {
              Cf(e, {});
            }),
            $$slots: { default: !0 },
          })
        );
      });
      X(() => Ht(s), th),
        th(v, {
          align: "center",
          side: "bottom",
          get open() {
            return Ht(s);
          },
          set open(e) {
            ye(s, e, !0);
          },
          trigger: e,
          children: Dr(kf, (e, t) => {
            var r = mr(),
              n = Me(r),
              i = (e) => {
                uh(e, {});
              };
            Tr(n, (e) => {
              Ht(a).value || e(i);
            }),
              vr(e, r);
          }),
          $$slots: { trigger: !0, default: !0 },
        });
    }
    ze(
      (e) => {
        (f = Hr(h, 1, "ask-section svelte-1iz1xyg", null, f, e)),
          Xr(m, "placeholder", i()),
          (function (e, t) {
            var r = Qr(e);
            r.value !== (r.value = t ?? void 0) &&
              (e.value !== t || (0 === t && "PROGRESS" === e.nodeName)) &&
              (e.value = t ?? "");
          })(m, Ht(l));
      },
      [() => ({ "has-text": Ht(c) })]
    ),
      vr(e, p);
    var y = le({ ...Er() });
    return n(), y;
  }
  K(kf),
    cr(["input", "keydown"]),
    W(),
    (Tf[F] = "src/lib/icons/CheckIcon.svelte");
  var Ef = er(
    fr(
      '<svg fill="none" viewBox="0 0 8 7" xmlns="http://www.w3.org/2000/svg"><path d="M1 3.37419L3.36918 5.74353L7.06755 1" stroke-width="1.5"></path></svg>'
    ),
    Tf[F],
    [[8, 0, [[9, 4]]]]
  );
  function Tf(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "8px"),
      n = Tn(t, "height", 8, "8px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)");
    var o = Ef(),
      s = Pe(o);
    return (
      ze(() => {
        Xr(o, "height", n()), Xr(o, "width", r()), Xr(s, "stroke", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Tf),
    W(),
    (Mf[F] = "src/lib/components/common/dropdown/DropdownItem.svelte");
  var Af = er(
      hr(
        '<span class="pro-badge clarify-gradient-border cl-cursor-pointer">PRO</span>'
      ),
      Mf[F],
      [[20, 20]]
    ),
    Of = er(hr('<span class="item-description cl-pl-3"> </span>'), Mf[F], [
      [24, 16],
    ]),
    Pf = er(
      hr(
        '<div class="clarify-dropdown-item-content"><div class="cl-flex cl-flex-col cl-w-full cl-gap-0.5"><div class="cl-flex cl-justify-start cl-items-center"><!> <span> </span> <!></div> <!></div></div>'
      ),
      Mf[F],
      [[12, 4, [[13, 8, [[14, 12, [[18, 16]]]]]]]]
    );
  function Mf(e, t) {
    kr(new.target), ae(t, !0);
    let r = Cn(t, [
      "$$slots",
      "$$events",
      "$$legacy",
      "item",
      "selectedValue",
      "itemClass",
      "handleSelect",
    ]);
    var n = mr(),
      i = Me(n);
    const o = _e(() => t.itemClass),
      s = _e(() =>
        xe(t.item.value, t.selectedValue?.value)
          ? "clarify-dropdown-item-active"
          : ""
      );
    return (
      Rr(
        i,
        () => ep,
        (e, n) => {
          n(
            e,
            kn(() => r, {
              get class() {
                return `clarify-dropdown-item ${Ht(o) ?? ""} ${Ht(s) ?? ""}`;
              },
              get disabled() {
                return t.item.disabled;
              },
              onSelect: () => t.handleSelect(t.item),
              children: Dr(Mf, (e, r) => {
                var n = Pf(),
                  i = Pe(n),
                  o = Pe(i),
                  s = Pe(o),
                  a = (e) => {
                    Tf(e, {});
                  };
                Tr(s, (e) => {
                  xe(t.item.value, t.selectedValue?.value) && e(a);
                });
                var l = Ne(s, 2),
                  c = Pe(l),
                  u = Ne(l, 2),
                  d = (e) => {
                    vr(e, Af());
                  };
                Tr(u, (e) => {
                  t.item.isPro && e(d);
                });
                var p = Ne(o, 2),
                  h = (e) => {
                    var r = Of(),
                      n = Pe(r);
                    ze(() => wr(n, t.item.description)), vr(e, r);
                  };
                Tr(p, (e) => {
                  t.item.description && e(h);
                }),
                  ze(() => {
                    Hr(
                      l,
                      1,
                      `${
                        (xe(t.item.value, t.selectedValue?.value)
                          ? "cl-pl-1"
                          : "cl-pl-3") ?? ""
                      } item-title`
                    ),
                      wr(c, t.item.title);
                  }),
                  vr(e, n);
              }),
              $$slots: { default: !0 },
            })
          );
        }
      ),
      vr(e, n),
      le({ ...Er() })
    );
  }
  K(Mf),
    W(),
    (Df[F] = "src/lib/components/common/dropdown/DropdownSelect.svelte");
  var Nf = er(
      hr(
        '<!> <span class="clarify-dropdown__placeholder"> </span> <svg class="dropdown-chevron" fill="none" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>',
        1
      ),
      Df[F],
      [
        [29, 16],
        [30, 16, [[32, 20]]],
      ]
    ),
    If = er(hr("<!> <!>", 1), Df[F], []),
    _f = er(hr("<!> <!>", 1), Df[F], []),
    Lf = er(hr('<div class="clarify-dropdown"><!></div>'), Df[F], [[21, 0]]);
  function Df(e, r) {
    kr(new.target), ae(r, !0);
    let n = Tn(r, "placeholder", 3, "Select an option"),
      i = Tn(r, "triggerClass", 3, ""),
      o = Tn(r, "contentClass", 3, ""),
      s = Tn(r, "itemClass", 3, "");
    Tn(r, "tooltipContentClass", 3, "");
    let a = Tn(r, "showBodyComponent", 3, !1),
      l = Cn(r, [
        "$$slots",
        "$$events",
        "$$legacy",
        "bodyComponent",
        "items",
        "placeholder",
        "selectedValue",
        "onChange",
        "onClick",
        "triggerClass",
        "contentClass",
        "itemClass",
        "tooltipContentClass",
        "ariaLabel",
        "contentProps",
        "iconComponent",
        "disabled",
        "isMenuOpened",
        "showBodyComponent",
      ]);
    const c = _e(() => r.items.find((e) => xe(e.value, r.selectedValue)));
    function u(e) {
      xe(typeof e.onClick, "function") ? e?.onClick(e) : r.onChange?.(e);
    }
    var d = Lf();
    return (
      Rr(
        Pe(d),
        () => $p,
        (e, d) => {
          d(e, {
            children: Dr(Df, (e, d) => {
              var p = mr();
              Rr(
                Me(p),
                () => dp,
                (e, d) => {
                  d(
                    e,
                    kn(() => l, {
                      onOpenChange: () => r.onClick?.(!!r.isMenuOpened),
                      children: Dr(Df, (e, d) => {
                        var p = _f(),
                          h = Me(p);
                        const f = _e(i),
                          g = _e(() =>
                            r.isMenuOpened
                              ? "clarify-dropdown-trigger-focused"
                              : ""
                          );
                        Rr(
                          h,
                          () => yp,
                          (e, t) => {
                            t(
                              e,
                              kn(() => l, {
                                get "aria-label"() {
                                  return r.ariaLabel;
                                },
                                get class() {
                                  return `clarify-dropdown-trigger cl-px-2 cl-py-1 ${
                                    Ht(f) ?? ""
                                  } ${Ht(g) ?? ""}`;
                                },
                                get disabled() {
                                  return r.disabled;
                                },
                                children: Dr(Df, (e, t) => {
                                  var i = Nf(),
                                    o = Me(i);
                                  Lr(o, () => r.iconComponent);
                                  var s = Ne(o, 2),
                                    a = Pe(s);
                                  ze(() => wr(a, Ht(c)?.title ?? n())),
                                    vr(e, i);
                                }),
                                $$slots: { default: !0 },
                              })
                            );
                          }
                        ),
                          Rr(
                            Ne(h, 2),
                            () => Wl,
                            (e, n) => {
                              n(e, {
                                children: Dr(Df, (e, n) => {
                                  var i = mr(),
                                    l = Me(i);
                                  const d = _e(() => r.contentProps?.align);
                                  Rr(
                                    l,
                                    () => mp,
                                    (e, n) => {
                                      n(e, {
                                        get align() {
                                          return Ht(d);
                                        },
                                        get class() {
                                          return `clarify-dropdown-content ${
                                            o() ?? ""
                                          }`;
                                        },
                                        sideOffset: 5,
                                        transition: sf,
                                        transitionConfig: { duration: 150 },
                                        children: Dr(Df, (e, n) => {
                                          var i = mr(),
                                            o = Me(i),
                                            l = (e) => {
                                              var t = mr();
                                              Lr(Me(t), () => r.bodyComponent),
                                                vr(e, t);
                                            },
                                            d = (e) => {
                                              var n,
                                                i,
                                                o = mr(),
                                                a = Me(o);
                                              (n = () => r.items),
                                                (i = (e) => e.value),
                                                Ue(() => {
                                                  const e = new Map(),
                                                    r = n(),
                                                    o = t(r)
                                                      ? r
                                                      : null == r
                                                      ? []
                                                      : Array.from(r),
                                                    s = o.length;
                                                  for (let t = 0; t < s; t++) {
                                                    const r = i(o[t], t);
                                                    if (e.has(r)) {
                                                      String(e.get(r));
                                                      let t = String(r);
                                                      t.startsWith(
                                                        "[object "
                                                      ) && (t = null),
                                                        D();
                                                    }
                                                    e.set(r, t);
                                                  }
                                                }),
                                                Or(
                                                  a,
                                                  17,
                                                  () => r.items,
                                                  (e) => e.value,
                                                  (e, t) => {
                                                    var r = mr(),
                                                      n = Me(r),
                                                      i = (e) => {
                                                        Mf(e, {
                                                          get item() {
                                                            return Ht(t);
                                                          },
                                                          get selectedValue() {
                                                            return Ht(c);
                                                          },
                                                          get itemClass() {
                                                            return s();
                                                          },
                                                          handleSelect: u,
                                                        });
                                                      },
                                                      o = (e) => {
                                                        var r = mr();
                                                        Rr(
                                                          Me(r),
                                                          () => Mp,
                                                          (e, r) => {
                                                            r(e, {
                                                              delayDuration: 50,
                                                              disableHoverableContent:
                                                                !0,
                                                              ignoreNonKeyboardFocus:
                                                                !0,
                                                              children: Dr(
                                                                Df,
                                                                (e, r) => {
                                                                  var n = If(),
                                                                    i = Me(n);
                                                                  Rr(
                                                                    i,
                                                                    () => Dp,
                                                                    (e, r) => {
                                                                      r(e, {
                                                                        class:
                                                                          "cl-border-none cl-bg-transparent cl-px-0 cl-w-full",
                                                                        tabindex:
                                                                          "-1",
                                                                        children:
                                                                          Dr(
                                                                            Df,
                                                                            (
                                                                              e,
                                                                              r
                                                                            ) => {
                                                                              Mf(
                                                                                e,
                                                                                {
                                                                                  get item() {
                                                                                    return Ht(
                                                                                      t
                                                                                    );
                                                                                  },
                                                                                  get selectedValue() {
                                                                                    return Ht(
                                                                                      c
                                                                                    );
                                                                                  },
                                                                                  get itemClass() {
                                                                                    return s();
                                                                                  },
                                                                                  handleSelect:
                                                                                    u,
                                                                                }
                                                                              );
                                                                            }
                                                                          ),
                                                                        $$slots:
                                                                          {
                                                                            default:
                                                                              !0,
                                                                          },
                                                                      });
                                                                    }
                                                                  );
                                                                  var o = Ne(
                                                                    i,
                                                                    2
                                                                  );
                                                                  const a = _e(
                                                                    () =>
                                                                      Ht(t)
                                                                        ?.tooltipText
                                                                  );
                                                                  ph(o, {
                                                                    align:
                                                                      "start",
                                                                    showArrow:
                                                                      !1,
                                                                    side: "top",
                                                                    get text() {
                                                                      return Ht(
                                                                        a
                                                                      );
                                                                    },
                                                                  }),
                                                                    vr(e, n);
                                                                }
                                                              ),
                                                              $$slots: {
                                                                default: !0,
                                                              },
                                                            });
                                                          }
                                                        ),
                                                          vr(e, r);
                                                      };
                                                    Tr(n, (e) => {
                                                      Ht(t).isPro
                                                        ? e(o, !1)
                                                        : e(i);
                                                    }),
                                                      vr(e, r);
                                                  }
                                                ),
                                                vr(e, o);
                                            };
                                          Tr(o, (e) => {
                                            a() ? e(l) : e(d, !1);
                                          }),
                                            vr(e, i);
                                        }),
                                        $$slots: { default: !0 },
                                      });
                                    }
                                  ),
                                    vr(e, i);
                                }),
                                $$slots: { default: !0 },
                              });
                            }
                          ),
                          vr(e, p);
                      }),
                      $$slots: { default: !0 },
                    })
                  );
                }
              ),
                vr(e, p);
            }),
            $$slots: { default: !0 },
          });
        }
      ),
      vr(e, d),
      le({ ...Er() })
    );
  }
  K(Df), W(), ($f[F] = "src/lib/icons/AtomIcon.svelte");
  var Rf = er(
    fr(
      '<svg fill="none" viewBox="0 0 13 12" xmlns="http://www.w3.org/2000/svg"><path d="M10.3757 5.99828C10.069 5.99823 9.76633 6.06883 9.49128 6.20462C9.21623 6.34041 8.97616 6.53773 8.78969 6.78128L8.75469 6.76628C8.89221 6.34029 8.91282 5.88519 8.81438 5.44851C8.71593 5.01184 8.50205 4.6096 8.19506 4.28381C7.88808 3.95802 7.49925 3.72064 7.06918 3.59644C6.63912 3.47225 6.1836 3.46581 5.7502 3.57778L5.7047 3.49178C6.06788 3.16864 6.30077 2.72415 6.3597 2.2416C6.41863 1.75906 6.29957 1.27158 6.02482 0.870535C5.75007 0.469488 5.33851 0.182398 4.86725 0.0630692C4.39599 -0.0562597 3.89739 0.000363216 3.46489 0.222326C3.03239 0.44429 2.69568 0.816357 2.51786 1.2688C2.34004 1.72124 2.33331 2.223 2.49895 2.68005C2.66458 3.13709 2.99121 3.51804 3.41761 3.75151C3.844 3.98498 4.34091 4.05494 4.8152 3.94828L4.8517 4.01678C4.35172 4.40045 4.01539 4.95904 3.91022 5.58042C3.80505 6.2018 3.93883 6.83996 4.2847 7.36678L3.3422 8.24828C2.91618 8.01291 2.41895 7.94096 1.94369 8.04593C1.46843 8.15089 1.04775 8.42556 0.760494 8.81846C0.473234 9.21136 0.339106 9.69553 0.383245 10.1802C0.427383 10.6649 0.646759 11.1169 1.00026 11.4515C1.35377 11.786 1.81713 11.9802 2.30354 11.9976C2.78994 12.015 3.26599 11.8544 3.64249 11.546C4.01898 11.2375 4.27008 10.8023 4.34872 10.322C4.42737 9.84171 4.32816 9.3492 4.0697 8.93678L4.9887 8.07778C5.49344 8.41515 6.10382 8.55703 6.70561 8.47687C7.3074 8.39671 7.85936 8.10001 8.2582 7.64228L8.3977 7.70178C8.33717 8.10551 8.40165 8.51809 8.58246 8.88411C8.76328 9.25012 9.05177 9.55204 9.40919 9.7493C9.7666 9.94656 10.1758 10.0297 10.5819 9.98762C10.988 9.94551 11.3714 9.78014 11.6807 9.51374C11.9901 9.24733 12.2105 8.89264 12.3123 8.49732C12.4142 8.10199 12.3926 7.68496 12.2506 7.30224C12.1085 6.91952 11.8527 6.58944 11.5175 6.35635C11.1824 6.12325 10.7839 5.9983 10.3757 5.99828ZM3.3757 1.99828C3.3757 1.8005 3.43434 1.60716 3.54423 1.44271C3.65411 1.27826 3.81029 1.15009 3.99301 1.0744C4.17574 0.998716 4.3768 0.978913 4.57079 1.0175C4.76477 1.05608 4.94295 1.15132 5.0828 1.29118C5.22265 1.43103 5.3179 1.60921 5.35648 1.80319C5.39507 1.99717 5.37526 2.19824 5.29958 2.38097C5.22389 2.56369 5.09572 2.71987 4.93127 2.82975C4.76682 2.93963 4.57348 2.99828 4.3757 2.99828C4.11048 2.99828 3.85613 2.89293 3.66859 2.70539C3.48105 2.51785 3.3757 2.2635 3.3757 1.99828ZM2.3757 10.9983C2.17791 10.9983 1.98457 10.9396 1.82013 10.8298C1.65568 10.7199 1.5275 10.5637 1.45182 10.381C1.37613 10.1982 1.35632 9.99717 1.39491 9.80319C1.4335 9.60921 1.52874 9.43103 1.66859 9.29118C1.80844 9.15132 1.98662 9.05608 2.18061 9.0175C2.37459 8.97891 2.57565 8.99872 2.75838 9.0744C2.94111 9.15009 3.09728 9.27826 3.20717 9.44271C3.31705 9.60716 3.3757 9.8005 3.3757 9.99828C3.3757 10.2635 3.27034 10.5179 3.0828 10.7054C2.89527 10.8929 2.64091 10.9983 2.3757 10.9983ZM6.3757 7.49828C6.05104 7.49765 5.73535 7.3917 5.47605 7.19635C5.21675 7.001 5.02782 6.72679 4.93765 6.41491C4.84748 6.10302 4.86093 5.7703 4.97598 5.46672C5.09103 5.16313 5.30147 4.90507 5.5757 4.73128L5.7792 4.62278C5.98367 4.53384 6.20541 4.4916 6.42827 4.49914C6.65113 4.50669 6.8695 4.56382 7.0675 4.66639C7.2655 4.76896 7.43813 4.91439 7.57285 5.09208C7.70756 5.26978 7.80096 5.47527 7.84626 5.69361C7.89155 5.91195 7.88759 6.13764 7.83467 6.35425C7.78176 6.57087 7.68121 6.77296 7.54035 6.94583C7.39949 7.11869 7.22186 7.25797 7.02039 7.35354C6.81892 7.44911 6.59868 7.49856 6.3757 7.49828ZM10.3757 8.99828C10.1779 8.99828 9.98457 8.93963 9.82012 8.82975C9.65568 8.71987 9.5275 8.56369 9.45182 8.38097C9.37613 8.19824 9.35632 7.99717 9.39491 7.80319C9.4335 7.60921 9.52874 7.43103 9.66859 7.29118C9.80844 7.15132 9.98662 7.05608 10.1806 7.0175C10.3746 6.97891 10.5757 6.99872 10.7584 7.0744C10.9411 7.15009 11.0973 7.27826 11.2072 7.44271C11.317 7.60716 11.3757 7.8005 11.3757 7.99828C11.3757 8.2635 11.2703 8.51785 11.0828 8.70539C10.8953 8.89293 10.6409 8.99828 10.3757 8.99828Z"></path></svg>'
    ),
    $f[F],
    [[7, 0, [[8, 4]]]]
  );
  function $f(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "15px"),
      n = Tn(t, "height", 8, "15px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)");
    var o = Rf(),
      s = Pe(o);
    return (
      ze(() => {
        Xr(o, "height", n()), Xr(o, "width", r()), Xr(s, "fill", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K($f), W(), (Bf[F] = "src/lib/icons/LanguageIcon.svelte");
  var Ff = er(
    fr(
      '<svg fill="none" viewBox="0 0 21 12" xmlns="http://www.w3.org/2000/svg"><path d="M10.4838 0.5V11" stroke-width="0.8"></path><path d="M20.6667 3.61216V3.59491L20.6676 3.59587C20.6676 3.33616 20.4568 3.12533 20.1971 3.12533H17.3135V2.63753C17.3135 2.37782 17.1026 2.16699 16.8429 2.16699H16.8257C16.566 2.16699 16.3551 2.37782 16.3551 2.63753V3.12533H13.4715C13.2118 3.12533 13.001 3.33616 13.001 3.59587V3.61312C13.001 3.87283 13.2118 4.08366 13.4715 4.08366H18.7165C18.6187 4.90016 18.2469 6.56766 16.8343 7.70328C16.2957 7.26916 15.9085 6.75933 15.6297 6.24757C15.5463 6.0952 15.3891 5.99937 15.2157 5.99937C14.8582 5.99937 14.633 6.38078 14.8017 6.69608C15.0892 7.23178 15.4754 7.76845 15.9929 8.24283C15.3201 8.58112 14.4845 8.81208 13.4447 8.86383C13.1955 8.87628 13 9.08424 13 9.33341V9.35066C13 9.61995 13.2262 9.83462 13.4945 9.8212C14.9023 9.75316 15.991 9.39187 16.8333 8.87628C17.6757 9.39187 18.7644 9.75316 20.1722 9.8212C20.4415 9.83462 20.6667 9.61995 20.6667 9.35066V9.33341C20.6667 9.08328 20.4712 8.87628 20.222 8.86383C19.1832 8.81303 18.3465 8.58208 17.6748 8.24283C19.1774 6.8657 19.5703 4.96149 19.6729 4.0827H20.1961C20.4558 4.0827 20.6667 3.87187 20.6667 3.61216Z"></path><path d="M5.39651 2.28677C5.81721 2.4631 6.10088 2.86752 6.20342 3.31218H6.20151L7.56426 9.2596C7.63134 9.55285 7.40901 9.83268 7.10809 9.83268H7.09659C6.87905 9.83268 6.6893 9.68222 6.64042 9.46947L6.28201 7.91602H3.2968L2.92401 9.47331C2.87321 9.68414 2.68538 9.83268 2.4688 9.83268C2.16596 9.83268 1.94363 9.55093 2.01263 9.25673L3.42617 3.26522C3.57567 2.62122 4.14876 2.16602 4.80905 2.16602C5.00071 2.16602 5.19909 2.20435 5.39651 2.28677Z"></path><path d="M4.35965 3.48148L3.52686 6.95736H6.06069L5.26815 3.52652C5.22981 3.35977 5.13206 3.21506 5.02569 3.17098C4.9519 3.13936 4.87906 3.12402 4.80911 3.12402C4.59348 3.12402 4.40852 3.27161 4.35965 3.48148Z" fill="var(--clarify-bg-gray-1)"></path></svg>'
    ),
    Bf[F],
    [
      [
        7,
        0,
        [
          [8, 4],
          [9, 4],
          [11, 4],
          [13, 4],
        ],
      ],
    ]
  );
  function Bf(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "21px"),
      n = Tn(t, "height", 8, "15px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)");
    var o = Ff(),
      s = Pe(o),
      a = Ne(s),
      l = Ne(a);
    return (
      ze(() => {
        Xr(o, "height", n()),
          Xr(o, "width", r()),
          Xr(s, "stroke", i()),
          Xr(a, "fill", i()),
          Xr(l, "fill", i());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(Bf), W(), (jf[F] = "src/lib/icons/StarIcon.svelte");
  var qf = er(
    fr(
      '<svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" fill="#ffea00"></path></g></svg>'
    ),
    jf[F],
    [
      [
        5,
        0,
        [
          [6, 4],
          [7, 4],
          [8, 4, [[9, 8]]],
        ],
      ],
    ]
  );
  function jf(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "20px"),
      n = Tn(t, "height", 8, "20px");
    var i = qf();
    return (
      ze(() => {
        Xr(i, "height", n()), Xr(i, "width", r());
      }),
      vr(e, i),
      le({ ...Er() })
    );
  }
  async function Hf(e, t) {
    await t();
  }
  async function Vf(e, t) {
    await t();
  }
  K(jf), W(), (Qf[F] = "src/lib/components/common/Cl-alert.svelte");
  var Uf = er(hr('<span class="cl-sr-only">Close</span> <!>', 1), Qf[F], [
      [79, 12],
    ]),
    zf = er(hr('<p class="svelte-1hqkbgw"></p>'), Qf[F], [[85, 16]]),
    Gf = er(hr('<p class="svelte-1hqkbgw"></p>'), Qf[F], [[87, 16]]),
    Wf = er(hr('<p class="svelte-1hqkbgw"></p>'), Qf[F], [[89, 16]]),
    Kf = er(
      hr(
        '<a target="_blank" rel="noopener noreferrer" class="review-link svelte-1hqkbgw"><!></a>'
      ),
      Qf[F],
      [[95, 16]]
    ),
    Zf = er(
      hr(
        '<a target="_blank" rel="noopener noreferrer" class="review-link svelte-1hqkbgw"><!></a> <!>',
        1
      ),
      Qf[F],
      [[105, 16]]
    ),
    Xf = er(hr("<!> <!>", 1), Qf[F], []),
    Yf = er(
      hr(
        '<div class="alert-container svelte-1hqkbgw" id="alert-1" role="alert"><!> <div class="alert-text svelte-1hqkbgw"><!></div> <div class="alert-actions svelte-1hqkbgw"><!></div></div>'
      ),
      Qf[F],
      [
        [
          73,
          4,
          [
            [83, 8],
            [93, 8],
          ],
        ],
      ]
    );
  function Qf(e, t) {
    kr(new.target), ae(t, !0);
    let r = me(0),
      n = me(!1),
      i = me(!1),
      o = me(!1);
    function s() {
      ye(o, !1), u();
    }
    function a() {
      ye(n, !0), ye(i, !1), u();
    }
    function l() {
      ye(i, !0), ye(n, !1), u();
    }
    function c() {
      return $n.CHROME;
    }
    async function u() {
      await ih.saveToStorage("summary-app-review-snoozed-time", Date.now());
    }
    In(async () => {
      const e = await ih.getFromStorage("summary-app-processed-videos-count");
      if (e) {
        const t = Number(e);
        !isNaN(t) && t > 0 && ye(r, t, !0);
      }
      await (async function () {
        const e = await ih.getFromStorage("summary-app-was-review-clicked"),
          t = await ih.getFromStorage("summary-app-review-snoozed-time"),
          n = await ih.getFromStorage("summary-app-time-saved");
        if (e || !n || t) return void ye(o, !1);
        const i = new Date().getDay(),
          s = xe(i, 3) || xe(i, 6),
          a = (function () {
            const e = new Date(),
              t = e.getHours();
            return (t >= 10 && t <= 15) || (t >= 18 && t <= 21);
          })();
        Ht(r) > 20 && s && a && n && ye(o, !0);
      })();
    });
    var d = mr(),
      p = Me(d),
      h = (e) => {
        var t = Yf(),
          r = Pe(t);
        Vp(r, {
          "aria-label": "Close",
          clType: "icon",
          "data-dismiss-target": "#alert-1",
          onclick: s,
          rootClass: "alert-close-btn",
          children: Dr(Qf, (e, t) => {
            var r = Uf();
            Aa(Ne(Me(r), 2), {}), vr(e, r);
          }),
          $$slots: { default: !0 },
        });
        var o = Ne(r, 2),
          d = Pe(o),
          p = (e) => {
            var t = zf();
            (t.textContent = chrome.i18n.getMessage("alert_review_request")),
              vr(e, t);
          },
          h = (e, t) => {
            var r = (e) => {
                var t = Gf();
                (t.textContent = chrome.i18n.getMessage(
                  "alert_feedback_request"
                )),
                  vr(e, t);
              },
              n = (e) => {
                var t = Wf();
                (t.textContent = chrome.i18n.getMessage("alert_question_like")),
                  vr(e, t);
              };
            Tr(
              e,
              (e) => {
                Ht(i) ? e(r) : e(n, !1);
              },
              t
            );
          };
        Tr(d, (e) => {
          Ht(n) ? e(p) : e(h, !1);
        });
        var f = Pe(Ne(o, 2)),
          g = (e) => {
            var t = Kf();
            (t.__click = [Hf, u]),
              Vp(Pe(t), {
                clType: "reverse-default",
                rootClass: "alert-button alert-button-review",
                text: chrome.i18n.getMessage("alert_leave_review"),
                children: Dr(Qf, (e, t) => {
                  jf(e, {});
                }),
                $$slots: { default: !0 },
              }),
              ze((e) => Xr(t, "href", e), [c]),
              vr(e, t);
          },
          m = (e, t) => {
            var r = (e) => {
                var t = Zf(),
                  r = Me(t);
                Xr(r, "href", "https://forms.gle/gbDnHvTb43FUzGNu8"),
                  (r.__click = [Vf, u]),
                  Vp(Pe(r), {
                    clType: "reverse-default",
                    rootClass: "alert-button alert-button-feedback",
                    text: chrome.i18n.getMessage("alert_leave_review"),
                  }),
                  Vp(Ne(r, 2), {
                    clType: "default",
                    rootClass: "alert-button",
                    text: chrome.i18n.getMessage("alert_close"),
                    onclick: s,
                  }),
                  vr(e, t);
              },
              n = (e) => {
                var t = Xf(),
                  r = Me(t);
                Vp(r, {
                  clType: "reverse-default",
                  rootClass: "alert-button alert-button-yes",
                  text: chrome.i18n.getMessage("alert_yes"),
                  onclick: a,
                }),
                  Vp(Ne(r, 2), {
                    clType: "default",
                    rootClass: "alert-button",
                    text: chrome.i18n.getMessage("alert_no"),
                    onclick: l,
                  }),
                  vr(e, t);
              };
            Tr(
              e,
              (e) => {
                Ht(i) ? e(r) : e(n, !1);
              },
              t
            );
          };
        Tr(f, (e) => {
          Ht(n) ? e(g) : e(m, !1);
        }),
          vr(e, t);
      };
    return (
      Tr(p, (e) => {
        Ht(o) && e(h);
      }),
      vr(e, d),
      le({ ...Er() })
    );
  }
  K(Qf), cr(["click"]), W(), (eg[F] = "src/lib/icons/SummaryLengthIcon.svelte");
  var Jf = er(
    fr(
      '<svg fill="none" stroke-width="3" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="50.69" x2="56.32" y1="32" y2="32"></line><line x1="7.68" x2="38.69" y1="32" y2="32"></line><line x1="26.54" x2="56.32" y1="15.97" y2="15.97"></line><line x1="7.68" x2="14.56" y1="15.97" y2="15.97"></line><line x1="35" x2="56.32" y1="48.03" y2="48.03"></line><line x1="7.68" x2="23" y1="48.03" y2="48.03"></line><circle cx="20.55" cy="15.66" r="6"></circle><circle cx="44.69" cy="32" r="6"></circle><circle cx="29" cy="48.03" r="6"></circle></g></svg>'
    ),
    eg[F],
    [
      [
        6,
        0,
        [
          [7, 4],
          [8, 4],
          [
            9,
            4,
            [
              [10, 8],
              [11, 8],
              [12, 8],
              [13, 8],
              [14, 8],
              [15, 8],
              [16, 8],
              [17, 8],
              [18, 8],
            ],
          ],
        ],
      ],
    ]
  );
  function eg(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "15px"),
      n = Tn(t, "height", 8, "15px"),
      i = Tn(t, "fill", 8, "var(--clarify-font-color-black)");
    var o = Jf();
    return (
      ze(() => {
        Xr(o, "height", n()), Xr(o, "stroke", i()), Xr(o, "width", r());
      }),
      vr(e, o),
      le({ ...Er() })
    );
  }
  K(eg);
  class tg {
    static async checkForAlerts() {
      try {
        const e = await Yp.get("alerts");
        if (e && e.messageId && e.message) {
          if (
            (await ih.getFromStorage("summary-app-seen-alert-id")) !==
            e.messageId
          ) {
            const t = {
                allowedTags: ["b", "a"],
                allowedAttributes: { a: ["href", "target", "rel"] },
              },
              r = Sa(e.message, t);
            Ah({ messageId: e.messageId, message: r });
          }
        } else Ah({ messageId: null, message: null });
      } catch (e) {
        console.error("Failed to check for alerts:", e);
      }
    }
    static startAlertChecker() {
      this.checkForAlerts();
      return setInterval(() => {
        this.checkForAlerts();
      }, 3e5);
    }
  }
  W(), (cg[F] = "src/lib/components/summary/Summary.svelte");
  var rg = er(
      hr(
        '<div class="cl-flex cl-relative cl-py-0.5 cl-items-center cl-alert-message cl-text-xs cl-font-medium cl-ps-2 cl-scroll-pe-1 cl-pr-6 cl-rounded-xl svelte-h7k6bo"><span class="svelte-h7k6bo"><!></span> <!></div>'
      ),
      cg[F],
      [[415, 8, [[417, 12]]]]
    ),
    ng = er(hr("<!> <!>", 1), cg[F], []),
    ig = er(hr("<!> <!>", 1), cg[F], []),
    og = er(hr("<!> <!>", 1), cg[F], []),
    sg = er(hr("<!> <!>", 1), cg[F], []),
    ag = er(hr("<!> <!>", 1), cg[F], []);
  er(
    hr(
      '<div class="cl-flex cl-flex-col cl-absolute cl--top-10 cl-right-1/2 svelte-h7k6bo"><button class="svelte-h7k6bo">Clear all</button> <button class="svelte-h7k6bo">SUB check</button> <button class="svelte-h7k6bo">CAN</button></div>'
    ),
    cg[F],
    [
      [
        569,
        16,
        [
          [570, 20],
          [574, 20],
          [584, 20],
        ],
      ],
    ]
  );
  var lg = er(
    hr(
      '<div class="youtube-ai-widget svelte-h7k6bo"><!> <div class="cl-flex cl-flex-row cl-gap-3 cl-flex-wrap svelte-h7k6bo"><!> <!> <!></div> <!> <!> <div><div class="buttons-container svelte-h7k6bo"><!> <!> <!> <!></div> <!></div></div>'
    ),
    cg[F],
    [
      [
        413,
        0,
        [
          [428, 4],
          [521, 4, [[523, 8]]],
        ],
      ],
    ]
  );
  function cg(e, t) {
    kr(new.target), ae(t, !0);
    const [r, n] = bn(),
      i = () => (Mn(Sh), yn(Sh, "$appState", r)),
      o = () => (Mn(bh), yn(bh, "$settings", r));
    let s,
      a = me(!1),
      l = me(de([])),
      c = me(!0),
      u = _e(() => i().totalVideosAmount),
      d = _e(() => o().aiModel || "auto"),
      p = _e(() => o().language || "auto"),
      h = _e(() => o().summaryLength || "3");
    qe(() => {
      xe(Ht(u), void 0, !1) &&
        ih.saveToStorage("summary-app-processed-videos-count", Ht(u));
    });
    let f = _e(() => qn.map((e) => ({ ...e, onClick: (e.isPro, A) }))),
      g = Object.entries(Bn).map(([e, t]) => ({
        value: e,
        title: t,
        onClick: O,
      }));
    const m = jn.map((e) => ({ ...e, onClick: P }));
    let v,
      y = me(!1),
      b = me(!1),
      w = me(!1),
      x = me(!1),
      C = me(!1),
      S = me(""),
      k = _e(() => (Mn(zp), yn(zp, "$user", r)).value),
      E = _e(() => i().isAlertVisible),
      T = _e(() => i().alertMessage);
    function A(e) {
      console.log("saveld"),
        ih.saveToStorage("summary-app-active-model", e.value),
        wh("aiModel", e.value);
    }
    function O(e) {
      ih.saveToStorage("summary-app-language", e.value),
        wh("language", e.value);
    }
    function P(e) {
      ih.saveToStorage("summary-app-summary-length", e.value),
        wh("summaryLength", e.value);
    }
    async function M() {
      try {
        const e = await rf.getCleanTextAndLang();
        if (e?.text) return { text: e.text, lang: e.lang };
      } catch (e) {
        console.error(
          "Failed to get transcript via YoutubeTranscript API, using fallback method"
        );
      }
      const e = await (async function () {
        const e = Kn();
        if (!e) return null;
        const t = (await zn()) ? Yn : Qn;
        return ni(Jn, t, e);
      })();
      if (!e)
        throw new Error(chrome.i18n.getMessage("transcript_does_not_exist"));
      return { text: e };
    }
    async function N(e) {
      const t = xe(o().aiModel, "auto", !1) ? o().aiModel : null,
        r = o().language && xe(o().language, "auto", !1) ? o().language : e;
      return { model: t, answerSize: o().summaryLength || "2", language: r };
    }
    async function I() {
      ye(y, !0), ye(c, !0), ye(x, !0), v?.toggleAnimation(), s?.clearText();
      try {
        const e = await M().catch((e) => {
            throw new Error(chrome.i18n.getMessage("cannot_load_transcript"));
          }),
          { text: t, lang: r } = e;
        if (!t?.trim())
          throw new Error(chrome.i18n.getMessage("transcript_empty"));
        const n = await N(r);
        t.length > Rn
          ? await (async function (e, t) {
              try {
                const r = await ef.getLargeTextSummary(
                  e,
                  t.model,
                  t.answerSize,
                  t.language
                );
                await L().catch((e) => {
                  console.warn(...Nn(0, "Failed to update user info:", e));
                }),
                  s?.clearText(),
                  s?.addTextToQueue(r);
              } catch (e) {
                throw (
                  (console.error(
                    ...Nn(0, "Error getting large text summary:", e)
                  ),
                  e)
                );
              }
            })(t, n)
          : await (async function (e, t) {
              await ef.getSummary(
                e,
                (e) => {
                  s?.addTextToQueue(e);
                },
                L,
                t.model,
                t.answerSize,
                t.language
              );
            })(t, n);
      } catch (e) {
        console.error(...Nn(0, "Summary generation error:", e)),
          s?.clearHelperMessage(),
          s?.clearText();
        const t =
          e instanceof Error && Ht(k)
            ? e.message
            : "Authorization is required to process long videos.";
        s?.addTextToQueue(t);
      } finally {
        ye(y, !1), s?.clearHelperMessage(), v?.toggleAnimation();
      }
    }
    function _() {
      ye(x, !1), s?.clearText(), ye(a, !1), ye(C, !1);
    }
    In(async () => {
      ye(b, !0),
        await (async function () {
          let e;
          try {
            e = await Zp.checkAuth();
          } catch (e) {
            const t = await ih.getFromStorage("summary-app-time-saved-short");
            sh({
              time: await ih.getFromStorage("summary-app-time-saved"),
              shortTime: t,
            });
            try {
              await Zp.logoutToken();
            } catch (e) {
              console.error(...Nn(0, e));
            } finally {
              ye(y, !1);
            }
            console.error(...Nn(0, e));
          } finally {
            ye(y, !1);
          }
          try {
            if (e) {
              Kp(!0);
              const e = await Zp.getUser();
              e &&
                (await Wp(e),
                await ah({ time: e.time, shortTime: e.shortTime }),
                xe(e?.videosAmount, null, !1) &&
                  xe(e?.videosAmount, void 0, !1) &&
                  kh("totalVideosAmount", e?.videosAmount));
            }
          } catch (e) {
            console.error(...Nn(0, e));
          } finally {
            Kp(!1);
          }
        })(),
        await (async function () {
          if (Eh()) return;
          if (!(await ih.getFromStorage("summary-app-review-show-time")))
            return void kh("isWelcomeStripOpened", !0);
        })(),
        kh("totalVideosAmount", Ht(u));
      const e = tg.startAlertChecker();
      return (
        ye(b, !1),
        () => {
          clearInterval(e);
        }
      );
    });
    const L = async () => {
      if (Ht(k))
        try {
          const e = await Wn(),
            t = await Jh.updateUserState(e);
          if (t) {
            kh("totalVideosAmount", Number(t?.videosAmount) || 0);
          }
        } catch (e) {
          console.error(...Nn(0, e));
        }
    };
    function D() {
      !(function () {
        const e = gn(Sh);
        kh("isAlertVisible", !1),
          e.alertId && ih.saveToStorage("summary-app-seen-alert-id", e.alertId);
      })();
    }
    var R = lg(),
      $ = Pe(R),
      F = (e) => {
        var t = rg(),
          r = Pe(t);
        _r(Pe(r), () => Ht(T), !1, !1),
          Vp(Ne(r, 2), {
            clType: "transparent",
            onclick: D,
            rootClass: "cl-p-[0.2rem] cl-absolute cl-top-[0.1rem] cl-right-1",
            children: Dr(cg, (e, t) => {
              Aa(e, { height: "1.4rem", width: "1.4rem" });
            }),
            $$slots: { default: !0 },
          }),
          vr(e, t);
      };
    Tr($, (e) => {
      Ht(E) && Ht(T) && e(F);
    });
    var B = Ne($, 2),
      q = Pe(B);
    Rr(
      q,
      () => Mp,
      (e, t) => {
        t(e, {
          delayDuration: 300,
          disableHoverableContent: !0,
          ignoreNonKeyboardFocus: !0,
          children: Dr(cg, (e, t) => {
            var r = ng(),
              n = Me(r);
            Rr(
              n,
              () => Dp,
              (e, t) => {
                {
                  const r = Dr(cg, (e, t) => {
                    let r = () => t?.().props;
                    r();
                    const n = _e(() => !Ht(k));
                    {
                      const t = Dr(cg, (e) => {
                          $f(e, {});
                        }),
                        i = Dr(cg, (e) => {
                          uh(e, {});
                        });
                      Df(
                        e,
                        kn(r, {
                          ariaLabel: "Select Gemini AI Model",
                          contentProps: { align: "start" },
                          get items() {
                            return Ht(f);
                          },
                          get selectedValue() {
                            return Ht(d);
                          },
                          get showBodyComponent() {
                            return Ht(n);
                          },
                          iconComponent: t,
                          bodyComponent: i,
                          $$slots: { iconComponent: !0, bodyComponent: !0 },
                        })
                      );
                    }
                  });
                  t(e, {
                    class: "cl-border-none cl-bg-transparent cl-px-0 cl-w-full",
                    tabindex: -1,
                    child: r,
                    $$slots: { child: !0 },
                  });
                }
              }
            ),
              ph(Ne(n, 2), {
                align: "center",
                side: "bottom",
                text: chrome.i18n.getMessage("ai_model_description"),
              }),
              vr(e, r);
          }),
          $$slots: { default: !0 },
        });
      }
    );
    var j = Ne(q, 2);
    Rr(
      j,
      () => Mp,
      (e, t) => {
        t(e, {
          delayDuration: 300,
          disableHoverableContent: !0,
          ignoreNonKeyboardFocus: !0,
          children: Dr(cg, (e, t) => {
            var r = ig(),
              n = Me(r);
            Rr(
              n,
              () => Dp,
              (e, t) => {
                {
                  const r = Dr(cg, (e, t) => {
                    let r = () => t?.().props;
                    r();
                    const n = _e(() => !Ht(k));
                    {
                      const t = Dr(cg, (e) => {
                          Bf(e, {});
                        }),
                        i = Dr(cg, (e) => {
                          uh(e, {});
                        });
                      Df(
                        e,
                        kn(r, {
                          ariaLabel: "Select Language",
                          contentProps: { align: "start" },
                          items: g,
                          get selectedValue() {
                            return Ht(p);
                          },
                          get showBodyComponent() {
                            return Ht(n);
                          },
                          iconComponent: t,
                          bodyComponent: i,
                          $$slots: { iconComponent: !0, bodyComponent: !0 },
                        })
                      );
                    }
                  });
                  t(e, {
                    class: "cl-border-none cl-bg-transparent cl-px-0 cl-w-full",
                    tabindex: -1,
                    child: r,
                    $$slots: { child: !0 },
                  });
                }
              }
            ),
              ph(Ne(n, 2), {
                align: "center",
                side: "bottom",
                text: chrome.i18n.getMessage("language_selection_description"),
              }),
              vr(e, r);
          }),
          $$slots: { default: !0 },
        });
      }
    ),
      Rr(
        Ne(j, 2),
        () => Mp,
        (e, t) => {
          t(e, {
            delayDuration: 300,
            disableHoverableContent: !0,
            ignoreNonKeyboardFocus: !0,
            children: Dr(cg, (e, t) => {
              var r = og(),
                n = Me(r);
              Rr(
                n,
                () => Dp,
                (e, t) => {
                  {
                    const r = Dr(cg, (e, t) => {
                      let r = () => t?.().props;
                      r();
                      const n = _e(() => !Ht(k));
                      {
                        const t = Dr(cg, (e) => {
                            eg(e, {});
                          }),
                          i = Dr(cg, (e) => {
                            uh(e, {});
                          });
                        Df(
                          e,
                          kn(r, {
                            ariaLabel: "Select Answer Length",
                            contentProps: { align: "start" },
                            items: m,
                            get selectedValue() {
                              return Ht(h);
                            },
                            get showBodyComponent() {
                              return Ht(n);
                            },
                            iconComponent: t,
                            bodyComponent: i,
                            $$slots: { iconComponent: !0, bodyComponent: !0 },
                          })
                        );
                      }
                    });
                    t(e, {
                      class:
                        "cl-border-none cl-bg-transparent cl-px-0 cl-w-full",
                      tabindex: -1,
                      child: r,
                      $$slots: { child: !0 },
                    });
                  }
                }
              ),
                ph(Ne(n, 2), {
                  align: "center",
                  side: "bottom",
                  text: chrome.i18n.getMessage("summary_length_description"),
                }),
                vr(e, r);
            }),
            $$slots: { default: !0 },
          });
        }
      );
    var H = Ne(B, 2);
    Qf(H, {});
    var V = Ne(H, 2);
    kf(V, {
      onChange: function (e) {
        ye(S, e, !0);
      },
      onSubmit: async function (e) {
        if (e && e.trim()) {
          ye(y, !0),
            ye(c, !0),
            ye(C, !0),
            s?.clearText(),
            s?.showHelperFor(chrome.i18n.getMessage("processing_query"), 2e3);
          try {
            const t = await M().catch((e) => {
                throw new Error(
                  chrome.i18n.getMessage("cannot_load_transcript")
                );
              }),
              { text: r, lang: n } = t;
            if (!r?.trim())
              throw new Error(chrome.i18n.getMessage("transcript_empty"));
            const i = await N(n),
              o = await ef.answerVideoQuery(e, r, i.model, i.language);
            await L().catch((e) => {
              console.warn(...Nn(0, "Failed to update user info:", e));
            }),
              s?.clearText(),
              s?.addTextToQueue(o);
          } catch (e) {
            console.error(...Nn(0, "Error processing video query:", e)),
              s?.clearHelperMessage(),
              s?.clearText();
            const t =
              e instanceof Error
                ? e.message
                : chrome.i18n.getMessage("error_processing_query");
            s?.addTextToQueue(t);
          } finally {
            ye(y, !1), s?.clearHelperMessage();
          }
        }
      },
      placeholder: chrome.i18n.getMessage("ask_about_video"),
      get value() {
        return Ht(S);
      },
    });
    var U = Ne(V, 2);
    let z;
    var G = Pe(U),
      W = Pe(G);
    Rr(
      W,
      () => Mp,
      (e, t) => {
        t(e, {
          delayDuration: 300,
          disableHoverableContent: !0,
          ignoreNonKeyboardFocus: !0,
          children: Dr(cg, (e, t) => {
            var r = sg(),
              n = Me(r);
            Rr(
              n,
              () => Dp,
              (e, t) => {
                {
                  const r = Dr(cg, (e, t) => {
                    let r = () => t?.().props;
                    r();
                    const n = _e(() => Ht(y) || Ht(b));
                    Vp(
                      e,
                      kn(r, {
                        get disabled() {
                          return Ht(n);
                        },
                        onclick: I,
                        rootClass: "cl-px-2 cl-py-0",
                        text: chrome.i18n.getMessage("summarize_btn"),
                        children: Dr(cg, (e, t) => {
                          dn(
                            li(e, {}),
                            (e) => (v = e),
                            () => v
                          );
                        }),
                        $$slots: { default: !0 },
                      })
                    );
                  });
                  t(e, {
                    class: "cl-border-none cl-bg-transparent cl-px-0 cl-w-full",
                    tabindex: -1,
                    child: r,
                    $$slots: { child: !0 },
                  });
                }
              }
            ),
              ph(Ne(n, 2), {
                align: "center",
                side: "bottom",
                text: chrome.i18n.getMessage("summary_btn_description"),
              }),
              vr(e, r);
          }),
          $$slots: { default: !0 },
        });
      }
    );
    var K = Ne(W, 2);
    Rr(
      K,
      () => Mp,
      (e, t) => {
        t(e, {
          delayDuration: 150,
          disableHoverableContent: !0,
          ignoreNonKeyboardFocus: !0,
          children: Dr(cg, (e, t) => {
            var r = ag(),
              n = Me(r);
            Rr(
              n,
              () => Dp,
              (e, t) => {
                {
                  const r = Dr(cg, (e, t) => {
                    let r = () => t?.().props;
                    r();
                    const n = _e(() => Ht(y) || Ht(b));
                    wf(
                      e,
                      kn(r, {
                        rootClass: "cl-py-1.5",
                        getTimestampsClicked: () => {
                          _(), ye(c, !1), ye(w, !0), ye(a, !0);
                        },
                        get isInitialLoading() {
                          return Ht(b);
                        },
                        get disabled() {
                          return Ht(n);
                        },
                        timestampsData: (e) => {
                          ye(l, e, !0), ye(w, !1);
                        },
                      })
                    );
                  });
                  t(e, {
                    class: "cl-border-none cl-bg-transparent cl-px-0 cl-w-full",
                    tabindex: -1,
                    child: r,
                    $$slots: { child: !0 },
                  });
                }
              }
            ),
              ph(Ne(n, 2), {
                align: "center",
                side: "bottom",
                text: chrome.i18n.getMessage("timestamps_btn_description"),
              }),
              vr(e, r);
          }),
          $$slots: { default: !0 },
        });
      }
    );
    var Z = Ne(K, 2);
    Qh(Z, {
      get isInitialLoading() {
        return Ht(b);
      },
    }),
      Tr(Ne(Z, 2), (e) => {});
    var X = Ne(G, 2),
      Y = (e) => {
        {
          const t = Dr(cg, (e) => {
            mf(e, {
              get isLoading() {
                return Ht(w);
              },
              get data() {
                return Ht(l);
              },
            });
          });
          dn(
            yh(e, {
              get isLoading() {
                return Ht(y);
              },
              get isTextMode() {
                return Ht(c);
              },
              textClosed: _,
              body: t,
              $$slots: { body: !0 },
            }),
            (e) => (s = e),
            () => s
          );
        }
      };
    Tr(X, (e) => {
      (Ht(x) || Ht(a) || Ht(C)) && e(Y);
    }),
      ze(
        (e) =>
          (z = Hr(
            U,
            1,
            "cl-flex cl-flex-col cl-gap-3 svelte-h7k6bo",
            null,
            z,
            e
          )),
        [() => ({ "cl-flex-col-reverse": Ht(C) && !Ht(a) && !Ht(x) })]
      ),
      vr(e, R);
    var Q = le({ ...Er() });
    return n(), Q;
  }
  function ug(e, t) {
    t()();
  }
  K(cg),
    cr(["click"]),
    W(),
    (hg[F] = "src/lib/components/common/popup/Popup.svelte");
  var dg = (e) => e.stopPropagation(),
    pg = er(
      hr(
        '<div class="popup-wrapper cl-relative svelte-10mf6fj" role="dialog" aria-modal="true"><div class="cl-fixed cl-inset-0 cl-bg-gray-500/75 cl-transition-opacity" aria-hidden="true"></div> <div class="cl-fixed cl-inset-0 cl-z-10 cl-w-screen cl-overflow-y-auto"><div class="cl-flex cl-min-h-full cl-items-end cl-justify-center cl-p-4 cl-text-center cl-sm:items-center cl-sm:p-0"><div class="panel-wrapper cl-relative cl-transform cl-overflow-hidden cl-text-left cl-shadow-xl cl-transition-all svelte-10mf6fj"><div class="cl-w-full cl-flex cl-justify-end"><!></div> <!></div></div></div></div>'
      ),
      hg[F],
      [
        [
          41,
          4,
          [
            [43, 8],
            [50, 8, [[51, 12, [[53, 16, [[58, 20]]]]]]],
          ],
        ],
      ]
    );
  function hg(e, t) {
    kr(new.target), ae(t, !0);
    let r = Tn(t, "isOpen", 3, !1),
      n = Tn(t, "onClose", 3, () => {}),
      i = Tn(t, "body", 3, void 0);
    qe(() => {
      const e = document.querySelector("body");
      r() && e
        ? (e.style.overflow = "hidden")
        : e && (e.style.overflow = "auto");
    });
    var o,
      s,
      a,
      l,
      c,
      u,
      d = mr();
    (u = ar(
      (o = "keydown"),
      (s = Ce),
      function (e) {
        xe(e.key, "Escape") && r() && n()();
      },
      (c = { capture: a, passive: l })
    )),
      (s !== document.body && s !== window && s !== document) ||
        Be(() => {
          s.removeEventListener(o, u, c);
        });
    var p = Me(d),
      h = (e) => {
        var t = pg(),
          r = Pe(t);
        r.__click = [ug, n];
        var o = Ne(r, 2);
        o.__click = [ug, n];
        var s = Pe(o),
          a = Pe(s);
        a.__click = [dg];
        var l = Pe(a);
        Vp(Pe(l), {
          clType: "transparent",
          onclick: () => n()(),
          children: Dr(hg, (e, t) => {
            Aa(e, {});
          }),
          $$slots: { default: !0 },
        });
        var c = Ne(l, 2),
          u = (e) => {
            var t = mr();
            Lr(Me(t), i), vr(e, t);
          };
        Tr(c, (e) => {
          i() && e(u);
        }),
          ln(
            3,
            r,
            () => sf,
            () => ({ duration: 200 })
          ),
          ln(
            3,
            a,
            () => af,
            () => ({ duration: 300, start: 0.95, opacity: 0 })
          ),
          vr(e, t);
      };
    return (
      Tr(p, (e) => {
        r() && e(h);
      }),
      vr(e, d),
      le({ ...Er() })
    );
  }
  K(hg), cr(["click"]), W(), (gg[F] = "src/lib/icons/StripeIcon.svelte");
  var fg = er(
    fr(
      '<svg viewBox="0 0" xmlns="http://www.w3.org/2000/svg"><path d="M113 26H6c-3.314 0-6-2.686-6-6V6c0-3.314 2.686-6 6-6h107c3.314 0 6 2.686 6 6v14c0 3.314-2.686 6-6 6zm5-20c0-2.761-2.239-5-5-5H6C3.239 1 1 3.239 1 6v14c0 2.761 2.239 5 5 5h107c2.761 0 5-2.239 5-5z" fill="#424770" fill-rule="evenodd" opacity=".349"></path><path d="M60.7 18.437h-1.305l1.01-2.494-2.01-5.072h1.379l1.263 3.452 1.273-3.452h1.379zm-5.01-2.178c-.452 0-.916-.168-1.336-.495v.369h-1.347V8.566h1.347v2.663c.42-.316.884-.484 1.336-.484 1.41 0 2.378 1.136 2.378 2.757 0 1.62-.968 2.757-2.378 2.757zm-.284-4.357c-.368 0-.737.158-1.052.474v2.252c.315.315.684.473 1.052.473.758 0 1.284-.652 1.284-1.599s-.526-1.6-1.284-1.6zm-7.852 3.862c-.41.327-.873.495-1.336.495-1.4 0-2.378-1.137-2.378-2.757 0-1.621.978-2.757 2.378-2.757.463 0 .926.168 1.336.484V8.566h1.358v7.567h-1.358zm0-3.388c-.305-.316-.673-.474-1.041-.474-.769 0-1.295.653-1.295 1.6 0 .947.526 1.599 1.295 1.599.368 0 .736-.158 1.041-.473zm-8.019 1.494c.084.8.716 1.347 1.599 1.347.485 0 1.021-.179 1.568-.495v1.127c-.599.273-1.199.41-1.789.41-1.589 0-2.704-1.158-2.704-2.799 0-1.589 1.094-2.715 2.599-2.715 1.379 0 2.315 1.084 2.315 2.63 0 .148 0 .316-.021.495zm1.221-2.084c-.653 0-1.158.485-1.221 1.211h2.294c-.042-.716-.473-1.211-1.073-1.211zm-4.768.832v3.515h-1.347v-5.262h1.347v.526c.379-.421.842-.652 1.294-.652.148 0 .295.01.442.052v1.2c-.147-.042-.315-.063-.473-.063-.442 0-.916.242-1.263.684zm-6.009 1.252c.084.8.715 1.347 1.599 1.347.484 0 1.021-.179 1.568-.495v1.127c-.6.273-1.2.41-1.789.41-1.589 0-2.704-1.158-2.704-2.799 0-1.589 1.094-2.715 2.599-2.715 1.378 0 2.315 1.084 2.315 2.63 0 .148 0 .316-.021.495zm1.22-2.084c-.652 0-1.157.485-1.22 1.211h2.294c-.042-.716-.474-1.211-1.074-1.211zm-5.925 4.347L24.2 12.555l-1.063 3.578h-1.21l-1.81-5.262h1.347l1.063 3.578 1.063-3.578h1.22l1.063 3.578 1.063-3.578h1.347l-1.799 5.262zm-8.231.126c-1.589 0-2.715-1.147-2.715-2.757 0-1.621 1.126-2.757 2.715-2.757s2.705 1.136 2.705 2.757c0 1.61-1.116 2.757-2.705 2.757zm0-4.388c-.789 0-1.336.663-1.336 1.631s.547 1.631 1.336 1.631c.779 0 1.326-.663 1.326-1.631s-.547-1.631-1.326-1.631zm-5.915 1.662h-1.21v2.6H8.571V8.892h2.557c1.474 0 2.526.958 2.526 2.326s-1.052 2.315-2.526 2.315zm-.189-3.546H9.918v2.452h1.021c.779 0 1.326-.495 1.326-1.221 0-.736-.547-1.231-1.326-1.231zm100.177 4.064h-5.559c.127 1.331 1.102 1.723 2.209 1.723 1.127 0 2.015-.238 2.789-.628v2.287c-.771.428-1.79.736-3.147.736-2.766 0-4.704-1.732-4.704-5.156 0-2.892 1.644-5.188 4.345-5.188 2.697 0 4.105 2.295 4.105 5.203 0 .275-.025.87-.038 1.023zm-4.085-3.911c-.71 0-1.499.536-1.499 1.815h2.936c0-1.278-.74-1.815-1.437-1.815zm-8.923 8.029c-.994 0-1.601-.419-2.009-.718l-.006 3.213-2.839.604-.001-13.254h2.5l.148.701c.392-.366 1.111-.89 2.224-.89 1.994 0 3.872 1.796 3.872 5.102 0 3.608-1.858 5.242-3.889 5.242zm-.662-7.829c-.651 0-1.06.238-1.356.563l.017 4.219c.276.299.673.539 1.339.539 1.05 0 1.754-1.143 1.754-2.672 0-1.485-.715-2.649-1.754-2.649zm-8.297-2.326h2.85v9.952h-2.85zm0-3.178l2.85-.606v2.313l-2.85.606zm-3.039 6.383v6.747h-2.838V8.014h2.455l.178.839c.665-1.222 1.992-.974 2.37-.838v2.61c-.361-.117-1.494-.287-2.165.594zm-6.086 3.256c0 1.673 1.792 1.152 2.155 1.007v2.311c-.378.208-1.064.376-1.992.376-1.685 0-2.95-1.241-2.95-2.922l.013-9.109 2.772-.59.002 2.466h2.156v2.421h-2.156zm-3.539.484c0 2.044-1.627 3.21-3.988 3.21-.979 0-2.049-.19-3.105-.644v-2.711c.953.518 2.167.907 3.108.907.633 0 1.089-.17 1.089-.695 0-1.355-4.316-.845-4.316-3.988 0-2.01 1.535-3.213 3.838-3.213.941 0 1.881.144 2.822.519v2.675c-.864-.467-1.961-.731-2.824-.731-.595 0-.965.172-.965.615 0 1.278 4.341.67 4.341 4.056z" fill="#424770" fill-rule="evenodd" opacity=".502"></path></svg>'
    ),
    gg[F],
    [
      [
        5,
        0,
        [
          [6, 4],
          [8, 4],
        ],
      ],
    ]
  );
  function gg(e, t) {
    kr(new.target), ae(t, !1);
    let r = Tn(t, "width", 8, "120px"),
      n = Tn(t, "height", 8, "26px");
    var i = fg();
    return (
      ze(() => {
        Xr(i, "height", n()), Xr(i, "width", r());
      }),
      vr(e, i),
      le({ ...Er() })
    );
  }
  K(gg);
  const mg = new (class {
    async createCheckoutSession(e) {
      return await Yp.post(
        "subscriptions/create-checkout-session",
        { plan: e, redirectURL: window.location.href },
        { headers: { "Content-Type": "application/json" } }
      );
    }
    async getSubscriptionPrices() {
      return await Yp.get("subscriptions/prices", {
        headers: { "Content-Type": "application/json" },
      });
    }
  })();
  W(), (yg[F] = "src/lib/icons/GradientCheckIcon.svelte");
  var vg = er(
    fr(
      '<svg fill="none" height="14" viewBox="0 0 22 18" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 8.5L7.5 14.5L20.5 1.5" stroke="url(#paint0_linear_194_6698)" stroke-width="4"></path><defs><linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_194_6698" x1="0.00980392" x2="20.5009" y1="0.200001" y2="0.159963"><stop stop-color="#FF9EC1"></stop><stop offset="0.16" stop-color="#FF7EE3"></stop><stop offset="0.32" stop-color="#E17CFF"></stop><stop offset="0.51" stop-color="#A07EFF"></stop><stop offset="0.625" stop-color="#8886FF"></stop><stop offset="0.772417" stop-color="#7995FE"></stop><stop offset="0.890437" stop-color="#51A6FF"></stop><stop offset="1" stop-color="#50C0FF"></stop></linearGradient></defs></svg>'
    ),
    yg[F],
    [
      [
        1,
        0,
        [
          [2, 4],
          [
            3,
            4,
            [
              [
                4,
                8,
                [
                  [7, 12],
                  [8, 12],
                  [9, 12],
                  [10, 12],
                  [11, 12],
                  [12, 12],
                  [13, 12],
                  [14, 12],
                ],
              ],
            ],
          ],
        ],
      ],
    ]
  );
  function yg(e, t) {
    return kr(new.target), ae(t, !1), vr(e, vg()), le({ ...Er() });
  }
  K(yg), W(), (Ag[F] = "src/lib/components/premium/PremiumPopup.svelte");
  var bg = er(hr('<span class="font-gradient svelte-1n7yrnv"></span>'), Ag[F], [
      [114, 32],
    ]),
    wg = er(
      hr(
        '<div><div class="banner-content svelte-1n7yrnv"><div class="banner-title svelte-1n7yrnv"></div> <div class="banner-description svelte-1n7yrnv"></div></div> <div class="cl-flex cl-flex-col cl-align-middle"><!> <div class="cl-text-center"><span class="no-card-text svelte-1n7yrnv"></span></div></div></div>'
      ),
      Ag[F],
      [
        [
          106,
          20,
          [
            [
              107,
              24,
              [
                [108, 28],
                [109, 28],
              ],
            ],
            [111, 24, [[116, 28, [[117, 32]]]]],
          ],
        ],
      ]
    ),
    xg = er(
      hr(
        '<div class="plan-title svelte-1n7yrnv"></div> <div class="price-container svelte-1n7yrnv"><span class="currency svelte-1n7yrnv"> </span> <span class="period svelte-1n7yrnv"></span></div> <!>',
        1
      ),
      Ag[F],
      [
        [125, 28],
        [
          126,
          28,
          [
            [127, 32],
            [128, 32],
          ],
        ],
      ]
    ),
    Cg = er(
      hr(
        '<div class="plan-title svelte-1n7yrnv"><div class="cl-max-w-sm cl-animate-pulse cl-mr-2" role="status"><div class="cl-h-9 cl-dark:bg-gray-200 cl-rounded-md cl-bg-gray-500 cl-w-1/2"></div></div></div> <div class="plan-title svelte-1n7yrnv"><div class="cl-max-w-sm cl-animate-pulse cl-mr-2" role="status"><div class="cl-h-9 cl-dark:bg-gray-200 cl-rounded-md cl-bg-gray-500 cl-w-10/12"></div></div></div> <div class="cl-max-w-sm cl-animate-pulse cl-mr-2" role="status"><div class="cl-h-12 cl-dark:bg-gray-200 cl-rounded-lg cl-bg-gray-500 cl-w-full"></div></div>',
        1
      ),
      Ag[F],
      [
        [137, 28, [[138, 32, [[139, 36]]]]],
        [142, 28, [[143, 32, [[144, 36]]]]],
        [147, 28, [[148, 32]]],
      ]
    ),
    Sg = er(
      hr(
        '<div class="plan-title svelte-1n7yrnv"></div> <div class="price-container svelte-1n7yrnv"><span class="currency svelte-1n7yrnv"> </span> <span class="period svelte-1n7yrnv"></span> <span class="badge clarify-gradient-border svelte-1n7yrnv"><span class="font-gradient svelte-1n7yrnv"> </span></span></div> <div class="annual-total svelte-1n7yrnv"> </div> <div class="savings svelte-1n7yrnv"><span class="font-gradient svelte-1n7yrnv"> </span></div> <!>',
        1
      ),
      Ag[F],
      [
        [158, 28],
        [
          159,
          28,
          [
            [160, 32],
            [161, 32],
            [162, 32, [[163, 36]]],
          ],
        ],
        [166, 28],
        [167, 28, [[168, 32]]],
      ]
    ),
    kg = er(
      hr(
        '<div class="plan-title svelte-1n7yrnv"><div class="cl-max-w-sm cl-animate-pulse cl-mr-2" role="status"><div class="cl-h-9 cl-dark:bg-gray-200 cl-rounded-md cl-bg-gray-500 cl-w-1/2"></div></div></div> <div class="plan-title svelte-1n7yrnv"><div class="cl-max-w-sm cl-animate-pulse cl-mr-2" role="status"><div class="cl-h-9 cl-dark:bg-gray-200 cl-rounded-md cl-bg-gray-500 cl-w-10/12"></div></div></div> <div class="cl-max-w-sm cl-animate-pulse cl-mr-2 cl-mb-4" role="status"><div class="cl-h-12 cl-dark:bg-gray-200 cl-rounded-lg cl-bg-gray-500 cl-w-full"></div></div> <div class="cl-max-w-sm cl-animate-pulse cl-mr-2" role="status"><div class="cl-h-12 cl-dark:bg-gray-200 cl-rounded-lg cl-bg-gray-500 cl-w-full"></div></div>',
        1
      ),
      Ag[F],
      [
        [177, 28, [[178, 32, [[179, 36]]]]],
        [182, 28, [[183, 32, [[184, 36]]]]],
        [187, 28, [[188, 32]]],
        [190, 28, [[191, 32]]],
      ]
    ),
    Eg = er(
      hr(
        '<div class="cl-flex cl-flex-col cl-mx-auto cl-items-center cl-rounded-xl cl-relative cl-overflow-hidden"><div class="premium-popup cl-flex cl-flex-col cl-align-middle svelte-1n7yrnv"><div class="cl-text-center cl-mb-6"><h2 class="cl-text-4xl cl-mb-2 cl-font-medium"></h2> <p class="premium-popup-description svelte-1n7yrnv"></p></div> <div class="plan-features svelte-1n7yrnv"><div class="cl-flex cl-flex-col cl-w-fit"><div class="plan-feature svelte-1n7yrnv"><!> <span></span></div> <div class="plan-feature svelte-1n7yrnv"><!> <span></span></div> <div class="plan-feature svelte-1n7yrnv"><!> <span></span></div> <div class="plan-feature svelte-1n7yrnv"><!> <span></span></div></div></div> <!> <div class="plans-container svelte-1n7yrnv"><div class="plan-card svelte-1n7yrnv"><!></div> <div class="plan-card clarify-gradient-border svelte-1n7yrnv"><div class="popular-tag clarify-gradient-border svelte-1n7yrnv"><div class="font-gradient svelte-1n7yrnv"></div></div> <!></div></div></div> <div class="footer svelte-1n7yrnv"></div> <div class="cl-flex cl-justify-center cl-pb-3"><!></div></div>'
      ),
      Ag[F],
      [
        [
          79,
          8,
          [
            [
              80,
              12,
              [
                [
                  81,
                  16,
                  [
                    [82, 20],
                    [83, 20],
                  ],
                ],
                [
                  85,
                  16,
                  [
                    [
                      86,
                      20,
                      [
                        [87, 24, [[89, 28]]],
                        [91, 24, [[93, 28]]],
                        [95, 24, [[97, 28]]],
                        [99, 24, [[101, 28]]],
                      ],
                    ],
                  ],
                ],
                [
                  122,
                  16,
                  [
                    [123, 20],
                    [153, 20, [[154, 24, [[155, 28]]]]],
                  ],
                ],
              ],
            ],
            [197, 12],
            [200, 12],
          ],
        ],
      ]
    ),
    Tg = er(
      hr(
        '<div class="cl-max-w-sm cl-animate-pulse" role="status"><div class="cl-h-3 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-w-48 cl-mb-4"></div> <div class="cl-h-2.5 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[360px] cl-mb-2.5"></div> <div class="cl-h-2.5 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-mb-2.5"></div> <div class="cl-h-2.5 cl-bg-gray-200 cl-rounded-full cl-dark:bg-gray-500 cl-max-w-[330px] cl-mb-2.5"></div></div>'
      ),
      Ag[F],
      [
        [
          207,
          4,
          [
            [208, 8],
            [209, 8],
            [210, 8],
            [211, 8],
          ],
        ],
      ]
    );
  function Ag(e, t) {
    kr(new.target), ae(t, !0);
    const [r, n] = bn();
    let i = _e(() => (Mn(Sh), yn(Sh, "$appState", r)).isPremiumPopupOpened),
      o = me(!1),
      s = me(null),
      a = me(!1),
      l = me(!1),
      c = me(!1),
      u = _e(() => {
        return Ht(s)?.monthly?.currency
          ? ((e = Ht(s).monthly.currency), Fn[e] || e)
          : "$";
        var e;
      });
    async function d() {
      ye(i, !0);
      try {
        ye(o, !0), ye(s, await mg.getSubscriptionPrices(), !0);
      } catch (e) {
        console.error(...Nn(0, e));
      } finally {
        ye(o, !1),
          setTimeout(() => {
            ye(a, !0);
          }, 100);
      }
    }
    function p() {
      Th({ isPremiumPopupOpened: !1 }), ye(i, !1), ye(s, null), ye(a, !1);
    }
    function h(e) {
      return xe(e, void 0) ? "" : `${Ht(u)}${e}`;
    }
    async function f(e) {
      try {
        xe(e, Vn.Yearly) ? ye(l, !0) : ye(c, !0);
        const t = await mg.createCheckoutSession(e);
        window.open(t.url, "_blank");
      } catch (e) {
        console.error(...Nn(0, e));
      } finally {
        ye(l, !1), ye(c, !1);
      }
    }
    qe(() => {
      Ht(i) ? d() : p();
    });
    {
      const t = Dr(Ag, (e) => {
        var t = Eg(),
          r = Pe(t),
          n = Pe(r),
          i = Pe(n);
        (i.textContent = chrome.i18n.getMessage("premium_popup_title")),
          (Ne(i, 2).textContent = chrome.i18n.getMessage(
            "premium_popup_subtitle"
          ));
        var u = Ne(n, 2),
          d = Pe(u),
          p = Pe(d),
          g = Pe(p);
        yg(g, {}),
          (Ne(g, 2).textContent = chrome.i18n.getMessage(
            "premium_feature_no_limits"
          ));
        var m = Ne(p, 2),
          v = Pe(m);
        yg(v, {}),
          (Ne(v, 2).textContent = chrome.i18n.getMessage(
            "premium_feature_ask_about_video"
          ));
        var y = Ne(m, 2),
          b = Pe(y);
        yg(b, {}),
          (Ne(b, 2).textContent = chrome.i18n.getMessage(
            "premium_feature_download_summaries"
          ));
        var w = Ne(y, 2),
          x = Pe(w);
        yg(x, {}),
          (Ne(x, 2).textContent = chrome.i18n.getMessage(
            "premium_feature_longer_videos"
          ));
        var C = Ne(u, 2),
          S = (e) => {
            var t = wg();
            let r;
            var n = Pe(t),
              i = Pe(n);
            (i.textContent = chrome.i18n.getMessage("premium_free_tier_title")),
              (Ne(i, 2).textContent = chrome.i18n.getMessage(
                "premium_free_tier_description"
              ));
            var o = Ne(n, 2),
              s = Pe(o);
            Vp(s, {
              rootClass:
                "clarify-gradient-border cl-py-3 cl-px-3.5 cl-w-fit cl-rounded-full",
              children: Dr(Ag, (e, t) => {
                var r = bg();
                (r.textContent = chrome.i18n.getMessage(
                  "premium_free_tier_button"
                )),
                  vr(e, r);
              }),
              $$slots: { default: !0 },
            });
            var l = Ne(s, 2);
            (Pe(l).textContent = chrome.i18n.getMessage(
              "premium_free_tier_no_card"
            )),
              ze(
                (e) =>
                  (r = Hr(
                    t,
                    1,
                    "new-user-banner cl-gap-3 fade-in svelte-1n7yrnv",
                    null,
                    r,
                    e
                  )),
                [() => ({ visible: Ht(a) })]
              ),
              vr(e, t);
          };
        Tr(C, (e) => {
          Ht(s)?.isFreeTierEnabled && e(S);
        });
        var k = Ne(C, 2),
          E = Pe(k),
          T = Pe(E),
          A = (e) => {
            var t = xg(),
              r = Me(t);
            r.textContent = chrome.i18n.getMessage("premium_plan_monthly");
            var n = Ne(r, 2),
              i = Pe(n),
              o = Pe(i);
            (Ne(i, 2).textContent = `/${
              chrome.i18n.getMessage("premium_plan_period_month") ?? ""
            }`),
              Vp(Ne(n, 2), {
                clType: "linear-gradient",
                get isLoading() {
                  return Ht(c);
                },
                text: chrome.i18n.getMessage("premium_get_button"),
                rootClass: "cl-w-full",
                onclick: () => f(Vn.Monthly),
              }),
              ze((e) => wr(o, e), [() => h(Ht(s).monthly.price)]),
              vr(e, t);
          },
          O = (e, t) => {
            var r = (e) => {
              vr(e, Cg());
            };
            Tr(
              e,
              (e) => {
                Ht(o) && e(r);
              },
              t
            );
          };
        Tr(T, (e) => {
          Ht(s) && !Ht(o) ? e(A) : e(O, !1);
        });
        var P = Ne(E, 2),
          M = Pe(P);
        Pe(M).textContent = chrome.i18n.getMessage("premium_best_value");
        var N = Ne(M, 2),
          I = (e) => {
            var t = Sg(),
              r = Me(t);
            r.textContent = chrome.i18n.getMessage("premium_plan_annual");
            var n = Ne(r, 2),
              i = Pe(n),
              o = Pe(i),
              a = Ne(i, 2);
            a.textContent = `/${
              chrome.i18n.getMessage("premium_plan_period_month") ?? ""
            }`;
            var c = Ne(a, 2),
              u = Pe(c),
              d = Pe(u),
              p = Ne(n, 2),
              g = Pe(p),
              m = Ne(p, 2),
              v = Pe(m),
              y = Pe(v);
            Vp(Ne(m, 2), {
              text: chrome.i18n.getMessage("premium_get_button"),
              clType: "linear-gradient",
              get isLoading() {
                return Ht(l);
              },
              rootClass: "cl-w-full",
              onclick: () => f(Vn.Yearly),
            }),
              ze(
                (e, t, r) => {
                  wr(o, e),
                    wr(d, `-${Ht(s)?.yearly.savingsPercent ?? ""}%`),
                    wr(g, t),
                    wr(y, r);
                },
                [
                  () => h(Ht(s).yearly.price),
                  () =>
                    chrome.i18n.getMessage("premium_billed_yearly", [
                      h(Ht(s)?.yearly.fullPrice),
                    ]),
                  () =>
                    chrome.i18n.getMessage("premium_get_months_free", [
                      String(Ht(s)?.yearly.freeMonths),
                    ]),
                ]
              ),
              vr(e, t);
          },
          _ = (e, t) => {
            var r = (e) => {
              vr(e, kg());
            };
            Tr(
              e,
              (e) => {
                Ht(o) && e(r);
              },
              t
            );
          };
        Tr(N, (e) => {
          Ht(s) && !Ht(o) ? e(I) : e(_, !1);
        });
        var L = Ne(r, 2);
        L.textContent = chrome.i18n.getMessage("premium_footer_note");
        var D = Ne(L, 2);
        gg(Pe(D), {}), vr(e, t);
      });
      hg(e, {
        get isOpen() {
          return Ht(i);
        },
        onClose: p,
        body: t,
        children: Dr(Ag, (e, t) => {
          vr(e, Tg());
        }),
        $$slots: { body: !0, default: !0 },
      });
    }
    var g = le({
      get openModal() {
        return d;
      },
      get closeModal() {
        return p;
      },
      ...Er(),
    });
    return n(), g;
  }
  K(Ag), W(), (Pg[F] = "src/lib/App.svelte");
  var Og = er(hr("<!> <!>", 1), Pg[F], []);
  function Pg(e, t) {
    kr(new.target), ae(t, !1);
    var r = Og(),
      n = Me(r);
    return (
      $p(n, {
        children: Dr(Pg, (e, t) => {
          cg(e, {});
        }),
        $$slots: { default: !0 },
      }),
      Tr(Ne(n, 2), (e) => {}),
      vr(e, r),
      le({ ...Er() })
    );
  }
  K(Pg);
  var Mg = function (e, t, r, n) {
    return new (r || (r = Promise))(function (i, o) {
      function s(e) {
        try {
          l(n.next(e));
        } catch (e) {
          o(e);
        }
      }
      function a(e) {
        try {
          l(n.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function l(e) {
        var t;
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof r
              ? t
              : new r(function (e) {
                  e(t);
                })).then(s, a);
      }
      l((n = n.apply(e, t || [])).next());
    });
  };
  let Ng = null;
  class Ig {
    constructor(e) {
      if (Ig.instance) return this;
      const t =
        document.querySelector("#summaryApp") || document.createElement("div");
      return (
        (t.id = "summaryApp"),
        (Ig.instance = this),
        _g(t).then(() => {
          this.app = xr(Pg, { target: t });
        }),
        this
      );
    }
  }
  const _g = (e) =>
      Mg(void 0, void 0, void 0, function* () {
        var t, r;
        if (yield Rg()) {
          const r = yield Dg(
            "#secondary-inner > ytd-watch-metadata > #above-the-fold"
          );
          r || Lg(e),
            null === (t = null == r ? void 0 : r.parentNode) ||
              void 0 === t ||
              t.appendChild(e);
        } else {
          const t = yield Dg(
            ".style-scope ytd-watch-next-secondary-results-renderer"
          );
          t || Lg(e),
            null === (r = null == t ? void 0 : t.parentNode) ||
              void 0 === r ||
              r.insertBefore(e, t);
        }
      }),
    Lg = (e) => {
      const t = document.querySelector("#primary #primary-inner #player");
      (e.style.marginTop = "8px"), null == t || t.appendChild(e);
    },
    Dg = (e, ...t) =>
      Mg(void 0, [e, ...t], void 0, function* (e, t = 2) {
        let r = document.querySelector(e),
          n = 0;
        return new Promise((i) => {
          const o = setInterval(() => {
            r && (i(r), clearInterval(o)),
              n === t && (i(null), clearInterval(o)),
              n++,
              (r = document.querySelector(e));
          }, 10);
        });
      });
  chrome.runtime.onMessage.addListener((e, t, r) => {
    if (
      ("show-button" === e.event &&
        (Ng && (clearInterval(Ng), (Ng = null)),
        (Ng = setInterval(() => {
          document.querySelector("#watch-page-skeleton") ||
            (clearInterval(Ng), (Ng = null), new Ig());
        }, 50))),
      "check-browser" === e.event)
    ) {
      return (
        r({
          isChrome: (function () {
            try {
              const e = window.navigator?.userAgentData?.brands;
              return (
                !!Array.isArray(e) &&
                e.some(
                  (e) =>
                    "Google Chrome" === e.brand && "string" == typeof e.version
                )
              );
            } catch (e) {
              return !1;
            }
          })(),
        }),
        !0
      );
    }
  });
  const Rg = () =>
    Mg(void 0, void 0, void 0, function* () {
      try {
        const e = Dg("#related > ytd-watch-next-secondary-results-renderer"),
          t = Dg("yt-related-chip-cloud-renderer"),
          r = Dg("#title > #description"),
          [n, i, o] = yield Promise.all([t, r, e]);
        return (!n && !o) || !!i;
      } catch (e) {
        console.error(e);
      }
      return !0;
    });
})();
//# sourceMappingURL=content.js.map
