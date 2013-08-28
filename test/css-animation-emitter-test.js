'use strict';

describe('css-animation-emitter', function() {

  describe('transitionend event', function() {
    var el = document.createElement('div');
    var emitter = CSSAnimationEmitter(el);
    document.body.appendChild(el);
    el.id = 'transition';

    function opacity(value) {
      if (undefined === value) {
        return parseInt(el.style.opacity, 10);
      }

      el.style.opacity = value;
    }

    function toggleOpacity() {
      if (0 === opacity()) {
        opacity(1);
        return;
      }

      opacity(0);
    }

    it('should emit', function(done) {
      var called = 0;

      emitter.on('transitionend', function(e) {
        called++;

        if (0 === opacity()) {
          expect(e).to.be.an.instanceof(Event);
          toggleOpacity();
        } else {
          expect(called).to.be.equal(2);
          done();
        }
      });

      toggleOpacity();
    });

    it('should emit once', function(done) {
      var called = 0;

      function fn() {
        called++;
        toggleOpacity();
      }

      setTimeout(function() {
        expect(called).to.be.equal(1);
        done();
      }, 100);

      emitter.once('transitionend', fn);
      toggleOpacity();
    });



  });
});
