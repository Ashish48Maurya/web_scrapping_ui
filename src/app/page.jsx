"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Shield, AlertTriangle, Package, Building2, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import Link from "next/link"

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const uniqueVendors = useMemo(() => {
    return new Set(searchResults.map((software) => software.vendor_name)).size
  }, [searchResults])

  const totalVuln = useMemo(() => {
    return searchResults.reduce((acc, curr) => acc + Number(curr.no_of_vuln || 0), 0)
  }, [searchResults])

  const handleSearch = async () => {
    if (searchTerm === "") {
      toast.error("Please enter a software name")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/tool?tool=${searchTerm}`, {
        method: "GET",
      })
      const data = await res.json()
      setSearchResults(data)
    } catch (err) {
      toast.error(`Error while searching for software: ` + err.message)
    } finally {
      setIsLoading(false)
      setSearchTerm("")
    }
  }

  const handleSetting = (software) => {
    // setLink(software.vuln_link)
    // setNo_of_vuln(software.no_of_vuln)
    localStorage.setItem('link', software.vuln_link);
    localStorage.setItem('vuln_link', software.no_of_vuln);
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const setLink = (link) => {
    localStorage.setItem('vendor_link', link);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-4 mb-12">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Shield className="h-16 w-16 mx-auto text-indigo-600 mb-4" />
            <h1 className="text-4xl font-bold text-white tracking-tight">Software Vulnerability Scanner</h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-md lg:text-lg">
              Search and discover vulnerabilities across different software products and vendors
            </p>
          </motion.div>
        </div>

        <div className="relative mb-8 flex">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-indigo-600" />
          </div>
          <Input
            type="search"
            placeholder="Search software by name..."
            className="pl-12 h-12 text-xl text-white rounded-l-xl border-indigo-400 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl bg-black/80 backdrop-blur-sm p-6 shadow-xl border border-indigo-400"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Package className="h-6 w-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-black font-bold">Total Products</p>
                  <p className="text-2xl font-bold text-indigo-600">{searchResults.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="text-sm text-black font-bold">Total Vulnerabilities</p>
                  <p className="text-2xl font-bold text-amber-600">{totalVuln}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Building2 className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm text-black font-bold">Unique Vendors</p>
                  <p className="text-2xl font-bold text-purple-600">{uniqueVendors}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12 font-semibold text-lg lg:text-xl">#</TableHead>
                  <TableHead className="font-semibold text-lg lg:text-xl">Product Name</TableHead>
                  <TableHead className="font-semibold text-lg lg:text-xl">Vendor Name</TableHead>
                  <TableHead className="text-center font-semibold text-lg lg:text-xl">Vulnerabilities</TableHead>
                  <TableHead className="font-semibold text-lg lg:text-xl">Product Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p>Searching for results...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : searchResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Search className="h-8 w-8 mb-2" />
                        <p>No results found. Try searching for a software name.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  searchResults.map((software) => (
                    <TableRow key={software.serial_no} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className=" font-bold text-md lg:text-lg">{software.serial_no}</TableCell>
                      <TableCell className=" font-bold text-md lg:text-lg text-indigo-600 hover:text-indigo-800 cursor-pointer">
                        <Link href={software.product_link} target="_blank" rel="noopener noreferrer">
                          {software.product_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-bold text-md lg:text-lg">
                        <Link href='/vendor' target="_blank" rel="noopener noreferrer" onClick={() => setLink(software.vendor_link)}>
                          {software.vendor_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`
                            inline-flex h-8 w-8 items-center justify-center rounded-full 
                            ${software.no_of_vuln > 3 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}
                            font-bold text-md lg:text-lg
                          `}
                        >
                          <Link
                            href='/details'
                            onClick={() => handleSetting(software)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {software.no_of_vuln}
                          </Link>
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-3 py-1 rounded-full font-bold text-md lg:text-lg bg-gray-100 text-gray-700">
                          {software.prd_type}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}