/* global gapi, $ */

// { spaces: 'appDataFolder' };

var profile, drive;
var container = $('#drive');

function renderSignIn() {
  gapi.signin2.render('google-signin', {
    'scope': 'https://www.googleapis.com/auth/drive.appdata',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'onsuccess': onSuccess,
    'onfailure': onFailure,
  });
}

function onSuccess(googleUser) {
  profile = googleUser.getBasicProfile();
  container.empty().append(
    $('<p>').text('Loaded profile of ' + profile.getName() + '.')
  );
  gapi.client.load('drive', 'v3', function() {
    if (!drive)
      drive = gapi.client.drive;
    listFiles();
  });
}

function onFailure(e) {
  container.empty().append(
    $('<p>')
      .attr('style', 'color:red;')
      .text('Unable to connect: ' + e.reason)
  );
}

function listFiles() {
  var request = drive.files.list({
    spaces: 'appDataFolder',
  });
  request.execute(function(resp) {
    if (resp.files.length > 0) {
      var list = $('<ul>');
      resp.files.every(function(e) {
        list.append($('<li>').text(e.name + ' | ' + e.id));
      });
      container.append(list);
    } else {
      container.append(
        $('<p>').text('No files found.')
      );
    }
  });
}
