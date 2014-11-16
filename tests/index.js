require('chai').should();
var proxyquire = require('proxyquire');
var nock = require('nock');
var Game;
var testOptions;
var setupNock;
var interceptor = {};
var moves = ['BET', 'FOLD'];

describe('When a game is played', function () {
	var random = function (max, min) {
		max = max || 1;
		min = min || 0;

		Math.seed = (Math.seed * 9301 + 49297) % 233280;
		var rnd = Math.seed / 233280;

		return min + rnd * (max - min);
	};

	beforeEach(function () {
		testOptions = {
			hands: 10,
			players: [{
				name: 'Alex',
				url: 'http://127.0.0.1:3030'
			}, {
				name: 'Will',
				url: 'http://127.0.0.1:3000'
			}]
		};

		setupNock = function (url, fn, id) {
			fn = fn || function () {
				return moves[Math.floor(random() * moves.length)];
			};

			interceptor[id || url] = nock(url)
				.persist()
				.get('/move')
				.reply(200, fn);
		};

		Game = proxyquire('../app/lib/game', {
			'./random': random
		});
	});

	afterEach(function () {
		interceptor = {};
		setupNock = undefined;
		nock.cleanAll();
	});

	describe('when the seed is 12', function() {
		it('Will should have the first move', function (done) {
			Math.seed = 12;
			var calls = [];

			setupNock('http://127.0.0.1:3030', function () {
				calls.push('3030');
				return moves[Math.floor(random() * moves.length)];
			});

			setupNock('http://127.0.0.1:3000', function () {
				calls.push('3000');
				return moves[Math.floor(random() * moves.length)];
			});

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.start().catch(done);
			gameUnderTest.on('end', function () {
				calls[0].should.equal('3000');
				done();
			});
		});

		it('should be a draw', function (done) {
			Math.seed = 12;
			setupNock('http://127.0.0.1:3030');
			setupNock('http://127.0.0.1:3000');

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.on('end', function (winner) {
				winner.should.equal('Draw');
				done();
			});

			gameUnderTest.start().catch(done);
		});
	});

	describe('when the seed is 1', function() {
		it('Alex should have the first move', function (done) {
			Math.seed = 5;
			var calls = [];

			setupNock('http://127.0.0.1:3030', function () {
				calls.push('3030');
				return moves[Math.floor(random() * moves.length)];
			});

			setupNock('http://127.0.0.1:3000', function () {
				calls.push('3000');
				return moves[Math.floor(random() * moves.length)];
			});

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.start().catch(done);
			gameUnderTest.on('end', function () {
				calls[0].should.equal('3030');
				done();
			});
		});

		it('should be won by Alex', function (done) {
			Math.seed = 5;

			var gameUnderTest = new Game(testOptions);
			setupNock('http://127.0.0.1:3030');
			setupNock('http://127.0.0.1:3000');

			gameUnderTest.on('end', function (winner) {
				winner.should.equal('Alex');
				done();
			});

			gameUnderTest.start().catch(done);
		});
	});

	describe('when the seed is 5', function() {
		it('Will should have the first move', function (done) {
			Math.seed = 11;
			var calls = [];

			setupNock('http://127.0.0.1:3030', function () {
				calls.push('3030');
				return moves[Math.floor(random() * moves.length)];
			});

			setupNock('http://127.0.0.1:3000', function () {
				calls.push('3000');
				return moves[Math.floor(random() * moves.length)];
			});

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.start().catch(done);
			gameUnderTest.on('end', function () {
				calls[0].should.equal('3000');
				done();
			});
		});

		it('should be won by Will', function (done) {
			Math.seed = 11;

			var gameUnderTest = new Game(testOptions);
			setupNock('http://127.0.0.1:3030');
			setupNock('http://127.0.0.1:3000');

			gameUnderTest.on('end', function (winner) {
				winner.should.equal('Will');
				done();
			});

			gameUnderTest.start().catch(done);
		});
	});



});
