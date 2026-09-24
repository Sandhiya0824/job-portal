import {
  useEffect,
  useState
} from "react";

import axios from "axios";

function Applications() {

  const [applications,
    setApplications] =
    useState([]);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const token =
    localStorage.getItem("token");

    const updateStatus = async (applicationId, status) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/applications/${applicationId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application._id === applicationId
          ? {
              ...application,
              status: response.data.application.status
            }
          : application
      )
    );

    alert(response.data.message);
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Failed to update status"
    );
  }
};

  useEffect(() => {

    const fetchApplications =
      async () => {

        try {

          let url = "";

          if (
            user?.role ===
            "recruiter"
          ) {

            url =
              "http://localhost:5000/api/applications/recruiter";

          } else {

            url =
              "http://localhost:5000/api/applications/my";

          }

          const response =
            await axios.get(
              url,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          setApplications(
            response.data
          );

        } catch (error) {

          console.log(error);

        }

      };

    fetchApplications();

  }, [token, user?.role]);

  return (
    <div className="page">

      <h1>
        {user?.role ===
        "recruiter"
          ? "Job Applicants"
          : "My Applications"}
      </h1>

      {applications.length === 0 ? (

        <p>
          No applications found.
        </p>

      ) : (

        <div className="application-list">

          {applications.map(
            application => (

              <div
                className="application-card"
                key={
                  application._id
                }
              >

                <h2>
                  {application.job?.title}
                </h2>

                <h3>
                  {application.job?.company}
                </h3>

                {user?.role ===
                  "recruiter" && (

                  <>
                    <p>
                      Applicant:
                      {" "}
                      {
                        application
                          .applicant
                          ?.name
                      }
                    </p>

                    <p>
                      Email:
                      {" "}
                      {
                        application
                          .applicant
                          ?.email
                      }
                    </p>
                  </>
                )}

                <p>
  Status:
  <select
    value={application.status}
    onChange={(e) =>
      updateStatus(
        application._id,
        e.target.value
      )
    }
  >
    <option value="Applied">Applied</option>
    <option value="Shortlisted">Shortlisted</option>
    <option value="Rejected">Rejected</option>
  </select>
</p>

                <p>
                  Applied:
                  {" "}
                  {new Date(
                    application.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Applications;