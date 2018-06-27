// window.onload
var n = 3;
var a, b;
var vmin = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
a = 0.9 * vmin;
b = a / n;

var puzzle = ['0','1','2','3','4','5','6','7','8','9'];

var stage = new createjs.Stage('canvas');
stage.canvas.width = stage.canvas.height = a;

var queue = new createjs.LoadQueue();
queue.on("complete", load);
queue.loadFile({id:'theimg', src:'theimg.jpg'});

function load() {
	document.addEventListener('keyup', move);

	var theimg = new createjs.Bitmap(queue.getResult('theimg'));
	var imgmin = theimg.getBounds().width < theimg.getBounds().height ? theimg.getBounds().width : theimg.getBounds().height;
	var scale = a / imgmin;
	theimg.scaleX = theimg.scaleY = scale;

	var containers = [];
	var theimgs = [];
	var masks = [];

	for(var i = 0; i < n*n - 1; i++) {
		var theimg = new createjs.Bitmap(queue.getResult('theimg'));
		var container = new createjs.Container();
		var mask = new createjs.Shape();
		var x = i % n;
		var y = Math.floor(i / n);
		mask.graphics.ss(1).s('#000').rect(0, 0, b, b);
		container.setBounds(0, 0, b, b);
		container.x = b * x;
		container.y = b * y;
		theimg.scaleX = theimg.scaleY = scale;
		theimg.x = -b * x;
		theimg.y = -b * y;
		container.addChild(mask, theimg);
		theimg.mask = mask;
		stage.addChild(container);
	}

	stage.addChildAt(blank,0);
	stage.update();
}

var blank = new createjs.Shape();
blank.graphics.beginFill("#fff").drawRect(0, 0, b, b);
puzzle[n*n] = blank;
moveTo(blank, 2, 2);

function move(e) {
	var obj = blank;
	var num = puzzle.indexOf(obj) - 1;
	var ternary = num.toString(n);
	var x = parseInt(ternary.substr(-1), 10);
	var y = ternary.length == 1 ? 0 : parseInt(ternary.substr(0,1), 10);
	switch(e.keyCode) {
		case 37: // left
			var z = x + 1;
			x = z >= 0 && z < n ? z : x;
			moveTo(obj, x, y);
			break;
		case 38: // up
			var z = y + 1;
			y = z >= 0 && z < n ? z : y;
			moveTo(obj, x, y);
			break;
		case 39: // right
			var z = x - 1;
			x = z >= 0 && z < n ? z : x;
			moveTo(obj, x, y);
			break;
		case 40: // down
			var z = y - 1;
			y = z >= 0 && z < n ? z : y;
			moveTo(obj, x, y);
			break;
	}
	z = y.toString() + x.toString();
	var target = parseInt(z, n) + 1;
	puzzle[0] = puzzle[num + 1]
	puzzle[num + 1] = puzzle[target];
	puzzle[target] = puzzle[0];
	puzzle[0] = "";
	console.log(puzzle);
}

function moveTo(obj, x, y) {
	obj.x = b * x;
	obj.y = b * y;
	stage.update();
}
