var Promise = require('bluebird');
var random = require('./random');

var turnMethods = {
	FOLD: function () {
		this.emit('log', this.currentPlayer.name + ' FOLDED');
		this.opposingPlayer().chips += this.pot;
	},
	BET: function () {
		this.emit('log', this.currentPlayer.name + ' BET');
		this.pot++;
		this.currentPlayer.chips--;
	}
};

function turn(player, finish) {
	this.emit('log', 'pot: ' + this.pot);
	this.currentPlayer = player;

	getMove(player)
		.bind(this)
		.then(function (move) {
			turnMethods[move].call(this);

			if (move === 'FOLD') {
				return finish(this.opposingPlayer());
			}

			turn.call(this, this.opposingPlayer(), finish);
		});
}

function getMove(player) {
	var moves = ['BET', 'FOLD'];

	return Promise.resolve(moves[Math.floor(random() * moves.length)]);
}

module.exports = turn;
