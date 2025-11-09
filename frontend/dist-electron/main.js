import Kt, { app as lt, BrowserWindow as Du, ipcMain as wt, dialog as $c, Menu as hg, nativeTheme as Un } from "electron";
import Ye from "node:process";
import Ie from "node:path";
import { promisify as nt, isDeepStrictEqual as pg } from "node:util";
import Oe from "node:fs";
import Jr from "node:crypto";
import mg from "node:assert";
import La from "node:os";
import ar from "fs";
import yg from "constants";
import Rn from "stream";
import ku from "util";
import $m from "assert";
import Ge from "path";
import Tn, { spawn as gg } from "child_process";
import wm from "events";
import On from "crypto";
import Em from "tty";
import Ma from "os";
import Br from "url";
import vg from "string_decoder";
import bm from "zlib";
import _g from "http";
import { fileURLToPath as $g } from "node:url";
const Sr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, so = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), wg = new Set("0123456789");
function xa(e) {
  const t = [];
  let u = "", a = "start", d = !1;
  for (const r of e)
    switch (r) {
      case "\\": {
        if (a === "index")
          throw new Error("Invalid character in an index");
        if (a === "indexEnd")
          throw new Error("Invalid character after an index");
        d && (u += r), a = "property", d = !d;
        break;
      }
      case ".": {
        if (a === "index")
          throw new Error("Invalid character in an index");
        if (a === "indexEnd") {
          a = "property";
          break;
        }
        if (d) {
          d = !1, u += r;
          break;
        }
        if (so.has(u))
          return [];
        t.push(u), u = "", a = "property";
        break;
      }
      case "[": {
        if (a === "index")
          throw new Error("Invalid character in an index");
        if (a === "indexEnd") {
          a = "index";
          break;
        }
        if (d) {
          d = !1, u += r;
          break;
        }
        if (a === "property") {
          if (so.has(u))
            return [];
          t.push(u), u = "";
        }
        a = "index";
        break;
      }
      case "]": {
        if (a === "index") {
          t.push(Number.parseInt(u, 10)), u = "", a = "indexEnd";
          break;
        }
        if (a === "indexEnd")
          throw new Error("Invalid character after an index");
      }
      default: {
        if (a === "index" && !wg.has(r))
          throw new Error("Invalid character in an index");
        if (a === "indexEnd")
          throw new Error("Invalid character after an index");
        a === "start" && (a = "property"), d && (d = !1, u += "\\"), u += r;
      }
    }
  switch (d && (u += "\\"), a) {
    case "property": {
      if (so.has(u))
        return [];
      t.push(u);
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function qu(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const u = Number.parseInt(t, 10);
    return Number.isInteger(u) && e[u] === e[t];
  }
  return !1;
}
function Sm(e, t) {
  if (qu(e, t))
    throw new Error("Cannot use string index");
}
function Eg(e, t, u) {
  if (!Sr(e) || typeof t != "string")
    return u === void 0 ? e : u;
  const a = xa(t);
  if (a.length === 0)
    return u;
  for (let d = 0; d < a.length; d++) {
    const r = a[d];
    if (qu(e, r) ? e = d === a.length - 1 ? void 0 : null : e = e[r], e == null) {
      if (d !== a.length - 1)
        return u;
      break;
    }
  }
  return e === void 0 ? u : e;
}
function wc(e, t, u) {
  if (!Sr(e) || typeof t != "string")
    return e;
  const a = e, d = xa(t);
  for (let r = 0; r < d.length; r++) {
    const n = d[r];
    Sm(e, n), r === d.length - 1 ? e[n] = u : Sr(e[n]) || (e[n] = typeof d[r + 1] == "number" ? [] : {}), e = e[n];
  }
  return a;
}
function bg(e, t) {
  if (!Sr(e) || typeof t != "string")
    return !1;
  const u = xa(t);
  for (let a = 0; a < u.length; a++) {
    const d = u[a];
    if (Sm(e, d), a === u.length - 1)
      return delete e[d], !0;
    if (e = e[d], !Sr(e))
      return !1;
  }
}
function Sg(e, t) {
  if (!Sr(e) || typeof t != "string")
    return !1;
  const u = xa(t);
  if (u.length === 0)
    return !1;
  for (const a of u) {
    if (!Sr(e) || !(a in e) || qu(e, a))
      return !1;
    e = e[a];
  }
  return !0;
}
const ir = La.homedir(), Fu = La.tmpdir(), { env: Vr } = Ye, Pg = (e) => {
  const t = Ie.join(ir, "Library");
  return {
    data: Ie.join(t, "Application Support", e),
    config: Ie.join(t, "Preferences", e),
    cache: Ie.join(t, "Caches", e),
    log: Ie.join(t, "Logs", e),
    temp: Ie.join(Fu, e)
  };
}, Rg = (e) => {
  const t = Vr.APPDATA || Ie.join(ir, "AppData", "Roaming"), u = Vr.LOCALAPPDATA || Ie.join(ir, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Ie.join(u, e, "Data"),
    config: Ie.join(t, e, "Config"),
    cache: Ie.join(u, e, "Cache"),
    log: Ie.join(u, e, "Log"),
    temp: Ie.join(Fu, e)
  };
}, Tg = (e) => {
  const t = Ie.basename(ir);
  return {
    data: Ie.join(Vr.XDG_DATA_HOME || Ie.join(ir, ".local", "share"), e),
    config: Ie.join(Vr.XDG_CONFIG_HOME || Ie.join(ir, ".config"), e),
    cache: Ie.join(Vr.XDG_CACHE_HOME || Ie.join(ir, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Ie.join(Vr.XDG_STATE_HOME || Ie.join(ir, ".local", "state"), e),
    temp: Ie.join(Fu, t, e)
  };
};
function Og(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), Ye.platform === "darwin" ? Pg(e) : Ye.platform === "win32" ? Rg(e) : Tg(e);
}
const Xt = (e, t) => function(...a) {
  return e.apply(void 0, a).catch(t);
}, Lt = (e, t) => function(...a) {
  try {
    return e.apply(void 0, a);
  } catch (d) {
    return t(d);
  }
}, Ag = Ye.getuid ? !Ye.getuid() : !1, Ng = 1e4, mt = () => {
}, Be = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Be.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Ag && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Be.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Be.isNodeError(e))
      throw e;
    if (!Be.isChangeErrorOk(e))
      throw e;
  }
};
class Cg {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = Ng, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
      this.intervalId || (this.intervalId = setInterval(this.tick, this.interval));
    }, this.reset = () => {
      this.intervalId && (clearInterval(this.intervalId), delete this.intervalId);
    }, this.add = (t) => {
      this.queueWaiting.add(t), this.queueActive.size < this.limit / 2 ? this.tick() : this.init();
    }, this.remove = (t) => {
      this.queueWaiting.delete(t), this.queueActive.delete(t);
    }, this.schedule = () => new Promise((t) => {
      const u = () => this.remove(a), a = () => t(u);
      this.add(a);
    }), this.tick = () => {
      if (!(this.queueActive.size >= this.limit)) {
        if (!this.queueWaiting.size)
          return this.reset();
        for (const t of this.queueWaiting) {
          if (this.queueActive.size >= this.limit)
            break;
          this.queueWaiting.delete(t), this.queueActive.add(t), t();
        }
      }
    };
  }
}
const Ig = new Cg(), Qt = (e, t) => function(a) {
  return function d(...r) {
    return Ig.schedule().then((n) => {
      const s = (c) => (n(), c), i = (c) => {
        if (n(), Date.now() >= a)
          throw c;
        if (t(c)) {
          const o = Math.round(100 * Math.random());
          return new Promise((h) => setTimeout(h, o)).then(() => d.apply(void 0, r));
        }
        throw c;
      };
      return e.apply(void 0, r).then(s, i);
    });
  };
}, Zt = (e, t) => function(a) {
  return function d(...r) {
    try {
      return e.apply(void 0, r);
    } catch (n) {
      if (Date.now() > a)
        throw n;
      if (t(n))
        return d.apply(void 0, r);
      throw n;
    }
  };
}, ot = {
  attempt: {
    /* ASYNC */
    chmod: Xt(nt(Oe.chmod), Be.onChangeError),
    chown: Xt(nt(Oe.chown), Be.onChangeError),
    close: Xt(nt(Oe.close), mt),
    fsync: Xt(nt(Oe.fsync), mt),
    mkdir: Xt(nt(Oe.mkdir), mt),
    realpath: Xt(nt(Oe.realpath), mt),
    stat: Xt(nt(Oe.stat), mt),
    unlink: Xt(nt(Oe.unlink), mt),
    /* SYNC */
    chmodSync: Lt(Oe.chmodSync, Be.onChangeError),
    chownSync: Lt(Oe.chownSync, Be.onChangeError),
    closeSync: Lt(Oe.closeSync, mt),
    existsSync: Lt(Oe.existsSync, mt),
    fsyncSync: Lt(Oe.fsync, mt),
    mkdirSync: Lt(Oe.mkdirSync, mt),
    realpathSync: Lt(Oe.realpathSync, mt),
    statSync: Lt(Oe.statSync, mt),
    unlinkSync: Lt(Oe.unlinkSync, mt)
  },
  retry: {
    /* ASYNC */
    close: Qt(nt(Oe.close), Be.isRetriableError),
    fsync: Qt(nt(Oe.fsync), Be.isRetriableError),
    open: Qt(nt(Oe.open), Be.isRetriableError),
    readFile: Qt(nt(Oe.readFile), Be.isRetriableError),
    rename: Qt(nt(Oe.rename), Be.isRetriableError),
    stat: Qt(nt(Oe.stat), Be.isRetriableError),
    write: Qt(nt(Oe.write), Be.isRetriableError),
    writeFile: Qt(nt(Oe.writeFile), Be.isRetriableError),
    /* SYNC */
    closeSync: Zt(Oe.closeSync, Be.isRetriableError),
    fsyncSync: Zt(Oe.fsyncSync, Be.isRetriableError),
    openSync: Zt(Oe.openSync, Be.isRetriableError),
    readFileSync: Zt(Oe.readFileSync, Be.isRetriableError),
    renameSync: Zt(Oe.renameSync, Be.isRetriableError),
    statSync: Zt(Oe.statSync, Be.isRetriableError),
    writeSync: Zt(Oe.writeSync, Be.isRetriableError),
    writeFileSync: Zt(Oe.writeFileSync, Be.isRetriableError)
  }
}, Dg = "utf8", Ec = 438, kg = 511, qg = {}, Fg = La.userInfo().uid, jg = La.userInfo().gid, Ug = 1e3, Lg = !!Ye.getuid;
Ye.getuid && Ye.getuid();
const bc = 128, Mg = (e) => e instanceof Error && "code" in e, Sc = (e) => typeof e == "string", uo = (e) => e === void 0, xg = Ye.platform === "linux", Pm = Ye.platform === "win32", ju = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
Pm || ju.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
xg && ju.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class Vg {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const u of this.callbacks)
          u();
        t && (Pm && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? Ye.kill(Ye.pid, "SIGTERM") : Ye.kill(Ye.pid, t));
      }
    }, this.hook = () => {
      Ye.once("exit", () => this.exit());
      for (const t of ju)
        try {
          Ye.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Bg = new Vg(), Hg = Bg.register, st = {
  /* VARIABLES */
  store: {},
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), d = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${d}`;
  },
  get: (e, t, u = !0) => {
    const a = st.truncate(t(e));
    return a in st.store ? st.get(e, t, u) : (st.store[a] = u, [a, () => delete st.store[a]]);
  },
  purge: (e) => {
    st.store[e] && (delete st.store[e], ot.attempt.unlink(e));
  },
  purgeSync: (e) => {
    st.store[e] && (delete st.store[e], ot.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in st.store)
      st.purgeSync(e);
  },
  truncate: (e) => {
    const t = Ie.basename(e);
    if (t.length <= bc)
      return e;
    const u = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!u)
      return e;
    const a = t.length - bc;
    return `${e.slice(0, -t.length)}${u[1]}${u[2].slice(0, -a)}${u[3]}`;
  }
};
Hg(st.purgeSyncAll);
function Rm(e, t, u = qg) {
  if (Sc(u))
    return Rm(e, t, { encoding: u });
  const a = Date.now() + ((u.timeout ?? Ug) || -1);
  let d = null, r = null, n = null;
  try {
    const s = ot.attempt.realpathSync(e), i = !!s;
    e = s || e, [r, d] = st.get(e, u.tmpCreate || st.create, u.tmpPurge !== !1);
    const c = Lg && uo(u.chown), o = uo(u.mode);
    if (i && (c || o)) {
      const p = ot.attempt.statSync(e);
      p && (u = { ...u }, c && (u.chown = { uid: p.uid, gid: p.gid }), o && (u.mode = p.mode));
    }
    if (!i) {
      const p = Ie.dirname(e);
      ot.attempt.mkdirSync(p, {
        mode: kg,
        recursive: !0
      });
    }
    n = ot.retry.openSync(a)(r, "w", u.mode || Ec), u.tmpCreated && u.tmpCreated(r), Sc(t) ? ot.retry.writeSync(a)(n, t, 0, u.encoding || Dg) : uo(t) || ot.retry.writeSync(a)(n, t, 0, t.length, 0), u.fsync !== !1 && (u.fsyncWait !== !1 ? ot.retry.fsyncSync(a)(n) : ot.attempt.fsync(n)), ot.retry.closeSync(a)(n), n = null, u.chown && (u.chown.uid !== Fg || u.chown.gid !== jg) && ot.attempt.chownSync(r, u.chown.uid, u.chown.gid), u.mode && u.mode !== Ec && ot.attempt.chmodSync(r, u.mode);
    try {
      ot.retry.renameSync(a)(r, e);
    } catch (p) {
      if (!Mg(p) || p.code !== "ENAMETOOLONG")
        throw p;
      ot.retry.renameSync(a)(r, st.truncate(e));
    }
    d(), r = null;
  } finally {
    n && ot.attempt.closeSync(n), r && st.purge(r);
  }
}
var Nt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Uu(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ln = { exports: {} }, co = {}, Mt = {}, hr = {}, lo = {}, fo = {}, ho = {}, Pc;
function ka() {
  return Pc || (Pc = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class u extends t {
      constructor(l) {
        if (super(), !e.IDENTIFIER.test(l))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = l;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = u;
    class a extends t {
      constructor(l) {
        super(), this._items = typeof l == "string" ? [l] : l;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const l = this._items[0];
        return l === "" || l === '""';
      }
      get str() {
        var l;
        return (l = this._str) !== null && l !== void 0 ? l : this._str = this._items.reduce((g, b) => `${g}${b}`, "");
      }
      get names() {
        var l;
        return (l = this._names) !== null && l !== void 0 ? l : this._names = this._items.reduce((g, b) => (b instanceof u && (g[b.str] = (g[b.str] || 0) + 1), g), {});
      }
    }
    e._Code = a, e.nil = new a("");
    function d(m, ...l) {
      const g = [m[0]];
      let b = 0;
      for (; b < l.length; )
        s(g, l[b]), g.push(m[++b]);
      return new a(g);
    }
    e._ = d;
    const r = new a("+");
    function n(m, ...l) {
      const g = [y(m[0])];
      let b = 0;
      for (; b < l.length; )
        g.push(r), s(g, l[b]), g.push(r, y(m[++b]));
      return i(g), new a(g);
    }
    e.str = n;
    function s(m, l) {
      l instanceof a ? m.push(...l._items) : l instanceof u ? m.push(l) : m.push(p(l));
    }
    e.addCodeArg = s;
    function i(m) {
      let l = 1;
      for (; l < m.length - 1; ) {
        if (m[l] === r) {
          const g = c(m[l - 1], m[l + 1]);
          if (g !== void 0) {
            m.splice(l - 1, 3, g);
            continue;
          }
          m[l++] = "+";
        }
        l++;
      }
    }
    function c(m, l) {
      if (l === '""')
        return m;
      if (m === '""')
        return l;
      if (typeof m == "string")
        return l instanceof u || m[m.length - 1] !== '"' ? void 0 : typeof l != "string" ? `${m.slice(0, -1)}${l}"` : l[0] === '"' ? m.slice(0, -1) + l.slice(1) : void 0;
      if (typeof l == "string" && l[0] === '"' && !(m instanceof u))
        return `"${m}${l.slice(1)}`;
    }
    function o(m, l) {
      return l.emptyStr() ? m : m.emptyStr() ? l : n`${m}${l}`;
    }
    e.strConcat = o;
    function p(m) {
      return typeof m == "number" || typeof m == "boolean" || m === null ? m : y(Array.isArray(m) ? m.join(",") : m);
    }
    function h(m) {
      return new a(y(m));
    }
    e.stringify = h;
    function y(m) {
      return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = y;
    function $(m) {
      return typeof m == "string" && e.IDENTIFIER.test(m) ? new a(`.${m}`) : d`[${m}]`;
    }
    e.getProperty = $;
    function v(m) {
      if (typeof m == "string" && e.IDENTIFIER.test(m))
        return new a(`${m}`);
      throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
    }
    e.getEsmExportName = v;
    function f(m) {
      return new a(m.toString());
    }
    e.regexpCode = f;
  }(ho)), ho;
}
var po = {}, Rc;
function Tc() {
  return Rc || (Rc = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = ka();
    class u extends Error {
      constructor(c) {
        super(`CodeGen: "code" for ${c} not defined`), this.value = c.value;
      }
    }
    var a;
    (function(i) {
      i[i.Started = 0] = "Started", i[i.Completed = 1] = "Completed";
    })(a || (e.UsedValueState = a = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class d {
      constructor({ prefixes: c, parent: o } = {}) {
        this._names = {}, this._prefixes = c, this._parent = o;
      }
      toName(c) {
        return c instanceof t.Name ? c : this.name(c);
      }
      name(c) {
        return new t.Name(this._newName(c));
      }
      _newName(c) {
        const o = this._names[c] || this._nameGroup(c);
        return `${c}${o.index++}`;
      }
      _nameGroup(c) {
        var o, p;
        if (!((p = (o = this._parent) === null || o === void 0 ? void 0 : o._prefixes) === null || p === void 0) && p.has(c) || this._prefixes && !this._prefixes.has(c))
          throw new Error(`CodeGen: prefix "${c}" is not allowed in this scope`);
        return this._names[c] = { prefix: c, index: 0 };
      }
    }
    e.Scope = d;
    class r extends t.Name {
      constructor(c, o) {
        super(o), this.prefix = c;
      }
      setValue(c, { property: o, itemIndex: p }) {
        this.value = c, this.scopePath = (0, t._)`.${new t.Name(o)}[${p}]`;
      }
    }
    e.ValueScopeName = r;
    const n = (0, t._)`\n`;
    class s extends d {
      constructor(c) {
        super(c), this._values = {}, this._scope = c.scope, this.opts = { ...c, _n: c.lines ? n : t.nil };
      }
      get() {
        return this._scope;
      }
      name(c) {
        return new r(c, this._newName(c));
      }
      value(c, o) {
        var p;
        if (o.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const h = this.toName(c), { prefix: y } = h, $ = (p = o.key) !== null && p !== void 0 ? p : o.ref;
        let v = this._values[y];
        if (v) {
          const l = v.get($);
          if (l)
            return l;
        } else
          v = this._values[y] = /* @__PURE__ */ new Map();
        v.set($, h);
        const f = this._scope[y] || (this._scope[y] = []), m = f.length;
        return f[m] = o.ref, h.setValue(o, { property: y, itemIndex: m }), h;
      }
      getValue(c, o) {
        const p = this._values[c];
        if (p)
          return p.get(o);
      }
      scopeRefs(c, o = this._values) {
        return this._reduceValues(o, (p) => {
          if (p.scopePath === void 0)
            throw new Error(`CodeGen: name "${p}" has no value`);
          return (0, t._)`${c}${p.scopePath}`;
        });
      }
      scopeCode(c = this._values, o, p) {
        return this._reduceValues(c, (h) => {
          if (h.value === void 0)
            throw new Error(`CodeGen: name "${h}" has no value`);
          return h.value.code;
        }, o, p);
      }
      _reduceValues(c, o, p = {}, h) {
        let y = t.nil;
        for (const $ in c) {
          const v = c[$];
          if (!v)
            continue;
          const f = p[$] = p[$] || /* @__PURE__ */ new Map();
          v.forEach((m) => {
            if (f.has(m))
              return;
            f.set(m, a.Started);
            let l = o(m);
            if (l) {
              const g = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              y = (0, t._)`${y}${g} ${m} = ${l};${this.opts._n}`;
            } else if (l = h?.(m))
              y = (0, t._)`${y}${l}${this.opts._n}`;
            else
              throw new u(m);
            f.set(m, a.Completed);
          });
        }
        return y;
      }
    }
    e.ValueScope = s;
  }(po)), po;
}
var Oc;
function Re() {
  return Oc || (Oc = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = ka(), u = Tc();
    var a = ka();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return a._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return a.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return a.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return a.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return a.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return a.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return a.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return a.Name;
    } });
    var d = Tc();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return d.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return d.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return d.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return d.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class r {
      optimizeNodes() {
        return this;
      }
      optimizeNames(P, O) {
        return this;
      }
    }
    class n extends r {
      constructor(P, O, L) {
        super(), this.varKind = P, this.name = O, this.rhs = L;
      }
      render({ es5: P, _n: O }) {
        const L = P ? u.varKinds.var : this.varKind, N = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${L} ${this.name}${N};` + O;
      }
      optimizeNames(P, O) {
        if (P[this.name.str])
          return this.rhs && (this.rhs = U(this.rhs, P, O)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class s extends r {
      constructor(P, O, L) {
        super(), this.lhs = P, this.rhs = O, this.sideEffects = L;
      }
      render({ _n: P }) {
        return `${this.lhs} = ${this.rhs};` + P;
      }
      optimizeNames(P, O) {
        if (!(this.lhs instanceof t.Name && !P[this.lhs.str] && !this.sideEffects))
          return this.rhs = U(this.rhs, P, O), this;
      }
      get names() {
        const P = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return V(P, this.rhs);
      }
    }
    class i extends s {
      constructor(P, O, L, N) {
        super(P, L, N), this.op = O;
      }
      render({ _n: P }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + P;
      }
    }
    class c extends r {
      constructor(P) {
        super(), this.label = P, this.names = {};
      }
      render({ _n: P }) {
        return `${this.label}:` + P;
      }
    }
    class o extends r {
      constructor(P) {
        super(), this.label = P, this.names = {};
      }
      render({ _n: P }) {
        return `break${this.label ? ` ${this.label}` : ""};` + P;
      }
    }
    class p extends r {
      constructor(P) {
        super(), this.error = P;
      }
      render({ _n: P }) {
        return `throw ${this.error};` + P;
      }
      get names() {
        return this.error.names;
      }
    }
    class h extends r {
      constructor(P) {
        super(), this.code = P;
      }
      render({ _n: P }) {
        return `${this.code};` + P;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(P, O) {
        return this.code = U(this.code, P, O), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class y extends r {
      constructor(P = []) {
        super(), this.nodes = P;
      }
      render(P) {
        return this.nodes.reduce((O, L) => O + L.render(P), "");
      }
      optimizeNodes() {
        const { nodes: P } = this;
        let O = P.length;
        for (; O--; ) {
          const L = P[O].optimizeNodes();
          Array.isArray(L) ? P.splice(O, 1, ...L) : L ? P[O] = L : P.splice(O, 1);
        }
        return P.length > 0 ? this : void 0;
      }
      optimizeNames(P, O) {
        const { nodes: L } = this;
        let N = L.length;
        for (; N--; ) {
          const A = L[N];
          A.optimizeNames(P, O) || (z(P, A.names), L.splice(N, 1));
        }
        return L.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((P, O) => j(P, O.names), {});
      }
    }
    class $ extends y {
      render(P) {
        return "{" + P._n + super.render(P) + "}" + P._n;
      }
    }
    class v extends y {
    }
    class f extends $ {
    }
    f.kind = "else";
    class m extends $ {
      constructor(P, O) {
        super(O), this.condition = P;
      }
      render(P) {
        let O = `if(${this.condition})` + super.render(P);
        return this.else && (O += "else " + this.else.render(P)), O;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const P = this.condition;
        if (P === !0)
          return this.nodes;
        let O = this.else;
        if (O) {
          const L = O.optimizeNodes();
          O = this.else = Array.isArray(L) ? new f(L) : L;
        }
        if (O)
          return P === !1 ? O instanceof m ? O : O.nodes : this.nodes.length ? this : new m(W(P), O instanceof m ? [O] : O.nodes);
        if (!(P === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(P, O) {
        var L;
        if (this.else = (L = this.else) === null || L === void 0 ? void 0 : L.optimizeNames(P, O), !!(super.optimizeNames(P, O) || this.else))
          return this.condition = U(this.condition, P, O), this;
      }
      get names() {
        const P = super.names;
        return V(P, this.condition), this.else && j(P, this.else.names), P;
      }
    }
    m.kind = "if";
    class l extends $ {
    }
    l.kind = "for";
    class g extends l {
      constructor(P) {
        super(), this.iteration = P;
      }
      render(P) {
        return `for(${this.iteration})` + super.render(P);
      }
      optimizeNames(P, O) {
        if (super.optimizeNames(P, O))
          return this.iteration = U(this.iteration, P, O), this;
      }
      get names() {
        return j(super.names, this.iteration.names);
      }
    }
    class b extends l {
      constructor(P, O, L, N) {
        super(), this.varKind = P, this.name = O, this.from = L, this.to = N;
      }
      render(P) {
        const O = P.es5 ? u.varKinds.var : this.varKind, { name: L, from: N, to: A } = this;
        return `for(${O} ${L}=${N}; ${L}<${A}; ${L}++)` + super.render(P);
      }
      get names() {
        const P = V(super.names, this.from);
        return V(P, this.to);
      }
    }
    class S extends l {
      constructor(P, O, L, N) {
        super(), this.loop = P, this.varKind = O, this.name = L, this.iterable = N;
      }
      render(P) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(P);
      }
      optimizeNames(P, O) {
        if (super.optimizeNames(P, O))
          return this.iterable = U(this.iterable, P, O), this;
      }
      get names() {
        return j(super.names, this.iterable.names);
      }
    }
    class _ extends $ {
      constructor(P, O, L) {
        super(), this.name = P, this.args = O, this.async = L;
      }
      render(P) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(P);
      }
    }
    _.kind = "func";
    class w extends y {
      render(P) {
        return "return " + super.render(P);
      }
    }
    w.kind = "return";
    class R extends $ {
      render(P) {
        let O = "try" + super.render(P);
        return this.catch && (O += this.catch.render(P)), this.finally && (O += this.finally.render(P)), O;
      }
      optimizeNodes() {
        var P, O;
        return super.optimizeNodes(), (P = this.catch) === null || P === void 0 || P.optimizeNodes(), (O = this.finally) === null || O === void 0 || O.optimizeNodes(), this;
      }
      optimizeNames(P, O) {
        var L, N;
        return super.optimizeNames(P, O), (L = this.catch) === null || L === void 0 || L.optimizeNames(P, O), (N = this.finally) === null || N === void 0 || N.optimizeNames(P, O), this;
      }
      get names() {
        const P = super.names;
        return this.catch && j(P, this.catch.names), this.finally && j(P, this.finally.names), P;
      }
    }
    class T extends $ {
      constructor(P) {
        super(), this.error = P;
      }
      render(P) {
        return `catch(${this.error})` + super.render(P);
      }
    }
    T.kind = "catch";
    class M extends $ {
      render(P) {
        return "finally" + super.render(P);
      }
    }
    M.kind = "finally";
    class F {
      constructor(P, O = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...O, _n: O.lines ? `
` : "" }, this._extScope = P, this._scope = new u.Scope({ parent: P }), this._nodes = [new v()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(P) {
        return this._scope.name(P);
      }
      // reserves unique name in the external scope
      scopeName(P) {
        return this._extScope.name(P);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(P, O) {
        const L = this._extScope.value(P, O);
        return (this._values[L.prefix] || (this._values[L.prefix] = /* @__PURE__ */ new Set())).add(L), L;
      }
      getScopeValue(P, O) {
        return this._extScope.getValue(P, O);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(P) {
        return this._extScope.scopeRefs(P, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(P, O, L, N) {
        const A = this._scope.toName(O);
        return L !== void 0 && N && (this._constants[A.str] = L), this._leafNode(new n(P, A, L)), A;
      }
      // `const` declaration (`var` in es5 mode)
      const(P, O, L) {
        return this._def(u.varKinds.const, P, O, L);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(P, O, L) {
        return this._def(u.varKinds.let, P, O, L);
      }
      // `var` declaration with optional assignment
      var(P, O, L) {
        return this._def(u.varKinds.var, P, O, L);
      }
      // assignment code
      assign(P, O, L) {
        return this._leafNode(new s(P, O, L));
      }
      // `+=` code
      add(P, O) {
        return this._leafNode(new i(P, e.operators.ADD, O));
      }
      // appends passed SafeExpr to code or executes Block
      code(P) {
        return typeof P == "function" ? P() : P !== t.nil && this._leafNode(new h(P)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...P) {
        const O = ["{"];
        for (const [L, N] of P)
          O.length > 1 && O.push(","), O.push(L), (L !== N || this.opts.es5) && (O.push(":"), (0, t.addCodeArg)(O, N));
        return O.push("}"), new t._Code(O);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(P, O, L) {
        if (this._blockNode(new m(P)), O && L)
          this.code(O).else().code(L).endIf();
        else if (O)
          this.code(O).endIf();
        else if (L)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(P) {
        return this._elseNode(new m(P));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new f());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(m, f);
      }
      _for(P, O) {
        return this._blockNode(P), O && this.code(O).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(P, O) {
        return this._for(new g(P), O);
      }
      // `for` statement for a range of values
      forRange(P, O, L, N, A = this.opts.es5 ? u.varKinds.var : u.varKinds.let) {
        const J = this._scope.toName(P);
        return this._for(new b(A, J, O, L), () => N(J));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(P, O, L, N = u.varKinds.const) {
        const A = this._scope.toName(P);
        if (this.opts.es5) {
          const J = O instanceof t.Name ? O : this.var("_arr", O);
          return this.forRange("_i", 0, (0, t._)`${J}.length`, (B) => {
            this.var(A, (0, t._)`${J}[${B}]`), L(A);
          });
        }
        return this._for(new S("of", N, A, O), () => L(A));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(P, O, L, N = this.opts.es5 ? u.varKinds.var : u.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(P, (0, t._)`Object.keys(${O})`, L);
        const A = this._scope.toName(P);
        return this._for(new S("in", N, A, O), () => L(A));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(l);
      }
      // `label` statement
      label(P) {
        return this._leafNode(new c(P));
      }
      // `break` statement
      break(P) {
        return this._leafNode(new o(P));
      }
      // `return` statement
      return(P) {
        const O = new w();
        if (this._blockNode(O), this.code(P), O.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(w);
      }
      // `try` statement
      try(P, O, L) {
        if (!O && !L)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const N = new R();
        if (this._blockNode(N), this.code(P), O) {
          const A = this.name("e");
          this._currNode = N.catch = new T(A), O(A);
        }
        return L && (this._currNode = N.finally = new M(), this.code(L)), this._endBlockNode(T, M);
      }
      // `throw` statement
      throw(P) {
        return this._leafNode(new p(P));
      }
      // start self-balancing block
      block(P, O) {
        return this._blockStarts.push(this._nodes.length), P && this.code(P).endBlock(O), this;
      }
      // end the current self-balancing block
      endBlock(P) {
        const O = this._blockStarts.pop();
        if (O === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const L = this._nodes.length - O;
        if (L < 0 || P !== void 0 && L !== P)
          throw new Error(`CodeGen: wrong number of nodes: ${L} vs ${P} expected`);
        return this._nodes.length = O, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(P, O = t.nil, L, N) {
        return this._blockNode(new _(P, O, L)), N && this.code(N).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(_);
      }
      optimize(P = 1) {
        for (; P-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(P) {
        return this._currNode.nodes.push(P), this;
      }
      _blockNode(P) {
        this._currNode.nodes.push(P), this._nodes.push(P);
      }
      _endBlockNode(P, O) {
        const L = this._currNode;
        if (L instanceof P || O && L instanceof O)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${O ? `${P.kind}/${O.kind}` : P.kind}"`);
      }
      _elseNode(P) {
        const O = this._currNode;
        if (!(O instanceof m))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = O.else = P, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const P = this._nodes;
        return P[P.length - 1];
      }
      set _currNode(P) {
        const O = this._nodes;
        O[O.length - 1] = P;
      }
    }
    e.CodeGen = F;
    function j(D, P) {
      for (const O in P)
        D[O] = (D[O] || 0) + (P[O] || 0);
      return D;
    }
    function V(D, P) {
      return P instanceof t._CodeOrName ? j(D, P.names) : D;
    }
    function U(D, P, O) {
      if (D instanceof t.Name)
        return L(D);
      if (!N(D))
        return D;
      return new t._Code(D._items.reduce((A, J) => (J instanceof t.Name && (J = L(J)), J instanceof t._Code ? A.push(...J._items) : A.push(J), A), []));
      function L(A) {
        const J = O[A.str];
        return J === void 0 || P[A.str] !== 1 ? A : (delete P[A.str], J);
      }
      function N(A) {
        return A instanceof t._Code && A._items.some((J) => J instanceof t.Name && P[J.str] === 1 && O[J.str] !== void 0);
      }
    }
    function z(D, P) {
      for (const O in P)
        D[O] = (D[O] || 0) - (P[O] || 0);
    }
    function W(D) {
      return typeof D == "boolean" || typeof D == "number" || D === null ? !D : (0, t._)`!${G(D)}`;
    }
    e.not = W;
    const Q = I(e.operators.AND);
    function ee(...D) {
      return D.reduce(Q);
    }
    e.and = ee;
    const ne = I(e.operators.OR);
    function K(...D) {
      return D.reduce(ne);
    }
    e.or = K;
    function I(D) {
      return (P, O) => P === t.nil ? O : O === t.nil ? P : (0, t._)`${G(P)} ${D} ${G(O)}`;
    }
    function G(D) {
      return D instanceof t.Name ? D : (0, t._)`(${D})`;
    }
  }(fo)), fo;
}
var Ne = {}, Ac;
function qe() {
  if (Ac) return Ne;
  Ac = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.checkStrictMode = Ne.getErrorPath = Ne.Type = Ne.useFunc = Ne.setEvaluated = Ne.evaluatedPropsToName = Ne.mergeEvaluated = Ne.eachItem = Ne.unescapeJsonPointer = Ne.escapeJsonPointer = Ne.escapeFragment = Ne.unescapeFragment = Ne.schemaRefOrVal = Ne.schemaHasRulesButRef = Ne.schemaHasRules = Ne.checkUnknownRules = Ne.alwaysValidSchema = Ne.toHash = void 0;
  const e = Re(), t = ka();
  function u(S) {
    const _ = {};
    for (const w of S)
      _[w] = !0;
    return _;
  }
  Ne.toHash = u;
  function a(S, _) {
    return typeof _ == "boolean" ? _ : Object.keys(_).length === 0 ? !0 : (d(S, _), !r(_, S.self.RULES.all));
  }
  Ne.alwaysValidSchema = a;
  function d(S, _ = S.schema) {
    const { opts: w, self: R } = S;
    if (!w.strictSchema || typeof _ == "boolean")
      return;
    const T = R.RULES.keywords;
    for (const M in _)
      T[M] || b(S, `unknown keyword: "${M}"`);
  }
  Ne.checkUnknownRules = d;
  function r(S, _) {
    if (typeof S == "boolean")
      return !S;
    for (const w in S)
      if (_[w])
        return !0;
    return !1;
  }
  Ne.schemaHasRules = r;
  function n(S, _) {
    if (typeof S == "boolean")
      return !S;
    for (const w in S)
      if (w !== "$ref" && _.all[w])
        return !0;
    return !1;
  }
  Ne.schemaHasRulesButRef = n;
  function s({ topSchemaRef: S, schemaPath: _ }, w, R, T) {
    if (!T) {
      if (typeof w == "number" || typeof w == "boolean")
        return w;
      if (typeof w == "string")
        return (0, e._)`${w}`;
    }
    return (0, e._)`${S}${_}${(0, e.getProperty)(R)}`;
  }
  Ne.schemaRefOrVal = s;
  function i(S) {
    return p(decodeURIComponent(S));
  }
  Ne.unescapeFragment = i;
  function c(S) {
    return encodeURIComponent(o(S));
  }
  Ne.escapeFragment = c;
  function o(S) {
    return typeof S == "number" ? `${S}` : S.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  Ne.escapeJsonPointer = o;
  function p(S) {
    return S.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  Ne.unescapeJsonPointer = p;
  function h(S, _) {
    if (Array.isArray(S))
      for (const w of S)
        _(w);
    else
      _(S);
  }
  Ne.eachItem = h;
  function y({ mergeNames: S, mergeToName: _, mergeValues: w, resultToName: R }) {
    return (T, M, F, j) => {
      const V = F === void 0 ? M : F instanceof e.Name ? (M instanceof e.Name ? S(T, M, F) : _(T, M, F), F) : M instanceof e.Name ? (_(T, F, M), M) : w(M, F);
      return j === e.Name && !(V instanceof e.Name) ? R(T, V) : V;
    };
  }
  Ne.mergeEvaluated = {
    props: y({
      mergeNames: (S, _, w) => S.if((0, e._)`${w} !== true && ${_} !== undefined`, () => {
        S.if((0, e._)`${_} === true`, () => S.assign(w, !0), () => S.assign(w, (0, e._)`${w} || {}`).code((0, e._)`Object.assign(${w}, ${_})`));
      }),
      mergeToName: (S, _, w) => S.if((0, e._)`${w} !== true`, () => {
        _ === !0 ? S.assign(w, !0) : (S.assign(w, (0, e._)`${w} || {}`), v(S, w, _));
      }),
      mergeValues: (S, _) => S === !0 ? !0 : { ...S, ..._ },
      resultToName: $
    }),
    items: y({
      mergeNames: (S, _, w) => S.if((0, e._)`${w} !== true && ${_} !== undefined`, () => S.assign(w, (0, e._)`${_} === true ? true : ${w} > ${_} ? ${w} : ${_}`)),
      mergeToName: (S, _, w) => S.if((0, e._)`${w} !== true`, () => S.assign(w, _ === !0 ? !0 : (0, e._)`${w} > ${_} ? ${w} : ${_}`)),
      mergeValues: (S, _) => S === !0 ? !0 : Math.max(S, _),
      resultToName: (S, _) => S.var("items", _)
    })
  };
  function $(S, _) {
    if (_ === !0)
      return S.var("props", !0);
    const w = S.var("props", (0, e._)`{}`);
    return _ !== void 0 && v(S, w, _), w;
  }
  Ne.evaluatedPropsToName = $;
  function v(S, _, w) {
    Object.keys(w).forEach((R) => S.assign((0, e._)`${_}${(0, e.getProperty)(R)}`, !0));
  }
  Ne.setEvaluated = v;
  const f = {};
  function m(S, _) {
    return S.scopeValue("func", {
      ref: _,
      code: f[_.code] || (f[_.code] = new t._Code(_.code))
    });
  }
  Ne.useFunc = m;
  var l;
  (function(S) {
    S[S.Num = 0] = "Num", S[S.Str = 1] = "Str";
  })(l || (Ne.Type = l = {}));
  function g(S, _, w) {
    if (S instanceof e.Name) {
      const R = _ === l.Num;
      return w ? R ? (0, e._)`"[" + ${S} + "]"` : (0, e._)`"['" + ${S} + "']"` : R ? (0, e._)`"/" + ${S}` : (0, e._)`"/" + ${S}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return w ? (0, e.getProperty)(S).toString() : "/" + o(S);
  }
  Ne.getErrorPath = g;
  function b(S, _, w = S.opts.strictSchema) {
    if (w) {
      if (_ = `strict mode: ${_}`, w === !0)
        throw new Error(_);
      S.self.logger.warn(_);
    }
  }
  return Ne.checkStrictMode = b, Ne;
}
var Mn = {}, Nc;
function Ct() {
  if (Nc) return Mn;
  Nc = 1, Object.defineProperty(Mn, "__esModule", { value: !0 });
  const e = Re(), t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return Mn.default = t, Mn;
}
var Cc;
function Va() {
  return Cc || (Cc = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = Re(), u = qe(), a = Ct();
    e.keywordError = {
      message: ({ keyword: f }) => (0, t.str)`must pass "${f}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: f, schemaType: m }) => m ? (0, t.str)`"${f}" keyword must be ${m} ($data)` : (0, t.str)`"${f}" keyword is invalid ($data)`
    };
    function d(f, m = e.keywordError, l, g) {
      const { it: b } = f, { gen: S, compositeRule: _, allErrors: w } = b, R = p(f, m, l);
      g ?? (_ || w) ? i(S, R) : c(b, (0, t._)`[${R}]`);
    }
    e.reportError = d;
    function r(f, m = e.keywordError, l) {
      const { it: g } = f, { gen: b, compositeRule: S, allErrors: _ } = g, w = p(f, m, l);
      i(b, w), S || _ || c(g, a.default.vErrors);
    }
    e.reportExtraError = r;
    function n(f, m) {
      f.assign(a.default.errors, m), f.if((0, t._)`${a.default.vErrors} !== null`, () => f.if(m, () => f.assign((0, t._)`${a.default.vErrors}.length`, m), () => f.assign(a.default.vErrors, null)));
    }
    e.resetErrorsCount = n;
    function s({ gen: f, keyword: m, schemaValue: l, data: g, errsCount: b, it: S }) {
      if (b === void 0)
        throw new Error("ajv implementation error");
      const _ = f.name("err");
      f.forRange("i", b, a.default.errors, (w) => {
        f.const(_, (0, t._)`${a.default.vErrors}[${w}]`), f.if((0, t._)`${_}.instancePath === undefined`, () => f.assign((0, t._)`${_}.instancePath`, (0, t.strConcat)(a.default.instancePath, S.errorPath))), f.assign((0, t._)`${_}.schemaPath`, (0, t.str)`${S.errSchemaPath}/${m}`), S.opts.verbose && (f.assign((0, t._)`${_}.schema`, l), f.assign((0, t._)`${_}.data`, g));
      });
    }
    e.extendErrors = s;
    function i(f, m) {
      const l = f.const("err", m);
      f.if((0, t._)`${a.default.vErrors} === null`, () => f.assign(a.default.vErrors, (0, t._)`[${l}]`), (0, t._)`${a.default.vErrors}.push(${l})`), f.code((0, t._)`${a.default.errors}++`);
    }
    function c(f, m) {
      const { gen: l, validateName: g, schemaEnv: b } = f;
      b.$async ? l.throw((0, t._)`new ${f.ValidationError}(${m})`) : (l.assign((0, t._)`${g}.errors`, m), l.return(!1));
    }
    const o = {
      keyword: new t.Name("keyword"),
      schemaPath: new t.Name("schemaPath"),
      // also used in JTD errors
      params: new t.Name("params"),
      propertyName: new t.Name("propertyName"),
      message: new t.Name("message"),
      schema: new t.Name("schema"),
      parentSchema: new t.Name("parentSchema")
    };
    function p(f, m, l) {
      const { createErrors: g } = f.it;
      return g === !1 ? (0, t._)`{}` : h(f, m, l);
    }
    function h(f, m, l = {}) {
      const { gen: g, it: b } = f, S = [
        y(b, l),
        $(f, l)
      ];
      return v(f, m, S), g.object(...S);
    }
    function y({ errorPath: f }, { instancePath: m }) {
      const l = m ? (0, t.str)`${f}${(0, u.getErrorPath)(m, u.Type.Str)}` : f;
      return [a.default.instancePath, (0, t.strConcat)(a.default.instancePath, l)];
    }
    function $({ keyword: f, it: { errSchemaPath: m } }, { schemaPath: l, parentSchema: g }) {
      let b = g ? m : (0, t.str)`${m}/${f}`;
      return l && (b = (0, t.str)`${b}${(0, u.getErrorPath)(l, u.Type.Str)}`), [o.schemaPath, b];
    }
    function v(f, { params: m, message: l }, g) {
      const { keyword: b, data: S, schemaValue: _, it: w } = f, { opts: R, propertyName: T, topSchemaRef: M, schemaPath: F } = w;
      g.push([o.keyword, b], [o.params, typeof m == "function" ? m(f) : m || (0, t._)`{}`]), R.messages && g.push([o.message, typeof l == "function" ? l(f) : l]), R.verbose && g.push([o.schema, _], [o.parentSchema, (0, t._)`${M}${F}`], [a.default.data, S]), T && g.push([o.propertyName, T]);
    }
  }(lo)), lo;
}
var Ic;
function Gg() {
  if (Ic) return hr;
  Ic = 1, Object.defineProperty(hr, "__esModule", { value: !0 }), hr.boolOrEmptySchema = hr.topBoolOrEmptySchema = void 0;
  const e = Va(), t = Re(), u = Ct(), a = {
    message: "boolean schema is false"
  };
  function d(s) {
    const { gen: i, schema: c, validateName: o } = s;
    c === !1 ? n(s, !1) : typeof c == "object" && c.$async === !0 ? i.return(u.default.data) : (i.assign((0, t._)`${o}.errors`, null), i.return(!0));
  }
  hr.topBoolOrEmptySchema = d;
  function r(s, i) {
    const { gen: c, schema: o } = s;
    o === !1 ? (c.var(i, !1), n(s)) : c.var(i, !0);
  }
  hr.boolOrEmptySchema = r;
  function n(s, i) {
    const { gen: c, data: o } = s, p = {
      gen: c,
      keyword: "false schema",
      data: o,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: s
    };
    (0, e.reportError)(p, a, void 0, i);
  }
  return hr;
}
var Ze = {}, pr = {}, Dc;
function Tm() {
  if (Dc) return pr;
  Dc = 1, Object.defineProperty(pr, "__esModule", { value: !0 }), pr.getRules = pr.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], t = new Set(e);
  function u(d) {
    return typeof d == "string" && t.has(d);
  }
  pr.isJSONType = u;
  function a() {
    const d = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...d, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, d.number, d.string, d.array, d.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return pr.getRules = a, pr;
}
var xt = {}, kc;
function Om() {
  if (kc) return xt;
  kc = 1, Object.defineProperty(xt, "__esModule", { value: !0 }), xt.shouldUseRule = xt.shouldUseGroup = xt.schemaHasRulesForType = void 0;
  function e({ schema: a, self: d }, r) {
    const n = d.RULES.types[r];
    return n && n !== !0 && t(a, n);
  }
  xt.schemaHasRulesForType = e;
  function t(a, d) {
    return d.rules.some((r) => u(a, r));
  }
  xt.shouldUseGroup = t;
  function u(a, d) {
    var r;
    return a[d.keyword] !== void 0 || ((r = d.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => a[n] !== void 0));
  }
  return xt.shouldUseRule = u, xt;
}
var qc;
function qa() {
  if (qc) return Ze;
  qc = 1, Object.defineProperty(Ze, "__esModule", { value: !0 }), Ze.reportTypeError = Ze.checkDataTypes = Ze.checkDataType = Ze.coerceAndCheckDataType = Ze.getJSONTypes = Ze.getSchemaTypes = Ze.DataType = void 0;
  const e = Tm(), t = Om(), u = Va(), a = Re(), d = qe();
  var r;
  (function(l) {
    l[l.Correct = 0] = "Correct", l[l.Wrong = 1] = "Wrong";
  })(r || (Ze.DataType = r = {}));
  function n(l) {
    const g = s(l.type);
    if (g.includes("null")) {
      if (l.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!g.length && l.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      l.nullable === !0 && g.push("null");
    }
    return g;
  }
  Ze.getSchemaTypes = n;
  function s(l) {
    const g = Array.isArray(l) ? l : l ? [l] : [];
    if (g.every(e.isJSONType))
      return g;
    throw new Error("type must be JSONType or JSONType[]: " + g.join(","));
  }
  Ze.getJSONTypes = s;
  function i(l, g) {
    const { gen: b, data: S, opts: _ } = l, w = o(g, _.coerceTypes), R = g.length > 0 && !(w.length === 0 && g.length === 1 && (0, t.schemaHasRulesForType)(l, g[0]));
    if (R) {
      const T = $(g, S, _.strictNumbers, r.Wrong);
      b.if(T, () => {
        w.length ? p(l, g, w) : f(l);
      });
    }
    return R;
  }
  Ze.coerceAndCheckDataType = i;
  const c = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function o(l, g) {
    return g ? l.filter((b) => c.has(b) || g === "array" && b === "array") : [];
  }
  function p(l, g, b) {
    const { gen: S, data: _, opts: w } = l, R = S.let("dataType", (0, a._)`typeof ${_}`), T = S.let("coerced", (0, a._)`undefined`);
    w.coerceTypes === "array" && S.if((0, a._)`${R} == 'object' && Array.isArray(${_}) && ${_}.length == 1`, () => S.assign(_, (0, a._)`${_}[0]`).assign(R, (0, a._)`typeof ${_}`).if($(g, _, w.strictNumbers), () => S.assign(T, _))), S.if((0, a._)`${T} !== undefined`);
    for (const F of b)
      (c.has(F) || F === "array" && w.coerceTypes === "array") && M(F);
    S.else(), f(l), S.endIf(), S.if((0, a._)`${T} !== undefined`, () => {
      S.assign(_, T), h(l, T);
    });
    function M(F) {
      switch (F) {
        case "string":
          S.elseIf((0, a._)`${R} == "number" || ${R} == "boolean"`).assign(T, (0, a._)`"" + ${_}`).elseIf((0, a._)`${_} === null`).assign(T, (0, a._)`""`);
          return;
        case "number":
          S.elseIf((0, a._)`${R} == "boolean" || ${_} === null
              || (${R} == "string" && ${_} && ${_} == +${_})`).assign(T, (0, a._)`+${_}`);
          return;
        case "integer":
          S.elseIf((0, a._)`${R} === "boolean" || ${_} === null
              || (${R} === "string" && ${_} && ${_} == +${_} && !(${_} % 1))`).assign(T, (0, a._)`+${_}`);
          return;
        case "boolean":
          S.elseIf((0, a._)`${_} === "false" || ${_} === 0 || ${_} === null`).assign(T, !1).elseIf((0, a._)`${_} === "true" || ${_} === 1`).assign(T, !0);
          return;
        case "null":
          S.elseIf((0, a._)`${_} === "" || ${_} === 0 || ${_} === false`), S.assign(T, null);
          return;
        case "array":
          S.elseIf((0, a._)`${R} === "string" || ${R} === "number"
              || ${R} === "boolean" || ${_} === null`).assign(T, (0, a._)`[${_}]`);
      }
    }
  }
  function h({ gen: l, parentData: g, parentDataProperty: b }, S) {
    l.if((0, a._)`${g} !== undefined`, () => l.assign((0, a._)`${g}[${b}]`, S));
  }
  function y(l, g, b, S = r.Correct) {
    const _ = S === r.Correct ? a.operators.EQ : a.operators.NEQ;
    let w;
    switch (l) {
      case "null":
        return (0, a._)`${g} ${_} null`;
      case "array":
        w = (0, a._)`Array.isArray(${g})`;
        break;
      case "object":
        w = (0, a._)`${g} && typeof ${g} == "object" && !Array.isArray(${g})`;
        break;
      case "integer":
        w = R((0, a._)`!(${g} % 1) && !isNaN(${g})`);
        break;
      case "number":
        w = R();
        break;
      default:
        return (0, a._)`typeof ${g} ${_} ${l}`;
    }
    return S === r.Correct ? w : (0, a.not)(w);
    function R(T = a.nil) {
      return (0, a.and)((0, a._)`typeof ${g} == "number"`, T, b ? (0, a._)`isFinite(${g})` : a.nil);
    }
  }
  Ze.checkDataType = y;
  function $(l, g, b, S) {
    if (l.length === 1)
      return y(l[0], g, b, S);
    let _;
    const w = (0, d.toHash)(l);
    if (w.array && w.object) {
      const R = (0, a._)`typeof ${g} != "object"`;
      _ = w.null ? R : (0, a._)`!${g} || ${R}`, delete w.null, delete w.array, delete w.object;
    } else
      _ = a.nil;
    w.number && delete w.integer;
    for (const R in w)
      _ = (0, a.and)(_, y(R, g, b, S));
    return _;
  }
  Ze.checkDataTypes = $;
  const v = {
    message: ({ schema: l }) => `must be ${l}`,
    params: ({ schema: l, schemaValue: g }) => typeof l == "string" ? (0, a._)`{type: ${l}}` : (0, a._)`{type: ${g}}`
  };
  function f(l) {
    const g = m(l);
    (0, u.reportError)(g, v);
  }
  Ze.reportTypeError = f;
  function m(l) {
    const { gen: g, data: b, schema: S } = l, _ = (0, d.schemaRefOrVal)(l, S, "type");
    return {
      gen: g,
      keyword: "type",
      data: b,
      schema: S.type,
      schemaCode: _,
      schemaValue: _,
      parentSchema: S,
      params: {},
      it: l
    };
  }
  return Ze;
}
var Xr = {}, Fc;
function zg() {
  if (Fc) return Xr;
  Fc = 1, Object.defineProperty(Xr, "__esModule", { value: !0 }), Xr.assignDefaults = void 0;
  const e = Re(), t = qe();
  function u(d, r) {
    const { properties: n, items: s } = d.schema;
    if (r === "object" && n)
      for (const i in n)
        a(d, i, n[i].default);
    else r === "array" && Array.isArray(s) && s.forEach((i, c) => a(d, c, i.default));
  }
  Xr.assignDefaults = u;
  function a(d, r, n) {
    const { gen: s, compositeRule: i, data: c, opts: o } = d;
    if (n === void 0)
      return;
    const p = (0, e._)`${c}${(0, e.getProperty)(r)}`;
    if (i) {
      (0, t.checkStrictMode)(d, `default is ignored for: ${p}`);
      return;
    }
    let h = (0, e._)`${p} === undefined`;
    o.useDefaults === "empty" && (h = (0, e._)`${h} || ${p} === null || ${p} === ""`), s.if(h, (0, e._)`${p} = ${(0, e.stringify)(n)}`);
  }
  return Xr;
}
var Tt = {}, Le = {}, jc;
function It() {
  if (jc) return Le;
  jc = 1, Object.defineProperty(Le, "__esModule", { value: !0 }), Le.validateUnion = Le.validateArray = Le.usePattern = Le.callValidateCode = Le.schemaProperties = Le.allSchemaProperties = Le.noPropertyInData = Le.propertyInData = Le.isOwnProperty = Le.hasPropFunc = Le.reportMissingProp = Le.checkMissingProp = Le.checkReportMissingProp = void 0;
  const e = Re(), t = qe(), u = Ct(), a = qe();
  function d(l, g) {
    const { gen: b, data: S, it: _ } = l;
    b.if(o(b, S, g, _.opts.ownProperties), () => {
      l.setParams({ missingProperty: (0, e._)`${g}` }, !0), l.error();
    });
  }
  Le.checkReportMissingProp = d;
  function r({ gen: l, data: g, it: { opts: b } }, S, _) {
    return (0, e.or)(...S.map((w) => (0, e.and)(o(l, g, w, b.ownProperties), (0, e._)`${_} = ${w}`)));
  }
  Le.checkMissingProp = r;
  function n(l, g) {
    l.setParams({ missingProperty: g }, !0), l.error();
  }
  Le.reportMissingProp = n;
  function s(l) {
    return l.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  Le.hasPropFunc = s;
  function i(l, g, b) {
    return (0, e._)`${s(l)}.call(${g}, ${b})`;
  }
  Le.isOwnProperty = i;
  function c(l, g, b, S) {
    const _ = (0, e._)`${g}${(0, e.getProperty)(b)} !== undefined`;
    return S ? (0, e._)`${_} && ${i(l, g, b)}` : _;
  }
  Le.propertyInData = c;
  function o(l, g, b, S) {
    const _ = (0, e._)`${g}${(0, e.getProperty)(b)} === undefined`;
    return S ? (0, e.or)(_, (0, e.not)(i(l, g, b))) : _;
  }
  Le.noPropertyInData = o;
  function p(l) {
    return l ? Object.keys(l).filter((g) => g !== "__proto__") : [];
  }
  Le.allSchemaProperties = p;
  function h(l, g) {
    return p(g).filter((b) => !(0, t.alwaysValidSchema)(l, g[b]));
  }
  Le.schemaProperties = h;
  function y({ schemaCode: l, data: g, it: { gen: b, topSchemaRef: S, schemaPath: _, errorPath: w }, it: R }, T, M, F) {
    const j = F ? (0, e._)`${l}, ${g}, ${S}${_}` : g, V = [
      [u.default.instancePath, (0, e.strConcat)(u.default.instancePath, w)],
      [u.default.parentData, R.parentData],
      [u.default.parentDataProperty, R.parentDataProperty],
      [u.default.rootData, u.default.rootData]
    ];
    R.opts.dynamicRef && V.push([u.default.dynamicAnchors, u.default.dynamicAnchors]);
    const U = (0, e._)`${j}, ${b.object(...V)}`;
    return M !== e.nil ? (0, e._)`${T}.call(${M}, ${U})` : (0, e._)`${T}(${U})`;
  }
  Le.callValidateCode = y;
  const $ = (0, e._)`new RegExp`;
  function v({ gen: l, it: { opts: g } }, b) {
    const S = g.unicodeRegExp ? "u" : "", { regExp: _ } = g.code, w = _(b, S);
    return l.scopeValue("pattern", {
      key: w.toString(),
      ref: w,
      code: (0, e._)`${_.code === "new RegExp" ? $ : (0, a.useFunc)(l, _)}(${b}, ${S})`
    });
  }
  Le.usePattern = v;
  function f(l) {
    const { gen: g, data: b, keyword: S, it: _ } = l, w = g.name("valid");
    if (_.allErrors) {
      const T = g.let("valid", !0);
      return R(() => g.assign(T, !1)), T;
    }
    return g.var(w, !0), R(() => g.break()), w;
    function R(T) {
      const M = g.const("len", (0, e._)`${b}.length`);
      g.forRange("i", 0, M, (F) => {
        l.subschema({
          keyword: S,
          dataProp: F,
          dataPropType: t.Type.Num
        }, w), g.if((0, e.not)(w), T);
      });
    }
  }
  Le.validateArray = f;
  function m(l) {
    const { gen: g, schema: b, keyword: S, it: _ } = l;
    if (!Array.isArray(b))
      throw new Error("ajv implementation error");
    if (b.some((M) => (0, t.alwaysValidSchema)(_, M)) && !_.opts.unevaluated)
      return;
    const R = g.let("valid", !1), T = g.name("_valid");
    g.block(() => b.forEach((M, F) => {
      const j = l.subschema({
        keyword: S,
        schemaProp: F,
        compositeRule: !0
      }, T);
      g.assign(R, (0, e._)`${R} || ${T}`), l.mergeValidEvaluated(j, T) || g.if((0, e.not)(R));
    })), l.result(R, () => l.reset(), () => l.error(!0));
  }
  return Le.validateUnion = m, Le;
}
var Uc;
function Kg() {
  if (Uc) return Tt;
  Uc = 1, Object.defineProperty(Tt, "__esModule", { value: !0 }), Tt.validateKeywordUsage = Tt.validSchemaType = Tt.funcKeywordCode = Tt.macroKeywordCode = void 0;
  const e = Re(), t = Ct(), u = It(), a = Va();
  function d(h, y) {
    const { gen: $, keyword: v, schema: f, parentSchema: m, it: l } = h, g = y.macro.call(l.self, f, m, l), b = c($, v, g);
    l.opts.validateSchema !== !1 && l.self.validateSchema(g, !0);
    const S = $.name("valid");
    h.subschema({
      schema: g,
      schemaPath: e.nil,
      errSchemaPath: `${l.errSchemaPath}/${v}`,
      topSchemaRef: b,
      compositeRule: !0
    }, S), h.pass(S, () => h.error(!0));
  }
  Tt.macroKeywordCode = d;
  function r(h, y) {
    var $;
    const { gen: v, keyword: f, schema: m, parentSchema: l, $data: g, it: b } = h;
    i(b, y);
    const S = !g && y.compile ? y.compile.call(b.self, m, l, b) : y.validate, _ = c(v, f, S), w = v.let("valid");
    h.block$data(w, R), h.ok(($ = y.valid) !== null && $ !== void 0 ? $ : w);
    function R() {
      if (y.errors === !1)
        F(), y.modifying && n(h), j(() => h.error());
      else {
        const V = y.async ? T() : M();
        y.modifying && n(h), j(() => s(h, V));
      }
    }
    function T() {
      const V = v.let("ruleErrs", null);
      return v.try(() => F((0, e._)`await `), (U) => v.assign(w, !1).if((0, e._)`${U} instanceof ${b.ValidationError}`, () => v.assign(V, (0, e._)`${U}.errors`), () => v.throw(U))), V;
    }
    function M() {
      const V = (0, e._)`${_}.errors`;
      return v.assign(V, null), F(e.nil), V;
    }
    function F(V = y.async ? (0, e._)`await ` : e.nil) {
      const U = b.opts.passContext ? t.default.this : t.default.self, z = !("compile" in y && !g || y.schema === !1);
      v.assign(w, (0, e._)`${V}${(0, u.callValidateCode)(h, _, U, z)}`, y.modifying);
    }
    function j(V) {
      var U;
      v.if((0, e.not)((U = y.valid) !== null && U !== void 0 ? U : w), V);
    }
  }
  Tt.funcKeywordCode = r;
  function n(h) {
    const { gen: y, data: $, it: v } = h;
    y.if(v.parentData, () => y.assign($, (0, e._)`${v.parentData}[${v.parentDataProperty}]`));
  }
  function s(h, y) {
    const { gen: $ } = h;
    $.if((0, e._)`Array.isArray(${y})`, () => {
      $.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${y} : ${t.default.vErrors}.concat(${y})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, a.extendErrors)(h);
    }, () => h.error());
  }
  function i({ schemaEnv: h }, y) {
    if (y.async && !h.$async)
      throw new Error("async keyword in sync schema");
  }
  function c(h, y, $) {
    if ($ === void 0)
      throw new Error(`keyword "${y}" failed to compile`);
    return h.scopeValue("keyword", typeof $ == "function" ? { ref: $ } : { ref: $, code: (0, e.stringify)($) });
  }
  function o(h, y, $ = !1) {
    return !y.length || y.some((v) => v === "array" ? Array.isArray(h) : v === "object" ? h && typeof h == "object" && !Array.isArray(h) : typeof h == v || $ && typeof h > "u");
  }
  Tt.validSchemaType = o;
  function p({ schema: h, opts: y, self: $, errSchemaPath: v }, f, m) {
    if (Array.isArray(f.keyword) ? !f.keyword.includes(m) : f.keyword !== m)
      throw new Error("ajv implementation error");
    const l = f.dependencies;
    if (l?.some((g) => !Object.prototype.hasOwnProperty.call(h, g)))
      throw new Error(`parent schema must have dependencies of ${m}: ${l.join(",")}`);
    if (f.validateSchema && !f.validateSchema(h[m])) {
      const b = `keyword "${m}" value is invalid at path "${v}": ` + $.errorsText(f.validateSchema.errors);
      if (y.validateSchema === "log")
        $.logger.error(b);
      else
        throw new Error(b);
    }
  }
  return Tt.validateKeywordUsage = p, Tt;
}
var Vt = {}, Lc;
function Wg() {
  if (Lc) return Vt;
  Lc = 1, Object.defineProperty(Vt, "__esModule", { value: !0 }), Vt.extendSubschemaMode = Vt.extendSubschemaData = Vt.getSubschema = void 0;
  const e = Re(), t = qe();
  function u(r, { keyword: n, schemaProp: s, schema: i, schemaPath: c, errSchemaPath: o, topSchemaRef: p }) {
    if (n !== void 0 && i !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (n !== void 0) {
      const h = r.schema[n];
      return s === void 0 ? {
        schema: h,
        schemaPath: (0, e._)`${r.schemaPath}${(0, e.getProperty)(n)}`,
        errSchemaPath: `${r.errSchemaPath}/${n}`
      } : {
        schema: h[s],
        schemaPath: (0, e._)`${r.schemaPath}${(0, e.getProperty)(n)}${(0, e.getProperty)(s)}`,
        errSchemaPath: `${r.errSchemaPath}/${n}/${(0, t.escapeFragment)(s)}`
      };
    }
    if (i !== void 0) {
      if (c === void 0 || o === void 0 || p === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: i,
        schemaPath: c,
        topSchemaRef: p,
        errSchemaPath: o
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Vt.getSubschema = u;
  function a(r, n, { dataProp: s, dataPropType: i, data: c, dataTypes: o, propertyName: p }) {
    if (c !== void 0 && s !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: h } = n;
    if (s !== void 0) {
      const { errorPath: $, dataPathArr: v, opts: f } = n, m = h.let("data", (0, e._)`${n.data}${(0, e.getProperty)(s)}`, !0);
      y(m), r.errorPath = (0, e.str)`${$}${(0, t.getErrorPath)(s, i, f.jsPropertySyntax)}`, r.parentDataProperty = (0, e._)`${s}`, r.dataPathArr = [...v, r.parentDataProperty];
    }
    if (c !== void 0) {
      const $ = c instanceof e.Name ? c : h.let("data", c, !0);
      y($), p !== void 0 && (r.propertyName = p);
    }
    o && (r.dataTypes = o);
    function y($) {
      r.data = $, r.dataLevel = n.dataLevel + 1, r.dataTypes = [], n.definedProperties = /* @__PURE__ */ new Set(), r.parentData = n.data, r.dataNames = [...n.dataNames, $];
    }
  }
  Vt.extendSubschemaData = a;
  function d(r, { jtdDiscriminator: n, jtdMetadata: s, compositeRule: i, createErrors: c, allErrors: o }) {
    i !== void 0 && (r.compositeRule = i), c !== void 0 && (r.createErrors = c), o !== void 0 && (r.allErrors = o), r.jtdDiscriminator = n, r.jtdMetadata = s;
  }
  return Vt.extendSubschemaMode = d, Vt;
}
var ut = {}, mo, Mc;
function Ba() {
  return Mc || (Mc = 1, mo = function e(t, u) {
    if (t === u) return !0;
    if (t && u && typeof t == "object" && typeof u == "object") {
      if (t.constructor !== u.constructor) return !1;
      var a, d, r;
      if (Array.isArray(t)) {
        if (a = t.length, a != u.length) return !1;
        for (d = a; d-- !== 0; )
          if (!e(t[d], u[d])) return !1;
        return !0;
      }
      if (t.constructor === RegExp) return t.source === u.source && t.flags === u.flags;
      if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === u.valueOf();
      if (t.toString !== Object.prototype.toString) return t.toString() === u.toString();
      if (r = Object.keys(t), a = r.length, a !== Object.keys(u).length) return !1;
      for (d = a; d-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(u, r[d])) return !1;
      for (d = a; d-- !== 0; ) {
        var n = r[d];
        if (!e(t[n], u[n])) return !1;
      }
      return !0;
    }
    return t !== t && u !== u;
  }), mo;
}
var yo = { exports: {} }, xc;
function Yg() {
  if (xc) return yo.exports;
  xc = 1;
  var e = yo.exports = function(a, d, r) {
    typeof d == "function" && (r = d, d = {}), r = d.cb || r;
    var n = typeof r == "function" ? r : r.pre || function() {
    }, s = r.post || function() {
    };
    t(d, n, s, a, "", a);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function t(a, d, r, n, s, i, c, o, p, h) {
    if (n && typeof n == "object" && !Array.isArray(n)) {
      d(n, s, i, c, o, p, h);
      for (var y in n) {
        var $ = n[y];
        if (Array.isArray($)) {
          if (y in e.arrayKeywords)
            for (var v = 0; v < $.length; v++)
              t(a, d, r, $[v], s + "/" + y + "/" + v, i, s, y, n, v);
        } else if (y in e.propsKeywords) {
          if ($ && typeof $ == "object")
            for (var f in $)
              t(a, d, r, $[f], s + "/" + y + "/" + u(f), i, s, y, n, f);
        } else (y in e.keywords || a.allKeys && !(y in e.skipKeywords)) && t(a, d, r, $, s + "/" + y, i, s, y, n);
      }
      r(n, s, i, c, o, p, h);
    }
  }
  function u(a) {
    return a.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return yo.exports;
}
var Vc;
function Ha() {
  if (Vc) return ut;
  Vc = 1, Object.defineProperty(ut, "__esModule", { value: !0 }), ut.getSchemaRefs = ut.resolveUrl = ut.normalizeId = ut._getFullPath = ut.getFullPath = ut.inlineRef = void 0;
  const e = qe(), t = Ba(), u = Yg(), a = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function d(v, f = !0) {
    return typeof v == "boolean" ? !0 : f === !0 ? !n(v) : f ? s(v) <= f : !1;
  }
  ut.inlineRef = d;
  const r = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function n(v) {
    for (const f in v) {
      if (r.has(f))
        return !0;
      const m = v[f];
      if (Array.isArray(m) && m.some(n) || typeof m == "object" && n(m))
        return !0;
    }
    return !1;
  }
  function s(v) {
    let f = 0;
    for (const m in v) {
      if (m === "$ref")
        return 1 / 0;
      if (f++, !a.has(m) && (typeof v[m] == "object" && (0, e.eachItem)(v[m], (l) => f += s(l)), f === 1 / 0))
        return 1 / 0;
    }
    return f;
  }
  function i(v, f = "", m) {
    m !== !1 && (f = p(f));
    const l = v.parse(f);
    return c(v, l);
  }
  ut.getFullPath = i;
  function c(v, f) {
    return v.serialize(f).split("#")[0] + "#";
  }
  ut._getFullPath = c;
  const o = /#\/?$/;
  function p(v) {
    return v ? v.replace(o, "") : "";
  }
  ut.normalizeId = p;
  function h(v, f, m) {
    return m = p(m), v.resolve(f, m);
  }
  ut.resolveUrl = h;
  const y = /^[a-z_][-a-z0-9._]*$/i;
  function $(v, f) {
    if (typeof v == "boolean")
      return {};
    const { schemaId: m, uriResolver: l } = this.opts, g = p(v[m] || f), b = { "": g }, S = i(l, g, !1), _ = {}, w = /* @__PURE__ */ new Set();
    return u(v, { allKeys: !0 }, (M, F, j, V) => {
      if (V === void 0)
        return;
      const U = S + F;
      let z = b[V];
      typeof M[m] == "string" && (z = W.call(this, M[m])), Q.call(this, M.$anchor), Q.call(this, M.$dynamicAnchor), b[F] = z;
      function W(ee) {
        const ne = this.opts.uriResolver.resolve;
        if (ee = p(z ? ne(z, ee) : ee), w.has(ee))
          throw T(ee);
        w.add(ee);
        let K = this.refs[ee];
        return typeof K == "string" && (K = this.refs[K]), typeof K == "object" ? R(M, K.schema, ee) : ee !== p(U) && (ee[0] === "#" ? (R(M, _[ee], ee), _[ee] = M) : this.refs[ee] = U), ee;
      }
      function Q(ee) {
        if (typeof ee == "string") {
          if (!y.test(ee))
            throw new Error(`invalid anchor "${ee}"`);
          W.call(this, `#${ee}`);
        }
      }
    }), _;
    function R(M, F, j) {
      if (F !== void 0 && !t(M, F))
        throw T(j);
    }
    function T(M) {
      return new Error(`reference "${M}" resolves to more than one schema`);
    }
  }
  return ut.getSchemaRefs = $, ut;
}
var Bc;
function Ga() {
  if (Bc) return Mt;
  Bc = 1, Object.defineProperty(Mt, "__esModule", { value: !0 }), Mt.getData = Mt.KeywordCxt = Mt.validateFunctionCode = void 0;
  const e = Gg(), t = qa(), u = Om(), a = qa(), d = zg(), r = Kg(), n = Wg(), s = Re(), i = Ct(), c = Ha(), o = qe(), p = Va();
  function h(C) {
    if (S(C) && (w(C), b(C))) {
      f(C);
      return;
    }
    y(C, () => (0, e.topBoolOrEmptySchema)(C));
  }
  Mt.validateFunctionCode = h;
  function y({ gen: C, validateName: k, schema: H, schemaEnv: Y, opts: Z }, le) {
    Z.code.es5 ? C.func(k, (0, s._)`${i.default.data}, ${i.default.valCxt}`, Y.$async, () => {
      C.code((0, s._)`"use strict"; ${l(H, Z)}`), v(C, Z), C.code(le);
    }) : C.func(k, (0, s._)`${i.default.data}, ${$(Z)}`, Y.$async, () => C.code(l(H, Z)).code(le));
  }
  function $(C) {
    return (0, s._)`{${i.default.instancePath}="", ${i.default.parentData}, ${i.default.parentDataProperty}, ${i.default.rootData}=${i.default.data}${C.dynamicRef ? (0, s._)`, ${i.default.dynamicAnchors}={}` : s.nil}}={}`;
  }
  function v(C, k) {
    C.if(i.default.valCxt, () => {
      C.var(i.default.instancePath, (0, s._)`${i.default.valCxt}.${i.default.instancePath}`), C.var(i.default.parentData, (0, s._)`${i.default.valCxt}.${i.default.parentData}`), C.var(i.default.parentDataProperty, (0, s._)`${i.default.valCxt}.${i.default.parentDataProperty}`), C.var(i.default.rootData, (0, s._)`${i.default.valCxt}.${i.default.rootData}`), k.dynamicRef && C.var(i.default.dynamicAnchors, (0, s._)`${i.default.valCxt}.${i.default.dynamicAnchors}`);
    }, () => {
      C.var(i.default.instancePath, (0, s._)`""`), C.var(i.default.parentData, (0, s._)`undefined`), C.var(i.default.parentDataProperty, (0, s._)`undefined`), C.var(i.default.rootData, i.default.data), k.dynamicRef && C.var(i.default.dynamicAnchors, (0, s._)`{}`);
    });
  }
  function f(C) {
    const { schema: k, opts: H, gen: Y } = C;
    y(C, () => {
      H.$comment && k.$comment && V(C), M(C), Y.let(i.default.vErrors, null), Y.let(i.default.errors, 0), H.unevaluated && m(C), R(C), U(C);
    });
  }
  function m(C) {
    const { gen: k, validateName: H } = C;
    C.evaluated = k.const("evaluated", (0, s._)`${H}.evaluated`), k.if((0, s._)`${C.evaluated}.dynamicProps`, () => k.assign((0, s._)`${C.evaluated}.props`, (0, s._)`undefined`)), k.if((0, s._)`${C.evaluated}.dynamicItems`, () => k.assign((0, s._)`${C.evaluated}.items`, (0, s._)`undefined`));
  }
  function l(C, k) {
    const H = typeof C == "object" && C[k.schemaId];
    return H && (k.code.source || k.code.process) ? (0, s._)`/*# sourceURL=${H} */` : s.nil;
  }
  function g(C, k) {
    if (S(C) && (w(C), b(C))) {
      _(C, k);
      return;
    }
    (0, e.boolOrEmptySchema)(C, k);
  }
  function b({ schema: C, self: k }) {
    if (typeof C == "boolean")
      return !C;
    for (const H in C)
      if (k.RULES.all[H])
        return !0;
    return !1;
  }
  function S(C) {
    return typeof C.schema != "boolean";
  }
  function _(C, k) {
    const { schema: H, gen: Y, opts: Z } = C;
    Z.$comment && H.$comment && V(C), F(C), j(C);
    const le = Y.const("_errs", i.default.errors);
    R(C, le), Y.var(k, (0, s._)`${le} === ${i.default.errors}`);
  }
  function w(C) {
    (0, o.checkUnknownRules)(C), T(C);
  }
  function R(C, k) {
    if (C.opts.jtd)
      return W(C, [], !1, k);
    const H = (0, t.getSchemaTypes)(C.schema), Y = (0, t.coerceAndCheckDataType)(C, H);
    W(C, H, !Y, k);
  }
  function T(C) {
    const { schema: k, errSchemaPath: H, opts: Y, self: Z } = C;
    k.$ref && Y.ignoreKeywordsWithRef && (0, o.schemaHasRulesButRef)(k, Z.RULES) && Z.logger.warn(`$ref: keywords ignored in schema at path "${H}"`);
  }
  function M(C) {
    const { schema: k, opts: H } = C;
    k.default !== void 0 && H.useDefaults && H.strictSchema && (0, o.checkStrictMode)(C, "default is ignored in the schema root");
  }
  function F(C) {
    const k = C.schema[C.opts.schemaId];
    k && (C.baseId = (0, c.resolveUrl)(C.opts.uriResolver, C.baseId, k));
  }
  function j(C) {
    if (C.schema.$async && !C.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function V({ gen: C, schemaEnv: k, schema: H, errSchemaPath: Y, opts: Z }) {
    const le = H.$comment;
    if (Z.$comment === !0)
      C.code((0, s._)`${i.default.self}.logger.log(${le})`);
    else if (typeof Z.$comment == "function") {
      const ve = (0, s.str)`${Y}/$comment`, Te = C.scopeValue("root", { ref: k.root });
      C.code((0, s._)`${i.default.self}.opts.$comment(${le}, ${ve}, ${Te}.schema)`);
    }
  }
  function U(C) {
    const { gen: k, schemaEnv: H, validateName: Y, ValidationError: Z, opts: le } = C;
    H.$async ? k.if((0, s._)`${i.default.errors} === 0`, () => k.return(i.default.data), () => k.throw((0, s._)`new ${Z}(${i.default.vErrors})`)) : (k.assign((0, s._)`${Y}.errors`, i.default.vErrors), le.unevaluated && z(C), k.return((0, s._)`${i.default.errors} === 0`));
  }
  function z({ gen: C, evaluated: k, props: H, items: Y }) {
    H instanceof s.Name && C.assign((0, s._)`${k}.props`, H), Y instanceof s.Name && C.assign((0, s._)`${k}.items`, Y);
  }
  function W(C, k, H, Y) {
    const { gen: Z, schema: le, data: ve, allErrors: Te, opts: ke, self: Ae } = C, { RULES: E } = Ae;
    if (le.$ref && (ke.ignoreKeywordsWithRef || !(0, o.schemaHasRulesButRef)(le, E))) {
      Z.block(() => N(C, "$ref", E.all.$ref.definition));
      return;
    }
    ke.jtd || ee(C, k), Z.block(() => {
      for (const re of E.rules)
        te(re);
      te(E.post);
    });
    function te(re) {
      (0, u.shouldUseGroup)(le, re) && (re.type ? (Z.if((0, a.checkDataType)(re.type, ve, ke.strictNumbers)), Q(C, re), k.length === 1 && k[0] === re.type && H && (Z.else(), (0, a.reportTypeError)(C)), Z.endIf()) : Q(C, re), Te || Z.if((0, s._)`${i.default.errors} === ${Y || 0}`));
    }
  }
  function Q(C, k) {
    const { gen: H, schema: Y, opts: { useDefaults: Z } } = C;
    Z && (0, d.assignDefaults)(C, k.type), H.block(() => {
      for (const le of k.rules)
        (0, u.shouldUseRule)(Y, le) && N(C, le.keyword, le.definition, k.type);
    });
  }
  function ee(C, k) {
    C.schemaEnv.meta || !C.opts.strictTypes || (ne(C, k), C.opts.allowUnionTypes || K(C, k), I(C, C.dataTypes));
  }
  function ne(C, k) {
    if (k.length) {
      if (!C.dataTypes.length) {
        C.dataTypes = k;
        return;
      }
      k.forEach((H) => {
        D(C.dataTypes, H) || O(C, `type "${H}" not allowed by context "${C.dataTypes.join(",")}"`);
      }), P(C, k);
    }
  }
  function K(C, k) {
    k.length > 1 && !(k.length === 2 && k.includes("null")) && O(C, "use allowUnionTypes to allow union type keyword");
  }
  function I(C, k) {
    const H = C.self.RULES.all;
    for (const Y in H) {
      const Z = H[Y];
      if (typeof Z == "object" && (0, u.shouldUseRule)(C.schema, Z)) {
        const { type: le } = Z.definition;
        le.length && !le.some((ve) => G(k, ve)) && O(C, `missing type "${le.join(",")}" for keyword "${Y}"`);
      }
    }
  }
  function G(C, k) {
    return C.includes(k) || k === "number" && C.includes("integer");
  }
  function D(C, k) {
    return C.includes(k) || k === "integer" && C.includes("number");
  }
  function P(C, k) {
    const H = [];
    for (const Y of C.dataTypes)
      D(k, Y) ? H.push(Y) : k.includes("integer") && Y === "number" && H.push("integer");
    C.dataTypes = H;
  }
  function O(C, k) {
    const H = C.schemaEnv.baseId + C.errSchemaPath;
    k += ` at "${H}" (strictTypes)`, (0, o.checkStrictMode)(C, k, C.opts.strictTypes);
  }
  class L {
    constructor(k, H, Y) {
      if ((0, r.validateKeywordUsage)(k, H, Y), this.gen = k.gen, this.allErrors = k.allErrors, this.keyword = Y, this.data = k.data, this.schema = k.schema[Y], this.$data = H.$data && k.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, o.schemaRefOrVal)(k, this.schema, Y, this.$data), this.schemaType = H.schemaType, this.parentSchema = k.schema, this.params = {}, this.it = k, this.def = H, this.$data)
        this.schemaCode = k.gen.const("vSchema", B(this.$data, k));
      else if (this.schemaCode = this.schemaValue, !(0, r.validSchemaType)(this.schema, H.schemaType, H.allowUndefined))
        throw new Error(`${Y} value must be ${JSON.stringify(H.schemaType)}`);
      ("code" in H ? H.trackErrors : H.errors !== !1) && (this.errsCount = k.gen.const("_errs", i.default.errors));
    }
    result(k, H, Y) {
      this.failResult((0, s.not)(k), H, Y);
    }
    failResult(k, H, Y) {
      this.gen.if(k), Y ? Y() : this.error(), H ? (this.gen.else(), H(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(k, H) {
      this.failResult((0, s.not)(k), void 0, H);
    }
    fail(k) {
      if (k === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(k), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(k) {
      if (!this.$data)
        return this.fail(k);
      const { schemaCode: H } = this;
      this.fail((0, s._)`${H} !== undefined && (${(0, s.or)(this.invalid$data(), k)})`);
    }
    error(k, H, Y) {
      if (H) {
        this.setParams(H), this._error(k, Y), this.setParams({});
        return;
      }
      this._error(k, Y);
    }
    _error(k, H) {
      (k ? p.reportExtraError : p.reportError)(this, this.def.error, H);
    }
    $dataError() {
      (0, p.reportError)(this, this.def.$dataError || p.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, p.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(k) {
      this.allErrors || this.gen.if(k);
    }
    setParams(k, H) {
      H ? Object.assign(this.params, k) : this.params = k;
    }
    block$data(k, H, Y = s.nil) {
      this.gen.block(() => {
        this.check$data(k, Y), H();
      });
    }
    check$data(k = s.nil, H = s.nil) {
      if (!this.$data)
        return;
      const { gen: Y, schemaCode: Z, schemaType: le, def: ve } = this;
      Y.if((0, s.or)((0, s._)`${Z} === undefined`, H)), k !== s.nil && Y.assign(k, !0), (le.length || ve.validateSchema) && (Y.elseIf(this.invalid$data()), this.$dataError(), k !== s.nil && Y.assign(k, !1)), Y.else();
    }
    invalid$data() {
      const { gen: k, schemaCode: H, schemaType: Y, def: Z, it: le } = this;
      return (0, s.or)(ve(), Te());
      function ve() {
        if (Y.length) {
          if (!(H instanceof s.Name))
            throw new Error("ajv implementation error");
          const ke = Array.isArray(Y) ? Y : [Y];
          return (0, s._)`${(0, a.checkDataTypes)(ke, H, le.opts.strictNumbers, a.DataType.Wrong)}`;
        }
        return s.nil;
      }
      function Te() {
        if (Z.validateSchema) {
          const ke = k.scopeValue("validate$data", { ref: Z.validateSchema });
          return (0, s._)`!${ke}(${H})`;
        }
        return s.nil;
      }
    }
    subschema(k, H) {
      const Y = (0, n.getSubschema)(this.it, k);
      (0, n.extendSubschemaData)(Y, this.it, k), (0, n.extendSubschemaMode)(Y, k);
      const Z = { ...this.it, ...Y, items: void 0, props: void 0 };
      return g(Z, H), Z;
    }
    mergeEvaluated(k, H) {
      const { it: Y, gen: Z } = this;
      Y.opts.unevaluated && (Y.props !== !0 && k.props !== void 0 && (Y.props = o.mergeEvaluated.props(Z, k.props, Y.props, H)), Y.items !== !0 && k.items !== void 0 && (Y.items = o.mergeEvaluated.items(Z, k.items, Y.items, H)));
    }
    mergeValidEvaluated(k, H) {
      const { it: Y, gen: Z } = this;
      if (Y.opts.unevaluated && (Y.props !== !0 || Y.items !== !0))
        return Z.if(H, () => this.mergeEvaluated(k, s.Name)), !0;
    }
  }
  Mt.KeywordCxt = L;
  function N(C, k, H, Y) {
    const Z = new L(C, H, k);
    "code" in H ? H.code(Z, Y) : Z.$data && H.validate ? (0, r.funcKeywordCode)(Z, H) : "macro" in H ? (0, r.macroKeywordCode)(Z, H) : (H.compile || H.validate) && (0, r.funcKeywordCode)(Z, H);
  }
  const A = /^\/(?:[^~]|~0|~1)*$/, J = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function B(C, { dataLevel: k, dataNames: H, dataPathArr: Y }) {
    let Z, le;
    if (C === "")
      return i.default.rootData;
    if (C[0] === "/") {
      if (!A.test(C))
        throw new Error(`Invalid JSON-pointer: ${C}`);
      Z = C, le = i.default.rootData;
    } else {
      const Ae = J.exec(C);
      if (!Ae)
        throw new Error(`Invalid JSON-pointer: ${C}`);
      const E = +Ae[1];
      if (Z = Ae[2], Z === "#") {
        if (E >= k)
          throw new Error(ke("property/index", E));
        return Y[k - E];
      }
      if (E > k)
        throw new Error(ke("data", E));
      if (le = H[k - E], !Z)
        return le;
    }
    let ve = le;
    const Te = Z.split("/");
    for (const Ae of Te)
      Ae && (le = (0, s._)`${le}${(0, s.getProperty)((0, o.unescapeJsonPointer)(Ae))}`, ve = (0, s._)`${ve} && ${le}`);
    return ve;
    function ke(Ae, E) {
      return `Cannot access ${Ae} ${E} levels up, current level is ${k}`;
    }
  }
  return Mt.getData = B, Mt;
}
var xn = {}, Hc;
function Lu() {
  if (Hc) return xn;
  Hc = 1, Object.defineProperty(xn, "__esModule", { value: !0 });
  class e extends Error {
    constructor(u) {
      super("validation failed"), this.errors = u, this.ajv = this.validation = !0;
    }
  }
  return xn.default = e, xn;
}
var Vn = {}, Gc;
function za() {
  if (Gc) return Vn;
  Gc = 1, Object.defineProperty(Vn, "__esModule", { value: !0 });
  const e = Ha();
  class t extends Error {
    constructor(a, d, r, n) {
      super(n || `can't resolve reference ${r} from id ${d}`), this.missingRef = (0, e.resolveUrl)(a, d, r), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(a, this.missingRef));
    }
  }
  return Vn.default = t, Vn;
}
var yt = {}, zc;
function Ka() {
  if (zc) return yt;
  zc = 1, Object.defineProperty(yt, "__esModule", { value: !0 }), yt.resolveSchema = yt.getCompilingSchema = yt.resolveRef = yt.compileSchema = yt.SchemaEnv = void 0;
  const e = Re(), t = Lu(), u = Ct(), a = Ha(), d = qe(), r = Ga();
  class n {
    constructor(m) {
      var l;
      this.refs = {}, this.dynamicAnchors = {};
      let g;
      typeof m.schema == "object" && (g = m.schema), this.schema = m.schema, this.schemaId = m.schemaId, this.root = m.root || this, this.baseId = (l = m.baseId) !== null && l !== void 0 ? l : (0, a.normalizeId)(g?.[m.schemaId || "$id"]), this.schemaPath = m.schemaPath, this.localRefs = m.localRefs, this.meta = m.meta, this.$async = g?.$async, this.refs = {};
    }
  }
  yt.SchemaEnv = n;
  function s(f) {
    const m = o.call(this, f);
    if (m)
      return m;
    const l = (0, a.getFullPath)(this.opts.uriResolver, f.root.baseId), { es5: g, lines: b } = this.opts.code, { ownProperties: S } = this.opts, _ = new e.CodeGen(this.scope, { es5: g, lines: b, ownProperties: S });
    let w;
    f.$async && (w = _.scopeValue("Error", {
      ref: t.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const R = _.scopeName("validate");
    f.validateName = R;
    const T = {
      gen: _,
      allErrors: this.opts.allErrors,
      data: u.default.data,
      parentData: u.default.parentData,
      parentDataProperty: u.default.parentDataProperty,
      dataNames: [u.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: _.scopeValue("schema", this.opts.code.source === !0 ? { ref: f.schema, code: (0, e.stringify)(f.schema) } : { ref: f.schema }),
      validateName: R,
      ValidationError: w,
      schema: f.schema,
      schemaEnv: f,
      rootId: l,
      baseId: f.baseId || l,
      schemaPath: e.nil,
      errSchemaPath: f.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let M;
    try {
      this._compilations.add(f), (0, r.validateFunctionCode)(T), _.optimize(this.opts.code.optimize);
      const F = _.toString();
      M = `${_.scopeRefs(u.default.scope)}return ${F}`, this.opts.code.process && (M = this.opts.code.process(M, f));
      const V = new Function(`${u.default.self}`, `${u.default.scope}`, M)(this, this.scope.get());
      if (this.scope.value(R, { ref: V }), V.errors = null, V.schema = f.schema, V.schemaEnv = f, f.$async && (V.$async = !0), this.opts.code.source === !0 && (V.source = { validateName: R, validateCode: F, scopeValues: _._values }), this.opts.unevaluated) {
        const { props: U, items: z } = T;
        V.evaluated = {
          props: U instanceof e.Name ? void 0 : U,
          items: z instanceof e.Name ? void 0 : z,
          dynamicProps: U instanceof e.Name,
          dynamicItems: z instanceof e.Name
        }, V.source && (V.source.evaluated = (0, e.stringify)(V.evaluated));
      }
      return f.validate = V, f;
    } catch (F) {
      throw delete f.validate, delete f.validateName, M && this.logger.error("Error compiling schema, function code:", M), F;
    } finally {
      this._compilations.delete(f);
    }
  }
  yt.compileSchema = s;
  function i(f, m, l) {
    var g;
    l = (0, a.resolveUrl)(this.opts.uriResolver, m, l);
    const b = f.refs[l];
    if (b)
      return b;
    let S = h.call(this, f, l);
    if (S === void 0) {
      const _ = (g = f.localRefs) === null || g === void 0 ? void 0 : g[l], { schemaId: w } = this.opts;
      _ && (S = new n({ schema: _, schemaId: w, root: f, baseId: m }));
    }
    if (S !== void 0)
      return f.refs[l] = c.call(this, S);
  }
  yt.resolveRef = i;
  function c(f) {
    return (0, a.inlineRef)(f.schema, this.opts.inlineRefs) ? f.schema : f.validate ? f : s.call(this, f);
  }
  function o(f) {
    for (const m of this._compilations)
      if (p(m, f))
        return m;
  }
  yt.getCompilingSchema = o;
  function p(f, m) {
    return f.schema === m.schema && f.root === m.root && f.baseId === m.baseId;
  }
  function h(f, m) {
    let l;
    for (; typeof (l = this.refs[m]) == "string"; )
      m = l;
    return l || this.schemas[m] || y.call(this, f, m);
  }
  function y(f, m) {
    const l = this.opts.uriResolver.parse(m), g = (0, a._getFullPath)(this.opts.uriResolver, l);
    let b = (0, a.getFullPath)(this.opts.uriResolver, f.baseId, void 0);
    if (Object.keys(f.schema).length > 0 && g === b)
      return v.call(this, l, f);
    const S = (0, a.normalizeId)(g), _ = this.refs[S] || this.schemas[S];
    if (typeof _ == "string") {
      const w = y.call(this, f, _);
      return typeof w?.schema != "object" ? void 0 : v.call(this, l, w);
    }
    if (typeof _?.schema == "object") {
      if (_.validate || s.call(this, _), S === (0, a.normalizeId)(m)) {
        const { schema: w } = _, { schemaId: R } = this.opts, T = w[R];
        return T && (b = (0, a.resolveUrl)(this.opts.uriResolver, b, T)), new n({ schema: w, schemaId: R, root: f, baseId: b });
      }
      return v.call(this, l, _);
    }
  }
  yt.resolveSchema = y;
  const $ = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function v(f, { baseId: m, schema: l, root: g }) {
    var b;
    if (((b = f.fragment) === null || b === void 0 ? void 0 : b[0]) !== "/")
      return;
    for (const w of f.fragment.slice(1).split("/")) {
      if (typeof l == "boolean")
        return;
      const R = l[(0, d.unescapeFragment)(w)];
      if (R === void 0)
        return;
      l = R;
      const T = typeof l == "object" && l[this.opts.schemaId];
      !$.has(w) && T && (m = (0, a.resolveUrl)(this.opts.uriResolver, m, T));
    }
    let S;
    if (typeof l != "boolean" && l.$ref && !(0, d.schemaHasRulesButRef)(l, this.RULES)) {
      const w = (0, a.resolveUrl)(this.opts.uriResolver, m, l.$ref);
      S = y.call(this, g, w);
    }
    const { schemaId: _ } = this.opts;
    if (S = S || new n({ schema: l, schemaId: _, root: g, baseId: m }), S.schema !== S.root.schema)
      return S;
  }
  return yt;
}
const Jg = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Xg = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Qg = "object", Zg = ["$data"], e0 = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, t0 = !1, r0 = {
  $id: Jg,
  description: Xg,
  type: Qg,
  required: Zg,
  properties: e0,
  additionalProperties: t0
};
var Bn = {}, Qr = { exports: {} }, go, Kc;
function n0() {
  return Kc || (Kc = 1, go = {
    HEX: {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15
    }
  }), go;
}
var vo, Wc;
function i0() {
  if (Wc) return vo;
  Wc = 1;
  const { HEX: e } = n0(), t = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
  function u(v) {
    if (s(v, ".") < 3)
      return { host: v, isIPV4: !1 };
    const f = v.match(t) || [], [m] = f;
    return m ? { host: n(m, "."), isIPV4: !0 } : { host: v, isIPV4: !1 };
  }
  function a(v, f = !1) {
    let m = "", l = !0;
    for (const g of v) {
      if (e[g] === void 0) return;
      g !== "0" && l === !0 && (l = !1), l || (m += g);
    }
    return f && m.length === 0 && (m = "0"), m;
  }
  function d(v) {
    let f = 0;
    const m = { error: !1, address: "", zone: "" }, l = [], g = [];
    let b = !1, S = !1, _ = !1;
    function w() {
      if (g.length) {
        if (b === !1) {
          const R = a(g);
          if (R !== void 0)
            l.push(R);
          else
            return m.error = !0, !1;
        }
        g.length = 0;
      }
      return !0;
    }
    for (let R = 0; R < v.length; R++) {
      const T = v[R];
      if (!(T === "[" || T === "]"))
        if (T === ":") {
          if (S === !0 && (_ = !0), !w())
            break;
          if (f++, l.push(":"), f > 7) {
            m.error = !0;
            break;
          }
          R - 1 >= 0 && v[R - 1] === ":" && (S = !0);
          continue;
        } else if (T === "%") {
          if (!w())
            break;
          b = !0;
        } else {
          g.push(T);
          continue;
        }
    }
    return g.length && (b ? m.zone = g.join("") : _ ? l.push(g.join("")) : l.push(a(g))), m.address = l.join(""), m;
  }
  function r(v) {
    if (s(v, ":") < 2)
      return { host: v, isIPV6: !1 };
    const f = d(v);
    if (f.error)
      return { host: v, isIPV6: !1 };
    {
      let m = f.address, l = f.address;
      return f.zone && (m += "%" + f.zone, l += "%25" + f.zone), { host: m, escapedHost: l, isIPV6: !0 };
    }
  }
  function n(v, f) {
    let m = "", l = !0;
    const g = v.length;
    for (let b = 0; b < g; b++) {
      const S = v[b];
      S === "0" && l ? (b + 1 <= g && v[b + 1] === f || b + 1 === g) && (m += S, l = !1) : (S === f ? l = !0 : l = !1, m += S);
    }
    return m;
  }
  function s(v, f) {
    let m = 0;
    for (let l = 0; l < v.length; l++)
      v[l] === f && m++;
    return m;
  }
  const i = /^\.\.?\//u, c = /^\/\.(?:\/|$)/u, o = /^\/\.\.(?:\/|$)/u, p = /^\/?(?:.|\n)*?(?=\/|$)/u;
  function h(v) {
    const f = [];
    for (; v.length; )
      if (v.match(i))
        v = v.replace(i, "");
      else if (v.match(c))
        v = v.replace(c, "/");
      else if (v.match(o))
        v = v.replace(o, "/"), f.pop();
      else if (v === "." || v === "..")
        v = "";
      else {
        const m = v.match(p);
        if (m) {
          const l = m[0];
          v = v.slice(l.length), f.push(l);
        } else
          throw new Error("Unexpected dot segment condition");
      }
    return f.join("");
  }
  function y(v, f) {
    const m = f !== !0 ? escape : unescape;
    return v.scheme !== void 0 && (v.scheme = m(v.scheme)), v.userinfo !== void 0 && (v.userinfo = m(v.userinfo)), v.host !== void 0 && (v.host = m(v.host)), v.path !== void 0 && (v.path = m(v.path)), v.query !== void 0 && (v.query = m(v.query)), v.fragment !== void 0 && (v.fragment = m(v.fragment)), v;
  }
  function $(v) {
    const f = [];
    if (v.userinfo !== void 0 && (f.push(v.userinfo), f.push("@")), v.host !== void 0) {
      let m = unescape(v.host);
      const l = u(m);
      if (l.isIPV4)
        m = l.host;
      else {
        const g = r(l.host);
        g.isIPV6 === !0 ? m = `[${g.escapedHost}]` : m = v.host;
      }
      f.push(m);
    }
    return (typeof v.port == "number" || typeof v.port == "string") && (f.push(":"), f.push(String(v.port))), f.length ? f.join("") : void 0;
  }
  return vo = {
    recomposeAuthority: $,
    normalizeComponentEncoding: y,
    removeDotSegments: h,
    normalizeIPv4: u,
    normalizeIPv6: r,
    stringArrayToHexStripped: a
  }, vo;
}
var _o, Yc;
function a0() {
  if (Yc) return _o;
  Yc = 1;
  const e = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, t = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
  function u(l) {
    return typeof l.secure == "boolean" ? l.secure : String(l.scheme).toLowerCase() === "wss";
  }
  function a(l) {
    return l.host || (l.error = l.error || "HTTP URIs must have a host."), l;
  }
  function d(l) {
    const g = String(l.scheme).toLowerCase() === "https";
    return (l.port === (g ? 443 : 80) || l.port === "") && (l.port = void 0), l.path || (l.path = "/"), l;
  }
  function r(l) {
    return l.secure = u(l), l.resourceName = (l.path || "/") + (l.query ? "?" + l.query : ""), l.path = void 0, l.query = void 0, l;
  }
  function n(l) {
    if ((l.port === (u(l) ? 443 : 80) || l.port === "") && (l.port = void 0), typeof l.secure == "boolean" && (l.scheme = l.secure ? "wss" : "ws", l.secure = void 0), l.resourceName) {
      const [g, b] = l.resourceName.split("?");
      l.path = g && g !== "/" ? g : void 0, l.query = b, l.resourceName = void 0;
    }
    return l.fragment = void 0, l;
  }
  function s(l, g) {
    if (!l.path)
      return l.error = "URN can not be parsed", l;
    const b = l.path.match(t);
    if (b) {
      const S = g.scheme || l.scheme || "urn";
      l.nid = b[1].toLowerCase(), l.nss = b[2];
      const _ = `${S}:${g.nid || l.nid}`, w = m[_];
      l.path = void 0, w && (l = w.parse(l, g));
    } else
      l.error = l.error || "URN can not be parsed.";
    return l;
  }
  function i(l, g) {
    const b = g.scheme || l.scheme || "urn", S = l.nid.toLowerCase(), _ = `${b}:${g.nid || S}`, w = m[_];
    w && (l = w.serialize(l, g));
    const R = l, T = l.nss;
    return R.path = `${S || g.nid}:${T}`, g.skipEscape = !0, R;
  }
  function c(l, g) {
    const b = l;
    return b.uuid = b.nss, b.nss = void 0, !g.tolerant && (!b.uuid || !e.test(b.uuid)) && (b.error = b.error || "UUID is not valid."), b;
  }
  function o(l) {
    const g = l;
    return g.nss = (l.uuid || "").toLowerCase(), g;
  }
  const p = {
    scheme: "http",
    domainHost: !0,
    parse: a,
    serialize: d
  }, h = {
    scheme: "https",
    domainHost: p.domainHost,
    parse: a,
    serialize: d
  }, y = {
    scheme: "ws",
    domainHost: !0,
    parse: r,
    serialize: n
  }, $ = {
    scheme: "wss",
    domainHost: y.domainHost,
    parse: y.parse,
    serialize: y.serialize
  }, m = {
    http: p,
    https: h,
    ws: y,
    wss: $,
    urn: {
      scheme: "urn",
      parse: s,
      serialize: i,
      skipNormalize: !0
    },
    "urn:uuid": {
      scheme: "urn:uuid",
      parse: c,
      serialize: o,
      skipNormalize: !0
    }
  };
  return _o = m, _o;
}
var Jc;
function Am() {
  if (Jc) return Qr.exports;
  Jc = 1;
  const { normalizeIPv6: e, normalizeIPv4: t, removeDotSegments: u, recomposeAuthority: a, normalizeComponentEncoding: d } = i0(), r = a0();
  function n(f, m) {
    return typeof f == "string" ? f = o($(f, m), m) : typeof f == "object" && (f = $(o(f, m), m)), f;
  }
  function s(f, m, l) {
    const g = Object.assign({ scheme: "null" }, l), b = i($(f, g), $(m, g), g, !0);
    return o(b, { ...g, skipEscape: !0 });
  }
  function i(f, m, l, g) {
    const b = {};
    return g || (f = $(o(f, l), l), m = $(o(m, l), l)), l = l || {}, !l.tolerant && m.scheme ? (b.scheme = m.scheme, b.userinfo = m.userinfo, b.host = m.host, b.port = m.port, b.path = u(m.path || ""), b.query = m.query) : (m.userinfo !== void 0 || m.host !== void 0 || m.port !== void 0 ? (b.userinfo = m.userinfo, b.host = m.host, b.port = m.port, b.path = u(m.path || ""), b.query = m.query) : (m.path ? (m.path.charAt(0) === "/" ? b.path = u(m.path) : ((f.userinfo !== void 0 || f.host !== void 0 || f.port !== void 0) && !f.path ? b.path = "/" + m.path : f.path ? b.path = f.path.slice(0, f.path.lastIndexOf("/") + 1) + m.path : b.path = m.path, b.path = u(b.path)), b.query = m.query) : (b.path = f.path, m.query !== void 0 ? b.query = m.query : b.query = f.query), b.userinfo = f.userinfo, b.host = f.host, b.port = f.port), b.scheme = f.scheme), b.fragment = m.fragment, b;
  }
  function c(f, m, l) {
    return typeof f == "string" ? (f = unescape(f), f = o(d($(f, l), !0), { ...l, skipEscape: !0 })) : typeof f == "object" && (f = o(d(f, !0), { ...l, skipEscape: !0 })), typeof m == "string" ? (m = unescape(m), m = o(d($(m, l), !0), { ...l, skipEscape: !0 })) : typeof m == "object" && (m = o(d(m, !0), { ...l, skipEscape: !0 })), f.toLowerCase() === m.toLowerCase();
  }
  function o(f, m) {
    const l = {
      host: f.host,
      scheme: f.scheme,
      userinfo: f.userinfo,
      port: f.port,
      path: f.path,
      query: f.query,
      nid: f.nid,
      nss: f.nss,
      uuid: f.uuid,
      fragment: f.fragment,
      reference: f.reference,
      resourceName: f.resourceName,
      secure: f.secure,
      error: ""
    }, g = Object.assign({}, m), b = [], S = r[(g.scheme || l.scheme || "").toLowerCase()];
    S && S.serialize && S.serialize(l, g), l.path !== void 0 && (g.skipEscape ? l.path = unescape(l.path) : (l.path = escape(l.path), l.scheme !== void 0 && (l.path = l.path.split("%3A").join(":")))), g.reference !== "suffix" && l.scheme && b.push(l.scheme, ":");
    const _ = a(l);
    if (_ !== void 0 && (g.reference !== "suffix" && b.push("//"), b.push(_), l.path && l.path.charAt(0) !== "/" && b.push("/")), l.path !== void 0) {
      let w = l.path;
      !g.absolutePath && (!S || !S.absolutePath) && (w = u(w)), _ === void 0 && (w = w.replace(/^\/\//u, "/%2F")), b.push(w);
    }
    return l.query !== void 0 && b.push("?", l.query), l.fragment !== void 0 && b.push("#", l.fragment), b.join("");
  }
  const p = Array.from({ length: 127 }, (f, m) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(m)));
  function h(f) {
    let m = 0;
    for (let l = 0, g = f.length; l < g; ++l)
      if (m = f.charCodeAt(l), m > 126 || p[m])
        return !0;
    return !1;
  }
  const y = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function $(f, m) {
    const l = Object.assign({}, m), g = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    }, b = f.indexOf("%") !== -1;
    let S = !1;
    l.reference === "suffix" && (f = (l.scheme ? l.scheme + ":" : "") + "//" + f);
    const _ = f.match(y);
    if (_) {
      if (g.scheme = _[1], g.userinfo = _[3], g.host = _[4], g.port = parseInt(_[5], 10), g.path = _[6] || "", g.query = _[7], g.fragment = _[8], isNaN(g.port) && (g.port = _[5]), g.host) {
        const R = t(g.host);
        if (R.isIPV4 === !1) {
          const T = e(R.host);
          g.host = T.host.toLowerCase(), S = T.isIPV6;
        } else
          g.host = R.host, S = !0;
      }
      g.scheme === void 0 && g.userinfo === void 0 && g.host === void 0 && g.port === void 0 && g.query === void 0 && !g.path ? g.reference = "same-document" : g.scheme === void 0 ? g.reference = "relative" : g.fragment === void 0 ? g.reference = "absolute" : g.reference = "uri", l.reference && l.reference !== "suffix" && l.reference !== g.reference && (g.error = g.error || "URI is not a " + l.reference + " reference.");
      const w = r[(l.scheme || g.scheme || "").toLowerCase()];
      if (!l.unicodeSupport && (!w || !w.unicodeSupport) && g.host && (l.domainHost || w && w.domainHost) && S === !1 && h(g.host))
        try {
          g.host = URL.domainToASCII(g.host.toLowerCase());
        } catch (R) {
          g.error = g.error || "Host's domain name can not be converted to ASCII: " + R;
        }
      (!w || w && !w.skipNormalize) && (b && g.scheme !== void 0 && (g.scheme = unescape(g.scheme)), b && g.host !== void 0 && (g.host = unescape(g.host)), g.path && (g.path = escape(unescape(g.path))), g.fragment && (g.fragment = encodeURI(decodeURIComponent(g.fragment)))), w && w.parse && w.parse(g, l);
    } else
      g.error = g.error || "URI can not be parsed.";
    return g;
  }
  const v = {
    SCHEMES: r,
    normalize: n,
    resolve: s,
    resolveComponents: i,
    equal: c,
    serialize: o,
    parse: $
  };
  return Qr.exports = v, Qr.exports.default = v, Qr.exports.fastUri = v, Qr.exports;
}
var Xc;
function o0() {
  if (Xc) return Bn;
  Xc = 1, Object.defineProperty(Bn, "__esModule", { value: !0 });
  const e = Am();
  return e.code = 'require("ajv/dist/runtime/uri").default', Bn.default = e, Bn;
}
var Qc;
function s0() {
  return Qc || (Qc = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var t = Ga();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return t.KeywordCxt;
    } });
    var u = Re();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return u._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return u.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return u.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return u.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return u.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return u.CodeGen;
    } });
    const a = Lu(), d = za(), r = Tm(), n = Ka(), s = Re(), i = Ha(), c = qa(), o = qe(), p = r0, h = o0(), y = (K, I) => new RegExp(K, I);
    y.code = "new RegExp";
    const $ = ["removeAdditional", "useDefaults", "coerceTypes"], v = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), f = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, m = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, l = 200;
    function g(K) {
      var I, G, D, P, O, L, N, A, J, B, C, k, H, Y, Z, le, ve, Te, ke, Ae, E, te, re, pe, ae;
      const de = K.strict, ce = (I = K.code) === null || I === void 0 ? void 0 : I.optimize, me = ce === !0 || ce === void 0 ? 1 : ce || 0, we = (D = (G = K.code) === null || G === void 0 ? void 0 : G.regExp) !== null && D !== void 0 ? D : y, be = (P = K.uriResolver) !== null && P !== void 0 ? P : h.default;
      return {
        strictSchema: (L = (O = K.strictSchema) !== null && O !== void 0 ? O : de) !== null && L !== void 0 ? L : !0,
        strictNumbers: (A = (N = K.strictNumbers) !== null && N !== void 0 ? N : de) !== null && A !== void 0 ? A : !0,
        strictTypes: (B = (J = K.strictTypes) !== null && J !== void 0 ? J : de) !== null && B !== void 0 ? B : "log",
        strictTuples: (k = (C = K.strictTuples) !== null && C !== void 0 ? C : de) !== null && k !== void 0 ? k : "log",
        strictRequired: (Y = (H = K.strictRequired) !== null && H !== void 0 ? H : de) !== null && Y !== void 0 ? Y : !1,
        code: K.code ? { ...K.code, optimize: me, regExp: we } : { optimize: me, regExp: we },
        loopRequired: (Z = K.loopRequired) !== null && Z !== void 0 ? Z : l,
        loopEnum: (le = K.loopEnum) !== null && le !== void 0 ? le : l,
        meta: (ve = K.meta) !== null && ve !== void 0 ? ve : !0,
        messages: (Te = K.messages) !== null && Te !== void 0 ? Te : !0,
        inlineRefs: (ke = K.inlineRefs) !== null && ke !== void 0 ? ke : !0,
        schemaId: (Ae = K.schemaId) !== null && Ae !== void 0 ? Ae : "$id",
        addUsedSchema: (E = K.addUsedSchema) !== null && E !== void 0 ? E : !0,
        validateSchema: (te = K.validateSchema) !== null && te !== void 0 ? te : !0,
        validateFormats: (re = K.validateFormats) !== null && re !== void 0 ? re : !0,
        unicodeRegExp: (pe = K.unicodeRegExp) !== null && pe !== void 0 ? pe : !0,
        int32range: (ae = K.int32range) !== null && ae !== void 0 ? ae : !0,
        uriResolver: be
      };
    }
    class b {
      constructor(I = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), I = this.opts = { ...I, ...g(I) };
        const { es5: G, lines: D } = this.opts.code;
        this.scope = new s.ValueScope({ scope: {}, prefixes: v, es5: G, lines: D }), this.logger = j(I.logger);
        const P = I.validateFormats;
        I.validateFormats = !1, this.RULES = (0, r.getRules)(), S.call(this, f, I, "NOT SUPPORTED"), S.call(this, m, I, "DEPRECATED", "warn"), this._metaOpts = M.call(this), I.formats && R.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), I.keywords && T.call(this, I.keywords), typeof I.meta == "object" && this.addMetaSchema(I.meta), w.call(this), I.validateFormats = P;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: I, meta: G, schemaId: D } = this.opts;
        let P = p;
        D === "id" && (P = { ...p }, P.id = P.$id, delete P.$id), G && I && this.addMetaSchema(P, P[D], !1);
      }
      defaultMeta() {
        const { meta: I, schemaId: G } = this.opts;
        return this.opts.defaultMeta = typeof I == "object" ? I[G] || I : void 0;
      }
      validate(I, G) {
        let D;
        if (typeof I == "string") {
          if (D = this.getSchema(I), !D)
            throw new Error(`no schema with key or ref "${I}"`);
        } else
          D = this.compile(I);
        const P = D(G);
        return "$async" in D || (this.errors = D.errors), P;
      }
      compile(I, G) {
        const D = this._addSchema(I, G);
        return D.validate || this._compileSchemaEnv(D);
      }
      compileAsync(I, G) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: D } = this.opts;
        return P.call(this, I, G);
        async function P(B, C) {
          await O.call(this, B.$schema);
          const k = this._addSchema(B, C);
          return k.validate || L.call(this, k);
        }
        async function O(B) {
          B && !this.getSchema(B) && await P.call(this, { $ref: B }, !0);
        }
        async function L(B) {
          try {
            return this._compileSchemaEnv(B);
          } catch (C) {
            if (!(C instanceof d.default))
              throw C;
            return N.call(this, C), await A.call(this, C.missingSchema), L.call(this, B);
          }
        }
        function N({ missingSchema: B, missingRef: C }) {
          if (this.refs[B])
            throw new Error(`AnySchema ${B} is loaded but ${C} cannot be resolved`);
        }
        async function A(B) {
          const C = await J.call(this, B);
          this.refs[B] || await O.call(this, C.$schema), this.refs[B] || this.addSchema(C, B, G);
        }
        async function J(B) {
          const C = this._loading[B];
          if (C)
            return C;
          try {
            return await (this._loading[B] = D(B));
          } finally {
            delete this._loading[B];
          }
        }
      }
      // Adds schema to the instance
      addSchema(I, G, D, P = this.opts.validateSchema) {
        if (Array.isArray(I)) {
          for (const L of I)
            this.addSchema(L, void 0, D, P);
          return this;
        }
        let O;
        if (typeof I == "object") {
          const { schemaId: L } = this.opts;
          if (O = I[L], O !== void 0 && typeof O != "string")
            throw new Error(`schema ${L} must be string`);
        }
        return G = (0, i.normalizeId)(G || O), this._checkUnique(G), this.schemas[G] = this._addSchema(I, D, G, P, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(I, G, D = this.opts.validateSchema) {
        return this.addSchema(I, G, !0, D), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(I, G) {
        if (typeof I == "boolean")
          return !0;
        let D;
        if (D = I.$schema, D !== void 0 && typeof D != "string")
          throw new Error("$schema must be a string");
        if (D = D || this.opts.defaultMeta || this.defaultMeta(), !D)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const P = this.validate(D, I);
        if (!P && G) {
          const O = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(O);
          else
            throw new Error(O);
        }
        return P;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(I) {
        let G;
        for (; typeof (G = _.call(this, I)) == "string"; )
          I = G;
        if (G === void 0) {
          const { schemaId: D } = this.opts, P = new n.SchemaEnv({ schema: {}, schemaId: D });
          if (G = n.resolveSchema.call(this, P, I), !G)
            return;
          this.refs[I] = G;
        }
        return G.validate || this._compileSchemaEnv(G);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(I) {
        if (I instanceof RegExp)
          return this._removeAllSchemas(this.schemas, I), this._removeAllSchemas(this.refs, I), this;
        switch (typeof I) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const G = _.call(this, I);
            return typeof G == "object" && this._cache.delete(G.schema), delete this.schemas[I], delete this.refs[I], this;
          }
          case "object": {
            const G = I;
            this._cache.delete(G);
            let D = I[this.opts.schemaId];
            return D && (D = (0, i.normalizeId)(D), delete this.schemas[D], delete this.refs[D]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(I) {
        for (const G of I)
          this.addKeyword(G);
        return this;
      }
      addKeyword(I, G) {
        let D;
        if (typeof I == "string")
          D = I, typeof G == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), G.keyword = D);
        else if (typeof I == "object" && G === void 0) {
          if (G = I, D = G.keyword, Array.isArray(D) && !D.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (U.call(this, D, G), !G)
          return (0, o.eachItem)(D, (O) => z.call(this, O)), this;
        Q.call(this, G);
        const P = {
          ...G,
          type: (0, c.getJSONTypes)(G.type),
          schemaType: (0, c.getJSONTypes)(G.schemaType)
        };
        return (0, o.eachItem)(D, P.type.length === 0 ? (O) => z.call(this, O, P) : (O) => P.type.forEach((L) => z.call(this, O, P, L))), this;
      }
      getKeyword(I) {
        const G = this.RULES.all[I];
        return typeof G == "object" ? G.definition : !!G;
      }
      // Remove keyword
      removeKeyword(I) {
        const { RULES: G } = this;
        delete G.keywords[I], delete G.all[I];
        for (const D of G.rules) {
          const P = D.rules.findIndex((O) => O.keyword === I);
          P >= 0 && D.rules.splice(P, 1);
        }
        return this;
      }
      // Add format
      addFormat(I, G) {
        return typeof G == "string" && (G = new RegExp(G)), this.formats[I] = G, this;
      }
      errorsText(I = this.errors, { separator: G = ", ", dataVar: D = "data" } = {}) {
        return !I || I.length === 0 ? "No errors" : I.map((P) => `${D}${P.instancePath} ${P.message}`).reduce((P, O) => P + G + O);
      }
      $dataMetaSchema(I, G) {
        const D = this.RULES.all;
        I = JSON.parse(JSON.stringify(I));
        for (const P of G) {
          const O = P.split("/").slice(1);
          let L = I;
          for (const N of O)
            L = L[N];
          for (const N in D) {
            const A = D[N];
            if (typeof A != "object")
              continue;
            const { $data: J } = A.definition, B = L[N];
            J && B && (L[N] = ne(B));
          }
        }
        return I;
      }
      _removeAllSchemas(I, G) {
        for (const D in I) {
          const P = I[D];
          (!G || G.test(D)) && (typeof P == "string" ? delete I[D] : P && !P.meta && (this._cache.delete(P.schema), delete I[D]));
        }
      }
      _addSchema(I, G, D, P = this.opts.validateSchema, O = this.opts.addUsedSchema) {
        let L;
        const { schemaId: N } = this.opts;
        if (typeof I == "object")
          L = I[N];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof I != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let A = this._cache.get(I);
        if (A !== void 0)
          return A;
        D = (0, i.normalizeId)(L || D);
        const J = i.getSchemaRefs.call(this, I, D);
        return A = new n.SchemaEnv({ schema: I, schemaId: N, meta: G, baseId: D, localRefs: J }), this._cache.set(A.schema, A), O && !D.startsWith("#") && (D && this._checkUnique(D), this.refs[D] = A), P && this.validateSchema(I, !0), A;
      }
      _checkUnique(I) {
        if (this.schemas[I] || this.refs[I])
          throw new Error(`schema with key or id "${I}" already exists`);
      }
      _compileSchemaEnv(I) {
        if (I.meta ? this._compileMetaSchema(I) : n.compileSchema.call(this, I), !I.validate)
          throw new Error("ajv implementation error");
        return I.validate;
      }
      _compileMetaSchema(I) {
        const G = this.opts;
        this.opts = this._metaOpts;
        try {
          n.compileSchema.call(this, I);
        } finally {
          this.opts = G;
        }
      }
    }
    b.ValidationError = a.default, b.MissingRefError = d.default, e.default = b;
    function S(K, I, G, D = "error") {
      for (const P in K) {
        const O = P;
        O in I && this.logger[D](`${G}: option ${P}. ${K[O]}`);
      }
    }
    function _(K) {
      return K = (0, i.normalizeId)(K), this.schemas[K] || this.refs[K];
    }
    function w() {
      const K = this.opts.schemas;
      if (K)
        if (Array.isArray(K))
          this.addSchema(K);
        else
          for (const I in K)
            this.addSchema(K[I], I);
    }
    function R() {
      for (const K in this.opts.formats) {
        const I = this.opts.formats[K];
        I && this.addFormat(K, I);
      }
    }
    function T(K) {
      if (Array.isArray(K)) {
        this.addVocabulary(K);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const I in K) {
        const G = K[I];
        G.keyword || (G.keyword = I), this.addKeyword(G);
      }
    }
    function M() {
      const K = { ...this.opts };
      for (const I of $)
        delete K[I];
      return K;
    }
    const F = { log() {
    }, warn() {
    }, error() {
    } };
    function j(K) {
      if (K === !1)
        return F;
      if (K === void 0)
        return console;
      if (K.log && K.warn && K.error)
        return K;
      throw new Error("logger must implement log, warn and error methods");
    }
    const V = /^[a-z_$][a-z0-9_$:-]*$/i;
    function U(K, I) {
      const { RULES: G } = this;
      if ((0, o.eachItem)(K, (D) => {
        if (G.keywords[D])
          throw new Error(`Keyword ${D} is already defined`);
        if (!V.test(D))
          throw new Error(`Keyword ${D} has invalid name`);
      }), !!I && I.$data && !("code" in I || "validate" in I))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function z(K, I, G) {
      var D;
      const P = I?.post;
      if (G && P)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: O } = this;
      let L = P ? O.post : O.rules.find(({ type: A }) => A === G);
      if (L || (L = { type: G, rules: [] }, O.rules.push(L)), O.keywords[K] = !0, !I)
        return;
      const N = {
        keyword: K,
        definition: {
          ...I,
          type: (0, c.getJSONTypes)(I.type),
          schemaType: (0, c.getJSONTypes)(I.schemaType)
        }
      };
      I.before ? W.call(this, L, N, I.before) : L.rules.push(N), O.all[K] = N, (D = I.implements) === null || D === void 0 || D.forEach((A) => this.addKeyword(A));
    }
    function W(K, I, G) {
      const D = K.rules.findIndex((P) => P.keyword === G);
      D >= 0 ? K.rules.splice(D, 0, I) : (K.rules.push(I), this.logger.warn(`rule ${G} is not defined`));
    }
    function Q(K) {
      let { metaSchema: I } = K;
      I !== void 0 && (K.$data && this.opts.$data && (I = ne(I)), K.validateSchema = this.compile(I, !0));
    }
    const ee = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function ne(K) {
      return { anyOf: [K, ee] };
    }
  }(co)), co;
}
var Hn = {}, Gn = {}, zn = {}, Zc;
function u0() {
  if (Zc) return zn;
  Zc = 1, Object.defineProperty(zn, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return zn.default = e, zn;
}
var er = {}, el;
function Mu() {
  if (el) return er;
  el = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.callRef = er.getValidate = void 0;
  const e = za(), t = It(), u = Re(), a = Ct(), d = Ka(), r = qe(), n = {
    keyword: "$ref",
    schemaType: "string",
    code(c) {
      const { gen: o, schema: p, it: h } = c, { baseId: y, schemaEnv: $, validateName: v, opts: f, self: m } = h, { root: l } = $;
      if ((p === "#" || p === "#/") && y === l.baseId)
        return b();
      const g = d.resolveRef.call(m, l, y, p);
      if (g === void 0)
        throw new e.default(h.opts.uriResolver, y, p);
      if (g instanceof d.SchemaEnv)
        return S(g);
      return _(g);
      function b() {
        if ($ === l)
          return i(c, v, $, $.$async);
        const w = o.scopeValue("root", { ref: l });
        return i(c, (0, u._)`${w}.validate`, l, l.$async);
      }
      function S(w) {
        const R = s(c, w);
        i(c, R, w, w.$async);
      }
      function _(w) {
        const R = o.scopeValue("schema", f.code.source === !0 ? { ref: w, code: (0, u.stringify)(w) } : { ref: w }), T = o.name("valid"), M = c.subschema({
          schema: w,
          dataTypes: [],
          schemaPath: u.nil,
          topSchemaRef: R,
          errSchemaPath: p
        }, T);
        c.mergeEvaluated(M), c.ok(T);
      }
    }
  };
  function s(c, o) {
    const { gen: p } = c;
    return o.validate ? p.scopeValue("validate", { ref: o.validate }) : (0, u._)`${p.scopeValue("wrapper", { ref: o })}.validate`;
  }
  er.getValidate = s;
  function i(c, o, p, h) {
    const { gen: y, it: $ } = c, { allErrors: v, schemaEnv: f, opts: m } = $, l = m.passContext ? a.default.this : u.nil;
    h ? g() : b();
    function g() {
      if (!f.$async)
        throw new Error("async schema referenced by sync schema");
      const w = y.let("valid");
      y.try(() => {
        y.code((0, u._)`await ${(0, t.callValidateCode)(c, o, l)}`), _(o), v || y.assign(w, !0);
      }, (R) => {
        y.if((0, u._)`!(${R} instanceof ${$.ValidationError})`, () => y.throw(R)), S(R), v || y.assign(w, !1);
      }), c.ok(w);
    }
    function b() {
      c.result((0, t.callValidateCode)(c, o, l), () => _(o), () => S(o));
    }
    function S(w) {
      const R = (0, u._)`${w}.errors`;
      y.assign(a.default.vErrors, (0, u._)`${a.default.vErrors} === null ? ${R} : ${a.default.vErrors}.concat(${R})`), y.assign(a.default.errors, (0, u._)`${a.default.vErrors}.length`);
    }
    function _(w) {
      var R;
      if (!$.opts.unevaluated)
        return;
      const T = (R = p?.validate) === null || R === void 0 ? void 0 : R.evaluated;
      if ($.props !== !0)
        if (T && !T.dynamicProps)
          T.props !== void 0 && ($.props = r.mergeEvaluated.props(y, T.props, $.props));
        else {
          const M = y.var("props", (0, u._)`${w}.evaluated.props`);
          $.props = r.mergeEvaluated.props(y, M, $.props, u.Name);
        }
      if ($.items !== !0)
        if (T && !T.dynamicItems)
          T.items !== void 0 && ($.items = r.mergeEvaluated.items(y, T.items, $.items));
        else {
          const M = y.var("items", (0, u._)`${w}.evaluated.items`);
          $.items = r.mergeEvaluated.items(y, M, $.items, u.Name);
        }
    }
  }
  return er.callRef = i, er.default = n, er;
}
var tl;
function c0() {
  if (tl) return Gn;
  tl = 1, Object.defineProperty(Gn, "__esModule", { value: !0 });
  const e = u0(), t = Mu(), u = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    t.default
  ];
  return Gn.default = u, Gn;
}
var Kn = {}, Wn = {}, rl;
function l0() {
  if (rl) return Wn;
  rl = 1, Object.defineProperty(Wn, "__esModule", { value: !0 });
  const e = Re(), t = e.operators, u = {
    maximum: { okStr: "<=", ok: t.LTE, fail: t.GT },
    minimum: { okStr: ">=", ok: t.GTE, fail: t.LT },
    exclusiveMaximum: { okStr: "<", ok: t.LT, fail: t.GTE },
    exclusiveMinimum: { okStr: ">", ok: t.GT, fail: t.LTE }
  }, a = {
    message: ({ keyword: r, schemaCode: n }) => (0, e.str)`must be ${u[r].okStr} ${n}`,
    params: ({ keyword: r, schemaCode: n }) => (0, e._)`{comparison: ${u[r].okStr}, limit: ${n}}`
  }, d = {
    keyword: Object.keys(u),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: a,
    code(r) {
      const { keyword: n, data: s, schemaCode: i } = r;
      r.fail$data((0, e._)`${s} ${u[n].fail} ${i} || isNaN(${s})`);
    }
  };
  return Wn.default = d, Wn;
}
var Yn = {}, nl;
function f0() {
  if (nl) return Yn;
  nl = 1, Object.defineProperty(Yn, "__esModule", { value: !0 });
  const e = Re(), u = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: a }) => (0, e.str)`must be multiple of ${a}`,
      params: ({ schemaCode: a }) => (0, e._)`{multipleOf: ${a}}`
    },
    code(a) {
      const { gen: d, data: r, schemaCode: n, it: s } = a, i = s.opts.multipleOfPrecision, c = d.let("res"), o = i ? (0, e._)`Math.abs(Math.round(${c}) - ${c}) > 1e-${i}` : (0, e._)`${c} !== parseInt(${c})`;
      a.fail$data((0, e._)`(${n} === 0 || (${c} = ${r}/${n}, ${o}))`);
    }
  };
  return Yn.default = u, Yn;
}
var Jn = {}, Xn = {}, il;
function d0() {
  if (il) return Xn;
  il = 1, Object.defineProperty(Xn, "__esModule", { value: !0 });
  function e(t) {
    const u = t.length;
    let a = 0, d = 0, r;
    for (; d < u; )
      a++, r = t.charCodeAt(d++), r >= 55296 && r <= 56319 && d < u && (r = t.charCodeAt(d), (r & 64512) === 56320 && d++);
    return a;
  }
  return Xn.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', Xn;
}
var al;
function h0() {
  if (al) return Jn;
  al = 1, Object.defineProperty(Jn, "__esModule", { value: !0 });
  const e = Re(), t = qe(), u = d0(), d = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: n }) {
        const s = r === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${s} than ${n} characters`;
      },
      params: ({ schemaCode: r }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: n, data: s, schemaCode: i, it: c } = r, o = n === "maxLength" ? e.operators.GT : e.operators.LT, p = c.opts.unicode === !1 ? (0, e._)`${s}.length` : (0, e._)`${(0, t.useFunc)(r.gen, u.default)}(${s})`;
      r.fail$data((0, e._)`${p} ${o} ${i}`);
    }
  };
  return Jn.default = d, Jn;
}
var Qn = {}, ol;
function p0() {
  if (ol) return Qn;
  ol = 1, Object.defineProperty(Qn, "__esModule", { value: !0 });
  const e = It(), t = Re(), a = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: d }) => (0, t.str)`must match pattern "${d}"`,
      params: ({ schemaCode: d }) => (0, t._)`{pattern: ${d}}`
    },
    code(d) {
      const { data: r, $data: n, schema: s, schemaCode: i, it: c } = d, o = c.opts.unicodeRegExp ? "u" : "", p = n ? (0, t._)`(new RegExp(${i}, ${o}))` : (0, e.usePattern)(d, s);
      d.fail$data((0, t._)`!${p}.test(${r})`);
    }
  };
  return Qn.default = a, Qn;
}
var Zn = {}, sl;
function m0() {
  if (sl) return Zn;
  sl = 1, Object.defineProperty(Zn, "__esModule", { value: !0 });
  const e = Re(), u = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: a, schemaCode: d }) {
        const r = a === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${r} than ${d} properties`;
      },
      params: ({ schemaCode: a }) => (0, e._)`{limit: ${a}}`
    },
    code(a) {
      const { keyword: d, data: r, schemaCode: n } = a, s = d === "maxProperties" ? e.operators.GT : e.operators.LT;
      a.fail$data((0, e._)`Object.keys(${r}).length ${s} ${n}`);
    }
  };
  return Zn.default = u, Zn;
}
var ei = {}, ul;
function y0() {
  if (ul) return ei;
  ul = 1, Object.defineProperty(ei, "__esModule", { value: !0 });
  const e = It(), t = Re(), u = qe(), d = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: r } }) => (0, t.str)`must have required property '${r}'`,
      params: ({ params: { missingProperty: r } }) => (0, t._)`{missingProperty: ${r}}`
    },
    code(r) {
      const { gen: n, schema: s, schemaCode: i, data: c, $data: o, it: p } = r, { opts: h } = p;
      if (!o && s.length === 0)
        return;
      const y = s.length >= h.loopRequired;
      if (p.allErrors ? $() : v(), h.strictRequired) {
        const l = r.parentSchema.properties, { definedProperties: g } = r.it;
        for (const b of s)
          if (l?.[b] === void 0 && !g.has(b)) {
            const S = p.schemaEnv.baseId + p.errSchemaPath, _ = `required property "${b}" is not defined at "${S}" (strictRequired)`;
            (0, u.checkStrictMode)(p, _, p.opts.strictRequired);
          }
      }
      function $() {
        if (y || o)
          r.block$data(t.nil, f);
        else
          for (const l of s)
            (0, e.checkReportMissingProp)(r, l);
      }
      function v() {
        const l = n.let("missing");
        if (y || o) {
          const g = n.let("valid", !0);
          r.block$data(g, () => m(l, g)), r.ok(g);
        } else
          n.if((0, e.checkMissingProp)(r, s, l)), (0, e.reportMissingProp)(r, l), n.else();
      }
      function f() {
        n.forOf("prop", i, (l) => {
          r.setParams({ missingProperty: l }), n.if((0, e.noPropertyInData)(n, c, l, h.ownProperties), () => r.error());
        });
      }
      function m(l, g) {
        r.setParams({ missingProperty: l }), n.forOf(l, i, () => {
          n.assign(g, (0, e.propertyInData)(n, c, l, h.ownProperties)), n.if((0, t.not)(g), () => {
            r.error(), n.break();
          });
        }, t.nil);
      }
    }
  };
  return ei.default = d, ei;
}
var ti = {}, cl;
function g0() {
  if (cl) return ti;
  cl = 1, Object.defineProperty(ti, "__esModule", { value: !0 });
  const e = Re(), u = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: a, schemaCode: d }) {
        const r = a === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${r} than ${d} items`;
      },
      params: ({ schemaCode: a }) => (0, e._)`{limit: ${a}}`
    },
    code(a) {
      const { keyword: d, data: r, schemaCode: n } = a, s = d === "maxItems" ? e.operators.GT : e.operators.LT;
      a.fail$data((0, e._)`${r}.length ${s} ${n}`);
    }
  };
  return ti.default = u, ti;
}
var ri = {}, ni = {}, ll;
function xu() {
  if (ll) return ni;
  ll = 1, Object.defineProperty(ni, "__esModule", { value: !0 });
  const e = Ba();
  return e.code = 'require("ajv/dist/runtime/equal").default', ni.default = e, ni;
}
var fl;
function v0() {
  if (fl) return ri;
  fl = 1, Object.defineProperty(ri, "__esModule", { value: !0 });
  const e = qa(), t = Re(), u = qe(), a = xu(), r = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: n, j: s } }) => (0, t.str)`must NOT have duplicate items (items ## ${s} and ${n} are identical)`,
      params: ({ params: { i: n, j: s } }) => (0, t._)`{i: ${n}, j: ${s}}`
    },
    code(n) {
      const { gen: s, data: i, $data: c, schema: o, parentSchema: p, schemaCode: h, it: y } = n;
      if (!c && !o)
        return;
      const $ = s.let("valid"), v = p.items ? (0, e.getSchemaTypes)(p.items) : [];
      n.block$data($, f, (0, t._)`${h} === false`), n.ok($);
      function f() {
        const b = s.let("i", (0, t._)`${i}.length`), S = s.let("j");
        n.setParams({ i: b, j: S }), s.assign($, !0), s.if((0, t._)`${b} > 1`, () => (m() ? l : g)(b, S));
      }
      function m() {
        return v.length > 0 && !v.some((b) => b === "object" || b === "array");
      }
      function l(b, S) {
        const _ = s.name("item"), w = (0, e.checkDataTypes)(v, _, y.opts.strictNumbers, e.DataType.Wrong), R = s.const("indices", (0, t._)`{}`);
        s.for((0, t._)`;${b}--;`, () => {
          s.let(_, (0, t._)`${i}[${b}]`), s.if(w, (0, t._)`continue`), v.length > 1 && s.if((0, t._)`typeof ${_} == "string"`, (0, t._)`${_} += "_"`), s.if((0, t._)`typeof ${R}[${_}] == "number"`, () => {
            s.assign(S, (0, t._)`${R}[${_}]`), n.error(), s.assign($, !1).break();
          }).code((0, t._)`${R}[${_}] = ${b}`);
        });
      }
      function g(b, S) {
        const _ = (0, u.useFunc)(s, a.default), w = s.name("outer");
        s.label(w).for((0, t._)`;${b}--;`, () => s.for((0, t._)`${S} = ${b}; ${S}--;`, () => s.if((0, t._)`${_}(${i}[${b}], ${i}[${S}])`, () => {
          n.error(), s.assign($, !1).break(w);
        })));
      }
    }
  };
  return ri.default = r, ri;
}
var ii = {}, dl;
function _0() {
  if (dl) return ii;
  dl = 1, Object.defineProperty(ii, "__esModule", { value: !0 });
  const e = Re(), t = qe(), u = xu(), d = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: r }) => (0, e._)`{allowedValue: ${r}}`
    },
    code(r) {
      const { gen: n, data: s, $data: i, schemaCode: c, schema: o } = r;
      i || o && typeof o == "object" ? r.fail$data((0, e._)`!${(0, t.useFunc)(n, u.default)}(${s}, ${c})`) : r.fail((0, e._)`${o} !== ${s}`);
    }
  };
  return ii.default = d, ii;
}
var ai = {}, hl;
function $0() {
  if (hl) return ai;
  hl = 1, Object.defineProperty(ai, "__esModule", { value: !0 });
  const e = Re(), t = qe(), u = xu(), d = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: r }) => (0, e._)`{allowedValues: ${r}}`
    },
    code(r) {
      const { gen: n, data: s, $data: i, schema: c, schemaCode: o, it: p } = r;
      if (!i && c.length === 0)
        throw new Error("enum must have non-empty array");
      const h = c.length >= p.opts.loopEnum;
      let y;
      const $ = () => y ?? (y = (0, t.useFunc)(n, u.default));
      let v;
      if (h || i)
        v = n.let("valid"), r.block$data(v, f);
      else {
        if (!Array.isArray(c))
          throw new Error("ajv implementation error");
        const l = n.const("vSchema", o);
        v = (0, e.or)(...c.map((g, b) => m(l, b)));
      }
      r.pass(v);
      function f() {
        n.assign(v, !1), n.forOf("v", o, (l) => n.if((0, e._)`${$()}(${s}, ${l})`, () => n.assign(v, !0).break()));
      }
      function m(l, g) {
        const b = c[g];
        return typeof b == "object" && b !== null ? (0, e._)`${$()}(${s}, ${l}[${g}])` : (0, e._)`${s} === ${b}`;
      }
    }
  };
  return ai.default = d, ai;
}
var pl;
function w0() {
  if (pl) return Kn;
  pl = 1, Object.defineProperty(Kn, "__esModule", { value: !0 });
  const e = l0(), t = f0(), u = h0(), a = p0(), d = m0(), r = y0(), n = g0(), s = v0(), i = _0(), c = $0(), o = [
    // number
    e.default,
    t.default,
    // string
    u.default,
    a.default,
    // object
    d.default,
    r.default,
    // array
    n.default,
    s.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    i.default,
    c.default
  ];
  return Kn.default = o, Kn;
}
var oi = {}, Nr = {}, ml;
function Nm() {
  if (ml) return Nr;
  ml = 1, Object.defineProperty(Nr, "__esModule", { value: !0 }), Nr.validateAdditionalItems = void 0;
  const e = Re(), t = qe(), a = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: r } }) => (0, e.str)`must NOT have more than ${r} items`,
      params: ({ params: { len: r } }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { parentSchema: n, it: s } = r, { items: i } = n;
      if (!Array.isArray(i)) {
        (0, t.checkStrictMode)(s, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      d(r, i);
    }
  };
  function d(r, n) {
    const { gen: s, schema: i, data: c, keyword: o, it: p } = r;
    p.items = !0;
    const h = s.const("len", (0, e._)`${c}.length`);
    if (i === !1)
      r.setParams({ len: n.length }), r.pass((0, e._)`${h} <= ${n.length}`);
    else if (typeof i == "object" && !(0, t.alwaysValidSchema)(p, i)) {
      const $ = s.var("valid", (0, e._)`${h} <= ${n.length}`);
      s.if((0, e.not)($), () => y($)), r.ok($);
    }
    function y($) {
      s.forRange("i", n.length, h, (v) => {
        r.subschema({ keyword: o, dataProp: v, dataPropType: t.Type.Num }, $), p.allErrors || s.if((0, e.not)($), () => s.break());
      });
    }
  }
  return Nr.validateAdditionalItems = d, Nr.default = a, Nr;
}
var si = {}, Cr = {}, yl;
function Cm() {
  if (yl) return Cr;
  yl = 1, Object.defineProperty(Cr, "__esModule", { value: !0 }), Cr.validateTuple = void 0;
  const e = Re(), t = qe(), u = It(), a = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(r) {
      const { schema: n, it: s } = r;
      if (Array.isArray(n))
        return d(r, "additionalItems", n);
      s.items = !0, !(0, t.alwaysValidSchema)(s, n) && r.ok((0, u.validateArray)(r));
    }
  };
  function d(r, n, s = r.schema) {
    const { gen: i, parentSchema: c, data: o, keyword: p, it: h } = r;
    v(c), h.opts.unevaluated && s.length && h.items !== !0 && (h.items = t.mergeEvaluated.items(i, s.length, h.items));
    const y = i.name("valid"), $ = i.const("len", (0, e._)`${o}.length`);
    s.forEach((f, m) => {
      (0, t.alwaysValidSchema)(h, f) || (i.if((0, e._)`${$} > ${m}`, () => r.subschema({
        keyword: p,
        schemaProp: m,
        dataProp: m
      }, y)), r.ok(y));
    });
    function v(f) {
      const { opts: m, errSchemaPath: l } = h, g = s.length, b = g === f.minItems && (g === f.maxItems || f[n] === !1);
      if (m.strictTuples && !b) {
        const S = `"${p}" is ${g}-tuple, but minItems or maxItems/${n} are not specified or different at path "${l}"`;
        (0, t.checkStrictMode)(h, S, m.strictTuples);
      }
    }
  }
  return Cr.validateTuple = d, Cr.default = a, Cr;
}
var gl;
function E0() {
  if (gl) return si;
  gl = 1, Object.defineProperty(si, "__esModule", { value: !0 });
  const e = Cm(), t = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (u) => (0, e.validateTuple)(u, "items")
  };
  return si.default = t, si;
}
var ui = {}, vl;
function b0() {
  if (vl) return ui;
  vl = 1, Object.defineProperty(ui, "__esModule", { value: !0 });
  const e = Re(), t = qe(), u = It(), a = Nm(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: n } }) => (0, e.str)`must NOT have more than ${n} items`,
      params: ({ params: { len: n } }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { schema: s, parentSchema: i, it: c } = n, { prefixItems: o } = i;
      c.items = !0, !(0, t.alwaysValidSchema)(c, s) && (o ? (0, a.validateAdditionalItems)(n, o) : n.ok((0, u.validateArray)(n)));
    }
  };
  return ui.default = r, ui;
}
var ci = {}, _l;
function S0() {
  if (_l) return ci;
  _l = 1, Object.defineProperty(ci, "__esModule", { value: !0 });
  const e = Re(), t = qe(), a = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: d, max: r } }) => r === void 0 ? (0, e.str)`must contain at least ${d} valid item(s)` : (0, e.str)`must contain at least ${d} and no more than ${r} valid item(s)`,
      params: ({ params: { min: d, max: r } }) => r === void 0 ? (0, e._)`{minContains: ${d}}` : (0, e._)`{minContains: ${d}, maxContains: ${r}}`
    },
    code(d) {
      const { gen: r, schema: n, parentSchema: s, data: i, it: c } = d;
      let o, p;
      const { minContains: h, maxContains: y } = s;
      c.opts.next ? (o = h === void 0 ? 1 : h, p = y) : o = 1;
      const $ = r.const("len", (0, e._)`${i}.length`);
      if (d.setParams({ min: o, max: p }), p === void 0 && o === 0) {
        (0, t.checkStrictMode)(c, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (p !== void 0 && o > p) {
        (0, t.checkStrictMode)(c, '"minContains" > "maxContains" is always invalid'), d.fail();
        return;
      }
      if ((0, t.alwaysValidSchema)(c, n)) {
        let g = (0, e._)`${$} >= ${o}`;
        p !== void 0 && (g = (0, e._)`${g} && ${$} <= ${p}`), d.pass(g);
        return;
      }
      c.items = !0;
      const v = r.name("valid");
      p === void 0 && o === 1 ? m(v, () => r.if(v, () => r.break())) : o === 0 ? (r.let(v, !0), p !== void 0 && r.if((0, e._)`${i}.length > 0`, f)) : (r.let(v, !1), f()), d.result(v, () => d.reset());
      function f() {
        const g = r.name("_valid"), b = r.let("count", 0);
        m(g, () => r.if(g, () => l(b)));
      }
      function m(g, b) {
        r.forRange("i", 0, $, (S) => {
          d.subschema({
            keyword: "contains",
            dataProp: S,
            dataPropType: t.Type.Num,
            compositeRule: !0
          }, g), b();
        });
      }
      function l(g) {
        r.code((0, e._)`${g}++`), p === void 0 ? r.if((0, e._)`${g} >= ${o}`, () => r.assign(v, !0).break()) : (r.if((0, e._)`${g} > ${p}`, () => r.assign(v, !1).break()), o === 1 ? r.assign(v, !0) : r.if((0, e._)`${g} >= ${o}`, () => r.assign(v, !0)));
      }
    }
  };
  return ci.default = a, ci;
}
var $o = {}, $l;
function Vu() {
  return $l || ($l = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const t = Re(), u = qe(), a = It();
    e.error = {
      message: ({ params: { property: i, depsCount: c, deps: o } }) => {
        const p = c === 1 ? "property" : "properties";
        return (0, t.str)`must have ${p} ${o} when property ${i} is present`;
      },
      params: ({ params: { property: i, depsCount: c, deps: o, missingProperty: p } }) => (0, t._)`{property: ${i},
    missingProperty: ${p},
    depsCount: ${c},
    deps: ${o}}`
      // TODO change to reference
    };
    const d = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(i) {
        const [c, o] = r(i);
        n(i, c), s(i, o);
      }
    };
    function r({ schema: i }) {
      const c = {}, o = {};
      for (const p in i) {
        if (p === "__proto__")
          continue;
        const h = Array.isArray(i[p]) ? c : o;
        h[p] = i[p];
      }
      return [c, o];
    }
    function n(i, c = i.schema) {
      const { gen: o, data: p, it: h } = i;
      if (Object.keys(c).length === 0)
        return;
      const y = o.let("missing");
      for (const $ in c) {
        const v = c[$];
        if (v.length === 0)
          continue;
        const f = (0, a.propertyInData)(o, p, $, h.opts.ownProperties);
        i.setParams({
          property: $,
          depsCount: v.length,
          deps: v.join(", ")
        }), h.allErrors ? o.if(f, () => {
          for (const m of v)
            (0, a.checkReportMissingProp)(i, m);
        }) : (o.if((0, t._)`${f} && (${(0, a.checkMissingProp)(i, v, y)})`), (0, a.reportMissingProp)(i, y), o.else());
      }
    }
    e.validatePropertyDeps = n;
    function s(i, c = i.schema) {
      const { gen: o, data: p, keyword: h, it: y } = i, $ = o.name("valid");
      for (const v in c)
        (0, u.alwaysValidSchema)(y, c[v]) || (o.if(
          (0, a.propertyInData)(o, p, v, y.opts.ownProperties),
          () => {
            const f = i.subschema({ keyword: h, schemaProp: v }, $);
            i.mergeValidEvaluated(f, $);
          },
          () => o.var($, !0)
          // TODO var
        ), i.ok($));
    }
    e.validateSchemaDeps = s, e.default = d;
  }($o)), $o;
}
var li = {}, wl;
function P0() {
  if (wl) return li;
  wl = 1, Object.defineProperty(li, "__esModule", { value: !0 });
  const e = Re(), t = qe(), a = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: d }) => (0, e._)`{propertyName: ${d.propertyName}}`
    },
    code(d) {
      const { gen: r, schema: n, data: s, it: i } = d;
      if ((0, t.alwaysValidSchema)(i, n))
        return;
      const c = r.name("valid");
      r.forIn("key", s, (o) => {
        d.setParams({ propertyName: o }), d.subschema({
          keyword: "propertyNames",
          data: o,
          dataTypes: ["string"],
          propertyName: o,
          compositeRule: !0
        }, c), r.if((0, e.not)(c), () => {
          d.error(!0), i.allErrors || r.break();
        });
      }), d.ok(c);
    }
  };
  return li.default = a, li;
}
var fi = {}, El;
function Im() {
  if (El) return fi;
  El = 1, Object.defineProperty(fi, "__esModule", { value: !0 });
  const e = It(), t = Re(), u = Ct(), a = qe(), r = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: n }) => (0, t._)`{additionalProperty: ${n.additionalProperty}}`
    },
    code(n) {
      const { gen: s, schema: i, parentSchema: c, data: o, errsCount: p, it: h } = n;
      if (!p)
        throw new Error("ajv implementation error");
      const { allErrors: y, opts: $ } = h;
      if (h.props = !0, $.removeAdditional !== "all" && (0, a.alwaysValidSchema)(h, i))
        return;
      const v = (0, e.allSchemaProperties)(c.properties), f = (0, e.allSchemaProperties)(c.patternProperties);
      m(), n.ok((0, t._)`${p} === ${u.default.errors}`);
      function m() {
        s.forIn("key", o, (_) => {
          !v.length && !f.length ? b(_) : s.if(l(_), () => b(_));
        });
      }
      function l(_) {
        let w;
        if (v.length > 8) {
          const R = (0, a.schemaRefOrVal)(h, c.properties, "properties");
          w = (0, e.isOwnProperty)(s, R, _);
        } else v.length ? w = (0, t.or)(...v.map((R) => (0, t._)`${_} === ${R}`)) : w = t.nil;
        return f.length && (w = (0, t.or)(w, ...f.map((R) => (0, t._)`${(0, e.usePattern)(n, R)}.test(${_})`))), (0, t.not)(w);
      }
      function g(_) {
        s.code((0, t._)`delete ${o}[${_}]`);
      }
      function b(_) {
        if ($.removeAdditional === "all" || $.removeAdditional && i === !1) {
          g(_);
          return;
        }
        if (i === !1) {
          n.setParams({ additionalProperty: _ }), n.error(), y || s.break();
          return;
        }
        if (typeof i == "object" && !(0, a.alwaysValidSchema)(h, i)) {
          const w = s.name("valid");
          $.removeAdditional === "failing" ? (S(_, w, !1), s.if((0, t.not)(w), () => {
            n.reset(), g(_);
          })) : (S(_, w), y || s.if((0, t.not)(w), () => s.break()));
        }
      }
      function S(_, w, R) {
        const T = {
          keyword: "additionalProperties",
          dataProp: _,
          dataPropType: a.Type.Str
        };
        R === !1 && Object.assign(T, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), n.subschema(T, w);
      }
    }
  };
  return fi.default = r, fi;
}
var di = {}, bl;
function R0() {
  if (bl) return di;
  bl = 1, Object.defineProperty(di, "__esModule", { value: !0 });
  const e = Ga(), t = It(), u = qe(), a = Im(), d = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(r) {
      const { gen: n, schema: s, parentSchema: i, data: c, it: o } = r;
      o.opts.removeAdditional === "all" && i.additionalProperties === void 0 && a.default.code(new e.KeywordCxt(o, a.default, "additionalProperties"));
      const p = (0, t.allSchemaProperties)(s);
      for (const f of p)
        o.definedProperties.add(f);
      o.opts.unevaluated && p.length && o.props !== !0 && (o.props = u.mergeEvaluated.props(n, (0, u.toHash)(p), o.props));
      const h = p.filter((f) => !(0, u.alwaysValidSchema)(o, s[f]));
      if (h.length === 0)
        return;
      const y = n.name("valid");
      for (const f of h)
        $(f) ? v(f) : (n.if((0, t.propertyInData)(n, c, f, o.opts.ownProperties)), v(f), o.allErrors || n.else().var(y, !0), n.endIf()), r.it.definedProperties.add(f), r.ok(y);
      function $(f) {
        return o.opts.useDefaults && !o.compositeRule && s[f].default !== void 0;
      }
      function v(f) {
        r.subschema({
          keyword: "properties",
          schemaProp: f,
          dataProp: f
        }, y);
      }
    }
  };
  return di.default = d, di;
}
var hi = {}, Sl;
function T0() {
  if (Sl) return hi;
  Sl = 1, Object.defineProperty(hi, "__esModule", { value: !0 });
  const e = It(), t = Re(), u = qe(), a = qe(), d = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(r) {
      const { gen: n, schema: s, data: i, parentSchema: c, it: o } = r, { opts: p } = o, h = (0, e.allSchemaProperties)(s), y = h.filter((b) => (0, u.alwaysValidSchema)(o, s[b]));
      if (h.length === 0 || y.length === h.length && (!o.opts.unevaluated || o.props === !0))
        return;
      const $ = p.strictSchema && !p.allowMatchingProperties && c.properties, v = n.name("valid");
      o.props !== !0 && !(o.props instanceof t.Name) && (o.props = (0, a.evaluatedPropsToName)(n, o.props));
      const { props: f } = o;
      m();
      function m() {
        for (const b of h)
          $ && l(b), o.allErrors ? g(b) : (n.var(v, !0), g(b), n.if(v));
      }
      function l(b) {
        for (const S in $)
          new RegExp(b).test(S) && (0, u.checkStrictMode)(o, `property ${S} matches pattern ${b} (use allowMatchingProperties)`);
      }
      function g(b) {
        n.forIn("key", i, (S) => {
          n.if((0, t._)`${(0, e.usePattern)(r, b)}.test(${S})`, () => {
            const _ = y.includes(b);
            _ || r.subschema({
              keyword: "patternProperties",
              schemaProp: b,
              dataProp: S,
              dataPropType: a.Type.Str
            }, v), o.opts.unevaluated && f !== !0 ? n.assign((0, t._)`${f}[${S}]`, !0) : !_ && !o.allErrors && n.if((0, t.not)(v), () => n.break());
          });
        });
      }
    }
  };
  return hi.default = d, hi;
}
var pi = {}, Pl;
function O0() {
  if (Pl) return pi;
  Pl = 1, Object.defineProperty(pi, "__esModule", { value: !0 });
  const e = qe(), t = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(u) {
      const { gen: a, schema: d, it: r } = u;
      if ((0, e.alwaysValidSchema)(r, d)) {
        u.fail();
        return;
      }
      const n = a.name("valid");
      u.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, n), u.failResult(n, () => u.reset(), () => u.error());
    },
    error: { message: "must NOT be valid" }
  };
  return pi.default = t, pi;
}
var mi = {}, Rl;
function A0() {
  if (Rl) return mi;
  Rl = 1, Object.defineProperty(mi, "__esModule", { value: !0 });
  const t = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: It().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return mi.default = t, mi;
}
var yi = {}, Tl;
function N0() {
  if (Tl) return yi;
  Tl = 1, Object.defineProperty(yi, "__esModule", { value: !0 });
  const e = Re(), t = qe(), a = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: d }) => (0, e._)`{passingSchemas: ${d.passing}}`
    },
    code(d) {
      const { gen: r, schema: n, parentSchema: s, it: i } = d;
      if (!Array.isArray(n))
        throw new Error("ajv implementation error");
      if (i.opts.discriminator && s.discriminator)
        return;
      const c = n, o = r.let("valid", !1), p = r.let("passing", null), h = r.name("_valid");
      d.setParams({ passing: p }), r.block(y), d.result(o, () => d.reset(), () => d.error(!0));
      function y() {
        c.forEach(($, v) => {
          let f;
          (0, t.alwaysValidSchema)(i, $) ? r.var(h, !0) : f = d.subschema({
            keyword: "oneOf",
            schemaProp: v,
            compositeRule: !0
          }, h), v > 0 && r.if((0, e._)`${h} && ${o}`).assign(o, !1).assign(p, (0, e._)`[${p}, ${v}]`).else(), r.if(h, () => {
            r.assign(o, !0), r.assign(p, v), f && d.mergeEvaluated(f, e.Name);
          });
        });
      }
    }
  };
  return yi.default = a, yi;
}
var gi = {}, Ol;
function C0() {
  if (Ol) return gi;
  Ol = 1, Object.defineProperty(gi, "__esModule", { value: !0 });
  const e = qe(), t = {
    keyword: "allOf",
    schemaType: "array",
    code(u) {
      const { gen: a, schema: d, it: r } = u;
      if (!Array.isArray(d))
        throw new Error("ajv implementation error");
      const n = a.name("valid");
      d.forEach((s, i) => {
        if ((0, e.alwaysValidSchema)(r, s))
          return;
        const c = u.subschema({ keyword: "allOf", schemaProp: i }, n);
        u.ok(n), u.mergeEvaluated(c);
      });
    }
  };
  return gi.default = t, gi;
}
var vi = {}, Al;
function I0() {
  if (Al) return vi;
  Al = 1, Object.defineProperty(vi, "__esModule", { value: !0 });
  const e = Re(), t = qe(), a = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: r }) => (0, e.str)`must match "${r.ifClause}" schema`,
      params: ({ params: r }) => (0, e._)`{failingKeyword: ${r.ifClause}}`
    },
    code(r) {
      const { gen: n, parentSchema: s, it: i } = r;
      s.then === void 0 && s.else === void 0 && (0, t.checkStrictMode)(i, '"if" without "then" and "else" is ignored');
      const c = d(i, "then"), o = d(i, "else");
      if (!c && !o)
        return;
      const p = n.let("valid", !0), h = n.name("_valid");
      if (y(), r.reset(), c && o) {
        const v = n.let("ifClause");
        r.setParams({ ifClause: v }), n.if(h, $("then", v), $("else", v));
      } else c ? n.if(h, $("then")) : n.if((0, e.not)(h), $("else"));
      r.pass(p, () => r.error(!0));
      function y() {
        const v = r.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, h);
        r.mergeEvaluated(v);
      }
      function $(v, f) {
        return () => {
          const m = r.subschema({ keyword: v }, h);
          n.assign(p, h), r.mergeValidEvaluated(m, p), f ? n.assign(f, (0, e._)`${v}`) : r.setParams({ ifClause: v });
        };
      }
    }
  };
  function d(r, n) {
    const s = r.schema[n];
    return s !== void 0 && !(0, t.alwaysValidSchema)(r, s);
  }
  return vi.default = a, vi;
}
var _i = {}, Nl;
function D0() {
  if (Nl) return _i;
  Nl = 1, Object.defineProperty(_i, "__esModule", { value: !0 });
  const e = qe(), t = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: u, parentSchema: a, it: d }) {
      a.if === void 0 && (0, e.checkStrictMode)(d, `"${u}" without "if" is ignored`);
    }
  };
  return _i.default = t, _i;
}
var Cl;
function k0() {
  if (Cl) return oi;
  Cl = 1, Object.defineProperty(oi, "__esModule", { value: !0 });
  const e = Nm(), t = E0(), u = Cm(), a = b0(), d = S0(), r = Vu(), n = P0(), s = Im(), i = R0(), c = T0(), o = O0(), p = A0(), h = N0(), y = C0(), $ = I0(), v = D0();
  function f(m = !1) {
    const l = [
      // any
      o.default,
      p.default,
      h.default,
      y.default,
      $.default,
      v.default,
      // object
      n.default,
      s.default,
      r.default,
      i.default,
      c.default
    ];
    return m ? l.push(t.default, a.default) : l.push(e.default, u.default), l.push(d.default), l;
  }
  return oi.default = f, oi;
}
var $i = {}, Ir = {}, Il;
function Dm() {
  if (Il) return Ir;
  Il = 1, Object.defineProperty(Ir, "__esModule", { value: !0 }), Ir.dynamicAnchor = void 0;
  const e = Re(), t = Ct(), u = Ka(), a = Mu(), d = {
    keyword: "$dynamicAnchor",
    schemaType: "string",
    code: (s) => r(s, s.schema)
  };
  function r(s, i) {
    const { gen: c, it: o } = s;
    o.schemaEnv.root.dynamicAnchors[i] = !0;
    const p = (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(i)}`, h = o.errSchemaPath === "#" ? o.validateName : n(s);
    c.if((0, e._)`!${p}`, () => c.assign(p, h));
  }
  Ir.dynamicAnchor = r;
  function n(s) {
    const { schemaEnv: i, schema: c, self: o } = s.it, { root: p, baseId: h, localRefs: y, meta: $ } = i.root, { schemaId: v } = o.opts, f = new u.SchemaEnv({ schema: c, schemaId: v, root: p, baseId: h, localRefs: y, meta: $ });
    return u.compileSchema.call(o, f), (0, a.getValidate)(s, f);
  }
  return Ir.default = d, Ir;
}
var Dr = {}, Dl;
function km() {
  if (Dl) return Dr;
  Dl = 1, Object.defineProperty(Dr, "__esModule", { value: !0 }), Dr.dynamicRef = void 0;
  const e = Re(), t = Ct(), u = Mu(), a = {
    keyword: "$dynamicRef",
    schemaType: "string",
    code: (r) => d(r, r.schema)
  };
  function d(r, n) {
    const { gen: s, keyword: i, it: c } = r;
    if (n[0] !== "#")
      throw new Error(`"${i}" only supports hash fragment reference`);
    const o = n.slice(1);
    if (c.allErrors)
      p();
    else {
      const y = s.let("valid", !1);
      p(y), r.ok(y);
    }
    function p(y) {
      if (c.schemaEnv.root.dynamicAnchors[o]) {
        const $ = s.let("_v", (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(o)}`);
        s.if($, h($, y), h(c.validateName, y));
      } else
        h(c.validateName, y)();
    }
    function h(y, $) {
      return $ ? () => s.block(() => {
        (0, u.callRef)(r, y), s.let($, !0);
      }) : () => (0, u.callRef)(r, y);
    }
  }
  return Dr.dynamicRef = d, Dr.default = a, Dr;
}
var wi = {}, kl;
function q0() {
  if (kl) return wi;
  kl = 1, Object.defineProperty(wi, "__esModule", { value: !0 });
  const e = Dm(), t = qe(), u = {
    keyword: "$recursiveAnchor",
    schemaType: "boolean",
    code(a) {
      a.schema ? (0, e.dynamicAnchor)(a, "") : (0, t.checkStrictMode)(a.it, "$recursiveAnchor: false is ignored");
    }
  };
  return wi.default = u, wi;
}
var Ei = {}, ql;
function F0() {
  if (ql) return Ei;
  ql = 1, Object.defineProperty(Ei, "__esModule", { value: !0 });
  const e = km(), t = {
    keyword: "$recursiveRef",
    schemaType: "string",
    code: (u) => (0, e.dynamicRef)(u, u.schema)
  };
  return Ei.default = t, Ei;
}
var Fl;
function j0() {
  if (Fl) return $i;
  Fl = 1, Object.defineProperty($i, "__esModule", { value: !0 });
  const e = Dm(), t = km(), u = q0(), a = F0(), d = [e.default, t.default, u.default, a.default];
  return $i.default = d, $i;
}
var bi = {}, Si = {}, jl;
function U0() {
  if (jl) return Si;
  jl = 1, Object.defineProperty(Si, "__esModule", { value: !0 });
  const e = Vu(), t = {
    keyword: "dependentRequired",
    type: "object",
    schemaType: "object",
    error: e.error,
    code: (u) => (0, e.validatePropertyDeps)(u)
  };
  return Si.default = t, Si;
}
var Pi = {}, Ul;
function L0() {
  if (Ul) return Pi;
  Ul = 1, Object.defineProperty(Pi, "__esModule", { value: !0 });
  const e = Vu(), t = {
    keyword: "dependentSchemas",
    type: "object",
    schemaType: "object",
    code: (u) => (0, e.validateSchemaDeps)(u)
  };
  return Pi.default = t, Pi;
}
var Ri = {}, Ll;
function M0() {
  if (Ll) return Ri;
  Ll = 1, Object.defineProperty(Ri, "__esModule", { value: !0 });
  const e = qe(), t = {
    keyword: ["maxContains", "minContains"],
    type: "array",
    schemaType: "number",
    code({ keyword: u, parentSchema: a, it: d }) {
      a.contains === void 0 && (0, e.checkStrictMode)(d, `"${u}" without "contains" is ignored`);
    }
  };
  return Ri.default = t, Ri;
}
var Ml;
function x0() {
  if (Ml) return bi;
  Ml = 1, Object.defineProperty(bi, "__esModule", { value: !0 });
  const e = U0(), t = L0(), u = M0(), a = [e.default, t.default, u.default];
  return bi.default = a, bi;
}
var Ti = {}, Oi = {}, xl;
function V0() {
  if (xl) return Oi;
  xl = 1, Object.defineProperty(Oi, "__esModule", { value: !0 });
  const e = Re(), t = qe(), u = Ct(), d = {
    keyword: "unevaluatedProperties",
    type: "object",
    schemaType: ["boolean", "object"],
    trackErrors: !0,
    error: {
      message: "must NOT have unevaluated properties",
      params: ({ params: r }) => (0, e._)`{unevaluatedProperty: ${r.unevaluatedProperty}}`
    },
    code(r) {
      const { gen: n, schema: s, data: i, errsCount: c, it: o } = r;
      if (!c)
        throw new Error("ajv implementation error");
      const { allErrors: p, props: h } = o;
      h instanceof e.Name ? n.if((0, e._)`${h} !== true`, () => n.forIn("key", i, (f) => n.if($(h, f), () => y(f)))) : h !== !0 && n.forIn("key", i, (f) => h === void 0 ? y(f) : n.if(v(h, f), () => y(f))), o.props = !0, r.ok((0, e._)`${c} === ${u.default.errors}`);
      function y(f) {
        if (s === !1) {
          r.setParams({ unevaluatedProperty: f }), r.error(), p || n.break();
          return;
        }
        if (!(0, t.alwaysValidSchema)(o, s)) {
          const m = n.name("valid");
          r.subschema({
            keyword: "unevaluatedProperties",
            dataProp: f,
            dataPropType: t.Type.Str
          }, m), p || n.if((0, e.not)(m), () => n.break());
        }
      }
      function $(f, m) {
        return (0, e._)`!${f} || !${f}[${m}]`;
      }
      function v(f, m) {
        const l = [];
        for (const g in f)
          f[g] === !0 && l.push((0, e._)`${m} !== ${g}`);
        return (0, e.and)(...l);
      }
    }
  };
  return Oi.default = d, Oi;
}
var Ai = {}, Vl;
function B0() {
  if (Vl) return Ai;
  Vl = 1, Object.defineProperty(Ai, "__esModule", { value: !0 });
  const e = Re(), t = qe(), a = {
    keyword: "unevaluatedItems",
    type: "array",
    schemaType: ["boolean", "object"],
    error: {
      message: ({ params: { len: d } }) => (0, e.str)`must NOT have more than ${d} items`,
      params: ({ params: { len: d } }) => (0, e._)`{limit: ${d}}`
    },
    code(d) {
      const { gen: r, schema: n, data: s, it: i } = d, c = i.items || 0;
      if (c === !0)
        return;
      const o = r.const("len", (0, e._)`${s}.length`);
      if (n === !1)
        d.setParams({ len: c }), d.fail((0, e._)`${o} > ${c}`);
      else if (typeof n == "object" && !(0, t.alwaysValidSchema)(i, n)) {
        const h = r.var("valid", (0, e._)`${o} <= ${c}`);
        r.if((0, e.not)(h), () => p(h, c)), d.ok(h);
      }
      i.items = !0;
      function p(h, y) {
        r.forRange("i", y, o, ($) => {
          d.subschema({ keyword: "unevaluatedItems", dataProp: $, dataPropType: t.Type.Num }, h), i.allErrors || r.if((0, e.not)(h), () => r.break());
        });
      }
    }
  };
  return Ai.default = a, Ai;
}
var Bl;
function H0() {
  if (Bl) return Ti;
  Bl = 1, Object.defineProperty(Ti, "__esModule", { value: !0 });
  const e = V0(), t = B0(), u = [e.default, t.default];
  return Ti.default = u, Ti;
}
var Ni = {}, Ci = {}, Hl;
function G0() {
  if (Hl) return Ci;
  Hl = 1, Object.defineProperty(Ci, "__esModule", { value: !0 });
  const e = Re(), u = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: a }) => (0, e.str)`must match format "${a}"`,
      params: ({ schemaCode: a }) => (0, e._)`{format: ${a}}`
    },
    code(a, d) {
      const { gen: r, data: n, $data: s, schema: i, schemaCode: c, it: o } = a, { opts: p, errSchemaPath: h, schemaEnv: y, self: $ } = o;
      if (!p.validateFormats)
        return;
      s ? v() : f();
      function v() {
        const m = r.scopeValue("formats", {
          ref: $.formats,
          code: p.code.formats
        }), l = r.const("fDef", (0, e._)`${m}[${c}]`), g = r.let("fType"), b = r.let("format");
        r.if((0, e._)`typeof ${l} == "object" && !(${l} instanceof RegExp)`, () => r.assign(g, (0, e._)`${l}.type || "string"`).assign(b, (0, e._)`${l}.validate`), () => r.assign(g, (0, e._)`"string"`).assign(b, l)), a.fail$data((0, e.or)(S(), _()));
        function S() {
          return p.strictSchema === !1 ? e.nil : (0, e._)`${c} && !${b}`;
        }
        function _() {
          const w = y.$async ? (0, e._)`(${l}.async ? await ${b}(${n}) : ${b}(${n}))` : (0, e._)`${b}(${n})`, R = (0, e._)`(typeof ${b} == "function" ? ${w} : ${b}.test(${n}))`;
          return (0, e._)`${b} && ${b} !== true && ${g} === ${d} && !${R}`;
        }
      }
      function f() {
        const m = $.formats[i];
        if (!m) {
          S();
          return;
        }
        if (m === !0)
          return;
        const [l, g, b] = _(m);
        l === d && a.pass(w());
        function S() {
          if (p.strictSchema === !1) {
            $.logger.warn(R());
            return;
          }
          throw new Error(R());
          function R() {
            return `unknown format "${i}" ignored in schema at path "${h}"`;
          }
        }
        function _(R) {
          const T = R instanceof RegExp ? (0, e.regexpCode)(R) : p.code.formats ? (0, e._)`${p.code.formats}${(0, e.getProperty)(i)}` : void 0, M = r.scopeValue("formats", { key: i, ref: R, code: T });
          return typeof R == "object" && !(R instanceof RegExp) ? [R.type || "string", R.validate, (0, e._)`${M}.validate`] : ["string", R, M];
        }
        function w() {
          if (typeof m == "object" && !(m instanceof RegExp) && m.async) {
            if (!y.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${b}(${n})`;
          }
          return typeof g == "function" ? (0, e._)`${b}(${n})` : (0, e._)`${b}.test(${n})`;
        }
      }
    }
  };
  return Ci.default = u, Ci;
}
var Gl;
function z0() {
  if (Gl) return Ni;
  Gl = 1, Object.defineProperty(Ni, "__esModule", { value: !0 });
  const t = [G0().default];
  return Ni.default = t, Ni;
}
var mr = {}, zl;
function K0() {
  return zl || (zl = 1, Object.defineProperty(mr, "__esModule", { value: !0 }), mr.contentVocabulary = mr.metadataVocabulary = void 0, mr.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], mr.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), mr;
}
var Kl;
function W0() {
  if (Kl) return Hn;
  Kl = 1, Object.defineProperty(Hn, "__esModule", { value: !0 });
  const e = c0(), t = w0(), u = k0(), a = j0(), d = x0(), r = H0(), n = z0(), s = K0(), i = [
    a.default,
    e.default,
    t.default,
    (0, u.default)(!0),
    n.default,
    s.metadataVocabulary,
    s.contentVocabulary,
    d.default,
    r.default
  ];
  return Hn.default = i, Hn;
}
var Ii = {}, Zr = {}, Wl;
function Y0() {
  if (Wl) return Zr;
  Wl = 1, Object.defineProperty(Zr, "__esModule", { value: !0 }), Zr.DiscrError = void 0;
  var e;
  return function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  }(e || (Zr.DiscrError = e = {})), Zr;
}
var Yl;
function J0() {
  if (Yl) return Ii;
  Yl = 1, Object.defineProperty(Ii, "__esModule", { value: !0 });
  const e = Re(), t = Y0(), u = Ka(), a = za(), d = qe(), n = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: s, tagName: i } }) => s === t.DiscrError.Tag ? `tag "${i}" must be string` : `value of tag "${i}" must be in oneOf`,
      params: ({ params: { discrError: s, tag: i, tagName: c } }) => (0, e._)`{error: ${s}, tag: ${c}, tagValue: ${i}}`
    },
    code(s) {
      const { gen: i, data: c, schema: o, parentSchema: p, it: h } = s, { oneOf: y } = p;
      if (!h.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const $ = o.propertyName;
      if (typeof $ != "string")
        throw new Error("discriminator: requires propertyName");
      if (o.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!y)
        throw new Error("discriminator: requires oneOf keyword");
      const v = i.let("valid", !1), f = i.const("tag", (0, e._)`${c}${(0, e.getProperty)($)}`);
      i.if((0, e._)`typeof ${f} == "string"`, () => m(), () => s.error(!1, { discrError: t.DiscrError.Tag, tag: f, tagName: $ })), s.ok(v);
      function m() {
        const b = g();
        i.if(!1);
        for (const S in b)
          i.elseIf((0, e._)`${f} === ${S}`), i.assign(v, l(b[S]));
        i.else(), s.error(!1, { discrError: t.DiscrError.Mapping, tag: f, tagName: $ }), i.endIf();
      }
      function l(b) {
        const S = i.name("valid"), _ = s.subschema({ keyword: "oneOf", schemaProp: b }, S);
        return s.mergeEvaluated(_, e.Name), S;
      }
      function g() {
        var b;
        const S = {}, _ = R(p);
        let w = !0;
        for (let F = 0; F < y.length; F++) {
          let j = y[F];
          if (j?.$ref && !(0, d.schemaHasRulesButRef)(j, h.self.RULES)) {
            const U = j.$ref;
            if (j = u.resolveRef.call(h.self, h.schemaEnv.root, h.baseId, U), j instanceof u.SchemaEnv && (j = j.schema), j === void 0)
              throw new a.default(h.opts.uriResolver, h.baseId, U);
          }
          const V = (b = j?.properties) === null || b === void 0 ? void 0 : b[$];
          if (typeof V != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${$}"`);
          w = w && (_ || R(j)), T(V, F);
        }
        if (!w)
          throw new Error(`discriminator: "${$}" must be required`);
        return S;
        function R({ required: F }) {
          return Array.isArray(F) && F.includes($);
        }
        function T(F, j) {
          if (F.const)
            M(F.const, j);
          else if (F.enum)
            for (const V of F.enum)
              M(V, j);
          else
            throw new Error(`discriminator: "properties/${$}" must have "const" or "enum"`);
        }
        function M(F, j) {
          if (typeof F != "string" || F in S)
            throw new Error(`discriminator: "${$}" values must be unique strings`);
          S[F] = j;
        }
      }
    }
  };
  return Ii.default = n, Ii;
}
var Di = {};
const X0 = "https://json-schema.org/draft/2020-12/schema", Q0 = "https://json-schema.org/draft/2020-12/schema", Z0 = { "https://json-schema.org/draft/2020-12/vocab/core": !0, "https://json-schema.org/draft/2020-12/vocab/applicator": !0, "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0, "https://json-schema.org/draft/2020-12/vocab/validation": !0, "https://json-schema.org/draft/2020-12/vocab/meta-data": !0, "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0, "https://json-schema.org/draft/2020-12/vocab/content": !0 }, ev = "meta", tv = "Core and Validation specifications meta-schema", rv = [{ $ref: "meta/core" }, { $ref: "meta/applicator" }, { $ref: "meta/unevaluated" }, { $ref: "meta/validation" }, { $ref: "meta/meta-data" }, { $ref: "meta/format-annotation" }, { $ref: "meta/content" }], nv = ["object", "boolean"], iv = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", av = { definitions: { $comment: '"definitions" has been replaced by "$defs".', type: "object", additionalProperties: { $dynamicRef: "#meta" }, deprecated: !0, default: {} }, dependencies: { $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.', type: "object", additionalProperties: { anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }] }, deprecated: !0, default: {} }, $recursiveAnchor: { $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".', $ref: "meta/core#/$defs/anchorString", deprecated: !0 }, $recursiveRef: { $comment: '"$recursiveRef" has been replaced by "$dynamicRef".', $ref: "meta/core#/$defs/uriReferenceString", deprecated: !0 } }, ov = {
  $schema: X0,
  $id: Q0,
  $vocabulary: Z0,
  $dynamicAnchor: ev,
  title: tv,
  allOf: rv,
  type: nv,
  $comment: iv,
  properties: av
}, sv = "https://json-schema.org/draft/2020-12/schema", uv = "https://json-schema.org/draft/2020-12/meta/applicator", cv = { "https://json-schema.org/draft/2020-12/vocab/applicator": !0 }, lv = "meta", fv = "Applicator vocabulary meta-schema", dv = ["object", "boolean"], hv = { prefixItems: { $ref: "#/$defs/schemaArray" }, items: { $dynamicRef: "#meta" }, contains: { $dynamicRef: "#meta" }, additionalProperties: { $dynamicRef: "#meta" }, properties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, propertyNames: { format: "regex" }, default: {} }, dependentSchemas: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, propertyNames: { $dynamicRef: "#meta" }, if: { $dynamicRef: "#meta" }, then: { $dynamicRef: "#meta" }, else: { $dynamicRef: "#meta" }, allOf: { $ref: "#/$defs/schemaArray" }, anyOf: { $ref: "#/$defs/schemaArray" }, oneOf: { $ref: "#/$defs/schemaArray" }, not: { $dynamicRef: "#meta" } }, pv = { schemaArray: { type: "array", minItems: 1, items: { $dynamicRef: "#meta" } } }, mv = {
  $schema: sv,
  $id: uv,
  $vocabulary: cv,
  $dynamicAnchor: lv,
  title: fv,
  type: dv,
  properties: hv,
  $defs: pv
}, yv = "https://json-schema.org/draft/2020-12/schema", gv = "https://json-schema.org/draft/2020-12/meta/unevaluated", vv = { "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0 }, _v = "meta", $v = "Unevaluated applicator vocabulary meta-schema", wv = ["object", "boolean"], Ev = { unevaluatedItems: { $dynamicRef: "#meta" }, unevaluatedProperties: { $dynamicRef: "#meta" } }, bv = {
  $schema: yv,
  $id: gv,
  $vocabulary: vv,
  $dynamicAnchor: _v,
  title: $v,
  type: wv,
  properties: Ev
}, Sv = "https://json-schema.org/draft/2020-12/schema", Pv = "https://json-schema.org/draft/2020-12/meta/content", Rv = { "https://json-schema.org/draft/2020-12/vocab/content": !0 }, Tv = "meta", Ov = "Content vocabulary meta-schema", Av = ["object", "boolean"], Nv = { contentEncoding: { type: "string" }, contentMediaType: { type: "string" }, contentSchema: { $dynamicRef: "#meta" } }, Cv = {
  $schema: Sv,
  $id: Pv,
  $vocabulary: Rv,
  $dynamicAnchor: Tv,
  title: Ov,
  type: Av,
  properties: Nv
}, Iv = "https://json-schema.org/draft/2020-12/schema", Dv = "https://json-schema.org/draft/2020-12/meta/core", kv = { "https://json-schema.org/draft/2020-12/vocab/core": !0 }, qv = "meta", Fv = "Core vocabulary meta-schema", jv = ["object", "boolean"], Uv = { $id: { $ref: "#/$defs/uriReferenceString", $comment: "Non-empty fragments not allowed.", pattern: "^[^#]*#?$" }, $schema: { $ref: "#/$defs/uriString" }, $ref: { $ref: "#/$defs/uriReferenceString" }, $anchor: { $ref: "#/$defs/anchorString" }, $dynamicRef: { $ref: "#/$defs/uriReferenceString" }, $dynamicAnchor: { $ref: "#/$defs/anchorString" }, $vocabulary: { type: "object", propertyNames: { $ref: "#/$defs/uriString" }, additionalProperties: { type: "boolean" } }, $comment: { type: "string" }, $defs: { type: "object", additionalProperties: { $dynamicRef: "#meta" } } }, Lv = { anchorString: { type: "string", pattern: "^[A-Za-z_][-A-Za-z0-9._]*$" }, uriString: { type: "string", format: "uri" }, uriReferenceString: { type: "string", format: "uri-reference" } }, Mv = {
  $schema: Iv,
  $id: Dv,
  $vocabulary: kv,
  $dynamicAnchor: qv,
  title: Fv,
  type: jv,
  properties: Uv,
  $defs: Lv
}, xv = "https://json-schema.org/draft/2020-12/schema", Vv = "https://json-schema.org/draft/2020-12/meta/format-annotation", Bv = { "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0 }, Hv = "meta", Gv = "Format vocabulary meta-schema for annotation results", zv = ["object", "boolean"], Kv = { format: { type: "string" } }, Wv = {
  $schema: xv,
  $id: Vv,
  $vocabulary: Bv,
  $dynamicAnchor: Hv,
  title: Gv,
  type: zv,
  properties: Kv
}, Yv = "https://json-schema.org/draft/2020-12/schema", Jv = "https://json-schema.org/draft/2020-12/meta/meta-data", Xv = { "https://json-schema.org/draft/2020-12/vocab/meta-data": !0 }, Qv = "meta", Zv = "Meta-data vocabulary meta-schema", e_ = ["object", "boolean"], t_ = { title: { type: "string" }, description: { type: "string" }, default: !0, deprecated: { type: "boolean", default: !1 }, readOnly: { type: "boolean", default: !1 }, writeOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 } }, r_ = {
  $schema: Yv,
  $id: Jv,
  $vocabulary: Xv,
  $dynamicAnchor: Qv,
  title: Zv,
  type: e_,
  properties: t_
}, n_ = "https://json-schema.org/draft/2020-12/schema", i_ = "https://json-schema.org/draft/2020-12/meta/validation", a_ = { "https://json-schema.org/draft/2020-12/vocab/validation": !0 }, o_ = "meta", s_ = "Validation vocabulary meta-schema", u_ = ["object", "boolean"], c_ = { type: { anyOf: [{ $ref: "#/$defs/simpleTypes" }, { type: "array", items: { $ref: "#/$defs/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, const: !0, enum: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/$defs/nonNegativeInteger" }, minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, maxItems: { $ref: "#/$defs/nonNegativeInteger" }, minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, maxContains: { $ref: "#/$defs/nonNegativeInteger" }, minContains: { $ref: "#/$defs/nonNegativeInteger", default: 1 }, maxProperties: { $ref: "#/$defs/nonNegativeInteger" }, minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, required: { $ref: "#/$defs/stringArray" }, dependentRequired: { type: "object", additionalProperties: { $ref: "#/$defs/stringArray" } } }, l_ = { nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { $ref: "#/$defs/nonNegativeInteger", default: 0 }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, f_ = {
  $schema: n_,
  $id: i_,
  $vocabulary: a_,
  $dynamicAnchor: o_,
  title: s_,
  type: u_,
  properties: c_,
  $defs: l_
};
var Jl;
function d_() {
  if (Jl) return Di;
  Jl = 1, Object.defineProperty(Di, "__esModule", { value: !0 });
  const e = ov, t = mv, u = bv, a = Cv, d = Mv, r = Wv, n = r_, s = f_, i = ["/properties"];
  function c(o) {
    return [
      e,
      t,
      u,
      a,
      d,
      p(this, r),
      n,
      p(this, s)
    ].forEach((h) => this.addMetaSchema(h, void 0, !1)), this;
    function p(h, y) {
      return o ? h.$dataMetaSchema(y, i) : y;
    }
  }
  return Di.default = c, Di;
}
var Xl;
function h_() {
  return Xl || (Xl = 1, function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
    const u = s0(), a = W0(), d = J0(), r = d_(), n = "https://json-schema.org/draft/2020-12/schema";
    class s extends u.default {
      constructor(y = {}) {
        super({
          ...y,
          dynamicRef: !0,
          next: !0,
          unevaluated: !0
        });
      }
      _addVocabularies() {
        super._addVocabularies(), a.default.forEach((y) => this.addVocabulary(y)), this.opts.discriminator && this.addKeyword(d.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data: y, meta: $ } = this.opts;
        $ && (r.default.call(this, y), this.refs["http://json-schema.org/schema"] = n);
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(n) ? n : void 0);
      }
    }
    t.Ajv2020 = s, e.exports = t = s, e.exports.Ajv2020 = s, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = s;
    var i = Ga();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return i.KeywordCxt;
    } });
    var c = Re();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return c._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return c.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return c.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return c.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return c.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return c.CodeGen;
    } });
    var o = Lu();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return o.default;
    } });
    var p = za();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return p.default;
    } });
  }(Ln, Ln.exports)), Ln.exports;
}
var p_ = h_(), ki = { exports: {} }, wo = {}, Ql;
function m_() {
  return Ql || (Ql = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
    function t(F, j) {
      return { validate: F, compare: j };
    }
    e.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: t(r, n),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: t(i(!0), c),
      "date-time": t(h(!0), y),
      "iso-time": t(i(), o),
      "iso-date-time": t(h(), $),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri: m,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex: M,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte: g,
      // signed 32 bit integer
      int32: { type: "number", validate: _ },
      // signed 64 bit integer
      int64: { type: "number", validate: w },
      // C-type float
      float: { type: "number", validate: R },
      // C-type double
      double: { type: "number", validate: R },
      // hint to the UI to hide input strings
      password: !0,
      // unchecked string payload
      binary: !0
    }, e.fastFormats = {
      ...e.fullFormats,
      date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, n),
      time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, c),
      "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, y),
      "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, o),
      "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, $),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    }, e.formatNames = Object.keys(e.fullFormats);
    function u(F) {
      return F % 4 === 0 && (F % 100 !== 0 || F % 400 === 0);
    }
    const a = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, d = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function r(F) {
      const j = a.exec(F);
      if (!j)
        return !1;
      const V = +j[1], U = +j[2], z = +j[3];
      return U >= 1 && U <= 12 && z >= 1 && z <= (U === 2 && u(V) ? 29 : d[U]);
    }
    function n(F, j) {
      if (F && j)
        return F > j ? 1 : F < j ? -1 : 0;
    }
    const s = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function i(F) {
      return function(V) {
        const U = s.exec(V);
        if (!U)
          return !1;
        const z = +U[1], W = +U[2], Q = +U[3], ee = U[4], ne = U[5] === "-" ? -1 : 1, K = +(U[6] || 0), I = +(U[7] || 0);
        if (K > 23 || I > 59 || F && !ee)
          return !1;
        if (z <= 23 && W <= 59 && Q < 60)
          return !0;
        const G = W - I * ne, D = z - K * ne - (G < 0 ? 1 : 0);
        return (D === 23 || D === -1) && (G === 59 || G === -1) && Q < 61;
      };
    }
    function c(F, j) {
      if (!(F && j))
        return;
      const V = (/* @__PURE__ */ new Date("2020-01-01T" + F)).valueOf(), U = (/* @__PURE__ */ new Date("2020-01-01T" + j)).valueOf();
      if (V && U)
        return V - U;
    }
    function o(F, j) {
      if (!(F && j))
        return;
      const V = s.exec(F), U = s.exec(j);
      if (V && U)
        return F = V[1] + V[2] + V[3], j = U[1] + U[2] + U[3], F > j ? 1 : F < j ? -1 : 0;
    }
    const p = /t|\s/i;
    function h(F) {
      const j = i(F);
      return function(U) {
        const z = U.split(p);
        return z.length === 2 && r(z[0]) && j(z[1]);
      };
    }
    function y(F, j) {
      if (!(F && j))
        return;
      const V = new Date(F).valueOf(), U = new Date(j).valueOf();
      if (V && U)
        return V - U;
    }
    function $(F, j) {
      if (!(F && j))
        return;
      const [V, U] = F.split(p), [z, W] = j.split(p), Q = n(V, z);
      if (Q !== void 0)
        return Q || c(U, W);
    }
    const v = /\/|:/, f = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function m(F) {
      return v.test(F) && f.test(F);
    }
    const l = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function g(F) {
      return l.lastIndex = 0, l.test(F);
    }
    const b = -2147483648, S = 2 ** 31 - 1;
    function _(F) {
      return Number.isInteger(F) && F <= S && F >= b;
    }
    function w(F) {
      return Number.isInteger(F);
    }
    function R() {
      return !0;
    }
    const T = /[^\\]\\Z/;
    function M(F) {
      if (T.test(F))
        return !1;
      try {
        return new RegExp(F), !0;
      } catch {
        return !1;
      }
    }
  }(wo)), wo;
}
var Eo = {}, qi = { exports: {} }, bo = {}, Bt = {}, yr = {}, So = {}, Po = {}, Ro = {}, Zl;
function Fa() {
  return Zl || (Zl = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class u extends t {
      constructor(l) {
        if (super(), !e.IDENTIFIER.test(l))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = l;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = u;
    class a extends t {
      constructor(l) {
        super(), this._items = typeof l == "string" ? [l] : l;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const l = this._items[0];
        return l === "" || l === '""';
      }
      get str() {
        var l;
        return (l = this._str) !== null && l !== void 0 ? l : this._str = this._items.reduce((g, b) => `${g}${b}`, "");
      }
      get names() {
        var l;
        return (l = this._names) !== null && l !== void 0 ? l : this._names = this._items.reduce((g, b) => (b instanceof u && (g[b.str] = (g[b.str] || 0) + 1), g), {});
      }
    }
    e._Code = a, e.nil = new a("");
    function d(m, ...l) {
      const g = [m[0]];
      let b = 0;
      for (; b < l.length; )
        s(g, l[b]), g.push(m[++b]);
      return new a(g);
    }
    e._ = d;
    const r = new a("+");
    function n(m, ...l) {
      const g = [y(m[0])];
      let b = 0;
      for (; b < l.length; )
        g.push(r), s(g, l[b]), g.push(r, y(m[++b]));
      return i(g), new a(g);
    }
    e.str = n;
    function s(m, l) {
      l instanceof a ? m.push(...l._items) : l instanceof u ? m.push(l) : m.push(p(l));
    }
    e.addCodeArg = s;
    function i(m) {
      let l = 1;
      for (; l < m.length - 1; ) {
        if (m[l] === r) {
          const g = c(m[l - 1], m[l + 1]);
          if (g !== void 0) {
            m.splice(l - 1, 3, g);
            continue;
          }
          m[l++] = "+";
        }
        l++;
      }
    }
    function c(m, l) {
      if (l === '""')
        return m;
      if (m === '""')
        return l;
      if (typeof m == "string")
        return l instanceof u || m[m.length - 1] !== '"' ? void 0 : typeof l != "string" ? `${m.slice(0, -1)}${l}"` : l[0] === '"' ? m.slice(0, -1) + l.slice(1) : void 0;
      if (typeof l == "string" && l[0] === '"' && !(m instanceof u))
        return `"${m}${l.slice(1)}`;
    }
    function o(m, l) {
      return l.emptyStr() ? m : m.emptyStr() ? l : n`${m}${l}`;
    }
    e.strConcat = o;
    function p(m) {
      return typeof m == "number" || typeof m == "boolean" || m === null ? m : y(Array.isArray(m) ? m.join(",") : m);
    }
    function h(m) {
      return new a(y(m));
    }
    e.stringify = h;
    function y(m) {
      return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = y;
    function $(m) {
      return typeof m == "string" && e.IDENTIFIER.test(m) ? new a(`.${m}`) : d`[${m}]`;
    }
    e.getProperty = $;
    function v(m) {
      if (typeof m == "string" && e.IDENTIFIER.test(m))
        return new a(`${m}`);
      throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
    }
    e.getEsmExportName = v;
    function f(m) {
      return new a(m.toString());
    }
    e.regexpCode = f;
  }(Ro)), Ro;
}
var To = {}, ef;
function tf() {
  return ef || (ef = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = Fa();
    class u extends Error {
      constructor(c) {
        super(`CodeGen: "code" for ${c} not defined`), this.value = c.value;
      }
    }
    var a;
    (function(i) {
      i[i.Started = 0] = "Started", i[i.Completed = 1] = "Completed";
    })(a || (e.UsedValueState = a = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class d {
      constructor({ prefixes: c, parent: o } = {}) {
        this._names = {}, this._prefixes = c, this._parent = o;
      }
      toName(c) {
        return c instanceof t.Name ? c : this.name(c);
      }
      name(c) {
        return new t.Name(this._newName(c));
      }
      _newName(c) {
        const o = this._names[c] || this._nameGroup(c);
        return `${c}${o.index++}`;
      }
      _nameGroup(c) {
        var o, p;
        if (!((p = (o = this._parent) === null || o === void 0 ? void 0 : o._prefixes) === null || p === void 0) && p.has(c) || this._prefixes && !this._prefixes.has(c))
          throw new Error(`CodeGen: prefix "${c}" is not allowed in this scope`);
        return this._names[c] = { prefix: c, index: 0 };
      }
    }
    e.Scope = d;
    class r extends t.Name {
      constructor(c, o) {
        super(o), this.prefix = c;
      }
      setValue(c, { property: o, itemIndex: p }) {
        this.value = c, this.scopePath = (0, t._)`.${new t.Name(o)}[${p}]`;
      }
    }
    e.ValueScopeName = r;
    const n = (0, t._)`\n`;
    class s extends d {
      constructor(c) {
        super(c), this._values = {}, this._scope = c.scope, this.opts = { ...c, _n: c.lines ? n : t.nil };
      }
      get() {
        return this._scope;
      }
      name(c) {
        return new r(c, this._newName(c));
      }
      value(c, o) {
        var p;
        if (o.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const h = this.toName(c), { prefix: y } = h, $ = (p = o.key) !== null && p !== void 0 ? p : o.ref;
        let v = this._values[y];
        if (v) {
          const l = v.get($);
          if (l)
            return l;
        } else
          v = this._values[y] = /* @__PURE__ */ new Map();
        v.set($, h);
        const f = this._scope[y] || (this._scope[y] = []), m = f.length;
        return f[m] = o.ref, h.setValue(o, { property: y, itemIndex: m }), h;
      }
      getValue(c, o) {
        const p = this._values[c];
        if (p)
          return p.get(o);
      }
      scopeRefs(c, o = this._values) {
        return this._reduceValues(o, (p) => {
          if (p.scopePath === void 0)
            throw new Error(`CodeGen: name "${p}" has no value`);
          return (0, t._)`${c}${p.scopePath}`;
        });
      }
      scopeCode(c = this._values, o, p) {
        return this._reduceValues(c, (h) => {
          if (h.value === void 0)
            throw new Error(`CodeGen: name "${h}" has no value`);
          return h.value.code;
        }, o, p);
      }
      _reduceValues(c, o, p = {}, h) {
        let y = t.nil;
        for (const $ in c) {
          const v = c[$];
          if (!v)
            continue;
          const f = p[$] = p[$] || /* @__PURE__ */ new Map();
          v.forEach((m) => {
            if (f.has(m))
              return;
            f.set(m, a.Started);
            let l = o(m);
            if (l) {
              const g = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              y = (0, t._)`${y}${g} ${m} = ${l};${this.opts._n}`;
            } else if (l = h?.(m))
              y = (0, t._)`${y}${l}${this.opts._n}`;
            else
              throw new u(m);
            f.set(m, a.Completed);
          });
        }
        return y;
      }
    }
    e.ValueScope = s;
  }(To)), To;
}
var rf;
function De() {
  return rf || (rf = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = Fa(), u = tf();
    var a = Fa();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return a._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return a.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return a.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return a.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return a.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return a.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return a.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return a.Name;
    } });
    var d = tf();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return d.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return d.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return d.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return d.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class r {
      optimizeNodes() {
        return this;
      }
      optimizeNames(P, O) {
        return this;
      }
    }
    class n extends r {
      constructor(P, O, L) {
        super(), this.varKind = P, this.name = O, this.rhs = L;
      }
      render({ es5: P, _n: O }) {
        const L = P ? u.varKinds.var : this.varKind, N = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${L} ${this.name}${N};` + O;
      }
      optimizeNames(P, O) {
        if (P[this.name.str])
          return this.rhs && (this.rhs = U(this.rhs, P, O)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class s extends r {
      constructor(P, O, L) {
        super(), this.lhs = P, this.rhs = O, this.sideEffects = L;
      }
      render({ _n: P }) {
        return `${this.lhs} = ${this.rhs};` + P;
      }
      optimizeNames(P, O) {
        if (!(this.lhs instanceof t.Name && !P[this.lhs.str] && !this.sideEffects))
          return this.rhs = U(this.rhs, P, O), this;
      }
      get names() {
        const P = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return V(P, this.rhs);
      }
    }
    class i extends s {
      constructor(P, O, L, N) {
        super(P, L, N), this.op = O;
      }
      render({ _n: P }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + P;
      }
    }
    class c extends r {
      constructor(P) {
        super(), this.label = P, this.names = {};
      }
      render({ _n: P }) {
        return `${this.label}:` + P;
      }
    }
    class o extends r {
      constructor(P) {
        super(), this.label = P, this.names = {};
      }
      render({ _n: P }) {
        return `break${this.label ? ` ${this.label}` : ""};` + P;
      }
    }
    class p extends r {
      constructor(P) {
        super(), this.error = P;
      }
      render({ _n: P }) {
        return `throw ${this.error};` + P;
      }
      get names() {
        return this.error.names;
      }
    }
    class h extends r {
      constructor(P) {
        super(), this.code = P;
      }
      render({ _n: P }) {
        return `${this.code};` + P;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(P, O) {
        return this.code = U(this.code, P, O), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class y extends r {
      constructor(P = []) {
        super(), this.nodes = P;
      }
      render(P) {
        return this.nodes.reduce((O, L) => O + L.render(P), "");
      }
      optimizeNodes() {
        const { nodes: P } = this;
        let O = P.length;
        for (; O--; ) {
          const L = P[O].optimizeNodes();
          Array.isArray(L) ? P.splice(O, 1, ...L) : L ? P[O] = L : P.splice(O, 1);
        }
        return P.length > 0 ? this : void 0;
      }
      optimizeNames(P, O) {
        const { nodes: L } = this;
        let N = L.length;
        for (; N--; ) {
          const A = L[N];
          A.optimizeNames(P, O) || (z(P, A.names), L.splice(N, 1));
        }
        return L.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((P, O) => j(P, O.names), {});
      }
    }
    class $ extends y {
      render(P) {
        return "{" + P._n + super.render(P) + "}" + P._n;
      }
    }
    class v extends y {
    }
    class f extends $ {
    }
    f.kind = "else";
    class m extends $ {
      constructor(P, O) {
        super(O), this.condition = P;
      }
      render(P) {
        let O = `if(${this.condition})` + super.render(P);
        return this.else && (O += "else " + this.else.render(P)), O;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const P = this.condition;
        if (P === !0)
          return this.nodes;
        let O = this.else;
        if (O) {
          const L = O.optimizeNodes();
          O = this.else = Array.isArray(L) ? new f(L) : L;
        }
        if (O)
          return P === !1 ? O instanceof m ? O : O.nodes : this.nodes.length ? this : new m(W(P), O instanceof m ? [O] : O.nodes);
        if (!(P === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(P, O) {
        var L;
        if (this.else = (L = this.else) === null || L === void 0 ? void 0 : L.optimizeNames(P, O), !!(super.optimizeNames(P, O) || this.else))
          return this.condition = U(this.condition, P, O), this;
      }
      get names() {
        const P = super.names;
        return V(P, this.condition), this.else && j(P, this.else.names), P;
      }
    }
    m.kind = "if";
    class l extends $ {
    }
    l.kind = "for";
    class g extends l {
      constructor(P) {
        super(), this.iteration = P;
      }
      render(P) {
        return `for(${this.iteration})` + super.render(P);
      }
      optimizeNames(P, O) {
        if (super.optimizeNames(P, O))
          return this.iteration = U(this.iteration, P, O), this;
      }
      get names() {
        return j(super.names, this.iteration.names);
      }
    }
    class b extends l {
      constructor(P, O, L, N) {
        super(), this.varKind = P, this.name = O, this.from = L, this.to = N;
      }
      render(P) {
        const O = P.es5 ? u.varKinds.var : this.varKind, { name: L, from: N, to: A } = this;
        return `for(${O} ${L}=${N}; ${L}<${A}; ${L}++)` + super.render(P);
      }
      get names() {
        const P = V(super.names, this.from);
        return V(P, this.to);
      }
    }
    class S extends l {
      constructor(P, O, L, N) {
        super(), this.loop = P, this.varKind = O, this.name = L, this.iterable = N;
      }
      render(P) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(P);
      }
      optimizeNames(P, O) {
        if (super.optimizeNames(P, O))
          return this.iterable = U(this.iterable, P, O), this;
      }
      get names() {
        return j(super.names, this.iterable.names);
      }
    }
    class _ extends $ {
      constructor(P, O, L) {
        super(), this.name = P, this.args = O, this.async = L;
      }
      render(P) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(P);
      }
    }
    _.kind = "func";
    class w extends y {
      render(P) {
        return "return " + super.render(P);
      }
    }
    w.kind = "return";
    class R extends $ {
      render(P) {
        let O = "try" + super.render(P);
        return this.catch && (O += this.catch.render(P)), this.finally && (O += this.finally.render(P)), O;
      }
      optimizeNodes() {
        var P, O;
        return super.optimizeNodes(), (P = this.catch) === null || P === void 0 || P.optimizeNodes(), (O = this.finally) === null || O === void 0 || O.optimizeNodes(), this;
      }
      optimizeNames(P, O) {
        var L, N;
        return super.optimizeNames(P, O), (L = this.catch) === null || L === void 0 || L.optimizeNames(P, O), (N = this.finally) === null || N === void 0 || N.optimizeNames(P, O), this;
      }
      get names() {
        const P = super.names;
        return this.catch && j(P, this.catch.names), this.finally && j(P, this.finally.names), P;
      }
    }
    class T extends $ {
      constructor(P) {
        super(), this.error = P;
      }
      render(P) {
        return `catch(${this.error})` + super.render(P);
      }
    }
    T.kind = "catch";
    class M extends $ {
      render(P) {
        return "finally" + super.render(P);
      }
    }
    M.kind = "finally";
    class F {
      constructor(P, O = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...O, _n: O.lines ? `
` : "" }, this._extScope = P, this._scope = new u.Scope({ parent: P }), this._nodes = [new v()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(P) {
        return this._scope.name(P);
      }
      // reserves unique name in the external scope
      scopeName(P) {
        return this._extScope.name(P);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(P, O) {
        const L = this._extScope.value(P, O);
        return (this._values[L.prefix] || (this._values[L.prefix] = /* @__PURE__ */ new Set())).add(L), L;
      }
      getScopeValue(P, O) {
        return this._extScope.getValue(P, O);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(P) {
        return this._extScope.scopeRefs(P, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(P, O, L, N) {
        const A = this._scope.toName(O);
        return L !== void 0 && N && (this._constants[A.str] = L), this._leafNode(new n(P, A, L)), A;
      }
      // `const` declaration (`var` in es5 mode)
      const(P, O, L) {
        return this._def(u.varKinds.const, P, O, L);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(P, O, L) {
        return this._def(u.varKinds.let, P, O, L);
      }
      // `var` declaration with optional assignment
      var(P, O, L) {
        return this._def(u.varKinds.var, P, O, L);
      }
      // assignment code
      assign(P, O, L) {
        return this._leafNode(new s(P, O, L));
      }
      // `+=` code
      add(P, O) {
        return this._leafNode(new i(P, e.operators.ADD, O));
      }
      // appends passed SafeExpr to code or executes Block
      code(P) {
        return typeof P == "function" ? P() : P !== t.nil && this._leafNode(new h(P)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...P) {
        const O = ["{"];
        for (const [L, N] of P)
          O.length > 1 && O.push(","), O.push(L), (L !== N || this.opts.es5) && (O.push(":"), (0, t.addCodeArg)(O, N));
        return O.push("}"), new t._Code(O);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(P, O, L) {
        if (this._blockNode(new m(P)), O && L)
          this.code(O).else().code(L).endIf();
        else if (O)
          this.code(O).endIf();
        else if (L)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(P) {
        return this._elseNode(new m(P));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new f());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(m, f);
      }
      _for(P, O) {
        return this._blockNode(P), O && this.code(O).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(P, O) {
        return this._for(new g(P), O);
      }
      // `for` statement for a range of values
      forRange(P, O, L, N, A = this.opts.es5 ? u.varKinds.var : u.varKinds.let) {
        const J = this._scope.toName(P);
        return this._for(new b(A, J, O, L), () => N(J));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(P, O, L, N = u.varKinds.const) {
        const A = this._scope.toName(P);
        if (this.opts.es5) {
          const J = O instanceof t.Name ? O : this.var("_arr", O);
          return this.forRange("_i", 0, (0, t._)`${J}.length`, (B) => {
            this.var(A, (0, t._)`${J}[${B}]`), L(A);
          });
        }
        return this._for(new S("of", N, A, O), () => L(A));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(P, O, L, N = this.opts.es5 ? u.varKinds.var : u.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(P, (0, t._)`Object.keys(${O})`, L);
        const A = this._scope.toName(P);
        return this._for(new S("in", N, A, O), () => L(A));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(l);
      }
      // `label` statement
      label(P) {
        return this._leafNode(new c(P));
      }
      // `break` statement
      break(P) {
        return this._leafNode(new o(P));
      }
      // `return` statement
      return(P) {
        const O = new w();
        if (this._blockNode(O), this.code(P), O.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(w);
      }
      // `try` statement
      try(P, O, L) {
        if (!O && !L)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const N = new R();
        if (this._blockNode(N), this.code(P), O) {
          const A = this.name("e");
          this._currNode = N.catch = new T(A), O(A);
        }
        return L && (this._currNode = N.finally = new M(), this.code(L)), this._endBlockNode(T, M);
      }
      // `throw` statement
      throw(P) {
        return this._leafNode(new p(P));
      }
      // start self-balancing block
      block(P, O) {
        return this._blockStarts.push(this._nodes.length), P && this.code(P).endBlock(O), this;
      }
      // end the current self-balancing block
      endBlock(P) {
        const O = this._blockStarts.pop();
        if (O === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const L = this._nodes.length - O;
        if (L < 0 || P !== void 0 && L !== P)
          throw new Error(`CodeGen: wrong number of nodes: ${L} vs ${P} expected`);
        return this._nodes.length = O, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(P, O = t.nil, L, N) {
        return this._blockNode(new _(P, O, L)), N && this.code(N).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(_);
      }
      optimize(P = 1) {
        for (; P-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(P) {
        return this._currNode.nodes.push(P), this;
      }
      _blockNode(P) {
        this._currNode.nodes.push(P), this._nodes.push(P);
      }
      _endBlockNode(P, O) {
        const L = this._currNode;
        if (L instanceof P || O && L instanceof O)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${O ? `${P.kind}/${O.kind}` : P.kind}"`);
      }
      _elseNode(P) {
        const O = this._currNode;
        if (!(O instanceof m))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = O.else = P, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const P = this._nodes;
        return P[P.length - 1];
      }
      set _currNode(P) {
        const O = this._nodes;
        O[O.length - 1] = P;
      }
    }
    e.CodeGen = F;
    function j(D, P) {
      for (const O in P)
        D[O] = (D[O] || 0) + (P[O] || 0);
      return D;
    }
    function V(D, P) {
      return P instanceof t._CodeOrName ? j(D, P.names) : D;
    }
    function U(D, P, O) {
      if (D instanceof t.Name)
        return L(D);
      if (!N(D))
        return D;
      return new t._Code(D._items.reduce((A, J) => (J instanceof t.Name && (J = L(J)), J instanceof t._Code ? A.push(...J._items) : A.push(J), A), []));
      function L(A) {
        const J = O[A.str];
        return J === void 0 || P[A.str] !== 1 ? A : (delete P[A.str], J);
      }
      function N(A) {
        return A instanceof t._Code && A._items.some((J) => J instanceof t.Name && P[J.str] === 1 && O[J.str] !== void 0);
      }
    }
    function z(D, P) {
      for (const O in P)
        D[O] = (D[O] || 0) - (P[O] || 0);
    }
    function W(D) {
      return typeof D == "boolean" || typeof D == "number" || D === null ? !D : (0, t._)`!${G(D)}`;
    }
    e.not = W;
    const Q = I(e.operators.AND);
    function ee(...D) {
      return D.reduce(Q);
    }
    e.and = ee;
    const ne = I(e.operators.OR);
    function K(...D) {
      return D.reduce(ne);
    }
    e.or = K;
    function I(D) {
      return (P, O) => P === t.nil ? O : O === t.nil ? P : (0, t._)`${G(P)} ${D} ${G(O)}`;
    }
    function G(D) {
      return D instanceof t.Name ? D : (0, t._)`(${D})`;
    }
  }(Po)), Po;
}
var Ce = {}, nf;
function Fe() {
  if (nf) return Ce;
  nf = 1, Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.checkStrictMode = Ce.getErrorPath = Ce.Type = Ce.useFunc = Ce.setEvaluated = Ce.evaluatedPropsToName = Ce.mergeEvaluated = Ce.eachItem = Ce.unescapeJsonPointer = Ce.escapeJsonPointer = Ce.escapeFragment = Ce.unescapeFragment = Ce.schemaRefOrVal = Ce.schemaHasRulesButRef = Ce.schemaHasRules = Ce.checkUnknownRules = Ce.alwaysValidSchema = Ce.toHash = void 0;
  const e = De(), t = Fa();
  function u(S) {
    const _ = {};
    for (const w of S)
      _[w] = !0;
    return _;
  }
  Ce.toHash = u;
  function a(S, _) {
    return typeof _ == "boolean" ? _ : Object.keys(_).length === 0 ? !0 : (d(S, _), !r(_, S.self.RULES.all));
  }
  Ce.alwaysValidSchema = a;
  function d(S, _ = S.schema) {
    const { opts: w, self: R } = S;
    if (!w.strictSchema || typeof _ == "boolean")
      return;
    const T = R.RULES.keywords;
    for (const M in _)
      T[M] || b(S, `unknown keyword: "${M}"`);
  }
  Ce.checkUnknownRules = d;
  function r(S, _) {
    if (typeof S == "boolean")
      return !S;
    for (const w in S)
      if (_[w])
        return !0;
    return !1;
  }
  Ce.schemaHasRules = r;
  function n(S, _) {
    if (typeof S == "boolean")
      return !S;
    for (const w in S)
      if (w !== "$ref" && _.all[w])
        return !0;
    return !1;
  }
  Ce.schemaHasRulesButRef = n;
  function s({ topSchemaRef: S, schemaPath: _ }, w, R, T) {
    if (!T) {
      if (typeof w == "number" || typeof w == "boolean")
        return w;
      if (typeof w == "string")
        return (0, e._)`${w}`;
    }
    return (0, e._)`${S}${_}${(0, e.getProperty)(R)}`;
  }
  Ce.schemaRefOrVal = s;
  function i(S) {
    return p(decodeURIComponent(S));
  }
  Ce.unescapeFragment = i;
  function c(S) {
    return encodeURIComponent(o(S));
  }
  Ce.escapeFragment = c;
  function o(S) {
    return typeof S == "number" ? `${S}` : S.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  Ce.escapeJsonPointer = o;
  function p(S) {
    return S.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  Ce.unescapeJsonPointer = p;
  function h(S, _) {
    if (Array.isArray(S))
      for (const w of S)
        _(w);
    else
      _(S);
  }
  Ce.eachItem = h;
  function y({ mergeNames: S, mergeToName: _, mergeValues: w, resultToName: R }) {
    return (T, M, F, j) => {
      const V = F === void 0 ? M : F instanceof e.Name ? (M instanceof e.Name ? S(T, M, F) : _(T, M, F), F) : M instanceof e.Name ? (_(T, F, M), M) : w(M, F);
      return j === e.Name && !(V instanceof e.Name) ? R(T, V) : V;
    };
  }
  Ce.mergeEvaluated = {
    props: y({
      mergeNames: (S, _, w) => S.if((0, e._)`${w} !== true && ${_} !== undefined`, () => {
        S.if((0, e._)`${_} === true`, () => S.assign(w, !0), () => S.assign(w, (0, e._)`${w} || {}`).code((0, e._)`Object.assign(${w}, ${_})`));
      }),
      mergeToName: (S, _, w) => S.if((0, e._)`${w} !== true`, () => {
        _ === !0 ? S.assign(w, !0) : (S.assign(w, (0, e._)`${w} || {}`), v(S, w, _));
      }),
      mergeValues: (S, _) => S === !0 ? !0 : { ...S, ..._ },
      resultToName: $
    }),
    items: y({
      mergeNames: (S, _, w) => S.if((0, e._)`${w} !== true && ${_} !== undefined`, () => S.assign(w, (0, e._)`${_} === true ? true : ${w} > ${_} ? ${w} : ${_}`)),
      mergeToName: (S, _, w) => S.if((0, e._)`${w} !== true`, () => S.assign(w, _ === !0 ? !0 : (0, e._)`${w} > ${_} ? ${w} : ${_}`)),
      mergeValues: (S, _) => S === !0 ? !0 : Math.max(S, _),
      resultToName: (S, _) => S.var("items", _)
    })
  };
  function $(S, _) {
    if (_ === !0)
      return S.var("props", !0);
    const w = S.var("props", (0, e._)`{}`);
    return _ !== void 0 && v(S, w, _), w;
  }
  Ce.evaluatedPropsToName = $;
  function v(S, _, w) {
    Object.keys(w).forEach((R) => S.assign((0, e._)`${_}${(0, e.getProperty)(R)}`, !0));
  }
  Ce.setEvaluated = v;
  const f = {};
  function m(S, _) {
    return S.scopeValue("func", {
      ref: _,
      code: f[_.code] || (f[_.code] = new t._Code(_.code))
    });
  }
  Ce.useFunc = m;
  var l;
  (function(S) {
    S[S.Num = 0] = "Num", S[S.Str = 1] = "Str";
  })(l || (Ce.Type = l = {}));
  function g(S, _, w) {
    if (S instanceof e.Name) {
      const R = _ === l.Num;
      return w ? R ? (0, e._)`"[" + ${S} + "]"` : (0, e._)`"['" + ${S} + "']"` : R ? (0, e._)`"/" + ${S}` : (0, e._)`"/" + ${S}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return w ? (0, e.getProperty)(S).toString() : "/" + o(S);
  }
  Ce.getErrorPath = g;
  function b(S, _, w = S.opts.strictSchema) {
    if (w) {
      if (_ = `strict mode: ${_}`, w === !0)
        throw new Error(_);
      S.self.logger.warn(_);
    }
  }
  return Ce.checkStrictMode = b, Ce;
}
var Fi = {}, af;
function or() {
  if (af) return Fi;
  af = 1, Object.defineProperty(Fi, "__esModule", { value: !0 });
  const e = De(), t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return Fi.default = t, Fi;
}
var of;
function Wa() {
  return of || (of = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = De(), u = Fe(), a = or();
    e.keywordError = {
      message: ({ keyword: f }) => (0, t.str)`must pass "${f}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: f, schemaType: m }) => m ? (0, t.str)`"${f}" keyword must be ${m} ($data)` : (0, t.str)`"${f}" keyword is invalid ($data)`
    };
    function d(f, m = e.keywordError, l, g) {
      const { it: b } = f, { gen: S, compositeRule: _, allErrors: w } = b, R = p(f, m, l);
      g ?? (_ || w) ? i(S, R) : c(b, (0, t._)`[${R}]`);
    }
    e.reportError = d;
    function r(f, m = e.keywordError, l) {
      const { it: g } = f, { gen: b, compositeRule: S, allErrors: _ } = g, w = p(f, m, l);
      i(b, w), S || _ || c(g, a.default.vErrors);
    }
    e.reportExtraError = r;
    function n(f, m) {
      f.assign(a.default.errors, m), f.if((0, t._)`${a.default.vErrors} !== null`, () => f.if(m, () => f.assign((0, t._)`${a.default.vErrors}.length`, m), () => f.assign(a.default.vErrors, null)));
    }
    e.resetErrorsCount = n;
    function s({ gen: f, keyword: m, schemaValue: l, data: g, errsCount: b, it: S }) {
      if (b === void 0)
        throw new Error("ajv implementation error");
      const _ = f.name("err");
      f.forRange("i", b, a.default.errors, (w) => {
        f.const(_, (0, t._)`${a.default.vErrors}[${w}]`), f.if((0, t._)`${_}.instancePath === undefined`, () => f.assign((0, t._)`${_}.instancePath`, (0, t.strConcat)(a.default.instancePath, S.errorPath))), f.assign((0, t._)`${_}.schemaPath`, (0, t.str)`${S.errSchemaPath}/${m}`), S.opts.verbose && (f.assign((0, t._)`${_}.schema`, l), f.assign((0, t._)`${_}.data`, g));
      });
    }
    e.extendErrors = s;
    function i(f, m) {
      const l = f.const("err", m);
      f.if((0, t._)`${a.default.vErrors} === null`, () => f.assign(a.default.vErrors, (0, t._)`[${l}]`), (0, t._)`${a.default.vErrors}.push(${l})`), f.code((0, t._)`${a.default.errors}++`);
    }
    function c(f, m) {
      const { gen: l, validateName: g, schemaEnv: b } = f;
      b.$async ? l.throw((0, t._)`new ${f.ValidationError}(${m})`) : (l.assign((0, t._)`${g}.errors`, m), l.return(!1));
    }
    const o = {
      keyword: new t.Name("keyword"),
      schemaPath: new t.Name("schemaPath"),
      // also used in JTD errors
      params: new t.Name("params"),
      propertyName: new t.Name("propertyName"),
      message: new t.Name("message"),
      schema: new t.Name("schema"),
      parentSchema: new t.Name("parentSchema")
    };
    function p(f, m, l) {
      const { createErrors: g } = f.it;
      return g === !1 ? (0, t._)`{}` : h(f, m, l);
    }
    function h(f, m, l = {}) {
      const { gen: g, it: b } = f, S = [
        y(b, l),
        $(f, l)
      ];
      return v(f, m, S), g.object(...S);
    }
    function y({ errorPath: f }, { instancePath: m }) {
      const l = m ? (0, t.str)`${f}${(0, u.getErrorPath)(m, u.Type.Str)}` : f;
      return [a.default.instancePath, (0, t.strConcat)(a.default.instancePath, l)];
    }
    function $({ keyword: f, it: { errSchemaPath: m } }, { schemaPath: l, parentSchema: g }) {
      let b = g ? m : (0, t.str)`${m}/${f}`;
      return l && (b = (0, t.str)`${b}${(0, u.getErrorPath)(l, u.Type.Str)}`), [o.schemaPath, b];
    }
    function v(f, { params: m, message: l }, g) {
      const { keyword: b, data: S, schemaValue: _, it: w } = f, { opts: R, propertyName: T, topSchemaRef: M, schemaPath: F } = w;
      g.push([o.keyword, b], [o.params, typeof m == "function" ? m(f) : m || (0, t._)`{}`]), R.messages && g.push([o.message, typeof l == "function" ? l(f) : l]), R.verbose && g.push([o.schema, _], [o.parentSchema, (0, t._)`${M}${F}`], [a.default.data, S]), T && g.push([o.propertyName, T]);
    }
  }(So)), So;
}
var sf;
function y_() {
  if (sf) return yr;
  sf = 1, Object.defineProperty(yr, "__esModule", { value: !0 }), yr.boolOrEmptySchema = yr.topBoolOrEmptySchema = void 0;
  const e = Wa(), t = De(), u = or(), a = {
    message: "boolean schema is false"
  };
  function d(s) {
    const { gen: i, schema: c, validateName: o } = s;
    c === !1 ? n(s, !1) : typeof c == "object" && c.$async === !0 ? i.return(u.default.data) : (i.assign((0, t._)`${o}.errors`, null), i.return(!0));
  }
  yr.topBoolOrEmptySchema = d;
  function r(s, i) {
    const { gen: c, schema: o } = s;
    o === !1 ? (c.var(i, !1), n(s)) : c.var(i, !0);
  }
  yr.boolOrEmptySchema = r;
  function n(s, i) {
    const { gen: c, data: o } = s, p = {
      gen: c,
      keyword: "false schema",
      data: o,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: s
    };
    (0, e.reportError)(p, a, void 0, i);
  }
  return yr;
}
var et = {}, gr = {}, uf;
function qm() {
  if (uf) return gr;
  uf = 1, Object.defineProperty(gr, "__esModule", { value: !0 }), gr.getRules = gr.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], t = new Set(e);
  function u(d) {
    return typeof d == "string" && t.has(d);
  }
  gr.isJSONType = u;
  function a() {
    const d = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...d, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, d.number, d.string, d.array, d.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return gr.getRules = a, gr;
}
var Ht = {}, cf;
function Fm() {
  if (cf) return Ht;
  cf = 1, Object.defineProperty(Ht, "__esModule", { value: !0 }), Ht.shouldUseRule = Ht.shouldUseGroup = Ht.schemaHasRulesForType = void 0;
  function e({ schema: a, self: d }, r) {
    const n = d.RULES.types[r];
    return n && n !== !0 && t(a, n);
  }
  Ht.schemaHasRulesForType = e;
  function t(a, d) {
    return d.rules.some((r) => u(a, r));
  }
  Ht.shouldUseGroup = t;
  function u(a, d) {
    var r;
    return a[d.keyword] !== void 0 || ((r = d.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => a[n] !== void 0));
  }
  return Ht.shouldUseRule = u, Ht;
}
var lf;
function ja() {
  if (lf) return et;
  lf = 1, Object.defineProperty(et, "__esModule", { value: !0 }), et.reportTypeError = et.checkDataTypes = et.checkDataType = et.coerceAndCheckDataType = et.getJSONTypes = et.getSchemaTypes = et.DataType = void 0;
  const e = qm(), t = Fm(), u = Wa(), a = De(), d = Fe();
  var r;
  (function(l) {
    l[l.Correct = 0] = "Correct", l[l.Wrong = 1] = "Wrong";
  })(r || (et.DataType = r = {}));
  function n(l) {
    const g = s(l.type);
    if (g.includes("null")) {
      if (l.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!g.length && l.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      l.nullable === !0 && g.push("null");
    }
    return g;
  }
  et.getSchemaTypes = n;
  function s(l) {
    const g = Array.isArray(l) ? l : l ? [l] : [];
    if (g.every(e.isJSONType))
      return g;
    throw new Error("type must be JSONType or JSONType[]: " + g.join(","));
  }
  et.getJSONTypes = s;
  function i(l, g) {
    const { gen: b, data: S, opts: _ } = l, w = o(g, _.coerceTypes), R = g.length > 0 && !(w.length === 0 && g.length === 1 && (0, t.schemaHasRulesForType)(l, g[0]));
    if (R) {
      const T = $(g, S, _.strictNumbers, r.Wrong);
      b.if(T, () => {
        w.length ? p(l, g, w) : f(l);
      });
    }
    return R;
  }
  et.coerceAndCheckDataType = i;
  const c = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function o(l, g) {
    return g ? l.filter((b) => c.has(b) || g === "array" && b === "array") : [];
  }
  function p(l, g, b) {
    const { gen: S, data: _, opts: w } = l, R = S.let("dataType", (0, a._)`typeof ${_}`), T = S.let("coerced", (0, a._)`undefined`);
    w.coerceTypes === "array" && S.if((0, a._)`${R} == 'object' && Array.isArray(${_}) && ${_}.length == 1`, () => S.assign(_, (0, a._)`${_}[0]`).assign(R, (0, a._)`typeof ${_}`).if($(g, _, w.strictNumbers), () => S.assign(T, _))), S.if((0, a._)`${T} !== undefined`);
    for (const F of b)
      (c.has(F) || F === "array" && w.coerceTypes === "array") && M(F);
    S.else(), f(l), S.endIf(), S.if((0, a._)`${T} !== undefined`, () => {
      S.assign(_, T), h(l, T);
    });
    function M(F) {
      switch (F) {
        case "string":
          S.elseIf((0, a._)`${R} == "number" || ${R} == "boolean"`).assign(T, (0, a._)`"" + ${_}`).elseIf((0, a._)`${_} === null`).assign(T, (0, a._)`""`);
          return;
        case "number":
          S.elseIf((0, a._)`${R} == "boolean" || ${_} === null
              || (${R} == "string" && ${_} && ${_} == +${_})`).assign(T, (0, a._)`+${_}`);
          return;
        case "integer":
          S.elseIf((0, a._)`${R} === "boolean" || ${_} === null
              || (${R} === "string" && ${_} && ${_} == +${_} && !(${_} % 1))`).assign(T, (0, a._)`+${_}`);
          return;
        case "boolean":
          S.elseIf((0, a._)`${_} === "false" || ${_} === 0 || ${_} === null`).assign(T, !1).elseIf((0, a._)`${_} === "true" || ${_} === 1`).assign(T, !0);
          return;
        case "null":
          S.elseIf((0, a._)`${_} === "" || ${_} === 0 || ${_} === false`), S.assign(T, null);
          return;
        case "array":
          S.elseIf((0, a._)`${R} === "string" || ${R} === "number"
              || ${R} === "boolean" || ${_} === null`).assign(T, (0, a._)`[${_}]`);
      }
    }
  }
  function h({ gen: l, parentData: g, parentDataProperty: b }, S) {
    l.if((0, a._)`${g} !== undefined`, () => l.assign((0, a._)`${g}[${b}]`, S));
  }
  function y(l, g, b, S = r.Correct) {
    const _ = S === r.Correct ? a.operators.EQ : a.operators.NEQ;
    let w;
    switch (l) {
      case "null":
        return (0, a._)`${g} ${_} null`;
      case "array":
        w = (0, a._)`Array.isArray(${g})`;
        break;
      case "object":
        w = (0, a._)`${g} && typeof ${g} == "object" && !Array.isArray(${g})`;
        break;
      case "integer":
        w = R((0, a._)`!(${g} % 1) && !isNaN(${g})`);
        break;
      case "number":
        w = R();
        break;
      default:
        return (0, a._)`typeof ${g} ${_} ${l}`;
    }
    return S === r.Correct ? w : (0, a.not)(w);
    function R(T = a.nil) {
      return (0, a.and)((0, a._)`typeof ${g} == "number"`, T, b ? (0, a._)`isFinite(${g})` : a.nil);
    }
  }
  et.checkDataType = y;
  function $(l, g, b, S) {
    if (l.length === 1)
      return y(l[0], g, b, S);
    let _;
    const w = (0, d.toHash)(l);
    if (w.array && w.object) {
      const R = (0, a._)`typeof ${g} != "object"`;
      _ = w.null ? R : (0, a._)`!${g} || ${R}`, delete w.null, delete w.array, delete w.object;
    } else
      _ = a.nil;
    w.number && delete w.integer;
    for (const R in w)
      _ = (0, a.and)(_, y(R, g, b, S));
    return _;
  }
  et.checkDataTypes = $;
  const v = {
    message: ({ schema: l }) => `must be ${l}`,
    params: ({ schema: l, schemaValue: g }) => typeof l == "string" ? (0, a._)`{type: ${l}}` : (0, a._)`{type: ${g}}`
  };
  function f(l) {
    const g = m(l);
    (0, u.reportError)(g, v);
  }
  et.reportTypeError = f;
  function m(l) {
    const { gen: g, data: b, schema: S } = l, _ = (0, d.schemaRefOrVal)(l, S, "type");
    return {
      gen: g,
      keyword: "type",
      data: b,
      schema: S.type,
      schemaCode: _,
      schemaValue: _,
      parentSchema: S,
      params: {},
      it: l
    };
  }
  return et;
}
var en = {}, ff;
function g_() {
  if (ff) return en;
  ff = 1, Object.defineProperty(en, "__esModule", { value: !0 }), en.assignDefaults = void 0;
  const e = De(), t = Fe();
  function u(d, r) {
    const { properties: n, items: s } = d.schema;
    if (r === "object" && n)
      for (const i in n)
        a(d, i, n[i].default);
    else r === "array" && Array.isArray(s) && s.forEach((i, c) => a(d, c, i.default));
  }
  en.assignDefaults = u;
  function a(d, r, n) {
    const { gen: s, compositeRule: i, data: c, opts: o } = d;
    if (n === void 0)
      return;
    const p = (0, e._)`${c}${(0, e.getProperty)(r)}`;
    if (i) {
      (0, t.checkStrictMode)(d, `default is ignored for: ${p}`);
      return;
    }
    let h = (0, e._)`${p} === undefined`;
    o.useDefaults === "empty" && (h = (0, e._)`${h} || ${p} === null || ${p} === ""`), s.if(h, (0, e._)`${p} = ${(0, e.stringify)(n)}`);
  }
  return en;
}
var Ot = {}, Me = {}, df;
function Dt() {
  if (df) return Me;
  df = 1, Object.defineProperty(Me, "__esModule", { value: !0 }), Me.validateUnion = Me.validateArray = Me.usePattern = Me.callValidateCode = Me.schemaProperties = Me.allSchemaProperties = Me.noPropertyInData = Me.propertyInData = Me.isOwnProperty = Me.hasPropFunc = Me.reportMissingProp = Me.checkMissingProp = Me.checkReportMissingProp = void 0;
  const e = De(), t = Fe(), u = or(), a = Fe();
  function d(l, g) {
    const { gen: b, data: S, it: _ } = l;
    b.if(o(b, S, g, _.opts.ownProperties), () => {
      l.setParams({ missingProperty: (0, e._)`${g}` }, !0), l.error();
    });
  }
  Me.checkReportMissingProp = d;
  function r({ gen: l, data: g, it: { opts: b } }, S, _) {
    return (0, e.or)(...S.map((w) => (0, e.and)(o(l, g, w, b.ownProperties), (0, e._)`${_} = ${w}`)));
  }
  Me.checkMissingProp = r;
  function n(l, g) {
    l.setParams({ missingProperty: g }, !0), l.error();
  }
  Me.reportMissingProp = n;
  function s(l) {
    return l.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  Me.hasPropFunc = s;
  function i(l, g, b) {
    return (0, e._)`${s(l)}.call(${g}, ${b})`;
  }
  Me.isOwnProperty = i;
  function c(l, g, b, S) {
    const _ = (0, e._)`${g}${(0, e.getProperty)(b)} !== undefined`;
    return S ? (0, e._)`${_} && ${i(l, g, b)}` : _;
  }
  Me.propertyInData = c;
  function o(l, g, b, S) {
    const _ = (0, e._)`${g}${(0, e.getProperty)(b)} === undefined`;
    return S ? (0, e.or)(_, (0, e.not)(i(l, g, b))) : _;
  }
  Me.noPropertyInData = o;
  function p(l) {
    return l ? Object.keys(l).filter((g) => g !== "__proto__") : [];
  }
  Me.allSchemaProperties = p;
  function h(l, g) {
    return p(g).filter((b) => !(0, t.alwaysValidSchema)(l, g[b]));
  }
  Me.schemaProperties = h;
  function y({ schemaCode: l, data: g, it: { gen: b, topSchemaRef: S, schemaPath: _, errorPath: w }, it: R }, T, M, F) {
    const j = F ? (0, e._)`${l}, ${g}, ${S}${_}` : g, V = [
      [u.default.instancePath, (0, e.strConcat)(u.default.instancePath, w)],
      [u.default.parentData, R.parentData],
      [u.default.parentDataProperty, R.parentDataProperty],
      [u.default.rootData, u.default.rootData]
    ];
    R.opts.dynamicRef && V.push([u.default.dynamicAnchors, u.default.dynamicAnchors]);
    const U = (0, e._)`${j}, ${b.object(...V)}`;
    return M !== e.nil ? (0, e._)`${T}.call(${M}, ${U})` : (0, e._)`${T}(${U})`;
  }
  Me.callValidateCode = y;
  const $ = (0, e._)`new RegExp`;
  function v({ gen: l, it: { opts: g } }, b) {
    const S = g.unicodeRegExp ? "u" : "", { regExp: _ } = g.code, w = _(b, S);
    return l.scopeValue("pattern", {
      key: w.toString(),
      ref: w,
      code: (0, e._)`${_.code === "new RegExp" ? $ : (0, a.useFunc)(l, _)}(${b}, ${S})`
    });
  }
  Me.usePattern = v;
  function f(l) {
    const { gen: g, data: b, keyword: S, it: _ } = l, w = g.name("valid");
    if (_.allErrors) {
      const T = g.let("valid", !0);
      return R(() => g.assign(T, !1)), T;
    }
    return g.var(w, !0), R(() => g.break()), w;
    function R(T) {
      const M = g.const("len", (0, e._)`${b}.length`);
      g.forRange("i", 0, M, (F) => {
        l.subschema({
          keyword: S,
          dataProp: F,
          dataPropType: t.Type.Num
        }, w), g.if((0, e.not)(w), T);
      });
    }
  }
  Me.validateArray = f;
  function m(l) {
    const { gen: g, schema: b, keyword: S, it: _ } = l;
    if (!Array.isArray(b))
      throw new Error("ajv implementation error");
    if (b.some((M) => (0, t.alwaysValidSchema)(_, M)) && !_.opts.unevaluated)
      return;
    const R = g.let("valid", !1), T = g.name("_valid");
    g.block(() => b.forEach((M, F) => {
      const j = l.subschema({
        keyword: S,
        schemaProp: F,
        compositeRule: !0
      }, T);
      g.assign(R, (0, e._)`${R} || ${T}`), l.mergeValidEvaluated(j, T) || g.if((0, e.not)(R));
    })), l.result(R, () => l.reset(), () => l.error(!0));
  }
  return Me.validateUnion = m, Me;
}
var hf;
function v_() {
  if (hf) return Ot;
  hf = 1, Object.defineProperty(Ot, "__esModule", { value: !0 }), Ot.validateKeywordUsage = Ot.validSchemaType = Ot.funcKeywordCode = Ot.macroKeywordCode = void 0;
  const e = De(), t = or(), u = Dt(), a = Wa();
  function d(h, y) {
    const { gen: $, keyword: v, schema: f, parentSchema: m, it: l } = h, g = y.macro.call(l.self, f, m, l), b = c($, v, g);
    l.opts.validateSchema !== !1 && l.self.validateSchema(g, !0);
    const S = $.name("valid");
    h.subschema({
      schema: g,
      schemaPath: e.nil,
      errSchemaPath: `${l.errSchemaPath}/${v}`,
      topSchemaRef: b,
      compositeRule: !0
    }, S), h.pass(S, () => h.error(!0));
  }
  Ot.macroKeywordCode = d;
  function r(h, y) {
    var $;
    const { gen: v, keyword: f, schema: m, parentSchema: l, $data: g, it: b } = h;
    i(b, y);
    const S = !g && y.compile ? y.compile.call(b.self, m, l, b) : y.validate, _ = c(v, f, S), w = v.let("valid");
    h.block$data(w, R), h.ok(($ = y.valid) !== null && $ !== void 0 ? $ : w);
    function R() {
      if (y.errors === !1)
        F(), y.modifying && n(h), j(() => h.error());
      else {
        const V = y.async ? T() : M();
        y.modifying && n(h), j(() => s(h, V));
      }
    }
    function T() {
      const V = v.let("ruleErrs", null);
      return v.try(() => F((0, e._)`await `), (U) => v.assign(w, !1).if((0, e._)`${U} instanceof ${b.ValidationError}`, () => v.assign(V, (0, e._)`${U}.errors`), () => v.throw(U))), V;
    }
    function M() {
      const V = (0, e._)`${_}.errors`;
      return v.assign(V, null), F(e.nil), V;
    }
    function F(V = y.async ? (0, e._)`await ` : e.nil) {
      const U = b.opts.passContext ? t.default.this : t.default.self, z = !("compile" in y && !g || y.schema === !1);
      v.assign(w, (0, e._)`${V}${(0, u.callValidateCode)(h, _, U, z)}`, y.modifying);
    }
    function j(V) {
      var U;
      v.if((0, e.not)((U = y.valid) !== null && U !== void 0 ? U : w), V);
    }
  }
  Ot.funcKeywordCode = r;
  function n(h) {
    const { gen: y, data: $, it: v } = h;
    y.if(v.parentData, () => y.assign($, (0, e._)`${v.parentData}[${v.parentDataProperty}]`));
  }
  function s(h, y) {
    const { gen: $ } = h;
    $.if((0, e._)`Array.isArray(${y})`, () => {
      $.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${y} : ${t.default.vErrors}.concat(${y})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, a.extendErrors)(h);
    }, () => h.error());
  }
  function i({ schemaEnv: h }, y) {
    if (y.async && !h.$async)
      throw new Error("async keyword in sync schema");
  }
  function c(h, y, $) {
    if ($ === void 0)
      throw new Error(`keyword "${y}" failed to compile`);
    return h.scopeValue("keyword", typeof $ == "function" ? { ref: $ } : { ref: $, code: (0, e.stringify)($) });
  }
  function o(h, y, $ = !1) {
    return !y.length || y.some((v) => v === "array" ? Array.isArray(h) : v === "object" ? h && typeof h == "object" && !Array.isArray(h) : typeof h == v || $ && typeof h > "u");
  }
  Ot.validSchemaType = o;
  function p({ schema: h, opts: y, self: $, errSchemaPath: v }, f, m) {
    if (Array.isArray(f.keyword) ? !f.keyword.includes(m) : f.keyword !== m)
      throw new Error("ajv implementation error");
    const l = f.dependencies;
    if (l?.some((g) => !Object.prototype.hasOwnProperty.call(h, g)))
      throw new Error(`parent schema must have dependencies of ${m}: ${l.join(",")}`);
    if (f.validateSchema && !f.validateSchema(h[m])) {
      const b = `keyword "${m}" value is invalid at path "${v}": ` + $.errorsText(f.validateSchema.errors);
      if (y.validateSchema === "log")
        $.logger.error(b);
      else
        throw new Error(b);
    }
  }
  return Ot.validateKeywordUsage = p, Ot;
}
var Gt = {}, pf;
function __() {
  if (pf) return Gt;
  pf = 1, Object.defineProperty(Gt, "__esModule", { value: !0 }), Gt.extendSubschemaMode = Gt.extendSubschemaData = Gt.getSubschema = void 0;
  const e = De(), t = Fe();
  function u(r, { keyword: n, schemaProp: s, schema: i, schemaPath: c, errSchemaPath: o, topSchemaRef: p }) {
    if (n !== void 0 && i !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (n !== void 0) {
      const h = r.schema[n];
      return s === void 0 ? {
        schema: h,
        schemaPath: (0, e._)`${r.schemaPath}${(0, e.getProperty)(n)}`,
        errSchemaPath: `${r.errSchemaPath}/${n}`
      } : {
        schema: h[s],
        schemaPath: (0, e._)`${r.schemaPath}${(0, e.getProperty)(n)}${(0, e.getProperty)(s)}`,
        errSchemaPath: `${r.errSchemaPath}/${n}/${(0, t.escapeFragment)(s)}`
      };
    }
    if (i !== void 0) {
      if (c === void 0 || o === void 0 || p === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: i,
        schemaPath: c,
        topSchemaRef: p,
        errSchemaPath: o
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Gt.getSubschema = u;
  function a(r, n, { dataProp: s, dataPropType: i, data: c, dataTypes: o, propertyName: p }) {
    if (c !== void 0 && s !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: h } = n;
    if (s !== void 0) {
      const { errorPath: $, dataPathArr: v, opts: f } = n, m = h.let("data", (0, e._)`${n.data}${(0, e.getProperty)(s)}`, !0);
      y(m), r.errorPath = (0, e.str)`${$}${(0, t.getErrorPath)(s, i, f.jsPropertySyntax)}`, r.parentDataProperty = (0, e._)`${s}`, r.dataPathArr = [...v, r.parentDataProperty];
    }
    if (c !== void 0) {
      const $ = c instanceof e.Name ? c : h.let("data", c, !0);
      y($), p !== void 0 && (r.propertyName = p);
    }
    o && (r.dataTypes = o);
    function y($) {
      r.data = $, r.dataLevel = n.dataLevel + 1, r.dataTypes = [], n.definedProperties = /* @__PURE__ */ new Set(), r.parentData = n.data, r.dataNames = [...n.dataNames, $];
    }
  }
  Gt.extendSubschemaData = a;
  function d(r, { jtdDiscriminator: n, jtdMetadata: s, compositeRule: i, createErrors: c, allErrors: o }) {
    i !== void 0 && (r.compositeRule = i), c !== void 0 && (r.createErrors = c), o !== void 0 && (r.allErrors = o), r.jtdDiscriminator = n, r.jtdMetadata = s;
  }
  return Gt.extendSubschemaMode = d, Gt;
}
var ct = {}, Oo = { exports: {} }, mf;
function $_() {
  if (mf) return Oo.exports;
  mf = 1;
  var e = Oo.exports = function(a, d, r) {
    typeof d == "function" && (r = d, d = {}), r = d.cb || r;
    var n = typeof r == "function" ? r : r.pre || function() {
    }, s = r.post || function() {
    };
    t(d, n, s, a, "", a);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function t(a, d, r, n, s, i, c, o, p, h) {
    if (n && typeof n == "object" && !Array.isArray(n)) {
      d(n, s, i, c, o, p, h);
      for (var y in n) {
        var $ = n[y];
        if (Array.isArray($)) {
          if (y in e.arrayKeywords)
            for (var v = 0; v < $.length; v++)
              t(a, d, r, $[v], s + "/" + y + "/" + v, i, s, y, n, v);
        } else if (y in e.propsKeywords) {
          if ($ && typeof $ == "object")
            for (var f in $)
              t(a, d, r, $[f], s + "/" + y + "/" + u(f), i, s, y, n, f);
        } else (y in e.keywords || a.allKeys && !(y in e.skipKeywords)) && t(a, d, r, $, s + "/" + y, i, s, y, n);
      }
      r(n, s, i, c, o, p, h);
    }
  }
  function u(a) {
    return a.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Oo.exports;
}
var yf;
function Ya() {
  if (yf) return ct;
  yf = 1, Object.defineProperty(ct, "__esModule", { value: !0 }), ct.getSchemaRefs = ct.resolveUrl = ct.normalizeId = ct._getFullPath = ct.getFullPath = ct.inlineRef = void 0;
  const e = Fe(), t = Ba(), u = $_(), a = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function d(v, f = !0) {
    return typeof v == "boolean" ? !0 : f === !0 ? !n(v) : f ? s(v) <= f : !1;
  }
  ct.inlineRef = d;
  const r = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function n(v) {
    for (const f in v) {
      if (r.has(f))
        return !0;
      const m = v[f];
      if (Array.isArray(m) && m.some(n) || typeof m == "object" && n(m))
        return !0;
    }
    return !1;
  }
  function s(v) {
    let f = 0;
    for (const m in v) {
      if (m === "$ref")
        return 1 / 0;
      if (f++, !a.has(m) && (typeof v[m] == "object" && (0, e.eachItem)(v[m], (l) => f += s(l)), f === 1 / 0))
        return 1 / 0;
    }
    return f;
  }
  function i(v, f = "", m) {
    m !== !1 && (f = p(f));
    const l = v.parse(f);
    return c(v, l);
  }
  ct.getFullPath = i;
  function c(v, f) {
    return v.serialize(f).split("#")[0] + "#";
  }
  ct._getFullPath = c;
  const o = /#\/?$/;
  function p(v) {
    return v ? v.replace(o, "") : "";
  }
  ct.normalizeId = p;
  function h(v, f, m) {
    return m = p(m), v.resolve(f, m);
  }
  ct.resolveUrl = h;
  const y = /^[a-z_][-a-z0-9._]*$/i;
  function $(v, f) {
    if (typeof v == "boolean")
      return {};
    const { schemaId: m, uriResolver: l } = this.opts, g = p(v[m] || f), b = { "": g }, S = i(l, g, !1), _ = {}, w = /* @__PURE__ */ new Set();
    return u(v, { allKeys: !0 }, (M, F, j, V) => {
      if (V === void 0)
        return;
      const U = S + F;
      let z = b[V];
      typeof M[m] == "string" && (z = W.call(this, M[m])), Q.call(this, M.$anchor), Q.call(this, M.$dynamicAnchor), b[F] = z;
      function W(ee) {
        const ne = this.opts.uriResolver.resolve;
        if (ee = p(z ? ne(z, ee) : ee), w.has(ee))
          throw T(ee);
        w.add(ee);
        let K = this.refs[ee];
        return typeof K == "string" && (K = this.refs[K]), typeof K == "object" ? R(M, K.schema, ee) : ee !== p(U) && (ee[0] === "#" ? (R(M, _[ee], ee), _[ee] = M) : this.refs[ee] = U), ee;
      }
      function Q(ee) {
        if (typeof ee == "string") {
          if (!y.test(ee))
            throw new Error(`invalid anchor "${ee}"`);
          W.call(this, `#${ee}`);
        }
      }
    }), _;
    function R(M, F, j) {
      if (F !== void 0 && !t(M, F))
        throw T(j);
    }
    function T(M) {
      return new Error(`reference "${M}" resolves to more than one schema`);
    }
  }
  return ct.getSchemaRefs = $, ct;
}
var gf;
function Ja() {
  if (gf) return Bt;
  gf = 1, Object.defineProperty(Bt, "__esModule", { value: !0 }), Bt.getData = Bt.KeywordCxt = Bt.validateFunctionCode = void 0;
  const e = y_(), t = ja(), u = Fm(), a = ja(), d = g_(), r = v_(), n = __(), s = De(), i = or(), c = Ya(), o = Fe(), p = Wa();
  function h(C) {
    if (S(C) && (w(C), b(C))) {
      f(C);
      return;
    }
    y(C, () => (0, e.topBoolOrEmptySchema)(C));
  }
  Bt.validateFunctionCode = h;
  function y({ gen: C, validateName: k, schema: H, schemaEnv: Y, opts: Z }, le) {
    Z.code.es5 ? C.func(k, (0, s._)`${i.default.data}, ${i.default.valCxt}`, Y.$async, () => {
      C.code((0, s._)`"use strict"; ${l(H, Z)}`), v(C, Z), C.code(le);
    }) : C.func(k, (0, s._)`${i.default.data}, ${$(Z)}`, Y.$async, () => C.code(l(H, Z)).code(le));
  }
  function $(C) {
    return (0, s._)`{${i.default.instancePath}="", ${i.default.parentData}, ${i.default.parentDataProperty}, ${i.default.rootData}=${i.default.data}${C.dynamicRef ? (0, s._)`, ${i.default.dynamicAnchors}={}` : s.nil}}={}`;
  }
  function v(C, k) {
    C.if(i.default.valCxt, () => {
      C.var(i.default.instancePath, (0, s._)`${i.default.valCxt}.${i.default.instancePath}`), C.var(i.default.parentData, (0, s._)`${i.default.valCxt}.${i.default.parentData}`), C.var(i.default.parentDataProperty, (0, s._)`${i.default.valCxt}.${i.default.parentDataProperty}`), C.var(i.default.rootData, (0, s._)`${i.default.valCxt}.${i.default.rootData}`), k.dynamicRef && C.var(i.default.dynamicAnchors, (0, s._)`${i.default.valCxt}.${i.default.dynamicAnchors}`);
    }, () => {
      C.var(i.default.instancePath, (0, s._)`""`), C.var(i.default.parentData, (0, s._)`undefined`), C.var(i.default.parentDataProperty, (0, s._)`undefined`), C.var(i.default.rootData, i.default.data), k.dynamicRef && C.var(i.default.dynamicAnchors, (0, s._)`{}`);
    });
  }
  function f(C) {
    const { schema: k, opts: H, gen: Y } = C;
    y(C, () => {
      H.$comment && k.$comment && V(C), M(C), Y.let(i.default.vErrors, null), Y.let(i.default.errors, 0), H.unevaluated && m(C), R(C), U(C);
    });
  }
  function m(C) {
    const { gen: k, validateName: H } = C;
    C.evaluated = k.const("evaluated", (0, s._)`${H}.evaluated`), k.if((0, s._)`${C.evaluated}.dynamicProps`, () => k.assign((0, s._)`${C.evaluated}.props`, (0, s._)`undefined`)), k.if((0, s._)`${C.evaluated}.dynamicItems`, () => k.assign((0, s._)`${C.evaluated}.items`, (0, s._)`undefined`));
  }
  function l(C, k) {
    const H = typeof C == "object" && C[k.schemaId];
    return H && (k.code.source || k.code.process) ? (0, s._)`/*# sourceURL=${H} */` : s.nil;
  }
  function g(C, k) {
    if (S(C) && (w(C), b(C))) {
      _(C, k);
      return;
    }
    (0, e.boolOrEmptySchema)(C, k);
  }
  function b({ schema: C, self: k }) {
    if (typeof C == "boolean")
      return !C;
    for (const H in C)
      if (k.RULES.all[H])
        return !0;
    return !1;
  }
  function S(C) {
    return typeof C.schema != "boolean";
  }
  function _(C, k) {
    const { schema: H, gen: Y, opts: Z } = C;
    Z.$comment && H.$comment && V(C), F(C), j(C);
    const le = Y.const("_errs", i.default.errors);
    R(C, le), Y.var(k, (0, s._)`${le} === ${i.default.errors}`);
  }
  function w(C) {
    (0, o.checkUnknownRules)(C), T(C);
  }
  function R(C, k) {
    if (C.opts.jtd)
      return W(C, [], !1, k);
    const H = (0, t.getSchemaTypes)(C.schema), Y = (0, t.coerceAndCheckDataType)(C, H);
    W(C, H, !Y, k);
  }
  function T(C) {
    const { schema: k, errSchemaPath: H, opts: Y, self: Z } = C;
    k.$ref && Y.ignoreKeywordsWithRef && (0, o.schemaHasRulesButRef)(k, Z.RULES) && Z.logger.warn(`$ref: keywords ignored in schema at path "${H}"`);
  }
  function M(C) {
    const { schema: k, opts: H } = C;
    k.default !== void 0 && H.useDefaults && H.strictSchema && (0, o.checkStrictMode)(C, "default is ignored in the schema root");
  }
  function F(C) {
    const k = C.schema[C.opts.schemaId];
    k && (C.baseId = (0, c.resolveUrl)(C.opts.uriResolver, C.baseId, k));
  }
  function j(C) {
    if (C.schema.$async && !C.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function V({ gen: C, schemaEnv: k, schema: H, errSchemaPath: Y, opts: Z }) {
    const le = H.$comment;
    if (Z.$comment === !0)
      C.code((0, s._)`${i.default.self}.logger.log(${le})`);
    else if (typeof Z.$comment == "function") {
      const ve = (0, s.str)`${Y}/$comment`, Te = C.scopeValue("root", { ref: k.root });
      C.code((0, s._)`${i.default.self}.opts.$comment(${le}, ${ve}, ${Te}.schema)`);
    }
  }
  function U(C) {
    const { gen: k, schemaEnv: H, validateName: Y, ValidationError: Z, opts: le } = C;
    H.$async ? k.if((0, s._)`${i.default.errors} === 0`, () => k.return(i.default.data), () => k.throw((0, s._)`new ${Z}(${i.default.vErrors})`)) : (k.assign((0, s._)`${Y}.errors`, i.default.vErrors), le.unevaluated && z(C), k.return((0, s._)`${i.default.errors} === 0`));
  }
  function z({ gen: C, evaluated: k, props: H, items: Y }) {
    H instanceof s.Name && C.assign((0, s._)`${k}.props`, H), Y instanceof s.Name && C.assign((0, s._)`${k}.items`, Y);
  }
  function W(C, k, H, Y) {
    const { gen: Z, schema: le, data: ve, allErrors: Te, opts: ke, self: Ae } = C, { RULES: E } = Ae;
    if (le.$ref && (ke.ignoreKeywordsWithRef || !(0, o.schemaHasRulesButRef)(le, E))) {
      Z.block(() => N(C, "$ref", E.all.$ref.definition));
      return;
    }
    ke.jtd || ee(C, k), Z.block(() => {
      for (const re of E.rules)
        te(re);
      te(E.post);
    });
    function te(re) {
      (0, u.shouldUseGroup)(le, re) && (re.type ? (Z.if((0, a.checkDataType)(re.type, ve, ke.strictNumbers)), Q(C, re), k.length === 1 && k[0] === re.type && H && (Z.else(), (0, a.reportTypeError)(C)), Z.endIf()) : Q(C, re), Te || Z.if((0, s._)`${i.default.errors} === ${Y || 0}`));
    }
  }
  function Q(C, k) {
    const { gen: H, schema: Y, opts: { useDefaults: Z } } = C;
    Z && (0, d.assignDefaults)(C, k.type), H.block(() => {
      for (const le of k.rules)
        (0, u.shouldUseRule)(Y, le) && N(C, le.keyword, le.definition, k.type);
    });
  }
  function ee(C, k) {
    C.schemaEnv.meta || !C.opts.strictTypes || (ne(C, k), C.opts.allowUnionTypes || K(C, k), I(C, C.dataTypes));
  }
  function ne(C, k) {
    if (k.length) {
      if (!C.dataTypes.length) {
        C.dataTypes = k;
        return;
      }
      k.forEach((H) => {
        D(C.dataTypes, H) || O(C, `type "${H}" not allowed by context "${C.dataTypes.join(",")}"`);
      }), P(C, k);
    }
  }
  function K(C, k) {
    k.length > 1 && !(k.length === 2 && k.includes("null")) && O(C, "use allowUnionTypes to allow union type keyword");
  }
  function I(C, k) {
    const H = C.self.RULES.all;
    for (const Y in H) {
      const Z = H[Y];
      if (typeof Z == "object" && (0, u.shouldUseRule)(C.schema, Z)) {
        const { type: le } = Z.definition;
        le.length && !le.some((ve) => G(k, ve)) && O(C, `missing type "${le.join(",")}" for keyword "${Y}"`);
      }
    }
  }
  function G(C, k) {
    return C.includes(k) || k === "number" && C.includes("integer");
  }
  function D(C, k) {
    return C.includes(k) || k === "integer" && C.includes("number");
  }
  function P(C, k) {
    const H = [];
    for (const Y of C.dataTypes)
      D(k, Y) ? H.push(Y) : k.includes("integer") && Y === "number" && H.push("integer");
    C.dataTypes = H;
  }
  function O(C, k) {
    const H = C.schemaEnv.baseId + C.errSchemaPath;
    k += ` at "${H}" (strictTypes)`, (0, o.checkStrictMode)(C, k, C.opts.strictTypes);
  }
  class L {
    constructor(k, H, Y) {
      if ((0, r.validateKeywordUsage)(k, H, Y), this.gen = k.gen, this.allErrors = k.allErrors, this.keyword = Y, this.data = k.data, this.schema = k.schema[Y], this.$data = H.$data && k.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, o.schemaRefOrVal)(k, this.schema, Y, this.$data), this.schemaType = H.schemaType, this.parentSchema = k.schema, this.params = {}, this.it = k, this.def = H, this.$data)
        this.schemaCode = k.gen.const("vSchema", B(this.$data, k));
      else if (this.schemaCode = this.schemaValue, !(0, r.validSchemaType)(this.schema, H.schemaType, H.allowUndefined))
        throw new Error(`${Y} value must be ${JSON.stringify(H.schemaType)}`);
      ("code" in H ? H.trackErrors : H.errors !== !1) && (this.errsCount = k.gen.const("_errs", i.default.errors));
    }
    result(k, H, Y) {
      this.failResult((0, s.not)(k), H, Y);
    }
    failResult(k, H, Y) {
      this.gen.if(k), Y ? Y() : this.error(), H ? (this.gen.else(), H(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(k, H) {
      this.failResult((0, s.not)(k), void 0, H);
    }
    fail(k) {
      if (k === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(k), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(k) {
      if (!this.$data)
        return this.fail(k);
      const { schemaCode: H } = this;
      this.fail((0, s._)`${H} !== undefined && (${(0, s.or)(this.invalid$data(), k)})`);
    }
    error(k, H, Y) {
      if (H) {
        this.setParams(H), this._error(k, Y), this.setParams({});
        return;
      }
      this._error(k, Y);
    }
    _error(k, H) {
      (k ? p.reportExtraError : p.reportError)(this, this.def.error, H);
    }
    $dataError() {
      (0, p.reportError)(this, this.def.$dataError || p.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, p.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(k) {
      this.allErrors || this.gen.if(k);
    }
    setParams(k, H) {
      H ? Object.assign(this.params, k) : this.params = k;
    }
    block$data(k, H, Y = s.nil) {
      this.gen.block(() => {
        this.check$data(k, Y), H();
      });
    }
    check$data(k = s.nil, H = s.nil) {
      if (!this.$data)
        return;
      const { gen: Y, schemaCode: Z, schemaType: le, def: ve } = this;
      Y.if((0, s.or)((0, s._)`${Z} === undefined`, H)), k !== s.nil && Y.assign(k, !0), (le.length || ve.validateSchema) && (Y.elseIf(this.invalid$data()), this.$dataError(), k !== s.nil && Y.assign(k, !1)), Y.else();
    }
    invalid$data() {
      const { gen: k, schemaCode: H, schemaType: Y, def: Z, it: le } = this;
      return (0, s.or)(ve(), Te());
      function ve() {
        if (Y.length) {
          if (!(H instanceof s.Name))
            throw new Error("ajv implementation error");
          const ke = Array.isArray(Y) ? Y : [Y];
          return (0, s._)`${(0, a.checkDataTypes)(ke, H, le.opts.strictNumbers, a.DataType.Wrong)}`;
        }
        return s.nil;
      }
      function Te() {
        if (Z.validateSchema) {
          const ke = k.scopeValue("validate$data", { ref: Z.validateSchema });
          return (0, s._)`!${ke}(${H})`;
        }
        return s.nil;
      }
    }
    subschema(k, H) {
      const Y = (0, n.getSubschema)(this.it, k);
      (0, n.extendSubschemaData)(Y, this.it, k), (0, n.extendSubschemaMode)(Y, k);
      const Z = { ...this.it, ...Y, items: void 0, props: void 0 };
      return g(Z, H), Z;
    }
    mergeEvaluated(k, H) {
      const { it: Y, gen: Z } = this;
      Y.opts.unevaluated && (Y.props !== !0 && k.props !== void 0 && (Y.props = o.mergeEvaluated.props(Z, k.props, Y.props, H)), Y.items !== !0 && k.items !== void 0 && (Y.items = o.mergeEvaluated.items(Z, k.items, Y.items, H)));
    }
    mergeValidEvaluated(k, H) {
      const { it: Y, gen: Z } = this;
      if (Y.opts.unevaluated && (Y.props !== !0 || Y.items !== !0))
        return Z.if(H, () => this.mergeEvaluated(k, s.Name)), !0;
    }
  }
  Bt.KeywordCxt = L;
  function N(C, k, H, Y) {
    const Z = new L(C, H, k);
    "code" in H ? H.code(Z, Y) : Z.$data && H.validate ? (0, r.funcKeywordCode)(Z, H) : "macro" in H ? (0, r.macroKeywordCode)(Z, H) : (H.compile || H.validate) && (0, r.funcKeywordCode)(Z, H);
  }
  const A = /^\/(?:[^~]|~0|~1)*$/, J = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function B(C, { dataLevel: k, dataNames: H, dataPathArr: Y }) {
    let Z, le;
    if (C === "")
      return i.default.rootData;
    if (C[0] === "/") {
      if (!A.test(C))
        throw new Error(`Invalid JSON-pointer: ${C}`);
      Z = C, le = i.default.rootData;
    } else {
      const Ae = J.exec(C);
      if (!Ae)
        throw new Error(`Invalid JSON-pointer: ${C}`);
      const E = +Ae[1];
      if (Z = Ae[2], Z === "#") {
        if (E >= k)
          throw new Error(ke("property/index", E));
        return Y[k - E];
      }
      if (E > k)
        throw new Error(ke("data", E));
      if (le = H[k - E], !Z)
        return le;
    }
    let ve = le;
    const Te = Z.split("/");
    for (const Ae of Te)
      Ae && (le = (0, s._)`${le}${(0, s.getProperty)((0, o.unescapeJsonPointer)(Ae))}`, ve = (0, s._)`${ve} && ${le}`);
    return ve;
    function ke(Ae, E) {
      return `Cannot access ${Ae} ${E} levels up, current level is ${k}`;
    }
  }
  return Bt.getData = B, Bt;
}
var ji = {}, vf;
function Bu() {
  if (vf) return ji;
  vf = 1, Object.defineProperty(ji, "__esModule", { value: !0 });
  class e extends Error {
    constructor(u) {
      super("validation failed"), this.errors = u, this.ajv = this.validation = !0;
    }
  }
  return ji.default = e, ji;
}
var Ui = {}, _f;
function Xa() {
  if (_f) return Ui;
  _f = 1, Object.defineProperty(Ui, "__esModule", { value: !0 });
  const e = Ya();
  class t extends Error {
    constructor(a, d, r, n) {
      super(n || `can't resolve reference ${r} from id ${d}`), this.missingRef = (0, e.resolveUrl)(a, d, r), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(a, this.missingRef));
    }
  }
  return Ui.default = t, Ui;
}
var gt = {}, $f;
function Hu() {
  if ($f) return gt;
  $f = 1, Object.defineProperty(gt, "__esModule", { value: !0 }), gt.resolveSchema = gt.getCompilingSchema = gt.resolveRef = gt.compileSchema = gt.SchemaEnv = void 0;
  const e = De(), t = Bu(), u = or(), a = Ya(), d = Fe(), r = Ja();
  class n {
    constructor(m) {
      var l;
      this.refs = {}, this.dynamicAnchors = {};
      let g;
      typeof m.schema == "object" && (g = m.schema), this.schema = m.schema, this.schemaId = m.schemaId, this.root = m.root || this, this.baseId = (l = m.baseId) !== null && l !== void 0 ? l : (0, a.normalizeId)(g?.[m.schemaId || "$id"]), this.schemaPath = m.schemaPath, this.localRefs = m.localRefs, this.meta = m.meta, this.$async = g?.$async, this.refs = {};
    }
  }
  gt.SchemaEnv = n;
  function s(f) {
    const m = o.call(this, f);
    if (m)
      return m;
    const l = (0, a.getFullPath)(this.opts.uriResolver, f.root.baseId), { es5: g, lines: b } = this.opts.code, { ownProperties: S } = this.opts, _ = new e.CodeGen(this.scope, { es5: g, lines: b, ownProperties: S });
    let w;
    f.$async && (w = _.scopeValue("Error", {
      ref: t.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const R = _.scopeName("validate");
    f.validateName = R;
    const T = {
      gen: _,
      allErrors: this.opts.allErrors,
      data: u.default.data,
      parentData: u.default.parentData,
      parentDataProperty: u.default.parentDataProperty,
      dataNames: [u.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: _.scopeValue("schema", this.opts.code.source === !0 ? { ref: f.schema, code: (0, e.stringify)(f.schema) } : { ref: f.schema }),
      validateName: R,
      ValidationError: w,
      schema: f.schema,
      schemaEnv: f,
      rootId: l,
      baseId: f.baseId || l,
      schemaPath: e.nil,
      errSchemaPath: f.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let M;
    try {
      this._compilations.add(f), (0, r.validateFunctionCode)(T), _.optimize(this.opts.code.optimize);
      const F = _.toString();
      M = `${_.scopeRefs(u.default.scope)}return ${F}`, this.opts.code.process && (M = this.opts.code.process(M, f));
      const V = new Function(`${u.default.self}`, `${u.default.scope}`, M)(this, this.scope.get());
      if (this.scope.value(R, { ref: V }), V.errors = null, V.schema = f.schema, V.schemaEnv = f, f.$async && (V.$async = !0), this.opts.code.source === !0 && (V.source = { validateName: R, validateCode: F, scopeValues: _._values }), this.opts.unevaluated) {
        const { props: U, items: z } = T;
        V.evaluated = {
          props: U instanceof e.Name ? void 0 : U,
          items: z instanceof e.Name ? void 0 : z,
          dynamicProps: U instanceof e.Name,
          dynamicItems: z instanceof e.Name
        }, V.source && (V.source.evaluated = (0, e.stringify)(V.evaluated));
      }
      return f.validate = V, f;
    } catch (F) {
      throw delete f.validate, delete f.validateName, M && this.logger.error("Error compiling schema, function code:", M), F;
    } finally {
      this._compilations.delete(f);
    }
  }
  gt.compileSchema = s;
  function i(f, m, l) {
    var g;
    l = (0, a.resolveUrl)(this.opts.uriResolver, m, l);
    const b = f.refs[l];
    if (b)
      return b;
    let S = h.call(this, f, l);
    if (S === void 0) {
      const _ = (g = f.localRefs) === null || g === void 0 ? void 0 : g[l], { schemaId: w } = this.opts;
      _ && (S = new n({ schema: _, schemaId: w, root: f, baseId: m }));
    }
    if (S !== void 0)
      return f.refs[l] = c.call(this, S);
  }
  gt.resolveRef = i;
  function c(f) {
    return (0, a.inlineRef)(f.schema, this.opts.inlineRefs) ? f.schema : f.validate ? f : s.call(this, f);
  }
  function o(f) {
    for (const m of this._compilations)
      if (p(m, f))
        return m;
  }
  gt.getCompilingSchema = o;
  function p(f, m) {
    return f.schema === m.schema && f.root === m.root && f.baseId === m.baseId;
  }
  function h(f, m) {
    let l;
    for (; typeof (l = this.refs[m]) == "string"; )
      m = l;
    return l || this.schemas[m] || y.call(this, f, m);
  }
  function y(f, m) {
    const l = this.opts.uriResolver.parse(m), g = (0, a._getFullPath)(this.opts.uriResolver, l);
    let b = (0, a.getFullPath)(this.opts.uriResolver, f.baseId, void 0);
    if (Object.keys(f.schema).length > 0 && g === b)
      return v.call(this, l, f);
    const S = (0, a.normalizeId)(g), _ = this.refs[S] || this.schemas[S];
    if (typeof _ == "string") {
      const w = y.call(this, f, _);
      return typeof w?.schema != "object" ? void 0 : v.call(this, l, w);
    }
    if (typeof _?.schema == "object") {
      if (_.validate || s.call(this, _), S === (0, a.normalizeId)(m)) {
        const { schema: w } = _, { schemaId: R } = this.opts, T = w[R];
        return T && (b = (0, a.resolveUrl)(this.opts.uriResolver, b, T)), new n({ schema: w, schemaId: R, root: f, baseId: b });
      }
      return v.call(this, l, _);
    }
  }
  gt.resolveSchema = y;
  const $ = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function v(f, { baseId: m, schema: l, root: g }) {
    var b;
    if (((b = f.fragment) === null || b === void 0 ? void 0 : b[0]) !== "/")
      return;
    for (const w of f.fragment.slice(1).split("/")) {
      if (typeof l == "boolean")
        return;
      const R = l[(0, d.unescapeFragment)(w)];
      if (R === void 0)
        return;
      l = R;
      const T = typeof l == "object" && l[this.opts.schemaId];
      !$.has(w) && T && (m = (0, a.resolveUrl)(this.opts.uriResolver, m, T));
    }
    let S;
    if (typeof l != "boolean" && l.$ref && !(0, d.schemaHasRulesButRef)(l, this.RULES)) {
      const w = (0, a.resolveUrl)(this.opts.uriResolver, m, l.$ref);
      S = y.call(this, g, w);
    }
    const { schemaId: _ } = this.opts;
    if (S = S || new n({ schema: l, schemaId: _, root: g, baseId: m }), S.schema !== S.root.schema)
      return S;
  }
  return gt;
}
const w_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", E_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", b_ = "object", S_ = ["$data"], P_ = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, R_ = !1, T_ = {
  $id: w_,
  description: E_,
  type: b_,
  required: S_,
  properties: P_,
  additionalProperties: R_
};
var Li = {}, wf;
function O_() {
  if (wf) return Li;
  wf = 1, Object.defineProperty(Li, "__esModule", { value: !0 });
  const e = Am();
  return e.code = 'require("ajv/dist/runtime/uri").default', Li.default = e, Li;
}
var Ef;
function A_() {
  return Ef || (Ef = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var t = Ja();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return t.KeywordCxt;
    } });
    var u = De();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return u._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return u.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return u.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return u.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return u.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return u.CodeGen;
    } });
    const a = Bu(), d = Xa(), r = qm(), n = Hu(), s = De(), i = Ya(), c = ja(), o = Fe(), p = T_, h = O_(), y = (K, I) => new RegExp(K, I);
    y.code = "new RegExp";
    const $ = ["removeAdditional", "useDefaults", "coerceTypes"], v = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), f = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, m = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, l = 200;
    function g(K) {
      var I, G, D, P, O, L, N, A, J, B, C, k, H, Y, Z, le, ve, Te, ke, Ae, E, te, re, pe, ae;
      const de = K.strict, ce = (I = K.code) === null || I === void 0 ? void 0 : I.optimize, me = ce === !0 || ce === void 0 ? 1 : ce || 0, we = (D = (G = K.code) === null || G === void 0 ? void 0 : G.regExp) !== null && D !== void 0 ? D : y, be = (P = K.uriResolver) !== null && P !== void 0 ? P : h.default;
      return {
        strictSchema: (L = (O = K.strictSchema) !== null && O !== void 0 ? O : de) !== null && L !== void 0 ? L : !0,
        strictNumbers: (A = (N = K.strictNumbers) !== null && N !== void 0 ? N : de) !== null && A !== void 0 ? A : !0,
        strictTypes: (B = (J = K.strictTypes) !== null && J !== void 0 ? J : de) !== null && B !== void 0 ? B : "log",
        strictTuples: (k = (C = K.strictTuples) !== null && C !== void 0 ? C : de) !== null && k !== void 0 ? k : "log",
        strictRequired: (Y = (H = K.strictRequired) !== null && H !== void 0 ? H : de) !== null && Y !== void 0 ? Y : !1,
        code: K.code ? { ...K.code, optimize: me, regExp: we } : { optimize: me, regExp: we },
        loopRequired: (Z = K.loopRequired) !== null && Z !== void 0 ? Z : l,
        loopEnum: (le = K.loopEnum) !== null && le !== void 0 ? le : l,
        meta: (ve = K.meta) !== null && ve !== void 0 ? ve : !0,
        messages: (Te = K.messages) !== null && Te !== void 0 ? Te : !0,
        inlineRefs: (ke = K.inlineRefs) !== null && ke !== void 0 ? ke : !0,
        schemaId: (Ae = K.schemaId) !== null && Ae !== void 0 ? Ae : "$id",
        addUsedSchema: (E = K.addUsedSchema) !== null && E !== void 0 ? E : !0,
        validateSchema: (te = K.validateSchema) !== null && te !== void 0 ? te : !0,
        validateFormats: (re = K.validateFormats) !== null && re !== void 0 ? re : !0,
        unicodeRegExp: (pe = K.unicodeRegExp) !== null && pe !== void 0 ? pe : !0,
        int32range: (ae = K.int32range) !== null && ae !== void 0 ? ae : !0,
        uriResolver: be
      };
    }
    class b {
      constructor(I = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), I = this.opts = { ...I, ...g(I) };
        const { es5: G, lines: D } = this.opts.code;
        this.scope = new s.ValueScope({ scope: {}, prefixes: v, es5: G, lines: D }), this.logger = j(I.logger);
        const P = I.validateFormats;
        I.validateFormats = !1, this.RULES = (0, r.getRules)(), S.call(this, f, I, "NOT SUPPORTED"), S.call(this, m, I, "DEPRECATED", "warn"), this._metaOpts = M.call(this), I.formats && R.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), I.keywords && T.call(this, I.keywords), typeof I.meta == "object" && this.addMetaSchema(I.meta), w.call(this), I.validateFormats = P;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: I, meta: G, schemaId: D } = this.opts;
        let P = p;
        D === "id" && (P = { ...p }, P.id = P.$id, delete P.$id), G && I && this.addMetaSchema(P, P[D], !1);
      }
      defaultMeta() {
        const { meta: I, schemaId: G } = this.opts;
        return this.opts.defaultMeta = typeof I == "object" ? I[G] || I : void 0;
      }
      validate(I, G) {
        let D;
        if (typeof I == "string") {
          if (D = this.getSchema(I), !D)
            throw new Error(`no schema with key or ref "${I}"`);
        } else
          D = this.compile(I);
        const P = D(G);
        return "$async" in D || (this.errors = D.errors), P;
      }
      compile(I, G) {
        const D = this._addSchema(I, G);
        return D.validate || this._compileSchemaEnv(D);
      }
      compileAsync(I, G) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: D } = this.opts;
        return P.call(this, I, G);
        async function P(B, C) {
          await O.call(this, B.$schema);
          const k = this._addSchema(B, C);
          return k.validate || L.call(this, k);
        }
        async function O(B) {
          B && !this.getSchema(B) && await P.call(this, { $ref: B }, !0);
        }
        async function L(B) {
          try {
            return this._compileSchemaEnv(B);
          } catch (C) {
            if (!(C instanceof d.default))
              throw C;
            return N.call(this, C), await A.call(this, C.missingSchema), L.call(this, B);
          }
        }
        function N({ missingSchema: B, missingRef: C }) {
          if (this.refs[B])
            throw new Error(`AnySchema ${B} is loaded but ${C} cannot be resolved`);
        }
        async function A(B) {
          const C = await J.call(this, B);
          this.refs[B] || await O.call(this, C.$schema), this.refs[B] || this.addSchema(C, B, G);
        }
        async function J(B) {
          const C = this._loading[B];
          if (C)
            return C;
          try {
            return await (this._loading[B] = D(B));
          } finally {
            delete this._loading[B];
          }
        }
      }
      // Adds schema to the instance
      addSchema(I, G, D, P = this.opts.validateSchema) {
        if (Array.isArray(I)) {
          for (const L of I)
            this.addSchema(L, void 0, D, P);
          return this;
        }
        let O;
        if (typeof I == "object") {
          const { schemaId: L } = this.opts;
          if (O = I[L], O !== void 0 && typeof O != "string")
            throw new Error(`schema ${L} must be string`);
        }
        return G = (0, i.normalizeId)(G || O), this._checkUnique(G), this.schemas[G] = this._addSchema(I, D, G, P, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(I, G, D = this.opts.validateSchema) {
        return this.addSchema(I, G, !0, D), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(I, G) {
        if (typeof I == "boolean")
          return !0;
        let D;
        if (D = I.$schema, D !== void 0 && typeof D != "string")
          throw new Error("$schema must be a string");
        if (D = D || this.opts.defaultMeta || this.defaultMeta(), !D)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const P = this.validate(D, I);
        if (!P && G) {
          const O = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(O);
          else
            throw new Error(O);
        }
        return P;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(I) {
        let G;
        for (; typeof (G = _.call(this, I)) == "string"; )
          I = G;
        if (G === void 0) {
          const { schemaId: D } = this.opts, P = new n.SchemaEnv({ schema: {}, schemaId: D });
          if (G = n.resolveSchema.call(this, P, I), !G)
            return;
          this.refs[I] = G;
        }
        return G.validate || this._compileSchemaEnv(G);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(I) {
        if (I instanceof RegExp)
          return this._removeAllSchemas(this.schemas, I), this._removeAllSchemas(this.refs, I), this;
        switch (typeof I) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const G = _.call(this, I);
            return typeof G == "object" && this._cache.delete(G.schema), delete this.schemas[I], delete this.refs[I], this;
          }
          case "object": {
            const G = I;
            this._cache.delete(G);
            let D = I[this.opts.schemaId];
            return D && (D = (0, i.normalizeId)(D), delete this.schemas[D], delete this.refs[D]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(I) {
        for (const G of I)
          this.addKeyword(G);
        return this;
      }
      addKeyword(I, G) {
        let D;
        if (typeof I == "string")
          D = I, typeof G == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), G.keyword = D);
        else if (typeof I == "object" && G === void 0) {
          if (G = I, D = G.keyword, Array.isArray(D) && !D.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (U.call(this, D, G), !G)
          return (0, o.eachItem)(D, (O) => z.call(this, O)), this;
        Q.call(this, G);
        const P = {
          ...G,
          type: (0, c.getJSONTypes)(G.type),
          schemaType: (0, c.getJSONTypes)(G.schemaType)
        };
        return (0, o.eachItem)(D, P.type.length === 0 ? (O) => z.call(this, O, P) : (O) => P.type.forEach((L) => z.call(this, O, P, L))), this;
      }
      getKeyword(I) {
        const G = this.RULES.all[I];
        return typeof G == "object" ? G.definition : !!G;
      }
      // Remove keyword
      removeKeyword(I) {
        const { RULES: G } = this;
        delete G.keywords[I], delete G.all[I];
        for (const D of G.rules) {
          const P = D.rules.findIndex((O) => O.keyword === I);
          P >= 0 && D.rules.splice(P, 1);
        }
        return this;
      }
      // Add format
      addFormat(I, G) {
        return typeof G == "string" && (G = new RegExp(G)), this.formats[I] = G, this;
      }
      errorsText(I = this.errors, { separator: G = ", ", dataVar: D = "data" } = {}) {
        return !I || I.length === 0 ? "No errors" : I.map((P) => `${D}${P.instancePath} ${P.message}`).reduce((P, O) => P + G + O);
      }
      $dataMetaSchema(I, G) {
        const D = this.RULES.all;
        I = JSON.parse(JSON.stringify(I));
        for (const P of G) {
          const O = P.split("/").slice(1);
          let L = I;
          for (const N of O)
            L = L[N];
          for (const N in D) {
            const A = D[N];
            if (typeof A != "object")
              continue;
            const { $data: J } = A.definition, B = L[N];
            J && B && (L[N] = ne(B));
          }
        }
        return I;
      }
      _removeAllSchemas(I, G) {
        for (const D in I) {
          const P = I[D];
          (!G || G.test(D)) && (typeof P == "string" ? delete I[D] : P && !P.meta && (this._cache.delete(P.schema), delete I[D]));
        }
      }
      _addSchema(I, G, D, P = this.opts.validateSchema, O = this.opts.addUsedSchema) {
        let L;
        const { schemaId: N } = this.opts;
        if (typeof I == "object")
          L = I[N];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof I != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let A = this._cache.get(I);
        if (A !== void 0)
          return A;
        D = (0, i.normalizeId)(L || D);
        const J = i.getSchemaRefs.call(this, I, D);
        return A = new n.SchemaEnv({ schema: I, schemaId: N, meta: G, baseId: D, localRefs: J }), this._cache.set(A.schema, A), O && !D.startsWith("#") && (D && this._checkUnique(D), this.refs[D] = A), P && this.validateSchema(I, !0), A;
      }
      _checkUnique(I) {
        if (this.schemas[I] || this.refs[I])
          throw new Error(`schema with key or id "${I}" already exists`);
      }
      _compileSchemaEnv(I) {
        if (I.meta ? this._compileMetaSchema(I) : n.compileSchema.call(this, I), !I.validate)
          throw new Error("ajv implementation error");
        return I.validate;
      }
      _compileMetaSchema(I) {
        const G = this.opts;
        this.opts = this._metaOpts;
        try {
          n.compileSchema.call(this, I);
        } finally {
          this.opts = G;
        }
      }
    }
    b.ValidationError = a.default, b.MissingRefError = d.default, e.default = b;
    function S(K, I, G, D = "error") {
      for (const P in K) {
        const O = P;
        O in I && this.logger[D](`${G}: option ${P}. ${K[O]}`);
      }
    }
    function _(K) {
      return K = (0, i.normalizeId)(K), this.schemas[K] || this.refs[K];
    }
    function w() {
      const K = this.opts.schemas;
      if (K)
        if (Array.isArray(K))
          this.addSchema(K);
        else
          for (const I in K)
            this.addSchema(K[I], I);
    }
    function R() {
      for (const K in this.opts.formats) {
        const I = this.opts.formats[K];
        I && this.addFormat(K, I);
      }
    }
    function T(K) {
      if (Array.isArray(K)) {
        this.addVocabulary(K);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const I in K) {
        const G = K[I];
        G.keyword || (G.keyword = I), this.addKeyword(G);
      }
    }
    function M() {
      const K = { ...this.opts };
      for (const I of $)
        delete K[I];
      return K;
    }
    const F = { log() {
    }, warn() {
    }, error() {
    } };
    function j(K) {
      if (K === !1)
        return F;
      if (K === void 0)
        return console;
      if (K.log && K.warn && K.error)
        return K;
      throw new Error("logger must implement log, warn and error methods");
    }
    const V = /^[a-z_$][a-z0-9_$:-]*$/i;
    function U(K, I) {
      const { RULES: G } = this;
      if ((0, o.eachItem)(K, (D) => {
        if (G.keywords[D])
          throw new Error(`Keyword ${D} is already defined`);
        if (!V.test(D))
          throw new Error(`Keyword ${D} has invalid name`);
      }), !!I && I.$data && !("code" in I || "validate" in I))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function z(K, I, G) {
      var D;
      const P = I?.post;
      if (G && P)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: O } = this;
      let L = P ? O.post : O.rules.find(({ type: A }) => A === G);
      if (L || (L = { type: G, rules: [] }, O.rules.push(L)), O.keywords[K] = !0, !I)
        return;
      const N = {
        keyword: K,
        definition: {
          ...I,
          type: (0, c.getJSONTypes)(I.type),
          schemaType: (0, c.getJSONTypes)(I.schemaType)
        }
      };
      I.before ? W.call(this, L, N, I.before) : L.rules.push(N), O.all[K] = N, (D = I.implements) === null || D === void 0 || D.forEach((A) => this.addKeyword(A));
    }
    function W(K, I, G) {
      const D = K.rules.findIndex((P) => P.keyword === G);
      D >= 0 ? K.rules.splice(D, 0, I) : (K.rules.push(I), this.logger.warn(`rule ${G} is not defined`));
    }
    function Q(K) {
      let { metaSchema: I } = K;
      I !== void 0 && (K.$data && this.opts.$data && (I = ne(I)), K.validateSchema = this.compile(I, !0));
    }
    const ee = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function ne(K) {
      return { anyOf: [K, ee] };
    }
  }(bo)), bo;
}
var Mi = {}, xi = {}, Vi = {}, bf;
function N_() {
  if (bf) return Vi;
  bf = 1, Object.defineProperty(Vi, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Vi.default = e, Vi;
}
var tr = {}, Sf;
function C_() {
  if (Sf) return tr;
  Sf = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.callRef = tr.getValidate = void 0;
  const e = Xa(), t = Dt(), u = De(), a = or(), d = Hu(), r = Fe(), n = {
    keyword: "$ref",
    schemaType: "string",
    code(c) {
      const { gen: o, schema: p, it: h } = c, { baseId: y, schemaEnv: $, validateName: v, opts: f, self: m } = h, { root: l } = $;
      if ((p === "#" || p === "#/") && y === l.baseId)
        return b();
      const g = d.resolveRef.call(m, l, y, p);
      if (g === void 0)
        throw new e.default(h.opts.uriResolver, y, p);
      if (g instanceof d.SchemaEnv)
        return S(g);
      return _(g);
      function b() {
        if ($ === l)
          return i(c, v, $, $.$async);
        const w = o.scopeValue("root", { ref: l });
        return i(c, (0, u._)`${w}.validate`, l, l.$async);
      }
      function S(w) {
        const R = s(c, w);
        i(c, R, w, w.$async);
      }
      function _(w) {
        const R = o.scopeValue("schema", f.code.source === !0 ? { ref: w, code: (0, u.stringify)(w) } : { ref: w }), T = o.name("valid"), M = c.subschema({
          schema: w,
          dataTypes: [],
          schemaPath: u.nil,
          topSchemaRef: R,
          errSchemaPath: p
        }, T);
        c.mergeEvaluated(M), c.ok(T);
      }
    }
  };
  function s(c, o) {
    const { gen: p } = c;
    return o.validate ? p.scopeValue("validate", { ref: o.validate }) : (0, u._)`${p.scopeValue("wrapper", { ref: o })}.validate`;
  }
  tr.getValidate = s;
  function i(c, o, p, h) {
    const { gen: y, it: $ } = c, { allErrors: v, schemaEnv: f, opts: m } = $, l = m.passContext ? a.default.this : u.nil;
    h ? g() : b();
    function g() {
      if (!f.$async)
        throw new Error("async schema referenced by sync schema");
      const w = y.let("valid");
      y.try(() => {
        y.code((0, u._)`await ${(0, t.callValidateCode)(c, o, l)}`), _(o), v || y.assign(w, !0);
      }, (R) => {
        y.if((0, u._)`!(${R} instanceof ${$.ValidationError})`, () => y.throw(R)), S(R), v || y.assign(w, !1);
      }), c.ok(w);
    }
    function b() {
      c.result((0, t.callValidateCode)(c, o, l), () => _(o), () => S(o));
    }
    function S(w) {
      const R = (0, u._)`${w}.errors`;
      y.assign(a.default.vErrors, (0, u._)`${a.default.vErrors} === null ? ${R} : ${a.default.vErrors}.concat(${R})`), y.assign(a.default.errors, (0, u._)`${a.default.vErrors}.length`);
    }
    function _(w) {
      var R;
      if (!$.opts.unevaluated)
        return;
      const T = (R = p?.validate) === null || R === void 0 ? void 0 : R.evaluated;
      if ($.props !== !0)
        if (T && !T.dynamicProps)
          T.props !== void 0 && ($.props = r.mergeEvaluated.props(y, T.props, $.props));
        else {
          const M = y.var("props", (0, u._)`${w}.evaluated.props`);
          $.props = r.mergeEvaluated.props(y, M, $.props, u.Name);
        }
      if ($.items !== !0)
        if (T && !T.dynamicItems)
          T.items !== void 0 && ($.items = r.mergeEvaluated.items(y, T.items, $.items));
        else {
          const M = y.var("items", (0, u._)`${w}.evaluated.items`);
          $.items = r.mergeEvaluated.items(y, M, $.items, u.Name);
        }
    }
  }
  return tr.callRef = i, tr.default = n, tr;
}
var Pf;
function I_() {
  if (Pf) return xi;
  Pf = 1, Object.defineProperty(xi, "__esModule", { value: !0 });
  const e = N_(), t = C_(), u = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    t.default
  ];
  return xi.default = u, xi;
}
var Bi = {}, Hi = {}, Rf;
function D_() {
  if (Rf) return Hi;
  Rf = 1, Object.defineProperty(Hi, "__esModule", { value: !0 });
  const e = De(), t = e.operators, u = {
    maximum: { okStr: "<=", ok: t.LTE, fail: t.GT },
    minimum: { okStr: ">=", ok: t.GTE, fail: t.LT },
    exclusiveMaximum: { okStr: "<", ok: t.LT, fail: t.GTE },
    exclusiveMinimum: { okStr: ">", ok: t.GT, fail: t.LTE }
  }, a = {
    message: ({ keyword: r, schemaCode: n }) => (0, e.str)`must be ${u[r].okStr} ${n}`,
    params: ({ keyword: r, schemaCode: n }) => (0, e._)`{comparison: ${u[r].okStr}, limit: ${n}}`
  }, d = {
    keyword: Object.keys(u),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: a,
    code(r) {
      const { keyword: n, data: s, schemaCode: i } = r;
      r.fail$data((0, e._)`${s} ${u[n].fail} ${i} || isNaN(${s})`);
    }
  };
  return Hi.default = d, Hi;
}
var Gi = {}, Tf;
function k_() {
  if (Tf) return Gi;
  Tf = 1, Object.defineProperty(Gi, "__esModule", { value: !0 });
  const e = De(), u = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: a }) => (0, e.str)`must be multiple of ${a}`,
      params: ({ schemaCode: a }) => (0, e._)`{multipleOf: ${a}}`
    },
    code(a) {
      const { gen: d, data: r, schemaCode: n, it: s } = a, i = s.opts.multipleOfPrecision, c = d.let("res"), o = i ? (0, e._)`Math.abs(Math.round(${c}) - ${c}) > 1e-${i}` : (0, e._)`${c} !== parseInt(${c})`;
      a.fail$data((0, e._)`(${n} === 0 || (${c} = ${r}/${n}, ${o}))`);
    }
  };
  return Gi.default = u, Gi;
}
var zi = {}, Ki = {}, Of;
function q_() {
  if (Of) return Ki;
  Of = 1, Object.defineProperty(Ki, "__esModule", { value: !0 });
  function e(t) {
    const u = t.length;
    let a = 0, d = 0, r;
    for (; d < u; )
      a++, r = t.charCodeAt(d++), r >= 55296 && r <= 56319 && d < u && (r = t.charCodeAt(d), (r & 64512) === 56320 && d++);
    return a;
  }
  return Ki.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', Ki;
}
var Af;
function F_() {
  if (Af) return zi;
  Af = 1, Object.defineProperty(zi, "__esModule", { value: !0 });
  const e = De(), t = Fe(), u = q_(), d = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: n }) {
        const s = r === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${s} than ${n} characters`;
      },
      params: ({ schemaCode: r }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: n, data: s, schemaCode: i, it: c } = r, o = n === "maxLength" ? e.operators.GT : e.operators.LT, p = c.opts.unicode === !1 ? (0, e._)`${s}.length` : (0, e._)`${(0, t.useFunc)(r.gen, u.default)}(${s})`;
      r.fail$data((0, e._)`${p} ${o} ${i}`);
    }
  };
  return zi.default = d, zi;
}
var Wi = {}, Nf;
function j_() {
  if (Nf) return Wi;
  Nf = 1, Object.defineProperty(Wi, "__esModule", { value: !0 });
  const e = Dt(), t = De(), a = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: d }) => (0, t.str)`must match pattern "${d}"`,
      params: ({ schemaCode: d }) => (0, t._)`{pattern: ${d}}`
    },
    code(d) {
      const { data: r, $data: n, schema: s, schemaCode: i, it: c } = d, o = c.opts.unicodeRegExp ? "u" : "", p = n ? (0, t._)`(new RegExp(${i}, ${o}))` : (0, e.usePattern)(d, s);
      d.fail$data((0, t._)`!${p}.test(${r})`);
    }
  };
  return Wi.default = a, Wi;
}
var Yi = {}, Cf;
function U_() {
  if (Cf) return Yi;
  Cf = 1, Object.defineProperty(Yi, "__esModule", { value: !0 });
  const e = De(), u = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: a, schemaCode: d }) {
        const r = a === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${r} than ${d} properties`;
      },
      params: ({ schemaCode: a }) => (0, e._)`{limit: ${a}}`
    },
    code(a) {
      const { keyword: d, data: r, schemaCode: n } = a, s = d === "maxProperties" ? e.operators.GT : e.operators.LT;
      a.fail$data((0, e._)`Object.keys(${r}).length ${s} ${n}`);
    }
  };
  return Yi.default = u, Yi;
}
var Ji = {}, If;
function L_() {
  if (If) return Ji;
  If = 1, Object.defineProperty(Ji, "__esModule", { value: !0 });
  const e = Dt(), t = De(), u = Fe(), d = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: r } }) => (0, t.str)`must have required property '${r}'`,
      params: ({ params: { missingProperty: r } }) => (0, t._)`{missingProperty: ${r}}`
    },
    code(r) {
      const { gen: n, schema: s, schemaCode: i, data: c, $data: o, it: p } = r, { opts: h } = p;
      if (!o && s.length === 0)
        return;
      const y = s.length >= h.loopRequired;
      if (p.allErrors ? $() : v(), h.strictRequired) {
        const l = r.parentSchema.properties, { definedProperties: g } = r.it;
        for (const b of s)
          if (l?.[b] === void 0 && !g.has(b)) {
            const S = p.schemaEnv.baseId + p.errSchemaPath, _ = `required property "${b}" is not defined at "${S}" (strictRequired)`;
            (0, u.checkStrictMode)(p, _, p.opts.strictRequired);
          }
      }
      function $() {
        if (y || o)
          r.block$data(t.nil, f);
        else
          for (const l of s)
            (0, e.checkReportMissingProp)(r, l);
      }
      function v() {
        const l = n.let("missing");
        if (y || o) {
          const g = n.let("valid", !0);
          r.block$data(g, () => m(l, g)), r.ok(g);
        } else
          n.if((0, e.checkMissingProp)(r, s, l)), (0, e.reportMissingProp)(r, l), n.else();
      }
      function f() {
        n.forOf("prop", i, (l) => {
          r.setParams({ missingProperty: l }), n.if((0, e.noPropertyInData)(n, c, l, h.ownProperties), () => r.error());
        });
      }
      function m(l, g) {
        r.setParams({ missingProperty: l }), n.forOf(l, i, () => {
          n.assign(g, (0, e.propertyInData)(n, c, l, h.ownProperties)), n.if((0, t.not)(g), () => {
            r.error(), n.break();
          });
        }, t.nil);
      }
    }
  };
  return Ji.default = d, Ji;
}
var Xi = {}, Df;
function M_() {
  if (Df) return Xi;
  Df = 1, Object.defineProperty(Xi, "__esModule", { value: !0 });
  const e = De(), u = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: a, schemaCode: d }) {
        const r = a === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${r} than ${d} items`;
      },
      params: ({ schemaCode: a }) => (0, e._)`{limit: ${a}}`
    },
    code(a) {
      const { keyword: d, data: r, schemaCode: n } = a, s = d === "maxItems" ? e.operators.GT : e.operators.LT;
      a.fail$data((0, e._)`${r}.length ${s} ${n}`);
    }
  };
  return Xi.default = u, Xi;
}
var Qi = {}, Zi = {}, kf;
function Gu() {
  if (kf) return Zi;
  kf = 1, Object.defineProperty(Zi, "__esModule", { value: !0 });
  const e = Ba();
  return e.code = 'require("ajv/dist/runtime/equal").default', Zi.default = e, Zi;
}
var qf;
function x_() {
  if (qf) return Qi;
  qf = 1, Object.defineProperty(Qi, "__esModule", { value: !0 });
  const e = ja(), t = De(), u = Fe(), a = Gu(), r = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: n, j: s } }) => (0, t.str)`must NOT have duplicate items (items ## ${s} and ${n} are identical)`,
      params: ({ params: { i: n, j: s } }) => (0, t._)`{i: ${n}, j: ${s}}`
    },
    code(n) {
      const { gen: s, data: i, $data: c, schema: o, parentSchema: p, schemaCode: h, it: y } = n;
      if (!c && !o)
        return;
      const $ = s.let("valid"), v = p.items ? (0, e.getSchemaTypes)(p.items) : [];
      n.block$data($, f, (0, t._)`${h} === false`), n.ok($);
      function f() {
        const b = s.let("i", (0, t._)`${i}.length`), S = s.let("j");
        n.setParams({ i: b, j: S }), s.assign($, !0), s.if((0, t._)`${b} > 1`, () => (m() ? l : g)(b, S));
      }
      function m() {
        return v.length > 0 && !v.some((b) => b === "object" || b === "array");
      }
      function l(b, S) {
        const _ = s.name("item"), w = (0, e.checkDataTypes)(v, _, y.opts.strictNumbers, e.DataType.Wrong), R = s.const("indices", (0, t._)`{}`);
        s.for((0, t._)`;${b}--;`, () => {
          s.let(_, (0, t._)`${i}[${b}]`), s.if(w, (0, t._)`continue`), v.length > 1 && s.if((0, t._)`typeof ${_} == "string"`, (0, t._)`${_} += "_"`), s.if((0, t._)`typeof ${R}[${_}] == "number"`, () => {
            s.assign(S, (0, t._)`${R}[${_}]`), n.error(), s.assign($, !1).break();
          }).code((0, t._)`${R}[${_}] = ${b}`);
        });
      }
      function g(b, S) {
        const _ = (0, u.useFunc)(s, a.default), w = s.name("outer");
        s.label(w).for((0, t._)`;${b}--;`, () => s.for((0, t._)`${S} = ${b}; ${S}--;`, () => s.if((0, t._)`${_}(${i}[${b}], ${i}[${S}])`, () => {
          n.error(), s.assign($, !1).break(w);
        })));
      }
    }
  };
  return Qi.default = r, Qi;
}
var ea = {}, Ff;
function V_() {
  if (Ff) return ea;
  Ff = 1, Object.defineProperty(ea, "__esModule", { value: !0 });
  const e = De(), t = Fe(), u = Gu(), d = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: r }) => (0, e._)`{allowedValue: ${r}}`
    },
    code(r) {
      const { gen: n, data: s, $data: i, schemaCode: c, schema: o } = r;
      i || o && typeof o == "object" ? r.fail$data((0, e._)`!${(0, t.useFunc)(n, u.default)}(${s}, ${c})`) : r.fail((0, e._)`${o} !== ${s}`);
    }
  };
  return ea.default = d, ea;
}
var ta = {}, jf;
function B_() {
  if (jf) return ta;
  jf = 1, Object.defineProperty(ta, "__esModule", { value: !0 });
  const e = De(), t = Fe(), u = Gu(), d = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: r }) => (0, e._)`{allowedValues: ${r}}`
    },
    code(r) {
      const { gen: n, data: s, $data: i, schema: c, schemaCode: o, it: p } = r;
      if (!i && c.length === 0)
        throw new Error("enum must have non-empty array");
      const h = c.length >= p.opts.loopEnum;
      let y;
      const $ = () => y ?? (y = (0, t.useFunc)(n, u.default));
      let v;
      if (h || i)
        v = n.let("valid"), r.block$data(v, f);
      else {
        if (!Array.isArray(c))
          throw new Error("ajv implementation error");
        const l = n.const("vSchema", o);
        v = (0, e.or)(...c.map((g, b) => m(l, b)));
      }
      r.pass(v);
      function f() {
        n.assign(v, !1), n.forOf("v", o, (l) => n.if((0, e._)`${$()}(${s}, ${l})`, () => n.assign(v, !0).break()));
      }
      function m(l, g) {
        const b = c[g];
        return typeof b == "object" && b !== null ? (0, e._)`${$()}(${s}, ${l}[${g}])` : (0, e._)`${s} === ${b}`;
      }
    }
  };
  return ta.default = d, ta;
}
var Uf;
function H_() {
  if (Uf) return Bi;
  Uf = 1, Object.defineProperty(Bi, "__esModule", { value: !0 });
  const e = D_(), t = k_(), u = F_(), a = j_(), d = U_(), r = L_(), n = M_(), s = x_(), i = V_(), c = B_(), o = [
    // number
    e.default,
    t.default,
    // string
    u.default,
    a.default,
    // object
    d.default,
    r.default,
    // array
    n.default,
    s.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    i.default,
    c.default
  ];
  return Bi.default = o, Bi;
}
var ra = {}, kr = {}, Lf;
function jm() {
  if (Lf) return kr;
  Lf = 1, Object.defineProperty(kr, "__esModule", { value: !0 }), kr.validateAdditionalItems = void 0;
  const e = De(), t = Fe(), a = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: r } }) => (0, e.str)`must NOT have more than ${r} items`,
      params: ({ params: { len: r } }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { parentSchema: n, it: s } = r, { items: i } = n;
      if (!Array.isArray(i)) {
        (0, t.checkStrictMode)(s, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      d(r, i);
    }
  };
  function d(r, n) {
    const { gen: s, schema: i, data: c, keyword: o, it: p } = r;
    p.items = !0;
    const h = s.const("len", (0, e._)`${c}.length`);
    if (i === !1)
      r.setParams({ len: n.length }), r.pass((0, e._)`${h} <= ${n.length}`);
    else if (typeof i == "object" && !(0, t.alwaysValidSchema)(p, i)) {
      const $ = s.var("valid", (0, e._)`${h} <= ${n.length}`);
      s.if((0, e.not)($), () => y($)), r.ok($);
    }
    function y($) {
      s.forRange("i", n.length, h, (v) => {
        r.subschema({ keyword: o, dataProp: v, dataPropType: t.Type.Num }, $), p.allErrors || s.if((0, e.not)($), () => s.break());
      });
    }
  }
  return kr.validateAdditionalItems = d, kr.default = a, kr;
}
var na = {}, qr = {}, Mf;
function Um() {
  if (Mf) return qr;
  Mf = 1, Object.defineProperty(qr, "__esModule", { value: !0 }), qr.validateTuple = void 0;
  const e = De(), t = Fe(), u = Dt(), a = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(r) {
      const { schema: n, it: s } = r;
      if (Array.isArray(n))
        return d(r, "additionalItems", n);
      s.items = !0, !(0, t.alwaysValidSchema)(s, n) && r.ok((0, u.validateArray)(r));
    }
  };
  function d(r, n, s = r.schema) {
    const { gen: i, parentSchema: c, data: o, keyword: p, it: h } = r;
    v(c), h.opts.unevaluated && s.length && h.items !== !0 && (h.items = t.mergeEvaluated.items(i, s.length, h.items));
    const y = i.name("valid"), $ = i.const("len", (0, e._)`${o}.length`);
    s.forEach((f, m) => {
      (0, t.alwaysValidSchema)(h, f) || (i.if((0, e._)`${$} > ${m}`, () => r.subschema({
        keyword: p,
        schemaProp: m,
        dataProp: m
      }, y)), r.ok(y));
    });
    function v(f) {
      const { opts: m, errSchemaPath: l } = h, g = s.length, b = g === f.minItems && (g === f.maxItems || f[n] === !1);
      if (m.strictTuples && !b) {
        const S = `"${p}" is ${g}-tuple, but minItems or maxItems/${n} are not specified or different at path "${l}"`;
        (0, t.checkStrictMode)(h, S, m.strictTuples);
      }
    }
  }
  return qr.validateTuple = d, qr.default = a, qr;
}
var xf;
function G_() {
  if (xf) return na;
  xf = 1, Object.defineProperty(na, "__esModule", { value: !0 });
  const e = Um(), t = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (u) => (0, e.validateTuple)(u, "items")
  };
  return na.default = t, na;
}
var ia = {}, Vf;
function z_() {
  if (Vf) return ia;
  Vf = 1, Object.defineProperty(ia, "__esModule", { value: !0 });
  const e = De(), t = Fe(), u = Dt(), a = jm(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: n } }) => (0, e.str)`must NOT have more than ${n} items`,
      params: ({ params: { len: n } }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { schema: s, parentSchema: i, it: c } = n, { prefixItems: o } = i;
      c.items = !0, !(0, t.alwaysValidSchema)(c, s) && (o ? (0, a.validateAdditionalItems)(n, o) : n.ok((0, u.validateArray)(n)));
    }
  };
  return ia.default = r, ia;
}
var aa = {}, Bf;
function K_() {
  if (Bf) return aa;
  Bf = 1, Object.defineProperty(aa, "__esModule", { value: !0 });
  const e = De(), t = Fe(), a = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: d, max: r } }) => r === void 0 ? (0, e.str)`must contain at least ${d} valid item(s)` : (0, e.str)`must contain at least ${d} and no more than ${r} valid item(s)`,
      params: ({ params: { min: d, max: r } }) => r === void 0 ? (0, e._)`{minContains: ${d}}` : (0, e._)`{minContains: ${d}, maxContains: ${r}}`
    },
    code(d) {
      const { gen: r, schema: n, parentSchema: s, data: i, it: c } = d;
      let o, p;
      const { minContains: h, maxContains: y } = s;
      c.opts.next ? (o = h === void 0 ? 1 : h, p = y) : o = 1;
      const $ = r.const("len", (0, e._)`${i}.length`);
      if (d.setParams({ min: o, max: p }), p === void 0 && o === 0) {
        (0, t.checkStrictMode)(c, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (p !== void 0 && o > p) {
        (0, t.checkStrictMode)(c, '"minContains" > "maxContains" is always invalid'), d.fail();
        return;
      }
      if ((0, t.alwaysValidSchema)(c, n)) {
        let g = (0, e._)`${$} >= ${o}`;
        p !== void 0 && (g = (0, e._)`${g} && ${$} <= ${p}`), d.pass(g);
        return;
      }
      c.items = !0;
      const v = r.name("valid");
      p === void 0 && o === 1 ? m(v, () => r.if(v, () => r.break())) : o === 0 ? (r.let(v, !0), p !== void 0 && r.if((0, e._)`${i}.length > 0`, f)) : (r.let(v, !1), f()), d.result(v, () => d.reset());
      function f() {
        const g = r.name("_valid"), b = r.let("count", 0);
        m(g, () => r.if(g, () => l(b)));
      }
      function m(g, b) {
        r.forRange("i", 0, $, (S) => {
          d.subschema({
            keyword: "contains",
            dataProp: S,
            dataPropType: t.Type.Num,
            compositeRule: !0
          }, g), b();
        });
      }
      function l(g) {
        r.code((0, e._)`${g}++`), p === void 0 ? r.if((0, e._)`${g} >= ${o}`, () => r.assign(v, !0).break()) : (r.if((0, e._)`${g} > ${p}`, () => r.assign(v, !1).break()), o === 1 ? r.assign(v, !0) : r.if((0, e._)`${g} >= ${o}`, () => r.assign(v, !0)));
      }
    }
  };
  return aa.default = a, aa;
}
var Ao = {}, Hf;
function W_() {
  return Hf || (Hf = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const t = De(), u = Fe(), a = Dt();
    e.error = {
      message: ({ params: { property: i, depsCount: c, deps: o } }) => {
        const p = c === 1 ? "property" : "properties";
        return (0, t.str)`must have ${p} ${o} when property ${i} is present`;
      },
      params: ({ params: { property: i, depsCount: c, deps: o, missingProperty: p } }) => (0, t._)`{property: ${i},
    missingProperty: ${p},
    depsCount: ${c},
    deps: ${o}}`
      // TODO change to reference
    };
    const d = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(i) {
        const [c, o] = r(i);
        n(i, c), s(i, o);
      }
    };
    function r({ schema: i }) {
      const c = {}, o = {};
      for (const p in i) {
        if (p === "__proto__")
          continue;
        const h = Array.isArray(i[p]) ? c : o;
        h[p] = i[p];
      }
      return [c, o];
    }
    function n(i, c = i.schema) {
      const { gen: o, data: p, it: h } = i;
      if (Object.keys(c).length === 0)
        return;
      const y = o.let("missing");
      for (const $ in c) {
        const v = c[$];
        if (v.length === 0)
          continue;
        const f = (0, a.propertyInData)(o, p, $, h.opts.ownProperties);
        i.setParams({
          property: $,
          depsCount: v.length,
          deps: v.join(", ")
        }), h.allErrors ? o.if(f, () => {
          for (const m of v)
            (0, a.checkReportMissingProp)(i, m);
        }) : (o.if((0, t._)`${f} && (${(0, a.checkMissingProp)(i, v, y)})`), (0, a.reportMissingProp)(i, y), o.else());
      }
    }
    e.validatePropertyDeps = n;
    function s(i, c = i.schema) {
      const { gen: o, data: p, keyword: h, it: y } = i, $ = o.name("valid");
      for (const v in c)
        (0, u.alwaysValidSchema)(y, c[v]) || (o.if(
          (0, a.propertyInData)(o, p, v, y.opts.ownProperties),
          () => {
            const f = i.subschema({ keyword: h, schemaProp: v }, $);
            i.mergeValidEvaluated(f, $);
          },
          () => o.var($, !0)
          // TODO var
        ), i.ok($));
    }
    e.validateSchemaDeps = s, e.default = d;
  }(Ao)), Ao;
}
var oa = {}, Gf;
function Y_() {
  if (Gf) return oa;
  Gf = 1, Object.defineProperty(oa, "__esModule", { value: !0 });
  const e = De(), t = Fe(), a = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: d }) => (0, e._)`{propertyName: ${d.propertyName}}`
    },
    code(d) {
      const { gen: r, schema: n, data: s, it: i } = d;
      if ((0, t.alwaysValidSchema)(i, n))
        return;
      const c = r.name("valid");
      r.forIn("key", s, (o) => {
        d.setParams({ propertyName: o }), d.subschema({
          keyword: "propertyNames",
          data: o,
          dataTypes: ["string"],
          propertyName: o,
          compositeRule: !0
        }, c), r.if((0, e.not)(c), () => {
          d.error(!0), i.allErrors || r.break();
        });
      }), d.ok(c);
    }
  };
  return oa.default = a, oa;
}
var sa = {}, zf;
function Lm() {
  if (zf) return sa;
  zf = 1, Object.defineProperty(sa, "__esModule", { value: !0 });
  const e = Dt(), t = De(), u = or(), a = Fe(), r = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: n }) => (0, t._)`{additionalProperty: ${n.additionalProperty}}`
    },
    code(n) {
      const { gen: s, schema: i, parentSchema: c, data: o, errsCount: p, it: h } = n;
      if (!p)
        throw new Error("ajv implementation error");
      const { allErrors: y, opts: $ } = h;
      if (h.props = !0, $.removeAdditional !== "all" && (0, a.alwaysValidSchema)(h, i))
        return;
      const v = (0, e.allSchemaProperties)(c.properties), f = (0, e.allSchemaProperties)(c.patternProperties);
      m(), n.ok((0, t._)`${p} === ${u.default.errors}`);
      function m() {
        s.forIn("key", o, (_) => {
          !v.length && !f.length ? b(_) : s.if(l(_), () => b(_));
        });
      }
      function l(_) {
        let w;
        if (v.length > 8) {
          const R = (0, a.schemaRefOrVal)(h, c.properties, "properties");
          w = (0, e.isOwnProperty)(s, R, _);
        } else v.length ? w = (0, t.or)(...v.map((R) => (0, t._)`${_} === ${R}`)) : w = t.nil;
        return f.length && (w = (0, t.or)(w, ...f.map((R) => (0, t._)`${(0, e.usePattern)(n, R)}.test(${_})`))), (0, t.not)(w);
      }
      function g(_) {
        s.code((0, t._)`delete ${o}[${_}]`);
      }
      function b(_) {
        if ($.removeAdditional === "all" || $.removeAdditional && i === !1) {
          g(_);
          return;
        }
        if (i === !1) {
          n.setParams({ additionalProperty: _ }), n.error(), y || s.break();
          return;
        }
        if (typeof i == "object" && !(0, a.alwaysValidSchema)(h, i)) {
          const w = s.name("valid");
          $.removeAdditional === "failing" ? (S(_, w, !1), s.if((0, t.not)(w), () => {
            n.reset(), g(_);
          })) : (S(_, w), y || s.if((0, t.not)(w), () => s.break()));
        }
      }
      function S(_, w, R) {
        const T = {
          keyword: "additionalProperties",
          dataProp: _,
          dataPropType: a.Type.Str
        };
        R === !1 && Object.assign(T, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), n.subschema(T, w);
      }
    }
  };
  return sa.default = r, sa;
}
var ua = {}, Kf;
function J_() {
  if (Kf) return ua;
  Kf = 1, Object.defineProperty(ua, "__esModule", { value: !0 });
  const e = Ja(), t = Dt(), u = Fe(), a = Lm(), d = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(r) {
      const { gen: n, schema: s, parentSchema: i, data: c, it: o } = r;
      o.opts.removeAdditional === "all" && i.additionalProperties === void 0 && a.default.code(new e.KeywordCxt(o, a.default, "additionalProperties"));
      const p = (0, t.allSchemaProperties)(s);
      for (const f of p)
        o.definedProperties.add(f);
      o.opts.unevaluated && p.length && o.props !== !0 && (o.props = u.mergeEvaluated.props(n, (0, u.toHash)(p), o.props));
      const h = p.filter((f) => !(0, u.alwaysValidSchema)(o, s[f]));
      if (h.length === 0)
        return;
      const y = n.name("valid");
      for (const f of h)
        $(f) ? v(f) : (n.if((0, t.propertyInData)(n, c, f, o.opts.ownProperties)), v(f), o.allErrors || n.else().var(y, !0), n.endIf()), r.it.definedProperties.add(f), r.ok(y);
      function $(f) {
        return o.opts.useDefaults && !o.compositeRule && s[f].default !== void 0;
      }
      function v(f) {
        r.subschema({
          keyword: "properties",
          schemaProp: f,
          dataProp: f
        }, y);
      }
    }
  };
  return ua.default = d, ua;
}
var ca = {}, Wf;
function X_() {
  if (Wf) return ca;
  Wf = 1, Object.defineProperty(ca, "__esModule", { value: !0 });
  const e = Dt(), t = De(), u = Fe(), a = Fe(), d = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(r) {
      const { gen: n, schema: s, data: i, parentSchema: c, it: o } = r, { opts: p } = o, h = (0, e.allSchemaProperties)(s), y = h.filter((b) => (0, u.alwaysValidSchema)(o, s[b]));
      if (h.length === 0 || y.length === h.length && (!o.opts.unevaluated || o.props === !0))
        return;
      const $ = p.strictSchema && !p.allowMatchingProperties && c.properties, v = n.name("valid");
      o.props !== !0 && !(o.props instanceof t.Name) && (o.props = (0, a.evaluatedPropsToName)(n, o.props));
      const { props: f } = o;
      m();
      function m() {
        for (const b of h)
          $ && l(b), o.allErrors ? g(b) : (n.var(v, !0), g(b), n.if(v));
      }
      function l(b) {
        for (const S in $)
          new RegExp(b).test(S) && (0, u.checkStrictMode)(o, `property ${S} matches pattern ${b} (use allowMatchingProperties)`);
      }
      function g(b) {
        n.forIn("key", i, (S) => {
          n.if((0, t._)`${(0, e.usePattern)(r, b)}.test(${S})`, () => {
            const _ = y.includes(b);
            _ || r.subschema({
              keyword: "patternProperties",
              schemaProp: b,
              dataProp: S,
              dataPropType: a.Type.Str
            }, v), o.opts.unevaluated && f !== !0 ? n.assign((0, t._)`${f}[${S}]`, !0) : !_ && !o.allErrors && n.if((0, t.not)(v), () => n.break());
          });
        });
      }
    }
  };
  return ca.default = d, ca;
}
var la = {}, Yf;
function Q_() {
  if (Yf) return la;
  Yf = 1, Object.defineProperty(la, "__esModule", { value: !0 });
  const e = Fe(), t = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(u) {
      const { gen: a, schema: d, it: r } = u;
      if ((0, e.alwaysValidSchema)(r, d)) {
        u.fail();
        return;
      }
      const n = a.name("valid");
      u.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, n), u.failResult(n, () => u.reset(), () => u.error());
    },
    error: { message: "must NOT be valid" }
  };
  return la.default = t, la;
}
var fa = {}, Jf;
function Z_() {
  if (Jf) return fa;
  Jf = 1, Object.defineProperty(fa, "__esModule", { value: !0 });
  const t = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: Dt().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return fa.default = t, fa;
}
var da = {}, Xf;
function e$() {
  if (Xf) return da;
  Xf = 1, Object.defineProperty(da, "__esModule", { value: !0 });
  const e = De(), t = Fe(), a = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: d }) => (0, e._)`{passingSchemas: ${d.passing}}`
    },
    code(d) {
      const { gen: r, schema: n, parentSchema: s, it: i } = d;
      if (!Array.isArray(n))
        throw new Error("ajv implementation error");
      if (i.opts.discriminator && s.discriminator)
        return;
      const c = n, o = r.let("valid", !1), p = r.let("passing", null), h = r.name("_valid");
      d.setParams({ passing: p }), r.block(y), d.result(o, () => d.reset(), () => d.error(!0));
      function y() {
        c.forEach(($, v) => {
          let f;
          (0, t.alwaysValidSchema)(i, $) ? r.var(h, !0) : f = d.subschema({
            keyword: "oneOf",
            schemaProp: v,
            compositeRule: !0
          }, h), v > 0 && r.if((0, e._)`${h} && ${o}`).assign(o, !1).assign(p, (0, e._)`[${p}, ${v}]`).else(), r.if(h, () => {
            r.assign(o, !0), r.assign(p, v), f && d.mergeEvaluated(f, e.Name);
          });
        });
      }
    }
  };
  return da.default = a, da;
}
var ha = {}, Qf;
function t$() {
  if (Qf) return ha;
  Qf = 1, Object.defineProperty(ha, "__esModule", { value: !0 });
  const e = Fe(), t = {
    keyword: "allOf",
    schemaType: "array",
    code(u) {
      const { gen: a, schema: d, it: r } = u;
      if (!Array.isArray(d))
        throw new Error("ajv implementation error");
      const n = a.name("valid");
      d.forEach((s, i) => {
        if ((0, e.alwaysValidSchema)(r, s))
          return;
        const c = u.subschema({ keyword: "allOf", schemaProp: i }, n);
        u.ok(n), u.mergeEvaluated(c);
      });
    }
  };
  return ha.default = t, ha;
}
var pa = {}, Zf;
function r$() {
  if (Zf) return pa;
  Zf = 1, Object.defineProperty(pa, "__esModule", { value: !0 });
  const e = De(), t = Fe(), a = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: r }) => (0, e.str)`must match "${r.ifClause}" schema`,
      params: ({ params: r }) => (0, e._)`{failingKeyword: ${r.ifClause}}`
    },
    code(r) {
      const { gen: n, parentSchema: s, it: i } = r;
      s.then === void 0 && s.else === void 0 && (0, t.checkStrictMode)(i, '"if" without "then" and "else" is ignored');
      const c = d(i, "then"), o = d(i, "else");
      if (!c && !o)
        return;
      const p = n.let("valid", !0), h = n.name("_valid");
      if (y(), r.reset(), c && o) {
        const v = n.let("ifClause");
        r.setParams({ ifClause: v }), n.if(h, $("then", v), $("else", v));
      } else c ? n.if(h, $("then")) : n.if((0, e.not)(h), $("else"));
      r.pass(p, () => r.error(!0));
      function y() {
        const v = r.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, h);
        r.mergeEvaluated(v);
      }
      function $(v, f) {
        return () => {
          const m = r.subschema({ keyword: v }, h);
          n.assign(p, h), r.mergeValidEvaluated(m, p), f ? n.assign(f, (0, e._)`${v}`) : r.setParams({ ifClause: v });
        };
      }
    }
  };
  function d(r, n) {
    const s = r.schema[n];
    return s !== void 0 && !(0, t.alwaysValidSchema)(r, s);
  }
  return pa.default = a, pa;
}
var ma = {}, ed;
function n$() {
  if (ed) return ma;
  ed = 1, Object.defineProperty(ma, "__esModule", { value: !0 });
  const e = Fe(), t = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: u, parentSchema: a, it: d }) {
      a.if === void 0 && (0, e.checkStrictMode)(d, `"${u}" without "if" is ignored`);
    }
  };
  return ma.default = t, ma;
}
var td;
function i$() {
  if (td) return ra;
  td = 1, Object.defineProperty(ra, "__esModule", { value: !0 });
  const e = jm(), t = G_(), u = Um(), a = z_(), d = K_(), r = W_(), n = Y_(), s = Lm(), i = J_(), c = X_(), o = Q_(), p = Z_(), h = e$(), y = t$(), $ = r$(), v = n$();
  function f(m = !1) {
    const l = [
      // any
      o.default,
      p.default,
      h.default,
      y.default,
      $.default,
      v.default,
      // object
      n.default,
      s.default,
      r.default,
      i.default,
      c.default
    ];
    return m ? l.push(t.default, a.default) : l.push(e.default, u.default), l.push(d.default), l;
  }
  return ra.default = f, ra;
}
var ya = {}, ga = {}, rd;
function a$() {
  if (rd) return ga;
  rd = 1, Object.defineProperty(ga, "__esModule", { value: !0 });
  const e = De(), u = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: a }) => (0, e.str)`must match format "${a}"`,
      params: ({ schemaCode: a }) => (0, e._)`{format: ${a}}`
    },
    code(a, d) {
      const { gen: r, data: n, $data: s, schema: i, schemaCode: c, it: o } = a, { opts: p, errSchemaPath: h, schemaEnv: y, self: $ } = o;
      if (!p.validateFormats)
        return;
      s ? v() : f();
      function v() {
        const m = r.scopeValue("formats", {
          ref: $.formats,
          code: p.code.formats
        }), l = r.const("fDef", (0, e._)`${m}[${c}]`), g = r.let("fType"), b = r.let("format");
        r.if((0, e._)`typeof ${l} == "object" && !(${l} instanceof RegExp)`, () => r.assign(g, (0, e._)`${l}.type || "string"`).assign(b, (0, e._)`${l}.validate`), () => r.assign(g, (0, e._)`"string"`).assign(b, l)), a.fail$data((0, e.or)(S(), _()));
        function S() {
          return p.strictSchema === !1 ? e.nil : (0, e._)`${c} && !${b}`;
        }
        function _() {
          const w = y.$async ? (0, e._)`(${l}.async ? await ${b}(${n}) : ${b}(${n}))` : (0, e._)`${b}(${n})`, R = (0, e._)`(typeof ${b} == "function" ? ${w} : ${b}.test(${n}))`;
          return (0, e._)`${b} && ${b} !== true && ${g} === ${d} && !${R}`;
        }
      }
      function f() {
        const m = $.formats[i];
        if (!m) {
          S();
          return;
        }
        if (m === !0)
          return;
        const [l, g, b] = _(m);
        l === d && a.pass(w());
        function S() {
          if (p.strictSchema === !1) {
            $.logger.warn(R());
            return;
          }
          throw new Error(R());
          function R() {
            return `unknown format "${i}" ignored in schema at path "${h}"`;
          }
        }
        function _(R) {
          const T = R instanceof RegExp ? (0, e.regexpCode)(R) : p.code.formats ? (0, e._)`${p.code.formats}${(0, e.getProperty)(i)}` : void 0, M = r.scopeValue("formats", { key: i, ref: R, code: T });
          return typeof R == "object" && !(R instanceof RegExp) ? [R.type || "string", R.validate, (0, e._)`${M}.validate`] : ["string", R, M];
        }
        function w() {
          if (typeof m == "object" && !(m instanceof RegExp) && m.async) {
            if (!y.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${b}(${n})`;
          }
          return typeof g == "function" ? (0, e._)`${b}(${n})` : (0, e._)`${b}.test(${n})`;
        }
      }
    }
  };
  return ga.default = u, ga;
}
var nd;
function o$() {
  if (nd) return ya;
  nd = 1, Object.defineProperty(ya, "__esModule", { value: !0 });
  const t = [a$().default];
  return ya.default = t, ya;
}
var vr = {}, id;
function s$() {
  return id || (id = 1, Object.defineProperty(vr, "__esModule", { value: !0 }), vr.contentVocabulary = vr.metadataVocabulary = void 0, vr.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], vr.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), vr;
}
var ad;
function u$() {
  if (ad) return Mi;
  ad = 1, Object.defineProperty(Mi, "__esModule", { value: !0 });
  const e = I_(), t = H_(), u = i$(), a = o$(), d = s$(), r = [
    e.default,
    t.default,
    (0, u.default)(),
    a.default,
    d.metadataVocabulary,
    d.contentVocabulary
  ];
  return Mi.default = r, Mi;
}
var va = {}, tn = {}, od;
function c$() {
  if (od) return tn;
  od = 1, Object.defineProperty(tn, "__esModule", { value: !0 }), tn.DiscrError = void 0;
  var e;
  return function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  }(e || (tn.DiscrError = e = {})), tn;
}
var sd;
function l$() {
  if (sd) return va;
  sd = 1, Object.defineProperty(va, "__esModule", { value: !0 });
  const e = De(), t = c$(), u = Hu(), a = Xa(), d = Fe(), n = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: s, tagName: i } }) => s === t.DiscrError.Tag ? `tag "${i}" must be string` : `value of tag "${i}" must be in oneOf`,
      params: ({ params: { discrError: s, tag: i, tagName: c } }) => (0, e._)`{error: ${s}, tag: ${c}, tagValue: ${i}}`
    },
    code(s) {
      const { gen: i, data: c, schema: o, parentSchema: p, it: h } = s, { oneOf: y } = p;
      if (!h.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const $ = o.propertyName;
      if (typeof $ != "string")
        throw new Error("discriminator: requires propertyName");
      if (o.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!y)
        throw new Error("discriminator: requires oneOf keyword");
      const v = i.let("valid", !1), f = i.const("tag", (0, e._)`${c}${(0, e.getProperty)($)}`);
      i.if((0, e._)`typeof ${f} == "string"`, () => m(), () => s.error(!1, { discrError: t.DiscrError.Tag, tag: f, tagName: $ })), s.ok(v);
      function m() {
        const b = g();
        i.if(!1);
        for (const S in b)
          i.elseIf((0, e._)`${f} === ${S}`), i.assign(v, l(b[S]));
        i.else(), s.error(!1, { discrError: t.DiscrError.Mapping, tag: f, tagName: $ }), i.endIf();
      }
      function l(b) {
        const S = i.name("valid"), _ = s.subschema({ keyword: "oneOf", schemaProp: b }, S);
        return s.mergeEvaluated(_, e.Name), S;
      }
      function g() {
        var b;
        const S = {}, _ = R(p);
        let w = !0;
        for (let F = 0; F < y.length; F++) {
          let j = y[F];
          if (j?.$ref && !(0, d.schemaHasRulesButRef)(j, h.self.RULES)) {
            const U = j.$ref;
            if (j = u.resolveRef.call(h.self, h.schemaEnv.root, h.baseId, U), j instanceof u.SchemaEnv && (j = j.schema), j === void 0)
              throw new a.default(h.opts.uriResolver, h.baseId, U);
          }
          const V = (b = j?.properties) === null || b === void 0 ? void 0 : b[$];
          if (typeof V != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${$}"`);
          w = w && (_ || R(j)), T(V, F);
        }
        if (!w)
          throw new Error(`discriminator: "${$}" must be required`);
        return S;
        function R({ required: F }) {
          return Array.isArray(F) && F.includes($);
        }
        function T(F, j) {
          if (F.const)
            M(F.const, j);
          else if (F.enum)
            for (const V of F.enum)
              M(V, j);
          else
            throw new Error(`discriminator: "properties/${$}" must have "const" or "enum"`);
        }
        function M(F, j) {
          if (typeof F != "string" || F in S)
            throw new Error(`discriminator: "${$}" values must be unique strings`);
          S[F] = j;
        }
      }
    }
  };
  return va.default = n, va;
}
const f$ = "http://json-schema.org/draft-07/schema#", d$ = "http://json-schema.org/draft-07/schema#", h$ = "Core schema meta-schema", p$ = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, m$ = ["object", "boolean"], y$ = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, g$ = {
  $schema: f$,
  $id: d$,
  title: h$,
  definitions: p$,
  type: m$,
  properties: y$,
  default: !0
};
var ud;
function v$() {
  return ud || (ud = 1, function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
    const u = A_(), a = u$(), d = l$(), r = g$, n = ["/properties"], s = "http://json-schema.org/draft-07/schema";
    class i extends u.default {
      _addVocabularies() {
        super._addVocabularies(), a.default.forEach(($) => this.addVocabulary($)), this.opts.discriminator && this.addKeyword(d.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const $ = this.opts.$data ? this.$dataMetaSchema(r, n) : r;
        this.addMetaSchema($, s, !1), this.refs["http://json-schema.org/schema"] = s;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(s) ? s : void 0);
      }
    }
    t.Ajv = i, e.exports = t = i, e.exports.Ajv = i, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = i;
    var c = Ja();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return c.KeywordCxt;
    } });
    var o = De();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return o._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return o.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return o.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return o.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return o.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return o.CodeGen;
    } });
    var p = Bu();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return p.default;
    } });
    var h = Xa();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return h.default;
    } });
  }(qi, qi.exports)), qi.exports;
}
var cd;
function _$() {
  return cd || (cd = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
    const t = v$(), u = De(), a = u.operators, d = {
      formatMaximum: { okStr: "<=", ok: a.LTE, fail: a.GT },
      formatMinimum: { okStr: ">=", ok: a.GTE, fail: a.LT },
      formatExclusiveMaximum: { okStr: "<", ok: a.LT, fail: a.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: a.GT, fail: a.LTE }
    }, r = {
      message: ({ keyword: s, schemaCode: i }) => (0, u.str)`should be ${d[s].okStr} ${i}`,
      params: ({ keyword: s, schemaCode: i }) => (0, u._)`{comparison: ${d[s].okStr}, limit: ${i}}`
    };
    e.formatLimitDefinition = {
      keyword: Object.keys(d),
      type: "string",
      schemaType: "string",
      $data: !0,
      error: r,
      code(s) {
        const { gen: i, data: c, schemaCode: o, keyword: p, it: h } = s, { opts: y, self: $ } = h;
        if (!y.validateFormats)
          return;
        const v = new t.KeywordCxt(h, $.RULES.all.format.definition, "format");
        v.$data ? f() : m();
        function f() {
          const g = i.scopeValue("formats", {
            ref: $.formats,
            code: y.code.formats
          }), b = i.const("fmt", (0, u._)`${g}[${v.schemaCode}]`);
          s.fail$data((0, u.or)((0, u._)`typeof ${b} != "object"`, (0, u._)`${b} instanceof RegExp`, (0, u._)`typeof ${b}.compare != "function"`, l(b)));
        }
        function m() {
          const g = v.schema, b = $.formats[g];
          if (!b || b === !0)
            return;
          if (typeof b != "object" || b instanceof RegExp || typeof b.compare != "function")
            throw new Error(`"${p}": format "${g}" does not define "compare" function`);
          const S = i.scopeValue("formats", {
            key: g,
            ref: b,
            code: y.code.formats ? (0, u._)`${y.code.formats}${(0, u.getProperty)(g)}` : void 0
          });
          s.fail$data(l(S));
        }
        function l(g) {
          return (0, u._)`${g}.compare(${c}, ${o}) ${d[p].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const n = (s) => (s.addKeyword(e.formatLimitDefinition), s);
    e.default = n;
  }(Eo)), Eo;
}
var ld;
function $$() {
  return ld || (ld = 1, function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 });
    const u = m_(), a = _$(), d = De(), r = new d.Name("fullFormats"), n = new d.Name("fastFormats"), s = (c, o = { keywords: !0 }) => {
      if (Array.isArray(o))
        return i(c, o, u.fullFormats, r), c;
      const [p, h] = o.mode === "fast" ? [u.fastFormats, n] : [u.fullFormats, r], y = o.formats || u.formatNames;
      return i(c, y, p, h), o.keywords && (0, a.default)(c), c;
    };
    s.get = (c, o = "full") => {
      const h = (o === "fast" ? u.fastFormats : u.fullFormats)[c];
      if (!h)
        throw new Error(`Unknown format "${c}"`);
      return h;
    };
    function i(c, o, p, h) {
      var y, $;
      (y = ($ = c.opts.code).formats) !== null && y !== void 0 || ($.formats = (0, d._)`require("ajv-formats/dist/formats").${h}`);
      for (const v of o)
        c.addFormat(v, p[v]);
    }
    e.exports = t = s, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = s;
  }(ki, ki.exports)), ki.exports;
}
var w$ = $$();
const E$ = /* @__PURE__ */ Uu(w$), b$ = (e, t, u, a) => {
  if (u === "length" || u === "prototype" || u === "arguments" || u === "caller")
    return;
  const d = Object.getOwnPropertyDescriptor(e, u), r = Object.getOwnPropertyDescriptor(t, u);
  !S$(d, r) && a || Object.defineProperty(e, u, r);
}, S$ = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, P$ = (e, t) => {
  const u = Object.getPrototypeOf(t);
  u !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, u);
}, R$ = (e, t) => `/* Wrapped ${e}*/
${t}`, T$ = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), O$ = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), A$ = (e, t, u) => {
  const a = u === "" ? "" : `with ${u.trim()}() `, d = R$.bind(null, a, t.toString());
  Object.defineProperty(d, "name", O$);
  const { writable: r, enumerable: n, configurable: s } = T$;
  Object.defineProperty(e, "toString", { value: d, writable: r, enumerable: n, configurable: s });
};
function N$(e, t, { ignoreNonConfigurable: u = !1 } = {}) {
  const { name: a } = e;
  for (const d of Reflect.ownKeys(t))
    b$(e, t, d, u);
  return P$(e, t), A$(e, t, a), e;
}
const fd = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: u = 0,
    maxWait: a = Number.POSITIVE_INFINITY,
    before: d = !1,
    after: r = !0
  } = t;
  if (u < 0 || a < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!d && !r)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let n, s, i;
  const c = function(...o) {
    const p = this, h = () => {
      n = void 0, s && (clearTimeout(s), s = void 0), r && (i = e.apply(p, o));
    }, y = () => {
      s = void 0, n && (clearTimeout(n), n = void 0), r && (i = e.apply(p, o));
    }, $ = d && !n;
    return clearTimeout(n), n = setTimeout(h, u), a > 0 && a !== Number.POSITIVE_INFINITY && !s && (s = setTimeout(y, a)), $ && (i = e.apply(p, o)), i;
  };
  return N$(c, e), c.cancel = () => {
    n && (clearTimeout(n), n = void 0), s && (clearTimeout(s), s = void 0);
  }, c;
};
var _a = { exports: {} }, No, dd;
function Qa() {
  if (dd) return No;
  dd = 1;
  const e = "2.0.0", t = 256, u = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, a = 16, d = t - 6;
  return No = {
    MAX_LENGTH: t,
    MAX_SAFE_COMPONENT_LENGTH: a,
    MAX_SAFE_BUILD_LENGTH: d,
    MAX_SAFE_INTEGER: u,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: e,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, No;
}
var Co, hd;
function Za() {
  return hd || (hd = 1, Co = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
  }), Co;
}
var pd;
function An() {
  return pd || (pd = 1, function(e, t) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: u,
      MAX_SAFE_BUILD_LENGTH: a,
      MAX_LENGTH: d
    } = Qa(), r = Za();
    t = e.exports = {};
    const n = t.re = [], s = t.safeRe = [], i = t.src = [], c = t.safeSrc = [], o = t.t = {};
    let p = 0;
    const h = "[a-zA-Z0-9-]", y = [
      ["\\s", 1],
      ["\\d", d],
      [h, a]
    ], $ = (f) => {
      for (const [m, l] of y)
        f = f.split(`${m}*`).join(`${m}{0,${l}}`).split(`${m}+`).join(`${m}{1,${l}}`);
      return f;
    }, v = (f, m, l) => {
      const g = $(m), b = p++;
      r(f, b, m), o[f] = b, i[b] = m, c[b] = g, n[b] = new RegExp(m, l ? "g" : void 0), s[b] = new RegExp(g, l ? "g" : void 0);
    };
    v("NUMERICIDENTIFIER", "0|[1-9]\\d*"), v("NUMERICIDENTIFIERLOOSE", "\\d+"), v("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), v("MAINVERSION", `(${i[o.NUMERICIDENTIFIER]})\\.(${i[o.NUMERICIDENTIFIER]})\\.(${i[o.NUMERICIDENTIFIER]})`), v("MAINVERSIONLOOSE", `(${i[o.NUMERICIDENTIFIERLOOSE]})\\.(${i[o.NUMERICIDENTIFIERLOOSE]})\\.(${i[o.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASEIDENTIFIER", `(?:${i[o.NONNUMERICIDENTIFIER]}|${i[o.NUMERICIDENTIFIER]})`), v("PRERELEASEIDENTIFIERLOOSE", `(?:${i[o.NONNUMERICIDENTIFIER]}|${i[o.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASE", `(?:-(${i[o.PRERELEASEIDENTIFIER]}(?:\\.${i[o.PRERELEASEIDENTIFIER]})*))`), v("PRERELEASELOOSE", `(?:-?(${i[o.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${i[o.PRERELEASEIDENTIFIERLOOSE]})*))`), v("BUILDIDENTIFIER", `${h}+`), v("BUILD", `(?:\\+(${i[o.BUILDIDENTIFIER]}(?:\\.${i[o.BUILDIDENTIFIER]})*))`), v("FULLPLAIN", `v?${i[o.MAINVERSION]}${i[o.PRERELEASE]}?${i[o.BUILD]}?`), v("FULL", `^${i[o.FULLPLAIN]}$`), v("LOOSEPLAIN", `[v=\\s]*${i[o.MAINVERSIONLOOSE]}${i[o.PRERELEASELOOSE]}?${i[o.BUILD]}?`), v("LOOSE", `^${i[o.LOOSEPLAIN]}$`), v("GTLT", "((?:<|>)?=?)"), v("XRANGEIDENTIFIERLOOSE", `${i[o.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), v("XRANGEIDENTIFIER", `${i[o.NUMERICIDENTIFIER]}|x|X|\\*`), v("XRANGEPLAIN", `[v=\\s]*(${i[o.XRANGEIDENTIFIER]})(?:\\.(${i[o.XRANGEIDENTIFIER]})(?:\\.(${i[o.XRANGEIDENTIFIER]})(?:${i[o.PRERELEASE]})?${i[o.BUILD]}?)?)?`), v("XRANGEPLAINLOOSE", `[v=\\s]*(${i[o.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[o.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[o.XRANGEIDENTIFIERLOOSE]})(?:${i[o.PRERELEASELOOSE]})?${i[o.BUILD]}?)?)?`), v("XRANGE", `^${i[o.GTLT]}\\s*${i[o.XRANGEPLAIN]}$`), v("XRANGELOOSE", `^${i[o.GTLT]}\\s*${i[o.XRANGEPLAINLOOSE]}$`), v("COERCEPLAIN", `(^|[^\\d])(\\d{1,${u}})(?:\\.(\\d{1,${u}}))?(?:\\.(\\d{1,${u}}))?`), v("COERCE", `${i[o.COERCEPLAIN]}(?:$|[^\\d])`), v("COERCEFULL", i[o.COERCEPLAIN] + `(?:${i[o.PRERELEASE]})?(?:${i[o.BUILD]})?(?:$|[^\\d])`), v("COERCERTL", i[o.COERCE], !0), v("COERCERTLFULL", i[o.COERCEFULL], !0), v("LONETILDE", "(?:~>?)"), v("TILDETRIM", `(\\s*)${i[o.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", v("TILDE", `^${i[o.LONETILDE]}${i[o.XRANGEPLAIN]}$`), v("TILDELOOSE", `^${i[o.LONETILDE]}${i[o.XRANGEPLAINLOOSE]}$`), v("LONECARET", "(?:\\^)"), v("CARETTRIM", `(\\s*)${i[o.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", v("CARET", `^${i[o.LONECARET]}${i[o.XRANGEPLAIN]}$`), v("CARETLOOSE", `^${i[o.LONECARET]}${i[o.XRANGEPLAINLOOSE]}$`), v("COMPARATORLOOSE", `^${i[o.GTLT]}\\s*(${i[o.LOOSEPLAIN]})$|^$`), v("COMPARATOR", `^${i[o.GTLT]}\\s*(${i[o.FULLPLAIN]})$|^$`), v("COMPARATORTRIM", `(\\s*)${i[o.GTLT]}\\s*(${i[o.LOOSEPLAIN]}|${i[o.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", v("HYPHENRANGE", `^\\s*(${i[o.XRANGEPLAIN]})\\s+-\\s+(${i[o.XRANGEPLAIN]})\\s*$`), v("HYPHENRANGELOOSE", `^\\s*(${i[o.XRANGEPLAINLOOSE]})\\s+-\\s+(${i[o.XRANGEPLAINLOOSE]})\\s*$`), v("STAR", "(<|>)?=?\\s*\\*"), v("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), v("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }(_a, _a.exports)), _a.exports;
}
var Io, md;
function zu() {
  if (md) return Io;
  md = 1;
  const e = Object.freeze({ loose: !0 }), t = Object.freeze({});
  return Io = (a) => a ? typeof a != "object" ? e : a : t, Io;
}
var Do, yd;
function Mm() {
  if (yd) return Do;
  yd = 1;
  const e = /^[0-9]+$/, t = (a, d) => {
    const r = e.test(a), n = e.test(d);
    return r && n && (a = +a, d = +d), a === d ? 0 : r && !n ? -1 : n && !r ? 1 : a < d ? -1 : 1;
  };
  return Do = {
    compareIdentifiers: t,
    rcompareIdentifiers: (a, d) => t(d, a)
  }, Do;
}
var ko, gd;
function ft() {
  if (gd) return ko;
  gd = 1;
  const e = Za(), { MAX_LENGTH: t, MAX_SAFE_INTEGER: u } = Qa(), { safeRe: a, t: d } = An(), r = zu(), { compareIdentifiers: n } = Mm();
  class s {
    constructor(c, o) {
      if (o = r(o), c instanceof s) {
        if (c.loose === !!o.loose && c.includePrerelease === !!o.includePrerelease)
          return c;
        c = c.version;
      } else if (typeof c != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof c}".`);
      if (c.length > t)
        throw new TypeError(
          `version is longer than ${t} characters`
        );
      e("SemVer", c, o), this.options = o, this.loose = !!o.loose, this.includePrerelease = !!o.includePrerelease;
      const p = c.trim().match(o.loose ? a[d.LOOSE] : a[d.FULL]);
      if (!p)
        throw new TypeError(`Invalid Version: ${c}`);
      if (this.raw = c, this.major = +p[1], this.minor = +p[2], this.patch = +p[3], this.major > u || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > u || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > u || this.patch < 0)
        throw new TypeError("Invalid patch version");
      p[4] ? this.prerelease = p[4].split(".").map((h) => {
        if (/^[0-9]+$/.test(h)) {
          const y = +h;
          if (y >= 0 && y < u)
            return y;
        }
        return h;
      }) : this.prerelease = [], this.build = p[5] ? p[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(c) {
      if (e("SemVer.compare", this.version, this.options, c), !(c instanceof s)) {
        if (typeof c == "string" && c === this.version)
          return 0;
        c = new s(c, this.options);
      }
      return c.version === this.version ? 0 : this.compareMain(c) || this.comparePre(c);
    }
    compareMain(c) {
      return c instanceof s || (c = new s(c, this.options)), n(this.major, c.major) || n(this.minor, c.minor) || n(this.patch, c.patch);
    }
    comparePre(c) {
      if (c instanceof s || (c = new s(c, this.options)), this.prerelease.length && !c.prerelease.length)
        return -1;
      if (!this.prerelease.length && c.prerelease.length)
        return 1;
      if (!this.prerelease.length && !c.prerelease.length)
        return 0;
      let o = 0;
      do {
        const p = this.prerelease[o], h = c.prerelease[o];
        if (e("prerelease compare", o, p, h), p === void 0 && h === void 0)
          return 0;
        if (h === void 0)
          return 1;
        if (p === void 0)
          return -1;
        if (p === h)
          continue;
        return n(p, h);
      } while (++o);
    }
    compareBuild(c) {
      c instanceof s || (c = new s(c, this.options));
      let o = 0;
      do {
        const p = this.build[o], h = c.build[o];
        if (e("build compare", o, p, h), p === void 0 && h === void 0)
          return 0;
        if (h === void 0)
          return 1;
        if (p === void 0)
          return -1;
        if (p === h)
          continue;
        return n(p, h);
      } while (++o);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(c, o, p) {
      if (c.startsWith("pre")) {
        if (!o && p === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (o) {
          const h = `-${o}`.match(this.options.loose ? a[d.PRERELEASELOOSE] : a[d.PRERELEASE]);
          if (!h || h[1] !== o)
            throw new Error(`invalid identifier: ${o}`);
        }
      }
      switch (c) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", o, p);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", o, p);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", o, p), this.inc("pre", o, p);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", o, p), this.inc("pre", o, p);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const h = Number(p) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [h];
          else {
            let y = this.prerelease.length;
            for (; --y >= 0; )
              typeof this.prerelease[y] == "number" && (this.prerelease[y]++, y = -2);
            if (y === -1) {
              if (o === this.prerelease.join(".") && p === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(h);
            }
          }
          if (o) {
            let y = [o, h];
            p === !1 && (y = [o]), n(this.prerelease[0], o) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = y) : this.prerelease = y;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${c}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return ko = s, ko;
}
var qo, vd;
function Hr() {
  if (vd) return qo;
  vd = 1;
  const e = ft();
  return qo = (u, a, d = !1) => {
    if (u instanceof e)
      return u;
    try {
      return new e(u, a);
    } catch (r) {
      if (!d)
        return null;
      throw r;
    }
  }, qo;
}
var Fo, _d;
function C$() {
  if (_d) return Fo;
  _d = 1;
  const e = Hr();
  return Fo = (u, a) => {
    const d = e(u, a);
    return d ? d.version : null;
  }, Fo;
}
var jo, $d;
function I$() {
  if ($d) return jo;
  $d = 1;
  const e = Hr();
  return jo = (u, a) => {
    const d = e(u.trim().replace(/^[=v]+/, ""), a);
    return d ? d.version : null;
  }, jo;
}
var Uo, wd;
function D$() {
  if (wd) return Uo;
  wd = 1;
  const e = ft();
  return Uo = (u, a, d, r, n) => {
    typeof d == "string" && (n = r, r = d, d = void 0);
    try {
      return new e(
        u instanceof e ? u.version : u,
        d
      ).inc(a, r, n).version;
    } catch {
      return null;
    }
  }, Uo;
}
var Lo, Ed;
function k$() {
  if (Ed) return Lo;
  Ed = 1;
  const e = Hr();
  return Lo = (u, a) => {
    const d = e(u, null, !0), r = e(a, null, !0), n = d.compare(r);
    if (n === 0)
      return null;
    const s = n > 0, i = s ? d : r, c = s ? r : d, o = !!i.prerelease.length;
    if (!!c.prerelease.length && !o) {
      if (!c.patch && !c.minor)
        return "major";
      if (c.compareMain(i) === 0)
        return c.minor && !c.patch ? "minor" : "patch";
    }
    const h = o ? "pre" : "";
    return d.major !== r.major ? h + "major" : d.minor !== r.minor ? h + "minor" : d.patch !== r.patch ? h + "patch" : "prerelease";
  }, Lo;
}
var Mo, bd;
function q$() {
  if (bd) return Mo;
  bd = 1;
  const e = ft();
  return Mo = (u, a) => new e(u, a).major, Mo;
}
var xo, Sd;
function F$() {
  if (Sd) return xo;
  Sd = 1;
  const e = ft();
  return xo = (u, a) => new e(u, a).minor, xo;
}
var Vo, Pd;
function j$() {
  if (Pd) return Vo;
  Pd = 1;
  const e = ft();
  return Vo = (u, a) => new e(u, a).patch, Vo;
}
var Bo, Rd;
function U$() {
  if (Rd) return Bo;
  Rd = 1;
  const e = Hr();
  return Bo = (u, a) => {
    const d = e(u, a);
    return d && d.prerelease.length ? d.prerelease : null;
  }, Bo;
}
var Ho, Td;
function kt() {
  if (Td) return Ho;
  Td = 1;
  const e = ft();
  return Ho = (u, a, d) => new e(u, d).compare(new e(a, d)), Ho;
}
var Go, Od;
function L$() {
  if (Od) return Go;
  Od = 1;
  const e = kt();
  return Go = (u, a, d) => e(a, u, d), Go;
}
var zo, Ad;
function M$() {
  if (Ad) return zo;
  Ad = 1;
  const e = kt();
  return zo = (u, a) => e(u, a, !0), zo;
}
var Ko, Nd;
function Ku() {
  if (Nd) return Ko;
  Nd = 1;
  const e = ft();
  return Ko = (u, a, d) => {
    const r = new e(u, d), n = new e(a, d);
    return r.compare(n) || r.compareBuild(n);
  }, Ko;
}
var Wo, Cd;
function x$() {
  if (Cd) return Wo;
  Cd = 1;
  const e = Ku();
  return Wo = (u, a) => u.sort((d, r) => e(d, r, a)), Wo;
}
var Yo, Id;
function V$() {
  if (Id) return Yo;
  Id = 1;
  const e = Ku();
  return Yo = (u, a) => u.sort((d, r) => e(r, d, a)), Yo;
}
var Jo, Dd;
function eo() {
  if (Dd) return Jo;
  Dd = 1;
  const e = kt();
  return Jo = (u, a, d) => e(u, a, d) > 0, Jo;
}
var Xo, kd;
function Wu() {
  if (kd) return Xo;
  kd = 1;
  const e = kt();
  return Xo = (u, a, d) => e(u, a, d) < 0, Xo;
}
var Qo, qd;
function xm() {
  if (qd) return Qo;
  qd = 1;
  const e = kt();
  return Qo = (u, a, d) => e(u, a, d) === 0, Qo;
}
var Zo, Fd;
function Vm() {
  if (Fd) return Zo;
  Fd = 1;
  const e = kt();
  return Zo = (u, a, d) => e(u, a, d) !== 0, Zo;
}
var es, jd;
function Yu() {
  if (jd) return es;
  jd = 1;
  const e = kt();
  return es = (u, a, d) => e(u, a, d) >= 0, es;
}
var ts, Ud;
function Ju() {
  if (Ud) return ts;
  Ud = 1;
  const e = kt();
  return ts = (u, a, d) => e(u, a, d) <= 0, ts;
}
var rs, Ld;
function Bm() {
  if (Ld) return rs;
  Ld = 1;
  const e = xm(), t = Vm(), u = eo(), a = Yu(), d = Wu(), r = Ju();
  return rs = (s, i, c, o) => {
    switch (i) {
      case "===":
        return typeof s == "object" && (s = s.version), typeof c == "object" && (c = c.version), s === c;
      case "!==":
        return typeof s == "object" && (s = s.version), typeof c == "object" && (c = c.version), s !== c;
      case "":
      case "=":
      case "==":
        return e(s, c, o);
      case "!=":
        return t(s, c, o);
      case ">":
        return u(s, c, o);
      case ">=":
        return a(s, c, o);
      case "<":
        return d(s, c, o);
      case "<=":
        return r(s, c, o);
      default:
        throw new TypeError(`Invalid operator: ${i}`);
    }
  }, rs;
}
var ns, Md;
function B$() {
  if (Md) return ns;
  Md = 1;
  const e = ft(), t = Hr(), { safeRe: u, t: a } = An();
  return ns = (r, n) => {
    if (r instanceof e)
      return r;
    if (typeof r == "number" && (r = String(r)), typeof r != "string")
      return null;
    n = n || {};
    let s = null;
    if (!n.rtl)
      s = r.match(n.includePrerelease ? u[a.COERCEFULL] : u[a.COERCE]);
    else {
      const y = n.includePrerelease ? u[a.COERCERTLFULL] : u[a.COERCERTL];
      let $;
      for (; ($ = y.exec(r)) && (!s || s.index + s[0].length !== r.length); )
        (!s || $.index + $[0].length !== s.index + s[0].length) && (s = $), y.lastIndex = $.index + $[1].length + $[2].length;
      y.lastIndex = -1;
    }
    if (s === null)
      return null;
    const i = s[2], c = s[3] || "0", o = s[4] || "0", p = n.includePrerelease && s[5] ? `-${s[5]}` : "", h = n.includePrerelease && s[6] ? `+${s[6]}` : "";
    return t(`${i}.${c}.${o}${p}${h}`, n);
  }, ns;
}
var is, xd;
function H$() {
  if (xd) return is;
  xd = 1;
  class e {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(u) {
      const a = this.map.get(u);
      if (a !== void 0)
        return this.map.delete(u), this.map.set(u, a), a;
    }
    delete(u) {
      return this.map.delete(u);
    }
    set(u, a) {
      if (!this.delete(u) && a !== void 0) {
        if (this.map.size >= this.max) {
          const r = this.map.keys().next().value;
          this.delete(r);
        }
        this.map.set(u, a);
      }
      return this;
    }
  }
  return is = e, is;
}
var as, Vd;
function qt() {
  if (Vd) return as;
  Vd = 1;
  const e = /\s+/g;
  class t {
    constructor(z, W) {
      if (W = d(W), z instanceof t)
        return z.loose === !!W.loose && z.includePrerelease === !!W.includePrerelease ? z : new t(z.raw, W);
      if (z instanceof r)
        return this.raw = z.value, this.set = [[z]], this.formatted = void 0, this;
      if (this.options = W, this.loose = !!W.loose, this.includePrerelease = !!W.includePrerelease, this.raw = z.trim().replace(e, " "), this.set = this.raw.split("||").map((Q) => this.parseRange(Q.trim())).filter((Q) => Q.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const Q = this.set[0];
        if (this.set = this.set.filter((ee) => !v(ee[0])), this.set.length === 0)
          this.set = [Q];
        else if (this.set.length > 1) {
          for (const ee of this.set)
            if (ee.length === 1 && f(ee[0])) {
              this.set = [ee];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let z = 0; z < this.set.length; z++) {
          z > 0 && (this.formatted += "||");
          const W = this.set[z];
          for (let Q = 0; Q < W.length; Q++)
            Q > 0 && (this.formatted += " "), this.formatted += W[Q].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(z) {
      const Q = ((this.options.includePrerelease && y) | (this.options.loose && $)) + ":" + z, ee = a.get(Q);
      if (ee)
        return ee;
      const ne = this.options.loose, K = ne ? i[c.HYPHENRANGELOOSE] : i[c.HYPHENRANGE];
      z = z.replace(K, j(this.options.includePrerelease)), n("hyphen replace", z), z = z.replace(i[c.COMPARATORTRIM], o), n("comparator trim", z), z = z.replace(i[c.TILDETRIM], p), n("tilde trim", z), z = z.replace(i[c.CARETTRIM], h), n("caret trim", z);
      let I = z.split(" ").map((O) => l(O, this.options)).join(" ").split(/\s+/).map((O) => F(O, this.options));
      ne && (I = I.filter((O) => (n("loose invalid filter", O, this.options), !!O.match(i[c.COMPARATORLOOSE])))), n("range list", I);
      const G = /* @__PURE__ */ new Map(), D = I.map((O) => new r(O, this.options));
      for (const O of D) {
        if (v(O))
          return [O];
        G.set(O.value, O);
      }
      G.size > 1 && G.has("") && G.delete("");
      const P = [...G.values()];
      return a.set(Q, P), P;
    }
    intersects(z, W) {
      if (!(z instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((Q) => m(Q, W) && z.set.some((ee) => m(ee, W) && Q.every((ne) => ee.every((K) => ne.intersects(K, W)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(z) {
      if (!z)
        return !1;
      if (typeof z == "string")
        try {
          z = new s(z, this.options);
        } catch {
          return !1;
        }
      for (let W = 0; W < this.set.length; W++)
        if (V(this.set[W], z, this.options))
          return !0;
      return !1;
    }
  }
  as = t;
  const u = H$(), a = new u(), d = zu(), r = to(), n = Za(), s = ft(), {
    safeRe: i,
    t: c,
    comparatorTrimReplace: o,
    tildeTrimReplace: p,
    caretTrimReplace: h
  } = An(), { FLAG_INCLUDE_PRERELEASE: y, FLAG_LOOSE: $ } = Qa(), v = (U) => U.value === "<0.0.0-0", f = (U) => U.value === "", m = (U, z) => {
    let W = !0;
    const Q = U.slice();
    let ee = Q.pop();
    for (; W && Q.length; )
      W = Q.every((ne) => ee.intersects(ne, z)), ee = Q.pop();
    return W;
  }, l = (U, z) => (n("comp", U, z), U = _(U, z), n("caret", U), U = b(U, z), n("tildes", U), U = R(U, z), n("xrange", U), U = M(U, z), n("stars", U), U), g = (U) => !U || U.toLowerCase() === "x" || U === "*", b = (U, z) => U.trim().split(/\s+/).map((W) => S(W, z)).join(" "), S = (U, z) => {
    const W = z.loose ? i[c.TILDELOOSE] : i[c.TILDE];
    return U.replace(W, (Q, ee, ne, K, I) => {
      n("tilde", U, Q, ee, ne, K, I);
      let G;
      return g(ee) ? G = "" : g(ne) ? G = `>=${ee}.0.0 <${+ee + 1}.0.0-0` : g(K) ? G = `>=${ee}.${ne}.0 <${ee}.${+ne + 1}.0-0` : I ? (n("replaceTilde pr", I), G = `>=${ee}.${ne}.${K}-${I} <${ee}.${+ne + 1}.0-0`) : G = `>=${ee}.${ne}.${K} <${ee}.${+ne + 1}.0-0`, n("tilde return", G), G;
    });
  }, _ = (U, z) => U.trim().split(/\s+/).map((W) => w(W, z)).join(" "), w = (U, z) => {
    n("caret", U, z);
    const W = z.loose ? i[c.CARETLOOSE] : i[c.CARET], Q = z.includePrerelease ? "-0" : "";
    return U.replace(W, (ee, ne, K, I, G) => {
      n("caret", U, ee, ne, K, I, G);
      let D;
      return g(ne) ? D = "" : g(K) ? D = `>=${ne}.0.0${Q} <${+ne + 1}.0.0-0` : g(I) ? ne === "0" ? D = `>=${ne}.${K}.0${Q} <${ne}.${+K + 1}.0-0` : D = `>=${ne}.${K}.0${Q} <${+ne + 1}.0.0-0` : G ? (n("replaceCaret pr", G), ne === "0" ? K === "0" ? D = `>=${ne}.${K}.${I}-${G} <${ne}.${K}.${+I + 1}-0` : D = `>=${ne}.${K}.${I}-${G} <${ne}.${+K + 1}.0-0` : D = `>=${ne}.${K}.${I}-${G} <${+ne + 1}.0.0-0`) : (n("no pr"), ne === "0" ? K === "0" ? D = `>=${ne}.${K}.${I}${Q} <${ne}.${K}.${+I + 1}-0` : D = `>=${ne}.${K}.${I}${Q} <${ne}.${+K + 1}.0-0` : D = `>=${ne}.${K}.${I} <${+ne + 1}.0.0-0`), n("caret return", D), D;
    });
  }, R = (U, z) => (n("replaceXRanges", U, z), U.split(/\s+/).map((W) => T(W, z)).join(" ")), T = (U, z) => {
    U = U.trim();
    const W = z.loose ? i[c.XRANGELOOSE] : i[c.XRANGE];
    return U.replace(W, (Q, ee, ne, K, I, G) => {
      n("xRange", U, Q, ee, ne, K, I, G);
      const D = g(ne), P = D || g(K), O = P || g(I), L = O;
      return ee === "=" && L && (ee = ""), G = z.includePrerelease ? "-0" : "", D ? ee === ">" || ee === "<" ? Q = "<0.0.0-0" : Q = "*" : ee && L ? (P && (K = 0), I = 0, ee === ">" ? (ee = ">=", P ? (ne = +ne + 1, K = 0, I = 0) : (K = +K + 1, I = 0)) : ee === "<=" && (ee = "<", P ? ne = +ne + 1 : K = +K + 1), ee === "<" && (G = "-0"), Q = `${ee + ne}.${K}.${I}${G}`) : P ? Q = `>=${ne}.0.0${G} <${+ne + 1}.0.0-0` : O && (Q = `>=${ne}.${K}.0${G} <${ne}.${+K + 1}.0-0`), n("xRange return", Q), Q;
    });
  }, M = (U, z) => (n("replaceStars", U, z), U.trim().replace(i[c.STAR], "")), F = (U, z) => (n("replaceGTE0", U, z), U.trim().replace(i[z.includePrerelease ? c.GTE0PRE : c.GTE0], "")), j = (U) => (z, W, Q, ee, ne, K, I, G, D, P, O, L) => (g(Q) ? W = "" : g(ee) ? W = `>=${Q}.0.0${U ? "-0" : ""}` : g(ne) ? W = `>=${Q}.${ee}.0${U ? "-0" : ""}` : K ? W = `>=${W}` : W = `>=${W}${U ? "-0" : ""}`, g(D) ? G = "" : g(P) ? G = `<${+D + 1}.0.0-0` : g(O) ? G = `<${D}.${+P + 1}.0-0` : L ? G = `<=${D}.${P}.${O}-${L}` : U ? G = `<${D}.${P}.${+O + 1}-0` : G = `<=${G}`, `${W} ${G}`.trim()), V = (U, z, W) => {
    for (let Q = 0; Q < U.length; Q++)
      if (!U[Q].test(z))
        return !1;
    if (z.prerelease.length && !W.includePrerelease) {
      for (let Q = 0; Q < U.length; Q++)
        if (n(U[Q].semver), U[Q].semver !== r.ANY && U[Q].semver.prerelease.length > 0) {
          const ee = U[Q].semver;
          if (ee.major === z.major && ee.minor === z.minor && ee.patch === z.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return as;
}
var os, Bd;
function to() {
  if (Bd) return os;
  Bd = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(o, p) {
      if (p = u(p), o instanceof t) {
        if (o.loose === !!p.loose)
          return o;
        o = o.value;
      }
      o = o.trim().split(/\s+/).join(" "), n("comparator", o, p), this.options = p, this.loose = !!p.loose, this.parse(o), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, n("comp", this);
    }
    parse(o) {
      const p = this.options.loose ? a[d.COMPARATORLOOSE] : a[d.COMPARATOR], h = o.match(p);
      if (!h)
        throw new TypeError(`Invalid comparator: ${o}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new s(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(o) {
      if (n("Comparator.test", o, this.options.loose), this.semver === e || o === e)
        return !0;
      if (typeof o == "string")
        try {
          o = new s(o, this.options);
        } catch {
          return !1;
        }
      return r(o, this.operator, this.semver, this.options);
    }
    intersects(o, p) {
      if (!(o instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new i(o.value, p).test(this.value) : o.operator === "" ? o.value === "" ? !0 : new i(this.value, p).test(o.semver) : (p = u(p), p.includePrerelease && (this.value === "<0.0.0-0" || o.value === "<0.0.0-0") || !p.includePrerelease && (this.value.startsWith("<0.0.0") || o.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && o.operator.startsWith(">") || this.operator.startsWith("<") && o.operator.startsWith("<") || this.semver.version === o.semver.version && this.operator.includes("=") && o.operator.includes("=") || r(this.semver, "<", o.semver, p) && this.operator.startsWith(">") && o.operator.startsWith("<") || r(this.semver, ">", o.semver, p) && this.operator.startsWith("<") && o.operator.startsWith(">")));
    }
  }
  os = t;
  const u = zu(), { safeRe: a, t: d } = An(), r = Bm(), n = Za(), s = ft(), i = qt();
  return os;
}
var ss, Hd;
function ro() {
  if (Hd) return ss;
  Hd = 1;
  const e = qt();
  return ss = (u, a, d) => {
    try {
      a = new e(a, d);
    } catch {
      return !1;
    }
    return a.test(u);
  }, ss;
}
var us, Gd;
function G$() {
  if (Gd) return us;
  Gd = 1;
  const e = qt();
  return us = (u, a) => new e(u, a).set.map((d) => d.map((r) => r.value).join(" ").trim().split(" ")), us;
}
var cs, zd;
function z$() {
  if (zd) return cs;
  zd = 1;
  const e = ft(), t = qt();
  return cs = (a, d, r) => {
    let n = null, s = null, i = null;
    try {
      i = new t(d, r);
    } catch {
      return null;
    }
    return a.forEach((c) => {
      i.test(c) && (!n || s.compare(c) === -1) && (n = c, s = new e(n, r));
    }), n;
  }, cs;
}
var ls, Kd;
function K$() {
  if (Kd) return ls;
  Kd = 1;
  const e = ft(), t = qt();
  return ls = (a, d, r) => {
    let n = null, s = null, i = null;
    try {
      i = new t(d, r);
    } catch {
      return null;
    }
    return a.forEach((c) => {
      i.test(c) && (!n || s.compare(c) === 1) && (n = c, s = new e(n, r));
    }), n;
  }, ls;
}
var fs, Wd;
function W$() {
  if (Wd) return fs;
  Wd = 1;
  const e = ft(), t = qt(), u = eo();
  return fs = (d, r) => {
    d = new t(d, r);
    let n = new e("0.0.0");
    if (d.test(n) || (n = new e("0.0.0-0"), d.test(n)))
      return n;
    n = null;
    for (let s = 0; s < d.set.length; ++s) {
      const i = d.set[s];
      let c = null;
      i.forEach((o) => {
        const p = new e(o.semver.version);
        switch (o.operator) {
          case ">":
            p.prerelease.length === 0 ? p.patch++ : p.prerelease.push(0), p.raw = p.format();
          /* fallthrough */
          case "":
          case ">=":
            (!c || u(p, c)) && (c = p);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${o.operator}`);
        }
      }), c && (!n || u(n, c)) && (n = c);
    }
    return n && d.test(n) ? n : null;
  }, fs;
}
var ds, Yd;
function Y$() {
  if (Yd) return ds;
  Yd = 1;
  const e = qt();
  return ds = (u, a) => {
    try {
      return new e(u, a).range || "*";
    } catch {
      return null;
    }
  }, ds;
}
var hs, Jd;
function Xu() {
  if (Jd) return hs;
  Jd = 1;
  const e = ft(), t = to(), { ANY: u } = t, a = qt(), d = ro(), r = eo(), n = Wu(), s = Ju(), i = Yu();
  return hs = (o, p, h, y) => {
    o = new e(o, y), p = new a(p, y);
    let $, v, f, m, l;
    switch (h) {
      case ">":
        $ = r, v = s, f = n, m = ">", l = ">=";
        break;
      case "<":
        $ = n, v = i, f = r, m = "<", l = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (d(o, p, y))
      return !1;
    for (let g = 0; g < p.set.length; ++g) {
      const b = p.set[g];
      let S = null, _ = null;
      if (b.forEach((w) => {
        w.semver === u && (w = new t(">=0.0.0")), S = S || w, _ = _ || w, $(w.semver, S.semver, y) ? S = w : f(w.semver, _.semver, y) && (_ = w);
      }), S.operator === m || S.operator === l || (!_.operator || _.operator === m) && v(o, _.semver))
        return !1;
      if (_.operator === l && f(o, _.semver))
        return !1;
    }
    return !0;
  }, hs;
}
var ps, Xd;
function J$() {
  if (Xd) return ps;
  Xd = 1;
  const e = Xu();
  return ps = (u, a, d) => e(u, a, ">", d), ps;
}
var ms, Qd;
function X$() {
  if (Qd) return ms;
  Qd = 1;
  const e = Xu();
  return ms = (u, a, d) => e(u, a, "<", d), ms;
}
var ys, Zd;
function Q$() {
  if (Zd) return ys;
  Zd = 1;
  const e = qt();
  return ys = (u, a, d) => (u = new e(u, d), a = new e(a, d), u.intersects(a, d)), ys;
}
var gs, eh;
function Z$() {
  if (eh) return gs;
  eh = 1;
  const e = ro(), t = kt();
  return gs = (u, a, d) => {
    const r = [];
    let n = null, s = null;
    const i = u.sort((h, y) => t(h, y, d));
    for (const h of i)
      e(h, a, d) ? (s = h, n || (n = h)) : (s && r.push([n, s]), s = null, n = null);
    n && r.push([n, null]);
    const c = [];
    for (const [h, y] of r)
      h === y ? c.push(h) : !y && h === i[0] ? c.push("*") : y ? h === i[0] ? c.push(`<=${y}`) : c.push(`${h} - ${y}`) : c.push(`>=${h}`);
    const o = c.join(" || "), p = typeof a.raw == "string" ? a.raw : String(a);
    return o.length < p.length ? o : a;
  }, gs;
}
var vs, th;
function ew() {
  if (th) return vs;
  th = 1;
  const e = qt(), t = to(), { ANY: u } = t, a = ro(), d = kt(), r = (p, h, y = {}) => {
    if (p === h)
      return !0;
    p = new e(p, y), h = new e(h, y);
    let $ = !1;
    e: for (const v of p.set) {
      for (const f of h.set) {
        const m = i(v, f, y);
        if ($ = $ || m !== null, m)
          continue e;
      }
      if ($)
        return !1;
    }
    return !0;
  }, n = [new t(">=0.0.0-0")], s = [new t(">=0.0.0")], i = (p, h, y) => {
    if (p === h)
      return !0;
    if (p.length === 1 && p[0].semver === u) {
      if (h.length === 1 && h[0].semver === u)
        return !0;
      y.includePrerelease ? p = n : p = s;
    }
    if (h.length === 1 && h[0].semver === u) {
      if (y.includePrerelease)
        return !0;
      h = s;
    }
    const $ = /* @__PURE__ */ new Set();
    let v, f;
    for (const R of p)
      R.operator === ">" || R.operator === ">=" ? v = c(v, R, y) : R.operator === "<" || R.operator === "<=" ? f = o(f, R, y) : $.add(R.semver);
    if ($.size > 1)
      return null;
    let m;
    if (v && f) {
      if (m = d(v.semver, f.semver, y), m > 0)
        return null;
      if (m === 0 && (v.operator !== ">=" || f.operator !== "<="))
        return null;
    }
    for (const R of $) {
      if (v && !a(R, String(v), y) || f && !a(R, String(f), y))
        return null;
      for (const T of h)
        if (!a(R, String(T), y))
          return !1;
      return !0;
    }
    let l, g, b, S, _ = f && !y.includePrerelease && f.semver.prerelease.length ? f.semver : !1, w = v && !y.includePrerelease && v.semver.prerelease.length ? v.semver : !1;
    _ && _.prerelease.length === 1 && f.operator === "<" && _.prerelease[0] === 0 && (_ = !1);
    for (const R of h) {
      if (S = S || R.operator === ">" || R.operator === ">=", b = b || R.operator === "<" || R.operator === "<=", v) {
        if (w && R.semver.prerelease && R.semver.prerelease.length && R.semver.major === w.major && R.semver.minor === w.minor && R.semver.patch === w.patch && (w = !1), R.operator === ">" || R.operator === ">=") {
          if (l = c(v, R, y), l === R && l !== v)
            return !1;
        } else if (v.operator === ">=" && !a(v.semver, String(R), y))
          return !1;
      }
      if (f) {
        if (_ && R.semver.prerelease && R.semver.prerelease.length && R.semver.major === _.major && R.semver.minor === _.minor && R.semver.patch === _.patch && (_ = !1), R.operator === "<" || R.operator === "<=") {
          if (g = o(f, R, y), g === R && g !== f)
            return !1;
        } else if (f.operator === "<=" && !a(f.semver, String(R), y))
          return !1;
      }
      if (!R.operator && (f || v) && m !== 0)
        return !1;
    }
    return !(v && b && !f && m !== 0 || f && S && !v && m !== 0 || w || _);
  }, c = (p, h, y) => {
    if (!p)
      return h;
    const $ = d(p.semver, h.semver, y);
    return $ > 0 ? p : $ < 0 || h.operator === ">" && p.operator === ">=" ? h : p;
  }, o = (p, h, y) => {
    if (!p)
      return h;
    const $ = d(p.semver, h.semver, y);
    return $ < 0 ? p : $ > 0 || h.operator === "<" && p.operator === "<=" ? h : p;
  };
  return vs = r, vs;
}
var _s, rh;
function Qu() {
  if (rh) return _s;
  rh = 1;
  const e = An(), t = Qa(), u = ft(), a = Mm(), d = Hr(), r = C$(), n = I$(), s = D$(), i = k$(), c = q$(), o = F$(), p = j$(), h = U$(), y = kt(), $ = L$(), v = M$(), f = Ku(), m = x$(), l = V$(), g = eo(), b = Wu(), S = xm(), _ = Vm(), w = Yu(), R = Ju(), T = Bm(), M = B$(), F = to(), j = qt(), V = ro(), U = G$(), z = z$(), W = K$(), Q = W$(), ee = Y$(), ne = Xu(), K = J$(), I = X$(), G = Q$(), D = Z$(), P = ew();
  return _s = {
    parse: d,
    valid: r,
    clean: n,
    inc: s,
    diff: i,
    major: c,
    minor: o,
    patch: p,
    prerelease: h,
    compare: y,
    rcompare: $,
    compareLoose: v,
    compareBuild: f,
    sort: m,
    rsort: l,
    gt: g,
    lt: b,
    eq: S,
    neq: _,
    gte: w,
    lte: R,
    cmp: T,
    coerce: M,
    Comparator: F,
    Range: j,
    satisfies: V,
    toComparators: U,
    maxSatisfying: z,
    minSatisfying: W,
    minVersion: Q,
    validRange: ee,
    outside: ne,
    gtr: K,
    ltr: I,
    intersects: G,
    simplifyRange: D,
    subset: P,
    SemVer: u,
    re: e.re,
    src: e.src,
    tokens: e.t,
    SEMVER_SPEC_VERSION: t.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: t.RELEASE_TYPES,
    compareIdentifiers: a.compareIdentifiers,
    rcompareIdentifiers: a.rcompareIdentifiers
  }, _s;
}
var tw = Qu();
const Fr = /* @__PURE__ */ Uu(tw), rw = Object.prototype.toString, nw = "[object Uint8Array]", iw = "[object ArrayBuffer]";
function Hm(e, t, u) {
  return e ? e.constructor === t ? !0 : rw.call(e) === u : !1;
}
function Gm(e) {
  return Hm(e, Uint8Array, nw);
}
function aw(e) {
  return Hm(e, ArrayBuffer, iw);
}
function ow(e) {
  return Gm(e) || aw(e);
}
function sw(e) {
  if (!Gm(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function uw(e) {
  if (!ow(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function nh(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ??= e.reduce((d, r) => d + r.length, 0);
  const u = new Uint8Array(t);
  let a = 0;
  for (const d of e)
    sw(d), u.set(d, a), a += d.length;
  return u;
}
const ih = {
  utf8: new globalThis.TextDecoder("utf8")
};
function ah(e, t = "utf8") {
  return uw(e), ih[t] ??= new globalThis.TextDecoder(t), ih[t].decode(e);
}
function cw(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const lw = new globalThis.TextEncoder();
function $s(e) {
  return cw(e), lw.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const fw = E$.default, oh = "aes-256-cbc", jr = () => /* @__PURE__ */ Object.create(null), dw = (e) => e != null, hw = (e, t) => {
  const u = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), a = typeof t;
  if (u.has(a))
    throw new TypeError(`Setting a value of type \`${a}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Ia = "__internal__", ws = `${Ia}.migrations.version`;
class pw {
  path;
  events;
  #n;
  #t;
  #e;
  #r = {};
  constructor(t = {}) {
    const u = {
      configName: "config",
      fileExtension: "json",
      projectSuffix: "nodejs",
      clearInvalidConfig: !1,
      accessPropertiesByDotNotation: !0,
      configFileMode: 438,
      ...t
    };
    if (!u.cwd) {
      if (!u.projectName)
        throw new Error("Please specify the `projectName` option.");
      u.cwd = Og(u.projectName, { suffix: u.projectSuffix }).config;
    }
    if (this.#e = u, u.schema ?? u.ajvOptions ?? u.rootSchema) {
      if (u.schema && typeof u.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const n = new p_.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...u.ajvOptions
      });
      fw(n);
      const s = {
        ...u.rootSchema,
        type: "object",
        properties: u.schema
      };
      this.#n = n.compile(s);
      for (const [i, c] of Object.entries(u.schema ?? {}))
        c?.default && (this.#r[i] = c.default);
    }
    u.defaults && (this.#r = {
      ...this.#r,
      ...u.defaults
    }), u.serialize && (this._serialize = u.serialize), u.deserialize && (this._deserialize = u.deserialize), this.events = new EventTarget(), this.#t = u.encryptionKey;
    const a = u.fileExtension ? `.${u.fileExtension}` : "";
    this.path = Ie.resolve(u.cwd, `${u.configName ?? "config"}${a}`);
    const d = this.store, r = Object.assign(jr(), u.defaults, d);
    if (u.migrations) {
      if (!u.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(u.migrations, u.projectVersion, u.beforeEachMigration);
    }
    this._validate(r);
    try {
      mg.deepEqual(d, r);
    } catch {
      this.store = r;
    }
    u.watch && this._watch();
  }
  get(t, u) {
    if (this.#e.accessPropertiesByDotNotation)
      return this._get(t, u);
    const { store: a } = this;
    return t in a ? a[t] : u;
  }
  set(t, u) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && u === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Ia} key, as it's used to manage this module internal operations.`);
    const { store: a } = this, d = (r, n) => {
      hw(r, n), this.#e.accessPropertiesByDotNotation ? wc(a, r, n) : a[r] = n;
    };
    if (typeof t == "object") {
      const r = t;
      for (const [n, s] of Object.entries(r))
        d(n, s);
    } else
      d(t, u);
    this.store = a;
  }
  has(t) {
    return this.#e.accessPropertiesByDotNotation ? Sg(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const u of t)
      dw(this.#r[u]) && this.set(u, this.#r[u]);
  }
  delete(t) {
    const { store: u } = this;
    this.#e.accessPropertiesByDotNotation ? bg(u, t) : delete u[t], this.store = u;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = jr();
    for (const t of Object.keys(this.#r))
      this.reset(t);
  }
  onDidChange(t, u) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof u != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof u}`);
    return this._handleChange(() => this.get(t), u);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleChange(() => this.store, t);
  }
  get size() {
    return Object.keys(this.store).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    try {
      const t = Oe.readFileSync(this.path, this.#t ? null : "utf8"), u = this._encryptData(t), a = this._deserialize(u);
      return this._validate(a), Object.assign(jr(), a);
    } catch (t) {
      if (t?.code === "ENOENT")
        return this._ensureDirectory(), jr();
      if (this.#e.clearInvalidConfig && t.name === "SyntaxError")
        return jr();
      throw t;
    }
  }
  set store(t) {
    this._ensureDirectory(), this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, u] of Object.entries(this.store))
      yield [t, u];
  }
  _encryptData(t) {
    if (!this.#t)
      return typeof t == "string" ? t : ah(t);
    try {
      const u = t.slice(0, 16), a = Jr.pbkdf2Sync(this.#t, u.toString(), 1e4, 32, "sha512"), d = Jr.createDecipheriv(oh, a, u), r = t.slice(17), n = typeof r == "string" ? $s(r) : r;
      return ah(nh([d.update(n), d.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, u) {
    let a = t();
    const d = () => {
      const r = a, n = t();
      pg(n, r) || (a = n, u.call(this, n, r));
    };
    return this.events.addEventListener("change", d), () => {
      this.events.removeEventListener("change", d);
    };
  }
  _deserialize = (t) => JSON.parse(t);
  _serialize = (t) => JSON.stringify(t, void 0, "	");
  _validate(t) {
    if (!this.#n || this.#n(t) || !this.#n.errors)
      return;
    const a = this.#n.errors.map(({ instancePath: d, message: r = "" }) => `\`${d.slice(1)}\` ${r}`);
    throw new Error("Config schema violation: " + a.join("; "));
  }
  _ensureDirectory() {
    Oe.mkdirSync(Ie.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let u = this._serialize(t);
    if (this.#t) {
      const a = Jr.randomBytes(16), d = Jr.pbkdf2Sync(this.#t, a.toString(), 1e4, 32, "sha512"), r = Jr.createCipheriv(oh, d, a);
      u = nh([a, $s(":"), r.update($s(u)), r.final()]);
    }
    if (Ye.env.SNAP)
      Oe.writeFileSync(this.path, u, { mode: this.#e.configFileMode });
    else
      try {
        Rm(this.path, u, { mode: this.#e.configFileMode });
      } catch (a) {
        if (a?.code === "EXDEV") {
          Oe.writeFileSync(this.path, u, { mode: this.#e.configFileMode });
          return;
        }
        throw a;
      }
  }
  _watch() {
    this._ensureDirectory(), Oe.existsSync(this.path) || this._write(jr()), Ye.platform === "win32" ? Oe.watch(this.path, { persistent: !1 }, fd(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : Oe.watchFile(this.path, { persistent: !1 }, fd(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, u, a) {
    let d = this._get(ws, "0.0.0");
    const r = Object.keys(t).filter((s) => this._shouldPerformMigration(s, d, u));
    let n = { ...this.store };
    for (const s of r)
      try {
        a && a(this, {
          fromVersion: d,
          toVersion: s,
          finalVersion: u,
          versions: r
        });
        const i = t[s];
        i?.(this), this._set(ws, s), d = s, n = { ...this.store };
      } catch (i) {
        throw this.store = n, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${i}`);
      }
    (this._isVersionInRangeFormat(d) || !Fr.eq(d, u)) && this._set(ws, u);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === Ia ? !0 : typeof t != "string" ? !1 : this.#e.accessPropertiesByDotNotation ? !!t.startsWith(`${Ia}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return Fr.clean(t) === null;
  }
  _shouldPerformMigration(t, u, a) {
    return this._isVersionInRangeFormat(t) ? u !== "0.0.0" && Fr.satisfies(u, t) ? !1 : Fr.satisfies(a, t) : !(Fr.lte(t, u) || Fr.gt(t, a));
  }
  _get(t, u) {
    return Eg(this.store, t, u);
  }
  _set(t, u) {
    const { store: a } = this;
    wc(a, t, u), this.store = a;
  }
}
const { app: Da, ipcMain: Iu, shell: mw } = Kt;
let sh = !1;
const uh = () => {
  if (!Iu || !Da)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Da.getPath("userData"),
    appVersion: Da.getVersion()
  };
  return sh || (Iu.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), sh = !0), e;
};
class yw extends pw {
  constructor(t) {
    let u, a;
    if (Ye.type === "renderer") {
      const d = Kt.ipcRenderer.sendSync("electron-store-get-data");
      if (!d)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: u, appVersion: a } = d);
    } else Iu && Da && ({ defaultCwd: u, appVersion: a } = uh());
    t = {
      name: "config",
      ...t
    }, t.projectVersion ||= a, t.cwd ? t.cwd = Ie.isAbsolute(t.cwd) ? t.cwd : Ie.join(u, t.cwd) : t.cwd = u, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    uh();
  }
  async openInEditor() {
    const t = await mw.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
var _r = {}, Es = {}, $a = {}, ch;
function vt() {
  return ch || (ch = 1, $a.fromCallback = function(e) {
    return Object.defineProperty(function(...t) {
      if (typeof t[t.length - 1] == "function") e.apply(this, t);
      else
        return new Promise((u, a) => {
          t.push((d, r) => d != null ? a(d) : u(r)), e.apply(this, t);
        });
    }, "name", { value: e.name });
  }, $a.fromPromise = function(e) {
    return Object.defineProperty(function(...t) {
      const u = t[t.length - 1];
      if (typeof u != "function") return e.apply(this, t);
      t.pop(), e.apply(this, t).then((a) => u(null, a), u);
    }, "name", { value: e.name });
  }), $a;
}
var bs, lh;
function gw() {
  if (lh) return bs;
  lh = 1;
  var e = yg, t = process.cwd, u = null, a = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    return u || (u = t.call(process)), u;
  };
  try {
    process.cwd();
  } catch {
  }
  if (typeof process.chdir == "function") {
    var d = process.chdir;
    process.chdir = function(n) {
      u = null, d.call(process, n);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, d);
  }
  bs = r;
  function r(n) {
    e.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && s(n), n.lutimes || i(n), n.chown = p(n.chown), n.fchown = p(n.fchown), n.lchown = p(n.lchown), n.chmod = c(n.chmod), n.fchmod = c(n.fchmod), n.lchmod = c(n.lchmod), n.chownSync = h(n.chownSync), n.fchownSync = h(n.fchownSync), n.lchownSync = h(n.lchownSync), n.chmodSync = o(n.chmodSync), n.fchmodSync = o(n.fchmodSync), n.lchmodSync = o(n.lchmodSync), n.stat = y(n.stat), n.fstat = y(n.fstat), n.lstat = y(n.lstat), n.statSync = $(n.statSync), n.fstatSync = $(n.fstatSync), n.lstatSync = $(n.lstatSync), n.chmod && !n.lchmod && (n.lchmod = function(f, m, l) {
      l && process.nextTick(l);
    }, n.lchmodSync = function() {
    }), n.chown && !n.lchown && (n.lchown = function(f, m, l, g) {
      g && process.nextTick(g);
    }, n.lchownSync = function() {
    }), a === "win32" && (n.rename = typeof n.rename != "function" ? n.rename : function(f) {
      function m(l, g, b) {
        var S = Date.now(), _ = 0;
        f(l, g, function w(R) {
          if (R && (R.code === "EACCES" || R.code === "EPERM" || R.code === "EBUSY") && Date.now() - S < 6e4) {
            setTimeout(function() {
              n.stat(g, function(T, M) {
                T && T.code === "ENOENT" ? f(l, g, w) : b(R);
              });
            }, _), _ < 100 && (_ += 10);
            return;
          }
          b && b(R);
        });
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(m, f), m;
    }(n.rename)), n.read = typeof n.read != "function" ? n.read : function(f) {
      function m(l, g, b, S, _, w) {
        var R;
        if (w && typeof w == "function") {
          var T = 0;
          R = function(M, F, j) {
            if (M && M.code === "EAGAIN" && T < 10)
              return T++, f.call(n, l, g, b, S, _, R);
            w.apply(this, arguments);
          };
        }
        return f.call(n, l, g, b, S, _, R);
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(m, f), m;
    }(n.read), n.readSync = typeof n.readSync != "function" ? n.readSync : /* @__PURE__ */ function(f) {
      return function(m, l, g, b, S) {
        for (var _ = 0; ; )
          try {
            return f.call(n, m, l, g, b, S);
          } catch (w) {
            if (w.code === "EAGAIN" && _ < 10) {
              _++;
              continue;
            }
            throw w;
          }
      };
    }(n.readSync);
    function s(f) {
      f.lchmod = function(m, l, g) {
        f.open(
          m,
          e.O_WRONLY | e.O_SYMLINK,
          l,
          function(b, S) {
            if (b) {
              g && g(b);
              return;
            }
            f.fchmod(S, l, function(_) {
              f.close(S, function(w) {
                g && g(_ || w);
              });
            });
          }
        );
      }, f.lchmodSync = function(m, l) {
        var g = f.openSync(m, e.O_WRONLY | e.O_SYMLINK, l), b = !0, S;
        try {
          S = f.fchmodSync(g, l), b = !1;
        } finally {
          if (b)
            try {
              f.closeSync(g);
            } catch {
            }
          else
            f.closeSync(g);
        }
        return S;
      };
    }
    function i(f) {
      e.hasOwnProperty("O_SYMLINK") && f.futimes ? (f.lutimes = function(m, l, g, b) {
        f.open(m, e.O_SYMLINK, function(S, _) {
          if (S) {
            b && b(S);
            return;
          }
          f.futimes(_, l, g, function(w) {
            f.close(_, function(R) {
              b && b(w || R);
            });
          });
        });
      }, f.lutimesSync = function(m, l, g) {
        var b = f.openSync(m, e.O_SYMLINK), S, _ = !0;
        try {
          S = f.futimesSync(b, l, g), _ = !1;
        } finally {
          if (_)
            try {
              f.closeSync(b);
            } catch {
            }
          else
            f.closeSync(b);
        }
        return S;
      }) : f.futimes && (f.lutimes = function(m, l, g, b) {
        b && process.nextTick(b);
      }, f.lutimesSync = function() {
      });
    }
    function c(f) {
      return f && function(m, l, g) {
        return f.call(n, m, l, function(b) {
          v(b) && (b = null), g && g.apply(this, arguments);
        });
      };
    }
    function o(f) {
      return f && function(m, l) {
        try {
          return f.call(n, m, l);
        } catch (g) {
          if (!v(g)) throw g;
        }
      };
    }
    function p(f) {
      return f && function(m, l, g, b) {
        return f.call(n, m, l, g, function(S) {
          v(S) && (S = null), b && b.apply(this, arguments);
        });
      };
    }
    function h(f) {
      return f && function(m, l, g) {
        try {
          return f.call(n, m, l, g);
        } catch (b) {
          if (!v(b)) throw b;
        }
      };
    }
    function y(f) {
      return f && function(m, l, g) {
        typeof l == "function" && (g = l, l = null);
        function b(S, _) {
          _ && (_.uid < 0 && (_.uid += 4294967296), _.gid < 0 && (_.gid += 4294967296)), g && g.apply(this, arguments);
        }
        return l ? f.call(n, m, l, b) : f.call(n, m, b);
      };
    }
    function $(f) {
      return f && function(m, l) {
        var g = l ? f.call(n, m, l) : f.call(n, m);
        return g && (g.uid < 0 && (g.uid += 4294967296), g.gid < 0 && (g.gid += 4294967296)), g;
      };
    }
    function v(f) {
      if (!f || f.code === "ENOSYS")
        return !0;
      var m = !process.getuid || process.getuid() !== 0;
      return !!(m && (f.code === "EINVAL" || f.code === "EPERM"));
    }
  }
  return bs;
}
var Ss, fh;
function vw() {
  if (fh) return Ss;
  fh = 1;
  var e = Rn.Stream;
  Ss = t;
  function t(u) {
    return {
      ReadStream: a,
      WriteStream: d
    };
    function a(r, n) {
      if (!(this instanceof a)) return new a(r, n);
      e.call(this);
      var s = this;
      this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, n = n || {};
      for (var i = Object.keys(n), c = 0, o = i.length; c < o; c++) {
        var p = i[c];
        this[p] = n[p];
      }
      if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.end === void 0)
          this.end = 1 / 0;
        else if (typeof this.end != "number")
          throw TypeError("end must be a Number");
        if (this.start > this.end)
          throw new Error("start must be <= end");
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          s._read();
        });
        return;
      }
      u.open(this.path, this.flags, this.mode, function(h, y) {
        if (h) {
          s.emit("error", h), s.readable = !1;
          return;
        }
        s.fd = y, s.emit("open", y), s._read();
      });
    }
    function d(r, n) {
      if (!(this instanceof d)) return new d(r, n);
      e.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, n = n || {};
      for (var s = Object.keys(n), i = 0, c = s.length; i < c; i++) {
        var o = s[i];
        this[o] = n[o];
      }
      if (this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.start < 0)
          throw new Error("start must be >= zero");
        this.pos = this.start;
      }
      this.busy = !1, this._queue = [], this.fd === null && (this._open = u.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
    }
  }
  return Ss;
}
var Ps, dh;
function _w() {
  if (dh) return Ps;
  dh = 1, Ps = t;
  var e = Object.getPrototypeOf || function(u) {
    return u.__proto__;
  };
  function t(u) {
    if (u === null || typeof u != "object")
      return u;
    if (u instanceof Object)
      var a = { __proto__: e(u) };
    else
      var a = /* @__PURE__ */ Object.create(null);
    return Object.getOwnPropertyNames(u).forEach(function(d) {
      Object.defineProperty(a, d, Object.getOwnPropertyDescriptor(u, d));
    }), a;
  }
  return Ps;
}
var wa, hh;
function ht() {
  if (hh) return wa;
  hh = 1;
  var e = ar, t = gw(), u = vw(), a = _w(), d = ku, r, n;
  typeof Symbol == "function" && typeof Symbol.for == "function" ? (r = Symbol.for("graceful-fs.queue"), n = Symbol.for("graceful-fs.previous")) : (r = "___graceful-fs.queue", n = "___graceful-fs.previous");
  function s() {
  }
  function i(f, m) {
    Object.defineProperty(f, r, {
      get: function() {
        return m;
      }
    });
  }
  var c = s;
  if (d.debuglog ? c = d.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (c = function() {
    var f = d.format.apply(d, arguments);
    f = "GFS4: " + f.split(/\n/).join(`
GFS4: `), console.error(f);
  }), !e[r]) {
    var o = Nt[r] || [];
    i(e, o), e.close = function(f) {
      function m(l, g) {
        return f.call(e, l, function(b) {
          b || $(), typeof g == "function" && g.apply(this, arguments);
        });
      }
      return Object.defineProperty(m, n, {
        value: f
      }), m;
    }(e.close), e.closeSync = function(f) {
      function m(l) {
        f.apply(e, arguments), $();
      }
      return Object.defineProperty(m, n, {
        value: f
      }), m;
    }(e.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
      c(e[r]), $m.equal(e[r].length, 0);
    });
  }
  Nt[r] || i(Nt, e[r]), wa = p(a(e)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !e.__patched && (wa = p(e), e.__patched = !0);
  function p(f) {
    t(f), f.gracefulify = p, f.createReadStream = I, f.createWriteStream = G;
    var m = f.readFile;
    f.readFile = l;
    function l(O, L, N) {
      return typeof L == "function" && (N = L, L = null), A(O, L, N);
      function A(J, B, C, k) {
        return m(J, B, function(H) {
          H && (H.code === "EMFILE" || H.code === "ENFILE") ? h([A, [J, B, C], H, k || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
        });
      }
    }
    var g = f.writeFile;
    f.writeFile = b;
    function b(O, L, N, A) {
      return typeof N == "function" && (A = N, N = null), J(O, L, N, A);
      function J(B, C, k, H, Y) {
        return g(B, C, k, function(Z) {
          Z && (Z.code === "EMFILE" || Z.code === "ENFILE") ? h([J, [B, C, k, H], Z, Y || Date.now(), Date.now()]) : typeof H == "function" && H.apply(this, arguments);
        });
      }
    }
    var S = f.appendFile;
    S && (f.appendFile = _);
    function _(O, L, N, A) {
      return typeof N == "function" && (A = N, N = null), J(O, L, N, A);
      function J(B, C, k, H, Y) {
        return S(B, C, k, function(Z) {
          Z && (Z.code === "EMFILE" || Z.code === "ENFILE") ? h([J, [B, C, k, H], Z, Y || Date.now(), Date.now()]) : typeof H == "function" && H.apply(this, arguments);
        });
      }
    }
    var w = f.copyFile;
    w && (f.copyFile = R);
    function R(O, L, N, A) {
      return typeof N == "function" && (A = N, N = 0), J(O, L, N, A);
      function J(B, C, k, H, Y) {
        return w(B, C, k, function(Z) {
          Z && (Z.code === "EMFILE" || Z.code === "ENFILE") ? h([J, [B, C, k, H], Z, Y || Date.now(), Date.now()]) : typeof H == "function" && H.apply(this, arguments);
        });
      }
    }
    var T = f.readdir;
    f.readdir = F;
    var M = /^v[0-5]\./;
    function F(O, L, N) {
      typeof L == "function" && (N = L, L = null);
      var A = M.test(process.version) ? function(C, k, H, Y) {
        return T(C, J(
          C,
          k,
          H,
          Y
        ));
      } : function(C, k, H, Y) {
        return T(C, k, J(
          C,
          k,
          H,
          Y
        ));
      };
      return A(O, L, N);
      function J(B, C, k, H) {
        return function(Y, Z) {
          Y && (Y.code === "EMFILE" || Y.code === "ENFILE") ? h([
            A,
            [B, C, k],
            Y,
            H || Date.now(),
            Date.now()
          ]) : (Z && Z.sort && Z.sort(), typeof k == "function" && k.call(this, Y, Z));
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var j = u(f);
      Q = j.ReadStream, ne = j.WriteStream;
    }
    var V = f.ReadStream;
    V && (Q.prototype = Object.create(V.prototype), Q.prototype.open = ee);
    var U = f.WriteStream;
    U && (ne.prototype = Object.create(U.prototype), ne.prototype.open = K), Object.defineProperty(f, "ReadStream", {
      get: function() {
        return Q;
      },
      set: function(O) {
        Q = O;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(f, "WriteStream", {
      get: function() {
        return ne;
      },
      set: function(O) {
        ne = O;
      },
      enumerable: !0,
      configurable: !0
    });
    var z = Q;
    Object.defineProperty(f, "FileReadStream", {
      get: function() {
        return z;
      },
      set: function(O) {
        z = O;
      },
      enumerable: !0,
      configurable: !0
    });
    var W = ne;
    Object.defineProperty(f, "FileWriteStream", {
      get: function() {
        return W;
      },
      set: function(O) {
        W = O;
      },
      enumerable: !0,
      configurable: !0
    });
    function Q(O, L) {
      return this instanceof Q ? (V.apply(this, arguments), this) : Q.apply(Object.create(Q.prototype), arguments);
    }
    function ee() {
      var O = this;
      P(O.path, O.flags, O.mode, function(L, N) {
        L ? (O.autoClose && O.destroy(), O.emit("error", L)) : (O.fd = N, O.emit("open", N), O.read());
      });
    }
    function ne(O, L) {
      return this instanceof ne ? (U.apply(this, arguments), this) : ne.apply(Object.create(ne.prototype), arguments);
    }
    function K() {
      var O = this;
      P(O.path, O.flags, O.mode, function(L, N) {
        L ? (O.destroy(), O.emit("error", L)) : (O.fd = N, O.emit("open", N));
      });
    }
    function I(O, L) {
      return new f.ReadStream(O, L);
    }
    function G(O, L) {
      return new f.WriteStream(O, L);
    }
    var D = f.open;
    f.open = P;
    function P(O, L, N, A) {
      return typeof N == "function" && (A = N, N = null), J(O, L, N, A);
      function J(B, C, k, H, Y) {
        return D(B, C, k, function(Z, le) {
          Z && (Z.code === "EMFILE" || Z.code === "ENFILE") ? h([J, [B, C, k, H], Z, Y || Date.now(), Date.now()]) : typeof H == "function" && H.apply(this, arguments);
        });
      }
    }
    return f;
  }
  function h(f) {
    c("ENQUEUE", f[0].name, f[1]), e[r].push(f), v();
  }
  var y;
  function $() {
    for (var f = Date.now(), m = 0; m < e[r].length; ++m)
      e[r][m].length > 2 && (e[r][m][3] = f, e[r][m][4] = f);
    v();
  }
  function v() {
    if (clearTimeout(y), y = void 0, e[r].length !== 0) {
      var f = e[r].shift(), m = f[0], l = f[1], g = f[2], b = f[3], S = f[4];
      if (b === void 0)
        c("RETRY", m.name, l), m.apply(null, l);
      else if (Date.now() - b >= 6e4) {
        c("TIMEOUT", m.name, l);
        var _ = l.pop();
        typeof _ == "function" && _.call(null, g);
      } else {
        var w = Date.now() - S, R = Math.max(S - b, 1), T = Math.min(R * 1.2, 100);
        w >= T ? (c("RETRY", m.name, l), m.apply(null, l.concat([b]))) : e[r].push(f);
      }
      y === void 0 && (y = setTimeout(v, 0));
    }
  }
  return wa;
}
var ph;
function Gr() {
  return ph || (ph = 1, function(e) {
    const t = vt().fromCallback, u = ht(), a = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((d) => typeof u[d] == "function");
    Object.assign(e, u), a.forEach((d) => {
      e[d] = t(u[d]);
    }), e.exists = function(d, r) {
      return typeof r == "function" ? u.exists(d, r) : new Promise((n) => u.exists(d, n));
    }, e.read = function(d, r, n, s, i, c) {
      return typeof c == "function" ? u.read(d, r, n, s, i, c) : new Promise((o, p) => {
        u.read(d, r, n, s, i, (h, y, $) => {
          if (h) return p(h);
          o({ bytesRead: y, buffer: $ });
        });
      });
    }, e.write = function(d, r, ...n) {
      return typeof n[n.length - 1] == "function" ? u.write(d, r, ...n) : new Promise((s, i) => {
        u.write(d, r, ...n, (c, o, p) => {
          if (c) return i(c);
          s({ bytesWritten: o, buffer: p });
        });
      });
    }, typeof u.writev == "function" && (e.writev = function(d, r, ...n) {
      return typeof n[n.length - 1] == "function" ? u.writev(d, r, ...n) : new Promise((s, i) => {
        u.writev(d, r, ...n, (c, o, p) => {
          if (c) return i(c);
          s({ bytesWritten: o, buffers: p });
        });
      });
    }), typeof u.realpath.native == "function" ? e.realpath.native = t(u.realpath.native) : process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  }(Es)), Es;
}
var Ea = {}, Rs = {}, mh;
function $w() {
  if (mh) return Rs;
  mh = 1;
  const e = Ge;
  return Rs.checkPath = function(u) {
    if (process.platform === "win32" && /[<>:"|?*]/.test(u.replace(e.parse(u).root, ""))) {
      const d = new Error(`Path contains invalid characters: ${u}`);
      throw d.code = "EINVAL", d;
    }
  }, Rs;
}
var yh;
function ww() {
  if (yh) return Ea;
  yh = 1;
  const e = /* @__PURE__ */ Gr(), { checkPath: t } = /* @__PURE__ */ $w(), u = (a) => {
    const d = { mode: 511 };
    return typeof a == "number" ? a : { ...d, ...a }.mode;
  };
  return Ea.makeDir = async (a, d) => (t(a), e.mkdir(a, {
    mode: u(d),
    recursive: !0
  })), Ea.makeDirSync = (a, d) => (t(a), e.mkdirSync(a, {
    mode: u(d),
    recursive: !0
  })), Ea;
}
var Ts, gh;
function Ft() {
  if (gh) return Ts;
  gh = 1;
  const e = vt().fromPromise, { makeDir: t, makeDirSync: u } = /* @__PURE__ */ ww(), a = e(t);
  return Ts = {
    mkdirs: a,
    mkdirsSync: u,
    // alias
    mkdirp: a,
    mkdirpSync: u,
    ensureDir: a,
    ensureDirSync: u
  }, Ts;
}
var Os, vh;
function Pr() {
  if (vh) return Os;
  vh = 1;
  const e = vt().fromPromise, t = /* @__PURE__ */ Gr();
  function u(a) {
    return t.access(a).then(() => !0).catch(() => !1);
  }
  return Os = {
    pathExists: e(u),
    pathExistsSync: t.existsSync
  }, Os;
}
var As, _h;
function zm() {
  if (_h) return As;
  _h = 1;
  const e = ht();
  function t(a, d, r, n) {
    e.open(a, "r+", (s, i) => {
      if (s) return n(s);
      e.futimes(i, d, r, (c) => {
        e.close(i, (o) => {
          n && n(c || o);
        });
      });
    });
  }
  function u(a, d, r) {
    const n = e.openSync(a, "r+");
    return e.futimesSync(n, d, r), e.closeSync(n);
  }
  return As = {
    utimesMillis: t,
    utimesMillisSync: u
  }, As;
}
var Ns, $h;
function zr() {
  if ($h) return Ns;
  $h = 1;
  const e = /* @__PURE__ */ Gr(), t = Ge, u = ku;
  function a(h, y, $) {
    const v = $.dereference ? (f) => e.stat(f, { bigint: !0 }) : (f) => e.lstat(f, { bigint: !0 });
    return Promise.all([
      v(h),
      v(y).catch((f) => {
        if (f.code === "ENOENT") return null;
        throw f;
      })
    ]).then(([f, m]) => ({ srcStat: f, destStat: m }));
  }
  function d(h, y, $) {
    let v;
    const f = $.dereference ? (l) => e.statSync(l, { bigint: !0 }) : (l) => e.lstatSync(l, { bigint: !0 }), m = f(h);
    try {
      v = f(y);
    } catch (l) {
      if (l.code === "ENOENT") return { srcStat: m, destStat: null };
      throw l;
    }
    return { srcStat: m, destStat: v };
  }
  function r(h, y, $, v, f) {
    u.callbackify(a)(h, y, v, (m, l) => {
      if (m) return f(m);
      const { srcStat: g, destStat: b } = l;
      if (b) {
        if (c(g, b)) {
          const S = t.basename(h), _ = t.basename(y);
          return $ === "move" && S !== _ && S.toLowerCase() === _.toLowerCase() ? f(null, { srcStat: g, destStat: b, isChangingCase: !0 }) : f(new Error("Source and destination must not be the same."));
        }
        if (g.isDirectory() && !b.isDirectory())
          return f(new Error(`Cannot overwrite non-directory '${y}' with directory '${h}'.`));
        if (!g.isDirectory() && b.isDirectory())
          return f(new Error(`Cannot overwrite directory '${y}' with non-directory '${h}'.`));
      }
      return g.isDirectory() && o(h, y) ? f(new Error(p(h, y, $))) : f(null, { srcStat: g, destStat: b });
    });
  }
  function n(h, y, $, v) {
    const { srcStat: f, destStat: m } = d(h, y, v);
    if (m) {
      if (c(f, m)) {
        const l = t.basename(h), g = t.basename(y);
        if ($ === "move" && l !== g && l.toLowerCase() === g.toLowerCase())
          return { srcStat: f, destStat: m, isChangingCase: !0 };
        throw new Error("Source and destination must not be the same.");
      }
      if (f.isDirectory() && !m.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${y}' with directory '${h}'.`);
      if (!f.isDirectory() && m.isDirectory())
        throw new Error(`Cannot overwrite directory '${y}' with non-directory '${h}'.`);
    }
    if (f.isDirectory() && o(h, y))
      throw new Error(p(h, y, $));
    return { srcStat: f, destStat: m };
  }
  function s(h, y, $, v, f) {
    const m = t.resolve(t.dirname(h)), l = t.resolve(t.dirname($));
    if (l === m || l === t.parse(l).root) return f();
    e.stat(l, { bigint: !0 }, (g, b) => g ? g.code === "ENOENT" ? f() : f(g) : c(y, b) ? f(new Error(p(h, $, v))) : s(h, y, l, v, f));
  }
  function i(h, y, $, v) {
    const f = t.resolve(t.dirname(h)), m = t.resolve(t.dirname($));
    if (m === f || m === t.parse(m).root) return;
    let l;
    try {
      l = e.statSync(m, { bigint: !0 });
    } catch (g) {
      if (g.code === "ENOENT") return;
      throw g;
    }
    if (c(y, l))
      throw new Error(p(h, $, v));
    return i(h, y, m, v);
  }
  function c(h, y) {
    return y.ino && y.dev && y.ino === h.ino && y.dev === h.dev;
  }
  function o(h, y) {
    const $ = t.resolve(h).split(t.sep).filter((f) => f), v = t.resolve(y).split(t.sep).filter((f) => f);
    return $.reduce((f, m, l) => f && v[l] === m, !0);
  }
  function p(h, y, $) {
    return `Cannot ${$} '${h}' to a subdirectory of itself, '${y}'.`;
  }
  return Ns = {
    checkPaths: r,
    checkPathsSync: n,
    checkParentPaths: s,
    checkParentPathsSync: i,
    isSrcSubdir: o,
    areIdentical: c
  }, Ns;
}
var Cs, wh;
function Ew() {
  if (wh) return Cs;
  wh = 1;
  const e = ht(), t = Ge, u = Ft().mkdirs, a = Pr().pathExists, d = zm().utimesMillis, r = /* @__PURE__ */ zr();
  function n(F, j, V, U) {
    typeof V == "function" && !U ? (U = V, V = {}) : typeof V == "function" && (V = { filter: V }), U = U || function() {
    }, V = V || {}, V.clobber = "clobber" in V ? !!V.clobber : !0, V.overwrite = "overwrite" in V ? !!V.overwrite : V.clobber, V.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0001"
    ), r.checkPaths(F, j, "copy", V, (z, W) => {
      if (z) return U(z);
      const { srcStat: Q, destStat: ee } = W;
      r.checkParentPaths(F, Q, j, "copy", (ne) => ne ? U(ne) : V.filter ? i(s, ee, F, j, V, U) : s(ee, F, j, V, U));
    });
  }
  function s(F, j, V, U, z) {
    const W = t.dirname(V);
    a(W, (Q, ee) => {
      if (Q) return z(Q);
      if (ee) return o(F, j, V, U, z);
      u(W, (ne) => ne ? z(ne) : o(F, j, V, U, z));
    });
  }
  function i(F, j, V, U, z, W) {
    Promise.resolve(z.filter(V, U)).then((Q) => Q ? F(j, V, U, z, W) : W(), (Q) => W(Q));
  }
  function c(F, j, V, U, z) {
    return U.filter ? i(o, F, j, V, U, z) : o(F, j, V, U, z);
  }
  function o(F, j, V, U, z) {
    (U.dereference ? e.stat : e.lstat)(j, (Q, ee) => Q ? z(Q) : ee.isDirectory() ? b(ee, F, j, V, U, z) : ee.isFile() || ee.isCharacterDevice() || ee.isBlockDevice() ? p(ee, F, j, V, U, z) : ee.isSymbolicLink() ? T(F, j, V, U, z) : ee.isSocket() ? z(new Error(`Cannot copy a socket file: ${j}`)) : ee.isFIFO() ? z(new Error(`Cannot copy a FIFO pipe: ${j}`)) : z(new Error(`Unknown file: ${j}`)));
  }
  function p(F, j, V, U, z, W) {
    return j ? h(F, V, U, z, W) : y(F, V, U, z, W);
  }
  function h(F, j, V, U, z) {
    if (U.overwrite)
      e.unlink(V, (W) => W ? z(W) : y(F, j, V, U, z));
    else return U.errorOnExist ? z(new Error(`'${V}' already exists`)) : z();
  }
  function y(F, j, V, U, z) {
    e.copyFile(j, V, (W) => W ? z(W) : U.preserveTimestamps ? $(F.mode, j, V, z) : l(V, F.mode, z));
  }
  function $(F, j, V, U) {
    return v(F) ? f(V, F, (z) => z ? U(z) : m(F, j, V, U)) : m(F, j, V, U);
  }
  function v(F) {
    return (F & 128) === 0;
  }
  function f(F, j, V) {
    return l(F, j | 128, V);
  }
  function m(F, j, V, U) {
    g(j, V, (z) => z ? U(z) : l(V, F, U));
  }
  function l(F, j, V) {
    return e.chmod(F, j, V);
  }
  function g(F, j, V) {
    e.stat(F, (U, z) => U ? V(U) : d(j, z.atime, z.mtime, V));
  }
  function b(F, j, V, U, z, W) {
    return j ? _(V, U, z, W) : S(F.mode, V, U, z, W);
  }
  function S(F, j, V, U, z) {
    e.mkdir(V, (W) => {
      if (W) return z(W);
      _(j, V, U, (Q) => Q ? z(Q) : l(V, F, z));
    });
  }
  function _(F, j, V, U) {
    e.readdir(F, (z, W) => z ? U(z) : w(W, F, j, V, U));
  }
  function w(F, j, V, U, z) {
    const W = F.pop();
    return W ? R(F, W, j, V, U, z) : z();
  }
  function R(F, j, V, U, z, W) {
    const Q = t.join(V, j), ee = t.join(U, j);
    r.checkPaths(Q, ee, "copy", z, (ne, K) => {
      if (ne) return W(ne);
      const { destStat: I } = K;
      c(I, Q, ee, z, (G) => G ? W(G) : w(F, V, U, z, W));
    });
  }
  function T(F, j, V, U, z) {
    e.readlink(j, (W, Q) => {
      if (W) return z(W);
      if (U.dereference && (Q = t.resolve(process.cwd(), Q)), F)
        e.readlink(V, (ee, ne) => ee ? ee.code === "EINVAL" || ee.code === "UNKNOWN" ? e.symlink(Q, V, z) : z(ee) : (U.dereference && (ne = t.resolve(process.cwd(), ne)), r.isSrcSubdir(Q, ne) ? z(new Error(`Cannot copy '${Q}' to a subdirectory of itself, '${ne}'.`)) : F.isDirectory() && r.isSrcSubdir(ne, Q) ? z(new Error(`Cannot overwrite '${ne}' with '${Q}'.`)) : M(Q, V, z)));
      else
        return e.symlink(Q, V, z);
    });
  }
  function M(F, j, V) {
    e.unlink(j, (U) => U ? V(U) : e.symlink(F, j, V));
  }
  return Cs = n, Cs;
}
var Is, Eh;
function bw() {
  if (Eh) return Is;
  Eh = 1;
  const e = ht(), t = Ge, u = Ft().mkdirsSync, a = zm().utimesMillisSync, d = /* @__PURE__ */ zr();
  function r(w, R, T) {
    typeof T == "function" && (T = { filter: T }), T = T || {}, T.clobber = "clobber" in T ? !!T.clobber : !0, T.overwrite = "overwrite" in T ? !!T.overwrite : T.clobber, T.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0002"
    );
    const { srcStat: M, destStat: F } = d.checkPathsSync(w, R, "copy", T);
    return d.checkParentPathsSync(w, M, R, "copy"), n(F, w, R, T);
  }
  function n(w, R, T, M) {
    if (M.filter && !M.filter(R, T)) return;
    const F = t.dirname(T);
    return e.existsSync(F) || u(F), i(w, R, T, M);
  }
  function s(w, R, T, M) {
    if (!(M.filter && !M.filter(R, T)))
      return i(w, R, T, M);
  }
  function i(w, R, T, M) {
    const j = (M.dereference ? e.statSync : e.lstatSync)(R);
    if (j.isDirectory()) return m(j, w, R, T, M);
    if (j.isFile() || j.isCharacterDevice() || j.isBlockDevice()) return c(j, w, R, T, M);
    if (j.isSymbolicLink()) return S(w, R, T, M);
    throw j.isSocket() ? new Error(`Cannot copy a socket file: ${R}`) : j.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${R}`) : new Error(`Unknown file: ${R}`);
  }
  function c(w, R, T, M, F) {
    return R ? o(w, T, M, F) : p(w, T, M, F);
  }
  function o(w, R, T, M) {
    if (M.overwrite)
      return e.unlinkSync(T), p(w, R, T, M);
    if (M.errorOnExist)
      throw new Error(`'${T}' already exists`);
  }
  function p(w, R, T, M) {
    return e.copyFileSync(R, T), M.preserveTimestamps && h(w.mode, R, T), v(T, w.mode);
  }
  function h(w, R, T) {
    return y(w) && $(T, w), f(R, T);
  }
  function y(w) {
    return (w & 128) === 0;
  }
  function $(w, R) {
    return v(w, R | 128);
  }
  function v(w, R) {
    return e.chmodSync(w, R);
  }
  function f(w, R) {
    const T = e.statSync(w);
    return a(R, T.atime, T.mtime);
  }
  function m(w, R, T, M, F) {
    return R ? g(T, M, F) : l(w.mode, T, M, F);
  }
  function l(w, R, T, M) {
    return e.mkdirSync(T), g(R, T, M), v(T, w);
  }
  function g(w, R, T) {
    e.readdirSync(w).forEach((M) => b(M, w, R, T));
  }
  function b(w, R, T, M) {
    const F = t.join(R, w), j = t.join(T, w), { destStat: V } = d.checkPathsSync(F, j, "copy", M);
    return s(V, F, j, M);
  }
  function S(w, R, T, M) {
    let F = e.readlinkSync(R);
    if (M.dereference && (F = t.resolve(process.cwd(), F)), w) {
      let j;
      try {
        j = e.readlinkSync(T);
      } catch (V) {
        if (V.code === "EINVAL" || V.code === "UNKNOWN") return e.symlinkSync(F, T);
        throw V;
      }
      if (M.dereference && (j = t.resolve(process.cwd(), j)), d.isSrcSubdir(F, j))
        throw new Error(`Cannot copy '${F}' to a subdirectory of itself, '${j}'.`);
      if (e.statSync(T).isDirectory() && d.isSrcSubdir(j, F))
        throw new Error(`Cannot overwrite '${j}' with '${F}'.`);
      return _(F, T);
    } else
      return e.symlinkSync(F, T);
  }
  function _(w, R) {
    return e.unlinkSync(R), e.symlinkSync(w, R);
  }
  return Is = r, Is;
}
var Ds, bh;
function Zu() {
  if (bh) return Ds;
  bh = 1;
  const e = vt().fromCallback;
  return Ds = {
    copy: e(/* @__PURE__ */ Ew()),
    copySync: /* @__PURE__ */ bw()
  }, Ds;
}
var ks, Sh;
function Sw() {
  if (Sh) return ks;
  Sh = 1;
  const e = ht(), t = Ge, u = $m, a = process.platform === "win32";
  function d($) {
    [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((f) => {
      $[f] = $[f] || e[f], f = f + "Sync", $[f] = $[f] || e[f];
    }), $.maxBusyTries = $.maxBusyTries || 3;
  }
  function r($, v, f) {
    let m = 0;
    typeof v == "function" && (f = v, v = {}), u($, "rimraf: missing path"), u.strictEqual(typeof $, "string", "rimraf: path should be a string"), u.strictEqual(typeof f, "function", "rimraf: callback function required"), u(v, "rimraf: invalid options argument provided"), u.strictEqual(typeof v, "object", "rimraf: options should be object"), d(v), n($, v, function l(g) {
      if (g) {
        if ((g.code === "EBUSY" || g.code === "ENOTEMPTY" || g.code === "EPERM") && m < v.maxBusyTries) {
          m++;
          const b = m * 100;
          return setTimeout(() => n($, v, l), b);
        }
        g.code === "ENOENT" && (g = null);
      }
      f(g);
    });
  }
  function n($, v, f) {
    u($), u(v), u(typeof f == "function"), v.lstat($, (m, l) => {
      if (m && m.code === "ENOENT")
        return f(null);
      if (m && m.code === "EPERM" && a)
        return s($, v, m, f);
      if (l && l.isDirectory())
        return c($, v, m, f);
      v.unlink($, (g) => {
        if (g) {
          if (g.code === "ENOENT")
            return f(null);
          if (g.code === "EPERM")
            return a ? s($, v, g, f) : c($, v, g, f);
          if (g.code === "EISDIR")
            return c($, v, g, f);
        }
        return f(g);
      });
    });
  }
  function s($, v, f, m) {
    u($), u(v), u(typeof m == "function"), v.chmod($, 438, (l) => {
      l ? m(l.code === "ENOENT" ? null : f) : v.stat($, (g, b) => {
        g ? m(g.code === "ENOENT" ? null : f) : b.isDirectory() ? c($, v, f, m) : v.unlink($, m);
      });
    });
  }
  function i($, v, f) {
    let m;
    u($), u(v);
    try {
      v.chmodSync($, 438);
    } catch (l) {
      if (l.code === "ENOENT")
        return;
      throw f;
    }
    try {
      m = v.statSync($);
    } catch (l) {
      if (l.code === "ENOENT")
        return;
      throw f;
    }
    m.isDirectory() ? h($, v, f) : v.unlinkSync($);
  }
  function c($, v, f, m) {
    u($), u(v), u(typeof m == "function"), v.rmdir($, (l) => {
      l && (l.code === "ENOTEMPTY" || l.code === "EEXIST" || l.code === "EPERM") ? o($, v, m) : l && l.code === "ENOTDIR" ? m(f) : m(l);
    });
  }
  function o($, v, f) {
    u($), u(v), u(typeof f == "function"), v.readdir($, (m, l) => {
      if (m) return f(m);
      let g = l.length, b;
      if (g === 0) return v.rmdir($, f);
      l.forEach((S) => {
        r(t.join($, S), v, (_) => {
          if (!b) {
            if (_) return f(b = _);
            --g === 0 && v.rmdir($, f);
          }
        });
      });
    });
  }
  function p($, v) {
    let f;
    v = v || {}, d(v), u($, "rimraf: missing path"), u.strictEqual(typeof $, "string", "rimraf: path should be a string"), u(v, "rimraf: missing options"), u.strictEqual(typeof v, "object", "rimraf: options should be object");
    try {
      f = v.lstatSync($);
    } catch (m) {
      if (m.code === "ENOENT")
        return;
      m.code === "EPERM" && a && i($, v, m);
    }
    try {
      f && f.isDirectory() ? h($, v, null) : v.unlinkSync($);
    } catch (m) {
      if (m.code === "ENOENT")
        return;
      if (m.code === "EPERM")
        return a ? i($, v, m) : h($, v, m);
      if (m.code !== "EISDIR")
        throw m;
      h($, v, m);
    }
  }
  function h($, v, f) {
    u($), u(v);
    try {
      v.rmdirSync($);
    } catch (m) {
      if (m.code === "ENOTDIR")
        throw f;
      if (m.code === "ENOTEMPTY" || m.code === "EEXIST" || m.code === "EPERM")
        y($, v);
      else if (m.code !== "ENOENT")
        throw m;
    }
  }
  function y($, v) {
    if (u($), u(v), v.readdirSync($).forEach((f) => p(t.join($, f), v)), a) {
      const f = Date.now();
      do
        try {
          return v.rmdirSync($, v);
        } catch {
        }
      while (Date.now() - f < 500);
    } else
      return v.rmdirSync($, v);
  }
  return ks = r, r.sync = p, ks;
}
var qs, Ph;
function no() {
  if (Ph) return qs;
  Ph = 1;
  const e = ht(), t = vt().fromCallback, u = /* @__PURE__ */ Sw();
  function a(r, n) {
    if (e.rm) return e.rm(r, { recursive: !0, force: !0 }, n);
    u(r, n);
  }
  function d(r) {
    if (e.rmSync) return e.rmSync(r, { recursive: !0, force: !0 });
    u.sync(r);
  }
  return qs = {
    remove: t(a),
    removeSync: d
  }, qs;
}
var Fs, Rh;
function Pw() {
  if (Rh) return Fs;
  Rh = 1;
  const e = vt().fromPromise, t = /* @__PURE__ */ Gr(), u = Ge, a = /* @__PURE__ */ Ft(), d = /* @__PURE__ */ no(), r = e(async function(i) {
    let c;
    try {
      c = await t.readdir(i);
    } catch {
      return a.mkdirs(i);
    }
    return Promise.all(c.map((o) => d.remove(u.join(i, o))));
  });
  function n(s) {
    let i;
    try {
      i = t.readdirSync(s);
    } catch {
      return a.mkdirsSync(s);
    }
    i.forEach((c) => {
      c = u.join(s, c), d.removeSync(c);
    });
  }
  return Fs = {
    emptyDirSync: n,
    emptydirSync: n,
    emptyDir: r,
    emptydir: r
  }, Fs;
}
var js, Th;
function Rw() {
  if (Th) return js;
  Th = 1;
  const e = vt().fromCallback, t = Ge, u = ht(), a = /* @__PURE__ */ Ft();
  function d(n, s) {
    function i() {
      u.writeFile(n, "", (c) => {
        if (c) return s(c);
        s();
      });
    }
    u.stat(n, (c, o) => {
      if (!c && o.isFile()) return s();
      const p = t.dirname(n);
      u.stat(p, (h, y) => {
        if (h)
          return h.code === "ENOENT" ? a.mkdirs(p, ($) => {
            if ($) return s($);
            i();
          }) : s(h);
        y.isDirectory() ? i() : u.readdir(p, ($) => {
          if ($) return s($);
        });
      });
    });
  }
  function r(n) {
    let s;
    try {
      s = u.statSync(n);
    } catch {
    }
    if (s && s.isFile()) return;
    const i = t.dirname(n);
    try {
      u.statSync(i).isDirectory() || u.readdirSync(i);
    } catch (c) {
      if (c && c.code === "ENOENT") a.mkdirsSync(i);
      else throw c;
    }
    u.writeFileSync(n, "");
  }
  return js = {
    createFile: e(d),
    createFileSync: r
  }, js;
}
var Us, Oh;
function Tw() {
  if (Oh) return Us;
  Oh = 1;
  const e = vt().fromCallback, t = Ge, u = ht(), a = /* @__PURE__ */ Ft(), d = Pr().pathExists, { areIdentical: r } = /* @__PURE__ */ zr();
  function n(i, c, o) {
    function p(h, y) {
      u.link(h, y, ($) => {
        if ($) return o($);
        o(null);
      });
    }
    u.lstat(c, (h, y) => {
      u.lstat(i, ($, v) => {
        if ($)
          return $.message = $.message.replace("lstat", "ensureLink"), o($);
        if (y && r(v, y)) return o(null);
        const f = t.dirname(c);
        d(f, (m, l) => {
          if (m) return o(m);
          if (l) return p(i, c);
          a.mkdirs(f, (g) => {
            if (g) return o(g);
            p(i, c);
          });
        });
      });
    });
  }
  function s(i, c) {
    let o;
    try {
      o = u.lstatSync(c);
    } catch {
    }
    try {
      const y = u.lstatSync(i);
      if (o && r(y, o)) return;
    } catch (y) {
      throw y.message = y.message.replace("lstat", "ensureLink"), y;
    }
    const p = t.dirname(c);
    return u.existsSync(p) || a.mkdirsSync(p), u.linkSync(i, c);
  }
  return Us = {
    createLink: e(n),
    createLinkSync: s
  }, Us;
}
var Ls, Ah;
function Ow() {
  if (Ah) return Ls;
  Ah = 1;
  const e = Ge, t = ht(), u = Pr().pathExists;
  function a(r, n, s) {
    if (e.isAbsolute(r))
      return t.lstat(r, (i) => i ? (i.message = i.message.replace("lstat", "ensureSymlink"), s(i)) : s(null, {
        toCwd: r,
        toDst: r
      }));
    {
      const i = e.dirname(n), c = e.join(i, r);
      return u(c, (o, p) => o ? s(o) : p ? s(null, {
        toCwd: c,
        toDst: r
      }) : t.lstat(r, (h) => h ? (h.message = h.message.replace("lstat", "ensureSymlink"), s(h)) : s(null, {
        toCwd: r,
        toDst: e.relative(i, r)
      })));
    }
  }
  function d(r, n) {
    let s;
    if (e.isAbsolute(r)) {
      if (s = t.existsSync(r), !s) throw new Error("absolute srcpath does not exist");
      return {
        toCwd: r,
        toDst: r
      };
    } else {
      const i = e.dirname(n), c = e.join(i, r);
      if (s = t.existsSync(c), s)
        return {
          toCwd: c,
          toDst: r
        };
      if (s = t.existsSync(r), !s) throw new Error("relative srcpath does not exist");
      return {
        toCwd: r,
        toDst: e.relative(i, r)
      };
    }
  }
  return Ls = {
    symlinkPaths: a,
    symlinkPathsSync: d
  }, Ls;
}
var Ms, Nh;
function Aw() {
  if (Nh) return Ms;
  Nh = 1;
  const e = ht();
  function t(a, d, r) {
    if (r = typeof d == "function" ? d : r, d = typeof d == "function" ? !1 : d, d) return r(null, d);
    e.lstat(a, (n, s) => {
      if (n) return r(null, "file");
      d = s && s.isDirectory() ? "dir" : "file", r(null, d);
    });
  }
  function u(a, d) {
    let r;
    if (d) return d;
    try {
      r = e.lstatSync(a);
    } catch {
      return "file";
    }
    return r && r.isDirectory() ? "dir" : "file";
  }
  return Ms = {
    symlinkType: t,
    symlinkTypeSync: u
  }, Ms;
}
var xs, Ch;
function Nw() {
  if (Ch) return xs;
  Ch = 1;
  const e = vt().fromCallback, t = Ge, u = /* @__PURE__ */ Gr(), a = /* @__PURE__ */ Ft(), d = a.mkdirs, r = a.mkdirsSync, n = /* @__PURE__ */ Ow(), s = n.symlinkPaths, i = n.symlinkPathsSync, c = /* @__PURE__ */ Aw(), o = c.symlinkType, p = c.symlinkTypeSync, h = Pr().pathExists, { areIdentical: y } = /* @__PURE__ */ zr();
  function $(m, l, g, b) {
    b = typeof g == "function" ? g : b, g = typeof g == "function" ? !1 : g, u.lstat(l, (S, _) => {
      !S && _.isSymbolicLink() ? Promise.all([
        u.stat(m),
        u.stat(l)
      ]).then(([w, R]) => {
        if (y(w, R)) return b(null);
        v(m, l, g, b);
      }) : v(m, l, g, b);
    });
  }
  function v(m, l, g, b) {
    s(m, l, (S, _) => {
      if (S) return b(S);
      m = _.toDst, o(_.toCwd, g, (w, R) => {
        if (w) return b(w);
        const T = t.dirname(l);
        h(T, (M, F) => {
          if (M) return b(M);
          if (F) return u.symlink(m, l, R, b);
          d(T, (j) => {
            if (j) return b(j);
            u.symlink(m, l, R, b);
          });
        });
      });
    });
  }
  function f(m, l, g) {
    let b;
    try {
      b = u.lstatSync(l);
    } catch {
    }
    if (b && b.isSymbolicLink()) {
      const R = u.statSync(m), T = u.statSync(l);
      if (y(R, T)) return;
    }
    const S = i(m, l);
    m = S.toDst, g = p(S.toCwd, g);
    const _ = t.dirname(l);
    return u.existsSync(_) || r(_), u.symlinkSync(m, l, g);
  }
  return xs = {
    createSymlink: e($),
    createSymlinkSync: f
  }, xs;
}
var Vs, Ih;
function Cw() {
  if (Ih) return Vs;
  Ih = 1;
  const { createFile: e, createFileSync: t } = /* @__PURE__ */ Rw(), { createLink: u, createLinkSync: a } = /* @__PURE__ */ Tw(), { createSymlink: d, createSymlinkSync: r } = /* @__PURE__ */ Nw();
  return Vs = {
    // file
    createFile: e,
    createFileSync: t,
    ensureFile: e,
    ensureFileSync: t,
    // link
    createLink: u,
    createLinkSync: a,
    ensureLink: u,
    ensureLinkSync: a,
    // symlink
    createSymlink: d,
    createSymlinkSync: r,
    ensureSymlink: d,
    ensureSymlinkSync: r
  }, Vs;
}
var Bs, Dh;
function ec() {
  if (Dh) return Bs;
  Dh = 1;
  function e(u, { EOL: a = `
`, finalEOL: d = !0, replacer: r = null, spaces: n } = {}) {
    const s = d ? a : "";
    return JSON.stringify(u, r, n).replace(/\n/g, a) + s;
  }
  function t(u) {
    return Buffer.isBuffer(u) && (u = u.toString("utf8")), u.replace(/^\uFEFF/, "");
  }
  return Bs = { stringify: e, stripBom: t }, Bs;
}
var Hs, kh;
function Iw() {
  if (kh) return Hs;
  kh = 1;
  let e;
  try {
    e = ht();
  } catch {
    e = ar;
  }
  const t = vt(), { stringify: u, stripBom: a } = ec();
  async function d(p, h = {}) {
    typeof h == "string" && (h = { encoding: h });
    const y = h.fs || e, $ = "throws" in h ? h.throws : !0;
    let v = await t.fromCallback(y.readFile)(p, h);
    v = a(v);
    let f;
    try {
      f = JSON.parse(v, h ? h.reviver : null);
    } catch (m) {
      if ($)
        throw m.message = `${p}: ${m.message}`, m;
      return null;
    }
    return f;
  }
  const r = t.fromPromise(d);
  function n(p, h = {}) {
    typeof h == "string" && (h = { encoding: h });
    const y = h.fs || e, $ = "throws" in h ? h.throws : !0;
    try {
      let v = y.readFileSync(p, h);
      return v = a(v), JSON.parse(v, h.reviver);
    } catch (v) {
      if ($)
        throw v.message = `${p}: ${v.message}`, v;
      return null;
    }
  }
  async function s(p, h, y = {}) {
    const $ = y.fs || e, v = u(h, y);
    await t.fromCallback($.writeFile)(p, v, y);
  }
  const i = t.fromPromise(s);
  function c(p, h, y = {}) {
    const $ = y.fs || e, v = u(h, y);
    return $.writeFileSync(p, v, y);
  }
  return Hs = {
    readFile: r,
    readFileSync: n,
    writeFile: i,
    writeFileSync: c
  }, Hs;
}
var Gs, qh;
function Dw() {
  if (qh) return Gs;
  qh = 1;
  const e = Iw();
  return Gs = {
    // jsonfile exports
    readJson: e.readFile,
    readJsonSync: e.readFileSync,
    writeJson: e.writeFile,
    writeJsonSync: e.writeFileSync
  }, Gs;
}
var zs, Fh;
function tc() {
  if (Fh) return zs;
  Fh = 1;
  const e = vt().fromCallback, t = ht(), u = Ge, a = /* @__PURE__ */ Ft(), d = Pr().pathExists;
  function r(s, i, c, o) {
    typeof c == "function" && (o = c, c = "utf8");
    const p = u.dirname(s);
    d(p, (h, y) => {
      if (h) return o(h);
      if (y) return t.writeFile(s, i, c, o);
      a.mkdirs(p, ($) => {
        if ($) return o($);
        t.writeFile(s, i, c, o);
      });
    });
  }
  function n(s, ...i) {
    const c = u.dirname(s);
    if (t.existsSync(c))
      return t.writeFileSync(s, ...i);
    a.mkdirsSync(c), t.writeFileSync(s, ...i);
  }
  return zs = {
    outputFile: e(r),
    outputFileSync: n
  }, zs;
}
var Ks, jh;
function kw() {
  if (jh) return Ks;
  jh = 1;
  const { stringify: e } = ec(), { outputFile: t } = /* @__PURE__ */ tc();
  async function u(a, d, r = {}) {
    const n = e(d, r);
    await t(a, n, r);
  }
  return Ks = u, Ks;
}
var Ws, Uh;
function qw() {
  if (Uh) return Ws;
  Uh = 1;
  const { stringify: e } = ec(), { outputFileSync: t } = /* @__PURE__ */ tc();
  function u(a, d, r) {
    const n = e(d, r);
    t(a, n, r);
  }
  return Ws = u, Ws;
}
var Ys, Lh;
function Fw() {
  if (Lh) return Ys;
  Lh = 1;
  const e = vt().fromPromise, t = /* @__PURE__ */ Dw();
  return t.outputJson = e(/* @__PURE__ */ kw()), t.outputJsonSync = /* @__PURE__ */ qw(), t.outputJSON = t.outputJson, t.outputJSONSync = t.outputJsonSync, t.writeJSON = t.writeJson, t.writeJSONSync = t.writeJsonSync, t.readJSON = t.readJson, t.readJSONSync = t.readJsonSync, Ys = t, Ys;
}
var Js, Mh;
function jw() {
  if (Mh) return Js;
  Mh = 1;
  const e = ht(), t = Ge, u = Zu().copy, a = no().remove, d = Ft().mkdirp, r = Pr().pathExists, n = /* @__PURE__ */ zr();
  function s(h, y, $, v) {
    typeof $ == "function" && (v = $, $ = {}), $ = $ || {};
    const f = $.overwrite || $.clobber || !1;
    n.checkPaths(h, y, "move", $, (m, l) => {
      if (m) return v(m);
      const { srcStat: g, isChangingCase: b = !1 } = l;
      n.checkParentPaths(h, g, y, "move", (S) => {
        if (S) return v(S);
        if (i(y)) return c(h, y, f, b, v);
        d(t.dirname(y), (_) => _ ? v(_) : c(h, y, f, b, v));
      });
    });
  }
  function i(h) {
    const y = t.dirname(h);
    return t.parse(y).root === y;
  }
  function c(h, y, $, v, f) {
    if (v) return o(h, y, $, f);
    if ($)
      return a(y, (m) => m ? f(m) : o(h, y, $, f));
    r(y, (m, l) => m ? f(m) : l ? f(new Error("dest already exists.")) : o(h, y, $, f));
  }
  function o(h, y, $, v) {
    e.rename(h, y, (f) => f ? f.code !== "EXDEV" ? v(f) : p(h, y, $, v) : v());
  }
  function p(h, y, $, v) {
    u(h, y, {
      overwrite: $,
      errorOnExist: !0
    }, (m) => m ? v(m) : a(h, v));
  }
  return Js = s, Js;
}
var Xs, xh;
function Uw() {
  if (xh) return Xs;
  xh = 1;
  const e = ht(), t = Ge, u = Zu().copySync, a = no().removeSync, d = Ft().mkdirpSync, r = /* @__PURE__ */ zr();
  function n(p, h, y) {
    y = y || {};
    const $ = y.overwrite || y.clobber || !1, { srcStat: v, isChangingCase: f = !1 } = r.checkPathsSync(p, h, "move", y);
    return r.checkParentPathsSync(p, v, h, "move"), s(h) || d(t.dirname(h)), i(p, h, $, f);
  }
  function s(p) {
    const h = t.dirname(p);
    return t.parse(h).root === h;
  }
  function i(p, h, y, $) {
    if ($) return c(p, h, y);
    if (y)
      return a(h), c(p, h, y);
    if (e.existsSync(h)) throw new Error("dest already exists.");
    return c(p, h, y);
  }
  function c(p, h, y) {
    try {
      e.renameSync(p, h);
    } catch ($) {
      if ($.code !== "EXDEV") throw $;
      return o(p, h, y);
    }
  }
  function o(p, h, y) {
    return u(p, h, {
      overwrite: y,
      errorOnExist: !0
    }), a(p);
  }
  return Xs = n, Xs;
}
var Qs, Vh;
function Lw() {
  if (Vh) return Qs;
  Vh = 1;
  const e = vt().fromCallback;
  return Qs = {
    move: e(/* @__PURE__ */ jw()),
    moveSync: /* @__PURE__ */ Uw()
  }, Qs;
}
var Zs, Bh;
function sr() {
  return Bh || (Bh = 1, Zs = {
    // Export promiseified graceful-fs:
    .../* @__PURE__ */ Gr(),
    // Export extra methods:
    .../* @__PURE__ */ Zu(),
    .../* @__PURE__ */ Pw(),
    .../* @__PURE__ */ Cw(),
    .../* @__PURE__ */ Fw(),
    .../* @__PURE__ */ Ft(),
    .../* @__PURE__ */ Lw(),
    .../* @__PURE__ */ tc(),
    .../* @__PURE__ */ Pr(),
    .../* @__PURE__ */ no()
  }), Zs;
}
var rn = {}, $r = {}, eu = {}, wr = {}, Hh;
function rc() {
  if (Hh) return wr;
  Hh = 1, Object.defineProperty(wr, "__esModule", { value: !0 }), wr.CancellationError = wr.CancellationToken = void 0;
  const e = wm;
  let t = class extends e.EventEmitter {
    get cancelled() {
      return this._cancelled || this._parent != null && this._parent.cancelled;
    }
    set parent(d) {
      this.removeParentCancelHandler(), this._parent = d, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
    }
    // babel cannot compile ... correctly for super calls
    constructor(d) {
      super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, d != null && (this.parent = d);
    }
    cancel() {
      this._cancelled = !0, this.emit("cancel");
    }
    onCancel(d) {
      this.cancelled ? d() : this.once("cancel", d);
    }
    createPromise(d) {
      if (this.cancelled)
        return Promise.reject(new u());
      const r = () => {
        if (n != null)
          try {
            this.removeListener("cancel", n), n = null;
          } catch {
          }
      };
      let n = null;
      return new Promise((s, i) => {
        let c = null;
        if (n = () => {
          try {
            c != null && (c(), c = null);
          } finally {
            i(new u());
          }
        }, this.cancelled) {
          n();
          return;
        }
        this.onCancel(n), d(s, i, (o) => {
          c = o;
        });
      }).then((s) => (r(), s)).catch((s) => {
        throw r(), s;
      });
    }
    removeParentCancelHandler() {
      const d = this._parent;
      d != null && this.parentCancelHandler != null && (d.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
    }
    dispose() {
      try {
        this.removeParentCancelHandler();
      } finally {
        this.removeAllListeners(), this._parent = null;
      }
    }
  };
  wr.CancellationToken = t;
  class u extends Error {
    constructor() {
      super("cancelled");
    }
  }
  return wr.CancellationError = u, wr;
}
var ba = {}, Gh;
function io() {
  if (Gh) return ba;
  Gh = 1, Object.defineProperty(ba, "__esModule", { value: !0 }), ba.newError = e;
  function e(t, u) {
    const a = new Error(t);
    return a.code = u, a;
  }
  return ba;
}
var it = {}, Sa = { exports: {} }, Pa = { exports: {} }, tu, zh;
function Mw() {
  if (zh) return tu;
  zh = 1;
  var e = 1e3, t = e * 60, u = t * 60, a = u * 24, d = a * 7, r = a * 365.25;
  tu = function(o, p) {
    p = p || {};
    var h = typeof o;
    if (h === "string" && o.length > 0)
      return n(o);
    if (h === "number" && isFinite(o))
      return p.long ? i(o) : s(o);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(o)
    );
  };
  function n(o) {
    if (o = String(o), !(o.length > 100)) {
      var p = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        o
      );
      if (p) {
        var h = parseFloat(p[1]), y = (p[2] || "ms").toLowerCase();
        switch (y) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * r;
          case "weeks":
          case "week":
          case "w":
            return h * d;
          case "days":
          case "day":
          case "d":
            return h * a;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * u;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function s(o) {
    var p = Math.abs(o);
    return p >= a ? Math.round(o / a) + "d" : p >= u ? Math.round(o / u) + "h" : p >= t ? Math.round(o / t) + "m" : p >= e ? Math.round(o / e) + "s" : o + "ms";
  }
  function i(o) {
    var p = Math.abs(o);
    return p >= a ? c(o, p, a, "day") : p >= u ? c(o, p, u, "hour") : p >= t ? c(o, p, t, "minute") : p >= e ? c(o, p, e, "second") : o + " ms";
  }
  function c(o, p, h, y) {
    var $ = p >= h * 1.5;
    return Math.round(o / h) + " " + y + ($ ? "s" : "");
  }
  return tu;
}
var ru, Kh;
function Km() {
  if (Kh) return ru;
  Kh = 1;
  function e(t) {
    a.debug = a, a.default = a, a.coerce = c, a.disable = s, a.enable = r, a.enabled = i, a.humanize = Mw(), a.destroy = o, Object.keys(t).forEach((p) => {
      a[p] = t[p];
    }), a.names = [], a.skips = [], a.formatters = {};
    function u(p) {
      let h = 0;
      for (let y = 0; y < p.length; y++)
        h = (h << 5) - h + p.charCodeAt(y), h |= 0;
      return a.colors[Math.abs(h) % a.colors.length];
    }
    a.selectColor = u;
    function a(p) {
      let h, y = null, $, v;
      function f(...m) {
        if (!f.enabled)
          return;
        const l = f, g = Number(/* @__PURE__ */ new Date()), b = g - (h || g);
        l.diff = b, l.prev = h, l.curr = g, h = g, m[0] = a.coerce(m[0]), typeof m[0] != "string" && m.unshift("%O");
        let S = 0;
        m[0] = m[0].replace(/%([a-zA-Z%])/g, (w, R) => {
          if (w === "%%")
            return "%";
          S++;
          const T = a.formatters[R];
          if (typeof T == "function") {
            const M = m[S];
            w = T.call(l, M), m.splice(S, 1), S--;
          }
          return w;
        }), a.formatArgs.call(l, m), (l.log || a.log).apply(l, m);
      }
      return f.namespace = p, f.useColors = a.useColors(), f.color = a.selectColor(p), f.extend = d, f.destroy = a.destroy, Object.defineProperty(f, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => y !== null ? y : ($ !== a.namespaces && ($ = a.namespaces, v = a.enabled(p)), v),
        set: (m) => {
          y = m;
        }
      }), typeof a.init == "function" && a.init(f), f;
    }
    function d(p, h) {
      const y = a(this.namespace + (typeof h > "u" ? ":" : h) + p);
      return y.log = this.log, y;
    }
    function r(p) {
      a.save(p), a.namespaces = p, a.names = [], a.skips = [];
      const h = (typeof p == "string" ? p : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const y of h)
        y[0] === "-" ? a.skips.push(y.slice(1)) : a.names.push(y);
    }
    function n(p, h) {
      let y = 0, $ = 0, v = -1, f = 0;
      for (; y < p.length; )
        if ($ < h.length && (h[$] === p[y] || h[$] === "*"))
          h[$] === "*" ? (v = $, f = y, $++) : (y++, $++);
        else if (v !== -1)
          $ = v + 1, f++, y = f;
        else
          return !1;
      for (; $ < h.length && h[$] === "*"; )
        $++;
      return $ === h.length;
    }
    function s() {
      const p = [
        ...a.names,
        ...a.skips.map((h) => "-" + h)
      ].join(",");
      return a.enable(""), p;
    }
    function i(p) {
      for (const h of a.skips)
        if (n(p, h))
          return !1;
      for (const h of a.names)
        if (n(p, h))
          return !0;
      return !1;
    }
    function c(p) {
      return p instanceof Error ? p.stack || p.message : p;
    }
    function o() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return a.enable(a.load()), a;
  }
  return ru = e, ru;
}
var Wh;
function xw() {
  return Wh || (Wh = 1, function(e, t) {
    t.formatArgs = a, t.save = d, t.load = r, t.useColors = u, t.storage = n(), t.destroy = /* @__PURE__ */ (() => {
      let i = !1;
      return () => {
        i || (i = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function u() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let i;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (i = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(i[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function a(i) {
      if (i[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + i[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const c = "color: " + this.color;
      i.splice(1, 0, c, "color: inherit");
      let o = 0, p = 0;
      i[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (o++, h === "%c" && (p = o));
      }), i.splice(p, 0, c);
    }
    t.log = console.debug || console.log || (() => {
    });
    function d(i) {
      try {
        i ? t.storage.setItem("debug", i) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function r() {
      let i;
      try {
        i = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !i && typeof process < "u" && "env" in process && (i = process.env.DEBUG), i;
    }
    function n() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Km()(t);
    const { formatters: s } = e.exports;
    s.j = function(i) {
      try {
        return JSON.stringify(i);
      } catch (c) {
        return "[UnexpectedJSONParseError]: " + c.message;
      }
    };
  }(Pa, Pa.exports)), Pa.exports;
}
var Ra = { exports: {} }, nu, Yh;
function Vw() {
  return Yh || (Yh = 1, nu = (e, t = process.argv) => {
    const u = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", a = t.indexOf(u + e), d = t.indexOf("--");
    return a !== -1 && (d === -1 || a < d);
  }), nu;
}
var iu, Jh;
function Bw() {
  if (Jh) return iu;
  Jh = 1;
  const e = Ma, t = Em, u = Vw(), { env: a } = process;
  let d;
  u("no-color") || u("no-colors") || u("color=false") || u("color=never") ? d = 0 : (u("color") || u("colors") || u("color=true") || u("color=always")) && (d = 1), "FORCE_COLOR" in a && (a.FORCE_COLOR === "true" ? d = 1 : a.FORCE_COLOR === "false" ? d = 0 : d = a.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(a.FORCE_COLOR, 10), 3));
  function r(i) {
    return i === 0 ? !1 : {
      level: i,
      hasBasic: !0,
      has256: i >= 2,
      has16m: i >= 3
    };
  }
  function n(i, c) {
    if (d === 0)
      return 0;
    if (u("color=16m") || u("color=full") || u("color=truecolor"))
      return 3;
    if (u("color=256"))
      return 2;
    if (i && !c && d === void 0)
      return 0;
    const o = d || 0;
    if (a.TERM === "dumb")
      return o;
    if (process.platform === "win32") {
      const p = e.release().split(".");
      return Number(p[0]) >= 10 && Number(p[2]) >= 10586 ? Number(p[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in a)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((p) => p in a) || a.CI_NAME === "codeship" ? 1 : o;
    if ("TEAMCITY_VERSION" in a)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(a.TEAMCITY_VERSION) ? 1 : 0;
    if (a.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in a) {
      const p = parseInt((a.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (a.TERM_PROGRAM) {
        case "iTerm.app":
          return p >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(a.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(a.TERM) || "COLORTERM" in a ? 1 : o;
  }
  function s(i) {
    const c = n(i, i && i.isTTY);
    return r(c);
  }
  return iu = {
    supportsColor: s,
    stdout: r(n(!0, t.isatty(1))),
    stderr: r(n(!0, t.isatty(2)))
  }, iu;
}
var Xh;
function Hw() {
  return Xh || (Xh = 1, function(e, t) {
    const u = Em, a = ku;
    t.init = o, t.log = s, t.formatArgs = r, t.save = i, t.load = c, t.useColors = d, t.destroy = a.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = Bw();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, y) => {
      const $ = y.substring(6).toLowerCase().replace(/_([a-z])/g, (f, m) => m.toUpperCase());
      let v = process.env[y];
      return /^(yes|on|true|enabled)$/i.test(v) ? v = !0 : /^(no|off|false|disabled)$/i.test(v) ? v = !1 : v === "null" ? v = null : v = Number(v), h[$] = v, h;
    }, {});
    function d() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : u.isatty(process.stderr.fd);
    }
    function r(h) {
      const { namespace: y, useColors: $ } = this;
      if ($) {
        const v = this.color, f = "\x1B[3" + (v < 8 ? v : "8;5;" + v), m = `  ${f};1m${y} \x1B[0m`;
        h[0] = m + h[0].split(`
`).join(`
` + m), h.push(f + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = n() + y + " " + h[0];
    }
    function n() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...h) {
      return process.stderr.write(a.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function i(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function c() {
      return process.env.DEBUG;
    }
    function o(h) {
      h.inspectOpts = {};
      const y = Object.keys(t.inspectOpts);
      for (let $ = 0; $ < y.length; $++)
        h.inspectOpts[y[$]] = t.inspectOpts[y[$]];
    }
    e.exports = Km()(t);
    const { formatters: p } = e.exports;
    p.o = function(h) {
      return this.inspectOpts.colors = this.useColors, a.inspect(h, this.inspectOpts).split(`
`).map((y) => y.trim()).join(" ");
    }, p.O = function(h) {
      return this.inspectOpts.colors = this.useColors, a.inspect(h, this.inspectOpts);
    };
  }(Ra, Ra.exports)), Ra.exports;
}
var Qh;
function Gw() {
  return Qh || (Qh = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Sa.exports = xw() : Sa.exports = Hw()), Sa.exports;
}
var nn = {}, Zh;
function Wm() {
  if (Zh) return nn;
  Zh = 1, Object.defineProperty(nn, "__esModule", { value: !0 }), nn.ProgressCallbackTransform = void 0;
  const e = Rn;
  let t = class extends e.Transform {
    constructor(a, d, r) {
      super(), this.total = a, this.cancellationToken = d, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
    }
    _transform(a, d, r) {
      if (this.cancellationToken.cancelled) {
        r(new Error("cancelled"), null);
        return;
      }
      this.transferred += a.length, this.delta += a.length;
      const n = Date.now();
      n >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = n + 1e3, this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((n - this.start) / 1e3))
      }), this.delta = 0), r(null, a);
    }
    _flush(a) {
      if (this.cancellationToken.cancelled) {
        a(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.total,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, a(null);
    }
  };
  return nn.ProgressCallbackTransform = t, nn;
}
var ep;
function zw() {
  if (ep) return it;
  ep = 1, Object.defineProperty(it, "__esModule", { value: !0 }), it.DigestTransform = it.HttpExecutor = it.HttpError = void 0, it.createHttpError = c, it.parseJson = h, it.configureRequestOptionsFromUrl = $, it.configureRequestUrl = v, it.safeGetHeader = l, it.configureRequestOptions = b, it.safeStringifyJson = S;
  const e = On, t = Gw(), u = ar, a = Rn, d = Br, r = rc(), n = io(), s = Wm(), i = (0, t.default)("electron-builder");
  function c(_, w = null) {
    return new p(_.statusCode || -1, `${_.statusCode} ${_.statusMessage}` + (w == null ? "" : `
` + JSON.stringify(w, null, "  ")) + `
Headers: ` + S(_.headers), w);
  }
  const o = /* @__PURE__ */ new Map([
    [429, "Too many requests"],
    [400, "Bad request"],
    [403, "Forbidden"],
    [404, "Not found"],
    [405, "Method not allowed"],
    [406, "Not acceptable"],
    [408, "Request timeout"],
    [413, "Request entity too large"],
    [500, "Internal server error"],
    [502, "Bad gateway"],
    [503, "Service unavailable"],
    [504, "Gateway timeout"],
    [505, "HTTP version not supported"]
  ]);
  class p extends Error {
    constructor(w, R = `HTTP error: ${o.get(w) || w}`, T = null) {
      super(R), this.statusCode = w, this.description = T, this.name = "HttpError", this.code = `HTTP_ERROR_${w}`;
    }
    isServerError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
  }
  it.HttpError = p;
  function h(_) {
    return _.then((w) => w == null || w.length === 0 ? null : JSON.parse(w));
  }
  class y {
    constructor() {
      this.maxRedirects = 10;
    }
    request(w, R = new r.CancellationToken(), T) {
      b(w);
      const M = T == null ? void 0 : JSON.stringify(T), F = M ? Buffer.from(M) : void 0;
      if (F != null) {
        i(M);
        const { headers: j, ...V } = w;
        w = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": F.length,
            ...j
          },
          ...V
        };
      }
      return this.doApiRequest(w, R, (j) => j.end(F));
    }
    doApiRequest(w, R, T, M = 0) {
      return i.enabled && i(`Request: ${S(w)}`), R.createPromise((F, j, V) => {
        const U = this.createRequest(w, (z) => {
          try {
            this.handleResponse(z, w, R, F, j, M, T);
          } catch (W) {
            j(W);
          }
        });
        this.addErrorAndTimeoutHandlers(U, j, w.timeout), this.addRedirectHandlers(U, w, j, M, (z) => {
          this.doApiRequest(z, R, T, M).then(F).catch(j);
        }), T(U, j), V(() => U.abort());
      });
    }
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line
    addRedirectHandlers(w, R, T, M, F) {
    }
    addErrorAndTimeoutHandlers(w, R, T = 60 * 1e3) {
      this.addTimeOutHandler(w, R, T), w.on("error", R), w.on("aborted", () => {
        R(new Error("Request has been aborted by the server"));
      });
    }
    handleResponse(w, R, T, M, F, j, V) {
      var U;
      if (i.enabled && i(`Response: ${w.statusCode} ${w.statusMessage}, request options: ${S(R)}`), w.statusCode === 404) {
        F(c(w, `method: ${R.method || "GET"} url: ${R.protocol || "https:"}//${R.hostname}${R.port ? `:${R.port}` : ""}${R.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
        return;
      } else if (w.statusCode === 204) {
        M();
        return;
      }
      const z = (U = w.statusCode) !== null && U !== void 0 ? U : 0, W = z >= 300 && z < 400, Q = l(w, "location");
      if (W && Q != null) {
        if (j > this.maxRedirects) {
          F(this.createMaxRedirectError());
          return;
        }
        this.doApiRequest(y.prepareRedirectUrlOptions(Q, R), T, V, j).then(M).catch(F);
        return;
      }
      w.setEncoding("utf8");
      let ee = "";
      w.on("error", F), w.on("data", (ne) => ee += ne), w.on("end", () => {
        try {
          if (w.statusCode != null && w.statusCode >= 400) {
            const ne = l(w, "content-type"), K = ne != null && (Array.isArray(ne) ? ne.find((I) => I.includes("json")) != null : ne.includes("json"));
            F(c(w, `method: ${R.method || "GET"} url: ${R.protocol || "https:"}//${R.hostname}${R.port ? `:${R.port}` : ""}${R.path}

          Data:
          ${K ? JSON.stringify(JSON.parse(ee)) : ee}
          `));
          } else
            M(ee.length === 0 ? null : ee);
        } catch (ne) {
          F(ne);
        }
      });
    }
    async downloadToBuffer(w, R) {
      return await R.cancellationToken.createPromise((T, M, F) => {
        const j = [], V = {
          headers: R.headers || void 0,
          // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
          redirect: "manual"
        };
        v(w, V), b(V), this.doDownload(V, {
          destination: null,
          options: R,
          onCancel: F,
          callback: (U) => {
            U == null ? T(Buffer.concat(j)) : M(U);
          },
          responseHandler: (U, z) => {
            let W = 0;
            U.on("data", (Q) => {
              if (W += Q.length, W > 524288e3) {
                z(new Error("Maximum allowed size is 500 MB"));
                return;
              }
              j.push(Q);
            }), U.on("end", () => {
              z(null);
            });
          }
        }, 0);
      });
    }
    doDownload(w, R, T) {
      const M = this.createRequest(w, (F) => {
        if (F.statusCode >= 400) {
          R.callback(new Error(`Cannot download "${w.protocol || "https:"}//${w.hostname}${w.path}", status ${F.statusCode}: ${F.statusMessage}`));
          return;
        }
        F.on("error", R.callback);
        const j = l(F, "location");
        if (j != null) {
          T < this.maxRedirects ? this.doDownload(y.prepareRedirectUrlOptions(j, w), R, T++) : R.callback(this.createMaxRedirectError());
          return;
        }
        R.responseHandler == null ? g(R, F) : R.responseHandler(F, R.callback);
      });
      this.addErrorAndTimeoutHandlers(M, R.callback, w.timeout), this.addRedirectHandlers(M, w, R.callback, T, (F) => {
        this.doDownload(F, R, T++);
      }), M.end();
    }
    createMaxRedirectError() {
      return new Error(`Too many redirects (> ${this.maxRedirects})`);
    }
    addTimeOutHandler(w, R, T) {
      w.on("socket", (M) => {
        M.setTimeout(T, () => {
          w.abort(), R(new Error("Request timed out"));
        });
      });
    }
    static prepareRedirectUrlOptions(w, R) {
      const T = $(w, { ...R }), M = T.headers;
      if (M?.authorization) {
        const F = new d.URL(w);
        (F.hostname.endsWith(".amazonaws.com") || F.searchParams.has("X-Amz-Credential")) && delete M.authorization;
      }
      return T;
    }
    static retryOnServerError(w, R = 3) {
      for (let T = 0; ; T++)
        try {
          return w();
        } catch (M) {
          if (T < R && (M instanceof p && M.isServerError() || M.code === "EPIPE"))
            continue;
          throw M;
        }
    }
  }
  it.HttpExecutor = y;
  function $(_, w) {
    const R = b(w);
    return v(new d.URL(_), R), R;
  }
  function v(_, w) {
    w.protocol = _.protocol, w.hostname = _.hostname, _.port ? w.port = _.port : w.port && delete w.port, w.path = _.pathname + _.search;
  }
  class f extends a.Transform {
    // noinspection JSUnusedGlobalSymbols
    get actual() {
      return this._actual;
    }
    constructor(w, R = "sha512", T = "base64") {
      super(), this.expected = w, this.algorithm = R, this.encoding = T, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, e.createHash)(R);
    }
    // noinspection JSUnusedGlobalSymbols
    _transform(w, R, T) {
      this.digester.update(w), T(null, w);
    }
    // noinspection JSUnusedGlobalSymbols
    _flush(w) {
      if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
        try {
          this.validate();
        } catch (R) {
          w(R);
          return;
        }
      w(null);
    }
    validate() {
      if (this._actual == null)
        throw (0, n.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
      if (this._actual !== this.expected)
        throw (0, n.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
      return null;
    }
  }
  it.DigestTransform = f;
  function m(_, w, R) {
    return _ != null && w != null && _ !== w ? (R(new Error(`checksum mismatch: expected ${w} but got ${_} (X-Checksum-Sha2 header)`)), !1) : !0;
  }
  function l(_, w) {
    const R = _.headers[w];
    return R == null ? null : Array.isArray(R) ? R.length === 0 ? null : R[R.length - 1] : R;
  }
  function g(_, w) {
    if (!m(l(w, "X-Checksum-Sha2"), _.options.sha2, _.callback))
      return;
    const R = [];
    if (_.options.onProgress != null) {
      const j = l(w, "content-length");
      j != null && R.push(new s.ProgressCallbackTransform(parseInt(j, 10), _.options.cancellationToken, _.options.onProgress));
    }
    const T = _.options.sha512;
    T != null ? R.push(new f(T, "sha512", T.length === 128 && !T.includes("+") && !T.includes("Z") && !T.includes("=") ? "hex" : "base64")) : _.options.sha2 != null && R.push(new f(_.options.sha2, "sha256", "hex"));
    const M = (0, u.createWriteStream)(_.destination);
    R.push(M);
    let F = w;
    for (const j of R)
      j.on("error", (V) => {
        M.close(), _.options.cancellationToken.cancelled || _.callback(V);
      }), F = F.pipe(j);
    M.on("finish", () => {
      M.close(_.callback);
    });
  }
  function b(_, w, R) {
    R != null && (_.method = R), _.headers = { ..._.headers };
    const T = _.headers;
    return w != null && (T.authorization = w.startsWith("Basic") || w.startsWith("Bearer") ? w : `token ${w}`), T["User-Agent"] == null && (T["User-Agent"] = "electron-builder"), (R == null || R === "GET" || T["Cache-Control"] == null) && (T["Cache-Control"] = "no-cache"), _.protocol == null && process.versions.electron != null && (_.protocol = "https:"), _;
  }
  function S(_, w) {
    return JSON.stringify(_, (R, T) => R.endsWith("Authorization") || R.endsWith("authorization") || R.endsWith("Password") || R.endsWith("PASSWORD") || R.endsWith("Token") || R.includes("password") || R.includes("token") || w != null && w.has(R) ? "<stripped sensitive data>" : T, 2);
  }
  return it;
}
var an = {}, tp;
function Kw() {
  if (tp) return an;
  tp = 1, Object.defineProperty(an, "__esModule", { value: !0 }), an.MemoLazy = void 0;
  let e = class {
    constructor(a, d) {
      this.selector = a, this.creator = d, this.selected = void 0, this._value = void 0;
    }
    get hasValue() {
      return this._value !== void 0;
    }
    get value() {
      const a = this.selector();
      if (this._value !== void 0 && t(this.selected, a))
        return this._value;
      this.selected = a;
      const d = this.creator(a);
      return this.value = d, d;
    }
    set value(a) {
      this._value = a;
    }
  };
  an.MemoLazy = e;
  function t(u, a) {
    if (typeof u == "object" && u !== null && (typeof a == "object" && a !== null)) {
      const n = Object.keys(u), s = Object.keys(a);
      return n.length === s.length && n.every((i) => t(u[i], a[i]));
    }
    return u === a;
  }
  return an;
}
var on = {}, rp;
function Ww() {
  if (rp) return on;
  rp = 1, Object.defineProperty(on, "__esModule", { value: !0 }), on.githubUrl = e, on.getS3LikeProviderBaseUrl = t;
  function e(r, n = "github.com") {
    return `${r.protocol || "https"}://${r.host || n}`;
  }
  function t(r) {
    const n = r.provider;
    if (n === "s3")
      return u(r);
    if (n === "spaces")
      return d(r);
    throw new Error(`Not supported provider: ${n}`);
  }
  function u(r) {
    let n;
    if (r.accelerate == !0)
      n = `https://${r.bucket}.s3-accelerate.amazonaws.com`;
    else if (r.endpoint != null)
      n = `${r.endpoint}/${r.bucket}`;
    else if (r.bucket.includes(".")) {
      if (r.region == null)
        throw new Error(`Bucket name "${r.bucket}" includes a dot, but S3 region is missing`);
      r.region === "us-east-1" ? n = `https://s3.amazonaws.com/${r.bucket}` : n = `https://s3-${r.region}.amazonaws.com/${r.bucket}`;
    } else r.region === "cn-north-1" ? n = `https://${r.bucket}.s3.${r.region}.amazonaws.com.cn` : n = `https://${r.bucket}.s3.amazonaws.com`;
    return a(n, r.path);
  }
  function a(r, n) {
    return n != null && n.length > 0 && (n.startsWith("/") || (r += "/"), r += n), r;
  }
  function d(r) {
    if (r.name == null)
      throw new Error("name is missing");
    if (r.region == null)
      throw new Error("region is missing");
    return a(`https://${r.name}.${r.region}.digitaloceanspaces.com`, r.path);
  }
  return on;
}
var Ta = {}, np;
function Yw() {
  if (np) return Ta;
  np = 1, Object.defineProperty(Ta, "__esModule", { value: !0 }), Ta.retry = t;
  const e = rc();
  async function t(u, a, d, r = 0, n = 0, s) {
    var i;
    const c = new e.CancellationToken();
    try {
      return await u();
    } catch (o) {
      if ((!((i = s?.(o)) !== null && i !== void 0) || i) && a > 0 && !c.cancelled)
        return await new Promise((p) => setTimeout(p, d + r * n)), await t(u, a - 1, d, r, n + 1, s);
      throw o;
    }
  }
  return Ta;
}
var Oa = {}, ip;
function Jw() {
  if (ip) return Oa;
  ip = 1, Object.defineProperty(Oa, "__esModule", { value: !0 }), Oa.parseDn = e;
  function e(t) {
    let u = !1, a = null, d = "", r = 0;
    t = t.trim();
    const n = /* @__PURE__ */ new Map();
    for (let s = 0; s <= t.length; s++) {
      if (s === t.length) {
        a !== null && n.set(a, d);
        break;
      }
      const i = t[s];
      if (u) {
        if (i === '"') {
          u = !1;
          continue;
        }
      } else {
        if (i === '"') {
          u = !0;
          continue;
        }
        if (i === "\\") {
          s++;
          const c = parseInt(t.slice(s, s + 2), 16);
          Number.isNaN(c) ? d += t[s] : (s++, d += String.fromCharCode(c));
          continue;
        }
        if (a === null && i === "=") {
          a = d, d = "";
          continue;
        }
        if (i === "," || i === ";" || i === "+") {
          a !== null && n.set(a, d), a = null, d = "";
          continue;
        }
      }
      if (i === " " && !u) {
        if (d.length === 0)
          continue;
        if (s > r) {
          let c = s;
          for (; t[c] === " "; )
            c++;
          r = c;
        }
        if (r >= t.length || t[r] === "," || t[r] === ";" || a === null && t[r] === "=" || a !== null && t[r] === "+") {
          s = r - 1;
          continue;
        }
      }
      d += i;
    }
    return n;
  }
  return Oa;
}
var Er = {}, ap;
function Xw() {
  if (ap) return Er;
  ap = 1, Object.defineProperty(Er, "__esModule", { value: !0 }), Er.nil = Er.UUID = void 0;
  const e = On, t = io(), u = "options.name must be either a string or a Buffer", a = (0, e.randomBytes)(16);
  a[0] = a[0] | 1;
  const d = {}, r = [];
  for (let p = 0; p < 256; p++) {
    const h = (p + 256).toString(16).substr(1);
    d[h] = p, r[p] = h;
  }
  class n {
    constructor(h) {
      this.ascii = null, this.binary = null;
      const y = n.check(h);
      if (!y)
        throw new Error("not a UUID");
      this.version = y.version, y.format === "ascii" ? this.ascii = h : this.binary = h;
    }
    static v5(h, y) {
      return c(h, "sha1", 80, y);
    }
    toString() {
      return this.ascii == null && (this.ascii = o(this.binary)), this.ascii;
    }
    inspect() {
      return `UUID v${this.version} ${this.toString()}`;
    }
    static check(h, y = 0) {
      if (typeof h == "string")
        return h = h.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(h) ? h === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
          version: (d[h[14] + h[15]] & 240) >> 4,
          variant: s((d[h[19] + h[20]] & 224) >> 5),
          format: "ascii"
        } : !1;
      if (Buffer.isBuffer(h)) {
        if (h.length < y + 16)
          return !1;
        let $ = 0;
        for (; $ < 16 && h[y + $] === 0; $++)
          ;
        return $ === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
          version: (h[y + 6] & 240) >> 4,
          variant: s((h[y + 8] & 224) >> 5),
          format: "binary"
        };
      }
      throw (0, t.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
    }
    // read stringified uuid into a Buffer
    static parse(h) {
      const y = Buffer.allocUnsafe(16);
      let $ = 0;
      for (let v = 0; v < 16; v++)
        y[v] = d[h[$++] + h[$++]], (v === 3 || v === 5 || v === 7 || v === 9) && ($ += 1);
      return y;
    }
  }
  Er.UUID = n, n.OID = n.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
  function s(p) {
    switch (p) {
      case 0:
      case 1:
      case 3:
        return "ncs";
      case 4:
      case 5:
        return "rfc4122";
      case 6:
        return "microsoft";
      default:
        return "future";
    }
  }
  var i;
  (function(p) {
    p[p.ASCII = 0] = "ASCII", p[p.BINARY = 1] = "BINARY", p[p.OBJECT = 2] = "OBJECT";
  })(i || (i = {}));
  function c(p, h, y, $, v = i.ASCII) {
    const f = (0, e.createHash)(h);
    if (typeof p != "string" && !Buffer.isBuffer(p))
      throw (0, t.newError)(u, "ERR_INVALID_UUID_NAME");
    f.update($), f.update(p);
    const l = f.digest();
    let g;
    switch (v) {
      case i.BINARY:
        l[6] = l[6] & 15 | y, l[8] = l[8] & 63 | 128, g = l;
        break;
      case i.OBJECT:
        l[6] = l[6] & 15 | y, l[8] = l[8] & 63 | 128, g = new n(l);
        break;
      default:
        g = r[l[0]] + r[l[1]] + r[l[2]] + r[l[3]] + "-" + r[l[4]] + r[l[5]] + "-" + r[l[6] & 15 | y] + r[l[7]] + "-" + r[l[8] & 63 | 128] + r[l[9]] + "-" + r[l[10]] + r[l[11]] + r[l[12]] + r[l[13]] + r[l[14]] + r[l[15]];
        break;
    }
    return g;
  }
  function o(p) {
    return r[p[0]] + r[p[1]] + r[p[2]] + r[p[3]] + "-" + r[p[4]] + r[p[5]] + "-" + r[p[6]] + r[p[7]] + "-" + r[p[8]] + r[p[9]] + "-" + r[p[10]] + r[p[11]] + r[p[12]] + r[p[13]] + r[p[14]] + r[p[15]];
  }
  return Er.nil = new n("00000000-0000-0000-0000-000000000000"), Er;
}
var Ur = {}, au = {}, op;
function Qw() {
  return op || (op = 1, function(e) {
    (function(t) {
      t.parser = function(N, A) {
        return new a(N, A);
      }, t.SAXParser = a, t.SAXStream = o, t.createStream = c, t.MAX_BUFFER_LENGTH = 64 * 1024;
      var u = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      t.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function a(N, A) {
        if (!(this instanceof a))
          return new a(N, A);
        var J = this;
        r(J), J.q = J.c = "", J.bufferCheckPosition = t.MAX_BUFFER_LENGTH, J.opt = A || {}, J.opt.lowercase = J.opt.lowercase || J.opt.lowercasetags, J.looseCase = J.opt.lowercase ? "toLowerCase" : "toUpperCase", J.tags = [], J.closed = J.closedRoot = J.sawRoot = !1, J.tag = J.error = null, J.strict = !!N, J.noscript = !!(N || J.opt.noscript), J.state = T.BEGIN, J.strictEntities = J.opt.strictEntities, J.ENTITIES = J.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), J.attribList = [], J.opt.xmlns && (J.ns = Object.create(v)), J.opt.unquotedAttributeValues === void 0 && (J.opt.unquotedAttributeValues = !N), J.trackPosition = J.opt.position !== !1, J.trackPosition && (J.position = J.line = J.column = 0), F(J, "onready");
      }
      Object.create || (Object.create = function(N) {
        function A() {
        }
        A.prototype = N;
        var J = new A();
        return J;
      }), Object.keys || (Object.keys = function(N) {
        var A = [];
        for (var J in N) N.hasOwnProperty(J) && A.push(J);
        return A;
      });
      function d(N) {
        for (var A = Math.max(t.MAX_BUFFER_LENGTH, 10), J = 0, B = 0, C = u.length; B < C; B++) {
          var k = N[u[B]].length;
          if (k > A)
            switch (u[B]) {
              case "textNode":
                V(N);
                break;
              case "cdata":
                j(N, "oncdata", N.cdata), N.cdata = "";
                break;
              case "script":
                j(N, "onscript", N.script), N.script = "";
                break;
              default:
                z(N, "Max buffer length exceeded: " + u[B]);
            }
          J = Math.max(J, k);
        }
        var H = t.MAX_BUFFER_LENGTH - J;
        N.bufferCheckPosition = H + N.position;
      }
      function r(N) {
        for (var A = 0, J = u.length; A < J; A++)
          N[u[A]] = "";
      }
      function n(N) {
        V(N), N.cdata !== "" && (j(N, "oncdata", N.cdata), N.cdata = ""), N.script !== "" && (j(N, "onscript", N.script), N.script = "");
      }
      a.prototype = {
        end: function() {
          W(this);
        },
        write: L,
        resume: function() {
          return this.error = null, this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          n(this);
        }
      };
      var s;
      try {
        s = require("stream").Stream;
      } catch {
        s = function() {
        };
      }
      s || (s = function() {
      });
      var i = t.EVENTS.filter(function(N) {
        return N !== "error" && N !== "end";
      });
      function c(N, A) {
        return new o(N, A);
      }
      function o(N, A) {
        if (!(this instanceof o))
          return new o(N, A);
        s.apply(this), this._parser = new a(N, A), this.writable = !0, this.readable = !0;
        var J = this;
        this._parser.onend = function() {
          J.emit("end");
        }, this._parser.onerror = function(B) {
          J.emit("error", B), J._parser.error = null;
        }, this._decoder = null, i.forEach(function(B) {
          Object.defineProperty(J, "on" + B, {
            get: function() {
              return J._parser["on" + B];
            },
            set: function(C) {
              if (!C)
                return J.removeAllListeners(B), J._parser["on" + B] = C, C;
              J.on(B, C);
            },
            enumerable: !0,
            configurable: !1
          });
        });
      }
      o.prototype = Object.create(s.prototype, {
        constructor: {
          value: o
        }
      }), o.prototype.write = function(N) {
        if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(N)) {
          if (!this._decoder) {
            var A = vg.StringDecoder;
            this._decoder = new A("utf8");
          }
          N = this._decoder.write(N);
        }
        return this._parser.write(N.toString()), this.emit("data", N), !0;
      }, o.prototype.end = function(N) {
        return N && N.length && this.write(N), this._parser.end(), !0;
      }, o.prototype.on = function(N, A) {
        var J = this;
        return !J._parser["on" + N] && i.indexOf(N) !== -1 && (J._parser["on" + N] = function() {
          var B = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          B.splice(0, 0, N), J.emit.apply(J, B);
        }), s.prototype.on.call(J, N, A);
      };
      var p = "[CDATA[", h = "DOCTYPE", y = "http://www.w3.org/XML/1998/namespace", $ = "http://www.w3.org/2000/xmlns/", v = { xml: y, xmlns: $ }, f = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, m = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, l = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, g = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function b(N) {
        return N === " " || N === `
` || N === "\r" || N === "	";
      }
      function S(N) {
        return N === '"' || N === "'";
      }
      function _(N) {
        return N === ">" || b(N);
      }
      function w(N, A) {
        return N.test(A);
      }
      function R(N, A) {
        return !w(N, A);
      }
      var T = 0;
      t.STATE = {
        BEGIN: T++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: T++,
        // leading whitespace
        TEXT: T++,
        // general stuff
        TEXT_ENTITY: T++,
        // &amp and such.
        OPEN_WAKA: T++,
        // <
        SGML_DECL: T++,
        // <!BLARG
        SGML_DECL_QUOTED: T++,
        // <!BLARG foo "bar
        DOCTYPE: T++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: T++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: T++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: T++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: T++,
        // <!-
        COMMENT: T++,
        // <!--
        COMMENT_ENDING: T++,
        // <!-- blah -
        COMMENT_ENDED: T++,
        // <!-- blah --
        CDATA: T++,
        // <![CDATA[ something
        CDATA_ENDING: T++,
        // ]
        CDATA_ENDING_2: T++,
        // ]]
        PROC_INST: T++,
        // <?hi
        PROC_INST_BODY: T++,
        // <?hi there
        PROC_INST_ENDING: T++,
        // <?hi "there" ?
        OPEN_TAG: T++,
        // <strong
        OPEN_TAG_SLASH: T++,
        // <strong /
        ATTRIB: T++,
        // <a
        ATTRIB_NAME: T++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: T++,
        // <a foo _
        ATTRIB_VALUE: T++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: T++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: T++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: T++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: T++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: T++,
        // <foo bar=&quot
        CLOSE_TAG: T++,
        // </a
        CLOSE_TAG_SAW_WHITE: T++,
        // </a   >
        SCRIPT: T++,
        // <script> ...
        SCRIPT_ENDING: T++
        // <script> ... <
      }, t.XML_ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'"
      }, t.ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'",
        AElig: 198,
        Aacute: 193,
        Acirc: 194,
        Agrave: 192,
        Aring: 197,
        Atilde: 195,
        Auml: 196,
        Ccedil: 199,
        ETH: 208,
        Eacute: 201,
        Ecirc: 202,
        Egrave: 200,
        Euml: 203,
        Iacute: 205,
        Icirc: 206,
        Igrave: 204,
        Iuml: 207,
        Ntilde: 209,
        Oacute: 211,
        Ocirc: 212,
        Ograve: 210,
        Oslash: 216,
        Otilde: 213,
        Ouml: 214,
        THORN: 222,
        Uacute: 218,
        Ucirc: 219,
        Ugrave: 217,
        Uuml: 220,
        Yacute: 221,
        aacute: 225,
        acirc: 226,
        aelig: 230,
        agrave: 224,
        aring: 229,
        atilde: 227,
        auml: 228,
        ccedil: 231,
        eacute: 233,
        ecirc: 234,
        egrave: 232,
        eth: 240,
        euml: 235,
        iacute: 237,
        icirc: 238,
        igrave: 236,
        iuml: 239,
        ntilde: 241,
        oacute: 243,
        ocirc: 244,
        ograve: 242,
        oslash: 248,
        otilde: 245,
        ouml: 246,
        szlig: 223,
        thorn: 254,
        uacute: 250,
        ucirc: 251,
        ugrave: 249,
        uuml: 252,
        yacute: 253,
        yuml: 255,
        copy: 169,
        reg: 174,
        nbsp: 160,
        iexcl: 161,
        cent: 162,
        pound: 163,
        curren: 164,
        yen: 165,
        brvbar: 166,
        sect: 167,
        uml: 168,
        ordf: 170,
        laquo: 171,
        not: 172,
        shy: 173,
        macr: 175,
        deg: 176,
        plusmn: 177,
        sup1: 185,
        sup2: 178,
        sup3: 179,
        acute: 180,
        micro: 181,
        para: 182,
        middot: 183,
        cedil: 184,
        ordm: 186,
        raquo: 187,
        frac14: 188,
        frac12: 189,
        frac34: 190,
        iquest: 191,
        times: 215,
        divide: 247,
        OElig: 338,
        oelig: 339,
        Scaron: 352,
        scaron: 353,
        Yuml: 376,
        fnof: 402,
        circ: 710,
        tilde: 732,
        Alpha: 913,
        Beta: 914,
        Gamma: 915,
        Delta: 916,
        Epsilon: 917,
        Zeta: 918,
        Eta: 919,
        Theta: 920,
        Iota: 921,
        Kappa: 922,
        Lambda: 923,
        Mu: 924,
        Nu: 925,
        Xi: 926,
        Omicron: 927,
        Pi: 928,
        Rho: 929,
        Sigma: 931,
        Tau: 932,
        Upsilon: 933,
        Phi: 934,
        Chi: 935,
        Psi: 936,
        Omega: 937,
        alpha: 945,
        beta: 946,
        gamma: 947,
        delta: 948,
        epsilon: 949,
        zeta: 950,
        eta: 951,
        theta: 952,
        iota: 953,
        kappa: 954,
        lambda: 955,
        mu: 956,
        nu: 957,
        xi: 958,
        omicron: 959,
        pi: 960,
        rho: 961,
        sigmaf: 962,
        sigma: 963,
        tau: 964,
        upsilon: 965,
        phi: 966,
        chi: 967,
        psi: 968,
        omega: 969,
        thetasym: 977,
        upsih: 978,
        piv: 982,
        ensp: 8194,
        emsp: 8195,
        thinsp: 8201,
        zwnj: 8204,
        zwj: 8205,
        lrm: 8206,
        rlm: 8207,
        ndash: 8211,
        mdash: 8212,
        lsquo: 8216,
        rsquo: 8217,
        sbquo: 8218,
        ldquo: 8220,
        rdquo: 8221,
        bdquo: 8222,
        dagger: 8224,
        Dagger: 8225,
        bull: 8226,
        hellip: 8230,
        permil: 8240,
        prime: 8242,
        Prime: 8243,
        lsaquo: 8249,
        rsaquo: 8250,
        oline: 8254,
        frasl: 8260,
        euro: 8364,
        image: 8465,
        weierp: 8472,
        real: 8476,
        trade: 8482,
        alefsym: 8501,
        larr: 8592,
        uarr: 8593,
        rarr: 8594,
        darr: 8595,
        harr: 8596,
        crarr: 8629,
        lArr: 8656,
        uArr: 8657,
        rArr: 8658,
        dArr: 8659,
        hArr: 8660,
        forall: 8704,
        part: 8706,
        exist: 8707,
        empty: 8709,
        nabla: 8711,
        isin: 8712,
        notin: 8713,
        ni: 8715,
        prod: 8719,
        sum: 8721,
        minus: 8722,
        lowast: 8727,
        radic: 8730,
        prop: 8733,
        infin: 8734,
        ang: 8736,
        and: 8743,
        or: 8744,
        cap: 8745,
        cup: 8746,
        int: 8747,
        there4: 8756,
        sim: 8764,
        cong: 8773,
        asymp: 8776,
        ne: 8800,
        equiv: 8801,
        le: 8804,
        ge: 8805,
        sub: 8834,
        sup: 8835,
        nsub: 8836,
        sube: 8838,
        supe: 8839,
        oplus: 8853,
        otimes: 8855,
        perp: 8869,
        sdot: 8901,
        lceil: 8968,
        rceil: 8969,
        lfloor: 8970,
        rfloor: 8971,
        lang: 9001,
        rang: 9002,
        loz: 9674,
        spades: 9824,
        clubs: 9827,
        hearts: 9829,
        diams: 9830
      }, Object.keys(t.ENTITIES).forEach(function(N) {
        var A = t.ENTITIES[N], J = typeof A == "number" ? String.fromCharCode(A) : A;
        t.ENTITIES[N] = J;
      });
      for (var M in t.STATE)
        t.STATE[t.STATE[M]] = M;
      T = t.STATE;
      function F(N, A, J) {
        N[A] && N[A](J);
      }
      function j(N, A, J) {
        N.textNode && V(N), F(N, A, J);
      }
      function V(N) {
        N.textNode = U(N.opt, N.textNode), N.textNode && F(N, "ontext", N.textNode), N.textNode = "";
      }
      function U(N, A) {
        return N.trim && (A = A.trim()), N.normalize && (A = A.replace(/\s+/g, " ")), A;
      }
      function z(N, A) {
        return V(N), N.trackPosition && (A += `
Line: ` + N.line + `
Column: ` + N.column + `
Char: ` + N.c), A = new Error(A), N.error = A, F(N, "onerror", A), N;
      }
      function W(N) {
        return N.sawRoot && !N.closedRoot && Q(N, "Unclosed root tag"), N.state !== T.BEGIN && N.state !== T.BEGIN_WHITESPACE && N.state !== T.TEXT && z(N, "Unexpected end"), V(N), N.c = "", N.closed = !0, F(N, "onend"), a.call(N, N.strict, N.opt), N;
      }
      function Q(N, A) {
        if (typeof N != "object" || !(N instanceof a))
          throw new Error("bad call to strictFail");
        N.strict && z(N, A);
      }
      function ee(N) {
        N.strict || (N.tagName = N.tagName[N.looseCase]());
        var A = N.tags[N.tags.length - 1] || N, J = N.tag = { name: N.tagName, attributes: {} };
        N.opt.xmlns && (J.ns = A.ns), N.attribList.length = 0, j(N, "onopentagstart", J);
      }
      function ne(N, A) {
        var J = N.indexOf(":"), B = J < 0 ? ["", N] : N.split(":"), C = B[0], k = B[1];
        return A && N === "xmlns" && (C = "xmlns", k = ""), { prefix: C, local: k };
      }
      function K(N) {
        if (N.strict || (N.attribName = N.attribName[N.looseCase]()), N.attribList.indexOf(N.attribName) !== -1 || N.tag.attributes.hasOwnProperty(N.attribName)) {
          N.attribName = N.attribValue = "";
          return;
        }
        if (N.opt.xmlns) {
          var A = ne(N.attribName, !0), J = A.prefix, B = A.local;
          if (J === "xmlns")
            if (B === "xml" && N.attribValue !== y)
              Q(
                N,
                "xml: prefix must be bound to " + y + `
Actual: ` + N.attribValue
              );
            else if (B === "xmlns" && N.attribValue !== $)
              Q(
                N,
                "xmlns: prefix must be bound to " + $ + `
Actual: ` + N.attribValue
              );
            else {
              var C = N.tag, k = N.tags[N.tags.length - 1] || N;
              C.ns === k.ns && (C.ns = Object.create(k.ns)), C.ns[B] = N.attribValue;
            }
          N.attribList.push([N.attribName, N.attribValue]);
        } else
          N.tag.attributes[N.attribName] = N.attribValue, j(N, "onattribute", {
            name: N.attribName,
            value: N.attribValue
          });
        N.attribName = N.attribValue = "";
      }
      function I(N, A) {
        if (N.opt.xmlns) {
          var J = N.tag, B = ne(N.tagName);
          J.prefix = B.prefix, J.local = B.local, J.uri = J.ns[B.prefix] || "", J.prefix && !J.uri && (Q(N, "Unbound namespace prefix: " + JSON.stringify(N.tagName)), J.uri = B.prefix);
          var C = N.tags[N.tags.length - 1] || N;
          J.ns && C.ns !== J.ns && Object.keys(J.ns).forEach(function(te) {
            j(N, "onopennamespace", {
              prefix: te,
              uri: J.ns[te]
            });
          });
          for (var k = 0, H = N.attribList.length; k < H; k++) {
            var Y = N.attribList[k], Z = Y[0], le = Y[1], ve = ne(Z, !0), Te = ve.prefix, ke = ve.local, Ae = Te === "" ? "" : J.ns[Te] || "", E = {
              name: Z,
              value: le,
              prefix: Te,
              local: ke,
              uri: Ae
            };
            Te && Te !== "xmlns" && !Ae && (Q(N, "Unbound namespace prefix: " + JSON.stringify(Te)), E.uri = Te), N.tag.attributes[Z] = E, j(N, "onattribute", E);
          }
          N.attribList.length = 0;
        }
        N.tag.isSelfClosing = !!A, N.sawRoot = !0, N.tags.push(N.tag), j(N, "onopentag", N.tag), A || (!N.noscript && N.tagName.toLowerCase() === "script" ? N.state = T.SCRIPT : N.state = T.TEXT, N.tag = null, N.tagName = ""), N.attribName = N.attribValue = "", N.attribList.length = 0;
      }
      function G(N) {
        if (!N.tagName) {
          Q(N, "Weird empty close tag."), N.textNode += "</>", N.state = T.TEXT;
          return;
        }
        if (N.script) {
          if (N.tagName !== "script") {
            N.script += "</" + N.tagName + ">", N.tagName = "", N.state = T.SCRIPT;
            return;
          }
          j(N, "onscript", N.script), N.script = "";
        }
        var A = N.tags.length, J = N.tagName;
        N.strict || (J = J[N.looseCase]());
        for (var B = J; A--; ) {
          var C = N.tags[A];
          if (C.name !== B)
            Q(N, "Unexpected close tag");
          else
            break;
        }
        if (A < 0) {
          Q(N, "Unmatched closing tag: " + N.tagName), N.textNode += "</" + N.tagName + ">", N.state = T.TEXT;
          return;
        }
        N.tagName = J;
        for (var k = N.tags.length; k-- > A; ) {
          var H = N.tag = N.tags.pop();
          N.tagName = N.tag.name, j(N, "onclosetag", N.tagName);
          var Y = {};
          for (var Z in H.ns)
            Y[Z] = H.ns[Z];
          var le = N.tags[N.tags.length - 1] || N;
          N.opt.xmlns && H.ns !== le.ns && Object.keys(H.ns).forEach(function(ve) {
            var Te = H.ns[ve];
            j(N, "onclosenamespace", { prefix: ve, uri: Te });
          });
        }
        A === 0 && (N.closedRoot = !0), N.tagName = N.attribValue = N.attribName = "", N.attribList.length = 0, N.state = T.TEXT;
      }
      function D(N) {
        var A = N.entity, J = A.toLowerCase(), B, C = "";
        return N.ENTITIES[A] ? N.ENTITIES[A] : N.ENTITIES[J] ? N.ENTITIES[J] : (A = J, A.charAt(0) === "#" && (A.charAt(1) === "x" ? (A = A.slice(2), B = parseInt(A, 16), C = B.toString(16)) : (A = A.slice(1), B = parseInt(A, 10), C = B.toString(10))), A = A.replace(/^0+/, ""), isNaN(B) || C.toLowerCase() !== A ? (Q(N, "Invalid character entity"), "&" + N.entity + ";") : String.fromCodePoint(B));
      }
      function P(N, A) {
        A === "<" ? (N.state = T.OPEN_WAKA, N.startTagPosition = N.position) : b(A) || (Q(N, "Non-whitespace before first tag."), N.textNode = A, N.state = T.TEXT);
      }
      function O(N, A) {
        var J = "";
        return A < N.length && (J = N.charAt(A)), J;
      }
      function L(N) {
        var A = this;
        if (this.error)
          throw this.error;
        if (A.closed)
          return z(
            A,
            "Cannot write after close. Assign an onready handler."
          );
        if (N === null)
          return W(A);
        typeof N == "object" && (N = N.toString());
        for (var J = 0, B = ""; B = O(N, J++), A.c = B, !!B; )
          switch (A.trackPosition && (A.position++, B === `
` ? (A.line++, A.column = 0) : A.column++), A.state) {
            case T.BEGIN:
              if (A.state = T.BEGIN_WHITESPACE, B === "\uFEFF")
                continue;
              P(A, B);
              continue;
            case T.BEGIN_WHITESPACE:
              P(A, B);
              continue;
            case T.TEXT:
              if (A.sawRoot && !A.closedRoot) {
                for (var C = J - 1; B && B !== "<" && B !== "&"; )
                  B = O(N, J++), B && A.trackPosition && (A.position++, B === `
` ? (A.line++, A.column = 0) : A.column++);
                A.textNode += N.substring(C, J - 1);
              }
              B === "<" && !(A.sawRoot && A.closedRoot && !A.strict) ? (A.state = T.OPEN_WAKA, A.startTagPosition = A.position) : (!b(B) && (!A.sawRoot || A.closedRoot) && Q(A, "Text data outside of root node."), B === "&" ? A.state = T.TEXT_ENTITY : A.textNode += B);
              continue;
            case T.SCRIPT:
              B === "<" ? A.state = T.SCRIPT_ENDING : A.script += B;
              continue;
            case T.SCRIPT_ENDING:
              B === "/" ? A.state = T.CLOSE_TAG : (A.script += "<" + B, A.state = T.SCRIPT);
              continue;
            case T.OPEN_WAKA:
              if (B === "!")
                A.state = T.SGML_DECL, A.sgmlDecl = "";
              else if (!b(B)) if (w(f, B))
                A.state = T.OPEN_TAG, A.tagName = B;
              else if (B === "/")
                A.state = T.CLOSE_TAG, A.tagName = "";
              else if (B === "?")
                A.state = T.PROC_INST, A.procInstName = A.procInstBody = "";
              else {
                if (Q(A, "Unencoded <"), A.startTagPosition + 1 < A.position) {
                  var k = A.position - A.startTagPosition;
                  B = new Array(k).join(" ") + B;
                }
                A.textNode += "<" + B, A.state = T.TEXT;
              }
              continue;
            case T.SGML_DECL:
              if (A.sgmlDecl + B === "--") {
                A.state = T.COMMENT, A.comment = "", A.sgmlDecl = "";
                continue;
              }
              A.doctype && A.doctype !== !0 && A.sgmlDecl ? (A.state = T.DOCTYPE_DTD, A.doctype += "<!" + A.sgmlDecl + B, A.sgmlDecl = "") : (A.sgmlDecl + B).toUpperCase() === p ? (j(A, "onopencdata"), A.state = T.CDATA, A.sgmlDecl = "", A.cdata = "") : (A.sgmlDecl + B).toUpperCase() === h ? (A.state = T.DOCTYPE, (A.doctype || A.sawRoot) && Q(
                A,
                "Inappropriately located doctype declaration"
              ), A.doctype = "", A.sgmlDecl = "") : B === ">" ? (j(A, "onsgmldeclaration", A.sgmlDecl), A.sgmlDecl = "", A.state = T.TEXT) : (S(B) && (A.state = T.SGML_DECL_QUOTED), A.sgmlDecl += B);
              continue;
            case T.SGML_DECL_QUOTED:
              B === A.q && (A.state = T.SGML_DECL, A.q = ""), A.sgmlDecl += B;
              continue;
            case T.DOCTYPE:
              B === ">" ? (A.state = T.TEXT, j(A, "ondoctype", A.doctype), A.doctype = !0) : (A.doctype += B, B === "[" ? A.state = T.DOCTYPE_DTD : S(B) && (A.state = T.DOCTYPE_QUOTED, A.q = B));
              continue;
            case T.DOCTYPE_QUOTED:
              A.doctype += B, B === A.q && (A.q = "", A.state = T.DOCTYPE);
              continue;
            case T.DOCTYPE_DTD:
              B === "]" ? (A.doctype += B, A.state = T.DOCTYPE) : B === "<" ? (A.state = T.OPEN_WAKA, A.startTagPosition = A.position) : S(B) ? (A.doctype += B, A.state = T.DOCTYPE_DTD_QUOTED, A.q = B) : A.doctype += B;
              continue;
            case T.DOCTYPE_DTD_QUOTED:
              A.doctype += B, B === A.q && (A.state = T.DOCTYPE_DTD, A.q = "");
              continue;
            case T.COMMENT:
              B === "-" ? A.state = T.COMMENT_ENDING : A.comment += B;
              continue;
            case T.COMMENT_ENDING:
              B === "-" ? (A.state = T.COMMENT_ENDED, A.comment = U(A.opt, A.comment), A.comment && j(A, "oncomment", A.comment), A.comment = "") : (A.comment += "-" + B, A.state = T.COMMENT);
              continue;
            case T.COMMENT_ENDED:
              B !== ">" ? (Q(A, "Malformed comment"), A.comment += "--" + B, A.state = T.COMMENT) : A.doctype && A.doctype !== !0 ? A.state = T.DOCTYPE_DTD : A.state = T.TEXT;
              continue;
            case T.CDATA:
              B === "]" ? A.state = T.CDATA_ENDING : A.cdata += B;
              continue;
            case T.CDATA_ENDING:
              B === "]" ? A.state = T.CDATA_ENDING_2 : (A.cdata += "]" + B, A.state = T.CDATA);
              continue;
            case T.CDATA_ENDING_2:
              B === ">" ? (A.cdata && j(A, "oncdata", A.cdata), j(A, "onclosecdata"), A.cdata = "", A.state = T.TEXT) : B === "]" ? A.cdata += "]" : (A.cdata += "]]" + B, A.state = T.CDATA);
              continue;
            case T.PROC_INST:
              B === "?" ? A.state = T.PROC_INST_ENDING : b(B) ? A.state = T.PROC_INST_BODY : A.procInstName += B;
              continue;
            case T.PROC_INST_BODY:
              if (!A.procInstBody && b(B))
                continue;
              B === "?" ? A.state = T.PROC_INST_ENDING : A.procInstBody += B;
              continue;
            case T.PROC_INST_ENDING:
              B === ">" ? (j(A, "onprocessinginstruction", {
                name: A.procInstName,
                body: A.procInstBody
              }), A.procInstName = A.procInstBody = "", A.state = T.TEXT) : (A.procInstBody += "?" + B, A.state = T.PROC_INST_BODY);
              continue;
            case T.OPEN_TAG:
              w(m, B) ? A.tagName += B : (ee(A), B === ">" ? I(A) : B === "/" ? A.state = T.OPEN_TAG_SLASH : (b(B) || Q(A, "Invalid character in tag name"), A.state = T.ATTRIB));
              continue;
            case T.OPEN_TAG_SLASH:
              B === ">" ? (I(A, !0), G(A)) : (Q(A, "Forward-slash in opening tag not followed by >"), A.state = T.ATTRIB);
              continue;
            case T.ATTRIB:
              if (b(B))
                continue;
              B === ">" ? I(A) : B === "/" ? A.state = T.OPEN_TAG_SLASH : w(f, B) ? (A.attribName = B, A.attribValue = "", A.state = T.ATTRIB_NAME) : Q(A, "Invalid attribute name");
              continue;
            case T.ATTRIB_NAME:
              B === "=" ? A.state = T.ATTRIB_VALUE : B === ">" ? (Q(A, "Attribute without value"), A.attribValue = A.attribName, K(A), I(A)) : b(B) ? A.state = T.ATTRIB_NAME_SAW_WHITE : w(m, B) ? A.attribName += B : Q(A, "Invalid attribute name");
              continue;
            case T.ATTRIB_NAME_SAW_WHITE:
              if (B === "=")
                A.state = T.ATTRIB_VALUE;
              else {
                if (b(B))
                  continue;
                Q(A, "Attribute without value"), A.tag.attributes[A.attribName] = "", A.attribValue = "", j(A, "onattribute", {
                  name: A.attribName,
                  value: ""
                }), A.attribName = "", B === ">" ? I(A) : w(f, B) ? (A.attribName = B, A.state = T.ATTRIB_NAME) : (Q(A, "Invalid attribute name"), A.state = T.ATTRIB);
              }
              continue;
            case T.ATTRIB_VALUE:
              if (b(B))
                continue;
              S(B) ? (A.q = B, A.state = T.ATTRIB_VALUE_QUOTED) : (A.opt.unquotedAttributeValues || z(A, "Unquoted attribute value"), A.state = T.ATTRIB_VALUE_UNQUOTED, A.attribValue = B);
              continue;
            case T.ATTRIB_VALUE_QUOTED:
              if (B !== A.q) {
                B === "&" ? A.state = T.ATTRIB_VALUE_ENTITY_Q : A.attribValue += B;
                continue;
              }
              K(A), A.q = "", A.state = T.ATTRIB_VALUE_CLOSED;
              continue;
            case T.ATTRIB_VALUE_CLOSED:
              b(B) ? A.state = T.ATTRIB : B === ">" ? I(A) : B === "/" ? A.state = T.OPEN_TAG_SLASH : w(f, B) ? (Q(A, "No whitespace between attributes"), A.attribName = B, A.attribValue = "", A.state = T.ATTRIB_NAME) : Q(A, "Invalid attribute name");
              continue;
            case T.ATTRIB_VALUE_UNQUOTED:
              if (!_(B)) {
                B === "&" ? A.state = T.ATTRIB_VALUE_ENTITY_U : A.attribValue += B;
                continue;
              }
              K(A), B === ">" ? I(A) : A.state = T.ATTRIB;
              continue;
            case T.CLOSE_TAG:
              if (A.tagName)
                B === ">" ? G(A) : w(m, B) ? A.tagName += B : A.script ? (A.script += "</" + A.tagName, A.tagName = "", A.state = T.SCRIPT) : (b(B) || Q(A, "Invalid tagname in closing tag"), A.state = T.CLOSE_TAG_SAW_WHITE);
              else {
                if (b(B))
                  continue;
                R(f, B) ? A.script ? (A.script += "</" + B, A.state = T.SCRIPT) : Q(A, "Invalid tagname in closing tag.") : A.tagName = B;
              }
              continue;
            case T.CLOSE_TAG_SAW_WHITE:
              if (b(B))
                continue;
              B === ">" ? G(A) : Q(A, "Invalid characters in closing tag");
              continue;
            case T.TEXT_ENTITY:
            case T.ATTRIB_VALUE_ENTITY_Q:
            case T.ATTRIB_VALUE_ENTITY_U:
              var H, Y;
              switch (A.state) {
                case T.TEXT_ENTITY:
                  H = T.TEXT, Y = "textNode";
                  break;
                case T.ATTRIB_VALUE_ENTITY_Q:
                  H = T.ATTRIB_VALUE_QUOTED, Y = "attribValue";
                  break;
                case T.ATTRIB_VALUE_ENTITY_U:
                  H = T.ATTRIB_VALUE_UNQUOTED, Y = "attribValue";
                  break;
              }
              if (B === ";") {
                var Z = D(A);
                A.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Z) ? (A.entity = "", A.state = H, A.write(Z)) : (A[Y] += Z, A.entity = "", A.state = H);
              } else w(A.entity.length ? g : l, B) ? A.entity += B : (Q(A, "Invalid character in entity name"), A[Y] += "&" + A.entity + B, A.entity = "", A.state = H);
              continue;
            default:
              throw new Error(A, "Unknown state: " + A.state);
          }
        return A.position >= A.bufferCheckPosition && d(A), A;
      }
      /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
      String.fromCodePoint || function() {
        var N = String.fromCharCode, A = Math.floor, J = function() {
          var B = 16384, C = [], k, H, Y = -1, Z = arguments.length;
          if (!Z)
            return "";
          for (var le = ""; ++Y < Z; ) {
            var ve = Number(arguments[Y]);
            if (!isFinite(ve) || // `NaN`, `+Infinity`, or `-Infinity`
            ve < 0 || // not a valid Unicode code point
            ve > 1114111 || // not a valid Unicode code point
            A(ve) !== ve)
              throw RangeError("Invalid code point: " + ve);
            ve <= 65535 ? C.push(ve) : (ve -= 65536, k = (ve >> 10) + 55296, H = ve % 1024 + 56320, C.push(k, H)), (Y + 1 === Z || C.length > B) && (le += N.apply(null, C), C.length = 0);
          }
          return le;
        };
        Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
          value: J,
          configurable: !0,
          writable: !0
        }) : String.fromCodePoint = J;
      }();
    })(e);
  }(au)), au;
}
var sp;
function Zw() {
  if (sp) return Ur;
  sp = 1, Object.defineProperty(Ur, "__esModule", { value: !0 }), Ur.XElement = void 0, Ur.parseXml = n;
  const e = Qw(), t = io();
  class u {
    constructor(i) {
      if (this.name = i, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !i)
        throw (0, t.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
      if (!d(i))
        throw (0, t.newError)(`Invalid element name: ${i}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
    attribute(i) {
      const c = this.attributes === null ? null : this.attributes[i];
      if (c == null)
        throw (0, t.newError)(`No attribute "${i}"`, "ERR_XML_MISSED_ATTRIBUTE");
      return c;
    }
    removeAttribute(i) {
      this.attributes !== null && delete this.attributes[i];
    }
    element(i, c = !1, o = null) {
      const p = this.elementOrNull(i, c);
      if (p === null)
        throw (0, t.newError)(o || `No element "${i}"`, "ERR_XML_MISSED_ELEMENT");
      return p;
    }
    elementOrNull(i, c = !1) {
      if (this.elements === null)
        return null;
      for (const o of this.elements)
        if (r(o, i, c))
          return o;
      return null;
    }
    getElements(i, c = !1) {
      return this.elements === null ? [] : this.elements.filter((o) => r(o, i, c));
    }
    elementValueOrEmpty(i, c = !1) {
      const o = this.elementOrNull(i, c);
      return o === null ? "" : o.value;
    }
  }
  Ur.XElement = u;
  const a = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
  function d(s) {
    return a.test(s);
  }
  function r(s, i, c) {
    const o = s.name;
    return o === i || c === !0 && o.length === i.length && o.toLowerCase() === i.toLowerCase();
  }
  function n(s) {
    let i = null;
    const c = e.parser(!0, {}), o = [];
    return c.onopentag = (p) => {
      const h = new u(p.name);
      if (h.attributes = p.attributes, i === null)
        i = h;
      else {
        const y = o[o.length - 1];
        y.elements == null && (y.elements = []), y.elements.push(h);
      }
      o.push(h);
    }, c.onclosetag = () => {
      o.pop();
    }, c.ontext = (p) => {
      o.length > 0 && (o[o.length - 1].value = p);
    }, c.oncdata = (p) => {
      const h = o[o.length - 1];
      h.value = p, h.isCData = !0;
    }, c.onerror = (p) => {
      throw p;
    }, c.write(s), i;
  }
  return Ur;
}
var up;
function tt() {
  return up || (up = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = p;
    var t = rc();
    Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
      return t.CancellationError;
    } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
      return t.CancellationToken;
    } });
    var u = io();
    Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
      return u.newError;
    } });
    var a = zw();
    Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
      return a.configureRequestOptions;
    } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
      return a.configureRequestOptionsFromUrl;
    } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
      return a.configureRequestUrl;
    } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
      return a.createHttpError;
    } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
      return a.DigestTransform;
    } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
      return a.HttpError;
    } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
      return a.HttpExecutor;
    } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
      return a.parseJson;
    } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
      return a.safeGetHeader;
    } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
      return a.safeStringifyJson;
    } });
    var d = Kw();
    Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
      return d.MemoLazy;
    } });
    var r = Wm();
    Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
      return r.ProgressCallbackTransform;
    } });
    var n = Ww();
    Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
      return n.getS3LikeProviderBaseUrl;
    } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
      return n.githubUrl;
    } });
    var s = Yw();
    Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
      return s.retry;
    } });
    var i = Jw();
    Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
      return i.parseDn;
    } });
    var c = Xw();
    Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
      return c.UUID;
    } });
    var o = Zw();
    Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
      return o.parseXml;
    } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
      return o.XElement;
    } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
    function p(h) {
      return h == null ? [] : Array.isArray(h) ? h : [h];
    }
  }(eu)), eu;
}
var at = {}, Aa = {}, rr = {}, cp;
function Nn() {
  if (cp) return rr;
  cp = 1;
  function e(n) {
    return typeof n > "u" || n === null;
  }
  function t(n) {
    return typeof n == "object" && n !== null;
  }
  function u(n) {
    return Array.isArray(n) ? n : e(n) ? [] : [n];
  }
  function a(n, s) {
    var i, c, o, p;
    if (s)
      for (p = Object.keys(s), i = 0, c = p.length; i < c; i += 1)
        o = p[i], n[o] = s[o];
    return n;
  }
  function d(n, s) {
    var i = "", c;
    for (c = 0; c < s; c += 1)
      i += n;
    return i;
  }
  function r(n) {
    return n === 0 && Number.NEGATIVE_INFINITY === 1 / n;
  }
  return rr.isNothing = e, rr.isObject = t, rr.toArray = u, rr.repeat = d, rr.isNegativeZero = r, rr.extend = a, rr;
}
var ou, lp;
function Cn() {
  if (lp) return ou;
  lp = 1;
  function e(u, a) {
    var d = "", r = u.reason || "(unknown reason)";
    return u.mark ? (u.mark.name && (d += 'in "' + u.mark.name + '" '), d += "(" + (u.mark.line + 1) + ":" + (u.mark.column + 1) + ")", !a && u.mark.snippet && (d += `

` + u.mark.snippet), r + " " + d) : r;
  }
  function t(u, a) {
    Error.call(this), this.name = "YAMLException", this.reason = u, this.mark = a, this.message = e(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t.prototype.toString = function(a) {
    return this.name + ": " + e(this, a);
  }, ou = t, ou;
}
var su, fp;
function eE() {
  if (fp) return su;
  fp = 1;
  var e = Nn();
  function t(d, r, n, s, i) {
    var c = "", o = "", p = Math.floor(i / 2) - 1;
    return s - r > p && (c = " ... ", r = s - p + c.length), n - s > p && (o = " ...", n = s + p - o.length), {
      str: c + d.slice(r, n).replace(/\t/g, "→") + o,
      pos: s - r + c.length
      // relative position
    };
  }
  function u(d, r) {
    return e.repeat(" ", r - d.length) + d;
  }
  function a(d, r) {
    if (r = Object.create(r || null), !d.buffer) return null;
    r.maxLength || (r.maxLength = 79), typeof r.indent != "number" && (r.indent = 1), typeof r.linesBefore != "number" && (r.linesBefore = 3), typeof r.linesAfter != "number" && (r.linesAfter = 2);
    for (var n = /\r?\n|\r|\0/g, s = [0], i = [], c, o = -1; c = n.exec(d.buffer); )
      i.push(c.index), s.push(c.index + c[0].length), d.position <= c.index && o < 0 && (o = s.length - 2);
    o < 0 && (o = s.length - 1);
    var p = "", h, y, $ = Math.min(d.line + r.linesAfter, i.length).toString().length, v = r.maxLength - (r.indent + $ + 3);
    for (h = 1; h <= r.linesBefore && !(o - h < 0); h++)
      y = t(
        d.buffer,
        s[o - h],
        i[o - h],
        d.position - (s[o] - s[o - h]),
        v
      ), p = e.repeat(" ", r.indent) + u((d.line - h + 1).toString(), $) + " | " + y.str + `
` + p;
    for (y = t(d.buffer, s[o], i[o], d.position, v), p += e.repeat(" ", r.indent) + u((d.line + 1).toString(), $) + " | " + y.str + `
`, p += e.repeat("-", r.indent + $ + 3 + y.pos) + `^
`, h = 1; h <= r.linesAfter && !(o + h >= i.length); h++)
      y = t(
        d.buffer,
        s[o + h],
        i[o + h],
        d.position - (s[o] - s[o + h]),
        v
      ), p += e.repeat(" ", r.indent) + u((d.line + h + 1).toString(), $) + " | " + y.str + `
`;
    return p.replace(/\n$/, "");
  }
  return su = a, su;
}
var uu, dp;
function dt() {
  if (dp) return uu;
  dp = 1;
  var e = Cn(), t = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ], u = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function a(r) {
    var n = {};
    return r !== null && Object.keys(r).forEach(function(s) {
      r[s].forEach(function(i) {
        n[String(i)] = s;
      });
    }), n;
  }
  function d(r, n) {
    if (n = n || {}, Object.keys(n).forEach(function(s) {
      if (t.indexOf(s) === -1)
        throw new e('Unknown option "' + s + '" is met in definition of "' + r + '" YAML type.');
    }), this.options = n, this.tag = r, this.kind = n.kind || null, this.resolve = n.resolve || function() {
      return !0;
    }, this.construct = n.construct || function(s) {
      return s;
    }, this.instanceOf = n.instanceOf || null, this.predicate = n.predicate || null, this.represent = n.represent || null, this.representName = n.representName || null, this.defaultStyle = n.defaultStyle || null, this.multi = n.multi || !1, this.styleAliases = a(n.styleAliases || null), u.indexOf(this.kind) === -1)
      throw new e('Unknown kind "' + this.kind + '" is specified for "' + r + '" YAML type.');
  }
  return uu = d, uu;
}
var cu, hp;
function Ym() {
  if (hp) return cu;
  hp = 1;
  var e = Cn(), t = dt();
  function u(r, n) {
    var s = [];
    return r[n].forEach(function(i) {
      var c = s.length;
      s.forEach(function(o, p) {
        o.tag === i.tag && o.kind === i.kind && o.multi === i.multi && (c = p);
      }), s[c] = i;
    }), s;
  }
  function a() {
    var r = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, n, s;
    function i(c) {
      c.multi ? (r.multi[c.kind].push(c), r.multi.fallback.push(c)) : r[c.kind][c.tag] = r.fallback[c.tag] = c;
    }
    for (n = 0, s = arguments.length; n < s; n += 1)
      arguments[n].forEach(i);
    return r;
  }
  function d(r) {
    return this.extend(r);
  }
  return d.prototype.extend = function(n) {
    var s = [], i = [];
    if (n instanceof t)
      i.push(n);
    else if (Array.isArray(n))
      i = i.concat(n);
    else if (n && (Array.isArray(n.implicit) || Array.isArray(n.explicit)))
      n.implicit && (s = s.concat(n.implicit)), n.explicit && (i = i.concat(n.explicit));
    else
      throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    s.forEach(function(o) {
      if (!(o instanceof t))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (o.loadKind && o.loadKind !== "scalar")
        throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (o.multi)
        throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), i.forEach(function(o) {
      if (!(o instanceof t))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    var c = Object.create(d.prototype);
    return c.implicit = (this.implicit || []).concat(s), c.explicit = (this.explicit || []).concat(i), c.compiledImplicit = u(c, "implicit"), c.compiledExplicit = u(c, "explicit"), c.compiledTypeMap = a(c.compiledImplicit, c.compiledExplicit), c;
  }, cu = d, cu;
}
var lu, pp;
function Jm() {
  if (pp) return lu;
  pp = 1;
  var e = dt();
  return lu = new e("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(t) {
      return t !== null ? t : "";
    }
  }), lu;
}
var fu, mp;
function Xm() {
  if (mp) return fu;
  mp = 1;
  var e = dt();
  return fu = new e("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(t) {
      return t !== null ? t : [];
    }
  }), fu;
}
var du, yp;
function Qm() {
  if (yp) return du;
  yp = 1;
  var e = dt();
  return du = new e("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(t) {
      return t !== null ? t : {};
    }
  }), du;
}
var hu, gp;
function Zm() {
  if (gp) return hu;
  gp = 1;
  var e = Ym();
  return hu = new e({
    explicit: [
      Jm(),
      Xm(),
      Qm()
    ]
  }), hu;
}
var pu, vp;
function ey() {
  if (vp) return pu;
  vp = 1;
  var e = dt();
  function t(d) {
    if (d === null) return !0;
    var r = d.length;
    return r === 1 && d === "~" || r === 4 && (d === "null" || d === "Null" || d === "NULL");
  }
  function u() {
    return null;
  }
  function a(d) {
    return d === null;
  }
  return pu = new e("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: t,
    construct: u,
    predicate: a,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  }), pu;
}
var mu, _p;
function ty() {
  if (_p) return mu;
  _p = 1;
  var e = dt();
  function t(d) {
    if (d === null) return !1;
    var r = d.length;
    return r === 4 && (d === "true" || d === "True" || d === "TRUE") || r === 5 && (d === "false" || d === "False" || d === "FALSE");
  }
  function u(d) {
    return d === "true" || d === "True" || d === "TRUE";
  }
  function a(d) {
    return Object.prototype.toString.call(d) === "[object Boolean]";
  }
  return mu = new e("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: t,
    construct: u,
    predicate: a,
    represent: {
      lowercase: function(d) {
        return d ? "true" : "false";
      },
      uppercase: function(d) {
        return d ? "TRUE" : "FALSE";
      },
      camelcase: function(d) {
        return d ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), mu;
}
var yu, $p;
function ry() {
  if ($p) return yu;
  $p = 1;
  var e = Nn(), t = dt();
  function u(i) {
    return 48 <= i && i <= 57 || 65 <= i && i <= 70 || 97 <= i && i <= 102;
  }
  function a(i) {
    return 48 <= i && i <= 55;
  }
  function d(i) {
    return 48 <= i && i <= 57;
  }
  function r(i) {
    if (i === null) return !1;
    var c = i.length, o = 0, p = !1, h;
    if (!c) return !1;
    if (h = i[o], (h === "-" || h === "+") && (h = i[++o]), h === "0") {
      if (o + 1 === c) return !0;
      if (h = i[++o], h === "b") {
        for (o++; o < c; o++)
          if (h = i[o], h !== "_") {
            if (h !== "0" && h !== "1") return !1;
            p = !0;
          }
        return p && h !== "_";
      }
      if (h === "x") {
        for (o++; o < c; o++)
          if (h = i[o], h !== "_") {
            if (!u(i.charCodeAt(o))) return !1;
            p = !0;
          }
        return p && h !== "_";
      }
      if (h === "o") {
        for (o++; o < c; o++)
          if (h = i[o], h !== "_") {
            if (!a(i.charCodeAt(o))) return !1;
            p = !0;
          }
        return p && h !== "_";
      }
    }
    if (h === "_") return !1;
    for (; o < c; o++)
      if (h = i[o], h !== "_") {
        if (!d(i.charCodeAt(o)))
          return !1;
        p = !0;
      }
    return !(!p || h === "_");
  }
  function n(i) {
    var c = i, o = 1, p;
    if (c.indexOf("_") !== -1 && (c = c.replace(/_/g, "")), p = c[0], (p === "-" || p === "+") && (p === "-" && (o = -1), c = c.slice(1), p = c[0]), c === "0") return 0;
    if (p === "0") {
      if (c[1] === "b") return o * parseInt(c.slice(2), 2);
      if (c[1] === "x") return o * parseInt(c.slice(2), 16);
      if (c[1] === "o") return o * parseInt(c.slice(2), 8);
    }
    return o * parseInt(c, 10);
  }
  function s(i) {
    return Object.prototype.toString.call(i) === "[object Number]" && i % 1 === 0 && !e.isNegativeZero(i);
  }
  return yu = new t("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: r,
    construct: n,
    predicate: s,
    represent: {
      binary: function(i) {
        return i >= 0 ? "0b" + i.toString(2) : "-0b" + i.toString(2).slice(1);
      },
      octal: function(i) {
        return i >= 0 ? "0o" + i.toString(8) : "-0o" + i.toString(8).slice(1);
      },
      decimal: function(i) {
        return i.toString(10);
      },
      /* eslint-disable max-len */
      hexadecimal: function(i) {
        return i >= 0 ? "0x" + i.toString(16).toUpperCase() : "-0x" + i.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), yu;
}
var gu, wp;
function ny() {
  if (wp) return gu;
  wp = 1;
  var e = Nn(), t = dt(), u = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function a(i) {
    return !(i === null || !u.test(i) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    i[i.length - 1] === "_");
  }
  function d(i) {
    var c, o;
    return c = i.replace(/_/g, "").toLowerCase(), o = c[0] === "-" ? -1 : 1, "+-".indexOf(c[0]) >= 0 && (c = c.slice(1)), c === ".inf" ? o === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : c === ".nan" ? NaN : o * parseFloat(c, 10);
  }
  var r = /^[-+]?[0-9]+e/;
  function n(i, c) {
    var o;
    if (isNaN(i))
      switch (c) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === i)
      switch (c) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === i)
      switch (c) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (e.isNegativeZero(i))
      return "-0.0";
    return o = i.toString(10), r.test(o) ? o.replace("e", ".e") : o;
  }
  function s(i) {
    return Object.prototype.toString.call(i) === "[object Number]" && (i % 1 !== 0 || e.isNegativeZero(i));
  }
  return gu = new t("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: a,
    construct: d,
    predicate: s,
    represent: n,
    defaultStyle: "lowercase"
  }), gu;
}
var vu, Ep;
function iy() {
  return Ep || (Ep = 1, vu = Zm().extend({
    implicit: [
      ey(),
      ty(),
      ry(),
      ny()
    ]
  })), vu;
}
var _u, bp;
function ay() {
  return bp || (bp = 1, _u = iy()), _u;
}
var $u, Sp;
function oy() {
  if (Sp) return $u;
  Sp = 1;
  var e = dt(), t = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), u = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function a(n) {
    return n === null ? !1 : t.exec(n) !== null || u.exec(n) !== null;
  }
  function d(n) {
    var s, i, c, o, p, h, y, $ = 0, v = null, f, m, l;
    if (s = t.exec(n), s === null && (s = u.exec(n)), s === null) throw new Error("Date resolve error");
    if (i = +s[1], c = +s[2] - 1, o = +s[3], !s[4])
      return new Date(Date.UTC(i, c, o));
    if (p = +s[4], h = +s[5], y = +s[6], s[7]) {
      for ($ = s[7].slice(0, 3); $.length < 3; )
        $ += "0";
      $ = +$;
    }
    return s[9] && (f = +s[10], m = +(s[11] || 0), v = (f * 60 + m) * 6e4, s[9] === "-" && (v = -v)), l = new Date(Date.UTC(i, c, o, p, h, y, $)), v && l.setTime(l.getTime() - v), l;
  }
  function r(n) {
    return n.toISOString();
  }
  return $u = new e("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: a,
    construct: d,
    instanceOf: Date,
    represent: r
  }), $u;
}
var wu, Pp;
function sy() {
  if (Pp) return wu;
  Pp = 1;
  var e = dt();
  function t(u) {
    return u === "<<" || u === null;
  }
  return wu = new e("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: t
  }), wu;
}
var Eu, Rp;
function uy() {
  if (Rp) return Eu;
  Rp = 1;
  var e = dt(), t = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function u(n) {
    if (n === null) return !1;
    var s, i, c = 0, o = n.length, p = t;
    for (i = 0; i < o; i++)
      if (s = p.indexOf(n.charAt(i)), !(s > 64)) {
        if (s < 0) return !1;
        c += 6;
      }
    return c % 8 === 0;
  }
  function a(n) {
    var s, i, c = n.replace(/[\r\n=]/g, ""), o = c.length, p = t, h = 0, y = [];
    for (s = 0; s < o; s++)
      s % 4 === 0 && s && (y.push(h >> 16 & 255), y.push(h >> 8 & 255), y.push(h & 255)), h = h << 6 | p.indexOf(c.charAt(s));
    return i = o % 4 * 6, i === 0 ? (y.push(h >> 16 & 255), y.push(h >> 8 & 255), y.push(h & 255)) : i === 18 ? (y.push(h >> 10 & 255), y.push(h >> 2 & 255)) : i === 12 && y.push(h >> 4 & 255), new Uint8Array(y);
  }
  function d(n) {
    var s = "", i = 0, c, o, p = n.length, h = t;
    for (c = 0; c < p; c++)
      c % 3 === 0 && c && (s += h[i >> 18 & 63], s += h[i >> 12 & 63], s += h[i >> 6 & 63], s += h[i & 63]), i = (i << 8) + n[c];
    return o = p % 3, o === 0 ? (s += h[i >> 18 & 63], s += h[i >> 12 & 63], s += h[i >> 6 & 63], s += h[i & 63]) : o === 2 ? (s += h[i >> 10 & 63], s += h[i >> 4 & 63], s += h[i << 2 & 63], s += h[64]) : o === 1 && (s += h[i >> 2 & 63], s += h[i << 4 & 63], s += h[64], s += h[64]), s;
  }
  function r(n) {
    return Object.prototype.toString.call(n) === "[object Uint8Array]";
  }
  return Eu = new e("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: u,
    construct: a,
    predicate: r,
    represent: d
  }), Eu;
}
var bu, Tp;
function cy() {
  if (Tp) return bu;
  Tp = 1;
  var e = dt(), t = Object.prototype.hasOwnProperty, u = Object.prototype.toString;
  function a(r) {
    if (r === null) return !0;
    var n = [], s, i, c, o, p, h = r;
    for (s = 0, i = h.length; s < i; s += 1) {
      if (c = h[s], p = !1, u.call(c) !== "[object Object]") return !1;
      for (o in c)
        if (t.call(c, o))
          if (!p) p = !0;
          else return !1;
      if (!p) return !1;
      if (n.indexOf(o) === -1) n.push(o);
      else return !1;
    }
    return !0;
  }
  function d(r) {
    return r !== null ? r : [];
  }
  return bu = new e("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: a,
    construct: d
  }), bu;
}
var Su, Op;
function ly() {
  if (Op) return Su;
  Op = 1;
  var e = dt(), t = Object.prototype.toString;
  function u(d) {
    if (d === null) return !0;
    var r, n, s, i, c, o = d;
    for (c = new Array(o.length), r = 0, n = o.length; r < n; r += 1) {
      if (s = o[r], t.call(s) !== "[object Object]" || (i = Object.keys(s), i.length !== 1)) return !1;
      c[r] = [i[0], s[i[0]]];
    }
    return !0;
  }
  function a(d) {
    if (d === null) return [];
    var r, n, s, i, c, o = d;
    for (c = new Array(o.length), r = 0, n = o.length; r < n; r += 1)
      s = o[r], i = Object.keys(s), c[r] = [i[0], s[i[0]]];
    return c;
  }
  return Su = new e("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: u,
    construct: a
  }), Su;
}
var Pu, Ap;
function fy() {
  if (Ap) return Pu;
  Ap = 1;
  var e = dt(), t = Object.prototype.hasOwnProperty;
  function u(d) {
    if (d === null) return !0;
    var r, n = d;
    for (r in n)
      if (t.call(n, r) && n[r] !== null)
        return !1;
    return !0;
  }
  function a(d) {
    return d !== null ? d : {};
  }
  return Pu = new e("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: u,
    construct: a
  }), Pu;
}
var Ru, Np;
function nc() {
  return Np || (Np = 1, Ru = ay().extend({
    implicit: [
      oy(),
      sy()
    ],
    explicit: [
      uy(),
      cy(),
      ly(),
      fy()
    ]
  })), Ru;
}
var Cp;
function tE() {
  if (Cp) return Aa;
  Cp = 1;
  var e = Nn(), t = Cn(), u = eE(), a = nc(), d = Object.prototype.hasOwnProperty, r = 1, n = 2, s = 3, i = 4, c = 1, o = 2, p = 3, h = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, y = /[\x85\u2028\u2029]/, $ = /[,\[\]\{\}]/, v = /^(?:!|!!|![a-z\-]+!)$/i, f = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function m(E) {
    return Object.prototype.toString.call(E);
  }
  function l(E) {
    return E === 10 || E === 13;
  }
  function g(E) {
    return E === 9 || E === 32;
  }
  function b(E) {
    return E === 9 || E === 32 || E === 10 || E === 13;
  }
  function S(E) {
    return E === 44 || E === 91 || E === 93 || E === 123 || E === 125;
  }
  function _(E) {
    var te;
    return 48 <= E && E <= 57 ? E - 48 : (te = E | 32, 97 <= te && te <= 102 ? te - 97 + 10 : -1);
  }
  function w(E) {
    return E === 120 ? 2 : E === 117 ? 4 : E === 85 ? 8 : 0;
  }
  function R(E) {
    return 48 <= E && E <= 57 ? E - 48 : -1;
  }
  function T(E) {
    return E === 48 ? "\0" : E === 97 ? "\x07" : E === 98 ? "\b" : E === 116 || E === 9 ? "	" : E === 110 ? `
` : E === 118 ? "\v" : E === 102 ? "\f" : E === 114 ? "\r" : E === 101 ? "\x1B" : E === 32 ? " " : E === 34 ? '"' : E === 47 ? "/" : E === 92 ? "\\" : E === 78 ? "" : E === 95 ? " " : E === 76 ? "\u2028" : E === 80 ? "\u2029" : "";
  }
  function M(E) {
    return E <= 65535 ? String.fromCharCode(E) : String.fromCharCode(
      (E - 65536 >> 10) + 55296,
      (E - 65536 & 1023) + 56320
    );
  }
  for (var F = new Array(256), j = new Array(256), V = 0; V < 256; V++)
    F[V] = T(V) ? 1 : 0, j[V] = T(V);
  function U(E, te) {
    this.input = E, this.filename = te.filename || null, this.schema = te.schema || a, this.onWarning = te.onWarning || null, this.legacy = te.legacy || !1, this.json = te.json || !1, this.listener = te.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = E.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
  }
  function z(E, te) {
    var re = {
      name: E.filename,
      buffer: E.input.slice(0, -1),
      // omit trailing \0
      position: E.position,
      line: E.line,
      column: E.position - E.lineStart
    };
    return re.snippet = u(re), new t(te, re);
  }
  function W(E, te) {
    throw z(E, te);
  }
  function Q(E, te) {
    E.onWarning && E.onWarning.call(null, z(E, te));
  }
  var ee = {
    YAML: function(te, re, pe) {
      var ae, de, ce;
      te.version !== null && W(te, "duplication of %YAML directive"), pe.length !== 1 && W(te, "YAML directive accepts exactly one argument"), ae = /^([0-9]+)\.([0-9]+)$/.exec(pe[0]), ae === null && W(te, "ill-formed argument of the YAML directive"), de = parseInt(ae[1], 10), ce = parseInt(ae[2], 10), de !== 1 && W(te, "unacceptable YAML version of the document"), te.version = pe[0], te.checkLineBreaks = ce < 2, ce !== 1 && ce !== 2 && Q(te, "unsupported YAML version of the document");
    },
    TAG: function(te, re, pe) {
      var ae, de;
      pe.length !== 2 && W(te, "TAG directive accepts exactly two arguments"), ae = pe[0], de = pe[1], v.test(ae) || W(te, "ill-formed tag handle (first argument) of the TAG directive"), d.call(te.tagMap, ae) && W(te, 'there is a previously declared suffix for "' + ae + '" tag handle'), f.test(de) || W(te, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        de = decodeURIComponent(de);
      } catch {
        W(te, "tag prefix is malformed: " + de);
      }
      te.tagMap[ae] = de;
    }
  };
  function ne(E, te, re, pe) {
    var ae, de, ce, me;
    if (te < re) {
      if (me = E.input.slice(te, re), pe)
        for (ae = 0, de = me.length; ae < de; ae += 1)
          ce = me.charCodeAt(ae), ce === 9 || 32 <= ce && ce <= 1114111 || W(E, "expected valid JSON character");
      else h.test(me) && W(E, "the stream contains non-printable characters");
      E.result += me;
    }
  }
  function K(E, te, re, pe) {
    var ae, de, ce, me;
    for (e.isObject(re) || W(E, "cannot merge mappings; the provided source object is unacceptable"), ae = Object.keys(re), ce = 0, me = ae.length; ce < me; ce += 1)
      de = ae[ce], d.call(te, de) || (te[de] = re[de], pe[de] = !0);
  }
  function I(E, te, re, pe, ae, de, ce, me, we) {
    var be, je;
    if (Array.isArray(ae))
      for (ae = Array.prototype.slice.call(ae), be = 0, je = ae.length; be < je; be += 1)
        Array.isArray(ae[be]) && W(E, "nested arrays are not supported inside keys"), typeof ae == "object" && m(ae[be]) === "[object Object]" && (ae[be] = "[object Object]");
    if (typeof ae == "object" && m(ae) === "[object Object]" && (ae = "[object Object]"), ae = String(ae), te === null && (te = {}), pe === "tag:yaml.org,2002:merge")
      if (Array.isArray(de))
        for (be = 0, je = de.length; be < je; be += 1)
          K(E, te, de[be], re);
      else
        K(E, te, de, re);
    else
      !E.json && !d.call(re, ae) && d.call(te, ae) && (E.line = ce || E.line, E.lineStart = me || E.lineStart, E.position = we || E.position, W(E, "duplicated mapping key")), ae === "__proto__" ? Object.defineProperty(te, ae, {
        configurable: !0,
        enumerable: !0,
        writable: !0,
        value: de
      }) : te[ae] = de, delete re[ae];
    return te;
  }
  function G(E) {
    var te;
    te = E.input.charCodeAt(E.position), te === 10 ? E.position++ : te === 13 ? (E.position++, E.input.charCodeAt(E.position) === 10 && E.position++) : W(E, "a line break is expected"), E.line += 1, E.lineStart = E.position, E.firstTabInLine = -1;
  }
  function D(E, te, re) {
    for (var pe = 0, ae = E.input.charCodeAt(E.position); ae !== 0; ) {
      for (; g(ae); )
        ae === 9 && E.firstTabInLine === -1 && (E.firstTabInLine = E.position), ae = E.input.charCodeAt(++E.position);
      if (te && ae === 35)
        do
          ae = E.input.charCodeAt(++E.position);
        while (ae !== 10 && ae !== 13 && ae !== 0);
      if (l(ae))
        for (G(E), ae = E.input.charCodeAt(E.position), pe++, E.lineIndent = 0; ae === 32; )
          E.lineIndent++, ae = E.input.charCodeAt(++E.position);
      else
        break;
    }
    return re !== -1 && pe !== 0 && E.lineIndent < re && Q(E, "deficient indentation"), pe;
  }
  function P(E) {
    var te = E.position, re;
    return re = E.input.charCodeAt(te), !!((re === 45 || re === 46) && re === E.input.charCodeAt(te + 1) && re === E.input.charCodeAt(te + 2) && (te += 3, re = E.input.charCodeAt(te), re === 0 || b(re)));
  }
  function O(E, te) {
    te === 1 ? E.result += " " : te > 1 && (E.result += e.repeat(`
`, te - 1));
  }
  function L(E, te, re) {
    var pe, ae, de, ce, me, we, be, je, $e = E.kind, We = E.result, q;
    if (q = E.input.charCodeAt(E.position), b(q) || S(q) || q === 35 || q === 38 || q === 42 || q === 33 || q === 124 || q === 62 || q === 39 || q === 34 || q === 37 || q === 64 || q === 96 || (q === 63 || q === 45) && (ae = E.input.charCodeAt(E.position + 1), b(ae) || re && S(ae)))
      return !1;
    for (E.kind = "scalar", E.result = "", de = ce = E.position, me = !1; q !== 0; ) {
      if (q === 58) {
        if (ae = E.input.charCodeAt(E.position + 1), b(ae) || re && S(ae))
          break;
      } else if (q === 35) {
        if (pe = E.input.charCodeAt(E.position - 1), b(pe))
          break;
      } else {
        if (E.position === E.lineStart && P(E) || re && S(q))
          break;
        if (l(q))
          if (we = E.line, be = E.lineStart, je = E.lineIndent, D(E, !1, -1), E.lineIndent >= te) {
            me = !0, q = E.input.charCodeAt(E.position);
            continue;
          } else {
            E.position = ce, E.line = we, E.lineStart = be, E.lineIndent = je;
            break;
          }
      }
      me && (ne(E, de, ce, !1), O(E, E.line - we), de = ce = E.position, me = !1), g(q) || (ce = E.position + 1), q = E.input.charCodeAt(++E.position);
    }
    return ne(E, de, ce, !1), E.result ? !0 : (E.kind = $e, E.result = We, !1);
  }
  function N(E, te) {
    var re, pe, ae;
    if (re = E.input.charCodeAt(E.position), re !== 39)
      return !1;
    for (E.kind = "scalar", E.result = "", E.position++, pe = ae = E.position; (re = E.input.charCodeAt(E.position)) !== 0; )
      if (re === 39)
        if (ne(E, pe, E.position, !0), re = E.input.charCodeAt(++E.position), re === 39)
          pe = E.position, E.position++, ae = E.position;
        else
          return !0;
      else l(re) ? (ne(E, pe, ae, !0), O(E, D(E, !1, te)), pe = ae = E.position) : E.position === E.lineStart && P(E) ? W(E, "unexpected end of the document within a single quoted scalar") : (E.position++, ae = E.position);
    W(E, "unexpected end of the stream within a single quoted scalar");
  }
  function A(E, te) {
    var re, pe, ae, de, ce, me;
    if (me = E.input.charCodeAt(E.position), me !== 34)
      return !1;
    for (E.kind = "scalar", E.result = "", E.position++, re = pe = E.position; (me = E.input.charCodeAt(E.position)) !== 0; ) {
      if (me === 34)
        return ne(E, re, E.position, !0), E.position++, !0;
      if (me === 92) {
        if (ne(E, re, E.position, !0), me = E.input.charCodeAt(++E.position), l(me))
          D(E, !1, te);
        else if (me < 256 && F[me])
          E.result += j[me], E.position++;
        else if ((ce = w(me)) > 0) {
          for (ae = ce, de = 0; ae > 0; ae--)
            me = E.input.charCodeAt(++E.position), (ce = _(me)) >= 0 ? de = (de << 4) + ce : W(E, "expected hexadecimal character");
          E.result += M(de), E.position++;
        } else
          W(E, "unknown escape sequence");
        re = pe = E.position;
      } else l(me) ? (ne(E, re, pe, !0), O(E, D(E, !1, te)), re = pe = E.position) : E.position === E.lineStart && P(E) ? W(E, "unexpected end of the document within a double quoted scalar") : (E.position++, pe = E.position);
    }
    W(E, "unexpected end of the stream within a double quoted scalar");
  }
  function J(E, te) {
    var re = !0, pe, ae, de, ce = E.tag, me, we = E.anchor, be, je, $e, We, q, ie = /* @__PURE__ */ Object.create(null), ue, oe, fe, he;
    if (he = E.input.charCodeAt(E.position), he === 91)
      je = 93, q = !1, me = [];
    else if (he === 123)
      je = 125, q = !0, me = {};
    else
      return !1;
    for (E.anchor !== null && (E.anchorMap[E.anchor] = me), he = E.input.charCodeAt(++E.position); he !== 0; ) {
      if (D(E, !0, te), he = E.input.charCodeAt(E.position), he === je)
        return E.position++, E.tag = ce, E.anchor = we, E.kind = q ? "mapping" : "sequence", E.result = me, !0;
      re ? he === 44 && W(E, "expected the node content, but found ','") : W(E, "missed comma between flow collection entries"), oe = ue = fe = null, $e = We = !1, he === 63 && (be = E.input.charCodeAt(E.position + 1), b(be) && ($e = We = !0, E.position++, D(E, !0, te))), pe = E.line, ae = E.lineStart, de = E.position, le(E, te, r, !1, !0), oe = E.tag, ue = E.result, D(E, !0, te), he = E.input.charCodeAt(E.position), (We || E.line === pe) && he === 58 && ($e = !0, he = E.input.charCodeAt(++E.position), D(E, !0, te), le(E, te, r, !1, !0), fe = E.result), q ? I(E, me, ie, oe, ue, fe, pe, ae, de) : $e ? me.push(I(E, null, ie, oe, ue, fe, pe, ae, de)) : me.push(ue), D(E, !0, te), he = E.input.charCodeAt(E.position), he === 44 ? (re = !0, he = E.input.charCodeAt(++E.position)) : re = !1;
    }
    W(E, "unexpected end of the stream within a flow collection");
  }
  function B(E, te) {
    var re, pe, ae = c, de = !1, ce = !1, me = te, we = 0, be = !1, je, $e;
    if ($e = E.input.charCodeAt(E.position), $e === 124)
      pe = !1;
    else if ($e === 62)
      pe = !0;
    else
      return !1;
    for (E.kind = "scalar", E.result = ""; $e !== 0; )
      if ($e = E.input.charCodeAt(++E.position), $e === 43 || $e === 45)
        c === ae ? ae = $e === 43 ? p : o : W(E, "repeat of a chomping mode identifier");
      else if ((je = R($e)) >= 0)
        je === 0 ? W(E, "bad explicit indentation width of a block scalar; it cannot be less than one") : ce ? W(E, "repeat of an indentation width identifier") : (me = te + je - 1, ce = !0);
      else
        break;
    if (g($e)) {
      do
        $e = E.input.charCodeAt(++E.position);
      while (g($e));
      if ($e === 35)
        do
          $e = E.input.charCodeAt(++E.position);
        while (!l($e) && $e !== 0);
    }
    for (; $e !== 0; ) {
      for (G(E), E.lineIndent = 0, $e = E.input.charCodeAt(E.position); (!ce || E.lineIndent < me) && $e === 32; )
        E.lineIndent++, $e = E.input.charCodeAt(++E.position);
      if (!ce && E.lineIndent > me && (me = E.lineIndent), l($e)) {
        we++;
        continue;
      }
      if (E.lineIndent < me) {
        ae === p ? E.result += e.repeat(`
`, de ? 1 + we : we) : ae === c && de && (E.result += `
`);
        break;
      }
      for (pe ? g($e) ? (be = !0, E.result += e.repeat(`
`, de ? 1 + we : we)) : be ? (be = !1, E.result += e.repeat(`
`, we + 1)) : we === 0 ? de && (E.result += " ") : E.result += e.repeat(`
`, we) : E.result += e.repeat(`
`, de ? 1 + we : we), de = !0, ce = !0, we = 0, re = E.position; !l($e) && $e !== 0; )
        $e = E.input.charCodeAt(++E.position);
      ne(E, re, E.position, !1);
    }
    return !0;
  }
  function C(E, te) {
    var re, pe = E.tag, ae = E.anchor, de = [], ce, me = !1, we;
    if (E.firstTabInLine !== -1) return !1;
    for (E.anchor !== null && (E.anchorMap[E.anchor] = de), we = E.input.charCodeAt(E.position); we !== 0 && (E.firstTabInLine !== -1 && (E.position = E.firstTabInLine, W(E, "tab characters must not be used in indentation")), !(we !== 45 || (ce = E.input.charCodeAt(E.position + 1), !b(ce)))); ) {
      if (me = !0, E.position++, D(E, !0, -1) && E.lineIndent <= te) {
        de.push(null), we = E.input.charCodeAt(E.position);
        continue;
      }
      if (re = E.line, le(E, te, s, !1, !0), de.push(E.result), D(E, !0, -1), we = E.input.charCodeAt(E.position), (E.line === re || E.lineIndent > te) && we !== 0)
        W(E, "bad indentation of a sequence entry");
      else if (E.lineIndent < te)
        break;
    }
    return me ? (E.tag = pe, E.anchor = ae, E.kind = "sequence", E.result = de, !0) : !1;
  }
  function k(E, te, re) {
    var pe, ae, de, ce, me, we, be = E.tag, je = E.anchor, $e = {}, We = /* @__PURE__ */ Object.create(null), q = null, ie = null, ue = null, oe = !1, fe = !1, he;
    if (E.firstTabInLine !== -1) return !1;
    for (E.anchor !== null && (E.anchorMap[E.anchor] = $e), he = E.input.charCodeAt(E.position); he !== 0; ) {
      if (!oe && E.firstTabInLine !== -1 && (E.position = E.firstTabInLine, W(E, "tab characters must not be used in indentation")), pe = E.input.charCodeAt(E.position + 1), de = E.line, (he === 63 || he === 58) && b(pe))
        he === 63 ? (oe && (I(E, $e, We, q, ie, null, ce, me, we), q = ie = ue = null), fe = !0, oe = !0, ae = !0) : oe ? (oe = !1, ae = !0) : W(E, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), E.position += 1, he = pe;
      else {
        if (ce = E.line, me = E.lineStart, we = E.position, !le(E, re, n, !1, !0))
          break;
        if (E.line === de) {
          for (he = E.input.charCodeAt(E.position); g(he); )
            he = E.input.charCodeAt(++E.position);
          if (he === 58)
            he = E.input.charCodeAt(++E.position), b(he) || W(E, "a whitespace character is expected after the key-value separator within a block mapping"), oe && (I(E, $e, We, q, ie, null, ce, me, we), q = ie = ue = null), fe = !0, oe = !1, ae = !1, q = E.tag, ie = E.result;
          else if (fe)
            W(E, "can not read an implicit mapping pair; a colon is missed");
          else
            return E.tag = be, E.anchor = je, !0;
        } else if (fe)
          W(E, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return E.tag = be, E.anchor = je, !0;
      }
      if ((E.line === de || E.lineIndent > te) && (oe && (ce = E.line, me = E.lineStart, we = E.position), le(E, te, i, !0, ae) && (oe ? ie = E.result : ue = E.result), oe || (I(E, $e, We, q, ie, ue, ce, me, we), q = ie = ue = null), D(E, !0, -1), he = E.input.charCodeAt(E.position)), (E.line === de || E.lineIndent > te) && he !== 0)
        W(E, "bad indentation of a mapping entry");
      else if (E.lineIndent < te)
        break;
    }
    return oe && I(E, $e, We, q, ie, null, ce, me, we), fe && (E.tag = be, E.anchor = je, E.kind = "mapping", E.result = $e), fe;
  }
  function H(E) {
    var te, re = !1, pe = !1, ae, de, ce;
    if (ce = E.input.charCodeAt(E.position), ce !== 33) return !1;
    if (E.tag !== null && W(E, "duplication of a tag property"), ce = E.input.charCodeAt(++E.position), ce === 60 ? (re = !0, ce = E.input.charCodeAt(++E.position)) : ce === 33 ? (pe = !0, ae = "!!", ce = E.input.charCodeAt(++E.position)) : ae = "!", te = E.position, re) {
      do
        ce = E.input.charCodeAt(++E.position);
      while (ce !== 0 && ce !== 62);
      E.position < E.length ? (de = E.input.slice(te, E.position), ce = E.input.charCodeAt(++E.position)) : W(E, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; ce !== 0 && !b(ce); )
        ce === 33 && (pe ? W(E, "tag suffix cannot contain exclamation marks") : (ae = E.input.slice(te - 1, E.position + 1), v.test(ae) || W(E, "named tag handle cannot contain such characters"), pe = !0, te = E.position + 1)), ce = E.input.charCodeAt(++E.position);
      de = E.input.slice(te, E.position), $.test(de) && W(E, "tag suffix cannot contain flow indicator characters");
    }
    de && !f.test(de) && W(E, "tag name cannot contain such characters: " + de);
    try {
      de = decodeURIComponent(de);
    } catch {
      W(E, "tag name is malformed: " + de);
    }
    return re ? E.tag = de : d.call(E.tagMap, ae) ? E.tag = E.tagMap[ae] + de : ae === "!" ? E.tag = "!" + de : ae === "!!" ? E.tag = "tag:yaml.org,2002:" + de : W(E, 'undeclared tag handle "' + ae + '"'), !0;
  }
  function Y(E) {
    var te, re;
    if (re = E.input.charCodeAt(E.position), re !== 38) return !1;
    for (E.anchor !== null && W(E, "duplication of an anchor property"), re = E.input.charCodeAt(++E.position), te = E.position; re !== 0 && !b(re) && !S(re); )
      re = E.input.charCodeAt(++E.position);
    return E.position === te && W(E, "name of an anchor node must contain at least one character"), E.anchor = E.input.slice(te, E.position), !0;
  }
  function Z(E) {
    var te, re, pe;
    if (pe = E.input.charCodeAt(E.position), pe !== 42) return !1;
    for (pe = E.input.charCodeAt(++E.position), te = E.position; pe !== 0 && !b(pe) && !S(pe); )
      pe = E.input.charCodeAt(++E.position);
    return E.position === te && W(E, "name of an alias node must contain at least one character"), re = E.input.slice(te, E.position), d.call(E.anchorMap, re) || W(E, 'unidentified alias "' + re + '"'), E.result = E.anchorMap[re], D(E, !0, -1), !0;
  }
  function le(E, te, re, pe, ae) {
    var de, ce, me, we = 1, be = !1, je = !1, $e, We, q, ie, ue, oe;
    if (E.listener !== null && E.listener("open", E), E.tag = null, E.anchor = null, E.kind = null, E.result = null, de = ce = me = i === re || s === re, pe && D(E, !0, -1) && (be = !0, E.lineIndent > te ? we = 1 : E.lineIndent === te ? we = 0 : E.lineIndent < te && (we = -1)), we === 1)
      for (; H(E) || Y(E); )
        D(E, !0, -1) ? (be = !0, me = de, E.lineIndent > te ? we = 1 : E.lineIndent === te ? we = 0 : E.lineIndent < te && (we = -1)) : me = !1;
    if (me && (me = be || ae), (we === 1 || i === re) && (r === re || n === re ? ue = te : ue = te + 1, oe = E.position - E.lineStart, we === 1 ? me && (C(E, oe) || k(E, oe, ue)) || J(E, ue) ? je = !0 : (ce && B(E, ue) || N(E, ue) || A(E, ue) ? je = !0 : Z(E) ? (je = !0, (E.tag !== null || E.anchor !== null) && W(E, "alias node should not have any properties")) : L(E, ue, r === re) && (je = !0, E.tag === null && (E.tag = "?")), E.anchor !== null && (E.anchorMap[E.anchor] = E.result)) : we === 0 && (je = me && C(E, oe))), E.tag === null)
      E.anchor !== null && (E.anchorMap[E.anchor] = E.result);
    else if (E.tag === "?") {
      for (E.result !== null && E.kind !== "scalar" && W(E, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + E.kind + '"'), $e = 0, We = E.implicitTypes.length; $e < We; $e += 1)
        if (ie = E.implicitTypes[$e], ie.resolve(E.result)) {
          E.result = ie.construct(E.result), E.tag = ie.tag, E.anchor !== null && (E.anchorMap[E.anchor] = E.result);
          break;
        }
    } else if (E.tag !== "!") {
      if (d.call(E.typeMap[E.kind || "fallback"], E.tag))
        ie = E.typeMap[E.kind || "fallback"][E.tag];
      else
        for (ie = null, q = E.typeMap.multi[E.kind || "fallback"], $e = 0, We = q.length; $e < We; $e += 1)
          if (E.tag.slice(0, q[$e].tag.length) === q[$e].tag) {
            ie = q[$e];
            break;
          }
      ie || W(E, "unknown tag !<" + E.tag + ">"), E.result !== null && ie.kind !== E.kind && W(E, "unacceptable node kind for !<" + E.tag + '> tag; it should be "' + ie.kind + '", not "' + E.kind + '"'), ie.resolve(E.result, E.tag) ? (E.result = ie.construct(E.result, E.tag), E.anchor !== null && (E.anchorMap[E.anchor] = E.result)) : W(E, "cannot resolve a node with !<" + E.tag + "> explicit tag");
    }
    return E.listener !== null && E.listener("close", E), E.tag !== null || E.anchor !== null || je;
  }
  function ve(E) {
    var te = E.position, re, pe, ae, de = !1, ce;
    for (E.version = null, E.checkLineBreaks = E.legacy, E.tagMap = /* @__PURE__ */ Object.create(null), E.anchorMap = /* @__PURE__ */ Object.create(null); (ce = E.input.charCodeAt(E.position)) !== 0 && (D(E, !0, -1), ce = E.input.charCodeAt(E.position), !(E.lineIndent > 0 || ce !== 37)); ) {
      for (de = !0, ce = E.input.charCodeAt(++E.position), re = E.position; ce !== 0 && !b(ce); )
        ce = E.input.charCodeAt(++E.position);
      for (pe = E.input.slice(re, E.position), ae = [], pe.length < 1 && W(E, "directive name must not be less than one character in length"); ce !== 0; ) {
        for (; g(ce); )
          ce = E.input.charCodeAt(++E.position);
        if (ce === 35) {
          do
            ce = E.input.charCodeAt(++E.position);
          while (ce !== 0 && !l(ce));
          break;
        }
        if (l(ce)) break;
        for (re = E.position; ce !== 0 && !b(ce); )
          ce = E.input.charCodeAt(++E.position);
        ae.push(E.input.slice(re, E.position));
      }
      ce !== 0 && G(E), d.call(ee, pe) ? ee[pe](E, pe, ae) : Q(E, 'unknown document directive "' + pe + '"');
    }
    if (D(E, !0, -1), E.lineIndent === 0 && E.input.charCodeAt(E.position) === 45 && E.input.charCodeAt(E.position + 1) === 45 && E.input.charCodeAt(E.position + 2) === 45 ? (E.position += 3, D(E, !0, -1)) : de && W(E, "directives end mark is expected"), le(E, E.lineIndent - 1, i, !1, !0), D(E, !0, -1), E.checkLineBreaks && y.test(E.input.slice(te, E.position)) && Q(E, "non-ASCII line breaks are interpreted as content"), E.documents.push(E.result), E.position === E.lineStart && P(E)) {
      E.input.charCodeAt(E.position) === 46 && (E.position += 3, D(E, !0, -1));
      return;
    }
    if (E.position < E.length - 1)
      W(E, "end of the stream or a document separator is expected");
    else
      return;
  }
  function Te(E, te) {
    E = String(E), te = te || {}, E.length !== 0 && (E.charCodeAt(E.length - 1) !== 10 && E.charCodeAt(E.length - 1) !== 13 && (E += `
`), E.charCodeAt(0) === 65279 && (E = E.slice(1)));
    var re = new U(E, te), pe = E.indexOf("\0");
    for (pe !== -1 && (re.position = pe, W(re, "null byte is not allowed in input")), re.input += "\0"; re.input.charCodeAt(re.position) === 32; )
      re.lineIndent += 1, re.position += 1;
    for (; re.position < re.length - 1; )
      ve(re);
    return re.documents;
  }
  function ke(E, te, re) {
    te !== null && typeof te == "object" && typeof re > "u" && (re = te, te = null);
    var pe = Te(E, re);
    if (typeof te != "function")
      return pe;
    for (var ae = 0, de = pe.length; ae < de; ae += 1)
      te(pe[ae]);
  }
  function Ae(E, te) {
    var re = Te(E, te);
    if (re.length !== 0) {
      if (re.length === 1)
        return re[0];
      throw new t("expected a single document in the stream, but found more");
    }
  }
  return Aa.loadAll = ke, Aa.load = Ae, Aa;
}
var Tu = {}, Ip;
function rE() {
  if (Ip) return Tu;
  Ip = 1;
  var e = Nn(), t = Cn(), u = nc(), a = Object.prototype.toString, d = Object.prototype.hasOwnProperty, r = 65279, n = 9, s = 10, i = 13, c = 32, o = 33, p = 34, h = 35, y = 37, $ = 38, v = 39, f = 42, m = 44, l = 45, g = 58, b = 61, S = 62, _ = 63, w = 64, R = 91, T = 93, M = 96, F = 123, j = 124, V = 125, U = {};
  U[0] = "\\0", U[7] = "\\a", U[8] = "\\b", U[9] = "\\t", U[10] = "\\n", U[11] = "\\v", U[12] = "\\f", U[13] = "\\r", U[27] = "\\e", U[34] = '\\"', U[92] = "\\\\", U[133] = "\\N", U[160] = "\\_", U[8232] = "\\L", U[8233] = "\\P";
  var z = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ], W = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function Q(q, ie) {
    var ue, oe, fe, he, _e, ye, Ee;
    if (ie === null) return {};
    for (ue = {}, oe = Object.keys(ie), fe = 0, he = oe.length; fe < he; fe += 1)
      _e = oe[fe], ye = String(ie[_e]), _e.slice(0, 2) === "!!" && (_e = "tag:yaml.org,2002:" + _e.slice(2)), Ee = q.compiledTypeMap.fallback[_e], Ee && d.call(Ee.styleAliases, ye) && (ye = Ee.styleAliases[ye]), ue[_e] = ye;
    return ue;
  }
  function ee(q) {
    var ie, ue, oe;
    if (ie = q.toString(16).toUpperCase(), q <= 255)
      ue = "x", oe = 2;
    else if (q <= 65535)
      ue = "u", oe = 4;
    else if (q <= 4294967295)
      ue = "U", oe = 8;
    else
      throw new t("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + ue + e.repeat("0", oe - ie.length) + ie;
  }
  var ne = 1, K = 2;
  function I(q) {
    this.schema = q.schema || u, this.indent = Math.max(1, q.indent || 2), this.noArrayIndent = q.noArrayIndent || !1, this.skipInvalid = q.skipInvalid || !1, this.flowLevel = e.isNothing(q.flowLevel) ? -1 : q.flowLevel, this.styleMap = Q(this.schema, q.styles || null), this.sortKeys = q.sortKeys || !1, this.lineWidth = q.lineWidth || 80, this.noRefs = q.noRefs || !1, this.noCompatMode = q.noCompatMode || !1, this.condenseFlow = q.condenseFlow || !1, this.quotingType = q.quotingType === '"' ? K : ne, this.forceQuotes = q.forceQuotes || !1, this.replacer = typeof q.replacer == "function" ? q.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function G(q, ie) {
    for (var ue = e.repeat(" ", ie), oe = 0, fe = -1, he = "", _e, ye = q.length; oe < ye; )
      fe = q.indexOf(`
`, oe), fe === -1 ? (_e = q.slice(oe), oe = ye) : (_e = q.slice(oe, fe + 1), oe = fe + 1), _e.length && _e !== `
` && (he += ue), he += _e;
    return he;
  }
  function D(q, ie) {
    return `
` + e.repeat(" ", q.indent * ie);
  }
  function P(q, ie) {
    var ue, oe, fe;
    for (ue = 0, oe = q.implicitTypes.length; ue < oe; ue += 1)
      if (fe = q.implicitTypes[ue], fe.resolve(ie))
        return !0;
    return !1;
  }
  function O(q) {
    return q === c || q === n;
  }
  function L(q) {
    return 32 <= q && q <= 126 || 161 <= q && q <= 55295 && q !== 8232 && q !== 8233 || 57344 <= q && q <= 65533 && q !== r || 65536 <= q && q <= 1114111;
  }
  function N(q) {
    return L(q) && q !== r && q !== i && q !== s;
  }
  function A(q, ie, ue) {
    var oe = N(q), fe = oe && !O(q);
    return (
      // ns-plain-safe
      (ue ? (
        // c = flow-in
        oe
      ) : oe && q !== m && q !== R && q !== T && q !== F && q !== V) && q !== h && !(ie === g && !fe) || N(ie) && !O(ie) && q === h || ie === g && fe
    );
  }
  function J(q) {
    return L(q) && q !== r && !O(q) && q !== l && q !== _ && q !== g && q !== m && q !== R && q !== T && q !== F && q !== V && q !== h && q !== $ && q !== f && q !== o && q !== j && q !== b && q !== S && q !== v && q !== p && q !== y && q !== w && q !== M;
  }
  function B(q) {
    return !O(q) && q !== g;
  }
  function C(q, ie) {
    var ue = q.charCodeAt(ie), oe;
    return ue >= 55296 && ue <= 56319 && ie + 1 < q.length && (oe = q.charCodeAt(ie + 1), oe >= 56320 && oe <= 57343) ? (ue - 55296) * 1024 + oe - 56320 + 65536 : ue;
  }
  function k(q) {
    var ie = /^\n* /;
    return ie.test(q);
  }
  var H = 1, Y = 2, Z = 3, le = 4, ve = 5;
  function Te(q, ie, ue, oe, fe, he, _e, ye) {
    var Ee, Se = 0, xe = null, ze = !1, Ue = !1, Or = oe !== -1, Pt = -1, ur = J(C(q, 0)) && B(C(q, q.length - 1));
    if (ie || _e)
      for (Ee = 0; Ee < q.length; Se >= 65536 ? Ee += 2 : Ee++) {
        if (Se = C(q, Ee), !L(Se))
          return ve;
        ur = ur && A(Se, xe, ye), xe = Se;
      }
    else {
      for (Ee = 0; Ee < q.length; Se >= 65536 ? Ee += 2 : Ee++) {
        if (Se = C(q, Ee), Se === s)
          ze = !0, Or && (Ue = Ue || // Foldable line = too long, and not more-indented.
          Ee - Pt - 1 > oe && q[Pt + 1] !== " ", Pt = Ee);
        else if (!L(Se))
          return ve;
        ur = ur && A(Se, xe, ye), xe = Se;
      }
      Ue = Ue || Or && Ee - Pt - 1 > oe && q[Pt + 1] !== " ";
    }
    return !ze && !Ue ? ur && !_e && !fe(q) ? H : he === K ? ve : Y : ue > 9 && k(q) ? ve : _e ? he === K ? ve : Y : Ue ? le : Z;
  }
  function ke(q, ie, ue, oe, fe) {
    q.dump = function() {
      if (ie.length === 0)
        return q.quotingType === K ? '""' : "''";
      if (!q.noCompatMode && (z.indexOf(ie) !== -1 || W.test(ie)))
        return q.quotingType === K ? '"' + ie + '"' : "'" + ie + "'";
      var he = q.indent * Math.max(1, ue), _e = q.lineWidth === -1 ? -1 : Math.max(Math.min(q.lineWidth, 40), q.lineWidth - he), ye = oe || q.flowLevel > -1 && ue >= q.flowLevel;
      function Ee(Se) {
        return P(q, Se);
      }
      switch (Te(
        ie,
        ye,
        q.indent,
        _e,
        Ee,
        q.quotingType,
        q.forceQuotes && !oe,
        fe
      )) {
        case H:
          return ie;
        case Y:
          return "'" + ie.replace(/'/g, "''") + "'";
        case Z:
          return "|" + Ae(ie, q.indent) + E(G(ie, he));
        case le:
          return ">" + Ae(ie, q.indent) + E(G(te(ie, _e), he));
        case ve:
          return '"' + pe(ie) + '"';
        default:
          throw new t("impossible error: invalid scalar style");
      }
    }();
  }
  function Ae(q, ie) {
    var ue = k(q) ? String(ie) : "", oe = q[q.length - 1] === `
`, fe = oe && (q[q.length - 2] === `
` || q === `
`), he = fe ? "+" : oe ? "" : "-";
    return ue + he + `
`;
  }
  function E(q) {
    return q[q.length - 1] === `
` ? q.slice(0, -1) : q;
  }
  function te(q, ie) {
    for (var ue = /(\n+)([^\n]*)/g, oe = function() {
      var Se = q.indexOf(`
`);
      return Se = Se !== -1 ? Se : q.length, ue.lastIndex = Se, re(q.slice(0, Se), ie);
    }(), fe = q[0] === `
` || q[0] === " ", he, _e; _e = ue.exec(q); ) {
      var ye = _e[1], Ee = _e[2];
      he = Ee[0] === " ", oe += ye + (!fe && !he && Ee !== "" ? `
` : "") + re(Ee, ie), fe = he;
    }
    return oe;
  }
  function re(q, ie) {
    if (q === "" || q[0] === " ") return q;
    for (var ue = / [^ ]/g, oe, fe = 0, he, _e = 0, ye = 0, Ee = ""; oe = ue.exec(q); )
      ye = oe.index, ye - fe > ie && (he = _e > fe ? _e : ye, Ee += `
` + q.slice(fe, he), fe = he + 1), _e = ye;
    return Ee += `
`, q.length - fe > ie && _e > fe ? Ee += q.slice(fe, _e) + `
` + q.slice(_e + 1) : Ee += q.slice(fe), Ee.slice(1);
  }
  function pe(q) {
    for (var ie = "", ue = 0, oe, fe = 0; fe < q.length; ue >= 65536 ? fe += 2 : fe++)
      ue = C(q, fe), oe = U[ue], !oe && L(ue) ? (ie += q[fe], ue >= 65536 && (ie += q[fe + 1])) : ie += oe || ee(ue);
    return ie;
  }
  function ae(q, ie, ue) {
    var oe = "", fe = q.tag, he, _e, ye;
    for (he = 0, _e = ue.length; he < _e; he += 1)
      ye = ue[he], q.replacer && (ye = q.replacer.call(ue, String(he), ye)), (be(q, ie, ye, !1, !1) || typeof ye > "u" && be(q, ie, null, !1, !1)) && (oe !== "" && (oe += "," + (q.condenseFlow ? "" : " ")), oe += q.dump);
    q.tag = fe, q.dump = "[" + oe + "]";
  }
  function de(q, ie, ue, oe) {
    var fe = "", he = q.tag, _e, ye, Ee;
    for (_e = 0, ye = ue.length; _e < ye; _e += 1)
      Ee = ue[_e], q.replacer && (Ee = q.replacer.call(ue, String(_e), Ee)), (be(q, ie + 1, Ee, !0, !0, !1, !0) || typeof Ee > "u" && be(q, ie + 1, null, !0, !0, !1, !0)) && ((!oe || fe !== "") && (fe += D(q, ie)), q.dump && s === q.dump.charCodeAt(0) ? fe += "-" : fe += "- ", fe += q.dump);
    q.tag = he, q.dump = fe || "[]";
  }
  function ce(q, ie, ue) {
    var oe = "", fe = q.tag, he = Object.keys(ue), _e, ye, Ee, Se, xe;
    for (_e = 0, ye = he.length; _e < ye; _e += 1)
      xe = "", oe !== "" && (xe += ", "), q.condenseFlow && (xe += '"'), Ee = he[_e], Se = ue[Ee], q.replacer && (Se = q.replacer.call(ue, Ee, Se)), be(q, ie, Ee, !1, !1) && (q.dump.length > 1024 && (xe += "? "), xe += q.dump + (q.condenseFlow ? '"' : "") + ":" + (q.condenseFlow ? "" : " "), be(q, ie, Se, !1, !1) && (xe += q.dump, oe += xe));
    q.tag = fe, q.dump = "{" + oe + "}";
  }
  function me(q, ie, ue, oe) {
    var fe = "", he = q.tag, _e = Object.keys(ue), ye, Ee, Se, xe, ze, Ue;
    if (q.sortKeys === !0)
      _e.sort();
    else if (typeof q.sortKeys == "function")
      _e.sort(q.sortKeys);
    else if (q.sortKeys)
      throw new t("sortKeys must be a boolean or a function");
    for (ye = 0, Ee = _e.length; ye < Ee; ye += 1)
      Ue = "", (!oe || fe !== "") && (Ue += D(q, ie)), Se = _e[ye], xe = ue[Se], q.replacer && (xe = q.replacer.call(ue, Se, xe)), be(q, ie + 1, Se, !0, !0, !0) && (ze = q.tag !== null && q.tag !== "?" || q.dump && q.dump.length > 1024, ze && (q.dump && s === q.dump.charCodeAt(0) ? Ue += "?" : Ue += "? "), Ue += q.dump, ze && (Ue += D(q, ie)), be(q, ie + 1, xe, !0, ze) && (q.dump && s === q.dump.charCodeAt(0) ? Ue += ":" : Ue += ": ", Ue += q.dump, fe += Ue));
    q.tag = he, q.dump = fe || "{}";
  }
  function we(q, ie, ue) {
    var oe, fe, he, _e, ye, Ee;
    for (fe = ue ? q.explicitTypes : q.implicitTypes, he = 0, _e = fe.length; he < _e; he += 1)
      if (ye = fe[he], (ye.instanceOf || ye.predicate) && (!ye.instanceOf || typeof ie == "object" && ie instanceof ye.instanceOf) && (!ye.predicate || ye.predicate(ie))) {
        if (ue ? ye.multi && ye.representName ? q.tag = ye.representName(ie) : q.tag = ye.tag : q.tag = "?", ye.represent) {
          if (Ee = q.styleMap[ye.tag] || ye.defaultStyle, a.call(ye.represent) === "[object Function]")
            oe = ye.represent(ie, Ee);
          else if (d.call(ye.represent, Ee))
            oe = ye.represent[Ee](ie, Ee);
          else
            throw new t("!<" + ye.tag + '> tag resolver accepts not "' + Ee + '" style');
          q.dump = oe;
        }
        return !0;
      }
    return !1;
  }
  function be(q, ie, ue, oe, fe, he, _e) {
    q.tag = null, q.dump = ue, we(q, ue, !1) || we(q, ue, !0);
    var ye = a.call(q.dump), Ee = oe, Se;
    oe && (oe = q.flowLevel < 0 || q.flowLevel > ie);
    var xe = ye === "[object Object]" || ye === "[object Array]", ze, Ue;
    if (xe && (ze = q.duplicates.indexOf(ue), Ue = ze !== -1), (q.tag !== null && q.tag !== "?" || Ue || q.indent !== 2 && ie > 0) && (fe = !1), Ue && q.usedDuplicates[ze])
      q.dump = "*ref_" + ze;
    else {
      if (xe && Ue && !q.usedDuplicates[ze] && (q.usedDuplicates[ze] = !0), ye === "[object Object]")
        oe && Object.keys(q.dump).length !== 0 ? (me(q, ie, q.dump, fe), Ue && (q.dump = "&ref_" + ze + q.dump)) : (ce(q, ie, q.dump), Ue && (q.dump = "&ref_" + ze + " " + q.dump));
      else if (ye === "[object Array]")
        oe && q.dump.length !== 0 ? (q.noArrayIndent && !_e && ie > 0 ? de(q, ie - 1, q.dump, fe) : de(q, ie, q.dump, fe), Ue && (q.dump = "&ref_" + ze + q.dump)) : (ae(q, ie, q.dump), Ue && (q.dump = "&ref_" + ze + " " + q.dump));
      else if (ye === "[object String]")
        q.tag !== "?" && ke(q, q.dump, ie, he, Ee);
      else {
        if (ye === "[object Undefined]")
          return !1;
        if (q.skipInvalid) return !1;
        throw new t("unacceptable kind of an object to dump " + ye);
      }
      q.tag !== null && q.tag !== "?" && (Se = encodeURI(
        q.tag[0] === "!" ? q.tag.slice(1) : q.tag
      ).replace(/!/g, "%21"), q.tag[0] === "!" ? Se = "!" + Se : Se.slice(0, 18) === "tag:yaml.org,2002:" ? Se = "!!" + Se.slice(18) : Se = "!<" + Se + ">", q.dump = Se + " " + q.dump);
    }
    return !0;
  }
  function je(q, ie) {
    var ue = [], oe = [], fe, he;
    for ($e(q, ue, oe), fe = 0, he = oe.length; fe < he; fe += 1)
      ie.duplicates.push(ue[oe[fe]]);
    ie.usedDuplicates = new Array(he);
  }
  function $e(q, ie, ue) {
    var oe, fe, he;
    if (q !== null && typeof q == "object")
      if (fe = ie.indexOf(q), fe !== -1)
        ue.indexOf(fe) === -1 && ue.push(fe);
      else if (ie.push(q), Array.isArray(q))
        for (fe = 0, he = q.length; fe < he; fe += 1)
          $e(q[fe], ie, ue);
      else
        for (oe = Object.keys(q), fe = 0, he = oe.length; fe < he; fe += 1)
          $e(q[oe[fe]], ie, ue);
  }
  function We(q, ie) {
    ie = ie || {};
    var ue = new I(ie);
    ue.noRefs || je(q, ue);
    var oe = q;
    return ue.replacer && (oe = ue.replacer.call({ "": oe }, "", oe)), be(ue, 0, oe, !0, !0) ? ue.dump + `
` : "";
  }
  return Tu.dump = We, Tu;
}
var Dp;
function ic() {
  if (Dp) return at;
  Dp = 1;
  var e = tE(), t = rE();
  function u(a, d) {
    return function() {
      throw new Error("Function yaml." + a + " is removed in js-yaml 4. Use yaml." + d + " instead, which is now safe by default.");
    };
  }
  return at.Type = dt(), at.Schema = Ym(), at.FAILSAFE_SCHEMA = Zm(), at.JSON_SCHEMA = iy(), at.CORE_SCHEMA = ay(), at.DEFAULT_SCHEMA = nc(), at.load = e.load, at.loadAll = e.loadAll, at.dump = t.dump, at.YAMLException = Cn(), at.types = {
    binary: uy(),
    float: ny(),
    map: Qm(),
    null: ey(),
    pairs: ly(),
    set: fy(),
    timestamp: oy(),
    bool: ty(),
    int: ry(),
    merge: sy(),
    omap: cy(),
    seq: Xm(),
    str: Jm()
  }, at.safeLoad = u("safeLoad", "load"), at.safeLoadAll = u("safeLoadAll", "loadAll"), at.safeDump = u("safeDump", "dump"), at;
}
var sn = {}, kp;
function nE() {
  if (kp) return sn;
  kp = 1, Object.defineProperty(sn, "__esModule", { value: !0 }), sn.Lazy = void 0;
  class e {
    constructor(u) {
      this._value = null, this.creator = u;
    }
    get hasValue() {
      return this.creator == null;
    }
    get value() {
      if (this.creator == null)
        return this._value;
      const u = this.creator();
      return this.value = u, u;
    }
    set value(u) {
      this._value = u, this.creator = null;
    }
  }
  return sn.Lazy = e, sn;
}
var Lr = {}, Pn = { exports: {} };
Pn.exports;
var qp;
function iE() {
  return qp || (qp = 1, function(e, t) {
    var u = 200, a = "__lodash_hash_undefined__", d = 1, r = 2, n = 9007199254740991, s = "[object Arguments]", i = "[object Array]", c = "[object AsyncFunction]", o = "[object Boolean]", p = "[object Date]", h = "[object Error]", y = "[object Function]", $ = "[object GeneratorFunction]", v = "[object Map]", f = "[object Number]", m = "[object Null]", l = "[object Object]", g = "[object Promise]", b = "[object Proxy]", S = "[object RegExp]", _ = "[object Set]", w = "[object String]", R = "[object Symbol]", T = "[object Undefined]", M = "[object WeakMap]", F = "[object ArrayBuffer]", j = "[object DataView]", V = "[object Float32Array]", U = "[object Float64Array]", z = "[object Int8Array]", W = "[object Int16Array]", Q = "[object Int32Array]", ee = "[object Uint8Array]", ne = "[object Uint8ClampedArray]", K = "[object Uint16Array]", I = "[object Uint32Array]", G = /[\\^$.*+?()[\]{}|]/g, D = /^\[object .+?Constructor\]$/, P = /^(?:0|[1-9]\d*)$/, O = {};
    O[V] = O[U] = O[z] = O[W] = O[Q] = O[ee] = O[ne] = O[K] = O[I] = !0, O[s] = O[i] = O[F] = O[o] = O[j] = O[p] = O[h] = O[y] = O[v] = O[f] = O[l] = O[S] = O[_] = O[w] = O[M] = !1;
    var L = typeof Nt == "object" && Nt && Nt.Object === Object && Nt, N = typeof self == "object" && self && self.Object === Object && self, A = L || N || Function("return this")(), J = t && !t.nodeType && t, B = J && !0 && e && !e.nodeType && e, C = B && B.exports === J, k = C && L.process, H = function() {
      try {
        return k && k.binding && k.binding("util");
      } catch {
      }
    }(), Y = H && H.isTypedArray;
    function Z(x, X) {
      for (var se = -1, ge = x == null ? 0 : x.length, Ve = 0, Pe = []; ++se < ge; ) {
        var Ke = x[se];
        X(Ke, se, x) && (Pe[Ve++] = Ke);
      }
      return Pe;
    }
    function le(x, X) {
      for (var se = -1, ge = X.length, Ve = x.length; ++se < ge; )
        x[Ve + se] = X[se];
      return x;
    }
    function ve(x, X) {
      for (var se = -1, ge = x == null ? 0 : x.length; ++se < ge; )
        if (X(x[se], se, x))
          return !0;
      return !1;
    }
    function Te(x, X) {
      for (var se = -1, ge = Array(x); ++se < x; )
        ge[se] = X(se);
      return ge;
    }
    function ke(x) {
      return function(X) {
        return x(X);
      };
    }
    function Ae(x, X) {
      return x.has(X);
    }
    function E(x, X) {
      return x?.[X];
    }
    function te(x) {
      var X = -1, se = Array(x.size);
      return x.forEach(function(ge, Ve) {
        se[++X] = [Ve, ge];
      }), se;
    }
    function re(x, X) {
      return function(se) {
        return x(X(se));
      };
    }
    function pe(x) {
      var X = -1, se = Array(x.size);
      return x.forEach(function(ge) {
        se[++X] = ge;
      }), se;
    }
    var ae = Array.prototype, de = Function.prototype, ce = Object.prototype, me = A["__core-js_shared__"], we = de.toString, be = ce.hasOwnProperty, je = function() {
      var x = /[^.]+$/.exec(me && me.keys && me.keys.IE_PROTO || "");
      return x ? "Symbol(src)_1." + x : "";
    }(), $e = ce.toString, We = RegExp(
      "^" + we.call(be).replace(G, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), q = C ? A.Buffer : void 0, ie = A.Symbol, ue = A.Uint8Array, oe = ce.propertyIsEnumerable, fe = ae.splice, he = ie ? ie.toStringTag : void 0, _e = Object.getOwnPropertySymbols, ye = q ? q.isBuffer : void 0, Ee = re(Object.keys, Object), Se = Ar(A, "DataView"), xe = Ar(A, "Map"), ze = Ar(A, "Promise"), Ue = Ar(A, "Set"), Or = Ar(A, "WeakMap"), Pt = Ar(Object, "create"), ur = fr(Se), $y = fr(xe), wy = fr(ze), Ey = fr(Ue), by = fr(Or), cc = ie ? ie.prototype : void 0, ao = cc ? cc.valueOf : void 0;
    function cr(x) {
      var X = -1, se = x == null ? 0 : x.length;
      for (this.clear(); ++X < se; ) {
        var ge = x[X];
        this.set(ge[0], ge[1]);
      }
    }
    function Sy() {
      this.__data__ = Pt ? Pt(null) : {}, this.size = 0;
    }
    function Py(x) {
      var X = this.has(x) && delete this.__data__[x];
      return this.size -= X ? 1 : 0, X;
    }
    function Ry(x) {
      var X = this.__data__;
      if (Pt) {
        var se = X[x];
        return se === a ? void 0 : se;
      }
      return be.call(X, x) ? X[x] : void 0;
    }
    function Ty(x) {
      var X = this.__data__;
      return Pt ? X[x] !== void 0 : be.call(X, x);
    }
    function Oy(x, X) {
      var se = this.__data__;
      return this.size += this.has(x) ? 0 : 1, se[x] = Pt && X === void 0 ? a : X, this;
    }
    cr.prototype.clear = Sy, cr.prototype.delete = Py, cr.prototype.get = Ry, cr.prototype.has = Ty, cr.prototype.set = Oy;
    function jt(x) {
      var X = -1, se = x == null ? 0 : x.length;
      for (this.clear(); ++X < se; ) {
        var ge = x[X];
        this.set(ge[0], ge[1]);
      }
    }
    function Ay() {
      this.__data__ = [], this.size = 0;
    }
    function Ny(x) {
      var X = this.__data__, se = Dn(X, x);
      if (se < 0)
        return !1;
      var ge = X.length - 1;
      return se == ge ? X.pop() : fe.call(X, se, 1), --this.size, !0;
    }
    function Cy(x) {
      var X = this.__data__, se = Dn(X, x);
      return se < 0 ? void 0 : X[se][1];
    }
    function Iy(x) {
      return Dn(this.__data__, x) > -1;
    }
    function Dy(x, X) {
      var se = this.__data__, ge = Dn(se, x);
      return ge < 0 ? (++this.size, se.push([x, X])) : se[ge][1] = X, this;
    }
    jt.prototype.clear = Ay, jt.prototype.delete = Ny, jt.prototype.get = Cy, jt.prototype.has = Iy, jt.prototype.set = Dy;
    function lr(x) {
      var X = -1, se = x == null ? 0 : x.length;
      for (this.clear(); ++X < se; ) {
        var ge = x[X];
        this.set(ge[0], ge[1]);
      }
    }
    function ky() {
      this.size = 0, this.__data__ = {
        hash: new cr(),
        map: new (xe || jt)(),
        string: new cr()
      };
    }
    function qy(x) {
      var X = kn(this, x).delete(x);
      return this.size -= X ? 1 : 0, X;
    }
    function Fy(x) {
      return kn(this, x).get(x);
    }
    function jy(x) {
      return kn(this, x).has(x);
    }
    function Uy(x, X) {
      var se = kn(this, x), ge = se.size;
      return se.set(x, X), this.size += se.size == ge ? 0 : 1, this;
    }
    lr.prototype.clear = ky, lr.prototype.delete = qy, lr.prototype.get = Fy, lr.prototype.has = jy, lr.prototype.set = Uy;
    function In(x) {
      var X = -1, se = x == null ? 0 : x.length;
      for (this.__data__ = new lr(); ++X < se; )
        this.add(x[X]);
    }
    function Ly(x) {
      return this.__data__.set(x, a), this;
    }
    function My(x) {
      return this.__data__.has(x);
    }
    In.prototype.add = In.prototype.push = Ly, In.prototype.has = My;
    function Wt(x) {
      var X = this.__data__ = new jt(x);
      this.size = X.size;
    }
    function xy() {
      this.__data__ = new jt(), this.size = 0;
    }
    function Vy(x) {
      var X = this.__data__, se = X.delete(x);
      return this.size = X.size, se;
    }
    function By(x) {
      return this.__data__.get(x);
    }
    function Hy(x) {
      return this.__data__.has(x);
    }
    function Gy(x, X) {
      var se = this.__data__;
      if (se instanceof jt) {
        var ge = se.__data__;
        if (!xe || ge.length < u - 1)
          return ge.push([x, X]), this.size = ++se.size, this;
        se = this.__data__ = new lr(ge);
      }
      return se.set(x, X), this.size = se.size, this;
    }
    Wt.prototype.clear = xy, Wt.prototype.delete = Vy, Wt.prototype.get = By, Wt.prototype.has = Hy, Wt.prototype.set = Gy;
    function zy(x, X) {
      var se = qn(x), ge = !se && sg(x), Ve = !se && !ge && oo(x), Pe = !se && !ge && !Ve && vc(x), Ke = se || ge || Ve || Pe, Xe = Ke ? Te(x.length, String) : [], Qe = Xe.length;
      for (var He in x)
        be.call(x, He) && !(Ke && // Safari 9 has enumerable `arguments.length` in strict mode.
        (He == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        Ve && (He == "offset" || He == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        Pe && (He == "buffer" || He == "byteLength" || He == "byteOffset") || // Skip index properties.
        rg(He, Qe))) && Xe.push(He);
      return Xe;
    }
    function Dn(x, X) {
      for (var se = x.length; se--; )
        if (pc(x[se][0], X))
          return se;
      return -1;
    }
    function Ky(x, X, se) {
      var ge = X(x);
      return qn(x) ? ge : le(ge, se(x));
    }
    function Wr(x) {
      return x == null ? x === void 0 ? T : m : he && he in Object(x) ? eg(x) : og(x);
    }
    function lc(x) {
      return Yr(x) && Wr(x) == s;
    }
    function fc(x, X, se, ge, Ve) {
      return x === X ? !0 : x == null || X == null || !Yr(x) && !Yr(X) ? x !== x && X !== X : Wy(x, X, se, ge, fc, Ve);
    }
    function Wy(x, X, se, ge, Ve, Pe) {
      var Ke = qn(x), Xe = qn(X), Qe = Ke ? i : Yt(x), He = Xe ? i : Yt(X);
      Qe = Qe == s ? l : Qe, He = He == s ? l : He;
      var pt = Qe == l, Rt = He == l, rt = Qe == He;
      if (rt && oo(x)) {
        if (!oo(X))
          return !1;
        Ke = !0, pt = !1;
      }
      if (rt && !pt)
        return Pe || (Pe = new Wt()), Ke || vc(x) ? dc(x, X, se, ge, Ve, Pe) : Qy(x, X, Qe, se, ge, Ve, Pe);
      if (!(se & d)) {
        var _t = pt && be.call(x, "__wrapped__"), $t = Rt && be.call(X, "__wrapped__");
        if (_t || $t) {
          var Jt = _t ? x.value() : x, Ut = $t ? X.value() : X;
          return Pe || (Pe = new Wt()), Ve(Jt, Ut, se, ge, Pe);
        }
      }
      return rt ? (Pe || (Pe = new Wt()), Zy(x, X, se, ge, Ve, Pe)) : !1;
    }
    function Yy(x) {
      if (!gc(x) || ig(x))
        return !1;
      var X = mc(x) ? We : D;
      return X.test(fr(x));
    }
    function Jy(x) {
      return Yr(x) && yc(x.length) && !!O[Wr(x)];
    }
    function Xy(x) {
      if (!ag(x))
        return Ee(x);
      var X = [];
      for (var se in Object(x))
        be.call(x, se) && se != "constructor" && X.push(se);
      return X;
    }
    function dc(x, X, se, ge, Ve, Pe) {
      var Ke = se & d, Xe = x.length, Qe = X.length;
      if (Xe != Qe && !(Ke && Qe > Xe))
        return !1;
      var He = Pe.get(x);
      if (He && Pe.get(X))
        return He == X;
      var pt = -1, Rt = !0, rt = se & r ? new In() : void 0;
      for (Pe.set(x, X), Pe.set(X, x); ++pt < Xe; ) {
        var _t = x[pt], $t = X[pt];
        if (ge)
          var Jt = Ke ? ge($t, _t, pt, X, x, Pe) : ge(_t, $t, pt, x, X, Pe);
        if (Jt !== void 0) {
          if (Jt)
            continue;
          Rt = !1;
          break;
        }
        if (rt) {
          if (!ve(X, function(Ut, dr) {
            if (!Ae(rt, dr) && (_t === Ut || Ve(_t, Ut, se, ge, Pe)))
              return rt.push(dr);
          })) {
            Rt = !1;
            break;
          }
        } else if (!(_t === $t || Ve(_t, $t, se, ge, Pe))) {
          Rt = !1;
          break;
        }
      }
      return Pe.delete(x), Pe.delete(X), Rt;
    }
    function Qy(x, X, se, ge, Ve, Pe, Ke) {
      switch (se) {
        case j:
          if (x.byteLength != X.byteLength || x.byteOffset != X.byteOffset)
            return !1;
          x = x.buffer, X = X.buffer;
        case F:
          return !(x.byteLength != X.byteLength || !Pe(new ue(x), new ue(X)));
        case o:
        case p:
        case f:
          return pc(+x, +X);
        case h:
          return x.name == X.name && x.message == X.message;
        case S:
        case w:
          return x == X + "";
        case v:
          var Xe = te;
        case _:
          var Qe = ge & d;
          if (Xe || (Xe = pe), x.size != X.size && !Qe)
            return !1;
          var He = Ke.get(x);
          if (He)
            return He == X;
          ge |= r, Ke.set(x, X);
          var pt = dc(Xe(x), Xe(X), ge, Ve, Pe, Ke);
          return Ke.delete(x), pt;
        case R:
          if (ao)
            return ao.call(x) == ao.call(X);
      }
      return !1;
    }
    function Zy(x, X, se, ge, Ve, Pe) {
      var Ke = se & d, Xe = hc(x), Qe = Xe.length, He = hc(X), pt = He.length;
      if (Qe != pt && !Ke)
        return !1;
      for (var Rt = Qe; Rt--; ) {
        var rt = Xe[Rt];
        if (!(Ke ? rt in X : be.call(X, rt)))
          return !1;
      }
      var _t = Pe.get(x);
      if (_t && Pe.get(X))
        return _t == X;
      var $t = !0;
      Pe.set(x, X), Pe.set(X, x);
      for (var Jt = Ke; ++Rt < Qe; ) {
        rt = Xe[Rt];
        var Ut = x[rt], dr = X[rt];
        if (ge)
          var _c = Ke ? ge(dr, Ut, rt, X, x, Pe) : ge(Ut, dr, rt, x, X, Pe);
        if (!(_c === void 0 ? Ut === dr || Ve(Ut, dr, se, ge, Pe) : _c)) {
          $t = !1;
          break;
        }
        Jt || (Jt = rt == "constructor");
      }
      if ($t && !Jt) {
        var Fn = x.constructor, jn = X.constructor;
        Fn != jn && "constructor" in x && "constructor" in X && !(typeof Fn == "function" && Fn instanceof Fn && typeof jn == "function" && jn instanceof jn) && ($t = !1);
      }
      return Pe.delete(x), Pe.delete(X), $t;
    }
    function hc(x) {
      return Ky(x, lg, tg);
    }
    function kn(x, X) {
      var se = x.__data__;
      return ng(X) ? se[typeof X == "string" ? "string" : "hash"] : se.map;
    }
    function Ar(x, X) {
      var se = E(x, X);
      return Yy(se) ? se : void 0;
    }
    function eg(x) {
      var X = be.call(x, he), se = x[he];
      try {
        x[he] = void 0;
        var ge = !0;
      } catch {
      }
      var Ve = $e.call(x);
      return ge && (X ? x[he] = se : delete x[he]), Ve;
    }
    var tg = _e ? function(x) {
      return x == null ? [] : (x = Object(x), Z(_e(x), function(X) {
        return oe.call(x, X);
      }));
    } : fg, Yt = Wr;
    (Se && Yt(new Se(new ArrayBuffer(1))) != j || xe && Yt(new xe()) != v || ze && Yt(ze.resolve()) != g || Ue && Yt(new Ue()) != _ || Or && Yt(new Or()) != M) && (Yt = function(x) {
      var X = Wr(x), se = X == l ? x.constructor : void 0, ge = se ? fr(se) : "";
      if (ge)
        switch (ge) {
          case ur:
            return j;
          case $y:
            return v;
          case wy:
            return g;
          case Ey:
            return _;
          case by:
            return M;
        }
      return X;
    });
    function rg(x, X) {
      return X = X ?? n, !!X && (typeof x == "number" || P.test(x)) && x > -1 && x % 1 == 0 && x < X;
    }
    function ng(x) {
      var X = typeof x;
      return X == "string" || X == "number" || X == "symbol" || X == "boolean" ? x !== "__proto__" : x === null;
    }
    function ig(x) {
      return !!je && je in x;
    }
    function ag(x) {
      var X = x && x.constructor, se = typeof X == "function" && X.prototype || ce;
      return x === se;
    }
    function og(x) {
      return $e.call(x);
    }
    function fr(x) {
      if (x != null) {
        try {
          return we.call(x);
        } catch {
        }
        try {
          return x + "";
        } catch {
        }
      }
      return "";
    }
    function pc(x, X) {
      return x === X || x !== x && X !== X;
    }
    var sg = lc(/* @__PURE__ */ function() {
      return arguments;
    }()) ? lc : function(x) {
      return Yr(x) && be.call(x, "callee") && !oe.call(x, "callee");
    }, qn = Array.isArray;
    function ug(x) {
      return x != null && yc(x.length) && !mc(x);
    }
    var oo = ye || dg;
    function cg(x, X) {
      return fc(x, X);
    }
    function mc(x) {
      if (!gc(x))
        return !1;
      var X = Wr(x);
      return X == y || X == $ || X == c || X == b;
    }
    function yc(x) {
      return typeof x == "number" && x > -1 && x % 1 == 0 && x <= n;
    }
    function gc(x) {
      var X = typeof x;
      return x != null && (X == "object" || X == "function");
    }
    function Yr(x) {
      return x != null && typeof x == "object";
    }
    var vc = Y ? ke(Y) : Jy;
    function lg(x) {
      return ug(x) ? zy(x) : Xy(x);
    }
    function fg() {
      return [];
    }
    function dg() {
      return !1;
    }
    e.exports = cg;
  }(Pn, Pn.exports)), Pn.exports;
}
var Fp;
function aE() {
  if (Fp) return Lr;
  Fp = 1, Object.defineProperty(Lr, "__esModule", { value: !0 }), Lr.DownloadedUpdateHelper = void 0, Lr.createTempUpdateFile = s;
  const e = On, t = ar, u = iE(), a = /* @__PURE__ */ sr(), d = Ge;
  let r = class {
    constructor(c) {
      this.cacheDir = c, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
    }
    get downloadedFileInfo() {
      return this._downloadedFileInfo;
    }
    get file() {
      return this._file;
    }
    get packageFile() {
      return this._packageFile;
    }
    get cacheDirForPendingUpdate() {
      return d.join(this.cacheDir, "pending");
    }
    async validateDownloadedPath(c, o, p, h) {
      if (this.versionInfo != null && this.file === c && this.fileInfo != null)
        return u(this.versionInfo, o) && u(this.fileInfo.info, p.info) && await (0, a.pathExists)(c) ? c : null;
      const y = await this.getValidCachedUpdateFile(p, h);
      return y === null ? null : (h.info(`Update has already been downloaded to ${c}).`), this._file = y, y);
    }
    async setDownloadedFile(c, o, p, h, y, $) {
      this._file = c, this._packageFile = o, this.versionInfo = p, this.fileInfo = h, this._downloadedFileInfo = {
        fileName: y,
        sha512: h.info.sha512,
        isAdminRightsRequired: h.info.isAdminRightsRequired === !0
      }, $ && await (0, a.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
    async clear() {
      this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
    }
    async cleanCacheDirForPendingUpdate() {
      try {
        await (0, a.emptyDir)(this.cacheDirForPendingUpdate);
      } catch {
      }
    }
    /**
     * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
     * @param fileInfo
     * @param logger
     */
    async getValidCachedUpdateFile(c, o) {
      const p = this.getUpdateInfoFile();
      if (!await (0, a.pathExists)(p))
        return null;
      let y;
      try {
        y = await (0, a.readJson)(p);
      } catch (m) {
        let l = "No cached update info available";
        return m.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${m.message})`), o.info(l), null;
      }
      if (!(y?.fileName !== null))
        return o.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
      if (c.info.sha512 !== y.sha512)
        return o.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${y.sha512}, expected: ${c.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
      const v = d.join(this.cacheDirForPendingUpdate, y.fileName);
      if (!await (0, a.pathExists)(v))
        return o.info("Cached update file doesn't exist"), null;
      const f = await n(v);
      return c.info.sha512 !== f ? (o.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${f}, expected: ${c.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = y, v);
    }
    getUpdateInfoFile() {
      return d.join(this.cacheDirForPendingUpdate, "update-info.json");
    }
  };
  Lr.DownloadedUpdateHelper = r;
  function n(i, c = "sha512", o = "base64", p) {
    return new Promise((h, y) => {
      const $ = (0, e.createHash)(c);
      $.on("error", y).setEncoding(o), (0, t.createReadStream)(i, {
        ...p,
        highWaterMark: 1024 * 1024
        /* better to use more memory but hash faster */
      }).on("error", y).on("end", () => {
        $.end(), h($.read());
      }).pipe($, { end: !1 });
    });
  }
  async function s(i, c, o) {
    let p = 0, h = d.join(c, i);
    for (let y = 0; y < 3; y++)
      try {
        return await (0, a.unlink)(h), h;
      } catch ($) {
        if ($.code === "ENOENT")
          return h;
        o.warn(`Error on remove temp update file: ${$}`), h = d.join(c, `${p++}-${i}`);
      }
    return h;
  }
  return Lr;
}
var un = {}, Na = {}, jp;
function oE() {
  if (jp) return Na;
  jp = 1, Object.defineProperty(Na, "__esModule", { value: !0 }), Na.getAppCacheDir = u;
  const e = Ge, t = Ma;
  function u() {
    const a = (0, t.homedir)();
    let d;
    return process.platform === "win32" ? d = process.env.LOCALAPPDATA || e.join(a, "AppData", "Local") : process.platform === "darwin" ? d = e.join(a, "Library", "Caches") : d = process.env.XDG_CACHE_HOME || e.join(a, ".cache"), d;
  }
  return Na;
}
var Up;
function sE() {
  if (Up) return un;
  Up = 1, Object.defineProperty(un, "__esModule", { value: !0 }), un.ElectronAppAdapter = void 0;
  const e = Ge, t = oE();
  let u = class {
    constructor(d = Kt.app) {
      this.app = d;
    }
    whenReady() {
      return this.app.whenReady();
    }
    get version() {
      return this.app.getVersion();
    }
    get name() {
      return this.app.getName();
    }
    get isPackaged() {
      return this.app.isPackaged === !0;
    }
    get appUpdateConfigPath() {
      return this.isPackaged ? e.join(process.resourcesPath, "app-update.yml") : e.join(this.app.getAppPath(), "dev-app-update.yml");
    }
    get userDataPath() {
      return this.app.getPath("userData");
    }
    get baseCachePath() {
      return (0, t.getAppCacheDir)();
    }
    quit() {
      this.app.quit();
    }
    relaunch() {
      this.app.relaunch();
    }
    onQuit(d) {
      this.app.once("quit", (r, n) => d(n));
    }
  };
  return un.ElectronAppAdapter = u, un;
}
var Ou = {}, Lp;
function uE() {
  return Lp || (Lp = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = u;
    const t = tt();
    e.NET_SESSION_NAME = "electron-updater";
    function u() {
      return Kt.session.fromPartition(e.NET_SESSION_NAME, {
        cache: !1
      });
    }
    class a extends t.HttpExecutor {
      constructor(r) {
        super(), this.proxyLoginCallback = r, this.cachedSession = null;
      }
      async download(r, n, s) {
        return await s.cancellationToken.createPromise((i, c, o) => {
          const p = {
            headers: s.headers || void 0,
            redirect: "manual"
          };
          (0, t.configureRequestUrl)(r, p), (0, t.configureRequestOptions)(p), this.doDownload(p, {
            destination: n,
            options: s,
            onCancel: o,
            callback: (h) => {
              h == null ? i(n) : c(h);
            },
            responseHandler: null
          }, 0);
        });
      }
      createRequest(r, n) {
        r.headers && r.headers.Host && (r.host = r.headers.Host, delete r.headers.Host), this.cachedSession == null && (this.cachedSession = u());
        const s = Kt.net.request({
          ...r,
          session: this.cachedSession
        });
        return s.on("response", n), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
      }
      addRedirectHandlers(r, n, s, i, c) {
        r.on("redirect", (o, p, h) => {
          r.abort(), i > this.maxRedirects ? s(this.createMaxRedirectError()) : c(t.HttpExecutor.prepareRedirectUrlOptions(h, n));
        });
      }
    }
    e.ElectronHttpExecutor = a;
  }(Ou)), Ou;
}
var cn = {}, br = {}, Au, Mp;
function cE() {
  if (Mp) return Au;
  Mp = 1;
  var e = "[object Symbol]", t = /[\\^$.*+?()[\]{}|]/g, u = RegExp(t.source), a = typeof Nt == "object" && Nt && Nt.Object === Object && Nt, d = typeof self == "object" && self && self.Object === Object && self, r = a || d || Function("return this")(), n = Object.prototype, s = n.toString, i = r.Symbol, c = i ? i.prototype : void 0, o = c ? c.toString : void 0;
  function p(f) {
    if (typeof f == "string")
      return f;
    if (y(f))
      return o ? o.call(f) : "";
    var m = f + "";
    return m == "0" && 1 / f == -1 / 0 ? "-0" : m;
  }
  function h(f) {
    return !!f && typeof f == "object";
  }
  function y(f) {
    return typeof f == "symbol" || h(f) && s.call(f) == e;
  }
  function $(f) {
    return f == null ? "" : p(f);
  }
  function v(f) {
    return f = $(f), f && u.test(f) ? f.replace(t, "\\$&") : f;
  }
  return Au = v, Au;
}
var xp;
function Rr() {
  if (xp) return br;
  xp = 1, Object.defineProperty(br, "__esModule", { value: !0 }), br.newBaseUrl = u, br.newUrlFromBase = a, br.getChannelFilename = d, br.blockmapFiles = r;
  const e = Br, t = cE();
  function u(n) {
    const s = new e.URL(n);
    return s.pathname.endsWith("/") || (s.pathname += "/"), s;
  }
  function a(n, s, i = !1) {
    const c = new e.URL(n, s), o = s.search;
    return o != null && o.length !== 0 ? c.search = o : i && (c.search = `noCache=${Date.now().toString(32)}`), c;
  }
  function d(n) {
    return `${n}.yml`;
  }
  function r(n, s, i) {
    const c = a(`${n.pathname}.blockmap`, n);
    return [a(`${n.pathname.replace(new RegExp(t(i), "g"), s)}.blockmap`, n), c];
  }
  return br;
}
var zt = {}, Vp;
function St() {
  if (Vp) return zt;
  Vp = 1, Object.defineProperty(zt, "__esModule", { value: !0 }), zt.Provider = void 0, zt.findFile = d, zt.parseUpdateInfo = r, zt.getFileList = n, zt.resolveFiles = s;
  const e = tt(), t = ic(), u = Rr();
  let a = class {
    constructor(c) {
      this.runtimeOptions = c, this.requestHeaders = null, this.executor = c.executor;
    }
    get isUseMultipleRangeRequest() {
      return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
    }
    getChannelFilePrefix() {
      if (this.runtimeOptions.platform === "linux") {
        const c = process.env.TEST_UPDATER_ARCH || process.arch;
        return "-linux" + (c === "x64" ? "" : `-${c}`);
      } else
        return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
    // due to historical reasons for windows we use channel name without platform specifier
    getDefaultChannelName() {
      return this.getCustomChannelName("latest");
    }
    getCustomChannelName(c) {
      return `${c}${this.getChannelFilePrefix()}`;
    }
    get fileExtraDownloadHeaders() {
      return null;
    }
    setRequestHeaders(c) {
      this.requestHeaders = c;
    }
    /**
     * Method to perform API request only to resolve update info, but not to download update.
     */
    httpRequest(c, o, p) {
      return this.executor.request(this.createRequestOptions(c, o), p);
    }
    createRequestOptions(c, o) {
      const p = {};
      return this.requestHeaders == null ? o != null && (p.headers = o) : p.headers = o == null ? this.requestHeaders : { ...this.requestHeaders, ...o }, (0, e.configureRequestUrl)(c, p), p;
    }
  };
  zt.Provider = a;
  function d(i, c, o) {
    if (i.length === 0)
      throw (0, e.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
    const p = i.find((h) => h.url.pathname.toLowerCase().endsWith(`.${c}`));
    return p ?? (o == null ? i[0] : i.find((h) => !o.some((y) => h.url.pathname.toLowerCase().endsWith(`.${y}`))));
  }
  function r(i, c, o) {
    if (i == null)
      throw (0, e.newError)(`Cannot parse update info from ${c} in the latest release artifacts (${o}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    let p;
    try {
      p = (0, t.load)(i);
    } catch (h) {
      throw (0, e.newError)(`Cannot parse update info from ${c} in the latest release artifacts (${o}): ${h.stack || h.message}, rawData: ${i}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    }
    return p;
  }
  function n(i) {
    const c = i.files;
    if (c != null && c.length > 0)
      return c;
    if (i.path != null)
      return [
        {
          url: i.path,
          sha2: i.sha2,
          sha512: i.sha512
        }
      ];
    throw (0, e.newError)(`No files provided: ${(0, e.safeStringifyJson)(i)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  function s(i, c, o = (p) => p) {
    const h = n(i).map((v) => {
      if (v.sha2 == null && v.sha512 == null)
        throw (0, e.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, e.safeStringifyJson)(v)}`, "ERR_UPDATER_NO_CHECKSUM");
      return {
        url: (0, u.newUrlFromBase)(o(v.url), c),
        info: v
      };
    }), y = i.packages, $ = y == null ? null : y[process.arch] || y.ia32;
    return $ != null && (h[0].packageInfo = {
      ...$,
      path: (0, u.newUrlFromBase)(o($.path), c).href
    }), h;
  }
  return zt;
}
var Bp;
function dy() {
  if (Bp) return cn;
  Bp = 1, Object.defineProperty(cn, "__esModule", { value: !0 }), cn.GenericProvider = void 0;
  const e = tt(), t = Rr(), u = St();
  let a = class extends u.Provider {
    constructor(r, n, s) {
      super(s), this.configuration = r, this.updater = n, this.baseUrl = (0, t.newBaseUrl)(this.configuration.url);
    }
    get channel() {
      const r = this.updater.channel || this.configuration.channel;
      return r == null ? this.getDefaultChannelName() : this.getCustomChannelName(r);
    }
    async getLatestVersion() {
      const r = (0, t.getChannelFilename)(this.channel), n = (0, t.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
      for (let s = 0; ; s++)
        try {
          return (0, u.parseUpdateInfo)(await this.httpRequest(n), r, n);
        } catch (i) {
          if (i instanceof e.HttpError && i.statusCode === 404)
            throw (0, e.newError)(`Cannot find channel "${r}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          if (i.code === "ECONNREFUSED" && s < 3) {
            await new Promise((c, o) => {
              try {
                setTimeout(c, 1e3 * s);
              } catch (p) {
                o(p);
              }
            });
            continue;
          }
          throw i;
        }
    }
    resolveFiles(r) {
      return (0, u.resolveFiles)(r, this.baseUrl);
    }
  };
  return cn.GenericProvider = a, cn;
}
var ln = {}, fn = {}, Hp;
function lE() {
  if (Hp) return fn;
  Hp = 1, Object.defineProperty(fn, "__esModule", { value: !0 }), fn.BitbucketProvider = void 0;
  const e = tt(), t = Rr(), u = St();
  let a = class extends u.Provider {
    constructor(r, n, s) {
      super({
        ...s,
        isUseMultipleRangeRequest: !1
      }), this.configuration = r, this.updater = n;
      const { owner: i, slug: c } = r;
      this.baseUrl = (0, t.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${c}/downloads`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "latest";
    }
    async getLatestVersion() {
      const r = new e.CancellationToken(), n = (0, t.getChannelFilename)(this.getCustomChannelName(this.channel)), s = (0, t.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const i = await this.httpRequest(s, void 0, r);
        return (0, u.parseUpdateInfo)(i, n, s);
      } catch (i) {
        throw (0, e.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(r) {
      return (0, u.resolveFiles)(r, this.baseUrl);
    }
    toString() {
      const { owner: r, slug: n } = this.configuration;
      return `Bitbucket (owner: ${r}, slug: ${n}, channel: ${this.channel})`;
    }
  };
  return fn.BitbucketProvider = a, fn;
}
var nr = {}, Gp;
function hy() {
  if (Gp) return nr;
  Gp = 1, Object.defineProperty(nr, "__esModule", { value: !0 }), nr.GitHubProvider = nr.BaseGitHubProvider = void 0, nr.computeReleaseNotes = c;
  const e = tt(), t = Qu(), u = Br, a = Rr(), d = St(), r = /\/tag\/([^/]+)$/;
  class n extends d.Provider {
    constructor(p, h, y) {
      super({
        ...y,
        /* because GitHib uses S3 */
        isUseMultipleRangeRequest: !1
      }), this.options = p, this.baseUrl = (0, a.newBaseUrl)((0, e.githubUrl)(p, h));
      const $ = h === "github.com" ? "api.github.com" : h;
      this.baseApiUrl = (0, a.newBaseUrl)((0, e.githubUrl)(p, $));
    }
    computeGithubBasePath(p) {
      const h = this.options.host;
      return h && !["github.com", "api.github.com"].includes(h) ? `/api/v3${p}` : p;
    }
  }
  nr.BaseGitHubProvider = n;
  let s = class extends n {
    constructor(p, h, y) {
      super(p, "github.com", y), this.options = p, this.updater = h;
    }
    get channel() {
      const p = this.updater.channel || this.options.channel;
      return p == null ? this.getDefaultChannelName() : this.getCustomChannelName(p);
    }
    async getLatestVersion() {
      var p, h, y, $, v;
      const f = new e.CancellationToken(), m = await this.httpRequest((0, a.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
        accept: "application/xml, application/atom+xml, text/xml, */*"
      }, f), l = (0, e.parseXml)(m);
      let g = l.element("entry", !1, "No published versions on GitHub"), b = null;
      try {
        if (this.updater.allowPrerelease) {
          const M = ((p = this.updater) === null || p === void 0 ? void 0 : p.channel) || ((h = t.prerelease(this.updater.currentVersion)) === null || h === void 0 ? void 0 : h[0]) || null;
          if (M === null)
            b = r.exec(g.element("link").attribute("href"))[1];
          else
            for (const F of l.getElements("entry")) {
              const j = r.exec(F.element("link").attribute("href"));
              if (j === null)
                continue;
              const V = j[1], U = ((y = t.prerelease(V)) === null || y === void 0 ? void 0 : y[0]) || null, z = !M || ["alpha", "beta"].includes(M), W = U !== null && !["alpha", "beta"].includes(String(U));
              if (z && !W && !(M === "beta" && U === "alpha")) {
                b = V;
                break;
              }
              if (U && U === M) {
                b = V;
                break;
              }
            }
        } else {
          b = await this.getLatestTagName(f);
          for (const M of l.getElements("entry"))
            if (r.exec(M.element("link").attribute("href"))[1] === b) {
              g = M;
              break;
            }
        }
      } catch (M) {
        throw (0, e.newError)(`Cannot parse releases feed: ${M.stack || M.message},
XML:
${m}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
      }
      if (b == null)
        throw (0, e.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let S, _ = "", w = "";
      const R = async (M) => {
        _ = (0, a.getChannelFilename)(M), w = (0, a.newUrlFromBase)(this.getBaseDownloadPath(String(b), _), this.baseUrl);
        const F = this.createRequestOptions(w);
        try {
          return await this.executor.request(F, f);
        } catch (j) {
          throw j instanceof e.HttpError && j.statusCode === 404 ? (0, e.newError)(`Cannot find ${_} in the latest release artifacts (${w}): ${j.stack || j.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : j;
        }
      };
      try {
        let M = this.channel;
        this.updater.allowPrerelease && (!(($ = t.prerelease(b)) === null || $ === void 0) && $[0]) && (M = this.getCustomChannelName(String((v = t.prerelease(b)) === null || v === void 0 ? void 0 : v[0]))), S = await R(M);
      } catch (M) {
        if (this.updater.allowPrerelease)
          S = await R(this.getDefaultChannelName());
        else
          throw M;
      }
      const T = (0, d.parseUpdateInfo)(S, _, w);
      return T.releaseName == null && (T.releaseName = g.elementValueOrEmpty("title")), T.releaseNotes == null && (T.releaseNotes = c(this.updater.currentVersion, this.updater.fullChangelog, l, g)), {
        tag: b,
        ...T
      };
    }
    async getLatestTagName(p) {
      const h = this.options, y = h.host == null || h.host === "github.com" ? (0, a.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new u.URL(`${this.computeGithubBasePath(`/repos/${h.owner}/${h.repo}/releases`)}/latest`, this.baseApiUrl);
      try {
        const $ = await this.httpRequest(y, { Accept: "application/json" }, p);
        return $ == null ? null : JSON.parse($).tag_name;
      } catch ($) {
        throw (0, e.newError)(`Unable to find latest version on GitHub (${y}), please ensure a production release exists: ${$.stack || $.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return `/${this.options.owner}/${this.options.repo}/releases`;
    }
    resolveFiles(p) {
      return (0, d.resolveFiles)(p, this.baseUrl, (h) => this.getBaseDownloadPath(p.tag, h.replace(/ /g, "-")));
    }
    getBaseDownloadPath(p, h) {
      return `${this.basePath}/download/${p}/${h}`;
    }
  };
  nr.GitHubProvider = s;
  function i(o) {
    const p = o.elementValueOrEmpty("content");
    return p === "No content." ? "" : p;
  }
  function c(o, p, h, y) {
    if (!p)
      return i(y);
    const $ = [];
    for (const v of h.getElements("entry")) {
      const f = /\/tag\/v?([^/]+)$/.exec(v.element("link").attribute("href"))[1];
      t.lt(o, f) && $.push({
        version: f,
        note: i(v)
      });
    }
    return $.sort((v, f) => t.rcompare(v.version, f.version));
  }
  return nr;
}
var dn = {}, zp;
function fE() {
  if (zp) return dn;
  zp = 1, Object.defineProperty(dn, "__esModule", { value: !0 }), dn.KeygenProvider = void 0;
  const e = tt(), t = Rr(), u = St();
  let a = class extends u.Provider {
    constructor(r, n, s) {
      super({
        ...s,
        isUseMultipleRangeRequest: !1
      }), this.configuration = r, this.updater = n, this.defaultHostname = "api.keygen.sh";
      const i = this.configuration.host || this.defaultHostname;
      this.baseUrl = (0, t.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "stable";
    }
    async getLatestVersion() {
      const r = new e.CancellationToken(), n = (0, t.getChannelFilename)(this.getCustomChannelName(this.channel)), s = (0, t.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const i = await this.httpRequest(s, {
          Accept: "application/vnd.api+json",
          "Keygen-Version": "1.1"
        }, r);
        return (0, u.parseUpdateInfo)(i, n, s);
      } catch (i) {
        throw (0, e.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(r) {
      return (0, u.resolveFiles)(r, this.baseUrl);
    }
    toString() {
      const { account: r, product: n, platform: s } = this.configuration;
      return `Keygen (account: ${r}, product: ${n}, platform: ${s}, channel: ${this.channel})`;
    }
  };
  return dn.KeygenProvider = a, dn;
}
var hn = {}, Kp;
function dE() {
  if (Kp) return hn;
  Kp = 1, Object.defineProperty(hn, "__esModule", { value: !0 }), hn.PrivateGitHubProvider = void 0;
  const e = tt(), t = ic(), u = Ge, a = Br, d = Rr(), r = hy(), n = St();
  let s = class extends r.BaseGitHubProvider {
    constructor(c, o, p, h) {
      super(c, "api.github.com", h), this.updater = o, this.token = p;
    }
    createRequestOptions(c, o) {
      const p = super.createRequestOptions(c, o);
      return p.redirect = "manual", p;
    }
    async getLatestVersion() {
      const c = new e.CancellationToken(), o = (0, d.getChannelFilename)(this.getDefaultChannelName()), p = await this.getLatestVersionInfo(c), h = p.assets.find((v) => v.name === o);
      if (h == null)
        throw (0, e.newError)(`Cannot find ${o} in the release ${p.html_url || p.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      const y = new a.URL(h.url);
      let $;
      try {
        $ = (0, t.load)(await this.httpRequest(y, this.configureHeaders("application/octet-stream"), c));
      } catch (v) {
        throw v instanceof e.HttpError && v.statusCode === 404 ? (0, e.newError)(`Cannot find ${o} in the latest release artifacts (${y}): ${v.stack || v.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : v;
      }
      return $.assets = p.assets, $;
    }
    get fileExtraDownloadHeaders() {
      return this.configureHeaders("application/octet-stream");
    }
    configureHeaders(c) {
      return {
        accept: c,
        authorization: `token ${this.token}`
      };
    }
    async getLatestVersionInfo(c) {
      const o = this.updater.allowPrerelease;
      let p = this.basePath;
      o || (p = `${p}/latest`);
      const h = (0, d.newUrlFromBase)(p, this.baseUrl);
      try {
        const y = JSON.parse(await this.httpRequest(h, this.configureHeaders("application/vnd.github.v3+json"), c));
        return o ? y.find(($) => $.prerelease) || y[0] : y;
      } catch (y) {
        throw (0, e.newError)(`Unable to find latest version on GitHub (${h}), please ensure a production release exists: ${y.stack || y.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
    }
    resolveFiles(c) {
      return (0, n.getFileList)(c).map((o) => {
        const p = u.posix.basename(o.url).replace(/ /g, "-"), h = c.assets.find((y) => y != null && y.name === p);
        if (h == null)
          throw (0, e.newError)(`Cannot find asset "${p}" in: ${JSON.stringify(c.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new a.URL(h.url),
          info: o
        };
      });
    }
  };
  return hn.PrivateGitHubProvider = s, hn;
}
var Wp;
function hE() {
  if (Wp) return ln;
  Wp = 1, Object.defineProperty(ln, "__esModule", { value: !0 }), ln.isUrlProbablySupportMultiRangeRequests = n, ln.createClient = s;
  const e = tt(), t = lE(), u = dy(), a = hy(), d = fE(), r = dE();
  function n(i) {
    return !i.includes("s3.amazonaws.com");
  }
  function s(i, c, o) {
    if (typeof i == "string")
      throw (0, e.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
    const p = i.provider;
    switch (p) {
      case "github": {
        const h = i, y = (h.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || h.token;
        return y == null ? new a.GitHubProvider(h, c, o) : new r.PrivateGitHubProvider(h, c, y, o);
      }
      case "bitbucket":
        return new t.BitbucketProvider(i, c, o);
      case "keygen":
        return new d.KeygenProvider(i, c, o);
      case "s3":
      case "spaces":
        return new u.GenericProvider({
          provider: "generic",
          url: (0, e.getS3LikeProviderBaseUrl)(i),
          channel: i.channel || null
        }, c, {
          ...o,
          // https://github.com/minio/minio/issues/5285#issuecomment-350428955
          isUseMultipleRangeRequest: !1
        });
      case "generic": {
        const h = i;
        return new u.GenericProvider(h, c, {
          ...o,
          isUseMultipleRangeRequest: h.useMultipleRangeRequest !== !1 && n(h.url)
        });
      }
      case "custom": {
        const h = i, y = h.updateProvider;
        if (!y)
          throw (0, e.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
        return new y(h, c, o);
      }
      default:
        throw (0, e.newError)(`Unsupported provider: ${p}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
    }
  }
  return ln;
}
var pn = {}, mn = {}, Mr = {}, xr = {}, Yp;
function ac() {
  if (Yp) return xr;
  Yp = 1, Object.defineProperty(xr, "__esModule", { value: !0 }), xr.OperationKind = void 0, xr.computeOperations = t;
  var e;
  (function(n) {
    n[n.COPY = 0] = "COPY", n[n.DOWNLOAD = 1] = "DOWNLOAD";
  })(e || (xr.OperationKind = e = {}));
  function t(n, s, i) {
    const c = r(n.files), o = r(s.files);
    let p = null;
    const h = s.files[0], y = [], $ = h.name, v = c.get($);
    if (v == null)
      throw new Error(`no file ${$} in old blockmap`);
    const f = o.get($);
    let m = 0;
    const { checksumToOffset: l, checksumToOldSize: g } = d(c.get($), v.offset, i);
    let b = h.offset;
    for (let S = 0; S < f.checksums.length; b += f.sizes[S], S++) {
      const _ = f.sizes[S], w = f.checksums[S];
      let R = l.get(w);
      R != null && g.get(w) !== _ && (i.warn(`Checksum ("${w}") matches, but size differs (old: ${g.get(w)}, new: ${_})`), R = void 0), R === void 0 ? (m++, p != null && p.kind === e.DOWNLOAD && p.end === b ? p.end += _ : (p = {
        kind: e.DOWNLOAD,
        start: b,
        end: b + _
        // oldBlocks: null,
      }, a(p, y, w, S))) : p != null && p.kind === e.COPY && p.end === R ? p.end += _ : (p = {
        kind: e.COPY,
        start: R,
        end: R + _
        // oldBlocks: [checksum]
      }, a(p, y, w, S));
    }
    return m > 0 && i.info(`File${h.name === "file" ? "" : " " + h.name} has ${m} changed blocks`), y;
  }
  const u = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
  function a(n, s, i, c) {
    if (u && s.length !== 0) {
      const o = s[s.length - 1];
      if (o.kind === n.kind && n.start < o.end && n.start > o.start) {
        const p = [o.start, o.end, n.start, n.end].reduce((h, y) => h < y ? h : y);
        throw new Error(`operation (block index: ${c}, checksum: ${i}, kind: ${e[n.kind]}) overlaps previous operation (checksum: ${i}):
abs: ${o.start} until ${o.end} and ${n.start} until ${n.end}
rel: ${o.start - p} until ${o.end - p} and ${n.start - p} until ${n.end - p}`);
      }
    }
    s.push(n);
  }
  function d(n, s, i) {
    const c = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
    let p = s;
    for (let h = 0; h < n.checksums.length; h++) {
      const y = n.checksums[h], $ = n.sizes[h], v = o.get(y);
      if (v === void 0)
        c.set(y, p), o.set(y, $);
      else if (i.debug != null) {
        const f = v === $ ? "(same size)" : `(size: ${v}, this size: ${$})`;
        i.debug(`${y} duplicated in blockmap ${f}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
      }
      p += $;
    }
    return { checksumToOffset: c, checksumToOldSize: o };
  }
  function r(n) {
    const s = /* @__PURE__ */ new Map();
    for (const i of n)
      s.set(i.name, i);
    return s;
  }
  return xr;
}
var Jp;
function py() {
  if (Jp) return Mr;
  Jp = 1, Object.defineProperty(Mr, "__esModule", { value: !0 }), Mr.DataSplitter = void 0, Mr.copyData = n;
  const e = tt(), t = ar, u = Rn, a = ac(), d = Buffer.from(`\r
\r
`);
  var r;
  (function(i) {
    i[i.INIT = 0] = "INIT", i[i.HEADER = 1] = "HEADER", i[i.BODY = 2] = "BODY";
  })(r || (r = {}));
  function n(i, c, o, p, h) {
    const y = (0, t.createReadStream)("", {
      fd: o,
      autoClose: !1,
      start: i.start,
      // end is inclusive
      end: i.end - 1
    });
    y.on("error", p), y.once("end", h), y.pipe(c, {
      end: !1
    });
  }
  let s = class extends u.Writable {
    constructor(c, o, p, h, y, $) {
      super(), this.out = c, this.options = o, this.partIndexToTaskIndex = p, this.partIndexToLength = y, this.finishHandler = $, this.partIndex = -1, this.headerListBuffer = null, this.readState = r.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = h.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
    }
    get isFinished() {
      return this.partIndex === this.partIndexToLength.length;
    }
    // noinspection JSUnusedGlobalSymbols
    _write(c, o, p) {
      if (this.isFinished) {
        console.error(`Trailing ignored data: ${c.length} bytes`);
        return;
      }
      this.handleData(c).then(p).catch(p);
    }
    async handleData(c) {
      let o = 0;
      if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
        throw (0, e.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
      if (this.ignoreByteCount > 0) {
        const p = Math.min(this.ignoreByteCount, c.length);
        this.ignoreByteCount -= p, o = p;
      } else if (this.remainingPartDataCount > 0) {
        const p = Math.min(this.remainingPartDataCount, c.length);
        this.remainingPartDataCount -= p, await this.processPartData(c, 0, p), o = p;
      }
      if (o !== c.length) {
        if (this.readState === r.HEADER) {
          const p = this.searchHeaderListEnd(c, o);
          if (p === -1)
            return;
          o = p, this.readState = r.BODY, this.headerListBuffer = null;
        }
        for (; ; ) {
          if (this.readState === r.BODY)
            this.readState = r.INIT;
          else {
            this.partIndex++;
            let $ = this.partIndexToTaskIndex.get(this.partIndex);
            if ($ == null)
              if (this.isFinished)
                $ = this.options.end;
              else
                throw (0, e.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
            const v = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
            if (v < $)
              await this.copyExistingData(v, $);
            else if (v > $)
              throw (0, e.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
            if (this.isFinished) {
              this.onPartEnd(), this.finishHandler();
              return;
            }
            if (o = this.searchHeaderListEnd(c, o), o === -1) {
              this.readState = r.HEADER;
              return;
            }
          }
          const p = this.partIndexToLength[this.partIndex], h = o + p, y = Math.min(h, c.length);
          if (await this.processPartStarted(c, o, y), this.remainingPartDataCount = p - (y - o), this.remainingPartDataCount > 0)
            return;
          if (o = h + this.boundaryLength, o >= c.length) {
            this.ignoreByteCount = this.boundaryLength - (c.length - h);
            return;
          }
        }
      }
    }
    copyExistingData(c, o) {
      return new Promise((p, h) => {
        const y = () => {
          if (c === o) {
            p();
            return;
          }
          const $ = this.options.tasks[c];
          if ($.kind !== a.OperationKind.COPY) {
            h(new Error("Task kind must be COPY"));
            return;
          }
          n($, this.out, this.options.oldFileFd, h, () => {
            c++, y();
          });
        };
        y();
      });
    }
    searchHeaderListEnd(c, o) {
      const p = c.indexOf(d, o);
      if (p !== -1)
        return p + d.length;
      const h = o === 0 ? c : c.slice(o);
      return this.headerListBuffer == null ? this.headerListBuffer = h : this.headerListBuffer = Buffer.concat([this.headerListBuffer, h]), -1;
    }
    onPartEnd() {
      const c = this.partIndexToLength[this.partIndex - 1];
      if (this.actualPartLength !== c)
        throw (0, e.newError)(`Expected length: ${c} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
      this.actualPartLength = 0;
    }
    processPartStarted(c, o, p) {
      return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(c, o, p);
    }
    processPartData(c, o, p) {
      this.actualPartLength += p - o;
      const h = this.out;
      return h.write(o === 0 && c.length === p ? c : c.slice(o, p)) ? Promise.resolve() : new Promise((y, $) => {
        h.on("error", $), h.once("drain", () => {
          h.removeListener("error", $), y();
        });
      });
    }
  };
  return Mr.DataSplitter = s, Mr;
}
var yn = {}, Xp;
function pE() {
  if (Xp) return yn;
  Xp = 1, Object.defineProperty(yn, "__esModule", { value: !0 }), yn.executeTasksUsingMultipleRangeRequests = a, yn.checkIsRangesSupported = r;
  const e = tt(), t = py(), u = ac();
  function a(n, s, i, c, o) {
    const p = (h) => {
      if (h >= s.length) {
        n.fileMetadataBuffer != null && i.write(n.fileMetadataBuffer), i.end();
        return;
      }
      const y = h + 1e3;
      d(n, {
        tasks: s,
        start: h,
        end: Math.min(s.length, y),
        oldFileFd: c
      }, i, () => p(y), o);
    };
    return p;
  }
  function d(n, s, i, c, o) {
    let p = "bytes=", h = 0;
    const y = /* @__PURE__ */ new Map(), $ = [];
    for (let m = s.start; m < s.end; m++) {
      const l = s.tasks[m];
      l.kind === u.OperationKind.DOWNLOAD && (p += `${l.start}-${l.end - 1}, `, y.set(h, m), h++, $.push(l.end - l.start));
    }
    if (h <= 1) {
      const m = (l) => {
        if (l >= s.end) {
          c();
          return;
        }
        const g = s.tasks[l++];
        if (g.kind === u.OperationKind.COPY)
          (0, t.copyData)(g, i, s.oldFileFd, o, () => m(l));
        else {
          const b = n.createRequestOptions();
          b.headers.Range = `bytes=${g.start}-${g.end - 1}`;
          const S = n.httpExecutor.createRequest(b, (_) => {
            r(_, o) && (_.pipe(i, {
              end: !1
            }), _.once("end", () => m(l)));
          });
          n.httpExecutor.addErrorAndTimeoutHandlers(S, o), S.end();
        }
      };
      m(s.start);
      return;
    }
    const v = n.createRequestOptions();
    v.headers.Range = p.substring(0, p.length - 2);
    const f = n.httpExecutor.createRequest(v, (m) => {
      if (!r(m, o))
        return;
      const l = (0, e.safeGetHeader)(m, "content-type"), g = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(l);
      if (g == null) {
        o(new Error(`Content-Type "multipart/byteranges" is expected, but got "${l}"`));
        return;
      }
      const b = new t.DataSplitter(i, s, y, g[1] || g[2], $, c);
      b.on("error", o), m.pipe(b), m.on("end", () => {
        setTimeout(() => {
          f.abort(), o(new Error("Response ends without calling any handlers"));
        }, 1e4);
      });
    });
    n.httpExecutor.addErrorAndTimeoutHandlers(f, o), f.end();
  }
  function r(n, s) {
    if (n.statusCode >= 400)
      return s((0, e.createHttpError)(n)), !1;
    if (n.statusCode !== 206) {
      const i = (0, e.safeGetHeader)(n, "accept-ranges");
      if (i == null || i === "none")
        return s(new Error(`Server doesn't support Accept-Ranges (response code ${n.statusCode})`)), !1;
    }
    return !0;
  }
  return yn;
}
var gn = {}, Qp;
function mE() {
  if (Qp) return gn;
  Qp = 1, Object.defineProperty(gn, "__esModule", { value: !0 }), gn.ProgressDifferentialDownloadCallbackTransform = void 0;
  const e = Rn;
  var t;
  (function(a) {
    a[a.COPY = 0] = "COPY", a[a.DOWNLOAD = 1] = "DOWNLOAD";
  })(t || (t = {}));
  let u = class extends e.Transform {
    constructor(d, r, n) {
      super(), this.progressDifferentialDownloadInfo = d, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = t.COPY, this.nextUpdate = this.start + 1e3;
    }
    _transform(d, r, n) {
      if (this.cancellationToken.cancelled) {
        n(new Error("cancelled"), null);
        return;
      }
      if (this.operationType == t.COPY) {
        n(null, d);
        return;
      }
      this.transferred += d.length, this.delta += d.length;
      const s = Date.now();
      s >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = s + 1e3, this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((s - this.start) / 1e3))
      }), this.delta = 0), n(null, d);
    }
    beginFileCopy() {
      this.operationType = t.COPY;
    }
    beginRangeDownload() {
      this.operationType = t.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
    }
    endRangeDownload() {
      this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      });
    }
    // Called when we are 100% done with the connection/download
    _flush(d) {
      if (this.cancellationToken.cancelled) {
        d(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, this.transferred = 0, d(null);
    }
  };
  return gn.ProgressDifferentialDownloadCallbackTransform = u, gn;
}
var Zp;
function my() {
  if (Zp) return mn;
  Zp = 1, Object.defineProperty(mn, "__esModule", { value: !0 }), mn.DifferentialDownloader = void 0;
  const e = tt(), t = /* @__PURE__ */ sr(), u = ar, a = py(), d = Br, r = ac(), n = pE(), s = mE();
  let i = class {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(h, y, $) {
      this.blockAwareFileInfo = h, this.httpExecutor = y, this.options = $, this.fileMetadataBuffer = null, this.logger = $.logger;
    }
    createRequestOptions() {
      const h = {
        headers: {
          ...this.options.requestHeaders,
          accept: "*/*"
        }
      };
      return (0, e.configureRequestUrl)(this.options.newUrl, h), (0, e.configureRequestOptions)(h), h;
    }
    doDownload(h, y) {
      if (h.version !== y.version)
        throw new Error(`version is different (${h.version} - ${y.version}), full download is required`);
      const $ = this.logger, v = (0, r.computeOperations)(h, y, $);
      $.debug != null && $.debug(JSON.stringify(v, null, 2));
      let f = 0, m = 0;
      for (const g of v) {
        const b = g.end - g.start;
        g.kind === r.OperationKind.DOWNLOAD ? f += b : m += b;
      }
      const l = this.blockAwareFileInfo.size;
      if (f + m + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== l)
        throw new Error(`Internal error, size mismatch: downloadSize: ${f}, copySize: ${m}, newSize: ${l}`);
      return $.info(`Full: ${c(l)}, To download: ${c(f)} (${Math.round(f / (l / 100))}%)`), this.downloadFile(v);
    }
    downloadFile(h) {
      const y = [], $ = () => Promise.all(y.map((v) => (0, t.close)(v.descriptor).catch((f) => {
        this.logger.error(`cannot close file "${v.path}": ${f}`);
      })));
      return this.doDownloadFile(h, y).then($).catch((v) => $().catch((f) => {
        try {
          this.logger.error(`cannot close files: ${f}`);
        } catch (m) {
          try {
            console.error(m);
          } catch {
          }
        }
        throw v;
      }).then(() => {
        throw v;
      }));
    }
    async doDownloadFile(h, y) {
      const $ = await (0, t.open)(this.options.oldFile, "r");
      y.push({ descriptor: $, path: this.options.oldFile });
      const v = await (0, t.open)(this.options.newFile, "w");
      y.push({ descriptor: v, path: this.options.newFile });
      const f = (0, u.createWriteStream)(this.options.newFile, { fd: v });
      await new Promise((m, l) => {
        const g = [];
        let b;
        if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
          const j = [];
          let V = 0;
          for (const z of h)
            z.kind === r.OperationKind.DOWNLOAD && (j.push(z.end - z.start), V += z.end - z.start);
          const U = {
            expectedByteCounts: j,
            grandTotal: V
          };
          b = new s.ProgressDifferentialDownloadCallbackTransform(U, this.options.cancellationToken, this.options.onProgress), g.push(b);
        }
        const S = new e.DigestTransform(this.blockAwareFileInfo.sha512);
        S.isValidateOnEnd = !1, g.push(S), f.on("finish", () => {
          f.close(() => {
            y.splice(1, 1);
            try {
              S.validate();
            } catch (j) {
              l(j);
              return;
            }
            m(void 0);
          });
        }), g.push(f);
        let _ = null;
        for (const j of g)
          j.on("error", l), _ == null ? _ = j : _ = _.pipe(j);
        const w = g[0];
        let R;
        if (this.options.isUseMultipleRangeRequest) {
          R = (0, n.executeTasksUsingMultipleRangeRequests)(this, h, w, $, l), R(0);
          return;
        }
        let T = 0, M = null;
        this.logger.info(`Differential download: ${this.options.newUrl}`);
        const F = this.createRequestOptions();
        F.redirect = "manual", R = (j) => {
          var V, U;
          if (j >= h.length) {
            this.fileMetadataBuffer != null && w.write(this.fileMetadataBuffer), w.end();
            return;
          }
          const z = h[j++];
          if (z.kind === r.OperationKind.COPY) {
            b && b.beginFileCopy(), (0, a.copyData)(z, w, $, l, () => R(j));
            return;
          }
          const W = `bytes=${z.start}-${z.end - 1}`;
          F.headers.range = W, (U = (V = this.logger) === null || V === void 0 ? void 0 : V.debug) === null || U === void 0 || U.call(V, `download range: ${W}`), b && b.beginRangeDownload();
          const Q = this.httpExecutor.createRequest(F, (ee) => {
            ee.on("error", l), ee.on("aborted", () => {
              l(new Error("response has been aborted by the server"));
            }), ee.statusCode >= 400 && l((0, e.createHttpError)(ee)), ee.pipe(w, {
              end: !1
            }), ee.once("end", () => {
              b && b.endRangeDownload(), ++T === 100 ? (T = 0, setTimeout(() => R(j), 1e3)) : R(j);
            });
          });
          Q.on("redirect", (ee, ne, K) => {
            this.logger.info(`Redirect to ${o(K)}`), M = K, (0, e.configureRequestUrl)(new d.URL(M), F), Q.followRedirect();
          }), this.httpExecutor.addErrorAndTimeoutHandlers(Q, l), Q.end();
        }, R(0);
      });
    }
    async readRemoteBytes(h, y) {
      const $ = Buffer.allocUnsafe(y + 1 - h), v = this.createRequestOptions();
      v.headers.range = `bytes=${h}-${y}`;
      let f = 0;
      if (await this.request(v, (m) => {
        m.copy($, f), f += m.length;
      }), f !== $.length)
        throw new Error(`Received data length ${f} is not equal to expected ${$.length}`);
      return $;
    }
    request(h, y) {
      return new Promise(($, v) => {
        const f = this.httpExecutor.createRequest(h, (m) => {
          (0, n.checkIsRangesSupported)(m, v) && (m.on("error", v), m.on("aborted", () => {
            v(new Error("response has been aborted by the server"));
          }), m.on("data", y), m.on("end", () => $()));
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(f, v), f.end();
      });
    }
  };
  mn.DifferentialDownloader = i;
  function c(p, h = " KB") {
    return new Intl.NumberFormat("en").format((p / 1024).toFixed(2)) + h;
  }
  function o(p) {
    const h = p.indexOf("?");
    return h < 0 ? p : p.substring(0, h);
  }
  return mn;
}
var em;
function yE() {
  if (em) return pn;
  em = 1, Object.defineProperty(pn, "__esModule", { value: !0 }), pn.GenericDifferentialDownloader = void 0;
  const e = my();
  let t = class extends e.DifferentialDownloader {
    download(a, d) {
      return this.doDownload(a, d);
    }
  };
  return pn.GenericDifferentialDownloader = t, pn;
}
var Nu = {}, tm;
function Tr() {
  return tm || (tm = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = a;
    const t = tt();
    Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
      return t.CancellationToken;
    } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
    class u {
      constructor(r) {
        this.emitter = r;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(r) {
        a(this.emitter, "login", r);
      }
      progress(r) {
        a(this.emitter, e.DOWNLOAD_PROGRESS, r);
      }
      updateDownloaded(r) {
        a(this.emitter, e.UPDATE_DOWNLOADED, r);
      }
      updateCancelled(r) {
        a(this.emitter, "update-cancelled", r);
      }
    }
    e.UpdaterSignal = u;
    function a(d, r, n) {
      d.on(r, n);
    }
  }(Nu)), Nu;
}
var rm;
function oc() {
  if (rm) return $r;
  rm = 1, Object.defineProperty($r, "__esModule", { value: !0 }), $r.NoOpLogger = $r.AppUpdater = void 0;
  const e = tt(), t = On, u = Ma, a = wm, d = /* @__PURE__ */ sr(), r = ic(), n = nE(), s = Ge, i = Qu(), c = aE(), o = sE(), p = uE(), h = dy(), y = hE(), $ = bm, v = Rr(), f = yE(), m = Tr();
  let l = class yy extends a.EventEmitter {
    /**
     * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
     */
    get channel() {
      return this._channel;
    }
    /**
     * Set the update channel. Overrides `channel` in the update configuration.
     *
     * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
     */
    set channel(_) {
      if (this._channel != null) {
        if (typeof _ != "string")
          throw (0, e.newError)(`Channel must be a string, but got: ${_}`, "ERR_UPDATER_INVALID_CHANNEL");
        if (_.length === 0)
          throw (0, e.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
      }
      this._channel = _, this.allowDowngrade = !0;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(_) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: _
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, p.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(_) {
      this._logger = _ ?? new b();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(_) {
      this.clientPromise = null, this._appUpdateConfigPath = _, this.configOnDisk = new n.Lazy(() => this.loadUpdateConfig());
    }
    /**
     * Allows developer to override default logic for determining if an update is supported.
     * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
     */
    get isUpdateSupported() {
      return this._isUpdateSupported;
    }
    set isUpdateSupported(_) {
      _ && (this._isUpdateSupported = _);
    }
    constructor(_, w) {
      super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new m.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (M) => this.checkIfUpdateSupported(M), this.clientPromise = null, this.stagingUserIdPromise = new n.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new n.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (M) => {
        this._logger.error(`Error: ${M.stack || M.message}`);
      }), w == null ? (this.app = new o.ElectronAppAdapter(), this.httpExecutor = new p.ElectronHttpExecutor((M, F) => this.emit("login", M, F))) : (this.app = w, this.httpExecutor = null);
      const R = this.app.version, T = (0, i.parse)(R);
      if (T == null)
        throw (0, e.newError)(`App version is not a valid semver version: "${R}"`, "ERR_UPDATER_INVALID_VERSION");
      this.currentVersion = T, this.allowPrerelease = g(T), _ != null && (this.setFeedURL(_), typeof _ != "string" && _.requestHeaders && (this.requestHeaders = _.requestHeaders));
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(_) {
      const w = this.createProviderRuntimeOptions();
      let R;
      typeof _ == "string" ? R = new h.GenericProvider({ provider: "generic", url: _ }, this, {
        ...w,
        isUseMultipleRangeRequest: (0, y.isUrlProbablySupportMultiRangeRequests)(_)
      }) : R = (0, y.createClient)(_, this, w), this.clientPromise = Promise.resolve(R);
    }
    /**
     * Asks the server whether there is an update.
     * @returns null if the updater is disabled, otherwise info about the latest version
     */
    checkForUpdates() {
      if (!this.isUpdaterActive())
        return Promise.resolve(null);
      let _ = this.checkForUpdatesPromise;
      if (_ != null)
        return this._logger.info("Checking for update (already in progress)"), _;
      const w = () => this.checkForUpdatesPromise = null;
      return this._logger.info("Checking for update"), _ = this.doCheckForUpdates().then((R) => (w(), R)).catch((R) => {
        throw w(), this.emit("error", R, `Cannot check for updates: ${(R.stack || R).toString()}`), R;
      }), this.checkForUpdatesPromise = _, _;
    }
    isUpdaterActive() {
      return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(_) {
      return this.checkForUpdates().then((w) => w?.downloadPromise ? (w.downloadPromise.then(() => {
        const R = yy.formatDownloadNotification(w.updateInfo.version, this.app.name, _);
        new Kt.Notification(R).show();
      }), w) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), w));
    }
    static formatDownloadNotification(_, w, R) {
      return R == null && (R = {
        title: "A new update is ready to install",
        body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
      }), R = {
        title: R.title.replace("{appName}", w).replace("{version}", _),
        body: R.body.replace("{appName}", w).replace("{version}", _)
      }, R;
    }
    async isStagingMatch(_) {
      const w = _.stagingPercentage;
      let R = w;
      if (R == null)
        return !0;
      if (R = parseInt(R, 10), isNaN(R))
        return this._logger.warn(`Staging percentage is NaN: ${w}`), !0;
      R = R / 100;
      const T = await this.stagingUserIdPromise.value, F = e.UUID.parse(T).readUInt32BE(12) / 4294967295;
      return this._logger.info(`Staging percentage: ${R}, percentage: ${F}, user id: ${T}`), F < R;
    }
    computeFinalHeaders(_) {
      return this.requestHeaders != null && Object.assign(_, this.requestHeaders), _;
    }
    async isUpdateAvailable(_) {
      const w = (0, i.parse)(_.version);
      if (w == null)
        throw (0, e.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${_.version}"`, "ERR_UPDATER_INVALID_VERSION");
      const R = this.currentVersion;
      if ((0, i.eq)(w, R) || !await Promise.resolve(this.isUpdateSupported(_)) || !await this.isStagingMatch(_))
        return !1;
      const M = (0, i.gt)(w, R), F = (0, i.lt)(w, R);
      return M ? !0 : this.allowDowngrade && F;
    }
    checkIfUpdateSupported(_) {
      const w = _?.minimumSystemVersion, R = (0, u.release)();
      if (w)
        try {
          if ((0, i.lt)(R, w))
            return this._logger.info(`Current OS version ${R} is less than the minimum OS version required ${w} for version ${R}`), !1;
        } catch (T) {
          this._logger.warn(`Failed to compare current OS version(${R}) with minimum OS version(${w}): ${(T.message || T).toString()}`);
        }
      return !0;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((R) => (0, y.createClient)(R, this, this.createProviderRuntimeOptions())));
      const _ = await this.clientPromise, w = await this.stagingUserIdPromise.value;
      return _.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": w })), {
        info: await _.getLatestVersion(),
        provider: _
      };
    }
    createProviderRuntimeOptions() {
      return {
        isUseMultipleRangeRequest: !0,
        platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
        executor: this.httpExecutor
      };
    }
    async doCheckForUpdates() {
      this.emit("checking-for-update");
      const _ = await this.getUpdateInfoAndProvider(), w = _.info;
      if (!await this.isUpdateAvailable(w))
        return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${w.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", w), {
          isUpdateAvailable: !1,
          versionInfo: w,
          updateInfo: w
        };
      this.updateInfoAndProvider = _, this.onUpdateAvailable(w);
      const R = new e.CancellationToken();
      return {
        isUpdateAvailable: !0,
        versionInfo: w,
        updateInfo: w,
        cancellationToken: R,
        downloadPromise: this.autoDownload ? this.downloadUpdate(R) : null
      };
    }
    onUpdateAvailable(_) {
      this._logger.info(`Found version ${_.version} (url: ${(0, e.asArray)(_.files).map((w) => w.url).join(", ")})`), this.emit("update-available", _);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(_ = new e.CancellationToken()) {
      const w = this.updateInfoAndProvider;
      if (w == null) {
        const T = new Error("Please check update first");
        return this.dispatchError(T), Promise.reject(T);
      }
      if (this.downloadPromise != null)
        return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
      this._logger.info(`Downloading update from ${(0, e.asArray)(w.info.files).map((T) => T.url).join(", ")}`);
      const R = (T) => {
        if (!(T instanceof e.CancellationError))
          try {
            this.dispatchError(T);
          } catch (M) {
            this._logger.warn(`Cannot dispatch error event: ${M.stack || M}`);
          }
        return T;
      };
      return this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider: w,
        requestHeaders: this.computeRequestHeaders(w.provider),
        cancellationToken: _,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((T) => {
        throw R(T);
      }).finally(() => {
        this.downloadPromise = null;
      }), this.downloadPromise;
    }
    dispatchError(_) {
      this.emit("error", _, (_.stack || _).toString());
    }
    dispatchUpdateDownloaded(_) {
      this.emit(m.UPDATE_DOWNLOADED, _);
    }
    async loadUpdateConfig() {
      return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, r.load)(await (0, d.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(_) {
      const w = _.fileExtraDownloadHeaders;
      if (w != null) {
        const R = this.requestHeaders;
        return R == null ? w : {
          ...w,
          ...R
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const _ = s.join(this.app.userDataPath, ".updaterId");
      try {
        const R = await (0, d.readFile)(_, "utf-8");
        if (e.UUID.check(R))
          return R;
        this._logger.warn(`Staging user id file exists, but content was invalid: ${R}`);
      } catch (R) {
        R.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${R}`);
      }
      const w = e.UUID.v5((0, t.randomBytes)(4096), e.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${w}`);
      try {
        await (0, d.outputFile)(_, w);
      } catch (R) {
        this._logger.warn(`Couldn't write out staging user ID: ${R}`);
      }
      return w;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const _ = this.requestHeaders;
      if (_ == null)
        return !0;
      for (const w of Object.keys(_)) {
        const R = w.toLowerCase();
        if (R === "authorization" || R === "private-token")
          return !1;
      }
      return !0;
    }
    async getOrCreateDownloadHelper() {
      let _ = this.downloadedUpdateHelper;
      if (_ == null) {
        const w = (await this.configOnDisk.value).updaterCacheDirName, R = this._logger;
        w == null && R.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        const T = s.join(this.app.baseCachePath, w || this.app.name);
        R.debug != null && R.debug(`updater cache dir: ${T}`), _ = new c.DownloadedUpdateHelper(T), this.downloadedUpdateHelper = _;
      }
      return _;
    }
    async executeDownload(_) {
      const w = _.fileInfo, R = {
        headers: _.downloadUpdateOptions.requestHeaders,
        cancellationToken: _.downloadUpdateOptions.cancellationToken,
        sha2: w.info.sha2,
        sha512: w.info.sha512
      };
      this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (R.onProgress = (D) => this.emit(m.DOWNLOAD_PROGRESS, D));
      const T = _.downloadUpdateOptions.updateInfoAndProvider.info, M = T.version, F = w.packageInfo;
      function j() {
        const D = decodeURIComponent(_.fileInfo.url.pathname);
        return D.endsWith(`.${_.fileExtension}`) ? s.basename(D) : _.fileInfo.info.url;
      }
      const V = await this.getOrCreateDownloadHelper(), U = V.cacheDirForPendingUpdate;
      await (0, d.mkdir)(U, { recursive: !0 });
      const z = j();
      let W = s.join(U, z);
      const Q = F == null ? null : s.join(U, `package-${M}${s.extname(F.path) || ".7z"}`), ee = async (D) => (await V.setDownloadedFile(W, Q, T, w, z, D), await _.done({
        ...T,
        downloadedFile: W
      }), Q == null ? [W] : [W, Q]), ne = this._logger, K = await V.validateDownloadedPath(W, T, w, ne);
      if (K != null)
        return W = K, await ee(!1);
      const I = async () => (await V.clear().catch(() => {
      }), await (0, d.unlink)(W).catch(() => {
      })), G = await (0, c.createTempUpdateFile)(`temp-${z}`, U, ne);
      try {
        await _.task(G, R, Q, I), await (0, e.retry)(() => (0, d.rename)(G, W), 60, 500, 0, 0, (D) => D instanceof Error && /^EBUSY:/.test(D.message));
      } catch (D) {
        throw await I(), D instanceof e.CancellationError && (ne.info("cancelled"), this.emit("update-cancelled", T)), D;
      }
      return ne.info(`New version ${M} has been downloaded to ${W}`), await ee(!0);
    }
    async differentialDownloadInstaller(_, w, R, T, M) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
          return !0;
        const F = (0, v.blockmapFiles)(_.url, this.app.version, w.updateInfoAndProvider.info.version);
        this._logger.info(`Download block maps (old: "${F[0]}", new: ${F[1]})`);
        const j = async (z) => {
          const W = await this.httpExecutor.downloadToBuffer(z, {
            headers: w.requestHeaders,
            cancellationToken: w.cancellationToken
          });
          if (W == null || W.length === 0)
            throw new Error(`Blockmap "${z.href}" is empty`);
          try {
            return JSON.parse((0, $.gunzipSync)(W).toString());
          } catch (Q) {
            throw new Error(`Cannot parse blockmap "${z.href}", error: ${Q}`);
          }
        }, V = {
          newUrl: _.url,
          oldFile: s.join(this.downloadedUpdateHelper.cacheDir, M),
          logger: this._logger,
          newFile: R,
          isUseMultipleRangeRequest: T.isUseMultipleRangeRequest,
          requestHeaders: w.requestHeaders,
          cancellationToken: w.cancellationToken
        };
        this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (V.onProgress = (z) => this.emit(m.DOWNLOAD_PROGRESS, z));
        const U = await Promise.all(F.map((z) => j(z)));
        return await new f.GenericDifferentialDownloader(_.info, this.httpExecutor, V).download(U[0], U[1]), !1;
      } catch (F) {
        if (this._logger.error(`Cannot download differentially, fallback to full download: ${F.stack || F}`), this._testOnlyOptions != null)
          throw F;
        return !0;
      }
    }
  };
  $r.AppUpdater = l;
  function g(S) {
    const _ = (0, i.prerelease)(S);
    return _ != null && _.length > 0;
  }
  class b {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(_) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(_) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(_) {
    }
  }
  return $r.NoOpLogger = b, $r;
}
var nm;
function Kr() {
  if (nm) return rn;
  nm = 1, Object.defineProperty(rn, "__esModule", { value: !0 }), rn.BaseUpdater = void 0;
  const e = Tn, t = oc();
  let u = class extends t.AppUpdater {
    constructor(d, r) {
      super(d, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
    }
    quitAndInstall(d = !1, r = !1) {
      this._logger.info("Install on explicit quitAndInstall"), this.install(d, d ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
        Kt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
      }) : this.quitAndInstallCalled = !1;
    }
    executeDownload(d) {
      return super.executeDownload({
        ...d,
        done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
      });
    }
    get installerPath() {
      return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
    }
    // must be sync (because quit even handler is not async)
    install(d = !1, r = !1) {
      if (this.quitAndInstallCalled)
        return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
      const n = this.downloadedUpdateHelper, s = this.installerPath, i = n == null ? null : n.downloadedFileInfo;
      if (s == null || i == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      this.quitAndInstallCalled = !0;
      try {
        return this._logger.info(`Install: isSilent: ${d}, isForceRunAfter: ${r}`), this.doInstall({
          isSilent: d,
          isForceRunAfter: r,
          isAdminRightsRequired: i.isAdminRightsRequired
        });
      } catch (c) {
        return this.dispatchError(c), !1;
      }
    }
    addQuitHandler() {
      this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((d) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (d !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${d}`);
          return;
        }
        this._logger.info("Auto install update on quit"), this.install(!0, !1);
      }));
    }
    wrapSudo() {
      const { name: d } = this.app, r = `"${d} would like to update"`, n = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), s = [n];
      return /kdesudo/i.test(n) ? (s.push("--comment", r), s.push("-c")) : /gksudo/i.test(n) ? s.push("--message", r) : /pkexec/i.test(n) && s.push("--disable-internal-agent"), s.join(" ");
    }
    spawnSyncLog(d, r = [], n = {}) {
      this._logger.info(`Executing: ${d} with args: ${r}`);
      const s = (0, e.spawnSync)(d, r, {
        env: { ...process.env, ...n },
        encoding: "utf-8",
        shell: !0
      }), { error: i, status: c, stdout: o, stderr: p } = s;
      if (i != null)
        throw this._logger.error(p), i;
      if (c != null && c !== 0)
        throw this._logger.error(p), new Error(`Command ${d} exited with code ${c}`);
      return o.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(d, r = [], n = void 0, s = "ignore") {
      return this._logger.info(`Executing: ${d} with args: ${r}`), new Promise((i, c) => {
        try {
          const o = { stdio: s, env: n, detached: !0 }, p = (0, e.spawn)(d, r, o);
          p.on("error", (h) => {
            c(h);
          }), p.unref(), p.pid !== void 0 && i(!0);
        } catch (o) {
          c(o);
        }
      });
    }
  };
  return rn.BaseUpdater = u, rn;
}
var vn = {}, _n = {}, im;
function gy() {
  if (im) return _n;
  im = 1, Object.defineProperty(_n, "__esModule", { value: !0 }), _n.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
  const e = /* @__PURE__ */ sr(), t = my(), u = bm;
  let a = class extends t.DifferentialDownloader {
    async download() {
      const s = this.blockAwareFileInfo, i = s.size, c = i - (s.blockMapSize + 4);
      this.fileMetadataBuffer = await this.readRemoteBytes(c, i - 1);
      const o = d(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
      await this.doDownload(await r(this.options.oldFile), o);
    }
  };
  _n.FileWithEmbeddedBlockMapDifferentialDownloader = a;
  function d(n) {
    return JSON.parse((0, u.inflateRawSync)(n).toString());
  }
  async function r(n) {
    const s = await (0, e.open)(n, "r");
    try {
      const i = (await (0, e.fstat)(s)).size, c = Buffer.allocUnsafe(4);
      await (0, e.read)(s, c, 0, c.length, i - c.length);
      const o = Buffer.allocUnsafe(c.readUInt32BE(0));
      return await (0, e.read)(s, o, 0, o.length, i - c.length - o.length), await (0, e.close)(s), d(o);
    } catch (i) {
      throw await (0, e.close)(s), i;
    }
  }
  return _n;
}
var am;
function om() {
  if (am) return vn;
  am = 1, Object.defineProperty(vn, "__esModule", { value: !0 }), vn.AppImageUpdater = void 0;
  const e = tt(), t = Tn, u = /* @__PURE__ */ sr(), a = ar, d = Ge, r = Kr(), n = gy(), s = St(), i = Tr();
  let c = class extends r.BaseUpdater {
    constructor(p, h) {
      super(p, h);
    }
    isUpdaterActive() {
      return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(p) {
      const h = p.updateInfoAndProvider.provider, y = (0, s.findFile)(h.resolveFiles(p.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo: y,
        downloadUpdateOptions: p,
        task: async ($, v) => {
          const f = process.env.APPIMAGE;
          if (f == null)
            throw (0, e.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          (p.disableDifferentialDownload || await this.downloadDifferential(y, f, $, h, p)) && await this.httpExecutor.download(y.url, $, v), await (0, u.chmod)($, 493);
        }
      });
    }
    async downloadDifferential(p, h, y, $, v) {
      try {
        const f = {
          newUrl: p.url,
          oldFile: h,
          logger: this._logger,
          newFile: y,
          isUseMultipleRangeRequest: $.isUseMultipleRangeRequest,
          requestHeaders: v.requestHeaders,
          cancellationToken: v.cancellationToken
        };
        return this.listenerCount(i.DOWNLOAD_PROGRESS) > 0 && (f.onProgress = (m) => this.emit(i.DOWNLOAD_PROGRESS, m)), await new n.FileWithEmbeddedBlockMapDifferentialDownloader(p.info, this.httpExecutor, f).download(), !1;
      } catch (f) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${f.stack || f}`), process.platform === "linux";
      }
    }
    doInstall(p) {
      const h = process.env.APPIMAGE;
      if (h == null)
        throw (0, e.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      (0, a.unlinkSync)(h);
      let y;
      const $ = d.basename(h), v = this.installerPath;
      if (v == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      d.basename(v) === $ || !/\d+\.\d+\.\d+/.test($) ? y = h : y = d.join(d.dirname(h), d.basename(v)), (0, t.execFileSync)("mv", ["-f", v, y]), y !== h && this.emit("appimage-filename-updated", y);
      const f = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      return p.isForceRunAfter ? this.spawnLog(y, [], f) : (f.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, t.execFileSync)(y, [], { env: f })), !0;
    }
  };
  return vn.AppImageUpdater = c, vn;
}
var $n = {}, sm;
function um() {
  if (sm) return $n;
  sm = 1, Object.defineProperty($n, "__esModule", { value: !0 }), $n.DebUpdater = void 0;
  const e = Kr(), t = St(), u = Tr();
  let a = class extends e.BaseUpdater {
    constructor(r, n) {
      super(r, n);
    }
    /*** @private */
    doDownloadUpdate(r) {
      const n = r.updateInfoAndProvider.provider, s = (0, t.findFile)(n.resolveFiles(r.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo: s,
        downloadUpdateOptions: r,
        task: async (i, c) => {
          this.listenerCount(u.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (o) => this.emit(u.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(s.url, i, c);
        }
      });
    }
    get installerPath() {
      var r, n;
      return (n = (r = super.installerPath) === null || r === void 0 ? void 0 : r.replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
    }
    doInstall(r) {
      const n = this.wrapSudo(), s = /pkexec/i.test(n) ? "" : '"', i = this.installerPath;
      if (i == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      const c = ["dpkg", "-i", i, "||", "apt-get", "install", "-f", "-y"];
      return this.spawnSyncLog(n, [`${s}/bin/bash`, "-c", `'${c.join(" ")}'${s}`]), r.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return $n.DebUpdater = a, $n;
}
var wn = {}, cm;
function lm() {
  if (cm) return wn;
  cm = 1, Object.defineProperty(wn, "__esModule", { value: !0 }), wn.PacmanUpdater = void 0;
  const e = Kr(), t = Tr(), u = St();
  let a = class extends e.BaseUpdater {
    constructor(r, n) {
      super(r, n);
    }
    /*** @private */
    doDownloadUpdate(r) {
      const n = r.updateInfoAndProvider.provider, s = (0, u.findFile)(n.resolveFiles(r.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
      return this.executeDownload({
        fileExtension: "pacman",
        fileInfo: s,
        downloadUpdateOptions: r,
        task: async (i, c) => {
          this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (o) => this.emit(t.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(s.url, i, c);
        }
      });
    }
    get installerPath() {
      var r, n;
      return (n = (r = super.installerPath) === null || r === void 0 ? void 0 : r.replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
    }
    doInstall(r) {
      const n = this.wrapSudo(), s = /pkexec/i.test(n) ? "" : '"', i = this.installerPath;
      if (i == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      const c = ["pacman", "-U", "--noconfirm", i];
      return this.spawnSyncLog(n, [`${s}/bin/bash`, "-c", `'${c.join(" ")}'${s}`]), r.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return wn.PacmanUpdater = a, wn;
}
var En = {}, fm;
function dm() {
  if (fm) return En;
  fm = 1, Object.defineProperty(En, "__esModule", { value: !0 }), En.RpmUpdater = void 0;
  const e = Kr(), t = Tr(), u = St();
  let a = class extends e.BaseUpdater {
    constructor(r, n) {
      super(r, n);
    }
    /*** @private */
    doDownloadUpdate(r) {
      const n = r.updateInfoAndProvider.provider, s = (0, u.findFile)(n.resolveFiles(r.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo: s,
        downloadUpdateOptions: r,
        task: async (i, c) => {
          this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (o) => this.emit(t.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(s.url, i, c);
        }
      });
    }
    get installerPath() {
      var r, n;
      return (n = (r = super.installerPath) === null || r === void 0 ? void 0 : r.replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
    }
    doInstall(r) {
      const n = this.wrapSudo(), s = /pkexec/i.test(n) ? "" : '"', i = this.spawnSyncLog("which zypper"), c = this.installerPath;
      if (c == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      let o;
      return i ? o = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", c] : o = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", c], this.spawnSyncLog(n, [`${s}/bin/bash`, "-c", `'${o.join(" ")}'${s}`]), r.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return En.RpmUpdater = a, En;
}
var bn = {}, hm;
function pm() {
  if (hm) return bn;
  hm = 1, Object.defineProperty(bn, "__esModule", { value: !0 }), bn.MacUpdater = void 0;
  const e = tt(), t = /* @__PURE__ */ sr(), u = ar, a = Ge, d = _g, r = oc(), n = St(), s = Tn, i = On;
  let c = class extends r.AppUpdater {
    constructor(p, h) {
      super(p, h), this.nativeUpdater = Kt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (y) => {
        this._logger.warn(y), this.emit("error", y);
      }), this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
      });
    }
    debug(p) {
      this._logger.debug != null && this._logger.debug(p);
    }
    closeServerIfExists() {
      this.server && (this.debug("Closing proxy server"), this.server.close((p) => {
        p && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
      }));
    }
    async doDownloadUpdate(p) {
      let h = p.updateInfoAndProvider.provider.resolveFiles(p.updateInfoAndProvider.info);
      const y = this._logger, $ = "sysctl.proc_translated";
      let v = !1;
      try {
        this.debug("Checking for macOS Rosetta environment"), v = (0, s.execFileSync)("sysctl", [$], { encoding: "utf8" }).includes(`${$}: 1`), y.info(`Checked for macOS Rosetta environment (isRosetta=${v})`);
      } catch (S) {
        y.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${S}`);
      }
      let f = !1;
      try {
        this.debug("Checking for arm64 in uname");
        const _ = (0, s.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
        y.info(`Checked 'uname -a': arm64=${_}`), f = f || _;
      } catch (S) {
        y.warn(`uname shell command to check for arm64 failed: ${S}`);
      }
      f = f || process.arch === "arm64" || v;
      const m = (S) => {
        var _;
        return S.url.pathname.includes("arm64") || ((_ = S.info.url) === null || _ === void 0 ? void 0 : _.includes("arm64"));
      };
      f && h.some(m) ? h = h.filter((S) => f === m(S)) : h = h.filter((S) => !m(S));
      const l = (0, n.findFile)(h, "zip", ["pkg", "dmg"]);
      if (l == null)
        throw (0, e.newError)(`ZIP file not provided: ${(0, e.safeStringifyJson)(h)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      const g = p.updateInfoAndProvider.provider, b = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: l,
        downloadUpdateOptions: p,
        task: async (S, _) => {
          const w = a.join(this.downloadedUpdateHelper.cacheDir, b), R = () => (0, t.pathExistsSync)(w) ? !p.disableDifferentialDownload : (y.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
          let T = !0;
          R() && (T = await this.differentialDownloadInstaller(l, p, S, g, b)), T && await this.httpExecutor.download(l.url, S, _);
        },
        done: async (S) => {
          if (!p.disableDifferentialDownload)
            try {
              const _ = a.join(this.downloadedUpdateHelper.cacheDir, b);
              await (0, t.copyFile)(S.downloadedFile, _);
            } catch (_) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${_.message}`);
            }
          return this.updateDownloaded(l, S);
        }
      });
    }
    async updateDownloaded(p, h) {
      var y;
      const $ = h.downloadedFile, v = (y = p.info.size) !== null && y !== void 0 ? y : (await (0, t.stat)($)).size, f = this._logger, m = `fileToProxy=${p.url.href}`;
      this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${m})`), this.server = (0, d.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${m})`), this.server.on("close", () => {
        f.info(`Proxy server for native Squirrel.Mac is closed (${m})`);
      });
      const l = (g) => {
        const b = g.address();
        return typeof b == "string" ? b : `http://127.0.0.1:${b?.port}`;
      };
      return await new Promise((g, b) => {
        const S = (0, i.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), _ = Buffer.from(`autoupdater:${S}`, "ascii"), w = `/${(0, i.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (R, T) => {
          const M = R.url;
          if (f.info(`${M} requested`), M === "/") {
            if (!R.headers.authorization || R.headers.authorization.indexOf("Basic ") === -1) {
              T.statusCode = 401, T.statusMessage = "Invalid Authentication Credentials", T.end(), f.warn("No authenthication info");
              return;
            }
            const V = R.headers.authorization.split(" ")[1], U = Buffer.from(V, "base64").toString("ascii"), [z, W] = U.split(":");
            if (z !== "autoupdater" || W !== S) {
              T.statusCode = 401, T.statusMessage = "Invalid Authentication Credentials", T.end(), f.warn("Invalid authenthication credentials");
              return;
            }
            const Q = Buffer.from(`{ "url": "${l(this.server)}${w}" }`);
            T.writeHead(200, { "Content-Type": "application/json", "Content-Length": Q.length }), T.end(Q);
            return;
          }
          if (!M.startsWith(w)) {
            f.warn(`${M} requested, but not supported`), T.writeHead(404), T.end();
            return;
          }
          f.info(`${w} requested by Squirrel.Mac, pipe ${$}`);
          let F = !1;
          T.on("finish", () => {
            F || (this.nativeUpdater.removeListener("error", b), g([]));
          });
          const j = (0, u.createReadStream)($);
          j.on("error", (V) => {
            try {
              T.end();
            } catch (U) {
              f.warn(`cannot end response: ${U}`);
            }
            F = !0, this.nativeUpdater.removeListener("error", b), b(new Error(`Cannot pipe "${$}": ${V}`));
          }), T.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": v
          }), j.pipe(T);
        }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${m})`), this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${m})`), this.nativeUpdater.setFeedURL({
            url: l(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${_.toString("base64")}`
            }
          }), this.dispatchUpdateDownloaded(h), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", b), this.nativeUpdater.checkForUpdates()) : g([]);
        });
      });
    }
    handleUpdateDownloaded() {
      this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
    }
    quitAndInstall() {
      this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
    }
  };
  return bn.MacUpdater = c, bn;
}
var Sn = {}, Ca = {}, mm;
function gE() {
  if (mm) return Ca;
  mm = 1, Object.defineProperty(Ca, "__esModule", { value: !0 }), Ca.verifySignature = d;
  const e = tt(), t = Tn, u = Ma, a = Ge;
  function d(i, c, o) {
    return new Promise((p, h) => {
      const y = c.replace(/'/g, "''");
      o.info(`Verifying signature ${y}`), (0, t.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${y}' | ConvertTo-Json -Compress"`], {
        shell: !0,
        timeout: 20 * 1e3
      }, ($, v, f) => {
        var m;
        try {
          if ($ != null || f) {
            n(o, $, f, h), p(null);
            return;
          }
          const l = r(v);
          if (l.Status === 0) {
            try {
              const _ = a.normalize(l.Path), w = a.normalize(c);
              if (o.info(`LiteralPath: ${_}. Update Path: ${w}`), _ !== w) {
                n(o, new Error(`LiteralPath of ${_} is different than ${w}`), f, h), p(null);
                return;
              }
            } catch (_) {
              o.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(m = _.message) !== null && m !== void 0 ? m : _.stack}`);
            }
            const b = (0, e.parseDn)(l.SignerCertificate.Subject);
            let S = !1;
            for (const _ of i) {
              const w = (0, e.parseDn)(_);
              if (w.size ? S = Array.from(w.keys()).every((T) => w.get(T) === b.get(T)) : _ === b.get("CN") && (o.warn(`Signature validated using only CN ${_}. Please add your full Distinguished Name (DN) to publisherNames configuration`), S = !0), S) {
                p(null);
                return;
              }
            }
          }
          const g = `publisherNames: ${i.join(" | ")}, raw info: ` + JSON.stringify(l, (b, S) => b === "RawData" ? void 0 : S, 2);
          o.warn(`Sign verification failed, installer signed with incorrect certificate: ${g}`), p(g);
        } catch (l) {
          n(o, l, null, h), p(null);
          return;
        }
      });
    });
  }
  function r(i) {
    const c = JSON.parse(i);
    delete c.PrivateKey, delete c.IsOSBinary, delete c.SignatureType;
    const o = c.SignerCertificate;
    return o != null && (delete o.Archived, delete o.Extensions, delete o.Handle, delete o.HasPrivateKey, delete o.SubjectName), c;
  }
  function n(i, c, o, p) {
    if (s()) {
      i.warn(`Cannot execute Get-AuthenticodeSignature: ${c || o}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    try {
      (0, t.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
    } catch (h) {
      i.warn(`Cannot execute ConvertTo-Json: ${h.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    c != null && p(c), o && p(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${o}. Failing signature validation due to unknown stderr.`));
  }
  function s() {
    const i = u.release();
    return i.startsWith("6.") && !i.startsWith("6.3");
  }
  return Ca;
}
var ym;
function gm() {
  if (ym) return Sn;
  ym = 1, Object.defineProperty(Sn, "__esModule", { value: !0 }), Sn.NsisUpdater = void 0;
  const e = tt(), t = Ge, u = Kr(), a = gy(), d = Tr(), r = St(), n = /* @__PURE__ */ sr(), s = gE(), i = Br;
  let c = class extends u.BaseUpdater {
    constructor(p, h) {
      super(p, h), this._verifyUpdateCodeSignature = (y, $) => (0, s.verifySignature)(y, $, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(p) {
      p && (this._verifyUpdateCodeSignature = p);
    }
    /*** @private */
    doDownloadUpdate(p) {
      const h = p.updateInfoAndProvider.provider, y = (0, r.findFile)(h.resolveFiles(p.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions: p,
        fileInfo: y,
        task: async ($, v, f, m) => {
          const l = y.packageInfo, g = l != null && f != null;
          if (g && p.disableWebInstaller)
            throw (0, e.newError)(`Unable to download new version ${p.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          !g && !p.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (g || p.disableDifferentialDownload || await this.differentialDownloadInstaller(y, p, $, h, e.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(y.url, $, v);
          const b = await this.verifySignature($);
          if (b != null)
            throw await m(), (0, e.newError)(`New version ${p.updateInfoAndProvider.info.version} is not signed by the application owner: ${b}`, "ERR_UPDATER_INVALID_SIGNATURE");
          if (g && await this.differentialDownloadWebPackage(p, l, f, h))
            try {
              await this.httpExecutor.download(new i.URL(l.path), f, {
                headers: p.requestHeaders,
                cancellationToken: p.cancellationToken,
                sha512: l.sha512
              });
            } catch (S) {
              try {
                await (0, n.unlink)(f);
              } catch {
              }
              throw S;
            }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(p) {
      let h;
      try {
        if (h = (await this.configOnDisk.value).publisherName, h == null)
          return null;
      } catch (y) {
        if (y.code === "ENOENT")
          return null;
        throw y;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(h) ? h : [h], p);
    }
    doInstall(p) {
      const h = this.installerPath;
      if (h == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      const y = ["--updated"];
      p.isSilent && y.push("/S"), p.isForceRunAfter && y.push("--force-run"), this.installDirectory && y.push(`/D=${this.installDirectory}`);
      const $ = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      $ != null && y.push(`--package-file=${$}`);
      const v = () => {
        this.spawnLog(t.join(process.resourcesPath, "elevate.exe"), [h].concat(y)).catch((f) => this.dispatchError(f));
      };
      return p.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), v(), !0) : (this.spawnLog(h, y).catch((f) => {
        const m = f.code;
        this._logger.info(`Cannot run installer: error code: ${m}, error message: "${f.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), m === "UNKNOWN" || m === "EACCES" ? v() : m === "ENOENT" ? Kt.shell.openPath(h).catch((l) => this.dispatchError(l)) : this.dispatchError(f);
      }), !0);
    }
    async differentialDownloadWebPackage(p, h, y, $) {
      if (h.blockMapSize == null)
        return !0;
      try {
        const v = {
          newUrl: new i.URL(h.path),
          oldFile: t.join(this.downloadedUpdateHelper.cacheDir, e.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: y,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: $.isUseMultipleRangeRequest,
          cancellationToken: p.cancellationToken
        };
        this.listenerCount(d.DOWNLOAD_PROGRESS) > 0 && (v.onProgress = (f) => this.emit(d.DOWNLOAD_PROGRESS, f)), await new a.FileWithEmbeddedBlockMapDifferentialDownloader(h, this.httpExecutor, v).download();
      } catch (v) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${v.stack || v}`), process.platform === "win32";
      }
      return !1;
    }
  };
  return Sn.NsisUpdater = c, Sn;
}
var vm;
function vE() {
  return vm || (vm = 1, function(e) {
    var t = _r && _r.__createBinding || (Object.create ? function(f, m, l, g) {
      g === void 0 && (g = l);
      var b = Object.getOwnPropertyDescriptor(m, l);
      (!b || ("get" in b ? !m.__esModule : b.writable || b.configurable)) && (b = { enumerable: !0, get: function() {
        return m[l];
      } }), Object.defineProperty(f, g, b);
    } : function(f, m, l, g) {
      g === void 0 && (g = l), f[g] = m[l];
    }), u = _r && _r.__exportStar || function(f, m) {
      for (var l in f) l !== "default" && !Object.prototype.hasOwnProperty.call(m, l) && t(m, f, l);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
    const a = /* @__PURE__ */ sr(), d = Ge;
    var r = Kr();
    Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
      return r.BaseUpdater;
    } });
    var n = oc();
    Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
      return n.AppUpdater;
    } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
      return n.NoOpLogger;
    } });
    var s = St();
    Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
      return s.Provider;
    } });
    var i = om();
    Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
      return i.AppImageUpdater;
    } });
    var c = um();
    Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
      return c.DebUpdater;
    } });
    var o = lm();
    Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
      return o.PacmanUpdater;
    } });
    var p = dm();
    Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
      return p.RpmUpdater;
    } });
    var h = pm();
    Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
      return h.MacUpdater;
    } });
    var y = gm();
    Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
      return y.NsisUpdater;
    } }), u(Tr(), e);
    let $;
    function v() {
      if (process.platform === "win32")
        $ = new (gm()).NsisUpdater();
      else if (process.platform === "darwin")
        $ = new (pm()).MacUpdater();
      else {
        $ = new (om()).AppImageUpdater();
        try {
          const f = d.join(process.resourcesPath, "package-type");
          if (!(0, a.existsSync)(f))
            return $;
          console.info("Checking for beta autoupdate feature for deb/rpm distributions");
          const m = (0, a.readFileSync)(f).toString().trim();
          switch (console.info("Found package-type:", m), m) {
            case "deb":
              $ = new (um()).DebUpdater();
              break;
            case "rpm":
              $ = new (dm()).RpmUpdater();
              break;
            case "pacman":
              $ = new (lm()).PacmanUpdater();
              break;
            default:
              break;
          }
        } catch (f) {
          console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", f.message);
        }
      }
      return $;
    }
    Object.defineProperty(e, "autoUpdater", {
      enumerable: !0,
      get: () => $ || v()
    });
  }(_r)), _r;
}
var bt = vE(), Cu, _m;
function _E() {
  if (_m) return Cu;
  _m = 1;
  var e = Tn, t = e.spawn, u = e.exec;
  Cu = function(n, s, i) {
    if (typeof s == "function" && i === void 0 && (i = s, s = void 0), n = parseInt(n), Number.isNaN(n)) {
      if (i)
        return i(new Error("pid must be a number"));
      throw new Error("pid must be a number");
    }
    var c = {}, o = {};
    switch (c[n] = [], o[n] = 1, process.platform) {
      case "win32":
        u("taskkill /pid " + n + " /T /F", i);
        break;
      case "darwin":
        r(n, c, o, function(p) {
          return t("pgrep", ["-P", p]);
        }, function() {
          a(c, s, i);
        });
        break;
      // case 'sunos':
      //     buildProcessTreeSunOS(pid, tree, pidsToProcess, function () {
      //         killAll(tree, signal, callback);
      //     });
      //     break;
      default:
        r(n, c, o, function(p) {
          return t("ps", ["-o", "pid", "--no-headers", "--ppid", p]);
        }, function() {
          a(c, s, i);
        });
        break;
    }
  };
  function a(n, s, i) {
    var c = {};
    try {
      Object.keys(n).forEach(function(o) {
        n[o].forEach(function(p) {
          c[p] || (d(p, s), c[p] = 1);
        }), c[o] || (d(o, s), c[o] = 1);
      });
    } catch (o) {
      if (i)
        return i(o);
      throw o;
    }
    if (i)
      return i();
  }
  function d(n, s) {
    try {
      process.kill(parseInt(n, 10), s);
    } catch (i) {
      if (i.code !== "ESRCH") throw i;
    }
  }
  function r(n, s, i, c, o) {
    var p = c(n), h = "";
    p.stdout.on("data", function(v) {
      var v = v.toString("ascii");
      h += v;
    });
    var y = function($) {
      if (delete i[n], $ != 0) {
        Object.keys(i).length == 0 && o();
        return;
      }
      h.match(/\d+/g).forEach(function(v) {
        v = parseInt(v, 10), s[n].push(v), s[v] = [], i[v] = 1, r(v, s, i, c, o);
      });
    };
    p.on("close", y);
  }
  return Cu;
}
var $E = _E();
const wE = /* @__PURE__ */ Uu($E), EE = lt.requestSingleInstanceLock();
let At = null;
const bE = () => lt.isPackaged ? Ie.join(process.resourcesPath, "backend", "backend-mrpack-installer.exe") : Ie.join(uc, "..", "backend", "backend-mrpack-installer.exe");
function SE() {
  if (At)
    return;
  const e = bE();
  console.log(`Iniciando backend desde: ${e}`);
  try {
    if (At = gg(e), !At) {
      console.error("Error: No se pudo iniciar el proceso de backend."), lt.quit();
      return;
    }
    At.stdout?.on("data", (t) => {
      console.log(`[Backend STDOUT]: ${t.toString()}`);
    }), At.stderr?.on("data", (t) => {
      console.error(`[Backend STDERR]: ${t.toString()}`);
    }), At.on("close", (t) => {
      console.log(`Proceso de backend cerrado con código ${t}`), At = null;
    });
  } catch (t) {
    console.error("Error fatal al intentar ejecutar spawn:", t), lt.quit();
  }
}
function sc() {
  if (At && At.pid) {
    console.log("Cerrando el proceso del backend...");
    try {
      wE(At.pid);
    } catch (e) {
      console.error("Error cerrando backend:", e);
    }
    At = null;
  }
}
const uc = Ie.dirname($g(import.meta.url));
process.env.APP_ROOT = Ie.join(uc, "..");
const Et = new yw(), Ua = process.env.VITE_DEV_SERVER_URL, _1 = Ie.join(process.env.APP_ROOT, "dist-electron"), vy = Ie.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Ua ? Ie.join(process.env.APP_ROOT, "public") : vy;
let Je;
function _y() {
  const e = Et.get("windowBounds", { width: 1100, height: 700 }), t = Et.get("isFullscreen", !1);
  if (Je = new Du({
    title: "Modpack Installer",
    icon: Ie.join(process.env.VITE_PUBLIC ?? "", "app-icon.png"),
    webPreferences: {
      preload: Ie.join(uc, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webviewTag: !0
    },
    fullscreen: t,
    minHeight: 700,
    minWidth: 1100,
    height: e?.height || 700,
    width: e?.width || 1100
  }), Je.on("closed", () => {
    Je = null;
  }), Je.webContents.on("did-finish-load", () => {
    console.log("Ventana cargada con éxito");
  }), Ua)
    Je.loadURL(Ua);
  else {
    const u = Ie.join(vy, "index.html");
    console.log("Cargando archivo:", u), Je.loadFile(u);
  }
}
lt.on("window-all-closed", () => {
  if (sc(), Je) {
    const e = Je.getBounds();
    Et.set("windowBounds", { width: e.width, height: e.height }), Et.set("isFullscreen", Je.isFullScreen());
  }
  process.platform !== "darwin" && lt.quit();
});
lt.on("will-quit", () => {
  sc();
});
lt.on("before-quit", () => {
  sc();
});
lt.on("activate", () => {
  Du.getAllWindows().length === 0 && _y();
});
bt.autoUpdater.autoDownload = !1;
bt.autoUpdater.autoRunAppAfterInstall = !0;
bt.autoUpdater.setFeedURL({
  provider: "github",
  repo: "Mrpack-Installer",
  owner: "414ND1N",
  channel: "latest",
  private: !1
});
bt.autoUpdater.on("update-available", (e) => {
  console.log("Update available");
});
bt.autoUpdater.on("update-not-available", (e) => {
  console.log("No update available");
});
bt.autoUpdater.on("error", (e) => {
  console.error("Error checking for updates:", e);
});
bt.autoUpdater.on("update-downloaded", (e) => {
  console.log("Update downloaded:", e);
});
function PE() {
  wt.handle("set-fullscreen", (e, t) => {
    Je && (Je.setFullScreen(t), Et.set("isFullscreen", t));
  }), wt.handle("get-fullscreen", () => Je ? Je.isFullScreen() : !1), wt.handle("set-theme", (e, t) => {
    try {
      Et.set("theme", t), console.log(`Theme saved to: ${t}`);
    } catch (u) {
      console.error("Error saving theme:", u);
    }
  }), wt.handle("get-theme", () => Et.has("theme") ? Et.get("theme") : Un.shouldUseDarkColors ? "dark" : "light"), wt.handle("get-system-theme", () => Un.shouldUseDarkColors ? "dark" : "light"), Un.on("updated", () => {
    try {
      if (!Et.has("theme") && Je) {
        const e = Un.shouldUseDarkColors ? "dark" : "light";
        Je.webContents.send("system-theme-changed", e);
      }
    } catch (e) {
      console.error("Error al notificar cambio de tema del sistema:", e);
    }
  }), wt.handle("get-version", () => lt.getVersion()), wt.handle("update-app", async () => {
    try {
      console.log("Updating app..."), await bt.autoUpdater.downloadUpdate(), bt.autoUpdater.quitAndInstall();
    } catch (e) {
      throw console.error("Error downloading update:", e), e;
    }
  }), wt.handle("check-update", async () => {
    try {
      return console.log("Checking for updates..."), (await bt.autoUpdater.checkForUpdates())?.isUpdateAvailable || !1;
    } catch (e) {
      throw console.error("Error checking for updates:", e), e;
    }
  }), wt.handle("get-language", () => {
    if (Et.has("language"))
      return Et.get("language", "en");
    const e = lt.getLocale() || "en";
    return String(e).split(/[-_]/)[0];
  }), wt.handle("get-system-language", () => String(lt.getLocale() || "en").split(/[-_]/)[0]), wt.handle("set-language", (e, t) => {
    try {
      Et.set("language", t), console.log(`Language saved to: ${t}`);
    } catch (u) {
      console.error("Error saving language:", u);
    }
  });
}
wt.handle("dialog:showOpenDialog", async (e, t) => {
  try {
    const u = Du.getAllWindows().find((d) => !d.isDestroyed()) ?? void 0;
    let a;
    return u ? a = await $c.showOpenDialog(u, t) : a = await $c.showOpenDialog(t), a;
  } catch (u) {
    throw console.error("Error mostrando diálogo de selección:", u), u;
  }
});
EE ? (lt.on("second-instance", () => {
  Je && (Je.isMinimized() && Je.restore(), Je.focus());
}), lt.whenReady().then(() => {
  SE(), _y(), process.platform !== "darwin" && !Ua && hg.setApplicationMenu(null), PE(), console.log("Last version:", bt.autoUpdater.currentVersion), bt.autoUpdater.checkForUpdates();
})) : lt.quit();
export {
  _1 as MAIN_DIST,
  vy as RENDERER_DIST,
  Ua as VITE_DEV_SERVER_URL
};
