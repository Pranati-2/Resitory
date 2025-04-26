import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Info, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">About Repository</h1>
            <p className="text-lg text-gray-600">
              A platform to discover and share curated learning paths with resources from across the web
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary-500" />
                What is Repository?
              </h2>
              
              <p className="text-gray-700 mb-4">
                Repository is a web-based platform that helps learners find structured learning paths on any topic. Unlike traditional course platforms, Repository doesn't host content itself—instead, it aggregates free resources from around the web into coherent learning paths.
              </p>
              
              <p className="text-gray-700 mb-4">
                Whether you're learning programming, design, data science, or any other skill, Repository helps you find the best free videos, articles, and other resources organized in a logical sequence.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Key Features:</h3>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Create custom learning paths with resources from anywhere on the web</li>
                <li>Search for learning paths by topic, skill level, or content type</li>
                <li>Save and track your progress through learning paths</li>
                <li>Share your knowledge by creating paths for others</li>
                <li>Discover high-quality content curated by the community</li>
              </ul>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-700 italic">
                  "To democratize education by organizing the web's best free learning resources into structured, accessible paths for everyone."
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 mr-3">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Browse Learning Paths</h3>
                    <p className="mt-1 text-sm text-gray-600">Explore our curated collection of learning paths on the home page.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 mr-3">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Find What Interests You</h3>
                    <p className="mt-1 text-sm text-gray-600">Use search and filters to narrow down to topics you want to learn.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 mr-3">
                    3
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Create Your Own Path</h3>
                    <p className="mt-1 text-sm text-gray-600">Share your expertise by creating learning paths for others to follow.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                  Start exploring learning paths →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect With Us</h2>
              
              <div className="flex flex-wrap gap-4 justify-center mt-6">
                <a href="#" className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
                <a href="#" className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span>Twitter</span>
                </a>
                <a href="#" className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn</span>
                </a>
                <a href="mailto:info@example.com" className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Mail className="h-5 w-5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}