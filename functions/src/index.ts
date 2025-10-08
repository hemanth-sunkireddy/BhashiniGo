import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Request, Response } from "express";

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

export const sendNotifications = functions.https.onRequest(
  async (req: Request, res: Response) => {
    console.log("HTTP function triggered for notifications");

    try {
      // Example: find all users with unread alerts
      const usersSnapshot = await db
        .collection("users")
        .where("hasUnreadAlerts", "==", true)
        .get();

      for (const userDoc of usersSnapshot.docs) {
        const token = userDoc.data().fcmToken;
        if (token) {
          const message = {
            notification: {
              title: "You have a new alert!",
              body: "Check your dashboard for updates.",
            },
            token: token,
          };
          await messaging.send(message);
          console.log(`Notification sent to ${userDoc.id}`);
        } else {
          console.log(`No FCM token for user ${userDoc.id}`);
        }
      }

      res.status(200).send("Notifications sent!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error sending notifications");
    }
  }
);
