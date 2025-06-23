import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './globals.css'

export const metadata = {
  title: 'Imag.e - Face Recognition',
  description: 'Group B face recognition web application',
  icons: {
    icon: '/assets/Icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-primary min-h-screen w-full font-poppins flex flex-col">
        <div className="flex flex-col min-h-screen w-full bg-primary overflow-x-hidden">
          {/* Header/Navbar */}
          <header className="sm:px-16 px-6 flex justify-center items-center">
            <div className="xl:max-w-[1280px] w-full">
              <Navbar />
            </div>
          </header>
          {/* Main content */}
          <main className="flex-1 flex justify-center items-start">
            <div className="xl:max-w-[1280px] w-full">
              {children}
            </div>
          </main>
          {/* Footer */}
          <footer className="sm:px-16 px-6 flex justify-center items-center">
            <div className="xl:max-w-[1280px] w-full">
              <Footer />
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
