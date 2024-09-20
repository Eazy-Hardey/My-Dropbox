const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {Storage} = require("@google-cloud/storage");
const path = require("path");

admin.initializeApp();
const db = admin.firestore();
const gcs = new Storage();

exports.versionFile = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const bucketName = object.bucket;
  const fileName = path.basename(filePath);

  // Ignore versioned files
  if (filePath.startsWith("files/versions/")) {
    return null;
  }

  const userId = filePath.split("/")[1];
  if (!userId) {
    console.log("User ID not found in file path.");
    return null;
  }

  const fileRef = db.collection("files")
      .where("uid", "==", userId)
      .where("name", "==", fileName);

  const snapshot = await fileRef.get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return null;
  }

  snapshot.forEach(async (doc) => {
    const versionedPath = `files/versions/${userId}/${fileName}-${Date.now()}`;
    const bucket = gcs.bucket(bucketName);
    const file = bucket.file(filePath);
    const versionedFile = bucket.file(versionedPath);

    // Copy the file to the versions folder
    await file.copy(versionedFile);

    // Update Firestore with the new version
    await db.collection("files").doc(doc.id).update({
      versions: admin.firestore.FieldValue.arrayUnion({
        version: Date.now(),
        url: `gs://${bucketName}/${versionedPath}`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    });

    console.log(`Versioned file: ${fileName}`);
  });

  return null;
});
