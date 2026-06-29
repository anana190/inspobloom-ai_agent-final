const authView = document.getElementById("authView");
const mainView = document.getElementById("mainView");

const showLoginBtn = document.getElementById("showLoginBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const authMessage = document.getElementById("authMessage");
const welcomeText = document.getElementById("welcomeText");

const analyzeBtn = document.getElementById("analyzeBtn");
const helpfulBtn = document.getElementById("helpfulBtn");
const notHelpfulBtn = document.getElementById("notHelpfulBtn");

const loading = document.getElementById("loading");
const resultBox = document.getElementById("resultBox");
const errorMsg = document.getElementById("errorMsg");

let currentUser = null;
let currentSessionId = null;

try {
  const saved = localStorage.getItem("currentUser");
  currentUser = saved ? JSON.parse(saved) : null;
} catch {
  localStorage.removeItem("currentUser");
  currentUser = null;
}

init();

function init() {
  showLoginBtn.addEventListener("click", showLogin);
  showRegisterBtn.addEventListener("click", showRegister);
  registerBtn.addEventListener("click", registerUser);
  loginBtn.addEventListener("click", loginUser);
  logoutBtn.addEventListener("click", logoutUser);
  analyzeBtn.addEventListener("click", analyzeCreativeBlock);
  helpfulBtn.addEventListener("click", () => saveFeedback("helpful"));
  notHelpfulBtn.addEventListener("click", () => saveFeedback("not_helpful"));

  if (currentUser && currentUser.email) {
    showMainApp();
  } else {
    showAuth();
  }
}

function showLogin() {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  showLoginBtn.classList.add("active");
  showRegisterBtn.classList.remove("active");
  authMessage.textContent = "";
}

function showRegister() {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  showRegisterBtn.classList.add("active");
  showLoginBtn.classList.remove("active");
  authMessage.textContent = "";
}

function registerUser() {
  const name = registerName.value.trim();
  const email = registerEmail.value.trim().toLowerCase();
  const password = registerPassword.value.trim();

  if (!name || !email || !password) {
    authMessage.textContent = "შეავსე ყველა ველი.";
    return;
  }

  if (!email.includes("@")) {
    authMessage.textContent = "შეიყვანე სწორი email.";
    return;
  }

  if (password.length < 6) {
    authMessage.textContent = "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.";
    return;
  }

  const users = getUsers();
  const exists = users.find(user => user.email === email);

  if (exists) {
    authMessage.textContent = "ეს email უკვე რეგისტრირებულია.";
    return;
  }

  const newUser = { name, email, password };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem(`history_${email}`, JSON.stringify([]));

  authMessage.textContent = "რეგისტრაცია დასრულდა. ახლა შეგიძლია შეხვიდე.";

  registerName.value = "";
  registerEmail.value = "";
  registerPassword.value = "";

  showLogin();
}

function loginUser() {
  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    authMessage.textContent = "შეიყვანე email და password.";
    return;
  }

  const users = getUsers();

  const found = users.find(user => user.email === email && user.password === password);

  if (!found) {
    authMessage.textContent = "მომხმარებელი არ არსებობს ან პაროლი არასწორია.";
    return;
  }

  currentUser = {
    name: found.name,
    email: found.email
  };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  loginEmail.value = "";
  loginPassword.value = "";

  showMainApp();
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  currentUser = null;
  currentSessionId = null;
  resultBox.classList.add("hidden");
  showAuth();
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("users")) || [];
  } catch {
    localStorage.setItem("users", JSON.stringify([]));
    return [];
  }
}

function showAuth() {
  authView.classList.remove("hidden");
  mainView.classList.add("hidden");
}

function showMainApp() {
  authView.classList.add("hidden");
  mainView.classList.remove("hidden");

  welcomeText.textContent = `გამარჯობა, ${currentUser.name}`;
  updateDashboard();
  renderHistory();
}

function getHistory() {
  if (!currentUser) return [];

  try {
    return JSON.parse(localStorage.getItem(`history_${currentUser.email}`)) || [];
  } catch {
    localStorage.setItem(`history_${currentUser.email}`, JSON.stringify([]));
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(`history_${currentUser.email}`, JSON.stringify(history));
}

function updateDashboard() {
  const history = getHistory();

  const helpful = history.filter(item => item.feedback === "helpful").length;
  const lastBlock = history.length > 0 ? history[history.length - 1].blockType : "—";

  document.getElementById("totalSessions").textContent = history.length;
  document.getElementById("helpfulCount").textContent = helpful;
  document.getElementById("lastBlock").textContent = lastBlock || "—";
}

async function analyzeCreativeBlock() {
  const text = document.getElementById("userInput").value.trim();

  if (!text) {
    errorMsg.textContent = "გთხოვ შეიყვანე ტექსტი.";
    return;
  }

  errorMsg.textContent = "";
  loading.classList.add("visible");
  resultBox.classList.add("hidden");

  try {
    const response = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        history: getHistory()
      })
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}
      throw new Error(errorData.details || errorData.error || "Server error");
    }

    const result = await response.json();

    displayResult(result);
    saveSession(text, result);

    resultBox.classList.remove("hidden");

  } catch (err) {
    console.error("AI WORKFLOW ERROR:", err);
    errorMsg.textContent = "AI სერვერთან კავშირი ვერ მოხერხდა. შეამოწმე server.js და GEMINI_API_KEY.";
  } finally {
    loading.classList.remove("visible");
  }
}

function displayResult(result) {
  document.getElementById("blockType").textContent = result.blockType || "—";
  document.getElementById("mood").textContent = result.mood || "—";
  document.getElementById("summary").textContent = result.summary || "—";
  document.getElementById("writingPrompt").textContent = result.writingPrompt || "—";
  document.getElementById("actionTask").textContent = result.actionTask || "—";

  renderRecommendations(result.recommendations || {});
}

function saveSession(input, result) {
  const history = getHistory();

  const session = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    input,
    blockType: result.blockType,
    mood: result.mood,
    summary: result.summary,
    writingPrompt: result.writingPrompt,
    actionTask: result.actionTask,
    feedback: "pending"
  };

  history.push(session);
  saveHistory(history);

  currentSessionId = session.id;

  updateDashboard();
  renderHistory();
}

function saveFeedback(feedback) {
  if (!currentSessionId) {
    alert("ჯერ გაუშვი AI Workflow.");
    return;
  }

  const history = getHistory();
  const index = history.findIndex(item => item.id === currentSessionId);

  if (index === -1) {
    alert("მიმდინარე სესია ვერ მოიძებნა.");
    return;
  }

  history[index].feedback = feedback;
  saveHistory(history);

  updateDashboard();
  renderHistory();

  alert(feedback === "helpful" ? "შენახულია: prompt დაგეხმარა." : "შენახულია: prompt არ დაგეხმარა.");
}

function renderRecommendations(recommendations) {
  const list = document.getElementById("recommendations");
  list.innerHTML = "";

  const groups = [
    { title: "Books", items: recommendations.books },
    { title: "Movies", items: recommendations.movies },
    { title: "Music", items: recommendations.music },
    { title: "Exercises", items: recommendations.exercises }
  ];

  groups.forEach(group => {
    if (!group.items || group.items.length === 0) return;

    const title = document.createElement("li");
    title.className = "rec-title";
    title.textContent = group.title;
    list.appendChild(title);

    group.items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  });
}

function renderHistory() {
  const historyList = document.getElementById("historyList");
  const history = getHistory();

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `<p class="muted">ჯერ ისტორია არ გაქვს.</p>`;
    return;
  }

  history.slice().reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";

    div.innerHTML = `
      <strong>${item.blockType || "Creative Block"}</strong>
      <small>${item.date}</small>
      <p>${item.writingPrompt || ""}</p>
      <span class="status ${item.feedback}">${translateFeedback(item.feedback)}</span>
    `;

    historyList.appendChild(div);
  });
}

function translateFeedback(feedback) {
  if (feedback === "helpful") return "დამეხმარა";
  if (feedback === "not_helpful") return "არ დამეხმარა";
  return "შეფასების მოლოდინში";
}