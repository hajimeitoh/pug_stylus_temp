(function($) {
  // スライダーオプションの初期設定
  let defaultSettings = {
    // レイアウト
      // スライダー自体の幅
      'width': 0,
      // スライド一枚の幅
      'itemWidth': 0,
      // スライダーの高さ
      'height': 0,
    // 挙動
      // 一回でスライドする割合（1=スライド一枚分、0.5=スライドの2分の1）
      'slideRatio': 1,
      // 開始番号
      'start': 0,
      // 自動アニメーション
      'autoAnimation': true,
      // アニメーションにかける時間
      'duration': 600,
      // アニメーションのeasing変数
      'easing': 'swing',
      // アニメーション待機時間
      'idleTime': 4000,
      // スライダーを行き止まりにする
      'deadEnd': false,
      // 方向(ltr=1,rtl=-1)
      'direction': 1,
    // 表示・非表示
      // インジケータの有無
      'indicator': false,
      // コントローラ、インジケータをホバー時以外隠す
      'hoverReaction': true,
      // ホバー時に自動アニメーションを切るかどうか
      'hoverStop': true,
    // スライドシンク
      // シンク先のスライダー
      'syncTo': '',
    // レスポンシブ
      'responsive': false
  };

  // Custom Event
  let
    slide = {
      'setFinish': jQuery.Event('slide:setFinish'),
      'changeFinish': jQuery.Event('slide:changeFinish'),
      'changeStart': jQuery.Event('slide:changeStart'),
      'stop': jQuery.Event('slide_stop'),
      'start': jQuery.Event('slide_start'),
      'to': jQuery.Event('slide_to')
    };

  // indexOf
  if (!Array.indexOf) {
      Array.prototype.indexOf = function(o) {
          for (var i in this) {
              if (this[i] == o) return i;
          }
          return -1;
      };
  }

  // スライダー本体
  var sliderview = (function() {
    var constructor = function(el,options) {
      this.$slider = el;
      this.targetId = this.$slider.attr('id');
      this.st = $.extend({}, defaultSettings, options);
      return this;
    };

    var proto = constructor.prototype;

    proto.init = function() {
      this.setEl();
      this.setState();
      this.setEvents();
      return this;
    };

    proto.setEl = function() {
      // スライダーコンテンツ（スライドする要素）
      this.$slContent = this.$slider.find('.multislider-content');
      this.$slContentItem = this.$slContent.children('.multislider-content-item');
      this.$slContentItemExtend = $();

      // インジケータ
      this.$slIndicator = $();
      this.$slIndicatorItem = $();

      // コントローラ
      this.$slControler = $();
      this.$slControlerItem = $();

      // スライダー外のコントローラとインジケータ
      this.$outElements = $();
      this.$outControler = $();
      this.$outPrev = $();
      this.$outNext = $();
      if( $('[data-multislider-target=#' + this.targetId + ']').length ){
        this.$outElements = $('[data-multislider-target=#' + this.targetId + ']');
        if(
          this.$outElements.filter('[data-multislider-action=prev]').length ||
          this.$outElements.filter('[data-multislider-action=next]').length
        ) {
          this.$outPrev = this.$outPrev.add(this.$outElements.filter('[data-multislider-action=prev]'));
          this.$outPrev.addClass('multislider-controler-item_prev');
          this.$outNext = this.$outNext.add(this.$outElements.filter('[data-multislider-action=next]'));
          this.$outNext.addClass('multislider-controler-item_next');
          this.$outControler = this.$outControler.add(this.$outPrev).add(this.$outNext);
        }
      }

      // シンク元
      this.$fromSlider = $();
      this.$fromSlideItem = $();
      // シンク先
      this.$toSlider = $();

      // クローン用
      this.$slFirstItems = $();
      this.$slLastItems = $();
      return this;
    };

    proto.setState = function() {
      // startが負数の場合計算
      if(this.st.start < 0){
        this.st.start = this.$slContentItem.length + this.st.start;
      }

      // アンコントーラブル変数
      this.state = {
        slLength: this.$slContentItem.length,
        slNum: this.st.start,
        controlerFlg: false,
        move: 1,
        slideMod: -1,
        slideModWidth: 0,
        notSingleFlg: true,
        slPrevWidth: 1,
        diffWidth: 0,
        stopFlg: false,
        arr: [],
        inNum: 0,
        inLength: 0,
        fromRatio: 1,
        fromLength: 0,
        isFrom: false,
        toRatio: 1,
        toLength: 0,
        isTo: false,
        aspect: 1
      };

      // this.st.統合
      this.st = $.extend(this.st, this.state);
      //itemWidthかwidthが0のときどちらかに合わせる
      this.st.width = ( this.st.width === 0 ) ? this.st.itemWidth : this.st.width;
      this.st.itemWidth = ( this.st.itemWidth === 0 ) ? this.st.width : this.st.itemWidth;
      // itemWidthとwidthが異なるとき、差分を計算する
      if( this.st.itemWidth !== this.st.width ) this.st.diffWidth = ( this.st.width - this.st.itemWidth ) / 2;
      // アイテムのシングルフラグを生成（スライドが一枚の時動かさないようにする）
      this.st.notSingleFlg = ( this.st.slLength === 1 ) ? false : true;
      // シンクモードの時サムネイルになるスライダーの自動アニメーションを切る
      if( this.st.syncTo !== '' ) this.st.autoAnimation = false;
      // スライダーのアスペクト比
      this.st.aspect = this.st.width / this.st.height;

      // コントローラ検知
      if(
        this.$slider.find('.multislider-controler').length ||
        this.$outControler.length
      ){
        this.st.controlerFlg = true;
      }

      // クローンを二つずつ先端と末尾に生成（はみ出しながらのアニメーションに対する対策）
      if( this.st.notSingleFlg ) this.cloning();

      return this;
    };

    proto.setEvents = function() {
      var that = this;

      if( that.st.notSingleFlg ){
        that.multiple();
        that.outerEventControl();
        if( this.st.syncTo !== '' ){
          var $syncTo = this.st.syncTo;
          $syncTo.syncTo(this.$slider,this.st.slideRatio);
        }
      } else {
        that.single();
      }
      if( this.st.responsive ){
        this.slideResize();
      }
      that.setFinish();

      return this;
    };

    proto.sliderEvent = function(type, num, slideType){
      var
        that = this,
        st = this.st,
        old_slNum = st.slNum;
      var slIndex = ( st.slLength + Math.floor( num + 0.01 ) ) % st.slLength;
      type.slide = {
        'index': slIndex,
        'amount': num,
        'length': st.slLength,
        'type': slideType,
        'move': st.direction,
        'target': this.$slContentItem.eq(slIndex).get(0)
      };
      return this.$slider.trigger(type);
    };

    proto.cloning = function() {
      this.$slFirstItems = this.$slContentItem.eq(0).add( this.$slContentItem.eq(1) );
      this.$slLastItems = this.$slContentItem.eq(-1);
      this.$slContent.append( this.$slFirstItems.clone(true) );
      this.$slContent.prepend( this.$slLastItems.clone(true) );
      this.$slContentItemExtend = this.$slContent.find('.multislider-content-item');
      if( this.st.diffWidth ){
        if( !this.st.responsive ){
          this.$slContent.css('margin-left', this.st.diffWidth + 'px' );
        } else {
          this.$slContent.css('margin-left', ( this.st.diffWidth / this.st.width * 100 ) + '%' );
        }
      }
      return this;
    };

    proto.slideResize = function() {
      var
        that = this,
        st = this.st;
      $(window).on('resize', function(){
        var sliderWidth = that.$slider.width();
        that.$slider.css('height', sliderWidth / st.aspect );
      });
      $(window).resize();
    };

    proto.multiple = function() {
      var
        that = this,
        st = this.st,
        finishFlg = new $.Deferred();

      // ロード時の整形（スライダーラッパー）
      if( !st.responsive ){
        this.$slider.css({
          'width': st.width + 'px',
          'height': st.height + 'px'
        });
      } else {
        this.$slider.css({
          'max-width': st.width + 'px',
          'width': '100%',
          'height': st.height + 'px'
        });
      }

      // スライドモジュラー（スライド幅に対して、スライド一枚の長さが小さいときの対処）を算出
      if( this.$slContentItem.eq(-1).outerWidth(true) < this.$slContentItem.eq(0).outerWidth(true) ){
        st.slideMod = st.slLength - 1;
        st.slideModWidth = this.$slContentItem.eq(-1).outerWidth(true);
        st.slPrevWidth = st.slideModWidth / st.itemWidth;
        st.slLength = st.slLength - 1 + st.slPrevWidth;
      }
      var allSlLength = st.slLength + 2 + st.slPrevWidth;
      if( !st.responsive ){
        this.$slContent.css({
          'width': ( st.itemWidth * allSlLength ) + 'px',
          'left': - ( ( st.start + 2 - st.slPrevWidth ) * st.itemWidth ) + 'px'
        });
      } else {
        this.$slContent.css({
          'width': ( 100 * allSlLength * st.itemWidth / st.width ) + '%',
          'left': - ( ( st.start + 2 - st.slPrevWidth ) * 100 * st.itemWidth / st.width ) + '%'
        });
        this.$slContentItemExtend.css({
          'width': ( 100 / allSlLength ) + '%'
        });
        if( st.slPrevWidth !== 1 ){
          this.$slContent.css({
            'width': ( 100 * allSlLength * st.itemWidth / st.width ) + '%',
            'left': - ( ( st.start + st.slPrevWidth ) * 100 * st.itemWidth / st.width ) + '%'
          });
          this.$slContentItemExtend.eq(0).css({
            'margin-right': - ( ( 1 - st.slPrevWidth ) / allSlLength * 100 ) + '%'
          });
          this.$slContentItemExtend.eq(-3).css({
            'margin-right': - ( ( 1 - st.slPrevWidth ) / allSlLength * 100 ) + '%'
          });
        }
      }

      // スライド配列をセット
      for( var i = 0; i <= Math.floor( ( st.slLength + 0.01 ) / st.slideRatio ); i++ ){
        if( st.deadEnd &&  i * st.slideRatio > st.slLength - 1 ){
          if( st.slideRatio === 1 && i === Math.ceil( st.slLength - 1 ) ){
            this.st.arr.push( st.slLength - 1 );
          }
        } else {
          this.st.arr.push( i * st.slideRatio );
        }
      }
      if( !st.deadEnd && st.slPrevWidth !== 1 && st.slideRatio === 1 ){
        this.st.arr.push( st.slLength );
      }
      this.st.inLength = this.st.arr.length;
      this.st.inNum = this.st.arr.indexOf(this.st.slNum);


      // インジケータ
      if( st.indicator ) this.indication();

      // ホバーリアクション用のクラス名を付与
      if( st.hoverReaction ) this.$slider.addClass('multislider-hoverReact');

      // コントローラー
      if( st.controlerFlg ) this.controler();
      if(st.deadEnd && st.controlerFlg) that.deadEndDisp();

      // シンク先イベント
      if( st.syncTo ) this.syncToSet();

      // 自動アニメーション
      if( st.autoAnimation ) this.animator();
      finishFlg.resolve();

      return finishFlg.promise();
    };

    proto.setFinish = function() {
      var
        that = this,
        st = this.st;
      $.when(that.multiple||that.single).done(function() {
        setTimeout(function() {
          that.sliderEvent(slide.setFinish, st.slNum, 'defaultSet');
        }, 1);
      });

      return this;
    };

    proto.calcLeft = function(num) {
      var
        that = this,
        st = this.st,
        calcBase = - ( num + st.slPrevWidth ),
        calc = 0;
      if( !st.responsive ){
        calc = ( st.itemWidth * calcBase ) + 'px';
      } else {
        calc = ( 100 * calcBase * st.itemWidth / st.width ) + '%';
      }
      return calc;
    };

    proto.indication = function() {
      var
        that = this,
        st = this.st;

      // インジケータをアイテム分作成
      var indicatorInner = '';
      for(var i = 0; i <= Math.ceil( st.slLength ) - 1; i++){
        indicatorInner += '<li class="multislider-indicator-item" data-slider-num="' + i + '"></li>';
      }

      // インジケータの場所を判断しhtmlを作成、挿入
      if( this.$outElements.filter('[data-multislider-action=indicator]').length ){
        this.$slIndicator = this.$outElements.filter('[data-multislider-action=indicator]');
        this.$slIndicator.append($(indicatorInner).clone(true));
      } else {
        var indicatorHtml = '<ol class="multislider-indicator">' + indicatorInner + '</ol>';
        this.$slider.append($(indicatorHtml).clone(true));
        this.$slIndicator = this.$slider.find('.multislider-indicator');
      }
      this.$slIndicatorItem = this.$slIndicator.children('.multislider-indicator-item');
      this.$slIndicatorItem.eq( st.slNum ).addClass('current');

      this.$slIndicatorItem.on('click', function() {
        st.slNum = parseInt($(this).attr('data-slider-num'), 10);
        st.inNum = st.arr.indexOf(st.slNum);
        that.$slIndicatorItem.removeClass('current');
        that.$slIndicatorItem.eq( st.slNum ).addClass('current');
        that.sliderEvent(slide.changeStart, st.slNum, 'indicator');
        that.$slContent.animate({
          left: that.calcLeft( st.slNum )
        },{
          duration: st.duration,
          easing: st.easing,
          complete: function() {
            // 演算の切捨てを補正
            if( st.slLength - st.slNum < 0.01 ) st.slNum = st.slLength;
            if(st.deadEnd && st.controlerFlg) that.deadEndDisp();
            that.sliderEvent(slide.changeFinish, st.slNum, 'indicator');
          }
        });
      });
      return this;
    };

    proto.controler = function() {
      var
        that = this,
        st = this.st;

      this.$slControlerItem = this.$slider.find('.multislider-controler-item').add( this.$outControler );
      this.$slPrev = this.$slControlerItem.filter('.multislider-controler-item_prev').add( this.$outPrev );
      this.$slNext = this.$slControlerItem.filter('.multislider-controler-item_next').add( this.$outNext );
      this.$slControlerItem.on('click', function() {
        if( !that.$slContent.is(':animated') ){
          st.move = $(this).hasClass('multislider-controler-item_next') ? 1 : -1;
          if( st.move === 1 ){
            that.ltr('control');
          } else {
            that.rtl('control');
          }
        }
      });

      // インジケータとコントローラがある場合、コントローラの位置を調整
      if( st.indicator && !this.$outElements.length ) {
        this.$slControlerItem.css('bottom', this.$slIndicator.outerHeight() + 'px');
      }
      return this;
    };

    proto.animator = function() {
      var
        that = this,
        st = this.st;

      // スライダーにホバー時にクラスを与える
      if( st.hoverStop ){
        this.$slider.on('mouseenter mouseleave', function(e) {
          that.$slContent[ ( e.type === 'mouseenter' ) ? 'addClass' : 'removeClass' ]('hover');
        });
      }

      // アニメーション本体
      setTimeout(function() {
        that.sliderGoNext('animate');
      }, st.idleTime);
      return this;
    };

    proto.sliderGoNext = function(type) {
      var
        that = this,
        st = this.st,
        slideType = type;
      if( !that.$slContent.hasClass('hover') && !that.$slContent.is(':animated') && !st.stopFlg ){
        clearTimeout(this.slideGoTimer);
        if(st.direction === 1){
          st.move = 1;
          this.ltr('animate');
        } else {
          st.move = -1;
          this.rtl('animate');
        }
      } else {
        this.slideGoTimer = setTimeout( function() {
          that.sliderGoNext(slideType);
        }, st.idleTime);
      }
      return this;
    };

    proto.deadEndDisp = function() {
      var
        that = this,
        st = this.st,
        nextHidden = false,
        prevHidden = false;
      if( st.inNum === 0 ){
        prevHidden = true;
      }
      if( st.inNum === st.inLength -1 ){
        nextHidden = true;
      }
        if( nextHidden ){
        this.$slNext.addClass('disabled');
        this.$slNext.find('.multislider-controler-item-btn').prop('disabled', true);
      } else {
        this.$slNext.removeClass('disabled');
        this.$slNext.find('.multislider-controler-item-btn').prop('disabled', false);
      }
      if( prevHidden ){
        this.$slPrev.addClass('disabled');
        this.$slPrev.find('.multislider-controler-item-btn').prop('disabled', true);
      } else {
        this.$slPrev.removeClass('disabled');
        this.$slPrev.find('.multislider-controler-item-btn').prop('disabled', false);
      }
      return this;
    };

    proto.ltr = function(type) {
      var
        that = this,
        st = this.st,
        old_slNum = st.slNum,
        slideType = type,
        naturalAct = false;
      if( st.move === 1 ){
        // スライド端でさらに右へスライドしようとした時
        if( st.inNum === st.inLength - 1 ){
          if( st.deadEnd ){
            if( type === 'animate' ){
              st.direction = -1;
              st.move = -1;
              clearTimeout(this.ltrTimer);
              this.rtl(slideType);
              return false;
            }
          } else {
            // スライドを０位置に戻す
            this.$slContent.css( 'left', this.calcLeft(0) );
            st.inNum = 1;
          }
        } else {
          st.inNum++;
        }
        st.slNum = st.arr[st.inNum];

        // スライド幅までアニメーション
        this.sliderEvent(slide.changeStart, st.slNum, slideType);
        this.$slContent.stop().animate({
          left: that.calcLeft( st.slNum )
        },{
          duration: st.duration,
          easing: st.easing,
          complete: function() {
            if( st.indicator ) that.indicatorCheck();
            that.sliderEvent(slide.changeFinish, st.slNum, slideType);
            if(st.deadEnd && st.controlerFlg) that.deadEndDisp();
            // 演算の切捨てを補正
            if( st.slLength - st.slNum < 0.01 ) st.slNum = st.slLength;
            // アニメーションの場合戻す
            if( type === 'animate' ){
              that.ltrTimer = setTimeout(function() {
                that.sliderGoNext(slideType);
              }, st.idleTime);
            }
          }
        });
        // シンク先の操作
        if( st.isTo ) this.syncToAction();
        // シンク元の操作
        if( st.isFrom ) this.syncFromAction();
      } else {
        clearTimeout(this.ltrTimer);
      }
      return this;
    };

    proto.rtl = function(type) {
      var
        that = this,
        st = this.st,
        old_slNum = st.slNum,
        slideType = type;
      if( st.move === -1 ){
        if( st.inNum === 0 ){
          if( st.deadEnd ){
            if( type === 'animate' ){
              st.direction = 1;
              st.move = 1;
              clearTimeout(this.rltTimer);
              this.ltr(slideType);
              return false;
            }
          } else {
            // スライドを末端に戻す
            this.$slContent.css( 'left', this.calcLeft( st.slLength ) );
            st.inNum = st.inLength - 2;
          }
        } else {
          st.inNum--;
        }
        st.slNum = st.arr[st.inNum];


        // スライド幅までアニメーション
        this.sliderEvent(slide.changeStart, st.slNum, slideType);
        this.$slContent.stop().animate({
          left: that.calcLeft( st.slNum )
        },{
          duration: st.duration,
          easing: st.easing,
          complete: function() {
            if( st.indicator ) that.indicatorCheck();
            that.sliderEvent(slide.changeFinish, st.slNum, slideType);
            if(st.deadEnd && st.controlerFlg) that.deadEndDisp();
            // 演算の切捨てを補正
            if( st.slLength - st.slNum < 0.01 ) st.slNum = st.slLength;
            // アニメーションの場合戻す
            if( slideType === 'animate' ){
              that.rltTimer = setTimeout(function() {
                that.sliderGoNext(slideType);
              }, st.idleTime);
            }
          }
        });
        // シンク先の操作
        if( st.isTo ) this.syncToAction();
        // シンク元の操作
        if( st.isFrom ) this.syncFromAction();
      } else {
        clearTimeout(this.rltTimer);
      }
      return this;
    };

    proto.indicatorCheck = function() {
      var
        that = this,
        st = this.st,
        igrLength = Math.ceil(st.slLength);
      that.$slIndicatorItem.removeClass('current');
      if( st.slNum % 1 === 0 ){
        that.$slIndicatorItem.eq( Math.floor( st.slNum ) % igrLength ).addClass('current');
        if( !st.deadEnd && st.slPrevWidth !== 1 && st.slNum == igrLength - 1  ){
          that.$slIndicatorItem.eq( 0 ).addClass('current');
        }
      } else if( Math.round(st.slNum * 100) === Math.round(st.slLength * 100) && st.slPrevWidth !== 1 ){
        that.$slIndicatorItem.eq( 0 ).addClass('current');
      } else {
        that.$slIndicatorItem.eq( Math.ceil( st.slNum ) % igrLength ).addClass('current');
        that.$slIndicatorItem.eq( Math.floor( st.slNum ) % igrLength ).addClass('current');
      }
    };

    proto.outerEventControl = function() {
      var that = this,
        $thisSlider = this.$slider;
      $thisSlider.slideStop = function() {
        $thisSlider.trigger('slide_stop');
      };
      $thisSlider.slideStart = function() {
        $thisSlider.trigger('slide_start');
      };
      $thisSlider.slideTo = function(num){
        $thisSlider.trigger('slide_to',num);
      };
      $thisSlider.syncTo = function(elm,ratio){
        that.syncFromSet(elm,ratio);
      };

      $thisSlider.on('slide_stop', function() {
        that.eventStop();
      });
      $thisSlider.on('slide_start', function() {
        that.eventStart();
      });
      $thisSlider.on('slide_to', function(e,num){
        that.eventTo(num);
      });
      return this;
    };

    proto.eventStop = function() {
      this.st.stopFlg = true;
      return this;
    };

    proto.eventStart = function() {
      this.st.stopFlg = false;
      return this;
    };

    proto.eventTo = function(num) {
      var
        that = this,
        st = this.st;

      st.slNum = num;
      st.inNum = st.arr.indexOf(st.slNum);
      this.$slIndicatorItem.removeClass('current');
      this.$slIndicatorItem.eq( st.slNum ).addClass('current');
      this.sliderEvent(slide.changeStart, st.slNum, 'indicator');
      this.$slContent.animate({
        left: that.calcLeft( st.slNum )
      },{
        duration: st.duration,
        easing: st.easing,
        complete: function() {
          // 演算の切捨てを補正
          if( st.slLength - st.slNum < 0.01 ) st.slNum = st.slLength;
          if(st.deadEnd && st.controlerFlg) that.deadEndDisp();
          that.sliderEvent(slide.changeFinish, st.slNum, 'indicator');
        }
      });
      return this;
    };

    proto.syncFromSet = function(elm,ratio) {
      var
        that = this,
        st = this.st;
      this.$fromSlider = elm;
      this.$fromSlideItem = this.$fromSlider.find('[data-target]');
      st.fromLength = this.$fromSlider.find('.multislider-content-item').length - 3;
      st.fromRatio = st.fromLength / this.$slContentItem.length;
      st.toLength = st.fromLength / st.fromRatio;
      st.fromSlideRatio = ratio;
      st.isFrom = true;

      if( this.$fromSlideItem.length ){
        this.$fromSlideItem.filter('[data-target="' + ( st.slNum % st.fromLength ) + '"]').addClass('current');
      }

      if( st.hoverStop ){
        this.$fromSlider.on('mouseenter mouseleave', function(e) {
          that.$slContent[ ( e.type === 'mouseenter' ) ? 'addClass' : 'removeClass' ]('hover');
        });
      }

      return this;
    };

    proto.syncFromAction = function() {
      var
        that = this,
        st = this.st,
        fromNum = Math.floor( st.slNum * st.fromRatio / st.fromSlideRatio ) * st.fromSlideRatio;
      this.$fromSlider.slideTo( fromNum );
      if( this.$fromSlideItem.length ){
        this.$fromSlideItem.removeClass('current');
        this.$fromSlideItem.filter('[data-target="' + ( st.slNum % st.toLength ) + '"]').addClass('current');
      }
      return this;
    };

    proto.syncToSet = function() {
      var
        that = this,
        st = this.st;
      this.$toSlider = st.syncTo;
      this.$fromSlideItem = this.$slider.find('[data-target]');
      st.toLength = this.$toSlider.find('.multislider-content-item').length - 3;
      st.toRatio = st.toLength / this.$slContentItem.length;
      st.isTo = true;
      if( this.$fromSlideItem.length ) this.syncToOn();
      return this;
    };

    proto.syncToAction = function() {
      var
        that = this,
        st = this.st,
        toNum = Math.floor( st.slNum * st.toRatio );
      this.$toSlider.slideTo( toNum );
      if( this.$fromSlideItem.length ){
        this.$fromSlideItem.removeClass('current');
        this.$fromSlideItem.filter('[data-target="' + ( toNum % st.toLength ) + '"]').addClass('current');
      }
      return this;
    };

    proto.syncToOn = function() {
      var
        that = this,
        st = this.st;

      this.$fromSlideItem.on('click', function() {
        var slideNum = parseInt( $(this).attr('data-target'), 10);
        that.$fromSlideItem.removeClass('current');
        that.$toSlider.slideTo(slideNum);
        $(this).addClass('current');
      });
      return this;
    };

    proto.single = function() {
      var
        st = this.st,
        finishFlg = new $.Deferred();
      // ロード時の整形（スライダーラッパー）
      if( !st.responsive ){
        this.$slider.css({
          'width': st.width + 'px',
          'height': st.height + 'px'
        });
      } else {
        this.$slider.css({
          'max-width': st.width + 'px',
          'width': '100%',
          'height': st.height + 'px'
        });
      }
      if( !st.responsive ){
        this.$slContent.css({
          'width': st.itemWidth + 'px',
          'left': st.diffWidth + 'px'
        });
      } else {
        this.$slContent.css({
          'width': ( st.itemWidth / st.width * 100 ) + '%',
          'left': ( st.diffWidth / st.width * 100 ) + '%'
        });
      }

      // コントローラーを削除
      if( st.controlerFlg ){
        this.$slider.find('.multislider-controler').remove();
        this.$outElements.remove();
      }
      finishFlg.resolve();
      return finishFlg.promise();
    };

    return constructor;
  })();

  // 画像読込完了後にスライダー本体を構成する
  $.fn.jQueryMultiSlider = function( options ) {
    var
      $this = this,
      $all_images = $this.find('img'),
      all_imageCnt = $all_images.length,
      comp_imageCnt = 0;

    var view = new sliderview($this, options);

    if( all_imageCnt === 0 ){
      // 画像がない場合はそのまま進む
      view.init();
    } else {
      // すべての対象要素に一度だけ有効なloadイベントのイベントハンドラを設定
      $all_images.one('load', function() {
        comp_imageCnt++;
        // 全ての画像のロードが終わったらスライダープラグインに渡す
        if (all_imageCnt == comp_imageCnt) view.init();
      }).each(function() {
        // 手動でloadイベントを発火
        if (this.complete)  $(this).trigger('load');
      });
    }
    return this;
  };

})(jQuery);
