import React from "react";

const NewsletterSection = () => {
  return (
    <section className="bg-sky-50 py-16">
      <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Đăng ký nhận bản tin
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Nhận ngay ưu đãi và cập nhật bộ sưu tập mới nhất từ TeeHub.
        </p>
        <form className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="w-full sm:w-2/3 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
