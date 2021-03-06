var mqtt    = require('mqtt');
var mysql      = require('mysql');
//var client  = mqtt.connect('mqtt://localhost');

var value;
var convertedValue;

var PORT = 10000;
var HOST = 'dev.e-mozart.com';
var server = {port:PORT, host:HOST};

var client = mqtt.connect(server);


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Beehive123',
  database : 'beehive'
});

connection.connect(function(err){
  if(!err) {
    console.log("Database is connected ... \n\n");
  } else {
    console.log("Error connecting database ... \n\n");
  }
});

client.on('connect', function () {
  client.subscribe('technetium/sensing/temperature/bedroom');
  //client.publish('presence', 'Hello mqtt');
});

client.on('message', function (topic, message) {
  // message is Buffer
  value = parseFloat(message);
  convertedValue = (value - 500) / 10;
  console.log(convertedValue.toString(),' - ',new Date().toString());

  //SAVE value to DB

  connection.query('INSERT INTO temperatureTest ( measure ) VALUES (' + convertedValue.toString() + ') ', function(err, rows, fields) {
    if (!err)
      console.log('The solution is: ', rows);
      else
        console.log('Error while performing Query.');
      });

//  connection.end();


  //client.end();
});
