const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const snap = document.getElementById('snap');
const output = document.getElementById('receta-box');

// IMPORTANTE: Inserta tu NUEVA API KEY aquí.
// No subas esto a un repositorio público con la clave.
const API_KEY = 'AQ.Ab8RN6KyOUYkMp9OEcUGJAYGsG0RjMs-QLDzLq61obZpBEHKRA'; 

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        preview.src = event.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

snap.addEventListener('click', async () => {
    if (!preview.src || preview.style.display === 'none') { alert("Por favor, sube una foto primero"); return; }
    
    const base64Image = preview.src.split(',')[1];
    output.innerHTML = "✨ <em>La IA está analizando... esto puede tardar un momento.</em>";
    snap.disabled = true;
    snap.innerText = "Analizando...";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [
                    { text: "Actúa como un chef ecológico. Si es residuo, da receta. Si es comida, da conservación. Avisa higiene al inicio." },
                    { inline_data: { mime_type: "image/jpeg", data: base64Image } }
                ]}]
            })
        });
        const data = await response.json();
        output.innerHTML = data.candidates[0].content.parts[0].text.replace(/\n/g, '<br>');
    } catch (err) {
        output.innerText = "⚠️ Error al conectar con la IA. Verifica tu API Key.";
    } finally {
        snap.disabled = false;
        snap.innerText = "📸 Analizar ingrediente";
    }
});