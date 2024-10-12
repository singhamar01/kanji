({
    /***************************************************
   	** Name : processOnload
   	** Purpose : to processOnload
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
    processOnload : function(component, event, helper) {
        //----------------------------------------//
        //
		let mode = component.get('v.mode');
        //----------------------------------------//
        //      
        if(mode == 'stroke'){
            let element = component.get('v.element');
            //----------------------------------------//
            //
            const url = new URL(window.location.href);
            const resourceRelPath = $A.get('$Resource.Kanji_Content');
            const resourceUrl = `${url.origin}${resourceRelPath}`+'/kanji/stroke/kanji_'+element.key+'.html';
            console.log('resource url :'+resourceUrl);
            window.fetch(resourceUrl)
            .then($A.getCallback((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }else{
                    response.text().then($A.getCallback((svg) => {
                        component.set('v.strokeContent', svg);
                    }));
                }
                
            })).catch($A.getCallback((error) => {
                console.error('Fetch Error :-S', error);
            }));
        }
	},
    /***************************************************
   	** Name : addListeners
   	** Purpose : to processOnload
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
    addListeners : function (component, event, helper){
        var popup_element = component.find("popup");           
        popup_element.getElement().addEventListener("click", $A.getCallback(function(){
            console.log('Hello World');
        }));
        
    }
})