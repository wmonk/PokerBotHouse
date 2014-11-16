var Promise = require('bluebird');
var turn = require('./turn');
var _ = require('lodash');
var events = require('events');
var util = require('util');
var request = require('request');
var random = require('./random');

function Game(settings) {
	settings = _.clone(settings);
	this.players = settings.players;
	delete settings.players;

	this.settings = _.assign({
		hands: 100,
		chips: 100
	}, settings);

	this.players.forEach(function setupPlayer(player) {
		player.chips = this.settings.chips;
	}.bind(this));

	var firstPlayer = Math.floor(random() * this.players.length);
	var secondPlayer = firstPlayer === 1 ? 0 : 1;

	this.player1 = this.players[firstPlayer];
	this.player2 = this.players[secondPlayer];
}

util.inherits(Game, events.EventEmitter);

Game.prototype.start = function () {
	return new Promise(function (res, rej) {
		this.resolveGame = res;
		this.rejectGame = rej;
		this.currentPlayer = this.player1;

		this.startHand();
	}.bind(this));
};

Game.prototype.opposingPlayer = function () {
	return this.currentPlayer === this.player1 ? this.player2 : this.player1;
};

Game.prototype.startHand = function () {
	this.settings.hands--;
	this.pot = 0;

	this.deal()
		.bind(this)
		.then(this.playHand)
		.then(this.handOver)
		.catch(this.rejectGame);
};

Game.prototype.deal = function () {
	var cards = {
		2: 13,
		3: 12,
		4: 11,
		5: 10,
		6: 9,
		7: 8,
		8: 7,
		9: 6,
		10: 5,
		'J': 4,
		'Q': 3,
		'K': 2,
		'A': 1
	};
	var deck = [];

	Object.keys(cards).forEach(function (key) {
		for (var i = 0; i < cards[key]; i++) {
			deck.push(key);
		}
	});

	function shuffle(o) {
		for (var j, x, i = o.length; i; j = Math.floor(random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}

	deck = shuffle(deck);

	this.players.forEach(function (player) {
		player.card = deck[Math.floor(random() * deck.length)];
	});

	this.emit('log', 'Dealing');

	return Promise.all([
	    request({
	        url: this.player1.url + '/update',
	        method: 'post',
	        form: {
	            card: this.player1.card
	        }
	    }),
	    request({
	        url: this.player2.url + '/update',
	        method: 'post',
	        form: {
	            card: this.player2.card
		        }
	    })
	]);
};

Game.prototype.handOver = function (winner) {
	this.emit('log', 'winner: ' + winner.name);

	if (this.settings.hands !== 0) {
		this.startHand();
	} else {

		if (this.player1.chips > this.player2.chips) {
			this.emit('log', 'OVERALL WINNER: ' + this.player1.name + ' chips: ' + this.player1.chips);
			this.emit('end', this.player1.name);
		} else if (this.player2.chips > this.player1.chips) {
			this.emit('log', 'OVERALL WINNER: ' + this.player2.name + ' chips: ' + this.player2.chips);
			this.emit('end', this.player2.name);
		} else {
			this.emit('log', 'DRAW');
			this.emit('end', 'Draw');
		}

		this.resolveGame();
	}
};

Game.prototype.playHand = function () {
	return new Promise(function (res) {
		turn.call(this, this.currentPlayer, res);
	}.bind(this));
};

module.exports = Game;
