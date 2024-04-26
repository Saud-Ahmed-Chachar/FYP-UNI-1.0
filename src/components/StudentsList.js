import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../backend/firebase-fetchingDB';
import { useLocation } from 'react-router-dom';
import Modal from './Modal'; // Import the Modal component
import InputModal from './InputModal'; // Import the InputModal component

const StudentsList = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const data = location.state || {};
  const universityUrl = data.universityUrl || 'defaultURL';
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [currentApplicantId, setCurrentApplicantId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [applicantStatuses, setApplicantStatuses] = useState({});

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
        const newApplicants = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          sNo: index + 1,
          ...doc.data(),
          appliedAt: doc.data().appliedAt ? doc.data().appliedAt.toDate().toLocaleString() : 'N/A',
          status: doc.data().status || 'Pending', // Ensure you are fetching the status
        }));
        setApplicants(newApplicants);

        const newStatuses = {};
        newApplicants.forEach(applicant => {
          newStatuses[applicant.id] = applicant.status; // Store the status in local state
        });
        setApplicantStatuses(newStatuses);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [universityUrl]); // Depend on universityUrl to refetch when it changes

  const handleAccept = async (applicantId) => {
    setProcessingId(applicantId);
    try {
      const applicantRef = doc(db, `applications/${universityUrl}/applicants`, applicantId);
      await updateDoc(applicantRef, { status: 'Accepted' });
      setApplicantStatuses(prev => ({ ...prev, [applicantId]: 'Accepted' }));
    } catch (error) {
      console.error('Failed to accept applicant:', error);
    }
    setProcessingId(null);
  };

  const handleReject = async (reason) => {
    if (currentApplicantId && reason) {
      setProcessingId(currentApplicantId);
      try {
        const applicantRef = doc(db, `applications/${universityUrl}/applicants`, currentApplicantId);
        await updateDoc(applicantRef, {
          status: 'Rejected',
          rejectionReason: reason
        });
        setApplicantStatuses(prev => ({ ...prev, [currentApplicantId]: 'Rejected' }));
      } catch (error) {
        console.error('Failed to reject applicant:', error);
      }
      setIsRejectModalOpen(false);
      setProcessingId(null);
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
    }
  };

  return (
    <div>
      <h1>Applicants for {universityUrl.replace(/_/g, '.')}</h1>
      <table className="min-w-full table-auto">
        <thead className="bg-blue-800 text-white" style={{
        background: 'linear-gradient(to right, rgb(36, 18, 101) 0%, rgb(0, 130, 203) 100%)',
        boxSizing: 'border-box'
        }}>
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
                {applicantStatuses[applicant.id] === 'Pending' ? (
                  <>
                    <button onClick={() => handleAccept(applicant.id)} disabled={processingId === applicant.id} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2">
                      Accept
                    </button>
                    <button onClick={() => handleOpenRejectModal(applicant.id)} disabled={processingId === applicant.id} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                      Reject
                    </button>
                  </>
                ) : (
                  <span className={`font-bold py-1 px-2 rounded ${applicantStatuses[applicant.id] === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                    {applicantStatuses[applicant.id]}
                  </span>
                )}
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
          <div className="grid grid-cols-2 gap-4 mt-2">


          <strong>CNIC Front:</strong>
      <a href={selectedUserData.uploadedFiles.cnicFrontCertificate} target="_blank" rel="noopener noreferrer">
        <img src={selectedUserData.uploadedFiles.cnicFrontCertificate} alt="CNIC Front" style={{ width: '100%' }} />
      </a>

        <strong>CNIC Back:</strong>
      <a href={selectedUserData.uploadedFiles.cnicBackCertificate} target="_blank" rel="noopener noreferrer">
        <img src={selectedUserData.uploadedFiles.cnicBackCertificate} alt="CNIC Back" style={{ width: '100%' }} />
      </a>
  
      <strong>Domicile:</strong>
      <a href={selectedUserData.uploadedFiles.domicile} target="_blank" rel="noopener noreferrer">
        <img src={selectedUserData.uploadedFiles.domicile} alt="Domicile" style={{ width: '100%' }} />
      </a>
          

           <strong>Hope Certificate:</strong>
             <a href={selectedUserData.uploadedFiles.hopeCertificate} target="_blank" rel="noopener noreferrer"> 
             <img src={selectedUserData.uploadedFiles.hopeCertificate} alt="HopeCertificate" style={{ width: '100%' }}/>
             </a>
             
            <strong>Last Degree:</strong>
             <a href={selectedUserData.uploadedFiles.lastDegree} target="_blank" rel="noopener noreferrer"><img src={selectedUserData.uploadedFiles.lastDegree} alt="lastDegree" style={{ width: '100%' }}/></a>

            <strong>Matric Degree:</strong> 
            <a href={selectedUserData.uploadedFiles.matricDegree} target="_blank" rel="noopener noreferrer"><img src={selectedUserData.uploadedFiles.matricDegree} alt="matricDegree" style={{ width: '100%' }}/></a>

            <strong>Passport Size Photo:</strong>
             <a href={selectedUserData.uploadedFiles.passportSizePhoto} target="_blank" rel="noopener noreferrer"><img src={selectedUserData.uploadedFiles.passportSizePhoto} alt="passportSizePhoto" style={{ width: '100%' }}/></a>
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
