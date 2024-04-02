import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc,getDoc } from 'firebase/firestore';
import { db } from '../backend/firebase-fetchingDB';
import { useLocation } from 'react-router-dom';
import Modal from './Modal'; // Import the Modal component
import InputModal from './InputModal'; // Import the InputModal component

const StudentsList = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const data = location.state || {};
  const universityUrl = data.universityUrl || 'defaultURL';
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
const [currentApplicantId, setCurrentApplicantId] = useState(null);

const handleOpenRejectModal = (applicantId) => {
  setCurrentApplicantId(applicantId);
  setIsRejectModalOpen(true);
};

  useEffect(() => {
    const fetchApplicants = async () => {
      if (universityUrl === 'defaultURL') {
        console.warn("Default URL detected, skipping fetch.");
        return;
      }

      const applicantsRef = collection(db, `applications/${universityUrl}/applicants`);
      try {
        const querySnapshot = await getDocs(applicantsRef);
        setApplicants(querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          sNo: index + 1,
          ...doc.data(),
          appliedAt: doc.data().appliedAt ? doc.data().appliedAt.toDate().toLocaleString() : 'N/A',
        })));
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [universityUrl]);

  const handleAccept = async (applicantId) => {
    const applicantRef = doc(db, `applications/${universityUrl}/applicants`, applicantId);
    await updateDoc(applicantRef, {
      status: 'Accepted'
    });
    // Optionally, perform actions after acceptance, e.g., showing a confirmation message.
  };
  const handleReject = async (reason) => {
    if (currentApplicantId && reason) {
      const applicantRef = doc(db, `applications/${universityUrl}/applicants`, currentApplicantId);
      await updateDoc(applicantRef, {
        status: 'Rejected',
        rejectionReason: reason
      });
      // Reset current applicant ID and close modal
      setCurrentApplicantId(null);
      setIsRejectModalOpen(false);
      // Optionally, perform actions after rejection, e.g., showing a confirmation message
    }
  };
  

  const viewDetails = async (applicant) => {
    const userRef = doc(db, `users/${applicant.userEmail}`);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      setSelectedUserData(docSnap.data());
      setIsModalOpen(true);
    } else {
      console.log("No such document!");
      // Handle the case where the document does not exist
    }
  };

  return (
    <div>
      <h1>Applicants for {universityUrl.replace(/_/g, '.')}</h1>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">S.No</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Applied At</th>
            <th className="px-4 py-2 text-left">Details</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant.id} className="border-t">
              <td className="px-4 py-2">{applicant.sNo}</td>
              <td className="px-4 py-2">{applicant.userEmail}</td>
              <td className="px-4 py-2">{applicant.appliedAt}</td>
              <td className="px-4 py-2">
                <button onClick={() => viewDetails(applicant)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                  View Details
                </button>
              </td>
              <td className="px-4 py-2 flex justify-start items-center">
                <button onClick={() => handleAccept(applicant.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2">
                  Accept
                </button>
                <button onClick={() => handleOpenRejectModal(applicant.id)} className="...">
  Reject
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && selectedUserData && (
  <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
    {/* Displaying fetched user details */}
    <h3 className="text-lg font-semibold">Profile Data</h3>
    <p><strong>Full Name:</strong> {selectedUserData.profileData.fullName}</p>
    <p><strong>Email:</strong> {selectedUserData.profileData.email}</p>
    <p><strong>CNIC:</strong> {selectedUserData.profileData.cnic}</p>
    <p><strong>Date of Birth:</strong> {selectedUserData.profileData.dateOfBirth}</p>
    <p><strong>Father/Husband Name:</strong> {selectedUserData.profileData.fatherOrHusbandName}</p>
    <p><strong>Gender:</strong> {selectedUserData.profileData.gender}</p>
    <p><strong>Guardian's Name:</strong> {selectedUserData.profileData.guardiansName}</p>
    <p><strong>Has Disability:</strong> {selectedUserData.profileData.hasDisability}</p>
    <p><strong>Government Servant:</strong> {selectedUserData.profileData.isGovernmentServant}</p>
    <p><strong>Marital Status:</strong> {selectedUserData.profileData.maritalStatus}</p>
    <p><strong>Phone Number:</strong> {selectedUserData.profileData.phoneNumber}</p>
    <p><strong>Relation With Guardian:</strong> {selectedUserData.profileData.relationWithGuardian}</p>
    <p><strong>Religion:</strong> {selectedUserData.profileData.religion}</p>

    <h3 className="text-lg font-semibold mt-4">Education Data</h3>
    <p><strong>Country:</strong> {selectedUserData.educationData.country}</p>
    <p><strong>Degree Type:</strong> {selectedUserData.educationData.degreeType}</p>
    <p><strong>Grade/CGPA:</strong> {selectedUserData.educationData.gradeCGPA}</p>
    <p><strong>Institute:</strong> {selectedUserData.educationData.institute}</p>
    <p><strong>Last Degree:</strong> {selectedUserData.educationData.lastDegree}</p>
    <p><strong>Passing Year:</strong> {selectedUserData.educationData.passingYear}</p>
    <p><strong>Percentage:</strong> {selectedUserData.educationData.percentage}</p>


  <h3 className="text-lg font-semibold mt-4">Uploaded Documents</h3>
    <div className="mt-2">
      <p><strong>CNIC Front:</strong> <a href={selectedUserData.uploadedFiles.cnicFrontCertificate} target="_blank" rel="noopener noreferrer">View</a></p>
      <p><strong>CNIC Back:</strong> <a href={selectedUserData.uploadedFiles.cnicBackCertificate} target="_blank" rel="noopener noreferrer">View</a></p>
      <p><strong>Domicile:</strong> <a href={selectedUserData.uploadedFiles.domicile} target="_blank" rel="noopener noreferrer">View</a></p>
      <p><strong>Hope Certificate:</strong> <a href={selectedUserData.uploadedFiles.hopeCertificate} target="_blank" rel="noopener noreferrer">View</a></p>
      <p><strong>Last Degree:</strong> <a href={selectedUserData.uploadedFiles.lastDegree} target="_blank" rel="noopener noreferrer">View</a></p>
      <p><strong>Matric Degree:</strong> <a href={selectedUserData.uploadedFiles.matricDegree} target="_blank" rel="noopener noreferrer">View</a></p>
      <p><strong>Passport Size Photo:</strong> <a href={selectedUserData.uploadedFiles.passportSizePhoto} target="_blank" rel="noopener noreferrer">View</a></p>
    </div>
  </Modal>
)}

<InputModal
  isOpen={isRejectModalOpen}
  onClose={() => setIsRejectModalOpen(false)}
  onSubmit={handleReject}
  title="Enter Rejection Reason"
>
  <label>Please enter the reason for rejection:</label>
</InputModal>
    </div>
  );
};

export default StudentsList;
