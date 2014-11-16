require('chai').should();
var proxyquire = require('proxyquire');
var nock = require('nock');
var Game;
var testOptions;

describe('When a game is played', function () {
	var random = function (max, min) {
		max = max || 1;
		min = min || 0;

		Math.seed = (Math.seed * 9301 + 49297) % 233280;
		var rnd = Math.seed / 233280;

		return min + rnd * (max - min);
	};

	var moves = ['BET', 'FOLD'];

	beforeEach(function () {
		testOptions = {
			hands: 10,
			players: [{
				name: 'Alex',
				url: 'http://127.0.0.1:3030'
			}, {
				name: 'Will',
				url: 'http://127.0.0.1:3030'
			}]
		};

		nock('http://127.0.0.1:3030')
			.persist()
			.get('/move')
			.reply(200, function () {
				return moves[Math.floor(random() * moves.length)];
			});

		Game = proxyquire('../app/lib/game', {
			'./random': random,
			'@global': true
		});
	});

	after(function () {
		nock.restore();
	});

	it('should be a draw when seed is 3', function (done) {
		Math.seed = 3;

		var gameUnderTest = new Game(testOptions);

		gameUnderTest.on('end', function (winner) {
			winner.should.equal('Draw');
			done();
		});

		gameUnderTest.start().catch(done);
	});

	it('should be won by Alex when seed is 1', function (done) {
		Math.seed = 1;

		var gameUnderTest = new Game(testOptions);

		gameUnderTest.on('end', function (winner) {
			winner.should.equal('Alex');
			done();
		});

		gameUnderTest.start().catch(done);
	});

	it('should be won by Will when seed is 5', function (done) {
		Math.seed = 5;

		var gameUnderTest = new Game(testOptions);

		gameUnderTest.on('end', function (winner) {
			winner.should.equal('Will');
			done();
		});

		gameUnderTest.start().catch(done);
	});
});
