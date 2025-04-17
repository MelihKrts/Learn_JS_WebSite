export function createMenu() {
    fetch("/data/subject.json")
        .then(response => response.json())
        .then(data => {
            const menuLinks = document.querySelectorAll(".menu-links");
            if (!menuLinks.length) return;

            menuLinks.forEach(menu => {
                data.forEach(item => {
                    const listElement = document.createElement("li");
                    listElement.classList.add("nav-item");

                    const linkElement = document.createElement("a");
                    linkElement.classList.add("nav-link");
                    linkElement.href = item.url;
                    linkElement.textContent = item.title;

                    listElement.appendChild(linkElement);
                    menu.appendChild(listElement);
                });
            });
        })
        .catch(error => console.error("Subject loading error", error));
}
