/*jshint browser:true, node:true*/
'use strict';

var _style = document.documentElement.style;

var animation = prefix({
  'webkitAnimationName': {
    s: 'webkitAnimationStart',
    e: 'webkitAnimationEnd',
    i: 'webkitAnimationIteration'
  },
  'MozAnimationName': {
    s: 'animationstart',
    e: 'animationend',
    i: 'animationiteration'
  },
  'OAnimationName': {
    s: 'oAnimationStart',
    e: 'oAnimationEnd',
    i: 'oAnimationIteration'
  },
  'msAnimationName': {
    s: 'MSAnimationStart',
    e: 'MSAnimationEnd',
    i: 'MSAnimationIteration'
  },
  'animationName': {
    s: 'animationstart',
    e: 'animationend',
    i: 'animationiteration'
  }
});

var eventTypes = {
  transitionend: prefix({
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
  }),
  animationstart: animation.s,
  animationend: animation.e,
  animationiteration: animation.i
};

function prefix(names) {
  for (var name in names) {
    if (undefined !== _style[name]) {
      return names[name];
    }
  }

  return {};
}

function getEventType(type) {
  var eventType = eventTypes[type];

  if (!eventType) {
    throw new Error('unknown type: ' + type);
  }

  return eventType;
}

function CSSAnimationEmitter(el) {
  if (!(this instanceof CSSAnimationEmitter)) {
    return new CSSAnimationEmitter(el);
  }

  this._el = el;
  this._listeners = [];
}

var p = CSSAnimationEmitter.prototype;

p.on = function(type, handler, capture) {
  capture = capture || false;
  type = getEventType(type);

  this._listeners.push({
    type: type,
    handler: handler,
    capture: capture
  });

  this._el.addEventListener(type, handler, capture);
};

p.once = function(type, handler, capture) {
  var self = this;

  function callback() {
    handler.apply(undefined, arguments);
    self.off(type, callback, capture);
  }

  self.on(type, callback, capture);
};

p.off = function(type, handler, capture) {
  var numArgs = arguments.length;

  if (0 === numArgs) {
    return this.removeAllListeners();
  }

  type = getEventType(type);

  var listeners = this._listeners;
  var el = this._el;
  var i = listeners.length;
  var params, sameType, sameHandler, sameCapture;

  while (i--) {
    params = listeners[i];
    sameType = params.type === type;
    sameHandler = params.handler === handler;
    sameCapture = params.capture === (capture || false);

    if ((1 === numArgs && sameType) || (2 === numArgs && sameType && sameHandler) || (sameType && sameHandler && sameCapture)) {
      el.removeEventListener(type, handler, capture);
      listeners.splice(i, 1);
    }
  }
};

p.removeAllListeners = function() {
  var listeners = this._listeners;
  var el = this._el;
  var i = listeners.length;
  var params;

  while (i--) {
    params = listeners.pop();
    el.removeEventListener(params.type, params.handler, params.capture);
  }
};
