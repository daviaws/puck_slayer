//returns a number between min and max interval - can be negative numbers
//if min is not passed, it will be 0
function random_number(max, min) {
	if (min == undefined)
		min = 0;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//check if x is between min and max
function between(x, min, max) {
	return x >= min && x <= max;
}

//origin and limit are Coordinate instances
function Arena(origin, limit) {
	var area = new Area(origin, limit);
	//body is an instance of Area
	this.calculate_body_limit = function(body) {
		return area.calculate_body_limit(body)
	};
}

//lifeTime is the time limit to puck explode
//pass is an integer movement factor
//origin and limit are Coordinate instances
function Puck(game, id, pass, origin, limit) {
	var game = game;
	var id = id;
	var pass = pass;
	var area = new Area(origin, limit);
	var limitArea = undefined;
	var position = undefined;
	var puckMove = undefined;
	var puckDye = undefined;
	//arena is an Arena instance
	this.define_boundries = function(arena) {
		limitArea = arena.calculate_body_limit(area);
	};
	//coordinate is a Coordinate instance
	this.allocate_in = function(coordinate) {
		if (limitArea.have_coordinate(coordinate)) {
			position = coordinate
			console.log('Puck ' + id + ' was allocated to position' + '(' + position.x + ' ' + position.y + ')');
			return
		}
		console.log('Puck ' + id + ' tried be allocated to position' + '(' + new_position.x +
			' ' + new_position.y + ')');
	};
	//allocate within boundries
	this.allocate_random = function() {
		coordinate = limitArea.generate_random_coordinate();
		this.allocate_in(coordinate);
	};
	//arena is an Arena instance
	this.allocate_initial_position = function(arena, position) {
		this.define_boundries(arena);
		if (position != undefined){
			this.allocate_in(position);
		}else{
			this.allocate_random();
		}

		this.allocate_random();
	};
	var calculate_pass = function() {
		x = random_number(pass, -pass);
		y = random_number(pass, -pass);
		return new Coordinate(x, y);
	};
	this.move = function() {
		console.log('The arena origin width is from ' + '(' + limitArea.origin.x + ' to ' + limitArea.limit.x + ')' + ' and its height if from ' + limitArea.origin.y + ' to ' + limitArea.limit.y);
		new_pass = calculate_pass();
		new_position = position.sum(new_pass);
		this.allocate_in(new_position);
	};
	this.dye = function() {
		window.clearTimeout(puckMove);
		console.log('Puck ' + id + ' is exploding in your face');
	};
	//interval is an integer representing miliseconds
	this.start_moving = function(interval) {
		puckMove = window.setInterval(this.move.bind(this), interval);
	};
	//timeout is an integer representing miliseconds
	this.schedule_dye = function(timeout) {
		puckDye = window.setTimeout(this.dye.bind(this), timeout);
	};
}

//origin and limit are Coordinate instances
function Area(origin, limit) {
	this.origin = origin;
	this.limit = limit;
	this.width = limit.x - origin.x;
	this.height = limit.y - origin.y;
	//body is an Area instance
	this.calculate_body_limit = function(body) {
		new_x = this.limit.x - body.width;
		new_y = this.limit.y - body.height;
		new_limit = new Coordinate(new_x, new_y);
		return new Area(this.origin, new_limit);
	};
	//generate random coordiante whitin then borders
	this.generate_random_coordinate = function() {
		x = random_number(limit.x, origin.x);
		y = random_number(limit.y, origin.y);
		return new Coordinate(x, y);
	};
	//coordinate is a Coordinate instance
	this.have_coordinate = function(coordinate) {
		x_ok = between(coordinate.x, origin.x, limit.x);
		y_ok = between(coordinate.y, origin.y, limit.y);
		if (x_ok && y_ok)
			return true;
		return false;
	};
}

//x and y are integers
function Coordinate(x, y) {
	this.x = x;
	this.y = y;
	//coord is an Instance of coordinate
	this.sum = function(coord) {
		new_x = this.x + coord.x
		new_y = this.y + coord.y
		return new Coordinate(new_x, new_y);
	};
}

function Game() {

	var pucks = {};
	var last_id = 0;

	this.start = function() {
		var arena_origin = new Coordinate(0, 0);
		var arena_limit = new Coordinate(500, 500);
		var arena = new Arena(arena_origin, arena_limit);

		var puck_origin = new Coordinate(0, 0);
		var puck_limit = new Coordinate(50, 50);

		var position = new Coordinate(100, 100)

		create_puck(puck_origin, puck_limit, arena, position);
		next_appearance = random_number(3000, 100);
		window.setTimeout(create_puck.bind(this, puck_origin, puck_limit, arena), next_appearance);
	};

	//puck_origin and puck_limit are Coordinates instances
	//arena is an Arena instance
	//defined_position must be and Coordinate instance within the Arena boundries
	var create_puck = function(puck_origin, puck_limit, arena, defined_position) {
		next_appearance = random_number(2000, 100);
		last_id += 1;
		movementInterval = random_number(1000, 100);;
		pass = 2;
		timeToDie = random_number(20000, 10);

		var aPuck = new Puck(this, last_id, pass, puck_origin, puck_limit);
		aPuck.allocate_initial_position(arena);
		aPuck.start_moving(movementInterval);
		aPuck.schedule_dye(timeToDie);

		pucks[last_id] = aPuck;
		window.setTimeout(create_puck.bind(this, puck_origin, puck_limit, arena), next_appearance);
	};

	this.remove_puck = function(id) {
		delete pucks[id];
	};
}

function main() {
	var welcomeMessage = document.getElementById("WelcomeMessage");
	welcomeMessage.innerHTML = "Hellcome to Puck";
	game = new Game();
	game.start();
}