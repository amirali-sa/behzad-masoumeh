/* ================= دیتابیس (Supabase) — کلیدها را اینجا وارد کنید ================= */
/* پس از ثبت‌نام در supabase.com این دو مقدار را از Settings > API بر دارید */
var EV_DB_CONFIG = {
    url: 'https://uuyhqbxugvvlikfbcdmo.supabase.co',   // Project URL
    apiKey: 'sb_publishable_Lu-O7tZeEYS2gi9c5gCvlQ_odwu6j1y',  // anon public key
    table: 'messages'                                  // جدول پیام‌ها
};

(function () {
    // ---------- عناصر ----------
    var overlay = document.getElementById('evOverlay');
    var dialog = document.getElementById('evDialog');
    var openBtn = document.getElementById('evOpenBtn');
    var closeBtn = document.getElementById('evCloseBtn');
    var form = document.getElementById('evForm');
    var successBox = document.getElementById('evSuccess');
    var nameInput = document.getElementById('evName');
    var msgInput = document.getElementById('evMessage');
    var nameError = document.getElementById('evNameError');

    var CD_TARGET = new Date('2026-10-27T18:00:00+03:30').getTime(); // 1405/08/05 ساعت ۱۸

    // اعداد فارسی
    function faNum(n) {
        var fa = '۰۱۲۳۴۵۶۷۸۹';
        return String(n).replace(/[0-9]/g, function (d) { return fa[+d]; });
    }
    function pad(n) { return String(n).padStart(2, '0'); }

    // ---------- شمارش معکوس ----------
    function tick() {
        var d = CD_TARGET - Date.now();
        var days = 0, hours = 0, mins = 0, secs = 0;
        if (d > 0) {
            days = Math.floor(d / 864e5);
            hours = Math.floor(d % 864e5 / 36e5);
            mins = Math.floor(d % 36e5 / 6e4);
            secs = Math.floor(d % 6e4 / 1e3);
        }
        document.getElementById('evCdDays').textContent = faNum(pad(days));
        document.getElementById('evCdHours').textContent = faNum(pad(hours));
        document.getElementById('evCdMins').textContent = faNum(pad(mins));
        document.getElementById('evCdSecs').textContent = faNum(pad(secs));
    }
    tick();
    setInterval(tick, 1000);

    // ---------- باز و بسته ----------
    function openPopup() {
        overlay.classList.add('ev-visible');
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { overlay.classList.add('ev-show'); });
        });
        document.body.style.overflow = 'hidden';
    }
    function closePopup() {
        overlay.classList.remove('ev-show');
        document.body.style.overflow = '';
        setTimeout(function () { overlay.classList.remove('ev-visible'); }, 300);
    }
    openBtn.addEventListener('click', openPopup);
    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closePopup(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });

    // ---------- ثبت اطلاعات ----------
    function showError(el, show) { el.classList.toggle('active', show); }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = nameInput.value.trim();
        var msg = msgInput.value.trim();

        if (!name) {
            showError(nameError, true);
            nameInput.focus();
            return;
        }
        showError(nameError, false);

        var payload = {
            name: name,
            message: msg || null,
            created_at: new Date().toISOString()
        };

        var btn = form.querySelector('.ev-submit');
        btn.disabled = true;
        btn.textContent = 'در حال ثبت...';

        function done() {
            form.style.display = 'none';
            successBox.style.display = 'block';
            setTimeout(closePopup, 2600);
        }
        function fail() {
            btn.disabled = false;
            btn.textContent = 'ثبت اطلاعات';
            alert('خطایی در ثبت اطلاعات بوجود آمده است');
        }

        var cfg = EV_DB_CONFIG;
        var table = cfg.table || 'rsvps';
        if (cfg.url.indexOf('YOUR-') === -1 && cfg.apiKey.indexOf('YOUR-') === -1) {
            // ذخیره در Supabase (جدول پیام‌ها)
            fetch(cfg.url + '/rest/v1/' + table, {
                method: 'POST',
                headers: {
                    'apikey': cfg.apiKey,
                    'Authorization': 'Bearer ' + cfg.apiKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            }).then(function (r) { r.ok ? done() : fail(); }).catch(fail);
        } else {
            // بدون دیتابیس: ذخیره محلی
            try {
                var arr = JSON.parse(localStorage.getItem('ev_rsvps') || '[]');
                arr.push(payload);
                localStorage.setItem('ev_rsvps', JSON.stringify(arr));
            } catch (err) { }
            done();
        }
    });
})();
