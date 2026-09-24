const express = require("express");

const Application =
  require("../models/Application");

const Job =
  require("../models/job");

const authMiddleware =
  require("../middleware/authmiddleware");

const router = express.Router();

// APPLY FOR JOB
router.post(
  "/:jobId",
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== "jobseeker") {
        return res.status(403).json({
          message:
            "Only job seekers can apply"
        });
      }

      const job = await Job.findById(
        req.params.jobId
      );

      if (!job) {
        return res.status(404).json({
          message: "Job not found"
        });
      }

      const existingApplication =
        await Application.findOne({
          job: req.params.jobId,
          applicant: req.user.id
        });

      if (existingApplication) {
        return res.status(400).json({
          message:
            "You already applied for this job"
        });
      }

      const application =
        await Application.create({
          job: req.params.jobId,
          applicant: req.user.id
        });

      res.status(201).json({
        message:
          "Application submitted successfully",
        application
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

// MY APPLICATIONS
router.get(
  "/my",
  authMiddleware,
  async (req, res) => {
    try {

      const applications =
        await Application.find({
          applicant: req.user.id
        })
          .populate("job")
          .sort({
            createdAt: -1
          });

      res.json(applications);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

// RECRUITER APPLICANTS
router.get(
  "/recruiter",
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== "recruiter") {
        return res.status(403).json({
          message:
            "Only recruiters can view applicants"
        });
      }

      const jobs = await Job.find({
        recruiter: req.user.id
      });

      const jobIds =
        jobs.map(job => job._id);

      const applications =
        await Application.find({
          job: {
            $in: jobIds
          }
        })
          .populate("job")
          .populate(
            "applicant",
            "name email"
          )
          .sort({
            createdAt: -1
          });

      res.json(applications);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can update application status"
      });
    }

    const { status } = req.body;

    if (!["Applied", "Shortlisted", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const application = await Application.findById(req.params.id)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    if (application.job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    application.status = status;

    await application.save();

    res.json({
      message: "Application status updated successfully",
      application
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;