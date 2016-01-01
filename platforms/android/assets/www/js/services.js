var app = angular.module('stacks.services', []);

app.factory('Stacks', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
//  var codes = [ "0000001","0603885", "0600958", "0600737",
//				"0600115","0600029","0600031", "0603601",
//				"0601689", "1002234", "0603997","0603609" ];
  var url = "http://api.money.126.net/data/feed/";
  return {
    getStacks: function(stacks, callback) {
        var codes = [];
        stacks.forEach(function (each) {
            if (!codes[each.code]) {
                codes.push(each.code);
            }
        });
        if (codes.length == 0) {
            callback([]);
            return;
        }
        $http.jsonp(url+codes.join(","),{params:{"callback":"JSON_CALLBACK"}})
            .success(function(data, status) {
                //$scope.status = status;
                var temps = [];
                stacks.forEach(function (stack) {
                    stack.data = data[stack.code];
                    temps.push(stack);});
                callback(temps);
            }).
            error(function(data, status) {
                //$scope.data = data || "Request failed";
                //$scope.status = status;
        });
    },
    getStack: function(code,callback) {
        $http.jsonp(url+code,{params:{"callback":"JSON_CALLBACK"}})
            .success(function(data, status) {
                //$scope.status = status;
                callback(data);
            }).
            error(function(data, status) {
                //$scope.data = data || "Request failed";
                //$scope.status = status;
        });
    }
  };
});

app.service('StacksDB', function () {
  var _db;
  function dateFix (result) {
    var data = [];
    result.forEach(function (each) {
        data.push(each.doc);});
    return data
  };
  return {
    initDB: function () {
      if (!_db) {
        _db = new PouchDB('stacks', {adapter: 'websql'});
      }
    },
    getAllStacks: function (callback) {
      if (!_db) {
        _db = new PouchDB('stacks', {adapter: 'websql'});
      }
      _db.allDocs({include_docs: true}).then(function (result) {
        callback(dateFix(result.rows));
      })
    },
    updateStack: function (stack) {
      stack._id = stack.code;
      _db.put(stack);
    },
    removeStack: function (stack) {       
      _db.get(stack.code).then(function(doc) {
        //console.log(doc);
        return _db.remove(doc);
      }).then(function (result) {
        // handle result
      }).catch(function (err) {
        console.log("error:" + err);
      });
    },
    deleteDB: function(){
      _db.destroy().then(function (response) {
            // success
            console.log("db has been deleted.");
          }).catch(function (err) {
            console.log(err);
          });
    }
  }
});
