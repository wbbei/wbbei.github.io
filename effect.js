$(window).load(function(){
	$('.loading').fadeOut('fast');
	$('.container').fadeIn('fast');
});
$('document').ready(function(){
		var vw;
		function positionBalloons() {
			vw = $(window).width()/2;
			var screenWidth = $(window).width();
			var spacing;
			
			// 根据屏幕宽度调整间距
			if (screenWidth <= 480) {
				// 小屏手机
				spacing = [60, 40, 20, 0, 20, 40, 60];
			} else if (screenWidth <= 768) {
				// 平板/大屏手机
				spacing = [120, 80, 40, 0, 40, 80, 120];
			} else {
				// 桌面端
				spacing = [350, 250, 150, 50, 50, 150, 250];
			}
			
			$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').stop();
			$('#b11').animate({top:240, left: vw-spacing[0]},500);
			$('#b22').animate({top:240, left: vw-spacing[1]},500);
			$('#b33').animate({top:240, left: vw-spacing[2]},500);
			$('#b44').animate({top:240, left: vw-spacing[3]},500);
			$('#b55').animate({top:240, left: vw+spacing[4]},500);
			$('#b66').animate({top:240, left: vw+spacing[5]},500);
			$('#b77').animate({top:240, left: vw+spacing[6]},500);
		}
		
		$(window).resize(function(){
			positionBalloons();
		});

	$('#turn_on').click(function(){
		$('#bulb_yellow').addClass('bulb-glow-yellow');
		$('#bulb_red').addClass('bulb-glow-red');
		$('#bulb_blue').addClass('bulb-glow-blue');
		$('#bulb_green').addClass('bulb-glow-green');
		$('#bulb_pink').addClass('bulb-glow-pink');
		$('#bulb_orange').addClass('bulb-glow-orange');
		$('body').addClass('peach');
		$(this).fadeOut('slow').delay(2000).promise().done(function(){
			$('#play').fadeIn('slow');
		});
	});
	$('#play').click(function(){
		var audio = $('.song')[0];
        audio.play();
        $('#bulb_yellow').addClass('bulb-glow-yellow-after');
		$('#bulb_red').addClass('bulb-glow-red-after');
		$('#bulb_blue').addClass('bulb-glow-blue-after');
		$('#bulb_green').addClass('bulb-glow-green-after');
		$('#bulb_pink').addClass('bulb-glow-pink-after');
		$('#bulb_orange').addClass('bulb-glow-orange-after');
		$('body').css('backgroud-color','#FFF');
		$('body').addClass('peach-after');
		$(this).fadeOut('slow').delay(3000).promise().done(function(){
			$('#bannar_coming').fadeIn('slow');
		});
	});

	$('#bannar_coming').click(function(){
		$('.bannar').addClass('bannar-come');
		$(this).fadeOut('slow').delay(3000).promise().done(function(){
			$('#balloons_flying').fadeIn('slow');
		});
	});

	// 获取屏幕适配的飞行范围
	function getFlightBounds() {
		var screenWidth = $(window).width();
		var screenHeight = $(window).height();
		return {
			maxLeft: screenWidth > 768 ? screenWidth - 150 : screenWidth - 80,
			maxTop: Math.min(screenHeight - 150, 500),
			minLeft: 50,
			minTop: 150
		};
	}

	// 生成更自然的飞行动画
	function createBalloonLoop(balloonId, index) {
		return function balloonLoop() {
			var bounds = getFlightBounds();
			
			// 直接生成目标位置（更大的随机范围）
			var targetLeft = bounds.minLeft + (bounds.maxLeft - bounds.minLeft) * Math.random();
			var targetBottom = bounds.minTop + (bounds.maxTop - bounds.minTop) * Math.random();
			
			// 随机动画时间，让每个气球有不同的速度
			var duration = 3000 + Math.random() * 4000;
			
			// 使用温和的缓动效果让运动更自然
			$(balloonId).animate({
				left: targetLeft,
				bottom: targetBottom
			}, {
				duration: duration,
				easing: 'swing',
				step: function(now, fx) {
					// 在动画过程中添加轻微摆动
					if (fx.prop === 'left') {
						var progress = fx.pos;
						var wobble = Math.sin(progress * Math.PI * 2) * 4;
						var rotation = Math.sin(progress * Math.PI * 1.5) * 8;
						$(this).css('transform', 'translateX(' + wobble + 'px) rotate(' + rotation + 'deg)');
					}
				},
				complete: function() {
					// 添加随机延迟让气球飞行更自然
					setTimeout(balloonLoop, 800 + Math.random() * 2000);
				}
			});
		};
	}
	
	// 气球初始上升动画
	function raiseBalloon(balloonId, delay, index) {
		setTimeout(function() {
			// 设置初始位置在屏幕不同位置
			var vw = $(window).width();
			var startPositions = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]; // 不同的水平起始位置比例
			var startLeft = vw * startPositions[index - 1];
			
			$(balloonId).css({
				'left': startLeft,
				'bottom': -200,
				'opacity': 0.6
			});
			
			// 开始上升动画
			$(balloonId).animate({
				bottom: 180 + Math.random() * 120, // 随机高度范围更大
				opacity: 0.8
			}, {
				duration: 2000,
				easing: 'swing',
				complete: function() {
					// 上升完成，开始准备自由飞行
					$(this).css('opacity', 0.9);
				}
			});
		}, delay);
	}

	// 为每个气球创建循环函数
	var loopOne = createBalloonLoop('#b1', 1);
	var loopTwo = createBalloonLoop('#b2', 2);
	var loopThree = createBalloonLoop('#b3', 3);
	var loopFour = createBalloonLoop('#b4', 4);
	var loopFive = createBalloonLoop('#b5', 5);
	var loopSix = createBalloonLoop('#b6', 6);
	var loopSeven = createBalloonLoop('#b7', 7);

	$('#balloons_flying').click(function(){
		$('.balloon-border').animate({top:-500},8000);
		
		// 先让气球上升，每个气球有不同的启动延迟和位置
		raiseBalloon('#b1', 100, 1);
		raiseBalloon('#b2', 300, 2);
		raiseBalloon('#b3', 200, 3);
		raiseBalloon('#b4', 500, 4);
		raiseBalloon('#b5', 150, 5);
		raiseBalloon('#b6', 400, 6);
		raiseBalloon('#b7', 250, 7);
		
		// 延迟添加浮动和旋转效果（等气球都开始上升后）
		setTimeout(function() {
			$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').addClass('balloon-floating');
			$('#b1,#b4,#b5,#b7').addClass('balloons-rotate-behaviour-one');
			$('#b2,#b3,#b6').addClass('balloons-rotate-behaviour-two');
		}, 1200);
		
		// 等所有气球都完成上升后开始自由飞行（2秒上升+最大0.5秒延迟+0.2秒缓冲）
		setTimeout(function() { loopOne(); }, 2800);
		setTimeout(function() { loopTwo(); }, 2900);
		setTimeout(function() { loopThree(); }, 2850);
		setTimeout(function() { loopFour(); }, 3000);
		setTimeout(function() { loopFive(); }, 2820);
		setTimeout(function() { loopSix(); }, 2950);
		setTimeout(function() { loopSeven(); }, 2880);
		
		$(this).fadeOut('slow').delay(3000).promise().done(function(){
			$('#cake_fadein').fadeIn('slow');
		});
	});	

	$('#cake_fadein').click(function(){
		$('.cake').fadeIn('slow');
		$(this).fadeOut('slow').delay(1500).promise().done(function(){
			$('#light_candle').fadeIn('slow');
		});
	});

	$('#light_candle').click(function(){
		$('.fuego').fadeIn('slow');
		$(this).fadeOut('slow').promise().done(function(){
			$('#wish_message').fadeIn('slow');
		});
	});

		
	$('#wish_message').click(function(){
		vw = $(window).width()/2;
		var screenWidth = $(window).width();
		var spacing;
		
		// 根据屏幕宽度调整间距
		if (screenWidth <= 480) {
			// 小屏手机
			spacing = [60, 40, 20, 0, 20, 40, 60];
		} else if (screenWidth <= 768) {
			// 平板/大屏手机
			spacing = [120, 80, 40, 0, 40, 80, 120];
		} else {
			// 桌面端
			spacing = [350, 250, 150, 50, 50, 150, 250];
		}

		$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').stop();
		$('#b1').attr('id','b11');
		$('#b2').attr('id','b22')
		$('#b3').attr('id','b33')
		$('#b4').attr('id','b44')
		$('#b5').attr('id','b55')
		$('#b6').attr('id','b66')
		$('#b7').attr('id','b77')
		$('#b11').animate({top:240, left: vw-spacing[0]},500);
		$('#b22').animate({top:240, left: vw-spacing[1]},500);
		$('#b33').animate({top:240, left: vw-spacing[2]},500);
		$('#b44').animate({top:240, left: vw-spacing[3]},500);
		$('#b55').animate({top:240, left: vw+spacing[4]},500);
		$('#b66').animate({top:240, left: vw+spacing[5]},500);
		$('#b77').animate({top:240, left: vw+spacing[6]},500);
		$('.balloons').css('opacity','0.9');
		$('.balloons h2').fadeIn(1500);
		$(this).fadeOut('slow').delay(2000).promise().done(function(){
			$('#story').fadeIn('slow');
		});
	});
	
	$('#story').click(function(){
		$(this).fadeOut('slow');
		$('.cake').fadeOut('fast').promise().done(function(){
			$('.message').fadeIn('slow');
		});
		
		var i;

		function msgLoop (i) {
			$("p:nth-child("+i+")").fadeOut('slow').delay(800).promise().done(function(){
			i=i+1;
			$("p:nth-child("+i+")").fadeIn('slow').delay(1500);
			if(i==50){
				$("p:nth-child(49)").fadeOut('slow').promise().done(function () {
					$('.cake').fadeIn('fast');
				});
				
			}
			else{
				msgLoop(i);
			}			

		});
			// body...
		}
		
		msgLoop(0);
		
	});
});




//alert('hello');