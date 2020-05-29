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
        $scope.ordered = {key: 0, group_id: groups[0].group_id};
        switchMessageArea(groups[0].group_id);
        $scope.$apply();
      });
  };

  $scope.selectConverse = function (key, group) {
    console.log(key);
    switchMessageArea(group.group_id);
    $scope.ordered = {key: key, group_id: group.group_id};
  };

  function switchMessageArea(messageAreaID){

    if (msg_area[messageAreaID]) {
      // hide the previous message area
      msg_area[$scope.ordered.group_id].hide();

      // show the message area just clicked
      msg_area[messageAreaID].show();

    } else {
      msg_area[messageAreaID] = createNewMessageAreaElement(messageAreaID);


      $('#wrap_able').append(msg_area[messageAreaID]);
    }
  }

  $scope.showClass = (group_id) => {
    if ($scope.ordered.group_id === group_id)
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

    http.send($scope.ordered.group_id, $scope.message.trim())
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
