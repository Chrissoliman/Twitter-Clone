import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate(
      "from",
      "username profileImg"
    );

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted succefully" });
  } catch (error) {
    console.log("Error in deleteNotifications controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.to.toString() !== userId.toString()) {
    return res.status(404).json({ error: "You are not allowed to delete this notification" });
    }

    await Notification.deleteOne({ _id: id });

    res.status(200).json({ message: "Notification deleted succefully" });
  } catch (error) {
    console.log("Error in deleteNotification controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
