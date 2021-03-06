const util = require("../../utils/util.js");
const app = getApp()
Page({
  player: undefined,

  data: {
    images: [
      "../../res/imgs/slide01.jpg",
      "../../res/imgs/slide02.jpg",
      "../../res/imgs/slide03.jpg"
    ],
    swiperCurrent: 0,
    mnavbarsArr: ["听过的词语", "听过的句子"],
    activeIndex: 0,
    mtranslatex: 0,
    his_dict: [],
    his_sents: []
  },

  onLoad: function () {
    this.setData({
      mtranslatex: util.getmscreenWidth() * 145
    })
  },

  onShow: function() {
    this.setData({
      his_dict: app.globalData.his_dict,
      his_sents: app.globalData.his_sents
    });
  },

  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },

  navbarTap: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.href
    })
  },

  mnavbarclik: function(e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {
      this.setData({
        mtranslatex: util.getmscreenWidth() * 145,
      });
    }
    if (e.currentTarget.id == 1) {
      this.setData({
        mtranslatex: util.getmscreenWidth() * 520,
      });
    }
  },

  playaudio: function (e) {
    var ln = ''
    if (this.data.activeIndex == 1) {
      ln = 'his_sents'
    } else {
      ln = 'his_dict'
    }
    if (this.player != undefined) {
      this.setData({
        [ln + '[' + this.player.id + '].play']: 0
      })
      this.player.destroy()
      this.player = undefined
    }
    this.player = wx.createInnerAudioContext()
    this.player.id = e.currentTarget.dataset.idx
    this.player.autoplay = true
    this.player.src = app.globalData.domain + 'sounds/' + e.currentTarget.dataset.href
    this.player.onPlay(() => {
      this.setData({
        [ln + '[' + this.player.id + '].play']: 1
      })
    })
    this.player.onEnded(() => {
      this.setData({
        [ln + '[' + this.player.id + '].play']: 0
      })
      this.player.destroy()
      this.player = undefined
    })
  },

  pauseaudio: function (e) {
    if (this.player.paused) {
      this.player.play()
    } else {
      this.player.pause()
    }
  },

  upload: function() {
    wx.showActionSheet({
      itemList: ['上传词语', '上传句子'],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../upload/dict'
          })
        } else {
          wx.navigateTo({
            url: '../upload/sents'
          })
        }
      },
      fail: function(res) {
        //console.log(res.errMsg)
      }
    })
  }
})