Clock = {

	'Init': function()
	{
	
		Clock.UI.Render();
		
		
		ClockInterval = window.setInterval(Clock.UI.UpdateHands, 10);
	
	},
	
	'Time': function()
	{
	
		Now = new Date();
		
		return Now;
	
	},
	
	'Math':
	{
	
		'toDegrees': function(RadAngle)
		{
		
			return RadAngle * (180 / Math.PI);
		
		},
		
		'toRadians': function(DegAngle)
		{
		
			return DegAngle * (Math.PI / 180);
		
		}
	
	},
	
	'CalculateEvent': function(Event, WestLongitude, NorthLatitude)
	{
	
		Date.prototype.getDOY = function() { var onejan = new Date(this.getFullYear(),0,1); return Math.ceil((this - onejan) / 86400000);
}
	
		Now = new Date();
		
		latitude = NorthLatitude;
		longitude = WestLongitude;
		
		zenith = 90; //civil=96, official=90
		
	
		//1. first calculate the day of the year
			N=Now.getDOY();

		//2. convert the longitude to hour value and calculate an approximate time
			lngHour = longitude / 15;
			
			if(Event == 'rise') t = N + ((6 - lngHour) / 24);
			if(Event == 'set') t = N + ((18 - lngHour) / 24);

		//3. calculate the Sun's mean anomaly
			M = (0.9856 * t) - 3.289;

		//4. calculate the Sun's true longitude
			L = M + (1.916 * Math.sin(Clock.Math.toRadians(M))) + (0.020 * Math.sin(Clock.Math.toRadians(2 * M))) + 282.634;
				//NOTE: L potentially needs to be adjusted into the range [0,360) by adding/subtracting 360
				if(L < 0) L += 360;
				if(L >= 360) L -= 360;

		//5a. calculate the Sun's right ascension
			RA = Clock.Math.toDegrees(Math.atan(0.91764 * Math.tan(Clock.Math.toRadians(L))));
				//NOTE: RA potentially needs to be adjusted into the range [0,360) by adding/subtracting 360
				if(RA < 0) RA += 360;
				if(RA >= 360) RA -= 360;

		//5b. right ascension value needs to be in the same quadrant as L
			Lquadrant  = (Math.floor( L/90)) * 90;
			RAquadrant = (Math.floor(RA/90)) * 90;
			RA = RA + (Lquadrant - RAquadrant);

		//5c. right ascension value needs to be converted into hours
			RA = RA / 15;

		//6. calculate the Sun's declination
			sinDec = 0.39782 * Math.sin(Clock.Math.toRadians(L));
			cosDec = Math.cos(Clock.Math.toRadians(Clock.Math.toDegrees(Math.asin(sinDec))));

		//7a. calculate the Sun's local hour angle
			cosH = (Math.cos(Clock.Math.toRadians(zenith)) - (sinDec * Math.sin(Clock.Math.toRadians(latitude)))) / (cosDec * Math.cos(Clock.Math.toRadians(latitude)));
			
			//if (cosH >  1) 
			//  the sun never rises on this location (on the specified date)
			//if (cosH < -1)
			//  the sun never sets on this location (on the specified date)

		//7b. finish calculating H and convert into hours
			if(Event == 'rise') H = 360 - Clock.Math.toDegrees(Math.acos(cosH));
			if(Event == 'set') H = Clock.Math.toDegrees(Math.acos(cosH));
			
			H = H / 15

		//8. calculate local mean time of rising/setting
			T = H + RA - (0.06571 * t) - 6.622;

		//9. adjust back to UTC
			UT = T - lngHour;
				//NOTE: UT potentially needs to be adjusted into the range [0,24) by adding/subtracting 24'
				if(UT < 0) UT += 24;
				if(UT >= 24) UT -= 24;

		//10. convert UT value to local time zone of latitude/longitude
			localOffset = -7
			localT = UT + localOffset;
				if(localT < 0) localT += 24;
				if(localT >= 24) localT -= 24;
			
		return localT % 24;
	
	},
	
	'UI': {
	
		'SVGNS': 'http://www.w3.org/2000/svg',
	
		'Render': function()
		{
		
			//ClockContainer
			ClockContainer = document.createElement('div');
			ClockContainer.setAttribute('id', 'ClockContainer');
		
			//AnalogClock
			AnalogClock = document.createElement('div');
			AnalogClock.setAttribute('id', 'AnalogClock');
			
			//DigitalClock
			DigitalClock = document.createElement('div');
			DigitalClock.setAttribute('id', 'DigitalClock');
			
			//fill DigitalClock
			Sunrise = document.createElement('div');
			Sunrise.innerHTML = 'SUNRISE: ' + Clock.CalculateEvent('rise',-122.3,47.45);
			Sunset = document.createElement('div');
			Sunset.innerHTML = 'SUNSET: ' + Clock.CalculateEvent('set',-122.3,47.45);
			
			DigitalClock.appendChild(Sunrise);
			DigitalClock.appendChild(Sunset);
			
			//fill ClockContainer
			ClockContainer.appendChild(AnalogClock);
			ClockContainer.appendChild(DigitalClock);
			
			//fill body
			document.body.appendChild(ClockContainer);
			
			Clock.UI.RenderAnalogClock();
		
		},
		
		'RenderAnalogClock': function()
		{
		
			SVGElement = document.createElementNS(Clock.UI.SVGNS, 'svg');
			
			Shape = document.createElementNS(Clock.UI.SVGNS, 'circle');
			Shape.setAttributeNS(null, 'cx', 210);
			Shape.setAttributeNS(null, 'cy', 210);
			Shape.setAttributeNS(null, 'r',  200);
			Shape.setAttributeNS(null, 'stroke',  'black');
			Shape.setAttributeNS(null, 'stroke-width',  4);
			//Shape.setAttributeNS(null, 'fill', '#FFFF80');
			Shape.setAttributeNS(null, 'fill', 'white');
			
			SVGElement.appendChild(Shape);
			
			//Test Shade
			Shade = document.createElementNS(Clock.UI.SVGNS, 'path');
			//Shade.setAttributeNS(null, 'fill', '#8080FF');
			Shade.setAttributeNS(null, 'fill', 'silver');
			PathString = 'M210 210';
			/**for(Hour = Clock.CalculateEvent('set',-122.3,47.45); Hour < Clock.CalculateEvent('rise',-122.3,47.45) + 24; Hour += .01)
			{
			
				Coordinates = Clock.UI.PolarToCartesian(198.6, Clock.UI.ClockAngle('hour', Hour));
			
				PathString = PathString + ' S' + (Coordinates.X + 210) + ' ' + (Coordinates.Y + 210) + ' ' + (Coordinates.X + 210) + ' ' + (Coordinates.Y + 210);
			
			}*/
			
			ArcStart = Clock.UI.PolarToCartesian(198.6, Clock.UI.ClockAngle('hour', Clock.CalculateEvent('set',-122.3,47.45)));
			ArcEnd = Clock.UI.PolarToCartesian(198.6, Clock.UI.ClockAngle('hour', Clock.CalculateEvent('rise',-122.3,47.45)));
			
			PathString = PathString + ' L' + (ArcStart.X + 210) + ',' + (ArcStart.Y + 210);
			
			PathString = PathString + ' A198.6,198.6 ' + '0' + ' 1,1 ' + (ArcEnd.X + 210) + ',' + (ArcEnd.Y + 210);
			
			PathString = PathString + ' L210 210 Z';
			
			Shade.setAttributeNS(null, 'd', PathString);
			
			SVGElement.appendChild(Shade);
			
			
			for(Counter = 0; Counter < 24; Counter ++)
			{
			
				Coordinates = Clock.UI.PolarToCartesian(150, Clock.UI.ClockAngle('hour', Counter));
			
				ClockMarker = document.createElementNS(Clock.UI.SVGNS, 'circle');
				ClockMarker.setAttributeNS(null, 'cx', Coordinates.X + 210);
				ClockMarker.setAttributeNS(null, 'cy', Coordinates.Y + 210);
				ClockMarker.setAttributeNS(null, 'r', 12);
				ClockMarker.setAttributeNS(null, 'stroke', 'black');
				ClockMarker.setAttributeNS(null, 'stroke-width', 2);
				ClockMarker.setAttributeNS(null, 'fill', 'white');
				if(Counter == 0) ClockMarker.setAttributeNS(null, 'fill', '#8080FF');
				if(Counter == 12) ClockMarker.setAttributeNS(null, 'fill', '#FFFF80');
				
				Numeral = document.createElementNS(Clock.UI.SVGNS, 'text');
				TextLocation = Clock.UI.PolarToCartesian(145, Clock.UI.ClockAngle('hour', 12));
				Numeral.setAttributeNS(null, 'id', 'Numeral');
				Numeral.textContent = Counter;
				Numeral.setAttributeNS(null, 'text-anchor', 'middle');
				Numeral.setAttributeNS(null, 'transform', 'rotate(' + 15 * ((Counter + 12) % 24) + ', 210, 210)');
				Numeral.setAttributeNS(null, 'x', TextLocation.X + 210);
				Numeral.setAttributeNS(null, 'y', TextLocation.Y + 210);
				
				SVGElement.appendChild(ClockMarker);
				SVGElement.appendChild(Numeral);
			
			}
			
			for(Counter = 0; Counter < 60; Counter ++)
			{
			
				LineLength = 8;
				if(Counter % 5 == 0) LineLength = 16;
			
				InnerCoordinates = Clock.UI.PolarToCartesian(200 - LineLength, Clock.UI.ClockAngle('minute', Counter));
				OuterCoordinates = Clock.UI.PolarToCartesian(200, Clock.UI.ClockAngle('minute', Counter));
			
				ClockMarker = document.createElementNS(Clock.UI.SVGNS, 'line');
				ClockMarker.setAttributeNS(null, 'x1', InnerCoordinates.X + 210);
				ClockMarker.setAttributeNS(null, 'y1', InnerCoordinates.Y + 210);
				ClockMarker.setAttributeNS(null, 'x2', OuterCoordinates.X + 210);
				ClockMarker.setAttributeNS(null, 'y2', OuterCoordinates.Y + 210);
				ClockMarker.setAttributeNS(null, 'stroke', 'black');
				ClockMarker.setAttributeNS(null, 'stroke-width', 4);
				
				SVGElement.appendChild(ClockMarker);
			
			}
			
			//HourHand
			OuterCoordinates = Clock.UI.PolarToCartesian(135, Clock.UI.ClockAngle('hour', Clock.Time().getHours()));
			HourHand = document.createElementNS(Clock.UI.SVGNS, 'line');
			HourHand.setAttributeNS(null, 'id', 'HourHand');
			HourHand.setAttributeNS(null, 'x1', 210);
			HourHand.setAttributeNS(null, 'y1', 210);
			HourHand.setAttributeNS(null, 'x2', OuterCoordinates.X + 210);
			HourHand.setAttributeNS(null, 'y2', OuterCoordinates.Y + 210);
			HourHand.setAttributeNS(null, 'stroke', 'black');
			HourHand.setAttributeNS(null, 'stroke-width', 8);
			
			//MinuteHand
			OuterCoordinates = Clock.UI.PolarToCartesian(180, Clock.UI.ClockAngle('minute', Clock.Time().getMinutes()));
			MinuteHand = document.createElementNS(Clock.UI.SVGNS, 'line');
			MinuteHand.setAttributeNS(null, 'id', 'MinuteHand');
			MinuteHand.setAttributeNS(null, 'x1', 210);
			MinuteHand.setAttributeNS(null, 'y1', 210);
			MinuteHand.setAttributeNS(null, 'x2', OuterCoordinates.X + 210);
			MinuteHand.setAttributeNS(null, 'y2', OuterCoordinates.Y + 210);
			MinuteHand.setAttributeNS(null, 'stroke', 'black');
			MinuteHand.setAttributeNS(null, 'stroke-width', 6);
			
			//SecondHand
			OuterCoordinates = Clock.UI.PolarToCartesian(180, Clock.UI.ClockAngle('second', Clock.Time().getSeconds()));
			SecondHand = document.createElementNS(Clock.UI.SVGNS, 'line');
			SecondHand.setAttributeNS(null, 'id', 'SecondHand');
			SecondHand.setAttributeNS(null, 'x1', 210);
			SecondHand.setAttributeNS(null, 'y1', 210);
			SecondHand.setAttributeNS(null, 'x2', OuterCoordinates.X + 210);
			SecondHand.setAttributeNS(null, 'y2', OuterCoordinates.Y + 210);
			SecondHand.setAttributeNS(null, 'stroke', 'red');
			SecondHand.setAttributeNS(null, 'stroke-width', 2);
			
			//CenterCircle
			CenterCircle = document.createElementNS(Clock.UI.SVGNS, 'circle');
			CenterCircle.setAttributeNS(null, 'cx', 210);
			CenterCircle.setAttributeNS(null, 'cy', 210);
			CenterCircle.setAttributeNS(null, 'r', 12);
			CenterCircle.setAttributeNS(null, 'fill', 'black');
			
			//CenterCircle2
			CenterCircle2 = document.createElementNS(Clock.UI.SVGNS, 'circle');
			CenterCircle2.setAttributeNS(null, 'cx', 210);
			CenterCircle2.setAttributeNS(null, 'cy', 210);
			CenterCircle2.setAttributeNS(null, 'r', 4);
			CenterCircle2.setAttributeNS(null, 'fill', 'red');
			
			SVGElement.appendChild(HourHand);
			SVGElement.appendChild(MinuteHand);
			SVGElement.appendChild(CenterCircle);
			SVGElement.appendChild(SecondHand);
			SVGElement.appendChild(CenterCircle2);
			
			AnalogClock = document.getElementById('AnalogClock');
			
			
			AnalogClock.appendChild(SVGElement);
		
		},
		
		'UpdateHands': function()
		{
		
			//HourHand
			HourHand = document.getElementById('HourHand');
			OuterCoordinates = Clock.UI.PolarToCartesian(135, Clock.UI.ClockAngle('hour', (Clock.Time().getHours() + Clock.Time().getMinutes() / 60 + Clock.Time().getSeconds() / 3600)));
			HourHand.setAttributeNS(null, 'x2', OuterCoordinates.X + 210);
			HourHand.setAttributeNS(null, 'y2', OuterCoordinates.Y + 210);
			
			//MinuteHand
			MinuteHand = document.getElementById('MinuteHand');
			OuterCoordinates = Clock.UI.PolarToCartesian(180, Clock.UI.ClockAngle('minute', (Clock.Time().getMinutes() + Clock.Time().getSeconds() / 60)))
			MinuteHand.setAttributeNS(null, 'x2', OuterCoordinates.X + 210);
			MinuteHand.setAttributeNS(null, 'y2', OuterCoordinates.Y + 210);
			
			//SecondHand
			SecondHand = document.getElementById('SecondHand');
			OuterCoordinates = Clock.UI.PolarToCartesian(180, Clock.UI.ClockAngle('minute', Clock.Time().getSeconds()));
			SecondHand.setAttributeNS(null, 'x2', OuterCoordinates.X + 210);
			SecondHand.setAttributeNS(null, 'y2', OuterCoordinates.Y + 210);
		
		},
		
		'PolarToCartesian': function(Radius, Angle)
		{
		
			OutputX = Radius * Math.cos(Angle);
			OutputY = Radius * Math.sin(Angle);
			
			Output = {'X': OutputX, 'Y': OutputY};
			
			return Output;
		
		},
		
		'ClockAngle': function(Unit, Amount)
		{
		
			return Clock.UI.ClockAngle24(Unit,Amount);
		
		},
		
		'ClockAngle12': function(Unit, Amount)
		{
		
			Increment = Math.PI;
		
			if (Unit == 'hour') Increment = Math.PI / 6;
			if (Unit == 'minute') Increment = Math.PI / 30;
			if (Unit == 'second') Increment = Math.PI / 30;
			
			return Increment * Amount - (Math.PI / 2);
		
		},
		
		'ClockAngle24': function(Unit, Amount)
		{
		
			Increment = Math.PI;
		
			if (Unit == 'hour') Increment = Math.PI / 12;
			if (Unit == 'minute') Increment = Math.PI / 30;
			if (Unit == 'second') Increment = Math.PI / 30;
			
			Result = Increment * Amount - (Math.PI / 2);
			
			if (Unit == 'hour')
			{
			
				Result = Increment * Amount + (Math.PI / 2);
				
			}
			return Result;
		
		}
	
	}

}
