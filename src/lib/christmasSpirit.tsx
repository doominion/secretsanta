export default function ChristmasSpirit() {
    var COUNT = 300;
    var masthead = document.querySelector('body');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = masthead!.clientWidth;
    var height = masthead!.clientHeight;
    var i = 0;
    var active = false;

    function onResize() {
        width = masthead!.clientWidth;
        height = masthead!.clientHeight;
        canvas.width = width;
        canvas.height = height;
        ctx!.fillStyle = '#FFF';

        var wasActive = active;
        active = width > 600;

        if (!wasActive && active)
            requestAnimFrame(update);
    }

    canvas.style.position = 'absolute';
    canvas.style.left = canvas.style.top = '0';

    var snowflakes: Snowflake[] = [], snowflake;
    for (i = 0; i < COUNT; i++) {
        snowflake = new Snowflake(width, height);
        snowflake.reset();
        snowflakes.push(snowflake);
    }

    function update() {

        ctx!.clearRect(0, 0, width, height);

        if (!active)
            return;

        for (i = 0; i < COUNT; i++) {
            snowflake = snowflakes[i];
            snowflake.y += snowflake.vy;
            snowflake.x += snowflake.vx;

            ctx!.globalAlpha = snowflake.o;
            ctx!.beginPath();
            ctx!.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
            ctx!.closePath();
            ctx!.fill();

            if (snowflake.y > height) {
                snowflake.reset();
            }
        }

        requestAnimFrame(update);
    }

    // shim layer with setTimeout fallback
    const requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    onResize();
    window.addEventListener('resize', onResize, false);

    masthead!.appendChild(canvas);
}

class Snowflake {
    x: number = 0;
    y: number = 0;
    vy: number = 0;
    vx: number = 0;
    r: number = 0;
    o: number = 0;
    width: number = 0;
    height: number = 0;

    constructor(pageWidth: number, pageHeight: number) {
        this.reset();
        this.width = pageWidth;
        this.height = pageHeight;
    }

    reset() {
        this.x = Math.random() * this.width;
        this.y = Math.random() * -this.height;
        this.vy = 1 + Math.random() * 3;
        this.vx = 0.5 - Math.random();
        this.r = 1 + Math.random() * 2;
        this.o = 0.5 + Math.random() * 0.5;
    }
}