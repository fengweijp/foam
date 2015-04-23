/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  package: 'foam.demos',
  name: 'DAOStrategies',
  extendsModel: 'foam.graphics.CView',

  requires: [
    'foam.graphics.LabelledBox',
    'foam.graphics.ImageCView',
    'foam.input.Mouse',
    'foam.graphics.CView',
    'foam.graphics.Label2'
  ],

  constants: {
    COLOURS: {
      'Google Cloud': 320,
      'Local Storage': 320,
      'Array': 320,
      'MongoDB': 320,
      'Chrome Storage': 320,
      'Sync Storage': 320,
      'JSONFile': 320,
      'IndexedDB': 320,
      'REST Server': 14,
      'REST Client': 14,
      Migration: 225,
      Logging: 225,
      Timing: 225,
      SeqNo: 225,
      GUID: 225,
      Validating: 225,
      Caching: 120,
      Sync: 120,
//      'Business Logic': 225
    },

    STRATEGIES: [
      [ 'Local Storage' ],
      [ 'IndexedDB' ],
      [ 'IndexedDB', 'Caching' ],
      [ 'IndexedDB', 'Caching', 'SeqNo' ],
      [ 'IndexedDB', 'Caching', 'GUID'  ],
      [ 'Chrome Storage' ],
      [ 'Chrome Storage' ],
      [ 'Array' ],
      [ 'Server', '', 'Adapter' ],
      [ 'MongoDB', 'REST Server', '', 'REST Client' ],
      [ 'JSONFile', 'REST Server', '', 'REST Client' ],
      [ 'Google', '', 'Google Cloud' ],
      [ 'Server', '', 'Client', 'Caching' ],
      [ 'Server', '', 'Client', 'Sync' ],
      [ '???', 'Logging' ],
      [ '???', 'Timing' ],
      [ '???', 'Validating' ],
      [ '???', 'Migration' ],
      [ '???', 'Business Logic' ],
      [ '???', '???' ],
      [ '???' ]
    ]
  },

  properties: [
    { name: 'width',  defaultValue: 4000 },
    { name: 'height', defaultValue: 2000 },
    {
      name: 'mouse',
      transient: true,
      hidden: true,
      lazyFactory: function() { return this.Mouse.create(); }
    }
  ],

  methods: {
    initCView: function() {
      this.SUPER();

      var M = Movement;
      var S = this.STRATEGIES;
      var H = 60;
      var self = this;

      for ( var i = 0 ; i < S.length ; i++ ) {
        var v = this.makeStrategyView(S[i]);
        v.x_ = v.x = 1300;
        v.y_ = v.y = 50 + H * i;
        this.addChild(v);
      }
      this.mouse.connect(this.view.$);
      this.mouse.y$.addListener(function(_, y) {
        self.view.paint();
      });
    },

    warp: function(o, y) {
      if ( o < 10 ) return y;
      var d  = y-o;
      var ad = Math.abs(d);
      d *= 3 - 2 * Math.min(1, Math.pow(Math.max(0, (ad-50))/this.height,0.5));
      return o+d;

      var MAG = 2;
      var R   = 400 * (1+MAG);
      var r   = Math.abs(y-o);
      r = r/R;
      if ( r < 1 ) r += MAG*3*r*Math.pow(1-r, 4);
      r = r*R;
      return o + ( y > o ? r : -r);
    },

    paintChildren: function() { /* Paints each child. */
      for ( var i = 0 ; i < this.children.length ; i++ ) {
        var child = this.children[i];
        this.canvas.save();
        this.canvas.beginPath(); // reset any existing path (canvas.restore() does not affect path)
        var d = Math.abs(this.mouse.y - child.y);
        var s = -(this.warp(this.mouse.y, child.y) - this.warp(this.mouse.y, child.y+child.height))/ ( child.height );
        this.canvas.translate(child.x,child.y+child.height/2);
        this.canvas.scale(s, s);
        this.canvas.translate(-child.x,-child.y-child.height/2);
        this.canvas.translate(0,this.warp(this.mouse.y, child.y)-child.y);
        child.paint();
        this.canvas.restore();
      }
    },

    makeStrategyView: function(s) {
      var v = this.CView.create({width: 500, height: 550});

      v.addChild(this.ImageCView.create({
        x: 20,
        y: -7,
        scaleX: 0.35,
        scaleY: 0.35,
        src: './js/foam/demos/empire/todo.png'
      }));

      for ( var i = 0 ; i < s.length ; i++ ) {
        var t = s[i];
        var c = this.COLOURS[t];
        v.addChild(this.LabelledBox.create({
          font: '18px Arial',
          background: c ? 'hsl(' + c + ',70%,90%)' : 'white',
          x: -140 * (s.length - i),
          y: ! t ? 25 : 0,
          width:  140,
          height: ! t ? 1 : 50,
          text:   t
        }));
      }

      return v;
    }
  }
});