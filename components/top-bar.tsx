"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Info, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="ComicSage Logo" width={48} height={48} />
          <span className="font-bold text-xl text-stone-800 dark:text-stone-100">ComicSage</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/me"
            className="text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-50 transition-colors"
          >
            My Library
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-50"
              >
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>About ComicSage</SheetTitle>
                <SheetDescription>
                  ComicSage transforms complex educational topics into engaging, easy-to-understand comics. Perfect for
                  visual learners and students of all ages.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <p>
                  Created to make learning more accessible and enjoyable, ComicSage uses AI to generate educational
                  comics that break down difficult concepts into digestible visual stories.
                </p>
                <p>
                  Whether you&apos;re studying science, history, math, or any other subject, our comics help you grasp and
                  remember information more effectively.
                </p>
              </div>
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-2 md:hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetContent side="right">
            <div className="flex flex-col h-full">
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col space-y-6 mt-8">
                <Link href="/me" className="text-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                  My Library
                </Link>
                <Link href="#about" className="text-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
