require('chai').should();

describe('circleci gif bot', function () {
    it('should do something async...', function (done) {
        setTimeout(function () {
            ('hello').should.equal('hello');
            done();
        }, 5);
    });

    it('should do something...', function () {
        ('hello').should.equal('hello');
    });
});
