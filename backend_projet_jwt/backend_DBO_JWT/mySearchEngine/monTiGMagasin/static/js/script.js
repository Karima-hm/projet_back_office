const API_BASE_URL = "http://localhost:8000";
const TOKEN_ENDPOINT = "/api/token/";
const REFRESH_ENDPOINT = "/api/token/refresh/";

/**
 * 🔑 Connexion utilisateur
 */
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}${TOKEN_ENDPOINT}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            console.log("✅ Connexion réussie !");
            getInfoProducts(); // Récupère les produits après la connexion
            console.log(data.access);
        
        } else {
            alert("❌ Erreur de connexion : vérifiez vos identifiants !");
        }
    } catch (error) {
        console.error("❌ Erreur réseau :", error);
        alert("❌ Erreur réseau, veuillez réessayer.");
    }
}

/**
 * 🔄 Rafraîchir le token d'accès
 */
async function refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
        alert("❌ Votre session a expiré, veuillez vous reconnecter !");
        window.location.href = "login.html"; // Redirection ici, mais tu peux l'adapter si nécessaire
        return;
    }

    const response = await fetch(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        console.log("🔄 Token rafraîchi !");
        return data.access;
    } else {
        alert("❌ Votre session a expiré, veuillez vous reconnecter !");
        window.location.href = "login.html"; // Redirection ici aussi
    }
}

/**
 * 📡 Récupère les produits
 */
async function getInfoProducts() {
    let accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        alert("❌ Vous devez vous connecter !");
        return; // Tu n'es plus redirigé ici, donc rien à faire ici
    }

    try {
        let response = await fetch(`${API_BASE_URL}/infoproducts/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });

        if (response.status === 401) {
            console.warn("⚠️ Token expiré, tentative de rafraîchissement...");
            accessToken = await refreshToken();
            response = await fetch(`${API_BASE_URL}/infoproducts/`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            });
        }

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("products", JSON.stringify(data)); // Stockage des produits dans le localStorage
            // displayProducts(data); // Affiche les produits
            console.log("Produits récupérés et stockés :", data);
            
        } else {
            alert("❌ Erreur lors de la récupération des produits.");
        }
    } catch (error) {
        console.error("❌ Erreur réseau :", error);
    }
}

/**
 * 🎨 Affiche les produits
 */
// function displayProducts(products) {
//     const productList = document.getElementById("product-list");
//     // productList.innerHTML = ""; // Vide la liste avant d'ajouter les nouveaux produits

//     products.forEach(product => {
//         const li = document.createElement("li");
//         li.textContent = `${product.nom} - ${product.prix}€`;
//         productList.appendChild(li);
//     });
// }

/**
 * 🚪 Déconnexion
 */
document.getElementById("logout")?.addEventListener("click", function() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("products"); // Supprime aussi les produits du localStorage à la déconnexion
    window.location.href = "login.html";
});

// Si on est sur la page de connexion, afficher les produits si déjà connectés
if (window.location.pathname.includes("login.html")) {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        console.log(storedProducts);
    }
}

// Gère la soumission du formulaire de connexion
document.getElementById("login-form")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    login(username, password);
});
