/* サンプル用の呼び出し */
var pageview = (function() {
  var constructor = function() {
    return this;
  };
  var proto = constructor.prototype;

  proto.init = function() {
    var that = this;
    that.setEl();
    that.setEvents();
    return this;
  };

  proto.setEl = function() {
    this.$sliderBase = $('#jsSlider_base');
    this.$sliderControler = $('#jsSlider_controler');
    this.$sliderIndicator = $('#jsSlider_indicator');
    this.$sliderOutside = $('#jsSlider_outside');
    this.$sliderProtrude = $('#jsSlider_protrude');
    this.$sliderGap = $('#jsSlider_gap');
    this.$sliderMulti1 = $('#jsSlider_multi1');
    this.$sliderMulti2 = $('#jsSlider_multi2');
    this.$sliderMulti3 = $('#jsSlider_multi3');
    this.$sliderMulti4 = $('#jsSlider_multi4');
    this.$sliderResponsive = $('#jsSlider_responsive');

    this.$sliderSyncTo = $('#jsSlider_syncTo');
    this.$sliderSyncFrom = $('#jsSlider_syncFrom');

    this.$sliderSyncTo2 = $('#jsSlider_syncTo2');
    this.$sliderSyncFrom2 = $('#jsSlider_syncFrom2');

    this.$sliderSample01 = $('#jsSlider_sample01');
    this.$sliderSample02 = $('#jsSlider_sample02');
    return this;
  };

  proto.setEvents = function() {
    var that = this;
    that.sliderSet();
    return this;
  };

  // スライダープラグインに値をセットして起動
  proto.sliderSet = function() {
    var that = this;
    this.$sliderBase.jQueryMultiSlider({
      'width': 400,
      'height': 200
    });
    this.$sliderControler.jQueryMultiSlider({
      'width': 400,
      'height': 200,
      'hoverReaction': false
    });
    this.$sliderIndicator.jQueryMultiSlider({
      'width': 400,
      'height': 200,
      'indicator': true,
      'hoverReaction': false
    });
    this.$sliderOutside.jQueryMultiSlider({
      'width': 400,
      'height': 200,
      'indicator': true
    });
    this.$sliderProtrude.jQueryMultiSlider({
      'width': 500,
      'itemWidth': 400,
      'height': 200,
      'indicator': true,
      'easing': 'easeOutBack'
    });
    this.$sliderGap.jQueryMultiSlider({
      'width': 410,
      'height': 200,
      'indicator': true
    });
    this.$sliderMulti1.jQueryMultiSlider({
      'width': 300,
      'height': 100,
      'idleTime': 500,
      'indicator': true,
      'hoverReaction': false
    });
    this.$sliderMulti2.jQueryMultiSlider({
      'width': 300,
      'height': 100,
      'idleTime': 500,
      'slideRatio': (1/3),
      'indicator': true,
      'hoverReaction': false
    });
    this.$sliderMulti3.jQueryMultiSlider({
      'width': 300,
      'height': 100,
      'idleTime': 500,
      'indicator': true,
      'hoverReaction': false,
      'deadEnd': true
    });
    this.$sliderMulti4.jQueryMultiSlider({
      'width': 300,
      'height': 100,
      'idleTime': 500,
      'slideRatio': (1/3),
      'indicator': true,
      'hoverReaction': false,
      'deadEnd': true
    });

    this.$sliderResponsive.jQueryMultiSlider({
      'width': 800,
      'height': 200,
      'indicator': true,
      'hoverReaction': false,
      'responsive': true
    });

    var $slider01 = this.$sliderSample01;
    $slider01.jQueryMultiSlider({
      'width': 610,
      'height': 200,
      'indicator': true,
      'deadEnd': true,
      'start': -1,
      'direction': -1,
      'hoverReaction': false
    }).on('slide:setFinish slide:changeFinish', function(e) {
      $slider01.find('.multislider-indicator').attr('data-num', ( e.slide.index + 1 ) + '/' + e.slide.length);
      $slider01.find('.slider-caption').text( $(e.slide.target).attr('data-title') );
    });

    var $slider02 = this.$sliderSample02;
    $slider02.jQueryMultiSlider({
      'width': 638,
      'itemWidth': 572,
      'height': 292,
      'indicator': true,
      'deadEnd': true,
      'hoverReaction': false,
      'autoAnimation': false
    });

    $syncTo = this.$sliderSyncTo;
    $syncTo.jQueryMultiSlider({
      'width': 400,
      'height': 200
    });
    this.$sliderSyncFrom.jQueryMultiSlider({
      'width': 400,
      'height': 80,
      'syncTo': $syncTo
    });

    $syncTo2 = this.$sliderSyncTo2;
    $syncTo2.jQueryMultiSlider({
      'width': 400,
      'height': 200
    });
    this.$sliderSyncFrom2.jQueryMultiSlider({
      'width': 400,
      'height': 80,
      'slideRatio': 0.2,
      'syncTo': $syncTo2
    });

    return this;
  };

  return constructor;
})();

$(function(){
  var view = new pageview();
  view.init();
});