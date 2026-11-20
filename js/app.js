
document.addEventListener("DOMContentLoaded", () => {

  // LOGIN
  const f = document.getElementById("loginForm");

  if (f) {
    f.addEventListener("submit", e => {
      e.preventDefault();

      document.getElementById("message").textContent =
        "Demo sign-in successful. Opening dashboard…";

      setTimeout(() => {
        location.href = "dashboard.html";
      }, 500);
    });
  }

  // SIGNUP
  const s = document.getElementById("signup");

  if (s) {
    s.onclick = () =>
      alert("Sign-up will be implemented in a later phase. This is a frontend prototype.");
  }

  // PROFILE SHARING
  const sh = document.getElementById("share");

  if (sh) {
    sh.onclick = () =>
      alert("Profile sharing is a planned feature. This local prototype has no public profile URL yet.");
  }

  // PROFILE PHOTO
  const photoInput = document.getElementById("photoInput");
  const editPhoto = document.getElementById("editPhoto");
  const profilePhoto = document.getElementById("profilePhoto");
  const defaultAvatar = document.getElementById("defaultAvatar");
  const photoContainer = document.querySelector(".photo-container");

  const PHOTO_STORAGE_KEY = "skillPassportProfilePhoto";
  const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

  if (photoInput && editPhoto && profilePhoto && defaultAvatar) {

    // Prepare photo display
    photoContainer.style.position = "relative";
    photoContainer.style.flexShrink = "0";

    profilePhoto.style.width = "100px";
    profilePhoto.style.height = "100px";
    profilePhoto.style.borderRadius = "50%";
    profilePhoto.style.objectFit = "cover";
    profilePhoto.style.display = "none";

    // Create remove photo button
    const removePhoto = document.createElement("button");

    removePhoto.type = "button";
    removePhoto.textContent = "Remove photo";
    removePhoto.className = "photo-remove-btn";
    removePhoto.style.display = "none";

    photoContainer.appendChild(removePhoto);

    // Display selected photo
    function displayPhoto(photoData) {
      profilePhoto.src = photoData;
      profilePhoto.style.display = "block";
      defaultAvatar.style.display = "none";
      removePhoto.style.display = "block";
    }

    // Restore saved photo
    try {
      const savedPhoto = localStorage.getItem(PHOTO_STORAGE_KEY);

      if (savedPhoto) {
        displayPhoto(savedPhoto);
      }
    } catch (error) {
      console.error("Unable to restore profile photo:", error);
    }

    // Open file picker
    editPhoto.addEventListener("click", () => {
      photoInput.click();
    });

    // Select and process photo
    photoInput.addEventListener("change", () => {
      const file = photoInput.files[0];

      if (!file) return;

      const validTypes = ["image/jpeg", "image/png"];

      if (!validTypes.includes(file.type)) {
        alert("Please select a JPG, JPEG or PNG image.");
        photoInput.value = "";
        return;
      }

      if (file.size > MAX_PHOTO_SIZE) {
        alert("Image size must be less than 2 MB.");
        photoInput.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = event => {
        const image = new Image();

        image.onload = () => {
          // Resize and compress image for browser storage
          const canvas = document.createElement("canvas");
          const maxDimension = 512;

          let width = image.width;
          let height = image.height;

          if (width > height && width > maxDimension) {
            height = Math.round(height * maxDimension / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round(width * maxDimension / height);
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;

          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, width, height);

          const compressedPhoto = canvas.toDataURL("image/jpeg", 0.8);

          try {
            localStorage.setItem(PHOTO_STORAGE_KEY, compressedPhoto);
            displayPhoto(compressedPhoto);
          } catch (error) {
            alert("Unable to save this photo in browser storage. Try another image.");
            console.error("Photo storage error:", error);
          }
        };

        image.onerror = () => {
          alert("Unable to open this image. Please select another photo.");
        };

        image.src = event.target.result;
      };

      reader.onerror = () => {
        alert("Unable to read this image. Please try again.");
      };

      reader.readAsDataURL(file);
      photoInput.value = "";
    });

    // Remove photo
    removePhoto.addEventListener("click", () => {
      const confirmed = confirm("Are you sure you want to remove your profile photo?");

      if (!confirmed) return;

      try {
        localStorage.removeItem(PHOTO_STORAGE_KEY);

        profilePhoto.src = "";
        profilePhoto.style.display = "none";
        defaultAvatar.style.display = "block";
        removePhoto.style.display = "none";

      } catch (error) {
        alert("Unable to remove the saved photo.");
        console.error("Photo removal error:", error);
      }
    });
  }

  // SKILL SEARCH AND CATEGORY FILTER
  const searchSkill = document.getElementById("searchSkill");
  const categoryFilter = document.getElementById("categoryFilter");
  const skillList = document.getElementById("skillList");
  const noSkills = document.getElementById("noSkills");

  function filterSkills() {
    if (!skillList) return;

    const searchText = searchSkill
      ? searchSkill.value.toLowerCase().trim()
      : "";

    const category = categoryFilter
      ? categoryFilter.value
      : "all";

    const skills = skillList.querySelectorAll(".skill-item");
    let visibleCount = 0;

    skills.forEach(skill => {
      const name = skill.querySelector("strong").textContent.toLowerCase();
      const skillCategory = skill.dataset.category;

      const matchesSearch = name.includes(searchText);
      const matchesCategory =
        category === "all" || skillCategory === category;

      if (matchesSearch && matchesCategory) {
        skill.style.display = "flex";
        visibleCount++;
      } else {
        skill.style.display = "none";
      }
    });

    if (noSkills) {
      noSkills.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  if (searchSkill) {
    searchSkill.addEventListener("input", filterSkills);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterSkills);
  }

  // ADD SKILL
  const a = document.getElementById("addSkill");

  if (a && skillList) {
    a.onclick = () => {
      const name = prompt("Enter skill name:");
      if (!name || !name.trim()) return;

      const category = prompt(
        "Enter category: programming, web, database, tools"
      );

      const validCategories = [
        "programming",
        "web",
        "database",
        "tools"
      ];

      if (!category || !validCategories.includes(category.toLowerCase().trim())) {
        alert("Please enter a valid category.");
        return;
      }

      const level = prompt(
        "Enter proficiency: Beginner, Intermediate, Advanced",
        "Beginner"
      );

      const validLevels = [
        "beginner",
        "intermediate",
        "advanced"
      ];

      if (!level || !validLevels.includes(level.toLowerCase().trim())) {
        alert("Please enter a valid proficiency level.");
        return;
      }

      const categoryName = {
        programming: "Programming",
        web: "Web Development",
        database: "Database",
        tools: "Development Tools"
      };

      const d = document.createElement("div");

      d.className = "row skill-item";
      d.dataset.category = category.toLowerCase().trim();

      d.innerHTML = `
        <b class="tile">SK</b>
        <span>
          <strong></strong>
          <small></small>
        </span>
        <label class="self">Self-declared</label>
        <button type="button" class="editSkill">Edit</button>
      `;

      d.querySelector("strong").textContent = name.trim();

      d.querySelector("small").textContent =
        categoryName[category.toLowerCase().trim()] +
        " · " + level.charAt(0).toUpperCase() +
        level.slice(1).toLowerCase();

      skillList.appendChild(d);

      filterSkills();
    };
  }

  // EDIT SKILL
  if (skillList) {
    skillList.addEventListener("click", e => {
      if (!e.target.classList.contains("editSkill")) return;

      const skill = e.target.closest(".skill-item");
      if (!skill) return;

      const nameElement = skill.querySelector("strong");
      const detailsElement = skill.querySelector("small");

      const newName = prompt(
        "Edit skill name:",
        nameElement.textContent
      );

      if (!newName || !newName.trim()) return;

      const oldDetails = detailsElement.textContent.split("·");
      const oldLevel = oldDetails.length > 1
        ? oldDetails[1].trim()
        : "Beginner";

      const newLevel = prompt(
        "Edit proficiency: Beginner, Intermediate, Advanced",
        oldLevel
      );

      const validLevels = [
        "beginner",
        "intermediate",
        "advanced"
      ];

      if (!newLevel || !validLevels.includes(newLevel.toLowerCase().trim())) {
        alert("Please enter a valid proficiency level.");
        return;
      }

      nameElement.textContent = newName.trim();

      detailsElement.textContent =
        oldDetails[0].trim() + " · " +
        newLevel.charAt(0).toUpperCase() +
        newLevel.slice(1).toLowerCase();

      filterSkills();
    });
  }

  // ADD PROJECT
  const p = document.getElementById("addProject");

  if (p) {
    p.onclick = () => {
      const name = prompt("Enter project name:");
      if (!name || !name.trim()) return;

      const technology = prompt("Enter technologies used:");
      if (!technology || !technology.trim()) return;

      const projectList = document.getElementById("projectList");

      if (projectList) {
        const d = document.createElement("div");

        d.className = "evidence";

        d.innerHTML =
          '<b>⌘</b><span><strong></strong><small></small><small>Skills: Self-declared</small></span><label class="self">Self-declared</label>';

        d.querySelector("strong").textContent = name.trim();

        d.querySelectorAll("small")[0].textContent =
          "Project · " + technology.trim();

        projectList.appendChild(d);
      }
    };
  }

});
