(function() {
	angular.module('stocksAnalysisApp', [])
	.controller('mainController', ['$scope','$http',function($scope,$http) {
		$scope.symbol = 'GOOG';
		$scope.fromMonth = 3;
		$scope.fromDay = 23;
		$scope.fromYear = 2016;
		$scope.toMonth = 6;
		$scope.toDay = 22;
		$scope.toYear = 2016;

		$scope.fetchHistorical = function() {
			$http
			.post('service.php', {
				symbol:$scope.symbol,
				fromMonth:$scope.fromMonth-1,
				fromDay:$scope.fromDay,
				fromYear:$scope.fromYear,
				toMonth:$scope.toMonth-1,
				toDay:$scope.toDay,
				toYear:$scope.toYear
			})
			.then(function(res) {
				//console.log(res.data.shift());
				res.data.shift();
				var first = res.data[0].split(',');
				var ratio = parseFloat(first[6])/parseFloat(first[4]);
				var top = parseFloat(first[2])*ratio;
				var bottom = parseFloat(first[3])*ratio;
				var resolution = Math.ceil(res.data.length/200);
				//var resolution = 1;
				for (var i=0; i<res.data.length; i+=resolution) {
					var arr = res.data[i].split(',');
					var ratio = parseFloat(arr[6])/parseFloat(arr[4]);
					var high = parseFloat(arr[2])*ratio;
					top = Math.max(top,high);
					var low = parseFloat(arr[3])*ratio;
					bottom = Math.min(bottom,low);
				}
				var range = top-bottom;
				var graphHeight = parseInt($('.graph').css('height'));
				var barWidth = 100/res.data.length*resolution;
				$('.graph').empty();
				for (var i=0; i<res.data.length; i+=resolution) {
					var arr = res.data[i].split(',');
					var date = arr[0];
					var ratio = parseFloat(arr[6])/parseFloat(arr[4]);
					var open = parseFloat(arr[1])*ratio;
					var high = parseFloat(arr[2])*ratio;
					var low = parseFloat(arr[3])*ratio;
					var close = parseFloat(arr[6]);
					var barBottom = (low-bottom)/range*graphHeight;
					var barHeight = (high-low)/range*graphHeight;
					var barOpenPos = (open-bottom)/range*graphHeight;
					var barClosePos = (close-bottom)/range*graphHeight;
					var el = 	'<div class="bar-container '+(close>open?'green':'red')+'" style="width:'+barWidth+'%">'+
											'<div class="bar" style="bottom:'+barBottom+'px;height:'+barHeight+'px"></div>'+
											'<div class="bar-open" style="bottom:'+barOpenPos+'px"></div>'+
											'<div class="bar-close" style="bottom:'+barClosePos+'px"></div>'+
											'<div class="bar-info">'+
												'<div>Date: '+date+'</div>'+
												'<div>Open: $'+open.toFixed(2)+'</div>'+
												'<div>Close: $'+close.toFixed(2)+'</div>'+
												'<div>High: $'+high.toFixed(2)+'</div>'+
												'<div>Low: $'+low.toFixed(2)+'</div>'+
											'</div>'+
										'</div>';
					$('.graph').prepend(el);
				}
			})
		}

		$scope.fetchHistorical();
	}]);
})()
