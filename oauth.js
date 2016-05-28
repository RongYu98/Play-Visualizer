/* global gapi */

// { spaces: 'appDataFolder' };

var user, profile, drive;

function onSignIn(googleUser) {
  user = googleUser;
  profile = googleUser.getBasicProfile();
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

