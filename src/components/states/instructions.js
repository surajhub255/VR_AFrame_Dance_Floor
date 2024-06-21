var defaultDanceData = require('json!../../../assets/dance.json');

AFRAME.registerComponent('instructions', {
  init: function () {
    this.startButtonEl = document.querySelector('.start-button');
    this.startButtonEl.querySelector('span').innerHTML = 'Connect Wallet';
    this.startButtonEl.querySelector('span').classList.add('loading');
    this.startReplaying = this.startReplaying.bind(this);
    this.loading = true;
    this.danceData = null;
    this.el.sceneEl.addEventListener('loaded', this.downloadDance.bind(this));
  },

  handleDanceData: function (data) {
    this.danceData = data;

    var sceneEl = this.el.sceneEl;
    var inVR = sceneEl.is('vr-mode');

    if (!sceneEl.hasLoaded) {
      sceneEl.addEventListener('loaded', this.handleDanceData.bind(this));
      return;
    }

    if (inVR) {
      this.startReplaying();
    } else {
      this.setupStartButton();
    }
  },

  downloadDance: function () {
    var walletAddress = this.getWalletAddressFromPath();
    var self = this;

    if (walletAddress) {
      var urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('url')) {
        this.el.sceneEl.systems['uploadcare'].download(urlParams.get('url'), function (data) {
          self.handleDanceData(data.content);
        });
      } else {
        this.handleDanceData(defaultDanceData);
      }
    } else {
      this.showConnectWallet();
    }
  },

  getWalletAddressFromPath: function () {
    var pathSegments = window.location.pathname.split('/');
    return pathSegments.length > 1 ? pathSegments[1] : null;
  },

  showConnectWallet: function () {
    var buttonLabelEl = this.startButtonEl.querySelector('span');
    buttonLabelEl.innerHTML = 'Connect Wallet';
    buttonLabelEl.classList.remove('loading');
  },

  setupStartButton: function () {
    var sceneEl = document.querySelector('a-scene');
    if (!sceneEl.hasLoaded) {
      sceneEl.addEventListener('loaded', this.setupStartButton.bind(this));
      return;
    }
    var buttonLabelEl = this.startButtonEl.querySelector('span');
    buttonLabelEl.innerHTML = 'START';
    buttonLabelEl.classList.remove('loading');
  },

  startReplaying: function () {
    if (!this.danceData) { return; }

    var el = this.el;
    document.querySelector('.instructions-overlay').style.display = 'none';
    el.setAttribute('game-state', 'state', 'replay');
    el.components['replay'].loadDance(this.danceData);
  },

  play: function () {
    this.startButtonEl.addEventListener('click', this.startReplaying);
    this.el.sceneEl.addEventListener('enter-vr', this.startReplaying);
  },

  pause: function () {
    this.startButtonEl.removeEventListener('click', this.startReplaying);
    this.el.sceneEl.removeEventListener('enter-vr', this.startReplaying);
  }
});
