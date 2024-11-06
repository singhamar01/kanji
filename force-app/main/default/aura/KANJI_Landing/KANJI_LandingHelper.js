({
	/***************************************************
	** Name : SWIPE_OBJECT
	** Purpose :
	** Created by :
	** Update by :	
	*****************************************************/	 
	SWIPE_OBJECT:{
		xDown : null,
		yDown : null
	},                                                        
	KANJI_DATA : null,
    /***************************************************
   	** Name : showToast
   	** Purpose : to show toast
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	fetchPharseList : function(component, event, helper) {
		const url = new URL(window.location.href);
        const resourceRelPath = $A.get('$Resource.Kanji_Content');
        const resourceUrl = `${url.origin}${resourceRelPath}`+'/kanji/detail/kanji_list.json';
        window.fetch(resourceUrl)
        .then($A.getCallback((response) => {
            if (!response.ok) {
            	throw new Error(`HTTP error, status = ${response.status}`);
            }
            response.json().then($A.getCallback((data) => {
				//---------------------------------------//
				data.forEach(element => {
					element.examples.forEach(example_row =>{
						if(example_row.sentence != undefined){
							example_row.sentence = example_row.sentence.replaceAll(example_row.example.trim(),'<span class="highlighter">'+example_row.example.trim()+'<sup>'+example_row.example_reading.trim()+'</sup></span>');
							example_row.sentence_reading = example_row.sentence_reading.replaceAll(example_row.example_reading.trim(),'<span class="reading_highlighter">'+example_row.example_reading.trim()+'</span>');
						}
					});
				});
				//---------------------------------------//
            	component.set('v.pharseList', data);
				this.KANJI_DATA = data;
				component.set('v.displayPharseList', data);		
				component.set('v.display_count', data.length+'');
        	}));
        })).catch($A.getCallback((error) => {
            console.error('Fetch Error :-S', error);
        }));
	},
	/***************************************************
   	** Name : fetchPharseListFromGSheet
   	** Purpose : to show toast
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	fetchPharseListFromGSheet : function(component, event, helper) {
		let localContext = this;
		const gsheet_id = $A.get("$Label.c.GSHEET_ID"); 
		const gsheet_key = $A.get("$Label.c.GSHEET_KEY"); 
		//console.log('::'+gsheet_id);
		//console.log('::'+gsheet_key);
		const sheetEndpoint = "https://www.googleapis.com/drive/v3/files/"+gsheet_id+"/export?mimeType=application%2Fvnd.openxmlformats-officedocument.spreadsheetml.sheet&key="+gsheet_key;    
		fetch(sheetEndpoint).then(function(response){
			return response.arrayBuffer();
		}).then($A.getCallback((buffer) => {
			let workbook = XLSX.read(buffer);						
			let data = localContext.prepareJSON(workbook);
			//console.log(JSON.stringify(data));
			//---------------------------------------//
			data.forEach(element => {				
				element.examples.forEach(example_row =>{
					if(example_row.sentence != undefined){
						example_row.sentence = example_row.sentence.replaceAll(example_row.example.trim(),'<span class="highlighter">'+example_row.example.trim()+'<sup>'+example_row.example_reading.trim()+'</sup></span>');
						example_row.sentence_reading = example_row.sentence_reading.replaceAll(example_row.example_reading.trim(),'<span class="reading_highlighter">'+example_row.example_reading.trim()+'</span>');
					}
				});
			});
			
			//---------------------------------------//
			localContext.calculate(component, data);
			
		}));		
	},
     /***************************************************
   	** Name : calculate
   	** Purpose : to show toast
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
    calculate : function(component, data) {
            component.set('v.pharseList', data);
        console.log('iteration done in calculate');
			this.KANJI_DATA = data;
			console.log('iteration done');
			component.set('v.displayPharseList', data);		
			component.set('v.display_count', data.length+'');
    },
	/***************************************************
   	** Name : prepareJSON
   	** Purpose : to show toast
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	prepareJSON : function(workbook) {
		let detail_data = XLSX.utils.sheet_to_json(workbook.Sheets['detail']);        
        //-----------------------------------------------//
        //fetching [example] sheet
        let example_data = XLSX.utils.sheet_to_json(workbook.Sheets['example']);      
		//-----------------------------------------------//
        //creating map using [key]
        let detail_data_MAP = Object.groupBy(detail_data, function( item){return item.key;}); 
        let example_data_MAP = Object.groupBy(example_data, function( item){return item.key;});
		//------------------------------------------------//
		let jsonDataList = [];        
        //Object.keys(detail_data_MAP).forEach( async (key, logIndex) =>{              
        for(let key of Object.keys(detail_data_MAP)) {          
            let element = detail_data_MAP[key][0];//since group creates array            
			delete element['row_num'];
			delete element['stroke_parse'];
			element['examples'] = (example_data_MAP[key] != undefined)?example_data_MAP[key]:[];
			element.kunyomi = (element.kunyomi != undefined)?element.kunyomi.split('\r\n'):[];
			element.onyomi = (element.onyomi != undefined)?element.onyomi.split('\r\n'):[];
			element.example_count = element.examples.length;
			jsonDataList.push(element);            
        }
        //------------------------------------------------//
        return jsonDataList; 
	},
	/***************************************************
   	** Name : slide
   	** Purpose : to slide
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	slide : function(component, event, helper, isNext) {
		//----------------------------------
		//getting carousel_index index
		let carousel_index = parseInt(component.get('v.carousel_index'),10);
		let display_count = parseInt(component.get('v.display_count'), 10);
		//----------------------------------
		//calculating updated carousel_index
		let transition_factor = isNext ? 1 : -1;
		carousel_index += transition_factor;
		//----------------------------------
		//if within range
		if(carousel_index >= 0 && carousel_index < display_count){			
			let carousel_tranlateX = carousel_index * 100 * -1;		
			console.log(carousel_tranlateX);
			component.set('v.carousel_tranlateX', carousel_tranlateX+'');
			component.set('v.carousel_index', carousel_index+'');
		}
		
	},
	/***************************************************
   	** Name : openPopup
   	** Purpose : to show popup
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	openPopup : function(component, event, helper) {
		//let element_row_indx = event.currentTarget.value;
		let element_row_indx = parseInt(component.get('v.carousel_index'),10);		
		let mode = event.currentTarget.name;		
		let focusedElement = component.get('v.displayPharseList')[element_row_indx];
		component.set('v.mode', mode);
		component.set('v.focusedElement', focusedElement);
		component.set("v.showPopup", true);
	},
	/***************************************************
   	** Name : showToast
   	** Purpose : to show toast
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	showToast : function(component, type, title, message) {
		var toastEvent = $A.get("e.force:showToast");
		toastEvent.setParams({
			"type" : type,
			"title": title,
			"message": message
		});
		toastEvent.fire();
	},
	/***************************************************
   	** Name : showToast
   	** Purpose : to show toast
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/
	handleTouchStart : function(component, event, helper) {		
		const firstTouch = (event.touches)[0];                                      
		this.SWIPE_OBJECT.xDown = firstTouch.clientX;                                      
		this.SWIPE_OBJECT.yDown = firstTouch.clientY;                                      
	},
	/***************************************************
   	** Name : handleTouchMove
   	** Purpose : to show toast
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/
	handleTouchMove : function(component, event, helper) {
		//--------------------------------------//
		if ( ! this.SWIPE_OBJECT.xDown || ! this.SWIPE_OBJECT.yDown ) {
			return;
		}
		//--------------------------------------//
		let xUp = event.touches[0].clientX;                                    
		let yUp = event.touches[0].clientY;
		//--------------------------------------//
		let xDiff = this.SWIPE_OBJECT.xDown - xUp;
		let yDiff = this.SWIPE_OBJECT.yDown - yUp;
		//--------------------------------------//
		//when horizontal swipe
		if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
			if ( xDiff > 0 ) {
				//--------------------------------------//
				/* right swipe */ 
				this.slide(component, event, helper, true);
			} else {
				//--------------------------------------//
				/* left swipe */
				this.slide(component, event, helper, false);
			}                       
		}else{//when vertical swipe
			if ( yDiff > 0 ) {
				//--------------------------------------//
				/* down swipe */ 
			} else { 
				//--------------------------------------//
				/* up swipe */
			}                                                                 
		}
		//--------------------------------------//
		/* reset values */
		this.SWIPE_OBJECT.xDown = null;
		this.SWIPE_OBJECT.yDown = null;
	},
	/***************************************************
   	** Name : handleSearch
   	** Purpose : to handleSearch
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/	
	handleSearch : function(component, event, helper) {
		let searchValue = event.currentTarget.value;	
		//console.log('search calling');	
		//let kanji_data = component.get('v.pharseList');
		let kanji_data = this.KANJI_DATA;
		let searched_result = kanji_data.filter(function(item){
			let return_param = false;
			if(
				(item.key != undefined && item.key.includes(searchValue) )
				|| (item.kunyomi != undefined && item.kunyomi.toString().toLowerCase().includes(searchValue.toLowerCase()))
				|| (item.onyomi != undefined && item.onyomi.toString().toLowerCase().includes(searchValue.toLowerCase()))
				|| (item.complexity != undefined && item.complexity.toLowerCase().includes(searchValue.toLowerCase()))
				|| (item.help_text != undefined && item.help_text.toLowerCase().includes(searchValue.toLowerCase()))
				|| (item.level != undefined && item.level == searchValue)
				|| (item.examples != undefined && JSON.stringify(item.examples).toLowerCase().includes(searchValue.toLowerCase()))
			){
				//--------------------------------//
				return_param = true;
			}
			return return_param;
		});
		//console.log(';;'+JSON.stringify(searched_result));
		let resultSet = (searched_result != undefined)?searched_result:[];	
		//---------------------------------------------------//
		let highlightedResultSet = [];
		if(searchValue != undefined && searchValue.length>0){
			resultSet.forEach((item) =>{
				let itemString = JSON.stringify(item);
				itemString = itemString.replaceAll(searchValue,'<mark>'+searchValue+'</mark>');				
				highlightedResultSet.push(JSON.parse(itemString));
			});
		}
		else{
			highlightedResultSet = resultSet;
		}
		//---------------------------------------------------//
		component.set('v.displayPharseList', highlightedResultSet);		
		component.set('v.display_count', highlightedResultSet.length+'');		
		this.resetSearch(component, event, helper);
	},
	/***************************************************
   	** Name : resetSearch
   	** Purpose : to resetSearch
   	** Created by :SAMYA 
   	** Updated by :   	
   	*****************************************************/
	resetSearch: function(component, event, helper) {		
		component.set('v.carousel_index', '0');
		component.set('v.carousel_tranlateX', '0');
	},

})