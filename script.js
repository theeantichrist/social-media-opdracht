let posts = [];

const berichtenLijst = document.querySelector("#berichten");

async function laadBerichten() {
    try {
        const antwoord = await fetch("berichten.json");

        if (!antwoord.ok) {
            throw new Error(`Berichten laden mislukt (${antwoord.status}).`);
        }

        posts = await antwoord.json();
        toonBerichten();
    } catch (error) {
        console.error("Berichten konden niet worden geladen:", error);
        berichtenLijst.textContent =
            "De berichten konden niet worden geladen. Open Illiegram via een lokale server.";
    }
}

function toonBerichten() {
    posts.forEach((post, index) => {
        berichtenLijst.innerHTML += `
            <article class="post">
                <h2>${post.naam}</h2>
                <div class="post-foto">
                    ${post.video
                        ? `<video controls src="${post.video}"></video>`
                        : post.foto
                            ? `<img src="${post.foto}" alt="Foto van ${post.naam}">`
                            : ""}
                </div>
                <p>❤️ <span id="likes-${index}">${post.likes}</span> likes</p>
                <div class="knoppen">
                    <button class="like-knop" id="like-knop-${index}" onclick="likePost(${index})">
                        ${post.geliked ? "❤️ Geliked" : "🤍 Like"}
                    </button>
                    <button class="deel-knop" onclick="deelPost(${index})">Delen</button>
                    <button class="reactie-knop" onclick="commentPost(${index})">Reageren</button>
                </div>
                <p><strong>${post.naam}</strong> ${post.tekst}</p>
                <p class="datum">${post.datum}</p>
                <ul class="reacties" id="reacties-${index}"></ul>
            </article>
        `;
    });
}

function likePost(index) {
    const post = posts[index];
    post.geliked = !post.geliked;
    post.likes += post.geliked ? 1 : -1;

    document.querySelector(`#likes-${index}`).textContent = post.likes;
    document.querySelector(`#like-knop-${index}`).textContent =
        post.geliked ? "❤️ Geliked" : "🤍 Like";
}

function commentPost(index) {
    const comment = prompt("Schrijf een reactie:");

    if (comment === null || comment.trim() === "") {
        return;
    }

    const newComment = document.createElement("li");
    newComment.textContent = comment.trim();
    document.querySelector(`#reacties-${index}`).append(newComment);
}

async function deelPost(index) {
    const post = posts[index];
    const shareData = {
        title: `Post van ${post.naam}`,
        text: post.tekst || `Bekijk deze post van ${post.naam} op Illiegram!`,
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            if (error.name !== "AbortError") {
                alert("Delen is niet gelukt.");
            }
        }
    } else if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(shareData.url);
            alert("De link is gekopieerd. Je kunt hem nu delen.");
        } catch {
            alert("De link kon niet worden gekopieerd.");
        }
    } else {
        alert("Delen wordt niet ondersteund in deze browser.");
    }
}

laadBerichten();
