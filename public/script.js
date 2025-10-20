document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("image-input");
  const mainImage = document.querySelector(".main-image");
  const templateButtons = document.querySelectorAll(".template-item");
  const generatingPopup = document.getElementById("generating-popup");
  const downloadBtn = document.getElementById("download-btn");
  const whatsappBtn = document.getElementById("whatsapp-btn");
  const twitterBtn = document.getElementById("twitter-btn");
  const createAnotherBtn = document.getElementById("create-another-btn");
  const uploadBtn = document.getElementById("upload-btn");
  const confirmPopup = document.getElementById("confirm-popup");
  const confirmYes = document.getElementById("confirm-yes");
  const confirmNo = document.getElementById("confirm-no");
  const interstitialPopup = document.getElementById("interstitial-popup");
  const interstitialClose = document.getElementById("interstitial-close");

  let uploadedImage = null;
  let selectedPrompt = "";

  const templatePrompts = {
    "C-01": "ULTRA REALISTIC 4K CINEMATIC PORTRAIT OF THE SAME YOUNG MAN, FACE EXACTLY LIKE THE REFERENCE PHOTO, FACE SHOULD 100% MATCH WITH REFERENCE IMAGE. HE IS STANDING ON A TERRACE AT DIWALI NIGHT, WEARING A WHITE KURTA. ONE HAND HOLDS A LIT PHOOLJHADI AND HE LOOKS AT CAMERA HAPPILY, THE OTHER HAND IN PAJAMA POCKET. BACKGROUND SHOWS NIGHT SKY WITH FIREWORKS AND A TERRACE WALL DECORATED WITH GLOWING DIYAS. NATURAL, FESTIVE, AND HIGHLY REALISTIC. AND ADD A METALLIC TEXT IN BACKGROUND HAPPY DIWALI",
    "C-02": "Ultra-realistic 8K DSLR festive photo of the same young man (face must remain 100% unchanged from the reference). He is wearing a stylish deep green kurta with fine embroidery texture, along with a round black smartwatch. He is captured outdoors at night, holding a sparkler (phuljhari) in one hand while laughing joyfully, his face glowing in the light. The background shows blurred colorful firecrackers bursting in the sky, fairy lights strung across, and a lively Diwali crowd. Cinematic warm lighting, golden tones, dreamy bokeh, shallow depth of field, photorealistic skin details, professional 8K DSLR",
    "C-03": "A beautiful Indian woman standing outdoors at night during Diwali, surrounded by glowing digas and colorful fairy lights, wearing a glamorous traditional Indian outfit featuring a peach-colored embroidered lehenga choli with intricate silver sequin and threadwork. The blouse has sheer net sleeves embellished with sparkling designs, paired with a matching dupatta draped elegantly. The model is adorned with jewelry including a delicate maang tikka, chandelier earrings, necklace, and multiple shimmering bangles. Her look is enhanced with henna designs on her hands, flowing open hair, with elegant gold embroidery, soft smile, holding a sparkler in one hand, fireworks lighting up the sky behind him, warm golden light reflecting on his face, complete cinematic bokeh background, ultra-realistic details, festive mood, soft glow, DSLR portrait, 8K HDR, shallow depth of field, professional lighting, Indian festival of lights vibe. The background is fully covered with big size bokeh. The woman her the face and same hairstyle as the uploaded reference image. The photo is a full-body shot showing his feet.",
    "C-04": "Hyper-realistic 8k cinematic lifestyle portrait of a young Indian woman standing a top wearing a lehenga in shades silver and sleeveless v-neck blouse and silver lehenga with net duppata and matching bangles and earrings and mangtika, The rooftop diyas are being illuminated by her. A creamy and gentle bokeh effect of light lamps and flare lights is reflected in the background. Don't change the face. use reference image, face should match exact 100% same as referenced image."
  };

  uploadBtn.addEventListener("click", () => imageInput.click());

  imageInput.addEventListener("change", () => {
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        uploadedImage = e.target.result;
        mainImage.src = uploadedImage;
      };
      reader.readAsDataURL(imageInput.files[0]);
    }
  });

  templateButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!uploadedImage) return alert("Please upload an image first!");
      selectedPrompt = templatePrompts[btn.dataset.template];
      confirmPopup.style.display = "flex";
    });
  });

  confirmYes.addEventListener("click", async () => {
    confirmPopup.style.display = "none";
    generatingPopup.style.display = "flex";

    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: selectedPrompt, image: uploadedImage })
      });
      const data = await res.json();

      if (data.error || !data.image_base64) {
        alert("Failed to generate image: " + (data.error || "No image returned"));
      } else {
        mainImage.src = "data:image/png;base64," + data.image_base64;
        downloadBtn.style.display = "inline-flex";
        whatsappBtn.style.display = "inline-flex";
        twitterBtn.style.display = "inline-flex";
        createAnotherBtn.style.display = "inline-flex";

        // Show interstitial ad
        interstitialPopup.style.display = "flex";
      }
    } catch (err) {
      alert("Error generating image: " + err.message);
    } finally {
      generatingPopup.style.display = "none";
    }
  });

  confirmNo.addEventListener("click", () => confirmPopup.style.display = "none");

  downloadBtn.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = mainImage.src;
    a.download = "generated_image.png";
    a.click();
  });

  createAnotherBtn.addEventListener("click", () => {
    mainImage.src = uploadedImage || "thumbnails/diwali1.jpg";
    downloadBtn.style.display = "none";
    whatsappBtn.style.display = "none";
    twitterBtn.style.display = "none";
    createAnotherBtn.style.display = "none";

    // Show interstitial ad
    interstitialPopup.style.display = "flex";
  });

  whatsappBtn.addEventListener("click", () => {
    if (!mainImage.src) return;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent("Check out my Diwali face swap image! ")}`;
    window.open(whatsappUrl, "_blank");
  });

  interstitialClose.addEventListener("click", () => {
    interstitialPopup.style.display = "none";
  });
});
