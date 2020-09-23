
export class ElementObserver<E extends HTMLElement = HTMLElement> {
    private funcs: Function[] = [];
    constructor(element: E) {
        new MutationObserver((list, obs) => {
            this.funcs.forEach(f => f(list, obs));
        }).observe(element, {
            childList: true,
            subtree: true,
        })
    }

    subscribe(func: (mutations: MutationRecord, observer: MutationObserver) => any) {
        this.funcs.push(func);
    }
}
