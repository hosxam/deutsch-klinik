const https = require('https');
const fs = require('fs');

const wavPath = 'C:\\Users\\ASUS\\.openclaw\\workspace\\deutsch-klinik\\tmp\\silence.wav';
const audioBuf = fs.readFileSync(wavPath);

const boundary = '----TestBoundary' + Date.now();
const chunks = [];

function part(name, value, isFile) {
  chunks.push(Buffer.from('--' + boundary + '\r\n'));
  if (isFile) {
    chunks.push(Buffer.from('Content-Disposition: form-data; name="' + name + '"; filename="speaking.wav"\r\n'));
    chunks.push(Buffer.from('Content-Type: audio/wav\r\n\r\n'));
    chunks.push(value);
  } else {
    chunks.push(Buffer.from('Content-Disposition: form-data; name="' + name + '"\r\n\r\n'));
    chunks.push(Buffer.from(value));
  }
  chunks.push(Buffer.from('\r\n'));
}

part('type', 'transcription');
part('audio', audioBuf, true);
part('language', 'de');

chunks.push(Buffer.from('--' + boundary + '--\r\n'));

const body = Buffer.concat(chunks);

const options = {
  hostname: 'deutsch-klinik-ai-correction.deutsch-klinik.workers.dev',
  port: 443,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': body.length,
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(body);
req.end();
