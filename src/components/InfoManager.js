import { collection, doc, getDocs, addDoc, deleteDoc, updateDoc, query, orderBy, getCountFromServer } from "firebase/firestore";
import { db } from '../firebase.js';

export function loadInfo(){
    const q = query(collection(db, "infos"), orderBy("order"));
    return new Promise((resolve) => {
        let infos = [];
        const unsubscribe = async() => {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                infos.push({
                    id: doc.id,
                    ...doc.data()
                  });
              });
            resolve(infos);
        }
        return unsubscribe();
    });
}

export async function addInfo(title, content){
    // Add a new document with a generated id.
    const coll = collection(db, "infos");
    const snapshot = await getCountFromServer(coll);
    const order = snapshot.data().count + 1;

    const docRef = await addDoc(collection(db, "infos"), {
      content: content,
      title: title,
      order: order
    });
    console.log("Document written with ID: ", docRef.id);
}

export async function updateInfo(id, title, content){
    const docRef = doc(db, "infos", id);
    
    // Set the "capital" field of the city 'DC'
    await updateDoc(docRef, {
      title: title,
      content: content
    });
}

export async function deleteInfo(id){
    await deleteDoc(doc(db, "infos", id));
}