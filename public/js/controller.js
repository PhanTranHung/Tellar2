// AngularJS

let app = angular.module('tellar', []);

app.controller('rootController', ['$scope', 'http', function ($scope, http) {

  $scope.userInfo = {};
  $scope.selectedConvese = null;
  $scope.joined_group = null;
  $scope.isFindUser = false;

  let catch_err = err => console.log(err);

  http.getUserInfo()
    .catch(err => catch_err(err))
    .then(res => {
      $scope.userInfo = res.data;
      refresh_group_info($scope.userInfo.joined_group);
    });

  let refresh_group_info = (joined_group) => {
    Promise.all(joined_group.map(group_id => http.getGroupInfo(group_id)))
      .catch(err => console.log(err))
      .then(groups => {
        $scope.joined_group = groups;
        $scope.selectedConvese = groups[0];
        $scope.$apply();
      });
  };

  // setInterval(() => catch_err($scope.joined_group), 100);

  $scope.selectConverse = function (group) {
    $scope.selectedConvese = group;
    // $scope.$apply();
  };
  $scope.showClass = (group_id) => {
    if ($scope.selectedConvese.group_id === group_id)
      return "clicked";
    else return null;
  };

  $scope.date_rendering = (date) => {
    date = new Date(Date.now() - Date.parse(date));
    catch_err(date);
    let how_much = "";

    if (date.getFullYear() - 1970 > 0)
      how_much = `${date.getFullYear() - 1970} years`;
    else if (date.getMonth() > 1)
      how_much = `${date.getMonth()} months`;
    else if (date.getDate() > 1)
      how_much = `${date.getDate()} days`;
    else if (date.getHours() > 1)
      how_much = `${date.getHours()} hours`;
    else
      how_much = "few minutes";


  // else if (date. - old_date. > 0)
  //     how_much = `${date. - old_date.} `;
    return `Active ${how_much} ago.`;
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
    getGroupInfo: function (group_id) {
      return $http({
        method: 'GET',
        url: '/api/group',
        params: {
          group_id: group_id
        },
        headers: {
          'x-access-token': localStorage.getItem('accessToken'),
        }
      }).then(res => res.data, err => console.log(err));
    },
    update: function (todoData) {
      return $http.put('/api', todoData);
    },
    delete: function (todoData) {
      return $http.delete('/api', todoData);
    }
  }
}]);


// JQuery
$(document).ready(function () {
  $('#input-tags').selectize({
    delimiter: ',',
    plugins: ["restore_on_backspace", 'remove_button'],
    persist: false,
    create: function(input) {
      return {
        value: input,
        text: input
      }
    }
  });
});