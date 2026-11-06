"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveCard = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// This check ensures we don't accidentally initialize the app more than once.
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * Recursively copies a document and all of its subcollections within a batch.
 * @param sourceRef The source document reference.
 * @param destRef The destination document reference.
 * @param batch The Firestore write batch.
 */
async function recursiveCopy(sourceRef, destRef, batch) {
    const docSnap = await sourceRef.get();
    if (docSnap.exists) {
        batch.set(destRef, docSnap.data());
        const collections = await sourceRef.listCollections();
        for (const collection of collections) {
            const docs = await collection.get();
            for (const doc of docs.docs) {
                // Important: Await the recursive call for each sub-document
                await recursiveCopy(doc.ref, destRef.collection(collection.id).doc(doc.id), batch);
            }
        }
    }
}
/**
 * Recursively deletes a document and all of its subcollections within a batch.
 * @param docRef The document reference to delete.
 * @param batch The Firestore write batch.
 */
async function recursiveDelete(docRef, batch) {
    const collections = await docRef.listCollections();
    for (const collection of collections) {
        const docs = await collection.get();
        for (const doc of docs.docs) {
            // Important: Await the recursive call for each sub-document
            await recursiveDelete(doc.ref, batch);
        }
    }
    batch.delete(docRef);
}
/**
 * A callable function to move a card and its subcollections from one group to another.
 */
exports.moveCard = functions.https.onCall(async (data, context) => {
    // 1. **Security:** Authentication is now required.
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated to move cards.");
    }
    const { sourceGroupId, destGroupId, cardId } = data;
    // 2. **Validation:** Ensure all required data is present.
    if (!sourceGroupId || !destGroupId || !cardId) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required data: sourceGroupId, destGroupId, or cardId.");
    }
    functions.logger.info(`Request to move card ${cardId} from group ${sourceGroupId} to ${destGroupId} by user ${context.auth.uid}.`);
    const sourceCardRef = db.collection("kanban-groups").doc(sourceGroupId).collection("cards").doc(cardId);
    const destCardRef = db.collection("kanban-groups").doc(destGroupId).collection("cards").doc(cardId);
    try {
        const batch = db.batch();
        // 3. **Execution:** Copy, then delete, within a single atomic batch.
        await recursiveCopy(sourceCardRef, destCardRef, batch);
        await recursiveDelete(sourceCardRef, batch);
        // 4. **Commit:** Execute all operations at once.
        await batch.commit();
        functions.logger.info(`Successfully moved card ${cardId}.`);
        return { success: true, message: "Card moved successfully." };
    }
    catch (error) {
        functions.logger.error(`Error moving card ${cardId}:`, error);
        throw new functions.https.HttpsError("internal", "An error occurred while moving the card.", error.message);
    }
});
//# sourceMappingURL=cardActions.js.map