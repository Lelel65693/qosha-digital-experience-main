var countUp_umd$1 = { exports: {} };
var countUp_umd = countUp_umd$1.exports;
var hasRequiredCountUp_umd;
function requireCountUp_umd() {
  if (hasRequiredCountUp_umd) return countUp_umd$1.exports;
  hasRequiredCountUp_umd = 1;
  (function(module, exports) {
    !(function(t, e) {
      e(exports);
    })(countUp_umd, (function(t) {
      var e = function() {
        return e = Object.assign || function(t2) {
          for (var e2, i2 = 1, s = arguments.length; i2 < s; i2++) for (var n in e2 = arguments[i2]) Object.prototype.hasOwnProperty.call(e2, n) && (t2[n] = e2[n]);
          return t2;
        }, e.apply(this, arguments);
      }, i = (function() {
        function t2(t3, i2, s) {
          var n = this;
          this.endVal = i2, this.options = s, this.version = "2.10.0", this.defaults = { startVal: 0, decimalPlaces: 0, duration: 2, useEasing: true, useGrouping: true, useIndianSeparators: false, smartEasingThreshold: 999, smartEasingAmount: 333, separator: ",", decimal: ".", prefix: "", suffix: "", autoAnimate: false, autoAnimateDelay: 200, autoAnimateOnce: false }, this.finalEndVal = null, this.useEasing = true, this.countDown = false, this.error = "", this.startVal = 0, this.paused = true, this.once = false, this.count = function(t4) {
            n.startTime || (n.startTime = t4);
            var e2 = t4 - n.startTime;
            n.remaining = n.duration - e2, n.useEasing ? n.countDown ? n.frameVal = n.startVal - n.easingFn(e2, 0, n.startVal - n.endVal, n.duration) : n.frameVal = n.easingFn(e2, n.startVal, n.endVal - n.startVal, n.duration) : n.frameVal = n.startVal + (n.endVal - n.startVal) * (e2 / n.duration);
            var i3 = n.countDown ? n.frameVal < n.endVal : n.frameVal > n.endVal;
            n.frameVal = i3 ? n.endVal : n.frameVal, n.frameVal = Number(n.frameVal.toFixed(n.options.decimalPlaces)), n.printValue(n.frameVal), e2 < n.duration ? n.rAF = requestAnimationFrame(n.count) : null !== n.finalEndVal ? n.update(n.finalEndVal) : n.options.onCompleteCallback && n.options.onCompleteCallback();
          }, this.formatNumber = function(t4) {
            var e2, i3, s2, a, o = t4 < 0 ? "-" : "";
            e2 = Math.abs(t4).toFixed(n.options.decimalPlaces);
            var r = (e2 += "").split(".");
            if (i3 = r[0], s2 = r.length > 1 ? n.options.decimal + r[1] : "", n.options.useGrouping) {
              a = "";
              for (var l = 3, u = 0, h = 0, p = i3.length; h < p; ++h) n.options.useIndianSeparators && 4 === h && (l = 2, u = 1), 0 !== h && u % l == 0 && (a = n.options.separator + a), u++, a = i3[p - h - 1] + a;
              i3 = a;
            }
            return n.options.numerals && n.options.numerals.length && (i3 = i3.replace(/[0-9]/g, (function(t5) {
              return n.options.numerals[+t5];
            })), s2 = s2.replace(/[0-9]/g, (function(t5) {
              return n.options.numerals[+t5];
            }))), o + n.options.prefix + i3 + s2 + n.options.suffix;
          }, this.easeOutExpo = function(t4, e2, i3, s2) {
            return i3 * (1 - Math.pow(2, -10 * t4 / s2)) * 1024 / 1023 + e2;
          }, this.options = e(e({}, this.defaults), s), this.options.enableScrollSpy && (this.options.autoAnimate = true), void 0 !== this.options.scrollSpyDelay && (this.options.autoAnimateDelay = this.options.scrollSpyDelay), this.options.scrollSpyOnce && (this.options.autoAnimateOnce = true), this.formattingFn = this.options.formattingFn ? this.options.formattingFn : this.formatNumber, this.easingFn = this.options.easingFn ? this.options.easingFn : this.easeOutExpo, this.el = "string" == typeof t3 ? document.getElementById(t3) : t3, i2 = null == i2 ? this.parse(this.el.innerHTML) : i2, this.startVal = this.validateValue(this.options.startVal), this.frameVal = this.startVal, this.endVal = this.validateValue(i2), this.options.decimalPlaces = Math.max(this.options.decimalPlaces), this.resetDuration(), this.options.separator = String(this.options.separator), this.useEasing = this.options.useEasing, "" === this.options.separator && (this.options.useGrouping = false), this.el ? this.printValue(this.startVal) : this.error = "[CountUp] target is null or undefined", "undefined" != typeof window && this.options.autoAnimate && (this.error || "undefined" == typeof IntersectionObserver ? this.error ? console.error(this.error, t3) : console.error("IntersectionObserver is not supported by this browser") : this.setupObserver());
        }
        return t2.prototype.setupObserver = function() {
          var e2 = this, i2 = t2.observedElements.get(this.el);
          i2 && i2.unobserve(), t2.observedElements.set(this.el, this), this.observer = new IntersectionObserver((function(t3) {
            for (var i3 = 0, s = t3; i3 < s.length; i3++) {
              var n = s[i3];
              n.isIntersecting && e2.paused && !e2.once ? (e2.paused = false, e2.autoAnimateTimeout = setTimeout((function() {
                return e2.start();
              }), e2.options.autoAnimateDelay), e2.options.autoAnimateOnce && (e2.once = true, e2.observer.disconnect())) : n.isIntersecting || e2.paused || (clearTimeout(e2.autoAnimateTimeout), e2.reset());
            }
          }), { threshold: 0 }), this.observer.observe(this.el);
        }, t2.prototype.unobserve = function() {
          var e2;
          clearTimeout(this.autoAnimateTimeout), null === (e2 = this.observer) || void 0 === e2 || e2.disconnect(), t2.observedElements.delete(this.el);
        }, t2.prototype.onDestroy = function() {
          clearTimeout(this.autoAnimateTimeout), cancelAnimationFrame(this.rAF), this.paused = true, this.unobserve(), this.options.onCompleteCallback = null, this.options.onStartCallback = null;
        }, t2.prototype.determineDirectionAndSmartEasing = function() {
          var t3 = this.finalEndVal ? this.finalEndVal : this.endVal;
          this.countDown = this.startVal > t3;
          var e2 = t3 - this.startVal;
          if (Math.abs(e2) > this.options.smartEasingThreshold && this.options.useEasing) {
            this.finalEndVal = t3;
            var i2 = this.countDown ? 1 : -1;
            this.endVal = t3 + i2 * this.options.smartEasingAmount, this.duration = this.duration / 2;
          } else this.endVal = t3, this.finalEndVal = null;
          null !== this.finalEndVal ? this.useEasing = false : this.useEasing = this.options.useEasing;
        }, t2.prototype.start = function(t3) {
          this.error || (this.options.onStartCallback && this.options.onStartCallback(), t3 && (this.options.onCompleteCallback = t3), this.duration > 0 ? (this.determineDirectionAndSmartEasing(), this.paused = false, this.rAF = requestAnimationFrame(this.count)) : this.printValue(this.endVal));
        }, t2.prototype.pauseResume = function() {
          this.paused ? (this.startTime = null, this.duration = this.remaining, this.startVal = this.frameVal, this.determineDirectionAndSmartEasing(), this.rAF = requestAnimationFrame(this.count)) : cancelAnimationFrame(this.rAF), this.paused = !this.paused;
        }, t2.prototype.reset = function() {
          clearTimeout(this.autoAnimateTimeout), cancelAnimationFrame(this.rAF), this.paused = true, this.once = false, this.resetDuration(), this.startVal = this.validateValue(this.options.startVal), this.frameVal = this.startVal, this.printValue(this.startVal);
        }, t2.prototype.update = function(t3) {
          cancelAnimationFrame(this.rAF), this.startTime = null, this.endVal = this.validateValue(t3), this.endVal !== this.frameVal && (this.startVal = this.frameVal, null == this.finalEndVal && this.resetDuration(), this.finalEndVal = null, this.determineDirectionAndSmartEasing(), this.rAF = requestAnimationFrame(this.count));
        }, t2.prototype.printValue = function(t3) {
          var e2;
          if (this.el) {
            var i2 = this.formattingFn(t3);
            if (null === (e2 = this.options.plugin) || void 0 === e2 ? void 0 : e2.render) this.options.plugin.render(this.el, i2);
            else if ("INPUT" === this.el.tagName) this.el.value = i2;
            else "text" === this.el.tagName || "tspan" === this.el.tagName ? this.el.textContent = i2 : this.el.innerHTML = i2;
          }
        }, t2.prototype.ensureNumber = function(t3) {
          return "number" == typeof t3 && !isNaN(t3);
        }, t2.prototype.validateValue = function(t3) {
          var e2 = Number(t3);
          return this.ensureNumber(e2) ? e2 : (this.error = "[CountUp] invalid start or end value: ".concat(t3), null);
        }, t2.prototype.resetDuration = function() {
          this.startTime = null, this.duration = 1e3 * Number(this.options.duration), this.remaining = this.duration;
        }, t2.prototype.parse = function(t3) {
          var e2 = function(t4) {
            return t4.replace(/([.,'  ])/g, "\\$1");
          }, i2 = e2(this.options.separator), s = e2(this.options.decimal), n = t3.replace(new RegExp(i2, "g"), "").replace(new RegExp(s, "g"), ".");
          return parseFloat(n);
        }, t2.observedElements = /* @__PURE__ */ new WeakMap(), t2;
      })();
      t.CountUp = i;
    }));
  })(countUp_umd$1, countUp_umd$1.exports);
  return countUp_umd$1.exports;
}
export {
  requireCountUp_umd as r
};
