const express = require("express");
const router = express.Router();
const openai = require("../services/openai-service");
const path=require('path')
const fs=require('fs')
const deleteFile=require('../utils/deleteFile')
const profilerUploader = require("../utils/fileUpload");
const profileUpload = new profilerUploader({
  folderName: "uploads",
  supportedFiles: ["image/jpeg", "image/png", "image/jpg"],
  fieldSize: 1024 * 1024 * 4,
});

// Homepage routing
router.get("/", (req, res) => {
  res.render("index", {
    title: "LearnScan - Discover your learning superpowers",
    user: req.session.user || null,
  });
});

// aboutPageRouting
router.get("/about", (req, res) => {
  res.render("about", {
    title: "About LearnScan",
    user: req.session.user || null,
  });
});

// Help page routing
router.get("/help", (req, res) => {
  res.render("help", {
    title: "User Help",
    user: req.session.user || null,
  });
});

// Intelligent learning planning engine page routing
router.get("/plan", (req, res) => {
  res.render("plan/plan", {
    title: "Intelligent Learning Planning Engine",
    user: req.session.user || null,
  });
});

// Learning objectives intelligent analysis AI interface
router.post("/plan/goal-analysis", async (req, res) => {
  const { goalType, goalContent } = req.body;
  if (!goalType || !goalContent) {
    return res.status(400).json({ error: "Missing target type or content" });
  }
  try {
    const aiResult = await openai.analyzeGoal({
      goalType,
      goalContent,
      user: req.session.user,
    });
    res.json(aiResult);
  } catch (err) {
    res.status(500).json({ error: "AI parsing failed", detail: err.message });
  }
});

// Intelligent homework tutoring system page routing
router.get("/homework", (req, res) => {
  res.render("homework/homework", {
    title: "Intelligent homework tutoring system",
    user: req.session.user || null,
  });
});

// Chinese Language Learning Assistant Page Routing
router.get("/chinese", (req, res) => {
  res.render("chinese/chinese", {
    title: "Chinese Language Learning Assistant",
    user: req.session.user || null,
  });
});

// Mathematics Learning Assistant Page Routing
router.get("/math", (req, res) => {
  res.render("math/math", {
    title: "Mathematics Learning Assistant",
    user: req.session.user || null,
  });
});

// Personalized learning path generation AI interface
router.post("/plan/path-analysis", async (req, res) => {
  const { styleType, levelMath, levelChinese, studyTime, studyPreference } =
    req.body;
  if (!styleType || !levelMath || !levelChinese || !studyTime) {
    return res
      .status(400)
      .json({ error: "Missing necessary basic information" });
  }
  try {
    const aiResult = await openai.analyzePath({
      styleType,
      levelMath,
      levelChinese,
      studyTime,
      studyPreference,
      user: req.session.user,
    });
    res.json(aiResult);
  } catch (err) {
    res
      .status(500)
      .json({ error: "AI path generation failed", detail: err.message });
  }
});

// AI interface of intelligent homework tutoring system
router.post(
  "/homework/analyze",
  profileUpload.upload().single("image"), // Field name must match frontend
  async (req, res) => {
    const { questionText, subject } = req.body;
    const imageFile = req.file;

    if (!questionText && !imageFile) {
      return res
        .status(400)
        .json({ error: "The question text or image is required." });
    }

    try {
      let aiResult;

      if (imageFile) {
        // Get file extension for MIME type
        const fileExt =
          path.extname(imageFile.originalname).replace(".", "") || "jpeg";

        // Convert image to base64 with correct prefix
        
        const imageBase64Data = fs.readFileSync(imageFile.path, {
          encoding: "base64",
        });
        const imageBase64 = `data:image/${fileExt};base64,${imageBase64Data}`;
        

        // Call AI service
        aiResult = await openai.analyzeHomeworkWithImage({
          imageBase64,
          questionText,
          subject,
          user: req.session.user,
        });

        // Delete temp image
        deleteFile("uploads",imageFile.filename);
      } else {
        // No image, only question text
        aiResult = await openai.analyzeHomework({
          questionText,
          subject,
          user: req.session.user,
        });
      }

      res.json(aiResult);
    } catch (err) {
      console.error("AI analyzeHomework failed:", err);
      res.status(500).json({
        error: "AI analysis failed",
        detail: err.message || "Unknown error",
      });
    }
  }
);

router.post("/homework/guidance", async (req, res) => {
  const { questionText, currentStep, imageBase64 } = req.body;
  if (!questionText && !imageBase64) {
    return res
      .status(400)
      .json({ error: "The content or picture of the title cannot be empty" });
  }
  try {
    const aiResult = await openai.progressiveGuidance({
      questionText,
      currentStepurrentStep,
      imageBase64,
      user: req.session.user,
    });
    res.json(aiResult);
  } catch (err) {
    res
      .status(500)
      .json({ error: "AI thinking guide failed", detail: err.message });
  }
});

router.post("/homework/parent-support", async (req, res) => {
  const { questionText, subject } = req.body;
  if (!questionText) {
    return res
      .status(400)
      .json({ error: "The content of the question cannot be empty" });
  }
  try {
    const aiResult = await openai.parentSupport({ questionText, subject });
    res.json(aiResult);
  } catch (err) {
    res
      .status(500)
      .json({ error: "AI parent support failed", detail: err.message });
  }
});

// AI OCR picture recognition interface
router.post("/homework/ai-ocr", async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "Missing image data" });
  }
  try {
    // Call AI OCR service
    const aiResult = await openai.ocrImage({ imageBase64 });
    res.json({ text: aiResult.text || "" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "AI image recognition failed", detail: err.message });
  }
});

module.exports = router;
