/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
export class DraggableDirective {
    /**
     * @hidden
     * @param {?} element
     * @param {?} renderer
     * @param {?} draggableHelper
     * @param {?} zone
     * @param {?} vcr
     * @param {?} scrollContainer
     * @param {?} document
     */
    constructor(element, renderer, draggableHelper, zone, vcr, scrollContainer, document) {
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
    ngOnInit() {
        this.checkEventListeners();
        /** @type {?} */
        const pointerDragged$ = this.pointerDown$.pipe(filter(() => this.canDrag()), mergeMap((pointerDownEvent) => {
            // fix for https://github.com/mattlewis92/angular-draggable-droppable/issues/61
            // stop mouse events propagating up the chain
            if (pointerDownEvent.event.stopPropagation && !this.scrollContainer) {
                pointerDownEvent.event.stopPropagation();
            }
            /** @type {?} */
            const globalDragStyle = this.renderer.createElement('style');
            this.renderer.setAttribute(globalDragStyle, 'type', 'text/css');
            this.renderer.appendChild(globalDragStyle, this.renderer.createText(`
          body * {
           -moz-user-select: none;
           -ms-user-select: none;
           -webkit-user-select: none;
           user-select: none;
          }
        `));
            this.document.head.appendChild(globalDragStyle);
            /** @type {?} */
            const startScrollPosition = this.getScrollPosition();
            /** @type {?} */
            const scrollContainerScroll$ = new Observable(observer => {
                /** @type {?} */
                const scrollContainer = this.scrollContainer
                    ? this.scrollContainer.elementRef.nativeElement
                    : 'window';
                return this.renderer.listen(scrollContainer, 'scroll', e => observer.next(e));
            }).pipe(startWith(startScrollPosition), map(() => this.getScrollPosition()));
            /** @type {?} */
            const currentDrag$ = new Subject();
            /** @type {?} */
            const cancelDrag$ = new ReplaySubject();
            this.zone.run(() => {
                this.dragPointerDown.next({ x: 0, y: 0 });
            });
            /** @type {?} */
            const dragComplete$ = merge(this.pointerUp$, this.pointerDown$, cancelDrag$, this.destroy$).pipe(share());
            /** @type {?} */
            const pointerMove = combineLatest(this.pointerMove$, scrollContainerScroll$).pipe(map(([pointerMoveEvent, scroll]) => {
                return {
                    currentDrag$,
                    transformX: pointerMoveEvent.clientX - pointerDownEvent.clientX,
                    transformY: pointerMoveEvent.clientY - pointerDownEvent.clientY,
                    clientX: pointerMoveEvent.clientX,
                    clientY: pointerMoveEvent.clientY,
                    scrollLeft: scroll.left,
                    scrollTop: scroll.top
                };
            }), map(moveData => {
                if (this.dragSnapGrid.x) {
                    moveData.transformX =
                        Math.round(moveData.transformX / this.dragSnapGrid.x) *
                            this.dragSnapGrid.x;
                }
                if (this.dragSnapGrid.y) {
                    moveData.transformY =
                        Math.round(moveData.transformY / this.dragSnapGrid.y) *
                            this.dragSnapGrid.y;
                }
                return moveData;
            }), map(moveData => {
                if (!this.dragAxis.x) {
                    moveData.transformX = 0;
                }
                if (!this.dragAxis.y) {
                    moveData.transformY = 0;
                }
                return moveData;
            }), map(moveData => {
                /** @type {?} */
                const scrollX = moveData.scrollLeft - startScrollPosition.left;
                /** @type {?} */
                const scrollY = moveData.scrollTop - startScrollPosition.top;
                return Object.assign({}, moveData, { x: moveData.transformX + scrollX, y: moveData.transformY + scrollY });
            }), filter(({ x, y }) => !this.validateDrag || this.validateDrag({ x, y })), takeUntil(dragComplete$), share());
            /** @type {?} */
            const dragStarted$ = pointerMove.pipe(take(1), share());
            /** @type {?} */
            const dragEnded$ = pointerMove.pipe(takeLast(1), share());
            dragStarted$.subscribe(({ clientX, clientY, x, y }) => {
                this.zone.run(() => {
                    this.dragStart.next({ cancelDrag$ });
                });
                this.renderer.addClass(this.element.nativeElement, this.dragActiveClass);
                if (this.ghostDragEnabled) {
                    /** @type {?} */
                    const rect = this.element.nativeElement.getBoundingClientRect();
                    /** @type {?} */
                    const clone = /** @type {?} */ (this.element.nativeElement.cloneNode(true));
                    if (!this.showOriginalElementWhileDragging) {
                        this.renderer.setStyle(this.element.nativeElement, 'visibility', 'hidden');
                    }
                    if (this.ghostElementAppendTo) {
                        this.ghostElementAppendTo.appendChild(clone);
                    }
                    else {
                        /** @type {?} */ ((this.element.nativeElement.parentNode)).insertBefore(clone, this.element.nativeElement.nextSibling);
                    }
                    this.ghostElement = clone;
                    this.setElementStyles(clone, {
                        position: 'fixed',
                        top: `${rect.top}px`,
                        left: `${rect.left}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                        cursor: this.dragCursor,
                        margin: '0'
                    });
                    if (this.ghostElementTemplate) {
                        /** @type {?} */
                        const viewRef = this.vcr.createEmbeddedView(this.ghostElementTemplate);
                        clone.innerHTML = '';
                        viewRef.rootNodes
                            .filter(node => node instanceof Node)
                            .forEach(node => {
                            clone.appendChild(node);
                        });
                        dragEnded$.subscribe(() => {
                            this.vcr.remove(this.vcr.indexOf(viewRef));
                        });
                    }
                    this.zone.run(() => {
                        this.ghostElementCreated.emit({
                            clientX: clientX - x,
                            clientY: clientY - y,
                            element: clone
                        });
                    });
                    dragEnded$.subscribe(() => {
                        /** @type {?} */ ((clone.parentElement)).removeChild(clone);
                        this.ghostElement = null;
                        this.renderer.setStyle(this.element.nativeElement, 'visibility', '');
                    });
                }
                this.draggableHelper.currentDrag.next(currentDrag$);
            });
            dragEnded$
                .pipe(mergeMap(dragEndData => {
                /** @type {?} */
                const dragEndData$ = cancelDrag$.pipe(count(), take(1), map(calledCount => (Object.assign({}, dragEndData, { dragCancelled: calledCount > 0 }))));
                cancelDrag$.complete();
                return dragEndData$;
            }))
                .subscribe(({ x, y, dragCancelled }) => {
                this.zone.run(() => {
                    this.dragEnd.next({ x, y, dragCancelled });
                });
                this.renderer.removeClass(this.element.nativeElement, this.dragActiveClass);
                currentDrag$.complete();
            });
            merge(dragComplete$, dragEnded$)
                .pipe(take(1))
                .subscribe(() => {
                this.document.head.removeChild(globalDragStyle);
            });
            return pointerMove;
        }), share());
        merge(pointerDragged$.pipe(take(1), map(value => [, value])), pointerDragged$.pipe(pairwise()))
            .pipe(filter(([previous, next]) => {
            if (!previous) {
                return true;
            }
            return previous.x !== next.x || previous.y !== next.y;
        }), map(([previous, next]) => next))
            .subscribe(({ x, y, currentDrag$, clientX, clientY, transformX, transformY }) => {
            this.zone.run(() => {
                this.dragging.next({ x, y });
            });
            if (this.ghostElement) {
                /** @type {?} */
                const transform = `translate(${transformX}px, ${transformY}px)`;
                this.setElementStyles(this.ghostElement, {
                    transform,
                    '-webkit-transform': transform,
                    '-ms-transform': transform,
                    '-moz-transform': transform,
                    '-o-transform': transform
                });
            }
            currentDrag$.next({
                clientX,
                clientY,
                dropData: this.dropData
            });
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes["dragAxis"]) {
            this.checkEventListeners();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.unsubscribeEventListeners();
        this.pointerDown$.complete();
        this.pointerMove$.complete();
        this.pointerUp$.complete();
        this.destroy$.next();
    }
    /**
     * @return {?}
     */
    checkEventListeners() {
        /** @type {?} */
        const canDrag = this.canDrag();
        /** @type {?} */
        const hasEventListeners = Object.keys(this.eventListenerSubscriptions).length > 0;
        if (canDrag && !hasEventListeners) {
            this.zone.runOutsideAngular(() => {
                this.eventListenerSubscriptions.mousedown = this.renderer.listen(this.element.nativeElement, 'mousedown', (event) => {
                    this.onMouseDown(event);
                });
                this.eventListenerSubscriptions.mouseup = this.renderer.listen('document', 'mouseup', (event) => {
                    this.onMouseUp(event);
                });
                this.eventListenerSubscriptions.touchstart = this.renderer.listen(this.element.nativeElement, 'touchstart', (event) => {
                    this.onTouchStart(event);
                });
                this.eventListenerSubscriptions.touchend = this.renderer.listen('document', 'touchend', (event) => {
                    this.onTouchEnd(event);
                });
                this.eventListenerSubscriptions.touchcancel = this.renderer.listen('document', 'touchcancel', (event) => {
                    this.onTouchEnd(event);
                });
                this.eventListenerSubscriptions.mouseenter = this.renderer.listen(this.element.nativeElement, 'mouseenter', () => {
                    this.onMouseEnter();
                });
                this.eventListenerSubscriptions.mouseleave = this.renderer.listen(this.element.nativeElement, 'mouseleave', () => {
                    this.onMouseLeave();
                });
            });
        }
        else if (!canDrag && hasEventListeners) {
            this.unsubscribeEventListeners();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseDown(event) {
        if (!this.eventListenerSubscriptions.mousemove) {
            this.eventListenerSubscriptions.mousemove = this.renderer.listen('document', 'mousemove', (mouseMoveEvent) => {
                this.pointerMove$.next({
                    event: mouseMoveEvent,
                    clientX: mouseMoveEvent.clientX,
                    clientY: mouseMoveEvent.clientY
                });
            });
        }
        this.pointerDown$.next({
            event,
            clientX: event.clientX,
            clientY: event.clientY
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseUp(event) {
        if (this.eventListenerSubscriptions.mousemove) {
            this.eventListenerSubscriptions.mousemove();
            delete this.eventListenerSubscriptions.mousemove;
        }
        this.pointerUp$.next({
            event,
            clientX: event.clientX,
            clientY: event.clientY
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTouchStart(event) {
        if (!this.scrollContainer) {
            try {
                event.preventDefault();
            }
            catch (e) { }
        }
        /** @type {?} */
        let hasContainerScrollbar;
        /** @type {?} */
        let startScrollPosition;
        /** @type {?} */
        let isDragActivated;
        if (this.scrollContainer && this.scrollContainer.activeLongPressDrag) {
            this.timeLongPress.timerBegin = Date.now();
            isDragActivated = false;
            hasContainerScrollbar = this.scrollContainer.hasScrollbar();
            startScrollPosition = this.getScrollPosition();
        }
        if (!this.eventListenerSubscriptions.touchmove) {
            this.eventListenerSubscriptions.touchmove = this.renderer.listen('document', 'touchmove', (touchMoveEvent) => {
                if (this.scrollContainer &&
                    this.scrollContainer.activeLongPressDrag &&
                    !isDragActivated &&
                    hasContainerScrollbar) {
                    isDragActivated = this.shouldBeginDrag(event, touchMoveEvent, startScrollPosition);
                }
                if (!this.scrollContainer ||
                    !this.scrollContainer.activeLongPressDrag ||
                    !hasContainerScrollbar ||
                    isDragActivated) {
                    this.pointerMove$.next({
                        event: touchMoveEvent,
                        clientX: touchMoveEvent.targetTouches[0].clientX,
                        clientY: touchMoveEvent.targetTouches[0].clientY
                    });
                }
            });
        }
        this.pointerDown$.next({
            event,
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTouchEnd(event) {
        if (this.eventListenerSubscriptions.touchmove) {
            this.eventListenerSubscriptions.touchmove();
            delete this.eventListenerSubscriptions.touchmove;
            if (this.scrollContainer && this.scrollContainer.activeLongPressDrag) {
                this.scrollContainer.enableScroll();
            }
        }
        this.pointerUp$.next({
            event,
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY
        });
    }
    /**
     * @return {?}
     */
    onMouseEnter() {
        this.setCursor(this.dragCursor);
    }
    /**
     * @return {?}
     */
    onMouseLeave() {
        this.setCursor('');
    }
    /**
     * @return {?}
     */
    canDrag() {
        return this.dragAxis.x || this.dragAxis.y;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setCursor(value) {
        this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
    }
    /**
     * @return {?}
     */
    unsubscribeEventListeners() {
        Object.keys(this.eventListenerSubscriptions).forEach(type => {
            (/** @type {?} */ (this)).eventListenerSubscriptions[type]();
            delete (/** @type {?} */ (this)).eventListenerSubscriptions[type];
        });
    }
    /**
     * @param {?} element
     * @param {?} styles
     * @return {?}
     */
    setElementStyles(element, styles) {
        Object.keys(styles).forEach(key => {
            this.renderer.setStyle(element, key, styles[key]);
        });
    }
    /**
     * @return {?}
     */
    getScrollPosition() {
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
    }
    /**
     * @param {?} event
     * @param {?} touchMoveEvent
     * @param {?} startScrollPosition
     * @return {?}
     */
    shouldBeginDrag(event, touchMoveEvent, startScrollPosition) {
        /** @type {?} */
        const moveScrollPosition = this.getScrollPosition();
        /** @type {?} */
        const deltaScroll = {
            top: Math.abs(moveScrollPosition.top - startScrollPosition.top),
            left: Math.abs(moveScrollPosition.left - startScrollPosition.left)
        };
        /** @type {?} */
        const deltaX = Math.abs(touchMoveEvent.targetTouches[0].clientX - event.touches[0].clientX) - deltaScroll.left;
        /** @type {?} */
        const deltaY = Math.abs(touchMoveEvent.targetTouches[0].clientY - event.touches[0].clientY) - deltaScroll.top;
        /** @type {?} */
        const deltaTotal = deltaX + deltaY;
        if (deltaTotal > this.scrollContainer.longPressConfig.delta ||
            deltaScroll.top > 0 ||
            deltaScroll.left > 0) {
            this.timeLongPress.timerBegin = Date.now();
        }
        this.timeLongPress.timerEnd = Date.now();
        /** @type {?} */
        const duration = this.timeLongPress.timerEnd - this.timeLongPress.timerBegin;
        if (duration >= this.scrollContainer.longPressConfig.duration) {
            this.scrollContainer.disableScroll();
            return true;
        }
        return false;
    }
}
DraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlDraggable]'
            },] }
];
/** @nocollapse */
DraggableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: DraggableHelper },
    { type: NgZone },
    { type: ViewContainerRef },
    { type: DraggableScrollContainerDirective, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULFVBQVUsRUFDVixTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUVOLE1BQU0sRUFDTixXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLFFBQVEsRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNoRixPQUFPLEVBQ0wsR0FBRyxFQUNILFFBQVEsRUFDUixTQUFTLEVBQ1QsSUFBSSxFQUNKLFFBQVEsRUFDUixRQUFRLEVBQ1IsS0FBSyxFQUNMLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNWLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFtQixlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMvRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtRDNGLE1BQU07Ozs7Ozs7Ozs7O0lBaUlKLFlBQ1UsU0FDQSxVQUNBLGlCQUNBLE1BQ0EsS0FDWSxlQUFrRCxFQUM1QyxRQUFhO1FBTi9CLFlBQU8sR0FBUCxPQUFPO1FBQ1AsYUFBUSxHQUFSLFFBQVE7UUFDUixvQkFBZSxHQUFmLGVBQWU7UUFDZixTQUFJLEdBQUosSUFBSTtRQUNKLFFBQUcsR0FBSCxH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O2FBQzNCOzs7O1lBL0VDLFVBQVU7WUFDVixTQUFTO1lBMEJlLGVBQWU7WUFwQnZDLE1BQU07WUFJTixnQkFBZ0I7WUFrQlQsaUNBQWlDLHVCQTBMckMsUUFBUTs0Q0FDUixNQUFNLFNBQUMsUUFBUTs7O3VCQXBJakIsS0FBSzt1QkFNTCxLQUFLOzJCQU1MLEtBQUs7K0JBTUwsS0FBSzsrQ0FNTCxLQUFLOzJCQU1MLEtBQUs7eUJBTUwsS0FBSzs4QkFNTCxLQUFLO21DQU1MLEtBQUs7bUNBTUwsS0FBSzs4QkFNTCxNQUFNO3dCQVFOLE1BQU07a0NBTU4sTUFBTTt1QkFNTixNQUFNO3NCQU1OLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIE9uSW5pdCxcbiAgRWxlbWVudFJlZixcbiAgUmVuZGVyZXIyLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25DaGFuZ2VzLFxuICBOZ1pvbmUsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEluamVjdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIE9wdGlvbmFsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSwgbWVyZ2UsIFJlcGxheVN1YmplY3QsIGNvbWJpbmVMYXRlc3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG4gIHRha2VVbnRpbCxcbiAgdGFrZSxcbiAgdGFrZUxhc3QsXG4gIHBhaXJ3aXNlLFxuICBzaGFyZSxcbiAgZmlsdGVyLFxuICBjb3VudCxcbiAgc3RhcnRXaXRoXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEN1cnJlbnREcmFnRGF0YSwgRHJhZ2dhYmxlSGVscGVyIH0gZnJvbSAnLi9kcmFnZ2FibGUtaGVscGVyLnByb3ZpZGVyJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERyYWdnYWJsZVNjcm9sbENvbnRhaW5lckRpcmVjdGl2ZSB9IGZyb20gJy4vZHJhZ2dhYmxlLXNjcm9sbC1jb250YWluZXIuZGlyZWN0aXZlJztcblxuZXhwb3J0IGludGVyZmFjZSBDb29yZGluYXRlcyB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdBeGlzIHtcbiAgeDogYm9vbGVhbjtcbiAgeTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTbmFwR3JpZCB7XG4gIHg/OiBudW1iZXI7XG4gIHk/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJhZ1BvaW50ZXJEb3duRXZlbnQgZXh0ZW5kcyBDb29yZGluYXRlcyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdTdGFydEV2ZW50IHtcbiAgY2FuY2VsRHJhZyQ6IFJlcGxheVN1YmplY3Q8dm9pZD47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJhZ01vdmVFdmVudCBleHRlbmRzIENvb3JkaW5hdGVzIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJhZ0VuZEV2ZW50IGV4dGVuZHMgQ29vcmRpbmF0ZXMge1xuICBkcmFnQ2FuY2VsbGVkOiBib29sZWFuO1xufVxuXG5leHBvcnQgdHlwZSBWYWxpZGF0ZURyYWcgPSAoY29vcmRpbmF0ZXM6IENvb3JkaW5hdGVzKSA9PiBib29sZWFuO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBvaW50ZXJFdmVudCB7XG4gIGNsaWVudFg6IG51bWJlcjtcbiAgY2xpZW50WTogbnVtYmVyO1xuICBldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZUxvbmdQcmVzcyB7XG4gIHRpbWVyQmVnaW46IG51bWJlcjtcbiAgdGltZXJFbmQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHaG9zdEVsZW1lbnRDcmVhdGVkRXZlbnQge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttd2xEcmFnZ2FibGVdJ1xufSlcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIGFuIG9iamVjdCBvZiBkYXRhIHlvdSBjYW4gcGFzcyB0byB0aGUgZHJvcCBldmVudFxuICAgKi9cbiAgQElucHV0KClcbiAgZHJvcERhdGE6IGFueTtcblxuICAvKipcbiAgICogVGhlIGF4aXMgYWxvbmcgd2hpY2ggdGhlIGVsZW1lbnQgaXMgZHJhZ2dhYmxlXG4gICAqL1xuICBASW5wdXQoKVxuICBkcmFnQXhpczogRHJhZ0F4aXMgPSB7IHg6IHRydWUsIHk6IHRydWUgfTtcblxuICAvKipcbiAgICogU25hcCBhbGwgZHJhZ3MgdG8gYW4geCAvIHkgZ3JpZFxuICAgKi9cbiAgQElucHV0KClcbiAgZHJhZ1NuYXBHcmlkOiBTbmFwR3JpZCA9IHt9O1xuXG4gIC8qKlxuICAgKiBTaG93IGEgZ2hvc3QgZWxlbWVudCB0aGF0IHNob3dzIHRoZSBkcmFnIHdoZW4gZHJhZ2dpbmdcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdob3N0RHJhZ0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBTaG93IHRoZSBvcmlnaW5hbCBlbGVtZW50IHdoZW4gZ2hvc3REcmFnRW5hYmxlZCBpcyB0cnVlXG4gICAqL1xuICBASW5wdXQoKVxuICBzaG93T3JpZ2luYWxFbGVtZW50V2hpbGVEcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBbGxvdyBjdXN0b20gYmVoYXZpb3VyIHRvIGNvbnRyb2wgd2hlbiB0aGUgZWxlbWVudCBpcyBkcmFnZ2VkXG4gICAqL1xuICBASW5wdXQoKVxuICB2YWxpZGF0ZURyYWc6IFZhbGlkYXRlRHJhZztcblxuICAvKipcbiAgICogVGhlIGN1cnNvciB0byB1c2Ugd2hlbiBkcmFnZ2luZyB0aGUgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KClcbiAgZHJhZ0N1cnNvcjogc3RyaW5nID0gJyc7XG5cbiAgLyoqXG4gICAqIFRoZSBjc3MgY2xhc3MgdG8gYXBwbHkgd2hlbiB0aGUgZWxlbWVudCBpcyBiZWluZyBkcmFnZ2VkXG4gICAqL1xuICBASW5wdXQoKVxuICBkcmFnQWN0aXZlQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGVsZW1lbnQgdGhlIGdob3N0IGVsZW1lbnQgd2lsbCBiZSBhcHBlbmRlZCB0by4gRGVmYXVsdCBpcyBuZXh0IHRvIHRoZSBkcmFnZ2VkIGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdob3N0RWxlbWVudEFwcGVuZFRvOiBIVE1MRWxlbWVudDtcblxuICAvKipcbiAgICogQW4gbmctdGVtcGxhdGUgdG8gYmUgaW5zZXJ0ZWQgaW50byB0aGUgcGFyZW50IGVsZW1lbnQgb2YgdGhlIGdob3N0IGVsZW1lbnQuIEl0IHdpbGwgb3ZlcndyaXRlIGFueSBjaGlsZCBub2Rlcy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdob3N0RWxlbWVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgZWxlbWVudCBjYW4gYmUgZHJhZ2dlZCBhbG9uZyBvbmUgYXhpcyBhbmQgaGFzIHRoZSBtb3VzZSBvciBwb2ludGVyIGRldmljZSBwcmVzc2VkIG9uIGl0XG4gICAqL1xuICBAT3V0cHV0KClcbiAgZHJhZ1BvaW50ZXJEb3duID0gbmV3IEV2ZW50RW1pdHRlcjxEcmFnUG9pbnRlckRvd25FdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGVsZW1lbnQgaGFzIHN0YXJ0ZWQgdG8gYmUgZHJhZ2dlZC5cbiAgICogT25seSBjYWxsZWQgYWZ0ZXIgYXQgbGVhc3Qgb25lIG1vdXNlIG9yIHRvdWNoIG1vdmUgZXZlbnQuXG4gICAqIElmIHlvdSBjYWxsICRldmVudC5jYW5jZWxEcmFnJC5lbWl0KCkgaXQgd2lsbCBjYW5jZWwgdGhlIGN1cnJlbnQgZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyYWdTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ1N0YXJ0RXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCBhZnRlciB0aGUgZ2hvc3QgZWxlbWVudCBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgZ2hvc3RFbGVtZW50Q3JlYXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8R2hvc3RFbGVtZW50Q3JlYXRlZEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgZWxlbWVudCBpcyBiZWluZyBkcmFnZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgZHJhZ2dpbmcgPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdNb3ZlRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCBhZnRlciB0aGUgZWxlbWVudCBpcyBkcmFnZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgZHJhZ0VuZCA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ0VuZEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwb2ludGVyRG93biQgPSBuZXcgU3ViamVjdDxQb2ludGVyRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHBvaW50ZXJNb3ZlJCA9IG5ldyBTdWJqZWN0PFBvaW50ZXJFdmVudD4oKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcG9pbnRlclVwJCA9IG5ldyBTdWJqZWN0PFBvaW50ZXJFdmVudD4oKTtcblxuICBwcml2YXRlIGV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zOiB7XG4gICAgbW91c2Vtb3ZlPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZWRvd24/OiAoKSA9PiB2b2lkO1xuICAgIG1vdXNldXA/OiAoKSA9PiB2b2lkO1xuICAgIG1vdXNlZW50ZXI/OiAoKSA9PiB2b2lkO1xuICAgIG1vdXNlbGVhdmU/OiAoKSA9PiB2b2lkO1xuICAgIHRvdWNoc3RhcnQ/OiAoKSA9PiB2b2lkO1xuICAgIHRvdWNobW92ZT86ICgpID0+IHZvaWQ7XG4gICAgdG91Y2hlbmQ/OiAoKSA9PiB2b2lkO1xuICAgIHRvdWNoY2FuY2VsPzogKCkgPT4gdm9pZDtcbiAgfSA9IHt9O1xuXG4gIHByaXZhdGUgZ2hvc3RFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG5cbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgcHJpdmF0ZSB0aW1lTG9uZ1ByZXNzOiBUaW1lTG9uZ1ByZXNzID0geyB0aW1lckJlZ2luOiAwLCB0aW1lckVuZDogMCB9O1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGRyYWdnYWJsZUhlbHBlcjogRHJhZ2dhYmxlSGVscGVyLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgc2Nyb2xsQ29udGFpbmVyOiBEcmFnZ2FibGVTY3JvbGxDb250YWluZXJEaXJlY3RpdmUsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55XG4gICkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmNoZWNrRXZlbnRMaXN0ZW5lcnMoKTtcblxuICAgIGNvbnN0IHBvaW50ZXJEcmFnZ2VkJDogT2JzZXJ2YWJsZTxhbnk+ID0gdGhpcy5wb2ludGVyRG93biQucGlwZShcbiAgICAgIGZpbHRlcigoKSA9PiB0aGlzLmNhbkRyYWcoKSksXG4gICAgICBtZXJnZU1hcCgocG9pbnRlckRvd25FdmVudDogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgICAgIC8vIGZpeCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL21hdHRsZXdpczkyL2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZS9pc3N1ZXMvNjFcbiAgICAgICAgLy8gc3RvcCBtb3VzZSBldmVudHMgcHJvcGFnYXRpbmcgdXAgdGhlIGNoYWluXG4gICAgICAgIGlmIChwb2ludGVyRG93bkV2ZW50LmV2ZW50LnN0b3BQcm9wYWdhdGlvbiAmJiAhdGhpcy5zY3JvbGxDb250YWluZXIpIHtcbiAgICAgICAgICBwb2ludGVyRG93bkV2ZW50LmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFjayB0byBwcmV2ZW50IHRleHQgZ2V0dGluZyBzZWxlY3RlZCBpbiBzYWZhcmkgd2hpbGUgZHJhZ2dpbmdcbiAgICAgICAgY29uc3QgZ2xvYmFsRHJhZ1N0eWxlOiBIVE1MU3R5bGVFbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdzdHlsZSdcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoZ2xvYmFsRHJhZ1N0eWxlLCAndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKFxuICAgICAgICAgIGdsb2JhbERyYWdTdHlsZSxcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLmNyZWF0ZVRleHQoYFxuICAgICAgICAgIGJvZHkgKiB7XG4gICAgICAgICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgICAgICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgfVxuICAgICAgICBgKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZ2xvYmFsRHJhZ1N0eWxlKTtcblxuICAgICAgICBjb25zdCBzdGFydFNjcm9sbFBvc2l0aW9uID0gdGhpcy5nZXRTY3JvbGxQb3NpdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IHNjcm9sbENvbnRhaW5lclNjcm9sbCQgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICAgICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVyID0gdGhpcy5zY3JvbGxDb250YWluZXJcbiAgICAgICAgICAgID8gdGhpcy5zY3JvbGxDb250YWluZXIuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgICA6ICd3aW5kb3cnO1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3RlbihzY3JvbGxDb250YWluZXIsICdzY3JvbGwnLCBlID0+XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KGUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSkucGlwZShcbiAgICAgICAgICBzdGFydFdpdGgoc3RhcnRTY3JvbGxQb3NpdGlvbiksXG4gICAgICAgICAgbWFwKCgpID0+IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKSlcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBjdXJyZW50RHJhZyQgPSBuZXcgU3ViamVjdDxDdXJyZW50RHJhZ0RhdGE+KCk7XG4gICAgICAgIGNvbnN0IGNhbmNlbERyYWckID0gbmV3IFJlcGxheVN1YmplY3Q8dm9pZD4oKTtcblxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmRyYWdQb2ludGVyRG93bi5uZXh0KHsgeDogMCwgeTogMCB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZHJhZ0NvbXBsZXRlJCA9IG1lcmdlKFxuICAgICAgICAgIHRoaXMucG9pbnRlclVwJCxcbiAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duJCxcbiAgICAgICAgICBjYW5jZWxEcmFnJCxcbiAgICAgICAgICB0aGlzLmRlc3Ryb3kkXG4gICAgICAgICkucGlwZShzaGFyZSgpKTtcblxuICAgICAgICBjb25zdCBwb2ludGVyTW92ZSA9IGNvbWJpbmVMYXRlc3Q8XG4gICAgICAgICAgUG9pbnRlckV2ZW50LFxuICAgICAgICAgIHsgdG9wOiBudW1iZXI7IGxlZnQ6IG51bWJlciB9XG4gICAgICAgID4odGhpcy5wb2ludGVyTW92ZSQsIHNjcm9sbENvbnRhaW5lclNjcm9sbCQpLnBpcGUoXG4gICAgICAgICAgbWFwKChbcG9pbnRlck1vdmVFdmVudCwgc2Nyb2xsXSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgY3VycmVudERyYWckLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm1YOiBwb2ludGVyTW92ZUV2ZW50LmNsaWVudFggLSBwb2ludGVyRG93bkV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybVk6IHBvaW50ZXJNb3ZlRXZlbnQuY2xpZW50WSAtIHBvaW50ZXJEb3duRXZlbnQuY2xpZW50WSxcbiAgICAgICAgICAgICAgY2xpZW50WDogcG9pbnRlck1vdmVFdmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICBjbGllbnRZOiBwb2ludGVyTW92ZUV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICAgIHNjcm9sbExlZnQ6IHNjcm9sbC5sZWZ0LFxuICAgICAgICAgICAgICBzY3JvbGxUb3A6IHNjcm9sbC50b3BcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSksXG4gICAgICAgICAgbWFwKG1vdmVEYXRhID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdTbmFwR3JpZC54KSB7XG4gICAgICAgICAgICAgIG1vdmVEYXRhLnRyYW5zZm9ybVggPVxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQobW92ZURhdGEudHJhbnNmb3JtWCAvIHRoaXMuZHJhZ1NuYXBHcmlkLngpICpcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdTbmFwR3JpZC54O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnU25hcEdyaWQueSkge1xuICAgICAgICAgICAgICBtb3ZlRGF0YS50cmFuc2Zvcm1ZID1cbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKG1vdmVEYXRhLnRyYW5zZm9ybVkgLyB0aGlzLmRyYWdTbmFwR3JpZC55KSAqXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnU25hcEdyaWQueTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1vdmVEYXRhO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1hcChtb3ZlRGF0YSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZHJhZ0F4aXMueCkge1xuICAgICAgICAgICAgICBtb3ZlRGF0YS50cmFuc2Zvcm1YID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmRyYWdBeGlzLnkpIHtcbiAgICAgICAgICAgICAgbW92ZURhdGEudHJhbnNmb3JtWSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtb3ZlRGF0YTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBtYXAobW92ZURhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsWCA9IG1vdmVEYXRhLnNjcm9sbExlZnQgLSBzdGFydFNjcm9sbFBvc2l0aW9uLmxlZnQ7XG4gICAgICAgICAgICBjb25zdCBzY3JvbGxZID0gbW92ZURhdGEuc2Nyb2xsVG9wIC0gc3RhcnRTY3JvbGxQb3NpdGlvbi50b3A7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5tb3ZlRGF0YSxcbiAgICAgICAgICAgICAgeDogbW92ZURhdGEudHJhbnNmb3JtWCArIHNjcm9sbFgsXG4gICAgICAgICAgICAgIHk6IG1vdmVEYXRhLnRyYW5zZm9ybVkgKyBzY3JvbGxZXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGZpbHRlcihcbiAgICAgICAgICAgICh7IHgsIHkgfSkgPT4gIXRoaXMudmFsaWRhdGVEcmFnIHx8IHRoaXMudmFsaWRhdGVEcmFnKHsgeCwgeSB9KVxuICAgICAgICAgICksXG4gICAgICAgICAgdGFrZVVudGlsKGRyYWdDb21wbGV0ZSQpLFxuICAgICAgICAgIHNoYXJlKClcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBkcmFnU3RhcnRlZCQgPSBwb2ludGVyTW92ZS5waXBlKFxuICAgICAgICAgIHRha2UoMSksXG4gICAgICAgICAgc2hhcmUoKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBkcmFnRW5kZWQkID0gcG9pbnRlck1vdmUucGlwZShcbiAgICAgICAgICB0YWtlTGFzdCgxKSxcbiAgICAgICAgICBzaGFyZSgpXG4gICAgICAgICk7XG5cbiAgICAgICAgZHJhZ1N0YXJ0ZWQkLnN1YnNjcmliZSgoeyBjbGllbnRYLCBjbGllbnRZLCB4LCB5IH0pID0+IHtcbiAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ1N0YXJ0Lm5leHQoeyBjYW5jZWxEcmFnJCB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgIHRoaXMuZHJhZ0FjdGl2ZUNsYXNzXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmICh0aGlzLmdob3N0RHJhZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xvbmVOb2RlKFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNob3dPcmlnaW5hbEVsZW1lbnRXaGlsZURyYWdnaW5nKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgJ3Zpc2liaWxpdHknLFxuICAgICAgICAgICAgICAgICdoaWRkZW4nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdob3N0RWxlbWVudEFwcGVuZFRvKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50QXBwZW5kVG8uYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgIGNsb25lLFxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50Lm5leHRTaWJsaW5nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50ID0gY2xvbmU7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudFN0eWxlcyhjbG9uZSwge1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgdG9wOiBgJHtyZWN0LnRvcH1weGAsXG4gICAgICAgICAgICAgIGxlZnQ6IGAke3JlY3QubGVmdH1weGAsXG4gICAgICAgICAgICAgIHdpZHRoOiBgJHtyZWN0LndpZHRofXB4YCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBgJHtyZWN0LmhlaWdodH1weGAsXG4gICAgICAgICAgICAgIGN1cnNvcjogdGhpcy5kcmFnQ3Vyc29yLFxuICAgICAgICAgICAgICBtYXJnaW46ICcwJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdob3N0RWxlbWVudFRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZpZXdSZWYgPSB0aGlzLnZjci5jcmVhdGVFbWJlZGRlZFZpZXcoXG4gICAgICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnRUZW1wbGF0ZVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBjbG9uZS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgdmlld1JlZi5yb290Tm9kZXNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKG5vZGUgPT4gbm9kZSBpbnN0YW5jZW9mIE5vZGUpXG4gICAgICAgICAgICAgICAgLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgICBjbG9uZS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgZHJhZ0VuZGVkJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudmNyLnJlbW92ZSh0aGlzLnZjci5pbmRleE9mKHZpZXdSZWYpKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudENyZWF0ZWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogY2xpZW50WCAtIHgsXG4gICAgICAgICAgICAgICAgY2xpZW50WTogY2xpZW50WSAtIHksXG4gICAgICAgICAgICAgICAgZWxlbWVudDogY2xvbmVcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZHJhZ0VuZGVkJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICBjbG9uZS5wYXJlbnRFbGVtZW50IS5yZW1vdmVDaGlsZChjbG9uZSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAndmlzaWJpbGl0eScsXG4gICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlSGVscGVyLmN1cnJlbnREcmFnLm5leHQoY3VycmVudERyYWckKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ0VuZGVkJFxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgbWVyZ2VNYXAoZHJhZ0VuZERhdGEgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBkcmFnRW5kRGF0YSQgPSBjYW5jZWxEcmFnJC5waXBlKFxuICAgICAgICAgICAgICAgIGNvdW50KCksXG4gICAgICAgICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICAgICAgICBtYXAoY2FsbGVkQ291bnQgPT4gKHtcbiAgICAgICAgICAgICAgICAgIC4uLmRyYWdFbmREYXRhLFxuICAgICAgICAgICAgICAgICAgZHJhZ0NhbmNlbGxlZDogY2FsbGVkQ291bnQgPiAwXG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGNhbmNlbERyYWckLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgIHJldHVybiBkcmFnRW5kRGF0YSQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIClcbiAgICAgICAgICAuc3Vic2NyaWJlKCh7IHgsIHksIGRyYWdDYW5jZWxsZWQgfSkgPT4ge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZHJhZ0VuZC5uZXh0KHsgeCwgeSwgZHJhZ0NhbmNlbGxlZCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgIHRoaXMuZHJhZ0FjdGl2ZUNsYXNzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY3VycmVudERyYWckLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgbWVyZ2UoZHJhZ0NvbXBsZXRlJCwgZHJhZ0VuZGVkJClcbiAgICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKGdsb2JhbERyYWdTdHlsZSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50ZXJNb3ZlO1xuICAgICAgfSksXG4gICAgICBzaGFyZSgpXG4gICAgKTtcblxuICAgIG1lcmdlKFxuICAgICAgcG9pbnRlckRyYWdnZWQkLnBpcGUoXG4gICAgICAgIHRha2UoMSksXG4gICAgICAgIG1hcCh2YWx1ZSA9PiBbLCB2YWx1ZV0pXG4gICAgICApLFxuICAgICAgcG9pbnRlckRyYWdnZWQkLnBpcGUocGFpcndpc2UoKSlcbiAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChbcHJldmlvdXMsIG5leHRdKSA9PiB7XG4gICAgICAgICAgaWYgKCFwcmV2aW91cykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwcmV2aW91cy54ICE9PSBuZXh0LnggfHwgcHJldmlvdXMueSAhPT0gbmV4dC55O1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKChbcHJldmlvdXMsIG5leHRdKSA9PiBuZXh0KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgKHsgeCwgeSwgY3VycmVudERyYWckLCBjbGllbnRYLCBjbGllbnRZLCB0cmFuc2Zvcm1YLCB0cmFuc2Zvcm1ZIH0pID0+IHtcbiAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dpbmcubmV4dCh7IHgsIHkgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHRoaXMuZ2hvc3RFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dHJhbnNmb3JtWH1weCwgJHt0cmFuc2Zvcm1ZfXB4KWA7XG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnRTdHlsZXModGhpcy5naG9zdEVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtLFxuICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICAgICctbXMtdHJhbnNmb3JtJzogdHJhbnNmb3JtLFxuICAgICAgICAgICAgICAnLW1vei10cmFuc2Zvcm0nOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICAgICctby10cmFuc2Zvcm0nOiB0cmFuc2Zvcm1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50RHJhZyQubmV4dCh7XG4gICAgICAgICAgICBjbGllbnRYLFxuICAgICAgICAgICAgY2xpZW50WSxcbiAgICAgICAgICAgIGRyb3BEYXRhOiB0aGlzLmRyb3BEYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuZHJhZ0F4aXMpIHtcbiAgICAgIHRoaXMuY2hlY2tFdmVudExpc3RlbmVycygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMudW5zdWJzY3JpYmVFdmVudExpc3RlbmVycygpO1xuICAgIHRoaXMucG9pbnRlckRvd24kLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5wb2ludGVyTW92ZSQuY29tcGxldGUoKTtcbiAgICB0aGlzLnBvaW50ZXJVcCQuY29tcGxldGUoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tFdmVudExpc3RlbmVycygpOiB2b2lkIHtcbiAgICBjb25zdCBjYW5EcmFnOiBib29sZWFuID0gdGhpcy5jYW5EcmFnKCk7XG4gICAgY29uc3QgaGFzRXZlbnRMaXN0ZW5lcnM6IGJvb2xlYW4gPVxuICAgICAgT2JqZWN0LmtleXModGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucykubGVuZ3RoID4gMDtcblxuICAgIGlmIChjYW5EcmFnICYmICFoYXNFdmVudExpc3RlbmVycykge1xuICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZWRvd24gPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAnbW91c2Vkb3duJyxcbiAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZURvd24oZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNldXAgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICdtb3VzZXVwJyxcbiAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZVVwKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaHN0YXJ0ID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ3RvdWNoc3RhcnQnLFxuICAgICAgICAgIChldmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblRvdWNoU3RhcnQoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNoZW5kID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAndG91Y2hlbmQnLFxuICAgICAgICAgIChldmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblRvdWNoRW5kKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaGNhbmNlbCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgJ3RvdWNoY2FuY2VsJyxcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaEVuZChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2VlbnRlciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICdtb3VzZWVudGVyJyxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VFbnRlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlbGVhdmUgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAnbW91c2VsZWF2ZScsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbk1vdXNlTGVhdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCFjYW5EcmFnICYmIGhhc0V2ZW50TGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlbW92ZSkge1xuICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmUgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgJ21vdXNlbW92ZScsXG4gICAgICAgIChtb3VzZU1vdmVFdmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMucG9pbnRlck1vdmUkLm5leHQoe1xuICAgICAgICAgICAgZXZlbnQ6IG1vdXNlTW92ZUV2ZW50LFxuICAgICAgICAgICAgY2xpZW50WDogbW91c2VNb3ZlRXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgIGNsaWVudFk6IG1vdXNlTW92ZUV2ZW50LmNsaWVudFlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5wb2ludGVyRG93biQubmV4dCh7XG4gICAgICBldmVudCxcbiAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlbW92ZSkge1xuICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmUoKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlbW92ZTtcbiAgICB9XG4gICAgdGhpcy5wb2ludGVyVXAkLm5leHQoe1xuICAgICAgZXZlbnQsXG4gICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQuY2xpZW50WVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gICAgbGV0IGhhc0NvbnRhaW5lclNjcm9sbGJhcjogYm9vbGVhbjtcbiAgICBsZXQgc3RhcnRTY3JvbGxQb3NpdGlvbjogYW55O1xuICAgIGxldCBpc0RyYWdBY3RpdmF0ZWQ6IGJvb2xlYW47XG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyICYmIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFjdGl2ZUxvbmdQcmVzc0RyYWcpIHtcbiAgICAgIHRoaXMudGltZUxvbmdQcmVzcy50aW1lckJlZ2luID0gRGF0ZS5ub3coKTtcbiAgICAgIGlzRHJhZ0FjdGl2YXRlZCA9IGZhbHNlO1xuICAgICAgaGFzQ29udGFpbmVyU2Nyb2xsYmFyID0gdGhpcy5zY3JvbGxDb250YWluZXIuaGFzU2Nyb2xsYmFyKCk7XG4gICAgICBzdGFydFNjcm9sbFBvc2l0aW9uID0gdGhpcy5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlKSB7XG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNobW92ZSA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAndG91Y2htb3ZlJyxcbiAgICAgICAgKHRvdWNoTW92ZUV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIgJiZcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFjdGl2ZUxvbmdQcmVzc0RyYWcgJiZcbiAgICAgICAgICAgICFpc0RyYWdBY3RpdmF0ZWQgJiZcbiAgICAgICAgICAgIGhhc0NvbnRhaW5lclNjcm9sbGJhclxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaXNEcmFnQWN0aXZhdGVkID0gdGhpcy5zaG91bGRCZWdpbkRyYWcoXG4gICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICB0b3VjaE1vdmVFdmVudCxcbiAgICAgICAgICAgICAgc3RhcnRTY3JvbGxQb3NpdGlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRoaXMuc2Nyb2xsQ29udGFpbmVyIHx8XG4gICAgICAgICAgICAhdGhpcy5zY3JvbGxDb250YWluZXIuYWN0aXZlTG9uZ1ByZXNzRHJhZyB8fFxuICAgICAgICAgICAgIWhhc0NvbnRhaW5lclNjcm9sbGJhciB8fFxuICAgICAgICAgICAgaXNEcmFnQWN0aXZhdGVkXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlJC5uZXh0KHtcbiAgICAgICAgICAgICAgZXZlbnQ6IHRvdWNoTW92ZUV2ZW50LFxuICAgICAgICAgICAgICBjbGllbnRYOiB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICAgICAgICAgIGNsaWVudFk6IHRvdWNoTW92ZUV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnBvaW50ZXJEb3duJC5uZXh0KHtcbiAgICAgIGV2ZW50LFxuICAgICAgY2xpZW50WDogZXZlbnQudG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQudG91Y2hlc1swXS5jbGllbnRZXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uVG91Y2hFbmQoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaG1vdmUpIHtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlKCk7XG4gICAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaG1vdmU7XG4gICAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIgJiYgdGhpcy5zY3JvbGxDb250YWluZXIuYWN0aXZlTG9uZ1ByZXNzRHJhZykge1xuICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5lbmFibGVTY3JvbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wb2ludGVyVXAkLm5leHQoe1xuICAgICAgZXZlbnQsXG4gICAgICBjbGllbnRYOiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk1vdXNlRW50ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRDdXJzb3IodGhpcy5kcmFnQ3Vyc29yKTtcbiAgfVxuXG4gIHByaXZhdGUgb25Nb3VzZUxlYXZlKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0Q3Vyc29yKCcnKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FuRHJhZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kcmFnQXhpcy54IHx8IHRoaXMuZHJhZ0F4aXMueTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0Q3Vyc29yKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAodGhpcyBhcyBhbnkpLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zW3R5cGVdKCk7XG4gICAgICBkZWxldGUgKHRoaXMgYXMgYW55KS5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9uc1t0eXBlXTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0RWxlbWVudFN0eWxlcyhcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBzdHlsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH1cbiAgKSB7XG4gICAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGVsZW1lbnQsIGtleSwgc3R5bGVzW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTY3JvbGxQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvcDogdGhpcy5zY3JvbGxDb250YWluZXIuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCxcbiAgICAgICAgbGVmdDogdGhpcy5zY3JvbGxDb250YWluZXIuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnRcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvcDogd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICAgIGxlZnQ6IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNob3VsZEJlZ2luRHJhZyhcbiAgICBldmVudDogVG91Y2hFdmVudCxcbiAgICB0b3VjaE1vdmVFdmVudDogVG91Y2hFdmVudCxcbiAgICBzdGFydFNjcm9sbFBvc2l0aW9uOiBhbnlcbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbW92ZVNjcm9sbFBvc2l0aW9uID0gdGhpcy5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIGNvbnN0IGRlbHRhU2Nyb2xsID0ge1xuICAgICAgdG9wOiBNYXRoLmFicyhtb3ZlU2Nyb2xsUG9zaXRpb24udG9wIC0gc3RhcnRTY3JvbGxQb3NpdGlvbi50b3ApLFxuICAgICAgbGVmdDogTWF0aC5hYnMobW92ZVNjcm9sbFBvc2l0aW9uLmxlZnQgLSBzdGFydFNjcm9sbFBvc2l0aW9uLmxlZnQpXG4gICAgfTtcbiAgICBjb25zdCBkZWx0YVggPVxuICAgICAgTWF0aC5hYnMoXG4gICAgICAgIHRvdWNoTW92ZUV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCAtIGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WFxuICAgICAgKSAtIGRlbHRhU2Nyb2xsLmxlZnQ7XG4gICAgY29uc3QgZGVsdGFZID1cbiAgICAgIE1hdGguYWJzKFxuICAgICAgICB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFkgLSBldmVudC50b3VjaGVzWzBdLmNsaWVudFlcbiAgICAgICkgLSBkZWx0YVNjcm9sbC50b3A7XG4gICAgY29uc3QgZGVsdGFUb3RhbCA9IGRlbHRhWCArIGRlbHRhWTtcbiAgICBpZiAoXG4gICAgICBkZWx0YVRvdGFsID4gdGhpcy5zY3JvbGxDb250YWluZXIubG9uZ1ByZXNzQ29uZmlnLmRlbHRhIHx8XG4gICAgICBkZWx0YVNjcm9sbC50b3AgPiAwIHx8XG4gICAgICBkZWx0YVNjcm9sbC5sZWZ0ID4gMFxuICAgICkge1xuICAgICAgdGhpcy50aW1lTG9uZ1ByZXNzLnRpbWVyQmVnaW4gPSBEYXRlLm5vdygpO1xuICAgIH1cbiAgICB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJFbmQgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IGR1cmF0aW9uID1cbiAgICAgIHRoaXMudGltZUxvbmdQcmVzcy50aW1lckVuZCAtIHRoaXMudGltZUxvbmdQcmVzcy50aW1lckJlZ2luO1xuICAgIGlmIChkdXJhdGlvbiA+PSB0aGlzLnNjcm9sbENvbnRhaW5lci5sb25nUHJlc3NDb25maWcuZHVyYXRpb24pIHtcbiAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmRpc2FibGVTY3JvbGwoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==