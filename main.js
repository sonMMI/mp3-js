const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  songs: [
    {
      name: "12 Giờ",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/1.JPG",
    },
    {
      name: "Biển Và Ánh Trăng",
      singer: "Hà Anh Tuấn - Phương Linh",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/2.JPG",
    },
    {
      name: "Cứ Thế",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/3.JPG",
    },
    {
      name: "Dù Tình Phôi Pha",
      singer: "Hà Anh Tuấn - Hồ Ngọc Hà",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/4.JPG",
    },
    {
      name: "Giấc Mơ Chỉ Là Giấc Mơ",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/5.JPG",
    },
    {
      name: "Giấc Mơ Chưa Đổ Lệ",
      singer: "Hà Anh Tuấn - Hồng Nhung",
      path: "./assets/music/song6.mp3",
      image: "./assets/img/6.JPG",
    },
    {
      name: "Giọt Buồn Để Lại",
      singer: "Hà Anh Tuấn - Phương Linh",
      path: "./assets/music/song7.mp3",
      image: "./assets/img/7.JPG",
    },
    {
      name: "Hạ Cuối",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song8.mp3",
      image: "./assets/img/8.JPG",
    },
    {
      name: "Lạc Lối",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song9.mp3",
      image: "./assets/img/9.JPG",
    },
    {
      name: "Lắng Nghe Mùa Xuân Về",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song10.mp3",
      image: "./assets/img/10.JPG",
    },
    {
      name: "Ngẫu Hứng Phố",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song11.mp3",
      image: "./assets/img/11.JPG",
    },
    {
      name: "Người",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song12.mp3",
      image: "./assets/img/12.JPG",
    },
    {
      name: "Như Yêu Lần Đầu",
      singer: "Hà Anh Tuấn - Phương Linh",
      path: "./assets/music/song13.mp3",
      image: "./assets/img/13.JPG",
    },
    {
      name: "Phượng Và Hạ",
      singer: "Hà Anh Tuấn - Tóc Tiên",
      path: "./assets/music/song14.mp3",
      image: "./assets/img/14.JPG",
    },
    {
      name: "Tết Xuân",
      singer: "Đông Nhi - Issac - Hà Anh Tuấn",
      path: "./assets/music/song15.mp3",
      image: "./assets/img/15.JPG",
    },
    {
      name: "Thuyền Và Biển",
      singer: "Hà Anh Tuấn - Thu Phương",
      path: "./assets/music/song16.mp3",
      image: "./assets/img/16.JPG",
    },
    {
      name: "Tôi Đang Sống",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song17.mp3",
      image: "./assets/img/17.JPG",
    },
    {
      name: "Tuổi Trẻ Thế Hệ Bác Hồ",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song18.mp3",
      image: "./assets/img/18.JPG",
    },
    {
      name: "Yêu Là Chết Ở Trong Lòng",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song19.mp3",
      image: "./assets/img/19.JPG",
    },
    {
      name: "Yêu Người Và Yêu Đời",
      singer: "Hà Anh Tuấn",
      path: "./assets/music/song20.mp3",
      image: "./assets/img/20.JPG",
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  // in ra màn hình các element,...
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                <div class="song ${
                  index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                    <div class="thumb" style="background-image: url('${
                      song.image
                    }')"></div>
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
    playlist.innerHTML = htmls.join("\n");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  // hàm xử lý sự kiện
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // xử lý CD quay / dừng --> dùng Element.animate(keyframes, options)
    const cdThumAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10 second
      iterations: Infinity, // lặp : vô hạn
    });
    cdThumAnimate.pause();

    // sự kiện kéo list => phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop; // kích thước mới của CD

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0; // thay đổi kích thước CD
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumAnimate.play();
    };

    // khi song được pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumAnimate.pause();
    };

    // khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // xử lý khi tua song (seek)
    progress.oninput = function (e) {
      // từ số phần trăm của giây convert sang giây
      const seekTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = seekTime;
      audio.play();
    };

    // khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // xử lí bật / tắt random
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // xử lý lặp lại 1 song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // xử lý next khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNotActive = e.target.closest(".song:not(.active)");
      const songOption = e.target.closest(".option");
      if (!songOption) {
        // xử lý khi click vào song
        if (songNotActive) {
          _this.currentIndex = Number(songNotActive.dataset.index);
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }

        // xử lý click vào Song Option
        if (songOption) {
        }
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
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
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  // hàm chạy
  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();

    // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playList
    this.render();

    // hiển thị trạng thái ban đầu của repeat & random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
