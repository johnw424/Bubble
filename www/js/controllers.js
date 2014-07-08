angular.module('chatRoom.controllers', ['chatRoom.services'])

.controller('RoomListCtrl', function($scope, $timeout, $firebase, $location) {
  var ref = new Firebase('https://bubblechat.firebaseio.com/opened_rooms');  
  $scope.rooms = $firebase(ref);

  $scope.rightButtons = [
    {
      type: 'button-energized',
      content: '<i class="icon ion-plus"></i>',
      tap: function(e) {
        $location.path("/new");
      }
    }
  ];

  $scope.leftButtons = [
    { 
      type: 'button-energized',
      content: '<i class="icon ion-arrow-left-c"></i>',
      tap: function(e) {
        $location.path('/about');
      }
    }
  ]
})

.controller('RoomCreateCtrl', function($scope, $timeout, $firebase, $location, Geo) {
  var ref = new Firebase('https://bubblechat.firebaseio.com/opened_rooms');  
  $scope.rooms = $firebase(ref);
  
  $scope.currentLocationString = '';
  
  $scope.getLocationString = function() {
    console.log('called');
    Geo.getLocation().then(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      Geo.reverseGeocode(lat, lng).then(function(locString) {
        $scope.currentLocationString = locString;
      });
    }, function(error) {
      alert('Unable to get current location: ' + error);
    });
  };


  $scope.createRoom = function(roomName, roomDescription) {
    if (!roomName) return;
      
    var roomId = Math.floor(Math.random() * 5000001);
    
    $scope.rooms.$add({
      id: roomId,
      title: roomName,
      slug: roomName.split(/\s+/g).join('-'),
      description: roomDescription,
      location: $scope.currentLocationString
    });
    
    $location.path('/rooms/' + roomId);
  };
  
  console.log('didnt call');
  $scope.getLocationString();  

  $scope.leftButtons = [
    { 
      type: 'button-energized',
      content: '<i class="icon ion-arrow-left-c"></i>',
      tap: function(e) {
        $location.path('/');
      }
    }
  ];
})


.controller('RoomCtrl', function($scope, $stateParams, $timeout, $firebase, $location, $ionicScrollDelegate) {
  var roomRef = new Firebase('https://bubblechat.firebaseio.com/opened_rooms/');
  var messagesRef = new Firebase('https://bubblechat.firebaseio.com/rooms/' + $stateParams.roomId);

  $scope.newMessage = "";
  $scope.roomsObj = $firebase(roomRef);
  $scope.messagesObj = $firebase(messagesRef);
  $scope.username = 'User' + Math.floor(Math.random() * 501);


  $scope.leftButtons = [
    { 
      type: 'button-energized',
      content: '<i class="icon ion-arrow-left-c"></i>',
      tap: function(e) {
        $location.path('/');
      }
    }
  ]

  var scrollBottom = function() {
    // Resize and then scroll to the bottom
    $ionicScrollDelegate.resize();
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom();
    });
  };

  $scope.$watch('messagesObj', function (value) {
    var messagesObj = angular.fromJson(angular.toJson(value));
    $timeout(function () {scrollBottom()});
    $scope.messages = [];

    angular.forEach(messagesObj, function (message, key) {
      $scope.messages.push(message);
    });

    if ($scope.messages.length) {
      loaded = true;
    }
  }, true);

  $scope.$watch('roomsObj', function (value) {
    var roomsObj = angular.fromJson(angular.toJson(value));
    $scope.room = false;

    angular.forEach(roomsObj, function (room, key) {
      if ($scope.room) return;
      if (room.id == $stateParams.roomId) {
        $scope.room = room;
        $scope.room.header = room.title + ' (' + room.location + ')';
      };
    });
  }, true);

  $scope.submitAddMessage = function() {
    $scope.messagesObj.$add({
      created_by: this.username,
      content: this.newMessage,
      created_at: new Date()
    });
    this.newMessage = "";

    scrollBottom();
  };
})

.controller('AboutCtrl', function($scope, $location) {
  $scope.rightButtons = [
    {
      type: 'button-energized',
      content: '<i class="icon ion-arrow-right-c"></i>',
      tap: function(e) {
        $location.path("/home");
      }
    }
  ];
})

.controller('AppCtrl', function($scope, $state) {
});