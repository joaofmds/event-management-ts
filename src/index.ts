import app from './server';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => 'Server running on port 3000');
