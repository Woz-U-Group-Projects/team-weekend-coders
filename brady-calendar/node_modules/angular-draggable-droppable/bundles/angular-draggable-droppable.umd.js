(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('@angular/core'), require('rxjs/operators'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('angular-draggable-droppable', ['exports', 'rxjs', '@angular/core', 'rxjs/operators', '@angular/common'], factory) :
    (factory((global['angular-draggable-droppable'] = {}),global.rxjs,global.ng.core,global.rxjs.operators,global.ng.common));
}(this, (function (exports,rxjs,i0,operators,common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var DraggableHelper = /** @class */ (function () {
        function DraggableHelper() {
            this.currentDrag = new rxjs.Subject();
        }
        DraggableHelper.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */ DraggableHelper.ngInjectableDef = i0.defineInjectable({ factory: function DraggableHelper_Factory() { return new DraggableHelper(); }, token: DraggableHelper, providedIn: "root" });
        return DraggableHelper;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var DraggableScrollContainerDirective = /** @class */ (function () {
        function DraggableScrollContainerDirective(elementRef, renderer, zone) {
            this.elementRef = elementRef;
            this.renderer = renderer;
            this.zone = zone;
            /**
             * Trigger the DragStart after a long touch in scrollable container when true
             */
            this.activeLongPressDrag = false;
            /**
             * Configuration of a long touch
             * Duration in ms of a long touch before activating DragStart
             * Delta of the
             */
            this.longPressConfig = { duration: 300, delta: 30 };
            this.cancelledScroll = false;
        }
        /**
         * @return {?}
         */
        DraggableScrollContainerDirective.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.zone.runOutsideAngular(function () {
                    _this.renderer.listen(_this.elementRef.nativeElement, 'touchmove', function (event) {
                        if (_this.cancelledScroll && event.cancelable) {
                            event.preventDefault();
                        }
                    });
                });
            };
        /**
         * @return {?}
         */
        DraggableScrollContainerDirective.prototype.disableScroll = /**
         * @return {?}
         */
            function () {
                this.cancelledScroll = true;
                this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'hidden');
            };
        /**
         * @return {?}
         */
        DraggableScrollContainerDirective.prototype.enableScroll = /**
         * @return {?}
         */
            function () {
                this.cancelledScroll = false;
                this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'auto');
            };
        /**
         * @return {?}
         */
        DraggableScrollContainerDirective.prototype.hasScrollbar = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var containerHasHorizontalScroll = this.elementRef.nativeElement.scrollWidth -
                    this.elementRef.nativeElement.clientWidth >
                    0;
                /** @type {?} */
                var containerHasVerticalScroll = this.elementRef.nativeElement.scrollHeight -
                    this.elementRef.nativeElement.clientHeight >
                    0;
                return containerHasHorizontalScroll || containerHasVerticalScroll;
            };
        DraggableScrollContainerDirective.decorators = [
            { type: i0.Directive, args: [{
                        selector: '[mwlDraggableScrollContainer]'
                    },] }
        ];
        /** @nocollapse */
        DraggableScrollContainerDirective.ctorParameters = function () {
            return [
                { type: i0.ElementRef },
                { type: i0.Renderer2 },
                { type: i0.NgZone }
            ];
        };
        DraggableScrollContainerDirective.propDecorators = {
            activeLongPressDrag: [{ type: i0.Input }],
            longPressConfig: [{ type: i0.Input }]
        };
        return DraggableScrollContainerDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var DraggableDirective = /** @class */ (function () {
        /**
         * @hidden
         */
        function DraggableDirective(element, renderer, draggableHelper, zone, vcr, scrollContainer, document) {
            this.element = element;
            this.renderer = renderer;
            this.draggableHelper = draggableHelper;
            this.zone = zone;
            this.vcr = vcr;
            this.scrollContainer = scrollContainer;
            this.document = document;
            /**
             * The axis along which the element is draggable
             */
            this.dragAxis = { x: true, y: true };
            /**
             * Snap all drags to an x / y grid
             */
            this.dragSnapGrid = {};
            /**
             * Show a ghost element that shows the drag when dragging
             */
            this.ghostDragEnabled = true;
            /**
             * Show the original element when ghostDragEnabled is true
             */
            this.showOriginalElementWhileDragging = false;
            /**
             * The cursor to use when dragging the element
             */
            this.dragCursor = '';
            /**
             * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
             */
            this.dragPointerDown = new i0.EventEmitter();
            /**
             * Called when the element has started to be dragged.
             * Only called after at least one mouse or touch move event.
             * If you call $event.cancelDrag$.emit() it will cancel the current drag
             */
            this.dragStart = new i0.EventEmitter();
            /**
             * Called after the ghost element has been created
             */
            this.ghostElementCreated = new i0.EventEmitter();
            /**
             * Called when the element is being dragged
             */
            this.dragging = new i0.EventEmitter();
            /**
             * Called after the element is dragged
             */
            this.dragEnd = new i0.EventEmitter();
            /**
             * @hidden
             */
            this.pointerDown$ = new rxjs.Subject();
            /**
             * @hidden
             */
            this.pointerMove$ = new rxjs.Subject();
            /**
             * @hidden
             */
            this.pointerUp$ = new rxjs.Subject();
            this.eventListenerSubscriptions = {};
            this.destroy$ = new rxjs.Subject();
            this.timeLongPress = { timerBegin: 0, timerEnd: 0 };
        }
        /**
         * @return {?}
         */
        DraggableDirective.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.checkEventListeners();
                /** @type {?} */
                var pointerDragged$ = this.pointerDown$.pipe(operators.filter(function () { return _this.canDrag(); }), operators.mergeMap(function (pointerDownEvent) {
                    // fix for https://github.com/mattlewis92/angular-draggable-droppable/issues/61
                    // stop mouse events propagating up the chain
                    if (pointerDownEvent.event.stopPropagation && !_this.scrollContainer) {
                        pointerDownEvent.event.stopPropagation();
                    }
                    /** @type {?} */
                    var globalDragStyle = _this.renderer.createElement('style');
                    _this.renderer.setAttribute(globalDragStyle, 'type', 'text/css');
                    _this.renderer.appendChild(globalDragStyle, _this.renderer.createText("\n          body * {\n           -moz-user-select: none;\n           -ms-user-select: none;\n           -webkit-user-select: none;\n           user-select: none;\n          }\n        "));
                    _this.document.head.appendChild(globalDragStyle);
                    /** @type {?} */
                    var startScrollPosition = _this.getScrollPosition();
                    /** @type {?} */
                    var scrollContainerScroll$ = new rxjs.Observable(function (observer) {
                        /** @type {?} */
                        var scrollContainer = _this.scrollContainer
                            ? _this.scrollContainer.elementRef.nativeElement
                            : 'window';
                        return _this.renderer.listen(scrollContainer, 'scroll', function (e) {
                            return observer.next(e);
                        });
                    }).pipe(operators.startWith(startScrollPosition), operators.map(function () { return _this.getScrollPosition(); }));
                    /** @type {?} */
                    var currentDrag$ = new rxjs.Subject();
                    /** @type {?} */
                    var cancelDrag$ = new rxjs.ReplaySubject();
                    _this.zone.run(function () {
                        _this.dragPointerDown.next({ x: 0, y: 0 });
                    });
                    /** @type {?} */
                    var dragComplete$ = rxjs.merge(_this.pointerUp$, _this.pointerDown$, cancelDrag$, _this.destroy$).pipe(operators.share());
                    /** @type {?} */
                    var pointerMove = rxjs.combineLatest(_this.pointerMove$, scrollContainerScroll$).pipe(operators.map(function (_a) {
                        var _b = __read(_a, 2), pointerMoveEvent = _b[0], scroll = _b[1];
                        return {
                            currentDrag$: currentDrag$,
                            transformX: pointerMoveEvent.clientX - pointerDownEvent.clientX,
                            transformY: pointerMoveEvent.clientY - pointerDownEvent.clientY,
                            clientX: pointerMoveEvent.clientX,
                            clientY: pointerMoveEvent.clientY,
                            scrollLeft: scroll.left,
                            scrollTop: scroll.top
                        };
                    }), operators.map(function (moveData) {
                        if (_this.dragSnapGrid.x) {
                            moveData.transformX =
                                Math.round(moveData.transformX / _this.dragSnapGrid.x) *
                                    _this.dragSnapGrid.x;
                        }
                        if (_this.dragSnapGrid.y) {
                            moveData.transformY =
                                Math.round(moveData.transformY / _this.dragSnapGrid.y) *
                                    _this.dragSnapGrid.y;
                        }
                        return moveData;
                    }), operators.map(function (moveData) {
                        if (!_this.dragAxis.x) {
                            moveData.transformX = 0;
                        }
                        if (!_this.dragAxis.y) {
                            moveData.transformY = 0;
                        }
                        return moveData;
                    }), operators.map(function (moveData) {
                        /** @type {?} */
                        var scrollX = moveData.scrollLeft - startScrollPosition.left;
                        /** @type {?} */
                        var scrollY = moveData.scrollTop - startScrollPosition.top;
                        return __assign({}, moveData, { x: moveData.transformX + scrollX, y: moveData.transformY + scrollY });
                    }), operators.filter(function (_a) {
                        var x = _a.x, y = _a.y;
                        return !_this.validateDrag || _this.validateDrag({ x: x, y: y });
                    }), operators.takeUntil(dragComplete$), operators.share());
                    /** @type {?} */
                    var dragStarted$ = pointerMove.pipe(operators.take(1), operators.share());
                    /** @type {?} */
                    var dragEnded$ = pointerMove.pipe(operators.takeLast(1), operators.share());
                    dragStarted$.subscribe(function (_a) {
                        var clientX = _a.clientX, clientY = _a.clientY, x = _a.x, y = _a.y;
                        _this.zone.run(function () {
                            _this.dragStart.next({ cancelDrag$: cancelDrag$ });
                        });
                        _this.renderer.addClass(_this.element.nativeElement, _this.dragActiveClass);
                        if (_this.ghostDragEnabled) {
                            /** @type {?} */
                            var rect = _this.element.nativeElement.getBoundingClientRect();
                            /** @type {?} */
                            var clone_1 = /** @type {?} */ (_this.element.nativeElement.cloneNode(true));
                            if (!_this.showOriginalElementWhileDragging) {
                                _this.renderer.setStyle(_this.element.nativeElement, 'visibility', 'hidden');
                            }
                            if (_this.ghostElementAppendTo) {
                                _this.ghostElementAppendTo.appendChild(clone_1);
                            }
                            else {
                                /** @type {?} */ ((_this.element.nativeElement.parentNode)).insertBefore(clone_1, _this.element.nativeElement.nextSibling);
                            }
                            _this.ghostElement = clone_1;
                            _this.setElementStyles(clone_1, {
                                position: 'fixed',
                                top: rect.top + "px",
                                left: rect.left + "px",
                                width: rect.width + "px",
                                height: rect.height + "px",
                                cursor: _this.dragCursor,
                                margin: '0'
                            });
                            if (_this.ghostElementTemplate) {
                                /** @type {?} */
                                var viewRef_1 = _this.vcr.createEmbeddedView(_this.ghostElementTemplate);
                                clone_1.innerHTML = '';
                                viewRef_1.rootNodes
                                    .filter(function (node) { return node instanceof Node; })
                                    .forEach(function (node) {
                                    clone_1.appendChild(node);
                                });
                                dragEnded$.subscribe(function () {
                                    _this.vcr.remove(_this.vcr.indexOf(viewRef_1));
                                });
                            }
                            _this.zone.run(function () {
                                _this.ghostElementCreated.emit({
                                    clientX: clientX - x,
                                    clientY: clientY - y,
                                    element: clone_1
                                });
                            });
                            dragEnded$.subscribe(function () {
                                /** @type {?} */ ((clone_1.parentElement)).removeChild(clone_1);
                                _this.ghostElement = null;
                                _this.renderer.setStyle(_this.element.nativeElement, 'visibility', '');
                            });
                        }
                        _this.draggableHelper.currentDrag.next(currentDrag$);
                    });
                    dragEnded$
                        .pipe(operators.mergeMap(function (dragEndData) {
                        /** @type {?} */
                        var dragEndData$ = cancelDrag$.pipe(operators.count(), operators.take(1), operators.map(function (calledCount) { return (__assign({}, dragEndData, { dragCancelled: calledCount > 0 })); }));
                        cancelDrag$.complete();
                        return dragEndData$;
                    }))
                        .subscribe(function (_a) {
                        var x = _a.x, y = _a.y, dragCancelled = _a.dragCancelled;
                        _this.zone.run(function () {
                            _this.dragEnd.next({ x: x, y: y, dragCancelled: dragCancelled });
                        });
                        _this.renderer.removeClass(_this.element.nativeElement, _this.dragActiveClass);
                        currentDrag$.complete();
                    });
                    rxjs.merge(dragComplete$, dragEnded$)
                        .pipe(operators.take(1))
                        .subscribe(function () {
                        _this.document.head.removeChild(globalDragStyle);
                    });
                    return pointerMove;
                }), operators.share());
                rxjs.merge(pointerDragged$.pipe(operators.take(1), operators.map(function (value) { return [, value]; })), pointerDragged$.pipe(operators.pairwise()))
                    .pipe(operators.filter(function (_a) {
                    var _b = __read(_a, 2), previous = _b[0], next = _b[1];
                    if (!previous) {
                        return true;
                    }
                    return previous.x !== next.x || previous.y !== next.y;
                }), operators.map(function (_a) {
                    var _b = __read(_a, 2), previous = _b[0], next = _b[1];
                    return next;
                }))
                    .subscribe(function (_a) {
                    var x = _a.x, y = _a.y, currentDrag$ = _a.currentDrag$, clientX = _a.clientX, clientY = _a.clientY, transformX = _a.transformX, transformY = _a.transformY;
                    _this.zone.run(function () {
                        _this.dragging.next({ x: x, y: y });
                    });
                    if (_this.ghostElement) {
                        /** @type {?} */
                        var transform = "translate(" + transformX + "px, " + transformY + "px)";
                        _this.setElementStyles(_this.ghostElement, {
                            transform: transform,
                            '-webkit-transform': transform,
                            '-ms-transform': transform,
                            '-moz-transform': transform,
                            '-o-transform': transform
                        });
                    }
                    currentDrag$.next({
                        clientX: clientX,
                        clientY: clientY,
                        dropData: _this.dropData
                    });
                });
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        DraggableDirective.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes["dragAxis"]) {
                    this.checkEventListeners();
                }
            };
        /**
         * @return {?}
         */
        DraggableDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this.unsubscribeEventListeners();
                this.pointerDown$.complete();
                this.pointerMove$.complete();
                this.pointerUp$.complete();
                this.destroy$.next();
            };
        /**
         * @return {?}
         */
        DraggableDirective.prototype.checkEventListeners = /**
         * @return {?}
         */
            function () {
                var _this = this;
                /** @type {?} */
                var canDrag = this.canDrag();
                /** @type {?} */
                var hasEventListeners = Object.keys(this.eventListenerSubscriptions).length > 0;
                if (canDrag && !hasEventListeners) {
                    this.zone.runOutsideAngular(function () {
                        _this.eventListenerSubscriptions.mousedown = _this.renderer.listen(_this.element.nativeElement, 'mousedown', function (event) {
                            _this.onMouseDown(event);
                        });
                        _this.eventListenerSubscriptions.mouseup = _this.renderer.listen('document', 'mouseup', function (event) {
                            _this.onMouseUp(event);
                        });
                        _this.eventListenerSubscriptions.touchstart = _this.renderer.listen(_this.element.nativeElement, 'touchstart', function (event) {
                            _this.onTouchStart(event);
                        });
                        _this.eventListenerSubscriptions.touchend = _this.renderer.listen('document', 'touchend', function (event) {
                            _this.onTouchEnd(event);
                        });
                        _this.eventListenerSubscriptions.touchcancel = _this.renderer.listen('document', 'touchcancel', function (event) {
                            _this.onTouchEnd(event);
                        });
                        _this.eventListenerSubscriptions.mouseenter = _this.renderer.listen(_this.element.nativeElement, 'mouseenter', function () {
                            _this.onMouseEnter();
                        });
                        _this.eventListenerSubscriptions.mouseleave = _this.renderer.listen(_this.element.nativeElement, 'mouseleave', function () {
                            _this.onMouseLeave();
                        });
                    });
                }
                else if (!canDrag && hasEventListeners) {
                    this.unsubscribeEventListeners();
                }
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DraggableDirective.prototype.onMouseDown = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                var _this = this;
                if (!this.eventListenerSubscriptions.mousemove) {
                    this.eventListenerSubscriptions.mousemove = this.renderer.listen('document', 'mousemove', function (mouseMoveEvent) {
                        _this.pointerMove$.next({
                            event: mouseMoveEvent,
                            clientX: mouseMoveEvent.clientX,
                            clientY: mouseMoveEvent.clientY
                        });
                    });
                }
                this.pointerDown$.next({
                    event: event,
                    clientX: event.clientX,
                    clientY: event.clientY
                });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DraggableDirective.prototype.onMouseUp = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                if (this.eventListenerSubscriptions.mousemove) {
                    this.eventListenerSubscriptions.mousemove();
                    delete this.eventListenerSubscriptions.mousemove;
                }
                this.pointerUp$.next({
                    event: event,
                    clientX: event.clientX,
                    clientY: event.clientY
                });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DraggableDirective.prototype.onTouchStart = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                var _this = this;
                if (!this.scrollContainer) {
                    try {
                        event.preventDefault();
                    }
                    catch (e) { }
                }
                /** @type {?} */
                var hasContainerScrollbar;
                /** @type {?} */
                var startScrollPosition;
                /** @type {?} */
                var isDragActivated;
                if (this.scrollContainer && this.scrollContainer.activeLongPressDrag) {
                    this.timeLongPress.timerBegin = Date.now();
                    isDragActivated = false;
                    hasContainerScrollbar = this.scrollContainer.hasScrollbar();
                    startScrollPosition = this.getScrollPosition();
                }
                if (!this.eventListenerSubscriptions.touchmove) {
                    this.eventListenerSubscriptions.touchmove = this.renderer.listen('document', 'touchmove', function (touchMoveEvent) {
                        if (_this.scrollContainer &&
                            _this.scrollContainer.activeLongPressDrag &&
                            !isDragActivated &&
                            hasContainerScrollbar) {
                            isDragActivated = _this.shouldBeginDrag(event, touchMoveEvent, startScrollPosition);
                        }
                        if (!_this.scrollContainer ||
                            !_this.scrollContainer.activeLongPressDrag ||
                            !hasContainerScrollbar ||
                            isDragActivated) {
                            _this.pointerMove$.next({
                                event: touchMoveEvent,
                                clientX: touchMoveEvent.targetTouches[0].clientX,
                                clientY: touchMoveEvent.targetTouches[0].clientY
                            });
                        }
                    });
                }
                this.pointerDown$.next({
                    event: event,
                    clientX: event.touches[0].clientX,
                    clientY: event.touches[0].clientY
                });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        DraggableDirective.prototype.onTouchEnd = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                if (this.eventListenerSubscriptions.touchmove) {
                    this.eventListenerSubscriptions.touchmove();
                    delete this.eventListenerSubscriptions.touchmove;
                    if (this.scrollContainer && this.scrollContainer.activeLongPressDrag) {
                        this.scrollContainer.enableScroll();
                    }
                }
                this.pointerUp$.next({
                    event: event,
                    clientX: event.changedTouches[0].clientX,
                    clientY: event.changedTouches[0].clientY
                });
            };
        /**
         * @return {?}
         */
        DraggableDirective.prototype.onMouseEnter = /**
         * @return {?}
         */
            function () {
                this.setCursor(this.dragCursor);
            };
        /**
         * @return {?}
         */
        DraggableDirective.prototype.onMouseLeave = /**
         * @return {?}
         */
            function () {
                this.setCursor('');
            };
        /**
         * @return {?}
         */
        DraggableDirective.prototype.canDrag = /**
         * @return {?}
         */
            function () {
                return this.dragAxis.x || this.dragAxis.y;
            };
        /**
         * @param {?} value
         * @return {?}
         */
        DraggableDirective.prototype.setCursor = /**
         * @param {?} value
         * @return {?}
         */
            function (value) {
                this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
            };
        /**
         * @return {?}
         */
        DraggableDirective.prototype.unsubscribeEventListeners = /**
         * @return {?}
         */
            function () {
                var _this = this;
                Object.keys(this.eventListenerSubscriptions).forEach(function (type) {
                    ( /** @type {?} */(_this)).eventListenerSubscriptions[type]();
                    delete ( /** @type {?} */(_this)).eventListenerSubscriptions[type];
                });
            };
        /**
         * @param {?} element
         * @param {?} styles
         * @return {?}
         */
        DraggableDirective.prototype.setElementStyles = /**
         * @param {?} element
         * @param {?} styles
         * @return {?}
         */
            function (element, styles) {
                var _this = this;
                Object.keys(styles).forEach(function (key) {
                    _this.renderer.setStyle(element, key, styles[key]);
                });
            };
        /**
         * @return {?}
         */
        DraggableDirective.prototype.getScrollPosition = /**
         * @return {?}
         */
            function () {
                if (this.scrollContainer) {
                    return {
                        top: this.scrollContainer.elementRef.nativeElement.scrollTop,
                        left: this.scrollContainer.elementRef.nativeElement.scrollLeft
                    };
                }
                else {
                    return {
                        top: window.pageYOffset || document.documentElement.scrollTop,
                        left: window.pageXOffset || document.documentElement.scrollLeft
                    };
                }
            };
        /**
         * @param {?} event
         * @param {?} touchMoveEvent
         * @param {?} startScrollPosition
         * @return {?}
         */
        DraggableDirective.prototype.shouldBeginDrag = /**
         * @param {?} event
         * @param {?} touchMoveEvent
         * @param {?} startScrollPosition
         * @return {?}
         */
            function (event, touchMoveEvent, startScrollPosition) {
                /** @type {?} */
                var moveScrollPosition = this.getScrollPosition();
                /** @type {?} */
                var deltaScroll = {
                    top: Math.abs(moveScrollPosition.top - startScrollPosition.top),
                    left: Math.abs(moveScrollPosition.left - startScrollPosition.left)
                };
                /** @type {?} */
                var deltaX = Math.abs(touchMoveEvent.targetTouches[0].clientX - event.touches[0].clientX) - deltaScroll.left;
                /** @type {?} */
                var deltaY = Math.abs(touchMoveEvent.targetTouches[0].clientY - event.touches[0].clientY) - deltaScroll.top;
                /** @type {?} */
                var deltaTotal = deltaX + deltaY;
                if (deltaTotal > this.scrollContainer.longPressConfig.delta ||
                    deltaScroll.top > 0 ||
                    deltaScroll.left > 0) {
                    this.timeLongPress.timerBegin = Date.now();
                }
                this.timeLongPress.timerEnd = Date.now();
                /** @type {?} */
                var duration = this.timeLongPress.timerEnd - this.timeLongPress.timerBegin;
                if (duration >= this.scrollContainer.longPressConfig.duration) {
                    this.scrollContainer.disableScroll();
                    return true;
                }
                return false;
            };
        DraggableDirective.decorators = [
            { type: i0.Directive, args: [{
                        selector: '[mwlDraggable]'
                    },] }
        ];
        /** @nocollapse */
        DraggableDirective.ctorParameters = function () {
            return [
                { type: i0.ElementRef },
                { type: i0.Renderer2 },
                { type: DraggableHelper },
                { type: i0.NgZone },
                { type: i0.ViewContainerRef },
                { type: DraggableScrollContainerDirective, decorators: [{ type: i0.Optional }] },
                { type: undefined, decorators: [{ type: i0.Inject, args: [common.DOCUMENT,] }] }
            ];
        };
        DraggableDirective.propDecorators = {
            dropData: [{ type: i0.Input }],
            dragAxis: [{ type: i0.Input }],
            dragSnapGrid: [{ type: i0.Input }],
            ghostDragEnabled: [{ type: i0.Input }],
            showOriginalElementWhileDragging: [{ type: i0.Input }],
            validateDrag: [{ type: i0.Input }],
            dragCursor: [{ type: i0.Input }],
            dragActiveClass: [{ type: i0.Input }],
            ghostElementAppendTo: [{ type: i0.Input }],
            ghostElementTemplate: [{ type: i0.Input }],
            dragPointerDown: [{ type: i0.Output }],
            dragStart: [{ type: i0.Output }],
            ghostElementCreated: [{ type: i0.Output }],
            dragging: [{ type: i0.Output }],
            dragEnd: [{ type: i0.Output }]
        };
        return DraggableDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * @param {?} clientX
     * @param {?} clientY
     * @param {?} rect
     * @return {?}
     */
    function isCoordinateWithinRectangle(clientX, clientY, rect) {
        return (clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom);
    }
    var DroppableDirective = /** @class */ (function () {
        function DroppableDirective(element, draggableHelper, zone, renderer, scrollContainer) {
            this.element = element;
            this.draggableHelper = draggableHelper;
            this.zone = zone;
            this.renderer = renderer;
            this.scrollContainer = scrollContainer;
            /**
             * Called when a draggable element starts overlapping the element
             */
            this.dragEnter = new i0.EventEmitter();
            /**
             * Called when a draggable element stops overlapping the element
             */
            this.dragLeave = new i0.EventEmitter();
            /**
             * Called when a draggable element is moved over the element
             */
            this.dragOver = new i0.EventEmitter();
            /**
             * Called when a draggable element is dropped on this element
             */
            this.drop = new i0.EventEmitter();
        }
        /**
         * @return {?}
         */
        DroppableDirective.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.currentDragSubscription = this.draggableHelper.currentDrag.subscribe(function (drag$) {
                    _this.renderer.addClass(_this.element.nativeElement, _this.dragActiveClass);
                    /** @type {?} */
                    var droppableElement = {
                        updateCache: true
                    };
                    /** @type {?} */
                    var deregisterScrollListener = _this.renderer.listen(_this.scrollContainer
                        ? _this.scrollContainer.elementRef.nativeElement
                        : 'window', 'scroll', function () {
                        droppableElement.updateCache = true;
                    });
                    /** @type {?} */
                    var currentDragDropData;
                    /** @type {?} */
                    var overlaps$ = drag$.pipe(operators.map(function (_a) {
                        var clientX = _a.clientX, clientY = _a.clientY, dropData = _a.dropData;
                        currentDragDropData = dropData;
                        if (droppableElement.updateCache) {
                            droppableElement.rect = _this.element.nativeElement.getBoundingClientRect();
                            if (_this.scrollContainer) {
                                droppableElement.scrollContainerRect = _this.scrollContainer.elementRef.nativeElement.getBoundingClientRect();
                            }
                            droppableElement.updateCache = false;
                        }
                        /** @type {?} */
                        var isWithinElement = isCoordinateWithinRectangle(clientX, clientY, /** @type {?} */ (droppableElement.rect));
                        if (droppableElement.scrollContainerRect) {
                            return (isWithinElement &&
                                isCoordinateWithinRectangle(clientX, clientY, /** @type {?} */ (droppableElement.scrollContainerRect)));
                        }
                        else {
                            return isWithinElement;
                        }
                    }));
                    /** @type {?} */
                    var overlapsChanged$ = overlaps$.pipe(operators.distinctUntilChanged());
                    /** @type {?} */
                    var dragOverActive; // TODO - see if there's a way of doing this via rxjs
                    overlapsChanged$
                        .pipe(operators.filter(function (overlapsNow) { return overlapsNow; }))
                        .subscribe(function () {
                        dragOverActive = true;
                        _this.renderer.addClass(_this.element.nativeElement, _this.dragOverClass);
                        _this.zone.run(function () {
                            _this.dragEnter.next({
                                dropData: currentDragDropData
                            });
                        });
                    });
                    overlaps$.pipe(operators.filter(function (overlapsNow) { return overlapsNow; })).subscribe(function () {
                        _this.zone.run(function () {
                            _this.dragOver.next({
                                dropData: currentDragDropData
                            });
                        });
                    });
                    overlapsChanged$
                        .pipe(operators.pairwise(), operators.filter(function (_a) {
                        var _b = __read(_a, 2), didOverlap = _b[0], overlapsNow = _b[1];
                        return didOverlap && !overlapsNow;
                    }))
                        .subscribe(function () {
                        dragOverActive = false;
                        _this.renderer.removeClass(_this.element.nativeElement, _this.dragOverClass);
                        _this.zone.run(function () {
                            _this.dragLeave.next({
                                dropData: currentDragDropData
                            });
                        });
                    });
                    drag$.subscribe({
                        complete: function () {
                            deregisterScrollListener();
                            _this.renderer.removeClass(_this.element.nativeElement, _this.dragActiveClass);
                            if (dragOverActive) {
                                _this.renderer.removeClass(_this.element.nativeElement, _this.dragOverClass);
                                _this.zone.run(function () {
                                    _this.drop.next({
                                        dropData: currentDragDropData
                                    });
                                });
                            }
                        }
                    });
                });
            };
        /**
         * @return {?}
         */
        DroppableDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                if (this.currentDragSubscription) {
                    this.currentDragSubscription.unsubscribe();
                }
            };
        DroppableDirective.decorators = [
            { type: i0.Directive, args: [{
                        selector: '[mwlDroppable]'
                    },] }
        ];
        /** @nocollapse */
        DroppableDirective.ctorParameters = function () {
            return [
                { type: i0.ElementRef },
                { type: DraggableHelper },
                { type: i0.NgZone },
                { type: i0.Renderer2 },
                { type: DraggableScrollContainerDirective, decorators: [{ type: i0.Optional }] }
            ];
        };
        DroppableDirective.propDecorators = {
            dragOverClass: [{ type: i0.Input }],
            dragActiveClass: [{ type: i0.Input }],
            dragEnter: [{ type: i0.Output }],
            dragLeave: [{ type: i0.Output }],
            dragOver: [{ type: i0.Output }],
            drop: [{ type: i0.Output }]
        };
        return DroppableDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var DragAndDropModule = /** @class */ (function () {
        function DragAndDropModule() {
        }
        DragAndDropModule.decorators = [
            { type: i0.NgModule, args: [{
                        declarations: [
                            DraggableDirective,
                            DroppableDirective,
                            DraggableScrollContainerDirective
                        ],
                        exports: [
                            DraggableDirective,
                            DroppableDirective,
                            DraggableScrollContainerDirective
                        ]
                    },] }
        ];
        return DragAndDropModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.DragAndDropModule = DragAndDropModule;
    exports.ɵc = DraggableHelper;
    exports.ɵd = DraggableScrollContainerDirective;
    exports.ɵb = DraggableDirective;
    exports.ɵa = DroppableDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kcmFnZ2FibGUtZHJvcHBhYmxlLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCJuZzovL2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZS9saWIvZHJhZ2dhYmxlLWhlbHBlci5wcm92aWRlci50cyIsIm5nOi8vYW5ndWxhci1kcmFnZ2FibGUtZHJvcHBhYmxlL2xpYi9kcmFnZ2FibGUtc2Nyb2xsLWNvbnRhaW5lci5kaXJlY3RpdmUudHMiLCJuZzovL2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZS9saWIvZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vYW5ndWxhci1kcmFnZ2FibGUtZHJvcHBhYmxlL2xpYi9kcm9wcGFibGUuZGlyZWN0aXZlLnRzIiwibmc6Ly9hbmd1bGFyLWRyYWdnYWJsZS1kcm9wcGFibGUvbGliL2RyYWctYW5kLWRyb3AubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEN1cnJlbnREcmFnRGF0YSB7XG4gIGNsaWVudFg6IG51bWJlcjtcbiAgY2xpZW50WTogbnVtYmVyO1xuICBkcm9wRGF0YTogYW55O1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVIZWxwZXIge1xuICBjdXJyZW50RHJhZyA9IG5ldyBTdWJqZWN0PFN1YmplY3Q8Q3VycmVudERyYWdEYXRhPj4oKTtcbn1cbiIsImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25Jbml0LFxuICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttd2xEcmFnZ2FibGVTY3JvbGxDb250YWluZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVTY3JvbGxDb250YWluZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICAvKipcbiAgICogVHJpZ2dlciB0aGUgRHJhZ1N0YXJ0IGFmdGVyIGEgbG9uZyB0b3VjaCBpbiBzY3JvbGxhYmxlIGNvbnRhaW5lciB3aGVuIHRydWVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGFjdGl2ZUxvbmdQcmVzc0RyYWc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBvZiBhIGxvbmcgdG91Y2hcbiAgICogRHVyYXRpb24gaW4gbXMgb2YgYSBsb25nIHRvdWNoIGJlZm9yZSBhY3RpdmF0aW5nIERyYWdTdGFydFxuICAgKiBEZWx0YSBvZiB0aGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGxvbmdQcmVzc0NvbmZpZyA9IHsgZHVyYXRpb246IDMwMCwgZGVsdGE6IDMwIH07XG5cbiAgcHJpdmF0ZSBjYW5jZWxsZWRTY3JvbGwgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAndG91Y2htb3ZlJyxcbiAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuY2FuY2VsbGVkU2Nyb2xsICYmIGV2ZW50LmNhbmNlbGFibGUpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzYWJsZVNjcm9sbCgpOiB2b2lkIHtcbiAgICB0aGlzLmNhbmNlbGxlZFNjcm9sbCA9IHRydWU7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICB9XG5cbiAgZW5hYmxlU2Nyb2xsKCk6IHZvaWQge1xuICAgIHRoaXMuY2FuY2VsbGVkU2Nyb2xsID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ292ZXJmbG93JywgJ2F1dG8nKTtcbiAgfVxuXG4gIGhhc1Njcm9sbGJhcigpOiBib29sZWFuIHtcbiAgICBjb25zdCBjb250YWluZXJIYXNIb3Jpem9udGFsU2Nyb2xsID1cbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFdpZHRoIC1cbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGggPlxuICAgICAgMDtcbiAgICBjb25zdCBjb250YWluZXJIYXNWZXJ0aWNhbFNjcm9sbCA9XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxIZWlnaHQgLVxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQgPlxuICAgICAgMDtcbiAgICByZXR1cm4gY29udGFpbmVySGFzSG9yaXpvbnRhbFNjcm9sbCB8fCBjb250YWluZXJIYXNWZXJ0aWNhbFNjcm9sbDtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBPbkluaXQsXG4gIEVsZW1lbnRSZWYsXG4gIFJlbmRlcmVyMixcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uQ2hhbmdlcyxcbiAgTmdab25lLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBJbmplY3QsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBPcHRpb25hbFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUsIG1lcmdlLCBSZXBsYXlTdWJqZWN0LCBjb21iaW5lTGF0ZXN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBtYXAsXG4gIG1lcmdlTWFwLFxuICB0YWtlVW50aWwsXG4gIHRha2UsXG4gIHRha2VMYXN0LFxuICBwYWlyd2lzZSxcbiAgc2hhcmUsXG4gIGZpbHRlcixcbiAgY291bnQsXG4gIHN0YXJ0V2l0aFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDdXJyZW50RHJhZ0RhdGEsIERyYWdnYWJsZUhlbHBlciB9IGZyb20gJy4vZHJhZ2dhYmxlLWhlbHBlci5wcm92aWRlcic7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEcmFnZ2FibGVTY3JvbGxDb250YWluZXJEaXJlY3RpdmUgfSBmcm9tICcuL2RyYWdnYWJsZS1zY3JvbGwtY29udGFpbmVyLmRpcmVjdGl2ZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29vcmRpbmF0ZXMge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnQXhpcyB7XG4gIHg6IGJvb2xlYW47XG4gIHk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU25hcEdyaWQge1xuICB4PzogbnVtYmVyO1xuICB5PzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdQb2ludGVyRG93bkV2ZW50IGV4dGVuZHMgQ29vcmRpbmF0ZXMge31cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnU3RhcnRFdmVudCB7XG4gIGNhbmNlbERyYWckOiBSZXBsYXlTdWJqZWN0PHZvaWQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdNb3ZlRXZlbnQgZXh0ZW5kcyBDb29yZGluYXRlcyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdFbmRFdmVudCBleHRlbmRzIENvb3JkaW5hdGVzIHtcbiAgZHJhZ0NhbmNlbGxlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IHR5cGUgVmFsaWRhdGVEcmFnID0gKGNvb3JkaW5hdGVzOiBDb29yZGluYXRlcykgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGludGVyZmFjZSBQb2ludGVyRXZlbnQge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVMb25nUHJlc3Mge1xuICB0aW1lckJlZ2luOiBudW1iZXI7XG4gIHRpbWVyRW5kOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2hvc3RFbGVtZW50Q3JlYXRlZEV2ZW50IHtcbiAgY2xpZW50WDogbnVtYmVyO1xuICBjbGllbnRZOiBudW1iZXI7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbXdsRHJhZ2dhYmxlXSdcbn0pXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBhbiBvYmplY3Qgb2YgZGF0YSB5b3UgY2FuIHBhc3MgdG8gdGhlIGRyb3AgZXZlbnRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRyb3BEYXRhOiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBheGlzIGFsb25nIHdoaWNoIHRoZSBlbGVtZW50IGlzIGRyYWdnYWJsZVxuICAgKi9cbiAgQElucHV0KClcbiAgZHJhZ0F4aXM6IERyYWdBeGlzID0geyB4OiB0cnVlLCB5OiB0cnVlIH07XG5cbiAgLyoqXG4gICAqIFNuYXAgYWxsIGRyYWdzIHRvIGFuIHggLyB5IGdyaWRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRyYWdTbmFwR3JpZDogU25hcEdyaWQgPSB7fTtcblxuICAvKipcbiAgICogU2hvdyBhIGdob3N0IGVsZW1lbnQgdGhhdCBzaG93cyB0aGUgZHJhZyB3aGVuIGRyYWdnaW5nXG4gICAqL1xuICBASW5wdXQoKVxuICBnaG9zdERyYWdFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogU2hvdyB0aGUgb3JpZ2luYWwgZWxlbWVudCB3aGVuIGdob3N0RHJhZ0VuYWJsZWQgaXMgdHJ1ZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2hvd09yaWdpbmFsRWxlbWVudFdoaWxlRHJhZ2dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQWxsb3cgY3VzdG9tIGJlaGF2aW91ciB0byBjb250cm9sIHdoZW4gdGhlIGVsZW1lbnQgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQElucHV0KClcbiAgdmFsaWRhdGVEcmFnOiBWYWxpZGF0ZURyYWc7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJzb3IgdG8gdXNlIHdoZW4gZHJhZ2dpbmcgdGhlIGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRyYWdDdXJzb3I6IHN0cmluZyA9ICcnO1xuXG4gIC8qKlxuICAgKiBUaGUgY3NzIGNsYXNzIHRvIGFwcGx5IHdoZW4gdGhlIGVsZW1lbnQgaXMgYmVpbmcgZHJhZ2dlZFxuICAgKi9cbiAgQElucHV0KClcbiAgZHJhZ0FjdGl2ZUNsYXNzOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBlbGVtZW50IHRoZSBnaG9zdCBlbGVtZW50IHdpbGwgYmUgYXBwZW5kZWQgdG8uIERlZmF1bHQgaXMgbmV4dCB0byB0aGUgZHJhZ2dlZCBlbGVtZW50XG4gICAqL1xuICBASW5wdXQoKVxuICBnaG9zdEVsZW1lbnRBcHBlbmRUbzogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIEFuIG5nLXRlbXBsYXRlIHRvIGJlIGluc2VydGVkIGludG8gdGhlIHBhcmVudCBlbGVtZW50IG9mIHRoZSBnaG9zdCBlbGVtZW50LiBJdCB3aWxsIG92ZXJ3cml0ZSBhbnkgY2hpbGQgbm9kZXMuXG4gICAqL1xuICBASW5wdXQoKVxuICBnaG9zdEVsZW1lbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGVsZW1lbnQgY2FuIGJlIGRyYWdnZWQgYWxvbmcgb25lIGF4aXMgYW5kIGhhcyB0aGUgbW91c2Ugb3IgcG9pbnRlciBkZXZpY2UgcHJlc3NlZCBvbiBpdFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyYWdQb2ludGVyRG93biA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ1BvaW50ZXJEb3duRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBlbGVtZW50IGhhcyBzdGFydGVkIHRvIGJlIGRyYWdnZWQuXG4gICAqIE9ubHkgY2FsbGVkIGFmdGVyIGF0IGxlYXN0IG9uZSBtb3VzZSBvciB0b3VjaCBtb3ZlIGV2ZW50LlxuICAgKiBJZiB5b3UgY2FsbCAkZXZlbnQuY2FuY2VsRHJhZyQuZW1pdCgpIGl0IHdpbGwgY2FuY2VsIHRoZSBjdXJyZW50IGRyYWdcbiAgICovXG4gIEBPdXRwdXQoKVxuICBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdTdGFydEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIGdob3N0IGVsZW1lbnQgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGdob3N0RWxlbWVudENyZWF0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEdob3N0RWxlbWVudENyZWF0ZWRFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGVsZW1lbnQgaXMgYmVpbmcgZHJhZ2dlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyYWdnaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxEcmFnTW92ZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIGVsZW1lbnQgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdFbmRFdmVudD4oKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcG9pbnRlckRvd24kID0gbmV3IFN1YmplY3Q8UG9pbnRlckV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwb2ludGVyTW92ZSQgPSBuZXcgU3ViamVjdDxQb2ludGVyRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHBvaW50ZXJVcCQgPSBuZXcgU3ViamVjdDxQb2ludGVyRXZlbnQ+KCk7XG5cbiAgcHJpdmF0ZSBldmVudExpc3RlbmVyU3Vic2NyaXB0aW9uczoge1xuICAgIG1vdXNlbW92ZT86ICgpID0+IHZvaWQ7XG4gICAgbW91c2Vkb3duPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZXVwPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZWVudGVyPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZWxlYXZlPzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaHN0YXJ0PzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaG1vdmU/OiAoKSA9PiB2b2lkO1xuICAgIHRvdWNoZW5kPzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaGNhbmNlbD86ICgpID0+IHZvaWQ7XG4gIH0gPSB7fTtcblxuICBwcml2YXRlIGdob3N0RWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuXG4gIHByaXZhdGUgdGltZUxvbmdQcmVzczogVGltZUxvbmdQcmVzcyA9IHsgdGltZXJCZWdpbjogMCwgdGltZXJFbmQ6IDAgfTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBkcmFnZ2FibGVIZWxwZXI6IERyYWdnYWJsZUhlbHBlcixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHZjcjogVmlld0NvbnRhaW5lclJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIHNjcm9sbENvbnRhaW5lcjogRHJhZ2dhYmxlU2Nyb2xsQ29udGFpbmVyRGlyZWN0aXZlLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueVxuICApIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jaGVja0V2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICBjb25zdCBwb2ludGVyRHJhZ2dlZCQ6IE9ic2VydmFibGU8YW55PiA9IHRoaXMucG9pbnRlckRvd24kLnBpcGUoXG4gICAgICBmaWx0ZXIoKCkgPT4gdGhpcy5jYW5EcmFnKCkpLFxuICAgICAgbWVyZ2VNYXAoKHBvaW50ZXJEb3duRXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgICAvLyBmaXggZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0bGV3aXM5Mi9hbmd1bGFyLWRyYWdnYWJsZS1kcm9wcGFibGUvaXNzdWVzLzYxXG4gICAgICAgIC8vIHN0b3AgbW91c2UgZXZlbnRzIHByb3BhZ2F0aW5nIHVwIHRoZSBjaGFpblxuICAgICAgICBpZiAocG9pbnRlckRvd25FdmVudC5ldmVudC5zdG9wUHJvcGFnYXRpb24gJiYgIXRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICAgICAgcG9pbnRlckRvd25FdmVudC5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhY2sgdG8gcHJldmVudCB0ZXh0IGdldHRpbmcgc2VsZWN0ZWQgaW4gc2FmYXJpIHdoaWxlIGRyYWdnaW5nXG4gICAgICAgIGNvbnN0IGdsb2JhbERyYWdTdHlsZTogSFRNTFN0eWxlRWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnc3R5bGUnXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGdsb2JhbERyYWdTdHlsZSwgJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZChcbiAgICAgICAgICBnbG9iYWxEcmFnU3R5bGUsXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5jcmVhdGVUZXh0KGBcbiAgICAgICAgICBib2R5ICoge1xuICAgICAgICAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgIH1cbiAgICAgICAgYClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGdsb2JhbERyYWdTdHlsZSk7XG5cbiAgICAgICAgY29uc3Qgc3RhcnRTY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcblxuICAgICAgICBjb25zdCBzY3JvbGxDb250YWluZXJTY3JvbGwkID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgICAgIGNvbnN0IHNjcm9sbENvbnRhaW5lciA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyXG4gICAgICAgICAgICA/IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgICAgICAgICAgOiAnd2luZG93JztcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5saXN0ZW4oc2Nyb2xsQ29udGFpbmVyLCAnc2Nyb2xsJywgZSA9PlxuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChlKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pLnBpcGUoXG4gICAgICAgICAgc3RhcnRXaXRoKHN0YXJ0U2Nyb2xsUG9zaXRpb24pLFxuICAgICAgICAgIG1hcCgoKSA9PiB0aGlzLmdldFNjcm9sbFBvc2l0aW9uKCkpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudERyYWckID0gbmV3IFN1YmplY3Q8Q3VycmVudERyYWdEYXRhPigpO1xuICAgICAgICBjb25zdCBjYW5jZWxEcmFnJCA9IG5ldyBSZXBsYXlTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kcmFnUG9pbnRlckRvd24ubmV4dCh7IHg6IDAsIHk6IDAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRyYWdDb21wbGV0ZSQgPSBtZXJnZShcbiAgICAgICAgICB0aGlzLnBvaW50ZXJVcCQsXG4gICAgICAgICAgdGhpcy5wb2ludGVyRG93biQsXG4gICAgICAgICAgY2FuY2VsRHJhZyQsXG4gICAgICAgICAgdGhpcy5kZXN0cm95JFxuICAgICAgICApLnBpcGUoc2hhcmUoKSk7XG5cbiAgICAgICAgY29uc3QgcG9pbnRlck1vdmUgPSBjb21iaW5lTGF0ZXN0PFxuICAgICAgICAgIFBvaW50ZXJFdmVudCxcbiAgICAgICAgICB7IHRvcDogbnVtYmVyOyBsZWZ0OiBudW1iZXIgfVxuICAgICAgICA+KHRoaXMucG9pbnRlck1vdmUkLCBzY3JvbGxDb250YWluZXJTY3JvbGwkKS5waXBlKFxuICAgICAgICAgIG1hcCgoW3BvaW50ZXJNb3ZlRXZlbnQsIHNjcm9sbF0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGN1cnJlbnREcmFnJCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtWDogcG9pbnRlck1vdmVFdmVudC5jbGllbnRYIC0gcG9pbnRlckRvd25FdmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm1ZOiBwb2ludGVyTW92ZUV2ZW50LmNsaWVudFkgLSBwb2ludGVyRG93bkV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICAgIGNsaWVudFg6IHBvaW50ZXJNb3ZlRXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgY2xpZW50WTogcG9pbnRlck1vdmVFdmVudC5jbGllbnRZLFxuICAgICAgICAgICAgICBzY3JvbGxMZWZ0OiBzY3JvbGwubGVmdCxcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBzY3JvbGwudG9wXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1hcChtb3ZlRGF0YSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnU25hcEdyaWQueCkge1xuICAgICAgICAgICAgICBtb3ZlRGF0YS50cmFuc2Zvcm1YID1cbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKG1vdmVEYXRhLnRyYW5zZm9ybVggLyB0aGlzLmRyYWdTbmFwR3JpZC54KSAqXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnU25hcEdyaWQueDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1NuYXBHcmlkLnkpIHtcbiAgICAgICAgICAgICAgbW92ZURhdGEudHJhbnNmb3JtWSA9XG4gICAgICAgICAgICAgICAgTWF0aC5yb3VuZChtb3ZlRGF0YS50cmFuc2Zvcm1ZIC8gdGhpcy5kcmFnU25hcEdyaWQueSkgKlxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1NuYXBHcmlkLnk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtb3ZlRGF0YTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBtYXAobW92ZURhdGEgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRyYWdBeGlzLngpIHtcbiAgICAgICAgICAgICAgbW92ZURhdGEudHJhbnNmb3JtWCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kcmFnQXhpcy55KSB7XG4gICAgICAgICAgICAgIG1vdmVEYXRhLnRyYW5zZm9ybVkgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW92ZURhdGE7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgbWFwKG1vdmVEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFggPSBtb3ZlRGF0YS5zY3JvbGxMZWZ0IC0gc3RhcnRTY3JvbGxQb3NpdGlvbi5sZWZ0O1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsWSA9IG1vdmVEYXRhLnNjcm9sbFRvcCAtIHN0YXJ0U2Nyb2xsUG9zaXRpb24udG9wO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ubW92ZURhdGEsXG4gICAgICAgICAgICAgIHg6IG1vdmVEYXRhLnRyYW5zZm9ybVggKyBzY3JvbGxYLFxuICAgICAgICAgICAgICB5OiBtb3ZlRGF0YS50cmFuc2Zvcm1ZICsgc2Nyb2xsWVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgICAoeyB4LCB5IH0pID0+ICF0aGlzLnZhbGlkYXRlRHJhZyB8fCB0aGlzLnZhbGlkYXRlRHJhZyh7IHgsIHkgfSlcbiAgICAgICAgICApLFxuICAgICAgICAgIHRha2VVbnRpbChkcmFnQ29tcGxldGUkKSxcbiAgICAgICAgICBzaGFyZSgpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgZHJhZ1N0YXJ0ZWQkID0gcG9pbnRlck1vdmUucGlwZShcbiAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgIHNoYXJlKClcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHJhZ0VuZGVkJCA9IHBvaW50ZXJNb3ZlLnBpcGUoXG4gICAgICAgICAgdGFrZUxhc3QoMSksXG4gICAgICAgICAgc2hhcmUoKVxuICAgICAgICApO1xuXG4gICAgICAgIGRyYWdTdGFydGVkJC5zdWJzY3JpYmUoKHsgY2xpZW50WCwgY2xpZW50WSwgeCwgeSB9KSA9PiB7XG4gICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydC5uZXh0KHsgY2FuY2VsRHJhZyQgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICB0aGlzLmRyYWdBY3RpdmVDbGFzc1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAodGhpcy5naG9zdERyYWdFbmFibGVkKSB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsb25lTm9kZShcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG93T3JpZ2luYWxFbGVtZW50V2hpbGVEcmFnZ2luZykge1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICAgICd2aXNpYmlsaXR5JyxcbiAgICAgICAgICAgICAgICAnaGlkZGVuJ1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5naG9zdEVsZW1lbnRBcHBlbmRUbykge1xuICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudEFwcGVuZFRvLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGUhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICBjbG9uZSxcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5uZXh0U2libGluZ1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudCA9IGNsb25lO1xuXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnRTdHlsZXMoY2xvbmUsIHtcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICAgIHRvcDogYCR7cmVjdC50b3B9cHhgLFxuICAgICAgICAgICAgICBsZWZ0OiBgJHtyZWN0LmxlZnR9cHhgLFxuICAgICAgICAgICAgICB3aWR0aDogYCR7cmVjdC53aWR0aH1weGAsXG4gICAgICAgICAgICAgIGhlaWdodDogYCR7cmVjdC5oZWlnaHR9cHhgLFxuICAgICAgICAgICAgICBjdXJzb3I6IHRoaXMuZHJhZ0N1cnNvcixcbiAgICAgICAgICAgICAgbWFyZ2luOiAnMCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5naG9zdEVsZW1lbnRUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICBjb25zdCB2aWV3UmVmID0gdGhpcy52Y3IuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50VGVtcGxhdGVcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgY2xvbmUuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgIHZpZXdSZWYucm9vdE5vZGVzXG4gICAgICAgICAgICAgICAgLmZpbHRlcihub2RlID0+IG5vZGUgaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgY2xvbmUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGRyYWdFbmRlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnZjci5yZW1vdmUodGhpcy52Y3IuaW5kZXhPZih2aWV3UmVmKSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnRDcmVhdGVkLmVtaXQoe1xuICAgICAgICAgICAgICAgIGNsaWVudFg6IGNsaWVudFggLSB4LFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGNsaWVudFkgLSB5LFxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGNsb25lXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRyYWdFbmRlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgY2xvbmUucGFyZW50RWxlbWVudCEucmVtb3ZlQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgJ3Zpc2liaWxpdHknLFxuICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRyYWdnYWJsZUhlbHBlci5jdXJyZW50RHJhZy5uZXh0KGN1cnJlbnREcmFnJCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWdFbmRlZCRcbiAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgIG1lcmdlTWFwKGRyYWdFbmREYXRhID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZHJhZ0VuZERhdGEkID0gY2FuY2VsRHJhZyQucGlwZShcbiAgICAgICAgICAgICAgICBjb3VudCgpLFxuICAgICAgICAgICAgICAgIHRha2UoMSksXG4gICAgICAgICAgICAgICAgbWFwKGNhbGxlZENvdW50ID0+ICh7XG4gICAgICAgICAgICAgICAgICAuLi5kcmFnRW5kRGF0YSxcbiAgICAgICAgICAgICAgICAgIGRyYWdDYW5jZWxsZWQ6IGNhbGxlZENvdW50ID4gMFxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBjYW5jZWxEcmFnJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICByZXR1cm4gZHJhZ0VuZERhdGEkO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnN1YnNjcmliZSgoeyB4LCB5LCBkcmFnQ2FuY2VsbGVkIH0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmRyYWdFbmQubmV4dCh7IHgsIHksIGRyYWdDYW5jZWxsZWQgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoXG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICB0aGlzLmRyYWdBY3RpdmVDbGFzc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGN1cnJlbnREcmFnJC5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIG1lcmdlKGRyYWdDb21wbGV0ZSQsIGRyYWdFbmRlZCQpXG4gICAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChnbG9iYWxEcmFnU3R5bGUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwb2ludGVyTW92ZTtcbiAgICAgIH0pLFxuICAgICAgc2hhcmUoKVxuICAgICk7XG5cbiAgICBtZXJnZShcbiAgICAgIHBvaW50ZXJEcmFnZ2VkJC5waXBlKFxuICAgICAgICB0YWtlKDEpLFxuICAgICAgICBtYXAodmFsdWUgPT4gWywgdmFsdWVdKVxuICAgICAgKSxcbiAgICAgIHBvaW50ZXJEcmFnZ2VkJC5waXBlKHBhaXJ3aXNlKCkpXG4gICAgKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoW3ByZXZpb3VzLCBuZXh0XSkgPT4ge1xuICAgICAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcHJldmlvdXMueCAhPT0gbmV4dC54IHx8IHByZXZpb3VzLnkgIT09IG5leHQueTtcbiAgICAgICAgfSksXG4gICAgICAgIG1hcCgoW3ByZXZpb3VzLCBuZXh0XSkgPT4gbmV4dClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICh7IHgsIHksIGN1cnJlbnREcmFnJCwgY2xpZW50WCwgY2xpZW50WSwgdHJhbnNmb3JtWCwgdHJhbnNmb3JtWSB9KSA9PiB7XG4gICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRyYWdnaW5nLm5leHQoeyB4LCB5IH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh0aGlzLmdob3N0RWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RyYW5zZm9ybVh9cHgsICR7dHJhbnNmb3JtWX1weClgO1xuICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50U3R5bGVzKHRoaXMuZ2hvc3RFbGVtZW50LCB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJzogdHJhbnNmb3JtLFxuICAgICAgICAgICAgICAnLW1zLXRyYW5zZm9ybSc6IHRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgJy1tb3otdHJhbnNmb3JtJzogdHJhbnNmb3JtLFxuICAgICAgICAgICAgICAnLW8tdHJhbnNmb3JtJzogdHJhbnNmb3JtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudERyYWckLm5leHQoe1xuICAgICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICAgIGNsaWVudFksXG4gICAgICAgICAgICBkcm9wRGF0YTogdGhpcy5kcm9wRGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLmRyYWdBeGlzKSB7XG4gICAgICB0aGlzLmNoZWNrRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnVuc3Vic2NyaWJlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnBvaW50ZXJEb3duJC5jb21wbGV0ZSgpO1xuICAgIHRoaXMucG9pbnRlck1vdmUkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5wb2ludGVyVXAkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgY29uc3QgY2FuRHJhZzogYm9vbGVhbiA9IHRoaXMuY2FuRHJhZygpO1xuICAgIGNvbnN0IGhhc0V2ZW50TGlzdGVuZXJzOiBib29sZWFuID1cbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMpLmxlbmd0aCA+IDA7XG5cbiAgICBpZiAoY2FuRHJhZyAmJiAhaGFzRXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vkb3duID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ21vdXNlZG93bicsXG4gICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VEb3duKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZXVwID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAnbW91c2V1cCcsXG4gICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VVcChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2hzdGFydCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaFN0YXJ0KGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaGVuZCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgJ3RvdWNoZW5kJyxcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaEVuZChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2hjYW5jZWwgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICd0b3VjaGNhbmNlbCcsXG4gICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hFbmQoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlZW50ZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAnbW91c2VlbnRlcicsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbk1vdXNlRW50ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZWxlYXZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ21vdXNlbGVhdmUnLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZUxlYXZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghY2FuRHJhZyAmJiBoYXNFdmVudExpc3RlbmVycykge1xuICAgICAgdGhpcy51bnN1YnNjcmliZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmUpIHtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICdtb3VzZW1vdmUnLFxuICAgICAgICAobW91c2VNb3ZlRXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlJC5uZXh0KHtcbiAgICAgICAgICAgIGV2ZW50OiBtb3VzZU1vdmVFdmVudCxcbiAgICAgICAgICAgIGNsaWVudFg6IG1vdXNlTW92ZUV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICBjbGllbnRZOiBtb3VzZU1vdmVFdmVudC5jbGllbnRZXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMucG9pbnRlckRvd24kLm5leHQoe1xuICAgICAgZXZlbnQsXG4gICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQuY2xpZW50WVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmUpIHtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlKCk7XG4gICAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmU7XG4gICAgfVxuICAgIHRoaXMucG9pbnRlclVwJC5uZXh0KHtcbiAgICAgIGV2ZW50LFxuICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFlcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25Ub3VjaFN0YXJ0KGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNjcm9sbENvbnRhaW5lcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIGxldCBoYXNDb250YWluZXJTY3JvbGxiYXI6IGJvb2xlYW47XG4gICAgbGV0IHN0YXJ0U2Nyb2xsUG9zaXRpb246IGFueTtcbiAgICBsZXQgaXNEcmFnQWN0aXZhdGVkOiBib29sZWFuO1xuICAgIGlmICh0aGlzLnNjcm9sbENvbnRhaW5lciAmJiB0aGlzLnNjcm9sbENvbnRhaW5lci5hY3RpdmVMb25nUHJlc3NEcmFnKSB7XG4gICAgICB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJCZWdpbiA9IERhdGUubm93KCk7XG4gICAgICBpc0RyYWdBY3RpdmF0ZWQgPSBmYWxzZTtcbiAgICAgIGhhc0NvbnRhaW5lclNjcm9sbGJhciA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmhhc1Njcm9sbGJhcigpO1xuICAgICAgc3RhcnRTY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNobW92ZSkge1xuICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaG1vdmUgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgJ3RvdWNobW92ZScsXG4gICAgICAgICh0b3VjaE1vdmVFdmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyICYmXG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5hY3RpdmVMb25nUHJlc3NEcmFnICYmXG4gICAgICAgICAgICAhaXNEcmFnQWN0aXZhdGVkICYmXG4gICAgICAgICAgICBoYXNDb250YWluZXJTY3JvbGxiYXJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGlzRHJhZ0FjdGl2YXRlZCA9IHRoaXMuc2hvdWxkQmVnaW5EcmFnKFxuICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgdG91Y2hNb3ZlRXZlbnQsXG4gICAgICAgICAgICAgIHN0YXJ0U2Nyb2xsUG9zaXRpb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLnNjcm9sbENvbnRhaW5lciB8fFxuICAgICAgICAgICAgIXRoaXMuc2Nyb2xsQ29udGFpbmVyLmFjdGl2ZUxvbmdQcmVzc0RyYWcgfHxcbiAgICAgICAgICAgICFoYXNDb250YWluZXJTY3JvbGxiYXIgfHxcbiAgICAgICAgICAgIGlzRHJhZ0FjdGl2YXRlZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5wb2ludGVyTW92ZSQubmV4dCh7XG4gICAgICAgICAgICAgIGV2ZW50OiB0b3VjaE1vdmVFdmVudCxcbiAgICAgICAgICAgICAgY2xpZW50WDogdG91Y2hNb3ZlRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgICAgICAgICBjbGllbnRZOiB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5wb2ludGVyRG93biQubmV4dCh7XG4gICAgICBldmVudCxcbiAgICAgIGNsaWVudFg6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvblRvdWNoRW5kKGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlKSB7XG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNobW92ZSgpO1xuICAgICAgZGVsZXRlIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlO1xuICAgICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyICYmIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFjdGl2ZUxvbmdQcmVzc0RyYWcpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIuZW5hYmxlU2Nyb2xsKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucG9pbnRlclVwJC5uZXh0KHtcbiAgICAgIGV2ZW50LFxuICAgICAgY2xpZW50WDogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFlcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25Nb3VzZUVudGVyKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0Q3Vyc29yKHRoaXMuZHJhZ0N1cnNvcik7XG4gIH1cblxuICBwcml2YXRlIG9uTW91c2VMZWF2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEN1cnNvcignJyk7XG4gIH1cblxuICBwcml2YXRlIGNhbkRyYWcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZHJhZ0F4aXMueCB8fCB0aGlzLmRyYWdBeGlzLnk7XG4gIH1cblxuICBwcml2YXRlIHNldEN1cnNvcih2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2N1cnNvcicsIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVFdmVudExpc3RlbmVycygpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgKHRoaXMgYXMgYW55KS5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9uc1t0eXBlXSgpO1xuICAgICAgZGVsZXRlICh0aGlzIGFzIGFueSkuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnNbdHlwZV07XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldEVsZW1lbnRTdHlsZXMoXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgc3R5bGVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9XG4gICkge1xuICAgIE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShlbGVtZW50LCBrZXksIHN0eWxlc1trZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U2Nyb2xsUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICAgIGxlZnQ6IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICBsZWZ0OiB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnRcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzaG91bGRCZWdpbkRyYWcoXG4gICAgZXZlbnQ6IFRvdWNoRXZlbnQsXG4gICAgdG91Y2hNb3ZlRXZlbnQ6IFRvdWNoRXZlbnQsXG4gICAgc3RhcnRTY3JvbGxQb3NpdGlvbjogYW55XG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG1vdmVTY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBjb25zdCBkZWx0YVNjcm9sbCA9IHtcbiAgICAgIHRvcDogTWF0aC5hYnMobW92ZVNjcm9sbFBvc2l0aW9uLnRvcCAtIHN0YXJ0U2Nyb2xsUG9zaXRpb24udG9wKSxcbiAgICAgIGxlZnQ6IE1hdGguYWJzKG1vdmVTY3JvbGxQb3NpdGlvbi5sZWZ0IC0gc3RhcnRTY3JvbGxQb3NpdGlvbi5sZWZ0KVxuICAgIH07XG4gICAgY29uc3QgZGVsdGFYID1cbiAgICAgIE1hdGguYWJzKFxuICAgICAgICB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFggLSBldmVudC50b3VjaGVzWzBdLmNsaWVudFhcbiAgICAgICkgLSBkZWx0YVNjcm9sbC5sZWZ0O1xuICAgIGNvbnN0IGRlbHRhWSA9XG4gICAgICBNYXRoLmFicyhcbiAgICAgICAgdG91Y2hNb3ZlRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZIC0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZXG4gICAgICApIC0gZGVsdGFTY3JvbGwudG9wO1xuICAgIGNvbnN0IGRlbHRhVG90YWwgPSBkZWx0YVggKyBkZWx0YVk7XG4gICAgaWYgKFxuICAgICAgZGVsdGFUb3RhbCA+IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmxvbmdQcmVzc0NvbmZpZy5kZWx0YSB8fFxuICAgICAgZGVsdGFTY3JvbGwudG9wID4gMCB8fFxuICAgICAgZGVsdGFTY3JvbGwubGVmdCA+IDBcbiAgICApIHtcbiAgICAgIHRoaXMudGltZUxvbmdQcmVzcy50aW1lckJlZ2luID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gICAgdGhpcy50aW1lTG9uZ1ByZXNzLnRpbWVyRW5kID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBkdXJhdGlvbiA9XG4gICAgICB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJFbmQgLSB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJCZWdpbjtcbiAgICBpZiAoZHVyYXRpb24gPj0gdGhpcy5zY3JvbGxDb250YWluZXIubG9uZ1ByZXNzQ29uZmlnLmR1cmF0aW9uKSB7XG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5kaXNhYmxlU2Nyb2xsKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIE9uSW5pdCxcbiAgRWxlbWVudFJlZixcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgTmdab25lLFxuICBJbnB1dCxcbiAgUmVuZGVyZXIyLFxuICBPcHRpb25hbFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQsIHBhaXJ3aXNlLCBmaWx0ZXIsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERyYWdnYWJsZUhlbHBlciB9IGZyb20gJy4vZHJhZ2dhYmxlLWhlbHBlci5wcm92aWRlcic7XG5pbXBvcnQgeyBEcmFnZ2FibGVTY3JvbGxDb250YWluZXJEaXJlY3RpdmUgfSBmcm9tICcuL2RyYWdnYWJsZS1zY3JvbGwtY29udGFpbmVyLmRpcmVjdGl2ZSc7XG5cbmZ1bmN0aW9uIGlzQ29vcmRpbmF0ZVdpdGhpblJlY3RhbmdsZShcbiAgY2xpZW50WDogbnVtYmVyLFxuICBjbGllbnRZOiBudW1iZXIsXG4gIHJlY3Q6IENsaWVudFJlY3Rcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIGNsaWVudFggPj0gcmVjdC5sZWZ0ICYmXG4gICAgY2xpZW50WCA8PSByZWN0LnJpZ2h0ICYmXG4gICAgY2xpZW50WSA+PSByZWN0LnRvcCAmJlxuICAgIGNsaWVudFkgPD0gcmVjdC5ib3R0b21cbiAgKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEcm9wRXZlbnQ8VCA9IGFueT4ge1xuICBkcm9wRGF0YTogVDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW213bERyb3BwYWJsZV0nXG59KVxuZXhwb3J0IGNsYXNzIERyb3BwYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEFkZGVkIHRvIHRoZSBlbGVtZW50IHdoZW4gYW4gZWxlbWVudCBpcyBkcmFnZ2VkIG92ZXIgaXRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRyYWdPdmVyQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogQWRkZWQgdG8gdGhlIGVsZW1lbnQgYW55IHRpbWUgYSBkcmFnZ2FibGUgZWxlbWVudCBpcyBiZWluZyBkcmFnZ2VkXG4gICAqL1xuICBASW5wdXQoKVxuICBkcmFnQWN0aXZlQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSBkcmFnZ2FibGUgZWxlbWVudCBzdGFydHMgb3ZlcmxhcHBpbmcgdGhlIGVsZW1lbnRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBkcmFnRW50ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPERyb3BFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSBkcmFnZ2FibGUgZWxlbWVudCBzdG9wcyBvdmVybGFwcGluZyB0aGUgZWxlbWVudFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyYWdMZWF2ZSA9IG5ldyBFdmVudEVtaXR0ZXI8RHJvcEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhIGRyYWdnYWJsZSBlbGVtZW50IGlzIG1vdmVkIG92ZXIgdGhlIGVsZW1lbnRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBkcmFnT3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8RHJvcEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhIGRyYWdnYWJsZSBlbGVtZW50IGlzIGRyb3BwZWQgb24gdGhpcyBlbGVtZW50XG4gICAqL1xuICBAT3V0cHV0KClcbiAgZHJvcCA9IG5ldyBFdmVudEVtaXR0ZXI8RHJvcEV2ZW50PigpOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lIG5vLW91dHB1dC1uYW1lZC1hZnRlci1zdGFuZGFyZC1ldmVudFxuXG4gIGN1cnJlbnREcmFnU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIGRyYWdnYWJsZUhlbHBlcjogRHJhZ2dhYmxlSGVscGVyLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIHNjcm9sbENvbnRhaW5lcjogRHJhZ2dhYmxlU2Nyb2xsQ29udGFpbmVyRGlyZWN0aXZlXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmN1cnJlbnREcmFnU3Vic2NyaXB0aW9uID0gdGhpcy5kcmFnZ2FibGVIZWxwZXIuY3VycmVudERyYWcuc3Vic2NyaWJlKFxuICAgICAgZHJhZyQgPT4ge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgIHRoaXMuZHJhZ0FjdGl2ZUNsYXNzXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGRyb3BwYWJsZUVsZW1lbnQ6IHtcbiAgICAgICAgICByZWN0PzogQ2xpZW50UmVjdDtcbiAgICAgICAgICB1cGRhdGVDYWNoZTogYm9vbGVhbjtcbiAgICAgICAgICBzY3JvbGxDb250YWluZXJSZWN0PzogQ2xpZW50UmVjdDtcbiAgICAgICAgfSA9IHtcbiAgICAgICAgICB1cGRhdGVDYWNoZTogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGRlcmVnaXN0ZXJTY3JvbGxMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyXG4gICAgICAgICAgICA/IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgICAgICAgICAgOiAnd2luZG93JyxcbiAgICAgICAgICAnc2Nyb2xsJyxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBkcm9wcGFibGVFbGVtZW50LnVwZGF0ZUNhY2hlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgbGV0IGN1cnJlbnREcmFnRHJvcERhdGE6IGFueTtcbiAgICAgICAgY29uc3Qgb3ZlcmxhcHMkID0gZHJhZyQucGlwZShcbiAgICAgICAgICBtYXAoKHsgY2xpZW50WCwgY2xpZW50WSwgZHJvcERhdGEgfSkgPT4ge1xuICAgICAgICAgICAgY3VycmVudERyYWdEcm9wRGF0YSA9IGRyb3BEYXRhO1xuICAgICAgICAgICAgaWYgKGRyb3BwYWJsZUVsZW1lbnQudXBkYXRlQ2FjaGUpIHtcbiAgICAgICAgICAgICAgZHJvcHBhYmxlRWxlbWVudC5yZWN0ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbENvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgIGRyb3BwYWJsZUVsZW1lbnQuc2Nyb2xsQ29udGFpbmVyUmVjdCA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkcm9wcGFibGVFbGVtZW50LnVwZGF0ZUNhY2hlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpc1dpdGhpbkVsZW1lbnQgPSBpc0Nvb3JkaW5hdGVXaXRoaW5SZWN0YW5nbGUoXG4gICAgICAgICAgICAgIGNsaWVudFgsXG4gICAgICAgICAgICAgIGNsaWVudFksXG4gICAgICAgICAgICAgIGRyb3BwYWJsZUVsZW1lbnQucmVjdCBhcyBDbGllbnRSZWN0XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGRyb3BwYWJsZUVsZW1lbnQuc2Nyb2xsQ29udGFpbmVyUmVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIGlzV2l0aGluRWxlbWVudCAmJlxuICAgICAgICAgICAgICAgIGlzQ29vcmRpbmF0ZVdpdGhpblJlY3RhbmdsZShcbiAgICAgICAgICAgICAgICAgIGNsaWVudFgsXG4gICAgICAgICAgICAgICAgICBjbGllbnRZLFxuICAgICAgICAgICAgICAgICAgZHJvcHBhYmxlRWxlbWVudC5zY3JvbGxDb250YWluZXJSZWN0IGFzIENsaWVudFJlY3RcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gaXNXaXRoaW5FbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3Qgb3ZlcmxhcHNDaGFuZ2VkJCA9IG92ZXJsYXBzJC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuXG4gICAgICAgIGxldCBkcmFnT3ZlckFjdGl2ZTogYm9vbGVhbjsgLy8gVE9ETyAtIHNlZSBpZiB0aGVyZSdzIGEgd2F5IG9mIGRvaW5nIHRoaXMgdmlhIHJ4anNcblxuICAgICAgICBvdmVybGFwc0NoYW5nZWQkXG4gICAgICAgICAgLnBpcGUoZmlsdGVyKG92ZXJsYXBzTm93ID0+IG92ZXJsYXBzTm93KSlcbiAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGRyYWdPdmVyQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoXG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICB0aGlzLmRyYWdPdmVyQ2xhc3NcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5kcmFnRW50ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgZHJvcERhdGE6IGN1cnJlbnREcmFnRHJvcERhdGFcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICBvdmVybGFwcyQucGlwZShmaWx0ZXIob3ZlcmxhcHNOb3cgPT4gb3ZlcmxhcHNOb3cpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kcmFnT3Zlci5uZXh0KHtcbiAgICAgICAgICAgICAgZHJvcERhdGE6IGN1cnJlbnREcmFnRHJvcERhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBvdmVybGFwc0NoYW5nZWQkXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBwYWlyd2lzZSgpLFxuICAgICAgICAgICAgZmlsdGVyKChbZGlkT3ZlcmxhcCwgb3ZlcmxhcHNOb3ddKSA9PiBkaWRPdmVybGFwICYmICFvdmVybGFwc05vdylcbiAgICAgICAgICApXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBkcmFnT3ZlckFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJDbGFzc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmRyYWdMZWF2ZS5uZXh0KHtcbiAgICAgICAgICAgICAgICBkcm9wRGF0YTogY3VycmVudERyYWdEcm9wRGF0YVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWckLnN1YnNjcmliZSh7XG4gICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgIGRlcmVnaXN0ZXJTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgIHRoaXMuZHJhZ0FjdGl2ZUNsYXNzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGRyYWdPdmVyQWN0aXZlKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnT3ZlckNsYXNzXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcC5uZXh0KHtcbiAgICAgICAgICAgICAgICAgIGRyb3BEYXRhOiBjdXJyZW50RHJhZ0Ryb3BEYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnREcmFnU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmN1cnJlbnREcmFnU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRHJhZ2dhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9kcmFnZ2FibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyb3BwYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vZHJvcHBhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcmFnZ2FibGVTY3JvbGxDb250YWluZXJEaXJlY3RpdmUgfSBmcm9tICcuL2RyYWdnYWJsZS1zY3JvbGwtY29udGFpbmVyLmRpcmVjdGl2ZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIERyYWdnYWJsZURpcmVjdGl2ZSxcbiAgICBEcm9wcGFibGVEaXJlY3RpdmUsXG4gICAgRHJhZ2dhYmxlU2Nyb2xsQ29udGFpbmVyRGlyZWN0aXZlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBEcmFnZ2FibGVEaXJlY3RpdmUsXG4gICAgRHJvcHBhYmxlRGlyZWN0aXZlLFxuICAgIERyYWdnYWJsZVNjcm9sbENvbnRhaW5lckRpcmVjdGl2ZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIERyYWdBbmREcm9wTW9kdWxlIHt9XG4iXSwibmFtZXMiOlsiU3ViamVjdCIsIkluamVjdGFibGUiLCJEaXJlY3RpdmUiLCJFbGVtZW50UmVmIiwiUmVuZGVyZXIyIiwiTmdab25lIiwiSW5wdXQiLCJFdmVudEVtaXR0ZXIiLCJmaWx0ZXIiLCJtZXJnZU1hcCIsIk9ic2VydmFibGUiLCJzdGFydFdpdGgiLCJtYXAiLCJSZXBsYXlTdWJqZWN0IiwibWVyZ2UiLCJzaGFyZSIsImNvbWJpbmVMYXRlc3QiLCJ0YWtlVW50aWwiLCJ0YWtlIiwidGFrZUxhc3QiLCJjb3VudCIsInBhaXJ3aXNlIiwiVmlld0NvbnRhaW5lclJlZiIsIk9wdGlvbmFsIiwiSW5qZWN0IiwiRE9DVU1FTlQiLCJPdXRwdXQiLCJkaXN0aW5jdFVudGlsQ2hhbmdlZCIsIk5nTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxJQWVPLElBQUksUUFBUSxHQUFHO1FBQ2xCLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLGtCQUFrQixDQUFDO1lBQzNDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqRCxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hGO1lBQ0QsT0FBTyxDQUFDLENBQUM7U0FDWixDQUFBO1FBQ0QsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUE7QUFF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