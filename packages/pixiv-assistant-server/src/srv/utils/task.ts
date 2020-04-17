type PromiseFragment<T, RT> = ((value: T) => RT | PromiseLike<RT>) | undefined | null;

interface Queueable<T> {
    queue: <V> (label: string, func: PromiseFragment<T, V>) => Queueable<V>
    complete: () => void
}

class Task<T> implements Queueable<T> {
    private currentLabel: string;
    public get label() {
        return this.currentLabel || this.defaultLabel;
    }
    public set label(newLabel:string) {
        this.currentLabel = newLabel;
        this.onChange();
    }
    public active = true;
    constructor(
        private defaultLabel: string,
        private state:Promise<T>,
        private onChange:Function,
    ) {

    }

    public complete() {
        this.active = false;
        this.onChange();
    }

    public queue<RT>(label: string, func:PromiseFragment<T,RT>): Queueable<RT> {
        const queueableFactory = <A>(state:Promise<A>): Queueable<A> => {
            return {
                queue: <B>(label: string, func: PromiseFragment<A,B>): Queueable<B> => {
                    const newState = state.then(x => {
                        this.label = label;
                        return x;
                    })
                    .then(func)
                    .then(x => {
                        this.label = '';
                        return x;
                    });
                    return queueableFactory(newState);
                },
                complete: () => state.then(() => this.complete()),
            }
        };

        return queueableFactory(this.state).queue(label, func);
    }
}

type SubscribeFunc = (activeTasks: string[]) => any;

export class Tasker {
    private tasks:Task<any>[] = [];
    private subscribers: SubscribeFunc[] = [];

    public subscribe(subscriber: SubscribeFunc) {
        this.subscribers.push(subscriber);
    }
    private tick() {
        this.tasks = this.tasks.filter(task => task.active);
        const activeTasks = this.tasks.map(task => task.label);

        this.subscribers.forEach(sub => sub(activeTasks));
    }
    public spawn(defaultLabel: string) {
        const newTask = new Task(defaultLabel, Promise.resolve({}), () => this.tick());
        this.tasks.push(newTask);
        return newTask;
    }
}

const defaultTasker = new Tasker();

export default defaultTasker;
