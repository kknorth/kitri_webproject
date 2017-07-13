console.clear();
paper.install(window);  

window.onload = function() {
  paper.setup('myCanvas'); 
// Generated by CoffeeScript 1.6.2
var Char, Note, String, Strings, audios, gui, h, mouseDown, mouseDrag, mouseMove, onFrame, onMouseDown, onMouseDrag, onMouseMove, onMouseUp, _ref;

Path.prototype.setWidth = function(width) {
  this.segments[3].point.x = this.segments[0].point.x + width;
  return this.segments[2].point.x = this.segments[1].point.x + width;
};

Path.prototype.setHeight = function(height) {
  this.segments[1].point.y = this.segments[0].point.y + height;
  return this.segments[2].point.y = this.segments[3].point.y + height;
};

Path.prototype.reset = function() {
  this.setWidth(0);
  this.setHeight(0);
  return this.smooth();
};

h = {
  getRand: function(min, max) {
    return Math.floor((Math.random() * ((max + 1) - min)) + min);
  }
};

if ((_ref = window.Guitar) == null) {
  window.Guitar = {};
}

window.Guitar.$window = $(window);

window.Guitar.settings = {};

window.Guitar.settings.allowNotes = true;

window.Guitar.settings.releaseOnMove = true;

window.Guitar.settings.releaseOffsetCoefficient = 30;

view.setViewSize(1280, 900);

Note = (function() {
  function Note(o) {
    this.o = o;
    this.point = new Point(this.o.point);
    this.makeBase();
  }

  Note.prototype.makeBase = function() {
    this.chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    this.char = new PointText(this.point);
    this.char.justification = 'center';
    this.char.fillColor = this.o.color;
    this.char.font = 'ToneDeaf BB';
    this.char.fontSize = this.o.size;
    this.char.content = this.chars[h.getRand(0, this.chars.length - 1)];
    return this.char.opacity = 0;
  };

  Note.prototype.makeAnimation = function() {
    var from, it, to,
      _this = this;

    from = {
      x: this.o.point[0],
      y: this.o.point[1]
    };
    to = {
      x: this.o.point[0] + h.getRand(-40, 40),
      y: -this.o.point[1]
    };
    this.tw = new TWEEN.Tween(from).to(to, 2000);
    it = this;
    this.tw.onStart(function() {
      return _this.char.opacity = 1;
    });
    this.tw.onUpdate(function() {
      it.char.position.x = this.x;
      return it.char.position.y = this.y;
    });
    return this.tw.onComplete(function() {
      return _this.teardown();
    });
  };

  Note.prototype.animate = function() {
    return this.tw.start();
  };

  Note.prototype.teardown = function() {
    delete this.tw;
    this.char.position.x = this.o.point[0];
    this.char.position.y = this.o.point[1];
    this.makeAnimation();
    return this.char.opacity = 0;
  };

  return Note;

})();

mouseDown = null;

mouseMove = null;

mouseDrag = null;

var audios = [];

String = (function() {
  function String(o) {
    this.o = o;
    this.touched = false;
    this.anima = false;
    this.colors = ["#69D2E7", "#A7DBD8", "#E0E4CC", "#F38630", "#FA6900", "#C02942", "#542437", "#53777A", "#ECD078", "#FE4365"];
    this.defaultColor = this.o.color || "#fff";
    this.color = this.colors[this.o.i % this.colors.length];
    this.o.context && this.makeAudio();
    this.makeBase();
    this.note = new Note({
      color: this.color,
      point: [this.middleX_point, this.middleY_point],
      size: 34
    });
  }

  String.prototype.makeAudio = function() {
    this.analyser = this.o.context.createAnalyser();
    this.audio = new Audio;
    this.audio.controls = true;
    if (!audios[this.o.i % this.o.guitar.sources.length]) {
      this.audio.src = "https://s.cdpn.io/6859/" + this.o.guitar.sources[this.o.i % this.o.guitar.sources.length] + ".mp3";
      audios.push(this.audio);
      this.source = this.o.context.createMediaElementSource(this.audio);
      this.source.connect(this.analyser);
      return this.analyser.connect(this.o.context.destination);
    } else {
      return this.audio = audios[this.o.i % this.o.guitar.sources.length];
    }
  };

  String.prototype.makeBase = function() {
    this.base = new Path;
    this.xOffset = this.o.offset;
    this.base.add([this.o.offsetX_start, this.o.offsetY_start]);
    this.base.add([this.o.offsetX_end, this.o.offsetY_end]);
    this.startX = Math.min(this.o.offsetX_start, this.o.offsetX_end);
    this.startY = Math.min(this.o.offsetY_start, this.o.offsetY_end);
    this.endX = Math.max(this.o.offsetX_start, this.o.offsetX_end);
    this.endY = Math.max(this.o.offsetY_start, this.o.offsetY_end);
    this.middleX = this.endX !== this.startX ? parseInt((this.endX - this.startX) / 2) : this.endX;
    this.middleX_point = this.endX !== this.startX ? this.endX - this.middleX : this.endX;
    this.middleY = this.endY !== this.startY ? parseInt((this.endY - this.startY) / 2) : this.endY;
    this.middleY_point = this.endY !== this.startY ? this.endY - this.middleY : this.endY;
    this.base.strokeColor = this.defaultColor;
    this.base.strokeWidth = this.o.width;
    return this.height = this.o.offsetY_end - this.o.offsetY_start;
  };

  String.prototype.change = function(e) {
    var point, x, x_minus, x_plus, y;

    point = e.point;
    this.a = null;
    if (e.delta.x > 0) {
      if ((e.point.x + e.delta.x >= this.startX) && (mouseDown.x < this.startX)) {
        if ((e.point.y + e.delta.y >= this.startY) && (e.point.y + e.delta.y <= this.endY)) {
          this.touched = true;
        }
      }
    }
    if (e.delta.x < 0) {
      if ((e.point.x - e.delta.x <= this.endX) && (mouseDown.x > this.endX)) {
        if ((e.point.y + e.delta.y > this.startY) && (e.point.y + e.delta.y < this.endY)) {
          this.touched = true;
        }
      }
    }
    if (e.delta.y < 0) {
      if ((e.point.y + e.delta.y <= this.endY) && (this.startY < mouseDown.y)) {
        if ((e.point.x + e.delta.x > this.startX) && (e.point.x + e.delta.x < this.endX)) {
          this.touched = true;
        }
      }
    }
    if (e.delta.y > 0) {
      if ((e.point.y + e.delta.y >= this.startY) && (this.o.offsetY_end > mouseDown.y)) {
        if ((e.point.x + e.delta.x > this.startX) && (e.point.x + e.delta.x < this.endX)) {
          this.touched = true;
        }
      }
    }
    if (!this.touched) {
      return;
    }
    if (window.Guitar.settings.releaseOnMove) {
      this.o.stringsOffset = this.o.width * window.Guitar.settings.releaseOffsetCoefficient;
      x_plus = (point.x > this.middleX_point + this.o.stringsOffset) && (e.delta.x > 0);
      x_minus = (point.x < this.middleX_point - this.o.stringsOffset) && (e.delta.x < 0);
      if (x_plus || x_minus) {
        this.animate();
        return;
      }
    }
    x = this.o.offsetX_end < this.o.offsetX_start ? this.endX : this.startX;
    y = this.o.offsetY_end < this.o.offsetY_start ? this.endY : this.startY;
    this.base.segments[0].handleOut.y = point.y - y;
    return this.base.segments[0].handleOut.x = point.x - x;
  };

  String.prototype.animate = function() {
    this.touched = false;
    if (this.anima) {
      return;
    }
    this.anima = true;
    this.soundX = parseInt(Math.abs(this.base.segments[0].handleOut.x));
    this.soundY_proto = parseInt(Math.abs(this.base.segments[0].handleOut.y));
    this.soundY = this.soundY_proto / (this.height + (2 * this.o.width));
    this.meter = Math.max(this.soundX, this.soundY_proto);
    if (this.meter === 0) {
      return;
    }
    this.animateQuake();
    this.animateColor();
    return this.o.context && this.makeSound();
  };

  String.prototype.animateColor = function() {
    var from, it, to, _ref1;

    if ((_ref1 = this.twColor) != null) {
      _ref1.stop();
    }
    this.base.strokeColor = this.color;
    this.base.strokeColor.saturation = 4;
    from = {
      t: 0
    };
    to = {
      t: 1
    };
    this.twColor = new TWEEN.Tween(from).to(to, this.meter * 15);
    this.twColor.easing(function(t) {
      var b;

      b = Math.exp(-t * 10) * Math.cos(Math.PI * 2 * t * 10);
      if (t >= 1) {
        return 1;
      }
      return 1 - b;
    });
    it = this;
    this.twColor.onUpdate(function() {
      return it.base.strokeColor.brightness = this.t;
    });
    return this.twColor.start();
  };

  String.prototype.animateQuake = function() {
    var from, it, to, _ref1,
      _this = this;

    if ((_ref1 = this.tw) != null) {
      _ref1.stop();
    }
    this.anima = true;
    from = {
      x: this.base.segments[0].handleOut.x,
      y: this.base.segments[0].handleOut.y,
      c: 1000 * this.index
    };
    to = {
      x: 0,
      y: 0,
      c: 0
    };
    this.tw = new TWEEN.Tween(from).to(to, 1000);
    this.tw.easing(function(t) {
      var b;

      b = Math.exp(-t * 10) * Math.cos(Math.PI * 2 * t * 10);
      if (t >= 1) {
        return 1;
      }
      return 1 - b;
    });
    it = this;
    this.tw.onStart(function() {
      if (_this.startY !== _this.endY) {
        return it.base.segments[0].handleOut.y = 0;
      }
    });
    this.tw.onUpdate(function() {
      it.base.segments[0].handleOut.x = this.x;
      if (this.startY === this.endY) {
        return it.base.segments[0].handleOut.y = this.y;
      }
    });
    this.tw.onComplete(function() {
      return _this.teardown();
    });
    return this.tw.start();
  };

  String.prototype.makeSound = function() {
    var from, it, to, _ref1,
      _this = this;

    if ((_ref1 = this.twSound) != null) {
      _ref1.stop();
    }
    window.Guitar.settings.allowNotes && this.note.animate();
    from = {
      c: 2 * (this.index * 25) + this.soundX / 4,
      t: 1
    };
    to = {
      c: (this.index * 25) + this.soundX / 4,
      t: 0
    };
    this.twSound = new TWEEN.Tween(from).to(to, this.meter * 6);
    this.twSound.easing(function(t) {
      var b;

      b = Math.exp(-t * 10) * Math.cos(Math.PI * 2 * t * 10);
      if (t >= 1) {
        return 1;
      }
      return 1 - b;
    });
    it = this;
    this.twSound.onStart(function() {
      _this.audio.play();
      return _this.played = true;
    });
    this.twSound.onComplete(function() {
      if (_this.played) {
        _this.stopAudio();
      }
      return _this.teardown();
    });
    return this.twSound.start();
  };

  String.prototype.stopAudio = function() {
    var _ref1, _ref2;

    if (this.played) {
      if ((_ref1 = this.audio) != null) {
        _ref1.pause();
      }
      return (_ref2 = this.audio) != null ? _ref2.currentTime = 0 : void 0;
    }
  };

  String.prototype.teardown = function() {
    this.stopAudio();
    this.base.segments[0].handleOut.x = 0;
    this.base.segments[0].handleOut.y = 0;
    this.anima = false;
    this.touched = false;
    this.note.teardown();
    return this.base.strokeColor = this.defaultColor;
  };

  return String;

})();

Char = (function() {
  function Char(o) {
    var i, item, string, _i, _len, _ref1;

    this.o = o;
    this.width = this.o.width || 3;
    _ref1 = window.Guitar.text[this.o.symbol];
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      item = _ref1[i];
      string = new String({
        offsetX_start: item.offsetX_start + this.o.xOffset,
        offsetX_end: item.offsetX_end + this.o.xOffset,
        offsetY_start: item.offsetY_start + this.o.yOffset,
        offsetY_end: item.offsetY_end + this.o.yOffset,
        width: this.width,
        context: this.o.context,
        guitar: this.o.guitar,
        color: '#fff',
        i: i
      });
      string.index = i;
      this.o.guitar.strings.push(string);
    }
  }

  return Char;

})();

Strings = (function() {
  function Strings(o) {
    var contextClass;

    this.initialOffset = 300;
    this.strings = [];
    this.stringWidth = 5;
    contextClass = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext;
    if (contextClass) {
      this.context = new contextClass();
    } else {
      alert('Use modern browser to play sounds via Web Audio Api, please');
      this.context = null;
    }
    this.sources = ['a3', 'b2', 'd3', 'e2', 'g2', 'a2', 'c', 'd2', 'f', 'g1', 'a1', 'b1', 'd1', 'e1'];
    this.makeStrings();
    this.makebase();
    this.makeM();
  }

  Strings.prototype.makebase = function() {
    this.base = new Path.Circle([-100, -100], this.stringWidth * 2);
    this.base.fillColor = '#FFF';
    this.base.opacity = .25;
    this.guitar = new Raster('guitar');
    this.guitar.position.y += 450;
    return this.guitar.position.x += 450;
  };

  Strings.prototype.mouseMove = function(e) {
    return this.base.position = e.point;
  };

  Strings.prototype.makeStrings = function(cnt) {
    var i, o, offsetX, string, stringOffset, _i, _results;

    if (cnt == null) {
      cnt = 15;
    }
    _results = [];
    for (i = _i = 0; 0 <= cnt ? _i < cnt : _i > cnt; i = 0 <= cnt ? ++_i : --_i) {
      o = this.getOffset(i);
      stringOffset = this.stringWidth * 5;
      offsetX = this.initialOffset + (i * stringOffset);
      if (i === 13) {
        offsetX = this.initialOffset + (5 * stringOffset);
      }
      if (i === 14) {
        offsetX = this.initialOffset + (7 * stringOffset);
      }
      string = new String({
        offsetX_start: offsetX,
        offsetX_end: offsetX,
        offsetY_start: o.offsetY,
        offsetY_end: o.offsetY + o.length,
        width: this.stringWidth,
        context: this.context,
        guitar: this,
        i: i
      });
      string.index = i;
      _results.push(this.strings.push(string));
    }
    return _results;
  };

  Strings.prototype.makeM = function() {
    this.y = 150;
    this.y2 = 330;
    this.x = 650;
    this.x2 = 200;
    new Char({
      context: this.context,
      guitar: this,
      symbol: 'M',
      xOffset: this.x + 28,
      yOffset: this.y
    });
    new Char({
      context: this.context,
      guitar: this,
      symbol: 'U',
      xOffset: this.x + 170,
      yOffset: this.y
    });
    new Char({
      context: this.context,
      guitar: this,
      symbol: 'S',
      xOffset: this.x + 262,
      yOffset: this.y
    });
    new Char({
      context: this.context,
      guitar: this,
      symbol: 'I',
      xOffset: this.x + 352,
      yOffset: this.y
    });
    new Char({
      context: this.context,
      guitar: this,
      symbol: 'C',
      xOffset: this.x + 394,
      yOffset: this.y
    });
    new Char({
      context: this.context,
      guitar: this,
      symbol: 'T',
      xOffset: this.x2 + 518,
      yOffset: this.y2
    });
    new Char({
      context: this.context,
      guitar: this,
      symbol: 'I',
      xOffset: this.x2 + 620,
      yOffset: this.y2
    });
    new Char({
      context: this.context,
      guitar: this,
      symbol: 'M',
      xOffset: this.x2 + 668,
      yOffset: this.y2
    });
    return new Char({
      context: this.context,
      guitar: this,
      symbol: 'E',
      xOffset: this.x2 + 808,
      yOffset: this.y2
    });
  };

  Strings.prototype.getOffset = function(i) {
    var size;

    size = {};
    switch (i) {
      case 0:
        size.length = 130;
        size.offsetY = 705;
        break;
      case 1:
        size.length = 205;
        size.offsetY = 650;
        break;
      case 2:
        size.length = 375;
        size.offsetY = 490;
        break;
      case 3:
        size.length = 395;
        size.offsetY = 480;
        break;
      case 4:
        size.length = 405;
        size.offsetY = 475;
        break;
      case 5:
        size.length = 405;
        size.offsetY = 475;
        break;
      case 6:
        size.length = 860;
        size.offsetY = 20;
        break;
      case 7:
        size.length = 405;
        size.offsetY = 475;
        break;
      case 8:
        size.length = 405;
        size.offsetY = 475;
        break;
      case 9:
        size.length = 395;
        size.offsetY = 480;
        break;
      case 10:
        size.length = 375;
        size.offsetY = 490;
        break;
      case 11:
        size.length = 205;
        size.offsetY = 650;
        break;
      case 12:
        size.length = 130;
        size.offsetY = 705;
        break;
      case 13:
      case 14:
        size.length = 120;
        size.offsetY = 25;
    }
    return size;
  };

  Strings.prototype.makeQuake = function() {
    var i, string, _i, _len, _ref1, _results;

    _ref1 = this.strings;
    _results = [];
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      string = _ref1[i];
      _results.push(string.animate());
    }
    return _results;
  };

  Strings.prototype.changeStrings = function(point) {
    var i, string, _i, _len, _ref1, _results;

    _ref1 = this.strings;
    _results = [];
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      string = _ref1[i];
      _results.push(string.change(point));
    }
    return _results;
  };

  Strings.prototype.teardown = function() {
    var i, string, _i, _len, _ref1, _results;

    TWEEN.removeAll();
    _ref1 = this.strings;
    _results = [];
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      string = _ref1[i];
      _results.push(string.teardown());
    }
    return _results;
  };

  return Strings;

})();

window.Guitar.strings = new Strings;

view.onFrame = function(e) {
  return TWEEN.update();
};

var tool = new Tool()

tool.onMouseDrag = function(e) {
  window.Guitar.strings.changeStrings(e);
  return window.Guitar.strings.mouseMove(e);
};

tool.onMouseDown = function(e) {
  window.Guitar.strings.teardown();
  return mouseDown = e.point;
};

tool.onMouseUp = function(e) {
  return window.Guitar.strings.makeQuake();
};

tool.onMouseMove = function(e) {
  mouseMove = e.point;
  return window.Guitar.strings.mouseMove(e);
};

gui = new dat.GUI({
  autoPlace: false
});

gui.add(window.Guitar.settings, 'allowNotes');

gui.add(window.Guitar.settings, 'releaseOnMove');

gui.add(window.Guitar.settings, 'releaseOffsetCoefficient', 0, 50);

$('.my-gui-container').append(gui.domElement);

gui.close();

  setTimeout(function(){
      $('.js-banner').hide()
       $('.js-banner-suggest').show()
  }, 1)
  
    setTimeout(function(){
      $('.js-banner-suggest').fadeOut()
  }, 8000)
}