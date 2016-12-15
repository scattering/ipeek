var NCNRDataLoader =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('./loadNCNRData'), require('./embed.css'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.loadNCNRData, global.embed);
	    global.embed = mod.exports;
	  }
	})(this, function (exports, _loadNCNRData) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.load = undefined;

	  var _loadNCNRData2 = _interopRequireDefault(_loadNCNRData);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var target = document.currentScript.getAttribute("target");
	  var instrument = document.currentScript.getAttribute("instrument");

	  if (target != null && instrument != null) {
	    var refresh = document.currentScript.getAttribute("refresh") || 60;
	    var plot = new _loadNCNRData2.default(instrument, target, refresh);
	  }

	  exports.load = _loadNCNRData2.default;
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(4), __webpack_require__(5), __webpack_require__(6), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('jquery'), require('d3'), require('./xy-chart'), require('./heat-chart-colorbar-typed-options'), require('./colormap'), require('./es6-promise.min'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.jquery, global.d3, global.xyChart, global.heatChartColorbarTypedOptions, global.colormap, global.es6Promise);
	    global.loadNCNRData = mod.exports;
	  }
	})(this, function (exports, _jquery, _d, _xyChart, _heatChartColorbarTypedOptions, _colormap, _es6Promise) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _jquery2 = _interopRequireDefault(_jquery);

	  var _d2 = _interopRequireDefault(_d);

	  var _xyChart2 = _interopRequireDefault(_xyChart);

	  var _heatChartColorbarTypedOptions2 = _interopRequireDefault(_heatChartColorbarTypedOptions);

	  var cm = _interopRequireWildcard(_colormap);

	  var _es6Promise2 = _interopRequireDefault(_es6Promise);

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var chart;
	  var loadNCNRData = function loadNCNRData(instrument, target, refresh_time) {
	    // refresh_time in seconds
	    this.chart = null;
	    this.instrument = instrument;
	    this.target = target;
	    this.refresh_time = refresh_time; // set to zero or null to disable refresh;

	    var that = this;

	    update();

	    function update() {
	      var noCache = Date.now();
	      return new _es6Promise2.default(function (resolve, reject) {
	        _jquery2.default.ajax({
	          dataType: "json",
	          url: "http://ncnr.nist.gov/ipeek/data/" + instrument + "/live_data.json",
	          data: { "noCache": noCache },
	          success: function success(data) {
	            resolve(showData(data));
	          },
	          error: function error(e) {
	            resolve(showData([{}]));
	          },
	          complete: function complete() {
	            if (refresh_time) {
	              setTimeout(update, refresh_time * (0.95 + Math.random() / 10) * 1000);
	            }
	          }
	        });
	      });
	    }
	    var logselected = true;
	    function showData(datalist) {
	      var data = datalist[0];
	      var chart = that.chart;
	      var options_1d = { show_errorbars: true, series: [] },
	          options_2d = {};
	      if (data.type == '1d') {
	        var options = _jquery2.default.extend(true, {}, options_1d, data.options);
	        if (chart && chart.type && chart.type == 'xy') {
	          chart.options(options, true).source_data(data.data).update();
	        } else {
	          (0, _jquery2.default)('#' + target).empty();
	          chart = new _xyChart2.default();
	          chart.options(options)
	          //.options(data.options)
	          //.ytransform(options.ytransform)
	          .zoomRect(true);
	          _d2.default.select("#" + target).data([data.data]).call(chart);
	          //chart.ytransform(options.ytransform);
	          that.chart = chart;
	        }
	      } else if (data.type == '2d') {
	        if (chart && chart.type && chart.type == 'heatmap_2d') {
	          chart.source_data(data.z[0]);
	        } else {
	          (0, _jquery2.default)('#' + target).empty();
	          var aspect_ratio = null;
	          if ((((data.options || {}).fixedAspect || {}).fixAspect || null) == true) {
	            aspect_ratio = ((data.options || {}).fixedAspect || {}).aspectRatio || null;
	          }
	          chart = new _heatChartColorbarTypedOptions2.default();
	          chart.colormap(cm.get_colormap(instrument == "NGBSANS" ? "spectral" : "jet")).aspect_ratio(aspect_ratio).dims(data.dims).xlabel(data.xlabel).ylabel(data.ylabel);
	          _d2.default.select("#" + target).data(data.z).call(chart);
	          chart.zoomScroll(true).ztransform(logselected ? "log" : "linear");

	          that.chart = chart;
	        }
	      } else {
	        // this will get triggered if data is missing or has a type other than 1d or 2d
	        (0, _jquery2.default)('#' + target).empty().append('<div class="no-data">Ceci n\'est pas data</div>');
	      }

	      return chart;
	    }

	    this.update = update;
	  };

	  exports.default = loadNCNRData;
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v3.1.1
	 * https://jquery.com/
	 *
	 * Includes Sizzle.js
	 * https://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * https://jquery.org/license
	 *
	 * Date: 2016-09-22T22:30Z
	 */
	(function (global, factory) {

		"use strict";

		if (typeof module === "object" && typeof module.exports === "object") {

			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ? factory(global, true) : function (w) {
				if (!w.document) {
					throw new Error("jQuery requires a window with a document");
				}
				return factory(w);
			};
		} else {
			factory(global);
		}

		// Pass this if window is not defined yet
	})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

		// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
		// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
		// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
		// enough that all such attempts are guarded in a try block.
		"use strict";

		var arr = [];

		var document = window.document;

		var getProto = Object.getPrototypeOf;

		var slice = arr.slice;

		var concat = arr.concat;

		var push = arr.push;

		var indexOf = arr.indexOf;

		var class2type = {};

		var toString = class2type.toString;

		var hasOwn = class2type.hasOwnProperty;

		var fnToString = hasOwn.toString;

		var ObjectFunctionString = fnToString.call(Object);

		var support = {};

		function DOMEval(code, doc) {
			doc = doc || document;

			var script = doc.createElement("script");

			script.text = code;
			doc.head.appendChild(script).parentNode.removeChild(script);
		}
		/* global Symbol */
		// Defining this global in .eslintrc.json would create a danger of using the global
		// unguarded in another place, it seems safer to define global only for this module


		var version = "3.1.1",


		// Define a local copy of jQuery
		jQuery = function (selector, context) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init(selector, context);
		},


		// Support: Android <=4.0 only
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,


		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		    rdashAlpha = /-([a-z])/g,


		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function (all, letter) {
			return letter.toUpperCase();
		};

		jQuery.fn = jQuery.prototype = {

			// The current version of jQuery being used
			jquery: version,

			constructor: jQuery,

			// The default length of a jQuery object is 0
			length: 0,

			toArray: function () {
				return slice.call(this);
			},

			// Get the Nth element in the matched element set OR
			// Get the whole matched element set as a clean array
			get: function (num) {

				// Return all the elements in a clean array
				if (num == null) {
					return slice.call(this);
				}

				// Return just the one element from the set
				return num < 0 ? this[num + this.length] : this[num];
			},

			// Take an array of elements and push it onto the stack
			// (returning the new matched element set)
			pushStack: function (elems) {

				// Build a new jQuery matched element set
				var ret = jQuery.merge(this.constructor(), elems);

				// Add the old object onto the stack (as a reference)
				ret.prevObject = this;

				// Return the newly-formed element set
				return ret;
			},

			// Execute a callback for every element in the matched set.
			each: function (callback) {
				return jQuery.each(this, callback);
			},

			map: function (callback) {
				return this.pushStack(jQuery.map(this, function (elem, i) {
					return callback.call(elem, i, elem);
				}));
			},

			slice: function () {
				return this.pushStack(slice.apply(this, arguments));
			},

			first: function () {
				return this.eq(0);
			},

			last: function () {
				return this.eq(-1);
			},

			eq: function (i) {
				var len = this.length,
				    j = +i + (i < 0 ? len : 0);
				return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
			},

			end: function () {
				return this.prevObject || this.constructor();
			},

			// For internal use only.
			// Behaves like an Array's method, not like a jQuery method.
			push: push,
			sort: arr.sort,
			splice: arr.splice
		};

		jQuery.extend = jQuery.fn.extend = function () {
			var options,
			    name,
			    src,
			    copy,
			    copyIsArray,
			    clone,
			    target = arguments[0] || {},
			    i = 1,
			    length = arguments.length,
			    deep = false;

			// Handle a deep copy situation
			if (typeof target === "boolean") {
				deep = target;

				// Skip the boolean and the target
				target = arguments[i] || {};
				i++;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if (typeof target !== "object" && !jQuery.isFunction(target)) {
				target = {};
			}

			// Extend jQuery itself if only one argument is passed
			if (i === length) {
				target = this;
				i--;
			}

			for (; i < length; i++) {

				// Only deal with non-null/undefined values
				if ((options = arguments[i]) != null) {

					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {

							if (copyIsArray) {
								copyIsArray = false;
								clone = src && jQuery.isArray(src) ? src : [];
							} else {
								clone = src && jQuery.isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = jQuery.extend(deep, clone, copy);

							// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		};

		jQuery.extend({

			// Unique for each copy of jQuery on the page
			expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

			// Assume jQuery is ready without the ready module
			isReady: true,

			error: function (msg) {
				throw new Error(msg);
			},

			noop: function () {},

			isFunction: function (obj) {
				return jQuery.type(obj) === "function";
			},

			isArray: Array.isArray,

			isWindow: function (obj) {
				return obj != null && obj === obj.window;
			},

			isNumeric: function (obj) {

				// As of jQuery 3.0, isNumeric is limited to
				// strings and numbers (primitives or objects)
				// that can be coerced to finite numbers (gh-2662)
				var type = jQuery.type(obj);
				return (type === "number" || type === "string") &&

				// parseFloat NaNs numeric-cast false positives ("")
				// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
				// subtraction forces infinities to NaN
				!isNaN(obj - parseFloat(obj));
			},

			isPlainObject: function (obj) {
				var proto, Ctor;

				// Detect obvious negatives
				// Use toString instead of jQuery.type to catch host objects
				if (!obj || toString.call(obj) !== "[object Object]") {
					return false;
				}

				proto = getProto(obj);

				// Objects with no prototype (e.g., `Object.create( null )`) are plain
				if (!proto) {
					return true;
				}

				// Objects with prototype are plain iff they were constructed by a global Object function
				Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
				return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
			},

			isEmptyObject: function (obj) {

				/* eslint-disable no-unused-vars */
				// See https://github.com/eslint/eslint/issues/6125
				var name;

				for (name in obj) {
					return false;
				}
				return true;
			},

			type: function (obj) {
				if (obj == null) {
					return obj + "";
				}

				// Support: Android <=2.3 only (functionish RegExp)
				return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
			},

			// Evaluates a script in a global context
			globalEval: function (code) {
				DOMEval(code);
			},

			// Convert dashed to camelCase; used by the css and data modules
			// Support: IE <=9 - 11, Edge 12 - 13
			// Microsoft forgot to hump their vendor prefix (#9572)
			camelCase: function (string) {
				return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
			},

			nodeName: function (elem, name) {
				return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
			},

			each: function (obj, callback) {
				var length,
				    i = 0;

				if (isArrayLike(obj)) {
					length = obj.length;
					for (; i < length; i++) {
						if (callback.call(obj[i], i, obj[i]) === false) {
							break;
						}
					}
				} else {
					for (i in obj) {
						if (callback.call(obj[i], i, obj[i]) === false) {
							break;
						}
					}
				}

				return obj;
			},

			// Support: Android <=4.0 only
			trim: function (text) {
				return text == null ? "" : (text + "").replace(rtrim, "");
			},

			// results is for internal usage only
			makeArray: function (arr, results) {
				var ret = results || [];

				if (arr != null) {
					if (isArrayLike(Object(arr))) {
						jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
					} else {
						push.call(ret, arr);
					}
				}

				return ret;
			},

			inArray: function (elem, arr, i) {
				return arr == null ? -1 : indexOf.call(arr, elem, i);
			},

			// Support: Android <=4.0 only, PhantomJS 1 only
			// push.apply(_, arraylike) throws on ancient WebKit
			merge: function (first, second) {
				var len = +second.length,
				    j = 0,
				    i = first.length;

				for (; j < len; j++) {
					first[i++] = second[j];
				}

				first.length = i;

				return first;
			},

			grep: function (elems, callback, invert) {
				var callbackInverse,
				    matches = [],
				    i = 0,
				    length = elems.length,
				    callbackExpect = !invert;

				// Go through the array, only saving the items
				// that pass the validator function
				for (; i < length; i++) {
					callbackInverse = !callback(elems[i], i);
					if (callbackInverse !== callbackExpect) {
						matches.push(elems[i]);
					}
				}

				return matches;
			},

			// arg is for internal usage only
			map: function (elems, callback, arg) {
				var length,
				    value,
				    i = 0,
				    ret = [];

				// Go through the array, translating each of the items to their new values
				if (isArrayLike(elems)) {
					length = elems.length;
					for (; i < length; i++) {
						value = callback(elems[i], i, arg);

						if (value != null) {
							ret.push(value);
						}
					}

					// Go through every key on the object,
				} else {
					for (i in elems) {
						value = callback(elems[i], i, arg);

						if (value != null) {
							ret.push(value);
						}
					}
				}

				// Flatten any nested arrays
				return concat.apply([], ret);
			},

			// A global GUID counter for objects
			guid: 1,

			// Bind a function to a context, optionally partially applying any
			// arguments.
			proxy: function (fn, context) {
				var tmp, args, proxy;

				if (typeof context === "string") {
					tmp = fn[context];
					context = fn;
					fn = tmp;
				}

				// Quick check to determine if target is callable, in the spec
				// this throws a TypeError, but we will just return undefined.
				if (!jQuery.isFunction(fn)) {
					return undefined;
				}

				// Simulated bind
				args = slice.call(arguments, 2);
				proxy = function () {
					return fn.apply(context || this, args.concat(slice.call(arguments)));
				};

				// Set the guid of unique handler to the same of original handler, so it can be removed
				proxy.guid = fn.guid = fn.guid || jQuery.guid++;

				return proxy;
			},

			now: Date.now,

			// jQuery.support is not used in Core but other projects attach their
			// properties to it so it needs to exist.
			support: support
		});

		if (typeof Symbol === "function") {
			jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
		}

		// Populate the class2type map
		jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (i, name) {
			class2type["[object " + name + "]"] = name.toLowerCase();
		});

		function isArrayLike(obj) {

			// Support: real iOS 8.2 only (not reproducible in simulator)
			// `in` check used to prevent JIT error (gh-2145)
			// hasOwn isn't used here due to false negatives
			// regarding Nodelist length in IE
			var length = !!obj && "length" in obj && obj.length,
			    type = jQuery.type(obj);

			if (type === "function" || jQuery.isWindow(obj)) {
				return false;
			}

			return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
		}
		var Sizzle =
		/*!
	  * Sizzle CSS Selector Engine v2.3.3
	  * https://sizzlejs.com/
	  *
	  * Copyright jQuery Foundation and other contributors
	  * Released under the MIT license
	  * http://jquery.org/license
	  *
	  * Date: 2016-08-08
	  */
		function (window) {

			var i,
			    support,
			    Expr,
			    getText,
			    isXML,
			    tokenize,
			    compile,
			    select,
			    outermostContext,
			    sortInput,
			    hasDuplicate,


			// Local document vars
			setDocument,
			    document,
			    docElem,
			    documentIsHTML,
			    rbuggyQSA,
			    rbuggyMatches,
			    matches,
			    contains,


			// Instance-specific data
			expando = "sizzle" + 1 * new Date(),
			    preferredDoc = window.document,
			    dirruns = 0,
			    done = 0,
			    classCache = createCache(),
			    tokenCache = createCache(),
			    compilerCache = createCache(),
			    sortOrder = function (a, b) {
				if (a === b) {
					hasDuplicate = true;
				}
				return 0;
			},


			// Instance methods
			hasOwn = {}.hasOwnProperty,
			    arr = [],
			    pop = arr.pop,
			    push_native = arr.push,
			    push = arr.push,
			    slice = arr.slice,

			// Use a stripped-down indexOf as it's faster than native
			// https://jsperf.com/thor-indexof-vs-for/5
			indexOf = function (list, elem) {
				var i = 0,
				    len = list.length;
				for (; i < len; i++) {
					if (list[i] === elem) {
						return i;
					}
				}
				return -1;
			},
			    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",


			// Regular expressions

			// http://www.w3.org/TR/css3-selectors/#whitespace
			whitespace = "[\\x20\\t\\r\\n\\f]",


			// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
			identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",


			// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
			attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
			    pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" + ")\\)|)",


			// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
			rwhitespace = new RegExp(whitespace + "+", "g"),
			    rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
			    rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
			    rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
			    rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
			    rpseudo = new RegExp(pseudos),
			    ridentifier = new RegExp("^" + identifier + "$"),
			    matchExpr = {
				"ID": new RegExp("^#(" + identifier + ")"),
				"CLASS": new RegExp("^\\.(" + identifier + ")"),
				"TAG": new RegExp("^(" + identifier + "|[*])"),
				"ATTR": new RegExp("^" + attributes),
				"PSEUDO": new RegExp("^" + pseudos),
				"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
				"bool": new RegExp("^(?:" + booleans + ")$", "i"),
				// For use in libraries implementing .is()
				// We use this for POS matching in `select`
				"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
			},
			    rinputs = /^(?:input|select|textarea|button)$/i,
			    rheader = /^h\d$/i,
			    rnative = /^[^{]+\{\s*\[native \w/,


			// Easily-parseable/retrievable ID or TAG or CLASS selectors
			rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
			    rsibling = /[+~]/,


			// CSS escapes
			// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
			runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
			    funescape = function (_, escaped, escapedWhitespace) {
				var high = "0x" + escaped - 0x10000;
				// NaN means non-codepoint
				// Support: Firefox<24
				// Workaround erroneous numeric interpretation of +"0x"
				return high !== high || escapedWhitespace ? escaped : high < 0 ?
				// BMP codepoint
				String.fromCharCode(high + 0x10000) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
			},


			// CSS string/identifier serialization
			// https://drafts.csswg.org/cssom/#common-serializing-idioms
			rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
			    fcssescape = function (ch, asCodePoint) {
				if (asCodePoint) {

					// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
					if (ch === "\0") {
						return "\uFFFD";
					}

					// Control characters and (dependent upon position) numbers get escaped as code points
					return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
				}

				// Other potentially-special ASCII characters get backslash-escaped
				return "\\" + ch;
			},


			// Used for iframes
			// See setDocument()
			// Removing the function wrapper causes a "Permission Denied"
			// error in IE
			unloadHandler = function () {
				setDocument();
			},
			    disabledAncestor = addCombinator(function (elem) {
				return elem.disabled === true && ("form" in elem || "label" in elem);
			}, { dir: "parentNode", next: "legend" });

			// Optimize for push.apply( _, NodeList )
			try {
				push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
				// Support: Android<4.0
				// Detect silently failing push.apply
				arr[preferredDoc.childNodes.length].nodeType;
			} catch (e) {
				push = { apply: arr.length ?

					// Leverage slice if possible
					function (target, els) {
						push_native.apply(target, slice.call(els));
					} :

					// Support: IE<9
					// Otherwise append directly
					function (target, els) {
						var j = target.length,
						    i = 0;
						// Can't trust NodeList.length
						while (target[j++] = els[i++]) {}
						target.length = j - 1;
					}
				};
			}

			function Sizzle(selector, context, results, seed) {
				var m,
				    i,
				    elem,
				    nid,
				    match,
				    groups,
				    newSelector,
				    newContext = context && context.ownerDocument,


				// nodeType defaults to 9, since context defaults to document
				nodeType = context ? context.nodeType : 9;

				results = results || [];

				// Return early from calls with invalid selector or context
				if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

					return results;
				}

				// Try to shortcut find operations (as opposed to filters) in HTML documents
				if (!seed) {

					if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
						setDocument(context);
					}
					context = context || document;

					if (documentIsHTML) {

						// If the selector is sufficiently simple, try using a "get*By*" DOM method
						// (excepting DocumentFragment context, where the methods don't exist)
						if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

							// ID selector
							if (m = match[1]) {

								// Document context
								if (nodeType === 9) {
									if (elem = context.getElementById(m)) {

										// Support: IE, Opera, Webkit
										// TODO: identify versions
										// getElementById can match elements by name instead of ID
										if (elem.id === m) {
											results.push(elem);
											return results;
										}
									} else {
										return results;
									}

									// Element context
								} else {

									// Support: IE, Opera, Webkit
									// TODO: identify versions
									// getElementById can match elements by name instead of ID
									if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {

										results.push(elem);
										return results;
									}
								}

								// Type selector
							} else if (match[2]) {
								push.apply(results, context.getElementsByTagName(selector));
								return results;

								// Class selector
							} else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {

								push.apply(results, context.getElementsByClassName(m));
								return results;
							}
						}

						// Take advantage of querySelectorAll
						if (support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {

							if (nodeType !== 1) {
								newContext = context;
								newSelector = selector;

								// qSA looks outside Element context, which is not what we want
								// Thanks to Andrew Dupont for this workaround technique
								// Support: IE <=8
								// Exclude object elements
							} else if (context.nodeName.toLowerCase() !== "object") {

								// Capture the context ID, setting it first if necessary
								if (nid = context.getAttribute("id")) {
									nid = nid.replace(rcssescape, fcssescape);
								} else {
									context.setAttribute("id", nid = expando);
								}

								// Prefix every selector in the list
								groups = tokenize(selector);
								i = groups.length;
								while (i--) {
									groups[i] = "#" + nid + " " + toSelector(groups[i]);
								}
								newSelector = groups.join(",");

								// Expand context for sibling selectors
								newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
							}

							if (newSelector) {
								try {
									push.apply(results, newContext.querySelectorAll(newSelector));
									return results;
								} catch (qsaError) {} finally {
									if (nid === expando) {
										context.removeAttribute("id");
									}
								}
							}
						}
					}
				}

				// All others
				return select(selector.replace(rtrim, "$1"), context, results, seed);
			}

			/**
	   * Create key-value caches of limited size
	   * @returns {function(string, object)} Returns the Object data after storing it on itself with
	   *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	   *	deleting the oldest entry
	   */
			function createCache() {
				var keys = [];

				function cache(key, value) {
					// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
					if (keys.push(key + " ") > Expr.cacheLength) {
						// Only keep the most recent entries
						delete cache[keys.shift()];
					}
					return cache[key + " "] = value;
				}
				return cache;
			}

			/**
	   * Mark a function for special use by Sizzle
	   * @param {Function} fn The function to mark
	   */
			function markFunction(fn) {
				fn[expando] = true;
				return fn;
			}

			/**
	   * Support testing using an element
	   * @param {Function} fn Passed the created element and returns a boolean result
	   */
			function assert(fn) {
				var el = document.createElement("fieldset");

				try {
					return !!fn(el);
				} catch (e) {
					return false;
				} finally {
					// Remove from its parent by default
					if (el.parentNode) {
						el.parentNode.removeChild(el);
					}
					// release memory in IE
					el = null;
				}
			}

			/**
	   * Adds the same handler for all of the specified attrs
	   * @param {String} attrs Pipe-separated list of attributes
	   * @param {Function} handler The method that will be applied
	   */
			function addHandle(attrs, handler) {
				var arr = attrs.split("|"),
				    i = arr.length;

				while (i--) {
					Expr.attrHandle[arr[i]] = handler;
				}
			}

			/**
	   * Checks document order of two siblings
	   * @param {Element} a
	   * @param {Element} b
	   * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	   */
			function siblingCheck(a, b) {
				var cur = b && a,
				    diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;

				// Use IE sourceIndex if available on both nodes
				if (diff) {
					return diff;
				}

				// Check if b follows a
				if (cur) {
					while (cur = cur.nextSibling) {
						if (cur === b) {
							return -1;
						}
					}
				}

				return a ? 1 : -1;
			}

			/**
	   * Returns a function to use in pseudos for input types
	   * @param {String} type
	   */
			function createInputPseudo(type) {
				return function (elem) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && elem.type === type;
				};
			}

			/**
	   * Returns a function to use in pseudos for buttons
	   * @param {String} type
	   */
			function createButtonPseudo(type) {
				return function (elem) {
					var name = elem.nodeName.toLowerCase();
					return (name === "input" || name === "button") && elem.type === type;
				};
			}

			/**
	   * Returns a function to use in pseudos for :enabled/:disabled
	   * @param {Boolean} disabled true for :disabled; false for :enabled
	   */
			function createDisabledPseudo(disabled) {

				// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
				return function (elem) {

					// Only certain elements can match :enabled or :disabled
					// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
					// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
					if ("form" in elem) {

						// Check for inherited disabledness on relevant non-disabled elements:
						// * listed form-associated elements in a disabled fieldset
						//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
						//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
						// * option elements in a disabled optgroup
						//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
						// All such elements have a "form" property.
						if (elem.parentNode && elem.disabled === false) {

							// Option elements defer to a parent optgroup if present
							if ("label" in elem) {
								if ("label" in elem.parentNode) {
									return elem.parentNode.disabled === disabled;
								} else {
									return elem.disabled === disabled;
								}
							}

							// Support: IE 6 - 11
							// Use the isDisabled shortcut property to check for disabled fieldset ancestors
							return elem.isDisabled === disabled ||

							// Where there is no isDisabled, check manually
							/* jshint -W018 */
							elem.isDisabled !== !disabled && disabledAncestor(elem) === disabled;
						}

						return elem.disabled === disabled;

						// Try to winnow out elements that can't be disabled before trusting the disabled property.
						// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
						// even exist on them, let alone have a boolean value.
					} else if ("label" in elem) {
						return elem.disabled === disabled;
					}

					// Remaining elements are neither :enabled nor :disabled
					return false;
				};
			}

			/**
	   * Returns a function to use in pseudos for positionals
	   * @param {Function} fn
	   */
			function createPositionalPseudo(fn) {
				return markFunction(function (argument) {
					argument = +argument;
					return markFunction(function (seed, matches) {
						var j,
						    matchIndexes = fn([], seed.length, argument),
						    i = matchIndexes.length;

						// Match elements found at the specified indexes
						while (i--) {
							if (seed[j = matchIndexes[i]]) {
								seed[j] = !(matches[j] = seed[j]);
							}
						}
					});
				});
			}

			/**
	   * Checks a node for validity as a Sizzle context
	   * @param {Element|Object=} context
	   * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	   */
			function testContext(context) {
				return context && typeof context.getElementsByTagName !== "undefined" && context;
			}

			// Expose support vars for convenience
			support = Sizzle.support = {};

			/**
	   * Detects XML nodes
	   * @param {Element|Object} elem An element or a document
	   * @returns {Boolean} True iff elem is a non-HTML XML node
	   */
			isXML = Sizzle.isXML = function (elem) {
				// documentElement is verified for cases where it doesn't yet exist
				// (such as loading iframes in IE - #4833)
				var documentElement = elem && (elem.ownerDocument || elem).documentElement;
				return documentElement ? documentElement.nodeName !== "HTML" : false;
			};

			/**
	   * Sets document-related variables once based on the current document
	   * @param {Element|Object} [doc] An element or document object to use to set the document
	   * @returns {Object} Returns the current document
	   */
			setDocument = Sizzle.setDocument = function (node) {
				var hasCompare,
				    subWindow,
				    doc = node ? node.ownerDocument || node : preferredDoc;

				// Return early if doc is invalid or already selected
				if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
					return document;
				}

				// Update global variables
				document = doc;
				docElem = document.documentElement;
				documentIsHTML = !isXML(document);

				// Support: IE 9-11, Edge
				// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
				if (preferredDoc !== document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {

					// Support: IE 11, Edge
					if (subWindow.addEventListener) {
						subWindow.addEventListener("unload", unloadHandler, false);

						// Support: IE 9 - 10 only
					} else if (subWindow.attachEvent) {
						subWindow.attachEvent("onunload", unloadHandler);
					}
				}

				/* Attributes
	   ---------------------------------------------------------------------- */

				// Support: IE<8
				// Verify that getAttribute really returns attributes and not properties
				// (excepting IE8 booleans)
				support.attributes = assert(function (el) {
					el.className = "i";
					return !el.getAttribute("className");
				});

				/* getElement(s)By*
	   ---------------------------------------------------------------------- */

				// Check if getElementsByTagName("*") returns only elements
				support.getElementsByTagName = assert(function (el) {
					el.appendChild(document.createComment(""));
					return !el.getElementsByTagName("*").length;
				});

				// Support: IE<9
				support.getElementsByClassName = rnative.test(document.getElementsByClassName);

				// Support: IE<10
				// Check if getElementById returns elements by name
				// The broken getElementById methods don't pick up programmatically-set names,
				// so use a roundabout getElementsByName test
				support.getById = assert(function (el) {
					docElem.appendChild(el).id = expando;
					return !document.getElementsByName || !document.getElementsByName(expando).length;
				});

				// ID filter and find
				if (support.getById) {
					Expr.filter["ID"] = function (id) {
						var attrId = id.replace(runescape, funescape);
						return function (elem) {
							return elem.getAttribute("id") === attrId;
						};
					};
					Expr.find["ID"] = function (id, context) {
						if (typeof context.getElementById !== "undefined" && documentIsHTML) {
							var elem = context.getElementById(id);
							return elem ? [elem] : [];
						}
					};
				} else {
					Expr.filter["ID"] = function (id) {
						var attrId = id.replace(runescape, funescape);
						return function (elem) {
							var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
							return node && node.value === attrId;
						};
					};

					// Support: IE 6 - 7 only
					// getElementById is not reliable as a find shortcut
					Expr.find["ID"] = function (id, context) {
						if (typeof context.getElementById !== "undefined" && documentIsHTML) {
							var node,
							    i,
							    elems,
							    elem = context.getElementById(id);

							if (elem) {

								// Verify the id attribute
								node = elem.getAttributeNode("id");
								if (node && node.value === id) {
									return [elem];
								}

								// Fall back on getElementsByName
								elems = context.getElementsByName(id);
								i = 0;
								while (elem = elems[i++]) {
									node = elem.getAttributeNode("id");
									if (node && node.value === id) {
										return [elem];
									}
								}
							}

							return [];
						}
					};
				}

				// Tag
				Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
					if (typeof context.getElementsByTagName !== "undefined") {
						return context.getElementsByTagName(tag);

						// DocumentFragment nodes don't have gEBTN
					} else if (support.qsa) {
						return context.querySelectorAll(tag);
					}
				} : function (tag, context) {
					var elem,
					    tmp = [],
					    i = 0,

					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName(tag);

					// Filter out possible comments
					if (tag === "*") {
						while (elem = results[i++]) {
							if (elem.nodeType === 1) {
								tmp.push(elem);
							}
						}

						return tmp;
					}
					return results;
				};

				// Class
				Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
					if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
						return context.getElementsByClassName(className);
					}
				};

				/* QSA/matchesSelector
	   ---------------------------------------------------------------------- */

				// QSA and matchesSelector support

				// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
				rbuggyMatches = [];

				// qSa(:focus) reports false when true (Chrome 21)
				// We allow this because of a bug in IE8/9 that throws an error
				// whenever `document.activeElement` is accessed on an iframe
				// So, we allow :focus to pass through QSA all the time to avoid the IE error
				// See https://bugs.jquery.com/ticket/13378
				rbuggyQSA = [];

				if (support.qsa = rnative.test(document.querySelectorAll)) {
					// Build QSA regex
					// Regex strategy adopted from Diego Perini
					assert(function (el) {
						// Select is set to empty string on purpose
						// This is to test IE's treatment of not explicitly
						// setting a boolean content attribute,
						// since its presence should be enough
						// https://bugs.jquery.com/ticket/12359
						docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";

						// Support: IE8, Opera 11-12.16
						// Nothing should be selected when empty strings follow ^= or $= or *=
						// The test attribute must be unknown in Opera but "safe" for WinRT
						// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
						if (el.querySelectorAll("[msallowcapture^='']").length) {
							rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
						}

						// Support: IE8
						// Boolean attributes and "value" are not treated correctly
						if (!el.querySelectorAll("[selected]").length) {
							rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
						}

						// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
						if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
							rbuggyQSA.push("~=");
						}

						// Webkit/Opera - :checked should return selected option elements
						// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
						// IE8 throws error here and will not see later tests
						if (!el.querySelectorAll(":checked").length) {
							rbuggyQSA.push(":checked");
						}

						// Support: Safari 8+, iOS 8+
						// https://bugs.webkit.org/show_bug.cgi?id=136851
						// In-page `selector#id sibling-combinator selector` fails
						if (!el.querySelectorAll("a#" + expando + "+*").length) {
							rbuggyQSA.push(".#.+[+~]");
						}
					});

					assert(function (el) {
						el.innerHTML = "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>";

						// Support: Windows 8 Native Apps
						// The type and name attributes are restricted during .innerHTML assignment
						var input = document.createElement("input");
						input.setAttribute("type", "hidden");
						el.appendChild(input).setAttribute("name", "D");

						// Support: IE8
						// Enforce case-sensitivity of name attribute
						if (el.querySelectorAll("[name=d]").length) {
							rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
						}

						// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
						// IE8 throws error here and will not see later tests
						if (el.querySelectorAll(":enabled").length !== 2) {
							rbuggyQSA.push(":enabled", ":disabled");
						}

						// Support: IE9-11+
						// IE's :disabled selector does not pick up the children of disabled fieldsets
						docElem.appendChild(el).disabled = true;
						if (el.querySelectorAll(":disabled").length !== 2) {
							rbuggyQSA.push(":enabled", ":disabled");
						}

						// Opera 10-11 does not throw on post-comma invalid pseudos
						el.querySelectorAll("*,:x");
						rbuggyQSA.push(",.*:");
					});
				}

				if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {

					assert(function (el) {
						// Check to see if it's possible to do matchesSelector
						// on a disconnected node (IE 9)
						support.disconnectedMatch = matches.call(el, "*");

						// This should fail with an exception
						// Gecko does not error, returns false instead
						matches.call(el, "[s!='']:x");
						rbuggyMatches.push("!=", pseudos);
					});
				}

				rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
				rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

				/* Contains
	   ---------------------------------------------------------------------- */
				hasCompare = rnative.test(docElem.compareDocumentPosition);

				// Element contains another
				// Purposefully self-exclusive
				// As in, an element does not contain itself
				contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
					var adown = a.nodeType === 9 ? a.documentElement : a,
					    bup = b && b.parentNode;
					return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
				} : function (a, b) {
					if (b) {
						while (b = b.parentNode) {
							if (b === a) {
								return true;
							}
						}
					}
					return false;
				};

				/* Sorting
	   ---------------------------------------------------------------------- */

				// Document order sorting
				sortOrder = hasCompare ? function (a, b) {

					// Flag for duplicate removal
					if (a === b) {
						hasDuplicate = true;
						return 0;
					}

					// Sort on method existence if only one input has compareDocumentPosition
					var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
					if (compare) {
						return compare;
					}

					// Calculate position if both inputs belong to the same document
					compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) :

					// Otherwise we know they are disconnected
					1;

					// Disconnected nodes
					if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {

						// Choose the first element that is related to our preferred document
						if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
							return -1;
						}
						if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
							return 1;
						}

						// Maintain original order
						return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
					}

					return compare & 4 ? -1 : 1;
				} : function (a, b) {
					// Exit early if the nodes are identical
					if (a === b) {
						hasDuplicate = true;
						return 0;
					}

					var cur,
					    i = 0,
					    aup = a.parentNode,
					    bup = b.parentNode,
					    ap = [a],
					    bp = [b];

					// Parentless nodes are either documents or disconnected
					if (!aup || !bup) {
						return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;

						// If the nodes are siblings, we can do a quick check
					} else if (aup === bup) {
						return siblingCheck(a, b);
					}

					// Otherwise we need full lists of their ancestors for comparison
					cur = a;
					while (cur = cur.parentNode) {
						ap.unshift(cur);
					}
					cur = b;
					while (cur = cur.parentNode) {
						bp.unshift(cur);
					}

					// Walk down the tree looking for a discrepancy
					while (ap[i] === bp[i]) {
						i++;
					}

					return i ?
					// Do a sibling check if the nodes have a common ancestor
					siblingCheck(ap[i], bp[i]) :

					// Otherwise nodes in our document sort first
					ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
				};

				return document;
			};

			Sizzle.matches = function (expr, elements) {
				return Sizzle(expr, null, null, elements);
			};

			Sizzle.matchesSelector = function (elem, expr) {
				// Set document vars if needed
				if ((elem.ownerDocument || elem) !== document) {
					setDocument(elem);
				}

				// Make sure that attribute selectors are quoted
				expr = expr.replace(rattributeQuotes, "='$1']");

				if (support.matchesSelector && documentIsHTML && !compilerCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {

					try {
						var ret = matches.call(elem, expr);

						// IE 9's matchesSelector returns false on disconnected nodes
						if (ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11) {
							return ret;
						}
					} catch (e) {}
				}

				return Sizzle(expr, document, null, [elem]).length > 0;
			};

			Sizzle.contains = function (context, elem) {
				// Set document vars if needed
				if ((context.ownerDocument || context) !== document) {
					setDocument(context);
				}
				return contains(context, elem);
			};

			Sizzle.attr = function (elem, name) {
				// Set document vars if needed
				if ((elem.ownerDocument || elem) !== document) {
					setDocument(elem);
				}

				var fn = Expr.attrHandle[name.toLowerCase()],

				// Don't get fooled by Object.prototype properties (jQuery #13807)
				val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;

				return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
			};

			Sizzle.escape = function (sel) {
				return (sel + "").replace(rcssescape, fcssescape);
			};

			Sizzle.error = function (msg) {
				throw new Error("Syntax error, unrecognized expression: " + msg);
			};

			/**
	   * Document sorting and removing duplicates
	   * @param {ArrayLike} results
	   */
			Sizzle.uniqueSort = function (results) {
				var elem,
				    duplicates = [],
				    j = 0,
				    i = 0;

				// Unless we *know* we can detect duplicates, assume their presence
				hasDuplicate = !support.detectDuplicates;
				sortInput = !support.sortStable && results.slice(0);
				results.sort(sortOrder);

				if (hasDuplicate) {
					while (elem = results[i++]) {
						if (elem === results[i]) {
							j = duplicates.push(i);
						}
					}
					while (j--) {
						results.splice(duplicates[j], 1);
					}
				}

				// Clear input after sorting to release objects
				// See https://github.com/jquery/sizzle/pull/225
				sortInput = null;

				return results;
			};

			/**
	   * Utility function for retrieving the text value of an array of DOM nodes
	   * @param {Array|Element} elem
	   */
			getText = Sizzle.getText = function (elem) {
				var node,
				    ret = "",
				    i = 0,
				    nodeType = elem.nodeType;

				if (!nodeType) {
					// If no nodeType, this is expected to be an array
					while (node = elem[i++]) {
						// Do not traverse comment nodes
						ret += getText(node);
					}
				} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
					// Use textContent for elements
					// innerText usage removed for consistency of new lines (jQuery #11153)
					if (typeof elem.textContent === "string") {
						return elem.textContent;
					} else {
						// Traverse its children
						for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
							ret += getText(elem);
						}
					}
				} else if (nodeType === 3 || nodeType === 4) {
					return elem.nodeValue;
				}
				// Do not include comment or processing instruction nodes

				return ret;
			};

			Expr = Sizzle.selectors = {

				// Can be adjusted by the user
				cacheLength: 50,

				createPseudo: markFunction,

				match: matchExpr,

				attrHandle: {},

				find: {},

				relative: {
					">": { dir: "parentNode", first: true },
					" ": { dir: "parentNode" },
					"+": { dir: "previousSibling", first: true },
					"~": { dir: "previousSibling" }
				},

				preFilter: {
					"ATTR": function (match) {
						match[1] = match[1].replace(runescape, funescape);

						// Move the given value to match[3] whether quoted or unquoted
						match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

						if (match[2] === "~=") {
							match[3] = " " + match[3] + " ";
						}

						return match.slice(0, 4);
					},

					"CHILD": function (match) {
						/* matches from matchExpr["CHILD"]
	     	1 type (only|nth|...)
	     	2 what (child|of-type)
	     	3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
	     	4 xn-component of xn+y argument ([+-]?\d*n|)
	     	5 sign of xn-component
	     	6 x of xn-component
	     	7 sign of y-component
	     	8 y of y-component
	     */
						match[1] = match[1].toLowerCase();

						if (match[1].slice(0, 3) === "nth") {
							// nth-* requires argument
							if (!match[3]) {
								Sizzle.error(match[0]);
							}

							// numeric x and y parameters for Expr.filter.CHILD
							// remember that false/true cast respectively to 0/1
							match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
							match[5] = +(match[7] + match[8] || match[3] === "odd");

							// other types prohibit arguments
						} else if (match[3]) {
							Sizzle.error(match[0]);
						}

						return match;
					},

					"PSEUDO": function (match) {
						var excess,
						    unquoted = !match[6] && match[2];

						if (matchExpr["CHILD"].test(match[0])) {
							return null;
						}

						// Accept quoted arguments as-is
						if (match[3]) {
							match[2] = match[4] || match[5] || "";

							// Strip excess characters from unquoted arguments
						} else if (unquoted && rpseudo.test(unquoted) && (
						// Get excess from tokenize (recursively)
						excess = tokenize(unquoted, true)) && (
						// advance to the next closing parenthesis
						excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

							// excess is a negative index
							match[0] = match[0].slice(0, excess);
							match[2] = unquoted.slice(0, excess);
						}

						// Return only captures needed by the pseudo filter method (type and argument)
						return match.slice(0, 3);
					}
				},

				filter: {

					"TAG": function (nodeNameSelector) {
						var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
						return nodeNameSelector === "*" ? function () {
							return true;
						} : function (elem) {
							return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
						};
					},

					"CLASS": function (className) {
						var pattern = classCache[className + " "];

						return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
							return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
						});
					},

					"ATTR": function (name, operator, check) {
						return function (elem) {
							var result = Sizzle.attr(elem, name);

							if (result == null) {
								return operator === "!=";
							}
							if (!operator) {
								return true;
							}

							result += "";

							return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
						};
					},

					"CHILD": function (type, what, argument, first, last) {
						var simple = type.slice(0, 3) !== "nth",
						    forward = type.slice(-4) !== "last",
						    ofType = what === "of-type";

						return first === 1 && last === 0 ?

						// Shortcut for :nth-*(n)
						function (elem) {
							return !!elem.parentNode;
						} : function (elem, context, xml) {
							var cache,
							    uniqueCache,
							    outerCache,
							    node,
							    nodeIndex,
							    start,
							    dir = simple !== forward ? "nextSibling" : "previousSibling",
							    parent = elem.parentNode,
							    name = ofType && elem.nodeName.toLowerCase(),
							    useCache = !xml && !ofType,
							    diff = false;

							if (parent) {

								// :(first|last|only)-(child|of-type)
								if (simple) {
									while (dir) {
										node = elem;
										while (node = node[dir]) {
											if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {

												return false;
											}
										}
										// Reverse direction for :only-* (if we haven't yet done so)
										start = dir = type === "only" && !start && "nextSibling";
									}
									return true;
								}

								start = [forward ? parent.firstChild : parent.lastChild];

								// non-xml :nth-child(...) stores cache data on `parent`
								if (forward && useCache) {

									// Seek `elem` from a previously-cached index

									// ...in a gzip-friendly way
									node = parent;
									outerCache = node[expando] || (node[expando] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

									cache = uniqueCache[type] || [];
									nodeIndex = cache[0] === dirruns && cache[1];
									diff = nodeIndex && cache[2];
									node = nodeIndex && parent.childNodes[nodeIndex];

									while (node = ++nodeIndex && node && node[dir] || (

									// Fallback to seeking `elem` from the start
									diff = nodeIndex = 0) || start.pop()) {

										// When found, cache indexes on `parent` and break
										if (node.nodeType === 1 && ++diff && node === elem) {
											uniqueCache[type] = [dirruns, nodeIndex, diff];
											break;
										}
									}
								} else {
									// Use previously-cached element index if available
									if (useCache) {
										// ...in a gzip-friendly way
										node = elem;
										outerCache = node[expando] || (node[expando] = {});

										// Support: IE <9 only
										// Defend against cloned attroperties (jQuery gh-1709)
										uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

										cache = uniqueCache[type] || [];
										nodeIndex = cache[0] === dirruns && cache[1];
										diff = nodeIndex;
									}

									// xml :nth-child(...)
									// or :nth-last-child(...) or :nth(-last)?-of-type(...)
									if (diff === false) {
										// Use the same loop as above to seek `elem` from the start
										while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {

											if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {

												// Cache the index of each encountered element
												if (useCache) {
													outerCache = node[expando] || (node[expando] = {});

													// Support: IE <9 only
													// Defend against cloned attroperties (jQuery gh-1709)
													uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

													uniqueCache[type] = [dirruns, diff];
												}

												if (node === elem) {
													break;
												}
											}
										}
									}
								}

								// Incorporate the offset, then check against cycle size
								diff -= last;
								return diff === first || diff % first === 0 && diff / first >= 0;
							}
						};
					},

					"PSEUDO": function (pseudo, argument) {
						// pseudo-class names are case-insensitive
						// http://www.w3.org/TR/selectors/#pseudo-classes
						// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
						// Remember that setFilters inherits from pseudos
						var args,
						    fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);

						// The user may use createPseudo to indicate that
						// arguments are needed to create the filter function
						// just as Sizzle does
						if (fn[expando]) {
							return fn(argument);
						}

						// But maintain support for old signatures
						if (fn.length > 1) {
							args = [pseudo, pseudo, "", argument];
							return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
								var idx,
								    matched = fn(seed, argument),
								    i = matched.length;
								while (i--) {
									idx = indexOf(seed, matched[i]);
									seed[idx] = !(matches[idx] = matched[i]);
								}
							}) : function (elem) {
								return fn(elem, 0, args);
							};
						}

						return fn;
					}
				},

				pseudos: {
					// Potentially complex pseudos
					"not": markFunction(function (selector) {
						// Trim the selector passed to compile
						// to avoid treating leading and trailing
						// spaces as combinators
						var input = [],
						    results = [],
						    matcher = compile(selector.replace(rtrim, "$1"));

						return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
							var elem,
							    unmatched = matcher(seed, null, xml, []),
							    i = seed.length;

							// Match elements unmatched by `matcher`
							while (i--) {
								if (elem = unmatched[i]) {
									seed[i] = !(matches[i] = elem);
								}
							}
						}) : function (elem, context, xml) {
							input[0] = elem;
							matcher(input, null, xml, results);
							// Don't keep the element (issue #299)
							input[0] = null;
							return !results.pop();
						};
					}),

					"has": markFunction(function (selector) {
						return function (elem) {
							return Sizzle(selector, elem).length > 0;
						};
					}),

					"contains": markFunction(function (text) {
						text = text.replace(runescape, funescape);
						return function (elem) {
							return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
						};
					}),

					// "Whether an element is represented by a :lang() selector
					// is based solely on the element's language value
					// being equal to the identifier C,
					// or beginning with the identifier C immediately followed by "-".
					// The matching of C against the element's language value is performed case-insensitively.
					// The identifier C does not have to be a valid language name."
					// http://www.w3.org/TR/selectors/#lang-pseudo
					"lang": markFunction(function (lang) {
						// lang value must be a valid identifier
						if (!ridentifier.test(lang || "")) {
							Sizzle.error("unsupported lang: " + lang);
						}
						lang = lang.replace(runescape, funescape).toLowerCase();
						return function (elem) {
							var elemLang;
							do {
								if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {

									elemLang = elemLang.toLowerCase();
									return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
								}
							} while ((elem = elem.parentNode) && elem.nodeType === 1);
							return false;
						};
					}),

					// Miscellaneous
					"target": function (elem) {
						var hash = window.location && window.location.hash;
						return hash && hash.slice(1) === elem.id;
					},

					"root": function (elem) {
						return elem === docElem;
					},

					"focus": function (elem) {
						return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
					},

					// Boolean properties
					"enabled": createDisabledPseudo(false),
					"disabled": createDisabledPseudo(true),

					"checked": function (elem) {
						// In CSS3, :checked should return both checked and selected elements
						// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
						var nodeName = elem.nodeName.toLowerCase();
						return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
					},

					"selected": function (elem) {
						// Accessing this property makes selected-by-default
						// options in Safari work properly
						if (elem.parentNode) {
							elem.parentNode.selectedIndex;
						}

						return elem.selected === true;
					},

					// Contents
					"empty": function (elem) {
						// http://www.w3.org/TR/selectors/#empty-pseudo
						// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
						//   but not by others (comment: 8; processing instruction: 7; etc.)
						// nodeType < 6 works because attributes (2) do not appear as children
						for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
							if (elem.nodeType < 6) {
								return false;
							}
						}
						return true;
					},

					"parent": function (elem) {
						return !Expr.pseudos["empty"](elem);
					},

					// Element/input types
					"header": function (elem) {
						return rheader.test(elem.nodeName);
					},

					"input": function (elem) {
						return rinputs.test(elem.nodeName);
					},

					"button": function (elem) {
						var name = elem.nodeName.toLowerCase();
						return name === "input" && elem.type === "button" || name === "button";
					},

					"text": function (elem) {
						var attr;
						return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && (

						// Support: IE<8
						// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
						(attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
					},

					// Position-in-collection
					"first": createPositionalPseudo(function () {
						return [0];
					}),

					"last": createPositionalPseudo(function (matchIndexes, length) {
						return [length - 1];
					}),

					"eq": createPositionalPseudo(function (matchIndexes, length, argument) {
						return [argument < 0 ? argument + length : argument];
					}),

					"even": createPositionalPseudo(function (matchIndexes, length) {
						var i = 0;
						for (; i < length; i += 2) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					}),

					"odd": createPositionalPseudo(function (matchIndexes, length) {
						var i = 1;
						for (; i < length; i += 2) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					}),

					"lt": createPositionalPseudo(function (matchIndexes, length, argument) {
						var i = argument < 0 ? argument + length : argument;
						for (; --i >= 0;) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					}),

					"gt": createPositionalPseudo(function (matchIndexes, length, argument) {
						var i = argument < 0 ? argument + length : argument;
						for (; ++i < length;) {
							matchIndexes.push(i);
						}
						return matchIndexes;
					})
				}
			};

			Expr.pseudos["nth"] = Expr.pseudos["eq"];

			// Add button/input type pseudos
			for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
				Expr.pseudos[i] = createInputPseudo(i);
			}
			for (i in { submit: true, reset: true }) {
				Expr.pseudos[i] = createButtonPseudo(i);
			}

			// Easy API for creating new setFilters
			function setFilters() {}
			setFilters.prototype = Expr.filters = Expr.pseudos;
			Expr.setFilters = new setFilters();

			tokenize = Sizzle.tokenize = function (selector, parseOnly) {
				var matched,
				    match,
				    tokens,
				    type,
				    soFar,
				    groups,
				    preFilters,
				    cached = tokenCache[selector + " "];

				if (cached) {
					return parseOnly ? 0 : cached.slice(0);
				}

				soFar = selector;
				groups = [];
				preFilters = Expr.preFilter;

				while (soFar) {

					// Comma and first run
					if (!matched || (match = rcomma.exec(soFar))) {
						if (match) {
							// Don't consume trailing commas as valid
							soFar = soFar.slice(match[0].length) || soFar;
						}
						groups.push(tokens = []);
					}

					matched = false;

					// Combinators
					if (match = rcombinators.exec(soFar)) {
						matched = match.shift();
						tokens.push({
							value: matched,
							// Cast descendant combinators to space
							type: match[0].replace(rtrim, " ")
						});
						soFar = soFar.slice(matched.length);
					}

					// Filters
					for (type in Expr.filter) {
						if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
							matched = match.shift();
							tokens.push({
								value: matched,
								type: type,
								matches: match
							});
							soFar = soFar.slice(matched.length);
						}
					}

					if (!matched) {
						break;
					}
				}

				// Return the length of the invalid excess
				// if we're just parsing
				// Otherwise, throw an error or return tokens
				return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) :
				// Cache the tokens
				tokenCache(selector, groups).slice(0);
			};

			function toSelector(tokens) {
				var i = 0,
				    len = tokens.length,
				    selector = "";
				for (; i < len; i++) {
					selector += tokens[i].value;
				}
				return selector;
			}

			function addCombinator(matcher, combinator, base) {
				var dir = combinator.dir,
				    skip = combinator.next,
				    key = skip || dir,
				    checkNonElements = base && key === "parentNode",
				    doneName = done++;

				return combinator.first ?
				// Check against closest ancestor/preceding element
				function (elem, context, xml) {
					while (elem = elem[dir]) {
						if (elem.nodeType === 1 || checkNonElements) {
							return matcher(elem, context, xml);
						}
					}
					return false;
				} :

				// Check against all ancestor/preceding elements
				function (elem, context, xml) {
					var oldCache,
					    uniqueCache,
					    outerCache,
					    newCache = [dirruns, doneName];

					// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
					if (xml) {
						while (elem = elem[dir]) {
							if (elem.nodeType === 1 || checkNonElements) {
								if (matcher(elem, context, xml)) {
									return true;
								}
							}
						}
					} else {
						while (elem = elem[dir]) {
							if (elem.nodeType === 1 || checkNonElements) {
								outerCache = elem[expando] || (elem[expando] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

								if (skip && skip === elem.nodeName.toLowerCase()) {
									elem = elem[dir] || elem;
								} else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {

									// Assign to newCache so results back-propagate to previous elements
									return newCache[2] = oldCache[2];
								} else {
									// Reuse newcache so results back-propagate to previous elements
									uniqueCache[key] = newCache;

									// A match means we're done; a fail means we have to keep checking
									if (newCache[2] = matcher(elem, context, xml)) {
										return true;
									}
								}
							}
						}
					}
					return false;
				};
			}

			function elementMatcher(matchers) {
				return matchers.length > 1 ? function (elem, context, xml) {
					var i = matchers.length;
					while (i--) {
						if (!matchers[i](elem, context, xml)) {
							return false;
						}
					}
					return true;
				} : matchers[0];
			}

			function multipleContexts(selector, contexts, results) {
				var i = 0,
				    len = contexts.length;
				for (; i < len; i++) {
					Sizzle(selector, contexts[i], results);
				}
				return results;
			}

			function condense(unmatched, map, filter, context, xml) {
				var elem,
				    newUnmatched = [],
				    i = 0,
				    len = unmatched.length,
				    mapped = map != null;

				for (; i < len; i++) {
					if (elem = unmatched[i]) {
						if (!filter || filter(elem, context, xml)) {
							newUnmatched.push(elem);
							if (mapped) {
								map.push(i);
							}
						}
					}
				}

				return newUnmatched;
			}

			function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
				if (postFilter && !postFilter[expando]) {
					postFilter = setMatcher(postFilter);
				}
				if (postFinder && !postFinder[expando]) {
					postFinder = setMatcher(postFinder, postSelector);
				}
				return markFunction(function (seed, results, context, xml) {
					var temp,
					    i,
					    elem,
					    preMap = [],
					    postMap = [],
					    preexisting = results.length,


					// Get initial elements from seed or context
					elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),


					// Prefilter to get matcher input, preserving a map for seed-results synchronization
					matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
					    matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || (seed ? preFilter : preexisting || postFilter) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results : matcherIn;

					// Find primary matches
					if (matcher) {
						matcher(matcherIn, matcherOut, context, xml);
					}

					// Apply postFilter
					if (postFilter) {
						temp = condense(matcherOut, postMap);
						postFilter(temp, [], context, xml);

						// Un-match failing elements by moving them back to matcherIn
						i = temp.length;
						while (i--) {
							if (elem = temp[i]) {
								matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
							}
						}
					}

					if (seed) {
						if (postFinder || preFilter) {
							if (postFinder) {
								// Get the final matcherOut by condensing this intermediate into postFinder contexts
								temp = [];
								i = matcherOut.length;
								while (i--) {
									if (elem = matcherOut[i]) {
										// Restore matcherIn since elem is not yet a final match
										temp.push(matcherIn[i] = elem);
									}
								}
								postFinder(null, matcherOut = [], temp, xml);
							}

							// Move matched elements from seed to results to keep them synchronized
							i = matcherOut.length;
							while (i--) {
								if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

									seed[temp] = !(results[temp] = elem);
								}
							}
						}

						// Add elements to results, through postFinder if defined
					} else {
						matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
						if (postFinder) {
							postFinder(null, results, matcherOut, xml);
						} else {
							push.apply(results, matcherOut);
						}
					}
				});
			}

			function matcherFromTokens(tokens) {
				var checkContext,
				    matcher,
				    j,
				    len = tokens.length,
				    leadingRelative = Expr.relative[tokens[0].type],
				    implicitRelative = leadingRelative || Expr.relative[" "],
				    i = leadingRelative ? 1 : 0,


				// The foundational matcher ensures that elements are reachable from top-level context(s)
				matchContext = addCombinator(function (elem) {
					return elem === checkContext;
				}, implicitRelative, true),
				    matchAnyContext = addCombinator(function (elem) {
					return indexOf(checkContext, elem) > -1;
				}, implicitRelative, true),
				    matchers = [function (elem, context, xml) {
					var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
					// Avoid hanging onto element (issue #299)
					checkContext = null;
					return ret;
				}];

				for (; i < len; i++) {
					if (matcher = Expr.relative[tokens[i].type]) {
						matchers = [addCombinator(elementMatcher(matchers), matcher)];
					} else {
						matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

						// Return special upon seeing a positional matcher
						if (matcher[expando]) {
							// Find the next relative operator (if any) for proper handling
							j = ++i;
							for (; j < len; j++) {
								if (Expr.relative[tokens[j].type]) {
									break;
								}
							}
							return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
						}
						matchers.push(matcher);
					}
				}

				return elementMatcher(matchers);
			}

			function matcherFromGroupMatchers(elementMatchers, setMatchers) {
				var bySet = setMatchers.length > 0,
				    byElement = elementMatchers.length > 0,
				    superMatcher = function (seed, context, xml, results, outermost) {
					var elem,
					    j,
					    matcher,
					    matchedCount = 0,
					    i = "0",
					    unmatched = seed && [],
					    setMatched = [],
					    contextBackup = outermostContext,

					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]("*", outermost),

					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1,
					    len = elems.length;

					if (outermost) {
						outermostContext = context === document || context || outermost;
					}

					// Add elements passing elementMatchers directly to results
					// Support: IE<9, Safari
					// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
					for (; i !== len && (elem = elems[i]) != null; i++) {
						if (byElement && elem) {
							j = 0;
							if (!context && elem.ownerDocument !== document) {
								setDocument(elem);
								xml = !documentIsHTML;
							}
							while (matcher = elementMatchers[j++]) {
								if (matcher(elem, context || document, xml)) {
									results.push(elem);
									break;
								}
							}
							if (outermost) {
								dirruns = dirrunsUnique;
							}
						}

						// Track unmatched elements for set filters
						if (bySet) {
							// They will have gone through all possible matchers
							if (elem = !matcher && elem) {
								matchedCount--;
							}

							// Lengthen the array for every element, matched or not
							if (seed) {
								unmatched.push(elem);
							}
						}
					}

					// `i` is now the count of elements visited above, and adding it to `matchedCount`
					// makes the latter nonnegative.
					matchedCount += i;

					// Apply set filters to unmatched elements
					// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
					// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
					// no element matchers and no seed.
					// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
					// case, which will result in a "00" `matchedCount` that differs from `i` but is also
					// numerically zero.
					if (bySet && i !== matchedCount) {
						j = 0;
						while (matcher = setMatchers[j++]) {
							matcher(unmatched, setMatched, context, xml);
						}

						if (seed) {
							// Reintegrate element matches to eliminate the need for sorting
							if (matchedCount > 0) {
								while (i--) {
									if (!(unmatched[i] || setMatched[i])) {
										setMatched[i] = pop.call(results);
									}
								}
							}

							// Discard index placeholder values to get only actual matches
							setMatched = condense(setMatched);
						}

						// Add matches to results
						push.apply(results, setMatched);

						// Seedless set matches succeeding multiple successful matchers stipulate sorting
						if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {

							Sizzle.uniqueSort(results);
						}
					}

					// Override manipulation of globals by nested matchers
					if (outermost) {
						dirruns = dirrunsUnique;
						outermostContext = contextBackup;
					}

					return unmatched;
				};

				return bySet ? markFunction(superMatcher) : superMatcher;
			}

			compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
				var i,
				    setMatchers = [],
				    elementMatchers = [],
				    cached = compilerCache[selector + " "];

				if (!cached) {
					// Generate a function of recursive functions that can be used to check each element
					if (!match) {
						match = tokenize(selector);
					}
					i = match.length;
					while (i--) {
						cached = matcherFromTokens(match[i]);
						if (cached[expando]) {
							setMatchers.push(cached);
						} else {
							elementMatchers.push(cached);
						}
					}

					// Cache the compiled function
					cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

					// Save selector and tokenization
					cached.selector = selector;
				}
				return cached;
			};

			/**
	   * A low-level selection function that works with Sizzle's compiled
	   *  selector functions
	   * @param {String|Function} selector A selector or a pre-compiled
	   *  selector function built with Sizzle.compile
	   * @param {Element} context
	   * @param {Array} [results]
	   * @param {Array} [seed] A set of elements to match against
	   */
			select = Sizzle.select = function (selector, context, results, seed) {
				var i,
				    tokens,
				    token,
				    type,
				    find,
				    compiled = typeof selector === "function" && selector,
				    match = !seed && tokenize(selector = compiled.selector || selector);

				results = results || [];

				// Try to minimize operations if there is only one selector in the list and no seed
				// (the latter of which guarantees us context)
				if (match.length === 1) {

					// Reduce context if the leading compound selector is an ID
					tokens = match[0] = match[0].slice(0);
					if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {

						context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
						if (!context) {
							return results;

							// Precompiled matchers will still verify ancestry, so step up a level
						} else if (compiled) {
							context = context.parentNode;
						}

						selector = selector.slice(tokens.shift().value.length);
					}

					// Fetch a seed set for right-to-left matching
					i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
					while (i--) {
						token = tokens[i];

						// Abort if we hit a combinator
						if (Expr.relative[type = token.type]) {
							break;
						}
						if (find = Expr.find[type]) {
							// Search, expanding context for leading sibling combinators
							if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {

								// If seed is empty or no tokens remain, we can return early
								tokens.splice(i, 1);
								selector = seed.length && toSelector(tokens);
								if (!selector) {
									push.apply(results, seed);
									return results;
								}

								break;
							}
						}
					}
				}

				// Compile and execute a filtering function if one is not provided
				// Provide `match` to avoid retokenization if we modified the selector above
				(compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
				return results;
			};

			// One-time assignments

			// Sort stability
			support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

			// Support: Chrome 14-35+
			// Always assume duplicates if they aren't passed to the comparison function
			support.detectDuplicates = !!hasDuplicate;

			// Initialize against the default document
			setDocument();

			// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
			// Detached nodes confoundingly follow *each other*
			support.sortDetached = assert(function (el) {
				// Should return 1, but returns 4 (following)
				return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
			});

			// Support: IE<8
			// Prevent attribute/property "interpolation"
			// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
			if (!assert(function (el) {
				el.innerHTML = "<a href='#'></a>";
				return el.firstChild.getAttribute("href") === "#";
			})) {
				addHandle("type|href|height|width", function (elem, name, isXML) {
					if (!isXML) {
						return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
					}
				});
			}

			// Support: IE<9
			// Use defaultValue in place of getAttribute("value")
			if (!support.attributes || !assert(function (el) {
				el.innerHTML = "<input/>";
				el.firstChild.setAttribute("value", "");
				return el.firstChild.getAttribute("value") === "";
			})) {
				addHandle("value", function (elem, name, isXML) {
					if (!isXML && elem.nodeName.toLowerCase() === "input") {
						return elem.defaultValue;
					}
				});
			}

			// Support: IE<9
			// Use getAttributeNode to fetch booleans when getAttribute lies
			if (!assert(function (el) {
				return el.getAttribute("disabled") == null;
			})) {
				addHandle(booleans, function (elem, name, isXML) {
					var val;
					if (!isXML) {
						return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
					}
				});
			}

			return Sizzle;
		}(window);

		jQuery.find = Sizzle;
		jQuery.expr = Sizzle.selectors;

		// Deprecated
		jQuery.expr[":"] = jQuery.expr.pseudos;
		jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
		jQuery.text = Sizzle.getText;
		jQuery.isXMLDoc = Sizzle.isXML;
		jQuery.contains = Sizzle.contains;
		jQuery.escapeSelector = Sizzle.escape;

		var dir = function (elem, dir, until) {
			var matched = [],
			    truncate = until !== undefined;

			while ((elem = elem[dir]) && elem.nodeType !== 9) {
				if (elem.nodeType === 1) {
					if (truncate && jQuery(elem).is(until)) {
						break;
					}
					matched.push(elem);
				}
			}
			return matched;
		};

		var siblings = function (n, elem) {
			var matched = [];

			for (; n; n = n.nextSibling) {
				if (n.nodeType === 1 && n !== elem) {
					matched.push(n);
				}
			}

			return matched;
		};

		var rneedsContext = jQuery.expr.match.needsContext;

		var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

		var risSimple = /^.[^:#\[\.,]*$/;

		// Implement the identical functionality for filter and not
		function winnow(elements, qualifier, not) {
			if (jQuery.isFunction(qualifier)) {
				return jQuery.grep(elements, function (elem, i) {
					return !!qualifier.call(elem, i, elem) !== not;
				});
			}

			// Single element
			if (qualifier.nodeType) {
				return jQuery.grep(elements, function (elem) {
					return elem === qualifier !== not;
				});
			}

			// Arraylike of elements (jQuery, arguments, Array)
			if (typeof qualifier !== "string") {
				return jQuery.grep(elements, function (elem) {
					return indexOf.call(qualifier, elem) > -1 !== not;
				});
			}

			// Simple selector that can be filtered directly, removing non-Elements
			if (risSimple.test(qualifier)) {
				return jQuery.filter(qualifier, elements, not);
			}

			// Complex selector, compare the two sets, removing non-Elements
			qualifier = jQuery.filter(qualifier, elements);
			return jQuery.grep(elements, function (elem) {
				return indexOf.call(qualifier, elem) > -1 !== not && elem.nodeType === 1;
			});
		}

		jQuery.filter = function (expr, elems, not) {
			var elem = elems[0];

			if (not) {
				expr = ":not(" + expr + ")";
			}

			if (elems.length === 1 && elem.nodeType === 1) {
				return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
			}

			return jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
				return elem.nodeType === 1;
			}));
		};

		jQuery.fn.extend({
			find: function (selector) {
				var i,
				    ret,
				    len = this.length,
				    self = this;

				if (typeof selector !== "string") {
					return this.pushStack(jQuery(selector).filter(function () {
						for (i = 0; i < len; i++) {
							if (jQuery.contains(self[i], this)) {
								return true;
							}
						}
					}));
				}

				ret = this.pushStack([]);

				for (i = 0; i < len; i++) {
					jQuery.find(selector, self[i], ret);
				}

				return len > 1 ? jQuery.uniqueSort(ret) : ret;
			},
			filter: function (selector) {
				return this.pushStack(winnow(this, selector || [], false));
			},
			not: function (selector) {
				return this.pushStack(winnow(this, selector || [], true));
			},
			is: function (selector) {
				return !!winnow(this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
			}
		});

		// Initialize a jQuery object


		// A central reference to the root jQuery(document)
		var rootjQuery,


		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		// Shortcut simple #id case for speed
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
		    init = jQuery.fn.init = function (selector, context, root) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if (!selector) {
				return this;
			}

			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			if (typeof selector === "string") {
				if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {

					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [null, selector, null];
				} else {
					match = rquickExpr.exec(selector);
				}

				// Match html or make sure no context is specified for #id
				if (match && (match[1] || !context)) {

					// HANDLE: $(html) -> $(array)
					if (match[1]) {
						context = context instanceof jQuery ? context[0] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));

						// HANDLE: $(html, props)
						if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
							for (match in context) {

								// Properties of context are called as methods if possible
								if (jQuery.isFunction(this[match])) {
									this[match](context[match]);

									// ...and otherwise set as attributes
								} else {
									this.attr(match, context[match]);
								}
							}
						}

						return this;

						// HANDLE: $(#id)
					} else {
						elem = document.getElementById(match[2]);

						if (elem) {

							// Inject the element directly into the jQuery object
							this[0] = elem;
							this.length = 1;
						}
						return this;
					}

					// HANDLE: $(expr, $(...))
				} else if (!context || context.jquery) {
					return (context || root).find(selector);

					// HANDLE: $(expr, context)
					// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor(context).find(selector);
				}

				// HANDLE: $(DOMElement)
			} else if (selector.nodeType) {
				this[0] = selector;
				this.length = 1;
				return this;

				// HANDLE: $(function)
				// Shortcut for document ready
			} else if (jQuery.isFunction(selector)) {
				return root.ready !== undefined ? root.ready(selector) :

				// Execute immediately if ready is not present
				selector(jQuery);
			}

			return jQuery.makeArray(selector, this);
		};

		// Give the init function the jQuery prototype for later instantiation
		init.prototype = jQuery.fn;

		// Initialize central reference
		rootjQuery = jQuery(document);

		var rparentsprev = /^(?:parents|prev(?:Until|All))/,


		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

		jQuery.fn.extend({
			has: function (target) {
				var targets = jQuery(target, this),
				    l = targets.length;

				return this.filter(function () {
					var i = 0;
					for (; i < l; i++) {
						if (jQuery.contains(this, targets[i])) {
							return true;
						}
					}
				});
			},

			closest: function (selectors, context) {
				var cur,
				    i = 0,
				    l = this.length,
				    matched = [],
				    targets = typeof selectors !== "string" && jQuery(selectors);

				// Positional selectors never match, since there's no _selection_ context
				if (!rneedsContext.test(selectors)) {
					for (; i < l; i++) {
						for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {

							// Always skip document fragments
							if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 :

							// Don't pass non-elements to Sizzle
							cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {

								matched.push(cur);
								break;
							}
						}
					}
				}

				return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
			},

			// Determine the position of an element within the set
			index: function (elem) {

				// No argument, return index in parent
				if (!elem) {
					return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
				}

				// Index in selector
				if (typeof elem === "string") {
					return indexOf.call(jQuery(elem), this[0]);
				}

				// Locate the position of the desired element
				return indexOf.call(this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[0] : elem);
			},

			add: function (selector, context) {
				return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
			},

			addBack: function (selector) {
				return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
			}
		});

		function sibling(cur, dir) {
			while ((cur = cur[dir]) && cur.nodeType !== 1) {}
			return cur;
		}

		jQuery.each({
			parent: function (elem) {
				var parent = elem.parentNode;
				return parent && parent.nodeType !== 11 ? parent : null;
			},
			parents: function (elem) {
				return dir(elem, "parentNode");
			},
			parentsUntil: function (elem, i, until) {
				return dir(elem, "parentNode", until);
			},
			next: function (elem) {
				return sibling(elem, "nextSibling");
			},
			prev: function (elem) {
				return sibling(elem, "previousSibling");
			},
			nextAll: function (elem) {
				return dir(elem, "nextSibling");
			},
			prevAll: function (elem) {
				return dir(elem, "previousSibling");
			},
			nextUntil: function (elem, i, until) {
				return dir(elem, "nextSibling", until);
			},
			prevUntil: function (elem, i, until) {
				return dir(elem, "previousSibling", until);
			},
			siblings: function (elem) {
				return siblings((elem.parentNode || {}).firstChild, elem);
			},
			children: function (elem) {
				return siblings(elem.firstChild);
			},
			contents: function (elem) {
				return elem.contentDocument || jQuery.merge([], elem.childNodes);
			}
		}, function (name, fn) {
			jQuery.fn[name] = function (until, selector) {
				var matched = jQuery.map(this, fn, until);

				if (name.slice(-5) !== "Until") {
					selector = until;
				}

				if (selector && typeof selector === "string") {
					matched = jQuery.filter(selector, matched);
				}

				if (this.length > 1) {

					// Remove duplicates
					if (!guaranteedUnique[name]) {
						jQuery.uniqueSort(matched);
					}

					// Reverse order for parents* and prev-derivatives
					if (rparentsprev.test(name)) {
						matched.reverse();
					}
				}

				return this.pushStack(matched);
			};
		});
		var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

		// Convert String-formatted options into Object-formatted ones
		function createOptions(options) {
			var object = {};
			jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag) {
				object[flag] = true;
			});
			return object;
		}

		/*
	  * Create a callback list using the following parameters:
	  *
	  *	options: an optional list of space-separated options that will change how
	  *			the callback list behaves or a more traditional option object
	  *
	  * By default a callback list will act like an event callback list and can be
	  * "fired" multiple times.
	  *
	  * Possible options:
	  *
	  *	once:			will ensure the callback list can only be fired once (like a Deferred)
	  *
	  *	memory:			will keep track of previous values and will call any callback added
	  *					after the list has been fired right away with the latest "memorized"
	  *					values (like a Deferred)
	  *
	  *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	  *
	  *	stopOnFalse:	interrupt callings when a callback returns false
	  *
	  */
		jQuery.Callbacks = function (options) {

			// Convert options from String-formatted to Object-formatted if needed
			// (we check in cache first)
			options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);

			var // Flag to know if list is currently firing
			firing,


			// Last fire value for non-forgettable lists
			memory,


			// Flag to know if list was already fired
			fired,


			// Flag to prevent firing
			locked,


			// Actual callback list
			list = [],


			// Queue of execution data for repeatable lists
			queue = [],


			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,


			// Fire callbacks
			fire = function () {

				// Enforce single-firing
				locked = options.once;

				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for (; queue.length; firingIndex = -1) {
					memory = queue.shift();
					while (++firingIndex < list.length) {

						// Run callback and check for early termination
						if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {

							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}

				// Forget the data if we're done with it
				if (!options.memory) {
					memory = false;
				}

				firing = false;

				// Clean up if we're done firing for good
				if (locked) {

					// Keep an empty list if we have data for future add calls
					if (memory) {
						list = [];

						// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},


			// Actual Callbacks object
			self = {

				// Add a callback or a collection of callbacks to the list
				add: function () {
					if (list) {

						// If we have memory from a past run, we should fire after adding
						if (memory && !firing) {
							firingIndex = list.length - 1;
							queue.push(memory);
						}

						(function add(args) {
							jQuery.each(args, function (_, arg) {
								if (jQuery.isFunction(arg)) {
									if (!options.unique || !self.has(arg)) {
										list.push(arg);
									}
								} else if (arg && arg.length && jQuery.type(arg) !== "string") {

									// Inspect recursively
									add(arg);
								}
							});
						})(arguments);

						if (memory && !firing) {
							fire();
						}
					}
					return this;
				},

				// Remove a callback from the list
				remove: function () {
					jQuery.each(arguments, function (_, arg) {
						var index;
						while ((index = jQuery.inArray(arg, list, index)) > -1) {
							list.splice(index, 1);

							// Handle firing indexes
							if (index <= firingIndex) {
								firingIndex--;
							}
						}
					});
					return this;
				},

				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function (fn) {
					return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
				},

				// Remove all callbacks from the list
				empty: function () {
					if (list) {
						list = [];
					}
					return this;
				},

				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function () {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function () {
					return !list;
				},

				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function () {
					locked = queue = [];
					if (!memory && !firing) {
						list = memory = "";
					}
					return this;
				},
				locked: function () {
					return !!locked;
				},

				// Call all callbacks with the given context and arguments
				fireWith: function (context, args) {
					if (!locked) {
						args = args || [];
						args = [context, args.slice ? args.slice() : args];
						queue.push(args);
						if (!firing) {
							fire();
						}
					}
					return this;
				},

				// Call all the callbacks with the given arguments
				fire: function () {
					self.fireWith(this, arguments);
					return this;
				},

				// To know if the callbacks have already been called at least once
				fired: function () {
					return !!fired;
				}
			};

			return self;
		};

		function Identity(v) {
			return v;
		}
		function Thrower(ex) {
			throw ex;
		}

		function adoptValue(value, resolve, reject) {
			var method;

			try {

				// Check for promise aspect first to privilege synchronous behavior
				if (value && jQuery.isFunction(method = value.promise)) {
					method.call(value).done(resolve).fail(reject);

					// Other thenables
				} else if (value && jQuery.isFunction(method = value.then)) {
					method.call(value, resolve, reject);

					// Other non-thenables
				} else {

					// Support: Android 4.0 only
					// Strict mode functions invoked without .call/.apply get global-object context
					resolve.call(undefined, value);
				}

				// For Promises/A+, convert exceptions into rejections
				// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
				// Deferred#then to conditionally suppress rejection.
			} catch (value) {

				// Support: Android 4.0 only
				// Strict mode functions invoked without .call/.apply get global-object context
				reject.call(undefined, value);
			}
		}

		jQuery.extend({

			Deferred: function (func) {
				var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				["notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory"), 2], ["resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 1, "rejected"]],
				    state = "pending",
				    promise = {
					state: function () {
						return state;
					},
					always: function () {
						deferred.done(arguments).fail(arguments);
						return this;
					},
					"catch": function (fn) {
						return promise.then(null, fn);
					},

					// Keep pipe for back-compat
					pipe: function () /* fnDone, fnFail, fnProgress */{
						var fns = arguments;

						return jQuery.Deferred(function (newDefer) {
							jQuery.each(tuples, function (i, tuple) {

								// Map tuples (progress, done, fail) to arguments (done, fail, progress)
								var fn = jQuery.isFunction(fns[tuple[4]]) && fns[tuple[4]];

								// deferred.progress(function() { bind to newDefer or newDefer.notify })
								// deferred.done(function() { bind to newDefer or newDefer.resolve })
								// deferred.fail(function() { bind to newDefer or newDefer.reject })
								deferred[tuple[1]](function () {
									var returned = fn && fn.apply(this, arguments);
									if (returned && jQuery.isFunction(returned.promise)) {
										returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
									} else {
										newDefer[tuple[0] + "With"](this, fn ? [returned] : arguments);
									}
								});
							});
							fns = null;
						}).promise();
					},
					then: function (onFulfilled, onRejected, onProgress) {
						var maxDepth = 0;
						function resolve(depth, deferred, handler, special) {
							return function () {
								var that = this,
								    args = arguments,
								    mightThrow = function () {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if (depth < maxDepth) {
										return;
									}

									returned = handler.apply(that, args);

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if (returned === deferred.promise()) {
										throw new TypeError("Thenable self-resolution");
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned && (

									// Support: Promises/A+ section 2.3.4
									// https://promisesaplus.com/#point-64
									// Only check objects and functions for thenability
									typeof returned === "object" || typeof returned === "function") && returned.then;

									// Handle a returned thenable
									if (jQuery.isFunction(then)) {

										// Special processors (notify) just wait for resolution
										if (special) {
											then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special));

											// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.notifyWith));
										}

										// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if (handler !== Identity) {
											that = undefined;
											args = [returned];
										}

										// Process the value(s)
										// Default process is resolve
										(special || deferred.resolveWith)(that, args);
									}
								},


								// Only normal processors (resolve) catch and reject exceptions
								process = special ? mightThrow : function () {
									try {
										mightThrow();
									} catch (e) {

										if (jQuery.Deferred.exceptionHook) {
											jQuery.Deferred.exceptionHook(e, process.stackTrace);
										}

										// Support: Promises/A+ section 2.3.3.3.4.1
										// https://promisesaplus.com/#point-61
										// Ignore post-resolution exceptions
										if (depth + 1 >= maxDepth) {

											// Only substitute handlers pass on context
											// and multiple values (non-spec behavior)
											if (handler !== Thrower) {
												that = undefined;
												args = [e];
											}

											deferred.rejectWith(that, args);
										}
									}
								};

								// Support: Promises/A+ section 2.3.3.3.1
								// https://promisesaplus.com/#point-57
								// Re-resolve promises immediately to dodge false rejection from
								// subsequent errors
								if (depth) {
									process();
								} else {

									// Call an optional hook to record the stack, in case of exception
									// since it's otherwise lost when execution goes async
									if (jQuery.Deferred.getStackHook) {
										process.stackTrace = jQuery.Deferred.getStackHook();
									}
									window.setTimeout(process);
								}
							};
						}

						return jQuery.Deferred(function (newDefer) {

							// progress_handlers.add( ... )
							tuples[0][3].add(resolve(0, newDefer, jQuery.isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith));

							// fulfilled_handlers.add( ... )
							tuples[1][3].add(resolve(0, newDefer, jQuery.isFunction(onFulfilled) ? onFulfilled : Identity));

							// rejected_handlers.add( ... )
							tuples[2][3].add(resolve(0, newDefer, jQuery.isFunction(onRejected) ? onRejected : Thrower));
						}).promise();
					},

					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function (obj) {
						return obj != null ? jQuery.extend(obj, promise) : promise;
					}
				},
				    deferred = {};

				// Add list-specific methods
				jQuery.each(tuples, function (i, tuple) {
					var list = tuple[2],
					    stateString = tuple[5];

					// promise.progress = list.add
					// promise.done = list.add
					// promise.fail = list.add
					promise[tuple[1]] = list.add;

					// Handle state
					if (stateString) {
						list.add(function () {

							// state = "resolved" (i.e., fulfilled)
							// state = "rejected"
							state = stateString;
						},

						// rejected_callbacks.disable
						// fulfilled_callbacks.disable
						tuples[3 - i][2].disable,

						// progress_callbacks.lock
						tuples[0][2].lock);
					}

					// progress_handlers.fire
					// fulfilled_handlers.fire
					// rejected_handlers.fire
					list.add(tuple[3].fire);

					// deferred.notify = function() { deferred.notifyWith(...) }
					// deferred.resolve = function() { deferred.resolveWith(...) }
					// deferred.reject = function() { deferred.rejectWith(...) }
					deferred[tuple[0]] = function () {
						deferred[tuple[0] + "With"](this === deferred ? undefined : this, arguments);
						return this;
					};

					// deferred.notifyWith = list.fireWith
					// deferred.resolveWith = list.fireWith
					// deferred.rejectWith = list.fireWith
					deferred[tuple[0] + "With"] = list.fireWith;
				});

				// Make the deferred a promise
				promise.promise(deferred);

				// Call given func if any
				if (func) {
					func.call(deferred, deferred);
				}

				// All done!
				return deferred;
			},

			// Deferred helper
			when: function (singleValue) {
				var

				// count of uncompleted subordinates
				remaining = arguments.length,


				// count of unprocessed arguments
				i = remaining,


				// subordinate fulfillment data
				resolveContexts = Array(i),
				    resolveValues = slice.call(arguments),


				// the master Deferred
				master = jQuery.Deferred(),


				// subordinate callback factory
				updateFunc = function (i) {
					return function (value) {
						resolveContexts[i] = this;
						resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value;
						if (! --remaining) {
							master.resolveWith(resolveContexts, resolveValues);
						}
					};
				};

				// Single- and empty arguments are adopted like Promise.resolve
				if (remaining <= 1) {
					adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject);

					// Use .then() to unwrap secondary thenables (cf. gh-3000)
					if (master.state() === "pending" || jQuery.isFunction(resolveValues[i] && resolveValues[i].then)) {

						return master.then();
					}
				}

				// Multiple arguments are aggregated like Promise.all array elements
				while (i--) {
					adoptValue(resolveValues[i], updateFunc(i), master.reject);
				}

				return master.promise();
			}
		});

		// These usually indicate a programmer mistake during development,
		// warn about them ASAP rather than swallowing them by default.
		var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

		jQuery.Deferred.exceptionHook = function (error, stack) {

			// Support: IE 8 - 9 only
			// Console exists when dev tools are open, which can happen at any time
			if (window.console && window.console.warn && error && rerrorNames.test(error.name)) {
				window.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
			}
		};

		jQuery.readyException = function (error) {
			window.setTimeout(function () {
				throw error;
			});
		};

		// The deferred used on DOM ready
		var readyList = jQuery.Deferred();

		jQuery.fn.ready = function (fn) {

			readyList.then(fn)

			// Wrap jQuery.readyException in a function so that the lookup
			// happens at the time of error handling instead of callback
			// registration.
			.catch(function (error) {
				jQuery.readyException(error);
			});

			return this;
		};

		jQuery.extend({

			// Is the DOM ready to be used? Set to true once it occurs.
			isReady: false,

			// A counter to track how many items to wait for before
			// the ready event fires. See #6781
			readyWait: 1,

			// Hold (or release) the ready event
			holdReady: function (hold) {
				if (hold) {
					jQuery.readyWait++;
				} else {
					jQuery.ready(true);
				}
			},

			// Handle when the DOM is ready
			ready: function (wait) {

				// Abort if there are pending holds or we're already ready
				if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
					return;
				}

				// Remember that the DOM is ready
				jQuery.isReady = true;

				// If a normal DOM Ready event fired, decrement, and wait if need be
				if (wait !== true && --jQuery.readyWait > 0) {
					return;
				}

				// If there are functions bound, to execute
				readyList.resolveWith(document, [jQuery]);
			}
		});

		jQuery.ready.then = readyList.then;

		// The ready event handler and self cleanup method
		function completed() {
			document.removeEventListener("DOMContentLoaded", completed);
			window.removeEventListener("load", completed);
			jQuery.ready();
		}

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE <=9 - 10 only
		// Older IE sometimes signals "interactive" too soon
		if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout(jQuery.ready);
		} else {

			// Use the handy event callback
			document.addEventListener("DOMContentLoaded", completed);

			// A fallback to window.onload, that will always work
			window.addEventListener("load", completed);
		}

		// Multifunctional method to get and set values of a collection
		// The value/s can optionally be executed if it's a function
		var access = function (elems, fn, key, value, chainable, emptyGet, raw) {
			var i = 0,
			    len = elems.length,
			    bulk = key == null;

			// Sets many values
			if (jQuery.type(key) === "object") {
				chainable = true;
				for (i in key) {
					access(elems, fn, i, key[i], true, emptyGet, raw);
				}

				// Sets one value
			} else if (value !== undefined) {
				chainable = true;

				if (!jQuery.isFunction(value)) {
					raw = true;
				}

				if (bulk) {

					// Bulk operations run against the entire set
					if (raw) {
						fn.call(elems, value);
						fn = null;

						// ...except when executing function values
					} else {
						bulk = fn;
						fn = function (elem, key, value) {
							return bulk.call(jQuery(elem), value);
						};
					}
				}

				if (fn) {
					for (; i < len; i++) {
						fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
					}
				}
			}

			if (chainable) {
				return elems;
			}

			// Gets
			if (bulk) {
				return fn.call(elems);
			}

			return len ? fn(elems[0], key) : emptyGet;
		};
		var acceptData = function (owner) {

			// Accepts only:
			//  - Node
			//    - Node.ELEMENT_NODE
			//    - Node.DOCUMENT_NODE
			//  - Object
			//    - Any
			return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
		};

		function Data() {
			this.expando = jQuery.expando + Data.uid++;
		}

		Data.uid = 1;

		Data.prototype = {

			cache: function (owner) {

				// Check if the owner object already has a cache
				var value = owner[this.expando];

				// If not, create one
				if (!value) {
					value = {};

					// We can accept data for non-element nodes in modern browsers,
					// but we should not, see #8335.
					// Always return an empty object.
					if (acceptData(owner)) {

						// If it is a node unlikely to be stringify-ed or looped over
						// use plain assignment
						if (owner.nodeType) {
							owner[this.expando] = value;

							// Otherwise secure it in a non-enumerable property
							// configurable must be true to allow the property to be
							// deleted when data is removed
						} else {
							Object.defineProperty(owner, this.expando, {
								value: value,
								configurable: true
							});
						}
					}
				}

				return value;
			},
			set: function (owner, data, value) {
				var prop,
				    cache = this.cache(owner);

				// Handle: [ owner, key, value ] args
				// Always use camelCase key (gh-2257)
				if (typeof data === "string") {
					cache[jQuery.camelCase(data)] = value;

					// Handle: [ owner, { properties } ] args
				} else {

					// Copy the properties one-by-one to the cache object
					for (prop in data) {
						cache[jQuery.camelCase(prop)] = data[prop];
					}
				}
				return cache;
			},
			get: function (owner, key) {
				return key === undefined ? this.cache(owner) :

				// Always use camelCase key (gh-2257)
				owner[this.expando] && owner[this.expando][jQuery.camelCase(key)];
			},
			access: function (owner, key, value) {

				// In cases where either:
				//
				//   1. No key was specified
				//   2. A string key was specified, but no value provided
				//
				// Take the "read" path and allow the get method to determine
				// which value to return, respectively either:
				//
				//   1. The entire cache object
				//   2. The data stored at the key
				//
				if (key === undefined || key && typeof key === "string" && value === undefined) {

					return this.get(owner, key);
				}

				// When the key is not a string, or both a key and value
				// are specified, set or extend (existing objects) with either:
				//
				//   1. An object of properties
				//   2. A key and value
				//
				this.set(owner, key, value);

				// Since the "set" path can have two possible entry points
				// return the expected data based on which path was taken[*]
				return value !== undefined ? value : key;
			},
			remove: function (owner, key) {
				var i,
				    cache = owner[this.expando];

				if (cache === undefined) {
					return;
				}

				if (key !== undefined) {

					// Support array or space separated string of keys
					if (jQuery.isArray(key)) {

						// If key is an array of keys...
						// We always set camelCase keys, so remove that.
						key = key.map(jQuery.camelCase);
					} else {
						key = jQuery.camelCase(key);

						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
					}

					i = key.length;

					while (i--) {
						delete cache[key[i]];
					}
				}

				// Remove the expando if there's no more data
				if (key === undefined || jQuery.isEmptyObject(cache)) {

					// Support: Chrome <=35 - 45
					// Webkit & Blink performance suffers when deleting properties
					// from DOM nodes, so set to undefined instead
					// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
					if (owner.nodeType) {
						owner[this.expando] = undefined;
					} else {
						delete owner[this.expando];
					}
				}
			},
			hasData: function (owner) {
				var cache = owner[this.expando];
				return cache !== undefined && !jQuery.isEmptyObject(cache);
			}
		};
		var dataPriv = new Data();

		var dataUser = new Data();

		//	Implementation Summary
		//
		//	1. Enforce API surface and semantic compatibility with 1.9.x branch
		//	2. Improve the module's maintainability by reducing the storage
		//		paths to a single mechanism.
		//	3. Use the same single mechanism to support "private" and "user" data.
		//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
		//	5. Avoid exposing implementation details on user objects (eg. expando properties)
		//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

		var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		    rmultiDash = /[A-Z]/g;

		function getData(data) {
			if (data === "true") {
				return true;
			}

			if (data === "false") {
				return false;
			}

			if (data === "null") {
				return null;
			}

			// Only convert to a number if it doesn't change the string
			if (data === +data + "") {
				return +data;
			}

			if (rbrace.test(data)) {
				return JSON.parse(data);
			}

			return data;
		}

		function dataAttr(elem, key, data) {
			var name;

			// If nothing was found internally, try to fetch any
			// data from the HTML5 data-* attribute
			if (data === undefined && elem.nodeType === 1) {
				name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
				data = elem.getAttribute(name);

				if (typeof data === "string") {
					try {
						data = getData(data);
					} catch (e) {}

					// Make sure we set the data so it isn't changed later
					dataUser.set(elem, key, data);
				} else {
					data = undefined;
				}
			}
			return data;
		}

		jQuery.extend({
			hasData: function (elem) {
				return dataUser.hasData(elem) || dataPriv.hasData(elem);
			},

			data: function (elem, name, data) {
				return dataUser.access(elem, name, data);
			},

			removeData: function (elem, name) {
				dataUser.remove(elem, name);
			},

			// TODO: Now that all calls to _data and _removeData have been replaced
			// with direct calls to dataPriv methods, these can be deprecated.
			_data: function (elem, name, data) {
				return dataPriv.access(elem, name, data);
			},

			_removeData: function (elem, name) {
				dataPriv.remove(elem, name);
			}
		});

		jQuery.fn.extend({
			data: function (key, value) {
				var i,
				    name,
				    data,
				    elem = this[0],
				    attrs = elem && elem.attributes;

				// Gets all values
				if (key === undefined) {
					if (this.length) {
						data = dataUser.get(elem);

						if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
							i = attrs.length;
							while (i--) {

								// Support: IE 11 only
								// The attrs elements can be null (#14894)
								if (attrs[i]) {
									name = attrs[i].name;
									if (name.indexOf("data-") === 0) {
										name = jQuery.camelCase(name.slice(5));
										dataAttr(elem, name, data[name]);
									}
								}
							}
							dataPriv.set(elem, "hasDataAttrs", true);
						}
					}

					return data;
				}

				// Sets multiple values
				if (typeof key === "object") {
					return this.each(function () {
						dataUser.set(this, key);
					});
				}

				return access(this, function (value) {
					var data;

					// The calling jQuery object (element matches) is not empty
					// (and therefore has an element appears at this[ 0 ]) and the
					// `value` parameter was not undefined. An empty jQuery object
					// will result in `undefined` for elem = this[ 0 ] which will
					// throw an exception if an attempt to read a data cache is made.
					if (elem && value === undefined) {

						// Attempt to get data from the cache
						// The key will always be camelCased in Data
						data = dataUser.get(elem, key);
						if (data !== undefined) {
							return data;
						}

						// Attempt to "discover" the data in
						// HTML5 custom data-* attrs
						data = dataAttr(elem, key);
						if (data !== undefined) {
							return data;
						}

						// We tried really hard, but the data doesn't exist.
						return;
					}

					// Set the data...
					this.each(function () {

						// We always store the camelCased key
						dataUser.set(this, key, value);
					});
				}, null, value, arguments.length > 1, null, true);
			},

			removeData: function (key) {
				return this.each(function () {
					dataUser.remove(this, key);
				});
			}
		});

		jQuery.extend({
			queue: function (elem, type, data) {
				var queue;

				if (elem) {
					type = (type || "fx") + "queue";
					queue = dataPriv.get(elem, type);

					// Speed up dequeue by getting out quickly if this is just a lookup
					if (data) {
						if (!queue || jQuery.isArray(data)) {
							queue = dataPriv.access(elem, type, jQuery.makeArray(data));
						} else {
							queue.push(data);
						}
					}
					return queue || [];
				}
			},

			dequeue: function (elem, type) {
				type = type || "fx";

				var queue = jQuery.queue(elem, type),
				    startLength = queue.length,
				    fn = queue.shift(),
				    hooks = jQuery._queueHooks(elem, type),
				    next = function () {
					jQuery.dequeue(elem, type);
				};

				// If the fx queue is dequeued, always remove the progress sentinel
				if (fn === "inprogress") {
					fn = queue.shift();
					startLength--;
				}

				if (fn) {

					// Add a progress sentinel to prevent the fx queue from being
					// automatically dequeued
					if (type === "fx") {
						queue.unshift("inprogress");
					}

					// Clear up the last queue stop function
					delete hooks.stop;
					fn.call(elem, next, hooks);
				}

				if (!startLength && hooks) {
					hooks.empty.fire();
				}
			},

			// Not public - generate a queueHooks object, or return the current one
			_queueHooks: function (elem, type) {
				var key = type + "queueHooks";
				return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
					empty: jQuery.Callbacks("once memory").add(function () {
						dataPriv.remove(elem, [type + "queue", key]);
					})
				});
			}
		});

		jQuery.fn.extend({
			queue: function (type, data) {
				var setter = 2;

				if (typeof type !== "string") {
					data = type;
					type = "fx";
					setter--;
				}

				if (arguments.length < setter) {
					return jQuery.queue(this[0], type);
				}

				return data === undefined ? this : this.each(function () {
					var queue = jQuery.queue(this, type, data);

					// Ensure a hooks for this queue
					jQuery._queueHooks(this, type);

					if (type === "fx" && queue[0] !== "inprogress") {
						jQuery.dequeue(this, type);
					}
				});
			},
			dequeue: function (type) {
				return this.each(function () {
					jQuery.dequeue(this, type);
				});
			},
			clearQueue: function (type) {
				return this.queue(type || "fx", []);
			},

			// Get a promise resolved when queues of a certain type
			// are emptied (fx is the type by default)
			promise: function (type, obj) {
				var tmp,
				    count = 1,
				    defer = jQuery.Deferred(),
				    elements = this,
				    i = this.length,
				    resolve = function () {
					if (! --count) {
						defer.resolveWith(elements, [elements]);
					}
				};

				if (typeof type !== "string") {
					obj = type;
					type = undefined;
				}
				type = type || "fx";

				while (i--) {
					tmp = dataPriv.get(elements[i], type + "queueHooks");
					if (tmp && tmp.empty) {
						count++;
						tmp.empty.add(resolve);
					}
				}
				resolve();
				return defer.promise(obj);
			}
		});
		var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

		var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");

		var cssExpand = ["Top", "Right", "Bottom", "Left"];

		var isHiddenWithinTree = function (elem, el) {

			// isHiddenWithinTree might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;

			// Inline style trumps all
			return elem.style.display === "none" || elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains(elem.ownerDocument, elem) && jQuery.css(elem, "display") === "none";
		};

		var swap = function (elem, options, callback, args) {
			var ret,
			    name,
			    old = {};

			// Remember the old values, and insert the new ones
			for (name in options) {
				old[name] = elem.style[name];
				elem.style[name] = options[name];
			}

			ret = callback.apply(elem, args || []);

			// Revert the old values
			for (name in options) {
				elem.style[name] = old[name];
			}

			return ret;
		};

		function adjustCSS(elem, prop, valueParts, tween) {
			var adjusted,
			    scale = 1,
			    maxIterations = 20,
			    currentValue = tween ? function () {
				return tween.cur();
			} : function () {
				return jQuery.css(elem, prop, "");
			},
			    initial = currentValue(),
			    unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),


			// Starting value computation is required for potential unit mismatches
			initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));

			if (initialInUnit && initialInUnit[3] !== unit) {

				// Trust units reported by jQuery.css
				unit = unit || initialInUnit[3];

				// Make sure we update the tween properties later on
				valueParts = valueParts || [];

				// Iteratively approximate from a nonzero starting point
				initialInUnit = +initial || 1;

				do {

					// If previous iteration zeroed out, double until we get *something*.
					// Use string for doubling so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					initialInUnit = initialInUnit / scale;
					jQuery.style(elem, prop, initialInUnit + unit);

					// Update scale, tolerating zero or NaN from tween.cur()
					// Break the loop if scale is unchanged or perfect, or if we've just had enough.
				} while (scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations);
			}

			if (valueParts) {
				initialInUnit = +initialInUnit || +initial || 0;

				// Apply relative offset (+=/-=) if specified
				adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
				if (tween) {
					tween.unit = unit;
					tween.start = initialInUnit;
					tween.end = adjusted;
				}
			}
			return adjusted;
		}

		var defaultDisplayMap = {};

		function getDefaultDisplay(elem) {
			var temp,
			    doc = elem.ownerDocument,
			    nodeName = elem.nodeName,
			    display = defaultDisplayMap[nodeName];

			if (display) {
				return display;
			}

			temp = doc.body.appendChild(doc.createElement(nodeName));
			display = jQuery.css(temp, "display");

			temp.parentNode.removeChild(temp);

			if (display === "none") {
				display = "block";
			}
			defaultDisplayMap[nodeName] = display;

			return display;
		}

		function showHide(elements, show) {
			var display,
			    elem,
			    values = [],
			    index = 0,
			    length = elements.length;

			// Determine new display value for elements that need to change
			for (; index < length; index++) {
				elem = elements[index];
				if (!elem.style) {
					continue;
				}

				display = elem.style.display;
				if (show) {

					// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
					// check is required in this first loop unless we have a nonempty display value (either
					// inline or about-to-be-restored)
					if (display === "none") {
						values[index] = dataPriv.get(elem, "display") || null;
						if (!values[index]) {
							elem.style.display = "";
						}
					}
					if (elem.style.display === "" && isHiddenWithinTree(elem)) {
						values[index] = getDefaultDisplay(elem);
					}
				} else {
					if (display !== "none") {
						values[index] = "none";

						// Remember what we're overwriting
						dataPriv.set(elem, "display", display);
					}
				}
			}

			// Set the display of the elements in a second loop to avoid constant reflow
			for (index = 0; index < length; index++) {
				if (values[index] != null) {
					elements[index].style.display = values[index];
				}
			}

			return elements;
		}

		jQuery.fn.extend({
			show: function () {
				return showHide(this, true);
			},
			hide: function () {
				return showHide(this);
			},
			toggle: function (state) {
				if (typeof state === "boolean") {
					return state ? this.show() : this.hide();
				}

				return this.each(function () {
					if (isHiddenWithinTree(this)) {
						jQuery(this).show();
					} else {
						jQuery(this).hide();
					}
				});
			}
		});
		var rcheckableType = /^(?:checkbox|radio)$/i;

		var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i;

		var rscriptType = /^$|\/(?:java|ecma)script/i;

		// We have to close these tags to support XHTML (#13200)
		var wrapMap = {

			// Support: IE <=9 only
			option: [1, "<select multiple='multiple'>", "</select>"],

			// XHTML parsers do not magically insert elements in the
			// same way that tag soup parsers do. So we cannot shorten
			// this by omitting <tbody> or other required elements.
			thead: [1, "<table>", "</table>"],
			col: [2, "<table><colgroup>", "</colgroup></table>"],
			tr: [2, "<table><tbody>", "</tbody></table>"],
			td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

			_default: [0, "", ""]
		};

		// Support: IE <=9 only
		wrapMap.optgroup = wrapMap.option;

		wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
		wrapMap.th = wrapMap.td;

		function getAll(context, tag) {

			// Support: IE <=9 - 11 only
			// Use typeof to avoid zero-argument method invocation on host objects (#15151)
			var ret;

			if (typeof context.getElementsByTagName !== "undefined") {
				ret = context.getElementsByTagName(tag || "*");
			} else if (typeof context.querySelectorAll !== "undefined") {
				ret = context.querySelectorAll(tag || "*");
			} else {
				ret = [];
			}

			if (tag === undefined || tag && jQuery.nodeName(context, tag)) {
				return jQuery.merge([context], ret);
			}

			return ret;
		}

		// Mark scripts as having already been evaluated
		function setGlobalEval(elems, refElements) {
			var i = 0,
			    l = elems.length;

			for (; i < l; i++) {
				dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
			}
		}

		var rhtml = /<|&#?\w+;/;

		function buildFragment(elems, context, scripts, selection, ignored) {
			var elem,
			    tmp,
			    tag,
			    wrap,
			    contains,
			    j,
			    fragment = context.createDocumentFragment(),
			    nodes = [],
			    i = 0,
			    l = elems.length;

			for (; i < l; i++) {
				elem = elems[i];

				if (elem || elem === 0) {

					// Add nodes directly
					if (jQuery.type(elem) === "object") {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

						// Convert non-html into a text node
					} else if (!rhtml.test(elem)) {
						nodes.push(context.createTextNode(elem));

						// Convert html into DOM nodes
					} else {
						tmp = tmp || fragment.appendChild(context.createElement("div"));

						// Deserialize a standard representation
						tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
						wrap = wrapMap[tag] || wrapMap._default;
						tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

						// Descend through wrappers to the right content
						j = wrap[0];
						while (j--) {
							tmp = tmp.lastChild;
						}

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge(nodes, tmp.childNodes);

						// Remember the top-level container
						tmp = fragment.firstChild;

						// Ensure the created nodes are orphaned (#12392)
						tmp.textContent = "";
					}
				}
			}

			// Remove wrapper from fragment
			fragment.textContent = "";

			i = 0;
			while (elem = nodes[i++]) {

				// Skip elements already in the context collection (trac-4087)
				if (selection && jQuery.inArray(elem, selection) > -1) {
					if (ignored) {
						ignored.push(elem);
					}
					continue;
				}

				contains = jQuery.contains(elem.ownerDocument, elem);

				// Append to fragment
				tmp = getAll(fragment.appendChild(elem), "script");

				// Preserve script evaluation history
				if (contains) {
					setGlobalEval(tmp);
				}

				// Capture executables
				if (scripts) {
					j = 0;
					while (elem = tmp[j++]) {
						if (rscriptType.test(elem.type || "")) {
							scripts.push(elem);
						}
					}
				}
			}

			return fragment;
		}

		(function () {
			var fragment = document.createDocumentFragment(),
			    div = fragment.appendChild(document.createElement("div")),
			    input = document.createElement("input");

			// Support: Android 4.0 - 4.3 only
			// Check state lost if the name is set (#11217)
			// Support: Windows Web Apps (WWA)
			// `name` and `type` must use .setAttribute for WWA (#14901)
			input.setAttribute("type", "radio");
			input.setAttribute("checked", "checked");
			input.setAttribute("name", "t");

			div.appendChild(input);

			// Support: Android <=4.1 only
			// Older WebKit doesn't clone checked state correctly in fragments
			support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

			// Support: IE <=11 only
			// Make sure textarea (and checkbox) defaultValue is properly cloned
			div.innerHTML = "<textarea>x</textarea>";
			support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
		})();
		var documentElement = document.documentElement;

		var rkeyEvent = /^key/,
		    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		    rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

		function returnTrue() {
			return true;
		}

		function returnFalse() {
			return false;
		}

		// Support: IE <=9 only
		// See #13393 for more info
		function safeActiveElement() {
			try {
				return document.activeElement;
			} catch (err) {}
		}

		function on(elem, types, selector, data, fn, one) {
			var origFn, type;

			// Types can be a map of types/handlers
			if (typeof types === "object") {

				// ( types-Object, selector, data )
				if (typeof selector !== "string") {

					// ( types-Object, data )
					data = data || selector;
					selector = undefined;
				}
				for (type in types) {
					on(elem, type, selector, data, types[type], one);
				}
				return elem;
			}

			if (data == null && fn == null) {

				// ( types, fn )
				fn = selector;
				data = selector = undefined;
			} else if (fn == null) {
				if (typeof selector === "string") {

					// ( types, selector, fn )
					fn = data;
					data = undefined;
				} else {

					// ( types, data, fn )
					fn = data;
					data = selector;
					selector = undefined;
				}
			}
			if (fn === false) {
				fn = returnFalse;
			} else if (!fn) {
				return elem;
			}

			if (one === 1) {
				origFn = fn;
				fn = function (event) {

					// Can use an empty set, since event contains the info
					jQuery().off(event);
					return origFn.apply(this, arguments);
				};

				// Use same guid so caller can remove using origFn
				fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
			}
			return elem.each(function () {
				jQuery.event.add(this, types, fn, data, selector);
			});
		}

		/*
	  * Helper functions for managing events -- not part of the public interface.
	  * Props to Dean Edwards' addEvent library for many of the ideas.
	  */
		jQuery.event = {

			global: {},

			add: function (elem, types, handler, data, selector) {

				var handleObjIn,
				    eventHandle,
				    tmp,
				    events,
				    t,
				    handleObj,
				    special,
				    handlers,
				    type,
				    namespaces,
				    origType,
				    elemData = dataPriv.get(elem);

				// Don't attach events to noData or text/comment nodes (but allow plain objects)
				if (!elemData) {
					return;
				}

				// Caller can pass in an object of custom data in lieu of the handler
				if (handler.handler) {
					handleObjIn = handler;
					handler = handleObjIn.handler;
					selector = handleObjIn.selector;
				}

				// Ensure that invalid selectors throw exceptions at attach time
				// Evaluate against documentElement in case elem is a non-element node (e.g., document)
				if (selector) {
					jQuery.find.matchesSelector(documentElement, selector);
				}

				// Make sure that the handler has a unique ID, used to find/remove it later
				if (!handler.guid) {
					handler.guid = jQuery.guid++;
				}

				// Init the element's event structure and main handler, if this is the first
				if (!(events = elemData.events)) {
					events = elemData.events = {};
				}
				if (!(eventHandle = elemData.handle)) {
					eventHandle = elemData.handle = function (e) {

						// Discard the second event of a jQuery.event.trigger() and
						// when an event is called after a page has unloaded
						return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
					};
				}

				// Handle multiple events separated by a space
				types = (types || "").match(rnothtmlwhite) || [""];
				t = types.length;
				while (t--) {
					tmp = rtypenamespace.exec(types[t]) || [];
					type = origType = tmp[1];
					namespaces = (tmp[2] || "").split(".").sort();

					// There *must* be a type, no attaching namespace-only handlers
					if (!type) {
						continue;
					}

					// If event changes its type, use the special event handlers for the changed type
					special = jQuery.event.special[type] || {};

					// If selector defined, determine special event api type, otherwise given type
					type = (selector ? special.delegateType : special.bindType) || type;

					// Update special based on newly reset type
					special = jQuery.event.special[type] || {};

					// handleObj is passed to all event handlers
					handleObj = jQuery.extend({
						type: type,
						origType: origType,
						data: data,
						handler: handler,
						guid: handler.guid,
						selector: selector,
						needsContext: selector && jQuery.expr.match.needsContext.test(selector),
						namespace: namespaces.join(".")
					}, handleObjIn);

					// Init the event handler queue if we're the first
					if (!(handlers = events[type])) {
						handlers = events[type] = [];
						handlers.delegateCount = 0;

						// Only use addEventListener if the special events handler returns false
						if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {

							if (elem.addEventListener) {
								elem.addEventListener(type, eventHandle);
							}
						}
					}

					if (special.add) {
						special.add.call(elem, handleObj);

						if (!handleObj.handler.guid) {
							handleObj.handler.guid = handler.guid;
						}
					}

					// Add to the element's handler list, delegates in front
					if (selector) {
						handlers.splice(handlers.delegateCount++, 0, handleObj);
					} else {
						handlers.push(handleObj);
					}

					// Keep track of which events have ever been used, for event optimization
					jQuery.event.global[type] = true;
				}
			},

			// Detach an event or set of events from an element
			remove: function (elem, types, handler, selector, mappedTypes) {

				var j,
				    origCount,
				    tmp,
				    events,
				    t,
				    handleObj,
				    special,
				    handlers,
				    type,
				    namespaces,
				    origType,
				    elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

				if (!elemData || !(events = elemData.events)) {
					return;
				}

				// Once for each type.namespace in types; type may be omitted
				types = (types || "").match(rnothtmlwhite) || [""];
				t = types.length;
				while (t--) {
					tmp = rtypenamespace.exec(types[t]) || [];
					type = origType = tmp[1];
					namespaces = (tmp[2] || "").split(".").sort();

					// Unbind all events (on this namespace, if provided) for the element
					if (!type) {
						for (type in events) {
							jQuery.event.remove(elem, type + types[t], handler, selector, true);
						}
						continue;
					}

					special = jQuery.event.special[type] || {};
					type = (selector ? special.delegateType : special.bindType) || type;
					handlers = events[type] || [];
					tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

					// Remove matching events
					origCount = j = handlers.length;
					while (j--) {
						handleObj = handlers[j];

						if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
							handlers.splice(j, 1);

							if (handleObj.selector) {
								handlers.delegateCount--;
							}
							if (special.remove) {
								special.remove.call(elem, handleObj);
							}
						}
					}

					// Remove generic event handler if we removed something and no more handlers exist
					// (avoids potential for endless recursion during removal of special event handlers)
					if (origCount && !handlers.length) {
						if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {

							jQuery.removeEvent(elem, type, elemData.handle);
						}

						delete events[type];
					}
				}

				// Remove data and the expando if it's no longer used
				if (jQuery.isEmptyObject(events)) {
					dataPriv.remove(elem, "handle events");
				}
			},

			dispatch: function (nativeEvent) {

				// Make a writable jQuery.Event from the native event object
				var event = jQuery.event.fix(nativeEvent);

				var i,
				    j,
				    ret,
				    matched,
				    handleObj,
				    handlerQueue,
				    args = new Array(arguments.length),
				    handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
				    special = jQuery.event.special[event.type] || {};

				// Use the fix-ed jQuery.Event rather than the (read-only) native event
				args[0] = event;

				for (i = 1; i < arguments.length; i++) {
					args[i] = arguments[i];
				}

				event.delegateTarget = this;

				// Call the preDispatch hook for the mapped type, and let it bail if desired
				if (special.preDispatch && special.preDispatch.call(this, event) === false) {
					return;
				}

				// Determine handlers
				handlerQueue = jQuery.event.handlers.call(this, event, handlers);

				// Run delegates first; they may want to stop propagation beneath us
				i = 0;
				while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
					event.currentTarget = matched.elem;

					j = 0;
					while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {

						// Triggered event must either 1) have no namespace, or 2) have namespace(s)
						// a subset or equal to those in the bound event (both can have no namespace).
						if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

							event.handleObj = handleObj;
							event.data = handleObj.data;

							ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);

							if (ret !== undefined) {
								if ((event.result = ret) === false) {
									event.preventDefault();
									event.stopPropagation();
								}
							}
						}
					}
				}

				// Call the postDispatch hook for the mapped type
				if (special.postDispatch) {
					special.postDispatch.call(this, event);
				}

				return event.result;
			},

			handlers: function (event, handlers) {
				var i,
				    handleObj,
				    sel,
				    matchedHandlers,
				    matchedSelectors,
				    handlerQueue = [],
				    delegateCount = handlers.delegateCount,
				    cur = event.target;

				// Find delegate handlers
				if (delegateCount &&

				// Support: IE <=9
				// Black-hole SVG <use> instance trees (trac-13180)
				cur.nodeType &&

				// Support: Firefox <=42
				// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
				// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
				// Support: IE 11 only
				// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
				!(event.type === "click" && event.button >= 1)) {

					for (; cur !== this; cur = cur.parentNode || this) {

						// Don't check non-elements (#13208)
						// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
						if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
							matchedHandlers = [];
							matchedSelectors = {};
							for (i = 0; i < delegateCount; i++) {
								handleObj = handlers[i];

								// Don't conflict with Object.prototype properties (#13203)
								sel = handleObj.selector + " ";

								if (matchedSelectors[sel] === undefined) {
									matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
								}
								if (matchedSelectors[sel]) {
									matchedHandlers.push(handleObj);
								}
							}
							if (matchedHandlers.length) {
								handlerQueue.push({ elem: cur, handlers: matchedHandlers });
							}
						}
					}
				}

				// Add the remaining (directly-bound) handlers
				cur = this;
				if (delegateCount < handlers.length) {
					handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
				}

				return handlerQueue;
			},

			addProp: function (name, hook) {
				Object.defineProperty(jQuery.Event.prototype, name, {
					enumerable: true,
					configurable: true,

					get: jQuery.isFunction(hook) ? function () {
						if (this.originalEvent) {
							return hook(this.originalEvent);
						}
					} : function () {
						if (this.originalEvent) {
							return this.originalEvent[name];
						}
					},

					set: function (value) {
						Object.defineProperty(this, name, {
							enumerable: true,
							configurable: true,
							writable: true,
							value: value
						});
					}
				});
			},

			fix: function (originalEvent) {
				return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
			},

			special: {
				load: {

					// Prevent triggered image.load events from bubbling to window.load
					noBubble: true
				},
				focus: {

					// Fire native event if possible so blur/focus sequence is correct
					trigger: function () {
						if (this !== safeActiveElement() && this.focus) {
							this.focus();
							return false;
						}
					},
					delegateType: "focusin"
				},
				blur: {
					trigger: function () {
						if (this === safeActiveElement() && this.blur) {
							this.blur();
							return false;
						}
					},
					delegateType: "focusout"
				},
				click: {

					// For checkbox, fire native event so checked state will be right
					trigger: function () {
						if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) {
							this.click();
							return false;
						}
					},

					// For cross-browser consistency, don't fire native .click() on links
					_default: function (event) {
						return jQuery.nodeName(event.target, "a");
					}
				},

				beforeunload: {
					postDispatch: function (event) {

						// Support: Firefox 20+
						// Firefox doesn't alert if the returnValue field is not set.
						if (event.result !== undefined && event.originalEvent) {
							event.originalEvent.returnValue = event.result;
						}
					}
				}
			}
		};

		jQuery.removeEvent = function (elem, type, handle) {

			// This "if" is needed for plain objects
			if (elem.removeEventListener) {
				elem.removeEventListener(type, handle);
			}
		};

		jQuery.Event = function (src, props) {

			// Allow instantiation without the 'new' keyword
			if (!(this instanceof jQuery.Event)) {
				return new jQuery.Event(src, props);
			}

			// Event object
			if (src && src.type) {
				this.originalEvent = src;
				this.type = src.type;

				// Events bubbling up the document may have been marked as prevented
				// by a handler lower down the tree; reflect the correct value.
				this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ? returnTrue : returnFalse;

				// Create target properties
				// Support: Safari <=6 - 7 only
				// Target should not be a text node (#504, #13143)
				this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;

				this.currentTarget = src.currentTarget;
				this.relatedTarget = src.relatedTarget;

				// Event type
			} else {
				this.type = src;
			}

			// Put explicitly provided properties onto the event object
			if (props) {
				jQuery.extend(this, props);
			}

			// Create a timestamp if incoming event doesn't have one
			this.timeStamp = src && src.timeStamp || jQuery.now();

			// Mark it as fixed
			this[jQuery.expando] = true;
		};

		// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
		// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
		jQuery.Event.prototype = {
			constructor: jQuery.Event,
			isDefaultPrevented: returnFalse,
			isPropagationStopped: returnFalse,
			isImmediatePropagationStopped: returnFalse,
			isSimulated: false,

			preventDefault: function () {
				var e = this.originalEvent;

				this.isDefaultPrevented = returnTrue;

				if (e && !this.isSimulated) {
					e.preventDefault();
				}
			},
			stopPropagation: function () {
				var e = this.originalEvent;

				this.isPropagationStopped = returnTrue;

				if (e && !this.isSimulated) {
					e.stopPropagation();
				}
			},
			stopImmediatePropagation: function () {
				var e = this.originalEvent;

				this.isImmediatePropagationStopped = returnTrue;

				if (e && !this.isSimulated) {
					e.stopImmediatePropagation();
				}

				this.stopPropagation();
			}
		};

		// Includes all common event props including KeyEvent and MouseEvent specific props
		jQuery.each({
			altKey: true,
			bubbles: true,
			cancelable: true,
			changedTouches: true,
			ctrlKey: true,
			detail: true,
			eventPhase: true,
			metaKey: true,
			pageX: true,
			pageY: true,
			shiftKey: true,
			view: true,
			"char": true,
			charCode: true,
			key: true,
			keyCode: true,
			button: true,
			buttons: true,
			clientX: true,
			clientY: true,
			offsetX: true,
			offsetY: true,
			pointerId: true,
			pointerType: true,
			screenX: true,
			screenY: true,
			targetTouches: true,
			toElement: true,
			touches: true,

			which: function (event) {
				var button = event.button;

				// Add which for key events
				if (event.which == null && rkeyEvent.test(event.type)) {
					return event.charCode != null ? event.charCode : event.keyCode;
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
					if (button & 1) {
						return 1;
					}

					if (button & 2) {
						return 3;
					}

					if (button & 4) {
						return 2;
					}

					return 0;
				}

				return event.which;
			}
		}, jQuery.event.addProp);

		// Create mouseenter/leave events using mouseover/out and event-time checks
		// so that event delegation works in jQuery.
		// Do the same for pointerenter/pointerleave and pointerover/pointerout
		//
		// Support: Safari 7 only
		// Safari sends mouseenter too often; see:
		// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
		// for the description of the bug (it existed in older Chrome versions as well).
		jQuery.each({
			mouseenter: "mouseover",
			mouseleave: "mouseout",
			pointerenter: "pointerover",
			pointerleave: "pointerout"
		}, function (orig, fix) {
			jQuery.event.special[orig] = {
				delegateType: fix,
				bindType: fix,

				handle: function (event) {
					var ret,
					    target = this,
					    related = event.relatedTarget,
					    handleObj = event.handleObj;

					// For mouseenter/leave call the handler if related is outside the target.
					// NB: No relatedTarget if the mouse left/entered the browser window
					if (!related || related !== target && !jQuery.contains(target, related)) {
						event.type = handleObj.origType;
						ret = handleObj.handler.apply(this, arguments);
						event.type = fix;
					}
					return ret;
				}
			};
		});

		jQuery.fn.extend({

			on: function (types, selector, data, fn) {
				return on(this, types, selector, data, fn);
			},
			one: function (types, selector, data, fn) {
				return on(this, types, selector, data, fn, 1);
			},
			off: function (types, selector, fn) {
				var handleObj, type;
				if (types && types.preventDefault && types.handleObj) {

					// ( event )  dispatched jQuery.Event
					handleObj = types.handleObj;
					jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
					return this;
				}
				if (typeof types === "object") {

					// ( types-object [, selector] )
					for (type in types) {
						this.off(type, selector, types[type]);
					}
					return this;
				}
				if (selector === false || typeof selector === "function") {

					// ( types [, fn] )
					fn = selector;
					selector = undefined;
				}
				if (fn === false) {
					fn = returnFalse;
				}
				return this.each(function () {
					jQuery.event.remove(this, types, fn, selector);
				});
			}
		});

		var

		/* eslint-disable max-len */

		// See https://github.com/eslint/eslint/issues/3229
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,


		/* eslint-enable */

		// Support: IE <=10 - 11, Edge 12 - 13
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,


		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		    rscriptTypeMasked = /^true\/(.*)/,
		    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

		function manipulationTarget(elem, content) {
			if (jQuery.nodeName(elem, "table") && jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {

				return elem.getElementsByTagName("tbody")[0] || elem;
			}

			return elem;
		}

		// Replace/restore the type attribute of script elements for safe DOM manipulation
		function disableScript(elem) {
			elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
			return elem;
		}
		function restoreScript(elem) {
			var match = rscriptTypeMasked.exec(elem.type);

			if (match) {
				elem.type = match[1];
			} else {
				elem.removeAttribute("type");
			}

			return elem;
		}

		function cloneCopyEvent(src, dest) {
			var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

			if (dest.nodeType !== 1) {
				return;
			}

			// 1. Copy private data: events, handlers, etc.
			if (dataPriv.hasData(src)) {
				pdataOld = dataPriv.access(src);
				pdataCur = dataPriv.set(dest, pdataOld);
				events = pdataOld.events;

				if (events) {
					delete pdataCur.handle;
					pdataCur.events = {};

					for (type in events) {
						for (i = 0, l = events[type].length; i < l; i++) {
							jQuery.event.add(dest, type, events[type][i]);
						}
					}
				}
			}

			// 2. Copy user data
			if (dataUser.hasData(src)) {
				udataOld = dataUser.access(src);
				udataCur = jQuery.extend({}, udataOld);

				dataUser.set(dest, udataCur);
			}
		}

		// Fix IE bugs, see support tests
		function fixInput(src, dest) {
			var nodeName = dest.nodeName.toLowerCase();

			// Fails to persist the checked state of a cloned checkbox or radio button.
			if (nodeName === "input" && rcheckableType.test(src.type)) {
				dest.checked = src.checked;

				// Fails to return the selected option to the default selected state when cloning options
			} else if (nodeName === "input" || nodeName === "textarea") {
				dest.defaultValue = src.defaultValue;
			}
		}

		function domManip(collection, args, callback, ignored) {

			// Flatten any nested arrays
			args = concat.apply([], args);

			var fragment,
			    first,
			    scripts,
			    hasScripts,
			    node,
			    doc,
			    i = 0,
			    l = collection.length,
			    iNoClone = l - 1,
			    value = args[0],
			    isFunction = jQuery.isFunction(value);

			// We can't cloneNode fragments that contain checked, in WebKit
			if (isFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
				return collection.each(function (index) {
					var self = collection.eq(index);
					if (isFunction) {
						args[0] = value.call(this, index, self.html());
					}
					domManip(self, args, callback, ignored);
				});
			}

			if (l) {
				fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
				first = fragment.firstChild;

				if (fragment.childNodes.length === 1) {
					fragment = first;
				}

				// Require either new content or an interest in ignored elements to invoke the callback
				if (first || ignored) {
					scripts = jQuery.map(getAll(fragment, "script"), disableScript);
					hasScripts = scripts.length;

					// Use the original fragment for the last item
					// instead of the first because it can end up
					// being emptied incorrectly in certain situations (#8070).
					for (; i < l; i++) {
						node = fragment;

						if (i !== iNoClone) {
							node = jQuery.clone(node, true, true);

							// Keep references to cloned scripts for later restoration
							if (hasScripts) {

								// Support: Android <=4.0 only, PhantomJS 1 only
								// push.apply(_, arraylike) throws on ancient WebKit
								jQuery.merge(scripts, getAll(node, "script"));
							}
						}

						callback.call(collection[i], node, i);
					}

					if (hasScripts) {
						doc = scripts[scripts.length - 1].ownerDocument;

						// Reenable scripts
						jQuery.map(scripts, restoreScript);

						// Evaluate executable scripts on first document insertion
						for (i = 0; i < hasScripts; i++) {
							node = scripts[i];
							if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {

								if (node.src) {

									// Optional AJAX dependency, but won't run scripts if not present
									if (jQuery._evalUrl) {
										jQuery._evalUrl(node.src);
									}
								} else {
									DOMEval(node.textContent.replace(rcleanScript, ""), doc);
								}
							}
						}
					}
				}
			}

			return collection;
		}

		function remove(elem, selector, keepData) {
			var node,
			    nodes = selector ? jQuery.filter(selector, elem) : elem,
			    i = 0;

			for (; (node = nodes[i]) != null; i++) {
				if (!keepData && node.nodeType === 1) {
					jQuery.cleanData(getAll(node));
				}

				if (node.parentNode) {
					if (keepData && jQuery.contains(node.ownerDocument, node)) {
						setGlobalEval(getAll(node, "script"));
					}
					node.parentNode.removeChild(node);
				}
			}

			return elem;
		}

		jQuery.extend({
			htmlPrefilter: function (html) {
				return html.replace(rxhtmlTag, "<$1></$2>");
			},

			clone: function (elem, dataAndEvents, deepDataAndEvents) {
				var i,
				    l,
				    srcElements,
				    destElements,
				    clone = elem.cloneNode(true),
				    inPage = jQuery.contains(elem.ownerDocument, elem);

				// Fix IE cloning issues
				if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {

					// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
					destElements = getAll(clone);
					srcElements = getAll(elem);

					for (i = 0, l = srcElements.length; i < l; i++) {
						fixInput(srcElements[i], destElements[i]);
					}
				}

				// Copy the events from the original to the clone
				if (dataAndEvents) {
					if (deepDataAndEvents) {
						srcElements = srcElements || getAll(elem);
						destElements = destElements || getAll(clone);

						for (i = 0, l = srcElements.length; i < l; i++) {
							cloneCopyEvent(srcElements[i], destElements[i]);
						}
					} else {
						cloneCopyEvent(elem, clone);
					}
				}

				// Preserve script evaluation history
				destElements = getAll(clone, "script");
				if (destElements.length > 0) {
					setGlobalEval(destElements, !inPage && getAll(elem, "script"));
				}

				// Return the cloned set
				return clone;
			},

			cleanData: function (elems) {
				var data,
				    elem,
				    type,
				    special = jQuery.event.special,
				    i = 0;

				for (; (elem = elems[i]) !== undefined; i++) {
					if (acceptData(elem)) {
						if (data = elem[dataPriv.expando]) {
							if (data.events) {
								for (type in data.events) {
									if (special[type]) {
										jQuery.event.remove(elem, type);

										// This is a shortcut to avoid jQuery.event.remove's overhead
									} else {
										jQuery.removeEvent(elem, type, data.handle);
									}
								}
							}

							// Support: Chrome <=35 - 45+
							// Assign undefined instead of using delete, see Data#remove
							elem[dataPriv.expando] = undefined;
						}
						if (elem[dataUser.expando]) {

							// Support: Chrome <=35 - 45+
							// Assign undefined instead of using delete, see Data#remove
							elem[dataUser.expando] = undefined;
						}
					}
				}
			}
		});

		jQuery.fn.extend({
			detach: function (selector) {
				return remove(this, selector, true);
			},

			remove: function (selector) {
				return remove(this, selector);
			},

			text: function (value) {
				return access(this, function (value) {
					return value === undefined ? jQuery.text(this) : this.empty().each(function () {
						if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
							this.textContent = value;
						}
					});
				}, null, value, arguments.length);
			},

			append: function () {
				return domManip(this, arguments, function (elem) {
					if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
						var target = manipulationTarget(this, elem);
						target.appendChild(elem);
					}
				});
			},

			prepend: function () {
				return domManip(this, arguments, function (elem) {
					if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
						var target = manipulationTarget(this, elem);
						target.insertBefore(elem, target.firstChild);
					}
				});
			},

			before: function () {
				return domManip(this, arguments, function (elem) {
					if (this.parentNode) {
						this.parentNode.insertBefore(elem, this);
					}
				});
			},

			after: function () {
				return domManip(this, arguments, function (elem) {
					if (this.parentNode) {
						this.parentNode.insertBefore(elem, this.nextSibling);
					}
				});
			},

			empty: function () {
				var elem,
				    i = 0;

				for (; (elem = this[i]) != null; i++) {
					if (elem.nodeType === 1) {

						// Prevent memory leaks
						jQuery.cleanData(getAll(elem, false));

						// Remove any remaining nodes
						elem.textContent = "";
					}
				}

				return this;
			},

			clone: function (dataAndEvents, deepDataAndEvents) {
				dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
				deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

				return this.map(function () {
					return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
				});
			},

			html: function (value) {
				return access(this, function (value) {
					var elem = this[0] || {},
					    i = 0,
					    l = this.length;

					if (value === undefined && elem.nodeType === 1) {
						return elem.innerHTML;
					}

					// See if we can take a shortcut and just use innerHTML
					if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

						value = jQuery.htmlPrefilter(value);

						try {
							for (; i < l; i++) {
								elem = this[i] || {};

								// Remove element nodes and prevent memory leaks
								if (elem.nodeType === 1) {
									jQuery.cleanData(getAll(elem, false));
									elem.innerHTML = value;
								}
							}

							elem = 0;

							// If using innerHTML throws an exception, use the fallback method
						} catch (e) {}
					}

					if (elem) {
						this.empty().append(value);
					}
				}, null, value, arguments.length);
			},

			replaceWith: function () {
				var ignored = [];

				// Make the changes, replacing each non-ignored context element with the new content
				return domManip(this, arguments, function (elem) {
					var parent = this.parentNode;

					if (jQuery.inArray(this, ignored) < 0) {
						jQuery.cleanData(getAll(this));
						if (parent) {
							parent.replaceChild(elem, this);
						}
					}

					// Force callback invocation
				}, ignored);
			}
		});

		jQuery.each({
			appendTo: "append",
			prependTo: "prepend",
			insertBefore: "before",
			insertAfter: "after",
			replaceAll: "replaceWith"
		}, function (name, original) {
			jQuery.fn[name] = function (selector) {
				var elems,
				    ret = [],
				    insert = jQuery(selector),
				    last = insert.length - 1,
				    i = 0;

				for (; i <= last; i++) {
					elems = i === last ? this : this.clone(true);
					jQuery(insert[i])[original](elems);

					// Support: Android <=4.0 only, PhantomJS 1 only
					// .get() because push.apply(_, arraylike) throws on ancient WebKit
					push.apply(ret, elems.get());
				}

				return this.pushStack(ret);
			};
		});
		var rmargin = /^margin/;

		var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

		var getStyles = function (elem) {

			// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;

			if (!view || !view.opener) {
				view = window;
			}

			return view.getComputedStyle(elem);
		};

		(function () {

			// Executing both pixelPosition & boxSizingReliable tests require only one layout
			// so they're executed at the same time to save the second computation.
			function computeStyleTests() {

				// This is a singleton, we need to execute it only once
				if (!div) {
					return;
				}

				div.style.cssText = "box-sizing:border-box;" + "position:relative;display:block;" + "margin:auto;border:1px;padding:1px;" + "top:1%;width:50%";
				div.innerHTML = "";
				documentElement.appendChild(container);

				var divStyle = window.getComputedStyle(div);
				pixelPositionVal = divStyle.top !== "1%";

				// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
				reliableMarginLeftVal = divStyle.marginLeft === "2px";
				boxSizingReliableVal = divStyle.width === "4px";

				// Support: Android 4.0 - 4.3 only
				// Some styles come back with percentage values, even though they shouldn't
				div.style.marginRight = "50%";
				pixelMarginRightVal = divStyle.marginRight === "4px";

				documentElement.removeChild(container);

				// Nullify the div so it wouldn't be stored in the memory and
				// it will also be a sign that checks already performed
				div = null;
			}

			var pixelPositionVal,
			    boxSizingReliableVal,
			    pixelMarginRightVal,
			    reliableMarginLeftVal,
			    container = document.createElement("div"),
			    div = document.createElement("div");

			// Finish early in limited (non-browser) environments
			if (!div.style) {
				return;
			}

			// Support: IE <=9 - 11 only
			// Style of cloned element affects source element cloned (#8908)
			div.style.backgroundClip = "content-box";
			div.cloneNode(true).style.backgroundClip = "";
			support.clearCloneStyle = div.style.backgroundClip === "content-box";

			container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" + "padding:0;margin-top:1px;position:absolute";
			container.appendChild(div);

			jQuery.extend(support, {
				pixelPosition: function () {
					computeStyleTests();
					return pixelPositionVal;
				},
				boxSizingReliable: function () {
					computeStyleTests();
					return boxSizingReliableVal;
				},
				pixelMarginRight: function () {
					computeStyleTests();
					return pixelMarginRightVal;
				},
				reliableMarginLeft: function () {
					computeStyleTests();
					return reliableMarginLeftVal;
				}
			});
		})();

		function curCSS(elem, name, computed) {
			var width,
			    minWidth,
			    maxWidth,
			    ret,
			    style = elem.style;

			computed = computed || getStyles(elem);

			// Support: IE <=9 only
			// getPropertyValue is only needed for .css('filter') (#12537)
			if (computed) {
				ret = computed.getPropertyValue(name) || computed[name];

				if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
					ret = jQuery.style(elem, name);
				}

				// A tribute to the "awesome hack by Dean Edwards"
				// Android Browser returns percentage for some values,
				// but width seems to be reliably pixels.
				// This is against the CSSOM draft spec:
				// https://drafts.csswg.org/cssom/#resolved-values
				if (!support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {

					// Remember the original values
					width = style.width;
					minWidth = style.minWidth;
					maxWidth = style.maxWidth;

					// Put in the new values to get a computed value out
					style.minWidth = style.maxWidth = style.width = ret;
					ret = computed.width;

					// Revert the changed values
					style.width = width;
					style.minWidth = minWidth;
					style.maxWidth = maxWidth;
				}
			}

			return ret !== undefined ?

			// Support: IE <=9 - 11 only
			// IE returns zIndex value as an integer.
			ret + "" : ret;
		}

		function addGetHookIf(conditionFn, hookFn) {

			// Define the hook, we'll check on the first run if it's really needed.
			return {
				get: function () {
					if (conditionFn()) {

						// Hook not needed (or it's not possible to use it due
						// to missing dependency), remove it.
						delete this.get;
						return;
					}

					// Hook needed; redefine it so that the support test is not executed again.
					return (this.get = hookFn).apply(this, arguments);
				}
			};
		}

		var

		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		    cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},
		    cssPrefixes = ["Webkit", "Moz", "ms"],
		    emptyStyle = document.createElement("div").style;

		// Return a css property mapped to a potentially vendor prefixed property
		function vendorPropName(name) {

			// Shortcut for names that are not vendor prefixed
			if (name in emptyStyle) {
				return name;
			}

			// Check for vendor prefixed names
			var capName = name[0].toUpperCase() + name.slice(1),
			    i = cssPrefixes.length;

			while (i--) {
				name = cssPrefixes[i] + capName;
				if (name in emptyStyle) {
					return name;
				}
			}
		}

		function setPositiveNumber(elem, value, subtract) {

			// Any relative (+/-) values have already been
			// normalized at this point
			var matches = rcssNum.exec(value);
			return matches ?

			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
		}

		function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
			var i,
			    val = 0;

			// If we already have the right measurement, avoid augmentation
			if (extra === (isBorderBox ? "border" : "content")) {
				i = 4;

				// Otherwise initialize for horizontal or vertical properties
			} else {
				i = name === "width" ? 1 : 0;
			}

			for (; i < 4; i += 2) {

				// Both box models exclude margin, so add it if we want it
				if (extra === "margin") {
					val += jQuery.css(elem, extra + cssExpand[i], true, styles);
				}

				if (isBorderBox) {

					// border-box includes padding, so remove it if we want content
					if (extra === "content") {
						val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
					}

					// At this point, extra isn't border nor margin, so remove border
					if (extra !== "margin") {
						val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
					}
				} else {

					// At this point, extra isn't content, so add padding
					val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

					// At this point, extra isn't content nor padding, so add border
					if (extra !== "padding") {
						val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
					}
				}
			}

			return val;
		}

		function getWidthOrHeight(elem, name, extra) {

			// Start with offset property, which is equivalent to the border-box value
			var val,
			    valueIsBorderBox = true,
			    styles = getStyles(elem),
			    isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";

			// Support: IE <=11 only
			// Running getBoundingClientRect on a disconnected node
			// in IE throws an error.
			if (elem.getClientRects().length) {
				val = elem.getBoundingClientRect()[name];
			}

			// Some non-html elements return undefined for offsetWidth, so check for null/undefined
			// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
			// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
			if (val <= 0 || val == null) {

				// Fall back to computed then uncomputed css if necessary
				val = curCSS(elem, name, styles);
				if (val < 0 || val == null) {
					val = elem.style[name];
				}

				// Computed unit is not pixels. Stop here and return.
				if (rnumnonpx.test(val)) {
					return val;
				}

				// Check for style in case a browser which returns unreliable values
				// for getComputedStyle silently falls back to the reliable elem.style
				valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);

				// Normalize "", auto, and prepare for extra
				val = parseFloat(val) || 0;
			}

			// Use the active box-sizing model to add/subtract irrelevant styles
			return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
		}

		jQuery.extend({

			// Add in style property hooks for overriding the default
			// behavior of getting and setting a style property
			cssHooks: {
				opacity: {
					get: function (elem, computed) {
						if (computed) {

							// We should always get a number back from opacity
							var ret = curCSS(elem, "opacity");
							return ret === "" ? "1" : ret;
						}
					}
				}
			},

			// Don't automatically add "px" to these possibly-unitless properties
			cssNumber: {
				"animationIterationCount": true,
				"columnCount": true,
				"fillOpacity": true,
				"flexGrow": true,
				"flexShrink": true,
				"fontWeight": true,
				"lineHeight": true,
				"opacity": true,
				"order": true,
				"orphans": true,
				"widows": true,
				"zIndex": true,
				"zoom": true
			},

			// Add in properties whose names you wish to fix before
			// setting or getting the value
			cssProps: {
				"float": "cssFloat"
			},

			// Get and set the style property on a DOM Node
			style: function (elem, name, value, extra) {

				// Don't set styles on text and comment nodes
				if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
					return;
				}

				// Make sure that we're working with the right name
				var ret,
				    type,
				    hooks,
				    origName = jQuery.camelCase(name),
				    style = elem.style;

				name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);

				// Gets hook for the prefixed version, then unprefixed version
				hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

				// Check if we're setting a value
				if (value !== undefined) {
					type = typeof value;

					// Convert "+=" or "-=" to relative numbers (#7345)
					if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
						value = adjustCSS(elem, name, ret);

						// Fixes bug #9237
						type = "number";
					}

					// Make sure that null and NaN values aren't set (#7116)
					if (value == null || value !== value) {
						return;
					}

					// If a number was passed in, add the unit (except for certain CSS properties)
					if (type === "number") {
						value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
					}

					// background-* props affect original clone's values
					if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
						style[name] = "inherit";
					}

					// If a hook was provided, use that value, otherwise just set the specified value
					if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {

						style[name] = value;
					}
				} else {

					// If a hook was provided get the non-computed value from there
					if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {

						return ret;
					}

					// Otherwise just get the value from the style object
					return style[name];
				}
			},

			css: function (elem, name, extra, styles) {
				var val,
				    num,
				    hooks,
				    origName = jQuery.camelCase(name);

				// Make sure that we're working with the right name
				name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);

				// Try prefixed name followed by the unprefixed name
				hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

				// If a hook was provided get the computed value from there
				if (hooks && "get" in hooks) {
					val = hooks.get(elem, true, extra);
				}

				// Otherwise, if a way to get the computed value exists, use that
				if (val === undefined) {
					val = curCSS(elem, name, styles);
				}

				// Convert "normal" to computed value
				if (val === "normal" && name in cssNormalTransform) {
					val = cssNormalTransform[name];
				}

				// Make numeric if forced or a qualifier was provided and val looks numeric
				if (extra === "" || extra) {
					num = parseFloat(val);
					return extra === true || isFinite(num) ? num || 0 : val;
				}
				return val;
			}
		});

		jQuery.each(["height", "width"], function (i, name) {
			jQuery.cssHooks[name] = {
				get: function (elem, computed, extra) {
					if (computed) {

						// Certain elements can have dimension info if we invisibly show them
						// but it must have a current display style that would benefit
						return rdisplayswap.test(jQuery.css(elem, "display")) && (

						// Support: Safari 8+
						// Table columns in Safari have non-zero offsetWidth & zero
						// getBoundingClientRect().width unless display is changed.
						// Support: IE <=11 only
						// Running getBoundingClientRect on a disconnected node
						// in IE throws an error.
						!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function () {
							return getWidthOrHeight(elem, name, extra);
						}) : getWidthOrHeight(elem, name, extra);
					}
				},

				set: function (elem, value, extra) {
					var matches,
					    styles = extra && getStyles(elem),
					    subtract = extra && augmentWidthOrHeight(elem, name, extra, jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles);

					// Convert to pixels if value adjustment is needed
					if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {

						elem.style[name] = value;
						value = jQuery.css(elem, name);
					}

					return setPositiveNumber(elem, value, subtract);
				}
			};
		});

		jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
			if (computed) {
				return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function () {
					return elem.getBoundingClientRect().left;
				})) + "px";
			}
		});

		// These hooks are used by animate to expand properties
		jQuery.each({
			margin: "",
			padding: "",
			border: "Width"
		}, function (prefix, suffix) {
			jQuery.cssHooks[prefix + suffix] = {
				expand: function (value) {
					var i = 0,
					    expanded = {},


					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split(" ") : [value];

					for (; i < 4; i++) {
						expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
					}

					return expanded;
				}
			};

			if (!rmargin.test(prefix)) {
				jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
			}
		});

		jQuery.fn.extend({
			css: function (name, value) {
				return access(this, function (elem, name, value) {
					var styles,
					    len,
					    map = {},
					    i = 0;

					if (jQuery.isArray(name)) {
						styles = getStyles(elem);
						len = name.length;

						for (; i < len; i++) {
							map[name[i]] = jQuery.css(elem, name[i], false, styles);
						}

						return map;
					}

					return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
				}, name, value, arguments.length > 1);
			}
		});

		function Tween(elem, options, prop, end, easing) {
			return new Tween.prototype.init(elem, options, prop, end, easing);
		}
		jQuery.Tween = Tween;

		Tween.prototype = {
			constructor: Tween,
			init: function (elem, options, prop, end, easing, unit) {
				this.elem = elem;
				this.prop = prop;
				this.easing = easing || jQuery.easing._default;
				this.options = options;
				this.start = this.now = this.cur();
				this.end = end;
				this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
			},
			cur: function () {
				var hooks = Tween.propHooks[this.prop];

				return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
			},
			run: function (percent) {
				var eased,
				    hooks = Tween.propHooks[this.prop];

				if (this.options.duration) {
					this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
				} else {
					this.pos = eased = percent;
				}
				this.now = (this.end - this.start) * eased + this.start;

				if (this.options.step) {
					this.options.step.call(this.elem, this.now, this);
				}

				if (hooks && hooks.set) {
					hooks.set(this);
				} else {
					Tween.propHooks._default.set(this);
				}
				return this;
			}
		};

		Tween.prototype.init.prototype = Tween.prototype;

		Tween.propHooks = {
			_default: {
				get: function (tween) {
					var result;

					// Use a property on the element directly when it is not a DOM element,
					// or when there is no matching style property that exists.
					if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
						return tween.elem[tween.prop];
					}

					// Passing an empty string as a 3rd parameter to .css will automatically
					// attempt a parseFloat and fallback to a string if the parse fails.
					// Simple values such as "10px" are parsed to Float;
					// complex values such as "rotate(1rad)" are returned as-is.
					result = jQuery.css(tween.elem, tween.prop, "");

					// Empty strings, null, undefined and "auto" are converted to 0.
					return !result || result === "auto" ? 0 : result;
				},
				set: function (tween) {

					// Use step hook for back compat.
					// Use cssHook if its there.
					// Use .style if available and use plain properties where available.
					if (jQuery.fx.step[tween.prop]) {
						jQuery.fx.step[tween.prop](tween);
					} else if (tween.elem.nodeType === 1 && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
						jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
					} else {
						tween.elem[tween.prop] = tween.now;
					}
				}
			}
		};

		// Support: IE <=9 only
		// Panic based approach to setting things on disconnected nodes
		Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
			set: function (tween) {
				if (tween.elem.nodeType && tween.elem.parentNode) {
					tween.elem[tween.prop] = tween.now;
				}
			}
		};

		jQuery.easing = {
			linear: function (p) {
				return p;
			},
			swing: function (p) {
				return 0.5 - Math.cos(p * Math.PI) / 2;
			},
			_default: "swing"
		};

		jQuery.fx = Tween.prototype.init;

		// Back compat <1.8 extension point
		jQuery.fx.step = {};

		var fxNow,
		    timerId,
		    rfxtypes = /^(?:toggle|show|hide)$/,
		    rrun = /queueHooks$/;

		function raf() {
			if (timerId) {
				window.requestAnimationFrame(raf);
				jQuery.fx.tick();
			}
		}

		// Animations created synchronously will run synchronously
		function createFxNow() {
			window.setTimeout(function () {
				fxNow = undefined;
			});
			return fxNow = jQuery.now();
		}

		// Generate parameters to create a standard animation
		function genFx(type, includeWidth) {
			var which,
			    i = 0,
			    attrs = { height: type };

			// If we include width, step value is 1 to do all cssExpand values,
			// otherwise step value is 2 to skip over Left and Right
			includeWidth = includeWidth ? 1 : 0;
			for (; i < 4; i += 2 - includeWidth) {
				which = cssExpand[i];
				attrs["margin" + which] = attrs["padding" + which] = type;
			}

			if (includeWidth) {
				attrs.opacity = attrs.width = type;
			}

			return attrs;
		}

		function createTween(value, prop, animation) {
			var tween,
			    collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
			    index = 0,
			    length = collection.length;
			for (; index < length; index++) {
				if (tween = collection[index].call(animation, prop, value)) {

					// We're done with this property
					return tween;
				}
			}
		}

		function defaultPrefilter(elem, props, opts) {
			var prop,
			    value,
			    toggle,
			    hooks,
			    oldfire,
			    propTween,
			    restoreDisplay,
			    display,
			    isBox = "width" in props || "height" in props,
			    anim = this,
			    orig = {},
			    style = elem.style,
			    hidden = elem.nodeType && isHiddenWithinTree(elem),
			    dataShow = dataPriv.get(elem, "fxshow");

			// Queue-skipping animations hijack the fx hooks
			if (!opts.queue) {
				hooks = jQuery._queueHooks(elem, "fx");
				if (hooks.unqueued == null) {
					hooks.unqueued = 0;
					oldfire = hooks.empty.fire;
					hooks.empty.fire = function () {
						if (!hooks.unqueued) {
							oldfire();
						}
					};
				}
				hooks.unqueued++;

				anim.always(function () {

					// Ensure the complete handler is called before this completes
					anim.always(function () {
						hooks.unqueued--;
						if (!jQuery.queue(elem, "fx").length) {
							hooks.empty.fire();
						}
					});
				});
			}

			// Detect show/hide animations
			for (prop in props) {
				value = props[prop];
				if (rfxtypes.test(value)) {
					delete props[prop];
					toggle = toggle || value === "toggle";
					if (value === (hidden ? "hide" : "show")) {

						// Pretend to be hidden if this is a "show" and
						// there is still data from a stopped show/hide
						if (value === "show" && dataShow && dataShow[prop] !== undefined) {
							hidden = true;

							// Ignore all other no-op show/hide data
						} else {
							continue;
						}
					}
					orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
				}
			}

			// Bail out if this is a no-op like .hide().hide()
			propTween = !jQuery.isEmptyObject(props);
			if (!propTween && jQuery.isEmptyObject(orig)) {
				return;
			}

			// Restrict "overflow" and "display" styles during box animations
			if (isBox && elem.nodeType === 1) {

				// Support: IE <=9 - 11, Edge 12 - 13
				// Record all 3 overflow attributes because IE does not infer the shorthand
				// from identically-valued overflowX and overflowY
				opts.overflow = [style.overflow, style.overflowX, style.overflowY];

				// Identify a display type, preferring old show/hide data over the CSS cascade
				restoreDisplay = dataShow && dataShow.display;
				if (restoreDisplay == null) {
					restoreDisplay = dataPriv.get(elem, "display");
				}
				display = jQuery.css(elem, "display");
				if (display === "none") {
					if (restoreDisplay) {
						display = restoreDisplay;
					} else {

						// Get nonempty value(s) by temporarily forcing visibility
						showHide([elem], true);
						restoreDisplay = elem.style.display || restoreDisplay;
						display = jQuery.css(elem, "display");
						showHide([elem]);
					}
				}

				// Animate inline elements as inline-block
				if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
					if (jQuery.css(elem, "float") === "none") {

						// Restore the original display value at the end of pure show/hide animations
						if (!propTween) {
							anim.done(function () {
								style.display = restoreDisplay;
							});
							if (restoreDisplay == null) {
								display = style.display;
								restoreDisplay = display === "none" ? "" : display;
							}
						}
						style.display = "inline-block";
					}
				}
			}

			if (opts.overflow) {
				style.overflow = "hidden";
				anim.always(function () {
					style.overflow = opts.overflow[0];
					style.overflowX = opts.overflow[1];
					style.overflowY = opts.overflow[2];
				});
			}

			// Implement show/hide animations
			propTween = false;
			for (prop in orig) {

				// General show/hide setup for this element animation
				if (!propTween) {
					if (dataShow) {
						if ("hidden" in dataShow) {
							hidden = dataShow.hidden;
						}
					} else {
						dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
					}

					// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
					if (toggle) {
						dataShow.hidden = !hidden;
					}

					// Show elements before animating them
					if (hidden) {
						showHide([elem], true);
					}

					/* eslint-disable no-loop-func */

					anim.done(function () {

						/* eslint-enable no-loop-func */

						// The final step of a "hide" animation is actually hiding the element
						if (!hidden) {
							showHide([elem]);
						}
						dataPriv.remove(elem, "fxshow");
						for (prop in orig) {
							jQuery.style(elem, prop, orig[prop]);
						}
					});
				}

				// Per-property setup
				propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
				if (!(prop in dataShow)) {
					dataShow[prop] = propTween.start;
					if (hidden) {
						propTween.end = propTween.start;
						propTween.start = 0;
					}
				}
			}
		}

		function propFilter(props, specialEasing) {
			var index, name, easing, value, hooks;

			// camelCase, specialEasing and expand cssHook pass
			for (index in props) {
				name = jQuery.camelCase(index);
				easing = specialEasing[name];
				value = props[index];
				if (jQuery.isArray(value)) {
					easing = value[1];
					value = props[index] = value[0];
				}

				if (index !== name) {
					props[name] = value;
					delete props[index];
				}

				hooks = jQuery.cssHooks[name];
				if (hooks && "expand" in hooks) {
					value = hooks.expand(value);
					delete props[name];

					// Not quite $.extend, this won't overwrite existing keys.
					// Reusing 'index' because we have the correct "name"
					for (index in value) {
						if (!(index in props)) {
							props[index] = value[index];
							specialEasing[index] = easing;
						}
					}
				} else {
					specialEasing[name] = easing;
				}
			}
		}

		function Animation(elem, properties, options) {
			var result,
			    stopped,
			    index = 0,
			    length = Animation.prefilters.length,
			    deferred = jQuery.Deferred().always(function () {

				// Don't match elem in the :animated selector
				delete tick.elem;
			}),
			    tick = function () {
				if (stopped) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
				    remaining = Math.max(0, animation.startTime + animation.duration - currentTime),


				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				    percent = 1 - temp,
				    index = 0,
				    length = animation.tweens.length;

				for (; index < length; index++) {
					animation.tweens[index].run(percent);
				}

				deferred.notifyWith(elem, [animation, percent, remaining]);

				if (percent < 1 && length) {
					return remaining;
				} else {
					deferred.resolveWith(elem, [animation]);
					return false;
				}
			},
			    animation = deferred.promise({
				elem: elem,
				props: jQuery.extend({}, properties),
				opts: jQuery.extend(true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function (prop, end) {
					var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
					animation.tweens.push(tween);
					return tween;
				},
				stop: function (gotoEnd) {
					var index = 0,


					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
					if (stopped) {
						return this;
					}
					stopped = true;
					for (; index < length; index++) {
						animation.tweens[index].run(1);
					}

					// Resolve when we played the last frame; otherwise, reject
					if (gotoEnd) {
						deferred.notifyWith(elem, [animation, 1, 0]);
						deferred.resolveWith(elem, [animation, gotoEnd]);
					} else {
						deferred.rejectWith(elem, [animation, gotoEnd]);
					}
					return this;
				}
			}),
			    props = animation.props;

			propFilter(props, animation.opts.specialEasing);

			for (; index < length; index++) {
				result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
				if (result) {
					if (jQuery.isFunction(result.stop)) {
						jQuery._queueHooks(animation.elem, animation.opts.queue).stop = jQuery.proxy(result.stop, result);
					}
					return result;
				}
			}

			jQuery.map(props, createTween, animation);

			if (jQuery.isFunction(animation.opts.start)) {
				animation.opts.start.call(elem, animation);
			}

			jQuery.fx.timer(jQuery.extend(tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			}));

			// attach callbacks from options
			return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
		}

		jQuery.Animation = jQuery.extend(Animation, {

			tweeners: {
				"*": [function (prop, value) {
					var tween = this.createTween(prop, value);
					adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
					return tween;
				}]
			},

			tweener: function (props, callback) {
				if (jQuery.isFunction(props)) {
					callback = props;
					props = ["*"];
				} else {
					props = props.match(rnothtmlwhite);
				}

				var prop,
				    index = 0,
				    length = props.length;

				for (; index < length; index++) {
					prop = props[index];
					Animation.tweeners[prop] = Animation.tweeners[prop] || [];
					Animation.tweeners[prop].unshift(callback);
				}
			},

			prefilters: [defaultPrefilter],

			prefilter: function (callback, prepend) {
				if (prepend) {
					Animation.prefilters.unshift(callback);
				} else {
					Animation.prefilters.push(callback);
				}
			}
		});

		jQuery.speed = function (speed, easing, fn) {
			var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
				complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
				duration: speed,
				easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
			};

			// Go to the end state if fx are off or if document is hidden
			if (jQuery.fx.off || document.hidden) {
				opt.duration = 0;
			} else {
				if (typeof opt.duration !== "number") {
					if (opt.duration in jQuery.fx.speeds) {
						opt.duration = jQuery.fx.speeds[opt.duration];
					} else {
						opt.duration = jQuery.fx.speeds._default;
					}
				}
			}

			// Normalize opt.queue - true/undefined/null -> "fx"
			if (opt.queue == null || opt.queue === true) {
				opt.queue = "fx";
			}

			// Queueing
			opt.old = opt.complete;

			opt.complete = function () {
				if (jQuery.isFunction(opt.old)) {
					opt.old.call(this);
				}

				if (opt.queue) {
					jQuery.dequeue(this, opt.queue);
				}
			};

			return opt;
		};

		jQuery.fn.extend({
			fadeTo: function (speed, to, easing, callback) {

				// Show any hidden elements after setting opacity to 0
				return this.filter(isHiddenWithinTree).css("opacity", 0).show()

				// Animate to the value specified
				.end().animate({ opacity: to }, speed, easing, callback);
			},
			animate: function (prop, speed, easing, callback) {
				var empty = jQuery.isEmptyObject(prop),
				    optall = jQuery.speed(speed, easing, callback),
				    doAnimation = function () {

					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation(this, jQuery.extend({}, prop), optall);

					// Empty animations, or finishing resolves immediately
					if (empty || dataPriv.get(this, "finish")) {
						anim.stop(true);
					}
				};
				doAnimation.finish = doAnimation;

				return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
			},
			stop: function (type, clearQueue, gotoEnd) {
				var stopQueue = function (hooks) {
					var stop = hooks.stop;
					delete hooks.stop;
					stop(gotoEnd);
				};

				if (typeof type !== "string") {
					gotoEnd = clearQueue;
					clearQueue = type;
					type = undefined;
				}
				if (clearQueue && type !== false) {
					this.queue(type || "fx", []);
				}

				return this.each(function () {
					var dequeue = true,
					    index = type != null && type + "queueHooks",
					    timers = jQuery.timers,
					    data = dataPriv.get(this);

					if (index) {
						if (data[index] && data[index].stop) {
							stopQueue(data[index]);
						}
					} else {
						for (index in data) {
							if (data[index] && data[index].stop && rrun.test(index)) {
								stopQueue(data[index]);
							}
						}
					}

					for (index = timers.length; index--;) {
						if (timers[index].elem === this && (type == null || timers[index].queue === type)) {

							timers[index].anim.stop(gotoEnd);
							dequeue = false;
							timers.splice(index, 1);
						}
					}

					// Start the next in the queue if the last step wasn't forced.
					// Timers currently will call their complete callbacks, which
					// will dequeue but only if they were gotoEnd.
					if (dequeue || !gotoEnd) {
						jQuery.dequeue(this, type);
					}
				});
			},
			finish: function (type) {
				if (type !== false) {
					type = type || "fx";
				}
				return this.each(function () {
					var index,
					    data = dataPriv.get(this),
					    queue = data[type + "queue"],
					    hooks = data[type + "queueHooks"],
					    timers = jQuery.timers,
					    length = queue ? queue.length : 0;

					// Enable finishing flag on private data
					data.finish = true;

					// Empty the queue first
					jQuery.queue(this, type, []);

					if (hooks && hooks.stop) {
						hooks.stop.call(this, true);
					}

					// Look for any active animations, and finish them
					for (index = timers.length; index--;) {
						if (timers[index].elem === this && timers[index].queue === type) {
							timers[index].anim.stop(true);
							timers.splice(index, 1);
						}
					}

					// Look for any animations in the old queue and finish them
					for (index = 0; index < length; index++) {
						if (queue[index] && queue[index].finish) {
							queue[index].finish.call(this);
						}
					}

					// Turn off finishing flag
					delete data.finish;
				});
			}
		});

		jQuery.each(["toggle", "show", "hide"], function (i, name) {
			var cssFn = jQuery.fn[name];
			jQuery.fn[name] = function (speed, easing, callback) {
				return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
			};
		});

		// Generate shortcuts for custom animations
		jQuery.each({
			slideDown: genFx("show"),
			slideUp: genFx("hide"),
			slideToggle: genFx("toggle"),
			fadeIn: { opacity: "show" },
			fadeOut: { opacity: "hide" },
			fadeToggle: { opacity: "toggle" }
		}, function (name, props) {
			jQuery.fn[name] = function (speed, easing, callback) {
				return this.animate(props, speed, easing, callback);
			};
		});

		jQuery.timers = [];
		jQuery.fx.tick = function () {
			var timer,
			    i = 0,
			    timers = jQuery.timers;

			fxNow = jQuery.now();

			for (; i < timers.length; i++) {
				timer = timers[i];

				// Checks the timer has not already been removed
				if (!timer() && timers[i] === timer) {
					timers.splice(i--, 1);
				}
			}

			if (!timers.length) {
				jQuery.fx.stop();
			}
			fxNow = undefined;
		};

		jQuery.fx.timer = function (timer) {
			jQuery.timers.push(timer);
			if (timer()) {
				jQuery.fx.start();
			} else {
				jQuery.timers.pop();
			}
		};

		jQuery.fx.interval = 13;
		jQuery.fx.start = function () {
			if (!timerId) {
				timerId = window.requestAnimationFrame ? window.requestAnimationFrame(raf) : window.setInterval(jQuery.fx.tick, jQuery.fx.interval);
			}
		};

		jQuery.fx.stop = function () {
			if (window.cancelAnimationFrame) {
				window.cancelAnimationFrame(timerId);
			} else {
				window.clearInterval(timerId);
			}

			timerId = null;
		};

		jQuery.fx.speeds = {
			slow: 600,
			fast: 200,

			// Default speed
			_default: 400
		};

		// Based off of the plugin by Clint Helfers, with permission.
		// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
		jQuery.fn.delay = function (time, type) {
			time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
			type = type || "fx";

			return this.queue(type, function (next, hooks) {
				var timeout = window.setTimeout(next, time);
				hooks.stop = function () {
					window.clearTimeout(timeout);
				};
			});
		};

		(function () {
			var input = document.createElement("input"),
			    select = document.createElement("select"),
			    opt = select.appendChild(document.createElement("option"));

			input.type = "checkbox";

			// Support: Android <=4.3 only
			// Default value for a checkbox should be "on"
			support.checkOn = input.value !== "";

			// Support: IE <=11 only
			// Must access selectedIndex to make default options select
			support.optSelected = opt.selected;

			// Support: IE <=11 only
			// An input loses its value after becoming a radio
			input = document.createElement("input");
			input.value = "t";
			input.type = "radio";
			support.radioValue = input.value === "t";
		})();

		var boolHook,
		    attrHandle = jQuery.expr.attrHandle;

		jQuery.fn.extend({
			attr: function (name, value) {
				return access(this, jQuery.attr, name, value, arguments.length > 1);
			},

			removeAttr: function (name) {
				return this.each(function () {
					jQuery.removeAttr(this, name);
				});
			}
		});

		jQuery.extend({
			attr: function (elem, name, value) {
				var ret,
				    hooks,
				    nType = elem.nodeType;

				// Don't get/set attributes on text, comment and attribute nodes
				if (nType === 3 || nType === 8 || nType === 2) {
					return;
				}

				// Fallback to prop when attributes are not supported
				if (typeof elem.getAttribute === "undefined") {
					return jQuery.prop(elem, name, value);
				}

				// Attribute hooks are determined by the lowercase version
				// Grab necessary hook if one is defined
				if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
					hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
				}

				if (value !== undefined) {
					if (value === null) {
						jQuery.removeAttr(elem, name);
						return;
					}

					if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
						return ret;
					}

					elem.setAttribute(name, value + "");
					return value;
				}

				if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
					return ret;
				}

				ret = jQuery.find.attr(elem, name);

				// Non-existent attributes return null, we normalize to undefined
				return ret == null ? undefined : ret;
			},

			attrHooks: {
				type: {
					set: function (elem, value) {
						if (!support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
							var val = elem.value;
							elem.setAttribute("type", value);
							if (val) {
								elem.value = val;
							}
							return value;
						}
					}
				}
			},

			removeAttr: function (elem, value) {
				var name,
				    i = 0,


				// Attribute names can contain non-HTML whitespace characters
				// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
				attrNames = value && value.match(rnothtmlwhite);

				if (attrNames && elem.nodeType === 1) {
					while (name = attrNames[i++]) {
						elem.removeAttribute(name);
					}
				}
			}
		});

		// Hooks for boolean attributes
		boolHook = {
			set: function (elem, value, name) {
				if (value === false) {

					// Remove boolean attributes when set to false
					jQuery.removeAttr(elem, name);
				} else {
					elem.setAttribute(name, name);
				}
				return name;
			}
		};

		jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
			var getter = attrHandle[name] || jQuery.find.attr;

			attrHandle[name] = function (elem, name, isXML) {
				var ret,
				    handle,
				    lowercaseName = name.toLowerCase();

				if (!isXML) {

					// Avoid an infinite loop by temporarily removing this function from the getter
					handle = attrHandle[lowercaseName];
					attrHandle[lowercaseName] = ret;
					ret = getter(elem, name, isXML) != null ? lowercaseName : null;
					attrHandle[lowercaseName] = handle;
				}
				return ret;
			};
		});

		var rfocusable = /^(?:input|select|textarea|button)$/i,
		    rclickable = /^(?:a|area)$/i;

		jQuery.fn.extend({
			prop: function (name, value) {
				return access(this, jQuery.prop, name, value, arguments.length > 1);
			},

			removeProp: function (name) {
				return this.each(function () {
					delete this[jQuery.propFix[name] || name];
				});
			}
		});

		jQuery.extend({
			prop: function (elem, name, value) {
				var ret,
				    hooks,
				    nType = elem.nodeType;

				// Don't get/set properties on text, comment and attribute nodes
				if (nType === 3 || nType === 8 || nType === 2) {
					return;
				}

				if (nType !== 1 || !jQuery.isXMLDoc(elem)) {

					// Fix name and attach hooks
					name = jQuery.propFix[name] || name;
					hooks = jQuery.propHooks[name];
				}

				if (value !== undefined) {
					if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
						return ret;
					}

					return elem[name] = value;
				}

				if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
					return ret;
				}

				return elem[name];
			},

			propHooks: {
				tabIndex: {
					get: function (elem) {

						// Support: IE <=9 - 11 only
						// elem.tabIndex doesn't always return the
						// correct value when it hasn't been explicitly set
						// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
						// Use proper attribute retrieval(#12072)
						var tabindex = jQuery.find.attr(elem, "tabindex");

						if (tabindex) {
							return parseInt(tabindex, 10);
						}

						if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
							return 0;
						}

						return -1;
					}
				}
			},

			propFix: {
				"for": "htmlFor",
				"class": "className"
			}
		});

		// Support: IE <=11 only
		// Accessing the selectedIndex property
		// forces the browser to respect setting selected
		// on the option
		// The getter ensures a default option is selected
		// when in an optgroup
		// eslint rule "no-unused-expressions" is disabled for this code
		// since it considers such accessions noop
		if (!support.optSelected) {
			jQuery.propHooks.selected = {
				get: function (elem) {

					/* eslint no-unused-expressions: "off" */

					var parent = elem.parentNode;
					if (parent && parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
					return null;
				},
				set: function (elem) {

					/* eslint no-unused-expressions: "off" */

					var parent = elem.parentNode;
					if (parent) {
						parent.selectedIndex;

						if (parent.parentNode) {
							parent.parentNode.selectedIndex;
						}
					}
				}
			};
		}

		jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
			jQuery.propFix[this.toLowerCase()] = this;
		});

		// Strip and collapse whitespace according to HTML spec
		// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
		function stripAndCollapse(value) {
			var tokens = value.match(rnothtmlwhite) || [];
			return tokens.join(" ");
		}

		function getClass(elem) {
			return elem.getAttribute && elem.getAttribute("class") || "";
		}

		jQuery.fn.extend({
			addClass: function (value) {
				var classes,
				    elem,
				    cur,
				    curValue,
				    clazz,
				    j,
				    finalValue,
				    i = 0;

				if (jQuery.isFunction(value)) {
					return this.each(function (j) {
						jQuery(this).addClass(value.call(this, j, getClass(this)));
					});
				}

				if (typeof value === "string" && value) {
					classes = value.match(rnothtmlwhite) || [];

					while (elem = this[i++]) {
						curValue = getClass(elem);
						cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

						if (cur) {
							j = 0;
							while (clazz = classes[j++]) {
								if (cur.indexOf(" " + clazz + " ") < 0) {
									cur += clazz + " ";
								}
							}

							// Only assign if different to avoid unneeded rendering.
							finalValue = stripAndCollapse(cur);
							if (curValue !== finalValue) {
								elem.setAttribute("class", finalValue);
							}
						}
					}
				}

				return this;
			},

			removeClass: function (value) {
				var classes,
				    elem,
				    cur,
				    curValue,
				    clazz,
				    j,
				    finalValue,
				    i = 0;

				if (jQuery.isFunction(value)) {
					return this.each(function (j) {
						jQuery(this).removeClass(value.call(this, j, getClass(this)));
					});
				}

				if (!arguments.length) {
					return this.attr("class", "");
				}

				if (typeof value === "string" && value) {
					classes = value.match(rnothtmlwhite) || [];

					while (elem = this[i++]) {
						curValue = getClass(elem);

						// This expression is here for better compressibility (see addClass)
						cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

						if (cur) {
							j = 0;
							while (clazz = classes[j++]) {

								// Remove *all* instances
								while (cur.indexOf(" " + clazz + " ") > -1) {
									cur = cur.replace(" " + clazz + " ", " ");
								}
							}

							// Only assign if different to avoid unneeded rendering.
							finalValue = stripAndCollapse(cur);
							if (curValue !== finalValue) {
								elem.setAttribute("class", finalValue);
							}
						}
					}
				}

				return this;
			},

			toggleClass: function (value, stateVal) {
				var type = typeof value;

				if (typeof stateVal === "boolean" && type === "string") {
					return stateVal ? this.addClass(value) : this.removeClass(value);
				}

				if (jQuery.isFunction(value)) {
					return this.each(function (i) {
						jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
					});
				}

				return this.each(function () {
					var className, i, self, classNames;

					if (type === "string") {

						// Toggle individual class names
						i = 0;
						self = jQuery(this);
						classNames = value.match(rnothtmlwhite) || [];

						while (className = classNames[i++]) {

							// Check each className given, space separated list
							if (self.hasClass(className)) {
								self.removeClass(className);
							} else {
								self.addClass(className);
							}
						}

						// Toggle whole class name
					} else if (value === undefined || type === "boolean") {
						className = getClass(this);
						if (className) {

							// Store className if set
							dataPriv.set(this, "__className__", className);
						}

						// If the element has a class name or if we're passed `false`,
						// then remove the whole classname (if there was one, the above saved it).
						// Otherwise bring back whatever was previously saved (if anything),
						// falling back to the empty string if nothing was stored.
						if (this.setAttribute) {
							this.setAttribute("class", className || value === false ? "" : dataPriv.get(this, "__className__") || "");
						}
					}
				});
			},

			hasClass: function (selector) {
				var className,
				    elem,
				    i = 0;

				className = " " + selector + " ";
				while (elem = this[i++]) {
					if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
						return true;
					}
				}

				return false;
			}
		});

		var rreturn = /\r/g;

		jQuery.fn.extend({
			val: function (value) {
				var hooks,
				    ret,
				    isFunction,
				    elem = this[0];

				if (!arguments.length) {
					if (elem) {
						hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

						if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
							return ret;
						}

						ret = elem.value;

						// Handle most common string cases
						if (typeof ret === "string") {
							return ret.replace(rreturn, "");
						}

						// Handle cases where value is null/undef or number
						return ret == null ? "" : ret;
					}

					return;
				}

				isFunction = jQuery.isFunction(value);

				return this.each(function (i) {
					var val;

					if (this.nodeType !== 1) {
						return;
					}

					if (isFunction) {
						val = value.call(this, i, jQuery(this).val());
					} else {
						val = value;
					}

					// Treat null/undefined as ""; convert numbers to string
					if (val == null) {
						val = "";
					} else if (typeof val === "number") {
						val += "";
					} else if (jQuery.isArray(val)) {
						val = jQuery.map(val, function (value) {
							return value == null ? "" : value + "";
						});
					}

					hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

					// If set returns undefined, fall back to normal setting
					if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
						this.value = val;
					}
				});
			}
		});

		jQuery.extend({
			valHooks: {
				option: {
					get: function (elem) {

						var val = jQuery.find.attr(elem, "value");
						return val != null ? val :

						// Support: IE <=10 - 11 only
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						stripAndCollapse(jQuery.text(elem));
					}
				},
				select: {
					get: function (elem) {
						var value,
						    option,
						    i,
						    options = elem.options,
						    index = elem.selectedIndex,
						    one = elem.type === "select-one",
						    values = one ? null : [],
						    max = one ? index + 1 : options.length;

						if (index < 0) {
							i = max;
						} else {
							i = one ? index : 0;
						}

						// Loop through all the selected options
						for (; i < max; i++) {
							option = options[i];

							// Support: IE <=9 only
							// IE8-9 doesn't update selected after form reset (#2551)
							if ((option.selected || i === index) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

								// Get the specific value for the option
								value = jQuery(option).val();

								// We don't need an array for one selects
								if (one) {
									return value;
								}

								// Multi-Selects return an array
								values.push(value);
							}
						}

						return values;
					},

					set: function (elem, value) {
						var optionSet,
						    option,
						    options = elem.options,
						    values = jQuery.makeArray(value),
						    i = options.length;

						while (i--) {
							option = options[i];

							/* eslint-disable no-cond-assign */

							if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
								optionSet = true;
							}

							/* eslint-enable no-cond-assign */
						}

						// Force browsers to behave consistently when non-matching value is set
						if (!optionSet) {
							elem.selectedIndex = -1;
						}
						return values;
					}
				}
			}
		});

		// Radios and checkboxes getter/setter
		jQuery.each(["radio", "checkbox"], function () {
			jQuery.valHooks[this] = {
				set: function (elem, value) {
					if (jQuery.isArray(value)) {
						return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
					}
				}
			};
			if (!support.checkOn) {
				jQuery.valHooks[this].get = function (elem) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				};
			}
		});

		// Return jQuery for attributes-only inclusion


		var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

		jQuery.extend(jQuery.event, {

			trigger: function (event, data, elem, onlyHandlers) {

				var i,
				    cur,
				    tmp,
				    bubbleType,
				    ontype,
				    handle,
				    special,
				    eventPath = [elem || document],
				    type = hasOwn.call(event, "type") ? event.type : event,
				    namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

				cur = tmp = elem = elem || document;

				// Don't do events on text and comment nodes
				if (elem.nodeType === 3 || elem.nodeType === 8) {
					return;
				}

				// focus/blur morphs to focusin/out; ensure we're not firing them right now
				if (rfocusMorph.test(type + jQuery.event.triggered)) {
					return;
				}

				if (type.indexOf(".") > -1) {

					// Namespaced trigger; create a regexp to match event type in handle()
					namespaces = type.split(".");
					type = namespaces.shift();
					namespaces.sort();
				}
				ontype = type.indexOf(":") < 0 && "on" + type;

				// Caller can pass in a jQuery.Event object, Object, or just an event type string
				event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);

				// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
				event.isTrigger = onlyHandlers ? 2 : 3;
				event.namespace = namespaces.join(".");
				event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

				// Clean up the event in case it is being reused
				event.result = undefined;
				if (!event.target) {
					event.target = elem;
				}

				// Clone any incoming data and prepend the event, creating the handler arg list
				data = data == null ? [event] : jQuery.makeArray(data, [event]);

				// Allow special events to draw outside the lines
				special = jQuery.event.special[type] || {};
				if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
					return;
				}

				// Determine event propagation path in advance, per W3C events spec (#9951)
				// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
				if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

					bubbleType = special.delegateType || type;
					if (!rfocusMorph.test(bubbleType + type)) {
						cur = cur.parentNode;
					}
					for (; cur; cur = cur.parentNode) {
						eventPath.push(cur);
						tmp = cur;
					}

					// Only add window if we got to document (e.g., not plain obj or detached DOM)
					if (tmp === (elem.ownerDocument || document)) {
						eventPath.push(tmp.defaultView || tmp.parentWindow || window);
					}
				}

				// Fire handlers on the event path
				i = 0;
				while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

					event.type = i > 1 ? bubbleType : special.bindType || type;

					// jQuery handler
					handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle");
					if (handle) {
						handle.apply(cur, data);
					}

					// Native handler
					handle = ontype && cur[ontype];
					if (handle && handle.apply && acceptData(cur)) {
						event.result = handle.apply(cur, data);
						if (event.result === false) {
							event.preventDefault();
						}
					}
				}
				event.type = type;

				// If nobody prevented the default action, do it now
				if (!onlyHandlers && !event.isDefaultPrevented()) {

					if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {

						// Call a native DOM method on the target with the same name as the event.
						// Don't do default actions on window, that's where global variables be (#6170)
						if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {

							// Don't re-trigger an onFOO event when we call its FOO() method
							tmp = elem[ontype];

							if (tmp) {
								elem[ontype] = null;
							}

							// Prevent re-triggering of the same event, since we already bubbled it above
							jQuery.event.triggered = type;
							elem[type]();
							jQuery.event.triggered = undefined;

							if (tmp) {
								elem[ontype] = tmp;
							}
						}
					}
				}

				return event.result;
			},

			// Piggyback on a donor event to simulate a different one
			// Used only for `focus(in | out)` events
			simulate: function (type, elem, event) {
				var e = jQuery.extend(new jQuery.Event(), event, {
					type: type,
					isSimulated: true
				});

				jQuery.event.trigger(e, null, elem);
			}

		});

		jQuery.fn.extend({

			trigger: function (type, data) {
				return this.each(function () {
					jQuery.event.trigger(type, data, this);
				});
			},
			triggerHandler: function (type, data) {
				var elem = this[0];
				if (elem) {
					return jQuery.event.trigger(type, data, elem, true);
				}
			}
		});

		jQuery.each(("blur focus focusin focusout resize scroll click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup contextmenu").split(" "), function (i, name) {

			// Handle event binding
			jQuery.fn[name] = function (data, fn) {
				return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
			};
		});

		jQuery.fn.extend({
			hover: function (fnOver, fnOut) {
				return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
			}
		});

		support.focusin = "onfocusin" in window;

		// Support: Firefox <=44
		// Firefox doesn't have focus(in | out) events
		// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
		//
		// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
		// focus(in | out) events fire after focus & blur events,
		// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
		// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
		if (!support.focusin) {
			jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

				// Attach a single capturing handler on the document while someone wants focusin/focusout
				var handler = function (event) {
					jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
				};

				jQuery.event.special[fix] = {
					setup: function () {
						var doc = this.ownerDocument || this,
						    attaches = dataPriv.access(doc, fix);

						if (!attaches) {
							doc.addEventListener(orig, handler, true);
						}
						dataPriv.access(doc, fix, (attaches || 0) + 1);
					},
					teardown: function () {
						var doc = this.ownerDocument || this,
						    attaches = dataPriv.access(doc, fix) - 1;

						if (!attaches) {
							doc.removeEventListener(orig, handler, true);
							dataPriv.remove(doc, fix);
						} else {
							dataPriv.access(doc, fix, attaches);
						}
					}
				};
			});
		}
		var location = window.location;

		var nonce = jQuery.now();

		var rquery = /\?/;

		// Cross-browser xml parsing
		jQuery.parseXML = function (data) {
			var xml;
			if (!data || typeof data !== "string") {
				return null;
			}

			// Support: IE 9 - 11 only
			// IE throws on parseFromString with invalid input.
			try {
				xml = new window.DOMParser().parseFromString(data, "text/xml");
			} catch (e) {
				xml = undefined;
			}

			if (!xml || xml.getElementsByTagName("parsererror").length) {
				jQuery.error("Invalid XML: " + data);
			}
			return xml;
		};

		var rbracket = /\[\]$/,
		    rCRLF = /\r?\n/g,
		    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		    rsubmittable = /^(?:input|select|textarea|keygen)/i;

		function buildParams(prefix, obj, traditional, add) {
			var name;

			if (jQuery.isArray(obj)) {

				// Serialize array item.
				jQuery.each(obj, function (i, v) {
					if (traditional || rbracket.test(prefix)) {

						// Treat each array item as a scalar.
						add(prefix, v);
					} else {

						// Item is non-scalar (array or object), encode its numeric index.
						buildParams(prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]", v, traditional, add);
					}
				});
			} else if (!traditional && jQuery.type(obj) === "object") {

				// Serialize object item.
				for (name in obj) {
					buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
				}
			} else {

				// Serialize scalar item.
				add(prefix, obj);
			}
		}

		// Serialize an array of form elements or a set of
		// key/values into a query string
		jQuery.param = function (a, traditional) {
			var prefix,
			    s = [],
			    add = function (key, valueOrFunction) {

				// If value is a function, invoke it and use its return value
				var value = jQuery.isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;

				s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
			};

			// If an array was passed in, assume that it is an array of form elements.
			if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {

				// Serialize the form elements
				jQuery.each(a, function () {
					add(this.name, this.value);
				});
			} else {

				// If traditional, encode the "old" way (the way 1.3.2 or older
				// did it), otherwise encode params recursively.
				for (prefix in a) {
					buildParams(prefix, a[prefix], traditional, add);
				}
			}

			// Return the resulting serialization
			return s.join("&");
		};

		jQuery.fn.extend({
			serialize: function () {
				return jQuery.param(this.serializeArray());
			},
			serializeArray: function () {
				return this.map(function () {

					// Can add propHook for "elements" to filter or add form elements
					var elements = jQuery.prop(this, "elements");
					return elements ? jQuery.makeArray(elements) : this;
				}).filter(function () {
					var type = this.type;

					// Use .is( ":disabled" ) so that fieldset[disabled] works
					return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
				}).map(function (i, elem) {
					var val = jQuery(this).val();

					if (val == null) {
						return null;
					}

					if (jQuery.isArray(val)) {
						return jQuery.map(val, function (val) {
							return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
						});
					}

					return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
				}).get();
			}
		});

		var r20 = /%20/g,
		    rhash = /#.*$/,
		    rantiCache = /([?&])_=[^&]*/,
		    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,


		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		    rnoContent = /^(?:GET|HEAD)$/,
		    rprotocol = /^\/\//,


		/* Prefilters
	  * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	  * 2) These are called:
	  *    - BEFORE asking for a transport
	  *    - AFTER param serialization (s.data is a string if s.processData is true)
	  * 3) key is the dataType
	  * 4) the catchall symbol "*" can be used
	  * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	  */
		prefilters = {},


		/* Transports bindings
	  * 1) key is the dataType
	  * 2) the catchall symbol "*" can be used
	  * 3) selection will start with transport dataType and THEN go to "*" if needed
	  */
		transports = {},


		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat("*"),


		// Anchor tag for parsing the document origin
		originAnchor = document.createElement("a");
		originAnchor.href = location.href;

		// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
		function addToPrefiltersOrTransports(structure) {

			// dataTypeExpression is optional and defaults to "*"
			return function (dataTypeExpression, func) {

				if (typeof dataTypeExpression !== "string") {
					func = dataTypeExpression;
					dataTypeExpression = "*";
				}

				var dataType,
				    i = 0,
				    dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];

				if (jQuery.isFunction(func)) {

					// For each dataType in the dataTypeExpression
					while (dataType = dataTypes[i++]) {

						// Prepend if requested
						if (dataType[0] === "+") {
							dataType = dataType.slice(1) || "*";
							(structure[dataType] = structure[dataType] || []).unshift(func);

							// Otherwise append
						} else {
							(structure[dataType] = structure[dataType] || []).push(func);
						}
					}
				}
			};
		}

		// Base inspection function for prefilters and transports
		function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

			var inspected = {},
			    seekingTransport = structure === transports;

			function inspect(dataType) {
				var selected;
				inspected[dataType] = true;
				jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
					var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
					if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {

						options.dataTypes.unshift(dataTypeOrTransport);
						inspect(dataTypeOrTransport);
						return false;
					} else if (seekingTransport) {
						return !(selected = dataTypeOrTransport);
					}
				});
				return selected;
			}

			return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
		}

		// A special extend for ajax options
		// that takes "flat" options (not to be deep extended)
		// Fixes #9887
		function ajaxExtend(target, src) {
			var key,
			    deep,
			    flatOptions = jQuery.ajaxSettings.flatOptions || {};

			for (key in src) {
				if (src[key] !== undefined) {
					(flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
				}
			}
			if (deep) {
				jQuery.extend(true, target, deep);
			}

			return target;
		}

		/* Handles responses to an ajax request:
	  * - finds the right dataType (mediates between content-type and expected dataType)
	  * - returns the corresponding response
	  */
		function ajaxHandleResponses(s, jqXHR, responses) {

			var ct,
			    type,
			    finalDataType,
			    firstDataType,
			    contents = s.contents,
			    dataTypes = s.dataTypes;

			// Remove auto dataType and get content-type in the process
			while (dataTypes[0] === "*") {
				dataTypes.shift();
				if (ct === undefined) {
					ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
				}
			}

			// Check if we're dealing with a known content-type
			if (ct) {
				for (type in contents) {
					if (contents[type] && contents[type].test(ct)) {
						dataTypes.unshift(type);
						break;
					}
				}
			}

			// Check to see if we have a response for the expected dataType
			if (dataTypes[0] in responses) {
				finalDataType = dataTypes[0];
			} else {

				// Try convertible dataTypes
				for (type in responses) {
					if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
						finalDataType = type;
						break;
					}
					if (!firstDataType) {
						firstDataType = type;
					}
				}

				// Or just use first one
				finalDataType = finalDataType || firstDataType;
			}

			// If we found a dataType
			// We add the dataType to the list if needed
			// and return the corresponding response
			if (finalDataType) {
				if (finalDataType !== dataTypes[0]) {
					dataTypes.unshift(finalDataType);
				}
				return responses[finalDataType];
			}
		}

		/* Chain conversions given the request and the original response
	  * Also sets the responseXXX fields on the jqXHR instance
	  */
		function ajaxConvert(s, response, jqXHR, isSuccess) {
			var conv2,
			    current,
			    conv,
			    tmp,
			    prev,
			    converters = {},


			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

			// Create converters map with lowercased keys
			if (dataTypes[1]) {
				for (conv in s.converters) {
					converters[conv.toLowerCase()] = s.converters[conv];
				}
			}

			current = dataTypes.shift();

			// Convert to each sequential dataType
			while (current) {

				if (s.responseFields[current]) {
					jqXHR[s.responseFields[current]] = response;
				}

				// Apply the dataFilter if provided
				if (!prev && isSuccess && s.dataFilter) {
					response = s.dataFilter(response, s.dataType);
				}

				prev = current;
				current = dataTypes.shift();

				if (current) {

					// There's only work to do if current dataType is non-auto
					if (current === "*") {

						current = prev;

						// Convert response if prev dataType is non-auto and differs from current
					} else if (prev !== "*" && prev !== current) {

						// Seek a direct converter
						conv = converters[prev + " " + current] || converters["* " + current];

						// If none found, seek a pair
						if (!conv) {
							for (conv2 in converters) {

								// If conv2 outputs current
								tmp = conv2.split(" ");
								if (tmp[1] === current) {

									// If prev can be converted to accepted input
									conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
									if (conv) {

										// Condense equivalence converters
										if (conv === true) {
											conv = converters[conv2];

											// Otherwise, insert the intermediate dataType
										} else if (converters[conv2] !== true) {
											current = tmp[0];
											dataTypes.unshift(tmp[1]);
										}
										break;
									}
								}
							}
						}

						// Apply converter (if not an equivalence)
						if (conv !== true) {

							// Unless errors are allowed to bubble, catch and return them
							if (conv && s.throws) {
								response = conv(response);
							} else {
								try {
									response = conv(response);
								} catch (e) {
									return {
										state: "parsererror",
										error: conv ? e : "No conversion from " + prev + " to " + current
									};
								}
							}
						}
					}
				}
			}

			return { state: "success", data: response };
		}

		jQuery.extend({

			// Counter for holding the number of active queries
			active: 0,

			// Last-Modified header cache for next request
			lastModified: {},
			etag: {},

			ajaxSettings: {
				url: location.href,
				type: "GET",
				isLocal: rlocalProtocol.test(location.protocol),
				global: true,
				processData: true,
				async: true,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",

				/*
	   timeout: 0,
	   data: null,
	   dataType: null,
	   username: null,
	   password: null,
	   cache: null,
	   throws: false,
	   traditional: false,
	   headers: {},
	   */

				accepts: {
					"*": allTypes,
					text: "text/plain",
					html: "text/html",
					xml: "application/xml, text/xml",
					json: "application/json, text/javascript"
				},

				contents: {
					xml: /\bxml\b/,
					html: /\bhtml/,
					json: /\bjson\b/
				},

				responseFields: {
					xml: "responseXML",
					text: "responseText",
					json: "responseJSON"
				},

				// Data converters
				// Keys separate source (or catchall "*") and destination types with a single space
				converters: {

					// Convert anything to text
					"* text": String,

					// Text to html (true = no transformation)
					"text html": true,

					// Evaluate text as a json expression
					"text json": JSON.parse,

					// Parse text as xml
					"text xml": jQuery.parseXML
				},

				// For options that shouldn't be deep extended:
				// you can add your own custom options here if
				// and when you create one that shouldn't be
				// deep extended (see ajaxExtend)
				flatOptions: {
					url: true,
					context: true
				}
			},

			// Creates a full fledged settings object into target
			// with both ajaxSettings and settings fields.
			// If target is omitted, writes into ajaxSettings.
			ajaxSetup: function (target, settings) {
				return settings ?

				// Building a settings object
				ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

				// Extending ajaxSettings
				ajaxExtend(jQuery.ajaxSettings, target);
			},

			ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
			ajaxTransport: addToPrefiltersOrTransports(transports),

			// Main method
			ajax: function (url, options) {

				// If url is an object, simulate pre-1.5 signature
				if (typeof url === "object") {
					options = url;
					url = undefined;
				}

				// Force options to be an object
				options = options || {};

				var transport,


				// URL without anti-cache param
				cacheURL,


				// Response headers
				responseHeadersString,
				    responseHeaders,


				// timeout handle
				timeoutTimer,


				// Url cleanup var
				urlAnchor,


				// Request state (becomes false upon send and true upon completion)
				completed,


				// To know if global events are to be dispatched
				fireGlobals,


				// Loop variable
				i,


				// uncached part of the url
				uncached,


				// Create the final options object
				s = jQuery.ajaxSetup({}, options),


				// Callbacks context
				callbackContext = s.context || s,


				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,


				// Deferreds
				deferred = jQuery.Deferred(),
				    completeDeferred = jQuery.Callbacks("once memory"),


				// Status-dependent callbacks
				statusCode = s.statusCode || {},


				// Headers (they are sent all at once)
				requestHeaders = {},
				    requestHeadersNames = {},


				// Default abort message
				strAbort = "canceled",


				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function (key) {
						var match;
						if (completed) {
							if (!responseHeaders) {
								responseHeaders = {};
								while (match = rheaders.exec(responseHeadersString)) {
									responseHeaders[match[1].toLowerCase()] = match[2];
								}
							}
							match = responseHeaders[key.toLowerCase()];
						}
						return match == null ? null : match;
					},

					// Raw string
					getAllResponseHeaders: function () {
						return completed ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function (name, value) {
						if (completed == null) {
							name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
							requestHeaders[name] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function (type) {
						if (completed == null) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function (map) {
						var code;
						if (map) {
							if (completed) {

								// Execute the appropriate callbacks
								jqXHR.always(map[jqXHR.status]);
							} else {

								// Lazy-add the new callbacks in a way that preserves old ones
								for (code in map) {
									statusCode[code] = [statusCode[code], map[code]];
								}
							}
						}
						return this;
					},

					// Cancel the request
					abort: function (statusText) {
						var finalText = statusText || strAbort;
						if (transport) {
							transport.abort(finalText);
						}
						done(0, finalText);
						return this;
					}
				};

				// Attach deferreds
				deferred.promise(jqXHR);

				// Add protocol if not provided (prefilters might expect it)
				// Handle falsy url in the settings object (#10093: consistency with old signature)
				// We also use the url parameter if available
				s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");

				// Alias method option to type as per ticket #12004
				s.type = options.method || options.type || s.method || s.type;

				// Extract dataTypes list
				s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];

				// A cross-domain request is in order when the origin doesn't match the current origin.
				if (s.crossDomain == null) {
					urlAnchor = document.createElement("a");

					// Support: IE <=8 - 11, Edge 12 - 13
					// IE throws exception on accessing the href property if url is malformed,
					// e.g. http://example.com:80x/
					try {
						urlAnchor.href = s.url;

						// Support: IE <=8 - 11 only
						// Anchor's host property isn't correctly set when s.url is relative
						urlAnchor.href = urlAnchor.href;
						s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
					} catch (e) {

						// If there is an error parsing the URL, assume it is crossDomain,
						// it can be rejected by the transport if it is invalid
						s.crossDomain = true;
					}
				}

				// Convert data if not already a string
				if (s.data && s.processData && typeof s.data !== "string") {
					s.data = jQuery.param(s.data, s.traditional);
				}

				// Apply prefilters
				inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

				// If request was aborted inside a prefilter, stop there
				if (completed) {
					return jqXHR;
				}

				// We can fire global events as of now if asked to
				// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
				fireGlobals = jQuery.event && s.global;

				// Watch for a new set of requests
				if (fireGlobals && jQuery.active++ === 0) {
					jQuery.event.trigger("ajaxStart");
				}

				// Uppercase the type
				s.type = s.type.toUpperCase();

				// Determine if request has content
				s.hasContent = !rnoContent.test(s.type);

				// Save the URL in case we're toying with the If-Modified-Since
				// and/or If-None-Match header later on
				// Remove hash to simplify url manipulation
				cacheURL = s.url.replace(rhash, "");

				// More options handling for requests with no content
				if (!s.hasContent) {

					// Remember the hash so we can put it back
					uncached = s.url.slice(cacheURL.length);

					// If data is available, append data to url
					if (s.data) {
						cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;

						// #9682: remove data so that it's not used in an eventual retry
						delete s.data;
					}

					// Add or update anti-cache param if needed
					if (s.cache === false) {
						cacheURL = cacheURL.replace(rantiCache, "$1");
						uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++ + uncached;
					}

					// Put hash and anti-cache on the URL that will be requested (gh-1732)
					s.url = cacheURL + uncached;

					// Change '%20' to '+' if this is encoded form body content (gh-2658)
				} else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
					s.data = s.data.replace(r20, "+");
				}

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if (s.ifModified) {
					if (jQuery.lastModified[cacheURL]) {
						jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
					}
					if (jQuery.etag[cacheURL]) {
						jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
					}
				}

				// Set the correct header, if data is being sent
				if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
					jqXHR.setRequestHeader("Content-Type", s.contentType);
				}

				// Set the Accepts header for the server, depending on the dataType
				jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);

				// Check for headers option
				for (i in s.headers) {
					jqXHR.setRequestHeader(i, s.headers[i]);
				}

				// Allow custom headers/mimetypes and early abort
				if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) {

					// Abort if not done already and return
					return jqXHR.abort();
				}

				// Aborting is no longer a cancellation
				strAbort = "abort";

				// Install callbacks on deferreds
				completeDeferred.add(s.complete);
				jqXHR.done(s.success);
				jqXHR.fail(s.error);

				// Get transport
				transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

				// If no transport, we auto-abort
				if (!transport) {
					done(-1, "No Transport");
				} else {
					jqXHR.readyState = 1;

					// Send global event
					if (fireGlobals) {
						globalEventContext.trigger("ajaxSend", [jqXHR, s]);
					}

					// If request was aborted inside ajaxSend, stop there
					if (completed) {
						return jqXHR;
					}

					// Timeout
					if (s.async && s.timeout > 0) {
						timeoutTimer = window.setTimeout(function () {
							jqXHR.abort("timeout");
						}, s.timeout);
					}

					try {
						completed = false;
						transport.send(requestHeaders, done);
					} catch (e) {

						// Rethrow post-completion exceptions
						if (completed) {
							throw e;
						}

						// Propagate others as results
						done(-1, e);
					}
				}

				// Callback for when everything is done
				function done(status, nativeStatusText, responses, headers) {
					var isSuccess,
					    success,
					    error,
					    response,
					    modified,
					    statusText = nativeStatusText;

					// Ignore repeat invocations
					if (completed) {
						return;
					}

					completed = true;

					// Clear timeout if it exists
					if (timeoutTimer) {
						window.clearTimeout(timeoutTimer);
					}

					// Dereference transport for early garbage collection
					// (no matter how long the jqXHR object will be used)
					transport = undefined;

					// Cache response headers
					responseHeadersString = headers || "";

					// Set readyState
					jqXHR.readyState = status > 0 ? 4 : 0;

					// Determine if successful
					isSuccess = status >= 200 && status < 300 || status === 304;

					// Get response data
					if (responses) {
						response = ajaxHandleResponses(s, jqXHR, responses);
					}

					// Convert no matter what (that way responseXXX fields are always set)
					response = ajaxConvert(s, response, jqXHR, isSuccess);

					// If successful, handle type chaining
					if (isSuccess) {

						// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
						if (s.ifModified) {
							modified = jqXHR.getResponseHeader("Last-Modified");
							if (modified) {
								jQuery.lastModified[cacheURL] = modified;
							}
							modified = jqXHR.getResponseHeader("etag");
							if (modified) {
								jQuery.etag[cacheURL] = modified;
							}
						}

						// if no content
						if (status === 204 || s.type === "HEAD") {
							statusText = "nocontent";

							// if not modified
						} else if (status === 304) {
							statusText = "notmodified";

							// If we have data, let's convert it
						} else {
							statusText = response.state;
							success = response.data;
							error = response.error;
							isSuccess = !error;
						}
					} else {

						// Extract error from statusText and normalize for non-aborts
						error = statusText;
						if (status || !statusText) {
							statusText = "error";
							if (status < 0) {
								status = 0;
							}
						}
					}

					// Set data for the fake xhr object
					jqXHR.status = status;
					jqXHR.statusText = (nativeStatusText || statusText) + "";

					// Success/Error
					if (isSuccess) {
						deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
					} else {
						deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
					}

					// Status-dependent callbacks
					jqXHR.statusCode(statusCode);
					statusCode = undefined;

					if (fireGlobals) {
						globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
					}

					// Complete
					completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

					if (fireGlobals) {
						globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

						// Handle the global AJAX counter
						if (! --jQuery.active) {
							jQuery.event.trigger("ajaxStop");
						}
					}
				}

				return jqXHR;
			},

			getJSON: function (url, data, callback) {
				return jQuery.get(url, data, callback, "json");
			},

			getScript: function (url, callback) {
				return jQuery.get(url, undefined, callback, "script");
			}
		});

		jQuery.each(["get", "post"], function (i, method) {
			jQuery[method] = function (url, data, callback, type) {

				// Shift arguments if data argument was omitted
				if (jQuery.isFunction(data)) {
					type = type || callback;
					callback = data;
					data = undefined;
				}

				// The url can be an options object (which then must have .url)
				return jQuery.ajax(jQuery.extend({
					url: url,
					type: method,
					dataType: type,
					data: data,
					success: callback
				}, jQuery.isPlainObject(url) && url));
			};
		});

		jQuery._evalUrl = function (url) {
			return jQuery.ajax({
				url: url,

				// Make this explicit, since user can override this through ajaxSetup (#11264)
				type: "GET",
				dataType: "script",
				cache: true,
				async: false,
				global: false,
				"throws": true
			});
		};

		jQuery.fn.extend({
			wrapAll: function (html) {
				var wrap;

				if (this[0]) {
					if (jQuery.isFunction(html)) {
						html = html.call(this[0]);
					}

					// The elements to wrap the target around
					wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

					if (this[0].parentNode) {
						wrap.insertBefore(this[0]);
					}

					wrap.map(function () {
						var elem = this;

						while (elem.firstElementChild) {
							elem = elem.firstElementChild;
						}

						return elem;
					}).append(this);
				}

				return this;
			},

			wrapInner: function (html) {
				if (jQuery.isFunction(html)) {
					return this.each(function (i) {
						jQuery(this).wrapInner(html.call(this, i));
					});
				}

				return this.each(function () {
					var self = jQuery(this),
					    contents = self.contents();

					if (contents.length) {
						contents.wrapAll(html);
					} else {
						self.append(html);
					}
				});
			},

			wrap: function (html) {
				var isFunction = jQuery.isFunction(html);

				return this.each(function (i) {
					jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
				});
			},

			unwrap: function (selector) {
				this.parent(selector).not("body").each(function () {
					jQuery(this).replaceWith(this.childNodes);
				});
				return this;
			}
		});

		jQuery.expr.pseudos.hidden = function (elem) {
			return !jQuery.expr.pseudos.visible(elem);
		};
		jQuery.expr.pseudos.visible = function (elem) {
			return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
		};

		jQuery.ajaxSettings.xhr = function () {
			try {
				return new window.XMLHttpRequest();
			} catch (e) {}
		};

		var xhrSuccessStatus = {

			// File protocol always yields status code 0, assume 200
			0: 200,

			// Support: IE <=9 only
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		    xhrSupported = jQuery.ajaxSettings.xhr();

		support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
		support.ajax = xhrSupported = !!xhrSupported;

		jQuery.ajaxTransport(function (options) {
			var callback, errorCallback;

			// Cross domain only allowed if supported through XMLHttpRequest
			if (support.cors || xhrSupported && !options.crossDomain) {
				return {
					send: function (headers, complete) {
						var i,
						    xhr = options.xhr();

						xhr.open(options.type, options.url, options.async, options.username, options.password);

						// Apply custom fields if provided
						if (options.xhrFields) {
							for (i in options.xhrFields) {
								xhr[i] = options.xhrFields[i];
							}
						}

						// Override mime type if needed
						if (options.mimeType && xhr.overrideMimeType) {
							xhr.overrideMimeType(options.mimeType);
						}

						// X-Requested-With header
						// For cross-domain requests, seeing as conditions for a preflight are
						// akin to a jigsaw puzzle, we simply never set it to be sure.
						// (it can always be set on a per-request basis or even using ajaxSetup)
						// For same-domain requests, won't change header if already provided.
						if (!options.crossDomain && !headers["X-Requested-With"]) {
							headers["X-Requested-With"] = "XMLHttpRequest";
						}

						// Set headers
						for (i in headers) {
							xhr.setRequestHeader(i, headers[i]);
						}

						// Callback
						callback = function (type) {
							return function () {
								if (callback) {
									callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

									if (type === "abort") {
										xhr.abort();
									} else if (type === "error") {

										// Support: IE <=9 only
										// On a manual native abort, IE9 throws
										// errors on any property access that is not readyState
										if (typeof xhr.status !== "number") {
											complete(0, "error");
										} else {
											complete(

											// File: protocol always yields status 0; see #8605, #14207
											xhr.status, xhr.statusText);
										}
									} else {
										complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText,

										// Support: IE <=9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										(xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText }, xhr.getAllResponseHeaders());
									}
								}
							};
						};

						// Listen to events
						xhr.onload = callback();
						errorCallback = xhr.onerror = callback("error");

						// Support: IE 9 only
						// Use onreadystatechange to replace onabort
						// to handle uncaught aborts
						if (xhr.onabort !== undefined) {
							xhr.onabort = errorCallback;
						} else {
							xhr.onreadystatechange = function () {

								// Check readyState before timeout as it changes
								if (xhr.readyState === 4) {

									// Allow onerror to be called first,
									// but that will not handle a native abort
									// Also, save errorCallback to a variable
									// as xhr.onerror cannot be accessed
									window.setTimeout(function () {
										if (callback) {
											errorCallback();
										}
									});
								}
							};
						}

						// Create the abort callback
						callback = callback("abort");

						try {

							// Do send the request (this may raise an exception)
							xhr.send(options.hasContent && options.data || null);
						} catch (e) {

							// #14683: Only rethrow if this hasn't been notified as an error yet
							if (callback) {
								throw e;
							}
						}
					},

					abort: function () {
						if (callback) {
							callback();
						}
					}
				};
			}
		});

		// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
		jQuery.ajaxPrefilter(function (s) {
			if (s.crossDomain) {
				s.contents.script = false;
			}
		});

		// Install script dataType
		jQuery.ajaxSetup({
			accepts: {
				script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"
			},
			contents: {
				script: /\b(?:java|ecma)script\b/
			},
			converters: {
				"text script": function (text) {
					jQuery.globalEval(text);
					return text;
				}
			}
		});

		// Handle cache's special case and crossDomain
		jQuery.ajaxPrefilter("script", function (s) {
			if (s.cache === undefined) {
				s.cache = false;
			}
			if (s.crossDomain) {
				s.type = "GET";
			}
		});

		// Bind script tag hack transport
		jQuery.ajaxTransport("script", function (s) {

			// This transport only deals with cross domain requests
			if (s.crossDomain) {
				var script, callback;
				return {
					send: function (_, complete) {
						script = jQuery("<script>").prop({
							charset: s.scriptCharset,
							src: s.url
						}).on("load error", callback = function (evt) {
							script.remove();
							callback = null;
							if (evt) {
								complete(evt.type === "error" ? 404 : 200, evt.type);
							}
						});

						// Use native DOM manipulation to avoid our domManip AJAX trickery
						document.head.appendChild(script[0]);
					},
					abort: function () {
						if (callback) {
							callback();
						}
					}
				};
			}
		});

		var oldCallbacks = [],
		    rjsonp = /(=)\?(?=&|$)|\?\?/;

		// Default jsonp settings
		jQuery.ajaxSetup({
			jsonp: "callback",
			jsonpCallback: function () {
				var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
				this[callback] = true;
				return callback;
			}
		});

		// Detect, normalize options and install callbacks for jsonp requests
		jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

			var callbackName,
			    overwritten,
			    responseContainer,
			    jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");

			// Handle iff the expected data type is "jsonp" or we have a parameter to set
			if (jsonProp || s.dataTypes[0] === "jsonp") {

				// Get callback name, remembering preexisting value associated with it
				callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;

				// Insert callback into url or form data
				if (jsonProp) {
					s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
				} else if (s.jsonp !== false) {
					s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
				}

				// Use data converter to retrieve json after script execution
				s.converters["script json"] = function () {
					if (!responseContainer) {
						jQuery.error(callbackName + " was not called");
					}
					return responseContainer[0];
				};

				// Force json dataType
				s.dataTypes[0] = "json";

				// Install callback
				overwritten = window[callbackName];
				window[callbackName] = function () {
					responseContainer = arguments;
				};

				// Clean-up function (fires after converters)
				jqXHR.always(function () {

					// If previous value didn't exist - remove it
					if (overwritten === undefined) {
						jQuery(window).removeProp(callbackName);

						// Otherwise restore preexisting value
					} else {
						window[callbackName] = overwritten;
					}

					// Save back as free
					if (s[callbackName]) {

						// Make sure that re-using the options doesn't screw things around
						s.jsonpCallback = originalSettings.jsonpCallback;

						// Save the callback name for future use
						oldCallbacks.push(callbackName);
					}

					// Call if it was a function and we have a response
					if (responseContainer && jQuery.isFunction(overwritten)) {
						overwritten(responseContainer[0]);
					}

					responseContainer = overwritten = undefined;
				});

				// Delegate to script
				return "script";
			}
		});

		// Support: Safari 8 only
		// In Safari 8 documents created via document.implementation.createHTMLDocument
		// collapse sibling forms: the second one becomes a child of the first one.
		// Because of that, this security measure has to be disabled in Safari 8.
		// https://bugs.webkit.org/show_bug.cgi?id=137337
		support.createHTMLDocument = function () {
			var body = document.implementation.createHTMLDocument("").body;
			body.innerHTML = "<form></form><form></form>";
			return body.childNodes.length === 2;
		}();

		// Argument "data" should be string of html
		// context (optional): If specified, the fragment will be created in this context,
		// defaults to document
		// keepScripts (optional): If true, will include scripts passed in the html string
		jQuery.parseHTML = function (data, context, keepScripts) {
			if (typeof data !== "string") {
				return [];
			}
			if (typeof context === "boolean") {
				keepScripts = context;
				context = false;
			}

			var base, parsed, scripts;

			if (!context) {

				// Stop scripts or inline event handlers from being executed immediately
				// by using document.implementation
				if (support.createHTMLDocument) {
					context = document.implementation.createHTMLDocument("");

					// Set the base href for the created document
					// so any parsed elements with URLs
					// are based on the document's URL (gh-2965)
					base = context.createElement("base");
					base.href = document.location.href;
					context.head.appendChild(base);
				} else {
					context = document;
				}
			}

			parsed = rsingleTag.exec(data);
			scripts = !keepScripts && [];

			// Single tag
			if (parsed) {
				return [context.createElement(parsed[1])];
			}

			parsed = buildFragment([data], context, scripts);

			if (scripts && scripts.length) {
				jQuery(scripts).remove();
			}

			return jQuery.merge([], parsed.childNodes);
		};

		/**
	  * Load a url into a page
	  */
		jQuery.fn.load = function (url, params, callback) {
			var selector,
			    type,
			    response,
			    self = this,
			    off = url.indexOf(" ");

			if (off > -1) {
				selector = stripAndCollapse(url.slice(off));
				url = url.slice(0, off);
			}

			// If it's a function
			if (jQuery.isFunction(params)) {

				// We assume that it's the callback
				callback = params;
				params = undefined;

				// Otherwise, build a param string
			} else if (params && typeof params === "object") {
				type = "POST";
			}

			// If we have elements to modify, make the request
			if (self.length > 0) {
				jQuery.ajax({
					url: url,

					// If "type" variable is undefined, then "GET" method will be used.
					// Make value of this field explicit since
					// user can override it through ajaxSetup method
					type: type || "GET",
					dataType: "html",
					data: params
				}).done(function (responseText) {

					// Save response for use in complete callback
					response = arguments;

					self.html(selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

					// Otherwise use the full result
					responseText);

					// If the request succeeds, this function gets "data", "status", "jqXHR"
					// but they are ignored because response was set above.
					// If it fails, this function gets "jqXHR", "status", "error"
				}).always(callback && function (jqXHR, status) {
					self.each(function () {
						callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
					});
				});
			}

			return this;
		};

		// Attach a bunch of functions for handling common AJAX events
		jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
			jQuery.fn[type] = function (fn) {
				return this.on(type, fn);
			};
		});

		jQuery.expr.pseudos.animated = function (elem) {
			return jQuery.grep(jQuery.timers, function (fn) {
				return elem === fn.elem;
			}).length;
		};

		/**
	  * Gets a window from an element
	  */
		function getWindow(elem) {
			return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
		}

		jQuery.offset = {
			setOffset: function (elem, options, i) {
				var curPosition,
				    curLeft,
				    curCSSTop,
				    curTop,
				    curOffset,
				    curCSSLeft,
				    calculatePosition,
				    position = jQuery.css(elem, "position"),
				    curElem = jQuery(elem),
				    props = {};

				// Set position first, in-case top/left are set even on static elem
				if (position === "static") {
					elem.style.position = "relative";
				}

				curOffset = curElem.offset();
				curCSSTop = jQuery.css(elem, "top");
				curCSSLeft = jQuery.css(elem, "left");
				calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;

				// Need to be able to calculate position if either
				// top or left is auto and position is either absolute or fixed
				if (calculatePosition) {
					curPosition = curElem.position();
					curTop = curPosition.top;
					curLeft = curPosition.left;
				} else {
					curTop = parseFloat(curCSSTop) || 0;
					curLeft = parseFloat(curCSSLeft) || 0;
				}

				if (jQuery.isFunction(options)) {

					// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
					options = options.call(elem, i, jQuery.extend({}, curOffset));
				}

				if (options.top != null) {
					props.top = options.top - curOffset.top + curTop;
				}
				if (options.left != null) {
					props.left = options.left - curOffset.left + curLeft;
				}

				if ("using" in options) {
					options.using.call(elem, props);
				} else {
					curElem.css(props);
				}
			}
		};

		jQuery.fn.extend({
			offset: function (options) {

				// Preserve chaining for setter
				if (arguments.length) {
					return options === undefined ? this : this.each(function (i) {
						jQuery.offset.setOffset(this, options, i);
					});
				}

				var docElem,
				    win,
				    rect,
				    doc,
				    elem = this[0];

				if (!elem) {
					return;
				}

				// Support: IE <=11 only
				// Running getBoundingClientRect on a
				// disconnected node in IE throws an error
				if (!elem.getClientRects().length) {
					return { top: 0, left: 0 };
				}

				rect = elem.getBoundingClientRect();

				// Make sure element is not hidden (display: none)
				if (rect.width || rect.height) {
					doc = elem.ownerDocument;
					win = getWindow(doc);
					docElem = doc.documentElement;

					return {
						top: rect.top + win.pageYOffset - docElem.clientTop,
						left: rect.left + win.pageXOffset - docElem.clientLeft
					};
				}

				// Return zeros for disconnected and hidden elements (gh-2310)
				return rect;
			},

			position: function () {
				if (!this[0]) {
					return;
				}

				var offsetParent,
				    offset,
				    elem = this[0],
				    parentOffset = { top: 0, left: 0 };

				// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
				// because it is its only offset parent
				if (jQuery.css(elem, "position") === "fixed") {

					// Assume getBoundingClientRect is there when computed position is fixed
					offset = elem.getBoundingClientRect();
				} else {

					// Get *real* offsetParent
					offsetParent = this.offsetParent();

					// Get correct offsets
					offset = this.offset();
					if (!jQuery.nodeName(offsetParent[0], "html")) {
						parentOffset = offsetParent.offset();
					}

					// Add offsetParent borders
					parentOffset = {
						top: parentOffset.top + jQuery.css(offsetParent[0], "borderTopWidth", true),
						left: parentOffset.left + jQuery.css(offsetParent[0], "borderLeftWidth", true)
					};
				}

				// Subtract parent offsets and element margins
				return {
					top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
					left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
				};
			},

			// This method will return documentElement in the following cases:
			// 1) For the element inside the iframe without offsetParent, this method will return
			//    documentElement of the parent window
			// 2) For the hidden or detached element
			// 3) For body or html element, i.e. in case of the html node - it will return itself
			//
			// but those exceptions were never presented as a real life use-cases
			// and might be considered as more preferable results.
			//
			// This logic, however, is not guaranteed and can change at any point in the future
			offsetParent: function () {
				return this.map(function () {
					var offsetParent = this.offsetParent;

					while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
						offsetParent = offsetParent.offsetParent;
					}

					return offsetParent || documentElement;
				});
			}
		});

		// Create scrollLeft and scrollTop methods
		jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
			var top = "pageYOffset" === prop;

			jQuery.fn[method] = function (val) {
				return access(this, function (elem, method, val) {
					var win = getWindow(elem);

					if (val === undefined) {
						return win ? win[prop] : elem[method];
					}

					if (win) {
						win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
					} else {
						elem[method] = val;
					}
				}, method, val, arguments.length);
			};
		});

		// Support: Safari <=7 - 9.1, Chrome <=37 - 49
		// Add the top/left cssHooks using jQuery.fn.position
		// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
		// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
		// getComputedStyle returns percent when specified for top/left/bottom/right;
		// rather than make the css module depend on the offset module, just check for it here
		jQuery.each(["top", "left"], function (i, prop) {
			jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
				if (computed) {
					computed = curCSS(elem, prop);

					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
				}
			});
		});

		// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
		jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
			jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {

				// Margin is only for outerHeight, outerWidth
				jQuery.fn[funcName] = function (margin, value) {
					var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
					    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

					return access(this, function (elem, type, value) {
						var doc;

						if (jQuery.isWindow(elem)) {

							// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
							return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
						}

						// Get document width or height
						if (elem.nodeType === 9) {
							doc = elem.documentElement;

							// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
							// whichever is greatest
							return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
						}

						return value === undefined ?

						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css(elem, type, extra) :

						// Set width or height on the element
						jQuery.style(elem, type, value, extra);
					}, type, chainable ? margin : undefined, chainable);
				};
			});
		});

		jQuery.fn.extend({

			bind: function (types, data, fn) {
				return this.on(types, null, data, fn);
			},
			unbind: function (types, fn) {
				return this.off(types, null, fn);
			},

			delegate: function (selector, types, data, fn) {
				return this.on(types, selector, data, fn);
			},
			undelegate: function (selector, types, fn) {

				// ( namespace ) or ( selector, types [, fn] )
				return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
			}
		});

		jQuery.parseJSON = JSON.parse;

		// Register as a named AMD module, since jQuery can be concatenated with other
		// files that may use define, but not via a proper concatenation script that
		// understands anonymous AMD modules. A named AMD is safest and most robust
		// way to register. Lowercase jquery is used because AMD module names are
		// derived from file names, and jQuery is normally delivered in a lowercase
		// file name. Do this after creating the global so that if an AMD module wants
		// to call noConflict to hide this version of jQuery, it will work.

		// Note that for maximum portability, libraries that are not jQuery should
		// declare themselves as anonymous modules, and avoid setting a global if an
		// AMD loader is present. jQuery is a special case. For more information, see
		// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return jQuery;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}

		var

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,


		// Map over the $ in case of overwrite
		_$ = window.$;

		jQuery.noConflict = function (deep) {
			if (window.$ === jQuery) {
				window.$ = _$;
			}

			if (deep && window.jQuery === jQuery) {
				window.jQuery = _jQuery;
			}

			return jQuery;
		};

		// Expose jQuery and $ identifiers, even in AMD
		// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
		// and CommonJS for browser emulators (#13566)
		if (!noGlobal) {
			window.jQuery = window.$ = jQuery;
		}

		return jQuery;
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;!function () {
	  var d3 = {
	    version: "3.5.17"
	  };
	  var d3_arraySlice = [].slice,
	      d3_array = function (list) {
	    return d3_arraySlice.call(list);
	  };
	  var d3_document = this.document;
	  function d3_documentElement(node) {
	    return node && (node.ownerDocument || node.document || node).documentElement;
	  }
	  function d3_window(node) {
	    return node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
	  }
	  if (d3_document) {
	    try {
	      d3_array(d3_document.documentElement.childNodes)[0].nodeType;
	    } catch (e) {
	      d3_array = function (list) {
	        var i = list.length,
	            array = new Array(i);
	        while (i--) array[i] = list[i];
	        return array;
	      };
	    }
	  }
	  if (!Date.now) Date.now = function () {
	    return +new Date();
	  };
	  if (d3_document) {
	    try {
	      d3_document.createElement("DIV").style.setProperty("opacity", 0, "");
	    } catch (error) {
	      var d3_element_prototype = this.Element.prototype,
	          d3_element_setAttribute = d3_element_prototype.setAttribute,
	          d3_element_setAttributeNS = d3_element_prototype.setAttributeNS,
	          d3_style_prototype = this.CSSStyleDeclaration.prototype,
	          d3_style_setProperty = d3_style_prototype.setProperty;
	      d3_element_prototype.setAttribute = function (name, value) {
	        d3_element_setAttribute.call(this, name, value + "");
	      };
	      d3_element_prototype.setAttributeNS = function (space, local, value) {
	        d3_element_setAttributeNS.call(this, space, local, value + "");
	      };
	      d3_style_prototype.setProperty = function (name, value, priority) {
	        d3_style_setProperty.call(this, name, value + "", priority);
	      };
	    }
	  }
	  d3.ascending = d3_ascending;
	  function d3_ascending(a, b) {
	    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	  }
	  d3.descending = function (a, b) {
	    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
	  };
	  d3.min = function (array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b;
	    if (arguments.length === 1) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
	    } else {
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
	    }
	    return a;
	  };
	  d3.max = function (array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b;
	    if (arguments.length === 1) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
	    } else {
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
	        a = b;
	        break;
	      }
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
	    }
	    return a;
	  };
	  d3.extent = function (array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b,
	        c;
	    if (arguments.length === 1) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) {
	        a = c = b;
	        break;
	      }
	      while (++i < n) if ((b = array[i]) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    } else {
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
	        a = c = b;
	        break;
	      }
	      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    }
	    return [a, c];
	  };
	  function d3_number(x) {
	    return x === null ? NaN : +x;
	  }
	  function d3_numeric(x) {
	    return !isNaN(x);
	  }
	  d3.sum = function (array, f) {
	    var s = 0,
	        n = array.length,
	        a,
	        i = -1;
	    if (arguments.length === 1) {
	      while (++i < n) if (d3_numeric(a = +array[i])) s += a;
	    } else {
	      while (++i < n) if (d3_numeric(a = +f.call(array, array[i], i))) s += a;
	    }
	    return s;
	  };
	  d3.mean = function (array, f) {
	    var s = 0,
	        n = array.length,
	        a,
	        i = -1,
	        j = n;
	    if (arguments.length === 1) {
	      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) s += a;else --j;
	    } else {
	      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) s += a;else --j;
	    }
	    if (j) return s / j;
	  };
	  d3.quantile = function (values, p) {
	    var H = (values.length - 1) * p + 1,
	        h = Math.floor(H),
	        v = +values[h - 1],
	        e = H - h;
	    return e ? v + e * (values[h] - v) : v;
	  };
	  d3.median = function (array, f) {
	    var numbers = [],
	        n = array.length,
	        a,
	        i = -1;
	    if (arguments.length === 1) {
	      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) numbers.push(a);
	    } else {
	      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) numbers.push(a);
	    }
	    if (numbers.length) return d3.quantile(numbers.sort(d3_ascending), .5);
	  };
	  d3.variance = function (array, f) {
	    var n = array.length,
	        m = 0,
	        a,
	        d,
	        s = 0,
	        i = -1,
	        j = 0;
	    if (arguments.length === 1) {
	      while (++i < n) {
	        if (d3_numeric(a = d3_number(array[i]))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    } else {
	      while (++i < n) {
	        if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    }
	    if (j > 1) return s / (j - 1);
	  };
	  d3.deviation = function () {
	    var v = d3.variance.apply(this, arguments);
	    return v ? Math.sqrt(v) : v;
	  };
	  function d3_bisector(compare) {
	    return {
	      left: function (a, x, lo, hi) {
	        if (arguments.length < 3) lo = 0;
	        if (arguments.length < 4) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
	        }
	        return lo;
	      },
	      right: function (a, x, lo, hi) {
	        if (arguments.length < 3) lo = 0;
	        if (arguments.length < 4) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
	        }
	        return lo;
	      }
	    };
	  }
	  var d3_bisect = d3_bisector(d3_ascending);
	  d3.bisectLeft = d3_bisect.left;
	  d3.bisect = d3.bisectRight = d3_bisect.right;
	  d3.bisector = function (f) {
	    return d3_bisector(f.length === 1 ? function (d, x) {
	      return d3_ascending(f(d), x);
	    } : f);
	  };
	  d3.shuffle = function (array, i0, i1) {
	    if ((m = arguments.length) < 3) {
	      i1 = array.length;
	      if (m < 2) i0 = 0;
	    }
	    var m = i1 - i0,
	        t,
	        i;
	    while (m) {
	      i = Math.random() * m-- | 0;
	      t = array[m + i0], array[m + i0] = array[i + i0], array[i + i0] = t;
	    }
	    return array;
	  };
	  d3.permute = function (array, indexes) {
	    var i = indexes.length,
	        permutes = new Array(i);
	    while (i--) permutes[i] = array[indexes[i]];
	    return permutes;
	  };
	  d3.pairs = function (array) {
	    var i = 0,
	        n = array.length - 1,
	        p0,
	        p1 = array[0],
	        pairs = new Array(n < 0 ? 0 : n);
	    while (i < n) pairs[i] = [p0 = p1, p1 = array[++i]];
	    return pairs;
	  };
	  d3.transpose = function (matrix) {
	    if (!(n = matrix.length)) return [];
	    for (var i = -1, m = d3.min(matrix, d3_transposeLength), transpose = new Array(m); ++i < m;) {
	      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
	        row[j] = matrix[j][i];
	      }
	    }
	    return transpose;
	  };
	  function d3_transposeLength(d) {
	    return d.length;
	  }
	  d3.zip = function () {
	    return d3.transpose(arguments);
	  };
	  d3.keys = function (map) {
	    var keys = [];
	    for (var key in map) keys.push(key);
	    return keys;
	  };
	  d3.values = function (map) {
	    var values = [];
	    for (var key in map) values.push(map[key]);
	    return values;
	  };
	  d3.entries = function (map) {
	    var entries = [];
	    for (var key in map) entries.push({
	      key: key,
	      value: map[key]
	    });
	    return entries;
	  };
	  d3.merge = function (arrays) {
	    var n = arrays.length,
	        m,
	        i = -1,
	        j = 0,
	        merged,
	        array;
	    while (++i < n) j += arrays[i].length;
	    merged = new Array(j);
	    while (--n >= 0) {
	      array = arrays[n];
	      m = array.length;
	      while (--m >= 0) {
	        merged[--j] = array[m];
	      }
	    }
	    return merged;
	  };
	  var abs = Math.abs;
	  d3.range = function (start, stop, step) {
	    if (arguments.length < 3) {
	      step = 1;
	      if (arguments.length < 2) {
	        stop = start;
	        start = 0;
	      }
	    }
	    if ((stop - start) / step === Infinity) throw new Error("infinite range");
	    var range = [],
	        k = d3_range_integerScale(abs(step)),
	        i = -1,
	        j;
	    start *= k, stop *= k, step *= k;
	    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k);else while ((j = start + step * ++i) < stop) range.push(j / k);
	    return range;
	  };
	  function d3_range_integerScale(x) {
	    var k = 1;
	    while (x * k % 1) k *= 10;
	    return k;
	  }
	  function d3_class(ctor, properties) {
	    for (var key in properties) {
	      Object.defineProperty(ctor.prototype, key, {
	        value: properties[key],
	        enumerable: false
	      });
	    }
	  }
	  d3.map = function (object, f) {
	    var map = new d3_Map();
	    if (object instanceof d3_Map) {
	      object.forEach(function (key, value) {
	        map.set(key, value);
	      });
	    } else if (Array.isArray(object)) {
	      var i = -1,
	          n = object.length,
	          o;
	      if (arguments.length === 1) while (++i < n) map.set(i, object[i]);else while (++i < n) map.set(f.call(object, o = object[i], i), o);
	    } else {
	      for (var key in object) map.set(key, object[key]);
	    }
	    return map;
	  };
	  function d3_Map() {
	    this._ = Object.create(null);
	  }
	  var d3_map_proto = "__proto__",
	      d3_map_zero = "\x00";
	  d3_class(d3_Map, {
	    has: d3_map_has,
	    get: function (key) {
	      return this._[d3_map_escape(key)];
	    },
	    set: function (key, value) {
	      return this._[d3_map_escape(key)] = value;
	    },
	    remove: d3_map_remove,
	    keys: d3_map_keys,
	    values: function () {
	      var values = [];
	      for (var key in this._) values.push(this._[key]);
	      return values;
	    },
	    entries: function () {
	      var entries = [];
	      for (var key in this._) entries.push({
	        key: d3_map_unescape(key),
	        value: this._[key]
	      });
	      return entries;
	    },
	    size: d3_map_size,
	    empty: d3_map_empty,
	    forEach: function (f) {
	      for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
	    }
	  });
	  function d3_map_escape(key) {
	    return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
	  }
	  function d3_map_unescape(key) {
	    return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
	  }
	  function d3_map_has(key) {
	    return d3_map_escape(key) in this._;
	  }
	  function d3_map_remove(key) {
	    return (key = d3_map_escape(key)) in this._ && delete this._[key];
	  }
	  function d3_map_keys() {
	    var keys = [];
	    for (var key in this._) keys.push(d3_map_unescape(key));
	    return keys;
	  }
	  function d3_map_size() {
	    var size = 0;
	    for (var key in this._) ++size;
	    return size;
	  }
	  function d3_map_empty() {
	    for (var key in this._) return false;
	    return true;
	  }
	  d3.nest = function () {
	    var nest = {},
	        keys = [],
	        sortKeys = [],
	        sortValues,
	        rollup;
	    function map(mapType, array, depth) {
	      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
	      var i = -1,
	          n = array.length,
	          key = keys[depth++],
	          keyValue,
	          object,
	          setter,
	          valuesByKey = new d3_Map(),
	          values;
	      while (++i < n) {
	        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
	          values.push(object);
	        } else {
	          valuesByKey.set(keyValue, [object]);
	        }
	      }
	      if (mapType) {
	        object = mapType();
	        setter = function (keyValue, values) {
	          object.set(keyValue, map(mapType, values, depth));
	        };
	      } else {
	        object = {};
	        setter = function (keyValue, values) {
	          object[keyValue] = map(mapType, values, depth);
	        };
	      }
	      valuesByKey.forEach(setter);
	      return object;
	    }
	    function entries(map, depth) {
	      if (depth >= keys.length) return map;
	      var array = [],
	          sortKey = sortKeys[depth++];
	      map.forEach(function (key, keyMap) {
	        array.push({
	          key: key,
	          values: entries(keyMap, depth)
	        });
	      });
	      return sortKey ? array.sort(function (a, b) {
	        return sortKey(a.key, b.key);
	      }) : array;
	    }
	    nest.map = function (array, mapType) {
	      return map(mapType, array, 0);
	    };
	    nest.entries = function (array) {
	      return entries(map(d3.map, array, 0), 0);
	    };
	    nest.key = function (d) {
	      keys.push(d);
	      return nest;
	    };
	    nest.sortKeys = function (order) {
	      sortKeys[keys.length - 1] = order;
	      return nest;
	    };
	    nest.sortValues = function (order) {
	      sortValues = order;
	      return nest;
	    };
	    nest.rollup = function (f) {
	      rollup = f;
	      return nest;
	    };
	    return nest;
	  };
	  d3.set = function (array) {
	    var set = new d3_Set();
	    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
	    return set;
	  };
	  function d3_Set() {
	    this._ = Object.create(null);
	  }
	  d3_class(d3_Set, {
	    has: d3_map_has,
	    add: function (key) {
	      this._[d3_map_escape(key += "")] = true;
	      return key;
	    },
	    remove: d3_map_remove,
	    values: d3_map_keys,
	    size: d3_map_size,
	    empty: d3_map_empty,
	    forEach: function (f) {
	      for (var key in this._) f.call(this, d3_map_unescape(key));
	    }
	  });
	  d3.behavior = {};
	  function d3_identity(d) {
	    return d;
	  }
	  d3.rebind = function (target, source) {
	    var i = 1,
	        n = arguments.length,
	        method;
	    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
	    return target;
	  };
	  function d3_rebind(target, source, method) {
	    return function () {
	      var value = method.apply(source, arguments);
	      return value === source ? target : value;
	    };
	  }
	  function d3_vendorSymbol(object, name) {
	    if (name in object) return name;
	    name = name.charAt(0).toUpperCase() + name.slice(1);
	    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
	      var prefixName = d3_vendorPrefixes[i] + name;
	      if (prefixName in object) return prefixName;
	    }
	  }
	  var d3_vendorPrefixes = ["webkit", "ms", "moz", "Moz", "o", "O"];
	  function d3_noop() {}
	  d3.dispatch = function () {
	    var dispatch = new d3_dispatch(),
	        i = -1,
	        n = arguments.length;
	    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
	    return dispatch;
	  };
	  function d3_dispatch() {}
	  d3_dispatch.prototype.on = function (type, listener) {
	    var i = type.indexOf("."),
	        name = "";
	    if (i >= 0) {
	      name = type.slice(i + 1);
	      type = type.slice(0, i);
	    }
	    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
	    if (arguments.length === 2) {
	      if (listener == null) for (type in this) {
	        if (this.hasOwnProperty(type)) this[type].on(name, null);
	      }
	      return this;
	    }
	  };
	  function d3_dispatch_event(dispatch) {
	    var listeners = [],
	        listenerByName = new d3_Map();
	    function event() {
	      var z = listeners,
	          i = -1,
	          n = z.length,
	          l;
	      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
	      return dispatch;
	    }
	    event.on = function (name, listener) {
	      var l = listenerByName.get(name),
	          i;
	      if (arguments.length < 2) return l && l.on;
	      if (l) {
	        l.on = null;
	        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
	        listenerByName.remove(name);
	      }
	      if (listener) listeners.push(listenerByName.set(name, {
	        on: listener
	      }));
	      return dispatch;
	    };
	    return event;
	  }
	  d3.event = null;
	  function d3_eventPreventDefault() {
	    d3.event.preventDefault();
	  }
	  function d3_eventSource() {
	    var e = d3.event,
	        s;
	    while (s = e.sourceEvent) e = s;
	    return e;
	  }
	  function d3_eventDispatch(target) {
	    var dispatch = new d3_dispatch(),
	        i = 0,
	        n = arguments.length;
	    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
	    dispatch.of = function (thiz, argumentz) {
	      return function (e1) {
	        try {
	          var e0 = e1.sourceEvent = d3.event;
	          e1.target = target;
	          d3.event = e1;
	          dispatch[e1.type].apply(thiz, argumentz);
	        } finally {
	          d3.event = e0;
	        }
	      };
	    };
	    return dispatch;
	  }
	  d3.requote = function (s) {
	    return s.replace(d3_requote_re, "\\$&");
	  };
	  var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
	  var d3_subclass = {}.__proto__ ? function (object, prototype) {
	    object.__proto__ = prototype;
	  } : function (object, prototype) {
	    for (var property in prototype) object[property] = prototype[property];
	  };
	  function d3_selection(groups) {
	    d3_subclass(groups, d3_selectionPrototype);
	    return groups;
	  }
	  var d3_select = function (s, n) {
	    return n.querySelector(s);
	  },
	      d3_selectAll = function (s, n) {
	    return n.querySelectorAll(s);
	  },
	      d3_selectMatches = function (n, s) {
	    var d3_selectMatcher = n.matches || n[d3_vendorSymbol(n, "matchesSelector")];
	    d3_selectMatches = function (n, s) {
	      return d3_selectMatcher.call(n, s);
	    };
	    return d3_selectMatches(n, s);
	  };
	  if (typeof Sizzle === "function") {
	    d3_select = function (s, n) {
	      return Sizzle(s, n)[0] || null;
	    };
	    d3_selectAll = Sizzle;
	    d3_selectMatches = Sizzle.matchesSelector;
	  }
	  d3.selection = function () {
	    return d3.select(d3_document.documentElement);
	  };
	  var d3_selectionPrototype = d3.selection.prototype = [];
	  d3_selectionPrototype.select = function (selector) {
	    var subgroups = [],
	        subgroup,
	        subnode,
	        group,
	        node;
	    selector = d3_selection_selector(selector);
	    for (var j = -1, m = this.length; ++j < m;) {
	      subgroups.push(subgroup = []);
	      subgroup.parentNode = (group = this[j]).parentNode;
	      for (var i = -1, n = group.length; ++i < n;) {
	        if (node = group[i]) {
	          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
	          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
	        } else {
	          subgroup.push(null);
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  function d3_selection_selector(selector) {
	    return typeof selector === "function" ? selector : function () {
	      return d3_select(selector, this);
	    };
	  }
	  d3_selectionPrototype.selectAll = function (selector) {
	    var subgroups = [],
	        subgroup,
	        node;
	    selector = d3_selection_selectorAll(selector);
	    for (var j = -1, m = this.length; ++j < m;) {
	      for (var group = this[j], i = -1, n = group.length; ++i < n;) {
	        if (node = group[i]) {
	          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
	          subgroup.parentNode = node;
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  function d3_selection_selectorAll(selector) {
	    return typeof selector === "function" ? selector : function () {
	      return d3_selectAll(selector, this);
	    };
	  }
	  var d3_nsXhtml = "http://www.w3.org/1999/xhtml";
	  var d3_nsPrefix = {
	    svg: "http://www.w3.org/2000/svg",
	    xhtml: d3_nsXhtml,
	    xlink: "http://www.w3.org/1999/xlink",
	    xml: "http://www.w3.org/XML/1998/namespace",
	    xmlns: "http://www.w3.org/2000/xmlns/"
	  };
	  d3.ns = {
	    prefix: d3_nsPrefix,
	    qualify: function (name) {
	      var i = name.indexOf(":"),
	          prefix = name;
	      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	      return d3_nsPrefix.hasOwnProperty(prefix) ? {
	        space: d3_nsPrefix[prefix],
	        local: name
	      } : name;
	    }
	  };
	  d3_selectionPrototype.attr = function (name, value) {
	    if (arguments.length < 2) {
	      if (typeof name === "string") {
	        var node = this.node();
	        name = d3.ns.qualify(name);
	        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
	      }
	      for (value in name) this.each(d3_selection_attr(value, name[value]));
	      return this;
	    }
	    return this.each(d3_selection_attr(name, value));
	  };
	  function d3_selection_attr(name, value) {
	    name = d3.ns.qualify(name);
	    function attrNull() {
	      this.removeAttribute(name);
	    }
	    function attrNullNS() {
	      this.removeAttributeNS(name.space, name.local);
	    }
	    function attrConstant() {
	      this.setAttribute(name, value);
	    }
	    function attrConstantNS() {
	      this.setAttributeNS(name.space, name.local, value);
	    }
	    function attrFunction() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.removeAttribute(name);else this.setAttribute(name, x);
	    }
	    function attrFunctionNS() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.removeAttributeNS(name.space, name.local);else this.setAttributeNS(name.space, name.local, x);
	    }
	    return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
	  }
	  function d3_collapse(s) {
	    return s.trim().replace(/\s+/g, " ");
	  }
	  d3_selectionPrototype.classed = function (name, value) {
	    if (arguments.length < 2) {
	      if (typeof name === "string") {
	        var node = this.node(),
	            n = (name = d3_selection_classes(name)).length,
	            i = -1;
	        if (value = node.classList) {
	          while (++i < n) if (!value.contains(name[i])) return false;
	        } else {
	          value = node.getAttribute("class");
	          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
	        }
	        return true;
	      }
	      for (value in name) this.each(d3_selection_classed(value, name[value]));
	      return this;
	    }
	    return this.each(d3_selection_classed(name, value));
	  };
	  function d3_selection_classedRe(name) {
	    return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
	  }
	  function d3_selection_classes(name) {
	    return (name + "").trim().split(/^|\s+/);
	  }
	  function d3_selection_classed(name, value) {
	    name = d3_selection_classes(name).map(d3_selection_classedName);
	    var n = name.length;
	    function classedConstant() {
	      var i = -1;
	      while (++i < n) name[i](this, value);
	    }
	    function classedFunction() {
	      var i = -1,
	          x = value.apply(this, arguments);
	      while (++i < n) name[i](this, x);
	    }
	    return typeof value === "function" ? classedFunction : classedConstant;
	  }
	  function d3_selection_classedName(name) {
	    var re = d3_selection_classedRe(name);
	    return function (node, value) {
	      if (c = node.classList) return value ? c.add(name) : c.remove(name);
	      var c = node.getAttribute("class") || "";
	      if (value) {
	        re.lastIndex = 0;
	        if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
	      } else {
	        node.setAttribute("class", d3_collapse(c.replace(re, " ")));
	      }
	    };
	  }
	  d3_selectionPrototype.style = function (name, value, priority) {
	    var n = arguments.length;
	    if (n < 3) {
	      if (typeof name !== "string") {
	        if (n < 2) value = "";
	        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
	        return this;
	      }
	      if (n < 2) {
	        var node = this.node();
	        return d3_window(node).getComputedStyle(node, null).getPropertyValue(name);
	      }
	      priority = "";
	    }
	    return this.each(d3_selection_style(name, value, priority));
	  };
	  function d3_selection_style(name, value, priority) {
	    function styleNull() {
	      this.style.removeProperty(name);
	    }
	    function styleConstant() {
	      this.style.setProperty(name, value, priority);
	    }
	    function styleFunction() {
	      var x = value.apply(this, arguments);
	      if (x == null) this.style.removeProperty(name);else this.style.setProperty(name, x, priority);
	    }
	    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
	  }
	  d3_selectionPrototype.property = function (name, value) {
	    if (arguments.length < 2) {
	      if (typeof name === "string") return this.node()[name];
	      for (value in name) this.each(d3_selection_property(value, name[value]));
	      return this;
	    }
	    return this.each(d3_selection_property(name, value));
	  };
	  function d3_selection_property(name, value) {
	    function propertyNull() {
	      delete this[name];
	    }
	    function propertyConstant() {
	      this[name] = value;
	    }
	    function propertyFunction() {
	      var x = value.apply(this, arguments);
	      if (x == null) delete this[name];else this[name] = x;
	    }
	    return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
	  }
	  d3_selectionPrototype.text = function (value) {
	    return arguments.length ? this.each(typeof value === "function" ? function () {
	      var v = value.apply(this, arguments);
	      this.textContent = v == null ? "" : v;
	    } : value == null ? function () {
	      this.textContent = "";
	    } : function () {
	      this.textContent = value;
	    }) : this.node().textContent;
	  };
	  d3_selectionPrototype.html = function (value) {
	    return arguments.length ? this.each(typeof value === "function" ? function () {
	      var v = value.apply(this, arguments);
	      this.innerHTML = v == null ? "" : v;
	    } : value == null ? function () {
	      this.innerHTML = "";
	    } : function () {
	      this.innerHTML = value;
	    }) : this.node().innerHTML;
	  };
	  d3_selectionPrototype.append = function (name) {
	    name = d3_selection_creator(name);
	    return this.select(function () {
	      return this.appendChild(name.apply(this, arguments));
	    });
	  };
	  function d3_selection_creator(name) {
	    function create() {
	      var document = this.ownerDocument,
	          namespace = this.namespaceURI;
	      return namespace === d3_nsXhtml && document.documentElement.namespaceURI === d3_nsXhtml ? document.createElement(name) : document.createElementNS(namespace, name);
	    }
	    function createNS() {
	      return this.ownerDocument.createElementNS(name.space, name.local);
	    }
	    return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? createNS : create;
	  }
	  d3_selectionPrototype.insert = function (name, before) {
	    name = d3_selection_creator(name);
	    before = d3_selection_selector(before);
	    return this.select(function () {
	      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
	    });
	  };
	  d3_selectionPrototype.remove = function () {
	    return this.each(d3_selectionRemove);
	  };
	  function d3_selectionRemove() {
	    var parent = this.parentNode;
	    if (parent) parent.removeChild(this);
	  }
	  d3_selectionPrototype.data = function (value, key) {
	    var i = -1,
	        n = this.length,
	        group,
	        node;
	    if (!arguments.length) {
	      value = new Array(n = (group = this[0]).length);
	      while (++i < n) {
	        if (node = group[i]) {
	          value[i] = node.__data__;
	        }
	      }
	      return value;
	    }
	    function bind(group, groupData) {
	      var i,
	          n = group.length,
	          m = groupData.length,
	          n0 = Math.min(n, m),
	          updateNodes = new Array(m),
	          enterNodes = new Array(m),
	          exitNodes = new Array(n),
	          node,
	          nodeData;
	      if (key) {
	        var nodeByKeyValue = new d3_Map(),
	            keyValues = new Array(n),
	            keyValue;
	        for (i = -1; ++i < n;) {
	          if (node = group[i]) {
	            if (nodeByKeyValue.has(keyValue = key.call(node, node.__data__, i))) {
	              exitNodes[i] = node;
	            } else {
	              nodeByKeyValue.set(keyValue, node);
	            }
	            keyValues[i] = keyValue;
	          }
	        }
	        for (i = -1; ++i < m;) {
	          if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
	            enterNodes[i] = d3_selection_dataNode(nodeData);
	          } else if (node !== true) {
	            updateNodes[i] = node;
	            node.__data__ = nodeData;
	          }
	          nodeByKeyValue.set(keyValue, true);
	        }
	        for (i = -1; ++i < n;) {
	          if (i in keyValues && nodeByKeyValue.get(keyValues[i]) !== true) {
	            exitNodes[i] = group[i];
	          }
	        }
	      } else {
	        for (i = -1; ++i < n0;) {
	          node = group[i];
	          nodeData = groupData[i];
	          if (node) {
	            node.__data__ = nodeData;
	            updateNodes[i] = node;
	          } else {
	            enterNodes[i] = d3_selection_dataNode(nodeData);
	          }
	        }
	        for (; i < m; ++i) {
	          enterNodes[i] = d3_selection_dataNode(groupData[i]);
	        }
	        for (; i < n; ++i) {
	          exitNodes[i] = group[i];
	        }
	      }
	      enterNodes.update = updateNodes;
	      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
	      enter.push(enterNodes);
	      update.push(updateNodes);
	      exit.push(exitNodes);
	    }
	    var enter = d3_selection_enter([]),
	        update = d3_selection([]),
	        exit = d3_selection([]);
	    if (typeof value === "function") {
	      while (++i < n) {
	        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
	      }
	    } else {
	      while (++i < n) {
	        bind(group = this[i], value);
	      }
	    }
	    update.enter = function () {
	      return enter;
	    };
	    update.exit = function () {
	      return exit;
	    };
	    return update;
	  };
	  function d3_selection_dataNode(data) {
	    return {
	      __data__: data
	    };
	  }
	  d3_selectionPrototype.datum = function (value) {
	    return arguments.length ? this.property("__data__", value) : this.property("__data__");
	  };
	  d3_selectionPrototype.filter = function (filter) {
	    var subgroups = [],
	        subgroup,
	        group,
	        node;
	    if (typeof filter !== "function") filter = d3_selection_filter(filter);
	    for (var j = 0, m = this.length; j < m; j++) {
	      subgroups.push(subgroup = []);
	      subgroup.parentNode = (group = this[j]).parentNode;
	      for (var i = 0, n = group.length; i < n; i++) {
	        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
	          subgroup.push(node);
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  function d3_selection_filter(selector) {
	    return function () {
	      return d3_selectMatches(this, selector);
	    };
	  }
	  d3_selectionPrototype.order = function () {
	    for (var j = -1, m = this.length; ++j < m;) {
	      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	        if (node = group[i]) {
	          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
	          next = node;
	        }
	      }
	    }
	    return this;
	  };
	  d3_selectionPrototype.sort = function (comparator) {
	    comparator = d3_selection_sortComparator.apply(this, arguments);
	    for (var j = -1, m = this.length; ++j < m;) this[j].sort(comparator);
	    return this.order();
	  };
	  function d3_selection_sortComparator(comparator) {
	    if (!arguments.length) comparator = d3_ascending;
	    return function (a, b) {
	      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
	    };
	  }
	  d3_selectionPrototype.each = function (callback) {
	    return d3_selection_each(this, function (node, i, j) {
	      callback.call(node, node.__data__, i, j);
	    });
	  };
	  function d3_selection_each(groups, callback) {
	    for (var j = 0, m = groups.length; j < m; j++) {
	      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
	        if (node = group[i]) callback(node, i, j);
	      }
	    }
	    return groups;
	  }
	  d3_selectionPrototype.call = function (callback) {
	    var args = d3_array(arguments);
	    callback.apply(args[0] = this, args);
	    return this;
	  };
	  d3_selectionPrototype.empty = function () {
	    return !this.node();
	  };
	  d3_selectionPrototype.node = function () {
	    for (var j = 0, m = this.length; j < m; j++) {
	      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
	        var node = group[i];
	        if (node) return node;
	      }
	    }
	    return null;
	  };
	  d3_selectionPrototype.size = function () {
	    var n = 0;
	    d3_selection_each(this, function () {
	      ++n;
	    });
	    return n;
	  };
	  function d3_selection_enter(selection) {
	    d3_subclass(selection, d3_selection_enterPrototype);
	    return selection;
	  }
	  var d3_selection_enterPrototype = [];
	  d3.selection.enter = d3_selection_enter;
	  d3.selection.enter.prototype = d3_selection_enterPrototype;
	  d3_selection_enterPrototype.append = d3_selectionPrototype.append;
	  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
	  d3_selection_enterPrototype.node = d3_selectionPrototype.node;
	  d3_selection_enterPrototype.call = d3_selectionPrototype.call;
	  d3_selection_enterPrototype.size = d3_selectionPrototype.size;
	  d3_selection_enterPrototype.select = function (selector) {
	    var subgroups = [],
	        subgroup,
	        subnode,
	        upgroup,
	        group,
	        node;
	    for (var j = -1, m = this.length; ++j < m;) {
	      upgroup = (group = this[j]).update;
	      subgroups.push(subgroup = []);
	      subgroup.parentNode = group.parentNode;
	      for (var i = -1, n = group.length; ++i < n;) {
	        if (node = group[i]) {
	          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
	          subnode.__data__ = node.__data__;
	        } else {
	          subgroup.push(null);
	        }
	      }
	    }
	    return d3_selection(subgroups);
	  };
	  d3_selection_enterPrototype.insert = function (name, before) {
	    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
	    return d3_selectionPrototype.insert.call(this, name, before);
	  };
	  function d3_selection_enterInsertBefore(enter) {
	    var i0, j0;
	    return function (d, i, j) {
	      var group = enter[j].update,
	          n = group.length,
	          node;
	      if (j != j0) j0 = j, i0 = 0;
	      if (i >= i0) i0 = i + 1;
	      while (!(node = group[i0]) && ++i0 < n);
	      return node;
	    };
	  }
	  d3.select = function (node) {
	    var group;
	    if (typeof node === "string") {
	      group = [d3_select(node, d3_document)];
	      group.parentNode = d3_document.documentElement;
	    } else {
	      group = [node];
	      group.parentNode = d3_documentElement(node);
	    }
	    return d3_selection([group]);
	  };
	  d3.selectAll = function (nodes) {
	    var group;
	    if (typeof nodes === "string") {
	      group = d3_array(d3_selectAll(nodes, d3_document));
	      group.parentNode = d3_document.documentElement;
	    } else {
	      group = d3_array(nodes);
	      group.parentNode = null;
	    }
	    return d3_selection([group]);
	  };
	  d3_selectionPrototype.on = function (type, listener, capture) {
	    var n = arguments.length;
	    if (n < 3) {
	      if (typeof type !== "string") {
	        if (n < 2) listener = false;
	        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
	        return this;
	      }
	      if (n < 2) return (n = this.node()["__on" + type]) && n._;
	      capture = false;
	    }
	    return this.each(d3_selection_on(type, listener, capture));
	  };
	  function d3_selection_on(type, listener, capture) {
	    var name = "__on" + type,
	        i = type.indexOf("."),
	        wrap = d3_selection_onListener;
	    if (i > 0) type = type.slice(0, i);
	    var filter = d3_selection_onFilters.get(type);
	    if (filter) type = filter, wrap = d3_selection_onFilter;
	    function onRemove() {
	      var l = this[name];
	      if (l) {
	        this.removeEventListener(type, l, l.$);
	        delete this[name];
	      }
	    }
	    function onAdd() {
	      var l = wrap(listener, d3_array(arguments));
	      onRemove.call(this);
	      this.addEventListener(type, this[name] = l, l.$ = capture);
	      l._ = listener;
	    }
	    function removeAll() {
	      var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"),
	          match;
	      for (var name in this) {
	        if (match = name.match(re)) {
	          var l = this[name];
	          this.removeEventListener(match[1], l, l.$);
	          delete this[name];
	        }
	      }
	    }
	    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
	  }
	  var d3_selection_onFilters = d3.map({
	    mouseenter: "mouseover",
	    mouseleave: "mouseout"
	  });
	  if (d3_document) {
	    d3_selection_onFilters.forEach(function (k) {
	      if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
	    });
	  }
	  function d3_selection_onListener(listener, argumentz) {
	    return function (e) {
	      var o = d3.event;
	      d3.event = e;
	      argumentz[0] = this.__data__;
	      try {
	        listener.apply(this, argumentz);
	      } finally {
	        d3.event = o;
	      }
	    };
	  }
	  function d3_selection_onFilter(listener, argumentz) {
	    var l = d3_selection_onListener(listener, argumentz);
	    return function (e) {
	      var target = this,
	          related = e.relatedTarget;
	      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
	        l.call(target, e);
	      }
	    };
	  }
	  var d3_event_dragSelect,
	      d3_event_dragId = 0;
	  function d3_event_dragSuppress(node) {
	    var name = ".dragsuppress-" + ++d3_event_dragId,
	        click = "click" + name,
	        w = d3.select(d3_window(node)).on("touchmove" + name, d3_eventPreventDefault).on("dragstart" + name, d3_eventPreventDefault).on("selectstart" + name, d3_eventPreventDefault);
	    if (d3_event_dragSelect == null) {
	      d3_event_dragSelect = "onselectstart" in node ? false : d3_vendorSymbol(node.style, "userSelect");
	    }
	    if (d3_event_dragSelect) {
	      var style = d3_documentElement(node).style,
	          select = style[d3_event_dragSelect];
	      style[d3_event_dragSelect] = "none";
	    }
	    return function (suppressClick) {
	      w.on(name, null);
	      if (d3_event_dragSelect) style[d3_event_dragSelect] = select;
	      if (suppressClick) {
	        var off = function () {
	          w.on(click, null);
	        };
	        w.on(click, function () {
	          d3_eventPreventDefault();
	          off();
	        }, true);
	        setTimeout(off, 0);
	      }
	    };
	  }
	  d3.mouse = function (container) {
	    return d3_mousePoint(container, d3_eventSource());
	  };
	  var d3_mouse_bug44083 = this.navigator && /WebKit/.test(this.navigator.userAgent) ? -1 : 0;
	  function d3_mousePoint(container, e) {
	    if (e.changedTouches) e = e.changedTouches[0];
	    var svg = container.ownerSVGElement || container;
	    if (svg.createSVGPoint) {
	      var point = svg.createSVGPoint();
	      if (d3_mouse_bug44083 < 0) {
	        var window = d3_window(container);
	        if (window.scrollX || window.scrollY) {
	          svg = d3.select("body").append("svg").style({
	            position: "absolute",
	            top: 0,
	            left: 0,
	            margin: 0,
	            padding: 0,
	            border: "none"
	          }, "important");
	          var ctm = svg[0][0].getScreenCTM();
	          d3_mouse_bug44083 = !(ctm.f || ctm.e);
	          svg.remove();
	        }
	      }
	      if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY;else point.x = e.clientX, point.y = e.clientY;
	      point = point.matrixTransform(container.getScreenCTM().inverse());
	      return [point.x, point.y];
	    }
	    var rect = container.getBoundingClientRect();
	    return [e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop];
	  }
	  d3.touch = function (container, touches, identifier) {
	    if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches;
	    if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {
	      if ((touch = touches[i]).identifier === identifier) {
	        return d3_mousePoint(container, touch);
	      }
	    }
	  };
	  d3.behavior.drag = function () {
	    var event = d3_eventDispatch(drag, "drag", "dragstart", "dragend"),
	        origin = null,
	        mousedown = dragstart(d3_noop, d3.mouse, d3_window, "mousemove", "mouseup"),
	        touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_identity, "touchmove", "touchend");
	    function drag() {
	      this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart);
	    }
	    function dragstart(id, position, subject, move, end) {
	      return function () {
	        var that = this,
	            target = d3.event.target.correspondingElement || d3.event.target,
	            parent = that.parentNode,
	            dispatch = event.of(that, arguments),
	            dragged = 0,
	            dragId = id(),
	            dragName = ".drag" + (dragId == null ? "" : "-" + dragId),
	            dragOffset,
	            dragSubject = d3.select(subject(target)).on(move + dragName, moved).on(end + dragName, ended),
	            dragRestore = d3_event_dragSuppress(target),
	            position0 = position(parent, dragId);
	        if (origin) {
	          dragOffset = origin.apply(that, arguments);
	          dragOffset = [dragOffset.x - position0[0], dragOffset.y - position0[1]];
	        } else {
	          dragOffset = [0, 0];
	        }
	        dispatch({
	          type: "dragstart"
	        });
	        function moved() {
	          var position1 = position(parent, dragId),
	              dx,
	              dy;
	          if (!position1) return;
	          dx = position1[0] - position0[0];
	          dy = position1[1] - position0[1];
	          dragged |= dx | dy;
	          position0 = position1;
	          dispatch({
	            type: "drag",
	            x: position1[0] + dragOffset[0],
	            y: position1[1] + dragOffset[1],
	            dx: dx,
	            dy: dy
	          });
	        }
	        function ended() {
	          if (!position(parent, dragId)) return;
	          dragSubject.on(move + dragName, null).on(end + dragName, null);
	          dragRestore(dragged);
	          dispatch({
	            type: "dragend"
	          });
	        }
	      };
	    }
	    drag.origin = function (x) {
	      if (!arguments.length) return origin;
	      origin = x;
	      return drag;
	    };
	    return d3.rebind(drag, event, "on");
	  };
	  function d3_behavior_dragTouchId() {
	    return d3.event.changedTouches[0].identifier;
	  }
	  d3.touches = function (container, touches) {
	    if (arguments.length < 2) touches = d3_eventSource().touches;
	    return touches ? d3_array(touches).map(function (touch) {
	      var point = d3_mousePoint(container, touch);
	      point.identifier = touch.identifier;
	      return point;
	    }) : [];
	  };
	  var ε = 1e-6,
	      ε2 = ε * ε,
	      π = Math.PI,
	      τ = 2 * π,
	      τε = τ - ε,
	      halfπ = π / 2,
	      d3_radians = π / 180,
	      d3_degrees = 180 / π;
	  function d3_sgn(x) {
	    return x > 0 ? 1 : x < 0 ? -1 : 0;
	  }
	  function d3_cross2d(a, b, c) {
	    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
	  }
	  function d3_acos(x) {
	    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
	  }
	  function d3_asin(x) {
	    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
	  }
	  function d3_sinh(x) {
	    return ((x = Math.exp(x)) - 1 / x) / 2;
	  }
	  function d3_cosh(x) {
	    return ((x = Math.exp(x)) + 1 / x) / 2;
	  }
	  function d3_tanh(x) {
	    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
	  }
	  function d3_haversin(x) {
	    return (x = Math.sin(x / 2)) * x;
	  }
	  var ρ = Math.SQRT2,
	      ρ2 = 2,
	      ρ4 = 4;
	  d3.interpolateZoom = function (p0, p1) {
	    var ux0 = p0[0],
	        uy0 = p0[1],
	        w0 = p0[2],
	        ux1 = p1[0],
	        uy1 = p1[1],
	        w1 = p1[2],
	        dx = ux1 - ux0,
	        dy = uy1 - uy0,
	        d2 = dx * dx + dy * dy,
	        i,
	        S;
	    if (d2 < ε2) {
	      S = Math.log(w1 / w0) / ρ;
	      i = function (t) {
	        return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * t * S)];
	      };
	    } else {
	      var d1 = Math.sqrt(d2),
	          b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1),
	          b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1),
	          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
	          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
	      S = (r1 - r0) / ρ;
	      i = function (t) {
	        var s = t * S,
	            coshr0 = d3_cosh(r0),
	            u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));
	        return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0)];
	      };
	    }
	    i.duration = S * 1e3;
	    return i;
	  };
	  d3.behavior.zoom = function () {
	    var view = {
	      x: 0,
	      y: 0,
	      k: 1
	    },
	        translate0,
	        center0,
	        center,
	        size = [960, 500],
	        scaleExtent = d3_behavior_zoomInfinity,
	        duration = 250,
	        zooming = 0,
	        mousedown = "mousedown.zoom",
	        mousemove = "mousemove.zoom",
	        mouseup = "mouseup.zoom",
	        mousewheelTimer,
	        touchstart = "touchstart.zoom",
	        touchtime,
	        event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"),
	        x0,
	        x1,
	        y0,
	        y1;
	    if (!d3_behavior_zoomWheel) {
	      d3_behavior_zoomWheel = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function () {
	        return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);
	      }, "wheel") : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function () {
	        return d3.event.wheelDelta;
	      }, "mousewheel") : (d3_behavior_zoomDelta = function () {
	        return -d3.event.detail;
	      }, "MozMousePixelScroll");
	    }
	    function zoom(g) {
	      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted);
	    }
	    zoom.event = function (g) {
	      g.each(function () {
	        var dispatch = event.of(this, arguments),
	            view1 = view;
	        if (d3_transitionInheritId) {
	          d3.select(this).transition().each("start.zoom", function () {
	            view = this.__chart__ || {
	              x: 0,
	              y: 0,
	              k: 1
	            };
	            zoomstarted(dispatch);
	          }).tween("zoom:zoom", function () {
	            var dx = size[0],
	                dy = size[1],
	                cx = center0 ? center0[0] : dx / 2,
	                cy = center0 ? center0[1] : dy / 2,
	                i = d3.interpolateZoom([(cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k], [(cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k]);
	            return function (t) {
	              var l = i(t),
	                  k = dx / l[2];
	              this.__chart__ = view = {
	                x: cx - l[0] * k,
	                y: cy - l[1] * k,
	                k: k
	              };
	              zoomed(dispatch);
	            };
	          }).each("interrupt.zoom", function () {
	            zoomended(dispatch);
	          }).each("end.zoom", function () {
	            zoomended(dispatch);
	          });
	        } else {
	          this.__chart__ = view;
	          zoomstarted(dispatch);
	          zoomed(dispatch);
	          zoomended(dispatch);
	        }
	      });
	    };
	    zoom.translate = function (_) {
	      if (!arguments.length) return [view.x, view.y];
	      view = {
	        x: +_[0],
	        y: +_[1],
	        k: view.k
	      };
	      rescale();
	      return zoom;
	    };
	    zoom.scale = function (_) {
	      if (!arguments.length) return view.k;
	      view = {
	        x: view.x,
	        y: view.y,
	        k: null
	      };
	      scaleTo(+_);
	      rescale();
	      return zoom;
	    };
	    zoom.scaleExtent = function (_) {
	      if (!arguments.length) return scaleExtent;
	      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [+_[0], +_[1]];
	      return zoom;
	    };
	    zoom.center = function (_) {
	      if (!arguments.length) return center;
	      center = _ && [+_[0], +_[1]];
	      return zoom;
	    };
	    zoom.size = function (_) {
	      if (!arguments.length) return size;
	      size = _ && [+_[0], +_[1]];
	      return zoom;
	    };
	    zoom.duration = function (_) {
	      if (!arguments.length) return duration;
	      duration = +_;
	      return zoom;
	    };
	    zoom.x = function (z) {
	      if (!arguments.length) return x1;
	      x1 = z;
	      x0 = z.copy();
	      view = {
	        x: 0,
	        y: 0,
	        k: 1
	      };
	      return zoom;
	    };
	    zoom.y = function (z) {
	      if (!arguments.length) return y1;
	      y1 = z;
	      y0 = z.copy();
	      view = {
	        x: 0,
	        y: 0,
	        k: 1
	      };
	      return zoom;
	    };
	    function location(p) {
	      return [(p[0] - view.x) / view.k, (p[1] - view.y) / view.k];
	    }
	    function point(l) {
	      return [l[0] * view.k + view.x, l[1] * view.k + view.y];
	    }
	    function scaleTo(s) {
	      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
	    }
	    function translateTo(p, l) {
	      l = point(l);
	      view.x += p[0] - l[0];
	      view.y += p[1] - l[1];
	    }
	    function zoomTo(that, p, l, k) {
	      that.__chart__ = {
	        x: view.x,
	        y: view.y,
	        k: view.k
	      };
	      scaleTo(Math.pow(2, k));
	      translateTo(center0 = p, l);
	      that = d3.select(that);
	      if (duration > 0) that = that.transition().duration(duration);
	      that.call(zoom.event);
	    }
	    function rescale() {
	      if (x1) x1.domain(x0.range().map(function (x) {
	        return (x - view.x) / view.k;
	      }).map(x0.invert));
	      if (y1) y1.domain(y0.range().map(function (y) {
	        return (y - view.y) / view.k;
	      }).map(y0.invert));
	    }
	    function zoomstarted(dispatch) {
	      if (!zooming++) dispatch({
	        type: "zoomstart"
	      });
	    }
	    function zoomed(dispatch) {
	      rescale();
	      dispatch({
	        type: "zoom",
	        scale: view.k,
	        translate: [view.x, view.y]
	      });
	    }
	    function zoomended(dispatch) {
	      if (! --zooming) dispatch({
	        type: "zoomend"
	      }), center0 = null;
	    }
	    function mousedowned() {
	      var that = this,
	          dispatch = event.of(that, arguments),
	          dragged = 0,
	          subject = d3.select(d3_window(that)).on(mousemove, moved).on(mouseup, ended),
	          location0 = location(d3.mouse(that)),
	          dragRestore = d3_event_dragSuppress(that);
	      d3_selection_interrupt.call(that);
	      zoomstarted(dispatch);
	      function moved() {
	        dragged = 1;
	        translateTo(d3.mouse(that), location0);
	        zoomed(dispatch);
	      }
	      function ended() {
	        subject.on(mousemove, null).on(mouseup, null);
	        dragRestore(dragged);
	        zoomended(dispatch);
	      }
	    }
	    function touchstarted() {
	      var that = this,
	          dispatch = event.of(that, arguments),
	          locations0 = {},
	          distance0 = 0,
	          scale0,
	          zoomName = ".zoom-" + d3.event.changedTouches[0].identifier,
	          touchmove = "touchmove" + zoomName,
	          touchend = "touchend" + zoomName,
	          targets = [],
	          subject = d3.select(that),
	          dragRestore = d3_event_dragSuppress(that);
	      started();
	      zoomstarted(dispatch);
	      subject.on(mousedown, null).on(touchstart, started);
	      function relocate() {
	        var touches = d3.touches(that);
	        scale0 = view.k;
	        touches.forEach(function (t) {
	          if (t.identifier in locations0) locations0[t.identifier] = location(t);
	        });
	        return touches;
	      }
	      function started() {
	        var target = d3.event.target;
	        d3.select(target).on(touchmove, moved).on(touchend, ended);
	        targets.push(target);
	        var changed = d3.event.changedTouches;
	        for (var i = 0, n = changed.length; i < n; ++i) {
	          locations0[changed[i].identifier] = null;
	        }
	        var touches = relocate(),
	            now = Date.now();
	        if (touches.length === 1) {
	          if (now - touchtime < 500) {
	            var p = touches[0];
	            zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.k) / Math.LN2) + 1);
	            d3_eventPreventDefault();
	          }
	          touchtime = now;
	        } else if (touches.length > 1) {
	          var p = touches[0],
	              q = touches[1],
	              dx = p[0] - q[0],
	              dy = p[1] - q[1];
	          distance0 = dx * dx + dy * dy;
	        }
	      }
	      function moved() {
	        var touches = d3.touches(that),
	            p0,
	            l0,
	            p1,
	            l1;
	        d3_selection_interrupt.call(that);
	        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
	          p1 = touches[i];
	          if (l1 = locations0[p1.identifier]) {
	            if (l0) break;
	            p0 = p1, l0 = l1;
	          }
	        }
	        if (l1) {
	          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1,
	              scale1 = distance0 && Math.sqrt(distance1 / distance0);
	          p0 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
	          l0 = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
	          scaleTo(scale1 * scale0);
	        }
	        touchtime = null;
	        translateTo(p0, l0);
	        zoomed(dispatch);
	      }
	      function ended() {
	        if (d3.event.touches.length) {
	          var changed = d3.event.changedTouches;
	          for (var i = 0, n = changed.length; i < n; ++i) {
	            delete locations0[changed[i].identifier];
	          }
	          for (var identifier in locations0) {
	            return void relocate();
	          }
	        }
	        d3.selectAll(targets).on(zoomName, null);
	        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);
	        dragRestore();
	        zoomended(dispatch);
	      }
	    }
	    function mousewheeled() {
	      var dispatch = event.of(this, arguments);
	      if (mousewheelTimer) clearTimeout(mousewheelTimer);else d3_selection_interrupt.call(this), translate0 = location(center0 = center || d3.mouse(this)), zoomstarted(dispatch);
	      mousewheelTimer = setTimeout(function () {
	        mousewheelTimer = null;
	        zoomended(dispatch);
	      }, 50);
	      d3_eventPreventDefault();
	      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);
	      translateTo(center0, translate0);
	      zoomed(dispatch);
	    }
	    function dblclicked() {
	      var p = d3.mouse(this),
	          k = Math.log(view.k) / Math.LN2;
	      zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1);
	    }
	    return d3.rebind(zoom, event, "on");
	  };
	  var d3_behavior_zoomInfinity = [0, Infinity],
	      d3_behavior_zoomDelta,
	      d3_behavior_zoomWheel;
	  d3.color = d3_color;
	  function d3_color() {}
	  d3_color.prototype.toString = function () {
	    return this.rgb() + "";
	  };
	  d3.hsl = d3_hsl;
	  function d3_hsl(h, s, l) {
	    return this instanceof d3_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l);
	  }
	  var d3_hslPrototype = d3_hsl.prototype = new d3_color();
	  d3_hslPrototype.brighter = function (k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    return new d3_hsl(this.h, this.s, this.l / k);
	  };
	  d3_hslPrototype.darker = function (k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    return new d3_hsl(this.h, this.s, k * this.l);
	  };
	  d3_hslPrototype.rgb = function () {
	    return d3_hsl_rgb(this.h, this.s, this.l);
	  };
	  function d3_hsl_rgb(h, s, l) {
	    var m1, m2;
	    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
	    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
	    l = l < 0 ? 0 : l > 1 ? 1 : l;
	    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
	    m1 = 2 * l - m2;
	    function v(h) {
	      if (h > 360) h -= 360;else if (h < 0) h += 360;
	      if (h < 60) return m1 + (m2 - m1) * h / 60;
	      if (h < 180) return m2;
	      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
	      return m1;
	    }
	    function vv(h) {
	      return Math.round(v(h) * 255);
	    }
	    return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));
	  }
	  d3.hcl = d3_hcl;
	  function d3_hcl(h, c, l) {
	    return this instanceof d3_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l);
	  }
	  var d3_hclPrototype = d3_hcl.prototype = new d3_color();
	  d3_hclPrototype.brighter = function (k) {
	    return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
	  };
	  d3_hclPrototype.darker = function (k) {
	    return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
	  };
	  d3_hclPrototype.rgb = function () {
	    return d3_hcl_lab(this.h, this.c, this.l).rgb();
	  };
	  function d3_hcl_lab(h, c, l) {
	    if (isNaN(h)) h = 0;
	    if (isNaN(c)) c = 0;
	    return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
	  }
	  d3.lab = d3_lab;
	  function d3_lab(l, a, b) {
	    return this instanceof d3_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h, l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b);
	  }
	  var d3_lab_K = 18;
	  var d3_lab_X = .95047,
	      d3_lab_Y = 1,
	      d3_lab_Z = 1.08883;
	  var d3_labPrototype = d3_lab.prototype = new d3_color();
	  d3_labPrototype.brighter = function (k) {
	    return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
	  };
	  d3_labPrototype.darker = function (k) {
	    return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
	  };
	  d3_labPrototype.rgb = function () {
	    return d3_lab_rgb(this.l, this.a, this.b);
	  };
	  function d3_lab_rgb(l, a, b) {
	    var y = (l + 16) / 116,
	        x = y + a / 500,
	        z = y - b / 200;
	    x = d3_lab_xyz(x) * d3_lab_X;
	    y = d3_lab_xyz(y) * d3_lab_Y;
	    z = d3_lab_xyz(z) * d3_lab_Z;
	    return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
	  }
	  function d3_lab_hcl(l, a, b) {
	    return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(NaN, NaN, l);
	  }
	  function d3_lab_xyz(x) {
	    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
	  }
	  function d3_xyz_lab(x) {
	    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
	  }
	  function d3_xyz_rgb(r) {
	    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
	  }
	  d3.rgb = d3_rgb;
	  function d3_rgb(r, g, b) {
	    return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);
	  }
	  function d3_rgbNumber(value) {
	    return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
	  }
	  function d3_rgbString(value) {
	    return d3_rgbNumber(value) + "";
	  }
	  var d3_rgbPrototype = d3_rgb.prototype = new d3_color();
	  d3_rgbPrototype.brighter = function (k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    var r = this.r,
	        g = this.g,
	        b = this.b,
	        i = 30;
	    if (!r && !g && !b) return new d3_rgb(i, i, i);
	    if (r && r < i) r = i;
	    if (g && g < i) g = i;
	    if (b && b < i) b = i;
	    return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
	  };
	  d3_rgbPrototype.darker = function (k) {
	    k = Math.pow(.7, arguments.length ? k : 1);
	    return new d3_rgb(k * this.r, k * this.g, k * this.b);
	  };
	  d3_rgbPrototype.hsl = function () {
	    return d3_rgb_hsl(this.r, this.g, this.b);
	  };
	  d3_rgbPrototype.toString = function () {
	    return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
	  };
	  function d3_rgb_hex(v) {
	    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
	  }
	  function d3_rgb_parse(format, rgb, hsl) {
	    var r = 0,
	        g = 0,
	        b = 0,
	        m1,
	        m2,
	        color;
	    m1 = /([a-z]+)\((.*)\)/.exec(format = format.toLowerCase());
	    if (m1) {
	      m2 = m1[2].split(",");
	      switch (m1[1]) {
	        case "hsl":
	          {
	            return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
	          }

	        case "rgb":
	          {
	            return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
	          }
	      }
	    }
	    if (color = d3_rgb_names.get(format)) {
	      return rgb(color.r, color.g, color.b);
	    }
	    if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
	      if (format.length === 4) {
	        r = (color & 3840) >> 4;
	        r = r >> 4 | r;
	        g = color & 240;
	        g = g >> 4 | g;
	        b = color & 15;
	        b = b << 4 | b;
	      } else if (format.length === 7) {
	        r = (color & 16711680) >> 16;
	        g = (color & 65280) >> 8;
	        b = color & 255;
	      }
	    }
	    return rgb(r, g, b);
	  }
	  function d3_rgb_hsl(r, g, b) {
	    var min = Math.min(r /= 255, g /= 255, b /= 255),
	        max = Math.max(r, g, b),
	        d = max - min,
	        h,
	        s,
	        l = (max + min) / 2;
	    if (d) {
	      s = l < .5 ? d / (max + min) : d / (2 - max - min);
	      if (r == max) h = (g - b) / d + (g < b ? 6 : 0);else if (g == max) h = (b - r) / d + 2;else h = (r - g) / d + 4;
	      h *= 60;
	    } else {
	      h = NaN;
	      s = l > 0 && l < 1 ? 0 : h;
	    }
	    return new d3_hsl(h, s, l);
	  }
	  function d3_rgb_lab(r, g, b) {
	    r = d3_rgb_xyz(r);
	    g = d3_rgb_xyz(g);
	    b = d3_rgb_xyz(b);
	    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X),
	        y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y),
	        z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
	    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
	  }
	  function d3_rgb_xyz(r) {
	    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
	  }
	  function d3_rgb_parseNumber(c) {
	    var f = parseFloat(c);
	    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
	  }
	  var d3_rgb_names = d3.map({
	    aliceblue: 15792383,
	    antiquewhite: 16444375,
	    aqua: 65535,
	    aquamarine: 8388564,
	    azure: 15794175,
	    beige: 16119260,
	    bisque: 16770244,
	    black: 0,
	    blanchedalmond: 16772045,
	    blue: 255,
	    blueviolet: 9055202,
	    brown: 10824234,
	    burlywood: 14596231,
	    cadetblue: 6266528,
	    chartreuse: 8388352,
	    chocolate: 13789470,
	    coral: 16744272,
	    cornflowerblue: 6591981,
	    cornsilk: 16775388,
	    crimson: 14423100,
	    cyan: 65535,
	    darkblue: 139,
	    darkcyan: 35723,
	    darkgoldenrod: 12092939,
	    darkgray: 11119017,
	    darkgreen: 25600,
	    darkgrey: 11119017,
	    darkkhaki: 12433259,
	    darkmagenta: 9109643,
	    darkolivegreen: 5597999,
	    darkorange: 16747520,
	    darkorchid: 10040012,
	    darkred: 9109504,
	    darksalmon: 15308410,
	    darkseagreen: 9419919,
	    darkslateblue: 4734347,
	    darkslategray: 3100495,
	    darkslategrey: 3100495,
	    darkturquoise: 52945,
	    darkviolet: 9699539,
	    deeppink: 16716947,
	    deepskyblue: 49151,
	    dimgray: 6908265,
	    dimgrey: 6908265,
	    dodgerblue: 2003199,
	    firebrick: 11674146,
	    floralwhite: 16775920,
	    forestgreen: 2263842,
	    fuchsia: 16711935,
	    gainsboro: 14474460,
	    ghostwhite: 16316671,
	    gold: 16766720,
	    goldenrod: 14329120,
	    gray: 8421504,
	    green: 32768,
	    greenyellow: 11403055,
	    grey: 8421504,
	    honeydew: 15794160,
	    hotpink: 16738740,
	    indianred: 13458524,
	    indigo: 4915330,
	    ivory: 16777200,
	    khaki: 15787660,
	    lavender: 15132410,
	    lavenderblush: 16773365,
	    lawngreen: 8190976,
	    lemonchiffon: 16775885,
	    lightblue: 11393254,
	    lightcoral: 15761536,
	    lightcyan: 14745599,
	    lightgoldenrodyellow: 16448210,
	    lightgray: 13882323,
	    lightgreen: 9498256,
	    lightgrey: 13882323,
	    lightpink: 16758465,
	    lightsalmon: 16752762,
	    lightseagreen: 2142890,
	    lightskyblue: 8900346,
	    lightslategray: 7833753,
	    lightslategrey: 7833753,
	    lightsteelblue: 11584734,
	    lightyellow: 16777184,
	    lime: 65280,
	    limegreen: 3329330,
	    linen: 16445670,
	    magenta: 16711935,
	    maroon: 8388608,
	    mediumaquamarine: 6737322,
	    mediumblue: 205,
	    mediumorchid: 12211667,
	    mediumpurple: 9662683,
	    mediumseagreen: 3978097,
	    mediumslateblue: 8087790,
	    mediumspringgreen: 64154,
	    mediumturquoise: 4772300,
	    mediumvioletred: 13047173,
	    midnightblue: 1644912,
	    mintcream: 16121850,
	    mistyrose: 16770273,
	    moccasin: 16770229,
	    navajowhite: 16768685,
	    navy: 128,
	    oldlace: 16643558,
	    olive: 8421376,
	    olivedrab: 7048739,
	    orange: 16753920,
	    orangered: 16729344,
	    orchid: 14315734,
	    palegoldenrod: 15657130,
	    palegreen: 10025880,
	    paleturquoise: 11529966,
	    palevioletred: 14381203,
	    papayawhip: 16773077,
	    peachpuff: 16767673,
	    peru: 13468991,
	    pink: 16761035,
	    plum: 14524637,
	    powderblue: 11591910,
	    purple: 8388736,
	    rebeccapurple: 6697881,
	    red: 16711680,
	    rosybrown: 12357519,
	    royalblue: 4286945,
	    saddlebrown: 9127187,
	    salmon: 16416882,
	    sandybrown: 16032864,
	    seagreen: 3050327,
	    seashell: 16774638,
	    sienna: 10506797,
	    silver: 12632256,
	    skyblue: 8900331,
	    slateblue: 6970061,
	    slategray: 7372944,
	    slategrey: 7372944,
	    snow: 16775930,
	    springgreen: 65407,
	    steelblue: 4620980,
	    tan: 13808780,
	    teal: 32896,
	    thistle: 14204888,
	    tomato: 16737095,
	    turquoise: 4251856,
	    violet: 15631086,
	    wheat: 16113331,
	    white: 16777215,
	    whitesmoke: 16119285,
	    yellow: 16776960,
	    yellowgreen: 10145074
	  });
	  d3_rgb_names.forEach(function (key, value) {
	    d3_rgb_names.set(key, d3_rgbNumber(value));
	  });
	  function d3_functor(v) {
	    return typeof v === "function" ? v : function () {
	      return v;
	    };
	  }
	  d3.functor = d3_functor;
	  d3.xhr = d3_xhrType(d3_identity);
	  function d3_xhrType(response) {
	    return function (url, mimeType, callback) {
	      if (arguments.length === 2 && typeof mimeType === "function") callback = mimeType, mimeType = null;
	      return d3_xhr(url, mimeType, response, callback);
	    };
	  }
	  function d3_xhr(url, mimeType, response, callback) {
	    var xhr = {},
	        dispatch = d3.dispatch("beforesend", "progress", "load", "error"),
	        headers = {},
	        request = new XMLHttpRequest(),
	        responseType = null;
	    if (this.XDomainRequest && !("withCredentials" in request) && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();
	    "onload" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function () {
	      request.readyState > 3 && respond();
	    };
	    function respond() {
	      var status = request.status,
	          result;
	      if (!status && d3_xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
	        try {
	          result = response.call(xhr, request);
	        } catch (e) {
	          dispatch.error.call(xhr, e);
	          return;
	        }
	        dispatch.load.call(xhr, result);
	      } else {
	        dispatch.error.call(xhr, request);
	      }
	    }
	    request.onprogress = function (event) {
	      var o = d3.event;
	      d3.event = event;
	      try {
	        dispatch.progress.call(xhr, request);
	      } finally {
	        d3.event = o;
	      }
	    };
	    xhr.header = function (name, value) {
	      name = (name + "").toLowerCase();
	      if (arguments.length < 2) return headers[name];
	      if (value == null) delete headers[name];else headers[name] = value + "";
	      return xhr;
	    };
	    xhr.mimeType = function (value) {
	      if (!arguments.length) return mimeType;
	      mimeType = value == null ? null : value + "";
	      return xhr;
	    };
	    xhr.responseType = function (value) {
	      if (!arguments.length) return responseType;
	      responseType = value;
	      return xhr;
	    };
	    xhr.response = function (value) {
	      response = value;
	      return xhr;
	    };
	    ["get", "post"].forEach(function (method) {
	      xhr[method] = function () {
	        return xhr.send.apply(xhr, [method].concat(d3_array(arguments)));
	      };
	    });
	    xhr.send = function (method, data, callback) {
	      if (arguments.length === 2 && typeof data === "function") callback = data, data = null;
	      request.open(method, url, true);
	      if (mimeType != null && !("accept" in headers)) headers["accept"] = mimeType + ",*/*";
	      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);
	      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
	      if (responseType != null) request.responseType = responseType;
	      if (callback != null) xhr.on("error", callback).on("load", function (request) {
	        callback(null, request);
	      });
	      dispatch.beforesend.call(xhr, request);
	      request.send(data == null ? null : data);
	      return xhr;
	    };
	    xhr.abort = function () {
	      request.abort();
	      return xhr;
	    };
	    d3.rebind(xhr, dispatch, "on");
	    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));
	  }
	  function d3_xhr_fixCallback(callback) {
	    return callback.length === 1 ? function (error, request) {
	      callback(error == null ? request : null);
	    } : callback;
	  }
	  function d3_xhrHasResponse(request) {
	    var type = request.responseType;
	    return type && type !== "text" ? request.response : request.responseText;
	  }
	  d3.dsv = function (delimiter, mimeType) {
	    var reFormat = new RegExp('["' + delimiter + "\n]"),
	        delimiterCode = delimiter.charCodeAt(0);
	    function dsv(url, row, callback) {
	      if (arguments.length < 3) callback = row, row = null;
	      var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback);
	      xhr.row = function (_) {
	        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;
	      };
	      return xhr;
	    }
	    function response(request) {
	      return dsv.parse(request.responseText);
	    }
	    function typedResponse(f) {
	      return function (request) {
	        return dsv.parse(request.responseText, f);
	      };
	    }
	    dsv.parse = function (text, f) {
	      var o;
	      return dsv.parseRows(text, function (row, i) {
	        if (o) return o(row, i - 1);
	        var a = new Function("d", "return {" + row.map(function (name, i) {
	          return JSON.stringify(name) + ": d[" + i + "]";
	        }).join(",") + "}");
	        o = f ? function (row, i) {
	          return f(a(row), i);
	        } : a;
	      });
	    };
	    dsv.parseRows = function (text, f) {
	      var EOL = {},
	          EOF = {},
	          rows = [],
	          N = text.length,
	          I = 0,
	          n = 0,
	          t,
	          eol;
	      function token() {
	        if (I >= N) return EOF;
	        if (eol) return eol = false, EOL;
	        var j = I;
	        if (text.charCodeAt(j) === 34) {
	          var i = j;
	          while (i++ < N) {
	            if (text.charCodeAt(i) === 34) {
	              if (text.charCodeAt(i + 1) !== 34) break;
	              ++i;
	            }
	          }
	          I = i + 2;
	          var c = text.charCodeAt(i + 1);
	          if (c === 13) {
	            eol = true;
	            if (text.charCodeAt(i + 2) === 10) ++I;
	          } else if (c === 10) {
	            eol = true;
	          }
	          return text.slice(j + 1, i).replace(/""/g, '"');
	        }
	        while (I < N) {
	          var c = text.charCodeAt(I++),
	              k = 1;
	          if (c === 10) eol = true;else if (c === 13) {
	            eol = true;
	            if (text.charCodeAt(I) === 10) ++I, ++k;
	          } else if (c !== delimiterCode) continue;
	          return text.slice(j, I - k);
	        }
	        return text.slice(j);
	      }
	      while ((t = token()) !== EOF) {
	        var a = [];
	        while (t !== EOL && t !== EOF) {
	          a.push(t);
	          t = token();
	        }
	        if (f && (a = f(a, n++)) == null) continue;
	        rows.push(a);
	      }
	      return rows;
	    };
	    dsv.format = function (rows) {
	      if (Array.isArray(rows[0])) return dsv.formatRows(rows);
	      var fieldSet = new d3_Set(),
	          fields = [];
	      rows.forEach(function (row) {
	        for (var field in row) {
	          if (!fieldSet.has(field)) {
	            fields.push(fieldSet.add(field));
	          }
	        }
	      });
	      return [fields.map(formatValue).join(delimiter)].concat(rows.map(function (row) {
	        return fields.map(function (field) {
	          return formatValue(row[field]);
	        }).join(delimiter);
	      })).join("\n");
	    };
	    dsv.formatRows = function (rows) {
	      return rows.map(formatRow).join("\n");
	    };
	    function formatRow(row) {
	      return row.map(formatValue).join(delimiter);
	    }
	    function formatValue(text) {
	      return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text;
	    }
	    return dsv;
	  };
	  d3.csv = d3.dsv(",", "text/csv");
	  d3.tsv = d3.dsv("	", "text/tab-separated-values");
	  var d3_timer_queueHead,
	      d3_timer_queueTail,
	      d3_timer_interval,
	      d3_timer_timeout,
	      d3_timer_frame = this[d3_vendorSymbol(this, "requestAnimationFrame")] || function (callback) {
	    setTimeout(callback, 17);
	  };
	  d3.timer = function () {
	    d3_timer.apply(this, arguments);
	  };
	  function d3_timer(callback, delay, then) {
	    var n = arguments.length;
	    if (n < 2) delay = 0;
	    if (n < 3) then = Date.now();
	    var time = then + delay,
	        timer = {
	      c: callback,
	      t: time,
	      n: null
	    };
	    if (d3_timer_queueTail) d3_timer_queueTail.n = timer;else d3_timer_queueHead = timer;
	    d3_timer_queueTail = timer;
	    if (!d3_timer_interval) {
	      d3_timer_timeout = clearTimeout(d3_timer_timeout);
	      d3_timer_interval = 1;
	      d3_timer_frame(d3_timer_step);
	    }
	    return timer;
	  }
	  function d3_timer_step() {
	    var now = d3_timer_mark(),
	        delay = d3_timer_sweep() - now;
	    if (delay > 24) {
	      if (isFinite(delay)) {
	        clearTimeout(d3_timer_timeout);
	        d3_timer_timeout = setTimeout(d3_timer_step, delay);
	      }
	      d3_timer_interval = 0;
	    } else {
	      d3_timer_interval = 1;
	      d3_timer_frame(d3_timer_step);
	    }
	  }
	  d3.timer.flush = function () {
	    d3_timer_mark();
	    d3_timer_sweep();
	  };
	  function d3_timer_mark() {
	    var now = Date.now(),
	        timer = d3_timer_queueHead;
	    while (timer) {
	      if (now >= timer.t && timer.c(now - timer.t)) timer.c = null;
	      timer = timer.n;
	    }
	    return now;
	  }
	  function d3_timer_sweep() {
	    var t0,
	        t1 = d3_timer_queueHead,
	        time = Infinity;
	    while (t1) {
	      if (t1.c) {
	        if (t1.t < time) time = t1.t;
	        t1 = (t0 = t1).n;
	      } else {
	        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
	      }
	    }
	    d3_timer_queueTail = t0;
	    return time;
	  }
	  function d3_format_precision(x, p) {
	    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
	  }
	  d3.round = function (x, n) {
	    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
	  };
	  var d3_formatPrefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"].map(d3_formatPrefix);
	  d3.formatPrefix = function (value, precision) {
	    var i = 0;
	    if (value = +value) {
	      if (value < 0) value *= -1;
	      if (precision) value = d3.round(value, d3_format_precision(value, precision));
	      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
	      i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
	    }
	    return d3_formatPrefixes[8 + i / 3];
	  };
	  function d3_formatPrefix(d, i) {
	    var k = Math.pow(10, abs(8 - i) * 3);
	    return {
	      scale: i > 8 ? function (d) {
	        return d / k;
	      } : function (d) {
	        return d * k;
	      },
	      symbol: d
	    };
	  }
	  function d3_locale_numberFormat(locale) {
	    var locale_decimal = locale.decimal,
	        locale_thousands = locale.thousands,
	        locale_grouping = locale.grouping,
	        locale_currency = locale.currency,
	        formatGroup = locale_grouping && locale_thousands ? function (value, width) {
	      var i = value.length,
	          t = [],
	          j = 0,
	          g = locale_grouping[0],
	          length = 0;
	      while (i > 0 && g > 0) {
	        if (length + g + 1 > width) g = Math.max(1, width - length);
	        t.push(value.substring(i -= g, i + g));
	        if ((length += g + 1) > width) break;
	        g = locale_grouping[j = (j + 1) % locale_grouping.length];
	      }
	      return t.reverse().join(locale_thousands);
	    } : d3_identity;
	    return function (specifier) {
	      var match = d3_format_re.exec(specifier),
	          fill = match[1] || " ",
	          align = match[2] || ">",
	          sign = match[3] || "-",
	          symbol = match[4] || "",
	          zfill = match[5],
	          width = +match[6],
	          comma = match[7],
	          precision = match[8],
	          type = match[9],
	          scale = 1,
	          prefix = "",
	          suffix = "",
	          integer = false,
	          exponent = true;
	      if (precision) precision = +precision.substring(1);
	      if (zfill || fill === "0" && align === "=") {
	        zfill = fill = "0";
	        align = "=";
	      }
	      switch (type) {
	        case "n":
	          comma = true;
	          type = "g";
	          break;

	        case "%":
	          scale = 100;
	          suffix = "%";
	          type = "f";
	          break;

	        case "p":
	          scale = 100;
	          suffix = "%";
	          type = "r";
	          break;

	        case "b":
	        case "o":
	        case "x":
	        case "X":
	          if (symbol === "#") prefix = "0" + type.toLowerCase();

	        case "c":
	          exponent = false;

	        case "d":
	          integer = true;
	          precision = 0;
	          break;

	        case "s":
	          scale = -1;
	          type = "r";
	          break;
	      }
	      if (symbol === "$") prefix = locale_currency[0], suffix = locale_currency[1];
	      if (type == "r" && !precision) type = "g";
	      if (precision != null) {
	        if (type == "g") precision = Math.max(1, Math.min(21, precision));else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
	      }
	      type = d3_format_types.get(type) || d3_format_typeDefault;
	      var zcomma = zfill && comma;
	      return function (value) {
	        var fullSuffix = suffix;
	        if (integer && value % 1) return "";
	        var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign === "-" ? "" : sign;
	        if (scale < 0) {
	          var unit = d3.formatPrefix(value, precision);
	          value = unit.scale(value);
	          fullSuffix = unit.symbol + suffix;
	        } else {
	          value *= scale;
	        }
	        value = type(value, precision);
	        var i = value.lastIndexOf("."),
	            before,
	            after;
	        if (i < 0) {
	          var j = exponent ? value.lastIndexOf("e") : -1;
	          if (j < 0) before = value, after = "";else before = value.substring(0, j), after = value.substring(j);
	        } else {
	          before = value.substring(0, i);
	          after = locale_decimal + value.substring(i + 1);
	        }
	        if (!zfill && comma) before = formatGroup(before, Infinity);
	        var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length),
	            padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
	        if (zcomma) before = formatGroup(padding + before, padding.length ? width - after.length : Infinity);
	        negative += prefix;
	        value = before + after;
	        return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;
	      };
	    };
	  }
	  var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
	  var d3_format_types = d3.map({
	    b: function (x) {
	      return x.toString(2);
	    },
	    c: function (x) {
	      return String.fromCharCode(x);
	    },
	    o: function (x) {
	      return x.toString(8);
	    },
	    x: function (x) {
	      return x.toString(16);
	    },
	    X: function (x) {
	      return x.toString(16).toUpperCase();
	    },
	    g: function (x, p) {
	      return x.toPrecision(p);
	    },
	    e: function (x, p) {
	      return x.toExponential(p);
	    },
	    f: function (x, p) {
	      return x.toFixed(p);
	    },
	    r: function (x, p) {
	      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));
	    }
	  });
	  function d3_format_typeDefault(x) {
	    return x + "";
	  }
	  var d3_time = d3.time = {},
	      d3_date = Date;
	  function d3_date_utc() {
	    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
	  }
	  d3_date_utc.prototype = {
	    getDate: function () {
	      return this._.getUTCDate();
	    },
	    getDay: function () {
	      return this._.getUTCDay();
	    },
	    getFullYear: function () {
	      return this._.getUTCFullYear();
	    },
	    getHours: function () {
	      return this._.getUTCHours();
	    },
	    getMilliseconds: function () {
	      return this._.getUTCMilliseconds();
	    },
	    getMinutes: function () {
	      return this._.getUTCMinutes();
	    },
	    getMonth: function () {
	      return this._.getUTCMonth();
	    },
	    getSeconds: function () {
	      return this._.getUTCSeconds();
	    },
	    getTime: function () {
	      return this._.getTime();
	    },
	    getTimezoneOffset: function () {
	      return 0;
	    },
	    valueOf: function () {
	      return this._.valueOf();
	    },
	    setDate: function () {
	      d3_time_prototype.setUTCDate.apply(this._, arguments);
	    },
	    setDay: function () {
	      d3_time_prototype.setUTCDay.apply(this._, arguments);
	    },
	    setFullYear: function () {
	      d3_time_prototype.setUTCFullYear.apply(this._, arguments);
	    },
	    setHours: function () {
	      d3_time_prototype.setUTCHours.apply(this._, arguments);
	    },
	    setMilliseconds: function () {
	      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);
	    },
	    setMinutes: function () {
	      d3_time_prototype.setUTCMinutes.apply(this._, arguments);
	    },
	    setMonth: function () {
	      d3_time_prototype.setUTCMonth.apply(this._, arguments);
	    },
	    setSeconds: function () {
	      d3_time_prototype.setUTCSeconds.apply(this._, arguments);
	    },
	    setTime: function () {
	      d3_time_prototype.setTime.apply(this._, arguments);
	    }
	  };
	  var d3_time_prototype = Date.prototype;
	  function d3_time_interval(local, step, number) {
	    function round(date) {
	      var d0 = local(date),
	          d1 = offset(d0, 1);
	      return date - d0 < d1 - date ? d0 : d1;
	    }
	    function ceil(date) {
	      step(date = local(new d3_date(date - 1)), 1);
	      return date;
	    }
	    function offset(date, k) {
	      step(date = new d3_date(+date), k);
	      return date;
	    }
	    function range(t0, t1, dt) {
	      var time = ceil(t0),
	          times = [];
	      if (dt > 1) {
	        while (time < t1) {
	          if (!(number(time) % dt)) times.push(new Date(+time));
	          step(time, 1);
	        }
	      } else {
	        while (time < t1) times.push(new Date(+time)), step(time, 1);
	      }
	      return times;
	    }
	    function range_utc(t0, t1, dt) {
	      try {
	        d3_date = d3_date_utc;
	        var utc = new d3_date_utc();
	        utc._ = t0;
	        return range(utc, t1, dt);
	      } finally {
	        d3_date = Date;
	      }
	    }
	    local.floor = local;
	    local.round = round;
	    local.ceil = ceil;
	    local.offset = offset;
	    local.range = range;
	    var utc = local.utc = d3_time_interval_utc(local);
	    utc.floor = utc;
	    utc.round = d3_time_interval_utc(round);
	    utc.ceil = d3_time_interval_utc(ceil);
	    utc.offset = d3_time_interval_utc(offset);
	    utc.range = range_utc;
	    return local;
	  }
	  function d3_time_interval_utc(method) {
	    return function (date, k) {
	      try {
	        d3_date = d3_date_utc;
	        var utc = new d3_date_utc();
	        utc._ = date;
	        return method(utc, k)._;
	      } finally {
	        d3_date = Date;
	      }
	    };
	  }
	  d3_time.year = d3_time_interval(function (date) {
	    date = d3_time.day(date);
	    date.setMonth(0, 1);
	    return date;
	  }, function (date, offset) {
	    date.setFullYear(date.getFullYear() + offset);
	  }, function (date) {
	    return date.getFullYear();
	  });
	  d3_time.years = d3_time.year.range;
	  d3_time.years.utc = d3_time.year.utc.range;
	  d3_time.day = d3_time_interval(function (date) {
	    var day = new d3_date(2e3, 0);
	    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
	    return day;
	  }, function (date, offset) {
	    date.setDate(date.getDate() + offset);
	  }, function (date) {
	    return date.getDate() - 1;
	  });
	  d3_time.days = d3_time.day.range;
	  d3_time.days.utc = d3_time.day.utc.range;
	  d3_time.dayOfYear = function (date) {
	    var year = d3_time.year(date);
	    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
	  };
	  ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].forEach(function (day, i) {
	    i = 7 - i;
	    var interval = d3_time[day] = d3_time_interval(function (date) {
	      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
	      return date;
	    }, function (date, offset) {
	      date.setDate(date.getDate() + Math.floor(offset) * 7);
	    }, function (date) {
	      var day = d3_time.year(date).getDay();
	      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
	    });
	    d3_time[day + "s"] = interval.range;
	    d3_time[day + "s"].utc = interval.utc.range;
	    d3_time[day + "OfYear"] = function (date) {
	      var day = d3_time.year(date).getDay();
	      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);
	    };
	  });
	  d3_time.week = d3_time.sunday;
	  d3_time.weeks = d3_time.sunday.range;
	  d3_time.weeks.utc = d3_time.sunday.utc.range;
	  d3_time.weekOfYear = d3_time.sundayOfYear;
	  function d3_locale_timeFormat(locale) {
	    var locale_dateTime = locale.dateTime,
	        locale_date = locale.date,
	        locale_time = locale.time,
	        locale_periods = locale.periods,
	        locale_days = locale.days,
	        locale_shortDays = locale.shortDays,
	        locale_months = locale.months,
	        locale_shortMonths = locale.shortMonths;
	    function d3_time_format(template) {
	      var n = template.length;
	      function format(date) {
	        var string = [],
	            i = -1,
	            j = 0,
	            c,
	            p,
	            f;
	        while (++i < n) {
	          if (template.charCodeAt(i) === 37) {
	            string.push(template.slice(j, i));
	            if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
	            if (f = d3_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
	            string.push(c);
	            j = i + 1;
	          }
	        }
	        string.push(template.slice(j, i));
	        return string.join("");
	      }
	      format.parse = function (string) {
	        var d = {
	          y: 1900,
	          m: 0,
	          d: 1,
	          H: 0,
	          M: 0,
	          S: 0,
	          L: 0,
	          Z: null
	        },
	            i = d3_time_parse(d, template, string, 0);
	        if (i != string.length) return null;
	        if ("p" in d) d.H = d.H % 12 + d.p * 12;
	        var localZ = d.Z != null && d3_date !== d3_date_utc,
	            date = new (localZ ? d3_date_utc : d3_date)();
	        if ("j" in d) date.setFullYear(d.y, 0, d.j);else if ("W" in d || "U" in d) {
	          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
	          date.setFullYear(d.y, 0, 1);
	          date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
	        } else date.setFullYear(d.y, d.m, d.d);
	        date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L);
	        return localZ ? date._ : date;
	      };
	      format.toString = function () {
	        return template;
	      };
	      return format;
	    }
	    function d3_time_parse(date, template, string, j) {
	      var c,
	          p,
	          t,
	          i = 0,
	          n = template.length,
	          m = string.length;
	      while (i < n) {
	        if (j >= m) return -1;
	        c = template.charCodeAt(i++);
	        if (c === 37) {
	          t = template.charAt(i++);
	          p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];
	          if (!p || (j = p(date, string, j)) < 0) return -1;
	        } else if (c != string.charCodeAt(j++)) {
	          return -1;
	        }
	      }
	      return j;
	    }
	    d3_time_format.utc = function (template) {
	      var local = d3_time_format(template);
	      function format(date) {
	        try {
	          d3_date = d3_date_utc;
	          var utc = new d3_date();
	          utc._ = date;
	          return local(utc);
	        } finally {
	          d3_date = Date;
	        }
	      }
	      format.parse = function (string) {
	        try {
	          d3_date = d3_date_utc;
	          var date = local.parse(string);
	          return date && date._;
	        } finally {
	          d3_date = Date;
	        }
	      };
	      format.toString = local.toString;
	      return format;
	    };
	    d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;
	    var d3_time_periodLookup = d3.map(),
	        d3_time_dayRe = d3_time_formatRe(locale_days),
	        d3_time_dayLookup = d3_time_formatLookup(locale_days),
	        d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays),
	        d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays),
	        d3_time_monthRe = d3_time_formatRe(locale_months),
	        d3_time_monthLookup = d3_time_formatLookup(locale_months),
	        d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths),
	        d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);
	    locale_periods.forEach(function (p, i) {
	      d3_time_periodLookup.set(p.toLowerCase(), i);
	    });
	    var d3_time_formats = {
	      a: function (d) {
	        return locale_shortDays[d.getDay()];
	      },
	      A: function (d) {
	        return locale_days[d.getDay()];
	      },
	      b: function (d) {
	        return locale_shortMonths[d.getMonth()];
	      },
	      B: function (d) {
	        return locale_months[d.getMonth()];
	      },
	      c: d3_time_format(locale_dateTime),
	      d: function (d, p) {
	        return d3_time_formatPad(d.getDate(), p, 2);
	      },
	      e: function (d, p) {
	        return d3_time_formatPad(d.getDate(), p, 2);
	      },
	      H: function (d, p) {
	        return d3_time_formatPad(d.getHours(), p, 2);
	      },
	      I: function (d, p) {
	        return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);
	      },
	      j: function (d, p) {
	        return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);
	      },
	      L: function (d, p) {
	        return d3_time_formatPad(d.getMilliseconds(), p, 3);
	      },
	      m: function (d, p) {
	        return d3_time_formatPad(d.getMonth() + 1, p, 2);
	      },
	      M: function (d, p) {
	        return d3_time_formatPad(d.getMinutes(), p, 2);
	      },
	      p: function (d) {
	        return locale_periods[+(d.getHours() >= 12)];
	      },
	      S: function (d, p) {
	        return d3_time_formatPad(d.getSeconds(), p, 2);
	      },
	      U: function (d, p) {
	        return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);
	      },
	      w: function (d) {
	        return d.getDay();
	      },
	      W: function (d, p) {
	        return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);
	      },
	      x: d3_time_format(locale_date),
	      X: d3_time_format(locale_time),
	      y: function (d, p) {
	        return d3_time_formatPad(d.getFullYear() % 100, p, 2);
	      },
	      Y: function (d, p) {
	        return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);
	      },
	      Z: d3_time_zone,
	      "%": function () {
	        return "%";
	      }
	    };
	    var d3_time_parsers = {
	      a: d3_time_parseWeekdayAbbrev,
	      A: d3_time_parseWeekday,
	      b: d3_time_parseMonthAbbrev,
	      B: d3_time_parseMonth,
	      c: d3_time_parseLocaleFull,
	      d: d3_time_parseDay,
	      e: d3_time_parseDay,
	      H: d3_time_parseHour24,
	      I: d3_time_parseHour24,
	      j: d3_time_parseDayOfYear,
	      L: d3_time_parseMilliseconds,
	      m: d3_time_parseMonthNumber,
	      M: d3_time_parseMinutes,
	      p: d3_time_parseAmPm,
	      S: d3_time_parseSeconds,
	      U: d3_time_parseWeekNumberSunday,
	      w: d3_time_parseWeekdayNumber,
	      W: d3_time_parseWeekNumberMonday,
	      x: d3_time_parseLocaleDate,
	      X: d3_time_parseLocaleTime,
	      y: d3_time_parseYear,
	      Y: d3_time_parseFullYear,
	      Z: d3_time_parseZone,
	      "%": d3_time_parseLiteralPercent
	    };
	    function d3_time_parseWeekdayAbbrev(date, string, i) {
	      d3_time_dayAbbrevRe.lastIndex = 0;
	      var n = d3_time_dayAbbrevRe.exec(string.slice(i));
	      return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseWeekday(date, string, i) {
	      d3_time_dayRe.lastIndex = 0;
	      var n = d3_time_dayRe.exec(string.slice(i));
	      return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseMonthAbbrev(date, string, i) {
	      d3_time_monthAbbrevRe.lastIndex = 0;
	      var n = d3_time_monthAbbrevRe.exec(string.slice(i));
	      return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseMonth(date, string, i) {
	      d3_time_monthRe.lastIndex = 0;
	      var n = d3_time_monthRe.exec(string.slice(i));
	      return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
	    }
	    function d3_time_parseLocaleFull(date, string, i) {
	      return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
	    }
	    function d3_time_parseLocaleDate(date, string, i) {
	      return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
	    }
	    function d3_time_parseLocaleTime(date, string, i) {
	      return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
	    }
	    function d3_time_parseAmPm(date, string, i) {
	      var n = d3_time_periodLookup.get(string.slice(i, i += 2).toLowerCase());
	      return n == null ? -1 : (date.p = n, i);
	    }
	    return d3_time_format;
	  }
	  var d3_time_formatPads = {
	    "-": "",
	    _: " ",
	    "0": "0"
	  },
	      d3_time_numberRe = /^\s*\d+/,
	      d3_time_percentRe = /^%/;
	  function d3_time_formatPad(value, fill, width) {
	    var sign = value < 0 ? "-" : "",
	        string = (sign ? -value : value) + "",
	        length = string.length;
	    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	  }
	  function d3_time_formatRe(names) {
	    return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
	  }
	  function d3_time_formatLookup(names) {
	    var map = new d3_Map(),
	        i = -1,
	        n = names.length;
	    while (++i < n) map.set(names[i].toLowerCase(), i);
	    return map;
	  }
	  function d3_time_parseWeekdayNumber(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 1));
	    return n ? (date.w = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseWeekNumberSunday(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i));
	    return n ? (date.U = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseWeekNumberMonday(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i));
	    return n ? (date.W = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseFullYear(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 4));
	    return n ? (date.y = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseYear(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;
	  }
	  function d3_time_parseZone(date, string, i) {
	    return (/^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string, i + 5) : -1
	    );
	  }
	  function d3_time_expandYear(d) {
	    return d + (d > 68 ? 1900 : 2e3);
	  }
	  function d3_time_parseMonthNumber(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
	  }
	  function d3_time_parseDay(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.d = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseDayOfYear(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
	    return n ? (date.j = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseHour24(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.H = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseMinutes(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.M = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseSeconds(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
	    return n ? (date.S = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_parseMilliseconds(date, string, i) {
	    d3_time_numberRe.lastIndex = 0;
	    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
	    return n ? (date.L = +n[0], i + n[0].length) : -1;
	  }
	  function d3_time_zone(d) {
	    var z = d.getTimezoneOffset(),
	        zs = z > 0 ? "-" : "+",
	        zh = abs(z) / 60 | 0,
	        zm = abs(z) % 60;
	    return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
	  }
	  function d3_time_parseLiteralPercent(date, string, i) {
	    d3_time_percentRe.lastIndex = 0;
	    var n = d3_time_percentRe.exec(string.slice(i, i + 1));
	    return n ? i + n[0].length : -1;
	  }
	  function d3_time_formatMulti(formats) {
	    var n = formats.length,
	        i = -1;
	    while (++i < n) formats[i][0] = this(formats[i][0]);
	    return function (date) {
	      var i = 0,
	          f = formats[i];
	      while (!f[1](date)) f = formats[++i];
	      return f[0](date);
	    };
	  }
	  d3.locale = function (locale) {
	    return {
	      numberFormat: d3_locale_numberFormat(locale),
	      timeFormat: d3_locale_timeFormat(locale)
	    };
	  };
	  var d3_locale_enUS = d3.locale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [3],
	    currency: ["$", ""],
	    dateTime: "%a %b %e %X %Y",
	    date: "%m/%d/%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	  });
	  d3.format = d3_locale_enUS.numberFormat;
	  d3.geo = {};
	  function d3_adder() {}
	  d3_adder.prototype = {
	    s: 0,
	    t: 0,
	    add: function (y) {
	      d3_adderSum(y, this.t, d3_adderTemp);
	      d3_adderSum(d3_adderTemp.s, this.s, this);
	      if (this.s) this.t += d3_adderTemp.t;else this.s = d3_adderTemp.t;
	    },
	    reset: function () {
	      this.s = this.t = 0;
	    },
	    valueOf: function () {
	      return this.s;
	    }
	  };
	  var d3_adderTemp = new d3_adder();
	  function d3_adderSum(a, b, o) {
	    var x = o.s = a + b,
	        bv = x - a,
	        av = x - bv;
	    o.t = a - av + (b - bv);
	  }
	  d3.geo.stream = function (object, listener) {
	    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
	      d3_geo_streamObjectType[object.type](object, listener);
	    } else {
	      d3_geo_streamGeometry(object, listener);
	    }
	  };
	  function d3_geo_streamGeometry(geometry, listener) {
	    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
	      d3_geo_streamGeometryType[geometry.type](geometry, listener);
	    }
	  }
	  var d3_geo_streamObjectType = {
	    Feature: function (feature, listener) {
	      d3_geo_streamGeometry(feature.geometry, listener);
	    },
	    FeatureCollection: function (object, listener) {
	      var features = object.features,
	          i = -1,
	          n = features.length;
	      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);
	    }
	  };
	  var d3_geo_streamGeometryType = {
	    Sphere: function (object, listener) {
	      listener.sphere();
	    },
	    Point: function (object, listener) {
	      object = object.coordinates;
	      listener.point(object[0], object[1], object[2]);
	    },
	    MultiPoint: function (object, listener) {
	      var coordinates = object.coordinates,
	          i = -1,
	          n = coordinates.length;
	      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);
	    },
	    LineString: function (object, listener) {
	      d3_geo_streamLine(object.coordinates, listener, 0);
	    },
	    MultiLineString: function (object, listener) {
	      var coordinates = object.coordinates,
	          i = -1,
	          n = coordinates.length;
	      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);
	    },
	    Polygon: function (object, listener) {
	      d3_geo_streamPolygon(object.coordinates, listener);
	    },
	    MultiPolygon: function (object, listener) {
	      var coordinates = object.coordinates,
	          i = -1,
	          n = coordinates.length;
	      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);
	    },
	    GeometryCollection: function (object, listener) {
	      var geometries = object.geometries,
	          i = -1,
	          n = geometries.length;
	      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);
	    }
	  };
	  function d3_geo_streamLine(coordinates, listener, closed) {
	    var i = -1,
	        n = coordinates.length - closed,
	        coordinate;
	    listener.lineStart();
	    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);
	    listener.lineEnd();
	  }
	  function d3_geo_streamPolygon(coordinates, listener) {
	    var i = -1,
	        n = coordinates.length;
	    listener.polygonStart();
	    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);
	    listener.polygonEnd();
	  }
	  d3.geo.area = function (object) {
	    d3_geo_areaSum = 0;
	    d3.geo.stream(object, d3_geo_area);
	    return d3_geo_areaSum;
	  };
	  var d3_geo_areaSum,
	      d3_geo_areaRingSum = new d3_adder();
	  var d3_geo_area = {
	    sphere: function () {
	      d3_geo_areaSum += 4 * π;
	    },
	    point: d3_noop,
	    lineStart: d3_noop,
	    lineEnd: d3_noop,
	    polygonStart: function () {
	      d3_geo_areaRingSum.reset();
	      d3_geo_area.lineStart = d3_geo_areaRingStart;
	    },
	    polygonEnd: function () {
	      var area = 2 * d3_geo_areaRingSum;
	      d3_geo_areaSum += area < 0 ? 4 * π + area : area;
	      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;
	    }
	  };
	  function d3_geo_areaRingStart() {
	    var λ00, φ00, λ0, cosφ0, sinφ0;
	    d3_geo_area.point = function (λ, φ) {
	      d3_geo_area.point = nextPoint;
	      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), sinφ0 = Math.sin(φ);
	    };
	    function nextPoint(λ, φ) {
	      λ *= d3_radians;
	      φ = φ * d3_radians / 2 + π / 4;
	      var dλ = λ - λ0,
	          sdλ = dλ >= 0 ? 1 : -1,
	          adλ = sdλ * dλ,
	          cosφ = Math.cos(φ),
	          sinφ = Math.sin(φ),
	          k = sinφ0 * sinφ,
	          u = cosφ0 * cosφ + k * Math.cos(adλ),
	          v = k * sdλ * Math.sin(adλ);
	      d3_geo_areaRingSum.add(Math.atan2(v, u));
	      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
	    }
	    d3_geo_area.lineEnd = function () {
	      nextPoint(λ00, φ00);
	    };
	  }
	  function d3_geo_cartesian(spherical) {
	    var λ = spherical[0],
	        φ = spherical[1],
	        cosφ = Math.cos(φ);
	    return [cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ)];
	  }
	  function d3_geo_cartesianDot(a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	  }
	  function d3_geo_cartesianCross(a, b) {
	    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
	  }
	  function d3_geo_cartesianAdd(a, b) {
	    a[0] += b[0];
	    a[1] += b[1];
	    a[2] += b[2];
	  }
	  function d3_geo_cartesianScale(vector, k) {
	    return [vector[0] * k, vector[1] * k, vector[2] * k];
	  }
	  function d3_geo_cartesianNormalize(d) {
	    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
	    d[0] /= l;
	    d[1] /= l;
	    d[2] /= l;
	  }
	  function d3_geo_spherical(cartesian) {
	    return [Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2])];
	  }
	  function d3_geo_sphericalEqual(a, b) {
	    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;
	  }
	  d3.geo.bounds = function () {
	    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;
	    var bound = {
	      point: point,
	      lineStart: lineStart,
	      lineEnd: lineEnd,
	      polygonStart: function () {
	        bound.point = ringPoint;
	        bound.lineStart = ringStart;
	        bound.lineEnd = ringEnd;
	        dλSum = 0;
	        d3_geo_area.polygonStart();
	      },
	      polygonEnd: function () {
	        d3_geo_area.polygonEnd();
	        bound.point = point;
	        bound.lineStart = lineStart;
	        bound.lineEnd = lineEnd;
	        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90);else if (dλSum > ε) φ1 = 90;else if (dλSum < -ε) φ0 = -90;
	        range[0] = λ0, range[1] = λ1;
	      }
	    };
	    function point(λ, φ) {
	      ranges.push(range = [λ0 = λ, λ1 = λ]);
	      if (φ < φ0) φ0 = φ;
	      if (φ > φ1) φ1 = φ;
	    }
	    function linePoint(λ, φ) {
	      var p = d3_geo_cartesian([λ * d3_radians, φ * d3_radians]);
	      if (p0) {
	        var normal = d3_geo_cartesianCross(p0, p),
	            equatorial = [normal[1], -normal[0], 0],
	            inflection = d3_geo_cartesianCross(equatorial, normal);
	        d3_geo_cartesianNormalize(inflection);
	        inflection = d3_geo_spherical(inflection);
	        var dλ = λ - λ_,
	            s = dλ > 0 ? 1 : -1,
	            λi = inflection[0] * d3_degrees * s,
	            antimeridian = abs(dλ) > 180;
	        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
	          var φi = inflection[1] * d3_degrees;
	          if (φi > φ1) φ1 = φi;
	        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
	          var φi = -inflection[1] * d3_degrees;
	          if (φi < φ0) φ0 = φi;
	        } else {
	          if (φ < φ0) φ0 = φ;
	          if (φ > φ1) φ1 = φ;
	        }
	        if (antimeridian) {
	          if (λ < λ_) {
	            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
	          } else {
	            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
	          }
	        } else {
	          if (λ1 >= λ0) {
	            if (λ < λ0) λ0 = λ;
	            if (λ > λ1) λ1 = λ;
	          } else {
	            if (λ > λ_) {
	              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
	            } else {
	              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
	            }
	          }
	        }
	      } else {
	        point(λ, φ);
	      }
	      p0 = p, λ_ = λ;
	    }
	    function lineStart() {
	      bound.point = linePoint;
	    }
	    function lineEnd() {
	      range[0] = λ0, range[1] = λ1;
	      bound.point = point;
	      p0 = null;
	    }
	    function ringPoint(λ, φ) {
	      if (p0) {
	        var dλ = λ - λ_;
	        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;
	      } else λ__ = λ, φ__ = φ;
	      d3_geo_area.point(λ, φ);
	      linePoint(λ, φ);
	    }
	    function ringStart() {
	      d3_geo_area.lineStart();
	    }
	    function ringEnd() {
	      ringPoint(λ__, φ__);
	      d3_geo_area.lineEnd();
	      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);
	      range[0] = λ0, range[1] = λ1;
	      p0 = null;
	    }
	    function angle(λ0, λ1) {
	      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;
	    }
	    function compareRanges(a, b) {
	      return a[0] - b[0];
	    }
	    function withinRange(x, range) {
	      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
	    }
	    return function (feature) {
	      φ1 = λ1 = -(λ0 = φ0 = Infinity);
	      ranges = [];
	      d3.geo.stream(feature, bound);
	      var n = ranges.length;
	      if (n) {
	        ranges.sort(compareRanges);
	        for (var i = 1, a = ranges[0], b, merged = [a]; i < n; ++i) {
	          b = ranges[i];
	          if (withinRange(b[0], a) || withinRange(b[1], a)) {
	            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
	            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
	          } else {
	            merged.push(a = b);
	          }
	        }
	        var best = -Infinity,
	            dλ;
	        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {
	          b = merged[i];
	          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];
	        }
	      }
	      ranges = range = null;
	      return λ0 === Infinity || φ0 === Infinity ? [[NaN, NaN], [NaN, NaN]] : [[λ0, φ0], [λ1, φ1]];
	    };
	  }();
	  d3.geo.centroid = function (object) {
	    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
	    d3.geo.stream(object, d3_geo_centroid);
	    var x = d3_geo_centroidX2,
	        y = d3_geo_centroidY2,
	        z = d3_geo_centroidZ2,
	        m = x * x + y * y + z * z;
	    if (m < ε2) {
	      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;
	      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;
	      m = x * x + y * y + z * z;
	      if (m < ε2) return [NaN, NaN];
	    }
	    return [Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees];
	  };
	  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;
	  var d3_geo_centroid = {
	    sphere: d3_noop,
	    point: d3_geo_centroidPoint,
	    lineStart: d3_geo_centroidLineStart,
	    lineEnd: d3_geo_centroidLineEnd,
	    polygonStart: function () {
	      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;
	    },
	    polygonEnd: function () {
	      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;
	    }
	  };
	  function d3_geo_centroidPoint(λ, φ) {
	    λ *= d3_radians;
	    var cosφ = Math.cos(φ *= d3_radians);
	    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));
	  }
	  function d3_geo_centroidPointXYZ(x, y, z) {
	    ++d3_geo_centroidW0;
	    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;
	    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;
	    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;
	  }
	  function d3_geo_centroidLineStart() {
	    var x0, y0, z0;
	    d3_geo_centroid.point = function (λ, φ) {
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians);
	      x0 = cosφ * Math.cos(λ);
	      y0 = cosφ * Math.sin(λ);
	      z0 = Math.sin(φ);
	      d3_geo_centroid.point = nextPoint;
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    };
	    function nextPoint(λ, φ) {
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians),
	          x = cosφ * Math.cos(λ),
	          y = cosφ * Math.sin(λ),
	          z = Math.sin(φ),
	          w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
	      d3_geo_centroidW1 += w;
	      d3_geo_centroidX1 += w * (x0 + (x0 = x));
	      d3_geo_centroidY1 += w * (y0 + (y0 = y));
	      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    }
	  }
	  function d3_geo_centroidLineEnd() {
	    d3_geo_centroid.point = d3_geo_centroidPoint;
	  }
	  function d3_geo_centroidRingStart() {
	    var λ00, φ00, x0, y0, z0;
	    d3_geo_centroid.point = function (λ, φ) {
	      λ00 = λ, φ00 = φ;
	      d3_geo_centroid.point = nextPoint;
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians);
	      x0 = cosφ * Math.cos(λ);
	      y0 = cosφ * Math.sin(λ);
	      z0 = Math.sin(φ);
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    };
	    d3_geo_centroid.lineEnd = function () {
	      nextPoint(λ00, φ00);
	      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;
	      d3_geo_centroid.point = d3_geo_centroidPoint;
	    };
	    function nextPoint(λ, φ) {
	      λ *= d3_radians;
	      var cosφ = Math.cos(φ *= d3_radians),
	          x = cosφ * Math.cos(λ),
	          y = cosφ * Math.sin(λ),
	          z = Math.sin(φ),
	          cx = y0 * z - z0 * y,
	          cy = z0 * x - x0 * z,
	          cz = x0 * y - y0 * x,
	          m = Math.sqrt(cx * cx + cy * cy + cz * cz),
	          u = x0 * x + y0 * y + z0 * z,
	          v = m && -d3_acos(u) / m,
	          w = Math.atan2(m, u);
	      d3_geo_centroidX2 += v * cx;
	      d3_geo_centroidY2 += v * cy;
	      d3_geo_centroidZ2 += v * cz;
	      d3_geo_centroidW1 += w;
	      d3_geo_centroidX1 += w * (x0 + (x0 = x));
	      d3_geo_centroidY1 += w * (y0 + (y0 = y));
	      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
	      d3_geo_centroidPointXYZ(x0, y0, z0);
	    }
	  }
	  function d3_geo_compose(a, b) {
	    function compose(x, y) {
	      return x = a(x, y), b(x[0], x[1]);
	    }
	    if (a.invert && b.invert) compose.invert = function (x, y) {
	      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
	    };
	    return compose;
	  }
	  function d3_true() {
	    return true;
	  }
	  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {
	    var subject = [],
	        clip = [];
	    segments.forEach(function (segment) {
	      if ((n = segment.length - 1) <= 0) return;
	      var n,
	          p0 = segment[0],
	          p1 = segment[n];
	      if (d3_geo_sphericalEqual(p0, p1)) {
	        listener.lineStart();
	        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);
	        listener.lineEnd();
	        return;
	      }
	      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true),
	          b = new d3_geo_clipPolygonIntersection(p0, null, a, false);
	      a.o = b;
	      subject.push(a);
	      clip.push(b);
	      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);
	      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);
	      a.o = b;
	      subject.push(a);
	      clip.push(b);
	    });
	    clip.sort(compare);
	    d3_geo_clipPolygonLinkCircular(subject);
	    d3_geo_clipPolygonLinkCircular(clip);
	    if (!subject.length) return;
	    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {
	      clip[i].e = entry = !entry;
	    }
	    var start = subject[0],
	        points,
	        point;
	    while (1) {
	      var current = start,
	          isSubject = true;
	      while (current.v) if ((current = current.n) === start) return;
	      points = current.z;
	      listener.lineStart();
	      do {
	        current.v = current.o.v = true;
	        if (current.e) {
	          if (isSubject) {
	            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);
	          } else {
	            interpolate(current.x, current.n.x, 1, listener);
	          }
	          current = current.n;
	        } else {
	          if (isSubject) {
	            points = current.p.z;
	            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);
	          } else {
	            interpolate(current.x, current.p.x, -1, listener);
	          }
	          current = current.p;
	        }
	        current = current.o;
	        points = current.z;
	        isSubject = !isSubject;
	      } while (!current.v);
	      listener.lineEnd();
	    }
	  }
	  function d3_geo_clipPolygonLinkCircular(array) {
	    if (!(n = array.length)) return;
	    var n,
	        i = 0,
	        a = array[0],
	        b;
	    while (++i < n) {
	      a.n = b = array[i];
	      b.p = a;
	      a = b;
	    }
	    a.n = b = array[0];
	    b.p = a;
	  }
	  function d3_geo_clipPolygonIntersection(point, points, other, entry) {
	    this.x = point;
	    this.z = points;
	    this.o = other;
	    this.e = entry;
	    this.v = false;
	    this.n = this.p = null;
	  }
	  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {
	    return function (rotate, listener) {
	      var line = clipLine(listener),
	          rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);
	      var clip = {
	        point: point,
	        lineStart: lineStart,
	        lineEnd: lineEnd,
	        polygonStart: function () {
	          clip.point = pointRing;
	          clip.lineStart = ringStart;
	          clip.lineEnd = ringEnd;
	          segments = [];
	          polygon = [];
	        },
	        polygonEnd: function () {
	          clip.point = point;
	          clip.lineStart = lineStart;
	          clip.lineEnd = lineEnd;
	          segments = d3.merge(segments);
	          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);
	          if (segments.length) {
	            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
	            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);
	          } else if (clipStartInside) {
	            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
	            listener.lineStart();
	            interpolate(null, null, 1, listener);
	            listener.lineEnd();
	          }
	          if (polygonStarted) listener.polygonEnd(), polygonStarted = false;
	          segments = polygon = null;
	        },
	        sphere: function () {
	          listener.polygonStart();
	          listener.lineStart();
	          interpolate(null, null, 1, listener);
	          listener.lineEnd();
	          listener.polygonEnd();
	        }
	      };
	      function point(λ, φ) {
	        var point = rotate(λ, φ);
	        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);
	      }
	      function pointLine(λ, φ) {
	        var point = rotate(λ, φ);
	        line.point(point[0], point[1]);
	      }
	      function lineStart() {
	        clip.point = pointLine;
	        line.lineStart();
	      }
	      function lineEnd() {
	        clip.point = point;
	        line.lineEnd();
	      }
	      var segments;
	      var buffer = d3_geo_clipBufferListener(),
	          ringListener = clipLine(buffer),
	          polygonStarted = false,
	          polygon,
	          ring;
	      function pointRing(λ, φ) {
	        ring.push([λ, φ]);
	        var point = rotate(λ, φ);
	        ringListener.point(point[0], point[1]);
	      }
	      function ringStart() {
	        ringListener.lineStart();
	        ring = [];
	      }
	      function ringEnd() {
	        pointRing(ring[0][0], ring[0][1]);
	        ringListener.lineEnd();
	        var clean = ringListener.clean(),
	            ringSegments = buffer.buffer(),
	            segment,
	            n = ringSegments.length;
	        ring.pop();
	        polygon.push(ring);
	        ring = null;
	        if (!n) return;
	        if (clean & 1) {
	          segment = ringSegments[0];
	          var n = segment.length - 1,
	              i = -1,
	              point;
	          if (n > 0) {
	            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
	            listener.lineStart();
	            while (++i < n) listener.point((point = segment[i])[0], point[1]);
	            listener.lineEnd();
	          }
	          return;
	        }
	        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
	        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));
	      }
	      return clip;
	    };
	  }
	  function d3_geo_clipSegmentLength1(segment) {
	    return segment.length > 1;
	  }
	  function d3_geo_clipBufferListener() {
	    var lines = [],
	        line;
	    return {
	      lineStart: function () {
	        lines.push(line = []);
	      },
	      point: function (λ, φ) {
	        line.push([λ, φ]);
	      },
	      lineEnd: d3_noop,
	      buffer: function () {
	        var buffer = lines;
	        lines = [];
	        line = null;
	        return buffer;
	      },
	      rejoin: function () {
	        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
	      }
	    };
	  }
	  function d3_geo_clipSort(a, b) {
	    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);
	  }
	  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [-π, -π / 2]);
	  function d3_geo_clipAntimeridianLine(listener) {
	    var λ0 = NaN,
	        φ0 = NaN,
	        sλ0 = NaN,
	        clean;
	    return {
	      lineStart: function () {
	        listener.lineStart();
	        clean = 1;
	      },
	      point: function (λ1, φ1) {
	        var sλ1 = λ1 > 0 ? π : -π,
	            dλ = abs(λ1 - λ0);
	        if (abs(dλ - π) < ε) {
	          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);
	          listener.point(sλ0, φ0);
	          listener.lineEnd();
	          listener.lineStart();
	          listener.point(sλ1, φ0);
	          listener.point(λ1, φ0);
	          clean = 0;
	        } else if (sλ0 !== sλ1 && dλ >= π) {
	          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;
	          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;
	          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);
	          listener.point(sλ0, φ0);
	          listener.lineEnd();
	          listener.lineStart();
	          listener.point(sλ1, φ0);
	          clean = 0;
	        }
	        listener.point(λ0 = λ1, φ0 = φ1);
	        sλ0 = sλ1;
	      },
	      lineEnd: function () {
	        listener.lineEnd();
	        λ0 = φ0 = NaN;
	      },
	      clean: function () {
	        return 2 - clean;
	      }
	    };
	  }
	  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {
	    var cosφ0,
	        cosφ1,
	        sinλ0_λ1 = Math.sin(λ0 - λ1);
	    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;
	  }
	  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {
	    var φ;
	    if (from == null) {
	      φ = direction * halfπ;
	      listener.point(-π, φ);
	      listener.point(0, φ);
	      listener.point(π, φ);
	      listener.point(π, 0);
	      listener.point(π, -φ);
	      listener.point(0, -φ);
	      listener.point(-π, -φ);
	      listener.point(-π, 0);
	      listener.point(-π, φ);
	    } else if (abs(from[0] - to[0]) > ε) {
	      var s = from[0] < to[0] ? π : -π;
	      φ = direction * s / 2;
	      listener.point(-s, φ);
	      listener.point(0, φ);
	      listener.point(s, φ);
	    } else {
	      listener.point(to[0], to[1]);
	    }
	  }
	  function d3_geo_pointInPolygon(point, polygon) {
	    var meridian = point[0],
	        parallel = point[1],
	        meridianNormal = [Math.sin(meridian), -Math.cos(meridian), 0],
	        polarAngle = 0,
	        winding = 0;
	    d3_geo_areaRingSum.reset();
	    for (var i = 0, n = polygon.length; i < n; ++i) {
	      var ring = polygon[i],
	          m = ring.length;
	      if (!m) continue;
	      var point0 = ring[0],
	          λ0 = point0[0],
	          φ0 = point0[1] / 2 + π / 4,
	          sinφ0 = Math.sin(φ0),
	          cosφ0 = Math.cos(φ0),
	          j = 1;
	      while (true) {
	        if (j === m) j = 0;
	        point = ring[j];
	        var λ = point[0],
	            φ = point[1] / 2 + π / 4,
	            sinφ = Math.sin(φ),
	            cosφ = Math.cos(φ),
	            dλ = λ - λ0,
	            sdλ = dλ >= 0 ? 1 : -1,
	            adλ = sdλ * dλ,
	            antimeridian = adλ > π,
	            k = sinφ0 * sinφ;
	        d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ)));
	        polarAngle += antimeridian ? dλ + sdλ * τ : dλ;
	        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
	          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
	          d3_geo_cartesianNormalize(arc);
	          var intersection = d3_geo_cartesianCross(meridianNormal, arc);
	          d3_geo_cartesianNormalize(intersection);
	          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);
	          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {
	            winding += antimeridian ^ dλ >= 0 ? 1 : -1;
	          }
	        }
	        if (!j++) break;
	        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;
	      }
	    }
	    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < -ε) ^ winding & 1;
	  }
	  function d3_geo_clipCircle(radius) {
	    var cr = Math.cos(radius),
	        smallRadius = cr > 0,
	        notHemisphere = abs(cr) > ε,
	        interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);
	    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-π, radius - π]);
	    function visible(λ, φ) {
	      return Math.cos(λ) * Math.cos(φ) > cr;
	    }
	    function clipLine(listener) {
	      var point0, c0, v0, v00, clean;
	      return {
	        lineStart: function () {
	          v00 = v0 = false;
	          clean = 1;
	        },
	        point: function (λ, φ) {
	          var point1 = [λ, φ],
	              point2,
	              v = visible(λ, φ),
	              c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;
	          if (!point0 && (v00 = v0 = v)) listener.lineStart();
	          if (v !== v0) {
	            point2 = intersect(point0, point1);
	            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {
	              point1[0] += ε;
	              point1[1] += ε;
	              v = visible(point1[0], point1[1]);
	            }
	          }
	          if (v !== v0) {
	            clean = 0;
	            if (v) {
	              listener.lineStart();
	              point2 = intersect(point1, point0);
	              listener.point(point2[0], point2[1]);
	            } else {
	              point2 = intersect(point0, point1);
	              listener.point(point2[0], point2[1]);
	              listener.lineEnd();
	            }
	            point0 = point2;
	          } else if (notHemisphere && point0 && smallRadius ^ v) {
	            var t;
	            if (!(c & c0) && (t = intersect(point1, point0, true))) {
	              clean = 0;
	              if (smallRadius) {
	                listener.lineStart();
	                listener.point(t[0][0], t[0][1]);
	                listener.point(t[1][0], t[1][1]);
	                listener.lineEnd();
	              } else {
	                listener.point(t[1][0], t[1][1]);
	                listener.lineEnd();
	                listener.lineStart();
	                listener.point(t[0][0], t[0][1]);
	              }
	            }
	          }
	          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {
	            listener.point(point1[0], point1[1]);
	          }
	          point0 = point1, v0 = v, c0 = c;
	        },
	        lineEnd: function () {
	          if (v0) listener.lineEnd();
	          point0 = null;
	        },
	        clean: function () {
	          return clean | (v00 && v0) << 1;
	        }
	      };
	    }
	    function intersect(a, b, two) {
	      var pa = d3_geo_cartesian(a),
	          pb = d3_geo_cartesian(b);
	      var n1 = [1, 0, 0],
	          n2 = d3_geo_cartesianCross(pa, pb),
	          n2n2 = d3_geo_cartesianDot(n2, n2),
	          n1n2 = n2[0],
	          determinant = n2n2 - n1n2 * n1n2;
	      if (!determinant) return !two && a;
	      var c1 = cr * n2n2 / determinant,
	          c2 = -cr * n1n2 / determinant,
	          n1xn2 = d3_geo_cartesianCross(n1, n2),
	          A = d3_geo_cartesianScale(n1, c1),
	          B = d3_geo_cartesianScale(n2, c2);
	      d3_geo_cartesianAdd(A, B);
	      var u = n1xn2,
	          w = d3_geo_cartesianDot(A, u),
	          uu = d3_geo_cartesianDot(u, u),
	          t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);
	      if (t2 < 0) return;
	      var t = Math.sqrt(t2),
	          q = d3_geo_cartesianScale(u, (-w - t) / uu);
	      d3_geo_cartesianAdd(q, A);
	      q = d3_geo_spherical(q);
	      if (!two) return q;
	      var λ0 = a[0],
	          λ1 = b[0],
	          φ0 = a[1],
	          φ1 = b[1],
	          z;
	      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;
	      var δλ = λ1 - λ0,
	          polar = abs(δλ - π) < ε,
	          meridian = polar || δλ < ε;
	      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;
	      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
	        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);
	        d3_geo_cartesianAdd(q1, A);
	        return [q, d3_geo_spherical(q1)];
	      }
	    }
	    function code(λ, φ) {
	      var r = smallRadius ? radius : π - radius,
	          code = 0;
	      if (λ < -r) code |= 1;else if (λ > r) code |= 2;
	      if (φ < -r) code |= 4;else if (φ > r) code |= 8;
	      return code;
	    }
	  }
	  function d3_geom_clipLine(x0, y0, x1, y1) {
	    return function (line) {
	      var a = line.a,
	          b = line.b,
	          ax = a.x,
	          ay = a.y,
	          bx = b.x,
	          by = b.y,
	          t0 = 0,
	          t1 = 1,
	          dx = bx - ax,
	          dy = by - ay,
	          r;
	      r = x0 - ax;
	      if (!dx && r > 0) return;
	      r /= dx;
	      if (dx < 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      } else if (dx > 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      }
	      r = x1 - ax;
	      if (!dx && r < 0) return;
	      r /= dx;
	      if (dx < 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      } else if (dx > 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      }
	      r = y0 - ay;
	      if (!dy && r > 0) return;
	      r /= dy;
	      if (dy < 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      } else if (dy > 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      }
	      r = y1 - ay;
	      if (!dy && r < 0) return;
	      r /= dy;
	      if (dy < 0) {
	        if (r > t1) return;
	        if (r > t0) t0 = r;
	      } else if (dy > 0) {
	        if (r < t0) return;
	        if (r < t1) t1 = r;
	      }
	      if (t0 > 0) line.a = {
	        x: ax + t0 * dx,
	        y: ay + t0 * dy
	      };
	      if (t1 < 1) line.b = {
	        x: ax + t1 * dx,
	        y: ay + t1 * dy
	      };
	      return line;
	    };
	  }
	  var d3_geo_clipExtentMAX = 1e9;
	  d3.geo.clipExtent = function () {
	    var x0,
	        y0,
	        x1,
	        y1,
	        stream,
	        clip,
	        clipExtent = {
	      stream: function (output) {
	        if (stream) stream.valid = false;
	        stream = clip(output);
	        stream.valid = true;
	        return stream;
	      },
	      extent: function (_) {
	        if (!arguments.length) return [[x0, y0], [x1, y1]];
	        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);
	        if (stream) stream.valid = false, stream = null;
	        return clipExtent;
	      }
	    };
	    return clipExtent.extent([[0, 0], [960, 500]]);
	  };
	  function d3_geo_clipExtent(x0, y0, x1, y1) {
	    return function (listener) {
	      var listener_ = listener,
	          bufferListener = d3_geo_clipBufferListener(),
	          clipLine = d3_geom_clipLine(x0, y0, x1, y1),
	          segments,
	          polygon,
	          ring;
	      var clip = {
	        point: point,
	        lineStart: lineStart,
	        lineEnd: lineEnd,
	        polygonStart: function () {
	          listener = bufferListener;
	          segments = [];
	          polygon = [];
	          clean = true;
	        },
	        polygonEnd: function () {
	          listener = listener_;
	          segments = d3.merge(segments);
	          var clipStartInside = insidePolygon([x0, y1]),
	              inside = clean && clipStartInside,
	              visible = segments.length;
	          if (inside || visible) {
	            listener.polygonStart();
	            if (inside) {
	              listener.lineStart();
	              interpolate(null, null, 1, listener);
	              listener.lineEnd();
	            }
	            if (visible) {
	              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);
	            }
	            listener.polygonEnd();
	          }
	          segments = polygon = ring = null;
	        }
	      };
	      function insidePolygon(p) {
	        var wn = 0,
	            n = polygon.length,
	            y = p[1];
	        for (var i = 0; i < n; ++i) {
	          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {
	            b = v[j];
	            if (a[1] <= y) {
	              if (b[1] > y && d3_cross2d(a, b, p) > 0) ++wn;
	            } else {
	              if (b[1] <= y && d3_cross2d(a, b, p) < 0) --wn;
	            }
	            a = b;
	          }
	        }
	        return wn !== 0;
	      }
	      function interpolate(from, to, direction, listener) {
	        var a = 0,
	            a1 = 0;
	        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
	          do {
	            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
	          } while ((a = (a + direction + 4) % 4) !== a1);
	        } else {
	          listener.point(to[0], to[1]);
	        }
	      }
	      function pointVisible(x, y) {
	        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
	      }
	      function point(x, y) {
	        if (pointVisible(x, y)) listener.point(x, y);
	      }
	      var x__, y__, v__, x_, y_, v_, first, clean;
	      function lineStart() {
	        clip.point = linePoint;
	        if (polygon) polygon.push(ring = []);
	        first = true;
	        v_ = false;
	        x_ = y_ = NaN;
	      }
	      function lineEnd() {
	        if (segments) {
	          linePoint(x__, y__);
	          if (v__ && v_) bufferListener.rejoin();
	          segments.push(bufferListener.buffer());
	        }
	        clip.point = point;
	        if (v_) listener.lineEnd();
	      }
	      function linePoint(x, y) {
	        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));
	        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));
	        var v = pointVisible(x, y);
	        if (polygon) ring.push([x, y]);
	        if (first) {
	          x__ = x, y__ = y, v__ = v;
	          first = false;
	          if (v) {
	            listener.lineStart();
	            listener.point(x, y);
	          }
	        } else {
	          if (v && v_) listener.point(x, y);else {
	            var l = {
	              a: {
	                x: x_,
	                y: y_
	              },
	              b: {
	                x: x,
	                y: y
	              }
	            };
	            if (clipLine(l)) {
	              if (!v_) {
	                listener.lineStart();
	                listener.point(l.a.x, l.a.y);
	              }
	              listener.point(l.b.x, l.b.y);
	              if (!v) listener.lineEnd();
	              clean = false;
	            } else if (v) {
	              listener.lineStart();
	              listener.point(x, y);
	              clean = false;
	            }
	          }
	        }
	        x_ = x, y_ = y, v_ = v;
	      }
	      return clip;
	    };
	    function corner(p, direction) {
	      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;
	    }
	    function compare(a, b) {
	      return comparePoints(a.x, b.x);
	    }
	    function comparePoints(a, b) {
	      var ca = corner(a, 1),
	          cb = corner(b, 1);
	      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
	    }
	  }
	  function d3_geo_conic(projectAt) {
	    var φ0 = 0,
	        φ1 = π / 3,
	        m = d3_geo_projectionMutator(projectAt),
	        p = m(φ0, φ1);
	    p.parallels = function (_) {
	      if (!arguments.length) return [φ0 / π * 180, φ1 / π * 180];
	      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
	    };
	    return p;
	  }
	  function d3_geo_conicEqualArea(φ0, φ1) {
	    var sinφ0 = Math.sin(φ0),
	        n = (sinφ0 + Math.sin(φ1)) / 2,
	        C = 1 + sinφ0 * (2 * n - sinφ0),
	        ρ0 = Math.sqrt(C) / n;
	    function forward(λ, φ) {
	      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
	      return [ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ)];
	    }
	    forward.invert = function (x, y) {
	      var ρ0_y = ρ0 - y;
	      return [Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n))];
	    };
	    return forward;
	  }
	  (d3.geo.conicEqualArea = function () {
	    return d3_geo_conic(d3_geo_conicEqualArea);
	  }).raw = d3_geo_conicEqualArea;
	  d3.geo.albers = function () {
	    return d3.geo.conicEqualArea().rotate([96, 0]).center([-.6, 38.7]).parallels([29.5, 45.5]).scale(1070);
	  };
	  d3.geo.albersUsa = function () {
	    var lower48 = d3.geo.albers();
	    var alaska = d3.geo.conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]);
	    var hawaii = d3.geo.conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]);
	    var point,
	        pointStream = {
	      point: function (x, y) {
	        point = [x, y];
	      }
	    },
	        lower48Point,
	        alaskaPoint,
	        hawaiiPoint;
	    function albersUsa(coordinates) {
	      var x = coordinates[0],
	          y = coordinates[1];
	      point = null;
	      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
	      return point;
	    }
	    albersUsa.invert = function (coordinates) {
	      var k = lower48.scale(),
	          t = lower48.translate(),
	          x = (coordinates[0] - t[0]) / k,
	          y = (coordinates[1] - t[1]) / k;
	      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);
	    };
	    albersUsa.stream = function (stream) {
	      var lower48Stream = lower48.stream(stream),
	          alaskaStream = alaska.stream(stream),
	          hawaiiStream = hawaii.stream(stream);
	      return {
	        point: function (x, y) {
	          lower48Stream.point(x, y);
	          alaskaStream.point(x, y);
	          hawaiiStream.point(x, y);
	        },
	        sphere: function () {
	          lower48Stream.sphere();
	          alaskaStream.sphere();
	          hawaiiStream.sphere();
	        },
	        lineStart: function () {
	          lower48Stream.lineStart();
	          alaskaStream.lineStart();
	          hawaiiStream.lineStart();
	        },
	        lineEnd: function () {
	          lower48Stream.lineEnd();
	          alaskaStream.lineEnd();
	          hawaiiStream.lineEnd();
	        },
	        polygonStart: function () {
	          lower48Stream.polygonStart();
	          alaskaStream.polygonStart();
	          hawaiiStream.polygonStart();
	        },
	        polygonEnd: function () {
	          lower48Stream.polygonEnd();
	          alaskaStream.polygonEnd();
	          hawaiiStream.polygonEnd();
	        }
	      };
	    };
	    albersUsa.precision = function (_) {
	      if (!arguments.length) return lower48.precision();
	      lower48.precision(_);
	      alaska.precision(_);
	      hawaii.precision(_);
	      return albersUsa;
	    };
	    albersUsa.scale = function (_) {
	      if (!arguments.length) return lower48.scale();
	      lower48.scale(_);
	      alaska.scale(_ * .35);
	      hawaii.scale(_);
	      return albersUsa.translate(lower48.translate());
	    };
	    albersUsa.translate = function (_) {
	      if (!arguments.length) return lower48.translate();
	      var k = lower48.scale(),
	          x = +_[0],
	          y = +_[1];
	      lower48Point = lower48.translate(_).clipExtent([[x - .455 * k, y - .238 * k], [x + .455 * k, y + .238 * k]]).stream(pointStream).point;
	      alaskaPoint = alaska.translate([x - .307 * k, y + .201 * k]).clipExtent([[x - .425 * k + ε, y + .12 * k + ε], [x - .214 * k - ε, y + .234 * k - ε]]).stream(pointStream).point;
	      hawaiiPoint = hawaii.translate([x - .205 * k, y + .212 * k]).clipExtent([[x - .214 * k + ε, y + .166 * k + ε], [x - .115 * k - ε, y + .234 * k - ε]]).stream(pointStream).point;
	      return albersUsa;
	    };
	    return albersUsa.scale(1070);
	  };
	  var d3_geo_pathAreaSum,
	      d3_geo_pathAreaPolygon,
	      d3_geo_pathArea = {
	    point: d3_noop,
	    lineStart: d3_noop,
	    lineEnd: d3_noop,
	    polygonStart: function () {
	      d3_geo_pathAreaPolygon = 0;
	      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;
	    },
	    polygonEnd: function () {
	      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;
	      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);
	    }
	  };
	  function d3_geo_pathAreaRingStart() {
	    var x00, y00, x0, y0;
	    d3_geo_pathArea.point = function (x, y) {
	      d3_geo_pathArea.point = nextPoint;
	      x00 = x0 = x, y00 = y0 = y;
	    };
	    function nextPoint(x, y) {
	      d3_geo_pathAreaPolygon += y0 * x - x0 * y;
	      x0 = x, y0 = y;
	    }
	    d3_geo_pathArea.lineEnd = function () {
	      nextPoint(x00, y00);
	    };
	  }
	  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;
	  var d3_geo_pathBounds = {
	    point: d3_geo_pathBoundsPoint,
	    lineStart: d3_noop,
	    lineEnd: d3_noop,
	    polygonStart: d3_noop,
	    polygonEnd: d3_noop
	  };
	  function d3_geo_pathBoundsPoint(x, y) {
	    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;
	    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;
	    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;
	    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;
	  }
	  function d3_geo_pathBuffer() {
	    var pointCircle = d3_geo_pathBufferCircle(4.5),
	        buffer = [];
	    var stream = {
	      point: point,
	      lineStart: function () {
	        stream.point = pointLineStart;
	      },
	      lineEnd: lineEnd,
	      polygonStart: function () {
	        stream.lineEnd = lineEndPolygon;
	      },
	      polygonEnd: function () {
	        stream.lineEnd = lineEnd;
	        stream.point = point;
	      },
	      pointRadius: function (_) {
	        pointCircle = d3_geo_pathBufferCircle(_);
	        return stream;
	      },
	      result: function () {
	        if (buffer.length) {
	          var result = buffer.join("");
	          buffer = [];
	          return result;
	        }
	      }
	    };
	    function point(x, y) {
	      buffer.push("M", x, ",", y, pointCircle);
	    }
	    function pointLineStart(x, y) {
	      buffer.push("M", x, ",", y);
	      stream.point = pointLine;
	    }
	    function pointLine(x, y) {
	      buffer.push("L", x, ",", y);
	    }
	    function lineEnd() {
	      stream.point = point;
	    }
	    function lineEndPolygon() {
	      buffer.push("Z");
	    }
	    return stream;
	  }
	  function d3_geo_pathBufferCircle(radius) {
	    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
	  }
	  var d3_geo_pathCentroid = {
	    point: d3_geo_pathCentroidPoint,
	    lineStart: d3_geo_pathCentroidLineStart,
	    lineEnd: d3_geo_pathCentroidLineEnd,
	    polygonStart: function () {
	      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;
	    },
	    polygonEnd: function () {
	      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
	      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;
	      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;
	    }
	  };
	  function d3_geo_pathCentroidPoint(x, y) {
	    d3_geo_centroidX0 += x;
	    d3_geo_centroidY0 += y;
	    ++d3_geo_centroidZ0;
	  }
	  function d3_geo_pathCentroidLineStart() {
	    var x0, y0;
	    d3_geo_pathCentroid.point = function (x, y) {
	      d3_geo_pathCentroid.point = nextPoint;
	      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
	    };
	    function nextPoint(x, y) {
	      var dx = x - x0,
	          dy = y - y0,
	          z = Math.sqrt(dx * dx + dy * dy);
	      d3_geo_centroidX1 += z * (x0 + x) / 2;
	      d3_geo_centroidY1 += z * (y0 + y) / 2;
	      d3_geo_centroidZ1 += z;
	      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
	    }
	  }
	  function d3_geo_pathCentroidLineEnd() {
	    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
	  }
	  function d3_geo_pathCentroidRingStart() {
	    var x00, y00, x0, y0;
	    d3_geo_pathCentroid.point = function (x, y) {
	      d3_geo_pathCentroid.point = nextPoint;
	      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);
	    };
	    function nextPoint(x, y) {
	      var dx = x - x0,
	          dy = y - y0,
	          z = Math.sqrt(dx * dx + dy * dy);
	      d3_geo_centroidX1 += z * (x0 + x) / 2;
	      d3_geo_centroidY1 += z * (y0 + y) / 2;
	      d3_geo_centroidZ1 += z;
	      z = y0 * x - x0 * y;
	      d3_geo_centroidX2 += z * (x0 + x);
	      d3_geo_centroidY2 += z * (y0 + y);
	      d3_geo_centroidZ2 += z * 3;
	      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
	    }
	    d3_geo_pathCentroid.lineEnd = function () {
	      nextPoint(x00, y00);
	    };
	  }
	  function d3_geo_pathContext(context) {
	    var pointRadius = 4.5;
	    var stream = {
	      point: point,
	      lineStart: function () {
	        stream.point = pointLineStart;
	      },
	      lineEnd: lineEnd,
	      polygonStart: function () {
	        stream.lineEnd = lineEndPolygon;
	      },
	      polygonEnd: function () {
	        stream.lineEnd = lineEnd;
	        stream.point = point;
	      },
	      pointRadius: function (_) {
	        pointRadius = _;
	        return stream;
	      },
	      result: d3_noop
	    };
	    function point(x, y) {
	      context.moveTo(x + pointRadius, y);
	      context.arc(x, y, pointRadius, 0, τ);
	    }
	    function pointLineStart(x, y) {
	      context.moveTo(x, y);
	      stream.point = pointLine;
	    }
	    function pointLine(x, y) {
	      context.lineTo(x, y);
	    }
	    function lineEnd() {
	      stream.point = point;
	    }
	    function lineEndPolygon() {
	      context.closePath();
	    }
	    return stream;
	  }
	  function d3_geo_resample(project) {
	    var δ2 = .5,
	        cosMinDistance = Math.cos(30 * d3_radians),
	        maxDepth = 16;
	    function resample(stream) {
	      return (maxDepth ? resampleRecursive : resampleNone)(stream);
	    }
	    function resampleNone(stream) {
	      return d3_geo_transformPoint(stream, function (x, y) {
	        x = project(x, y);
	        stream.point(x[0], x[1]);
	      });
	    }
	    function resampleRecursive(stream) {
	      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;
	      var resample = {
	        point: point,
	        lineStart: lineStart,
	        lineEnd: lineEnd,
	        polygonStart: function () {
	          stream.polygonStart();
	          resample.lineStart = ringStart;
	        },
	        polygonEnd: function () {
	          stream.polygonEnd();
	          resample.lineStart = lineStart;
	        }
	      };
	      function point(x, y) {
	        x = project(x, y);
	        stream.point(x[0], x[1]);
	      }
	      function lineStart() {
	        x0 = NaN;
	        resample.point = linePoint;
	        stream.lineStart();
	      }
	      function linePoint(λ, φ) {
	        var c = d3_geo_cartesian([λ, φ]),
	            p = project(λ, φ);
	        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
	        stream.point(x0, y0);
	      }
	      function lineEnd() {
	        resample.point = point;
	        stream.lineEnd();
	      }
	      function ringStart() {
	        lineStart();
	        resample.point = ringPoint;
	        resample.lineEnd = ringEnd;
	      }
	      function ringPoint(λ, φ) {
	        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
	        resample.point = linePoint;
	      }
	      function ringEnd() {
	        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);
	        resample.lineEnd = lineEnd;
	        lineEnd();
	      }
	      return resample;
	    }
	    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
	      var dx = x1 - x0,
	          dy = y1 - y0,
	          d2 = dx * dx + dy * dy;
	      if (d2 > 4 * δ2 && depth--) {
	        var a = a0 + a1,
	            b = b0 + b1,
	            c = c0 + c1,
	            m = Math.sqrt(a * a + b * b + c * c),
	            φ2 = Math.asin(c /= m),
	            λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a),
	            p = project(λ2, φ2),
	            x2 = p[0],
	            y2 = p[1],
	            dx2 = x2 - x0,
	            dy2 = y2 - y0,
	            dz = dy * dx2 - dx * dy2;
	        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
	          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);
	          stream.point(x2, y2);
	          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);
	        }
	      }
	    }
	    resample.precision = function (_) {
	      if (!arguments.length) return Math.sqrt(δ2);
	      maxDepth = (δ2 = _ * _) > 0 && 16;
	      return resample;
	    };
	    return resample;
	  }
	  d3.geo.path = function () {
	    var pointRadius = 4.5,
	        projection,
	        context,
	        projectStream,
	        contextStream,
	        cacheStream;
	    function path(object) {
	      if (object) {
	        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
	        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);
	        d3.geo.stream(object, cacheStream);
	      }
	      return contextStream.result();
	    }
	    path.area = function (object) {
	      d3_geo_pathAreaSum = 0;
	      d3.geo.stream(object, projectStream(d3_geo_pathArea));
	      return d3_geo_pathAreaSum;
	    };
	    path.centroid = function (object) {
	      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
	      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));
	      return d3_geo_centroidZ2 ? [d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2] : d3_geo_centroidZ1 ? [d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1] : d3_geo_centroidZ0 ? [d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0] : [NaN, NaN];
	    };
	    path.bounds = function (object) {
	      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);
	      d3.geo.stream(object, projectStream(d3_geo_pathBounds));
	      return [[d3_geo_pathBoundsX0, d3_geo_pathBoundsY0], [d3_geo_pathBoundsX1, d3_geo_pathBoundsY1]];
	    };
	    path.projection = function (_) {
	      if (!arguments.length) return projection;
	      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;
	      return reset();
	    };
	    path.context = function (_) {
	      if (!arguments.length) return context;
	      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);
	      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
	      return reset();
	    };
	    path.pointRadius = function (_) {
	      if (!arguments.length) return pointRadius;
	      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
	      return path;
	    };
	    function reset() {
	      cacheStream = null;
	      return path;
	    }
	    return path.projection(d3.geo.albersUsa()).context(null);
	  };
	  function d3_geo_pathProjectStream(project) {
	    var resample = d3_geo_resample(function (x, y) {
	      return project([x * d3_degrees, y * d3_degrees]);
	    });
	    return function (stream) {
	      return d3_geo_projectionRadians(resample(stream));
	    };
	  }
	  d3.geo.transform = function (methods) {
	    return {
	      stream: function (stream) {
	        var transform = new d3_geo_transform(stream);
	        for (var k in methods) transform[k] = methods[k];
	        return transform;
	      }
	    };
	  };
	  function d3_geo_transform(stream) {
	    this.stream = stream;
	  }
	  d3_geo_transform.prototype = {
	    point: function (x, y) {
	      this.stream.point(x, y);
	    },
	    sphere: function () {
	      this.stream.sphere();
	    },
	    lineStart: function () {
	      this.stream.lineStart();
	    },
	    lineEnd: function () {
	      this.stream.lineEnd();
	    },
	    polygonStart: function () {
	      this.stream.polygonStart();
	    },
	    polygonEnd: function () {
	      this.stream.polygonEnd();
	    }
	  };
	  function d3_geo_transformPoint(stream, point) {
	    return {
	      point: point,
	      sphere: function () {
	        stream.sphere();
	      },
	      lineStart: function () {
	        stream.lineStart();
	      },
	      lineEnd: function () {
	        stream.lineEnd();
	      },
	      polygonStart: function () {
	        stream.polygonStart();
	      },
	      polygonEnd: function () {
	        stream.polygonEnd();
	      }
	    };
	  }
	  d3.geo.projection = d3_geo_projection;
	  d3.geo.projectionMutator = d3_geo_projectionMutator;
	  function d3_geo_projection(project) {
	    return d3_geo_projectionMutator(function () {
	      return project;
	    })();
	  }
	  function d3_geo_projectionMutator(projectAt) {
	    var project,
	        rotate,
	        projectRotate,
	        projectResample = d3_geo_resample(function (x, y) {
	      x = project(x, y);
	      return [x[0] * k + δx, δy - x[1] * k];
	    }),
	        k = 150,
	        x = 480,
	        y = 250,
	        λ = 0,
	        φ = 0,
	        δλ = 0,
	        δφ = 0,
	        δγ = 0,
	        δx,
	        δy,
	        preclip = d3_geo_clipAntimeridian,
	        postclip = d3_identity,
	        clipAngle = null,
	        clipExtent = null,
	        stream;
	    function projection(point) {
	      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);
	      return [point[0] * k + δx, δy - point[1] * k];
	    }
	    function invert(point) {
	      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
	      return point && [point[0] * d3_degrees, point[1] * d3_degrees];
	    }
	    projection.stream = function (output) {
	      if (stream) stream.valid = false;
	      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));
	      stream.valid = true;
	      return stream;
	    };
	    projection.clipAngle = function (_) {
	      if (!arguments.length) return clipAngle;
	      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);
	      return invalidate();
	    };
	    projection.clipExtent = function (_) {
	      if (!arguments.length) return clipExtent;
	      clipExtent = _;
	      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;
	      return invalidate();
	    };
	    projection.scale = function (_) {
	      if (!arguments.length) return k;
	      k = +_;
	      return reset();
	    };
	    projection.translate = function (_) {
	      if (!arguments.length) return [x, y];
	      x = +_[0];
	      y = +_[1];
	      return reset();
	    };
	    projection.center = function (_) {
	      if (!arguments.length) return [λ * d3_degrees, φ * d3_degrees];
	      λ = _[0] % 360 * d3_radians;
	      φ = _[1] % 360 * d3_radians;
	      return reset();
	    };
	    projection.rotate = function (_) {
	      if (!arguments.length) return [δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees];
	      δλ = _[0] % 360 * d3_radians;
	      δφ = _[1] % 360 * d3_radians;
	      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;
	      return reset();
	    };
	    d3.rebind(projection, projectResample, "precision");
	    function reset() {
	      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);
	      var center = project(λ, φ);
	      δx = x - center[0] * k;
	      δy = y + center[1] * k;
	      return invalidate();
	    }
	    function invalidate() {
	      if (stream) stream.valid = false, stream = null;
	      return projection;
	    }
	    return function () {
	      project = projectAt.apply(this, arguments);
	      projection.invert = project.invert && invert;
	      return reset();
	    };
	  }
	  function d3_geo_projectionRadians(stream) {
	    return d3_geo_transformPoint(stream, function (x, y) {
	      stream.point(x * d3_radians, y * d3_radians);
	    });
	  }
	  function d3_geo_equirectangular(λ, φ) {
	    return [λ, φ];
	  }
	  (d3.geo.equirectangular = function () {
	    return d3_geo_projection(d3_geo_equirectangular);
	  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;
	  d3.geo.rotation = function (rotate) {
	    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);
	    function forward(coordinates) {
	      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
	      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
	    }
	    forward.invert = function (coordinates) {
	      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
	      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
	    };
	    return forward;
	  };
	  function d3_geo_identityRotation(λ, φ) {
	    return [λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ];
	  }
	  d3_geo_identityRotation.invert = d3_geo_equirectangular;
	  function d3_geo_rotation(δλ, δφ, δγ) {
	    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;
	  }
	  function d3_geo_forwardRotationλ(δλ) {
	    return function (λ, φ) {
	      return λ += δλ, [λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ];
	    };
	  }
	  function d3_geo_rotationλ(δλ) {
	    var rotation = d3_geo_forwardRotationλ(δλ);
	    rotation.invert = d3_geo_forwardRotationλ(-δλ);
	    return rotation;
	  }
	  function d3_geo_rotationφγ(δφ, δγ) {
	    var cosδφ = Math.cos(δφ),
	        sinδφ = Math.sin(δφ),
	        cosδγ = Math.cos(δγ),
	        sinδγ = Math.sin(δγ);
	    function rotation(λ, φ) {
	      var cosφ = Math.cos(φ),
	          x = Math.cos(λ) * cosφ,
	          y = Math.sin(λ) * cosφ,
	          z = Math.sin(φ),
	          k = z * cosδφ + x * sinδφ;
	      return [Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ)];
	    }
	    rotation.invert = function (λ, φ) {
	      var cosφ = Math.cos(φ),
	          x = Math.cos(λ) * cosφ,
	          y = Math.sin(λ) * cosφ,
	          z = Math.sin(φ),
	          k = z * cosδγ - y * sinδγ;
	      return [Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ)];
	    };
	    return rotation;
	  }
	  d3.geo.circle = function () {
	    var origin = [0, 0],
	        angle,
	        precision = 6,
	        interpolate;
	    function circle() {
	      var center = typeof origin === "function" ? origin.apply(this, arguments) : origin,
	          rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert,
	          ring = [];
	      interpolate(null, null, 1, {
	        point: function (x, y) {
	          ring.push(x = rotate(x, y));
	          x[0] *= d3_degrees, x[1] *= d3_degrees;
	        }
	      });
	      return {
	        type: "Polygon",
	        coordinates: [ring]
	      };
	    }
	    circle.origin = function (x) {
	      if (!arguments.length) return origin;
	      origin = x;
	      return circle;
	    };
	    circle.angle = function (x) {
	      if (!arguments.length) return angle;
	      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);
	      return circle;
	    };
	    circle.precision = function (_) {
	      if (!arguments.length) return precision;
	      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);
	      return circle;
	    };
	    return circle.angle(90);
	  };
	  function d3_geo_circleInterpolate(radius, precision) {
	    var cr = Math.cos(radius),
	        sr = Math.sin(radius);
	    return function (from, to, direction, listener) {
	      var step = direction * precision;
	      if (from != null) {
	        from = d3_geo_circleAngle(cr, from);
	        to = d3_geo_circleAngle(cr, to);
	        if (direction > 0 ? from < to : from > to) from += direction * τ;
	      } else {
	        from = radius + direction * τ;
	        to = radius - .5 * step;
	      }
	      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
	        listener.point((point = d3_geo_spherical([cr, -sr * Math.cos(t), -sr * Math.sin(t)]))[0], point[1]);
	      }
	    };
	  }
	  function d3_geo_circleAngle(cr, point) {
	    var a = d3_geo_cartesian(point);
	    a[0] -= cr;
	    d3_geo_cartesianNormalize(a);
	    var angle = d3_acos(-a[1]);
	    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);
	  }
	  d3.geo.distance = function (a, b) {
	    var Δλ = (b[0] - a[0]) * d3_radians,
	        φ0 = a[1] * d3_radians,
	        φ1 = b[1] * d3_radians,
	        sinΔλ = Math.sin(Δλ),
	        cosΔλ = Math.cos(Δλ),
	        sinφ0 = Math.sin(φ0),
	        cosφ0 = Math.cos(φ0),
	        sinφ1 = Math.sin(φ1),
	        cosφ1 = Math.cos(φ1),
	        t;
	    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);
	  };
	  d3.geo.graticule = function () {
	    var x1,
	        x0,
	        X1,
	        X0,
	        y1,
	        y0,
	        Y1,
	        Y0,
	        dx = 10,
	        dy = dx,
	        DX = 90,
	        DY = 360,
	        x,
	        y,
	        X,
	        Y,
	        precision = 2.5;
	    function graticule() {
	      return {
	        type: "MultiLineString",
	        coordinates: lines()
	      };
	    }
	    function lines() {
	      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function (x) {
	        return abs(x % DX) > ε;
	      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function (y) {
	        return abs(y % DY) > ε;
	      }).map(y));
	    }
	    graticule.lines = function () {
	      return lines().map(function (coordinates) {
	        return {
	          type: "LineString",
	          coordinates: coordinates
	        };
	      });
	    };
	    graticule.outline = function () {
	      return {
	        type: "Polygon",
	        coordinates: [X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1))]
	      };
	    };
	    graticule.extent = function (_) {
	      if (!arguments.length) return graticule.minorExtent();
	      return graticule.majorExtent(_).minorExtent(_);
	    };
	    graticule.majorExtent = function (_) {
	      if (!arguments.length) return [[X0, Y0], [X1, Y1]];
	      X0 = +_[0][0], X1 = +_[1][0];
	      Y0 = +_[0][1], Y1 = +_[1][1];
	      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
	      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
	      return graticule.precision(precision);
	    };
	    graticule.minorExtent = function (_) {
	      if (!arguments.length) return [[x0, y0], [x1, y1]];
	      x0 = +_[0][0], x1 = +_[1][0];
	      y0 = +_[0][1], y1 = +_[1][1];
	      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
	      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
	      return graticule.precision(precision);
	    };
	    graticule.step = function (_) {
	      if (!arguments.length) return graticule.minorStep();
	      return graticule.majorStep(_).minorStep(_);
	    };
	    graticule.majorStep = function (_) {
	      if (!arguments.length) return [DX, DY];
	      DX = +_[0], DY = +_[1];
	      return graticule;
	    };
	    graticule.minorStep = function (_) {
	      if (!arguments.length) return [dx, dy];
	      dx = +_[0], dy = +_[1];
	      return graticule;
	    };
	    graticule.precision = function (_) {
	      if (!arguments.length) return precision;
	      precision = +_;
	      x = d3_geo_graticuleX(y0, y1, 90);
	      y = d3_geo_graticuleY(x0, x1, precision);
	      X = d3_geo_graticuleX(Y0, Y1, 90);
	      Y = d3_geo_graticuleY(X0, X1, precision);
	      return graticule;
	    };
	    return graticule.majorExtent([[-180, -90 + ε], [180, 90 - ε]]).minorExtent([[-180, -80 - ε], [180, 80 + ε]]);
	  };
	  function d3_geo_graticuleX(y0, y1, dy) {
	    var y = d3.range(y0, y1 - ε, dy).concat(y1);
	    return function (x) {
	      return y.map(function (y) {
	        return [x, y];
	      });
	    };
	  }
	  function d3_geo_graticuleY(x0, x1, dx) {
	    var x = d3.range(x0, x1 - ε, dx).concat(x1);
	    return function (y) {
	      return x.map(function (x) {
	        return [x, y];
	      });
	    };
	  }
	  function d3_source(d) {
	    return d.source;
	  }
	  function d3_target(d) {
	    return d.target;
	  }
	  d3.geo.greatArc = function () {
	    var source = d3_source,
	        source_,
	        target = d3_target,
	        target_;
	    function greatArc() {
	      return {
	        type: "LineString",
	        coordinates: [source_ || source.apply(this, arguments), target_ || target.apply(this, arguments)]
	      };
	    }
	    greatArc.distance = function () {
	      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));
	    };
	    greatArc.source = function (_) {
	      if (!arguments.length) return source;
	      source = _, source_ = typeof _ === "function" ? null : _;
	      return greatArc;
	    };
	    greatArc.target = function (_) {
	      if (!arguments.length) return target;
	      target = _, target_ = typeof _ === "function" ? null : _;
	      return greatArc;
	    };
	    greatArc.precision = function () {
	      return arguments.length ? greatArc : 0;
	    };
	    return greatArc;
	  };
	  d3.geo.interpolate = function (source, target) {
	    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);
	  };
	  function d3_geo_interpolate(x0, y0, x1, y1) {
	    var cy0 = Math.cos(y0),
	        sy0 = Math.sin(y0),
	        cy1 = Math.cos(y1),
	        sy1 = Math.sin(y1),
	        kx0 = cy0 * Math.cos(x0),
	        ky0 = cy0 * Math.sin(x0),
	        kx1 = cy1 * Math.cos(x1),
	        ky1 = cy1 * Math.sin(x1),
	        d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))),
	        k = 1 / Math.sin(d);
	    var interpolate = d ? function (t) {
	      var B = Math.sin(t *= d) * k,
	          A = Math.sin(d - t) * k,
	          x = A * kx0 + B * kx1,
	          y = A * ky0 + B * ky1,
	          z = A * sy0 + B * sy1;
	      return [Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees];
	    } : function () {
	      return [x0 * d3_degrees, y0 * d3_degrees];
	    };
	    interpolate.distance = d;
	    return interpolate;
	  }
	  d3.geo.length = function (object) {
	    d3_geo_lengthSum = 0;
	    d3.geo.stream(object, d3_geo_length);
	    return d3_geo_lengthSum;
	  };
	  var d3_geo_lengthSum;
	  var d3_geo_length = {
	    sphere: d3_noop,
	    point: d3_noop,
	    lineStart: d3_geo_lengthLineStart,
	    lineEnd: d3_noop,
	    polygonStart: d3_noop,
	    polygonEnd: d3_noop
	  };
	  function d3_geo_lengthLineStart() {
	    var λ0, sinφ0, cosφ0;
	    d3_geo_length.point = function (λ, φ) {
	      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);
	      d3_geo_length.point = nextPoint;
	    };
	    d3_geo_length.lineEnd = function () {
	      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;
	    };
	    function nextPoint(λ, φ) {
	      var sinφ = Math.sin(φ *= d3_radians),
	          cosφ = Math.cos(φ),
	          t = abs((λ *= d3_radians) - λ0),
	          cosΔλ = Math.cos(t);
	      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
	      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
	    }
	  }
	  function d3_geo_azimuthal(scale, angle) {
	    function azimuthal(λ, φ) {
	      var cosλ = Math.cos(λ),
	          cosφ = Math.cos(φ),
	          k = scale(cosλ * cosφ);
	      return [k * cosφ * Math.sin(λ), k * Math.sin(φ)];
	    }
	    azimuthal.invert = function (x, y) {
	      var ρ = Math.sqrt(x * x + y * y),
	          c = angle(ρ),
	          sinc = Math.sin(c),
	          cosc = Math.cos(c);
	      return [Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ)];
	    };
	    return azimuthal;
	  }
	  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function (cosλcosφ) {
	    return Math.sqrt(2 / (1 + cosλcosφ));
	  }, function (ρ) {
	    return 2 * Math.asin(ρ / 2);
	  });
	  (d3.geo.azimuthalEqualArea = function () {
	    return d3_geo_projection(d3_geo_azimuthalEqualArea);
	  }).raw = d3_geo_azimuthalEqualArea;
	  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function (cosλcosφ) {
	    var c = Math.acos(cosλcosφ);
	    return c && c / Math.sin(c);
	  }, d3_identity);
	  (d3.geo.azimuthalEquidistant = function () {
	    return d3_geo_projection(d3_geo_azimuthalEquidistant);
	  }).raw = d3_geo_azimuthalEquidistant;
	  function d3_geo_conicConformal(φ0, φ1) {
	    var cosφ0 = Math.cos(φ0),
	        t = function (φ) {
	      return Math.tan(π / 4 + φ / 2);
	    },
	        n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)),
	        F = cosφ0 * Math.pow(t(φ0), n) / n;
	    if (!n) return d3_geo_mercator;
	    function forward(λ, φ) {
	      if (F > 0) {
	        if (φ < -halfπ + ε) φ = -halfπ + ε;
	      } else {
	        if (φ > halfπ - ε) φ = halfπ - ε;
	      }
	      var ρ = F / Math.pow(t(φ), n);
	      return [ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ)];
	    }
	    forward.invert = function (x, y) {
	      var ρ0_y = F - y,
	          ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
	      return [Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ];
	    };
	    return forward;
	  }
	  (d3.geo.conicConformal = function () {
	    return d3_geo_conic(d3_geo_conicConformal);
	  }).raw = d3_geo_conicConformal;
	  function d3_geo_conicEquidistant(φ0, φ1) {
	    var cosφ0 = Math.cos(φ0),
	        n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0),
	        G = cosφ0 / n + φ0;
	    if (abs(n) < ε) return d3_geo_equirectangular;
	    function forward(λ, φ) {
	      var ρ = G - φ;
	      return [ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ)];
	    }
	    forward.invert = function (x, y) {
	      var ρ0_y = G - y;
	      return [Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y)];
	    };
	    return forward;
	  }
	  (d3.geo.conicEquidistant = function () {
	    return d3_geo_conic(d3_geo_conicEquidistant);
	  }).raw = d3_geo_conicEquidistant;
	  var d3_geo_gnomonic = d3_geo_azimuthal(function (cosλcosφ) {
	    return 1 / cosλcosφ;
	  }, Math.atan);
	  (d3.geo.gnomonic = function () {
	    return d3_geo_projection(d3_geo_gnomonic);
	  }).raw = d3_geo_gnomonic;
	  function d3_geo_mercator(λ, φ) {
	    return [λ, Math.log(Math.tan(π / 4 + φ / 2))];
	  }
	  d3_geo_mercator.invert = function (x, y) {
	    return [x, 2 * Math.atan(Math.exp(y)) - halfπ];
	  };
	  function d3_geo_mercatorProjection(project) {
	    var m = d3_geo_projection(project),
	        scale = m.scale,
	        translate = m.translate,
	        clipExtent = m.clipExtent,
	        clipAuto;
	    m.scale = function () {
	      var v = scale.apply(m, arguments);
	      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
	    };
	    m.translate = function () {
	      var v = translate.apply(m, arguments);
	      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
	    };
	    m.clipExtent = function (_) {
	      var v = clipExtent.apply(m, arguments);
	      if (v === m) {
	        if (clipAuto = _ == null) {
	          var k = π * scale(),
	              t = translate();
	          clipExtent([[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]]);
	        }
	      } else if (clipAuto) {
	        v = null;
	      }
	      return v;
	    };
	    return m.clipExtent(null);
	  }
	  (d3.geo.mercator = function () {
	    return d3_geo_mercatorProjection(d3_geo_mercator);
	  }).raw = d3_geo_mercator;
	  var d3_geo_orthographic = d3_geo_azimuthal(function () {
	    return 1;
	  }, Math.asin);
	  (d3.geo.orthographic = function () {
	    return d3_geo_projection(d3_geo_orthographic);
	  }).raw = d3_geo_orthographic;
	  var d3_geo_stereographic = d3_geo_azimuthal(function (cosλcosφ) {
	    return 1 / (1 + cosλcosφ);
	  }, function (ρ) {
	    return 2 * Math.atan(ρ);
	  });
	  (d3.geo.stereographic = function () {
	    return d3_geo_projection(d3_geo_stereographic);
	  }).raw = d3_geo_stereographic;
	  function d3_geo_transverseMercator(λ, φ) {
	    return [Math.log(Math.tan(π / 4 + φ / 2)), -λ];
	  }
	  d3_geo_transverseMercator.invert = function (x, y) {
	    return [-y, 2 * Math.atan(Math.exp(x)) - halfπ];
	  };
	  (d3.geo.transverseMercator = function () {
	    var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator),
	        center = projection.center,
	        rotate = projection.rotate;
	    projection.center = function (_) {
	      return _ ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]]);
	    };
	    projection.rotate = function (_) {
	      return _ ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
	    };
	    return rotate([0, 0, 90]);
	  }).raw = d3_geo_transverseMercator;
	  d3.geom = {};
	  function d3_geom_pointX(d) {
	    return d[0];
	  }
	  function d3_geom_pointY(d) {
	    return d[1];
	  }
	  d3.geom.hull = function (vertices) {
	    var x = d3_geom_pointX,
	        y = d3_geom_pointY;
	    if (arguments.length) return hull(vertices);
	    function hull(data) {
	      if (data.length < 3) return [];
	      var fx = d3_functor(x),
	          fy = d3_functor(y),
	          i,
	          n = data.length,
	          points = [],
	          flippedPoints = [];
	      for (i = 0; i < n; i++) {
	        points.push([+fx.call(this, data[i], i), +fy.call(this, data[i], i), i]);
	      }
	      points.sort(d3_geom_hullOrder);
	      for (i = 0; i < n; i++) flippedPoints.push([points[i][0], -points[i][1]]);
	      var upper = d3_geom_hullUpper(points),
	          lower = d3_geom_hullUpper(flippedPoints);
	      var skipLeft = lower[0] === upper[0],
	          skipRight = lower[lower.length - 1] === upper[upper.length - 1],
	          polygon = [];
	      for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]]);
	      for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]]);
	      return polygon;
	    }
	    hull.x = function (_) {
	      return arguments.length ? (x = _, hull) : x;
	    };
	    hull.y = function (_) {
	      return arguments.length ? (y = _, hull) : y;
	    };
	    return hull;
	  };
	  function d3_geom_hullUpper(points) {
	    var n = points.length,
	        hull = [0, 1],
	        hs = 2;
	    for (var i = 2; i < n; i++) {
	      while (hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0) --hs;
	      hull[hs++] = i;
	    }
	    return hull.slice(0, hs);
	  }
	  function d3_geom_hullOrder(a, b) {
	    return a[0] - b[0] || a[1] - b[1];
	  }
	  d3.geom.polygon = function (coordinates) {
	    d3_subclass(coordinates, d3_geom_polygonPrototype);
	    return coordinates;
	  };
	  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];
	  d3_geom_polygonPrototype.area = function () {
	    var i = -1,
	        n = this.length,
	        a,
	        b = this[n - 1],
	        area = 0;
	    while (++i < n) {
	      a = b;
	      b = this[i];
	      area += a[1] * b[0] - a[0] * b[1];
	    }
	    return area * .5;
	  };
	  d3_geom_polygonPrototype.centroid = function (k) {
	    var i = -1,
	        n = this.length,
	        x = 0,
	        y = 0,
	        a,
	        b = this[n - 1],
	        c;
	    if (!arguments.length) k = -1 / (6 * this.area());
	    while (++i < n) {
	      a = b;
	      b = this[i];
	      c = a[0] * b[1] - b[0] * a[1];
	      x += (a[0] + b[0]) * c;
	      y += (a[1] + b[1]) * c;
	    }
	    return [x * k, y * k];
	  };
	  d3_geom_polygonPrototype.clip = function (subject) {
	    var input,
	        closed = d3_geom_polygonClosed(subject),
	        i = -1,
	        n = this.length - d3_geom_polygonClosed(this),
	        j,
	        m,
	        a = this[n - 1],
	        b,
	        c,
	        d;
	    while (++i < n) {
	      input = subject.slice();
	      subject.length = 0;
	      b = this[i];
	      c = input[(m = input.length - closed) - 1];
	      j = -1;
	      while (++j < m) {
	        d = input[j];
	        if (d3_geom_polygonInside(d, a, b)) {
	          if (!d3_geom_polygonInside(c, a, b)) {
	            subject.push(d3_geom_polygonIntersect(c, d, a, b));
	          }
	          subject.push(d);
	        } else if (d3_geom_polygonInside(c, a, b)) {
	          subject.push(d3_geom_polygonIntersect(c, d, a, b));
	        }
	        c = d;
	      }
	      if (closed) subject.push(subject[0]);
	      a = b;
	    }
	    return subject;
	  };
	  function d3_geom_polygonInside(p, a, b) {
	    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
	  }
	  function d3_geom_polygonIntersect(c, d, a, b) {
	    var x1 = c[0],
	        x3 = a[0],
	        x21 = d[0] - x1,
	        x43 = b[0] - x3,
	        y1 = c[1],
	        y3 = a[1],
	        y21 = d[1] - y1,
	        y43 = b[1] - y3,
	        ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
	    return [x1 + ua * x21, y1 + ua * y21];
	  }
	  function d3_geom_polygonClosed(coordinates) {
	    var a = coordinates[0],
	        b = coordinates[coordinates.length - 1];
	    return !(a[0] - b[0] || a[1] - b[1]);
	  }
	  var d3_geom_voronoiEdges,
	      d3_geom_voronoiCells,
	      d3_geom_voronoiBeaches,
	      d3_geom_voronoiBeachPool = [],
	      d3_geom_voronoiFirstCircle,
	      d3_geom_voronoiCircles,
	      d3_geom_voronoiCirclePool = [];
	  function d3_geom_voronoiBeach() {
	    d3_geom_voronoiRedBlackNode(this);
	    this.edge = this.site = this.circle = null;
	  }
	  function d3_geom_voronoiCreateBeach(site) {
	    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();
	    beach.site = site;
	    return beach;
	  }
	  function d3_geom_voronoiDetachBeach(beach) {
	    d3_geom_voronoiDetachCircle(beach);
	    d3_geom_voronoiBeaches.remove(beach);
	    d3_geom_voronoiBeachPool.push(beach);
	    d3_geom_voronoiRedBlackNode(beach);
	  }
	  function d3_geom_voronoiRemoveBeach(beach) {
	    var circle = beach.circle,
	        x = circle.x,
	        y = circle.cy,
	        vertex = {
	      x: x,
	      y: y
	    },
	        previous = beach.P,
	        next = beach.N,
	        disappearing = [beach];
	    d3_geom_voronoiDetachBeach(beach);
	    var lArc = previous;
	    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {
	      previous = lArc.P;
	      disappearing.unshift(lArc);
	      d3_geom_voronoiDetachBeach(lArc);
	      lArc = previous;
	    }
	    disappearing.unshift(lArc);
	    d3_geom_voronoiDetachCircle(lArc);
	    var rArc = next;
	    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {
	      next = rArc.N;
	      disappearing.push(rArc);
	      d3_geom_voronoiDetachBeach(rArc);
	      rArc = next;
	    }
	    disappearing.push(rArc);
	    d3_geom_voronoiDetachCircle(rArc);
	    var nArcs = disappearing.length,
	        iArc;
	    for (iArc = 1; iArc < nArcs; ++iArc) {
	      rArc = disappearing[iArc];
	      lArc = disappearing[iArc - 1];
	      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
	    }
	    lArc = disappearing[0];
	    rArc = disappearing[nArcs - 1];
	    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);
	    d3_geom_voronoiAttachCircle(lArc);
	    d3_geom_voronoiAttachCircle(rArc);
	  }
	  function d3_geom_voronoiAddBeach(site) {
	    var x = site.x,
	        directrix = site.y,
	        lArc,
	        rArc,
	        dxl,
	        dxr,
	        node = d3_geom_voronoiBeaches._;
	    while (node) {
	      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;
	      if (dxl > ε) node = node.L;else {
	        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);
	        if (dxr > ε) {
	          if (!node.R) {
	            lArc = node;
	            break;
	          }
	          node = node.R;
	        } else {
	          if (dxl > -ε) {
	            lArc = node.P;
	            rArc = node;
	          } else if (dxr > -ε) {
	            lArc = node;
	            rArc = node.N;
	          } else {
	            lArc = rArc = node;
	          }
	          break;
	        }
	      }
	    }
	    var newArc = d3_geom_voronoiCreateBeach(site);
	    d3_geom_voronoiBeaches.insert(lArc, newArc);
	    if (!lArc && !rArc) return;
	    if (lArc === rArc) {
	      d3_geom_voronoiDetachCircle(lArc);
	      rArc = d3_geom_voronoiCreateBeach(lArc.site);
	      d3_geom_voronoiBeaches.insert(newArc, rArc);
	      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
	      d3_geom_voronoiAttachCircle(lArc);
	      d3_geom_voronoiAttachCircle(rArc);
	      return;
	    }
	    if (!rArc) {
	      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
	      return;
	    }
	    d3_geom_voronoiDetachCircle(lArc);
	    d3_geom_voronoiDetachCircle(rArc);
	    var lSite = lArc.site,
	        ax = lSite.x,
	        ay = lSite.y,
	        bx = site.x - ax,
	        by = site.y - ay,
	        rSite = rArc.site,
	        cx = rSite.x - ax,
	        cy = rSite.y - ay,
	        d = 2 * (bx * cy - by * cx),
	        hb = bx * bx + by * by,
	        hc = cx * cx + cy * cy,
	        vertex = {
	      x: (cy * hb - by * hc) / d + ax,
	      y: (bx * hc - cx * hb) / d + ay
	    };
	    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);
	    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);
	    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);
	    d3_geom_voronoiAttachCircle(lArc);
	    d3_geom_voronoiAttachCircle(rArc);
	  }
	  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {
	    var site = arc.site,
	        rfocx = site.x,
	        rfocy = site.y,
	        pby2 = rfocy - directrix;
	    if (!pby2) return rfocx;
	    var lArc = arc.P;
	    if (!lArc) return -Infinity;
	    site = lArc.site;
	    var lfocx = site.x,
	        lfocy = site.y,
	        plby2 = lfocy - directrix;
	    if (!plby2) return lfocx;
	    var hl = lfocx - rfocx,
	        aby2 = 1 / pby2 - 1 / plby2,
	        b = hl / plby2;
	    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
	    return (rfocx + lfocx) / 2;
	  }
	  function d3_geom_voronoiRightBreakPoint(arc, directrix) {
	    var rArc = arc.N;
	    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);
	    var site = arc.site;
	    return site.y === directrix ? site.x : Infinity;
	  }
	  function d3_geom_voronoiCell(site) {
	    this.site = site;
	    this.edges = [];
	  }
	  d3_geom_voronoiCell.prototype.prepare = function () {
	    var halfEdges = this.edges,
	        iHalfEdge = halfEdges.length,
	        edge;
	    while (iHalfEdge--) {
	      edge = halfEdges[iHalfEdge].edge;
	      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);
	    }
	    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);
	    return halfEdges.length;
	  };
	  function d3_geom_voronoiCloseCells(extent) {
	    var x0 = extent[0][0],
	        x1 = extent[1][0],
	        y0 = extent[0][1],
	        y1 = extent[1][1],
	        x2,
	        y2,
	        x3,
	        y3,
	        cells = d3_geom_voronoiCells,
	        iCell = cells.length,
	        cell,
	        iHalfEdge,
	        halfEdges,
	        nHalfEdges,
	        start,
	        end;
	    while (iCell--) {
	      cell = cells[iCell];
	      if (!cell || !cell.prepare()) continue;
	      halfEdges = cell.edges;
	      nHalfEdges = halfEdges.length;
	      iHalfEdge = 0;
	      while (iHalfEdge < nHalfEdges) {
	        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;
	        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;
	        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {
	          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {
	            x: x0,
	            y: abs(x2 - x0) < ε ? y2 : y1
	          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {
	            x: abs(y2 - y1) < ε ? x2 : x1,
	            y: y1
	          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {
	            x: x1,
	            y: abs(x2 - x1) < ε ? y2 : y0
	          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {
	            x: abs(y2 - y0) < ε ? x2 : x0,
	            y: y0
	          } : null), cell.site, null));
	          ++nHalfEdges;
	        }
	      }
	    }
	  }
	  function d3_geom_voronoiHalfEdgeOrder(a, b) {
	    return b.angle - a.angle;
	  }
	  function d3_geom_voronoiCircle() {
	    d3_geom_voronoiRedBlackNode(this);
	    this.x = this.y = this.arc = this.site = this.cy = null;
	  }
	  function d3_geom_voronoiAttachCircle(arc) {
	    var lArc = arc.P,
	        rArc = arc.N;
	    if (!lArc || !rArc) return;
	    var lSite = lArc.site,
	        cSite = arc.site,
	        rSite = rArc.site;
	    if (lSite === rSite) return;
	    var bx = cSite.x,
	        by = cSite.y,
	        ax = lSite.x - bx,
	        ay = lSite.y - by,
	        cx = rSite.x - bx,
	        cy = rSite.y - by;
	    var d = 2 * (ax * cy - ay * cx);
	    if (d >= -ε2) return;
	    var ha = ax * ax + ay * ay,
	        hc = cx * cx + cy * cy,
	        x = (cy * ha - ay * hc) / d,
	        y = (ax * hc - cx * ha) / d,
	        cy = y + by;
	    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();
	    circle.arc = arc;
	    circle.site = cSite;
	    circle.x = x + bx;
	    circle.y = cy + Math.sqrt(x * x + y * y);
	    circle.cy = cy;
	    arc.circle = circle;
	    var before = null,
	        node = d3_geom_voronoiCircles._;
	    while (node) {
	      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
	        if (node.L) node = node.L;else {
	          before = node.P;
	          break;
	        }
	      } else {
	        if (node.R) node = node.R;else {
	          before = node;
	          break;
	        }
	      }
	    }
	    d3_geom_voronoiCircles.insert(before, circle);
	    if (!before) d3_geom_voronoiFirstCircle = circle;
	  }
	  function d3_geom_voronoiDetachCircle(arc) {
	    var circle = arc.circle;
	    if (circle) {
	      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;
	      d3_geom_voronoiCircles.remove(circle);
	      d3_geom_voronoiCirclePool.push(circle);
	      d3_geom_voronoiRedBlackNode(circle);
	      arc.circle = null;
	    }
	  }
	  function d3_geom_voronoiClipEdges(extent) {
	    var edges = d3_geom_voronoiEdges,
	        clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]),
	        i = edges.length,
	        e;
	    while (i--) {
	      e = edges[i];
	      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {
	        e.a = e.b = null;
	        edges.splice(i, 1);
	      }
	    }
	  }
	  function d3_geom_voronoiConnectEdge(edge, extent) {
	    var vb = edge.b;
	    if (vb) return true;
	    var va = edge.a,
	        x0 = extent[0][0],
	        x1 = extent[1][0],
	        y0 = extent[0][1],
	        y1 = extent[1][1],
	        lSite = edge.l,
	        rSite = edge.r,
	        lx = lSite.x,
	        ly = lSite.y,
	        rx = rSite.x,
	        ry = rSite.y,
	        fx = (lx + rx) / 2,
	        fy = (ly + ry) / 2,
	        fm,
	        fb;
	    if (ry === ly) {
	      if (fx < x0 || fx >= x1) return;
	      if (lx > rx) {
	        if (!va) va = {
	          x: fx,
	          y: y0
	        };else if (va.y >= y1) return;
	        vb = {
	          x: fx,
	          y: y1
	        };
	      } else {
	        if (!va) va = {
	          x: fx,
	          y: y1
	        };else if (va.y < y0) return;
	        vb = {
	          x: fx,
	          y: y0
	        };
	      }
	    } else {
	      fm = (lx - rx) / (ry - ly);
	      fb = fy - fm * fx;
	      if (fm < -1 || fm > 1) {
	        if (lx > rx) {
	          if (!va) va = {
	            x: (y0 - fb) / fm,
	            y: y0
	          };else if (va.y >= y1) return;
	          vb = {
	            x: (y1 - fb) / fm,
	            y: y1
	          };
	        } else {
	          if (!va) va = {
	            x: (y1 - fb) / fm,
	            y: y1
	          };else if (va.y < y0) return;
	          vb = {
	            x: (y0 - fb) / fm,
	            y: y0
	          };
	        }
	      } else {
	        if (ly < ry) {
	          if (!va) va = {
	            x: x0,
	            y: fm * x0 + fb
	          };else if (va.x >= x1) return;
	          vb = {
	            x: x1,
	            y: fm * x1 + fb
	          };
	        } else {
	          if (!va) va = {
	            x: x1,
	            y: fm * x1 + fb
	          };else if (va.x < x0) return;
	          vb = {
	            x: x0,
	            y: fm * x0 + fb
	          };
	        }
	      }
	    }
	    edge.a = va;
	    edge.b = vb;
	    return true;
	  }
	  function d3_geom_voronoiEdge(lSite, rSite) {
	    this.l = lSite;
	    this.r = rSite;
	    this.a = this.b = null;
	  }
	  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {
	    var edge = new d3_geom_voronoiEdge(lSite, rSite);
	    d3_geom_voronoiEdges.push(edge);
	    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);
	    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);
	    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));
	    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));
	    return edge;
	  }
	  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {
	    var edge = new d3_geom_voronoiEdge(lSite, null);
	    edge.a = va;
	    edge.b = vb;
	    d3_geom_voronoiEdges.push(edge);
	    return edge;
	  }
	  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {
	    if (!edge.a && !edge.b) {
	      edge.a = vertex;
	      edge.l = lSite;
	      edge.r = rSite;
	    } else if (edge.l === rSite) {
	      edge.b = vertex;
	    } else {
	      edge.a = vertex;
	    }
	  }
	  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {
	    var va = edge.a,
	        vb = edge.b;
	    this.edge = edge;
	    this.site = lSite;
	    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);
	  }
	  d3_geom_voronoiHalfEdge.prototype = {
	    start: function () {
	      return this.edge.l === this.site ? this.edge.a : this.edge.b;
	    },
	    end: function () {
	      return this.edge.l === this.site ? this.edge.b : this.edge.a;
	    }
	  };
	  function d3_geom_voronoiRedBlackTree() {
	    this._ = null;
	  }
	  function d3_geom_voronoiRedBlackNode(node) {
	    node.U = node.C = node.L = node.R = node.P = node.N = null;
	  }
	  d3_geom_voronoiRedBlackTree.prototype = {
	    insert: function (after, node) {
	      var parent, grandpa, uncle;
	      if (after) {
	        node.P = after;
	        node.N = after.N;
	        if (after.N) after.N.P = node;
	        after.N = node;
	        if (after.R) {
	          after = after.R;
	          while (after.L) after = after.L;
	          after.L = node;
	        } else {
	          after.R = node;
	        }
	        parent = after;
	      } else if (this._) {
	        after = d3_geom_voronoiRedBlackFirst(this._);
	        node.P = null;
	        node.N = after;
	        after.P = after.L = node;
	        parent = after;
	      } else {
	        node.P = node.N = null;
	        this._ = node;
	        parent = null;
	      }
	      node.L = node.R = null;
	      node.U = parent;
	      node.C = true;
	      after = node;
	      while (parent && parent.C) {
	        grandpa = parent.U;
	        if (parent === grandpa.L) {
	          uncle = grandpa.R;
	          if (uncle && uncle.C) {
	            parent.C = uncle.C = false;
	            grandpa.C = true;
	            after = grandpa;
	          } else {
	            if (after === parent.R) {
	              d3_geom_voronoiRedBlackRotateLeft(this, parent);
	              after = parent;
	              parent = after.U;
	            }
	            parent.C = false;
	            grandpa.C = true;
	            d3_geom_voronoiRedBlackRotateRight(this, grandpa);
	          }
	        } else {
	          uncle = grandpa.L;
	          if (uncle && uncle.C) {
	            parent.C = uncle.C = false;
	            grandpa.C = true;
	            after = grandpa;
	          } else {
	            if (after === parent.L) {
	              d3_geom_voronoiRedBlackRotateRight(this, parent);
	              after = parent;
	              parent = after.U;
	            }
	            parent.C = false;
	            grandpa.C = true;
	            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);
	          }
	        }
	        parent = after.U;
	      }
	      this._.C = false;
	    },
	    remove: function (node) {
	      if (node.N) node.N.P = node.P;
	      if (node.P) node.P.N = node.N;
	      node.N = node.P = null;
	      var parent = node.U,
	          sibling,
	          left = node.L,
	          right = node.R,
	          next,
	          red;
	      if (!left) next = right;else if (!right) next = left;else next = d3_geom_voronoiRedBlackFirst(right);
	      if (parent) {
	        if (parent.L === node) parent.L = next;else parent.R = next;
	      } else {
	        this._ = next;
	      }
	      if (left && right) {
	        red = next.C;
	        next.C = node.C;
	        next.L = left;
	        left.U = next;
	        if (next !== right) {
	          parent = next.U;
	          next.U = node.U;
	          node = next.R;
	          parent.L = node;
	          next.R = right;
	          right.U = next;
	        } else {
	          next.U = parent;
	          parent = next;
	          node = next.R;
	        }
	      } else {
	        red = node.C;
	        node = next;
	      }
	      if (node) node.U = parent;
	      if (red) return;
	      if (node && node.C) {
	        node.C = false;
	        return;
	      }
	      do {
	        if (node === this._) break;
	        if (node === parent.L) {
	          sibling = parent.R;
	          if (sibling.C) {
	            sibling.C = false;
	            parent.C = true;
	            d3_geom_voronoiRedBlackRotateLeft(this, parent);
	            sibling = parent.R;
	          }
	          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
	            if (!sibling.R || !sibling.R.C) {
	              sibling.L.C = false;
	              sibling.C = true;
	              d3_geom_voronoiRedBlackRotateRight(this, sibling);
	              sibling = parent.R;
	            }
	            sibling.C = parent.C;
	            parent.C = sibling.R.C = false;
	            d3_geom_voronoiRedBlackRotateLeft(this, parent);
	            node = this._;
	            break;
	          }
	        } else {
	          sibling = parent.L;
	          if (sibling.C) {
	            sibling.C = false;
	            parent.C = true;
	            d3_geom_voronoiRedBlackRotateRight(this, parent);
	            sibling = parent.L;
	          }
	          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
	            if (!sibling.L || !sibling.L.C) {
	              sibling.R.C = false;
	              sibling.C = true;
	              d3_geom_voronoiRedBlackRotateLeft(this, sibling);
	              sibling = parent.L;
	            }
	            sibling.C = parent.C;
	            parent.C = sibling.L.C = false;
	            d3_geom_voronoiRedBlackRotateRight(this, parent);
	            node = this._;
	            break;
	          }
	        }
	        sibling.C = true;
	        node = parent;
	        parent = parent.U;
	      } while (!node.C);
	      if (node) node.C = false;
	    }
	  };
	  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {
	    var p = node,
	        q = node.R,
	        parent = p.U;
	    if (parent) {
	      if (parent.L === p) parent.L = q;else parent.R = q;
	    } else {
	      tree._ = q;
	    }
	    q.U = parent;
	    p.U = q;
	    p.R = q.L;
	    if (p.R) p.R.U = p;
	    q.L = p;
	  }
	  function d3_geom_voronoiRedBlackRotateRight(tree, node) {
	    var p = node,
	        q = node.L,
	        parent = p.U;
	    if (parent) {
	      if (parent.L === p) parent.L = q;else parent.R = q;
	    } else {
	      tree._ = q;
	    }
	    q.U = parent;
	    p.U = q;
	    p.L = q.R;
	    if (p.L) p.L.U = p;
	    q.R = p;
	  }
	  function d3_geom_voronoiRedBlackFirst(node) {
	    while (node.L) node = node.L;
	    return node;
	  }
	  function d3_geom_voronoi(sites, bbox) {
	    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(),
	        x0,
	        y0,
	        circle;
	    d3_geom_voronoiEdges = [];
	    d3_geom_voronoiCells = new Array(sites.length);
	    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();
	    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();
	    while (true) {
	      circle = d3_geom_voronoiFirstCircle;
	      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
	        if (site.x !== x0 || site.y !== y0) {
	          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);
	          d3_geom_voronoiAddBeach(site);
	          x0 = site.x, y0 = site.y;
	        }
	        site = sites.pop();
	      } else if (circle) {
	        d3_geom_voronoiRemoveBeach(circle.arc);
	      } else {
	        break;
	      }
	    }
	    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);
	    var diagram = {
	      cells: d3_geom_voronoiCells,
	      edges: d3_geom_voronoiEdges
	    };
	    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;
	    return diagram;
	  }
	  function d3_geom_voronoiVertexOrder(a, b) {
	    return b.y - a.y || b.x - a.x;
	  }
	  d3.geom.voronoi = function (points) {
	    var x = d3_geom_pointX,
	        y = d3_geom_pointY,
	        fx = x,
	        fy = y,
	        clipExtent = d3_geom_voronoiClipExtent;
	    if (points) return voronoi(points);
	    function voronoi(data) {
	      var polygons = new Array(data.length),
	          x0 = clipExtent[0][0],
	          y0 = clipExtent[0][1],
	          x1 = clipExtent[1][0],
	          y1 = clipExtent[1][1];
	      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function (cell, i) {
	        var edges = cell.edges,
	            site = cell.site,
	            polygon = polygons[i] = edges.length ? edges.map(function (e) {
	          var s = e.start();
	          return [s.x, s.y];
	        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [[x0, y1], [x1, y1], [x1, y0], [x0, y0]] : [];
	        polygon.point = data[i];
	      });
	      return polygons;
	    }
	    function sites(data) {
	      return data.map(function (d, i) {
	        return {
	          x: Math.round(fx(d, i) / ε) * ε,
	          y: Math.round(fy(d, i) / ε) * ε,
	          i: i
	        };
	      });
	    }
	    voronoi.links = function (data) {
	      return d3_geom_voronoi(sites(data)).edges.filter(function (edge) {
	        return edge.l && edge.r;
	      }).map(function (edge) {
	        return {
	          source: data[edge.l.i],
	          target: data[edge.r.i]
	        };
	      });
	    };
	    voronoi.triangles = function (data) {
	      var triangles = [];
	      d3_geom_voronoi(sites(data)).cells.forEach(function (cell, i) {
	        var site = cell.site,
	            edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder),
	            j = -1,
	            m = edges.length,
	            e0,
	            s0,
	            e1 = edges[m - 1].edge,
	            s1 = e1.l === site ? e1.r : e1.l;
	        while (++j < m) {
	          e0 = e1;
	          s0 = s1;
	          e1 = edges[j].edge;
	          s1 = e1.l === site ? e1.r : e1.l;
	          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {
	            triangles.push([data[i], data[s0.i], data[s1.i]]);
	          }
	        }
	      });
	      return triangles;
	    };
	    voronoi.x = function (_) {
	      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;
	    };
	    voronoi.y = function (_) {
	      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;
	    };
	    voronoi.clipExtent = function (_) {
	      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;
	      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;
	      return voronoi;
	    };
	    voronoi.size = function (_) {
	      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];
	      return voronoi.clipExtent(_ && [[0, 0], _]);
	    };
	    return voronoi;
	  };
	  var d3_geom_voronoiClipExtent = [[-1e6, -1e6], [1e6, 1e6]];
	  function d3_geom_voronoiTriangleArea(a, b, c) {
	    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);
	  }
	  d3.geom.delaunay = function (vertices) {
	    return d3.geom.voronoi().triangles(vertices);
	  };
	  d3.geom.quadtree = function (points, x1, y1, x2, y2) {
	    var x = d3_geom_pointX,
	        y = d3_geom_pointY,
	        compat;
	    if (compat = arguments.length) {
	      x = d3_geom_quadtreeCompatX;
	      y = d3_geom_quadtreeCompatY;
	      if (compat === 3) {
	        y2 = y1;
	        x2 = x1;
	        y1 = x1 = 0;
	      }
	      return quadtree(points);
	    }
	    function quadtree(data) {
	      var d,
	          fx = d3_functor(x),
	          fy = d3_functor(y),
	          xs,
	          ys,
	          i,
	          n,
	          x1_,
	          y1_,
	          x2_,
	          y2_;
	      if (x1 != null) {
	        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
	      } else {
	        x2_ = y2_ = -(x1_ = y1_ = Infinity);
	        xs = [], ys = [];
	        n = data.length;
	        if (compat) for (i = 0; i < n; ++i) {
	          d = data[i];
	          if (d.x < x1_) x1_ = d.x;
	          if (d.y < y1_) y1_ = d.y;
	          if (d.x > x2_) x2_ = d.x;
	          if (d.y > y2_) y2_ = d.y;
	          xs.push(d.x);
	          ys.push(d.y);
	        } else for (i = 0; i < n; ++i) {
	          var x_ = +fx(d = data[i], i),
	              y_ = +fy(d, i);
	          if (x_ < x1_) x1_ = x_;
	          if (y_ < y1_) y1_ = y_;
	          if (x_ > x2_) x2_ = x_;
	          if (y_ > y2_) y2_ = y_;
	          xs.push(x_);
	          ys.push(y_);
	        }
	      }
	      var dx = x2_ - x1_,
	          dy = y2_ - y1_;
	      if (dx > dy) y2_ = y1_ + dx;else x2_ = x1_ + dy;
	      function insert(n, d, x, y, x1, y1, x2, y2) {
	        if (isNaN(x) || isNaN(y)) return;
	        if (n.leaf) {
	          var nx = n.x,
	              ny = n.y;
	          if (nx != null) {
	            if (abs(nx - x) + abs(ny - y) < .01) {
	              insertChild(n, d, x, y, x1, y1, x2, y2);
	            } else {
	              var nPoint = n.point;
	              n.x = n.y = n.point = null;
	              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
	              insertChild(n, d, x, y, x1, y1, x2, y2);
	            }
	          } else {
	            n.x = x, n.y = y, n.point = d;
	          }
	        } else {
	          insertChild(n, d, x, y, x1, y1, x2, y2);
	        }
	      }
	      function insertChild(n, d, x, y, x1, y1, x2, y2) {
	        var xm = (x1 + x2) * .5,
	            ym = (y1 + y2) * .5,
	            right = x >= xm,
	            below = y >= ym,
	            i = below << 1 | right;
	        n.leaf = false;
	        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
	        if (right) x1 = xm;else x2 = xm;
	        if (below) y1 = ym;else y2 = ym;
	        insert(n, d, x, y, x1, y1, x2, y2);
	      }
	      var root = d3_geom_quadtreeNode();
	      root.add = function (d) {
	        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
	      };
	      root.visit = function (f) {
	        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
	      };
	      root.find = function (point) {
	        return d3_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_);
	      };
	      i = -1;
	      if (x1 == null) {
	        while (++i < n) {
	          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
	        }
	        --i;
	      } else data.forEach(root.add);
	      xs = ys = data = d = null;
	      return root;
	    }
	    quadtree.x = function (_) {
	      return arguments.length ? (x = _, quadtree) : x;
	    };
	    quadtree.y = function (_) {
	      return arguments.length ? (y = _, quadtree) : y;
	    };
	    quadtree.extent = function (_) {
	      if (!arguments.length) return x1 == null ? null : [[x1, y1], [x2, y2]];
	      if (_ == null) x1 = y1 = x2 = y2 = null;else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], y2 = +_[1][1];
	      return quadtree;
	    };
	    quadtree.size = function (_) {
	      if (!arguments.length) return x1 == null ? null : [x2 - x1, y2 - y1];
	      if (_ == null) x1 = y1 = x2 = y2 = null;else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
	      return quadtree;
	    };
	    return quadtree;
	  };
	  function d3_geom_quadtreeCompatX(d) {
	    return d.x;
	  }
	  function d3_geom_quadtreeCompatY(d) {
	    return d.y;
	  }
	  function d3_geom_quadtreeNode() {
	    return {
	      leaf: true,
	      nodes: [],
	      point: null,
	      x: null,
	      y: null
	    };
	  }
	  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
	    if (!f(node, x1, y1, x2, y2)) {
	      var sx = (x1 + x2) * .5,
	          sy = (y1 + y2) * .5,
	          children = node.nodes;
	      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
	      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
	      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
	      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
	    }
	  }
	  function d3_geom_quadtreeFind(root, x, y, x0, y0, x3, y3) {
	    var minDistance2 = Infinity,
	        closestPoint;
	    (function find(node, x1, y1, x2, y2) {
	      if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return;
	      if (point = node.point) {
	        var point,
	            dx = x - node.x,
	            dy = y - node.y,
	            distance2 = dx * dx + dy * dy;
	        if (distance2 < minDistance2) {
	          var distance = Math.sqrt(minDistance2 = distance2);
	          x0 = x - distance, y0 = y - distance;
	          x3 = x + distance, y3 = y + distance;
	          closestPoint = point;
	        }
	      }
	      var children = node.nodes,
	          xm = (x1 + x2) * .5,
	          ym = (y1 + y2) * .5,
	          right = x >= xm,
	          below = y >= ym;
	      for (var i = below << 1 | right, j = i + 4; i < j; ++i) {
	        if (node = children[i & 3]) switch (i & 3) {
	          case 0:
	            find(node, x1, y1, xm, ym);
	            break;

	          case 1:
	            find(node, xm, y1, x2, ym);
	            break;

	          case 2:
	            find(node, x1, ym, xm, y2);
	            break;

	          case 3:
	            find(node, xm, ym, x2, y2);
	            break;
	        }
	      }
	    })(root, x0, y0, x3, y3);
	    return closestPoint;
	  }
	  d3.interpolateRgb = d3_interpolateRgb;
	  function d3_interpolateRgb(a, b) {
	    a = d3.rgb(a);
	    b = d3.rgb(b);
	    var ar = a.r,
	        ag = a.g,
	        ab = a.b,
	        br = b.r - ar,
	        bg = b.g - ag,
	        bb = b.b - ab;
	    return function (t) {
	      return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
	    };
	  }
	  d3.interpolateObject = d3_interpolateObject;
	  function d3_interpolateObject(a, b) {
	    var i = {},
	        c = {},
	        k;
	    for (k in a) {
	      if (k in b) {
	        i[k] = d3_interpolate(a[k], b[k]);
	      } else {
	        c[k] = a[k];
	      }
	    }
	    for (k in b) {
	      if (!(k in a)) {
	        c[k] = b[k];
	      }
	    }
	    return function (t) {
	      for (k in i) c[k] = i[k](t);
	      return c;
	    };
	  }
	  d3.interpolateNumber = d3_interpolateNumber;
	  function d3_interpolateNumber(a, b) {
	    a = +a, b = +b;
	    return function (t) {
	      return a * (1 - t) + b * t;
	    };
	  }
	  d3.interpolateString = d3_interpolateString;
	  function d3_interpolateString(a, b) {
	    var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0,
	        am,
	        bm,
	        bs,
	        i = -1,
	        s = [],
	        q = [];
	    a = a + "", b = b + "";
	    while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {
	      if ((bs = bm.index) > bi) {
	        bs = b.slice(bi, bs);
	        if (s[i]) s[i] += bs;else s[++i] = bs;
	      }
	      if ((am = am[0]) === (bm = bm[0])) {
	        if (s[i]) s[i] += bm;else s[++i] = bm;
	      } else {
	        s[++i] = null;
	        q.push({
	          i: i,
	          x: d3_interpolateNumber(am, bm)
	        });
	      }
	      bi = d3_interpolate_numberB.lastIndex;
	    }
	    if (bi < b.length) {
	      bs = b.slice(bi);
	      if (s[i]) s[i] += bs;else s[++i] = bs;
	    }
	    return s.length < 2 ? q[0] ? (b = q[0].x, function (t) {
	      return b(t) + "";
	    }) : function () {
	      return b;
	    } : (b = q.length, function (t) {
	      for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	      return s.join("");
	    });
	  }
	  var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
	      d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");
	  d3.interpolate = d3_interpolate;
	  function d3_interpolate(a, b) {
	    var i = d3.interpolators.length,
	        f;
	    while (--i >= 0 && !(f = d3.interpolators[i](a, b)));
	    return f;
	  }
	  d3.interpolators = [function (a, b) {
	    var t = typeof b;
	    return (t === "string" ? d3_rgb_names.has(b.toLowerCase()) || /^(#|rgb\(|hsl\()/i.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === "object" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);
	  }];
	  d3.interpolateArray = d3_interpolateArray;
	  function d3_interpolateArray(a, b) {
	    var x = [],
	        c = [],
	        na = a.length,
	        nb = b.length,
	        n0 = Math.min(a.length, b.length),
	        i;
	    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
	    for (; i < na; ++i) c[i] = a[i];
	    for (; i < nb; ++i) c[i] = b[i];
	    return function (t) {
	      for (i = 0; i < n0; ++i) c[i] = x[i](t);
	      return c;
	    };
	  }
	  var d3_ease_default = function () {
	    return d3_identity;
	  };
	  var d3_ease = d3.map({
	    linear: d3_ease_default,
	    poly: d3_ease_poly,
	    quad: function () {
	      return d3_ease_quad;
	    },
	    cubic: function () {
	      return d3_ease_cubic;
	    },
	    sin: function () {
	      return d3_ease_sin;
	    },
	    exp: function () {
	      return d3_ease_exp;
	    },
	    circle: function () {
	      return d3_ease_circle;
	    },
	    elastic: d3_ease_elastic,
	    back: d3_ease_back,
	    bounce: function () {
	      return d3_ease_bounce;
	    }
	  });
	  var d3_ease_mode = d3.map({
	    "in": d3_identity,
	    out: d3_ease_reverse,
	    "in-out": d3_ease_reflect,
	    "out-in": function (f) {
	      return d3_ease_reflect(d3_ease_reverse(f));
	    }
	  });
	  d3.ease = function (name) {
	    var i = name.indexOf("-"),
	        t = i >= 0 ? name.slice(0, i) : name,
	        m = i >= 0 ? name.slice(i + 1) : "in";
	    t = d3_ease.get(t) || d3_ease_default;
	    m = d3_ease_mode.get(m) || d3_identity;
	    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));
	  };
	  function d3_ease_clamp(f) {
	    return function (t) {
	      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
	    };
	  }
	  function d3_ease_reverse(f) {
	    return function (t) {
	      return 1 - f(1 - t);
	    };
	  }
	  function d3_ease_reflect(f) {
	    return function (t) {
	      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
	    };
	  }
	  function d3_ease_quad(t) {
	    return t * t;
	  }
	  function d3_ease_cubic(t) {
	    return t * t * t;
	  }
	  function d3_ease_cubicInOut(t) {
	    if (t <= 0) return 0;
	    if (t >= 1) return 1;
	    var t2 = t * t,
	        t3 = t2 * t;
	    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
	  }
	  function d3_ease_poly(e) {
	    return function (t) {
	      return Math.pow(t, e);
	    };
	  }
	  function d3_ease_sin(t) {
	    return 1 - Math.cos(t * halfπ);
	  }
	  function d3_ease_exp(t) {
	    return Math.pow(2, 10 * (t - 1));
	  }
	  function d3_ease_circle(t) {
	    return 1 - Math.sqrt(1 - t * t);
	  }
	  function d3_ease_elastic(a, p) {
	    var s;
	    if (arguments.length < 2) p = .45;
	    if (arguments.length) s = p / τ * Math.asin(1 / a);else a = 1, s = p / 4;
	    return function (t) {
	      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);
	    };
	  }
	  function d3_ease_back(s) {
	    if (!s) s = 1.70158;
	    return function (t) {
	      return t * t * ((s + 1) * t - s);
	    };
	  }
	  function d3_ease_bounce(t) {
	    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
	  }
	  d3.interpolateHcl = d3_interpolateHcl;
	  function d3_interpolateHcl(a, b) {
	    a = d3.hcl(a);
	    b = d3.hcl(b);
	    var ah = a.h,
	        ac = a.c,
	        al = a.l,
	        bh = b.h - ah,
	        bc = b.c - ac,
	        bl = b.l - al;
	    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;
	    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah;else if (bh > 180) bh -= 360;else if (bh < -180) bh += 360;
	    return function (t) {
	      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
	    };
	  }
	  d3.interpolateHsl = d3_interpolateHsl;
	  function d3_interpolateHsl(a, b) {
	    a = d3.hsl(a);
	    b = d3.hsl(b);
	    var ah = a.h,
	        as = a.s,
	        al = a.l,
	        bh = b.h - ah,
	        bs = b.s - as,
	        bl = b.l - al;
	    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;
	    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah;else if (bh > 180) bh -= 360;else if (bh < -180) bh += 360;
	    return function (t) {
	      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + "";
	    };
	  }
	  d3.interpolateLab = d3_interpolateLab;
	  function d3_interpolateLab(a, b) {
	    a = d3.lab(a);
	    b = d3.lab(b);
	    var al = a.l,
	        aa = a.a,
	        ab = a.b,
	        bl = b.l - al,
	        ba = b.a - aa,
	        bb = b.b - ab;
	    return function (t) {
	      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
	    };
	  }
	  d3.interpolateRound = d3_interpolateRound;
	  function d3_interpolateRound(a, b) {
	    b -= a;
	    return function (t) {
	      return Math.round(a + b * t);
	    };
	  }
	  d3.transform = function (string) {
	    var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
	    return (d3.transform = function (string) {
	      if (string != null) {
	        g.setAttribute("transform", string);
	        var t = g.transform.baseVal.consolidate();
	      }
	      return new d3_transform(t ? t.matrix : d3_transformIdentity);
	    })(string);
	  };
	  function d3_transform(m) {
	    var r0 = [m.a, m.b],
	        r1 = [m.c, m.d],
	        kx = d3_transformNormalize(r0),
	        kz = d3_transformDot(r0, r1),
	        ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
	    if (r0[0] * r1[1] < r1[0] * r0[1]) {
	      r0[0] *= -1;
	      r0[1] *= -1;
	      kx *= -1;
	      kz *= -1;
	    }
	    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
	    this.translate = [m.e, m.f];
	    this.scale = [kx, ky];
	    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
	  }
	  d3_transform.prototype.toString = function () {
	    return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";
	  };
	  function d3_transformDot(a, b) {
	    return a[0] * b[0] + a[1] * b[1];
	  }
	  function d3_transformNormalize(a) {
	    var k = Math.sqrt(d3_transformDot(a, a));
	    if (k) {
	      a[0] /= k;
	      a[1] /= k;
	    }
	    return k;
	  }
	  function d3_transformCombine(a, b, k) {
	    a[0] += k * b[0];
	    a[1] += k * b[1];
	    return a;
	  }
	  var d3_transformIdentity = {
	    a: 1,
	    b: 0,
	    c: 0,
	    d: 1,
	    e: 0,
	    f: 0
	  };
	  d3.interpolateTransform = d3_interpolateTransform;
	  function d3_interpolateTransformPop(s) {
	    return s.length ? s.pop() + "," : "";
	  }
	  function d3_interpolateTranslate(ta, tb, s, q) {
	    if (ta[0] !== tb[0] || ta[1] !== tb[1]) {
	      var i = s.push("translate(", null, ",", null, ")");
	      q.push({
	        i: i - 4,
	        x: d3_interpolateNumber(ta[0], tb[0])
	      }, {
	        i: i - 2,
	        x: d3_interpolateNumber(ta[1], tb[1])
	      });
	    } else if (tb[0] || tb[1]) {
	      s.push("translate(" + tb + ")");
	    }
	  }
	  function d3_interpolateRotate(ra, rb, s, q) {
	    if (ra !== rb) {
	      if (ra - rb > 180) rb += 360;else if (rb - ra > 180) ra += 360;
	      q.push({
	        i: s.push(d3_interpolateTransformPop(s) + "rotate(", null, ")") - 2,
	        x: d3_interpolateNumber(ra, rb)
	      });
	    } else if (rb) {
	      s.push(d3_interpolateTransformPop(s) + "rotate(" + rb + ")");
	    }
	  }
	  function d3_interpolateSkew(wa, wb, s, q) {
	    if (wa !== wb) {
	      q.push({
	        i: s.push(d3_interpolateTransformPop(s) + "skewX(", null, ")") - 2,
	        x: d3_interpolateNumber(wa, wb)
	      });
	    } else if (wb) {
	      s.push(d3_interpolateTransformPop(s) + "skewX(" + wb + ")");
	    }
	  }
	  function d3_interpolateScale(ka, kb, s, q) {
	    if (ka[0] !== kb[0] || ka[1] !== kb[1]) {
	      var i = s.push(d3_interpolateTransformPop(s) + "scale(", null, ",", null, ")");
	      q.push({
	        i: i - 4,
	        x: d3_interpolateNumber(ka[0], kb[0])
	      }, {
	        i: i - 2,
	        x: d3_interpolateNumber(ka[1], kb[1])
	      });
	    } else if (kb[0] !== 1 || kb[1] !== 1) {
	      s.push(d3_interpolateTransformPop(s) + "scale(" + kb + ")");
	    }
	  }
	  function d3_interpolateTransform(a, b) {
	    var s = [],
	        q = [];
	    a = d3.transform(a), b = d3.transform(b);
	    d3_interpolateTranslate(a.translate, b.translate, s, q);
	    d3_interpolateRotate(a.rotate, b.rotate, s, q);
	    d3_interpolateSkew(a.skew, b.skew, s, q);
	    d3_interpolateScale(a.scale, b.scale, s, q);
	    a = b = null;
	    return function (t) {
	      var i = -1,
	          n = q.length,
	          o;
	      while (++i < n) s[(o = q[i]).i] = o.x(t);
	      return s.join("");
	    };
	  }
	  function d3_uninterpolateNumber(a, b) {
	    b = (b -= a = +a) || 1 / b;
	    return function (x) {
	      return (x - a) / b;
	    };
	  }
	  function d3_uninterpolateClamp(a, b) {
	    b = (b -= a = +a) || 1 / b;
	    return function (x) {
	      return Math.max(0, Math.min(1, (x - a) / b));
	    };
	  }
	  d3.layout = {};
	  d3.layout.bundle = function () {
	    return function (links) {
	      var paths = [],
	          i = -1,
	          n = links.length;
	      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));
	      return paths;
	    };
	  };
	  function d3_layout_bundlePath(link) {
	    var start = link.source,
	        end = link.target,
	        lca = d3_layout_bundleLeastCommonAncestor(start, end),
	        points = [start];
	    while (start !== lca) {
	      start = start.parent;
	      points.push(start);
	    }
	    var k = points.length;
	    while (end !== lca) {
	      points.splice(k, 0, end);
	      end = end.parent;
	    }
	    return points;
	  }
	  function d3_layout_bundleAncestors(node) {
	    var ancestors = [],
	        parent = node.parent;
	    while (parent != null) {
	      ancestors.push(node);
	      node = parent;
	      parent = parent.parent;
	    }
	    ancestors.push(node);
	    return ancestors;
	  }
	  function d3_layout_bundleLeastCommonAncestor(a, b) {
	    if (a === b) return a;
	    var aNodes = d3_layout_bundleAncestors(a),
	        bNodes = d3_layout_bundleAncestors(b),
	        aNode = aNodes.pop(),
	        bNode = bNodes.pop(),
	        sharedNode = null;
	    while (aNode === bNode) {
	      sharedNode = aNode;
	      aNode = aNodes.pop();
	      bNode = bNodes.pop();
	    }
	    return sharedNode;
	  }
	  d3.layout.chord = function () {
	    var chord = {},
	        chords,
	        groups,
	        matrix,
	        n,
	        padding = 0,
	        sortGroups,
	        sortSubgroups,
	        sortChords;
	    function relayout() {
	      var subgroups = {},
	          groupSums = [],
	          groupIndex = d3.range(n),
	          subgroupIndex = [],
	          k,
	          x,
	          x0,
	          i,
	          j;
	      chords = [];
	      groups = [];
	      k = 0, i = -1;
	      while (++i < n) {
	        x = 0, j = -1;
	        while (++j < n) {
	          x += matrix[i][j];
	        }
	        groupSums.push(x);
	        subgroupIndex.push(d3.range(n));
	        k += x;
	      }
	      if (sortGroups) {
	        groupIndex.sort(function (a, b) {
	          return sortGroups(groupSums[a], groupSums[b]);
	        });
	      }
	      if (sortSubgroups) {
	        subgroupIndex.forEach(function (d, i) {
	          d.sort(function (a, b) {
	            return sortSubgroups(matrix[i][a], matrix[i][b]);
	          });
	        });
	      }
	      k = (τ - padding * n) / k;
	      x = 0, i = -1;
	      while (++i < n) {
	        x0 = x, j = -1;
	        while (++j < n) {
	          var di = groupIndex[i],
	              dj = subgroupIndex[di][j],
	              v = matrix[di][dj],
	              a0 = x,
	              a1 = x += v * k;
	          subgroups[di + "-" + dj] = {
	            index: di,
	            subindex: dj,
	            startAngle: a0,
	            endAngle: a1,
	            value: v
	          };
	        }
	        groups[di] = {
	          index: di,
	          startAngle: x0,
	          endAngle: x,
	          value: groupSums[di]
	        };
	        x += padding;
	      }
	      i = -1;
	      while (++i < n) {
	        j = i - 1;
	        while (++j < n) {
	          var source = subgroups[i + "-" + j],
	              target = subgroups[j + "-" + i];
	          if (source.value || target.value) {
	            chords.push(source.value < target.value ? {
	              source: target,
	              target: source
	            } : {
	              source: source,
	              target: target
	            });
	          }
	        }
	      }
	      if (sortChords) resort();
	    }
	    function resort() {
	      chords.sort(function (a, b) {
	        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
	      });
	    }
	    chord.matrix = function (x) {
	      if (!arguments.length) return matrix;
	      n = (matrix = x) && matrix.length;
	      chords = groups = null;
	      return chord;
	    };
	    chord.padding = function (x) {
	      if (!arguments.length) return padding;
	      padding = x;
	      chords = groups = null;
	      return chord;
	    };
	    chord.sortGroups = function (x) {
	      if (!arguments.length) return sortGroups;
	      sortGroups = x;
	      chords = groups = null;
	      return chord;
	    };
	    chord.sortSubgroups = function (x) {
	      if (!arguments.length) return sortSubgroups;
	      sortSubgroups = x;
	      chords = null;
	      return chord;
	    };
	    chord.sortChords = function (x) {
	      if (!arguments.length) return sortChords;
	      sortChords = x;
	      if (chords) resort();
	      return chord;
	    };
	    chord.chords = function () {
	      if (!chords) relayout();
	      return chords;
	    };
	    chord.groups = function () {
	      if (!groups) relayout();
	      return groups;
	    };
	    return chord;
	  };
	  d3.layout.force = function () {
	    var force = {},
	        event = d3.dispatch("start", "tick", "end"),
	        timer,
	        size = [1, 1],
	        drag,
	        alpha,
	        friction = .9,
	        linkDistance = d3_layout_forceLinkDistance,
	        linkStrength = d3_layout_forceLinkStrength,
	        charge = -30,
	        chargeDistance2 = d3_layout_forceChargeDistance2,
	        gravity = .1,
	        theta2 = .64,
	        nodes = [],
	        links = [],
	        distances,
	        strengths,
	        charges;
	    function repulse(node) {
	      return function (quad, x1, _, x2) {
	        if (quad.point !== node) {
	          var dx = quad.cx - node.x,
	              dy = quad.cy - node.y,
	              dw = x2 - x1,
	              dn = dx * dx + dy * dy;
	          if (dw * dw / theta2 < dn) {
	            if (dn < chargeDistance2) {
	              var k = quad.charge / dn;
	              node.px -= dx * k;
	              node.py -= dy * k;
	            }
	            return true;
	          }
	          if (quad.point && dn && dn < chargeDistance2) {
	            var k = quad.pointCharge / dn;
	            node.px -= dx * k;
	            node.py -= dy * k;
	          }
	        }
	        return !quad.charge;
	      };
	    }
	    force.tick = function () {
	      if ((alpha *= .99) < .005) {
	        timer = null;
	        event.end({
	          type: "end",
	          alpha: alpha = 0
	        });
	        return true;
	      }
	      var n = nodes.length,
	          m = links.length,
	          q,
	          i,
	          o,
	          s,
	          t,
	          l,
	          k,
	          x,
	          y;
	      for (i = 0; i < m; ++i) {
	        o = links[i];
	        s = o.source;
	        t = o.target;
	        x = t.x - s.x;
	        y = t.y - s.y;
	        if (l = x * x + y * y) {
	          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
	          x *= l;
	          y *= l;
	          t.x -= x * (k = s.weight + t.weight ? s.weight / (s.weight + t.weight) : .5);
	          t.y -= y * k;
	          s.x += x * (k = 1 - k);
	          s.y += y * k;
	        }
	      }
	      if (k = alpha * gravity) {
	        x = size[0] / 2;
	        y = size[1] / 2;
	        i = -1;
	        if (k) while (++i < n) {
	          o = nodes[i];
	          o.x += (x - o.x) * k;
	          o.y += (y - o.y) * k;
	        }
	      }
	      if (charge) {
	        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
	        i = -1;
	        while (++i < n) {
	          if (!(o = nodes[i]).fixed) {
	            q.visit(repulse(o));
	          }
	        }
	      }
	      i = -1;
	      while (++i < n) {
	        o = nodes[i];
	        if (o.fixed) {
	          o.x = o.px;
	          o.y = o.py;
	        } else {
	          o.x -= (o.px - (o.px = o.x)) * friction;
	          o.y -= (o.py - (o.py = o.y)) * friction;
	        }
	      }
	      event.tick({
	        type: "tick",
	        alpha: alpha
	      });
	    };
	    force.nodes = function (x) {
	      if (!arguments.length) return nodes;
	      nodes = x;
	      return force;
	    };
	    force.links = function (x) {
	      if (!arguments.length) return links;
	      links = x;
	      return force;
	    };
	    force.size = function (x) {
	      if (!arguments.length) return size;
	      size = x;
	      return force;
	    };
	    force.linkDistance = function (x) {
	      if (!arguments.length) return linkDistance;
	      linkDistance = typeof x === "function" ? x : +x;
	      return force;
	    };
	    force.distance = force.linkDistance;
	    force.linkStrength = function (x) {
	      if (!arguments.length) return linkStrength;
	      linkStrength = typeof x === "function" ? x : +x;
	      return force;
	    };
	    force.friction = function (x) {
	      if (!arguments.length) return friction;
	      friction = +x;
	      return force;
	    };
	    force.charge = function (x) {
	      if (!arguments.length) return charge;
	      charge = typeof x === "function" ? x : +x;
	      return force;
	    };
	    force.chargeDistance = function (x) {
	      if (!arguments.length) return Math.sqrt(chargeDistance2);
	      chargeDistance2 = x * x;
	      return force;
	    };
	    force.gravity = function (x) {
	      if (!arguments.length) return gravity;
	      gravity = +x;
	      return force;
	    };
	    force.theta = function (x) {
	      if (!arguments.length) return Math.sqrt(theta2);
	      theta2 = x * x;
	      return force;
	    };
	    force.alpha = function (x) {
	      if (!arguments.length) return alpha;
	      x = +x;
	      if (alpha) {
	        if (x > 0) {
	          alpha = x;
	        } else {
	          timer.c = null, timer.t = NaN, timer = null;
	          event.end({
	            type: "end",
	            alpha: alpha = 0
	          });
	        }
	      } else if (x > 0) {
	        event.start({
	          type: "start",
	          alpha: alpha = x
	        });
	        timer = d3_timer(force.tick);
	      }
	      return force;
	    };
	    force.start = function () {
	      var i,
	          n = nodes.length,
	          m = links.length,
	          w = size[0],
	          h = size[1],
	          neighbors,
	          o;
	      for (i = 0; i < n; ++i) {
	        (o = nodes[i]).index = i;
	        o.weight = 0;
	      }
	      for (i = 0; i < m; ++i) {
	        o = links[i];
	        if (typeof o.source == "number") o.source = nodes[o.source];
	        if (typeof o.target == "number") o.target = nodes[o.target];
	        ++o.source.weight;
	        ++o.target.weight;
	      }
	      for (i = 0; i < n; ++i) {
	        o = nodes[i];
	        if (isNaN(o.x)) o.x = position("x", w);
	        if (isNaN(o.y)) o.y = position("y", h);
	        if (isNaN(o.px)) o.px = o.x;
	        if (isNaN(o.py)) o.py = o.y;
	      }
	      distances = [];
	      if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i);else for (i = 0; i < m; ++i) distances[i] = linkDistance;
	      strengths = [];
	      if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i);else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
	      charges = [];
	      if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i);else for (i = 0; i < n; ++i) charges[i] = charge;
	      function position(dimension, size) {
	        if (!neighbors) {
	          neighbors = new Array(n);
	          for (j = 0; j < n; ++j) {
	            neighbors[j] = [];
	          }
	          for (j = 0; j < m; ++j) {
	            var o = links[j];
	            neighbors[o.source.index].push(o.target);
	            neighbors[o.target.index].push(o.source);
	          }
	        }
	        var candidates = neighbors[i],
	            j = -1,
	            l = candidates.length,
	            x;
	        while (++j < l) if (!isNaN(x = candidates[j][dimension])) return x;
	        return Math.random() * size;
	      }
	      return force.resume();
	    };
	    force.resume = function () {
	      return force.alpha(.1);
	    };
	    force.stop = function () {
	      return force.alpha(0);
	    };
	    force.drag = function () {
	      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force", d3_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", d3_layout_forceDragend);
	      if (!arguments.length) return drag;
	      this.on("mouseover.force", d3_layout_forceMouseover).on("mouseout.force", d3_layout_forceMouseout).call(drag);
	    };
	    function dragmove(d) {
	      d.px = d3.event.x, d.py = d3.event.y;
	      force.resume();
	    }
	    return d3.rebind(force, event, "on");
	  };
	  function d3_layout_forceDragstart(d) {
	    d.fixed |= 2;
	  }
	  function d3_layout_forceDragend(d) {
	    d.fixed &= ~6;
	  }
	  function d3_layout_forceMouseover(d) {
	    d.fixed |= 4;
	    d.px = d.x, d.py = d.y;
	  }
	  function d3_layout_forceMouseout(d) {
	    d.fixed &= ~4;
	  }
	  function d3_layout_forceAccumulate(quad, alpha, charges) {
	    var cx = 0,
	        cy = 0;
	    quad.charge = 0;
	    if (!quad.leaf) {
	      var nodes = quad.nodes,
	          n = nodes.length,
	          i = -1,
	          c;
	      while (++i < n) {
	        c = nodes[i];
	        if (c == null) continue;
	        d3_layout_forceAccumulate(c, alpha, charges);
	        quad.charge += c.charge;
	        cx += c.charge * c.cx;
	        cy += c.charge * c.cy;
	      }
	    }
	    if (quad.point) {
	      if (!quad.leaf) {
	        quad.point.x += Math.random() - .5;
	        quad.point.y += Math.random() - .5;
	      }
	      var k = alpha * charges[quad.point.index];
	      quad.charge += quad.pointCharge = k;
	      cx += k * quad.point.x;
	      cy += k * quad.point.y;
	    }
	    quad.cx = cx / quad.charge;
	    quad.cy = cy / quad.charge;
	  }
	  var d3_layout_forceLinkDistance = 20,
	      d3_layout_forceLinkStrength = 1,
	      d3_layout_forceChargeDistance2 = Infinity;
	  d3.layout.hierarchy = function () {
	    var sort = d3_layout_hierarchySort,
	        children = d3_layout_hierarchyChildren,
	        value = d3_layout_hierarchyValue;
	    function hierarchy(root) {
	      var stack = [root],
	          nodes = [],
	          node;
	      root.depth = 0;
	      while ((node = stack.pop()) != null) {
	        nodes.push(node);
	        if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
	          var n, childs, child;
	          while (--n >= 0) {
	            stack.push(child = childs[n]);
	            child.parent = node;
	            child.depth = node.depth + 1;
	          }
	          if (value) node.value = 0;
	          node.children = childs;
	        } else {
	          if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
	          delete node.children;
	        }
	      }
	      d3_layout_hierarchyVisitAfter(root, function (node) {
	        var childs, parent;
	        if (sort && (childs = node.children)) childs.sort(sort);
	        if (value && (parent = node.parent)) parent.value += node.value;
	      });
	      return nodes;
	    }
	    hierarchy.sort = function (x) {
	      if (!arguments.length) return sort;
	      sort = x;
	      return hierarchy;
	    };
	    hierarchy.children = function (x) {
	      if (!arguments.length) return children;
	      children = x;
	      return hierarchy;
	    };
	    hierarchy.value = function (x) {
	      if (!arguments.length) return value;
	      value = x;
	      return hierarchy;
	    };
	    hierarchy.revalue = function (root) {
	      if (value) {
	        d3_layout_hierarchyVisitBefore(root, function (node) {
	          if (node.children) node.value = 0;
	        });
	        d3_layout_hierarchyVisitAfter(root, function (node) {
	          var parent;
	          if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
	          if (parent = node.parent) parent.value += node.value;
	        });
	      }
	      return root;
	    };
	    return hierarchy;
	  };
	  function d3_layout_hierarchyRebind(object, hierarchy) {
	    d3.rebind(object, hierarchy, "sort", "children", "value");
	    object.nodes = object;
	    object.links = d3_layout_hierarchyLinks;
	    return object;
	  }
	  function d3_layout_hierarchyVisitBefore(node, callback) {
	    var nodes = [node];
	    while ((node = nodes.pop()) != null) {
	      callback(node);
	      if ((children = node.children) && (n = children.length)) {
	        var n, children;
	        while (--n >= 0) nodes.push(children[n]);
	      }
	    }
	  }
	  function d3_layout_hierarchyVisitAfter(node, callback) {
	    var nodes = [node],
	        nodes2 = [];
	    while ((node = nodes.pop()) != null) {
	      nodes2.push(node);
	      if ((children = node.children) && (n = children.length)) {
	        var i = -1,
	            n,
	            children;
	        while (++i < n) nodes.push(children[i]);
	      }
	    }
	    while ((node = nodes2.pop()) != null) {
	      callback(node);
	    }
	  }
	  function d3_layout_hierarchyChildren(d) {
	    return d.children;
	  }
	  function d3_layout_hierarchyValue(d) {
	    return d.value;
	  }
	  function d3_layout_hierarchySort(a, b) {
	    return b.value - a.value;
	  }
	  function d3_layout_hierarchyLinks(nodes) {
	    return d3.merge(nodes.map(function (parent) {
	      return (parent.children || []).map(function (child) {
	        return {
	          source: parent,
	          target: child
	        };
	      });
	    }));
	  }
	  d3.layout.partition = function () {
	    var hierarchy = d3.layout.hierarchy(),
	        size = [1, 1];
	    function position(node, x, dx, dy) {
	      var children = node.children;
	      node.x = x;
	      node.y = node.depth * dy;
	      node.dx = dx;
	      node.dy = dy;
	      if (children && (n = children.length)) {
	        var i = -1,
	            n,
	            c,
	            d;
	        dx = node.value ? dx / node.value : 0;
	        while (++i < n) {
	          position(c = children[i], x, d = c.value * dx, dy);
	          x += d;
	        }
	      }
	    }
	    function depth(node) {
	      var children = node.children,
	          d = 0;
	      if (children && (n = children.length)) {
	        var i = -1,
	            n;
	        while (++i < n) d = Math.max(d, depth(children[i]));
	      }
	      return 1 + d;
	    }
	    function partition(d, i) {
	      var nodes = hierarchy.call(this, d, i);
	      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
	      return nodes;
	    }
	    partition.size = function (x) {
	      if (!arguments.length) return size;
	      size = x;
	      return partition;
	    };
	    return d3_layout_hierarchyRebind(partition, hierarchy);
	  };
	  d3.layout.pie = function () {
	    var value = Number,
	        sort = d3_layout_pieSortByValue,
	        startAngle = 0,
	        endAngle = τ,
	        padAngle = 0;
	    function pie(data) {
	      var n = data.length,
	          values = data.map(function (d, i) {
	        return +value.call(pie, d, i);
	      }),
	          a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle),
	          da = (typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - a,
	          p = Math.min(Math.abs(da) / n, +(typeof padAngle === "function" ? padAngle.apply(this, arguments) : padAngle)),
	          pa = p * (da < 0 ? -1 : 1),
	          sum = d3.sum(values),
	          k = sum ? (da - n * pa) / sum : 0,
	          index = d3.range(n),
	          arcs = [],
	          v;
	      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function (i, j) {
	        return values[j] - values[i];
	      } : function (i, j) {
	        return sort(data[i], data[j]);
	      });
	      index.forEach(function (i) {
	        arcs[i] = {
	          data: data[i],
	          value: v = values[i],
	          startAngle: a,
	          endAngle: a += v * k + pa,
	          padAngle: p
	        };
	      });
	      return arcs;
	    }
	    pie.value = function (_) {
	      if (!arguments.length) return value;
	      value = _;
	      return pie;
	    };
	    pie.sort = function (_) {
	      if (!arguments.length) return sort;
	      sort = _;
	      return pie;
	    };
	    pie.startAngle = function (_) {
	      if (!arguments.length) return startAngle;
	      startAngle = _;
	      return pie;
	    };
	    pie.endAngle = function (_) {
	      if (!arguments.length) return endAngle;
	      endAngle = _;
	      return pie;
	    };
	    pie.padAngle = function (_) {
	      if (!arguments.length) return padAngle;
	      padAngle = _;
	      return pie;
	    };
	    return pie;
	  };
	  var d3_layout_pieSortByValue = {};
	  d3.layout.stack = function () {
	    var values = d3_identity,
	        order = d3_layout_stackOrderDefault,
	        offset = d3_layout_stackOffsetZero,
	        out = d3_layout_stackOut,
	        x = d3_layout_stackX,
	        y = d3_layout_stackY;
	    function stack(data, index) {
	      if (!(n = data.length)) return data;
	      var series = data.map(function (d, i) {
	        return values.call(stack, d, i);
	      });
	      var points = series.map(function (d) {
	        return d.map(function (v, i) {
	          return [x.call(stack, v, i), y.call(stack, v, i)];
	        });
	      });
	      var orders = order.call(stack, points, index);
	      series = d3.permute(series, orders);
	      points = d3.permute(points, orders);
	      var offsets = offset.call(stack, points, index);
	      var m = series[0].length,
	          n,
	          i,
	          j,
	          o;
	      for (j = 0; j < m; ++j) {
	        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
	        for (i = 1; i < n; ++i) {
	          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
	        }
	      }
	      return data;
	    }
	    stack.values = function (x) {
	      if (!arguments.length) return values;
	      values = x;
	      return stack;
	    };
	    stack.order = function (x) {
	      if (!arguments.length) return order;
	      order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
	      return stack;
	    };
	    stack.offset = function (x) {
	      if (!arguments.length) return offset;
	      offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
	      return stack;
	    };
	    stack.x = function (z) {
	      if (!arguments.length) return x;
	      x = z;
	      return stack;
	    };
	    stack.y = function (z) {
	      if (!arguments.length) return y;
	      y = z;
	      return stack;
	    };
	    stack.out = function (z) {
	      if (!arguments.length) return out;
	      out = z;
	      return stack;
	    };
	    return stack;
	  };
	  function d3_layout_stackX(d) {
	    return d.x;
	  }
	  function d3_layout_stackY(d) {
	    return d.y;
	  }
	  function d3_layout_stackOut(d, y0, y) {
	    d.y0 = y0;
	    d.y = y;
	  }
	  var d3_layout_stackOrders = d3.map({
	    "inside-out": function (data) {
	      var n = data.length,
	          i,
	          j,
	          max = data.map(d3_layout_stackMaxIndex),
	          sums = data.map(d3_layout_stackReduceSum),
	          index = d3.range(n).sort(function (a, b) {
	        return max[a] - max[b];
	      }),
	          top = 0,
	          bottom = 0,
	          tops = [],
	          bottoms = [];
	      for (i = 0; i < n; ++i) {
	        j = index[i];
	        if (top < bottom) {
	          top += sums[j];
	          tops.push(j);
	        } else {
	          bottom += sums[j];
	          bottoms.push(j);
	        }
	      }
	      return bottoms.reverse().concat(tops);
	    },
	    reverse: function (data) {
	      return d3.range(data.length).reverse();
	    },
	    "default": d3_layout_stackOrderDefault
	  });
	  var d3_layout_stackOffsets = d3.map({
	    silhouette: function (data) {
	      var n = data.length,
	          m = data[0].length,
	          sums = [],
	          max = 0,
	          i,
	          j,
	          o,
	          y0 = [];
	      for (j = 0; j < m; ++j) {
	        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
	        if (o > max) max = o;
	        sums.push(o);
	      }
	      for (j = 0; j < m; ++j) {
	        y0[j] = (max - sums[j]) / 2;
	      }
	      return y0;
	    },
	    wiggle: function (data) {
	      var n = data.length,
	          x = data[0],
	          m = x.length,
	          i,
	          j,
	          k,
	          s1,
	          s2,
	          s3,
	          dx,
	          o,
	          o0,
	          y0 = [];
	      y0[0] = o = o0 = 0;
	      for (j = 1; j < m; ++j) {
	        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];
	        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
	          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
	            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
	          }
	          s2 += s3 * data[i][j][1];
	        }
	        y0[j] = o -= s1 ? s2 / s1 * dx : 0;
	        if (o < o0) o0 = o;
	      }
	      for (j = 0; j < m; ++j) y0[j] -= o0;
	      return y0;
	    },
	    expand: function (data) {
	      var n = data.length,
	          m = data[0].length,
	          k = 1 / n,
	          i,
	          j,
	          o,
	          y0 = [];
	      for (j = 0; j < m; ++j) {
	        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
	        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o;else for (i = 0; i < n; i++) data[i][j][1] = k;
	      }
	      for (j = 0; j < m; ++j) y0[j] = 0;
	      return y0;
	    },
	    zero: d3_layout_stackOffsetZero
	  });
	  function d3_layout_stackOrderDefault(data) {
	    return d3.range(data.length);
	  }
	  function d3_layout_stackOffsetZero(data) {
	    var j = -1,
	        m = data[0].length,
	        y0 = [];
	    while (++j < m) y0[j] = 0;
	    return y0;
	  }
	  function d3_layout_stackMaxIndex(array) {
	    var i = 1,
	        j = 0,
	        v = array[0][1],
	        k,
	        n = array.length;
	    for (; i < n; ++i) {
	      if ((k = array[i][1]) > v) {
	        j = i;
	        v = k;
	      }
	    }
	    return j;
	  }
	  function d3_layout_stackReduceSum(d) {
	    return d.reduce(d3_layout_stackSum, 0);
	  }
	  function d3_layout_stackSum(p, d) {
	    return p + d[1];
	  }
	  d3.layout.histogram = function () {
	    var frequency = true,
	        valuer = Number,
	        ranger = d3_layout_histogramRange,
	        binner = d3_layout_histogramBinSturges;
	    function histogram(data, i) {
	      var bins = [],
	          values = data.map(valuer, this),
	          range = ranger.call(this, values, i),
	          thresholds = binner.call(this, range, values, i),
	          bin,
	          i = -1,
	          n = values.length,
	          m = thresholds.length - 1,
	          k = frequency ? 1 : 1 / n,
	          x;
	      while (++i < m) {
	        bin = bins[i] = [];
	        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);
	        bin.y = 0;
	      }
	      if (m > 0) {
	        i = -1;
	        while (++i < n) {
	          x = values[i];
	          if (x >= range[0] && x <= range[1]) {
	            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];
	            bin.y += k;
	            bin.push(data[i]);
	          }
	        }
	      }
	      return bins;
	    }
	    histogram.value = function (x) {
	      if (!arguments.length) return valuer;
	      valuer = x;
	      return histogram;
	    };
	    histogram.range = function (x) {
	      if (!arguments.length) return ranger;
	      ranger = d3_functor(x);
	      return histogram;
	    };
	    histogram.bins = function (x) {
	      if (!arguments.length) return binner;
	      binner = typeof x === "number" ? function (range) {
	        return d3_layout_histogramBinFixed(range, x);
	      } : d3_functor(x);
	      return histogram;
	    };
	    histogram.frequency = function (x) {
	      if (!arguments.length) return frequency;
	      frequency = !!x;
	      return histogram;
	    };
	    return histogram;
	  };
	  function d3_layout_histogramBinSturges(range, values) {
	    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));
	  }
	  function d3_layout_histogramBinFixed(range, n) {
	    var x = -1,
	        b = +range[0],
	        m = (range[1] - b) / n,
	        f = [];
	    while (++x <= n) f[x] = m * x + b;
	    return f;
	  }
	  function d3_layout_histogramRange(values) {
	    return [d3.min(values), d3.max(values)];
	  }
	  d3.layout.pack = function () {
	    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort),
	        padding = 0,
	        size = [1, 1],
	        radius;
	    function pack(d, i) {
	      var nodes = hierarchy.call(this, d, i),
	          root = nodes[0],
	          w = size[0],
	          h = size[1],
	          r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function () {
	        return radius;
	      };
	      root.x = root.y = 0;
	      d3_layout_hierarchyVisitAfter(root, function (d) {
	        d.r = +r(d.value);
	      });
	      d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
	      if (padding) {
	        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
	        d3_layout_hierarchyVisitAfter(root, function (d) {
	          d.r += dr;
	        });
	        d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
	        d3_layout_hierarchyVisitAfter(root, function (d) {
	          d.r -= dr;
	        });
	      }
	      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));
	      return nodes;
	    }
	    pack.size = function (_) {
	      if (!arguments.length) return size;
	      size = _;
	      return pack;
	    };
	    pack.radius = function (_) {
	      if (!arguments.length) return radius;
	      radius = _ == null || typeof _ === "function" ? _ : +_;
	      return pack;
	    };
	    pack.padding = function (_) {
	      if (!arguments.length) return padding;
	      padding = +_;
	      return pack;
	    };
	    return d3_layout_hierarchyRebind(pack, hierarchy);
	  };
	  function d3_layout_packSort(a, b) {
	    return a.value - b.value;
	  }
	  function d3_layout_packInsert(a, b) {
	    var c = a._pack_next;
	    a._pack_next = b;
	    b._pack_prev = a;
	    b._pack_next = c;
	    c._pack_prev = b;
	  }
	  function d3_layout_packSplice(a, b) {
	    a._pack_next = b;
	    b._pack_prev = a;
	  }
	  function d3_layout_packIntersects(a, b) {
	    var dx = b.x - a.x,
	        dy = b.y - a.y,
	        dr = a.r + b.r;
	    return .999 * dr * dr > dx * dx + dy * dy;
	  }
	  function d3_layout_packSiblings(node) {
	    if (!(nodes = node.children) || !(n = nodes.length)) return;
	    var nodes,
	        xMin = Infinity,
	        xMax = -Infinity,
	        yMin = Infinity,
	        yMax = -Infinity,
	        a,
	        b,
	        c,
	        i,
	        j,
	        k,
	        n;
	    function bound(node) {
	      xMin = Math.min(node.x - node.r, xMin);
	      xMax = Math.max(node.x + node.r, xMax);
	      yMin = Math.min(node.y - node.r, yMin);
	      yMax = Math.max(node.y + node.r, yMax);
	    }
	    nodes.forEach(d3_layout_packLink);
	    a = nodes[0];
	    a.x = -a.r;
	    a.y = 0;
	    bound(a);
	    if (n > 1) {
	      b = nodes[1];
	      b.x = b.r;
	      b.y = 0;
	      bound(b);
	      if (n > 2) {
	        c = nodes[2];
	        d3_layout_packPlace(a, b, c);
	        bound(c);
	        d3_layout_packInsert(a, c);
	        a._pack_prev = c;
	        d3_layout_packInsert(c, b);
	        b = a._pack_next;
	        for (i = 3; i < n; i++) {
	          d3_layout_packPlace(a, b, c = nodes[i]);
	          var isect = 0,
	              s1 = 1,
	              s2 = 1;
	          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
	            if (d3_layout_packIntersects(j, c)) {
	              isect = 1;
	              break;
	            }
	          }
	          if (isect == 1) {
	            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
	              if (d3_layout_packIntersects(k, c)) {
	                break;
	              }
	            }
	          }
	          if (isect) {
	            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j);else d3_layout_packSplice(a = k, b);
	            i--;
	          } else {
	            d3_layout_packInsert(a, c);
	            b = c;
	            bound(c);
	          }
	        }
	      }
	    }
	    var cx = (xMin + xMax) / 2,
	        cy = (yMin + yMax) / 2,
	        cr = 0;
	    for (i = 0; i < n; i++) {
	      c = nodes[i];
	      c.x -= cx;
	      c.y -= cy;
	      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));
	    }
	    node.r = cr;
	    nodes.forEach(d3_layout_packUnlink);
	  }
	  function d3_layout_packLink(node) {
	    node._pack_next = node._pack_prev = node;
	  }
	  function d3_layout_packUnlink(node) {
	    delete node._pack_next;
	    delete node._pack_prev;
	  }
	  function d3_layout_packTransform(node, x, y, k) {
	    var children = node.children;
	    node.x = x += k * node.x;
	    node.y = y += k * node.y;
	    node.r *= k;
	    if (children) {
	      var i = -1,
	          n = children.length;
	      while (++i < n) d3_layout_packTransform(children[i], x, y, k);
	    }
	  }
	  function d3_layout_packPlace(a, b, c) {
	    var db = a.r + c.r,
	        dx = b.x - a.x,
	        dy = b.y - a.y;
	    if (db && (dx || dy)) {
	      var da = b.r + c.r,
	          dc = dx * dx + dy * dy;
	      da *= da;
	      db *= db;
	      var x = .5 + (db - da) / (2 * dc),
	          y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
	      c.x = a.x + x * dx + y * dy;
	      c.y = a.y + x * dy - y * dx;
	    } else {
	      c.x = a.x + db;
	      c.y = a.y;
	    }
	  }
	  d3.layout.tree = function () {
	    var hierarchy = d3.layout.hierarchy().sort(null).value(null),
	        separation = d3_layout_treeSeparation,
	        size = [1, 1],
	        nodeSize = null;
	    function tree(d, i) {
	      var nodes = hierarchy.call(this, d, i),
	          root0 = nodes[0],
	          root1 = wrapTree(root0);
	      d3_layout_hierarchyVisitAfter(root1, firstWalk), root1.parent.m = -root1.z;
	      d3_layout_hierarchyVisitBefore(root1, secondWalk);
	      if (nodeSize) d3_layout_hierarchyVisitBefore(root0, sizeNode);else {
	        var left = root0,
	            right = root0,
	            bottom = root0;
	        d3_layout_hierarchyVisitBefore(root0, function (node) {
	          if (node.x < left.x) left = node;
	          if (node.x > right.x) right = node;
	          if (node.depth > bottom.depth) bottom = node;
	        });
	        var tx = separation(left, right) / 2 - left.x,
	            kx = size[0] / (right.x + separation(right, left) / 2 + tx),
	            ky = size[1] / (bottom.depth || 1);
	        d3_layout_hierarchyVisitBefore(root0, function (node) {
	          node.x = (node.x + tx) * kx;
	          node.y = node.depth * ky;
	        });
	      }
	      return nodes;
	    }
	    function wrapTree(root0) {
	      var root1 = {
	        A: null,
	        children: [root0]
	      },
	          queue = [root1],
	          node1;
	      while ((node1 = queue.pop()) != null) {
	        for (var children = node1.children, child, i = 0, n = children.length; i < n; ++i) {
	          queue.push((children[i] = child = {
	            _: children[i],
	            parent: node1,
	            children: (child = children[i].children) && child.slice() || [],
	            A: null,
	            a: null,
	            z: 0,
	            m: 0,
	            c: 0,
	            s: 0,
	            t: null,
	            i: i
	          }).a = child);
	        }
	      }
	      return root1.children[0];
	    }
	    function firstWalk(v) {
	      var children = v.children,
	          siblings = v.parent.children,
	          w = v.i ? siblings[v.i - 1] : null;
	      if (children.length) {
	        d3_layout_treeShift(v);
	        var midpoint = (children[0].z + children[children.length - 1].z) / 2;
	        if (w) {
	          v.z = w.z + separation(v._, w._);
	          v.m = v.z - midpoint;
	        } else {
	          v.z = midpoint;
	        }
	      } else if (w) {
	        v.z = w.z + separation(v._, w._);
	      }
	      v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
	    }
	    function secondWalk(v) {
	      v._.x = v.z + v.parent.m;
	      v.m += v.parent.m;
	    }
	    function apportion(v, w, ancestor) {
	      if (w) {
	        var vip = v,
	            vop = v,
	            vim = w,
	            vom = vip.parent.children[0],
	            sip = vip.m,
	            sop = vop.m,
	            sim = vim.m,
	            som = vom.m,
	            shift;
	        while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
	          vom = d3_layout_treeLeft(vom);
	          vop = d3_layout_treeRight(vop);
	          vop.a = v;
	          shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
	          if (shift > 0) {
	            d3_layout_treeMove(d3_layout_treeAncestor(vim, v, ancestor), v, shift);
	            sip += shift;
	            sop += shift;
	          }
	          sim += vim.m;
	          sip += vip.m;
	          som += vom.m;
	          sop += vop.m;
	        }
	        if (vim && !d3_layout_treeRight(vop)) {
	          vop.t = vim;
	          vop.m += sim - sop;
	        }
	        if (vip && !d3_layout_treeLeft(vom)) {
	          vom.t = vip;
	          vom.m += sip - som;
	          ancestor = v;
	        }
	      }
	      return ancestor;
	    }
	    function sizeNode(node) {
	      node.x *= size[0];
	      node.y = node.depth * size[1];
	    }
	    tree.separation = function (x) {
	      if (!arguments.length) return separation;
	      separation = x;
	      return tree;
	    };
	    tree.size = function (x) {
	      if (!arguments.length) return nodeSize ? null : size;
	      nodeSize = (size = x) == null ? sizeNode : null;
	      return tree;
	    };
	    tree.nodeSize = function (x) {
	      if (!arguments.length) return nodeSize ? size : null;
	      nodeSize = (size = x) == null ? null : sizeNode;
	      return tree;
	    };
	    return d3_layout_hierarchyRebind(tree, hierarchy);
	  };
	  function d3_layout_treeSeparation(a, b) {
	    return a.parent == b.parent ? 1 : 2;
	  }
	  function d3_layout_treeLeft(v) {
	    var children = v.children;
	    return children.length ? children[0] : v.t;
	  }
	  function d3_layout_treeRight(v) {
	    var children = v.children,
	        n;
	    return (n = children.length) ? children[n - 1] : v.t;
	  }
	  function d3_layout_treeMove(wm, wp, shift) {
	    var change = shift / (wp.i - wm.i);
	    wp.c -= change;
	    wp.s += shift;
	    wm.c += change;
	    wp.z += shift;
	    wp.m += shift;
	  }
	  function d3_layout_treeShift(v) {
	    var shift = 0,
	        change = 0,
	        children = v.children,
	        i = children.length,
	        w;
	    while (--i >= 0) {
	      w = children[i];
	      w.z += shift;
	      w.m += shift;
	      shift += w.s + (change += w.c);
	    }
	  }
	  function d3_layout_treeAncestor(vim, v, ancestor) {
	    return vim.a.parent === v.parent ? vim.a : ancestor;
	  }
	  d3.layout.cluster = function () {
	    var hierarchy = d3.layout.hierarchy().sort(null).value(null),
	        separation = d3_layout_treeSeparation,
	        size = [1, 1],
	        nodeSize = false;
	    function cluster(d, i) {
	      var nodes = hierarchy.call(this, d, i),
	          root = nodes[0],
	          previousNode,
	          x = 0;
	      d3_layout_hierarchyVisitAfter(root, function (node) {
	        var children = node.children;
	        if (children && children.length) {
	          node.x = d3_layout_clusterX(children);
	          node.y = d3_layout_clusterY(children);
	        } else {
	          node.x = previousNode ? x += separation(node, previousNode) : 0;
	          node.y = 0;
	          previousNode = node;
	        }
	      });
	      var left = d3_layout_clusterLeft(root),
	          right = d3_layout_clusterRight(root),
	          x0 = left.x - separation(left, right) / 2,
	          x1 = right.x + separation(right, left) / 2;
	      d3_layout_hierarchyVisitAfter(root, nodeSize ? function (node) {
	        node.x = (node.x - root.x) * size[0];
	        node.y = (root.y - node.y) * size[1];
	      } : function (node) {
	        node.x = (node.x - x0) / (x1 - x0) * size[0];
	        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];
	      });
	      return nodes;
	    }
	    cluster.separation = function (x) {
	      if (!arguments.length) return separation;
	      separation = x;
	      return cluster;
	    };
	    cluster.size = function (x) {
	      if (!arguments.length) return nodeSize ? null : size;
	      nodeSize = (size = x) == null;
	      return cluster;
	    };
	    cluster.nodeSize = function (x) {
	      if (!arguments.length) return nodeSize ? size : null;
	      nodeSize = (size = x) != null;
	      return cluster;
	    };
	    return d3_layout_hierarchyRebind(cluster, hierarchy);
	  };
	  function d3_layout_clusterY(children) {
	    return 1 + d3.max(children, function (child) {
	      return child.y;
	    });
	  }
	  function d3_layout_clusterX(children) {
	    return children.reduce(function (x, child) {
	      return x + child.x;
	    }, 0) / children.length;
	  }
	  function d3_layout_clusterLeft(node) {
	    var children = node.children;
	    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;
	  }
	  function d3_layout_clusterRight(node) {
	    var children = node.children,
	        n;
	    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;
	  }
	  d3.layout.treemap = function () {
	    var hierarchy = d3.layout.hierarchy(),
	        round = Math.round,
	        size = [1, 1],
	        padding = null,
	        pad = d3_layout_treemapPadNull,
	        sticky = false,
	        stickies,
	        mode = "squarify",
	        ratio = .5 * (1 + Math.sqrt(5));
	    function scale(children, k) {
	      var i = -1,
	          n = children.length,
	          child,
	          area;
	      while (++i < n) {
	        area = (child = children[i]).value * (k < 0 ? 0 : k);
	        child.area = isNaN(area) || area <= 0 ? 0 : area;
	      }
	    }
	    function squarify(node) {
	      var children = node.children;
	      if (children && children.length) {
	        var rect = pad(node),
	            row = [],
	            remaining = children.slice(),
	            child,
	            best = Infinity,
	            score,
	            u = mode === "slice" ? rect.dx : mode === "dice" ? rect.dy : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy),
	            n;
	        scale(remaining, rect.dx * rect.dy / node.value);
	        row.area = 0;
	        while ((n = remaining.length) > 0) {
	          row.push(child = remaining[n - 1]);
	          row.area += child.area;
	          if (mode !== "squarify" || (score = worst(row, u)) <= best) {
	            remaining.pop();
	            best = score;
	          } else {
	            row.area -= row.pop().area;
	            position(row, u, rect, false);
	            u = Math.min(rect.dx, rect.dy);
	            row.length = row.area = 0;
	            best = Infinity;
	          }
	        }
	        if (row.length) {
	          position(row, u, rect, true);
	          row.length = row.area = 0;
	        }
	        children.forEach(squarify);
	      }
	    }
	    function stickify(node) {
	      var children = node.children;
	      if (children && children.length) {
	        var rect = pad(node),
	            remaining = children.slice(),
	            child,
	            row = [];
	        scale(remaining, rect.dx * rect.dy / node.value);
	        row.area = 0;
	        while (child = remaining.pop()) {
	          row.push(child);
	          row.area += child.area;
	          if (child.z != null) {
	            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
	            row.length = row.area = 0;
	          }
	        }
	        children.forEach(stickify);
	      }
	    }
	    function worst(row, u) {
	      var s = row.area,
	          r,
	          rmax = 0,
	          rmin = Infinity,
	          i = -1,
	          n = row.length;
	      while (++i < n) {
	        if (!(r = row[i].area)) continue;
	        if (r < rmin) rmin = r;
	        if (r > rmax) rmax = r;
	      }
	      s *= s;
	      u *= u;
	      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
	    }
	    function position(row, u, rect, flush) {
	      var i = -1,
	          n = row.length,
	          x = rect.x,
	          y = rect.y,
	          v = u ? round(row.area / u) : 0,
	          o;
	      if (u == rect.dx) {
	        if (flush || v > rect.dy) v = rect.dy;
	        while (++i < n) {
	          o = row[i];
	          o.x = x;
	          o.y = y;
	          o.dy = v;
	          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
	        }
	        o.z = true;
	        o.dx += rect.x + rect.dx - x;
	        rect.y += v;
	        rect.dy -= v;
	      } else {
	        if (flush || v > rect.dx) v = rect.dx;
	        while (++i < n) {
	          o = row[i];
	          o.x = x;
	          o.y = y;
	          o.dx = v;
	          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
	        }
	        o.z = false;
	        o.dy += rect.y + rect.dy - y;
	        rect.x += v;
	        rect.dx -= v;
	      }
	    }
	    function treemap(d) {
	      var nodes = stickies || hierarchy(d),
	          root = nodes[0];
	      root.x = root.y = 0;
	      if (root.value) root.dx = size[0], root.dy = size[1];else root.dx = root.dy = 0;
	      if (stickies) hierarchy.revalue(root);
	      scale([root], root.dx * root.dy / root.value);
	      (stickies ? stickify : squarify)(root);
	      if (sticky) stickies = nodes;
	      return nodes;
	    }
	    treemap.size = function (x) {
	      if (!arguments.length) return size;
	      size = x;
	      return treemap;
	    };
	    treemap.padding = function (x) {
	      if (!arguments.length) return padding;
	      function padFunction(node) {
	        var p = x.call(treemap, node, node.depth);
	        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === "number" ? [p, p, p, p] : p);
	      }
	      function padConstant(node) {
	        return d3_layout_treemapPad(node, x);
	      }
	      var type;
	      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === "function" ? padFunction : type === "number" ? (x = [x, x, x, x], padConstant) : padConstant;
	      return treemap;
	    };
	    treemap.round = function (x) {
	      if (!arguments.length) return round != Number;
	      round = x ? Math.round : Number;
	      return treemap;
	    };
	    treemap.sticky = function (x) {
	      if (!arguments.length) return sticky;
	      sticky = x;
	      stickies = null;
	      return treemap;
	    };
	    treemap.ratio = function (x) {
	      if (!arguments.length) return ratio;
	      ratio = x;
	      return treemap;
	    };
	    treemap.mode = function (x) {
	      if (!arguments.length) return mode;
	      mode = x + "";
	      return treemap;
	    };
	    return d3_layout_hierarchyRebind(treemap, hierarchy);
	  };
	  function d3_layout_treemapPadNull(node) {
	    return {
	      x: node.x,
	      y: node.y,
	      dx: node.dx,
	      dy: node.dy
	    };
	  }
	  function d3_layout_treemapPad(node, padding) {
	    var x = node.x + padding[3],
	        y = node.y + padding[0],
	        dx = node.dx - padding[1] - padding[3],
	        dy = node.dy - padding[0] - padding[2];
	    if (dx < 0) {
	      x += dx / 2;
	      dx = 0;
	    }
	    if (dy < 0) {
	      y += dy / 2;
	      dy = 0;
	    }
	    return {
	      x: x,
	      y: y,
	      dx: dx,
	      dy: dy
	    };
	  }
	  d3.random = {
	    normal: function (µ, σ) {
	      var n = arguments.length;
	      if (n < 2) σ = 1;
	      if (n < 1) µ = 0;
	      return function () {
	        var x, y, r;
	        do {
	          x = Math.random() * 2 - 1;
	          y = Math.random() * 2 - 1;
	          r = x * x + y * y;
	        } while (!r || r > 1);
	        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);
	      };
	    },
	    logNormal: function () {
	      var random = d3.random.normal.apply(d3, arguments);
	      return function () {
	        return Math.exp(random());
	      };
	    },
	    bates: function (m) {
	      var random = d3.random.irwinHall(m);
	      return function () {
	        return random() / m;
	      };
	    },
	    irwinHall: function (m) {
	      return function () {
	        for (var s = 0, j = 0; j < m; j++) s += Math.random();
	        return s;
	      };
	    }
	  };
	  d3.scale = {};
	  function d3_scaleExtent(domain) {
	    var start = domain[0],
	        stop = domain[domain.length - 1];
	    return start < stop ? [start, stop] : [stop, start];
	  }
	  function d3_scaleRange(scale) {
	    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
	  }
	  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
	    var u = uninterpolate(domain[0], domain[1]),
	        i = interpolate(range[0], range[1]);
	    return function (x) {
	      return i(u(x));
	    };
	  }
	  function d3_scale_nice(domain, nice) {
	    var i0 = 0,
	        i1 = domain.length - 1,
	        x0 = domain[i0],
	        x1 = domain[i1],
	        dx;
	    if (x1 < x0) {
	      dx = i0, i0 = i1, i1 = dx;
	      dx = x0, x0 = x1, x1 = dx;
	    }
	    domain[i0] = nice.floor(x0);
	    domain[i1] = nice.ceil(x1);
	    return domain;
	  }
	  function d3_scale_niceStep(step) {
	    return step ? {
	      floor: function (x) {
	        return Math.floor(x / step) * step;
	      },
	      ceil: function (x) {
	        return Math.ceil(x / step) * step;
	      }
	    } : d3_scale_niceIdentity;
	  }
	  var d3_scale_niceIdentity = {
	    floor: d3_identity,
	    ceil: d3_identity
	  };
	  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
	    var u = [],
	        i = [],
	        j = 0,
	        k = Math.min(domain.length, range.length) - 1;
	    if (domain[k] < domain[0]) {
	      domain = domain.slice().reverse();
	      range = range.slice().reverse();
	    }
	    while (++j <= k) {
	      u.push(uninterpolate(domain[j - 1], domain[j]));
	      i.push(interpolate(range[j - 1], range[j]));
	    }
	    return function (x) {
	      var j = d3.bisect(domain, x, 1, k) - 1;
	      return i[j](u[j](x));
	    };
	  }
	  d3.scale.linear = function () {
	    return d3_scale_linear([0, 1], [0, 1], d3_interpolate, false);
	  };
	  function d3_scale_linear(domain, range, interpolate, clamp) {
	    var output, input;
	    function rescale() {
	      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear,
	          uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
	      output = linear(domain, range, uninterpolate, interpolate);
	      input = linear(range, domain, uninterpolate, d3_interpolate);
	      return scale;
	    }
	    function scale(x) {
	      return output(x);
	    }
	    scale.invert = function (y) {
	      return input(y);
	    };
	    scale.domain = function (x) {
	      if (!arguments.length) return domain;
	      domain = x.map(Number);
	      return rescale();
	    };
	    scale.range = function (x) {
	      if (!arguments.length) return range;
	      range = x;
	      return rescale();
	    };
	    scale.rangeRound = function (x) {
	      return scale.range(x).interpolate(d3_interpolateRound);
	    };
	    scale.clamp = function (x) {
	      if (!arguments.length) return clamp;
	      clamp = x;
	      return rescale();
	    };
	    scale.interpolate = function (x) {
	      if (!arguments.length) return interpolate;
	      interpolate = x;
	      return rescale();
	    };
	    scale.ticks = function (m) {
	      return d3_scale_linearTicks(domain, m);
	    };
	    scale.tickFormat = function (m, format) {
	      return d3_scale_linearTickFormat(domain, m, format);
	    };
	    scale.nice = function (m) {
	      d3_scale_linearNice(domain, m);
	      return rescale();
	    };
	    scale.copy = function () {
	      return d3_scale_linear(domain, range, interpolate, clamp);
	    };
	    return rescale();
	  }
	  function d3_scale_linearRebind(scale, linear) {
	    return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
	  }
	  function d3_scale_linearNice(domain, m) {
	    d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
	    d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
	    return domain;
	  }
	  function d3_scale_linearTickRange(domain, m) {
	    if (m == null) m = 10;
	    var extent = d3_scaleExtent(domain),
	        span = extent[1] - extent[0],
	        step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)),
	        err = m / span * step;
	    if (err <= .15) step *= 10;else if (err <= .35) step *= 5;else if (err <= .75) step *= 2;
	    extent[0] = Math.ceil(extent[0] / step) * step;
	    extent[1] = Math.floor(extent[1] / step) * step + step * .5;
	    extent[2] = step;
	    return extent;
	  }
	  function d3_scale_linearTicks(domain, m) {
	    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
	  }
	  function d3_scale_linearTickFormat(domain, m, format) {
	    var range = d3_scale_linearTickRange(domain, m);
	    if (format) {
	      var match = d3_format_re.exec(format);
	      match.shift();
	      if (match[8] === "s") {
	        var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
	        if (!match[7]) match[7] = "." + d3_scale_linearPrecision(prefix.scale(range[2]));
	        match[8] = "f";
	        format = d3.format(match.join(""));
	        return function (d) {
	          return format(prefix.scale(d)) + prefix.symbol;
	        };
	      }
	      if (!match[7]) match[7] = "." + d3_scale_linearFormatPrecision(match[8], range);
	      format = match.join("");
	    } else {
	      format = ",." + d3_scale_linearPrecision(range[2]) + "f";
	    }
	    return d3.format(format);
	  }
	  var d3_scale_linearFormatSignificant = {
	    s: 1,
	    g: 1,
	    p: 1,
	    r: 1,
	    e: 1
	  };
	  function d3_scale_linearPrecision(value) {
	    return -Math.floor(Math.log(value) / Math.LN10 + .01);
	  }
	  function d3_scale_linearFormatPrecision(type, range) {
	    var p = d3_scale_linearPrecision(range[2]);
	    return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== "e") : p - (type === "%") * 2;
	  }
	  d3.scale.log = function () {
	    return d3_scale_log(d3.scale.linear().domain([0, 1]), 10, true, [1, 10]);
	  };
	  function d3_scale_log(linear, base, positive, domain) {
	    function log(x) {
	      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);
	    }
	    function pow(x) {
	      return positive ? Math.pow(base, x) : -Math.pow(base, -x);
	    }
	    function scale(x) {
	      return linear(log(x));
	    }
	    scale.invert = function (x) {
	      return pow(linear.invert(x));
	    };
	    scale.domain = function (x) {
	      if (!arguments.length) return domain;
	      positive = x[0] >= 0;
	      linear.domain((domain = x.map(Number)).map(log));
	      return scale;
	    };
	    scale.base = function (_) {
	      if (!arguments.length) return base;
	      base = +_;
	      linear.domain(domain.map(log));
	      return scale;
	    };
	    scale.nice = function () {
	      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);
	      linear.domain(niced);
	      domain = niced.map(pow);
	      return scale;
	    };
	    scale.ticks = function () {
	      var extent = d3_scaleExtent(domain),
	          ticks = [],
	          u = extent[0],
	          v = extent[1],
	          i = Math.floor(log(u)),
	          j = Math.ceil(log(v)),
	          n = base % 1 ? 2 : base;
	      if (isFinite(j - i)) {
	        if (positive) {
	          for (; i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);
	          ticks.push(pow(i));
	        } else {
	          ticks.push(pow(i));
	          for (; i++ < j;) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);
	        }
	        for (i = 0; ticks[i] < u; i++) {}
	        for (j = ticks.length; ticks[j - 1] > v; j--) {}
	        ticks = ticks.slice(i, j);
	      }
	      return ticks;
	    };
	    scale.tickFormat = function (n, format) {
	      if (!arguments.length) return d3_scale_logFormat;
	      if (arguments.length < 2) format = d3_scale_logFormat;else if (typeof format !== "function") format = d3.format(format);
	      var k = Math.max(1, base * n / scale.ticks().length);
	      return function (d) {
	        var i = d / pow(Math.round(log(d)));
	        if (i * base < base - .5) i *= base;
	        return i <= k ? format(d) : "";
	      };
	    };
	    scale.copy = function () {
	      return d3_scale_log(linear.copy(), base, positive, domain);
	    };
	    return d3_scale_linearRebind(scale, linear);
	  }
	  var d3_scale_logFormat = d3.format(".0e"),
	      d3_scale_logNiceNegative = {
	    floor: function (x) {
	      return -Math.ceil(-x);
	    },
	    ceil: function (x) {
	      return -Math.floor(-x);
	    }
	  };
	  d3.scale.pow = function () {
	    return d3_scale_pow(d3.scale.linear(), 1, [0, 1]);
	  };
	  function d3_scale_pow(linear, exponent, domain) {
	    var powp = d3_scale_powPow(exponent),
	        powb = d3_scale_powPow(1 / exponent);
	    function scale(x) {
	      return linear(powp(x));
	    }
	    scale.invert = function (x) {
	      return powb(linear.invert(x));
	    };
	    scale.domain = function (x) {
	      if (!arguments.length) return domain;
	      linear.domain((domain = x.map(Number)).map(powp));
	      return scale;
	    };
	    scale.ticks = function (m) {
	      return d3_scale_linearTicks(domain, m);
	    };
	    scale.tickFormat = function (m, format) {
	      return d3_scale_linearTickFormat(domain, m, format);
	    };
	    scale.nice = function (m) {
	      return scale.domain(d3_scale_linearNice(domain, m));
	    };
	    scale.exponent = function (x) {
	      if (!arguments.length) return exponent;
	      powp = d3_scale_powPow(exponent = x);
	      powb = d3_scale_powPow(1 / exponent);
	      linear.domain(domain.map(powp));
	      return scale;
	    };
	    scale.copy = function () {
	      return d3_scale_pow(linear.copy(), exponent, domain);
	    };
	    return d3_scale_linearRebind(scale, linear);
	  }
	  function d3_scale_powPow(e) {
	    return function (x) {
	      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);
	    };
	  }
	  d3.scale.sqrt = function () {
	    return d3.scale.pow().exponent(.5);
	  };
	  d3.scale.ordinal = function () {
	    return d3_scale_ordinal([], {
	      t: "range",
	      a: [[]]
	    });
	  };
	  function d3_scale_ordinal(domain, ranger) {
	    var index, range, rangeBand;
	    function scale(x) {
	      return range[((index.get(x) || (ranger.t === "range" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];
	    }
	    function steps(start, step) {
	      return d3.range(domain.length).map(function (i) {
	        return start + step * i;
	      });
	    }
	    scale.domain = function (x) {
	      if (!arguments.length) return domain;
	      domain = [];
	      index = new d3_Map();
	      var i = -1,
	          n = x.length,
	          xi;
	      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
	      return scale[ranger.t].apply(scale, ranger.a);
	    };
	    scale.range = function (x) {
	      if (!arguments.length) return range;
	      range = x;
	      rangeBand = 0;
	      ranger = {
	        t: "range",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangePoints = function (x, padding) {
	      if (arguments.length < 2) padding = 0;
	      var start = x[0],
	          stop = x[1],
	          step = domain.length < 2 ? (start = (start + stop) / 2, 0) : (stop - start) / (domain.length - 1 + padding);
	      range = steps(start + step * padding / 2, step);
	      rangeBand = 0;
	      ranger = {
	        t: "rangePoints",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeRoundPoints = function (x, padding) {
	      if (arguments.length < 2) padding = 0;
	      var start = x[0],
	          stop = x[1],
	          step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 0) : (stop - start) / (domain.length - 1 + padding) | 0;
	      range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
	      rangeBand = 0;
	      ranger = {
	        t: "rangeRoundPoints",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeBands = function (x, padding, outerPadding) {
	      if (arguments.length < 2) padding = 0;
	      if (arguments.length < 3) outerPadding = padding;
	      var reverse = x[1] < x[0],
	          start = x[reverse - 0],
	          stop = x[1 - reverse],
	          step = (stop - start) / (domain.length - padding + 2 * outerPadding);
	      range = steps(start + step * outerPadding, step);
	      if (reverse) range.reverse();
	      rangeBand = step * (1 - padding);
	      ranger = {
	        t: "rangeBands",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeRoundBands = function (x, padding, outerPadding) {
	      if (arguments.length < 2) padding = 0;
	      if (arguments.length < 3) outerPadding = padding;
	      var reverse = x[1] < x[0],
	          start = x[reverse - 0],
	          stop = x[1 - reverse],
	          step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
	      range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
	      if (reverse) range.reverse();
	      rangeBand = Math.round(step * (1 - padding));
	      ranger = {
	        t: "rangeRoundBands",
	        a: arguments
	      };
	      return scale;
	    };
	    scale.rangeBand = function () {
	      return rangeBand;
	    };
	    scale.rangeExtent = function () {
	      return d3_scaleExtent(ranger.a[0]);
	    };
	    scale.copy = function () {
	      return d3_scale_ordinal(domain, ranger);
	    };
	    return scale.domain(domain);
	  }
	  d3.scale.category10 = function () {
	    return d3.scale.ordinal().range(d3_category10);
	  };
	  d3.scale.category20 = function () {
	    return d3.scale.ordinal().range(d3_category20);
	  };
	  d3.scale.category20b = function () {
	    return d3.scale.ordinal().range(d3_category20b);
	  };
	  d3.scale.category20c = function () {
	    return d3.scale.ordinal().range(d3_category20c);
	  };
	  var d3_category10 = [2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175].map(d3_rgbString);
	  var d3_category20 = [2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725].map(d3_rgbString);
	  var d3_category20b = [3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654].map(d3_rgbString);
	  var d3_category20c = [3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081].map(d3_rgbString);
	  d3.scale.quantile = function () {
	    return d3_scale_quantile([], []);
	  };
	  function d3_scale_quantile(domain, range) {
	    var thresholds;
	    function rescale() {
	      var k = 0,
	          q = range.length;
	      thresholds = [];
	      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);
	      return scale;
	    }
	    function scale(x) {
	      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];
	    }
	    scale.domain = function (x) {
	      if (!arguments.length) return domain;
	      domain = x.map(d3_number).filter(d3_numeric).sort(d3_ascending);
	      return rescale();
	    };
	    scale.range = function (x) {
	      if (!arguments.length) return range;
	      range = x;
	      return rescale();
	    };
	    scale.quantiles = function () {
	      return thresholds;
	    };
	    scale.invertExtent = function (y) {
	      y = range.indexOf(y);
	      return y < 0 ? [NaN, NaN] : [y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1]];
	    };
	    scale.copy = function () {
	      return d3_scale_quantile(domain, range);
	    };
	    return rescale();
	  }
	  d3.scale.quantize = function () {
	    return d3_scale_quantize(0, 1, [0, 1]);
	  };
	  function d3_scale_quantize(x0, x1, range) {
	    var kx, i;
	    function scale(x) {
	      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
	    }
	    function rescale() {
	      kx = range.length / (x1 - x0);
	      i = range.length - 1;
	      return scale;
	    }
	    scale.domain = function (x) {
	      if (!arguments.length) return [x0, x1];
	      x0 = +x[0];
	      x1 = +x[x.length - 1];
	      return rescale();
	    };
	    scale.range = function (x) {
	      if (!arguments.length) return range;
	      range = x;
	      return rescale();
	    };
	    scale.invertExtent = function (y) {
	      y = range.indexOf(y);
	      y = y < 0 ? NaN : y / kx + x0;
	      return [y, y + 1 / kx];
	    };
	    scale.copy = function () {
	      return d3_scale_quantize(x0, x1, range);
	    };
	    return rescale();
	  }
	  d3.scale.threshold = function () {
	    return d3_scale_threshold([.5], [0, 1]);
	  };
	  function d3_scale_threshold(domain, range) {
	    function scale(x) {
	      if (x <= x) return range[d3.bisect(domain, x)];
	    }
	    scale.domain = function (_) {
	      if (!arguments.length) return domain;
	      domain = _;
	      return scale;
	    };
	    scale.range = function (_) {
	      if (!arguments.length) return range;
	      range = _;
	      return scale;
	    };
	    scale.invertExtent = function (y) {
	      y = range.indexOf(y);
	      return [domain[y - 1], domain[y]];
	    };
	    scale.copy = function () {
	      return d3_scale_threshold(domain, range);
	    };
	    return scale;
	  }
	  d3.scale.identity = function () {
	    return d3_scale_identity([0, 1]);
	  };
	  function d3_scale_identity(domain) {
	    function identity(x) {
	      return +x;
	    }
	    identity.invert = identity;
	    identity.domain = identity.range = function (x) {
	      if (!arguments.length) return domain;
	      domain = x.map(identity);
	      return identity;
	    };
	    identity.ticks = function (m) {
	      return d3_scale_linearTicks(domain, m);
	    };
	    identity.tickFormat = function (m, format) {
	      return d3_scale_linearTickFormat(domain, m, format);
	    };
	    identity.copy = function () {
	      return d3_scale_identity(domain);
	    };
	    return identity;
	  }
	  d3.svg = {};
	  function d3_zero() {
	    return 0;
	  }
	  d3.svg.arc = function () {
	    var innerRadius = d3_svg_arcInnerRadius,
	        outerRadius = d3_svg_arcOuterRadius,
	        cornerRadius = d3_zero,
	        padRadius = d3_svg_arcAuto,
	        startAngle = d3_svg_arcStartAngle,
	        endAngle = d3_svg_arcEndAngle,
	        padAngle = d3_svg_arcPadAngle;
	    function arc() {
	      var r0 = Math.max(0, +innerRadius.apply(this, arguments)),
	          r1 = Math.max(0, +outerRadius.apply(this, arguments)),
	          a0 = startAngle.apply(this, arguments) - halfπ,
	          a1 = endAngle.apply(this, arguments) - halfπ,
	          da = Math.abs(a1 - a0),
	          cw = a0 > a1 ? 0 : 1;
	      if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
	      if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
	      var rc,
	          cr,
	          rp,
	          ap,
	          p0 = 0,
	          p1 = 0,
	          x0,
	          y0,
	          x1,
	          y1,
	          x2,
	          y2,
	          x3,
	          y3,
	          path = [];
	      if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
	        rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments);
	        if (!cw) p1 *= -1;
	        if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
	        if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
	      }
	      if (r1) {
	        x0 = r1 * Math.cos(a0 + p1);
	        y0 = r1 * Math.sin(a0 + p1);
	        x1 = r1 * Math.cos(a1 - p1);
	        y1 = r1 * Math.sin(a1 - p1);
	        var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
	        if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
	          var h1 = (a0 + a1) / 2;
	          x0 = r1 * Math.cos(h1);
	          y0 = r1 * Math.sin(h1);
	          x1 = y1 = null;
	        }
	      } else {
	        x0 = y0 = 0;
	      }
	      if (r0) {
	        x2 = r0 * Math.cos(a1 - p0);
	        y2 = r0 * Math.sin(a1 - p0);
	        x3 = r0 * Math.cos(a0 + p0);
	        y3 = r0 * Math.sin(a0 + p0);
	        var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
	        if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
	          var h0 = (a0 + a1) / 2;
	          x2 = r0 * Math.cos(h0);
	          y2 = r0 * Math.sin(h0);
	          x3 = y3 = null;
	        }
	      } else {
	        x2 = y2 = 0;
	      }
	      if (da > ε && (rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
	        cr = r0 < r1 ^ cw ? 0 : 1;
	        var rc1 = rc,
	            rc0 = rc;
	        if (da < π) {
	          var oc = x3 == null ? [x2, y2] : x1 == null ? [x0, y0] : d3_geom_polygonIntersect([x0, y0], [x3, y3], [x1, y1], [x2, y2]),
	              ax = x0 - oc[0],
	              ay = y0 - oc[1],
	              bx = x1 - oc[0],
	              by = y1 - oc[1],
	              kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2),
	              lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
	          rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
	          rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
	        }
	        if (x1 != null) {
	          var t30 = d3_svg_arcCornerTangents(x3 == null ? [x2, y2] : [x3, y3], [x0, y0], r1, rc1, cw),
	              t12 = d3_svg_arcCornerTangents([x1, y1], [x2, y2], r1, rc1, cw);
	          if (rc === rc1) {
	            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]);
	          } else {
	            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0]);
	          }
	        } else {
	          path.push("M", x0, ",", y0);
	        }
	        if (x3 != null) {
	          var t03 = d3_svg_arcCornerTangents([x0, y0], [x3, y3], r0, -rc0, cw),
	              t21 = d3_svg_arcCornerTangents([x2, y2], x1 == null ? [x0, y0] : [x1, y1], r0, -rc0, cw);
	          if (rc === rc0) {
	            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
	          } else {
	            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
	          }
	        } else {
	          path.push("L", x2, ",", y2);
	        }
	      } else {
	        path.push("M", x0, ",", y0);
	        if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
	        path.push("L", x2, ",", y2);
	        if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
	      }
	      path.push("Z");
	      return path.join("");
	    }
	    function circleSegment(r1, cw) {
	      return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;
	    }
	    arc.innerRadius = function (v) {
	      if (!arguments.length) return innerRadius;
	      innerRadius = d3_functor(v);
	      return arc;
	    };
	    arc.outerRadius = function (v) {
	      if (!arguments.length) return outerRadius;
	      outerRadius = d3_functor(v);
	      return arc;
	    };
	    arc.cornerRadius = function (v) {
	      if (!arguments.length) return cornerRadius;
	      cornerRadius = d3_functor(v);
	      return arc;
	    };
	    arc.padRadius = function (v) {
	      if (!arguments.length) return padRadius;
	      padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
	      return arc;
	    };
	    arc.startAngle = function (v) {
	      if (!arguments.length) return startAngle;
	      startAngle = d3_functor(v);
	      return arc;
	    };
	    arc.endAngle = function (v) {
	      if (!arguments.length) return endAngle;
	      endAngle = d3_functor(v);
	      return arc;
	    };
	    arc.padAngle = function (v) {
	      if (!arguments.length) return padAngle;
	      padAngle = d3_functor(v);
	      return arc;
	    };
	    arc.centroid = function () {
	      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
	          a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
	      return [Math.cos(a) * r, Math.sin(a) * r];
	    };
	    return arc;
	  };
	  var d3_svg_arcAuto = "auto";
	  function d3_svg_arcInnerRadius(d) {
	    return d.innerRadius;
	  }
	  function d3_svg_arcOuterRadius(d) {
	    return d.outerRadius;
	  }
	  function d3_svg_arcStartAngle(d) {
	    return d.startAngle;
	  }
	  function d3_svg_arcEndAngle(d) {
	    return d.endAngle;
	  }
	  function d3_svg_arcPadAngle(d) {
	    return d && d.padAngle;
	  }
	  function d3_svg_arcSweep(x0, y0, x1, y1) {
	    return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1;
	  }
	  function d3_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
	    var x01 = p0[0] - p1[0],
	        y01 = p0[1] - p1[1],
	        lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01),
	        ox = lo * y01,
	        oy = -lo * x01,
	        x1 = p0[0] + ox,
	        y1 = p0[1] + oy,
	        x2 = p1[0] + ox,
	        y2 = p1[1] + oy,
	        x3 = (x1 + x2) / 2,
	        y3 = (y1 + y2) / 2,
	        dx = x2 - x1,
	        dy = y2 - y1,
	        d2 = dx * dx + dy * dy,
	        r = r1 - rc,
	        D = x1 * y2 - x2 * y1,
	        d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)),
	        cx0 = (D * dy - dx * d) / d2,
	        cy0 = (-D * dx - dy * d) / d2,
	        cx1 = (D * dy + dx * d) / d2,
	        cy1 = (-D * dx + dy * d) / d2,
	        dx0 = cx0 - x3,
	        dy0 = cy0 - y3,
	        dx1 = cx1 - x3,
	        dy1 = cy1 - y3;
	    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
	    return [[cx0 - ox, cy0 - oy], [cx0 * r1 / r, cy0 * r1 / r]];
	  }
	  function d3_svg_line(projection) {
	    var x = d3_geom_pointX,
	        y = d3_geom_pointY,
	        defined = d3_true,
	        interpolate = d3_svg_lineLinear,
	        interpolateKey = interpolate.key,
	        tension = .7;
	    function line(data) {
	      var segments = [],
	          points = [],
	          i = -1,
	          n = data.length,
	          d,
	          fx = d3_functor(x),
	          fy = d3_functor(y);
	      function segment() {
	        segments.push("M", interpolate(projection(points), tension));
	      }
	      while (++i < n) {
	        if (defined.call(this, d = data[i], i)) {
	          points.push([+fx.call(this, d, i), +fy.call(this, d, i)]);
	        } else if (points.length) {
	          segment();
	          points = [];
	        }
	      }
	      if (points.length) segment();
	      return segments.length ? segments.join("") : null;
	    }
	    line.x = function (_) {
	      if (!arguments.length) return x;
	      x = _;
	      return line;
	    };
	    line.y = function (_) {
	      if (!arguments.length) return y;
	      y = _;
	      return line;
	    };
	    line.defined = function (_) {
	      if (!arguments.length) return defined;
	      defined = _;
	      return line;
	    };
	    line.interpolate = function (_) {
	      if (!arguments.length) return interpolateKey;
	      if (typeof _ === "function") interpolateKey = interpolate = _;else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
	      return line;
	    };
	    line.tension = function (_) {
	      if (!arguments.length) return tension;
	      tension = _;
	      return line;
	    };
	    return line;
	  }
	  d3.svg.line = function () {
	    return d3_svg_line(d3_identity);
	  };
	  var d3_svg_lineInterpolators = d3.map({
	    linear: d3_svg_lineLinear,
	    "linear-closed": d3_svg_lineLinearClosed,
	    step: d3_svg_lineStep,
	    "step-before": d3_svg_lineStepBefore,
	    "step-after": d3_svg_lineStepAfter,
	    basis: d3_svg_lineBasis,
	    "basis-open": d3_svg_lineBasisOpen,
	    "basis-closed": d3_svg_lineBasisClosed,
	    bundle: d3_svg_lineBundle,
	    cardinal: d3_svg_lineCardinal,
	    "cardinal-open": d3_svg_lineCardinalOpen,
	    "cardinal-closed": d3_svg_lineCardinalClosed,
	    monotone: d3_svg_lineMonotone
	  });
	  d3_svg_lineInterpolators.forEach(function (key, value) {
	    value.key = key;
	    value.closed = /-closed$/.test(key);
	  });
	  function d3_svg_lineLinear(points) {
	    return points.length > 1 ? points.join("L") : points + "Z";
	  }
	  function d3_svg_lineLinearClosed(points) {
	    return points.join("L") + "Z";
	  }
	  function d3_svg_lineStep(points) {
	    var i = 0,
	        n = points.length,
	        p = points[0],
	        path = [p[0], ",", p[1]];
	    while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
	    if (n > 1) path.push("H", p[0]);
	    return path.join("");
	  }
	  function d3_svg_lineStepBefore(points) {
	    var i = 0,
	        n = points.length,
	        p = points[0],
	        path = [p[0], ",", p[1]];
	    while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
	    return path.join("");
	  }
	  function d3_svg_lineStepAfter(points) {
	    var i = 0,
	        n = points.length,
	        p = points[0],
	        path = [p[0], ",", p[1]];
	    while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
	    return path.join("");
	  }
	  function d3_svg_lineCardinalOpen(points, tension) {
	    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension));
	  }
	  function d3_svg_lineCardinalClosed(points, tension) {
	    return points.length < 3 ? d3_svg_lineLinearClosed(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), points), d3_svg_lineCardinalTangents([points[points.length - 2]].concat(points, [points[1]]), tension));
	  }
	  function d3_svg_lineCardinal(points, tension) {
	    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));
	  }
	  function d3_svg_lineHermite(points, tangents) {
	    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
	      return d3_svg_lineLinear(points);
	    }
	    var quad = points.length != tangents.length,
	        path = "",
	        p0 = points[0],
	        p = points[1],
	        t0 = tangents[0],
	        t = t0,
	        pi = 1;
	    if (quad) {
	      path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
	      p0 = points[1];
	      pi = 2;
	    }
	    if (tangents.length > 1) {
	      t = tangents[1];
	      p = points[pi];
	      pi++;
	      path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
	      for (var i = 2; i < tangents.length; i++, pi++) {
	        p = points[pi];
	        t = tangents[i];
	        path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
	      }
	    }
	    if (quad) {
	      var lp = points[pi];
	      path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
	    }
	    return path;
	  }
	  function d3_svg_lineCardinalTangents(points, tension) {
	    var tangents = [],
	        a = (1 - tension) / 2,
	        p0,
	        p1 = points[0],
	        p2 = points[1],
	        i = 1,
	        n = points.length;
	    while (++i < n) {
	      p0 = p1;
	      p1 = p2;
	      p2 = points[i];
	      tangents.push([a * (p2[0] - p0[0]), a * (p2[1] - p0[1])]);
	    }
	    return tangents;
	  }
	  function d3_svg_lineBasis(points) {
	    if (points.length < 3) return d3_svg_lineLinear(points);
	    var i = 1,
	        n = points.length,
	        pi = points[0],
	        x0 = pi[0],
	        y0 = pi[1],
	        px = [x0, x0, x0, (pi = points[1])[0]],
	        py = [y0, y0, y0, pi[1]],
	        path = [x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py)];
	    points.push(points[n - 1]);
	    while (++i <= n) {
	      pi = points[i];
	      px.shift();
	      px.push(pi[0]);
	      py.shift();
	      py.push(pi[1]);
	      d3_svg_lineBasisBezier(path, px, py);
	    }
	    points.pop();
	    path.push("L", pi);
	    return path.join("");
	  }
	  function d3_svg_lineBasisOpen(points) {
	    if (points.length < 4) return d3_svg_lineLinear(points);
	    var path = [],
	        i = -1,
	        n = points.length,
	        pi,
	        px = [0],
	        py = [0];
	    while (++i < 3) {
	      pi = points[i];
	      px.push(pi[0]);
	      py.push(pi[1]);
	    }
	    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
	    --i;
	    while (++i < n) {
	      pi = points[i];
	      px.shift();
	      px.push(pi[0]);
	      py.shift();
	      py.push(pi[1]);
	      d3_svg_lineBasisBezier(path, px, py);
	    }
	    return path.join("");
	  }
	  function d3_svg_lineBasisClosed(points) {
	    var path,
	        i = -1,
	        n = points.length,
	        m = n + 4,
	        pi,
	        px = [],
	        py = [];
	    while (++i < 4) {
	      pi = points[i % n];
	      px.push(pi[0]);
	      py.push(pi[1]);
	    }
	    path = [d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py)];
	    --i;
	    while (++i < m) {
	      pi = points[i % n];
	      px.shift();
	      px.push(pi[0]);
	      py.shift();
	      py.push(pi[1]);
	      d3_svg_lineBasisBezier(path, px, py);
	    }
	    return path.join("");
	  }
	  function d3_svg_lineBundle(points, tension) {
	    var n = points.length - 1;
	    if (n) {
	      var x0 = points[0][0],
	          y0 = points[0][1],
	          dx = points[n][0] - x0,
	          dy = points[n][1] - y0,
	          i = -1,
	          p,
	          t;
	      while (++i <= n) {
	        p = points[i];
	        t = i / n;
	        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
	        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
	      }
	    }
	    return d3_svg_lineBasis(points);
	  }
	  function d3_svg_lineDot4(a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
	  }
	  var d3_svg_lineBasisBezier1 = [0, 2 / 3, 1 / 3, 0],
	      d3_svg_lineBasisBezier2 = [0, 1 / 3, 2 / 3, 0],
	      d3_svg_lineBasisBezier3 = [0, 1 / 6, 2 / 3, 1 / 6];
	  function d3_svg_lineBasisBezier(path, x, y) {
	    path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
	  }
	  function d3_svg_lineSlope(p0, p1) {
	    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
	  }
	  function d3_svg_lineFiniteDifferences(points) {
	    var i = 0,
	        j = points.length - 1,
	        m = [],
	        p0 = points[0],
	        p1 = points[1],
	        d = m[0] = d3_svg_lineSlope(p0, p1);
	    while (++i < j) {
	      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
	    }
	    m[i] = d;
	    return m;
	  }
	  function d3_svg_lineMonotoneTangents(points) {
	    var tangents = [],
	        d,
	        a,
	        b,
	        s,
	        m = d3_svg_lineFiniteDifferences(points),
	        i = -1,
	        j = points.length - 1;
	    while (++i < j) {
	      d = d3_svg_lineSlope(points[i], points[i + 1]);
	      if (abs(d) < ε) {
	        m[i] = m[i + 1] = 0;
	      } else {
	        a = m[i] / d;
	        b = m[i + 1] / d;
	        s = a * a + b * b;
	        if (s > 9) {
	          s = d * 3 / Math.sqrt(s);
	          m[i] = s * a;
	          m[i + 1] = s * b;
	        }
	      }
	    }
	    i = -1;
	    while (++i <= j) {
	      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
	      tangents.push([s || 0, m[i] * s || 0]);
	    }
	    return tangents;
	  }
	  function d3_svg_lineMonotone(points) {
	    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
	  }
	  d3.svg.line.radial = function () {
	    var line = d3_svg_line(d3_svg_lineRadial);
	    line.radius = line.x, delete line.x;
	    line.angle = line.y, delete line.y;
	    return line;
	  };
	  function d3_svg_lineRadial(points) {
	    var point,
	        i = -1,
	        n = points.length,
	        r,
	        a;
	    while (++i < n) {
	      point = points[i];
	      r = point[0];
	      a = point[1] - halfπ;
	      point[0] = r * Math.cos(a);
	      point[1] = r * Math.sin(a);
	    }
	    return points;
	  }
	  function d3_svg_area(projection) {
	    var x0 = d3_geom_pointX,
	        x1 = d3_geom_pointX,
	        y0 = 0,
	        y1 = d3_geom_pointY,
	        defined = d3_true,
	        interpolate = d3_svg_lineLinear,
	        interpolateKey = interpolate.key,
	        interpolateReverse = interpolate,
	        L = "L",
	        tension = .7;
	    function area(data) {
	      var segments = [],
	          points0 = [],
	          points1 = [],
	          i = -1,
	          n = data.length,
	          d,
	          fx0 = d3_functor(x0),
	          fy0 = d3_functor(y0),
	          fx1 = x0 === x1 ? function () {
	        return x;
	      } : d3_functor(x1),
	          fy1 = y0 === y1 ? function () {
	        return y;
	      } : d3_functor(y1),
	          x,
	          y;
	      function segment() {
	        segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z");
	      }
	      while (++i < n) {
	        if (defined.call(this, d = data[i], i)) {
	          points0.push([x = +fx0.call(this, d, i), y = +fy0.call(this, d, i)]);
	          points1.push([+fx1.call(this, d, i), +fy1.call(this, d, i)]);
	        } else if (points0.length) {
	          segment();
	          points0 = [];
	          points1 = [];
	        }
	      }
	      if (points0.length) segment();
	      return segments.length ? segments.join("") : null;
	    }
	    area.x = function (_) {
	      if (!arguments.length) return x1;
	      x0 = x1 = _;
	      return area;
	    };
	    area.x0 = function (_) {
	      if (!arguments.length) return x0;
	      x0 = _;
	      return area;
	    };
	    area.x1 = function (_) {
	      if (!arguments.length) return x1;
	      x1 = _;
	      return area;
	    };
	    area.y = function (_) {
	      if (!arguments.length) return y1;
	      y0 = y1 = _;
	      return area;
	    };
	    area.y0 = function (_) {
	      if (!arguments.length) return y0;
	      y0 = _;
	      return area;
	    };
	    area.y1 = function (_) {
	      if (!arguments.length) return y1;
	      y1 = _;
	      return area;
	    };
	    area.defined = function (_) {
	      if (!arguments.length) return defined;
	      defined = _;
	      return area;
	    };
	    area.interpolate = function (_) {
	      if (!arguments.length) return interpolateKey;
	      if (typeof _ === "function") interpolateKey = interpolate = _;else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
	      interpolateReverse = interpolate.reverse || interpolate;
	      L = interpolate.closed ? "M" : "L";
	      return area;
	    };
	    area.tension = function (_) {
	      if (!arguments.length) return tension;
	      tension = _;
	      return area;
	    };
	    return area;
	  }
	  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;
	  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;
	  d3.svg.area = function () {
	    return d3_svg_area(d3_identity);
	  };
	  d3.svg.area.radial = function () {
	    var area = d3_svg_area(d3_svg_lineRadial);
	    area.radius = area.x, delete area.x;
	    area.innerRadius = area.x0, delete area.x0;
	    area.outerRadius = area.x1, delete area.x1;
	    area.angle = area.y, delete area.y;
	    area.startAngle = area.y0, delete area.y0;
	    area.endAngle = area.y1, delete area.y1;
	    return area;
	  };
	  d3.svg.chord = function () {
	    var source = d3_source,
	        target = d3_target,
	        radius = d3_svg_chordRadius,
	        startAngle = d3_svg_arcStartAngle,
	        endAngle = d3_svg_arcEndAngle;
	    function chord(d, i) {
	      var s = subgroup(this, source, d, i),
	          t = subgroup(this, target, d, i);
	      return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
	    }
	    function subgroup(self, f, d, i) {
	      var subgroup = f.call(self, d, i),
	          r = radius.call(self, subgroup, i),
	          a0 = startAngle.call(self, subgroup, i) - halfπ,
	          a1 = endAngle.call(self, subgroup, i) - halfπ;
	      return {
	        r: r,
	        a0: a0,
	        a1: a1,
	        p0: [r * Math.cos(a0), r * Math.sin(a0)],
	        p1: [r * Math.cos(a1), r * Math.sin(a1)]
	      };
	    }
	    function equals(a, b) {
	      return a.a0 == b.a0 && a.a1 == b.a1;
	    }
	    function arc(r, p, a) {
	      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
	    }
	    function curve(r0, p0, r1, p1) {
	      return "Q 0,0 " + p1;
	    }
	    chord.radius = function (v) {
	      if (!arguments.length) return radius;
	      radius = d3_functor(v);
	      return chord;
	    };
	    chord.source = function (v) {
	      if (!arguments.length) return source;
	      source = d3_functor(v);
	      return chord;
	    };
	    chord.target = function (v) {
	      if (!arguments.length) return target;
	      target = d3_functor(v);
	      return chord;
	    };
	    chord.startAngle = function (v) {
	      if (!arguments.length) return startAngle;
	      startAngle = d3_functor(v);
	      return chord;
	    };
	    chord.endAngle = function (v) {
	      if (!arguments.length) return endAngle;
	      endAngle = d3_functor(v);
	      return chord;
	    };
	    return chord;
	  };
	  function d3_svg_chordRadius(d) {
	    return d.radius;
	  }
	  d3.svg.diagonal = function () {
	    var source = d3_source,
	        target = d3_target,
	        projection = d3_svg_diagonalProjection;
	    function diagonal(d, i) {
	      var p0 = source.call(this, d, i),
	          p3 = target.call(this, d, i),
	          m = (p0.y + p3.y) / 2,
	          p = [p0, {
	        x: p0.x,
	        y: m
	      }, {
	        x: p3.x,
	        y: m
	      }, p3];
	      p = p.map(projection);
	      return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
	    }
	    diagonal.source = function (x) {
	      if (!arguments.length) return source;
	      source = d3_functor(x);
	      return diagonal;
	    };
	    diagonal.target = function (x) {
	      if (!arguments.length) return target;
	      target = d3_functor(x);
	      return diagonal;
	    };
	    diagonal.projection = function (x) {
	      if (!arguments.length) return projection;
	      projection = x;
	      return diagonal;
	    };
	    return diagonal;
	  };
	  function d3_svg_diagonalProjection(d) {
	    return [d.x, d.y];
	  }
	  d3.svg.diagonal.radial = function () {
	    var diagonal = d3.svg.diagonal(),
	        projection = d3_svg_diagonalProjection,
	        projection_ = diagonal.projection;
	    diagonal.projection = function (x) {
	      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;
	    };
	    return diagonal;
	  };
	  function d3_svg_diagonalRadialProjection(projection) {
	    return function () {
	      var d = projection.apply(this, arguments),
	          r = d[0],
	          a = d[1] - halfπ;
	      return [r * Math.cos(a), r * Math.sin(a)];
	    };
	  }
	  d3.svg.symbol = function () {
	    var type = d3_svg_symbolType,
	        size = d3_svg_symbolSize;
	    function symbol(d, i) {
	      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));
	    }
	    symbol.type = function (x) {
	      if (!arguments.length) return type;
	      type = d3_functor(x);
	      return symbol;
	    };
	    symbol.size = function (x) {
	      if (!arguments.length) return size;
	      size = d3_functor(x);
	      return symbol;
	    };
	    return symbol;
	  };
	  function d3_svg_symbolSize() {
	    return 64;
	  }
	  function d3_svg_symbolType() {
	    return "circle";
	  }
	  function d3_svg_symbolCircle(size) {
	    var r = Math.sqrt(size / π);
	    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
	  }
	  var d3_svg_symbols = d3.map({
	    circle: d3_svg_symbolCircle,
	    cross: function (size) {
	      var r = Math.sqrt(size / 5) / 2;
	      return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
	    },
	    diamond: function (size) {
	      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)),
	          rx = ry * d3_svg_symbolTan30;
	      return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";
	    },
	    square: function (size) {
	      var r = Math.sqrt(size) / 2;
	      return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";
	    },
	    "triangle-down": function (size) {
	      var rx = Math.sqrt(size / d3_svg_symbolSqrt3),
	          ry = rx * d3_svg_symbolSqrt3 / 2;
	      return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";
	    },
	    "triangle-up": function (size) {
	      var rx = Math.sqrt(size / d3_svg_symbolSqrt3),
	          ry = rx * d3_svg_symbolSqrt3 / 2;
	      return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";
	    }
	  });
	  d3.svg.symbolTypes = d3_svg_symbols.keys();
	  var d3_svg_symbolSqrt3 = Math.sqrt(3),
	      d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
	  d3_selectionPrototype.transition = function (name) {
	    var id = d3_transitionInheritId || ++d3_transitionId,
	        ns = d3_transitionNamespace(name),
	        subgroups = [],
	        subgroup,
	        node,
	        transition = d3_transitionInherit || {
	      time: Date.now(),
	      ease: d3_ease_cubicInOut,
	      delay: 0,
	      duration: 250
	    };
	    for (var j = -1, m = this.length; ++j < m;) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = -1, n = group.length; ++i < n;) {
	        if (node = group[i]) d3_transitionNode(node, i, ns, id, transition);
	        subgroup.push(node);
	      }
	    }
	    return d3_transition(subgroups, ns, id);
	  };
	  d3_selectionPrototype.interrupt = function (name) {
	    return this.each(name == null ? d3_selection_interrupt : d3_selection_interruptNS(d3_transitionNamespace(name)));
	  };
	  var d3_selection_interrupt = d3_selection_interruptNS(d3_transitionNamespace());
	  function d3_selection_interruptNS(ns) {
	    return function () {
	      var lock, activeId, active;
	      if ((lock = this[ns]) && (active = lock[activeId = lock.active])) {
	        active.timer.c = null;
	        active.timer.t = NaN;
	        if (--lock.count) delete lock[activeId];else delete this[ns];
	        lock.active += .5;
	        active.event && active.event.interrupt.call(this, this.__data__, active.index);
	      }
	    };
	  }
	  function d3_transition(groups, ns, id) {
	    d3_subclass(groups, d3_transitionPrototype);
	    groups.namespace = ns;
	    groups.id = id;
	    return groups;
	  }
	  var d3_transitionPrototype = [],
	      d3_transitionId = 0,
	      d3_transitionInheritId,
	      d3_transitionInherit;
	  d3_transitionPrototype.call = d3_selectionPrototype.call;
	  d3_transitionPrototype.empty = d3_selectionPrototype.empty;
	  d3_transitionPrototype.node = d3_selectionPrototype.node;
	  d3_transitionPrototype.size = d3_selectionPrototype.size;
	  d3.transition = function (selection, name) {
	    return selection && selection.transition ? d3_transitionInheritId ? selection.transition(name) : selection : d3.selection().transition(selection);
	  };
	  d3.transition.prototype = d3_transitionPrototype;
	  d3_transitionPrototype.select = function (selector) {
	    var id = this.id,
	        ns = this.namespace,
	        subgroups = [],
	        subgroup,
	        subnode,
	        node;
	    selector = d3_selection_selector(selector);
	    for (var j = -1, m = this.length; ++j < m;) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = -1, n = group.length; ++i < n;) {
	        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
	          if ("__data__" in node) subnode.__data__ = node.__data__;
	          d3_transitionNode(subnode, i, ns, id, node[ns][id]);
	          subgroup.push(subnode);
	        } else {
	          subgroup.push(null);
	        }
	      }
	    }
	    return d3_transition(subgroups, ns, id);
	  };
	  d3_transitionPrototype.selectAll = function (selector) {
	    var id = this.id,
	        ns = this.namespace,
	        subgroups = [],
	        subgroup,
	        subnodes,
	        node,
	        subnode,
	        transition;
	    selector = d3_selection_selectorAll(selector);
	    for (var j = -1, m = this.length; ++j < m;) {
	      for (var group = this[j], i = -1, n = group.length; ++i < n;) {
	        if (node = group[i]) {
	          transition = node[ns][id];
	          subnodes = selector.call(node, node.__data__, i, j);
	          subgroups.push(subgroup = []);
	          for (var k = -1, o = subnodes.length; ++k < o;) {
	            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, ns, id, transition);
	            subgroup.push(subnode);
	          }
	        }
	      }
	    }
	    return d3_transition(subgroups, ns, id);
	  };
	  d3_transitionPrototype.filter = function (filter) {
	    var subgroups = [],
	        subgroup,
	        group,
	        node;
	    if (typeof filter !== "function") filter = d3_selection_filter(filter);
	    for (var j = 0, m = this.length; j < m; j++) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
	        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
	          subgroup.push(node);
	        }
	      }
	    }
	    return d3_transition(subgroups, this.namespace, this.id);
	  };
	  d3_transitionPrototype.tween = function (name, tween) {
	    var id = this.id,
	        ns = this.namespace;
	    if (arguments.length < 2) return this.node()[ns][id].tween.get(name);
	    return d3_selection_each(this, tween == null ? function (node) {
	      node[ns][id].tween.remove(name);
	    } : function (node) {
	      node[ns][id].tween.set(name, tween);
	    });
	  };
	  function d3_transition_tween(groups, name, value, tween) {
	    var id = groups.id,
	        ns = groups.namespace;
	    return d3_selection_each(groups, typeof value === "function" ? function (node, i, j) {
	      node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
	    } : (value = tween(value), function (node) {
	      node[ns][id].tween.set(name, value);
	    }));
	  }
	  d3_transitionPrototype.attr = function (nameNS, value) {
	    if (arguments.length < 2) {
	      for (value in nameNS) this.attr(value, nameNS[value]);
	      return this;
	    }
	    var interpolate = nameNS == "transform" ? d3_interpolateTransform : d3_interpolate,
	        name = d3.ns.qualify(nameNS);
	    function attrNull() {
	      this.removeAttribute(name);
	    }
	    function attrNullNS() {
	      this.removeAttributeNS(name.space, name.local);
	    }
	    function attrTween(b) {
	      return b == null ? attrNull : (b += "", function () {
	        var a = this.getAttribute(name),
	            i;
	        return a !== b && (i = interpolate(a, b), function (t) {
	          this.setAttribute(name, i(t));
	        });
	      });
	    }
	    function attrTweenNS(b) {
	      return b == null ? attrNullNS : (b += "", function () {
	        var a = this.getAttributeNS(name.space, name.local),
	            i;
	        return a !== b && (i = interpolate(a, b), function (t) {
	          this.setAttributeNS(name.space, name.local, i(t));
	        });
	      });
	    }
	    return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
	  };
	  d3_transitionPrototype.attrTween = function (nameNS, tween) {
	    var name = d3.ns.qualify(nameNS);
	    function attrTween(d, i) {
	      var f = tween.call(this, d, i, this.getAttribute(name));
	      return f && function (t) {
	        this.setAttribute(name, f(t));
	      };
	    }
	    function attrTweenNS(d, i) {
	      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
	      return f && function (t) {
	        this.setAttributeNS(name.space, name.local, f(t));
	      };
	    }
	    return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
	  };
	  d3_transitionPrototype.style = function (name, value, priority) {
	    var n = arguments.length;
	    if (n < 3) {
	      if (typeof name !== "string") {
	        if (n < 2) value = "";
	        for (priority in name) this.style(priority, name[priority], value);
	        return this;
	      }
	      priority = "";
	    }
	    function styleNull() {
	      this.style.removeProperty(name);
	    }
	    function styleString(b) {
	      return b == null ? styleNull : (b += "", function () {
	        var a = d3_window(this).getComputedStyle(this, null).getPropertyValue(name),
	            i;
	        return a !== b && (i = d3_interpolate(a, b), function (t) {
	          this.style.setProperty(name, i(t), priority);
	        });
	      });
	    }
	    return d3_transition_tween(this, "style." + name, value, styleString);
	  };
	  d3_transitionPrototype.styleTween = function (name, tween, priority) {
	    if (arguments.length < 3) priority = "";
	    function styleTween(d, i) {
	      var f = tween.call(this, d, i, d3_window(this).getComputedStyle(this, null).getPropertyValue(name));
	      return f && function (t) {
	        this.style.setProperty(name, f(t), priority);
	      };
	    }
	    return this.tween("style." + name, styleTween);
	  };
	  d3_transitionPrototype.text = function (value) {
	    return d3_transition_tween(this, "text", value, d3_transition_text);
	  };
	  function d3_transition_text(b) {
	    if (b == null) b = "";
	    return function () {
	      this.textContent = b;
	    };
	  }
	  d3_transitionPrototype.remove = function () {
	    var ns = this.namespace;
	    return this.each("end.transition", function () {
	      var p;
	      if (this[ns].count < 2 && (p = this.parentNode)) p.removeChild(this);
	    });
	  };
	  d3_transitionPrototype.ease = function (value) {
	    var id = this.id,
	        ns = this.namespace;
	    if (arguments.length < 1) return this.node()[ns][id].ease;
	    if (typeof value !== "function") value = d3.ease.apply(d3, arguments);
	    return d3_selection_each(this, function (node) {
	      node[ns][id].ease = value;
	    });
	  };
	  d3_transitionPrototype.delay = function (value) {
	    var id = this.id,
	        ns = this.namespace;
	    if (arguments.length < 1) return this.node()[ns][id].delay;
	    return d3_selection_each(this, typeof value === "function" ? function (node, i, j) {
	      node[ns][id].delay = +value.call(node, node.__data__, i, j);
	    } : (value = +value, function (node) {
	      node[ns][id].delay = value;
	    }));
	  };
	  d3_transitionPrototype.duration = function (value) {
	    var id = this.id,
	        ns = this.namespace;
	    if (arguments.length < 1) return this.node()[ns][id].duration;
	    return d3_selection_each(this, typeof value === "function" ? function (node, i, j) {
	      node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j));
	    } : (value = Math.max(1, value), function (node) {
	      node[ns][id].duration = value;
	    }));
	  };
	  d3_transitionPrototype.each = function (type, listener) {
	    var id = this.id,
	        ns = this.namespace;
	    if (arguments.length < 2) {
	      var inherit = d3_transitionInherit,
	          inheritId = d3_transitionInheritId;
	      try {
	        d3_transitionInheritId = id;
	        d3_selection_each(this, function (node, i, j) {
	          d3_transitionInherit = node[ns][id];
	          type.call(node, node.__data__, i, j);
	        });
	      } finally {
	        d3_transitionInherit = inherit;
	        d3_transitionInheritId = inheritId;
	      }
	    } else {
	      d3_selection_each(this, function (node) {
	        var transition = node[ns][id];
	        (transition.event || (transition.event = d3.dispatch("start", "end", "interrupt"))).on(type, listener);
	      });
	    }
	    return this;
	  };
	  d3_transitionPrototype.transition = function () {
	    var id0 = this.id,
	        id1 = ++d3_transitionId,
	        ns = this.namespace,
	        subgroups = [],
	        subgroup,
	        group,
	        node,
	        transition;
	    for (var j = 0, m = this.length; j < m; j++) {
	      subgroups.push(subgroup = []);
	      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
	        if (node = group[i]) {
	          transition = node[ns][id0];
	          d3_transitionNode(node, i, ns, id1, {
	            time: transition.time,
	            ease: transition.ease,
	            delay: transition.delay + transition.duration,
	            duration: transition.duration
	          });
	        }
	        subgroup.push(node);
	      }
	    }
	    return d3_transition(subgroups, ns, id1);
	  };
	  function d3_transitionNamespace(name) {
	    return name == null ? "__transition__" : "__transition_" + name + "__";
	  }
	  function d3_transitionNode(node, i, ns, id, inherit) {
	    var lock = node[ns] || (node[ns] = {
	      active: 0,
	      count: 0
	    }),
	        transition = lock[id],
	        time,
	        timer,
	        duration,
	        ease,
	        tweens;
	    function schedule(elapsed) {
	      var delay = transition.delay;
	      timer.t = delay + time;
	      if (delay <= elapsed) return start(elapsed - delay);
	      timer.c = start;
	    }
	    function start(elapsed) {
	      var activeId = lock.active,
	          active = lock[activeId];
	      if (active) {
	        active.timer.c = null;
	        active.timer.t = NaN;
	        --lock.count;
	        delete lock[activeId];
	        active.event && active.event.interrupt.call(node, node.__data__, active.index);
	      }
	      for (var cancelId in lock) {
	        if (+cancelId < id) {
	          var cancel = lock[cancelId];
	          cancel.timer.c = null;
	          cancel.timer.t = NaN;
	          --lock.count;
	          delete lock[cancelId];
	        }
	      }
	      timer.c = tick;
	      d3_timer(function () {
	        if (timer.c && tick(elapsed || 1)) {
	          timer.c = null;
	          timer.t = NaN;
	        }
	        return 1;
	      }, 0, time);
	      lock.active = id;
	      transition.event && transition.event.start.call(node, node.__data__, i);
	      tweens = [];
	      transition.tween.forEach(function (key, value) {
	        if (value = value.call(node, node.__data__, i)) {
	          tweens.push(value);
	        }
	      });
	      ease = transition.ease;
	      duration = transition.duration;
	    }
	    function tick(elapsed) {
	      var t = elapsed / duration,
	          e = ease(t),
	          n = tweens.length;
	      while (n > 0) {
	        tweens[--n].call(node, e);
	      }
	      if (t >= 1) {
	        transition.event && transition.event.end.call(node, node.__data__, i);
	        if (--lock.count) delete lock[id];else delete node[ns];
	        return 1;
	      }
	    }
	    if (!transition) {
	      time = inherit.time;
	      timer = d3_timer(schedule, 0, time);
	      transition = lock[id] = {
	        tween: new d3_Map(),
	        time: time,
	        timer: timer,
	        delay: inherit.delay,
	        duration: inherit.duration,
	        ease: inherit.ease,
	        index: i
	      };
	      inherit = null;
	      ++lock.count;
	    }
	  }
	  d3.svg.axis = function () {
	    var scale = d3.scale.linear(),
	        orient = d3_svg_axisDefaultOrient,
	        innerTickSize = 6,
	        outerTickSize = 6,
	        tickPadding = 3,
	        tickArguments_ = [10],
	        tickValues = null,
	        tickFormat_;
	    function axis(g) {
	      g.each(function () {
	        var g = d3.select(this);
	        var scale0 = this.__chart__ || scale,
	            scale1 = this.__chart__ = scale.copy();
	        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues,
	            tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_,
	            tick = g.selectAll(".tick").data(ticks, scale1),
	            tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", ε),
	            tickExit = d3.transition(tick.exit()).style("opacity", ε).remove(),
	            tickUpdate = d3.transition(tick.order()).style("opacity", 1),
	            tickSpacing = Math.max(innerTickSize, 0) + tickPadding,
	            tickTransform;
	        var range = d3_scaleRange(scale1),
	            path = g.selectAll(".domain").data([0]),
	            pathUpdate = (path.enter().append("path").attr("class", "domain"), d3.transition(path));
	        tickEnter.append("line");
	        tickEnter.append("text");
	        var lineEnter = tickEnter.select("line"),
	            lineUpdate = tickUpdate.select("line"),
	            text = tick.select("text").text(tickFormat),
	            textEnter = tickEnter.select("text"),
	            textUpdate = tickUpdate.select("text"),
	            sign = orient === "top" || orient === "left" ? -1 : 1,
	            x1,
	            x2,
	            y1,
	            y2;
	        if (orient === "bottom" || orient === "top") {
	          tickTransform = d3_svg_axisX, x1 = "x", y1 = "y", x2 = "x2", y2 = "y2";
	          text.attr("dy", sign < 0 ? "0em" : ".71em").style("text-anchor", "middle");
	          pathUpdate.attr("d", "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize);
	        } else {
	          tickTransform = d3_svg_axisY, x1 = "y", y1 = "x", x2 = "y2", y2 = "x2";
	          text.attr("dy", ".32em").style("text-anchor", sign < 0 ? "end" : "start");
	          pathUpdate.attr("d", "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize);
	        }
	        lineEnter.attr(y2, sign * innerTickSize);
	        textEnter.attr(y1, sign * tickSpacing);
	        lineUpdate.attr(x2, 0).attr(y2, sign * innerTickSize);
	        textUpdate.attr(x1, 0).attr(y1, sign * tickSpacing);
	        if (scale1.rangeBand) {
	          var x = scale1,
	              dx = x.rangeBand() / 2;
	          scale0 = scale1 = function (d) {
	            return x(d) + dx;
	          };
	        } else if (scale0.rangeBand) {
	          scale0 = scale1;
	        } else {
	          tickExit.call(tickTransform, scale1, scale0);
	        }
	        tickEnter.call(tickTransform, scale0, scale1);
	        tickUpdate.call(tickTransform, scale1, scale1);
	      });
	    }
	    axis.scale = function (x) {
	      if (!arguments.length) return scale;
	      scale = x;
	      return axis;
	    };
	    axis.orient = function (x) {
	      if (!arguments.length) return orient;
	      orient = x in d3_svg_axisOrients ? x + "" : d3_svg_axisDefaultOrient;
	      return axis;
	    };
	    axis.ticks = function () {
	      if (!arguments.length) return tickArguments_;
	      tickArguments_ = d3_array(arguments);
	      return axis;
	    };
	    axis.tickValues = function (x) {
	      if (!arguments.length) return tickValues;
	      tickValues = x;
	      return axis;
	    };
	    axis.tickFormat = function (x) {
	      if (!arguments.length) return tickFormat_;
	      tickFormat_ = x;
	      return axis;
	    };
	    axis.tickSize = function (x) {
	      var n = arguments.length;
	      if (!n) return innerTickSize;
	      innerTickSize = +x;
	      outerTickSize = +arguments[n - 1];
	      return axis;
	    };
	    axis.innerTickSize = function (x) {
	      if (!arguments.length) return innerTickSize;
	      innerTickSize = +x;
	      return axis;
	    };
	    axis.outerTickSize = function (x) {
	      if (!arguments.length) return outerTickSize;
	      outerTickSize = +x;
	      return axis;
	    };
	    axis.tickPadding = function (x) {
	      if (!arguments.length) return tickPadding;
	      tickPadding = +x;
	      return axis;
	    };
	    axis.tickSubdivide = function () {
	      return arguments.length && axis;
	    };
	    return axis;
	  };
	  var d3_svg_axisDefaultOrient = "bottom",
	      d3_svg_axisOrients = {
	    top: 1,
	    right: 1,
	    bottom: 1,
	    left: 1
	  };
	  function d3_svg_axisX(selection, x0, x1) {
	    selection.attr("transform", function (d) {
	      var v0 = x0(d);
	      return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)";
	    });
	  }
	  function d3_svg_axisY(selection, y0, y1) {
	    selection.attr("transform", function (d) {
	      var v0 = y0(d);
	      return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")";
	    });
	  }
	  d3.svg.brush = function () {
	    var event = d3_eventDispatch(brush, "brushstart", "brush", "brushend"),
	        x = null,
	        y = null,
	        xExtent = [0, 0],
	        yExtent = [0, 0],
	        xExtentDomain,
	        yExtentDomain,
	        xClamp = true,
	        yClamp = true,
	        resizes = d3_svg_brushResizes[0];
	    function brush(g) {
	      g.each(function () {
	        var g = d3.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", brushstart).on("touchstart.brush", brushstart);
	        var background = g.selectAll(".background").data([0]);
	        background.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair");
	        g.selectAll(".extent").data([0]).enter().append("rect").attr("class", "extent").style("cursor", "move");
	        var resize = g.selectAll(".resize").data(resizes, d3_identity);
	        resize.exit().remove();
	        resize.enter().append("g").attr("class", function (d) {
	          return "resize " + d;
	        }).style("cursor", function (d) {
	          return d3_svg_brushCursor[d];
	        }).append("rect").attr("x", function (d) {
	          return (/[ew]$/.test(d) ? -3 : null
	          );
	        }).attr("y", function (d) {
	          return (/^[ns]/.test(d) ? -3 : null
	          );
	        }).attr("width", 6).attr("height", 6).style("visibility", "hidden");
	        resize.style("display", brush.empty() ? "none" : null);
	        var gUpdate = d3.transition(g),
	            backgroundUpdate = d3.transition(background),
	            range;
	        if (x) {
	          range = d3_scaleRange(x);
	          backgroundUpdate.attr("x", range[0]).attr("width", range[1] - range[0]);
	          redrawX(gUpdate);
	        }
	        if (y) {
	          range = d3_scaleRange(y);
	          backgroundUpdate.attr("y", range[0]).attr("height", range[1] - range[0]);
	          redrawY(gUpdate);
	        }
	        redraw(gUpdate);
	      });
	    }
	    brush.event = function (g) {
	      g.each(function () {
	        var event_ = event.of(this, arguments),
	            extent1 = {
	          x: xExtent,
	          y: yExtent,
	          i: xExtentDomain,
	          j: yExtentDomain
	        },
	            extent0 = this.__chart__ || extent1;
	        this.__chart__ = extent1;
	        if (d3_transitionInheritId) {
	          d3.select(this).transition().each("start.brush", function () {
	            xExtentDomain = extent0.i;
	            yExtentDomain = extent0.j;
	            xExtent = extent0.x;
	            yExtent = extent0.y;
	            event_({
	              type: "brushstart"
	            });
	          }).tween("brush:brush", function () {
	            var xi = d3_interpolateArray(xExtent, extent1.x),
	                yi = d3_interpolateArray(yExtent, extent1.y);
	            xExtentDomain = yExtentDomain = null;
	            return function (t) {
	              xExtent = extent1.x = xi(t);
	              yExtent = extent1.y = yi(t);
	              event_({
	                type: "brush",
	                mode: "resize"
	              });
	            };
	          }).each("end.brush", function () {
	            xExtentDomain = extent1.i;
	            yExtentDomain = extent1.j;
	            event_({
	              type: "brush",
	              mode: "resize"
	            });
	            event_({
	              type: "brushend"
	            });
	          });
	        } else {
	          event_({
	            type: "brushstart"
	          });
	          event_({
	            type: "brush",
	            mode: "resize"
	          });
	          event_({
	            type: "brushend"
	          });
	        }
	      });
	    };
	    function redraw(g) {
	      g.selectAll(".resize").attr("transform", function (d) {
	        return "translate(" + xExtent[+/e$/.test(d)] + "," + yExtent[+/^s/.test(d)] + ")";
	      });
	    }
	    function redrawX(g) {
	      g.select(".extent").attr("x", xExtent[0]);
	      g.selectAll(".extent,.n>rect,.s>rect").attr("width", xExtent[1] - xExtent[0]);
	    }
	    function redrawY(g) {
	      g.select(".extent").attr("y", yExtent[0]);
	      g.selectAll(".extent,.e>rect,.w>rect").attr("height", yExtent[1] - yExtent[0]);
	    }
	    function brushstart() {
	      var target = this,
	          eventTarget = d3.select(d3.event.target),
	          event_ = event.of(target, arguments),
	          g = d3.select(target),
	          resizing = eventTarget.datum(),
	          resizingX = !/^(n|s)$/.test(resizing) && x,
	          resizingY = !/^(e|w)$/.test(resizing) && y,
	          dragging = eventTarget.classed("extent"),
	          dragRestore = d3_event_dragSuppress(target),
	          center,
	          origin = d3.mouse(target),
	          offset;
	      var w = d3.select(d3_window(target)).on("keydown.brush", keydown).on("keyup.brush", keyup);
	      if (d3.event.changedTouches) {
	        w.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
	      } else {
	        w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
	      }
	      g.interrupt().selectAll("*").interrupt();
	      if (dragging) {
	        origin[0] = xExtent[0] - origin[0];
	        origin[1] = yExtent[0] - origin[1];
	      } else if (resizing) {
	        var ex = +/w$/.test(resizing),
	            ey = +/^n/.test(resizing);
	        offset = [xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1]];
	        origin[0] = xExtent[ex];
	        origin[1] = yExtent[ey];
	      } else if (d3.event.altKey) center = origin.slice();
	      g.style("pointer-events", "none").selectAll(".resize").style("display", null);
	      d3.select("body").style("cursor", eventTarget.style("cursor"));
	      event_({
	        type: "brushstart"
	      });
	      brushmove();
	      function keydown() {
	        if (d3.event.keyCode == 32) {
	          if (!dragging) {
	            center = null;
	            origin[0] -= xExtent[1];
	            origin[1] -= yExtent[1];
	            dragging = 2;
	          }
	          d3_eventPreventDefault();
	        }
	      }
	      function keyup() {
	        if (d3.event.keyCode == 32 && dragging == 2) {
	          origin[0] += xExtent[1];
	          origin[1] += yExtent[1];
	          dragging = 0;
	          d3_eventPreventDefault();
	        }
	      }
	      function brushmove() {
	        var point = d3.mouse(target),
	            moved = false;
	        if (offset) {
	          point[0] += offset[0];
	          point[1] += offset[1];
	        }
	        if (!dragging) {
	          if (d3.event.altKey) {
	            if (!center) center = [(xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2];
	            origin[0] = xExtent[+(point[0] < center[0])];
	            origin[1] = yExtent[+(point[1] < center[1])];
	          } else center = null;
	        }
	        if (resizingX && move1(point, x, 0)) {
	          redrawX(g);
	          moved = true;
	        }
	        if (resizingY && move1(point, y, 1)) {
	          redrawY(g);
	          moved = true;
	        }
	        if (moved) {
	          redraw(g);
	          event_({
	            type: "brush",
	            mode: dragging ? "move" : "resize"
	          });
	        }
	      }
	      function move1(point, scale, i) {
	        var range = d3_scaleRange(scale),
	            r0 = range[0],
	            r1 = range[1],
	            position = origin[i],
	            extent = i ? yExtent : xExtent,
	            size = extent[1] - extent[0],
	            min,
	            max;
	        if (dragging) {
	          r0 -= position;
	          r1 -= size + position;
	        }
	        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];
	        if (dragging) {
	          max = (min += position) + size;
	        } else {
	          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));
	          if (position < min) {
	            max = min;
	            min = position;
	          } else {
	            max = position;
	          }
	        }
	        if (extent[0] != min || extent[1] != max) {
	          if (i) yExtentDomain = null;else xExtentDomain = null;
	          extent[0] = min;
	          extent[1] = max;
	          return true;
	        }
	      }
	      function brushend() {
	        brushmove();
	        g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null);
	        d3.select("body").style("cursor", null);
	        w.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null);
	        dragRestore();
	        event_({
	          type: "brushend"
	        });
	      }
	    }
	    brush.x = function (z) {
	      if (!arguments.length) return x;
	      x = z;
	      resizes = d3_svg_brushResizes[!x << 1 | !y];
	      return brush;
	    };
	    brush.y = function (z) {
	      if (!arguments.length) return y;
	      y = z;
	      resizes = d3_svg_brushResizes[!x << 1 | !y];
	      return brush;
	    };
	    brush.clamp = function (z) {
	      if (!arguments.length) return x && y ? [xClamp, yClamp] : x ? xClamp : y ? yClamp : null;
	      if (x && y) xClamp = !!z[0], yClamp = !!z[1];else if (x) xClamp = !!z;else if (y) yClamp = !!z;
	      return brush;
	    };
	    brush.extent = function (z) {
	      var x0, x1, y0, y1, t;
	      if (!arguments.length) {
	        if (x) {
	          if (xExtentDomain) {
	            x0 = xExtentDomain[0], x1 = xExtentDomain[1];
	          } else {
	            x0 = xExtent[0], x1 = xExtent[1];
	            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
	            if (x1 < x0) t = x0, x0 = x1, x1 = t;
	          }
	        }
	        if (y) {
	          if (yExtentDomain) {
	            y0 = yExtentDomain[0], y1 = yExtentDomain[1];
	          } else {
	            y0 = yExtent[0], y1 = yExtent[1];
	            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
	            if (y1 < y0) t = y0, y0 = y1, y1 = t;
	          }
	        }
	        return x && y ? [[x0, y0], [x1, y1]] : x ? [x0, x1] : y && [y0, y1];
	      }
	      if (x) {
	        x0 = z[0], x1 = z[1];
	        if (y) x0 = x0[0], x1 = x1[0];
	        xExtentDomain = [x0, x1];
	        if (x.invert) x0 = x(x0), x1 = x(x1);
	        if (x1 < x0) t = x0, x0 = x1, x1 = t;
	        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [x0, x1];
	      }
	      if (y) {
	        y0 = z[0], y1 = z[1];
	        if (x) y0 = y0[1], y1 = y1[1];
	        yExtentDomain = [y0, y1];
	        if (y.invert) y0 = y(y0), y1 = y(y1);
	        if (y1 < y0) t = y0, y0 = y1, y1 = t;
	        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [y0, y1];
	      }
	      return brush;
	    };
	    brush.clear = function () {
	      if (!brush.empty()) {
	        xExtent = [0, 0], yExtent = [0, 0];
	        xExtentDomain = yExtentDomain = null;
	      }
	      return brush;
	    };
	    brush.empty = function () {
	      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];
	    };
	    return d3.rebind(brush, event, "on");
	  };
	  var d3_svg_brushCursor = {
	    n: "ns-resize",
	    e: "ew-resize",
	    s: "ns-resize",
	    w: "ew-resize",
	    nw: "nwse-resize",
	    ne: "nesw-resize",
	    se: "nwse-resize",
	    sw: "nesw-resize"
	  };
	  var d3_svg_brushResizes = [["n", "e", "s", "w", "nw", "ne", "se", "sw"], ["e", "w"], ["n", "s"], []];
	  var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat;
	  var d3_time_formatUtc = d3_time_format.utc;
	  var d3_time_formatIso = d3_time_formatUtc("%Y-%m-%dT%H:%M:%S.%LZ");
	  d3_time_format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? d3_time_formatIsoNative : d3_time_formatIso;
	  function d3_time_formatIsoNative(date) {
	    return date.toISOString();
	  }
	  d3_time_formatIsoNative.parse = function (string) {
	    var date = new Date(string);
	    return isNaN(date) ? null : date;
	  };
	  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;
	  d3_time.second = d3_time_interval(function (date) {
	    return new d3_date(Math.floor(date / 1e3) * 1e3);
	  }, function (date, offset) {
	    date.setTime(date.getTime() + Math.floor(offset) * 1e3);
	  }, function (date) {
	    return date.getSeconds();
	  });
	  d3_time.seconds = d3_time.second.range;
	  d3_time.seconds.utc = d3_time.second.utc.range;
	  d3_time.minute = d3_time_interval(function (date) {
	    return new d3_date(Math.floor(date / 6e4) * 6e4);
	  }, function (date, offset) {
	    date.setTime(date.getTime() + Math.floor(offset) * 6e4);
	  }, function (date) {
	    return date.getMinutes();
	  });
	  d3_time.minutes = d3_time.minute.range;
	  d3_time.minutes.utc = d3_time.minute.utc.range;
	  d3_time.hour = d3_time_interval(function (date) {
	    var timezone = date.getTimezoneOffset() / 60;
	    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
	  }, function (date, offset) {
	    date.setTime(date.getTime() + Math.floor(offset) * 36e5);
	  }, function (date) {
	    return date.getHours();
	  });
	  d3_time.hours = d3_time.hour.range;
	  d3_time.hours.utc = d3_time.hour.utc.range;
	  d3_time.month = d3_time_interval(function (date) {
	    date = d3_time.day(date);
	    date.setDate(1);
	    return date;
	  }, function (date, offset) {
	    date.setMonth(date.getMonth() + offset);
	  }, function (date) {
	    return date.getMonth();
	  });
	  d3_time.months = d3_time.month.range;
	  d3_time.months.utc = d3_time.month.utc.range;
	  function d3_time_scale(linear, methods, format) {
	    function scale(x) {
	      return linear(x);
	    }
	    scale.invert = function (x) {
	      return d3_time_scaleDate(linear.invert(x));
	    };
	    scale.domain = function (x) {
	      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
	      linear.domain(x);
	      return scale;
	    };
	    function tickMethod(extent, count) {
	      var span = extent[1] - extent[0],
	          target = span / count,
	          i = d3.bisect(d3_time_scaleSteps, target);
	      return i == d3_time_scaleSteps.length ? [methods.year, d3_scale_linearTickRange(extent.map(function (d) {
	        return d / 31536e6;
	      }), count)[2]] : !i ? [d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2]] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];
	    }
	    scale.nice = function (interval, skip) {
	      var domain = scale.domain(),
	          extent = d3_scaleExtent(domain),
	          method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" && tickMethod(extent, interval);
	      if (method) interval = method[0], skip = method[1];
	      function skipped(date) {
	        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;
	      }
	      return scale.domain(d3_scale_nice(domain, skip > 1 ? {
	        floor: function (date) {
	          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);
	          return date;
	        },
	        ceil: function (date) {
	          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);
	          return date;
	        }
	      } : interval));
	    };
	    scale.ticks = function (interval, skip) {
	      var extent = d3_scaleExtent(scale.domain()),
	          method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" ? tickMethod(extent, interval) : !interval.range && [{
	        range: interval
	      }, skip];
	      if (method) interval = method[0], skip = method[1];
	      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);
	    };
	    scale.tickFormat = function () {
	      return format;
	    };
	    scale.copy = function () {
	      return d3_time_scale(linear.copy(), methods, format);
	    };
	    return d3_scale_linearRebind(scale, linear);
	  }
	  function d3_time_scaleDate(t) {
	    return new Date(t);
	  }
	  var d3_time_scaleSteps = [1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6];
	  var d3_time_scaleLocalMethods = [[d3_time.second, 1], [d3_time.second, 5], [d3_time.second, 15], [d3_time.second, 30], [d3_time.minute, 1], [d3_time.minute, 5], [d3_time.minute, 15], [d3_time.minute, 30], [d3_time.hour, 1], [d3_time.hour, 3], [d3_time.hour, 6], [d3_time.hour, 12], [d3_time.day, 1], [d3_time.day, 2], [d3_time.week, 1], [d3_time.month, 1], [d3_time.month, 3], [d3_time.year, 1]];
	  var d3_time_scaleLocalFormat = d3_time_format.multi([[".%L", function (d) {
	    return d.getMilliseconds();
	  }], [":%S", function (d) {
	    return d.getSeconds();
	  }], ["%I:%M", function (d) {
	    return d.getMinutes();
	  }], ["%I %p", function (d) {
	    return d.getHours();
	  }], ["%a %d", function (d) {
	    return d.getDay() && d.getDate() != 1;
	  }], ["%b %d", function (d) {
	    return d.getDate() != 1;
	  }], ["%B", function (d) {
	    return d.getMonth();
	  }], ["%Y", d3_true]]);
	  var d3_time_scaleMilliseconds = {
	    range: function (start, stop, step) {
	      return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate);
	    },
	    floor: d3_identity,
	    ceil: d3_identity
	  };
	  d3_time_scaleLocalMethods.year = d3_time.year;
	  d3_time.scale = function () {
	    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
	  };
	  var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function (m) {
	    return [m[0].utc, m[1]];
	  });
	  var d3_time_scaleUtcFormat = d3_time_formatUtc.multi([[".%L", function (d) {
	    return d.getUTCMilliseconds();
	  }], [":%S", function (d) {
	    return d.getUTCSeconds();
	  }], ["%I:%M", function (d) {
	    return d.getUTCMinutes();
	  }], ["%I %p", function (d) {
	    return d.getUTCHours();
	  }], ["%a %d", function (d) {
	    return d.getUTCDay() && d.getUTCDate() != 1;
	  }], ["%b %d", function (d) {
	    return d.getUTCDate() != 1;
	  }], ["%B", function (d) {
	    return d.getUTCMonth();
	  }], ["%Y", d3_true]]);
	  d3_time_scaleUtcMethods.year = d3_time.year.utc;
	  d3_time.scale.utc = function () {
	    return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat);
	  };
	  d3.text = d3_xhrType(function (request) {
	    return request.responseText;
	  });
	  d3.json = function (url, callback) {
	    return d3_xhr(url, "application/json", d3_json, callback);
	  };
	  function d3_json(request) {
	    return JSON.parse(request.responseText);
	  }
	  d3.html = function (url, callback) {
	    return d3_xhr(url, "text/html", d3_html, callback);
	  };
	  function d3_html(request) {
	    var range = d3_document.createRange();
	    range.selectNode(d3_document.body);
	    return range.createContextualFragment(request.responseText);
	  }
	  d3.xml = d3_xhrType(function (request) {
	    return request.responseXML;
	  });
	  if (true) this.d3 = d3, !(__WEBPACK_AMD_DEFINE_FACTORY__ = (d3), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if (typeof module === "object" && module.exports) module.exports = d3;else this.d3 = d3;
	}();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('d3'), require('jquery'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.d3, global.jquery);
	    global.xyChart = mod.exports;
	  }
	})(this, function (exports, _d, _jquery) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var d3 = _interopRequireWildcard(_d);

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  //var extend = jQuery.extend;

	  if (!d3.hasOwnProperty("id")) {
	    d3.id = function () {
	      var a = 0;return function () {
	        return a++;
	      };
	    }();
	  }

	  function xyChart(options_override) {
	    var debug = false;
	    var options_defaults = {
	      margin: { top: 10, right: 10, bottom: 75, left: 100 },
	      autoscale: true,
	      show_points: true,
	      show_line: true,
	      show_errorbars: false,
	      numberOfTicks: 4,
	      position_cursor: true,
	      vcursor: false,
	      hcursor: false,
	      xlabel: "x-axis",
	      ylabel: "y-axis",
	      zlabel: "z-axis",
	      errorbar_width: 12,
	      xtransform: "linear",
	      ytransform: "linear",
	      legend: { show: false, left: 65 },
	      axes: {
	        xaxis: { label: "x-axis" },
	        yaxis: { label: "y-axis" }
	      },
	      point_size: 2.5,
	      series: new Array()
	    };

	    var options = (0, _jquery.extend)(true, {}, options_defaults, options_override); // copy

	    var id = d3.id();
	    var interactors = [];

	    this.options = options;
	    var max_y = options.max_y == null ? -Infinity : options.max_y;
	    var min_y = options.min_y == null ? Infinity : options.min_y;
	    var max_x = options.max_x == null ? -Infinity : options.max_x;
	    var min_x = options.min_x == null ? Infinity : options.min_x;
	    var zoomRect = false;
	    var zoomScroll = false;
	    var zoomed = false; // zoomed state.

	    var labels = options.series.map(function (d, i) {
	      return d.label || i;
	    });
	    var x = d3.scale[options.xtransform]();
	    var y = d3.scale[options.ytransform]();
	    var xAxis = d3.svg.axis(),
	        yAxis = d3.svg.axis(),
	        xAxisGrid = d3.svg.axis(),
	        yAxisGrid = d3.svg.axis();

	    var zoom = d3.behavior.zoom().x(x).y(y).on("zoom", function () {
	      zoomed = true;update();
	    });
	    var base_zoom_offset = 0.05; // zoom out 5% from min and max by default;
	    var resetzoom = function resetzoom(ev) {
	      var xoffset = (x.range()[1] - x.range()[0]) * base_zoom_offset,
	          yoffset = (y.range()[1] + y.range()[0]) * base_zoom_offset;
	      zoom.x(x.domain([min_x, max_x])).y(y.domain([min_y, max_y])).scale(1.0 - 2.0 * base_zoom_offset).translate([xoffset, yoffset]);
	      zoomed = false;
	      update();
	      //.call(this);
	    };
	    var source_data;

	    function do_autoscale() {
	      var extents;
	      var merged_data = d3.merge(source_data);
	      if (options.show_errorbars) {
	        max_y = d3.extent(merged_data, function (d) {
	          var yy = d[2] && d[2].yupper != undefined ? d[2].yupper : d[1];
	          return isFinite(y(yy)) ? yy : null;
	        })[1];
	        min_y = d3.extent(merged_data, function (d) {
	          var yy = d[2] && d[2].ylower != undefined ? d[2].ylower : d[1];
	          return isFinite(y(yy)) ? yy : null;
	        })[0];
	        max_x = d3.extent(merged_data, function (d) {
	          var xx = d[2] && d[2].xupper != undefined ? d[2].xupper : d[0];
	          return isFinite(x(xx)) ? xx : null;
	        })[1];
	        min_x = d3.extent(merged_data, function (d) {
	          var xx = d[2] && d[2].xlower != undefined ? d[2].xlower : d[0];
	          return isFinite(x(xx)) ? xx : null;
	        })[0];
	      } else {
	        extents = d3.extent(merged_data, function (d) {
	          return isFinite(y(d[1])) ? d[1] : null;
	        });
	        min_y = extents[0];
	        max_y = extents[1];
	        extents = d3.extent(merged_data, function (d) {
	          return isFinite(x(d[0])) ? d[0] : null;
	        });
	        min_x = extents[0];
	        max_x = extents[1];
	      }
	      /*
	      var dx = (x(max_x) - x(min_x)) || 1.0,
	          dy = (y(max_y) - y(min_y)) || 1.0;
	      
	      min_x = x.invert(x(min_x) - (dx * base_zoom_offset));
	      max_x = x.invert(x(max_x) + (dx * base_zoom_offset));
	      min_y = y.invert(y(min_y) - (dy * base_zoom_offset)); 
	      max_y = y.invert(y(max_y) + (dy * base_zoom_offset));
	      */
	      var xav = max_x - min_x,
	          yrange = max_y - min_y;
	      if (max_x == min_x) {
	        max_x += max_x * 0.1 || 0.1;
	        min_x -= min_x * 0.1 || 0.1;
	      }
	      if (max_y == min_y) {
	        max_y += max_y * 0.1 || 0.1;
	        min_y -= min_y * 0.1 || 0.1;
	      }
	      return { min_x: min_x, max_x: max_x, min_y: min_y, max_y: max_y };
	    }
	    this.do_autoscale = do_autoscale;

	    // make it possible to show single data points:
	    if (min_x == max_x) {
	      min_x -= 1;
	      max_x += 1;
	    }
	    if (min_y == max_y) {
	      min_y -= 1;
	      max_y += 1;
	    }

	    var old_colors = ['steelblue', 'green', 'red', 'purple'];

	    var colors = ["#4bb2c5", "#EAA228", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc", "#c747a3", "#cddf54", "#FBD178", "#26B4E3", "#bd70c7"];

	    function chart(selection) {
	      selection.each(function (data) {
	        var outercontainer = d3.select(this),
	            innerwidth = outercontainer.node().clientWidth,
	            innerheight = outercontainer.node().clientHeight,
	            width = innerwidth - options.margin.right - options.margin.left,
	            height = innerheight - options.margin.top - options.margin.bottom;
	        chart.outercontainer = outercontainer;
	        source_data = data;
	        //chart.update = function() { outercontainer.transition().call(chart); };   
	        chart.update = update;
	        if (options.autoscale) {
	          do_autoscale();
	        }

	        //************************************************************
	        // Create Margins and Axis and hook our zoom function
	        //************************************************************

	        x.domain([min_x, max_x]).range([0, width]);

	        y.domain([min_y, max_y]).range([height, 0]);

	        xAxisGrid.scale(x).tickSize(-height).ticks(options.numberOfTicks).tickPadding(10).tickSubdivide(true).orient("bottom").tickFormat("");

	        yAxisGrid.scale(y).tickPadding(10).ticks(options.numberOfTicks).tickSize(-width).tickSubdivide(true).orient("left").tickFormat("");

	        xAxis.scale(x).ticks(options.numberOfTicks).tickPadding(10).tickSubdivide(true).orient("bottom");

	        yAxis.scale(y).ticks(options.numberOfTicks).tickPadding(10).tickSubdivide(true).orient("left");

	        zoom.x(x).y(y);

	        //************************************************************
	        // Generate our SVG object
	        //************************************************************
	        var svg = outercontainer.append("svg").attr("class", "mainplot")
	        //.call(zoom) // call this from zoomScroll setter
	        .on("dblclick.zoom", null)
	        //.on("dblclick.resetzoom", null)
	        .on("dblclick.resetzoom", resetzoom);

	        var axes = svg.append("g").attr("class", "axes").attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

	        var mainview = svg.append("g").attr("class", "mainview").attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

	        var drag = d3.behavior.drag();
	        svg.call(drag);
	        chart.drag = drag;

	        drag.on("dragstart.zoomRect", function () {
	          if (!zoomRect) return;
	          var e = mainview.node(),
	              origin = d3.mouse(e),
	              rect = mainview.append("rect").attr("class", "zoom");
	          d3.select("body").classed("noselect", true);
	          origin[0] = Math.max(0, Math.min(width, origin[0]));
	          origin[1] = Math.max(0, Math.min(height, origin[1]));
	          //d3.select(window)
	          drag.on("drag.zoomRect", function () {
	            var m = d3.mouse(e);
	            m[0] = Math.max(0, Math.min(width, m[0]));
	            m[1] = Math.max(0, Math.min(height, m[1]));
	            rect.attr("x", Math.min(origin[0], m[0])).attr("y", Math.min(origin[1], m[1])).attr("width", Math.abs(m[0] - origin[0])).attr("height", Math.abs(m[1] - origin[1]));
	          }).on("dragend.zoomRect", function () {
	            //d3.select(window).on("mousemove.zoomRect", null).on("mouseup.zoomRect", null);
	            drag.on("drag.zoomRect", null).on("dragend.zoomRect", null);
	            d3.select("body").classed("noselect", false);
	            var m = d3.mouse(e);
	            m[0] = Math.max(0, Math.min(width, m[0]));
	            m[1] = Math.max(0, Math.min(height, m[1]));
	            if (m[0] !== origin[0] && m[1] !== origin[1]) {
	              zoom.x(x.domain([origin[0], m[0]].map(x.invert).sort(function (a, b) {
	                return a - b;
	              }))).y(y.domain([origin[1], m[1]].map(y.invert).sort(function (a, b) {
	                return a - b;
	              })));
	            } else {
	              // reset zoom on single click? No!
	              /*
	              zoom.scale(1);
	              zoom.translate([0,0]);
	              zoom.x(x.domain([min_x, max_x]))
	                  .y(y.domain([min_y, max_y]));
	              */
	            }
	            rect.remove();
	            zoomed = true;
	            update();
	          }, true);
	        });

	        mainview.append("g").attr("class", "legend").attr("transform", "translate(" + (width - 65) + ",25)");
	        //.call(zoom);
	        axes.append("g").attr("class", "x axis").append("text").attr("class", "x axis-label").attr("x", width / 2.0).attr("text-anchor", "middle").attr("y", options.margin.bottom - 15);
	        axes.append("g").attr("class", "y axis").append("text").attr("class", "y axis-label").attr("text-anchor", "middle").attr("transform", "rotate(-90)").attr("y", -options.margin.left + 15).attr("x", -height / 2);
	        mainview.append("defs").append("clipPath").attr("id", "d3clip_" + id.toFixed()) // local def
	        .append("rect")
	        //.attr("x", 0) // x(min_x)) // options.margin.left)
	        //.attr("y", 0)
	        .attr("width", width).attr("height", height);

	        mainview.attr("clip-path", "url(#d3clip_" + id.toFixed() + ")");

	        axes.append("g").attr("class", "x grid");
	        axes.append("g").attr("class", "y grid");

	        axes.select(".x.axis").call(xAxis);
	        axes.select(".y.axis").call(yAxis);
	        axes.select(".x.grid").call(xAxisGrid);
	        axes.select(".y.grid").call(yAxisGrid);
	        axes.select(".x.axis-label").text(((options.axes || {}).xaxis || {}).label || "x-axis");
	        axes.select(".y.axis-label").text(((options.axes || {}).yaxis || {}).label || "y-axis");

	        svg.attr("width", width + options.margin.left + options.margin.right).attr("height", height + options.margin.top + options.margin.bottom);

	        axes.selectAll("g.x").attr("transform", "translate(0," + height + ")");

	        chart.svg = svg;
	        chart.g = svg.selectAll("g.mainview");
	        resetzoom(); // set to 10% zoom out.

	        chart.draw_lines(data);
	        chart.draw_points(data);
	        chart.draw_errorbars(data);
	        chart.draw_legend(data);

	        //************************************************************
	        // Position cursor (shows position of mouse in data coords)
	        //************************************************************
	        if (options.position_cursor) {
	          var position_cursor = mainview.selectAll(".position-cursor").data([0]);
	          position_cursor.enter().append("text").attr("class", "position-cursor").attr("x", width - 10).attr("y", height - 10).style("text-anchor", "end");

	          var follow = function follow() {
	            var mouse = d3.mouse(mainview.node());
	            position_cursor.text(x.invert(mouse[0]).toPrecision(5) + ", " + y.invert(mouse[1]).toPrecision(5));
	          };

	          svg.on("mousemove.position_cursor", null).on("mouseover.position_cursor", null).on("mousemove.position_cursor", follow).on("mouseover.position_cursor", follow);
	        }

	        //************************************************************
	        // Vertical cursor (or horizontal)
	        //************************************************************
	        if (options.vcursor) {
	          var vertical = svg.append("path").attr("class", "vertical-cursor").attr("d", "M 0 0 L 0 " + height).attr("stroke", "black").attr("stroke-width", 2);

	          var follow_x = function follow_x() {
	            var mouse = d3.mouse(mainview.node());
	            var mousex = mouse[0];
	            vertical.attr("d", "M " + mousex.toFixed(1) + " 0 L " + mousex.toFixed(1) + " " + height);
	          };

	          svg.on("mousemove.vcursor", follow_x).on("mouseover.vcursor", follow_x);
	        }

	        if (options.hcursor) {
	          var horizontal = svg.append("path").attr("class", "horizontal-cursor").attr("d", "M 0 0 L " + width + " 0").attr("stroke", "black").attr("stroke-width", 2);

	          var follow_y = function follow_y() {
	            var mouse = d3.mouse(mainview.node());
	            var mousey = mouse[1];
	            horizontal.attr("d", "M 0 " + mousey.toFixed(1) + " L " + width + " " + mousey.toFixed(1));
	          };

	          svg.on("mousemove.hcursor", follow_y).on("mouseover.hcursor", follow_y);
	        }
	      });
	    }

	    //************************************************************
	    // Create D3 legend
	    //************************************************************
	    chart.draw_legend = function (data) {
	      var el = chart.svg.select("g.legend");
	      var update_sel = el.selectAll('g').data(data);
	      update_sel.enter().append('g').each(function (d, i) {
	        var g = d3.select(this);
	        g.append("rect").attr("x", -options.legend.left).attr("y", i * 25 + 15).attr("width", 10).attr("height", 10).style("fill", get_series_color(null, i)).on("mouseover", function () {
	          chart.svg.selectAll('path.line').classed('highlight', function (d, ii) {
	            return ii == i;
	          });
	        }).on("mouseout", function () {
	          chart.svg.selectAll('path.line').classed('highlight', false);
	        });

	        g.append("text").attr("x", 15 - options.legend.left).attr("y", i * 25 + 25).attr("height", 30).attr("width", 100).style("text-anchor", "start").style("fill", get_series_color(null, i)).on("mouseover", function () {
	          chart.svg.selectAll('path.line').classed('highlight', function (d, ii) {
	            return ii == i;
	          });
	        }).on("mouseout", function () {
	          chart.svg.selectAll('path.line').classed('highlight', false);
	        });
	      });
	      update_sel.exit().remove();

	      el.selectAll("text").each(function (d, i) {
	        d3.select(this).text(options.series[i] && options.series[i].label != null ? options.series[i].label : i + 1);
	      });
	    };

	    var line = d3.svg.line().defined(function (d) {
	      return d && d[1] != null && isFinite(x(d[0])) && isFinite(y(d[1]));
	    }).x(function (d) {
	      return x(d[0]);
	    }).y(function (d) {
	      return y(d[1]);
	    });

	    //************************************************************
	    // Create D3 line object and draw data on our SVG object
	    //************************************************************
	    chart.draw_lines = function (data) {
	      var update_sel = chart.g.selectAll('.line').data(filterShowOption('show_line', data));
	      update_sel.enter().append("path").attr("class", "line").attr('stroke', get_series_color);
	      update_sel.exit().remove();

	      chart.g.selectAll('path.line').attr("d", line);
	    };

	    //************************************************************
	    // Draw points on SVG object based on the data given
	    //************************************************************
	    chart.draw_points = function (data) {
	      var series_sel = chart.g.selectAll("g.series").data(filterShowOption('show_points', data));
	      series_sel.enter().append("g").attr("class", "series").style("fill", get_series_color);
	      series_sel.exit().remove();

	      var update_sel = chart.g.selectAll("g.series").selectAll(".dot").data(function (d) {
	        return d;
	      });
	      update_sel.enter().append("circle")
	      //.filter(function(d) { return (d && d[1] != null && isFinite(x(d[0])) && isFinite(y(d[1]))); })
	      .attr("class", "dot").attr("clip-path", "url(#d3clip_" + id.toFixed() + ")").attr("r", options.point_size);
	      update_sel.exit().remove();

	      chart.g.selectAll("g.series .dot").each(function (d, i) {
	        var xp = x(d[0]),
	            unplottable_xp = !isFinite(xp) || d[0] == null || xp == null,
	            yp = y(d[1]),
	            unplottable_yp = !isFinite(yp) || d[1] == null || yp == null;
	        d3.select(this).attr("cx", unplottable_xp ? null : xp) // isFinite(xp)?function(d) { var xp = x(d[0]); return isFinite(xp) ? xp : null })
	        .attr("cy", unplottable_yp ? null : yp) //function(d) { var yp = y(d[1]); return isFinite(yp) ? yp : null });
	        .style("visibility", unplottable_xp || unplottable_yp ? "hidden" : "visible");
	      });
	    };

	    //************************************************************
	    // Draw error bars on SVG object based on the data given
	    //************************************************************
	    chart.draw_errorbars = function (data) {
	      var series_sel = chart.g.selectAll(".errorbars").data(filterShowOption('show_errorbars', data));
	      series_sel.enter().append("g").classed("errorbars", true).style("stroke", get_series_color).style("stroke-width", "1.5px");
	      series_sel.exit().remove();

	      var update_sel = chart.g.selectAll(".errorbars").selectAll(".errorbar").data(function (d, i) {
	        return d;
	      });
	      update_sel.enter().append("path").classed("errorbar", true);
	      update_sel.exit().remove();

	      chart.g.selectAll(".errorbars").selectAll("path.errorbar").attr("d", errorbar_generator);
	    };

	    //************************************************************
	    // Zoom specific updates
	    //************************************************************
	    function update() {
	      var svg = chart.svg;
	      svg.select(".x.axis").call(xAxis);
	      svg.select(".y.axis").call(yAxis);
	      svg.select(".x.axis .x.axis-label").text(options.axes.xaxis.label);
	      svg.select(".y.axis .y.axis-label").text(options.axes.yaxis.label);
	      svg.select(".x.grid").call(xAxisGrid);
	      svg.select(".y.grid").call(yAxisGrid);
	      svg.selectAll("rect.zoom").remove();

	      chart.draw_lines(source_data);
	      chart.draw_points(source_data);
	      chart.draw_errorbars(source_data);
	      chart.draw_legend(source_data);

	      chart.interactors().forEach(function (d, i) {
	        if (d.update) {
	          d.update();
	        }
	      });
	    }

	    function refresh() {
	      chart.svg.select(".x.axis").call(xAxis);
	      chart.svg.select(".y.axis").call(yAxis);
	    }

	    function filterShowOption(optname, data) {
	      return data.map(function (d, i) {
	        var localopt = ((options || {}).series || [])[i] || {};
	        if (localopt[optname] == false || localopt[optname] === undefined && !options[optname]) {
	          return [];
	        } else {
	          return d;
	        }
	      });
	    }

	    function get_series_color(_, i) {
	      // use color specified in options.series, if it exists
	      // otherwise grab from the default colors list:
	      return (options.series[i] || {}).color || colors[i % colors.length];
	    }

	    function errorbar_generator(d) {
	      var errorbar_width = options.errorbar_width;
	      var pathstring = "";
	      if (!d[2]) {
	        return pathstring;
	      }
	      var draw_top_bottom = d[2].yupper != d[2].ylower && isFinite(y(d[2].ylower)) && isFinite(y(d[2].yupper));
	      var draw_left_right = d[2].xupper != d[2].xlower && isFinite(x(d[2].xlower)) && isFinite(x(d[2].xupper));
	      var px = x(d[0]),
	          py = y(d[1]),
	          pux = x(d[2].xupper),
	          plx = x(d[2].xlower),
	          puy = y(d[2].yupper),
	          ply = y(d[2].ylower);
	      if (draw_top_bottom) {
	        // draw the top bar...
	        pathstring += "M" + (px - errorbar_width / 2.0).toFixed(3);
	        pathstring += "," + puy.toFixed(3);
	        pathstring += "L" + (px + errorbar_width / 2.0).toFixed(3);
	        pathstring += "," + puy.toFixed(3);
	        // draw the vertical...
	        pathstring += "M" + px.toFixed(3);
	        pathstring += "," + puy.toFixed(3);
	        pathstring += "L" + px.toFixed(3);
	        pathstring += "," + ply.toFixed(3);
	        // draw the bottom bar
	        pathstring += "M" + (px - errorbar_width / 2.0).toFixed(3);
	        pathstring += "," + ply.toFixed(3);
	        pathstring += "L" + (px + errorbar_width / 2.0).toFixed(3);
	        pathstring += "," + ply.toFixed(3);
	      }
	      if (draw_left_right) {
	        // draw the left bar...
	        pathstring += "M" + plx.toFixed(3);
	        pathstring += "," + (py - errorbar_width / 2.0).toFixed(3);
	        pathstring += "L" + plx.toFixed(3);
	        pathstring += "," + (py + errorbar_width / 2.0).toFixed(3);
	        // draw the horizontal...
	        pathstring += "M" + plx.toFixed(3);
	        pathstring += "," + py.toFixed(3);
	        pathstring += "L" + pux.toFixed(3);
	        pathstring += "," + py.toFixed(3);
	        // draw the right bar
	        pathstring += "M" + pux.toFixed(3);
	        pathstring += "," + (py - errorbar_width / 2.0).toFixed(3);
	        pathstring += "L" + pux.toFixed(3);
	        pathstring += "," + (py + errorbar_width / 2.0).toFixed(3);
	      }

	      return pathstring;
	    }

	    chart.options = function (_, clear) {
	      if (!arguments.length) return options;
	      if (clear) {
	        options = (0, _jquery.extend)(true, {}, options_defaults, _);
	      } else {
	        (0, _jquery.extend)(true, options, _);
	      }
	      return chart;
	    };

	    chart.source_data = function (_) {
	      if (!arguments.length) return source_data;
	      source_data = _;
	      do_autoscale();
	      //x.domain([min_x, max_x]);
	      //y.domain([min_y, max_y]);
	      if (!zoomed && options.autoscale) {
	        chart.resetzoom();
	      }
	      return chart;
	    };

	    chart.x = function (_) {
	      if (!arguments.length) return x;
	      x = _;
	      return chart;
	    };

	    chart.y = function (_) {
	      if (!arguments.length) return y;
	      y = _;
	      return chart;
	    };

	    chart.min_x = function (_) {
	      if (!arguments.length) return min_x;
	      min_x = _;
	      return chart;
	    };

	    chart.max_x = function (_) {
	      if (!arguments.length) return max_x;
	      max_x = _;
	      return chart;
	    };

	    chart.min_y = function (_) {
	      if (!arguments.length) return min_y;
	      min_y = _;
	      return chart;
	    };

	    chart.max_y = function (_) {
	      if (!arguments.length) return max_y;
	      max_y = _;
	      return chart;
	    };

	    chart.zoomRect = function (_) {
	      if (!arguments.length) return zoomRect;
	      zoomRect = _;
	      return chart;
	    };

	    chart.zoomScroll = function (_) {
	      if (!arguments.length) return zoomScroll;
	      zoomScroll = _;
	      if (zoomScroll == true) {
	        chart.svg.call(zoom);
	        chart.svg.on("dblclick.zoom", null);
	      } else if (zoomScroll == false) {
	        chart.svg.on(".zoom", null);
	      }
	      return chart;
	    };

	    chart.xtransform = function (_) {
	      if (!arguments.length) return options.xtransform;
	      options.xtransform = _;
	      var old_range = x.range(),
	          old_domain = x.domain();
	      x = d3.scale[options.xtransform]();
	      do_autoscale();
	      x.domain([min_x, max_x]).range(old_range);
	      xAxis.scale(x);
	      xAxisGrid.scale(x);
	      interactors.forEach(function (d) {
	        d.x(x);
	      });
	      chart.resetzoom();
	      return chart;
	    };

	    chart.ytransform = function (_) {
	      if (!arguments.length) return options.ytransform;
	      options.ytransform = _;
	      var old_range = y.range(),
	          old_domain = y.domain();
	      y = d3.scale[options.ytransform]();
	      do_autoscale();
	      y.domain([min_y, max_y]).range(old_range);
	      yAxis.scale(y);
	      yAxisGrid.scale(y);
	      interactors.forEach(function (d) {
	        d.y(y);
	      });
	      chart.resetzoom();
	      return chart;
	    };

	    chart.interactors = function (_) {
	      if (!arguments.length) return interactors;
	      chart.svg.select("g.mainview").call(_);
	      _.x(x).y(y).update();
	      interactors.push(_);
	      return chart;
	    };

	    chart.export_svg = function () {
	      var dsvg = d3.select(chart.svg.node().cloneNode(true));
	      dsvg.style("font-family", "sans-serif").style("font-size", "14px");
	      dsvg.selectAll("line").style("fill", "none");
	      dsvg.selectAll("path").style("fill", "none");
	      dsvg.selectAll(".mainview>rect").style("fill", "none");
	      dsvg.selectAll("clippath rect").style("fill", "none");
	      dsvg.selectAll(".axis-label").style("font-size", "18px");
	      dsvg.selectAll(".axis path, .axis line").style("stroke", "black"); //.css("stroke-width", "1.5px");
	      dsvg.selectAll(".grid .tick").style("stroke", "lightgrey").style("opacity", "0.7");
	      dsvg.selectAll(".grid path").style("stroke-width", "0");
	      dsvg.selectAll("text.position-cursor").remove();
	      return dsvg.node(); // user outerHTML of this
	    };

	    chart.print_plot = function () {
	      var svg = chart.export_svg();
	      var serializer = new XMLSerializer();
	      var svg_blob = new Blob([serializer.serializeToString(svg)], { 'type': "image/svg+xml" });
	      var url = URL.createObjectURL(svg_blob);
	      var svg_win = window.open(url, "svg_win");
	    };

	    chart.autofit = function () {
	      var outercontainer = chart.outercontainer,
	          innerwidth = outercontainer.node().clientWidth,
	          innerheight = outercontainer.node().clientHeight,
	          width = innerwidth - options.margin.right - options.margin.left,
	          height = innerheight - options.margin.top - options.margin.bottom;

	      x.range([0, width]);
	      y.range([height, 0]);

	      zoom.x(x).y(y);
	      xAxis.scale(x);
	      yAxis.scale(y);
	      xAxisGrid.scale(x).tickSize(-height);
	      yAxisGrid.scale(y).tickSize(-width);

	      chart.svg.attr("width", width + options.margin.left + options.margin.right).attr("height", height + options.margin.top + options.margin.bottom);
	      chart.svg.select("clipPath rect").attr("width", width).attr("height", height);
	      chart.svg.selectAll("g.axes g.x").attr("transform", "translate(0," + height + ")");

	      chart.svg.selectAll("g.x.axis text").attr("x", width / 2.0);
	      chart.svg.selectAll("g.y.axis text").attr("x", -height / 2.0);
	      chart.svg.select(".position-cursor").attr("x", width - 10).attr("y", height - 10);
	      chart.svg.select("g.legend").attr("transform", "translate(" + (width - 65) + ",25)");

	      update();
	    };

	    chart.resetzoom = resetzoom;

	    chart.type = "xy";

	    return chart;
	  }

	  exports.default = xyChart;
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('d3'), require('jquery'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.d3, global.jquery);
	    global.heatChartColorbarTypedOptions = mod.exports;
	  }
	})(this, function (exports, _d, _jquery) {
	  "use strict";

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = heatChart;

	  var d3 = _interopRequireWildcard(_d);

	  var _jquery2 = _interopRequireDefault(_jquery);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  if (!d3.hasOwnProperty("id")) {
	    d3.id = function () {
	      var a = 0;return function () {
	        return a++;
	      };
	    }();
	  }

	  function heatChart(options_override) {
	    var debug = false;
	    var options_defaults = {
	      margin: { top: 10, right: 10, bottom: 50, left: 50 },
	      cb_margin: { top: 10, right: 50, bottom: 50, left: 10 },
	      show_grid: true,
	      show_colorbar: true,
	      position_cursor: true,
	      colorbar_width: 120,
	      numberOfTicks: 4,
	      aspect_ratio: null,
	      autoscale: false,
	      xlabel: "x-axis",
	      ylabel: "y-axis",
	      zlabel: "z-axis",
	      ztransform: "linear",
	      dims: {
	        xmin: 0,
	        xmax: 1,
	        ymin: 0,
	        ymax: 1,
	        zmin: 1.0,
	        zmax: 100.0
	      }
	    };
	    var options = jQuery.extend(true, {}, options_defaults); // copy
	    jQuery.extend(true, options, options_override); // process any overrides from creation;

	    //var zoomRect = false;
	    var zoomScroll = false;
	    var interactors = [];
	    var plotdata, source_data;
	    var z = d3.scale[options.ztransform]();

	    var dims = options.dims;
	    // create working copy of zmax and zmin, for zooming colorbar
	    var zdims = {};
	    var id = d3.id();

	    var x = d3.scale.linear();
	    var y = d3.scale.linear();
	    var xAxis = d3.svg.axis();
	    var yAxis = d3.svg.axis();
	    var zAxis = d3.svg.axis();
	    var xAxisGrid = d3.svg.axis();
	    var yAxisGrid = d3.svg.axis();
	    var colormap = jet_colormap;

	    var zoomed = function zoomed() {
	      _redraw_main = true;
	    };
	    var zoom = d3.behavior.zoom().on("zoom.heatmap", zoomed);
	    var resetzoom = function resetzoom() {
	      zoom.translate([0, 0]).scale(1);
	      zoomed.call(this);
	    };

	    var cb_zoomed = function cb_zoomed() {
	      var svg = d3.select(this);
	      svg.select(".z.axis").call(zAxis);
	      zdims.zmax = Math.max.apply(Math, z.domain());
	      zdims.zmin = Math.min.apply(Math, z.domain());
	      _recalculate_main = true;
	      //chart.redrawImage();
	    };
	    var cb_zoom = d3.behavior.zoom().on("zoom.colorbar", null).on("zoom.colorbar", cb_zoomed);

	    var cb_resetzoom = function cb_resetzoom() {
	      cb_zoom.translate([0, 0]).scale(1);
	      cb_zoomed.call(this);
	    };

	    //var dispatch = d3.dispatch("update", "redrawImage");
	    //dispatch.on("redrawImage", function() {
	    //      _redraw_backing = true;
	    //      chart.redrawImage();
	    //});

	    // some private working variables
	    var backing_canvas = document.createElement('canvas');
	    var backing_image;
	    var colorbar_backing_canvas = document.createElement('canvas');
	    var _recalculate_main = false;
	    var _redraw_main = false;
	    var _redraw_backing = true;
	    var _redraw_colorbar = true;
	    var _colormap_array = [];

	    function chart(selection) {
	      selection.each(function (data) {
	        var offset_right = options.show_colorbar ? options.colorbar_width + 5 : 0;
	        var outercontainer = d3.select(this),
	            innerwidth = outercontainer.node().clientWidth - offset_right,
	            innerheight = outercontainer.node().clientHeight,
	            width = innerwidth - options.margin.right - options.margin.left,
	            height = innerheight - options.margin.top - options.margin.bottom;
	        chart.outercontainer = outercontainer;
	        source_data = data;
	        //chart.update = function() { outercontainer.transition().call(chart); chart.colorbar.update(); };   
	        if (options.autoscale) {
	          var new_min_max = get_min_max(data, z);
	          zdims.zmin = new_min_max.min;
	          zdims.zmax = new_min_max.max;
	        } else {
	          zdims.zmin = dims.zmin;
	          zdims.zmax = dims.zmax;
	        }

	        var limits = fixAspect(width, height);
	        // Update the x-scale.
	        x.domain([limits.xmin, limits.xmax]).range([0, width]);

	        // Update the y-scale.
	        y.domain([limits.ymin, limits.ymax]).range([height, 0]);

	        z.domain([zdims.zmin, zdims.zmax]);

	        make_plotdata();

	        xAxisGrid.scale(x).orient("bottom").ticks(options.numberOfTicks).tickPadding(10).tickSize(-height, 0, 0).tickFormat("");

	        yAxisGrid.scale(y).ticks(options.numberOfTicks).tickPadding(10).tickSubdivide(true).orient("left").tickSize(-width, 0, 0).tickFormat("");

	        xAxis.scale(x).ticks(options.numberOfTicks).tickPadding(10).tickSubdivide(true).orient("bottom");

	        yAxis.scale(y).ticks(options.numberOfTicks).tickPadding(10).tickSubdivide(true).orient("left");

	        // we will bind data to the container div, a slightly non-standard
	        // arrangement.
	        var container = d3.select(this).selectAll("div.heatmap-container").data([0]);

	        zoom.x(x).y(y);

	        // if inner container doesn't exist, build it.
	        container.enter().append("div").attr("class", "heatmap-container").attr("width", innerwidth).attr("height", innerheight).style("display", "inline-block").style("width", innerwidth + "px").style("height", innerheight + "px");

	        var mainCanvas = container.selectAll("canvas.mainplot").data([0]);
	        mainCanvas.enter().append("canvas");
	        mainCanvas.attr("width", width).attr("height", height).attr("class", "mainplot").style("width", width + "px").style("height", height + "px").style("padding-left", options.margin.left + "px").style("padding-right", options.margin.right + "px").style("padding-top", options.margin.top + "px").call(drawImage);

	        chart.mainCanvas = mainCanvas;

	        var svg = container.selectAll("svg.mainplot").data([0]);
	        var esvg = svg.enter().append("svg").attr("class", "mainplot").on("dblclick.resetzoom", resetzoom);
	        esvg.append("g").attr("class", "x axis").append("text").attr("class", "x axis-label").attr("x", width / 2.0).attr("text-anchor", "middle").attr("y", 35);
	        esvg.append("g").attr("class", "y axis").append("text").attr("class", "y axis-label").attr("text-anchor", "middle").attr("transform", "rotate(-90)").attr("y", -35).attr("x", -height / 2);

	        esvg.append("g").attr("class", "x grid");
	        esvg.append("g").attr("class", "y grid");
	        esvg.append("g").attr("class", "y interactors");
	        var mainview = esvg.append("g").attr("class", "mainview").attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

	        svg.select(".x.axis").call(xAxis);
	        svg.select(".y.axis").call(yAxis);
	        svg.select(".x.grid").call(xAxisGrid);
	        svg.select(".y.grid").call(yAxisGrid);
	        svg.select(".x.axis-label").text(options.xlabel);
	        svg.select(".y.axis-label").text(options.ylabel);

	        svg.attr("width", width + options.margin.left + options.margin.right).attr("height", height + options.margin.top + options.margin.bottom);

	        svg.selectAll("g.x").attr("transform", "translate(" + options.margin.left + "," + (height + options.margin.top) + ")");
	        svg.selectAll("g.y").attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

	        chart.svg = svg;
	        //svg.call(zoom); // moved to zoomScroll function

	        //************************************************************
	        // Position cursor (shows position of mouse in data coords)
	        //************************************************************
	        if (options.position_cursor) {
	          var position_cursor = mainview.selectAll(".position-cursor").data([0]);
	          position_cursor.enter().append("text").attr("class", "position-cursor").attr("x", width - 10).attr("y", height + options.margin.bottom).style("text-anchor", "end");

	          var follow = function follow() {
	            if (source_data == null || source_data[0] == null) {
	              return;
	            }
	            var mouse = d3.mouse(mainview.node());
	            var x_coord = x.invert(mouse[0]),
	                y_coord = y.invert(mouse[1]),
	                xdim = source_data[0].length,
	                ydim = source_data.length;
	            var x_bin = Math.floor((x_coord - dims.xmin) / (dims.xmax - dims.xmin) * xdim),
	                y_bin = Math.floor((y_coord - dims.ymin) / (dims.ymax - dims.ymin) * ydim);
	            var z_coord = x_bin >= 0 && x_bin < xdim && y_bin >= 0 && y_bin < ydim ? source_data[y_bin][x_bin] : NaN;
	            position_cursor.text(x_coord.toPrecision(5) + ", " + y_coord.toPrecision(5) + ", " + z_coord.toPrecision(5));
	          };

	          esvg.on("mousemove.position_cursor", null).on("mouseover.position_cursor", null).on("mousemove.position_cursor", follow).on("mouseover.position_cursor", follow);
	        }
	      });
	      selection.call(chart.colorbar);
	    }

	    chart.colorbar = function (selection) {
	      selection.each(function (data) {
	        var outercontainer = d3.select(this),
	            offset_left = 0,
	            innerwidth = options.colorbar_width,
	            innerheight = outercontainer.node().clientHeight,
	            width = innerwidth - options.cb_margin.right,
	            height = innerheight - options.cb_margin.top - options.cb_margin.bottom;
	        //colorbar.name = "colorbar";
	        chart.colorbar.outercontainer = outercontainer;

	        // update the z axis
	        z.range([height, 0]);

	        zAxis.scale(z).ticks(options.numberOfTicks).tickPadding(10).tickSubdivide(true).orient("right");

	        // we will bind data to the container div, a slightly non-standard
	        // arrangement.
	        var container = d3.select(this).selectAll("div.colorbar-container").data([0]);

	        cb_zoom.y(z);
	        chart.colorbar.resetzoom = cb_resetzoom;
	        chart.colorbar.zoom = cb_zoom;

	        // if inner container doesn't exist, build it.
	        container.enter().append("div").attr("class", "colorbar-container").attr("width", innerwidth).attr("height", innerheight).style("display", "inline-block").style("width", innerwidth + "px").style("height", innerheight + "px");

	        var colorbarCanvas = container.selectAll("canvas.colorbar").data([0]);
	        colorbarCanvas.enter().append("canvas");
	        colorbarCanvas.attr("width", width).attr("height", height).attr("class", "colorbar").style("width", width + "px").style("height", height + "px").style("padding-left", offset_left + "px").style("padding-right", options.cb_margin.right + "px").style("padding-top", options.cb_margin.top + "px").call(drawScale);

	        chart.colorbar.colorbarCanvas = colorbarCanvas;

	        var svg = container.selectAll("svg.colorbar").data([0]);
	        var esvg = svg.enter().append("svg").attr("class", "colorbar").call(cb_zoom).on("dblclick.zoom", null).on("dblclick.resetzoom", null).on("dblclick.resetzoom", cb_resetzoom);
	        esvg.append("g").attr("class", "z axis");

	        svg.select(".z.axis").call(zAxis);

	        svg.attr("width", width + options.cb_margin.left + options.cb_margin.right).attr("height", height + options.cb_margin.top + options.cb_margin.bottom);

	        svg.selectAll("g.z").attr("transform", "translate(" + width + "," + options.cb_margin.top + ")");

	        chart.colorbar.svg = svg;
	      });
	    };
	    chart.colorbar.update = function () {
	      this.outercontainer.call(chart.colorbar);
	    };

	    chart.colormap = function (_) {
	      if (!arguments.length) return colormap;
	      colormap = _;
	      _colormap_array = [];
	      for (var i = 0; i < 256; i++) {
	        _colormap_array[i] = d3.rgb(colormap(i));
	        _colormap_array[i].a = 255;
	      }
	      _colormap_array[256] = d3.rgb(0, 0, 0);
	      _colormap_array[256].a = 0;
	      _redraw_colorbar = true;
	      return chart;
	    };

	    // cache the colormap:
	    chart.colormap(colormap);

	    //chart.dispatch = dispatch;

	    chart.redrawImage = function () {
	      _redraw_backing = true;
	      make_plotdata(this.source_data, dims, zdims, z);
	      drawImage(this.mainCanvas);
	      return chart;
	    };

	    chart.redrawLoop = function () {
	      if (_recalculate_main == true) {
	        _recalculate_main = false;
	        make_plotdata();
	        _redraw_backing = true;
	        _redraw_main = true;
	        //drawImage(chart.mainCanvas) //, plotdata);
	      }
	      if (_redraw_main == true) {
	        _redraw_main = false;
	        var svg = chart.svg;
	        var canvas = chart.mainCanvas;
	        var container = chart.outercontainer;
	        svg.select(".x.axis").call(xAxis);
	        svg.select(".y.axis").call(yAxis);
	        svg.select(".grid.x").call(xAxisGrid);
	        svg.select(".grid.y").call(yAxisGrid);

	        chart.mainCanvas.call(drawImage);

	        chart.interactors().forEach(function (d, i) {
	          if (d.update) {
	            d.update();
	          }
	        });
	      }
	      window.requestAnimationFrame(chart.redrawLoop);
	    };

	    window.requestAnimationFrame(chart.redrawLoop);

	    chart.margin = function (_) {
	      if (!arguments.length) return options.margin;
	      options.margin = _;
	      return chart;
	    };

	    chart.show_grid = function (_) {
	      if (!arguments.length) return options.show_grid;
	      options.show_grid = _;
	      chart.outercontainer.selectAll(".grid").style("display", options.show_grid == true || options.show_grid == "true" ? "inline" : "none");
	      return chart;
	    };

	    chart.ztransform = function (_) {
	      if (!arguments.length) return options.ztransform;
	      options.ztransform = _;
	      var old_range = z.range(),
	          old_domain = z.domain();
	      z = d3.scale[options.ztransform]();
	      do_autoscale();
	      z.domain([zdims.zmin, zdims.zmax]).range(old_range);
	      zAxis.scale(z);
	      cb_zoom.y(z);
	      cb_resetzoom.call(chart.colorbar.svg.node());
	      return chart;
	    };

	    chart.xlabel = function (_) {
	      if (!arguments.length) return options.xlabel;
	      options.xlabel = _;
	      if (options.axes && options.axes.xaxis) {
	        options.axes.xaxis.label = _;
	      }
	      if (chart.svg && chart.svg.select) {
	        chart.svg.select(".x.axis .x.axis-label").text(_);
	      }
	      return chart;
	    };

	    chart.ylabel = function (_) {
	      if (!arguments.length) return options.ylabel;
	      options.ylabel = _;
	      if (options.axes && options.axes.yaxis) {
	        options.axes.yaxis.label = _;
	      }
	      if (chart.svg && chart.svg.select) {
	        chart.svg.select(".y.axis .y.axis-label").text(_);
	      }
	      return chart;
	    };

	    // drop all the other options into the chart namespace,
	    // making objects update rather than overwrite
	    for (var attr in options) {
	      // ignore the ones we've already defined accessors for.
	      if (!(attr in chart)) {
	        chart[attr] = function (attr) {
	          var accessor = function accessor(_) {
	            if (!arguments.length) return options[attr];
	            if (jQuery.type(options[attr]) == "object") {
	              jQuery.extend(options[attr], _);
	            } else {
	              options[attr] = _;
	            }
	            return chart;
	          };
	          return accessor;
	        }(attr);
	      }
	    }

	    //chart.zoomRect = function(_) {
	    //  if (!arguments.length) return zoomRect;
	    //  zoomRect = _;
	    //  return chart;
	    //};

	    chart.zoomScroll = function (_) {
	      if (!arguments.length) return zoomScroll;
	      zoomScroll = _;
	      if (zoomScroll == true) {
	        chart.svg.call(zoom).on("dblclick.zoom", null);
	      } else if (zoomScroll == false) {
	        chart.svg.on(".zoom", null);
	      }
	      return chart;
	    };

	    chart.resetzoom = resetzoom;

	    chart.x = function (_) {
	      if (!arguments.length) return x;
	      x = _;
	      return chart;
	    };

	    chart.y = function (_) {
	      if (!arguments.length) return y;
	      y = _;
	      return chart;
	    };

	    chart.z = function (_) {
	      if (!arguments.length) return z;
	      z = _;
	      return chart;
	    };

	    chart.source_data = function (_) {
	      if (!arguments.length) return source_data;
	      source_data = _;
	      if (options.autoscale) {
	        do_autoscale();
	      }
	      _recalculate_main = true;
	    };

	    chart.interactors = function (_) {
	      if (!arguments.length) return interactors;
	      chart.svg.select("g.interactors").call(_);
	      _.x(x).y(y).update();
	      interactors.push(_);
	      return chart;
	    };

	    chart.destroy = function () {
	      //delete backing_canvas;
	      //delete colorbar_backing_canvas;
	      var rs = this.outercontainer.selectAll("svg").remove();
	      for (var i in rs) {
	        delete rs[i];
	      };
	      var rd = this.outercontainer.selectAll("div").remove();
	      for (var i in rd) {
	        delete rd[i];
	      };
	      var rc = this.outercontainer.selectAll("canvas").remove();
	      for (var i in rc) {
	        delete rc[i];
	      };
	    };

	    var get_sxdx = function get_sxdx() {
	      var xdim = source_data[0].length,
	          ydim = source_data.length;
	      var delta_x = (dims.xmax - dims.xmin) / xdim,
	          delta_y = (dims.ymax - dims.ymin) / ydim;

	      var graph_xmax = Math.max.apply(Math, x.domain()),
	          graph_xmin = Math.min.apply(Math, x.domain()),
	          graph_ymax = Math.max.apply(Math, y.domain()),
	          graph_ymin = Math.min.apply(Math, y.domain());

	      var xmin = Math.max(graph_xmin, dims.xmin),
	          xmax = Math.min(graph_xmax, dims.xmax);
	      var ymin = Math.max(graph_ymin, dims.ymin),
	          ymax = Math.min(graph_ymax, dims.ymax);
	      if (debug) {
	        console.log('x', xmin, xmax, 'y', ymin, ymax, 'w', xmax - xmin, 'h', ymax - ymin);
	        console.log('dims', dims);
	      }

	      var sx = (xmin - dims.xmin) / delta_x,
	          sy = (dims.ymax - ymax) / delta_y,
	          sx2 = (xmax - dims.xmin) / delta_x,
	          sy2 = (dims.ymax - ymin) / delta_y,
	          sw = sx2 - sx,
	          sh = sy2 - sy;
	      if (debug) console.log('sx', sx, 'sy', sy, 'sw', sw, 'sh', sh, '   sx2 ', sx2, 'sy2 ', sy2);

	      var dx = x(xmin),
	          dy = y(ymax),
	          dw = x(xmax) - dx,
	          dh = y(ymin) - dy;
	      if (debug) console.log('dx', dx, 'dy', dy, 'dw', dw, 'dh', dh);
	      return { sx: sx, sy: sy, sw: sw, sh: sh, dx: dx, dy: dy, dw: dw, dh: dh };
	    };

	    var fixAspect = function fixAspect(width, height) {
	      var aspect_ratio = options.aspect_ratio,
	          xmin = dims.xmin,
	          xmax = dims.xmax,
	          ymin = dims.ymin,
	          ymax = dims.ymax;
	      if (aspect_ratio == null) {
	        return { 'xmin': xmin, 'xmax': xmax, 'ymin': ymin, 'ymax': ymax };
	      }
	      var yrange = ymax - ymin;
	      var ycenter = (ymax + ymin) / 2.0;
	      var xrange = xmax - xmin;
	      var xcenter = (xmax + xmin) / 2.0;
	      var graph_ratio = width / height;
	      var ratio = yrange / xrange * graph_ratio;
	      if (isNaN(ratio) || ratio == aspect_ratio) {
	        return;
	      };
	      if (ratio < aspect_ratio) {
	        // y-range is too small
	        yrange = aspect_ratio * xrange / graph_ratio;
	      }
	      if (ratio > aspect_ratio) {
	        xrange = yrange / aspect_ratio * graph_ratio;
	      }

	      var output = {
	        'xmin': xcenter - xrange / 2.0,
	        'xmax': xcenter + xrange / 2.0,
	        'ymin': ycenter - yrange / 2.0,
	        'ymax': ycenter + yrange / 2.0
	      };
	      return output;
	    };

	    // Compute the pixel colors; scaled by CSS.
	    function drawImage(canvas) {
	      // canvas is a d3 selection.
	      //var plotdata = canvas.data()[0];
	      var maxColorIndex = 255,
	          overflowIndex = 256,
	          context = canvas.node().getContext("2d"),
	          ctx = backing_canvas.getContext("2d");

	      if (_redraw_backing) {
	        _redraw_backing = false;
	        var height = source_data.length,
	            width = source_data[0].length;
	        if (backing_image == null || backing_canvas.width != width || backing_canvas.height != height) {
	          backing_canvas.width = width;
	          backing_canvas.height = height;
	          backing_image = ctx.createImageData(width, height);
	        }
	        var data = backing_image.data;
	        var yp,
	            pp = 0;
	        for (var yt = 0, p = -1; yt < height; ++yt) {
	          yp = dims.ydim - 1 - yt; // y-axis starts at the top!
	          for (var xp = 0; xp < width; ++xp, pp++) {
	            var c = _colormap_array[plotdata[pp]];
	            data[++p] = c.r;
	            data[++p] = c.g;
	            data[++p] = c.b;
	            data[++p] = c.a;
	          }
	        }
	        ctx.putImageData(backing_image, 0, 0);
	      }

	      //context.mozImageSmoothingEnabled = false;
	      //context.webkitImageSmoothingEnabled = false;
	      //context.msImageSmoothingEnabled = false;
	      //context.imageSmoothingEnabled = false;


	      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	      if (context.mozImageSmoothingEnabled) context.mozImageSmoothingEnabled = false;
	      if (context.imageSmoothingEnabled) context.imageSmoothingEnabled = false;
	      if (context.msImageSmoothingEnabled) context.msImageSmoothingEnabled = false;
	      if (context.webkitImageSmoothingEnabled) context.webkitImageSmoothingEnabled = false;
	      var sxdx = get_sxdx();
	      context.drawImage(ctx.canvas, sxdx.sx, sxdx.sy, sxdx.sw, sxdx.sh, sxdx.dx, sxdx.dy, sxdx.dw, sxdx.dh);
	    }

	    // Compute the pixel colors; scaled by CSS.
	    function drawScale(canvas) {
	      var maxColorIndex = 255,
	          overflowIndex = 256,
	          context = canvas.node().getContext("2d"),
	          ctx = colorbar_backing_canvas.getContext("2d");
	      if (_redraw_colorbar) {
	        _redraw_colorbar = false;
	        colorbar_backing_canvas.width = 1;
	        colorbar_backing_canvas.height = 256;
	        var image = ctx.createImageData(1, 256);
	        var data = image.data;
	        for (var yp = 255, p = -1; yp >= 0; --yp) {
	          var c = _colormap_array[yp];
	          data[++p] = c.r;
	          data[++p] = c.g;
	          data[++p] = c.b;
	          data[++p] = c.a;
	        }
	        ctx.putImageData(image, 0, 0);
	      }

	      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	      if (context.mozImageSmoothingEnabled) context.mozImageSmoothingEnabled = false;
	      if (context.imageSmoothingEnabled) context.imageSmoothingEnabled = false;
	      context.drawImage(ctx.canvas, 0, 0, 1, 256, 0, 0, context.canvas.width, context.canvas.height);
	    }

	    // call after setting transform
	    var make_plotdata = function make_plotdata() {
	      // source_data is 2d array
	      var plotz = z.copy().range([0, 255]);
	      //var crange = d3.range(256);
	      //var lookups = crange.slice(0,255).map(plotz.invert);
	      //var threshold = d3.scale.quantile().domain(lookups).range(crange);
	      var height = source_data.length,
	          width = source_data[0].length;
	      // set the local plotdata:
	      if (plotdata == null || plotdata.length != width * height) {
	        plotdata = new Uint8ClampedArray(width * height);
	      }
	      // plotdata is stored in row-major order ("C"), where row is "y"
	      var zz,
	          r,
	          c,
	          dr,
	          plotz,
	          pp = 0;
	      for (r = height - 1; r >= 0; r--) {
	        dr = source_data[r];
	        for (c = 0; c < width; c++) {
	          zz = dr[c];
	          plotdata[pp++] = plotz(zz);
	          //plotdata[pp++] = threshold(zz);
	        }
	      }
	      _redraw_backing = true;
	      return;
	    };

	    function do_autoscale() {
	      var new_min_max = get_min_max(source_data, z, Infinity, -Infinity);
	      if (!isFinite(new_min_max.min) || !isFinite(new_min_max.max)) {
	        new_min_max = { min: 1, max: 2 }; // need to put something for invalid input scales.
	      }
	      zdims.zmin = new_min_max.min;
	      zdims.zmax = new_min_max.max;
	      z.domain([zdims.zmin, zdims.zmax]);
	      cb_zoom.y(z);
	      zAxis.scale(z);
	      cb_zoomed.call(chart.colorbar.svg.node());
	      chart.colorbar.svg.select(".z.axis").call(zAxis);
	      _recalculate_main = true;
	    }
	    chart.do_autoscale = do_autoscale;

	    function get_min_max(array, transform, existing_min, existing_max) {
	      var new_min_max = { min: existing_min, max: existing_max };
	      for (var i = 0; i < array.length; i++) {
	        var subarr = array[i];
	        if (subarr == null) {
	          continue;
	        }
	        if (!subarr.hasOwnProperty('length')) {
	          var t_el = transform(subarr);
	          if (isFinite(t_el)) {
	            new_min_max = { min: subarr, max: subarr };
	          }
	        } else {
	          new_min_max = get_min_max(subarr, transform, existing_min, existing_max);
	        }
	        if (existing_min == undefined || new_min_max.min < existing_min) {
	          var existing_min = new_min_max.min;
	        }
	        if (existing_max == undefined || new_min_max.max > existing_max) {
	          var existing_max = new_min_max.max;
	        }
	      }
	      return { min: existing_min, max: existing_max };
	    };

	    function generate_cumsums() {
	      //console.log('generating cumsum');
	      var height = source_data.length,
	          width = source_data[0].length,
	          data = source_data;

	      var cumsum_x = [],
	          cumsum_x_col;
	      var cumsum_y = [],
	          cumsum_y_col;
	      var ysum = [],
	          xsum;
	      // initialize the y-sum:
	      for (var r = 0; r < height; r++) {
	        ysum[r] = 0;
	      }cumsum_y[0] = ysum.slice();

	      for (var c = 0; c < width; c++) {
	        cumsum_x_col = [0];xsum = 0;
	        cumsum_y_col = [];
	        for (var r = 0; r < height; r++) {
	          var z = data[r][c];
	          if (isFinite(z)) {
	            xsum += z;
	            ysum[r] += z;
	          }
	          cumsum_x_col[r] = xsum;
	          cumsum_y_col[r] = ysum[r];
	        }
	        cumsum_x[c] = cumsum_x_col;
	        cumsum_y[c] = cumsum_y_col;
	      }
	      return { x: cumsum_x, y: cumsum_y };
	      //this.cumsum_x = cumsum_x;
	      //this.cumsum_y = cumsum_y;
	    };

	    chart.generate_cumsums = generate_cumsums;

	    chart.autofit = function () {
	      var offset_right = options.show_colorbar ? options.colorbar_width + 5 : 0;
	      var outercontainer = this.outercontainer,
	          innerwidth = outercontainer.node().clientWidth - offset_right,
	          innerheight = outercontainer.node().clientHeight,
	          width = innerwidth - options.margin.right - options.margin.left,
	          height = innerheight - options.margin.top - options.margin.bottom;

	      var limits = fixAspect(width, height);
	      // Update the x-scale.
	      x.domain([limits.xmin, limits.xmax]).range([0, width]);

	      // Update the y-scale.
	      y.domain([limits.ymin, limits.ymax]).range([height, 0]);

	      zoom.x(x).y(y);
	      outercontainer.select(".heatmap-container").attr("width", innerwidth).attr("height", innerheight).style("width", innerwidth + "px").style("height", innerheight + "px");

	      outercontainer.select("canvas.mainplot").attr("width", width).attr("height", height).style("width", width + "px").style("height", height + "px");

	      chart.svg.attr("width", width + options.margin.left + options.margin.right).attr("height", height + options.margin.top + options.margin.bottom);

	      chart.svg.selectAll("g.x").attr("transform", "translate(" + options.margin.left + "," + (height + options.margin.top) + ")");
	      chart.svg.selectAll("g.y").attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

	      chart.svg.selectAll("g.x.axis text").attr("x", width / 2.0);
	      chart.svg.selectAll("g.y.axis text").attr("x", -height / 2.0);

	      var innerwidth = options.colorbar_width,
	          width = innerwidth - options.cb_margin.right,
	          height = innerheight - options.cb_margin.top - options.cb_margin.bottom;

	      z.range([height, 0]);

	      outercontainer.select(".colorbar-container").attr("width", innerwidth).attr("height", innerheight).style("width", innerwidth + "px").style("height", innerheight + "px");

	      outercontainer.select("canvas.colorbar").attr("width", width).attr("height", height).style("width", width + "px").style("height", height + "px").call(drawScale);

	      chart.colorbar.svg.select(".z.axis").call(zAxis);
	      chart.colorbar.svg.attr("width", width + options.cb_margin.left + options.cb_margin.right).attr("height", height + options.cb_margin.top + options.cb_margin.bottom);

	      chart.colorbar.svg.selectAll("g.z").attr("transform", "translate(" + width + "," + options.cb_margin.top + ")");

	      _redraw_main = true;
	    };

	    chart.type = "heatmap_2d";

	    return chart;
	  }

	  var jet_colormap = d3.scale.linear().domain([0, 31, 63, 95, 127, 159, 191, 223, 255])
	  /* Jet:
	    #00007F: dark blue
	    #0000FF: blue
	    #007FFF: azure
	    #00FFFF: cyan
	    #7FFF7F: light green
	    #FFFF00: yellow
	    #FF7F00: orange
	    #FF0000: red
	    #7F0000: dark red
	    #00000000: transparent for overflow
	  */
	  .range(["#00007F", "#0000FF", "#007FFF", "#00FFFF", "#7FFF7F", "#FFFF00", "#FF7F00", "#FF0000", "#7F0000"]);
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require("d3"));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.d3);
	    global.colormap = mod.exports;
	  }
	})(this, function (exports, _d) {
	  "use strict";

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.colormap_names = exports.colormap_data = undefined;
	  exports.get_colormap = get_colormap;

	  var d3 = _interopRequireWildcard(_d);

	  function _interopRequireWildcard(obj) {
	    if (obj && obj.__esModule) {
	      return obj;
	    } else {
	      var newObj = {};

	      if (obj != null) {
	        for (var key in obj) {
	          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	        }
	      }

	      newObj.default = obj;
	      return newObj;
	    }
	  }

	  var colormap_data = exports.colormap_data = { "Accent": ["#7fc97f", "#81c881", "#82c884", "#84c786", "#86c688", "#88c58b", "#89c58d", "#8bc48f", "#8dc392", "#8fc294", "#90c296", "#92c199", "#94c09b", "#95bf9d", "#97bfa0", "#99bea2", "#9bbda4", "#9cbca7", "#9ebca9", "#a0bbab", "#a2baae", "#a3b9b0", "#a5b9b2", "#a7b8b5", "#a9b7b7", "#aab6b9", "#acb6bc", "#aeb5be", "#afb4c0", "#b1b4c3", "#b3b3c5", "#b5b2c7", "#b6b1ca", "#b8b1cc", "#bab0ce", "#bcafd1", "#bdaed3", "#bfaed3", "#c1afd1", "#c2afce", "#c4b0cc", "#c6b0ca", "#c8b1c8", "#c9b1c6", "#cbb2c4", "#cdb2c2", "#cfb3c0", "#d0b3bd", "#d2b4bb", "#d4b4b9", "#d5b5b7", "#d7b5b5", "#d9b6b3", "#dbb6b1", "#dcb7ae", "#deb7ac", "#e0b8aa", "#e2b8a8", "#e3b9a6", "#e5b9a4", "#e7baa2", "#e8ba9f", "#eabb9d", "#ecbb9b", "#eebc99", "#efbc97", "#f1bd95", "#f3bd93", "#f5be90", "#f6be8e", "#f8bf8c", "#fabf8a", "#fcc088", "#fdc086", "#fdc287", "#fdc487", "#fdc588", "#fdc788", "#fdc989", "#fdcb89", "#fdcc8a", "#fdce8a", "#fed08b", "#fed28b", "#fed38c", "#fed58c", "#fed78d", "#fed88d", "#feda8e", "#fedc8e", "#fede8f", "#fedf8f", "#fee190", "#fee391", "#fee591", "#fee692", "#fee892", "#feea93", "#feeb93", "#feed94", "#feef94", "#fff195", "#fff295", "#fff496", "#fff696", "#fff897", "#fff997", "#fffb98", "#fffd98", "#ffff99", "#fbfc99", "#f6f89a", "#f0f49b", "#ebf09b", "#e5ec9c", "#e0e89d", "#dae49d", "#d5e09e", "#cfdc9f", "#cad89f", "#c4d4a0", "#bfd0a0", "#bacca1", "#b4c8a2", "#afc4a2", "#a9c0a3", "#a4bca4", "#9eb8a4", "#99b3a5", "#93afa5", "#8eaba6", "#88a7a7", "#83a3a7", "#7d9fa8", "#789ba9", "#7397a9", "#6d93aa", "#688faa", "#628bab", "#5d87ac", "#5783ac", "#527fad", "#4c7bae", "#4777ae", "#4173af", "#3c6fb0", "#396bb0", "#3e68ae", "#4465ad", "#4962ac", "#4e60aa", "#535da9", "#585aa8", "#5d57a6", "#6254a5", "#6751a4", "#6c4ea2", "#714ba1", "#76489f", "#7b459e", "#80429d", "#85409b", "#8a3d9a", "#8f3a99", "#943797", "#993496", "#9e3195", "#a42e93", "#a92b92", "#ae2891", "#b3258f", "#b8228e", "#bd208d", "#c21d8b", "#c71a8a", "#cc1789", "#d11487", "#d61186", "#db0e85", "#e00b83", "#e50882", "#ea0581", "#ef027f", "#ef047d", "#ee077a", "#ec0977", "#eb0b74", "#e90e71", "#e8106e", "#e7136b", "#e51569", "#e41866", "#e31a63", "#e11d60", "#e01f5d", "#df215a", "#dd2457", "#dc2655", "#db2952", "#d92b4f", "#d82e4c", "#d73049", "#d53346", "#d43543", "#d33741", "#d13a3e", "#d03c3b", "#cf3f38", "#cd4135", "#cc4432", "#cb462f", "#c9492d", "#c84b2a", "#c64d27", "#c55024", "#c45221", "#c2551e", "#c1571b", "#c05a19", "#be5b18", "#bc5b1a", "#b95c1c", "#b75c1e", "#b45c21", "#b25d23", "#af5d25", "#ad5d27", "#aa5e29", "#a85e2b", "#a65e2e", "#a35e30", "#a15f32", "#9e5f34", "#9c5f36", "#996038", "#97603b", "#94603d", "#92613f", "#906141", "#8d6143", "#8b6145", "#886248", "#86624a", "#83624c", "#81634e", "#7e6350", "#7c6352", "#7a6455", "#776457", "#756459", "#72645b", "#70655d", "#6d655f", "#6b6562", "#686664", "#666666"], "Blues": ["#f7fbff", "#f6faff", "#f5fafe", "#f5f9fe", "#f4f9fe", "#f3f8fe", "#f2f8fd", "#f2f7fd", "#f1f7fd", "#f0f6fd", "#eff6fc", "#eef5fc", "#eef5fc", "#edf4fc", "#ecf4fb", "#ebf3fb", "#eaf3fb", "#eaf2fb", "#e9f2fa", "#e8f1fa", "#e7f1fa", "#e7f0fa", "#e6f0f9", "#e5eff9", "#e4eff9", "#e3eef9", "#e3eef8", "#e2edf8", "#e1edf8", "#e0ecf8", "#dfecf7", "#dfebf7", "#deebf7", "#ddeaf7", "#dceaf6", "#dce9f6", "#dbe9f6", "#dae8f6", "#d9e8f5", "#d9e7f5", "#d8e7f5", "#d7e6f5", "#d6e6f4", "#d6e5f4", "#d5e5f4", "#d4e4f4", "#d3e4f3", "#d3e3f3", "#d2e3f3", "#d1e2f3", "#d0e2f2", "#d0e1f2", "#cfe1f2", "#cee0f2", "#cde0f1", "#cddff1", "#ccdff1", "#cbdef1", "#cadef0", "#caddf0", "#c9ddf0", "#c8dcf0", "#c7dcef", "#c7dbef", "#c6dbef", "#c4daee", "#c3daee", "#c2d9ee", "#c1d9ed", "#bfd8ed", "#bed8ec", "#bdd7ec", "#bcd7eb", "#bad6eb", "#b9d6ea", "#b8d5ea", "#b7d4ea", "#b5d4e9", "#b4d3e9", "#b3d3e8", "#b2d2e8", "#b0d2e7", "#afd1e7", "#aed1e7", "#add0e6", "#abd0e6", "#aacfe5", "#a9cfe5", "#a8cee4", "#a6cee4", "#a5cde3", "#a4cce3", "#a3cce3", "#a1cbe2", "#a0cbe2", "#9fcae1", "#9dcae1", "#9cc9e1", "#9ac8e0", "#99c7e0", "#97c6df", "#95c5df", "#94c4df", "#92c4de", "#91c3de", "#8fc2de", "#8dc1dd", "#8cc0dd", "#8abfdd", "#89bedc", "#87bddc", "#85bcdc", "#84bcdb", "#82bbdb", "#81badb", "#7fb9da", "#7db8da", "#7cb7da", "#7ab6d9", "#79b5d9", "#77b5d9", "#75b4d8", "#74b3d8", "#72b2d8", "#71b1d7", "#6fb0d7", "#6dafd7", "#6caed6", "#6aaed6", "#69add5", "#68acd5", "#66abd4", "#65aad4", "#64a9d3", "#63a8d3", "#61a7d2", "#60a7d2", "#5fa6d1", "#5da5d1", "#5ca4d0", "#5ba3d0", "#5aa2cf", "#58a1cf", "#57a0ce", "#56a0ce", "#549fcd", "#539ecd", "#529dcc", "#519ccc", "#4f9bcb", "#4e9acb", "#4d99ca", "#4b98ca", "#4a98c9", "#4997c9", "#4896c8", "#4695c8", "#4594c7", "#4493c7", "#4292c6", "#4191c6", "#4090c5", "#3f8fc5", "#3e8ec4", "#3d8dc4", "#3c8cc3", "#3b8bc2", "#3a8ac2", "#3989c1", "#3888c1", "#3787c0", "#3686c0", "#3585bf", "#3484bf", "#3383be", "#3282be", "#3181bd", "#3080bd", "#2f7fbc", "#2e7ebc", "#2d7dbb", "#2c7cba", "#2b7bba", "#2a7ab9", "#2979b9", "#2777b8", "#2676b8", "#2575b7", "#2474b7", "#2373b6", "#2272b6", "#2171b5", "#2070b4", "#206fb4", "#1f6eb3", "#1e6db2", "#1d6cb1", "#1c6bb0", "#1c6ab0", "#1b69af", "#1a68ae", "#1967ad", "#1966ad", "#1865ac", "#1764ab", "#1663aa", "#1562a9", "#1561a9", "#1460a8", "#135fa7", "#125ea6", "#125da6", "#115ca5", "#105ba4", "#0f5aa3", "#0e59a2", "#0e58a2", "#0d57a1", "#0c56a0", "#0b559f", "#0a549e", "#0a539e", "#09529d", "#08519c", "#08509b", "#084f99", "#084e98", "#084d96", "#084c95", "#084b93", "#084a91", "#084990", "#08488e", "#08478d", "#08468b", "#08458a", "#084488", "#084387", "#084285", "#084184", "#084082", "#083e81", "#083d7f", "#083c7d", "#083b7c", "#083a7a", "#083979", "#083877", "#083776", "#083674", "#083573", "#083471", "#083370", "#08326e", "#08316d", "#08306b"], "BrBG": ["#543005", "#563105", "#583305", "#5b3406", "#5d3506", "#5f3606", "#613806", "#633906", "#663a07", "#683c07", "#6a3d07", "#6c3e07", "#6e4007", "#714108", "#734208", "#754308", "#774508", "#794608", "#7c4709", "#7e4909", "#804a09", "#824b09", "#844c09", "#874e0a", "#894f0a", "#8b500a", "#8d520b", "#8f540c", "#91560d", "#93580f", "#955910", "#975b12", "#995d13", "#9b5f14", "#9d6116", "#9f6317", "#a16518", "#a3671a", "#a5691b", "#a76a1d", "#a96c1e", "#ab6e1f", "#ad7021", "#af7222", "#b17423", "#b37625", "#b57826", "#b77928", "#b97b29", "#bb7d2a", "#bd7f2c", "#bf812d", "#c08430", "#c28633", "#c38936", "#c48b3a", "#c58e3d", "#c79040", "#c89343", "#c99546", "#ca9849", "#cc9a4c", "#cd9d50", "#cea053", "#cfa256", "#d1a559", "#d2a75c", "#d3aa5f", "#d4ac62", "#d6af65", "#d7b169", "#d8b46c", "#d9b76f", "#dbb972", "#dcbc75", "#ddbe78", "#dec17b", "#dfc37e", "#e0c481", "#e1c684", "#e2c787", "#e3c989", "#e4ca8c", "#e5cc8f", "#e6cd92", "#e7cf94", "#e8d097", "#e8d29a", "#e9d39d", "#ead59f", "#ebd6a2", "#ecd8a5", "#edd9a8", "#eedbaa", "#efdcad", "#f0deb0", "#f1dfb3", "#f1e1b5", "#f2e2b8", "#f3e4bb", "#f4e5be", "#f5e7c0", "#f6e8c3", "#f6e9c5", "#f6e9c7", "#f6eac9", "#f6eacb", "#f6ebcd", "#f6ebcf", "#f6ecd1", "#f6ecd3", "#f6edd5", "#f6edd7", "#f6eed9", "#f6eedb", "#f5efdc", "#f5efde", "#f5f0e0", "#f5f0e2", "#f5f1e4", "#f5f1e6", "#f5f2e8", "#f5f2ea", "#f5f3ec", "#f5f3ee", "#f5f4f0", "#f5f4f2", "#f5f5f4", "#f4f5f5", "#f2f4f4", "#f0f4f3", "#eff3f3", "#edf3f2", "#ebf3f2", "#e9f2f1", "#e7f2f0", "#e6f1f0", "#e4f1ef", "#e2f0ee", "#e0f0ee", "#def0ed", "#ddefed", "#dbefec", "#d9eeeb", "#d7eeeb", "#d5edea", "#d4ede9", "#d2ede9", "#d0ece8", "#ceece8", "#ccebe7", "#cbebe6", "#c9eae6", "#c7eae5", "#c4e9e4", "#c1e8e2", "#bfe7e1", "#bce5df", "#b9e4de", "#b6e3dd", "#b4e2db", "#b1e1da", "#aee0d8", "#abdfd7", "#a8ddd5", "#a6dcd4", "#a3dbd3", "#a0dad1", "#9dd9d0", "#9ad8ce", "#98d7cd", "#95d6cc", "#92d4ca", "#8fd3c9", "#8dd2c7", "#8ad1c6", "#87d0c5", "#84cfc3", "#81cec2", "#7fccc0", "#7ccabe", "#79c8bc", "#76c6ba", "#73c3b8", "#70c1b6", "#6dbfb4", "#6abdb2", "#67bbb0", "#64b9ae", "#61b7ac", "#5eb5aa", "#5bb3a8", "#58b0a7", "#55aea5", "#52aca3", "#4faaa1", "#4da89f", "#4aa69d", "#47a49b", "#44a299", "#419f97", "#3e9d95", "#3b9b93", "#389991", "#35978f", "#33958d", "#31938b", "#2f9189", "#2d8f87", "#2b8d85", "#298b83", "#278a82", "#258880", "#23867e", "#21847c", "#1f827a", "#1d8078", "#1a7e76", "#187c74", "#167a72", "#147870", "#12766e", "#10746c", "#0e726a", "#0c7169", "#0a6f67", "#086d65", "#066b63", "#046961", "#02675f", "#01655d", "#01645b", "#016259", "#016058", "#015f56", "#015d54", "#015b52", "#015a50", "#01584f", "#01564d", "#01554b", "#015349", "#015147", "#005046", "#004e44", "#004c42", "#004b40", "#00493e", "#00483d", "#00463b", "#004439", "#004337", "#004135", "#003f34", "#003e32", "#003c30"], "BuGn": ["#f7fcfd", "#f6fcfd", "#f6fcfd", "#f5fbfd", "#f5fbfc", "#f4fbfc", "#f4fbfc", "#f3fafc", "#f2fafc", "#f2fafc", "#f1fafc", "#f1fafc", "#f0f9fb", "#f0f9fb", "#eff9fb", "#eff9fb", "#eef8fb", "#edf8fb", "#edf8fb", "#ecf8fb", "#ecf8fa", "#ebf7fa", "#ebf7fa", "#eaf7fa", "#e9f7fa", "#e9f7fa", "#e8f6fa", "#e8f6fa", "#e7f6f9", "#e7f6f9", "#e6f5f9", "#e5f5f9", "#e5f5f9", "#e4f5f8", "#e3f4f8", "#e3f4f7", "#e2f4f7", "#e1f4f6", "#e0f3f5", "#dff3f5", "#dff3f4", "#def2f4", "#ddf2f3", "#dcf2f2", "#dbf2f2", "#dbf1f1", "#daf1f1", "#d9f1f0", "#d8f0ef", "#d8f0ef", "#d7f0ee", "#d6f0ee", "#d5efed", "#d4efec", "#d4efec", "#d3eeeb", "#d2eeeb", "#d1eeea", "#d1eee9", "#d0ede9", "#cfede8", "#ceede8", "#cdece7", "#cdece6", "#ccece6", "#caebe5", "#c8ebe4", "#c7eae3", "#c5e9e2", "#c4e9e1", "#c2e8e0", "#c0e7df", "#bfe7de", "#bde6de", "#bce6dd", "#bae5dc", "#b8e4db", "#b7e4da", "#b5e3d9", "#b4e2d8", "#b2e2d7", "#b0e1d6", "#afe1d5", "#ade0d4", "#acdfd4", "#aadfd3", "#a8ded2", "#a7ddd1", "#a5ddd0", "#a4dccf", "#a2dcce", "#a0dbcd", "#9fdacc", "#9ddacb", "#9cd9ca", "#9ad8ca", "#98d8c9", "#97d7c7", "#95d6c6", "#94d6c5", "#92d5c4", "#90d4c3", "#8fd4c2", "#8dd3c0", "#8cd2bf", "#8ad2be", "#88d1bd", "#87d0bc", "#85cfbb", "#84cfb9", "#82ceb8", "#80cdb7", "#7fcdb6", "#7dccb5", "#7ccbb4", "#7acbb3", "#78cab1", "#77c9b0", "#75c9af", "#74c8ae", "#72c7ad", "#70c6ac", "#6fc6aa", "#6dc5a9", "#6cc4a8", "#6ac4a7", "#68c3a6", "#67c2a5", "#65c2a3", "#64c1a2", "#63c0a0", "#62c09f", "#61bf9e", "#60bf9c", "#5ebe9b", "#5dbd99", "#5cbd98", "#5bbc96", "#5abb95", "#59bb93", "#57ba92", "#56ba91", "#55b98f", "#54b88e", "#53b88c", "#52b78b", "#51b689", "#4fb688", "#4eb586", "#4db585", "#4cb484", "#4bb382", "#4ab381", "#48b27f", "#47b17e", "#46b17c", "#45b07b", "#44af79", "#43af78", "#41ae77", "#40ad75", "#3fac74", "#3fab72", "#3eaa70", "#3da96f", "#3ca86d", "#3ba76c", "#3aa66a", "#39a569", "#38a367", "#37a266", "#36a164", "#35a063", "#349f61", "#339e60", "#329d5e", "#319c5c", "#309b5b", "#2f9a59", "#2f9858", "#2e9756", "#2d9655", "#2c9553", "#2b9452", "#2a9350", "#29924f", "#28914d", "#27904c", "#268f4a", "#258d48", "#248c47", "#238b45", "#228a44", "#218944", "#208843", "#1f8742", "#1e8741", "#1d8640", "#1c8540", "#1a843f", "#19833e", "#18823d", "#17813d", "#16803c", "#157f3b", "#147e3a", "#137d39", "#127c39", "#117b38", "#107a37", "#0e7936", "#0d7836", "#0c7735", "#0b7734", "#0a7633", "#097532", "#087432", "#077331", "#067230", "#05712f", "#03702e", "#026f2e", "#016e2d", "#006d2c", "#006c2c", "#006b2b", "#00692a", "#00682a", "#006729", "#006529", "#006428", "#006328", "#006227", "#006027", "#005f26", "#005e26", "#005c25", "#005b25", "#005a24", "#005924", "#005723", "#005622", "#005522", "#005321", "#005221", "#005120", "#005020", "#004e1f", "#004d1f", "#004c1e", "#004a1e", "#00491d", "#00481d", "#00471c", "#00451c", "#00441b"], "BuPu": ["#f7fcfd", "#f6fbfd", "#f6fbfc", "#f5fafc", "#f4fafc", "#f3f9fc", "#f3f9fb", "#f2f8fb", "#f1f8fb", "#f1f7fa", "#f0f7fa", "#eff6fa", "#eef6fa", "#eef5f9", "#edf5f9", "#ecf4f9", "#ebf4f8", "#ebf3f8", "#eaf3f8", "#e9f2f8", "#e9f2f7", "#e8f1f7", "#e7f1f7", "#e6f0f7", "#e6f0f6", "#e5eff6", "#e4eff6", "#e4eef5", "#e3eef5", "#e2edf5", "#e1edf5", "#e1ecf4", "#e0ecf4", "#dfebf4", "#deeaf3", "#ddeaf3", "#dce9f2", "#dbe8f2", "#dae7f1", "#d9e6f1", "#d8e6f0", "#d7e5f0", "#d6e4f0", "#d4e3ef", "#d3e2ef", "#d2e2ee", "#d1e1ee", "#d0e0ed", "#cfdfed", "#cedfec", "#cddeec", "#ccddec", "#cbdceb", "#cadbeb", "#c9dbea", "#c8daea", "#c7d9e9", "#c6d8e9", "#c5d8e9", "#c4d7e8", "#c3d6e8", "#c2d5e7", "#c1d4e7", "#c0d4e6", "#bfd3e6", "#bed2e6", "#bdd1e5", "#bcd1e5", "#bbd0e4", "#bacfe4", "#b9cee4", "#b7cee3", "#b6cde3", "#b5cce3", "#b4cce2", "#b3cbe2", "#b2cae1", "#b1c9e1", "#b0c9e1", "#afc8e0", "#aec7e0", "#adc7e0", "#acc6df", "#abc5df", "#aac4de", "#a9c4de", "#a8c3de", "#a7c2dd", "#a6c2dd", "#a5c1dc", "#a4c0dc", "#a3bfdc", "#a2bfdb", "#a1bedb", "#a0bddb", "#9fbcda", "#9ebcda", "#9dbad9", "#9db9d9", "#9cb8d8", "#9cb7d7", "#9bb6d7", "#9ab4d6", "#9ab3d5", "#99b2d5", "#99b1d4", "#98b0d3", "#98aed3", "#97add2", "#96acd2", "#96abd1", "#95aad0", "#95a8d0", "#94a7cf", "#94a6ce", "#93a5ce", "#92a4cd", "#92a3cd", "#91a1cc", "#91a0cb", "#909fcb", "#909eca", "#8f9dc9", "#8f9bc9", "#8e9ac8", "#8d99c8", "#8d98c7", "#8c97c6", "#8c95c6", "#8c94c5", "#8c93c4", "#8c91c4", "#8c90c3", "#8c8fc2", "#8c8dc2", "#8c8cc1", "#8c8bc0", "#8c89c0", "#8c88bf", "#8c86be", "#8c85be", "#8c84bd", "#8c82bc", "#8c81bc", "#8c80bb", "#8c7eba", "#8c7dba", "#8c7cb9", "#8c7ab8", "#8c79b8", "#8c78b7", "#8c76b7", "#8c75b6", "#8c74b5", "#8c72b5", "#8c71b4", "#8c70b3", "#8c6eb3", "#8c6db2", "#8c6cb1", "#8c6ab1", "#8c69b0", "#8c68af", "#8c66af", "#8b65ae", "#8b64ad", "#8b62ad", "#8b61ac", "#8b60ac", "#8b5eab", "#8b5daa", "#8b5caa", "#8a5aa9", "#8a59a8", "#8a58a8", "#8a56a7", "#8a55a7", "#8a54a6", "#8a52a5", "#8a51a5", "#8950a4", "#894fa3", "#894da3", "#894ca2", "#894ba2", "#8949a1", "#8948a0", "#8947a0", "#88459f", "#88449e", "#88439e", "#88419d", "#88409c", "#883e9b", "#873d9a", "#873b99", "#873a98", "#873897", "#873696", "#863595", "#863394", "#863293", "#863092", "#852f91", "#852d90", "#852b8f", "#852a8e", "#85288d", "#84278c", "#84258b", "#84248a", "#842289", "#832088", "#831f86", "#831d85", "#831c84", "#831a83", "#821982", "#821781", "#821580", "#82147f", "#81127e", "#81117d", "#810f7c", "#800f7b", "#7e0e79", "#7c0e78", "#7b0d76", "#790d75", "#770c73", "#760c71", "#740b70", "#730b6e", "#710a6d", "#6f0a6b", "#6e096a", "#6c0968", "#6a0867", "#690865", "#670864", "#650762", "#640761", "#62065f", "#61065d", "#5f055c", "#5d055a", "#5c0459", "#5a0457", "#580356", "#570354", "#550253", "#540251", "#520150", "#50014e", "#4f004d", "#4d004b"], "CMRmap": ["#000000", "#010104", "#020208", "#04040c", "#050510", "#060614", "#070718", "#08081c", "#0a0a20", "#0b0b24", "#0c0c28", "#0d0d2c", "#0e0e30", "#101034", "#111138", "#12123c", "#131340", "#141444", "#161648", "#17174c", "#181850", "#191954", "#1a1a58", "#1c1c5c", "#1d1d60", "#1e1e64", "#1f1f68", "#20206c", "#222270", "#232374", "#242478", "#25257c", "#262680", "#282682", "#292684", "#2a2686", "#2b2688", "#2c268a", "#2e268c", "#2f268e", "#302690", "#312692", "#322694", "#342696", "#352698", "#36269a", "#37269c", "#38269e", "#3a26a0", "#3b26a2", "#3c26a4", "#3d26a6", "#3e26a8", "#4026aa", "#4126ac", "#4226ae", "#4326b0", "#4426b2", "#4626b4", "#4726b6", "#4826b8", "#4926ba", "#4a26bc", "#4c26be", "#4d26bf", "#5027bd", "#5227bb", "#5428b9", "#5728b7", "#5928b5", "#5c29b3", "#5e29b1", "#602aaf", "#632aad", "#652aab", "#682ba9", "#6a2ba7", "#6c2ca5", "#6f2ca3", "#712ca1", "#732d9f", "#762d9d", "#782e9b", "#7b2e99", "#7d2e97", "#802f95", "#822f93", "#843091", "#87308f", "#89308d", "#8b318b", "#8e3189", "#903287", "#933285", "#953283", "#973381", "#9a337e", "#9d347c", "#a13479", "#a43476", "#a73573", "#aa3570", "#ad366e", "#b1366b", "#b43668", "#b73765", "#ba3762", "#bd3860", "#c1385d", "#c4385a", "#c73957", "#ca3954", "#cd3a52", "#d13a4f", "#d43a4c", "#d73b49", "#da3b46", "#dd3c44", "#e13c41", "#e43c3e", "#e73d3b", "#ea3d38", "#ed3e36", "#f13e33", "#f43e30", "#f73f2d", "#fa3f2a", "#fd4028", "#ff4126", "#fe4324", "#fd4523", "#fc4722", "#fb4921", "#fb4b20", "#fa4d1e", "#f94f1d", "#f8511c", "#f7531b", "#f7551a", "#f65718", "#f55917", "#f45b16", "#f35d15", "#f35f14", "#f26112", "#f16311", "#f06510", "#ef670f", "#ef690e", "#ee6b0c", "#ed6d0b", "#ec6f0a", "#eb7109", "#eb7308", "#ea7506", "#e97705", "#e87904", "#e77b03", "#e77d02", "#e67f00", "#e68100", "#e68301", "#e68502", "#e68703", "#e68904", "#e68b05", "#e68d05", "#e68f06", "#e69107", "#e69308", "#e69508", "#e69709", "#e6990a", "#e69b0b", "#e69d0c", "#e69f0c", "#e6a10d", "#e6a30e", "#e6a50f", "#e6a710", "#e6a910", "#e6ab11", "#e6ad12", "#e6af13", "#e6b114", "#e6b314", "#e6b515", "#e6b716", "#e6b917", "#e6bb18", "#e6bd18", "#e6bf19", "#e6c01c", "#e6c11f", "#e6c322", "#e6c426", "#e6c529", "#e6c62c", "#e6c72f", "#e6c932", "#e6ca36", "#e6cb39", "#e6cc3c", "#e6cd3f", "#e6cf42", "#e6d046", "#e6d149", "#e6d24c", "#e6d34f", "#e6d552", "#e6d656", "#e6d759", "#e6d85c", "#e6d95f", "#e6db62", "#e6dc66", "#e6dd69", "#e6de6c", "#e6df6f", "#e6e172", "#e6e276", "#e6e379", "#e6e47c", "#e6e57f", "#e6e683", "#e7e787", "#e8e88b", "#e9e98f", "#e9e993", "#eaea97", "#ebeb9b", "#ecec9f", "#ededa3", "#ededa7", "#eeeeab", "#efefaf", "#f0f0b3", "#f1f1b7", "#f1f1bb", "#f2f2bf", "#f3f3c3", "#f4f4c7", "#f5f5cb", "#f5f5cf", "#f6f6d3", "#f7f7d7", "#f8f8db", "#f9f9df", "#f9f9e3", "#fafae7", "#fbfbeb", "#fcfcef", "#fdfdf3", "#fdfdf7", "#fefefb", "#ffffff"], "Dark2": ["#1b9e77", "#209c74", "#259b71", "#2b996d", "#30976a", "#359567", "#3a9464", "#409261", "#45905d", "#4a8e5a", "#4f8d57", "#548b54", "#5a8950", "#5f884d", "#64864a", "#698447", "#6e8244", "#748140", "#797f3d", "#7e7d3a", "#837b37", "#897a34", "#8e7830", "#93762d", "#98742a", "#9d7327", "#a37123", "#a86f20", "#ad6e1d", "#b26c1a", "#b76a17", "#bd6813", "#c26710", "#c7650d", "#cc630a", "#d26107", "#d76003", "#d75f05", "#d5600a", "#d2600e", "#cf6113", "#cc6118", "#ca621d", "#c76222", "#c46327", "#c1632c", "#bf6331", "#bc6435", "#b9643a", "#b6653f", "#b46544", "#b16649", "#ae664e", "#ac6753", "#a96757", "#a6685c", "#a36861", "#a16966", "#9e696b", "#9b6a70", "#986a75", "#966a79", "#936b7e", "#906b83", "#8d6c88", "#8b6c8d", "#886d92", "#856d97", "#826e9b", "#806ea0", "#7d6fa5", "#7a6faa", "#7770af", "#7570b3", "#796eb2", "#7c6cb1", "#7f6aaf", "#8268ae", "#8566ad", "#8864ac", "#8b62ab", "#8e60aa", "#925ea9", "#955ca8", "#985aa6", "#9b58a5", "#9e56a4", "#a154a3", "#a452a2", "#a851a1", "#ab4fa0", "#ae4d9f", "#b14b9d", "#b4499c", "#b7479b", "#ba459a", "#bd4399", "#c14198", "#c43f97", "#c73d96", "#ca3b94", "#cd3993", "#d03792", "#d33591", "#d63390", "#da318f", "#dd2f8e", "#e02d8d", "#e32c8b", "#e62a8a", "#e42b88", "#e12f85", "#dd3282", "#da367f", "#d6397c", "#d33d79", "#cf4076", "#cc4373", "#c84770", "#c54a6d", "#c14e6a", "#be5167", "#ba5564", "#b65861", "#b35b5e", "#af5f5b", "#ac6258", "#a86655", "#a56953", "#a16d50", "#9e704d", "#9a744a", "#977747", "#937a44", "#8f7e41", "#8c813e", "#88853b", "#858838", "#818c35", "#7e8f32", "#7a922f", "#77962c", "#739929", "#709d26", "#6ca023", "#69a420", "#67a61e", "#6ba61d", "#6ea61c", "#72a61b", "#75a71b", "#79a71a", "#7ca719", "#80a718", "#83a718", "#87a717", "#8aa716", "#8ea815", "#91a815", "#95a814", "#98a813", "#9ca812", "#9fa811", "#a3a811", "#a6a910", "#aaa90f", "#ada90e", "#b1a90e", "#b4a90d", "#b8a90c", "#bba90b", "#bfa90b", "#c2aa0a", "#c6aa09", "#c9aa08", "#cdaa07", "#d0aa07", "#d4aa06", "#d7aa05", "#dbab04", "#deab04", "#e2ab03", "#e5ab02", "#e4aa03", "#e3a803", "#e1a704", "#dfa505", "#dda406", "#dca206", "#daa107", "#d8a008", "#d69e09", "#d59d09", "#d39b0a", "#d19a0b", "#cf980c", "#ce970c", "#cc950d", "#ca940e", "#c8920e", "#c7910f", "#c59010", "#c38e11", "#c18d11", "#c08b12", "#be8a13", "#bc8814", "#ba8714", "#b98515", "#b78416", "#b58217", "#b38117", "#b28018", "#b07e19", "#ae7d1a", "#ac7b1a", "#ab7a1b", "#a9781c", "#a7771d", "#a5761e", "#a37520", "#a27522", "#a07424", "#9e7426", "#9c7428", "#9b732a", "#99732c", "#97722e", "#957230", "#947132", "#927134", "#907136", "#8e7038", "#8d703a", "#8b6f3c", "#896f3e", "#876e40", "#866e42", "#846d44", "#826d46", "#806d48", "#7f6c4a", "#7d6c4c", "#7b6b4e", "#796b50", "#786a52", "#766a54", "#746a56", "#726958", "#71695a", "#6f685c", "#6d685e", "#6b6760", "#6a6762", "#686664", "#666666"], "GnBu": ["#f7fcf0", "#f6fcef", "#f6fbef", "#f5fbee", "#f4fbed", "#f3fbed", "#f3faec", "#f2faeb", "#f1faeb", "#f1f9ea", "#f0f9e9", "#eff9e9", "#eef9e8", "#eef8e7", "#edf8e7", "#ecf8e6", "#ebf7e5", "#ebf7e5", "#eaf7e4", "#e9f7e3", "#e9f6e3", "#e8f6e2", "#e7f6e2", "#e6f6e1", "#e6f5e0", "#e5f5e0", "#e4f5df", "#e4f4de", "#e3f4de", "#e2f4dd", "#e1f4dc", "#e1f3dc", "#e0f3db", "#dff3da", "#dff2da", "#def2d9", "#ddf2d8", "#ddf2d7", "#dcf1d7", "#dcf1d6", "#dbf1d5", "#daf1d5", "#daf0d4", "#d9f0d3", "#d8f0d3", "#d8f0d2", "#d7efd1", "#d7efd1", "#d6efd0", "#d5efcf", "#d5eece", "#d4eece", "#d3eecd", "#d3eecc", "#d2edcc", "#d1edcb", "#d1edca", "#d0edca", "#d0ecc9", "#cfecc8", "#ceecc8", "#ceecc7", "#cdebc6", "#ccebc6", "#ccebc5", "#cbeac4", "#c9eac4", "#c8eac3", "#c7e9c3", "#c6e9c2", "#c5e8c2", "#c4e8c1", "#c3e7c1", "#c2e7c0", "#c0e6c0", "#bfe6bf", "#bee6bf", "#bde5be", "#bce5be", "#bbe4bd", "#bae4bd", "#b9e3bc", "#b7e3bc", "#b6e3bb", "#b5e2bb", "#b4e2ba", "#b3e1ba", "#b2e1b9", "#b1e0b9", "#afe0b8", "#aedfb8", "#addfb7", "#acdfb7", "#abdeb6", "#aadeb6", "#a9ddb5", "#a7ddb5", "#a6dcb6", "#a5dcb6", "#a3dbb7", "#a2dbb7", "#a0dab8", "#9fdab8", "#9ed9b8", "#9cd9b9", "#9bd8b9", "#99d7ba", "#98d7ba", "#97d6bb", "#95d6bb", "#94d5bc", "#92d5bc", "#91d4bd", "#8fd4bd", "#8ed3be", "#8dd3be", "#8bd2bf", "#8ad2bf", "#88d1c0", "#87d1c0", "#86d0c0", "#84cfc1", "#83cfc1", "#81cec2", "#80cec2", "#7fcdc3", "#7dcdc3", "#7cccc4", "#7accc4", "#79cbc5", "#77cac5", "#76c9c6", "#75c8c6", "#73c8c7", "#72c7c7", "#70c6c8", "#6fc5c8", "#6ec5c8", "#6cc4c9", "#6bc3c9", "#69c2ca", "#68c1ca", "#67c1cb", "#65c0cb", "#64bfcc", "#62becc", "#61bdcd", "#5fbdcd", "#5ebcce", "#5dbbce", "#5bbacf", "#5abacf", "#58b9d0", "#57b8d0", "#56b7d0", "#54b6d1", "#53b6d1", "#51b5d2", "#50b4d2", "#4fb3d3", "#4db2d3", "#4cb1d2", "#4bb0d1", "#4aafd1", "#49add0", "#48accf", "#47abcf", "#46aace", "#45a8cd", "#43a7cd", "#42a6cc", "#41a5cb", "#40a4cb", "#3fa2ca", "#3ea1c9", "#3da0c9", "#3c9fc8", "#3b9dc7", "#3a9cc7", "#389bc6", "#379ac5", "#3699c5", "#3597c4", "#3496c3", "#3395c3", "#3294c2", "#3192c1", "#3091c1", "#2f90c0", "#2d8fbf", "#2c8ebf", "#2b8cbe", "#2a8bbe", "#298abd", "#2889bc", "#2788bc", "#2687bb", "#2586bb", "#2484ba", "#2283ba", "#2182b9", "#2081b8", "#1f80b8", "#1e7fb7", "#1d7eb7", "#1c7cb6", "#1b7bb6", "#1a7ab5", "#1979b5", "#1878b4", "#1677b3", "#1576b3", "#1475b2", "#1373b2", "#1272b1", "#1171b1", "#1070b0", "#0f6faf", "#0e6eaf", "#0d6dae", "#0b6cae", "#0a6aad", "#0969ad", "#0868ac", "#0867ab", "#0866a9", "#0864a8", "#0863a7", "#0862a5", "#0861a4", "#085fa3", "#085ea1", "#085da0", "#085c9f", "#085a9d", "#08599c", "#08589b", "#085799", "#085598", "#085497", "#085395", "#085294", "#085093", "#084f91", "#084e90", "#084d8e", "#084b8d", "#084a8c", "#08498a", "#084889", "#084688", "#084586", "#084485", "#084384", "#084182", "#084081"], "Greens": ["#f7fcf5", "#f6fcf4", "#f6fcf4", "#f5fbf3", "#f5fbf2", "#f4fbf2", "#f4fbf1", "#f3faf0", "#f2faf0", "#f2faef", "#f1faee", "#f1faee", "#f0f9ed", "#f0f9ec", "#eff9ec", "#eff9eb", "#eef8ea", "#edf8ea", "#edf8e9", "#ecf8e8", "#ecf8e8", "#ebf7e7", "#ebf7e7", "#eaf7e6", "#e9f7e5", "#e9f7e5", "#e8f6e4", "#e8f6e3", "#e7f6e3", "#e7f6e2", "#e6f5e1", "#e5f5e1", "#e5f5e0", "#e4f5df", "#e3f4de", "#e2f4dd", "#e1f3dc", "#e0f3db", "#dff3da", "#def2d9", "#ddf2d8", "#dcf2d7", "#dbf1d6", "#dbf1d5", "#daf0d4", "#d9f0d3", "#d8f0d2", "#d7efd1", "#d6efd0", "#d5efcf", "#d4eece", "#d3eecd", "#d2edcc", "#d1edcb", "#d0edca", "#cfecc9", "#ceecc8", "#cdecc7", "#ccebc6", "#cbebc5", "#cbeac4", "#caeac3", "#c9eac2", "#c8e9c1", "#c7e9c0", "#c6e8bf", "#c4e8bd", "#c3e7bc", "#c2e7bb", "#c1e6ba", "#c0e6b9", "#bee5b8", "#bde5b6", "#bce4b5", "#bbe4b4", "#bae3b3", "#b8e3b2", "#b7e2b1", "#b6e2af", "#b5e1ae", "#b4e1ad", "#b2e0ac", "#b1e0ab", "#b0dfaa", "#afdfa8", "#aedea7", "#acdea6", "#abdda5", "#aadda4", "#a9dca3", "#a8dca2", "#a7dba0", "#a5db9f", "#a4da9e", "#a3da9d", "#a2d99c", "#a0d99b", "#9fd899", "#9ed798", "#9cd797", "#9bd696", "#99d595", "#98d594", "#97d492", "#95d391", "#94d390", "#92d28f", "#91d28e", "#90d18d", "#8ed08b", "#8dd08a", "#8bcf89", "#8ace88", "#88ce87", "#87cd86", "#86cc85", "#84cc83", "#83cb82", "#81ca81", "#80ca80", "#7fc97f", "#7dc87e", "#7cc87c", "#7ac77b", "#79c67a", "#78c679", "#76c578", "#75c477", "#73c476", "#72c375", "#70c274", "#6ec173", "#6dc072", "#6bc072", "#6abf71", "#68be70", "#66bd6f", "#65bd6f", "#63bc6e", "#62bb6d", "#60ba6c", "#5eb96b", "#5db96b", "#5bb86a", "#5ab769", "#58b668", "#56b567", "#55b567", "#53b466", "#52b365", "#50b264", "#4eb264", "#4db163", "#4bb062", "#4aaf61", "#48ae60", "#46ae60", "#45ad5f", "#43ac5e", "#42ab5d", "#40aa5d", "#3fa95c", "#3fa85b", "#3ea75a", "#3da65a", "#3ca559", "#3ba458", "#3aa357", "#39a257", "#38a156", "#37a055", "#369f54", "#359e53", "#349d53", "#339c52", "#329b51", "#319a50", "#309950", "#2f984f", "#2f974e", "#2e964d", "#2d954d", "#2c944c", "#2b934b", "#2a924a", "#29914a", "#289049", "#278f48", "#268e47", "#258d47", "#248c46", "#238b45", "#228a44", "#218944", "#208843", "#1f8742", "#1e8741", "#1d8640", "#1c8540", "#1a843f", "#19833e", "#18823d", "#17813d", "#16803c", "#157f3b", "#147e3a", "#137d39", "#127c39", "#117b38", "#107a37", "#0e7936", "#0d7836", "#0c7735", "#0b7734", "#0a7633", "#097532", "#087432", "#077331", "#067230", "#05712f", "#03702e", "#026f2e", "#016e2d", "#006d2c", "#006c2c", "#006b2b", "#00692a", "#00682a", "#006729", "#006529", "#006428", "#006328", "#006227", "#006027", "#005f26", "#005e26", "#005c25", "#005b25", "#005a24", "#005924", "#005723", "#005622", "#005522", "#005321", "#005221", "#005120", "#005020", "#004e1f", "#004d1f", "#004c1e", "#004a1e", "#00491d", "#00481d", "#00471c", "#00451c", "#00441b"], "Greys": ["#ffffff", "#ffffff", "#fefefe", "#fefefe", "#fdfdfd", "#fdfdfd", "#fcfcfc", "#fcfcfc", "#fbfbfb", "#fbfbfb", "#fafafa", "#fafafa", "#f9f9f9", "#f9f9f9", "#f8f8f8", "#f8f8f8", "#f7f7f7", "#f7f7f7", "#f7f7f7", "#f6f6f6", "#f6f6f6", "#f5f5f5", "#f5f5f5", "#f4f4f4", "#f4f4f4", "#f3f3f3", "#f3f3f3", "#f2f2f2", "#f2f2f2", "#f1f1f1", "#f1f1f1", "#f0f0f0", "#f0f0f0", "#efefef", "#eeeeee", "#eeeeee", "#ededed", "#ececec", "#ececec", "#ebebeb", "#eaeaea", "#e9e9e9", "#e9e9e9", "#e8e8e8", "#e7e7e7", "#e7e7e7", "#e6e6e6", "#e5e5e5", "#e4e4e4", "#e4e4e4", "#e3e3e3", "#e2e2e2", "#e1e1e1", "#e1e1e1", "#e0e0e0", "#dfdfdf", "#dfdfdf", "#dedede", "#dddddd", "#dcdcdc", "#dcdcdc", "#dbdbdb", "#dadada", "#dadada", "#d9d9d9", "#d8d8d8", "#d7d7d7", "#d6d6d6", "#d5d5d5", "#d4d4d4", "#d4d4d4", "#d3d3d3", "#d2d2d2", "#d1d1d1", "#d0d0d0", "#cfcfcf", "#cecece", "#cdcdcd", "#cccccc", "#cccccc", "#cbcbcb", "#cacaca", "#c9c9c9", "#c8c8c8", "#c7c7c7", "#c6c6c6", "#c5c5c5", "#c5c5c5", "#c4c4c4", "#c3c3c3", "#c2c2c2", "#c1c1c1", "#c0c0c0", "#bfbfbf", "#bebebe", "#bebebe", "#bdbdbd", "#bbbbbb", "#bababa", "#b9b9b9", "#b8b8b8", "#b6b6b6", "#b5b5b5", "#b4b4b4", "#b3b3b3", "#b2b2b2", "#b0b0b0", "#afafaf", "#aeaeae", "#adadad", "#ababab", "#aaaaaa", "#a9a9a9", "#a8a8a8", "#a7a7a7", "#a5a5a5", "#a4a4a4", "#a3a3a3", "#a2a2a2", "#a0a0a0", "#9f9f9f", "#9e9e9e", "#9d9d9d", "#9c9c9c", "#9a9a9a", "#999999", "#989898", "#979797", "#959595", "#949494", "#939393", "#929292", "#919191", "#909090", "#8f8f8f", "#8e8e8e", "#8d8d8d", "#8c8c8c", "#8a8a8a", "#898989", "#888888", "#878787", "#868686", "#858585", "#848484", "#838383", "#828282", "#818181", "#7f7f7f", "#7e7e7e", "#7d7d7d", "#7c7c7c", "#7b7b7b", "#7a7a7a", "#797979", "#787878", "#777777", "#767676", "#757575", "#737373", "#727272", "#717171", "#707070", "#6f6f6f", "#6e6e6e", "#6d6d6d", "#6c6c6c", "#6b6b6b", "#6a6a6a", "#696969", "#686868", "#676767", "#666666", "#656565", "#646464", "#636363", "#626262", "#616161", "#606060", "#5f5f5f", "#5e5e5e", "#5d5d5d", "#5c5c5c", "#5b5b5b", "#5a5a5a", "#585858", "#575757", "#565656", "#555555", "#545454", "#535353", "#525252", "#515151", "#505050", "#4e4e4e", "#4d4d4d", "#4b4b4b", "#4a4a4a", "#484848", "#474747", "#464646", "#444444", "#434343", "#414141", "#404040", "#3f3f3f", "#3d3d3d", "#3c3c3c", "#3a3a3a", "#393939", "#383838", "#363636", "#353535", "#333333", "#323232", "#303030", "#2f2f2f", "#2e2e2e", "#2c2c2c", "#2b2b2b", "#292929", "#282828", "#272727", "#252525", "#242424", "#232323", "#222222", "#212121", "#1f1f1f", "#1e1e1e", "#1d1d1d", "#1c1c1c", "#1b1b1b", "#1a1a1a", "#181818", "#171717", "#161616", "#151515", "#141414", "#131313", "#111111", "#101010", "#0f0f0f", "#0e0e0e", "#0d0d0d", "#0c0c0c", "#0a0a0a", "#090909", "#080808", "#070707", "#060606", "#050505", "#030303", "#020202", "#010101", "#000000"], "OrRd": ["#fff7ec", "#fff7eb", "#fff6ea", "#fff6e9", "#fff5e7", "#fff5e6", "#fff4e5", "#fff4e4", "#fff3e3", "#fff3e2", "#fff2e1", "#fff2e0", "#fff1de", "#fff1dd", "#fff0dc", "#fff0db", "#feefda", "#feefd9", "#feefd8", "#feeed7", "#feeed5", "#feedd4", "#feedd3", "#feecd2", "#feecd1", "#feebd0", "#feebcf", "#feeace", "#feeacc", "#fee9cb", "#fee9ca", "#fee8c9", "#fee8c8", "#fee7c7", "#fee7c5", "#fee6c4", "#fee5c3", "#fee5c1", "#fee4c0", "#fee4bf", "#fee3bd", "#fee2bc", "#fee2bb", "#fee1b9", "#fee0b8", "#fee0b7", "#fedfb5", "#fedfb4", "#fddeb3", "#fdddb1", "#fdddb0", "#fddcaf", "#fddbad", "#fddbac", "#fddaab", "#fdd9aa", "#fdd9a8", "#fdd8a7", "#fdd8a6", "#fdd7a4", "#fdd6a3", "#fdd6a2", "#fdd5a0", "#fdd49f", "#fdd49e", "#fdd39d", "#fdd29c", "#fdd19b", "#fdd19b", "#fdd09a", "#fdcf99", "#fdce98", "#fdce97", "#fdcd96", "#fdcc96", "#fdcb95", "#fdca94", "#fdca93", "#fdc992", "#fdc892", "#fdc791", "#fdc690", "#fdc68f", "#fdc58e", "#fdc48d", "#fdc38d", "#fdc38c", "#fdc28b", "#fdc18a", "#fdc089", "#fdbf89", "#fdbf88", "#fdbe87", "#fdbd86", "#fdbc85", "#fdbb85", "#fdba83", "#fdb982", "#fdb881", "#fdb67f", "#fdb57e", "#fdb37d", "#fdb27b", "#fdb07a", "#fdaf79", "#fdad77", "#fdac76", "#fdab75", "#fda973", "#fda872", "#fda671", "#fda56f", "#fca36e", "#fca26d", "#fca06b", "#fc9f6a", "#fc9e69", "#fc9c67", "#fc9b66", "#fc9964", "#fc9863", "#fc9662", "#fc9560", "#fc935f", "#fc925e", "#fc915c", "#fc8f5b", "#fc8e5a", "#fc8c59", "#fb8b58", "#fb8a58", "#fb8957", "#fa8757", "#fa8656", "#f98556", "#f98455", "#f98254", "#f88154", "#f88053", "#f77f53", "#f77d52", "#f67c52", "#f67b51", "#f67a51", "#f57850", "#f57750", "#f4764f", "#f4754f", "#f4734e", "#f3724e", "#f3714d", "#f2704c", "#f26e4c", "#f26d4b", "#f16c4b", "#f16a4a", "#f0694a", "#f06849", "#f06749", "#ef6548", "#ef6447", "#ee6246", "#ed6145", "#ec5f43", "#ec5d42", "#eb5c41", "#ea5a3f", "#e9583e", "#e9573d", "#e8553c", "#e7533a", "#e65239", "#e55038", "#e54e36", "#e44d35", "#e34b34", "#e24933", "#e24831", "#e14630", "#e0442f", "#df432d", "#df412c", "#de3f2b", "#dd3e2a", "#dc3c28", "#dc3a27", "#db3926", "#da3724", "#d93523", "#d93422", "#d83221", "#d7301f", "#d62f1e", "#d52d1d", "#d42c1c", "#d32a1b", "#d2291a", "#d12719", "#cf2618", "#ce2417", "#cd2316", "#cc2116", "#cb2015", "#ca1e14", "#c91d13", "#c71b12", "#c61a11", "#c51810", "#c4170f", "#c3150e", "#c2140d", "#c1120c", "#c0110b", "#be0f0a", "#bd0e09", "#bc0c08", "#bb0b07", "#ba0906", "#b90805", "#b80604", "#b70503", "#b50302", "#b40201", "#b30000", "#b20000", "#b00000", "#ae0000", "#ad0000", "#ab0000", "#a90000", "#a80000", "#a60000", "#a50000", "#a30000", "#a10000", "#a00000", "#9e0000", "#9c0000", "#9b0000", "#990000", "#970000", "#960000", "#940000", "#930000", "#910000", "#8f0000", "#8e0000", "#8c0000", "#8a0000", "#890000", "#870000", "#860000", "#840000", "#820000", "#810000", "#7f0000"], "Oranges": ["#fff5eb", "#fff5ea", "#fff4e9", "#fff4e8", "#fff3e7", "#fff3e6", "#fff2e6", "#fff2e5", "#fff1e4", "#fff1e3", "#fff0e2", "#fff0e1", "#ffefe0", "#ffefdf", "#ffeede", "#ffeedd", "#feeddc", "#feeddc", "#feeddb", "#feecda", "#feecd9", "#feebd8", "#feebd7", "#feead6", "#feead5", "#fee9d4", "#fee9d3", "#fee8d2", "#fee8d2", "#fee7d1", "#fee7d0", "#fee6cf", "#fee6ce", "#fee5cc", "#fee5cb", "#fee4ca", "#fee3c8", "#fee2c7", "#fee2c6", "#fee1c4", "#fee0c3", "#fee0c1", "#fedfc0", "#fedebf", "#fedebd", "#feddbc", "#fedcbb", "#fedcb9", "#fddbb8", "#fddab6", "#fdd9b5", "#fdd9b4", "#fdd8b2", "#fdd7b1", "#fdd7af", "#fdd6ae", "#fdd5ad", "#fdd5ab", "#fdd4aa", "#fdd3a9", "#fdd3a7", "#fdd2a6", "#fdd1a4", "#fdd1a3", "#fdd0a2", "#fdcfa0", "#fdce9e", "#fdcd9c", "#fdcb9b", "#fdca99", "#fdc997", "#fdc895", "#fdc794", "#fdc692", "#fdc590", "#fdc48f", "#fdc38d", "#fdc28b", "#fdc189", "#fdc088", "#fdbf86", "#fdbe84", "#fdbd83", "#fdbb81", "#fdba7f", "#fdb97d", "#fdb87c", "#fdb77a", "#fdb678", "#fdb576", "#fdb475", "#fdb373", "#fdb271", "#fdb170", "#fdb06e", "#fdaf6c", "#fdae6a", "#fdad69", "#fdac67", "#fdab66", "#fda965", "#fda863", "#fda762", "#fda660", "#fda55f", "#fda45d", "#fda35c", "#fda25a", "#fda159", "#fda057", "#fd9f56", "#fd9e54", "#fd9d53", "#fd9c51", "#fd9b50", "#fd9a4e", "#fd994d", "#fd984b", "#fd974a", "#fd9649", "#fd9547", "#fd9446", "#fd9344", "#fd9243", "#fd9141", "#fd9040", "#fd8f3e", "#fd8e3d", "#fd8c3b", "#fc8b3a", "#fc8a39", "#fc8937", "#fb8836", "#fb8735", "#fb8634", "#fa8532", "#fa8331", "#f98230", "#f9812e", "#f9802d", "#f87f2c", "#f87e2b", "#f87d29", "#f77b28", "#f77a27", "#f67925", "#f67824", "#f67723", "#f57622", "#f57520", "#f5741f", "#f4721e", "#f4711c", "#f3701b", "#f36f1a", "#f36e19", "#f26d17", "#f26c16", "#f26b15", "#f16913", "#f16813", "#f06712", "#ef6612", "#ee6511", "#ee6410", "#ed6310", "#ec620f", "#eb610f", "#eb600e", "#ea5f0e", "#e95e0d", "#e85d0c", "#e75c0c", "#e75b0b", "#e65a0b", "#e5590a", "#e4580a", "#e45709", "#e35608", "#e25508", "#e15407", "#e15307", "#e05206", "#df5106", "#de5005", "#de4e05", "#dd4d04", "#dc4c03", "#db4b03", "#db4a02", "#da4902", "#d94801", "#d84801", "#d64701", "#d54601", "#d34601", "#d14501", "#d04501", "#ce4401", "#cd4401", "#cb4302", "#c94202", "#c84202", "#c64102", "#c54102", "#c34002", "#c14002", "#c03f02", "#be3f02", "#bd3e02", "#bb3d02", "#b93d02", "#b83c02", "#b63c02", "#b53b02", "#b33b02", "#b13a03", "#b03903", "#ae3903", "#ad3803", "#ab3803", "#a93703", "#a83703", "#a63603", "#a53603", "#a43503", "#a23503", "#a13403", "#a03403", "#9f3303", "#9e3303", "#9c3203", "#9b3203", "#9a3103", "#993103", "#973003", "#963003", "#952f03", "#942f03", "#932f03", "#912e04", "#902e04", "#8f2d04", "#8e2d04", "#8c2c04", "#8b2c04", "#8a2b04", "#892b04", "#882a04", "#862a04", "#852904", "#842904", "#832804", "#812804", "#802704", "#7f2704"], "PRGn": ["#40004b", "#42024d", "#44034f", "#460552", "#480754", "#4b0856", "#4d0a58", "#4f0c5a", "#510d5d", "#530f5f", "#551061", "#571263", "#591465", "#5c1568", "#5e176a", "#60196c", "#621a6e", "#641c70", "#661e73", "#681f75", "#6a2177", "#6c2379", "#6f247b", "#71267e", "#732880", "#752982", "#772b84", "#782e85", "#793187", "#7b3488", "#7c368a", "#7e398c", "#7f3c8d", "#803f8f", "#824190", "#834492", "#844793", "#864a95", "#874c97", "#894f98", "#8a529a", "#8b559b", "#8d579d", "#8e5a9e", "#8f5da0", "#9160a2", "#9262a3", "#9465a5", "#9568a6", "#966ba8", "#986da9", "#9970ab", "#9b72ac", "#9c74ae", "#9e76af", "#9f78b1", "#a17ab2", "#a37cb3", "#a47fb5", "#a681b6", "#a783b8", "#a985b9", "#ab87bb", "#ac89bc", "#ae8bbd", "#b08dbf", "#b18fc0", "#b391c2", "#b493c3", "#b695c4", "#b897c6", "#b99ac7", "#bb9cc9", "#bc9eca", "#bea0cb", "#c0a2cd", "#c1a4ce", "#c3a6cf", "#c4a8d0", "#c6aad1", "#c7abd2", "#c9add3", "#caafd4", "#cbb1d5", "#cdb3d6", "#ceb5d7", "#d0b7d8", "#d1b8d9", "#d3bada", "#d4bcdb", "#d6bedc", "#d7c0dd", "#d8c2de", "#dac3df", "#dbc5e0", "#ddc7e1", "#dec9e2", "#e0cbe3", "#e1cde4", "#e3cee5", "#e4d0e6", "#e6d2e7", "#e7d4e8", "#e8d5e9", "#e8d7e9", "#e9d8ea", "#ead9ea", "#eadbeb", "#ebdcec", "#ebdeec", "#ecdfed", "#ede0ed", "#ede2ee", "#eee3ee", "#efe4ef", "#efe6f0", "#f0e7f0", "#f0e9f1", "#f1eaf1", "#f2ebf2", "#f2edf3", "#f3eef3", "#f4eff4", "#f4f1f4", "#f5f2f5", "#f5f4f6", "#f6f5f6", "#f7f6f7", "#f6f7f6", "#f5f7f5", "#f4f6f3", "#f3f6f2", "#f2f6f1", "#f1f5ef", "#eff5ee", "#eef5ec", "#edf5eb", "#ecf4ea", "#ebf4e8", "#e9f4e7", "#e8f4e5", "#e7f3e4", "#e6f3e3", "#e5f3e1", "#e4f2e0", "#e2f2de", "#e1f2dd", "#e0f2db", "#dff1da", "#def1d9", "#ddf1d7", "#dbf1d6", "#daf0d4", "#d9f0d3", "#d7efd1", "#d5eecf", "#d3eecd", "#d1edcb", "#cfecc9", "#cdebc7", "#cbeac5", "#c9e9c3", "#c7e9c1", "#c5e8bf", "#c3e7bd", "#c1e6bb", "#bfe5b9", "#bde4b7", "#bbe4b5", "#b9e3b3", "#b7e2b1", "#b5e1af", "#b3e0ad", "#b1e0ab", "#afdfa9", "#addea7", "#abdda5", "#a9dca3", "#a7dba1", "#a5da9f", "#a2d89c", "#9fd79a", "#9cd597", "#99d395", "#96d192", "#93d090", "#90ce8d", "#8dcc8b", "#8aca89", "#87c886", "#84c784", "#81c581", "#7ec37f", "#7bc17c", "#78c07a", "#75be77", "#72bc75", "#6fba72", "#6cb970", "#69b76d", "#66b56b", "#63b368", "#60b266", "#5db063", "#5aae61", "#58ac5f", "#55aa5e", "#53a85c", "#50a65a", "#4ea359", "#4ba157", "#499f55", "#469d54", "#449b52", "#419951", "#3f974f", "#3c954d", "#3a924c", "#37904a", "#358e48", "#328c47", "#308a45", "#2e8843", "#2b8642", "#298440", "#26823e", "#247f3d", "#217d3b", "#1f7b39", "#1c7938", "#1a7736", "#197535", "#187334", "#177133", "#166f32", "#156d31", "#146b30", "#13692f", "#12672e", "#11652d", "#10632b", "#0f612a", "#0e5f29", "#0d5c28", "#0c5a27", "#0b5826", "#0a5625", "#085424", "#075223", "#065022", "#054e20", "#044c1f", "#034a1e", "#02481d", "#01461c", "#00441b"], "Paired": ["#a6cee3", "#a0cae1", "#9ac7df", "#95c3dd", "#8fbfdb", "#89bbd9", "#83b8d7", "#7db4d5", "#77b0d3", "#72add1", "#6ca9cf", "#66a5cd", "#60a1cb", "#5a9ec9", "#549ac7", "#4f96c5", "#4993c3", "#438fc1", "#3d8bbf", "#3788bc", "#3284ba", "#2c80b8", "#267cb6", "#2079b4", "#247cb3", "#2b80b1", "#3185af", "#3789ad", "#3e8dab", "#4492a9", "#4a96a8", "#519ba6", "#579fa4", "#5da4a2", "#64a8a0", "#6aad9f", "#70b19d", "#77b59b", "#7dba99", "#83be97", "#8ac396", "#90c794", "#96cc92", "#9dd090", "#a3d48e", "#a9d98c", "#b0dd8b", "#afdd87", "#a9db83", "#a4d87f", "#9ed57b", "#99d277", "#93d073", "#8ecd6f", "#88ca6b", "#83c867", "#7dc563", "#78c25f", "#72bf5b", "#6dbd57", "#67ba53", "#62b74f", "#5cb54b", "#57b247", "#51af42", "#4cac3e", "#46aa3a", "#41a736", "#3ba432", "#36a12e", "#37a02e", "#40a033", "#489f38", "#519f3c", "#599f41", "#629f46", "#6b9e4a", "#739e4f", "#7c9e54", "#859e58", "#8d9d5d", "#969d62", "#9e9d67", "#a79d6b", "#b09c70", "#b89c75", "#c19c79", "#ca9b7e", "#d29b83", "#db9b87", "#e39b8c", "#ec9a91", "#f59a96", "#fb9898", "#fa9392", "#f98d8d", "#f88887", "#f78282", "#f67d7d", "#f57777", "#f37272", "#f26c6c", "#f16767", "#f06162", "#ef5c5c", "#ee5657", "#ed5151", "#ec4b4c", "#eb4647", "#ea4041", "#e93b3c", "#e83536", "#e73031", "#e62a2c", "#e52526", "#e41f21", "#e31b1c", "#e42220", "#e52923", "#e63027", "#e8372b", "#e93e2e", "#ea4532", "#eb4c35", "#ec5439", "#ed5b3d", "#ee6240", "#ef6944", "#f17047", "#f2774b", "#f37e4e", "#f48552", "#f58d56", "#f69459", "#f79b5d", "#f8a260", "#faa964", "#fbb068", "#fcb76b", "#fdbe6f", "#fdbc6b", "#fdba66", "#fdb761", "#fdb45c", "#fdb157", "#feaf53", "#feac4e", "#fea949", "#fea644", "#fea440", "#fea13b", "#fe9e36", "#fe9b31", "#fe992c", "#fe9628", "#fe9323", "#fe901e", "#ff8e19", "#ff8b14", "#ff8810", "#ff850b", "#ff8306", "#ff8001", "#fd8107", "#fb8310", "#f98519", "#f68722", "#f4892c", "#f28c35", "#f08e3e", "#ed9047", "#eb9251", "#e9945a", "#e69763", "#e4996c", "#e29b75", "#e09d7f", "#dd9f88", "#dba291", "#d9a49a", "#d6a6a4", "#d4a8ad", "#d2aab6", "#d0adbf", "#cdafc9", "#cbb1d2", "#c8afd5", "#c4aad2", "#bfa5cf", "#bba0cd", "#b79bca", "#b396c8", "#af91c5", "#ab8cc2", "#a787c0", "#a282bd", "#9e7dbb", "#9a78b8", "#9673b6", "#926eb3", "#8e69b0", "#8a64ae", "#855eab", "#8159a9", "#7d54a6", "#794fa3", "#754aa1", "#71459e", "#6d409c", "#6c409a", "#73489a", "#79519a", "#80599a", "#86629a", "#8c6a9a", "#93729a", "#997b9a", "#a0839a", "#a68b9a", "#ad949a", "#b39c9a", "#b9a499", "#c0ad99", "#c6b599", "#cdbe99", "#d3c699", "#dace99", "#e0d799", "#e6df99", "#ede799", "#f3f099", "#faf899", "#fefe98", "#fbf793", "#f8ef8e", "#f4e889", "#f1e185", "#eeda80", "#ead37b", "#e7cc76", "#e3c471", "#e0bd6c", "#ddb667", "#d9af62", "#d6a85e", "#d3a159", "#cf9954", "#cc924f", "#c98b4a", "#c58445", "#c27d40", "#be763b", "#bb6e37", "#b86732", "#b4602d", "#b15928"], "Pastel1": ["#fbb4ae", "#f9b5b0", "#f6b6b1", "#f4b6b3", "#f2b7b5", "#f0b8b6", "#edb9b8", "#ebb9ba", "#e9babb", "#e7bbbd", "#e4bcbf", "#e2bdc0", "#e0bdc2", "#debec4", "#dbbfc5", "#d9c0c7", "#d7c1c9", "#d5c1ca", "#d2c2cc", "#d0c3ce", "#cec4cf", "#ccc4d1", "#c9c5d3", "#c7c6d4", "#c5c7d6", "#c3c8d8", "#c0c8d9", "#bec9db", "#bccadd", "#b9cbde", "#b7cce0", "#b5cce2", "#b3cde3", "#b4cee2", "#b5cfe1", "#b5d0e0", "#b6d1df", "#b7d2de", "#b8d3dd", "#b9d4dc", "#b9d5db", "#bad6da", "#bbd7d9", "#bcd7d9", "#bdd8d8", "#bdd9d7", "#bedad6", "#bfdbd5", "#c0dcd4", "#c0ddd3", "#c1ded2", "#c2dfd1", "#c3e0d0", "#c4e1cf", "#c4e2ce", "#c5e3cd", "#c6e4cc", "#c7e5cb", "#c7e6ca", "#c8e7c9", "#c9e7c9", "#cae8c8", "#cbe9c7", "#cbeac6", "#ccebc5", "#cdeac6", "#cde9c7", "#cee8c8", "#cee7c9", "#cfe6ca", "#d0e5cb", "#d0e4cc", "#d1e3cd", "#d1e2ce", "#d2e1cf", "#d2e0d0", "#d3dfd1", "#d3ded2", "#d4ddd3", "#d5dcd4", "#d5dbd5", "#d6dad6", "#d6d9d7", "#d7d8d8", "#d7d7d9", "#d8d6da", "#d9d5db", "#d9d4dc", "#dad3dd", "#dad2de", "#dbd1df", "#dbd0e0", "#dccfe0", "#ddcee1", "#ddcde2", "#decce3", "#decbe3", "#dfcce1", "#e0ccdf", "#e1ccdd", "#e2cddb", "#e3cdda", "#e4ced8", "#e5ced6", "#e6cfd4", "#e7cfd2", "#e8d0d0", "#e9d0ce", "#ead0cc", "#ebd1ca", "#ecd1c8", "#edd2c6", "#eed2c4", "#efd3c2", "#f0d3c0", "#f1d4be", "#f2d4bc", "#f3d4ba", "#f4d5b8", "#f5d5b7", "#f6d6b5", "#f7d6b3", "#f8d7b1", "#f9d7af", "#fad7ad", "#fbd8ab", "#fcd8a9", "#fdd9a7", "#fedaa7", "#fedba8", "#fedca9", "#feddaa", "#fedeab", "#fee0ad", "#fee1ae", "#fee2af", "#fee3b0", "#fee4b1", "#fee6b3", "#fee7b4", "#fee8b5", "#fee9b6", "#feeab7", "#feebb8", "#ffedba", "#ffeebb", "#ffefbc", "#fff0bd", "#fff1be", "#fff3c0", "#fff4c1", "#fff5c2", "#fff6c3", "#fff7c4", "#fff9c6", "#fffac7", "#fffbc8", "#fffcc9", "#fffdca", "#ffffcc", "#fefecc", "#fefdcb", "#fdfccb", "#fcfbca", "#fbf9ca", "#faf8c9", "#faf7c9", "#f9f6c8", "#f8f4c8", "#f7f3c7", "#f6f2c7", "#f6f1c7", "#f5f0c6", "#f4eec6", "#f3edc5", "#f2ecc5", "#f1ebc4", "#f1e9c4", "#f0e8c3", "#efe7c3", "#eee6c2", "#ede5c2", "#ede3c1", "#ece2c1", "#ebe1c0", "#eae0c0", "#e9debf", "#e8ddbf", "#e8dcbf", "#e7dbbe", "#e6dabe", "#e5d8bd", "#e6d8be", "#e6d8c0", "#e7d8c1", "#e8d8c3", "#e9d8c4", "#e9d8c5", "#ead8c7", "#ebd8c8", "#ecd9ca", "#ecd9cb", "#edd9cd", "#eed9ce", "#efd9d0", "#efd9d1", "#f0d9d3", "#f1d9d4", "#f2d9d6", "#f2d9d7", "#f3d9d9", "#f4d9da", "#f5d9dc", "#f5d9dd", "#f6d9df", "#f7d9e0", "#f8dae1", "#f8dae3", "#f9dae4", "#fadae6", "#fbdae7", "#fbdae9", "#fcdaea", "#fddaec", "#fddbec", "#fcdbec", "#fcdced", "#fcdded", "#fbdeed", "#fbdeed", "#fbdfed", "#fae0ed", "#fae1ee", "#fae1ee", "#f9e2ee", "#f9e3ee", "#f9e4ee", "#f8e4ef", "#f8e5ef", "#f8e6ef", "#f7e7ef", "#f7e7ef", "#f6e8f0", "#f6e9f0", "#f6eaf0", "#f5eaf0", "#f5ebf0", "#f5ecf0", "#f4edf1", "#f4edf1", "#f4eef1", "#f3eff1", "#f3f0f1", "#f3f0f2", "#f2f1f2", "#f2f2f2"], "Pastel2": ["#b3e2cd", "#b5e1cc", "#b7e1cb", "#b9e0ca", "#bbe0c9", "#bddfc8", "#bfdfc8", "#c1dec7", "#c3ddc6", "#c5ddc5", "#c7dcc4", "#c9dcc3", "#cbdbc2", "#cddbc1", "#cfdac0", "#d1d9bf", "#d4d9bf", "#d6d8be", "#d8d8bd", "#dad7bc", "#dcd6bb", "#ded6ba", "#e0d5b9", "#e2d5b8", "#e4d4b7", "#e6d4b6", "#e8d3b5", "#ead2b5", "#ecd2b4", "#eed1b3", "#f0d1b2", "#f2d0b1", "#f4d0b0", "#f6cfaf", "#f8ceae", "#facead", "#fccdac", "#fccdad", "#fbcdaf", "#f9ceb0", "#f8ceb2", "#f7ceb4", "#f5ceb5", "#f4ceb7", "#f3cfb8", "#f1cfba", "#f0cfbc", "#eecfbd", "#edd0bf", "#ecd0c1", "#ead0c2", "#e9d0c4", "#e8d0c6", "#e6d1c7", "#e5d1c9", "#e4d1cb", "#e2d1cc", "#e1d2ce", "#dfd2d0", "#ded2d1", "#ddd2d3", "#dbd2d4", "#dad3d6", "#d9d3d8", "#d7d3d9", "#d6d3db", "#d4d3dd", "#d3d4de", "#d2d4e0", "#d0d4e2", "#cfd4e3", "#ced5e5", "#ccd5e7", "#cbd5e8", "#ccd5e8", "#cdd4e8", "#cfd4e8", "#d0d4e8", "#d1d3e7", "#d2d3e7", "#d3d3e7", "#d4d3e7", "#d5d2e7", "#d6d2e7", "#d8d2e7", "#d9d1e7", "#dad1e7", "#dbd1e6", "#dcd0e6", "#ddd0e6", "#ded0e6", "#dfd0e6", "#e1cfe6", "#e2cfe6", "#e3cfe6", "#e4cee6", "#e5cee5", "#e6cee5", "#e7cde5", "#e8cde5", "#eacde5", "#ebcde5", "#eccce5", "#edcce5", "#eecce5", "#efcbe4", "#f0cbe4", "#f1cbe4", "#f3cae4", "#f4cae4", "#f4cbe3", "#f3cce3", "#f3cde2", "#f3cee1", "#f2d0e1", "#f2d1e0", "#f1d2df", "#f1d3de", "#f1d4de", "#f0d5dd", "#f0d7dc", "#efd8db", "#efd9db", "#efdada", "#eedbd9", "#eeddd8", "#eeded8", "#eddfd7", "#ede0d6", "#ece1d5", "#ece2d5", "#ece4d4", "#ebe5d3", "#ebe6d2", "#ebe7d2", "#eae8d1", "#eaead0", "#e9ebcf", "#e9eccf", "#e9edce", "#e8eecd", "#e8efcc", "#e7f1cc", "#e7f2cb", "#e7f3ca", "#e6f4ca", "#e6f5c9", "#e7f5c8", "#e8f5c7", "#e8f5c7", "#e9f5c6", "#eaf5c5", "#eaf4c4", "#ebf4c4", "#ecf4c3", "#ecf4c2", "#edf4c1", "#eef4c1", "#eef4c0", "#eff4bf", "#f0f4be", "#f0f4be", "#f1f4bd", "#f2f4bc", "#f3f3bb", "#f3f3bb", "#f4f3ba", "#f5f3b9", "#f5f3b8", "#f6f3b8", "#f7f3b7", "#f7f3b6", "#f8f3b6", "#f9f3b5", "#f9f3b4", "#faf3b3", "#fbf3b3", "#fbf2b2", "#fcf2b1", "#fdf2b0", "#fef2b0", "#fef2af", "#fff2ae", "#fff2af", "#fef1b0", "#fef1b0", "#fef0b1", "#fdf0b2", "#fdefb3", "#fcefb4", "#fcefb4", "#fceeb5", "#fbeeb6", "#fbedb7", "#faedb8", "#faecb9", "#faecb9", "#f9ebba", "#f9ebbb", "#f9ebbc", "#f8eabd", "#f8eabe", "#f7e9be", "#f7e9bf", "#f7e8c0", "#f6e8c1", "#f6e8c2", "#f5e7c2", "#f5e7c3", "#f5e6c4", "#f4e6c5", "#f4e5c6", "#f4e5c7", "#f3e4c7", "#f3e4c8", "#f2e4c9", "#f2e3ca", "#f2e3cb", "#f1e2cc", "#f1e2cc", "#f0e1cc", "#efe1cc", "#eee0cc", "#eddfcc", "#ebdfcc", "#eadecc", "#e9decc", "#e8ddcc", "#e7dccc", "#e6dccc", "#e5dbcc", "#e4dacc", "#e3dacc", "#e2d9cc", "#e1d9cc", "#e0d8cc", "#dfd7cc", "#ded7cc", "#ddd6cc", "#dcd6cc", "#dbd5cc", "#dad4cc", "#d9d4cc", "#d8d3cc", "#d7d3cc", "#d6d2cc", "#d5d1cc", "#d4d1cc", "#d3d0cc", "#d2d0cc", "#d1cfcc", "#d0cecc", "#cfcecc", "#cecdcc", "#cdcdcc", "#cccccc"], "PiYG": ["#8e0152", "#900254", "#920355", "#940457", "#970559", "#99065a", "#9b075c", "#9d085e", "#9f095f", "#a10a61", "#a40b63", "#a60c65", "#a80d66", "#aa0e68", "#ac0f6a", "#ae106b", "#b1116d", "#b3126f", "#b51370", "#b71472", "#b91574", "#bb1675", "#bd1777", "#c01879", "#c2197a", "#c41a7c", "#c51d7e", "#c62080", "#c72482", "#c82884", "#c92b86", "#ca2f88", "#cb3289", "#cc368b", "#cd3a8d", "#ce3d8f", "#cf4191", "#d04493", "#d14895", "#d24c97", "#d34f99", "#d4539b", "#d5579d", "#d65a9f", "#d75ea1", "#d861a2", "#d965a4", "#da69a6", "#db6ca8", "#dc70aa", "#dd73ac", "#de77ae", "#df79b0", "#df7cb1", "#e07eb3", "#e181b5", "#e283b7", "#e286b8", "#e388ba", "#e48bbc", "#e58dbe", "#e590bf", "#e692c1", "#e795c3", "#e897c4", "#e89ac6", "#e99cc8", "#ea9fca", "#eba1cb", "#eba3cd", "#eca6cf", "#eda8d1", "#eeabd2", "#eeadd4", "#efb0d6", "#f0b2d7", "#f1b5d9", "#f1b7da", "#f2b8db", "#f2badc", "#f3bcdd", "#f3bdde", "#f4bfdf", "#f4c1df", "#f5c2e0", "#f5c4e1", "#f5c6e2", "#f6c7e3", "#f6c9e3", "#f7cbe4", "#f7cce5", "#f8cee6", "#f8d0e7", "#f9d1e8", "#f9d3e8", "#fad4e9", "#fad6ea", "#fbd8eb", "#fbd9ec", "#fcdbed", "#fcdded", "#fddeee", "#fde0ef", "#fde1ef", "#fde2f0", "#fce3f0", "#fce4f0", "#fce5f1", "#fce5f1", "#fbe6f1", "#fbe7f2", "#fbe8f2", "#fbe9f2", "#faeaf2", "#faebf3", "#faecf3", "#faedf3", "#f9eef4", "#f9eef4", "#f9eff4", "#f9f0f5", "#f9f1f5", "#f8f2f5", "#f8f3f6", "#f8f4f6", "#f8f5f6", "#f7f6f7", "#f7f7f7", "#f7f7f6", "#f6f7f5", "#f5f7f3", "#f5f7f2", "#f4f7f0", "#f3f7ef", "#f3f6ed", "#f2f6ec", "#f1f6ea", "#f1f6e8", "#f0f6e7", "#eff6e5", "#eff6e4", "#eef6e2", "#edf6e1", "#edf6df", "#ecf6de", "#ebf6dc", "#ebf6db", "#eaf5d9", "#e9f5d8", "#e9f5d6", "#e8f5d5", "#e7f5d3", "#e7f5d2", "#e6f5d0", "#e4f4cd", "#e2f3ca", "#e1f3c7", "#dff2c4", "#ddf1c1", "#dbf0bf", "#d9f0bc", "#d8efb9", "#d6eeb6", "#d4edb3", "#d2ecb0", "#d0ecad", "#cfebaa", "#cdeaa7", "#cbe9a4", "#c9e8a2", "#c7e89f", "#c6e79c", "#c4e699", "#c2e596", "#c0e593", "#bee490", "#bde38d", "#bbe28a", "#b9e187", "#b7e085", "#b5df82", "#b2dd7f", "#b0dc7d", "#aeda7a", "#acd977", "#a9d874", "#a7d672", "#a5d56f", "#a3d36c", "#a1d26a", "#9ed067", "#9ccf64", "#9acd61", "#98cc5f", "#95cb5c", "#93c959", "#91c857", "#8fc654", "#8cc551", "#8ac34f", "#88c24c", "#86c049", "#83bf46", "#81bd44", "#7fbc41", "#7dba40", "#7bb93e", "#79b73d", "#77b53c", "#75b43b", "#73b239", "#71b038", "#6faf37", "#6dad36", "#6bac34", "#69aa33", "#67a832", "#66a731", "#64a52f", "#62a32e", "#60a22d", "#5ea02c", "#5c9e2a", "#5a9d29", "#589b28", "#569927", "#549825", "#529624", "#509423", "#4e9322", "#4c9121", "#4b8f21", "#498d20", "#488c20", "#468a20", "#45881f", "#43861f", "#42841f", "#40831e", "#3f811e", "#3d7f1e", "#3c7d1d", "#3a7b1d", "#397a1d", "#37781c", "#36761c", "#34741c", "#33721c", "#31711b", "#306f1b", "#2e6d1b", "#2d6b1a", "#2b691a", "#2a681a", "#286619", "#276419"], "PuBu": ["#fff7fb", "#fef6fb", "#fef6fa", "#fdf5fa", "#fdf5fa", "#fcf4fa", "#fbf4f9", "#fbf3f9", "#faf3f9", "#faf2f8", "#f9f2f8", "#f8f1f8", "#f8f1f8", "#f7f0f7", "#f7f0f7", "#f6eff7", "#f5eff6", "#f5eef6", "#f4eef6", "#f4edf6", "#f3edf5", "#f2ecf5", "#f2ecf5", "#f1ebf5", "#f1ebf4", "#f0eaf4", "#f0eaf4", "#efe9f3", "#eee9f3", "#eee8f3", "#ede8f3", "#ede7f2", "#ece7f2", "#ebe6f2", "#eae6f1", "#e9e5f1", "#e8e4f0", "#e7e3f0", "#e7e3f0", "#e6e2ef", "#e5e1ef", "#e4e1ef", "#e3e0ee", "#e2dfee", "#e1dfed", "#e0deed", "#e0dded", "#dfddec", "#dedcec", "#dddbec", "#dcdaeb", "#dbdaeb", "#dad9ea", "#d9d8ea", "#d9d8ea", "#d8d7e9", "#d7d6e9", "#d6d6e9", "#d5d5e8", "#d4d4e8", "#d3d4e7", "#d2d3e7", "#d2d2e7", "#d1d2e6", "#d0d1e6", "#ced0e6", "#cdd0e5", "#cccfe5", "#cacee5", "#c9cee4", "#c8cde4", "#c6cce3", "#c5cce3", "#c4cbe3", "#c2cbe2", "#c1cae2", "#c0c9e2", "#bfc9e1", "#bdc8e1", "#bcc7e1", "#bbc7e0", "#b9c6e0", "#b8c6e0", "#b7c5df", "#b5c4df", "#b4c4df", "#b3c3de", "#b1c2de", "#b0c2de", "#afc1dd", "#adc1dd", "#acc0dd", "#abbfdc", "#a9bfdc", "#a8bedc", "#a7bddb", "#a5bddb", "#a4bcda", "#a2bcda", "#a1bbda", "#9fbad9", "#9ebad9", "#9cb9d9", "#9ab8d8", "#99b8d8", "#97b7d7", "#96b6d7", "#94b6d7", "#93b5d6", "#91b5d6", "#8fb4d6", "#8eb3d5", "#8cb3d5", "#8bb2d4", "#89b1d4", "#88b1d4", "#86b0d3", "#84b0d3", "#83afd3", "#81aed2", "#80aed2", "#7eadd1", "#7dacd1", "#7bacd1", "#79abd0", "#78abd0", "#76aad0", "#75a9cf", "#73a9cf", "#71a8ce", "#6fa7ce", "#6da6cd", "#6ba5cd", "#69a5cc", "#67a4cc", "#65a3cb", "#63a2cb", "#62a2cb", "#60a1ca", "#5ea0ca", "#5c9fc9", "#5a9ec9", "#589ec8", "#569dc8", "#549cc7", "#529bc7", "#509ac6", "#4e9ac6", "#4c99c5", "#4a98c5", "#4897c4", "#4697c4", "#4496c3", "#4295c3", "#4094c3", "#3f93c2", "#3d93c2", "#3b92c1", "#3991c1", "#3790c0", "#358fc0", "#348ebf", "#328dbf", "#308cbe", "#2f8bbe", "#2d8abd", "#2c89bd", "#2a88bc", "#2987bc", "#2786bb", "#2685bb", "#2484ba", "#2383ba", "#2182b9", "#2081b9", "#1e80b8", "#1c7fb8", "#1b7eb7", "#197db7", "#187cb6", "#167bb6", "#157ab5", "#1379b5", "#1278b4", "#1077b4", "#0f76b3", "#0d75b3", "#0c74b2", "#0a73b2", "#0872b1", "#0771b1", "#0570b0", "#056faf", "#056fae", "#056ead", "#056dac", "#056dab", "#056caa", "#056ba9", "#056ba7", "#056aa6", "#0569a5", "#0569a4", "#0568a3", "#0567a2", "#0567a1", "#0566a0", "#05659f", "#04649e", "#04649d", "#04639b", "#04629a", "#046299", "#046198", "#046097", "#046096", "#045f95", "#045e94", "#045e93", "#045d92", "#045c90", "#045b8f", "#045b8e", "#045a8d", "#04598c", "#04588a", "#045788", "#045687", "#045585", "#045483", "#045382", "#045280", "#03517e", "#034f7d", "#034e7b", "#034d79", "#034c78", "#034b76", "#034a74", "#034973", "#034871", "#03476f", "#03466e", "#03456c", "#03446a", "#034369", "#034267", "#034165", "#023f64", "#023e62", "#023d60", "#023c5f", "#023b5d", "#023a5b", "#02395a", "#023858"], "PuBuGn": ["#fff7fb", "#fef6fb", "#fef6fa", "#fdf5fa", "#fdf4fa", "#fcf4f9", "#fbf3f9", "#fbf2f9", "#faf2f8", "#faf1f8", "#f9f0f8", "#f8f0f7", "#f8eff7", "#f7eef7", "#f7eef6", "#f6edf6", "#f5ecf5", "#f5ecf5", "#f4ebf5", "#f4eaf4", "#f3eaf4", "#f2e9f4", "#f2e9f3", "#f1e8f3", "#f1e7f3", "#f0e7f2", "#f0e6f2", "#efe5f2", "#eee5f1", "#eee4f1", "#ede3f1", "#ede3f0", "#ece2f0", "#ebe1f0", "#eae1ef", "#e9e0ef", "#e8e0ef", "#e7dfee", "#e7dfee", "#e6deee", "#e5deed", "#e4dded", "#e3dded", "#e2dced", "#e1dcec", "#e0dbec", "#e0daec", "#dfdaeb", "#ded9eb", "#ddd9eb", "#dcd8ea", "#dbd8ea", "#dad7ea", "#d9d7e9", "#d9d6e9", "#d8d6e9", "#d7d5e8", "#d6d5e8", "#d5d4e8", "#d4d4e7", "#d3d3e7", "#d2d2e7", "#d2d2e7", "#d1d1e6", "#d0d1e6", "#ced0e6", "#cdd0e5", "#cccfe5", "#cacee5", "#c9cee4", "#c8cde4", "#c6cce3", "#c5cce3", "#c4cbe3", "#c2cbe2", "#c1cae2", "#c0c9e2", "#bfc9e1", "#bdc8e1", "#bcc7e1", "#bbc7e0", "#b9c6e0", "#b8c6e0", "#b7c5df", "#b5c4df", "#b4c4df", "#b3c3de", "#b1c2de", "#b0c2de", "#afc1dd", "#adc1dd", "#acc0dd", "#abbfdc", "#a9bfdc", "#a8bedc", "#a7bddb", "#a5bddb", "#a3bcda", "#a1bcda", "#9fbbda", "#9dbad9", "#9bbad9", "#99b9d9", "#97b8d8", "#95b8d8", "#93b7d7", "#91b6d7", "#90b6d7", "#8eb5d6", "#8cb5d6", "#8ab4d6", "#88b3d5", "#86b3d5", "#84b2d4", "#82b1d4", "#80b1d4", "#7eb0d3", "#7cb0d3", "#7aafd3", "#78aed2", "#76aed2", "#74add1", "#72acd1", "#70acd1", "#6eabd0", "#6cabd0", "#6aaad0", "#68a9cf", "#66a9cf", "#65a8ce", "#63a7ce", "#62a6cd", "#60a5cd", "#5fa5cc", "#5da4cc", "#5ba3cb", "#5aa2cb", "#58a2cb", "#57a1ca", "#55a0ca", "#549fc9", "#529ec9", "#519ec8", "#4f9dc8", "#4e9cc7", "#4c9bc7", "#4b9ac6", "#499ac6", "#4799c5", "#4698c5", "#4497c4", "#4397c4", "#4196c3", "#4095c3", "#3e94c3", "#3d93c2", "#3b93c2", "#3a92c1", "#3891c1", "#3790c0", "#3590bf", "#338fbd", "#328fbc", "#308eba", "#2e8eb8", "#2d8db6", "#2b8db5", "#2a8cb3", "#288cb1", "#268bb0", "#258bae", "#238bac", "#218aab", "#208aa9", "#1e89a7", "#1d89a6", "#1b88a4", "#1988a2", "#1887a0", "#16879f", "#14869d", "#13869b", "#11859a", "#0f8598", "#0e8496", "#0c8495", "#0b8393", "#098391", "#078390", "#06828e", "#04828c", "#02818a", "#028189", "#028087", "#027f86", "#027f84", "#027e83", "#027d81", "#027d80", "#027c7e", "#027b7d", "#027b7b", "#027a79", "#027978", "#027976", "#027875", "#027773", "#027772", "#017670", "#01756f", "#01756d", "#01746c", "#01736a", "#017369", "#017267", "#017165", "#017164", "#017062", "#016f61", "#016f5f", "#016e5e", "#016d5c", "#016d5b", "#016c59", "#016b58", "#016a57", "#016956", "#016755", "#016654", "#016553", "#016451", "#016350", "#01614f", "#01604e", "#015f4d", "#015e4c", "#015d4b", "#015b4a", "#015a49", "#015948", "#015846", "#015745", "#015544", "#015443", "#015342", "#015241", "#015140", "#01503f", "#014e3e", "#014d3d", "#014c3b", "#014b3a", "#014a39", "#014838", "#014737", "#014636"], "PuOr": ["#7f3b08", "#813c08", "#833d08", "#853e08", "#874008", "#894108", "#8b4208", "#8d4307", "#8f4407", "#914507", "#934607", "#954807", "#974907", "#9a4a07", "#9c4b07", "#9e4c07", "#a04d07", "#a24e07", "#a44f07", "#a65107", "#a85206", "#aa5306", "#ac5406", "#ae5506", "#b05606", "#b25706", "#b45906", "#b65a07", "#b75c07", "#b95e08", "#bb5f08", "#bd6109", "#be630a", "#c0640a", "#c2660b", "#c4680b", "#c6690c", "#c76b0c", "#c96d0d", "#cb6e0d", "#cd700e", "#ce720f", "#d0730f", "#d27510", "#d47610", "#d57811", "#d77a11", "#d97b12", "#db7d12", "#dc7f13", "#de8013", "#e08214", "#e18417", "#e2861a", "#e3881d", "#e58a20", "#e68d23", "#e78f27", "#e8912a", "#e9932d", "#ea9530", "#eb9733", "#ed9936", "#ee9b39", "#ef9e3c", "#f0a03f", "#f1a242", "#f2a446", "#f3a649", "#f4a84c", "#f6aa4f", "#f7ac52", "#f8ae55", "#f9b158", "#fab35b", "#fbb55e", "#fcb761", "#fdb965", "#fdba68", "#fdbc6b", "#fdbd6e", "#fdbf72", "#fdc175", "#fdc278", "#fdc47b", "#fdc57f", "#fdc782", "#fdc885", "#fdca88", "#fdcc8c", "#fecd8f", "#fecf92", "#fed095", "#fed299", "#fed39c", "#fed59f", "#fed7a2", "#fed8a6", "#fedaa9", "#fedbac", "#feddaf", "#fedeb3", "#fee0b6", "#fee1b9", "#fde2bb", "#fde3be", "#fde4c0", "#fde5c3", "#fce5c5", "#fce6c8", "#fce7ca", "#fce8cd", "#fbe9cf", "#fbead2", "#fbebd5", "#faecd7", "#faedda", "#faeedc", "#faeedf", "#f9efe1", "#f9f0e4", "#f9f1e6", "#f9f2e9", "#f8f3ec", "#f8f4ee", "#f8f5f1", "#f7f6f3", "#f7f7f6", "#f6f6f7", "#f5f5f6", "#f4f4f6", "#f3f3f5", "#f2f2f5", "#f0f1f4", "#eff0f4", "#eeeef3", "#ededf3", "#ebecf3", "#eaebf2", "#e9eaf2", "#e8e9f1", "#e7e8f1", "#e5e7f0", "#e4e5f0", "#e3e4ef", "#e2e3ef", "#e1e2ee", "#dfe1ee", "#dee0ed", "#dddfed", "#dcddec", "#dadcec", "#d9dbeb", "#d8daeb", "#d7d8ea", "#d5d6e9", "#d4d4e8", "#d2d3e7", "#d1d1e6", "#cfcfe5", "#cecde4", "#cccbe3", "#cbc9e2", "#c9c8e1", "#c8c6e0", "#c6c4df", "#c5c2de", "#c3c0dd", "#c2bedc", "#c0bddb", "#bfbbda", "#bdb9d9", "#bcb7d8", "#bab5d7", "#b9b3d6", "#b7b1d5", "#b6b0d4", "#b4aed3", "#b3acd2", "#b1aad1", "#afa8d0", "#ada6ce", "#aba3cd", "#a9a1cb", "#a79fca", "#a59dc8", "#a39bc7", "#a198c5", "#9f96c4", "#9d94c2", "#9b92c1", "#9990bf", "#988dbe", "#968bbc", "#9489bb", "#9287b9", "#9085b8", "#8e82b6", "#8c80b5", "#8a7eb3", "#887cb2", "#867ab0", "#8477af", "#8275ad", "#8073ac", "#7e70ab", "#7d6da9", "#7b6aa8", "#7967a6", "#7764a5", "#7661a4", "#745ea2", "#725ba1", "#70589f", "#6f559e", "#6d529c", "#6b4f9b", "#6a4c9a", "#684998", "#664697", "#644395", "#634094", "#613d93", "#5f3a91", "#5d3790", "#5c348e", "#5a318d", "#582e8c", "#572b8a", "#552889", "#532687", "#522584", "#502382", "#4f2280", "#4d207d", "#4c1f7b", "#4a1d78", "#491c76", "#471a74", "#451871", "#44176f", "#42156c", "#41146a", "#3f1268", "#3e1165", "#3c0f63", "#3b0e61", "#390c5e", "#380b5c", "#360959", "#350857", "#330655", "#320552", "#300350", "#2f024d", "#2d004b"], "PuRd": ["#f7f4f9", "#f6f3f9", "#f6f3f8", "#f5f2f8", "#f5f2f8", "#f4f1f7", "#f4f0f7", "#f3f0f7", "#f3eff6", "#f2eff6", "#f2eef6", "#f1edf6", "#f1edf5", "#f0ecf5", "#f0ecf5", "#efebf4", "#efeaf4", "#eeeaf4", "#eee9f3", "#ede9f3", "#ede8f3", "#ece7f2", "#ece7f2", "#ebe6f2", "#ebe6f1", "#eae5f1", "#eae5f1", "#e9e4f1", "#e9e3f0", "#e8e3f0", "#e8e2f0", "#e7e2ef", "#e7e1ef", "#e6e0ee", "#e6deee", "#e5dded", "#e5dcec", "#e4dbec", "#e3d9eb", "#e3d8ea", "#e2d7ea", "#e2d6e9", "#e1d4e8", "#e0d3e8", "#e0d2e7", "#dfd1e6", "#dfcfe6", "#decee5", "#ddcde4", "#ddcce4", "#dccae3", "#dcc9e2", "#dbc8e2", "#dac6e1", "#dac5e0", "#d9c4e0", "#d9c3df", "#d8c1de", "#d7c0de", "#d7bfdd", "#d6bedc", "#d6bcdc", "#d5bbdb", "#d4bada", "#d4b9da", "#d4b8d9", "#d3b6d9", "#d3b5d8", "#d3b4d7", "#d2b3d7", "#d2b2d6", "#d1b1d6", "#d1afd5", "#d1aed4", "#d0add4", "#d0acd3", "#d0abd3", "#cfaad2", "#cfa8d2", "#cfa7d1", "#cea6d0", "#cea5d0", "#cea4cf", "#cda3cf", "#cda1ce", "#cda0cd", "#cc9fcd", "#cc9ecc", "#cc9dcc", "#cb9ccb", "#cb9bca", "#cb99ca", "#ca98c9", "#ca97c9", "#ca96c8", "#c995c7", "#c993c7", "#ca92c6", "#cb90c5", "#cb8fc5", "#cc8ec4", "#cd8cc3", "#cd8bc2", "#ce89c2", "#cf88c1", "#cf86c0", "#d085c0", "#d183bf", "#d282be", "#d280bd", "#d37fbd", "#d47dbc", "#d47cbb", "#d57aba", "#d679ba", "#d677b9", "#d776b8", "#d874b8", "#d873b7", "#d972b6", "#da70b5", "#db6fb5", "#db6db4", "#dc6cb3", "#dd6ab3", "#dd69b2", "#de67b1", "#df66b0", "#df64af", "#df62ae", "#e060ad", "#e05eac", "#e05dab", "#e05ba9", "#e159a8", "#e157a7", "#e155a6", "#e153a5", "#e251a3", "#e24fa2", "#e24da1", "#e24ca0", "#e34a9f", "#e3489e", "#e3469c", "#e3449b", "#e4429a", "#e44099", "#e43e98", "#e43d96", "#e53b95", "#e53994", "#e53793", "#e53592", "#e63390", "#e6318f", "#e62f8e", "#e62d8d", "#e72c8c", "#e72a8a", "#e72989", "#e62887", "#e52786", "#e42684", "#e32682", "#e32581", "#e2247f", "#e1237e", "#e0237c", "#df227a", "#df2179", "#de2177", "#dd2075", "#dc1f74", "#dc1e72", "#db1e71", "#da1d6f", "#d91c6d", "#d81c6c", "#d81b6a", "#d71a68", "#d61967", "#d51965", "#d41863", "#d41762", "#d31760", "#d2165f", "#d1155d", "#d1145b", "#d0145a", "#cf1358", "#ce1256", "#cd1256", "#cb1155", "#c91054", "#c81054", "#c60f53", "#c40f53", "#c30e52", "#c10e51", "#bf0d51", "#bd0c50", "#bc0c50", "#ba0b4f", "#b80b4e", "#b70a4e", "#b50a4d", "#b3094d", "#b2094c", "#b0084b", "#ae074b", "#ad074a", "#ab064a", "#a90649", "#a70548", "#a60548", "#a40447", "#a20347", "#a10346", "#9f0245", "#9d0245", "#9c0144", "#9a0144", "#980043", "#970042", "#950041", "#940040", "#92003f", "#91003d", "#8f003c", "#8d003b", "#8c003a", "#8a0039", "#890038", "#870037", "#860036", "#840034", "#830033", "#810032", "#800031", "#7e0030", "#7d002f", "#7b002e", "#79002d", "#78002b", "#76002a", "#750029", "#730028", "#720027", "#700026", "#6f0025", "#6d0024", "#6c0022", "#6a0021", "#690020", "#67001f"], "Purples": ["#fcfbfd", "#fcfbfd", "#fbfafc", "#fbfafc", "#faf9fc", "#faf9fc", "#faf8fb", "#f9f8fb", "#f9f7fb", "#f8f7fb", "#f8f7fa", "#f8f6fa", "#f7f6fa", "#f7f5fa", "#f6f5f9", "#f6f4f9", "#f5f4f9", "#f5f4f9", "#f5f3f8", "#f4f3f8", "#f4f2f8", "#f3f2f8", "#f3f1f7", "#f3f1f7", "#f2f0f7", "#f2f0f7", "#f1f0f6", "#f1eff6", "#f1eff6", "#f0eef6", "#f0eef5", "#efedf5", "#efedf5", "#eeecf5", "#eeecf4", "#edebf4", "#ecebf4", "#eceaf3", "#ebe9f3", "#eae9f3", "#eae8f2", "#e9e8f2", "#e8e7f2", "#e8e6f2", "#e7e6f1", "#e6e5f1", "#e6e5f1", "#e5e4f0", "#e4e3f0", "#e4e3f0", "#e3e2ef", "#e2e2ef", "#e2e1ef", "#e1e0ee", "#e0e0ee", "#e0dfee", "#dfdfed", "#dedeed", "#dedded", "#ddddec", "#dcdcec", "#dcdcec", "#dbdbec", "#dadaeb", "#dadaeb", "#d9d9ea", "#d8d8ea", "#d7d7e9", "#d6d6e9", "#d5d5e9", "#d4d4e8", "#d3d3e8", "#d2d2e7", "#d1d2e7", "#d0d1e6", "#cfd0e6", "#cecfe5", "#cecee5", "#cdcde4", "#cccce4", "#cbcbe3", "#cacae3", "#c9c9e2", "#c8c8e2", "#c7c8e1", "#c6c7e1", "#c5c6e1", "#c4c5e0", "#c3c4e0", "#c2c3df", "#c1c2df", "#c0c1de", "#bfc0de", "#bebfdd", "#bebedd", "#bdbedc", "#bcbddc", "#bbbbdb", "#babadb", "#b9b9da", "#b8b8d9", "#b7b7d9", "#b6b6d8", "#b5b5d7", "#b4b4d7", "#b3b3d6", "#b2b2d5", "#b1b1d5", "#b0afd4", "#afaed4", "#aeadd3", "#aeacd2", "#adabd2", "#acaad1", "#aba9d0", "#aaa8d0", "#a9a7cf", "#a8a6cf", "#a7a4ce", "#a6a3cd", "#a5a2cd", "#a4a1cc", "#a3a0cb", "#a29fcb", "#a19eca", "#a09dca", "#9f9cc9", "#9e9bc8", "#9e9ac8", "#9d99c7", "#9c98c7", "#9b97c6", "#9a96c6", "#9995c6", "#9894c5", "#9793c5", "#9692c4", "#9591c4", "#9490c3", "#9390c3", "#928fc3", "#918ec2", "#908dc2", "#8f8cc1", "#8e8bc1", "#8e8ac0", "#8d89c0", "#8c88bf", "#8b87bf", "#8a86bf", "#8986be", "#8885be", "#8784bd", "#8683bd", "#8582bc", "#8481bc", "#8380bb", "#827fbb", "#817ebb", "#807dba", "#807cba", "#7f7bb9", "#7e79b8", "#7d78b7", "#7d77b7", "#7c75b6", "#7b74b5", "#7b72b4", "#7a71b4", "#7970b3", "#796eb2", "#786db2", "#776cb1", "#776ab0", "#7669af", "#7567af", "#7566ae", "#7465ad", "#7363ad", "#7262ac", "#7261ab", "#715faa", "#705eaa", "#705ca9", "#6f5ba8", "#6e5aa8", "#6e58a7", "#6d57a6", "#6c55a5", "#6c54a5", "#6b53a4", "#6a51a3", "#6950a3", "#694fa2", "#684da1", "#674ca1", "#674ba0", "#66499f", "#65489f", "#65479e", "#64459e", "#63449d", "#63439c", "#62429c", "#61409b", "#613f9a", "#603e9a", "#5f3c99", "#5e3b98", "#5e3a98", "#5d3897", "#5c3797", "#5c3696", "#5b3495", "#5a3395", "#5a3294", "#593093", "#582f93", "#582e92", "#572c92", "#562b91", "#552a90", "#552890", "#54278f", "#53268f", "#53258e", "#52238d", "#51228d", "#51218c", "#50208c", "#4f1f8b", "#4f1d8b", "#4e1c8a", "#4d1b89", "#4d1a89", "#4c1888", "#4c1788", "#4b1687", "#4a1587", "#4a1486", "#491285", "#481185", "#481084", "#470f84", "#460d83", "#460c83", "#450b82", "#440a82", "#440981", "#430780", "#420680", "#42057f", "#41047f", "#40027e", "#40017e", "#3f007d"], "RdBu": ["#67001f", "#6a011f", "#6d0220", "#700320", "#730421", "#760521", "#790622", "#7c0722", "#7f0823", "#810823", "#840924", "#870a24", "#8a0b25", "#8d0c25", "#900d26", "#930e26", "#960f27", "#991027", "#9c1127", "#9f1228", "#a21328", "#a51429", "#a81529", "#ab162a", "#ae172a", "#b1182b", "#b3192c", "#b41c2d", "#b61f2e", "#b72230", "#b82531", "#ba2832", "#bb2a34", "#bd2d35", "#be3036", "#bf3338", "#c13639", "#c2383a", "#c43b3c", "#c53e3d", "#c6413e", "#c84440", "#c94741", "#cb4942", "#cc4c44", "#ce4f45", "#cf5246", "#d05548", "#d25849", "#d35a4a", "#d55d4c", "#d6604d", "#d7634f", "#d86551", "#da6853", "#db6b55", "#dc6e57", "#dd7059", "#de735c", "#df765e", "#e17860", "#e27b62", "#e37e64", "#e48066", "#e58368", "#e6866a", "#e8896c", "#e98b6e", "#ea8e70", "#eb9172", "#ec9374", "#ee9677", "#ef9979", "#f09c7b", "#f19e7d", "#f2a17f", "#f3a481", "#f4a683", "#f5a886", "#f5aa89", "#f5ac8b", "#f6af8e", "#f6b191", "#f6b394", "#f7b596", "#f7b799", "#f7b99c", "#f8bb9e", "#f8bda1", "#f8bfa4", "#f9c2a7", "#f9c4a9", "#f9c6ac", "#fac8af", "#facab1", "#fbccb4", "#fbceb7", "#fbd0b9", "#fcd3bc", "#fcd5bf", "#fcd7c2", "#fdd9c4", "#fddbc7", "#fddcc9", "#fdddcb", "#fcdecd", "#fcdfcf", "#fce0d0", "#fce2d2", "#fbe3d4", "#fbe4d6", "#fbe5d8", "#fbe6da", "#fae7dc", "#fae8de", "#fae9df", "#faeae1", "#f9ebe3", "#f9ede5", "#f9eee7", "#f9efe9", "#f9f0eb", "#f8f1ed", "#f8f2ef", "#f8f3f0", "#f8f4f2", "#f7f5f4", "#f7f6f6", "#f6f7f7", "#f5f6f7", "#f3f5f6", "#f2f5f6", "#f0f4f6", "#eff3f5", "#edf2f5", "#ecf2f5", "#eaf1f5", "#e9f0f4", "#e7f0f4", "#e6eff4", "#e4eef4", "#e3edf3", "#e1edf3", "#e0ecf3", "#deebf2", "#ddebf2", "#dbeaf2", "#dae9f2", "#d8e9f1", "#d7e8f1", "#d5e7f1", "#d4e6f1", "#d2e6f0", "#d1e5f0", "#cfe4ef", "#cce2ef", "#cae1ee", "#c7e0ed", "#c5dfec", "#c2ddec", "#c0dceb", "#bddbea", "#bbdaea", "#b8d8e9", "#b6d7e8", "#b3d6e8", "#b1d5e7", "#aed3e6", "#acd2e5", "#a9d1e5", "#a7d0e4", "#a5cee3", "#a2cde3", "#a0cce2", "#9dcbe1", "#9bc9e0", "#98c8e0", "#96c7df", "#93c6de", "#90c4dd", "#8dc2dc", "#8ac0db", "#87beda", "#84bcd9", "#81bad8", "#7eb8d7", "#7bb6d6", "#78b4d5", "#75b2d4", "#71b0d3", "#6eaed2", "#6bacd1", "#68abd0", "#65a9cf", "#62a7ce", "#5fa5cd", "#5ca3cb", "#59a1ca", "#569fc9", "#529dc8", "#4f9bc7", "#4c99c6", "#4997c5", "#4695c4", "#4393c3", "#4291c2", "#408fc1", "#3f8ec0", "#3e8cbf", "#3c8abe", "#3b88be", "#3a87bd", "#3885bc", "#3783bb", "#3681ba", "#3480b9", "#337eb8", "#327cb7", "#307ab6", "#2f79b5", "#2e77b5", "#2c75b4", "#2b73b3", "#2a71b2", "#2870b1", "#276eb0", "#266caf", "#246aae", "#2369ad", "#2267ac", "#2065ab", "#1f63a8", "#1e61a5", "#1d5fa2", "#1c5c9f", "#1b5a9c", "#1a5899", "#195696", "#185493", "#175290", "#15508d", "#144e8a", "#134c87", "#124984", "#114781", "#10457e", "#0f437b", "#0e4179", "#0d3f76", "#0c3d73", "#0a3b70", "#09386d", "#08366a", "#073467", "#063264", "#053061"], "RdGy": ["#67001f", "#6a011f", "#6d0220", "#700320", "#730421", "#760521", "#790622", "#7c0722", "#7f0823", "#810823", "#840924", "#870a24", "#8a0b25", "#8d0c25", "#900d26", "#930e26", "#960f27", "#991027", "#9c1127", "#9f1228", "#a21328", "#a51429", "#a81529", "#ab162a", "#ae172a", "#b1182b", "#b3192c", "#b41c2d", "#b61f2e", "#b72230", "#b82531", "#ba2832", "#bb2a34", "#bd2d35", "#be3036", "#bf3338", "#c13639", "#c2383a", "#c43b3c", "#c53e3d", "#c6413e", "#c84440", "#c94741", "#cb4942", "#cc4c44", "#ce4f45", "#cf5246", "#d05548", "#d25849", "#d35a4a", "#d55d4c", "#d6604d", "#d7634f", "#d86551", "#da6853", "#db6b55", "#dc6e57", "#dd7059", "#de735c", "#df765e", "#e17860", "#e27b62", "#e37e64", "#e48066", "#e58368", "#e6866a", "#e8896c", "#e98b6e", "#ea8e70", "#eb9172", "#ec9374", "#ee9677", "#ef9979", "#f09c7b", "#f19e7d", "#f2a17f", "#f3a481", "#f4a683", "#f5a886", "#f5aa89", "#f5ac8b", "#f6af8e", "#f6b191", "#f6b394", "#f7b596", "#f7b799", "#f7b99c", "#f8bb9e", "#f8bda1", "#f8bfa4", "#f9c2a7", "#f9c4a9", "#f9c6ac", "#fac8af", "#facab1", "#fbccb4", "#fbceb7", "#fbd0b9", "#fcd3bc", "#fcd5bf", "#fcd7c2", "#fdd9c4", "#fddbc7", "#fddcc9", "#fddecb", "#fddfce", "#fde1d0", "#fde2d2", "#fde3d4", "#fee5d6", "#fee6d9", "#fee8db", "#fee9dd", "#feebdf", "#feece1", "#feede4", "#feefe6", "#fef0e8", "#fef2ea", "#fef3ec", "#fef4ef", "#fef6f1", "#fff7f3", "#fff9f5", "#fffaf7", "#fffbfa", "#fffdfc", "#fffefe", "#fefefe", "#fdfdfd", "#fcfcfc", "#fbfbfb", "#fafafa", "#f8f8f8", "#f7f7f7", "#f6f6f6", "#f5f5f5", "#f3f3f3", "#f2f2f2", "#f1f1f1", "#f0f0f0", "#efefef", "#ededed", "#ececec", "#ebebeb", "#eaeaea", "#e9e9e9", "#e7e7e7", "#e6e6e6", "#e5e5e5", "#e4e4e4", "#e2e2e2", "#e1e1e1", "#e0e0e0", "#dfdfdf", "#dddddd", "#dcdcdc", "#dadada", "#d9d9d9", "#d7d7d7", "#d6d6d6", "#d4d4d4", "#d3d3d3", "#d1d1d1", "#d0d0d0", "#cecece", "#cdcdcd", "#cbcbcb", "#cacaca", "#c8c8c8", "#c7c7c7", "#c5c5c5", "#c4c4c4", "#c2c2c2", "#c1c1c1", "#bfbfbf", "#bebebe", "#bcbcbc", "#bbbbbb", "#b9b9b9", "#b7b7b7", "#b5b5b5", "#b3b3b3", "#b1b1b1", "#afafaf", "#adadad", "#ababab", "#a9a9a9", "#a7a7a7", "#a5a5a5", "#a3a3a3", "#a1a1a1", "#9f9f9f", "#9d9d9d", "#9b9b9b", "#999999", "#979797", "#959595", "#939393", "#919191", "#8f8f8f", "#8d8d8d", "#8b8b8b", "#898989", "#878787", "#858585", "#828282", "#808080", "#7e7e7e", "#7c7c7c", "#797979", "#777777", "#757575", "#737373", "#707070", "#6e6e6e", "#6c6c6c", "#696969", "#676767", "#656565", "#636363", "#606060", "#5e5e5e", "#5c5c5c", "#5a5a5a", "#575757", "#555555", "#535353", "#505050", "#4e4e4e", "#4c4c4c", "#4a4a4a", "#484848", "#464646", "#444444", "#424242", "#404040", "#3e3e3e", "#3c3c3c", "#3a3a3a", "#383838", "#363636", "#343434", "#323232", "#303030", "#2e2e2e", "#2c2c2c", "#2a2a2a", "#282828", "#262626", "#242424", "#222222", "#202020", "#1e1e1e", "#1c1c1c", "#1a1a1a"], "RdPu": ["#fff7f3", "#fff6f2", "#fff6f2", "#fff5f1", "#fff4f0", "#fff3f0", "#fff3ef", "#fff2ee", "#fef1ed", "#fef1ed", "#fef0ec", "#feefeb", "#feeeeb", "#feeeea", "#feede9", "#feece9", "#feebe8", "#feebe7", "#feeae7", "#fee9e6", "#fee9e5", "#fee8e5", "#fee7e4", "#fee6e3", "#fde6e2", "#fde5e2", "#fde4e1", "#fde4e0", "#fde3e0", "#fde2df", "#fde1de", "#fde1de", "#fde0dd", "#fddfdc", "#fddedb", "#fdddda", "#fdddd9", "#fddcd8", "#fddbd7", "#fddad7", "#fdd9d6", "#fdd8d5", "#fdd7d4", "#fdd7d3", "#fdd6d2", "#fdd5d1", "#fdd4d0", "#fdd3cf", "#fcd2ce", "#fcd1cd", "#fcd1cd", "#fcd0cc", "#fccfcb", "#fcceca", "#fccdc9", "#fcccc8", "#fcccc7", "#fccbc6", "#fccac5", "#fcc9c4", "#fcc8c3", "#fcc7c3", "#fcc6c2", "#fcc6c1", "#fcc5c0", "#fcc4c0", "#fcc2bf", "#fcc1bf", "#fcc0bf", "#fcbfbe", "#fcbebe", "#fcbcbd", "#fbbbbd", "#fbbabd", "#fbb9bc", "#fbb8bc", "#fbb6bc", "#fbb5bb", "#fbb4bb", "#fbb3bb", "#fbb2ba", "#fbb0ba", "#fbafba", "#fbaeb9", "#fbadb9", "#fbacb9", "#fbaab8", "#fba9b8", "#faa8b8", "#faa7b7", "#faa6b7", "#faa5b7", "#faa3b6", "#faa2b6", "#faa1b6", "#faa0b5", "#fa9eb5", "#fa9db4", "#fa9bb4", "#fa99b3", "#fa97b2", "#f996b2", "#f994b1", "#f992b0", "#f991b0", "#f98faf", "#f98dae", "#f98bae", "#f98aad", "#f988ad", "#f986ac", "#f984ab", "#f883ab", "#f881aa", "#f87fa9", "#f87ea9", "#f87ca8", "#f87aa8", "#f878a7", "#f877a6", "#f875a6", "#f873a5", "#f871a4", "#f770a4", "#f76ea3", "#f76ca3", "#f76ba2", "#f769a1", "#f767a1", "#f666a1", "#f564a0", "#f462a0", "#f361a0", "#f35f9f", "#f25d9f", "#f15c9f", "#f05a9e", "#ef599e", "#ee579e", "#ee559d", "#ed549d", "#ec529d", "#eb509c", "#ea4f9c", "#ea4d9c", "#e94b9c", "#e84a9b", "#e7489b", "#e6479b", "#e5459a", "#e5439a", "#e4429a", "#e34099", "#e23e99", "#e13d99", "#e13b98", "#e03a98", "#df3898", "#de3697", "#dd3597", "#dc3397", "#db3196", "#d93095", "#d82e94", "#d62d93", "#d52b93", "#d32992", "#d22891", "#d02690", "#cf258f", "#cd238f", "#cc218e", "#ca208d", "#c91e8c", "#c71d8c", "#c61b8b", "#c4198a", "#c31889", "#c21688", "#c01588", "#bf1387", "#bd1186", "#bc1085", "#ba0e84", "#b90d84", "#b70b83", "#b60982", "#b40881", "#b30681", "#b10580", "#b0037f", "#ae017e", "#ad017e", "#ab017e", "#aa017d", "#a8017d", "#a6017d", "#a5017d", "#a3017d", "#a1017c", "#a0017c", "#9e017c", "#9c017c", "#9b017b", "#99017b", "#98017b", "#96017b", "#94017b", "#93017a", "#91017a", "#8f017a", "#8e017a", "#8c0179", "#8b0179", "#890179", "#870179", "#860179", "#840178", "#820178", "#810178", "#7f0178", "#7d0177", "#7c0177", "#7a0177", "#790177", "#770176", "#760176", "#740175", "#730175", "#710175", "#6f0174", "#6e0174", "#6c0173", "#6b0173", "#690173", "#680172", "#660172", "#650171", "#630171", "#620171", "#600070", "#5f0070", "#5d006f", "#5b006f", "#5a006e", "#58006e", "#57006e", "#55006d", "#54006d", "#52006c", "#51006c", "#4f006c", "#4e006b", "#4c006b", "#4b006a", "#49006a"], "RdYlBu": ["#a50026", "#a70226", "#a90426", "#ab0626", "#ad0826", "#af0926", "#b10b26", "#b30d26", "#b50f26", "#b71126", "#b91326", "#bb1526", "#bd1726", "#be1827", "#c01a27", "#c21c27", "#c41e27", "#c62027", "#c82227", "#ca2427", "#cc2627", "#ce2827", "#d02927", "#d22b27", "#d42d27", "#d62f27", "#d83128", "#d93429", "#da362a", "#db382b", "#dc3b2c", "#dd3d2d", "#de402e", "#e0422f", "#e14430", "#e24731", "#e34933", "#e44c34", "#e54e35", "#e65036", "#e75337", "#e95538", "#ea5739", "#eb5a3a", "#ec5c3b", "#ed5f3c", "#ee613e", "#ef633f", "#f16640", "#f26841", "#f36b42", "#f46d43", "#f47044", "#f57245", "#f57547", "#f57748", "#f67a49", "#f67c4a", "#f67f4b", "#f7814c", "#f7844e", "#f8864f", "#f88950", "#f88c51", "#f98e52", "#f99153", "#f99355", "#fa9656", "#fa9857", "#fa9b58", "#fb9d59", "#fba05b", "#fba35c", "#fca55d", "#fca85e", "#fcaa5f", "#fdad60", "#fdaf62", "#fdb164", "#fdb366", "#fdb567", "#fdb769", "#fdb96b", "#fdbb6d", "#fdbd6f", "#fdbf71", "#fdc173", "#fdc374", "#fdc576", "#fdc778", "#fec87a", "#feca7c", "#fecc7e", "#fece7f", "#fed081", "#fed283", "#fed485", "#fed687", "#fed889", "#feda8a", "#fedc8c", "#fede8e", "#fee090", "#fee192", "#fee294", "#fee496", "#fee597", "#fee699", "#fee79b", "#fee99d", "#feea9f", "#feeba1", "#feeca2", "#feeda4", "#feefa6", "#fff0a8", "#fff1aa", "#fff2ac", "#fff3ad", "#fff5af", "#fff6b1", "#fff7b3", "#fff8b5", "#fffab7", "#fffbb9", "#fffcba", "#fffdbc", "#fffebe", "#feffc0", "#fdfec2", "#fcfec5", "#fbfdc7", "#fafdc9", "#f8fccb", "#f7fcce", "#f6fbd0", "#f5fbd2", "#f3fbd4", "#f2fad6", "#f1fad9", "#f0f9db", "#eff9dd", "#edf8df", "#ecf8e2", "#ebf7e4", "#eaf7e6", "#e9f6e8", "#e7f6eb", "#e6f5ed", "#e5f5ef", "#e4f4f1", "#e2f4f4", "#e1f3f6", "#e0f3f8", "#def2f7", "#dcf1f7", "#daf0f6", "#d8eff6", "#d6eef5", "#d4edf4", "#d1ecf4", "#cfebf3", "#cdeaf3", "#cbe9f2", "#c9e8f2", "#c7e7f1", "#c5e6f0", "#c3e5f0", "#c1e4ef", "#bfe3ef", "#bde2ee", "#bbe1ed", "#b9e0ed", "#b6dfec", "#b4deec", "#b2ddeb", "#b0dcea", "#aedbea", "#acdae9", "#aad8e9", "#a8d6e8", "#a6d5e7", "#a3d3e6", "#a1d1e5", "#9fd0e4", "#9dcee3", "#9bcce2", "#99cae1", "#97c9e0", "#94c7df", "#92c5de", "#90c3dd", "#8ec2dc", "#8cc0db", "#8abeda", "#87bdd9", "#85bbd9", "#83b9d8", "#81b7d7", "#7fb6d6", "#7db4d5", "#7ab2d4", "#78b0d3", "#76afd2", "#74add1", "#72abd0", "#70a9cf", "#6ea6ce", "#6da4cc", "#6ba2cb", "#69a0ca", "#679ec9", "#659bc8", "#6399c7", "#6297c6", "#6095c4", "#5e93c3", "#5c90c2", "#5a8ec1", "#588cc0", "#578abf", "#5588be", "#5385bd", "#5183bb", "#4f81ba", "#4d7fb9", "#4b7db8", "#4a7ab7", "#4878b6", "#4676b5", "#4574b3", "#4471b2", "#436fb1", "#426cb0", "#416aaf", "#4167ad", "#4065ac", "#3f62ab", "#3e60aa", "#3e5ea8", "#3d5ba7", "#3c59a6", "#3b56a5", "#3a54a4", "#3a51a2", "#394fa1", "#384ca0", "#374a9f", "#36479e", "#36459c", "#35429b", "#34409a", "#333d99", "#333b97", "#323896", "#313695"], "RdYlGn": ["#a50026", "#a70226", "#a90426", "#ab0626", "#ad0826", "#af0926", "#b10b26", "#b30d26", "#b50f26", "#b71126", "#b91326", "#bb1526", "#bd1726", "#be1827", "#c01a27", "#c21c27", "#c41e27", "#c62027", "#c82227", "#ca2427", "#cc2627", "#ce2827", "#d02927", "#d22b27", "#d42d27", "#d62f27", "#d83128", "#d93429", "#da362a", "#db382b", "#dc3b2c", "#dd3d2d", "#de402e", "#e0422f", "#e14430", "#e24731", "#e34933", "#e44c34", "#e54e35", "#e65036", "#e75337", "#e95538", "#ea5739", "#eb5a3a", "#ec5c3b", "#ed5f3c", "#ee613e", "#ef633f", "#f16640", "#f26841", "#f36b42", "#f46d43", "#f47044", "#f57245", "#f57547", "#f57748", "#f67a49", "#f67c4a", "#f67f4b", "#f7814c", "#f7844e", "#f8864f", "#f88950", "#f88c51", "#f98e52", "#f99153", "#f99355", "#fa9656", "#fa9857", "#fa9b58", "#fb9d59", "#fba05b", "#fba35c", "#fca55d", "#fca85e", "#fcaa5f", "#fdad60", "#fdaf62", "#fdb163", "#fdb365", "#fdb567", "#fdb768", "#fdb96a", "#fdbb6c", "#fdbd6d", "#fdbf6f", "#fdc171", "#fdc372", "#fdc574", "#fdc776", "#fec877", "#feca79", "#fecc7b", "#fece7c", "#fed07e", "#fed27f", "#fed481", "#fed683", "#fed884", "#feda86", "#fedc88", "#fede89", "#fee08b", "#fee18d", "#fee28f", "#fee491", "#fee593", "#fee695", "#fee797", "#fee999", "#feea9b", "#feeb9d", "#feec9f", "#feeda1", "#feefa3", "#fff0a6", "#fff1a8", "#fff2aa", "#fff3ac", "#fff5ae", "#fff6b0", "#fff7b2", "#fff8b4", "#fffab6", "#fffbb8", "#fffcba", "#fffdbc", "#fffebe", "#feffbe", "#fdfebc", "#fbfdba", "#fafdb8", "#f8fcb6", "#f7fcb4", "#f5fbb2", "#f4fab0", "#f2faae", "#f1f9ac", "#eff8aa", "#eef8a8", "#ecf7a6", "#ebf7a3", "#e9f6a1", "#e8f59f", "#e6f59d", "#e5f49b", "#e3f399", "#e2f397", "#e0f295", "#dff293", "#ddf191", "#dcf08f", "#daf08d", "#d9ef8b", "#d7ee8a", "#d5ed88", "#d3ec87", "#d1ec86", "#cfeb85", "#cdea83", "#cbe982", "#c9e881", "#c7e77f", "#c5e67e", "#c3e67d", "#c1e57b", "#bfe47a", "#bde379", "#bbe278", "#b9e176", "#b7e075", "#b5df74", "#b3df72", "#b1de71", "#afdd70", "#addc6f", "#abdb6d", "#a9da6c", "#a7d96b", "#a5d86a", "#a2d76a", "#a0d669", "#9dd569", "#9bd469", "#98d368", "#96d268", "#93d168", "#91d068", "#8ecf67", "#8ccd67", "#89cc67", "#87cb67", "#84ca66", "#82c966", "#7fc866", "#7dc765", "#7ac665", "#78c565", "#75c465", "#73c264", "#70c164", "#6ec064", "#6bbf64", "#69be63", "#66bd63", "#63bc62", "#60ba62", "#5db961", "#5ab760", "#57b65f", "#54b45f", "#51b35e", "#4eb15d", "#4bb05c", "#48ae5c", "#45ad5b", "#42ac5a", "#3faa59", "#3ca959", "#39a758", "#36a657", "#33a456", "#30a356", "#2da155", "#2aa054", "#279f53", "#249d53", "#219c52", "#1e9a51", "#1b9950", "#199750", "#18954f", "#17934e", "#16914d", "#15904c", "#148e4b", "#138c4a", "#128a49", "#118848", "#108647", "#0f8446", "#0e8245", "#0d8044", "#0c7f43", "#0b7d42", "#0a7b41", "#097940", "#08773f", "#07753e", "#06733d", "#05713c", "#04703b", "#036e3a", "#026c39", "#016a38", "#006837"], "Reds": ["#fff5f0", "#fff4ef", "#fff4ee", "#fff3ed", "#fff2ec", "#fff2eb", "#fff1ea", "#fff0e9", "#fff0e8", "#ffefe8", "#ffeee7", "#ffeee6", "#ffede5", "#ffece4", "#ffece3", "#ffebe2", "#feeae1", "#feeae0", "#fee9df", "#fee8de", "#fee8dd", "#fee7dc", "#fee7db", "#fee6da", "#fee5d9", "#fee5d8", "#fee4d8", "#fee3d7", "#fee3d6", "#fee2d5", "#fee1d4", "#fee1d3", "#fee0d2", "#fedfd0", "#fedecf", "#fedccd", "#fedbcc", "#fedaca", "#fed9c9", "#fed8c7", "#fdd7c6", "#fdd5c4", "#fdd4c2", "#fdd3c1", "#fdd2bf", "#fdd1be", "#fdd0bc", "#fdcebb", "#fdcdb9", "#fdccb8", "#fdcbb6", "#fdcab5", "#fdc9b3", "#fdc7b2", "#fdc6b0", "#fdc5ae", "#fcc4ad", "#fcc3ab", "#fcc2aa", "#fcc1a8", "#fcbfa7", "#fcbea5", "#fcbda4", "#fcbca2", "#fcbba1", "#fcb99f", "#fcb89e", "#fcb79c", "#fcb69b", "#fcb499", "#fcb398", "#fcb296", "#fcb095", "#fcaf93", "#fcae92", "#fcad90", "#fcab8f", "#fcaa8d", "#fca98c", "#fca78b", "#fca689", "#fca588", "#fca486", "#fca285", "#fca183", "#fca082", "#fc9e80", "#fc9d7f", "#fc9c7d", "#fc9b7c", "#fc997a", "#fc9879", "#fc9777", "#fc9576", "#fc9474", "#fc9373", "#fc9272", "#fc9070", "#fc8f6f", "#fc8e6e", "#fc8d6d", "#fc8b6b", "#fc8a6a", "#fc8969", "#fc8767", "#fc8666", "#fc8565", "#fc8464", "#fc8262", "#fc8161", "#fc8060", "#fc7f5f", "#fb7d5d", "#fb7c5c", "#fb7b5b", "#fb7a5a", "#fb7858", "#fb7757", "#fb7656", "#fb7555", "#fb7353", "#fb7252", "#fb7151", "#fb7050", "#fb6e4e", "#fb6d4d", "#fb6c4c", "#fb6b4b", "#fb694a", "#fa6849", "#fa6648", "#fa6547", "#f96346", "#f96245", "#f96044", "#f85f43", "#f85d42", "#f75c41", "#f75b40", "#f7593f", "#f6583e", "#f6563d", "#f6553c", "#f5533b", "#f5523a", "#f4503a", "#f44f39", "#f44d38", "#f34c37", "#f34a36", "#f34935", "#f24734", "#f24633", "#f14432", "#f14331", "#f14130", "#f0402f", "#f03f2e", "#f03d2d", "#ef3c2c", "#ee3a2c", "#ed392b", "#ec382b", "#eb372a", "#ea362a", "#e93529", "#e83429", "#e63328", "#e53228", "#e43027", "#e32f27", "#e22e27", "#e12d26", "#e02c26", "#de2b25", "#dd2a25", "#dc2924", "#db2824", "#da2723", "#d92523", "#d82422", "#d72322", "#d52221", "#d42121", "#d32020", "#d21f20", "#d11e1f", "#d01d1f", "#cf1c1f", "#ce1a1e", "#cc191e", "#cb181d", "#ca181d", "#c9181d", "#c8171c", "#c7171c", "#c5171c", "#c4161c", "#c3161b", "#c2161b", "#c1161b", "#bf151b", "#be151a", "#bd151a", "#bc141a", "#bb141a", "#b91419", "#b81419", "#b71319", "#b61319", "#b51318", "#b31218", "#b21218", "#b11218", "#b01217", "#af1117", "#ad1117", "#ac1117", "#ab1016", "#aa1016", "#a91016", "#a81016", "#a60f15", "#a50f15", "#a30f15", "#a10e15", "#9f0e14", "#9d0d14", "#9c0d14", "#9a0c14", "#980c13", "#960b13", "#940b13", "#920a13", "#900a12", "#8e0912", "#8c0912", "#8a0812", "#880811", "#860811", "#840711", "#820711", "#800610", "#7e0610", "#7c0510", "#7a0510", "#79040f", "#77040f", "#75030f", "#73030f", "#71020e", "#6f020e", "#6d010e", "#6b010e", "#69000d", "#67000d"], "Set1": ["#e41a1c", "#df1d21", "#d92026", "#d4232b", "#ce2730", "#c92a34", "#c32d39", "#be303e", "#b93343", "#b33648", "#ae394d", "#a83d52", "#a34057", "#9d435c", "#984661", "#934965", "#8d4c6a", "#884f6f", "#825274", "#7d5679", "#77597e", "#725c83", "#6d5f88", "#67628d", "#626591", "#5c6896", "#576c9b", "#516fa0", "#4c72a5", "#4775aa", "#4178af", "#3c7bb4", "#377eb8", "#3880b4", "#3881b1", "#3983ad", "#3a84aa", "#3b86a6", "#3b87a3", "#3c899f", "#3d8a9c", "#3d8c99", "#3e8e95", "#3f8f92", "#3f918e", "#40928b", "#419487", "#419584", "#429780", "#43987d", "#449a79", "#449b76", "#459d73", "#469e6f", "#46a06c", "#47a268", "#48a365", "#48a561", "#49a65e", "#4aa85a", "#4aa957", "#4bab53", "#4cac50", "#4cae4d", "#4eae4b", "#50ab4d", "#52a850", "#55a553", "#57a256", "#599f59", "#5c9c5b", "#5e995e", "#609661", "#639364", "#659067", "#678d69", "#6a8a6c", "#6c876f", "#6f8472", "#718175", "#737e77", "#767b7a", "#78777d", "#7a7480", "#7d7183", "#7f6e85", "#816b88", "#84688b", "#86658e", "#886291", "#8b5f93", "#8d5c96", "#8f5999", "#92569c", "#94539e", "#9750a1", "#994fa1", "#9c509c", "#a05297", "#a35392", "#a6558d", "#a95688", "#ad5882", "#b0597d", "#b35b78", "#b65c73", "#ba5e6e", "#bd5f69", "#c06164", "#c3635f", "#c66459", "#ca6654", "#cd674f", "#d0694a", "#d36a45", "#d76c40", "#da6d3b", "#dd6f36", "#e07031", "#e4722b", "#e77326", "#ea7521", "#ed771c", "#f07817", "#f47a12", "#f77b0d", "#fa7d08", "#fd7e03", "#ff8101", "#ff8502", "#ff8904", "#ff8d06", "#ff9107", "#ff9509", "#ff990a", "#ff9d0c", "#ffa10e", "#ffa50f", "#ffa911", "#ffad12", "#ffb114", "#ffb516", "#ffb917", "#ffbd19", "#ffc11a", "#ffc51c", "#ffc91e", "#ffcd1f", "#ffd121", "#ffd522", "#ffd924", "#ffdd26", "#ffe127", "#ffe529", "#ffe92a", "#ffed2c", "#fff12e", "#fff52f", "#fff931", "#fffd32", "#fdfc33", "#faf632", "#f8f132", "#f5ec32", "#f2e631", "#efe131", "#eddc31", "#ead730", "#e7d130", "#e4cc30", "#e1c72f", "#dfc12f", "#dcbc2f", "#d9b72e", "#d6b12e", "#d3ac2e", "#d1a72d", "#cea22d", "#cb9c2d", "#c8972c", "#c5922c", "#c38c2c", "#c0872b", "#bd822b", "#ba7c2b", "#b7772a", "#b5722a", "#b26d29", "#af6729", "#ac6229", "#a95d28", "#a75728", "#a8572c", "#aa5830", "#ad5a35", "#b05b3a", "#b25c3f", "#b55e43", "#b75f48", "#ba604d", "#bc6251", "#bf6356", "#c1655b", "#c46660", "#c66764", "#c96969", "#cb6a6e", "#ce6b73", "#d16d77", "#d36e7c", "#d66f81", "#d87186", "#db728a", "#dd738f", "#e07594", "#e27699", "#e5779d", "#e779a2", "#ea7aa7", "#ed7bab", "#ef7db0", "#f27eb5", "#f47fba", "#f781be", "#f482be", "#f182bd", "#ef83bc", "#ec84ba", "#e985b9", "#e685b8", "#e386b7", "#e087b6", "#dd88b4", "#da88b3", "#d789b2", "#d48ab1", "#d18bb0", "#ce8bae", "#cb8cad", "#c88dac", "#c58eab", "#c28eaa", "#bf8fa8", "#bc90a7", "#b991a6", "#b691a5", "#b492a4", "#b193a3", "#ae94a1", "#ab94a0", "#a8959f", "#a5969e", "#a2979d", "#9f979b", "#9c989a", "#999999"], "Set2": ["#66c2a5", "#6ac1a3", "#6ebfa1", "#72be9f", "#76bc9e", "#7bbb9c", "#7fb99a", "#83b898", "#87b696", "#8bb594", "#8fb393", "#93b291", "#97b18f", "#9caf8d", "#a0ae8b", "#a4ac89", "#a8ab88", "#aca986", "#b0a884", "#b4a682", "#b8a580", "#bca37e", "#c1a27d", "#c5a17b", "#c99f79", "#cd9e77", "#d19c75", "#d59b73", "#d99972", "#dd9870", "#e2966e", "#e6956c", "#ea936a", "#ee9268", "#f29166", "#f68f65", "#fa8e63", "#fa8d64", "#f78e67", "#f48e69", "#f18f6c", "#ee8f6f", "#eb9072", "#e89075", "#e59178", "#e2917b", "#df927e", "#dc9380", "#d99383", "#d69486", "#d39489", "#d0958c", "#cd958f", "#ca9692", "#c69695", "#c39798", "#c0979a", "#bd989d", "#ba98a0", "#b799a3", "#b499a6", "#b19aa9", "#ae9aac", "#ab9baf", "#a89bb1", "#a59cb4", "#a29cb7", "#9f9dba", "#9c9dbd", "#999ec0", "#969fc3", "#939fc6", "#90a0c9", "#8da0cb", "#909fcb", "#929fcb", "#959eca", "#979dca", "#9a9dca", "#9c9cca", "#9f9cc9", "#a19bc9", "#a49ac9", "#a69ac9", "#a999c9", "#ab99c8", "#ad98c8", "#b097c8", "#b297c8", "#b596c7", "#b796c7", "#ba95c7", "#bc94c7", "#bf94c7", "#c193c6", "#c493c6", "#c692c6", "#c991c6", "#cb91c5", "#ce90c5", "#d090c5", "#d38fc5", "#d58ec5", "#d78ec4", "#da8dc4", "#dc8dc4", "#df8cc4", "#e18bc4", "#e48bc3", "#e68ac3", "#e68cc1", "#e48ebe", "#e290bb", "#e092b8", "#df94b5", "#dd96b2", "#db98af", "#d99bab", "#d79da8", "#d69fa5", "#d4a1a2", "#d2a39f", "#d0a59c", "#cfa799", "#cdaa96", "#cbac93", "#c9ae90", "#c7b08d", "#c6b28a", "#c4b487", "#c2b684", "#c0b881", "#bebb7e", "#bdbd7b", "#bbbf78", "#b9c175", "#b7c372", "#b6c56f", "#b4c76c", "#b2ca68", "#b0cc65", "#aece62", "#add05f", "#abd25c", "#a9d459", "#a7d656", "#a7d854", "#a9d853", "#acd852", "#aed851", "#b0d850", "#b3d84f", "#b5d84e", "#b8d84d", "#bad84c", "#bdd84b", "#bfd84a", "#c2d849", "#c4d848", "#c6d847", "#c9d845", "#cbd844", "#ced843", "#d0d842", "#d3d941", "#d5d940", "#d8d93f", "#dad93e", "#dcd93d", "#dfd93c", "#e1d93b", "#e4d93a", "#e6d939", "#e9d938", "#ebd937", "#eed936", "#f0d935", "#f2d934", "#f5d933", "#f7d932", "#fad931", "#fcd930", "#ffd92f", "#fed931", "#fed834", "#fdd737", "#fcd73a", "#fcd63c", "#fbd63f", "#fad542", "#f9d445", "#f9d448", "#f8d34a", "#f7d34d", "#f7d250", "#f6d253", "#f5d155", "#f4d058", "#f4d05b", "#f3cf5e", "#f2cf61", "#f2ce63", "#f1ce66", "#f0cd69", "#efcc6c", "#efcc6e", "#eecb71", "#edcb74", "#edca77", "#ecca79", "#ebc97c", "#eac87f", "#eac882", "#e9c785", "#e8c787", "#e8c68a", "#e7c58d", "#e6c590", "#e5c492", "#e4c494", "#e3c395", "#e2c396", "#e0c297", "#dfc298", "#dec199", "#dcc199", "#dbc19a", "#d9c09b", "#d8c09c", "#d7bf9d", "#d5bf9e", "#d4be9f", "#d3be9f", "#d1bda0", "#d0bda1", "#cebca2", "#cdbca3", "#ccbba4", "#cabba5", "#c9baa5", "#c8baa6", "#c6baa7", "#c5b9a8", "#c3b9a9", "#c2b8aa", "#c1b8aa", "#bfb7ab", "#beb7ac", "#bdb6ad", "#bbb6ae", "#bab5af", "#b8b5b0", "#b7b4b0", "#b6b4b1", "#b4b3b2", "#b3b3b3"], "Set3": ["#8dd3c7", "#92d5c6", "#97d7c5", "#9cd9c4", "#a1dbc4", "#a6dcc3", "#abdec2", "#afe0c1", "#b4e2c0", "#b9e4bf", "#bee6be", "#c3e8be", "#c8eabd", "#cdecbc", "#d2eebb", "#d7efba", "#dcf1b9", "#e1f3b8", "#e6f5b7", "#eaf7b7", "#eff9b6", "#f4fbb5", "#f9fdb4", "#feffb3", "#fdfdb4", "#fafab6", "#f7f7b8", "#f4f4b9", "#f1f1bb", "#efeebd", "#ecebbe", "#e9e8c0", "#e6e5c2", "#e3e2c4", "#e1dfc5", "#dedcc7", "#dbd9c9", "#d8d6ca", "#d5d3cc", "#d3d0ce", "#d0cdcf", "#cdcad1", "#cac7d3", "#c7c4d4", "#c5c1d6", "#c2bed8", "#bfbbd9", "#c0b8d7", "#c2b6d3", "#c5b3ce", "#c8b1ca", "#caaec5", "#cdacc1", "#cfa9bc", "#d2a7b8", "#d5a4b3", "#d7a2af", "#da9faa", "#dd9da6", "#df9aa1", "#e2989d", "#e59598", "#e79394", "#ea908f", "#ec8e8b", "#ef8b86", "#f28982", "#f4867d", "#f78479", "#fa8174", "#f98174", "#f38378", "#ee857c", "#e98780", "#e38985", "#de8c89", "#d98e8d", "#d39091", "#ce9295", "#c9949a", "#c4969e", "#be98a2", "#b99aa6", "#b49caa", "#ae9fae", "#a9a1b3", "#a4a3b7", "#9ea5bb", "#99a7bf", "#94a9c3", "#8eabc8", "#89adcc", "#84afd0", "#81b1d2", "#87b1cd", "#8cb1c8", "#92b1c3", "#97b2be", "#9cb2b9", "#a2b2b4", "#a7b2b0", "#adb2ab", "#b2b2a6", "#b7b2a1", "#bdb29c", "#c2b397", "#c8b392", "#cdb38d", "#d2b389", "#d8b384", "#ddb37f", "#e3b37a", "#e8b375", "#edb470", "#f3b46b", "#f8b466", "#fdb462", "#fab662", "#f6b863", "#f3ba63", "#f0bb63", "#edbd64", "#eabf64", "#e6c164", "#e3c364", "#e0c465", "#ddc665", "#dac865", "#d6ca66", "#d3cc66", "#d0ce66", "#cdcf67", "#cad167", "#c6d367", "#c3d567", "#c0d768", "#bdd868", "#bada68", "#b6dc69", "#b3de69", "#b6dd6e", "#b9dd73", "#bcdc79", "#bfdb7e", "#c2da83", "#c6da89", "#c9d98e", "#ccd893", "#cfd799", "#d2d79e", "#d5d6a3", "#d9d5a9", "#dcd5ae", "#dfd4b3", "#e2d3b9", "#e5d2be", "#e8d2c3", "#ebd1c9", "#efd0ce", "#f2cfd3", "#f5cfd9", "#f8cede", "#fbcde4", "#fbcde5", "#f9cee4", "#f8cee4", "#f6cfe3", "#f5cfe3", "#f3d0e2", "#f2d0e2", "#f0d1e1", "#efd2e0", "#edd2e0", "#ecd3df", "#ead3df", "#e9d4de", "#e7d4de", "#e6d5dd", "#e4d5dd", "#e3d6dc", "#e1d6dc", "#e0d7db", "#ded7db", "#ddd8da", "#dbd8da", "#dad9d9", "#d8d7d8", "#d7d3d7", "#d6cfd6", "#d5cbd5", "#d3c8d4", "#d2c4d2", "#d1c0d1", "#d0bcd0", "#ceb8cf", "#cdb4cd", "#ccb1cc", "#cbadcb", "#c9a9ca", "#c8a5c9", "#c7a1c7", "#c69dc6", "#c499c5", "#c396c4", "#c292c3", "#c18ec1", "#bf8ac0", "#be86bf", "#bd82be", "#bc82bd", "#bd86bd", "#be8bbe", "#be90be", "#bf94bf", "#c099bf", "#c09dbf", "#c1a2c0", "#c2a7c0", "#c2abc0", "#c3b0c1", "#c4b4c1", "#c5b9c1", "#c5bec2", "#c6c2c2", "#c7c7c2", "#c7ccc3", "#c8d0c3", "#c9d5c3", "#c9d9c4", "#cadec4", "#cbe3c4", "#cbe7c5", "#ccebc4", "#cfebc1", "#d1ebbd", "#d3ebb9", "#d5ebb5", "#d7ebb2", "#daecae", "#dcecaa", "#deeca7", "#e0eca3", "#e2ec9f", "#e5ec9c", "#e7ec98", "#e9ec94", "#ebec90", "#edec8d", "#f0ec89", "#f2ec85", "#f4ed82", "#f6ed7e", "#f8ed7a", "#fbed76", "#fded73", "#ffed6f"], "Spectral": ["#9e0142", "#a00343", "#a20643", "#a40844", "#a70b44", "#a90d45", "#ab0f45", "#ad1246", "#af1446", "#b11747", "#b41947", "#b61b48", "#b81e48", "#ba2049", "#bc2249", "#be254a", "#c1274a", "#c32a4b", "#c52c4b", "#c72e4c", "#c9314c", "#cb334d", "#cd364d", "#d0384e", "#d23a4e", "#d43d4f", "#d63f4f", "#d7414e", "#d8434e", "#d9444d", "#da464d", "#dc484c", "#dd4a4c", "#de4c4b", "#df4e4b", "#e1504b", "#e2514a", "#e3534a", "#e45549", "#e55749", "#e75948", "#e85b48", "#e95c47", "#ea5e47", "#eb6046", "#ed6246", "#ee6445", "#ef6645", "#f06744", "#f26944", "#f36b43", "#f46d43", "#f47044", "#f57245", "#f57547", "#f57748", "#f67a49", "#f67c4a", "#f67f4b", "#f7814c", "#f7844e", "#f8864f", "#f88950", "#f88c51", "#f98e52", "#f99153", "#f99355", "#fa9656", "#fa9857", "#fa9b58", "#fb9d59", "#fba05b", "#fba35c", "#fca55d", "#fca85e", "#fcaa5f", "#fdad60", "#fdaf62", "#fdb163", "#fdb365", "#fdb567", "#fdb768", "#fdb96a", "#fdbb6c", "#fdbd6d", "#fdbf6f", "#fdc171", "#fdc372", "#fdc574", "#fdc776", "#fec877", "#feca79", "#fecc7b", "#fece7c", "#fed07e", "#fed27f", "#fed481", "#fed683", "#fed884", "#feda86", "#fedc88", "#fede89", "#fee08b", "#fee18d", "#fee28f", "#fee491", "#fee593", "#fee695", "#fee797", "#fee999", "#feea9b", "#feeb9d", "#feec9f", "#feeda1", "#feefa3", "#fff0a6", "#fff1a8", "#fff2aa", "#fff3ac", "#fff5ae", "#fff6b0", "#fff7b2", "#fff8b4", "#fffab6", "#fffbb8", "#fffcba", "#fffdbc", "#fffebe", "#ffffbe", "#fefebd", "#fdfebb", "#fcfeba", "#fbfdb8", "#fafdb7", "#f9fcb5", "#f8fcb4", "#f7fcb2", "#f6fbb0", "#f5fbaf", "#f4faad", "#f3faac", "#f2faaa", "#f1f9a9", "#f0f9a7", "#eff9a6", "#eef8a4", "#edf8a3", "#ecf7a1", "#ebf7a0", "#eaf79e", "#e9f69d", "#e8f69b", "#e7f59a", "#e6f598", "#e4f498", "#e1f399", "#dff299", "#ddf19a", "#daf09a", "#d8ef9b", "#d6ee9b", "#d3ed9c", "#d1ed9c", "#cfec9d", "#cdeb9d", "#caea9e", "#c8e99e", "#c6e89f", "#c3e79f", "#c1e6a0", "#bfe5a0", "#bce4a0", "#bae3a1", "#b8e2a1", "#b5e1a2", "#b3e0a2", "#b1dfa3", "#aedea3", "#acdda4", "#aadca4", "#a7dba4", "#a4daa4", "#a2d9a4", "#9fd8a4", "#9cd7a4", "#99d6a4", "#97d5a4", "#94d4a4", "#91d3a4", "#8fd2a4", "#8cd1a4", "#89d0a4", "#86cfa5", "#84cea5", "#81cda5", "#7ecca5", "#7ccaa5", "#79c9a5", "#76c8a5", "#74c7a5", "#71c6a5", "#6ec5a5", "#6bc4a5", "#69c3a5", "#66c2a5", "#64c0a6", "#62bda7", "#60bba8", "#5eb9a9", "#5cb7aa", "#5ab4ab", "#58b2ac", "#56b0ad", "#54aead", "#52abae", "#50a9af", "#4ea7b0", "#4ba4b1", "#49a2b2", "#47a0b3", "#459eb4", "#439bb5", "#4199b6", "#3f97b7", "#3d95b8", "#3b92b9", "#3990ba", "#378ebb", "#358bbc", "#3389bd", "#3387bc", "#3585bb", "#3682ba", "#3880b9", "#3a7eb8", "#3b7cb7", "#3d79b6", "#3f77b5", "#4175b4", "#4273b3", "#4471b2", "#466eb1", "#486cb0", "#496aaf", "#4b68ae", "#4d65ad", "#4e63ac", "#5061aa", "#525fa9", "#545ca8", "#555aa7", "#5758a6", "#5956a5", "#5b53a4", "#5c51a3", "#5e4fa2"], "YlGn": ["#ffffe5", "#ffffe4", "#feffe2", "#feffe1", "#feffdf", "#feffde", "#fdfedd", "#fdfedb", "#fdfeda", "#fdfed9", "#fcfed7", "#fcfed6", "#fcfed4", "#fcfed3", "#fbfed2", "#fbfed0", "#fbfdcf", "#fbfdce", "#fafdcc", "#fafdcb", "#fafdc9", "#fafdc8", "#f9fdc7", "#f9fdc5", "#f9fdc4", "#f9fdc2", "#f8fdc1", "#f8fcc0", "#f8fcbe", "#f8fcbd", "#f7fcbc", "#f7fcba", "#f7fcb9", "#f6fcb8", "#f5fbb8", "#f4fbb7", "#f3fab6", "#f2fab5", "#f1fab5", "#f0f9b4", "#eff9b3", "#eef9b3", "#edf8b2", "#edf8b1", "#ecf7b1", "#ebf7b0", "#eaf7af", "#e9f6af", "#e8f6ae", "#e7f6ad", "#e6f5ac", "#e5f5ac", "#e4f4ab", "#e3f4aa", "#e2f4aa", "#e1f3a9", "#e0f3a8", "#dff3a8", "#def2a7", "#ddf2a6", "#ddf1a6", "#dcf1a5", "#dbf1a4", "#daf0a4", "#d9f0a3", "#d7efa2", "#d6efa2", "#d5eea1", "#d3eda0", "#d2eda0", "#d0ec9f", "#cfec9e", "#ceeb9e", "#ccea9d", "#cbea9c", "#c9e99c", "#c8e99b", "#c7e89a", "#c5e89a", "#c4e799", "#c3e698", "#c1e698", "#c0e597", "#bee596", "#bde496", "#bce395", "#bae394", "#b9e294", "#b8e293", "#b6e192", "#b5e092", "#b3e091", "#b2df90", "#b1df90", "#afde8f", "#aedd8e", "#acdd8e", "#abdc8d", "#a9db8c", "#a7db8c", "#a6da8b", "#a4d98a", "#a2d88a", "#a1d889", "#9fd788", "#9dd688", "#9cd687", "#9ad587", "#98d486", "#97d385", "#95d385", "#93d284", "#92d183", "#90d083", "#8ed082", "#8dcf81", "#8bce81", "#89ce80", "#88cd7f", "#86cc7f", "#84cb7e", "#83cb7d", "#81ca7d", "#7fc97c", "#7ec97b", "#7cc87b", "#7ac77a", "#79c679", "#77c679", "#75c578", "#74c477", "#72c376", "#70c275", "#6fc174", "#6dc073", "#6bc072", "#69bf72", "#68be71", "#66bd70", "#64bc6f", "#62bb6e", "#61bb6d", "#5fba6c", "#5db96b", "#5cb86b", "#5ab76a", "#58b669", "#56b568", "#55b567", "#53b466", "#51b365", "#4fb264", "#4eb163", "#4cb063", "#4ab062", "#49af61", "#47ae60", "#45ad5f", "#43ac5e", "#42ab5d", "#40aa5c", "#3fa95c", "#3fa85b", "#3ea75a", "#3da559", "#3ca458", "#3ba358", "#3aa257", "#39a056", "#389f55", "#379e54", "#369d54", "#359c53", "#349a52", "#339951", "#329850", "#31974f", "#30954f", "#2f944e", "#2f934d", "#2e924c", "#2d914b", "#2c8f4b", "#2b8e4a", "#2a8d49", "#298c48", "#288a47", "#278946", "#268846", "#258745", "#248644", "#238443", "#228343", "#218242", "#208242", "#1f8142", "#1e8041", "#1d7f41", "#1c7e40", "#1a7d40", "#197c40", "#187b3f", "#177b3f", "#167a3f", "#15793e", "#14783e", "#13773d", "#12763d", "#11753d", "#10743c", "#0e743c", "#0d733c", "#0c723b", "#0b713b", "#0a703a", "#096f3a", "#086e3a", "#076d39", "#066d39", "#056c39", "#036b38", "#026a38", "#016937", "#006837", "#006737", "#006636", "#006536", "#006435", "#006335", "#006234", "#006034", "#005f34", "#005e33", "#005d33", "#005c32", "#005b32", "#005a31", "#005931", "#005830", "#005730", "#005530", "#00542f", "#00532f", "#00522e", "#00512e", "#00502d", "#004f2d", "#004e2d", "#004d2c", "#004c2c", "#004a2b", "#00492b", "#00482a", "#00472a", "#004629", "#004529"], "YlGnBu": ["#ffffd9", "#feffd8", "#feffd6", "#fdfed5", "#fdfed4", "#fcfed3", "#fcfed1", "#fbfdd0", "#fafdcf", "#fafdce", "#f9fdcc", "#f9fdcb", "#f8fcca", "#f8fcc9", "#f7fcc7", "#f7fcc6", "#f6fbc5", "#f5fbc4", "#f5fbc2", "#f4fbc1", "#f4fbc0", "#f3fabf", "#f3fabd", "#f2fabc", "#f1fabb", "#f1faba", "#f0f9b8", "#f0f9b7", "#eff9b6", "#eff9b5", "#eef8b3", "#edf8b2", "#edf8b1", "#ecf7b1", "#eaf7b1", "#e9f7b1", "#e8f6b1", "#e7f6b1", "#e6f5b2", "#e5f5b2", "#e3f4b2", "#e2f4b2", "#e1f3b2", "#e0f3b2", "#dff2b2", "#ddf2b2", "#dcf1b2", "#dbf1b2", "#daf0b3", "#d9f0b3", "#d7efb3", "#d6efb3", "#d5efb3", "#d4eeb3", "#d3eeb3", "#d1edb3", "#d0edb3", "#cfecb3", "#ceecb3", "#cdebb4", "#cbebb4", "#caeab4", "#c9eab4", "#c8e9b4", "#c6e9b4", "#c4e8b4", "#c2e7b4", "#c0e6b5", "#bde5b5", "#bbe4b5", "#b9e4b5", "#b7e3b6", "#b4e2b6", "#b2e1b6", "#b0e0b6", "#aedfb6", "#abdeb7", "#a9ddb7", "#a7dcb7", "#a5dcb7", "#a2dbb8", "#a0dab8", "#9ed9b8", "#9cd8b8", "#99d7b8", "#97d6b9", "#95d5b9", "#92d5b9", "#90d4b9", "#8ed3ba", "#8cd2ba", "#89d1ba", "#87d0ba", "#85cfba", "#83cebb", "#80cebb", "#7ecdbb", "#7cccbb", "#7acbbc", "#78cbbc", "#76cabc", "#75c9bd", "#73c8bd", "#71c8bd", "#6fc7bd", "#6dc6be", "#6bc6be", "#69c5be", "#67c4be", "#65c3bf", "#63c3bf", "#61c2bf", "#5fc1c0", "#5dc0c0", "#5bc0c0", "#59bfc0", "#57bec1", "#55bec1", "#53bdc1", "#52bcc2", "#50bbc2", "#4ebbc2", "#4cbac2", "#4ab9c3", "#48b9c3", "#46b8c3", "#44b7c4", "#42b6c4", "#40b5c4", "#3fb4c4", "#3eb3c4", "#3db2c4", "#3cb1c3", "#3bb0c3", "#3aaec3", "#39adc3", "#37acc3", "#36abc3", "#35aac3", "#34a9c3", "#33a7c2", "#32a6c2", "#31a5c2", "#2fa4c2", "#2ea3c2", "#2da2c2", "#2ca1c2", "#2b9fc2", "#2a9ec1", "#299dc1", "#289cc1", "#269bc1", "#259ac1", "#2498c1", "#2397c1", "#2296c1", "#2195c0", "#2094c0", "#1f93c0", "#1d91c0", "#1d90c0", "#1d8ebf", "#1d8dbe", "#1e8bbd", "#1e8abd", "#1e88bc", "#1e86bb", "#1e85ba", "#1e83ba", "#1f82b9", "#1f80b8", "#1f7eb7", "#1f7db6", "#1f7bb6", "#1f7ab5", "#1f78b4", "#2076b3", "#2075b3", "#2073b2", "#2072b1", "#2070b0", "#206eb0", "#216daf", "#216bae", "#216aad", "#2168ad", "#2166ac", "#2165ab", "#2163aa", "#2262aa", "#2260a9", "#225ea8", "#225da8", "#225ca7", "#225aa6", "#2259a6", "#2258a5", "#2356a4", "#2355a4", "#2354a3", "#2352a3", "#2351a2", "#2350a1", "#234fa1", "#234da0", "#234c9f", "#234b9f", "#23499e", "#24489d", "#24479d", "#24459c", "#24449c", "#24439b", "#24419a", "#24409a", "#243f99", "#243d98", "#243c98", "#253b97", "#253997", "#253896", "#253795", "#253595", "#253494", "#243392", "#233390", "#22328f", "#21318d", "#21308b", "#203089", "#1f2f87", "#1e2e85", "#1d2e83", "#1c2d81", "#1b2c80", "#1a2b7e", "#192b7c", "#182a7a", "#172978", "#172976", "#162874", "#152772", "#142670", "#13266f", "#12256d", "#11246b", "#102369", "#0f2367", "#0e2265", "#0d2163", "#0d2161", "#0c2060", "#0b1f5e", "#0a1e5c", "#091e5a", "#081d58"], "YlOrBr": ["#ffffe5", "#ffffe4", "#fffee2", "#fffee1", "#fffee0", "#fffedf", "#fffddd", "#fffddc", "#fffddb", "#fffdd9", "#fffcd8", "#fffcd7", "#fffcd6", "#fffcd4", "#fffbd3", "#fffbd2", "#fffbd0", "#fffbcf", "#ffface", "#fffacd", "#fffacb", "#fffaca", "#fff9c9", "#fff9c7", "#fff9c6", "#fff9c5", "#fff8c4", "#fff8c2", "#fff8c1", "#fff8c0", "#fff7be", "#fff7bd", "#fff7bc", "#fff6ba", "#fff6b9", "#fff5b8", "#fff4b6", "#fff4b5", "#fff3b4", "#fff3b2", "#fff2b1", "#fff1b0", "#fff1ae", "#fff0ad", "#ffefac", "#ffefaa", "#ffeea9", "#ffeea8", "#feeda6", "#feeca5", "#feeca4", "#feeba2", "#feeaa1", "#feeaa0", "#fee99e", "#fee89d", "#fee89b", "#fee79a", "#fee799", "#fee697", "#fee596", "#fee595", "#fee493", "#fee392", "#fee390", "#fee28e", "#fee18c", "#fee08a", "#fedf88", "#fede86", "#fedd84", "#fedc82", "#fedb80", "#feda7e", "#fed97c", "#fed87a", "#fed778", "#fed676", "#fed573", "#fed471", "#fed36f", "#fed26d", "#fed16b", "#fed069", "#fecf67", "#fece65", "#fecd63", "#fecc61", "#fecb5f", "#feca5d", "#fec95b", "#fec859", "#fec857", "#fec754", "#fec652", "#fec550", "#fec34f", "#fec24d", "#fec14c", "#febf4b", "#febe4a", "#febd49", "#febb47", "#feba46", "#feb945", "#feb744", "#feb643", "#feb541", "#feb340", "#feb23f", "#feb13e", "#feaf3d", "#feae3b", "#fead3a", "#feab39", "#feaa38", "#fea937", "#fea736", "#fea634", "#fea433", "#fea332", "#fea231", "#fea030", "#fe9f2e", "#fe9e2d", "#fe9c2c", "#fe9b2b", "#fe9a2a", "#fe9829", "#fd9728", "#fd9627", "#fc9427", "#fb9326", "#fb9225", "#fa9125", "#fa8f24", "#f98e23", "#f98d23", "#f88b22", "#f88a21", "#f78921", "#f68820", "#f6861f", "#f5851f", "#f5841e", "#f4821d", "#f4811d", "#f3801c", "#f27f1b", "#f27d1b", "#f17c1a", "#f17b1a", "#f07919", "#f07818", "#ef7718", "#ee7617", "#ee7416", "#ed7316", "#ed7215", "#ec7014", "#eb6f14", "#ea6e13", "#e96d13", "#e86c12", "#e76b11", "#e66a11", "#e56910", "#e46710", "#e3660f", "#e2650f", "#e1640e", "#e0630d", "#df620d", "#de610c", "#dd5f0c", "#dc5e0b", "#db5d0b", "#da5c0a", "#d95b09", "#d85a09", "#d75908", "#d65808", "#d55607", "#d45507", "#d35406", "#d25306", "#d15205", "#d05104", "#cf5004", "#ce4f03", "#cd4d03", "#cc4c02", "#cb4b02", "#c94b02", "#c84a02", "#c64902", "#c44802", "#c34802", "#c14702", "#c04602", "#be4503", "#bc4503", "#bb4403", "#b94303", "#b84203", "#b64203", "#b44103", "#b34003", "#b13f03", "#b03f03", "#ae3e03", "#ac3d03", "#ab3c03", "#a93c03", "#a83b03", "#a63a03", "#a43904", "#a33904", "#a13804", "#a03704", "#9e3604", "#9c3604", "#9b3504", "#993404", "#983404", "#963304", "#943304", "#933204", "#913204", "#903104", "#8e3104", "#8c3004", "#8b3005", "#892f05", "#882f05", "#862e05", "#842e05", "#832d05", "#812d05", "#802d05", "#7e2c05", "#7c2c05", "#7b2b05", "#792b05", "#782a05", "#762a05", "#742905", "#732905", "#712806", "#702806", "#6e2706", "#6c2706", "#6b2606", "#692606", "#682506", "#662506"], "YlOrRd": ["#ffffcc", "#fffecb", "#fffec9", "#fffdc8", "#fffdc6", "#fffcc5", "#fffcc4", "#fffbc2", "#fffac1", "#fffac0", "#fff9be", "#fff9bd", "#fff8bb", "#fff8ba", "#fff7b9", "#fff7b7", "#fff6b6", "#fff5b5", "#fff5b3", "#fff4b2", "#fff4b0", "#fff3af", "#fff3ae", "#fff2ac", "#fff1ab", "#fff1a9", "#fff0a8", "#fff0a7", "#ffefa5", "#ffefa4", "#ffeea3", "#ffeda1", "#ffeda0", "#ffec9f", "#ffec9d", "#ffeb9c", "#ffea9b", "#ffea99", "#ffe998", "#ffe997", "#ffe895", "#ffe794", "#ffe793", "#ffe691", "#ffe590", "#ffe58f", "#ffe48d", "#ffe48c", "#fee38b", "#fee289", "#fee288", "#fee187", "#fee085", "#fee084", "#fedf83", "#fede82", "#fede80", "#fedd7f", "#fedd7e", "#fedc7c", "#fedb7b", "#fedb7a", "#feda78", "#fed977", "#fed976", "#fed774", "#fed673", "#fed572", "#fed470", "#fed36f", "#fed16e", "#fed06c", "#fecf6b", "#fece6a", "#fecc68", "#fecb67", "#feca66", "#fec965", "#fec863", "#fec662", "#fec561", "#fec45f", "#fec35e", "#fec15d", "#fec05b", "#febf5a", "#febe59", "#febd57", "#febb56", "#feba55", "#feb953", "#feb852", "#feb651", "#feb54f", "#feb44e", "#feb34d", "#feb24c", "#feb04b", "#feaf4b", "#feae4a", "#fead4a", "#feac49", "#feab49", "#fea948", "#fea848", "#fea747", "#fea647", "#fea546", "#fea446", "#fea245", "#fea145", "#fea044", "#fd9f44", "#fd9e43", "#fd9d43", "#fd9c42", "#fd9a42", "#fd9941", "#fd9841", "#fd9740", "#fd9640", "#fd953f", "#fd933f", "#fd923e", "#fd913e", "#fd903d", "#fd8f3d", "#fd8e3c", "#fd8c3c", "#fd8a3b", "#fd883b", "#fd863a", "#fd8439", "#fd8239", "#fd8038", "#fd7e38", "#fd7c37", "#fd7a37", "#fd7836", "#fd7636", "#fd7435", "#fd7234", "#fd7034", "#fd6e33", "#fc6c33", "#fc6a32", "#fc6832", "#fc6631", "#fc6430", "#fc6330", "#fc612f", "#fc5f2f", "#fc5d2e", "#fc5b2e", "#fc592d", "#fc572c", "#fc552c", "#fc532b", "#fc512b", "#fc4f2a", "#fc4d2a", "#fb4b29", "#fa4a29", "#f94828", "#f84628", "#f84528", "#f74327", "#f64227", "#f54026", "#f43e26", "#f43d25", "#f33b25", "#f23924", "#f13824", "#f13624", "#f03523", "#ef3323", "#ee3122", "#ed3022", "#ed2e21", "#ec2c21", "#eb2b21", "#ea2920", "#e92720", "#e9261f", "#e8241f", "#e7231e", "#e6211e", "#e61f1d", "#e51e1d", "#e41c1d", "#e31a1c", "#e2191c", "#e1191d", "#e0181d", "#df171d", "#dd161d", "#dc151e", "#db141e", "#da141e", "#d9131f", "#d7121f", "#d6111f", "#d51020", "#d41020", "#d30f20", "#d10e21", "#d00d21", "#cf0c21", "#ce0c22", "#cd0b22", "#cb0a22", "#ca0923", "#c90823", "#c80723", "#c70723", "#c50624", "#c40524", "#c30424", "#c20325", "#c10325", "#c00225", "#be0126", "#bd0026", "#bb0026", "#b90026", "#b70026", "#b60026", "#b40026", "#b20026", "#b00026", "#ae0026", "#ac0026", "#aa0026", "#a80026", "#a60026", "#a40026", "#a20026", "#a10026", "#9f0026", "#9d0026", "#9b0026", "#990026", "#970026", "#950026", "#930026", "#910026", "#8f0026", "#8d0026", "#8b0026", "#8a0026", "#880026", "#860026", "#840026", "#820026", "#800026"], "afmhot": ["#000000", "#020000", "#040000", "#060000", "#080000", "#0a0000", "#0c0000", "#0e0000", "#100000", "#120000", "#140000", "#160000", "#180000", "#1a0000", "#1c0000", "#1e0000", "#200000", "#220000", "#240000", "#260000", "#280000", "#2a0000", "#2c0000", "#2e0000", "#300000", "#320000", "#340000", "#360000", "#380000", "#3a0000", "#3c0000", "#3e0000", "#400000", "#420000", "#440000", "#460000", "#480000", "#4a0000", "#4c0000", "#4e0000", "#500000", "#520000", "#540000", "#560000", "#580000", "#5a0000", "#5c0000", "#5e0000", "#600000", "#620000", "#640000", "#660000", "#680000", "#6a0000", "#6c0000", "#6e0000", "#700000", "#720000", "#740000", "#760000", "#780000", "#7a0000", "#7c0000", "#7e0000", "#800000", "#820200", "#840400", "#860700", "#880800", "#8a0a00", "#8c0d00", "#8e0f00", "#901000", "#921200", "#941400", "#961700", "#981800", "#9a1a00", "#9c1d00", "#9e1f00", "#a02000", "#a22200", "#a42400", "#a62700", "#a82800", "#aa2a00", "#ac2d00", "#ae2f00", "#b03000", "#b23200", "#b43400", "#b63700", "#b83800", "#ba3a00", "#bc3d00", "#be3f00", "#c04000", "#c24200", "#c44400", "#c64600", "#c84800", "#ca4a00", "#cc4d00", "#ce4e00", "#d05000", "#d25200", "#d45400", "#d65600", "#d85800", "#da5a00", "#dc5d00", "#de5e00", "#e06000", "#e26200", "#e46400", "#e66600", "#e86800", "#ea6a00", "#ec6d00", "#ee6e00", "#f07000", "#f27200", "#f47400", "#f67600", "#f87800", "#fa7a00", "#fc7d00", "#fe7e00", "#ff8001", "#ff8203", "#ff8405", "#ff8607", "#ff8809", "#ff8b0b", "#ff8c0d", "#ff8e0f", "#ff9011", "#ff9213", "#ff9415", "#ff9617", "#ff9919", "#ff9b1b", "#ff9c1d", "#ff9e1f", "#ffa021", "#ffa223", "#ffa425", "#ffa627", "#ffa829", "#ffab2b", "#ffac2d", "#ffae2f", "#ffb031", "#ffb233", "#ffb435", "#ffb637", "#ffb939", "#ffbb3b", "#ffbc3d", "#ffbe3f", "#ffc041", "#ffc243", "#ffc445", "#ffc647", "#ffc849", "#ffcb4b", "#ffcc4d", "#ffce4f", "#ffd051", "#ffd253", "#ffd455", "#ffd657", "#ffd959", "#ffdb5b", "#ffdc5d", "#ffde5f", "#ffe061", "#ffe263", "#ffe465", "#ffe667", "#ffe869", "#ffeb6b", "#ffec6d", "#ffee6f", "#fff071", "#fff273", "#fff475", "#fff677", "#fff979", "#fffb7b", "#fffc7d", "#fffe7f", "#ffff81", "#ffff83", "#ffff85", "#ffff87", "#ffff89", "#ffff8b", "#ffff8d", "#ffff8f", "#ffff91", "#ffff93", "#ffff95", "#ffff97", "#ffff99", "#ffff9b", "#ffff9d", "#ffff9f", "#ffffa1", "#ffffa3", "#ffffa5", "#ffffa7", "#ffffa9", "#ffffab", "#ffffad", "#ffffaf", "#ffffb1", "#ffffb3", "#ffffb5", "#ffffb7", "#ffffb9", "#ffffbb", "#ffffbd", "#ffffbf", "#ffffc1", "#ffffc3", "#ffffc5", "#ffffc7", "#ffffc9", "#ffffcb", "#ffffcd", "#ffffcf", "#ffffd1", "#ffffd3", "#ffffd5", "#ffffd7", "#ffffd9", "#ffffdb", "#ffffdd", "#ffffdf", "#ffffe1", "#ffffe3", "#ffffe5", "#ffffe7", "#ffffe9", "#ffffeb", "#ffffed", "#ffffef", "#fffff1", "#fffff3", "#fffff5", "#fffff7", "#fffff9", "#fffffb", "#fffffd", "#ffffff"], "autumn": ["#ff0000", "#ff0100", "#ff0200", "#ff0300", "#ff0400", "#ff0500", "#ff0600", "#ff0700", "#ff0800", "#ff0900", "#ff0a00", "#ff0b00", "#ff0c00", "#ff0d00", "#ff0e00", "#ff0f00", "#ff1000", "#ff1100", "#ff1200", "#ff1300", "#ff1400", "#ff1500", "#ff1600", "#ff1700", "#ff1800", "#ff1900", "#ff1a00", "#ff1b00", "#ff1c00", "#ff1d00", "#ff1e00", "#ff1f00", "#ff2000", "#ff2100", "#ff2200", "#ff2300", "#ff2400", "#ff2500", "#ff2600", "#ff2700", "#ff2800", "#ff2900", "#ff2a00", "#ff2b00", "#ff2c00", "#ff2d00", "#ff2e00", "#ff2f00", "#ff3000", "#ff3100", "#ff3200", "#ff3300", "#ff3400", "#ff3500", "#ff3600", "#ff3700", "#ff3800", "#ff3900", "#ff3a00", "#ff3b00", "#ff3c00", "#ff3d00", "#ff3e00", "#ff3f00", "#ff4000", "#ff4100", "#ff4200", "#ff4300", "#ff4400", "#ff4500", "#ff4600", "#ff4700", "#ff4800", "#ff4900", "#ff4a00", "#ff4b00", "#ff4c00", "#ff4d00", "#ff4e00", "#ff4f00", "#ff5000", "#ff5100", "#ff5200", "#ff5300", "#ff5400", "#ff5500", "#ff5600", "#ff5700", "#ff5800", "#ff5900", "#ff5a00", "#ff5b00", "#ff5c00", "#ff5d00", "#ff5e00", "#ff5f00", "#ff6000", "#ff6100", "#ff6200", "#ff6300", "#ff6400", "#ff6500", "#ff6600", "#ff6700", "#ff6800", "#ff6900", "#ff6a00", "#ff6b00", "#ff6c00", "#ff6d00", "#ff6e00", "#ff6f00", "#ff7000", "#ff7100", "#ff7200", "#ff7300", "#ff7400", "#ff7500", "#ff7600", "#ff7700", "#ff7800", "#ff7900", "#ff7a00", "#ff7b00", "#ff7c00", "#ff7d00", "#ff7e00", "#ff7f00", "#ff8000", "#ff8100", "#ff8200", "#ff8300", "#ff8400", "#ff8500", "#ff8600", "#ff8700", "#ff8800", "#ff8900", "#ff8a00", "#ff8b00", "#ff8c00", "#ff8d00", "#ff8e00", "#ff8f00", "#ff9000", "#ff9100", "#ff9200", "#ff9300", "#ff9400", "#ff9500", "#ff9600", "#ff9700", "#ff9800", "#ff9900", "#ff9a00", "#ff9b00", "#ff9c00", "#ff9d00", "#ff9e00", "#ff9f00", "#ffa000", "#ffa100", "#ffa200", "#ffa300", "#ffa400", "#ffa500", "#ffa600", "#ffa700", "#ffa800", "#ffa900", "#ffaa00", "#ffab00", "#ffac00", "#ffad00", "#ffae00", "#ffaf00", "#ffb000", "#ffb100", "#ffb200", "#ffb300", "#ffb400", "#ffb500", "#ffb600", "#ffb700", "#ffb800", "#ffb900", "#ffba00", "#ffbb00", "#ffbc00", "#ffbd00", "#ffbe00", "#ffbf00", "#ffc000", "#ffc100", "#ffc200", "#ffc300", "#ffc400", "#ffc500", "#ffc600", "#ffc700", "#ffc800", "#ffc900", "#ffca00", "#ffcb00", "#ffcc00", "#ffcd00", "#ffce00", "#ffcf00", "#ffd000", "#ffd100", "#ffd200", "#ffd300", "#ffd400", "#ffd500", "#ffd600", "#ffd700", "#ffd800", "#ffd900", "#ffda00", "#ffdb00", "#ffdc00", "#ffdd00", "#ffde00", "#ffdf00", "#ffe000", "#ffe100", "#ffe200", "#ffe300", "#ffe400", "#ffe500", "#ffe600", "#ffe700", "#ffe800", "#ffe900", "#ffea00", "#ffeb00", "#ffec00", "#ffed00", "#ffee00", "#ffef00", "#fff000", "#fff100", "#fff200", "#fff300", "#fff400", "#fff500", "#fff600", "#fff700", "#fff800", "#fff900", "#fffa00", "#fffb00", "#fffc00", "#fffd00", "#fffe00", "#ffff00"], "binary": ["#ffffff", "#fefefe", "#fdfdfd", "#fcfcfc", "#fbfbfb", "#fafafa", "#f9f9f9", "#f8f8f8", "#f7f7f7", "#f6f6f6", "#f5f5f5", "#f4f4f4", "#f3f3f3", "#f2f2f2", "#f1f1f1", "#f0f0f0", "#efefef", "#eeeeee", "#ededed", "#ececec", "#ebebeb", "#eaeaea", "#e9e9e9", "#e8e8e8", "#e7e7e7", "#e6e6e6", "#e5e5e5", "#e4e4e4", "#e3e3e3", "#e2e2e2", "#e1e1e1", "#e0e0e0", "#dfdfdf", "#dedede", "#dddddd", "#dcdcdc", "#dbdbdb", "#dadada", "#d9d9d9", "#d8d8d8", "#d7d7d7", "#d6d6d6", "#d5d5d5", "#d4d4d4", "#d3d3d3", "#d2d2d2", "#d1d1d1", "#d0d0d0", "#cfcfcf", "#cecece", "#cdcdcd", "#cccccc", "#cbcbcb", "#cacaca", "#c9c9c9", "#c8c8c8", "#c7c7c7", "#c6c6c6", "#c5c5c5", "#c4c4c4", "#c3c3c3", "#c2c2c2", "#c1c1c1", "#c0c0c0", "#bfbfbf", "#bebebe", "#bdbdbd", "#bcbcbc", "#bbbbbb", "#bababa", "#b9b9b9", "#b8b8b8", "#b7b7b7", "#b6b6b6", "#b5b5b5", "#b4b4b4", "#b3b3b3", "#b2b2b2", "#b1b1b1", "#b0b0b0", "#afafaf", "#aeaeae", "#adadad", "#acacac", "#ababab", "#aaaaaa", "#a9a9a9", "#a8a8a8", "#a7a7a7", "#a6a6a6", "#a5a5a5", "#a4a4a4", "#a3a3a3", "#a2a2a2", "#a1a1a1", "#a0a0a0", "#9f9f9f", "#9e9e9e", "#9d9d9d", "#9c9c9c", "#9b9b9b", "#9a9a9a", "#999999", "#989898", "#979797", "#969696", "#959595", "#949494", "#939393", "#929292", "#919191", "#909090", "#8f8f8f", "#8e8e8e", "#8d8d8d", "#8c8c8c", "#8b8b8b", "#8a8a8a", "#898989", "#888888", "#878787", "#868686", "#858585", "#848484", "#838383", "#828282", "#818181", "#808080", "#7f7f7f", "#7e7e7e", "#7d7d7d", "#7c7c7c", "#7b7b7b", "#7a7a7a", "#797979", "#787878", "#777777", "#767676", "#757575", "#747474", "#737373", "#727272", "#717171", "#707070", "#6f6f6f", "#6e6e6e", "#6d6d6d", "#6c6c6c", "#6b6b6b", "#6a6a6a", "#696969", "#686868", "#676767", "#666666", "#656565", "#646464", "#636363", "#626262", "#616161", "#606060", "#5f5f5f", "#5e5e5e", "#5d5d5d", "#5c5c5c", "#5b5b5b", "#5a5a5a", "#595959", "#585858", "#575757", "#565656", "#555555", "#545454", "#535353", "#525252", "#515151", "#505050", "#4f4f4f", "#4e4e4e", "#4d4d4d", "#4c4c4c", "#4b4b4b", "#4a4a4a", "#494949", "#484848", "#474747", "#464646", "#454545", "#444444", "#434343", "#424242", "#414141", "#404040", "#3f3f3f", "#3e3e3e", "#3d3d3d", "#3c3c3c", "#3b3b3b", "#3a3a3a", "#393939", "#383838", "#373737", "#363636", "#353535", "#343434", "#333333", "#323232", "#313131", "#303030", "#2f2f2f", "#2e2e2e", "#2d2d2d", "#2c2c2c", "#2b2b2b", "#2a2a2a", "#292929", "#282828", "#272727", "#262626", "#252525", "#242424", "#232323", "#222222", "#212121", "#202020", "#1f1f1f", "#1e1e1e", "#1d1d1d", "#1c1c1c", "#1b1b1b", "#1a1a1a", "#191919", "#181818", "#171717", "#161616", "#151515", "#141414", "#131313", "#121212", "#111111", "#101010", "#0f0f0f", "#0e0e0e", "#0d0d0d", "#0c0c0c", "#0b0b0b", "#0a0a0a", "#090909", "#080808", "#070707", "#060606", "#050505", "#040404", "#030303", "#020202", "#010101", "#000000"], "bone": ["#000000", "#010101", "#020202", "#030304", "#040305", "#040406", "#050507", "#060609", "#07070a", "#08080b", "#09090c", "#0a0a0d", "#0a0a0f", "#0b0b10", "#0c0c11", "#0d0d12", "#0e0e13", "#0f0f15", "#101016", "#111117", "#121118", "#12121a", "#13131b", "#14141c", "#15151d", "#16161e", "#171720", "#181821", "#181822", "#191923", "#1a1a25", "#1b1b26", "#1c1c27", "#1d1d28", "#1e1e29", "#1f1f2b", "#201f2c", "#20202d", "#21212e", "#22222f", "#232331", "#242432", "#252533", "#262634", "#262636", "#272737", "#282838", "#292939", "#2a2a3a", "#2b2b3c", "#2c2c3d", "#2d2d3e", "#2e2d3f", "#2e2e41", "#2f2f42", "#303043", "#313144", "#323245", "#333347", "#343448", "#343449", "#35354a", "#36364b", "#37374d", "#38384e", "#39394f", "#3a3a50", "#3b3b52", "#3c3b53", "#3c3c54", "#3d3d55", "#3e3e56", "#3f3f58", "#404059", "#41415a", "#42425b", "#42425d", "#43435e", "#44445f", "#454560", "#464661", "#474763", "#484864", "#494965", "#4a4966", "#4a4a67", "#4b4b69", "#4c4c6a", "#4d4d6b", "#4e4e6c", "#4f4f6e", "#50506f", "#505070", "#515171", "#525372", "#535473", "#545574", "#555675", "#565776", "#575976", "#575a77", "#585b78", "#595c79", "#5a5d7a", "#5b5f7b", "#5c607c", "#5d617d", "#5e627d", "#5e637e", "#5f657f", "#606680", "#616781", "#626882", "#636983", "#646b84", "#656c84", "#666d85", "#666e86", "#676f87", "#687188", "#697289", "#6a738a", "#6b748b", "#6c758b", "#6c778c", "#6d788d", "#6e798e", "#6f7a8f", "#707b90", "#717d91", "#727e92", "#737f92", "#738093", "#748194", "#758395", "#768496", "#778597", "#788698", "#798799", "#7a8999", "#7a8a9a", "#7b8b9b", "#7c8c9c", "#7d8d9d", "#7e8f9e", "#7f909f", "#8091a0", "#8192a0", "#8194a1", "#8295a2", "#8396a3", "#8497a4", "#8598a5", "#869aa6", "#879ba7", "#889ca7", "#889da8", "#899ea9", "#8aa0aa", "#8ba1ab", "#8ca2ac", "#8da3ad", "#8ea4ae", "#8fa6ae", "#8fa7af", "#90a8b0", "#91a9b1", "#92aab2", "#93acb3", "#94adb4", "#95aeb5", "#96afb5", "#96b0b6", "#97b2b7", "#98b3b8", "#99b4b9", "#9ab5ba", "#9bb6bb", "#9cb8bc", "#9db9bc", "#9dbabd", "#9ebbbe", "#9fbcbf", "#a0bec0", "#a1bfc1", "#a2c0c2", "#a3c1c3", "#a4c2c3", "#a4c4c4", "#a5c5c5", "#a6c6c6", "#a7c7c7", "#a9c8c8", "#aac9c9", "#accaca", "#adcaca", "#aecbcb", "#b0cccc", "#b1cdcd", "#b2cece", "#b4cfcf", "#b5d0d0", "#b7d1d1", "#b8d2d1", "#b9d2d2", "#bbd3d3", "#bcd4d4", "#bdd5d5", "#bfd6d6", "#c0d7d7", "#c1d8d8", "#c3d8d8", "#c4d9d9", "#c6dada", "#c7dbdb", "#c8dcdc", "#cadddd", "#cbdede", "#ccdfdf", "#cee0df", "#cfe0e0", "#d1e1e1", "#d2e2e2", "#d3e3e3", "#d5e4e4", "#d6e5e5", "#d7e6e6", "#d9e6e6", "#dae7e7", "#dbe8e8", "#dde9e9", "#deeaea", "#e0ebeb", "#e1ecec", "#e2eded", "#e4eeed", "#e5eeee", "#e6efef", "#e8f0f0", "#e9f1f1", "#eaf2f2", "#ecf3f3", "#edf4f4", "#eff4f4", "#f0f5f5", "#f1f6f6", "#f3f7f7", "#f4f8f8", "#f5f9f9", "#f7fafa", "#f8fbfb", "#fafcfb", "#fbfcfc", "#fcfdfd", "#fefefe", "#ffffff"], "brg": ["#0000ff", "#0200fd", "#0400fb", "#0600f9", "#0800f7", "#0a00f5", "#0c00f3", "#0e00f1", "#1000ef", "#1200ed", "#1400eb", "#1600e9", "#1800e7", "#1a00e5", "#1c00e3", "#1e00e1", "#2000df", "#2200dd", "#2400db", "#2600d9", "#2800d7", "#2a00d5", "#2c00d3", "#2e00d1", "#3000cf", "#3200cd", "#3400cb", "#3600c9", "#3800c7", "#3a00c5", "#3c00c3", "#3e00c1", "#4000bf", "#4200bd", "#4400bb", "#4600b9", "#4800b7", "#4a00b5", "#4c00b3", "#4e00b1", "#5000af", "#5200ad", "#5400ab", "#5600a9", "#5800a7", "#5a00a5", "#5c00a3", "#5e00a1", "#60009f", "#62009d", "#64009b", "#660099", "#680097", "#6a0095", "#6c0093", "#6e0091", "#70008f", "#72008d", "#74008b", "#760089", "#780087", "#7a0085", "#7c0083", "#7e0081", "#80007f", "#82007d", "#84007b", "#860079", "#880077", "#8a0075", "#8c0073", "#8e0071", "#90006f", "#92006d", "#94006b", "#960069", "#980067", "#9a0065", "#9c0063", "#9e0061", "#a0005f", "#a2005d", "#a4005b", "#a60059", "#a80057", "#aa0055", "#ac0053", "#ae0051", "#b0004f", "#b2004d", "#b4004b", "#b60049", "#b80047", "#ba0045", "#bc0043", "#be0041", "#c0003f", "#c2003d", "#c4003b", "#c60039", "#c80037", "#ca0035", "#cc0033", "#ce0031", "#d0002f", "#d2002d", "#d4002b", "#d60029", "#d80027", "#da0025", "#dc0023", "#de0021", "#e0001f", "#e2001d", "#e4001b", "#e60019", "#e80017", "#ea0015", "#ec0013", "#ee0011", "#f0000f", "#f2000d", "#f4000b", "#f60009", "#f80007", "#fa0005", "#fc0003", "#fe0001", "#fe0100", "#fc0300", "#fa0500", "#f80700", "#f60900", "#f40b00", "#f20d00", "#f00f00", "#ee1100", "#ec1300", "#ea1500", "#e81700", "#e61900", "#e41b00", "#e21d00", "#e01f00", "#de2100", "#dc2300", "#da2500", "#d82700", "#d62900", "#d42b00", "#d22d00", "#d02f00", "#ce3100", "#cc3300", "#ca3500", "#c83700", "#c63900", "#c43b00", "#c23d00", "#c03f00", "#be4100", "#bc4300", "#ba4500", "#b84700", "#b64900", "#b44b00", "#b24d00", "#b04f00", "#ae5100", "#ac5300", "#aa5500", "#a85700", "#a65900", "#a45b00", "#a25d00", "#a05f00", "#9e6100", "#9c6300", "#9a6500", "#986700", "#966900", "#946b00", "#926d00", "#906f00", "#8e7100", "#8c7300", "#8a7500", "#887700", "#867900", "#847b00", "#827d00", "#807f00", "#7e8100", "#7c8300", "#7a8500", "#788700", "#768900", "#748b00", "#728d00", "#708f00", "#6e9100", "#6c9300", "#6a9500", "#689700", "#669900", "#649b00", "#629d00", "#609f00", "#5ea100", "#5ca300", "#5aa500", "#58a700", "#56a900", "#54ab00", "#52ad00", "#50af00", "#4eb100", "#4cb300", "#4ab500", "#48b700", "#46b900", "#44bb00", "#42bd00", "#40bf00", "#3ec100", "#3cc300", "#3ac500", "#38c700", "#36c900", "#34cb00", "#32cd00", "#30cf00", "#2ed100", "#2cd300", "#2ad500", "#28d700", "#26d900", "#24db00", "#22dd00", "#20df00", "#1ee100", "#1ce300", "#1ae500", "#18e700", "#16e900", "#14eb00", "#12ed00", "#10ef00", "#0ef100", "#0cf300", "#0af500", "#08f700", "#06f900", "#04fb00", "#02fd00", "#00ff00"], "bwr": ["#0000ff", "#0202ff", "#0404ff", "#0606ff", "#0808ff", "#0a0aff", "#0c0cff", "#0e0eff", "#1010ff", "#1212ff", "#1414ff", "#1616ff", "#1818ff", "#1a1aff", "#1c1cff", "#1e1eff", "#2020ff", "#2222ff", "#2424ff", "#2626ff", "#2828ff", "#2a2aff", "#2c2cff", "#2e2eff", "#3030ff", "#3232ff", "#3434ff", "#3636ff", "#3838ff", "#3a3aff", "#3c3cff", "#3e3eff", "#4040ff", "#4242ff", "#4444ff", "#4646ff", "#4848ff", "#4a4aff", "#4c4cff", "#4e4eff", "#5050ff", "#5252ff", "#5454ff", "#5656ff", "#5858ff", "#5a5aff", "#5c5cff", "#5e5eff", "#6060ff", "#6262ff", "#6464ff", "#6666ff", "#6868ff", "#6a6aff", "#6c6cff", "#6e6eff", "#7070ff", "#7272ff", "#7474ff", "#7676ff", "#7878ff", "#7a7aff", "#7c7cff", "#7e7eff", "#8080ff", "#8282ff", "#8484ff", "#8686ff", "#8888ff", "#8a8aff", "#8c8cff", "#8e8eff", "#9090ff", "#9292ff", "#9494ff", "#9696ff", "#9898ff", "#9a9aff", "#9c9cff", "#9e9eff", "#a0a0ff", "#a2a2ff", "#a4a4ff", "#a6a6ff", "#a8a8ff", "#aaaaff", "#acacff", "#aeaeff", "#b0b0ff", "#b2b2ff", "#b4b4ff", "#b6b6ff", "#b8b8ff", "#babaff", "#bcbcff", "#bebeff", "#c0c0ff", "#c2c2ff", "#c4c4ff", "#c6c6ff", "#c8c8ff", "#cacaff", "#ccccff", "#ceceff", "#d0d0ff", "#d2d2ff", "#d4d4ff", "#d6d6ff", "#d8d8ff", "#dadaff", "#dcdcff", "#dedeff", "#e0e0ff", "#e2e2ff", "#e4e4ff", "#e6e6ff", "#e8e8ff", "#eaeaff", "#ececff", "#eeeeff", "#f0f0ff", "#f2f2ff", "#f4f4ff", "#f6f6ff", "#f8f8ff", "#fafaff", "#fcfcff", "#fefeff", "#fffefe", "#fffcfc", "#fffafa", "#fff8f8", "#fff6f6", "#fff4f4", "#fff2f2", "#fff0f0", "#ffeeee", "#ffecec", "#ffeaea", "#ffe8e8", "#ffe6e6", "#ffe4e4", "#ffe2e2", "#ffe0e0", "#ffdede", "#ffdcdc", "#ffdada", "#ffd8d8", "#ffd6d6", "#ffd4d4", "#ffd2d2", "#ffd0d0", "#ffcece", "#ffcccc", "#ffcaca", "#ffc8c8", "#ffc6c6", "#ffc4c4", "#ffc2c2", "#ffc0c0", "#ffbebe", "#ffbcbc", "#ffbaba", "#ffb8b8", "#ffb6b6", "#ffb4b4", "#ffb2b2", "#ffb0b0", "#ffaeae", "#ffacac", "#ffaaaa", "#ffa8a8", "#ffa6a6", "#ffa4a4", "#ffa2a2", "#ffa0a0", "#ff9e9e", "#ff9c9c", "#ff9a9a", "#ff9898", "#ff9696", "#ff9494", "#ff9292", "#ff9090", "#ff8e8e", "#ff8c8c", "#ff8a8a", "#ff8888", "#ff8686", "#ff8484", "#ff8282", "#ff8080", "#ff7e7e", "#ff7c7c", "#ff7a7a", "#ff7878", "#ff7676", "#ff7474", "#ff7272", "#ff7070", "#ff6e6e", "#ff6c6c", "#ff6a6a", "#ff6868", "#ff6666", "#ff6464", "#ff6262", "#ff6060", "#ff5e5e", "#ff5c5c", "#ff5a5a", "#ff5858", "#ff5656", "#ff5454", "#ff5252", "#ff5050", "#ff4e4e", "#ff4c4c", "#ff4a4a", "#ff4848", "#ff4646", "#ff4444", "#ff4242", "#ff4040", "#ff3e3e", "#ff3c3c", "#ff3a3a", "#ff3838", "#ff3636", "#ff3434", "#ff3232", "#ff3030", "#ff2e2e", "#ff2c2c", "#ff2a2a", "#ff2828", "#ff2626", "#ff2424", "#ff2222", "#ff2020", "#ff1e1e", "#ff1c1c", "#ff1a1a", "#ff1818", "#ff1616", "#ff1414", "#ff1212", "#ff1010", "#ff0e0e", "#ff0c0c", "#ff0a0a", "#ff0808", "#ff0606", "#ff0404", "#ff0202", "#ff0000"], "cool": ["#00ffff", "#01feff", "#02fdff", "#03fcff", "#04fbff", "#05faff", "#06f9ff", "#07f8ff", "#08f7ff", "#09f6ff", "#0af5ff", "#0bf4ff", "#0cf3ff", "#0df2ff", "#0ef1ff", "#0ff0ff", "#10efff", "#11eeff", "#12edff", "#13ecff", "#14ebff", "#15eaff", "#16e9ff", "#17e8ff", "#18e7ff", "#19e6ff", "#1ae5ff", "#1be4ff", "#1ce3ff", "#1de2ff", "#1ee1ff", "#1fe0ff", "#20dfff", "#21deff", "#22ddff", "#23dcff", "#24dbff", "#25daff", "#26d9ff", "#27d8ff", "#28d7ff", "#29d6ff", "#2ad5ff", "#2bd4ff", "#2cd3ff", "#2dd2ff", "#2ed1ff", "#2fd0ff", "#30cfff", "#31ceff", "#32cdff", "#33ccff", "#34cbff", "#35caff", "#36c9ff", "#37c8ff", "#38c7ff", "#39c6ff", "#3ac5ff", "#3bc4ff", "#3cc3ff", "#3dc2ff", "#3ec1ff", "#3fc0ff", "#40bfff", "#41beff", "#42bdff", "#43bcff", "#44bbff", "#45baff", "#46b9ff", "#47b8ff", "#48b7ff", "#49b6ff", "#4ab5ff", "#4bb4ff", "#4cb3ff", "#4db2ff", "#4eb1ff", "#4fb0ff", "#50afff", "#51aeff", "#52adff", "#53acff", "#54abff", "#55aaff", "#56a9ff", "#57a8ff", "#58a7ff", "#59a6ff", "#5aa5ff", "#5ba4ff", "#5ca3ff", "#5da2ff", "#5ea1ff", "#5fa0ff", "#609fff", "#619eff", "#629dff", "#639cff", "#649bff", "#659aff", "#6699ff", "#6798ff", "#6897ff", "#6996ff", "#6a95ff", "#6b94ff", "#6c93ff", "#6d92ff", "#6e91ff", "#6f90ff", "#708fff", "#718eff", "#728dff", "#738cff", "#748bff", "#758aff", "#7689ff", "#7788ff", "#7887ff", "#7986ff", "#7a85ff", "#7b84ff", "#7c83ff", "#7d82ff", "#7e81ff", "#7f80ff", "#807fff", "#817eff", "#827dff", "#837cff", "#847bff", "#857aff", "#8679ff", "#8778ff", "#8877ff", "#8976ff", "#8a75ff", "#8b74ff", "#8c73ff", "#8d72ff", "#8e71ff", "#8f70ff", "#906fff", "#916eff", "#926dff", "#936cff", "#946bff", "#956aff", "#9669ff", "#9768ff", "#9867ff", "#9966ff", "#9a65ff", "#9b64ff", "#9c63ff", "#9d62ff", "#9e61ff", "#9f60ff", "#a05fff", "#a15eff", "#a25dff", "#a35cff", "#a45bff", "#a55aff", "#a659ff", "#a758ff", "#a857ff", "#a956ff", "#aa55ff", "#ab54ff", "#ac53ff", "#ad52ff", "#ae51ff", "#af50ff", "#b04fff", "#b14eff", "#b24dff", "#b34cff", "#b44bff", "#b54aff", "#b649ff", "#b748ff", "#b847ff", "#b946ff", "#ba45ff", "#bb44ff", "#bc43ff", "#bd42ff", "#be41ff", "#bf40ff", "#c03fff", "#c13eff", "#c23dff", "#c33cff", "#c43bff", "#c53aff", "#c639ff", "#c738ff", "#c837ff", "#c936ff", "#ca35ff", "#cb34ff", "#cc33ff", "#cd32ff", "#ce31ff", "#cf30ff", "#d02fff", "#d12eff", "#d22dff", "#d32cff", "#d42bff", "#d52aff", "#d629ff", "#d728ff", "#d827ff", "#d926ff", "#da25ff", "#db24ff", "#dc23ff", "#dd22ff", "#de21ff", "#df20ff", "#e01fff", "#e11eff", "#e21dff", "#e31cff", "#e41bff", "#e51aff", "#e619ff", "#e718ff", "#e817ff", "#e916ff", "#ea15ff", "#eb14ff", "#ec13ff", "#ed12ff", "#ee11ff", "#ef10ff", "#f00fff", "#f10eff", "#f20dff", "#f30cff", "#f40bff", "#f50aff", "#f609ff", "#f708ff", "#f807ff", "#f906ff", "#fa05ff", "#fb04ff", "#fc03ff", "#fd02ff", "#fe01ff", "#ff00ff"], "coolwarm": ["#3b4cc0", "#3c4ec2", "#3d50c3", "#3e51c5", "#3f53c6", "#4055c8", "#4257c9", "#4358cb", "#445acc", "#455cce", "#465ecf", "#485fd1", "#4961d2", "#4a63d3", "#4b64d5", "#4c66d6", "#4e68d8", "#4f69d9", "#506bda", "#516ddb", "#536edd", "#5470de", "#5572df", "#5673e0", "#5875e1", "#5977e3", "#5a78e4", "#5b7ae5", "#5d7ce6", "#5e7de7", "#5f7fe8", "#6180e9", "#6282ea", "#6384eb", "#6485ec", "#6687ed", "#6788ee", "#688aef", "#6a8bef", "#6b8df0", "#6c8ff1", "#6e90f2", "#6f92f3", "#7093f3", "#7295f4", "#7396f5", "#7597f6", "#7699f6", "#779af7", "#799cf8", "#7a9df8", "#7b9ff9", "#7da0f9", "#7ea1fa", "#80a3fa", "#81a4fb", "#82a6fb", "#84a7fc", "#85a8fc", "#86a9fc", "#88abfd", "#89acfd", "#8badfd", "#8caffe", "#8db0fe", "#8fb1fe", "#90b2fe", "#92b4fe", "#93b5fe", "#94b6ff", "#96b7ff", "#97b8ff", "#98b9ff", "#9abbff", "#9bbcff", "#9dbdff", "#9ebeff", "#9fbfff", "#a1c0ff", "#a2c1ff", "#a3c2fe", "#a5c3fe", "#a6c4fe", "#a7c5fe", "#a9c6fd", "#aac7fd", "#abc8fd", "#adc9fd", "#aec9fc", "#afcafc", "#b1cbfc", "#b2ccfb", "#b3cdfb", "#b5cdfa", "#b6cefa", "#b7cff9", "#b9d0f9", "#bad0f8", "#bbd1f8", "#bcd2f7", "#bed2f6", "#bfd3f6", "#c0d4f5", "#c1d4f4", "#c3d5f4", "#c4d5f3", "#c5d6f2", "#c6d6f1", "#c7d7f0", "#c9d7f0", "#cad8ef", "#cbd8ee", "#ccd9ed", "#cdd9ec", "#cedaeb", "#cfdaea", "#d1dae9", "#d2dbe8", "#d3dbe7", "#d4dbe6", "#d5dbe5", "#d6dce4", "#d7dce3", "#d8dce2", "#d9dce1", "#dadce0", "#dbdcde", "#dcdddd", "#dddcdc", "#dedcdb", "#dfdbd9", "#e0dbd8", "#e1dad6", "#e2dad5", "#e3d9d3", "#e4d9d2", "#e5d8d1", "#e6d7cf", "#e7d7ce", "#e8d6cc", "#e9d5cb", "#ead5c9", "#ead4c8", "#ebd3c6", "#ecd3c5", "#edd2c3", "#edd1c2", "#eed0c0", "#efcfbf", "#efcebd", "#f0cdbb", "#f1cdba", "#f1ccb8", "#f2cbb7", "#f2cab5", "#f2c9b4", "#f3c8b2", "#f3c7b1", "#f4c6af", "#f4c5ad", "#f5c4ac", "#f5c2aa", "#f5c1a9", "#f5c0a7", "#f6bfa6", "#f6bea4", "#f6bda2", "#f7bca1", "#f7ba9f", "#f7b99e", "#f7b89c", "#f7b79b", "#f7b599", "#f7b497", "#f7b396", "#f7b194", "#f7b093", "#f7af91", "#f7ad90", "#f7ac8e", "#f7aa8c", "#f7a98b", "#f7a889", "#f7a688", "#f6a586", "#f6a385", "#f6a283", "#f5a081", "#f59f80", "#f59d7e", "#f59c7d", "#f49a7b", "#f4987a", "#f39778", "#f39577", "#f39475", "#f29274", "#f29072", "#f18f71", "#f18d6f", "#f08b6e", "#f08a6c", "#ef886b", "#ee8669", "#ee8468", "#ed8366", "#ec8165", "#ec7f63", "#eb7d62", "#ea7b60", "#e97a5f", "#e9785d", "#e8765c", "#e7745b", "#e67259", "#e57058", "#e46e56", "#e36c55", "#e36b54", "#e26952", "#e16751", "#e0654f", "#df634e", "#de614d", "#dd5f4b", "#dc5d4a", "#da5a49", "#d95847", "#d85646", "#d75445", "#d65244", "#d55042", "#d44e41", "#d24b40", "#d1493f", "#d0473d", "#cf453c", "#cd423b", "#cc403a", "#cb3e38", "#ca3b37", "#c83836", "#c73635", "#c53334", "#c43032", "#c32e31", "#c12b30", "#c0282f", "#be242e", "#bd1f2d", "#bb1b2c", "#ba162b", "#b8122a", "#b70d28", "#b50927", "#b40426"], "copper": ["#000000", "#010100", "#020201", "#040201", "#050302", "#060402", "#070503", "#090503", "#0a0604", "#0b0704", "#0c0805", "#0e0905", "#0f0906", "#100a06", "#110b07", "#130c07", "#140c08", "#150d08", "#160e09", "#170f09", "#19100a", "#1a100a", "#1b110b", "#1c120b", "#1e130c", "#1f140c", "#20140d", "#21150d", "#23160e", "#24170e", "#25170f", "#26180f", "#281910", "#291a10", "#2a1b11", "#2b1b11", "#2c1c12", "#2e1d12", "#2f1e13", "#301e13", "#311f14", "#332014", "#342115", "#352215", "#362216", "#382316", "#392417", "#3a2517", "#3b2518", "#3d2618", "#3e2719", "#3f2819", "#40291a", "#41291a", "#432a1b", "#442b1b", "#452c1c", "#462d1c", "#482d1d", "#492e1d", "#4a2f1e", "#4b301e", "#4d301f", "#4e311f", "#4f3220", "#503320", "#523421", "#533421", "#543522", "#553622", "#563723", "#583723", "#593824", "#5a3924", "#5b3a25", "#5d3b25", "#5e3b26", "#5f3c26", "#603d27", "#623e27", "#633e28", "#643f28", "#654029", "#674129", "#68422a", "#69422a", "#6a432b", "#6b442b", "#6d452c", "#6e462c", "#6f462d", "#70472d", "#72482e", "#73492e", "#74492f", "#754a2f", "#774b30", "#784c30", "#794d31", "#7a4d31", "#7c4e32", "#7d4f32", "#7e5033", "#7f5033", "#805134", "#825234", "#835335", "#845435", "#855436", "#875536", "#885637", "#895737", "#8a5738", "#8c5838", "#8d5939", "#8e5a39", "#8f5b3a", "#915b3a", "#925c3b", "#935d3b", "#945e3c", "#955f3c", "#975f3d", "#98603d", "#99613e", "#9a623e", "#9c623f", "#9d633f", "#9e6440", "#9f6540", "#a16641", "#a26641", "#a36742", "#a46842", "#a66943", "#a76943", "#a86a44", "#a96b44", "#aa6c45", "#ac6d45", "#ad6d46", "#ae6e46", "#af6f47", "#b17047", "#b27048", "#b37148", "#b47249", "#b67349", "#b7744a", "#b8744a", "#b9754b", "#bb764b", "#bc774c", "#bd784c", "#be784d", "#bf794d", "#c17a4e", "#c27b4e", "#c37b4f", "#c47c4f", "#c67d50", "#c77e50", "#c87f51", "#c97f51", "#cb8052", "#cc8152", "#cd8253", "#ce8253", "#d08354", "#d18454", "#d28555", "#d38655", "#d48656", "#d68756", "#d78857", "#d88957", "#d98958", "#db8a58", "#dc8b59", "#dd8c59", "#de8d5a", "#e08d5a", "#e18e5b", "#e28f5b", "#e3905c", "#e5915c", "#e6915d", "#e7925d", "#e8935e", "#e9945e", "#eb945f", "#ec955f", "#ed9660", "#ee9760", "#f09861", "#f19861", "#f29962", "#f39a62", "#f59b63", "#f69b63", "#f79c64", "#f89d64", "#fa9e64", "#fb9f65", "#fc9f65", "#fda066", "#fea166", "#ffa267", "#ffa267", "#ffa368", "#ffa468", "#ffa569", "#ffa669", "#ffa66a", "#ffa76a", "#ffa86b", "#ffa96b", "#ffaa6c", "#ffaa6c", "#ffab6d", "#ffac6d", "#ffad6e", "#ffad6e", "#ffae6f", "#ffaf6f", "#ffb070", "#ffb170", "#ffb171", "#ffb271", "#ffb372", "#ffb472", "#ffb473", "#ffb573", "#ffb674", "#ffb774", "#ffb875", "#ffb875", "#ffb976", "#ffba76", "#ffbb77", "#ffbb77", "#ffbc78", "#ffbd78", "#ffbe79", "#ffbf79", "#ffbf7a", "#ffc07a", "#ffc17b", "#ffc27b", "#ffc37c", "#ffc37c", "#ffc47d", "#ffc57d", "#ffc67e", "#ffc67e", "#ffc77f"], "cubehelix": ["#000000", "#020102", "#030103", "#050205", "#070206", "#080308", "#0a030a", "#0b040c", "#0c050e", "#0e050f", "#0f0611", "#100713", "#110815", "#120817", "#130919", "#140a1b", "#150b1d", "#160c1f", "#160d21", "#170e23", "#180f25", "#181027", "#191129", "#19122b", "#19132d", "#1a142f", "#1a1631", "#1a1733", "#1a1835", "#1b1a36", "#1b1b38", "#1b1c3a", "#1b1e3b", "#1b1f3d", "#1a213e", "#1a2240", "#1a2441", "#1a2543", "#1a2744", "#192845", "#192a46", "#192c47", "#192d48", "#182f49", "#18314a", "#18324b", "#17344c", "#17364c", "#17374d", "#16394d", "#163b4e", "#163d4e", "#163f4e", "#16404e", "#15424e", "#15444f", "#15464e", "#15474e", "#15494e", "#154b4e", "#154d4e", "#154e4d", "#15504d", "#15524c", "#16534c", "#16554b", "#16574b", "#17584a", "#175a49", "#185b48", "#195d48", "#195e47", "#1a6046", "#1b6145", "#1c6344", "#1d6443", "#1e6542", "#1f6741", "#206840", "#22693f", "#236a3e", "#256b3d", "#266c3c", "#286d3b", "#2a6e3a", "#2b6f39", "#2d7038", "#2f7137", "#317236", "#337335", "#357435", "#387434", "#3a7533", "#3c7632", "#3f7632", "#417731", "#447731", "#467830", "#497830", "#4c792f", "#4e792f", "#51792f", "#54792f", "#577a2f", "#5a7a2f", "#5d7a2f", "#607a2f", "#637a2f", "#667a30", "#697b30", "#6c7b31", "#6f7b31", "#727b32", "#757b33", "#787b34", "#7b7a35", "#7e7a36", "#817a37", "#847a38", "#877a3a", "#8a7a3b", "#8d7a3d", "#907a3e", "#937a40", "#967a42", "#997944", "#9c7946", "#9f7948", "#a1794a", "#a4794c", "#a7794f", "#a97951", "#ac7954", "#ae7956", "#b17959", "#b3795b", "#b5795e", "#b77961", "#b97964", "#bc7967", "#be796a", "#bf796d", "#c17a70", "#c37a73", "#c57a76", "#c67a79", "#c87b7c", "#c97b7f", "#ca7c83", "#cc7c86", "#cd7d89", "#ce7d8c", "#cf7e8f", "#d07e93", "#d17f96", "#d18099", "#d2809c", "#d381a0", "#d382a3", "#d383a6", "#d484a9", "#d485ac", "#d486af", "#d487b2", "#d588b5", "#d589b8", "#d48abb", "#d48cbe", "#d48dc1", "#d48ec3", "#d490c6", "#d391c9", "#d392cb", "#d294ce", "#d295d0", "#d297d2", "#d198d4", "#d09ad7", "#d09cd9", "#cf9ddb", "#cf9fdd", "#cea1df", "#cda2e0", "#cca4e2", "#cca6e4", "#cba8e5", "#caa9e7", "#caabe8", "#c9ade9", "#c8afea", "#c8b1ec", "#c7b2ed", "#c6b4ee", "#c6b6ee", "#c5b8ef", "#c5baf0", "#c4bcf1", "#c4bdf1", "#c3bff2", "#c3c1f2", "#c2c3f2", "#c2c5f3", "#c2c6f3", "#c2c8f3", "#c1caf3", "#c1ccf3", "#c1cdf3", "#c1cff3", "#c1d1f3", "#c2d2f3", "#c2d4f3", "#c2d6f3", "#c2d7f3", "#c3d9f3", "#c3daf2", "#c4dcf2", "#c4ddf2", "#c5dff2", "#c6e0f1", "#c6e1f1", "#c7e3f1", "#c8e4f0", "#c9e5f0", "#cae7f0", "#cbe8f0", "#cce9ef", "#cdeaef", "#cfebef", "#d0ecef", "#d1edef", "#d3eeef", "#d4efef", "#d6f0ef", "#d7f1ef", "#d9f2ef", "#dbf3ef", "#dcf3ef", "#def4ef", "#e0f5f0", "#e2f6f0", "#e3f6f0", "#e5f7f1", "#e7f8f1", "#e9f8f2", "#ebf9f3", "#edfaf4", "#effaf4", "#f0fbf5", "#f2fbf6", "#f4fcf7", "#f6fcf8", "#f8fdfa", "#fafdfb", "#fbfefc", "#fdfefe", "#ffffff"], "flag": ["#ff0000", "#ff6035", "#ffb37e", "#ffeac6", "#ffffff", "#cdeeff", "#85b9ff", "#3c69ff", "#0009ff", "#0000d0", "#000088", "#00003f", "#000000", "#2c0000", "#730000", "#bc0000", "#fc0000", "#ff4f29", "#ffa570", "#ffe2b9", "#fffefa", "#d9f4ff", "#93c6ff", "#497aff", "#081cff", "#0000dd", "#000096", "#00004d", "#00000b", "#1f0000", "#650000", "#af0000", "#f10000", "#ff3d1c", "#ff9662", "#ffd9ab", "#fffbee", "#e6f9ff", "#a1d1ff", "#578aff", "#132fff", "#0000e9", "#0000a4", "#00005b", "#000016", "#130000", "#570000", "#a10000", "#e60000", "#ff2a11", "#ff8654", "#ffce9d", "#fff8e3", "#f1fcff", "#afdbff", "#659aff", "#1f41ff", "#0000f4", "#0000b2", "#000069", "#000022", "#080000", "#490000", "#930000", "#d90000", "#ff1805", "#ff7646", "#ffc38f", "#fff3d6", "#fcfeff", "#bce4ff", "#73a8ff", "#2c53ff", "#0000ff", "#0000c0", "#000077", "#00002f", "#000000", "#3c0000", "#850000", "#cd0000", "#ff0500", "#ff6539", "#ffb681", "#ffecca", "#ffffff", "#caecff", "#81b6ff", "#3965ff", "#0005ff", "#0000cd", "#000085", "#00003c", "#000000", "#2f0000", "#770000", "#c00000", "#ff0000", "#ff532c", "#ffa873", "#ffe4bc", "#fffefc", "#d6f3ff", "#8fc3ff", "#4676ff", "#0518ff", "#0000d9", "#000093", "#000049", "#000008", "#220000", "#690000", "#b20000", "#f40000", "#ff411f", "#ff9a65", "#ffdbaf", "#fffcf1", "#e3f8ff", "#9dceff", "#5486ff", "#112aff", "#0000e6", "#0000a1", "#000057", "#000013", "#160000", "#5b0000", "#a40000", "#e90000", "#ff2f13", "#ff8a57", "#ffd1a1", "#fff9e6", "#eefbff", "#abd9ff", "#6296ff", "#1c3dff", "#0000f1", "#0000af", "#000065", "#00001f", "#0b0000", "#4d0000", "#960000", "#dd0000", "#ff1c08", "#ff7a49", "#ffc693", "#fff4d9", "#fafeff", "#b9e2ff", "#70a5ff", "#294fff", "#0000fc", "#0000bc", "#000073", "#00002c", "#000000", "#3f0000", "#880000", "#d00000", "#ff0900", "#ff693c", "#ffb985", "#ffeecd", "#ffffff", "#c6eaff", "#7eb3ff", "#3560ff", "#0000ff", "#0000ca", "#000081", "#000039", "#000000", "#320000", "#7a0000", "#c30000", "#ff0000", "#ff582f", "#ffac77", "#ffe6c0", "#ffffff", "#d3f1ff", "#8cc0ff", "#4372ff", "#0313ff", "#0000d6", "#00008f", "#000046", "#000005", "#260000", "#6c0000", "#b60000", "#f70000", "#ff4622", "#ff9d69", "#ffdeb2", "#fffdf4", "#e0f7ff", "#9acbff", "#5082ff", "#0e26ff", "#0000e3", "#00009d", "#000054", "#000011", "#190000", "#5e0000", "#a80000", "#ec0000", "#ff3316", "#ff8e5b", "#ffd4a4", "#fffae9", "#ecfbff", "#a8d6ff", "#5e92ff", "#1938ff", "#0000ee", "#0000ab", "#000062", "#00001c", "#0e0000", "#500000", "#9a0000", "#e00000", "#ff210b", "#ff7e4d", "#ffc996", "#fff5dd", "#f7fdff", "#b6e0ff", "#6ca1ff", "#264aff", "#0000fa", "#0000b9", "#000070", "#000029", "#030000", "#430000", "#8c0000", "#d30000", "#ff0e00", "#ff6d3f", "#ffbc88", "#ffefd0", "#ffffff", "#c3e8ff", "#7aafff", "#325cff", "#0000ff", "#0000c6", "#00007e", "#000035", "#000000"], "gist_earth": ["#000000", "#01002b", "#010039", "#020043", "#03004e", "#030059", "#040064", "#05006e", "#050274", "#060574", "#070774", "#070975", "#080b75", "#090e75", "#091075", "#0a1275", "#0b1575", "#0b1776", "#0c1976", "#0d1c76", "#0d1e76", "#0e2076", "#0f2277", "#0f2577", "#102777", "#112977", "#112c77", "#122e77", "#133078", "#133278", "#143478", "#153778", "#153978", "#163b79", "#173d79", "#173f79", "#184179", "#194379", "#194579", "#1a477a", "#1b497a", "#1b4b7a", "#1c4d7a", "#1d4f7a", "#1d517b", "#1e537b", "#1f557b", "#1f577b", "#20597b", "#215a7b", "#215c7c", "#225e7c", "#23607c", "#23627c", "#24647c", "#25657d", "#25677d", "#26687d", "#276a7d", "#276b7d", "#286d7d", "#296f7e", "#29707e", "#2a727e", "#2b737e", "#2b757e", "#2c777f", "#2d787f", "#2d7a7f", "#2e7b7f", "#2f7d7f", "#2f7e7f", "#308080", "#30817e", "#31817d", "#31827c", "#32827b", "#328379", "#338378", "#338477", "#348576", "#348575", "#358673", "#358672", "#368771", "#368770", "#37886e", "#37896d", "#38896c", "#388a6b", "#388a6a", "#398b68", "#398c67", "#3a8c66", "#3a8d65", "#3b8d63", "#3b8e62", "#3c8e61", "#3c8f60", "#3d905f", "#3d905d", "#3e915c", "#3e915b", "#3f925a", "#3f9258", "#409357", "#409456", "#409455", "#419554", "#419552", "#429651", "#429650", "#43974f", "#43984d", "#44984c", "#44994b", "#45994a", "#459a49", "#479a47", "#4a9b46", "#4c9c47", "#4e9c47", "#509d48", "#539d48", "#559e49", "#579f4a", "#599f4a", "#5ba04b", "#5ea04b", "#60a14c", "#62a14c", "#64a24d", "#67a34e", "#69a34e", "#6ba44f", "#6da44f", "#6fa450", "#72a551", "#74a551", "#76a652", "#78a652", "#7aa752", "#7ca753", "#7da853", "#7fa853", "#81a854", "#82a954", "#84a954", "#86aa55", "#87aa55", "#89ab55", "#8aab56", "#8cab56", "#8eac56", "#8fac56", "#91ad57", "#93ad57", "#94ae57", "#96ae58", "#98af58", "#99af58", "#9baf59", "#9db059", "#9eb059", "#a0b15a", "#a2b15a", "#a3b25a", "#a5b25b", "#a7b25b", "#a8b35b", "#aab35c", "#abb45c", "#adb45c", "#afb55c", "#b0b55d", "#b2b65d", "#b4b65d", "#b5b65e", "#b7b75e", "#b7b65e", "#b8b55f", "#b8b45f", "#b9b35f", "#b9b360", "#b9b260", "#bab160", "#bab061", "#bbaf61", "#bbae61", "#bcad62", "#bcac62", "#bcac62", "#bdab62", "#bdaa63", "#bea963", "#bea863", "#bfa764", "#bfa664", "#bfa664", "#c0a565", "#c0a465", "#c1a367", "#c2a46a", "#c3a46c", "#c4a46f", "#c5a571", "#c6a574", "#c7a676", "#c8a779", "#caa87b", "#cba97e", "#ccaa80", "#cdaa82", "#ceab85", "#cfac87", "#d0ad8a", "#d1ae8c", "#d3af8f", "#d4b091", "#d5b194", "#d6b196", "#d7b298", "#d8b49b", "#d9b59d", "#dab7a0", "#dbb8a2", "#ddb9a5", "#debba7", "#dfbcaa", "#e0bdad", "#e1bfb0", "#e2c1b3", "#e3c3b6", "#e4c5b9", "#e6c7bc", "#e7c9bf", "#e8cbc2", "#e9cdc5", "#eacfc8", "#ebd1cb", "#ecd3ce", "#edd5d1", "#eed8d4", "#f0dad7", "#f1dcda", "#f2dedd", "#f3e1e0", "#f4e4e3", "#f5e7e6", "#f6eae9", "#f7ecec", "#f9efef", "#faf2f2", "#fbf5f5", "#fcf8f8", "#fdfbfb"], "gist_gray": ["#000000", "#010101", "#020202", "#030303", "#040404", "#050505", "#060606", "#070707", "#080808", "#090909", "#0a0a0a", "#0b0b0b", "#0c0c0c", "#0d0d0d", "#0e0e0e", "#0f0f0f", "#101010", "#111111", "#121212", "#131313", "#141414", "#151515", "#161616", "#171717", "#181818", "#191919", "#1a1a1a", "#1b1b1b", "#1c1c1c", "#1d1d1d", "#1e1e1e", "#1f1f1f", "#202020", "#212121", "#222222", "#232323", "#242424", "#252525", "#262626", "#272727", "#282828", "#292929", "#2a2a2a", "#2b2b2b", "#2c2c2c", "#2d2d2d", "#2e2e2e", "#2f2f2f", "#303030", "#313131", "#323232", "#333333", "#343434", "#353535", "#363636", "#373737", "#383838", "#393939", "#3a3a3a", "#3b3b3b", "#3c3c3c", "#3d3d3d", "#3e3e3e", "#3f3f3f", "#404040", "#414141", "#424242", "#434343", "#444444", "#454545", "#464646", "#474747", "#484848", "#494949", "#4a4a4a", "#4b4b4b", "#4c4c4c", "#4d4d4d", "#4e4e4e", "#4f4f4f", "#505050", "#515151", "#525252", "#535353", "#545454", "#555555", "#565656", "#575757", "#585858", "#595959", "#5a5a5a", "#5b5b5b", "#5c5c5c", "#5d5d5d", "#5e5e5e", "#5f5f5f", "#606060", "#616161", "#626262", "#636363", "#646464", "#656565", "#666666", "#676767", "#686868", "#696969", "#6a6a6a", "#6b6b6b", "#6c6c6c", "#6d6d6d", "#6e6e6e", "#6f6f6f", "#707070", "#717171", "#727272", "#737373", "#747474", "#757575", "#767676", "#777777", "#787878", "#797979", "#7a7a7a", "#7b7b7b", "#7c7c7c", "#7d7d7d", "#7e7e7e", "#7f7f7f", "#808080", "#818181", "#828282", "#838383", "#848484", "#858585", "#868686", "#878787", "#888888", "#898989", "#8a8a8a", "#8b8b8b", "#8c8c8c", "#8d8d8d", "#8e8e8e", "#8f8f8f", "#909090", "#919191", "#929292", "#939393", "#949494", "#959595", "#969696", "#979797", "#989898", "#999999", "#9a9a9a", "#9b9b9b", "#9c9c9c", "#9d9d9d", "#9e9e9e", "#9f9f9f", "#a0a0a0", "#a1a1a1", "#a2a2a2", "#a3a3a3", "#a4a4a4", "#a5a5a5", "#a6a6a6", "#a7a7a7", "#a8a8a8", "#a9a9a9", "#aaaaaa", "#ababab", "#acacac", "#adadad", "#aeaeae", "#afafaf", "#b0b0b0", "#b1b1b1", "#b2b2b2", "#b3b3b3", "#b4b4b4", "#b5b5b5", "#b6b6b6", "#b7b7b7", "#b8b8b8", "#b9b9b9", "#bababa", "#bbbbbb", "#bcbcbc", "#bdbdbd", "#bebebe", "#bfbfbf", "#c0c0c0", "#c1c1c1", "#c2c2c2", "#c3c3c3", "#c4c4c4", "#c5c5c5", "#c6c6c6", "#c7c7c7", "#c8c8c8", "#c9c9c9", "#cacaca", "#cbcbcb", "#cccccc", "#cdcdcd", "#cecece", "#cfcfcf", "#d0d0d0", "#d1d1d1", "#d2d2d2", "#d3d3d3", "#d4d4d4", "#d5d5d5", "#d6d6d6", "#d7d7d7", "#d8d8d8", "#d9d9d9", "#dadada", "#dbdbdb", "#dcdcdc", "#dddddd", "#dedede", "#dfdfdf", "#e0e0e0", "#e1e1e1", "#e2e2e2", "#e3e3e3", "#e4e4e4", "#e5e5e5", "#e6e6e6", "#e7e7e7", "#e8e8e8", "#e9e9e9", "#eaeaea", "#ebebeb", "#ececec", "#ededed", "#eeeeee", "#efefef", "#f0f0f0", "#f1f1f1", "#f2f2f2", "#f3f3f3", "#f4f4f4", "#f5f5f5", "#f6f6f6", "#f7f7f7", "#f8f8f8", "#f9f9f9", "#fafafa", "#fbfbfb", "#fcfcfc", "#fdfdfd", "#fefefe", "#ffffff"], "gist_heat": ["#000000", "#020000", "#030000", "#040000", "#060000", "#080000", "#090000", "#0a0000", "#0c0000", "#0e0000", "#0f0000", "#100000", "#120000", "#140000", "#150000", "#160000", "#180000", "#1a0000", "#1b0000", "#1c0000", "#1e0000", "#200000", "#210000", "#220000", "#240000", "#260000", "#270000", "#280000", "#2a0000", "#2c0000", "#2d0000", "#2e0000", "#300000", "#310000", "#330000", "#350000", "#360000", "#370000", "#390000", "#3b0000", "#3c0000", "#3d0000", "#3f0000", "#400000", "#420000", "#430000", "#450000", "#460000", "#480000", "#4a0000", "#4b0000", "#4d0000", "#4e0000", "#500000", "#510000", "#520000", "#540000", "#560000", "#570000", "#580000", "#5a0000", "#5b0000", "#5d0000", "#5e0000", "#600000", "#620000", "#630000", "#650000", "#660000", "#680000", "#690000", "#6a0000", "#6c0000", "#6e0000", "#6f0000", "#700000", "#720000", "#730000", "#750000", "#760000", "#780000", "#7a0000", "#7b0000", "#7d0000", "#7e0000", "#800000", "#810000", "#820000", "#840000", "#850000", "#870000", "#880000", "#8a0000", "#8b0000", "#8d0000", "#8e0000", "#900000", "#920000", "#930000", "#940000", "#960000", "#980000", "#990000", "#9b0000", "#9c0000", "#9e0000", "#9f0000", "#a00000", "#a20000", "#a30000", "#a50000", "#a60000", "#a80000", "#aa0000", "#ab0000", "#ac0000", "#ae0000", "#b00000", "#b10000", "#b20000", "#b40000", "#b50000", "#b70000", "#b80000", "#ba0000", "#bb0000", "#bd0000", "#be0000", "#c00100", "#c20300", "#c30500", "#c40700", "#c60900", "#c80b00", "#c90d00", "#cb0f00", "#cc1100", "#ce1300", "#cf1500", "#d01700", "#d21900", "#d41b00", "#d51d00", "#d61f00", "#d82100", "#da2300", "#db2500", "#dc2700", "#de2900", "#e02b00", "#e12d00", "#e22f00", "#e43100", "#e53300", "#e73500", "#e83700", "#ea3900", "#ec3b00", "#ed3d00", "#ee3f00", "#f04100", "#f24300", "#f34500", "#f44700", "#f64900", "#f84b00", "#f94d00", "#fb4f00", "#fc5100", "#fe5300", "#ff5500", "#ff5700", "#ff5900", "#ff5b00", "#ff5d00", "#ff5f00", "#ff6100", "#ff6300", "#ff6500", "#ff6700", "#ff6900", "#ff6b00", "#ff6d00", "#ff6f00", "#ff7100", "#ff7300", "#ff7500", "#ff7700", "#ff7900", "#ff7b00", "#ff7d00", "#ff7f00", "#ff8103", "#ff8307", "#ff850b", "#ff870f", "#ff8913", "#ff8b17", "#ff8d1b", "#ff8f1f", "#ff9123", "#ff9327", "#ff952b", "#ff972f", "#ff9933", "#ff9b37", "#ff9d3b", "#ff9f3f", "#ffa143", "#ffa347", "#ffa54b", "#ffa74f", "#ffa953", "#ffab57", "#ffad5b", "#ffaf5f", "#ffb163", "#ffb367", "#ffb56b", "#ffb76f", "#ffb973", "#ffbb77", "#ffbd7b", "#ffbf7f", "#ffc183", "#ffc387", "#ffc58b", "#ffc78f", "#ffc993", "#ffcb97", "#ffcd9b", "#ffcf9f", "#ffd1a3", "#ffd3a7", "#ffd5ab", "#ffd7af", "#ffd9b3", "#ffdbb7", "#ffddbb", "#ffdfbf", "#ffe1c3", "#ffe3c7", "#ffe5cb", "#ffe7cf", "#ffe9d3", "#ffebd7", "#ffeddb", "#ffefdf", "#fff1e3", "#fff3e7", "#fff5eb", "#fff7ef", "#fff9f3", "#fffbf7", "#fffdfb", "#ffffff"], "gist_ncar": ["#000080", "#000777", "#000f6d", "#001664", "#001d5a", "#002451", "#002c48", "#00333e", "#003a35", "#00422b", "#004922", "#005019", "#00580f", "#005f06", "#005816", "#005127", "#004b37", "#004448", "#003d59", "#003669", "#002f7a", "#00298b", "#00229b", "#001bac", "#0014bc", "#000ecd", "#0007de", "#0000ee", "#000eff", "#001cff", "#002aff", "#0038ff", "#0047ff", "#0055ff", "#0063ff", "#0071ff", "#007fff", "#008dff", "#009bff", "#00a9ff", "#00b8ff", "#00c0ff", "#00c6ff", "#00caff", "#00ceff", "#00d3ff", "#00d7ff", "#00dcff", "#00e0ff", "#00e5ff", "#00e9ff", "#00edff", "#00f2ff", "#00f6f8", "#00fbf2", "#00ffeb", "#00ffe5", "#00fede", "#00fed8", "#00fdd1", "#00fdcb", "#00fcc4", "#00fcbd", "#00fbb7", "#00fbb0", "#00faaa", "#00faa3", "#00fa9d", "#00fa92", "#00fa88", "#00fa7d", "#00fb73", "#00fb68", "#00fc5e", "#00fc54", "#00fd49", "#00fd3f", "#00fd34", "#00fe2a", "#00fe1f", "#06ff15", "#0dff0b", "#13fb00", "#19f700", "#20f400", "#26f000", "#2dec00", "#33e800", "#39e500", "#40e100", "#46dd00", "#4cd900", "#53d600", "#59d200", "#60ce00", "#66d100", "#68d500", "#6ad800", "#6cdb00", "#6ede00", "#70e200", "#72e500", "#74e800", "#76eb00", "#78ef00", "#7af200", "#7cf500", "#7ef804", "#80fc08", "#84ff0c", "#89ff10", "#8dff14", "#92ff18", "#96ff1c", "#9bff20", "#9fff24", "#a4ff28", "#a9ff2c", "#adff30", "#b2ff34", "#b6ff38", "#bbff3c", "#bfff38", "#c4ff34", "#c8ff30", "#cdff2c", "#d2ff28", "#d6ff24", "#dbff20", "#dfff1c", "#e4ff18", "#e8ff14", "#edff10", "#f1ff0c", "#f6fd08", "#fafa04", "#fff800", "#fff500", "#fff300", "#fff000", "#ffee00", "#ffeb00", "#ffe900", "#ffe600", "#ffe400", "#ffe100", "#ffdf00", "#ffdc00", "#ffda00", "#ffd801", "#ffd502", "#ffd303", "#ffd004", "#ffce05", "#ffcb06", "#ffc908", "#ffc609", "#ffc40a", "#ffc10b", "#ffbf0c", "#ffbc0d", "#ffba0e", "#ffb20d", "#ffaa0c", "#ffa10b", "#ff990a", "#ff9109", "#ff8908", "#ff8107", "#ff7807", "#ff7006", "#ff6805", "#ff6004", "#ff5803", "#ff5002", "#ff4701", "#ff4300", "#ff3e00", "#ff3900", "#ff3400", "#ff3000", "#ff2b00", "#ff2600", "#ff2100", "#ff1d00", "#ff1800", "#ff1300", "#ff0e00", "#ff0a00", "#ff0512", "#ff0023", "#ff0035", "#ff0047", "#ff0058", "#ff006a", "#ff007c", "#ff008e", "#ff009f", "#ff00b1", "#ff00c3", "#ff00d5", "#ff00e6", "#ff00f8", "#f803fc", "#f107ff", "#ea0aff", "#e40eff", "#dd11ff", "#d615ff", "#cf18ff", "#c81cff", "#c11fff", "#ba22ff", "#b326ff", "#ac29ff", "#a62dff", "#9f33fe", "#a439fd", "#aa3ffb", "#b044fa", "#b64af9", "#bc50f8", "#c256f7", "#c85cf5", "#ce62f4", "#d468f3", "#da6ef2", "#e074f1", "#e67aef", "#eb80ee", "#ec84ef", "#ed89ef", "#ee8df0", "#ee92f1", "#ef97f1", "#f09bf2", "#f0a0f2", "#f1a5f3", "#f2a9f4", "#f3aef4", "#f3b3f5", "#f4b7f5", "#f5bcf6", "#f5c0f7", "#f6c5f7", "#f7caf8", "#f8cef9", "#f8d3f9", "#f9d8fa", "#fadcfa", "#fae1fb", "#fbe5fc", "#fceafc", "#fdeffd", "#fdf3fd", "#fef8fe"], "gist_rainbow": ["#ff0029", "#ff0023", "#ff001e", "#ff0019", "#ff0013", "#ff000e", "#ff0009", "#ff0003", "#ff0200", "#ff0700", "#ff0d00", "#ff1200", "#ff1800", "#ff1d00", "#ff2200", "#ff2800", "#ff2d00", "#ff3300", "#ff3800", "#ff3d00", "#ff4300", "#ff4800", "#ff4e00", "#ff5300", "#ff5800", "#ff5e00", "#ff6300", "#ff6900", "#ff6e00", "#ff7300", "#ff7900", "#ff7e00", "#ff8400", "#ff8900", "#ff8e00", "#ff9400", "#ff9900", "#ff9f00", "#ffa400", "#ffa900", "#ffaf00", "#ffb400", "#ffba00", "#ffbf00", "#ffc400", "#ffca00", "#ffcf00", "#ffd500", "#ffda00", "#ffe000", "#ffe500", "#ffea00", "#fff000", "#fff500", "#fffb00", "#feff00", "#f9ff00", "#f3ff00", "#eeff00", "#e8ff00", "#e3ff00", "#deff00", "#d8ff00", "#d3ff00", "#cdff00", "#c8ff00", "#c3ff00", "#bdff00", "#b8ff00", "#b2ff00", "#adff00", "#a8ff00", "#a2ff00", "#9dff00", "#97ff00", "#92ff00", "#8dff00", "#87ff00", "#82ff00", "#7cff00", "#77ff00", "#72ff00", "#6cff00", "#67ff00", "#61ff00", "#5cff00", "#56ff00", "#51ff00", "#4cff00", "#46ff00", "#41ff00", "#3bff00", "#36ff00", "#31ff00", "#2bff00", "#26ff00", "#20ff00", "#1bff00", "#16ff00", "#10ff00", "#0bff00", "#05ff00", "#00ff00", "#00ff05", "#00ff0b", "#00ff10", "#00ff16", "#00ff1b", "#00ff20", "#00ff26", "#00ff2b", "#00ff30", "#00ff36", "#00ff3b", "#00ff41", "#00ff46", "#00ff4b", "#00ff51", "#00ff56", "#00ff5b", "#00ff61", "#00ff66", "#00ff6c", "#00ff71", "#00ff76", "#00ff7c", "#00ff81", "#00ff86", "#00ff8c", "#00ff91", "#00ff97", "#00ff9c", "#00ffa1", "#00ffa7", "#00ffac", "#00ffb1", "#00ffb7", "#00ffbc", "#00ffc2", "#00ffc7", "#00ffcc", "#00ffd2", "#00ffd7", "#00ffdc", "#00ffe2", "#00ffe7", "#00ffed", "#00fff2", "#00fff7", "#00fffd", "#00fcff", "#00f6ff", "#00f1ff", "#00ecff", "#00e6ff", "#00e1ff", "#00dbff", "#00d6ff", "#00d0ff", "#00cbff", "#00c6ff", "#00c0ff", "#00bbff", "#00b5ff", "#00b0ff", "#00aaff", "#00a5ff", "#00a0ff", "#009aff", "#0095ff", "#008fff", "#008aff", "#0084ff", "#007fff", "#0079ff", "#0074ff", "#006fff", "#0069ff", "#0064ff", "#005eff", "#0059ff", "#0053ff", "#004eff", "#0049ff", "#0043ff", "#003eff", "#0038ff", "#0033ff", "#002dff", "#0028ff", "#0023ff", "#001dff", "#0018ff", "#0012ff", "#000dff", "#0007ff", "#0002ff", "#0400ff", "#0900ff", "#0e00ff", "#1400ff", "#1900ff", "#1f00ff", "#2400ff", "#2a00ff", "#2f00ff", "#3400ff", "#3a00ff", "#3f00ff", "#4500ff", "#4a00ff", "#5000ff", "#5500ff", "#5a00ff", "#6000ff", "#6500ff", "#6b00ff", "#7000ff", "#7600ff", "#7b00ff", "#8100ff", "#8600ff", "#8b00ff", "#9100ff", "#9600ff", "#9c00ff", "#a100ff", "#a700ff", "#ac00ff", "#b100ff", "#b700ff", "#bc00ff", "#c200ff", "#c700ff", "#cd00ff", "#d200ff", "#d700ff", "#dd00ff", "#e200ff", "#e800ff", "#ed00ff", "#f300ff", "#f800ff", "#fe00ff", "#ff00fb", "#ff00f6", "#ff00f0", "#ff00eb", "#ff00e5", "#ff00e0", "#ff00da", "#ff00d5", "#ff00d0", "#ff00ca", "#ff00c5", "#ff00bf"], "gist_stern": ["#000000", "#120102", "#250204", "#370306", "#490408", "#5b050a", "#6e060c", "#80070e", "#920810", "#a50912", "#b70a14", "#c90b16", "#db0c18", "#ee0d1a", "#ff0e1c", "#fa0f1e", "#f51020", "#f01122", "#eb1224", "#e61326", "#e11428", "#dc152a", "#d7162c", "#d2172e", "#cd1830", "#c81932", "#c31a34", "#be1b36", "#b91c38", "#b41d3a", "#af1e3c", "#aa1f3e", "#a52040", "#a02142", "#9b2244", "#962346", "#912448", "#8c254a", "#87264c", "#82274e", "#7d2850", "#782952", "#732a54", "#6e2b56", "#692c58", "#642d5a", "#5f2e5c", "#5a2f5e", "#553060", "#503162", "#4b3264", "#463366", "#413468", "#3c356a", "#37366c", "#32376e", "#2d3870", "#293972", "#243a74", "#1f3b76", "#1a3c78", "#153d7a", "#103e7c", "#0b3f7e", "#404080", "#414182", "#424284", "#434386", "#444488", "#45458a", "#46468c", "#47478e", "#484890", "#494992", "#4a4a94", "#4b4b96", "#4c4c98", "#4d4d9a", "#4e4e9c", "#4f4f9e", "#5050a0", "#5151a2", "#5252a4", "#5353a6", "#5454a8", "#5555aa", "#5656ac", "#5757ae", "#5858b0", "#5959b2", "#5a5ab4", "#5b5bb6", "#5c5cb8", "#5d5dba", "#5e5ebc", "#5f5fbe", "#6060c0", "#6161c2", "#6262c4", "#6363c6", "#6464c8", "#6565ca", "#6666cc", "#6767ce", "#6868d0", "#6969d2", "#6a6ad4", "#6b6bd6", "#6c6cd8", "#6d6dda", "#6e6edc", "#6f6fde", "#7070e0", "#7171e2", "#7272e4", "#7373e6", "#7474e8", "#7575ea", "#7676ec", "#7777ee", "#7878f0", "#7979f2", "#7a7af4", "#7b7bf6", "#7c7cf8", "#7d7dfa", "#7e7efc", "#7f7ffe", "#8080fd", "#8181f9", "#8282f4", "#8383f0", "#8484ec", "#8585e8", "#8686e3", "#8787df", "#8888db", "#8989d7", "#8a8ad2", "#8b8bce", "#8c8cca", "#8d8dc6", "#8e8ec1", "#8f8fbd", "#9090b9", "#9191b5", "#9292b0", "#9393ac", "#9494a8", "#9595a4", "#96969f", "#97979b", "#989897", "#999992", "#9a9a8e", "#9b9b8a", "#9c9c86", "#9d9d81", "#9e9e7d", "#9f9f79", "#a0a075", "#a1a170", "#a2a26c", "#a3a368", "#a4a464", "#a5a55f", "#a6a65b", "#a7a757", "#a8a853", "#a9a94e", "#aaaa4a", "#abab46", "#acac42", "#adad3d", "#aeae39", "#afaf35", "#b0b031", "#b1b12c", "#b2b228", "#b3b324", "#b4b420", "#b5b51b", "#b6b617", "#b7b713", "#b8b80f", "#b9b90a", "#baba06", "#bbbb02", "#bcbc02", "#bdbd06", "#bebe0a", "#bfbf0d", "#c0c011", "#c1c115", "#c2c219", "#c3c31d", "#c4c420", "#c5c524", "#c6c628", "#c7c72c", "#c8c82f", "#c9c933", "#caca37", "#cbcb3b", "#cccc3f", "#cdcd42", "#cece46", "#cfcf4a", "#d0d04e", "#d1d151", "#d2d255", "#d3d359", "#d4d45d", "#d5d561", "#d6d664", "#d7d768", "#d8d86c", "#d9d970", "#dada73", "#dbdb77", "#dcdc7b", "#dddd7f", "#dede82", "#dfdf86", "#e0e08a", "#e1e18e", "#e2e292", "#e3e395", "#e4e499", "#e5e59d", "#e6e6a1", "#e7e7a4", "#e8e8a8", "#e9e9ac", "#eaeab0", "#ebebb4", "#ececb7", "#ededbb", "#eeeebf", "#efefc3", "#f0f0c6", "#f1f1ca", "#f2f2ce", "#f3f3d2", "#f4f4d5", "#f5f5d9", "#f6f6dd", "#f7f7e1", "#f8f8e5", "#f9f9e8", "#fafaec", "#fbfbf0", "#fcfcf4", "#fdfdf7", "#fefefb", "#ffffff"], "gist_yarg": ["#ffffff", "#fefefe", "#fdfdfd", "#fcfcfc", "#fbfbfb", "#fafafa", "#f9f9f9", "#f8f8f8", "#f7f7f7", "#f6f6f6", "#f5f5f5", "#f4f4f4", "#f3f3f3", "#f2f2f2", "#f1f1f1", "#f0f0f0", "#efefef", "#eeeeee", "#ededed", "#ececec", "#ebebeb", "#eaeaea", "#e9e9e9", "#e8e8e8", "#e7e7e7", "#e6e6e6", "#e5e5e5", "#e4e4e4", "#e3e3e3", "#e2e2e2", "#e1e1e1", "#e0e0e0", "#dfdfdf", "#dedede", "#dddddd", "#dcdcdc", "#dbdbdb", "#dadada", "#d9d9d9", "#d8d8d8", "#d7d7d7", "#d6d6d6", "#d5d5d5", "#d4d4d4", "#d3d3d3", "#d2d2d2", "#d1d1d1", "#d0d0d0", "#cfcfcf", "#cecece", "#cdcdcd", "#cccccc", "#cbcbcb", "#cacaca", "#c9c9c9", "#c8c8c8", "#c7c7c7", "#c6c6c6", "#c5c5c5", "#c4c4c4", "#c3c3c3", "#c2c2c2", "#c1c1c1", "#c0c0c0", "#bfbfbf", "#bebebe", "#bdbdbd", "#bcbcbc", "#bbbbbb", "#bababa", "#b9b9b9", "#b8b8b8", "#b7b7b7", "#b6b6b6", "#b5b5b5", "#b4b4b4", "#b3b3b3", "#b2b2b2", "#b1b1b1", "#b0b0b0", "#afafaf", "#aeaeae", "#adadad", "#acacac", "#ababab", "#aaaaaa", "#a9a9a9", "#a8a8a8", "#a7a7a7", "#a6a6a6", "#a5a5a5", "#a4a4a4", "#a3a3a3", "#a2a2a2", "#a1a1a1", "#a0a0a0", "#9f9f9f", "#9e9e9e", "#9d9d9d", "#9c9c9c", "#9b9b9b", "#9a9a9a", "#999999", "#989898", "#979797", "#969696", "#959595", "#949494", "#939393", "#929292", "#919191", "#909090", "#8f8f8f", "#8e8e8e", "#8d8d8d", "#8c8c8c", "#8b8b8b", "#8a8a8a", "#898989", "#888888", "#878787", "#868686", "#858585", "#848484", "#838383", "#828282", "#818181", "#808080", "#7f7f7f", "#7e7e7e", "#7d7d7d", "#7c7c7c", "#7b7b7b", "#7a7a7a", "#797979", "#787878", "#777777", "#767676", "#757575", "#747474", "#737373", "#727272", "#717171", "#707070", "#6f6f6f", "#6e6e6e", "#6d6d6d", "#6c6c6c", "#6b6b6b", "#6a6a6a", "#696969", "#686868", "#676767", "#666666", "#656565", "#646464", "#636363", "#626262", "#616161", "#606060", "#5f5f5f", "#5e5e5e", "#5d5d5d", "#5c5c5c", "#5b5b5b", "#5a5a5a", "#595959", "#585858", "#575757", "#565656", "#555555", "#545454", "#535353", "#525252", "#515151", "#505050", "#4f4f4f", "#4e4e4e", "#4d4d4d", "#4c4c4c", "#4b4b4b", "#4a4a4a", "#494949", "#484848", "#474747", "#464646", "#454545", "#444444", "#434343", "#424242", "#414141", "#404040", "#3f3f3f", "#3e3e3e", "#3d3d3d", "#3c3c3c", "#3b3b3b", "#3a3a3a", "#393939", "#383838", "#373737", "#363636", "#353535", "#343434", "#333333", "#323232", "#313131", "#303030", "#2f2f2f", "#2e2e2e", "#2d2d2d", "#2c2c2c", "#2b2b2b", "#2a2a2a", "#292929", "#282828", "#272727", "#262626", "#252525", "#242424", "#232323", "#222222", "#212121", "#202020", "#1f1f1f", "#1e1e1e", "#1d1d1d", "#1c1c1c", "#1b1b1b", "#1a1a1a", "#191919", "#181818", "#171717", "#161616", "#151515", "#141414", "#131313", "#121212", "#111111", "#101010", "#0f0f0f", "#0e0e0e", "#0d0d0d", "#0c0c0c", "#0b0b0b", "#0a0a0a", "#090909", "#080808", "#070707", "#060606", "#050505", "#040404", "#030303", "#020202", "#010101", "#000000"], "gnuplot": ["#000000", "#100006", "#17000d", "#1c0013", "#200019", "#24001f", "#270026", "#2a002c", "#2d0032", "#300038", "#32003e", "#350044", "#37004a", "#3a0050", "#3c0056", "#3e005c", "#400062", "#420068", "#44006d", "#460073", "#470079", "#49007e", "#4b0084", "#4d0089", "#4e008e", "#500093", "#510098", "#53009d", "#5400a2", "#5600a7", "#5700ac", "#5900b0", "#5a01b5", "#5c01b9", "#5d01be", "#5e01c2", "#6001c6", "#6101ca", "#6201cd", "#6401d1", "#6501d5", "#6601d8", "#6701db", "#6901de", "#6a01e1", "#6b01e4", "#6c01e7", "#6d02ea", "#6f02ec", "#7002ee", "#7102f1", "#7202f3", "#7302f4", "#7402f6", "#7502f8", "#7603f9", "#7703fa", "#7903fb", "#7a03fc", "#7b03fd", "#7c03fe", "#7d03fe", "#7e04ff", "#7f04ff", "#8004ff", "#8104ff", "#8204ff", "#8305fe", "#8405fe", "#8505fd", "#8605fc", "#8706fb", "#8706fa", "#8806f8", "#8906f7", "#8a06f5", "#8b07f3", "#8c07f2", "#8d07ef", "#8e08ed", "#8f08eb", "#9008e8", "#9108e6", "#9109e3", "#9209e0", "#9309dd", "#940ada", "#950ad6", "#960ad3", "#970bcf", "#970bcb", "#980cc8", "#990cc4", "#9a0cc0", "#9b0dbb", "#9c0db7", "#9c0eb3", "#9d0eae", "#9e0ea9", "#9f0fa5", "#a00fa0", "#a0109b", "#a11096", "#a21191", "#a3118c", "#a41286", "#a41281", "#a5137b", "#a61376", "#a71470", "#a7146b", "#a81565", "#a9165f", "#aa1659", "#aa1753", "#ab174d", "#ac1847", "#ad1941", "#ad193b", "#ae1a35", "#af1b2f", "#b01b29", "#b01c22", "#b11d1c", "#b21d16", "#b31e10", "#b31f09", "#b42003", "#b52000", "#b52100", "#b62200", "#b72300", "#b72300", "#b82400", "#b92500", "#ba2600", "#ba2700", "#bb2800", "#bc2800", "#bc2900", "#bd2a00", "#be2b00", "#be2c00", "#bf2d00", "#c02e00", "#c02f00", "#c13000", "#c23100", "#c23200", "#c33300", "#c43400", "#c43500", "#c53600", "#c63700", "#c63800", "#c73900", "#c73a00", "#c83c00", "#c93d00", "#c93e00", "#ca3f00", "#cb4000", "#cb4100", "#cc4300", "#cc4400", "#cd4500", "#ce4600", "#ce4800", "#cf4900", "#d04a00", "#d04c00", "#d14d00", "#d14e00", "#d25000", "#d35100", "#d35200", "#d45400", "#d45500", "#d55700", "#d65800", "#d65a00", "#d75b00", "#d75d00", "#d85e00", "#d96000", "#d96100", "#da6300", "#da6500", "#db6600", "#dc6800", "#dc6900", "#dd6b00", "#dd6d00", "#de6f00", "#de7000", "#df7200", "#e07400", "#e07600", "#e17700", "#e17900", "#e27b00", "#e27d00", "#e37f00", "#e48100", "#e48300", "#e58400", "#e58600", "#e68800", "#e68a00", "#e78c00", "#e78e00", "#e89000", "#e99300", "#e99500", "#ea9700", "#ea9900", "#eb9b00", "#eb9d00", "#ec9f00", "#eca200", "#eda400", "#eda600", "#eea800", "#eeab00", "#efad00", "#f0af00", "#f0b200", "#f1b400", "#f1b600", "#f2b900", "#f2bb00", "#f3be00", "#f3c000", "#f4c300", "#f4c500", "#f5c800", "#f5ca00", "#f6cd00", "#f6cf00", "#f7d200", "#f7d500", "#f8d700", "#f8da00", "#f9dd00", "#f9df00", "#fae200", "#fae500", "#fbe800", "#fbeb00", "#fced00", "#fcf000", "#fdf300", "#fdf600", "#fef900", "#fefc00", "#ffff00"], "gnuplot2": ["#000000", "#000004", "#000008", "#00000c", "#000010", "#000014", "#000018", "#00001c", "#000020", "#000024", "#000028", "#00002c", "#000030", "#000034", "#000038", "#00003c", "#000040", "#000044", "#000048", "#00004c", "#000050", "#000054", "#000058", "#00005c", "#000060", "#000064", "#000068", "#00006c", "#000070", "#000074", "#000078", "#00007c", "#000080", "#000084", "#000088", "#00008c", "#000090", "#000094", "#000098", "#00009c", "#0000a0", "#0000a4", "#0000a8", "#0000ac", "#0000b0", "#0000b4", "#0000b8", "#0000bc", "#0000c0", "#0000c4", "#0000c8", "#0000cc", "#0000d0", "#0000d4", "#0000d8", "#0000dc", "#0000e0", "#0000e4", "#0000e8", "#0000ec", "#0000f0", "#0000f4", "#0000f8", "#0000fc", "#0100ff", "#0400ff", "#0700ff", "#0a00ff", "#0d00ff", "#1000ff", "#1400ff", "#1700ff", "#1a00ff", "#1d00ff", "#2000ff", "#2300ff", "#2600ff", "#2900ff", "#2d00ff", "#3000ff", "#3300ff", "#3600ff", "#3900ff", "#3c00ff", "#3f00ff", "#4200ff", "#4600ff", "#4900ff", "#4c00ff", "#4f00ff", "#5200ff", "#5500ff", "#5800ff", "#5b00ff", "#5f00ff", "#6200ff", "#6500ff", "#6800ff", "#6b00ff", "#6e00ff", "#7100ff", "#7400ff", "#7800ff", "#7b00ff", "#7e00ff", "#8100ff", "#8400ff", "#8700ff", "#8a02fd", "#8d04fb", "#9106f9", "#9408f7", "#970af5", "#9a0cf3", "#9d0ef1", "#a010ef", "#a312ed", "#a614eb", "#aa16e9", "#ad18e7", "#b01ae5", "#b31ce3", "#b61ee1", "#b920df", "#bc22dd", "#bf24db", "#c326d9", "#c628d7", "#c92ad5", "#cc2cd3", "#cf2ed1", "#d230cf", "#d532cd", "#d834cb", "#dc36c9", "#df38c7", "#e23ac5", "#e53cc3", "#e83ec1", "#eb40bf", "#ee42bd", "#f144bb", "#f546b9", "#f848b7", "#fb4ab5", "#fe4cb3", "#ff4eb1", "#ff50af", "#ff52ad", "#ff54ab", "#ff56a9", "#ff58a7", "#ff5aa5", "#ff5ca3", "#ff5ea1", "#ff609f", "#ff629d", "#ff649b", "#ff6699", "#ff6897", "#ff6a95", "#ff6c93", "#ff6e91", "#ff708f", "#ff728d", "#ff748b", "#ff7689", "#ff7887", "#ff7a85", "#ff7c83", "#ff7e81", "#ff807f", "#ff827d", "#ff847b", "#ff8679", "#ff8877", "#ff8a75", "#ff8c73", "#ff8e71", "#ff906f", "#ff926d", "#ff946b", "#ff9669", "#ff9867", "#ff9a65", "#ff9c63", "#ff9e61", "#ffa05f", "#ffa25d", "#ffa45b", "#ffa659", "#ffa857", "#ffaa55", "#ffac53", "#ffae51", "#ffb04f", "#ffb24d", "#ffb44b", "#ffb649", "#ffb847", "#ffba45", "#ffbc43", "#ffbe41", "#ffc03f", "#ffc23d", "#ffc43b", "#ffc639", "#ffc837", "#ffca35", "#ffcc33", "#ffce31", "#ffd02f", "#ffd22d", "#ffd42b", "#ffd629", "#ffd827", "#ffda25", "#ffdc23", "#ffde21", "#ffe01f", "#ffe21d", "#ffe41b", "#ffe619", "#ffe817", "#ffea15", "#ffec13", "#ffee11", "#fff00f", "#fff20d", "#fff40b", "#fff609", "#fff807", "#fffa05", "#fffc03", "#fffe01", "#ffff05", "#ffff11", "#ffff1e", "#ffff2a", "#ffff37", "#ffff43", "#ffff50", "#ffff5c", "#ffff69", "#ffff75", "#ffff82", "#ffff8e", "#ffff9b", "#ffffa7", "#ffffb4", "#ffffc0", "#ffffcd", "#ffffda", "#ffffe6", "#fffff3", "#ffffff"], "gray": ["#000000", "#010101", "#020202", "#030303", "#040404", "#050505", "#060606", "#070707", "#080808", "#090909", "#0a0a0a", "#0b0b0b", "#0c0c0c", "#0d0d0d", "#0e0e0e", "#0f0f0f", "#101010", "#111111", "#121212", "#131313", "#141414", "#151515", "#161616", "#171717", "#181818", "#191919", "#1a1a1a", "#1b1b1b", "#1c1c1c", "#1d1d1d", "#1e1e1e", "#1f1f1f", "#202020", "#212121", "#222222", "#232323", "#242424", "#252525", "#262626", "#272727", "#282828", "#292929", "#2a2a2a", "#2b2b2b", "#2c2c2c", "#2d2d2d", "#2e2e2e", "#2f2f2f", "#303030", "#313131", "#323232", "#333333", "#343434", "#353535", "#363636", "#373737", "#383838", "#393939", "#3a3a3a", "#3b3b3b", "#3c3c3c", "#3d3d3d", "#3e3e3e", "#3f3f3f", "#404040", "#414141", "#424242", "#434343", "#444444", "#454545", "#464646", "#474747", "#484848", "#494949", "#4a4a4a", "#4b4b4b", "#4c4c4c", "#4d4d4d", "#4e4e4e", "#4f4f4f", "#505050", "#515151", "#525252", "#535353", "#545454", "#555555", "#565656", "#575757", "#585858", "#595959", "#5a5a5a", "#5b5b5b", "#5c5c5c", "#5d5d5d", "#5e5e5e", "#5f5f5f", "#606060", "#616161", "#626262", "#636363", "#646464", "#656565", "#666666", "#676767", "#686868", "#696969", "#6a6a6a", "#6b6b6b", "#6c6c6c", "#6d6d6d", "#6e6e6e", "#6f6f6f", "#707070", "#717171", "#727272", "#737373", "#747474", "#757575", "#767676", "#777777", "#787878", "#797979", "#7a7a7a", "#7b7b7b", "#7c7c7c", "#7d7d7d", "#7e7e7e", "#7f7f7f", "#808080", "#818181", "#828282", "#838383", "#848484", "#858585", "#868686", "#878787", "#888888", "#898989", "#8a8a8a", "#8b8b8b", "#8c8c8c", "#8d8d8d", "#8e8e8e", "#8f8f8f", "#909090", "#919191", "#929292", "#939393", "#949494", "#959595", "#969696", "#979797", "#989898", "#999999", "#9a9a9a", "#9b9b9b", "#9c9c9c", "#9d9d9d", "#9e9e9e", "#9f9f9f", "#a0a0a0", "#a1a1a1", "#a2a2a2", "#a3a3a3", "#a4a4a4", "#a5a5a5", "#a6a6a6", "#a7a7a7", "#a8a8a8", "#a9a9a9", "#aaaaaa", "#ababab", "#acacac", "#adadad", "#aeaeae", "#afafaf", "#b0b0b0", "#b1b1b1", "#b2b2b2", "#b3b3b3", "#b4b4b4", "#b5b5b5", "#b6b6b6", "#b7b7b7", "#b8b8b8", "#b9b9b9", "#bababa", "#bbbbbb", "#bcbcbc", "#bdbdbd", "#bebebe", "#bfbfbf", "#c0c0c0", "#c1c1c1", "#c2c2c2", "#c3c3c3", "#c4c4c4", "#c5c5c5", "#c6c6c6", "#c7c7c7", "#c8c8c8", "#c9c9c9", "#cacaca", "#cbcbcb", "#cccccc", "#cdcdcd", "#cecece", "#cfcfcf", "#d0d0d0", "#d1d1d1", "#d2d2d2", "#d3d3d3", "#d4d4d4", "#d5d5d5", "#d6d6d6", "#d7d7d7", "#d8d8d8", "#d9d9d9", "#dadada", "#dbdbdb", "#dcdcdc", "#dddddd", "#dedede", "#dfdfdf", "#e0e0e0", "#e1e1e1", "#e2e2e2", "#e3e3e3", "#e4e4e4", "#e5e5e5", "#e6e6e6", "#e7e7e7", "#e8e8e8", "#e9e9e9", "#eaeaea", "#ebebeb", "#ececec", "#ededed", "#eeeeee", "#efefef", "#f0f0f0", "#f1f1f1", "#f2f2f2", "#f3f3f3", "#f4f4f4", "#f5f5f5", "#f6f6f6", "#f7f7f7", "#f8f8f8", "#f9f9f9", "#fafafa", "#fbfbfb", "#fcfcfc", "#fdfdfd", "#fefefe", "#ffffff"], "hot": ["#0b0000", "#0d0000", "#100000", "#120000", "#150000", "#180000", "#1a0000", "#1d0000", "#200000", "#220000", "#250000", "#270000", "#2a0000", "#2d0000", "#2f0000", "#320000", "#350000", "#370000", "#3a0000", "#3c0000", "#3f0000", "#420000", "#440000", "#470000", "#4a0000", "#4c0000", "#4f0000", "#510000", "#540000", "#570000", "#590000", "#5c0000", "#5f0000", "#610000", "#640000", "#660000", "#690000", "#6c0000", "#6e0000", "#710000", "#740000", "#760000", "#790000", "#7b0000", "#7e0000", "#810000", "#830000", "#860000", "#890000", "#8b0000", "#8e0000", "#900000", "#930000", "#960000", "#980000", "#9b0000", "#9e0000", "#a00000", "#a30000", "#a50000", "#a80000", "#ab0000", "#ad0000", "#b00000", "#b30000", "#b50000", "#b80000", "#ba0000", "#bd0000", "#c00000", "#c20000", "#c50000", "#c80000", "#ca0000", "#cd0000", "#cf0000", "#d20000", "#d50000", "#d70000", "#da0000", "#dd0000", "#df0000", "#e20000", "#e40000", "#e70000", "#ea0000", "#ec0000", "#ef0000", "#f20000", "#f40000", "#f70000", "#f90000", "#fc0000", "#ff0000", "#ff0200", "#ff0500", "#ff0800", "#ff0a00", "#ff0d00", "#ff1000", "#ff1200", "#ff1500", "#ff1700", "#ff1a00", "#ff1d00", "#ff1f00", "#ff2200", "#ff2500", "#ff2700", "#ff2a00", "#ff2c00", "#ff2f00", "#ff3200", "#ff3400", "#ff3700", "#ff3a00", "#ff3c00", "#ff3f00", "#ff4100", "#ff4400", "#ff4700", "#ff4900", "#ff4c00", "#ff4f00", "#ff5100", "#ff5400", "#ff5600", "#ff5900", "#ff5c00", "#ff5e00", "#ff6100", "#ff6400", "#ff6600", "#ff6900", "#ff6b00", "#ff6e00", "#ff7100", "#ff7300", "#ff7600", "#ff7900", "#ff7b00", "#ff7e00", "#ff8000", "#ff8300", "#ff8600", "#ff8800", "#ff8b00", "#ff8e00", "#ff9000", "#ff9300", "#ff9500", "#ff9800", "#ff9b00", "#ff9d00", "#ffa000", "#ffa200", "#ffa500", "#ffa800", "#ffaa00", "#ffad00", "#ffb000", "#ffb200", "#ffb500", "#ffb700", "#ffba00", "#ffbd00", "#ffbf00", "#ffc200", "#ffc500", "#ffc700", "#ffca00", "#ffcc00", "#ffcf00", "#ffd200", "#ffd400", "#ffd700", "#ffda00", "#ffdc00", "#ffdf00", "#ffe100", "#ffe400", "#ffe700", "#ffe900", "#ffec00", "#ffef00", "#fff100", "#fff400", "#fff600", "#fff900", "#fffc00", "#fffe00", "#ffff03", "#ffff07", "#ffff0b", "#ffff0f", "#ffff13", "#ffff17", "#ffff1b", "#ffff1f", "#ffff22", "#ffff26", "#ffff2a", "#ffff2e", "#ffff32", "#ffff36", "#ffff3a", "#ffff3e", "#ffff42", "#ffff46", "#ffff4a", "#ffff4e", "#ffff52", "#ffff56", "#ffff5a", "#ffff5e", "#ffff61", "#ffff65", "#ffff69", "#ffff6d", "#ffff71", "#ffff75", "#ffff79", "#ffff7d", "#ffff81", "#ffff85", "#ffff89", "#ffff8d", "#ffff91", "#ffff95", "#ffff99", "#ffff9d", "#ffffa0", "#ffffa4", "#ffffa8", "#ffffac", "#ffffb0", "#ffffb4", "#ffffb8", "#ffffbc", "#ffffc0", "#ffffc4", "#ffffc8", "#ffffcc", "#ffffd0", "#ffffd4", "#ffffd8", "#ffffdc", "#ffffdf", "#ffffe3", "#ffffe7", "#ffffeb", "#ffffef", "#fffff3", "#fffff7", "#fffffb", "#ffffff"], "hsv": ["#ff0000", "#ff0600", "#ff0c00", "#ff1200", "#ff1800", "#ff1e00", "#ff2300", "#ff2900", "#ff2f00", "#ff3500", "#ff3b00", "#ff4100", "#ff4700", "#ff4d00", "#ff5300", "#ff5900", "#ff5f00", "#ff6400", "#ff6a00", "#ff7000", "#ff7600", "#ff7c00", "#ff8200", "#ff8800", "#ff8e00", "#ff9400", "#ff9a00", "#ff9f00", "#ffa500", "#ffab00", "#ffb100", "#ffb700", "#ffbd00", "#ffc300", "#ffc900", "#ffcf00", "#ffd500", "#ffdb00", "#ffe000", "#ffe600", "#ffec00", "#fef100", "#fcf500", "#faf900", "#f8fd00", "#f4ff00", "#eeff00", "#e8ff00", "#e2ff00", "#ddff00", "#d7ff00", "#d1ff00", "#cbff00", "#c5ff00", "#bfff00", "#b9ff00", "#b3ff00", "#adff00", "#a7ff00", "#a2ff00", "#9cff00", "#96ff00", "#90ff00", "#8aff00", "#84ff00", "#7eff00", "#78ff00", "#72ff00", "#6cff00", "#66ff00", "#61ff00", "#5bff00", "#55ff00", "#4fff00", "#49ff00", "#43ff00", "#3dff00", "#37ff00", "#31ff00", "#2bff00", "#25ff00", "#20ff00", "#1aff00", "#14ff00", "#0eff00", "#08ff00", "#06ff04", "#04ff08", "#02ff0c", "#00ff10", "#00ff16", "#00ff1b", "#00ff21", "#00ff27", "#00ff2d", "#00ff33", "#00ff39", "#00ff3f", "#00ff45", "#00ff4b", "#00ff51", "#00ff57", "#00ff5c", "#00ff62", "#00ff68", "#00ff6e", "#00ff74", "#00ff7a", "#00ff80", "#00ff86", "#00ff8c", "#00ff92", "#00ff97", "#00ff9d", "#00ffa3", "#00ffa9", "#00ffaf", "#00ffb5", "#00ffbb", "#00ffc1", "#00ffc7", "#00ffcd", "#00ffd3", "#00ffd8", "#00ffde", "#00ffe4", "#00ffea", "#00fff0", "#00fff6", "#00fffc", "#00fcff", "#00f6ff", "#00f0ff", "#00eaff", "#00e5ff", "#00dfff", "#00d9ff", "#00d3ff", "#00cdff", "#00c7ff", "#00c1ff", "#00bbff", "#00b5ff", "#00afff", "#00aaff", "#00a4ff", "#009eff", "#0098ff", "#0092ff", "#008cff", "#0086ff", "#0080ff", "#007aff", "#0074ff", "#006eff", "#0069ff", "#0063ff", "#005dff", "#0057ff", "#0051ff", "#004bff", "#0045ff", "#003fff", "#0039ff", "#0033ff", "#002dff", "#0028ff", "#0022ff", "#001cff", "#0016ff", "#0010ff", "#020cff", "#0408ff", "#0604ff", "#0800ff", "#0e00ff", "#1300ff", "#1900ff", "#1f00ff", "#2500ff", "#2b00ff", "#3100ff", "#3700ff", "#3d00ff", "#4300ff", "#4900ff", "#4f00ff", "#5400ff", "#5a00ff", "#6000ff", "#6600ff", "#6c00ff", "#7200ff", "#7800ff", "#7e00ff", "#8400ff", "#8a00ff", "#9000ff", "#9500ff", "#9b00ff", "#a100ff", "#a700ff", "#ad00ff", "#b300ff", "#b900ff", "#bf00ff", "#c500ff", "#cb00ff", "#d000ff", "#d600ff", "#dc00ff", "#e200ff", "#e800ff", "#ee00ff", "#f400ff", "#f800fd", "#fa00f9", "#fc00f5", "#fe00f1", "#ff00ed", "#ff00e7", "#ff00e1", "#ff00db", "#ff00d5", "#ff00cf", "#ff00c9", "#ff00c3", "#ff00bd", "#ff00b7", "#ff00b1", "#ff00ac", "#ff00a6", "#ff00a0", "#ff009a", "#ff0094", "#ff008e", "#ff0088", "#ff0082", "#ff007c", "#ff0076", "#ff0071", "#ff006b", "#ff0065", "#ff005f", "#ff0059", "#ff0053", "#ff004d", "#ff0047", "#ff0041", "#ff003b", "#ff0035", "#ff0030", "#ff002a", "#ff0024", "#ff001e", "#ff0018"], "jet": ["#000080", "#000084", "#000089", "#00008d", "#000092", "#000096", "#00009b", "#00009f", "#0000a4", "#0000a8", "#0000ad", "#0000b2", "#0000b6", "#0000bb", "#0000bf", "#0000c4", "#0000c8", "#0000cd", "#0000d1", "#0000d6", "#0000da", "#0000df", "#0000e3", "#0000e8", "#0000ed", "#0000f1", "#0000f6", "#0000fa", "#0000ff", "#0000ff", "#0000ff", "#0000ff", "#0000ff", "#0004ff", "#0008ff", "#000cff", "#0010ff", "#0014ff", "#0018ff", "#001cff", "#0020ff", "#0024ff", "#0028ff", "#002cff", "#0030ff", "#0034ff", "#0038ff", "#003cff", "#0040ff", "#0044ff", "#0048ff", "#004cff", "#0050ff", "#0054ff", "#0058ff", "#005cff", "#0060ff", "#0064ff", "#0068ff", "#006cff", "#0070ff", "#0074ff", "#0078ff", "#007cff", "#0080ff", "#0084ff", "#0088ff", "#008cff", "#0090ff", "#0094ff", "#0098ff", "#009cff", "#00a0ff", "#00a4ff", "#00a8ff", "#00acff", "#00b0ff", "#00b4ff", "#00b8ff", "#00bcff", "#00c0ff", "#00c4ff", "#00c8ff", "#00ccff", "#00d0ff", "#00d4ff", "#00d8ff", "#00dcfe", "#00e0fb", "#00e4f8", "#02e8f4", "#06ecf1", "#09f0ee", "#0cf4eb", "#0ff8e7", "#13fce4", "#16ffe1", "#19ffde", "#1cffdb", "#1fffd7", "#23ffd4", "#26ffd1", "#29ffce", "#2cffca", "#30ffc7", "#33ffc4", "#36ffc1", "#39ffbe", "#3cffba", "#40ffb7", "#43ffb4", "#46ffb1", "#49ffad", "#4dffaa", "#50ffa7", "#53ffa4", "#56ffa0", "#5aff9d", "#5dff9a", "#60ff97", "#63ff94", "#66ff90", "#6aff8d", "#6dff8a", "#70ff87", "#73ff83", "#77ff80", "#7aff7d", "#7dff7a", "#80ff77", "#83ff73", "#87ff70", "#8aff6d", "#8dff6a", "#90ff66", "#94ff63", "#97ff60", "#9aff5d", "#9dff5a", "#a0ff56", "#a4ff53", "#a7ff50", "#aaff4d", "#adff49", "#b1ff46", "#b4ff43", "#b7ff40", "#baff3c", "#beff39", "#c1ff36", "#c4ff33", "#c7ff30", "#caff2c", "#ceff29", "#d1ff26", "#d4ff23", "#d7ff1f", "#dbff1c", "#deff19", "#e1ff16", "#e4ff13", "#e7ff0f", "#ebff0c", "#eeff09", "#f1fc06", "#f4f802", "#f8f500", "#fbf100", "#feed00", "#ffea00", "#ffe600", "#ffe200", "#ffde00", "#ffdb00", "#ffd700", "#ffd300", "#ffd000", "#ffcc00", "#ffc800", "#ffc400", "#ffc100", "#ffbd00", "#ffb900", "#ffb600", "#ffb200", "#ffae00", "#ffab00", "#ffa700", "#ffa300", "#ff9f00", "#ff9c00", "#ff9800", "#ff9400", "#ff9100", "#ff8d00", "#ff8900", "#ff8600", "#ff8200", "#ff7e00", "#ff7a00", "#ff7700", "#ff7300", "#ff6f00", "#ff6c00", "#ff6800", "#ff6400", "#ff6000", "#ff5d00", "#ff5900", "#ff5500", "#ff5200", "#ff4e00", "#ff4a00", "#ff4700", "#ff4300", "#ff3f00", "#ff3b00", "#ff3800", "#ff3400", "#ff3000", "#ff2d00", "#ff2900", "#ff2500", "#ff2200", "#ff1e00", "#ff1a00", "#ff1600", "#ff1300", "#fa0f00", "#f60b00", "#f10800", "#ed0400", "#e80000", "#e40000", "#df0000", "#da0000", "#d60000", "#d10000", "#cd0000", "#c80000", "#c40000", "#bf0000", "#bb0000", "#b60000", "#b20000", "#ad0000", "#a80000", "#a40000", "#9f0000", "#9b0000", "#960000", "#920000", "#8d0000", "#890000", "#840000", "#800000"], "nipy_spectral": ["#000000", "#09000b", "#130015", "#1c0020", "#25002b", "#2f0035", "#380040", "#41004b", "#4b0055", "#540060", "#5d006b", "#670075", "#700080", "#770088", "#79008a", "#7a008b", "#7b008c", "#7d008e", "#7e008f", "#7f0090", "#810092", "#820093", "#830094", "#850096", "#860097", "#870098", "#83009a", "#78009b", "#6d009c", "#63009e", "#58009f", "#4d00a0", "#4300a2", "#3800a3", "#2d00a4", "#2300a6", "#1800a7", "#0d00a8", "#0300aa", "#0000ad", "#0000b1", "#0000b5", "#0000b9", "#0000bd", "#0000c1", "#0000c5", "#0000c9", "#0000cd", "#0000d1", "#0000d5", "#0000d9", "#0000dd", "#0009dd", "#0013dd", "#001cdd", "#0025dd", "#002fdd", "#0038dd", "#0041dd", "#004bdd", "#0054dd", "#005ddd", "#0067dd", "#0070dd", "#0078dd", "#007add", "#007ddd", "#0080dd", "#0082dd", "#0085dd", "#0088dd", "#008add", "#008ddd", "#0090dd", "#0092dd", "#0095dd", "#0098dd", "#009adb", "#009bd7", "#009cd3", "#009ecf", "#009fcb", "#00a0c7", "#00a2c3", "#00a3bf", "#00a4bb", "#00a6b7", "#00a7b3", "#00a8af", "#00aaab", "#00aaa8", "#00aaa5", "#00aaa3", "#00aaa0", "#00aa9d", "#00aa9b", "#00aa98", "#00aa95", "#00aa93", "#00aa90", "#00aa8d", "#00aa8b", "#00aa88", "#00a97d", "#00a773", "#00a668", "#00a55d", "#00a353", "#00a248", "#00a13d", "#009f33", "#009e28", "#009d1d", "#009b13", "#009a08", "#009a00", "#009c00", "#009f00", "#00a200", "#00a400", "#00a700", "#00aa00", "#00ac00", "#00af00", "#00b200", "#00b400", "#00b700", "#00ba00", "#00bc00", "#00bf00", "#00c200", "#00c400", "#00c700", "#00ca00", "#00cc00", "#00cf00", "#00d200", "#00d400", "#00d700", "#00da00", "#00dc00", "#00df00", "#00e200", "#00e400", "#00e700", "#00ea00", "#00ec00", "#00ef00", "#00f200", "#00f400", "#00f700", "#00fa00", "#00fc00", "#00ff00", "#0fff00", "#1dff00", "#2cff00", "#3bff00", "#49ff00", "#58ff00", "#67ff00", "#75ff00", "#84ff00", "#93ff00", "#a1ff00", "#b0ff00", "#bcff00", "#c0fd00", "#c4fc00", "#c8fb00", "#ccf900", "#d0f800", "#d4f700", "#d8f500", "#dcf400", "#e0f300", "#e4f100", "#e8f000", "#ecef00", "#efed00", "#f0ea00", "#f1e700", "#f3e500", "#f4e200", "#f5df00", "#f7dd00", "#f8da00", "#f9d700", "#fbd500", "#fcd200", "#fdcf00", "#ffcd00", "#ffc900", "#ffc500", "#ffc100", "#ffbd00", "#ffb900", "#ffb500", "#ffb100", "#ffad00", "#ffa900", "#ffa500", "#ffa100", "#ff9d00", "#ff9900", "#ff8d00", "#ff8100", "#ff7500", "#ff6900", "#ff5d00", "#ff5100", "#ff4500", "#ff3900", "#ff2d00", "#ff2100", "#ff1500", "#ff0900", "#fe0000", "#fc0000", "#f90000", "#f60000", "#f40000", "#f10000", "#ee0000", "#ec0000", "#e90000", "#e60000", "#e40000", "#e10000", "#de0000", "#dc0000", "#db0000", "#da0000", "#d80000", "#d70000", "#d60000", "#d40000", "#d30000", "#d20000", "#d00000", "#cf0000", "#ce0000", "#cc0000", "#cc0c0c", "#cc1c1c", "#cc2c2c", "#cc3c3c", "#cc4c4c", "#cc5c5c", "#cc6c6c", "#cc7c7c", "#cc8c8c", "#cc9c9c", "#ccacac", "#ccbcbc", "#cccccc"], "ocean": ["#008000", "#007e01", "#007c02", "#007b03", "#007a04", "#007805", "#007606", "#007507", "#007408", "#007209", "#00700a", "#006f0b", "#006e0c", "#006c0d", "#006a0e", "#00690f", "#006810", "#006611", "#006412", "#006313", "#006214", "#006015", "#005e16", "#005d17", "#005c18", "#005a19", "#00581a", "#00571b", "#00561c", "#00541d", "#00521e", "#00511f", "#005020", "#004e21", "#004c22", "#004b23", "#004a24", "#004825", "#004626", "#004527", "#004428", "#004229", "#00402a", "#003f2b", "#003e2c", "#003c2d", "#003b2e", "#00392f", "#003830", "#003631", "#003432", "#003333", "#003134", "#003035", "#002f36", "#002d37", "#002c38", "#002a39", "#00283a", "#00273b", "#00263c", "#00243d", "#00233e", "#00213f", "#002040", "#001e41", "#001d42", "#001b43", "#001944", "#001845", "#001646", "#001547", "#001448", "#001249", "#00114a", "#000f4b", "#000e4c", "#000c4d", "#000a4e", "#00094f", "#000850", "#000651", "#000552", "#000353", "#000154", "#000055", "#000156", "#000357", "#000458", "#000659", "#00075a", "#00095b", "#000a5c", "#000c5d", "#000e5e", "#000f5f", "#001060", "#001261", "#001362", "#001563", "#001764", "#001865", "#001a66", "#001b67", "#001d68", "#001e69", "#00206a", "#00216b", "#00226c", "#00246d", "#00266e", "#00276f", "#002870", "#002a71", "#002b72", "#002d73", "#002f74", "#003075", "#003176", "#003377", "#003478", "#003679", "#00377a", "#00397b", "#003a7c", "#003c7d", "#003e7e", "#003f7f", "#004080", "#004281", "#004382", "#004583", "#004684", "#004885", "#004a86", "#004b87", "#004d88", "#004e89", "#00508a", "#00518b", "#00538c", "#00548d", "#00568e", "#00578f", "#005890", "#005a91", "#005b92", "#005d93", "#005e94", "#006095", "#006296", "#006397", "#006498", "#006699", "#00679a", "#00699b", "#006b9c", "#006c9d", "#006e9e", "#006f9f", "#0070a0", "#0072a1", "#0073a2", "#0075a3", "#0076a4", "#0078a5", "#007aa6", "#007ba7", "#007da8", "#007ea9", "#0080aa", "#0381ab", "#0682ac", "#0984ad", "#0c85ae", "#0f87af", "#1288b0", "#158ab1", "#188bb2", "#1b8db3", "#1e8eb4", "#2190b5", "#2492b6", "#2793b7", "#2a94b8", "#2d96b9", "#3097ba", "#3399bb", "#369bbc", "#399cbd", "#3c9ebe", "#3f9fbf", "#42a0c0", "#45a2c1", "#48a3c2", "#4ba5c3", "#4ea6c4", "#51a8c5", "#54aac6", "#57abc7", "#5aacc8", "#5daec9", "#60b0ca", "#63b1cb", "#66b3cc", "#69b4cd", "#6cb6ce", "#6fb7cf", "#72b9d0", "#75bad1", "#78bcd2", "#7bbdd3", "#7ebed4", "#81c0d5", "#84c2d6", "#87c3d7", "#8ac4d8", "#8dc6d9", "#90c7da", "#93c9db", "#96cbdc", "#99ccdd", "#9ccede", "#9fcfdf", "#a2d0e0", "#a5d2e1", "#a8d3e2", "#abd5e3", "#aed6e4", "#b1d8e5", "#b4dae6", "#b7dbe7", "#badce8", "#bddee9", "#c0e0ea", "#c3e1eb", "#c6e2ec", "#c9e4ed", "#cce5ee", "#cfe7ef", "#d2e8f0", "#d5eaf1", "#d8ebf2", "#dbedf3", "#deeef4", "#e1f0f5", "#e4f2f6", "#e7f3f7", "#eaf4f8", "#edf6f9", "#f0f7fa", "#f3f9fb", "#f6fbfc", "#f9fcfd", "#fcfefe", "#ffffff"], "pink": ["#1e0000", "#230606", "#280d0d", "#2d1313", "#321a1a", "#351d1d", "#391f1f", "#3c2222", "#402525", "#422727", "#452929", "#482b2b", "#4b2d2d", "#4d2f2f", "#503131", "#523232", "#553434", "#573636", "#593737", "#5b3939", "#5e3a3a", "#603c3c", "#623d3d", "#643e3e", "#664040", "#684141", "#694242", "#6b4444", "#6d4545", "#6f4646", "#714747", "#724949", "#744a4a", "#764b4b", "#774c4c", "#794d4d", "#7b4e4e", "#7c4f4f", "#7e5050", "#7f5151", "#815252", "#825353", "#845454", "#855555", "#875656", "#885757", "#8a5858", "#8b5959", "#8d5a5a", "#8e5b5b", "#8f5c5c", "#915d5d", "#925e5e", "#935f5f", "#956060", "#966161", "#976262", "#996262", "#9a6363", "#9b6464", "#9c6565", "#9e6666", "#9f6767", "#a06767", "#a16868", "#a36969", "#a46a6a", "#a56b6b", "#a66c6c", "#a76c6c", "#a96d6d", "#aa6e6e", "#ab6f6f", "#ac6f6f", "#ad7070", "#ae7171", "#af7272", "#b17272", "#b27373", "#b37474", "#b47575", "#b57575", "#b67676", "#b77777", "#b87777", "#b97878", "#ba7979", "#bb7a7a", "#bc7a7a", "#bd7b7b", "#be7c7c", "#c07c7c", "#c17d7d", "#c27e7e", "#c27f7e", "#c2817f", "#c38280", "#c38480", "#c48581", "#c48782", "#c58882", "#c58a83", "#c68b84", "#c68c84", "#c68e85", "#c78f86", "#c79186", "#c89287", "#c89387", "#c99588", "#c99689", "#c99789", "#ca988a", "#ca9a8b", "#cb9b8b", "#cb9c8c", "#cb9e8c", "#cc9f8d", "#cca08e", "#cda18e", "#cda28f", "#cea48f", "#cea590", "#cea691", "#cfa791", "#cfa892", "#d0aa92", "#d0ab93", "#d0ac94", "#d1ad94", "#d1ae95", "#d2af95", "#d2b096", "#d2b296", "#d3b397", "#d3b497", "#d4b598", "#d4b699", "#d4b799", "#d5b89a", "#d5b99a", "#d6ba9b", "#d6bb9b", "#d6bc9c", "#d7bd9c", "#d7be9d", "#d8bf9e", "#d8c09e", "#d8c19f", "#d9c29f", "#d9c3a0", "#dac4a0", "#dac5a1", "#dac6a1", "#dbc7a2", "#dbc8a2", "#dcc9a3", "#dccaa3", "#dccba4", "#ddcca4", "#ddcda5", "#ddcea5", "#decfa6", "#ded0a6", "#dfd1a7", "#dfd2a7", "#dfd3a8", "#e0d4a8", "#e0d5a9", "#e1d6a9", "#e1d7aa", "#e1d8aa", "#e2d8ab", "#e2d9ab", "#e2daac", "#e3dbac", "#e3dcad", "#e4ddad", "#e4deae", "#e4dfae", "#e5e0af", "#e5e0af", "#e5e1b0", "#e6e2b0", "#e6e3b1", "#e6e4b1", "#e7e5b2", "#e7e6b2", "#e8e7b3", "#e8e7b3", "#e8e8b4", "#e9e9b5", "#e9e9b6", "#e9e9b8", "#eaeab9", "#eaeaba", "#ebebbc", "#ebebbd", "#ebebbe", "#ececc0", "#ececc1", "#ececc2", "#ededc4", "#ededc5", "#ededc6", "#eeeec7", "#eeeec9", "#eeeeca", "#efefcb", "#efefcc", "#f0f0ce", "#f0f0cf", "#f0f0d0", "#f1f1d1", "#f1f1d3", "#f1f1d4", "#f2f2d5", "#f2f2d6", "#f2f2d7", "#f3f3d8", "#f3f3da", "#f3f3db", "#f4f4dc", "#f4f4dd", "#f4f4de", "#f5f5df", "#f5f5e0", "#f5f5e2", "#f6f6e3", "#f6f6e4", "#f7f7e5", "#f7f7e6", "#f7f7e7", "#f8f8e8", "#f8f8e9", "#f8f8ea", "#f9f9eb", "#f9f9ed", "#f9f9ee", "#fafaef", "#fafaf0", "#fafaf1", "#fbfbf2", "#fbfbf3", "#fbfbf4", "#fcfcf5", "#fcfcf6", "#fcfcf7", "#fdfdf8", "#fdfdf9", "#fdfdfa", "#fefefb", "#fefefc", "#fefefd", "#fffffe", "#ffffff"], "prism": ["#ff0000", "#ff0000", "#ff2100", "#ff5200", "#ff8200", "#ffb000", "#ffd800", "#fff700", "#e3ff00", "#b2ff00", "#81ff00", "#53fe00", "#2be200", "#0bbd39", "#00917d", "#0061b9", "#0030e9", "#0001ff", "#1a00ff", "#3e00ff", "#6a00fe", "#9a00d7", "#cb00a3", "#fa0063", "#ff001d", "#ff0000", "#ff0e00", "#ff3e00", "#ff6f00", "#ff9e00", "#ffc900", "#ffec00", "#f5ff00", "#c6ff00", "#95ff00", "#65ff00", "#3aef00", "#17cd1d", "#00a363", "#0074a2", "#0043d7", "#0013fe", "#0d00ff", "#2e00ff", "#5700ff", "#8600e9", "#b700b9", "#e7007e", "#ff003a", "#ff0000", "#ff0000", "#ff2a00", "#ff5b00", "#ff8c00", "#ffb900", "#ffdf00", "#fffc00", "#d9ff00", "#a9ff00", "#78ff00", "#4bf900", "#24dc00", "#06b547", "#00878a", "#0057c4", "#0026f0", "#0300ff", "#2000ff", "#4600ff", "#7300f8", "#a300ce", "#d40097", "#ff0056", "#ff000f", "#ff0000", "#ff1700", "#ff4800", "#ff7900", "#ffa700", "#ffd000", "#fff100", "#ecff00", "#bcff00", "#8bff00", "#5cff00", "#32e900", "#11c52b", "#009a70", "#006bae", "#0039e0", "#000aff", "#1300ff", "#3600ff", "#6000ff", "#8f00e1", "#c100af", "#f00071", "#ff002c", "#ff0000", "#ff0500", "#ff3400", "#ff6500", "#ff9500", "#ffc100", "#ffe500", "#ffff00", "#d0ff00", "#9fff00", "#6fff00", "#42f400", "#1dd50e", "#01ac55", "#007e96", "#004dcd", "#001df7", "#0800ff", "#2700ff", "#4e00ff", "#7c00f1", "#ad00c4", "#dd008b", "#ff0048", "#ff0001", "#ff0000", "#ff2100", "#ff5100", "#ff8200", "#ffb000", "#ffd700", "#fff700", "#e3ff00", "#b3ff00", "#82ff00", "#54fe00", "#2be300", "#0bbd39", "#00917d", "#0061b9", "#0030e8", "#0001ff", "#1900ff", "#3e00ff", "#6900fe", "#9900d8", "#ca00a3", "#f90064", "#ff001e", "#ff0000", "#ff0e00", "#ff3d00", "#ff6f00", "#ff9e00", "#ffc800", "#ffeb00", "#f6ff00", "#c6ff00", "#95ff00", "#66ff00", "#3bef00", "#17cd1c", "#00a462", "#0075a2", "#0044d7", "#0014fe", "#0d00ff", "#2e00ff", "#5700ff", "#8600e9", "#b700ba", "#e7007e", "#ff003a", "#ff0000", "#ff0000", "#ff2a00", "#ff5b00", "#ff8b00", "#ffb800", "#ffde00", "#fffb00", "#daff00", "#a9ff00", "#78ff00", "#4bfa00", "#24dc00", "#06b546", "#008889", "#0057c3", "#0027f0", "#0300ff", "#2000ff", "#4600ff", "#7200f8", "#a300cf", "#d40097", "#ff0056", "#ff0010", "#ff0000", "#ff1700", "#ff4700", "#ff7800", "#ffa700", "#ffd000", "#fff100", "#edff00", "#bdff00", "#8cff00", "#5dff00", "#33e900", "#11c62a", "#009b6f", "#006bad", "#003ae0", "#000bff", "#1300ff", "#3500ff", "#6000ff", "#8f00e1", "#c000af", "#f00071", "#ff002c", "#ff0000", "#ff0500", "#ff3300", "#ff6500", "#ff9400", "#ffc000", "#ffe500", "#ffff00", "#d0ff00", "#9fff00", "#6fff00", "#43f500", "#1dd50d", "#01ad54", "#007f95", "#004ecd", "#001df7", "#0800ff", "#2600ff", "#4e00ff", "#7c00f1", "#ac00c5", "#dd008b", "#ff0049", "#ff0001", "#ff0000", "#ff2000", "#ff5100", "#ff8200", "#ffaf00", "#ffd700", "#fff600", "#e4ff00", "#b3ff00", "#82ff00", "#54ff00"], "rainbow": ["#8000ff", "#7e03ff", "#7c06ff", "#7a09ff", "#780dff", "#7610ff", "#7413ff", "#7216ff", "#7019ff", "#6e1cff", "#6c1fff", "#6a22fe", "#6826fe", "#6629fe", "#642cfe", "#622ffe", "#6032fe", "#5e35fe", "#5c38fd", "#5a3bfd", "#583efd", "#5641fd", "#5444fd", "#5247fc", "#504afc", "#4e4dfc", "#4c50fc", "#4a53fb", "#4856fb", "#4659fb", "#445cfb", "#425ffa", "#4062fa", "#3e65fa", "#3c68f9", "#396bf9", "#386df9", "#3670f8", "#3473f8", "#3176f8", "#3079f7", "#2e7bf7", "#2c7ef7", "#2981f6", "#2884f6", "#2686f5", "#2489f5", "#218cf4", "#208ef4", "#1e91f3", "#1c93f3", "#1996f3", "#1898f2", "#169bf2", "#149df1", "#11a0f1", "#10a2f0", "#0ea5ef", "#0ca7ef", "#09a9ee", "#08acee", "#06aeed", "#04b0ed", "#01b3ec", "#00b5eb", "#02b7eb", "#04b9ea", "#07bbea", "#08bee9", "#0ac0e8", "#0dc2e8", "#0fc4e7", "#10c6e6", "#12c8e6", "#14cae5", "#17cbe4", "#18cde4", "#1acfe3", "#1dd1e2", "#1fd3e1", "#20d5e1", "#22d6e0", "#24d8df", "#27dade", "#28dbde", "#2adddd", "#2ddedc", "#2fe0db", "#30e1da", "#32e3da", "#34e4d9", "#37e6d8", "#38e7d7", "#3ae8d6", "#3dead5", "#3febd5", "#40ecd4", "#42edd3", "#44eed2", "#46efd1", "#48f1d0", "#4af2cf", "#4df3ce", "#4ef3cd", "#50f4cc", "#52f5cb", "#54f6cb", "#56f7ca", "#58f8c9", "#5af8c8", "#5df9c7", "#5efac6", "#60fac5", "#62fbc4", "#64fbc3", "#66fcc2", "#68fcc1", "#6afdc0", "#6dfdbf", "#6efebe", "#70febc", "#72febb", "#74feba", "#76ffb9", "#78ffb8", "#7affb7", "#7dffb6", "#7effb5", "#80ffb4", "#82ffb3", "#84ffb2", "#86ffb0", "#88ffaf", "#8bfeae", "#8cfead", "#8efeac", "#90feab", "#92fda9", "#94fda8", "#96fca7", "#99fca6", "#9bfba5", "#9cfba4", "#9efaa2", "#a0faa1", "#a2f9a0", "#a4f89f", "#a6f89d", "#a8f79c", "#abf69b", "#acf59a", "#aef498", "#b0f397", "#b2f396", "#b4f295", "#b6f193", "#b9ef92", "#bbee91", "#bced8f", "#beec8e", "#c0eb8d", "#c2ea8c", "#c4e88a", "#c6e789", "#c8e688", "#cbe486", "#cce385", "#cee184", "#d0e082", "#d2de81", "#d4dd80", "#d6db7e", "#d9da7d", "#dbd87b", "#dcd67a", "#ded579", "#e0d377", "#e2d176", "#e4cf74", "#e6cd73", "#e8cb72", "#ebca70", "#ecc86f", "#eec66d", "#f0c46c", "#f2c26b", "#f4c069", "#f6be68", "#f9bb66", "#fbb965", "#fcb763", "#feb562", "#ffb360", "#ffb05f", "#ffae5e", "#ffac5c", "#ffa95b", "#ffa759", "#ffa558", "#ffa256", "#ffa055", "#ff9d53", "#ff9b52", "#ff9850", "#ff964f", "#ff934d", "#ff914c", "#ff8e4a", "#ff8c49", "#ff8947", "#ff8646", "#ff8444", "#ff8143", "#ff7e41", "#ff7b40", "#ff793e", "#ff763d", "#ff733b", "#ff703a", "#ff6d38", "#ff6b37", "#ff6835", "#ff6533", "#ff6232", "#ff5f30", "#ff5c2f", "#ff592d", "#ff562c", "#ff532a", "#ff5029", "#ff4d27", "#ff4a26", "#ff4724", "#ff4422", "#ff4121", "#ff3e1f", "#ff3b1e", "#ff381c", "#ff351b", "#ff3219", "#ff2f18", "#ff2c16", "#ff2914", "#ff2613", "#ff2211", "#ff1f10", "#ff1c0e", "#ff190d", "#ff160b", "#ff1309", "#ff1008", "#ff0d06", "#ff0905", "#ff0603", "#ff0302", "#ff0000"], "seismic": ["#00004c", "#00004f", "#000052", "#000055", "#000058", "#00005a", "#00005d", "#000060", "#000063", "#000066", "#000068", "#00006b", "#00006e", "#000071", "#000074", "#000076", "#000079", "#00007c", "#00007f", "#000082", "#000084", "#000087", "#00008a", "#00008d", "#000090", "#000092", "#000095", "#000098", "#00009b", "#00009e", "#0000a0", "#0000a3", "#0000a6", "#0000a9", "#0000ac", "#0000ae", "#0000b1", "#0000b4", "#0000b7", "#0000ba", "#0000bc", "#0000bf", "#0000c2", "#0000c5", "#0000c8", "#0000ca", "#0000cd", "#0000d0", "#0000d3", "#0000d6", "#0000d8", "#0000db", "#0000de", "#0000e1", "#0000e4", "#0000e6", "#0000e9", "#0000ec", "#0000ef", "#0000f2", "#0000f4", "#0000f7", "#0000fa", "#0000fd", "#0101ff", "#0505ff", "#0909ff", "#0d0dff", "#1111ff", "#1515ff", "#1919ff", "#1d1dff", "#2121ff", "#2525ff", "#2929ff", "#2d2dff", "#3131ff", "#3535ff", "#3939ff", "#3d3dff", "#4141ff", "#4545ff", "#4949ff", "#4d4dff", "#5151ff", "#5555ff", "#5959ff", "#5d5dff", "#6161ff", "#6565ff", "#6969ff", "#6d6dff", "#7171ff", "#7575ff", "#7979ff", "#7d7dff", "#8181ff", "#8585ff", "#8989ff", "#8d8dff", "#9191ff", "#9595ff", "#9999ff", "#9d9dff", "#a1a1ff", "#a5a5ff", "#a9a9ff", "#adadff", "#b1b1ff", "#b5b5ff", "#b9b9ff", "#bdbdff", "#c1c1ff", "#c5c5ff", "#c9c9ff", "#cdcdff", "#d1d1ff", "#d5d5ff", "#d9d9ff", "#ddddff", "#e1e1ff", "#e5e5ff", "#e9e9ff", "#ededff", "#f1f1ff", "#f5f5ff", "#f9f9ff", "#fdfdff", "#fffdfd", "#fff9f9", "#fff5f5", "#fff1f1", "#ffeded", "#ffe9e9", "#ffe5e5", "#ffe1e1", "#ffdddd", "#ffd9d9", "#ffd5d5", "#ffd1d1", "#ffcdcd", "#ffc9c9", "#ffc5c5", "#ffc1c1", "#ffbdbd", "#ffb9b9", "#ffb5b5", "#ffb1b1", "#ffadad", "#ffa9a9", "#ffa5a5", "#ffa1a1", "#ff9d9d", "#ff9999", "#ff9595", "#ff9191", "#ff8d8d", "#ff8989", "#ff8585", "#ff8181", "#ff7d7d", "#ff7979", "#ff7575", "#ff7171", "#ff6d6d", "#ff6969", "#ff6565", "#ff6161", "#ff5d5d", "#ff5959", "#ff5555", "#ff5151", "#ff4d4d", "#ff4949", "#ff4545", "#ff4141", "#ff3d3d", "#ff3939", "#ff3535", "#ff3131", "#ff2d2d", "#ff2929", "#ff2525", "#ff2121", "#ff1d1d", "#ff1919", "#ff1515", "#ff1111", "#ff0d0d", "#ff0909", "#ff0505", "#ff0101", "#fe0000", "#fc0000", "#fa0000", "#f80000", "#f60000", "#f40000", "#f20000", "#f00000", "#ee0000", "#ec0000", "#ea0000", "#e80000", "#e60000", "#e30000", "#e20000", "#e00000", "#de0000", "#dc0000", "#da0000", "#d80000", "#d60000", "#d30000", "#d20000", "#d00000", "#ce0000", "#cc0000", "#ca0000", "#c80000", "#c60000", "#c30000", "#c20000", "#c00000", "#be0000", "#bc0000", "#ba0000", "#b80000", "#b60000", "#b30000", "#b20000", "#b00000", "#ae0000", "#ac0000", "#aa0000", "#a80000", "#a60000", "#a30000", "#a20000", "#a00000", "#9e0000", "#9c0000", "#9a0000", "#980000", "#960000", "#930000", "#920000", "#900000", "#8e0000", "#8c0000", "#8a0000", "#880000", "#860000", "#840000", "#820000", "#800000"], "spectral": ["#000000", "#09000b", "#130015", "#1c0020", "#25002b", "#2f0035", "#380040", "#41004b", "#4b0055", "#540060", "#5d006b", "#670075", "#700080", "#770088", "#79008a", "#7a008b", "#7b008c", "#7d008e", "#7e008f", "#7f0090", "#810092", "#820093", "#830094", "#850096", "#860097", "#870098", "#83009a", "#78009b", "#6d009c", "#63009e", "#58009f", "#4d00a0", "#4300a2", "#3800a3", "#2d00a4", "#2300a6", "#1800a7", "#0d00a8", "#0300aa", "#0000ad", "#0000b1", "#0000b5", "#0000b9", "#0000bd", "#0000c1", "#0000c5", "#0000c9", "#0000cd", "#0000d1", "#0000d5", "#0000d9", "#0000dd", "#0009dd", "#0013dd", "#001cdd", "#0025dd", "#002fdd", "#0038dd", "#0041dd", "#004bdd", "#0054dd", "#005ddd", "#0067dd", "#0070dd", "#0078dd", "#007add", "#007ddd", "#0080dd", "#0082dd", "#0085dd", "#0088dd", "#008add", "#008ddd", "#0090dd", "#0092dd", "#0095dd", "#0098dd", "#009adb", "#009bd7", "#009cd3", "#009ecf", "#009fcb", "#00a0c7", "#00a2c3", "#00a3bf", "#00a4bb", "#00a6b7", "#00a7b3", "#00a8af", "#00aaab", "#00aaa8", "#00aaa5", "#00aaa3", "#00aaa0", "#00aa9d", "#00aa9b", "#00aa98", "#00aa95", "#00aa93", "#00aa90", "#00aa8d", "#00aa8b", "#00aa88", "#00a97d", "#00a773", "#00a668", "#00a55d", "#00a353", "#00a248", "#00a13d", "#009f33", "#009e28", "#009d1d", "#009b13", "#009a08", "#009a00", "#009c00", "#009f00", "#00a200", "#00a400", "#00a700", "#00aa00", "#00ac00", "#00af00", "#00b200", "#00b400", "#00b700", "#00ba00", "#00bc00", "#00bf00", "#00c200", "#00c400", "#00c700", "#00ca00", "#00cc00", "#00cf00", "#00d200", "#00d400", "#00d700", "#00da00", "#00dc00", "#00df00", "#00e200", "#00e400", "#00e700", "#00ea00", "#00ec00", "#00ef00", "#00f200", "#00f400", "#00f700", "#00fa00", "#00fc00", "#00ff00", "#0fff00", "#1dff00", "#2cff00", "#3bff00", "#49ff00", "#58ff00", "#67ff00", "#75ff00", "#84ff00", "#93ff00", "#a1ff00", "#b0ff00", "#bcff00", "#c0fd00", "#c4fc00", "#c8fb00", "#ccf900", "#d0f800", "#d4f700", "#d8f500", "#dcf400", "#e0f300", "#e4f100", "#e8f000", "#ecef00", "#efed00", "#f0ea00", "#f1e700", "#f3e500", "#f4e200", "#f5df00", "#f7dd00", "#f8da00", "#f9d700", "#fbd500", "#fcd200", "#fdcf00", "#ffcd00", "#ffc900", "#ffc500", "#ffc100", "#ffbd00", "#ffb900", "#ffb500", "#ffb100", "#ffad00", "#ffa900", "#ffa500", "#ffa100", "#ff9d00", "#ff9900", "#ff8d00", "#ff8100", "#ff7500", "#ff6900", "#ff5d00", "#ff5100", "#ff4500", "#ff3900", "#ff2d00", "#ff2100", "#ff1500", "#ff0900", "#fe0000", "#fc0000", "#f90000", "#f60000", "#f40000", "#f10000", "#ee0000", "#ec0000", "#e90000", "#e60000", "#e40000", "#e10000", "#de0000", "#dc0000", "#db0000", "#da0000", "#d80000", "#d70000", "#d60000", "#d40000", "#d30000", "#d20000", "#d00000", "#cf0000", "#ce0000", "#cc0000", "#cc0c0c", "#cc1c1c", "#cc2c2c", "#cc3c3c", "#cc4c4c", "#cc5c5c", "#cc6c6c", "#cc7c7c", "#cc8c8c", "#cc9c9c", "#ccacac", "#ccbcbc", "#cccccc"], "spring": ["#ff00ff", "#ff01fe", "#ff02fd", "#ff03fc", "#ff04fb", "#ff05fa", "#ff06f9", "#ff07f8", "#ff08f7", "#ff09f6", "#ff0af5", "#ff0bf4", "#ff0cf3", "#ff0df2", "#ff0ef1", "#ff0ff0", "#ff10ef", "#ff11ee", "#ff12ed", "#ff13ec", "#ff14eb", "#ff15ea", "#ff16e9", "#ff17e8", "#ff18e7", "#ff19e6", "#ff1ae5", "#ff1be4", "#ff1ce3", "#ff1de2", "#ff1ee1", "#ff1fe0", "#ff20df", "#ff21de", "#ff22dd", "#ff23dc", "#ff24db", "#ff25da", "#ff26d9", "#ff27d8", "#ff28d7", "#ff29d6", "#ff2ad5", "#ff2bd4", "#ff2cd3", "#ff2dd2", "#ff2ed1", "#ff2fd0", "#ff30cf", "#ff31ce", "#ff32cd", "#ff33cc", "#ff34cb", "#ff35ca", "#ff36c9", "#ff37c8", "#ff38c7", "#ff39c6", "#ff3ac5", "#ff3bc4", "#ff3cc3", "#ff3dc2", "#ff3ec1", "#ff3fc0", "#ff40bf", "#ff41be", "#ff42bd", "#ff43bc", "#ff44bb", "#ff45ba", "#ff46b9", "#ff47b8", "#ff48b7", "#ff49b6", "#ff4ab5", "#ff4bb4", "#ff4cb3", "#ff4db2", "#ff4eb1", "#ff4fb0", "#ff50af", "#ff51ae", "#ff52ad", "#ff53ac", "#ff54ab", "#ff55aa", "#ff56a9", "#ff57a8", "#ff58a7", "#ff59a6", "#ff5aa5", "#ff5ba4", "#ff5ca3", "#ff5da2", "#ff5ea1", "#ff5fa0", "#ff609f", "#ff619e", "#ff629d", "#ff639c", "#ff649b", "#ff659a", "#ff6699", "#ff6798", "#ff6897", "#ff6996", "#ff6a95", "#ff6b94", "#ff6c93", "#ff6d92", "#ff6e91", "#ff6f90", "#ff708f", "#ff718e", "#ff728d", "#ff738c", "#ff748b", "#ff758a", "#ff7689", "#ff7788", "#ff7887", "#ff7986", "#ff7a85", "#ff7b84", "#ff7c83", "#ff7d82", "#ff7e81", "#ff7f80", "#ff807f", "#ff817e", "#ff827d", "#ff837c", "#ff847b", "#ff857a", "#ff8679", "#ff8778", "#ff8877", "#ff8976", "#ff8a75", "#ff8b74", "#ff8c73", "#ff8d72", "#ff8e71", "#ff8f70", "#ff906f", "#ff916e", "#ff926d", "#ff936c", "#ff946b", "#ff956a", "#ff9669", "#ff9768", "#ff9867", "#ff9966", "#ff9a65", "#ff9b64", "#ff9c63", "#ff9d62", "#ff9e61", "#ff9f60", "#ffa05f", "#ffa15e", "#ffa25d", "#ffa35c", "#ffa45b", "#ffa55a", "#ffa659", "#ffa758", "#ffa857", "#ffa956", "#ffaa55", "#ffab54", "#ffac53", "#ffad52", "#ffae51", "#ffaf50", "#ffb04f", "#ffb14e", "#ffb24d", "#ffb34c", "#ffb44b", "#ffb54a", "#ffb649", "#ffb748", "#ffb847", "#ffb946", "#ffba45", "#ffbb44", "#ffbc43", "#ffbd42", "#ffbe41", "#ffbf40", "#ffc03f", "#ffc13e", "#ffc23d", "#ffc33c", "#ffc43b", "#ffc53a", "#ffc639", "#ffc738", "#ffc837", "#ffc936", "#ffca35", "#ffcb34", "#ffcc33", "#ffcd32", "#ffce31", "#ffcf30", "#ffd02f", "#ffd12e", "#ffd22d", "#ffd32c", "#ffd42b", "#ffd52a", "#ffd629", "#ffd728", "#ffd827", "#ffd926", "#ffda25", "#ffdb24", "#ffdc23", "#ffdd22", "#ffde21", "#ffdf20", "#ffe01f", "#ffe11e", "#ffe21d", "#ffe31c", "#ffe41b", "#ffe51a", "#ffe619", "#ffe718", "#ffe817", "#ffe916", "#ffea15", "#ffeb14", "#ffec13", "#ffed12", "#ffee11", "#ffef10", "#fff00f", "#fff10e", "#fff20d", "#fff30c", "#fff40b", "#fff50a", "#fff609", "#fff708", "#fff807", "#fff906", "#fffa05", "#fffb04", "#fffc03", "#fffd02", "#fffe01", "#ffff00"], "summer": ["#008066", "#018066", "#028066", "#038166", "#048266", "#058266", "#068266", "#078366", "#088466", "#098466", "#0a8466", "#0b8566", "#0c8666", "#0d8666", "#0e8666", "#0f8766", "#108866", "#118866", "#128866", "#138966", "#148a66", "#158a66", "#168a66", "#178b66", "#188c66", "#198c66", "#1a8c66", "#1b8d66", "#1c8e66", "#1d8e66", "#1e8e66", "#1f8f66", "#209066", "#219066", "#229066", "#239166", "#249266", "#259266", "#269266", "#279366", "#289366", "#299466", "#2a9466", "#2b9566", "#2c9666", "#2d9666", "#2e9666", "#2f9766", "#309866", "#319866", "#329866", "#339966", "#349a66", "#359a66", "#369a66", "#379b66", "#389c66", "#399c66", "#3a9c66", "#3b9d66", "#3c9e66", "#3d9e66", "#3e9e66", "#3f9f66", "#40a066", "#41a066", "#42a066", "#43a166", "#44a266", "#45a266", "#46a266", "#47a366", "#48a366", "#49a466", "#4aa466", "#4ba566", "#4ca666", "#4da666", "#4ea666", "#4fa766", "#50a866", "#51a866", "#52a866", "#53a966", "#54aa66", "#55aa66", "#56ab66", "#57ab66", "#58ac66", "#59ac66", "#5aac66", "#5bad66", "#5cae66", "#5dae66", "#5eae66", "#5faf66", "#60b066", "#61b066", "#62b066", "#63b166", "#64b266", "#65b266", "#66b266", "#67b366", "#68b366", "#69b466", "#6ab466", "#6bb566", "#6cb666", "#6db666", "#6eb666", "#6fb766", "#70b866", "#71b866", "#72b866", "#73b966", "#74ba66", "#75ba66", "#76bb66", "#77bb66", "#78bc66", "#79bc66", "#7abc66", "#7bbd66", "#7cbe66", "#7dbe66", "#7ebe66", "#7fbf66", "#80c066", "#81c066", "#82c066", "#83c166", "#84c266", "#85c266", "#86c266", "#87c366", "#88c366", "#89c466", "#8ac466", "#8bc566", "#8cc666", "#8dc666", "#8ec666", "#8fc766", "#90c866", "#91c866", "#92c866", "#93c966", "#94ca66", "#95ca66", "#96cb66", "#97cb66", "#98cc66", "#99cc66", "#9acc66", "#9bcd66", "#9cce66", "#9dce66", "#9ece66", "#9fcf66", "#a0d066", "#a1d066", "#a2d066", "#a3d166", "#a4d266", "#a5d266", "#a6d266", "#a7d366", "#a8d366", "#a9d466", "#aad466", "#abd566", "#acd666", "#add666", "#aed666", "#afd766", "#b0d866", "#b1d866", "#b2d866", "#b3d966", "#b4da66", "#b5da66", "#b6db66", "#b7db66", "#b8dc66", "#b9dc66", "#badc66", "#bbdd66", "#bcde66", "#bdde66", "#bede66", "#bfdf66", "#c0e066", "#c1e066", "#c2e066", "#c3e166", "#c4e266", "#c5e266", "#c6e266", "#c7e366", "#c8e366", "#c9e466", "#cae466", "#cbe566", "#cce666", "#cde666", "#cee666", "#cfe766", "#d0e866", "#d1e866", "#d2e866", "#d3e966", "#d4ea66", "#d5ea66", "#d6eb66", "#d7eb66", "#d8ec66", "#d9ec66", "#daec66", "#dbed66", "#dcee66", "#ddee66", "#deee66", "#dfef66", "#e0f066", "#e1f066", "#e2f066", "#e3f166", "#e4f266", "#e5f266", "#e6f266", "#e7f366", "#e8f366", "#e9f466", "#eaf466", "#ebf566", "#ecf666", "#edf666", "#eef666", "#eff766", "#f0f866", "#f1f866", "#f2f866", "#f3f966", "#f4fa66", "#f5fa66", "#f6fb66", "#f7fb66", "#f8fc66", "#f9fc66", "#fafc66", "#fbfd66", "#fcfe66", "#fdfe66", "#fefe66", "#ffff66"], "terrain": ["#333399", "#32369c", "#30389e", "#2f3ba1", "#2e3ea4", "#2c40a6", "#2b43a9", "#2a46ac", "#2848ae", "#274bb1", "#264eb4", "#2450b6", "#2353b9", "#2256bc", "#2058be", "#1f5bc1", "#1e5ec4", "#1c60c6", "#1b63c9", "#1a66cc", "#1868ce", "#176bd1", "#166ed4", "#1470d6", "#1373d9", "#1276dc", "#1078de", "#0f7be1", "#0e7ee4", "#0c80e6", "#0b83e9", "#0a86ec", "#0888ee", "#078bf1", "#068ef4", "#0490f6", "#0393f9", "#0296fc", "#0098fe", "#009afa", "#009cf4", "#009eef", "#00a0e8", "#00a2e2", "#00a4dc", "#00a6d7", "#00a8d0", "#00aacb", "#00acc4", "#00aebf", "#00b0b9", "#00b2b2", "#00b4ac", "#00b6a7", "#00b8a0", "#00bb9b", "#00bc94", "#00be8f", "#00c088", "#00c382", "#00c47d", "#00c677", "#00c970", "#00cb6b", "#01cc66", "#05cd67", "#09ce68", "#0dcf69", "#11cf69", "#15d06a", "#19d16b", "#1dd26c", "#21d36d", "#25d36d", "#29d46e", "#2dd56f", "#31d670", "#35d771", "#39d771", "#3dd872", "#41d973", "#45da74", "#49db75", "#4ddb75", "#51dc76", "#55dd77", "#59de78", "#5ddf79", "#61df79", "#65e07a", "#69e17b", "#6de27c", "#71e37d", "#75e37d", "#79e47e", "#7de57f", "#81e680", "#85e781", "#89e781", "#8de882", "#91e983", "#95ea84", "#99eb85", "#9deb85", "#a1ec86", "#a5ed87", "#a9ee88", "#adef89", "#b1ef89", "#b5f08a", "#b9f18b", "#bdf28c", "#c1f38d", "#c5f38d", "#c9f48e", "#cdf58f", "#d1f690", "#d5f791", "#d9f791", "#ddf892", "#e1f993", "#e5fa94", "#e9fb95", "#edfb95", "#f1fc96", "#f5fd97", "#f9fe98", "#fdff99", "#fefe98", "#fcfb97", "#faf996", "#f8f695", "#f6f394", "#f4f193", "#f2ee92", "#f0ec91", "#eee990", "#ece78f", "#eae48e", "#e8e28d", "#e6df8b", "#e4dc8a", "#e2da89", "#e0d788", "#ded587", "#dcd286", "#dad085", "#d8cd84", "#d6cb83", "#d4c882", "#d2c581", "#d0c380", "#cec07f", "#ccbe7d", "#cabb7c", "#c8b97b", "#c6b67a", "#c4b379", "#c2b178", "#c0ae77", "#beac76", "#bca975", "#baa774", "#b8a473", "#b6a272", "#b49f70", "#b29c6f", "#b09a6e", "#ae976d", "#ac956c", "#aa926b", "#a8906a", "#a68d69", "#a48b68", "#a28867", "#a08566", "#9e8365", "#9c8064", "#9a7e62", "#987b61", "#967960", "#94765f", "#92735e", "#90715d", "#8e6e5c", "#8c6c5b", "#8a695a", "#886759", "#866458", "#846257", "#825f56", "#805c54", "#815e56", "#836059", "#85635c", "#87655e", "#896861", "#8b6b64", "#8d6d66", "#8f7069", "#91726c", "#93756e", "#957771", "#977a74", "#997c76", "#9b7f79", "#9d827c", "#9f847e", "#a18781", "#a38984", "#a58c86", "#a78e89", "#a9918c", "#ab938e", "#ad9691", "#af9994", "#b19b96", "#b39e99", "#b5a09c", "#b7a39f", "#b9a5a1", "#bba8a4", "#bdaba7", "#bfada9", "#c1b0ac", "#c3b2af", "#c5b5b1", "#c7b7b4", "#c9bab7", "#cbbcb9", "#cdbfbc", "#cfc2bf", "#d1c4c1", "#d3c7c4", "#d5c9c7", "#d7ccc9", "#d9cecc", "#dbd1cf", "#ddd3d1", "#dfd6d4", "#e1d9d7", "#e3dbd9", "#e5dedc", "#e7e0df", "#e9e3e2", "#ebe5e4", "#ede8e7", "#efebea", "#f1edec", "#f3f0ef", "#f5f2f2", "#f7f5f4", "#f9f7f7", "#fbfafa", "#fdfcfc", "#ffffff"], "winter": ["#0000ff", "#0001fe", "#0002fe", "#0003fe", "#0004fd", "#0005fc", "#0006fc", "#0007fc", "#0008fb", "#0009fa", "#000afa", "#000bfa", "#000cf9", "#000df8", "#000ef8", "#000ff8", "#0010f7", "#0011f6", "#0012f6", "#0013f6", "#0014f5", "#0015f4", "#0016f4", "#0017f4", "#0018f3", "#0019f2", "#001af2", "#001bf2", "#001cf1", "#001df0", "#001ef0", "#001ff0", "#0020ef", "#0021ee", "#0022ee", "#0023ee", "#0024ed", "#0025ec", "#0026ec", "#0027ec", "#0028eb", "#0029eb", "#002aea", "#002bea", "#002ce9", "#002de8", "#002ee8", "#002fe8", "#0030e7", "#0031e6", "#0032e6", "#0033e6", "#0034e5", "#0035e4", "#0036e4", "#0037e3", "#0038e3", "#0039e2", "#003ae2", "#003be2", "#003ce1", "#003de0", "#003ee0", "#003fe0", "#0040df", "#0041de", "#0042de", "#0043de", "#0044dd", "#0045dc", "#0046dc", "#0047dc", "#0048db", "#0049db", "#004ada", "#004bda", "#004cd9", "#004dd8", "#004ed8", "#004fd8", "#0050d7", "#0051d6", "#0052d6", "#0053d6", "#0054d5", "#0055d4", "#0056d4", "#0057d3", "#0058d3", "#0059d2", "#005ad2", "#005bd2", "#005cd1", "#005dd0", "#005ed0", "#005fd0", "#0060cf", "#0061ce", "#0062ce", "#0063ce", "#0064cd", "#0065cc", "#0066cc", "#0067cc", "#0068cb", "#0069cb", "#006aca", "#006bca", "#006cc9", "#006dc8", "#006ec8", "#006fc8", "#0070c7", "#0071c6", "#0072c6", "#0073c6", "#0074c5", "#0075c4", "#0076c4", "#0077c3", "#0078c3", "#0079c2", "#007ac2", "#007bc2", "#007cc1", "#007dc0", "#007ec0", "#007fc0", "#0080bf", "#0081be", "#0082be", "#0083be", "#0084bd", "#0085bc", "#0086bc", "#0087bc", "#0088bb", "#0089bb", "#008aba", "#008bba", "#008cb9", "#008db8", "#008eb8", "#008fb8", "#0090b7", "#0091b6", "#0092b6", "#0093b6", "#0094b5", "#0095b4", "#0096b4", "#0097b3", "#0098b3", "#0099b2", "#009ab2", "#009bb2", "#009cb1", "#009db0", "#009eb0", "#009fb0", "#00a0af", "#00a1ae", "#00a2ae", "#00a3ae", "#00a4ad", "#00a5ac", "#00a6ac", "#00a7ac", "#00a8ab", "#00a9ab", "#00aaaa", "#00abaa", "#00aca9", "#00ada8", "#00aea8", "#00afa8", "#00b0a7", "#00b1a6", "#00b2a6", "#00b3a6", "#00b4a5", "#00b5a4", "#00b6a4", "#00b7a3", "#00b8a3", "#00b9a2", "#00baa2", "#00bba2", "#00bca1", "#00bda0", "#00bea0", "#00bfa0", "#00c09f", "#00c19e", "#00c29e", "#00c39e", "#00c49d", "#00c59c", "#00c69c", "#00c79c", "#00c89b", "#00c99b", "#00ca9a", "#00cb9a", "#00cc99", "#00cd98", "#00ce98", "#00cf98", "#00d097", "#00d196", "#00d296", "#00d396", "#00d495", "#00d594", "#00d694", "#00d793", "#00d893", "#00d992", "#00da92", "#00db92", "#00dc91", "#00dd90", "#00de90", "#00df90", "#00e08f", "#00e18e", "#00e28e", "#00e38e", "#00e48d", "#00e58c", "#00e68c", "#00e78c", "#00e88b", "#00e98b", "#00ea8a", "#00eb8a", "#00ec89", "#00ed88", "#00ee88", "#00ef88", "#00f087", "#00f186", "#00f286", "#00f386", "#00f485", "#00f584", "#00f684", "#00f784", "#00f883", "#00f982", "#00fa82", "#00fb82", "#00fc81", "#00fd80", "#00fe80", "#00ff80"] }; ////////////////////////////////////////
	  // Colormaps borrowed from matplotlib //
	  ////////////////////////////////////////

	  var colormap_names = exports.colormap_names = Object.keys(colormap_data);

	  var x = d3.range(256);

	  function get_colormap(cmap_name) {
	    var cmap = d3.scale.linear().domain(x).range(colormap_data[cmap_name]);
	    return cmap;
	  }
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;/* WEBPACK VAR INJECTION */(function(process, global) {(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.es6PromiseMin = mod.exports;
	  }
	})(this, function (module, exports) {
	  "use strict";

	  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	  };

	  !function (t, e) {
	    "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : t.ES6Promise = e();
	  }(undefined, function () {
	    "use strict";
	    function t(t) {
	      return "function" == typeof t || "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && null !== t;
	    }function e(t) {
	      return "function" == typeof t;
	    }function n(t) {
	      I = t;
	    }function r(t) {
	      J = t;
	    }function o() {
	      return function () {
	        return process.nextTick(a);
	      };
	    }function i() {
	      return function () {
	        H(a);
	      };
	    }function s() {
	      var t = 0,
	          e = new V(a),
	          n = document.createTextNode("");return e.observe(n, { characterData: !0 }), function () {
	        n.data = t = ++t % 2;
	      };
	    }function u() {
	      var t = new MessageChannel();return t.port1.onmessage = a, function () {
	        return t.port2.postMessage(0);
	      };
	    }function c() {
	      var t = setTimeout;return function () {
	        return t(a, 1);
	      };
	    }function a() {
	      for (var t = 0; t < G; t += 2) {
	        var e = $[t],
	            n = $[t + 1];e(n), $[t] = void 0, $[t + 1] = void 0;
	      }G = 0;
	    }function f() {
	      try {
	        var t = require,
	            e = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"vertx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));return H = e.runOnLoop || e.runOnContext, i();
	      } catch (n) {
	        return c();
	      }
	    }function l(t, e) {
	      var n = arguments,
	          r = this,
	          o = new this.constructor(p);void 0 === o[et] && k(o);var i = r._state;return i ? !function () {
	        var t = n[i - 1];J(function () {
	          return x(i, o, t, r._result);
	        });
	      }() : E(r, o, t, e), o;
	    }function h(t) {
	      var e = this;if (t && "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && t.constructor === e) return t;var n = new e(p);return g(n, t), n;
	    }function p() {}function v() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }function d() {
	      return new TypeError("A promises callback cannot return that same promise.");
	    }function _(t) {
	      try {
	        return t.then;
	      } catch (e) {
	        return it.error = e, it;
	      }
	    }function y(t, e, n, r) {
	      try {
	        t.call(e, n, r);
	      } catch (o) {
	        return o;
	      }
	    }function m(t, e, n) {
	      J(function (t) {
	        var r = !1,
	            o = y(n, e, function (n) {
	          r || (r = !0, e !== n ? g(t, n) : S(t, n));
	        }, function (e) {
	          r || (r = !0, j(t, e));
	        }, "Settle: " + (t._label || " unknown promise"));!r && o && (r = !0, j(t, o));
	      }, t);
	    }function b(t, e) {
	      e._state === rt ? S(t, e._result) : e._state === ot ? j(t, e._result) : E(e, void 0, function (e) {
	        return g(t, e);
	      }, function (e) {
	        return j(t, e);
	      });
	    }function w(t, n, r) {
	      n.constructor === t.constructor && r === l && n.constructor.resolve === h ? b(t, n) : r === it ? j(t, it.error) : void 0 === r ? S(t, n) : e(r) ? m(t, n, r) : S(t, n);
	    }function g(e, n) {
	      e === n ? j(e, v()) : t(n) ? w(e, n, _(n)) : S(e, n);
	    }function A(t) {
	      t._onerror && t._onerror(t._result), T(t);
	    }function S(t, e) {
	      t._state === nt && (t._result = e, t._state = rt, 0 !== t._subscribers.length && J(T, t));
	    }function j(t, e) {
	      t._state === nt && (t._state = ot, t._result = e, J(A, t));
	    }function E(t, e, n, r) {
	      var o = t._subscribers,
	          i = o.length;t._onerror = null, o[i] = e, o[i + rt] = n, o[i + ot] = r, 0 === i && t._state && J(T, t);
	    }function T(t) {
	      var e = t._subscribers,
	          n = t._state;if (0 !== e.length) {
	        for (var r = void 0, o = void 0, i = t._result, s = 0; s < e.length; s += 3) {
	          r = e[s], o = e[s + n], r ? x(n, r, o, i) : o(i);
	        }t._subscribers.length = 0;
	      }
	    }function M() {
	      this.error = null;
	    }function P(t, e) {
	      try {
	        return t(e);
	      } catch (n) {
	        return st.error = n, st;
	      }
	    }function x(t, n, r, o) {
	      var i = e(r),
	          s = void 0,
	          u = void 0,
	          c = void 0,
	          a = void 0;if (i) {
	        if (s = P(r, o), s === st ? (a = !0, u = s.error, s = null) : c = !0, n === s) return void j(n, d());
	      } else s = o, c = !0;n._state !== nt || (i && c ? g(n, s) : a ? j(n, u) : t === rt ? S(n, s) : t === ot && j(n, s));
	    }function C(t, e) {
	      try {
	        e(function (e) {
	          g(t, e);
	        }, function (e) {
	          j(t, e);
	        });
	      } catch (n) {
	        j(t, n);
	      }
	    }function O() {
	      return ut++;
	    }function k(t) {
	      t[et] = ut++, t._state = void 0, t._result = void 0, t._subscribers = [];
	    }function Y(t, e) {
	      this._instanceConstructor = t, this.promise = new t(p), this.promise[et] || k(this.promise), B(e) ? (this._input = e, this.length = e.length, this._remaining = e.length, this._result = new Array(this.length), 0 === this.length ? S(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(), 0 === this._remaining && S(this.promise, this._result))) : j(this.promise, q());
	    }function q() {
	      return new Error("Array Methods must be provided an Array");
	    }function F(t) {
	      return new Y(this, t).promise;
	    }function D(t) {
	      var e = this;return new e(B(t) ? function (n, r) {
	        for (var o = t.length, i = 0; i < o; i++) {
	          e.resolve(t[i]).then(n, r);
	        }
	      } : function (t, e) {
	        return e(new TypeError("You must pass an array to race."));
	      });
	    }function K(t) {
	      var e = this,
	          n = new e(p);return j(n, t), n;
	    }function L() {
	      throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
	    }function N() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }function U(t) {
	      this[et] = O(), this._result = this._state = void 0, this._subscribers = [], p !== t && ("function" != typeof t && L(), this instanceof U ? C(this, t) : N());
	    }function W() {
	      var t = void 0;if ("undefined" != typeof global) t = global;else if ("undefined" != typeof self) t = self;else try {
	        t = Function("return this")();
	      } catch (e) {
	        throw new Error("polyfill failed because global object is unavailable in this environment");
	      }var n = t.Promise;if (n) {
	        var r = null;try {
	          r = Object.prototype.toString.call(n.resolve());
	        } catch (e) {}if ("[object Promise]" === r && !n.cast) return;
	      }t.Promise = U;
	    }var z = void 0;z = Array.isArray ? Array.isArray : function (t) {
	      return "[object Array]" === Object.prototype.toString.call(t);
	    };var B = z,
	        G = 0,
	        H = void 0,
	        I = void 0,
	        J = function J(t, e) {
	      $[G] = t, $[G + 1] = e, G += 2, 2 === G && (I ? I(a) : tt());
	    },
	        Q = "undefined" != typeof window ? window : void 0,
	        R = Q || {},
	        V = R.MutationObserver || R.WebKitMutationObserver,
	        X = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process),
	        Z = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
	        $ = new Array(1e3),
	        tt = void 0;tt = X ? o() : V ? s() : Z ? u() : void 0 === Q && "function" == "function" ? f() : c();var et = Math.random().toString(36).substring(16),
	        nt = void 0,
	        rt = 1,
	        ot = 2,
	        it = new M(),
	        st = new M(),
	        ut = 0;return Y.prototype._enumerate = function () {
	      for (var t = this.length, e = this._input, n = 0; this._state === nt && n < t; n++) {
	        this._eachEntry(e[n], n);
	      }
	    }, Y.prototype._eachEntry = function (t, e) {
	      var n = this._instanceConstructor,
	          r = n.resolve;if (r === h) {
	        var o = _(t);if (o === l && t._state !== nt) this._settledAt(t._state, e, t._result);else if ("function" != typeof o) this._remaining--, this._result[e] = t;else if (n === U) {
	          var i = new n(p);w(i, t, o), this._willSettleAt(i, e);
	        } else this._willSettleAt(new n(function (e) {
	          return e(t);
	        }), e);
	      } else this._willSettleAt(r(t), e);
	    }, Y.prototype._settledAt = function (t, e, n) {
	      var r = this.promise;r._state === nt && (this._remaining--, t === ot ? j(r, n) : this._result[e] = n), 0 === this._remaining && S(r, this._result);
	    }, Y.prototype._willSettleAt = function (t, e) {
	      var n = this;E(t, void 0, function (t) {
	        return n._settledAt(rt, e, t);
	      }, function (t) {
	        return n._settledAt(ot, e, t);
	      });
	    }, U.all = F, U.race = D, U.resolve = h, U.reject = K, U._setScheduler = n, U._setAsap = r, U._asap = J, U.prototype = { constructor: U, then: l, "catch": function _catch(t) {
	        return this.then(null, t);
	      } }, W(), U.polyfill = W, U.Promise = U, U;
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(module);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod);
	        global.browser = mod.exports;
	    }
	})(this, function (module) {
	    'use strict';

	    // shim for using process in browser
	    var process = module.exports = {};

	    // cached from whatever global is present so that test runners that stub it
	    // don't break things.  But we need to wrap it in a try catch in case it is
	    // wrapped in strict mode code which doesn't define any globals.  It's inside a
	    // function because try/catches deoptimize in certain engines.

	    var cachedSetTimeout;
	    var cachedClearTimeout;

	    function defaultSetTimout() {
	        throw new Error('setTimeout has not been defined');
	    }
	    function defaultClearTimeout() {
	        throw new Error('clearTimeout has not been defined');
	    }
	    (function () {
	        try {
	            if (typeof setTimeout === 'function') {
	                cachedSetTimeout = setTimeout;
	            } else {
	                cachedSetTimeout = defaultSetTimout;
	            }
	        } catch (e) {
	            cachedSetTimeout = defaultSetTimout;
	        }
	        try {
	            if (typeof clearTimeout === 'function') {
	                cachedClearTimeout = clearTimeout;
	            } else {
	                cachedClearTimeout = defaultClearTimeout;
	            }
	        } catch (e) {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    })();
	    function runTimeout(fun) {
	        if (cachedSetTimeout === setTimeout) {
	            //normal enviroments in sane situations
	            return setTimeout(fun, 0);
	        }
	        // if setTimeout wasn't available but was latter defined
	        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	            cachedSetTimeout = setTimeout;
	            return setTimeout(fun, 0);
	        }
	        try {
	            // when when somebody has screwed with setTimeout but no I.E. maddness
	            return cachedSetTimeout(fun, 0);
	        } catch (e) {
	            try {
	                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	                return cachedSetTimeout.call(null, fun, 0);
	            } catch (e) {
	                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	                return cachedSetTimeout.call(this, fun, 0);
	            }
	        }
	    }
	    function runClearTimeout(marker) {
	        if (cachedClearTimeout === clearTimeout) {
	            //normal enviroments in sane situations
	            return clearTimeout(marker);
	        }
	        // if clearTimeout wasn't available but was latter defined
	        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	            cachedClearTimeout = clearTimeout;
	            return clearTimeout(marker);
	        }
	        try {
	            // when when somebody has screwed with setTimeout but no I.E. maddness
	            return cachedClearTimeout(marker);
	        } catch (e) {
	            try {
	                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	                return cachedClearTimeout.call(null, marker);
	            } catch (e) {
	                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	                return cachedClearTimeout.call(this, marker);
	            }
	        }
	    }
	    var queue = [];
	    var draining = false;
	    var currentQueue;
	    var queueIndex = -1;

	    function cleanUpNextTick() {
	        if (!draining || !currentQueue) {
	            return;
	        }
	        draining = false;
	        if (currentQueue.length) {
	            queue = currentQueue.concat(queue);
	        } else {
	            queueIndex = -1;
	        }
	        if (queue.length) {
	            drainQueue();
	        }
	    }

	    function drainQueue() {
	        if (draining) {
	            return;
	        }
	        var timeout = runTimeout(cleanUpNextTick);
	        draining = true;

	        var len = queue.length;
	        while (len) {
	            currentQueue = queue;
	            queue = [];
	            while (++queueIndex < len) {
	                if (currentQueue) {
	                    currentQueue[queueIndex].run();
	                }
	            }
	            queueIndex = -1;
	            len = queue.length;
	        }
	        currentQueue = null;
	        draining = false;
	        runClearTimeout(timeout);
	    }

	    process.nextTick = function (fun) {
	        var args = new Array(arguments.length - 1);
	        if (arguments.length > 1) {
	            for (var i = 1; i < arguments.length; i++) {
	                args[i - 1] = arguments[i];
	            }
	        }
	        queue.push(new Item(fun, args));
	        if (queue.length === 1 && !draining) {
	            runTimeout(drainQueue);
	        }
	    };

	    // v8 likes predictible objects
	    function Item(fun, array) {
	        this.fun = fun;
	        this.array = array;
	    }
	    Item.prototype.run = function () {
	        this.fun.apply(null, this.array);
	    };
	    process.title = 'browser';
	    process.browser = true;
	    process.env = {};
	    process.argv = [];
	    process.version = ''; // empty string to avoid regexp issues
	    process.versions = {};

	    function noop() {}

	    process.on = noop;
	    process.addListener = noop;
	    process.once = noop;
	    process.off = noop;
	    process.removeListener = noop;
	    process.removeAllListeners = noop;
	    process.emit = noop;

	    process.binding = function (name) {
	        throw new Error('process.binding is not supported');
	    };

	    process.cwd = function () {
	        return '/';
	    };
	    process.chdir = function (dir) {
	        throw new Error('process.chdir is not supported');
	    };
	    process.umask = function () {
	        return 0;
	    };
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./embed.css", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./embed.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, ".plotdiv {\n    padding: 0px;\n    font-family: sans;\n}\n\n.plotdiv svg,\n.plotdiv canvas {\n    position: absolute;\n    image-rendering: optimizeSpeed;\n    image-rendering: crisp-edges;\n    image-rendering: -moz-crisp-edges;\n    image-rendering: -webkit-optimize-contrast;\n    image-rendering: optimize-contrast;\n    -ms-interpolation-mode: nearest-neighbor;\n}\n.plotdiv .line {\n    fill: none;\n    stroke-width: 1.5px;\n}\n\n.plotdiv .highlight {\n    stroke-width: 4.5px;\n}\n.plotdiv .axis-label {\n    font-size: 18px;\n}\n\n.plotdiv .axis .tick text {\n    font: 14px sans-serif;\n}\n\n.plotdiv .axis path,\n.plotdiv .axis line {\n    fill: none;\n    stroke: #000;\n    shape-rendering: crispEdges;\n}\n\n.plotdiv .grid .tick {\n    stroke: lightgrey;\n    opacity: 0.7;\n}\n.plotdiv .grid path {\n    stroke-width: 0;\n    fill: none;\n}\n.plotdiv rect {\n    fill: none;\n    user-select: none; \n    -webkit-user-select: none; \n    -moz-user-select: none;\n}\n\n.plotdiv rect.zoom {\n    stroke: steelblue;\n    fill-opacity: 0.5;\n}\n\n.plotdiv .no-data {\n    font-family: 'Homemade Apple', cursive;\n    font-size: 4vw;\n    text-align: center;\n    position: relative;\n    top: 50%;\n    transform: translateY(-50%);\n}\n", ""]);

	// exports


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports !== "undefined") {
			factory(module);
		} else {
			var mod = {
				exports: {}
			};
			factory(mod);
			global.cssBase = mod.exports;
		}
	})(this, function (module) {
		"use strict";

		/*
	 	MIT License http://www.opensource.org/licenses/mit-license.php
	 	Author Tobias Koppers @sokra
	 */
		// css base code, injected by the css-loader
		module.exports = function () {
			var list = [];

			// return the list of modules as css string
			list.toString = function toString() {
				var result = [];
				for (var i = 0; i < this.length; i++) {
					var item = this[i];
					if (item[2]) {
						result.push("@media " + item[2] + "{" + item[1] + "}");
					} else {
						result.push(item[1]);
					}
				}
				return result.join("");
			};

			// import a list of modules into the list
			list.i = function (modules, mediaQuery) {
				if (typeof modules === "string") modules = [[null, modules, ""]];
				var alreadyImportedModules = {};
				for (var i = 0; i < this.length; i++) {
					var id = this[i][0];
					if (typeof id === "number") alreadyImportedModules[id] = true;
				}
				for (i = 0; i < modules.length; i++) {
					var item = modules[i];
					// skip already imported module
					// this implementation is not 100% perfect for weird media query combinations
					//  when a module is imported multiple times with different media queries.
					//  I hope this will never occur (Hey this way we have smaller bundles)
					if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
						if (mediaQuery && !item[2]) {
							item[2] = mediaQuery;
						} else if (mediaQuery) {
							item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
						}
						list.push(item);
					}
				}
			};
			return list;
		};
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);