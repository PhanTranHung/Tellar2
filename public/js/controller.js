// AngularJS

let app = angular.module('tellar', []);

app.controller('rootController', ['$scope', 'http', function ($scope, http) {

  $scope.userInfo = {};
  $scope.ordered = null;
  $scope.joined_group = null;
  $scope.isFindUser = false;
  $scope.message = '';

  let catch_err = err => console.log(err);

  http.getUserInfo()
    .catch(err => catch_err(err))
    .then(res => {
      $scope.userInfo = res.data;
      window.userInfo = $scope.userInfo;
      refresh_group_info($scope.userInfo.joined_group);
    });

  let refresh_group_info = (joined_group) => {
    Promise.all(joined_group.map(group_id => http.getGroupInfo(group_id)))
      .catch(err => console.log(err))
      .then(groups => {
        $scope.joined_group = groups;
        $scope.ordered = 0;
        $scope.$apply();
      });
  };

  $scope.selectConverse = function (key, group) {
    console.log(key);
    $scope.ordered = key;
  };

  $scope.showClass = (group_id) => {
    if ($scope.joined_group[$scope.ordered].group_id === group_id)
      return "clicked";
    else return null;
  };

  $scope.date_rendering = (date) => {
    date = new Date(Date.now() - Date.parse(date));
    // catch_err(date);
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
  };

  $scope.focus = () => {
    $scope.isFindUser = true;
    $scope.input = document.getElementById('input-tags-selectized');
    $scope.input.focus();
  };

  $scope.sentMessage = function(){
    if (!$scope.message.trim()) return;

    http.send($scope.joined_group[$scope.ordered].group_id, $scope.message.trim())
      .catch(err => console.log(err));
    $scope.message = '';
  };

  $scope.event = function ($event) {
    // debugger
    switch ($event.key) {
      case "Enter":
        $scope.sentMessage();
        break;
    }
  }

}]);


angular.module('tellar').factory('http', ['$http', function ($http) {

  function request(url, params = {}, data = {}, method = 'GET', headers = {}) {
    headers['x-access-token'] = localStorage.getItem('accessToken');
    return $http({
      method: method,
      url: url,
      params: params,
      data: data,
      headers: headers
    })
  }

  return {
    getUserInfo: function () {
      return request('/api/user/userinfo');
    },
    getGroupInfo: function (group_id) {
      return request('/api/group', {group_id: group_id})
        .then(res => res.data, err => console.log(err));
    },
    send: function (group_id, message, has_attachment = false) {
      return request('/api/group/send', {},
        {
          to: group_id,
          message: message,
          has_attachment: has_attachment
        }, 'POST');
    }
  }
}]);
