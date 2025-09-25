import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  MessageCircle,
  Phone,
  Video,
  MoreHorizontal,
  Bell,
  BellOff,
  UserMinus,
  Flag,
  Camera,
  Music,
  FileText,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
} from "lucide-react";

export default function ProfilePage() {
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("media");
  const [userProfile, setUserProfile] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("user-own-profile");
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile");
        }

        setUserProfile(duplicatesetter(data.user));
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);
  const duplicatesetter = (data) => {
    return {
      email: data.email,
      username: data.fullname, // prefer fullname
      avatar: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      status: "Available",
      phone: data.phone || "Not provided",
      lastSeen: "Recently",
      joinDate: data.createdAt
        ? new Date(data.createdAt).toDateString()
        : "Unknown",
      location: "Unknown",
      mutualFriends: 0,
      recentActivity: [
        { id: 1, action: "Joined the platform", time: "1 week ago" },
        { id: 2, action: "Updated profile", time: "2 days ago" },
      ],
    };
  };

  const mediaItems = [
    {
      id: 1,
      type: "image",
      url: "/placeholder.svg?height=100&width=100&text=Photo1",
    },
    {
      id: 2,
      type: "image",
      url: "/placeholder.svg?height=100&width=100&text=Photo2",
    },
    {
      id: 3,
      type: "video",
      url: "/placeholder.svg?height=100&width=100&text=Video1",
    },
    {
      id: 4,
      type: "image",
      url: "/placeholder.svg?height=100&width=100&text=Photo3",
    },
    {
      id: 5,
      type: "image",
      url: "/placeholder.svg?height=100&width=100&text=Photo4",
    },
    {
      id: 6,
      type: "video",
      url: "/placeholder.svg?height=100&width=100&text=Video2",
    },
  ];

  if (loading) {
    return <p className="p-4">Loading profile...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  if (!userProfile) {
    return <p className="p-4">No profile data available.</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header Card */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader className="p-0">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-r from-purple-900 to-blue-900 rounded-t-lg overflow-hidden">
              <img
                src={userProfile.coverImage || "/placeholder.svg"}
                alt="Cover"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 hover:bg-black/70"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-gray-900">
                    <AvatarImage
                      src={userProfile.avatar || "/placeholder.svg"}
                      alt={userProfile.userProfile}
                    />
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center ">
                    <h1 className="text-3xl font-bold text-white">
                      {userProfile.userProfile}
                    </h1>
                  </div>
                  <div style={{ paddingTop: "30px" }}>
                    <p className="text-gray-400 mb-1">{userProfile.username}</p>
                    <p className="text-gray-300 mb-2">{userProfile.status}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {userProfile.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {userProfile.joinDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800 bg-transparent"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800 bg-transparent"
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - userProfile Info */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">
                  Contact Info
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{userProfile.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    Last seen {userProfile.lastSeen}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">
                  Quick Actions
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:bg-gray-800"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <BellOff className="w-4 h-4 mr-3" />
                  ) : (
                    <Bell className="w-4 h-4 mr-3" />
                  )}
                  {isMuted ? "Unmute notifications" : "Mute notifications"}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:bg-gray-800"
                >
                  <Users className="w-4 h-4 mr-3" />
                  View mutual friends ({userProfile.mutualFriends})
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:bg-gray-800"
                >
                  <Star className="w-4 h-4 mr-3" />
                  Add to favorites
                </Button>
                <Separator className="bg-gray-700" />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:bg-red-900/20"
                >
                  <UserMinus className="w-4 h-4 mr-3" />
                  Block user
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:bg-red-900/20"
                >
                  <Flag className="w-4 h-4 mr-3" />
                  Report user
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex gap-4">
                  <Button
                    variant={activeTab === "media" ? "default" : "ghost"}
                    onClick={() => setActiveTab("media")}
                    className={
                      activeTab === "media" ? "bg-blue-600" : "text-gray-400"
                    }
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Media
                  </Button>
                  <Button
                    variant={activeTab === "activity" ? "default" : "ghost"}
                    onClick={() => setActiveTab("activity")}
                    className={
                      activeTab === "activity" ? "bg-blue-600" : "text-gray-400"
                    }
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Activity
                  </Button>
                  <Button
                    variant={activeTab === "files" ? "default" : "ghost"}
                    onClick={() => setActiveTab("files")}
                    className={
                      activeTab === "files" ? "bg-blue-600" : "text-gray-400"
                    }
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Files
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === "media" && (
                  <div className="grid grid-cols-3 gap-2">
                    {mediaItems.map((item) => (
                      <div
                        key={item.id}
                        className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={`Media ${item.id}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-2">
                              <Video className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div>
                          <p className="text-gray-300">{activity.action}</p>
                          <p className="text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "files" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <FileText className="w-8 h-8 text-blue-400" />
                      <div className="flex-1">
                        <p className="text-gray-300">Project_Proposal.pdf</p>
                        <p className="text-sm text-gray-500">
                          2.4 MB • 3 days ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <Music className="w-8 h-8 text-green-400" />
                      <div className="flex-1">
                        <p className="text-gray-300">favorite_song.mp3</p>
                        <p className="text-sm text-gray-500">
                          5.2 MB • 1 week ago
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
