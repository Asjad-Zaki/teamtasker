
export const getPriorityColor = (priority: string) => {
  const colors = {
    high: "bg-red-500",
    medium: "bg-yellow-500", 
    low: "bg-green-500"
  };
  return colors[priority as keyof typeof colors] || "bg-gray-500";
};

export const getLabelColor = (label: string) => {
  const colors = {
    backend: "bg-blue-100 text-blue-800",
    frontend: "bg-green-100 text-green-800",
    design: "bg-purple-100 text-purple-800",
    testing: "bg-orange-100 text-orange-800",
    api: "bg-cyan-100 text-cyan-800",
    ui: "bg-pink-100 text-pink-800",
    security: "bg-red-100 text-red-800",
    qa: "bg-yellow-100 text-yellow-800",
    setup: "bg-gray-100 text-gray-800",
    devops: "bg-indigo-100 text-indigo-800",
    realtime: "bg-teal-100 text-teal-800",
    mobile: "bg-rose-100 text-rose-800"
  };
  return colors[label as keyof typeof colors] || "bg-gray-100 text-gray-800";
};
