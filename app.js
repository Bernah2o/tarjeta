const state = {
  profile: null,
  qrUrl: null,
};

function buildWhatsAppLink(p, extraMessage = "") {
  const siteLink = p.site || window.location.origin;
  const base = `Hola, vi tu tarjeta digital de ${
    p.company || "DH2OCOL"
  }. ${siteLink}`;
  const full = `${base}${extraMessage ? " " + extraMessage : ""}`;
  const waText = encodeURIComponent(full);
  const number = (p.whatsapp || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${number}?text=${waText}`;
}

function setColors(colors) {
  if (!colors) return;
  const root = document.documentElement;
  if (colors.green) root.style.setProperty("--green", colors.green);
  if (colors.blue) root.style.setProperty("--blue", colors.blue);
  if (colors.blue2) root.style.setProperty("--blue2", colors.blue2);
  if (colors.black) root.style.setProperty("--black", colors.black);
}

function initProfile(p) {
  const displayName =
    (p.name && p.name.trim()) ||
    `${(p.first_name || "").trim()} ${(p.last_name || "").trim()}`.trim() ||
    "DH2O";
  document.getElementById("name").textContent = displayName;
  document.getElementById("title").textContent = p.title || "";

  const siteLink = p.site || window.location.origin;
  const waLink = buildWhatsAppLink(p);
  const mailSubject = encodeURIComponent("Consulta DH2O");
  const mailLink = `mailto:${p.email || ""}?subject=${mailSubject}`;

  state.qrUrl = siteLink;

  document.getElementById("wa-link").href = waLink;
  document.getElementById("mail-link").href = mailLink;
  document.getElementById("ig-link").href = p.social?.instagram || "#";
  document.getElementById("fb-link").href = p.social?.facebook || "#";
  const yt = document.getElementById("yt-link");
  if (yt) yt.href = p.social?.youtube || "#";
  document.getElementById("tt-link").href = p.social?.tiktok || "#";

  // Medios de pago: llevan a instrucciones por WhatsApp
  const payLink = (msg) => buildWhatsAppLink(p, msg);
  const btnTransfer = document.getElementById("btn-pay-transfer");
  if (btnTransfer)
    btnTransfer.href = payLink("Quiero pagar por transferencia.");
  const btnCash = document.getElementById("btn-pay-cash");
  if (btnCash) btnCash.href = payLink("Quiero pagar en efectivo.");
  const btnPse = document.getElementById("btn-pay-pse");
  if (btnPse) btnPse.href = payLink("Quiero pagar por PSE.");
  const btnCard = document.getElementById("btn-pay-card");
  if (btnCard) btnCard.href = payLink("Quiero pagar con tarjeta de crédito.");
  const btnInstr = document.getElementById("btn-pay-instructions");
  if (btnInstr)
    btnInstr.href = payLink("Por favor envíame las instrucciones de pago.");

  // Datos personales
  const waNumEl = document.getElementById("whatsapp-number");
  if (waNumEl) waNumEl.textContent = p.whatsapp || "";
  const emailEl = document.getElementById("email-address");
  if (emailEl) emailEl.textContent = p.email || "";
  const openWa = document.getElementById("btn-open-whatsapp");
  if (openWa) openWa.href = waLink;
  const openMail = document.getElementById("btn-open-mail");
  if (openMail) openMail.href = mailLink;

  // Perfil
  const firstEl = document.getElementById("first-name");
  if (firstEl) firstEl.textContent = p.first_name || "—";
  const lastEl = document.getElementById("last-name");
  if (lastEl) lastEl.textContent = p.last_name || "—";
  const jobEl = document.getElementById("job-title");
  if (jobEl) jobEl.textContent = p.job_title || "";
  const companyEl = document.getElementById("company");
  if (companyEl) companyEl.textContent = p.company || "—";
  // Se eliminaron Location y Education del UI

  // Avatar y logo desde profile.json
  const avatarEl = document.getElementById("avatar-img");
  const brandEl = document.getElementById("brand-badge-img");
  if (avatarEl) {
    const avatarSrc = p.avatar || "img/logo.svg";
    avatarEl.src = avatarSrc;
    avatarEl.onerror = () => {
      avatarEl.src = "img/operador.png";
    };
  }
  if (brandEl) {
    const brandSrc = p.brand_logo || "img/operador.png";
    brandEl.src = brandSrc;
    brandEl.onerror = () => {
      brandEl.src = "img/operador.png";
    };
  }

  // Panel superior datos y QR
  const topPhone = document.getElementById("top-phone");
  if (topPhone) topPhone.textContent = p.whatsapp || p.office_phone || "";
  const topEmail = document.getElementById("top-email");
  if (topEmail) {
    topEmail.textContent = p.email || "";
    topEmail.href = p.email ? `mailto:${p.email}` : "#";
  }
  const topSite = document.getElementById("top-site");
  if (topSite) {
    topSite.textContent = p.site || window.location.origin;
    topSite.href = p.site || window.location.origin;
  }
  const btnWebsite = document.getElementById("btn-website");
  if (btnWebsite) btnWebsite.href = p.site || window.location.origin;
  const qrThumb = document.getElementById("qr-thumb");
  if (qrThumb) {
    qrThumb.src = buildQrUrl(siteLink);
    qrThumb.addEventListener("click", showQr);
  }

  setColors(p.colors);
}

function onCopyNequi() {
  const txt = document.getElementById("nequi-number").textContent.trim();
  navigator.clipboard.writeText(txt).then(() => {
    document.getElementById("btn-copy-nequi").textContent = "Copiado";
    setTimeout(
      () => (document.getElementById("btn-copy-nequi").textContent = "Copiar"),
      1500
    );
  });
}

function onCopyWhatsApp() {
  const txt = document.getElementById("whatsapp-number").textContent.trim();
  navigator.clipboard.writeText(txt).then(() => {
    document.getElementById("btn-copy-whatsapp").textContent = "Copiado";
    setTimeout(
      () =>
        (document.getElementById("btn-copy-whatsapp").textContent = "Copiar"),
      1500
    );
  });
}

function onCopyMail() {
  const txt = document.getElementById("email-address").textContent.trim();
  navigator.clipboard.writeText(txt).then(() => {
    document.getElementById("btn-copy-mail").textContent = "Copiado";
    setTimeout(
      () => (document.getElementById("btn-copy-mail").textContent = "Copiar"),
      1500
    );
  });
}

function buildVCard(p) {
  const first = p.first_name || "";
  const last = p.last_name || "";
  const displayName = p.name || `${first} ${last}`.trim() || "DH2O";
  const org = p.company || "DH2O";
  const title = p.job_title || p.title || "";
  const tel = p.whatsapp || "";
  const email = p.email || "";
  const url = p.site || window.location.origin;
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${last};${first};;;`,
    `FN:${displayName}`,
    `ORG:${org}`,
    `TITLE:${title}`,
    `TEL;TYPE=CELL:${tel}`,
    `EMAIL;TYPE=INTERNET:${email}`,
    `URL:${url}`,
    "END:VCARD",
  ].join("\n");
}

function downloadFile(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function onSaveVCard() {
  if (!state.profile) return;
  const vcf = buildVCard(state.profile);
  const blob = new Blob([vcf], { type: "text/vcard" });
  downloadFile("dh2o-contact.vcf", blob);
}

function onShare() {
  const shareData = {
    title: state.profile?.name || "DH2O",
    text: "Tarjeta digital DH2O",
    url: state.profile?.site || window.location.href,
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(shareData.url);
    const btn = document.getElementById("btn-share");
    btn.textContent = "Enlace copiado";
    setTimeout(() => (btn.textContent = "Compartir"), 1500);
  }
}

function buildQrUrl(data) {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encoded}`;
}

function showQr() {
  const modal = document.getElementById("qr-modal");
  const img = document.getElementById("qr-image");
  const url = buildQrUrl(state.qrUrl || window.location.origin);
  img.src = url;
  modal.showModal();
}

function closeQr() {
  const modal = document.getElementById("qr-modal");
  modal.close();
}

async function saveQrImage() {
  const img = document.getElementById("qr-image");
  const resp = await fetch(img.src);
  const blob = await resp.blob();
  downloadFile("dh2o-qr.png", blob);
}

async function bootstrap() {
  document.getElementById("year").textContent = new Date().getFullYear();
  const btnCopyWa = document.getElementById("btn-copy-whatsapp");
  if (btnCopyWa) btnCopyWa.addEventListener("click", onCopyWhatsApp);
  const btnCopyMail = document.getElementById("btn-copy-mail");
  if (btnCopyMail) btnCopyMail.addEventListener("click", onCopyMail);
  const btnVcard = document.getElementById("btn-vcard");
  if (btnVcard) btnVcard.addEventListener("click", onSaveVCard);
  const btnShare = document.getElementById("btn-share");
  if (btnShare) btnShare.addEventListener("click", onShare);
  const btnQr = document.getElementById("btn-qr");
  if (btnQr) btnQr.addEventListener("click", showQr);
  const btnQrCard = document.getElementById("btn-qr-card");
  if (btnQrCard) btnQrCard.addEventListener("click", showQr);
  const btnCloseQr = document.getElementById("btn-close-qr");
  if (btnCloseQr) btnCloseQr.addEventListener("click", closeQr);
  const btnSaveQr = document.getElementById("btn-save-qr");
  if (btnSaveQr) btnSaveQr.addEventListener("click", saveQrImage);

  try {
    const resp = await fetch("profile.json");
    const p = await resp.json();
    state.profile = p;
    initProfile(p);
    // Render chips y subtítulo/bio en la tarjeta
    const chipsEl = document.getElementById("chips");
    if (chipsEl) {
      chipsEl.innerHTML = "";
      (p.tags || []).forEach((t) => {
        const span = document.createElement("span");
        span.className = "chip";
        span.textContent = t;
        chipsEl.appendChild(span);
      });
    }
    const subEl = document.getElementById("subtitle");
    if (subEl) {
      const slogan = "Cuidamos tu Agua, Cuidamos tu Salud";
      subEl.textContent = slogan;
    }
  } catch (e) {
    initProfile({});
  }

  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/service-worker.js");
    } catch (e) {}
  }
}

bootstrap();
