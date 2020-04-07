let app = angular.module('tellar', []);

app.controller('rootController', ['$scope', '$rootScope', 'http', function ($scope, $rootScope, http) {

  $scope.userInfo = {};
  $scope.selectedConvese = null;
  $scope.joined_group = null;

  let catchErr = err => console.log(err);

  http.getUserInfo()
    .then(res => {
      $scope.userInfo = res.data;
      catchErr(res.data)
    })
    .catch(err => catchErr(err));



  $scope.selectConverse = function (group) {
    $scope.selectedConvese = group;
    http.getGroupInfo($scope.selectedConvese.group_id).then(res => {$scope.groupInfo = res.data})
  };
  $scope.showClass = (group_id) => {
    if ($scope.selectedConvese.group_id === group_id)
      return "clicked";
    else return null;
  }

}]);


angular.module('tellar').factory('http', ['$http', function ($http) {
  return {
    getUserInfo: function () {
      return $http({
        method: 'GET',
        url: '/api/user/userinfo',
        headers: {
          'x-access-token': localStorage.getItem('accessToken'),
        },
      });
    },
    getGroupInfo: function (id_gr) {
      return $http({
        method: 'GET',
        url: '/api/group',
        params: {
          group_id: id_gr
        },
        headers: {
          'x-access-token': localStorage.getItem('accessToken'),
        }
      });
    },
    update: function (todoData) {
      return $http.put('/api', todoData);
    },
    delete: function (todoData) {
      return $http.delete('/api', todoData);
    }
  }
}]);