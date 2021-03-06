
var $userName;
var theUserName;
var soundPlay = 0;


$(document).on('ready', function() {

	var app = Backbone.Router.extend({
		routes: {
			'': 'home',
			'home': 'home',
			'chat/:user': 'chat',
			'newname': 'changeName',
			'leaders': 'leaders'
		}, 

		home: function() {
			$('.page').hide();
			$('#user-page').show();
		}, 

		chat: function(user) {
			theUserName = user;
			
			$('.page').hide();
			$('#chat-page').show();
		},

		changeName: function() {
			theUserName = $userName;

			$('.page').hide();
			$('#newname').show();
		},

		leaders: function() {
			$('.page').hide();
			$('#leaderboards').show();
			getTopUsers();
			getRecentUsers();
			getTopChats();
		}

	});

	var myRouter = new app();
	Backbone.history.start();

	$('.name-btn').click(function() {
		$userName = $("#testname").val();
		
		myRouter.navigate('chat/'+$userName, {trigger: true});
		
		$('.name-btn').submit();
	});
	
	$('.changename-btn').click(function() {
		var changeUserName = $("#changing-name").val();
		
		myRouter.navigate('chat/'+changeUserName, {trigger: true});
		
		$('.changename-btn').submit();
	});

	$("#back-btn").on("click", function(){
		myRouter.navigate("chat/"+theUserName, {trigger:true})
	});
	
	$('#my-button').click(onButtonClick);

	function onButtonClick(e) {
		
		$('#my-button').submit();
		
		
		var myMessage = {
			username: theUserName,
			post: $('#message').val(),
			chatroom: 'OG Chatroom'
		};

		$.post(
			'http://fathomless-savannah-3396.herokuapp.com/messages/create',
			myMessage
		);

		$('#message').val('');

		var snd = new Audio("sounds/sounds-903-shut-your-mouth.mp3"); // buffers automatically when created
		snd.play();

	}

	function getMessages() {
		$.get(
			'http://fathomless-savannah-3396.herokuapp.com/messages',
			onMessagesReceived,
			'json'
		);
	}

	function onMessagesReceived(messageList) {
		var htmlString = '';

		if(soundPlay > messageList.length) {
			var snd = new Audio("sounds/sounds-903-shut-your-mouth.mp3"); // buffers automatically when created
			snd.play();
		}

		for(var i=0; i<messageList.length; i++) {
			var message = messageList[i];
			var messageTime = message.created_at;

			if(message.hasOwnProperty('username') && message.hasOwnProperty('post')) {
				htmlString += '<div class="messages">' + '<div id="time">' + "[" + moment(messageTime).startOf(messageTime).fromNow() + "]</div> " + message.username + ' - ' + '<span class="posted-message">' +message.post + '</span>' + '</div>';
			}
		}

		soundPlay = messageList.length;
		

		$('#chat').html(htmlString);
		$('#current-name').html('You are: ' + theUserName)
		$('#chat').scrollTo('max');
	}

	function getTopUsers() {
		$.get(
			'http://fathomless-savannah-3396.herokuapp.com/messages/fanatics',
			topUsersReceived,
			'json'
		);
	}

	function topUsersReceived(users) {
		var userString = '<h3>TOP USERS</h3>';
		
			for(var name in users) {
				userString += '<div class="users">' + name + ": " + users[name] +'</div>';
			}
		
		
		$('#top-users').html(userString);

	}

	function getRecentUsers() {
		$.get(
			'http://fathomless-savannah-3396.herokuapp.com/messages/recent_users',
			recentUsersReceived,
			'json'
		);
	}

	function recentUsersReceived(recUsers) {
		var recentString = '<h3>MOST RECENT USERS</h3>';
		
		var userObj = {};

		for (var i=0; i<recUsers.length; i++) {
			var activeUserName = recUsers[i].username;

			if(!userObj.hasOwnProperty(activeUserName)) {
				userObj[activeUserName] = activeUserName;
			}
			else {
				userObj[activeUserName]++;
			}
		}

		for (prop in userObj) {
			console.log(prop);
			recentString += '<div class="users">' + prop +'</div>';
			$('#active-users').html(recentString);
		}
		
	}

	function getTopChats() {
		$.get(
			'http://fathomless-savannah-3396.herokuapp.com/messages/top_chatrooms',
			topChatsReceived,
			'json'
		);
	}

	function topChatsReceived(chats) {
		var chatString = '<h3>TOP CHATROOMS BY MESSAGES</h3>';
		
			for(var name in chats) {
				chatString += '<div class="users">' + name + ": " + chats[name] +'</div>';
			}
		
		$('#top-chats').html(chatString);

	}

	setInterval(getMessages, 300);

	getMessages();

});