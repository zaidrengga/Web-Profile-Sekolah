"use client"

import { DataListContent } from '@/lib/data-list-content'
import { GraduationCap } from 'lucide-react'

const Home = () => {
  const { stats, purposes, facilities, achievements } = DataListContent();
  return (
    <>
      {/*Hero Section  */}
      <section className="min-h-[calc(100vh-56px)] p-6 md:p-10 relative overflow-hidden flex items-center bg-gradient-to-tr from-[#a8edea] to-[#fed6e3]">

        <div className="relative w-full flex flex-col md:flex-row justify-between items-center gap-10 px-4 sm:px-6 lg:px-8">
          {/* Text content */}
          <div className="text-center md:text-left flex-1">
            <div className="animate-bounce mb-6">
              <div className="inline-block p-4 backdrop-blur border border-white bg-background/20 rounded-full">
                <GraduationCap size={48} className="text-secondary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {process.env.NEXT_PUBLIC_APP_NAME}
              <span className="block text-2xl sm:text-3xl md:text-4xl font-light">
                Sekolah Keunggulan
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto md:mx-0">
              Dimana mimpi terwujud dan masa depan terbentuk melalui pendidikan inovatif dan bimbingan penuh kasih sayang
            </p>
          </div>

          {/* Stats cards with hover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-lg w-full flex-1">
            {stats.map((item, index) => (
              <div
                key={index}
                className="backdrop-blur border border-white bg-background/20 rounded-2xl p-4 sm:p-6 space-y-2 text-center
              transition duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto transition-transform duration-300 hover:rotate-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold">{item.value}</h3>
                <p className="text-sm sm:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Tujuan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dipandu oleh visi, didorong oleh misi, bersatu dalam keunggulan
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {purposes.map((item, idx) => (
              <div
                key={idx}
                className={`card-float bg-gradient-to-br ${item.bg} rounded-3xl p-10 border transition duration-500 ease-in-out transform hover:-translate-y-3 hover:shadow-2xl`}
              >
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.iconBg} rounded-full flex items-center justify-center mx-auto mb-8 transition-transform duration-500 hover:scale-110`}>
                    {item.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-6">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{item.desc}</p>
                </div>
              </div>

            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Fasilitas Preminium</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Infrastruktur canggih yang dirancang untuk pembelajaran abad ke-21</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition duration-300 transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br rounded-xl flex items-center justify-center mx-auto mb-6 ${item.bg} transition-transform duration-300 hover:rotate-12`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>

            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Keunggulan Siswa</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Merayakan pencapaian luar biasa dan bakat luar biasa</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {achievements.map((item, idx) => (
              <div key={idx} className={`bg-gradient-to-br rounded-3xl p-8 text-white relative overflow-hidden ${item.gradient}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative text-center">
                  {item.icon}
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-yellow-100 mb-4">{item.subtitle}</p>
                  <p className="text-sm font-medium">{item.student}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}

export default Home