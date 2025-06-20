import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../index.css'

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
      <body className="bg-primary w-full overflow-hidden">
        <div className="bg-primary w-full overflow-hidden">
          <div className="sm:px-16 px-6 flex justify-center items-center">
            <div className="xl:max-w-[1280px] w-full">
              <Navbar />
            </div>
          </div>
          
          <div className="flex justify-center items-start bg-primary">
            <div className="xl:max-w-[1280px] w-full">
              {children}
            </div>
          </div>
          
          <div className="sm:px-16 px-6 flex justify-center items-center bg-primary">
            <div className="xl:max-w-[1280px] w-full">
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
