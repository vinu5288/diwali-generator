document.getElementById("generate-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("image-input");
  const file = fileInput.files[0];
  if (!file) return alert("Please upload an image");

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const prompt = "ulta realistic festive diwali scene..."; // your template

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, image: reader.result })
      });

      if (!response.ok) throw new Error("Failed to generate image");

      const result = await response.json();
      document.getElementById("result-image").src = `data:image/png;base64,${result.image_base64}`;
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };
});
