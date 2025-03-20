import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface RegistrationLayoutProps {
  children: ReactNode
  instructions: ReactNode
}

export function RegistrationLayout({ children, instructions }: RegistrationLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-lato">
      {/* 移动端布局 */}
      <div className="flex flex-col min-h-screen md:hidden">
        <motion.div 
          className="bg-white w-full min-h-[40vh] flex items-end relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute right-0 top-0 opacity-[0.05] transform translate-x-1/4 translate-y-1/4">
            <Image
              src="/images/logo.png"
              alt="Background Logo"
              width={400}
              height={400}
              className="w-auto h-auto"
            />
          </div>
          <div className="fixed top-6 left-6 z-50 flex items-center gap-2">
          <Image
              src="/images/embark.png"
              alt="v5Embark Logo"
              width={32}
              height={32}
              className="w-auto h-auto inline"
            />
            <span className="text-xl text-gray-900">v5Embark</span>
          </div>
          <div className="w-full pt-24 flex justify-center px-6 pb-8 relative">
            <div className="w-full max-w-md">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/images/typeface.png"
                  alt="V5团队 Logo"
                  width={45}
                  height={15}
                  className="h-5 w-auto"
                />
              </div>
              <div className="space-y-4 font-lato">
                {instructions}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="flex-1 bg-gray-50 flex justify-center px-6 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            {children}
          </div>
        </motion.div>
      </div>

      {/* 桌面端布局 */}
      <div className="hidden md:flex h-screen">
        {/* 左侧说明面板 */}
        <motion.div 
          className="w-3/5 flex items-center justify-center bg-white p-8 relative overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute right-0 top-1/2 opacity-[0.05] transform translate-x-1/4 -translate-y-1/2">
            <Image
              src="/images/logo.png"
              alt="Background Logo"
              width={600}
              height={600}
              className="w-auto h-auto"
            />
          </div>
          <div className="fixed top-12 left-12 z-50 flex items-center gap-2">
          <Image
              src="/images/embark.png"
              alt="v5Embark Logo"
              width={48}
              height={48}
              className="w-auto h-auto inline"
            />
            <span className="text-2xl text-gray-900">v5Embark</span>
          </div>
          <div className="text-left max-w-lg -ml-24 relative">
            <div className="flex items-center gap-4 mb-10">
              <Image
                src="/images/typeface.png"
                alt="V5团队 Logo"
                width={72}
                height={24}
                className="h-7 w-auto"
              />
            </div>
            <div className="space-y-6">
              {instructions}
            </div>
          </div>
        </motion.div>

        {/* 右侧表单面板 */}
        <motion.div 
          className="w-1/2 flex items-center justify-center bg-gray-50 p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 