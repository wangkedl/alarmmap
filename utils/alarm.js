//alarm.js:

const util = require('./util.js')

const CHECK_BUFFER_SIZE = 3

function Alarm(data){
  this.latitude = data.latitude
  this.longitude = data.longitude
  this.state = data.state
  this.checkBuffer = []
  this.title = data.title
  this.monitor_type = data.monitor_type
  this.action_type = data.action_type
  this.meaia_url = data.media_url
  this.timer = data.timer
}

Alarm.prototype ={
  constructor:Alarm,

  setTitle: function (t) {
    this.title = t
  },

  setMonitorType:function(m_type){
    this.monitor_type = m_type
  },

  setActionType: function (a_type) {
    this.action_type = a_type
  },

  setMedia: function (url) {
    this.media_url = url
  },

  setTimer: function(t_name) {
    this.timer = t_name
  },

  checkLocation: function (latitude, longitude, accuracy) {
    const app = getApp()
    var that = this;
    var distance = util.getDistance(this.latitude, this.longitude, latitude, longitude)
    app.addLog(distance + "," + accuracy)
    if (distance < accuracy) {
      this.checkBuffer.push(1)
    } else {
      this.checkBuffer.push(-1)
    }

    if (this.checkBuffer.length > CHECK_BUFFER_SIZE) {
      this.checkBuffer.shift()
    }

    var sum = 0;
    that.checkBuffer.forEach(function (value) {sum += value})

    if (this.moitor_type == '接近监控点') {
      if (this.state == 'new') {
        if (sum == -CHECK_BUFFER_SIZE) {
          this.state = 'armed'
        }
      } else if (this.state == 'armed') {
        if (sum == CHECK_BUFFER_SIZE) {
          this.state = 'fired'
        }
      }
    } else {
      if (this.state == 'new') {
        if (sum == CHECK_BUFFER_SIZE) {
          this.state = 'armed'
        }
      } else if (this.state == 'armed') {
        if (sum == -CHECK_BUFFER_SIZE) {
          this.state = 'fired'
        }
      }
    }
  },

  excueteAction: function () {
    play.playVoice(this.media_url) 
  },
};

module.exports = {
  Alarm:Alarm,
}


