import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

// --- Reminders ---
interface Reminder {
    id?: string;
    text: string;
    time: string; // ISO 8601 format ideally
    createdAt: Date;
}
let reminders: Reminder[] = []; // In-memory store for now

router.post('/reminders', (req: Request, res: Response) => {
    const { text, time } = req.body;
    if (!text || !time) {
        return res.status(400).json({ error: 'Text and time are required for reminders.' });
    }
    const newReminder: Reminder = { id: String(Date.now()), text, time, createdAt: new Date() };
    reminders.push(newReminder);
    console.log('Added reminder:', newReminder);
    res.status(201).json(newReminder);
});

router.get('/reminders', (req: Request, res: Response) => {
    res.json(reminders);
});

// --- Calendar (Placeholder) ---
router.get('/calendar/events', (req: Request, res: Response) => {
    // In a real app, this would integrate with Google Calendar API
    console.log('Fetching calendar events (placeholder)');
    res.json([{ title: 'Meeting with Team', start: new Date().toISOString(), end: new Date().toISOString() }]);
});

// --- Weather (Placeholder) ---
router.get('/weather', async (req: Request, res: Response) => {
    const city = req.query.city || 'defaultCity';
    // In a real app, this would call a weather API
    console.log(`Fetching weather for ${city} (placeholder)`);
    res.json({ city, temperature: '25°C', condition: 'Sunny' });
});

// --- News (Placeholder) ---
router.get('/news', async (req: Request, res: Response) => {
    // In a real app, this would call a news API
    console.log('Fetching news headlines (placeholder)');
    res.json([{ title: 'Big Tech Announces New AI', source: 'TechCrunch' }, { title: 'Global Markets Update', source: 'Reuters' }]);
});

// --- Notepad & ToDo (Conceptual - might be better handled client-side or with a dedicated notes service) ---
router.post('/notes', (req: Request, res: Response) => {
    const { content } = req.body;
    console.log('Saving note (placeholder):', content);
    res.status(201).json({ id: String(Date.now()), content });
});

router.get('/todos', (req: Request, res: Response) => {
    console.log('Fetching todos (placeholder)');
    res.json([{ id: '1', task: 'Buy groceries', completed: false }]);
});


export default router;
