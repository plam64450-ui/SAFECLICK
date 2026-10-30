// SAFECLICK — Tin cảnh báo: kết nối Cloudflare Worker RSS
// Worker hiện trả về { success: true, articles: [...] }.
// File này cũng hỗ trợ định dạng cũ { success: true, news: [...] }.

const NEWS_API = "https://safeclick-news.plam64450.workers.dev/";
const newsState = { items: [], filter: "all", query: "" };

const $news = (id) => document.getElementById(id);

function decodeHtmlEntities(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = String(value ?? "");
  return textarea.value;
}

function cleanText(value) {
  return decodeHtmlEntities(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeDate(value) {
  if (!value) return "Chưa rõ ngày";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa rõ ngày";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function relevanceScore(item) {
  const title = cleanText(item.title || "").toLowerCase();
  const body = cleanText(item.description || item.summary || "").toLowerCase();
  const text = `${title} ${body}`;

  // Chủ đề cốt lõi của SAFECLICK: hành vi lừa đảo và cách chiếm đoạt tài khoản/tiền.
  const strong = [
    /lừa đảo/, /chiếm đoạt/, /giả mạo/, /mạo danh/, /giả danh/,
    /phishing/, /tin nhắn giả/, /website giả/, /trang web giả/,
    /đường link giả/, /link giả/, /mã otp/, /đánh cắp.*tài khoản/,
    /chiếm quyền.*tài khoản/, /cộng tác viên/, /việc nhẹ lương cao/,
    /vay tiền.*lừa/, /đầu tư.*lừa/, /tuyển dụng.*lừa/,
    /deepfake/, /giả giọng/, /giả video/, /mã qr.*lừa/
  ];
  const related = [
    /an toàn thông tin/, /an ninh mạng/, /tấn công mạng/,
    /rò rỉ dữ liệu/, /mã độc/, /mật khẩu/, /tài khoản ngân hàng/,
    /chuyển tiền/, /ngân hàng/, /mạng xã hội/, /zalo/, /facebook/,
    /tiktok/, /vneid/, /công an/, /cảnh báo bảo mật/, /lộ dữ liệu/
  ];

  let score = 0;
  for (const pattern of strong) {
    if (pattern.test(title)) score += 4;
    else if (pattern.test(body)) score += 2;
  }
  for (const pattern of related) {
    if (pattern.test(title)) score += 2;
    else if (pattern.test(body)) score += 1;
  }
  return score;
}

function categoryFor(item) {
  const text = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  if (/deepfake|giả giọng|giả video|cuộc gọi|giọng nói/.test(text)) return "Lừa đảo bằng AI";
  if (/ngân hàng|otp|chuyển tiền|tài khoản ngân hàng/.test(text)) return "Lừa đảo tài chính";
  if (/facebook|zalo|tiktok|mạng xã hội|cộng tác viên|việc nhẹ/.test(text)) return "Lừa đảo mạng xã hội";
  if (/giả mạo|mạo danh|giả danh|vneid|công an|shipper/.test(text)) return "Giả mạo";
  if (/tài khoản|đăng nhập|mật khẩu|đường link|qr|phishing/.test(text)) return "Chiếm đoạt tài khoản";
  return "Cảnh báo lừa đảo";
}

function matchesFilter(item) {
  if (relevanceScore(item) < 2) return false;
  if (newsState.filter === "all") return true;
  const text = `${item.title || ""} ${item.description || ""} ${item.source || ""}`.toLowerCase();
  if (newsState.filter === "giả mạo") return /giả mạo|mạo danh|giả danh|vneid|công an|shipper/.test(text);
  if (newsState.filter === "ngân hàng") return /ngân hàng|otp|chuyển tiền|tài khoản ngân hàng|đầu tư/.test(text);
  if (newsState.filter === "tài khoản") return /tài khoản|đăng nhập|mật khẩu|đường link|qr|phishing/.test(text);
  if (newsState.filter === "cuộc gọi") return /cuộc gọi|giọng nói|deepfake|giả video|giả giọng/.test(text);
  return true;
}

function renderNews() {
  const list = $news("news-list");
  if (!list) return;

  const query = newsState.query.trim().toLocaleLowerCase("vi");
  const items = newsState.items
    .filter((item) => {
      const haystack = `${item.title || ""} ${item.description || ""} ${item.source || ""}`.toLocaleLowerCase("vi");
      return matchesFilter(item) && (!query || haystack.includes(query));
    })
    .sort((a, b) => relevanceScore(b) - relevanceScore(a));

  list.replaceChildren();
  const empty = $news("news-empty");
  if (empty) empty.classList.toggle("hidden", items.length > 0);

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "news-card";

    const top = document.createElement("div");
    top.className = "news-card-top";

    const category = document.createElement("span");
    category.className = "news-category";
    category.textContent = categoryFor(item);

    const date = document.createElement("time");
    date.className = "news-date";
    date.textContent = safeDate(item.pubDate || item.publishedAt || item.date);

    top.append(category, date);

    const title = document.createElement("h3");
    title.textContent = cleanText(item.title) || "Tin cảnh báo";

    const desc = document.createElement("p");
    desc.textContent = cleanText(item.description || item.summary) ||
      "Mở bài gốc để đọc thông tin chi tiết từ nguồn đăng tải.";

    const source = document.createElement("div");
    source.className = "news-source";

    const mark = document.createElement("span");
    mark.className = "source-mark";
    mark.textContent = cleanText(item.source || "SC").slice(0, 2).toUpperCase();

    const sourceName = document.createElement("span");
    sourceName.textContent = cleanText(item.source) || "Nguồn tin";
    source.append(mark, sourceName);

    const actions = document.createElement("div");
    actions.className = "news-card-actions";

    const sourceNote = document.createElement("span");
    sourceNote.textContent = "Thông tin tham khảo";

    const link = document.createElement("a");
    link.textContent = "Đọc bài gốc ↗";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const rawLink = item.link || item.url || "";
    try {
      const url = new URL(rawLink);
      if (url.protocol === "https:" || url.protocol === "http:") {
        link.href = url.href;
      } else {
        throw new Error("Liên kết không an toàn");
      }
    } catch {
      link.href = "#";
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", (event) => event.preventDefault());
    }

    actions.append(sourceNote, link);
    article.append(top, title, desc, source, actions);
    list.append(article);
  });

  const count = $news("news-count");
  if (count) count.textContent = String(items.length);

  const sourceCount = $news("source-count");
  if (sourceCount) {
    sourceCount.textContent = String(
      new Set(newsState.items.map((item) => cleanText(item.source)).filter(Boolean)).size
    );
  }
}

async function loadNews() {
  const status = $news("news-status");
  const button = $news("refresh-news");
  const buttonLabel = button?.querySelector("span");

  if (!status || !button) return;

  button.disabled = true;
  if (buttonLabel) buttonLabel.textContent = "Đang tải...";
  status.textContent = "Đang kết nối nguồn tin...";

  try {
    const response = await fetch(NEWS_API, {
      method: "GET",
      cache: "no-store",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) throw new Error(`Worker trả về HTTP ${response.status}`);

    const data = await response.json();
    const receivedItems = Array.isArray(data.articles)
      ? data.articles
      : Array.isArray(data.news)
        ? data.news
        : null;

    if (data.success !== true || !receivedItems) {
      throw new Error("Worker chưa trả về danh sách articles/news hợp lệ");
    }

    newsState.items = receivedItems.map((item) => ({
      ...item,
      title: cleanText(item.title),
      description: cleanText(item.description || item.summary),
      source: cleanText(item.source),
      link: item.link || item.url || "",
      pubDate: item.pubDate || item.publishedAt || item.date || ""
    }));

    const updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    const updatedLabel = $news("updated-at");
    if (updatedLabel) {
      updatedLabel.textContent = Number.isNaN(updatedAt.getTime())
        ? "Vừa cập nhật"
        : updatedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    }

    status.textContent = `Đã tải ${newsState.items.length} tin từ nguồn RSS. Nhấn “Đọc bài gốc” để xem nội dung đầy đủ.`;
    renderNews();
  } catch (error) {
    console.error("SAFECLICK News:", error);
    newsState.items = [];
    renderNews();
    status.textContent = `Chưa tải được tin: ${error.message}. Hãy thử bấm “Làm mới”.`;
    const updatedLabel = $news("updated-at");
    if (updatedLabel) updatedLabel.textContent = "Chưa tải";
  } finally {
    button.disabled = false;
    if (buttonLabel) buttonLabel.textContent = "Làm mới";
  }
}

const refreshButton = $news("refresh-news");
if (refreshButton) refreshButton.addEventListener("click", loadNews);

const searchInput = $news("news-search");
if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    newsState.query = event.target.value;
    renderNews();
  });
}

const filters = $news("news-filters");
if (filters) {
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    newsState.filter = button.dataset.filter || "all";
    filters.querySelectorAll("[data-filter]").forEach((element) => {
      element.classList.toggle("selected", element === button);
    });
    renderNews();
  });
}

loadNews();
