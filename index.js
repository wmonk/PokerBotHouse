var Game = require('./app/lib/game');

var game = new Game({
	players: [{
		name: 'Will'
	}, {
		name: 'Alex'
	}]
});

game.on('log', console.log);

game.start().then(function () {
	// console.log(game);
}).catch(function (err) {
	console.error(err.stack);
});
