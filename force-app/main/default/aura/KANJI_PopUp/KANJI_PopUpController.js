({
	/***************************************************
   	** Name : doInit
   	** Purpose : to
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	doInit: function (component, event, helper) {		
        helper.processOnload(component, event, helper);
	},	
	/***************************************************
   	** Name : closePopup
   	** Purpose : to close popup
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
    closePopup: function (component, event, helper) {		
		//console.log('working');
		component.set("v.showPopup", false);
	},
	
})