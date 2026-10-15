/* Adem Portfolio — renders data/site-data.json. No dependencies. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var data, lang = store.get("lang") || "en", filter = "all";
  if (!window.UI[lang]) lang = "en";

  /* Localised value: string or {en,fr,ar} */
  function t(v) { return v && typeof v === "object" ? (v[lang] || v.en || "") : (v || ""); }
  function ui(k) { return window.UI[lang][k] || window.UI.en[k] || k; }
  /* Only http(s)/mailto/relative links are allowed */
  function safeUrl(u) { return /^(https?:|mailto:|assets\/|\.\/|#)/i.test(u || "") ? u : ""; }
  /* Safe DOM builder: text is always set via textContent */
  function el(tag, cls, text, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    for (var k in (attrs || {})) n.setAttribute(k, attrs[k]);
    return n;
  }
  function link(label, href, cls, ext) {
    var u = safeUrl(href); if (!u) return null;
    var a = el("a", cls, label, { href: u });
    if (ext && /^https?:/i.test(u)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    return a;
  }
  function section(id, title) {
    var s = $("#" + id); s.textContent = "";
    if (title) s.appendChild(el("h2", null, title));
    return s;
  }

  function render() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    $("#lang").value = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (n) { n.textContent = ui(n.dataset.i18n); });
    if (!data) return;
    var p = data.person || {};
    document.title = p.name + " — " + t(p.title);

    var h = section("home");
    var left = el("div");
    left.append(el("p", "role", ui("hello")), el("h1", null, p.name), el("p", "role", t(p.title)), el("p", null, t(data.intro)));
    var b = el("div", "btns");
    var cv = link(ui("cv"), p.cv, "btn");
    if (cv) cv.setAttribute("download", "");
    [link(ui("see"), "#projects", "btn primary"), cv, link(ui("talk"), "#contact", "btn")].forEach(function (a) { if (a) b.appendChild(a); });
    left.appendChild(b);
    var card = el("div", "card-id");
    var stack = [].concat.apply([], (data.skills || []).map(function (s) { return s.items || []; })).slice(0, 6).join(", ");
    [["name", p.name], ["location", p.location], ["stack", stack]].forEach(function (r) {
      var d = el("div"); d.append(el("b", null, r[0] + ": "), document.createTextNode(r[1] || "")); card.appendChild(d);
    });
    h.append(left, card);

    var a = section("about", ui("nav_about"));
    a.appendChild(el("p", null, t(data.bio)));
    if (data.languages && data.languages.length) {
      var ul = el("ul", "chips"); data.languages.forEach(function (l) { ul.appendChild(el("li", "chip", l)); }); a.appendChild(ul);
    }

    var sk = section("skills", ui("nav_skills")), g = el("div", "grid");
    (data.skills || []).forEach(function (c) {
      var pn = el("div", "panel"); pn.appendChild(el("h3", null, t(c.category)));
      var l = el("ul", "chips"); (c.items || []).forEach(function (i) { l.appendChild(el("li", "chip", i)); });
      pn.appendChild(l); g.appendChild(pn);
    });
    sk.appendChild(g);

    renderProjects();

    var sv = section("services", ui("nav_services")), sg = el("div", "grid");
    (data.services || []).forEach(function (s) {
      var pn = el("div", "panel"); pn.append(el("h3", null, t(s.title)), el("p", null, t(s.text))); sg.appendChild(pn);
    });
    sv.appendChild(sg);

    var c = section("contact", ui("nav_contact"));
    c.appendChild(el("p", null, ui("contactText")));
    var cb = el("div", "btns");
    var m = link(ui("mail"), p.email ? "mailto:" + p.email : "", "btn primary"); if (m) cb.appendChild(m);
    (data.social || []).forEach(function (s) { var x = link(s.label, s.url, "btn", true); if (x) cb.appendChild(x); });
    c.appendChild(cb);
    $("#foot").textContent = "© " + new Date().getFullYear() + " " + p.name + ". " + ui("rights");
  }

  function renderProjects() {
    var s = section("projects", ui("nav_projects"));
    var list = data.projects || [];
    var techs = []; list.forEach(function (pr) { (pr.tech || []).forEach(function (x) { if (techs.indexOf(x) < 0) techs.push(x); }); });
    var f = el("div", "filters");
    ["all"].concat(techs).forEach(function (x) {
      var bt = el("button", "chip", x === "all" ? ui("all") : x, { type: "button", "aria-pressed": String(filter === x) });
      bt.onclick = function () { filter = x; renderProjects(); };
      f.appendChild(bt);
    });
    s.appendChild(f);
    var grid = el("div", "grid");
    list.slice().sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); }).forEach(function (pr) {
      if (filter !== "all" && (pr.tech || []).indexOf(filter) < 0) return;
      var cd = el("article", "panel proj");
      var img = el("img", null, null, { src: safeUrl(pr.image) || "assets/images/placeholder.svg", alt: pr.title || "", loading: "lazy" });
      img.onerror = function () { this.onerror = null; this.src = "assets/images/placeholder.svg"; };
      var body = el("div", "body");
      if (pr.example) body.appendChild(el("span", "tag", ui("example")));
      body.append(el("h3", null, pr.title), el("p", null, t(pr.description)));
      var ch = el("ul", "chips"); (pr.tech || []).forEach(function (x) { ch.appendChild(el("li", "chip", x)); });
      var ln = el("div", "links");
      [link(ui("demo"), pr.demo, null, true), link(ui("code"), pr.github, null, true)].forEach(function (x) { if (x) ln.appendChild(x); });
      body.append(ch, ln); cd.append(img, body); grid.appendChild(cd);
    });
    s.appendChild(grid);
  }

  function validate(d) {
    if (!d || typeof d !== "object") throw new Error("site-data.json must be a JSON object.");
    if (!d.person || !d.person.name) throw new Error('Missing "person.name".');
    if (!Array.isArray(d.projects)) throw new Error('"projects" must be a list.');
    return d;
  }

  /* Theme, language, mobile menu */
  var theme = store.get("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  function applyTheme() { document.documentElement.dataset.theme = theme; }
  applyTheme();
  $("#theme").onclick = function () { theme = theme === "dark" ? "light" : "dark"; store.set("theme", theme); applyTheme(); };
  $("#lang").onchange = function (e) { lang = e.target.value; store.set("lang", lang); render(); };
  $("#burger").onclick = function () { var o = $("#nav").classList.toggle("open"); this.setAttribute("aria-expanded", o); };
  $("#nav").onclick = function () { this.classList.remove("open"); };
  render();

  /* Load data: ?preview=1 uses the private draft saved by the admin editor */
  var draft = location.search.indexOf("preview=1") >= 0 ? store.get("portfolio-draft") : null;
  new Promise(function (ok) { ok(draft ? JSON.parse(draft) : null); })
    .then(function (d) { return d || fetch("data/site-data.json").then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); }); })
    .then(function (d) { data = validate(d); render(); })
    .catch(function (e) { var b = $("#error"); b.hidden = false; b.textContent = ui("loadErr") + " (" + e.message + ")"; });
})();
