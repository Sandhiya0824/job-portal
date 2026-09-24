import { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/jobs"
      );

      setJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const applyJob = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to apply");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/applications/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Application failed"
      );
    }
  };

  const searchText = search.trim().toLowerCase();

  const filteredJobs = jobs.filter((job) => {
    return (
      job.title?.toLowerCase().includes(searchText) ||
      job.company?.toLowerCase().includes(searchText) ||
      job.location?.toLowerCase().includes(searchText) ||
      job.skills?.some((skill) =>
        skill.toLowerCase().includes(searchText)
      )
    );
  });

  return (
    <div className="page">
      <h1>Find Your Dream Job</h1>

      <input
        className="search"
        type="text"
        placeholder="Search job, company, location or skill..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="job-grid">
        {filteredJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div
              className="job-card"
              key={job._id}
            >
              <h2>{job.title}</h2>

              <h3>{job.company}</h3>

              <p>📍 {job.location}</p>

              <p>💰 {job.salary}</p>

              <p>{job.description}</p>

              <p>
                <strong>Skills:</strong>{" "}
                {job.skills.join(", ")}
              </p>

              {user?.role === "jobseeker" && (
                <button
                  onClick={() =>
                    applyJob(job._id)
                  }
                >
                  Apply Now
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Jobs;