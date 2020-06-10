var BS = function() {
    var Modal = new Class({

        Implements: [Options, Events],

        Binds: 'close',

        options: {
            title: '',
            content: '',
            buttons: [],
            draggable: true
        },

        initialize: function(options) {
            options = this.setOptions(options).options;
            var el = this.el = new Element('.modal')
              , head = this.header = new Element('.modal-header')
              , body = this.body = new Element('.modal-body')
              , foot = this.footer = new Element('.modal-footer')
              , close = this.closer = new Element('button.close',{
                type: 'button',
                'aria-hidden': true,
                html: '&times;'
            })
              , title = this.title = new Element('h3',{
                text: options.title
            });

            Type.isString(options.content) ? body.set('html', options.content) : body.adopt(options.content);

            head.adopt([close, title]);
            foot.adopt(options.buttons);
            el.adopt([head, body, foot]);

            close.addEvent('click', this.close);

            if (options.draggable) {
                this.makeDraggable();
            }
        },

        makeDraggable: function() {
            this.drag = new Drag(this.el,{
                handle: this.header
            });
        },

        close: function() {
            this.el.dispose();
            this.fireEvent('close');
            return this;
        },

        toElement: function() {
            return this.el;
        }

    });

    var TabSwapper = new Class({
        Implements: [Options, Events],
        options: {
            selectedClass: 'tabSelected',
            mouseoverClass: 'tabOver',
            deselectedClass: '',
            rearrangeDOM: true,
            initPanel: 0,
            smooth: false,
            smoothSize: false,
            maxSize: null,
            effectOptions: {
                duration: 500
            },
            cookieName: null,
            cookieDays: 999
        },
        tabs: [],
        sections: [],
        clickers: [],
        sectionFx: [],
        initialize: function(options) {
            var self = this;
            options = self.setOptions(options).options;
            var prev = self.setup();
            if (prev) {
                return prev;
            }
            if (options.cookieName) {
                var cookie = self.recall();
                cookie && self.show(cookie.toInt());
            } else {
                self.show(options.initPanel);
            }
        },
        setup: function() {
            var opt = this.options;
            sections = $$(opt.sections);
            tabs = $$(opt.tabs);
            if (tabs[0] && tabs[0].retrieve('tabSwapper')) {
                return tabs[0].retrieve('tabSwapper');
            }
            clickers = $$(opt.clickers);
            tabs.each(function(tab, index) {
                this.addTab(tab, sections[index], clickers[index], index);
            }, this);
        },
        addTab: function(tab, section, clicker, index) {
            var self = this;
            tab = $(tab);
            clicker = $(clicker);
            section = $(section);
            //if the tab is already in the interface, just move it
            if (self.tabs.indexOf(tab) >= 0 && tab.retrieve('tabbered') && self.tabs.indexOf(tab) != index && self.options.rearrangeDOM) {
                self.moveTab(self.tabs.indexOf(tab), index);
                return self;
            }
            //if the index isn't specified, put the tab at the end
            if (typeOf(index) === 'null') {
                index = self.tabs.length;
            }
            //if self isn't the first item, and there's a tab
            //already in the interface at the index 1 less than self
            //insert self after that one
            if (index > 0 && self.tabs[index - 1] && self.options.rearrangeDOM) {
                tab.inject(self.tabs[index - 1], 'after');
                section.inject(self.tabs[index - 1].retrieve('section'), 'after');
            }
            self.tabs.splice(index, 0, tab);
            clicker = clicker || tab;

            tab.addEvents({
                mouseout: function() {
                    tab.removeClass(self.options.mouseoverClass);
                },
                mouseover: function() {
                    tab.addClass(self.options.mouseoverClass);
                }
            });

            clicker.addEvent('click', function(e) {
                e.preventDefault();
                self.show(index);
            });

            tab.store('tabbered', true);
            tab.store('section', section);
            tab.store('clicker', clicker);
            self.hideSection(index);
            return self;
        },
        removeTab: function(index) {
            var now = this.tabs[this.now];
            if (this.now == index) {
                if (index > 0)
                    this.show(index - 1);
                else if (index < this.tabs.length)
                    this.show(index + 1);
            }
            this.now = this.tabs.indexOf(now);
            return this;
        },
        moveTab: function(from, to) {
            var tab = this.tabs[from];
            var clicker = tab.retrieve('clicker');
            var section = tab.retrieve('section');

            var toTab = this.tabs[to];
            var toClicker = toTab.retrieve('clicker');
            var toSection = toTab.retrieve('section');

            this.tabs.erase(tab).splice(to, 0, tab);

            tab.inject(toTab, 'before');
            clicker.inject(toClicker, 'before');
            section.inject(toSection, 'before');
            return this;
        },
        show: function(i) {
            if (typeOf(this.now) === 'null') {
                this.tabs.each(function(tab, idx) {
                    if (i != idx)
                        this.hideSection(idx);
                }, this);
            }
            this.showSection(i).save(i);
            return this;
        },
        save: function(index) {
            if (this.options.cookieName)
                Cookie.write(this.options.cookieName, index, {
                    duration: this.options.cookieDays
                });
            return this;
        },
        recall: function() {
            return this.options.cookieName && Cookie.read(this.options.cookieName) || false;
        },
        hideSection: function(idx) {
            var tab = this.tabs[idx];
            if (!tab)
                return this;
            var sect = tab.retrieve('section');
            if (!sect)
                return this;
            if (sect.getStyle('display') != 'none') {
                this.lastHeight = sect.getSize().y;
                sect.setStyle('display', 'none');
                tab.swapClass(this.options.selectedClass, this.options.deselectedClass);
                this.fireEvent('background', [idx, sect, tab]);
            }
            return this;
        },
        showSection: function(idx) {
            var tab = this.tabs[idx];
            if (!tab)
                return this;
            var sect = tab.retrieve('section');
            if (!sect)
                return this;
            var smoothOk = this.options.smooth && !Browser.Engine.trident4;
            if (this.now != idx) {
                if (!tab.retrieve('tabFx')) {
                    tab.store('tabFx', new Fx.Morph(sect,this.options.effectOptions));
                }
                var overflow = sect.getStyle('overflow');
                var start = {
                    display: 'block',
                    overflow: 'hidden'
                };
                if (smoothOk) {
                    start.opacity = 0;
                }
                var effect = false;
                if (smoothOk) {
                    effect = {
                        opacity: 1
                    };
                } else if (sect.getStyle('opacity').toInt() < 1) {
                    sect.setStyle('opacity', 1);
                    if (!this.options.smoothSize) {
                        this.fireEvent('activeAfterFx', [idx, sect, tab]);
                    }
                }
                if (this.options.smoothSize) {
                    var size = sect.getDimensions().height;
                    if (typeOf(this.options.maxSize) !== 'null' && this.options.maxSize < size) {
                        size = this.options.maxSize;
                    }
                    if (!effect) {
                        effect = {};
                    }
                    effect.height = size;
                }
                if (typeOf(this.now) !== 'null') {
                    this.hideSection(this.now);
                }
                if (this.options.smoothSize && this.lastHeight) {
                    start.height = this.lastHeight;
                }
                sect.setStyles(start);
                if (effect) {
                    tab.retrieve('tabFx').start(effect).chain(function() {
                        this.fireEvent('activeAfterFx', [idx, sect, tab]);
                        sect.setStyles({
                            height: this.options.maxSize == effect.height ? this.options.maxSize : "auto",
                            overflow: overflow
                        });
                        sect.getElements('input, textarea').setStyle('opacity', 1);
                    }
                    .bind(this));
                }
                this.now = idx;
                this.fireEvent('active', [idx, sect, tab]);
            }
            tab.removeClass(this.options.deselectedClass).addClass(this.options.selectedClass);
            return this;
        }
    });

    var toggle = '[data-toggle=dropdown]'
      , Dropdown = new Class({

        Binds: ['toggle', 'close'],
        attached: false,

        initialize: function(element) {
            this.element = $(element);
        },

        attach: function() {
            if (!this.attached) {
                this.attached = true;
                this.element.addEvent('click', this.toggle);
                document.body.addEvent('click', this.close);
            }

            return this;
        },

        detach: function() {
            this.attached = false;
            this.element.removeEvent('click', this.toggle);
            document.body.removeEvent('click', this.close);

            return this;
        },

        toggle: function(e) {
            var el = this.element, parent, isActive;

            if (el.match('.disabled, :disabled')) {
                return this;
            }

            parent = getParent(el);

            isActive = parent.hasClass('open');

            clearMenus();

            if (!isActive) {
                parent.addClass('open');
            }

            el.focus();

            e && e.stopPropagation();
            return this;
        },

        close: function(e) {
            if (!e || !$(e.target).getParent('.dropdown')) {
                this.element.getParent().removeClass('open');
            }
            return this;
        },

        keydown: function(e) {
            var el = this.element, items, active, parent, isActive, index

            if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 27) {
                return this;
            }

            e.stop();

            if (el.match('.disabled, :disabled')) {
                return this;
            }

            parent = getParent(el);

            isActive = parent.hasClass('open');

            if (!isActive || (isActive && e.keyCode == 27)) {
                return el.fireEvent('click');
            }

            items = parent.getElements('[role=menu] li:not(.divider):visible a');

            if (!items.length) {
                return this;
            }

            index = items.indexOf(items.filter(':focus')[0]);

            if (e.keyCode === 38 && index > 0) {
                --index;
            }
            // up
            if (e.keyCode === 40 && index < items.length - 1) {
                ++index;
            }
            // down
            if (!~index) {
                index = 0
            }

            items[index].focus();

            return this;
        }
    });

    function clearMenus() {
        $$(toggle).each(function(e) {
            getParent(e).removeClass('open');
        })
    }

    function getParent(el) {
        var selector = el.getProperty('data-target'), parent;

        if (!selector) {
            selector = el.getProperty('href');
            selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '');
            //strip for ie7
        }

        parent = $$(selector);
        parent.length || (parent = el.getParent());

        return parent;
    }

    Element.Properties.dropdown = {
        get: function() {
            var dropdown;
            if (!(dropdown = this.retrieve('dropdown'))) {
                this.store('dropdown', dropdown = new Dropdown(this));
            }
            return dropdown;
        },

        set: function() {
            return this;
        }
    };

    Element.implement('makeDropdown', function() {
        this.get('dropdown').attach();

        return this;
    });

    var Collapse = new Class({

        Implements: [Options, Events],

        options: {
            toggle: true
        },

        initialize: function(el, options) {
            this.el = $(el);
            options = this.setOptions(options).options;

            options.toggle && this.toggle();
        },

        getDimension: function() {
            return this.el.hasClass('width') ? 'width' : 'height';
        },

        show: function() {
            this.el.addClass('in');
        },
        hide: function() {
            this.el.removeClass('in');
        },
        toggle: function() {
            this.el.toggleClass('in');
        }

    });

    Element.Properties.collapse = {
        get: function() {
            var collapse;
            if (!(collapse = this.retrieve('collapse'))) {
                this.store('collapse', collapse = new Collapse(this));
            }
            return collapse;
        },

        set: function() {
            return this;
        }
    };

    var Button = new Class({

        Implements: [Options, Events],

        initialize: function(e, options) {
            this.setOptions(options);
            this.el = $(e);
        },

        toggle: function() {
            var parent = this.el.getParent('[data-toggle="buttons-radio"]')

            parent = parent && parent.getElement('.active');
            parent && parent.removeClass('active');

            this.el.toggleClass('active')
        }

    });

    Element.Properties.button = {
        get: function() {
            var but;
            if (!(but = this.retrieve('button'))) {
                this.store('button', but = new Button(this));
            }
            return but;
        }
    };

    var didModal = false;
    var automagic = {
        modal: function() {
            if (didModal)
                return;
            document.addEvent('click:relay([data-toggle=modal])', function(e) {
                var el = $(e.target)
                  , href = el.getProperty('href')
                  , target = el.getProperty('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''));
                e.preventDefault();
            });
        },
        dropdown: function() {
            $$(toggle).each(function(el) {
                el.makeDropdown();
            });
        },
        tabs: function() {
            $$('.tab-content').each(function(el) {
                if (el.retrieve('_bs_tabs'))
                    return;
                var sects = el.getElements('.tab-pane')
                  , bar = el.getProperty('data-bar')
                  , tabs = new TabSwapper({
                    selectedClass: 'active',
                    mouseoverClass: '',
                    tabs: (bar = bar ? $(bar) : el.getPrevious('.nav-tabs')).getElements('li'),
                    sections: sects,
                    smooth: true
                });
                if (location.hash) {
                    var select = sects.filter(location.hash)[0];
                    select && tabs.show(sects.indexOf(select));
                }
                el.store('_bs_tabs', true);
            });
        },
        collapse: function() {
            window.addEvent('click:relay([data-toggle=collapse])', function(e) {
                var el = $(e.target)
                  , target = $$(el.getProperty('data-target') || e.preventDefault() || (href = this.getProperty('href')) && href.replace(/.*(?=#[^\s]+$)/, ''));
                el[(el.hasClass('in') ? 'add' : 'remove') + 'Class']('collapsed');
                target && target[0].get('collapse').toggle();
            });
        },

        buttonsRadio: function() {
            window.addEvent('click:relay([data-toggle^=button])', function(e) {
                var btn = $(e.target);
                if (!btn.hasClass('btn'))
                    btn = btn.getParent('.btn');
                e.preventDefault();
                btn.get('button').toggle();
            });
        }
    };

    function allMagic() {
        Object.each(automagic, function(fn) {
            fn()
        })
    }
    ;
    return {
        Modal: Modal,
        Tabs: TabSwapper,
        Dropdown: Dropdown,
        init: allMagic,
        automagic: allMagic
    };

}();