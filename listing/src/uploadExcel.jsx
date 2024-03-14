import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadExcel = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate(); // Initialize useHistory

    const handleChange = (event) => {
        setFile(event.target.files[0]);
      };
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!file) {
          alert('Please select a file.');
          return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          await axios.post('http://localhost:8081/uploadExcel', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          alert('File uploaded successfully.');
          navigate('/listing');
        } catch (error) {
          console.error('Error uploading file:', error);
          alert('Error uploading file. Please try again.');
        }
      };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadExcel;
