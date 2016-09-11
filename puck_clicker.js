//returns a number between min and max interval - can be negative numbers
function random_number(min, max) {
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
function Puck(lifeTime, pass, origin, limit) {
	var lifeTime = lifeTime;
	var pass = pass;
	var area = new Area(origin, limit);
	var limitArea = undefined;
	var position = undefined;
	var puck_move = undefined;
	//arena is an Arena instance
	var allocate_initial_position = function() {
		position = limitArea.generate_random_coordinate();
	};
	//arena is an Arena instance
	this.allocate_in = function(arena) {
		limitArea = arena.calculate_body_limit(area);
		allocate_initial_position();
		console.log('Puck was allocated to position' + '(' + position.x + ' ' + position.y + ')');
	};
	var calculate_pass = function() {
		x = random_number(-pass, pass);
		y = random_number(-pass, pass);
		return new Coordinate(x, y);
	};
	this.move = function() {
		valid_pass = false;
		new_position = undefined;
		console.log('The arena origin width is from ' + '(' + limitArea.origin.x + ' to ' + limitArea.limit.x + ')' + ' and its height if from ' + limitArea.origin.y + ' to ' + limitArea.limit.y);
		while (!valid_pass) {
			new_pass = calculate_pass();
			new_position = position.sum(new_pass);
			valid_pass = limitArea.have_coordinate(new_position);
			console.log('Puck tried to move to position' + '(' + new_position.x +
				' ' + new_position.y + ')');
		}
		position = new_position;
		console.log('Puck moved to position' + '(' + position.x + ' ' + position.y + ')');
	};
	this.start_moving = function(){
		puck_move = window.setInterval(this.move, 1000);
	}
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
		x = random_number(origin.x, limit.x);
		y = random_number(origin.y, limit.y);
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

function main() {
	var welcomeMessage = document.getElementById("WelcomeMessage");
	welcomeMessage.innerHTML = "Hellcome to Puck";
	var arena_origin = new Coordinate(0, 0);
	var arena_limit = new Coordinate(500, 500);
	var arena = new Arena(arena_origin, arena_limit);

	var puck_origin = new Coordinate(0,0);
	var puck_limit = new Coordinate(50, 50);
	var puckTheFirst = new Puck(undefined, 2, puck_origin, puck_limit);
	puckTheFirst.allocate_in(arena);
	puckTheFirst.start_moving();
}