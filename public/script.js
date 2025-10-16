document.getElementById("generate-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("image-input");
  const file = fileInput.files[0];
  if (!file) return alert("Please upload an image");

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const prompt = "ulta realistic festive diwali scene. a young man stands confidently wearing stylish traditional clothes, holding a lit full chadi(sparkler) in his hand. the sparkler glows brightly, creating a beautiful golden ring of light around him as he waves it in the air. his outfit is vibrant and festive, with a shining designer kurta and pant. in the background, there are colorful diwali decoration, glowing diyas, fairy lights, and fireworks bursting in the night sky. the entire scene glows.";

    try {
      const response = await fetch('/api/generate', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, image: reader.result })
      });

      if (!response.ok) throw new Error("Failed to generate image");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      document.getElementById("result-image").src = url;
    } catch (err) {
      alert(err.message);
    }
  };
});
