$(window).load(function(){
	$('.loading').fadeOut('fast');
	$('.container').fadeIn('fast');
});
$('document').ready(function(){
		var vw;
		
		$(window).resize(function(){
			if (BalloonSystem && BalloonSystem.updateBounds) {
				BalloonSystem.updateBounds();
			}
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

	// 全新的气球飞行系统
	var BalloonSystem = {
		balloons: [],
		windForce: { x: 0, y: 0 },
		bounds: {},
		animationId: null,
		
		// 初始化系统
		init: function() {
			this.updateBounds();
			this.generateWind();
			
			// 创建气球对象
			for (var i = 1; i <= 7; i++) {
				this.balloons.push({
					id: '#b' + i,
					index: i,
					x: 0, y: 0,
					vx: 0, vy: 0,
					targetX: 0, targetY: 0,
					personality: Math.random(), // 气球个性：0-1，影响飞行风格
					phase: 'hidden', // hidden, rising, floating, flying
					age: 0,
					element: $(this.balloons.length > 0 ? '#b' + i : '#b' + i)
				});
			}
		},
		
		// 更新飞行边界
		updateBounds: function() {
			var screenWidth = $(window).width();
			var screenHeight = $(window).height();
			this.bounds = {
				left: 30,
				right: screenWidth - (screenWidth > 768 ? 120 : 80),
				top: 100,
				bottom: Math.min(screenHeight - 200, 600)
			};
		},
		
		// 生成风力
		generateWind: function() {
			var self = this;
			setInterval(function() {
				// 生成缓慢变化的风力
				self.windForce.x += (Math.random() - 0.5) * 0.2;
				self.windForce.y += (Math.random() - 0.5) * 0.1;
				
				// 限制风力范围
				self.windForce.x = Math.max(-1, Math.min(1, self.windForce.x)) * 0.98;
				self.windForce.y = Math.max(-0.5, Math.min(0.5, self.windForce.y)) * 0.95;
			}, 100);
		},
		
		// 启动气球上升
		launchBalloons: function() {
			var self = this;
			var delays = [100, 300, 200, 500, 150, 400, 250];
			
			this.balloons.forEach(function(balloon, index) {
				setTimeout(function() {
					self.raiseBalloon(balloon);
				}, delays[index]);
			});
			
			// 启动主动画循环
			setTimeout(function() {
				self.startAnimation();
			}, 1500);
		},
		
		// 单个气球上升
		raiseBalloon: function(balloon) {
			var screenWidth = $(window).width();
			var startX = screenWidth * (0.15 + balloon.index * 0.1);
			
			// 设置初始状态
			balloon.x = startX;
			balloon.y = -200;
			balloon.phase = 'rising';
			balloon.targetY = 200 + balloon.personality * 150;
			
			$(balloon.id).css({
				left: balloon.x,
				bottom: balloon.y,
				opacity: 0.6 + balloon.personality * 0.2,
				display: 'block'
			});
		},
		
		// 主动画循环
		startAnimation: function() {
			var self = this;
			
			function animate() {
				self.balloons.forEach(function(balloon) {
					self.updateBalloon(balloon);
				});
				
				self.animationId = requestAnimationFrame(animate);
			}
			
			animate();
		},
		
		// 更新单个气球
		updateBalloon: function(balloon) {
			balloon.age++;
			var dt = 0.016; // 约60fps
			
			switch(balloon.phase) {
				case 'rising':
					this.updateRising(balloon, dt);
					break;
				case 'floating':
					this.updateFloating(balloon, dt);
					break;
				case 'flying':
					this.updateFlying(balloon, dt);
					break;
			}
			
			// 应用位置
			this.applyPosition(balloon);
		},
		
		// 上升阶段
		updateRising: function(balloon, dt) {
			// 向目标高度上升
			var dy = balloon.targetY - balloon.y;
			balloon.vy = dy * 0.02; // 缓慢上升
			balloon.y += balloon.vy;
			
			// 轻微水平摆动
			balloon.vx = Math.sin(balloon.age * 0.05) * balloon.personality;
			balloon.x += balloon.vx;
			
			// 检查是否完成上升
			if (Math.abs(dy) < 10) {
				balloon.phase = 'floating';
				balloon.vy *= 0.5;
			}
		},
		
		// 浮动阶段
		updateFloating: function(balloon, dt) {
			// 浮动一段时间后开始自由飞行
			if (balloon.age > 200) {
				balloon.phase = 'flying';
				this.generateNewTarget(balloon);
				return;
			}
			
			// 温和的浮动
			balloon.vy += Math.sin(balloon.age * 0.02) * 0.1;
			balloon.vx += Math.cos(balloon.age * 0.03) * 0.2;
			
			// 应用风力
			balloon.vx += this.windForce.x * 0.3;
			balloon.vy += this.windForce.y * 0.3;
			
			// 位置衰减
			balloon.vx *= 0.98;
			balloon.vy *= 0.98;
			
			balloon.x += balloon.vx;
			balloon.y += balloon.vy;
		},
		
		// 自由飞行阶段
		updateFlying: function(balloon, dt) {
			// 向目标点移动
			var dx = balloon.targetX - balloon.x;
			var dy = balloon.targetY - balloon.y;
			var distance = Math.sqrt(dx * dx + dy * dy);
			
			if (distance < 50) {
				// 到达目标，生成新目标
				this.generateNewTarget(balloon);
			}
			
			// 个性化飞行速度
			var speed = 0.5 + balloon.personality * 0.5;
			balloon.vx += dx * 0.001 * speed;
			balloon.vy += dy * 0.001 * speed;
			
			// 添加随机扰动
			balloon.vx += (Math.random() - 0.5) * 0.1;
			balloon.vy += (Math.random() - 0.5) * 0.1;
			
			// 应用风力
			balloon.vx += this.windForce.x * (0.5 + balloon.personality);
			balloon.vy += this.windForce.y * (0.5 + balloon.personality);
			
			// 速度限制和衰减
			var maxSpeed = 2 + balloon.personality;
			var currentSpeed = Math.sqrt(balloon.vx * balloon.vx + balloon.vy * balloon.vy);
			if (currentSpeed > maxSpeed) {
				balloon.vx = (balloon.vx / currentSpeed) * maxSpeed;
				balloon.vy = (balloon.vy / currentSpeed) * maxSpeed;
			}
			
			balloon.vx *= 0.99;
			balloon.vy *= 0.99;
			
			balloon.x += balloon.vx;
			balloon.y += balloon.vy;
			
			// 边界反弹
			this.handleBoundaryCollision(balloon);
		},
		
		// 生成新目标
		generateNewTarget: function(balloon) {
			balloon.targetX = this.bounds.left + Math.random() * (this.bounds.right - this.bounds.left);
			balloon.targetY = this.bounds.top + Math.random() * (this.bounds.bottom - this.bounds.top);
		},
		
		// 边界碰撞处理
		handleBoundaryCollision: function(balloon) {
			if (balloon.x < this.bounds.left) {
				balloon.x = this.bounds.left;
				balloon.vx = Math.abs(balloon.vx) * 0.8;
			}
			if (balloon.x > this.bounds.right) {
				balloon.x = this.bounds.right;
				balloon.vx = -Math.abs(balloon.vx) * 0.8;
			}
			if (balloon.y < this.bounds.top) {
				balloon.y = this.bounds.top;
				balloon.vy = Math.abs(balloon.vy) * 0.8;
			}
			if (balloon.y > this.bounds.bottom) {
				balloon.y = this.bounds.bottom;
				balloon.vy = -Math.abs(balloon.vy) * 0.8;
			}
		},
		
		// 应用位置到DOM
		applyPosition: function(balloon) {
			// 计算旋转和缩放
			var rotation = balloon.vx * 3 + Math.sin(balloon.age * 0.02) * 5;
			var scale = 0.95 + Math.sin(balloon.age * 0.03) * 0.05;
			var wobble = Math.sin(balloon.age * 0.04) * 2;
			
			$(balloon.id).css({
				left: balloon.x + wobble,
				bottom: balloon.y,
				transform: 'rotate(' + rotation + 'deg) scale(' + scale + ')',
				opacity: 0.85 + Math.sin(balloon.age * 0.02) * 0.1
			});
		},
		
		// 停止动画
		stop: function() {
			if (this.animationId) {
				cancelAnimationFrame(this.animationId);
				this.animationId = null;
			}
		}
	};

	$('#balloons_flying').click(function(){
		$('.balloon-border').animate({top:-500},8000);
		
		// 初始化并启动新的气球系统
		BalloonSystem.init();
		BalloonSystem.launchBalloons();
		
		// 添加传统的浮动CSS效果作为补充
		setTimeout(function() {
			$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').addClass('balloon-floating');
		}, 1200);
		
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
		// 停止气球飞行系统
		if (BalloonSystem && BalloonSystem.stop) {
			BalloonSystem.stop();
		}
		
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

		// 移除浮动效果，停止所有动画
		$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').removeClass('balloon-floating balloons-rotate-behaviour-one balloons-rotate-behaviour-two').stop();
		
		// 重命名ID并排列
		$('#b1').attr('id','b11');
		$('#b2').attr('id','b22')
		$('#b3').attr('id','b33')
		$('#b4').attr('id','b44')
		$('#b5').attr('id','b55')
		$('#b6').attr('id','b66')
		$('#b7').attr('id','b77')
		
		// 排列成生日快乐的形状
		$('#b11').animate({top:240, left: vw-spacing[0], transform: 'none'},500);
		$('#b22').animate({top:240, left: vw-spacing[1], transform: 'none'},500);
		$('#b33').animate({top:240, left: vw-spacing[2], transform: 'none'},500);
		$('#b44').animate({top:240, left: vw-spacing[3], transform: 'none'},500);
		$('#b55').animate({top:240, left: vw+spacing[4], transform: 'none'},500);
		$('#b66').animate({top:240, left: vw+spacing[5], transform: 'none'},500);
		$('#b77').animate({top:240, left: vw+spacing[6], transform: 'none'},500);
		
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