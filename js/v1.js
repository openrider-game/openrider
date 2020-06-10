!function() {
    var __ = location.hash === '#fps' ? 1000 / 30 : 40;
    var g = void 0
      , j = !0
      , k = !1;
    function aa() {
        return function() {}
    }
    function ba(a) {
        return function() {
            return a
        }
    }
    var p = 2 * Math.PI
      , q = Math.random
      , r = Math.cos
      , ca = Math.sin
      , s = Math.round
      , da = Math.ceil
      , t = Math.floor
      , ea = Math.pow
      , fa = Math.sqrt
      , u = parseInt
      , v = document
      , ga = v.body
      , z = "a"
      , A = "ba"
      , B = "f"
      , ha = "fx"
      , ia = 0;
    function ja() {
        function a(a) {
            e.push(a);
            d && (c = a(c));
            return f.Ib
        }
        function b(a) {
            d = j;
            c = a;
            for (var b = 0, f = e.length; b < f; b++)
                e[b](a)
        }
        var c, d, e = [], f = {
            ab: a,
            Va: b,
            Ib: {
                ab: a
            },
            Wb: {
                Va: b
            }
        };
        return f
    }
    function ka(a, b) {
        var c = v.createElementNS(b, a.match(/^\w+/)[0]), d, e;
        if (d = a.match(/#([\w-]+)/))
            c.id = d[1];
        (e = a.match(/\.[\w-]+/g)) && c.setAttribute("class", e.join(" ").replace(/\./g, ""));
        return c
    }
    function D(a, b, c) {
        var d = document, e, f;
        if (a && a.big)
            return d.getElementById(a);
        c = c || {};
        b = b || "http://www.w3.org/1999/xhtml";
        a[0].big && (a[0] = ka(a[0], b));
        for (e = 1; e < a.length; e++)
            if (a[e].big)
                a[0].appendChild(d.createTextNode(a[e]));
            else if (a[e].pop)
                a[e][0].big && (a[e][0] = ka(a[e][0], b)),
                a[0].appendChild(a[e][0]),
                D(a[e], b, c);
            else if (a[e].call)
                a[e](a[0]);
            else
                for (f in a[e])
                    a[0].setAttribute(f, a[e][f]);
        c[0] = a[0];
        return c[0]
    }
    function E(a, b) {
        for (var c in b)
            b.hasOwnProperty(c) && (a[c] = b[c])
    }
    function la(a, b) {
        for (var c = 0, d = b.length; c < d; c++) {
            var e = a
              , f = b[c];
            ~e.indexOf(f) || e.push(f)
        }
    }
    function ma() {
        this.Ia = {}
    }
    var na = ma.prototype;
    na.Tb = function(a, b) {
        (this.Ia[a] = this.Ia[a] || []).push(b);
        return this
    }
    ;
    na.Sb = function(a, b) {
        this.Ia[a] && _remove(this.Ia[a], b);
        return this
    }
    ;
    na.Za = function(a) {
        var b = this.Ia && this.Ia[a];
        if (b)
            for (var c = _slice.call(arguments, 1), d = 0, e = b.length; d < e; d++)
                b[d].apply(this, c)
    }
    ;
    function F(a, b) {
        this.x = a;
        this.y = b
    }
    var G = F.prototype;
    G.C = function() {
        return new F((this.x - H.N.x) * H.d + I.width / 2,(this.y - H.N.y) * H.d + I.height / 2)
    }
    ;
    G.Ka = function() {
        return new F((this.x - I.width / 2) / H.d + H.N.x,(this.y - I.height / 2) / H.d + H.N.y)
    }
    ;
    G.copy = function(a) {
        this.x = a.x;
        this.y = a.y;
        return this
    }
    ;
    G.G = function(a) {
        this.x += a.x;
        this.y += a.y;
        return this
    }
    ;
    G.Xb = function(a) {
        this.x -= a.x;
        this.y -= a.y;
        return this
    }
    ;
    G.Fa = function(a) {
        this.x *= a;
        this.y *= a;
        return this
    }
    ;
    G.clone = function() {
        return new F(this.x,this.y)
    }
    ;
    G.b = function(a) {
        return new F(this.x + a.x,this.y + a.y)
    }
    ;
    G.i = function(a) {
        return new F(this.x - a.x,this.y - a.y)
    }
    ;
    G.a = function(a) {
        return new F(this.x * a,this.y * a)
    }
    ;
    G.rb = function(a) {
        return new F(this.x / a,this.y / a)
    }
    ;
    G.ra = function(a) {
        return this.x * a.x + this.y * a.y
    }
    ;
    G.sa = function() {
        return fa(this.x * this.x + this.y * this.y)
    }
    ;
    G.X = function() {
        return this.x * this.x + this.y * this.y
    }
    ;
    G.fb = function(a) {
        var b = this.x - a.x
          , a = this.y - a.y;
        return fa(b * b + a * a)
    }
    ;
    G.Ya = function(a) {
        var b = this.x - a.x
          , a = this.y - a.y;
        return b * b + a * a
    }
    ;
    G.toString = function() {
        return s(this.x).toString(32) + " " + s(this.y).toString(32)
    }
    ;
    G.toJSON = function() {
        return [this.x, this.y]
    }
    ;
    function J(a, b) {
        this.c = a.clone();
        this.q = a.clone();
        this.h = new F(0,0);
        this.j = b;
        this.size = 10;
        this.oa = 0;
        this.L = j
    }
    var oa = J.prototype;
    oa.la = function(a) {
        this.c.G(a.a(-a.ra(this.h) * this.oa));
        this.wa = j
    }
    ;
    oa.J = function() {
        this.h.G(this.j.P).Fa(0.99);
        this.c.G(this.h);
        this.wa = k;
        this.L && H.L(this);
        this.h = this.c.i(this.q);
        this.q.copy(this.c)
    }
    ;
    oa.clone = function() {
        var a = new J(this.c,this.j);
        a.q = this.q.clone();
        a.h = this.h.clone();
        a.size = this.size;
        a.oa = this.oa;
        return a
    }
    ;
    oa.toJSON = function() {
        return {
            Wa: "BodyPart",
            c: this.c,
            q: this.q,
            h: this.h,
            size: this.size
        }
    }
    ;
    function pa(a, b) {
        this.c = a.clone();
        this.q = a.clone();
        this.h = new F(0,0);
        this.j = b;
        this.size = 10;
        this.oa = 0;
        this.P = this.L = j;
        this.w = this.da = 0
    }
    var qa = pa.prototype;
    qa.la = function(a) {
        this.c.G(a.a(this.w * this.j.direction));
        this.K && this.c.G(a.a(0.3 * -a.ra(this.h)));
        this.da = a.ra(this.h) / this.size;
        this.wa = j
    }
    ;
    qa.J = function() {
        this.h.G(this.j.P).Fa(0.99);
        this.c.G(this.h);
        this.wa = k;
        this.L && H.L(this);
        this.h = this.c.i(this.q);
        this.q.copy(this.c)
    }
    ;
    qa.clone = function() {
        var a = new pa(this.c,this.j);
        a.q = this.q.clone();
        a.h = this.h.clone();
        a.w = this.w;
        return a
    }
    ;
    qa.toJSON = function() {
        return {
            Wa: "Wheel",
            c: this.c,
            q: this.q,
            h: this.h,
            w: this.w,
            da: this.da,
            size: this.size,
            oa: this.oa
        }
    }
    ;
    function ra(a, b) {
        this.c = new F(a.x + 5 * (q() - q()),a.y + 5 * (q() - q()));
        this.q = new F(this.c.x,this.c.y);
        this.h = new F(11 * (q() - q()),11 * (q() - q()));
        this.j = b;
        this.mb = b.j;
        this.size = 2 + 9 * q();
        this.rotation = 6.2 * q();
        this.da = q() - q();
        this.oa = 0.05;
        this.L = j;
        this.shape = [1, 0.7, 0.8, 0.9, 0.5, 1, 0.7, 1]
    }
    var sa = ra.prototype;
    sa.I = function() {
        var a = this.c.C()
          , b = this.size * this.mb.d
          , c = this.shape[0] * b
          , d = a.x + c * r(this.rotation)
          , c = a.y + c * ca(this.rotation)
          , e = 2;
        for (K[A]().m(d, c).fillStyle = "#000"; 8 > e; e++)
            c = this.shape[e - 1] * b / 2,
            d = a.x + c * r(this.rotation + 6.283 * e / 8),
            c = a.y + c * ca(this.rotation + 6.283 * e / 8),
            K.l(d, c);
        K[B]()
    }
    ;
    sa.la = function(a) {
        this.da = a.ra(this.h) / this.size;
        this.c.G(a.a(-a.ra(this.h) * this.oa));
        this.rotation += this.da;
        var b = a.sa();
        0 < b && (a = new F(-a.y / b,a.x / b),
        this.q.G(a.a(0.8 * a.ra(this.h))))
    }
    ;
    sa.J = function() {
        this.rotation += this.da;
        this.h.G(this.j.P);
        this.h = this.h.a(0.99);
        this.c.G(this.h);
        this.wa = k;
        this.L && H.L(this);
        this.h = this.c.i(this.q);
        this.q.copy(this.c)
    }
    ;
    function L(a, b, c) {
        this.u = a;
        this.r = b;
        this.j = c;
        this.p = this.Q = 40;
        this.S = 0.5;
        this.R = 0.7
    }
    var ta = L.prototype;
    ta.V = function(a) {
        this.p += (this.Q - a - this.p) / 5
    }
    ;
    ta.rotate = function(a) {
        var b = this.r.c.i(this.u.c)
          , b = new F(-b.y / this.p,b.x / this.p);
        this.u.c.G(b.a(a));
        this.r.c.G(b.a(-a))
    }
    ;
    ta.J = function() {
        var a = this.r.c.i(this.u.c)
          , b = a.sa();
        if (1 > b)
            return this;
        a = a.a(1 / b);
        b = a.a((b - this.p) * this.R);
        b.G(a.a(this.r.h.i(this.u.h).ra(a) * this.S));
        this.r.h.G(b.a(-1));
        this.u.h.G(b);
        return this
    }
    ;
    ta.ya = function() {
        var a = new F;
        a.copy(this.u.c);
        this.u.c.copy(this.r.c);
        this.r.c.copy(a);
        a.copy(this.u.q);
        this.u.q.copy(this.r.q);
        this.r.q.copy(a);
        a.copy(this.u.h);
        this.u.h.copy(this.r.h);
        this.r.h.copy(a);
        a = this.u.rotation;
        this.u.rotation = this.r.rotation;
        this.r.rotation = a
    }
    ;
    ta.sa = function() {
        return this.r.c.i(this.u.c).sa()
    }
    ;
    ta.clone = function() {
        var a = new L(this.u,this.r,this.j);
        a.Q = this.Q;
        a.p = this.p;
        a.S = this.S;
        a.R = this.R;
        return a
    }
    ;
    ta.toJSON = function() {
        return {
            Wa: "Joint",
            u: this.u,
            r: this.r,
            Q: this.Q,
            p: this.p,
            S: this.S,
            R: this.R
        }
    }
    ;
    function ua(a) {
        this.j = a;
        this.Ja = "hat";
        this.ka = this.Y = k;
        this.M = this.ba = this.ca = this.W = this.K = 0
    }
    var va = ua.prototype;
    E(va, ma.prototype);
    va.ya = function() {
        wa = xa = k;
        this.direction *= -1;
        this.D.ya();
        var a = this.z.p;
        this.z.p = this.A.p;
        this.A.p = a;
        this.Za("turn")
    }
    ;
    va.Db = function() {
        var a = this.j
          , b = this.na;
        this.Za("hitTarget");
        if (this.ka & 2) {
            if (this.Za("hitGoal"),
            a.ja && a.ea === a.ja && 0 < a.currentTime && (!a.time || this.time < a.time) && a.id !== g) {
                if (__ === 40 && confirm("You just set a new Track record!\nYour run will be saved for others to enjoy.")) {
                    for (var b = "", c, d = 0, e = N.length; d < e; d++) {
                        for (c in N[d])
                            isNaN(c) || (b += c + " ");
                        b += ","
                    }
                    c = new XMLHttpRequest;
                    c.open("POST", "/ghost/save", k);
                    c.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    c.send("tid=" + a.id + "&v=" + this.toString() + "&t=" + a.currentTime + "&c=" + b);
                    "ok" !== c.responseText && alert("Server responded: " + c.responseText)
                }
                Aa = Ba = O = Ca = 0
            }
        } else if (this.ka & 1) {
            this.Za("hitCheckpoint");
            c = [];
            b.push([this.head.c.x, this.head.c.y, this.head.q.x, this.head.q.y, this.head.h.x, this.head.h.y, this.g.c.x, this.g.c.y, this.g.q.x, this.g.q.y, this.g.h.x, this.g.h.y, this.g.w, this.n.c.x, this.n.c.y, this.n.q.x, this.n.q.y, this.n.h.x, this.n.h.y, this.n.w, this.F[0].p, this.F[1].p, this.F[2].p, this.direction, this.P.x, this.P.y, this.$, a.ea, c, a.currentTime, this.ba, this.ca, this.W, this.K]);
            for (b = 0; b < a.k.length; b++)
                c.push(a.k[b].ha);
            a.H && (a = a.H,
            Da.push([a.f[0].c.x, a.f[0].c.y, a.f[0].q.x, a.f[0].q.y, a.f[0].h.x, a.f[0].h.y, a.f[1].c.x, a.f[1].c.y, a.f[1].q.x, a.f[1].q.y, a.f[1].h.x, a.f[1].h.y, a.f[1].w, a.f[2].c.x, a.f[2].c.y, a.f[2].q.x, a.f[2].q.y, a.f[2].h.x, a.f[2].h.y, a.f[2].w, a.F[0].p, a.F[1].p, a.F[2].p, a.direction, a.P.x, a.P.y, a.$, a.ba, a.ca, a.W, a.K, a.ea]))
        }
        this.ka = 0
    }
    ;
    va.eb = function() {
        this.Y = j;
        this.head.la = aa();
        this.g.w = 0;
        this.g.K = k;
        this.n.K = k;
        this.head.L = k;
        var a = this.j.t = new Ea(this,this.gb(),this.j);
        a.Ca = new ra(this.head.c.clone(),this);
        a.Ca.h = this.head.h.clone();
        a.Ca.size = 10;
        a.Ca.da = 0.1
    }
    ;
    va.J = function() {
        this.ka && this.Db();
        var a = this.j.currentTime;
        Aa !== this.ba && (N[0][a] = 1,
        this.ba = Aa);
        Ba !== this.ca && (N[1][a] = 1,
        this.ca = Ba);
        O !== this.W && (N[2][a] = 1,
        this.W = O);
        Ca !== this.K && (N[3][a] = 1,
        this.K = Ca);
        xa && (N[4][a] = 1);
        this.Y || this.va();
        for (a = this.F.length - 1; 0 <= a; a--)
            this.F[a].J();
        for (a = this.f.length - 1; 0 <= a; a--)
            this.f[a].J();
        this.g.wa && this.n.wa && (this.$ = k);
        if (!this.$ && !this.Y) {
            this.va();
            for (a = this.F.length - 1; 0 <= a; a--)
                this.F[a].J();
            for (a = this.f.length - 1; 0 <= a; a--)
                this.f[a].J()
        }
    }
    ;
    va.clone = function() {
        var a = this.g.clone()
          , b = this.n.clone()
          , c = this.head.clone()
          , d = this.z.clone()
          , e = this.D.clone()
          , f = this.A.clone();
        return {
            g: a,
            n: b,
            head: c,
            f: [c, a, b],
            F: [d, e, f],
            direction: this.direction,
            P: this.P.clone(),
            $: this.$,
            time: this.time
        }
    }
    ;
    va.toJSON = function() {
        return {
            Wa: this.toString(),
            keys: N.map(Object.keys),
            g: this.g,
            n: this.n,
            head: this.head,
            z: this.z,
            D: this.D,
            A: this.A,
            direction: this.direction,
            P: this.P,
            $: this.$,
            time: this.time
        }
    }
    ;
    va.toString = ba("BikeGeneric");
    function Fa(a, b, c) {
        this.Z = a;
        this.name = a[7] || "Ghost";
        this.j = c;
        this.ea = b[31] || 0;
        this.Ja = "hat";
        this.tb = j;
        this.M = 0;
        this.ha = {}
    }
    var Ga = Fa.prototype;
    Ga.ya = function() {
        this.direction *= -1;
        this.D.ya();
        var a = this.F[0].p;
        this.z.p = this.F[2].p;
        this.A.p = a
    }
    ;
    Ga.J = function() {
        var a = this.j.currentTime
          , b = 0;
        a > this.time && (this.J = aa());
        this.Z[0][a] && (this.ba = this.ba ? 0 : 1);
        this.Z[1][a] && (this.ca = this.ca ? 0 : 1);
        this.Z[2][a] && (this.W = this.W ? 0 : 1);
        this.Z[3][a] && (this.K = this.K ? 0 : 1);
        this.Z[4][a] && this.ya();
        this.va();
        for (b = this.F.length - 1; 0 <= b; b--)
            this.F[b].J();
        for (b = this.f.length - 1; 0 <= b; b--)
            this.f[b].J();
        this.g.wa && this.n.wa && (this.$ = k);
        if (!this.$) {
            this.va();
            for (b = this.F.length - 1; 0 <= b; b--)
                this.F[b].J();
            for (b = this.f.length - 1; 0 <= b; b--)
                this.f[b].J()
        }
    }
    ;
    function Ha(a) {
        ua.call(this, a);
        var b = Ia[Ia.length - 1]
          , c = this;
        c.na = Ia;
        c.f = [c.head = new J(new F(b[0],b[1]),c), c.g = new pa(new F(b[6],b[7]),c), c.n = new pa(new F(b[13],b[14]),c)];
        c.head.q = new F(b[2],b[3]);
        c.head.h = new F(b[4],b[5]);
        c.g.q = new F(b[8],b[9]);
        c.g.h = new F(b[10],b[11]);
        c.g.w = b[12];
        c.n.q = new F(b[15],b[16]);
        c.n.h = new F(b[17],b[18]);
        c.n.w = b[19];
        c.head.size = 14;
        c.head.la = function() {
            c.eb()
        }
        ;
        c.g.size = 11.7;
        c.n.size = 11.7;
        c.F = [c.z = new L(c.head,c.g,c), c.D = new L(c.g,c.n,c), c.A = new L(c.n,c.head,c)];
        c.z.Q = 45;
        c.z.p = b[20];
        c.z.R = 0.35;
        c.z.S = 0.3;
        c.D.Q = 42;
        c.D.p = b[21];
        c.D.R = 0.35;
        c.D.S = 0.3;
        c.A.Q = 45;
        c.A.p = b[22];
        c.A.R = 0.35;
        c.A.S = 0.3;
        c.direction = b[23];
        c.P = new F(b[24],b[25]);
        c.$ = b[26];
        a.ea = b[27];
        for (var d = 0, e = a.k.length; d < e; d++)
            a.k[d].ha = b[28][d];
        c.time = b[29];
        if (c.time) {
            c.ba = b[30];
            c.ca = b[31];
            c.W = b[32];
            c.K = b[33];
            d = 0;
            for (e = N.length; d < e; d++)
                for (var f in N[d])
                    f >= c.time && delete N[d][f]
        } else
            N = [{}, {}, {}, {}, {}]
    }
    var Ja = Ha.prototype;
    E(Ja, ua.prototype);
    Ja.va = function() {
        xa && this.ya();
        this.g.w += (O - this.f[1].w) / 10;
        O && (this.M += this.g.da / 5);
        this.g.K = this.n.K = Ca;
        var a = Aa - Ba;
        this.z.V(5 * a * this.direction);
        this.A.V(5 * -a * this.direction);
        this.D.rotate(a / 6);
        !a && O && (this.z.V(-7),
        this.A.V(7))
    }
    ;
    Ja.I = function() {
        var a, b, c, d, e = this.j.d, f = this.direction, h = this.g.c.C(), i = this.n.c.C();
        K.strokeStyle = "#000";
        K.lineWidth = 3.5 * e;
        K[A]()[z](h.x, h.y, 10 * e, 0, p, j).m(i.x + 10 * e, i.y)[z](i.x, i.y, 10 * e, 0, p, j).s();
        var l = i.x - h.x
          , m = i.y - h.y
          , i = new F((i.y - h.y) * f,(h.x - i.x) * f);
        a = h.x + 0.3 * l + 0.25 * i.x;
        b = h.y + 0.3 * m + 0.25 * i.y;
        var n = h.x + 0.84 * l + 0.42 * i.x
          , x = h.y + 0.84 * m + 0.42 * i.y;
        c = h.x + 0.84 * l + 0.37 * i.x;
        d = h.y + 0.84 * m + 0.37 * i.y;
        var w = h.x + 0.4 * l + 0.05 * i.x
          , y = h.y + 0.4 * m + 0.05 * i.y;
        K.lineWidth = 3 * e;
        K[A]().m(h.x, h.y).l(a, b).l(n, x).m(c, d).l(w, y).l(h.x, h.y);
        c = 6 * r(this.M) * e;
        d = 6 * ca(this.M) * e;
        n = w + c;
        x = y + d;
        c = w - c;
        d = y - d;
        var C = h.x + 0.17 * l + 0.38 * i.x
          , M = h.y + 0.17 * m + 0.38 * i.y
          , X = h.x + 0.3 * l + 0.45 * i.x
          , ya = h.y + 0.3 * m + 0.45 * i.y
          , T = h.x + 0.25 * l + 0.4 * i.x
          , Y = h.y + 0.25 * m + 0.4 * i.y;
        K.m(n, x).l(c, d).m(C, M).l(X, ya).m(w, y).l(T, Y);
        var C = h.x + 0.97 * l
          , M = h.y + 0.97 * m
          , X = h.x + 0.8 * l + 0.48 * i.x
          , ya = h.y + 0.8 * m + 0.48 * i.y
          , T = h.x + 0.86 * l + 0.5 * i.x
          , Y = h.y + 0.86 * m + 0.5 * i.y
          , za = h.x + 0.82 * l + 0.65 * i.x
          , rc = h.y + 0.82 * m + 0.65 * i.y
          , w = h.x + 0.78 * l + 0.67 * i.x
          , y = h.y + 0.78 * m + 0.67 * i.y;
        K.m(h.x + l, h.y + m).l(C, M).l(X, ya).l(T, Y).l(za, rc).l(w, y).s();
        if (!this.Y) {
            K.lineCap = "round";
            i = this.head.c.C();
            i = {
                x: i.x - h.x - 0.5 * l,
                y: i.y - h.y - 0.5 * m
            };
            h = a - 0.1 * l + 0.3 * i.x;
            C = b - 0.1 * m + 0.3 * i.y;
            T = n - h;
            Y = x - C;
            za = T * T + Y * Y;
            M = h + 0.5 * T + 200 * Y * f * e * e / za;
            X = C + 0.5 * Y + 200 * -T * f * e * e / za;
            T = c - h;
            Y = d - C;
            za = T * T + Y * Y;
            ya = h + 0.5 * T + 200 * Y * f * e * e / za;
            T = C + 0.5 * Y + 200 * -T * f * e * e / za;
            K.lineWidth = 6 * e;
            K.strokeStyle = "rgba(0, 0, 0, 0.5)";
            K[A]().m(c, d).l(ya, T).l(h, C).s();
            K.strokeStyle = "#000";
            K[A]().m(n, x).l(M, X).l(h, C).s();
            n = a + 0.05 * l + 0.88 * i.x;
            x = b + 0.05 * m + 0.88 * i.y;
            K.lineWidth = 8 * e;
            K[A]().m(h, C).l(n, x).s();
            c = a + 0.15 * l + 1.05 * i.x;
            d = b + 0.15 * m + 1.05 * i.y;
            K.lineWidth = 2 * e;
            K[A]().m(c + 5 * e, d)[z](c, d, 5 * e, 0, p, j).s()[A]();
            switch (this.Ja) {
            case "cap":
                c = a + 0.4 * l + 1.1 * i.x;
                d = b + 0.4 * m + 1.1 * i.y;
                a = a + 0.05 * l + 1.05 * i.x;
                b = b + 0.05 * m + 1.05 * i.y;
                K.m(a, b).l(c, d).s();
                break;
            case "hat":
                c = a + 0.35 * l + 1.15 * i.x;
                d = b + 0.35 * m + 1.15 * i.y;
                h = a - 0.05 * l + 1.1 * i.x;
                C = b - 0.05 * m + 1.1 * i.y;
                M = a + 0.25 * l + 1.13 * i.x;
                X = b + 0.25 * m + 1.13 * i.y;
                a = a + 0.05 * l + 1.11 * i.x;
                b = b + 0.05 * m + 1.11 * i.y;
                ya = c - 0.1 * l + 0.2 * i.x;
                T = d - 0.1 * m + 0.2 * i.y;
                l = h + 0.02 * l + 0.2 * i.x;
                m = C + 0.02 * m + 0.2 * i.y;
                K.fillStyle = "#000";
                K.m(c, d).l(M, X).l(ya, T).l(l, m).l(a, b).l(h, C).s()[B]();
                break;
            case "party":
                c = a + 0.28 * l + 1.15 * i.x;
                d = b + 0.28 * m + 1.15 * i.y;
                a = a + 0 * l + 1.1 * i.x;
                b = b + 0 * m + 1.1 * i.y;
                h = a + 0.07 * l + 0.33 * i.x;
                C = b + 0.07 * m + 0.33 * i.y;
                K.fillStyle = "#3960ad";
                K.m(c, d).l(h, C).l(a, b)[B]().strokeStyle = "#70d135";
                K.lineWidth = 4 * e;
                K[A]().m(c, d).l(a, b).s().fillStyle = "#ffd600";
                K.lineWidth = 2 * e;
                K[A]().m(h, C)[z](h - 0.01 * l - 0.03 * i.x, C - 0.01 * m - 0.03 * i.y, 3 * e, 0, p)[B]().fillStyle = K.strokeStyle = "#000";
                break;
            case "ninja":
                c = a + 0.26 * l + 1.1 * i.x,
                d = b + 0.26 * m + 1.1 * i.y,
                a = a + 0.05 * l + 1.05 * i.x,
                b = b + 0.05 * m + 1.05 * i.y,
                K.lineWidth = 5 * e,
                K.m(c, d).l(a, b).s().lineWidth = 2 * e,
                K.l(a - (8 + q()) * e * f, b - (4 + q()) * e * f).m(a, b).l(a - (8 + q()) * e * f, b + (4 + q()) * e * f).s()
            }
            l = n - w;
            m = x - y;
            i = {
                x: m * f * e * e,
                y: -l * f * e * e
            };
            f = l * l + m * m;
            l = w + 0.4 * l + 130 * i.x / f;
            m = y + 0.4 * m + 130 * i.y / f;
            K.lineWidth = 5 * e;
            K[A]().m(n, x).l(l, m).l(w, y).s()
        }
    }
    ;
    Ja.gb = function() {
        var a = {}
          , b = this.n.c.i(this.g.c)
          , c = new F(b.y * this.direction,-b.x * this.direction);
        a.head = this.g.c.b(b.a(0.35)).b(this.head.c.i(this.n.c.b(this.g.c).a(0.5)).a(1.2));
        a.ga = a.Pa = this.g.c.b(b.a(0.8)).b(c.a(0.68));
        var d = a.head.i(a.ga)
          , d = new F(d.y * this.direction,-d.x * this.direction);
        a.Ba = a.Ga = a.head.b(a.ga).a(0.5).b(d.a(130 / d.X()));
        a.T = this.g.c.b(b.a(0.2)).b(c.a(0.5));
        var e = new F(6 * r(this.M),6 * ca(this.M));
        a.fa = this.g.c.b(b.a(0.4)).b(c.a(0.05)).b(e);
        d = a.T.i(a.fa);
        d = new F(-d.y * this.direction,d.x * this.direction);
        a.Da = a.T.b(a.fa).a(0.5).b(d.a(160 / d.X()));
        a.ia = this.g.c.b(b.a(0.4)).b(c.a(0.05)).i(e);
        d = a.T.i(a.ia);
        d = new F(-d.y * this.direction,d.x * this.direction);
        a.Ha = a.T.b(a.ia).a(0.5).b(d.a(160 / d.X()));
        return a
    }
    ;
    Ja.toString = ba("BMX");
    function Ka(a, b) {
        var c = Da[Da.length - 1];
        Fa.call(this, a, c, b);
        this.f = [new J(new F(c[0],c[1]),this), new pa(new F(c[6],c[7]),this), new pa(new F(c[13],c[14]),this)];
        this.f[0].q = new F(c[2],c[3]);
        this.f[0].h = new F(c[4],c[5]);
        this.f[1].q = new F(c[8],c[9]);
        this.f[1].h = new F(c[10],c[11]);
        this.f[1].w = c[12];
        this.f[2].q = new F(c[15],c[16]);
        this.f[2].h = new F(c[17],c[18]);
        this.f[2].w = c[19];
        this.head = this.f[0];
        this.head.size = 14;
        this.head.la = aa();
        this.g = this.f[1];
        this.g.size = 11.7;
        this.n = this.f[2];
        this.n.size = 11.7;
        this.F = [this.z = new L(this.f[0],this.f[1],this), this.D = new L(this.f[1],this.f[2],this), this.A = new L(this.f[2],this.f[0],this)];
        this.z.Q = 45;
        this.z.p = c[20];
        this.z.R = 0.35;
        this.z.S = 0.3;
        this.D.Q = 42;
        this.D.p = c[21];
        this.D.R = 0.35;
        this.D.S = 0.3;
        this.A.Q = 45;
        this.A.p = c[22];
        this.A.R = 0.35;
        this.A.S = 0.3;
        this.direction = c[23];
        this.P = new F(c[24],c[25]);
        this.$ = c[26];
        this.ba = c[27];
        this.ca = c[28];
        this.W = c[29];
        this.K = c[30];
        this.time = this.Z[5]
    }
    var La = Ka.prototype;
    E(La, Fa.prototype);
    La.va = function() {
        this.g.w += (this.W - this.f[1].w) / 10;
        this.W && (this.M += this.g.da / 5);
        this.g.K = this.n.K = this.K;
        var a = this.ba - this.ca;
        this.z.V(5 * a * this.direction);
        this.A.V(5 * -a * this.direction);
        this.D.rotate(a / 6);
        !a && this.W && (this.z.V(-7),
        this.A.V(7))
    }
    ;
    La.I = function() {
        var a = this.j
          , b = this.g.c.C()
          , c = this.n.c.C()
          , d = a.d;
        K[A]();
        K.strokeStyle = "rgba(0, 0, 0, 0.5)";
        K.lineWidth = 3.5 * d;
        K[z](b.x, b.y, 10 * d, 0, p, j);
        K.m(c.x + 10 * d, c.y);
        K[z](c.x, c.y, 10 * d, 0, p, j);
        K.s();
        var e = c.i(b)
          , c = new F((c.y - b.y) * this.direction,(b.x - c.x) * this.direction)
          , f = b.b(e.a(0.3)).b(c.a(0.25))
          , h = b.b(e.a(0.84)).b(c.a(0.42))
          , i = b.b(e.a(0.84)).b(c.a(0.37))
          , l = b.b(e.a(0.4)).b(c.a(0.05));
        K[A]();
        K.lineWidth = 3 * d;
        K.m(b.x, b.y);
        K.l(f.x, f.y);
        K.l(h.x, h.y);
        K.m(i.x, i.y);
        K.l(l.x, l.y);
        K.l(b.x, b.y);
        var i = new F(6 * d * r(this.M),6 * d * ca(this.M))
          , h = l.b(i)
          , i = l.i(i)
          , m = b.b(e.a(0.17)).b(c.a(0.38))
          , n = b.b(e.a(0.3)).b(c.a(0.45))
          , x = b.b(e.a(0.25)).b(c.a(0.4));
        K.m(h.x, h.y);
        K.l(i.x, i.y);
        K.m(m.x, m.y);
        K.l(n.x, n.y);
        K.m(l.x, l.y);
        K.l(x.x, x.y);
        var m = b.b(e.a(1)).b(c.a(0))
          , n = b.b(e.a(0.97)).b(c.a(0))
          , x = b.b(e.a(0.8)).b(c.a(0.48))
          , w = b.b(e.a(0.86)).b(c.a(0.5))
          , y = b.b(e.a(0.82)).b(c.a(0.65))
          , l = b.b(e.a(0.78)).b(c.a(0.67));
        K.m(m.x, m.y);
        K.l(n.x, n.y);
        K.l(x.x, x.y);
        K.l(w.x, w.y);
        K.l(y.x, y.y);
        K.l(l.x, l.y);
        K.s();
        c = this.head.c.C().i(b.b(e.a(0.5)));
        b = f.i(e.a(0.1)).b(c.a(0.3));
        n = h.i(b);
        x = new F(n.y * this.direction,-n.x * this.direction);
        x = x.a(d * d);
        m = b.b(n.a(0.5)).b(x.a(200 / n.X()));
        n = i.i(b);
        x = new F(n.y * this.direction,-n.x * this.direction);
        x = x.a(d * d);
        n = b.b(n.a(0.5)).b(x.a(200 / n.X()));
        K[A]();
        K.lineWidth = 6 * d;
        K.strokeStyle = "rgba(0, 0, 0, 0.25)";
        K.m(i.x, i.y);
        K.l(n.x, n.y);
        K.l(b.x, b.y);
        K.s();
        K[A]();
        K.strokeStyle = "rgba(0, 0, 0, 0.5)";
        K.lineWidth = 6 * d;
        K.m(h.x, h.y);
        K.l(m.x, m.y);
        K.l(b.x, b.y);
        K.s();
        h = f.b(e.a(0.05)).b(c.a(0.9));
        K[A]();
        K.lineWidth = 8 * d;
        K.m(b.x, b.y);
        K.l(h.x, h.y);
        K.s();
        K[A]();
        K.lineWidth = 2 * d;
        switch (this.Ja) {
        case "cap":
            i = f.b(e.a(0.4)).b(c.a(1.1));
            e = f.b(e.a(0.05)).b(c.a(1.05));
            K.m(i.x, i.y);
            K.l(e.x, e.y);
            K.s();
            break;
        case "hat":
            i = f.b(e.a(0.35)).b(c.a(1.15));
            b = f.i(e.a(0.05)).b(c.a(1.1));
            m = f.b(e.a(0.25)).b(c.a(1.13));
            f = f.b(e.a(0.05)).b(c.a(1.11));
            n = i.i(e.a(0.1)).G(c.a(0.2));
            x = b.x + 0.02 * e.x + 0.2 * c.x;
            e = b.y + 0.02 * e.y + 0.2 * c.y;
            K.m(i.x, i.y);
            K.l(m.x, m.y);
            K.l(n.x, n.y);
            K.l(x, e);
            K.l(f.x, f.y);
            K.l(b.x, b.y);
            K.fillStyle = "rgba(0, 0, 0, 0.5)";
            K.s();
            K[B]();
            break;
        case "party":
            i = f.x + 0.28 * e.x + 1.15 * c.x,
            b = f.y + 0.28 * e.y + 1.15 * c.y,
            m = f.x + 0 * e.x + 1.1 * c.x,
            f = f.y + 0 * e.y + 1.1 * c.y,
            n = m + 0.07 * e.x + 0.33 * c.x,
            x = f + 0.07 * e.y + 0.33 * c.y,
            K.fillStyle = "#3960ad",
            K.m(i, b).l(n, x).l(m, f)[B]().strokeStyle = "#70d135",
            K.lineWidth = 4 * d,
            K[A]().m(i, b).l(m, f).s().fillStyle = "#ffd600",
            K.lineWidth = 2 * d,
            K[A]().m(n, x)[z](n - 0.01 * e.x - 0.03 * c.x, x - 0.01 * e.y - 0.03 * c.y, 3 * d, 0, p)[B]().fillStyle = K.strokeStyle = "#000"
        }
        e = h.i(l);
        c = {
            x: e.y * this.direction,
            y: -e.x * this.direction
        };
        c = {
            x: c.x * d * d,
            y: c.y * d * d
        };
        f = 130 / (e.x * e.x + e.y * e.y);
        d = l.x + 0.4 * e.x + c.x * f;
        e = l.y + 0.4 * e.y + c.y * f;
        K[A]();
        K.lineWidth = 5 * a.d;
        K.m(h.x, h.y);
        K.l(d, e);
        K.l(l.x, l.y);
        K.s();
        K.strokeStyle = "#000"
    }
    ;
    La.toString = ba("BMX");
    function Ma(a) {
        ua.call(this, a);
        var b = Na[Na.length - 1]
          , c = this;
        c.na = Na;
        this.f = [this.head = new J(new F(b[0],b[1]),this), this.g = new pa(new F(b[6],b[7]),this), this.n = new pa(new F(b[13],b[14]),this)];
        this.f[0].q = new F(b[2],b[3]);
        this.f[0].h = new F(b[4],b[5]);
        this.f[1].q = new F(b[8],b[9]);
        this.f[1].h = new F(b[10],b[11]);
        this.f[1].w = b[12];
        this.f[2].q = new F(b[15],b[16]);
        this.f[2].h = new F(b[17],b[18]);
        this.f[2].w = b[19];
        this.head.size = 14;
        this.head.la = function() {
            c.eb()
        }
        ;
        this.g.size = 14;
        this.n.size = 14;
        this.F = [this.z = new L(this.f[0],this.f[1],this), this.D = new L(this.f[1],this.f[2],this), this.A = new L(this.f[2],this.f[0],this)];
        this.z.Q = 47;
        this.z.p = b[20];
        this.z.R = 0.2;
        this.z.S = 0.3;
        this.D.Q = 45;
        this.D.p = b[21];
        this.D.R = 0.2;
        this.D.S = 0.3;
        this.A.Q = 45;
        this.A.p = b[22];
        this.A.R = 0.2;
        this.A.S = 0.3;
        this.direction = b[23];
        this.P = new F(b[24],b[25]);
        this.$ = b[26];
        a.ea = b[27];
        for (var d = 0; d < a.k.length; d++)
            a.k[d].ha = b[28][d];
        if (this.time = b[29]) {
            this.ba = b[30];
            this.ca = b[31];
            this.W = b[32];
            this.K = b[33];
            for (a = 0; a < N.length; a++)
                for (var e in N[a])
                    e >= this.time && delete N[a][e]
        } else
            N = [{}, {}, {}, {}, {}]
    }
    var Oa = Ma.prototype;
    E(Oa, ua.prototype);
    Oa.va = function() {
        xa && this.ya();
        this.g.w += (O - this.g.w) / 10;
        O && (this.M += this.g.da / 5);
        this.g.K = this.n.K = Ca;
        var a = Aa - Ba;
        this.z.V(5 * a * this.direction);
        this.A.V(5 * -a * this.direction);
        this.D.rotate(a / 8);
        !a && O && (this.z.V(-7),
        this.A.V(7))
    }
    ;
    Oa.I = function() {
        var a = this.j
          , b = this.g.c.C()
          , c = this.n.c.C()
          , d = this.head.c.C()
          , e = c.i(b)
          , f = new F((c.y - b.y) * this.direction,(b.x - c.x) * this.direction)
          , h = d.i(b.b(e.a(0.5)));
        K.strokeStyle = "#000";
        K.lineWidth = 3.5 * a.d;
        K[A]()[z](b.x, b.y, 12.5 * a.d, 0, p, j).m(c.x + 12.5 * a.d, c.y)[z](c.x, c.y, 12.5 * a.d, 0, p, j).s()[A]().fillStyle = "grey";
        K.m(b.x + 5 * a.d, b.y)[z](b.x, b.y, 5 * a.d, 0, p, j).m(c.x + 4 * a.d, c.y)[z](c.x, c.y, 4 * a.d, 0, p, j)[B]()[A]().lineWidth = 5 * a.d;
        K.m(b.x, b.y).l(b.x + 0.4 * e.x + 0.05 * f.x, b.y + 0.4 * e.y + 0.05 * f.y).m(b.x + 0.72 * e.x + 0.64 * h.x, b.y + 0.72 * e.y + 0.64 * h.y).l(b.x + 0.46 * e.x + 0.4 * h.x, b.y + 0.46 * e.y + 0.4 * h.y).l(b.x + 0.4 * e.x + 0.05 * f.x, b.y + 0.4 * e.y + 0.05 * f.y).s()[A]().lineWidth = 2 * a.d;
        var i = new F(6 * r(this.M) * a.d,6 * ca(this.M) * a.d);
        K.m(b.x + 0.72 * e.x + 0.64 * h.x, b.y + 0.72 * e.y + 0.64 * h.y).l(b.x + 0.43 * e.x + 0.05 * f.x, b.y + 0.43 * e.y + 0.05 * f.y).m(b.x + 0.45 * e.x + 0.3 * h.x, b.y + 0.45 * e.y + 0.3 * h.y).l(b.x + 0.3 * e.x + 0.4 * h.x, b.y + 0.3 * e.y + 0.4 * h.y).l(b.x + 0.25 * e.x + 0.6 * h.x, b.y + 0.25 * e.y + 0.6 * h.y).m(b.x + 0.17 * e.x + 0.6 * h.x, b.y + 0.17 * e.y + 0.6 * h.y).l(b.x + 0.3 * e.x + 0.6 * h.x, b.y + 0.3 * e.y + 0.6 * h.y).m(b.x + 0.43 * e.x + 0.05 * f.x + i.x, b.y + 0.43 * e.y + 0.05 * f.y + i.y).l(b.x + 0.43 * e.x + 0.05 * f.x - i.x, b.y + 0.43 * e.y + 0.05 * f.y - i.y).s()[A]().lineWidth = a.d;
        K.m(b.x + 0.46 * e.x + 0.4 * h.x, b.y + 0.46 * e.y + 0.4 * h.y).l(b.x + 0.28 * e.x + 0.5 * h.x, b.y + 0.28 * e.y + 0.5 * h.y).s()[A]().lineWidth = 3 * a.d;
        K.m(c.x, c.y).l(b.x + 0.71 * e.x + 0.73 * h.x, b.y + 0.71 * e.y + 0.73 * h.y).l(b.x + 0.73 * e.x + 0.77 * h.x, b.y + 0.73 * e.y + 0.77 * h.y).l(b.x + 0.7 * e.x + 0.8 * h.x, b.y + 0.7 * e.y + 0.8 * h.y).s();
        if (!this.Y) {
            K.lineCap = "round";
            var f = d.i(b.b(e.a(0.5)))
              , c = b.b(e.a(0.3)).b(f.a(0.25))
              , h = b.b(e.a(0.4)).b(f.a(0.05))
              , d = h.b(i)
              , l = h.i(i)
              , b = b.b(e.a(0.67)).b(f.a(0.8))
              , i = c.b(e.a(-0.05)).b(f.a(0.42))
              , m = d.i(i)
              , h = (new F(m.y * this.direction,-m.x * this.direction)).Fa(a.d * a.d)
              , n = i.b(m.a(0.5)).b(h.a(200 / m.X()))
              , m = l.i(i)
              , h = (new F(m.y * this.direction,-m.x * this.direction)).Fa(a.d * a.d)
              , h = i.b(m.a(0.5)).b(h.a(200 / m.X()));
            K[A]().lineWidth = 6 * a.d;
            K.strokeStyle = "rgba(0, 0, 0, 0.5)";
            K.m(l.x, l.y).l(h.x, h.y).l(i.x, i.y).s()[A]().strokeStyle = "#000";
            K.m(d.x, d.y).l(n.x, n.y).l(i.x, i.y).s().lineWidth = 8 * a.d;
            h = c.b(e.a(0.1)).b(f.a(0.93));
            d = c.b(e.a(0.2)).b(f.a(1.09));
            K[A]().m(i.x, i.y).l(h.x, h.y).s()[A]().lineWidth = 2 * a.d;
            K.m(d.x + 5 * a.d, d.y)[z](d.x, d.y, 5 * a.d, 0, p, j).s()[A]();
            switch (this.Ja) {
            case "cap":
                d = c.b(e.a(0.4)).b(f.a(1.15));
                e = c.b(e.a(0.1)).b(f.a(1.05));
                K.m(d.x, d.y).l(e.x, e.y).s();
                break;
            case "hat":
                d = c.b(e.a(0.37)).b(f.a(1.19)),
                i = c.i(e.a(0.02)).b(f.a(1.14)),
                l = c.b(e.a(0.28)).b(f.a(1.17)),
                c = c.b(e.a(0.09)).b(f.a(1.15)),
                n = d.i(e.a(0.1)).G(f.a(0.2)),
                e = i.b(e.a(0.02)).G(f.a(0.2)),
                K.fillStyle = "#000",
                K.m(d.x, d.y).l(l.x, l.y).l(n.x, n.y).l(e.x, e.y).l(c.x, c.y).l(i.x, i.y).s()[B]()
            }
            e = h.i(b);
            f = new F(e.y * this.direction,-e.x * this.direction);
            f = f.a(a.d * a.d);
            e = b.b(e.a(0.3)).b(f.a(80 / e.X()));
            K.lineWidth = 5 * a.d;
            K[A]().m(h.x, h.y).l(e.x, e.y).l(b.x, b.y).s()
        }
    }
    ;
    Oa.gb = function() {
        var a = {}
          , b = this.n.c.i(this.g.c)
          , c = new F(b.y * this.direction,-b.x * this.direction);
        a.head = this.g.c.b(b.a(0.35)).b(this.head.c.i(this.n.c.b(this.g.c).a(0.5)).a(1.2));
        a.ga = a.Pa = this.g.c.b(b.a(0.8)).b(c.a(0.68));
        var d = a.head.i(a.ga)
          , d = new F(d.y * this.direction,-d.x * this.direction);
        a.Ba = a.Ga = a.head.b(a.ga).a(0.5).b(d.a(130 / d.X()));
        a.T = this.g.c.b(b.a(0.2)).b(c.a(0.5));
        var e = new F(6 * r(this.M),6 * ca(this.M));
        a.fa = this.g.c.b(b.a(0.4)).b(c.a(0.05)).b(e);
        d = a.T.i(a.fa);
        d = new F(-d.y * this.direction,d.x * this.direction);
        a.Da = a.T.b(a.fa).a(0.5).b(d.a(160 / d.X()));
        a.ia = this.g.c.b(b.a(0.4)).b(c.a(0.05)).i(e);
        d = a.T.i(a.ia);
        d = new F(-d.y * this.direction,d.x * this.direction);
        a.Ha = a.T.b(a.ia).a(0.5).b(d.a(160 / d.X()));
        return a
    }
    ;
    Oa.toString = ba("MTB");
    function Pa(a, b) {
        var c = Da[Da.length - 1];
        Fa.call(this, a, c, b);
        this.f = [this.head = new J(new F(c[0],c[1]),this), this.g = new pa(new F(c[6],c[7]),this), this.n = new pa(new F(c[13],c[14]),this)];
        this.head.q = new F(c[2],c[3]);
        this.head.h = new F(c[4],c[5]);
        this.g.q = new F(c[8],c[9]);
        this.g.h = new F(c[10],c[11]);
        this.g.w = c[12];
        this.n.q = new F(c[15],c[16]);
        this.n.h = new F(c[17],c[18]);
        this.n.w = c[19];
        this.head.size = 14;
        this.head.la = aa();
        this.g.size = 14;
        this.n.size = 14;
        this.F = [this.z = new L(this.head,this.g,this), this.D = new L(this.g,this.n,this), this.A = new L(this.n,this.head,this)];
        this.z.Q = 47;
        this.z.p = c[20];
        this.z.R = 0.2;
        this.z.S = 0.3;
        this.D.Q = 45;
        this.D.p = c[21];
        this.D.R = 0.2;
        this.D.S = 0.3;
        this.A.Q = 45;
        this.A.p = c[22];
        this.A.R = 0.2;
        this.A.S = 0.3;
        this.direction = c[23];
        this.P = new F(c[24],c[25]);
        this.$ = c[26];
        this.ba = c[27];
        this.ca = c[28];
        this.W = c[29];
        this.K = c[30];
        this.time = a[5]
    }
    var Qa = Pa.prototype;
    E(Qa, Fa.prototype);
    Qa.va = function() {
        this.g.w += (this.W - this.f[1].w) / 10;
        this.W && (this.M += this.g.da / 5);
        this.g.K = this.n.K = this.K;
        var a = this.ba - this.ca;
        this.z.V(5 * a * this.direction);
        this.A.V(5 * -a * this.direction);
        this.D.rotate(a / 8);
        !a && this.W && (this.z.V(-7),
        this.A.V(7))
    }
    ;
    Qa.I = function() {
        var a = this.g.c.C()
          , b = this.n.c.C()
          , c = this.head.c.C()
          , d = b.i(a)
          , e = new F((b.y - a.y) * this.direction,(a.x - b.x) * this.direction)
          , f = c.i(a.b(d.a(0.5)));
        K.strokeStyle = "rgba(0, 0, 0, 0.5)";
        K.lineWidth = 3.5 * H.d;
        K[A]()[z](a.x, a.y, 12.5 * H.d, 0, p, j).m(b.x + 12.5 * H.d, b.y)[z](b.x, b.y, 12.5 * H.d, 0, p, j).s()[A]().fillStyle = "rgba(0, 0, 0, 0.25)";
        K.m(a.x + 5 * H.d, a.y)[z](a.x, a.y, 5 * H.d, 0, p, j).m(b.x + 4 * H.d, b.y)[z](b.x, b.y, 4 * H.d, 0, p, j)[B]()[A]().lineWidth = 5 * H.d;
        K.m(a.x, a.y).l(a.x + 0.4 * d.x + 0.05 * e.x, a.y + 0.4 * d.y + 0.05 * e.y).m(a.x + 0.72 * d.x + 0.64 * f.x, a.y + 0.72 * d.y + 0.64 * f.y).l(a.x + 0.46 * d.x + 0.4 * f.x, a.y + 0.46 * d.y + 0.4 * f.y).l(a.x + 0.4 * d.x + 0.05 * e.x, a.y + 0.4 * d.y + 0.05 * e.y).s()[A]().lineWidth = 2 * H.d;
        var h = new F(6 * r(this.M) * H.d,6 * ca(this.M) * H.d);
        K.m(a.x + 0.72 * d.x + 0.64 * f.x, a.y + 0.72 * d.y + 0.64 * f.y).l(a.x + 0.43 * d.x + 0.05 * e.x, a.y + 0.43 * d.y + 0.05 * e.y).m(a.x + 0.45 * d.x + 0.3 * f.x, a.y + 0.45 * d.y + 0.3 * f.y).l(a.x + 0.3 * d.x + 0.4 * f.x, a.y + 0.3 * d.y + 0.4 * f.y).l(a.x + 0.25 * d.x + 0.6 * f.x, a.y + 0.25 * d.y + 0.6 * f.y).m(a.x + 0.17 * d.x + 0.6 * f.x, a.y + 0.17 * d.y + 0.6 * f.y).l(a.x + 0.3 * d.x + 0.6 * f.x, a.y + 0.3 * d.y + 0.6 * f.y).m(a.x + 0.43 * d.x + 0.05 * e.x + h.x, a.y + 0.43 * d.y + 0.05 * e.y + h.y).l(a.x + 0.43 * d.x + 0.05 * e.x - h.x, a.y + 0.43 * d.y + 0.05 * e.y - h.y).s()[A]().lineWidth = H.d;
        K.m(a.x + 0.46 * d.x + 0.4 * f.x, a.y + 0.46 * d.y + 0.4 * f.y).l(a.x + 0.28 * d.x + 0.5 * f.x, a.y + 0.28 * d.y + 0.5 * f.y).s()[A]().lineWidth = 3 * H.d;
        K.m(b.x, b.y).l(a.x + 0.71 * d.x + 0.73 * f.x, a.y + 0.71 * d.y + 0.73 * f.y).l(a.x + 0.73 * d.x + 0.77 * f.x, a.y + 0.73 * d.y + 0.77 * f.y).l(a.x + 0.7 * d.x + 0.8 * f.x, a.y + 0.7 * d.y + 0.8 * f.y).s().lineWidth = 6 * H.d;
        var e = c.i(a.b(d.a(0.5)))
          , b = a.b(d.a(0.3)).b(e.a(0.25))
          , f = a.b(d.a(0.4)).b(e.a(0.05))
          , c = f.b(h)
          , h = f.i(h)
          , a = a.b(d.a(0.67)).b(e.a(0.8))
          , i = b.b(d.a(-0.05)).b(e.a(0.42))
          , l = c.i(i)
          , f = new F(l.y * this.direction,-l.x * this.direction)
          , f = f.a(H.d * H.d)
          , m = i.b(l.a(0.5)).b(f.a(200 / l.X()))
          , l = h.i(i)
          , f = new F(l.y * this.direction,-l.x * this.direction)
          , f = f.a(H.d * H.d)
          , f = i.b(l.a(0.5)).b(f.a(200 / l.X()));
        K.strokeStyle = "rgba(0, 0, 0, 0.25)";
        K[A]().m(h.x, h.y).l(f.x, f.y).l(i.x, i.y).s()[A]().strokeStyle = "rgba(0, 0, 0, 0.5)";
        K.m(c.x, c.y).l(m.x, m.y).l(i.x, i.y).s()[A]().lineWidth = 8 * H.d;
        f = b.b(d.a(0.1)).b(e.a(0.95));
        K.m(i.x, i.y).l(f.x, f.y).s()[A]().lineWidth = 2 * H.d;
        switch (this.Ja) {
        case "cap":
            c = b.b(d.a(0.4)).b(e.a(1.15));
            d = b.b(d.a(0.1)).b(e.a(1.05));
            K.m(c.x, c.y).l(d.x, d.y).s();
            break;
        case "hat":
            c = b.b(d.a(0.37)).b(e.a(1.19)),
            h = b.i(d.a(0.02)).b(e.a(1.14)),
            i = b.b(d.a(0.28)).b(e.a(1.17)),
            b = b.b(d.a(0.09)).b(e.a(1.15)),
            m = c.i(d.a(0.1)).G(e.a(0.2)),
            d = h.b(d.a(0.02)).G(e.a(0.2)),
            K.m(c.x, c.y).l(i.x, i.y).l(m.x, m.y).l(d.x, d.y).l(b.x, b.y).l(h.x, h.y).fillStyle = "rgba(0, 0, 0, 0.5)",
            K.s()[B]()
        }
        d = f.i(a);
        e = new F(d.y * this.direction,-d.x * this.direction);
        e = e.a(H.d * H.d);
        d = a.b(d.a(0.3)).b(e.a(80 / d.X()));
        K[A]().lineWidth = 5 * H.d;
        K.m(f.x, f.y).l(d.x, d.y).l(a.x, a.y).s().strokeStyle = "#000"
    }
    ;
    Qa.toString = ba("MTB");
    function Ra() {}
    var Ra = function(a) {
        ua.call(this, a);
        var b = Sa[Sa.length - 1]
          , c = this;
        c.na = Sa;
        this.Ja = "hat";
        this.j = a;
        this.f = [this.head = new J(new F(b[0],b[1]),this), this.g = new pa(new F(b[6],b[7]),this), this.n = new pa(new F(b[13],b[14]),this)];
        this.f[0].q = new F(b[2],b[3]);
        this.f[0].h = new F(b[4],b[5]);
        this.f[1].q = new F(b[8],b[9]);
        this.f[1].h = new F(b[10],b[11]);
        this.f[1].w = b[12];
        this.f[2].q = new F(b[15],b[16]);
        this.f[2].h = new F(b[17],b[18]);
        this.f[2].w = b[19];
        this.head.size = 14;
        this.head.la = function() {
            c.eb()
        }
        ;
        this.g.size = 13;
        this.n.size = 13;
        this.F = [this.z = new L(this.f[0],this.f[1],this), this.D = new L(this.f[1],this.f[2],this), this.A = new L(this.f[2],this.f[0],this)];
        this.z.Q = 35;
        this.z.p = b[20];
        this.z.R = 0.5;
        this.z.S = 0.7;
        this.D.Q = 45;
        this.D.p = b[21];
        this.D.R = 0.2;
        this.D.S = 0.3;
        this.A.Q = 45;
        this.A.p = b[22];
        this.A.R = 0.2;
        this.A.S = 0.3;
        this.Y = this.ka = k;
        this.M = 0;
        this.direction = b[23];
        this.P = new F(b[24],b[25]);
        this.$ = b[26];
        H.ea = b[27];
        for (a = 0; a < H.k.length; a++)
            H.k[a].ha = b[28][a];
        this.K = this.W = this.ca = this.ba = 0;
        if (this.time = b[29]) {
            this.ba = b[30];
            this.ca = b[31];
            this.W = b[32];
            this.K = b[33];
            for (b = 0; b < N.length; b++)
                for (var d in N[b])
                    d >= this.time && delete N[b][d]
        } else
            N = [{}, {}, {}, {}, {}]
    }
      , Ta = Ra.prototype;
    E(Ta, ua.prototype);
    Ta.va = function() {
        xa && this.ya();
        this.g.w += (O - this.g.w) / 10;
        O && (this.M += this.g.da / 5);
        this.g.K = this.n.K = Ca;
        var a = Aa - Ba;
        this.z.V(5 * a * this.direction);
        this.A.V(5 * -a * this.direction);
        this.D.rotate(a / 10);
        !a && O && (this.z.V(-7),
        this.A.V(7))
    }
    ;
    Ta.I = function() {
        var a = this.j
          , b = this.g.c.C()
          , c = this.n.c.C()
          , d = c.i(b)
          , e = new F((c.y - b.y) * this.direction,(b.x - c.x) * this.direction)
          , f = this.head.c.C().i(b.b(d.a(0.5)));
        K[A]();
        K.strokeStyle = "#000";
        K.lineWidth = 3.5 * a.d;
        K[z](b.x, b.y, 12.5 * a.d, 0, p, j);
        K.m(c.x + 12.5 * a.d, c.y);
        K[z](c.x, c.y, 12.5 * a.d, 0, p, j);
        K.s();
        K[A]();
        K.fillStyle = "grey";
        K.m(b.x + 5 * a.d, b.y);
        K[z](b.x, b.y, 5 * a.d, 0, p, j);
        K.m(c.x + 4 * a.d, c.y);
        K[z](c.x, c.y, 4 * a.d, 0, p, j);
        K[B]();
        K[A]();
        K.lineWidth = 5 * a.d;
        K.m(b.x, b.y);
        K.l(b.x + 0.4 * d.x + 0.05 * e.x, b.y + 0.4 * d.y + 0.05 * e.y);
        K.m(b.x + 0.57 * d.x + 0.64 * f.x, b.y + 0.57 * d.y + 0.64 * f.y);
        K.l(b.x + 0.46 * d.x + 0.4 * f.x, b.y + 0.46 * d.y + 0.4 * f.y);
        K.l(b.x + 0.4 * d.x + 0.05 * e.x, b.y + 0.4 * d.y + 0.05 * e.y);
        K.s();
        K[A]();
        K.lineWidth = 2 * a.d;
        K.m(b.x + 0.57 * d.x + 0.64 * f.x, b.y + 0.57 * d.y + 0.64 * f.y);
        K.l(b.x + 0.43 * d.x + 0.05 * e.x, b.y + 0.43 * d.y + 0.05 * e.y);
        K.m(b.x + 0.45 * d.x + 0.3 * f.x, b.y + 0.45 * d.y + 0.3 * f.y);
        K.l(b.x + 0.3 * d.x + 0.4 * f.x, b.y + 0.3 * d.y + 0.4 * f.y);
        K.l(b.x + 0.25 * d.x + 0.6 * f.x, b.y + 0.25 * d.y + 0.6 * f.y);
        K.m(b.x + 0.17 * d.x + 0.6 * f.x, b.y + 0.17 * d.y + 0.6 * f.y);
        K.l(b.x + 0.3 * d.x + 0.6 * f.x, b.y + 0.3 * d.y + 0.6 * f.y);
        K.m(b.x + 0.57 * d.x + 0.64 * f.x, b.y + 0.57 * d.y + 0.64 * f.y);
        K.l(b.x + 0.8 * d.x + 0.2 * f.x, b.y + 0.8 * d.y + 0.2 * f.y);
        K.l(b.x + 0.3 * d.x + 0.05 * e.x, b.y + 0.3 * d.y + 0.05 * e.y);
        K.l(b.x + 0.5 * d.x + 0.05 * e.x, b.y + 0.5 * d.y + 0.05 * e.y);
        K.s();
        K[A]();
        K.lineWidth = a.d;
        K.m(b.x + 0.46 * d.x + 0.4 * f.x, b.y + 0.46 * d.y + 0.4 * f.y);
        K.l(b.x + 0.28 * d.x + 0.5 * f.x, b.y + 0.28 * d.y + 0.5 * f.y);
        K.s();
        K[A]();
        K.lineWidth = 3 * a.d;
        K.m(c.x, c.y);
        K.l(b.x + 0.56 * d.x + 0.73 * f.x, b.y + 0.56 * d.y + 0.73 * f.y);
        K.l(b.x + 0.58 * d.x + 0.77 * f.x, b.y + 0.58 * d.y + 0.77 * f.y);
        K.l(b.x + 0.55 * d.x + 0.8 * f.x, b.y + 0.55 * d.y + 0.8 * f.y);
        K.s()
    }
    ;
    Ta.gb = function() {
        var a = {}
          , b = this.n.c.i(this.g.c)
          , c = new F(b.y * this.direction,-b.x * this.direction);
        a.head = this.g.c.b(b.a(0.35)).b(this.head.c.i(this.n.c.b(this.g.c).a(0.5)).a(1.2));
        a.ga = a.Pa = this.g.c.b(b.a(0.8)).b(c.a(0.68));
        var d = a.head.i(a.ga)
          , d = new F(d.y * this.direction,-d.x * this.direction);
        a.Ba = a.Ga = a.head.b(a.ga).a(0.5).b(d.a(130 / d.X()));
        a.T = this.g.c.b(b.a(0.2)).b(c.a(0.5));
        var e = new F(6 * r(this.M),6 * ca(this.M));
        a.fa = this.g.c.b(b.a(0.4)).b(c.a(0.05)).b(e);
        d = a.T.i(a.fa);
        d = new F(-d.y * this.direction,d.x * this.direction);
        a.Da = a.T.b(a.fa).a(0.5).b(d.a(160 / d.X()));
        a.ia = this.g.c.b(b.a(0.4)).b(c.a(0.05)).i(e);
        d = a.T.i(a.ia);
        d = new F(-d.y * this.direction,d.x * this.direction);
        a.Ha = a.T.b(a.ia).a(0.5).b(d.a(160 / d.X()));
        return a
    }
    ;
    Ta.toString = ba("HAR");
    function Ua(a, b) {
        this.Y = j;
        var c = new F(0,0)
          , d = 0
          , e = 0;
        this.direction = 1;
        this.j = b;
        this.mb = b.j;
        this.f = [this.head = new J(c,this), this.T = new J(c,this), this.Ba = new J(c,this), this.Ga = new J(c,this), this.ga = new J(c,this), this.Pa = new J(c,this), this.Da = new J(c,this), this.Ha = new J(c,this), this.fa = new J(c,this), this.ia = new J(c,this)];
        this.F = [new L(this.head,this.T,this), new L(this.head,this.Ba,this), new L(this.Ba,this.ga,this), new L(this.head,this.Ga,this), new L(this.Ga,this.Pa,this), new L(this.T,this.Da,this), new L(this.Da,this.fa,this), new L(this.T,this.Ha,this), new L(this.Ha,this.ia,this)];
        d = 0;
        for (e = this.f.length; d < e; d++)
            this.f[d].size = 3,
            this.f[d].oa = 0.05;
        this.head.size = this.T.size = 8;
        d = 0;
        for (e = this.F.length; d < e; d++)
            this.F[d].R = 0.4,
            this.F[d].S = 0.7;
        for (d in a)
            a.hasOwnProperty(d) && this[d].c.copy(a[d])
    }
    var Va = Ua.prototype;
    Va.I = function() {
        var a = this.mb
          , b = this.head.c.C()
          , c = this.Ba.c.C()
          , d = this.ga.c.C()
          , e = this.Ga.c.C()
          , f = this.Pa.c.C()
          , h = this.Da.c.C()
          , i = this.fa.c.C()
          , l = this.Ha.c.C()
          , m = this.ia.c.C()
          , n = this.T.c.C();
        K.lineWidth = 5 * a.d;
        K.strokeStyle = "rgba(0,0,0,0.5)";
        K[A]().m(b.x, b.y).l(e.x, e.y).l(f.x, f.y).m(n.x, n.y).l(l.x, l.y).l(m.x, m.y).s();
        K.strokeStyle = "#000";
        K[A]().m(b.x, b.y).l(c.x, c.y).l(d.x, d.y).m(n.x, n.y).l(h.x, h.y).l(i.x, i.y).s();
        K.lineWidth = 8 * a.d;
        K[A]().m(n.x, n.y).l(b.x, b.y).s();
        b.G(b.i(n).a(0.25));
        K.lineWidth = 2 * a.d;
        K[A]().m(b.x + 5 * a.d, b.y)[z](b.x, b.y, 5 * a.d, 0, p, j).s()
    }
    ;
    Va.J = function() {
        for (var a = this.F.length - 1; 0 <= a; a--)
            this.F[a].J();
        for (a = this.f.length - 1; 0 <= a; a--)
            this.f[a].J()
    }
    ;
    Va.Jb = function(a, b) {
        a.Fa(0.7);
        b.Fa(0.7);
        var c, d, e, f;
        c = 0;
        for (d = this.F.length; c < d; c++)
            e = this.F[c].sa(),
            20 < e && (e = 20),
            this.F[c].Q = this.F[c].p = e;
        for (c = 1; 5 > c; c++)
            this.F[c].Q = 13,
            this.F[c].p = 13;
        e = [this.head, this.Ba, this.Ga, this.ga, this.Pa];
        f = [this.T, this.Da, this.Ha, this.fa, this.ia];
        c = 0;
        for (d = e.length; c < d; c++)
            e[c].q = e[c].c.i(a);
        c = 0;
        for (d = f.length; c < d; c++)
            f[c].q = f[c].c.i(b);
        for (c = this.f.length - 1; 0 <= c; c--)
            this.f[c].h.copy(this.f[c].c.i(this.f[c].q)),
            this.f[c].h.x += q() - q(),
            this.f[c].h.y += q() - q()
    }
    ;
    function Ea(a, b, c) {
        this.Y = j;
        this.j = c;
        this.Oa = new Ua(b,this);
        this.Oa.Jb(a.head.h, a.g.h);
        this.Oa.direction = a.direction;
        this.P = this.Oa.P = a.P;
        this.time = a.time;
        this.head = this.Oa.head;
        this.t = a;
        this.Bb = a.clone()
    }
    var Wa = Ea.prototype;
    Wa.I = function() {
        this.t.I();
        this.Oa.I();
        this.Ca && this.Ca.I()
    }
    ;
    Wa.J = function() {
        this.t.J();
        this.Oa.J();
        this.Ca && this.Ca.J()
    }
    ;
    function Xa(a, b, c, d) {
        this.Y = j;
        this.j = d;
        this.w = 30 + 20 * q();
        this.Vb = 0;
        this.$a = [new ra(a,this), new ra(a,this), new ra(a,this), new ra(a,this), new ra(a,this)];
        this.c = a.clone();
        this.P = b;
        this.time = c;
        this.head = new J(a,this);
        this.head.h.x = 20
    }
    var Ya = Xa.prototype;
    Ya.I = function() {
        var a, b;
        if (0 < this.w) {
            this.w -= 10;
            b = this.c.C();
            var c = q() * p
              , d = this.w / 2
              , e = b.x + d * r(c)
              , d = b.y + d * ca(c);
            K.fillStyle = "#ff0";
            K[A]().m(e, d);
            for (a = 1; 16 > a; a++)
                d = (this.w + 30 * q()) / 2,
                e = b.x + d * r(c + p * a / 16),
                d = b.y + d * ca(c + p * a / 16),
                K.l(e, d);
            K[B]()
        }
        a = 0;
        for (b = this.$a.length; a < b; a++)
            this.$a[a].I()
    }
    ;
    Ya.J = function() {
        for (var a = this.$a.length - 1; 0 <= a; a--)
            this.$a[a].J()
    }
    ;
    function Za(a, b, c) {
        this.c = new F(a,b);
        this.j = c;
        this.pb = ia++
    }
    var $a = Za.prototype;
    $a.I = function() {
        var a = this.j
          , b = this.c.C();
        K.fillStyle = this.ua;
        K[A]().m(b.x + 7 * a.d, b.y)[z](b.x, b.y, 7 * a.d, 0, p, j)[B]().s()
    }
    ;
    $a.L = function(a) {
        500 > a.c.Ya(this.c) && !a.j.tb && this.Ea(a)
    }
    ;
    $a.Ua = function(a) {
        return a.fb(this.c) < ab + 7 ? (this.remove(),
        this) : k
    }
    ;
    $a.remove = function() {
        this.qa = j;
        this.j.remove(this.c);
        this.ub();
        return this
    }
    ;
    $a.toString = function() {
        return this.Aa + " " + this.c.toString()
    }
    ;
    $a.Ea = $a.ub = aa();
    function bb(a, b, c) {
        Za.call(this, a, b, c);
        this.ha = k
    }
    var cb = bb.prototype;
    E(cb, Za.prototype);
    cb.I = function() {
        var a = this.j
          , b = this.c.C();
        K.fillStyle = this.ha ? this.qb : this.ua;
        K.lineWidth = 2 * a.d;
        K[A]().m(b.x + 7 * a.d, b.y)[z](b.x, b.y, 7 * a.d, 0, p, j)[B]().s()
    }
    ;
    cb.L = function(a) {
        500 > a.c.Ya(this.c) && this.Ea(a)
    }
    ;
    cb.Ea = function(a) {
        a.j.tb ? this.vb(a) : this.ha || (this.ha = j,
        this.ib(a))
    }
    ;
    cb.ib = cb.vb = aa();
    function db(a, b, c, d) {
        Za.call(this, a, b, d);
        a = c * Math.PI / 180;
        this.rotation = c;
        this.direction = new F(-ca(a),r(a))
    }
    var eb = db.prototype;
    E(eb, Za.prototype);
    eb.I = function() {
        var a = this.j
          , b = this.c.C();
        K.fillStyle = this.ua;
        K[A]().save();
        K.translate(b.x, b.y);
        K.rotate(this.rotation * Math.PI / 180);
        K.m(-7 * a.d, -10 * a.d).l(0, 10 * a.d).l(7 * a.d, -10 * a.d).l(-7 * a.d, -10 * a.d)[B]().s().restore()
    }
    ;
    eb.L = function(a) {
        1E3 > a.c.Ya(this.c) && this.Ea(a)
    }
    ;
    eb.toString = function() {
        return this.Aa + " " + this.c.toString() + " " + (this.rotation - 180).toString(32)
    }
    ;
    function fb(a, b, c) {
        bb.call(this, a, b, c);
        this.ua = "#ff0";
        this.qb = "#ffa";
        this.Aa = "T"
    }
    var gb = fb.prototype;
    E(gb, bb.prototype);
    gb.ib = function(a) {
        var b = this.j;
        b.ea++;
        b.ja && b.ea === b.ja && (a.j.ka |= 2)
    }
    ;
    gb.vb = function(a) {
        a.j.ha.hasOwnProperty(this.pb) || (a.j.ha[this.pb] = ++a.j.ea)
    }
    ;
    gb.ub = function() {
        this.j.ja--
    }
    ;
    function hb(a, b, c) {
        bb.call(this, a, b, c);
        this.ua = "#00f";
        this.qb = "#aaf";
        this.Aa = "C"
    }
    var ib = hb.prototype;
    E(ib, bb.prototype);
    ib.ib = function(a) {
        a.j.ka |= 1;
        console.log("cp", a.j.time, JSON.stringify(a.j))
    }
    ;
    function jb(a, b, c, d) {
        db.call(this, a, b, c, d);
        this.ua = "#ff0";
        this.Aa = "B"
    }
    var kb = jb.prototype;
    E(kb, db.prototype);
    kb.Ea = function(a) {
        for (var a = a.j.f, b = 0, c = a.length; b < c; b++)
            a[b].c.G(this.direction)
    }
    ;
    function lb(a, b, c, d) {
        db.call(this, a, b, c, d);
        this.direction.Fa(0.3);
        this.ua = "#0f0";
        this.Aa = "G"
    }
    var mb = lb.prototype;
    E(mb, db.prototype);
    mb.Ea = function(a) {
        a.j.P.copy(this.direction)
    }
    ;
    function nb(a, b, c) {
        Za.call(this, a, b, c);
        this.ua = "#eee";
        this.Aa = "S";
        this.zb = "s"
    }
    var ob = nb.prototype;
    E(ob, Za.prototype);
    ob.L = function(a) {
        500 > a.c.Ya(this.c) && (a.j.$ = j)
    }
    ;
    function pb(a, b, c) {
        Za.call(this, a, b, c);
        this.ua = "#f00";
        this.Aa = "O";
        this.zb = "e"
    }
    var qb = pb.prototype;
    E(qb, Za.prototype);
    qb.Ea = function(a) {
        this.j.t = new Xa(this.c,a.j.P,a.j.time,this.j)
    }
    ;
    function rb(a, b, c, d, e) {
        this.u = a instanceof F ? a : new F(a,b);
        this.r = b instanceof F ? b : new F(c,d);
        this.ta = this.r.i(this.u);
        this.p = this.ta.sa();
        this.qa = k;
        this.j = e
    }
    var sb = rb.prototype;
    sb.I = function(a, b, c) {
        a.beginPath();
        a.moveTo(this.u.x * this.j.d - b, this.u.y * this.j.d - c);
        a.lineTo(this.r.x * this.j.d - b, this.r.y * this.j.d - c);
        a.stroke()
    }
    ;
    sb.Ua = function(a) {
        var b = a.i(this.u).ra(this.ta.rb(this.p))
          , c = new F(0,0);
        0 >= b ? c.copy(this.u) : b >= this.p ? c.copy(this.r) : c.copy(this.u.b(this.ta.rb(this.p).a(b)));
        return a.i(c).sa() <= ab ? (this.remove(),
        this) : k
    }
    ;
    sb.remove = function() {
        this.qa = j;
        this.j.remove(this.u, this.r);
        return this
    }
    ;
    sb.xb = function() {
        this.j.Ta(this)
    }
    ;
    sb.toString = function() {
        return this.u + this.xa()
    }
    ;
    sb.toJSON = function(a) {
        return {
            Wa: a,
            u: this.u.toJSON(),
            r: this.r.toJSON()
        }
    }
    ;
    function tb(a, b, c, d, e) {
        rb.call(this, a, b, c, d, e)
    }
    var ub = tb.prototype;
    E(ub, rb.prototype);
    ub.L = function(a) {
        if (this.yb)
            return this;
        this.yb = j;
        var b = a.c
          , c = a.h
          , d = a.size
          , e = new F(0,0)
          , f = 0
          , e = b.i(this.u)
          , h = e.ra(this.ta) / this.p / this.p;
        if (0 <= h && 1 >= h && (c = 0 > (e.x * this.ta.y - e.y * this.ta.x) * ((e.x - c.x) * this.ta.y - (e.y - c.y) * this.ta.x) ? -1 : 1,
        e = e.i(this.ta.a(h)),
        f = e.sa(),
        (f < d || 0 > c) && (0 !== f || 514 === this.j.id)))
            return b.G(e.a((d * c - f) / f)),
            a.la(new F(-e.y / f,e.x / f)),
            this;
        if (h * this.p < -d || h * this.p > this.p + d)
            return this;
        e = b.i(0 < h ? this.r : this.u);
        f = e.sa();
        if (f < d && 0 !== f)
            return b.G(e.a((d - f) / f)),
            a.la(new F(-e.y / f,e.x / f)),
            this
    }
    ;
    ub.xa = function() {
        this.ma = j;
        var a = " " + this.r.toString()
          , b = this.j.e[t(this.r.x / this.j.v)][t(this.r.y / this.j.v)].search(this.r, "line");
        b !== g && (a += b.xa());
        return a
    }
    ;
    ub.toString = function() {
        return this.u + this.xa()
    }
    ;
    ub.toJSON = function() {
        return rb.prototype.toJSON.call(this, "SolidLine")
    }
    ;
    function vb(a, b, c, d, e) {
        rb.call(this, a, b, c, d, e);
        this.hb = j
    }
    var wb = vb.prototype;
    E(wb, rb.prototype);
    wb.xa = function() {
        this.ma = j;
        var a = " " + this.r.toString()
          , b = this.j.e[t(this.r.x / this.j.v)][t(this.r.y / this.j.v)].search(this.r, "sline");
        b !== g && (a += b.xa());
        return a
    }
    ;
    wb.toString = function() {
        return this.u + this.xa()
    }
    ;
    wb.toJSON = function() {
        return rb.prototype.toJSON.call(this, "SceneryLine")
    }
    ;
    function xb() {
        this.o = [];
        this.B = [];
        this.k = []
    }
    var yb = xb.prototype;
    yb.L = function(a) {
        for (var b = this.o.length - 1; 0 <= b; b--)
            this.o[b].L(a);
        if (!a.j.Y)
            for (b = this.k.length - 1; 0 <= b; b--)
                this.k[b].L(a);
        return this
    }
    ;
    yb.za = function() {
        for (var a = 0, b = this.o.length; a < b; a++)
            this.o[a].yb = k
    }
    ;
    yb.remove = function() {
        for (var a = [], b = 0, c = this.o.length; b < c; b++)
            this.o[b] && this.o[b].qa && a.push(this.o.splice(b--, 1)[0]);
        b = 0;
        for (c = this.B.length; b < c; b++)
            this.B[b] && this.B[b].qa && a.push(this.B.splice(b--, 1)[0]);
        b = 0;
        for (c = this.k.length; b < c; b++)
            this.k[b] && this.k[b].qa && a.push(this.k.splice(b--, 1)[0]);
        return a
    }
    ;
    yb.search = function(a, b) {
        var c = 0, d, e, f = "sline" === b ? this.B : this.o;
        for (d = f.length; c < d; c++)
            if ((e = f[c]) && e.u.x === a.x && e.u.y === a.y && !e.ma)
                return e
    }
    ;
    var zb = {};
    function Ab(a, b, c) {
        zb[c] || (zb[c] = {});
        var d = a + ";" + b;
        if (zb[c][d])
            return zb[c][d];
        var d = zb[c][d] = []
          , e = new F(a.x,a.y)
          , f = (b.y - a.y) / (b.x - a.x)
          , h = new F(a.x < b.x ? 1 : -1,a.y < b.y ? 1 : -1)
          , i = 0;
        for (d.push(a); 5E3 > i && !(t(e.x / c) === t(b.x / c) && t(e.y / c) === t(b.y / c)); ) {
            var l = new F(0 > h.x ? s(da((e.x + 1) / c + h.x) * c) - 1 : s(t(e.x / c + h.x) * c),0);
            l.y = s(a.y + (l.x - a.x) * f);
            var m = new F(0,0 > h.y ? s(da((e.y + 1) / c + h.y) * c) - 1 : s(t(e.y / c + h.y) * c));
            m.x = s(a.x + (m.y - a.y) / f);
            ea(l.x - a.x, 2) + ea(l.y - a.y, 2) < ea(m.x - a.x, 2) + ea(m.y - a.y, 2) ? (e = l,
            d.push(l)) : (e = m,
            d.push(m));
            i++
        }
        return d
    }
    function Bb(a) {
        return a.map(function(a) {
            a = a.concat();
            a[28] = a[29] = a[30] = 0;
            return a
        })
    }
    function Cb() {
        this.Sa = [];
        this.Ra = 0
    }
    var Db = Cb.prototype;
    Db.push = function(a) {
        this.Sa.length = Math.min(this.Sa.length, this.Ra + 1);
        this.Ra = this.Sa.push(a) - 1;
        return this
    }
    ;
    Db.Qa = function() {
        if (0 <= this.Ra) {
            var a = this.Sa[this.Ra--].Qa;
            "function" === typeof a && a(this)
        }
        return this
    }
    ;
    Db.Ma = function() {
        if (this.Ra < this.Sa.length - 1) {
            var a = this.Sa[++this.Ra].Ma;
            "function" === typeof a && a(this)
        }
        return this
    }
    ;
    function Eb(a) {
        var b, c, d, e;
        this.e = {};
        this.v = 100;
        this.canvas = I;
        this.U = {};
        this.d = 0.6;
        this.currentTime = 0;
        this.id = a;
        this.aa = "BMX";
        this.Kb = 1;
        this.nb = new Cb;
        this.paused = k;
        this.watchGhost = this.ob;
        K[ha]("Loading track... Please wait.", 36, 16);
        this.N = new F(0,0);
        this.id ? 7 < this.id.length ? (a = this.id,
        this.id = g,
        Fb.style.display = "block",
        P = "line") : (a = new XMLHttpRequest,
        a.open("POST", "/tracks/load", k),
        a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
        a.send("id=" + this.id),
        a = a.responseText,
        "v1," !== a.substr(0, 3) && (this.Kb = 0)) : (a = "-18 1i 18 1i##",
        Fb.style.display = "block",
        P = "line");
        this.origCode = a;
        var f = a.split("#")
          , h = f[0] ? f[0].split(",") : []
          , a = 0;
        for (c = h.length; a < c; a++)
            if (e = h[a].split(/\s+/g),
            3 < e.length) {
                b = 0;
                for (d = e.length - 2; b < d; b += 2)
                    this.pa({
                        x: u(e[b], 32),
                        y: u(e[b + 1], 32)
                    }, {
                        x: u(e[b + 2], 32),
                        y: u(e[b + 3], 32)
                    })
            }
        if (1 < f.length) {
            h = f[1].split(",");
            a = 0;
            for (c = h.length; a < c; a++)
                if (e = h[a].split(/\s+/g),
                3 < e.length) {
                    b = 0;
                    for (d = e.length - 2; b < d; b += 2)
                        this.pa({
                            x: u(e[b], 32),
                            y: u(e[b + 1], 32)
                        }, {
                            x: u(e[b + 2], 32),
                            y: u(e[b + 3], 32)
                        }, j)
                }
        }
        this.ea = this.ja = 0;
        this.k = [];
        e = f[2] ? f[2].split(",") : [];
        var i, a = 0;
        for (c = e.length; a < c; a++)
            if (h = e[a].split(/\s+/g),
            2 < h.length) {
                b = u(h[1], 32);
                d = u(h[2], 32);
                switch (h[0]) {
                case "T":
                    i = new fb(b,d,this);
                    this.ja++;
                    this.k.push(i);
                    break;
                case "C":
                    i = new hb(b,d,this);
                    this.k.push(i);
                    break;
                case "B":
                    i = new jb(b,d,u(h[3], 32) + 180,this);
                    break;
                case "G":
                    i = new lb(b,d,u(h[3], 32) + 180,this);
                    break;
                case "O":
                    i = new pb(b,d,this);
                    break;
                case "S":
                    i = new nb(b,d,this)
                }
                i && (b = t(b / this.v),
                d = t(d / this.v),
                this.e[b] === g && (this.e[b] = {}),
                this.e[b][d] === g && (this.e[b][d] = new xb),
                this.e[b][d].k.push(i))
            }
        "MTB" === f[3] || "BMX" === f[3] || "HAR" === f[3] ? (this.aa = f[3],
        this.time = "" !== f[4] ? f[4] : k) : this.time = "" !== f[3] ? f[3] : k
    }
    var Q = Eb.prototype;
    Q.jb = function() {
        1 < Ia.length && Ia.pop();
        1 < Na.length && Na.pop();
        this.H && 1 < Da.length && Da.pop()
    }
    ;
    Q.Na = function() {
        this.kb();
        this.paused = k;
        var a = this.t = this.aa ? "BMX" === this.aa ? new Ha(this) : "HAR" === this.aa ? new Ra(this) : new Ma(this) : k;
        a && (this.O = a.head,
        this.currentTime = a.na[a.na.length - 1][29],
        this.N = a.head.c.clone());
        if (this.H) {
            var b = this.H = "BMX" === this.Z[6] ? new Ka(this.Z,this) : new Pa(this.Z,this);
            if (!a || 1 === a.na.length && !O)
                this.O = b.head
        }
    }
    ;
    Q.reset = function() {
        Ia = [[0, -1, 0, -1, 0, 0, -21, 38, -21, 38, 0, 0, 0, 21, 38, 21, 38, 0, 0, 0, 45, 42, 45, 1, 0, 0.3, k, 0, [], 0]];
        Na = [[2, -3, 2, -3, 0, 0, -23, 35, -23, 35, 0, 0, 0, 23, 35, 23, 35, 0, 0, 0, 47, 45, 45, 1, 0, 0.3, k, 0, [], 0]];
        this.H && (Da = Bb("BMX" === this.Z[6] ? Ia : Na));
        this.Na()
    }
    ;
    Q.kb = function() {
        var a, b, c, d, e;
        for (a in this.e)
            if (this.e.hasOwnProperty(a))
                for (b in this.e[a])
                    if (this.e[a].hasOwnProperty(b)) {
                        e = this.e[a][b];
                        c = 0;
                        for (d = e.k.length; c < d; c++)
                            e.k[c].ha !== g && (e.k[c].ha = k)
                    }
    }
    ;
    Q.ob = function(a) {
        (a = "string" === typeof a && "g" === a.charAt(0) ? u(a.substr(1), 10) : this.sb[u(a, 10) - 1]) && Gb(a, this);
        return this
    }
    ;
    Q.L = function(a) {
        var b = t(a.c.x / this.v - 0.5)
          , c = t(a.c.y / this.v - 0.5)
          , d = this.e;
        d[b] !== g && (d[b][c] !== g && d[b][c].za(),
        d[b][c + 1] !== g && d[b][c + 1].za());
        d[b + 1] !== g && (d[b + 1][c] !== g && d[b + 1][c].za(),
        d[b + 1][c + 1] !== g && d[b + 1][c + 1].za());
        d[b] !== g && d[b][c] !== g && d[b][c].L(a);
        d[b + 1] !== g && (d[b + 1][c] !== g && d[b + 1][c].L(a),
        d[b + 1][c + 1] !== g && d[b + 1][c + 1].L(a));
        d[b] !== g && d[b][c + 1] !== g && d[b][c + 1].L(a);
        return this
    }
    ;
    Q.J = function() {
        this.paused || (this.t && this.t.J(),
        this.H && this.H.J(),
        this.currentTime += __);
        this.I();
        this.t && this.t.I();
        this.H && this.H.I();
        return this
    }
    ;
    Q.I = function() {
        function a() {
            K.fillStyle = "#ffb6c1";
            K[A]()[z](f.x, f.y, (ab - 1) * d, 0, p, j)[B]()
        }
        var b = this.t
          , c = this.currentTime
          , d = this.d
          , e = this.v
          , f = R.C()
          , h = this.e;
        this.O && this.N.G(this.O.c.i(this.N).a(0.2));
        K.clearRect(0, 0, I.width, I.height);
        K.lineWidth = Math.max(2 * d, 0.5);
        if (S && !Hb && ("line" === P || "scenery line" === P || "brush" === P || "scenery brush" === P))
            50 > f.x ? (this.N.x -= 10 / d,
            R.x -= 10 / d) : f.x > I.width - 50 && (this.N.x += 10 / d,
            R.x += 10 / d),
            50 > f.y ? (this.N.y -= 10 / d,
            R.y -= 10 / d) : f.y > I.height - 50 && (this.N.y += 10 / d,
            R.y += 10 / d),
            K.strokeStyle = "#f00",
            f = R.C(),
            K[A]().m(U.C().x, U.C().y).l(f.x, f.y).s();
        var i = (new F(0,0)).Ka()
          , l = (new F(I.width,I.height)).Ka();
        i.x = t(i.x / e);
        i.y = t(i.y / e);
        l.x = t(l.x / e);
        l.y = t(l.y / e);
        var m = [], n, x, w, y, C;
        for (w = i.x; w <= l.x; w++)
            for (y = i.y; y <= l.y; y++)
                if (h[w] !== g && h[w][y] !== g) {
                    if (0 < h[w][y].o.length || 0 < h[w][y].B.length) {
                        m[C = w + "_" + y] = 1;
                        if (this.U[C] === g) {
                            n = this.U[C] = v.createElement("canvas");
                            n.width = e * d;
                            n.height = e * d;
                            var M = n.getContext("2d");
                            M.lineCap = "round";
                            M.lineWidth = Math.max(2 * d, 0.5);
                            M.strokeStyle = "#aaa";
                            n = 0;
                            for (x = h[w][y].B.length; n < x; n++)
                                h[w][y].B[n].I(M, w * e * d, y * e * d);
                            M.strokeStyle = "#000";
                            Ib && (M.shadowOffsetX = M.shadowOffsetY = 2,
                            M.shadowBlur = Math.max(2, 10 * d),
                            M.shadowColor = "#000");
                            n = 0;
                            for (x = h[w][y].o.length; n < x; n++)
                                h[w][y].o[n].I(M, w * e * d, y * e * d)
                        }
                        K.drawImage(this.U[C], t(I.width / 2 - this.N.x * d + w * e * d), t(I.height / 2 - this.N.y * d + y * e * d))
                    }
                    K.strokeStyle = "#000";
                    n = 0;
                    for (x = h[w][y].k.length; n < x; n++)
                        h[w][y].k[n].I()
                }
        for (var X in this.U)
            m[X] === g && delete this.U[X];
        if (250 !== I.width) {
            if (Hb)
                a();
            else if ("camera" !== P && !this.O)
                switch (P) {
                case "line":
                case "scenery line":
                case "brush":
                case "scenery brush":
                    K.lineWidth = 1;
                    K.strokeStyle = "#000";
                    w = f.x;
                    y = f.y;
                    K[A]().m(w - 10, y).l(w + 10, y).m(w, y + 10).l(w, y - 10).s();
                    break;
                case "eraser":
                    a();
                    break;
                case "goal":
                case "checkpoint":
                case "bomb":
                case "slow-mo":
                    K.fillStyle = "goal" === P ? "#ff0" : "checkpoint" === P ? "#00f" : "bomb" === P ? "#f00" : "#eee";
                    K[A]()[z](f.x, f.y, 7 * d, 0, p, j)[B]().s();
                    break;
                case "boost":
                case "gravity":
                    K[A]().fillStyle = "boost" === P ? "#ff0" : "#0f0",
                    K.save(),
                    S ? (K.translate(U.C().x, U.C().y),
                    K.rotate(Math.atan2(-(R.x - U.x), R.y - U.y))) : K.translate(f.x, f.y),
                    K.m(-7 * d, -10 * d).l(0, 10 * d).l(7 * d, -10 * d).l(-7 * d, -10 * d)[B]().s().restore()
                }
            K[A]();
            K.fillStyle = "#ff0";
            K.lineWidth = 1;
            K[z](40, 12, 3.5, 0, p, j)[B]().s()[A]();
            K.lineWidth = 10;
            K.strokeStyle = "#fff";
            K.fillStyle = "#000";
            e = t(c / 6E4);
            h = t(c % 6E4 / 1E3);
            c = t((c - 6E4 * e - 1E3 * h) / 100);
            i = "";
            10 > e && (e = "0" + e);
            10 > h && (h = "0" + h);
            i = e + ":" + h + "." + c;
            if (this.paused)
                i += " - Game paused";
            else if (b && b.Y)
                i = "Press ENTER to restart" + (1 < Ia.length + Na.length ? " or BACKSPACE to cancel Checkpoint" : "");
            else if (this.id === g) {
                if (10 === Jb && ("line" === P || "scenery line" === P || "brush" === P || "scenery brush" === P))
                    i += " - Grid ";
                i += " - " + P;
                if ("brush" === P || "scenery brush" === P)
                    i += " ( size " + Kb + " )"
            }
            V && (!V[0] && !V[1]) && (i += " - " + (this.paused ? "Unp" : "P") + "ause ( SPACE )");
            K.strokeText(i = ": " + this.ea + " / " + this.ja + "  -  " + i, 50, 16);
            K.fillText(i, 50, 16);
            this.H && (K.fillStyle = "#aaa",
            K.textAlign = "right",
            K.strokeText(i = (this.H.name || "Ghost") + (this.H.ea === this.ja ? " finished!" : ": " + this.H.ea + " / " + this.ja), I.width - 7, 16),
            K.fillText(i, I.width - 7, 16),
            K.textAlign = "left",
            K.fillStyle = "#000");
            V && (V[0] ? (K.textAlign = "right",
            v.documentElement.offsetHeight <= window.innerHeight ? (K.strokeText(V[2], I.width - 36, 15 + 25 * V[1]),
            K.fillText(V[2], I.width - 36, 15 + 25 * V[1])) : (K.strokeText(V[2], I.width - 51, 15 + 25 * V[1]),
            K.fillText(V[2], I.width - 51, 15 + 25 * V[1])),
            K.textAlign = "left") : (K.strokeText(V[2], 36, 15 + 25 * V[1]),
            K.fillText(V[2], 36, 15 + 25 * V[1])));
            this.Ab && (b = (I.width - 250) / 2,
            c = (I.height - 150) / 2,
            K.lineWidth = 1,
            K.strokeStyle = "#fff",
            K.fillStyle = "rgba(0, 0, 0, 0.4)",
            K.fc(0, 0, I.width, c).fc(0, c + 150, I.width, c).fc(0, c, b, 150).fc(b + 250, c, b, 150).sR(b, c, 250, 150));
            return this
        }
    }
    ;
    Q.Ua = function(a) {
        function b(b) {
            (b = b.Ua(a)) && l.push(b)
        }
        var c = t(a.x / this.v - 0.5), d = t(a.y / this.v - 0.5), e = this.e[c], c = this.e[c + 1], f, h, i, l = [];
        if (e !== g) {
            f = e[d];
            h = e[d + 1];
            if (f !== g) {
                e = 0;
                for (i = f.o.length; e < i; e++)
                    f.o[e] && b(f.o[e]);
                e = 0;
                for (i = f.B.length; e < i; e++)
                    f.B[e] && b(f.B[e]);
                e = 0;
                for (i = f.k.length; e < i; e++)
                    f.k[e] && b(f.k[e])
            }
            if (h !== g) {
                e = 0;
                for (i = h.o.length; e < i; e++)
                    h.o[e] && b(h.o[e]);
                e = 0;
                for (i = h.B.length; e < i; e++)
                    h.B[e] && b(h.B[e]);
                e = 0;
                for (i = h.k.length; e < i; e++)
                    h.k[e] && b(h.k[e])
            }
        }
        if (c !== g) {
            f = c[d];
            d = c[d + 1];
            if (f !== g) {
                e = 0;
                for (i = f.o.length; e < i; e++)
                    f.o[e] && b(f.o[e]);
                e = 0;
                for (i = f.B.length; e < i; e++)
                    f.B[e] && b(f.B[e]);
                e = 0;
                for (i = f.k.length; e < i; e++)
                    f.k[e] && b(f.k[e])
            }
            if (d !== g) {
                e = 0;
                for (i = d.o.length; e < i; e++)
                    d.o[e] && b(d.o[e]);
                e = 0;
                for (i = d.B.length; e < i; e++)
                    d.B[e] && b(d.B[e]);
                e = 0;
                for (i = d.k.length; e < i; e++)
                    d.k[e] && b(d.k[e])
            }
        }
        e = 0;
        for (i = this.k.length; e < i; e++)
            this.k[e] && this.k[e].qa !== g && l.push(this.k.splice(e--, 1)[0]);
        return l
    }
    ;
    Q.pa = function(a, b, c) {
        a = new (c ? vb : tb)(a.x,a.y,b.x,b.y,this);
        if (2 <= a.p && 1E5 > a.p && (this.Ta(a),
        "brush" === P || "line" === P || "scenery brush" === P || "scenery line" === P))
            "brush" === P || "line" === P ? Lb.copy(R) : Mb.copy(R),
            U.copy(R);
        return a
    }
    ;
    Q.Ta = function(a) {
        var b = Ab(a.u, a.r, this.v), c, d, e, f;
        e = 0;
        for (f = b.length; e < f; e++)
            c = t(b[e].x / this.v),
            d = t(b[e].y / this.v),
            this.e[c] === g && (this.e[c] = {}),
            this.e[c][d] === g && (this.e[c][d] = new xb),
            a.hb ? this.e[c][d].B.push(a) : this.e[c][d].o.push(a),
            delete this.U[c + "_" + d]
    }
    ;
    Q.cb = function(a) {
        var b = t(a.c.x / this.v)
          , c = t(a.c.y / this.v);
        this.e[b] === g && (this.e[b] = {});
        this.e[b][c] === g && (this.e[b][c] = new xb);
        this.e[b][c].k.push(a)
    }
    ;
    Q.G = function(a, b) {
        for (var c = 0, d = a.length; c < d; c++)
            a[c].type && (a[c] = new a[c].type(a[c].x,a[c].y,this)),
            a[c].Eb ? this.cb(a[c]) : b ? this.Ta(a[c]) : this.pa(a[c].u, a[c].r, a[c].hb)
    }
    ;
    Q.remove = function(a, b) {
        b === g && (b = a);
        for (var c = Ab(a, b, this.v), d = [], e = 0, f = c.length; e < f; e++) {
            var h = t(c[e].x / this.v)
              , i = t(c[e].y / this.v)
              , d = d.concat(this.e[h][i].remove());
            delete this.U[h + "_" + i]
        }
        e = 0;
        for (f = d.length; e < f; e++)
            d[e].qa = k
    }
    ;
    Q.La = function(a, b) {
        this.nb.push({
            Qa: a,
            Ma: b
        });
        return this
    }
    ;
    Q.Qa = function() {
        this.nb.Qa();
        return this
    }
    ;
    Q.Ma = function() {
        this.nb.Ma();
        return this
    }
    ;
    Q.lb = function() {
        if ("scenery line" === P || "scenery brush" === P) {
            var a = t(Mb.x / this.v)
              , b = t(Mb.y / this.v);
            (a = this.e[a][b].B[this.e[a][b].B.length - 1]) && a.r.x === s(Mb.x) && a.r.y === s(Mb.y) ? (a.qa = j,
            Mb.copy(a.u),
            this.remove(a.u, a.r)) : alert("No more scenery line to erase!")
        } else
            a = t(Lb.x / this.v),
            b = t(Lb.y / this.v),
            a = this.e[a][b].o[this.e[a][b].o.length - 1],
            a !== g && a.r.x === s(Lb.x) && a.r.y === s(Lb.y) ? (a.qa = j,
            Lb.copy(a.u),
            this.remove(a.u, a.r)) : alert("No more line to erase!")
    }
    ;
    Q.all = function() {
        var a = {
            o: [],
            B: [],
            k: [],
            t: this.aa
        }, b, c, d;
        for (c in this.e)
            for (d in this.e[c])
                b = this.e[c][d],
                la(a.o, b.o),
                la(a.B, b.B),
                la(a.k, b.k);
        return a
    }
    ;
    Q.toString = function() {
        var a = "", b = "", c = "", d;
        for (d in this.e)
            for (var e in this.e[d])
                if (this.e[d][e].o) {
                    for (var f = 0; f < this.e[d][e].o.length; f++)
                        this.e[d][e].o[f].ma || (a += this.e[d][e].o[f].u + this.e[d][e].o[f].xa() + ",");
                    for (f = 0; f < this.e[d][e].B.length; f++)
                        this.e[d][e].B[f].ma || (b += this.e[d][e].B[f].u + this.e[d][e].B[f].xa() + ",");
                    for (f = 0; f < this.e[d][e].k.length; f++)
                        c += this.e[d][e].k[f] + ","
                }
        for (d in this.e)
            for (e in this.e[d])
                if (this.e[d][e].o) {
                    for (f = 0; f < this.e[d][e].o.length; f++)
                        this.e[d][e].o[f].ma = k;
                    for (f = 0; f < this.e[d][e].B.length; f++)
                        this.e[d][e].B[f].ma = k
                }
        return a.substr(0, a.length - 1) + "#" + b.substr(0, b.length - 1) + "#" + c.substr(0, c.length - 1) + "#" + this.aa
    }
    ;
    function Nb() {
        this.e = {};
        this.v = 100;
        this.U = {};
        this.d = 0.6;
        this.currentTime = 0;
        this.id = "SURVIVAL";
        this.aa = "BMX";
        this.paused = k;
        K.fillText("Building track... Please wait.", 36, 16);
        this.N = new F(0,0);
        this.o = [];
        this.k = [];
        this.Xa = 0.5
    }
    var W = Nb.prototype;
    W.jb = function() {
        1 < Ia.length && Ia.pop();
        1 < Na.length && Na.pop();
        this.H && 1 < Da.length && Da.pop()
    }
    ;
    W.Na = function() {
        this.kb();
        this.paused = k;
        var a = this.t = "BMX" === this.aa ? new Ha(this) : "HAR" === this.aa ? new Ra(this) : new Ma(this);
        this.O = a.head;
        if (this.H) {
            var b = this.H = "BMX" === this.Z[6] ? new Ka(this.Z,this) : new Pa(this.Z,this);
            1 === a.na.length && !O && (this.O = b.head)
        }
        this.currentTime = a.na[a.na.length - 1][29];
        this.N = a.head.c.clone()
    }
    ;
    W.reset = function() {
        Ia = [[0, -1, 0, -1, 0, 0, -21, 38, -21, 38, 0, 0, 0, 21, 38, 21, 38, 0, 0, 0, 45, 42, 45, 1, 0, 0.3, k, 0, [], 0]];
        Na = [[2, -3, 2, -3, 0, 0, -23, 35, -23, 35, 0, 0, 0, 23, 35, 23, 35, 0, 0, 0, 47, 45, 45, 1, 0, 0.3, k, 0, [], 0]];
        this.H && (Da = Bb("BMX" === this.Z[6] ? Ia : Na));
        this.Na()
    }
    ;
    W.ob = function(a) {
        (a = "string" === typeof a && "g" === a.charAt(0) ? u(a.substr(1), 10) : this.sb[u(a, 10) - 1]) && Gb(a, this);
        return this
    }
    ;
    W.L = function(a) {
        var b = t(a.c.x / this.v - 0.5)
          , c = t(a.c.y / this.v - 0.5);
        this.e[b] !== g && (this.e[b][c] !== g && this.e[b][c].za(),
        this.e[b][c + 1] !== g && this.e[b][c + 1].za());
        this.e[b + 1] !== g && (this.e[b + 1][c] !== g && this.e[b + 1][c].za(),
        this.e[b + 1][c + 1] !== g && this.e[b + 1][c + 1].za());
        this.e[b] !== g && this.e[b][c] !== g && this.e[b][c].L(a);
        this.e[b + 1] !== g && (this.e[b + 1][c] !== g && this.e[b + 1][c].L(a),
        this.e[b + 1][c + 1] !== g && this.e[b + 1][c + 1].L(a));
        this.e[b] !== g && this.e[b][c + 1] !== g && this.e[b][c + 1].L(a);
        return this
    }
    ;
    W.J = function() {
        this.paused || (this.H && this.H.J(),
        this.t && this.t.J(),
        this.currentTime += __);
        var a;
        a = (a = this.o[this.o.length - 1]) ? a.r : new F(-50,50);
        !this.t.Y && 2E3 > a.fb(this.t.n.c) && (this.pa(a, F.prototype.b.call(a, {
            x: t(100 * q() / this.Xa),
            y: t(20 * (q() - 0.5) * this.Xa)
        })),
        this.Xa += 0.001);
        this.I();
        this.H && this.H.I();
        this.t && this.t.I();
        return this
    }
    ;
    W.I = function() {
        var a = this.t;
        this.O && this.N.G(this.O.c.i(this.N).a(0.2));
        K.clearRect(0, 0, I.width, I.height);
        var b = (new F(0,0)).Ka()
          , c = (new F(I.width,I.height)).Ka();
        b.x = t(b.x / this.v);
        b.y = t(b.y / this.v);
        c.x = t(c.x / this.v);
        c.y = t(c.y / this.v);
        var d = [], e, f, h, i;
        for (h = b.x; h <= c.x; h++)
            for (i = b.y; i <= c.y; i++)
                if (this.e[h] !== g && this.e[h][i] !== g) {
                    if (0 < this.e[h][i].o.length) {
                        d[h + "_" + i] = 1;
                        if (this.U[h + "_" + i] === g) {
                            e = this.U[h + "_" + i] = v.createElement("canvas");
                            e.width = this.v * this.d;
                            e.height = this.v * this.d;
                            e = e.getContext("2d");
                            e.lineCap = "round";
                            e.lineWidth = Math.max(2 * this.d, 0.5);
                            e.strokeStyle = "#000";
                            e = 0;
                            for (f = this.e[h][i].o.length; e < f; e++)
                                this.e[h][i].o[e].I(this.U[h + "_" + i].getContext("2d"), h * this.v * this.d, i * this.v * this.d)
                        }
                        K.drawImage(this.U[h + "_" + i], t(I.width / 2 - this.N.x * this.d + h * this.v * this.d), t(I.height / 2 - this.N.y * this.d + i * this.v * this.d))
                    }
                    K.strokeStyle = "#000"
                }
        for (var l in this.U)
            d[l] === g && delete this.U[l];
        E(K[A](), {
            lineWidth: 10,
            strokeStyle: "#fff",
            fillStyle: "#000"
        });
        !this.t.Y && this.t.n.c.x > this.Cb && (this.Cb = this.t.n.c.x);
        b = t((this.t.Y ? this.t.Bb : this.t).n.c.x / 10) / 10;
        c = Math.max(0, t(9 * (this.t.Y ? this.t.t : this.t).n.h.x) / 10);
        0 === b % 1 && (b += ".0");
        0 === c % 1 && (c += ".0");
        K.strokeText(a = "Distance: " + b + " meters; Speed: " + c + " km/h" + (a.Y ? " - Press ENTER to retry" : ""), 28, 16);
        K.fillText(a, 28, 16);
        this.H && (K.fillStyle = "#aaa",
        K.textAlign = "right",
        K.strokeText(a = (this.H.name || "Ghost") + t(this.H.n.c.x / 10) / 10, I.width - 7, 16),
        K.fillText(a, I.width - 7, 16),
        K.textAlign = "left",
        K.fillStyle = "#000");
        this.t.I();
        return this
    }
    ;
    W.pa = function(a, b, c) {
        a = new (c ? vb : tb)(a.x,a.y,b.x,b.y,this);
        this.Ta(a);
        return a
    }
    ;
    W.Ta = function(a) {
        var b = Ab(a.u, a.r, this.v), c, d, e, f;
        e = 0;
        for (f = b.length; e < f; e++)
            c = t(b[e].x / this.v),
            d = t(b[e].y / this.v),
            this.e[c] === g && (this.e[c] = {}),
            this.e[c][d] === g && (this.e[c][d] = new xb),
            this.e[c][d].o.push(a),
            this.o.push(a),
            delete this.U[c + "_" + d]
    }
    ;
    W.cb = function(a) {
        var b = t(a.c.x / this.v)
          , c = t(a.c.y / this.v);
        this.e[b] === g && (this.e[b] = {});
        this.e[b][c] === g && (this.e[b][c] = new xb);
        this.e[b][c].k.push(a)
    }
    ;
    W.G = function(a) {
        for (var b = 0, c = a.length; b < c; b++)
            a[b].Eb ? this.cb(a[b]) : this.pa(a[b].u, a[b].r, a[b].hb)
    }
    ;
    W.kb = W.Ua = W.remove = W.La = W.Qa = W.Ma = W.lb = function() {
        return this
    }
    ;
    W.toString = function() {
        return "v1,SURVIVAL#" + this.aa
    }
    ;
    v.createElement("canvas").getContext || (location.href = "http://canvasrider.com/error");
    var I = v.getElementById("canvas_rider")
      , K = I.getContext("2d");
    K.lineCap = "round";
    K.lineJoin = "round";
    K.font = "8px eiven";
    function Ob() {
        var a = K[Pb]
          , b = K;
        return function() {
            a.apply(b, arguments);
            return b
        }
    }
    for (var Pb in K)
        "function" === typeof K[Pb] && (K[Pb.charAt(0) + (Pb.charAt(6) || "")] = Ob());
    K.s = function() {
        K.stroke();
        return K
    }
    ;
    var H, Ia = [[0, -1, 0, -1, 0, 0, -21, 38, -21, 38, 0, 0, 0, 21, 38, 21, 38, 0, 0, 0, 45, 42, 45, 1, 0, 0.3, k, 0, [], 0]], Na = [[2, -3, 2, -3, 0, 0, -23, 35, -23, 35, 0, 0, 0, 23, 35, 23, 35, 0, 0, 0, 47, 45, 45, 1, 0, 0.3, k, 0, [], 0]], Sa = [[-5, 4.5, -5, 4.5, 0, 0, -23, 35, -23, 35, 0, 0, 0, 23, 35, 23, 35, 0, 0, 0, 35, 45, 45, 1, 0, 0.3, k, 0, [], 0]], Da, N = [{}, {}, {}, {}, {}], Aa = 0, Ba = 0, O = 0, Ca = 0, xa = 0, wa = j, S = k, U = new F(40,50), R = new F(0,0), Kb = 20, ab = 15, Z = k, P = "camera", Qb = "camera", Rb = k, Hb = k, V = k, Jb = 1, Sb = [], Ib = k, Tb = [";Restart ( ENTER );Cancel Checkpoint ( BACKSPACE );;Switch bike ( ctrl+B - Arrows to control, Z to turn );;Enable line shading;Enable fullscreen ( F )".split(";"), "Brush ( A - Hold to snap, hold & scroll to adjust size );Scenery brush ( S - Hold to snap, hold & scroll to adjust size );Lines ( backWheel - Hold to snap );Scenery lines ( W - Hold to snap );Eraser ( E - Hold & scroll to adjust size );Camera ( R - Release or press again to switch back, scroll to zoom );Enable grid snapping ( G );;Goal;Checkpoint;Boost;Gravity modifier;Bomb;Slow-Mo;;Shorten last line ( Z )".split(";")], Lb = new F(40,50), Mb = new F(-40,50), Ub = D("trackcode"), Vb = D("charcount"), Wb = D("content"), Xb = D("new"), Yb = D("load"), Zb = D("save"), $b = D("upload"), ac = D("toolbar1"), Fb = D("toolbar2");
    E(ac.style, {
        top: I.offsetTop + "px",
        left: I.offsetLeft + "px",
        display: "block"
    });
    E(Fb.style, {
        top: I.offsetTop + "px",
        left: I.offsetLeft + I.width - 22 + "px"
    });
    function bc(a, b) {
        cc();
        if ("SURVIVAL" === a)
            var c = new Nb;
        else
            c = new Eb(a),
            c.sb = b;
        c.t = "BMX" === c.aa ? new Ha(c) : "HAR" === c.aa ? new Ra(c) : new Ma(c);
        c.O = c.t.head;
        Sb.push(function() {
            c.J()
        });
        return H = c
    }
    setInterval(function() {
        for (var a = Sb.length; a--; )
            Sb[a]()
    }, __);
    var dc = {
        parse: function(a) {
            return dc.bb.parse(a)
        },
        bb: {
            wb: function(a, b) {
                var c = a.split(","), d, e, f, h, i;
                e = 0;
                for (f = c.length; e < f; e++)
                    if (d = c[e].split(" "),
                    3 < d.length) {
                        h = 0;
                        for (i = d.length - 2; h < i; h += 2)
                            b.push({
                                u: {
                                    x: u(d[h], 32),
                                    y: u(d[h + 1], 32)
                                },
                                r: {
                                    x: u(d[h + 2], 32),
                                    y: u(d[h + 3], 32)
                                }
                            })
                    }
            },
            parse: function(a) {
                var b = a.split("#"), c, d, e, a = {
                    o: [],
                    B: [],
                    k: [],
                    t: b[3] || "BMX"
                };
                0 < b.length && dc.bb.wb(b[0], a.o);
                1 < b.length && dc.bb.wb(b[1], a.B);
                if (2 < b.length) {
                    var f = b[2] ? b[2].split(",") : [], h, b = 0;
                    for (c = f.length; b < c; b++)
                        if (h = f[b].split(" "),
                        2 < h.length)
                            switch (d = u(h[1], 32),
                            e = u(h[2], 32),
                            h[0]) {
                            case "T":
                                a.k.push({
                                    type: fb,
                                    x: d,
                                    y: e
                                });
                                break;
                            case "C":
                                a.k.push({
                                    type: hb,
                                    x: d,
                                    y: e
                                });
                                break;
                            case "B":
                                a.k.push({
                                    type: jb,
                                    x: d,
                                    y: e,
                                    dir: u(h[3], 32) + 180
                                });
                                break;
                            case "G":
                                a.k.push({
                                    type: lb,
                                    x: d,
                                    y: e,
                                    dir: u(h[3], 32) + 180
                                });
                                break;
                            case "O":
                                a.k.push({
                                    type: pb,
                                    x: d,
                                    y: e
                                });
                                break;
                            case "S":
                                a.k.push({
                                    type: nb,
                                    x: d,
                                    y: e
                                })
                            }
                }
                return a
            },
            Ob: function(a) {
                var b = [], c = [], d = [], e = a.t || "BMX", f, h;
                f = 0;
                for (h = a.o.length; f < h; f++)
                    a.o[f].ma || b.push(a.o[f].toString());
                f = 0;
                for (h = a.B.length; f < h; f++)
                    a.B[f].ma || c.push(a.B[f].toString());
                f = 0;
                for (h = a.k.length; f < h; f++)
                    d.push(a.k[f].toString());
                f = 0;
                for (h = Math.max(a.o.length, a.B.length); f < h; f++)
                    a.o[f] && (a.o[f].ma = k),
                    a.B[f] && (a.B[f].ma = k);
                return b + "#" + c + "#" + d + "#" + e
            }
        }
    };
    function Gb(a, b) {
        var b = b || H
          , c = "id=" + a
          , d = new XMLHttpRequest
          , e = ja();
        d.onload = function() {
            e.Va(d.responseText)
        }
        ;
        d.open("POST", "/ghost/load", j);
        d.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        d.send(c);
        e.ab(function(a) {
            var a = a.split(",")
              , c = [{}, {}, {}, {}, {}];
            5 < a.length && (c = c.concat(a.slice(5)));
            for (var d = 0, e, m, n; 5 > d; d++) {
                n = a[d].split(" ");
                e = 0;
                for (m = n.length - 1; e < m; e++)
                    c[d][n[e]] = 1
            }
            b.H = (b.Z = c)[5];
            b.reset()
        })
    }
    function ec() {
        H.aa = "BMX" === H.aa ? "MTB" : "BMX";
        H.reset()
    }
    function fc() {
        var a = H.Ua(R);
        a.length && H.La(function() {
            H.G(a, j)
        }, function() {
            for (var b = 0, c = a.length; b < c; b++)
                a[b].remove()
        })
    }
    function gc() {
        I.width = window.innerWidth;
        I.height = window.innerHeight;
        I.style.position = "fixed";
        document.body.style.overflow = 'hidden';
        I.style.top = I.style.left = 0;
        I.style.border = "none";
        Fb.style.left = I.width - (v.documentElement.offsetHeight <= window.innerHeight ? 24 : 39) + "px";
        V[2] = Tb[0][7] = "Disable fullscreen ( ESC or F )";
        window.scrollTo(0, 0);
        I.style.zIndex = 2E3;
        ac.style.zIndex = Fb.style.zIndex = 2001
    }
    function cc() {
        document.body.style.overflowX = 'auto';
        document.body.style.overflowY = 'scroll';
        I.width = 700;
        I.height = 400;
        I.style.position = "static";
        I.style.border = "1px solid black";
        Fb.style.left = I.offsetLeft + I.width - 22 + "px";
        V[2] = Tb[0][7] = "Enable fullscreen ( F )";
        I.style.zIndex = ac.style.zIndex = Fb.style.zIndex = 2
    }
    function hc() {
        K.lineCap = "round";
        K.lineJoin = "round";
        K.font = "8px eiven";
        ac.style.top = Fb.style.top = I.offsetTop + "px";
        ac.style.left = I.offsetLeft + "px"
    }
    window.onresize = function() {
        (700 === I.width ? cc : gc)();
        hc()
    }
    ;
    function ic() {
        (700 === I.width ? gc : cc)();
        hc()
    }
    function jc(a) {
        a.addEventListener("focus", kc);
        a.addEventListener("blur", lc)
    }
    v.onkeydown = function(a) {
        switch (a.keyCode) {
        case 8:
            250 !== I.width && a.preventDefault();
            H.jb();
            H.Na();
            break;
        case 13:
            a.preventDefault();
            H.Na();
            break;
        case 37:
            H.t && (a.preventDefault(),
            H.O = H.t.head,
            Aa = 1);
            break;
        case 39:
            H.t && (a.preventDefault(),
            H.O = H.t.head,
            Ba = 1);
            break;
        case 38:
            H.t && (a.preventDefault(),
            H.O = H.t.head,
            O = 1);
            break;
        case 40:
            H.t && (a.preventDefault(),
            H.O = H.t.head,
            Ca = 1);
            break;
        case 109:
        case 189:
            mc(-1);
            break;
        case 107:
        case 187:
            mc(1);
            break;
        case 90:
        case 222:
            !H.O && H.id === g ? H.lb() : wa && (xa = 1);
            break;
        case 32:
            250 !== I.width && a.preventDefault(),
            H.paused = !H.paused
        }
        if (H.id === g)
            switch (a.keyCode) {
            case 65:
                "brush" !== P ? (P = "brush",
                ga.style.cursor = "none",
                Z = j) : S || (S = j,
                U.copy(Lb),
                Z = j);
                break;
            case 83:
                "scenery brush" !== P ? (P = "scenery brush",
                ga.style.cursor = "none",
                Z = j) : S || (S = j,
                U.copy(Mb),
                Z = j);
                break;
            case 81:
                "line" !== P ? (P = "line",
                ga.style.cursor = "none") : S || (S = j,
                U.copy(Lb),
                Z = j);
                break;
            case 87:
                "scenery line" !== P ? (P = "scenery line",
                ga.style.cursor = "none") : S || (S = j,
                U.copy(Mb),
                Z = j);
                break;
            case 69:
                P = "eraser";
                ga.style.cursor = "none";
                Z = j;
                break;
            case 82:
                "camera" !== P ? (Qb = P,
                P = "camera",
                ga.style.cursor = "move") : Rb = j;
                break;
            case 77:
                H.Qa();
                break;
            case 78:
                H.Ma()
            }
    }
    ;
    v.onkeypress = function(a) {
        switch (a.keyCode) {
        case 13:
        case 37:
        case 39:
        case 38:
        case 40:
            a.preventDefault();
            break;
        case 8:
        case 32:
            250 !== I.width && a.preventDefault();
            break;
        case 113:
            H.t.ka = k
        }
    }
    ;
    v.onkeyup = function(a) {
        switch (a.keyCode) {
        case 70:
        case 27:
            ic();
            break;
        case 66:
            a.ctrlKey && ec();
            break;
        case 37:
            Aa = 0;
            break;
        case 39:
            Ba = 0;
            break;
        case 38:
            O = 0;
            break;
        case 40:
            Ca = 0;
            break;
        case 90:
        case 222:
            wa = j;
            break;
        case 71:
            H.H ? H.O = H.H.head === H.O && H.t ? H.t.head : H.H.head : (Jb = 11 - Jb,
            Tb[1][6] = (1 === Jb ? "En" : "Dis") + "able grid snapping ( G )");
            break;
        case 82:
            Rb && (P = Qb,
            ga.style.cursor = "none",
            Rb = k);
            break;
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
            H.id !== g && H.ob(a.keyCode - 48);
            break;
        case 81:
        case 87:
        case 69:
        case 83:
            H.H && (H.O === H.H.head && (H.O = H.t.head),
            H.H = k);
        case 65:
            Z && (S = Z = k)
        }
    }
    ;
    ac.onmousemove = function(a) {
        a = t((a.clientY - ac.offsetTop + window.pageYOffset) / 25);
        V = [0, a, Tb[0][a]]
    }
    ;
    Fb.onmousemove = function(a) {
        a = t((a.clientY - Fb.offsetTop + window.pageYOffset) / 25);
        V = [1, a, Tb[1][a]];
        if (14 === a && ("scenery line" === P || "scenery brush" === P))
            V[2] = "Shorten last set of scenery lines ( Z )"
    }
    ;
    ac.onmousedown = function(a) {
        H.O = k;
        switch (t((a.clientY - ac.offsetTop + window.pageYOffset) / 25) + 1) {
        case 1:
            H.paused = !H.paused;
            break;
        case 3:
            H.jb();
        case 2:
            H.Na();
            break;
        case 5:
            ec();
            break;
        case 7:
            Ib ? (Ib = k,
            V[2] = Tb[0][6] = "Enable line shading") : (Ib = j,
            V[2] = Tb[0][6] = "Disable line shading");
            H.U = [];
            break;
        case 8:
            ic()
        }
    }
    ;
    Fb.onmousedown = function(a) {
        if (H.id !== g)
            return k;
        H.O = k;
        switch (t((a.clientY - ac.offsetTop + window.pageYOffset) / 25) + 1) {
        case 1:
            P = "brush";
            break;
        case 2:
            P = "scenery brush";
            break;
        case 3:
            P = "line";
            break;
        case 4:
            P = "scenery line";
            break;
        case 5:
            P = "eraser";
            break;
        case 6:
            P = "camera";
            break;
        case 7:
            1 === Jb ? (Jb = 10,
            V[2] = Tb[1][6] = "Disable grid snapping ( G )") : (Jb = 1,
            V[2] = Tb[1][6] = "Enable grid snapping ( G )");
            break;
        case 9:
            P = "goal";
            break;
        case 10:
            P = "checkpoint";
            break;
        case 11:
            P = "boost";
            break;
        case 12:
            P = "gravity";
            break;
        case 13:
            P = "bomb";
            break;
        case 14:
            P = "slow-mo";
            break;
        case 16:
            H.lb()
        }
    }
    ;
    I.onmouseover = function() {
        V = k;
        ga.style.cursor = "camera" === P ? "move" : "none"
    }
    ;
    I.onmousedown = function(a) {
        a.preventDefault();
        S = j;
        H.O = k;
        if (window.BHR_RCE_ENABLED && 2 === a.button && "camera" !== P)
            fc(),
            Hb = j;
        else {
            var b;
            Z || U.copy(R);
            switch (P) {
            case "boost":
            case "gravity":
                ga.style.cursor = "crosshair";
                break;
            case "eraser":
                fc();
                break;
            case "goal":
                H.k.push(b = new fb(U.x,U.y,H));
                H.ja++;
                break;
            case "checkpoint":
                H.k.push(b = new hb(U.x,U.y,H));
                break;
            case "bomb":
                b = new pb(U.x,U.y,H);
                break;
            case "slow-mo":
                b = new nb(U.x,U.y,H);
            case "brush":
            case "scenery brush":
                Z && H.pa(U, R, "brush" !== P),
                Z = k,
                S = j
            }
            if (b !== g) {
                var c = t(b.c.x / H.v)
                  , d = t(b.c.y / H.v);
                H.e[c] === g && (H.e[c] = []);
                H.e[c][d] === g && (H.e[c][d] = new xb);
                H.e[c][d].k.push(b);
                H.La(function() {
                    b.remove()
                }, function() {
                    b instanceof fb && ++H.ja;
                    H.e[c][d].k.push(b)
                })
            }
        }
    }
    ;
    I.oncontextmenu = function(a) {
        a.preventDefault()
    }
    ;
    v.onmousemove = function(a) {
        "camera" !== P && (H.O = k);
        R = (new F(a.clientX - I.offsetLeft,a.clientY - I.offsetTop + window.pageYOffset)).Ka();
        "eraser" !== P && 2 !== a.button && (R.x = s(R.x / Jb) * Jb,
        R.y = s(R.y / Jb) * Jb);
        if (S)
            if ("camera" === P)
                H.N.G(U.i(R)),
                R.copy(U);
            else if ("eraser" === P || window.BHR_RCE_ENABLED && 2 === a.button)
                fc();
            else if (!Z && ("brush" === P || "scenery brush" === P) && U.fb(R) >= Kb) {
                var b = H.pa(U, R, "brush" !== P);
                H.La(function() {
                    b.remove()
                }, function() {
                    b.xb()
                })
            }
    }
    ;
    I.onmouseup = function() {
        var a, b, c, d;
        if (Hb)
            return Hb = k;
        if (S)
            if ("line" === P || "scenery line" === P || "brush" === P || "scenery brush" === P) {
                var e = H.pa(U, R, "line" !== P && "brush" !== P);
                H.La(function() {
                    e.remove()
                }, function() {
                    e.xb()
                })
            } else if ("boost" === P || "gravity" === P)
                ga.style.cursor = "none",
                d = s(180 * Math.atan2(-(R.x - U.x), R.y - U.y) / Math.PI),
                c = "boost" === P ? new jb(U.x,U.y,d,H) : new lb(U.x,U.y,d,H),
                a = t(c.c.x / H.v),
                b = t(c.c.y / H.v),
                H.e[a] === g && (H.e[a] = []),
                H.e[a][b] === g && (H.e[a][b] = new xb),
                H.e[a][b].k.push(c),
                H.La(function() {
                    c.remove()
                }, function() {
                    H.e[a][b].k.push(c)
                })
    }
    ;
    v.onmouseup = function() {
        Z || (S = k)
    }
    ;
    I.onmouseout = function() {
        ga.style.cursor = "default"
    }
    ;
    Xb && (Xb.onclick = function() {
        confirm("Do you really want to start a new track?") && (Sb.pop(),
        H = bc("-18 1i 18 1i##", []),
        Vb.innerHTML = "trackcode",
        Ub.value = null,
        H.reset())
    }
    );
    Yb && (Yb.onclick = function() {
        10 < Ub.value.length ? (Sb.pop(),
        H = bc(Ub.value, []),
        Vb.innerHTML = "Trackcode",
        Ub.value = null,
        H.reset()) : alert("No trackcode to load!")
    }
    );
    Zb && (Zb.onclick = function() {
        H.id === g && (Ub.value = H.toString(),
        Ub.select(),
        Vb.innerHTML = "Trackcode - " + s(Ub.value.length / 1E3) + "k - CTRL + C to copy")
    }
    );
    $b && ($b.onclick = function() {
        var a = H.toString();
        if (0 < a.length) {
            H.paused = j;
            P = "camera";
            nc(j);
            ac.style.display = "none";
            Fb.style.display = "none";
            K.lineCap = "round";
            K.lineJoin = "round";
            v.getElementById("track_menu").style.display = "none";
            var b = D(["input#name.input-block-level", {
                type: "text",
                size: 18,
                Qb: 20,
                placeholder: "Name..."
            }])
              , c = D(["textarea.input-block-level", {
                rows: 4,
                placeholder: "Description..."
            }])
              , d = D(["input.btn.btn-primary.btn-block.btn-large", {
                type: "submit",
                value: "Save track"
            }])
              , e = D(["div.span3", "Visibility:"])
              , f = D(["div.btn-group.span9", {
                "data-toggle": "buttons-radio"
            }, ["button.btn#optPublic.active", ["i.icon-globe"], " Public"], ["button.btn#optHidden", ["i.icon-eye-close"], " Hidden"], ["button.btn#optPrivate", ["i.icon-lock"], " Private"]])
              , h = D(["input.span12", {
                placeholder: "Partners...",
                type: "text"
            }])
              , i = D(["div.span5"])
              , l = D(["label.hide.row-fluid", ["div.span3", "Collaboration with: "], ["div.span4", [h]], [i]])
              , m = D(["div.row-fluid"])
              , n = D(["div"])
              , x = D(["div.well.row-fluid#track_menu"]);
            n.style.color = I.style.borderColor = "#f00";
            n.innerHTML = "Use your mouse to drag & fit an interesting part of your track in the thumbnail";
            l.style.lineHeight = e.style.lineHeight = "30px";
            var w = function(a) {
                for (var b = [].slice.call(arguments, 1), c = 0, d = b.length; c < d; c++)
                    a.appendChild(b[c]);
                return a
            };
            w(x, b, c, w(m, e, f), d);
            Wb.insertBefore(x, I.nextSibling);
            Wb.insertBefore(n, I);
            for (var e = ja(), m = ja(), n = [e, m], x = function(a) {
                return function(b) {
                    X[a] = b;
                    0 < --M || y.Va(X);
                    return b
                }
            }, y = ja(), w = 0, C = n.length, M = C, X = Array(C); w < C; w++)
                n[w].ab(x(w));
            n = y;
            (new Request.JSON({
                url: "/call/all-usernames",
                Ub: e.Va
            })).send();
            require(["/js/lib/mootagify.js?" + String.uniqueID()], m.Va);
            n.ab(function(a) {
                var b = a[0];
                new a[1](l.removeClass("hide"),null,{
                    Yb: "b.tagif-tag",
                    Nb: "span.remove-tag",
                    Rb: 1,
                    Pb: Infinity,
                    Lb: j,
                    target: i,
                    Mb: b.map(function(a) {
                        return a.Zb
                    }).erase(BH.get("user.name"))
                })
            });
            jc(b);
            b.addEventListener("keypress", function(a) {
                a.stopPropagation()
            }, k);
            b.focus();
            jc(h);
            jc(c);
            d.addEventListener("click", function() {
                var e = v.createElement("canvas"), h, i, l;
                e.width = 500;
                e.height = 300;
                H.d *= 2;
                l = H.U;
                H.U = {};
                nc(k);
                H.I();
                e.getContext("2d").drawImage(I, (I.width - 500) / 2, (I.height - 300) / 2, 500, 300, 0, 0, 500, 300);
                H.d /= 2;
                H.U = l;
                e = e.toDataURL("image/png");
                if ("asdf" === e)
                    return alert("The thumbnail is blank!\nDrag & fit an interesting part of your track inside."),
                    k;
                h = b.value;
                if (4 > h.length)
                    return alert("The track name is too short!"),
                    k;
                i = c.value;
                d.disabled = j;
                l = new XMLHttpRequest;
                l.open("POST", "/tracks/save", k);
                l.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                l.send("n=" + encodeURIComponent(h) + "&c=" + encodeURIComponent(a) + "&d=" + encodeURIComponent(i) + "&p=" + encodeURIComponent($(f).getElement(".active").get("id")));
                h = JSON.parse(l.responseText);
                if ("string" === typeof h)
                    return alert("Your track was refused: " + h),
                    k;
                l = new XMLHttpRequest;
                l.open("POST", "/tracks/thumbnail/" + h, k);
                l.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                l.send(e.replace("data:image/png;base64,", "i="));
                location.href = "/tracks/" + h
            })
        } else
            return alert("Sorry, but your track must be bigger or more detailed."),
            k
    }
    );
    function mc(a) {
        if (0 > a && 0.2 < H.d || 0 < a && 4 > H.d)
            H.d = s(10 * H.d + 2 * a) / 10,
            H.U = {}
    }
    function oc(a) {
        a.preventDefault();
        if (Z)
            if ("eraser" === P)
                if ((0 < a.detail || 0 > a.wheelDelta) && 5 < ab)
                    ab -= 5;
                else {
                    if ((0 > a.detail || 0 < a.wheelDelta) && 40 > ab)
                        ab += 5
                }
            else {
                if ("brush" === P || "scenery brush" === P)
                    if ((0 < a.detail || 0 > a.wheelDelta) && 4 < Kb)
                        Kb -= 8;
                    else if ((0 > a.detail || 0 < a.wheelDelta) && 200 > Kb)
                        Kb += 8
            }
        else
            0 < a.detail || 0 > a.wheelDelta ? mc(-1) : (0 > a.detail || 0 < a.wheelDelta) && mc(1);
        a = (new F(a.clientX - I.offsetLeft,a.clientY - I.offsetTop + window.pageYOffset)).Ka();
        H.O || H.N.G(R.i(a))
    }
    I.addEventListener("DOMMouseScroll", oc, k);
    I.addEventListener("mousewheel", oc, k);
    var pc;
    function kc() {
        pc = {
            Fb: v.onkeydown,
            Gb: v.onkeypress,
            Hb: v.onkeyup
        };
        v.onkeydown = v.onkeypress = v.onkeyup = aa()
    }
    function lc() {
        pc && (v.onkeydown = pc.Fb,
        v.onkeypress = pc.Gb,
        v.onkeyup = pc.Hb,
        pc = k)
    }
    function nc(a) {
        H.Ab = a !== k
    }
    function qc() {
        return H
    }
    var sc = window.BH || (window.BH = {});
    sc.game = window.cr = {
        ride: bc,
        watchGhost: Gb,
        detach: kc,
        attach: lc,
        changeThumb: nc
    };
    sc.TrackString = dc;
    sc.set ? sc.set("track", qc) : sc.track = qc;
    sc.TRACK_MIN_SIZE = 0;
}()