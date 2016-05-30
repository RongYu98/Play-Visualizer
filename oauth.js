/* global gapi, $ */

// { spaces: 'appDataFolder' };

var profile, drive, selectedFile;
var driveStatus = $('#drive-status');
var fileList = $('#drive-list');

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
  driveStatus.empty().append(
    p('Loaded profile of ' + profile.getName() + '.'));
  gapi.client.load('drive', 'v3', function() {
    if (!drive)
      drive = gapi.client.drive;
    listFiles();
  });
}

function onFailure(e) {
  driveStatus.empty().append(
    p('Unable to connect to Google Drive: ' + e.reason).attr('style', 'color:red;'));
}

// Requests and DOM Rendering
function listFiles() {
  var request = drive.files.list({
    'spaces': 'appDataFolder',
  });
  request.execute(function(resp) {
    var elem;
    selectedFile = null;
    if (resp.files.length > 0) {
      elem = $('<ul>');
      resp.files.forEach(function(e) {
        elem.append(
          $('<li>')
            .attr('id', e.id)
            .text(e.name + ' | ' + e.id)
            .click(selectFile)
        );
      });
    } else {
      elem = p('No files found.');
    }
    fileList.hide('slow', function() {
      fileList.empty().append(elem).show('slow');
    });
  });
}

function newSave() {
  var request = drive.files.create({
    'name': 'save.txt',
    'parents': [
      'appDataFolder',
    ]
  });
  request.execute(listFiles);
}

function deleteSave() {
  if (selectedFile) {
    var request = drive.files.delete({
      'fileId': selectedFile.attr('id'),
    });
    request.execute(listFiles);
  }
}

function selectFile(e) {
  if (selectedFile)
    selectedFile.css('background-color', '');
  selectedFile = $(e.target);
  selectedFile.css('background-color', '#CCC');
}

// JQuery Shortcuts
function p(text) {
  return $('<p>').text(text);
}

// Event Handler Assignment
$('#drive-save').click(newSave);
$('#drive-delete').click(deleteSave);
$('#drive-refresh').click(listFiles);
