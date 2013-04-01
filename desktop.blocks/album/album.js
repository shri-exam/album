function Album(options){
	var self = this;
	var elem = options.elem;
	var needGets;	
	var images = {
		imgs:[],
		countImages: 0,
		next:null,
		links:[]
	};	
	var getcount = 0,from,loading = false,widthwrap,first = false,precentOnLoad,half,last,currentSlide,animation=false,lastSlide,countAllImages,widthOfMini,widthOfMiniWrap,jqCurrentSlide,answer,inProcess = false;
	var albumImageWrap = $('.album-image-wrap');
	var albumItem = $('.album-image-list__item');
	var indexCur =0;
	var control = $('.album__control');
	var controlCtx = $.proxy(controlCtx, control );
		
	window.localStorageAlias = window.localStorage;
	if (document.all && !window.localStorage)
	{
	    window.localStorageAlias = {};
	    window.localStorageAlias.removeItem = function () { };
	}


	$('.album-image-wrap').scroll(function(e) {			
		if($(this).scrollLeft() >= precentOnLoad && loading == false){						
			getNextLinks(images.next);
		}
	});

	elem.on('keyup',function(e){
		 if (e.keyCode == 37 && animation == false && currentSlide >= 1) {
		 	setCurrent(--currentSlide);	
		 	e.preventDefault();
	    }		   
	})

	elem.on('keyup',function(e){	
	    if (e.keyCode == 39  && animation == false  && currentSlide <= images.countImages -2) { 	
			setCurrent(++currentSlide);
			e.preventDefault();	
	    } 	 
	})

	elem.on('keydown',function(e){	
	    if (e.keyCode == 39  || e.keyCode == 37) {			
			e.preventDefault();	
	    } 	 
	})

	$(window).on('resize', function(){
		half = elem.width()/2;		
		centerSlide(jqCurrentSlide);		
	 	(images.countImages*140)/(elem.width());
		setImageBarWidth(albumImageWrap);
	})
	var checker;
	function centerSlide(image){
		inProcess = true;
		var d = $.Deferred();
		
		jqCurrentSlide.attr('src',images.imgs[currentSlide].large);		
		half = elem.width()/2;
		$('.album__loader').addClass('album__loader_loading_yes')
			checker = window.setInterval(function(){
				console.log(image[0].complete)				
			 	if(image[0].complete == true && inProcess == true ){
			 		image.css({				 			
						left: (half-image.width()/2 < 0)? 0 : half-image.width()/2+'px'						
					})
					clearInterval(checker);	
					$('.album__loader').removeClass('album__loader_loading_yes');					
					inProcess = false;
					d.resolve(); 		
			 	} 
			},100)		
		return d.promise();
	}
	elem.on('mousewheel','.album-image-wrap',function(event, delta){
		this.scrollLeft -= (delta * 30);   
		event.preventDefault();
	});	
	elem.on('click','.album-image-list__item:not(.album-image-list__item_type_current)', setCurrent);	
	$('.album__control_type_prev').click(function(){	
		if(animation == false){
			setCurrent(--currentSlide);	
		}				
	})
	$('.album__control_type_next').click(function(){
		if(animation == false){	
			setCurrent(++currentSlide);	
		}			
	})
	function pushImages(data){
	console.log('pushImages')		
		$.each(data.entries, function(index, value) { 
			var image={
				large: null,
				min: null,
				height: null,
				width: null,
				from: null
			};			  				
			image.large = (typeof value.img.XL == "undefined")? value.img.L.href  : value.img.XL.href;
			image.height = (image.large == value.img.L.href)?  value.img.L.height : image.width = value.img.XL.width;
			image.min = value.img.S.href;
			image.from = data.links.next;
			images.imgs.push(image);
		});			
		insert(images);
	}

	function getNextLinks(nextLink){		
		loading = true;
		if(needGets >= getcount || first ==true){
			 var z = $.getJSON(nextLink+'&callback=?',function(data){				
				answer = data;			
				images.countImages = data.imageCount
				needGets = Math.ceil(images.countImages / 100)-1;
				images.next = data.links.next;
				images.links.push(data.links.next);			
				images.countImages = data.imageCount;							
				all = data.entries.length;	
				console.log(data)
				var imagesArray = data.entries
				pushImages(data);
				loading = false;	
			})
		}
		return z;
	}	

	function insert(images){
		var imgList = elem.find('.album-image-list');
		$.each(answer.entries,function(index,value){
			var item = $('<li>').addClass('album-image-list__item');
			var minImg = $('<img>').addClass('image_type_mini').attr('src',value.img.S.href);
			imgList.append(item.html(minImg));
			var slide = $('<img>').addClass('album__slide');
			elem.prepend(slide);					
		})	
		getcount++;
		widthOfMini = $('.album-image-list__item').outerWidth(true);
		countAllImages = $('.album__slide').length;			
		widthwrap = $('.album-image-list').width();
		widthOfMiniWrap = countAllImages*widthOfMini;		
		$('.album-image-list').width(widthOfMiniWrap);		
		widthwrap = $('.album-image-list').width();		
		precentOnLoad = widthwrap/2;
						
	}
	function setImageBarWidth(albumImageWrap){
		albumImageWrap.width(elem.width());
	}

	function animationOnClick(index){			
		var spaceBefore = index * widthOfMini;
				
		$('.album-image-wrap').animate( { scrollLeft: spaceBefore - half + 100 }, 400,function(){ 		
			animation = false;		
		});
	} 
	function controlCtx(){
		return $(this);
	}
	function setCurrent(indexOfSlide){
		if(animation == false){	
			if(inProcess == true){
				clearInterval(checker);
			}			
			animation = true;
			half = elem.width()/2;			
			var that = this; 
			thisIndex = $(this).index();
			currentSlide = (typeof indexOfSlide.target == "undefined")? indexOfSlide : thisIndex;
			localStorageAlias.theLastSlide = (currentSlide <= 99)? currentSlide : 0 ;			
			localStorageAlias.allLinks = images.links;

			switch(currentSlide)
			{
			case 0:				
				$('.album__control_type_prev').removeClass('album__control_show_yes');
				break;
			case images.countImages-1:
				$('.album__control_type_next').removeClass('album__control_show_yes');		  
				break;
			default:
				var newThis	= controlCtx()
				$( newThis ).each(function( index ) {
  					if(!$(this).hasClass('album__control_show_yes')){
  						$(this).addClass('album__control_show_yes');
  					}
  				})				
			}

			jqCurrentSlide = $('.album__slide').eq(currentSlide);			
			half = $(window).width()/2;
			$.when(centerSlide(jqCurrentSlide)).pipe(function(){
				$('.album__loader').removeClass('album__loader_loading_yes')			
				jqCurrentSlide.addClass('album__slide_type_current');
			})			
			
			if(typeof last === "undefined"){
	 			last = $(this)	 		
			}else{			
				last.removeClass('album-image-list__item_type_current');			
				last = $(this);					
			}
			last = $('.album-image-list__item').eq(currentSlide).addClass('album-image-list__item_type_current');
			animationOnClick(currentSlide);
			if(typeof lastSlide === "undefined"){
	 			lastSlide = $('.album__slide').eq(currentSlide).addClass('album__slide_type_current');
			}else{
				var number = lastSlide.index()				
				lastSlide = $('.album__slide').eq(currentSlide);
				var out = $('.album__slide').eq(number)
				half = elem.width()/2;				 	
			 	out.fadeOut('slow').removeClass('album__slide_type_current');		
		}	
	}	

	}
	function start(){				
		setImageBarWidth(albumImageWrap);	
		first = true;
		$.when(getNextLinks('http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json')).then(function(){
			setCurrent(localStorageAlias.theLastSlide || 0)	
			if(currentSlide==0){
				$('.album__control_type_prev').removeClass('album__control_show_yes')
			}	
		});			
	};
	start();
	
}
$(function(){	
	new Album({
		elem : $('.album')
	});			
})


