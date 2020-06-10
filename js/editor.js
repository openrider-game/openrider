!function e(t, n, a) {
    function o(i, s) {
        if (!n[i]) {
            if (!t[i]) {
                var l = "function" == typeof require && require;
                if (!s && l)
                    return l(i, !0);
                if (r)
                    return r(i, !0);
                var c = new Error("Cannot find module '" + i + "'");
                throw c.code = "MODULE_NOT_FOUND",
                c
            }
            var u = n[i] = {
                exports: {}
            };
            t[i][0].call(u.exports, function(e) {
                var n = t[i][1][e];
                return o(n ? n : e)
            }, u, u.exports, e, t, n, a)
        }
        return n[i].exports
    }
    for (var r = "function" == typeof require && require, i = 0; i < a.length; i++)
        o(a[i]);
    return o
}({
    1: [function(e, t) {
        var n = (GameSettings,
        e("react"));
        n.initializeTouchEvents(!0);
        var a = e("./components/loading/loading")
          , o = e("./components/leftmenu/leftmenu")
          , r = e("./components/rightmenu/rightmenu")
          , i = e("./components/topmenu/topmenu")
          , s = e("./components/bottommenu/bottommenu")
          , l = e("./components/dialogs/dialogs")
          , c = (e("./components/focusoverlay/focusoverlay"),
        e("./components/chromeapp/header"))
          , u = n.createClass({
            displayName: "EditorGui",
            render: function() {
                var e = "";
                return e = this.state.preloading ? n.createElement(a, {
                    percent: this.state.loadingPercent,
                    itemName: this.state.loadingItem
                }) : n.createElement("div", {
                    className: "editorGui"
                }, this.showHeader(), n.createElement(i, {
                    data: this.state
                }), n.createElement(o, {
                    data: this.state
                }), n.createElement(r, {
                    data: this.state
                }), n.createElement(s, {
                    data: this.state
                }), n.createElement(l, {
                    data: this.state
                }), this.showFocusOverlay())
            },
            showHeader: function() {
                var e = !1;
                return GameSettings.isStandalone && (e = n.createElement(c, null)),
                e
            },
            showFocusOverlay: function() {
                var e = !1;
                return e
            },
            getInitialState: function() {
                return {
                    preloading: !0,
                    loadingPercent: 0,
                    loadingText: "Loading game, please wait...",
                    inFocus: !0
                }
            },
            componentDidMount: function() {
                this.bindToGame()
            },
            componentWillUnmount: function() {
                GameManager.removeListener("stateChange", this.handleGameStateChange)
            },
            handleGameStateChange: function(e) {
                this.setState(e)
            },
            componentWillUpdate: function() {},
            bindToGame: function() {
                GameManager.on("stateChange", this.handleGameStateChange)
            }
        });
        window.React = n,
        window.EditorGui = n.createElement(u, null),
        t.exports = u
    }
    , {
        "./components/bottommenu/bottommenu": 2,
        "./components/chromeapp/header": 14,
        "./components/dialogs/dialogs": 20,
        "./components/focusoverlay/focusoverlay": 26,
        "./components/leftmenu/leftmenu": 27,
        "./components/loading/loading": 28,
        "./components/rightmenu/rightmenu": 33,
        "./components/topmenu/topmenu": 69,
        react: "react"
    }],
    2: [function(e, t) {
        var n = e("react")
          , a = e("./vehicle")
          , o = e("./grid")
          , r = e("./cameralock")
          , i = e("./brushbottomtooloptions")
          , s = e("./eraserbottomtooloptions")
          , l = e("./camerabottomtooloptions")
          , c = e("./straightlinebottomtooloptions")
          , u = e("./curvedlinebottomtooloptions")
          , p = e("./powerupbottomtooloptions")
          , d = e("../chromeapp/bottommenu")
          , m = e("./vehiclepowerupbottomtooloptions")
          , h = n.createClass({
            displayName: "BottomMenu",
            render: function() {
                var e = this.props.data.tool
                  , t = this.props.data.toolOptions
                  , h = "";
                switch (e) {
                case "straightline":
                    h = n.createElement(c, {
                        options: t
                    });
                    break;
                case "curve":
                    h = n.createElement(u, {
                        options: t
                    });
                    break;
                case "brush":
                    h = n.createElement(i, {
                        options: t
                    });
                    break;
                case "eraser":
                    h = n.createElement(s, {
                        options: t
                    });
                    break;
                case "powerup":
                    h = n.createElement(p, {
                        options: t
                    });
                    break;
                case "vehiclepowerup":
                    h = n.createElement(m, {
                        options: t
                    });
                    break;
                case "select":
                    break;
                case "camera":
                    h = n.createElement(l, {
                        options: t
                    })
                }
                var f = !1;
                return GameSettings.isStandalone && (f = n.createElement(d, null)),
                n.createElement("div", {
                    className: "bottomMenu unselectable"
                }, n.createElement("div", {
                    className: "clearfix"
                }, h, n.createElement(r, {
                    active: this.props.data.cameraLocked
                }), n.createElement(o, {
                    active: this.props.data.grid
                }), n.createElement(a, {
                    vehicle: this.props.data.vehicle
                }), n.createElement("span", {
                    className: "divider"
                })), f)
            }
        });
        t.exports = h
    }
    , {
        "../chromeapp/bottommenu": 13,
        "./brushbottomtooloptions": 3,
        "./camerabottomtooloptions": 4,
        "./cameralock": 5,
        "./curvedlinebottomtooloptions": 6,
        "./eraserbottomtooloptions": 7,
        "./grid": 8,
        "./powerupbottomtooloptions": 9,
        "./straightlinebottomtooloptions": 10,
        "./vehicle": 11,
        "./vehiclepowerupbottomtooloptions": 12,
        react: "react"
    }],
    3: [function(e, t) {
        var n = e("react")
          , a = e("react-slider")
          , o = n.createClass({
            displayName: "BrushBottomToolOptions",
            adjustTrailSpeed: function(e) {
                "undefined" != typeof GameManager && GameManager.command("change tool option", "trailSpeed", e)
            },
            adjustBreakLength: function(e) {
                "undefined" != typeof GameManager && GameManager.command("change tool option", "breakLength", e)
            },
            render: function() {
                var e = this.props.options
                  , t = 0
                  , o = 0
                  , r = 100
                  , i = 1
                  , s = 0
                  , l = 0
                  , c = 100
                  , u = 1
                  , p = 0;
                return e && (t = e.trailSpeed,
                o = e.minTrailSpeed,
                r = e.maxTrailSpeed,
                i = e.trailSpeedSensitivity,
                s = e.breakLength,
                l = e.minBreakLength,
                c = e.maxBreakLength,
                u = e.breakLengthSensitivity),
                n.createElement("div", {
                    className: "bottomToolOptions bottomToolOptions_brush"
                }, n.createElement("div", {
                    className: "bottomToolOptions-toolTitle"
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_brush"
                }), n.createElement("span", {
                    className: "toolName"
                }, "BRUSH : ", n.createElement("span", {
                    className: "bottomMenu-bold"
                }, e.lineType))), n.createElement("div", {
                    className: "horizontal-slider-container"
                }, n.createElement("span", {
                    className: "horizontal-slider-label"
                }, "Brush Length"), n.createElement(a, {
                    withBars: !0,
                    className: "horizontal-slider brush-slider_breaklength",
                    onChanged: this.adjustBreakLength,
                    defaultValue: p,
                    max: c,
                    min: l,
                    step: u,
                    value: s
                })), n.createElement("div", {
                    className: "horizontal-slider-container"
                }, n.createElement("span", {
                    className: "horizontal-slider-label"
                }, "Trail Speed"), n.createElement(a, {
                    withBars: !0,
                    className: "horizontal-slider brush-slider_trailspeed",
                    onChanged: this.adjustTrailSpeed,
                    defaultValue: p,
                    max: r,
                    min: o,
                    step: i,
                    value: t
                })))
            }
        });
        t.exports = o
    }
    , {
        react: "react",
        "react-slider": 74
    }],
    4: [function(e, t) {
        var n = e("react")
          , a = (e("react-slider"),
        n.createClass({
            displayName: "CameraBottomToolOptions",
            changeZoom: function() {},
            render: function() {
                return n.createElement("div", {
                    className: "bottomToolOptions bottomToolOptions_camera"
                }, n.createElement("div", {
                    className: "bottomToolOptions-toolTitle"
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_camera"
                }), n.createElement("span", {
                    className: "toolName"
                }, "Camera")))
            }
        }));
        t.exports = a
    }
    , {
        react: "react",
        "react-slider": 74
    }],
    5: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "CameraLock",
            setCameraLock: function() {
                "undefined" != typeof GameManager && GameManager.command("lock camera")
            },
            render: function() {
                var e = "bottomMenu-button bottomMenu-button-right bottomMenu-button_cameralock"
                  , t = "editorgui_icons editorgui_icons-icon_camera_lock_off icon";
                this.props.active && (t = "editorgui_icons editorgui_icons-icon_camera_lock_on icon");
                var a = this.props.active ? "on" : "off";
                return n.createElement("div", {
                    className: e,
                    onClick: this.setCameraLock
                }, n.createElement("span", {
                    className: t
                }), n.createElement("span", {
                    className: "name"
                }, "Camera Lock : ", a))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    6: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "CurvedLineBottomToolOptions",
            render: function() {
                var e = this.props.options;
                return n.createElement("div", {
                    className: "bottomToolOptions bottomToolOptions_curvedline"
                }, n.createElement("div", {
                    className: "bottomToolOptions-toolTitle"
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_curve"
                }), n.createElement("span", {
                    className: "toolName"
                }, "Curved Line : ", n.createElement("span", {
                    className: "bottomMenu-bold"
                }, e.lineType))))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    7: [function(e, t) {
        var n = e("react")
          , a = e("react-slider")
          , o = n.createClass({
            displayName: "EraserBottomToolOptions",
            adjustEraserSize: function(e) {
                "undefined" != typeof GameManager && GameManager.command("change tool option", "radius", e)
            },
            render: function() {
                var e = this.props.options
                  , t = 0
                  , o = 100
                  , r = 0
                  , i = 1
                  , s = 0;
                return e && (t = e.radius,
                o = e.maxRadius,
                r = e.minRadius,
                i = e.radiusSizeSensitivity),
                n.createElement("div", {
                    className: "bottomToolOptions bottomToolOptions_eraser"
                }, n.createElement("div", {
                    className: "bottomToolOptions-toolTitle"
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_eraser"
                }), n.createElement("span", {
                    className: "toolName"
                }, "ERASER")), n.createElement("div", {
                    className: "horizontal-slider-container"
                }, n.createElement("span", {
                    className: "horizontal-slider-label"
                }, "Radius"), n.createElement(a, {
                    withBars: !0,
                    className: "horizontal-slider eraser-slider_radius",
                    onChange: this.adjustEraserSize,
                    defaultValue: s,
                    max: o,
                    min: r,
                    step: i,
                    value: t
                })))
            }
        });
        t.exports = o
    }
    , {
        react: "react",
        "react-slider": 74
    }],
    8: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "Grid",
            setGrid: function(e) {
                console.log(e),
                "undefined" != typeof GameManager && GameManager.command("grid")
            },
            changeGridSize: function(e) {
                var t = e.target.value;
                return GameSettings.toolHandler.gridSize = t,
                GameManager.command("redraw"),
                e.preventDefault(),
                e.stopPropagation(),
                !1
            },
            stopClickPropagation: function(e) {
                return e.preventDefault(),
                e.stopPropagation(),
                !1
            },
            renderGridSizeSelect: function() {
                var e = GameSettings.toolHandler.gridSize
                  , t = [2, 5, 10, 15, 20, 25, 50, 100];
                return n.createElement("select", {
                    ref: "gridSize",
                    defaultValue: e,
                    onChange: this.changeGridSize,
                    onClick: this.stopClickPropagation
                }, t.map(function(e) {
                    return n.createElement("option", {
                        value: e
                    }, e)
                }))
            },
            render: function() {
                var e = "bottomMenu-button bottomMenu-button-right bottomMenu-button_grid "
                  , t = "editorgui_icons editorgui_icons-icon_grid_off"
                  , a = this.props.active;
                a && (e += " bottomMenu-button-active",
                t = "editorgui_icons editorgui_icons-icon_grid_on");
                var o = a ? "" : "off";
                return n.createElement("div", {
                    className: e,
                    onClick: this.setGrid
                }, n.createElement("span", {
                    className: t
                }), n.createElement("span", {
                    className: "name"
                }, "Grid : ", o), a ? this.renderGridSizeSelect() : !1)
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    9: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "PowerupBottomToolOptions",
            render: function() {
                var e = this.props.options;
                return n.createElement("div", {
                    className: "bottomToolOptions bottomToolOptions_powerup"
                }, n.createElement("div", {
                    className: "bottomToolOptions-toolTitle"
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_powerups"
                }), n.createElement("span", {
                    className: "toolName"
                }, "Powerup : ", n.createElement("span", {
                    className: "bottomMenu-bold"
                }, e.selected))))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    10: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "StraightLineBottomToolOptions",
            render: function() {
                var e = this.props.options;
                return n.createElement("div", {
                    className: "bottomToolOptions bottomToolOptions_straightline"
                }, n.createElement("div", {
                    className: "bottomToolOptions-toolTitle"
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_line"
                }), n.createElement("span", {
                    className: "toolName"
                }, "Straight Line : ", n.createElement("span", {
                    className: "bottomMenu-bold"
                }, e.lineType))))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    11: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "Vehicle",
            toggleVehicle: function() {
                "undefined" != typeof GameManager && GameManager.command("toggle vehicle")
            },
            render: function() {
                var e = "bottomMenu-button bottomMenu-button-right bottomMenu-button_vehicle "
                  , t = "editorgui_icons editorgui_icons-icon_mtb"
                  , a = "MTB";
                return this.props.vehicle && (a = this.props.vehicle.toLowerCase(),
                t = "editorgui_icons editorgui_icons-icon_" + a),
                n.createElement("div", {
                    className: e,
                    onClick: this.toggleVehicle
                }, n.createElement("span", {
                    className: t
                }), n.createElement("span", {
                    className: "name"
                }, "Vehicle : ", n.createElement("span", {
                    className: "bottomMenu-bold"
                }, a)))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    12: [function(e, t) {
        var n = e("react")
          , a = e("react-slider")
          , o = n.createClass({
            displayName: "VehiclePowerupBottomToolOptions",
            adjustTime: function(e) {
                "undefined" != typeof GameManager && GameManager.command("change tool option", "time", e)
            },
            render: function() {
                var e = this.props.options
                  , t = 10
                  , o = 1
                  , r = 0
                  , i = 1;
                return e && (r = e.time,
                t = e.maxTime,
                o = e.minTime,
                i = e.step),
                n.createElement("div", {
                    className: "bottomToolOptions bottomToolOptions_eraser"
                }, n.createElement("div", {
                    className: "bottomToolOptions-toolTitle"
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_vehicle_swap"
                }), n.createElement("span", {
                    className: "toolName"
                }, "VEHICLE POWERUP")), n.createElement("div", {
                    className: "horizontal-slider-container"
                }, n.createElement("span", {
                    className: "horizontal-slider-label"
                }, "Time"), n.createElement(a, {
                    withBars: !0,
                    className: "horizontal-slider vehicleswap-slider_radius",
                    onChange: this.adjustTime,
                    defaultValue: r,
                    max: t,
                    min: o,
                    step: i,
                    value: r
                }), n.createElement("input", {
                    type: "text",
                    className: "bottomToolOptions-input bottomToolOptions-input_vehiclepoweruptime",
                    value: r
                }), n.createElement("span", {
                    className: "horizontal-slider-label"
                }, "Seconds")))
            }
        });
        t.exports = o
    }
    , {
        react: "react",
        "react-slider": 74
    }],
    13: [function(e, t) {
        var n = e("react")
          , a = e("../../../libs/jquery")
          , o = n.createClass({
            displayName: "ChromeAppBottomMenu",
            componentDidMount: function() {
                this.initSlider()
            },
            initSlider: function() {
                var e = this.refs.content.getDOMNode()
                  , t = this.refs.sliderButtonLeft.getDOMNode()
                  , n = this.refs.sliderButtonRight.getDOMNode()
                  , o = a(e);
                o.slick({
                    dots: !1,
                    infinite: !1,
                    speed: 300,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    touchThreshold: 12,
                    nextArrow: a(n),
                    prevArrow: a(t),
                    mobileFirst: !0,
                    responsive: [{
                        breakpoint: 250,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                    }, {
                        breakpoint: 500,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1
                        }
                    }, {
                        breakpoint: 750,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 2
                        }
                    }]
                })
            },
            render: function() {
                var e = GameSettings.portal
                  , t = {
                    DOWNLOAD_MOBILE: {
                        url: "https://www.freeriderhd.com/mobile",
                        icon: "chromeapp_icons chromeapp_icons-mobile-icon",
                        text: "Get the mobile game!"
                    },
                    PLAY_WEB: {
                        url: "https://www.freeriderhd.com/",
                        icon: "chromeapp_icons chromeapp_icons-web_promo_icon",
                        text: "Play and Upload tracks at Freeriderhd.com"
                    },
                    ADD_GAME_TO_CHROME: {
                        url: "https://chrome.google.com/webstore/detail/free-rider-hd/emikpifndnjfkgofoglceekhkbaicbde",
                        icon: "chromeapp_icons chromeapp_icons-chrome_promo_icon",
                        text: "Add the full game to Chrome"
                    },
                    RATE_IN_CHROME: {
                        url: "https://chrome.google.com/webstore/detail/free-rider-hd-offline-edi/kffmoglgaljfcfaadaknkiipcclifcbn/reviews",
                        icon: "chromeapp_icons chromeapp_icons-rate_promo_icon",
                        text: "Rate in the Chrome Store"
                    },
                    SUBSCRIBE_TO_YOUTUBE: {
                        url: "https://www.youtube.com/channel/UCTrw0oc3Is2YriS3VA28Ggw/?sub_confirmation=1",
                        icon: "chromeapp_icons chromeapp_icons-youtube_promo_icon",
                        text: "Subscribe to YouTube"
                    },
                    LIKE_ON_FACEBOOK: {
                        url: "https://www.facebook.com/freeriderfans",
                        icon: "chromeapp_icons chromeapp_icons-fb_like_promo_icon",
                        text: "Like Us On Facebook"
                    },
                    FOLLOW_US_ON_TWITTER: {
                        url: "https://twitter.com/FreeRider_HD",
                        icon: "chromeapp_icons chromeapp_icons-twitter_icon",
                        text: "Follow Us On Twitter"
                    },
                    JOIN_THE_COMMUNITY: {
                        url: "https://www.youtube.com/channel/UCTrw0oc3Is2YriS3VA28Ggw/?sub_confirmation=1",
                        icon: "chromeapp_icons chromeapp_icons-community_icon",
                        text: "Join the Community"
                    },
                    PLAY_ON_FACEBOOK: {
                        url: "https://apps.facebook.com/freeriderhd/",
                        icon: "chromeapp_icons chromeapp_icons-fb_btn_icon",
                        text: "Play and Upload Tracks on Facebook"
                    }
                }
                  , a = [];
                switch (e) {
                case "kong":
                    t.PLAY_WEB.url = t.PLAY_WEB.url + "?t_1=ref&t_2=kong-editor",
                    t.DOWNLOAD_MOBILE.url = t.DOWNLOAD_MOBILE.url + "?t_1=ref&t_2=kong-editor",
                    a.push(t.DOWNLOAD_MOBILE),
                    a.push(t.PLAY_WEB),
                    a.push(t.SUBSCRIBE_TO_YOUTUBE),
                    a.push(t.LIKE_ON_FACEBOOK),
                    a.push(t.FOLLOW_US_ON_TWITTER);
                    break;
                case "web":
                    t.PLAY_WEB.url = t.PLAY_WEB.url + "?t_1=ref&t_2=web-editor",
                    t.DOWNLOAD_MOBILE.url = t.DOWNLOAD_MOBILE.url + "?t_1=ref&t_2=web-editor",
                    a.push(t.DOWNLOAD_MOBILE),
                    a.push(t.PLAY_WEB),
                    a.push(t.SUBSCRIBE_TO_YOUTUBE),
                    a.push(t.LIKE_ON_FACEBOOK),
                    a.push(t.FOLLOW_US_ON_TWITTER);
                    break;
                case "facebook":
                    t.PLAY_ON_FACEBOOK.url = t.PLAY_WEB.url + "?t_1=fb_ref&t_2=editor",
                    t.DOWNLOAD_MOBILE.url = t.DOWNLOAD_MOBILE.url + "?t_1=fb_ref&t_2=editor",
                    a.push(t.DOWNLOAD_MOBILE),
                    a.push(t.PLAY_ON_FACEBOOK),
                    a.push(t.LIKE_ON_FACEBOOK),
                    a.push(t.JOIN_THE_COMMUNITY),
                    a.push(t.SUBSCRIBE_TO_YOUTUBE),
                    a.push(t.FOLLOW_US_ON_TWITTER);
                    break;
                default:
                    t.PLAY_WEB.url = t.PLAY_WEB.url + "?t_1=cws&t_2=editor",
                    t.DOWNLOAD_MOBILE.url = t.DOWNLOAD_MOBILE.url + "?t_1=cws&t_2=editor",
                    a.push(t.DOWNLOAD_MOBILE),
                    a.push(t.PLAY_WEB),
                    a.push(t.ADD_GAME_TO_CHROME),
                    a.push(t.RATE_IN_CHROME),
                    a.push(t.SUBSCRIBE_TO_YOUTUBE),
                    a.push(t.JOIN_THE_COMMUNITY)
                }
                return n.createElement("div", {
                    className: "buttomMenuChrome"
                }, n.createElement("div", {
                    className: "sliderButton leftButton",
                    ref: "sliderButtonLeft"
                }, n.createElement("span", {
                    className: "ico_moon icon-arrow-left"
                })), n.createElement("div", {
                    ref: "content",
                    className: "content"
                }, a.map(function(e, t) {
                    return n.createElement("a", {
                        href: e.url,
                        key: t,
                        target: "_blank",
                        className: "promoCard"
                    }, n.createElement("div", {
                        className: "icon part"
                    }, n.createElement("span", {
                        className: e.icon
                    })), n.createElement("div", {
                        className: "text part"
                    }, n.createElement("span", null, e.text)))
                })), n.createElement("div", {
                    className: "sliderButton rightButton",
                    ref: "sliderButtonRight"
                }, n.createElement("span", {
                    className: "ico_moon icon-arrow-right"
                })))
            }
        });
        t.exports = o
    }
    , {
        "../../../libs/jquery": 75,
        react: "react"
    }],
    14: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "ChromeAppHeader",
            appWindow: !1,
            closeApp: function() {
                this.appWindow.close()
            },
            maximizeApp: function() {
                var e = this.appWindow;
                e.isMaximized() ? e.restore() : e.maximize()
            },
            minimizeApp: function() {
                this.appWindow.minimize()
            },
            info: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", "info")
            },
            componentDidMount: function() {
                "undefined" != typeof isChromeApp && (this.appWindow = chrome.app.window.current())
            },
            navigateToSite: function() {
                window.open("https://www.freeriderhd.com/?t_1=cws&t_2=editor")
            },
            render: function() {
                var e = "editor";
                return "undefined" != typeof isChromeApp && (e = "offline_editor"),
                n.createElement("div", {
                    id: "header"
                }, n.createElement("span", {
                    className: "chromeapp_icons chromeapp_icons-btn_info info",
                    onClick: this.info
                }), n.createElement("span", {
                    className: "chromeapp_icons chromeapp_icons-frhd_logo logo",
                    onClick: this.navigateToSite
                }), n.createElement("span", {
                    className: "chromeapp_icons chromeapp_icons-" + e
                }), this.renderWindowControls())
            },
            renderWindowControls: function() {
                var e = !1;
                return "undefined" != typeof isChromeApp && (e = n.createElement("div", {
                    className: "controls"
                }, n.createElement("span", {
                    className: "chromeapp_icons chromeapp_icons-btn_min",
                    onClick: this.minimizeApp
                }), n.createElement("span", {
                    className: "chromeapp_icons chromeapp_icons-btn_max",
                    onClick: this.maximizeApp
                }), n.createElement("span", {
                    className: "chromeapp_icons chromeapp_icons-btn_close",
                    onClick: this.closeApp
                }))),
                e
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    15: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "infodialog",
            closeDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            render: function() {
                return n.createElement("div", {
                    className: "editorDialog-content chromeinfo-dialog"
                }, n.createElement("div", {
                    className: "editorDialog-titleBar"
                }, n.createElement("span", {
                    className: "editorDialog-close",
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, "ABOUT THE OFFLINE EDITOR")), n.createElement("div", {
                    className: "middle"
                }, n.createElement("p", null, "Free Rider HD Offline Editor is dedicated solely to creating tracks for Free Rider HD the game, that does not require an internet connection and can run independently of the Free Rider HD Websites and applications."), n.createElement("h3", null, "Free Rider in Education"), n.createElement("p", null, "Free Rider has long been used in classrooms all over the world as a learning tool. Teachers have found that creating has a strong link to programming logic, develops persistence, and provides a fun environment to put basic science principles to use."), n.createElement("p", null, "If you are a teacher and have specific requests for Free Rider HD in your classroom please let us know at ", n.createElement("a", {
                    href: "mailto:education@freeriderhd.com"
                }, "education@freeriderhd.com"), " and we will do our best to accomodate your request!")))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    16: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "ChomeappUploadDialog",
            closeDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            componentWillMount: function() {},
            showExportDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", "export")
            },
            render: function() {
                var e = (this.props.options,
                !1)
                  , t = !1
                  , a = GameSettings.portal;
                return a && "kong" !== a || (e = n.createElement("a", {
                    href: "http://www.freeriderhd.com/?t_1=cws&t_2=editor",
                    target: "_blank",
                    className: "promoButton left"
                }, n.createElement("div", {
                    className: "wrap"
                }, n.createElement("span", {
                    className: "part chromeapp_icons chromeapp_icons-web_btn_icon"
                }), n.createElement("span", {
                    className: "part text"
                }, "FreeRiderHD.com"))),
                console.log("hit")),
                a && "facebook" !== a || (t = n.createElement("a", {
                    href: "https://apps.facebook.com/freeriderhd/?t_1=cws&t_2=editor",
                    target: "_blank",
                    className: "promoButton right"
                }, n.createElement("div", {
                    className: "wrap"
                }, n.createElement("span", {
                    className: "part chromeapp_icons chromeapp_icons-fb_btn_icon"
                }), n.createElement("span", {
                    className: "part text"
                }, "Facebook App")))),
                n.createElement("div", {
                    className: "editorDialog-content chromeUpload-dialog"
                }, n.createElement("div", {
                    className: "editorDialog-titleBar"
                }, n.createElement("span", {
                    className: "editorDialog-close",
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, "PUBLISH TRACK")), n.createElement("div", {
                    className: "middle"
                }, n.createElement("p", {
                    className: "blurb"
                }, "Publishing tracks is currently only available online at FreeRiderHD.com and Free Rider HD on Facebook. Export your track code and upload to the options below.     "), n.createElement("div", {
                    className: "buttons"
                }, e, t)), n.createElement("div", {
                    className: "bottom"
                }, n.createElement("p", {
                    className: "text"
                }, "Export your track code to publish online!"), n.createElement("div", {
                    className: "exportButton"
                }, n.createElement("span", {
                    className: "primary-button primary-button-blue",
                    onClick: this.showExportDialog
                }, "EXPORT TRACK CODE"))))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    17: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "HelpDialog",
            closeDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            render: function() {
                return n.createElement("div", {
                    className: "editorDialog-content editorDialog-content_changeLog"
                }, n.createElement("span", {
                    className: "editorDialog-close",
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, n.createElement("b", null, "Read Me")), n.createElement("div", {
                    className: "line"
                }, n.createElement("b", null, "Welcome to the new and improved editor!")), n.createElement("div", {
                    className: "line"
                }, "First let me say, the editor behind this dialog is in", n.createElement("b", null, " super alpha phase"), ". Meaning a lot of bugs may pop up. "), n.createElement("div", {
                    className: "box"
                }, n.createElement("div", {
                    className: "line"
                }, "The following items are still in the works:"), n.createElement("ul", null, n.createElement("li", null, "Checkpoints (currently working on them now)"), n.createElement("li", null, "Zoom to mouse"), n.createElement("li", null, "Redo & Undo"), n.createElement("li", null, "Tablet Controls"), n.createElement("li", null, "Uploading"), n.createElement("li", null, "Fullscreen"), n.createElement("li", null, "Sound"))), n.createElement("div", {
                    className: "line"
                }, "Autos created on here, may not work on current version of the game so creator beware."), n.createElement("div", {
                    className: "line"
                }, "Download Google Chrome Browser for best performance"), n.createElement("div", {
                    className: "line"
                }, "If you want to log a bug, ", n.createElement("a", {
                    href: "http://community.freeriderhd.com/threads/new-editor-release-and-bug-report.2391/",
                    target: "_blank"
                }, "visit this thread"), " in the forum"), n.createElement("div", {
                    className: "line"
                }, "Please ", n.createElement("b", null, n.createElement("a", {
                    href: "http://community.freeriderhd.com/threads/new-editor-release-and-bug-report.2391/",
                    target: "_blank"
                }, "read the first post")), " as to not log duplicate bugs"))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    18: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "ImportDialog",
            hasFileAPI: !!(window.File && window.FileList && window.FileReader),
            closeDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            clearTrack: function() {
                "undefined" != typeof GameManager && (GameManager.command("clear track"),
                this.closeDialog())
            },
            getInitialState: function() {
                return {}
            },
            render: function() {
                var e = "editorDialog-content editorDialog-content_clearDialog";
                return n.createElement("div", {
                    className: e
                }, n.createElement("div", {
                    className: "editorDialog-titleBar"
                }, n.createElement("span", {
                    className: "editorDialog-close",
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, "CLEAR TRACK")), n.createElement("div", {
                    className: "editorDialog-centerContent"
                }, "Are you sure you want to clear the track?"), n.createElement("div", {
                    className: "editorDialog-bottomBar clearfix"
                }, n.createElement("button", {
                    className: "primary-button primary-button-blue float-right margin-0-5",
                    onClick: this.clearTrack
                }, "Yes"), n.createElement("button", {
                    className: "primary-button primary-button-black float-right margin-0-5",
                    onClick: this.closeDialog
                }, "Cancel")))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    19: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "ControlsDialog",
            closeDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            render: function() {
                return n.createElement("div", {
                    className: "editorDialog-content editorDialog-content_controlsDialog"
                }, n.createElement("div", null, n.createElement("div", {
                    className: "editorDialog-titleBar"
                }, n.createElement("span", {
                    className: "editorDialog-close",
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, "VEHICLE CONTROLS")), n.createElement("div", {
                    className: "keysContainer"
                }, n.createElement("table", null, n.createElement("tr", null, n.createElement("td", null, n.createElement("span", {
                    className: "keyboard_keys keyboard_keys-accelerate_key_small"
                }), n.createElement("span", {
                    className: "keyname"
                }, "Accelerate")), n.createElement("td", null, n.createElement("span", {
                    className: "keyboard_keys keyboard_keys-left_key_small"
                }), n.createElement("span", {
                    className: "keyname"
                }, "Lean left")), n.createElement("td", null, n.createElement("span", {
                    className: "keyboard_keys keyboard_keys-change_direction_key_small"
                }), n.createElement("span", {
                    className: "keyname"
                }, "Turn Around"))), n.createElement("tr", null, n.createElement("td", null, n.createElement("span", {
                    className: "keyboard_keys keyboard_keys-brake_key_small"
                }), n.createElement("span", {
                    className: "keyname"
                }, "Brake")), n.createElement("td", null, n.createElement("span", {
                    className: "keyboard_keys keyboard_keys-right_key_small"
                }), n.createElement("span", {
                    className: "keyname"
                }, "Lean Right")), n.createElement("td", null, n.createElement("span", {
                    className: "keyboard_keys keyboard_keys-restart_key_small"
                }), n.createElement("span", {
                    className: "keyname"
                }, "Restart"))), n.createElement("tr", null, n.createElement("td", null, n.createElement("span", {
                    className: "keyboard_keys keyboard_keys-enter_key_small"
                }), n.createElement("span", {
                    className: "keyname"
                }, "Back to Checkpoint")), n.createElement("td", null, n.createElement("span", {
                    className: "keyboard_keys keyboard_keys-cancel_checkpoint_key_small"
                }), n.createElement("span", {
                    className: "keyname"
                }, "Remove Checkpoint")), n.createElement("td", null, n.createElement("span", {
                    className: "keyboard_keys keyboard_keys-pause_key_small"
                }), n.createElement("span", {
                    className: "keyname"
                }, "Pause")))))))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    20: [function(e, t) {
        var n = e("react")
          , a = e("./import")
          , o = e("./export")
          , r = e("./help")
          , i = e("./controls")
          , s = e("./changelog")
          , l = e("./upload")
          , c = e("./offline_editor_promo")
          , u = e("../chromeapp/upload")
          , p = e("../chromeapp/infodialog")
          , d = e("./clear")
          , m = n.createClass({
            displayName: "Dialogs",
            className: "editorDialog",
            closeDialog: function(e) {
                e.target.className === this.className && "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            render: function() {
                var e = this.props.data.showDialog
                  , t = this.props.data.dialogOptions
                  , m = {}
                  , h = "";
                switch (e) {
                case "import":
                    h = n.createElement(a, null);
                    break;
                case "export":
                    h = n.createElement(o, {
                        options: t
                    });
                    break;
                case "help":
                    h = n.createElement(r, null);
                    break;
                case "controls":
                    h = n.createElement(i, null);
                    break;
                case "changeLog":
                    h = n.createElement(s, null);
                    break;
                case "upload":
                    h = GameSettings.isStandalone ? n.createElement(u, {
                        options: t
                    }) : n.createElement(l, {
                        options: t
                    });
                    break;
                case "info":
                    h = n.createElement(p, null);
                    break;
                case "offline_editor":
                    h = n.createElement(c, null);
                    break;
                case "clear":
                    h = n.createElement(d, null);
                    break;
                default:
                    m = {
                        display: "none"
                    }
                }
                return n.createElement("div", {
                    className: this.className,
                    style: m,
                    onClick: this.closeDialog
                }, h)
            }
        });
        t.exports = m
    }
    , {
        "../chromeapp/infodialog": 15,
        "../chromeapp/upload": 16,
        "./changelog": 17,
        "./clear": 18,
        "./controls": 19,
        "./export": 21,
        "./help": 22,
        "./import": 23,
        "./offline_editor_promo": 24,
        "./upload": 25,
        react: "react"
    }],
    21: [function(e, t) {
        var n = e("react")
          , a = e("../utils/blob").saveAs
          , o = e("../utils/filesaver").saveAs
          , r = n.createClass({
            displayName: "ExportDialog",
            closeDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            chromeApp: !1,
            fileSaverSupport: !1,
            isFileSaverSupported: function() {
                var e = !1;
                try {
                    e = !!new a
                } catch (t) {}
                this.fileSaverSupport = e
            },
            isChromeApp: function() {
                "undefined" != typeof isChromeApp && (this.chromeApp = !0)
            },
            calculateSize: function(e) {
                return encodeURI(e).split(/%..|./).length - 1
            },
            componentWillMount: function() {
                this.isFileSaverSupported(),
                this.isChromeApp()
            },
            createSaveFile: function() {
                var e = this.refs.code.getDOMNode().value
                  , t = new a([e],{
                    type: "text/plain"
                });
                if (this.chromeApp)
                    this.chromeAppSaveAs(t);
                else {
                    var n = new Date
                      , r = n.getDate()
                      , i = n.getMonth()
                      , s = n.getFullYear()
                      , l = n.getHours()
                      , c = n.getMinutes()
                      , u = n.getSeconds()
                      , p = "frhd_track_" + r + "-" + i + "-" + s + "_" + l + "_" + c + "_" + u + ".txt";
                    o(t, p)
                }
            },
            chromeAppSaveAs: function(e) {
                try {
                    chrome.fileSystem.chooseEntry({
                        type: "saveFile"
                    }, function(t) {
                        chrome.runtime.lastError ? console.warn("User Canceled File Save") : t && t.createWriter(function(t) {
                            t.onerror = function(e) {
                                console.log(e)
                            }
                            ,
                            t.onwriteend = function() {
                                console.log("write complete")
                            }
                            ,
                            t.write(e)
                        }, this.chromeAppSaveFail)
                    })
                } catch (t) {}
            },
            chromeAppSaveFail: function() {
                console.error("There was a problem saving your file")
            },
            selectAllText: function() {
                console.log("select all text");
                var e = this.refs.code.getDOMNode();
                e.focus(),
                e.select()
            },
            render: function() {
                var e = this.props.options
                  , t = "Generating track code... this may take a minute"
                  , a = "";
                return e && e.code && (t = e.code,
                this.fileSaverSupport && (a = n.createElement("button", {
                    className: "primary-button primary-button-blue float-right",
                    onClick: this.createSaveFile
                }, "Save as File"))),
                n.createElement("div", {
                    className: "editorDialog-content editorDialog-content_exportDialog"
                }, n.createElement("div", {
                    className: "editorDialog-titleBar"
                }, n.createElement("span", {
                    className: "editorDialog-close",
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, "EXPORT TRACK")), n.createElement("div", {
                    className: "editorDialog-codeContainer"
                }, n.createElement("textarea", {
                    ref: "code",
                    className: "exportDialog-code",
                    defaultValue: "",
                    autoComplete: "false",
                    spellCheck: "false",
                    value: t,
                    onClick: this.selectAllText
                })), n.createElement("div", {
                    className: "editorDialog-bottomBar clearfix"
                }, n.createElement("button", {
                    className: "primary-button primary-button-black float-right margin-0-5",
                    onClick: this.closeDialog
                }, "Close"), a))
            }
        });
        t.exports = r
    }
    , {
        "../utils/blob": 72,
        "../utils/filesaver": 73,
        react: "react"
    }],
    22: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "HelpDialog",
            getInitialState: function() {
                return {
                    advancedSettings: !1
                }
            },
            closeDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            getKeyboardShortcuts: function() {
                return n.createElement("div", null, n.createElement("div", {
                    className: "editorDialog-titleBar"
                }, n.createElement("span", {
                    className: "editorDialog-close",
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, "KEYBOARD SHORTCUTS")), n.createElement("div", {
                    className: "hotkeys clearfix"
                }, n.createElement("div", {
                    className: "hotkeys_tools"
                }, n.createElement("div", {
                    className: "hotkeys-title"
                }, "Tools"), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "C"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Camera")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Q"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Straight Line")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "A"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Brush ")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "W"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Curve")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "E"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Eraser")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "S"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Toggle Line Type")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Alt"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Toggle Snap")), n.createElement("div", {
                    className: "hotkeys-title"
                }, "Undo"), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Ctrl"), "+", n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Z"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Undo"))), n.createElement("div", {
                    className: "hotkeys_powerups"
                }, n.createElement("div", {
                    className: "hotkeys-title"
                }, "Powerups"), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "P"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Select Powerup")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "1"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Goal")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "2"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Boost")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "3"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Gravity")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "4"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Slowmotion")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "5"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Bomb")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "6"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Checkpoint")), n.createElement("div", {
                    className: "hotkeys-title"
                }, "Redo"), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Ctrl"), "+", n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Y"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Redo"))), n.createElement("div", {
                    className: "hotkeys_more"
                }, n.createElement("div", {
                    className: "hotkeys-title"
                }, "Settings"), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Shift"), "+", n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Click"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Move Camera")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "G"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Toggle Grid")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "V"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Change Vehicle")), n.createElement("div", {
                    className: "hotkeys-title"
                }, "Eraser"), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Shift"), "+", n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Scroll"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Change Radius")), n.createElement("div", {
                    className: "hotkeys-title"
                }, "Brush"), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Shift"), "+", n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Scroll"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Brush Length")), n.createElement("div", {
                    className: "hotkey"
                }, n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Ctrl"), "+", n.createElement("span", {
                    className: "helpDialog-hotkey helpDialog-hotkey_light"
                }, "Scroll"), n.createElement("span", {
                    className: "helpDialog-hotkey-name"
                }, "Trail Speed")))), n.createElement("div", null, n.createElement("span", {
                    className: "helpDialog-advanced_settings link",
                    onClick: this.gotoAdvancedSettings
                }, "Advanced Settings")))
            },
            getAdvancedSettings: function() {
                var e = GameSettings
                  , t = e.toolHandler
                  , a = t.visibleGrid
                  , o = t.rightClickMove;
                return n.createElement("div", null, n.createElement("div", {
                    className: "editorDialog-titleBar"
                }, n.createElement("span", {
                    className: "editorDialog-close",
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, "ADVANCED SETTINGS")), n.createElement("div", {
                    className: "helpDialogAdvanced"
                }, n.createElement("table", null, n.createElement("tr", null, n.createElement("td", {
                    className: "settingTitle"
                }, n.createElement("span", {
                    className: "name"
                }, "Visible Grid")), n.createElement("td", {
                    className: "settingInput"
                }, n.createElement("input", {
                    type: "checkbox",
                    ref: "visibleGrid",
                    defaultChecked: a,
                    onChange: this.toggleVisibleGrid
                }))), n.createElement("tr", null, n.createElement("td", {
                    className: "settingTitle"
                }, n.createElement("span", {
                    className: "name"
                }, "Right Click Camera Move")), n.createElement("td", {
                    className: "settingInput"
                }, n.createElement("input", {
                    type: "checkbox",
                    ref: "rightClickMove",
                    defaultChecked: o,
                    onChange: this.toggleRightClickMove
                }))), n.createElement("tr", null, n.createElement("td", {
                    className: "settingTitle"
                }, n.createElement("span", {
                    className: "name"
                }, "Grid Size")), n.createElement("td", {
                    className: "settingInput"
                }, this.renderGridSizeSelect())))), n.createElement("div", null, n.createElement("span", {
                    className: "helpDialog-advanced_settings link",
                    onClick: this.gotoKeyboardShortcuts
                }, "Back To Keyboard Shortcuts")))
            },
            changeGridSize: function(e) {
                var t = e.target.value;
                GameSettings.toolHandler.gridSize = t,
                GameManager.command("redraw")
            },
            renderGridSizeSelect: function() {
                var e = GameSettings.toolHandler.gridSize
                  , t = [2, 5, 10, 15, 20, 25, 50, 100];
                return n.createElement("select", {
                    ref: "gridSize",
                    defaultValue: e,
                    onChange: this.changeGridSize
                }, t.map(function(e) {
                    return n.createElement("option", {
                        value: e
                    }, e)
                }))
            },
            toggleVisibleGrid: function() {
                var e = this.refs.visibleGrid.getDOMNode().checked;
                GameSettings.toolHandler.visibleGrid = e
            },
            toggleRightClickMove: function() {
                var e = this.refs.rightClickMove.getDOMNode().checked;
                GameSettings.toolHandler.rightClickMove = e
            },
            gotoAdvancedSettings: function() {
                this.setState({
                    advancedSettings: !0
                })
            },
            gotoKeyboardShortcuts: function() {
                this.setState({
                    advancedSettings: !1
                })
            },
            render: function() {
                var e = !1;
                return e = this.state.advancedSettings ? this.getAdvancedSettings() : this.getKeyboardShortcuts(),
                n.createElement("div", {
                    className: "editorDialog-content editorDialog-content_helpDialog"
                }, e)
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    23: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "ImportDialog",
            hasFileAPI: !!(window.File && window.FileList && window.FileReader),
            closeDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            getInitialState: function() {
                return {
                    isDragActive: !1
                }
            },
            importTrack: function() {
                var e = this.refs.code.getDOMNode()
                  , t = e.getAttribute("data-paste-code")
                  , n = e.value;
                t && (n = t),
                "undefined" != typeof GameManager && GameManager.command("import", n, !0)
            },
            onDragLeave: function(e) {
                var t = e.target;
                t.getAttribute("data-ignoredragleave") || (this.setState({
                    isDragActive: !1
                }),
                this.refs.dropFile.getDOMNode().style.display = "none",
                this.refs.placeholder.getDOMNode().style.display = "block")
            },
            onDragOver: function(e) {
                e.preventDefault(),
                e.dataTransfer.dropEffect = "copy",
                this.refs.dropFile.getDOMNode().style.display = "block",
                this.refs.placeholder.getDOMNode().style.display = "none",
                this.setState({
                    isDragActive: !0
                })
            },
            onDrop: function(e) {
                e.preventDefault(),
                this.setState({
                    isDragActive: !1
                });
                var t;
                e.dataTransfer ? t = e.dataTransfer.files : e.target && (t = e.target.files);
                var n = new FileReader;
                n.onload = this.fileDropComplete,
                n.onerror = this.fileDropError,
                n.readAsText(t[0])
            },
            fileDropComplete: function(e) {
                var t = e.target.result
                  , n = this.refs.code.getDOMNode();
                n.setAttribute("data-paste-code", t),
                this.importTrack()
            },
            fileDropError: function(e) {
                console.log("There was an error", e)
            },
            onPaste: function(e) {
                if (e.clipBoardData || window.clipboardData) {
                    e.preventDefault();
                    var t = !1
                      , n = "";
                    e.clipBoardData ? (t = e.clipboardData,
                    n = t.getData("text/plain")) : window.clipboardData && (n = window.clipboardData.getData("Text"));
                    var a = n.length
                      , o = n.slice(0, 5e4);
                    a > 5e4 && (o += "... track is too large to show, but will still import");
                    var r = this.refs.code.getDOMNode();
                    r.value = o,
                    r.setAttribute("data-paste-code", n)
                }
                this.onInput()
            },
            openFileDialog: function() {
                this.refs.fileInput.getDOMNode().click()
            },
            onBlurInput: function() {
                this.refs.placeholder.getDOMNode().style.opacity = 1
            },
            onFocusInput: function() {
                this.refs.placeholder.getDOMNode().style.opacity = .3
            },
            onInput: function() {
                var e = this.refs.code.getDOMNode().value
                  , t = this.refs.placeholder.getDOMNode();
                t.style.display = e.length > 0 ? "none" : "block"
            },
            render: function() {
                var e = this.state.isDragActive
                  , t = "editorDialog-content editorDialog-content_importDialog";
                e && (t += " editorDialog-content-dragActive");
                var a = "";
                this.hasFileAPI && (a = n.createElement("span", null, ",or ", n.createElement("span", {
                    className: "link",
                    onClick: this.openFileDialog
                }, "select a file")));
                var o = n.createElement("span", {
                    className: "importDialog-placeholder",
                    ref: "placeholder",
                    "data-ignoredragleave": "true"
                }, "Paste track code, drag and drop text files here ", a, " to import");
                return n.createElement("div", {
                    className: t
                }, n.createElement("div", {
                    className: "editorDialog-titleBar"
                }, n.createElement("span", {
                    className: "editorDialog-close",
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, "IMPORT TRACK")), n.createElement("div", {
                    className: "importDialog-codeContainer",
                    onDragLeave: this.onDragLeave,
                    onDragOver: this.onDragOver,
                    onDrop: this.onDrop
                }, o, n.createElement("span", {
                    className: "importDialog-dropFile",
                    ref: "dropFile",
                    "data-ignoredragleave": "true"
                }, "Drop file to import"), n.createElement("textarea", {
                    ref: "code",
                    className: "importDialog-code",
                    "data-ignoredragleave": "true",
                    autoComplete: "false",
                    spellCheck: "false",
                    onPaste: this.onPaste,
                    onChange: this.onInput,
                    onFocus: this.onFocusInput,
                    onBlur: this.onBlurInput
                }), n.createElement("input", {
                    style: {
                        display: "none"
                    },
                    type: "file",
                    ref: "fileInput",
                    accept: "text/plain",
                    onChange: this.onDrop
                })), n.createElement("div", {
                    className: "editorDialog-bottomBar clearfix"
                }, n.createElement("button", {
                    className: "primary-button primary-button-blue float-right margin-0-5",
                    onClick: this.importTrack
                }, "Import"), n.createElement("button", {
                    className: "primary-button primary-button-black float-right margin-0-5",
                    onClick: this.closeDialog
                }, "Cancel")))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    24: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "OfflineEditorPromoDialog",
            closeDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            render: function() {
                return n.createElement("div", {
                    className: "editorDialog-content offlineeditorpromo-dialog"
                }, n.createElement("div", {
                    className: "editorDialog-titleBar"
                }, n.createElement("span", {
                    className: "editorDialog-close",
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, "OFFLINE EDITOR")), n.createElement("div", {
                    className: "middle"
                }, n.createElement("p", null, "Now you can draw and save your tracks without an internet connection with the ", n.createElement("a", {
                    "data-route": "true",
                    href: "https://chrome.google.com/webstore/detail/free-rider-hd-offline-edi/kffmoglgaljfcfaadaknkiipcclifcbn?utm_source=web_editor_dialog",
                    target: "_blank"
                }, "Offline Editor for Chrome"), ". Click the button below to visit the Chrome Web Store and download the official Free Rider HD Offline Editor."), n.createElement("div", {
                    className: "promoButton"
                }, n.createElement("a", {
                    href: "https://chrome.google.com/webstore/detail/free-rider-hd-offline-edi/kffmoglgaljfcfaadaknkiipcclifcbn?utm_source=web_editor_dialog",
                    "data-route": "true",
                    target: "_blank",
                    className: "install"
                }, n.createElement("span", {
                    className: "icon editorgui_icons editorgui_icons-chrome_download_icon"
                }), n.createElement("div", {
                    className: "text"
                }, n.createElement("h3", null, "FREE RIDER HD OFFLINE EDITOR"), n.createElement("span", null, "Download from the Chrome Web Store"))))), n.createElement("div", {
                    className: "bottom"
                }, n.createElement("p", null, "Please note that the Free Rider HD Offline Editor requires the ", n.createElement("a", {
                    href: "https://www.google.com/chrome/browser/desktop/index.html",
                    "data-route": "true",
                    target: "_blank"
                }, "Chrome Web Browser"), " to be installed on your computer in order to run")))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    25: [function(e, t) {
        var n = e("react")
          , a = GameSettings
          , o = Application.Helpers.AjaxHelper
          , r = Application.Helpers.ShareHelper
          , i = Application.Helpers.GoogleAnalyticsHelper
          , s = n.createClass({
            displayName: "UploadDialog",
            getDefaultProps: function() {
                return {
                    maxTitleChars: 30,
                    minTitleChars: 3,
                    maxDescChars: 300,
                    minDescChars: 5
                }
            },
            uploadData: null,
            uploadResponseData: null,
            getInitialState: function() {
                return {
                    titleCharCountLeft: this.props.maxTitleChars,
                    descCharCountLeft: this.props.maxDescChars,
                    defaultVehicle: "MTB",
                    vehiclesAllowed: {
                        mtb: !0,
                        bmx: !0
                    },
                    uploadingEnabled: !1,
                    canClose: !0,
                    errorMsg: "",
                    showErrorMsg: !1,
                    uploading: !1,
                    uploadComplete: !1
                }
            },
            getUser: function() {
                return Application.User
            },
            onTitleChange: function() {
                var e = this.refs.trackTitle
                  , t = e.getDOMNode().value
                  , n = t.length
                  , a = this.props.maxTitleChars - n
                  , o = this.refs.titleCharCountLeft.getDOMNode();
                o.style.color = 0 >= a ? "#E5302F" : "#595959",
                this.setState({
                    titleCharCountLeft: a
                }),
                this.checkEnableUpload()
            },
            onDescriptionChange: function() {
                var e = this.refs.trackDesc
                  , t = e.getDOMNode().value
                  , n = t.length
                  , a = this.props.maxDescChars - n
                  , o = this.refs.descCharCountLeft.getDOMNode();
                o.style.color = 0 >= a ? "#E5302F" : "#595959",
                this.setState({
                    descCharCountLeft: a
                }),
                this.checkEnableUpload()
            },
            checkEnableUpload: function() {
                var e = this.refs
                  , t = this.state
                  , n = this.props
                  , o = e.trackTitle.getDOMNode()
                  , r = e.trackDesc.getDOMNode()
                  , i = t.vehiclesAllowed.mtb
                  , s = t.vehiclesAllowed.bmx
                  , l = o.value
                  , c = r.value
                  , u = !0
                  , p = !1;
                l.length <= n.minTitleChars && (u = !1),
                c.length <= n.minDescChars && (u = !1),
                i === !1 && s === !1 && (u = !1),
                n.options.verified || (u = !1,
                p = "You must complete your track before uploading");
                var d = this.getUser().get("user_stats")
                  , m = a.trackUploadCost
                  , h = d.tot_cns;
                m > h && (u = !1,
                p = "Not enough coins"),
                this.setState({
                    uploadingEnabled: u,
                    errorMsg: p
                })
            },
            closeDialog: function() {
                this.state.canClose && "undefined" != typeof GameManager && GameManager.command("dialog", !1)
            },
            toggleCheckbox: function(e) {
                var t = e.currentTarget
                  , n = t.getAttribute("data-vehicle")
                  , a = this.state.vehiclesAllowed
                  , o = this.state.defaultVehicle;
                a[n] = !a[n],
                a[o] = !0,
                this.setState(a),
                this.checkEnableUpload()
            },
            uploadTrack: function() {
                var e = this.state;
                if (e.uploadingEnabled) {
                    this.setState({
                        uploading: !0,
                        uploadingEnabled: !1,
                        canClose: !1,
                        loading: !0,
                        showErrorMsg: !1
                    });
                    var t = this.refs
                      , n = t.trackTitle.getDOMNode().value
                      , a = t.trackDesc.getDOMNode().value
                      , r = e.defaultVehicle
                      , i = e.vehiclesAllowed.mtb
                      , s = e.vehiclesAllowed.bmx
                      , l = this.props.options
                      , c = l.code
                      , u = {
                        name: n,
                        desc: a,
                        default_vehicle: r,
                        allowed_vehicles: {
                            MTB: i,
                            BMX: s
                        },
                        code: c
                    };
                    this.uploadData = u;
                    var p = o.post("create/submit", u);
                    p.done(this.uploadTrackComplete),
                    p.done(this.uploadTrackFail)
                }
            },
            trackEvent: function(e, t, n) {
                var a = {
                    category: "track-upload",
                    action: e,
                    label: t,
                    value: n,
                    non_interaction: !0
                };
                i.track_event(a)
            },
            uploadTrackComplete: function(e) {
                e.result ? (this.trackEvent("submit", "success", a.trackUploadCost),
                this.uploadResponseData = e.data,
                this.setState({
                    uploading: !1,
                    uploadComplete: !0,
                    canClose: !0
                })) : (this.trackEvent("submit-error", e.msg, 0),
                this.setState({
                    uploading: !1,
                    canClose: !0,
                    errorMsg: e.msg,
                    showErrorMsg: !0
                }))
            },
            uploadTrackFail: function(e) {
                console.log(e)
            },
            setDefaultVehicle: function() {
                var e = this.refs.trackDefaultVehicle.getDOMNode()
                  , t = e.options[e.selectedIndex].value
                  , n = t.toLowerCase()
                  , a = this.state.vehiclesAllowed;
                a[n] = !0,
                this.setState({
                    defaultVehicle: t,
                    vehiclesAllowed: a
                })
            },
            getForm: function() {
                var e = this.state
                  , t = this.props
                  , a = ""
                  , o = ""
                  , r = e.defaultVehicle.toLowerCase();
                e.vehiclesAllowed.mtb && (o = "checked"),
                e.vehiclesAllowed.bmx && (a = "checked"),
                "mtb" === r ? o += " disabled" : a += " disabled";
                var i = "";
                return e.uploading && (i = n.createElement("div", {
                    className: "ud-form-overlay"
                })),
                n.createElement("div", {
                    className: "ud-form"
                }, n.createElement("div", {
                    className: "ud-form-input"
                }, n.createElement("span", {
                    className: "title"
                }, "Track Title: "), n.createElement("span", {
                    className: "input-desc"
                }, "(max ", t.maxTitleChars, " characters)"), n.createElement("span", {
                    className: "char-left float-right",
                    ref: "titleCharCountLeft"
                }, e.titleCharCountLeft), n.createElement("div", null, n.createElement("input", {
                    type: "text",
                    onChange: this.onTitleChange,
                    maxLength: t.maxTitleChars,
                    className: "ud-form-text-input",
                    ref: "trackTitle",
                    name: "track-title"
                }))), n.createElement("div", {
                    className: "ud-form-input"
                }, n.createElement("span", {
                    className: "title"
                }, "Track Description: "), n.createElement("span", {
                    className: "input-desc"
                }, "(max ", this.props.maxDescChars, " characters)"), n.createElement("span", {
                    className: "char-left float-right",
                    ref: "descCharCountLeft"
                }, e.descCharCountLeft), n.createElement("div", null, n.createElement("textarea", {
                    onChange: this.onDescriptionChange,
                    maxLength: t.maxDescChars,
                    className: "ud-form-text-input",
                    ref: "trackDesc",
                    name: "trackDesc"
                }))), n.createElement("div", {
                    className: "ud-form-vehicles clearfix"
                }, n.createElement("div", {
                    className: "ud-form-input float-left"
                }, n.createElement("div", {
                    className: "title"
                }, "Default Vehicle"), n.createElement("select", {
                    className: "select-dropdown",
                    ref: "trackDefaultVehicle",
                    onChange: this.setDefaultVehicle
                }, n.createElement("option", {
                    value: "MTB"
                }, "Mountain Bike"), n.createElement("option", {
                    value: "BMX"
                }, "BMX Bike"))), n.createElement("div", {
                    className: "ud-form-input float-right"
                }, n.createElement("div", {
                    className: "title"
                }, "Vehicles Allowed"), n.createElement("div", {
                    className: "ud-form-checkbox " + o,
                    ref: "mtbEnabled",
                    "data-vehicle": "mtb",
                    onClick: this.toggleCheckbox
                }, n.createElement("span", {
                    className: "checkbox"
                }, " "), n.createElement("span", {
                    className: "name"
                }, "Mountain Bike")), n.createElement("div", {
                    className: "ud-form-checkbox " + a,
                    ref: "bmxEnabled",
                    "data-vehicle": "bmx",
                    onClick: this.toggleCheckbox
                }, n.createElement("span", {
                    className: "checkbox"
                }, " "), n.createElement("span", {
                    className: "name"
                }, "BMX Bike")))), i)
            },
            getShareData: function(e) {
                var t = e.track
                  , a = GameSettings.basePlatformExternalUrl
                  , o = "Play " + t.title + " by " + t.author + "!"
                  , r = t.title + " by " + t.author + " is a Free Rider HD Track"
                  , i = "Play Track"
                  , s = a + "/t/" + t.url
                  , l = t.title + " by " + t.author
                  , c = "Checkout " + t.title + " by " + t.author + ", a Free Rider HD Track"
                  , u = t.title + " by " + t.author + " is a Free Rider HD Track! Play Now : "
                  , p = t.descr
                  , d = t.title + " by " + t.author
                  , m = "HTML5, game"
                  , h = t.author
                  , f = "freerider_hd"
                  , g = n.createElement("div", {
                    ref: "shareTrackInfo",
                    "data-name": o,
                    "data-caption": r,
                    "data-action": i,
                    "data-url": s,
                    "data-title": l,
                    "data-subject": c,
                    "data-body": u,
                    "data-description": p,
                    "data-tweet": d,
                    "data-tweet_hashtags": m,
                    "data-author": h,
                    "data-via": f
                });
                return g
            },
            shareTrack: function(e) {
                var t = this.refs.shareTrackInfo.getDOMNode().dataset
                  , n = e.target.dataset.service;
                r.share(n, t)
            },
            getUploadCompleteScreen: function() {
                var e = this.uploadData
                  , t = this.uploadResponseData
                  , o = e.name
                  , r = t.track.url
                  , i = t.user_stats.tot_cns
                  , s = a.basePlatformUrl + "/t/" + r + "/uploaded";
                return n.createElement("div", {
                    className: "ud-upload-complete"
                }, this.getShareData(t), n.createElement("div", {
                    className: "ud-upload-complete-message margin-bottom-10"
                }, n.createElement("a", {
                    href: s,
                    ref: "trackLink",
                    className: "track-title"
                }, o), " was successfully uploaded!"), n.createElement("div", {
                    className: "ud-upload-complete-balance margin-bottom-10"
                }, "Your new coin balance is ", n.createElement("span", {
                    className: "balance"
                }, i)), n.createElement("div", {
                    className: "ud-upload-complete-share margin-bottom-10"
                }, n.createElement("div", {
                    className: "title"
                }, "Share your track"), n.createElement("div", {
                    className: "options"
                }, n.createElement("span", {
                    className: "share_icons share_icons-share_facebook",
                    "data-service": "facebook",
                    onClick: this.shareTrack
                }), n.createElement("span", {
                    className: "share_icons share_icons-share_google",
                    "data-service": "google_plus",
                    onClick: this.shareTrack
                }), n.createElement("span", {
                    className: "share_icons share_icons-share_twitter",
                    "data-service": "twitter",
                    onClick: this.shareTrack
                }), n.createElement("span", {
                    className: "share_icons share_icons-share_gmail",
                    "data-service": "gmail",
                    onClick: this.shareTrack
                }), n.createElement("span", {
                    className: "share_icons share_icons-share_mail",
                    "data-service": "mail",
                    onClick: this.shareTrack
                }), n.createElement("span", {
                    className: "share_icons share_icons-share_reddit",
                    "data-service": "reddit",
                    onClick: this.shareTrack
                }))), n.createElement("div", null, n.createElement("div", {
                    className: "margin-bottom-10"
                }, "Copy Track Link:"), n.createElement("div", null, n.createElement("input", {
                    type: "text",
                    ref: "trackLinkInput",
                    readOnly: !0,
                    onFocus: this.selectTrackLinkInput,
                    className: "ud-upload-complete-link-input",
                    value: s
                }))))
            },
            selectTrackLinkInput: function() {
                var e = this.refs.trackLinkInput.getDOMNode();
                e.select()
            },
            viewTrack: function() {
                this.state.uploadComplete && this.refs.trackLink.getDOMNode().click()
            },
            getFooter: function() {
                var e = this.state
                  , t = this.props
                  , o = t.options.code
                  , r = ""
                  , i = ""
                  , s = "disabled";
                e.canClose && (s = "");
                var l = "Cancel"
                  , c = "";
                if (e.uploadComplete && (l = "Close",
                c = n.createElement("button", {
                    className: "primary-button primary-button-blue float-right margin-0-5",
                    onClick: this.viewTrack
                }, "View Track")),
                e.uploadComplete === !1) {
                    var u = "disabled";
                    e.uploadingEnabled && (u = ""),
                    c = n.createElement("button", {
                        className: "primary-button primary-button-blue float-right margin-0-5 " + u,
                        onClick: this.uploadTrack
                    }, "Upload")
                }
                var p = n.createElement("button", {
                    className: "primary-button primary-button-black float-right margin-0-5 " + s,
                    onClick: this.closeDialog
                }, l);
                if (e.uploading === !1 && e.uploadComplete === !1 && o) {
                    var d = this.getUser().get("user_stats")
                      , m = a.trackUploadCost
                      , h = d.tot_cns
                      , f = {};
                    m > h && (f.color = "#E5302F"),
                    i = n.createElement("div", {
                        className: "ud-uploading-cost"
                    }, n.createElement("div", null, n.createElement("span", null, "Track publish cost: "), n.createElement("span", {
                        className: "core_icons core_icons-coin_icon_sm"
                    }), n.createElement("span", {
                        className: "num"
                    }, m)), n.createElement("div", null, n.createElement("span", null, "Your coin balance: "), n.createElement("span", {
                        className: "core_icons core_icons-coin_icon_sm"
                    }), n.createElement("span", {
                        className: "num",
                        style: f
                    }, h)))
                }
                e.uploading && (i = n.createElement("div", {
                    className: "ud-uploading-message"
                }, n.createElement("span", {
                    className: "loading-hourglass"
                }), n.createElement("span", {
                    className: "text"
                }, "Uploading track..."))),
                e.uploadComplete && (i = n.createElement("div", {
                    className: "ud-uploading-message"
                }, n.createElement("span", {
                    className: "text"
                }, "Upload Complete"))),
                e.errorMsg && (i = n.createElement("span", {
                    className: "ud-bottom-message"
                }, e.errorMsg),
                r = "error");
                var g = n.createElement("div", {
                    className: "editorDialog-bottomBar clearfix " + r
                }, i, c, p);
                return g
            },
            render: function() {
                var e = this.state
                  , t = this.props
                  , a = t.options.code
                  , o = n.createElement("div", {
                    className: "ud-exporting-track"
                }, "Generating track code...  ", n.createElement("span", {
                    className: "warning"
                }, "( This might take a minute )"))
                  , r = "";
                r = a && e.uploadComplete === !1 ? this.getForm() : e.uploadComplete === !0 ? this.getUploadCompleteScreen() : o;
                var i = this.getFooter()
                  , s = "disabled";
                return e.canClose && (s = ""),
                n.createElement("div", {
                    className: "editorDialog-content"
                }, n.createElement("div", {
                    className: "editorDialog-titleBar"
                }, n.createElement("span", {
                    className: "editorDialog-close " + s,
                    onClick: this.closeDialog
                }, "×"), n.createElement("h1", {
                    className: "editorDialog-content-title"
                }, "PUBLISH TRACK")), r, i)
            }
        });
        t.exports = s
    }
    , {
        react: "react"
    }],
    26: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "FocusOverlay",
            render: function() {
                return n.createElement("div", {
                    className: "gameFocusOverlay"
                }, n.createElement("div", {
                    className: "text"
                }, " Click to resume "))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    27: [function(e, t) {
        var n = e("react")
          , a = e("../tools/straightlinetool")
          , o = e("../tools/curvedlinetool")
          , r = e("../tools/brushtool")
          , i = e("../tools/erasertool")
          , s = e("../tools/poweruptool")
          , l = e("../tools/vehicletool")
          , c = (e("../tools/selecttool"),
        e("../tools/cameratool"))
          , u = n.createClass({
            displayName: "LeftMenu",
            render: function() {
                var e = this.props.data.tool
                  , t = this.props.data.hideMenus
                  , u = 48.6
                  , p = {};
                return p.marginTop = -(7 * u / 2),
                t && (p.display = "none"),
                n.createElement("div", {
                    className: "leftMenu",
                    style: p
                }, n.createElement(a, {
                    active: "straightline" === e
                }), n.createElement(o, {
                    active: "curve" === e
                }), n.createElement(r, {
                    active: "brush" === e
                }), n.createElement(i, {
                    active: "eraser" === e
                }), n.createElement(s, {
                    active: "powerup" === e
                }), n.createElement(l, {
                    active: "vehiclepowerup" === e
                }), n.createElement(c, {
                    active: "camera" === e
                }))
            }
        });
        t.exports = u
    }
    , {
        "../tools/brushtool": 39,
        "../tools/cameratool": 40,
        "../tools/curvedlinetool": 42,
        "../tools/erasertool": 43,
        "../tools/poweruptool": 47,
        "../tools/selecttool": 49,
        "../tools/straightlinetool": 52,
        "../tools/vehicletool": 59,
        react: "react"
    }],
    28: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "Loading",
            render: function() {
                var e = this.props.percent
                  , t = (this.props.itemName,
                {
                    width: e + "%"
                });
                return n.createElement("div", {
                    className: "gameLoading"
                }, n.createElement("div", {
                    className: "gameLoading-container"
                }, n.createElement("div", {
                    className: "gameLoading-bar"
                }, n.createElement("div", {
                    className: "gameLoading-progress",
                    style: t
                }))))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    29: [function(e, t) {
        var n = e("react")
          , a = e("../tools/physicsline")
          , o = e("../tools/sceneryline")
          , r = e("../tools/snap")
          , i = n.createClass({
            displayName: "BrushToolOptions",
            render: function() {
                var e = this.props.options;
                return n.createElement("div", null, n.createElement(a, {
                    active: "physics" === e.lineType
                }), n.createElement(o, {
                    active: "scenery" === e.lineType
                }), n.createElement(r, {
                    active: e.snap === !0
                }))
            }
        });
        t.exports = i
    }
    , {
        "../tools/physicsline": 46,
        "../tools/sceneryline": 48,
        "../tools/snap": 51,
        react: "react"
    }],
    30: [function(e, t) {
        var n = e("react")
          , a = e("../tools/physicsline")
          , o = e("../tools/sceneryline")
          , r = e("../tools/snap")
          , i = n.createClass({
            displayName: "CurvedLineToolOptions",
            render: function() {
                var e = this.props.options;
                return n.createElement("div", null, n.createElement(a, {
                    active: "physics" === e.lineType
                }), n.createElement(o, {
                    active: "scenery" === e.lineType
                }), n.createElement(r, {
                    active: e.snap === !0
                }))
            }
        });
        t.exports = i
    }
    , {
        "../tools/physicsline": 46,
        "../tools/sceneryline": 48,
        "../tools/snap": 51,
        react: "react"
    }],
    31: [function(e, t) {
        var n = e("react")
          , a = (e("../tools/physicsline"),
        e("../tools/sceneryline"),
        e("../tools/poweruptool"),
        n.createClass({
            displayName: "EraserToolOptions",
            togglePhysicsEraser: function() {
                "undefined" != typeof GameManager && (this.props.options.types.physics = !this.props.options.types.physics,
                GameManager.command("change tool option", "types", this.props.options.types))
            },
            toggleSceneryEraser: function() {
                "undefined" != typeof GameManager && (this.props.options.types.scenery = !this.props.options.types.scenery,
                GameManager.command("change tool option", "types", this.props.options.types))
            },
            togglePowerupEraser: function() {
                "undefined" != typeof GameManager && (this.props.options.types.powerups = !this.props.options.types.powerups,
                GameManager.command("change tool option", "types", this.props.options.types))
            },
            render: function() {
                var e = this.props.options
                  , t = "sideButton"
                  , a = t + " sideButton_eraserPhysics"
                  , o = t + " sideButton_eraserScenery"
                  , r = t + " sideButton_eraserPowerups";
                return e.types && (e.types.physics && (a += " active"),
                e.types.scenery && (o += " active"),
                e.types.powerups && (r += " active")),
                n.createElement("div", null, n.createElement("div", {
                    className: a,
                    onClick: this.togglePhysicsEraser
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_physics"
                })), n.createElement("div", {
                    className: o,
                    onClick: this.toggleSceneryEraser
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_scenery"
                })), n.createElement("div", {
                    className: r,
                    onClick: this.togglePowerupEraser
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_powerups"
                })))
            }
        }));
        t.exports = a
    }
    , {
        "../tools/physicsline": 46,
        "../tools/poweruptool": 47,
        "../tools/sceneryline": 48,
        react: "react"
    }],
    32: [function(e, t) {
        var n = e("react")
          , a = e("../tools/goalpoweruptool")
          , o = e("../tools/boostpoweruptool")
          , r = e("../tools/gravitypoweruptool")
          , i = e("../tools/slowmopoweruptool")
          , s = e("../tools/bombpoweruptool")
          , l = e("../tools/antigravitypoweruptool")
          , c = e("../tools/checkpointpoweruptool")
          , u = e("../tools/teleportpoweruptool")
          , p = n.createClass({
            displayName: "PowerupToolOptions",
            render: function() {
                var e = this.props.options;
                return n.createElement("div", null, n.createElement(a, {
                    options: e
                }), n.createElement(o, {
                    options: e
                }), n.createElement(r, {
                    options: e
                }), n.createElement(i, {
                    options: e
                }), n.createElement(s, {
                    options: e
                }), n.createElement(c, {
                    options: e
                }), n.createElement(l, {
                    options: e
                }), n.createElement(u, {
                    options: e
                }))
            }
        });
        t.exports = p
    }
    , {
        "../tools/antigravitypoweruptool": 36,
        "../tools/bombpoweruptool": 37,
        "../tools/boostpoweruptool": 38,
        "../tools/checkpointpoweruptool": 41,
        "../tools/goalpoweruptool": 44,
        "../tools/gravitypoweruptool": 45,
        "../tools/slowmopoweruptool": 50,
        "../tools/teleportpoweruptool": 53,
        react: "react"
    }],
    33: [function(e, t) {
        var n = e("react")
          , a = e("./straightlinetooloptions")
          , o = e("./curvedlinetooloptions")
          , r = e("./brushtooloptions")
          , i = e("./poweruptooloptions")
          , s = e("./vehiclepoweruptooloptions")
          , l = e("./erasertooloptions")
          , c = n.createClass({
            displayName: "RightMenu",
            render: function() {
                var e = this.props.data.tool
                  , t = this.props.data.toolOptions
                  , c = {}
                  , u = ""
                  , p = 48.6
                  , d = this.props.data.hideMenus;
                switch (d && (c.display = "none"),
                e) {
                case "straightline":
                    c.marginTop = -(3 * p / 2),
                    u = n.createElement(a, {
                        options: t
                    });
                    break;
                case "curve":
                    c.marginTop = -(3 * p / 2),
                    u = n.createElement(o, {
                        options: t
                    });
                    break;
                case "brush":
                    c.marginTop = -(3 * p / 2),
                    u = n.createElement(r, {
                        options: t
                    });
                    break;
                case "eraser":
                    c.marginTop = -(3 * p / 2),
                    u = n.createElement(l, {
                        options: t
                    });
                    break;
                case "powerup":
                    c.marginTop = -(8 * p / 2),
                    u = n.createElement(i, {
                        options: t
                    });
                    break;
                case "vehiclepowerup":
                    c.marginTop = -(6 * p / 2),
                    u = n.createElement(s, {
                        options: t
                    });
                    break;
                case "select":
                    break;
                case "camera":
                    var c = {
                        display: "none"
                    }
                }
                return n.createElement("div", {
                    className: "rightMenu unselectable",
                    style: c
                }, u)
            }
        });
        t.exports = c
    }
    , {
        "./brushtooloptions": 29,
        "./curvedlinetooloptions": 30,
        "./erasertooloptions": 31,
        "./poweruptooloptions": 32,
        "./straightlinetooloptions": 34,
        "./vehiclepoweruptooloptions": 35,
        react: "react"
    }],
    34: [function(e, t) {
        var n = e("react")
          , a = e("../tools/physicsline")
          , o = e("../tools/sceneryline")
          , r = e("../tools/snap")
          , i = n.createClass({
            displayName: "StraightLineToolOptions",
            render: function() {
                var e = this.props.options;
                return n.createElement("div", null, n.createElement(a, {
                    active: "physics" === e.lineType
                }), n.createElement(o, {
                    active: "scenery" === e.lineType
                }), n.createElement(r, {
                    active: e.snap === !0
                }))
            }
        });
        t.exports = i
    }
    , {
        "../tools/physicsline": 46,
        "../tools/sceneryline": 48,
        "../tools/snap": 51,
        react: "react"
    }],
    35: [function(e, t) {
        var n = e("react")
          , a = e("../tools/vehicles/helicoptertool")
          , o = e("../tools/vehicles/balloontool")
          , r = (e("../tools/vehicles/unicycletool"),
        e("../tools/vehicles/trucktool"))
          , i = e("../tools/vehicles/blobtool")
          , s = n.createClass({
            displayName: "PowerupToolOptions",
            render: function() {
                var e = this.props.options;
                return n.createElement("div", null, n.createElement(a, {
                    options: e
                }), n.createElement(r, {
                    options: e
                }), n.createElement(o, {
                    options: e
                }), n.createElement(i, {
                    options: e
                }))
            }
        });
        t.exports = s
    }
    , {
        "../tools/vehicles/balloontool": 54,
        "../tools/vehicles/blobtool": 55,
        "../tools/vehicles/helicoptertool": 56,
        "../tools/vehicles/trucktool": 57,
        "../tools/vehicles/unicycletool": 58,
        react: "react"
    }],
    36: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "AntigravityPowerupTool",
            name: "antigravity",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "powerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-antigravity"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    37: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "BombPowerupTool",
            name: "bomb",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "powerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-bomb"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    38: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "BoostPowerupTool",
            name: "boost",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "powerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-speed"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    39: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "BrushTool",
            changeTool: function() {
                "undefined" != typeof GameManager && GameManager.command("change tool", "brush")
            },
            render: function() {
                var e = "sideButton sideButton_brushTool";
                return this.props.active && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changeTool
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_brush"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    40: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "CameraTool",
            changeTool: function() {
                "undefined" != typeof GameManager && GameManager.command("change tool", "camera")
            },
            render: function() {
                var e = "sideButton sideButton-bottom sideButton_cameraTool ";
                return this.props.active && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changeTool
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_camera"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    41: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "CheckpointPowerupTool",
            name: "checkpoint",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "powerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-checkpoint"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    42: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "CurvedLineTool",
            changeTool: function() {
                "undefined" != typeof GameManager && GameManager.command("change tool", "curve")
            },
            render: function() {
                var e = "sideButton sideButton_curvedLineTool";
                return this.props.active && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changeTool
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_curve"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    43: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "EraserTool",
            changeTool: function() {
                "undefined" != typeof GameManager && GameManager.command("change tool", "eraser")
            },
            render: function() {
                var e = "sideButton sideButton_eraserTool";
                return this.props.active && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changeTool
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_eraser"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    44: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "GoalPowerupTool",
            name: "goal",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "powerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-goal"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    45: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "GravityPowerupTool",
            name: "gravity",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "powerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-gravity"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    46: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "PhysicsLine",
            changeLineType: function() {
                "undefined" != typeof GameManager && GameManager.command("change lineType", "physics")
            },
            render: function() {
                var e = "sideButton sideButton_physicsLine";
                return this.props.active && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changeLineType
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_physics"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    47: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "PowerupTool",
            changeTool: function() {
                "undefined" != typeof GameManager && GameManager.command("change tool", "powerup")
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.active && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changeTool
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_powerups"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    48: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "SceneryLine",
            changeLineType: function() {
                "undefined" != typeof GameManager && GameManager.command("change lineType", "scenery")
            },
            render: function() {
                var e = "sideButton sideButton_sceneryLine";
                return this.props.active && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changeLineType
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_scenery"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    49: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "SelectTool",
            changeTool: function() {
                "undefined" != typeof GameManager && GameManager.command("change tool", "select")
            },
            render: function() {
                var e = "sideButton sideButton_selectTool";
                return this.props.active && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changeTool
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_select"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    50: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "SlowmoPowerupTool",
            name: "slowmo",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "powerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-slowmotion"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    51: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "Snap",
            toggleSnap: function() {
                "undefined" != typeof GameManager && GameManager.command("snap")
            },
            render: function() {
                var e = "sideButton sideButton_snap"
                  , t = "editorgui_icons editorgui_icons-icon_snap";
                return this.props.active && (e += " active",
                t = "editorgui_icons editorgui_icons-icon_snap_on"),
                n.createElement("div", {
                    className: e,
                    onClick: this.toggleSnap
                }, n.createElement("span", {
                    className: t
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    52: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "StraightLineTool",
            changeTool: function() {
                "undefined" != typeof GameManager && GameManager.command("change tool", "straightline")
            },
            render: function() {
                var e = "sideButton sideButton-top sideButton_straightLineTool";
                return this.props.active && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changeTool
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_line"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    53: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "TeleportPowerupTool",
            name: "teleport",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "powerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool"
                  , t = "";
                return this.props.options.selected === this.name && (t = "",
                e = "sideButton sideButton_powerupTool active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-portal",
                    title: t
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    54: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "Balloontool",
            name: "balloon",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "vehiclepowerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-balloon"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    55: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "BlobTool",
            name: "blob",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "vehiclepowerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-blob"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    56: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "HelicopterTool",
            name: "helicopter",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "vehiclepowerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-helicopter"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    57: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "TruckTool",
            name: "truck",
            changePowerup: function() {
                "undefined" != typeof GameManager && (GameManager.command("change tool", "vehiclepowerup"),
                GameManager.command("change tool option", "selected", this.name))
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-truck"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    58: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "UnicycleTool",
            name: "unicycle",
            changePowerup: function() {},
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.options.selected === this.name && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changePowerup
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-unicycle"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    59: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "VehicleTool",
            changeTool: function() {
                "undefined" != typeof GameManager && GameManager.command("change tool", "vehiclepowerup")
            },
            render: function() {
                var e = "sideButton sideButton_powerupTool";
                return this.props.active && (e += " active"),
                n.createElement("div", {
                    className: e,
                    onClick: this.changeTool
                }, n.createElement("span", {
                    className: "editorgui_icons editorgui_icons-icon_vehicle_swap"
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    60: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "ClearTrack",
            clearTrack: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", "clear")
            },
            render: function() {
                var e = "topMenu-button topMenu-button_clear"
                  , t = "editorgui_icons editorgui_icons-icon_clear_track";
                return n.createElement("div", {
                    className: e,
                    onClick: this.clearTrack,
                    title: "Clear Track"
                }, n.createElement("span", {
                    className: t
                }), n.createElement("span", {
                    className: "text"
                }, "Clear"))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    61: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "Controls",
            dialogName: "controls",
            openDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", this.dialogName)
            },
            render: function() {
                var e = "topMenu-button topMenu-button_controls"
                  , t = "editorgui_icons editorgui_icons-icon_controls";
                return n.createElement("div", {
                    className: e,
                    onClick: this.openDialog,
                    title: "Controls"
                }, n.createElement("span", {
                    className: t
                }), n.createElement("span", {
                    className: "text"
                }, "Controls"))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    62: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "ExportTrack",
            dialogName: "export",
            openDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", this.dialogName)
            },
            render: function() {
                var e = "topMenu-button topMenu-button_export"
                  , t = "editorgui_icons editorgui_icons-icon_export";
                return n.createElement("div", {
                    className: e,
                    onClick: this.openDialog,
                    title: "Export Track"
                }, n.createElement("span", {
                    className: t
                }), n.createElement("span", {
                    className: "text"
                }, "Export"))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    63: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "Fullscreen",
            toggleFullscreen: function() {
                "undefined" != typeof GameManager && GameManager.command("fullscreen")
            },
            render: function() {
                var e = GameSettings.fullscreen
                  , t = "topMenu-button topMenu-button-right topMenu-button_fullscreen"
                  , a = "editorgui_icons";
                return a += e ? " editorgui_icons-icon_exit_fullscreen" : " editorgui_icons-icon_fullscreen",
                n.createElement("div", {
                    className: t,
                    onClick: this.toggleFullscreen
                }, n.createElement("span", {
                    className: a
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    64: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "Help",
            dialogName: "help",
            openDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", this.dialogName)
            },
            render: function() {
                var e = "topMenu-button topMenu-button_help"
                  , t = "editorgui_icons editorgui_icons-icon_hotkeys";
                return n.createElement("div", {
                    className: e,
                    onClick: this.openDialog,
                    title: "Hotkeys"
                }, n.createElement("span", {
                    className: t
                }), n.createElement("span", {
                    className: "text"
                }, "Hotkeys"))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    65: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "ImportTrack",
            dialogName: "import",
            openDialog: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", this.dialogName)
            },
            render: function() {
                var e = "topMenu-button topMenu-button_import"
                  , t = "editorgui_icons editorgui_icons-icon_import";
                return n.createElement("div", {
                    className: e,
                    onClick: this.openDialog,
                    title: "Import Track"
                }, n.createElement("span", {
                    className: t
                }), n.createElement("span", {
                    className: "text"
                }, "Import"))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    66: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "IncreaseZoom",
            increaseZoom: function() {
                "undefined" != typeof GameManager && GameManager.command("increase zoom")
            },
            render: function() {
                var e = "topMenu-button topMenu-button-right topMenu-button_increase_zoom"
                  , t = "editorgui_icons editorgui_icons-icon_zoom_in";
                return n.createElement("div", {
                    className: e,
                    onClick: this.increaseZoom
                }, n.createElement("span", {
                    className: t
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    67: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "OfflineEditor",
            clearTrack: function() {
                "undefined" != typeof GameManager && GameManager.command("dialog", "offline_editor")
            },
            render: function() {
                var e = "topMenu-button topMenu-button_offline"
                  , t = "editorgui_icons editorgui_icons-icon_offline_editor";
                return n.createElement("div", {
                    className: e,
                    onClick: this.clearTrack,
                    title: "Offline Editor"
                }, n.createElement("span", {
                    className: t
                }), n.createElement("span", {
                    className: "text"
                }, "Offline"))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    68: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "ReduceZoom",
            decreaseZoom: function() {
                "undefined" != typeof GameManager && GameManager.command("decrease zoom")
            },
            render: function() {
                var e = "topMenu-button topMenu-button-right topMenu-button_reduce_zoom"
                  , t = "editorgui_icons editorgui_icons-icon_zoom_out";
                return n.createElement("div", {
                    className: e,
                    onClick: this.decreaseZoom
                }, n.createElement("span", {
                    className: t
                }))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    69: [function(e, t) {
        var n = e("react")
          , a = e("./cleartrack")
          , o = e("./importtrack")
          , r = e("./exporttrack")
          , i = e("./uploadtrack")
          , s = e("./help")
          , l = e("./controls")
          , c = e("./reducezoom")
          , u = e("./increasezoom")
          , p = e("./zoomlevel")
          , d = e("./fullscreen")
          , m = e("./offlineeditor")
          , h = n.createClass({
            displayName: "TopMenu",
            render: function() {
                return n.createElement("div", {
                    className: "topMenu unselectable"
                }, n.createElement(a, null), n.createElement(o, null), n.createElement(r, null), n.createElement(i, null), this.showHelp(), this.showControls(), this.showOfflineEditorIcon(), this.showFullscreen(), n.createElement(u, null), n.createElement(p, {
                    percent: this.props.data.zoomPercentage
                }), n.createElement(c, null))
            },
            showOfflineEditorIcon: function() {
                var e = !1
                  , t = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
                return t && "undefined" == typeof isChromeApp && (e = n.createElement(m, null)),
                e
            },
            showHelp: function() {
                var e = !1;
                return GameSettings.mobile === !1 && (e = n.createElement(s, null)),
                e
            },
            showControls: function() {
                var e = !1;
                return GameSettings.mobile === !1 && (e = n.createElement(l, null)),
                e
            },
            showFullscreen: function() {
                var e = !1;
                return GameSettings.fullscreenAvailable && !GameSettings.isStandalone && (e = n.createElement(d, null)),
                e
            }
        });
        t.exports = h
    }
    , {
        "./cleartrack": 60,
        "./controls": 61,
        "./exporttrack": 62,
        "./fullscreen": 63,
        "./help": 64,
        "./importtrack": 65,
        "./increasezoom": 66,
        "./offlineeditor": 67,
        "./reducezoom": 68,
        "./uploadtrack": 70,
        "./zoomlevel": 71,
        react: "react"
    }],
    70: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "UploadTrack",
            dialogName: "upload",
            openDialog: function() {
                GameSettings.isStandalone ? "undefined" != typeof GameManager && GameManager.command("dialog", this.dialogName) : Application.User.is_logged_in() === !1 ? Application.events.publish("prompt.login") : "undefined" != typeof GameManager && GameManager.command("dialog", this.dialogName)
            },
            render: function() {
                var e = "topMenu-button topMenu-button_import"
                  , t = "editorgui_icons editorgui_icons-icon_upload";
                return n.createElement("div", {
                    className: e,
                    onClick: this.openDialog,
                    title: "Publish Track"
                }, n.createElement("span", {
                    className: t
                }), n.createElement("span", {
                    className: "text"
                }, "Publish"))
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    71: [function(e, t) {
        var n = e("react")
          , a = n.createClass({
            displayName: "ZoomLevel",
            resetZoom: function() {
                "undefined" != typeof GameManager && GameManager.command("reset zoom")
            },
            render: function() {
                var e = this.props.percent;
                e || (e = 100);
                var t = "topMenu-button topMenu-button-right topMenu-button_zoom";
                return n.createElement("div", {
                    className: t,
                    onClick: this.resetZoom
                }, e, "%")
            }
        });
        t.exports = a
    }
    , {
        react: "react"
    }],
    72: [function(e, t) {
        !function(e) {
            "use strict";
            if (e.URL = e.URL || e.webkitURL,
            e.Blob && e.URL)
                try {
                    return void new Blob
                } catch (t) {}
            var n = e.BlobBuilder || e.WebKitBlobBuilder || e.MozBlobBuilder || function(e) {
                var t = function(e) {
                    return Object.prototype.toString.call(e).match(/^\[object\s(.*)\]$/)[1]
                }
                  , n = function() {
                    this.data = []
                }
                  , a = function(e, t, n) {
                    this.data = e,
                    this.size = e.length,
                    this.type = t,
                    this.encoding = n
                }
                  , o = n.prototype
                  , r = a.prototype
                  , i = e.FileReaderSync
                  , s = function(e) {
                    this.code = this[this.name = e]
                }
                  , l = "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" ")
                  , c = l.length
                  , u = e.URL || e.webkitURL || e
                  , p = u.createObjectURL
                  , d = u.revokeObjectURL
                  , m = u
                  , h = e.btoa
                  , f = e.atob
                  , g = e.ArrayBuffer
                  , v = e.Uint8Array
                  , y = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;
                for (a.fake = r.fake = !0; c--; )
                    s.prototype[l[c]] = c + 1;
                return u.createObjectURL || (m = e.URL = function(e) {
                    var t, n = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                    return n.href = e,
                    "origin"in n || ("data:" === n.protocol.toLowerCase() ? n.origin = null : (t = e.match(y),
                    n.origin = t && t[1])),
                    n
                }
                ),
                m.createObjectURL = function(e) {
                    var t, n = e.type;
                    return null === n && (n = "application/octet-stream"),
                    e instanceof a ? (t = "data:" + n,
                    "base64" === e.encoding ? t + ";base64," + e.data : "URI" === e.encoding ? t + "," + decodeURIComponent(e.data) : h ? t + ";base64," + h(e.data) : t + "," + encodeURIComponent(e.data)) : p ? p.call(u, e) : void 0
                }
                ,
                m.revokeObjectURL = function(e) {
                    "data:" !== e.substring(0, 5) && d && d.call(u, e)
                }
                ,
                o.append = function(e) {
                    var n = this.data;
                    if (v && (e instanceof g || e instanceof v)) {
                        for (var o = "", r = new v(e), l = 0, c = r.length; c > l; l++)
                            o += String.fromCharCode(r[l]);
                        n.push(o)
                    } else if ("Blob" === t(e) || "File" === t(e)) {
                        if (!i)
                            throw new s("NOT_READABLE_ERR");
                        var u = new i;
                        n.push(u.readAsBinaryString(e))
                    } else
                        e instanceof a ? "base64" === e.encoding && f ? n.push(f(e.data)) : "URI" === e.encoding ? n.push(decodeURIComponent(e.data)) : "raw" === e.encoding && n.push(e.data) : ("string" != typeof e && (e += ""),
                        n.push(unescape(encodeURIComponent(e))))
                }
                ,
                o.getBlob = function(e) {
                    return arguments.length || (e = null),
                    new a(this.data.join(""),e,"raw")
                }
                ,
                o.toString = function() {
                    return "[object BlobBuilder]"
                }
                ,
                r.slice = function(e, t, n) {
                    var o = arguments.length;
                    return 3 > o && (n = null),
                    new a(this.data.slice(e, o > 1 ? t : this.data.length),n,this.encoding)
                }
                ,
                r.toString = function() {
                    return "[object Blob]"
                }
                ,
                r.close = function() {
                    this.size = 0,
                    delete this.data
                }
                ,
                n
            }(e);
            e.Blob = function(e, t) {
                var a = t ? t.type || "" : ""
                  , o = new n;
                if (e)
                    for (var r = 0, i = e.length; i > r; r++)
                        o.append(e[r]);
                return o.getBlob(a)
            }
        }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content || this),
        "undefined" != typeof t && t.exports ? t.exports.saveAs = Blob : "undefined" != typeof define && null !== define && null != define.amd && define([], function() {
            return Blob
        })
    }
    , {}],
    73: [function(e, t) {
        var n = n || "undefined" != typeof navigator && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator) || function(e) {
            "use strict";
            if ("undefined" == typeof navigator || !/MSIE [1-9]\./.test(navigator.userAgent)) {
                var t = e.document
                  , n = function() {
                    return e.URL || e.webkitURL || e
                }
                  , a = t.createElementNS("http://www.w3.org/1999/xhtml", "a")
                  , o = "download"in a
                  , r = function(n) {
                    var a = t.createEvent("MouseEvents");
                    a.initMouseEvent("click", !0, !1, e, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null),
                    n.dispatchEvent(a)
                }
                  , i = e.webkitRequestFileSystem
                  , s = e.requestFileSystem || i || e.mozRequestFileSystem
                  , l = function(t) {
                    (e.setImmediate || e.setTimeout)(function() {
                        throw t
                    }, 0)
                }
                  , c = "application/octet-stream"
                  , u = 0
                  , p = 500
                  , d = function(t) {
                    var a = function() {
                        "string" == typeof t ? n().revokeObjectURL(t) : t.remove()
                    };
                    e.chrome ? a() : setTimeout(a, p)
                }
                  , m = function(e, t, n) {
                    t = [].concat(t);
                    for (var a = t.length; a--; ) {
                        var o = e["on" + t[a]];
                        if ("function" == typeof o)
                            try {
                                o.call(e, n || e)
                            } catch (r) {
                                l(r)
                            }
                    }
                }
                  , h = function(t, l) {
                    var p, h, f, g = this, v = t.type, y = !1, E = function() {
                        m(g, "writestart progress write writeend".split(" "))
                    }, b = function() {
                        if ((y || !p) && (p = n().createObjectURL(t)),
                        h)
                            h.location.href = p;
                        else {
                            var a = e.open(p, "_blank");
                            void 0 == a && "undefined" != typeof safari && (e.location.href = p)
                        }
                        g.readyState = g.DONE,
                        E(),
                        d(p)
                    }, N = function(e) {
                        return function() {
                            return g.readyState !== g.DONE ? e.apply(this, arguments) : void 0
                        }
                    }, k = {
                        create: !0,
                        exclusive: !1
                    };
                    return g.readyState = g.INIT,
                    l || (l = "download"),
                    o ? (p = n().createObjectURL(t),
                    a.href = p,
                    a.download = l,
                    r(a),
                    g.readyState = g.DONE,
                    E(),
                    void d(p)) : (/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type) && (t = new Blob(["﻿", t],{
                        type: t.type
                    })),
                    e.chrome && v && v !== c && (f = t.slice || t.webkitSlice,
                    t = f.call(t, 0, t.size, c),
                    y = !0),
                    i && "download" !== l && (l += ".download"),
                    (v === c || i) && (h = e),
                    s ? (u += t.size,
                    void s(e.TEMPORARY, u, N(function(e) {
                        e.root.getDirectory("saved", k, N(function(e) {
                            var n = function() {
                                e.getFile(l, k, N(function(e) {
                                    e.createWriter(N(function(n) {
                                        n.onwriteend = function(t) {
                                            h.location.href = e.toURL(),
                                            g.readyState = g.DONE,
                                            m(g, "writeend", t),
                                            d(e)
                                        }
                                        ,
                                        n.onerror = function() {
                                            var e = n.error;
                                            e.code !== e.ABORT_ERR && b()
                                        }
                                        ,
                                        "writestart progress write abort".split(" ").forEach(function(e) {
                                            n["on" + e] = g["on" + e]
                                        }),
                                        n.write(t),
                                        g.abort = function() {
                                            n.abort(),
                                            g.readyState = g.DONE
                                        }
                                        ,
                                        g.readyState = g.WRITING
                                    }), b)
                                }), b)
                            };
                            e.getFile(l, {
                                create: !1
                            }, N(function(e) {
                                e.remove(),
                                n()
                            }), N(function(e) {
                                e.code === e.NOT_FOUND_ERR ? n() : b()
                            }))
                        }), b)
                    }), b)) : void b())
                }
                  , f = h.prototype
                  , g = function(e, t) {
                    return new h(e,t)
                };
                return f.abort = function() {
                    var e = this;
                    e.readyState = e.DONE,
                    m(e, "abort")
                }
                ,
                f.readyState = f.INIT = 0,
                f.WRITING = 1,
                f.DONE = 2,
                f.error = f.onwritestart = f.onprogress = f.onwrite = f.onabort = f.onerror = f.onwriteend = null,
                g
            }
        }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);
        "undefined" != typeof t && t.exports ? t.exports.saveAs = n : "undefined" != typeof define && null !== define && null != define.amd && define([], function() {
            return n
        })
    }
    , {}],
    74: [function(e, t, n) {
        !function(a, o) {
            "function" == typeof define && define.amd ? define(["react"], o) : "object" == typeof n ? t.exports = o(e("react")) : a.ReactSlider = o(a.React)
        }(this, function(e) {
            function t(e) {
                return e.stopPropagation && e.stopPropagation(),
                e.preventDefault && e.preventDefault(),
                e.cancelBubble = !0,
                e.returnValue = !1,
                !1
            }
            function n(e, t, n) {
                for (var a = (t - e) / (n - 1), o = [], r = 0; n > r; r++)
                    o.push(e + a * r);
                return o
            }
            function a(e) {
                return Array.isArray(e) ? e : [e]
            }
            function o(e) {
                return 1 === e.length ? e[0] : e
            }
            function r(e) {
                return null != e
            }
            var i = e.createClass({
                displayName: "ReactSlider",
                propTypes: {
                    min: e.PropTypes.number,
                    max: e.PropTypes.number,
                    step: e.PropTypes.number,
                    defaultValue: e.PropTypes.oneOfType([e.PropTypes.number, e.PropTypes.arrayOf(e.PropTypes.number)]),
                    value: e.PropTypes.oneOfType([e.PropTypes.number, e.PropTypes.arrayOf(e.PropTypes.number)]),
                    orientation: e.PropTypes.oneOf(["horizontal", "vertical"]),
                    className: e.PropTypes.string,
                    handleClassName: e.PropTypes.string,
                    handleActiveClassName: e.PropTypes.string,
                    minDistance: e.PropTypes.number,
                    barClassName: e.PropTypes.string,
                    withBars: e.PropTypes.bool,
                    pearling: e.PropTypes.bool,
                    disabled: e.PropTypes.bool,
                    onChange: e.PropTypes.func,
                    onChanged: e.PropTypes.func
                },
                getDefaultProps: function() {
                    return {
                        min: 0,
                        max: 100,
                        step: 1,
                        defaultValue: 0,
                        orientation: "horizontal",
                        className: "slider",
                        handleClassName: "handle",
                        handleActiveClassName: "active",
                        minDistance: 0,
                        barClassName: "bar",
                        withBars: !1,
                        pearling: !1,
                        disabled: !1
                    }
                },
                getInitialState: function() {
                    var e = a(this.props.value)
                      , t = a(this.props.defaultValue);
                    return e = this._or(e, t).map(function(e) {
                        return this._trimAlignValue(e, this.props)
                    }, this),
                    {
                        index: -1,
                        upperBound: 0,
                        sliderLength: 0,
                        value: e,
                        zIndices: e.reduce(function(e, t, n) {
                            return e.push(n),
                            e
                        }, [])
                    }
                },
                componentWillReceiveProps: function(e) {
                    var t = this._or(a(e.value), this.state.value);
                    this.state.value = t.map(function(t) {
                        return this._trimAlignValue(t, e)
                    }, this)
                },
                _or: function(t, a) {
                    return t.every(r) ? t : a.every(r) ? a : n(this.props.min, this.props.max, e.Children.count(this.props.children))
                },
                componentDidMount: function() {
                    window.addEventListener("resize", this._handleResize),
                    this._handleResize()
                },
                componentWillUnmount: function() {
                    window.removeEventListener("resize", this._handleResize)
                },
                getValue: function() {
                    return o(this.state.value)
                },
                _handleResize: function() {
                    var e = this.refs.slider.getDOMNode()
                      , t = this.refs.handle0.getDOMNode()
                      , n = e.getBoundingClientRect()
                      , a = this._sizeKey()
                      , o = n[this._posMaxKey()] - t[a]
                      , r = n[this._posMinKey()];
                    this.setState({
                        upperBound: e[a] - t[a],
                        sliderLength: o - r,
                        sliderMin: r,
                        handleSize: t[a]
                    })
                },
                _calcOffset: function(e) {
                    var t = (e - this.props.min) / (this.props.max - this.props.min);
                    return t * this.state.upperBound
                },
                _calcValue: function(e) {
                    var t = e / this.state.upperBound;
                    return t * (this.props.max - this.props.min) + this.props.min
                },
                _buildHandleStyle: function(e, t) {
                    var n = {
                        position: "absolute",
                        willChange: this.state.index >= 0 ? this._posMinKey() : "",
                        zIndex: this.state.zIndices.indexOf(t) + 1
                    };
                    return n[this._posMinKey()] = e + "px",
                    n
                },
                _buildBarStyle: function(e, t) {
                    var n = {
                        position: "absolute",
                        willChange: this.state.index >= 0 ? this._posMinKey() + "," + this._posMaxKey() : ""
                    };
                    return n[this._posMinKey()] = e,
                    n[this._posMaxKey()] = t,
                    n
                },
                _getClosestIndex: function(e) {
                    return this.state.value.reduce(function(t, n, a) {
                        var o = t[1]
                          , r = this._calcOffset(n)
                          , i = Math.abs(e - r);
                        return o > i ? [a, i] : t
                    }
                    .bind(this), [-1, Number.MAX_VALUE])[0]
                },
                _forceValueFromPosition: function(e, t) {
                    var n = e - this.state.sliderMin - this.state.handleSize / 2
                      , a = this._getClosestIndex(n)
                      , o = this._trimAlignValue(this._calcValue(n))
                      , r = this.state.value;
                    r[a] = o,
                    this.setState({
                        value: r
                    }, t.bind(this, a))
                },
                _getMousePosition: function(e) {
                    return e["page" + this._axisKey()]
                },
                _getTouchPosition: function(e) {
                    var t = e.changedTouches[e.changedTouches.length - 1];
                    return t["page" + this._axisKey()]
                },
                _getMouseEventMap: function() {
                    return {
                        mousemove: this._onMouseMove,
                        mouseup: this._onMouseUp
                    }
                },
                _getTouchEventMap: function() {
                    return {
                        touchmove: this._onTouchMove,
                        touchend: this._onTouchEnd
                    }
                },
                _createOnMouseDown: function(e) {
                    return this._createOnStart(e, this._getMousePosition, this._getMouseEventMap())
                },
                _createOnTouchStart: function(e) {
                    return this._createOnStart(e, this._getTouchPosition, this._getTouchEventMap())
                },
                _createOnStart: function(e, n, a) {
                    return this.props.disabled ? void 0 : function(o) {
                        document.activeElement && document.activeElement.blur();
                        var r = n(o);
                        this._start(e, r);
                        for (var i in a)
                            document.addEventListener(i, a[i], !1);
                        t(o)
                    }
                    .bind(this)
                },
                _start: function(e, t) {
                    var n = this.state.zIndices;
                    n.splice(n.indexOf(e), 1),
                    n.push(e),
                    this.setState({
                        startValue: this.state.value[e],
                        startPosition: t,
                        index: e,
                        zIndices: n
                    })
                },
                _onMouseUp: function() {
                    this._onEnd(this._getMouseEventMap())
                },
                _onTouchEnd: function() {
                    this._onEnd(this._getTouchEventMap())
                },
                _onEnd: function(e) {
                    for (var t in e)
                        document.removeEventListener(t, e[t], !1);
                    this.setState({
                        index: -1
                    }),
                    this._fireEvent("onChanged")
                },
                _onMouseMove: function(e) {
                    var t = this._getMousePosition(e);
                    this._move(this.state.index, t)
                },
                _onTouchMove: function(e) {
                    var t = this._getTouchPosition(e);
                    this._move(this.state.index, t)
                },
                _move: function(e, t) {
                    if (!this.props.disabled) {
                        var n = this.state.value
                          , a = this.state.value.map(function(n, a) {
                            if (e !== a)
                                return n;
                            var o = t - this.state.startPosition
                              , r = o / this.state.sliderLength * (this.props.max - this.props.min)
                              , i = this.state.startValue + r;
                            if (!this.props.pearling) {
                                if (e > 0) {
                                    var s = this.state.value[e - 1];
                                    i < s + this.props.minDistance && (i = s + this.props.minDistance)
                                }
                                if (e < this.state.value.length - 1) {
                                    var l = this.state.value[e + 1];
                                    i > l - this.props.minDistance && (i = l - this.props.minDistance)
                                }
                            }
                            return this._trimAlignValue(i)
                        }, this);
                        if (this.props.pearling) {
                            var o = a.length;
                            o > 1 && (a[e] > n[e] ? (this._pearlNext(e, a),
                            this._limitNext(o, a)) : a[e] < n[e] && (this._pearlPrev(e, a),
                            this._limitPrev(o, a)))
                        }
                        var r = a.reduce(function(e, t, a) {
                            return e && t === n[a]
                        }, !0);
                        r || this.setState({
                            value: a
                        }, this._fireEvent.bind(this, "onChange"))
                    }
                },
                _pearlNext: function(e, t) {
                    var n = t[e] + this.props.minDistance;
                    t[e + 1] && n > t[e + 1] && (t[e + 1] = this._alignValue(n),
                    this._pearlNext(e + 1, t))
                },
                _limitNext: function(e, t) {
                    for (var n = 0; e > n; n++) {
                        var a = this.props.max - n * this.props.minDistance;
                        t[e - 1 - n] > a && (t[e - 1 - n] = a)
                    }
                },
                _pearlPrev: function(e, t) {
                    var n = t[e] - this.props.minDistance;
                    t[e - 1] && n < t[e - 1] && (t[e - 1] = this._alignValue(n),
                    this._pearlPrev(e - 1, t))
                },
                _limitPrev: function(e, t) {
                    for (var n = 0; e > n; n++) {
                        var a = this.props.min + n * this.props.minDistance;
                        t[n] < a && (t[n] = a)
                    }
                },
                _axisKey: function() {
                    return {
                        horizontal: "X",
                        vertical: "Y"
                    }[this.props.orientation]
                },
                _posMinKey: function() {
                    return {
                        horizontal: "left",
                        vertical: "top"
                    }[this.props.orientation]
                },
                _posMaxKey: function() {
                    return {
                        horizontal: "right",
                        vertical: "bottom"
                    }[this.props.orientation]
                },
                _sizeKey: function() {
                    return {
                        horizontal: "clientWidth",
                        vertical: "clientHeight"
                    }[this.props.orientation]
                },
                _trimAlignValue: function(e, t) {
                    return this._alignValue(this._trimValue(e, t), t)
                },
                _trimValue: function(e, t) {
                    return t = t || this.props,
                    e <= t.min && (e = t.min),
                    e >= t.max && (e = t.max),
                    e
                },
                _alignValue: function(e, t) {
                    t = t || this.props;
                    var n = (e - t.min) % t.step
                      , a = e - n;
                    return 2 * Math.abs(n) >= t.step && (a += n > 0 ? t.step : -t.step),
                    parseFloat(a.toFixed(5))
                },
                _renderHandle: function(t) {
                    return function(n, a) {
                        var o = this.props.handleClassName + " " + (this.props.handleClassName + "-" + a) + " " + (this.state.index === a ? this.props.handleActiveClassName : "");
                        return e.createElement("div", {
                            ref: "handle" + a,
                            key: "handle" + a,
                            className: o,
                            style: t[a],
                            onMouseDown: this._createOnMouseDown(a),
                            onTouchStart: this._createOnTouchStart(a)
                        }, n)
                    }
                    .bind(this)
                },
                _renderHandles: function(t) {
                    var n = t.map(this._buildHandleStyle);
                    if (e.Children.count(this.props.children) > 0)
                        return e.Children.map(this.props.children, this._renderHandle(n));
                    var a = this._renderHandle(n);
                    return t.map(function(e, t) {
                        return a(null, t)
                    }, this)
                },
                _renderBar: function(t, n, a) {
                    return e.createElement("div", {
                        key: "bar" + t,
                        ref: "bar" + t,
                        className: this.props.barClassName + " " + this.props.barClassName + "-" + t,
                        style: this._buildBarStyle(n, this.state.upperBound - a)
                    })
                },
                _renderBars: function(e) {
                    var t = []
                      , n = e.length - 1;
                    t.push(this._renderBar(0, 0, e[0]));
                    for (var a = 0; n > a; a++)
                        t.push(this._renderBar(a + 1, e[a], e[a + 1]));
                    return t.push(this._renderBar(n + 1, e[n], this.state.upperBound)),
                    t
                },
                _onSliderStart: function(e, n, a) {
                    if (!this.props.disabled) {
                        document.activeElement && document.activeElement.blur();
                        var o = n(e);
                        this._forceValueFromPosition(o, function(e) {
                            this._fireEvent("onChange"),
                            this._start(e, o);
                            for (var t in a)
                                document.addEventListener(t, a[t], !1)
                        }
                        .bind(this)),
                        t(e)
                    }
                },
                _onSliderMouseDown: function(e) {
                    this._onSliderStart(e, this._getMousePosition, this._getMouseEventMap())
                },
                _onSliderTouchStart: function(e) {
                    this._onSliderStart(e, this._getTouchPosition, this._getTouchEventMap())
                },
                _fireEvent: function(e) {
                    this.props[e] && this.props[e](o(this.state.value))
                },
                render: function() {
                    var t = this.state.value.map(this._calcOffset)
                      , n = this.props.withBars ? this._renderBars(t) : null
                      , a = this._renderHandles(t);
                    return e.createElement("div", {
                        ref: "slider",
                        style: {
                            position: "relative"
                        },
                        className: this.props.className + (this.props.disabled ? " disabled" : ""),
                        onMouseDown: this._onSliderMouseDown,
                        onTouchStart: this._onSliderTouchStart
                    }, n, a)
                }
            });
            return i
        })
    }
    , {
        react: "react"
    }],
    75: [function(e, t) {
        !function(e, n) {
            "object" == typeof t && "object" == typeof t.exports ? t.exports = e.document ? n(e, !0) : function(e) {
                if (!e.document)
                    throw new Error("jQuery requires a window with a document");
                return n(e)
            }
            : n(e)
        }("undefined" != typeof window ? window : this, function(e, t) {
            function n(e) {
                var t = "length"in e && e.length
                  , n = Q.type(e);
                return "function" === n || Q.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
            }
            function a(e, t, n) {
                if (Q.isFunction(t))
                    return Q.grep(e, function(e, a) {
                        return !!t.call(e, a, e) !== n
                    });
                if (t.nodeType)
                    return Q.grep(e, function(e) {
                        return e === t !== n
                    });
                if ("string" == typeof t) {
                    if (st.test(t))
                        return Q.filter(t, e, n);
                    t = Q.filter(t, e)
                }
                return Q.grep(e, function(e) {
                    return V.call(t, e) >= 0 !== n
                })
            }
            function o(e, t) {
                for (; (e = e[t]) && 1 !== e.nodeType; )
                    ;
                return e
            }
            function r(e) {
                var t = ht[e] = {};
                return Q.each(e.match(mt) || [], function(e, n) {
                    t[n] = !0
                }),
                t
            }
            function i() {
                Z.removeEventListener("DOMContentLoaded", i, !1),
                e.removeEventListener("load", i, !1),
                Q.ready()
            }
            function s() {
                Object.defineProperty(this.cache = {}, 0, {
                    get: function() {
                        return {}
                    }
                }),
                this.expando = Q.expando + s.uid++
            }
            function l(e, t, n) {
                var a;
                if (void 0 === n && 1 === e.nodeType)
                    if (a = "data-" + t.replace(bt, "-$1").toLowerCase(),
                    n = e.getAttribute(a),
                    "string" == typeof n) {
                        try {
                            n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Et.test(n) ? Q.parseJSON(n) : n
                        } catch (o) {}
                        yt.set(e, t, n)
                    } else
                        n = void 0;
                return n
            }
            function c() {
                return !0
            }
            function u() {
                return !1
            }
            function p() {
                try {
                    return Z.activeElement
                } catch (e) {}
            }
            function d(e, t) {
                return Q.nodeName(e, "table") && Q.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
            }
            function m(e) {
                return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
                e
            }
            function h(e) {
                var t = Pt.exec(e.type);
                return t ? e.type = t[1] : e.removeAttribute("type"),
                e
            }
            function f(e, t) {
                for (var n = 0, a = e.length; a > n; n++)
                    vt.set(e[n], "globalEval", !t || vt.get(t[n], "globalEval"))
            }
            function g(e, t) {
                var n, a, o, r, i, s, l, c;
                if (1 === t.nodeType) {
                    if (vt.hasData(e) && (r = vt.access(e),
                    i = vt.set(t, r),
                    c = r.events)) {
                        delete i.handle,
                        i.events = {};
                        for (o in c)
                            for (n = 0,
                            a = c[o].length; a > n; n++)
                                Q.event.add(t, o, c[o][n])
                    }
                    yt.hasData(e) && (s = yt.access(e),
                    l = Q.extend({}, s),
                    yt.set(t, l))
                }
            }
            function v(e, t) {
                var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
                return void 0 === t || t && Q.nodeName(e, t) ? Q.merge([e], n) : n
            }
            function y(e, t) {
                var n = t.nodeName.toLowerCase();
                "input" === n && wt.test(e.type) ? t.checked = e.checked : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
            }
            function E(t, n) {
                var a, o = Q(n.createElement(t)).appendTo(n.body), r = e.getDefaultComputedStyle && (a = e.getDefaultComputedStyle(o[0])) ? a.display : Q.css(o[0], "display");
                return o.detach(),
                r
            }
            function b(e) {
                var t = Z
                  , n = jt[e];
                return n || (n = E(e, t),
                "none" !== n && n || (It = (It || Q("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement),
                t = It[0].contentDocument,
                t.write(),
                t.close(),
                n = E(e, t),
                It.detach()),
                jt[e] = n),
                n
            }
            function N(e, t, n) {
                var a, o, r, i, s = e.style;
                return n = n || Wt(e),
                n && (i = n.getPropertyValue(t) || n[t]),
                n && ("" !== i || Q.contains(e.ownerDocument, e) || (i = Q.style(e, t)),
                Ut.test(i) && Ht.test(t) && (a = s.width,
                o = s.minWidth,
                r = s.maxWidth,
                s.minWidth = s.maxWidth = s.width = i,
                i = n.width,
                s.width = a,
                s.minWidth = o,
                s.maxWidth = r)),
                void 0 !== i ? i + "" : i
            }
            function k(e, t) {
                return {
                    get: function() {
                        return e() ? void delete this.get : (this.get = t).apply(this, arguments)
                    }
                }
            }
            function _(e, t) {
                if (t in e)
                    return t;
                for (var n = t[0].toUpperCase() + t.slice(1), a = t, o = Kt.length; o--; )
                    if (t = Kt[o] + n,
                    t in e)
                        return t;
                return a
            }
            function w(e, t, n) {
                var a = zt.exec(t);
                return a ? Math.max(0, a[1] - (n || 0)) + (a[2] || "px") : t
            }
            function x(e, t, n, a, o) {
                for (var r = n === (a ? "border" : "content") ? 4 : "width" === t ? 1 : 0, i = 0; 4 > r; r += 2)
                    "margin" === n && (i += Q.css(e, n + kt[r], !0, o)),
                    a ? ("content" === n && (i -= Q.css(e, "padding" + kt[r], !0, o)),
                    "margin" !== n && (i -= Q.css(e, "border" + kt[r] + "Width", !0, o))) : (i += Q.css(e, "padding" + kt[r], !0, o),
                    "padding" !== n && (i += Q.css(e, "border" + kt[r] + "Width", !0, o)));
                return i
            }
            function C(e, t, n) {
                var a = !0
                  , o = "width" === t ? e.offsetWidth : e.offsetHeight
                  , r = Wt(e)
                  , i = "border-box" === Q.css(e, "boxSizing", !1, r);
                if (0 >= o || null == o) {
                    if (o = N(e, t, r),
                    (0 > o || null == o) && (o = e.style[t]),
                    Ut.test(o))
                        return o;
                    a = i && (X.boxSizingReliable() || o === e.style[t]),
                    o = parseFloat(o) || 0
                }
                return o + x(e, t, n || (i ? "border" : "content"), a, r) + "px"
            }
            function T(e, t) {
                for (var n, a, o, r = [], i = 0, s = e.length; s > i; i++)
                    a = e[i],
                    a.style && (r[i] = vt.get(a, "olddisplay"),
                    n = a.style.display,
                    t ? (r[i] || "none" !== n || (a.style.display = ""),
                    "" === a.style.display && _t(a) && (r[i] = vt.access(a, "olddisplay", b(a.nodeName)))) : (o = _t(a),
                    "none" === n && o || vt.set(a, "olddisplay", o ? n : Q.css(a, "display"))));
                for (i = 0; s > i; i++)
                    a = e[i],
                    a.style && (t && "none" !== a.style.display && "" !== a.style.display || (a.style.display = t ? r[i] || "" : "none"));
                return e
            }
            function D(e, t, n, a, o) {
                return new D.prototype.init(e,t,n,a,o)
            }
            function M() {
                return setTimeout(function() {
                    Xt = void 0
                }),
                Xt = Q.now()
            }
            function S(e, t) {
                var n, a = 0, o = {
                    height: e
                };
                for (t = t ? 1 : 0; 4 > a; a += 2 - t)
                    n = kt[a],
                    o["margin" + n] = o["padding" + n] = e;
                return t && (o.opacity = o.width = e),
                o
            }
            function O(e, t, n) {
                for (var a, o = (nn[t] || []).concat(nn["*"]), r = 0, i = o.length; i > r; r++)
                    if (a = o[r].call(n, t, e))
                        return a
            }
            function A(e, t, n) {
                var a, o, r, i, s, l, c, u, p = this, d = {}, m = e.style, h = e.nodeType && _t(e), f = vt.get(e, "fxshow");
                n.queue || (s = Q._queueHooks(e, "fx"),
                null == s.unqueued && (s.unqueued = 0,
                l = s.empty.fire,
                s.empty.fire = function() {
                    s.unqueued || l()
                }
                ),
                s.unqueued++,
                p.always(function() {
                    p.always(function() {
                        s.unqueued--,
                        Q.queue(e, "fx").length || s.empty.fire()
                    })
                })),
                1 === e.nodeType && ("height"in t || "width"in t) && (n.overflow = [m.overflow, m.overflowX, m.overflowY],
                c = Q.css(e, "display"),
                u = "none" === c ? vt.get(e, "olddisplay") || b(e.nodeName) : c,
                "inline" === u && "none" === Q.css(e, "float") && (m.display = "inline-block")),
                n.overflow && (m.overflow = "hidden",
                p.always(function() {
                    m.overflow = n.overflow[0],
                    m.overflowX = n.overflow[1],
                    m.overflowY = n.overflow[2]
                }));
                for (a in t)
                    if (o = t[a],
                    Jt.exec(o)) {
                        if (delete t[a],
                        r = r || "toggle" === o,
                        o === (h ? "hide" : "show")) {
                            if ("show" !== o || !f || void 0 === f[a])
                                continue;
                            h = !0
                        }
                        d[a] = f && f[a] || Q.style(e, a)
                    } else
                        c = void 0;
                if (Q.isEmptyObject(d))
                    "inline" === ("none" === c ? b(e.nodeName) : c) && (m.display = c);
                else {
                    f ? "hidden"in f && (h = f.hidden) : f = vt.access(e, "fxshow", {}),
                    r && (f.hidden = !h),
                    h ? Q(e).show() : p.done(function() {
                        Q(e).hide()
                    }),
                    p.done(function() {
                        var t;
                        vt.remove(e, "fxshow");
                        for (t in d)
                            Q.style(e, t, d[t])
                    });
                    for (a in d)
                        i = O(h ? f[a] : 0, a, p),
                        a in f || (f[a] = i.start,
                        h && (i.end = i.start,
                        i.start = "width" === a || "height" === a ? 1 : 0))
                }
            }
            function L(e, t) {
                var n, a, o, r, i;
                for (n in e)
                    if (a = Q.camelCase(n),
                    o = t[a],
                    r = e[n],
                    Q.isArray(r) && (o = r[1],
                    r = e[n] = r[0]),
                    n !== a && (e[a] = r,
                    delete e[n]),
                    i = Q.cssHooks[a],
                    i && "expand"in i) {
                        r = i.expand(r),
                        delete e[a];
                        for (n in r)
                            n in e || (e[n] = r[n],
                            t[n] = o)
                    } else
                        t[a] = o
            }
            function B(e, t, n) {
                var a, o, r = 0, i = tn.length, s = Q.Deferred().always(function() {
                    delete l.elem
                }), l = function() {
                    if (o)
                        return !1;
                    for (var t = Xt || M(), n = Math.max(0, c.startTime + c.duration - t), a = n / c.duration || 0, r = 1 - a, i = 0, l = c.tweens.length; l > i; i++)
                        c.tweens[i].run(r);
                    return s.notifyWith(e, [c, r, n]),
                    1 > r && l ? n : (s.resolveWith(e, [c]),
                    !1)
                }, c = s.promise({
                    elem: e,
                    props: Q.extend({}, t),
                    opts: Q.extend(!0, {
                        specialEasing: {}
                    }, n),
                    originalProperties: t,
                    originalOptions: n,
                    startTime: Xt || M(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function(t, n) {
                        var a = Q.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                        return c.tweens.push(a),
                        a
                    },
                    stop: function(t) {
                        var n = 0
                          , a = t ? c.tweens.length : 0;
                        if (o)
                            return this;
                        for (o = !0; a > n; n++)
                            c.tweens[n].run(1);
                        return t ? s.resolveWith(e, [c, t]) : s.rejectWith(e, [c, t]),
                        this
                    }
                }), u = c.props;
                for (L(u, c.opts.specialEasing); i > r; r++)
                    if (a = tn[r].call(c, e, u, c.opts))
                        return a;
                return Q.map(u, O, c),
                Q.isFunction(c.opts.start) && c.opts.start.call(e, c),
                Q.fx.timer(Q.extend(l, {
                    elem: e,
                    anim: c,
                    queue: c.opts.queue
                })),
                c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
            }
            function G(e) {
                return function(t, n) {
                    "string" != typeof t && (n = t,
                    t = "*");
                    var a, o = 0, r = t.toLowerCase().match(mt) || [];
                    if (Q.isFunction(n))
                        for (; a = r[o++]; )
                            "+" === a[0] ? (a = a.slice(1) || "*",
                            (e[a] = e[a] || []).unshift(n)) : (e[a] = e[a] || []).push(n)
                }
            }
            function P(e, t, n, a) {
                function o(s) {
                    var l;
                    return r[s] = !0,
                    Q.each(e[s] || [], function(e, s) {
                        var c = s(t, n, a);
                        return "string" != typeof c || i || r[c] ? i ? !(l = c) : void 0 : (t.dataTypes.unshift(c),
                        o(c),
                        !1)
                    }),
                    l
                }
                var r = {}
                  , i = e === bn;
                return o(t.dataTypes[0]) || !r["*"] && o("*")
            }
            function R(e, t) {
                var n, a, o = Q.ajaxSettings.flatOptions || {};
                for (n in t)
                    void 0 !== t[n] && ((o[n] ? e : a || (a = {}))[n] = t[n]);
                return a && Q.extend(!0, e, a),
                e
            }
            function F(e, t, n) {
                for (var a, o, r, i, s = e.contents, l = e.dataTypes; "*" === l[0]; )
                    l.shift(),
                    void 0 === a && (a = e.mimeType || t.getResponseHeader("Content-Type"));
                if (a)
                    for (o in s)
                        if (s[o] && s[o].test(a)) {
                            l.unshift(o);
                            break
                        }
                if (l[0]in n)
                    r = l[0];
                else {
                    for (o in n) {
                        if (!l[0] || e.converters[o + " " + l[0]]) {
                            r = o;
                            break
                        }
                        i || (i = o)
                    }
                    r = r || i
                }
                return r ? (r !== l[0] && l.unshift(r),
                n[r]) : void 0
            }
            function I(e, t, n, a) {
                var o, r, i, s, l, c = {}, u = e.dataTypes.slice();
                if (u[1])
                    for (i in e.converters)
                        c[i.toLowerCase()] = e.converters[i];
                for (r = u.shift(); r; )
                    if (e.responseFields[r] && (n[e.responseFields[r]] = t),
                    !l && a && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                    l = r,
                    r = u.shift())
                        if ("*" === r)
                            r = l;
                        else if ("*" !== l && l !== r) {
                            if (i = c[l + " " + r] || c["* " + r],
                            !i)
                                for (o in c)
                                    if (s = o.split(" "),
                                    s[1] === r && (i = c[l + " " + s[0]] || c["* " + s[0]])) {
                                        i === !0 ? i = c[o] : c[o] !== !0 && (r = s[0],
                                        u.unshift(s[1]));
                                        break
                                    }
                            if (i !== !0)
                                if (i && e["throws"])
                                    t = i(t);
                                else
                                    try {
                                        t = i(t)
                                    } catch (p) {
                                        return {
                                            state: "parsererror",
                                            error: i ? p : "No conversion from " + l + " to " + r
                                        }
                                    }
                        }
                return {
                    state: "success",
                    data: t
                }
            }
            function j(e, t, n, a) {
                var o;
                if (Q.isArray(t))
                    Q.each(t, function(t, o) {
                        n || xn.test(e) ? a(e, o) : j(e + "[" + ("object" == typeof o ? t : "") + "]", o, n, a)
                    });
                else if (n || "object" !== Q.type(t))
                    a(e, t);
                else
                    for (o in t)
                        j(e + "[" + o + "]", t[o], n, a)
            }
            function H(e) {
                return Q.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
            }
            var U = []
              , W = U.slice
              , q = U.concat
              , z = U.push
              , V = U.indexOf
              , $ = {}
              , Y = $.toString
              , K = $.hasOwnProperty
              , X = {}
              , Z = e.document
              , J = "2.1.4"
              , Q = function(e, t) {
                return new Q.fn.init(e,t)
            }
              , et = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
              , tt = /^-ms-/
              , nt = /-([\da-z])/gi
              , at = function(e, t) {
                return t.toUpperCase()
            };
            Q.fn = Q.prototype = {
                jquery: J,
                constructor: Q,
                selector: "",
                length: 0,
                toArray: function() {
                    return W.call(this)
                },
                get: function(e) {
                    return null != e ? 0 > e ? this[e + this.length] : this[e] : W.call(this)
                },
                pushStack: function(e) {
                    var t = Q.merge(this.constructor(), e);
                    return t.prevObject = this,
                    t.context = this.context,
                    t
                },
                each: function(e, t) {
                    return Q.each(this, e, t)
                },
                map: function(e) {
                    return this.pushStack(Q.map(this, function(t, n) {
                        return e.call(t, n, t)
                    }))
                },
                slice: function() {
                    return this.pushStack(W.apply(this, arguments))
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                eq: function(e) {
                    var t = this.length
                      , n = +e + (0 > e ? t : 0);
                    return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
                },
                end: function() {
                    return this.prevObject || this.constructor(null)
                },
                push: z,
                sort: U.sort,
                splice: U.splice
            },
            Q.extend = Q.fn.extend = function() {
                var e, t, n, a, o, r, i = arguments[0] || {}, s = 1, l = arguments.length, c = !1;
                for ("boolean" == typeof i && (c = i,
                i = arguments[s] || {},
                s++),
                "object" == typeof i || Q.isFunction(i) || (i = {}),
                s === l && (i = this,
                s--); l > s; s++)
                    if (null != (e = arguments[s]))
                        for (t in e)
                            n = i[t],
                            a = e[t],
                            i !== a && (c && a && (Q.isPlainObject(a) || (o = Q.isArray(a))) ? (o ? (o = !1,
                            r = n && Q.isArray(n) ? n : []) : r = n && Q.isPlainObject(n) ? n : {},
                            i[t] = Q.extend(c, r, a)) : void 0 !== a && (i[t] = a));
                return i
            }
            ,
            Q.extend({
                expando: "jQuery" + (J + Math.random()).replace(/\D/g, ""),
                isReady: !0,
                error: function(e) {
                    throw new Error(e)
                },
                noop: function() {},
                isFunction: function(e) {
                    return "function" === Q.type(e)
                },
                isArray: Array.isArray,
                isWindow: function(e) {
                    return null != e && e === e.window
                },
                isNumeric: function(e) {
                    return !Q.isArray(e) && e - parseFloat(e) + 1 >= 0
                },
                isPlainObject: function(e) {
                    return "object" !== Q.type(e) || e.nodeType || Q.isWindow(e) ? !1 : e.constructor && !K.call(e.constructor.prototype, "isPrototypeOf") ? !1 : !0
                },
                isEmptyObject: function(e) {
                    var t;
                    for (t in e)
                        return !1;
                    return !0
                },
                type: function(e) {
                    return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? $[Y.call(e)] || "object" : typeof e
                },
                globalEval: function(e) {
                    var t, n = eval;
                    e = Q.trim(e),
                    e && (1 === e.indexOf("use strict") ? (t = Z.createElement("script"),
                    t.text = e,
                    Z.head.appendChild(t).parentNode.removeChild(t)) : n(e))
                },
                camelCase: function(e) {
                    return e.replace(tt, "ms-").replace(nt, at)
                },
                nodeName: function(e, t) {
                    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
                },
                each: function(e, t, a) {
                    var o, r = 0, i = e.length, s = n(e);
                    if (a) {
                        if (s)
                            for (; i > r && (o = t.apply(e[r], a),
                            o !== !1); r++)
                                ;
                        else
                            for (r in e)
                                if (o = t.apply(e[r], a),
                                o === !1)
                                    break
                    } else if (s)
                        for (; i > r && (o = t.call(e[r], r, e[r]),
                        o !== !1); r++)
                            ;
                    else
                        for (r in e)
                            if (o = t.call(e[r], r, e[r]),
                            o === !1)
                                break;
                    return e
                },
                trim: function(e) {
                    return null == e ? "" : (e + "").replace(et, "")
                },
                makeArray: function(e, t) {
                    var a = t || [];
                    return null != e && (n(Object(e)) ? Q.merge(a, "string" == typeof e ? [e] : e) : z.call(a, e)),
                    a
                },
                inArray: function(e, t, n) {
                    return null == t ? -1 : V.call(t, e, n)
                },
                merge: function(e, t) {
                    for (var n = +t.length, a = 0, o = e.length; n > a; a++)
                        e[o++] = t[a];
                    return e.length = o,
                    e
                },
                grep: function(e, t, n) {
                    for (var a, o = [], r = 0, i = e.length, s = !n; i > r; r++)
                        a = !t(e[r], r),
                        a !== s && o.push(e[r]);
                    return o
                },
                map: function(e, t, a) {
                    var o, r = 0, i = e.length, s = n(e), l = [];
                    if (s)
                        for (; i > r; r++)
                            o = t(e[r], r, a),
                            null != o && l.push(o);
                    else
                        for (r in e)
                            o = t(e[r], r, a),
                            null != o && l.push(o);
                    return q.apply([], l)
                },
                guid: 1,
                proxy: function(e, t) {
                    var n, a, o;
                    return "string" == typeof t && (n = e[t],
                    t = e,
                    e = n),
                    Q.isFunction(e) ? (a = W.call(arguments, 2),
                    o = function() {
                        return e.apply(t || this, a.concat(W.call(arguments)))
                    }
                    ,
                    o.guid = e.guid = e.guid || Q.guid++,
                    o) : void 0
                },
                now: Date.now,
                support: X
            }),
            Q.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
                $["[object " + t + "]"] = t.toLowerCase()
            });
            var ot = function(e) {
                function t(e, t, n, a) {
                    var o, r, i, s, l, c, p, m, h, f;
                    if ((t ? t.ownerDocument || t : j) !== A && O(t),
                    t = t || A,
                    n = n || [],
                    s = t.nodeType,
                    "string" != typeof e || !e || 1 !== s && 9 !== s && 11 !== s)
                        return n;
                    if (!a && B) {
                        if (11 !== s && (o = yt.exec(e)))
                            if (i = o[1]) {
                                if (9 === s) {
                                    if (r = t.getElementById(i),
                                    !r || !r.parentNode)
                                        return n;
                                    if (r.id === i)
                                        return n.push(r),
                                        n
                                } else if (t.ownerDocument && (r = t.ownerDocument.getElementById(i)) && F(t, r) && r.id === i)
                                    return n.push(r),
                                    n
                            } else {
                                if (o[2])
                                    return J.apply(n, t.getElementsByTagName(e)),
                                    n;
                                if ((i = o[3]) && N.getElementsByClassName)
                                    return J.apply(n, t.getElementsByClassName(i)),
                                    n
                            }
                        if (N.qsa && (!G || !G.test(e))) {
                            if (m = p = I,
                            h = t,
                            f = 1 !== s && e,
                            1 === s && "object" !== t.nodeName.toLowerCase()) {
                                for (c = x(e),
                                (p = t.getAttribute("id")) ? m = p.replace(bt, "\\$&") : t.setAttribute("id", m),
                                m = "[id='" + m + "'] ",
                                l = c.length; l--; )
                                    c[l] = m + d(c[l]);
                                h = Et.test(e) && u(t.parentNode) || t,
                                f = c.join(",")
                            }
                            if (f)
                                try {
                                    return J.apply(n, h.querySelectorAll(f)),
                                    n
                                } catch (g) {} finally {
                                    p || t.removeAttribute("id")
                                }
                        }
                    }
                    return T(e.replace(lt, "$1"), t, n, a)
                }
                function n() {
                    function e(n, a) {
                        return t.push(n + " ") > k.cacheLength && delete e[t.shift()],
                        e[n + " "] = a
                    }
                    var t = [];
                    return e
                }
                function a(e) {
                    return e[I] = !0,
                    e
                }
                function o(e) {
                    var t = A.createElement("div");
                    try {
                        return !!e(t)
                    } catch (n) {
                        return !1
                    } finally {
                        t.parentNode && t.parentNode.removeChild(t),
                        t = null
                    }
                }
                function r(e, t) {
                    for (var n = e.split("|"), a = e.length; a--; )
                        k.attrHandle[n[a]] = t
                }
                function i(e, t) {
                    var n = t && e
                      , a = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || $) - (~e.sourceIndex || $);
                    if (a)
                        return a;
                    if (n)
                        for (; n = n.nextSibling; )
                            if (n === t)
                                return -1;
                    return e ? 1 : -1
                }
                function s(e) {
                    return function(t) {
                        var n = t.nodeName.toLowerCase();
                        return "input" === n && t.type === e
                    }
                }
                function l(e) {
                    return function(t) {
                        var n = t.nodeName.toLowerCase();
                        return ("input" === n || "button" === n) && t.type === e
                    }
                }
                function c(e) {
                    return a(function(t) {
                        return t = +t,
                        a(function(n, a) {
                            for (var o, r = e([], n.length, t), i = r.length; i--; )
                                n[o = r[i]] && (n[o] = !(a[o] = n[o]))
                        })
                    })
                }
                function u(e) {
                    return e && "undefined" != typeof e.getElementsByTagName && e
                }
                function p() {}
                function d(e) {
                    for (var t = 0, n = e.length, a = ""; n > t; t++)
                        a += e[t].value;
                    return a
                }
                function m(e, t, n) {
                    var a = t.dir
                      , o = n && "parentNode" === a
                      , r = U++;
                    return t.first ? function(t, n, r) {
                        for (; t = t[a]; )
                            if (1 === t.nodeType || o)
                                return e(t, n, r)
                    }
                    : function(t, n, i) {
                        var s, l, c = [H, r];
                        if (i) {
                            for (; t = t[a]; )
                                if ((1 === t.nodeType || o) && e(t, n, i))
                                    return !0
                        } else
                            for (; t = t[a]; )
                                if (1 === t.nodeType || o) {
                                    if (l = t[I] || (t[I] = {}),
                                    (s = l[a]) && s[0] === H && s[1] === r)
                                        return c[2] = s[2];
                                    if (l[a] = c,
                                    c[2] = e(t, n, i))
                                        return !0
                                }
                    }
                }
                function h(e) {
                    return e.length > 1 ? function(t, n, a) {
                        for (var o = e.length; o--; )
                            if (!e[o](t, n, a))
                                return !1;
                        return !0
                    }
                    : e[0]
                }
                function f(e, n, a) {
                    for (var o = 0, r = n.length; r > o; o++)
                        t(e, n[o], a);
                    return a
                }
                function g(e, t, n, a, o) {
                    for (var r, i = [], s = 0, l = e.length, c = null != t; l > s; s++)
                        (r = e[s]) && (!n || n(r, a, o)) && (i.push(r),
                        c && t.push(s));
                    return i
                }
                function v(e, t, n, o, r, i) {
                    return o && !o[I] && (o = v(o)),
                    r && !r[I] && (r = v(r, i)),
                    a(function(a, i, s, l) {
                        var c, u, p, d = [], m = [], h = i.length, v = a || f(t || "*", s.nodeType ? [s] : s, []), y = !e || !a && t ? v : g(v, d, e, s, l), E = n ? r || (a ? e : h || o) ? [] : i : y;
                        if (n && n(y, E, s, l),
                        o)
                            for (c = g(E, m),
                            o(c, [], s, l),
                            u = c.length; u--; )
                                (p = c[u]) && (E[m[u]] = !(y[m[u]] = p));
                        if (a) {
                            if (r || e) {
                                if (r) {
                                    for (c = [],
                                    u = E.length; u--; )
                                        (p = E[u]) && c.push(y[u] = p);
                                    r(null, E = [], c, l)
                                }
                                for (u = E.length; u--; )
                                    (p = E[u]) && (c = r ? et(a, p) : d[u]) > -1 && (a[c] = !(i[c] = p))
                            }
                        } else
                            E = g(E === i ? E.splice(h, E.length) : E),
                            r ? r(null, i, E, l) : J.apply(i, E)
                    })
                }
                function y(e) {
                    for (var t, n, a, o = e.length, r = k.relative[e[0].type], i = r || k.relative[" "], s = r ? 1 : 0, l = m(function(e) {
                        return e === t
                    }, i, !0), c = m(function(e) {
                        return et(t, e) > -1
                    }, i, !0), u = [function(e, n, a) {
                        var o = !r && (a || n !== D) || ((t = n).nodeType ? l(e, n, a) : c(e, n, a));
                        return t = null,
                        o
                    }
                    ]; o > s; s++)
                        if (n = k.relative[e[s].type])
                            u = [m(h(u), n)];
                        else {
                            if (n = k.filter[e[s].type].apply(null, e[s].matches),
                            n[I]) {
                                for (a = ++s; o > a && !k.relative[e[a].type]; a++)
                                    ;
                                return v(s > 1 && h(u), s > 1 && d(e.slice(0, s - 1).concat({
                                    value: " " === e[s - 2].type ? "*" : ""
                                })).replace(lt, "$1"), n, a > s && y(e.slice(s, a)), o > a && y(e = e.slice(a)), o > a && d(e))
                            }
                            u.push(n)
                        }
                    return h(u)
                }
                function E(e, n) {
                    var o = n.length > 0
                      , r = e.length > 0
                      , i = function(a, i, s, l, c) {
                        var u, p, d, m = 0, h = "0", f = a && [], v = [], y = D, E = a || r && k.find.TAG("*", c), b = H += null == y ? 1 : Math.random() || .1, N = E.length;
                        for (c && (D = i !== A && i); h !== N && null != (u = E[h]); h++) {
                            if (r && u) {
                                for (p = 0; d = e[p++]; )
                                    if (d(u, i, s)) {
                                        l.push(u);
                                        break
                                    }
                                c && (H = b)
                            }
                            o && ((u = !d && u) && m--,
                            a && f.push(u))
                        }
                        if (m += h,
                        o && h !== m) {
                            for (p = 0; d = n[p++]; )
                                d(f, v, i, s);
                            if (a) {
                                if (m > 0)
                                    for (; h--; )
                                        f[h] || v[h] || (v[h] = X.call(l));
                                v = g(v)
                            }
                            J.apply(l, v),
                            c && !a && v.length > 0 && m + n.length > 1 && t.uniqueSort(l)
                        }
                        return c && (H = b,
                        D = y),
                        f
                    };
                    return o ? a(i) : i
                }
                var b, N, k, _, w, x, C, T, D, M, S, O, A, L, B, G, P, R, F, I = "sizzle" + 1 * new Date, j = e.document, H = 0, U = 0, W = n(), q = n(), z = n(), V = function(e, t) {
                    return e === t && (S = !0),
                    0
                }, $ = 1 << 31, Y = {}.hasOwnProperty, K = [], X = K.pop, Z = K.push, J = K.push, Q = K.slice, et = function(e, t) {
                    for (var n = 0, a = e.length; a > n; n++)
                        if (e[n] === t)
                            return n;
                    return -1
                }, tt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", nt = "[\\x20\\t\\r\\n\\f]", at = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", ot = at.replace("w", "w#"), rt = "\\[" + nt + "*(" + at + ")(?:" + nt + "*([*^$|!~]?=)" + nt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ot + "))|)" + nt + "*\\]", it = ":(" + at + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + rt + ")*)|.*)\\)|)", st = new RegExp(nt + "+","g"), lt = new RegExp("^" + nt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + nt + "+$","g"), ct = new RegExp("^" + nt + "*," + nt + "*"), ut = new RegExp("^" + nt + "*([>+~]|" + nt + ")" + nt + "*"), pt = new RegExp("=" + nt + "*([^\\]'\"]*?)" + nt + "*\\]","g"), dt = new RegExp(it), mt = new RegExp("^" + ot + "$"), ht = {
                    ID: new RegExp("^#(" + at + ")"),
                    CLASS: new RegExp("^\\.(" + at + ")"),
                    TAG: new RegExp("^(" + at.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + rt),
                    PSEUDO: new RegExp("^" + it),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + nt + "*(even|odd|(([+-]|)(\\d*)n|)" + nt + "*(?:([+-]|)" + nt + "*(\\d+)|))" + nt + "*\\)|)","i"),
                    bool: new RegExp("^(?:" + tt + ")$","i"),
                    needsContext: new RegExp("^" + nt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + nt + "*((?:-\\d)?\\d*)" + nt + "*\\)|)(?=[^-]|$)","i")
                }, ft = /^(?:input|select|textarea|button)$/i, gt = /^h\d$/i, vt = /^[^{]+\{\s*\[native \w/, yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Et = /[+~]/, bt = /'|\\/g, Nt = new RegExp("\\\\([\\da-f]{1,6}" + nt + "?|(" + nt + ")|.)","ig"), kt = function(e, t, n) {
                    var a = "0x" + t - 65536;
                    return a !== a || n ? t : 0 > a ? String.fromCharCode(a + 65536) : String.fromCharCode(a >> 10 | 55296, 1023 & a | 56320)
                }, _t = function() {
                    O()
                };
                try {
                    J.apply(K = Q.call(j.childNodes), j.childNodes),
                    K[j.childNodes.length].nodeType
                } catch (wt) {
                    J = {
                        apply: K.length ? function(e, t) {
                            Z.apply(e, Q.call(t))
                        }
                        : function(e, t) {
                            for (var n = e.length, a = 0; e[n++] = t[a++]; )
                                ;
                            e.length = n - 1
                        }
                    }
                }
                N = t.support = {},
                w = t.isXML = function(e) {
                    var t = e && (e.ownerDocument || e).documentElement;
                    return t ? "HTML" !== t.nodeName : !1
                }
                ,
                O = t.setDocument = function(e) {
                    var t, n, a = e ? e.ownerDocument || e : j;
                    return a !== A && 9 === a.nodeType && a.documentElement ? (A = a,
                    L = a.documentElement,
                    n = a.defaultView,
                    n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", _t, !1) : n.attachEvent && n.attachEvent("onunload", _t)),
                    B = !w(a),
                    N.attributes = o(function(e) {
                        return e.className = "i",
                        !e.getAttribute("className")
                    }),
                    N.getElementsByTagName = o(function(e) {
                        return e.appendChild(a.createComment("")),
                        !e.getElementsByTagName("*").length
                    }),
                    N.getElementsByClassName = vt.test(a.getElementsByClassName),
                    N.getById = o(function(e) {
                        return L.appendChild(e).id = I,
                        !a.getElementsByName || !a.getElementsByName(I).length
                    }),
                    N.getById ? (k.find.ID = function(e, t) {
                        if ("undefined" != typeof t.getElementById && B) {
                            var n = t.getElementById(e);
                            return n && n.parentNode ? [n] : []
                        }
                    }
                    ,
                    k.filter.ID = function(e) {
                        var t = e.replace(Nt, kt);
                        return function(e) {
                            return e.getAttribute("id") === t
                        }
                    }
                    ) : (delete k.find.ID,
                    k.filter.ID = function(e) {
                        var t = e.replace(Nt, kt);
                        return function(e) {
                            var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                            return n && n.value === t
                        }
                    }
                    ),
                    k.find.TAG = N.getElementsByTagName ? function(e, t) {
                        return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : N.qsa ? t.querySelectorAll(e) : void 0
                    }
                    : function(e, t) {
                        var n, a = [], o = 0, r = t.getElementsByTagName(e);
                        if ("*" === e) {
                            for (; n = r[o++]; )
                                1 === n.nodeType && a.push(n);
                            return a
                        }
                        return r
                    }
                    ,
                    k.find.CLASS = N.getElementsByClassName && function(e, t) {
                        return B ? t.getElementsByClassName(e) : void 0
                    }
                    ,
                    P = [],
                    G = [],
                    (N.qsa = vt.test(a.querySelectorAll)) && (o(function(e) {
                        L.appendChild(e).innerHTML = "<a id='" + I + "'></a><select id='" + I + "-\f]' msallowcapture=''><option selected=''></option></select>",
                        e.querySelectorAll("[msallowcapture^='']").length && G.push("[*^$]=" + nt + "*(?:''|\"\")"),
                        e.querySelectorAll("[selected]").length || G.push("\\[" + nt + "*(?:value|" + tt + ")"),
                        e.querySelectorAll("[id~=" + I + "-]").length || G.push("~="),
                        e.querySelectorAll(":checked").length || G.push(":checked"),
                        e.querySelectorAll("a#" + I + "+*").length || G.push(".#.+[+~]")
                    }),
                    o(function(e) {
                        var t = a.createElement("input");
                        t.setAttribute("type", "hidden"),
                        e.appendChild(t).setAttribute("name", "D"),
                        e.querySelectorAll("[name=d]").length && G.push("name" + nt + "*[*^$|!~]?="),
                        e.querySelectorAll(":enabled").length || G.push(":enabled", ":disabled"),
                        e.querySelectorAll("*,:x"),
                        G.push(",.*:")
                    })),
                    (N.matchesSelector = vt.test(R = L.matches || L.webkitMatchesSelector || L.mozMatchesSelector || L.oMatchesSelector || L.msMatchesSelector)) && o(function(e) {
                        N.disconnectedMatch = R.call(e, "div"),
                        R.call(e, "[s!='']:x"),
                        P.push("!=", it)
                    }),
                    G = G.length && new RegExp(G.join("|")),
                    P = P.length && new RegExp(P.join("|")),
                    t = vt.test(L.compareDocumentPosition),
                    F = t || vt.test(L.contains) ? function(e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e
                          , a = t && t.parentNode;
                        return e === a || !(!a || 1 !== a.nodeType || !(n.contains ? n.contains(a) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(a)))
                    }
                    : function(e, t) {
                        if (t)
                            for (; t = t.parentNode; )
                                if (t === e)
                                    return !0;
                        return !1
                    }
                    ,
                    V = t ? function(e, t) {
                        if (e === t)
                            return S = !0,
                            0;
                        var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                        return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1,
                        1 & n || !N.sortDetached && t.compareDocumentPosition(e) === n ? e === a || e.ownerDocument === j && F(j, e) ? -1 : t === a || t.ownerDocument === j && F(j, t) ? 1 : M ? et(M, e) - et(M, t) : 0 : 4 & n ? -1 : 1)
                    }
                    : function(e, t) {
                        if (e === t)
                            return S = !0,
                            0;
                        var n, o = 0, r = e.parentNode, s = t.parentNode, l = [e], c = [t];
                        if (!r || !s)
                            return e === a ? -1 : t === a ? 1 : r ? -1 : s ? 1 : M ? et(M, e) - et(M, t) : 0;
                        if (r === s)
                            return i(e, t);
                        for (n = e; n = n.parentNode; )
                            l.unshift(n);
                        for (n = t; n = n.parentNode; )
                            c.unshift(n);
                        for (; l[o] === c[o]; )
                            o++;
                        return o ? i(l[o], c[o]) : l[o] === j ? -1 : c[o] === j ? 1 : 0
                    }
                    ,
                    a) : A
                }
                ,
                t.matches = function(e, n) {
                    return t(e, null, null, n)
                }
                ,
                t.matchesSelector = function(e, n) {
                    if ((e.ownerDocument || e) !== A && O(e),
                    n = n.replace(pt, "='$1']"),
                    !(!N.matchesSelector || !B || P && P.test(n) || G && G.test(n)))
                        try {
                            var a = R.call(e, n);
                            if (a || N.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                                return a
                        } catch (o) {}
                    return t(n, A, null, [e]).length > 0
                }
                ,
                t.contains = function(e, t) {
                    return (e.ownerDocument || e) !== A && O(e),
                    F(e, t)
                }
                ,
                t.attr = function(e, t) {
                    (e.ownerDocument || e) !== A && O(e);
                    var n = k.attrHandle[t.toLowerCase()]
                      , a = n && Y.call(k.attrHandle, t.toLowerCase()) ? n(e, t, !B) : void 0;
                    return void 0 !== a ? a : N.attributes || !B ? e.getAttribute(t) : (a = e.getAttributeNode(t)) && a.specified ? a.value : null
                }
                ,
                t.error = function(e) {
                    throw new Error("Syntax error, unrecognized expression: " + e)
                }
                ,
                t.uniqueSort = function(e) {
                    var t, n = [], a = 0, o = 0;
                    if (S = !N.detectDuplicates,
                    M = !N.sortStable && e.slice(0),
                    e.sort(V),
                    S) {
                        for (; t = e[o++]; )
                            t === e[o] && (a = n.push(o));
                        for (; a--; )
                            e.splice(n[a], 1)
                    }
                    return M = null,
                    e
                }
                ,
                _ = t.getText = function(e) {
                    var t, n = "", a = 0, o = e.nodeType;
                    if (o) {
                        if (1 === o || 9 === o || 11 === o) {
                            if ("string" == typeof e.textContent)
                                return e.textContent;
                            for (e = e.firstChild; e; e = e.nextSibling)
                                n += _(e)
                        } else if (3 === o || 4 === o)
                            return e.nodeValue
                    } else
                        for (; t = e[a++]; )
                            n += _(t);
                    return n
                }
                ,
                k = t.selectors = {
                    cacheLength: 50,
                    createPseudo: a,
                    match: ht,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function(e) {
                            return e[1] = e[1].replace(Nt, kt),
                            e[3] = (e[3] || e[4] || e[5] || "").replace(Nt, kt),
                            "~=" === e[2] && (e[3] = " " + e[3] + " "),
                            e.slice(0, 4)
                        },
                        CHILD: function(e) {
                            return e[1] = e[1].toLowerCase(),
                            "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]),
                            e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                            e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]),
                            e
                        },
                        PSEUDO: function(e) {
                            var t, n = !e[6] && e[2];
                            return ht.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && dt.test(n) && (t = x(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                            e[2] = n.slice(0, t)),
                            e.slice(0, 3))
                        }
                    },
                    filter: {
                        TAG: function(e) {
                            var t = e.replace(Nt, kt).toLowerCase();
                            return "*" === e ? function() {
                                return !0
                            }
                            : function(e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                        },
                        CLASS: function(e) {
                            var t = W[e + " "];
                            return t || (t = new RegExp("(^|" + nt + ")" + e + "(" + nt + "|$)")) && W(e, function(e) {
                                return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                            })
                        },
                        ATTR: function(e, n, a) {
                            return function(o) {
                                var r = t.attr(o, e);
                                return null == r ? "!=" === n : n ? (r += "",
                                "=" === n ? r === a : "!=" === n ? r !== a : "^=" === n ? a && 0 === r.indexOf(a) : "*=" === n ? a && r.indexOf(a) > -1 : "$=" === n ? a && r.slice(-a.length) === a : "~=" === n ? (" " + r.replace(st, " ") + " ").indexOf(a) > -1 : "|=" === n ? r === a || r.slice(0, a.length + 1) === a + "-" : !1) : !0
                            }
                        },
                        CHILD: function(e, t, n, a, o) {
                            var r = "nth" !== e.slice(0, 3)
                              , i = "last" !== e.slice(-4)
                              , s = "of-type" === t;
                            return 1 === a && 0 === o ? function(e) {
                                return !!e.parentNode
                            }
                            : function(t, n, l) {
                                var c, u, p, d, m, h, f = r !== i ? "nextSibling" : "previousSibling", g = t.parentNode, v = s && t.nodeName.toLowerCase(), y = !l && !s;
                                if (g) {
                                    if (r) {
                                        for (; f; ) {
                                            for (p = t; p = p[f]; )
                                                if (s ? p.nodeName.toLowerCase() === v : 1 === p.nodeType)
                                                    return !1;
                                            h = f = "only" === e && !h && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (h = [i ? g.firstChild : g.lastChild],
                                    i && y) {
                                        for (u = g[I] || (g[I] = {}),
                                        c = u[e] || [],
                                        m = c[0] === H && c[1],
                                        d = c[0] === H && c[2],
                                        p = m && g.childNodes[m]; p = ++m && p && p[f] || (d = m = 0) || h.pop(); )
                                            if (1 === p.nodeType && ++d && p === t) {
                                                u[e] = [H, m, d];
                                                break
                                            }
                                    } else if (y && (c = (t[I] || (t[I] = {}))[e]) && c[0] === H)
                                        d = c[1];
                                    else
                                        for (; (p = ++m && p && p[f] || (d = m = 0) || h.pop()) && ((s ? p.nodeName.toLowerCase() !== v : 1 !== p.nodeType) || !++d || (y && ((p[I] || (p[I] = {}))[e] = [H, d]),
                                        p !== t)); )
                                            ;
                                    return d -= o,
                                    d === a || d % a === 0 && d / a >= 0
                                }
                            }
                        },
                        PSEUDO: function(e, n) {
                            var o, r = k.pseudos[e] || k.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                            return r[I] ? r(n) : r.length > 1 ? (o = [e, e, "", n],
                            k.setFilters.hasOwnProperty(e.toLowerCase()) ? a(function(e, t) {
                                for (var a, o = r(e, n), i = o.length; i--; )
                                    a = et(e, o[i]),
                                    e[a] = !(t[a] = o[i])
                            }) : function(e) {
                                return r(e, 0, o)
                            }
                            ) : r
                        }
                    },
                    pseudos: {
                        not: a(function(e) {
                            var t = []
                              , n = []
                              , o = C(e.replace(lt, "$1"));
                            return o[I] ? a(function(e, t, n, a) {
                                for (var r, i = o(e, null, a, []), s = e.length; s--; )
                                    (r = i[s]) && (e[s] = !(t[s] = r))
                            }) : function(e, a, r) {
                                return t[0] = e,
                                o(t, null, r, n),
                                t[0] = null,
                                !n.pop()
                            }
                        }),
                        has: a(function(e) {
                            return function(n) {
                                return t(e, n).length > 0
                            }
                        }),
                        contains: a(function(e) {
                            return e = e.replace(Nt, kt),
                            function(t) {
                                return (t.textContent || t.innerText || _(t)).indexOf(e) > -1
                            }
                        }),
                        lang: a(function(e) {
                            return mt.test(e || "") || t.error("unsupported lang: " + e),
                            e = e.replace(Nt, kt).toLowerCase(),
                            function(t) {
                                var n;
                                do
                                    if (n = B ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                                        return n = n.toLowerCase(),
                                        n === e || 0 === n.indexOf(e + "-");
                                while ((t = t.parentNode) && 1 === t.nodeType);return !1
                            }
                        }),
                        target: function(t) {
                            var n = e.location && e.location.hash;
                            return n && n.slice(1) === t.id
                        },
                        root: function(e) {
                            return e === L
                        },
                        focus: function(e) {
                            return e === A.activeElement && (!A.hasFocus || A.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                        },
                        enabled: function(e) {
                            return e.disabled === !1
                        },
                        disabled: function(e) {
                            return e.disabled === !0
                        },
                        checked: function(e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && !!e.checked || "option" === t && !!e.selected
                        },
                        selected: function(e) {
                            return e.parentNode && e.parentNode.selectedIndex,
                            e.selected === !0
                        },
                        empty: function(e) {
                            for (e = e.firstChild; e; e = e.nextSibling)
                                if (e.nodeType < 6)
                                    return !1;
                            return !0
                        },
                        parent: function(e) {
                            return !k.pseudos.empty(e)
                        },
                        header: function(e) {
                            return gt.test(e.nodeName)
                        },
                        input: function(e) {
                            return ft.test(e.nodeName)
                        },
                        button: function(e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && "button" === e.type || "button" === t
                        },
                        text: function(e) {
                            var t;
                            return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                        },
                        first: c(function() {
                            return [0]
                        }),
                        last: c(function(e, t) {
                            return [t - 1]
                        }),
                        eq: c(function(e, t, n) {
                            return [0 > n ? n + t : n]
                        }),
                        even: c(function(e, t) {
                            for (var n = 0; t > n; n += 2)
                                e.push(n);
                            return e
                        }),
                        odd: c(function(e, t) {
                            for (var n = 1; t > n; n += 2)
                                e.push(n);
                            return e
                        }),
                        lt: c(function(e, t, n) {
                            for (var a = 0 > n ? n + t : n; --a >= 0; )
                                e.push(a);
                            return e
                        }),
                        gt: c(function(e, t, n) {
                            for (var a = 0 > n ? n + t : n; ++a < t; )
                                e.push(a);
                            return e
                        })
                    }
                },
                k.pseudos.nth = k.pseudos.eq;
                for (b in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                })
                    k.pseudos[b] = s(b);
                for (b in {
                    submit: !0,
                    reset: !0
                })
                    k.pseudos[b] = l(b);
                return p.prototype = k.filters = k.pseudos,
                k.setFilters = new p,
                x = t.tokenize = function(e, n) {
                    var a, o, r, i, s, l, c, u = q[e + " "];
                    if (u)
                        return n ? 0 : u.slice(0);
                    for (s = e,
                    l = [],
                    c = k.preFilter; s; ) {
                        (!a || (o = ct.exec(s))) && (o && (s = s.slice(o[0].length) || s),
                        l.push(r = [])),
                        a = !1,
                        (o = ut.exec(s)) && (a = o.shift(),
                        r.push({
                            value: a,
                            type: o[0].replace(lt, " ")
                        }),
                        s = s.slice(a.length));
                        for (i in k.filter)
                            !(o = ht[i].exec(s)) || c[i] && !(o = c[i](o)) || (a = o.shift(),
                            r.push({
                                value: a,
                                type: i,
                                matches: o
                            }),
                            s = s.slice(a.length));
                        if (!a)
                            break
                    }
                    return n ? s.length : s ? t.error(e) : q(e, l).slice(0)
                }
                ,
                C = t.compile = function(e, t) {
                    var n, a = [], o = [], r = z[e + " "];
                    if (!r) {
                        for (t || (t = x(e)),
                        n = t.length; n--; )
                            r = y(t[n]),
                            r[I] ? a.push(r) : o.push(r);
                        r = z(e, E(o, a)),
                        r.selector = e
                    }
                    return r
                }
                ,
                T = t.select = function(e, t, n, a) {
                    var o, r, i, s, l, c = "function" == typeof e && e, p = !a && x(e = c.selector || e);
                    if (n = n || [],
                    1 === p.length) {
                        if (r = p[0] = p[0].slice(0),
                        r.length > 2 && "ID" === (i = r[0]).type && N.getById && 9 === t.nodeType && B && k.relative[r[1].type]) {
                            if (t = (k.find.ID(i.matches[0].replace(Nt, kt), t) || [])[0],
                            !t)
                                return n;
                            c && (t = t.parentNode),
                            e = e.slice(r.shift().value.length)
                        }
                        for (o = ht.needsContext.test(e) ? 0 : r.length; o-- && (i = r[o],
                        !k.relative[s = i.type]); )
                            if ((l = k.find[s]) && (a = l(i.matches[0].replace(Nt, kt), Et.test(r[0].type) && u(t.parentNode) || t))) {
                                if (r.splice(o, 1),
                                e = a.length && d(r),
                                !e)
                                    return J.apply(n, a),
                                    n;
                                break
                            }
                    }
                    return (c || C(e, p))(a, t, !B, n, Et.test(e) && u(t.parentNode) || t),
                    n
                }
                ,
                N.sortStable = I.split("").sort(V).join("") === I,
                N.detectDuplicates = !!S,
                O(),
                N.sortDetached = o(function(e) {
                    return 1 & e.compareDocumentPosition(A.createElement("div"))
                }),
                o(function(e) {
                    return e.innerHTML = "<a href='#'></a>",
                    "#" === e.firstChild.getAttribute("href")
                }) || r("type|href|height|width", function(e, t, n) {
                    return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
                }),
                N.attributes && o(function(e) {
                    return e.innerHTML = "<input/>",
                    e.firstChild.setAttribute("value", ""),
                    "" === e.firstChild.getAttribute("value")
                }) || r("value", function(e, t, n) {
                    return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
                }),
                o(function(e) {
                    return null == e.getAttribute("disabled")
                }) || r(tt, function(e, t, n) {
                    var a;
                    return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (a = e.getAttributeNode(t)) && a.specified ? a.value : null
                }),
                t
            }(e);
            Q.find = ot,
            Q.expr = ot.selectors,
            Q.expr[":"] = Q.expr.pseudos,
            Q.unique = ot.uniqueSort,
            Q.text = ot.getText,
            Q.isXMLDoc = ot.isXML,
            Q.contains = ot.contains;
            var rt = Q.expr.match.needsContext
              , it = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
              , st = /^.[^:#\[\.,]*$/;
            Q.filter = function(e, t, n) {
                var a = t[0];
                return n && (e = ":not(" + e + ")"),
                1 === t.length && 1 === a.nodeType ? Q.find.matchesSelector(a, e) ? [a] : [] : Q.find.matches(e, Q.grep(t, function(e) {
                    return 1 === e.nodeType
                }))
            }
            ,
            Q.fn.extend({
                find: function(e) {
                    var t, n = this.length, a = [], o = this;
                    if ("string" != typeof e)
                        return this.pushStack(Q(e).filter(function() {
                            for (t = 0; n > t; t++)
                                if (Q.contains(o[t], this))
                                    return !0
                        }));
                    for (t = 0; n > t; t++)
                        Q.find(e, o[t], a);
                    return a = this.pushStack(n > 1 ? Q.unique(a) : a),
                    a.selector = this.selector ? this.selector + " " + e : e,
                    a
                },
                filter: function(e) {
                    return this.pushStack(a(this, e || [], !1))
                },
                not: function(e) {
                    return this.pushStack(a(this, e || [], !0))
                },
                is: function(e) {
                    return !!a(this, "string" == typeof e && rt.test(e) ? Q(e) : e || [], !1).length
                }
            });
            var lt, ct = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, ut = Q.fn.init = function(e, t) {
                var n, a;
                if (!e)
                    return this;
                if ("string" == typeof e) {
                    if (n = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : ct.exec(e),
                    !n || !n[1] && t)
                        return !t || t.jquery ? (t || lt).find(e) : this.constructor(t).find(e);
                    if (n[1]) {
                        if (t = t instanceof Q ? t[0] : t,
                        Q.merge(this, Q.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : Z, !0)),
                        it.test(n[1]) && Q.isPlainObject(t))
                            for (n in t)
                                Q.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                        return this
                    }
                    return a = Z.getElementById(n[2]),
                    a && a.parentNode && (this.length = 1,
                    this[0] = a),
                    this.context = Z,
                    this.selector = e,
                    this
                }
                return e.nodeType ? (this.context = this[0] = e,
                this.length = 1,
                this) : Q.isFunction(e) ? "undefined" != typeof lt.ready ? lt.ready(e) : e(Q) : (void 0 !== e.selector && (this.selector = e.selector,
                this.context = e.context),
                Q.makeArray(e, this))
            }
            ;
            ut.prototype = Q.fn,
            lt = Q(Z);
            var pt = /^(?:parents|prev(?:Until|All))/
              , dt = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
            Q.extend({
                dir: function(e, t, n) {
                    for (var a = [], o = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
                        if (1 === e.nodeType) {
                            if (o && Q(e).is(n))
                                break;
                            a.push(e)
                        }
                    return a
                },
                sibling: function(e, t) {
                    for (var n = []; e; e = e.nextSibling)
                        1 === e.nodeType && e !== t && n.push(e);
                    return n
                }
            }),
            Q.fn.extend({
                has: function(e) {
                    var t = Q(e, this)
                      , n = t.length;
                    return this.filter(function() {
                        for (var e = 0; n > e; e++)
                            if (Q.contains(this, t[e]))
                                return !0
                    })
                },
                closest: function(e, t) {
                    for (var n, a = 0, o = this.length, r = [], i = rt.test(e) || "string" != typeof e ? Q(e, t || this.context) : 0; o > a; a++)
                        for (n = this[a]; n && n !== t; n = n.parentNode)
                            if (n.nodeType < 11 && (i ? i.index(n) > -1 : 1 === n.nodeType && Q.find.matchesSelector(n, e))) {
                                r.push(n);
                                break
                            }
                    return this.pushStack(r.length > 1 ? Q.unique(r) : r)
                },
                index: function(e) {
                    return e ? "string" == typeof e ? V.call(Q(e), this[0]) : V.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                },
                add: function(e, t) {
                    return this.pushStack(Q.unique(Q.merge(this.get(), Q(e, t))))
                },
                addBack: function(e) {
                    return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
                }
            }),
            Q.each({
                parent: function(e) {
                    var t = e.parentNode;
                    return t && 11 !== t.nodeType ? t : null
                },
                parents: function(e) {
                    return Q.dir(e, "parentNode")
                },
                parentsUntil: function(e, t, n) {
                    return Q.dir(e, "parentNode", n)
                },
                next: function(e) {
                    return o(e, "nextSibling")
                },
                prev: function(e) {
                    return o(e, "previousSibling")
                },
                nextAll: function(e) {
                    return Q.dir(e, "nextSibling")
                },
                prevAll: function(e) {
                    return Q.dir(e, "previousSibling")
                },
                nextUntil: function(e, t, n) {
                    return Q.dir(e, "nextSibling", n)
                },
                prevUntil: function(e, t, n) {
                    return Q.dir(e, "previousSibling", n)
                },
                siblings: function(e) {
                    return Q.sibling((e.parentNode || {}).firstChild, e)
                },
                children: function(e) {
                    return Q.sibling(e.firstChild)
                },
                contents: function(e) {
                    return e.contentDocument || Q.merge([], e.childNodes)
                }
            }, function(e, t) {
                Q.fn[e] = function(n, a) {
                    var o = Q.map(this, t, n);
                    return "Until" !== e.slice(-5) && (a = n),
                    a && "string" == typeof a && (o = Q.filter(a, o)),
                    this.length > 1 && (dt[e] || Q.unique(o),
                    pt.test(e) && o.reverse()),
                    this.pushStack(o)
                }
            });
            var mt = /\S+/g
              , ht = {};
            Q.Callbacks = function(e) {
                e = "string" == typeof e ? ht[e] || r(e) : Q.extend({}, e);
                var t, n, a, o, i, s, l = [], c = !e.once && [], u = function(r) {
                    for (t = e.memory && r,
                    n = !0,
                    s = o || 0,
                    o = 0,
                    i = l.length,
                    a = !0; l && i > s; s++)
                        if (l[s].apply(r[0], r[1]) === !1 && e.stopOnFalse) {
                            t = !1;
                            break
                        }
                    a = !1,
                    l && (c ? c.length && u(c.shift()) : t ? l = [] : p.disable())
                }, p = {
                    add: function() {
                        if (l) {
                            var n = l.length;
                            !function r(t) {
                                Q.each(t, function(t, n) {
                                    var a = Q.type(n);
                                    "function" === a ? e.unique && p.has(n) || l.push(n) : n && n.length && "string" !== a && r(n)
                                })
                            }(arguments),
                            a ? i = l.length : t && (o = n,
                            u(t))
                        }
                        return this
                    },
                    remove: function() {
                        return l && Q.each(arguments, function(e, t) {
                            for (var n; (n = Q.inArray(t, l, n)) > -1; )
                                l.splice(n, 1),
                                a && (i >= n && i--,
                                s >= n && s--)
                        }),
                        this
                    },
                    has: function(e) {
                        return e ? Q.inArray(e, l) > -1 : !(!l || !l.length)
                    },
                    empty: function() {
                        return l = [],
                        i = 0,
                        this
                    },
                    disable: function() {
                        return l = c = t = void 0,
                        this
                    },
                    disabled: function() {
                        return !l
                    },
                    lock: function() {
                        return c = void 0,
                        t || p.disable(),
                        this
                    },
                    locked: function() {
                        return !c
                    },
                    fireWith: function(e, t) {
                        return !l || n && !c || (t = t || [],
                        t = [e, t.slice ? t.slice() : t],
                        a ? c.push(t) : u(t)),
                        this
                    },
                    fire: function() {
                        return p.fireWith(this, arguments),
                        this
                    },
                    fired: function() {
                        return !!n
                    }
                };
                return p
            }
            ,
            Q.extend({
                Deferred: function(e) {
                    var t = [["resolve", "done", Q.Callbacks("once memory"), "resolved"], ["reject", "fail", Q.Callbacks("once memory"), "rejected"], ["notify", "progress", Q.Callbacks("memory")]]
                      , n = "pending"
                      , a = {
                        state: function() {
                            return n
                        },
                        always: function() {
                            return o.done(arguments).fail(arguments),
                            this
                        },
                        then: function() {
                            var e = arguments;
                            return Q.Deferred(function(n) {
                                Q.each(t, function(t, r) {
                                    var i = Q.isFunction(e[t]) && e[t];
                                    o[r[1]](function() {
                                        var e = i && i.apply(this, arguments);
                                        e && Q.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[r[0] + "With"](this === a ? n.promise() : this, i ? [e] : arguments)
                                    })
                                }),
                                e = null
                            }).promise()
                        },
                        promise: function(e) {
                            return null != e ? Q.extend(e, a) : a
                        }
                    }
                      , o = {};
                    return a.pipe = a.then,
                    Q.each(t, function(e, r) {
                        var i = r[2]
                          , s = r[3];
                        a[r[1]] = i.add,
                        s && i.add(function() {
                            n = s
                        }, t[1 ^ e][2].disable, t[2][2].lock),
                        o[r[0]] = function() {
                            return o[r[0] + "With"](this === o ? a : this, arguments),
                            this
                        }
                        ,
                        o[r[0] + "With"] = i.fireWith
                    }),
                    a.promise(o),
                    e && e.call(o, o),
                    o
                },
                when: function(e) {
                    var t, n, a, o = 0, r = W.call(arguments), i = r.length, s = 1 !== i || e && Q.isFunction(e.promise) ? i : 0, l = 1 === s ? e : Q.Deferred(), c = function(e, n, a) {
                        return function(o) {
                            n[e] = this,
                            a[e] = arguments.length > 1 ? W.call(arguments) : o,
                            a === t ? l.notifyWith(n, a) : --s || l.resolveWith(n, a)
                        }
                    };
                    if (i > 1)
                        for (t = new Array(i),
                        n = new Array(i),
                        a = new Array(i); i > o; o++)
                            r[o] && Q.isFunction(r[o].promise) ? r[o].promise().done(c(o, a, r)).fail(l.reject).progress(c(o, n, t)) : --s;
                    return s || l.resolveWith(a, r),
                    l.promise()
                }
            });
            var ft;
            Q.fn.ready = function(e) {
                return Q.ready.promise().done(e),
                this
            }
            ,
            Q.extend({
                isReady: !1,
                readyWait: 1,
                holdReady: function(e) {
                    e ? Q.readyWait++ : Q.ready(!0)
                },
                ready: function(e) {
                    (e === !0 ? --Q.readyWait : Q.isReady) || (Q.isReady = !0,
                    e !== !0 && --Q.readyWait > 0 || (ft.resolveWith(Z, [Q]),
                    Q.fn.triggerHandler && (Q(Z).triggerHandler("ready"),
                    Q(Z).off("ready"))))
                }
            }),
            Q.ready.promise = function(t) {
                return ft || (ft = Q.Deferred(),
                "complete" === Z.readyState ? setTimeout(Q.ready) : (Z.addEventListener("DOMContentLoaded", i, !1),
                e.addEventListener("load", i, !1))),
                ft.promise(t)
            }
            ,
            Q.ready.promise();
            var gt = Q.access = function(e, t, n, a, o, r, i) {
                var s = 0
                  , l = e.length
                  , c = null == n;
                if ("object" === Q.type(n)) {
                    o = !0;
                    for (s in n)
                        Q.access(e, t, s, n[s], !0, r, i)
                } else if (void 0 !== a && (o = !0,
                Q.isFunction(a) || (i = !0),
                c && (i ? (t.call(e, a),
                t = null) : (c = t,
                t = function(e, t, n) {
                    return c.call(Q(e), n)
                }
                )),
                t))
                    for (; l > s; s++)
                        t(e[s], n, i ? a : a.call(e[s], s, t(e[s], n)));
                return o ? e : c ? t.call(e) : l ? t(e[0], n) : r
            }
            ;
            Q.acceptData = function(e) {
                return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
            }
            ,
            s.uid = 1,
            s.accepts = Q.acceptData,
            s.prototype = {
                key: function(e) {
                    if (!s.accepts(e))
                        return 0;
                    var t = {}
                      , n = e[this.expando];
                    if (!n) {
                        n = s.uid++;
                        try {
                            t[this.expando] = {
                                value: n
                            },
                            Object.defineProperties(e, t)
                        } catch (a) {
                            t[this.expando] = n,
                            Q.extend(e, t)
                        }
                    }
                    return this.cache[n] || (this.cache[n] = {}),
                    n
                },
                set: function(e, t, n) {
                    var a, o = this.key(e), r = this.cache[o];
                    if ("string" == typeof t)
                        r[t] = n;
                    else if (Q.isEmptyObject(r))
                        Q.extend(this.cache[o], t);
                    else
                        for (a in t)
                            r[a] = t[a];
                    return r
                },
                get: function(e, t) {
                    var n = this.cache[this.key(e)];
                    return void 0 === t ? n : n[t]
                },
                access: function(e, t, n) {
                    var a;
                    return void 0 === t || t && "string" == typeof t && void 0 === n ? (a = this.get(e, t),
                    void 0 !== a ? a : this.get(e, Q.camelCase(t))) : (this.set(e, t, n),
                    void 0 !== n ? n : t)
                },
                remove: function(e, t) {
                    var n, a, o, r = this.key(e), i = this.cache[r];
                    if (void 0 === t)
                        this.cache[r] = {};
                    else {
                        Q.isArray(t) ? a = t.concat(t.map(Q.camelCase)) : (o = Q.camelCase(t),
                        t in i ? a = [t, o] : (a = o,
                        a = a in i ? [a] : a.match(mt) || [])),
                        n = a.length;
                        for (; n--; )
                            delete i[a[n]]
                    }
                },
                hasData: function(e) {
                    return !Q.isEmptyObject(this.cache[e[this.expando]] || {})
                },
                discard: function(e) {
                    e[this.expando] && delete this.cache[e[this.expando]]
                }
            };
            var vt = new s
              , yt = new s
              , Et = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
              , bt = /([A-Z])/g;
            Q.extend({
                hasData: function(e) {
                    return yt.hasData(e) || vt.hasData(e)
                },
                data: function(e, t, n) {
                    return yt.access(e, t, n)
                },
                removeData: function(e, t) {
                    yt.remove(e, t)
                },
                _data: function(e, t, n) {
                    return vt.access(e, t, n)
                },
                _removeData: function(e, t) {
                    vt.remove(e, t)
                }
            }),
            Q.fn.extend({
                data: function(e, t) {
                    var n, a, o, r = this[0], i = r && r.attributes;
                    if (void 0 === e) {
                        if (this.length && (o = yt.get(r),
                        1 === r.nodeType && !vt.get(r, "hasDataAttrs"))) {
                            for (n = i.length; n--; )
                                i[n] && (a = i[n].name,
                                0 === a.indexOf("data-") && (a = Q.camelCase(a.slice(5)),
                                l(r, a, o[a])));
                            vt.set(r, "hasDataAttrs", !0)
                        }
                        return o
                    }
                    return "object" == typeof e ? this.each(function() {
                        yt.set(this, e)
                    }) : gt(this, function(t) {
                        var n, a = Q.camelCase(e);
                        if (r && void 0 === t) {
                            if (n = yt.get(r, e),
                            void 0 !== n)
                                return n;
                            if (n = yt.get(r, a),
                            void 0 !== n)
                                return n;
                            if (n = l(r, a, void 0),
                            void 0 !== n)
                                return n
                        } else
                            this.each(function() {
                                var n = yt.get(this, a);
                                yt.set(this, a, t),
                                -1 !== e.indexOf("-") && void 0 !== n && yt.set(this, e, t)
                            })
                    }, null, t, arguments.length > 1, null, !0)
                },
                removeData: function(e) {
                    return this.each(function() {
                        yt.remove(this, e)
                    })
                }
            }),
            Q.extend({
                queue: function(e, t, n) {
                    var a;
                    return e ? (t = (t || "fx") + "queue",
                    a = vt.get(e, t),
                    n && (!a || Q.isArray(n) ? a = vt.access(e, t, Q.makeArray(n)) : a.push(n)),
                    a || []) : void 0
                },
                dequeue: function(e, t) {
                    t = t || "fx";
                    var n = Q.queue(e, t)
                      , a = n.length
                      , o = n.shift()
                      , r = Q._queueHooks(e, t)
                      , i = function() {
                        Q.dequeue(e, t)
                    };
                    "inprogress" === o && (o = n.shift(),
                    a--),
                    o && ("fx" === t && n.unshift("inprogress"),
                    delete r.stop,
                    o.call(e, i, r)),
                    !a && r && r.empty.fire()
                },
                _queueHooks: function(e, t) {
                    var n = t + "queueHooks";
                    return vt.get(e, n) || vt.access(e, n, {
                        empty: Q.Callbacks("once memory").add(function() {
                            vt.remove(e, [t + "queue", n])
                        })
                    })
                }
            }),
            Q.fn.extend({
                queue: function(e, t) {
                    var n = 2;
                    return "string" != typeof e && (t = e,
                    e = "fx",
                    n--),
                    arguments.length < n ? Q.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                        var n = Q.queue(this, e, t);
                        Q._queueHooks(this, e),
                        "fx" === e && "inprogress" !== n[0] && Q.dequeue(this, e)
                    })
                },
                dequeue: function(e) {
                    return this.each(function() {
                        Q.dequeue(this, e)
                    })
                },
                clearQueue: function(e) {
                    return this.queue(e || "fx", [])
                },
                promise: function(e, t) {
                    var n, a = 1, o = Q.Deferred(), r = this, i = this.length, s = function() {
                        --a || o.resolveWith(r, [r])
                    };
                    for ("string" != typeof e && (t = e,
                    e = void 0),
                    e = e || "fx"; i--; )
                        n = vt.get(r[i], e + "queueHooks"),
                        n && n.empty && (a++,
                        n.empty.add(s));
                    return s(),
                    o.promise(t)
                }
            });
            var Nt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
              , kt = ["Top", "Right", "Bottom", "Left"]
              , _t = function(e, t) {
                return e = t || e,
                "none" === Q.css(e, "display") || !Q.contains(e.ownerDocument, e)
            }
              , wt = /^(?:checkbox|radio)$/i;
            !function() {
                var e = Z.createDocumentFragment()
                  , t = e.appendChild(Z.createElement("div"))
                  , n = Z.createElement("input");
                n.setAttribute("type", "radio"),
                n.setAttribute("checked", "checked"),
                n.setAttribute("name", "t"),
                t.appendChild(n),
                X.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked,
                t.innerHTML = "<textarea>x</textarea>",
                X.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
            }();
            var xt = "undefined";
            X.focusinBubbles = "onfocusin"in e;
            var Ct = /^key/
              , Tt = /^(?:mouse|pointer|contextmenu)|click/
              , Dt = /^(?:focusinfocus|focusoutblur)$/
              , Mt = /^([^.]*)(?:\.(.+)|)$/;
            Q.event = {
                global: {},
                add: function(e, t, n, a, o) {
                    var r, i, s, l, c, u, p, d, m, h, f, g = vt.get(e);
                    if (g)
                        for (n.handler && (r = n,
                        n = r.handler,
                        o = r.selector),
                        n.guid || (n.guid = Q.guid++),
                        (l = g.events) || (l = g.events = {}),
                        (i = g.handle) || (i = g.handle = function(t) {
                            return typeof Q !== xt && Q.event.triggered !== t.type ? Q.event.dispatch.apply(e, arguments) : void 0
                        }
                        ),
                        t = (t || "").match(mt) || [""],
                        c = t.length; c--; )
                            s = Mt.exec(t[c]) || [],
                            m = f = s[1],
                            h = (s[2] || "").split(".").sort(),
                            m && (p = Q.event.special[m] || {},
                            m = (o ? p.delegateType : p.bindType) || m,
                            p = Q.event.special[m] || {},
                            u = Q.extend({
                                type: m,
                                origType: f,
                                data: a,
                                handler: n,
                                guid: n.guid,
                                selector: o,
                                needsContext: o && Q.expr.match.needsContext.test(o),
                                namespace: h.join(".")
                            }, r),
                            (d = l[m]) || (d = l[m] = [],
                            d.delegateCount = 0,
                            p.setup && p.setup.call(e, a, h, i) !== !1 || e.addEventListener && e.addEventListener(m, i, !1)),
                            p.add && (p.add.call(e, u),
                            u.handler.guid || (u.handler.guid = n.guid)),
                            o ? d.splice(d.delegateCount++, 0, u) : d.push(u),
                            Q.event.global[m] = !0)
                },
                remove: function(e, t, n, a, o) {
                    var r, i, s, l, c, u, p, d, m, h, f, g = vt.hasData(e) && vt.get(e);
                    if (g && (l = g.events)) {
                        for (t = (t || "").match(mt) || [""],
                        c = t.length; c--; )
                            if (s = Mt.exec(t[c]) || [],
                            m = f = s[1],
                            h = (s[2] || "").split(".").sort(),
                            m) {
                                for (p = Q.event.special[m] || {},
                                m = (a ? p.delegateType : p.bindType) || m,
                                d = l[m] || [],
                                s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                                i = r = d.length; r--; )
                                    u = d[r],
                                    !o && f !== u.origType || n && n.guid !== u.guid || s && !s.test(u.namespace) || a && a !== u.selector && ("**" !== a || !u.selector) || (d.splice(r, 1),
                                    u.selector && d.delegateCount--,
                                    p.remove && p.remove.call(e, u));
                                i && !d.length && (p.teardown && p.teardown.call(e, h, g.handle) !== !1 || Q.removeEvent(e, m, g.handle),
                                delete l[m])
                            } else
                                for (m in l)
                                    Q.event.remove(e, m + t[c], n, a, !0);
                        Q.isEmptyObject(l) && (delete g.handle,
                        vt.remove(e, "events"))
                    }
                },
                trigger: function(t, n, a, o) {
                    var r, i, s, l, c, u, p, d = [a || Z], m = K.call(t, "type") ? t.type : t, h = K.call(t, "namespace") ? t.namespace.split(".") : [];
                    if (i = s = a = a || Z,
                    3 !== a.nodeType && 8 !== a.nodeType && !Dt.test(m + Q.event.triggered) && (m.indexOf(".") >= 0 && (h = m.split("."),
                    m = h.shift(),
                    h.sort()),
                    c = m.indexOf(":") < 0 && "on" + m,
                    t = t[Q.expando] ? t : new Q.Event(m,"object" == typeof t && t),
                    t.isTrigger = o ? 2 : 3,
                    t.namespace = h.join("."),
                    t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
                    t.result = void 0,
                    t.target || (t.target = a),
                    n = null == n ? [t] : Q.makeArray(n, [t]),
                    p = Q.event.special[m] || {},
                    o || !p.trigger || p.trigger.apply(a, n) !== !1)) {
                        if (!o && !p.noBubble && !Q.isWindow(a)) {
                            for (l = p.delegateType || m,
                            Dt.test(l + m) || (i = i.parentNode); i; i = i.parentNode)
                                d.push(i),
                                s = i;
                            s === (a.ownerDocument || Z) && d.push(s.defaultView || s.parentWindow || e)
                        }
                        for (r = 0; (i = d[r++]) && !t.isPropagationStopped(); )
                            t.type = r > 1 ? l : p.bindType || m,
                            u = (vt.get(i, "events") || {})[t.type] && vt.get(i, "handle"),
                            u && u.apply(i, n),
                            u = c && i[c],
                            u && u.apply && Q.acceptData(i) && (t.result = u.apply(i, n),
                            t.result === !1 && t.preventDefault());
                        return t.type = m,
                        o || t.isDefaultPrevented() || p._default && p._default.apply(d.pop(), n) !== !1 || !Q.acceptData(a) || c && Q.isFunction(a[m]) && !Q.isWindow(a) && (s = a[c],
                        s && (a[c] = null),
                        Q.event.triggered = m,
                        a[m](),
                        Q.event.triggered = void 0,
                        s && (a[c] = s)),
                        t.result
                    }
                },
                dispatch: function(e) {
                    e = Q.event.fix(e);
                    var t, n, a, o, r, i = [], s = W.call(arguments), l = (vt.get(this, "events") || {})[e.type] || [], c = Q.event.special[e.type] || {};
                    if (s[0] = e,
                    e.delegateTarget = this,
                    !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
                        for (i = Q.event.handlers.call(this, e, l),
                        t = 0; (o = i[t++]) && !e.isPropagationStopped(); )
                            for (e.currentTarget = o.elem,
                            n = 0; (r = o.handlers[n++]) && !e.isImmediatePropagationStopped(); )
                                (!e.namespace_re || e.namespace_re.test(r.namespace)) && (e.handleObj = r,
                                e.data = r.data,
                                a = ((Q.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, s),
                                void 0 !== a && (e.result = a) === !1 && (e.preventDefault(),
                                e.stopPropagation()));
                        return c.postDispatch && c.postDispatch.call(this, e),
                        e.result
                    }
                },
                handlers: function(e, t) {
                    var n, a, o, r, i = [], s = t.delegateCount, l = e.target;
                    if (s && l.nodeType && (!e.button || "click" !== e.type))
                        for (; l !== this; l = l.parentNode || this)
                            if (l.disabled !== !0 || "click" !== e.type) {
                                for (a = [],
                                n = 0; s > n; n++)
                                    r = t[n],
                                    o = r.selector + " ",
                                    void 0 === a[o] && (a[o] = r.needsContext ? Q(o, this).index(l) >= 0 : Q.find(o, this, null, [l]).length),
                                    a[o] && a.push(r);
                                a.length && i.push({
                                    elem: l,
                                    handlers: a
                                })
                            }
                    return s < t.length && i.push({
                        elem: this,
                        handlers: t.slice(s)
                    }),
                    i
                },
                props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                fixHooks: {},
                keyHooks: {
                    props: "char charCode key keyCode".split(" "),
                    filter: function(e, t) {
                        return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode),
                        e
                    }
                },
                mouseHooks: {
                    props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                    filter: function(e, t) {
                        var n, a, o, r = t.button;
                        return null == e.pageX && null != t.clientX && (n = e.target.ownerDocument || Z,
                        a = n.documentElement,
                        o = n.body,
                        e.pageX = t.clientX + (a && a.scrollLeft || o && o.scrollLeft || 0) - (a && a.clientLeft || o && o.clientLeft || 0),
                        e.pageY = t.clientY + (a && a.scrollTop || o && o.scrollTop || 0) - (a && a.clientTop || o && o.clientTop || 0)),
                        e.which || void 0 === r || (e.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0),
                        e
                    }
                },
                fix: function(e) {
                    if (e[Q.expando])
                        return e;
                    var t, n, a, o = e.type, r = e, i = this.fixHooks[o];
                    for (i || (this.fixHooks[o] = i = Tt.test(o) ? this.mouseHooks : Ct.test(o) ? this.keyHooks : {}),
                    a = i.props ? this.props.concat(i.props) : this.props,
                    e = new Q.Event(r),
                    t = a.length; t--; )
                        n = a[t],
                        e[n] = r[n];
                    return e.target || (e.target = Z),
                    3 === e.target.nodeType && (e.target = e.target.parentNode),
                    i.filter ? i.filter(e, r) : e
                },
                special: {
                    load: {
                        noBubble: !0
                    },
                    focus: {
                        trigger: function() {
                            return this !== p() && this.focus ? (this.focus(),
                            !1) : void 0
                        },
                        delegateType: "focusin"
                    },
                    blur: {
                        trigger: function() {
                            return this === p() && this.blur ? (this.blur(),
                            !1) : void 0
                        },
                        delegateType: "focusout"
                    },
                    click: {
                        trigger: function() {
                            return "checkbox" === this.type && this.click && Q.nodeName(this, "input") ? (this.click(),
                            !1) : void 0
                        },
                        _default: function(e) {
                            return Q.nodeName(e.target, "a")
                        }
                    },
                    beforeunload: {
                        postDispatch: function(e) {
                            void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                        }
                    }
                },
                simulate: function(e, t, n, a) {
                    var o = Q.extend(new Q.Event, n, {
                        type: e,
                        isSimulated: !0,
                        originalEvent: {}
                    });
                    a ? Q.event.trigger(o, null, t) : Q.event.dispatch.call(t, o),
                    o.isDefaultPrevented() && n.preventDefault()
                }
            },
            Q.removeEvent = function(e, t, n) {
                e.removeEventListener && e.removeEventListener(t, n, !1)
            }
            ,
            Q.Event = function(e, t) {
                return this instanceof Q.Event ? (e && e.type ? (this.originalEvent = e,
                this.type = e.type,
                this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? c : u) : this.type = e,
                t && Q.extend(this, t),
                this.timeStamp = e && e.timeStamp || Q.now(),
                void (this[Q.expando] = !0)) : new Q.Event(e,t)
            }
            ,
            Q.Event.prototype = {
                isDefaultPrevented: u,
                isPropagationStopped: u,
                isImmediatePropagationStopped: u,
                preventDefault: function() {
                    var e = this.originalEvent;
                    this.isDefaultPrevented = c,
                    e && e.preventDefault && e.preventDefault()
                },
                stopPropagation: function() {
                    var e = this.originalEvent;
                    this.isPropagationStopped = c,
                    e && e.stopPropagation && e.stopPropagation()
                },
                stopImmediatePropagation: function() {
                    var e = this.originalEvent;
                    this.isImmediatePropagationStopped = c,
                    e && e.stopImmediatePropagation && e.stopImmediatePropagation(),
                    this.stopPropagation()
                }
            },
            Q.each({
                mouseenter: "mouseover",
                mouseleave: "mouseout",
                pointerenter: "pointerover",
                pointerleave: "pointerout"
            }, function(e, t) {
                Q.event.special[e] = {
                    delegateType: t,
                    bindType: t,
                    handle: function(e) {
                        var n, a = this, o = e.relatedTarget, r = e.handleObj;
                        return (!o || o !== a && !Q.contains(a, o)) && (e.type = r.origType,
                        n = r.handler.apply(this, arguments),
                        e.type = t),
                        n
                    }
                }
            }),
            X.focusinBubbles || Q.each({
                focus: "focusin",
                blur: "focusout"
            }, function(e, t) {
                var n = function(e) {
                    Q.event.simulate(t, e.target, Q.event.fix(e), !0)
                };
                Q.event.special[t] = {
                    setup: function() {
                        var a = this.ownerDocument || this
                          , o = vt.access(a, t);
                        o || a.addEventListener(e, n, !0),
                        vt.access(a, t, (o || 0) + 1)
                    },
                    teardown: function() {
                        var a = this.ownerDocument || this
                          , o = vt.access(a, t) - 1;
                        o ? vt.access(a, t, o) : (a.removeEventListener(e, n, !0),
                        vt.remove(a, t))
                    }
                }
            }),
            Q.fn.extend({
                on: function(e, t, n, a, o) {
                    var r, i;
                    if ("object" == typeof e) {
                        "string" != typeof t && (n = n || t,
                        t = void 0);
                        for (i in e)
                            this.on(i, t, n, e[i], o);
                        return this
                    }
                    if (null == n && null == a ? (a = t,
                    n = t = void 0) : null == a && ("string" == typeof t ? (a = n,
                    n = void 0) : (a = n,
                    n = t,
                    t = void 0)),
                    a === !1)
                        a = u;
                    else if (!a)
                        return this;
                    return 1 === o && (r = a,
                    a = function(e) {
                        return Q().off(e),
                        r.apply(this, arguments)
                    }
                    ,
                    a.guid = r.guid || (r.guid = Q.guid++)),
                    this.each(function() {
                        Q.event.add(this, e, a, n, t)
                    })
                },
                one: function(e, t, n, a) {
                    return this.on(e, t, n, a, 1)
                },
                off: function(e, t, n) {
                    var a, o;
                    if (e && e.preventDefault && e.handleObj)
                        return a = e.handleObj,
                        Q(e.delegateTarget).off(a.namespace ? a.origType + "." + a.namespace : a.origType, a.selector, a.handler),
                        this;
                    if ("object" == typeof e) {
                        for (o in e)
                            this.off(o, t, e[o]);
                        return this
                    }
                    return (t === !1 || "function" == typeof t) && (n = t,
                    t = void 0),
                    n === !1 && (n = u),
                    this.each(function() {
                        Q.event.remove(this, e, n, t)
                    })
                },
                trigger: function(e, t) {
                    return this.each(function() {
                        Q.event.trigger(e, t, this)
                    })
                },
                triggerHandler: function(e, t) {
                    var n = this[0];
                    return n ? Q.event.trigger(e, t, n, !0) : void 0
                }
            });
            var St = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
              , Ot = /<([\w:]+)/
              , At = /<|&#?\w+;/
              , Lt = /<(?:script|style|link)/i
              , Bt = /checked\s*(?:[^=]|=\s*.checked.)/i
              , Gt = /^$|\/(?:java|ecma)script/i
              , Pt = /^true\/(.*)/
              , Rt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
              , Ft = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""]
            };
            Ft.optgroup = Ft.option,
            Ft.tbody = Ft.tfoot = Ft.colgroup = Ft.caption = Ft.thead,
            Ft.th = Ft.td,
            Q.extend({
                clone: function(e, t, n) {
                    var a, o, r, i, s = e.cloneNode(!0), l = Q.contains(e.ownerDocument, e);
                    if (!(X.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Q.isXMLDoc(e)))
                        for (i = v(s),
                        r = v(e),
                        a = 0,
                        o = r.length; o > a; a++)
                            y(r[a], i[a]);
                    if (t)
                        if (n)
                            for (r = r || v(e),
                            i = i || v(s),
                            a = 0,
                            o = r.length; o > a; a++)
                                g(r[a], i[a]);
                        else
                            g(e, s);
                    return i = v(s, "script"),
                    i.length > 0 && f(i, !l && v(e, "script")),
                    s
                },
                buildFragment: function(e, t, n, a) {
                    for (var o, r, i, s, l, c, u = t.createDocumentFragment(), p = [], d = 0, m = e.length; m > d; d++)
                        if (o = e[d],
                        o || 0 === o)
                            if ("object" === Q.type(o))
                                Q.merge(p, o.nodeType ? [o] : o);
                            else if (At.test(o)) {
                                for (r = r || u.appendChild(t.createElement("div")),
                                i = (Ot.exec(o) || ["", ""])[1].toLowerCase(),
                                s = Ft[i] || Ft._default,
                                r.innerHTML = s[1] + o.replace(St, "<$1></$2>") + s[2],
                                c = s[0]; c--; )
                                    r = r.lastChild;
                                Q.merge(p, r.childNodes),
                                r = u.firstChild,
                                r.textContent = ""
                            } else
                                p.push(t.createTextNode(o));
                    for (u.textContent = "",
                    d = 0; o = p[d++]; )
                        if ((!a || -1 === Q.inArray(o, a)) && (l = Q.contains(o.ownerDocument, o),
                        r = v(u.appendChild(o), "script"),
                        l && f(r),
                        n))
                            for (c = 0; o = r[c++]; )
                                Gt.test(o.type || "") && n.push(o);
                    return u
                },
                cleanData: function(e) {
                    for (var t, n, a, o, r = Q.event.special, i = 0; void 0 !== (n = e[i]); i++) {
                        if (Q.acceptData(n) && (o = n[vt.expando],
                        o && (t = vt.cache[o]))) {
                            if (t.events)
                                for (a in t.events)
                                    r[a] ? Q.event.remove(n, a) : Q.removeEvent(n, a, t.handle);
                            vt.cache[o] && delete vt.cache[o]
                        }
                        delete yt.cache[n[yt.expando]]
                    }
                }
            }),
            Q.fn.extend({
                text: function(e) {
                    return gt(this, function(e) {
                        return void 0 === e ? Q.text(this) : this.empty().each(function() {
                            (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = e)
                        })
                    }, null, e, arguments.length)
                },
                append: function() {
                    return this.domManip(arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = d(this, e);
                            t.appendChild(e)
                        }
                    })
                },
                prepend: function() {
                    return this.domManip(arguments, function(e) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var t = d(this, e);
                            t.insertBefore(e, t.firstChild)
                        }
                    })
                },
                before: function() {
                    return this.domManip(arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this)
                    })
                },
                after: function() {
                    return this.domManip(arguments, function(e) {
                        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                    })
                },
                remove: function(e, t) {
                    for (var n, a = e ? Q.filter(e, this) : this, o = 0; null != (n = a[o]); o++)
                        t || 1 !== n.nodeType || Q.cleanData(v(n)),
                        n.parentNode && (t && Q.contains(n.ownerDocument, n) && f(v(n, "script")),
                        n.parentNode.removeChild(n));
                    return this
                },
                empty: function() {
                    for (var e, t = 0; null != (e = this[t]); t++)
                        1 === e.nodeType && (Q.cleanData(v(e, !1)),
                        e.textContent = "");
                    return this
                },
                clone: function(e, t) {
                    return e = null == e ? !1 : e,
                    t = null == t ? e : t,
                    this.map(function() {
                        return Q.clone(this, e, t)
                    })
                },
                html: function(e) {
                    return gt(this, function(e) {
                        var t = this[0] || {}
                          , n = 0
                          , a = this.length;
                        if (void 0 === e && 1 === t.nodeType)
                            return t.innerHTML;
                        if ("string" == typeof e && !Lt.test(e) && !Ft[(Ot.exec(e) || ["", ""])[1].toLowerCase()]) {
                            e = e.replace(St, "<$1></$2>");
                            try {
                                for (; a > n; n++)
                                    t = this[n] || {},
                                    1 === t.nodeType && (Q.cleanData(v(t, !1)),
                                    t.innerHTML = e);
                                t = 0
                            } catch (o) {}
                        }
                        t && this.empty().append(e)
                    }, null, e, arguments.length)
                },
                replaceWith: function() {
                    var e = arguments[0];
                    return this.domManip(arguments, function(t) {
                        e = this.parentNode,
                        Q.cleanData(v(this)),
                        e && e.replaceChild(t, this)
                    }),
                    e && (e.length || e.nodeType) ? this : this.remove()
                },
                detach: function(e) {
                    return this.remove(e, !0)
                },
                domManip: function(e, t) {
                    e = q.apply([], e);
                    var n, a, o, r, i, s, l = 0, c = this.length, u = this, p = c - 1, d = e[0], f = Q.isFunction(d);
                    if (f || c > 1 && "string" == typeof d && !X.checkClone && Bt.test(d))
                        return this.each(function(n) {
                            var a = u.eq(n);
                            f && (e[0] = d.call(this, n, a.html())),
                            a.domManip(e, t)
                        });
                    if (c && (n = Q.buildFragment(e, this[0].ownerDocument, !1, this),
                    a = n.firstChild,
                    1 === n.childNodes.length && (n = a),
                    a)) {
                        for (o = Q.map(v(n, "script"), m),
                        r = o.length; c > l; l++)
                            i = n,
                            l !== p && (i = Q.clone(i, !0, !0),
                            r && Q.merge(o, v(i, "script"))),
                            t.call(this[l], i, l);
                        if (r)
                            for (s = o[o.length - 1].ownerDocument,
                            Q.map(o, h),
                            l = 0; r > l; l++)
                                i = o[l],
                                Gt.test(i.type || "") && !vt.access(i, "globalEval") && Q.contains(s, i) && (i.src ? Q._evalUrl && Q._evalUrl(i.src) : Q.globalEval(i.textContent.replace(Rt, "")))
                    }
                    return this
                }
            }),
            Q.each({
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith"
            }, function(e, t) {
                Q.fn[e] = function(e) {
                    for (var n, a = [], o = Q(e), r = o.length - 1, i = 0; r >= i; i++)
                        n = i === r ? this : this.clone(!0),
                        Q(o[i])[t](n),
                        z.apply(a, n.get());
                    return this.pushStack(a)
                }
            });
            var It, jt = {}, Ht = /^margin/, Ut = new RegExp("^(" + Nt + ")(?!px)[a-z%]+$","i"), Wt = function(t) {
                return t.ownerDocument.defaultView.opener ? t.ownerDocument.defaultView.getComputedStyle(t, null) : e.getComputedStyle(t, null)
            };
            !function() {
                function t() {
                    i.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",
                    i.innerHTML = "",
                    o.appendChild(r);
                    var t = e.getComputedStyle(i, null);
                    n = "1%" !== t.top,
                    a = "4px" === t.width,
                    o.removeChild(r)
                }
                var n, a, o = Z.documentElement, r = Z.createElement("div"), i = Z.createElement("div");
                i.style && (i.style.backgroundClip = "content-box",
                i.cloneNode(!0).style.backgroundClip = "",
                X.clearCloneStyle = "content-box" === i.style.backgroundClip,
                r.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",
                r.appendChild(i),
                e.getComputedStyle && Q.extend(X, {
                    pixelPosition: function() {
                        return t(),
                        n
                    },
                    boxSizingReliable: function() {
                        return null == a && t(),
                        a
                    },
                    reliableMarginRight: function() {
                        var t, n = i.appendChild(Z.createElement("div"));
                        return n.style.cssText = i.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                        n.style.marginRight = n.style.width = "0",
                        i.style.width = "1px",
                        o.appendChild(r),
                        t = !parseFloat(e.getComputedStyle(n, null).marginRight),
                        o.removeChild(r),
                        i.removeChild(n),
                        t
                    }
                }))
            }(),
            Q.swap = function(e, t, n, a) {
                var o, r, i = {};
                for (r in t)
                    i[r] = e.style[r],
                    e.style[r] = t[r];
                o = n.apply(e, a || []);
                for (r in t)
                    e.style[r] = i[r];
                return o
            }
            ;
            var qt = /^(none|table(?!-c[ea]).+)/
              , zt = new RegExp("^(" + Nt + ")(.*)$","i")
              , Vt = new RegExp("^([+-])=(" + Nt + ")","i")
              , $t = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            }
              , Yt = {
                letterSpacing: "0",
                fontWeight: "400"
            }
              , Kt = ["Webkit", "O", "Moz", "ms"];
            Q.extend({
                cssHooks: {
                    opacity: {
                        get: function(e, t) {
                            if (t) {
                                var n = N(e, "opacity");
                                return "" === n ? "1" : n
                            }
                        }
                    }
                },
                cssNumber: {
                    columnCount: !0,
                    fillOpacity: !0,
                    flexGrow: !0,
                    flexShrink: !0,
                    fontWeight: !0,
                    lineHeight: !0,
                    opacity: !0,
                    order: !0,
                    orphans: !0,
                    widows: !0,
                    zIndex: !0,
                    zoom: !0
                },
                cssProps: {
                    "float": "cssFloat"
                },
                style: function(e, t, n, a) {
                    if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                        var o, r, i, s = Q.camelCase(t), l = e.style;
                        return t = Q.cssProps[s] || (Q.cssProps[s] = _(l, s)),
                        i = Q.cssHooks[t] || Q.cssHooks[s],
                        void 0 === n ? i && "get"in i && void 0 !== (o = i.get(e, !1, a)) ? o : l[t] : (r = typeof n,
                        "string" === r && (o = Vt.exec(n)) && (n = (o[1] + 1) * o[2] + parseFloat(Q.css(e, t)),
                        r = "number"),
                        void (null != n && n === n && ("number" !== r || Q.cssNumber[s] || (n += "px"),
                        X.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"),
                        i && "set"in i && void 0 === (n = i.set(e, n, a)) || (l[t] = n))))
                    }
                },
                css: function(e, t, n, a) {
                    var o, r, i, s = Q.camelCase(t);
                    return t = Q.cssProps[s] || (Q.cssProps[s] = _(e.style, s)),
                    i = Q.cssHooks[t] || Q.cssHooks[s],
                    i && "get"in i && (o = i.get(e, !0, n)),
                    void 0 === o && (o = N(e, t, a)),
                    "normal" === o && t in Yt && (o = Yt[t]),
                    "" === n || n ? (r = parseFloat(o),
                    n === !0 || Q.isNumeric(r) ? r || 0 : o) : o
                }
            }),
            Q.each(["height", "width"], function(e, t) {
                Q.cssHooks[t] = {
                    get: function(e, n, a) {
                        return n ? qt.test(Q.css(e, "display")) && 0 === e.offsetWidth ? Q.swap(e, $t, function() {
                            return C(e, t, a)
                        }) : C(e, t, a) : void 0
                    },
                    set: function(e, n, a) {
                        var o = a && Wt(e);
                        return w(e, n, a ? x(e, t, a, "border-box" === Q.css(e, "boxSizing", !1, o), o) : 0)
                    }
                }
            }),
            Q.cssHooks.marginRight = k(X.reliableMarginRight, function(e, t) {
                return t ? Q.swap(e, {
                    display: "inline-block"
                }, N, [e, "marginRight"]) : void 0
            }),
            Q.each({
                margin: "",
                padding: "",
                border: "Width"
            }, function(e, t) {
                Q.cssHooks[e + t] = {
                    expand: function(n) {
                        for (var a = 0, o = {}, r = "string" == typeof n ? n.split(" ") : [n]; 4 > a; a++)
                            o[e + kt[a] + t] = r[a] || r[a - 2] || r[0];
                        return o
                    }
                },
                Ht.test(e) || (Q.cssHooks[e + t].set = w)
            }),
            Q.fn.extend({
                css: function(e, t) {
                    return gt(this, function(e, t, n) {
                        var a, o, r = {}, i = 0;
                        if (Q.isArray(t)) {
                            for (a = Wt(e),
                            o = t.length; o > i; i++)
                                r[t[i]] = Q.css(e, t[i], !1, a);
                            return r
                        }
                        return void 0 !== n ? Q.style(e, t, n) : Q.css(e, t)
                    }, e, t, arguments.length > 1)
                },
                show: function() {
                    return T(this, !0)
                },
                hide: function() {
                    return T(this)
                },
                toggle: function(e) {
                    return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                        _t(this) ? Q(this).show() : Q(this).hide()
                    })
                }
            }),
            Q.Tween = D,
            D.prototype = {
                constructor: D,
                init: function(e, t, n, a, o, r) {
                    this.elem = e,
                    this.prop = n,
                    this.easing = o || "swing",
                    this.options = t,
                    this.start = this.now = this.cur(),
                    this.end = a,
                    this.unit = r || (Q.cssNumber[n] ? "" : "px")
                },
                cur: function() {
                    var e = D.propHooks[this.prop];
                    return e && e.get ? e.get(this) : D.propHooks._default.get(this)
                },
                run: function(e) {
                    var t, n = D.propHooks[this.prop];
                    return this.pos = t = this.options.duration ? Q.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e,
                    this.now = (this.end - this.start) * t + this.start,
                    this.options.step && this.options.step.call(this.elem, this.now, this),
                    n && n.set ? n.set(this) : D.propHooks._default.set(this),
                    this
                }
            },
            D.prototype.init.prototype = D.prototype,
            D.propHooks = {
                _default: {
                    get: function(e) {
                        var t;
                        return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = Q.css(e.elem, e.prop, ""),
                        t && "auto" !== t ? t : 0) : e.elem[e.prop]
                    },
                    set: function(e) {
                        Q.fx.step[e.prop] ? Q.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[Q.cssProps[e.prop]] || Q.cssHooks[e.prop]) ? Q.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                    }
                }
            },
            D.propHooks.scrollTop = D.propHooks.scrollLeft = {
                set: function(e) {
                    e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
                }
            },
            Q.easing = {
                linear: function(e) {
                    return e
                },
                swing: function(e) {
                    return .5 - Math.cos(e * Math.PI) / 2
                }
            },
            Q.fx = D.prototype.init,
            Q.fx.step = {};
            var Xt, Zt, Jt = /^(?:toggle|show|hide)$/, Qt = new RegExp("^(?:([+-])=|)(" + Nt + ")([a-z%]*)$","i"), en = /queueHooks$/, tn = [A], nn = {
                "*": [function(e, t) {
                    var n = this.createTween(e, t)
                      , a = n.cur()
                      , o = Qt.exec(t)
                      , r = o && o[3] || (Q.cssNumber[e] ? "" : "px")
                      , i = (Q.cssNumber[e] || "px" !== r && +a) && Qt.exec(Q.css(n.elem, e))
                      , s = 1
                      , l = 20;
                    if (i && i[3] !== r) {
                        r = r || i[3],
                        o = o || [],
                        i = +a || 1;
                        do
                            s = s || ".5",
                            i /= s,
                            Q.style(n.elem, e, i + r);
                        while (s !== (s = n.cur() / a) && 1 !== s && --l)
                    }
                    return o && (i = n.start = +i || +a || 0,
                    n.unit = r,
                    n.end = o[1] ? i + (o[1] + 1) * o[2] : +o[2]),
                    n
                }
                ]
            };
            Q.Animation = Q.extend(B, {
                tweener: function(e, t) {
                    Q.isFunction(e) ? (t = e,
                    e = ["*"]) : e = e.split(" ");
                    for (var n, a = 0, o = e.length; o > a; a++)
                        n = e[a],
                        nn[n] = nn[n] || [],
                        nn[n].unshift(t)
                },
                prefilter: function(e, t) {
                    t ? tn.unshift(e) : tn.push(e)
                }
            }),
            Q.speed = function(e, t, n) {
                var a = e && "object" == typeof e ? Q.extend({}, e) : {
                    complete: n || !n && t || Q.isFunction(e) && e,
                    duration: e,
                    easing: n && t || t && !Q.isFunction(t) && t
                };
                return a.duration = Q.fx.off ? 0 : "number" == typeof a.duration ? a.duration : a.duration in Q.fx.speeds ? Q.fx.speeds[a.duration] : Q.fx.speeds._default,
                (null == a.queue || a.queue === !0) && (a.queue = "fx"),
                a.old = a.complete,
                a.complete = function() {
                    Q.isFunction(a.old) && a.old.call(this),
                    a.queue && Q.dequeue(this, a.queue)
                }
                ,
                a
            }
            ,
            Q.fn.extend({
                fadeTo: function(e, t, n, a) {
                    return this.filter(_t).css("opacity", 0).show().end().animate({
                        opacity: t
                    }, e, n, a)
                },
                animate: function(e, t, n, a) {
                    var o = Q.isEmptyObject(e)
                      , r = Q.speed(t, n, a)
                      , i = function() {
                        var t = B(this, Q.extend({}, e), r);
                        (o || vt.get(this, "finish")) && t.stop(!0)
                    };
                    return i.finish = i,
                    o || r.queue === !1 ? this.each(i) : this.queue(r.queue, i)
                },
                stop: function(e, t, n) {
                    var a = function(e) {
                        var t = e.stop;
                        delete e.stop,
                        t(n)
                    };
                    return "string" != typeof e && (n = t,
                    t = e,
                    e = void 0),
                    t && e !== !1 && this.queue(e || "fx", []),
                    this.each(function() {
                        var t = !0
                          , o = null != e && e + "queueHooks"
                          , r = Q.timers
                          , i = vt.get(this);
                        if (o)
                            i[o] && i[o].stop && a(i[o]);
                        else
                            for (o in i)
                                i[o] && i[o].stop && en.test(o) && a(i[o]);
                        for (o = r.length; o--; )
                            r[o].elem !== this || null != e && r[o].queue !== e || (r[o].anim.stop(n),
                            t = !1,
                            r.splice(o, 1));
                        (t || !n) && Q.dequeue(this, e)
                    })
                },
                finish: function(e) {
                    return e !== !1 && (e = e || "fx"),
                    this.each(function() {
                        var t, n = vt.get(this), a = n[e + "queue"], o = n[e + "queueHooks"], r = Q.timers, i = a ? a.length : 0;
                        for (n.finish = !0,
                        Q.queue(this, e, []),
                        o && o.stop && o.stop.call(this, !0),
                        t = r.length; t--; )
                            r[t].elem === this && r[t].queue === e && (r[t].anim.stop(!0),
                            r.splice(t, 1));
                        for (t = 0; i > t; t++)
                            a[t] && a[t].finish && a[t].finish.call(this);
                        delete n.finish
                    })
                }
            }),
            Q.each(["toggle", "show", "hide"], function(e, t) {
                var n = Q.fn[t];
                Q.fn[t] = function(e, a, o) {
                    return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(S(t, !0), e, a, o)
                }
            }),
            Q.each({
                slideDown: S("show"),
                slideUp: S("hide"),
                slideToggle: S("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(e, t) {
                Q.fn[e] = function(e, n, a) {
                    return this.animate(t, e, n, a)
                }
            }),
            Q.timers = [],
            Q.fx.tick = function() {
                var e, t = 0, n = Q.timers;
                for (Xt = Q.now(); t < n.length; t++)
                    e = n[t],
                    e() || n[t] !== e || n.splice(t--, 1);
                n.length || Q.fx.stop(),
                Xt = void 0
            }
            ,
            Q.fx.timer = function(e) {
                Q.timers.push(e),
                e() ? Q.fx.start() : Q.timers.pop()
            }
            ,
            Q.fx.interval = 13,
            Q.fx.start = function() {
                Zt || (Zt = setInterval(Q.fx.tick, Q.fx.interval))
            }
            ,
            Q.fx.stop = function() {
                clearInterval(Zt),
                Zt = null
            }
            ,
            Q.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            },
            Q.fn.delay = function(e, t) {
                return e = Q.fx ? Q.fx.speeds[e] || e : e,
                t = t || "fx",
                this.queue(t, function(t, n) {
                    var a = setTimeout(t, e);
                    n.stop = function() {
                        clearTimeout(a)
                    }
                })
            }
            ,
            function() {
                var e = Z.createElement("input")
                  , t = Z.createElement("select")
                  , n = t.appendChild(Z.createElement("option"));
                e.type = "checkbox",
                X.checkOn = "" !== e.value,
                X.optSelected = n.selected,
                t.disabled = !0,
                X.optDisabled = !n.disabled,
                e = Z.createElement("input"),
                e.value = "t",
                e.type = "radio",
                X.radioValue = "t" === e.value
            }();
            var an, on, rn = Q.expr.attrHandle;
            Q.fn.extend({
                attr: function(e, t) {
                    return gt(this, Q.attr, e, t, arguments.length > 1)
                },
                removeAttr: function(e) {
                    return this.each(function() {
                        Q.removeAttr(this, e)
                    })
                }
            }),
            Q.extend({
                attr: function(e, t, n) {
                    var a, o, r = e.nodeType;
                    return e && 3 !== r && 8 !== r && 2 !== r ? typeof e.getAttribute === xt ? Q.prop(e, t, n) : (1 === r && Q.isXMLDoc(e) || (t = t.toLowerCase(),
                    a = Q.attrHooks[t] || (Q.expr.match.bool.test(t) ? on : an)),
                    void 0 === n ? a && "get"in a && null !== (o = a.get(e, t)) ? o : (o = Q.find.attr(e, t),
                    null == o ? void 0 : o) : null !== n ? a && "set"in a && void 0 !== (o = a.set(e, n, t)) ? o : (e.setAttribute(t, n + ""),
                    n) : void Q.removeAttr(e, t)) : void 0
                },
                removeAttr: function(e, t) {
                    var n, a, o = 0, r = t && t.match(mt);
                    if (r && 1 === e.nodeType)
                        for (; n = r[o++]; )
                            a = Q.propFix[n] || n,
                            Q.expr.match.bool.test(n) && (e[a] = !1),
                            e.removeAttribute(n)
                },
                attrHooks: {
                    type: {
                        set: function(e, t) {
                            if (!X.radioValue && "radio" === t && Q.nodeName(e, "input")) {
                                var n = e.value;
                                return e.setAttribute("type", t),
                                n && (e.value = n),
                                t
                            }
                        }
                    }
                }
            }),
            on = {
                set: function(e, t, n) {
                    return t === !1 ? Q.removeAttr(e, n) : e.setAttribute(n, n),
                    n
                }
            },
            Q.each(Q.expr.match.bool.source.match(/\w+/g), function(e, t) {
                var n = rn[t] || Q.find.attr;
                rn[t] = function(e, t, a) {
                    var o, r;
                    return a || (r = rn[t],
                    rn[t] = o,
                    o = null != n(e, t, a) ? t.toLowerCase() : null,
                    rn[t] = r),
                    o
                }
            });
            var sn = /^(?:input|select|textarea|button)$/i;
            Q.fn.extend({
                prop: function(e, t) {
                    return gt(this, Q.prop, e, t, arguments.length > 1)
                },
                removeProp: function(e) {
                    return this.each(function() {
                        delete this[Q.propFix[e] || e]
                    })
                }
            }),
            Q.extend({
                propFix: {
                    "for": "htmlFor",
                    "class": "className"
                },
                prop: function(e, t, n) {
                    var a, o, r, i = e.nodeType;
                    return e && 3 !== i && 8 !== i && 2 !== i ? (r = 1 !== i || !Q.isXMLDoc(e),
                    r && (t = Q.propFix[t] || t,
                    o = Q.propHooks[t]),
                    void 0 !== n ? o && "set"in o && void 0 !== (a = o.set(e, n, t)) ? a : e[t] = n : o && "get"in o && null !== (a = o.get(e, t)) ? a : e[t]) : void 0
                },
                propHooks: {
                    tabIndex: {
                        get: function(e) {
                            return e.hasAttribute("tabindex") || sn.test(e.nodeName) || e.href ? e.tabIndex : -1
                        }
                    }
                }
            }),
            X.optSelected || (Q.propHooks.selected = {
                get: function(e) {
                    var t = e.parentNode;
                    return t && t.parentNode && t.parentNode.selectedIndex,
                    null
                }
            }),
            Q.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
                Q.propFix[this.toLowerCase()] = this
            });
            var ln = /[\t\r\n\f]/g;
            Q.fn.extend({
                addClass: function(e) {
                    var t, n, a, o, r, i, s = "string" == typeof e && e, l = 0, c = this.length;
                    if (Q.isFunction(e))
                        return this.each(function(t) {
                            Q(this).addClass(e.call(this, t, this.className))
                        });
                    if (s)
                        for (t = (e || "").match(mt) || []; c > l; l++)
                            if (n = this[l],
                            a = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(ln, " ") : " ")) {
                                for (r = 0; o = t[r++]; )
                                    a.indexOf(" " + o + " ") < 0 && (a += o + " ");
                                i = Q.trim(a),
                                n.className !== i && (n.className = i)
                            }
                    return this
                },
                removeClass: function(e) {
                    var t, n, a, o, r, i, s = 0 === arguments.length || "string" == typeof e && e, l = 0, c = this.length;
                    if (Q.isFunction(e))
                        return this.each(function(t) {
                            Q(this).removeClass(e.call(this, t, this.className))
                        });
                    if (s)
                        for (t = (e || "").match(mt) || []; c > l; l++)
                            if (n = this[l],
                            a = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(ln, " ") : "")) {
                                for (r = 0; o = t[r++]; )
                                    for (; a.indexOf(" " + o + " ") >= 0; )
                                        a = a.replace(" " + o + " ", " ");
                                i = e ? Q.trim(a) : "",
                                n.className !== i && (n.className = i)
                            }
                    return this
                },
                toggleClass: function(e, t) {
                    var n = typeof e;
                    return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(Q.isFunction(e) ? function(n) {
                        Q(this).toggleClass(e.call(this, n, this.className, t), t)
                    }
                    : function() {
                        if ("string" === n)
                            for (var t, a = 0, o = Q(this), r = e.match(mt) || []; t = r[a++]; )
                                o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                        else
                            (n === xt || "boolean" === n) && (this.className && vt.set(this, "__className__", this.className),
                            this.className = this.className || e === !1 ? "" : vt.get(this, "__className__") || "")
                    }
                    )
                },
                hasClass: function(e) {
                    for (var t = " " + e + " ", n = 0, a = this.length; a > n; n++)
                        if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(ln, " ").indexOf(t) >= 0)
                            return !0;
                    return !1
                }
            });
            var cn = /\r/g;
            Q.fn.extend({
                val: function(e) {
                    var t, n, a, o = this[0];
                    return arguments.length ? (a = Q.isFunction(e),
                    this.each(function(n) {
                        var o;
                        1 === this.nodeType && (o = a ? e.call(this, n, Q(this).val()) : e,
                        null == o ? o = "" : "number" == typeof o ? o += "" : Q.isArray(o) && (o = Q.map(o, function(e) {
                            return null == e ? "" : e + ""
                        })),
                        t = Q.valHooks[this.type] || Q.valHooks[this.nodeName.toLowerCase()],
                        t && "set"in t && void 0 !== t.set(this, o, "value") || (this.value = o))
                    })) : o ? (t = Q.valHooks[o.type] || Q.valHooks[o.nodeName.toLowerCase()],
                    t && "get"in t && void 0 !== (n = t.get(o, "value")) ? n : (n = o.value,
                    "string" == typeof n ? n.replace(cn, "") : null == n ? "" : n)) : void 0
                }
            }),
            Q.extend({
                valHooks: {
                    option: {
                        get: function(e) {
                            var t = Q.find.attr(e, "value");
                            return null != t ? t : Q.trim(Q.text(e))
                        }
                    },
                    select: {
                        get: function(e) {
                            for (var t, n, a = e.options, o = e.selectedIndex, r = "select-one" === e.type || 0 > o, i = r ? null : [], s = r ? o + 1 : a.length, l = 0 > o ? s : r ? o : 0; s > l; l++)
                                if (n = a[l],
                                !(!n.selected && l !== o || (X.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && Q.nodeName(n.parentNode, "optgroup"))) {
                                    if (t = Q(n).val(),
                                    r)
                                        return t;
                                    i.push(t)
                                }
                            return i
                        },
                        set: function(e, t) {
                            for (var n, a, o = e.options, r = Q.makeArray(t), i = o.length; i--; )
                                a = o[i],
                                (a.selected = Q.inArray(a.value, r) >= 0) && (n = !0);
                            return n || (e.selectedIndex = -1),
                            r
                        }
                    }
                }
            }),
            Q.each(["radio", "checkbox"], function() {
                Q.valHooks[this] = {
                    set: function(e, t) {
                        return Q.isArray(t) ? e.checked = Q.inArray(Q(e).val(), t) >= 0 : void 0
                    }
                },
                X.checkOn || (Q.valHooks[this].get = function(e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                }
                )
            }),
            Q.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
                Q.fn[t] = function(e, n) {
                    return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
                }
            }),
            Q.fn.extend({
                hover: function(e, t) {
                    return this.mouseenter(e).mouseleave(t || e)
                },
                bind: function(e, t, n) {
                    return this.on(e, null, t, n)
                },
                unbind: function(e, t) {
                    return this.off(e, null, t)
                },
                delegate: function(e, t, n, a) {
                    return this.on(t, e, n, a)
                },
                undelegate: function(e, t, n) {
                    return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
                }
            });
            var un = Q.now()
              , pn = /\?/;
            Q.parseJSON = function(e) {
                return JSON.parse(e + "")
            }
            ,
            Q.parseXML = function(e) {
                var t, n;
                if (!e || "string" != typeof e)
                    return null;
                try {
                    n = new DOMParser,
                    t = n.parseFromString(e, "text/xml")
                } catch (a) {
                    t = void 0
                }
                return (!t || t.getElementsByTagName("parsererror").length) && Q.error("Invalid XML: " + e),
                t
            }
            ;
            var dn = /#.*$/
              , mn = /([?&])_=[^&]*/
              , hn = /^(.*?):[ \t]*([^\r\n]*)$/gm
              , fn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
              , gn = /^(?:GET|HEAD)$/
              , vn = /^\/\//
              , yn = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/
              , En = {}
              , bn = {}
              , Nn = "*/".concat("*")
              , kn = e.location.href
              , _n = yn.exec(kn.toLowerCase()) || [];
            Q.extend({
                active: 0,
                lastModified: {},
                etag: {},
                ajaxSettings: {
                    url: kn,
                    type: "GET",
                    isLocal: fn.test(_n[1]),
                    global: !0,
                    processData: !0,
                    async: !0,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    accepts: {
                        "*": Nn,
                        text: "text/plain",
                        html: "text/html",
                        xml: "application/xml, text/xml",
                        json: "application/json, text/javascript"
                    },
                    contents: {
                        xml: /xml/,
                        html: /html/,
                        json: /json/
                    },
                    responseFields: {
                        xml: "responseXML",
                        text: "responseText",
                        json: "responseJSON"
                    },
                    converters: {
                        "* text": String,
                        "text html": !0,
                        "text json": Q.parseJSON,
                        "text xml": Q.parseXML
                    },
                    flatOptions: {
                        url: !0,
                        context: !0
                    }
                },
                ajaxSetup: function(e, t) {
                    return t ? R(R(e, Q.ajaxSettings), t) : R(Q.ajaxSettings, e)
                },
                ajaxPrefilter: G(En),
                ajaxTransport: G(bn),
                ajax: function(e, t) {
                    function n(e, t, n, i) {
                        var l, u, v, y, b, k = t;
                        2 !== E && (E = 2,
                        s && clearTimeout(s),
                        a = void 0,
                        r = i || "",
                        N.readyState = e > 0 ? 4 : 0,
                        l = e >= 200 && 300 > e || 304 === e,
                        n && (y = F(p, N, n)),
                        y = I(p, y, N, l),
                        l ? (p.ifModified && (b = N.getResponseHeader("Last-Modified"),
                        b && (Q.lastModified[o] = b),
                        b = N.getResponseHeader("etag"),
                        b && (Q.etag[o] = b)),
                        204 === e || "HEAD" === p.type ? k = "nocontent" : 304 === e ? k = "notmodified" : (k = y.state,
                        u = y.data,
                        v = y.error,
                        l = !v)) : (v = k,
                        (e || !k) && (k = "error",
                        0 > e && (e = 0))),
                        N.status = e,
                        N.statusText = (t || k) + "",
                        l ? h.resolveWith(d, [u, k, N]) : h.rejectWith(d, [N, k, v]),
                        N.statusCode(g),
                        g = void 0,
                        c && m.trigger(l ? "ajaxSuccess" : "ajaxError", [N, p, l ? u : v]),
                        f.fireWith(d, [N, k]),
                        c && (m.trigger("ajaxComplete", [N, p]),
                        --Q.active || Q.event.trigger("ajaxStop")))
                    }
                    "object" == typeof e && (t = e,
                    e = void 0),
                    t = t || {};
                    var a, o, r, i, s, l, c, u, p = Q.ajaxSetup({}, t), d = p.context || p, m = p.context && (d.nodeType || d.jquery) ? Q(d) : Q.event, h = Q.Deferred(), f = Q.Callbacks("once memory"), g = p.statusCode || {}, v = {}, y = {}, E = 0, b = "canceled", N = {
                        readyState: 0,
                        getResponseHeader: function(e) {
                            var t;
                            if (2 === E) {
                                if (!i)
                                    for (i = {}; t = hn.exec(r); )
                                        i[t[1].toLowerCase()] = t[2];
                                t = i[e.toLowerCase()]
                            }
                            return null == t ? null : t
                        },
                        getAllResponseHeaders: function() {
                            return 2 === E ? r : null
                        },
                        setRequestHeader: function(e, t) {
                            var n = e.toLowerCase();
                            return E || (e = y[n] = y[n] || e,
                            v[e] = t),
                            this
                        },
                        overrideMimeType: function(e) {
                            return E || (p.mimeType = e),
                            this
                        },
                        statusCode: function(e) {
                            var t;
                            if (e)
                                if (2 > E)
                                    for (t in e)
                                        g[t] = [g[t], e[t]];
                                else
                                    N.always(e[N.status]);
                            return this
                        },
                        abort: function(e) {
                            var t = e || b;
                            return a && a.abort(t),
                            n(0, t),
                            this
                        }
                    };
                    if (h.promise(N).complete = f.add,
                    N.success = N.done,
                    N.error = N.fail,
                    p.url = ((e || p.url || kn) + "").replace(dn, "").replace(vn, _n[1] + "//"),
                    p.type = t.method || t.type || p.method || p.type,
                    p.dataTypes = Q.trim(p.dataType || "*").toLowerCase().match(mt) || [""],
                    null == p.crossDomain && (l = yn.exec(p.url.toLowerCase()),
                    p.crossDomain = !(!l || l[1] === _n[1] && l[2] === _n[2] && (l[3] || ("http:" === l[1] ? "80" : "443")) === (_n[3] || ("http:" === _n[1] ? "80" : "443")))),
                    p.data && p.processData && "string" != typeof p.data && (p.data = Q.param(p.data, p.traditional)),
                    P(En, p, t, N),
                    2 === E)
                        return N;
                    c = Q.event && p.global,
                    c && 0 === Q.active++ && Q.event.trigger("ajaxStart"),
                    p.type = p.type.toUpperCase(),
                    p.hasContent = !gn.test(p.type),
                    o = p.url,
                    p.hasContent || (p.data && (o = p.url += (pn.test(o) ? "&" : "?") + p.data,
                    delete p.data),
                    p.cache === !1 && (p.url = mn.test(o) ? o.replace(mn, "$1_=" + un++) : o + (pn.test(o) ? "&" : "?") + "_=" + un++)),
                    p.ifModified && (Q.lastModified[o] && N.setRequestHeader("If-Modified-Since", Q.lastModified[o]),
                    Q.etag[o] && N.setRequestHeader("If-None-Match", Q.etag[o])),
                    (p.data && p.hasContent && p.contentType !== !1 || t.contentType) && N.setRequestHeader("Content-Type", p.contentType),
                    N.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Nn + "; q=0.01" : "") : p.accepts["*"]);
                    for (u in p.headers)
                        N.setRequestHeader(u, p.headers[u]);
                    if (p.beforeSend && (p.beforeSend.call(d, N, p) === !1 || 2 === E))
                        return N.abort();
                    b = "abort";
                    for (u in {
                        success: 1,
                        error: 1,
                        complete: 1
                    })
                        N[u](p[u]);
                    if (a = P(bn, p, t, N)) {
                        N.readyState = 1,
                        c && m.trigger("ajaxSend", [N, p]),
                        p.async && p.timeout > 0 && (s = setTimeout(function() {
                            N.abort("timeout")
                        }, p.timeout));
                        try {
                            E = 1,
                            a.send(v, n)
                        } catch (k) {
                            if (!(2 > E))
                                throw k;
                            n(-1, k)
                        }
                    } else
                        n(-1, "No Transport");
                    return N
                },
                getJSON: function(e, t, n) {
                    return Q.get(e, t, n, "json")
                },
                getScript: function(e, t) {
                    return Q.get(e, void 0, t, "script")
                }
            }),
            Q.each(["get", "post"], function(e, t) {
                Q[t] = function(e, n, a, o) {
                    return Q.isFunction(n) && (o = o || a,
                    a = n,
                    n = void 0),
                    Q.ajax({
                        url: e,
                        type: t,
                        dataType: o,
                        data: n,
                        success: a
                    })
                }
            }),
            Q._evalUrl = function(e) {
                return Q.ajax({
                    url: e,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    "throws": !0
                })
            }
            ,
            Q.fn.extend({
                wrapAll: function(e) {
                    var t;
                    return Q.isFunction(e) ? this.each(function(t) {
                        Q(this).wrapAll(e.call(this, t))
                    }) : (this[0] && (t = Q(e, this[0].ownerDocument).eq(0).clone(!0),
                    this[0].parentNode && t.insertBefore(this[0]),
                    t.map(function() {
                        for (var e = this; e.firstElementChild; )
                            e = e.firstElementChild;
                        return e
                    }).append(this)),
                    this)
                },
                wrapInner: function(e) {
                    return this.each(Q.isFunction(e) ? function(t) {
                        Q(this).wrapInner(e.call(this, t))
                    }
                    : function() {
                        var t = Q(this)
                          , n = t.contents();
                        n.length ? n.wrapAll(e) : t.append(e)
                    }
                    )
                },
                wrap: function(e) {
                    var t = Q.isFunction(e);
                    return this.each(function(n) {
                        Q(this).wrapAll(t ? e.call(this, n) : e)
                    })
                },
                unwrap: function() {
                    return this.parent().each(function() {
                        Q.nodeName(this, "body") || Q(this).replaceWith(this.childNodes)
                    }).end()
                }
            }),
            Q.expr.filters.hidden = function(e) {
                return e.offsetWidth <= 0 && e.offsetHeight <= 0
            }
            ,
            Q.expr.filters.visible = function(e) {
                return !Q.expr.filters.hidden(e)
            }
            ;
            var wn = /%20/g
              , xn = /\[\]$/
              , Cn = /\r?\n/g
              , Tn = /^(?:submit|button|image|reset|file)$/i
              , Dn = /^(?:input|select|textarea|keygen)/i;
            Q.param = function(e, t) {
                var n, a = [], o = function(e, t) {
                    t = Q.isFunction(t) ? t() : null == t ? "" : t,
                    a[a.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                };
                if (void 0 === t && (t = Q.ajaxSettings && Q.ajaxSettings.traditional),
                Q.isArray(e) || e.jquery && !Q.isPlainObject(e))
                    Q.each(e, function() {
                        o(this.name, this.value)
                    });
                else
                    for (n in e)
                        j(n, e[n], t, o);
                return a.join("&").replace(wn, "+")
            }
            ,
            Q.fn.extend({
                serialize: function() {
                    return Q.param(this.serializeArray())
                },
                serializeArray: function() {
                    return this.map(function() {
                        var e = Q.prop(this, "elements");
                        return e ? Q.makeArray(e) : this
                    }).filter(function() {
                        var e = this.type;
                        return this.name && !Q(this).is(":disabled") && Dn.test(this.nodeName) && !Tn.test(e) && (this.checked || !wt.test(e))
                    }).map(function(e, t) {
                        var n = Q(this).val();
                        return null == n ? null : Q.isArray(n) ? Q.map(n, function(e) {
                            return {
                                name: t.name,
                                value: e.replace(Cn, "\r\n")
                            }
                        }) : {
                            name: t.name,
                            value: n.replace(Cn, "\r\n")
                        }
                    }).get()
                }
            }),
            Q.ajaxSettings.xhr = function() {
                try {
                    return new XMLHttpRequest
                } catch (e) {}
            }
            ;
            var Mn = 0
              , Sn = {}
              , On = {
                0: 200,
                1223: 204
            }
              , An = Q.ajaxSettings.xhr();
            e.attachEvent && e.attachEvent("onunload", function() {
                for (var e in Sn)
                    Sn[e]()
            }),
            X.cors = !!An && "withCredentials"in An,
            X.ajax = An = !!An,
            Q.ajaxTransport(function(e) {
                var t;
                return X.cors || An && !e.crossDomain ? {
                    send: function(n, a) {
                        var o, r = e.xhr(), i = ++Mn;
                        if (r.open(e.type, e.url, e.async, e.username, e.password),
                        e.xhrFields)
                            for (o in e.xhrFields)
                                r[o] = e.xhrFields[o];
                        e.mimeType && r.overrideMimeType && r.overrideMimeType(e.mimeType),
                        e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                        for (o in n)
                            r.setRequestHeader(o, n[o]);
                        t = function(e) {
                            return function() {
                                t && (delete Sn[i],
                                t = r.onload = r.onerror = null,
                                "abort" === e ? r.abort() : "error" === e ? a(r.status, r.statusText) : a(On[r.status] || r.status, r.statusText, "string" == typeof r.responseText ? {
                                    text: r.responseText
                                } : void 0, r.getAllResponseHeaders()))
                            }
                        }
                        ,
                        r.onload = t(),
                        r.onerror = t("error"),
                        t = Sn[i] = t("abort");
                        try {
                            r.send(e.hasContent && e.data || null)
                        } catch (s) {
                            if (t)
                                throw s
                        }
                    },
                    abort: function() {
                        t && t()
                    }
                } : void 0
            }),
            Q.ajaxSetup({
                accepts: {
                    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                },
                contents: {
                    script: /(?:java|ecma)script/
                },
                converters: {
                    "text script": function(e) {
                        return Q.globalEval(e),
                        e
                    }
                }
            }),
            Q.ajaxPrefilter("script", function(e) {
                void 0 === e.cache && (e.cache = !1),
                e.crossDomain && (e.type = "GET")
            }),
            Q.ajaxTransport("script", function(e) {
                if (e.crossDomain) {
                    var t, n;
                    return {
                        send: function(a, o) {
                            t = Q("<script>").prop({
                                async: !0,
                                charset: e.scriptCharset,
                                src: e.url
                            }).on("load error", n = function(e) {
                                t.remove(),
                                n = null,
                                e && o("error" === e.type ? 404 : 200, e.type)
                            }
                            ),
                            Z.head.appendChild(t[0])
                        },
                        abort: function() {
                            n && n()
                        }
                    }
                }
            });
            var Ln = []
              , Bn = /(=)\?(?=&|$)|\?\?/;
            Q.ajaxSetup({
                jsonp: "callback",
                jsonpCallback: function() {
                    var e = Ln.pop() || Q.expando + "_" + un++;
                    return this[e] = !0,
                    e
                }
            }),
            Q.ajaxPrefilter("json jsonp", function(t, n, a) {
                var o, r, i, s = t.jsonp !== !1 && (Bn.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && Bn.test(t.data) && "data");
                return s || "jsonp" === t.dataTypes[0] ? (o = t.jsonpCallback = Q.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
                s ? t[s] = t[s].replace(Bn, "$1" + o) : t.jsonp !== !1 && (t.url += (pn.test(t.url) ? "&" : "?") + t.jsonp + "=" + o),
                t.converters["script json"] = function() {
                    return i || Q.error(o + " was not called"),
                    i[0]
                }
                ,
                t.dataTypes[0] = "json",
                r = e[o],
                e[o] = function() {
                    i = arguments
                }
                ,
                a.always(function() {
                    e[o] = r,
                    t[o] && (t.jsonpCallback = n.jsonpCallback,
                    Ln.push(o)),
                    i && Q.isFunction(r) && r(i[0]),
                    i = r = void 0
                }),
                "script") : void 0
            }),
            Q.parseHTML = function(e, t, n) {
                if (!e || "string" != typeof e)
                    return null;
                "boolean" == typeof t && (n = t,
                t = !1),
                t = t || Z;
                var a = it.exec(e)
                  , o = !n && [];
                return a ? [t.createElement(a[1])] : (a = Q.buildFragment([e], t, o),
                o && o.length && Q(o).remove(),
                Q.merge([], a.childNodes))
            }
            ;
            var Gn = Q.fn.load;
            Q.fn.load = function(e, t, n) {
                if ("string" != typeof e && Gn)
                    return Gn.apply(this, arguments);
                var a, o, r, i = this, s = e.indexOf(" ");
                return s >= 0 && (a = Q.trim(e.slice(s)),
                e = e.slice(0, s)),
                Q.isFunction(t) ? (n = t,
                t = void 0) : t && "object" == typeof t && (o = "POST"),
                i.length > 0 && Q.ajax({
                    url: e,
                    type: o,
                    dataType: "html",
                    data: t
                }).done(function(e) {
                    r = arguments,
                    i.html(a ? Q("<div>").append(Q.parseHTML(e)).find(a) : e)
                }).complete(n && function(e, t) {
                    i.each(n, r || [e.responseText, t, e])
                }
                ),
                this
            }
            ,
            Q.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
                Q.fn[t] = function(e) {
                    return this.on(t, e)
                }
            }),
            Q.expr.filters.animated = function(e) {
                return Q.grep(Q.timers, function(t) {
                    return e === t.elem
                }).length
            }
            ;
            var Pn = e.document.documentElement;
            Q.offset = {
                setOffset: function(e, t, n) {
                    var a, o, r, i, s, l, c, u = Q.css(e, "position"), p = Q(e), d = {};
                    "static" === u && (e.style.position = "relative"),
                    s = p.offset(),
                    r = Q.css(e, "top"),
                    l = Q.css(e, "left"),
                    c = ("absolute" === u || "fixed" === u) && (r + l).indexOf("auto") > -1,
                    c ? (a = p.position(),
                    i = a.top,
                    o = a.left) : (i = parseFloat(r) || 0,
                    o = parseFloat(l) || 0),
                    Q.isFunction(t) && (t = t.call(e, n, s)),
                    null != t.top && (d.top = t.top - s.top + i),
                    null != t.left && (d.left = t.left - s.left + o),
                    "using"in t ? t.using.call(e, d) : p.css(d)
                }
            },
            Q.fn.extend({
                offset: function(e) {
                    if (arguments.length)
                        return void 0 === e ? this : this.each(function(t) {
                            Q.offset.setOffset(this, e, t)
                        });
                    var t, n, a = this[0], o = {
                        top: 0,
                        left: 0
                    }, r = a && a.ownerDocument;
                    return r ? (t = r.documentElement,
                    Q.contains(t, a) ? (typeof a.getBoundingClientRect !== xt && (o = a.getBoundingClientRect()),
                    n = H(r),
                    {
                        top: o.top + n.pageYOffset - t.clientTop,
                        left: o.left + n.pageXOffset - t.clientLeft
                    }) : o) : void 0
                },
                position: function() {
                    if (this[0]) {
                        var e, t, n = this[0], a = {
                            top: 0,
                            left: 0
                        };
                        return "fixed" === Q.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(),
                        t = this.offset(),
                        Q.nodeName(e[0], "html") || (a = e.offset()),
                        a.top += Q.css(e[0], "borderTopWidth", !0),
                        a.left += Q.css(e[0], "borderLeftWidth", !0)),
                        {
                            top: t.top - a.top - Q.css(n, "marginTop", !0),
                            left: t.left - a.left - Q.css(n, "marginLeft", !0)
                        }
                    }
                },
                offsetParent: function() {
                    return this.map(function() {
                        for (var e = this.offsetParent || Pn; e && !Q.nodeName(e, "html") && "static" === Q.css(e, "position"); )
                            e = e.offsetParent;
                        return e || Pn
                    })
                }
            }),
            Q.each({
                scrollLeft: "pageXOffset",
                scrollTop: "pageYOffset"
            }, function(t, n) {
                var a = "pageYOffset" === n;
                Q.fn[t] = function(o) {
                    return gt(this, function(t, o, r) {
                        var i = H(t);
                        return void 0 === r ? i ? i[n] : t[o] : void (i ? i.scrollTo(a ? e.pageXOffset : r, a ? r : e.pageYOffset) : t[o] = r)
                    }, t, o, arguments.length, null)
                }
            }),
            Q.each(["top", "left"], function(e, t) {
                Q.cssHooks[t] = k(X.pixelPosition, function(e, n) {
                    return n ? (n = N(e, t),
                    Ut.test(n) ? Q(e).position()[t] + "px" : n) : void 0
                })
            }),
            Q.each({
                Height: "height",
                Width: "width"
            }, function(e, t) {
                Q.each({
                    padding: "inner" + e,
                    content: t,
                    "": "outer" + e
                }, function(n, a) {
                    Q.fn[a] = function(a, o) {
                        var r = arguments.length && (n || "boolean" != typeof a)
                          , i = n || (a === !0 || o === !0 ? "margin" : "border");
                        return gt(this, function(t, n, a) {
                            var o;
                            return Q.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement,
                            Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === a ? Q.css(t, n, i) : Q.style(t, n, a, i)
                        }, t, r ? a : void 0, r, null)
                    }
                })
            }),
            Q.fn.size = function() {
                return this.length
            }
            ,
            Q.fn.andSelf = Q.fn.addBack,
            "function" == typeof define && define.amd && define("jquery", [], function() {
                return Q
            });
            var Rn = e.jQuery
              , Fn = e.$;
            return Q.noConflict = function(t) {
                return e.$ === Q && (e.$ = Fn),
                t && e.jQuery === Q && (e.jQuery = Rn),
                Q
            }
            ,
            typeof t === xt && (e.jQuery = e.$ = Q),
            Q
        })
    }
    , {}]
}, {}, [1]);