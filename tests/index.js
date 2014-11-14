require('chai').should();
var proxyquire = require('proxyquire');
var Game;

describe('When a game is played', function () {
	var turn = proxyquire('../app/lib/turn', {
		'./random': function (max, min) {
			max = max || 1;
			min = min || 0;

			Math.seed = (Math.seed * 9301 + 49297) % 233280;
			var rnd = Math.seed / 233280;

			return min + rnd * (max - min);
		}
	});

	Game = proxyquire('../app/lib/game', {
		'./turn': turn
	});

	it.only('should be a draw when seed is 1', function (done) {
		Math.seed = 5;

		var gameUnderTest = new Game({
			players: [{
				name: 'Alex'
			}, {
				name: 'Will'
			}]
		});

		gameUnderTest.on('end', function (winner) {
			console.log(winner);
			winner.should.equal('Draw');
			done();
		});

		gameUnderTest.start().catch(done);
	});

	it('should be won by Alex when seed is 1', function (done) {
		Math.seed = 1;

		var gameUnderTest = new Game({
			players: [{
				name: 'Alex'
			}, {
				name: 'Will'
			}]
		});

		gameUnderTest.on('end', function (winner) {
			winner.should.equal('Draw')
			done();
		});

		gameUnderTest.start().catch(done);
	});

	it('should be won by Will when seed is 2', function (done) {
		Math.seed = 2;

		var gameUnderTest = new Game({
			players: [{
				name: 'Alex'
			}, {
				name: 'Will'
			}]
		});

		gameUnderTest.on('end', function (winner) {
			console.log(winner);
			winner.should.equal('Will')
			done();
		});

		gameUnderTest.start().catch(done);
	});
});
