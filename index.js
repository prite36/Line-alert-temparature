const request = require('request')
const firebase = require("firebase")
const express = require('express')
const bodyParser = require('body-parser')
const token = '2C64i629Vr3b772BeF0vw28PJFInVQ0Sig7lPADBnrw'
const HIGH_TEMPARATURE = 30
let app = express()

let config = {
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

/*app.get('/wakeme', function (req,res){
  res.send('I wake up')
})

app.post('/wakeme', function (req,res){
  var data = req.body
  res.sendStatus(200)
})*/

db.on('child_added', function (snapshot) {
  let item = snapshot.val()
  item.id = snapshot.key
  showdata.push(item)
})


db.on('child_changed', function (snapshot) {
  let data = snapshot.val()
  data.id = snapshot.key
  let arrTry = []
  arrTry.push(data)
  showdata = arrTry
  /* When instance changed this parth will update your local variable to update data*/
})
setInterval(() => {
    alertTemparature ('Node1')
    alertInOutBound ('Node1')
    checkNodeDown ('Node1')
 },5000)

setInterval(() => {
   wakeMeup()
}, 300000) // ev


function alertTemparature (nodeName) {

  let temparature = showdata.find(info => info.node === nodeName).temparature
  if(temparature[temparature.length-1].valuet*1 >= HIGH_TEMPARATURE ){
    let Temp = JSON.stringify(temparature[temparature.length-1].valuet)
  Temp = Temp.replace(/(")/g,'')
    let message = " ⚠️⚠️⚠️ High Temparature NOW !!! " + Temp + "*C Check your System now !! ⚠️ ⚠️ ⚠️"
    sendMessageToLine(message)
  }
}

function checkNodeDown(nodeName) {
  let nodeStatusAlive = showdata.find(info => info.node === nodeName).alive
  let nodeStatusAliveShow = showdata.find(info => info.node === nodeName).alive2
  let dataID =  showdata.find(info => info.node === nodeName).id
  console.log("DATA ID = "+ dataID)
  console.log("nodestatusalive " + nodeStatusAlive)
  if(nodeStatusAlive){
    firebase.database().ref('db/' + dataID ).update({
      alive: false
    })
  }else{
    firebase.database().ref('db/' + dataID ).update({
      alive2: false
    })
    let message = "⚠️⚠️⚠️⚠️ Your " + nodeName + " have been down check your system ⚠️⚠️⚠️"
    sendMessageToLine(message)
  }
}

function alertInOutBound (nodeName) {
  let inBound = showdata.find(info => info.node === nodeName).inbound
  let outBound = showdata.find(info => info.node === nodeName).outbound
  let limitIn = showdata.find(info => info.node === nodeName).limitin
  let limitOut = showdata.find(info => info.node === nodeName).limitout

  if(inBound[inBound.length-1].value*1 >= limitIn ){
    // console.log("Send Alert") 
    let overInbound = JSON.stringify(inBound[inBound.length-1].value)
  overInbound = overInbound.replace(/(")/g,'')
    let message = " ⚠️⚠️⚠️ WARNING your system Inbound Over Limitation :" + overInbound + "Check your System now !! ⚠️ ⚠️ ⚠️"
    sendMessageToLine(message)
  }

  if(outBound[outBound.length-1].value*1 >= limitOut ){
    // console.log("Send Alert") 
    let overOutbound = JSON.stringify(outBound[outBound.length-1].value)
  overOutbound = overOutbound.replace(/(")/g,'')
    let message = " ⚠️⚠️⚠️ WARNING your system Outbound Over Limitation :" + overOutbound + "Check your System now !! ⚠️ ⚠️ ⚠️"
    sendMessageToLine(message)
  }

}

function sendMessageToLine(messageToSend) {

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
        message: messageToSend
      }
    },
    (err, httpResponse, body) => {}
  )
}
function wakeMeup () {
  request.get('https://line-alert.herokuapp.com/')
}

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 4000))
app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})
