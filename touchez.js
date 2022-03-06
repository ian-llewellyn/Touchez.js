function Touchez(element_list) {
  this.elements = element_list;
  this.gestureList = [];
  this.callbacks = {
    "single": [],
    "double": [],
    "hold": []
  };

  // Time to hold down before hold() is fired
  this.holdTriggerTimeout = 1000;
  // Time after which further events are processed as separate gestures
  this.gestureEndTimeout = 300;

  this.holdTimerState = false;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
  this.touchStart = this.touchStart.bind(this);
  this.touchEnd = this.touchEnd.bind(this);
  this.addHoldGesture = this.addHoldGesture.bind(this);
  this.processGesture = this.processGesture.bind(this);
  this.single = this.single.bind(this);
  this.double = this.double.bind(this);
  this.hold = this.hold.bind(this);

  for (var i=0; i<this.elements.length; i++) {
    var elem = this.elements[i];
    elem.addEventListener("touchStart", this.touchStart, false);
    elem.addEventListener("touchEnd", this.touchEnd, false);
    elem.addEventListener("mousedown", this.touchStart, false);
    elem.addEventListener("mouseup", this.touchEnd, false);
  }

/*
Single:
v touchStart  v---v gracePeriod
|-------------|---|
              ^ touchEnd
               <-> gestureTimeout
Double:
v touchStart  v touchEnd
|-------------|--|-------------|---|
                 ^ touchStart  ^ touchEnd
                                <-> gestureTimeout
Long:
v touchStart   v touchEnd
|--------------|
 <------------> holdTriggerTimeout
*/
}

Touchez.prototype.touchStart = function(ev) {
  this.holdTriggerTimer = setTimeout(this.addHoldGesture, this.holdTriggerTimeout, ev);
  this.holdTimerState = true;
}

Touchez.prototype.touchEnd = function(ev) {
  if (this.holdTimerState == false) {
    return;
  }

  clearTimeout(this.holdTriggerTimer);
  this.holdTimerState = false;
  this.gestureList.push("single");
  if (JSON.stringify(this.gestureList) == JSON.stringify(["single", "single"])) this.gestureList = ["double"];
  this.gestureEndTimer = setTimeout(this.processGesture, this.gestureEndTimeout, ev.srcElement);
}

Touchez.prototype.addHoldGesture = function(ev) {
  this.holdTimerState = false;
  this.gestureList.push("hold");
  this.gestureEndTimer = setTimeout(this.processGesture, this.gestureEndTimeout, ev.srcElement);
}

Touchez.prototype.processGesture = function(element) {
  while (this.gestureList.length > 0) {
    this.callbacks[this.gestureList.pop()].forEach(function(callback) {
      callback(element);
    });
  }
}

Touchez.prototype.single = function(callback) {
  /*
  Set a callback for a single tap / single click event.

  To remove this callback, use Touchez.cancelSingle(callback).
  */
  this.callbacks["single"].push(callback);
}

Touchez.prototype.double = function(callback) {
  this.callbacks["double"].push(callback);
}

Touchez.prototype.hold = function(callback) {
  this.callbacks["hold"].push(callback);
}
