import Friend from "../friend/friend.model.js";
import {
  saveLocation,
  getNearbyUsers,
  getUserPosition,
} from "./location.service.js";

export const updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  await saveLocation(req.user.id, latitude, longitude);
  res.json({ success: true });
};

export const nearbyFriends = async (req, res) => {
  const radius = Number(req.query.radius || 5);

  const pos = await getUserPosition(req.user.id);
  if (!pos) return res.json([]);

  const [lng, lat] = pos.map(Number);

  const nearby = await getNearbyUsers(lng, lat, radius);
  // console.log(nearby);

  const friends = await Friend.find({ user: req.user.id, status: "accepted" });
  const friendIds = new Set(friends.map((f) => f.friend.toString()));

  const result = nearby
    .filter(([member]) => friendIds.has(member))
    .map(([member, distance]) => ({
      userId: member,
      distanceKm: Number(distance),
    }));
  res.json(result);
};
