({
	/***************************************************
   	** Name : doInit
   	** Purpose : to decide mode whether edit of page or view
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	doInit: function (component, event, helper) {
		var inDesignMode = document.location.href.toLowerCase().indexOf( 'commeditor' ) >= 0;
		component.set("v.inDesignMode", inDesignMode);	        
        helper.fetchPharseList(component, event, helper);
	},
	/***************************************************
   	** Name : doSearch
   	** Purpose : to decide mode whether edit of page or view
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	doSearch: function (component, event, helper) {		
        helper.handleSearch(component, event, helper);
	},
	/***************************************************
   	** Name : doPrevious
   	** Purpose : to navigate to slide
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	doPrevious: function (component, event, helper) {
		helper.slide(component, event, helper, false);
	},
	/***************************************************
   	** Name : doNext
   	** Purpose : to navigate to slide
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	doNext: function (component, event, helper) {
		helper.slide(component, event, helper, true);
	},
	/***************************************************
   	** Name : touchStart
   	** Purpose : to navigate to slide using swipe
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	touchStart: function (component, event, helper) {				
		if($A.get("$Browser.isPhone")){
			helper.handleTouchStart(component, event, helper);
		}
	},
	/***************************************************
   	** Name : touchMove
   	** Purpose : to navigate to slide using swipe
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	touchMove: function (component, event, helper) {		
		if($A.get("$Browser.isPhone")){		
			helper.handleTouchMove(component, event, helper);
		}
	},
	/***************************************************
   	** Name : openPopup
   	** Purpose : to navigate to site landing page
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	openPopup: function (component, event, helper) {		
		helper.openPopup(component, event, helper);		
	},
})