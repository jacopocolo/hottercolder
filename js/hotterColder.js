function hotterColder() {
	navigator.geolocation.getCurrentPosition(successo,errore,{timeout:10000});
	
	var date =  Math.round(+new Date()/1000);
	var dateIeri = Math.round(+new Date()/1000) - (60 * 60 * 24);
	var oggi = 0;
	var ieri = 0;
	console.log(date);
	console.log(dateIeri);
	
	//FUNZIONE UTILIY: le funzioni che servono per tirare fuori il valore massimo e il valore minimo da un array. Servono per prendere la massima e la minima di oggi
	Array.max = function( array ){
	    return Math.max.apply( Math, array );
	};
	Array.min = function( array ){
	    return Math.min.apply( Math, array );
	};
	
	//FUNZIONE UTILIY: i dati delle api sono in Farenheit. Come li vogliamo noi? In Celsius, e quindi lo convertiamo ogni volta che serve con questa funzione.
	function farenheitToCelsius(x) {
	return Math.round((x -32) * 5 / 9);}
	
	//Questa funzione ritorna, nel caso ci siano probabilità di pioggia superiori al 60%, un avviso che dice che potrebbe piovere. I valori di probabilità sono da 0.0 a 1.0. Ci si può lavorare ancora: per ora fa un loop e, se nella giornata trova anche solo un momento in cui potrebbe piovere, si ferma e lo segna.a 
	function potrebbePiovere() {
	for(x=0; x<23; x++){ 
			if (oggi.hourly.data[x].precipProbability >= 0.80) {
			
			console.log(oggi.hourly.data[x].precipProbability);
			$(document).ready(function() {
				document.getElementById("prob").innerHTML= ' Al ' + oggi.hourly.data[x].precipProbability*100 + '% pioverà.';
				document.getElementById("pioggia").innerHTML= 'Vuoi un consiglio? Prendi l\'<span id="ombrello">ombrello</span>.';
				
				//Questo qui sotto è un workaround. Non riesco a inserire la funzione per aprire il popover della pioggia nella pagina: quando il documento è pronto, la funzione non trova l'oggetto a cui si riferisce e allora non funziona. Così la chiamo da qui, dopo aver creato il suo oggetto;
				openPopover();
			});		
			return;
			}
		}
	}
	
	//È l'ultima funzione che viene eseguita. Quando le query e i calcoli sono a posto, questa funzione viene chiamata e nasconde lo splash screen e mostra lo span hotterOrColder che contiene l'app.
	function showApp() {
	$("#titlescreen, #center-titlescreen").hide();
	$("#hotterOrColder, #popoverOggi, #risultato, #citta, #popoverIeri, #pioggia, #ombrello, #credits").fadeIn();
	}
	
	function getWeather(la, lo, da) {
		var apiKeyForecast = '07f8c1325179caf8a7480120bf808db2';
		var url = 'https://api.forecast.io/forecast/';
		var lati = la;
		var longi = lo;
		var dataUnix = da;
		
		$.getJSON(url+apiKeyForecast+"/"+lati+","+longi+","+dataUnix+"?callback=?", function(data) {
			if (dataUnix === date) {
			oggi = data;
			writeWeather();
			
			}
			
			else {
			ieri = data;
			writeWeather();
			}
		}
	)};
	
	function successo(position) {
	console.log(position.coords.latitude,position.coords.longitude);
	var apiKeyCloudMade = 'c192149735834a479c9a3979c7e4386b';
	/*Questo fa reverse geocoding. Con cloudmade ci sono 100.000 questy gratuite al mese. La Api key è gratuita*/
	$.getJSON('http://beta.geocoding.cloudmade.com/v3/'+apiKeyCloudMade+'/api/geo.location.search.2?format=json&source=OSM&enc=UTF-8&limit=10&q='+position.coords.latitude+';'+position.coords.longitude+'&callback=?', function(dovesei) {
	console.log(dovesei);
	if (dovesei.places[0].city.substring(0,1) == '~') {
		var lunghezza = dovesei.places[0].city.length;
		var citta = dovesei.places[0].city.substring(1, lunghezza);
		document.getElementById("citta").innerHTML='a '+citta+' ';
		}
	});
	
	getWeather(position.coords.latitude,position.coords.longitude, date);
	getWeather(position.coords.latitude,position.coords.longitude, dateIeri);
	};
	
	function errore(position) {
	alert('Non riesco a capire dove sei. La localizzazione è attiva?');
	}; 
	
	function writeWeather() {
	if (oggi !== 0 && ieri !== 0) {
	
		//con un loop prendiamo dal json tutti i valori temperatura e poi estraiamo massima e minima di oggi.
		var arrOggi = [];
		for(x=0; x<23; x++){
		  arrOggi.push(oggi.hourly.data[x].apparentTemperature);
		}
		massimaOggi = Array.max(arrOggi);
		minimaOggi = Array.min(arrOggi);
		
		////con un loop prendiamo dal json tutti i valori temperatura e poi estraiamo massima e minima di ieri.
		var arrIeri = [];
		for(x=0; x<23; x++){
		  arrIeri.push(ieri.hourly.data[x].apparentTemperature);
		}
		massimaIeri = Array.max(arrIeri);
		minimaIeri = Array.min(arrIeri);
		
		//Scrive nell'html i valori massima e minima di oggi e di ieri che finiscono nel PopOver e li converte in Celsius.
		$(document).ready(function() {
			document.getElementById("oggi").innerHTML= ' '+ farenheitToCelsius(massimaOggi)+'°'+' \\ '+farenheitToCelsius(minimaOggi)+'°';
			document.getElementById("ieri").innerHTML= ' '+ farenheitToCelsius(massimaIeri)+'°'+' \\ '+farenheitToCelsius(minimaIeri)+'°';
			});
		
		//Queste qui sotto calcolano la temperatura media di oggi e di ieri, sommando insieme massima e minima e dividendo per due. I dati vengono anche convertiti in Celsius.
		var oggiMedia = (farenheitToCelsius(massimaOggi)+farenheitToCelsius(minimaOggi)) / 2;
		var ieriMedia = (farenheitToCelsius(massimaIeri)+farenheitToCelsius(minimaIeri)) / 2;
		
		//Queste confrontano la media di oggi con la media di ieri.
		var oggiVsIeri = oggiMedia-ieriMedia;
		console.log(oggiVsIeri);
		
		//Questo if / else if decide cosa dire all'utente a seconda della differenza tra media di oggi e media di ieri.
		function calcolaMostra(callback) {
			
			if (oggiVsIeri>2) {
				document.getElementById("risultato").innerHTML='sarà più caldo di';
				$('#wrapper').addClass('piucaldo');
				}
			else if (oggiVsIeri>1 && oggiVsIeri<=2) {
					document.getElementById("risultato").innerHTML='sarà un po\' più caldo di';
					$('#wrapper, #hotterOrColder').addClass('popiucaldo');
				}
			else if (oggiVsIeri>=-1 && oggiVsIeri<=1) {
				document.getElementById("risultato").innerHTML='sarà più o meno come';
				$('#wrapper, #hotterOrColder').addClass('comeieri');
				$('#pioggia, #ieri, #oggi, #prob, .climacon').addClass('comeieri');
				}
			else if (oggiVsIeri<-1 && oggiVsIeri>=-2) {
					document.getElementById("risultato").innerHTML='sarà un po\' più freddo di';
					$('#wrapper, #hotterOrColder').addClass('popiufreddo');
					$('#pioggia, #ieri, #oggi, #prob, .climacon').addClass('POPpopiufreddo');
				}	
			else if (oggiVsIeri<-2) {
				document.getElementById("risultato").innerHTML='sarà più freddo di';
				$('#wrapper, #hotterOrColder, #ombrello, #popoverIeri, #popoverOggi').addClass('piufreddo');
				$('#pioggia, #ieri, #oggi, #prob, .climacon').addClass('POPpiufreddo');
				
				};
				
			callback;
			}
			
		calcolaMostra(showApp());
		potrebbePiovere();
	
	//Qui finisce l'if.
	}
	
	// Questo else qui sotto (commentato al momento) è un modo per controllare che funzioni tutto. Ho bisogno che getWeather sia stata eseguita due volte prima di passare oltre. Quindi controllo che i valori iniziali delle variabili ieri e oggi non siano più entrambi quelli con cui ho iniziato (0), chiamando due volte la funzione come output di getWeather.
	//else {console.log('però sono arrivato qui');}
	};
	
};

