const mqtt = require('mqtt')
const brokerAddress = "10.45.3.187:1883"
const client  = mqtt.connect(`mqtt://${brokerAddress}`)

client.on('connect', function () {
    console.log(`Connected to broker: ${brokerAddress}`);
  })

function sendPublicState (state) {
  client.publish(`publicstate/${state.id}`, JSON.stringify(state))
}

function sendPrivateState (state) {
  client.publish(`privatestate/${state.id}/${state.player}`, JSON.stringify(state))
}

function sendAdminState (state) {
  client.publish(`adminstate/${state.id}`, JSON.stringify(state))
}
function sendGamesList (games) {
  const message = games.map(n => ({id: n.id, players: n.players.length, status: n.status}))
  client.publish('games', JSON.stringify(message))
}

exports.sendStates = {sendPublicState: sendPublicState,
                      sendPrivateState: sendPrivateState,
                      sendAdminState: sendAdminState,
                      sendGamesList: sendGamesList}