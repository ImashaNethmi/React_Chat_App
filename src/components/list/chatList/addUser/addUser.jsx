import { useState } from "react";
import "./addUser.css";
import { db } from "../../../lib/firebase";
import { 
    collection, query, where, getDocs, setDoc, doc, 
    serverTimestamp, updateDoc, arrayUnion 
} from "firebase/firestore";
import { useUserStore } from "../../../lib/userStore";

const AddUser = () => {
    const [user, setUser] = useState(null);
    const { currentUser } = useUserStore(); 

    
    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        if (!username) return;

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setUser({
                    id: querySnapshot.docs[0].id, 
                    ...querySnapshot.docs[0].data()
                });
            } else {
                setUser(null);
            }
        } catch (err) {
            console.log("Error searching user:", err);
        }
    };

    
    const handleAdd = async () => {
        if (!user || !currentUser) return;

        const chatRef = doc(collection(db, "chats")); 
        const userChatsRef = collection(db, "userchats");

        try {
         
            await setDoc(chatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            
            await setDoc(doc(userChatsRef, user.id), { chats: [] }, { merge: true });
            await updateDoc(doc(userChatsRef, user.id), {
                chats: arrayUnion({
                    chatID: chatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    receiverName: currentUser.username, 
                    updatedAt: Date.now(), 
                }),
            });

            
            await setDoc(doc(userChatsRef, currentUser.id), { chats: [] }, { merge: true });
            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatID: chatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    receiverName: user.username, 
                    updatedAt: Date.now(), 
                }),
            });

            console.log("User added successfully!");
        } catch (err) {
            console.log("Error adding user:", err);
        }
    };

    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button type="submit">Search</button>
            </form>
            {user && (
                <div className="user">
                    <div className="detail">
                        <img src={user.avatar || "/avatar.png"} alt="User Avatar" />
                        <span>{user.username}</span>
                    </div>
                    <button onClick={handleAdd}>Add User</button>
                </div>
            )}
        </div>
    );
};

export default AddUser;
