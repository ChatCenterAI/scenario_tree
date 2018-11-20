firebase.initializeApp(config);

var provider = new firebase.auth.FacebookAuthProvider();

// Initialize
var service = {};
service.db = firebase.firestore();
service.providers = {
  facebook: new firebase.auth.FacebookAuthProvider()
};


