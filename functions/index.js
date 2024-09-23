// functions/index.js

// ... existing imports and initialization

exports.generateSharedLink = functions.https.onCall(async (data, context) => {
  // ... existing code

  const { fileId, expiration } = data; // expiration in hours

  // ... existing code

  // Calculate expiration timestamp
  const expirationTimestamp = expiration
    ? Date.now() + expiration * 60 * 60 * 1000
    : null;

  // ... existing code
});
// functions/index.js

// ... existing imports and initialization

exports.versionFile = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const bucketName = object.bucket;
  const fileName = filePath.split("/").pop();
  const folderPath = filePath.split("/").slice(1, -1).join("/") || "root";

  // Ignore versioned files
  if (filePath.startsWith("files/versions/")) {
    return null;
  }

  const userId = filePath.split("/")[1]; // Assuming files are stored as files/{userId}/{folderPath}/{fileName}
  if (!userId) {
    console.log("User ID not found in file path.");
    return null;
  }

  const fileRef = db.collection("files")
    .where("uid", "==", userId)
    .where("name", "==", fileName)
    .where("folderPath", "==", folderPath);

  const snapshot = await fileRef.get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return null;
  }

  snapshot.forEach(async (doc) => {
    const versionedPath = `files/versions/${userId}/${folderPath}/${fileName}-${Date.now()}`;
    const bucket = gcs.bucket(bucketName);
    const file = bucket.file(filePath);
    const versionedFile = bucket.file(versionedPath);

    // Copy the file to the versions folder
    await file.copy(versionedFile);
    console.log(`Versioned file created at: ${versionedPath}`);

    // Update Firestore with the new version
    await db.collection("files").doc(doc.id).update({
      versions: admin.firestore.FieldValue.arrayUnion({
        version: Date.now(),
        url: `gs://${bucketName}/${versionedPath}`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    });

    console.log(`Updated Firestore document with version: ${doc.id}`);
  });

  return null;
});
