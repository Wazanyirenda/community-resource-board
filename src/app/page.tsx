import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Wrench, Coffee, Handshake, MapPin, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="text-center space-y-8 md:space-y-10">
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Get What You Need. Share What You Don't.
              <span className="text-blue-600 block sm:inline"> Build a generous community.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              Find free and low-cost items from neighbors near you and give your unused things a second life.
              Join to browse, post, and connect in minutes.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-md sm:max-w-none mx-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
                Join Free
              </Button>
            </Link>
            <Link href="/resources" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
                See What’s Nearby
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Popular ways neighbors help neighbors
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Lend tools, share books, offer a hand, or pass on extras. Small actions make a big difference.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            {
              icon: GraduationCap,
              title: "Books & Learning",
              description: "Textbooks, study materials, educational resources",
              color: "bg-purple-100 text-purple-600"
            },
            {
              icon: Wrench,
              title: "Tools & Equipment",
              description: "Power tools, gardening equipment, household items",
              color: "bg-orange-100 text-orange-600"
            },
            {
              icon: Coffee,
              title: "Food & Essentials",
              description: "Surplus food, household items, personal care",
              color: "bg-green-100 text-green-600"
            },
            {
              icon: Handshake,
              title: "Services & Skills",
              description: "Tutoring, workshops, volunteer opportunities",
              color: "bg-blue-100 text-blue-600"
            }
          ].map((category, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center mx-auto mb-6`}>
                  <category.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl font-semibold">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Start in three simple steps
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Create an account, find what you need, and connect safely with locals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: "1",
                title: "Create your account",
                description: "It’s free—set your location and interests to personalize your feed."
              },
              {
                step: "2", 
                title: "Browse or post",
                description: "Find items nearby, or list something useful you no longer need."
              },
              {
                step: "3",
                title: "Connect and pick up",
                description: "Message the poster and arrange a safe, convenient pickup."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  {feature.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="bg-blue-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Join your local sharing network
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
            Be the first to discover nearby resources and turn your extras into someone else's essentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-lg sm:max-w-none mx-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Create free account
              </Button>
            </Link>
            <Link href="/resources" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-colors">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Explore Near You
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                Community Resource Board
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Building stronger communities through resource sharing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
              <div className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <Link href="/resources" className="block hover:text-white transition-colors">
                  Browse Resources
                </Link>
                <Link href="/login" className="block hover:text-white transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Categories</h4>
              <div className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <div>Books & Learning</div>
                <div>Tools & Equipment</div>
                <div>Food & Essentials</div>
                <div>Services & Skills</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Community</h4>
              <div className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <div>Safety Guidelines</div>
                <div>Community Rules</div>
                <div>Support</div>
                <div>Feedback</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              &copy; 2025 Community Resource Board. Built with ❤️ for communities everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}