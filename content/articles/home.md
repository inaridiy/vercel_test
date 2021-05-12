---
title: テストの記事
description: Learn how to use @nuxt/content.
tags:
  - テスト1
  - テスト2
contributor: いなりずし
---

## はじめに

### 開発環境

node.js 　 12 以降
npm 6 以降
Arduino core for the ESP32 1.04 以降

### 作るもの

スマホ等のブラウザから node.js を通して ESP32 に LED の制御信号を送り,ESP32 でリアルタイムに LED を制御します。
またスマホから node.js サーバーには websocket を、node.js から ESP32 には MQTT を用います。

### 対象読者

node.js を触ったことのある人
ESP32 にコードを書き込める人
フルカラー LED を持っている人

## node.js 側の実装

まず以下のコマンドを実行する

```shell
mkdir 好きな名前
cd さっき決めた名前
npm init (質問に答える エンター連打でもヨシ！)
```

### パッケージのインストール

して以下のコマンドを実行ください

```shell
npm install express mosca mqtt socket.io  -s
```

### サーバーのコードを作成

index.js を作成して以下のコードを書き込む

```js [index.js]
//各パッケージの読み込み
const mosca = require('mosca')
var express = require('express');
var app = express();
const server = new mosca.Server()//mqttブローカーを定義
var webserver = require('http').createServer(app);//webサーバーを定義

app.get("/", function (request, response)
{
    response.sendFile(__dirname + '/index.html');
});
webserver.listen(3000);//ポート3000でサーバーを開始
var io = require('socket.io').listen(webserver);
server.on('ready', () => console.log('server started'))

server.on('clientConnected', client =>
    console.log(`client connected: ${client.id}`))

server.on('published', (packet) =>
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost')

client.on('message', (topic, msg) =>
{
    console.log(`topic: ${topic}, msg: ${msg}`)

})
io.on('connection', function (socket)
{
    socket.on('red', function (msg)//赤LEDの値が届いたらその値をESP32に送信する
    {
        console.log("red=" + msg);
        client.publish('esp32/red', msg);
    });
    socket.on('blue', function (msg)//青LEDの値が届いたらその値をESP32に送信する
    {
        console.log("blue=" + msg);
        client.publish('esp32/blue', msg);
    });
    socket.on('green', function (msg)//緑LEDの値が届いたらその値をESP32に送信する
    {
        console.log("green=" + msg);
        client.publish('esp32/green', msg);
    });
});
```

## html ファイルを作成する

index.html を作成して以下のコードを書き込む

```html [index.html]
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ESP32</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"></script>

    <link
      rel="stylesheet"
      href="//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css"
    />
    <style>
      body {
        max-width: 100%;
      }

      .slider {
        width: 300px;
      }
    </style>
  </head>

  <body>
    <p id="redp">red=50</p>
    <input
      type="range"
      value="50"
      min="0"
      max="100"
      step="1"
      id="redrange"
      class="slider"
    />
    <p id="bluep">blue=50</p>
    <input
      type="range"
      value="50"
      min="0"
      max="100"
      step="1"
      id="bluerange"
      class="slider"
    />
    <p id="greenp">green=50</p>
    <input
      type="range"
      value="50"
      min="0"
      max="100"
      step="1"
      id="greenrange"
      class="slider"
    />

    <script>
      const socket = io()
      var redrange = document.getElementById('redrange')
      var redp = document.getElementById('redp')
      var interval = window.setInterval(sendcolor, 25)
      var red = 0,
        blue = 0,
        green = 0
      var oldred = 0,
        oldblue = 0,
        oldgreen = 0
      redrange.oninput = function () {
        redp.innerHTML = 'red=' + this.value
        red = this.value
      }

      var bluerange = document.getElementById('bluerange')
      var bluep = document.getElementById('bluep')
      bluerange.oninput = function () {
        bluep.innerHTML = 'blue=' + this.value
        blue = this.value
      }

      var greenrange = document.getElementById('greenrange')
      var greenp = document.getElementById('greenp')
      greenrange.oninput = function () {
        greenp.innerHTML = 'green=' + this.value
        green = this.value
      }

      function sendcolor() {
        if (red != oldred) {
          oldred = red
          socket.emit('red', red)
        }
        if (blue != oldblue) {
          oldblue = blue
          socket.emit('blue', blue)
        }
        if (green != oldgreen) {
          oldgreen = green
          socket.emit('green', green)
        }
      }
    </script>
  </body>
</html>
```

## ESP32 にコードを書き込む

まずhttps://github.com/knolleary/pubsubclient
より PubSubClient ライブラリを入れて以下のコードを書き込む

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
const char ssid[] = "あなたの家のSSID";
const char passwd[] = "あなたの家のpasswd";
const char* mqtt_server = "mqttブローカー(nodejsサーバー)のIPアドレス";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
int red=0,blue=0,green=0;
const int ledR = A18;
const int ledG = A4;
const int ledB = A5;
void setup() {

  ledcSetup(0, 12800, 8);

  ledcAttachPin(ledR, 0);


  ledcSetup(1, 12800, 8);

  ledcAttachPin(ledG, 1);


  ledcSetup(2, 12800, 8);

  ledcAttachPin(ledB, 2);
  Serial.begin(115200);

  connectWiFi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}
void loop() {
   if ( WiFi.status() == WL_DISCONNECTED ) {
            connectWiFi();
        }
  if (!client.connected()) {
    reconnect();
  }
  client.loop();


    //client.publish("esp32/temperature", "ddd");


  }

void connectWiFi()
{
  WiFi.begin(ssid, passwd);
  Serial.print("WiFi connecting...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }
  Serial.print(" connected. ");
  Serial.println(WiFi.localIP());
}
void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;

  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  if (String(topic) == "esp32/red") {
red=messageTemp.toInt()*255/100;
  }
   if (String(topic) == "esp32/blue") {
blue=messageTemp.toInt()*255/100;
  }
   if (String(topic) == "esp32/green") {
green=messageTemp.toInt()*255/100;
  }
  ledcontrol();
}
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
   Serial.println("Connecting to MQTT...");
    String clientId = "ESP32-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Subscribe
      client.subscribe("esp32/red");
      client.subscribe("esp32/blue");
      client.subscribe("esp32/green");
    }
     delay(1000);
            randomSeed(micros());
  }
}
void ledcontrol(){
  Serial.println(red);

ledcWrite(0,red);
ledcWrite(1,blue);
ledcWrite(2,green);
}
```

## ESP32 に配線をする

フルカラー LED をそれぞれ 32,33,25 に接続する #起動する
まず以下のコマンドを実行する

```shell
node index.js
```

次に ESP32 に電源を入れる
ブラウザから サーバーの IP:3000 　にアクセスする

以上です。

## 終わりに

初めての Qiita なので見るに堪えないところがあればご指摘お願いします。
また今日使ったコードは github にあげています。
https://github.com/iotConnecter/iotprototypes

## 参考サイト

https://wak-tech.com/archives/752
https://qiita.com/hilucky/items/0e394760a1445593cea5
