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
  let tagInput = $('#input-tags');
  let createGroup = $('#create-group');
  let cancel = $('#cancel');

  function loadData(query, callback) {
    if (!query.length) return callback();
    console.log(query);
    $.ajax({
      url: "/api/user/discovery",
      type: "GET",
      data: {
        name: query.toString(),
        onlyPeople: false
      },
      error: function () {
        callback()
      },
      success: function (res) {
        callback(res);
        // console.log(res);
      }
    })
  }

  tagInput.selectize({
    valueField: "_id",
    // labelField: "name",
    searchField: ["name", "display_name"],
    optgroupField: 'categories',
    optgroupValueField: 'id',
    openOnFocus: false,
    lockOptgroupOrder: true,
    delimiter: ',',
    plugins: ["restore_on_backspace", 'remove_button', 'optgroup_columns'],
    create: false,
    maxOptions: 10,
    maxItems: 10,
    closeAfterSelect: true,
    optgroups: [
      {$order: 1, id: 'user', name: 'User'},
      {$order: 2, id: 'group', name: 'Group'},
    ],
    render: {
      item: function (item, escape) {
        return "<div class='selectize-item'><div class='selectize-item-inner'>" + item.name + "</div></div>";
      },
      option: function (item, escape) {
        let name = item.name || item.display_name;
        return `<div class="selectize-option">
                  <div class="wrapper-left">
                    <img class="inner-wrapper-left" src="${item.cover_group}">
                  </div>
                  <div class="wrapper-right">
                    ${name}
                  </div>
                </div>`;
      },
      optgroup_header: function (data, escape) {
        console.log("header" + JSON.stringify(data));
        return `<div class="selectize-header">${escape(data.name)}</div>`
      }
    },
    score: function (search) {
      if (search.length < 3) return item => 0;
      let score = this.getScoreFunction(search);
      return item => {
        return score(item);
      };
    },
    load: function (query, callback) {
      if (!query.length) return callback();
      console.log(query);
      $http("/api/user/discovery",
        "GET",
        {
          name: query.toString(),
          onlyPeople: false
        })
        .catch(callback())
        .then(res => callback(res));
    },
  });

  // tagInput.each(function () {
  //   let $container = $('<div>').addClass('value').html('Current Value: ');
  //   let $value = $('<span>').appendTo($container);
  //   let $input = $(this);
  //   let update = function () {
  //     $value.text(JSON.stringify($input.val()));
  //   };
  //
  //   $(this).on('change', update);
  //   update();
  //
  //   $container.insertAfter($input.next());
  // });

  function $http(url, method = "GET", data = {}) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: url,
        type: method,
        data: data,
        error: reject,
        success: resolve,
      });
    });
  }

  createGroup.click(function () {
    $(this).prop('disabled', true);
    cancel.prop('disabled', true);
    $http("/api/group/create-group",
      "POST",
      {
        members: tagInput.val().split(',')
      })
      .catch(err => {
        console.log(res);
      })
      .then(res => {
        console.log(res);
        $(this).prop('disabled', false);
        cancel.prop('disabled', false);
      });
  });

  cancel.click(function () {

  });
});