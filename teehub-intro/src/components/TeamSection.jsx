import React from "react";
import { Heart, Award, Users } from "lucide-react";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Long",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description:
        "Visionary leader với 8+ năm kinh nghiệm trong ngành thời trang",
    },
    {
      name: "Nam",
      role: "Creative Director",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      description:
        "Chuyên gia thiết kế, tạo nên những sản phẩm độc đáo và sáng tạo",
    },
    {
      name: "Tân",
      role: "Head of Production",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description:
        "Đảm bảo chất lượng sản phẩm và quy trình sản xuất hiệu quả",
    },
    {
      name: "Vũ",
      role: "Marketing Manager",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
      description:
        "Chuyên gia marketing, kết nối thương hiệu với khách hàng",
    },
    {
      name: "My",
      role: "Marketing Manager",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
      description:
        "Chuyên gia marketing, kết nối thương hiệu với khách hàng",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Gặp gỡ đội ngũ của chúng tôi
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Những con người đứng sau sự thành công của TeeHub
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                className="w-full h-48 object-cover"
                src={member.image}
                alt={member.name}
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sky-500 font-medium">{member.role}</p>
                <p className="mt-3 text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
