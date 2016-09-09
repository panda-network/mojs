import raf from './raf';
import perf from './performance';

let instance = null;

class Polyfill {
    constructor() {
        if (!instance) {
            instance = this;
        }

        return instance;
    }

    setup ($window) {
        raf($window);
        perf($window);

        this.window = $window;
    }
}

export default Polyfill
