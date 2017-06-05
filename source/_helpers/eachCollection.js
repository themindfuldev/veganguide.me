function isFunction(value) {
  return typeof value === 'function';
}

const isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};

function extend(obj/* , ...source */) {
  for (let i = 1; i < arguments.length; i++) {
    for (let key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

function createFrame(object) {
  let frame = extend({}, object);
  frame._parent = object;
  return frame;
}

module.exports = function eachCollection(context, metadata, options) {
  if (!options) {
    throw new Exception('Must pass iterator to #each');
  }

  let fn = options.fn,
    inverse = options.inverse,
    i = 0,
    ret = '',
    data;

  let collections = context.filter(collection => {
    return collection !== 'articles';
  });
  context = metadata[collections[0]];

  if (isFunction(context)) { context = context.call(this); }

  if (options.data) {
    data = createFrame(options.data);
  }

  function execIteration(field, index, last) {
    if (data) {
      data.key = field;
      data.index = index;
      data.first = index === 0;
      data.last = !!last;
    }

    ret = ret + fn(context[field], {
      data: data,
      blockParams: [context[field], field]
    });
  }

  if (context && typeof context === 'object') {
    if (isArray(context)) {
      for (let j = context.length; i < j; i++) {
        if (i in context) {
          execIteration(i, i, i === context.length - 1);
        }
      }
    } else {
      let priorKey;

      for (let key in context) {
        if (context.hasOwnProperty(key)) {
          // We're running the iterations one step out of sync so we can detect
          // the last iteration without have to scan the object twice and create
          // an itermediate keys array.
          if (priorKey !== undefined) {
            execIteration(priorKey, i - 1);
          }
          priorKey = key;
          i++;
        }
      }
      if (priorKey !== undefined) {
        execIteration(priorKey, i - 1, true);
      }
    }
  }

  if (i === 0) {
    ret = inverse(this);
  }

  return ret;
};