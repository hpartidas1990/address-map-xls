/**
	Utility script
	
	@author Heiroon Partidas
	@since 2017
**/

Utils = {
		
		/**
		 * A default criteria to close the search to an specific location
		 * 
		 * @param defaultCriteria
		 * @default ", Málaga, España"
		 */
		defaultCriteria : ", Málaga, España",
		/*
		 * @param map
		 * Used to store map object
		 */
		map : null,
		/**
		 * @param geocoder
		 * @default null
		 */
		geocoder : null,
		/**
		 * @param currSec
		 * @default ""
		 */
		currSec : "",
		
		setCurrSec : function(sec){
			this.currSec = sec;
		},
		
		getCurrSec : function(){
			return this.currSec;
		},
		
		/**
		 * @param currColor
		 * @default ""
		 */
		currColor : "",
		
		setCurrColor : function(color){
			this.currColor = color;
		},
		
		getCurrColor : function(){
			return this.currColor;
		},
		
		/*
		 * Initializing map object 
		 * 
		 * @method initMap
		 * @return void
		 */
		initMap : function(){
			console.log("initMap");
			
			var _self = this;
				_self.map = new GMaps({
			        div: '#google-map',
			        zoom: 9,
			        lat: 36.7183391,
			        lng: -4.5193074,
			        scrollwheel: false
			    });
				
				_self.geocoder = new google.maps.Geocoder();
		},
		
		/**
		 * A metod that iterates the json and executes actions for each register
		 * 
		 * @method setPinsOnMap
		 * @return void/boolean
		 */
		setPinsOnMap : function(jsonStr){
			
			var _self = this;
			
			try {
				
				var data = JSON.parse(jsonStr);
				if(	data != null && typeof(data) === "object"){
					data.sort(_self.sortBy("seccion"));
					
					for(var i = 0; i < data.length; i++){
						
						_self.setCurrSec(data[i].seccion);
						_self.codeAddress(data[i]);
					}
				}
				
		    } catch (e) {
		        return false;
		    }
		},
		
		/**
		 * A method that sends the requests to the geocoding server, and process the results
		 * 
		 * @method codeAddress
		 * @return void
		 */
		codeAddress : function(data){
			
			var _self = this;
			var color = _self.getColor(data.seccion);
			var direccion = data.direccion + _self.defaultCriteria;
			
			setTimeout(function() {
			
				_self.geocoder.geocode({
			        'address': direccion
			    }, function(results, status) {
			    	
			        if (status === google.maps.GeocoderStatus.OK) {
			        	
			            var result = results[0].geometry.location;
			            
			            _self.map.addMarker({
							  lat: result.lat(),
					       	  lng: result.lng(),
							  title: direccion,
							  icon: {
							        path: google.maps.SymbolPath.CIRCLE,
							        strokeColor: color,
							        fillColor: color,
							        scale: 4
							  },
							  infoWindow: {
								  content: _self.getCloudInfo(data)
							  }
						});
			            
			        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
		        		setTimeout(function() {
			            	_self.codeAddress(data);
			            }, 900);
			            
			        } else {
			            console.log("Geocode was not successful for the following reason: " + status);
			        }
			    });
				
			}, 200);
		},
		
		/**
		 * Method that sorts the received JSON by some specified criteria.
		 * 
		 * @method sortBy
		 * @return ínt 
		 */
		sortBy : function(prop){
		   return function(a,b){
		      if( a[prop] > b[prop]){
		          return 1;
		      }else if( a[prop] < b[prop] ){
		          return -1;
		      }
		      return 0;
		   }
		},
		
		/**
		 * Returns a new color for the markers
		 * 
		 * @method getColor
		 * @return string
		 */
		getColor : function(sec){
			var _self = this;
			var current_section = _self.getCurrSec();
			
			//console.log(current_section + ' - ' + sec);
			
			if( current_section != sec){
				//console.log("creando nuevo color");
				_self.setCurrColor(randomColor({luminosity: 'dark'}));
				return _self.getCurrColor();
			}
			
			return _self.getCurrColor();
		},
		
		/**
		 * Returns the inner html for the cloud
		 * 
		 * @method getCloudInfo
		 * @return string
		 */
		getCloudInfo : function(data){
			return '<p>' + data.seccion + ' - ' + data.nombre + '<br><b>Dirección</b>: ' + data.direccion + '</p>';
		}
		
}
