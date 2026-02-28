import { useState } from "react";
import BottomNav, { type Tab } from "@/components/BottomNav";
import FeedScreen from "@/components/FeedScreen";
import MatchScreen from "@/components/MatchScreen";
import EventsScreen from "@/components/EventsScreen";
import MessagesScreen from "@/components/MessagesScreen";
import ProfileScreen from "@/components/ProfileScreen";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("feed");

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background relative">
      {activeTab === "feed" && <FeedScreen />}
      {activeTab === "match" && <MatchScreen />}
      {activeTab === "events" && <EventsScreen />}
      {activeTab === "messages" && <MessagesScreen />}
      {activeTab === "profile" && <ProfileScreen />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
