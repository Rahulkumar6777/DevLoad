import { exec } from "child_process";
import fs from 'fs'

const productionscanFile = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("Scanning file:", filePath);

    exec(`clamdscan --fdpass "${filePath}"`, (error, stdout) => {
        if (error || stdout.includes("FOUND")) {
            console.log("Virus detected! Deleting file...");
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: "File is infected" });
        }
        console.log("File is clean");
        next();
    });
};

// 🔍 Virus scanning (local dev)
const clamavPath = "D:\\software\\clamdscan.exe";
const localscanFile = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("Scanning file:", filePath);

    exec(`"${clamavPath}" --no-summary "${filePath}"`, (error, stdout) => {
        if (error) {
            fs.unlinkSync(filePath);
            console.error("Error running ClamAV:", error);
            return res.status(500).json({ error: "ClamAV scan failed" });
        }
        if (stdout.includes("FOUND")) {
            console.log("Virus detected! Deleting file...");
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: "File is infected" });
        }
        console.log("File is clean");
        next();
    });
};


export const virusScanning = process.env.NODE_ENV === 'production' ? productionscanFile : localscanFile