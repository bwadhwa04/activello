const items = [
  {
    name: "Random 2",
    imgurl: "../src/images/smallcard2.webp",
    category: "template",
  },
  {
    name: "Random 1",
    imgurl: "../src/images/smallcard3.webp",
    category: "template",
  },
  {
    name: "Random 3",
    imgurl: "../src/images/recentpost2.webp",
    category: "template",
  },
  {
    name: "cat A2",
    imgurl: "../src/images/recentpost1.webp",
    category: "cata",
  },
  {
    name: "cat A1",
    imgurl: "../src/images/largecard1.webp",
    category: "cata",
  },
  { name: "cat A3", imgurl: "../src/images/aboutme.jpg", category: "cata" },
];

async function loadLayout() {
  document.getElementById("main-header").innerHTML = await fetch(
    "/components/header.html"
  ).then((res) => res.text());

  document.getElementById("main-footer").innerHTML = await fetch(
    "/components/footer.html"
  ).then((res) => res.text());

  document.getElementById("main-sidebar").innerHTML = await fetch(
    "/components/sidecontent.html"
  ).then((res) => res.text());
}

async function loadPage() {
  let hash = window.location.hash.substring(1);
  const carousel = document.getElementById("carousel");
  const subheaderHr = document.getElementById("subheader-hr");

  if (hash.startsWith("search")) {
    carousel.classList.add("hidden");
    const params = new URLSearchParams(hash.split("?")[1]);
    const data = JSON.parse(decodeURIComponent(params.get("data")));

    const html = await fetch("/pages/search.html").then((r) => r.text());
    document.getElementById("subbody-content").innerHTML = html;

    renderSearchResults(data);
    return;
  }

  if (
    hash === "slide4" ||
    hash === "slide3" ||
    hash === "slide2" ||
    hash === "slide1" ||
    hash === "main-header"
  ) {
    return;
  }

  page = hash || "home";
  if (page === "home" || page === "page2") {
    carousel.classList.remove("hidden");
    subheaderHr.classList.add("hidden"); // ← show again
  } else {
    carousel.classList.add("hidden");
    subheaderHr.classList.remove("hidden"); // ← hide on other pages
  }
  let file = `/pages/${page}.html`;

  const html = await fetch(file).then((res) => res.text());
  document.getElementById("subbody-content").innerHTML = html;
}

function renderSearchResults(data) {
  const box = document.getElementById("search-results");

  box.innerHTML = "";

  const searchHeading = document.createElement("p");
  searchHeading.className = "searchHeading";
  searchHeading.innerHTML = `
  <p>Search Results for: ${data[0].category}</p>
  `;

  box.appendChild(searchHeading);

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "subbody-largecard";
    div.innerHTML = `
        <small >POST FORMATS</small>
        <hr />
        <h4>Post Format: ${item.name}</h4>
        <h5>Posted on October 5, 2016 by <a href="">Aigars</a></h5>
        <img class="card-img" src="${item.imgurl}" alt="">
        <p>All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was this.</p>
    `;
    box.appendChild(div);
  });
}

window.addEventListener("hashchange", loadPage);

document.addEventListener("DOMContentLoaded", async () => {
  await loadLayout();
  await loadPage();

  const searchButtons = document.querySelectorAll("[data-search-btn]");
  const searchInputs = document.querySelectorAll("[data-search-input]");

  searchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Find closest input (matching index)
      const index = [...searchButtons].indexOf(btn);
      const input = searchInputs[index];

      if (!input) return;

      const value = input.value.trim().toLowerCase().replace(/\s+/g, "");;

      if (!value) {
        alert("Please enter a category");
        return;
      }

      const result = items.filter(
        (item) => item.category.toLowerCase() === value
      );

      if (result.length === 0) {
        alert("No items found for: " + value);
        return;
      }

      const json = encodeURIComponent(JSON.stringify(result));
      window.location.hash = `search?data=${json}`;
    });
  });
});
