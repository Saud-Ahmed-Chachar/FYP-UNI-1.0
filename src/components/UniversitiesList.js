import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../backend/firebase-fetchingDB'; // Adjust this import according to your project structure

const UniversitiesList = () => {
  const [universities, setUniversities] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "universities"));
        const universitiesArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUniversities(universitiesArray);
      } catch (error) {
        console.error("Error fetching universities: ", error);
      }
    };

    fetchUniversities();
  }, []);

  const addUniversity = async () => {
    const newUniversity = {
      logo: "https://via.placeholder.com/150",
      name: `New University ${universities.length + 1}`,
      disciplineType: "Engineering",
    };

    try {
      const docRef = await addDoc(collection(db, "universities"), newUniversity);
      setUniversities([...universities, { id: docRef.id, ...newUniversity }]);
    } catch (error) {
      console.error("Error adding university: ", error);
    }
  };

  const saveEdit = async (id) => {
    try {
      const universityRef = doc(db, "universities", id);
      await updateDoc(universityRef, { name: newName });
      setUniversities(universities.map(university =>
        university.id === id ? { ...university, name: newName } : university
      ));
      setEditingId(null);
      setNewName('');
    } catch (error) {
      console.error("Error updating university: ", error);
    }
  };

  const deleteUniversity = async (id) => {
    try {
      await deleteDoc(doc(db, "universities", id));
      setUniversities(universities.filter(university => university.id !== id));
    } catch (error) {
      console.error("Error deleting university: ", error);
    }
  };

  const filteredUniversities = universities.filter(university =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">University List</h1>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search University..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'scroll' }}> {/* Set max height and overflow */}
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-4">S.No</th>
                  <th className="pb-4">Logo</th>
                  <th className="pb-4">University Name</th>
                  <th className="pb-4">Discipline Type</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUniversities.map((university, index) => (
                  <tr key={university.id}>
                    <td className="pt-4 pb-2">{index + 1}</td>
                    <td className="pt-4 pb-2">
                      <img src={university.logo} alt="Logo" className="w-12 h-12" />
                    </td>
                    <td className="pt-4 pb-2">
                      {editingId === university.id ? (
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="p-2 border rounded"
                        />
                      ) : (
                        university.name
                      )}
                    </td>
                    <td className="pt-4 pb-2">{university.disciplineType}</td>
                    <td className="pt-4 pb-2">
                      {editingId === university.id ? (
                        <button onClick={() => saveEdit(university.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">Save</button>
                      ) : (
                        <>
                          <button onClick={() => {setEditingId(university.id); setNewName(university.name);}} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">Edit</button>
                          <button onClick={() => deleteUniversity(university.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex space-x-2 mt-4">
            <button onClick={addUniversity} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Add New University</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UniversitiesList;
