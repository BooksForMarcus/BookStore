import React from 'react'
import AdminMain from '../components/Admin/AdminMain';

function AdminHomeView({user}) {
    return (
        <div>
            <AdminMain user={user}/>	
        </div>
    );
}

export default AdminHomeView;
