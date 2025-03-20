import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MemberEdit.css";

const MemberEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { member } = location.state || {};

  const [editedMember, setEditedMember] = useState(member);

  useEffect(() => {
    if (!member) {
      navigate("/members");
    }
  }, [member, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/members/${editedMember._id}`;  // Use the environment variable for API URL
      console.log("Saving member data:", url);

      const response = await axios.put(url, {
        phone: editedMember.phone,
        memberCategory: editedMember.memberCategory,
      });

      if (response.status === 200) {
        alert("Member updated successfully");
        navigate("/members");
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving member:", error.message);
      alert(`Failed to save changes: ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate("/members");
  };

  if (!editedMember) return <div>Loading...</div>;

  return (
    <div className="member-edit-page">
      <h2>Edit Member</h2>
      <div className="edit-form">
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={editedMember.phone || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Member Category:</label>
          <select
            name="memberCategory"
            value={editedMember.memberCategory || ""}
            onChange={handleInputChange}
          >
            <option value="Good">Good</option>
            <option value="Middle">Middle</option>
            <option value="Bad">Bad</option>
          </select>
        </div>
        <div className="buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MemberEdit;
