window.bdUser = bds.comm.user ? bds.comm.user : null;
window.login_success = [];
window.bdQuery = bds.comm.query;
window.bdUseFavo = bds.comm.useFavo;
window.bdFavoOn = bds.comm.favoOn;
window.bdCid = bds.comm.cid;
window.bdSid = bds.comm.sid;
window.bdServerTime = bds.comm.serverTime;
window.bdQid = bds.comm.queryId;
window.bdstoken = bds.comm.stoken;
window.A = bds.aladdin = {};
A.ids = [];

function _aMC(d) {
	var b = d,
		a = -1;
	while(b = b.parentNode) {
		a = parseInt(b.getAttribute("id"));
		if(a > 0) {
			return a
		}
	}
}
A.has = true;
var isIE = navigator.userAgent.indexOf("MSIE") != -1 && !window.opera;

function G(a) {
	return document.getElementById(a)
}
function TagQ(a, b) {
	return b.getElementsByTagName(a)
}
function h(b) {
	b.style.behavior = "url(#default#homepage)";
	b.setHomePage(bds.comm.domain);
	var a = window["BD_PS_C" + (new Date()).getTime()] = new Image();
	a.src = bds.comm.ubsurl + "?fm=hp&tn=" + bds.comm.tn + "&t=" + new Date().getTime()
}
function al_c(a) {
	while(a.tagName != "TABLE") {
		a = a.parentNode
	}
	return a.getAttribute("id")
}
function al_c2(b, a) {
	while(a--) {
		while((b = b.parentNode).tagName != "TABLE") {}
	}
	return b.getAttribute("id")
}
function c(a) {
	if(a.fm == "alop" && !("rsv_xpath" in a)) {
		var k = a.p1;
		if(k && G(k).getAttribute("srcid") == "6677") {} else {
			return true
		}
	}
	var b = window.document.location.href,
		g = "",
		d = "",
		l = "",
		f = window["BD_PS_C" + (new Date()).getTime()] = new Image();
	for(v in a) {
		switch(v) {
		case "title":
			d = encodeURIComponent(a[v].replace(/<[^<>]+>/g, ""));
			break;
		case "mu":
		case "url":
			d = escape(a[v]);
			break;
		default:
			d = a[v]
		}
		g += "&" + v + "=" + d
	}
	try {
		if(("p2" in a) && G(a.p1).getAttribute("mu") && a.fm != "pl") {
			l = "&mu=" + escape(G(a.p1).getAttribute("mu"))
		}
	} catch(i) {}
	var j = bds.comm.ubsurl + "?q=" + bds.comm.queryEnc + g + l + "&rsv_sid=" + bds.comm.sid + "&cid=" + bds.comm.cid + "&qid=" + bds.comm.queryId + "&t=" + new Date().getTime() + "&path=" + b;
	if(bds.comm.inter) {
		j = j + "&rsv_inter=" + bds.comm.inter
	}
	f.src = j;
	return true
}
function ns_c(g) {
	var i = encodeURIComponent(window.document.location.href),
		f = "",
		e = bds.comm.queryEnc,
		a = "",
		b = "",
		d = window["BD_PS_C" + (new Date()).getTime()] = new Image();
	for(v in g) {
		switch(v) {
		case "title":
			a = encodeURIComponent(g[v].replace(/<[^<>]+>/g, ""));
			break;
		case "url":
			a = encodeURIComponent(g[v]);
			break;
		default:
			a = g[v]
		}
		f += v + "=" + a + "&"
	}
	b = "&mu=" + i;
	d.src = "http://nsclick.baidu.com/v.gif?pid=201&pj=www&" + f + "path=" + i + "&wd=" + e + "&rsv_sid=" + bds.comm.sid + "&t=" + new Date().getTime();
	return true
}
function ns_c_pj(g) {
	var i = encodeURIComponent(window.document.location.href),
		f = "",
		e = bds.comm.queryEnc,
		a = "",
		b = "",
		d = window["BD_PS_C" + (new Date()).getTime()] = new Image();
	for(v in g) {
		switch(v) {
		case "title":
			a = encodeURIComponent(g[v].replace(/<[^<>]+>/g, ""));
			break;
		case "url":
			a = encodeURIComponent(g[v]);
			break;
		default:
			a = g[v]
		}
		f += v + "=" + a + "&"
	}
	b = "&mu=" + i;
	d.src = "http://nsclick.baidu.com/v.gif?pid=201&" + f + "path=" + i + "&wd=" + e + "&rsv_sid=" + bds.comm.sid + "&t=" + new Date().getTime();
	return true
}
function setHeadUrl(b) {
	var d = G("kw").value;
	d = encodeURIComponent(d);
	var a = b.href;
	a = a.replace(new RegExp("(" + b.getAttribute("wdfield") + "=)[^&]*"), "$1" + d + "&ie=utf-8");
	b.href = a
}
bds.util.addStyle = function(b) {
	if(isIE) {
		var d = document.createStyleSheet();
		d.cssText = b
	} else {
		var a = document.createElement("style");
		a.type = "text/css";
		a.appendChild(document.createTextNode(b));
		document.getElementsByTagName("HEAD")[0].appendChild(a)
	}
};
bds.util.getWinWidth = function() {
	return window.document.documentElement.clientWidth
};
bds.util.setContainerWidth = function() {
	if(bds.util.getWinWidth() < 1207) {
		baidu.dom.addClass("container", "container_s");
		baidu.dom.removeClass("container", "container_l")
	} else {
		baidu.dom.addClass("container", "container_l");
		baidu.dom.removeClass("container", "container_s")
	}
};
bds.util.getContentRightHeight = function() {
	return(baidu.g("content_right")) ? baidu.g("content_right").offsetHeight : 0
};
bds.util.getContentLeftHeight = function() {
	return(baidu.g("content_left")) ? baidu.g("content_left").offsetHeight : 0
};
A.uiPrefix = 'http://www.baidu.com/cache/aladdin/ui/';
(function() {
	var A = window.bds.aladdin;
	A.baidu = (function() {
		var T, baidu = T = baidu || {
			version: "1.3.9"
		};
		baidu.guid = "$BAIDU$";
		window[baidu.guid] = window[baidu.guid] || {};
		baidu.ajax = baidu.ajax || {};
		baidu.fn = baidu.fn || {};
		baidu.fn.blank = function() {};
		baidu.ajax.request = function(url, opt_options) {
			var options = opt_options || {},
				data = options.data || "",
				async = !(options.async === false),
				username = options.username || "",
				password = options.password || "",
				method = (options.method || "GET").toUpperCase(),
				headers = options.headers || {},
				timeout = options.timeout || 0,
				eventHandlers = {},
				tick, key, xhr;

			function stateChangeHandler() {
				if(xhr.readyState == 4) {
					try {
						var stat = xhr.status
					} catch(ex) {
						fire("failure");
						return
					}
					fire(stat);
					if((stat >= 200 && stat < 300) || stat == 304 || stat == 1223) {
						fire("success")
					} else {
						fire("failure")
					}
					window.setTimeout(function() {
						xhr.onreadystatechange = baidu.fn.blank;
						if(async) {
							xhr = null
						}
					}, 0)
				}
			}
			function getXHR() {
				if(window.ActiveXObject) {
					try {
						return new ActiveXObject("Msxml2.XMLHTTP")
					} catch(e) {
						try {
							return new ActiveXObject("Microsoft.XMLHTTP")
						} catch(e) {}
					}
				}
				if(window.XMLHttpRequest) {
					return new XMLHttpRequest()
				}
			}
			function fire(type) {
				type = "on" + type;
				var handler = eventHandlers[type],
					globelHandler = baidu.ajax[type];
				if(handler) {
					if(tick) {
						clearTimeout(tick)
					}
					if(type != "onsuccess") {
						handler(xhr)
					} else {
						try {
							xhr.responseText
						} catch(error) {
							return handler(xhr)
						}
						handler(xhr, xhr.responseText)
					}
				} else {
					if(globelHandler) {
						if(type == "onsuccess") {
							return
						}
						globelHandler(xhr)
					}
				}
			}
			for(key in options) {
				eventHandlers[key] = options[key]
			}
			headers["X-Requested-With"] = "XMLHttpRequest";
			try {
				xhr = getXHR();
				if(method == "GET") {
					if(data) {
						url += (url.indexOf("?") >= 0 ? "&" : "?") + data;
						data = null
					}
					if(options.noCache) {
						url += (url.indexOf("?") >= 0 ? "&" : "?") + "b" + (+new Date) + "=1"
					}
				}
				if(username) {
					xhr.open(method, url, async, username, password)
				} else {
					xhr.open(method, url, async)
				}
				if(async) {
					xhr.onreadystatechange = stateChangeHandler
				}
				if(method == "POST") {
					xhr.setRequestHeader("Content-Type", (headers["Content-Type"] || "application/x-www-form-urlencoded"))
				}
				for(key in headers) {
					if(headers.hasOwnProperty(key)) {
						xhr.setRequestHeader(key, headers[key])
					}
				}
				fire("beforerequest");
				if(timeout) {
					tick = setTimeout(function() {
						xhr.onreadystatechange = baidu.fn.blank;
						xhr.abort();
						fire("timeout")
					}, timeout)
				}
				xhr.send(data);
				if(!async) {
					stateChangeHandler()
				}
			} catch(ex) {
				fire("failure")
			}
			return xhr
		};
		baidu.ajax.get = function(url, onsuccess) {
			return baidu.ajax.request(url, {
				onsuccess: onsuccess
			})
		};
		baidu.ajax.post = function(url, data, onsuccess) {
			return baidu.ajax.request(url, {
				onsuccess: onsuccess,
				method: "POST",
				data: data
			})
		};
		baidu.array = baidu.array || {};
		baidu.each = baidu.array.forEach = baidu.array.each = function(source, iterator, thisObject) {
			var returnValue, item, i, len = source.length;
			if("function" == typeof iterator) {
				for(i = 0; i < len; i++) {
					item = source[i];
					returnValue = iterator.call(thisObject || source, item, i);
					if(returnValue === false) {
						break
					}
				}
			}
			return source
		};
		baidu.array.filter = function(source, iterator, thisObject) {
			var result = [],
				resultIndex = 0,
				len = source.length,
				item, i;
			if("function" == typeof iterator) {
				for(i = 0; i < len; i++) {
					item = source[i];
					if(true === iterator.call(thisObject || source, item, i)) {
						result[resultIndex++] = item
					}
				}
			}
			return result
		};
		baidu.array.remove = function(source, match) {
			var len = source.length;
			while(len--) {
				if(len in source && source[len] === match) {
					source.splice(len, 1)
				}
			}
			return source
		};
		baidu.array.removeAt = function(source, index) {
			return source.splice(index, 1)[0]
		};
		baidu.browser = baidu.browser || {};
		baidu.browser.firefox = /firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ? +RegExp["$1"] : undefined;
		baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || +RegExp["$1"]) : undefined;
		baidu.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);
		baidu.browser.isStrict = document.compatMode == "CSS1Compat";
		baidu.browser.isWebkit = /webkit/i.test(navigator.userAgent);
		baidu.browser.opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ? +(RegExp["$6"] || RegExp["$2"]) : undefined;
		(function() {
			var ua = navigator.userAgent;
			baidu.browser.safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? +(RegExp["$1"] || RegExp["$2"]) : undefined
		})();
		baidu.cookie = baidu.cookie || {};
		baidu.cookie._isValidKey = function(key) {
			return(new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+$')).test(key)
		};
		baidu.cookie.getRaw = function(key) {
			if(baidu.cookie._isValidKey(key)) {
				var reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)"),
					result = reg.exec(document.cookie);
				if(result) {
					return result[2] || null
				}
			}
			return null
		};
		baidu.cookie.get = function(key) {
			var value = baidu.cookie.getRaw(key);
			if("string" == typeof value) {
				value = decodeURIComponent(value);
				return value
			}
			return null
		};
		baidu.cookie.setRaw = function(key, value, options) {
			if(!baidu.cookie._isValidKey(key)) {
				return
			}
			options = options || {};
			var expires = options.expires;
			if("number" == typeof options.expires) {
				expires = new Date();
				expires.setTime(expires.getTime() + options.expires)
			}
			document.cookie = key + "=" + value + (options.path ? "; path=" + options.path : "") + (expires ? "; expires=" + expires.toGMTString() : "") + (options.domain ? "; domain=" + options.domain : "") + (options.secure ? "; secure" : "")
		};
		baidu.cookie.remove = function(key, options) {
			options = options || {};
			options.expires = new Date(0);
			baidu.cookie.setRaw(key, "", options)
		};
		baidu.cookie.set = function(key, value, options) {
			baidu.cookie.setRaw(key, encodeURIComponent(value), options)
		};
		baidu.dom = baidu.dom || {};
		baidu.dom._NAME_ATTRS = (function() {
			var result = {
				cellpadding: "cellPadding",
				cellspacing: "cellSpacing",
				colspan: "colSpan",
				rowspan: "rowSpan",
				valign: "vAlign",
				usemap: "useMap",
				frameborder: "frameBorder"
			};
			if(baidu.browser.ie < 8) {
				result["for"] = "htmlFor";
				result["class"] = "className"
			} else {
				result.htmlFor = "for";
				result.className = "class"
			}
			return result
		})();
		baidu.lang = baidu.lang || {};
		baidu.lang.isString = function(source) {
			return "[object String]" == Object.prototype.toString.call(source)
		};
		baidu.isString = baidu.lang.isString;
		baidu.dom._g = function(id) {
			if(baidu.lang.isString(id)) {
				return document.getElementById(id)
			}
			return id
		};
		baidu._g = baidu.dom._g;
		baidu.dom.g = function(id) {
			if("string" == typeof id || id instanceof String) {
				return document.getElementById(id)
			} else {
				if(id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
					return id
				}
			}
			return null
		};
		baidu.g = baidu.G = baidu.dom.g;
		baidu.dom._matchNode = function(element, direction, start) {
			element = baidu.dom.g(element);
			for(var node = element[start]; node; node = node[direction]) {
				if(node.nodeType == 1) {
					return node
				}
			}
			return null
		};
		baidu.dom._styleFilter = baidu.dom._styleFilter || [];
		baidu.dom._styleFilter[baidu.dom._styleFilter.length] = {
			get: function(key, value) {
				if(/color/i.test(key) && value.indexOf("rgb(") != -1) {
					var array = value.split(",");
					value = "#";
					for(var i = 0, color; color = array[i]; i++) {
						color = parseInt(color.replace(/[^\d]/gi, ""), 10).toString(16);
						value += color.length == 1 ? "0" + color : color
					}
					value = value.toUpperCase()
				}
				return value
			}
		};
		baidu.dom._styleFilter.filter = function(key, value, method) {
			for(var i = 0, filters = baidu.dom._styleFilter, filter; filter = filters[i]; i++) {
				if(filter = filter[method]) {
					value = filter(key, value)
				}
			}
			return value
		};
		baidu.dom._styleFilter[baidu.dom._styleFilter.length] = {
			set: function(key, value) {
				if(value.constructor == Number && !/zIndex|fontWeight|opacity|zoom|lineHeight/i.test(key)) {
					value = value + "px"
				}
				return value
			}
		};
		baidu.dom._styleFixer = baidu.dom._styleFixer || {};
		baidu.dom._styleFixer.display = baidu.browser.ie && baidu.browser.ie < 8 ? {
			set: function(element, value) {
				element = element.style;
				if(value == "inline-block") {
					element.display = "inline";
					element.zoom = 1
				} else {
					element.display = value
				}
			}
		} : baidu.browser.firefox && baidu.browser.firefox < 3 ? {
			set: function(element, value) {
				element.style.display = value == "inline-block" ? "-moz-inline-box" : value
			}
		} : null;
		baidu.dom._styleFixer["float"] = baidu.browser.ie ? "styleFloat" : "cssFloat";
		baidu.dom._styleFixer.opacity = baidu.browser.ie ? {
			get: function(element) {
				var filter = element.style.filter;
				return filter && filter.indexOf("opacity=") >= 0 ? (parseFloat(filter.match(/opacity=([^)]*)/)[1]) / 100) + "" : "1"
			},
			set: function(element, value) {
				var style = element.style;
				style.filter = (style.filter || "").replace(/alpha\([^\)]*\)/gi, "") + (value == 1 ? "" : "alpha(opacity=" + value * 100 + ")");
				style.zoom = 1
			}
		} : null;
		baidu.string = baidu.string || {};
		(function() {
			var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+$)", "g");
			baidu.string.trim = function(source) {
				return String(source).replace(trimer, "")
			}
		})();
		baidu.trim = baidu.string.trim;
		baidu.dom.addClass = function(element, className) {
			element = baidu.dom.g(element);
			var classArray = className.split(/\s+/),
				result = element.className,
				classMatch = " " + result + " ",
				i = 0,
				l = classArray.length;
			for(; i < l; i++) {
				if(classMatch.indexOf(" " + classArray[i] + " ") < 0) {
					result += (result ? " " : "") + classArray[i]
				}
			}
			element.className = result;
			return element
		};
		baidu.addClass = baidu.dom.addClass;
		baidu.dom.children = function(element) {
			element = baidu.dom.g(element);
			for(var children = [], tmpEl = element.firstChild; tmpEl; tmpEl = tmpEl.nextSibling) {
				if(tmpEl.nodeType == 1) {
					children.push(tmpEl)
				}
			}
			return children
		};
		baidu.dom.contains = function(container, contained) {
			var g = baidu.dom._g;
			container = g(container);
			contained = g(contained);
			return container.contains ? container != contained && container.contains(contained) : !! (container.compareDocumentPosition(contained) & 16)
		};
		baidu.dom.setAttr = function(element, key, value) {
			element = baidu.dom.g(element);
			if("style" == key) {
				element.style.cssText = value
			} else {
				key = baidu.dom._NAME_ATTRS[key] || key;
				element.setAttribute(key, value)
			}
			return element
		};
		baidu.setAttr = baidu.dom.setAttr;
		baidu.dom.setAttrs = function(element, attributes) {
			element = baidu.dom.g(element);
			for(var key in attributes) {
				baidu.dom.setAttr(element, key, attributes[key])
			}
			return element
		};
		baidu.setAttrs = baidu.dom.setAttrs;
		baidu.dom.create = function(tagName, opt_attributes) {
			var el = document.createElement(tagName),
				attributes = opt_attributes || {};
			return baidu.dom.setAttrs(el, attributes)
		};
		baidu.dom.first = function(element) {
			return baidu.dom._matchNode(element, "nextSibling", "firstChild")
		};
		baidu.dom.getAttr = function(element, key) {
			element = baidu.dom.g(element);
			if("style" == key) {
				return element.style.cssText
			}
			key = baidu.dom._NAME_ATTRS[key] || key;
			return element.getAttribute(key)
		};
		baidu.getAttr = baidu.dom.getAttr;
		baidu.dom.getDocument = function(element) {
			element = baidu.dom.g(element);
			return element.nodeType == 9 ? element : element.ownerDocument || element.document
		};
		baidu.dom.getComputedStyle = function(element, key) {
			element = baidu.dom._g(element);
			var doc = baidu.dom.getDocument(element),
				styles;
			if(doc.defaultView && doc.defaultView.getComputedStyle) {
				styles = doc.defaultView.getComputedStyle(element, null);
				if(styles) {
					return styles[key] || styles.getPropertyValue(key)
				}
			}
			return ""
		};
		baidu.string.toCamelCase = function(source) {
			if(source.indexOf("-") < 0 && source.indexOf("_") < 0) {
				return source
			}
			return source.replace(/[-_][^-_]/g, function(match) {
				return match.charAt(1).toUpperCase()
			})
		};
		baidu.dom.getStyle = function(element, key) {
			var dom = baidu.dom;
			element = dom.g(element);
			key = baidu.string.toCamelCase(key);
			var value = element.style[key] || (element.currentStyle ? element.currentStyle[key] : "") || dom.getComputedStyle(element, key);
			if(!value) {
				var fixer = dom._styleFixer[key];
				if(fixer) {
					value = fixer.get ? fixer.get(element) : baidu.dom.getStyle(element, fixer)
				}
			}
			if(fixer = dom._styleFilter) {
				value = fixer.filter(key, value, "get")
			}
			return value
		};
		baidu.getStyle = baidu.dom.getStyle;
		baidu.dom.getPosition = function(element) {
			element = baidu.dom.g(element);
			var doc = baidu.dom.getDocument(element),
				browser = baidu.browser,
				getStyle = baidu.dom.getStyle,
				BUGGY_GECKO_BOX_OBJECT = browser.isGecko > 0 && doc.getBoxObjectFor && getStyle(element, "position") == "absolute" && (element.style.top === "" || element.style.left === ""),
				pos = {
					left: 0,
					top: 0
				},
				viewport = (browser.ie && !browser.isStrict) ? doc.body : doc.documentElement,
				parent, box;
			if(element == viewport) {
				return pos
			}
			if(element.getBoundingClientRect) {
				box = element.getBoundingClientRect();
				pos.left = Math.floor(box.left) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
				pos.top = Math.floor(box.top) + Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
				pos.left -= doc.documentElement.clientLeft;
				pos.top -= doc.documentElement.clientTop;
				var htmlDom = doc.body,
					htmlBorderLeftWidth = parseInt(getStyle(htmlDom, "borderLeftWidth")),
					htmlBorderTopWidth = parseInt(getStyle(htmlDom, "borderTopWidth"));
				if(browser.ie && !browser.isStrict) {
					pos.left -= isNaN(htmlBorderLeftWidth) ? 2 : htmlBorderLeftWidth;
					pos.top -= isNaN(htmlBorderTopWidth) ? 2 : htmlBorderTopWidth
				}
			} else {
				parent = element;
				do {
					pos.left += parent.offsetLeft;
					pos.top += parent.offsetTop;
					if(browser.isWebkit > 0 && getStyle(parent, "position") == "fixed") {
						pos.left += doc.body.scrollLeft;
						pos.top += doc.body.scrollTop;
						break
					}
					parent = parent.offsetParent
				} while (parent && parent != element);
				if(browser.opera > 0 || (browser.isWebkit > 0 && getStyle(element, "position") == "absolute")) {
					pos.top -= doc.body.offsetTop
				}
				parent = element.offsetParent;
				while(parent && parent != doc.body) {
					pos.left -= parent.scrollLeft;
					if(!browser.opera || parent.tagName != "TR") {
						pos.top -= parent.scrollTop
					}
					parent = parent.offsetParent
				}
			}
			return pos
		};
		baidu.dom.hasClass = function(element, className) {
			element = baidu.dom.g(element);
			var classArray = baidu.string.trim(className).split(/\s+/),
				len = classArray.length;
			className = element.className.split(/\s+/).join(" ");
			while(len--) {
				if(!(new RegExp("(^| )" + classArray[len] + "( |$)")).test(className)) {
					return false
				}
			}
			return true
		};
		baidu.dom.hide = function(element) {
			element = baidu.dom.g(element);
			element.style.display = "none";
			return element
		};
		baidu.hide = baidu.dom.hide;
		baidu.dom.insertAfter = function(newElement, existElement) {
			var g, existParent;
			g = baidu.dom._g;
			newElement = g(newElement);
			existElement = g(existElement);
			existParent = existElement.parentNode;
			if(existParent) {
				existParent.insertBefore(newElement, existElement.nextSibling)
			}
			return newElement
		};
		baidu.dom.insertBefore = function(newElement, existElement) {
			var g, existParent;
			g = baidu.dom._g;
			newElement = g(newElement);
			existElement = g(existElement);
			existParent = existElement.parentNode;
			if(existParent) {
				existParent.insertBefore(newElement, existElement)
			}
			return newElement
		};
		baidu.dom.insertHTML = function(element, position, html) {
			element = baidu.dom.g(element);
			var range, begin;
			if(element.insertAdjacentHTML && !baidu.browser.opera) {
				element.insertAdjacentHTML(position, html)
			} else {
				range = element.ownerDocument.createRange();
				position = position.toUpperCase();
				if(position == "AFTERBEGIN" || position == "BEFOREEND") {
					range.selectNodeContents(element);
					range.collapse(position == "AFTERBEGIN")
				} else {
					begin = position == "BEFOREBEGIN";
					range[begin ? "setStartBefore" : "setEndAfter"](element);
					range.collapse(begin)
				}
				range.insertNode(range.createContextualFragment(html))
			}
			return element
		};
		baidu.insertHTML = baidu.dom.insertHTML;
		baidu.dom.next = function(element) {
			return baidu.dom._matchNode(element, "nextSibling", "nextSibling")
		};
		baidu.string.escapeReg = function(source) {
			return String(source).replace(new RegExp("([.*+?^=!:${}()|[\\]/\\\\])", "g"), "\\\x241")
		};
		baidu.dom.q = function(className, element, tagName) {
			var result = [],
				trim = baidu.string.trim,
				len, i, elements, node;
			if(!(className = trim(className))) {
				return result
			}
			if("undefined" == typeof element) {
				element = document
			} else {
				element = baidu.dom.g(element);
				if(!element) {
					return result
				}
			}
			tagName && (tagName = trim(tagName).toUpperCase());
			if(element.getElementsByClassName) {
				elements = element.getElementsByClassName(className);
				len = elements.length;
				for(i = 0; i < len; i++) {
					node = elements[i];
					if(tagName && node.tagName != tagName) {
						continue
					}
					result[result.length] = node
				}
			} else {
				className = new RegExp("(^|\\s)" + baidu.string.escapeReg(className) + "(\\s|$)");
				elements = tagName ? element.getElementsByTagName(tagName) : (element.all || element.getElementsByTagName("*"));
				len = elements.length;
				for(i = 0; i < len; i++) {
					node = elements[i];
					className.test(node.className) && (result[result.length] = node)
				}
			}
			return result
		};
		baidu.q = baidu.Q = baidu.dom.q;
		(function() {
			var ready = baidu.dom.ready = function() {
					var readyBound = false,
						readyList = [],
						DOMContentLoaded;
					if(document.addEventListener) {
						DOMContentLoaded = function() {
							document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
							ready()
						}
					} else {
						if(document.attachEvent) {
							DOMContentLoaded = function() {
								if(document.readyState === "complete") {
									document.detachEvent("onreadystatechange", DOMContentLoaded);
									ready()
								}
							}
						}
					}
					function ready() {
						if(!ready.isReady) {
							ready.isReady = true;
							for(var i = 0, j = readyList.length; i < j; i++) {
								readyList[i]()
							}
						}
					}
					function doScrollCheck() {
						try {
							document.documentElement.doScroll("left")
						} catch(e) {
							setTimeout(doScrollCheck, 1);
							return
						}
						ready()
					}
					function bindReady() {
						if(readyBound) {
							return
						}
						readyBound = true;
						if(document.addEventListener) {
							document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
							window.addEventListener("load", ready, false)
						} else {
							if(document.attachEvent) {
								document.attachEvent("onreadystatechange", DOMContentLoaded);
								window.attachEvent("onload", ready);
								var toplevel = false;
								try {
									toplevel = window.frameElement == null
								} catch(e) {}
								if(document.documentElement.doScroll && toplevel) {
									doScrollCheck()
								}
							}
						}
					}
					bindReady();
					return function(callback) {
						ready.isReady ? callback() : readyList.push(callback)
					}
				}();
			ready.isReady = false
		})();
		baidu.dom.remove = function(element) {
			element = baidu.dom._g(element);
			var tmpEl = element.parentNode;
			tmpEl && tmpEl.removeChild(element)
		};
		baidu.dom.removeClass = function(element, className) {
			element = baidu.dom.g(element);
			var oldClasses = element.className.split(/\s+/),
				newClasses = className.split(/\s+/),
				lenOld, lenDel = newClasses.length,
				j, i = 0;
			for(; i < lenDel; ++i) {
				for(j = 0, lenOld = oldClasses.length; j < lenOld; ++j) {
					if(oldClasses[j] == newClasses[i]) {
						oldClasses.splice(j, 1);
						break
					}
				}
			}
			element.className = oldClasses.join(" ");
			return element
		};
		baidu.removeClass = baidu.dom.removeClass;
		baidu.dom.setStyle = function(element, key, value) {
			var dom = baidu.dom,
				fixer;
			element = dom.g(element);
			key = baidu.string.toCamelCase(key);
			if(fixer = dom._styleFilter) {
				value = fixer.filter(key, value, "set")
			}
			fixer = dom._styleFixer[key];
			(fixer && fixer.set) ? fixer.set(element, value) : (element.style[fixer || key] = value);
			return element
		};
		baidu.setStyle = baidu.dom.setStyle;
		baidu.dom.setStyles = function(element, styles) {
			element = baidu.dom.g(element);
			for(var key in styles) {
				baidu.dom.setStyle(element, key, styles[key])
			}
			return element
		};
		baidu.setStyles = baidu.dom.setStyles;
		baidu.dom.show = function(element) {
			element = baidu.dom.g(element);
			element.style.display = "";
			return element
		};
		baidu.show = baidu.dom.show;
		baidu.dom.toggle = function(element) {
			element = baidu.dom.g(element);
			element.style.display = element.style.display == "none" ? "" : "none";
			return element
		};
		baidu.event = baidu.event || {};
		baidu.event.EventArg = function(event, win) {
			win = win || window;
			event = event || win.event;
			var doc = win.document;
			this.target = (event.target) || event.srcElement;
			this.keyCode = event.which || event.keyCode;
			for(var k in event) {
				var item = event[k];
				if("function" != typeof item) {
					this[k] = item
				}
			}
			if(!this.pageX && this.pageX !== 0) {
				this.pageX = (event.clientX || 0) + (doc.documentElement.scrollLeft || doc.body.scrollLeft);
				this.pageY = (event.clientY || 0) + (doc.documentElement.scrollTop || doc.body.scrollTop)
			}
			this._event = event
		};
		baidu.event.EventArg.prototype.preventDefault = function() {
			if(this._event.preventDefault) {
				this._event.preventDefault()
			} else {
				this._event.returnValue = false
			}
			return this
		};
		baidu.event.EventArg.prototype.stopPropagation = function() {
			if(this._event.stopPropagation) {
				this._event.stopPropagation()
			} else {
				this._event.cancelBubble = true
			}
			return this
		};
		baidu.event.EventArg.prototype.stop = function() {
			return this.stopPropagation().preventDefault()
		};
		baidu.event._listeners = baidu.event._listeners || [];
		baidu.event.get = function(event, win) {
			return new baidu.event.EventArg(event, win)
		};
		baidu.event.getTarget = function(event) {
			return event.target || event.srcElement
		};
		baidu.event.on = function(element, type, listener) {
			type = type.replace(/^on/i, "");
			element = baidu.dom._g(element);
			var realListener = function(ev) {
					listener.call(element, ev)
				},
				lis = baidu.event._listeners,
				filter = baidu.event._eventFilter,
				afterFilter, realType = type;
			type = type.toLowerCase();
			if(filter && filter[type]) {
				afterFilter = filter[type](element, type, realListener);
				realType = afterFilter.type;
				realListener = afterFilter.listener
			}
			if(element.addEventListener) {
				element.addEventListener(realType, realListener, false)
			} else {
				if(element.attachEvent) {
					element.attachEvent("on" + realType, realListener)
				}
			}
			lis[lis.length] = [element, type, listener, realListener, realType];
			return element
		};
		baidu.on = baidu.event.on;
		baidu.event.preventDefault = function(event) {
			if(event.preventDefault) {
				event.preventDefault()
			} else {
				event.returnValue = false
			}
		};
		baidu.event.un = function(element, type, listener) {
			element = baidu.dom._g(element);
			type = type.replace(/^on/i, "").toLowerCase();
			var lis = baidu.event._listeners,
				len = lis.length,
				isRemoveAll = !listener,
				item, realType, realListener;
			while(len--) {
				item = lis[len];
				if(item[1] === type && item[0] === element && (isRemoveAll || item[2] === listener)) {
					realType = item[4];
					realListener = item[3];
					if(element.removeEventListener) {
						element.removeEventListener(realType, realListener, false)
					} else {
						if(element.detachEvent) {
							element.detachEvent("on" + realType, realListener)
						}
					}
					lis.splice(len, 1)
				}
			}
			return element
		};
		baidu.un = baidu.event.un;
		baidu.json = baidu.json || {};
		baidu.json.parse = function(data) {
			return(new Function("return (" + data + ")"))()
		};
		baidu.json.stringify = (function() {
			var escapeMap = {
				"\b": "\\b",
				"\t": "\\t",
				"\n": "\\n",
				"\f": "\\f",
				"\r": "\\r",
				'"': '\\"',
				"\\": "\\\\"
			};

			function encodeString(source) {
				if(/["\\\x00-\x1f]/.test(source)) {
					source = source.replace(/["\\\x00-\x1f]/g, function(match) {
						var c = escapeMap[match];
						if(c) {
							return c
						}
						c = match.charCodeAt();
						return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
					})
				}
				return '"' + source + '"'
			}
			function encodeArray(source) {
				var result = ["["],
					l = source.length,
					preComma, i, item;
				for(i = 0; i < l; i++) {
					item = source[i];
					switch(typeof item) {
					case "undefined":
					case "function":
					case "unknown":
						break;
					default:
						if(preComma) {
							result.push(",")
						}
						result.push(baidu.json.stringify(item));
						preComma = 1
					}
				}
				result.push("]");
				return result.join("")
			}
			function pad(source) {
				return source < 10 ? "0" + source : source
			}
			function encodeDate(source) {
				return '"' + source.getFullYear() + "-" + pad(source.getMonth() + 1) + "-" + pad(source.getDate()) + "T" + pad(source.getHours()) + ":" + pad(source.getMinutes()) + ":" + pad(source.getSeconds()) + '"'
			}
			return function(value) {
				switch(typeof value) {
				case "undefined":
					return "undefined";
				case "number":
					return isFinite(value) ? String(value) : "null";
				case "string":
					return encodeString(value);
				case "boolean":
					return String(value);
				default:
					if(value === null) {
						return "null"
					} else {
						if(value instanceof Array) {
							return encodeArray(value)
						} else {
							if(value instanceof Date) {
								return encodeDate(value)
							} else {
								var result = ["{"],
									encode = baidu.json.stringify,
									preComma, item;
								for(var key in value) {
									if(Object.prototype.hasOwnProperty.call(value, key)) {
										item = value[key];
										switch(typeof item) {
										case "undefined":
										case "unknown":
										case "function":
											break;
										default:
											if(preComma) {
												result.push(",")
											}
											preComma = 1;
											result.push(encode(key) + ":" + encode(item))
										}
									}
								}
								result.push("}");
								return result.join("")
							}
						}
					}
				}
			}
		})();
		(function() {
			var guid = window[baidu.guid];
			baidu.lang.guid = function() {
				return "TANGRAM__" + (guid._counter++).toString(36)
			};
			guid._counter = guid._counter || 1
		})();
		window[baidu.guid]._instances = window[baidu.guid]._instances || {};
		baidu.lang.isFunction = function(source) {
			return "[object Function]" == Object.prototype.toString.call(source)
		};
		baidu.lang.Class = function(guid) {
			this.guid = guid || baidu.lang.guid();
			window[baidu.guid]._instances[this.guid] = this
		};
		window[baidu.guid]._instances = window[baidu.guid]._instances || {};
		baidu.lang.Class.prototype.dispose = function() {
			delete window[baidu.guid]._instances[this.guid];
			for(var property in this) {
				if(!baidu.lang.isFunction(this[property])) {
					delete this[property]
				}
			}
			this.disposed = true
		};
		baidu.lang.Class.prototype.toString = function() {
			return "[object " + (this._className || "Object") + "]"
		};
		baidu.lang.Event = function(type, target) {
			this.type = type;
			this.returnValue = true;
			this.target = target || null;
			this.currentTarget = null
		};
		baidu.lang.Class.prototype.addEventListener = function(type, handler, key) {
			if(!baidu.lang.isFunction(handler)) {
				return
			}!this.__listeners && (this.__listeners = {});
			var t = this.__listeners,
				id;
			if(typeof key == "string" && key) {
				if(/[^\w\-]/.test(key)) {
					throw("nonstandard key:" + key)
				} else {
					handler.hashCode = key;
					id = key
				}
			}
			type.indexOf("on") != 0 && (type = "on" + type);
			typeof t[type] != "object" && (t[type] = {});
			id = id || baidu.lang.guid();
			handler.hashCode = id;
			t[type][id] = handler
		};
		baidu.lang.Class.prototype.removeEventListener = function(type, handler) {
			if(typeof handler != "undefined") {
				if((baidu.lang.isFunction(handler) && !(handler = handler.hashCode)) || (!baidu.lang.isString(handler))) {
					return
				}
			}!this.__listeners && (this.__listeners = {});
			type.indexOf("on") != 0 && (type = "on" + type);
			var t = this.__listeners;
			if(!t[type]) {
				return
			}
			if(typeof handler != "undefined") {
				t[type][handler] && delete t[type][handler]
			} else {
				for(var guid in t[type]) {
					delete t[type][guid]
				}
			}
		};
		baidu.lang.Class.prototype.dispatchEvent = function(event, options) {
			if(baidu.lang.isString(event)) {
				event = new baidu.lang.Event(event)
			}!this.__listeners && (this.__listeners = {});
			options = options || {};
			for(var i in options) {
				event[i] = options[i]
			}
			var i, t = this.__listeners,
				p = event.type;
			event.target = event.target || this;
			event.currentTarget = this;
			p.indexOf("on") != 0 && (p = "on" + p);
			baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);
			if(typeof t[p] == "object") {
				for(i in t[p]) {
					t[p][i].apply(this, arguments)
				}
			}
			return event.returnValue
		};
		baidu.lang.inherits = function(subClass, superClass, className) {
			var key, proto, selfProps = subClass.prototype,
				clazz = new Function();
			clazz.prototype = superClass.prototype;
			proto = subClass.prototype = new clazz();
			for(key in selfProps) {
				proto[key] = selfProps[key]
			}
			subClass.prototype.constructor = subClass;
			subClass.superClass = superClass.prototype;
			if("string" == typeof className) {
				proto._className = className
			}
		};
		baidu.inherits = baidu.lang.inherits;
		baidu.lang.instance = function(guid) {
			return window[baidu.guid]._instances[guid] || null
		};
		baidu.lang.isArray = function(source) {
			return "[object Array]" == Object.prototype.toString.call(source)
		};
		baidu.lang.isElement = function(source) {
			return !!(source && source.nodeName && source.nodeType == 1)
		};
		baidu.lang.isNumber = function(source) {
			return "[object Number]" == Object.prototype.toString.call(source) && isFinite(source)
		};
		baidu.lang.isObject = function(source) {
			return "function" == typeof source || !! (source && "object" == typeof source)
		};
		baidu.isObject = baidu.lang.isObject;
		baidu.lang.module = function(name, module, owner) {
			var packages = name.split("."),
				len = packages.length - 1,
				packageName, i = 0;
			if(!owner) {
				try {
					if(!(new RegExp("^[a-zA-Z_$][a-zA-Z0-9_$]*$")).test(packages[0])) {
						throw ""
					}
					owner = eval(packages[0]);
					i = 1
				} catch(e) {
					owner = window
				}
			}
			for(; i < len; i++) {
				packageName = packages[i];
				if(!owner[packageName]) {
					owner[packageName] = {}
				}
				owner = owner[packageName]
			}
			if(!owner[packages[len]]) {
				owner[packages[len]] = module
			}
		};
		baidu.lang.toArray = function(source) {
			if(source === null || source === undefined) {
				return []
			}
			if(baidu.lang.isArray(source)) {
				return source
			}
			if(typeof source.length !== "number" || typeof source === "string" || baidu.lang.isFunction(source)) {
				return [source]
			}
			if(source.item) {
				var l = source.length,
					array = new Array(l);
				while(l--) {
					array[l] = source[l]
				}
				return array
			}
			return [].slice.call(source)
		};
		baidu.object = baidu.object || {};
		baidu.object.isPlain = function(obj) {
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				key;
			if(!obj || Object.prototype.toString.call(obj) !== "[object Object]" || !("isPrototypeOf" in obj)) {
				return false
			}
			if(obj.constructor && !hasOwnProperty.call(obj, "constructor") && !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
				return false
			}
			for(key in obj) {}
			return key === undefined || hasOwnProperty.call(obj, key)
		};
		baidu.object.clone = function(source) {
			var result = source,
				i, len;
			if(!source || source instanceof Number || source instanceof String || source instanceof Boolean) {
				return result
			} else {
				if(baidu.lang.isArray(source)) {
					result = [];
					var resultLen = 0;
					for(i = 0, len = source.length; i < len; i++) {
						result[resultLen++] = baidu.object.clone(source[i])
					}
				} else {
					if(baidu.object.isPlain(source)) {
						result = {};
						for(i in source) {
							if(source.hasOwnProperty(i)) {
								result[i] = baidu.object.clone(source[i])
							}
						}
					}
				}
			}
			return result
		};
		baidu.extend = baidu.object.extend = function(target, source) {
			for(var p in source) {
				if(source.hasOwnProperty(p)) {
					target[p] = source[p]
				}
			}
			return target
		};
		baidu.page = baidu.page || {};
		baidu.page.getScrollTop = function() {
			var d = document;
			return window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop
		};
		baidu.page.getViewHeight = function() {
			var doc = document,
				client = doc.compatMode == "BackCompat" ? doc.body : doc.documentElement;
			return client.clientHeight
		};
		baidu.page.getViewWidth = function() {
			var doc = document,
				client = doc.compatMode == "BackCompat" ? doc.body : doc.documentElement;
			return client.clientWidth
		};
		baidu.sio = baidu.sio || {};
		baidu.sio._removeScriptTag = function(scr) {
			if(scr.clearAttributes) {
				scr.clearAttributes()
			} else {
				for(var attr in scr) {
					if(scr.hasOwnProperty(attr)) {
						delete scr[attr]
					}
				}
			}
			if(scr && scr.parentNode) {
				scr.parentNode.removeChild(scr)
			}
			scr = null
		};
		baidu.sio._createScriptTag = function(scr, url, charset) {
			scr.setAttribute("type", "text/javascript");
			charset && scr.setAttribute("charset", charset);
			scr.setAttribute("src", url);
			document.getElementsByTagName("head")[0].appendChild(scr)
		};
		baidu.sio.callByBrowser = function(url, opt_callback, opt_options) {
			var scr = document.createElement("SCRIPT"),
				scriptLoaded = 0,
				options = opt_options || {},
				charset = options.charset,
				callback = opt_callback ||
			function() {}, timeOut = options.timeOut || 0, timer;
			scr.onload = scr.onreadystatechange = function() {
				if(scriptLoaded) {
					return
				}
				var readyState = scr.readyState;
				if("undefined" == typeof readyState || readyState == "loaded" || readyState == "complete") {
					scriptLoaded = 1;
					try {
						callback();
						clearTimeout(timer)
					} finally {
						scr.onload = scr.onreadystatechange = null;
						baidu.sio._removeScriptTag(scr)
					}
				}
			};
			if(timeOut) {
				timer = setTimeout(function() {
					scr.onload = scr.onreadystatechange = null;
					baidu.sio._removeScriptTag(scr);
					options.onfailure && options.onfailure()
				}, timeOut)
			}
			baidu.sio._createScriptTag(scr, url, charset)
		};
		baidu.sio.callByServer = function(url, callback, opt_options) {
			var scr = document.createElement("SCRIPT"),
				prefix = "bd__cbs__",
				callbackName, callbackImpl, options = opt_options || {},
				charset = options.charset,
				queryField = options.queryField || "callback",
				timeOut = options.timeOut || 0,
				timer, reg = new RegExp("(\\?|&)" + queryField + "=([^&]*)"),
				matches;
			if(baidu.lang.isFunction(callback)) {
				callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
				window[callbackName] = getCallBack(0)
			} else {
				if(baidu.lang.isString(callback)) {
					callbackName = callback
				} else {
					if(matches = reg.exec(url)) {
						callbackName = matches[2]
					}
				}
			}
			if(timeOut) {
				timer = setTimeout(getCallBack(1), timeOut)
			}
			url = url.replace(reg, "$1" + queryField + "=" + callbackName);
			if(url.search(reg) < 0) {
				url += (url.indexOf("?") < 0 ? "?" : "&") + queryField + "=" + callbackName
			}
			baidu.sio._createScriptTag(scr, url, charset);

			function getCallBack(onTimeOut) {
				return function() {
					try {
						if(onTimeOut) {
							options.onfailure && options.onfailure()
						} else {
							callback.apply(window, arguments);
							clearTimeout(timer)
						}
						window[callbackName] = null;
						delete window[callbackName]
					} catch(exception) {} finally {
						baidu.sio._removeScriptTag(scr)
					}
				}
			}
		};
		baidu.string.decodeHTML = function(source) {
			var str = String(source).replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
			return str.replace(/&#([\d]+);/g, function(_0, _1) {
				return String.fromCharCode(parseInt(_1, 10))
			})
		};
		baidu.decodeHTML = baidu.string.decodeHTML;
		baidu.string.encodeHTML = function(source) {
			return String(source).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
		};
		baidu.encodeHTML = baidu.string.encodeHTML;
		baidu.string.format = function(source, opts) {
			source = String(source);
			var data = Array.prototype.slice.call(arguments, 1),
				toString = Object.prototype.toString;
			if(data.length) {
				data = data.length == 1 ? (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) : data;
				return source.replace(/#\{(.+?)\}/g, function(match, key) {
					var replacer = data[key];
					if("[object Function]" == toString.call(replacer)) {
						replacer = replacer(key)
					}
					return("undefined" == typeof replacer ? "" : replacer)
				})
			}
			return source
		};
		baidu.format = baidu.string.format;
		baidu.string.getByteLength = function(source) {
			return String(source).replace(/[^\x00-\xff]/g, "ci").length
		};
		baidu.swf = baidu.swf || {};
		baidu.swf.version = (function() {
			var n = navigator;
			if(n.plugins && n.mimeTypes.length) {
				var plugin = n.plugins["Shockwave Flash"];
				if(plugin && plugin.description) {
					return plugin.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".") + ".0"
				}
			} else {
				if(window.ActiveXObject && !window.opera) {
					for(var i = 12; i >= 2; i--) {
						try {
							var c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
							if(c) {
								var version = c.GetVariable("$version");
								return version.replace(/WIN/g, "").replace(/,/g, ".")
							}
						} catch(e) {}
					}
				}
			}
		})();
		baidu.swf.createHTML = function(options) {
			options = options || {};
			var version = baidu.swf.version,
				needVersion = options.ver || "6.0.0",
				vUnit1, vUnit2, i, k, len, item, tmpOpt = {},
				encodeHTML = baidu.string.encodeHTML;
			for(k in options) {
				tmpOpt[k] = options[k]
			}
			options = tmpOpt;
			if(version) {
				version = version.split(".");
				needVersion = needVersion.split(".");
				for(i = 0; i < 3; i++) {
					vUnit1 = parseInt(version[i], 10);
					vUnit2 = parseInt(needVersion[i], 10);
					if(vUnit2 < vUnit1) {
						break
					} else {
						if(vUnit2 > vUnit1) {
							return ""
						}
					}
				}
			} else {
				return ""
			}
			var vars = options.vars,
				objProperties = ["classid", "codebase", "id", "width", "height", "align"];
			options.align = options.align || "middle";
			options.classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000";
			options.codebase = "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0";
			options.movie = options.url || "";
			delete options.vars;
			delete options.url;
			if("string" == typeof vars) {
				options.flashvars = vars
			} else {
				var fvars = [];
				for(k in vars) {
					item = vars[k];
					fvars.push(k + "=" + encodeURIComponent(item))
				}
				options.flashvars = fvars.join("&")
			}
			var str = ["<object "];
			for(i = 0, len = objProperties.length; i < len; i++) {
				item = objProperties[i];
				str.push(" ", item, '="', encodeHTML(options[item]), '"')
			}
			str.push(">");
			var params = {
				wmode: 1,
				scale: 1,
				quality: 1,
				play: 1,
				loop: 1,
				menu: 1,
				salign: 1,
				bgcolor: 1,
				base: 1,
				allowscriptaccess: 1,
				allownetworking: 1,
				allowfullscreen: 1,
				seamlesstabbing: 1,
				devicefont: 1,
				swliveconnect: 1,
				flashvars: 1,
				movie: 1
			};
			for(k in options) {
				item = options[k];
				k = k.toLowerCase();
				if(params[k] && (item || item === false || item === 0)) {
					str.push('<param name="' + k + '" value="' + encodeHTML(item) + '" />')
				}
			}
			options.src = options.movie;
			options.name = options.id;
			delete options.id;
			delete options.movie;
			delete options.classid;
			delete options.codebase;
			options.type = "application/x-shockwave-flash";
			options.pluginspage = "http://www.macromedia.com/go/getflashplayer";
			str.push("<embed");
			var salign;
			for(k in options) {
				item = options[k];
				if(item || item === false || item === 0) {
					if((new RegExp("^salign$", "i")).test(k)) {
						salign = item;
						continue
					}
					str.push(" ", k, '="', encodeHTML(item), '"')
				}
			}
			if(salign) {
				str.push(' salign="', encodeHTML(salign), '"')
			}
			str.push("></embed></object>");
			return str.join("")
		};
		baidu.swf.create = function(options, target) {
			options = options || {};
			var html = baidu.swf.createHTML(options) || options.errorMessage || "";
			if(target && "string" == typeof target) {
				target = document.getElementById(target)
			}
			if(target) {
				target.innerHTML = html
			} else {
				document.write(html)
			}
		};
		baidu.swf.getMovie = function(name) {
			var movie = document[name],
				ret;
			return baidu.browser.ie == 9 ? movie && movie.length ? (ret = baidu.array.remove(baidu.lang.toArray(movie), function(item) {
				return item.tagName.toLowerCase() != "embed"
			})).length == 1 ? ret[0] : ret : movie : movie || window[name]
		};
		baidu.url = baidu.url || {};
		baidu.url.getQueryValue = function(url, key) {
			var reg = new RegExp("(^|&|\\?|#)" + baidu.string.escapeReg(key) + "=([^&#]*)(&|$|#)", "");
			var match = url.match(reg);
			if(match) {
				return match[2]
			}
			return null
		};
		baidu.url = baidu.url || {};
		baidu.lang = baidu.lang || {};
		baidu.lang.isArray = function(source) {
			return "[object Array]" == Object.prototype.toString.call(source)
		};
		baidu.url.queryToJson = function(url) {
			var query = url.substr(url.lastIndexOf("?") + 1),
				params = query.split("&"),
				len = params.length,
				result = {},
				i = 0,
				key, value, item, param;
			for(; i < len; i++) {
				if(!params[i]) {
					continue
				}
				param = params[i].split("=");
				key = param[0];
				value = param[1];
				item = result[key];
				if("undefined" == typeof item) {
					result[key] = value
				} else {
					if(baidu.lang.isArray(item)) {
						item.push(value)
					} else {
						result[key] = [item, value]
					}
				}
			}
			return result
		};
		baidu.url.escapeSymbol = function(source) {
			return String(source).replace(/[#%&+=\/\\\ \隆隆\f\r\n\t]/g, function(all) {
				return "%" + (256 + all.charCodeAt()).toString(16).substring(1).toUpperCase()
			})
		};
		baidu.object = baidu.object || {};
		baidu.object.each = function(source, iterator) {
			var returnValue, key, item;
			if("function" == typeof iterator) {
				for(key in source) {
					if(source.hasOwnProperty(key)) {
						item = source[key];
						returnValue = iterator.call(source, item, key);
						if(returnValue === false) {
							break
						}
					}
				}
			}
			return source
		};
		baidu.url.jsonToQuery = function(json, replacer_opt) {
			var result = [],
				itemLen, replacer = replacer_opt ||
			function(value) {
				return baidu.url.escapeSymbol(value)
			};
			baidu.object.each(json, function(item, key) {
				if(baidu.lang.isArray(item)) {
					itemLen = item.length;
					while(itemLen--) {
						result.push(key + "=" + replacer(item[itemLen], key))
					}
				} else {
					result.push(key + "=" + replacer(item, key))
				}
			});
			return result.join("&")
		};
		baidu.string = baidu.string || {};
		baidu.string.getByteLength = function(source) {
			return String(source).replace(/[^\x00-\xff]/g, "ci").length
		};
		baidu.string.subByte = function(source, length, tail) {
			source = String(source);
			tail = tail || "";
			if(length < 0 || baidu.string.getByteLength(source) <= length) {
				return source + tail
			}
			source = source.substr(0, length).replace(/([^\x00-\xff])/g, "$1 ").substr(0, length).replace(/[^\x00-\xff]$/, "").replace(/([^\x00-\xff]) /g, "$1");
			return source + tail
		};
		baidu.page = baidu.page || {};
		baidu.page.getHeight = function() {
			var doc = document,
				body = doc.body,
				html = doc.documentElement,
				client = doc.compatMode == "BackCompat" ? body : doc.documentElement;
			return Math.max(html.scrollHeight, body.scrollHeight, client.clientHeight)
		};
		baidu.page.getWidth = function() {
			var doc = document,
				body = doc.body,
				html = doc.documentElement,
				client = doc.compatMode == "BackCompat" ? body : doc.documentElement;
			return Math.max(html.scrollWidth, body.scrollWidth, client.clientWidth)
		};
		baidu.dom = baidu.dom || {};
		baidu.dom.g = function(id) {
			if("string" == typeof id || id instanceof String) {
				return document.getElementById(id)
			} else {
				if(id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
					return id
				}
			}
			return null
		};
		baidu.g = baidu.G = baidu.dom.g;
		baidu.dom.hasAttr = function(element, name) {
			element = baidu.g(element);
			var attr = element.attributes.getNamedItem(name);
			return !!(attr && attr.specified)
		};
		baidu.dom.getAncestorBy = function(element, method) {
			element = baidu.dom.g(element);
			while((element = element.parentNode) && element.nodeType == 1) {
				if(method(element)) {
					return element
				}
			}
			return null
		};
		baidu.lang.isString = function(source) {
			return "[object String]" == Object.prototype.toString.call(source)
		};
		baidu.isString = baidu.lang.isString;
		baidu.dom._g = function(id) {
			if(baidu.lang.isString(id)) {
				return document.getElementById(id)
			}
			return id
		};
		baidu._g = baidu.dom._g;
		baidu.dom.getText = function(element) {
			var ret = "",
				childs, i = 0,
				l;
			element = baidu._g(element);
			if(element.nodeType === 3 || element.nodeType === 4) {
				ret += element.nodeValue
			} else {
				if(element.nodeType !== 8) {
					childs = element.childNodes;
					for(l = childs.length; i < l; i++) {
						ret += baidu.dom.getText(childs[i])
					}
				}
			}
			return ret
		};
		baidu.array = baidu.array || {};
		baidu.array.hash = function(keys, values) {
			var o = {},
				vl = values && values.length,
				i = 0,
				l = keys.length;
			for(; i < l; i++) {
				o[keys[i]] = (vl && vl > i) ? values[i] : true
			}
			return o
		};
		return T
	})();
	var baidu = A.baidu;
	var data = null;
	var fixs = [];
	var getJson = function(jsonString) {
			var result = {};
			if(jsonString) {
				try {
					var r = new Function("return " + jsonString)();
					if(r) {
						result = r
					}
				} catch(e) {}
			}
			return result
		};
	A.setup = function(k, v) {
		if(data == null) {
			data = {}
		}
		if(typeof k == "object") {
			baidu.extend(data, k)
		} else {
			data[k] = v
		}
	};
	A._Aladdin = function(fn) {
		this.fn = fn;
		this.p1 = 0;
		this.mu = null;
		this.container = null;
		this.data = data;
		data = null;
		this._init();
		var me = this;
		baidu.each(fixs, function(f, i) {
			f.call(me, me)
		})
	};
	A._Aladdin.prototype = {
		_init: function() {
			var me = this,
				con, scripts = document.getElementsByTagName("script");
			con = me.container = me.getContainer(scripts[scripts.length - 1]);
			var attrs = getJson(me.container.getAttribute("data-click"));
			me.p1 = attrs.p1 || con.id;
			me.mu = attrs.mu || con.getAttribute("mu");
			me.srcid = attrs.rsv_srcid || con.getAttribute("srcid");
			me.fn.call(me)
		},
		q: function(className, tagName) {
			return baidu.dom.q(className, this.container, tagName)
		},
		qq: function(className, tagName) {
			return this.q(className, tagName)[0]
		},
		ready: function() {
			baidu.dom.ready.apply(this, arguments)
		},
		getContainer: function(el) {
			if(this.container) {
				return this.container
			}
			var con;
			while(el.parentNode && !baidu.dom.hasClass(con = el.parentNode, "result-op")) {
				el = con
			}
			return con
		},
		ajax: function(query, res_id, opt) {
			var AJAX = A.AJAX;
			var t = +new Date();
			var params = {
				query: query,
				co: opt.co || "",
				resource_id: res_id,
				t: t
			};
			baidu.extend(params, AJAX.PARAMS);
			var query = baidu.url.jsonToQuery(params, encodeURIComponent);
			var url = AJAX.API_URL + "?" + query;
			var err_log = function() {
					var img = new Image();
					img.src = baidu.format(AJAX.ERR_URL, {
						url: url
					});
					A.logs.push(img)
				};
			var fn = function(data) {
					if(data.status == 0) {
						opt.success(data.data)
					} else {
						opt.error && opt.error(data.status);
						err_log()
					}
				};
			baidu.sio.callByServer(url, fn, {
				charset: AJAX.PARAMS.oe,
				timeOut: AJAX.TIMEOUT,
				queryField: "cb",
				onfailure: function() {
					opt.timeout && opt.timeout();
					err_log()
				}
			})
		}
	};
	A.init = function(fn) {
		A.list.push(new A._Aladdin(fn ||
		function() {}))
	};
	A.list = [];
	A.logs = [];
	A.AJAX = {
		API_URL: "http://opendata.baidu.com/api.php",
		ERR_URL: "http://open.baidu.com/stat/al_e.gif?ajax_err_url=#{url}",
		PARAMS: {
			ie: "utf8",
			oe: "gbk",
			cb: "op_aladdin_callback",
			format: "json",
			tn: "baidu"
		},
		TIMEOUT: 6000
	};
	fixs.push(function(a) {
		if(baidu.browser.ie) {
			var pageCharset = document.charset;
			baidu.each(a.container.getElementsByTagName("form"), function(form, i) {
				var f = function() {
						var enconding = form.acceptCharset;
						if(enconding && enconding.toString().toUpperCase() != "UNKNOWN" && enconding != document.charset) {
							document.charset = enconding;
							setTimeout(function() {
								document.charset = pageCharset
							}, 1000)
						}
					};
				baidu.event.on(form, "submit", f);
				var _submit = form.submit;
				form.submit = function() {
					f();
					_submit()
				}
			})
		}
	})
})();
(function() {
	var f = window.A,
		b = {},
		i = {},
		q = {},
		n = document,
		l = n.getElementsByTagName("head")[0],
		g = false,
		e = ["baidu"],
		o = false,
		d = f.baidu,
		k = function() {};
	d.dom.ready(function() {
		g = true
	});

	function a(s, x) {
		var u = typeof s === "string" ? s.split(/\s*,\s*/) : s;
		if(u.length > 1) {
			if(x) {
				a(u.shift(), function() {
					if(u.length > 0) {
						a(u, x)
					}
				})
			} else {
				while(u.length) {
					a(u.shift())
				}
			}
			return
		}
		s = u[0];
		var w = s.replace(/\./g, "/");
		var r = s.replace(/^[\s\S]*\./, "");
		var t = f.uiPrefix + w + "/" + r;
		if(w.search("style/") == 0) {
			m(t + ".css", x)
		} else {
			if(!o && !(/^mini\//.test(s))) {
				o = true;
				a(e.concat(s), x);
				return
			}
			t += ".js";
			if(x) {
				p(t, x)
			} else {
				j(t)
			}
		}
	}
	a.cache = b;

	function m(s, t) {
		t = t || k;
		if(s in b) {
			t();
			return
		}
		var r = n.createElement("link");
		r.rel = "stylesheet";
		r.type = "text/css";
		r.href = s;
		l.appendChild(r);
		b[s] = 1;
		t()
	}
	function j(r) {
		if(g) {
			p(r, k);
			return
		}
		if(r in b) {
			return
		}
		n.write('<script charset="gb2312" type="text/javascript" src="' + r + '"><\/script>');
		b[r] = 1
	}
	function p(t, u) {
		u = u || k;
		if(t in b) {
			u();
			return
		}
		if(t in i) {
			q[t].push(u);
			return
		}
		i[t] = 1;
		var s = q[t] = [u];
		var r = n.createElement("script");
		r.type = "text/javascript";
		r.src = t;
		r.charset = "gb2312";
		r.onload = r.onreadystatechange = function() {
			if((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
				while(s.length) {
					s.shift()()
				}
				delete i[t];
				b[t] = 1;
				r.onload = r.onreadystatechange = null
			}
		};
		l.insertBefore(r, l.firstChild)
	}
	f.uicss = function(r) {
		m(f.uiPrefix + r)
	};
	f.uijs = function(r, s) {
		p(f.uiPrefix + r, s)
	};
	f.use = a;
	f.ui = f.ui || {}
})();
var baidu = A.baidu,
	T = baidu;