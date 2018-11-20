var config = {
  apiKey: "AIzaSyB8jmIBe5Cx-XpOjG30y-bro4sUYJyvmf4",
  authDomain: "scenario-tree.firebaseapp.com",
  databaseURL: "https://scenario-tree.firebaseio.com",
  projectId: "scenario-tree",
  storageBucket: "scenario-tree.appspot.com",
  messagingSenderId: "762202280051",
};

firebase.initializeApp(config);

var session = {};
var service = {};

service.db = firebase.firestore();