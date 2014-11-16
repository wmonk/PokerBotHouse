require('chai').should();
var proxyquire = require('proxyquire');
var nock = require('nock');
var Game;
var testOptions;
var interceptor = {};
var moves = ['BET', 'FOLD'];
var alexCards;
var willCards;
var calls;


describe('When a game is played', function () {
	var random = function (max, min) {
		max = max || 1;
		min = min || 0;

		Math.seed = (Math.seed * 9301 + 49297) % 233280;
		var rnd = Math.seed / 233280;

		return min + rnd * (max - min);
	};

	function setupNock (options) {
		options.forEach(function (option) {
			var moveFn = option.move || function () {
				return moves[Math.floor(random() * moves.length)];
			};

			var updateFn = option.update || function () {
				return '';
			};

			interceptor[option.url] = nock(option.url)
				.persist()
				.get('/move')
				.reply(200, moveFn)
				.post('/update')
				.reply(200, updateFn);
		});
	}

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

		alexCards = [];
		willCards = [];
		calls = [];

		setupNock([{
			url: testOptions.players[0].url,
			move: function () {
				calls.push(testOptions.players[0].url);
				return moves[Math.floor(random() * moves.length)];
			},
			update: function (url, card) {
				alexCards.push(card.split('=')[1]);
			}
		}, {
			url: testOptions.players[1].url,
			move: function () {
				calls.push(testOptions.players[1].url);
				return moves[Math.floor(random() * moves.length)];
			},
			update: function (url, card) {
				willCards.push(card.split('=')[1]);
			}
		}]);

		Game = proxyquire('../app/lib/game', {
			'./random': random
		});
	});

	afterEach(function () {
		interceptor = {};
		nock.cleanAll();
	});

	describe('when the seed is 12', function () {
		it('should deal each player a card', function (done) {
			Math.seed = 12;

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.start().catch(done);
			gameUnderTest.on('end', function () {
				alexCards.should.eql(['4', '6', '5', '3', '4', '2', '2', '3', '5', '5']);
				willCards.should.eql(['3', '3', '10', '5', '2', '10', 'K', '3', '2', '8']);
				done();
			});
		});

		it('Will should have the first move', function (done) {
			Math.seed = 12;

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.start().catch(done);
			gameUnderTest.on('end', function () {
				calls[0].should.equal(testOptions.players[1].url);
				done();
			});
		});

		it('should be won by Alex', function (done) {
			Math.seed = 12;

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.on('end', function (winner) {
				winner.should.equal(testOptions.players[0].name);
				done();
			});

			gameUnderTest.start().catch(done);
		});
	});

	describe('when the seed is 1', function () {
		it('should deal each player a card', function (done) {
			Math.seed = 5;

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.start().catch(done);
			gameUnderTest.on('end', function () {
				alexCards.should.eql(['6', '3', '3', '3', '9', '5', '4', '6', '2', '9']);
				willCards.should.eql(['5', '3', '6', '9', '10', '5', '6', '5', 'K', '5']);
				done();
			});
		});

		it('Alex should have the first move', function (done) {
			Math.seed = 5;

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.start().catch(done);
			gameUnderTest.on('end', function () {
				calls[0].should.equal(testOptions.players[0].url);
				done();
			});
		});

		it('should be won by Will', function (done) {
			Math.seed = 5;

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.on('end', function (winner) {
				winner.should.equal(testOptions.players[1].name);
				done();
			});

			gameUnderTest.start().catch(done);
		});
	});

	describe('when the seed is 5', function () {
		it('should deal each player a card', function (done) {
			Math.seed = 11;

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.start().catch(done);
			gameUnderTest.on('end', function () {
				alexCards.should.eql(['8', '5', '3', '5', '10', '9', '2', '2', '8', 'J']);
				willCards.should.eql(['2', 'J', '3', '2', 'A', '9', '3', '3', '7', '2']);
				done();
			});
		});

		it('Alex should have the first move', function (done) {
			Math.seed = 11;

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.start().catch(done);
			gameUnderTest.on('end', function () {
				calls[0].should.equal(testOptions.players[1].url);
				done();
			});
		});

		it('should be a DRAW', function (done) {
			Math.seed = 11;

			var gameUnderTest = new Game(testOptions);

			gameUnderTest.on('end', function (winner) {
				winner.should.equal('Draw');
				done();
			});

			gameUnderTest.start().catch(done);
		});
	});
});
