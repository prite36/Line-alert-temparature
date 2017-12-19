const request = require('request')
const firebase = require("firebase")
const token = '2C64i629Vr3b772BeF0vw28PJFInVQ0Sig7lPADBnrw'
const HIGH_TEMPARATURE = 30

var config = {
  apiKey: "AIzaSyCjFxu7Ft4mfHp8ksLYoRkOSWeK4tRmI0w",
  authDomain: "showdowndata.firebaseapp.com",
  databaseURL: "https://showdowndata.firebaseio.com",
  projectId: "showdowndata",
  storageBucket: "showdowndata.appspot.com",
  messagingSenderId: "811451470025"
}

firebase.initializeApp(config)
let db = firebase.database().ref('db')
let showdata = []


db.on('child_added', function (snapshot) {
  let item = snapshot.val()
  item.id = snapshot.key
  showdata.push(item)

})


db.on('child_changed', function (snapshot) {
  let id = snapshot.key
  let data = snapshot.val()
  let arrTry = []
  arrTry.push(data)
  showdata = arrTry
  


})
setInterval(() => {alertTemparature ('Node1')},5000)

function alertTemparature (nodeName) {

  let temparature = showdata.find(info => info.node === nodeName).temparature
   console.log("Doing check")
   console.log(temparature.length)
   console.log(temparature[temparature.length-1].valuet*1 >= HIGH_TEMPARATURE)
   console.log(temparature[temparature.length-1].valuet*1)
   console.log("Now temp" + JSON.stringify(temparature[temparature.length-1]) )
  if(temparature[temparature.length-1].valuet*1 >= HIGH_TEMPARATURE ){
    console.log("Send Alert")
    request(
      {
        method: "POST",
        uri: "https://notify-api.line.me/api/notify",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        auth: {
          bearer: token
        },
        form: {
          message: "High Temparature NOW !!! " + JSON.stringify(temparature[temparature.length-1]) + "*C Check your System now !!"
        }
      },
      (err, httpResponse, body) => {}
    )
  }
}