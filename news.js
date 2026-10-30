// SAFECLICK News UI — kết nối Worker RSS tại NEWS_API
// Thay URL bên dưới bằng URL Worker tin tức đã Deploy.
const NEWS_API = "https://safeclick-news.plam64450.workers.dev/";
const newsState = { items: [], filter: "all", query: "" };
const $news = id => document.getElementById(id);

function safeDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "Chưa rõ ngày" : d.toLocaleDateString("vi-VN", {day:"2-digit",month:"2-digit",year:"numeric"});
}
function categoryFor(item) {
  const text = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  if (/ngân hàng|tài khoản ngân hàng|otp|chuyển tiền/.test(text)) return "Ngân hàng";
  if (/cuộc gọi|giọng nói|deepfake|video call/.test(text)) return "Cuộc gọi";
  if (/giả mạo|mạo danh|công an|vneid|cơ quan/.test(text)) return "Giả mạo";
  if (/tài khoản|đăng nhập|mật khẩu|đường link|qr/.test(text)) return "Tài khoản";
  return "Cảnh báo số";
}
function matchesFilter(item) {
  if (newsState.filter === "all") return true;
  const text = `${item.title || ""} ${item.description || ""} ${item.source || ""}`.toLowerCase();
  if (newsState.filter === "giả mạo") return /giả mạo|mạo danh|vneid|công an/.test(text);
  if (newsState.filter === "ngân hàng") return /ngân hàng|otp|chuyển tiền|tài khoản ngân hàng/.test(text);
  if (newsState.filter === "tài khoản") return /tài khoản|đăng nhập|mật khẩu|đường link|qr/.test(text);
  if (newsState.filter === "cuộc gọi") return /cuộc gọi|giọng nói|deepfake|điện thoại/.test(text);
  return true;
}
function renderNews() {
  const list = $news("news-list");
  const query = newsState.query.trim().toLowerCase();
  const items = newsState.items.filter(item => {
    const haystack = `${item.title || ""} ${item.description || ""} ${item.source || ""}`.toLowerCase();
    return matchesFilter(item) && (!query || haystack.includes(query));
  });
  list.replaceChildren();
  $news("news-empty").classList.toggle("hidden", items.length > 0);
  items.forEach(item => {
    const article = document.createElement("article"); article.className = "news-card";
    const top = document.createElement("div"); top.className = "news-card-top";
    const category = document.createElement("span"); category.className = "news-category"; category.textContent = categoryFor(item);
    const date = document.createElement("time"); date.className = "news-date"; date.textContent = safeDate(item.pubDate);
    top.append(category,date);
    const title = document.createElement("h3"); title.textContent = item.title || "Tin cảnh báo";
    const desc = document.createElement("p"); desc.textContent = item.description || "Mở bài gốc để đọc thông tin chi tiết từ nguồn đăng tải.";
    const source = document.createElement("div"); source.className = "news-source";
    const mark = document.createElement("span"); mark.className = "source-mark"; mark.textContent = (item.source || "SC").trim().slice(0,2).toUpperCase();
    const sourceName = document.createElement("span"); sourceName.textContent = item.source || "Nguồn tin"; source.append(mark,sourceName);
    const actions = document.createElement("div"); actions.className = "news-card-actions";
    const sourceNote = document.createElement("span"); sourceNote.textContent = "Thông tin tham khảo";
    const link = document.createElement("a"); link.textContent = "Đọc bài gốc ↗";
    try { const u = new URL(item.link); if (u.protocol === "https:") { link.href = u.href; link.target = "_blank"; link.rel = "noopener noreferrer"; } else { link.href = "#"; link.setAttribute("aria-disabled","true"); } }
    catch { link.href = "#"; link.setAttribute("aria-disabled","true"); }
    actions.append(sourceNote,link); article.append(top,title,desc,source,actions); list.append(article);
  });
  $news("news-count").textContent = newsState.items.length;
  $news("source-count").textContent = new Set(newsState.items.map(x => x.source).filter(Boolean)).size;
}
async function loadNews() {
  const status = $news("news-status"), button = $news("refresh-news");
  button.disabled = true; button.querySelector("span").textContent = "Đang tải...";
  status.textContent = "Đang kết nối nguồn tin...";
  if (NEWS_API.includes("YOUR-NEWS-WORKER")) {
    status.textContent = "Giao diện đã sẵn sàng. Hãy thay NEWS_API trong news.js bằng địa chỉ Cloudflare Worker để tải tin tự động.";
    button.disabled = false; button.querySelector("span").textContent = "Làm mới"; return;
  }
  try {
    const response = await fetch(NEWS_API, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.success || !Array.isArray(data.articles)) throw new Error("Dữ liệu RSS không hợp lệ");
    newsState.items = data.articles;
    const updated = data.updatedAt ? new Date(data.updatedAt) : new Date();
    $news("updated-at").textContent = Number.isNaN(updated.getTime()) ? "Vừa cập nhật" : updated.toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"});
    status.textContent = `Đã tải ${data.articles.length} tin từ nguồn RSS. Nhấn "Đọc bài gốc" để xem nội dung đầy đủ.`;
    renderNews();
  } catch (error) {
    console.error("SAFECLICK news:", error);
    status.textContent = "Chưa tải được tin. Kiểm tra Worker, RSS và cấu hình CORS rồi thử lại.";
    newsState.items = []; renderNews();
  } finally { button.disabled = false; button.querySelector("span").textContent = "Làm mới"; }
}
$news("refresh-news").addEventListener("click", loadNews);
$news("news-search").addEventListener("input", e => { newsState.query = e.target.value; renderNews(); });
$news("news-filters").addEventListener("click", e => {
  const button = e.target.closest("[data-filter]"); if (!button) return;
  newsState.filter = button.dataset.filter;
  $news("news-filters").querySelectorAll("[data-filter]").forEach(el => el.classList.toggle("selected", el === button));
  renderNews();
});
loadNews();
