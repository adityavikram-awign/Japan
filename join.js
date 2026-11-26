/* Registration form → Google Sheet (Apps Script) → LINE link + QR.
   Strings for this page live here; shared ones (footer) come from I18N. */
(function () {
  "use strict";

  var LANGS = ["ja", "en"];
  var lang = null;
  try { lang = sessionStorage.getItem("awign_lang"); } catch (e) {}
  if (LANGS.indexOf(lang) === -1) lang = "ja";

  var REG_KEY = "awign_jp_registered";
  var CONSENT_VERSION = "2026-11-26";

  var PREFS = {
    ja: ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"],
    en: ["Hokkaido","Aomori","Iwate","Miyagi","Akita","Yamagata","Fukushima","Ibaraki","Tochigi","Gunma","Saitama","Chiba","Tokyo","Kanagawa","Niigata","Toyama","Ishikawa","Fukui","Yamanashi","Nagano","Gifu","Shizuoka","Aichi","Mie","Shiga","Kyoto","Osaka","Hyogo","Nara","Wakayama","Tottori","Shimane","Okayama","Hiroshima","Yamaguchi","Tokushima","Kagawa","Ehime","Kochi","Fukuoka","Saga","Nagasaki","Kumamoto","Oita","Miyazaki","Kagoshima","Okinawa"],
  };

  var DEVICES = ["iphone12", "android", "iphone_old", "none"];
  var MOUNTS = ["have", "not_yet"];

  var S = {
    ja: {
      title: "参加登録 — Awign Japan",
      step1: "登録", step2: "LINEに追加",
      h1: "参加登録",
      lede: "1分で終わります。登録が終わると、LINE公式アカウントのリンクとQRコードが表示されます。",
      preview: "プレビュー表示中：送信してもデータは保存されません。",
      req: "必須",
      lName: "お名前", lKana: "フリガナ", hKana: "カタカナまたはひらがな（任意）",
      lEmail: "メールアドレス", hEmail: "連絡と本人確認に使います。",
      lPhone: "携帯電話番号", hPhone: "日本の番号（例：090-1234-5678）",
      lPref: "お住まいの都道府県", prefPick: "選択してください",
      lDevice: "お使いのスマートフォン",
      hDevice: "撮影にはiPhone 12以降、またはPixel 6以降・Galaxy S21以降が必要です。",
      dev: {
        iphone12: "iPhone 12以降",
        android: "Android（Pixel 6以降・Galaxy S21以降）",
        iphone_old: "iPhone 11以前",
        none: "上記のどれも持っていない",
      },
      lMount: "スマホ用ヘッドマウントをお持ちですか？",
      hMount: "お持ちでなくても登録できます。ご自身で購入いただき、承認時間が合計20時間に達したら領収書をもとに精算します。",
      mnt: { have: "持っている", not_yet: "まだ持っていない" },
      lAgree: "同意事項",
      cTerms: '<a href="terms.html" target="_blank" rel="noopener">利用規約</a>に同意します',
      cPrivacy: '<a href="privacy.html" target="_blank" rel="noopener">プライバシーポリシー</a>に同意し、入力した情報がインドのAwignチームおよびGoogleのサービス（日本国外）で取り扱われることに同意します',
      cAge: "18歳以上です",
      submit: "同意して登録する",
      sending: "送信中…",
      eReq: "入力してください。",
      eKana: "カタカナまたはひらがなで入力してください。",
      eEmail: "正しいメールアドレスを入力してください。",
      ePhone: "日本の電話番号（0から始まる10〜11桁）を入力してください。",
      eChoose: "1つ選んでください。",
      eAgree: "3つすべてにチェックしてください。",
      eSave: "送信できませんでした。通信環境を確認してもう一度お試しください。解決しない場合は下記までご連絡ください。",
      dH: "登録が完了しました",
      dP: "最後にLINE公式アカウントを友だち追加してください。お仕事の案内はLINEで届きます。",
      dLine: "LINEで友だち追加",
      dQrT: "パソコンで見ている場合",
      dQr: "スマホのLINEアプリでQRコードを読み取ってください。",
      dN1: "上のボタンかQRコードでLINE公式アカウントを友だち追加",
      dN2: "トークで、登録したお名前とメールアドレスを送信",
      dN3: "担当者から始め方（アプリと組織コード）をご案内します",
      dGuide: "始め方ガイドを見る",
      dAgain: "別の方を登録する",
      cT: "お困りのときは",
      cP: "フォームやLINEの追加でうまくいかない場合はこちらへ。",
      cIntl: "（インドの番号・国際電話）",
    },
    en: {
      title: "Sign up — Awign Japan",
      step1: "Sign up", step2: "Add on LINE",
      h1: "Sign up",
      lede: "Takes a minute. When you're done you'll get our LINE Official Account link and QR code.",
      preview: "Preview mode: submissions are not saved.",
      req: "Required",
      lName: "Full name", lKana: "Name in katakana", hKana: "Katakana or hiragana (optional)",
      lEmail: "Email", hEmail: "Used to contact you and confirm it's you.",
      lPhone: "Mobile number", hPhone: "Japanese number (e.g. 090-1234-5678)",
      lPref: "Prefecture you live in", prefPick: "Choose one",
      lDevice: "Your smartphone",
      hDevice: "Recording needs an iPhone 12 or newer, or a Pixel 6 / Galaxy S21 or newer.",
      dev: {
        iphone12: "iPhone 12 or newer",
        android: "Android (Pixel 6+ or Galaxy S21+)",
        iphone_old: "iPhone 11 or older",
        none: "None of these",
      },
      lMount: "Do you have a phone head mount?",
      hMount: "You can sign up without one. You buy it yourself and we pay it back from your receipt once you reach 20 approved hours.",
      mnt: { have: "Yes, I have one", not_yet: "Not yet" },
      lAgree: "Agreement",
      cTerms: 'I agree to the <a href="terms.html" target="_blank" rel="noopener">Terms</a>',
      cPrivacy: 'I agree to the <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>, including my details being handled by the Awign team in India and by Google services outside Japan',
      cAge: "I am 18 or older",
      submit: "Agree and sign up",
      sending: "Sending…",
      eReq: "Please fill this in.",
      eKana: "Please use katakana or hiragana.",
      eEmail: "Please enter a valid email.",
      ePhone: "Enter a Japanese number: 10–11 digits starting with 0.",
      eChoose: "Please choose one.",
      eAgree: "Please tick all three.",
      eSave: "We couldn't send your details. Check your connection and try again. If it keeps failing, contact us below.",
      dH: "You're signed up",
      dP: "Last step: add our LINE Official Account. Work updates are sent on LINE.",
      dLine: "Add friend on LINE",
      dQrT: "On a computer?",
      dQr: "Scan this QR code with the LINE app on your phone.",
      dN1: "Add the LINE Official Account with the button or QR code",
      dN2: "In the chat, send the name and email you signed up with",
      dN3: "We'll reply with how to start (the app and the organization code)",
      dGuide: "See the how-to-start guide",
      dAgain: "Sign up someone else",
      cT: "Need help?",
      cP: "If the form or adding us on LINE doesn't work, contact:",
      cIntl: "(India number, international call)",
    },
  };

  function t() { return S[lang]; }
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- render ---------- */

  function radios(hostId, name, keys, labels) {
    var host = $(hostId);
    var picked = (host.querySelector("input:checked") || {}).value;
    host.innerHTML = keys.map(function (k) {
      return '<label class="jopt"><input type="radio" name="' + name + '" value="' + k + '"' +
        (picked === k ? " checked" : "") + " /><span>" + esc(labels[k]) + "</span></label>";
    }).join("");
  }

  function prefs() {
    var sel = $("i-pref");
    var picked = sel.value;
    sel.innerHTML = '<option value="">' + esc(t().prefPick) + "</option>" +
      PREFS.ja.map(function (p, i) {
        return '<option value="' + p + '"' + (picked === p ? " selected" : "") + ">" + esc(PREFS[lang][i]) + "</option>";
      }).join("");
  }

  function render() {
    var s = t();
    var shared = I18N[lang];
    document.documentElement.lang = lang;
    document.title = s.title;
    document.querySelectorAll("[data-t]").forEach(function (el) {
      var k = el.getAttribute("data-t");
      var v = s[k] !== undefined ? s[k] : k === "rights" ? shared.footRights : shared[k];
      if (v !== undefined) el.textContent = v;
    });
    $("t-terms").innerHTML = s.cTerms;
    $("t-privacy").innerHTML = s.cPrivacy;
    radios("o-device", "device", DEVICES, s.dev);
    radios("o-mount", "mount", MOUNTS, s.mnt);
    prefs();

    LANGS.forEach(function (l) {
      var b = $("l-" + l);
      b.classList.toggle("on", l === lang);
      b.setAttribute("aria-pressed", l === lang ? "true" : "false");
    });

    var mail = CONFIG.CONTACT_EMAIL, tel = CONFIG.CONTACT_PHONE;
    $("c-mail").textContent = mail; $("c-mail").href = "mailto:" + mail;
    $("c-tel").textContent = tel; $("c-tel").href = "tel:" + tel.replace(/[^\d+]/g, "");

    $("line-btn").href = CONFIG.COMMUNITY_URL;
    $("line-id").textContent = CONFIG.LINE_ID;
    $("preview-note").hidden = !!CONFIG.FORM_ENDPOINT;
  }

  /* ---------- validation ---------- */

  function normPhone(raw) {
    var d = String(raw).replace(/[\s\-‐－ー()（）.]/g, "");
    d = d.replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xfee0); });
    if (/^\+?81/.test(d)) d = "0" + d.replace(/^\+?81/, "").replace(/^0/, "");
    return d;
  }

  function setBad(id, bad) {
    $(id).classList.toggle("is-bad", bad);
    return bad;
  }

  function collect() {
    var v = {
      name: $("i-name").value.trim(),
      kana: $("i-kana").value.trim(),
      email: $("i-email").value.trim().toLowerCase(),
      phone: normPhone($("i-phone").value.trim()),
      prefecture: $("i-pref").value,
      device: (document.querySelector('input[name="device"]:checked') || {}).value || "",
      headmount: (document.querySelector('input[name="mount"]:checked') || {}).value || "",
      agree_terms: $("c-terms").checked,
      agree_privacy: $("c-privacy").checked,
      age_18: $("c-age").checked,
    };
    var bad = [];
    if (setBad("f-name", v.name.length < 2)) bad.push("f-name");
    if (setBad("f-kana", !!v.kana && !/^[぀-ゟ゠-ヿ\s　・ー]+$/.test(v.kana))) bad.push("f-kana");
    if (setBad("f-email", !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email))) bad.push("f-email");
    if (setBad("f-phone", !/^0\d{9,10}$/.test(v.phone))) bad.push("f-phone");
    if (setBad("f-pref", !v.prefecture)) bad.push("f-pref");
    if (setBad("f-device", !v.device)) bad.push("f-device");
    if (setBad("f-mount", !v.headmount)) bad.push("f-mount");
    if (setBad("f-agree", !(v.agree_terms && v.agree_privacy && v.age_18))) bad.push("f-agree");
    return { v: v, bad: bad };
  }

  function tracking() {
    var q = new URLSearchParams(location.search);
    var keep = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].forEach(function (k) {
      var val = q.get(k);
      try {
        if (val) sessionStorage.setItem("awign_" + k, val);
        else val = sessionStorage.getItem("awign_" + k);
      } catch (e) {}
      keep[k] = val || "";
    });
    return keep;
  }

  /* ---------- views ---------- */

  function show(done) {
    $("view-form").hidden = done;
    $("view-done").hidden = !done;
    $("js1").classList.toggle("on", !done);
    $("js1").classList.toggle("ok", done);
    $("js2").classList.toggle("on", done);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function submit(e) {
    e.preventDefault();
    $("save-err").hidden = true;
    var r = collect();
    if (r.bad.length) {
      var first = $(r.bad[0]);
      first.scrollIntoView({ block: "center", behavior: "smooth" });
      var input = first.querySelector("input, select");
      if (input) setTimeout(function () { input.focus({ preventScroll: true }); }, 300);
      return;
    }

    var payload = Object.assign({}, r.v, tracking(), {
      website: $("i-website").value,
      consent_version: CONSENT_VERSION,
      lang: lang,
      referrer: document.referrer || "",
      page: location.href.split("#")[0],
      user_agent: navigator.userAgent,
    });

    var btn = $("submit");
    var label = btn.querySelector("span");
    btn.disabled = true;
    label.textContent = t().sending;

    function ok() {
      try { localStorage.setItem(REG_KEY, JSON.stringify({ at: Date.now() })); } catch (err) {}
      if (window.fbq) window.fbq("track", "Lead");
      btn.disabled = false;
      label.textContent = t().submit;
      show(true);
    }
    function fail() {
      btn.disabled = false;
      label.textContent = t().submit;
      $("save-err").hidden = false;
    }

    if (!CONFIG.FORM_ENDPOINT) {
      console.log("[join] preview, not sent:", payload);
      setTimeout(ok, 400);
      return;
    }

    var ctrl = "AbortController" in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
    // text/plain keeps this a "simple" request, so Apps Script needs no CORS preflight.
    fetch(CONFIG.FORM_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined,
    })
      .then(function (res) { return res.json(); })
      .then(function (data) { clearTimeout(timer); if (data && data.ok) ok(); else fail(); })
      .catch(function () { clearTimeout(timer); fail(); });
  }

  /* ---------- wire up ---------- */

  window.toggleTheme = function () {
    var root = document.documentElement;
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("awign_theme", next); } catch (e) {}
  };

  document.addEventListener("DOMContentLoaded", function () {
    tracking(); // remember ad parameters even if the form is sent later
    render();

    LANGS.forEach(function (l) {
      $("l-" + l).addEventListener("click", function () {
        if (l === lang) return;
        lang = l;
        try { sessionStorage.setItem("awign_lang", l); } catch (e) {}
        render();
      });
    });
    $("theme-btn").addEventListener("click", window.toggleTheme);
    $("form").addEventListener("submit", submit);

    // Clear a field's error as soon as it's fixed.
    $("form").addEventListener("input", function (e) {
      var f = e.target.closest(".jf");
      if (f && f.classList.contains("is-bad")) collect();
    });
    $("form").addEventListener("change", function (e) {
      var f = e.target.closest(".jf");
      if (f && f.classList.contains("is-bad")) collect();
    });

    $("again").addEventListener("click", function () {
      try { localStorage.removeItem(REG_KEY); } catch (e) {}
      $("form").reset();
      show(false);
    });

    var registered = false;
    try { registered = !!localStorage.getItem(REG_KEY); } catch (e) {}
    show(registered);
  });
})();
