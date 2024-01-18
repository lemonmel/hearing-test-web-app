import { collection, getDocs, query, orderBy, doc, getDoc} from "firebase/firestore";
import { db } from '../firebase.js';

export function loadTest(){
    const q = query(collection(db, "test"), orderBy("date", "desc"));
    return new Promise((resolve) => {
        let tests = [];
        const unsubscribe = async() => {
            const querySnapshot = await getDocs(q);
            for (const test of querySnapshot.docs) {
                const userDetails = await loadCurrentUser(test.data().userID);
                const date = test.data().date.toDate();
    
                tests.push({
                    id: test.id,
                    username: userDetails.username,
                    email: userDetails.email,
                    environment: userDetails.environment,
                    frequency: userDetails.frequency,
                    volume: userDetails.volume,
                    ...test.data(),
                    date: date,
                });
            }
            console.log("This is loadTest"+tests);
            resolve(tests);
        }
        return unsubscribe();
    });
}

async function loadCurrentUser(userID){
    return new Promise((resolve) => {
        const unsubscribe = async() => {
            const userRef = doc(db, "users", userID);
            const userDoc = await getDoc(userRef);
            resolve(userDoc.data());
        }
        return unsubscribe();
    });
}

