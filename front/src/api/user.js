import axios from 'axios';

const API_BASE_URL = 'http://localhost:10000/api/user';

export const registerUser = async (form) => {
    const formData = new FormData();
    formData.append('userId', form.userId);
    formData.append('password', form.password);
    formData.append('email', form.email);
    formData.append('name', form.name);
    formData.append('nickname', form.nickname);
    if (form.profileImage) {
        formData.append('profileImage', form.profileImage);
    }

    if (form.profileImage) {
        formData.append('profileImage', form.profileImage);
    }

    const response = await axios.post(`${API_BASE_URL}/register`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};
