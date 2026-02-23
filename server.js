import express from 'express';
import fetch from 'node-fetch'; // npm install node-fetch@2
import multer from 'multer';    // npm install multer
import cors from 'cors';

const app = express();
app.use(cors()); // Opcional, si tu frontend y backend están en dominios distintos
const upload = multer();

// Endpoint proxy
app.post('/api/n8n-webhook', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No se subió archivo' });

        const formData = new FormData();
        formData.append('file', new Blob([file.buffer]), file.originalname);

        const response = await fetch('https://n8n-facturas-demo.onrender.com/webhook/n8n-demo', {
            method: 'POST',
            body: formData
        });

        const text = await response.text();
        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch {
            res.status(500).send(text);
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log('Proxy backend corriendo en http://localhost:3000'));