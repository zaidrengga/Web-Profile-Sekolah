import { School } from 'lucide-react'
import React from 'react'

const About = () => {
    return (
        <div className="section section-hidden">
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tentang {process.env.NEXT_PUBLIC_APP_NAME}</h2>
                        <p className="text-lg text-gray-600">Keunggulan dalam pendidikan sejak 1999</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Cerita Kami</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Didirikan pada tahun 1999, {process.env.NEXT_PUBLIC_APP_NAME} telah menjadi yang terdepan dalam keunggulan pendidikan selama lebih dari dua dekade. Kami percaya untuk tidak hanya mengembangkan kecemerlangan akademis, tetapi juga karakter, kreativitas, dan keterampilan berpikir kritis yang mempersiapkan siswa kami menghadapi tantangan masa depan.
                            </p>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Tim pendidik kami yang berdedikasi, fasilitas canggih, dan kurikulum inovatif menciptakan lingkungan di mana setiap siswa dapat berkembang dan mencapai potensi penuh mereka.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <h4 className="text-2xl font-bold text-blue-600">98%</h4>
                                    <p className="text-sm text-gray-600">Tingkat Kelulusan</p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <h4 className="text-2xl font-bold text-blue-600">95%</h4>
                                    <p className="text-sm text-gray-600">Penerimaan Perguruan Tinggi</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8">
                                <School className="w-16 h-16 mx-auto text-blue-600 mb-6" />
                                <h4 className="text-xl font-semibold text-gray-800">Sekolah Menengah Atas Moderwn</h4>
                                <p className="text-gray-600 mt-2">{process.env.NEXT_PUBLIC_APP_NAME} adalah sekolah menengah atas modern yang mengutamakan kualitas pendidikan.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default About