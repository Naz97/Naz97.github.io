// collapse card
$('#plus_minus').on('click', function() {
    var icon = $(this);
    if (icon.hasClass('zmdi-plus')) {
        icon.removeClass('zmdi-plus');
        icon.addClass('zmdi-minus');
    } else {
        icon.removeClass('zmdi-minus');
        icon.addClass('zmdi-plus');
    }
});
// submit form data
$('form').on('submit', function(e) {
    e.preventDefault();
    var form = $(this),
        btn = form.find('button[type=submit]'),
        id = form.data('id'),
        cmdName = form.data('cmd'),
        formData = new FormData(form[0]);
    // save
    if (id) {
        formData.append('id', id);
    }
    $.ajax({
        url: 'https://dominance.am/data_success.php?cmd=' + cmdName,
        type: 'post',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function () {
            btn.prop('disabled', true);
        },
        success: function (data) {
            // parse data
            try {
                var data = JSON.parse(data);
            } catch(e) {
                notify('', 'Error!', 'Please, try again.', 'danger');
                btn.prop('disabled', false);
                // data
                console.log(data);
                return false;
            }
            // notify
            setTimeout(function() {
                // result
                var nType = data.messageType,
                    nTitle = data.messageTitle,
                    nMessage = data.message;
                notify('', nTitle, nMessage, nType);
                // reload page
                if (data.reload) {
                    location.reload();
                }
                btn.prop('disabled', false);
            }, 300);
        },
        error: function () {
            notify('', 'Error!', 'Please, try again.', 'danger');
            btn.prop('disabled', false);
        }
    });
    return false;
});
// ajax actions (delete, archive)
$('.toggle-switch__checkbox').on('change', function (e) {
    var btn = $(this),
        cmd = btn.data('cmd');
    if (cmd) {
        ajaxAction(btn);
    }
});
$('.ajax-action-confirm').on('click', function(e) {
    e.preventDefault();
    var btn = $(this);
    swal({
        title: '<span style="color: #333;">Are you sure ?</span>',
        type: 'warning',
        background: '#fff',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonClass: 'btn btn-light m-l-5',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            ajaxAction(btn);
        }
    });
});

/* functions */
// Notifications
function notify(btn, title, message, type) {
    if (btn[0]) {
        var from,
            align,
            icon = btn.attr('data-icon'),
            animIn,
            animOut;
        // anim in
        if (btn.attr('data-animation-in')) {
            animIn = btn.attr('data-animation-in');
        } else {
            animIn = 'animated bounceInRight';
        }
        // anim out
        if (btn.attr('data-animation-out')) {
            animOut = btn.attr('data-animation-out');
        } else {
            animOut = 'animated bounceOutRight';
        }
        // from
        if (btn.attr('data-from')) {
            from = btn.attr('data-from');
        } else {
            from = 'bottom';
        }
        // align
        if (btn.attr('data-align')) {
            align = btn.attr('data-align');
        } else {
            align = 'right';
        }
    } else {
        var from = 'bottom',
            align = 'right',
            icon = '',
            animIn = 'animated bounceInRight',
            animOut = 'animated bounceOutRight';
    }
    $.notify({
        icon: icon,
        title: title,
        message: message,
        url: ''
    },{
        element: 'body',
        type: type,
        allow_dismiss: true,
        placement: {
            from: from,
            align: align
        },
        offset: {
            x: 30,
            y: 30
        },
        spacing: 10,
        z_index: 1031,
        delay: 2000,
        timer: 2000,
        url_target: '_blank',
        mouse_over: false,
        animate: {
            enter: animIn,
            exit: animOut
        },
        icon_type: 'class',
        template:   '<div data-notify="container" class="alert alert-dismissible alert-{0}" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span></button>' +
                        '<span data-notify="icon"></span> ' +
                        '<span data-notify="title">{1}</span> ' +
                        '<span data-notify="message">{2}</span>' +
                        '<div class="progress" data-notify="progressbar">' +
                            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                        '</div>' +
                        '<a href="{3}" target="{4}" data-notify="url"></a>' +
                    '</div>'
    });
}
// ajaxAction (only ID)
function ajaxAction(btn) {
    if (btn[0]) {
        var id = btn.attr('data-id'),
            cmdName = btn.attr('data-cmd'),
            tableName = btn.attr('data-table'),
            actionName = btn.attr('data-action'),
            animationName = btn.attr('data-animation');
        // check data
        if (id == '' || cmdName == '') {
            var nType = 'warning';
            notify(btn, 'Ошибка! ', 'Please, try again.', nType);
            return false;
        } else {
            btn.prop('disabled', true);
            var elem;
            if (actionName) {
                // hide button
                if (actionName == 'hide-btn') {
                    elem = btn;
                }
                // hide row
                else if (actionName == 'hide-row') {
                    elem = btn.closest($('tr'));
                }
                // hide element
                else if (actionName == 'hide-element') {
                    elem = $('[data-element-id=' + id + ']');
                }
                // hide element
                hideElement(elem, animationName);
            }
            // other actions
            if (btn.attr('data-update')) {
                var updateFunc = btn.attr('data-update');
                window[updateFunc]();
            }
            // send data
            $.post('https://dominance.am/data_success.php?cmd=' + cmdName + '', { table: tableName, id: id }, function(data) {
                // parse data
                try {
                    var data = JSON.parse(data);
                } catch(e) {
                    notify('', 'Server error!', 'Please, try again.', 'danger');
                    // data
                    console.log(data);
                    return false;
                }
                // notify
                setTimeout(function() {
                    // result
                    var nType = data.messageType,
                        nTitle = data.messageTitle,
                        nMessage = data.message;
                    notify(btn, nTitle, nMessage, nType);
                }, 300);
                // reload page
                setTimeout(function() {
                    if (data.reload == 1) {
                        location.reload();
                    }
                }, 3000);
                btn.prop('disabled', false);
            });
            return false;
        }
    } else {
        notify('', 'Ошибка! ', 'Кнопка не обнаружена.', 'warning');
        return false;
    }
};
// hide element aniamtions
function hideElement(elem, animationName, animationDuration = '.8s', removeTimeOut = '700') {
    elem.css({
        'animation-duration': animationDuration,
        '-webkit-animation-duration': animationDuration,
        '-moz-animation-duration': animationDuration,
    });
    elem.addClass('animated ' + animationName);
    setTimeout(function(){
        elem.remove();
    }, removeTimeOut);
}