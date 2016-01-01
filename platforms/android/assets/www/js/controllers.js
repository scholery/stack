angular.module('stacks.controllers', [])

.controller('StacksCtrl', function($scope, $ionicModal, Stacks, StacksDB) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.stacks = [];
    $scope.updateStacks = function(data){
        $scope.stacks = data;
    };
    $scope.showDelete = false;
    $scope.doRefresh = function(){
       Stacks.getStacks($scope.stacks, $scope.updateStacks);
       $scope.$broadcast('scroll.refreshComplete');
    };
    StacksDB.getAllStacks(function(data){
      $scope.stacks = data;
      $scope.doRefresh();
    });
    
    // Create our modal
    $ionicModal.fromTemplateUrl('new-stack.html', function(modal) {
      $scope.stackModal = modal;
    }, {
      scope: $scope
    });
    $scope.addStack = function(stack) {
      //console.log(stack);
      if(!stack || !stack.code) {
        //stack.code = "";
        return;
      }
      var has = false;
      $scope.stacks.forEach(function (each) {
        if (each.code == stack.code) {
            has = true;
        }
      });
      if (has) {
        stack.code = "";
        $scope.stackModal.hide();
        return;
      }
  
      Stacks.getStack(stack.code,function(data){
        if (!data || !data[stack.code]) {
            return;
        }
        //console.log("add "+ data[stack.code].code );
        var newStack = {
              code: stack.code,
              name: data[stack.code].name,
              index: $scope.stacks.length+1,
              warning: false,
              lowWarning: "",
              hightWarning: ""
            };
        StacksDB.updateStack(newStack);
        
        newStack.data = data[stack.code];
        $scope.stacks.push(newStack);
        stack.code = "";
        $scope.stackModal.hide();
      });
    };

    $scope.newStack = function() {
      $scope.stackModal.show();
      $scope.showDelete = false;
    };
  
    $scope.closeNewStack = function() {
      $scope.stackModal.hide();
    };
    
    $scope.remove = function(stack) {
      $scope.stacks.splice($scope.stacks.indexOf(stack), 1);
      StacksDB.removeStack(stack);
      //StacksDB.deleteDB();
    };
    $scope.showRemove = function(){
      $scope.showDelete = !$scope.showDelete;
    };
    //StacksDB.deleteDB();
    //StacksDB.getAllStacks(function(data){
    //  console.log("get all");
    //  console.log(JSON.stringify(data));
    //});
    //$scope.onDrag = function(event)  {
    //    //console.log('Reporting : drag');
    //    console.log(event.target.className);
    //    $scope.doshadow = event.target.id.substr(8, 1);
    //    $scope.draggedStyle = {
    //        'left': '30px',
    //        'top': '50px'
    //    };
    //};
    //$scope.onRelease = function(event)  {
    //    //console.log(event.target);
    //    $scope.doshadow = 0;
    //    $scope.draggedStyle = {};
    //};
})

.controller('StackDetailCtrl', function($scope, $stateParams,Stacks,StacksDB) {
    $scope.updateStack = function(data){
        $scope.stack = data[$stateParams.code];
    };

    $scope.doRefresh = function(){
       Stacks.getStack($stateParams.code,$scope.updateStack);
       $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.doRefresh();
})

.controller('WarningCtrl', function($scope, $ionicModal, $interval, StacksDB) {
    $scope.stacks = [];
    $scope.stack;
    $scope.doRefresh = function(){
        StacksDB.getAllStacks(function(data){
            //console.log("get warning");
            $scope.stacks = data;
            //console.log(JSON.stringify(data));
        });
       $scope.$broadcast('scroll.refreshComplete');
    };
    $interval($scope.doRefresh,500);
    $scope.updateStack = function(stack){
        if (!stack.warning) {
            stack.lowWarning="";
            stack.hightWarning="";
        }
        StacksDB.updateStack(stack);
    };
    
    // edit our modal
    $ionicModal.fromTemplateUrl('edit-stack.html', function(modal) {
      $scope.stackModal = modal;
    }, {
      scope: $scope
    });
    $scope.saveStack = function() {
        StacksDB.updateStack($scope.stack);
        $scope.stackModal.hide();
    };

    $scope.editStack = function(stack) {
      if (!stack.warning) {
         return;
      }
      $scope.stack = stack;
      $scope.stackModal.show();
    };
  
    $scope.closeEditStack = function() {
      $scope.stackModal.hide();
    };
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
});
