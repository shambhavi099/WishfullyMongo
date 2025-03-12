document.querySelector(".btn").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form from refreshing page

    const username = document.getElementById("username")?.value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("passs").value;

    const response = await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    alert(data.message); // Show response message
});
