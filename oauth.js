/* global gapi, $ */

// { spaces: 'appDataFolder' };

var user, profile, drive;

function renderSignIn() {
  gapi.signin2.render('google-signin', {
    'scope': 'profile email https://www.googleapis.com/auth/drive.appdata',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': function(e) { console.log('Unable to sign in: ' + e.reason); },
  });
}

function onSuccess(googleUser) {
  user = googleUser;
  profile = googleUser.getBasicProfile();
  $('#drive-data > p').text('Loaded profile of ' + profile.getName());
  loadDriveAPI();
}

function loadDriveAPI() {
  gapi.client.load('drive', 'v3', listFiles);
}

function listFiles() {
  drive = gapi.client.drive;
  var request = drive.files.list({
    spaces: 'appDataFolder',
  });
  request.execute(function(resp) {
    console.log(resp);
  });
}

