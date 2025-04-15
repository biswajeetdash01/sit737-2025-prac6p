const express = require('express');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculator-microservice' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Root endpoint for health checks
app.get('/', (req, res) => {
  res.json({
    message: 'Calculator Microservice',
    status: 'healthy',
    endpoints: {
      operations: ['/add', '/subtract', '/multiply', '/divide', '/power', '/sqrt', '/modulo'],
      example: '/add?num1=5&num2=3'
    }
  });
});

// Enhanced Middleware for parameter validation
const validateNumbers = (req, res, next) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = req.query.num2 !== undefined ? parseFloat(req.query.num2) : null;

  if (isNaN(num1)) {
    logger.error('Invalid num1 parameter provided');
    return res.status(400).json({ error: 'num1 must be a valid number' });
  }

  // Only validate num2 if the operation requires it
  if (req.path !== '/sqrt' && isNaN(num2)) {
    logger.error('Invalid num2 parameter provided');
    return res.status(400).json({ error: 'num2 must be a valid number' });
  }

  req.numbers = { num1, num2 };
  next();
};

// API Endpoints
app.get('/add', validateNumbers, (req, res) => {
  const { num1, num2 } = req.numbers;
  const result = num1 + num2;
  logger.info(`Addition requested: ${num1} + ${num2} = ${result}`);
  res.json({ result });
});

app.get('/subtract', validateNumbers, (req, res) => {
  const { num1, num2 } = req.numbers;
  const result = num1 - num2;
  logger.info(`Subtraction requested: ${num1} - ${num2} = ${result}`);
  res.json({ result });
});

app.get('/multiply', validateNumbers, (req, res) => {
  const { num1, num2 } = req.numbers;
  const result = num1 * num2;
  logger.info(`Multiplication requested: ${num1} * ${num2} = ${result}`);
  res.json({ result });
});

app.get('/divide', validateNumbers, (req, res) => {
  const { num1, num2 } = req.numbers;
  if (num2 === 0) {
    logger.error('Division by zero attempted');
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  const result = num1 / num2;
  logger.info(`Division requested: ${num1} / ${num2} = ${result}`);
  res.json({ result });
});

app.get('/power', validateNumbers, (req, res) => {
  const { num1, num2 } = req.numbers;
  const result = Math.pow(num1, num2);
  logger.info(`Exponentiation requested: ${num1}^${num2} = ${result}`);
  res.json({ result });
});

app.get('/sqrt', validateNumbers, (req, res) => {
  const { num1 } = req.numbers;
  if (num1 < 0) {
    logger.error('Square root of negative number attempted');
    return res.status(400).json({ error: 'Cannot calculate square root of negative numbers' });
  }
  const result = Math.sqrt(num1);
  logger.info(`Square root requested: √${num1} = ${result}`);
  res.json({ result });
});

app.get('/modulo', validateNumbers, (req, res) => {
  const { num1, num2 } = req.numbers;
  if (num2 === 0) {
    logger.error('Modulo by zero attempted');
    return res.status(400).json({ error: 'Cannot modulo by zero' });
  }
  const result = num1 % num2;
  logger.info(`Modulo requested: ${num1} % ${num2} = ${result}`);
  res.json({ result });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  logger.info(`Calculator service running at http://0.0.0.0:${port}`);
  console.log(`Calculator service running at http://localhost:${port}`);
});