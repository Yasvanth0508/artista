import { useOutletContext } from 'react-router-dom';
import { UserProfile } from '../../types';
import EditProfileModal from './EditProfileModal';

const ProfilePage = () => {
    const { currentUser, handleUpdateProfile } = useOutletContext<{
        currentUser: UserProfile | null;
        handleUpdateProfile: (updatedUser: UserProfile) => void;
    }>();

    if (!currentUser) return <div>Loading profile...</div>;

    return (
        <EditProfileModal
            user={currentUser}
            onClose={() => window.history.back()} // close modal
            onSave={handleUpdateProfile} // <-- parent state gets updated
        />
    );
};

export default ProfilePage;
