import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Info, Lock, Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

const Contact = () => {
    return (
        <div className="section section-hidden">
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
                        <p className="text-lg text-gray-600">Get in touch with Brightwood Academy</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <MapPin className="text-2xl text-blue-600 mr-4 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Address</h4>
                                        <p className="text-gray-600">123 Education Street<br />Learning City, LC 12345</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Phone className="text-2xl text-blue-600 mr-4 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Phone</h4>
                                        <p className="text-gray-600">(555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Mail className="text-2xl text-blue-600 mr-4 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Email</h4>
                                        <p className="text-gray-600">info@brightwoodacademy.edu</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Lock className="text-2xl text-blue-600 mr-4 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Office Hours</h4>
                                        <p className="text-gray-600">Monday - Friday: 8:00 AM - 4:00 PM<br />Saturday: 9:00 AM - 12:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div className="text-center">
                                    <Info className="text-4xl text-blue-600 mb-4" />
                                    <h4 className="text-lg font-semibold text-blue-800 mb-2">Demo Contact Form</h4>
                                    <p className="text-blue-700 text-sm mb-4">This is a sample contact form for demonstration purposes. In a real implementation, this would connect to a backend service to send emails.</p>

                                    <form action="">
                                        <Input type="text" placeholder="Name" className="mb-4" />
                                        <Input type="email" placeholder="Email" className="mb-4" />
                                        <Textarea placeholder="Message" className="mb-4" />
                                        <Button type="submit" className="w-full">Send Message</Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact