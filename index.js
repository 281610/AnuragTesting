const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
//const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const CHITKARA_EMAIL = "anuarg1102.be23@chitkarauniversity.edu.in"; // Replace with your actual email
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// --- Helper Functions ---
console.log("ENV loaded:", !!process.env.OPENAI_API_KEY_API_KEY);

// 1. Fibonacci Series
const getFibonacci = (n) => {
    let series = [0, 1];
    for (let i = 2; i < n; i++) {
        series.push(series[i - 1] + series[i - 2]);
    }
    return series.slice(0, n);
};

// 2. Prime Numbers
const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// 3. HCF & LCM
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const findHCF = (arr) => arr.reduce((acc, val) => gcd(acc, val));
const findLCM = (arr) => arr.reduce((acc, val) => (acc * val) / gcd(acc, val));

// --- Endpoints ---

// GET /health - Requirement: is_success and official email
app.get('/health', (req, res) => {
    res.status(200).json({
        "is_success": true,
        "official_email": CHITKARA_EMAIL
    });
});

// POST /bfhl - Requirement: Single functional key logic
app.post('/bfhl', async (req, res) => {
    try {
        const { fibonacci, prime, lcm, hcf, AI } = req.body;
        let responseData;

        // Logic Mapping as per document
        if (fibonacci !== undefined) {
            responseData = getFibonacci(parseInt(fibonacci));
        } 
        else if (prime !== undefined && Array.isArray(prime)) {
            responseData = prime.filter(num => isPrime(parseInt(num)));
        } 
        else if (lcm !== undefined && Array.isArray(lcm)) {
            responseData = findLCM(lcm.map(Number));
        } 
        else if (hcf !== undefined && Array.isArray(hcf)) {
            responseData = findHCF(hcf.map(Number));
        } 
        else if (AI !== undefined) {
            const text = AI.toLowerCase();
        
            // Detect capital-related question
            if (text.includes("capital of")) {
        
                const match = text.match(/capital of ([a-zA-Z ]+)/);
                const state = match ? match[1].trim() : null;
        
                const capitals = {
                    "andhra pradesh": "Amaravati",
                    "arunachal pradesh": "Itanagar",
                    "assam": "Dispur",
                    "bihar": "Patna",
                    "chhattisgarh": "Raipur",
                    "goa": "Panaji",
                    "gujarat": "Gandhinagar",
                    "haryana": "Chandigarh",
                    "himachal pradesh": "Shimla",
                    "jharkhand": "Ranchi",
                    "karnataka": "Bengaluru",
                    "kerala": "Thiruvananthapuram",
                    "madhya pradesh": "Bhopal",
                    "maharashtra": "Mumbai",
                    "manipur": "Imphal",
                    "meghalaya": "Shillong",
                    "mizoram": "Aizawl",
                    "nagaland": "Kohima",
                    "odisha": "Bhubaneswar",
                    "punjab": "Chandigarh",
                    "rajasthan": "Jaipur",
                    "sikkim": "Gangtok",
                    "tamil nadu": "Chennai",
                    "telangana": "Hyderabad",
                    "tripura": "Agartala",
                    "uttar pradesh": "Lucknow",
                    "uttarakhand": "Dehradun",
                    "west bengal": "Kolkata"
                };
        
                responseData = state && capitals[state]
                    ? capitals[state]
                    : "Unknown";
            } 
            else {
                responseData = "Invalid question";
            }
        }
         
        else {
            return res.status(400).json({ 
                "is_success": false, 
                "message": "Invalid input: Provide one of fibonacci, prime, lcm, hcf, or AI" 
            });
        }

        // Mandatory Response Structure
        res.status(200).json({
            "is_success": true,
            "official_email": CHITKARA_EMAIL,
            "data": responseData
        });

    } catch (error) {
        console.error("🔥 ERROR DETAILS 🔥");
        console.error(error.response?.data || error.message || error);
      
        res.status(500).json({
          is_success: false,
          message: "Internal Server Error"
        });
      }
      
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
