const express = require('express');
const winston = require('winston');
const app = express();
const port = 3000;

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

// Enhanced Middleware for parameter validation (supports single-param operations like sqrt)
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

// Original API Endpoints (unchanged)
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

// New API Endpoints for enhanced functionality
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

// Start server
app.listen(port, () => {
  console.log(`Enhanced calculator service running at http://localhost:${3000}`);
});