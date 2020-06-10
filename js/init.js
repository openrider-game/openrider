define('init', function() {

    Class.implement('alias', function(name, existing) {
        this.implement(name, this.prototype[existing]);
    }
    .overloadSetter()).extend('alias', function(obj, name, existing) {
        Class.prototype.alias.call(obj, name, existing);
    });

    Function.extend('echo', function(a) {
        return a;
    });

    var alias = {
        on: 'addEvent',
        off: 'removeEvent',
        emit: 'fireEvent'
    };
    Class.alias(Events, alias);
    [Window, Document, Element].invoke('alias', alias);

    function objectifier(splits, create, context) {
        var result = context || window, parent, got;
        for (var i = 0, s; result && (s = splits[i]); i++) {
            got = result.get && result.get(s);
            result = got !== undefined ? got : (s in result ? result[s] : (create ? result[s] = {} : undefined));
            if (Type.isFunction(result) && parent) {
                result = result.call(parent);
            }
            parent = result;
        }
        return result;
    }
    ;Object.extend({
        // Creates an object if it doesn't already exist
        set: function Object$set(context, name, value) {
            if (arguments.length < 3 && Type.isString(context)) {
                value = name,
                name = context,
                context = window;
            }
            var splits = name.split(".")
              , s = splits.pop()
              , result = objectifier(splits, true, context);
            return result && s ? (result.set && result.set(s, value) || (result[s] = value)) : undefined;
        },

        // Retrieves an object if not already present
        get: function Object$get(context, name, create) {
            if (arguments.length < 3 && Type.isString(context)) {
                create = name,
                name = context,
                context = window;
            }
            return objectifier(name.split('.'), create, context);
        },

        // Checks to see if the object exists
        exists: function Object$exists(context, name) {
            if (!name) {
                name = context,
                context = window;
            }
            return Object.get(context, name, false) !== undefined;
        }
    });

    var menu = $('menu')
      , content = $('content');

    var _Object = new Class(/** @lends {_Object.prototype} */
    {
        Implements: Events,

        Binds: ['get', 'set'],

        data: {},
        $force: false,

        initialize: function _Object$initialize() {
            if (this.props) {
                this.set(this.props);
            }
            Array.each(arguments, function(props) {
                this.set(props);
            }, this);
        },

        get: function _Object$get(key) {
            var val = Object.get(this.data, key);
            val = Type.isFunction(val) ? val.call(this) : val;
            if (val === null && Type.isFunction(this.$default)) {
                return this.$default(key);
            }
            if (this.$getter) {
                val = this.$getter(key, val);
            }
            return val;
        },
        set: function _Object$set(key, value) {
            if (this.$force || Object.get(this.data, key) !== value) {
                Object.set(this.data, key, value);
                this.emit('set' + key.camelCase().capitalize(), value);
                this.emit('set', key.camelCase(), value);
            }
        }
        .overloadSetter(),
        observe: function _Object$observe(key, fn) {
            return this.on('set' + key.camelCase().capitalize(), fn);
        },
        refresh: function _Object$refresh(key) {
            this.$force = true;
            this.set(key, this.get(key));
            this.$force = false;
            return this;
        },

        each: function _Object$each(fn, bind) {
            var self = this;
            Object.each(self.data, function(val, k, data) {
                fn.call(self, val, k, self);
            });
            return self;
        },
        map: function _Object$map(fn, bind) {
            var self = this;
            return new _Object(Object.map(self.data, function(val, k, data) {
                fn.call(self, val, k, self);
            }));
        },

        mixin: function _Object$mixin(obj) {
            return Object.merge(this, obj);
        },
        merge: function _Object$merge(obj) {
            return this.set(obj);
        },

        getKeys: function _Object$getKeys() {
            return Object.keys(this.data)
        },
        getValues: function _Object$getValues() {
            return this.getKeys().map(this.get);
        },

        process: function _Object$process(type, fn) {
            if (type === 'get') {
                this.$getter = fn;
            } else if (type === 'set') {
                this.$setter = fn;
            }
            return this;
        },
        setter: function _Object$setter(fn) {
            this.$setter = fn;
            return this;
        },
        getter: function _Object$getter(fn) {
            this.$getter = fn;
            return this;
        },

        toJSON: function() {
            return this.getValues().associate(this.getKeys());
        }
    });

    var _Array = new Class(/** @lends {_Array.prototype} */
    {
        Implements: Events,
        data: [],

        initialize: function() {
            this.append(arguments.length === 1 && Type.isArray(arguments[0]) ? arguments[1] : arguments);
        },

        get: function(key) {
            if (!Type.isNumber(key)) {
                if (Type.isString(key)) {
                    return this.map(function(el) {
                        return Object.get(el, key);
                    });
                }
                throw new TypeError();
            }
            if (key > this.data.length - 1) {
                throw new RangeError();
            }
            while (key < 0) {
                key += this.data.length;
            }
            var val = this.data[key];
            val = Type.isFunction(val) ? val.call(this) : val;
            if (this.$getter) {
                val = this.$getter(key, val);
            }
            return val;
        },
        set: function(key, value) {
            if (!Type.isNumber(key)) {
                throw new Error('Index is not a number');
            }
            if (key > this.data.length) {
                throw new Error('Index out of range');
            }
            while (key < 0) {
                key += this.data.length;
            }
            if (this.data[key] !== value) {
                this.data[key] = value;
                this.emit('change', [key, value]);
            }
        },
        //.overloadSetter(),
        observe: function(fn) {
            return this.on('change', fn);
        },

        join: function(sep) {
            return Array.join(this.data, sep || '');
        },
        push: function() {
            var self = this
              , i = self.getLength();
            Array.each(arguments, function(arg) {
                self.set(i++, arg);
            });
            return self;
        },

        each: function(fn, bind) {
            var self = this;
            Array.each(self.data, function(val, k, data) {
                fn.call(self, val, k, self);
            });
            return self;
        },
        map: function(fn, bind) {
            var self = this;
            return new _Array(Array.map(self.data, function(val, k, data) {
                return fn.call(self, val, k, self);
            }));
        },
        invoke: function(fn) {
            var args = Array.slice(arguments, 1)
              , self = this;
            return self.map(function(val) {
                return val[fn].apply(val, args);
            });
        },

        append: function(arr) {
            this.push.apply(this, arr);
            return this;
        },
        merge: function(obj) {
            return this.set(obj);
        },

        getKeys: function() {
            return Object.keys(this.data)
        },
        getValues: function() {
            return this.get(this.getKeys())
        },
        getLength: function() {
            return this.data.length
        },

        process: function(type, fn) {
            if (type === 'get') {
                this.$getter = fn;
            } else if (type === 'set') {
                this.$setter = fn;
            }
            return this;
        }
    });

    var oldBH = window.BH || {}
      , $ID$ = 0;

    window.BH = new _Object(oldBH).mixin(oldBH).mixin({

        ID: function(obj) {
            if (!obj.$ID$) {
                Object.defineProperty(obj, '$ID$', {
                    value: ++$ID$,
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
            }
            return obj.$ID$;
        },

        log: function() {},

        obtain: function(key) {
            return function(obj) {
                return obj[key];
            }
            ;
        },

        toggleHash: function(hash) {
            var hashes = location.hash.substr(1).split(',').filter(Function.echo);
            if (hashes.contains(hash)) {
                hashes.erase(hash);
            } else {
                hashes.push(hash);
            }
            location.hash = hashes.join(',') || 'qq';
        }

    });

    BH.User = new Class({
        Extends: _Object,
        setOption: function(opt, value) {
            this.set('option.' + opt, value);
            new Request.JSON({
                url: '/call/set-option',
                data: {
                    args: [opt, value]
                }
            }).send();
        }
    });

    BH.Track = new Class({
        Extends: _Object
    });

    BH.Object = _Object;
    BH.Array = _Array;

    if (window.bhuser_) {
        BH.set('user', new BH.User(window.bhuser_));
        window.bhuser_ = null;
    }

    BH.Favorite = new Class({});

    BH.set('favorites', BH.favorites = new _Array());
    BH.favorites.observe(function(key, value) {
        new Request.JSON({
            url: '/tracks/fave/' + value,
            onSuccess: function(res) {
                if (Type.isNumber(res)) {
                    var th = $$('.track-thumb[data-tid=' + value + ']');
                    if (th) {
                        th[0].clone().getChildren().inject(new Element('.track-thumb.span3').inject('faves'));
                    }
                }
            }
        }).send();
    });

    window.on('resize', function() {
        var s = getSize();
        BH.set('size', s);
    });

    return BH;

});