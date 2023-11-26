const firebaseConfig = {
    apiKey: "AIzaSyBQr6EEfdnLpSYTSSdjC-UbwD2JfEZ0AB0",
    authDomain: "timeline-23.firebaseapp.com",
    databaseURL: "https://timeline-23-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "timeline-23",
    storageBucket: "timeline-23.appspot.com",
    messagingSenderId: "1096843382269",
    appId: "1:1096843382269:web:b2fced60628ef60a5c1d94",
    measurementId: "G-CDTBKMJB2E"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var auth = firebase.auth();
var uids = ['rCdlsvDQTpcpqzxAmwMyRDueMlB3', 'l7TLRyyEnxV3De8CtSouQGlQccQ2'];

const signinField = document.querySelector('.signin-field');
const mainDiv = document.querySelector('main');

auth.onAuthStateChanged(user => {
    if(user){
        if(uids.includes(user.uid)){
            mainDiv.classList.remove('hide');
            signinField.classList.toggle("hide", true);
            document.querySelector('body').style.backgroundImage = "linear-gradient(to left, rgb(255, 202, 242) , #d5ecf7)";
            retrievData();
        }else{
            alert("Access Denied!");
            auth.signOut();
        }
    }else{
        mainDiv.classList.add('hide');
        signinField.classList.remove("hide");
    }
})

const signinBtn = document.getElementById('signin-btn');

signinBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .catch((error) => {
        console.error(error);
      });
})

const timeline = document.getElementById('timeline');
const addEventBtn = document.getElementById('add-event-btn');
const eventForm = document.getElementById('event-form');
const saveEventBtn = document.getElementById('save-event-btn');
const cancelEventBtn = document.getElementById('cancel-event-btn');
var allDB_data, timeline_len;

function retrievData(){
    var dbDataRef  = database.ref('/');
    dbDataRef.once("value", data => {
        allDB_data = data.val();
    }).then(() => {
        for (let i = 0; i < Object.keys(allDB_data).length; i++) createEvent(i);
        var marker = document.createElement('div');
        marker.classList.add('space');
        marker.style.left = `calc(${timeline_len + 10}vw)`;
        timeline.appendChild(marker);
    })
}

addEventBtn.addEventListener('click', () => {
    eventForm.style.display = 'block';
});

cancelEventBtn.addEventListener('click', () => {
    eventForm.style.display = 'none';
});

saveEventBtn.addEventListener('click', () => {
    const eventDate = document.getElementById('event-date').value;
    const eventDescription = document.getElementById('event-description').value;
    
    if (eventDate && eventDescription) {
        var timestamp = new Date(eventDate).getTime();
        if(Object.keys(allDB_data).includes(timestamp.toString())) timestamp += 10;
        database.ref('/').update({
            [timestamp]: eventDescription
        }).then(() => window.location.reload());
    } else {
        alert('Please fill in all fields.');
    }
});

function createEvent(index) {

    const marker = document.createElement('div');
    const eventElement = document.createElement('div');
    var eventDescription = Object.values(allDB_data)[index];
    var posDiff = parseInt(Object.keys(allDB_data)[index]) - parseInt(Object.keys(allDB_data)[index-1]);
    posDiff = index == 0 ? 0 : posDiff;

    // const positionPercentage = (100 / (Object.keys(allDB_data).length - 1)) * index;
    const positionPercentage = (100 / (Object.keys(allDB_data).length - 1)) * (posDiff/5000000000) * index;
    timeline.style.width = positionPercentage + "vw";
    timeline_len = positionPercentage

    var eventDate = new Date(parseInt(Object.keys(allDB_data)[index])).toLocaleDateString();
    var eventDateList = eventDate.split("/");
    [eventDateList[0], eventDateList[1]] = [eventDateList[1], eventDateList[0]];
    eventDate = eventDateList.join("/");

    marker.classList.add('marker');
    marker.style.left = `${positionPercentage}vw`;
    timeline.appendChild(marker);
    eventElement.classList.add('event');

    eventElement.innerHTML = `<strong>${eventDate}</strong><br>${eventDescription}`;
    eventElement.style.left = `${positionPercentage}vw`;
    timeline.appendChild(eventElement);

    marker.addEventListener('mouseenter', () => {
        eventElement.style.display = 'block';
    });

    marker.addEventListener('mouseleave', () => {
        eventElement.style.display = 'none';
    });
}

const signOut = document.getElementById("sign-out");
signOut.addEventListener('click', () => {
    var confirmBtn = confirm("Sign Out?");
    if(confirmBtn) auth.signOut();
})
