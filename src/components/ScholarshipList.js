import React, { useState } from 'react';
import scholarshipsData from '../scholarshipsData.json'; // Assuming the data is exported from a .js file

const ScholarshipList = () => {
  const [scholarships, setScholarships] = useState(scholarshipsData);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold my-4">Scholarship List</h1>
      <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}> {/* Set max height and overflow */}
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">S.No</th>
              <th className="px-4 py-2">Logo</th>
              <th className="px-4 py-2">Scholarship Name</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((scholarship, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2"><img src={scholarship.Image} alt={scholarship.Title} className="w-20 h-20 object-contain mx-auto" /></td>
                <td className="border px-4 py-2">{scholarship.Title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScholarshipList;
