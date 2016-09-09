import h from '../h';
import Polyfill from '../polyfills/polyfill';

class Tweener {
  constructor() { this._vars(); return this; }

  _vars () { this.tweens = []; this._loop = this._loop.bind(this); this._p = new Polyfill(); }
  /*
    Main animation loop. Should have only one concurrent loop.
    @private
    @returns this
  */
  _loop() {
    if (!this._isRunning) { return false; }
    this._update(this._p.window.performance.now());
    if (!this.tweens.length) { return this._isRunning = false; }
    this._p.window.requestAnimationFrame(this._loop);
    return this;
  }
  /*
    Method to start animation loop.
    @private
  */
  _startLoop() {
    if (this._isRunning) { return; }; this._isRunning = true
    this._p.window.requestAnimationFrame(this._loop);
  }
  /*
    Method to stop animation loop.
    @private
  */
  _stopLoop() { this._isRunning = false; }
  /*
    Method to update every tween/timeline on animation frame.
    @private
  */
  _update(time) {
    var i = this.tweens.length;
    while(i--) {
      // cache the current tween
      var tween = this.tweens[i];
      if ( tween && tween._update(time) === true ) {
        this.remove( tween );
        tween._onTweenerFinish();
        tween._prevTime = undefined;
      }
    }
  }
  /*
    Method to add a Tween/Timeline to loop pool.
    @param {Object} Tween/Timeline to add.
  */
  add(tween) {
    // return if tween is already running
    if ( tween._isRunning ) { return; }
    tween._isRunning = true;
    this.tweens.push(tween);
    this._startLoop();
  }
  /*
    Method stop updating all the child tweens/timelines.
    @private
  */
  removeAll() { this.tweens.length = 0; }
  /*
    Method to remove specific tween/timeline form updating.
    @private
  */
  remove(tween) {
    var index = (typeof tween === 'number')
      ? tween
      : this.tweens.indexOf(tween);

    if (index !== -1) {
      tween = this.tweens[index];
      if ( tween ) {
        tween._isRunning = false;
        this.tweens.splice(index, 1);
        tween._onTweenerRemove();
      }
    }
  }
}

var t = new Tweener
export default t;
