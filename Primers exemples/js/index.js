var bender = $('#bender'),
  booze = bender.find('#booze'),
  liquid = bender.find('#liquid'),
  liquidMask = bender.find('#clip_1_'),
  teeth = bender.find('#teeth'),
  teethHole = bender.find('#teethhole'),
  eyes = bender.find('#eye_1_, #eye'),
  lowerLid = bender.find('#eyelidbottom, #eyelidbottom_1_'),
  upperLid = bender.find('#eyelid, #eyelid_1_');

var tl = new TimelineLite(),
  canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  W = window.innerWidth,
  H = window.innerHeight;

canvas.width = W;
canvas.height = H;

$(window).on('resize', function() {
  setInterval(function() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  }, 500)
});

//Setup
tl
  .add('start')
  .set(teeth, {
    y: 35
  })
  .set(teethHole, {
    transformOrigin: 'top center',
    x: 8
  })
  .set(booze, {
    transformOrigin: '50% 95%'
  });

// Bring Bender In
tl
  .add('benderIn', 'start')
  .from(bender, 1, {
    y: '100%',
    rotation: -30,
    x: -100
  })
  .add('benderInDone');

// rotate the arm
tl
  .add('armRotate', 'benderInDone')
  .to(teeth, 0.2, {
    y: 0
  }, 'armRotate+=0.2')
  .to(eyes, 0.1, {
    y: -10
  }, 'armRotate+=0.2')
  .fromTo(lowerLid, 0.6, {
    y: 100
  }, {
    y: -5
  }, 'armRotate-=0.2')
  .from(booze, 0.3, {
    rotation: 180,
    x: -100
  }, 'armRotate')
  .add('armRotateDone');

//drink the booze
tl
  .add('drink', 'armRotateDone')
  .to(teeth, 0.25, {
    x: 3,
    y: 3,
    repeat: 6,
    yoyo: true
  })
  .to(liquid, 2.5, {
    y: 180
  }, 'drink')
  .to(liquidMask, 2.5, {
    y: -180
  }, 'drink')
  .add('drinkDone');

// rotate the arm down
tl
  .add('armRotateDown', 'drinkDone')
  .to(eyes, 0.4, {
    y: 0
  }, 'armRotateDown')
  .to(teeth, 0.2, {
    y: 35
  }, 'armRotateDown')
  .to(lowerLid, 0.6, {
    y: 100
  }, 'armRotateDown')
  .to(booze, 0.3, {
    rotation: 100,
    x: -30
  }, 'armRotateDown')
  .add('armRotateDownDone');

//Set on fire
tl
  .add('setOnFire', 'armRotateDownDone')
  .call(function() {
    setOnFire();
  })
  .from(teethHole, 0.2, {
    scaleY: 0
  })
  .to(upperLid, 0.1, {
    y: -30
  }, 'setOnFire');

// Fire
setOnFire = function() {

  var particles = [];

  var particle_count = 200;
  for (var i = 0; i < particle_count; i++) {
    particles.push(new particle());
  }

  function particle() {
    this.speed = {
      x: 5 + Math.random() * 25,
      y: -15 + Math.random() * 20
    };
    this.location = {
      x: W / 2,
      y: (H / 2 + 45)
    };
    // Size
    this.radius = 10 + Math.random() * 30;

    // Life
    this.life = 20 + Math.random() * 10;
    this.remaining_life = this.life;

    // colors
    this.r = Math.round((Math.random() * 255) + 100);
    this.g = Math.round(Math.random() * 100);
    this.b = Math.round(Math.random() * 50);
  }

  function draw() {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      p.opacity = Math.round(p.remaining_life / p.life * 100) / 100

      var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
      gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
      gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
      gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");

      ctx.fillStyle = gradient;
      ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
      ctx.fill();

      p.remaining_life--;
      p.radius--;
      p.location.x += p.speed.x;
      p.location.y += p.speed.y;

      if (p.remaining_life < 0 || p.radius < 0) {
        particles[i] = new particle();
      }
    }
  }

  var interval = window.setInterval(draw, 33);
}