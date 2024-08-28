import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { constructQuestion, transcribeImage, answer } from '../lib/imageToAnswer';
import { silentAudio } from '../lib/consts';
import { WebSocket, WebSocketServer } from 'ws';
var gtts = require('node-gtts')('en');

const app = express();
const port = process.env.PORT || process.env.http_port || 4000;
const uploadsDir = path.join(__dirname, 'uploads');
const audioDir = path.join(__dirname, 'audio');

let text: string[] = [];
let latestText = 'None';
let latestAudioBase64 = silentAudio;

// Create directories if they don't exist
[uploadsDir, audioDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Serve the main HTML file
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Helper function to broadcast messages and audio
const broadcast = (text: string) => {
    const audioFilePath = path.join(audioDir, `${Date.now()}.mp3`);

    gtts.save(audioFilePath, text, (err: any) => {
        if (err) {
            console.error('Error saving audio file:', err);
        } else {
            const audioBuffer = fs.readFileSync(audioFilePath);
            const audioBase64 = audioBuffer.toString('base64');
            broadcastBase64(text, audioBase64);
        }
    });
};

const broadcastBase64 = (text: string, audioBase64: string) => {
    latestText = text;
    latestAudioBase64 = audioBase64;
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ text, audio: audioBase64 }));
        }
    });
}

// Helper function to send silent audio
const mute = () => {
    if(latestAudioBase64 !== silentAudio){
        broadcastBase64('Mute', silentAudio);
    }
};

// Helper function to delete all images
const clear = () => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading upload directory:', err);
        }
        files.forEach(file => {
            fs.unlinkSync(path.join(uploadsDir, file));
        });
    });
}

// Endpoint to add an image
app.post('/add-image', upload.single('image'), async (req: Request, res: Response) => {
    console.log('Added image');
    if (!req.file){
        return res.status(400).send('No image file uploaded.');
    }
    mute();
    res.status(200).send(`Image uploaded: ${req.file.filename}`);

    const imagePath = req.file.path;
    try {
        const result= await transcribeImage(imagePath);        
        if(result && result.length > 0) {
            text.push(result);
        }
    } catch (error) {
        console.error('Error constructing question:', error);
    }
});

// Endpoint to get an answer about images
app.get('/answer', async (req: Request, res: Response) => {
    console.log('Received request for an answer');
    try {
        if (text.length === 0) return res.status(400).send('No text to answer.');
        res.status(200).send("Success");
        const textAnswer = await answer(text.join('\n\n')); // Join the elements of the text array using a space separator
        broadcast(textAnswer);
        text = [];
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing answer');
    }
});

app.post('/upload-audio', (req, res) => {
    const audioBase64 = req.body.audio;
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const audioPath = `./uploads/audio_${Date.now()}.webm`;

    fs.writeFile(audioPath, audioBuffer, (err) => {
        if (err) {
            console.error('Error saving audio file:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Audio uploaded');
        res.status(200).send('Audio uploaded successfully');
    });
});


// WebSocket server setup
const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('New client connected');
    ws.send(JSON.stringify({ text: latestText, audio: latestAudioBase64 }));
    ws.on('close', () => console.log('Client disconnected'));
});

// Keep WebSocket connections alive
setInterval(() => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.ping();
    });
}, 22000);


//Debugging

// Broadcast endpoint
app.post('/broadcast', upload.none(), (req: Request, res: Response) => {
    const text = req.body.text;
    if (!text) return res.status(400).send('No text provided.');

    broadcast(text)
    res.status(200).send('Text broadcasted');
});

// Mute endpoint
app.get('/mute', (req: Request, res: Response) => {
    mute();
    res.status(200).send('Silent audio broadcasted');
});

// Endpoint to view all uploaded images
app.get('/image', (req: Request, res: Response) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading upload directory:', err);
            return res.status(500).send('Error reading upload directory.');
        }

        const imagesHtml = files.reverse().map(file => {
            const filePath = path.join(uploadsDir, file);
            const fileData = fs.readFileSync(filePath);
            const base64Data = fileData.toString('base64');
            const mimeType = 'image/' + path.extname(file).slice(1); // Assumes the file extension is a valid MIME type

            return `<div>
                        <p>${file}</p>
                        <img src="data:${mimeType};base64,${base64Data}" style="max-width: 100vw;" />
                    </div>`;
        }).join('');
        
        res.send(`<div>${imagesHtml}</div>`);
    });
});

app.get("/clear", (req: Request, res: Response) => {
    clear()
    res.status(200).send('Images cleared');
});

app.get("/questions", async (req: Request, res: Response) => {
    const result = await constructQuestion(text);
    res.status(200).send(result);
});