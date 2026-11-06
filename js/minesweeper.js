/* Webdows Minesweeper: a from-scratch tribute to the classic. No framework, no dependencies. */
(function () {
  var LEVELS = {
    beginner: { name: "Beginner", rows: 9, cols: 9, mines: 10 },
    intermediate: { name: "Intermediate", rows: 16, cols: 16, mines: 40 },
    expert: { name: "Expert", rows: 16, cols: 30, mines: 99 }
  };

  var FACES = {
    smile: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8.5" fill="#ff0" stroke="#000"/><rect x="6.5" y="6.5" width="2" height="2"/><rect x="11.5" y="6.5" width="2" height="2"/><path d="M6 12.5q4 3.5 8 0" fill="none" stroke="#000" stroke-width="1.4"/></svg>',
    oh: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8.5" fill="#ff0" stroke="#000"/><rect x="6.5" y="6" width="2" height="2.5"/><rect x="11.5" y="6" width="2" height="2.5"/><circle cx="10" cy="13.5" r="2" fill="none" stroke="#000" stroke-width="1.4"/></svg>',
    cool: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8.5" fill="#ff0" stroke="#000"/><path d="M3.5 7h13v1l-1 2.5h-4l-1-2h-1l-1 2h-4l-1-2.5z"/><path d="M6.5 13q3.5 2.5 7 0" fill="none" stroke="#000" stroke-width="1.4"/></svg>',
    dead: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8.5" fill="#ff0" stroke="#000"/><path d="M6 6l3 3M9 6l-3 3M11 6l3 3M14 6l-3 3" stroke="#000" stroke-width="1.3"/><path d="M6.5 14.5q3.5-3 7 0" fill="none" stroke="#000" stroke-width="1.4"/></svg>'
  };

  var MINE = '<svg viewBox="0 0 16 16" width="12" height="12"><g stroke="#000" stroke-width="1.5"><path d="M8 1v14M1 8h14M3 3l10 10M13 3L3 13"/></g><circle cx="8" cy="8" r="4.5"/><rect x="5.5" y="5.5" width="2" height="2" fill="#fff"/></svg>';
  var FLAG = '<svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 2L3 5l5 3z" fill="#f00"/><path d="M8 2v9" stroke="#000" stroke-width="1.5"/><path d="M5 12h6v1.5H4V12z"/></svg>';

  function bestTimes() {
    try {
      return JSON.parse(localStorage.getItem("webdows-mines-best") || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveBest(level, secs) {
    try {
      var b = bestTimes();
      if (!b[level] || secs < b[level]) {
        b[level] = secs;
        localStorage.setItem("webdows-mines-best", JSON.stringify(b));
        return true;
      }
    } catch (e) {}
    return false;
  }

  function pad3(n) {
    n = Math.max(-99, Math.min(999, n));
    return n < 0 ? "-" + String(-n).padStart(2, "0") : String(n).padStart(3, "0");
  }

  function mount(root, opts) {
    opts = opts || {};
    var levelKey = "beginner";
    try {
      levelKey = localStorage.getItem("webdows-mines-level") || "beginner";
    } catch (e) {}
    if (!LEVELS[levelKey]) levelKey = "beginner";

    var L, cells, state, revealedCount, flags, timer, seconds, $cells;

    root.innerHTML =
      '<div class="ms">' +
      '  <div class="ms-menubar">' +
      '    <div class="ms-menu"><span class="ms-menu-title"><u>G</u>ame</span>' +
      '      <div class="ms-dropdown">' +
      '        <div data-cmd="new">New<span>F2</span></div><hr>' +
      '        <div data-cmd="beginner" class="ms-level"><b>&#10003;</b>Beginner</div>' +
      '        <div data-cmd="intermediate" class="ms-level"><b>&#10003;</b>Intermediate</div>' +
      '        <div data-cmd="expert" class="ms-level"><b>&#10003;</b>Expert</div><hr>' +
      '        <div data-cmd="best">Best Times...</div><hr>' +
      '        <div data-cmd="exit">Exit</div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="ms-menu"><span class="ms-menu-title"><u>H</u>elp</span>' +
      '      <div class="ms-dropdown">' +
      '        <div data-cmd="howto">How to Play</div><hr>' +
      '        <div data-cmd="about">About Minesweeper...</div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="ms-body">' +
      '    <div class="ms-top">' +
      '      <div class="ms-led ms-count">010</div>' +
      '      <button class="ms-face" aria-label="New game">' + FACES.smile + '</button>' +
      '      <div class="ms-led ms-time">000</div>' +
      '    </div>' +
      '    <div class="ms-grid" role="grid"></div>' +
      '  </div>' +
      '  <div class="ms-note"></div>' +
      '</div>';

    var el = root.querySelector(".ms");
    var grid = el.querySelector(".ms-grid");
    var face = el.querySelector(".ms-face");
    var countEl = el.querySelector(".ms-count");
    var timeEl = el.querySelector(".ms-time");
    var note = el.querySelector(".ms-note");

    function showNote(html) {
      note.innerHTML = html + '<div class="ms-note-btn"><button class="button">OK</button></div>';
      note.style.display = "block";
    }
    note.addEventListener("click", function (e) {
      if (e.target.tagName === "BUTTON") note.style.display = "none";
    });

    function setFace(f) {
      face.innerHTML = FACES[f];
    }

    function stopTimer() {
      clearInterval(timer);
      timer = null;
    }

    function newGame(key) {
      if (key) {
        levelKey = key;
        try {
          localStorage.setItem("webdows-mines-level", key);
        } catch (e) {}
      }
      L = LEVELS[levelKey];
      stopTimer();
      seconds = 0;
      flags = 0;
      revealedCount = 0;
      state = "ready";
      cells = [];
      for (var r = 0; r < L.rows; r++) {
        for (var c = 0; c < L.cols; c++) {
          cells.push({ r: r, c: c, mine: false, n: 0, open: false, mark: 0 });
        }
      }
      grid.style.gridTemplateColumns = "repeat(" + L.cols + ", 16px)";
      var html = "";
      for (var i = 0; i < cells.length; i++) html += '<div class="ms-cell" data-i="' + i + '"></div>';
      grid.innerHTML = html;
      $cells = grid.children;
      countEl.textContent = pad3(L.mines);
      timeEl.textContent = "000";
      setFace("smile");
      el.querySelectorAll(".ms-level").forEach(function (n) {
        n.classList.toggle("on", n.getAttribute("data-cmd") === levelKey);
      });
      if (opts.onResize) opts.onResize();
    }

    function idx(r, c) {
      return r * L.cols + c;
    }

    function neighbours(i) {
      var cell = cells[i], out = [];
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          var r = cell.r + dr, c = cell.c + dc;
          if (r >= 0 && r < L.rows && c >= 0 && c < L.cols) out.push(idx(r, c));
        }
      }
      return out;
    }

    // Mines are laid after the first click, so the first click (and its neighbours) is always safe
    function layMines(safe) {
      var banned = {};
      banned[safe] = true;
      neighbours(safe).forEach(function (n) {
        banned[n] = true;
      });
      var pool = [];
      for (var i = 0; i < cells.length; i++) if (!banned[i]) pool.push(i);
      for (var m = 0; m < L.mines && pool.length; m++) {
        var pick = Math.floor(Math.random() * pool.length);
        cells[pool[pick]].mine = true;
        pool.splice(pick, 1);
      }
      cells.forEach(function (cell, i) {
        cell.n = neighbours(i).filter(function (n) {
          return cells[n].mine;
        }).length;
      });
    }

    function startTimer() {
      timer = setInterval(function () {
        seconds = Math.min(999, seconds + 1);
        timeEl.textContent = pad3(seconds);
      }, 1000);
    }

    function paint(i) {
      var cell = cells[i], d = $cells[i];
      d.className = "ms-cell";
      d.innerHTML = "";
      if (cell.open) {
        d.classList.add("open");
        if (cell.mine) d.innerHTML = MINE;
        else if (cell.n) {
          d.textContent = cell.n;
          d.classList.add("n" + cell.n);
        }
      } else if (cell.mark === 1) d.innerHTML = FLAG;
      else if (cell.mark === 2) d.textContent = "?";
    }

    function reveal(i) {
      var stack = [i];
      while (stack.length) {
        var j = stack.pop(), cell = cells[j];
        if (cell.open || cell.mark === 1) continue;
        cell.open = true;
        cell.mark = 0;
        revealedCount++;
        paint(j);
        if (!cell.mine && cell.n === 0) {
          neighbours(j).forEach(function (n) {
            if (!cells[n].open) stack.push(n);
          });
        }
      }
    }

    function lose(hit) {
      state = "lost";
      stopTimer();
      setFace("dead");
      cells.forEach(function (cell, i) {
        if (cell.mine && cell.mark !== 1) {
          cell.open = true;
          paint(i);
        } else if (!cell.mine && cell.mark === 1) {
          $cells[i].classList.add("wrong");
        }
      });
      $cells[hit].classList.add("boom");
    }

    function checkWin() {
      if (revealedCount === cells.length - L.mines) {
        state = "won";
        stopTimer();
        setFace("cool");
        cells.forEach(function (cell, i) {
          if (cell.mine) {
            cell.mark = 1;
            paint(i);
          }
        });
        countEl.textContent = "000";
        if (saveBest(levelKey, seconds)) {
          showNote("<p>You have the fastest time for " + L.name.toLowerCase() + " level: <b>" + seconds + " seconds</b>.</p>");
        }
      }
    }

    function open(i) {
      if (state === "won" || state === "lost") return;
      var cell = cells[i];
      if (cell.mark === 1) return;
      if (state === "ready") {
        layMines(i);
        state = "playing";
        startTimer();
      }
      if (cell.open) return chord(i);
      if (cell.mine) {
        cell.open = true;
        paint(i);
        return lose(i);
      }
      reveal(i);
      checkWin();
    }

    // Clicking a number with the right count of flags around it opens the rest
    function chord(i) {
      var cell = cells[i];
      if (!cell.open || !cell.n) return;
      var around = neighbours(i);
      var flagged = around.filter(function (n) {
        return cells[n].mark === 1;
      }).length;
      if (flagged !== cell.n) return;
      for (var k = 0; k < around.length; k++) {
        var n = around[k];
        if (!cells[n].open && cells[n].mark !== 1) {
          if (cells[n].mine) {
            cells[n].open = true;
            paint(n);
            return lose(n);
          }
          reveal(n);
        }
      }
      checkWin();
    }

    function mark(i) {
      if (state === "won" || state === "lost") return;
      var cell = cells[i];
      if (cell.open) return;
      cell.mark = (cell.mark + 1) % 3;
      if (cell.mark === 1) flags++;
      if (cell.mark === 2) flags--;
      countEl.textContent = pad3(L.mines - flags);
      paint(i);
    }

    // ---- Input ----
    var pressTimer = null, longPressed = false;
    // Ignore stray clicks left over from the double-click that opened the window
    var mountedAt = Date.now();
    function tooSoon() {
      return Date.now() - mountedAt < 400;
    }

    grid.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    grid.addEventListener("mousedown", function (e) {
      var t = e.target.closest(".ms-cell");
      if (!t || state === "won" || state === "lost" || tooSoon()) return;
      if (e.button === 0) setFace("oh");
      if (e.button === 2) mark(+t.dataset.i);
      if (e.button === 1) {
        e.preventDefault();
        chord(+t.dataset.i);
      }
    });

    document.addEventListener("mouseup", function () {
      if (state === "ready" || state === "playing") setFace("smile");
    });

    grid.addEventListener("click", function (e) {
      if (longPressed) {
        longPressed = false;
        return;
      }
      var t = e.target.closest(".ms-cell");
      if (t && !tooSoon()) open(+t.dataset.i);
    });

    // Touch: long-press to flag
    grid.addEventListener(
      "touchstart",
      function (e) {
        var t = e.target.closest(".ms-cell");
        if (!t) return;
        longPressed = false;
        pressTimer = setTimeout(function () {
          longPressed = true;
          mark(+t.dataset.i);
          if (navigator.vibrate) navigator.vibrate(30);
        }, 400);
      },
      { passive: true }
    );
    ["touchend", "touchmove", "touchcancel"].forEach(function (ev) {
      grid.addEventListener(ev, function () {
        clearTimeout(pressTimer);
      }, { passive: true });
    });

    face.addEventListener("click", function () {
      newGame();
    });

    // Menus
    el.querySelectorAll(".ms-menu-title").forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.stopPropagation();
        var menu = t.parentNode;
        var wasOpen = menu.classList.contains("open");
        el.querySelectorAll(".ms-menu").forEach(function (m) {
          m.classList.remove("open");
        });
        if (!wasOpen) menu.classList.add("open");
      });
    });
    document.addEventListener("click", function () {
      el.querySelectorAll(".ms-menu").forEach(function (m) {
        m.classList.remove("open");
      });
    });
    el.querySelectorAll(".ms-dropdown [data-cmd]").forEach(function (item) {
      item.addEventListener("click", function () {
        var cmd = item.getAttribute("data-cmd");
        if (cmd === "new") newGame();
        else if (LEVELS[cmd]) newGame(cmd);
        else if (cmd === "best") {
          var b = bestTimes();
          showNote(
            "<p><b>Fastest Mine Sweepers</b></p>" +
              Object.keys(LEVELS)
                .map(function (k) {
                  return "<div class='ms-best'><span>" + LEVELS[k].name + ":</span><span>" + (b[k] ? b[k] + " seconds" : "999 seconds") + "</span></div>";
                })
                .join("")
          );
        } else if (cmd === "howto") {
          showNote(
            "<p><b>How to play</b></p><p>Click a square to open it. Numbers tell you how many mines touch that square. " +
              "Right-click (or long-press) to flag a mine. Click a number once all its mines are flagged to open the rest around it.</p>" +
              "<p>Open every square without a mine to win. The first click is always safe.</p>"
          );
        } else if (cmd === "about") {
          showNote("<p><b>Webdows Minesweeper</b></p><p>Written from scratch for Webdows as a tribute to the classic. No mines were harmed.</p>");
        } else if (cmd === "exit" && opts.onExit) opts.onExit();
      });
    });

    function onKey(e) {
      if (e.key === "F2" && document.body.contains(el)) {
        e.preventDefault();
        newGame();
      }
    }
    document.addEventListener("keydown", onKey);

    newGame();

    return {
      destroy: function () {
        stopTimer();
        document.removeEventListener("keydown", onKey);
      }
    };
  }

  window.Minesweeper = { mount: mount };
})();
