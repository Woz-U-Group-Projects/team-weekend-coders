/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Directive, ElementRef, Renderer2, Output, EventEmitter, Input, NgZone, Inject, TemplateRef, ViewContainerRef, Optional } from '@angular/core';
import { Subject, Observable, merge, ReplaySubject, combineLatest } from 'rxjs';
import { map, mergeMap, takeUntil, take, takeLast, pairwise, share, filter, count, startWith } from 'rxjs/operators';
import { DraggableHelper } from './draggable-helper.provider';
import { DOCUMENT } from '@angular/common';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';
/**
 * @record
 */
export function Coordinates() { }
/** @type {?} */
Coordinates.prototype.x;
/** @type {?} */
Coordinates.prototype.y;
/**
 * @record
 */
export function DragAxis() { }
/** @type {?} */
DragAxis.prototype.x;
/** @type {?} */
DragAxis.prototype.y;
/**
 * @record
 */
export function SnapGrid() { }
/** @type {?|undefined} */
SnapGrid.prototype.x;
/** @type {?|undefined} */
SnapGrid.prototype.y;
/**
 * @record
 */
export function DragPointerDownEvent() { }
/**
 * @record
 */
export function DragStartEvent() { }
/** @type {?} */
DragStartEvent.prototype.cancelDrag$;
/**
 * @record
 */
export function DragMoveEvent() { }
/**
 * @record
 */
export function DragEndEvent() { }
/** @type {?} */
DragEndEvent.prototype.dragCancelled;
/** @typedef {?} */
var ValidateDrag;
export { ValidateDrag };
/**
 * @record
 */
export function PointerEvent() { }
/** @type {?} */
PointerEvent.prototype.clientX;
/** @type {?} */
PointerEvent.prototype.clientY;
/** @type {?} */
PointerEvent.prototype.event;
/**
 * @record
 */
export function TimeLongPress() { }
/** @type {?} */
TimeLongPress.prototype.timerBegin;
/** @type {?} */
TimeLongPress.prototype.timerEnd;
/**
 * @record
 */
export function GhostElementCreatedEvent() { }
/** @type {?} */
GhostElementCreatedEvent.prototype.clientX;
/** @type {?} */
GhostElementCreatedEvent.prototype.clientY;
/** @type {?} */
GhostElementCreatedEvent.prototype.element;
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
        this.dragPointerDown = new EventEmitter();
        /**
         * Called when the element has started to be dragged.
         * Only called after at least one mouse or touch move event.
         * If you call $event.cancelDrag$.emit() it will cancel the current drag
         */
        this.dragStart = new EventEmitter();
        /**
         * Called after the ghost element has been created
         */
        this.ghostElementCreated = new EventEmitter();
        /**
         * Called when the element is being dragged
         */
        this.dragging = new EventEmitter();
        /**
         * Called after the element is dragged
         */
        this.dragEnd = new EventEmitter();
        /**
         * @hidden
         */
        this.pointerDown$ = new Subject();
        /**
         * @hidden
         */
        this.pointerMove$ = new Subject();
        /**
         * @hidden
         */
        this.pointerUp$ = new Subject();
        this.eventListenerSubscriptions = {};
        this.destroy$ = new Subject();
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
        var pointerDragged$ = this.pointerDown$.pipe(filter(function () { return _this.canDrag(); }), mergeMap(function (pointerDownEvent) {
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
            var scrollContainerScroll$ = new Observable(function (observer) {
                /** @type {?} */
                var scrollContainer = _this.scrollContainer
                    ? _this.scrollContainer.elementRef.nativeElement
                    : 'window';
                return _this.renderer.listen(scrollContainer, 'scroll', function (e) {
                    return observer.next(e);
                });
            }).pipe(startWith(startScrollPosition), map(function () { return _this.getScrollPosition(); }));
            /** @type {?} */
            var currentDrag$ = new Subject();
            /** @type {?} */
            var cancelDrag$ = new ReplaySubject();
            _this.zone.run(function () {
                _this.dragPointerDown.next({ x: 0, y: 0 });
            });
            /** @type {?} */
            var dragComplete$ = merge(_this.pointerUp$, _this.pointerDown$, cancelDrag$, _this.destroy$).pipe(share());
            /** @type {?} */
            var pointerMove = combineLatest(_this.pointerMove$, scrollContainerScroll$).pipe(map(function (_a) {
                var _b = tslib_1.__read(_a, 2), pointerMoveEvent = _b[0], scroll = _b[1];
                return {
                    currentDrag$: currentDrag$,
                    transformX: pointerMoveEvent.clientX - pointerDownEvent.clientX,
                    transformY: pointerMoveEvent.clientY - pointerDownEvent.clientY,
                    clientX: pointerMoveEvent.clientX,
                    clientY: pointerMoveEvent.clientY,
                    scrollLeft: scroll.left,
                    scrollTop: scroll.top
                };
            }), map(function (moveData) {
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
            }), map(function (moveData) {
                if (!_this.dragAxis.x) {
                    moveData.transformX = 0;
                }
                if (!_this.dragAxis.y) {
                    moveData.transformY = 0;
                }
                return moveData;
            }), map(function (moveData) {
                /** @type {?} */
                var scrollX = moveData.scrollLeft - startScrollPosition.left;
                /** @type {?} */
                var scrollY = moveData.scrollTop - startScrollPosition.top;
                return tslib_1.__assign({}, moveData, { x: moveData.transformX + scrollX, y: moveData.transformY + scrollY });
            }), filter(function (_a) {
                var x = _a.x, y = _a.y;
                return !_this.validateDrag || _this.validateDrag({ x: x, y: y });
            }), takeUntil(dragComplete$), share());
            /** @type {?} */
            var dragStarted$ = pointerMove.pipe(take(1), share());
            /** @type {?} */
            var dragEnded$ = pointerMove.pipe(takeLast(1), share());
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
                .pipe(mergeMap(function (dragEndData) {
                /** @type {?} */
                var dragEndData$ = cancelDrag$.pipe(count(), take(1), map(function (calledCount) { return (tslib_1.__assign({}, dragEndData, { dragCancelled: calledCount > 0 })); }));
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
            merge(dragComplete$, dragEnded$)
                .pipe(take(1))
                .subscribe(function () {
                _this.document.head.removeChild(globalDragStyle);
            });
            return pointerMove;
        }), share());
        merge(pointerDragged$.pipe(take(1), map(function (value) { return [, value]; })), pointerDragged$.pipe(pairwise()))
            .pipe(filter(function (_a) {
            var _b = tslib_1.__read(_a, 2), previous = _b[0], next = _b[1];
            if (!previous) {
                return true;
            }
            return previous.x !== next.x || previous.y !== next.y;
        }), map(function (_a) {
            var _b = tslib_1.__read(_a, 2), previous = _b[0], next = _b[1];
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
            (/** @type {?} */ (_this)).eventListenerSubscriptions[type]();
            delete (/** @type {?} */ (_this)).eventListenerSubscriptions[type];
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
        { type: Directive, args: [{
                    selector: '[mwlDraggable]'
                },] }
    ];
    /** @nocollapse */
    DraggableDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: DraggableHelper },
        { type: NgZone },
        { type: ViewContainerRef },
        { type: DraggableScrollContainerDirective, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    DraggableDirective.propDecorators = {
        dropData: [{ type: Input }],
        dragAxis: [{ type: Input }],
        dragSnapGrid: [{ type: Input }],
        ghostDragEnabled: [{ type: Input }],
        showOriginalElementWhileDragging: [{ type: Input }],
        validateDrag: [{ type: Input }],
        dragCursor: [{ type: Input }],
        dragActiveClass: [{ type: Input }],
        ghostElementAppendTo: [{ type: Input }],
        ghostElementTemplate: [{ type: Input }],
        dragPointerDown: [{ type: Output }],
        dragStart: [{ type: Output }],
        ghostElementCreated: [{ type: Output }],
        dragging: [{ type: Output }],
        dragEnd: [{ type: Output }]
    };
    return DraggableDirective;
}());
export { DraggableDirective };
if (false) {
    /**
     * an object of data you can pass to the drop event
     * @type {?}
     */
    DraggableDirective.prototype.dropData;
    /**
     * The axis along which the element is draggable
     * @type {?}
     */
    DraggableDirective.prototype.dragAxis;
    /**
     * Snap all drags to an x / y grid
     * @type {?}
     */
    DraggableDirective.prototype.dragSnapGrid;
    /**
     * Show a ghost element that shows the drag when dragging
     * @type {?}
     */
    DraggableDirective.prototype.ghostDragEnabled;
    /**
     * Show the original element when ghostDragEnabled is true
     * @type {?}
     */
    DraggableDirective.prototype.showOriginalElementWhileDragging;
    /**
     * Allow custom behaviour to control when the element is dragged
     * @type {?}
     */
    DraggableDirective.prototype.validateDrag;
    /**
     * The cursor to use when dragging the element
     * @type {?}
     */
    DraggableDirective.prototype.dragCursor;
    /**
     * The css class to apply when the element is being dragged
     * @type {?}
     */
    DraggableDirective.prototype.dragActiveClass;
    /**
     * The element the ghost element will be appended to. Default is next to the dragged element
     * @type {?}
     */
    DraggableDirective.prototype.ghostElementAppendTo;
    /**
     * An ng-template to be inserted into the parent element of the ghost element. It will overwrite any child nodes.
     * @type {?}
     */
    DraggableDirective.prototype.ghostElementTemplate;
    /**
     * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
     * @type {?}
     */
    DraggableDirective.prototype.dragPointerDown;
    /**
     * Called when the element has started to be dragged.
     * Only called after at least one mouse or touch move event.
     * If you call $event.cancelDrag$.emit() it will cancel the current drag
     * @type {?}
     */
    DraggableDirective.prototype.dragStart;
    /**
     * Called after the ghost element has been created
     * @type {?}
     */
    DraggableDirective.prototype.ghostElementCreated;
    /**
     * Called when the element is being dragged
     * @type {?}
     */
    DraggableDirective.prototype.dragging;
    /**
     * Called after the element is dragged
     * @type {?}
     */
    DraggableDirective.prototype.dragEnd;
    /**
     * @hidden
     * @type {?}
     */
    DraggableDirective.prototype.pointerDown$;
    /**
     * @hidden
     * @type {?}
     */
    DraggableDirective.prototype.pointerMove$;
    /**
     * @hidden
     * @type {?}
     */
    DraggableDirective.prototype.pointerUp$;
    /** @type {?} */
    DraggableDirective.prototype.eventListenerSubscriptions;
    /** @type {?} */
    DraggableDirective.prototype.ghostElement;
    /** @type {?} */
    DraggableDirective.prototype.destroy$;
    /** @type {?} */
    DraggableDirective.prototype.timeLongPress;
    /** @type {?} */
    DraggableDirective.prototype.element;
    /** @type {?} */
    DraggableDirective.prototype.renderer;
    /** @type {?} */
    DraggableDirective.prototype.draggableHelper;
    /** @type {?} */
    DraggableDirective.prototype.zone;
    /** @type {?} */
    DraggableDirective.prototype.vcr;
    /** @type {?} */
    DraggableDirective.prototype.scrollContainer;
    /** @type {?} */
    DraggableDirective.prototype.document;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxVQUFVLEVBQ1YsU0FBUyxFQUNULE1BQU0sRUFDTixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFFTixNQUFNLEVBQ04sV0FBVyxFQUNYLGdCQUFnQixFQUNoQixRQUFRLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDaEYsT0FBTyxFQUNMLEdBQUcsRUFDSCxRQUFRLEVBQ1IsU0FBUyxFQUNULElBQUksRUFDSixRQUFRLEVBQ1IsUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBbUIsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDL0UsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlMekY7O09BRUc7SUFDSCw0QkFDVSxTQUNBLFVBQ0EsaUJBQ0EsTUFDQSxLQUNZLGVBQWtELEVBQzVDLFFBQWE7UUFOL0IsWUFBTyxHQUFQLE9BQU87UUFDUCxhQUFRLEdBQVIsUUFBUTtRQUNSLG9CQUFlLEdBQWYsZUFBZTtRQUNmLFNBQUksR0FBSixJQUFJO1FBQ0osUUFBRyxHQUFILEdBQUc7UUFD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QzNCOzs7O2dCQS9FQyxVQUFVO2dCQUNWLFNBQVM7Z0JBMEJlLGVBQWU7Z0JBcEJ2QyxNQUFNO2dCQUlOLGdCQUFnQjtnQkFrQlQsaUNBQWlDLHVCQTBMckMsUUFBUTtnREFDUixNQUFNLFNBQUMsUUFBUTs7OzJCQXBJakIsS0FBSzsyQkFNTCxLQUFLOytCQU1MLEtBQUs7bUNBTUwsS0FBSzttREFNTCxLQUFLOytCQU1MLEtBQUs7NkJBTUwsS0FBSztrQ0FNTCxLQUFLO3VDQU1MLEtBQUs7dUNBTUwsS0FBSztrQ0FNTCxNQUFNOzRCQVFOLE1BQU07c0NBTU4sTUFBTTsyQkFNTixNQUFNOzBCQU1OLE1BQU07OzZCQTdLVDs7U0FtRmEsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBPbkluaXQsXG4gIEVsZW1lbnRSZWYsXG4gIFJlbmRlcmVyMixcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uQ2hhbmdlcyxcbiAgTmdab25lLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBJbmplY3QsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBPcHRpb25hbFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUsIG1lcmdlLCBSZXBsYXlTdWJqZWN0LCBjb21iaW5lTGF0ZXN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBtYXAsXG4gIG1lcmdlTWFwLFxuICB0YWtlVW50aWwsXG4gIHRha2UsXG4gIHRha2VMYXN0LFxuICBwYWlyd2lzZSxcbiAgc2hhcmUsXG4gIGZpbHRlcixcbiAgY291bnQsXG4gIHN0YXJ0V2l0aFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDdXJyZW50RHJhZ0RhdGEsIERyYWdnYWJsZUhlbHBlciB9IGZyb20gJy4vZHJhZ2dhYmxlLWhlbHBlci5wcm92aWRlcic7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEcmFnZ2FibGVTY3JvbGxDb250YWluZXJEaXJlY3RpdmUgfSBmcm9tICcuL2RyYWdnYWJsZS1zY3JvbGwtY29udGFpbmVyLmRpcmVjdGl2ZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29vcmRpbmF0ZXMge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnQXhpcyB7XG4gIHg6IGJvb2xlYW47XG4gIHk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU25hcEdyaWQge1xuICB4PzogbnVtYmVyO1xuICB5PzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdQb2ludGVyRG93bkV2ZW50IGV4dGVuZHMgQ29vcmRpbmF0ZXMge31cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnU3RhcnRFdmVudCB7XG4gIGNhbmNlbERyYWckOiBSZXBsYXlTdWJqZWN0PHZvaWQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdNb3ZlRXZlbnQgZXh0ZW5kcyBDb29yZGluYXRlcyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdFbmRFdmVudCBleHRlbmRzIENvb3JkaW5hdGVzIHtcbiAgZHJhZ0NhbmNlbGxlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IHR5cGUgVmFsaWRhdGVEcmFnID0gKGNvb3JkaW5hdGVzOiBDb29yZGluYXRlcykgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGludGVyZmFjZSBQb2ludGVyRXZlbnQge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVMb25nUHJlc3Mge1xuICB0aW1lckJlZ2luOiBudW1iZXI7XG4gIHRpbWVyRW5kOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2hvc3RFbGVtZW50Q3JlYXRlZEV2ZW50IHtcbiAgY2xpZW50WDogbnVtYmVyO1xuICBjbGllbnRZOiBudW1iZXI7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbXdsRHJhZ2dhYmxlXSdcbn0pXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBhbiBvYmplY3Qgb2YgZGF0YSB5b3UgY2FuIHBhc3MgdG8gdGhlIGRyb3AgZXZlbnRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRyb3BEYXRhOiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBheGlzIGFsb25nIHdoaWNoIHRoZSBlbGVtZW50IGlzIGRyYWdnYWJsZVxuICAgKi9cbiAgQElucHV0KClcbiAgZHJhZ0F4aXM6IERyYWdBeGlzID0geyB4OiB0cnVlLCB5OiB0cnVlIH07XG5cbiAgLyoqXG4gICAqIFNuYXAgYWxsIGRyYWdzIHRvIGFuIHggLyB5IGdyaWRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRyYWdTbmFwR3JpZDogU25hcEdyaWQgPSB7fTtcblxuICAvKipcbiAgICogU2hvdyBhIGdob3N0IGVsZW1lbnQgdGhhdCBzaG93cyB0aGUgZHJhZyB3aGVuIGRyYWdnaW5nXG4gICAqL1xuICBASW5wdXQoKVxuICBnaG9zdERyYWdFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogU2hvdyB0aGUgb3JpZ2luYWwgZWxlbWVudCB3aGVuIGdob3N0RHJhZ0VuYWJsZWQgaXMgdHJ1ZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2hvd09yaWdpbmFsRWxlbWVudFdoaWxlRHJhZ2dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQWxsb3cgY3VzdG9tIGJlaGF2aW91ciB0byBjb250cm9sIHdoZW4gdGhlIGVsZW1lbnQgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQElucHV0KClcbiAgdmFsaWRhdGVEcmFnOiBWYWxpZGF0ZURyYWc7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJzb3IgdG8gdXNlIHdoZW4gZHJhZ2dpbmcgdGhlIGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRyYWdDdXJzb3I6IHN0cmluZyA9ICcnO1xuXG4gIC8qKlxuICAgKiBUaGUgY3NzIGNsYXNzIHRvIGFwcGx5IHdoZW4gdGhlIGVsZW1lbnQgaXMgYmVpbmcgZHJhZ2dlZFxuICAgKi9cbiAgQElucHV0KClcbiAgZHJhZ0FjdGl2ZUNsYXNzOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBlbGVtZW50IHRoZSBnaG9zdCBlbGVtZW50IHdpbGwgYmUgYXBwZW5kZWQgdG8uIERlZmF1bHQgaXMgbmV4dCB0byB0aGUgZHJhZ2dlZCBlbGVtZW50XG4gICAqL1xuICBASW5wdXQoKVxuICBnaG9zdEVsZW1lbnRBcHBlbmRUbzogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIEFuIG5nLXRlbXBsYXRlIHRvIGJlIGluc2VydGVkIGludG8gdGhlIHBhcmVudCBlbGVtZW50IG9mIHRoZSBnaG9zdCBlbGVtZW50LiBJdCB3aWxsIG92ZXJ3cml0ZSBhbnkgY2hpbGQgbm9kZXMuXG4gICAqL1xuICBASW5wdXQoKVxuICBnaG9zdEVsZW1lbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGVsZW1lbnQgY2FuIGJlIGRyYWdnZWQgYWxvbmcgb25lIGF4aXMgYW5kIGhhcyB0aGUgbW91c2Ugb3IgcG9pbnRlciBkZXZpY2UgcHJlc3NlZCBvbiBpdFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyYWdQb2ludGVyRG93biA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ1BvaW50ZXJEb3duRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBlbGVtZW50IGhhcyBzdGFydGVkIHRvIGJlIGRyYWdnZWQuXG4gICAqIE9ubHkgY2FsbGVkIGFmdGVyIGF0IGxlYXN0IG9uZSBtb3VzZSBvciB0b3VjaCBtb3ZlIGV2ZW50LlxuICAgKiBJZiB5b3UgY2FsbCAkZXZlbnQuY2FuY2VsRHJhZyQuZW1pdCgpIGl0IHdpbGwgY2FuY2VsIHRoZSBjdXJyZW50IGRyYWdcbiAgICovXG4gIEBPdXRwdXQoKVxuICBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdTdGFydEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIGdob3N0IGVsZW1lbnQgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGdob3N0RWxlbWVudENyZWF0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEdob3N0RWxlbWVudENyZWF0ZWRFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGVsZW1lbnQgaXMgYmVpbmcgZHJhZ2dlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyYWdnaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxEcmFnTW92ZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIGVsZW1lbnQgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdFbmRFdmVudD4oKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcG9pbnRlckRvd24kID0gbmV3IFN1YmplY3Q8UG9pbnRlckV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwb2ludGVyTW92ZSQgPSBuZXcgU3ViamVjdDxQb2ludGVyRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHBvaW50ZXJVcCQgPSBuZXcgU3ViamVjdDxQb2ludGVyRXZlbnQ+KCk7XG5cbiAgcHJpdmF0ZSBldmVudExpc3RlbmVyU3Vic2NyaXB0aW9uczoge1xuICAgIG1vdXNlbW92ZT86ICgpID0+IHZvaWQ7XG4gICAgbW91c2Vkb3duPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZXVwPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZWVudGVyPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZWxlYXZlPzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaHN0YXJ0PzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaG1vdmU/OiAoKSA9PiB2b2lkO1xuICAgIHRvdWNoZW5kPzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaGNhbmNlbD86ICgpID0+IHZvaWQ7XG4gIH0gPSB7fTtcblxuICBwcml2YXRlIGdob3N0RWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuXG4gIHByaXZhdGUgdGltZUxvbmdQcmVzczogVGltZUxvbmdQcmVzcyA9IHsgdGltZXJCZWdpbjogMCwgdGltZXJFbmQ6IDAgfTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBkcmFnZ2FibGVIZWxwZXI6IERyYWdnYWJsZUhlbHBlcixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHZjcjogVmlld0NvbnRhaW5lclJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIHNjcm9sbENvbnRhaW5lcjogRHJhZ2dhYmxlU2Nyb2xsQ29udGFpbmVyRGlyZWN0aXZlLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueVxuICApIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jaGVja0V2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICBjb25zdCBwb2ludGVyRHJhZ2dlZCQ6IE9ic2VydmFibGU8YW55PiA9IHRoaXMucG9pbnRlckRvd24kLnBpcGUoXG4gICAgICBmaWx0ZXIoKCkgPT4gdGhpcy5jYW5EcmFnKCkpLFxuICAgICAgbWVyZ2VNYXAoKHBvaW50ZXJEb3duRXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgICAvLyBmaXggZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0bGV3aXM5Mi9hbmd1bGFyLWRyYWdnYWJsZS1kcm9wcGFibGUvaXNzdWVzLzYxXG4gICAgICAgIC8vIHN0b3AgbW91c2UgZXZlbnRzIHByb3BhZ2F0aW5nIHVwIHRoZSBjaGFpblxuICAgICAgICBpZiAocG9pbnRlckRvd25FdmVudC5ldmVudC5zdG9wUHJvcGFnYXRpb24gJiYgIXRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICAgICAgcG9pbnRlckRvd25FdmVudC5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhY2sgdG8gcHJldmVudCB0ZXh0IGdldHRpbmcgc2VsZWN0ZWQgaW4gc2FmYXJpIHdoaWxlIGRyYWdnaW5nXG4gICAgICAgIGNvbnN0IGdsb2JhbERyYWdTdHlsZTogSFRNTFN0eWxlRWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnc3R5bGUnXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGdsb2JhbERyYWdTdHlsZSwgJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZChcbiAgICAgICAgICBnbG9iYWxEcmFnU3R5bGUsXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5jcmVhdGVUZXh0KGBcbiAgICAgICAgICBib2R5ICoge1xuICAgICAgICAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgIH1cbiAgICAgICAgYClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGdsb2JhbERyYWdTdHlsZSk7XG5cbiAgICAgICAgY29uc3Qgc3RhcnRTY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcblxuICAgICAgICBjb25zdCBzY3JvbGxDb250YWluZXJTY3JvbGwkID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgICAgIGNvbnN0IHNjcm9sbENvbnRhaW5lciA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyXG4gICAgICAgICAgICA/IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgICAgICAgICAgOiAnd2luZG93JztcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5saXN0ZW4oc2Nyb2xsQ29udGFpbmVyLCAnc2Nyb2xsJywgZSA9PlxuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChlKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pLnBpcGUoXG4gICAgICAgICAgc3RhcnRXaXRoKHN0YXJ0U2Nyb2xsUG9zaXRpb24pLFxuICAgICAgICAgIG1hcCgoKSA9PiB0aGlzLmdldFNjcm9sbFBvc2l0aW9uKCkpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudERyYWckID0gbmV3IFN1YmplY3Q8Q3VycmVudERyYWdEYXRhPigpO1xuICAgICAgICBjb25zdCBjYW5jZWxEcmFnJCA9IG5ldyBSZXBsYXlTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kcmFnUG9pbnRlckRvd24ubmV4dCh7IHg6IDAsIHk6IDAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRyYWdDb21wbGV0ZSQgPSBtZXJnZShcbiAgICAgICAgICB0aGlzLnBvaW50ZXJVcCQsXG4gICAgICAgICAgdGhpcy5wb2ludGVyRG93biQsXG4gICAgICAgICAgY2FuY2VsRHJhZyQsXG4gICAgICAgICAgdGhpcy5kZXN0cm95JFxuICAgICAgICApLnBpcGUoc2hhcmUoKSk7XG5cbiAgICAgICAgY29uc3QgcG9pbnRlck1vdmUgPSBjb21iaW5lTGF0ZXN0PFxuICAgICAgICAgIFBvaW50ZXJFdmVudCxcbiAgICAgICAgICB7IHRvcDogbnVtYmVyOyBsZWZ0OiBudW1iZXIgfVxuICAgICAgICA+KHRoaXMucG9pbnRlck1vdmUkLCBzY3JvbGxDb250YWluZXJTY3JvbGwkKS5waXBlKFxuICAgICAgICAgIG1hcCgoW3BvaW50ZXJNb3ZlRXZlbnQsIHNjcm9sbF0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGN1cnJlbnREcmFnJCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtWDogcG9pbnRlck1vdmVFdmVudC5jbGllbnRYIC0gcG9pbnRlckRvd25FdmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm1ZOiBwb2ludGVyTW92ZUV2ZW50LmNsaWVudFkgLSBwb2ludGVyRG93bkV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICAgIGNsaWVudFg6IHBvaW50ZXJNb3ZlRXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgY2xpZW50WTogcG9pbnRlck1vdmVFdmVudC5jbGllbnRZLFxuICAgICAgICAgICAgICBzY3JvbGxMZWZ0OiBzY3JvbGwubGVmdCxcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBzY3JvbGwudG9wXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1hcChtb3ZlRGF0YSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnU25hcEdyaWQueCkge1xuICAgICAgICAgICAgICBtb3ZlRGF0YS50cmFuc2Zvcm1YID1cbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKG1vdmVEYXRhLnRyYW5zZm9ybVggLyB0aGlzLmRyYWdTbmFwR3JpZC54KSAqXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnU25hcEdyaWQueDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1NuYXBHcmlkLnkpIHtcbiAgICAgICAgICAgICAgbW92ZURhdGEudHJhbnNmb3JtWSA9XG4gICAgICAgICAgICAgICAgTWF0aC5yb3VuZChtb3ZlRGF0YS50cmFuc2Zvcm1ZIC8gdGhpcy5kcmFnU25hcEdyaWQueSkgKlxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1NuYXBHcmlkLnk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtb3ZlRGF0YTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBtYXAobW92ZURhdGEgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRyYWdBeGlzLngpIHtcbiAgICAgICAgICAgICAgbW92ZURhdGEudHJhbnNmb3JtWCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kcmFnQXhpcy55KSB7XG4gICAgICAgICAgICAgIG1vdmVEYXRhLnRyYW5zZm9ybVkgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW92ZURhdGE7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgbWFwKG1vdmVEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFggPSBtb3ZlRGF0YS5zY3JvbGxMZWZ0IC0gc3RhcnRTY3JvbGxQb3NpdGlvbi5sZWZ0O1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsWSA9IG1vdmVEYXRhLnNjcm9sbFRvcCAtIHN0YXJ0U2Nyb2xsUG9zaXRpb24udG9wO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ubW92ZURhdGEsXG4gICAgICAgICAgICAgIHg6IG1vdmVEYXRhLnRyYW5zZm9ybVggKyBzY3JvbGxYLFxuICAgICAgICAgICAgICB5OiBtb3ZlRGF0YS50cmFuc2Zvcm1ZICsgc2Nyb2xsWVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgICAoeyB4LCB5IH0pID0+ICF0aGlzLnZhbGlkYXRlRHJhZyB8fCB0aGlzLnZhbGlkYXRlRHJhZyh7IHgsIHkgfSlcbiAgICAgICAgICApLFxuICAgICAgICAgIHRha2VVbnRpbChkcmFnQ29tcGxldGUkKSxcbiAgICAgICAgICBzaGFyZSgpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgZHJhZ1N0YXJ0ZWQkID0gcG9pbnRlck1vdmUucGlwZShcbiAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgIHNoYXJlKClcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHJhZ0VuZGVkJCA9IHBvaW50ZXJNb3ZlLnBpcGUoXG4gICAgICAgICAgdGFrZUxhc3QoMSksXG4gICAgICAgICAgc2hhcmUoKVxuICAgICAgICApO1xuXG4gICAgICAgIGRyYWdTdGFydGVkJC5zdWJzY3JpYmUoKHsgY2xpZW50WCwgY2xpZW50WSwgeCwgeSB9KSA9PiB7XG4gICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydC5uZXh0KHsgY2FuY2VsRHJhZyQgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICB0aGlzLmRyYWdBY3RpdmVDbGFzc1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAodGhpcy5naG9zdERyYWdFbmFibGVkKSB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsb25lTm9kZShcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG93T3JpZ2luYWxFbGVtZW50V2hpbGVEcmFnZ2luZykge1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICAgICd2aXNpYmlsaXR5JyxcbiAgICAgICAgICAgICAgICAnaGlkZGVuJ1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5naG9zdEVsZW1lbnRBcHBlbmRUbykge1xuICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudEFwcGVuZFRvLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGUhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICBjbG9uZSxcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5uZXh0U2libGluZ1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudCA9IGNsb25lO1xuXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnRTdHlsZXMoY2xvbmUsIHtcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICAgIHRvcDogYCR7cmVjdC50b3B9cHhgLFxuICAgICAgICAgICAgICBsZWZ0OiBgJHtyZWN0LmxlZnR9cHhgLFxuICAgICAgICAgICAgICB3aWR0aDogYCR7cmVjdC53aWR0aH1weGAsXG4gICAgICAgICAgICAgIGhlaWdodDogYCR7cmVjdC5oZWlnaHR9cHhgLFxuICAgICAgICAgICAgICBjdXJzb3I6IHRoaXMuZHJhZ0N1cnNvcixcbiAgICAgICAgICAgICAgbWFyZ2luOiAnMCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5naG9zdEVsZW1lbnRUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICBjb25zdCB2aWV3UmVmID0gdGhpcy52Y3IuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50VGVtcGxhdGVcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgY2xvbmUuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgIHZpZXdSZWYucm9vdE5vZGVzXG4gICAgICAgICAgICAgICAgLmZpbHRlcihub2RlID0+IG5vZGUgaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgY2xvbmUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGRyYWdFbmRlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnZjci5yZW1vdmUodGhpcy52Y3IuaW5kZXhPZih2aWV3UmVmKSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnRDcmVhdGVkLmVtaXQoe1xuICAgICAgICAgICAgICAgIGNsaWVudFg6IGNsaWVudFggLSB4LFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGNsaWVudFkgLSB5LFxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGNsb25lXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRyYWdFbmRlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgY2xvbmUucGFyZW50RWxlbWVudCEucmVtb3ZlQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgJ3Zpc2liaWxpdHknLFxuICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRyYWdnYWJsZUhlbHBlci5jdXJyZW50RHJhZy5uZXh0KGN1cnJlbnREcmFnJCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWdFbmRlZCRcbiAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgIG1lcmdlTWFwKGRyYWdFbmREYXRhID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZHJhZ0VuZERhdGEkID0gY2FuY2VsRHJhZyQucGlwZShcbiAgICAgICAgICAgICAgICBjb3VudCgpLFxuICAgICAgICAgICAgICAgIHRha2UoMSksXG4gICAgICAgICAgICAgICAgbWFwKGNhbGxlZENvdW50ID0+ICh7XG4gICAgICAgICAgICAgICAgICAuLi5kcmFnRW5kRGF0YSxcbiAgICAgICAgICAgICAgICAgIGRyYWdDYW5jZWxsZWQ6IGNhbGxlZENvdW50ID4gMFxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBjYW5jZWxEcmFnJC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICByZXR1cm4gZHJhZ0VuZERhdGEkO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnN1YnNjcmliZSgoeyB4LCB5LCBkcmFnQ2FuY2VsbGVkIH0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmRyYWdFbmQubmV4dCh7IHgsIHksIGRyYWdDYW5jZWxsZWQgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoXG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICB0aGlzLmRyYWdBY3RpdmVDbGFzc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGN1cnJlbnREcmFnJC5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIG1lcmdlKGRyYWdDb21wbGV0ZSQsIGRyYWdFbmRlZCQpXG4gICAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChnbG9iYWxEcmFnU3R5bGUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwb2ludGVyTW92ZTtcbiAgICAgIH0pLFxuICAgICAgc2hhcmUoKVxuICAgICk7XG5cbiAgICBtZXJnZShcbiAgICAgIHBvaW50ZXJEcmFnZ2VkJC5waXBlKFxuICAgICAgICB0YWtlKDEpLFxuICAgICAgICBtYXAodmFsdWUgPT4gWywgdmFsdWVdKVxuICAgICAgKSxcbiAgICAgIHBvaW50ZXJEcmFnZ2VkJC5waXBlKHBhaXJ3aXNlKCkpXG4gICAgKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoW3ByZXZpb3VzLCBuZXh0XSkgPT4ge1xuICAgICAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcHJldmlvdXMueCAhPT0gbmV4dC54IHx8IHByZXZpb3VzLnkgIT09IG5leHQueTtcbiAgICAgICAgfSksXG4gICAgICAgIG1hcCgoW3ByZXZpb3VzLCBuZXh0XSkgPT4gbmV4dClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICh7IHgsIHksIGN1cnJlbnREcmFnJCwgY2xpZW50WCwgY2xpZW50WSwgdHJhbnNmb3JtWCwgdHJhbnNmb3JtWSB9KSA9PiB7XG4gICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRyYWdnaW5nLm5leHQoeyB4LCB5IH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh0aGlzLmdob3N0RWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RyYW5zZm9ybVh9cHgsICR7dHJhbnNmb3JtWX1weClgO1xuICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50U3R5bGVzKHRoaXMuZ2hvc3RFbGVtZW50LCB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJzogdHJhbnNmb3JtLFxuICAgICAgICAgICAgICAnLW1zLXRyYW5zZm9ybSc6IHRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgJy1tb3otdHJhbnNmb3JtJzogdHJhbnNmb3JtLFxuICAgICAgICAgICAgICAnLW8tdHJhbnNmb3JtJzogdHJhbnNmb3JtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudERyYWckLm5leHQoe1xuICAgICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICAgIGNsaWVudFksXG4gICAgICAgICAgICBkcm9wRGF0YTogdGhpcy5kcm9wRGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLmRyYWdBeGlzKSB7XG4gICAgICB0aGlzLmNoZWNrRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnVuc3Vic2NyaWJlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnBvaW50ZXJEb3duJC5jb21wbGV0ZSgpO1xuICAgIHRoaXMucG9pbnRlck1vdmUkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5wb2ludGVyVXAkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgY29uc3QgY2FuRHJhZzogYm9vbGVhbiA9IHRoaXMuY2FuRHJhZygpO1xuICAgIGNvbnN0IGhhc0V2ZW50TGlzdGVuZXJzOiBib29sZWFuID1cbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMpLmxlbmd0aCA+IDA7XG5cbiAgICBpZiAoY2FuRHJhZyAmJiAhaGFzRXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vkb3duID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ21vdXNlZG93bicsXG4gICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VEb3duKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZXVwID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAnbW91c2V1cCcsXG4gICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VVcChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2hzdGFydCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaFN0YXJ0KGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaGVuZCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgJ3RvdWNoZW5kJyxcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaEVuZChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2hjYW5jZWwgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICd0b3VjaGNhbmNlbCcsXG4gICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hFbmQoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlZW50ZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAnbW91c2VlbnRlcicsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbk1vdXNlRW50ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZWxlYXZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ21vdXNlbGVhdmUnLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZUxlYXZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghY2FuRHJhZyAmJiBoYXNFdmVudExpc3RlbmVycykge1xuICAgICAgdGhpcy51bnN1YnNjcmliZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmUpIHtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICdtb3VzZW1vdmUnLFxuICAgICAgICAobW91c2VNb3ZlRXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlJC5uZXh0KHtcbiAgICAgICAgICAgIGV2ZW50OiBtb3VzZU1vdmVFdmVudCxcbiAgICAgICAgICAgIGNsaWVudFg6IG1vdXNlTW92ZUV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICBjbGllbnRZOiBtb3VzZU1vdmVFdmVudC5jbGllbnRZXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMucG9pbnRlckRvd24kLm5leHQoe1xuICAgICAgZXZlbnQsXG4gICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQuY2xpZW50WVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmUpIHtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlKCk7XG4gICAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmU7XG4gICAgfVxuICAgIHRoaXMucG9pbnRlclVwJC5uZXh0KHtcbiAgICAgIGV2ZW50LFxuICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFlcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25Ub3VjaFN0YXJ0KGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNjcm9sbENvbnRhaW5lcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIGxldCBoYXNDb250YWluZXJTY3JvbGxiYXI6IGJvb2xlYW47XG4gICAgbGV0IHN0YXJ0U2Nyb2xsUG9zaXRpb246IGFueTtcbiAgICBsZXQgaXNEcmFnQWN0aXZhdGVkOiBib29sZWFuO1xuICAgIGlmICh0aGlzLnNjcm9sbENvbnRhaW5lciAmJiB0aGlzLnNjcm9sbENvbnRhaW5lci5hY3RpdmVMb25nUHJlc3NEcmFnKSB7XG4gICAgICB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJCZWdpbiA9IERhdGUubm93KCk7XG4gICAgICBpc0RyYWdBY3RpdmF0ZWQgPSBmYWxzZTtcbiAgICAgIGhhc0NvbnRhaW5lclNjcm9sbGJhciA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmhhc1Njcm9sbGJhcigpO1xuICAgICAgc3RhcnRTY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNobW92ZSkge1xuICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaG1vdmUgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgJ3RvdWNobW92ZScsXG4gICAgICAgICh0b3VjaE1vdmVFdmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyICYmXG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5hY3RpdmVMb25nUHJlc3NEcmFnICYmXG4gICAgICAgICAgICAhaXNEcmFnQWN0aXZhdGVkICYmXG4gICAgICAgICAgICBoYXNDb250YWluZXJTY3JvbGxiYXJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGlzRHJhZ0FjdGl2YXRlZCA9IHRoaXMuc2hvdWxkQmVnaW5EcmFnKFxuICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgdG91Y2hNb3ZlRXZlbnQsXG4gICAgICAgICAgICAgIHN0YXJ0U2Nyb2xsUG9zaXRpb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLnNjcm9sbENvbnRhaW5lciB8fFxuICAgICAgICAgICAgIXRoaXMuc2Nyb2xsQ29udGFpbmVyLmFjdGl2ZUxvbmdQcmVzc0RyYWcgfHxcbiAgICAgICAgICAgICFoYXNDb250YWluZXJTY3JvbGxiYXIgfHxcbiAgICAgICAgICAgIGlzRHJhZ0FjdGl2YXRlZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5wb2ludGVyTW92ZSQubmV4dCh7XG4gICAgICAgICAgICAgIGV2ZW50OiB0b3VjaE1vdmVFdmVudCxcbiAgICAgICAgICAgICAgY2xpZW50WDogdG91Y2hNb3ZlRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgICAgICAgICBjbGllbnRZOiB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5wb2ludGVyRG93biQubmV4dCh7XG4gICAgICBldmVudCxcbiAgICAgIGNsaWVudFg6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvblRvdWNoRW5kKGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlKSB7XG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNobW92ZSgpO1xuICAgICAgZGVsZXRlIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlO1xuICAgICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyICYmIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFjdGl2ZUxvbmdQcmVzc0RyYWcpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIuZW5hYmxlU2Nyb2xsKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucG9pbnRlclVwJC5uZXh0KHtcbiAgICAgIGV2ZW50LFxuICAgICAgY2xpZW50WDogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFlcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25Nb3VzZUVudGVyKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0Q3Vyc29yKHRoaXMuZHJhZ0N1cnNvcik7XG4gIH1cblxuICBwcml2YXRlIG9uTW91c2VMZWF2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEN1cnNvcignJyk7XG4gIH1cblxuICBwcml2YXRlIGNhbkRyYWcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZHJhZ0F4aXMueCB8fCB0aGlzLmRyYWdBeGlzLnk7XG4gIH1cblxuICBwcml2YXRlIHNldEN1cnNvcih2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2N1cnNvcicsIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVFdmVudExpc3RlbmVycygpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgKHRoaXMgYXMgYW55KS5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9uc1t0eXBlXSgpO1xuICAgICAgZGVsZXRlICh0aGlzIGFzIGFueSkuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnNbdHlwZV07XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldEVsZW1lbnRTdHlsZXMoXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgc3R5bGVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9XG4gICkge1xuICAgIE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShlbGVtZW50LCBrZXksIHN0eWxlc1trZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U2Nyb2xsUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICAgIGxlZnQ6IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICBsZWZ0OiB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnRcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzaG91bGRCZWdpbkRyYWcoXG4gICAgZXZlbnQ6IFRvdWNoRXZlbnQsXG4gICAgdG91Y2hNb3ZlRXZlbnQ6IFRvdWNoRXZlbnQsXG4gICAgc3RhcnRTY3JvbGxQb3NpdGlvbjogYW55XG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG1vdmVTY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICBjb25zdCBkZWx0YVNjcm9sbCA9IHtcbiAgICAgIHRvcDogTWF0aC5hYnMobW92ZVNjcm9sbFBvc2l0aW9uLnRvcCAtIHN0YXJ0U2Nyb2xsUG9zaXRpb24udG9wKSxcbiAgICAgIGxlZnQ6IE1hdGguYWJzKG1vdmVTY3JvbGxQb3NpdGlvbi5sZWZ0IC0gc3RhcnRTY3JvbGxQb3NpdGlvbi5sZWZ0KVxuICAgIH07XG4gICAgY29uc3QgZGVsdGFYID1cbiAgICAgIE1hdGguYWJzKFxuICAgICAgICB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFggLSBldmVudC50b3VjaGVzWzBdLmNsaWVudFhcbiAgICAgICkgLSBkZWx0YVNjcm9sbC5sZWZ0O1xuICAgIGNvbnN0IGRlbHRhWSA9XG4gICAgICBNYXRoLmFicyhcbiAgICAgICAgdG91Y2hNb3ZlRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZIC0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZXG4gICAgICApIC0gZGVsdGFTY3JvbGwudG9wO1xuICAgIGNvbnN0IGRlbHRhVG90YWwgPSBkZWx0YVggKyBkZWx0YVk7XG4gICAgaWYgKFxuICAgICAgZGVsdGFUb3RhbCA+IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmxvbmdQcmVzc0NvbmZpZy5kZWx0YSB8fFxuICAgICAgZGVsdGFTY3JvbGwudG9wID4gMCB8fFxuICAgICAgZGVsdGFTY3JvbGwubGVmdCA+IDBcbiAgICApIHtcbiAgICAgIHRoaXMudGltZUxvbmdQcmVzcy50aW1lckJlZ2luID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gICAgdGhpcy50aW1lTG9uZ1ByZXNzLnRpbWVyRW5kID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBkdXJhdGlvbiA9XG4gICAgICB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJFbmQgLSB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJCZWdpbjtcbiAgICBpZiAoZHVyYXRpb24gPj0gdGhpcy5zY3JvbGxDb250YWluZXIubG9uZ1ByZXNzQ29uZmlnLmR1cmF0aW9uKSB7XG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5kaXNhYmxlU2Nyb2xsKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=