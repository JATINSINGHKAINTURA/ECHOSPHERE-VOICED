#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const required = ['VITE_TINYFISH_API_KEY', 'VITE_FISH_API_KEY'];
const missing = required.filter(key => !process.env[key]);

if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
console.log('All required env vars are set.');
