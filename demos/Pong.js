CLASS({
  name: 'Ball',
  extendsModel: 'foam.graphics.Circle',
  traits: ['foam.physics.Physical', 'foam.graphics.MotionBlur'],
  properties: [
    {
      name: 'vx',
      preSet: function(_, v) { return Math.sign(v) * Math.max(5, Math.abs(v)); }
    }
  ]
});


CLASS({
  name: 'Paddle',
  extendsModel: 'foam.graphics.Circle',
  traits: ['foam.physics.Physical', 'foam.graphics.Shadow'],
  properties: [
    { name: 'color', defaultValue: 'white' },
    { name: 'r',     defaultValue: 30 },
    { name: 'mass',  defaultValue: foam.physics.Physical.INFINITE_MASS }
  ]
});


CLASS({
  name: 'Pong',
  extendsModel: 'View',

  requires: [
    'Ball',
    'Paddle',
    'foam.graphics.CView',
    'foam.graphics.Rectangle',
    'foam.physics.Collider'
  ],

  constants: {
    PADDLE_SPEED: 10
  },

  properties: [
    {
      name: 'WIDTH',
      defaultValue: 800
    },
    {
      name: 'HEIGHT',
      defaultValue: 300
    },
    {
      name: 'ball',
      view: 'DetailView',
      factory: function() { return Ball.create({color: 'white', r: 20}); }
    },
    {
      name: 'lPaddle',
      view: 'DetailView',
      factory: function() { return Paddle.create(); }
    },
    {
      name: 'rPaddle',
      view: 'DetailView',
      factory: function() { return Paddle.create(); }
    },
    {
      name: 'table',
      factory: function() {
        return this.CView.create({background: 'lightgray', width: this.WIDTH, height: this.HEIGHT}).addChildren(
          this.Rectangle.create({x: this.WIDTH/2-5, width:10, height: this.HEIGHT, border:'rgba(0,0,0,0)' , background: 'white'}),
          this.ball,
          this.lPaddle,
          this.rPaddle);
      }
    },
    {
      model_: 'IntProperty',
      name: 'lScore'
    },
    {
      model_: 'IntProperty',
      name: 'rScore'
    }
  ],

  listeners: [
    {
      name: 'onBallMove',
      isFramed: true,
      code: function() {
        var ball = this.ball;

        if ( ball.velocity >  20 ) ball.velocity =  20;
        if ( ball.velocity < -20 ) ball.velocity = -20;

        // Bounce off of top wall
        if ( ball.y - ball.r <= 0 ) {
          ball.vy = Math.abs(ball.vy);
        }
        // Bounce off of bottom wall
        if ( ball.y + ball.r >= this.HEIGHT ) {
          ball.vy = -Math.abs(ball.vy);
        }
        // Bounce off of left wall
        if ( ball.x <= 0 ) {
          this.rScore++;
          ball.x = 150;
          ball.vx *= -1;
        }
        // Bounce off of right wall
        if ( ball.x >= this.WIDTH ) {
          this.lScore++;
          ball.x = this.WIDTH - 150;
          ball.vx *= -1;
        }
        // Reset scores
        if ( this.lScore == 100 || this.rScore == 100 ) {
          this.lScore = this.rScore = 0;
        }
      }
    }
  ],

  actions: [
    {
      name: 'lUp',
      keyboardShortcuts: [ 81 /* q */ ],
      action: function() { this.lPaddle.y -= this.PADDLE_SPEED; }
    },
    {
      name: 'lDown',
      keyboardShortcuts: [ 65 /* a */ ],
      action: function() { this.lPaddle.y += this.PADDLE_SPEED; }
    },
    {
      name: 'rUp',
      keyboardShortcuts: [ 38 /* up arrow */ ],
      action: function() { this.rPaddle.y -= this.PADDLE_SPEED; }
    },
    {
      name: 'rDown',
      keyboardShortcuts: [ 40 /* down arrow */ ],
      action: function() { this.rPaddle.y += this.PADDLE_SPEED; }
    }
  ],

  templates: [
    function CSS() {/*
      span[name="lScore"] {
        color: white;
        position: absolute;
        top: 20;
        left: 300;
        font-family: sans-serif;
        font-size: 70px;
      }
      span[name="rScore"] {
        color: white;
        position: absolute;
        top: 20;
        left: 450;
        font-family: sans-serif;
        font-size: 70px;
      }
    */},
    function toHTML() {/*
      <div id="%%id">$$lScore{mode: 'read-only'} $$rScore{mode: 'read-only'} <br> %%table</div>
    */}
  ],

  methods: {
    init: function() {
      this.SUPER();

      // Position Paddles
      this.lPaddle.x = 25+this.lPaddle.r;
      this.rPaddle.x = this.WIDTH-25-this.rPaddle.r;
      this.lPaddle.y = this.rPaddle.y = (this.HEIGHT-this.rPaddle.height)/2;

      // Setup Ball
      this.ball.x  = this.ball.y = 100;
      this.ball.y  = this.rPaddle.y;
      this.ball.vx = this.ball.vy = 10;

      this.ball.x$.addListener(this.onBallMove);

      // Setup Physics
      this.Collider.create().add(this.ball, this.lPaddle, this.rPaddle).start();
      Movement.inertia(this.ball);
    }
  }
});
