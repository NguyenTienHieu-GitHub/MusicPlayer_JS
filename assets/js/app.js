/*
  1. Render songs
  2. Scroll top
  3. Play / pause / seek
  4. CD rotate
  5. Next / prve
  6. Random
  7. Next / repeat when ended
  8. Active song
  9. Scroll acctive song into view
  10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER_TienHieu";

const player = $(".player");
const cd = $(".cd");
const heading = $(".name-song");
const singerHeading = $(".singer-song");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#disabledRange");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const timeStart = $(".time-start");
const timeEnd = $(".time-end");
const volumeRange = $(".volume-range");
const volumeIcons = $(".volume-icon");
const iconVolume = $(".bi");
const volumMute = $(".bi-volume-mute-fill");
const volumeDown = $(".bi-volume-down-fill");
const volumeUp = $(".bi-volume-up-fill");
const tabs = $$(".tab-item");
const panes = $$(".tab-pane");
const tabsActive = $(".tab-item.active");
const lines = $(".tabs .line");

const app = {
  //Lấy ra chỉ mục đầu tiên của mảng
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isNext: false,
  isPrev: false,
  isVolume: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Từng quen",
      singer: "Wren Evans, Itsnk",
      path: "./assets/music/TungQuen.mp3",
      image: "./assets/img/WrenEvans.jpg",
    },
    {
      name: "Đánh Đổi",
      singer: "Obito, RPT MCK",
      path: "./assets/music/DanhDoi-Obito.mp3",
      image: "./assets/img/Obito.jpg",
    },
    {
      name: "Simple Love",
      singer: "Obito, Seachains",
      path: "./assets/music/SimpleLove-ObitoSeachains.mp3",
      image: "./assets/img/SimpleLove.jpg",
    },
    {
      name: "Kho Báu Đánh Rơi",
      singer: "tlinh, GREY D",
      path: "./assets/music/KhoBauDanhRoi.mp3",
      image:"./assets/img/nhac-cua-tui.png",
    },
    {
      name: "Tinh Vân",
      singer: "Tryle, Kean",
      path: "./assets/music/TinhVan.mp3",
      image:"./assets/img/nhac-cua-tui.png",
    },
    {
      name: "Sunset In The City",
      singer: "SOOBIN",
      path: "./assets/music/SunsetInTheCity.mp3",
      image:
        "./assets/img/nhac-cua-tui.png",
    },
    {
      name: "Rưng Thông",
      singer: "Tùng, Trang",
      path: "./assets/music/RungThong.mp3",
      image:
        "./assets/img/nhac-cua-tui.png",
    },
    {
      name: "Ngã Tư Không Đèn",
      singer: "Trang, Khoa Vũ",
      path: "./assets/music/NgaTuKhongDen.mp3",
      image: "./assets/img/nhac-cua-tui.png",
    },
    {
      name: "Vũ Trụ Ngừng Trôi",
      singer: "Sweet Liquor",
      path: "./assets/music/VuTruNgungTroi.mp3",
      image:
        "./assets/img/nhac-cua-tui.png",
    },
    {
      name: "Ngày Mây Đen",
      singer: "Pay, Lazii",
      path: "./assets/music/NgayMayDen.mp3",
      image: "./assets/img/nhac-cua-tui.png",
    },
    {
      name: "Em Ơi Tại Sao",
      singer: "Nguyễn Minh Xuân Ái",
      path: "./assets/music/EmOiTaiSao.mp3",
      image:
        "./assets/img/nhac-cua-tui.png",
    },
    {
      name: "Cuộc Sống Có Dài Lâu",
      singer: "Tuấn Anh, Lâm Bảo Ngọc",
      path: "./assets/music/CuocSongCoDaiLau.mp3",
      image:
        "./assets/img/nhac-cua-tui.png",
    },
    {
      name: "Điểm Đến Cuối Cùng",
      singer: "Ngọt",
      path: "./assets/music/DiemDenCuoiCung.mp3",
      image:
        "./assets/img/nhac-cua-tui.png",
    },
    {
      name: "Dắt Em Về Mặt Trăng",
      singer: "Thành Đồng, marzuz",
      path: "./assets/music/DatEmVeMatTrang.mp3",
      image:
        "./assets/img/nhac-cua-tui.png",
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
    `;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;

    //Lấy ra kích thước mặc định của CD
    const cdWidth = cd.offsetWidth;

    //Xử lý  CD quay và dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, //10 seconds
        itetations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    //Xử lý phóng to thu nhỏ CD
    // (document.onscroll = function () {
    //   const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //   const newCdWidth = cdWidth - scrollTop; //Kích thước cd trừ đi kích thước kéo lên để tính ra kích thước cần giảm

    //   cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
    //   cd.style.opacity = newCdWidth / cdWidth;
    // }),
    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    //Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    //Xử lý click icon âm lượng để tắt âm và bật âm
    volumeIcons.onclick = function () {
      _this.isVolume = !_this.isVolume;
      audio.muted = _this.isVolume;
      _this.updateMuteIcon();
    };

    //Xử lý volume kéo tăng giảm âm lượng
    volumeRange.oninput = function () {
      const newVolume = volumeRange.valueAsNumber;
      audio.volume = newVolume;
      _this.updateMuteIcon();
    };

    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (!isNaN(audio.duration)) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
      //Xử lý thời gian chạy khi bắt đầu bài hát
      const minutes = Math.floor(audio.currentTime / 60);
      const seconds = Math.floor(audio.currentTime % 60);

      const formattedTime =
        (minutes < 10 ? "0" : "") +
        minutes +
        ":" +
        (seconds < 10 ? "0" : "") +
        seconds;
      timeStart.textContent = formattedTime;
    };

    //Tổng thời gian bài hát
    audio.ondurationchange = function () {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        const totalMinutes = Math.floor(audio.duration / 60);
        const totalSeconds = Math.floor(audio.duration % 60);

        const formattedTotalDuration =
          (totalMinutes < 10 ? "0" : "") +
          totalMinutes +
          ":" +
          (totalSeconds < 10 ? "0" : "") +
          totalSeconds;
        timeEnd.textContent = formattedTotalDuration;
      } else {
        timeEnd.textContent = "00:00";
      }
    };

    //Xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //Xử lý nhấn sẽ active button
    nextBtn.onmousedown = function () {
      _this.isNext = !_this.isNext;
      nextBtn.classList.toggle("active", _this.isNext);
    };
    nextBtn.onmouseup = function () {
      _this.isNext = !_this.isNext;
      nextBtn.classList.remove("active", _this.isNext);
    };

    prevBtn.onmousedown = function () {
      _this.isPrev = !_this.isPrev;
      prevBtn.classList.toggle("active", _this.isPrev);
    };
    prevBtn.onmouseup = function () {
      _this.isPrev = !_this.isPrev;
      prevBtn.classList.remove("active", _this.isPrev);
    };

    //Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    //Xử lý bật tắt random Song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    //Xử lý lặp lại một Song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    //Xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".options")) {
        //Xử lý click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }
        //Xử lý khi click vào song options
        if (e.target.closest(".options")) {
        }
      }
    };

    // Tap UI
    tabs.forEach((tab, index) => {
      const pane = panes[index];

      tab.onclick = function () {
        $(".tab-item.active").classList.remove("active");
        $(".tab-pane.active").classList.remove("active");

        lines.style.left = this.offsetLeft + "px";
        lines.style.width = this.offsetWidth + "px";

        this.classList.add("active");
        pane.classList.add("active");
      };
    });
  },

  //Tap UI
  requestIdleCallback: function () {
    lines.style.left = tabsActive.offsetLeft + "px";
    lines.style.width = tabsActive.offsetWidth + "px";
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth", // Tùy chọn, tạo hiệu ứng cuộn mượt mà (smooth scroll)
        block: "start", // Tùy chọn, vị trí của phần tử trên trục Y: start, center, end, neatest
        inline: "nearest", // Tùy chọn, vị trí của phần tử trên trục X: start, center, end, neatest
      });
    }, 100);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    singerHeading.textContent = this.currentSong.singer;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  updateMuteIcon: function () {
    if (audio.volume === 0 || this.isVolume) {
      volumMute.style.display = "inline"; // Show mute icon
      volumeUp.style.display = "none";
      volumeDown.style.display = "none";
    } else {
      volumMute.style.display = "none";
      if (audio.volume > 0.5) {
        volumeUp.style.display = "inline"; // Show volume up icon
        volumeDown.style.display = "none";
      } else {
        volumeUp.style.display = "none";
        volumeDown.style.display = "inline"; // Show volume down icon
      }
    }
  },

  nextSong: function () {
    this.currentIndex++;

    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    //Gán cấu hình từ config vào ứng dụng
    this.loadConfig();
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM Events)
    this.handleEvents();

    // Tải thông tin bài đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlists
    this.render();

    //Hiển thị trạng thái ban đầu của button
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
