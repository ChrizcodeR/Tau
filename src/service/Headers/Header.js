
let token = (window.localStorage.getItem('token')) || null;

export const HeaderPost = {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
};

