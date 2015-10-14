var app = angular.module('myApp',[]);
//myApp.controller('MainCtrl',function($scope){
app.controller('MainCtrl',function($scope, $window, $interval)
{

  $scope.now = 0
$scope.playButtonClicked = function(){
    $scope.playing = !$scope.playing
    if($scope.now === $scope.history.length - 1) $scope.now = 0
  }
  $scope.months = ['', 'January', 'February', 'March', 'April', 'May']
    .concat(['June', 'July', 'August', 'September', 'October', 'November'])
    .concat(['December'])
  $scope.playing = false
  var interval
  $scope.sliderPosition = null
  $scope.$watch('playing', function(playing){
    if(window._gaq) _gaq.push(['_trackEvent', 'timeline', 'playing', playing])
    if(playing){
      var prev_now = $scope.now
      interval = $interval(function(){
        if($scope.now !== prev_now){
          // something other than this timer updated `now`. we should stop
          // auto playing
          $interval.cancel(interval)
          $scope.playing = false
          return
        }
        $scope.now++
        if($scope.now >= $scope.history.length){
          $scope.playing = false
          $scope.now--
        }
        prev_now = $scope.now
      }, 750 )
    }else{
      $interval.cancel(interval)
    }
  })
  $scope.$watch('now', now_change)
  function now_change(){
    var now = $scope.now, history = $scope.history
    if(!history) return
    $scope.year = history[now].year
    $scope.month = history[now].month
    $scope.sliderPosition = new Date(history[now].date)
  }
  $scope.$watch('sliderPosition', function(date){
    if(!date) return
    var month = date.getUTCMonth() + 1 + ''
    if(month.length === 1) month = '0' + month
    date = date.getUTCFullYear() + '-' + month
    var now = 0, history = $scope.history
    while(history[now].date !== date && now < history.length) now++
    $scope.now = now
  })

  //d3.json('data/hexa-data-2011-ene.json',function(err,data){
  d3.json('data/hexa-hospitales.json',function(err,data){
     if(err){ throw err; }
      ////////////////////
     

      if(!$scope.$$phase)
        $scope.$apply(got_history)
      else 
        got_history()

      function got_history(){
        var history = d3.range(1,25).map(function(d,i){return {date: (2011+(d > 12? 1: 0)).toString()+'-'+ (((i%12)+1) < 10?'0':'')+((i%12)+1).toString(), year: 2011+(d > 12? 1: 0), month: (i%12)+1, reservoirs :{}};})        
        //debugger;
        /*var rango = d3.entries(data).map(function(d,i){ return d3.keys(d.value).map(function(d2,i2){ return {date: d.key+'-'+d2, year: +d.key, month: +d2}; }); })
        var history = rango.reduce(function(a,b){ return a.concat(b); });        
        history.sort(function(a,b){var date1 = a.year*100+a.month; var date2 = b.year*100+b.month; return (date1 - date2);})        */

        window._history = history

        $scope.now = 0
        $scope.playing = true
        $scope.history = history
        $scope.domain = [history[0].date, history[history.length - 1].date]
        //debugger;
        now_change() //avisa de un cambio en la posicion del slider

        $scope.loaded = true
        if(window._gaq) _gaq.push(['_trackEvent', 'data', 'loading', 'finish'])
      //?

      ////////////////////////////////////////
     
      }
      var muestra = d3.entries(data);
      //console.log();
      $scope.charts = muestra.slice(0,12);
       
     $scope.$apply();
       
 });


});