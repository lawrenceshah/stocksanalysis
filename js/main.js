(function() {
	angular.module('stocksAnalysisApp', [])
	.controller('mainController', ['$scope','$http',function($scope,$http) {
		$scope.months = [
			{name:'January',value:1},
			{name:'February',value:2},
			{name:'March',value:3},
			{name:'April',value:4},
			{name:'May',value:5},
			{name:'June',value:6},
			{name:'July',value:7},
			{name:'August',value:8},
			{name:'September',value:9},
			{name:'October',value:10},
			{name:'November',value:11},
			{name:'December',value:12},
		];
		
		$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
		
		$scope.years = [];
		for (var i=2016; i>1960; i--) {
			$scope.years.push(i);
		}

		var time = new Date();
		$scope.symbol = 'GOOG';
		$scope.fromMonth = time.getMonth();
		$scope.fromDay = time.getDate();
		$scope.fromYear = time.getFullYear();
		$scope.toMonth = time.getMonth()+1;
		$scope.toDay = time.getDate();
		$scope.toYear = time.getFullYear();
		
		$scope.resolution = 1;
		var resolutions = [1,2,3,4,5,6,7,8,9,10]
		
		$scope.data;
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
				if (Array.isArray(res.data)) {
					$scope.data = res.data;
					$scope.data.shift();
					$scope.graphData();
				} else {
					console.log($scope.data);
					alert('Failed to fetch data.');
				}
			});
		}
		
		$scope.graphData = function() {
			var first = $scope.data[0].split(',');
			var ratio = parseFloat(first[6])/parseFloat(first[4]);
			var top = parseFloat(first[2])*ratio;
			var bottom = parseFloat(first[3])*ratio;
			var count = 0;
			for (var i=0; i<$scope.data.length; i+=$scope.resolution) {
				var arr = $scope.data[i].split(',');
				var ratio = parseFloat(arr[6])/parseFloat(arr[4]);
				var high = parseFloat(arr[2])*ratio;
				top = Math.max(top,high);
				var low = parseFloat(arr[3])*ratio;
				bottom = Math.min(bottom,low);
				count++;
			}
			var range = top-bottom;
			var graphHeight = parseInt($('.graph').css('height'));
			var barWidth = 100/count;
			$('.graph').empty();
			for (var i=0; i<$scope.data.length; i+=$scope.resolution) {
				var arr = $scope.data[i].split(',');
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
		}

		$scope.fetchHistorical();
	}]);
})()
