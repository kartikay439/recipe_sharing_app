import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import app from "../utils/firebase";

const db = getFirestore(app);

// Step 1: Query the document based on a field value (e.g., recipeName)
const findDocumentIdByField = async (field, value) => {
  const q = query(collection(db, "user"), where(field, "==", value));  // Adjust "recipes" to your collection name
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc_ = querySnapshot.docs[0];  // Get the first matched document 
    // console.log("Document:", doc_);
    return doc_;  // Return the document 
  } else {
    console.log("No document found with the given field value.");
    return null;
  }
};

// Step 2: Fetch and update the document by field value
const updateFieldByDocumentField = async (field, value,fieldToUpdate, newValue) => {
  const doc_ = await findDocumentIdByField(field, value);
  console.log("printed document",typeof doc_.data().like)

  if (doc_) {
    const docRef = doc(db, "user", doc_.id);  // Get reference to the document using the docId

    try {
      // Step 3: Update the specific field
      await updateDoc(docRef, {
        [fieldToUpdate]:doc_.data().like+1,  // Dynamically update the specific field
      });
      console.log(`Successfully updated ${fieldToUpdate} to ${newValue}`);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }
};

export default updateFieldByDocumentField;