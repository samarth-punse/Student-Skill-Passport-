document.addEventListener("DOMContentLoaded", () => {
  const f = document.getElementById("loginForm");
  if (f)
    f.addEventListener("submit", e => {
      e.preventDefault();
      document.getElementById("message").textContent = "Demo sign-in successful. Opening dashboard…";
      setTimeout(() => location.href = "dashboard.html", 500);
    });
    
  const s = document.getElementById("signup");
  if (s)
    s.onclick = () => alert("Sign-up will be implemented in a later phase. This is a frontend prototype.");
    
  const sh = document.getElementById("share");
  if (sh)
    sh.onclick = () => alert("Profile sharing is a planned feature. This local prototype has no public profile URL yet.");
    
  const a = document.getElementById("addSkill");
  if (a)
    a.onclick = () => {
      let name = prompt("Enter a skill to add (demo only):");
      if (name && name.trim()) {
        let d = document.createElement("div");
        d.className = "skill";
        d.innerHTML = '<span><strong></strong><small>Beginner · Newly added in this demo</small></span><div class="level"><i style="width:20%"></i></div><label class="self">Self-declared</label>';
        d.querySelector("strong").textContent = name.trim();
        document.getElementById("skillList").appendChild(d);
      }
    };
});