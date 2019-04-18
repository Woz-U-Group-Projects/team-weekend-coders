export declare class CalendarDragHelper {
    private dragContainerElement;
    private readonly startPosition;
    constructor(dragContainerElement: HTMLElement, draggableElement: HTMLElement);
    validateDrag({ x, y, snapDraggedEvents, dragAlreadyMoved }: {
        x: number;
        y: number;
        snapDraggedEvents: boolean;
        dragAlreadyMoved: boolean;
    }): boolean;
}
