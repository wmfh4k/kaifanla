
var app=angular.module('kaifanla', ['ng', 'ngRoute','ngTouch'])
app.controller('startCtrl',['$scope','$location',function ($scope,$location){
  $scope.jump=function(){
    $location.path('/main');
  }
}]);
app.controller('mainCtrl',['$scope','$http','$location', function ($scope, $http, $location){
  $scope.dalaye=true;
  $scope.nofoot=false;
  $scope.kw="";
  $http.get('data/dish_listbypage.php').success(function (data){
    $scope.datas=data;
    $scope.dalaye=false;
    if (data.length<5) {
     $scope.nofoot=true;
   };

 });
  $scope.keysoso=function ($event){
        // console.log($event.which);
        // console.log($event.keyCode);
        if ($event.keyCode===13) {
         $http.get('data/dish_listbykw.php?kw='+$scope.kw).success(function (data){
          $scope.kw="";
          if (data.length<5) {
           $scope.nofoot=true ; 
           $scope.dalaye=true;
         }else{
          $scope.nofoot=false;
          $scope.dalaye=false;
        }
        $scope.datas=data;
      })

       };
       
     }
     $scope.mfoot=function (){
      $scope.circle=true;
      $scope.begin=$scope.datas.length;
      $http.get('data/dish_listbypage.php?start='+$scope.begin).success(function (data){
        $scope.circle=false;
        $scope.datas=$scope.datas.concat(data);
        if (data.length<5) {
          $scope.nofoot=true;
          $scope.dalaye=true;
        }else{
         $scope.dalaye=false;
       }

     });
    }
    $scope.todetail = function (did) {
      $location.path('/detail/' + did);
    }
  }])
app.controller('detailCtrl', function ($rootScope,$scope, $http, $routeParams) {
  $scope.clicone=false;
  $scope.btnshop="我要下订单";
  $http.get('data/dish_listbydid.php?did=' + $routeParams.did).
  success(function (data) {
    console.log(data);
    $scope.dish = data;
  })
  $scope.shopping=function (){
    $scope.clicone=true;
    $scope.btnshop="已下订单";
    if (parseInt($scope.dish.num)<3) {
      $scope.dish.num=parseInt($scope.dish.num)+1;
    }else{
      $scope.dish.num='3';
      $scope.btnshop="下次再来"
      return;
    }
  }
  $scope.$on('$destroy',function (){
    if ($scope.clicone===true) {
      $rootScope.shopfoot.push($scope.dish); 
      console.log($rootScope.shopfoot);
      $http.get('data/dish_listbyshop.php?num=' + $scope.dish.num+'&did='+$scope.dish.did).success(function (data){
      });
    }  
  })
})
app.controller('orderCtrl', function ($scope, $http, $routeParams,$location,$timeout) {
  $scope.succesdata=false;
  $scope.order = {did: $routeParams.did};
  $scope.order.user_name = '';
  $scope.order.sex = '';
  $scope.order.phone = '';
  $scope.order.addr = '';
  $scope.submitOrder = function () {
    var str = jQuery.param($scope.order);
      // console.log(str);
      $http.post('data/order_add.php', str).
      success(function (data) {
        console.log(data);
        console.log(data.oid);
        $scope.oidnum=data[0].oid;
        $scope.succesdata=true;
        $timeout(function(){
         $location.path('/orderdate');
       },1500);
      });
    }
  })

app.controller('shopCtrl',function ($rootScope,$scope, $http,$route,$timeout){
  $timeout(f1(),1000)
  function f1 (){
   $http.get('data/dish_listbyaddshop.php?').success(function (data){
    $scope.sumshop=0;
    for (var i = 0; i<data.length; i++) {
      $scope.sumshop+=parseFloat(data[i].num)*parseFloat(data[i].price);
    };
    $scope.datas=data;
    $rootScope.shopfoot=$scope.datas;
    if ($scope.datas.length<5) {
     $scope.nofoot=true ; 
     $scope.dalaye=true;
   }else{
    $scope.nofoot=false;
    $scope.dalaye=false;
  }
  $scope.deletshop=function ($index){
    var dedid=$scope.datas[this.$index].did;
    var denum=$scope.datas[this.$index].num;
    var deid=$scope.datas[this.$index].idx;
    $http.get('data/dish_listbydeteshop.php?did='+dedid+'&num'+denum+'&idx='+deid).success(function (data){
      console.log(data);
      if (data==1) {
                    // alert("删除成功！")
                    $scope.datas.splice($index,1);
                  };
                })
  }
}) 
 }
})
app.controller('orderdateCtrl',function ($rootScope,$scope, $http,$route){
 $http.get('data/dish_listbymorder.php').success(function (data){
  console.log(data);
  if (data==0) {
    $scope.nodate=true;
  }else{
    $scope.nodate=false;
    $scope.datas=data;
  }
  
})


})
app.config(['$routeProvider',function ($routeProvider) {
  $routeProvider.
  when('/index',{
    templateUrl: 'tpl/start.html',
    controller: 'startCtrl'
  }).
  when('/start',{
    templateUrl: 'tpl/start.html',
    controller: 'startCtrl'
  }).
  when('/main', {
    templateUrl: 'tpl/main.html',
    controller: 'mainCtrl'
  }).
  when('/detail/:did', {
    templateUrl: 'tpl/detail.html',
    controller: 'detailCtrl'
  }).
  when('/order', {
    templateUrl: 'tpl/order.html',
    controller: 'orderCtrl'
  }).
  when('/orderdate', {
    templateUrl: 'tpl/orderdate.html',
    controller: 'orderdateCtrl'
  }).
  when('/shop', {
    templateUrl: 'tpl/shop.html',
    controller: 'shopCtrl'
  }).
  otherwise({
    redirectTo:'/start'
  })
}])
app.run(function ($http,$rootScope,$location){
  $rootScope.shopfoot=[];
  $rootScope.jumpshop=function ($event){
    $location.path('/shop');
  }

    //配置默认的HTTPPOST请求的头部
    $http.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded'}
  })