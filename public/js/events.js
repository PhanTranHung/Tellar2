// JQuery
let poster;
let msg_area;
let wrap_able;

let msg_friend_begin = `<div class="line_text"><div class="friend-msg align_l"><div class="content_msg">`;
let msg_me_begin = `<div class="line_text"><div class="my-msg align_r"><div class="content_msg">`
let msg_end = `</div></div></div>`;

$(document).ready(function () {
  let tagInput = $('#input-tags');
  let createGroup = $('#create-group');
  let cancel = $('#cancel');

  poster = $('#post_msg');
  msg_area = $('#msg_area');
  wrap_able = $('#wrap_able');

  tagInput.selectize({
    valueField: "_id",
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
        return `<div class='selectize-item'><div class='selectize-item-inner'>${item.name}</div></div>`;
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
        members: tagInput.val()
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

  document.getElementById('input-tags-selectized').onkeypress = function (ev) {
    console.log(ev);
  }
});

function addNewMessage(message, sender, attachment= {}) {

  if (sender === userInfo.id)
    msg_area.append(msg_me_begin + message + msg_end);
  else
    msg_area.append(msg_friend_begin + message + msg_end);
  wrap_able.stop().animate({scrollTop: wrap_able[0].scrollHeight}, 100);
}