const DEFAULT_USER_NAME = "User";

var username = DEFAULT_USER_NAME;
var socket = io();
var prevMsgVal = "";
var isTypingUsernames = [];

$('.input-message').on('keyup', function () {
    let msg = $('.input-message').val();
    if (msg && msg.length > 0 && !prevMsgVal) {
        socket.emit('status-typing', true);
    }
    else if(!msg || msg.length == 0){
        socket.emit('status-typing', false);
    }
    prevMsgVal = msg;
});

$('.btn-sendmessage').on('click', function () {
    let msg = $('.input-message').val();
    socket.emit('message', msg);
    $('.input-message').val('');

    showMessage(produceMessage(username, msg));
    return false;
});
$('.btn-changeusername').on('click', function () {
    swal({
        title: "Change Name",
        text: "Input your new user name below:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-bottom",
        inputPlaceholder: "User"
    },
        function (inputValue) {
            if (!inputValue) {
                swal.showInputError("Your name cannot be empty!");
                return false;
            }

            username = inputValue;
            socket.emit('set-username', username);
            $('.span-username').text(username);
            swal.close();
        });
});
socket.on('handshake-username', function (msg) {
    socket.emit('handshake-username', username);
})

socket.on('message', function (msg) {
    showMessage(msg);
});
socket.on('userConnected', function (msg) {
    showMessage(msg);
});
socket.on('userDisconnected', function (msg) {
    showMessage(msg);
});
socket.on('status-typing', function (username, isTyping) {
    if (isTyping)
        addTypingStatus(username);
    else
        removeTypingStatus(username);
    renderStatusBar();
});

socket.emit('set-username', username);

function produceMessage(username, msg) {
    return username + ': ' + msg;
}

function showMessage(msg) {
    $('#messages').append($('<li>').text(msg));
}

function addTypingStatus(username) {
    isTypingUsernames.push(username);
}


function removeTypingStatus(username) {
    //assuming username is unique
    let index = isTypingUsernames.lastIndexOf(username);
    if (index >= 0) {
        isTypingUsernames.splice(index, 1);
    }
}

function renderStatusBar() {
    let statusMessage = "";
    for (let i = 0; i < isTypingUsernames.length; i++) {
        if (i > 0)
            statusMessage += ', ';
        statusMessage += isTypingUsernames[i] + ' is typing';
    }
    $(".span-istyping").text(statusMessage);
}