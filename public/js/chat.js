const DEFAULT_USER_NAME = "User";

var username = DEFAULT_USER_NAME;
var socket = io();

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
socket.on('handshake-username', function(msg){
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

socket.emit('set-username', username);

function produceMessage(username, msg) {
  return username + ': ' + msg;
}

function showMessage(msg){
    $('#messages').append($('<li>').text(msg));
}