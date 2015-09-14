describe('Element Factory', function() {

  var ElementFactory;
  beforeEach(function() {
    module('angular-stick-to', function($provide) {
      $provide.value('AccessorFactory', mock.createAccessorFactoryMock());
    });
    inject(function(_ElementFactory_) {
      ElementFactory = _ElementFactory_;
    });
  });

  describe('Create Sticky Element function', function() {

    describe('StickyElement Object (result of executing)', function() {
      var StickyElement;
      var jqElement;
      var accessors;
      var AccessorFactory;
      var options;
      beforeEach(inject(function(_AccessorFactory_) {
        AccessorFactory = _AccessorFactory_;
        accessors = {
          getPrimaryLimit: jasmine.createSpy('getPrimaryLimit'),
          getSecondaryLimit: jasmine.createSpy('getSecondaryLimit')
        };
        AccessorFactory.createPrimaryLimitAccessor
        .and.returnValue(accessors.getPrimaryLimit);
        AccessorFactory.createSecondaryLimitAccessor
        .and.returnValue(accessors.getSecondaryLimit);

        jqElement = helper.createElementMock({
          top: 10,
          bottom: 60
        });

        options = {
          element: jqElement,
          primaryLimit: '10',
          secondaryLimit: 'some-limit'
        };
        StickyElement = ElementFactory.createStickyElement(options);
      }));

      checkSimpleElementAPI(
        function() {
          return StickyElement;
        }, function() {
          return jqElement;
        }
      );

      it('should have state property', function() {
        expect(StickyElement.state).toBeDefined();
      });

      describe('getPrimaryLimit() function', function() {
        it('should be generated by AccessorFactory', function() {
          expect(StickyElement.getPrimaryLimit)
          .toEqual(accessors.getPrimaryLimit);
        });

        it('should be generated using primaryLimit option', function() {
          expect(AccessorFactory.createPrimaryLimitAccessor)
          .toHaveBeenCalledWith(options.primaryLimit);
        });
      });

      describe('getSecondaryLimit() function', function() {
        it('should be generated by AccessorFactory', function() {
          expect(StickyElement.getSecondaryLimit)
          .toEqual(accessors.getSecondaryLimit);
        });

        it('should be generated using secondaryLimit option', function() {
          expect(AccessorFactory.createSecondaryLimitAccessor)
          .toHaveBeenCalledWith(options.secondaryLimit);
        });
      });

      describe('getSyntheticOffset() function', function() {
        it('should be defined', function() {
          expect(StickyElement.getSyntheticOffset)
          .toEqual(jasmine.any(Function));
        });

        describe('when called', function() {
          it('should return 0', function() {
            expect(StickyElement.getSyntheticOffset()).toEqual(0);
          });
        });
      });

      describe('setSyntheticOffset() function', function() {
        it('should be defined', function() {
          expect(StickyElement.setSyntheticOffset)
          .toEqual(jasmine.any(Function));
        });

        [0, 10].forEach(function(offset) {
          describe('when called with ' + offset + ' offset value', function() {
            beforeEach(function() {
              StickyElement.setSyntheticOffset(offset);
            });
            it('should apply translate2d: ' + offset + ' on element',
            function() {
              expect(StickyElement.jqElement.css).toHaveBeenCalledWith({
                '-ms-transform': 'translate(0px,' + offset + 'px)', /* IE 9 */
                '-webkit-transform': 'translate(0px,' + offset + 'px)', /* Safari */
                'transform': 'translate(0px,' + offset + 'px)'
              });
            });

            describe('getSyntheticOffset() functoin', function() {
              it('should return new value', function() {
                expect(StickyElement.getSyntheticOffset()).toEqual(offset);
              });
            });
          });
        });
      });

      describe('getPristineTop()', function() {
        beforeEach(function() {
          jqElement.rect.setTop(115);
        });
        it('should return real top position', function() {
          expect(StickyElement.getPristineTop()).toEqual(115);
        });

        describe('when element offsetted', function() {
          beforeEach(function() {
            jqElement.rect.setTop(115 + 100);
            StickyElement._syntheticOffset = 100;
          });

          it('should return pristine top', function() {
            expect(StickyElement.getPristineTop()).toEqual(115);
          });
        });
      });

      describe('getPristineBottom()', function() {
        beforeEach(function() {
          jqElement.rect.setBottom(115);
        });
        it('should return real bottom position', function() {
          expect(StickyElement.getPristineBottom()).toEqual(115);
        });

        describe('when element offsetted', function() {
          beforeEach(function() {
            jqElement.rect.setBottom(115 + 100);
            StickyElement._syntheticOffset = 100;
          });

          it('should return pristine bottom', function() {
            expect(StickyElement.getPristineBottom()).toEqual(115);
          });
        });
      });

    });
  });

  describe('Create Simple Element', function() {

    describe('When called with jqelement', function() {
      var el;
      var simpleElement;

      beforeEach(function() {
        el = helper.createElementMock();
        simpleElement = ElementFactory.createSimpleElement(el);
      });

      it('should return SimpleElement object', function() {
        expect(simpleElement).toEqual(jasmine.any(Object));
      });

      describe('SimpleElement Object', function() {
        checkSimpleElementAPI(
          function() {
            return simpleElement;
          },
          function() {
            return el;
          }
        );
      });
    });
  });

  function checkSimpleElementAPI(simpleElementGetter, initialJqElementGetter) {
    var simpleElement;
    var el;
    beforeEach(function() {
      simpleElement = simpleElementGetter();
      el = initialJqElementGetter();
    });

    it('should has element property with expected value', function() {
      expect(simpleElement.element).toEqual(el[0]);
    });

    it('should has jqElement property with expected value', function() {
      expect(simpleElement.jqElement).toEqual(el);
    });

    [
      'getTop',
      'getBottom'
    ].forEach(function(item) {
      it('should has "' + item + '" method', function() {
        expect(simpleElement[item]).toEqual(jasmine.any(Function));
      });
    });

    describe('When called getTop()' , function() {
      it('should return element top edge offset' +
      'relatively to viewport top edge', function() {
        el.rect.setTop(42);
        expect(simpleElement.getTop()).toEqual(42);
      });
    });

    describe('When called getBottom()', function() {
      it('should return element bottom edge offset' +
        'relatively to viewport top edge', function() {
          el.rect.setBottom(61);
          expect(simpleElement.getBottom()).toEqual(61);
        });
    });
  }
});
