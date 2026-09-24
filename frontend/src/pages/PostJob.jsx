import {
  useState
} from "react";

import axios from "axios";

import {
  useNavigate
} from "react-router-dom";

function PostJob() {

  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      title: "",
      company: "",
      location: "",
      salary: "",
      description: "",
      skills: ""
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        alert(
          "Please login first"
        );

        navigate("/login");

        return;
      }

      try {

        await axios.post(
          "http://localhost:5000/api/jobs",
          {
            ...formData,
            skills:
              formData.skills
                .split(",")
                .map(skill =>
                  skill.trim()
                )
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        alert(
          "Job posted successfully"
        );

        navigate("/");

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Failed to post job"
        );

      }

    };

  return (
    <div className="form-page">

      <div className="form-box">

        <h2>
          Post a New Job
        </h2>

        <form
          onSubmit={handleSubmit}
        >

          <input
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <input
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            name="skills"
            placeholder="Skills: React, Node.js, MongoDB"
            value={formData.skills}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Post Job
          </button>

        </form>

      </div>

    </div>
  );
}

export default PostJob;