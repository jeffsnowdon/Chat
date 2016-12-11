var socket = io();
const DEFAULT_USER_NAME = "User";
var username = DEFAULT_USER_NAME;


$('.btn-sendmessage').on('click', function () {
    socket.emit('chat message', $('.input-message').val());
    $('.input-message').val('');
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
            socket.emit('setName', username);
            $('.span-username').text(username);
            swal.close();
        });
});

socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});
socket.on('user connected', function (msg) {
    $('#messages').append($('<li>').text(msg));
});
socket.on('user disconnected', function (msg) {
    $('#messages').append($('<li>').text(msg));
});

socket.emit('setName', username);