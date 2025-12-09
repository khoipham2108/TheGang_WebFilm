import React from "react";
import UserProfile from "../../Componets/ProfilepageDesign/UserProfile";
import { ModalProvider } from "../../Componets/MainPageDesign/ModalContext";
import ChatButton from "../../Componets/ChatButton";

const ProfilePage: React.FC = () => {
	return (
		<ModalProvider>
			<UserProfile />
			<ChatButton />

		</ModalProvider>
	);
};

export default ProfilePage;
