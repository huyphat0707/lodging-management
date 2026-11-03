"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/components/providers/LanguageProvider";
import { usePropertyContext } from "@/components/providers/PropertyContext";
import { 
  BookOpen, 
  Building2, 
  Home, 
  Users, 
  FileText, 
  CreditCard, 
  HelpCircle,
  ChevronRight,
  Info
} from "lucide-react";

export default function GuidePage() {
  const { t, language } = useI18n();
  const { selectedPropertyType } = usePropertyContext();
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic titles and labels based on PropertyType
  const getPropertyTypeName = () => {
    if (selectedPropertyType === "Boarding") return language === "vi" ? "Nhà trọ" : "Boarding House";
    if (selectedPropertyType === "Hotel") return language === "vi" ? "Khách sạn / Nhà nghỉ" : "Hotel / Motel";
    return language === "vi" ? "Homestay" : "Homestay";
  };

  const getWorkflowSteps = () => {
    if (selectedPropertyType === "Boarding") {
      return [
        { step: "1", label: language === "vi" ? "Tạo Cơ Sở" : "Create Property", desc: language === "vi" ? "Khai báo khu nhà trọ (VD: Nhà trọ Bình Tân)" : "Declare boarding house..." },
        { step: "2", label: language === "vi" ? "Thêm Phòng" : "Add Rooms", desc: language === "vi" ? "Nhập số phòng trọ, cấu hình đơn giá điện nước" : "Enter room number & utility units" },
        { step: "3", label: language === "vi" ? "Thêm Khách" : "Add Tenant", desc: language === "vi" ? "Nhập thông tin người thuê trọ (CCCD, SĐT)" : "Enter tenant contact info (ID, Phone)" },
        { step: "4", label: language === "vi" ? "Ký Hợp Đồng" : "Create Contract", desc: language === "vi" ? "Tạo hợp đồng thuê trọ dài hạn & tiền đặt cọc" : "Create long-term contract & deposit" },
        { step: "5", label: language === "vi" ? "Xuất Hóa Đơn" : "Generate Invoice", desc: language === "vi" ? "Chốt số điện nước hàng tháng & thu tiền" : "Record monthly meters & collect" },
      ];
    }
    if (selectedPropertyType === "Hotel") {
      return [
        { step: "1", label: language === "vi" ? "Khai Báo Khách Sạn" : "Declare Hotel", desc: language === "vi" ? "Nhập thông tin cơ sở khách sạn/nhà nghỉ" : "Enter hotel/motel property details" },
        { step: "2", label: language === "vi" ? "Cấu Hình Hạng Phòng" : "Configure Room Types", desc: language === "vi" ? "Khai báo hạng phòng (Standard, Deluxe) & giá ngày/giờ" : "Set room types (Deluxe, Suite) & hourly/daily rates" },
        { step: "3", label: language === "vi" ? "Nhập Thông Tin Khách" : "Enter Guest Details", desc: language === "vi" ? "Ghi nhận thông tin khách đặt phòng lưu trú" : "Enter guest profiles & check-in details" },
        { step: "4", label: language === "vi" ? "Check-in / Đặt Phòng" : "Check-in Booking", desc: language === "vi" ? "Tạo thông tin lưu trú, ngày nhận & trả phòng" : "Create guest booking record & check-in" },
        { step: "5", label: language === "vi" ? "Thanh Toán & Hóa Đơn" : "Check-out Invoice", desc: language === "vi" ? "Xuất hóa đơn thanh toán khi khách check-out" : "Generate total invoice upon guest check-out" },
      ];
    }
    // Homestay
    return [
      { step: "1", label: language === "vi" ? "Tạo Homestay" : "Create Homestay", desc: language === "vi" ? "Nhập thông tin chuỗi/khu Homestay" : "Enter Homestay property profiles" },
      { step: "2", label: language === "vi" ? "Cấu Hình Bungalow/Giường" : "Configure Rooms/Beds", desc: language === "vi" ? "Khai báo các phòng ngủ, Bungalow hoặc giường Dorm" : "Declare bedroom layouts, Bungalows or Dorm beds" },
      { step: "3", label: language === "vi" ? "Đăng Ký Khách Du Lịch" : "Register Tourist", desc: language === "vi" ? "Nhập thông tin đoàn khách hoặc khách lẻ" : "Enter booking tourist list / contact info" },
      { step: "4", label: language === "vi" ? "Ghi Nhận Lịch Đặt" : "Book Calendar", desc: language === "vi" ? "Ghi lịch lưu trú, cọc giữ phòng và ngày Check-in" : "Record stay dates, pre-deposit & Check-in" },
      { step: "5", label: language === "vi" ? "Check-out & Phụ Thu" : "Check-out Bill", desc: language === "vi" ? "Tính tiền phòng, tiền giặt ủi, dọn dẹp hoặc tour" : "Calculate room rate, laundry, cleaning or experiences" },
    ];
  };

  const tabs = [
    { id: "overview", label: language === "vi" ? "Tổng quan" : "Overview", icon: HelpCircle },
    { id: "properties", label: language === "vi" ? "Cơ sở lưu trú" : "Properties", icon: Building2 },
    { id: "rooms", label: language === "vi" ? "Quản lý phòng" : "Rooms", icon: Home },
    { id: "tenants", label: language === "vi" ? "Khách hàng" : "Tenants", icon: Users },
    { id: "contracts", label: language === "vi" ? (selectedPropertyType === "Boarding" ? "Hợp đồng" : "Đặt phòng / Lưu trú") : (selectedPropertyType === "Boarding" ? "Contracts" : "Bookings"), icon: FileText },
    { id: "billing", label: language === "vi" ? "Hóa đơn & Thanh toán" : "Billing & Payments", icon: CreditCard },
  ];

  return (
    <AppLayout>
      <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 md:px-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {language === "vi" ? `Hướng dẫn sử dụng (${getPropertyTypeName()})` : `User Guide (${getPropertyTypeName()})`}
            </h2>
          </div>
          <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-2xl">
            {language === "vi" 
              ? `Hướng dẫn chi tiết từng bước để quản lý vận hành mô hình ${getPropertyTypeName()} hiệu quả trên hệ thống HypStay.` 
              : `Detailed step-by-step guide to efficiently manage and operate your ${getPropertyTypeName()} on HypStay.`}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-150 dark:border-zinc-800 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-650/10"
                    : "text-zinc-550 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6 space-y-6">
          {activeTab === "overview" && (
            <Card className="border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-zinc-50 dark:border-zinc-800/50 pb-5">
                <CardTitle className="text-xl flex items-center gap-2 text-zinc-900 dark:text-white">
                  <HelpCircle className="h-5 w-5 text-emerald-500" />
                  {language === "vi" ? `Luồng vận hành 5 bước của ${getPropertyTypeName()}` : `5-Step ${getPropertyTypeName()} Workflow`}
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400">
                  {language === "vi" 
                    ? "Hãy làm theo trình tự dưới đây để bắt đầu vận hành hệ thống một cách tối ưu nhất."
                    : "Follow this sequence to start operating the system effectively."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
                  {getWorkflowSteps().map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-5 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-800/50 relative shadow-sm hover:shadow transition-shadow duration-200">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white mb-3 shadow-md shadow-emerald-650/20">
                        {item.step}
                      </div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{item.label}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex gap-4">
                  <Info className="h-5 w-5 text-emerald-650 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold text-emerald-800 dark:text-emerald-400">
                      {language === "vi" ? "Lưu ý mô hình:" : "Model Info:"}
                    </p>
                    <p className="text-zinc-650 dark:text-zinc-300 mt-1.5 leading-relaxed">
                      {selectedPropertyType === "Boarding" && (
                        language === "vi" 
                          ? "Mô hình Nhà trọ được tối ưu hóa cho thuê dài hạn, hỗ trợ quản lý chi tiết chỉ số công tơ điện nước và tự động tính tiền phòng định kỳ mỗi tháng."
                          : "The Boarding House model is optimized for long-term rentals, supporting detailed tracking of electricity/water meters and automated monthly rent generation."
                      )}
                      {selectedPropertyType === "Hotel" && (
                        language === "vi" 
                          ? "Mô hình Khách sạn / Nhà nghỉ tối ưu hóa việc quản lý phòng theo ngày/giờ, check-in, check-out nhanh chóng và phụ thu các dịch vụ gia tăng lúc trả phòng."
                          : "The Hotel / Motel model is optimized for daily/hourly stays, quick check-in, check-out processes, and calculations of add-on services upon checkout."
                      )}
                      {selectedPropertyType === "Homestay" && (
                        language === "vi" 
                          ? "Mô hình Homestay hỗ trợ đặt chỗ linh hoạt cho nhóm du lịch, quản lý lịch biểu chi tiết cùng các gói dịch vụ phụ như dọn dẹp, giặt ủi, hoặc tour du lịch bản địa."
                          : "The Homestay model supports flexible group bookings, detailed calendar views, and add-on hospitality services like cleaning, laundry, or local tours."
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "properties" && (
            <Card className="border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-zinc-900 dark:text-white">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                  {language === "vi" ? `Cơ sở ${getPropertyTypeName()}` : `${getPropertyTypeName()} Properties`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                <p>
                  {selectedPropertyType === "Boarding" && (
                    language === "vi" 
                      ? "Cơ sở lưu trú nhà trọ là toàn bộ tòa nhà hoặc khu đất của bạn (ví dụ: Nhà trọ Quận 7). Bạn có thể cấu hình đơn giá điện nước mặc định chung cho cả cơ sở."
                      : "A boarding house property is your entire building or zone (e.g. Boarding House District 7). You can configure default electricity/water prices for the whole property."
                  )}
                  {selectedPropertyType === "Hotel" && (
                    language === "vi" 
                      ? "Cơ sở khách sạn/nhà nghỉ chứa các tầng phòng, sảnh đón khách. Bạn sẽ cài đặt thông tin địa chỉ, mô tả và chính sách giá chung."
                      : "A hotel property contains floors of rooms and lobbies. You will set the address, description, and overall pricing policies."
                  )}
                  {selectedPropertyType === "Homestay" && (
                    language === "vi" 
                      ? "Cơ sở Homestay đại diện cho các biệt thự hoặc căn hộ lớn (ví dụ: Da Lat Pine Homestay) nơi du khách sẽ lưu trú ngắn hạn."
                      : "A Homestay property represents large villas or multi-bedroom suites (e.g. Da Lat Pine Homestay) where guests reside short-term."
                  )}
                </p>
                <div className="space-y-3 p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-150 dark:border-zinc-800/30">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{language === "vi" ? "Cách tạo cơ sở mới:" : "How to create a property:"}</h4>
                  <ul className="list-decimal list-inside space-y-2.5 pl-1 text-zinc-500 dark:text-zinc-400">
                    <li>{language === "vi" ? "Chọn Cơ sở lưu trú ở menu bên trái." : "Select Properties in the left sidebar."}</li>
                    <li>{language === "vi" ? "Nhấp chọn Thêm cơ sở." : "Click Add Property."}</li>
                    <li>{language === "vi" ? `Chọn đúng loại hình là ${getPropertyTypeName()} và điền các thông tin địa chỉ.` : `Select the correct type as ${getPropertyTypeName()} and enter the address details.`}</li>
                    <li>{language === "vi" ? "Nhấn Lưu để bắt đầu cấu hình danh sách phòng." : "Click Save to start configuring the rooms list."}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "rooms" && (
            <Card className="border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-zinc-900 dark:text-white">
                  <Home className="h-5 w-5 text-emerald-500" />
                  {language === "vi" ? `Quản lý Phòng / Giường của ${getPropertyTypeName()}` : `Managing Rooms & Beds`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                <p>
                  {selectedPropertyType === "Boarding" && (
                    language === "vi"
                      ? "Phòng trọ là phòng đơn lẻ được thuê lâu dài. Mỗi phòng trọ cần chốt chỉ số công tơ điện nước riêng biệt hàng tháng để lập hóa đơn."
                      : "A boarding room is rented long-term. Each room requires independent recording of electricity/water meters to generate invoices."
                  )}
                  {selectedPropertyType === "Hotel" && (
                    language === "vi"
                      ? "Phòng khách sạn là các phòng đơn, phòng đôi hoặc Suite. Bạn có thể định nghĩa mức giá khác nhau tùy thuộc hạng phòng (Standard, Superior, Deluxe)."
                      : "Hotel rooms are single, double, or suite layouts. You can specify different prices based on room categories (Standard, Superior, Deluxe)."
                  )}
                  {selectedPropertyType === "Homestay" && (
                    language === "vi"
                      ? "Phòng homestay có thể là các Bungalow nguyên căn, phòng ngủ riêng hoặc giường đơn trong phòng Dorm (phòng ngủ tập thể)."
                      : "Homestay rooms can be entire Bungalows, private bedrooms, or individual beds in a Dorm room (shared bedroom layout)."
                  )}
                </p>
                <div className="space-y-3 p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-150 dark:border-zinc-800/30">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{language === "vi" ? "Cấu hình chi tiết phòng:" : "Room Configuration Details:"}</h4>
                  <ul className="list-disc list-inside space-y-2.5 pl-1 text-zinc-500 dark:text-zinc-400">
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200">{language === "vi" ? "Giá phòng:" : "Room rate:"} </strong>
                      {selectedPropertyType === "Boarding" 
                        ? (language === "vi" ? "Nhập giá thuê theo tháng cố định." : "Enter a fixed monthly rent rate.")
                        : (language === "vi" ? "Nhập giá thuê tiêu chuẩn theo ngày/đêm." : "Enter standard daily/nightly rates.")}
                    </li>
                    {selectedPropertyType === "Boarding" && (
                      <li>
                        <strong className="text-zinc-800 dark:text-zinc-200">{language === "vi" ? "Giá điện nước:" : "Electricity/water unit prices:"} </strong>
                        {language === "vi" ? "Hệ thống tự động đồng bộ từ cơ sở nhưng bạn vẫn có thể tùy chỉnh riêng cho từng phòng." : "Synced automatically from properties but fully customizable per room."}
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "tenants" && (
            <Card className="border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-zinc-900 dark:text-white">
                  <Users className="h-5 w-5 text-emerald-500" />
                  {language === "vi" ? (selectedPropertyType === "Boarding" ? "Quản lý Khách thuê trọ" : "Quản lý Khách lưu trú") : "Guest & Tenant profiles"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                <p>
                  {selectedPropertyType === "Boarding" && (
                    language === "vi"
                      ? "Khách thuê trọ là những người ký hợp đồng thuê trọ lâu dài. Bạn cần thu thập đầy đủ CCCD/CMND để khai báo lưu trú tạm vắng với chính quyền địa phương."
                      : "Boarding tenants rent long-term. You should collect ID numbers and contact details to register local residency."
                  )}
                  {selectedPropertyType === "Hotel" && (
                    language === "vi"
                      ? "Khách khách sạn là những khách lưu trú ngắn hạn theo ngày hoặc giờ. Bạn chỉ cần ghi nhận thông tin liên lạc và giấy tờ tùy thân của người đại diện nhận phòng."
                      : "Hotel guests reside short-term by day or hour. You only need to record contact details and identification documents for the primary guest."
                  )}
                  {selectedPropertyType === "Homestay" && (
                    language === "vi"
                      ? "Khách homestay là các nhóm du lịch, gia đình đi nghỉ dưỡng. Nên lưu lại SĐT liên hệ và email để gửi các thông tin hướng dẫn check-in tự động."
                      : "Homestay guests are tourist groups, families. Keep their phone and email to send self check-in guides."
                  )}
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === "contracts" && (
            <Card className="border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-zinc-900 dark:text-white">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  {selectedPropertyType === "Boarding"
                    ? (language === "vi" ? "Quản lý Hợp đồng thuê trọ" : "Lease Contracts")
                    : (language === "vi" ? "Thông tin Đặt phòng / Check-in" : "Room Bookings / Check-in")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                <p>
                  {selectedPropertyType === "Boarding" && (
                    language === "vi"
                      ? "Hợp đồng thiết lập liên kết pháp lý giữa khách trọ và phòng trọ. Định rõ ngày thanh toán hàng tháng, kỳ hạn hợp đồng và số tiền đặt cọc giữ phòng."
                      : "Lease contracts establish legal agreements between tenants and rooms. Specify monthly billing dates, lease duration, and safety deposits."
                  )}
                  {selectedPropertyType === "Hotel" && (
                    language === "vi"
                      ? "Hồ sơ check-in ghi nhận thời gian nhận phòng thực tế, số lượng khách và các yêu cầu phụ thu (ăn sáng, thêm giường) của khách đặt phòng."
                      : "Check-in records log actual check-in time, occupancy list, and surcharge additions (breakfast, extra bed) for the booking."
                  )}
                  {selectedPropertyType === "Homestay" && (
                    language === "vi"
                      ? "Đặt phòng homestay ghi nhận thông tin đặt lịch trên các nền tảng (AirBnB, Booking.com hoặc trực tiếp), số tiền cọc giữ chỗ và quy định nhận phòng."
                      : "Homestay bookings record reservation dates across platforms (AirBnB, Booking.com, or direct), safety deposits, and house rules."
                  )}
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card className="border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-zinc-900 dark:text-white">
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                  {language === "vi" ? "Hóa đơn & Thanh toán" : "Invoices & Payments"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                {selectedPropertyType === "Boarding" ? (
                  <div className="space-y-4">
                    <p>
                      {language === "vi"
                        ? "Hóa đơn nhà trọ được tính định kỳ mỗi tháng, kết hợp tiền thuê phòng cố định và tiền điện nước theo chỉ số công tơ thực tế."
                        : "Boarding invoices are computed monthly, combining fixed room rent and actual electricity/water consumption from meter readings."}
                    </p>
                    <div className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-150 dark:border-zinc-800/30 space-y-3">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{language === "vi" ? "Công thức tính hóa đơn nhà trọ:" : "Invoice formula:"}</h4>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        {language === "vi"
                          ? "Tổng hóa đơn = Tiền phòng + (Chỉ số điện mới - cũ) * Giá điện + (Chỉ số nước mới - cũ) * Giá nước + Phí dịch vụ (rác, wifi, vệ sinh)."
                          : "Total invoice = Room Rent + (New Elec - Old Elec) * Elec Price + (New Water - Old Water) * Water Price + Add-on Services (wifi, trash, cleaning)."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p>
                      {language === "vi"
                        ? "Hóa đơn dịch vụ ngắn hạn được lập tại thời điểm khách check-out thanh toán phòng. Cộng gộp tiền phòng theo ngày/giờ và tiền dịch vụ phụ thu."
                        : "Short-term invoices are generated upon guest check-out, accumulating room fees by hours/days and any additional service usage."}
                    </p>
                    <div className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-150 dark:border-zinc-800/30 space-y-3">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{language === "vi" ? "Các mục tính tiền check-out:" : "Check-out Invoice details:"}</h4>
                      <ul className="list-disc list-inside space-y-2 text-zinc-500 dark:text-zinc-400">
                        <li>{language === "vi" ? "Tổng tiền phòng (Số ngày lưu trú * Đơn giá phòng)" : "Room Rent Subtotal (Number of days * Room rate)"}</li>
                        <li>{language === "vi" ? "Phí phụ thu (Nhận phòng sớm, trả phòng muộn, thêm người)" : "Surcharges (Early check-in, late check-out, extra guest)"}</li>
                        <li>{language === "vi" ? "Tiền dịch vụ phát sinh (Nước uống mini-bar, giặt ủi, thuê xe, ăn uống)" : "Add-on charges (Mini-bar drinks, laundry, bike rental, meals)"}</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
