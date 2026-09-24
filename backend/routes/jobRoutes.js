const express = require("express");

const Job = require("../models/job")
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// GET ALL JOBS
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiter", "name email")
      .sort({
        createdAt: -1
      });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET SINGLE JOB
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
    ).populate(
      "recruiter",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.json(job);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// CREATE JOB
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== "recruiter") {
        return res.status(403).json({
          message:
            "Only recruiters can post jobs"
        });
      }

      const {
        title,
        company,
        location,
        salary,
        description,
        skills
      } = req.body;

      if (
        !title ||
        !company ||
        !location ||
        !salary ||
        !description ||
        !skills
      ) {
        return res.status(400).json({
          message: "All fields are required"
        });
      }

      const job = await Job.create({
        title,
        company,
        location,
        salary,
        description,
        skills,
        recruiter: req.user.id
      });

      res.status(201).json(job);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

// DELETE JOB
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {

      const job = await Job.findById(
        req.params.id
      );

      if (!job) {
        return res.status(404).json({
          message: "Job not found"
        });
      }

      if (
        job.recruiter.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message: "Not authorized"
        });
      }

      await Job.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Job deleted successfully"
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

module.exports = router;