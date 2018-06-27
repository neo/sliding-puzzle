// To Do: function refresh, mouse enabled
// window.onload
var n = 3;
var a, b;
var vmin = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
// var bgc = document.querySelector("#canvas").style.backgroundColor;
var bgc = "#eee";
var fgc = "rgba(229, 57, 53, .8)";
a = 0.9 * vmin;
b = a / n;
c = a / 100;

var puzzle = ['','1','2','3','4','5','6','7','8','9'];
var origin;

var stage = new createjs.Stage('canvas');
stage.canvas.width = stage.canvas.height = a;

var queue = new createjs.LoadQueue();
queue.installPlugin(createjs.Sound);
queue.on("complete", load);
queue.loadManifest([{id:'theimg', src:'theimg.jpg'}, {id:'swoosh', src:'swoosh.mp3'}]);

function load() {

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
		mask.graphics.ss(2).s(fgc).rect(0, 0, b, b);
		container.setBounds(0, 0, b, b);
		container.x = b * x;
		container.y = b * y;
		theimg.scaleX = theimg.scaleY = scale;
		theimg.x = -b * x;
		theimg.y = -b * y;
		container.addChild(mask, theimg);
		theimg.mask = mask;
		puzzle[i+1] = container;
		stage.addChild(container);
		// container.addEventListener('click', click);
	}

	origin = puzzle.slice();

	// one global ticker!
	createjs.Ticker.framerate = 60;
	createjs.Ticker.on("tick", stage);

	// setTimeout(start, 1000);

	document.addEventListener('keyup', move);
	button.addEventListener('click', start);

	stage.addChildAt(blank,0);
	stage.update();

}

var blank = new createjs.Shape();
blank.graphics.beginFill(bgc).drawRect(0, 0, b, b);
puzzle[n*n] = blank;
// moveTo(blank, 2, 2);
blank.x = blank.y = (n - 1) * b;

var button = new createjs.Container();;
button.regX = 0.1 * a;
button.regY = 0.05 * a;
button.x = button.y = 0.5 * a;
var buttonBack = new createjs.Shape();
button.addChild(buttonBack);
buttonBack.graphics.beginFill(fgc).drawRoundRect(0, 0, 0.2 * a, 0.1 * a, c,c,c,c);
var buttonText = new createjs.Text("PLAY", "bold "+ (6 * c) +"px sans-serif", "#fff");
button.addChild(buttonText);
buttonText.y = 2.5 * c;
buttonText.x = 2.2 * c;

function compare() {
	var done = true;
	for (var i = origin.length - 1; i >= 0; i--) {
		if(origin[i] != puzzle[i]) {
			done = false;
		}
	};
	if(done) {
		stage.addChild(button);
	} else {
		stage.removeChild(button);
	}
	stage.update();
	return done;
}

function click(e) {
	var key = [];
	key.keyCode = 37;
	move(key, e.currentTarget);
}

function start() {
	var count = 0;
	var laste = 0;
	var e = [];
	var startInterval = setInterval(randMove, 100);
	function randMove() {
		e.keyCode = Math.floor(Math.random() * 4) + 37;
		if(Math.abs(e.keyCode - laste) != 2) {
			if( move(e) ) {
				count ++;
				laste = e.keyCode;
			} else {
				randMove();
			}
		} else {
			randMove();
		}
		if(count == n*n*n) {
			clearInterval(startInterval);
		}
	}
}

function move(e, obj) {
	var moved;
	var obj = obj || blank;
	var num = puzzle.indexOf(obj) - 1;
	var ternary = num.toString(n);
	var x = parseInt(ternary.substr(-1), 10);
	var y = ternary.length == 1 ? 0 : parseInt(ternary.substr(0,1), 10);
	var tx = x;
	var ty = y;
	switch(e.keyCode) {
		case 37: // left
			var z = x + 1;
			// x = z >= 0 && z < n ? z : x;
			x = movable(x, z);
			moveTo(obj, x, y);
			break;
		case 38: // up
			var z = y + 1;
			// y = z >= 0 && z < n ? z : y;
			y = movable(y, z);
			moveTo(obj, x, y);
			break;
		case 39: // right
			var z = x - 1;
			// x = z >= 0 && z < n ? z : x;
			x = movable(x, z);
			moveTo(obj, x, y);
			break;
		case 40: // down
			var z = y - 1;
			// y = z >= 0 && z < n ? z : y;
			y = movable(y, z);
			moveTo(obj, x, y);
			break;
		case 32:
			start();
			break;
	}
	z = y.toString() + x.toString();
	var target = parseInt(z, n) + 1;
	moveTo(puzzle[target], tx, ty);
	puzzle[0] = puzzle[num + 1]
	puzzle[num + 1] = puzzle[target];
	puzzle[target] = puzzle[0];
	puzzle[0] = "";
	// console.log(puzzle);
	stage.update();
	function movable(a, z) {
		if(z >= 0 && z < n) {
			a = z;
			moved = true;
		} else {
			a = a;
			moved = false;
		}
		return a;
	}
	// made this inside the function compare(), and then moved to moveTo()
	// if(compare()) {
	// 	stage.addChild(button);
	// } else {
	// 	stage.removeChild(button);
	// }
	if(moved) {
		createjs.Sound.play("swoosh");
	}
	return moved;
}

function moveTo0(obj, x, y) {
	obj.x = b * x;
	obj.y = b * y;
	stage.update();
}

function moveTo(obj, x, y) {
	objx = b * x;
	objy = b * y;
	// put the Ticker to the global scope
	// createjs.Ticker.framerate = 60;
	// createjs.Ticker.on("tick", stage);
	createjs.Tween.get(obj).to({x:objx, y:objy}, 300).call(compare);
}
